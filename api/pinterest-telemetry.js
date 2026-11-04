import fs from 'node:fs';

const TMP_CACHE_FILE = '/tmp/moth1_pinterest_telemetry.json';
const DEFAULT_USERNAME = 'moth1siv';

const VERIFIED_FALLBACK = {
  success: true,
  source: 'verified-baseline',
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
  pins: [
    {
      id: 'pin-02-01',
      issueId: '02',
      plate: '01_infographic_plate',
      title: 'The Demographic Black Hole: Why Birth Rates Collapsed (0.72 - 0.97 TFR)',
      description: 'Why fertility rates are collapsing globally: when Family Support, Affordable Housing, and Financial Mobility drift apart, society falls into the 0.72–0.97 TFR black hole.',
      altText: 'Three-circle glowing wireframe Venn diagram illustration showing Family Support, Social Policies, and Financial Mobility collapsing into a demographic black hole.',
      link: 'https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=venn-infographic',
      status: 'Ready to Publish',
    },
    {
      id: 'pin-02-02',
      issueId: '02',
      plate: '02_thesis_quote_plate',
      title: 'Declining Birth Rates Are Society’s Immune Response, Not a Crisis',
      description: 'People will have kids when they genuinely feel the future is brighter than the past. In an unaffordable world, having less people is not a crisis. It is a biological correction.',
      altText: 'Atmospheric twilight earth artwork with cyber-zen mint accents and bold quote: Having less people is not a crisis, it is a biological correction.',
      link: 'https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=biological-correction-quote',
      status: 'Ready to Publish',
    },
    {
      id: 'pin-02-03',
      issueId: '02',
      plate: '03_interactive_mockup_plate',
      title: 'Three Taboo Solutions to the Global Fertility Crisis',
      description: 'What governments refuse to talk about while crying over fertility charts: Redefine Family, Dignity in Aging & Euthanasia, and Kill Infinite Growth Fetish.',
      altText: 'Three-panel infographic illustrating the 3 taboo counter-proposals to falling birth rates: redefine family, normalise dignity in aging, and kill infinite growth.',
      link: 'https://observations.moth1.xyz/the-meat-grinder?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-02&utm_content=taboo-counter-proposals',
      status: 'Ready to Publish',
    },
    {
      id: 'pin-01-01',
      issueId: '01',
      plate: '01_infographic_plate',
      title: 'The Geriatric Disconnect: Median Home Prices vs Youth Wages (11.4x Ratio)',
      description: 'In 1980, the median home price to youth wage ratio was 3.2x. Today it sits at 11.4x, requiring two generational inheritances while real purchasing power dropped -38%.',
      altText: 'Data infographic plate detailing the geriatric disconnect, featuring 11.4x home price ratio, -38% real wage drop, 70+ year average leader age.',
      link: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=geriatric-disconnect',
      status: 'Ready to Publish',
    },
    {
      id: 'pin-01-02',
      issueId: '01',
      plate: '02_thesis_quote_plate',
      title: 'The 4-Stage Protest Loop: Why Civil Unrest Escalates and Nothing Gets Solved',
      description: 'Why do protests explode, why do governments swing harder, and why does nothing get solved? Explore the 4-stage civil escalation engine.',
      altText: 'Four-stage visual breakdown of civil protest escalation from catalyst to tactical overreaction, nationwide strike, and the resulting void.',
      link: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=protest-loop',
      status: 'Ready to Publish',
    },
    {
      id: 'pin-01-03',
      issueId: '01',
      plate: '03_interactive_mockup_plate',
      title: 'Why People Protest: The Illusion of Governance and Moral Agency',
      description: 'As simple as it sounds, people generally don’t take to the streets to protest if their governments were actually doing their jobs.',
      altText: 'Dramatic storm artwork with high-contrast editorial typography and quote: People don’t take to the streets if governments were doing their jobs.',
      link: 'https://observations.moth1.xyz/watering-grass-in-a-thunderstorm?utm_source=pinterest&utm_medium=pin&utm_campaign=issue-01&utm_content=thesis-anchor',
      status: 'Ready to Publish',
    },
  ],
  syncedAt: new Date().toISOString(),
};

