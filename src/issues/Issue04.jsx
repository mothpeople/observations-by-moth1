import React from 'react';
import issue04Data from '../data/issue04Data.json';
import HeroHumiliationSection from '../components/issue04/HeroHumiliationSection';
import SilverAndAttentionSection from '../components/issue04/SilverAndAttentionSection';
import MathOfDivisionSection from '../components/issue04/MathOfDivisionSection';
import ForgottenCasualtiesSection from '../components/issue04/ForgottenCasualtiesSection';
import DealersSupplySection from '../components/issue04/DealersSupplySection';
import StateComplicitySection from '../components/issue04/StateComplicitySection';
import MultifoldAntidoteSection from '../components/issue04/MultifoldAntidoteSection';
import MirrorHistoryConclusionSection from '../components/issue04/MirrorHistoryConclusionSection';
import BeatTransitionPortal from '../components/issue04/BeatTransitionPortal';

export default function Issue04() {
  return (
    <div className="relative bg-[#090a0f] text-[#e2e8f0]">
      {/* Floating Rounded Pill Chapter Navigation (Desktop) */}
      <nav
        aria-label="Issue 04 Sections"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 p-2.5 rounded-full border border-neutral-800 bg-[#090a0f]/90 backdrop-blur-md shadow-2xl"
      >
        {[
          { href: '#humen-2am', label: 'Humen Beach, 1839 vs. Your Bed at 2:00 AM' },
          { href: '#silver-and-attention', label: 'The Silver Deficit & The Attention Ledger' },
          { href: '#math-of-division', label: 'The Math of Division (Selling Rage at 5x)' },
          { href: '#forgotten-casualties', label: 'The Forgotten Casualties' },
          { href: '#dealers-supply', label: 'Dealers Don’t Smoke Their Own Supply' },
          { href: '#state-complicity', label: 'The State’s Quiet Complicity' },
          { href: '#multifold-antidote', label: 'The Multifold Antidote' },
          { href: '#mirror-of-history', label: 'The Mirror of History' },
        ].map((chapter) => (
          <a
            key={chapter.href}
            href={chapter.href}
            title={chapter.label}
            aria-label={chapter.label}
            className="group relative flex items-center justify-center w-3 h-3 rounded-full border border-neutral-600 bg-[#0e1015] hover:bg-[#eab308] hover:border-[#eab308] transition-colors"
          >
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-7 whitespace-nowrap px-3 py-1 rounded-full border border-neutral-800 bg-[#090a0f] font-mono text-[10px] uppercase tracking-widest text-[#e2e8f0]">
              {chapter.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Beat 1: Humen Beach, 1839 vs. Your Bed at 2:00 AM */}
      <HeroHumiliationSection data={issue04Data} />

      {/* Full-Screen Animated Portal Transition: 2:00 AM Optic Nerve -> 1839 Canton Silver Ledger */}
      <BeatTransitionPortal
        fromImage="/issues/issue-04/bedroom-optic-nerve.webp"
        toImage="/issues/issue-04/canton-silver-ledger.webp"
        eyebrow="From Silver Ingots to Human Waking Hours"
        headline="The Silver Deficit & The Attention Ledger"
        accent="#eab308"
      />

      {/* Beat 2: The Silver Deficit & The Attention Ledger */}
      <SilverAndAttentionSection data={issue04Data.silverAndAttention} />

      {/* Full-Screen Animated Portal Transition: Attention Slot Machine -> 5x Outrage Engine */}
      <BeatTransitionPortal
        fromImage="/issues/issue-04/attention-slot-machine.webp"
        toImage="/issues/issue-04/neurobiology-flaw.webp"
        eyebrow="Why Contentment Closes the App"
        headline="The Math of Division: Selling Rage at 5x"
        accent="#ef4444"
      />

      {/* Beat 3: The Math of Division (with Social Media App Mockup) */}
      <MathOfDivisionSection data={issue04Data.mathOfDivision} />

      {/* Full-Screen Animated Portal Transition: Divided Forum -> Silent Apartments */}
      <BeatTransitionPortal
        fromImage="/issues/issue-04/quarterly-rage-earnings.webp"
        toImage="/issues/issue-04/forgotten-elders.webp"
        eyebrow="Silent Apartments & The 65+ Algorithm Trap"
        headline="The Forgotten Casualties"
        accent="#eab308"
      />

      {/* Beat 4: The Forgotten Casualties (Stepped Horizontal Scroll Gallery) */}
      <ForgottenCasualtiesSection data={issue04Data.forgottenCasualties} />

      {/* Full-Screen Animated Portal Transition: Senior Isolation -> Palo Alto Screen Ban */}
      <BeatTransitionPortal
        fromImage="/issues/issue-04/senior-conspiracy-loop.webp"
        toImage="/issues/issue-04/palo-alto-woodblock.webp"
        eyebrow="Palo Alto Chalkboards vs. Working-Class Feeds"
        headline="Dealers Don’t Smoke Their Own Supply"
        accent="#22c55e"
      />

      {/* Beat 5: Dealers Don't Smoke Their Own Supply */}
      <DealersSupplySection data={issue04Data.dealersSupply} />

      {/* Full-Screen Animated Portal Transition: Class Asymmetry -> Customs & Capitol Complicity */}
      <BeatTransitionPortal
        fromImage="/issues/issue-04/working-class-subway.webp"
        toImage="/issues/issue-04/state-complicity-customs.webp"
        eyebrow="1830 Port Mandarins & Modern Parliaments"
        headline="The State’s Quiet Complicity"
        accent="#eab308"
      />

      {/* Beat 6: The State's Quiet Complicity */}
      <StateComplicitySection data={issue04Data.stateComplicity} />

      {/* Full-Screen Animated Portal Transition: Surveillance State -> Cryptographic Shield & Third Places */}
      <BeatTransitionPortal
        fromImage="/issues/issue-04/state-complicity-customs.webp"
        toImage="/issues/issue-04/zk-kyc-shield.webp"
        eyebrow="Four Structural Interventions Beyond Willpower"
        headline="The Multifold Antidote"
        accent="#22c55e"
      />

      {/* Beat 7: The Multifold Antidote (Horizontal 4-Front Carousel + Reformed Social App Mockup) */}
      <MultifoldAntidoteSection data={issue04Data.multifoldAntidote} />

      {/* Beat 8: The Mirror of History Finale */}
      <MirrorHistoryConclusionSection
        data={issue04Data.conclusion}
        sources={issue04Data.sources}
      />
    </div>
  );
}
