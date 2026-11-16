import Issue01 from '../issues/Issue01';
import Issue02Component from '../issues/Issue02';
import Issue03Component from '../issues/Issue03';
import Issue04Component from '../issues/Issue04';

export const dispatches = [
  {
    id: '01',
    slug: 'watering-grass-in-a-thunderstorm',
    aliases: ['watering-grass', 'watering-grass-in-a-thunderstorm'],
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
    aliases: ['meat-grinder', 'the-meat-grinder', 'the-meat-grinder-needs-more-meat'],
    title: 'The Meat Grinder Needs More Meat',
    subtitle:
      'Why billionaires panic about birth rates, why the Venn diagram collapsed, and why the earth is quietly exhausted.',
    date: 'NOV 2026',
    readTime: '5 MIN',
    cover: '/issues/issue-02/hero-machine.webp',
    component: Issue02Component,
  },
  {
    id: '03',
    slug: 'war-on-drugs',
    aliases: [
      'war-on-drugs',
      'the-war-no-one-was-supposed-to-win',
      'issue-03',
    ],
    title: 'The War No One Was Supposed to Win',
    subtitle:
      'Why billionaires microdose in boardrooms while working-class kids rot in cells, and why the state’s deadliest drug sits taxed on the top shelf.',
    date: 'NOV 2026',
    readTime: '8 MIN',
    cover: '/issues/issue-03/hero-dossier.webp',
    component: Issue03Component,
  },
  {
    id: '04',
    slug: 'century-of-self-inflicted-humiliation',
    aliases: [
      'century-of-self-inflicted-humiliation',
      'self-inflicted-humiliation',
      'the-century-of-self-inflicted-humiliation',
      'issue-04',
    ],
    title: 'The Century of Self-Inflicted Humiliation',
    subtitle:
      'How algorithmic feeds became the modern opium trade, hollowing out our attention spans, fracturing society, and engineering a crisis we willingly consume.',
    date: 'NOV 2026',
    readTime: '8 MIN',
    cover: '/issues/issue-04/hero-humen-2am.webp',
    component: Issue04Component,
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
        (Array.isArray(item.aliases) && item.aliases.includes(normalized)) ||
        item.id.toLowerCase() === normalized ||
        `issue-${item.id.toLowerCase()}` === normalized ||
        Number(item.id) === Number(normalized)
    ) || null
  );
}
