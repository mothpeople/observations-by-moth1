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
  const caption =
    item.caption ||
    item.text ||
    item.message ||
    item.postText ||
    item.content ||
    item.title ||
    item.name ||
    item.description ||
    item.video?.title ||
    item.video?.description ||
    '';

  const lowerCaption = caption.toLowerCase();
  let text = caption;
  if (!text || /^Facebook Post #\d+/i.test(text)) {
    if (
      lowerCaption.includes('meat grinder') ||
      item.url?.includes('/reel') ||
      item.type === 'video'
    ) {
      text = 'The Meat Grinder Needs More Meat...';
    } else if (
      lowerCaption.includes('watering grass') ||
      lowerCaption.includes('new story') ||
      lowerCaption.includes('observations by moth1')
    ) {
      text = 'Observations by Moth1 is a new story...';
    } else {
      text = caption || `Facebook Post #${idx + 1}`;
    }
  }

  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];

  // Support direct reel links or /reels endpoint from Apify dataset
  const directReelUrl =
    item.reelUrl ||
    item.reelsUrl ||
    item.videoUrl ||
    item.directUrl ||
    (item.reelId ? `https://www.facebook.com/reel/${item.reelId}` : '') ||
    (item.videoId ? `https://www.facebook.com/observationsbymoth1/videos/${item.videoId}` : '');

  const url =
    directReelUrl ||
    item.url ||
    item.postUrl ||
    item.topLevelUrl ||
    item.facebookUrl ||
    item.link ||
    'https://www.facebook.com/observationsbymoth1';

  // Fallback parser: Ensure views map from either playCount, videoViewCount, or fallback to views.
  const views =
    Number(
      item.playCount ??
        item.videoViewCount ??
        item.video_play_count ??
        item.video_view_count ??
        item.viewsCount ??
        item.views ??
        item.videoViews ??
        0
    ) || 0;

  // Fallback parser: If only reactions/likes exist, map likesCount/reactionCount to likes.
  const likes =
    Number(
      item.likes ??
        item.likesCount ??
        item.reactionsCount ??
        item.reactionCount ??
        item.reactions ??
        item.likes_count ??
        item.likeCount ??
        0
    ) || 0;

  const comments =
    Number(item.comments ?? item.commentsCount ?? item.commentCount ?? item.comments_count ?? 0) || 0;
  const shares =
    Number(item.shares ?? item.sharesCount ?? item.shareCount ?? item.shares_count ?? 0) || 0;
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

  const postType = String(item.type || item.postType || '').toLowerCase();
  const hasVideoUrl = Boolean(
    directReelUrl ||
      item.videoUrl ||
      item.reelUrl ||
      (url && (url.includes('/reel') || url.includes('/videos')))
  );

  const isReel = Boolean(
    item.isReel ||
      item.isVideo ||
      postType === 'video' ||
      postType === 'reel' ||
      hasVideoUrl
  );

  return {
    id: String(item.reelId || item.videoId || item.postId || item.id || `fb-${idx}`),
    text,
    caption: text,
    hashtags,
    // Dedicated page: https://www.facebook.com/observationsbymoth1 is 100% Observations by Moth1
    isObservationsPost: true,
    url,
    isReel,
    type: postType,
    publishedAt: item.time || item.timestamp || item.date || item.createdTime || item.publishedTime || null,
    views,
    likes,
    comments,
    shares,
    followers,
    pageName: item.pageName || item.user?.name || 'Observations by Moth1',
  };
}

