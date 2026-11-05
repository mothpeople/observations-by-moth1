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
        views: 0,
        shares: 0,
        avgScrollDepth: 0,
      },
      {
        id: '03',
        path: '/war-on-drugs',
        title: 'Issue #03: The War No One Was Supposed to Win',
        views: 0,
        shares: 0,
        avgScrollDepth: 0,
      },
      {
        id: '02',
        path: '/the-meat-grinder',
        title: 'Issue #02: The Meat Grinder Needs More Meat',
        views: 0,
        shares: 0,
        avgScrollDepth: 0,
      },
      {
        id: '01',
        path: '/watering-grass-in-a-thunderstorm',
        title: 'Issue #01: Watering Grass in a Thunderstorm',
        views: 0,
        shares: 0,
        avgScrollDepth: 0,
      },
    ],
  },
  instagram: {
    handle: '@moth1.siv',
    platform: 'Instagram Reels',
    followers: 0,
    reels: [
      {
        id: 'ig-reel-03',
        issueId: '03',
        title: 'The War No One Was Supposed to Win (9:16 Reel • 45s)',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        avgWatchTimeSec: 0,
        status: 'Ready to Post',
      },
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
        id: 'fb-reel-03',
        issueId: '03',
        title: 'The War No One Was Supposed to Win (9:16 Reel • 45s)',
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        linkClicks: 0,
        status: 'Published',
      },
      {
        id: 'fb-reel-02',
        issueId: '02',
        title: 'The Meat Grinder Needs More Meat (9:16 Reel • 42s)',
        views: 29,
        likes: 0,
        comments: 1,
        shares: 0,
        saves: 0,
        linkClicks: 0,
        status: 'Published',
      },
      {
        id: 'fb-reel-01',
        issueId: '01',
        title: 'Watering Grass in a Thunderstorm (9:16 Reel • 35s)',
        views: 36,
        likes: 0,
        comments: 1,
        shares: 0,
        saves: 0,
        linkClicks: 0,
        status: 'Published',
      },
    ],
  },
  x: {
    handle: 'Moth1NFTs',
    platform: 'X (Twitter)',
    followers: 0,
    posts: [
      {
        id: 'x-post-03',
        issueId: '03',
        title: 'Issue #03: The War No One Was Supposed to Win',
        text: 'The War No One Was Supposed to Win... #ObservationsByMoth1',
        url: 'https://x.com/Moth1NFTs',
        views: 0,
        likes: 0,
        retweets: 0,
        replies: 0,
        isThread: false,
        tweetCount: 1,
        status: 'Published',
      },
      {
        id: 'x-post-02',
        issueId: '02',
        title: 'Issue #02: The Meat Grinder Needs More Meat',
        text: 'The Meat Grinder Needs More Meat... #ObservationsByMoth1',
        url: 'https://x.com/Moth1NFTs',
        views: 0,
        likes: 0,
        retweets: 0,
        replies: 0,
        isThread: true,
        tweetCount: 6,
        status: 'Published',
      },
      {
        id: 'x-post-01',
        issueId: '01',
        title: 'Issue #01: Watering Grass in a Thunderstorm',
        text: 'Watering Grass in a Thunderstorm... #ObservationsByMoth1',
        url: 'https://x.com/Moth1NFTs',
        views: 0,
        likes: 0,
        retweets: 0,
        replies: 0,
        isThread: false,
        tweetCount: 1,
        status: 'Published',
      },
    ],
  },
  youtube: {
    handle: 'sivaraj.pragasm',
    channelUrl: 'https://www.youtube.com/@sivaraj.pragasm',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLXNcetLtk5xU',
    playlistTitle: 'Observations by Moth 1',
    platform: 'YouTube Shorts',
    subscribers: 6,
    totalViews: 1816,
    videos: [
      {
        id: 'yt-shorts-03',
        videoId: 'KXwpmCaOMTE',
        issueId: '03',
        title: 'Issue 03: The War No One Was Supposed to Win',
        views: 2,
        likes: 0,
        comments: 1,
        url: 'https://www.youtube.com/shorts/KXwpmCaOMTE',
        trackingUrl: 'https://observations.moth1.xyz/war-on-drugs?utm_source=youtube&utm_medium=shorts&utm_campaign=issue-03',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLXNcetLtk5xU',
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
        playlistUrl: 'https://www.youtube.com/playlist?list=PLXNcetLtk5xU',
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
        playlistUrl: 'https://www.youtube.com/playlist?list=PLXNcetLtk5xU',
      },
    ],
  },
  pinterest: {
    handle: 'moth1siv',
    profileUrl: 'https://www.pinterest.com/moth1siv',
    platform: 'Pinterest',
    fullName: 'Moth1',
    followers: 0,
    following: 0,
    createdPins: 0,
    savedPins: 4,
    boardsCount: 0,
    pins: [
      {
        id: 'pin-03-01',
        issueId: '03',
        plate: '01_infographic_plate',
        title: 'Fifty Years of Prohibition: $1T Burned, Potency Up +190%, Street Price Down -81%',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/war-on-drugs?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-03&utm_content=50-year-burn',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-03-02',
        issueId: '03',
        plate: '02_thesis_quote_plate',
        title: 'Billionaires Microdose in Boardrooms While Working-Class Kids Rot in Cells',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/war-on-drugs?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-03&utm_content=class-divide-quote',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-03-03',
        issueId: '03',
        plate: '03_interactive_mockup_plate',
        title: 'Portugal Law 30/2000: Health Over Handcuffs and the 80% Overdose Drop',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/war-on-drugs?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-03&utm_content=portugal-model',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-02-01',
        issueId: '02',
        plate: '01_infographic_plate',
        title: 'The Demographic Black Hole: Why Birth Rates Collapsed (0.72 - 0.97 TFR)',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=venn-infographic',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-02-02',
        issueId: '02',
        plate: '02_thesis_quote_plate',
        title: 'Declining Birth Rates Are Society’s Immune Response, Not a Crisis',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=biological-correction-quote',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-02-03',
        issueId: '02',
        plate: '03_interactive_mockup_plate',
        title: 'Three Taboo Solutions to the Global Fertility Crisis',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=taboo-counter-proposals',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-01-01',
        issueId: '01',
        plate: '01_infographic_plate',
        title: 'The Geriatric Disconnect: Median Home Prices vs Youth Wages (11.4x Ratio)',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=geriatric-disconnect',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-01-02',
        issueId: '01',
        plate: '02_thesis_quote_plate',
        title: 'The 4-Stage Protest Loop: Why Civil Unrest Escalates and Nothing Gets Solved',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=protest-loop',
        status: 'Ready to Publish',
      },
      {
        id: 'pin-01-03',
        issueId: '01',
        plate: '03_interactive_mockup_plate',
        title: 'Why People Protest: The Illusion of Governance and Moral Agency',
        views: 0,
        saves: 0,
        linkClicks: 0,
        link: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=thesis-anchor',
        status: 'Ready to Publish',
      },
    ],
  },
  threads: {
    handle: 'moth1.siv',
    platform: 'Threads',
    followers: 0,
  },
  substackSubscribers: 0,
  storyFunnel: {
    defaultImpressions: 0,
    dispatches: [
      {
        id: '03',
        issueId: '03',
        slug: 'war-on-drugs',
        title: 'Issue #03: The War No One Was Supposed to Win',
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
        x: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        youtube: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        pinterest: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        substack: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        email: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
      },
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
        x: {
          entrances: 0, // X Campaigns (utm_source=x & utm_medium=thread/video/teaser)
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        youtube: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        pinterest: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        substack: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        email: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
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
        x: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        youtube: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        pinterest: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        substack: {
          entrances: 0,
          clicks: 0,
          scroll75: 0,
          subscribers: 0,
        },
        email: {
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

      const xEntrances = Number(found.x?.entrances ?? found.x?.clicks) || 0;
      const xScroll75 = Number(found.x?.scroll75) || 0;
      const xSubs = Number(found.x?.subscribers) || 0;

      const ytEntrances = Number(found.youtube?.entrances ?? found.youtube?.clicks) || 0;
      const ytScroll75 = Number(found.youtube?.scroll75) || 0;
      const ytSubs = Number(found.youtube?.subscribers) || 0;

      const pinEntrances = Number(found.pinterest?.entrances ?? found.pinterest?.clicks) || 0;
      const pinScroll75 = Number(found.pinterest?.scroll75) || 0;
      const pinSubs = Number(found.pinterest?.subscribers) || 0;

      const subEntrances = Number(found.substack?.entrances ?? found.substack?.clicks) || 0;
      const subScroll75 = Number(found.substack?.scroll75) || 0;
      const subSubs = Number(found.substack?.subscribers) || 0;

      const mailEntrances = Number(found.email?.entrances ?? found.email?.clicks) || 0;
      const mailScroll75 = Number(found.email?.scroll75) || 0;
      const mailSubs = Number(found.email?.subscribers) || 0;

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
        x: {
          entrances: xEntrances,
          clicks: xEntrances,
          scroll75: xScroll75,
          subscribers: xSubs,
        },
        youtube: {
          entrances: ytEntrances,
          clicks: ytEntrances,
          scroll75: ytScroll75,
          subscribers: ytSubs,
        },
        pinterest: {
          entrances: pinEntrances,
          clicks: pinEntrances,
          scroll75: pinScroll75,
          subscribers: pinSubs,
        },
        substack: {
          entrances: subEntrances,
          clicks: subEntrances,
          scroll75: subScroll75,
          subscribers: subSubs,
        },
        email: {
          entrances: mailEntrances,
          clicks: mailEntrances,
          scroll75: mailScroll75,
          subscribers: mailSubs,
        },
      };
    });

    const mergedRoutes = DEFAULT_CHANNEL_LEDGER.website.routes.map((defRoute) => {
      const found = (parsed.website?.routes || []).find(
        (r) => r.id === defRoute.id || r.path === defRoute.path
      );
      return found ? { ...defRoute, ...found } : defRoute;
    });

    const igReels = DEFAULT_CHANNEL_LEDGER.instagram.reels.map((defReel) => {
      const found = (parsed.instagram?.reels || []).find(
        (r) => r.id === defReel.id || r.issueId === defReel.issueId
      );
      const base = found ? { ...defReel, ...found } : defReel;
      if (Number(base.views) === 35683) {
        base.views = 0;
        base.likes = 0;
        base.comments = 0;
      }
      const cleanIssue = String(base.issueId || '01').padStart(2, '0');
      const savedKey = `saves_ig_issue_${cleanIssue}`;
      const savedVal = typeof window !== 'undefined' ? window.localStorage.getItem(savedKey) : null;
      return {
        ...base,
        saves: savedVal !== null ? (Number(savedVal) || 0) : (Number(base.saves) || 0),
      };
    });

    const fbReels = DEFAULT_CHANNEL_LEDGER.facebook.reels.map((defReel) => {
      const found = (parsed.facebook?.reels || []).find(
        (r) => r.id === defReel.id || r.issueId === defReel.issueId
      );
      const base = found ? { ...defReel, ...found } : defReel;
      const cleanIssue = String(base.issueId || '01').padStart(2, '0');
      const savedKey = `saves_fb_issue_${cleanIssue}`;
      const savedVal = typeof window !== 'undefined' ? window.localStorage.getItem(savedKey) : null;
      return {
        ...base,
        views: Math.max(Number(defReel.views) || 0, Number(found?.views) || 0),
        likes: Math.max(Number(defReel.likes) || 0, Number(found?.likes) || 0),
        comments: Math.max(Number(defReel.comments) || 0, Number(found?.comments) || 0),
        shares: Math.max(Number(defReel.shares) || 0, Number(found?.shares) || 0),
        saves: savedVal !== null ? (Number(savedVal) || 0) : (Number(base.saves) || 0),
      };
    });

    return {
      ...DEFAULT_CHANNEL_LEDGER,
      ...parsed,
      website: {
        ...DEFAULT_CHANNEL_LEDGER.website,
        ...(parsed.website || {}),
        routes: mergedRoutes,
      },
      instagram: {
        ...DEFAULT_CHANNEL_LEDGER.instagram,
        ...(parsed.instagram || {}),
        reels: igReels,
      },
      facebook: {
        ...DEFAULT_CHANNEL_LEDGER.facebook,
        ...(parsed.facebook || {}),
        reels: fbReels,
      },
      x: {
        ...DEFAULT_CHANNEL_LEDGER.x,
        ...(parsed.x || {}),
        // Cleanse corrupted foreign 536 count from historical Apify run
        followers: Number(parsed.x?.followers) === 536 ? 0 : (Number(parsed.x?.followers) || 0),
        posts: DEFAULT_CHANNEL_LEDGER.x.posts.map((defP) => {
          const found = (parsed.x?.posts || []).find((p) => p.id === defP.id || p.issueId === defP.issueId);
          if (!found) return defP;
          return {
            ...defP,
            ...found,
            views: Math.max(Number(defP.views) || 0, Number(found.views) || 0),
            likes: Math.max(Number(defP.likes) || 0, Number(found.likes) || 0),
            retweets: Math.max(Number(defP.retweets) || 0, Number(found.retweets) || 0),
            replies: Math.max(Number(defP.replies) || 0, Number(found.replies) || 0),
            isThread: found.isThread ?? defP.isThread,
            tweetCount: found.tweetCount || defP.tweetCount,
          };
        }),
      },
      youtube: {
        ...DEFAULT_CHANNEL_LEDGER.youtube,
        ...(parsed.youtube || {}),
        handle: 'sivaraj.pragasm',
        channelUrl: 'https://www.youtube.com/@sivaraj.pragasm',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLXNcetLtk5xU',
        subscribers: Math.max(Number(DEFAULT_CHANNEL_LEDGER.youtube.subscribers) || 0, Number(parsed.youtube?.subscribers) || 0),
        totalViews: Math.max(Number(DEFAULT_CHANNEL_LEDGER.youtube.totalViews) || 0, Number(parsed.youtube?.totalViews) || 0),
        videos: DEFAULT_CHANNEL_LEDGER.youtube.videos.map((defV) => {
          const found = (parsed.youtube?.videos || []).find((v) => (v.videoId && v.videoId === defV.videoId) || v.issueId === defV.issueId);
          if (!found) return defV;
          let views = Number(found.views) || 0;
          // Cleanse corrupted historical value where issue 03 erroneously took issue 02's views (>=120)
          if (defV.issueId === '03' && views >= 120) {
            views = Number(defV.views) || 2;
          }
          return {
            ...defV,
            ...found,
            views: Math.max(Number(defV.views) || 0, views),
            likes: Math.max(Number(defV.likes) || 0, Number(found.likes) || 0),
            comments: Math.max(Number(defV.comments) || 0, Number(found.comments) || 0),
          };
        }),
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

    // Determine platform key: 'x' for twitter/x, 'facebook' for fb, else 'instagram'
    let platformKey = 'instagram';
    if (utmSource.includes('facebook') || utmSource === 'fb') {
      platformKey = 'facebook';
    } else if (
      utmSource.includes('twitter') ||
      utmSource.includes('x') ||
      utmSource === 't.co' ||
      utmSource === 'x.com'
    ) {
      platformKey = 'x';
    }

    const isCampaignSession =
      ['story', 'thread', 'video', 'teaser'].includes(utmMedium) ||
      ['instagram', 'facebook', 'x', 'twitter', 'ig', 'fb'].includes(utmSource);

    if (isCampaignSession) {
      try {
        window.sessionStorage.setItem('moth1_utm_medium', utmMedium || 'campaign');
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

      // 2. If visitor arrived via Campaign link, increment automated entrances
      if (isCampaignSession) {
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
      let isStoryOrigin = ['story', 'thread', 'video', 'teaser', 'community', 'shorts', 'short', 'post', 'profile', 'bio'].includes((utmMedium || '').toLowerCase());
      let originSource = platformKey;
      if (typeof window !== 'undefined') {
        try {
          if (!isStoryOrigin) {
            const m = (window.sessionStorage.getItem('moth1_utm_medium') || '').toLowerCase();
            isStoryOrigin = ['story', 'thread', 'video', 'teaser', 'community', 'shorts', 'short', 'post', 'profile', 'bio'].includes(m);
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
          let targetKey = 'instagram';
          const s = (originSource || '').toLowerCase();
          if (s.includes('facebook') || s === 'fb') targetKey = 'facebook';
          else if (s.includes('twitter') || s.includes('x') || s === 't.co') targetKey = 'x';
          else if (s.includes('youtube') || s.includes('youtu.be') || s === 'yt') targetKey = 'youtube';
          else if (s.includes('threads')) targetKey = 'threads';

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
      let isStoryOrigin = ['story', 'thread', 'video', 'teaser', 'community', 'shorts', 'short', 'post', 'profile', 'bio'].includes((utmMedium || '').toLowerCase());
      let subscriberSource = platformKey;
      if (typeof window !== 'undefined') {
        try {
          if (!isStoryOrigin) {
            const m = (window.sessionStorage.getItem('moth1_utm_medium') || '').toLowerCase();
            isStoryOrigin = ['story', 'thread', 'video', 'teaser', 'community', 'shorts', 'short', 'post', 'profile', 'bio'].includes(m);
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
          let targetKey = 'instagram';
          const s = (subscriberSource || '').toLowerCase();
          if (s.includes('facebook') || s === 'fb') targetKey = 'facebook';
          else if (s.includes('twitter') || s.includes('x') || s === 't.co') targetKey = 'x';
          else if (s.includes('youtube') || s.includes('youtu.be') || s === 'yt') targetKey = 'youtube';
          else if (s.includes('threads')) targetKey = 'threads';

          if (!matchedDispatch[targetKey]) {
            matchedDispatch[targetKey] = { entrances: 1, clicks: 1, scroll75: 0, subscribers: 0 };
          }
          matchedDispatch[targetKey].subscribers = (matchedDispatch[targetKey].subscribers || 0) + 1;
        }

        try {
          track('story_subscriber_conversion', {
            path: payload.path,
            issueId: payload.issueId,
            utm_medium: utmMedium || 'campaign',
            utm_source: subscriberSource,
          });

          // Post to serverless UTM tracking endpoint
          fetch('/api/track-story-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              issue: matchedDispatch?.slug || 'the-meat-grinder',
              source: subscriberSource,
              medium: utmMedium || 'campaign',
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
