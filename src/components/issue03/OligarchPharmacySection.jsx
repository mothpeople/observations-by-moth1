import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { getCardEnvelope, clamp, remap } from '../../utils/math';

export default function OligarchPharmacySection({ data }) {
  const [manualSplit, setManualSplit] = useState(null);

  return (
    <PinnedStage id="class-divide" heightMultiplier={3.8}>
      {(progress) => {
        // Strictly monotonic sweep from 88% (Penthouse Boardroom) down to 12% (Working-Class Holding Cell)
        const autoSplit = clamp(remap(progress, 0.05, 0.92, 88, 12), 12, 88);
        const splitPct =
          manualSplit !== null ? manualSplit : Math.round(autoSplit);

        return (
          <div className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            {/* Acid Halftone & Blueprint Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-12"
              style={{
                backgroundImage:
                  'radial-gradient(#eab308 1px, transparent 1px), radial-gradient(#ef4444 1px, #0a0b0e 1px)',
                backgroundSize: '28px 28px',
                backgroundPosition: '0 0, 14px 14px',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-16 pb-2 md:py-6 flex flex-col gap-1.5 sm:gap-4">
              {/* TOP WIDE GRAPHIC-NOVEL SPLIT COMPARATOR: Executive Loft vs. Concrete Interrogation Cell */}
              <div className="relative w-full aspect-[16/9] max-h-[145px] sm:max-h-[295px] border border-slate-800 bg-[#08090c] shadow-[0_24px_60px_rgba(0,0,0,0.92)] overflow-hidden">
                {/* Base Layer (Right Side): Working-Class Concrete Interrogation Cell */}
                <img
                  src={data.cellImage || data.image}
                  alt={data.rightTier.headline}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0a0b0e]/80 via-transparent to-transparent pointer-events-none" />

                {/* Clipped Curtain Layer (Left Side): Sovereign Billionaire Penthouse Boardroom */}
                <div
                  style={{
                    clipPath: `polygon(0 0, ${splitPct}% 0, ${splitPct}% 100%, 0 100%)`,
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <img
                    src={data.loftImage || data.image}
                    alt={data.leftTier.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0e]/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Vertical Acid-Yellow Laser Divider Line */}
                <div
                  style={{ left: `${splitPct}%` }}
                  className="pointer-events-none absolute inset-y-0 -translate-x-1/2 w-[3px] bg-[#eab308] shadow-[0_0_20px_#eab308] z-20 flex items-center justify-center"
                >
                  <div className="px-2 py-0.5 bg-[#0a0b0e] border-2 border-[#eab308] font-mono text-[9px] font-black text-[#eab308] tracking-widest whitespace-nowrap">
                    ◀ {splitPct}% | {100 - splitPct}% ▶
                  </div>
                </div>

                {/* Left Tier Badge Overlay (Clean: No white subtitle line) */}
                <div className="pointer-events-none absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 max-w-[44%]">
                  <span className="inline-block px-2 py-0.5 bg-[#eab308] text-[#0a0b0e] font-mono text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider mb-1">
                    {data.leftTier.badge}
                  </span>
                  <div className="text-xs sm:text-lg font-black text-[#eab308] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {data.leftTier.headline}
                  </div>
                </div>

                {/* Right Tier Badge Overlay (Clean: No white subtitle line) */}
                <div className="pointer-events-none absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 text-right max-w-[44%]">
                  <span className="inline-block px-2 py-0.5 bg-[#ef4444] text-white font-mono text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider mb-1">
                    {data.rightTier.badge}
                  </span>
                  <div className="text-xs sm:text-lg font-black text-[#ef4444] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                    {data.rightTier.headline}
                  </div>
                </div>

                {/* Bottom Interactive Slider Bar inside Comparator */}
                <div className="absolute bottom-0 inset-x-0 z-20 px-3 sm:px-5 py-2 bg-[#0a0b0e]/92 border-t border-slate-800 flex items-center gap-3">
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#eab308] font-bold uppercase shrink-0">
                    Boardroom ({splitPct}%)
                  </span>
                  <input
                    type="range"
                    min="12"
                    max="88"
                    value={splitPct}
                    onChange={(e) => setManualSplit(Number(e.target.value))}
                    aria-label="Slide to compare billionaire boardroom vs working-class holding cell"
                    className="w-full accent-[#eab308] cursor-pointer h-1.5 bg-slate-800"
                  />
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#ef4444] font-bold uppercase shrink-0">
                    Holding Cell ({100 - splitPct}%)
                  </span>
                  {manualSplit !== null && (
                    <button
                      type="button"
                      onClick={() => setManualSplit(null)}
                      className="font-mono text-[9px] text-[#22c55e] underline shrink-0 cursor-pointer"
                    >
                      Auto
                    </button>
                  )}
                </div>
              </div>

              {/* BOTTOM ROW: Sequenced Broadsheet Story Card + Forensic Molecular Asymmetry Strip */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-center">
                {/* Sequenced Broadsheet Cards (Left 7 cols) */}
                <div className="md:col-span-7 grid grid-cols-1 items-start md:items-center">
                  {data.cards.map((card, idx) => {
                    const env = getCardEnvelope(
                      progress,
                      card.start,
                      card.end,
                      idx === 0,
                      idx === data.cards.length - 1
                    );

                    return (
                      <div
                        key={card.id}
                        style={{
                          opacity: env.opacity,
                          transform: `translate3d(0, ${env.y}px, 0)`,
                          pointerEvents: env.opacity > 0.2 ? 'auto' : 'none',
                        }}
                        className="col-start-1 row-start-1 w-full"
                      >
                        <DossierCard
                          variant="broadsheet"
                          label={data.kicker}
                          stamp={card.metric}
                          accent={card.accent}
                        >
                          <h3 className="text-base sm:text-2xl font-extrabold text-[#e2e8f0] mb-2">
                            {card.headline}
                          </h3>
                          <p className="text-xs sm:text-base text-slate-300 leading-relaxed mb-2.5">
                            {card.body}
                          </p>
                          <div className="font-mono text-[9px] sm:text-[10px] text-slate-400">
                            {card.citation}
                          </div>
                        </DossierCard>
                      </div>
                    );
                  })}
                </div>

                {/* Right 5 cols: Compact Molecular Parity Ledger */}
                <div className="md:col-span-5 grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div className="p-2 sm:p-3 bg-[#0c0e13]/95 border-t-2 border-[#eab308] border-x border-b border-slate-800/90 space-y-1">
                    <div className="font-mono text-[8.5px] sm:text-[9px] text-[#eab308] font-extrabold uppercase tracking-wider">
                      Sovereign Capital Tier
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-200 font-semibold leading-snug">
                      {data.leftTier.framing}
                    </div>
                    <div className="pt-1 border-t border-slate-800 font-mono text-[8.5px] sm:text-[10px] text-[#22c55e] font-bold">
                      {data.leftTier.sentence}
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 bg-[#0c0e13]/95 border-t-2 border-[#ef4444] border-x border-b border-slate-800/90 space-y-1">
                    <div className="font-mono text-[8.5px] sm:text-[9px] text-[#ef4444] font-extrabold uppercase tracking-wider">
                      Working-Class Tier
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-200 font-semibold leading-snug">
                      {data.rightTier.framing}
                    </div>
                    <div className="pt-1 border-t border-slate-800 font-mono text-[8.5px] sm:text-[10px] text-[#ef4444] font-bold">
                      {data.rightTier.sentence}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