export function isFacebookVideoReel(rawItem, item) {
  if (!rawItem && !item) return false;
  const target = item || rawItem;
  const raw = rawItem || item;

  const text = String(target.text || target.caption || raw.message || raw.text || raw.caption || '').trim();
  const lowerText = text.toLowerCase();

  // 1. Filter out fallback matching /Facebook Post #\d+/i
  if (/^Facebook Post #\d+/i.test(text)) {
    return false;
  }

  // 2. Filter out profile updates / cover uploads
  if (
    lowerText.includes('updated their cover photo') ||
    lowerText.includes('updated the cover photo') ||
    lowerText.includes('updated their profile picture') ||
    lowerText.includes('updated the profile picture') ||
    lowerText.includes('updated profile photo')
  ) {
    return false;
  }

  // 3. Filter out non-video post types: photo, status, album
  const postType = String(raw.type || raw.postType || target.type || '').toLowerCase();
  if (['photo', 'photos', 'status', 'album', 'profile_photo', 'cover_photo', 'avatar'].includes(postType)) {
    return false;
  }

  // 4. Positive video / reel indicators
  const url = String(target.url || raw.url || raw.postUrl || raw.link || '').toLowerCase();
  const directReelUrl = String(
    raw.reelUrl || raw.reelsUrl || raw.videoUrl || raw.directUrl || target.reelUrl || ''
  ).toLowerCase();

  const hasVideoUrl = Boolean(
    directReelUrl ||
    raw.videoUrl ||
    raw.reelUrl ||
    url.includes('/reel') ||
    url.includes('/videos')
  );

  const hasVideoObject = Boolean(
    raw.video ||
    (Array.isArray(raw.media) && raw.media.some((m) => String(m.type || '').toLowerCase() === 'video')) ||
    (Array.isArray(raw.attachments) && raw.attachments.some((a) => String(a.type || '').toLowerCase() === 'video'))
  );

  const hasVideoType = Boolean(
    raw.isVideo ||
    raw.isReel ||
    target.isReel ||
    postType === 'video' ||
    postType === 'reel' ||
    hasVideoObject ||
    hasVideoUrl
  );

  const playCount = Number(
    raw.playCount ??
    raw.videoViewCount ??
    raw.video_play_count ??
    raw.video_view_count ??
    raw.videoViews ??
    target.views ??
    0
  );

  const matchesKnownReelCaption =
    lowerText.includes('meat grinder') ||
    lowerText.includes('watering grass') ||
    lowerText.includes('observations by moth1 is a new story') ||
    lowerText.includes('billionaires panic') ||
    lowerText.includes('thunderstorm') ||
    lowerText.includes('issue-02') ||
    lowerText.includes('issue #02') ||
    lowerText.includes('issue-01') ||
    lowerText.includes('issue #01');

  // Must have a video signal or valid reel caption
  const isActualVideo = hasVideoType || hasVideoUrl || hasVideoObject || playCount > 0 || (matchesKnownReelCaption && postType !== 'photo');
  if (!isActualVideo) {
    return false;
  }

  // 5. Filter out empty timeline artifacts (views === 0 && likes === 0 && comments === 0 && shares === 0) unless it's a confirmed video reel link/caption
  const views = Number(target.views ?? raw.views ?? playCount) || 0;
  const likes = Number(target.likes ?? raw.likes ?? raw.likesCount ?? 0) || 0;
  const comments = Number(target.comments ?? raw.comments ?? raw.commentsCount ?? 0) || 0;
  const shares = Number(target.shares ?? raw.shares ?? raw.sharesCount ?? 0) || 0;

  if (views === 0 && likes === 0 && comments === 0 && shares === 0 && !hasVideoUrl && !matchesKnownReelCaption) {
    return false;
  }

  return true;
}

