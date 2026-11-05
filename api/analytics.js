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
  x: 'apidojo~tweet-scraper',
};

export function isObservationsContent(text = '', hashtags = [], filterTag = '#ObservationsByMoth1') {
  const rawText = String(text || '').toLowerCase();
  const rawHashtags = (Array.isArray(hashtags) ? hashtags.map((h) => String(h).toLowerCase()).join(' ') : '').toLowerCase();
  const haystack = `${rawText} ${rawHashtags}`;
  const normalizedTag = (filterTag || '#ObservationsByMoth1').trim().toLowerCase();
  const tagWithoutHash = normalizedTag.replace(/^#/, '');

  if (normalizedTag && haystack.includes(normalizedTag)) return true;
  if (haystack.includes('#observationsbymoth1')) return true;

  if (
    Array.isArray(hashtags) &&
    hashtags.some((h) => {
      const clean = String(h).toLowerCase().replace(/^#/, '');
      return clean === tagWithoutHash || clean === 'observationsbymoth1';
    })
  ) {
    return true;
  }

  return (
    haystack.includes('observations.moth1.xyz') ||
    haystack.includes('observations by moth1') ||
    haystack.includes('the war no one was supposed to win') ||
    haystack.includes('the-war-no-one-was-supposed-to-win') ||
    haystack.includes('war on drugs') ||
    haystack.includes('war-on-drugs') ||
    haystack.includes('the meat grinder') ||
    haystack.includes('the-meat-grinder') ||
    haystack.includes('watering grass in a thunderstorm') ||
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
      item.follower_count ??
        item.followers_count ??
        item.followerCount ??
        item.followersCount ??
        item.followers ??
        item.user?.follower_count ??
        item.user?.followers_count ??
        item.user?.followersCount ??
        item.user?.followers ??
        item.author?.follower_count ??
        item.author?.followers_count ??
        item.author?.followersCount ??
        item.author?.followers ??
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
      lowerCaption.includes('war on drugs') ||
      lowerCaption.includes('war-on-drugs') ||
      lowerCaption.includes('the war no one was supposed to win') ||
      lowerCaption.includes('supposed to win') ||
      lowerCaption.includes('prohibition') ||
      lowerCaption.includes('portugal') ||
      lowerCaption.includes('rat park') ||
      lowerCaption.includes('issue-03') ||
      lowerCaption.includes('issue 03') ||
      lowerCaption.includes('issue #03') ||
      lowerCaption.includes('issue 3') ||
      lowerCaption.includes('issue #3')
    ) {
      text = 'The War No One Was Supposed to Win...';
    } else if (
      lowerCaption.includes('meat grinder') ||
      lowerCaption.includes('the-meat-grinder') ||
      lowerCaption.includes('billionaires panic') ||
      lowerCaption.includes('issue-02') ||
      lowerCaption.includes('issue 02') ||
      lowerCaption.includes('issue #02') ||
      lowerCaption.includes('issue 2') ||
      lowerCaption.includes('issue #2')
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

export function isTweetItem(item) {
  if (!item) return false;
  if (item.type === 'user') return false;
  const hasText = Boolean(
    item.full_text ||
    item.text ||
    item.tweetText ||
    item.content ||
    item.legacy?.full_text ||
    item.legacy?.text ||
    item.tweet?.legacy?.full_text ||
    item.tweet?.text ||
    item.note_tweet?.note_tweet_results?.result?.text
  );
  const hasTweetId = Boolean(
    item.id_str ||
    item.id ||
    item.tweetId ||
    item.legacy?.id_str ||
    item.tweet?.id_str ||
    item.tweet?.id
  );
  return hasText || (hasTweetId && item.type === 'tweet');
}

export function normalizeXItem(item, idx = 0) {
  const text = String(
    item.full_text ||
    item.text ||
    item.tweetText ||
    item.content ||
    item.legacy?.full_text ||
    item.legacy?.text ||
    item.tweet?.legacy?.full_text ||
    item.tweet?.text ||
    item.note_tweet?.note_tweet_results?.result?.text ||
    item.note ||
    ''
  ).trim();

  const id = String(
    item.id_str ||
    item.id ||
    item.tweetId ||
    item.legacy?.id_str ||
    item.legacy?.id ||
    item.tweet?.legacy?.id_str ||
    item.tweet?.id ||
    `x-${idx}`
  );
  const tweetIdForUrl = item.id_str || item.id || item.legacy?.id_str || item.tweet?.id || '';
  const url =
    item.url ||
    item.tweetUrl ||
    item.twitterUrl ||
    (tweetIdForUrl ? `https://x.com/Moth1NFTs/status/${tweetIdForUrl}` : 'https://x.com/Moth1NFTs');

  const conversationId = String(
    item.conversation_id_str ||
    item.conversation_id ||
    item.conversationId ||
    item.legacy?.conversation_id_str ||
    item.legacy?.conversation_id ||
    item.tweet?.legacy?.conversation_id_str ||
    item.in_reply_to_status_id_str ||
    item.inReplyToStatusId ||
    item.reply_to_tweet_id ||
    id
  );

  const inReplyToId = item.in_reply_to_status_id_str
    ? String(item.in_reply_to_status_id_str)
    : item.inReplyToStatusId
      ? String(item.inReplyToStatusId)
      : item.reply_to_tweet_id
        ? String(item.reply_to_tweet_id)
        : item.legacy?.in_reply_to_status_id_str
          ? String(item.legacy.in_reply_to_status_id_str)
          : null;

  const rawEntities =
    item.entities ||
    item.legacy?.entities ||
    item.tweet?.legacy?.entities ||
    item.tweet?.entities ||
    {};

  const hashtags = Array.isArray(rawEntities.hashtags)
    ? rawEntities.hashtags.map((h) => String(typeof h === 'string' ? h : h.text || h.tag || '').toLowerCase())
    : (Array.isArray(item.hashtags)
        ? item.hashtags.map((h) => String(h).toLowerCase())
        : (text.match(/#[\w\d_]+/g) || []).map((h) => h.toLowerCase()));

  // Views / Impressions
  const views = Number(
    item.viewCount ??
    item.viewsCount ??
    item.view_count ??
    item.views?.count ??
    item.views ??
    item.impressions ??
    item.impression_count ??
    item.impressionCount ??
    item.legacy?.view_count ??
    item.legacy?.views?.count ??
    item.tweet?.views?.count ??
    0
  ) || 0;

  // Likes
  const likes = Number(
    item.likeCount ??
    item.likesCount ??
    item.favorite_count ??
    item.favoriteCount ??
    item.like_count ??
    item.likes ??
    item.favorites ??
    item.legacy?.favorite_count ??
    item.legacy?.favourite_count ??
    item.tweet?.legacy?.favorite_count ??
    0
  ) || 0;

  // Retweets / Reposts + Quotes
  const retweets =
    (Number(
      item.retweetCount ??
      item.retweet_count ??
      item.retweets ??
      item.reposts ??
      item.repostCount ??
      item.legacy?.retweet_count ??
      item.tweet?.legacy?.retweet_count ??
      0
    ) || 0) +
    (Number(
      item.quoteCount ??
      item.quote_count ??
      item.quotes ??
      item.quotesCount ??
      item.legacy?.quote_count ??
      item.tweet?.legacy?.quote_count ??
      0
    ) || 0);

  // Replies / Comments
  const replies = Number(
    item.replyCount ??
    item.reply_count ??
    item.replies ??
    item.repliesCount ??
    item.comments ??
    item.commentCount ??
    item.commentsCount ??
    item.legacy?.reply_count ??
    item.tweet?.legacy?.reply_count ??
    0
  ) || 0;

  // Bookmarks
  const bookmarks = Number(
    item.bookmarkCount ??
    item.bookmark_count ??
    item.bookmarks ??
    item.legacy?.bookmark_count ??
    0
  ) || 0;

  // Publication date
  const publishedAt =
    item.createdAt ||
    item.created_at ||
    item.publishedAt ||
    item.published_at ||
    item.date ||
    item.timestamp ||
    item.time ||
    item.legacy?.created_at ||
    item.tweet?.legacy?.created_at ||
    null;

  // Author username & follower count
  const authorUsername = String(
    item.author?.userName ||
    item.author?.username ||
    item.author?.screen_name ||
    item.user?.userName ||
    item.user?.username ||
    item.user?.screen_name ||
    item.core?.user_results?.result?.legacy?.screen_name ||
    item.legacy?.screen_name ||
    item.userName ||
    item.username ||
    item.screen_name ||
    ''
  ).replace(/^@/, '');

  const authorFollowers = Number(
    item.author?.followersCount ??
    item.author?.followers ??
    item.author?.followers_count ??
    item.author?.followerCount ??
    item.user?.followersCount ??
    item.user?.followers ??
    item.user?.followers_count ??
    item.core?.user_results?.result?.legacy?.followers_count ??
    item.followersCount ??
    item.followers_count ??
    item.followers ??
    0
  ) || 0;

  return {
    id,
    conversationId,
    inReplyToId,
    text,
    hashtags,
    url,
    views,
    likes,
    retweets,
    replies,
    publishedAt,
    authorUsername,
    authorFollowers,
  };
}

export function aggregateXThreads(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) return [];

  const threadMap = new Map();
  for (const item of rawItems) {
    const convId = String(item.conversationId || item.id || '');
    if (!threadMap.has(convId)) {
      threadMap.set(convId, []);
    }
    threadMap.get(convId).push(item);
  }

  const mergedGroups = new Map();
  for (const [convId, groupTweets] of threadMap.entries()) {
    let targetKey = convId;
    for (const [otherKey, otherTweets] of threadMap.entries()) {
      if (otherKey !== convId) {
        const hasConnection = groupTweets.some(
          (t) => t.inReplyToId === otherKey || otherTweets.some((ot) => ot.id === t.inReplyToId)
        );
        if (hasConnection) {
          targetKey = otherKey;
          break;
        }
      }
    }
    if (!mergedGroups.has(targetKey)) {
      mergedGroups.set(targetKey, []);
    }
    mergedGroups.get(targetKey).push(...groupTweets);
  }

  const threads = [];
  for (const [convId, groupTweets] of mergedGroups.entries()) {
    const uniqueMap = new Map();
    for (const t of groupTweets) {
      uniqueMap.set(String(t.id), t);
    }
    const uniqueTweets = Array.from(uniqueMap.values());

    uniqueTweets.sort((a, b) => {
      const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return timeA - timeB;
    });

    const rootTweet = uniqueTweets[0];
    const finalTweet = uniqueTweets[uniqueTweets.length - 1];

    const combinedText = uniqueTweets.map((t) => t.text).join(' \n\n ');
    const allHashtags = Array.from(
      new Set(uniqueTweets.flatMap((t) => t.hashtags || []))
    );

    const totalViews = uniqueTweets.reduce((sum, t) => sum + (Number(t.views) || 0), 0);
    const totalLikes = uniqueTweets.reduce((sum, t) => sum + (Number(t.likes) || 0), 0);
    const totalRetweets = uniqueTweets.reduce((sum, t) => sum + (Number(t.retweets) || 0), 0);
    const totalReplies = uniqueTweets.reduce((sum, t) => sum + (Number(t.replies) || 0), 0);
    const maxAuthorFollowers = Math.max(
      0,
      ...uniqueTweets.map((t) => Number(t.authorFollowers) || 0)
    );

    const isThread = uniqueTweets.length > 1;

    threads.push({
      id: rootTweet.id || convId,
      conversationId: convId,
      text: rootTweet.text || finalTweet.text || 'X Thread',
      openingText: rootTweet.text,
      closingText: finalTweet.text,
      combinedText,
      hashtags: allHashtags,
      tweetCount: uniqueTweets.length,
      isThread,
      url: rootTweet.url || (rootTweet.id ? `https://x.com/Moth1NFTs/status/${rootTweet.id}` : 'https://x.com/Moth1NFTs'),
      views: totalViews,
      likes: totalLikes,
      retweets: totalRetweets,
      replies: totalReplies,
      authorFollowers: maxAuthorFollowers,
      authorUsername: rootTweet.authorUsername || finalTweet.authorUsername || 'Moth1NFTs',
      publishedAt: rootTweet.publishedAt || finalTweet.publishedAt,
      tweets: uniqueTweets,
    });
  }

  threads.sort((a, b) => {
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });

  return threads;
}

export function isFacebookVideoReel(rawItem, item) {
  if (!rawItem && !item) return false;
  const target = item || rawItem;
  const raw = rawItem || item;

  const text = String(
    target.text ||
    target.caption ||
    raw.message ||
    raw.text ||
    raw.caption ||
    raw.title ||
    raw.description ||
    ''
  ).trim();
  const lowerText = text.toLowerCase();

  // Exclude profile photo / cover photo updates
  if (
    lowerText.includes('updated their cover photo') ||
    lowerText.includes('updated the cover photo') ||
    lowerText.includes('updated their profile picture') ||
    lowerText.includes('updated the profile picture') ||
    lowerText.includes('updated profile photo')
  ) {
    return false;
  }

  // Known reel keyword match is ALWAYS accepted
  const matchesKnownReelCaption =
    lowerText.includes('war on drugs') ||
    lowerText.includes('war-on-drugs') ||
    lowerText.includes('the war no one was supposed to win') ||
    lowerText.includes('supposed to win') ||
    lowerText.includes('prohibition') ||
    lowerText.includes('portugal') ||
    lowerText.includes('rat park') ||
    lowerText.includes('issue-03') ||
    lowerText.includes('issue 03') ||
    lowerText.includes('issue #03') ||
    lowerText.includes('issue 3') ||
    lowerText.includes('issue #3') ||
    lowerText.includes('meat grinder') ||
    lowerText.includes('watering grass') ||
    lowerText.includes('observations by moth1') ||
    lowerText.includes('billionaires panic') ||
    lowerText.includes('thunderstorm') ||
    lowerText.includes('issue-02') ||
    lowerText.includes('issue 02') ||
    lowerText.includes('issue #02') ||
    lowerText.includes('issue 2') ||
    lowerText.includes('issue #2') ||
    lowerText.includes('issue-01') ||
    lowerText.includes('issue 01') ||
    lowerText.includes('issue #01') ||
    lowerText.includes('issue 1') ||
    lowerText.includes('issue #1');

  if (matchesKnownReelCaption) {
    return true;
  }

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

  const playCount = Number(
    raw.playCount ??
    raw.videoViewCount ??
    raw.video_play_count ??
    raw.video_view_count ??
    raw.viewsCount ??
    raw.videoViews ??
    target.views ??
    0
  );

  if (hasVideoUrl || playCount > 0 || raw.isVideo || raw.isReel || target.isReel) {
    return true;
  }

  // If text is present and not a generic placeholder
  if (text && !/^Facebook Post #\d+/i.test(text)) {
    return true;
  }

  return Boolean(hasVideoUrl || playCount > 0);
}

export function sortFacebookReelsForDisplay(items) {
  return [...items].sort((a, b) => {
    const textA = `${a.text || ''} ${a.caption || ''} ${a.url || ''}`.toLowerCase();
    const textB = `${b.text || ''} ${b.caption || ''} ${b.url || ''}`.toLowerCase();

    // Row 1: Issue 03 ("The War No One Was Supposed to Win...") -> Score 3
    // Row 2: Issue 02 ("The Meat Grinder Needs More Meat...") -> Score 2
    // Row 3: Issue 01 ("Observations by Moth1 is a new story...") -> Score 1
    const getScore = (text) => {
      if (
        text.includes('war on drugs') ||
        text.includes('war-on-drugs') ||
        text.includes('the war no one was supposed to win') ||
        text.includes('supposed to win') ||
        text.includes('prohibition') ||
        text.includes('portugal') ||
        text.includes('rat park') ||
        text.includes('issue-03') ||
        text.includes('issue 03') ||
        text.includes('issue #03') ||
        text.includes('issue 3') ||
        text.includes('issue #3')
      ) {
        return 3;
      }
      if (
        text.includes('meat grinder') ||
        text.includes('the-meat-grinder') ||
        text.includes('issue-02') ||
        text.includes('issue 02') ||
        text.includes('issue #02') ||
        text.includes('issue 2') ||
        text.includes('issue #2') ||
        text.includes('billionaires panic')
      ) {
        return 2;
      }
      if (
        text.includes('observations by moth1 is a new story') ||
        text.includes('watering grass') ||
        text.includes('watering-grass') ||
        text.includes('thunderstorm') ||
        text.includes('issue-01') ||
        text.includes('issue 01') ||
        text.includes('issue #01') ||
        text.includes('issue 1') ||
        text.includes('issue #1')
      ) {
        return 1;
      }
      return 0;
    };

    const scoreA = getScore(textA);
    const scoreB = getScore(textB);

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Issue 03 (score 3) in Row 1, Issue 02 (score 2) in Row 2, Issue 01 (score 1) in Row 3
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

async function fetchPlatformTelemetry(platformKey, primaryActorId, alternateActorIds = [], token) {
  if (!token) {
    return { connected: false, runInfo: null, items: [], followers: 0 };
  }

  const allActorIds = [primaryActorId, ...(alternateActorIds || [])];

  try {
    // 1. Fetch recent SUCCEEDED runs across the entire account (up to 50)
    let candidateRuns = [];
    try {
      const allRunsRes = await fetch(
        `https://api.apify.com/v2/actor-runs?desc=true&limit=50&token=${encodeURIComponent(token)}`
      );
      if (allRunsRes.ok) {
        const allRunsJson = await allRunsRes.json();
        const runsList = Array.isArray(allRunsJson?.data?.items) ? allRunsJson.data.items : [];
        candidateRuns = runsList.filter((r) => {
          if (r.status !== 'SUCCEEDED' || !r.defaultDatasetId) return false;
          const runAct = String(r.actId || r.options?.actId || '').toLowerCase();
          const runName = String(r.name || r.title || '').toLowerCase();
          const target = `${runAct} ${runName}`;

          if (platformKey === 'facebook') {
            return (
              target.includes('facebook') ||
              target.includes('posts-scraper') ||
              target.includes('pages-scraper') ||
              target.includes('reels')
            );
          }
          if (platformKey === 'instagram') {
            return target.includes('instagram') || target.includes('insta');
          }
          if (platformKey === 'threads') {
            return target.includes('threads');
          }
          if (platformKey === 'substack') {
            return target.includes('substack');
          }
          if (platformKey === 'x') {
            return (
              (target.includes('tweet') || target.includes('tweets')) &&
              !target.includes('user') &&
              !target.includes('profile')
            );
          }
          return allActorIds.some((id) => target.includes(id.toLowerCase().replace('~', '/')));
        });
      }
    } catch {}

    // Fallback: If no account-wide runs found, fetch directly from specific actor endpoints
    if (candidateRuns.length === 0) {
      for (const actId of allActorIds) {
        try {
          const listRes = await fetch(
            `https://api.apify.com/v2/acts/${actId}/runs?status=SUCCEEDED&limit=10&desc=true&token=${encodeURIComponent(token)}`
          );
          if (listRes.ok) {
            const listJson = await listRes.json();
            if (Array.isArray(listJson?.data?.items)) {
              candidateRuns.push(...listJson.data.items);
            }
          }
        } catch {}
      }
    }

    if (candidateRuns.length === 0) {
      return { connected: false, runInfo: null, items: [], followers: 0 };
    }

    // Sort newest first
    candidateRuns.sort(
      (a, b) => new Date(b.startedAt || b.createdAt || 0) - new Date(a.startedAt || a.createdAt || 0)
    );

    let latestRunInfo = null;
    let postItems = [];
    let maxFollowers = 0;

    // Inspect the datasets of recent matching runs (up to 8 runs to cover both profile and post runs)
    const runsToInspect = candidateRuns.slice(0, 8);
    for (const runData of runsToInspect) {
      const runInfo = {
        id: runData.id,
        status: runData.status,
        startedAt: runData.startedAt,
        finishedAt: runData.finishedAt,
        defaultDatasetId: runData.defaultDatasetId,
      };
      if (!latestRunInfo) latestRunInfo = runInfo;

      if (runInfo.defaultDatasetId) {
        try {
          const dsRes = await fetch(
            `https://api.apify.com/v2/datasets/${runInfo.defaultDatasetId}/items?token=${encodeURIComponent(token)}&clean=true`
          );
          if (dsRes.ok) {
            const parsed = await dsRes.json();
            if (Array.isArray(parsed) && parsed.length > 0) {
              for (const item of parsed) {
                // Follower metric discovery across all possible schema variations
                let f = 0;
                if (platformKey === 'facebook') {
                  f = Number(
                    item.followers ??
                      item.pageFollowersCount ??
                      item.pageFollowers ??
                      item.followersCount ??
                      item.pageLikesCount ??
                      item.pageLikes ??
                      item.likesCount ??
                      item.likes ??
                      item.pageInfo?.followersCount ??
                      item.pageInfo?.likesCount ??
                      item.user?.followersCount ??
                      0
                  ) || 0;
                } else if (platformKey === 'instagram') {
                  f = Number(
                    item.followersCount ??
                      item.followers ??
                      item.ownerFollowersCount ??
                      item.user?.followersCount ??
                      item.owner?.followersCount ??
                      item.profile?.followersCount ??
                      0
                  ) || 0;
                } else if (platformKey === 'threads') {
                  f = Number(
                    item.follower_count ??
                      item.followers_count ??
                      item.followerCount ??
                      item.followersCount ??
                      item.followers ??
                      item.user?.follower_count ??
                      item.user?.followers_count ??
                      item.user?.followersCount ??
                      item.user?.followers ??
                      item.author?.follower_count ??
                      item.author?.followers_count ??
                      item.author?.followersCount ??
                      item.author?.followers ??
                      item.profile?.follower_count ??
                      item.profile?.followers_count ??
                      item.profile?.followersCount ??
                      item.profile?.followers ??
                      0
                  ) || 0;
                } else if (platformKey === 'substack') {
                  f = Number(
                    item.subscribers ??
                      item.subscribersCount ??
                      item.subscriberCount ??
                      0
                  ) || 0;
                } else if (platformKey === 'x') {
                  const authorUser = String(
                    item.author?.userName ||
                    item.author?.username ||
                    item.author?.screen_name ||
                    item.user?.userName ||
                    item.user?.username ||
                    item.user?.screen_name ||
                    item.userName ||
                    item.username ||
                    item.screen_name ||
                    ''
                  ).toLowerCase().replace(/^@/, '');

                  const isTargetAuthor =
                    !authorUser ||
                    authorUser === 'moth1nfts' ||
                    authorUser.includes('moth1') ||
                    String(item.url || item.tweetUrl || '').toLowerCase().includes('moth1nfts');

                  if (isTargetAuthor) {
                    f = Number(
                      item.followers_count ??
                        item.followersCount ??
                        item.followers ??
                        item.user?.followers_count ??
                        item.user?.followersCount ??
                        item.user?.followers ??
                        item.author?.followers_count ??
                        item.author?.followersCount ??
                        item.author?.followers ??
                        item.profile?.followersCount ??
                        item.profile?.followers_count ??
                        item.profile?.followers ??
                        0
                    ) || 0;
                  }
                }

                if (f > maxFollowers) {
                  maxFollowers = f;
                }

                // If this is a post/reel/thread item, retain it for the feed
                // (Profile metadata items with no url/caption/views are treated as metadata only)
                if (platformKey === 'facebook') {
                  if (
                    item.url ||
                    item.postUrl ||
                    item.reelUrl ||
                    item.message ||
                    item.text ||
                    item.playCount ||
                    item.views ||
                    item.isReel ||
                    item.isVideo
                  ) {
                    postItems.push(item);
                  }
                } else if (platformKey === 'instagram') {
                  if (
                    item.url ||
                    item.shortCode ||
                    item.displayUrl ||
                    item.caption ||
                    item.views ||
                    item.likesCount
                  ) {
                    postItems.push(item);
                  }
                } else if (platformKey === 'threads') {
                  if (
                    item.url ||
                    item.code ||
                    item.text ||
                    item.replies ||
                    item.likes
                  ) {
                    postItems.push(item);
                  }
                } else if (platformKey === 'x') {
                  const authorUser = String(
                    item.author?.userName ||
                    item.author?.username ||
                    item.author?.screen_name ||
                    item.user?.userName ||
                    item.user?.username ||
                    item.user?.screen_name ||
                    item.userName ||
                    item.username ||
                    item.screen_name ||
                    ''
                  ).toLowerCase().replace(/^@/, '');

                  const isTargetAuthor =
                    !authorUser ||
                    authorUser === 'moth1nfts' ||
                    authorUser.includes('moth1') ||
                    String(item.url || item.tweetUrl || '').toLowerCase().includes('moth1nfts');

                  if (
                    isTargetAuthor && (
                      item.full_text ||
                      item.text ||
                      item.tweetText ||
                      item.url ||
                      item.id_str ||
                      item.id ||
                      item.viewCount ||
                      item.view_count ||
                      item.impressions
                    )
                  ) {
                    postItems.push(item);
                  }
                } else {
                  postItems.push(item);
                }
              }
            }
          }
        } catch {}
      }
    }

    return {
      connected: true,
      runInfo: latestRunInfo,
      items: postItems,
      followers: maxFollowers,
    };
  } catch {
    return { connected: false, runInfo: null, items: [], followers: 0 };
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
    let activeTeamId = (vercelTeamId || '').trim();

    // Auto-discover Project ID if not explicitly specified
    if (!resolvedProjectId) {
      // 1. Discover all possible contexts (personal + all teams the user belongs to)
      const teamContexts = [activeTeamId || null];
      try {
        const teamsRes = await fetch('https://api.vercel.com/v2/teams', { headers });
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          const teamsList = Array.isArray(teamsData.teams) ? teamsData.teams : [];
          for (const t of teamsList) {
            if (t.id && !teamContexts.includes(t.id)) {
              teamContexts.push(t.id);
            }
          }
        }
      } catch {
        // ignore
      }

      // 2. Search for the project across all contexts
      for (const tId of teamContexts) {
        if (resolvedProjectId) break;

        // Try direct name lookups first
        for (const candidateName of ['observations-by-moth1', 'scrollytelling-exploration-engine', 'observations']) {
          try {
            const directUrl = new URL(`https://api.vercel.com/v9/projects/${candidateName}`);
            if (tId) directUrl.searchParams.set('teamId', tId);
            const dRes = await fetch(directUrl.toString(), { headers });
            if (dRes.ok) {
              const dData = await dRes.json();
              if (dData?.id) {
                resolvedProjectId = dData.id;
                resolvedProjectName = dData.name || candidateName;
                if (tId) activeTeamId = tId;
                break;
              }
            }
          } catch {
            // continue
          }
        }

        if (resolvedProjectId) break;

        // If direct lookup didn't match, list projects in this context
        try {
          const projUrl = new URL('https://api.vercel.com/v9/projects');
          if (tId) projUrl.searchParams.set('teamId', tId);
          projUrl.searchParams.set('limit', '100');
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
              (teamContexts.length === 1 ? projectList[0] : null);

            if (found) {
              resolvedProjectId = found.id;
              resolvedProjectName = found.name;
              if (tId) activeTeamId = tId;
              break;
            }
          }
        } catch {
          // continue
        }
      }
    }

    if (!resolvedProjectId) {
      return {
        connected: false,
        error: 'Could not resolve Vercel project ID. Please provide Vercel Project ID explicitly in API Tokens.',
      };
    }

    // Date range: Vercel Hobby plan grants access to the latest 31 days of data.
    // Query maximum allowed window (~30.5 days) to capture all analytics up to the hobby plan limit.
    const now = new Date();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const maxHobbyWindowMs = 30.5 * 24 * 60 * 60 * 1000;
    const sinceMs = String(Math.floor(now.getTime() - maxHobbyWindowMs));
    const untilMs = String(now.getTime());
    const strictThirtyDaysMs = String(Math.floor(now.getTime() - thirtyDaysMs));

    // 1. Query cumulative /visits/count
    let countPageviews = 0;
    let countVisitors = 0;
    let countBounceRate = null;
    try {
      const countUrl = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
      countUrl.searchParams.set('projectId', resolvedProjectId);
      if (activeTeamId) countUrl.searchParams.set('teamId', activeTeamId);
      countUrl.searchParams.set('since', sinceMs);
      countUrl.searchParams.set('until', untilMs);

      let cRes = await fetch(countUrl.toString(), { headers });
      if (!cRes.ok) {
        // Fallback to strict 30-day window if the 30.5-day window hit the 31-day boundary
        const altCountUrl = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
        altCountUrl.searchParams.set('projectId', resolvedProjectId);
        if (activeTeamId) altCountUrl.searchParams.set('teamId', activeTeamId);
        altCountUrl.searchParams.set('since', strictThirtyDaysMs);
        altCountUrl.searchParams.set('until', untilMs);
        cRes = await fetch(altCountUrl.toString(), { headers });
      }

      if (cRes.ok) {
        const cJson = await cRes.json();
        const cData = cJson.data || cJson;
        countPageviews = Number(cData.pageviews || cData.totalPageviews || 0) || 0;
        countVisitors = Number(cData.visitors || cData.totalVisitors || 0) || 0;
        if (typeof cData.bounceRate === 'number') {
          countBounceRate = Math.round(cData.bounceRate);
        } else if (typeof cData.bounce_rate === 'number') {
          countBounceRate = Math.round(cData.bounce_rate);
        }
      }
    } catch {
      // fallback to aggregate
    }

    // 2. Query dimensions via /visits/aggregate
    const fetchDimension = async (byField) => {
      try {
        const u = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
        u.searchParams.set('projectId', resolvedProjectId);
        if (activeTeamId) u.searchParams.set('teamId', activeTeamId);
        u.searchParams.set('since', sinceMs);
        u.searchParams.set('until', untilMs);
        u.searchParams.set('by', byField);
        u.searchParams.set('limit', '100');

        let r = await fetch(u.toString(), { headers });
        if (!r.ok) {
          // If 30.5-day window failed, try strict 30-day window
          const altU = new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
          altU.searchParams.set('projectId', resolvedProjectId);
          if (activeTeamId) altU.searchParams.set('teamId', activeTeamId);
          altU.searchParams.set('since', strictThirtyDaysMs);
          altU.searchParams.set('until', untilMs);
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

    const [days, paths, referrers, countries, devices, osList, utmSources, utmMediums, utmCampaigns] = await Promise.all([
      fetchDimension('day'),
      fetchDimension('requestPath'),
      fetchDimension('referrerHostname'),
      fetchDimension('country'),
      fetchDimension('deviceType'),
      fetchDimension('osName'),
      fetchDimension('utmSource'),
      fetchDimension('utmMedium'),
      fetchDimension('utmCampaign'),
    ]);

    // Isolate and exclude /analytics dashboard visits so telemetry strictly measures pure publication readership
    const isAnalyticsRoute = (p) => {
      const clean = (p.requestPath || p.path || p.route || '')
        .split('?')[0]
        .replace(/\/+$/, '')
        .toLowerCase();
      return clean === '/analytics';
    };

    const analyticsEntries = (paths || []).filter(isAnalyticsRoute);
    const analyticsPageviews = analyticsEntries.reduce(
      (sum, p) => sum + (Number(p.pageviews) || 0),
      0
    );
    const analyticsVisitors = analyticsEntries.reduce(
      (sum, p) => sum + (Number(p.visitors) || 0),
      0
    );

    // Pure publication content paths (omitting /analytics dashboard hits)
    const contentPaths = (paths || []).filter((p) => !isAnalyticsRoute(p));
    const contentPathsViews = contentPaths.reduce(
      (sum, p) => sum + (Number(p.pageviews) || 0),
      0
    );
    const contentPathsVisitors = contentPaths.reduce(
      (sum, p) => sum + (Number(p.visitors) || 0),
      0
    );

    // Compute live totals incorporating real-time in-progress daily visits, subtracting /analytics dashboard visits
    // (Vercel's cached /visits/count rolls over daily, while daily aggregate includes real-time visits)
    const aggregateViews = Math.max(
      Math.max(0, days.reduce((sum, d) => sum + (Number(d.pageviews) || 0), 0) - analyticsPageviews),
      contentPathsViews
    );
    const aggregateVisitors = Math.max(
      Math.max(0, days.reduce((sum, d) => sum + (Number(d.visitors) || 0), 0) - analyticsVisitors),
      contentPathsVisitors
    );

    const totalPageviews = Math.max(
      Math.max(0, countPageviews - analyticsPageviews),
      aggregateViews
    );
    const totalVisitors = Math.max(
      Math.max(0, countVisitors - analyticsVisitors),
      aggregateVisitors
    );

    // Vercel Web Analytics REST API exposes pageviews and visitors, but restricts session bounceRate to the web console
    const bounceRate = countBounceRate;

    return {
      connected: true,
      projectId: resolvedProjectId,
      projectName: resolvedProjectName,
      totalPageviews,
      totalVisitors,
      bounceRate,
      analyticsExcluded: {
        pageviews: analyticsPageviews,
        visitors: analyticsVisitors,
      },
      days,
      paths: contentPaths,
      referrers,
      countries,
      devices,
      osList,
      utmSources,
      utmMediums,
      utmCampaigns,
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
    'Content-Type, X-Apify-Token, X-Vercel-Token, X-Vercel-Project-Id, X-Vercel-Team-Id, X-Moth1-Passcode, X-Dashboard-Key, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security Gate: Ensure the analytics endpoint is strictly restricted to the owner
  const rawAuth =
    req.headers['x-moth1-passcode'] ||
    req.headers['x-dashboard-key'] ||
    req.query?.passcode ||
    req.query?.key ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '');

  const passcode = String(rawAuth || '').trim().toLowerCase();
  const validPasscodes = ['moth1.siv', 'moth1'];
  const isAuthorized =
    validPasscodes.includes(passcode) ||
    (process.env.DASHBOARD_PASSCODE &&
      passcode === process.env.DASHBOARD_PASSCODE.trim().toLowerCase());

  if (!isAuthorized) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Private Telemetry • Access restricted. Valid owner passcode required.',
    });
  }

  try {
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
      apifyX,
      vercelAnalytics,
    ] = await Promise.all([
      fetchLiveSubstackArchive(),
      fetchPlatformTelemetry('substack', ACTORS.substack, [], apifyToken),
      fetchPlatformTelemetry('instagram', ACTORS.instagram, ['apify~instagram-profile-scraper'], apifyToken),
      fetchPlatformTelemetry('threads', ACTORS.threads, [], apifyToken),
      fetchPlatformTelemetry('facebook', ACTORS.facebook, ['apify~facebook-pages-scraper'], apifyToken),
      fetchPlatformTelemetry('x', ACTORS.x, ['apidojo~twitter-user-scraper', 'apify~tweet-scraper', 'quacker~twitter-scraper'], apifyToken),
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

    // Sort: Row 1 = Issue 03 ("The War No One Was Supposed to Win..."), Row 2 = Issue 02 ("The Meat Grinder Needs More Meat..."), Row 3 = Issue 01 ("Observations by Moth1 is a new story...")
    const facebookItems = sortFacebookReelsForDisplay(filteredFacebookItems);

    const fbIssue03Item =
      facebookItems.find((i) => {
        const t = `${i.text || ''} ${i.caption || ''}`.toLowerCase();
        return (
          t.includes('war on drugs') ||
          t.includes('war-on-drugs') ||
          t.includes('the war no one was supposed to win') ||
          t.includes('supposed to win') ||
          t.includes('prohibition') ||
          t.includes('portugal') ||
          t.includes('rat park') ||
          t.includes('issue-03') ||
          t.includes('issue 03') ||
          t.includes('issue #03') ||
          t.includes('issue 3') ||
          t.includes('issue #3')
        );
      }) || (facebookItems.length >= 3 ? facebookItems[0] : null);

    const fbIssue02Item =
      facebookItems.find((i) => {
        const t = `${i.text || ''} ${i.caption || ''}`.toLowerCase();
        return (
          t.includes('meat grinder') ||
          t.includes('the-meat-grinder') ||
          t.includes('billionaires panic') ||
          t.includes('issue-02') ||
          t.includes('issue 02') ||
          t.includes('issue #02') ||
          t.includes('issue 2') ||
          t.includes('issue #2')
        );
      }) || (facebookItems.length >= 3 ? facebookItems[1] : facebookItems.length >= 2 ? facebookItems[0] : null);

    const fbIssue01Item =
      facebookItems.find((i) => {
        const t = `${i.text || ''} ${i.caption || ''}`.toLowerCase();
        return (
          t.includes('watering grass') ||
          t.includes('watering-grass') ||
          t.includes('new story') ||
          t.includes('thunderstorm') ||
          t.includes('issue-01') ||
          t.includes('issue 01') ||
          t.includes('issue #01') ||
          t.includes('issue 1') ||
          t.includes('issue #1')
        );
      }) || (facebookItems.length >= 3 ? facebookItems[2] : facebookItems.length >= 2 ? facebookItems[1] : facebookItems.length >= 1 ? facebookItems[0] : null);

    const facebookReels = [
      {
        id: 'fb-reel-03',
        issueId: '03',
        title: 'The War No One Was Supposed to Win',
        views: Number(fbIssue03Item?.views) || 0,
        likes: Number(fbIssue03Item?.likes) || 0,
        comments: Number(fbIssue03Item?.comments) || 0,
        shares: Number(fbIssue03Item?.shares) || 0,
        status: fbIssue03Item ? 'Published' : 'Ready to Post',
        url: fbIssue03Item?.url || 'https://www.facebook.com/observationsbymoth1',
      },
      {
        id: 'fb-reel-02',
        issueId: '02',
        title: 'The Meat Grinder',
        views: Number(fbIssue02Item?.views) || 0,
        likes: Number(fbIssue02Item?.likes) || 0,
        comments: Number(fbIssue02Item?.comments) || 0,
        shares: Number(fbIssue02Item?.shares) || 0,
        status: fbIssue02Item ? 'Published' : 'Ready to Post',
        url: fbIssue02Item?.url || 'https://www.facebook.com/observationsbymoth1',
      },
      {
        id: 'fb-reel-01',
        issueId: '01',
        title: 'Watering Grass in a Thunderstorm',
        views: Number(fbIssue01Item?.views) || 0,
        likes: Number(fbIssue01Item?.likes) || 0,
        comments: Number(fbIssue01Item?.comments) || 0,
        shares: Number(fbIssue01Item?.shares) || 0,
        status: fbIssue01Item ? 'Published' : 'Ready to Post',
        url: fbIssue01Item?.url || 'https://www.facebook.com/observationsbymoth1',
      },
    ];

    const facebookFollowers = Math.max(
      apifyFacebook.followers || 0,
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
    const instagramFollowers = Math.max(
      apifyInstagram.followers || 0,
      ...instagramItems.map((item) => item.followers || 0)
    );
    const threadsFollowers = Math.max(
      apifyThreads.followers || 0,
      ...threadsItems.map((item) => item.followers || 0)
    );
    const substackSubscribers = Math.max(
      apifySubstack.followers || 0,
      ...substackPosts.map((item) => item.subscribers || 0)
    );
    const rawXItems = (apifyX.items || [])
      .filter(isTweetItem)
      .map((item, i) => normalizeXItem(item, i));
    const xThreads = aggregateXThreads(rawXItems);
    const xFollowers = Math.max(
      apifyX.followers || 0,
      ...rawXItems.map((item) => item.followers || 0)
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
      x: {
        actorId: 'apidojo/tweet-scraper',
        connected: apifyX.connected,
        runInfo: apifyX.runInfo,
        followers: xFollowers,
        items: xThreads,
        rawItemsCount: rawXItems.length,
      },
      vercel: vercelAnalytics,
    });
  } catch (err) {
    console.error('[/api/analytics error]:', err);
    return res.status(500).json({
      error: err.message,
    });
  }
}
