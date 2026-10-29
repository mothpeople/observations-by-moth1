import { track } from '@vercel/analytics/react';

const STORAGE_KEY = 'moth1_analytics_ledger_v1';

const DEFAULT_CHANNEL_LEDGER = {
  website: {
    provider: 'Vercel Web Analytics (@vercel/analytics)',
    domain: 'observations.moth1.xyz',
    status: 'ACTIVE',
    routes: [
      {
        id: 'home',
        path: '/',
        title: 'Main Publication Landing Page',
        views: 1,
        shares: 0,
        avgScrollDepth: 100,
      },
      {
        id: '02',
        path: '/the-meat-grinder',
        title: 'Issue #02: The Meat Grinder Needs More Meat',
        views: 1,
        shares: 0,
        avgScrollDepth: 92,
      },
      {
        id: '01',
        path: '/watering-grass-in-a-thunderstorm',
        title: 'Issue #01: Watering Grass in a Thunderstorm',
        views: 1,
        shares: 0,
        avgScrollDepth: 88,
      },
    ],
  },
  instagram: {
    handle: '@moth1.siv',
    platform: 'Instagram Reels',
    followers: 0,
    reels: [
      {
        id: 'ig-reel-02',
        issueId: '02',
        title: 'The Meat Grinder Needs More Meat (9:16 Reel • 42s)',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        avgWatchTimeSec: 0,
        status: 'Ready to Post',
      },
      {
        id: 'ig-reel-01',
        issueId: '01',
        title: 'Watering Grass in a Thunderstorm (9:16 Reel • 35s)',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        avgWatchTimeSec: 0,
        status: 'Published',
      },
    ],
  },
  facebook: {
    handle: 'sivaraj.pragasm',
    platform: 'Facebook Reels & Page',
    followers: 0,
    reels: [
      {
        id: 'fb-reel-02',
        issueId: '02',
        title: 'The Meat Grinder Needs More Meat (9:16 Reel • 42s)',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        linkClicks: 0,
        status: 'Ready to Post',
      },
      {
        id: 'fb-reel-01',
        issueId: '01',
        title: 'Watering Grass in a Thunderstorm (9:16 Reel • 35s)',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        linkClicks: 0,
        status: 'Published',
      },
    ],
  },
  substackSubscribers: 0,
};

export function loadChannelLedger() {
  if (typeof window === 'undefined') return DEFAULT_CHANNEL_LEDGER;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHANNEL_LEDGER;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CHANNEL_LEDGER,
      ...parsed,
      website: {
        ...DEFAULT_CHANNEL_LEDGER.website,
        ...(parsed.website || {}),
      },
      instagram: {
        ...DEFAULT_CHANNEL_LEDGER.instagram,
        ...(parsed.instagram || {}),
      },
      facebook: {
        ...DEFAULT_CHANNEL_LEDGER.facebook,
        ...(parsed.facebook || {}),
      },
    };
  } catch {
    return DEFAULT_CHANNEL_LEDGER;
  }
}

export function saveChannelLedger(ledger) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
  } catch {
    // ignore storage errors
  }
}

export function recordSiteEvent(eventName, payload = {}) {
  try {
    track(eventName, payload);
  } catch {
    // ignore if blocked by adblocker
  }

  if (typeof window === 'undefined') return;
  try {
    const ledger = loadChannelLedger();
    if (eventName === 'page_view' && payload.path) {
      ledger.website.routes = ledger.website.routes.map((r) =>
        r.path === payload.path ? { ...r, views: (r.views || 0) + 1 } : r
      );
      saveChannelLedger(ledger);
    } else if (eventName === 'share_copied' && payload.path) {
      ledger.website.routes = ledger.website.routes.map((r) =>
        r.path === payload.path ? { ...r, shares: (r.shares || 0) + 1 } : r
      );
      saveChannelLedger(ledger);
    }
  } catch {
    // ignore
  }
}
