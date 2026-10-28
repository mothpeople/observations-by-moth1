import React from 'react';
import issue02Data from '../data/issue02Data.json';
import HeroMachineSection from '../components/issue02/HeroMachineSection';
import CollapsingVennSection from '../components/issue02/CollapsingVennSection';
import ContradictionsScrollSection from '../components/issue02/ContradictionsScrollSection';
import TerminalSolutions from '../components/issue02/TerminalSolutions';
import QuietEarthConclusion from '../components/issue02/QuietEarthConclusion';

export default function Issue02() {
  return (
    <div className="relative bg-[#0f1115] text-[#e2e8f0]">
      {/* Floating Cyberpunk Chapter Index (Desktop) */}
      <nav
        aria-label="Issue 02 Sections"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 p-2.5 border border-slate-800 bg-[#0f1115]/90 backdrop-blur-md"
      >
        {[
          { href: '#beat-1', label: 'The Meat Grinder Needs More Meat', accent: '#86efac' },
          { href: '#beat-2', label: 'The Collapsing Venn Diagram', accent: '#67e8f9' },
          { href: '#beat-3', label: 'The 4 Contradictions', accent: '#fda4af' },
          { href: '#beat-4', label: 'Taboo Propositions Terminal', accent: '#c084fc' },
          { href: '#beat-5', label: 'Quiet Earth Conclusion', accent: '#86efac' },
        ].map((chapter) => (
          <a
            key={chapter.href}
            href={chapter.href}
            title={chapter.label}
            aria-label={chapter.label}
            className="group relative flex items-center justify-center w-3 h-3 border border-slate-600 bg-[#121316] hover:bg-[#86efac] hover:border-[#86efac] transition-colors"
          >
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-7 whitespace-nowrap px-2.5 py-1 border border-slate-800 bg-[#0f1115] font-mono text-[10px] uppercase tracking-widest text-[#e2e8f0]">
              {chapter.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Issue #02 Scrollytelling Flow */}
      <HeroMachineSection data={issue02Data} />
      <CollapsingVennSection data={issue02Data.vennSection} />
      <ContradictionsScrollSection data={issue02Data.contradictions} />
      <TerminalSolutions data={issue02Data.terminalSolutions} />
      <QuietEarthConclusion
        data={issue02Data.conclusion}
        sources={issue02Data.sources}
      />
    </div>
  );
}
