import fs from 'node:fs';

/**
 * Lightweight persistent JSON store using Upstash Redis / Vercel KV REST API
 * when configured, falling back gracefully to ephemeral /tmp storage.
 */
function getKvConfig() {
  const url = (
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    ''
  ).trim().replace(/\/+$/, '');
  const token = (
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    ''
  ).trim();
  return url && token ? { url, token } : null;
}

export function isPersistentKvConfigured() {
  return Boolean(getKvConfig());
}

export async function kvGetJson(key, tmpFallbackPath = '') {
  const kv = getKvConfig();
  if (kv) {
    try {
      const res = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${kv.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.result) {
          return typeof data.result === 'string'
            ? JSON.parse(data.result)
            : data.result;
        }
      }
    } catch {
      // fall through to tmp fallback
    }
  }

  if (tmpFallbackPath) {
    try {
      if (fs.existsSync(tmpFallbackPath)) {
        return JSON.parse(fs.readFileSync(tmpFallbackPath, 'utf-8'));
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export async function kvSetJson(key, value, tmpFallbackPath = '') {
  const serialized = JSON.stringify(value);
  const kv = getKvConfig();
  let persisted = false;

  if (kv) {
    try {
      const res = await fetch(`${kv.url}/set/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kv.token}`,
          'Content-Type': 'application/json',
        },
        body: serialized,
      });
      if (res.ok) persisted = true;
    } catch {
      // fall through to tmp fallback
    }
  }

  if (tmpFallbackPath) {
    try {
      fs.writeFileSync(tmpFallbackPath, serialized, 'utf-8');
    } catch {
      // ignore
    }
  }

  return persisted;
}
