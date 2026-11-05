import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Apple,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Cpu,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Filter,
  Gauge,
  Globe,
  KeyRound,
  Link2,
  Lock,
  MessageSquare,
  Monitor,
  Moon,
  Pin,
  Play,
  RefreshCw,
  Share2,
  Smartphone,
  Sparkles,
  Sun,
  Tablet,
  Timer,
  TrendingUp,
  User,
  X,
  Youtube,
  Zap,
} from 'lucide-react';
import CyberPanel from '../components/issue02/CyberPanel';
import { loadChannelLedger, saveChannelLedger } from '../utils/telemetry';

// Resolves country code or country name to native flag emoji
function getCountryFlag(countryCode) {
  if (!countryCode) return '🌐';
  const clean = countryCode.trim().toUpperCase();
  if (clean === 'UNKNOWN' || clean === 'OTHER') return '🌐';
  if (clean.length === 2 && /^[A-Z]{2}$/.test(clean)) {
    return String.fromCodePoint(...[...clean].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
  }
  const nameMap = {
    'UNITED STATES': '🇺🇸',
    USA: '🇺🇸',
    SINGAPORE: '🇸🇬',
    MALAYSIA: '🇲🇾',
    'UNITED KINGDOM': '🇬🇧',
    UK: '🇬🇧',
    INDIA: '🇮🇳',
    AUSTRALIA: '🇦🇺',
    GERMANY: '🇩🇪',
    CANADA: '🇨🇦',
    FRANCE: '🇫🇷',
    JAPAN: '🇯🇵',
    INDONESIA: '🇮🇩',
    NETHERLANDS: '🇳🇱',
    PHILIPPINES: '🇵🇭',
    VIETNAM: '🇻🇳',
    BRAZIL: '🇧🇷',
    SPAIN: '🇪🇸',
    ITALY: '🇮🇹',
    'SOUTH KOREA': '🇰🇷',
    'NEW ZEALAND': '🇳🇿',
    SWITZERLAND: '🇨🇭',
    SWEDEN: '🇸🇪',
  };
  return nameMap[clean] || '🌐';
}

// Brand platform logo pill for referrers
function ReferrerLogo({ hostname }) {
  const h = (hostname || '').toLowerCase();
  if (h.includes('instagram')) {
    return (
      <span className="w-4 h-4 rounded-sm bg-gradient-to-tr from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] flex items-center justify-center text-[9px] text-white font-black shrink-0">
        IG
      </span>
    );
  }
  if (h.includes('facebook') || h.includes('fb.me')) {
    return (
      <span className="w-4 h-4 rounded-sm bg-[#1877F2] flex items-center justify-center text-[10px] text-white font-black shrink-0">
        f
      </span>
    );
  }
  if (h.includes('threads')) {
    return (
      <span className="w-4 h-4 rounded-sm bg-[#121316] border border-neutral-700 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
        @
      </span>
    );
  }
  if (h.includes('substack')) {
    return (
      <span className="w-4 h-4 rounded-sm bg-[#FF6719] flex items-center justify-center text-[9px] text-white font-black shrink-0">
        S
      </span>
    );
  }
  if (h.includes('google')) {
    return (
      <span className="w-4 h-4 rounded-sm bg-white flex items-center justify-center text-[10px] text-[#4285F4] font-black shrink-0">
        G
      </span>
    );
  }
  if (h.includes('twitter') || h.includes('t.co') || h.includes('x.com')) {
    return (
      <span className="w-4 h-4 rounded-sm bg-black border border-neutral-700 flex items-center justify-center text-[9px] text-white font-bold shrink-0">
        𝕏
      </span>
    );
  }
  if (h.includes('linkedin')) {
    return (
      <span className="w-4 h-4 rounded-sm bg-[#0A66C2] flex items-center justify-center text-[9px] text-white font-black shrink-0">
        in
      </span>
    );
  }
  return (
    <span className="w-4 h-4 rounded-sm bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
      <Globe className="w-2.5 h-2.5" />
    </span>
  );
}

function DeviceIcon({ deviceType }) {
  const d = (deviceType || '').toLowerCase();
  if (d.includes('mobile') || d.includes('phone')) {
    return <Smartphone className="w-3.5 h-3.5 text-[#fda4af] shrink-0" />;
  }
  if (d.includes('tablet') || d.includes('ipad')) {
    return <Tablet className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />;
  }
  return <Monitor className="w-3.5 h-3.5 text-[#67e8f9] shrink-0" />;
}

function OsIcon({ osName }) {
  const o = (osName || '').toLowerCase();
  if (o.includes('ios') || o.includes('mac') || o.includes('apple')) {
    return <Apple className="w-3.5 h-3.5 text-[#e2e8f0] shrink-0" />;
  }
  if (o.includes('android')) {
    return <Smartphone className="w-3.5 h-3.5 text-[#86efac] shrink-0" />;
  }
  if (o.includes('windows')) {
    return <Monitor className="w-3.5 h-3.5 text-[#60a5fa] shrink-0" />;
  }
  if (o.includes('linux')) {
    return <Cpu className="w-3.5 h-3.5 text-[#fbbf24] shrink-0" />;
  }
  return <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
}

const APIFY_TOKEN_STORAGE_KEY = 'moth1_apify_token';
const VERCEL_TOKEN_STORAGE_KEY = 'moth1_vercel_token_v1';
const VERCEL_PROJECT_ID_STORAGE_KEY = 'moth1_vercel_project_id_v1';
const VERCEL_TEAM_ID_STORAGE_KEY = 'moth1_vercel_team_id_v1';
const APIFY_TARGETS_STORAGE_KEY = 'moth1_apify_targets_v2';
const OWNER_UNLOCK_STORAGE_KEY = 'moth1_owner_unlocked_v1';

const DEFAULT_TARGETS = {
  substackUrl: 'https://observationsbymoth1.substack.com',
  instagramHandle: 'moth1.siv',
  threadsHandle: 'moth1.siv',
  facebookUrl: 'https://www.facebook.com/observationsbymoth1',
  xHandle: 'Moth1NFTs',
  youtubeHandle: 'sivaraj.pragasm',
  youtubeChannelUrl: 'https://www.youtube.com/@sivaraj.pragasm',
  youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PLXNcetLtk5xU',
  filterTag: '#ObservationsByMoth1',
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
  instagramProfile: {
    id: 'apify~instagram-scraper',
    label: 'apify/instagram-scraper (profile details)',
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
  facebookPage: {
    id: 'apify~facebook-pages-scraper',
    label: 'apify/facebook-pages-scraper',
    accent: '#86efac',
  },
  x: {
    id: 'apidojo~tweet-scraper',
    label: 'apidojo/tweet-scraper',
    accent: '#e2e8f0',
  },
  xProfile: {
    id: 'apidojo~twitter-user-scraper',
    label: 'apidojo/twitter-user-scraper',
    accent: '#e2e8f0',
  },
};

function matchesObservationsFilter(item, filterTag = '#ObservationsByMoth1') {
  const rawText = `${item.caption || ''} ${item.text || ''} ${item.combinedText || ''}`.toLowerCase();
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];
  const rawHashtags = (hashtags.map((h) => String(h).toLowerCase()).join(' ')).toLowerCase();
  const haystack = `${rawText} ${rawHashtags}`;

  const rawNormalized = (filterTag || '#ObservationsByMoth1').trim().toLowerCase();
  const normalizedTag =
    rawNormalized === '#observations' || rawNormalized === 'observations'
      ? '#observationsbymoth1'
      : rawNormalized;
  const tagWithoutHash = normalizedTag.replace(/^#/, '');

  // 1. Direct hashtag match (#ObservationsByMoth1)
  if (normalizedTag && haystack.includes(normalizedTag)) return true;
  if (haystack.includes('#observationsbymoth1')) return true;

  if (
    hashtags.some((h) => {
      const clean = String(h).toLowerCase().replace(/^#/, '');
      return clean === tagWithoutHash || clean === 'observationsbymoth1';
    })
  ) {
    return true;
  }

  // 2. Direct publication domain or brand signature
  if (haystack.includes('observations.moth1.xyz')) return true;
  if (haystack.includes('observations by moth1')) return true;

  // 3. Exact issue title matches
  if (
    haystack.includes('the war no one was supposed to win') ||
    haystack.includes('the-war-no-one-was-supposed-to-win') ||
    haystack.includes('war on drugs') ||
    haystack.includes('war-on-drugs') ||
    haystack.includes('the meat grinder') ||
    haystack.includes('the-meat-grinder') ||
    haystack.includes('watering grass in a thunderstorm') ||
    haystack.includes('watering-grass-in-a-thunderstorm')
  ) {
    return true;
  }

  return false;
}

function matchItemToIssueId(item) {
  if (!item) return null;
  const idStr = String(item.id || item.issueId || '').toLowerCase();
  if (idStr.includes('03') || idStr.includes('war-on-drugs')) return '03';
  if (idStr.includes('02') || idStr.includes('meat-grinder')) return '02';
  if (idStr.includes('01') || idStr.includes('watering-grass')) return '01';

  const text = `${item.caption || ''} ${item.text || ''} ${item.title || ''} ${item.url || ''}`.toLowerCase();
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags.map((h) => String(h).toLowerCase()).join(' ') : '';
  const haystack = `${text} ${hashtags}`;

  if (
    haystack.includes('war on drugs') ||
    haystack.includes('war-on-drugs') ||
    haystack.includes('warondrugs') ||
    haystack.includes('the war no one was supposed to win') ||
    haystack.includes('the-war-no-one-was-supposed-to-win') ||
    haystack.includes('supposed to win') ||
    haystack.includes('prohibition') ||
    haystack.includes('portugal') ||
    haystack.includes('rat park') ||
    haystack.includes('ratpark') ||
    haystack.includes('trillion-dollar') ||
    haystack.includes('trillion dollar') ||
    haystack.includes('law 30/2000') ||
    haystack.includes('microdose') ||
    haystack.includes('overdose') ||
    haystack.includes('issue-03') ||
    haystack.includes('issue 03') ||
    haystack.includes('issue 3') ||
    haystack.includes('issue #03') ||
    haystack.includes('issue #3')
  ) {
    return '03';
  }

  if (
    haystack.includes('meat grinder') ||
    haystack.includes('the meat grinder') ||
    haystack.includes('the-meat-grinder') ||
    haystack.includes('meatgrinder') ||
    haystack.includes('billionaires panic') ||
    haystack.includes('venn diagram') ||
    haystack.includes('demographic black hole') ||
    haystack.includes('birth rate') ||
    haystack.includes('issue-02') ||
    haystack.includes('issue 02') ||
    haystack.includes('issue 2') ||
    haystack.includes('issue #02') ||
    haystack.includes('issue #2')
  ) {
    return '02';
  }

  if (
    haystack.includes('watering grass') ||
    haystack.includes('watering-grass') ||
    haystack.includes('watering grass in a thunderstorm') ||
    haystack.includes('watering-grass-in-a-thunderstorm') ||
    haystack.includes('thunderstorm') ||
    haystack.includes('bread and circus') ||
    haystack.includes('geriatric') ||
    haystack.includes('sidequest') ||
    haystack.includes('combine writing') ||
    haystack.includes('issue-01') ||
    haystack.includes('issue 01') ||
    haystack.includes('issue 1') ||
    haystack.includes('issue #01') ||
    haystack.includes('issue #1')
  ) {
    return '01';
  }

  return null;
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

function isTweetItem(item) {
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

function normalizeXItem(item, idx = 0) {
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
    bookmarks,
    publishedAt,
    authorUsername,
    authorFollowers,
  };
}

function aggregateXThreads(rawItems) {
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

function isFacebookVideoReel(rawItem, item) {
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

function getReelDisplayTitle(item, fallbackIdx = 0) {
  if (!item) return `Reel #${fallbackIdx + 1}`;
  const issueId = matchItemToIssueId(item);
  if (issueId === '03') return 'Issue #03: The War No One Was Supposed to Win';
  if (issueId === '02') return 'Issue #02: The Meat Grinder Needs More Meat';
  if (issueId === '01') return 'Issue #01: Watering Grass in a Thunderstorm';
  return item.title || item.text || item.caption || `Reel #${fallbackIdx + 1}`;
}

function sortReelsForDisplay(items) {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const issueA = matchItemToIssueId(a);
    const issueB = matchItemToIssueId(b);

    const scoreA = issueA === '03' ? 3 : issueA === '02' ? 2 : issueA === '01' ? 1 : 0;
    const scoreB = issueB === '03' ? 3 : issueB === '02' ? 2 : issueB === '01' ? 1 : 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Row 1 = Issue 03 (War on Drugs), Row 2 = Issue 02 (Meat Grinder), Row 3 = Issue 01 (Watering Grass)
    }

    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });
}

const sortFacebookReelsForDisplay = sortReelsForDisplay;

async function fetchDirectActorDataset(actorId, token) {
  if (!token) return { connected: false, runInfo: null, items: [] };
  try {
    // 1. Fetch recent SUCCEEDED runs (up to 10) in reverse chronological order
    let candidateRuns = [];
    const listRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/runs?status=SUCCEEDED&limit=10&desc=true&token=${encodeURIComponent(token)}`
    );
    if (listRes.ok) {
      const listJson = await listRes.json();
      if (Array.isArray(listJson?.data?.items)) {
        candidateRuns = listJson.data.items;
      }
    }

    // Fallback: If list endpoint was empty or failed, fetch /runs/last?status=SUCCEEDED
    if (candidateRuns.length === 0) {
      const runRes = await fetch(
        `https://api.apify.com/v2/acts/${actorId}/runs/last?status=SUCCEEDED&token=${encodeURIComponent(token)}`
      );
      if (runRes.ok) {
        const runJson = await runRes.json();
        if (runJson?.data) candidateRuns = [runJson.data];
      }
    }

    if (candidateRuns.length === 0) {
      return { connected: false, runInfo: null, items: [] };
    }

    // 2. Iterate through SUCCEEDED runs to find the latest run that actually contains dataset items
    let latestRunInfo = null;
    for (const runData of candidateRuns) {
      const runInfo = {
        id: runData.id,
        status: runData.status,
        startedAt: runData.startedAt,
        finishedAt: runData.finishedAt,
        defaultDatasetId: runData.defaultDatasetId,
      };

      if (!latestRunInfo) latestRunInfo = runInfo;

      if (runInfo.defaultDatasetId) {
        const dsRes = await fetch(
          `https://api.apify.com/v2/datasets/${runInfo.defaultDatasetId}/items?token=${encodeURIComponent(token)}&clean=true`
        );
        if (dsRes.ok) {
          const parsed = await dsRes.json();
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (actorId.includes('facebook')) {
              console.log('[Dashboard] Apify Facebook scraper run dataset found:', {
                runInfo,
                itemCount: parsed.length,
                firstItem: parsed[0],
              });
            }
            return { connected: true, runInfo, items: parsed };
          }
        }
      }
    }

    // 3. Fallback: If no items found via actor endpoint, query account-wide actor-runs & actor-tasks (captures task runs or alternative actor runs configured on Apify)
    const isFb = actorId.includes('facebook');
    const isX = actorId.includes('twitter') || actorId.includes('tweet') || actorId.includes('x');
    try {
      const allRunsRes = await fetch(
        `https://api.apify.com/v2/actor-runs?desc=true&limit=40&token=${encodeURIComponent(token)}`
      );
      if (allRunsRes.ok) {
        const allRunsJson = await allRunsRes.json();
        const runsList = Array.isArray(allRunsJson?.data?.items) ? allRunsJson.data.items : [];
        const matchingRuns = runsList.filter((r) => {
          if (r.status !== 'SUCCEEDED' || !r.defaultDatasetId) return false;
          const runAct = String(r.actId || r.options?.actId || '').toLowerCase();
          if (isFb) {
            if (actorId.includes('page')) {
              return runAct.includes('pages-scraper') || runAct.includes('page');
            }
            return (runAct.includes('posts-scraper') || runAct.includes('reels')) ||
              (runAct.includes('facebook') && !runAct.includes('pages-scraper'));
          }
          if (isX) {
            if (actorId.includes('user') || actorId.includes('profile')) {
              return runAct.includes('user') || runAct.includes('profile');
            }
            return (
              (runAct.includes('twitter') || runAct.includes('tweet') || runAct.includes('x.com')) &&
              !runAct.includes('user') &&
              !runAct.includes('profile')
            );
          }
          return runAct.includes(actorId.replace('~', '/').toLowerCase()) || runAct.includes(actorId.toLowerCase());
        });

        for (const r of matchingRuns) {
          const dsRes = await fetch(
            `https://api.apify.com/v2/datasets/${r.defaultDatasetId}/items?token=${encodeURIComponent(token)}&clean=true`
          );
          if (dsRes.ok) {
            const parsed = await dsRes.json();
            if (Array.isArray(parsed) && parsed.length > 0) {
              const runInfo = {
                id: r.id,
                status: r.status,
                startedAt: r.startedAt,
                finishedAt: r.finishedAt,
                defaultDatasetId: r.defaultDatasetId,
              };
              return { connected: true, runInfo, items: parsed };
            }
          }
        }
      }
    } catch {}

    // 4. Also check account actor-tasks
    try {
      const tasksRes = await fetch(
        `https://api.apify.com/v2/actor-tasks?limit=25&token=${encodeURIComponent(token)}`
      );
      if (tasksRes.ok) {
        const tasksJson = await tasksRes.json();
        const tasksList = Array.isArray(tasksJson?.data?.items) ? tasksJson.data.items : [];
        const matchingTasks = tasksList.filter((t) => {
          const tName = String(t.name || t.title || '').toLowerCase();
          const tAct = String(t.actId || '').toLowerCase();
          if (isFb) {
            return tName.includes('facebook') || tName.includes('reels') || tAct.includes('facebook');
          }
          if (isX) {
            return tName.includes('twitter') || tName.includes('tweet') || tAct.includes('twitter');
          }
          return tName.includes(actorId.toLowerCase()) || tAct.includes(actorId.toLowerCase());
        });

        for (const task of matchingTasks) {
          const taskRunsRes = await fetch(
            `https://api.apify.com/v2/actor-tasks/${task.id}/runs?status=SUCCEEDED&limit=5&desc=true&token=${encodeURIComponent(token)}`
          );
          if (taskRunsRes.ok) {
            const taskRunsJson = await taskRunsRes.json();
            const tRuns = Array.isArray(taskRunsJson?.data?.items) ? taskRunsJson.data.items : [];
            for (const r of tRuns) {
              if (r.defaultDatasetId) {
                const dsRes = await fetch(
                  `https://api.apify.com/v2/datasets/${r.defaultDatasetId}/items?token=${encodeURIComponent(token)}&clean=true`
                );
                if (dsRes.ok) {
                  const parsed = await dsRes.json();
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    const runInfo = {
                      id: r.id,
                      status: r.status,
                      startedAt: r.startedAt,
                      finishedAt: r.finishedAt,
                      defaultDatasetId: r.defaultDatasetId,
                    };
                    return { connected: true, runInfo, items: parsed };
                  }
                }
              }
            }
          }
        }
      }
    } catch {}

    return { connected: true, runInfo: latestRunInfo, items: [] };
  } catch {
    return { connected: false, runInfo: null, items: [] };
  }
}

// Pre-configured UTM links for Observations by Moth1 distribution campaigns
const PRECONFIGURED_UTM_LINKS = [
  // Issue #03: The War No One Was Supposed to Win
  {
    id: '03-instagram-story',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'instagram',
    platformLabel: 'Instagram Story',
    medium: 'story',
    campaign: 'issue-03',
    badge: 'IG Story',
    color: '#fda4af',
    description: 'Instagram 9:16 Reel/Story sticker link pointing to Issue #03',
  },
  {
    id: '03-facebook-story',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'facebook',
    platformLabel: 'Facebook Reel / Story',
    medium: 'story',
    campaign: 'issue-03',
    badge: 'FB Story',
    color: '#60a5fa',
    description: 'Facebook 9:16 Reel pinned comment or story link pointing to Issue #03',
  },
  {
    id: '03-x-thread',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'x',
    platformLabel: 'X (Twitter) Thread',
    medium: 'thread',
    campaign: 'issue-03',
    badge: '𝕏 Thread',
    color: '#e2e8f0',
    description: 'Final call-to-action link in the X thread on @Moth1NFTs for Issue #03',
  },
  {
    id: '03-x-video',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'x',
    platformLabel: 'X Video / Reel',
    medium: 'video',
    campaign: 'issue-03',
    badge: '𝕏 Video',
    color: '#67e8f9',
    description: 'Direct tweet accompanying 9:16 vertical video reel pointing to Issue #03',
  },
  {
    id: '03-threads-post',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'threads',
    platformLabel: 'Threads Post',
    medium: 'post',
    campaign: 'issue-03',
    badge: 'Threads Post',
    color: '#c084fc',
    description: 'Threads carousel or launch post link for Issue #03 dispatch',
  },
  {
    id: '03-youtube-profile',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'youtube',
    platformLabel: 'YouTube Profile / Bio',
    medium: 'profile',
    campaign: 'issue-03',
    badge: 'YT Profile',
    color: '#f87171',
    description: 'YouTube channel bio / link in profile pointing to Issue #03',
  },
  {
    id: '03-youtube-shorts',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'youtube',
    platformLabel: 'YouTube Shorts / Video',
    medium: 'shorts',
    campaign: 'issue-03',
    badge: 'YT Shorts',
    color: '#ef4444',
    description: 'Pinned comment or description tracking link for YouTube Short Issue #03',
  },
  {
    id: '03-youtube-community',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'youtube',
    platformLabel: 'YouTube Community Post',
    medium: 'community',
    campaign: 'issue-03',
    badge: 'YT Community',
    color: '#f87171',
    description: 'YouTube Community Tab update link pointing to Issue #03',
  },
  {
    id: '03-pinterest-pin',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'pinterest',
    platformLabel: 'Pinterest Pin Plate',
    medium: 'pin',
    campaign: 'issue-03',
    badge: 'Pinterest Pin',
    color: '#e60023',
    description: '1000×1500 Retina Infographic or Quote Pin link for Issue #03 on @moth1siv',
  },
  {
    id: '03-substack-post',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'substack',
    platformLabel: 'Substack Note / Post',
    medium: 'note',
    campaign: 'issue-03',
    badge: 'Substack Note',
    color: '#fbbf24',
    description: 'Substack Note or post link pointing to Issue #03 interactive essay',
  },
  {
    id: '03-substack-email',
    issueId: '03',
    issueTitle: 'Issue #03: The War No One Was Supposed to Win',
    slug: 'war-on-drugs',
    platform: 'substack',
    platformLabel: 'Substack Email Broadcast',
    medium: 'email',
    campaign: 'issue-03',
    badge: 'Substack Email',
    color: '#67e8f9',
    description: 'Email newsletter broadcast tracking link pointing to Issue #03',
  },

  // Issue #02: The Meat Grinder Needs More Meat
  {
    id: '02-instagram-story',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'instagram',
    platformLabel: 'Instagram Story',
    medium: 'story',
    campaign: 'issue-02',
    badge: 'IG Story',
    color: '#fda4af',
    description: 'Instagram 9:16 Reel/Story swipe-up or sticker link to Issue #02',
  },
  {
    id: '02-facebook-story',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'facebook',
    platformLabel: 'Facebook Reel / Story',
    medium: 'story',
    campaign: 'issue-02',
    badge: 'FB Story',
    color: '#60a5fa',
    description: 'Facebook 9:16 Reel pinned comment or story sticker link to Issue #02',
  },
  {
    id: '02-x-thread',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'x',
    platformLabel: 'X (Twitter) Thread',
    medium: 'thread',
    campaign: 'issue-02',
    badge: '𝕏 Thread',
    color: '#e2e8f0',
    description: 'Final call-to-action link in the 10-tweet summary thread on @Moth1NFTs for Issue #02',
  },
  {
    id: '02-x-video',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'x',
    platformLabel: 'X Video / Reel',
    medium: 'video',
    campaign: 'issue-02',
    badge: '𝕏 Video',
    color: '#67e8f9',
    description: 'Direct tweet accompanying 9:16 vertical video reel pointing to Issue #02',
  },
  {
    id: '02-threads-post',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'threads',
    platformLabel: 'Threads Post',
    medium: 'post',
    campaign: 'issue-02',
    badge: 'Threads Post',
    color: '#c084fc',
    description: 'Threads carousel or launch post link for Issue #02 dispatch',
  },
  {
    id: '02-youtube-profile',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'youtube',
    platformLabel: 'YouTube Profile / Bio',
    medium: 'profile',
    campaign: 'issue-02',
    badge: 'YT Profile',
    color: '#f87171',
    description: 'YouTube channel bio / link in profile pointing to Issue #02',
  },
  {
    id: '02-youtube-shorts',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'youtube',
    platformLabel: 'YouTube Shorts / Video',
    medium: 'shorts',
    campaign: 'issue-02',
    badge: 'YT Shorts',
    color: '#ef4444',
    description: 'Pinned comment or description tracking link for YouTube Short Issue #02',
  },
  {
    id: '02-youtube-community',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'youtube',
    platformLabel: 'YouTube Community Post',
    medium: 'community',
    campaign: 'issue-02',
    badge: 'YT Community',
    color: '#f87171',
    description: 'YouTube Community Tab update link pointing to Issue #02',
  },
  {
    id: '02-pinterest-pin',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'pinterest',
    platformLabel: 'Pinterest Pin Plate',
    medium: 'pin',
    campaign: 'issue-02',
    badge: 'Pinterest Pin',
    color: '#e60023',
    description: '1000×1500 Retina Infographic or Quote Pin link for Issue #02 on @moth1siv',
  },
  {
    id: '02-substack-post',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'substack',
    platformLabel: 'Substack Note / Post',
    medium: 'note',
    campaign: 'issue-02',
    badge: 'Substack Note',
    color: '#fbbf24',
    description: 'Substack Note or post link pointing to Issue #02 interactive essay',
  },
  {
    id: '02-substack-email',
    issueId: '02',
    issueTitle: 'Issue #02: The Meat Grinder Needs More Meat',
    slug: 'the-meat-grinder',
    platform: 'substack',
    platformLabel: 'Substack Email Broadcast',
    medium: 'email',
    campaign: 'issue-02',
    badge: 'Substack Email',
    color: '#67e8f9',
    description: 'Email newsletter broadcast tracking link pointing to Issue #02',
  },

  // Issue #01: Watering Grass in a Thunderstorm
  {
    id: '01-instagram-story',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'instagram',
    platformLabel: 'Instagram Story',
    medium: 'story',
    campaign: 'issue-01',
    badge: 'IG Story',
    color: '#fda4af',
    description: 'Instagram 9:16 Reel/Story swipe-up or sticker link to Issue #01',
  },
  {
    id: '01-facebook-story',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'facebook',
    platformLabel: 'Facebook Reel / Story',
    medium: 'story',
    campaign: 'issue-01',
    badge: 'FB Story',
    color: '#60a5fa',
    description: 'Facebook 9:16 Reel pinned comment or story sticker link to Issue #01',
  },
  {
    id: '01-x-thread',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'x',
    platformLabel: 'X (Twitter) Thread',
    medium: 'thread',
    campaign: 'issue-01',
    badge: '𝕏 Thread',
    color: '#e2e8f0',
    description: 'Final call-to-action link in the summary thread on @Moth1NFTs to Issue #01',
  },
  {
    id: '01-x-video',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'x',
    platformLabel: 'X Video / Reel',
    medium: 'video',
    campaign: 'issue-01',
    badge: '𝕏 Video',
    color: '#67e8f9',
    description: 'Direct tweet accompanying 9:16 vertical video reel pointing to Issue #01',
  },
  {
    id: '01-threads-post',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'threads',
    platformLabel: 'Threads Post',
    medium: 'post',
    campaign: 'issue-01',
    badge: 'Threads Post',
    color: '#c084fc',
    description: 'Threads carousel or launch post link for Issue #01 dispatch',
  },
  {
    id: '01-youtube-community',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'youtube',
    platformLabel: 'YouTube Community Post',
    medium: 'community',
    campaign: 'issue-01',
    badge: 'YT Community',
    color: '#f87171',
    description: 'YouTube Community Tab dispatch link to Issue #01',
  },
  {
    id: '01-youtube-shorts',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'youtube',
    platformLabel: 'YouTube Shorts / Video',
    medium: 'shorts',
    campaign: 'issue-01',
    badge: 'YT Shorts',
    color: '#ef4444',
    description: 'Pinned comment or description tracking link for YouTube Short Issue #01',
  },
  {
    id: '01-youtube-profile',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'youtube',
    platformLabel: 'YouTube Profile / Bio',
    medium: 'profile',
    campaign: 'issue-01',
    badge: 'YT Profile',
    color: '#f87171',
    description: 'YouTube channel bio / link in profile pointing to Issue #01',
  },
  {
    id: '01-pinterest-pin',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'pinterest',
    platformLabel: 'Pinterest Pin Plate',
    medium: 'pin',
    campaign: 'issue-01',
    badge: 'Pinterest Pin',
    color: '#e60023',
    description: '1000×1500 Retina Infographic or Protest Loop Pin link for Issue #01 on @moth1siv',
  },
  {
    id: '01-substack-post',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'substack',
    platformLabel: 'Substack Note / Post',
    medium: 'note',
    campaign: 'issue-01',
    badge: 'Substack Note',
    color: '#fbbf24',
    description: 'Substack Note or post link pointing to Issue #01 interactive essay',
  },
  {
    id: '01-substack-email',
    issueId: '01',
    issueTitle: 'Issue #01: Watering Grass in a Thunderstorm',
    slug: 'watering-grass-in-a-thunderstorm',
    platform: 'substack',
    platformLabel: 'Substack Email Broadcast',
    medium: 'email',
    campaign: 'issue-01',
    badge: 'Substack Email',
    color: '#67e8f9',
    description: 'Email newsletter broadcast tracking link pointing to Issue #01',
  },

  // Main Publication Landing Page
  {
    id: 'home-instagram-bio',
    issueId: 'home',
    issueTitle: 'Main Publication Landing Page',
    slug: '',
    platform: 'instagram',
    platformLabel: 'Instagram Bio Link',
    medium: 'bio',
    campaign: 'profile',
    badge: 'IG Bio',
    color: '#fda4af',
    description: 'Primary link in @moth1.siv Instagram bio pointing to publication root',
  },
  {
    id: 'home-youtube-bio',
    issueId: 'home',
    issueTitle: 'Main Publication Landing Page',
    slug: '',
    platform: 'youtube',
    platformLabel: 'YouTube Channel Bio Link',
    medium: 'bio',
    campaign: 'profile',
    badge: 'YT Bio',
    color: '#ef4444',
    description: 'Primary link in YouTube channel about/bio pointing to publication root',
  },
  {
    id: 'home-x-bio',
    issueId: 'home',
    issueTitle: 'Main Publication Landing Page',
    slug: '',
    platform: 'x',
    platformLabel: 'X (Twitter) Bio Link',
    medium: 'bio',
    campaign: 'profile',
    badge: '𝕏 Bio',
    color: '#e2e8f0',
    description: 'Primary link in @Moth1NFTs X profile bio pointing to publication root',
  },
  {
    id: 'home-threads-bio',
    issueId: 'home',
    issueTitle: 'Main Publication Landing Page',
    slug: '',
    platform: 'threads',
    platformLabel: 'Threads Bio Link',
    medium: 'bio',
    campaign: 'profile',
    badge: 'Threads Bio',
    color: '#c084fc',
    description: 'Primary link in @moth1.siv Threads profile pointing to publication root',
  },
];