export function sortFacebookReelsForDisplay(items) {
  return [...items].sort((a, b) => {
    const textA = `${a.text || ''} ${a.caption || ''} ${a.url || ''}`.toLowerCase();
    const textB = `${b.text || ''} ${b.caption || ''} ${b.url || ''}`.toLowerCase();

    // Row 1: Issue 02 ("The Meat Grinder Needs More Meat...") -> Score 2
    // Row 2: Issue 01 ("Observations by Moth1 is a new story...") -> Score 1
    const getScore = (text) => {
      if (
        text.includes('meat grinder') ||
        text.includes('issue-02') ||
        text.includes('issue 02') ||
        text.includes('issue #02') ||
        text.includes('billionaires panic')
      ) {
        return 2;
      }
      if (
        text.includes('observations by moth1 is a new story') ||
        text.includes('watering grass') ||
        text.includes('thunderstorm') ||
        text.includes('issue-01') ||
        text.includes('issue 01') ||
        text.includes('issue #01')
      ) {
        return 1;
      }
      return 0;
    };

    const scoreA = getScore(textA);
    const scoreB = getScore(textB);

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Issue 02 (score 2) appears in Row 1, Issue 01 (score 1) in Row 2
    }

    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });
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
    return {
      connected: false,
      error: 'No Vercel Token provided. Enter your Vercel Token in API Tokens or set VERCEL_TOKEN environment variable.',
    };
  }

  const cleanToken = String(vercelToken).trim();
  const headers = {
    Authorization: `Bearer ${cleanToken}`,
    Accept: 'application/json',
  };

  try {
    let resolvedProjectId = (vercelProjectId || '').trim();
    let resolvedProjectName = '';

    // Auto-discover Project ID if not explicitly specified
    if (!resolvedProjectId) {
      const projUrl = new URL('https://api.vercel.com/v9/projects');
      if (vercelTeamId) projUrl.searchParams.set('teamId', String(vercelTeamId).trim());
      const projRes = await fetch(projUrl.toString(), { headers });
      if (projRes.ok) {
        const projData = await projRes.json();
        const projectList = Array.isArray(projData.projects) ? projData.projects : [];
        const found =
          projectList.find((p) => p.link?.repo?.toLowerCase() === 'observations-by-moth1') ||
          projectList.find((p) => p.name?.toLowerCase() === 'observations-by-moth1') ||
          projectList.find((p) => p.name?.toLowerCase() === 'scrollytelling-exploration-engine') ||
          projectList.find((p) => (p.targets?.production?.alias || []).includes('observations.moth1.xyz')) ||
          projectList.find((p) => p.targets?.production?.domain === 'observations.moth1.xyz') ||
          projectList.find((p) => (p.domains || []).some((d) => (d.name || d) === 'observations.moth1.xyz')) ||
          projectList.find((p) => p.name?.toLowerCase().includes('observations')) ||
          projectList[0];

        if (found) {
          resolvedProjectId = found.id;
          resolvedProjectName = found.name;
        }
      } else {
        const errText = await projRes.text().catch(() => '');
        return {
          connected: false,
          error: `Vercel /v9/projects API returned HTTP ${projRes.status}: ${errText.slice(0, 120)}`,
        };
      }
    }

    if (!resolvedProjectId) {
      return {
        connected: false,
        error: 'Could not resolve Vercel project ID. Please provide Vercel Project ID explicitly.',
      };
    }

    // Date range: last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const since = thirtyDaysAgo.toISOString();
    const until = now.toISOString();

    // 1. Query cumulative /visits/count
    let countPageviews = 0;
    let countVisitors = 0;
    try {
      const countUrl = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
      countUrl.searchParams.set('projectId', resolvedProjectId);
      if (vercelTeamId) countUrl.searchParams.set('teamId', String(vercelTeamId).trim());
      countUrl.searchParams.set('since', since);
      countUrl.searchParams.set('until', until);

      const cRes = await fetch(countUrl.toString(), { headers });
      if (cRes.ok) {
        const cJson = await cRes.json();
        const cData = cJson.data || cJson;
        countPageviews = Number(cData.pageviews || cData.totalPageviews || 0) || 0;
        countVisitors = Number(cData.visitors || cData.totalVisitors || 0) || 0;
      }
    } catch {
      // fallback to aggregate
    }

    // 2. Query dimensions via /visits/aggregate
    const fetchDimension = async (byField) => {
      try {
        const u = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
        u.searchParams.set('projectId', resolvedProjectId);
        if (vercelTeamId) u.searchParams.set('teamId', String(vercelTeamId).trim());
        u.searchParams.set('since', since);
        u.searchParams.set('until', until);
        u.searchParams.set('by', byField);
        u.searchParams.set('limit', '100');

        const r = await fetch(u.toString(), { headers });
        if (!r.ok) {
          // If ISO format failed, try millisecond timestamp format
          const altU = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
          altU.searchParams.set('projectId', resolvedProjectId);
          if (vercelTeamId) altU.searchParams.set('teamId', String(vercelTeamId).trim());
          altU.searchParams.set('since', String(thirtyDaysAgo.getTime()));
          altU.searchParams.set('until', String(now.getTime()));
          altU.searchParams.set('by', byField);
          altU.searchParams.set('limit', '100');

          const altR = await fetch(altU.toString(), { headers });
          if (!altR.ok) return [];
          const altJson = await altR.json();
          return Array.isArray(altJson.data) ? altJson.data : [];
        }
        const resJson = await r.json();
        return Array.isArray(resJson.data) ? resJson.data : [];
      } catch {
        return [];
      }
    };

    const [days, paths, referrers, countries, devices, osList, utmSources, utmMediums] = await Promise.all([
      fetchDimension('day'),
      fetchDimension('requestPath'),
      fetchDimension('referrerHostname'),
      fetchDimension('country'),
      fetchDimension('deviceType'),
      fetchDimension('osName'),
      fetchDimension('utmSource'),
      fetchDimension('utmMedium'),
    ]);

    const totalPageviews = Math.max(
      countPageviews,
      days.reduce((sum, d) => sum + (Number(d.pageviews) || 0), 0),
      paths.reduce((sum, p) => sum + (Number(p.pageviews) || 0), 0)
    );
    const totalVisitors = Math.max(
      countVisitors,
      days.reduce((sum, d) => sum + (Number(d.visitors) || 0), 0),
      paths.reduce((sum, p) => sum + (Number(p.visitors) || 0), 0)
    );

    return {
      connected: true,
      projectId: resolvedProjectId,
      projectName: resolvedProjectName,
      totalPageviews,
      totalVisitors,
      days,
      paths,
      referrers,
      countries,
      devices,
      osList,
      utmSources,
      utmMediums,
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
  const rawFacebookItems = apifyFacebook.items.map((item, i) =>
    normalizeFacebookItem(item, i)
  );

  // Strict Video-Only Filter for Facebook Scraper Data:
  // Excludes photos, status updates, cover/profile uploads, and zero-metric timeline artifacts.
  const filteredFacebookItems = rawFacebookItems.filter((item, i) =>
    isFacebookVideoReel(apifyFacebook.items[i], item)
  );

  // Sort: Row 1 = Issue 02 ("The Meat Grinder Needs More Meat..."), Row 2 = Issue 01 ("Observations by Moth1 is a new story...")
  const facebookItems = sortFacebookReelsForDisplay(filteredFacebookItems);

  const fbIssue02Item =
    facebookItems.find((i) => {
      const t = `${i.text || ''} ${i.caption || ''}`.toLowerCase();
      return (
        t.includes('meat grinder') ||
        t.includes('billionaires panic') ||
        t.includes('issue-02') ||
        t.includes('issue 02')
      );
    }) || (facebookItems.length >= 1 ? facebookItems[0] : null);

  const fbIssue01Item =
    facebookItems.find((i) => {
      const t = `${i.text || ''} ${i.caption || ''}`.toLowerCase();
      return (
        t.includes('watering grass') ||
        t.includes('new story') ||
        t.includes('thunderstorm') ||
        t.includes('issue-01') ||
        t.includes('issue 01')
      );
    }) || (facebookItems.length >= 2 ? facebookItems[1] : null);

  const facebookReels = [
    {
      id: 'fb-reel-02',
      issueId: '02',
      title: 'The Meat Grinder',
      views: fbIssue02Item?.views || 0,
      likes: fbIssue02Item?.likes || 0,
      comments: fbIssue02Item?.comments || 0,
      shares: fbIssue02Item?.shares || 0,
      status: fbIssue02Item ? 'Published' : 'Ready to Post',
      url: fbIssue02Item?.url || 'https://www.facebook.com/observationsbymoth1',
    },
    {
      id: 'fb-reel-01',
      issueId: '01',
      title: 'Watering Grass in a Thunderstorm',
      views: fbIssue01Item?.views || 0,
      likes: fbIssue01Item?.likes || 0,
      comments: fbIssue01Item?.comments || 0,
      shares: fbIssue01Item?.shares || 0,
      status: fbIssue01Item ? 'Published' : 'Ready to Post',
      url: fbIssue01Item?.url || 'https://www.facebook.com/observationsbymoth1',
    },
  ];

  const facebookFollowers = Math.max(
    0,
    ...apifyFacebook.items.map(
      (item) =>
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
        ) || 0
    )
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
      reels: facebookReels,
    },
    vercel: vercelAnalytics,
  });
}
