/**
 * Shared social telemetry parsers and issue-matching helpers.
 */

export function matchItemToIssueId(item) {
  if (!item) return null;

  // 1. Check explicit issueId property first
  const cleanIssue = String(item.issueId || '').trim();
  if (cleanIssue === '04' || cleanIssue === '4') return '04';
  if (cleanIssue === '03' || cleanIssue === '3') return '03';
  if (cleanIssue === '02' || cleanIssue === '2') return '02';
  if (cleanIssue === '01' || cleanIssue === '1') return '01';

  // 2. Check title / caption / text content (the true semantic indicator)
  const text = `${item.caption || ''} ${item.text || ''} ${item.title || ''} ${item.url || ''}`.toLowerCase();
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags.map((h) => String(h).toLowerCase()).join(' ') : '';
  const haystack = `${text} ${hashtags}`;

  if (
    haystack.includes('the century of self-inflicted humiliation') ||
    haystack.includes('century of self-inflicted humiliation') ||
    haystack.includes('century-of-self-inflicted-humiliation') ||
    haystack.includes('self-inflicted humiliation') ||
    haystack.includes('self-inflicted-humiliation') ||
    haystack.includes('self-inflicted') ||
    haystack.includes('self inflicted') ||
    haystack.includes('humiliation') ||
    haystack.includes('opium') ||
    haystack.includes('humen') ||
    haystack.includes('lin zexu') ||
    haystack.includes('algorithmic feed') ||
    haystack.includes('rage multiplier') ||
    haystack.includes('attention span') ||
    haystack.includes('slot machine') ||
    haystack.includes('doomscroll') ||
    haystack.includes('mirror of history') ||
    haystack.includes('issue-04') ||
    haystack.includes('issue 04') ||
    haystack.includes('issue 4') ||
    haystack.includes('issue #04') ||
    haystack.includes('issue #4')
  ) {
    return '04';
  }

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
    ((haystack.includes('observations') || haystack.includes('moth1')) &&
      (haystack.includes('trial reel') || haystack.includes('trial-reel'))) ||
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
    haystack.includes('watering_grass') ||
    ((haystack.includes('observations') || haystack.includes('moth1')) &&
      (haystack.includes('issue-01') ||
        haystack.includes('issue 01') ||
        haystack.includes('issue #01') ||
        haystack.includes('issue #1') ||
        haystack.includes('issue 1') ||
        haystack.includes('thunderstorm') ||
        haystack.includes('bread and circus') ||
        haystack.includes('geriatric') ||
        haystack.includes('sidequest') ||
        haystack.includes('combine writing')))
  ) {
    return '01';
  }

  // 3. Fallback: check explicit slug strings on custom ID (e.g. "ig-reel-02", "fb-reel-01", "war-on-drugs")
  const idStr = String(item.id || '').toLowerCase();
  if (idStr.includes('century-of-self-inflicted-humiliation') || /issue-?0?4/i.test(idStr) || idStr.includes('reel-04') || idStr.includes('post-04')) return '04';
  if (idStr.includes('war-on-drugs') || /issue-?0?3/i.test(idStr) || idStr.includes('reel-03') || idStr.includes('post-03')) return '03';
  if (idStr.includes('meat-grinder') || /issue-?0?2/i.test(idStr) || idStr.includes('reel-02') || idStr.includes('post-02')) return '02';
  if (idStr.includes('watering-grass') || /issue-?0?1/i.test(idStr) || idStr.includes('reel-01') || idStr.includes('post-01')) return '01';

  // 4. Brand + Publish-date fallback: any #ObservationsByMoth1 post published on/after Nov 16, 2026 belongs to Issue #04
  if (
    haystack.includes('#observationsbymoth1') ||
    haystack.includes('observationsbymoth1') ||
    haystack.includes('observations by moth1') ||
    haystack.includes('observations.moth1.xyz')
  ) {
    const pubMs = item.publishedAt ? new Date(item.publishedAt).getTime() : 0;
    if (pubMs >= Date.UTC(2026, 10, 16)) {
      return '04';
    }
  }

  return null;
}

export function parseMetricNumber(val) {
  if (typeof val === 'number') return Number.isFinite(val) ? Math.max(0, Math.round(val)) : 0;
  if (val === null || val === undefined) return 0;
  const str = String(val).trim().replace(/,/g, '');
  if (!str) return 0;
  const match = str.match(/([\d.]+)\s*([kmb])?/i);
  if (!match) return 0;
  let num = parseFloat(match[1]);
  if (!Number.isFinite(num)) return 0;
  const suffix = (match[2] || '').toLowerCase();
  if (suffix === 'k') num *= 1000;
  else if (suffix === 'm') num *= 1000000;
  else if (suffix === 'b') num *= 1000000000;
  return Math.max(0, Math.round(num));
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
    item.firstComment ||
    item.alt ||
    `Instagram ${item.type || 'Post'} #${idx + 1}`;
  const hashtags = Array.isArray(item.hashtags) ? item.hashtags : [];
  const views = Math.max(
    0,
    Number(
      item.videoPlayCount ??
        item.videoViewCount ??
        item.igPlayCount ??
        item.playCount ??
        item.viewCount ??
        item.viewsCount ??
        item.video_play_count ??
        item.video_view_count ??
        item.play_count ??
        item.views ??
        0
    ) || 0
  );
  const likes = Math.max(
    0,
    Number(item.likesCount ?? item.likeCount ?? item.likes ?? 0) || 0
  );
  const comments = Math.max(
    0,
    Number(item.commentsCount ?? item.commentCount ?? item.comments ?? 0) || 0
  );
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