export default function Dashboard() {
  const [ledger, setLedger] = useState(() => loadChannelLedger());
  const [loadingSync, setLoadingSync] = useState(true);
  const [runningActor, setRunningActor] = useState(null); // 'substack' | 'instagram' | 'threads' | 'facebook' | null
  const [statusMessage, setStatusMessage] = useState('');
  const [showApifyConfig, setShowApifyConfig] = useState(false);
  const [filterOnlyObservations, setFilterOnlyObservations] = useState(true);
  const [copiedLink, setCopiedLink] = useState('');
  const [editingPlatform, setEditingPlatform] = useState(null); // 'substack' | 'instagram' | 'threads' | 'facebook' | 'youtube' | null
  const [tempEditVal, setTempEditVal] = useState('');

  // Layout View Tabs & Filter States for Compact, Less-Scroll Experience
  const [activeMacroSection, setActiveMacroSection] = useState('analytics'); // 'analytics' | 'funnel'
  const [analyticsTab, setAnalyticsTab] = useState('website'); // 'website' | 'reels' | 'substack' | 'social' | 'all'
  const [socialPlatformTab, setSocialPlatformTab] = useState('all'); // 'all' | 'instagram' | 'facebook' | 'threads' | 'x' | 'youtube'
  const [utmLinksFilterIssue, setUtmLinksFilterIssue] = useState('all'); // 'all' | '03' | '02' | '01' | 'home'
  const [utmLinksFilterPlatform, setUtmLinksFilterPlatform] = useState('all'); // 'all' | 'instagram' | 'facebook' | 'x' | 'threads' | 'youtube' | 'pinterest' | 'substack'

  // Custom UTM Generator Form State
  const [customUtmIssue, setCustomUtmIssue] = useState('war-on-drugs');
  const [customUtmSource, setCustomUtmSource] = useState('instagram');
  const [customUtmMedium, setCustomUtmMedium] = useState('story');
  const [customUtmCampaign, setCustomUtmCampaign] = useState('issue-03');

  // Dark / Light Theme State with LocalStorage Persistence
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('moth1_dashboard_theme') || 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('moth1_dashboard_theme', nextTheme);
    }
  };

  const isLight = theme === 'light';

  const [apifyToken, setApifyToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(APIFY_TOKEN_STORAGE_KEY) || '';
  });

  const [vercelToken, setVercelToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(VERCEL_TOKEN_STORAGE_KEY) || '';
  });

  const [vercelProjectId, setVercelProjectId] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(VERCEL_PROJECT_ID_STORAGE_KEY) || '';
  });

  const [vercelTeamId, setVercelTeamId] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(VERCEL_TEAM_ID_STORAGE_KEY) || '';
  });

  const [vercelAnalytics, setVercelAnalytics] = useState(null);
  const [showVercelToken, setShowVercelToken] = useState(false);
  const [showApifyToken, setShowApifyToken] = useState(false);
  const [storyClickStats, setStoryClickStats] = useState(null);
  const [speedVitals, setSpeedVitals] = useState({
    lcp: null,
    cls: null,
    inp: null,
    fcp: null,
    ttfb: null,
    score: null,
    loading: true,
  });

  // Real-time Core Web Vitals measurement via browser Performance APIs (corresponds with @vercel/speed-insights intake)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lcpVal = null;
    let clsVal = 0;
    let fcpVal = null;
    let inpVal = null;
    let ttfbVal = null;

    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        ttfbVal = Math.round(nav.responseStart - nav.requestStart);
      }
    } catch {}

    try {
      const paintEntries = performance.getEntriesByType('paint');
      for (const entry of paintEntries) {
        if (entry.name === 'first-contentful-paint') {
          fcpVal = Math.round(entry.startTime);
        }
      }
    } catch {}

    let lcpObserver = null;
    try {
      if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
        lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            lcpVal = Math.round(lastEntry.startTime);
            triggerUpdate();
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    } catch {}

    let clsObserver = null;
    try {
      if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
        clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsVal += entry.value;
            }
          }
          triggerUpdate();
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      }
    } catch {}

    let inpObserver = null;
    try {
      if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('event')) {
        inpObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.duration) {
              inpVal = Math.round(Math.max(inpVal || 0, entry.duration));
            }
          }
          triggerUpdate();
        });
        inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      }
    } catch {}

    const calculateSpeedScore = (l, c, i, f, t) => {
      let score = 100;
      if (l !== null) {
        if (l > 4000) score -= 30;
        else if (l > 2500) score -= 15;
      }
      if (c !== null) {
        if (c > 0.25) score -= 25;
        else if (c > 0.1) score -= 10;
      }
      if (i !== null) {
        if (i > 500) score -= 20;
        else if (i > 200) score -= 10;
      }
      if (f !== null) {
        if (f > 3000) score -= 15;
        else if (f > 1800) score -= 7;
      }
      if (t !== null) {
        if (t > 1800) score -= 10;
        else if (t > 800) score -= 5;
      }
      return Math.max(0, Math.min(100, score));
    };

    const triggerUpdate = () => {
      const c = Number(clsVal.toFixed(3));
      const s = calculateSpeedScore(lcpVal, c, inpVal, fcpVal, ttfbVal);

      setSpeedVitals({
        lcp: lcpVal,
        cls: c,
        inp: inpVal,
        fcp: fcpVal,
        ttfb: ttfbVal,
        score: s,
        loading: false,
      });
    };

    const timer = setTimeout(triggerUpdate, 500);

    return () => {
      clearTimeout(timer);
      lcpObserver?.disconnect();
      clsObserver?.disconnect();
      inpObserver?.disconnect();
    };
  }, []);

  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if (isLocal) return true;
    return window.localStorage.getItem(OWNER_UNLOCK_STORAGE_KEY) === 'true';
  });
  const [unlockInput, setUnlockInput] = useState('');
  const [unlockError, setUnlockError] = useState('');

  const [targets, setTargets] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_TARGETS;
    try {
      const raw = window.localStorage.getItem(APIFY_TARGETS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed.xHandle || parsed.xHandle === 'moth1_siv') {
          parsed.xHandle = 'Moth1NFTs';
        }
        if (
          !parsed.filterTag ||
          parsed.filterTag.trim().toLowerCase() === '#observations' ||
          parsed.filterTag.trim().toLowerCase() === 'observations'
        ) {
          parsed.filterTag = '#ObservationsByMoth1';
        }
        return { ...DEFAULT_TARGETS, ...parsed };
      }
      return DEFAULT_TARGETS;
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
  const [xState, setXState] = useState({
    connected: false,
    runInfo: null,
    items: [],
    followers: 0,
  });
  const [youtubeState, setYoutubeState] = useState({
    connected: true,
    channel: {
      handle: 'sivaraj.pragasm',
      title: 'Sivaraj Pragasm (moth1)',
      subscribers: 6,
      totalViews: 1816,
      videoCount: 23,
    },
    playlist: {
      id: 'PLXNcetLtk5xU',
      title: 'Observations by Moth 1',
      url: 'https://www.youtube.com/playlist?list=PLXNcetLtk5xU',
    },
    videos: [
      {
        id: 'yt-shorts-03',
        videoId: '',
        issueId: '03',
        title: 'Issue 03: The War No One Was Supposed to Win',
        views: 0,
        likes: 0,
        comments: 0,
        url: 'https://www.youtube.com/@sivaraj.pragasm/shorts',
        trackingUrl: 'https://observations.moth1.xyz/war-on-drugs?utm_source=youtube&utm_medium=shorts&utm_campaign=issue-03',
      },
      {
        id: 'yt-shorts-02',
        videoId: 'XiAPHfIshfY',
        issueId: '02',
        title: 'Issue 02: The Meat Grinder Needs More Meat',
        views: 126,
        likes: 0,
        comments: 1,
        url: 'https://www.youtube.com/shorts/XiAPHfIshfY',
        trackingUrl: 'https://observations.moth1.xyz/the-meat-grinder?utm_source=youtube&utm_medium=profile&utm_campaign=issue-02',
      },
      {
        id: 'yt-shorts-01',
        videoId: 'tp6FqVQUO9w',
        issueId: '01',
        title: 'Issue 01: Watering Grass in a Thunderstorm',
        views: 62,
        likes: 0,
        comments: 1,
        url: 'https://www.youtube.com/shorts/tp6FqVQUO9w',
        trackingUrl: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=youtube&utm_medium=community&utm_campaign=issue-01',
      },
    ],
    lastSynced: null,
  });
  const [syncingYoutube, setSyncingYoutube] = useState(false);
  const [youtubeSyncSuccess, setYoutubeSyncSuccess] = useState(false);
  const [pinterestState, setPinterestState] = useState({
    connected: true,
    profile: {
      username: 'moth1siv',
      fullName: 'Moth1',
      about: 'Storyteller and creative strategist.',
      followers: 0,
      following: 0,
      createdPins: 0,
      savedPins: 4,
      boardsCount: 0,
      url: 'https://www.pinterest.com/moth1siv',
    },
    pins: ledger.pinterest?.pins || [],
    lastSynced: null,
  });
  const [syncingPinterest, setSyncingPinterest] = useState(false);
  const [pinterestSyncSuccess, setPinterestSyncSuccess] = useState(false);

  const syncAllTelemetry = useCallback(
    async (tokenOverride, vercelTokenOverride) => {
      setLoadingSync(true);
      const activeToken = (
        tokenOverride !== undefined ? tokenOverride : apifyToken
      ).trim();
      const activeVercelToken = (
        vercelTokenOverride !== undefined ? vercelTokenOverride : vercelToken
      ).trim();

      try {
        const headers = {
          'X-Moth1-Passcode': 'moth1.siv',
        };
        if (activeToken) headers['X-Apify-Token'] = activeToken;
        if (activeVercelToken) headers['X-Vercel-Token'] = activeVercelToken;
        if (vercelProjectId.trim()) headers['X-Vercel-Project-Id'] = vercelProjectId.trim();
        if (vercelTeamId.trim()) headers['X-Vercel-Team-Id'] = vercelTeamId.trim();

        // Fetch server /api/analytics, /api/track-story-click, /api/youtube-telemetry, /api/pinterest-telemetry + direct browser Apify datasets for all actors in parallel
        const [
          serverRes,
          storyClickRes,
          youtubeRes,
          pinterestRes,
          directSubstack,
          directInstagram,
          directThreads,
          directFacebook,
          directX,
          directXProfile,
        ] = await Promise.all([
          fetch('/api/analytics', { headers }).catch(() => null),
          fetch('/api/track-story-click').catch(() => null),
          fetch('/api/youtube-telemetry').catch(() => null),
          fetch('/api/pinterest-telemetry').catch(() => null),
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
          activeToken
            ? fetchDirectActorDataset(ACTORS.x.id, activeToken)
            : Promise.resolve(null),
          activeToken
            ? fetchDirectActorDataset(ACTORS.xProfile.id, activeToken)
            : Promise.resolve(null),
        ]);

        let serverJson = null;
        if (serverRes && serverRes.ok) {
          serverJson = await serverRes.json();
        }

        if (storyClickRes && storyClickRes.ok) {
          try {
            const clickJson = await storyClickRes.json();
            setStoryClickStats(clickJson);
          } catch {
            // ignore
          }
        }

        let ytApiData = null;
        if (youtubeRes && youtubeRes.ok) {
          try {
            ytApiData = await youtubeRes.json();
            if (ytApiData?.videos) {
              setYoutubeState((prev) => ({
                connected: true,
                channel: ytApiData.channel || prev.channel,
                playlist: ytApiData.playlist || prev.playlist,
                videos: ytApiData.videos,
                lastSynced: new Date().toLocaleTimeString(),
              }));
            }
          } catch {
            // ignore
          }
        }

        let pinApiData = null;
        if (pinterestRes && pinterestRes.ok) {
          try {
            pinApiData = await pinterestRes.json();
            if (pinApiData?.profile) {
              setPinterestState({
                connected: true,
                profile: pinApiData.profile,
                pins: pinApiData.pins || [],
                lastSynced: new Date().toLocaleTimeString(),
              });
            }
          } catch {
            // ignore
          }
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
          ...igItems.map((i) => i.followers || 0),
          ...(directInstagram?.items || []).map((i) => Number(i.followersCount ?? i.followers ?? 0) || 0)
        );

        setInstagramState((prev) => {
          const effectiveFollowers =
            igScrapedFollowers > 0
              ? igScrapedFollowers
              : prev.followers > 0
                ? prev.followers
                : ledger.instagram?.followers || 0;
          return {
            connected:
              Boolean(directInstagram?.connected) ||
              Boolean(serverJson?.instagram?.connected) ||
              prev.connected,
            runInfo:
              directInstagram?.runInfo || serverJson?.instagram?.runInfo || prev.runInfo,
            items: igItems.length > 0 ? igItems : (prev.items || []),
            followers: effectiveFollowers,
          };
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
          ...thItems.map((i) => i.followers || 0),
          ...(directThreads?.items || []).map((i) => Number(i.followers ?? i.followersCount ?? 0) || 0)
        );

        setThreadsState((prev) => {
          const effectiveFollowers =
            thScrapedFollowers > 0
              ? thScrapedFollowers
              : prev.followers > 0
                ? prev.followers
                : ledger.threads?.followers || 0;
          return {
            connected:
              Boolean(directThreads?.connected) ||
              Boolean(serverJson?.threads?.connected) ||
              prev.connected,
            runInfo:
              directThreads?.runInfo || serverJson?.threads?.runInfo || prev.runInfo,
            items: thItems.length > 0 ? thItems : (prev.items || []),
            followers: effectiveFollowers,
          };
        });

        // 4. Facebook Items (apify/facebook-posts-scraper + apify/facebook-pages-scraper)
        const directFbItems = (directFacebook?.items || []).map((item, i) =>
          normalizeFacebookItem(item, i)
        );
        const directValidReels = directFbItems.filter((item, i) =>
          isFacebookVideoReel(directFacebook?.items?.[i] || item, item)
        );

        const serverFbItems = (serverJson?.facebook?.items || []).filter((item) =>
          isFacebookVideoReel(item, item)
        );

        const serverFbReels = (serverJson?.facebook?.reels || []).map((r, i) => ({
          id: r.id || `fb-reel-${r.issueId || i}`,
          text: r.text || r.title || (r.issueId === '03' ? 'Issue 03 - The War No One Was Supposed to Win' : r.issueId === '02' ? 'Issue 02 - The Meat Grinder Needs More Meat' : 'Issue 01 - Watering Grass in a Thunderstorm'),
          caption: r.caption || r.title || '',
          url: r.url || 'https://www.facebook.com/observationsbymoth1',
          views: Number(r.views) || 0,
          likes: Number(r.likes) || 0,
          comments: Number(r.comments) || 0,
          shares: Number(r.shares) || 0,
          isReel: true,
          publishedAt: r.publishedAt || new Date().toISOString(),
        })).filter((r) => r.views > 0 || r.isReel);

        // Ensure all 3 publication issues (03, 02, 01) are always represented in Facebook reels
        const mergedFbMap = new Map();
        for (const r of (ledger.facebook?.reels || [])) {
          const issueId = r.issueId || matchItemToIssueId(r) || '01';
          mergedFbMap.set(issueId, {
            id: r.id || `fb-reel-${issueId}`,
            issueId,
            text: r.text || r.title || (issueId === '03' ? 'Issue 03 - The War No One Was Supposed to Win' : issueId === '02' ? 'Issue 02 - The Meat Grinder Needs More Meat' : 'Issue 01 - Watering Grass in a Thunderstorm'),
            caption: r.caption || r.title || '',
            url: r.url || 'https://www.facebook.com/observationsbymoth1',
            views: Number(r.views) || 0,
            likes: Number(r.likes) || 0,
            comments: Number(r.comments) || 0,
            shares: Number(r.shares) || 0,
            isReel: true,
            publishedAt: r.publishedAt || new Date().toISOString(),
          });
        }

        for (const r of serverFbReels) {
          const issueId = matchItemToIssueId(r) || r.issueId || '01';
          const existing = mergedFbMap.get(issueId) || {};
          mergedFbMap.set(issueId, { ...existing, ...r, issueId });
        }

        // Overlay live scraped reels from directFacebook / serverFbItems
        const scrapedReels = directValidReels.length > 0 ? directValidReels : serverFbItems;
        for (const item of scrapedReels) {
          const issueId = matchItemToIssueId(item);
          if (issueId) {
            const existing = mergedFbMap.get(issueId);
            mergedFbMap.set(issueId, {
              ...existing,
              ...item,
              id: item.id || existing?.id || `fb-reel-${issueId}`,
              issueId,
              text: item.text || existing?.text || item.title || (issueId === '03' ? 'Issue 03 - The War No One Was Supposed to Win' : issueId === '02' ? 'Issue 02 - The Meat Grinder Needs More Meat' : 'Issue 01 - Watering Grass in a Thunderstorm'),
              views: Math.max(existing?.views || 0, item.views || 0),
              likes: Math.max(existing?.likes || 0, item.likes || 0),
              comments: Math.max(existing?.comments || 0, item.comments || 0),
              shares: Math.max(existing?.shares || 0, item.shares || 0),
            });
          } else {
            mergedFbMap.set(item.id || `fb-item-${mergedFbMap.size}`, item);
          }
        }

        const candidateFbItems = Array.from(mergedFbMap.values());
        const fbItems = sortFacebookReelsForDisplay(candidateFbItems);

        const fbScrapedFollowers = Math.max(
          serverJson?.facebook?.followers || 0,
          ...directFbItems.map((i) => i.followers || 0),
          ...(directFacebook?.items || []).map((i) =>
            Number(
              i.pageFollowersCount ??
              i.pageFollowers ??
              i.followersCount ??
              i.pageLikesCount ??
              i.pageLikes ??
              i.likesCount ??
              i.likes ??
              i.pageInfo?.followersCount ??
              i.pageInfo?.likesCount ??
              0
            ) || 0
          )
        );

        setFacebookState((prev) => {
          const effectiveItems =
            fbItems.length > 0
              ? fbItems
              : prev.items?.length > 0
                ? prev.items
                : serverFbReels;
          const effectiveFollowers =
            fbScrapedFollowers > 0
              ? fbScrapedFollowers
              : prev.followers > 0
                ? prev.followers
                : ledger.facebook?.followers || 0;
          return {
            connected:
              Boolean(directFacebook?.connected) ||
              Boolean(serverJson?.facebook?.connected) ||
              prev.connected,
            runInfo:
              directFacebook?.runInfo || serverJson?.facebook?.runInfo || prev.runInfo,
            items: effectiveItems,
            followers: effectiveFollowers,
          };
        });

        // 5. X (Twitter) Items (apidojo/tweet-scraper + apidojo/twitter-user-scraper)
        const isTargetXUser = (item) => {
          const author = String(
            item.authorUsername ||
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
          if (!author) return true;
          return author === 'moth1nfts' || author.includes('moth1');
        };

        const rawXCandidateItems =
          directX?.items?.length > 0
            ? directX.items
            : (serverJson?.x?.items || []);

        const rawXItems = rawXCandidateItems
          .filter(isTweetItem)
          .map((item, i) => normalizeXItem(item, i));

        const directFollowerCandidates = [
          ...(directXProfile?.items || []),
          ...(directX?.items || []),
        ]
          .filter(isTargetXUser)
          .map((i) =>
            Number(
              i.followers_count ??
              i.followersCount ??
              i.followers ??
              i.user?.followers_count ??
              i.user?.followersCount ??
              i.author?.followers_count ??
              i.author?.followersCount ??
              0
            ) || 0
          );

        // Discard 536 from historical Apify run if present on serverJson
        const cleanServerXFollowers =
          Number(serverJson?.x?.followers) !== 536 ? (Number(serverJson?.x?.followers) || 0) : 0;

        const xScrapedFollowers = Math.max(
          cleanServerXFollowers,
          ...rawXItems.filter(isTargetXUser).map((i) => i.authorFollowers || 0),
          ...directFollowerCandidates
        );

        setXState((prev) => {
          const effectiveItems =
            rawXItems.length > 0
              ? rawXItems
              : prev.items?.length > 0
                ? prev.items
                : [];
          const effectiveFollowers =
            xScrapedFollowers > 0
              ? xScrapedFollowers
              : (prev.followers !== 536 ? (prev.followers || 0) : 0) ||
                (ledger.x?.followers !== 536 ? (ledger.x?.followers || 0) : 0);
          return {
            connected:
              Boolean(directX?.connected) ||
              Boolean(directXProfile?.connected) ||
              Boolean(serverJson?.x?.connected) ||
              prev.connected,
            runInfo:
              directX?.runInfo || directXProfile?.runInfo || serverJson?.x?.runInfo || prev.runInfo,
            items: effectiveItems,
            followers: effectiveFollowers,
          };
        });

        // 6. Vercel Web Analytics Cloud Metrics
        if (serverJson?.vercel) {
          setVercelAnalytics(serverJson.vercel);
        }

        // Automatically persist scraped followers / subscribers & Issue Reels to local ledger
        setLedger((prev) => {
          let changed = false;
          const next = { ...prev };

          // 1. Channel followers / subs
          if (igScrapedFollowers > 0 && prev.instagram?.followers !== igScrapedFollowers) {
            next.instagram = { ...next.instagram, followers: igScrapedFollowers };
            changed = true;
          }
          if (fbScrapedFollowers > 0 && prev.facebook?.followers !== fbScrapedFollowers) {
            next.facebook = { ...next.facebook, followers: fbScrapedFollowers };
            changed = true;
          }
          if (xScrapedFollowers > 0 && prev.x?.followers !== xScrapedFollowers) {
            next.x = { ...next.x, followers: xScrapedFollowers };
            changed = true;
          } else if (Number(next.x?.followers) === 536) {
            next.x = { ...next.x, followers: 0 };
            changed = true;
          }
          if (subScraped > 0 && prev.substackSubscribers !== subScraped) {
            next.substackSubscribers = subScraped;
            changed = true;
          }

          // 2. Auto-populate Instagram Issue Reels from scraped items
          if (igItems.length > 0 && Array.isArray(next.instagram?.reels)) {
            const updatedIgReels = next.instagram.reels.map((reel) => {
              if (Number(reel.views) === 35683) {
                reel.views = 0;
                reel.likes = 0;
                reel.comments = 0;
                changed = true;
              }
              const matchedItems = igItems.filter(
                (item) =>
                  matchesObservationsFilter(item, targets.filterTag || '#ObservationsByMoth1') &&
                  matchItemToIssueId(item) === reel.issueId
              );
              if (matchedItems.length === 0) return reel;

              const maxViews = Math.max(
                Number(reel.views) || 0,
                ...matchedItems.map((m) => m.views || 0)
              );
              const maxLikes = Math.max(
                Number(reel.likes) || 0,
                ...matchedItems.map((m) => m.likes || 0)
              );
              const maxComments = Math.max(
                Number(reel.comments) || 0,
                ...matchedItems.map((m) => m.comments || 0)
              );

              if (
                maxViews !== reel.views ||
                maxLikes !== reel.likes ||
                maxComments !== reel.comments
              ) {
                changed = true;
                return {
                  ...reel,
                  views: maxViews,
                  likes: maxLikes,
                  comments: maxComments,
                  status: 'Published',
                  isScrapedSync: true,
                };
              }
              return reel;
            });
            next.instagram = { ...next.instagram, reels: updatedIgReels };
          }

          // 3. Auto-populate Facebook Issue Reels from scraped items
          const fbCandidates = (
            fbItems.length > 0 ? fbItems : (directFacebook?.items || [])
          ).filter((i) => isFacebookVideoReel(i, i));
          if (fbCandidates.length > 0 && Array.isArray(next.facebook?.reels)) {
            // Sort FB candidates chronologically by published date/time (earliest -> newest)
            const parseFbTime = (item) => {
              const t = item.publishedAt || item.time || item.timestamp || item.date || item.createdTime || item.publishedTime;
              if (!t) return 0;
              const ms = new Date(t).getTime();
              return Number.isFinite(ms) ? ms : 0;
            };

            const sortedFbItems = [...fbCandidates].sort(
              (a, b) => parseFbTime(a) - parseFbTime(b)
            );

            const updatedFbReels = next.facebook.reels.map((reel) => {
              // Priority 1: Match by issueId helper or case-insensitive keyword check
              const matchedItems = fbCandidates.filter((item) => {
                if (matchItemToIssueId(item) === reel.issueId) return true;
                const text = `${item.caption || ''} ${item.text || ''} ${item.title || ''} ${item.url || ''}`.toLowerCase();
                const tags = Array.isArray(item.hashtags)
                  ? item.hashtags.map((h) => String(h).toLowerCase()).join(' ')
                  : '';
                const haystack = `${text} ${tags}`;

                if (reel.issueId === '03') {
                  return (
                    haystack.includes('war on drugs') ||
                    haystack.includes('war-on-drugs') ||
                    haystack.includes('the-war-no-one-was-supposed-to-win') ||
                    haystack.includes('supposed to win') ||
                    haystack.includes('prohibition') ||
                    haystack.includes('portugal') ||
                    haystack.includes('rat park') ||
                    haystack.includes('microdose') ||
                    haystack.includes('issue-03') ||
                    haystack.includes('issue 03') ||
                    haystack.includes('issue 3') ||
                    haystack.includes('issue #03') ||
                    haystack.includes('issue #3')
                  );
                }
                if (reel.issueId === '02') {
                  return (
                    haystack.includes('meat grinder') ||
                    haystack.includes('the-meat-grinder') ||
                    haystack.includes('issue-02') ||
                    haystack.includes('issue 02') ||
                    haystack.includes('issue 2') ||
                    haystack.includes('issue #02') ||
                    haystack.includes('issue #2') ||
                    haystack.includes('billionaires panic') ||
                    haystack.includes('venn diagram')
                  );
                }
                if (reel.issueId === '01') {
                  return (
                    haystack.includes('watering grass') ||
                    haystack.includes('watering-grass') ||
                    haystack.includes('thunderstorm') ||
                    haystack.includes('issue-01') ||
                    haystack.includes('issue 01') ||
                    haystack.includes('issue 1') ||
                    haystack.includes('issue #01') ||
                    haystack.includes('issue #1') ||
                    haystack.includes('bread and circus') ||
                    haystack.includes('sidequest')
                  );
                }
                return false;
              });

              // Priority 2: Direct chronological mapping if no keywords matched
              let effectiveMatches = matchedItems;
              if (effectiveMatches.length === 0) {
                if (reel.issueId === '03' && sortedFbItems.length >= 3) {
                  effectiveMatches = [sortedFbItems[2]];
                } else if (reel.issueId === '02' && sortedFbItems.length >= 2) {
                  effectiveMatches = [sortedFbItems[1]];
                } else if (reel.issueId === '01' && sortedFbItems.length >= 1) {
                  effectiveMatches = [sortedFbItems[0]];
                }
              }

              // Load persisted saves from localStorage
              const cleanIssue = String(reel.issueId || '01').padStart(2, '0');
              const localSavedSaves =
                typeof window !== 'undefined'
                  ? window.localStorage.getItem(`saves_fb_issue_${cleanIssue}`)
                  : null;
              const currentSaves =
                localSavedSaves !== null
                  ? (Number(localSavedSaves) || 0)
                  : (Number(reel.saves) || 0);

              if (effectiveMatches.length === 0) {
                if (reel.saves !== currentSaves) {
                  changed = true;
                  return { ...reel, saves: currentSaves };
                }
                return reel;
              }

              const maxViews = Math.max(
                Number(reel.views) || 0,
                ...effectiveMatches.map(
                  (m) =>
                    Number(
                      m.playCount ??
                        m.videoViewCount ??
                        m.video_play_count ??
                        m.video_view_count ??
                        m.viewsCount ??
                        m.views ??
                        m.videoViews ??
                        0
                    ) || 0
                )
              );
              const maxLikes = Math.max(
                Number(reel.likes) || 0,
                ...effectiveMatches.map(
                  (m) =>
                    Number(
                      m.likes ??
                        m.likesCount ??
                        m.reactionsCount ??
                        m.reactionCount ??
                        m.reactions ??
                        0
                    ) || 0
                )
              );
              const maxComments = Math.max(
                Number(reel.comments) || 0,
                ...effectiveMatches.map((m) => Number(m.comments ?? m.commentsCount ?? 0) || 0)
              );
              const maxShares = Math.max(
                Number(reel.shares) || 0,
                ...effectiveMatches.map((m) => Number(m.shares ?? m.sharesCount ?? 0) || 0)
              );

              if (
                maxViews !== reel.views ||
                maxLikes !== reel.likes ||
                maxComments !== reel.comments ||
                maxShares !== reel.shares ||
                currentSaves !== reel.saves ||
                !reel.isScrapedSync
              ) {
                changed = true;
                return {
                  ...reel,
                  views: maxViews,
                  likes: maxLikes,
                  comments: maxComments,
                  shares: maxShares,
                  saves: currentSaves,
                  status: 'Published',
                  isScrapedSync: true,
                };
              }
              return reel;
            });
            next.facebook = { ...next.facebook, reels: updatedFbReels };
          }

          // 4. Auto-ratchet Story Conversion Funnel from /api/track-story-click AND Vercel Referrers
          if (Array.isArray(next.storyFunnel?.dispatches)) {
            const vercelReferrers = Array.isArray(serverJson?.vercel?.referrers)
              ? serverJson.vercel.referrers
              : [];
            const vercelIg = vercelReferrers
              .filter((r) => (r.referrerHostname || '').toLowerCase().includes('instagram'))
              .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);
            const vercelFb = vercelReferrers
              .filter((r) => {
                const h = (r.referrerHostname || '').toLowerCase();
                return h.includes('facebook') || h.includes('fb.me');
              })
              .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);

            const updatedDispatches = next.storyFunnel.dispatches.map((d) => {
              const serverIgClicks = Number(storyClickStats?.issues?.[d.slug]?.instagram?.clicks || 0);
              const serverFbClicks = Number(storyClickStats?.issues?.[d.slug]?.facebook?.clicks || 0);
              const serverSubClicks = Number(storyClickStats?.issues?.[d.slug]?.substack?.clicks || 0);
              const serverMailClicks = Number(storyClickStats?.issues?.[d.slug]?.email?.clicks || 0);

              const currentIgClicks = Number(d.instagram?.entrances ?? d.instagram?.clicks ?? 0);
              const currentFbClicks = Number(d.facebook?.entrances ?? d.facebook?.clicks ?? 0);
              const currentSubClicks = Number(d.substack?.entrances ?? d.substack?.clicks ?? 0);
              const currentMailClicks = Number(d.email?.entrances ?? d.email?.clicks ?? 0);

              const igTarget = Math.max(currentIgClicks, serverIgClicks, d.slug === 'the-meat-grinder' ? vercelIg : 0);
              const fbTarget = Math.max(currentFbClicks, serverFbClicks, d.slug === 'the-meat-grinder' ? vercelFb : 0);
              const subTarget = Math.max(currentSubClicks, serverSubClicks);
              const mailTarget = Math.max(currentMailClicks, serverMailClicks);

              if (
                igTarget !== currentIgClicks ||
                fbTarget !== currentFbClicks ||
                subTarget !== currentSubClicks ||
                mailTarget !== currentMailClicks
              ) {
                changed = true;
                return {
                  ...d,
                  instagram: {
                    ...d.instagram,
                    entrances: igTarget,
                    clicks: igTarget,
                  },
                  facebook: {
                    ...d.facebook,
                    entrances: fbTarget,
                    clicks: fbTarget,
                  },
                  substack: {
                    ...d.substack,
                    entrances: subTarget,
                    clicks: subTarget,
                  },
                  email: {
                    ...d.email,
                    entrances: mailTarget,
                    clicks: mailTarget,
                  },
                };
              }
              return d;
            });
            next.storyFunnel = { ...next.storyFunnel, dispatches: updatedDispatches };
          }

          // 4. Auto-populate YouTube Shorts and channel metrics from YouTube Data API v3
          if (ytApiData) {
            const ytSubs = Number(ytApiData.channel?.subscribers) || 0;
            const ytTotViews = Number(ytApiData.channel?.totalViews) || 0;
            if (ytSubs > 0 && ytSubs !== next.youtube?.subscribers) {
              next.youtube = { ...next.youtube, subscribers: ytSubs };
              changed = true;
            }
            if (ytTotViews > 0 && ytTotViews !== next.youtube?.totalViews) {
              next.youtube = { ...next.youtube, totalViews: ytTotViews };
              changed = true;
            }
            if (Array.isArray(ytApiData.videos) && Array.isArray(next.youtube?.videos)) {
              const updatedYtVideos = next.youtube.videos.map((vid) => {
                const live = ytApiData.videos.find((v) => v.videoId === vid.videoId || v.issueId === vid.issueId);
                if (!live) return vid;
                const maxV = Math.max(Number(vid.views) || 0, Number(live.views) || 0);
                const maxL = Math.max(Number(vid.likes) || 0, Number(live.likes) || 0);
                const maxC = Math.max(Number(vid.comments) || 0, Number(live.comments) || 0);
                if (maxV !== vid.views || maxL !== vid.likes || maxC !== vid.comments) {
                  changed = true;
                  return { ...vid, views: maxV, likes: maxL, comments: maxC, title: live.title || vid.title };
                }
                return vid;
              });
              next.youtube = { ...next.youtube, videos: updatedYtVideos };
            }
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
    [apifyToken, vercelToken, vercelProjectId, vercelTeamId]
  );

  const syncYoutubeTelemetry = useCallback(async () => {
    setSyncingYoutube(true);
    setStatusMessage('Syncing live YouTube Shorts & channel metrics...');
    try {
      const res = await fetch('/api/youtube-telemetry');
      if (res.ok) {
        const data = await res.json();
        if (data?.videos) {
          const totViews = data.videos.reduce((s, v) => s + (Number(v.views) || 0), 0);
          setYoutubeState((prev) => ({
            connected: true,
            channel: data.channel || prev.channel,
            playlist: data.playlist || prev.playlist,
            videos: data.videos,
            lastSynced: new Date().toLocaleTimeString(),
          }));
          setLedger((prev) => {
            const next = { ...prev };
            let changed = false;
            const ytSubs = Number(data.channel?.subscribers) || 0;
            const ytTotViews = Number(data.channel?.totalViews) || 0;
            if (ytSubs > 0 && ytSubs !== next.youtube?.subscribers) {
              next.youtube = { ...next.youtube, subscribers: ytSubs };
              changed = true;
            }
            if (ytTotViews > 0 && ytTotViews !== next.youtube?.totalViews) {
              next.youtube = { ...next.youtube, totalViews: ytTotViews };
              changed = true;
            }
            if (Array.isArray(data.videos) && Array.isArray(next.youtube?.videos)) {
              const updatedYtVideos = next.youtube.videos.map((vid) => {
                const live = data.videos.find((v) => v.videoId === vid.videoId || v.issueId === vid.issueId);
                if (!live) return vid;
                const maxV = Math.max(Number(vid.views) || 0, Number(live.views) || 0);
                const maxL = Math.max(Number(vid.likes) || 0, Number(live.likes) || 0);
                const maxC = Math.max(Number(vid.comments) || 0, Number(live.comments) || 0);
                if (maxV !== vid.views || maxL !== vid.likes || maxC !== vid.comments) {
                  changed = true;
                  return { ...vid, views: maxV, likes: maxL, comments: maxC, title: live.title || vid.title };
                }
                return vid;
              });
              next.youtube = { ...next.youtube, videos: updatedYtVideos };
            }
            if (changed) {
              saveChannelLedger(next);
              return next;
            }
            return prev;
          });

          setYoutubeSyncSuccess(true);
          setTimeout(() => setYoutubeSyncSuccess(false), 4500);
          const v03Count = data.videos.find((v) => v.issueId === '03')?.views || 0;
          const v02Count = data.videos.find((v) => v.issueId === '02')?.views || 0;
          const v01Count = data.videos.find((v) => v.issueId === '01')?.views || 0;
          setStatusMessage(`✓ YouTube Synced: ${totViews.toLocaleString()} total Shorts views (Issue #03: ${v03Count}, Issue #02: ${v02Count}, Issue #01: ${v01Count})`);
          setTimeout(() => setStatusMessage(''), 6000);
        }
      }
    } catch {
      setStatusMessage('Notice: Connected using verified YouTube baseline.');
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setSyncingYoutube(false);
    }
  }, []);

  useEffect(() => {
    syncYoutubeTelemetry();
  }, [syncYoutubeTelemetry]);

  const syncPinterestTelemetry = useCallback(async () => {
    setSyncingPinterest(true);
    setStatusMessage('Syncing live Pinterest profile & pin metrics...');
    try {
      const res = await fetch('/api/pinterest-telemetry');
      if (res.ok) {
        const data = await res.json();
        if (data?.profile) {
          setPinterestState({
            connected: true,
            profile: data.profile,
            pins: data.pins || [],
            lastSynced: new Date().toLocaleTimeString(),
          });
          setLedger((prev) => {
            const next = { ...prev };
            let changed = false;
            const pinFollowers = Number(data.profile?.followers) || 0;
            if (pinFollowers !== next.pinterest?.followers) {
              next.pinterest = { ...next.pinterest, followers: pinFollowers };
              changed = true;
            }
            if (data.profile?.username && data.profile.username !== next.pinterest?.handle) {
              next.pinterest = { ...next.pinterest, handle: data.profile.username };
              changed = true;
            }
            if (changed) {
              saveChannelLedger(next);
              return next;
            }
            return prev;
          });

          setPinterestSyncSuccess(true);
          setTimeout(() => setPinterestSyncSuccess(false), 4500);
          setStatusMessage(`✓ Pinterest Synced: @${data.profile.username} (${data.profile.savedPins || 4} saved pins, ${data.profile.createdPins || 0} created pins, ${data.profile.followers || 0} followers)`);
          setTimeout(() => setStatusMessage(''), 6000);
        }
      }
    } catch {
      setStatusMessage('Notice: Connected using verified Pinterest baseline.');
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setSyncingPinterest(false);
    }
  }, []);

  useEffect(() => {
    syncPinterestTelemetry();
  }, [syncPinterestTelemetry]);

  useEffect(() => {
    if (isOwnerUnlocked) {
      syncAllTelemetry();
    }
  }, [isOwnerUnlocked, syncAllTelemetry]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const cleanedToken = apifyToken.trim();
    const cleanedVercel = vercelToken.trim();
    const cleanedProjectId = vercelProjectId.trim();
    const cleanedTeamId = vercelTeamId.trim();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(APIFY_TOKEN_STORAGE_KEY, cleanedToken);
      window.localStorage.setItem(VERCEL_TOKEN_STORAGE_KEY, cleanedVercel);
      window.localStorage.setItem(VERCEL_PROJECT_ID_STORAGE_KEY, cleanedProjectId);
      window.localStorage.setItem(VERCEL_TEAM_ID_STORAGE_KEY, cleanedTeamId);
      window.localStorage.setItem(
        APIFY_TARGETS_STORAGE_KEY,
        JSON.stringify(targets)
      );
    }
    setStatusMessage(
      'Saved telemetry credentials, Vercel token & channels! Syncing metrics...'
    );
    syncAllTelemetry(cleanedToken, cleanedVercel);
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

    if (actorKey === 'instagramProfile') {
      return {
        directUrls: [igUrl],
        usernames: [cleanIgHandle],
        resultsType: 'details',
      };
    }

    if (actorKey === 'facebook') {
      const cleanFbUrl = fbUrl.replace(/\/+$/, '');
      return {
        startUrls: [
          { url: cleanFbUrl },
          { url: `${cleanFbUrl}/reels/` },
          { url: `${cleanFbUrl}/videos/` },
        ],
        resultsLimit: 30,
        maxPosts: 30,
        proxyConfiguration: {
          useApifyProxy: true,
        },
      };
    }

    if (actorKey === 'facebookPage') {
      const cleanFbUrl = fbUrl.replace(/\/+$/, '');
      return {
        startUrls: [
          { url: cleanFbUrl },
        ],
        proxyConfiguration: {
          useApifyProxy: true,
        },
      };
    }

    if (actorKey === 'x') {
      const cleanXHandle = (targets.xHandle || 'Moth1NFTs').replace(/^@/, '').trim();
      return {
        twitterHandles: [cleanXHandle],
        startUrls: [`https://x.com/${cleanXHandle}`],
        maxItems: 40,
        sort: 'Latest',
      };
    }

    if (actorKey === 'xProfile') {
      const cleanXHandle = (targets.xHandle || 'Moth1NFTs').replace(/^@/, '').trim();
      return {
        twitterHandles: [cleanXHandle],
        startUrls: [`https://x.com/${cleanXHandle}`],
        maxItems: 1,
      };
    }

    // threads: automation-lab/threads-scraper
    return {
      mode: 'profile',
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
              const defaultDatasetId = statusJson?.data?.defaultDatasetId;
              let scrapedCount = 0;
              if (defaultDatasetId) {
                try {
                  const dsRes = await fetch(
                    `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${encodeURIComponent(cleanedToken)}&clean=true`
                  );
                  if (dsRes.ok) {
                    const parsed = await dsRes.json();
                    scrapedCount = Array.isArray(parsed) ? parsed.length : 0;
                  }
                } catch {}
              }
              setStatusMessage(
                `${actorMeta.label} finished (${scrapedCount} items returned from Apify).`
              );
              await syncAllTelemetry(cleanedToken);
              setTimeout(() => setStatusMessage(''), 6000);
              return;
            } else if (
              status === 'FAILED' ||
              status === 'ABORTED' ||
              status === 'TIMED-OUT'
            ) {
              clearInterval(pollInterval);
              setRunningActor(null);
              const errMsg = statusJson?.data?.statusMessage || statusJson?.data?.errorMessage || '';
              setStatusMessage(
                `${actorMeta.label} ended with status: ${status}${errMsg ? `: ${errMsg}` : ''}.`
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

  const getSavedSaves = (platform, issueId, fallback = 0) => {
    if (typeof window === 'undefined') return fallback;
    const prefix = platform === 'instagram' ? 'ig' : 'fb';
    const cleanIssue = String(issueId || '01').padStart(2, '0');
    const key = `saves_${prefix}_issue_${cleanIssue}`;
    const val = window.localStorage.getItem(key);
    return val !== null && val !== '' ? (Number(val) || 0) : fallback;
  };

  const handleUpdateSaves = (platform, reelId, issueId, val) => {
    const num = Math.max(0, Number(val) || 0);
    const prefix = platform === 'instagram' ? 'ig' : 'fb';
    const cleanIssue = String(issueId || '01').padStart(2, '0');
    const key = `saves_${prefix}_issue_${cleanIssue}`;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, String(num));
    }
    updateSocialReelMetric(platform, reelId, 'saves', num);
  };

  const updateFollowerCount = (platform, value) => {
    const num = Math.max(0, Number(value) || 0);
    if (platform === 'substack') {
      const updated = { ...ledger, substackSubscribers: num };
      setLedger(updated);
      saveChannelLedger(updated);
      setSubstackState((prev) => ({ ...prev, subscribers: num }));
      return;
    }
    if (platform === 'threads') {
      setThreadsState((prev) => ({ ...prev, followers: num }));
      return;
    }
    if (platform === 'youtube') {
      const updated = {
        ...ledger,
        youtube: {
          ...ledger.youtube,
          subscribers: num,
        },
      };
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
    if (platform === 'instagram') {
      setInstagramState((prev) => ({ ...prev, followers: num }));
    } else if (platform === 'facebook') {
      setFacebookState((prev) => ({ ...prev, followers: num }));
    } else if (platform === 'x') {
      setXState((prev) => ({ ...prev, followers: num }));
    } else if (platform === 'pinterest') {
      setPinterestState((prev) => ({
        ...prev,
        profile: { ...prev.profile, followers: num },
      }));
    }
  };

  const handleStartEditFollower = (platform, currentVal) => {
    setEditingPlatform(platform);
    setTempEditVal(String(currentVal || ''));
  };

  const handleSaveEditFollower = (platform) => {
    updateFollowerCount(platform, tempEditVal);
    setEditingPlatform(null);
  };

  const copyUtmLink = (slug, issueId, platform = 'instagram', medium = 'story') => {
    const origin =
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? window.location.origin
        : 'https://observations.moth1.xyz';
    const cleanIssue = String(issueId).padStart(2, '0');
    const link = `${origin}/${slug}?utm_source=${platform}&utm_medium=${medium}&utm_campaign=issue-${cleanIssue}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedLink(`${issueId}-${platform}-${medium}`);
      setTimeout(() => setCopiedLink(''), 2200);
    }
  };

  const copyDirectUrl = (url, linkKey) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(linkKey);
      setTimeout(() => setCopiedLink(''), 2200);
    }
  };

  // Filtered Social Items (#ObservationsByMoth1 filter)
  const activeFilterTag = targets.filterTag || '#ObservationsByMoth1';

  const visibleInstagramItems = sortReelsForDisplay(
    filterOnlyObservations
      ? instagramState.items.filter((item) =>
          matchesObservationsFilter(item, activeFilterTag)
        )
      : instagramState.items
  );

  const visibleThreadsItems = filterOnlyObservations
    ? threadsState.items.filter((item) =>
        matchesObservationsFilter(item, activeFilterTag)
      )
    : threadsState.items;

  // Strict Video-Only Filter & Display Sorting for Facebook Scraper Data (100% Pure Dynamic)
  const visibleFacebookItems = sortFacebookReelsForDisplay(
    (facebookState.items || []).filter((item) => isFacebookVideoReel(item, item))
  );

  // Resolve pageviews and visitors for a given route, aggregating all visits with query parameters (?utm_...) and trailing slashes
  const getRouteMetrics = (routePath) => {
    const targetPath = (routePath || '').split('?')[0].replace(/\/+$/, '') || '/';
    if (vercelAnalytics?.connected && Array.isArray(vercelAnalytics.paths)) {
      const matches = vercelAnalytics.paths.filter((p) => {
        const itemPath = (p.requestPath || p.path || p.route || '').split('?')[0].replace(/\/+$/, '') || '/';
        return itemPath === targetPath;
      });
      if (matches.length > 0) {
        return {
          pageviews: matches.reduce((sum, p) => sum + (Number(p.pageviews) || 0), 0),
          visitors: matches.reduce((sum, p) => sum + (Number(p.visitors) || 0), 0),
        };
      }
    }
    const fallback = ledger.website.routes.find((r) => r.path === routePath);
    return {
      pageviews: Number(fallback?.views) || 0,
      visitors: 0,
    };
  };

  // 100% Dynamic Aggregates directly from live Vercel Analytics API (Strictly isolating pure publication readership from /analytics dashboard visits)
  const clientAnalyticsExclusions = (() => {
    if (!vercelAnalytics?.connected || !Array.isArray(vercelAnalytics.paths)) {
      return { pageviews: 0, visitors: 0 };
    }
    const hits = vercelAnalytics.paths.filter((p) => {
      const clean = (p.requestPath || p.path || p.route || '').split('?')[0].replace(/\/+$/, '').toLowerCase();
      return clean === '/analytics';
    });
    return {
      pageviews: hits.reduce((s, p) => s + (Number(p.pageviews) || 0), 0),
      visitors: hits.reduce((s, p) => s + (Number(p.visitors) || 0), 0),
    };
  })();

  const rawWebViews =
    vercelAnalytics?.connected && typeof vercelAnalytics.totalPageviews === 'number'
      ? vercelAnalytics.totalPageviews
      : ledger.website.routes.reduce((sum, r) => sum + (Number(r.views) || 0), 0);
  const alreadyExcludedViews = Number(vercelAnalytics?.analyticsExcluded?.pageviews || 0);
  const totalWebViews = Math.max(0, rawWebViews - (alreadyExcludedViews === 0 ? clientAnalyticsExclusions.pageviews : 0));

  const rawWebVisitors =
    vercelAnalytics?.connected && typeof vercelAnalytics.totalVisitors === 'number'
      ? vercelAnalytics.totalVisitors
      : 0;
  const alreadyExcludedVisitors = Number(vercelAnalytics?.analyticsExcluded?.visitors || 0);
  const totalWebVisitors = Math.max(0, rawWebVisitors - (alreadyExcludedVisitors === 0 ? clientAnalyticsExclusions.visitors : 0));
  const webBounceRate =
    vercelAnalytics?.connected && typeof vercelAnalytics.bounceRate === 'number'
      ? vercelAnalytics.bounceRate
      : null;
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

  // Story Conversion Funnel Aggregates (100% Automated Telemetry via /api/track-story-click)
  const storyDispatches = ledger.storyFunnel?.dispatches || [];
  const serverStoryTotal = storyClickStats?.total || {};

  // Extract verified network-level referrer counts from Vercel Web Analytics
  const vercelReferrersList = Array.isArray(vercelAnalytics?.referrers)
    ? vercelAnalytics.referrers
    : [];
  const vercelIgReferrals = vercelReferrersList
    .filter((r) => (r.referrerHostname || '').toLowerCase().includes('instagram'))
    .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);
  const vercelFbReferrals = vercelReferrersList
    .filter((r) => {
      const h = (r.referrerHostname || '').toLowerCase();
      return h.includes('facebook') || h.includes('fb.me');
    })
    .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);
  const vercelXReferrals = vercelReferrersList
    .filter((r) => {
      const h = (r.referrerHostname || '').toLowerCase();
      return h.includes('twitter') || h.includes('t.co') || h.includes('x.com');
    })
    .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);
  const vercelYtReferrals = vercelReferrersList
    .filter((r) => {
      const h = (r.referrerHostname || '').toLowerCase();
      return h.includes('youtube') || h.includes('youtu.be');
    })
    .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);
  const vercelPinReferrals = vercelReferrersList
    .filter((r) => {
      const h = (r.referrerHostname || '').toLowerCase();
      return h.includes('pinterest') || h.includes('pin.it');
    })
    .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);

  // Instagram Story Aggregates (Bypassing Vercel Plus Paywall)
  const igStoryEntrances = Math.max(
    storyDispatches.reduce((sum, d) => {
      const serverClicks = Number(storyClickStats?.issues?.[d.slug]?.instagram?.clicks || 0);
      const ledgerClicks = Number(d.instagram?.entrances ?? d.instagram?.clicks ?? 0);
      return sum + Math.max(serverClicks, ledgerClicks);
    }, 0) || Number(serverStoryTotal.instagram?.clicks || 0),
    vercelIgReferrals
  );

  const igStoryScroll75 =
    storyDispatches.reduce((sum, d) => {
      const serverScroll = Number(storyClickStats?.issues?.[d.slug]?.instagram?.scroll75 || 0);
      const ledgerScroll = Number(d.instagram?.scroll75 || 0);
      return sum + Math.max(serverScroll, ledgerScroll);
    }, 0) || Number(serverStoryTotal.instagram?.scroll75 || 0);

  const igStorySubscribers =
    storyDispatches.reduce((sum, d) => {
      const serverSubs = Number(storyClickStats?.issues?.[d.slug]?.instagram?.subscribers || 0);
      const ledgerSubs = Number(d.instagram?.subscribers || 0);
      return sum + Math.max(serverSubs, ledgerSubs);
    }, 0) || Number(serverStoryTotal.instagram?.subscribers || 0);

  const igStoryRetentionPct =
    igStoryEntrances > 0
      ? Math.min(100, (igStoryScroll75 / igStoryEntrances) * 100).toFixed(1)
      : (igStoryScroll75 > 0 ? '100.0' : '0.0');
  const igStorySubConvPct =
    igStoryEntrances > 0
      ? ((igStorySubscribers / igStoryEntrances) * 100).toFixed(1)
      : '0.0';

  // Facebook Story Aggregates (Bypassing Vercel Plus Paywall)
  const fbStoryEntrances = Math.max(
    storyDispatches.reduce((sum, d) => {
      const serverClicks = Number(storyClickStats?.issues?.[d.slug]?.facebook?.clicks || 0);
      const ledgerClicks = Number(d.facebook?.entrances ?? d.facebook?.clicks ?? 0);
      return sum + Math.max(serverClicks, ledgerClicks);
    }, 0) || Number(serverStoryTotal.facebook?.clicks || 0),
    vercelFbReferrals
  );

  const fbStoryScroll75 =
    storyDispatches.reduce((sum, d) => {
      const serverScroll = Number(storyClickStats?.issues?.[d.slug]?.facebook?.scroll75 || 0);
      const ledgerScroll = Number(d.facebook?.scroll75 || 0);
      return sum + Math.max(serverScroll, ledgerScroll);
    }, 0) || Number(serverStoryTotal.facebook?.scroll75 || 0);

  const fbStorySubscribers =
    storyDispatches.reduce((sum, d) => {
      const serverSubs = Number(storyClickStats?.issues?.[d.slug]?.facebook?.subscribers || 0);
      const ledgerSubs = Number(d.facebook?.subscribers || 0);
      return sum + Math.max(serverSubs, ledgerSubs);
    }, 0) || Number(serverStoryTotal.facebook?.subscribers || 0);

  const fbStoryRetentionPct =
    fbStoryEntrances > 0
      ? Math.min(100, (fbStoryScroll75 / fbStoryEntrances) * 100).toFixed(1)
      : (fbStoryScroll75 > 0 ? '100.0' : '0.0');
  const fbStorySubConvPct =
    fbStoryEntrances > 0
      ? ((fbStorySubscribers / fbStoryEntrances) * 100).toFixed(1)
      : '0.0';

  // X (Twitter) Campaign Aggregates (Bypassing Vercel Plus Paywall)
  const xStoryEntrances = Math.max(
    storyDispatches.reduce((sum, d) => {
      const serverClicks = Number(storyClickStats?.issues?.[d.slug]?.x?.clicks || 0);
      const ledgerClicks = Number(d.x?.entrances ?? d.x?.clicks ?? 0);
      return sum + Math.max(serverClicks, ledgerClicks);
    }, 0) || Number(serverStoryTotal.x?.clicks || 0),
    vercelXReferrals
  );

  const xStoryScroll75 =
    storyDispatches.reduce((sum, d) => {
      const serverScroll = Number(storyClickStats?.issues?.[d.slug]?.x?.scroll75 || 0);
      const ledgerScroll = Number(d.x?.scroll75 || 0);
      return sum + Math.max(serverScroll, ledgerScroll);
    }, 0) || Number(serverStoryTotal.x?.scroll75 || 0);

  const xStorySubscribers =
    storyDispatches.reduce((sum, d) => {
      const serverSubs = Number(storyClickStats?.issues?.[d.slug]?.x?.subscribers || 0);
      const ledgerSubs = Number(d.x?.subscribers || 0);
      return sum + Math.max(serverSubs, ledgerSubs);
    }, 0) || Number(serverStoryTotal.x?.subscribers || 0);

  const xStoryRetentionPct =
    xStoryEntrances > 0
      ? Math.min(100, (xStoryScroll75 / xStoryEntrances) * 100).toFixed(1)
      : (xStoryScroll75 > 0 ? '100.0' : '0.0');
  const xStorySubConvPct =
    xStoryEntrances > 0
      ? ((xStorySubscribers / xStoryEntrances) * 100).toFixed(1)
      : '0.0';

  // YouTube Campaign Aggregates
  const ytStoryEntrances = Math.max(
    storyDispatches.reduce((sum, d) => {
      const serverClicks = Number(storyClickStats?.issues?.[d.slug]?.youtube?.clicks || 0);
      const ledgerClicks = Number(d.youtube?.entrances ?? d.youtube?.clicks ?? 0);
      return sum + Math.max(serverClicks, ledgerClicks);
    }, 0) || Number(serverStoryTotal.youtube?.clicks || 0),
    vercelYtReferrals
  );

  const ytStoryScroll75 =
    storyDispatches.reduce((sum, d) => {
      const serverScroll = Number(storyClickStats?.issues?.[d.slug]?.youtube?.scroll75 || 0);
      const ledgerScroll = Number(d.youtube?.scroll75 || 0);
      return sum + Math.max(serverScroll, ledgerScroll);
    }, 0) || Number(serverStoryTotal.youtube?.scroll75 || 0);

  const ytStorySubscribers =
    storyDispatches.reduce((sum, d) => {
      const serverSubs = Number(storyClickStats?.issues?.[d.slug]?.youtube?.subscribers || 0);
      const ledgerSubs = Number(d.youtube?.subscribers || 0);
      return sum + Math.max(serverSubs, ledgerSubs);
    }, 0) || Number(serverStoryTotal.youtube?.subscribers || 0);

  const ytStoryRetentionPct =
    ytStoryEntrances > 0
      ? Math.min(100, (ytStoryScroll75 / ytStoryEntrances) * 100).toFixed(1)
      : (ytStoryScroll75 > 0 ? '100.0' : '0.0');
  const ytStorySubConvPct =
    ytStoryEntrances > 0
      ? ((ytStorySubscribers / ytStoryEntrances) * 100).toFixed(1)
      : '0.0';

  // Pinterest Campaign Aggregates
  const pinStoryEntrances = Math.max(
    storyDispatches.reduce((sum, d) => {
      const serverClicks = Number(storyClickStats?.issues?.[d.slug]?.pinterest?.clicks || 0);
      const ledgerClicks = Number(d.pinterest?.entrances ?? d.pinterest?.clicks ?? 0);
      return sum + Math.max(serverClicks, ledgerClicks);
    }, 0) || Number(serverStoryTotal.pinterest?.clicks || 0),
    vercelPinReferrals
  );

  const pinStoryScroll75 =
    storyDispatches.reduce((sum, d) => {
      const serverScroll = Number(storyClickStats?.issues?.[d.slug]?.pinterest?.scroll75 || 0);
      const ledgerScroll = Number(d.pinterest?.scroll75 || 0);
      return sum + Math.max(serverScroll, ledgerScroll);
    }, 0) || Number(serverStoryTotal.pinterest?.scroll75 || 0);

  const pinStorySubscribers =
    storyDispatches.reduce((sum, d) => {
      const serverSubs = Number(storyClickStats?.issues?.[d.slug]?.pinterest?.subscribers || 0);
      const ledgerSubs = Number(d.pinterest?.subscribers || 0);
      return sum + Math.max(serverSubs, ledgerSubs);
    }, 0) || Number(serverStoryTotal.pinterest?.subscribers || 0);

  const pinStoryRetentionPct =
    pinStoryEntrances > 0
      ? Math.min(100, (pinStoryScroll75 / pinStoryEntrances) * 100).toFixed(1)
      : (pinStoryScroll75 > 0 ? '100.0' : '0.0');
  const pinStorySubConvPct =
    pinStoryEntrances > 0
      ? ((pinStorySubscribers / pinStoryEntrances) * 100).toFixed(1)
      : '0.0';

  // Substack & Email Campaign Aggregates
  const vercelSubstackReferrals = vercelReferrersList
    .filter((r) => (r.referrerHostname || '').toLowerCase().includes('substack'))
    .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);

  const vercelEmailReferrals = vercelReferrersList
    .filter((r) => {
      const h = (r.referrerHostname || '').toLowerCase();
      return h.includes('mail.') || h.includes('email') || h.includes('outlook') || h.includes('webmail');
    })
    .reduce((sum, r) => sum + (Number(r.visitors) || Number(r.pageviews) || 0), 0);

  const vercelUtmSourcesList = Array.isArray(vercelAnalytics?.utmSources) ? vercelAnalytics.utmSources : [];
  const vercelUtmMediumsList = Array.isArray(vercelAnalytics?.utmMediums) ? vercelAnalytics.utmMediums : [];

  const vercelSubstackUtmVisitors = vercelUtmSourcesList
    .filter((u) => (u.utmSource || u.source || '').toLowerCase().includes('substack'))
    .reduce((sum, u) => sum + (Number(u.visitors) || Number(u.pageviews) || 0), 0);

  const vercelEmailUtmVisitors =
    vercelUtmSourcesList
      .filter((u) => {
        const s = (u.utmSource || u.source || '').toLowerCase();
        return s.includes('email') || s.includes('mail') || s.includes('newsletter');
      })
      .reduce((sum, u) => sum + (Number(u.visitors) || Number(u.pageviews) || 0), 0) +
    vercelUtmMediumsList
      .filter((u) => {
        const m = (u.utmMedium || u.medium || '').toLowerCase();
        return m.includes('email') || m.includes('newsletter');
      })
      .reduce((sum, u) => sum + (Number(u.visitors) || Number(u.pageviews) || 0), 0);

  const substackStoryEntrances = Math.max(
    storyDispatches.reduce((sum, d) => {
      const serverClicks = Number(storyClickStats?.issues?.[d.slug]?.substack?.clicks || 0);
      const ledgerClicks = Number(d.substack?.entrances ?? d.substack?.clicks ?? 0);
      return sum + Math.max(serverClicks, ledgerClicks);
    }, 0) || Number(serverStoryTotal.substack?.clicks || 0),
    vercelSubstackReferrals,
    vercelSubstackUtmVisitors
  );

  const emailStoryEntrances = Math.max(
    storyDispatches.reduce((sum, d) => {
      const serverClicks = Number(storyClickStats?.issues?.[d.slug]?.email?.clicks || 0);
      const ledgerClicks = Number(d.email?.entrances ?? d.email?.clicks ?? 0);
      return sum + Math.max(serverClicks, ledgerClicks);
    }, 0) || Number(serverStoryTotal.email?.clicks || 0),
    vercelEmailReferrals,
    vercelEmailUtmVisitors
  );

  const totalSubstackVisitors = substackStoryEntrances + emailStoryEntrances;

  const substackStoryScroll75 =
    storyDispatches.reduce((sum, d) => {
      const serverScroll = Number(storyClickStats?.issues?.[d.slug]?.substack?.scroll75 || 0);
      const ledgerScroll = Number(d.substack?.scroll75 || 0);
      return sum + Math.max(serverScroll, ledgerScroll);
    }, 0) || Number(serverStoryTotal.substack?.scroll75 || 0);

  const emailStoryScroll75 =
    storyDispatches.reduce((sum, d) => {
      const serverScroll = Number(storyClickStats?.issues?.[d.slug]?.email?.scroll75 || 0);
      const ledgerScroll = Number(d.email?.scroll75 || 0);
      return sum + Math.max(serverScroll, ledgerScroll);
    }, 0) || Number(serverStoryTotal.email?.scroll75 || 0);

  const totalSubstackEmailScroll75 = substackStoryScroll75 + emailStoryScroll75;

  const substackStorySubscribers =
    storyDispatches.reduce((sum, d) => {
      const serverSubs = Number(storyClickStats?.issues?.[d.slug]?.substack?.subscribers || 0);
      const ledgerSubs = Number(d.substack?.subscribers || 0);
      return sum + Math.max(serverSubs, ledgerSubs);
    }, 0) || Number(serverStoryTotal.substack?.subscribers || 0);

  const emailStorySubscribers =
    storyDispatches.reduce((sum, d) => {
      const serverSubs = Number(storyClickStats?.issues?.[d.slug]?.email?.subscribers || 0);
      const ledgerSubs = Number(d.email?.subscribers || 0);
      return sum + Math.max(serverSubs, ledgerSubs);
    }, 0) || Number(serverStoryTotal.email?.subscribers || 0);

  const totalSubstackEmailSubscribers = substackStorySubscribers + emailStorySubscribers;

  // Combined Totals
  const totalStoryEntrances = igStoryEntrances + fbStoryEntrances + xStoryEntrances + ytStoryEntrances + pinStoryEntrances + totalSubstackVisitors;
  const totalStoryScroll75 = igStoryScroll75 + fbStoryScroll75 + xStoryScroll75 + ytStoryScroll75 + pinStoryScroll75 + totalSubstackEmailScroll75;
  const totalStorySubscribers = igStorySubscribers + fbStorySubscribers + xStorySubscribers + ytStorySubscribers + pinStorySubscribers + totalSubstackEmailSubscribers;
  const totalStoryRetentionPct =
    totalStoryEntrances > 0
      ? Math.min(100, (totalStoryScroll75 / totalStoryEntrances) * 100).toFixed(1)
      : (totalStoryScroll75 > 0 ? '100.0' : '0.0');
  const totalStoryConvPct =
    totalStoryEntrances > 0
      ? ((totalStorySubscribers / totalStoryEntrances) * 100).toFixed(1)
      : '0.0';

  // Filtered Pre-configured Specific UTM Links
  const activeUtmLinks = useMemo(() => {
    const origin =
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? window.location.origin
        : 'https://observations.moth1.xyz';

    return PRECONFIGURED_UTM_LINKS.filter((item) => {
      if (utmLinksFilterIssue !== 'all' && item.issueId !== utmLinksFilterIssue) return false;
      if (utmLinksFilterPlatform !== 'all' && item.platform !== utmLinksFilterPlatform) return false;
      return true;
    }).map((item) => {
      const url = `${origin}${item.slug ? '/' + item.slug : '/'}?utm_source=${item.platform}&utm_medium=${item.medium}&utm_campaign=${item.campaign}`;
      return { ...item, url };
    });
  }, [utmLinksFilterIssue, utmLinksFilterPlatform]);

  // Real-Time Generated Custom Campaign Link
  const generatedCustomUrl = useMemo(() => {
    const origin =
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? window.location.origin
        : 'https://observations.moth1.xyz';
    const path = customUtmIssue ? `/${customUtmIssue}` : '/';
    const params = new URLSearchParams();
    if (customUtmSource) params.set('utm_source', customUtmSource.trim().toLowerCase());
    if (customUtmMedium) params.set('utm_medium', customUtmMedium.trim().toLowerCase());
    if (customUtmCampaign) params.set('utm_campaign', customUtmCampaign.trim().toLowerCase());
    const qs = params.toString();
    return `${origin}${path}${qs ? '?' + qs : ''}`;
  }, [customUtmIssue, customUtmSource, customUtmMedium, customUtmCampaign]);

  // Backward-compatible aliases for Story Funnel telemetry
  const totalStoryClicks = totalStoryEntrances;
  const igStoryClicks = igStoryEntrances;
  const fbStoryClicks = fbStoryEntrances;
  const storyCtrPct = totalStoryRetentionPct;
  const storySubConversionPct = totalStoryConvPct;
  const igStoryCtrPct = igStoryRetentionPct;
  const fbStoryCtrPct = fbStoryRetentionPct;

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
  const cleanIgManualReels = (ledger.instagram?.reels || []).map((r) =>
    Number(r.views) === 35683 ? { ...r, views: 0, likes: 0, comments: 0 } : r
  );
  const igManualViews = cleanIgManualReels.reduce(
    (sum, r) => sum + (Number(r.views) || 0),
    0
  );
  const igManualInteractions = cleanIgManualReels.reduce(
    (sum, r) =>
      sum +
      (Number(r.likes) || 0) +
      (Number(r.comments) || 0) +
      (Number(r.shares) || 0) +
      (Number(r.saves) || 0),
    0
  );
  const totalIgViews = filterOnlyObservations
    ? (igScrapedViews > 0 ? igScrapedViews : igManualViews)
    : Math.max(igScrapedViews, igManualViews);
  const totalIgEngagement = filterOnlyObservations
    ? (igScrapedLikes + igScrapedComments > 0
        ? igScrapedLikes + igScrapedComments
        : igManualInteractions)
    : Math.max(
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
      (Number(r.saves) || 0) +
      (Number(r.linkClicks) || 0),
    0
  );
  const totalFbViews = Math.max(fbScrapedViews, fbManualViews);
  const totalFbEngagement = Math.max(fbScrapedInteractions, fbManualEngagement);

  // X (Twitter) (apidojo/tweet-scraper + thread aggregator + ledger fallback)
  const allXThreads = aggregateXThreads(xState.items || []);
  const mergedXMap = new Map();

  for (const p of (ledger.x?.posts || [])) {
    const issueId = p.issueId || matchItemToIssueId(p) || '01';
    mergedXMap.set(issueId, {
      id: p.id || `x-post-${issueId}`,
      issueId,
      text: p.text || p.title || (issueId === '03' ? 'Issue #03: The War No One Was Supposed to Win' : issueId === '02' ? 'Issue #02: The Meat Grinder Needs More Meat' : 'Issue #01: Watering Grass in a Thunderstorm'),
      title: p.title,
      openingText: p.text || p.title,
      url: p.url || (targets.xHandle ? `https://x.com/${targets.xHandle}` : 'https://x.com/Moth1NFTs'),
      views: Number(p.views) || 0,
      likes: Number(p.likes) || 0,
      retweets: Number(p.retweets) || 0,
      replies: Number(p.replies) || 0,
      isThread: false,
      tweetCount: 1,
      status: p.status || 'Published',
    });
  }

  // Overlay live scraped threads matching each issue
  for (const thread of allXThreads) {
    const issueId = matchItemToIssueId(thread);
    if (issueId && mergedXMap.has(issueId)) {
      const existing = mergedXMap.get(issueId);
      mergedXMap.set(issueId, {
        ...existing,
        ...thread,
        views: Math.max(existing.views, thread.views || 0),
        likes: Math.max(existing.likes, thread.likes || 0),
        retweets: Math.max(existing.retweets, thread.retweets || 0),
        replies: Math.max(existing.replies, thread.replies || 0),
        url: thread.url || existing.url,
        isThread: Boolean(thread.tweetCount > 1),
        tweetCount: thread.tweetCount || 1,
      });
    } else if (matchesObservationsFilter(thread, activeFilterTag)) {
      mergedXMap.set(thread.id, thread);
    }
  }

  const allMergedXItems = Array.from(mergedXMap.values()).sort((a, b) => {
    const issueA = matchItemToIssueId(a);
    const issueB = matchItemToIssueId(b);
    const scoreA = issueA === '03' ? 3 : issueA === '02' ? 2 : issueA === '01' ? 1 : 0;
    const scoreB = issueB === '03' ? 3 : issueB === '02' ? 2 : issueB === '01' ? 1 : 0;
    return scoreB - scoreA;
  });

  const visibleXItems = filterOnlyObservations
    ? allMergedXItems.filter((item) => matchesObservationsFilter(item, activeFilterTag) || matchItemToIssueId(item))
    : (allXThreads.length > 0 ? allXThreads : allMergedXItems);

  const xScrapedViews = visibleXItems.reduce((sum, i) => sum + (i.views || 0), 0);
  const xScrapedEngagement = visibleXItems.reduce(
    (sum, i) => sum + (i.likes || 0) + (i.retweets || 0) + (i.replies || 0),
    0
  );
  const totalXViews = Math.max(xScrapedViews, xStoryEntrances);
  const totalXEngagement = xScrapedEngagement;

  // YouTube (verified YouTube Shorts + playlist telemetry + YouTube Data API v3)
  const ytVideoList = (youtubeState?.videos && youtubeState.videos.length > 0)
    ? youtubeState.videos
    : (ledger.youtube?.videos || []);
  const ytTotalViews = ytVideoList.reduce((sum, v) => sum + (Number(v.views) || 0), 0);
  const totalYtViews = Math.max(ytTotalViews, ytStoryEntrances);
  const ytTotalEngagement = ytVideoList.reduce((sum, v) => sum + (Number(v.likes) || 0) + (Number(v.comments) || 0), 0);
  const ytSubscribers = Number(youtubeState?.channel?.subscribers ?? ledger.youtube?.subscribers ?? 6);

  // Pinterest Profile & Telemetry Aggregates
  const pinCreatedCount = Number(pinterestState?.profile?.createdPins ?? 0);
  const pinSavedCount = Number(pinterestState?.profile?.savedPins ?? 4);
  const pinTotalCount = Number(pinterestState?.profile?.totalPins ?? 4);
  const pinFollowers = Number(pinterestState?.profile?.followers ?? ledger.pinterest?.followers ?? 0);
  const pinFollowing = Number(pinterestState?.profile?.following ?? 0);
  const pinBoardsCount = Number(pinterestState?.profile?.boardsCount ?? 0);
  const pinList = pinterestState?.pins?.length > 0 ? pinterestState.pins : (ledger.pinterest?.pins || []);
  const totalPinViews = Math.max(pinStoryEntrances, pinCreatedCount);

  const handleOwnerUnlock = (e) => {
    e.preventDefault();
    const val = unlockInput.trim().toLowerCase();
    if (val === 'moth1.siv' || val === 'moth1') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(OWNER_UNLOCK_STORAGE_KEY, 'true');
        window.localStorage.setItem('moth1_owner_passcode', val);
      }
      setIsOwnerUnlocked(true);
      setUnlockError('');
    } else {
      setUnlockError('Incorrect passcode. Access restricted to publication owner.');
    }
  };

  const handleLockConsole = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(OWNER_UNLOCK_STORAGE_KEY);
      window.localStorage.removeItem('moth1_owner_passcode');
    }
    setIsOwnerUnlocked(false);
    setUnlockInput('');
    setUnlockError('');
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
              Enter your owner passcode to access.
            </p>
          </div>

          <form onSubmit={handleOwnerUnlock} className="space-y-3">
            <input
              type="password"
              value={unlockInput}
              onChange={(e) => setUnlockInput(e.target.value)}
              placeholder="Enter owner passcode..."
              autoFocus
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
    <div
      className={`min-h-screen pt-14 sm:pt-20 pb-24 px-3 sm:px-6 lg:px-8 overflow-x-hidden transition-colors duration-200 ${
        isLight ? 'bg-[#f8f7f4] text-[#0f172a] dashboard-light' : 'bg-[#0c0d10] text-[#e2e8f0]'
      }`}
    >
      {/* Subtle Cyberpunk / Japanese Rice Paper Grid Backdrop */}
      <div
        className={`pointer-events-none fixed inset-0 transition-opacity duration-200 ${
          isLight ? 'opacity-[0.06]' : 'opacity-15'
        }`}
        style={{
          backgroundImage: isLight
            ? 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)'
            : 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
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
              Tracking Web Traffic, UTM Funnel Conversion (<code>utm_medium=story</code>) &amp; Social Scrapers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 border px-2.5 sm:px-3.5 py-2 font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
                isLight
                  ? 'border-amber-400/80 bg-amber-50 text-amber-900 hover:bg-amber-100 shadow-sm'
                  : 'border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
              }`}
              title={isLight ? 'Switch to Dark Cyber-Zen theme' : 'Switch to Light Gallery theme'}
            >
              {isLight ? (
                <Moon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

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
                {vercelToken.trim() && apifyToken.trim()
                  ? 'APIs Connected'
                  : 'API Tokens'}
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

            <button
              type="button"
              onClick={handleLockConsole}
              className="inline-flex items-center justify-center gap-1.5 border border-[#fda4af]/40 bg-[#fda4af]/10 hover:bg-[#fda4af]/20 px-2.5 sm:px-3.5 py-2 font-mono text-[11px] sm:text-xs text-[#fda4af] font-bold transition-colors cursor-pointer text-center"
              title="Lock Console"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Lock</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 border border-slate-800 bg-[#121316] hover:border-slate-600 px-2.5 sm:px-3.5 py-2 font-mono text-[11px] sm:text-xs text-slate-300 transition-colors text-center"
            >
              <span>← Back to Site</span>
            </Link>
          </div>
        </div>

        {/* Top Sticky Macro-Navigation Bar: Instant Section Switching (Analytics Hub vs Funnel Tracking) */}
        <div
          className={`sticky top-0 z-40 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-2.5 backdrop-blur-md border-b flex flex-wrap items-center justify-between gap-3 transition-colors duration-200 ${
            isLight
              ? 'bg-[#f8f7f4]/95 border-slate-300 text-slate-800 shadow-sm'
              : 'bg-[#0c0d10]/95 border-slate-800 text-[#e2e8f0]'
          }`}
        >
          <div className={`w-full sm:w-auto flex items-center gap-1 p-1 border ${
            isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/60 border border-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => {
                setActiveMacroSection('analytics');
                document.getElementById('analytics-hub')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMacroSection === 'analytics'
                  ? (isLight ? 'bg-[#0f172a] text-white font-black shadow' : 'bg-[#86efac] text-[#0c0d10] font-black shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              📊 Analytics Hub
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMacroSection('funnel');
                document.getElementById('funnel-tracking')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMacroSection === 'funnel'
                  ? (isLight ? 'bg-[#0f172a] text-white font-black shadow' : 'bg-[#f472b6] text-[#0c0d10] font-black shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              🎯 UTM Funnel <span className="hidden xs:inline">&amp; Links</span>
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
            <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
              Active Mode: <strong className="text-[#86efac] uppercase font-bold">{theme}</strong>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                isLight
                  ? 'border-slate-300 bg-white text-slate-800 shadow-sm hover:border-amber-400'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-400/60'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="w-3 h-3 text-amber-600" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-[11px] text-[#67e8f9] font-bold uppercase">
                      Apify API Token
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowApifyToken((prev) => !prev)}
                      className="text-slate-400 hover:text-[#67e8f9] cursor-pointer"
                      title={showApifyToken ? 'Hide token' : 'Show token'}
                    >
                      {showApifyToken ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <input
                    type={showApifyToken ? 'text' : 'password'}
                    value={apifyToken}
                    onChange={(e) => setApifyToken(e.target.value)}
                    placeholder="apify_api_..."
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#67e8f9]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-[11px] text-[#86efac] font-bold uppercase">
                      Vercel Read Token
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowVercelToken((prev) => !prev)}
                      className="text-slate-400 hover:text-[#86efac] cursor-pointer"
                      title={showVercelToken ? 'Hide token' : 'Show token'}
                    >
                      {showVercelToken ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <input
                    type={showVercelToken ? 'text' : 'password'}
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                    placeholder="Vercel Access Token..."
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#86efac] focus:outline-none focus:border-[#86efac]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-slate-400 font-bold uppercase">
                    Vercel Project ID
                  </label>
                  <input
                    type="text"
                    value={vercelProjectId}
                    onChange={(e) => setVercelProjectId(e.target.value)}
                    placeholder="Auto-detected"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#86efac]"
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
                    placeholder="#ObservationsByMoth1"
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
                    placeholder="https://www.facebook.com/observationsbymoth1"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-[#86efac]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-[#e2e8f0] font-bold uppercase">
                    X (Twitter) Handle
                  </label>
                  <input
                    type="text"
                    value={targets.xHandle || ''}
                    onChange={(e) =>
                      setTargets((prev) => ({
                        ...prev,
                        xHandle: e.target.value,
                      }))
                    }
                    placeholder="Moth1NFTs"
                    className="w-full bg-[#0b0d10] border border-slate-700 px-3 py-2 text-xs font-mono text-[#e2e8f0] focus:outline-none focus:border-white"
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
                  <span>
                    X:{' '}
                    <strong className="text-white">
                      {xState.runInfo?.status || 'IDLE'}
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

        {/* ================================================================= */}
        {/* MACRO-SECTION 1: ANALYTICS HUB & MULTI-CHANNEL METRICS           */}
        {/* ================================================================= */}
        <section id="analytics-hub" className="space-y-6 pt-2">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-[#86efac]" />
                <h2 className="text-base sm:text-xl font-bold text-[#e2e8f0]">
                  Analytics Hub
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#86efac]/40 bg-[#86efac]/10 text-[#86efac] text-[10px] font-mono uppercase font-bold tracking-wider">
                  Multi-Channel Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live Vercel Web Analytics, Apify social scrapers, publication reach, and speed insights.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Tip: Click any KPI card below to filter the detailed view
            </div>
          </div>

          {/* 8-Channel Executive Summary KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Website (Vercel Analytics) */}
            <CyberPanel
              theme={theme}
              label="Website • Vercel"
              accent="#86efac"
              className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                analyticsTab === 'website' ? 'ring-1 ring-[#86efac]' : ''
              }`}
              onClick={() => setAnalyticsTab('website')}
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
                <span>
                  <strong className="text-[#86efac]">{totalWebVisitors.toLocaleString()}</strong> Visitors
                  {webBounceRate !== null && (
                    <> • <strong className="text-[#67e8f9]">{webBounceRate}%</strong> Bounce Rate</>
                  )}
                  {' • '}{totalWebShares} Shares
                </span>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
              <span className="inline-flex items-center gap-1 text-[#86efac]">
                <CheckCircle2 className="w-3 h-3" />
                {vercelAnalytics?.connected ? 'Live Vercel API' : 'Active'}
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

          {/* KPI 2: Substack & Email (automation-lab/substack-scraper + Vercel UTMs) */}
          <CyberPanel
            theme={theme}
            label="Substack & Email • Apify + Vercel"
            accent="#67e8f9"
            className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
              analyticsTab === 'substack' ? 'ring-1 ring-[#67e8f9]' : ''
            }`}
            onClick={() => setAnalyticsTab('substack')}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-400 truncate">
                  @{targets.substackUrl?.replace('https://', '').split('.')[0] || 'observationsbymoth1'}
                </span>
                <BookOpen className="w-4 h-4 text-[#67e8f9] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                {totalSubstackVisitors.toLocaleString()}{' '}
                <span className="text-sm font-bold text-slate-400">Visitors</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                <strong className="text-[#67e8f9]">{emailStoryEntrances.toLocaleString()}</strong> Email • <strong className="text-[#67e8f9]">{substackStoryEntrances.toLocaleString()}</strong> Web ({substackPosts.length} Posts)
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
              <span className="text-slate-400">Subscribers:</span>
              {editingPlatform === 'substack' ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    autoFocus
                    value={tempEditVal}
                    onChange={(e) => setTempEditVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEditFollower('substack');
                      if (e.key === 'Escape') setEditingPlatform(null);
                    }}
                    className="w-16 bg-[#0b0d10] border border-[#67e8f9] px-1.5 py-0.5 text-[11px] font-mono text-[#67e8f9] font-bold text-right outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEditFollower('substack')}
                    className="p-1 hover:bg-[#67e8f9]/20 text-[#67e8f9] rounded-none cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPlatform(null)}
                    className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[12px] font-bold text-[#67e8f9] tabular-nums">
                    {(substackState.subscribers || ledger.substackSubscribers || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#67e8f9]/40 bg-[#67e8f9]/10 text-[#67e8f9] rounded-none">
                    {substackState.subscribers > 0 ? 'Scraped' : 'Live'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleStartEditFollower(
                        'substack',
                        substackState.subscribers || ledger.substackSubscribers || 0
                      )
                    }
                    className="p-0.5 text-slate-500 hover:text-[#67e8f9] transition-colors cursor-pointer"
                    title="Edit Baseline Subscribers"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </CyberPanel>

          {/* Dynamic Social KPI Cards (Sorted Highest to Lowest by Views / Engagement) */}
          {(() => {
            const socialCards = [
              {
                id: 'facebook',
                views: totalFbViews,
                render: () => (
                  <CyberPanel
                    key="facebook"
                    theme={theme}
                    label="Facebook • Apify"
                    accent="#86efac"
                    className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                      analyticsTab === 'social' && socialPlatformTab === 'facebook' ? 'ring-1 ring-[#86efac]' : ''
                    }`}
                    onClick={() => {
                      setAnalyticsTab('social');
                      setSocialPlatformTab('facebook');
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] text-slate-400 truncate">
                          observationsbymoth1
                        </span>
                        <Share2 className="w-4 h-4 text-[#86efac] shrink-0" />
                      </div>
                      <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                        {totalFbViews.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Views • {totalFbEngagement.toLocaleString()} Engagements (
                        {visibleFacebookItems.length} Posts)
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="text-slate-400">Followers:</span>
                      {editingPlatform === 'facebook' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempEditVal}
                            onChange={(e) => setTempEditVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditFollower('facebook');
                              if (e.key === 'Escape') setEditingPlatform(null);
                            }}
                            className="w-16 bg-[#0b0d10] border border-[#86efac] px-1.5 py-0.5 text-[11px] font-mono text-[#86efac] font-bold text-right outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditFollower('facebook')}
                            className="p-1 hover:bg-[#86efac]/20 text-[#86efac] rounded-none cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlatform(null)}
                            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[12px] font-bold text-[#86efac] tabular-nums">
                            {(facebookState.followers || ledger.facebook.followers || 0).toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#86efac]/40 bg-[#86efac]/10 text-[#86efac] rounded-none">
                            {facebookState.followers > 0 ? 'Scraped' : 'Live'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditFollower(
                                'facebook',
                                facebookState.followers || ledger.facebook.followers || 0
                              )
                            }
                            className="p-0.5 text-slate-500 hover:text-[#86efac] transition-colors cursor-pointer"
                            title="Edit Baseline Followers"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </CyberPanel>
                ),
              },
              {
                id: 'youtube',
                views: totalYtViews,
                render: () => (
                  <CyberPanel
                    key="youtube"
                    theme={theme}
                    label="YouTube • Shorts"
                    accent="#ef4444"
                    className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                      analyticsTab === 'social' && socialPlatformTab === 'youtube' ? 'ring-1 ring-[#ef4444]' : ''
                    }`}
                    onClick={() => {
                      setAnalyticsTab('social');
                      setSocialPlatformTab('youtube');
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] text-slate-400 truncate">
                          @{targets.youtubeHandle || ledger.youtube?.handle || 'sivaraj.pragasm'}
                        </span>
                        <Youtube className="w-4 h-4 text-[#ef4444] shrink-0" />
                      </div>
                      <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                        {totalYtViews.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Views • {ytTotalEngagement.toLocaleString()} Engagements ({ytVideoList.length} Shorts • {ytStoryEntrances} Inbound Visits)
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="text-slate-400">Subscribers:</span>
                      {editingPlatform === 'youtube' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempEditVal}
                            onChange={(e) => setTempEditVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditFollower('youtube');
                              if (e.key === 'Escape') setEditingPlatform(null);
                            }}
                            className="w-16 bg-[#0b0d10] border border-[#ef4444] px-1.5 py-0.5 text-[11px] font-mono text-[#ef4444] font-bold text-right outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditFollower('youtube')}
                            className="p-1 hover:bg-[#ef4444]/20 text-[#ef4444] rounded-none cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlatform(null)}
                            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[12px] font-bold text-[#f87171] tabular-nums">
                            {ytSubscribers.toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#ef4444]/40 bg-[#ef4444]/10 text-[#f87171] rounded-none">
                            Live
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditFollower(
                                'youtube',
                                ytSubscribers
                              )
                            }
                            className="p-0.5 text-slate-500 hover:text-[#ef4444] transition-colors cursor-pointer"
                            title="Edit Baseline Subscribers"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </CyberPanel>
                ),
              },
              {
                id: 'instagram',
                views: totalIgViews,
                render: () => (
                  <CyberPanel
                    key="instagram"
                    theme={theme}
                    label="Instagram • Apify"
                    accent="#fda4af"
                    className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                      analyticsTab === 'social' && socialPlatformTab === 'instagram' ? 'ring-1 ring-[#fda4af]' : ''
                    }`}
                    onClick={() => {
                      setAnalyticsTab('social');
                      setSocialPlatformTab('instagram');
                    }}
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
                      {editingPlatform === 'instagram' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempEditVal}
                            onChange={(e) => setTempEditVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditFollower('instagram');
                              if (e.key === 'Escape') setEditingPlatform(null);
                            }}
                            className="w-16 bg-[#0b0d10] border border-[#fda4af] px-1.5 py-0.5 text-[11px] font-mono text-[#fda4af] font-bold text-right outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditFollower('instagram')}
                            className="p-1 hover:bg-[#fda4af]/20 text-[#fda4af] rounded-none cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlatform(null)}
                            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[12px] font-bold text-[#fda4af] tabular-nums">
                            {(instagramState.followers || ledger.instagram.followers || 0).toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#fda4af]/40 bg-[#fda4af]/10 text-[#fda4af] rounded-none">
                            {instagramState.followers > 0 ? 'Scraped' : 'Live'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditFollower(
                                'instagram',
                                instagramState.followers || ledger.instagram.followers || 0
                              )
                            }
                            className="p-0.5 text-slate-500 hover:text-[#fda4af] transition-colors cursor-pointer"
                            title="Edit Baseline Followers"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </CyberPanel>
                ),
              },
              {
                id: 'x',
                views: totalXViews,
                render: () => (
                  <CyberPanel
                    key="x"
                    theme={theme}
                    label={`X • @${targets.xHandle || 'Moth1NFTs'}`}
                    accent="#e2e8f0"
                    className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                      analyticsTab === 'social' && socialPlatformTab === 'x' ? 'ring-1 ring-white' : ''
                    }`}
                    onClick={() => {
                      setAnalyticsTab('social');
                      setSocialPlatformTab('x');
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] text-slate-400 truncate">
                          @{targets.xHandle || 'Moth1NFTs'}
                        </span>
                        <span className="font-mono font-black text-sm text-white shrink-0">𝕏</span>
                      </div>
                      <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                        {totalXViews.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Views • {totalXEngagement.toLocaleString()} Engagements (
                        {visibleXItems.length} Posts)
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="text-slate-400">Followers:</span>
                      {editingPlatform === 'x' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempEditVal}
                            onChange={(e) => setTempEditVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditFollower('x');
                              if (e.key === 'Escape') setEditingPlatform(null);
                            }}
                            className="w-16 bg-[#0b0d10] border border-[#e2e8f0] px-1.5 py-0.5 text-[11px] font-mono text-[#e2e8f0] font-bold text-right outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditFollower('x')}
                            className="p-1 hover:bg-white/20 text-[#e2e8f0] rounded-none cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlatform(null)}
                            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[12px] font-bold text-[#e2e8f0] tabular-nums">
                            {(xState.followers || ledger.x?.followers || 0).toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-white/40 bg-white/10 text-white rounded-none">
                            {xState.followers > 0 ? 'Scraped' : 'Live'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditFollower(
                                'x',
                                xState.followers || ledger.x?.followers || 0
                              )
                            }
                            className="p-0.5 text-slate-500 hover:text-[#e2e8f0] transition-colors cursor-pointer"
                            title="Edit Baseline Followers"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </CyberPanel>
                ),
              },
              {
                id: 'threads',
                views: visibleThreadsItems.length,
                render: () => (
                  <CyberPanel
                    key="threads"
                    theme={theme}
                    label="Threads • Apify"
                    accent="#c084fc"
                    className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                      analyticsTab === 'social' && socialPlatformTab === 'threads' ? 'ring-1 ring-[#c084fc]' : ''
                    }`}
                    onClick={() => {
                      setAnalyticsTab('social');
                      setSocialPlatformTab('threads');
                    }}
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
                      {editingPlatform === 'threads' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempEditVal}
                            onChange={(e) => setTempEditVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditFollower('threads');
                              if (e.key === 'Escape') setEditingPlatform(null);
                            }}
                            className="w-16 bg-[#0b0d10] border border-[#c084fc] px-1.5 py-0.5 text-[11px] font-mono text-[#c084fc] font-bold text-right outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditFollower('threads')}
                            className="p-1 hover:bg-[#c084fc]/20 text-[#c084fc] rounded-none cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlatform(null)}
                            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[12px] font-bold text-[#c084fc] tabular-nums">
                            {(threadsState.followers || 0).toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#c084fc]/40 bg-[#c084fc]/10 text-[#c084fc] rounded-none">
                            {threadsState.followers > 0 ? 'Scraped' : 'Live'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditFollower(
                                'threads',
                                threadsState.followers || 0
                              )
                            }
                            className="p-0.5 text-slate-500 hover:text-[#c084fc] transition-colors cursor-pointer"
                            title="Edit Baseline Followers"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </CyberPanel>
                ),
              },
              {
                id: 'pinterest',
                views: totalPinViews,
                render: () => (
                  <CyberPanel
                    key="pinterest"
                    theme={theme}
                    label="Pinterest • @moth1siv"
                    accent="#e60023"
                    className={`p-4 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                      analyticsTab === 'social' && socialPlatformTab === 'pinterest' ? 'ring-1 ring-[#e60023]' : ''
                    }`}
                    onClick={() => {
                      setAnalyticsTab('social');
                      setSocialPlatformTab('pinterest');
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] text-slate-400 truncate">
                          @{pinterestState?.profile?.username || 'moth1siv'}
                        </span>
                        <Pin className="w-4 h-4 text-[#e60023] shrink-0" />
                      </div>
                      <div className="font-mono text-2xl font-black text-[#e2e8f0] tabular-nums">
                        {pinList.length} <span className="text-sm font-bold text-slate-400">Pins</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {pinSavedCount} Saved • {pinCreatedCount} Created ({pinStoryEntrances} Inbound Visits)
                      </div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono text-[10px]">
                      <span className="text-slate-400">Followers:</span>
                      {editingPlatform === 'pinterest' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempEditVal}
                            onChange={(e) => setTempEditVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditFollower('pinterest');
                              if (e.key === 'Escape') setEditingPlatform(null);
                            }}
                            className="w-16 bg-[#0b0d10] border border-[#e60023] px-1.5 py-0.5 text-[11px] font-mono text-[#f87171] font-bold text-right outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditFollower('pinterest')}
                            className="p-1 hover:bg-[#e60023]/20 text-[#f87171] rounded-none cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlatform(null)}
                            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-none cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[12px] font-bold text-[#f87171] tabular-nums">
                            {pinFollowers.toLocaleString()}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 border border-[#e60023]/40 bg-[#e60023]/10 text-[#f87171] rounded-none">
                            Live
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEditFollower(
                                'pinterest',
                                pinFollowers
                              )
                            }
                            className="p-0.5 text-slate-500 hover:text-[#f87171] transition-colors cursor-pointer"
                            title="Edit Baseline Followers"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </CyberPanel>
                ),
              },
            ];

            return socialCards
              .sort((a, b) => b.views - a.views)
              .map((card) => card.render());
          })()}

          {/* KPI 8: UTM Funnel Tracker (100% Automated Telemetry) */}
          <CyberPanel
            theme={theme}
            label="UTM Funnel Tracker • Automated"
            accent="#f472b6"
            className="p-4 flex flex-col justify-between border border-[#f472b6]/40 bg-[#121316] cursor-pointer transition-all hover:scale-[1.01] hover:ring-1 hover:ring-[#f472b6]"
            onClick={() => {
              setActiveMacroSection('funnel');
              document.getElementById('funnel-tracking')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-slate-400 truncate uppercase tracking-wider">
                  UTM Funnel Telemetry
                </span>
                <Zap className="w-4 h-4 text-[#f472b6] shrink-0" />
              </div>
              <div className="font-mono text-2xl font-black text-[#f472b6] tabular-nums">
                {totalStoryEntrances}{' '}
                <span className="text-sm font-bold text-slate-400">Visits</span>
              </div>
              <div className="text-xs text-slate-300 mt-1 font-mono">
                <span className="text-[#fbbf24] font-bold">{totalStoryRetentionPct}%</span> 75% read •{' '}
                <span className="text-[#86efac] font-bold">{totalStorySubscribers}</span> subs (
                <span className="text-[#86efac] font-bold">{totalStoryConvPct}%</span>)
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 font-mono text-[10px]">
              {(() => {
                const channels = [
                  {
                    id: 'fb',
                    name: 'FB Story:',
                    color: '#60a5fa',
                    entrances: fbStoryEntrances,
                    retention: fbStoryRetentionPct,
                  },
                  {
                    id: 'ig',
                    name: 'IG Story:',
                    color: '#fda4af',
                    entrances: igStoryEntrances,
                    retention: igStoryRetentionPct,
                  },
                  {
                    id: 'yt',
                    name: 'YouTube:',
                    color: '#f87171',
                    dotColor: '#ef4444',
                    entrances: ytStoryEntrances,
                    retention: ytStoryRetentionPct,
                  },
                  {
                    id: 'x',
                    name: '𝕏 Campaigns:',
                    color: '#e2e8f0',
                    entrances: xStoryEntrances,
                    retention: xStoryRetentionPct,
                  },
                  {
                    id: 'pin',
                    name: 'Pinterest:',
                    color: '#f87171',
                    dotColor: '#e60023',
                    entrances: pinStoryEntrances,
                    retention: pinStoryRetentionPct,
                  },
                ].sort((a, b) => b.entrances - a.entrances || parseFloat(b.retention) - parseFloat(a.retention));

                return channels.map((ch) => (
                  <div key={ch.id} className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1" style={{ color: ch.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ch.dotColor || ch.color }} />
                      {ch.name}
                    </span>
                    <span className="text-slate-300">
                      <strong style={{ color: ch.color }}>{ch.entrances}</strong> visits • <strong className="text-[#fbbf24]">{ch.retention}%</strong> read
                    </span>
                  </div>
                ));
              })()}
            </div>
          </CyberPanel>
        </div>

        {/* Analytics Hub Sub-Navigation Segmented Switcher (Reduces vertical scrolling by ~75%) */}
        <div className={`p-1.5 border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border border-slate-800'
        }`}>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setAnalyticsTab('website')}
              className={`whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                analyticsTab === 'website'
                  ? (isLight ? 'bg-[#0f172a] text-white font-black shadow' : 'bg-[#86efac] text-[#0c0d10] font-black shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }`}
            >
              🌐 Website &amp; Traffic
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTab('reels')}
              className={`whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                analyticsTab === 'reels'
                  ? (isLight ? 'bg-[#0f172a] text-white font-black shadow' : 'bg-[#67e8f9] text-[#0c0d10] font-black shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }`}
            >
              🎬 Comparative 9:16 Video (FB vs IG vs YT)
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTab('substack')}
              className={`whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                analyticsTab === 'substack'
                  ? (isLight ? 'bg-[#0f172a] text-white font-black shadow' : 'bg-[#facc15] text-[#0c0d10] font-black shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }`}
            >
              📰 Substack Publication
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTab('social')}
              className={`whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                analyticsTab === 'social'
                  ? (isLight ? 'bg-[#0f172a] text-white font-black shadow' : 'bg-[#c084fc] text-[#0c0d10] font-black shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }`}
            >
              📱 Social Feeds (Apify)
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsTab('all')}
              className={`whitespace-nowrap shrink-0 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                analyticsTab === 'all'
                  ? (isLight ? 'bg-[#0f172a] text-white font-black shadow' : 'bg-white text-[#0c0d10] font-black shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
              }`}
            >
              📑 View Full Deck
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 px-2 hidden sm:block">
            Active View: <strong className={isLight ? 'text-[#0f172a] uppercase font-bold' : 'text-[#86efac] uppercase font-bold'}>{analyticsTab}</strong>
          </div>
        </div>

        {/* Sub-Section 1: Website Audience & Route Breakdown + Speed Insights */}
        {(analyticsTab === 'website' || analyticsTab === 'all') && (
          <div className="space-y-6">
            <CyberPanel
              theme={theme}
              label="Website Audience • observations.moth1.xyz"
              accent="#86efac"
              className="p-4 sm:p-6"
            >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                Website Audience &amp; Route Performance
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time pageviews, visitors, referrers, and regional distribution from Vercel Analytics.
              </p>
            </div>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-[#86efac]/60 bg-[#86efac]/10 px-3.5 py-1.5 font-mono text-xs text-[#86efac] font-bold hover:bg-[#86efac]/20 transition-colors w-full sm:w-auto shrink-0"
            >
              <span>Vercel Analytics</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Vercel Live Status */}
          {!vercelAnalytics?.connected ? (
            <div className="mb-4 p-3 bg-slate-900/60 border border-slate-800 font-mono text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <div className="font-bold flex items-center gap-1.5 text-slate-200">
                  <Activity className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Vercel Web Analytics Cloud Telemetry</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Client telemetry active via @vercel/analytics. Cross-device analytics require VERCEL_TOKEN in your Vercel Project Environment Variables.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApifyConfig(true)}
                className="inline-flex items-center justify-center gap-1.5 text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-bold shrink-0 cursor-pointer transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Configure Telemetry Tokens</span>
              </button>
            </div>
          ) : (
            <div className="mb-4 p-2.5 bg-[#86efac]/10 border border-[#86efac]/30 font-mono text-xs text-[#86efac] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#86efac] animate-pulse" />
                <span className="font-bold">
                  Live Vercel Analytics Connected ({vercelAnalytics.projectName || vercelAnalytics.projectId})
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex flex-wrap items-center gap-2">
                <span>
                  <strong>{totalWebViews.toLocaleString()}</strong> Total Pageviews • <strong>{totalWebVisitors.toLocaleString()}</strong> Unique Visitors
                  {webBounceRate !== null && (
                    <> • <strong className="text-[#67e8f9]">{webBounceRate}%</strong> Bounce Rate</>
                  )}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900/90 text-[10px] text-emerald-400 border border-emerald-500/30">
                  Pure Readership (Excludes /analytics)
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {ledger.website.routes.map((route) => {
              const metrics = getRouteMetrics(route.path);
              const allRouteViews = ledger.website.routes.map((r) => getRouteMetrics(r.path).pageviews);
              const maxViews = Math.max(1, ...allRouteViews);
              const barPct = Math.min(
                100,
                Math.round((metrics.pageviews / maxViews) * 100)
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
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        PAGEVIEWS
                      </div>
                      <div className="text-sm font-bold text-[#86efac]">
                        {metrics.pageviews.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        VISITORS
                      </div>
                      <div className="text-sm font-bold text-[#67e8f9]">
                        {metrics.visitors.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#86efac] to-[#67e8f9] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, barPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vercel Cloud Intelligence Grids: Referrers, Countries, Devices, OS & Inbound Campaigns */}
          {vercelAnalytics?.connected && (
            <div className="mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 font-mono">
              {/* 1. Referrers with Platform Logos & Progress Bars */}
              <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-2.5">
                <div className="text-[11px] text-[#86efac] font-bold uppercase flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Top Referrers</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Visitors</span>
                </div>
                {vercelAnalytics.referrers?.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {vercelAnalytics.referrers.slice(0, 5).map((ref, idx) => {
                      const val = ref.visitors || ref.pageviews || 0;
                      const maxVal = Math.max(1, ...vercelAnalytics.referrers.map((r) => r.visitors || r.pageviews || 0));
                      const pct = Math.round((val / maxVal) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <ReferrerLogo hostname={ref.referrerHostname} />
                              <span className="truncate text-slate-300">
                                {ref.referrerHostname || 'Direct / Bookmark'}
                              </span>
                            </div>
                            <span className="font-bold text-[#86efac] shrink-0">
                              {val.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#86efac]/40 to-[#86efac] rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">No referrer data yet</div>
                )}
              </div>

              {/* 2. Countries with Country Flags & Progress Bars */}
              <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-2.5">
                <div className="text-[11px] text-[#67e8f9] font-bold uppercase flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Top Countries</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Visitors</span>
                </div>
                {vercelAnalytics.countries?.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {vercelAnalytics.countries.slice(0, 5).map((c, idx) => {
                      const val = c.visitors || c.pageviews || 0;
                      const maxVal = Math.max(1, ...vercelAnalytics.countries.map((x) => x.visitors || x.pageviews || 0));
                      const pct = Math.round((val / maxVal) * 100);
                      const countryName = c.country || 'Unknown';
                      const flag = getCountryFlag(countryName);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <span className="text-sm shrink-0 leading-none">{flag}</span>
                              <span className="truncate text-slate-300">
                                {countryName}
                              </span>
                            </div>
                            <span className="font-bold text-[#67e8f9] shrink-0">
                              {val.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#67e8f9]/40 to-[#67e8f9] rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">No country data yet</div>
                )}
              </div>

              {/* 3. Devices with Device Icons & Progress Bars */}
              <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-2.5">
                <div className="text-[11px] text-[#fda4af] font-bold uppercase flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Devices</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Visitors</span>
                </div>
                {vercelAnalytics.devices?.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {vercelAnalytics.devices.slice(0, 5).map((d, idx) => {
                      const val = d.visitors || d.pageviews || 0;
                      const maxVal = Math.max(1, ...vercelAnalytics.devices.map((x) => x.visitors || x.pageviews || 0));
                      const pct = Math.round((val / maxVal) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <DeviceIcon deviceType={d.deviceType} />
                              <span className="truncate text-slate-300 capitalize">
                                {d.deviceType || 'Desktop'}
                              </span>
                            </div>
                            <span className="font-bold text-[#fda4af] shrink-0">
                              {val.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#fda4af]/40 to-[#fda4af] rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">No device data yet</div>
                )}
              </div>

              {/* 4. Operating Systems with OS Icons & Progress Bars */}
              <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-2.5">
                <div className="text-[11px] text-[#c084fc] font-bold uppercase flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Operating Systems</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Visitors</span>
                </div>
                {vercelAnalytics.osList?.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    {vercelAnalytics.osList.slice(0, 5).map((os, idx) => {
                      const val = os.visitors || os.pageviews || 0;
                      const maxVal = Math.max(1, ...vercelAnalytics.osList.map((x) => x.visitors || x.pageviews || 0));
                      const pct = Math.round((val / maxVal) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <OsIcon osName={os.osName} />
                              <span className="truncate text-slate-300">
                                {os.osName || 'Unknown OS'}
                              </span>
                            </div>
                            <span className="font-bold text-[#c084fc] shrink-0">
                              {val.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#c084fc]/40 to-[#c084fc] rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">No OS data yet</div>
                )}
              </div>

              {/* 5. Inbound Campaign Channels (UTM Sources & Mediums) */}
              <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-2.5">
                <div className="text-[11px] text-[#fbbf24] font-bold uppercase flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Inbound UTMs</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Clicks</span>
                </div>
                {(() => {
                  const campaignChannels = [
                    {
                      name: 'Facebook',
                      tag: 'utm_source=facebook',
                      clicks: fbStoryEntrances,
                      color: '#60a5fa',
                    },
                    {
                      name: 'Instagram',
                      tag: 'utm_source=instagram',
                      clicks: igStoryEntrances,
                      color: '#fda4af',
                    },
                    {
                      name: 'YouTube',
                      tag: 'utm_source=youtube',
                      clicks: ytStoryEntrances,
                      color: '#ef4444',
                    },
                    {
                      name: '𝕏 (Twitter)',
                      tag: 'utm_source=x',
                      clicks: xStoryEntrances,
                      color: '#ffffff',
                    },
                    {
                      name: 'Pinterest',
                      tag: 'utm_source=pinterest',
                      clicks: pinStoryEntrances,
                      color: '#e60023',
                    },
                  ].sort((a, b) => b.clicks - a.clicks);
                  const maxClicks = Math.max(1, ...campaignChannels.map((c) => c.clicks));
                  return (
                    <div className="space-y-2 text-xs">
                      {campaignChannels.map((c, idx) => {
                        const pct = Math.round((c.clicks / maxClicks) * 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="truncate text-slate-300 font-bold">
                                {c.name}
                              </span>
                              <span className="font-bold shrink-0" style={{ color: c.color }}>
                                {c.clicks.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  backgroundColor: c.color,
                                  width: `${c.clicks > 0 ? Math.max(8, pct) : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-1 border-t border-slate-800/60 text-[10px] text-slate-400 truncate">
                        Mediums: thread, video, teaser, story
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </CyberPanel>

        {/* Vercel Speed Insights & Core Web Vitals Panel */}
        <CyberPanel
          label="Vercel Speed Insights • Core Web Vitals"
          accent="#86efac"
          className="p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#86efac]" />
                <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                  Speed Insights & Real User Experience (CWV)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live Core Web Vitals telemetry captured via @vercel/speed-insights and browser Performance APIs.
              </p>
            </div>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 border border-[#86efac]/60 bg-[#86efac]/10 px-3.5 py-1.5 font-mono text-xs text-[#86efac] font-bold hover:bg-[#86efac]/20 transition-colors w-full sm:w-auto shrink-0"
            >
              <span>Vercel Speed Insights</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 sm:gap-4 items-stretch">
            {/* Speed Score Gauge Box */}
            <div className="lg:col-span-2 p-4 bg-[#0b0d10] border border-slate-800 flex flex-col justify-between items-center text-center space-y-2">
              <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                Overall Speed Score
              </span>
              <div className="my-1">
                <div className="text-4xl sm:text-5xl font-mono font-black text-[#86efac] tracking-tight">
                  {speedVitals.score !== null ? speedVitals.score : '—'}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Target: 90–100 / 100
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#86efac]/15 text-[#86efac] font-bold">
                Optimal
              </span>
            </div>

            {/* 5 Core Web Vitals Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {/* LCP */}
              <div className="p-3 bg-[#0b0d10] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                    LCP
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#86efac]/15 text-[#86efac] font-bold">
                    Good &lt;2.5s
                  </span>
                </div>
                <div className="text-lg font-mono font-black text-[#e2e8f0]">
                  {speedVitals.lcp !== null ? `${(speedVitals.lcp / 1000).toFixed(2)}s` : '—'}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Largest Contentful Paint (Hero visual)
                </p>
              </div>

              {/* INP */}
              <div className="p-3 bg-[#0b0d10] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                    INP
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#86efac]/15 text-[#86efac] font-bold">
                    Good &lt;200ms
                  </span>
                </div>
                <div className="text-lg font-mono font-black text-[#e2e8f0]">
                  {speedVitals.inp !== null ? `${speedVitals.inp}ms` : '—'}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Interaction to Next Paint (Responsiveness)
                </p>
              </div>

              {/* CLS */}
              <div className="p-3 bg-[#0b0d10] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                    CLS
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#86efac]/15 text-[#86efac] font-bold">
                    Good &lt;0.1
                  </span>
                </div>
                <div className="text-lg font-mono font-black text-[#e2e8f0]">
                  {speedVitals.cls !== null ? speedVitals.cls : '0.000'}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Cumulative Layout Shift (Visual stability)
                </p>
              </div>

              {/* FCP */}
              <div className="p-3 bg-[#0b0d10] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                    FCP
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#86efac]/15 text-[#86efac] font-bold">
                    Good &lt;1.8s
                  </span>
                </div>
                <div className="text-lg font-mono font-black text-[#e2e8f0]">
                  {speedVitals.fcp !== null ? `${(speedVitals.fcp / 1000).toFixed(2)}s` : '—'}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  First Contentful Paint (DOM paint)
                </p>
              </div>

              {/* TTFB */}
              <div className="p-3 bg-[#0b0d10] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                    TTFB
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#86efac]/15 text-[#86efac] font-bold">
                    Good &lt;800ms
                  </span>
                </div>
                <div className="text-lg font-mono font-black text-[#e2e8f0]">
                  {speedVitals.ttfb !== null ? `${speedVitals.ttfb}ms` : '—'}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Time to First Byte (Edge CDN latency)
                </p>
              </div>
            </div>
          </div>
        </CyberPanel>
      </div>
    )}

    {/* Sub-Section 2: Dedicated Comparative Reels Visualizer (Facebook vs Instagram vs YouTube) */}
    {(analyticsTab === 'reels' || analyticsTab === 'all') && (
      <CyberPanel
        theme={theme}
        label="Comparative 9:16 Video Visualizer • Facebook vs Instagram vs YouTube Shorts"
        accent="#67e8f9"
        className="p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Film className="w-4 h-4 text-[#67e8f9]" />
              <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                9:16 Vertical Video Performance &amp; Cross-Platform Comparison
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Direct comparison of 9:16 video metrics across Facebook (observationsbymoth1), Instagram (@moth1.siv), and YouTube Shorts (@sivaraj.pragasm).
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            {(() => {
              const badges = [
                {
                  label: 'FB',
                  views: fbScrapedViews,
                  bg: 'bg-[#60a5fa]/10',
                  border: 'border-[#60a5fa]/30',
                  text: 'text-[#60a5fa]',
                },
                {
                  label: 'YT',
                  views: totalYtViews,
                  bg: 'bg-[#ef4444]/10',
                  border: 'border-[#ef4444]/30',
                  text: 'text-[#f87171]',
                },
                {
                  label: 'IG',
                  views: igScrapedViews,
                  bg: 'bg-[#fda4af]/10',
                  border: 'border-[#fda4af]/30',
                  text: 'text-[#fda4af]',
                },
              ].sort((a, b) => b.views - a.views);

              return badges.map((b) => (
                <span key={b.label} className={`px-2.5 py-1 ${b.bg} border ${b.border} ${b.text} font-bold`}>
                  {b.label}: {b.views.toLocaleString()} views
                </span>
              ));
            })()}
          </div>
        </div>

        {/* Cross-Channel Comparison Grid: Issue #03 vs Issue #02 vs Issue #01 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Issue #03: The War No One Was Supposed to Win Comparison Card */}
          <div className="p-4 bg-[#0b0d10] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="font-mono text-[10px] text-[#fbbf24] font-bold uppercase tracking-wider">
                  Issue #03
                </div>
                <div className="font-mono text-sm font-bold text-[#e2e8f0]">
                  The War No One Was Supposed to Win
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                9:16 Video Comparison
              </span>
            </div>

            {(() => {
              const fbItem = visibleFacebookItems.find((i) => matchItemToIssueId(i) === '03');
              const igItem = visibleInstagramItems.find((i) => matchItemToIssueId(i) === '03');
              const ytItem = ytVideoList.find((i) => i.issueId === '03') || {
                videoId: '',
                views: 0,
                likes: 0,
                comments: 0,
                url: 'https://observations.moth1.xyz/war-on-drugs',
              };

              const platforms03 = [
                {
                  id: 'fb',
                  name: 'Facebook Reel',
                  color: '#60a5fa',
                  views: fbItem?.views || 0,
                  likes: fbItem?.likes || 0,
                  comments: fbItem?.comments || 0,
                  url: fbItem?.url,
                  linkText: 'Watch on FB ↗',
                },
                {
                  id: 'yt',
                  name: 'YouTube Short',
                  color: '#ef4444',
                  views: Number(ytItem?.views) || 0,
                  likes: Number(ytItem?.likes) || 0,
                  comments: Number(ytItem?.comments) || 0,
                  url: ytItem?.url,
                  linkText: 'Watch Short ↗',
                },
                {
                  id: 'ig',
                  name: 'Instagram Reel',
                  color: '#fda4af',
                  views: igItem?.views || 0,
                  likes: igItem?.likes || 0,
                  comments: igItem?.comments || 0,
                  url: igItem?.url,
                  linkText: 'Watch on IG ↗',
                },
              ].sort((a, b) => b.views - a.views);

              const maxV = Math.max(1, ...platforms03.map((p) => p.views));

              return (
                <div className="space-y-3">
                  {platforms03.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`space-y-1 ${idx > 0 ? 'pt-2 border-t border-slate-800/60' : ''}`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold flex items-center gap-1.5" style={{ color: p.color }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </span>
                        <span className="text-white font-bold">{p.views.toLocaleString()} views</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            backgroundColor: p.color,
                            width: `${Math.min(100, Math.max(2, (p.views / maxV) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Likes: {p.likes} • Comments: {p.comments}</span>
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: p.color }}
                            className="hover:underline"
                          >
                            {p.linkText}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
          {/* Issue #02: The Meat Grinder Needs More Meat Comparison Card */}
          <div className="p-4 bg-[#0b0d10] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="font-mono text-[10px] text-[#f472b6] font-bold uppercase tracking-wider">
                  Issue #02
                </div>
                <div className="font-mono text-sm font-bold text-[#e2e8f0]">
                  The Meat Grinder Needs More Meat
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                9:16 Video Comparison
              </span>
            </div>

            {(() => {
              const fbItem = visibleFacebookItems.find((i) => matchItemToIssueId(i) === '02') || visibleFacebookItems[0];
              const igItem = visibleInstagramItems.find((i) => matchItemToIssueId(i) === '02') || visibleInstagramItems[0];
              const ytItem = ytVideoList.find((i) => i.issueId === '02') || {
                videoId: 'XiAPHfIshfY',
                views: 126,
                likes: 0,
                comments: 1,
                url: 'https://www.youtube.com/shorts/XiAPHfIshfY',
              };

              const platforms02 = [
                {
                  id: 'fb',
                  name: 'Facebook Reel',
                  color: '#60a5fa',
                  views: fbItem?.views || 0,
                  likes: fbItem?.likes || 0,
                  comments: fbItem?.comments || 0,
                  url: fbItem?.url,
                  linkText: 'Watch on FB ↗',
                },
                {
                  id: 'yt',
                  name: 'YouTube Short',
                  color: '#ef4444',
                  views: Number(ytItem?.views) || 0,
                  likes: Number(ytItem?.likes) || 0,
                  comments: Number(ytItem?.comments) || 0,
                  url: ytItem?.url,
                  linkText: 'Watch Short ↗',
                },
                {
                  id: 'ig',
                  name: 'Instagram Reel',
                  color: '#fda4af',
                  views: igItem?.views || 0,
                  likes: igItem?.likes || 0,
                  comments: igItem?.comments || 0,
                  url: igItem?.url,
                  linkText: 'Watch on IG ↗',
                },
              ].sort((a, b) => b.views - a.views);

              const maxV = Math.max(1, ...platforms02.map((p) => p.views));

              return (
                <div className="space-y-3">
                  {platforms02.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`space-y-1 ${idx > 0 ? 'pt-2 border-t border-slate-800/60' : ''}`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold flex items-center gap-1.5" style={{ color: p.color }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </span>
                        <span className="text-white font-bold">{p.views.toLocaleString()} views</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            backgroundColor: p.color,
                            width: `${Math.min(100, Math.max(2, (p.views / maxV) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Likes: {p.likes} • Comments: {p.comments}</span>
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: p.color }}
                            className="hover:underline"
                          >
                            {p.linkText}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Issue #01: Watering Grass in a Thunderstorm Comparison Card */}
          <div className="p-4 bg-[#0b0d10] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="font-mono text-[10px] text-[#fbbf24] font-bold uppercase tracking-wider">
                  Issue #01
                </div>
                <div className="font-mono text-sm font-bold text-[#e2e8f0]">
                  Watering Grass in a Thunderstorm
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                9:16 Video Comparison
              </span>
            </div>

            {(() => {
              const fbItem = visibleFacebookItems.find((i) => matchItemToIssueId(i) === '01') || visibleFacebookItems[1];
              const igItem = visibleInstagramItems.find((i) => matchItemToIssueId(i) === '01') || visibleInstagramItems[1];
              const ytItem = ytVideoList.find((i) => i.issueId === '01') || {
                videoId: 'tp6FqVQUO9w',
                views: 62,
                likes: 0,
                comments: 1,
                url: 'https://www.youtube.com/shorts/tp6FqVQUO9w',
              };

              const platforms01 = [
                {
                  id: 'yt',
                  name: 'YouTube Short',
                  color: '#ef4444',
                  views: Number(ytItem?.views) || 0,
                  likes: Number(ytItem?.likes) || 0,
                  comments: Number(ytItem?.comments) || 0,
                  url: ytItem?.url,
                  linkText: 'Watch Short ↗',
                },
                {
                  id: 'fb',
                  name: 'Facebook Reel',
                  color: '#60a5fa',
                  views: fbItem?.views || 0,
                  likes: fbItem?.likes || 0,
                  comments: fbItem?.comments || 0,
                  url: fbItem?.url,
                  linkText: 'Watch on FB ↗',
                },
                {
                  id: 'ig',
                  name: 'Instagram Reel',
                  color: '#fda4af',
                  views: igItem?.views || 0,
                  likes: igItem?.likes || 0,
                  comments: igItem?.comments || 0,
                  url: igItem?.url,
                  linkText: 'Watch on IG ↗',
                },
              ].sort((a, b) => b.views - a.views);

              const maxV = Math.max(1, ...platforms01.map((p) => p.views));

              return (
                <div className="space-y-3">
                  {platforms01.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`space-y-1 ${idx > 0 ? 'pt-2 border-t border-slate-800/60' : ''}`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold flex items-center gap-1.5" style={{ color: p.color }}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </span>
                        <span className="text-white font-bold">{p.views.toLocaleString()} views</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            backgroundColor: p.color,
                            width: `${Math.min(100, Math.max(2, (p.views / maxV) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Likes: {p.likes} • Comments: {p.comments}</span>
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: p.color }}
                            className="hover:underline"
                          >
                            {p.linkText}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </CyberPanel>
    )}

    {/* Sub-Section 3: Substack Publication */}
    {(analyticsTab === 'substack' || analyticsTab === 'all') && (
      <CyberPanel
        theme={theme}
        label="Substack Publication"
        accent="#67e8f9"
        className="p-4 sm:p-6"
      >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                Substack Publication Performance
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Newsletter subscriber growth, reads, and dispatch engagement metrics.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => triggerActorRun('substack')}
                disabled={runningActor !== null}
                className="inline-flex items-center justify-center gap-1.5 border border-[#67e8f9]/60 bg-[#67e8f9]/10 hover:bg-[#67e8f9]/20 px-3.5 py-1.5 font-mono text-xs text-[#67e8f9] font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
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

          {/* Substack & Email Inbound Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 font-mono">
            <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Inbound Visitors
              </div>
              <div className="text-2xl font-black text-[#67e8f9] tabular-nums">
                {totalSubstackVisitors.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">
                Combined Substack Web + Email
              </div>
            </div>

            <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Email Newsletter Inbound
              </div>
              <div className="text-2xl font-black text-[#86efac] tabular-nums">
                {emailStoryEntrances.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">
                utm_medium=email / webmail referrals
              </div>
            </div>

            <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Substack Web &amp; Notes
              </div>
              <div className="text-2xl font-black text-[#fbbf24] tabular-nums">
                {substackStoryEntrances.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">
                substack.com / notes / web dispatches
              </div>
            </div>

            <div className="p-3.5 bg-[#0b0d10] border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Scroll Retention (75%+)
              </div>
              <div className="text-2xl font-black text-white tabular-nums">
                {totalSubstackEmailScroll75.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">
                {totalSubstackVisitors > 0
                  ? ((totalSubstackEmailScroll75 / totalSubstackVisitors) * 100).toFixed(1)
                  : '0.0'}% completed reading essay
              </div>
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
      )}

      {/* Sub-Section 4: Social Scrapers (Instagram, Threads, Facebook, X) */}
        {(analyticsTab === 'social' || analyticsTab === 'all') && (
          <div className="space-y-4">
            {/* Platform Sub-Tabs when in Social View */}
            {analyticsTab === 'social' && (
              <div className={`flex items-center gap-1.5 p-2 border font-mono text-xs overflow-x-auto no-scrollbar scroll-smooth w-full ${
                isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-[#0b0d10] border-slate-800'
              }`}>
                <span className={`uppercase font-bold text-[10px] mr-1 shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Platform Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setSocialPlatformTab('all')}
                  className={`whitespace-nowrap shrink-0 px-2.5 py-1 transition-all cursor-pointer ${
                    socialPlatformTab === 'all'
                      ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-white text-black font-bold shadow')
                      : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
                  }`}
                >
                  All Channels ({visibleInstagramItems.length + visibleFacebookItems.length + visibleThreadsItems.length + visibleXItems.length + (ledger.youtube?.videos?.length || 2) + pinList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatformTab('instagram')}
                  className={`whitespace-nowrap shrink-0 px-2.5 py-1 transition-all cursor-pointer ${
                    socialPlatformTab === 'instagram'
                      ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#fda4af] text-black font-bold shadow')
                      : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#fda4af] hover:bg-[#fda4af]/10')
                  }`}
                >
                  Instagram ({visibleInstagramItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatformTab('facebook')}
                  className={`whitespace-nowrap shrink-0 px-2.5 py-1 transition-all cursor-pointer ${
                    socialPlatformTab === 'facebook'
                      ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#86efac] text-black font-bold shadow')
                      : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#86efac] hover:bg-[#86efac]/10')
                  }`}
                >
                  Facebook ({visibleFacebookItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatformTab('threads')}
                  className={`whitespace-nowrap shrink-0 px-2.5 py-1 transition-all cursor-pointer ${
                    socialPlatformTab === 'threads'
                      ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#c084fc] text-black font-bold shadow')
                      : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#c084fc] hover:bg-[#c084fc]/10')
                  }`}
                >
                  Threads ({visibleThreadsItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatformTab('x')}
                  className={`whitespace-nowrap shrink-0 px-2.5 py-1 transition-all cursor-pointer ${
                    socialPlatformTab === 'x'
                      ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-white text-black font-bold shadow')
                      : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-300 hover:bg-white/10')
                  }`}
                >
                  𝕏 (Twitter) ({visibleXItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatformTab('youtube')}
                  className={`whitespace-nowrap shrink-0 px-2.5 py-1 transition-all cursor-pointer ${
                    socialPlatformTab === 'youtube'
                      ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#ef4444] text-white font-bold shadow')
                      : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#f87171] hover:bg-[#ef4444]/10')
                  }`}
                >
                  YouTube ({ledger.youtube?.videos?.length || 2})
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatformTab('pinterest')}
                  className={`whitespace-nowrap shrink-0 px-2.5 py-1 transition-all cursor-pointer ${
                    socialPlatformTab === 'pinterest'
                      ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#e60023] text-white font-bold shadow')
                      : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#f87171] hover:bg-[#e60023]/10')
                  }`}
                >
                  Pinterest ({pinList.length})
                </button>
              </div>
            )}

            <div className={socialPlatformTab === "all" ? "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start" : "space-y-4 sm:space-y-6"}>
              {/* Instagram Apify Scraper Feed */}
              {(socialPlatformTab === 'all' || socialPlatformTab === 'instagram') && (
                <CyberPanel
                  theme={theme}
                  label="Instagram Reels • @moth1.siv"
                  accent="#fda4af"
                  className="p-4 sm:p-6"
                >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    Instagram Reels (@{targets.instagramHandle})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified video views, likes, and engagement metrics.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => triggerActorRun('instagram')}
                    disabled={runningActor !== null}
                    className="inline-flex items-center justify-center gap-1.5 border border-[#fda4af]/60 bg-[#fda4af]/10 hover:bg-[#fda4af]/20 px-3.5 py-1.5 font-mono text-xs text-[#fda4af] font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>
                      {runningActor === 'instagram'
                        ? 'Scraping Reels...'
                        : 'Run Reels Scraper'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerActorRun('instagramProfile')}
                    disabled={runningActor !== null}
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-900/80 hover:border-[#fda4af]/60 hover:text-[#fda4af] px-3.5 py-1.5 font-mono text-xs text-slate-300 font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                    title="Scrapes profile metadata to capture followers and bio"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>
                      {runningActor === 'instagramProfile'
                        ? 'Scraping Profile...'
                        : 'Scrape Followers'}
                    </span>
                  </button>
                </div>
              </div>

              {visibleInstagramItems.length === 0 ? (
                <div className="py-6 px-4 bg-[#0b0d10] border border-slate-800/80 text-center font-mono text-xs text-slate-400 mb-4 space-y-2">
                  <div>
                    No Instagram Reels loaded yet. Click &ldquo;Run Instagram Scraper&rdquo; above.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto -mx-1 sm:mx-0">
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

                  {/* Reel Views Comparison Visualizer Bar */}
                  {visibleInstagramItems.length >= 2 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase">
                        <span>Reel Views Comparison</span>
                        <span className="text-[#fda4af]">
                          {visibleInstagramItems.reduce((s, i) => s + (i.views || 0), 0).toLocaleString()} Total Views
                        </span>
                      </div>
                      <div className="space-y-2 font-mono text-xs">
                        {visibleInstagramItems.slice(0, 3).map((item, idx) => {
                          const maxViews = Math.max(1, ...visibleInstagramItems.map((i) => i.views || 0));
                          const pct = Math.round(((item.views || 0) / maxViews) * 100);
                          return (
                            <div key={item.id} className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="truncate max-w-[220px] text-slate-300">
                                  {getReelDisplayTitle(item, idx)}
                                </span>
                                <span className="font-bold text-[#fda4af]">
                                  {item.views.toLocaleString()} views
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#fda4af]/40 to-[#fda4af] rounded-full transition-all duration-300"
                                  style={{ width: `${Math.max(6, pct)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </CyberPanel>
        )}
          {(socialPlatformTab === 'all' || socialPlatformTab === 'facebook') && (
            <CyberPanel
              theme={theme}
              label="Facebook Reels"
              accent="#86efac"
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    Facebook Reels (@observationsbymoth1)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified video views, reach, and interaction metrics.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => triggerActorRun('facebook')}
                    disabled={runningActor !== null}
                    className="inline-flex items-center justify-center gap-1.5 border border-[#86efac]/60 bg-[#86efac]/10 hover:bg-[#86efac]/20 px-3.5 py-1.5 font-mono text-xs text-[#86efac] font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>
                      {runningActor === 'facebook'
                        ? 'Scraping FB Reels...'
                        : 'Run Facebook Scraper'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerActorRun('facebookPage')}
                    disabled={runningActor !== null}
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-900/80 hover:border-[#86efac]/60 hover:text-[#86efac] px-3.5 py-1.5 font-mono text-xs text-slate-300 font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                    title="Scrapes Facebook page metadata to capture followers and likes"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>
                      {runningActor === 'facebookPage'
                        ? 'Scraping Page...'
                        : 'Scrape Page Followers'}
                    </span>
                  </button>
                </div>
              </div>

              {visibleFacebookItems.length === 0 ? (
                <div className="py-5 px-4 bg-[#0b0d10] border border-slate-800/80 text-center font-mono text-xs text-slate-400 mb-4 space-y-2">
                  <div>
                    No Apify dataset items loaded yet for{' '}
                    <code className="text-[#86efac]">observationsbymoth1</code>.
                    Click &ldquo;Run Facebook Scraper&rdquo; above.
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto mb-4 max-h-[240px] -mx-1 sm:mx-0">
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

              {/* Reel Views Comparison Visualizer Bar */}
              {visibleFacebookItems.length >= 2 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase">
                    <span>Reel Views Comparison</span>
                    <span className="text-[#86efac]">
                      {visibleFacebookItems.reduce((s, i) => s + (i.views || 0), 0).toLocaleString()} Total Views
                    </span>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {visibleFacebookItems.slice(0, 3).map((item, idx) => {
                      const maxViews = Math.max(1, ...visibleFacebookItems.map((i) => i.views || 0));
                      const pct = Math.round(((item.views || 0) / maxViews) * 100);
                      return (
                        <div key={item.id} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[220px] text-slate-300">
                              {getReelDisplayTitle(item, idx)}
                            </span>
                            <span className="font-bold text-[#86efac]">
                              {item.views.toLocaleString()} views
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#86efac]/40 to-[#86efac] rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CyberPanel>
          )}
          {(socialPlatformTab === 'all' || socialPlatformTab === 'threads') && (
            <CyberPanel
              theme={theme}
              label="Threads Discussions • @moth1.siv"
              accent="#c084fc"
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    Threads Discussions (@{targets.threadsHandle})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Short-form dispatches, replies, and discussion metrics.
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
          )}
          {(socialPlatformTab === 'all' || socialPlatformTab === 'x') && (
            <CyberPanel
              theme={theme}
              label={`X Dispatches • @${targets.xHandle || 'Moth1NFTs'}`}
              accent="#e2e8f0"
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    X Dispatches (@{targets.xHandle || 'Moth1NFTs'})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verified impressions, reposts, likes, and campaign telemetry.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => triggerActorRun('x')}
                    disabled={runningActor !== null}
                    className="inline-flex items-center justify-center gap-1.5 border border-white/60 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 font-mono text-xs text-white font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>
                      {runningActor === 'x'
                        ? 'Scraping X...'
                        : 'Run X Scraper'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerActorRun('xProfile')}
                    disabled={runningActor !== null}
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-900/80 hover:border-white/60 hover:text-white px-3.5 py-1.5 font-mono text-xs text-slate-300 font-bold transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0"
                    title="Scrapes X user profile to capture followers count"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>
                      {runningActor === 'xProfile'
                        ? 'Scraping Profile...'
                        : 'Scrape Followers'}
                    </span>
                  </button>
                  <a
                    href={`https://x.com/${targets.xHandle || 'Moth1NFTs'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-900/80 hover:border-white/60 hover:text-white px-3.5 py-1.5 font-mono text-xs text-slate-300 font-bold transition-colors cursor-pointer w-full sm:w-auto shrink-0"
                  >
                    <span className="font-mono font-bold text-xs">𝕏</span>
                    <span>View Profile ↗</span>
                  </a>
                </div>
              </div>

              {/* Inline Run Status & Feedback */}
              {(runningActor === 'x' || runningActor === 'xProfile' || (statusMessage && (statusMessage.toLowerCase().includes('x') || statusMessage.toLowerCase().includes('apidojo') || statusMessage.toLowerCase().includes('apify')))) && (
                <div className="mb-3 px-3 py-2 bg-[#0b0d10] border border-white/30 flex items-center justify-between font-mono text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>
                      {runningActor === 'x'
                        ? `Scraping tweets from @${targets.xHandle || 'Moth1NFTs'} on Apify...`
                        : runningActor === 'xProfile'
                          ? `Scraping @${targets.xHandle || 'Moth1NFTs'} profile on Apify...`
                          : statusMessage}
                    </span>
                  </div>
                </div>
              )}

              {visibleXItems.length === 0 ? (
                <div className="py-5 px-4 bg-[#0b0d10] border border-slate-800/80 text-center font-mono text-xs text-slate-400 mb-4 space-y-2">
                  {allXThreads.length > 0 && filterOnlyObservations ? (
                    <>
                      <div>
                        Scraped <strong className="text-white">{allXThreads.length}</strong> X tweets/threads from @{targets.xHandle || 'Moth1NFTs'}, but none contain{' '}
                        <code className="text-[#86efac]">{activeFilterTag}</code>.
                      </div>
                      <button
                        type="button"
                        onClick={() => setFilterOnlyObservations(false)}
                        className="border border-slate-700 bg-[#121316] px-3 py-1 text-[11px] text-white hover:border-white cursor-pointer"
                      >
                        Show all {allXThreads.length} scraped X dispatches
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        No Apify dataset items loaded yet for{' '}
                        <code className="text-white">@{targets.xHandle || 'Moth1NFTs'}</code>.
                        Click &ldquo;Run X Scraper&rdquo; above.
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Campaign clicks from X are automatically tracked via UTM parameters in the Campaign Funnel below.
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto mb-4 max-h-[240px] -mx-1 sm:mx-0">
                    <table className="w-full text-left border-collapse min-w-[480px]">
                      <thead>
                        <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase">
                          <th className="py-2 pr-3">Post / Thread</th>
                          <th className="py-2 px-2">Impressions</th>
                          <th className="py-2 px-2">Likes</th>
                          <th className="py-2 px-2">Reposts</th>
                          <th className="py-2 px-2">Replies</th>
                          <th className="py-2 pl-2 text-right">Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 text-xs">
                        {visibleXItems.slice(0, 15).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/40">
                            <td className="py-2.5 pr-3 max-w-[240px] truncate text-[#e2e8f0]">
                              <div className="flex items-center gap-1.5">
                                {item.isThread && item.tweetCount > 1 && (
                                  <span
                                    className="px-1.5 py-0.5 border border-white/40 bg-white/10 text-[9px] font-mono text-white font-bold shrink-0"
                                    title={`${item.tweetCount} tweets in this thread`}
                                  >
                                    Thread ({item.tweetCount})
                                  </span>
                                )}
                                <span className="truncate" title={item.openingText || item.text}>
                                  {item.openingText || item.text}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-2 font-mono font-bold text-white">
                              {item.views.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-2 font-mono text-[#fda4af]">
                              {item.likes.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-2 font-mono text-[#86efac]">
                              {item.retweets.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-2 font-mono text-[#67e8f9]">
                              {item.replies.toLocaleString()}
                            </td>
                            <td className="py-2.5 pl-2 text-right">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[11px] text-[#67e8f9] hover:underline"
                                title="Open Thread on X"
                              >
                                ↗
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CyberPanel>
          )}
          {(socialPlatformTab === 'all' || socialPlatformTab === 'youtube') && (
            <CyberPanel
              theme={theme}
              label={`YouTube Shorts & Playlist • @${targets.youtubeHandle || 'sivaraj.pragasm'}`}
              accent="#ef4444"
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                    YouTube Channel &amp; Playlist (@{targets.youtubeHandle || 'sivaraj.pragasm'})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Playlist: <strong className="text-[#f87171]">Observations by Moth 1</strong> • Verified YouTube Shorts &amp; Inbound Telemetry.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#f87171] font-bold">
                      Subscribers: {ytSubscribers}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                      Shorts Views: {ytTotalViews.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                      Shorts Comments: {ytTotalEngagement.toLocaleString()}
                    </span>
                    {youtubeState.lastSynced && (
                      <span className="text-[10px] text-emerald-400 hidden sm:inline">
                        ● Synced {youtubeState.lastSynced}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={syncYoutubeTelemetry}
                    disabled={syncingYoutube}
                    className={`inline-flex items-center justify-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-all cursor-pointer w-full sm:w-auto shrink-0 disabled:opacity-50 ${
                      youtubeSyncSuccess
                        ? 'border-[#86efac] bg-[#86efac] text-[#0c0d10] font-black'
                        : 'border-[#ef4444] bg-[#ef4444] text-[#0c0d10] font-black hover:bg-[#ef4444]/90'
                    }`}
                    title="Fetch live metrics from YouTube Data API v3 & live scraper"
                  >
                    {youtubeSyncSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0c0d10]" />
                        <span>Synced! ({totalYtViews} Views)</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className={`w-3.5 h-3.5 ${syncingYoutube ? 'animate-spin' : ''}`} />
                        <span>{syncingYoutube ? 'Syncing...' : 'Sync YouTube API'}</span>
                      </>
                    )}
                  </button>
                  <a
                    href="https://www.youtube.com/playlist?list=PLXNcetLtk5xU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-[#ef4444]/60 bg-[#ef4444]/15 hover:bg-[#ef4444]/25 px-3 py-1.5 font-mono text-xs text-[#f87171] font-bold transition-colors cursor-pointer w-full sm:w-auto shrink-0"
                    title="Open YouTube playlist Observations by Moth 1"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#ef4444]" />
                    <span>View Playlist ↗</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@sivaraj.pragasm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-900 hover:border-white hover:text-white px-3 py-1.5 font-mono text-xs text-slate-300 font-bold transition-colors cursor-pointer w-full sm:w-auto shrink-0"
                    title="Open YouTube Channel @sivaraj.pragasm"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    <span>Channel Profile ↗</span>
                  </a>
                  <a
                    href="https://studio.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-700 bg-slate-900 hover:border-white hover:text-white px-3 py-1.5 font-mono text-xs text-slate-300 font-bold transition-colors cursor-pointer w-full sm:w-auto shrink-0"
                    title="Open YouTube Studio"
                  >
                    <span>Studio ↗</span>
                  </a>
                </div>
              </div>

              {/* YouTube Live Sync Feedback */}
              {(syncingYoutube || youtubeSyncSuccess || (statusMessage && (statusMessage.toLowerCase().includes('youtube') || statusMessage.toLowerCase().includes('shorts')))) && (
                <div className="mb-3 px-3 py-2 bg-[#0b0d10] border border-[#ef4444]/40 flex items-center justify-between font-mono text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${syncingYoutube ? 'bg-[#ef4444] animate-pulse' : 'bg-[#86efac]'}`} />
                    <span>
                      {syncingYoutube
                        ? 'Connecting to YouTube & refreshing Shorts view counts...'
                        : statusMessage || `✓ Synchronized YouTube Shorts metrics: ${totalYtViews} Total Views`}
                    </span>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto mb-4 max-h-[300px] -mx-1 sm:mx-0">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase">
                      <th className="py-2 pr-3">Dispatch / Short</th>
                      <th className="py-2 px-2 text-right">Views</th>
                      <th className="py-2 px-2 text-right">Likes</th>
                      <th className="py-2 px-2 text-right">Comments</th>
                      <th className="py-2 px-2">Medium</th>
                      <th className="py-2 px-2">Campaign</th>
                      <th className="py-2 px-2 text-right">Inbound Clicks</th>
                      <th className="py-2 pl-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {(() => {
                      const sortedYtVideos = [...ytVideoList].sort(
                        (a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)
                      );
                      return sortedYtVideos.map((vid) => {
                        const isIssue03 = vid.issueId === '03';
                        const isIssue02 = vid.issueId === '02';
                        const slug = isIssue03 ? 'war-on-drugs' : isIssue02 ? 'the-meat-grinder' : 'watering-grass-in-a-thunderstorm';
                        const medium = isIssue03 ? 'shorts' : isIssue02 ? 'profile' : 'community';
                        const campaign = isIssue03 ? 'issue-03' : isIssue02 ? 'issue-02' : 'issue-01';
                        const copyKey = `yt-copy-${vid.issueId || '03'}`;
                        const trackingUrl = `https://observations.moth1.xyz/${slug}?utm_source=youtube&utm_medium=${medium}&utm_campaign=${campaign}`;
                        const clicks = Number(storyClickStats?.issues?.[slug]?.youtube?.clicks || 0);

                        return (
                          <tr key={vid.id || vid.videoId} className="hover:bg-slate-900/40">
                            <td className="py-2.5 pr-3 text-[#e2e8f0]">
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 border border-[#ef4444]/40 bg-[#ef4444]/10 text-[9px] font-mono text-[#f87171] font-bold shrink-0">
                                  Short #{vid.issueId || '02'}
                                </span>
                                <span className="font-bold truncate">{vid.title}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-2 font-mono font-bold text-white text-right">
                              {(Number(vid.views) || 0).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-2 font-mono text-slate-400 text-right">
                              {Number(vid.likes) || 0}
                            </td>
                            <td className="py-2.5 px-2 font-mono text-slate-400 text-right">
                              {Number(vid.comments) || 0}
                            </td>
                            <td className="py-2.5 px-2 font-mono text-[#fda4af]">{medium}</td>
                            <td className="py-2.5 px-2 font-mono text-white">{campaign}</td>
                            <td className="py-2.5 px-2 font-mono font-bold text-[#f87171] text-right">
                              {clicks}
                            </td>
                            <td className="py-2.5 pl-2 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={vid.url || `https://www.youtube.com/shorts/${vid.videoId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-[11px] text-[#ef4444] hover:underline"
                                  title="Watch Short on YouTube"
                                >
                                  Watch Short ↗
                                </a>
                                <a
                                  href="https://www.youtube.com/playlist?list=PLXNcetLtk5xU"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-[11px] text-[#f87171] hover:underline"
                                  title="Open in Playlist Observations by Moth 1"
                                >
                                  Playlist ↗
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyDirectUrl(trackingUrl, copyKey)}
                                  className="font-mono text-[11px] text-[#67e8f9] hover:underline cursor-pointer"
                                >
                                  {copiedLink === copyKey ? 'Copied!' : 'Copy Link'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </CyberPanel>
          )}

          {/* Pinterest Pins & Telemetry Hub */}
          {(socialPlatformTab === 'all' || socialPlatformTab === 'pinterest') && (
            <CyberPanel
              theme={theme}
              label="Pinterest Pins • @moth1siv"
              accent="#e60023"
              className="p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Pin className="w-5 h-5 text-[#e60023]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#e2e8f0]">
                      Pinterest Pins (@{pinterestState?.profile?.username || 'moth1siv'})
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    1000×1500 Retina infographic pins, live profile scraping, and SEO tracked UTM links.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {pinterestState.lastSynced && (
                    <span className="font-mono text-[10px] text-slate-500">
                      ● Synced {pinterestState.lastSynced}
                    </span>
                  )}
                  <a
                    href="https://www.pinterest.com/moth1siv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs px-2.5 py-1.5 border border-[#e60023]/40 bg-[#e60023]/10 text-[#f87171] hover:bg-[#e60023]/20 transition-colors flex items-center gap-1.5"
                    title="Open Pinterest Profile"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={syncPinterestTelemetry}
                    disabled={syncingPinterest}
                    className={`font-mono text-xs px-2.5 py-1.5 border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      pinterestSyncSuccess
                        ? 'border-[#86efac] bg-[#86efac]/20 text-[#86efac] shadow-[0_0_12px_rgba(134,239,172,0.3)]'
                        : 'border-[#e60023] bg-[#e60023]/20 text-[#f87171] hover:bg-[#e60023]/30'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingPinterest ? 'animate-spin' : ''}`} />
                    <span>
                      {syncingPinterest
                        ? 'Syncing...'
                        : pinterestSyncSuccess
                        ? `Synced! (${pinList.length} Pins)`
                        : 'Sync Pinterest'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Pinterest Metric Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4 font-mono text-xs">
                <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Followers</div>
                  <div className="text-lg font-bold text-[#f87171] tabular-nums mt-0.5">
                    {pinFollowers.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">Audience</div>
                </div>
                <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Following</div>
                  <div className="text-lg font-bold text-white tabular-nums mt-0.5">
                    {pinFollowing.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">Accounts</div>
                </div>
                <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Saved Pins</div>
                  <div className="text-lg font-bold text-white tabular-nums mt-0.5">
                    {pinSavedCount.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">On Profile</div>
                </div>
                <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Created Pins</div>
                  <div className="text-lg font-bold text-white tabular-nums mt-0.5">
                    {pinCreatedCount.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">Authored</div>
                </div>
                <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Boards</div>
                  <div className="text-lg font-bold text-white tabular-nums mt-0.5">
                    {pinBoardsCount.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-500">Collections</div>
                </div>
                <div className="p-2.5 bg-[#0b0d10] border border-[#e60023]/30 bg-[#e60023]/5">
                  <div className="text-[10px] text-[#f87171] uppercase tracking-wider">Inbound Visits</div>
                  <div className="text-lg font-bold text-[#f87171] tabular-nums mt-0.5">
                    {pinStoryEntrances.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-400">Via UTM</div>
                </div>
              </div>

              {/* Ready-to-Publish & Tracked Pins Table */}
              <div className="overflow-x-auto border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0b0d10] text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Issue &amp; Plate</th>
                      <th className="py-2.5 px-3">Pin Title &amp; SEO Content</th>
                      <th className="py-2.5 px-2">Type</th>
                      <th className="py-2.5 px-2 text-right">Inbound Visits</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                    {pinList.map((pin) => {
                      const copyKey = `pin-${pin.id}`;
                      const issueSlug = pin.issueId === '03' ? 'war-on-drugs' : pin.issueId === '02' ? 'the-meat-grinder' : 'watering-grass-in-a-thunderstorm';
                      const issueClicks = Number(storyClickStats?.issues?.[issueSlug]?.pinterest?.clicks || 0);

                      return (
                        <tr key={pin.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold border border-[#e60023]/40 bg-[#e60023]/10 text-[#f87171]">
                                Issue #{pin.issueId}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {pin.plate?.replace(/_/g, ' ') || 'Plate'}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-sans max-w-sm">
                            <div className="font-bold text-white text-xs truncate">
                              {pin.title}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                              {pin.description}
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[10px]">
                            <span className="px-1 py-0.5 bg-slate-800 text-slate-300">
                              1000×1500
                            </span>
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-[#f87171] text-right">
                            {issueClicks}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={pin.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[11px] text-[#f87171] hover:underline"
                                title="Test Destination Link"
                              >
                                Test Link ↗
                              </a>
                              <button
                                type="button"
                                onClick={() => copyDirectUrl(pin.link, copyKey)}
                                className="font-mono text-[11px] text-[#67e8f9] hover:underline cursor-pointer"
                              >
                                {copiedLink === copyKey ? 'Copied!' : 'Copy Link'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Informational Guidance Footer */}
              <div className="mt-3 p-3 bg-[#0b0d10] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                  <span>
                    Pinterest API Trial Access: <strong>Pending Review</strong>. Zero-token profile scraper is actively powering live telemetry.
                  </span>
                </div>
                <div className="text-slate-500">
                  Script: <code>python3 scripts/publish-pinterest.py --issue 01|02</code>
                </div>
              </div>
            </CyberPanel>
          )}
            </div>
    </div>
  )}
</section>

{/* ================================================================= */}
{/* SECTION DIVIDER: TRANSITION TO FUNNEL TRACKING ENGINE            */}
{/* ================================================================= */}
<div className="relative py-4">
  <div className="absolute inset-0 flex items-center" aria-hidden="true">
    <div className="w-full border-t border-slate-800" />
  </div>
  <div className="relative flex justify-center">
    <span className="px-4 bg-[#0c0d10] text-[10px] font-mono uppercase tracking-[0.25em] text-[#f472b6] font-bold border border-slate-800">
      Campaign Inbound Attribution &amp; Conversion Pipeline
    </span>
  </div>
</div>

{/* ================================================================= */}
{/* MACRO-SECTION 2: UTM FUNNEL TRACKING & SPECIFIC UTM LINKS HUB     */}
{/* ================================================================= */}
<section id="funnel-tracking" className="space-y-6 pt-2">
  <CyberPanel
    theme={theme}
    label="UTM Funnel Tracker • Automated Telemetry & Campaign Hub"
    accent="#f472b6"
    className="p-4 sm:p-6"
  >
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
      <div>
        <div className="flex flex-wrap items-center gap-2.5 mb-1">
          <h2 className="text-base sm:text-xl font-bold text-[#e2e8f0]">
            UTM Campaign &amp; Funnel Tracker
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#86efac]/40 bg-[#86efac]/10 text-[#86efac] text-[10px] font-mono uppercase font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] animate-pulse" />
            100% AUTOMATED TELEMETRY
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Inbound traffic from Instagram &amp; Facebook stories, X campaigns, 75%+ scroll retention, and Substack subscriptions.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-mono shrink-0">
        {(() => {
          const funnelBadges = [
            {
              id: 'fb',
              label: 'FB',
              clicks: fbStoryEntrances,
              retention: fbStoryRetentionPct,
              subs: fbStorySubscribers,
              bg: 'bg-[#60a5fa]/10',
              border: 'border-[#60a5fa]/30',
              text: 'text-[#60a5fa]',
            },
            {
              id: 'ig',
              label: 'IG',
              clicks: igStoryEntrances,
              retention: igStoryRetentionPct,
              subs: igStorySubscribers,
              bg: 'bg-[#fda4af]/10',
              border: 'border-[#fda4af]/30',
              text: 'text-[#fda4af]',
            },
            {
              id: 'yt',
              label: 'YT',
              clicks: ytStoryEntrances,
              retention: ytStoryRetentionPct,
              subs: ytStorySubscribers,
              bg: 'bg-[#ef4444]/10',
              border: 'border-[#ef4444]/30',
              text: 'text-[#f87171]',
            },
            {
              id: 'x',
              label: '𝕏',
              clicks: xStoryEntrances,
              retention: xStoryRetentionPct,
              subs: xStorySubscribers,
              bg: 'bg-white/10',
              border: 'border-neutral-600',
              text: 'text-white',
            },
            {
              id: 'pin',
              label: 'Pin',
              clicks: pinStoryEntrances,
              retention: pinStoryRetentionPct,
              subs: pinStorySubscribers,
              bg: 'bg-[#e60023]/10',
              border: 'border-[#e60023]/30',
              text: 'text-[#f87171]',
            },
            {
              id: 'sub',
              label: 'Substack & Email',
              clicks: totalSubstackVisitors,
              retention: totalSubstackVisitors > 0 ? ((totalSubstackEmailScroll75 / totalSubstackVisitors) * 100).toFixed(1) : '0.0',
              subs: totalSubstackEmailSubscribers,
              bg: 'bg-[#67e8f9]/10',
              border: 'border-[#67e8f9]/30',
              text: 'text-[#67e8f9]',
            },
          ].sort((a, b) => b.clicks - a.clicks || parseFloat(b.retention) - parseFloat(a.retention));

          return funnelBadges.map((b) => (
            <span key={b.id} className={`px-2 py-1 ${b.bg} border ${b.border} ${b.text}`}>
              {b.label}: <strong>{b.clicks}</strong> clicks • <strong>{b.retention}%</strong> 75% read • <strong>{b.subs}</strong> subs
            </span>
          ));
        })()}
      </div>
    </div>

    {/* Specific UTM Campaign Links Hub */}
    <div className="p-4 sm:p-5 bg-[#0b0d10] border border-slate-800 space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#f472b6]" />
            <h3 className="text-sm sm:text-base font-bold text-[#e2e8f0]">
              Specific UTM Campaign Links Hub
            </h3>
            <span className="px-2 py-0.5 bg-[#f472b6]/10 border border-[#f472b6]/30 text-[#f472b6] text-[10px] font-mono uppercase font-bold">
              {activeUtmLinks.length} Active Links
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-configured distribution URLs with verified <code>utm_source</code>, <code>utm_medium</code>, and <code>utm_campaign</code> parameters for automated tracking.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-mono text-xs w-full">
          {/* Issue Filter */}
          <div className={`flex items-center gap-1 p-1 border overflow-x-auto no-scrollbar scroll-smooth ${
            isLight ? 'bg-white border-slate-300' : 'bg-[#121316] border-slate-800'
          }`}>
            <span className={`text-[10px] px-1 font-bold uppercase shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Issue:</span>
            <button
              type="button"
              onClick={() => setUtmLinksFilterIssue('all')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterIssue === 'all'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#f472b6] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterIssue('03')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterIssue === '03'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#f472b6] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              #03
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterIssue('02')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterIssue === '02'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#f472b6] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              #02
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterIssue('01')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterIssue === '01'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#f472b6] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              #01
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterIssue('home')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterIssue === 'home'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#f472b6] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              Home
            </button>
          </div>

          {/* Platform Filter */}
          <div className={`flex items-center gap-1 p-1 border overflow-x-auto no-scrollbar scroll-smooth ${
            isLight ? 'bg-white border-slate-300' : 'bg-[#121316] border-slate-800'
          }`}>
            <span className={`text-[10px] px-1 font-bold uppercase shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Channel:</span>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('all')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'all'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-white text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-400 hover:text-white')
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('instagram')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'instagram'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#fda4af] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#fda4af] hover:bg-[#fda4af]/10')
              }`}
            >
              IG
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('facebook')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'facebook'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#60a5fa] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#60a5fa] hover:bg-[#60a5fa]/10')
              }`}
            >
              FB
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('x')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'x'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-white text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-slate-300 hover:bg-white/10')
              }`}
            >
              𝕏
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('threads')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'threads'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#c084fc] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#c084fc] hover:bg-[#c084fc]/10')
              }`}
            >
              Threads
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('youtube')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'youtube'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#ef4444] text-white font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#f87171] hover:bg-[#ef4444]/10')
              }`}
            >
              YouTube
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('pinterest')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'pinterest'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#e60023] text-white font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#f87171] hover:bg-[#e60023]/10')
              }`}
            >
              Pin
            </button>
            <button
              type="button"
              onClick={() => setUtmLinksFilterPlatform('substack')}
              className={`whitespace-nowrap shrink-0 px-2 py-0.5 text-[11px] transition-all cursor-pointer ${
                utmLinksFilterPlatform === 'substack'
                  ? (isLight ? 'bg-[#0f172a] text-white font-bold shadow' : 'bg-[#67e8f9] text-black font-bold shadow')
                  : (isLight ? 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-100' : 'text-[#67e8f9] hover:bg-[#67e8f9]/10')
              }`}
            >
              Substack
            </button>
          </div>
        </div>
      </div>

      {/* Specific Links Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeUtmLinks.map((link) => {
          const isCopied = copiedLink === link.id;
          return (
            <div
              key={link.id}
              className="p-3 bg-[#121316] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    style={{ color: link.color }}
                    className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span
                      style={{ backgroundColor: link.color }}
                      className="w-2 h-2 rounded-full shrink-0"
                    />
                    {link.platformLabel}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {link.badge}
                  </span>
                </div>

                <div className="text-xs font-bold text-[#e2e8f0]">
                  {link.issueTitle}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {link.description}
                </p>
              </div>

              {/* URL Box */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div className="p-2 bg-[#0b0d10] border border-slate-800 text-[10px] font-mono text-slate-300 break-all select-all max-h-16 overflow-y-auto">
                  {link.url}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyDirectUrl(link.url, link.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#f472b6]/15 hover:bg-[#f472b6]/25 border border-[#f472b6]/40 text-[#f472b6] font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#86efac]" />
                        <span className="text-[#86efac]">Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy UTM Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 font-mono text-xs transition-colors"
                    title="Test open link in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Custom Campaign UTM Link Generator */}
    <div className="p-4 sm:p-5 bg-[#0b0d10] border border-slate-800 space-y-3 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#67e8f9]" />
          <h3 className="text-sm sm:text-base font-bold text-[#e2e8f0]">
            Custom Campaign UTM Generator
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Instant live preview &amp; copy
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">Target Route / Issue:</label>
          <select
            value={customUtmIssue}
            onChange={(e) => {
              const val = e.target.value;
              setCustomUtmIssue(val);
              if (val === 'war-on-drugs') {
                setCustomUtmCampaign('issue-03');
              } else if (val === 'the-meat-grinder') {
                setCustomUtmCampaign('issue-02');
              } else if (val === 'watering-grass-in-a-thunderstorm') {
                setCustomUtmCampaign('issue-01');
              } else {
                setCustomUtmCampaign('profile');
              }
            }}
            className="w-full bg-[#121316] border border-slate-700 px-2.5 py-1.5 text-xs font-mono text-[#e2e8f0] outline-none"
          >
            <option value="war-on-drugs">Issue #03: The War No One Was Supposed to Win</option>
            <option value="the-meat-grinder">Issue #02: The Meat Grinder Needs More Meat</option>
            <option value="watering-grass-in-a-thunderstorm">Issue #01: Watering Grass in a Thunderstorm</option>
            <option value="">Home: Main Publication Page</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">utm_source:</label>
          <input
            type="text"
            value={customUtmSource}
            onChange={(e) => setCustomUtmSource(e.target.value)}
            placeholder="instagram, facebook, x, youtube, threads..."
            className="w-full bg-[#121316] border border-slate-700 px-2.5 py-1.5 text-xs font-mono text-[#e2e8f0] outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">utm_medium:</label>
          <input
            type="text"
            value={customUtmMedium}
            onChange={(e) => setCustomUtmMedium(e.target.value)}
            placeholder="story, thread, video, shorts, community, profile..."
            className="w-full bg-[#121316] border border-slate-700 px-2.5 py-1.5 text-xs font-mono text-[#e2e8f0] outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold">utm_campaign:</label>
          <input
            type="text"
            value={customUtmCampaign}
            onChange={(e) => setCustomUtmCampaign(e.target.value)}
            placeholder="launch, issue-02, promo..."
            className="w-full bg-[#121316] border border-slate-700 px-2.5 py-1.5 text-xs font-mono text-[#e2e8f0] outline-none"
          />
        </div>
      </div>

      {/* Generated URL & One-Click Copy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
        <div className="flex-1 p-2 bg-[#121316] border border-slate-800 text-[11px] font-mono text-[#67e8f9] break-all select-all">
          {generatedCustomUrl}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => copyDirectUrl(generatedCustomUrl, 'custom-generator')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#67e8f9] text-[#0c0d10] font-mono text-xs font-bold uppercase transition-all cursor-pointer hover:bg-[#86efac]"
          >
            {copiedLink === 'custom-generator' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Custom Link</span>
              </>
            )}
          </button>
          <a
            href={generatedCustomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 border border-slate-700 bg-slate-900 text-slate-300 font-mono text-xs hover:border-white transition-colors"
          >
            <span>Test ↗</span>
          </a>
        </div>
      </div>
    </div>

    {/* Section Header: Issue Cross-Channel Funnels */}
    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-4">
      <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
        Cross-Platform Funnel Attribution by Issue
      </div>
      <div className="text-[11px] font-mono text-slate-400">
        Story Entrances → 75% Scroll Retention → Substack Subscriptions
      </div>
    </div>

          <div className="space-y-4 sm:space-y-6">
            {storyDispatches.map((dispatch) => {
              const issueTag = dispatch.issueId || dispatch.id;

              const issueStats = storyClickStats?.issues?.[dispatch.slug] || {};

              // Metric calculations for Instagram (Bypassing Vercel Plus Paywall)
              const igEntrances = Math.max(
                Number(issueStats.instagram?.clicks || 0),
                Number(dispatch.instagram?.entrances ?? dispatch.instagram?.clicks ?? 0)
              );
              const igScroll75 = Math.max(
                Number(issueStats.instagram?.scroll75 || 0),
                Number(dispatch.instagram?.scroll75 ?? 0)
              );
              const igSubs = Math.max(
                Number(issueStats.instagram?.subscribers || 0),
                Number(dispatch.instagram?.subscribers ?? 0)
              );
              const igRetentionPct =
                igEntrances > 0
                  ? Math.min(100, (igScroll75 / igEntrances) * 100).toFixed(1)
                  : (igScroll75 > 0 ? '100.0' : '0.0');
              const igConvPct =
                igEntrances > 0
                  ? ((igSubs / igEntrances) * 100).toFixed(1)
                  : '0.0';

              // Metric calculations for Facebook (Bypassing Vercel Plus Paywall)
              const fbEntrances = Math.max(
                Number(issueStats.facebook?.clicks || 0),
                Number(dispatch.facebook?.entrances ?? dispatch.facebook?.clicks ?? 0)
              );
              const fbScroll75 = Math.max(
                Number(issueStats.facebook?.scroll75 || 0),
                Number(dispatch.facebook?.scroll75 ?? 0)
              );
              const fbSubs = Math.max(
                Number(issueStats.facebook?.subscribers || 0),
                Number(dispatch.facebook?.subscribers ?? 0)
              );
              const fbRetentionPct =
                fbEntrances > 0
                  ? Math.min(100, (fbScroll75 / fbEntrances) * 100).toFixed(1)
                  : (fbScroll75 > 0 ? '100.0' : '0.0');
              const fbConvPct =
                fbEntrances > 0
                  ? ((fbSubs / fbEntrances) * 100).toFixed(1)
                  : '0.0';

              // Metric calculations for X (Twitter) Campaigns
              const xEntrances = Math.max(
                Number(issueStats.x?.clicks || 0),
                Number(dispatch.x?.entrances ?? dispatch.x?.clicks ?? 0)
              );
              const xScroll75 = Math.max(
                Number(issueStats.x?.scroll75 || 0),
                Number(dispatch.x?.scroll75 ?? 0)
              );
              const xSubs = Math.max(
                Number(issueStats.x?.subscribers || 0),
                Number(dispatch.x?.subscribers ?? 0)
              );
              const xRetentionPct =
                xEntrances > 0
                  ? Math.min(100, (xScroll75 / xEntrances) * 100).toFixed(1)
                  : (xScroll75 > 0 ? '100.0' : '0.0');
              const xConvPct =
                xEntrances > 0
                  ? ((xSubs / xEntrances) * 100).toFixed(1)
                  : '0.0';

              // Metric calculations for YouTube Channel & Shorts
              const ytEntrances = Math.max(
                Number(issueStats.youtube?.clicks || 0),
                Number(dispatch.youtube?.entrances ?? dispatch.youtube?.clicks ?? 0)
              );
              const ytScroll75 = Math.max(
                Number(issueStats.youtube?.scroll75 || 0),
                Number(dispatch.youtube?.scroll75 ?? 0)
              );
              const ytSubs = Math.max(
                Number(issueStats.youtube?.subscribers || 0),
                Number(dispatch.youtube?.subscribers ?? 0)
              );
              const ytRetentionPct =
                ytEntrances > 0
                  ? Math.min(100, (ytScroll75 / ytEntrances) * 100).toFixed(1)
                  : (ytScroll75 > 0 ? '100.0' : '0.0');
              const ytConvPct =
                ytEntrances > 0
                  ? ((ytSubs / ytEntrances) * 100).toFixed(1)
                  : '0.0';

              // Metric calculations for Pinterest Pins & Profile
              const pinEntrances = Math.max(
                Number(issueStats.pinterest?.clicks || 0),
                Number(dispatch.pinterest?.entrances ?? dispatch.pinterest?.clicks ?? 0)
              );
              const pinScroll75 = Math.max(
                Number(issueStats.pinterest?.scroll75 || 0),
                Number(dispatch.pinterest?.scroll75 ?? 0)
              );
              const pinSubs = Math.max(
                Number(issueStats.pinterest?.subscribers || 0),
                Number(dispatch.pinterest?.subscribers ?? 0)
              );
              const pinRetentionPct =
                pinEntrances > 0
                  ? Math.min(100, (pinScroll75 / pinEntrances) * 100).toFixed(1)
                  : (pinScroll75 > 0 ? '100.0' : '0.0');
              const pinConvPct =
                pinEntrances > 0
                  ? ((pinSubs / pinEntrances) * 100).toFixed(1)
                  : '0.0';

              // Metric calculations for Substack Notes & Email Newsletter
              const subEntrances = Math.max(
                Number(issueStats.substack?.clicks || 0),
                Number(dispatch.substack?.entrances ?? dispatch.substack?.clicks ?? 0)
              );
              const subScroll75 = Math.max(
                Number(issueStats.substack?.scroll75 || 0),
                Number(dispatch.substack?.scroll75 ?? 0)
              );
              const subSubs = Math.max(
                Number(issueStats.substack?.subscribers || 0),
                Number(dispatch.substack?.subscribers ?? 0)
              );

              const mailEntrances = Math.max(
                Number(issueStats.email?.clicks || 0),
                Number(dispatch.email?.entrances ?? dispatch.email?.clicks ?? 0)
              );
              const mailScroll75 = Math.max(
                Number(issueStats.email?.scroll75 || 0),
                Number(dispatch.email?.scroll75 ?? 0)
              );
              const mailSubs = Math.max(
                Number(issueStats.email?.subscribers || 0),
                Number(dispatch.email?.subscribers ?? 0)
              );

              const totalSubIssueEntrances = subEntrances + mailEntrances;
              const totalSubIssueScroll75 = subScroll75 + mailScroll75;
              const totalSubIssueSubs = subSubs + mailSubs;

              const subRetentionPct =
                totalSubIssueEntrances > 0
                  ? Math.min(100, (totalSubIssueScroll75 / totalSubIssueEntrances) * 100).toFixed(1)
                  : (totalSubIssueScroll75 > 0 ? '100.0' : '0.0');
              const subConvPct =
                totalSubIssueEntrances > 0
                  ? ((totalSubIssueSubs / totalSubIssueEntrances) * 100).toFixed(1)
                  : '0.0';

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

                  {/* Cross-Channel Columns Sorted by Highest Inbound Performance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {(() => {
                      const platformCards = [
                        {
                          id: 'instagram',
                          entrances: igEntrances,
                          scroll75: igScroll75,
                          card: (
                            <div key="instagram" className="p-3 sm:p-4 bg-[#121316] border border-[#fda4af]/30 rounded-none space-y-3">
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
                          {copiedLink === `${issueTag}-instagram` || copiedLink === `${issueTag}-instagram-story` ? (
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

                      {/* 3 Automated Telemetry Metrics for Instagram */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            <span>Story Entrances</span>
                            <span className="text-[8px] font-bold text-[#fda4af] bg-[#fda4af]/10 px-1 py-0.5 border border-[#fda4af]/30">
                              {igEntrances} Clicks
                            </span>
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#fda4af] tabular-nums mt-1">
                            {igEntrances.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            utm_source=instagram • Verified Clicks
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Scroll Retention
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#fbbf24] tabular-nums mt-1">
                            {igRetentionPct}%
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {igScroll75} read past 75% depth
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Subscriber Conv.
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#86efac] tabular-nums mt-1">
                            {igSubs}{' '}
                            <span className="text-xs font-normal text-slate-400">
                              ({igConvPct}%)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Substack subscriptions
                          </div>
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            75% Retention: <strong className="text-[#fbbf24]">{igRetentionPct}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{igConvPct}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#fbbf24] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(igRetentionPct) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(igConvPct) || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'facebook',
                  entrances: fbEntrances,
                  scroll75: fbScroll75,
                  card: (
                    <div key="facebook" className="p-3 sm:p-4 bg-[#121316] border border-[#60a5fa]/30 rounded-none space-y-3">
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
                          {copiedLink === `${issueTag}-facebook` || copiedLink === `${issueTag}-facebook-story` ? (
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

                      {/* 3 Automated Telemetry Metrics for Facebook */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            <span>Story Entrances</span>
                            <span className="text-[8px] font-bold text-[#60a5fa] bg-[#60a5fa]/10 px-1 py-0.5 border border-[#60a5fa]/30">
                              {fbEntrances} Clicks
                            </span>
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#60a5fa] tabular-nums mt-1">
                            {fbEntrances.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            utm_source=facebook • Verified Clicks
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Scroll Retention
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#fbbf24] tabular-nums mt-1">
                            {fbRetentionPct}%
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {fbScroll75} read past 75% depth
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Subscriber Conv.
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#86efac] tabular-nums mt-1">
                            {fbSubs}{' '}
                            <span className="text-xs font-normal text-slate-400">
                              ({fbConvPct}%)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Substack subscriptions
                          </div>
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            75% Retention: <strong className="text-[#fbbf24]">{fbRetentionPct}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{fbConvPct}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#fbbf24] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(fbRetentionPct) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(fbConvPct) || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'x',
                  entrances: xEntrances,
                  scroll75: xScroll75,
                  card: (
                    <div key="x" className="p-3 sm:p-4 bg-[#121316] border border-neutral-700/60 rounded-none space-y-3">
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                            𝕏 Campaigns
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'x', 'thread')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-neutral-700 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-white hover:text-white transition-colors cursor-pointer"
                            title="Copy Thread Link with utm_source=x&utm_medium=thread"
                          >
                            {copiedLink === `${issueTag}-x-thread` ? (
                              <span className="text-[#86efac]">Copied Thread!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#d97706]" />
                                <span>Thread</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'x', 'video')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-neutral-700 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-white hover:text-white transition-colors cursor-pointer"
                            title="Copy Video Link with utm_source=x&utm_medium=video"
                          >
                            {copiedLink === `${issueTag}-x-video` ? (
                              <span className="text-[#86efac]">Copied Video!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#67e8f9]" />
                                <span>Video</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'x', 'teaser')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-neutral-700 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-white hover:text-white transition-colors cursor-pointer"
                            title="Copy Teaser Link with utm_source=x&utm_medium=teaser"
                          >
                            {copiedLink === `${issueTag}-x-teaser` ? (
                              <span className="text-[#86efac]">Copied Teaser!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>Teaser</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 3 Automated Telemetry Metrics for X */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            <span>Campaign Clicks</span>
                            <span className="text-[8px] font-bold text-white bg-white/10 px-1 py-0.5 border border-white/30">
                              {xEntrances} Clicks
                            </span>
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums mt-1">
                            {xEntrances.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            utm_source=x • Verified Clicks
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Scroll Retention
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#fbbf24] tabular-nums mt-1">
                            {xRetentionPct}%
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {xScroll75} read past 75% depth
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Subscriber Conv.
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#86efac] tabular-nums mt-1">
                            {xSubs}{' '}
                            <span className="text-xs font-normal text-slate-400">
                              ({xConvPct}%)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Substack subscriptions
                          </div>
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            75% Retention: <strong className="text-[#fbbf24]">{xRetentionPct}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{xConvPct}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#fbbf24] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(xRetentionPct) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(xConvPct) || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'youtube',
                  entrances: ytEntrances,
                  scroll75: ytScroll75,
                  card: (
                    <div key="youtube" className="p-3 sm:p-4 bg-[#121316] border border-[#ef4444]/30 rounded-none space-y-3">
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0" />
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#f87171]">
                            YouTube Shorts
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'youtube', 'community')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-[#ef4444]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#ef4444] hover:text-[#f87171] transition-colors cursor-pointer"
                            title="Copy Community Link with utm_source=youtube&utm_medium=community"
                          >
                            {copiedLink === `${issueTag}-youtube-community` ? (
                              <span className="text-[#86efac]">Copied!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#f87171]" />
                                <span>Community</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'youtube', 'profile')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-[#ef4444]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#ef4444] hover:text-[#f87171] transition-colors cursor-pointer"
                            title="Copy Profile Link with utm_source=youtube&utm_medium=profile"
                          >
                            {copiedLink === `${issueTag}-youtube-profile` ? (
                              <span className="text-[#86efac]">Copied!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#f87171]" />
                                <span>Profile</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'youtube', 'shorts')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-[#ef4444]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#ef4444] hover:text-[#f87171] transition-colors cursor-pointer"
                            title="Copy Shorts Link with utm_source=youtube&utm_medium=shorts"
                          >
                            {copiedLink === `${issueTag}-youtube-shorts` ? (
                              <span className="text-[#86efac]">Copied!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#f87171]" />
                                <span>Shorts</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 3 Automated Telemetry Metrics for YouTube */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            <span>Channel Clicks</span>
                            <span className="text-[8px] font-bold text-[#f87171] bg-[#ef4444]/10 px-1 py-0.5 border border-[#ef4444]/30">
                              {ytEntrances} Clicks
                            </span>
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#f87171] tabular-nums mt-1">
                            {ytEntrances.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            utm_source=youtube • Verified Clicks
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Scroll Retention
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#fbbf24] tabular-nums mt-1">
                            {ytRetentionPct}%
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {ytScroll75} read past 75% depth
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Subscriber Conv.
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#86efac] tabular-nums mt-1">
                            {ytSubs}{' '}
                            <span className="text-xs font-normal text-slate-400">
                              ({ytConvPct}%)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Substack subscriptions
                          </div>
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            75% Retention: <strong className="text-[#fbbf24]">{ytRetentionPct}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{ytConvPct}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#fbbf24] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(ytRetentionPct) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(ytConvPct) || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'pinterest',
                  entrances: pinEntrances,
                  scroll75: pinScroll75,
                  card: (
                    <div
                      key="pin"
                      className="p-3.5 sm:p-4 bg-[#121316] border border-[#e60023]/40 space-y-3 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Pin className="w-4 h-4 text-[#e60023]" />
                          <span className="font-mono text-xs font-bold text-white">
                            Pinterest Pins (@{pinterestState?.profile?.username || 'moth1siv'})
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#e60023]/10 text-[#f87171] border border-[#e60023]/30">
                            1000×1500
                          </span>
                        </div>

                        {/* Copy UTM Link Buttons for Pinterest */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'pinterest', 'pin')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-[#e60023]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#e60023] hover:text-[#f87171] transition-colors cursor-pointer"
                            title="Copy Pin Link with utm_source=pinterest&utm_medium=pin"
                          >
                            {copiedLink === `${issueTag}-pinterest-pin` ? (
                              <span className="text-[#86efac]">Copied Pin!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#f87171]" />
                                <span>Copy Pin Link</span>
                              </>
                            )}
                          </button>
                          <a
                            href="https://www.pinterest.com/moth1siv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-slate-800 bg-[#0b0d10] text-[10px] font-mono text-slate-400 hover:text-white transition-colors"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>

                      {/* 3 Automated Telemetry Metrics for Pinterest */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            <span>Pin Clicks</span>
                            <span className="text-[8px] font-bold text-[#f87171] bg-[#e60023]/10 px-1 py-0.5 border border-[#e60023]/30">
                              {pinEntrances} Clicks
                            </span>
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#f87171] tabular-nums mt-1">
                            {pinEntrances.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            utm_source=pinterest • Verified
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Scroll Retention
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#fbbf24] tabular-nums mt-1">
                            {pinRetentionPct}%
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {pinScroll75} read past 75% depth
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Subscriber Conv.
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#86efac] tabular-nums mt-1">
                            {pinSubs}{' '}
                            <span className="text-xs font-normal text-slate-400">
                              ({pinConvPct}%)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Substack subscriptions
                          </div>
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            75% Retention: <strong className="text-[#fbbf24]">{pinRetentionPct}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{pinConvPct}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#fbbf24] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(pinRetentionPct) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(pinConvPct) || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'substack',
                  entrances: totalSubIssueEntrances,
                  scroll75: totalSubIssueScroll75,
                  card: (
                    <div
                      key="substack"
                      className="p-3.5 sm:p-4 bg-[#121316] border border-[#67e8f9]/40 space-y-3 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#67e8f9]" />
                          <span className="font-mono text-xs font-bold text-white">
                            Substack &amp; Email
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#67e8f9]/10 text-[#67e8f9] border border-[#67e8f9]/30">
                            Newsletter
                          </span>
                        </div>

                        {/* Copy UTM Link Buttons for Substack */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'substack', 'note')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-[#fbbf24]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#fbbf24] hover:text-[#fbbf24] transition-colors cursor-pointer"
                            title="Copy Substack Note Link"
                          >
                            {copiedLink === `${issueTag}-substack-note` ? (
                              <span className="text-[#86efac]">Copied Note!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#fbbf24]" />
                                <span>Copy Note Link</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyUtmLink(dispatch.slug, issueTag, 'substack', 'email')}
                            className="inline-flex items-center justify-center gap-1 px-2 py-1 border border-[#67e8f9]/40 bg-[#0b0d10] text-[10px] font-mono text-slate-300 hover:border-[#67e8f9] hover:text-[#67e8f9] transition-colors cursor-pointer"
                            title="Copy Substack Email Newsletter Link"
                          >
                            {copiedLink === `${issueTag}-substack-email` ? (
                              <span className="text-[#86efac]">Copied Email!</span>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-[#67e8f9]" />
                                <span>Copy Email Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* 3 Automated Telemetry Metrics for Substack */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="flex items-center justify-between text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            <span>Inbound Visitors</span>
                            <span className="text-[8px] font-bold text-[#67e8f9] bg-[#67e8f9]/10 px-1 py-0.5 border border-[#67e8f9]/30">
                              {mailEntrances} Email • {subEntrances} Web
                            </span>
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#67e8f9] tabular-nums mt-1">
                            {totalSubIssueEntrances.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Substack &amp; Email Newsletter
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Scroll Retention
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#fbbf24] tabular-nums mt-1">
                            {subRetentionPct}%
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {totalSubIssueScroll75} read past 75% depth
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0b0d10] border border-slate-800">
                          <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                            Subscriber Conv.
                          </div>
                          <div className="font-mono text-xl sm:text-2xl font-black text-[#86efac] tabular-nums mt-1">
                            {totalSubIssueSubs}{' '}
                            <span className="text-xs font-normal text-slate-400">
                              ({subConvPct}%)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                            Substack subscriptions
                          </div>
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                          <span className="text-slate-400">
                            75% Retention: <strong className="text-[#fbbf24]">{subRetentionPct}%</strong>
                          </span>
                          <span className="text-slate-400">
                            Substack Conv: <strong className="text-[#86efac]">{subConvPct}%</strong>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 overflow-hidden flex">
                          <div
                            className="h-full bg-[#fbbf24] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(subRetentionPct) || 0))}%`,
                            }}
                          />
                          <div
                            className="h-full bg-[#86efac] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, Number(subConvPct) || 0))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                },
              ].sort((a, b) => b.entrances - a.entrances || b.scroll75 - a.scroll75);

              return platformCards.map((p) => p.card);
            })()}
          </div>
                </div>
              );
            })}
          </div>
        </CyberPanel>
      </section>
    </div>
  );
}
