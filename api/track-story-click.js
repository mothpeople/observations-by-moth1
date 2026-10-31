import fs from 'node:fs';
import path from 'node:path';

// Storage file paths
const LOCAL_FILE = path.join(process.cwd(), '.story-clicks.json');
const TMP_FILE = '/tmp/moth1_story_telemetry.json';

const DEFAULT_DATA = {
  issues: {
    'the-meat-grinder': {
      instagram: { clicks: 0, scroll75: 0, subscribers: 0 },
      facebook: { clicks: 0, scroll75: 0, subscribers: 0 },
    },
    'watering-grass-in-a-thunderstorm': {
      instagram: { clicks: 0, scroll75: 0, subscribers: 0 },
      facebook: { clicks: 0, scroll75: 0, subscribers: 0 },
    },
  },
  total: {
    instagram: { clicks: 0, scroll75: 0, subscribers: 0 },
    facebook: { clicks: 0, scroll75: 0, subscribers: 0 },
  },
  recent: [],
};

// In-memory cache for fast retrieval and serverless runtime warm reuse
let memoryStore = null;

export function getStoryClickStore() {
  if (memoryStore) return memoryStore;

  for (const filePath of [LOCAL_FILE, TMP_FILE]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        memoryStore = {
          issues: { ...DEFAULT_DATA.issues, ...(parsed.issues || {}) },
          total: { ...DEFAULT_DATA.total, ...(parsed.total || {}) },
          recent: Array.isArray(parsed.recent) ? parsed.recent : [],
        };
        return memoryStore;
      }
    } catch {
      // ignore
    }
  }

  memoryStore = JSON.parse(JSON.stringify(DEFAULT_DATA));
  return memoryStore;
}

export function persistStoryClickStore(data) {
  memoryStore = data;
  const jsonStr = JSON.stringify(data, null, 2);

  for (const filePath of [LOCAL_FILE, TMP_FILE]) {
    try {
      fs.writeFileSync(filePath, jsonStr, 'utf8');
    } catch {
      // ignore read-only filesystems in production
    }
  }
}

// Optional Upstash Redis / Vercel KV sync if configured
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function syncWithKV(action, key = 'moth1_story_clicks', payload = null) {
  if (!kvUrl || !kvToken) return null;
  try {
    if (action === 'get') {
      const res = await fetch(`${kvUrl}/get/${key}`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.result ? JSON.parse(json.result) : null;
      }
    } else if (action === 'set' && payload) {
      await fetch(`${kvUrl}/set/${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(JSON.stringify(payload)),
      });
    }
  } catch {
    // ignore network errors
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    let store = getStoryClickStore();
    const remote = await syncWithKV('get');
    if (remote) {
      store = remote;
      persistStoryClickStore(store);
    }
    return res.status(200).json({ success: true, ...store });
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          body = {};
        }
      }
      if (!body) body = {};

      const rawIssue = String(
        body.issue || body.slug || body.path || 'latest'
      ).toLowerCase();
      const rawSource = String(
        body.source || body.utm_source || 'social'
      ).toLowerCase();
      const medium = String(
        body.medium || body.utm_medium || 'story'
      ).toLowerCase();
      const eventType = String(
        body.eventType || body.event || 'click'
      ).toLowerCase();

      // Normalize issue key
      let issueKey = 'the-meat-grinder';
      if (
        rawIssue.includes('watering') ||
        rawIssue.includes('grass') ||
        rawIssue.includes('thunderstorm') ||
        rawIssue === 'issue-01' ||
        rawIssue === '01'
      ) {
        issueKey = 'watering-grass-in-a-thunderstorm';
      } else if (
        rawIssue.includes('meat') ||
        rawIssue.includes('grinder') ||
        rawIssue === 'issue-02' ||
        rawIssue === '02'
      ) {
        issueKey = 'the-meat-grinder';
      }

      // Normalize platform key
      const platformKey =
        rawSource.includes('facebook') || rawSource === 'fb'
          ? 'facebook'
          : 'instagram';

      let store = getStoryClickStore();
      const remote = await syncWithKV('get');
      if (remote) store = remote;

      if (!store.issues[issueKey]) {
        store.issues[issueKey] = {
          instagram: { clicks: 0, scroll75: 0, subscribers: 0 },
          facebook: { clicks: 0, scroll75: 0, subscribers: 0 },
        };
      }

      const metricField =
        eventType === 'scroll_75'
          ? 'scroll75'
          : eventType === 'subscriber'
            ? 'subscribers'
            : 'clicks';

      store.issues[issueKey][platformKey][metricField] =
        (store.issues[issueKey][platformKey][metricField] || 0) + 1;

      store.total[platformKey][metricField] =
        (store.total[platformKey][metricField] || 0) + 1;

      const eventItem = {
        issue: issueKey,
        platform: platformKey,
        source: rawSource,
        medium,
        eventType: metricField,
        timestamp: body.timestamp || new Date().toISOString(),
      };

      store.recent = [eventItem, ...(store.recent || [])].slice(0, 50);

      persistStoryClickStore(store);
      await syncWithKV('set', 'moth1_story_clicks', store);

      return res.status(200).json({ success: true, recorded: eventItem, ...store });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
