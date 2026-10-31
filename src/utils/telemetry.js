import { track } from '@vercel/analytics/react';

const STORAGE_KEY = 'moth1_analytics_ledger_v2';
const LEGACY_STORAGE_KEY = 'moth1_analytics_ledger_v1';

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
    handle: 'observationsbymoth1',
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
  storyFunnel: {
    defaultImpressions: 0,
    dispatches: [
      {
        id: '02',
        issueId: '02',
        slug: 'the-meat-grinder',
        title: 'Issue #02: The Meat Grinder Needs More Meat',
        instagram: {
          entrances: 0, // Story Entrances (utm_source=instagram & utm_medium=story)
          clicks: 0,
          scroll75: 0, // Story Scroll Retention (read past 75%)
          subscribers: 0, // Story Subscriber Conversions
        },
        facebook: {
          entrances: 0, // Story Entrances (utm_source=facebook & utm_medium=story)
          clicks: 0,
          scroll75: 0, // Story Scroll Retention (read past 75%)
          subscribers: 0, // Story Subscriber Conversions
        },
      },
      {
        id: '01',
        issueId: '01',
        slug: 'watering-grass-in-a-thunderstorm',
        title: 'Issue #01: Watering Grass in a Thunderstorm',
        instagram: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        facebook: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
      },
    ],
  },
};

