import React from 'react';
import issue03Data from '../data/issue03Data.json';
import HeroPhantomSection from '../components/issue03/HeroPhantomSection';
import OligarchPharmacySection from '../components/issue03/OligarchPharmacySection';
import AlcoholParadoxSection from '../components/issue03/AlcoholParadoxSection';
import RatParkSection from '../components/issue03/RatParkSection';
import SupplyDelusionSection from '../components/issue03/SupplyDelusionSection';
import RemedyWeaponSection from '../components/issue03/RemedyWeaponSection';
import PortugalDossierSection from '../components/issue03/PortugalDossierSection';
import MirrorConclusionSection from '../components/issue03/MirrorConclusionSection';

export default function Issue03() {
  return (
    <div className="relative bg-[#0a0b0e] text-[#e2e8f0]">
      {/* Floating Surveillance Chapter Index (Desktop) */}
      <nav
        aria-label="Issue 03 Sections"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 p-2.5 border border-slate-800 bg-[#0a0b0e]/90 backdrop-blur-md"
      >
        {[
          { href: '#phantom', label: 'The Trillion-Dollar Phantom' },
          { href: '#class-divide', label: 'The Oligarch’s Pharmacy' },
          { href: '#alcohol-paradox', label: 'The Alcohol Paradox' },
          { href: '#rat-park', label: 'The Rat Park Reality' },
          { href: '#supply-delusion', label: 'The Hydrant Problem' },
          { href: '#remedy-weapon', label: 'When the Sentence Causes the Harm' },
          { href: '#portugal-blueprint', label: 'Law 30/2000 & The Portuguese Framework' },
          { href: '#the-mirror', label: 'Who Was Really Winning All Along?' },
        ].map((chapter) => (
          <a
            key={chapter.href}
            href={chapter.href}
            title={chapter.label}
            aria-label={chapter.label}
            className="group relative flex items-center justify-center w-3 h-3 border border-slate-600 bg-[#0e1015] hover:bg-[#eab308] hover:border-[#eab308] transition-colors"
          >
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-7 whitespace-nowrap px-2.5 py-1 border border-slate-800 bg-[#0a0b0e] font-mono text-[10px] uppercase tracking-widest text-[#e2e8f0]">
              {chapter.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Issue #03 8-Beat Scrollytelling Flow */}
      <HeroPhantomSection data={issue03Data} />
      <OligarchPharmacySection data={issue03Data.oligarchPharmacy} />
      <AlcoholParadoxSection data={issue03Data.alcoholParadox} />
      <RatParkSection data={issue03Data.ratPark} />
      <SupplyDelusionSection data={issue03Data.supplyDelusion} />
      <RemedyWeaponSection data={issue03Data.remedyWeapon} />
      <PortugalDossierSection data={issue03Data.portugalBlueprint} />
      <MirrorConclusionSection
        data={issue03Data.conclusion}
        sources={issue03Data.sources}
      />
    </div>
  );
}
