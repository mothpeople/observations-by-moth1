/**
 * Vercel Serverless Function: /api/analytics
 * Unified multi-actor Apify + Substack telemetry endpoint supporting:
 *   1. Substack: `automation-lab/substack-scraper` + Live Substack Archive API
 *   2. Instagram: `apify/instagram-scraper` (@moth1.siv)
 *   3. Threads: `automation-lab/threads-scraper` (@moth1.siv)
 *   4. Facebook: `apify/facebook-posts-scraper` (observationsbymoth1)
 */

const SUBSTACK_PUBLICATION_URL = 'https://observationsbymoth1.substack.com';

const ACTORS = {
  substack: 'automation-lab~substack-scraper',
  instagram: 'apify~instagram-scraper',
  threads: 'automation-lab~threads-scraper',
  facebook: 'apify~facebook-posts-scraper',
};

export function isObservationsContent(text = '', hashtags = [], filterTag = '#observations') {
  const haystack = `${text} ${(Array.isArray(hashtags) ? hashtags.join(' ') : '')}`.toLowerCase();
  const normalizedTag = (filterTag || '#observations').trim().toLowerCase();
  const tagWithoutHash = normalizedTag.replace(/^#/, '');

  if (normalizedTag && haystack.includes(normalizedTag)) return true;
  if (
    Array.isArray(hashtags) &&
    hashtags.some((h) => String(h).toLowerCase().replace(/^#/, '') === tagWithoutHash)
  ) {
    return true;
  }

  return (
    haystack.includes('#observations') ||
    haystack.includes('observations.moth1.xyz') ||
    haystack.includes('observationsbymoth1') ||
    haystack.includes('observations by moth1') ||
    haystack.includes('the-meat-grinder') ||
    haystack.includes('watering-grass-in-a-thunderstorm')
  );
}

export function normalizeSubstackItem(
  item,
  idx = 0,
  source = 'apify-substack-scraper'
) {
  const rawUrl =
    item.url ||
    item.postUrl ||
    item.canonical_url ||
    item.link ||
    SUBSTACK_PUBLICATION_URL;
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

export function normalizeInstagramItem(item, idx = 0) {
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
    isObservationsPost: isObservationsContent(caption, hashtags),
    url,
    publishedAt: item.timestamp || item.takenAt || item.date || null,
    views,
    likes,
    comments,
    ownerUsername: item.ownerUsername || item.username || item.owner?.username || '',
    followers,
    displayUrl: item.displayUrl || item.thumbnailUrl || null,
  };
}

export function normalizeThreadsItem(item, idx = 0) {
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
      item.reposts ??
        item.repostCount ??
        item.shares ??
        item.quotes ??
        0
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
    isObservationsPost: isObservationsContent(text, hashtags),
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

export function normalizeFacebookItem(item, idx = 0) {
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
        item.likes_count ??
        0
    ) || 0;
  const comments =
    Number(item.comments ?? item.commentsCount ?? item.commentCount ?? item.comments_count ?? 0) || 0;
  const shares =
    Number(item.shares ?? item.sharesCount ?? item.shareCount ?? item.shares_count ?? 0) || 0;
  const views =
    Number(
      item.viewsCount ??
        item.videoViewCount ??
        item.playCount ??
        item.views ??
        item.video_play_count ??
        item.video_view_count ??
        item.videoViews ??
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
    isObservationsPost: isObservationsContent(text, hashtags),
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

async function fetchLiveSubstackArchive() {
  try {
    const res = await fetch(
      `${SUBSTACK_PUBLICATION_URL}/api/v1/archive?sort=new&limit=25`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'ObservationsByMoth1-Analytics/1.0',
        },
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts)) return [];
    return posts.map((post, idx) =>
      normalizeSubstackItem(post, idx, 'substack-live-api')
    );
  } catch {
    return [];
  }
}

async function fetchActorLastDataset(actorId, token) {
  if (!token) {
    return { connected: false, runInfo: null, items: [] };
  }
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

async function fetchVercelAnalytics(vercelToken, vercelProjectId, vercelTeamId) {
  if (!vercelToken) {
    return { connected: false, error: 'No Vercel Token provided' };
  }

  const headers = {
    Authorization: `Bearer ${vercelToken}`,
    Accept: 'application/json',
  };

  try {
    let resolvedProjectId = vercelProjectId;

    // Auto-discover Project ID if not explicitly specified
    if (!resolvedProjectId) {
      const projUrl = new URL('https://api.vercel.com/v9/projects');
      if (vercelTeamId) projUrl.searchParams.set('teamId', vercelTeamId);
      const projRes = await fetch(projUrl.toString(), { headers });
      if (projRes.ok) {
        const projData = await projRes.json();
        const found = (projData.projects || []).find(
          (p) =>
            p.name === 'observations-by-moth1' ||
            p.name?.includes('observations') ||
            p.targets?.production?.domain === 'observations.moth1.xyz' ||
            (p.domains || []).some((d) => d.name === 'observations.moth1.xyz')
        ) || projData.projects?.[0];
        if (found) resolvedProjectId = found.id;
      }
    }

    if (!resolvedProjectId) {
      return { connected: false, error: 'Could not resolve Vercel project ID' };
    }

    // Date range: last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const since = thirtyDaysAgo.toISOString();
    const until = now.toISOString();

    const fetchDimension = async (byField) => {
      try {
        const u = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
        u.searchParams.set('projectId', resolvedProjectId);
        if (vercelTeamId) u.searchParams.set('teamId', vercelTeamId);
        u.searchParams.set('since', since);
        u.searchParams.set('until', until);
        u.searchParams.set('by', byField);

        const r = await fetch(u.toString(), { headers });
        if (!r.ok) return [];
        const resJson = await r.json();
        return Array.isArray(resJson.data) ? resJson.data : [];
      } catch {
        return [];
      }
    };

    const [paths, referrers, countries, devices, osList] = await Promise.all([
      fetchDimension('requestPath'),
      fetchDimension('referrerHostname'),
      fetchDimension('country'),
      fetchDimension('deviceType'),
      fetchDimension('osName'),
    ]);

    const totalPageviews = paths.reduce((sum, p) => sum + (Number(p.pageviews) || 0), 0);
    const totalVisitors = paths.reduce((sum, p) => sum + (Number(p.visitors) || 0), 0);

    return {
      connected: true,
      projectId: resolvedProjectId,
      totalPageviews,
      totalVisitors,
      paths,
      referrers,
      countries,
      devices,
      osList,
    };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Apify-Token, X-Vercel-Token, X-Vercel-Project-Id, X-Vercel-Team-Id'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const headerToken = req.headers['x-apify-token'];
  const queryToken = req.query?.apifyToken;
  const apifyToken =
    headerToken ||
    queryToken ||
    process.env.APIFY_TOKEN ||
    process.env.APIFY_API_TOKEN ||
    '';

  const vercelToken =
    req.headers['x-vercel-token'] ||
    req.query?.vercelToken ||
    process.env.VERCEL_TOKEN ||
    process.env.VERCEL_ACCESS_TOKEN ||
    '';
  const vercelProjectId =
    req.headers['x-vercel-project-id'] ||
    req.query?.vercelProjectId ||
    process.env.VERCEL_PROJECT_ID ||
    '';
  const vercelTeamId =
    req.headers['x-vercel-team-id'] ||
    req.query?.vercelTeamId ||
    process.env.VERCEL_TEAM_ID ||
    '';

  const [
    liveSubstack,
    apifySubstack,
    apifyInstagram,
    apifyThreads,
    apifyFacebook,
    vercelAnalytics,
  ] = await Promise.all([
    fetchLiveSubstackArchive(),
    fetchActorLastDataset(ACTORS.substack, apifyToken),
    fetchActorLastDataset(ACTORS.instagram, apifyToken),
    fetchActorLastDataset(ACTORS.threads, apifyToken),
    fetchActorLastDataset(ACTORS.facebook, apifyToken),
    fetchVercelAnalytics(vercelToken, vercelProjectId, vercelTeamId),
  ]);

  // Merge Substack live + Apify Substack
  const substackMap = new Map();
  for (const post of liveSubstack) {
    substackMap.set(post.slug || post.url || post.title, post);
  }
  for (const raw of apifySubstack.items) {
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
        source: 'apify+substack-merged',
      });
    } else {
      substackMap.set(key, item);
    }
  }
  const substackPosts = Array.from(substackMap.values());

  const instagramItems = apifyInstagram.items.map((item, i) =>
    normalizeInstagramItem(item, i)
  );
  const threadsItems = apifyThreads.items.map((item, i) =>
    normalizeThreadsItem(item, i)
  );
  const facebookItems = apifyFacebook.items.map((item, i) =>
    normalizeFacebookItem(item, i)
  );

  const instagramFollowers = instagramItems.reduce(
    (max, item) => Math.max(max, item.followers || 0),
    0
  );
  const facebookFollowers = facebookItems.reduce(
    (max, item) => Math.max(max, item.followers || 0),
    0
  );
  const threadsFollowers = threadsItems.reduce(
    (max, item) => Math.max(max, item.followers || 0),
    0
  );
  const substackSubscribers = substackPosts.reduce(
    (max, item) => Math.max(max, item.subscribers || 0),
    0
  );

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    apifyConfigured: Boolean(apifyToken),
    substack: {
      actorId: 'automation-lab/substack-scraper',
      connected: apifySubstack.connected,
      runInfo: apifySubstack.runInfo,
      apifyItemCount: apifySubstack.items.length,
      subscribers: substackSubscribers,
      posts: substackPosts,
    },
    instagram: {
      actorId: 'apify/instagram-scraper',
      connected: apifyInstagram.connected,
      runInfo: apifyInstagram.runInfo,
      followers: instagramFollowers,
      items: instagramItems,
    },
    threads: {
      actorId: 'automation-lab/threads-scraper',
      connected: apifyThreads.connected,
      runInfo: apifyThreads.runInfo,
      followers: threadsFollowers,
      items: threadsItems,
    },
    facebook: {
      actorId: 'apify/facebook-posts-scraper',
      connected: apifyFacebook.connected,
      runInfo: apifyFacebook.runInfo,
      followers: facebookFollowers,
      items: facebookItems,
    },
    vercel: vercelAnalytics,
  });
}