export function loadChannelLedger() {
  if (typeof window === 'undefined') return DEFAULT_CHANNEL_LEDGER;
  try {
    let raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return DEFAULT_CHANNEL_LEDGER;
    const parsed = JSON.parse(raw);

    const mergedDispatches = DEFAULT_CHANNEL_LEDGER.storyFunnel.dispatches.map((def) => {
      const found = (parsed.storyFunnel?.dispatches || []).find(
        (d) => d.id === def.id || d.slug === def.slug || d.issueId === def.issueId
      );
      if (!found) return def;

      const legacyClicks = Number(found.storyClicks) || 0;
      const legacySubs = Number(found.storySubscribers) || 0;

      const igEntrances = Number(found.instagram?.entrances ?? found.instagram?.clicks ?? legacyClicks) || 0;
      const igScroll75 = Number(found.instagram?.scroll75) || 0;
      const igSubs = Number(found.instagram?.subscribers ?? legacySubs) || 0;

      const fbEntrances = Number(found.facebook?.entrances ?? found.facebook?.clicks) || 0;
      const fbScroll75 = Number(found.facebook?.scroll75) || 0;
      const fbSubs = Number(found.facebook?.subscribers) || 0;

      return {
        ...def,
        ...found,
        instagram: {
          entrances: igEntrances,
          clicks: igEntrances,
          scroll75: igScroll75,
          subscribers: igSubs,
        },
        facebook: {
          entrances: fbEntrances,
          clicks: fbEntrances,
          scroll75: fbScroll75,
          subscribers: fbSubs,
        },
      };
    });

    return {
      ...DEFAULT_CHANNEL_LEDGER,
      ...parsed,
      website: {
        ...DEFAULT_CHANNEL_LEDGER.website,
        ...(parsed.website || {}),
        routes: parsed.website?.routes || DEFAULT_CHANNEL_LEDGER.website.routes,
      },
      instagram: {
        ...DEFAULT_CHANNEL_LEDGER.instagram,
        ...(parsed.instagram || {}),
      },
      facebook: {
        ...DEFAULT_CHANNEL_LEDGER.facebook,
        ...(parsed.facebook || {}),
      },
      storyFunnel: {
        ...DEFAULT_CHANNEL_LEDGER.storyFunnel,
        ...(parsed.storyFunnel || {}),
        dispatches: mergedDispatches,
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

    // Check UTM medium and source from payload or current window location query params
    let utmMedium = (payload.utm_medium || '').toLowerCase();
    let utmSource = (payload.utm_source || '').toLowerCase();
    if (typeof window !== 'undefined' && window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        if (!utmMedium) utmMedium = (params.get('utm_medium') || '').toLowerCase();
        if (!utmSource) utmSource = (params.get('utm_source') || '').toLowerCase();
      } catch {
        // ignore
      }
    }

    // Determine platform key: 'facebook' for facebook/fb, else 'instagram'
    const platformKey =
      utmSource.includes('facebook') || utmSource === 'fb' ? 'facebook' : 'instagram';

    const isStorySession =
      utmMedium === 'story' ||
      utmSource.includes('instagram') ||
      utmSource.includes('facebook') ||
      utmSource === 'ig' ||
      utmSource === 'fb';

    if (isStorySession) {
      try {
        window.sessionStorage.setItem('moth1_utm_medium', 'story');
        window.sessionStorage.setItem('moth1_utm_source', platformKey);
        if (payload.path) {
          window.sessionStorage.setItem('moth1_story_path', payload.path);
        }
      } catch {
        // ignore
      }
    }

    if (eventName === 'page_view' && payload.path) {
      // 1. Update general route views
      ledger.website.routes = ledger.website.routes.map((r) =>
        r.path === payload.path ? { ...r, views: (r.views || 0) + 1 } : r
      );

      // 2. If visitor arrived via Story link (utm_medium = 'story' or utm_source is ig/fb), increment automated story entrances
      if (isStorySession) {
        const matchedDispatch =
          ledger.storyFunnel.dispatches.find(
            (d) =>
              d.slug &&
              (payload.path.includes(d.slug) ||
                d.slug.includes(payload.path.replace(/^\//, '')) ||
                d.issueId === payload.issueId)
          ) || ledger.storyFunnel.dispatches[0];

        if (matchedDispatch) {
          if (!matchedDispatch[platformKey]) {
            matchedDispatch[platformKey] = { entrances: 0, clicks: 0, scroll75: 0, subscribers: 0 };
          }
          const nextEntrances = (matchedDispatch[platformKey].entrances || matchedDispatch[platformKey].clicks || 0) + 1;
          matchedDispatch[platformKey].entrances = nextEntrances;
          matchedDispatch[platformKey].clicks = nextEntrances;
        }

        try {
          track('story_link_click', {
            path: payload.path,
            issueId: payload.issueId,
            utm_medium: 'story',
            utm_source: platformKey,
          });
        } catch {
          // ignore
        }
      }

      saveChannelLedger(ledger);
    } else if (eventName === 'scroll_depth' && payload.depth >= 75) {
      // 3. Automated Scroll Retention (75%+ threshold reached)
      let isStoryOrigin = utmMedium === 'story';
      let originSource = platformKey;
      if (typeof window !== 'undefined') {
        try {
          if (!isStoryOrigin) {
            isStoryOrigin = window.sessionStorage.getItem('moth1_utm_medium') === 'story';
          }
          const storedSource = window.sessionStorage.getItem('moth1_utm_source');
          if (storedSource) originSource = storedSource;
        } catch {
          // ignore
        }
      }

      if (isStoryOrigin) {
        const path =
          payload.path ||
          (typeof window !== 'undefined' ? window.sessionStorage.getItem('moth1_story_path') : '') ||
          '';
        const matchedDispatch =
          ledger.storyFunnel.dispatches.find(
            (d) =>
              d.slug &&
              (path.includes(d.slug) ||
                d.slug.includes(path.replace(/^\//, '')) ||
                d.issueId === payload.issueId)
          ) || ledger.storyFunnel.dispatches[0];

        if (matchedDispatch) {
          const targetKey = originSource === 'facebook' ? 'facebook' : 'instagram';
          if (!matchedDispatch[targetKey]) {
            matchedDispatch[targetKey] = { entrances: 1, clicks: 1, scroll75: 0, subscribers: 0 };
          }
          matchedDispatch[targetKey].scroll75 = (matchedDispatch[targetKey].scroll75 || 0) + 1;
        }

        try {
          track('story_scroll_75', {
            path: payload.path,
            issueId: payload.issueId,
            utm_medium: 'story',
            utm_source: originSource,
          });
        } catch {
          // ignore
        }

        saveChannelLedger(ledger);
      }
    } else if (eventName === 'share_copied' && payload.path) {
      ledger.website.routes = ledger.website.routes.map((r) =>
        r.path === payload.path ? { ...r, shares: (r.shares || 0) + 1 } : r
      );
      saveChannelLedger(ledger);
    } else if (eventName === 'substack_subscribe') {
      // 4. Actual Substack form submissions originating from story sessions
      let isStoryOrigin = utmMedium === 'story';
      let subscriberSource = platformKey;
      if (typeof window !== 'undefined') {
        try {
          if (!isStoryOrigin) {
            isStoryOrigin = window.sessionStorage.getItem('moth1_utm_medium') === 'story';
          }
          const storedSource = window.sessionStorage.getItem('moth1_utm_source');
          if (storedSource) subscriberSource = storedSource;
        } catch {
          // ignore
        }
      }

      if (isStoryOrigin) {
        const path =
          payload.path ||
          (typeof window !== 'undefined' ? window.sessionStorage.getItem('moth1_story_path') : '') ||
          '';
        const matchedDispatch =
          ledger.storyFunnel.dispatches.find(
            (d) =>
              d.slug &&
              (path.includes(d.slug) ||
                d.slug.includes(path.replace(/^\//, '')) ||
                d.issueId === payload.issueId)
          ) || ledger.storyFunnel.dispatches[0];

        if (matchedDispatch) {
          const targetKey = subscriberSource === 'facebook' ? 'facebook' : 'instagram';
          if (!matchedDispatch[targetKey]) {
            matchedDispatch[targetKey] = { entrances: 1, clicks: 1, scroll75: 0, subscribers: 0 };
          }
          matchedDispatch[targetKey].subscribers = (matchedDispatch[targetKey].subscribers || 0) + 1;
        }

        try {
          track('story_subscriber_conversion', {
            path: payload.path,
            issueId: payload.issueId,
            utm_medium: 'story',
            utm_source: subscriberSource,
          });

          // Post to serverless UTM tracking endpoint
          fetch('/api/track-story-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              issue: matchedDispatch?.slug || 'the-meat-grinder',
              source: subscriberSource,
              medium: 'story',
              eventType: 'subscriber',
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        } catch {
          // ignore
        }

        saveChannelLedger(ledger);
      }
    }
  } catch {
    // ignore
  }
}
