import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import CartographyCard from './CartographyCard';
import { getCardEnvelope, clamp, remap } from '../../utils/math';

export default function DealersSupplySection({ data }) {
  const [manualSplit, setManualSplit] = useState(null);

  return (
    <PinnedStage id="dealers-supply" heightMultiplier={4.5}>
      {(progress) => {
        // Monotonic sweep from 86% (Palo Alto Screen-Free Classroom) down to 14% (Mass-Market Algorithmic Feed)
        const autoSplit = clamp(remap(progress, 0.05, 0.92, 86, 14), 14, 86);
        const splitPct =
          manualSplit !== null ? manualSplit : Math.round(autoSplit);

        return (
          <div className="relative w-full h-full bg-[#090a0f] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-16 pb-2 md:py-6 flex flex-col gap-2 sm:gap-4">
              {/* TOP WIDE ROUNDED SPLIT COMPARATOR: Palo Alto Screen Ban vs. Working-Class Algorithmic Sedation */}
              <div className="relative w-full aspect-[16/9] max-h-[150px] sm:max-h-[285px] rounded-3xl border border-neutral-700/80 bg-[#090a0f] shadow-[0_24px_60px_rgba(0,0,0,0.92)] overflow-hidden">
                {/* Base Layer (Right Side): Working-Class Algorithmic Sedation */}
                <img
                  src={data.rightImage || data.image}
                  alt={data.rightTier.headline}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#090a0f]/80 via-transparent to-transparent pointer-events-none" />

                {/* Clipped Curtain Layer (Left Side): Palo Alto Screen-Free Classroom */}
                <div
                  style={{
                    clipPath: `polygon(0 0, ${splitPct}% 0, ${splitPct}% 100%, 0 100%)`,
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <img
                    src={data.image}
                    alt={data.leftTier.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f]/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Vertical Amber Laser Divider Line with Rounded Handle Pill */}
                <div
                  style={{ left: `${splitPct}%` }}
                  className="pointer-events-none absolute inset-y-0 -translate-x-1/2 w-[3px] bg-[#eab308] shadow-[0_0_20px_#eab308] z-20 flex items-center justify-center"
                >
                  <div className="px-3 py-1 rounded-full bg-[#090a0f] border-2 border-[#eab308] font-mono text-[9px] font-black text-[#eab308] tracking-widest whitespace-nowrap shadow-xl">
                    ◀ {splitPct}% | {100 - splitPct}% ▶
                  </div>
                </div>

                {/* Left Tier Pill Badge */}
                <div className="pointer-events-none absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#eab308] text-[#090a0f] font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-lg">
                    {data.leftTier.badge}
                  </span>
                </div>

                {/* Right Tier Pill Badge */}
                <div className="pointer-events-none absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#ef4444] text-white font-mono text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-lg">
                    {data.rightTier.badge}
                  </span>
                </div>

                {/* Bottom Interactive Slider Bar */}
                <div className="absolute bottom-0 inset-x-0 z-20 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#090a0f]/92 border-t border-neutral-800 flex items-center gap-3 backdrop-blur-md">
                  <span className="font-mono text-[8.5px] sm:text-[10px] text-[#eab308] font-bold uppercase shrink-0">
                    Palo Alto ({splitPct}%)
                  </span>
                  <input
                    type="range"
                    min="14"
                    max="86"
                    value={splitPct}
                    onChange={(e) => setManualSplit(Number(e.target.value))}
                    aria-label="Slide to compare Palo Alto screen-free schools vs working-class algorithmic feeds"
                    className="w-full accent-[#eab308] cursor-pointer h-1.5 rounded-full bg-neutral-800"
                  />
                  <span className="font-mono text-[8.5px] sm:text-[10px] text-[#ef4444] font-bold uppercase shrink-0">
                    Mass Market ({100 - splitPct}%)
                  </span>
                  {manualSplit !== null && (
                    <button
                      type="button"
                      onClick={() => setManualSplit(null)}
                      className="font-mono text-[8.5px] text-[#22c55e] underline shrink-0 cursor-pointer"
                    >
                      Auto
                    </button>
                  )}
                </div>
              </div>

              {/* BOTTOM ROW: 4 Concise Rounded Story Cards + Rounded Class Asymmetry Pills */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-5 items-center">
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
                        className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                      >
                        <CartographyCard
                          variant="chronicle"
                          telemetry={card.metric}
                          accent={card.accent}
                        >
                          <h3 className="text-sm sm:text-2xl font-extrabold text-[#e2e8f0] mb-1.5 sm:mb-2 leading-snug">
                            {card.headline}
                          </h3>
                          <p className="text-[11px] sm:text-base text-neutral-300 leading-snug sm:leading-relaxed mb-1.5 sm:mb-2.5">
                            {card.body}
                          </p>
                          <div className="font-mono text-[8.5px] sm:text-[10px] text-neutral-400">
                            {card.citation}
                          </div>
                        </CartographyCard>
                      </div>
                    );
                  })}
                </div>

                <div className="md:col-span-5 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-2.5 sm:p-4 rounded-2xl bg-[#0b0d14]/95 border border-[#eab308]/40 space-y-1.5">
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#eab308] font-extrabold uppercase tracking-wider">
                      Silicon Valley Bloodline
                    </div>
                    <div className="text-[9.5px] sm:text-xs text-neutral-200 font-semibold leading-snug">
                      {data.leftTier.framing}
                    </div>
                    <div className="pt-1 border-t border-neutral-800 font-mono text-[8px] sm:text-[10px] text-[#22c55e] font-bold">
                      {data.leftTier.sentence}
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-4 rounded-2xl bg-[#0b0d14]/95 border border-[#ef4444]/40 space-y-1.5">
                    <div className="font-mono text-[8px] sm:text-[9px] text-[#ef4444] font-extrabold uppercase tracking-wider">
                      Global Working Class
                    </div>
                    <div className="text-[9.5px] sm:text-xs text-neutral-200 font-semibold leading-snug">
                      {data.rightTier.framing}
                    </div>
                    <div className="pt-1 border-t border-neutral-800 font-mono text-[8px] sm:text-[10px] text-[#ef4444] font-bold">
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
