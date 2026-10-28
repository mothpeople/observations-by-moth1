import Issue01 from '../issues/Issue01';

export const dispatches = [
  {
    id: '01',
    slug: 'watering-grass-in-a-thunderstorm',
    title: 'Watering Grass in a Thunderstorm',
    subtitle:
      'Why protests keep exploding, why geriatrics keep lecturing, and why nothing gets solved.',
    date: 'OCT 2026',
    cover: '/issues/issue-01/hero-storm.webp',
    component: Issue01,
  },
];

export function getLatestDispatch() {
  return dispatches[0];
}

export function findDispatchByParam(param) {
  if (!param) return null;
  const normalized = String(param).trim().toLowerCase();
  return (
    dispatches.find(
      (item) =>
        item.slug.toLowerCase() === normalized ||
        item.id.toLowerCase() === normalized ||
        `issue-${item.id.toLowerCase()}` === normalized ||
        Number(item.id) === Number(normalized)
    ) || null
  );
}
