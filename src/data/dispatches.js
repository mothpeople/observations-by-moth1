import Issue01 from '../issues/Issue01';
import Issue02Component from '../issues/Issue02';

export const dispatches = [
  {
    id: '01',
    slug: 'watering-grass-in-a-thunderstorm',
    title: 'Watering Grass in a Thunderstorm',
    subtitle:
      'Why protests keep exploding, why geriatrics keep lecturing, and why nothing gets solved.',
    date: 'OCT 2026',
    readTime: '5 MIN',
    cover: '/issues/issue-01/hero-storm.webp',
    component: Issue01,
  },
  {
    id: '02',
    slug: 'the-meat-grinder',
    title: 'The Meat Grinder Needs More Meat',
    subtitle:
      'Why billionaires panic about birth rates, why the Venn diagram collapsed, and why the earth is quietly exhausted.',
    date: 'NOV 2026',
    readTime: '5 MIN',
    cover: '/issues/issue-02/hero-machine.webp',
    component: Issue02Component,
  },
];

export function getLatestDispatch() {
  return dispatches[dispatches.length - 1];
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
