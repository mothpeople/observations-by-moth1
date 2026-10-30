import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Film,
  Filter,
  Globe,
  KeyRound,
  MessageSquare,
  Play,
  RefreshCw,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';
import CyberPanel from '../components/issue02/CyberPanel';
import { loadChannelLedger, saveChannelLedger } from '../utils/telemetry';

const APIFY_TOKEN_STORAGE_KEY = 'moth1_apify_token';
const APIFY_TARGETS_STORAGE_KEY = 'moth1_apify_targets_v2';
const OWNER_UNLOCK_STORAGE_KEY = 'moth1_owner_unlocked_v1';

const DEFAULT_TARGETS = {
  substackUrl: 'https://observationsbymoth1.substack.com',
  instagramHandle: 'moth1.siv',
  threadsHandle: 'moth1.siv',
  facebookUrl: 'https://www.facebook.com/sivaraj.pragasm',
  filterTag: '#observations',
};

const ACTORS = {
  substack: {
    id: 'automation-lab~substack-scraper',
    label: 'automation-lab/substack-scraper',
    accent: '#67e8f9',
  },
  instagram: {
    id: 'apify~instagram-scraper',
    label: 'apify/instagram-scraper',
    accent: '#fda4af',
  },
  threads: {
    id: 'automation-lab~threads-scraper',
    label: 'automation-lab/threads-scraper',
    accent: '#c084fc',
  },
  facebook: {
    id: 'apify~facebook-posts-scraper',
    label: 'apify/facebook-posts-scraper',
    accent: '#86efac',
  },
};

function matchesObservationsFilter(item, filterTag = '#observations') {
  const rawText = `${item.caption || ''} ${item.text || ''} ${item.title || ''} ${item.subtitle || ''}`;
  const rawHashtags = Array.isArray(item.hashtags)
    ? item.hashtags.join(' ')
    : '';
  const haystack = `${rawText} ${rawHashtags}`.toLowerCase();

  const normalizedTag = (filterTag || '#observations').trim().toLowerCase();
  const tagWithoutHash = normalizedTag.replace(/^#/, '');

  if (normalizedTag && haystack.includes(normalizedTag)) return true;
  if (
    Array.isArray(item.hashtags) &&
    item.hashtags.some(
      (h) => String(h).toLowerCase().replace(/^#/, '') === tagWithoutHash
    )
  ) {
    return true;
  }

  return (
    haystack.includes('#observations') ||
    haystack.includes('observations.moth1.xyz') ||
    haystack.includes('observationsbymoth1') ||
    haystack.includes('observations by moth1') ||
    haystack.includes('the-meat-grinder') ||
    haystack.includes('meat grinder') ||
    haystack.includes('watering-grass-in-a-thunderstorm') ||
    haystack.includes('bread and circus')
  );
}

function normalizeSubstackItem(
  item,
  idx = 0,
  source = 'apify-substack-scraper'
) {
  const rawUrl =
    item.url ||
    item.postUrl ||
    item.canonical_url ||
    item.link ||
    DEFAULT_TARGETS.substackUrl;
  const slug =
    item.slug ||
    (rawUrl.includes('/p/')
      ? rawUrl.split('/p/')[1]?.split(/[/?#]/)[0]
      : '') ||
    `item-${idx}`;

  const wordCount =
    Number(item.wordCount ?? item.wordcount ?? item.words ?? 0) ||
    (typeof item.body === 'string'
      ? item.body.trim().split(/\s+/).length
      : typeof item.content === 'string'
        ? item.content.trim().split(/\s+/).length
        : 0);

  return {
    id: String(item.id || slug || `post-${idx}`),
    title: item.title || item.headline || item.name || 'Untitled Dispatch',
    subtitle:
      item.subtitle || item.description || item.summary || item.excerpt || '',
    slug,
    url: rawUrl,
    publishedAt:
      item.publishedAt ||
      item.post_date ||
      item.published_at ||
      item.date ||
      item.createdAt ||
      null,
    likes:
      Number(
        item.likes ??
          item.reaction_count ??
          item.reactions?.['❤'] ??
          item.reactions ??
          item.likeCount ??
          0
      ) || 0,
    comments:
      Number(
        item.comments ??
          item.comment_count ??
          item.commentsCount ??
          item.commentCount ??
          0
      ) || 0,
    restacks: Number(item.restacks ?? item.shares ?? 0) || 0,
    wordCount,
    readingTimeMinutes:
      Number(item.readingTimeMinutes ?? item.reading_time) ||
      Math.max(1, Math.round((wordCount || 600) / 200)),
    subscribers:
      Number(
        item.subscribersCount ??
          item.subscriber_count ??
          item.subscribers ??
          item.subsCount ??
          item.publication?.subscribersCount ??
          0
      ) || 0,
    source,
  };
}

function normalizeInstagramItem(item, idx = 0) {
  const shortCode = item.shortCode || item.code || '';
  const url =
    item.url ||
    (shortCode ? `https://www.instagram.com/p/${shortCode}/` : '') ||
    'https://www.instagram.com/';
  const caption =
    item.caption ||
    item.text ||
    item.alt ||
    `Instagram ${item.type || 'Post'} #${idx + 1}`;
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];
  const views =
    Number(
      item.videoPlayCount ??
        item.videoViewCount ??
        item.playCount ??
        item.viewCount ??
        item.views ??
        0
    ) || 0;
  const likes =
    Number(item.likesCount ?? item.likeCount ?? item.likes ?? 0) || 0;
  const comments =
    Number(item.commentsCount ?? item.commentCount ?? item.comments ?? 0) || 0;
  const followers =
    Number(
      item.followersCount ??
        item.ownerFollowersCount ??
        item.owner?.followersCount ??
        item.user?.followersCount ??
        item.followers ??
        0
    ) || 0;

  return {
    id: String(item.id || shortCode || `ig-${idx}`),
    type:
      item.productType === 'clips' || item.type === 'Video' || views > 0
        ? 'Reel / Video'
        : item.type || 'Post',
    caption,
    hashtags,
    url,
    publishedAt: item.timestamp || item.takenAt || item.date || null,
    views,
    likes,
    comments,
    ownerUsername: item.ownerUsername || item.username || item.owner?.username || '',
    followers,
  };
}

function normalizeThreadsItem(item, idx = 0) {
  const text =
    item.text ||
    item.caption ||
    item.content ||
    item.body ||
    item.title ||
    `Thread #${idx + 1}`;
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];
  const url =
    item.url ||
    item.postUrl ||
    item.threadUrl ||
    item.link ||
    'https://www.threads.net/';
  const likes =
    Number(
      item.likes ?? item.likeCount ?? item.likesCount ?? item.reactions ?? 0
    ) || 0;
  const replies =
    Number(
      item.replies ??
        item.replyCount ??
        item.repliesCount ??
        item.comments ??
        item.commentCount ??
        0
    ) || 0;
  const reposts =
    Number(
      item.reposts ?? item.repostCount ?? item.shares ?? item.quotes ?? 0
    ) || 0;
  const views = Number(item.views ?? item.viewCount ?? 0) || 0;
  const followers =
    Number(
      item.followersCount ??
        item.user?.followersCount ??
        item.author?.followersCount ??
        item.followers ??
        0
    ) || 0;

  return {
    id: String(item.id || item.code || `thread-${idx}`),
    text,
    hashtags,
    url,
    publishedAt:
      item.publishedAt ||
      item.timestamp ||
      item.createdAt ||
      item.date ||
      null,
    likes,
    replies,
    reposts,
    views,
    followers,
    username:
      item.username || item.author?.username || item.ownerUsername || '',
  };
}

function normalizeFacebookItem(item, idx = 0) {
  const text =
    item.text ||
    item.message ||
    item.caption ||
    item.title ||
    `Facebook Post #${idx + 1}`;
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];
  const url =
    item.url ||
    item.postUrl ||
    item.topLevelUrl ||
    item.facebookUrl ||
    'https://www.facebook.com/';
  const likes =
    Number(
      item.likes ??
        item.likesCount ??
        item.reactionsCount ??
        item.reactionCount ??
        0
    ) || 0;
  const comments =
    Number(item.comments ?? item.commentsCount ?? item.commentCount ?? 0) || 0;
  const shares =
    Number(item.shares ?? item.sharesCount ?? item.shareCount ?? 0) || 0;
  const views =
    Number(
      item.viewsCount ??
        item.videoViewCount ??
        item.playCount ??
        item.views ??
        0
    ) || 0;
  const followers =
    Number(
      item.pageFollowersCount ??
        item.pageFollowers ??
        item.followersCount ??
        item.pageLikesCount ??
        item.pageLikes ??
        item.pageInfo?.followersCount ??
        item.pageInfo?.likesCount ??
        item.user?.followersCount ??
        item.followers ??
        0
    ) || 0;

  return {
    id: String(item.postId || item.id || `fb-${idx}`),
    text,
    hashtags,
    url,
    publishedAt: item.time || item.timestamp || item.date || null,
    views,
    likes,
    comments,
    shares,
    followers,
    pageName: item.pageName || item.user?.name || '',
  };
}

async function fetchDirectActorDataset(actorId, token) {
  if (!token) return { connected: false, runInfo: null, items: [] };
  try {
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs/last?token=${encodeURIComponent(token)}`
    );
    if (!runRes.ok) {
      return { connected: false, runInfo: null, items: [] };
    }
    const runJson = await runRes.json();
    const runData = runJson?.data;
    if (!runData) {
      return { connected: false, runInfo: null, items: [] };
    }

    const runInfo = {
      id: runData.id,
      status: runData.status,
      startedAt: runData.startedAt,
      finishedAt: runData.finishedAt,
      defaultDatasetId: runData.defaultDatasetId,
    };

    let items = [];
    if (runInfo.defaultDatasetId) {
      const dsRes = await fetch(
        `https://api.apify.com/v2/datasets/${runInfo.defaultDatasetId}/items?token=${encodeURIComponent(token)}&clean=true`
      );
      if (dsRes.ok) {
        const parsed = await dsRes.json();
        if (Array.isArray(parsed)) items = parsed;
      }
    }

    return { connected: true, runInfo, items };
  } catch {
    return { connected: false, runInfo: null, items: [] };
  }
}