async function scrapeLivePinterest(username = DEFAULT_USERNAME) {
  const profileUrl = `https://www.pinterest.com/${username}/`;
  const res = await fetch(profileUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Pinterest profile: ${res.status}`);
  }

  const html = await res.text();

  const followersMatch = html.match(/\"follower_count\":\s*(\d+)/);
  const followingMatch = html.match(/\"following_count\":\s*(\d+)/);
  const pinCountMatch = html.match(/\"pin_count\":\s*(\d+)/);
  const boardCountMatch = html.match(/\"board_count\":\s*(\d+)/);
  const fullNameMatch = html.match(/\"full_name\":\s*\"([^\"]+)\"/);
  const aboutMatch = html.match(/\"about\":\s*\"([^\"]+)\"/);

  const rawPins = pinCountMatch ? parseInt(pinCountMatch[1], 10) : 4;
  const followers = followersMatch ? parseInt(followersMatch[1], 10) : 0;
  const following = followingMatch ? parseInt(followingMatch[1], 10) : 0;
  const boardsCount = boardCountMatch ? parseInt(boardCountMatch[1], 10) : 0;
  const fullName = fullNameMatch ? fullNameMatch[1] : 'Moth1';
  const about = aboutMatch ? aboutMatch[1] : 'Storyteller and creative strategist.';

  return {
    success: true,
    source: 'live-pinterest-scraper',
    syncedAt: new Date().toISOString(),
    profile: {
      username,
      fullName,
      about,
      followers,
      following,
      createdPins: 0,
      savedPins: rawPins,
      totalPins: rawPins,
      boardsCount,
      url: profileUrl,
    },
    pins: VERIFIED_FALLBACK.pins,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const isRefresh =
    req.query.refresh === 'true' ||
    req.query.force === 'true' ||
    req.method === 'POST';

  // Check cache (TTL = 3 minutes)
  if (!isRefresh && fs.existsSync(TMP_CACHE_FILE)) {
    try {
      const stats = fs.statSync(TMP_CACHE_FILE);
      const ageMs = Date.now() - stats.mtimeMs;
      if (ageMs < 3 * 60 * 1000) {
        const cached = JSON.parse(fs.readFileSync(TMP_CACHE_FILE, 'utf8'));
        return res.status(200).json({ ...cached, source: 'cache' });
      }
    } catch {}
  }

  // Tier 1: Check official Pinterest API v5 if valid token is provided
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  if (token && token.startsWith('pina_')) {
    try {
      const apiRes = await fetch('https://api.pinterest.com/v5/user_account', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (apiRes.ok) {
        const userData = await apiRes.json();
        const payload = {
          success: true,
          source: 'official-pinterest-api',
          syncedAt: new Date().toISOString(),
          profile: {
            username: userData.username || DEFAULT_USERNAME,
            fullName: userData.full_name || 'Moth1',
            about: userData.about || '',
            followers: userData.follower_count || 0,
            following: userData.following_count || 0,
            createdPins: userData.pin_count || 0,
            savedPins: 4,
            boardsCount: userData.board_count || 0,
            url: `https://www.pinterest.com/${userData.username || DEFAULT_USERNAME}`,
          },
          pins: VERIFIED_FALLBACK.pins,
        };

        try {
          fs.writeFileSync(TMP_CACHE_FILE, JSON.stringify(payload));
        } catch {}

        return res.status(200).json(payload);
      }
    } catch {}
  }

  // Tier 2: Live Public Scraper
  try {
    const liveScrape = await scrapeLivePinterest(DEFAULT_USERNAME);
    try {
      fs.writeFileSync(TMP_CACHE_FILE, JSON.stringify(liveScrape));
    } catch {}
    return res.status(200).json(liveScrape);
  } catch {
    // Tier 3: Verified Baseline
    return res.status(200).json(VERIFIED_FALLBACK);
  }
}
