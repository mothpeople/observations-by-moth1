import React from 'react';
import issueData from '../data/issueData.json';
import HeroSection from '../components/HeroSection';
import StickySplitSection from '../components/StickySplitSection';
import HorizontalScrollSection from '../components/HorizontalScrollSection';
import DataComparisonSection from '../components/DataComparisonSection';
import ConclusionSection from '../components/ConclusionSection';

export default function Issue01() {
  return (
    <div className="relative">
      {/* Floating Graphic Novel Act Index (Desktop) */}
      <nav
        aria-label="Graphic Novel Acts"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 p-2.5 ink-panel border border-neutral-800 bg-[#0e1014]/90 backdrop-blur-md"
      >
        {[
          { href: '#hero', label: 'Watering Grass in a Thunderstorm' },
          { href: '#fracture', label: 'The Geriatric Disconnect' },
          { href: '#protest-cycle', label: 'The Protest Loop' },
          { href: '#budget-imbalance', label: 'The Misplaced Priorities' },
          { href: '#conclusion', label: 'Conclusion' },
        ].map((chapter) => (
          <a
            key={chapter.href}
            href={chapter.href}
            title={chapter.label}
            aria-label={chapter.label}
            className="group relative flex items-center justify-center w-3 h-3 rotate-45 border border-neutral-600 bg-[#08090a] hover:bg-[#dc2626] hover:border-[#e6e4dd] transition-colors"
          >
            <span className="-rotate-45 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-7 whitespace-nowrap px-2.5 py-1 border border-neutral-800 bg-[#08090a] font-mono text-[10px] uppercase tracking-widest text-[#e6e4dd]">
              {chapter.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Issue #01 Scrollytelling Flow */}
      <HeroSection data={issueData.hero} meta={issueData.meta} />
      <StickySplitSection data={issueData.stickySplit} />
      <HorizontalScrollSection data={issueData.protestCycle} />
      <DataComparisonSection data={issueData.dataComparison} />
      <ConclusionSection data={issueData.conclusion} meta={issueData.meta} />
    </div>
  );
}