export default function Dashboard() {
  const [ledger, setLedger] = useState(() => loadChannelLedger());
  const [loadingSync, setLoadingSync] = useState(true);
  const [runningActor, setRunningActor] = useState(null); // 'substack' | 'instagram' | 'threads' | 'facebook' | null
  const [statusMessage, setStatusMessage] = useState('');
  const [showApifyConfig, setShowApifyConfig] = useState(false);
  const [filterOnlyObservations, setFilterOnlyObservations] = useState(true);
  const [copiedLink, setCopiedLink] = useState('');

  const [apifyToken, setApifyToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(APIFY_TOKEN_STORAGE_KEY) || '';
  });

  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if (isLocal) return true;
    return (
      window.localStorage.getItem(OWNER_UNLOCK_STORAGE_KEY) === 'true' ||
      Boolean(window.localStorage.getItem(APIFY_TOKEN_STORAGE_KEY))
    );
  });
  const [unlockInput, setUnlockInput] = useState('');
  const [unlockError, setUnlockError] = useState('');

  const [targets, setTargets] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_TARGETS;
    try {
      const raw = window.localStorage.getItem(APIFY_TARGETS_STORAGE_KEY);
      return raw ? { ...DEFAULT_TARGETS, ...JSON.parse(raw) } : DEFAULT_TARGETS;
    } catch {
      return DEFAULT_TARGETS;
    }
  });

  // Scraped Datasets State
  const [substackState, setSubstackState] = useState({
    connected: false,
    runInfo: null,
    posts: [],
    subscribers: 0,
  });
  const [instagramState, setInstagramState] = useState({
    connected: false,
    runInfo: null,
    items: [],
    followers: 0,
  });
  const [threadsState, setThreadsState] = useState({
    connected: false,
    runInfo: null,
    items: [],
    followers: 0,
  });
  const [facebookState, setFacebookState] = useState({
    connected: false,
    runInfo: null,
    items: [],
    followers: 0,
  });

  const syncAllTelemetry = useCallback(
    async (tokenOverride) => {
      setLoadingSync(true);
      const activeToken = (
        tokenOverride !== undefined ? tokenOverride : apifyToken
      ).trim();

      try {
        const headers = {};
        if (activeToken) headers['X-Apify-Token'] = activeToken;

        // Fetch server /api/analytics + direct browser Apify datasets for all 4 actors in parallel
        const [
          serverRes,
          directSubstack,
          directInstagram,
          directThreads,
          directFacebook,
        ] = await Promise.all([
          fetch('/api/analytics', { headers }).catch(() => null),
          activeToken
            ? fetchDirectActorDataset(ACTORS.substack.id, activeToken)
            : Promise.resolve(null),
          activeToken
            ? fetchDirectActorDataset(ACTORS.instagram.id, activeToken)
            : Promise.resolve(null),
          activeToken
            ? fetchDirectActorDataset(ACTORS.threads.id, activeToken)
            : Promise.resolve(null),
          activeToken
            ? fetchDirectActorDataset(ACTORS.facebook.id, activeToken)
            : Promise.resolve(null),
        ]);

        let serverJson = null;
        if (serverRes && serverRes.ok) {
          serverJson = await serverRes.json();
        }

        // 1. Merge Substack Posts
        const substackMap = new Map();
        for (const p of serverJson?.substack?.posts || []) {
          substackMap.set(p.slug || p.url || p.title, p);
        }
        for (const raw of directSubstack?.items || []) {
          const item = normalizeSubstackItem(raw, 0, 'apify-substack-scraper');
          const key = item.slug || item.url || item.title;
          const existing = substackMap.get(key);
          if (existing) {
            substackMap.set(key, {
              ...existing,
              ...item,
              likes: Math.max(existing.likes || 0, item.likes || 0),
              comments: Math.max(existing.comments || 0, item.comments || 0),
              restacks: Math.max(existing.restacks || 0, item.restacks || 0),
              wordCount: existing.wordCount || item.wordCount || 0,
              subscribers: Math.max(existing.subscribers || 0, item.subscribers || 0),
              source: 'apify+substack-merged',
            });
          } else {
            substackMap.set(key, item);
          }
        }

        const substackPosts = Array.from(substackMap.values());
        const subScraped = Math.max(
          serverJson?.substack?.subscribers || 0,
          ...substackPosts.map((p) => p.subscribers || 0)
        );

        setSubstackState({
          connected:
            Boolean(directSubstack?.connected) ||
            Boolean(serverJson?.substack?.connected),
          runInfo:
            directSubstack?.runInfo || serverJson?.substack?.runInfo || null,
          posts: substackPosts,
          subscribers: subScraped,
        });

        // 2. Instagram Items (apify/instagram-scraper)
        const igItems =
          directInstagram?.items?.length > 0
            ? directInstagram.items.map((item, i) =>
                normalizeInstagramItem(item, i)
              )
            : serverJson?.instagram?.items || [];

        const igScrapedFollowers = Math.max(
          serverJson?.instagram?.followers || 0,
          ...igItems.map((i) => i.followers || 0)
        );

        setInstagramState({
          connected:
            Boolean(directInstagram?.connected) ||
            Boolean(serverJson?.instagram?.connected),
          runInfo:
            directInstagram?.runInfo || serverJson?.instagram?.runInfo || null,
          items: igItems,
          followers: igScrapedFollowers,
        });

        // 3. Threads Items (automation-lab/threads-scraper)
        const thItems =
          directThreads?.items?.length > 0
            ? directThreads.items.map((item, i) =>
                normalizeThreadsItem(item, i)
              )
            : serverJson?.threads?.items || [];

        const thScrapedFollowers = Math.max(
          serverJson?.threads?.followers || 0,
          ...thItems.map((i) => i.followers || 0)
        );

        setThreadsState({
          connected:
            Boolean(directThreads?.connected) ||
            Boolean(serverJson?.threads?.connected),
          runInfo:
            directThreads?.runInfo || serverJson?.threads?.runInfo || null,
          items: thItems,
          followers: thScrapedFollowers,
        });

        // 4. Facebook Items (apify/facebook-posts-scraper)
        const fbItems =
          directFacebook?.items?.length > 0
            ? directFacebook.items.map((item, i) =>
                normalizeFacebookItem(item, i)
              )
            : serverJson?.facebook?.items || [];

        const fbScrapedFollowers = Math.max(
          serverJson?.facebook?.followers || 0,
          ...fbItems.map((i) => i.followers || 0)
        );

        setFacebookState({
          connected:
            Boolean(directFacebook?.connected) ||
            Boolean(serverJson?.facebook?.connected),
          runInfo:
            directFacebook?.runInfo || serverJson?.facebook?.runInfo || null,
          items: fbItems,
          followers: fbScrapedFollowers,
        });

        // Automatically persist scraped followers / subscribers to local ledger
        setLedger((prev) => {
          let changed = false;
          const next = { ...prev };
          if (igScrapedFollowers > 0 && prev.instagram?.followers !== igScrapedFollowers) {
            next.instagram = { ...prev.instagram, followers: igScrapedFollowers };
            changed = true;
          }
          if (fbScrapedFollowers > 0 && prev.facebook?.followers !== fbScrapedFollowers) {
            next.facebook = { ...prev.facebook, followers: fbScrapedFollowers };
            changed = true;
          }
          if (subScraped > 0 && prev.substackSubscribers !== subScraped) {
            next.substackSubscribers = subScraped;
            changed = true;
          }
          if (changed) {
            saveChannelLedger(next);
            return next;
          }
          return prev;
        });
      } finally {
        setLoadingSync(false);
      }
    },
    [apifyToken]
  );

  useEffect(() => {
    syncAllTelemetry();
  }, [syncAllTelemetry]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const cleanedToken = apifyToken.trim();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(APIFY_TOKEN_STORAGE_KEY, cleanedToken);
      window.localStorage.setItem(
        APIFY_TARGETS_STORAGE_KEY,
        JSON.stringify(targets)
      );
    }
    setStatusMessage(
      'Saved Apify token, channel handles & #observations filter! Syncing datasets...'
    );
    syncAllTelemetry(cleanedToken);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const buildActorPayload = (actorKey) => {
    const cleanIgHandle = targets.instagramHandle
      .replace(/^@/, '')
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
      .replace(/\/$/, '')
      .trim();
    const igUrl = `https://www.instagram.com/${cleanIgHandle}/`;

    const cleanThreadsHandle = targets.threadsHandle
      .replace(/^@/, '')
      .replace(/^https?:\/\/(www\.)?threads\.(net|com)\/@?/, '')
      .replace(/\/$/, '')
      .trim();
    const threadsUrl = `https://www.threads.net/@${cleanThreadsHandle}`;

    const rawFb = (targets.facebookUrl || DEFAULT_TARGETS.facebookUrl).trim();
    const fbUrl = rawFb.startsWith('http')
      ? rawFb
      : `https://www.facebook.com/${rawFb.replace(/^@/, '')}`;

    if (actorKey === 'substack') {
      return {
        startUrls: [{ url: targets.substackUrl }],
        publicationUrl: targets.substackUrl,
        substackUrl: targets.substackUrl,
        urls: [targets.substackUrl],
        maxItems: 25,
        maxPosts: 25,
      };
    }

    if (actorKey === 'instagram') {
      return {
        directUrls: [igUrl],
        usernames: [cleanIgHandle],
        resultsType: 'posts',
        resultsLimit: 30,
      };
    }

    if (actorKey === 'facebook') {
      return {
        startUrls: [{ url: fbUrl }],
        resultsLimit: 30,
        maxPosts: 30,
      };
    }

    // threads: automation-lab/threads-scraper
    return {
      startUrls: [{ url: threadsUrl }],
      urls: [threadsUrl],
      usernames: [cleanThreadsHandle],
      username: cleanThreadsHandle,
      maxItems: 30,
      maxPosts: 30,
    };
  };

  const triggerActorRun = async (actorKey) => {
    const cleanedToken = apifyToken.trim();
    if (!cleanedToken) {
      setShowApifyConfig(true);
      setStatusMessage(
        'Please paste your Apify API token (apify_api_...) first and click Save.'
      );
      return;
    }

    const actorMeta = ACTORS[actorKey];
    setRunningActor(actorKey);
    setStatusMessage(`Starting ${actorMeta.label} on Apify...`);

    try {
      const res = await fetch(
        `https://api.apify.com/v2/acts/${actorMeta.id}/runs?token=${encodeURIComponent(cleanedToken)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildActorPayload(actorKey)),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(
          data?.error?.message ||
            `Apify returned HTTP ${res.status} for ${actorMeta.label}`
        );
        setRunningActor(null);
        return;
      }

      const runId = data?.data?.id;
      setStatusMessage(
        `${actorMeta.label} started (Run ID: ${runId}). Polling for results...`
      );

      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts += 1;
        try {
          const statusRes = await fetch(
            `https://api.apify.com/v2/actor-runs/${runId}?token=${encodeURIComponent(cleanedToken)}`
          );
          if (statusRes.ok) {
            const statusJson = await statusRes.json();
            const status = statusJson?.data?.status;
            if (status === 'SUCCEEDED') {
              clearInterval(pollInterval);
              setRunningActor(null);
              setStatusMessage(
                `${actorMeta.label} finished! Filtering for ${targets.filterTag || '#observations'}...`
              );
              await syncAllTelemetry(cleanedToken);
              setTimeout(() => setStatusMessage(''), 4000);
              return;
            } else if (
              status === 'FAILED' ||
              status === 'ABORTED' ||
              status === 'TIMED-OUT'
            ) {
              clearInterval(pollInterval);
              setRunningActor(null);
              setStatusMessage(
                `${actorMeta.label} ended with status: ${status}.`
              );
              await syncAllTelemetry(cleanedToken);
              return;
            }
          }
        } catch {
          // ignore transient poll error
        }

        if (attempts >= 15) {
          clearInterval(pollInterval);
          setRunningActor(null);
          setStatusMessage(
            `${actorMeta.label} is still running on Apify. Click "Sync All" in ~30s.`
          );
          syncAllTelemetry(cleanedToken);
        }
      }, 4000);
    } catch (err) {
      setRunningActor(null);
      setStatusMessage(`Error triggering ${actorMeta.label}: ${err.message}`);
    }
  };

  const updateRouteMetric = (routeId, field, value) => {
    const num = Math.max(0, Number(value) || 0);
    const updated = {
      ...ledger,
      website: {
        ...ledger.website,
        routes: ledger.website.routes.map((r) =>
          r.id === routeId ? { ...r, [field]: num } : r
        ),
      },
    };
    setLedger(updated);
    saveChannelLedger(updated);
  };

  const updateSocialReelMetric = (platform, reelId, field, value) => {
    const num = field === 'status' ? value : Math.max(0, Number(value) || 0);
    const updated = {
      ...ledger,
      [platform]: {
        ...ledger[platform],
        reels: ledger[platform].reels.map((r) =>
          r.id === reelId ? { ...r, [field]: num } : r
        ),
      },
    };
    setLedger(updated);
    saveChannelLedger(updated);
  };

  const updateFollowerCount = (platform, value) => {
    const num = Math.max(0, Number(value) || 0);
    if (platform === 'substack') {
      const updated = { ...ledger, substackSubscribers: num };
      setLedger(updated);
      saveChannelLedger(updated);
      return;
    }
    const updated = {
      ...ledger,
      [platform]: {
        ...ledger[platform],
        followers: num,
      },
    };
    setLedger(updated);
    saveChannelLedger(updated);
  };

  // Quick-edit Story Funnel Metrics per dispatch (Instagram & Facebook)
  const updateDispatchPlatformMetric = (dispatchId, platform, field, value) => {
    const num = Math.max(0, Number(value) || 0);
    const updated = {
      ...ledger,
      storyFunnel: {
        ...ledger.storyFunnel,
        dispatches: (ledger.storyFunnel?.dispatches || []).map((d) => {
          if (d.id === dispatchId || d.issueId === dispatchId) {
            const currentPlatformData = d[platform] || { impressions: 0, clicks: 0, subscribers: 0 };
            return {
              ...d,
              [platform]: {
                ...currentPlatformData,
                [field]: num,
              },
            };
          }
          return d;
        }),
      },
    };
    setLedger(updated);
    saveChannelLedger(updated);
  };

  const updateGlobalStoryImpressions = (value) => {
    const num = Math.max(0, Number(value) || 0);
    const updated = {
      ...ledger,
      storyFunnel: {
        ...ledger.storyFunnel,
        defaultImpressions: num,
      },
    };
    setLedger(updated);
    saveChannelLedger(updated);
  };

  const copyUtmLink = (slug, issueId, platform = 'instagram') => {
    const origin =
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? window.location.origin
        : 'https://observations.moth1.xyz';
    const cleanIssue = String(issueId).padStart(2, '0');
    const link = `${origin}/${slug}?utm_source=${platform}&utm_medium=story&utm_campaign=issue-${cleanIssue}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedLink(`${issueId}-${platform}`);
      setTimeout(() => setCopiedLink(''), 2200);
    }
  };

  // Filtered Social Items (#observations filter)
  const activeFilterTag = targets.filterTag || '#observations';

  const visibleInstagramItems = filterOnlyObservations
    ? instagramState.items.filter((item) =>
        matchesObservationsFilter(item, activeFilterTag)
      )
    : instagramState.items;

  const visibleThreadsItems = filterOnlyObservations
    ? threadsState.items.filter((item) =>
        matchesObservationsFilter(item, activeFilterTag)
      )
    : threadsState.items;

  const visibleFacebookItems = filterOnlyObservations
    ? facebookState.items.filter((item) =>
        matchesObservationsFilter(item, activeFilterTag)
      )
    : facebookState.items;

  // Computed Aggregates
  const totalWebViews = ledger.website.routes.reduce(
    (sum, r) => sum + (Number(r.views) || 0),
    0
  );
  const totalWebShares = ledger.website.routes.reduce(
    (sum, r) => sum + (Number(r.shares) || 0),
    0
  );

  const substackPosts = substackState.posts || [];
  const totalSubstackLikes = substackPosts.reduce(
    (sum, p) => sum + (p.likes || 0),
    0
  );
  const totalSubstackComments = substackPosts.reduce(
    (sum, p) => sum + (p.comments || 0),
    0
  );

  // Story Conversion Funnel Aggregates (Instagram & Facebook Breakdown)
  const storyDispatches = ledger.storyFunnel?.dispatches || [];
  const defaultImpressions = ledger.storyFunnel?.defaultImpressions ?? 0;

  // Instagram Story Aggregates
  const igStoryImpressions = storyDispatches.reduce(
    (sum, d) => sum + (Number(d.instagram?.impressions ?? d.storyImpressions) || 0),
    0
  );
  const igStoryClicks = storyDispatches.reduce(
    (sum, d) => sum + (Number(d.instagram?.clicks ?? d.storyClicks) || 0),
    0
  );
  const igStorySubscribers = storyDispatches.reduce(
    (sum, d) => sum + (Number(d.instagram?.subscribers ?? d.storySubscribers) || 0),
    0
  );
  const igStoryCtrPct =
    igStoryImpressions > 0
      ? ((igStoryClicks / igStoryImpressions) * 100).toFixed(1)
      : '0.0';
  const igStorySubConvPct =
    igStoryClicks > 0
      ? ((igStorySubscribers / igStoryClicks) * 100).toFixed(1)
      : '0.0';

  // Facebook Story Aggregates
  const fbStoryImpressions = storyDispatches.reduce(
    (sum, d) => sum + (Number(d.facebook?.impressions) || 0),
    0
  );
  const fbStoryClicks = storyDispatches.reduce(
    (sum, d) => sum + (Number(d.facebook?.clicks) || 0),
    0
  );
  const fbStorySubscribers = storyDispatches.reduce(
    (sum, d) => sum + (Number(d.facebook?.subscribers) || 0),
    0
  );
  const fbStoryCtrPct =
    fbStoryImpressions > 0
      ? ((fbStoryClicks / fbStoryImpressions) * 100).toFixed(1)
      : '0.0';
  const fbStorySubConvPct =
    fbStoryClicks > 0
      ? ((fbStorySubscribers / fbStoryClicks) * 100).toFixed(1)
      : '0.0';

  // Combined Totals
  const totalStoryImpressions =
    igStoryImpressions + fbStoryImpressions || defaultImpressions;
  const totalStoryClicks = igStoryClicks + fbStoryClicks;
  const totalStorySubscribers = igStorySubscribers + fbStorySubscribers;

  // Story CTR: (Clicks / Impressions * 100)
  const storyCtrPct =
    totalStoryImpressions > 0
      ? ((totalStoryClicks / totalStoryImpressions) * 100).toFixed(1)
      : '0.0';

  // Conversion to Substack Subscriber (% of story clickers who hit submit)
  const storySubConversionPct =
    totalStoryClicks > 0
      ? ((totalStorySubscribers / totalStoryClicks) * 100).toFixed(1)
      : '0.0';

  // Instagram: combine filtered scraped Apify items + manual Reel ledger
  const igScrapedViews = visibleInstagramItems.reduce(
    (sum, i) => sum + (i.views || 0),
    0
  );
  const igScrapedLikes = visibleInstagramItems.reduce(
    (sum, i) => sum + (i.likes || 0),
    0
  );
  const igScrapedComments = visibleInstagramItems.reduce(
    (sum, i) => sum + (i.comments || 0),
    0
  );
  const igManualViews = ledger.instagram.reels.reduce(
    (sum, r) => sum + (Number(r.views) || 0),
    0
  );
  const igManualInteractions = ledger.instagram.reels.reduce(
    (sum, r) =>
      sum +
      (Number(r.likes) || 0) +
      (Number(r.comments) || 0) +
      (Number(r.shares) || 0) +
      (Number(r.saves) || 0),
    0
  );
  const totalIgViews = Math.max(igScrapedViews, igManualViews);
  const totalIgEngagement = Math.max(
    igScrapedLikes + igScrapedComments,
    igManualInteractions
  );

  // Threads (automation-lab/threads-scraper)
  const totalThreadsLikes = visibleThreadsItems.reduce(
    (sum, t) => sum + (t.likes || 0),
    0
  );
  const totalThreadsReplies = visibleThreadsItems.reduce(
    (sum, t) => sum + (t.replies || 0),
    0
  );
  const totalThreadsReposts = visibleThreadsItems.reduce(
    (sum, t) => sum + (t.reposts || 0),
    0
  );

  // Facebook (apify/facebook-posts-scraper + manual Reel ledger)
  const fbScrapedViews = visibleFacebookItems.reduce(
    (sum, i) => sum + (i.views || 0),
    0
  );
  const fbScrapedInteractions = visibleFacebookItems.reduce(
    (sum, i) => sum + (i.likes || 0) + (i.comments || 0) + (i.shares || 0),
    0
  );
  const fbManualViews = ledger.facebook.reels.reduce(
    (sum, r) => sum + (Number(r.views) || 0),
    0
  );
  const fbManualEngagement = ledger.facebook.reels.reduce(
    (sum, r) =>
      sum +
      (Number(r.likes) || 0) +
      (Number(r.comments) || 0) +
      (Number(r.shares) || 0) +
      (Number(r.linkClicks) || 0),
    0
  );
  const totalFbViews = Math.max(fbScrapedViews, fbManualViews);
  const totalFbEngagement = Math.max(fbScrapedInteractions, fbManualEngagement);

  const handleOwnerUnlock = (e) => {
    e.preventDefault();
    const val = unlockInput.trim();
    if (
      val.startsWith('apify_api_') ||
      val.toLowerCase() === 'moth1.siv' ||
      val.toLowerCase() === 'moth1'
    ) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(OWNER_UNLOCK_STORAGE_KEY, 'true');
        if (val.startsWith('apify_api_')) {
          window.localStorage.setItem(APIFY_TOKEN_STORAGE_KEY, val);
          setApifyToken(val);
          syncAllTelemetry(val);
        }
      }
      setIsOwnerUnlocked(true);
      setUnlockError('');
    } else {
      setUnlockError(
        'Invalid access key. Enter your Apify API token (apify_api_...) or owner handle.'
      );
    }
  };

  if (!isOwnerUnlocked) {
    return (
      <div className="min-h-screen bg-[#0c0d10] text-[#e2e8f0] flex items-center justify-center px-4">
        <CyberPanel
          label="Private Telemetry • Owner Access Only"
          accent="#67e8f9"
          className="max-w-md w-full p-6 sm:p-8 space-y-5"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#e2e8f0]">
              Observations by Moth1
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              This analytics console is restricted to the publication owner.
              Paste your Apify API token (<code className="text-[#67e8f9]">apify_api_...</code>) or owner key to unlock on this browser.
            </p>
          </div>

          <form onSubmit={handleOwnerUnlock} className="space-y-3">
            <input
              type="password"
              value={unlockInput}
              onChange={(e) => setUnlockInput(e.target.value)}
              placeholder="Paste Apify API token or owner key..."
              className="w-full bg-[#0b0d10] border border-slate-700 px-3.5 py-2.5 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#67e8f9]"
            />
            {unlockError && (
              <div className="font-mono text-[11px] text-[#fda4af]">
                {unlockError}
              </div>
            )}
            <div className="flex items-center justify-between gap-3 pt-1">
              <Link
                to="/"
                className="font-mono text-xs text-slate-400 hover:text-white"
              >
                ← Back to Publication
              </Link>
              <button
                type="submit"
                className="bg-[#67e8f9] text-[#121316] font-mono text-xs font-extrabold uppercase tracking-wider px-5 py-2 hover:bg-[#86efac] transition-colors cursor-pointer"
              >
                Unlock Console
              </button>
            </div>
          </form>
        </CyberPanel>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#e2e8f0] pt-14 sm:pt-20 pb-20 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Subtle Cyberpunk Grid Backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800 pb-5 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-slate-800 bg-[#121316] px-2.5 py-1 mb-2.5 sm:mb-3">
              <span className="h-2 w-2 rounded-full bg-[#86efac] animate-pulse shrink-0" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-[#86efac] uppercase font-bold truncate">
                Publication Telemetry &amp; Multi-Channel Command
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#e2e8f0] uppercase break-words">
              Observations by Moth1{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86efac] via-[#67e8f9] to-[#f472b6]">
                Analytics
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tracking Web Traffic, Story Funnel Conversion (<code>utm_medium=story</code>) &amp; Social Scrapers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* #observations Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setFilterOnlyObservations((prev) => !prev)}
              className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 border px-2.5 sm:px-3.5 py-2 font-mono text-[11px] sm:text-xs font-bold transition-colors cursor-pointer text-center ${
                filterOnlyObservations
                  ? 'border-[#86efac] bg-[#86efac]/15 text-[#86efac]'
                  : 'border-slate-700 bg-[#121316] text-slate-400 hover:border-slate-500'
              }`}
              title="Toggle filtering social scrapers for #observations posts only"
            >
              <Filter className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {filterOnlyObservations
                  ? `Filter: ${activeFilterTag}`
                  : 'Showing All'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowApifyConfig((prev) => !prev)}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 border border-slate-700 bg-[#121316] hover:border-[#67e8f9] px-2.5 sm:px-3.5 py-2 font-mono text-[11px] sm:text-xs text-[#e2e8f0] transition-colors cursor-pointer text-center"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#67e8f9] shrink-0" />
              <span className="truncate">
                {apifyToken.trim() ? 'Apify Token' : 'Connect Apify'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => syncAllTelemetry()}
              disabled={loadingSync}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 border border-[#67e8f9]/60 bg-[#67e8f9]/10 hover:bg-[#67e8f9]/20 px-2.5 sm:px-3.5 py-2 font-mono text-[11px] sm:text-xs text-[#67e8f9] font-bold transition-colors cursor-pointer text-center"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 shrink-0 ${loadingSync ? 'animate-spin' : ''}`}
              />
              <span>Sync All</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 border border-slate-800 bg-[#121316] hover:border-slate-600 px-2.5 sm:px-3.5 py-2 font-mono text-[11px] sm:text-xs text-slate-300 transition-colors text-center"
            >
              <span>← Back to Site</span>
            </Link>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="border border-[#67e8f9]/60 bg-[#121316] px-4 py-3 flex items-center justify-between font-mono text-xs text-[#67e8f9]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage('')}
              className="text-slate-400 hover:text-white uppercase cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Collapsible Apify Configuration & Target Handles Drawer */}
        {showApifyConfig && (
          <CyberPanel
            label="Apify API Token, Handles & #observations Filter Configuration"
            accent="#67e8f9"
            className="p-4 sm:p-6"
          >
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5">
                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-[#67e8f9] font-bold uppercase">
                    Apify API Token
                  </label>
                  <input
                    type="password"
                    value={apifyToken}
                    onChange={(e) => setApifyToken(e.target.value)}
                    placeholder="apify_api_..."
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#67e8f9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-[#86efac] font-bold uppercase">
                    Hashtag Filter
                  </label>
                  <input
                    type="text"
                    value={targets.filterTag}
                    onChange={(e) =>
                      setTargets((prev) => ({
                        ...prev,
                        filterTag: e.target.value,
                      }))
                    }
                    placeholder="#observations"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#86efac] font-bold focus:outline-none focus:border-[#86efac]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-[#67e8f9] font-bold uppercase">
                    Substack URL
                  </label>
                  <input
                    type="text"
                    value={targets.substackUrl}
                    onChange={(e) =>
                      setTargets((prev) => ({
                        ...prev,
                        substackUrl: e.target.value,
                      }))
                    }
                    placeholder="https://observationsbymoth1.substack.com"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#67e8f9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-[#fda4af] font-bold uppercase">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={targets.instagramHandle}
                    onChange={(e) =>
                      setTargets((prev) => ({
                        ...prev,
                        instagramHandle: e.target.value,
                      }))
                    }
                    placeholder="moth1.siv"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#fda4af]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-[#c084fc] font-bold uppercase">
                    Threads Handle
                  </label>
                  <input
                    type="text"
                    value={targets.threadsHandle}
                    onChange={(e) =>
                      setTargets((prev) => ({
                        ...prev,
                        threadsHandle: e.target.value,
                      }))
                    }
                    placeholder="moth1.siv"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#c084fc]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-[#86efac] font-bold uppercase">
                    Facebook Profile/Page
                  </label>
                  <input
                    type="text"
                    value={targets.facebookUrl}
                    onChange={(e) =>
                      setTargets((prev) => ({
                        ...prev,
                        facebookUrl: e.target.value,
                      }))
                    }
                    placeholder="https://www.facebook.com/sivaraj.pragasm"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#86efac]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-slate-400">
                  <span>
                    Substack:{' '}
                    <strong className="text-[#67e8f9]">
                      {substackState.runInfo?.status || 'IDLE'}
                    </strong>
                  </span>
                  <span>
                    Instagram:{' '}
                    <strong className="text-[#fda4af]">
                      {instagramState.runInfo?.status || 'IDLE'}
                    </strong>
                  </span>
                  <span>
                    Threads:{' '}
                    <strong className="text-[#c084fc]">
                      {threadsState.runInfo?.status || 'IDLE'}
                    </strong>
                  </span>
                  <span>
                    Facebook:{' '}
                    <strong className="text-[#86efac]">
                      {facebookState.runInfo?.status || 'IDLE'}
                    </strong>
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-[#67e8f9] text-[#121316] font-mono text-xs font-extrabold uppercase tracking-wider px-5 py-2 hover:bg-[#86efac] transition-colors cursor-pointer"
                >
                  Save &amp; Sync All Datasets
                </button>
              </div>
            </form>
          </CyberPanel>
        )}

        {/* 6-Channel Executive Summary KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* KPI 1: Website (Vercel Analytics) */}
          <CyberPanel
            label="Website • Vercel"
            accent="#86efac"
            className="p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-400 truncate">
                  observations.moth1.xyz
                </span>
                <Globe className="w-4 h-4 text-[#86efac] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                {totalWebViews.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Views • {totalWebShares.toLocaleString()} Shares
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
              <span className="inline-flex items-center gap-1 text-[#86efac]">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#86efac]"
              >
                Vercel ↗
              </a>
            </div>
          </CyberPanel>

          {/* KPI 2: Substack (automation-lab/substack-scraper) */}
          <CyberPanel
            label="Substack • Apify"
            accent="#67e8f9"
            className="p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-400 truncate">
                  substack-scraper
                </span>
                <BookOpen className="w-4 h-4 text-[#67e8f9] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                {substackPosts.length} Posts
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {totalSubstackLikes} Likes • {totalSubstackComments} Comments
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
              <span className="text-slate-400">Subscribers:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[12px] font-bold text-[#67e8f9] tabular-nums">
                  {(substackState.subscribers || ledger.substackSubscribers || 0).toLocaleString()}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#67e8f9]/40 bg-[#67e8f9]/10 text-[#67e8f9] rounded-none">
                  {substackState.subscribers > 0 ? 'Scraped' : 'Live'}
                </span>
              </div>
            </div>
          </CyberPanel>

          {/* KPI 3: Instagram (apify/instagram-scraper) */}
          <CyberPanel
            label="Instagram • Apify"
            accent="#fda4af"
            className="p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-400 truncate">
                  @{targets.instagramHandle}
                </span>
                <Film className="w-4 h-4 text-[#fda4af] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                {totalIgViews.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Plays • {totalIgEngagement.toLocaleString()} Engagements (
                {visibleInstagramItems.length} {activeFilterTag})
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
              <span className="text-slate-400">Followers:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[12px] font-bold text-[#fda4af] tabular-nums">
                  {(instagramState.followers || ledger.instagram.followers || 0).toLocaleString()}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#fda4af]/40 bg-[#fda4af]/10 text-[#fda4af] rounded-none">
                  {instagramState.followers > 0 ? 'Scraped' : 'Live'}
                </span>
              </div>
            </div>
          </CyberPanel>

          {/* KPI 4: Threads (automation-lab/threads-scraper) */}
          <CyberPanel
            label="Threads • Apify"
            accent="#c084fc"
            className="p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-400 truncate">
                  @{targets.threadsHandle}
                </span>
                <MessageSquare className="w-4 h-4 text-[#c084fc] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                {visibleThreadsItems.length} Threads
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {totalThreadsLikes} Likes • {totalThreadsReplies} Replies •{' '}
                {totalThreadsReposts} Reposts
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">Followers:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[12px] font-bold text-[#c084fc] tabular-nums">
                  {(threadsState.followers || 0).toLocaleString()}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#c084fc]/40 bg-[#c084fc]/10 text-[#c084fc] rounded-none">
                  {threadsState.followers > 0 ? 'Scraped' : 'Live'}
                </span>
              </div>
            </div>
          </CyberPanel>

          {/* KPI 5: Facebook (apify/facebook-posts-scraper) */}
          <CyberPanel
            label="Facebook • Apify"
            accent="#86efac"
            className="p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-400 truncate">
                  sivaraj.pragasm
                </span>
                <Share2 className="w-4 h-4 text-[#86efac] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                {totalFbViews.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Views • {totalFbEngagement.toLocaleString()} Engagements (
                {visibleFacebookItems.length} {activeFilterTag})
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
              <span className="text-slate-400">Followers:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[12px] font-bold text-[#86efac] tabular-nums">
                  {(facebookState.followers || ledger.facebook.followers || 0).toLocaleString()}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#86efac]/40 bg-[#86efac]/10 text-[#86efac] rounded-none">
                  {facebookState.followers > 0 ? 'Scraped' : 'Live'}
                </span>
              </div>
            </div>
          </CyberPanel>

          {/* KPI 6: Story to Essay Conversion (Instagram & Facebook Breakdown) */}
          <CyberPanel
            label="Story Funnel • Conversion"
            accent="#f472b6"
            className="p-4 flex flex-col justify-between border border-[#f472b6]/40 bg-[#121316]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-slate-400 truncate uppercase tracking-wider">
                  Story to Essay Funnel
                </span>
                <Zap className="w-4 h-4 text-[#f472b6] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#f472b6] tabular-nums">
                {storyCtrPct}% <span className="text-sm font-bold text-slate-400">CTR</span>
              </div>
              <div className="text-xs text-slate-300 mt-1 font-mono">
                <span className="text-[#86efac] font-bold">{totalStoryClicks}</span> clicks •{' '}
                <span className="text-[#f472b6] font-bold">{totalStorySubscribers}</span> subs (
                <span className="text-[#86efac] font-bold">{storySubConversionPct}%</span>)
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-[#fda4af] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fda4af]" />
                  IG Story:
                </span>
                <span className="text-slate-300">
                  <strong className="text-[#fda4af]">{igStoryCtrPct}%</strong> ({igStoryClicks}c • {igStorySubscribers}s)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#60a5fa] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
                  FB Story:
                </span>
                <span className="text-slate-300">
                  <strong className="text-[#60a5fa]">{fbStoryCtrPct}%</strong> ({fbStoryClicks}c • {fbStorySubscribers}s)
                </span>
              </div>
            </div>
          </CyberPanel>
        </div>

        {/* SECTION 1: Website Route Breakdown & Vercel Web Analytics Sync */}
        <CyberPanel
          label="Website Telemetry • observations.moth1.xyz"
          accent="#86efac"
          className="p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-[#e2e8f0]">
                Interactive Web Essay Traffic by Route
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Live pageviews and share clicks are streamed automatically to
                Vercel Web Analytics via{' '}
                <code className="text-[#86efac]">&lt;Analytics /&gt;</code>. You
                can also sync your Vercel dashboard numbers below.
              </p>
            </div>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-[#86efac]/60 bg-[#86efac]/10 px-3.5 py-2 font-mono text-xs text-[#86efac] font-bold hover:bg-[#86efac]/20 transition-colors w-full sm:w-auto shrink-0"
            >
              <span>Open Vercel Web Analytics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {ledger.website.routes.map((route) => {
              const maxViews = Math.max(
                10,
                ...ledger.website.routes.map((r) => Number(r.views) || 0)
              );
              const barPct = Math.min(
                100,
                Math.round(((Number(route.views) || 0) / maxViews) * 100)
              );

              return (
                <div
                  key={route.id}
                  className="p-3.5 sm:p-4 bg-[#0b0d10] border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-[11px] text-[#86efac] font-bold">
                        {route.path}
                      </div>
                      <div className="text-sm font-bold text-[#e2e8f0] mt-0.5">
                        {route.title}
                      </div>
                    </div>
                    <Link
                      to={route.path}
                      className="font-mono text-[10px] text-slate-400 hover:text-white border border-slate-800 px-2 py-0.5 shrink-0"
                    >
                      Visit ↗
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        PAGEVIEWS
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={route.views}
                        onChange={(e) =>
                          updateRouteMetric(route.id, 'views', e.target.value)
                        }
                        className="w-full bg-[#121316] border border-slate-800 px-2.5 py-1 text-sm font-bold text-[#86efac]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        SHARES
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={route.shares}
                        onChange={(e) =>
                          updateRouteMetric(route.id, 'shares', e.target.value)
                        }
                        className="w-full bg-[#121316] border border-slate-800 px-2.5 py-1 text-sm font-bold text-[#67e8f9]"
                      />
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#86efac] to-[#67e8f9] transition-all duration-500"
                      style={{ width: `${Math.max(4, barPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CyberPanel>

        {/* SECTION 2: Substack Scraper (automation-lab/substack-scraper) */}
        <CyberPanel
          label="Substack Telemetry • automation-lab/substack-scraper"
          accent="#67e8f9"
          className="p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-[#e2e8f0]">
                Published Substack Dispatches ({targets.substackUrl})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Powered by{' '}
                <code className="text-[#67e8f9]">
                  automation-lab/substack-scraper
                </code>{' '}
                merged with live Substack archive endpoints.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => triggerActorRun('substack')}
                disabled={runningActor !== null}
                className="inline-flex items-center justify-center gap-1.5 border border-[#67e8f9]/60 bg-[#67e8f9]/10 hover:bg-[#67e8f9]/20 px-3.5 py-2 font-mono text-xs text-[#67e8f9] font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>
                  {runningActor === 'substack'
                    ? 'Scraping Substack...'
                    : 'Run Substack Scraper'}
                </span>
              </button>
            </div>
          </div>

          {loadingSync ? (
            <div className="py-8 text-center font-mono text-xs text-slate-400 animate-pulse">
              Syncing Substack dispatches...
            </div>
          ) : substackPosts.length === 0 ? (
            <div className="py-6 text-center font-mono text-xs text-slate-400">
              No Substack posts found yet. Click &ldquo;Run Substack
              Scraper&rdquo; to pull from {targets.substackUrl}.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase">
                    <th className="py-2.5 pr-4">Dispatch Title</th>
                    <th className="py-2.5 px-3">Published</th>
                    <th className="py-2.5 px-3">Length</th>
                    <th className="py-2.5 px-3">Likes</th>
                    <th className="py-2.5 px-3">Comments</th>
                    <th className="py-2.5 px-3">Restacks</th>
                    <th className="py-2.5 px-3">Source</th>
                    <th className="py-2.5 pl-3 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-xs sm:text-sm">
                  {substackPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-[#e2e8f0]">
                          {post.title}
                        </div>
                        {post.subtitle && (
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {post.subtitle}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs text-slate-300 whitespace-nowrap">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )
                          : '—'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs text-slate-300 whitespace-nowrap">
                        {post.wordCount
                          ? `${post.wordCount.toLocaleString()} words (${post.readingTimeMinutes}m)`
                          : `${post.readingTimeMinutes || 3}m read`}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs font-bold text-[#86efac]">
                        {post.likes || 0}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs font-bold text-[#67e8f9]">
                        {post.comments || 0}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs font-bold text-[#c084fc]">
                        {post.restacks || 0}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[10px]">
                        <span className="px-2 py-0.5 border border-slate-800 bg-[#0b0d10] text-slate-300 uppercase">
                          {post.source}
                        </span>
                      </td>
                      <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-[#67e8f9] hover:underline"
                        >
                          Open ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CyberPanel>

        {/* SECTION 3: Instagram Scraper (apify/instagram-scraper) + Threads & Facebook Scrapers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Instagram Apify Scraper Feed */}
          <CyberPanel
            label="Instagram Scraper • apify/instagram-scraper"
            accent="#fda4af"
            className="p-4 sm:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    Instagram Feed &amp; Reels (@{targets.instagramHandle})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing{' '}
                    <strong className="text-[#fda4af]">
                      {visibleInstagramItems.length}
                    </strong>{' '}
                    of {instagramState.items.length} scraped posts{' '}
                    {filterOnlyObservations && (
                      <span>
                        matching <code className="text-[#86efac]">{activeFilterTag}</code>
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerActorRun('instagram')}
                  disabled={runningActor !== null}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#fda4af]/60 bg-[#fda4af]/10 hover:bg-[#fda4af]/20 px-3.5 py-1.5 font-mono text-xs text-[#fda4af] font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {runningActor === 'instagram'
                      ? 'Scraping IG...'
                      : 'Run Instagram Scraper'}
                  </span>
                </button>
              </div>

              {visibleInstagramItems.length === 0 ? (
                <div className="py-6 px-4 bg-[#0b0d10] border border-slate-800/80 text-center font-mono text-xs text-slate-400 mb-4 space-y-2">
                  {instagramState.items.length > 0 && filterOnlyObservations ? (
                    <>
                      <div>
                        Scraped{' '}
                        <strong className="text-[#fda4af]">
                          {instagramState.items.length}
                        </strong>{' '}
                        posts from @{targets.instagramHandle}, but none contain{' '}
                        <code className="text-[#86efac]">{activeFilterTag}</code>{' '}
                        yet.
                      </div>
                      <button
                        type="button"
                        onClick={() => setFilterOnlyObservations(false)}
                        className="border border-slate-700 bg-[#121316] px-3 py-1 text-[11px] text-[#fda4af] hover:border-[#fda4af] cursor-pointer"
                      >
                        Show all {instagramState.items.length} scraped IG posts
                      </button>
                    </>
                  ) : (
                    <div>
                      No Apify dataset items loaded yet for{' '}
                      <code className="text-[#fda4af]">
                        @{targets.instagramHandle}
                      </code>
                      . Click &ldquo;Run Instagram Scraper&rdquo; above.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto mb-5 max-h-[280px] -mx-1 sm:mx-0">
                  <table className="w-full text-left border-collapse min-w-[480px]">
                    <thead>
                      <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase">
                        <th className="py-2 pr-3">Post / Reel</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Views</th>
                        <th className="py-2 px-2">Likes</th>
                        <th className="py-2 px-2">Comments</th>
                        <th className="py-2 pl-2 text-right">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 text-xs">
                      {visibleInstagramItems.slice(0, 15).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 pr-3 max-w-[200px] truncate text-[#e2e8f0]">
                            {item.caption}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[10px] text-[#fda4af]">
                            {item.type}
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-[#86efac]">
                            {item.views.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[#e2e8f0]">
                            {item.likes.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[#67e8f9]">
                            {item.comments.toLocaleString()}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[11px] text-[#fda4af] hover:underline"
                            >
                              ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Manual / Issue-Specific Instagram Reel Tracker */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="font-mono text-[11px] text-slate-400 uppercase font-bold">
                  Issue Reel Ledger (Manual Override / Sync)
                </div>
                {ledger.instagram.reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-xs sm:text-sm text-[#e2e8f0]">
                        Issue #{reel.issueId}: {reel.title}
                      </div>
                      <select
                        value={reel.status}
                        onChange={(e) =>
                          updateSocialReelMetric(
                            'instagram',
                            reel.id,
                            'status',
                            e.target.value
                          )
                        }
                        className="bg-[#121316] border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-[#fda4af] uppercase"
                      >
                        <option value="Ready to Post">Ready to Post</option>
                        <option value="Published">Published</option>
                        <option value="Boosted">Boosted</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
                      {[
                        { key: 'views', label: 'VIEWS', color: '#fda4af' },
                        { key: 'likes', label: 'LIKES', color: '#e2e8f0' },
                        {
                          key: 'comments',
                          label: 'COMMENTS',
                          color: '#e2e8f0',
                        },
                        { key: 'shares', label: 'SHARES', color: '#86efac' },
                        { key: 'saves', label: 'SAVES', color: '#67e8f9' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[9px] text-slate-400 mb-0.5">
                            {field.label}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={reel[field.key]}
                            onChange={(e) =>
                              updateSocialReelMetric(
                                'instagram',
                                reel.id,
                                field.key,
                                e.target.value
                              )
                            }
                            style={{ color: field.color }}
                            className="w-full bg-[#121316] border border-slate-800 px-2 py-1 text-xs font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CyberPanel>

          {/* Threads Scraper (automation-lab/threads-scraper) + Facebook Scraper (apify/facebook-posts-scraper) */}
          <div className="space-y-4 sm:space-y-6">
            <CyberPanel
              label="Threads Scraper • automation-lab/threads-scraper"
              accent="#c084fc"
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    Threads Posts (@{targets.threadsHandle})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing{' '}
                    <strong className="text-[#c084fc]">
                      {visibleThreadsItems.length}
                    </strong>{' '}
                    of {threadsState.items.length} scraped threads{' '}
                    {filterOnlyObservations && (
                      <span>
                        matching <code className="text-[#86efac]">{activeFilterTag}</code>
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerActorRun('threads')}
                  disabled={runningActor !== null}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#c084fc]/60 bg-[#c084fc]/10 hover:bg-[#c084fc]/20 px-3.5 py-1.5 font-mono text-xs text-[#c084fc] font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {runningActor === 'threads'
                      ? 'Scraping Threads...'
                      : 'Run Threads Scraper'}
                  </span>
                </button>
              </div>

              {visibleThreadsItems.length === 0 ? (
                <div className="py-6 px-4 bg-[#0b0d10] border border-slate-800/80 text-center font-mono text-xs text-slate-400 space-y-2">
                  {threadsState.items.length > 0 && filterOnlyObservations ? (
                    <>
                      <div>
                        Scraped{' '}
                        <strong className="text-[#c084fc]">
                          {threadsState.items.length}
                        </strong>{' '}
                        threads from @{targets.threadsHandle}, but none contain{' '}
                        <code className="text-[#86efac]">{activeFilterTag}</code>{' '}
                        yet.
                      </div>
                      <button
                        type="button"
                        onClick={() => setFilterOnlyObservations(false)}
                        className="border border-slate-700 bg-[#121316] px-3 py-1 text-[11px] text-[#c084fc] hover:border-[#c084fc] cursor-pointer"
                      >
                        Show all {threadsState.items.length} scraped Threads
                      </button>
                    </>
                  ) : (
                    <div>
                      No Apify dataset items loaded yet for{' '}
                      <code className="text-[#c084fc]">
                        @{targets.threadsHandle}
                      </code>
                      . Click &ldquo;Run Threads Scraper&rdquo; above.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto max-h-[260px] -mx-1 sm:mx-0">
                  <table className="w-full text-left border-collapse min-w-[460px]">
                    <thead>
                      <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase">
                        <th className="py-2 pr-3">Thread Post</th>
                        <th className="py-2 px-2">Likes</th>
                        <th className="py-2 px-2">Replies</th>
                        <th className="py-2 px-2">Reposts</th>
                        <th className="py-2 pl-2 text-right">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 text-xs">
                      {visibleThreadsItems.slice(0, 15).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 pr-3 max-w-[220px] truncate text-[#e2e8f0]">
                            {item.text}
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-[#86efac]">
                            {item.likes.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[#67e8f9]">
                            {item.replies.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[#c084fc]">
                            {item.reposts.toLocaleString()}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[11px] text-[#c084fc] hover:underline"
                            >
                              ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CyberPanel>

            {/* Facebook Scraper (apify/facebook-posts-scraper) & Reels Panel */}
            <CyberPanel
              label="Facebook Scraper • apify/facebook-posts-scraper"
              accent="#86efac"
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    Facebook Posts &amp; Reels (sivaraj.pragasm)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing{' '}
                    <strong className="text-[#86efac]">
                      {visibleFacebookItems.length}
                    </strong>{' '}
                    of {facebookState.items.length} scraped FB posts{' '}
                    {filterOnlyObservations && (
                      <span>
                        matching <code className="text-[#86efac]">{activeFilterTag}</code>
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerActorRun('facebook')}
                  disabled={runningActor !== null}
                  className="inline-flex items-center justify-center gap-1.5 border border-[#86efac]/60 bg-[#86efac]/10 hover:bg-[#86efac]/20 px-3.5 py-1.5 font-mono text-xs text-[#86efac] font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {runningActor === 'facebook'
                      ? 'Scraping FB...'
                      : 'Run Facebook Scraper'}
                  </span>
                </button>
              </div>

              {visibleFacebookItems.length === 0 ? (
                <div className="py-5 px-4 bg-[#0b0d10] border border-slate-800/80 text-center font-mono text-xs text-slate-400 mb-4 space-y-2">
                  {facebookState.items.length > 0 && filterOnlyObservations ? (
                    <>
                      <div>
                        Scraped{' '}
                        <strong className="text-[#86efac]">
                          {facebookState.items.length}
                        </strong>{' '}
                        posts from Facebook, but none contain{' '}
                        <code className="text-[#86efac]">{activeFilterTag}</code>{' '}
                        yet.
                      </div>
                      <button
                        type="button"
                        onClick={() => setFilterOnlyObservations(false)}
                        className="border border-slate-700 bg-[#121316] px-3 py-1 text-[11px] text-[#86efac] hover:border-[#86efac] cursor-pointer"
                      >
                        Show all {facebookState.items.length} scraped FB posts
                      </button>
                    </>
                  ) : (
                    <div>
                      No Apify dataset items loaded yet for{' '}
                      <code className="text-[#86efac]">sivaraj.pragasm</code>.
                      Click &ldquo;Run Facebook Scraper&rdquo; above.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto mb-5 max-h-[240px] -mx-1 sm:mx-0">
                  <table className="w-full text-left border-collapse min-w-[480px]">
                    <thead>
                      <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase">
                        <th className="py-2 pr-3">Post / Reel</th>
                        <th className="py-2 px-2">Views</th>
                        <th className="py-2 px-2">Likes</th>
                        <th className="py-2 px-2">Comments</th>
                        <th className="py-2 px-2">Shares</th>
                        <th className="py-2 pl-2 text-right">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 text-xs">
                      {visibleFacebookItems.slice(0, 15).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 pr-3 max-w-[200px] truncate text-[#e2e8f0]">
                            {item.text}
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-[#86efac]">
                            {item.views.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[#e2e8f0]">
                            {item.likes.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[#67e8f9]">
                            {item.comments.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-[#c084fc]">
                            {item.shares.toLocaleString()}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[11px] text-[#86efac] hover:underline"
                            >
                              ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="font-mono text-[11px] text-slate-400 uppercase font-bold">
                  Issue Reel Ledger (Manual Override / Outbound Clicks)
                </div>
                {ledger.facebook.reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-xs sm:text-sm text-[#e2e8f0]">
                        Issue #{reel.issueId}: {reel.title}
                      </div>
                      <select
                        value={reel.status}
                        onChange={(e) =>
                          updateSocialReelMetric(
                            'facebook',
                            reel.id,
                            'status',
                            e.target.value
                          )
                        }
                        className="bg-[#121316] border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-[#86efac] uppercase"
                      >
                        <option value="Ready to Post">Ready to Post</option>
                        <option value="Published">Published</option>
                        <option value="Boosted">Boosted</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2 font-mono">
                      {[
                        { key: 'views', label: 'VIEWS', color: '#86efac' },
                        { key: 'likes', label: 'LIKES', color: '#e2e8f0' },
                        {
                          key: 'comments',
                          label: 'COMMENTS',
                          color: '#e2e8f0',
                        },
                        { key: 'shares', label: 'SHARES', color: '#67e8f9' },
                        {
                          key: 'linkClicks',
                          label: 'SITE CLICKS',
                          color: '#c084fc',
                        },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[9px] text-slate-400 mb-0.5">
                            {field.label}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={reel[field.key]}
                            onChange={(e) =>
                              updateSocialReelMetric(
                                'facebook',
                                reel.id,
                                field.key,
                                e.target.value
                              )
                            }
                            style={{ color: field.color }}
                            className="w-full bg-[#121316] border border-slate-800 px-2 py-1 text-xs font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CyberPanel>
          </div>
        </div>

        {/* SECTION 4: Story to Essay Conversion Funnel (Instagram & Facebook Breakdown) */}
        <CyberPanel
          label="Story to Essay Conversion Funnel • Instagram & Facebook"
          accent="#f472b6"
          className="p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-[#e2e8f0] flex items-center gap-2">
                <span>Story Conversion Funnel by Platform</span>
                <span className="px-2 py-0.5 border border-[#f472b6]/40 bg-[#f472b6]/10 text-[#f472b6] text-[10px] font-mono uppercase font-bold">
                  IG &amp; FB Breakdown
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Separate counters for Instagram (<code className="text-[#fda4af]">utm_source=instagram</code>) and Facebook (<code className="text-[#60a5fa]">utm_source=facebook</code>) with <code className="text-[#f472b6]">utm_medium=story</code>.
                Log your final 24h Story views below to compute verified CTR &amp; Substack subscriber conversions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 bg-[#fda4af]/10 border border-[#fda4af]/30 text-[#fda4af]">
                IG CTR: <strong>{igStoryCtrPct}%</strong> ({igStoryClicks}c / {igStorySubscribers}s)
              </span>
              <span className="px-2 py-1 bg-[#60a5fa]/10 border border-[#60a5fa]/30 text-[#60a5fa]">
                FB CTR: <strong>{fbStoryCtrPct}%</strong> ({fbStoryClicks}c / {fbStorySubscribers}s)
              </span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {storyDispatches.map((dispatch) => {
              const rawIgImp = Number(dispatch.instagram?.impressions ?? dispatch.storyImpressions);
              const igImpressions = Number.isFinite(rawIgImp) ? rawIgImp : 0;
              const igClicks = Number(dispatch.instagram?.clicks ?? dispatch.storyClicks) || 0;
              const igSubs = Number(dispatch.instagram?.subscribers ?? dispatch.storySubscribers) || 0;
              const igCtr = igImpressions > 0 ? ((igClicks / igImpressions) * 100).toFixed(1) : '0.0';
              const igConv = igClicks > 0 ? ((igSubs / igClicks) * 100).toFixed(1) : '0.0';

              const rawFbImp = Number(dispatch.facebook?.impressions);
              const fbImpressions = Number.isFinite(rawFbImp) ? rawFbImp : 0;
              const fbClicks = Number(dispatch.facebook?.clicks) || 0;
              const fbSubs = Number(dispatch.facebook?.subscribers) || 0;
              const fbCtr = fbImpressions > 0 ? ((fbClicks / fbImpressions) * 100).toFixed(1) : '0.0';
              const fbConv = fbClicks > 0 ? ((fbSubs / fbClicks) * 100).toFixed(1) : '0.0';

              const issueTag = dispatch.issueId || dispatch.id;

              return (
                <div
                  key={dispatch.id}
                  className="p-3.5 sm:p-5 bg-[#0b0d10] border border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="font-mono text-[10px] text-[#f472b6] font-bold tracking-widest uppercase">
                        Issue #{issueTag}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-[#e2e8f0] mt-0.5">
                        {dispatch.title}
                      </div>
                    </div>
                  </div>

                  {/* Dual Platform Columns: Instagram (Pink) vs Facebook (Blue) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {/* Platform Card 1: Instagram Story */}
                    <div className="p-3 sm:p-4 bg-[#121316] border border-[#fda4af]/30 rounded-none space-y-3">
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#fda4af] shrink-0" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#fda4af]">
                            Instagram Story
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyUtmLink(dispatch.slug, issueTag, 'instagram')}
                          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-[#fda4af]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#fda4af] hover:text-[#fda4af] transition-colors cursor-pointer shrink-0 w-full xs:w-auto"
                          title="Copy IG Story Link with utm_source=instagram&utm_medium=story"
                        >
                          {copiedLink === `${issueTag}-instagram` ? (
                            <>
                              <Check className="w-3 h-3 text-[#86efac]" />
                              <span className="text-[#86efac]">Copied IG Link!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#fda4af]" />
                              <span>Copy IG Story Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 3 Quick-Edit Inputs for Instagram */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 font-mono text-xs">
                        <div>
                          <label className="block text-[9px] sm:text-[10px] text-slate-400 mb-0.5 truncate text-center sm:text-left">
                            24H VIEWS
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={igImpressions}
                            onChange={(e) =>
                              updateDispatchPlatformMetric(
                                dispatch.id,
                                'instagram',
                                'impressions',
                                e.target.value
                              )
                            }
                            className="w-full bg-[#0b0d10] border border-slate-800 px-1 sm:px-2 py-1 text-xs font-bold text-[#fda4af] text-center sm:text-left"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] sm:text-[10px] text-slate-400 mb-0.5 truncate text-center sm:text-left">
                            CLICKS
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={igClicks}
                            onChange={(e) =>
                              updateDispatchPlatformMetric(
                                dispatch.id,
                                'instagram',
                                'clicks',
                                e.target.value
                              )
                            }
                            className="w-full bg-[#0b0d10] border border-slate-800 px-1 sm:px-2 py-1 text-xs font-bold text-[#e2e8f0] text-center sm:text-left"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] sm:text-[10px] text-slate-400 mb-0.5 truncate text-center sm:text-left">
                            SUBS
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={igSubs}
                            onChange={(e) =>
                              updateDispatchPlatformMetric(
                                dispatch.id,
                                'instagram',
                                'subscribers',
                                e.target.value
                              )
                            }
                            className="w-full bg-[#0b0d10] border border-slate-800 px-1 sm:px-2 py-1 text-xs font-bold text-[#86efac] text-center sm:text-left"
                          />
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            CTR: <strong className="text-[#fda4af]">{igCtr}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{igConv}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#fda4af] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(igCtr) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, (Number(igConv) * Number(igCtr)) / 100 || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Platform Card 2: Facebook Story */}
                    <div className="p-3 sm:p-4 bg-[#121316] border border-[#60a5fa]/30 rounded-none space-y-3">
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#60a5fa] shrink-0" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#60a5fa]">
                            Facebook Story
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyUtmLink(dispatch.slug, issueTag, 'facebook')}
                          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-[#60a5fa]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors cursor-pointer shrink-0 w-full xs:w-auto"
                          title="Copy FB Story Link with utm_source=facebook&utm_medium=story"
                        >
                          {copiedLink === `${issueTag}-facebook` ? (
                            <>
                              <Check className="w-3 h-3 text-[#86efac]" />
                              <span className="text-[#86efac]">Copied FB Link!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-[#60a5fa]" />
                              <span>Copy FB Story Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 3 Quick-Edit Inputs for Facebook */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 font-mono text-xs">
                        <div>
                          <label className="block text-[9px] sm:text-[10px] text-slate-400 mb-0.5 truncate text-center sm:text-left">
                            24H VIEWS
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={fbImpressions}
                            onChange={(e) =>
                              updateDispatchPlatformMetric(
                                dispatch.id,
                                'facebook',
                                'impressions',
                                e.target.value
                              )
                            }
                            className="w-full bg-[#0b0d10] border border-slate-800 px-1 sm:px-2 py-1 text-xs font-bold text-[#60a5fa] text-center sm:text-left"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] sm:text-[10px] text-slate-400 mb-0.5 truncate text-center sm:text-left">
                            CLICKS
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={fbClicks}
                            onChange={(e) =>
                              updateDispatchPlatformMetric(
                                dispatch.id,
                                'facebook',
                                'clicks',
                                e.target.value
                              )
                            }
                            className="w-full bg-[#0b0d10] border border-slate-800 px-1 sm:px-2 py-1 text-xs font-bold text-[#e2e8f0] text-center sm:text-left"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] sm:text-[10px] text-slate-400 mb-0.5 truncate text-center sm:text-left">
                            SUBS
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={fbSubs}
                            onChange={(e) =>
                              updateDispatchPlatformMetric(
                                dispatch.id,
                                'facebook',
                                'subscribers',
                                e.target.value
                              )
                            }
                            className="w-full bg-[#0b0d10] border border-slate-800 px-1 sm:px-2 py-1 text-xs font-bold text-[#86efac] text-center sm:text-left"
                          />
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            CTR: <strong className="text-[#60a5fa]">{fbCtr}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{fbConv}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#60a5fa] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(fbCtr) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, (Number(fbConv) * Number(fbCtr)) / 100 || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CyberPanel>
      </div>
    </div>
  );
}
