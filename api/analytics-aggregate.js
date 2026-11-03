import { getStoryClickStore, syncWithKV } from './track-story-click.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let store = getStoryClickStore();
    try {
      const remote = await syncWithKV('get');
      if (remote) store = remote;
    } catch {
      // ignore
    }

    // Filter incoming query parameters for issue or campaign
    const query = req.query || {};
    const filterCampaign = query.utm_campaign || query.campaign;
    const filterSource = query.utm_source || query.source;

    let filteredRecent = store.recent || [];
    if (filterCampaign) {
      filteredRecent = filteredRecent.filter(
        (r) => String(r.campaign || '').toLowerCase() === String(filterCampaign).toLowerCase()
      );
    }
    if (filterSource) {
      filteredRecent = filteredRecent.filter(
        (r) => String(r.source || '').toLowerCase() === String(filterSource).toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      campaignMetrics: {
        total: store.total || {},
        issues: store.issues || {},
        recent: filteredRecent.slice(0, 50),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
