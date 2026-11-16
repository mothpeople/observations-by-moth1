import React from 'react';
import PinnedStage from '../PinnedStage';
import CartographyCard from './CartographyCard';
import OutrageMultiplier from './OutrageMultiplier';
import { getCardEnvelope } from '../../utils/math';

export default function MathOfDivisionSection({ data }) {
  return (
    <PinnedStage id="math-of-division" heightMultiplier={5.2}>
      {(progress) => {
        // Active card index (0, 1, 2, 3) so each of the 4 points displays its own dedicated artwork
        const activeCardIdx =
          progress < 0.28
            ? 0
            : progress < 0.52
              ? 1
              : progress < 0.76
                ? 2
                : 3;

        return (
          <div className="relative w-full h-full bg-[#090a0f] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            {/* 4-Way Crossfading Full-Bleed Animated Outrage Backdrop */}
            {data.cards.map((c, i) => (
              <div
                key={c.id}
                className="pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{
                  backgroundImage: `url('${c.image || data.image}')`,
                  opacity: activeCardIdx === i ? 0.24 : 0,
                }}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(9,10,15,0.55) 0%, rgba(9,10,15,0.93) 85%)',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-16 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start md:items-center">
              {/* LEFT COLUMN: 4-Way Crossfading Rounded Artwork Frame + 4 Concise Narrative Cards */}
              <div className="md:col-span-5 flex flex-col gap-3 order-2 md:order-1">
                <div className="hidden md:block relative w-full aspect-[16/9] max-h-[180px] rounded-3xl overflow-hidden border border-neutral-700/80 bg-[#090a0f] shadow-[0_18px_45px_rgba(0,0,0,0.88)]">
                  {data.cards.map((c, i) => (
                    <img
                      key={c.id}
                      src={c.image || data.image}
                      alt={c.headline}
                      style={{ opacity: activeCardIdx === i ? 0.94 : 0 }}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    />
                  ))}
                  <div className="absolute bottom-2.5 left-3 px-3 py-0.5 rounded-full bg-[#090a0f]/92 border border-[#ef4444]/60 font-mono text-[9px] text-[#ef4444] uppercase font-bold">
                    {data.cards[activeCardIdx]?.metric}
                  </div>
                </div>

                {/* 4 Concise Narrative Cards */}
                <div className="grid grid-cols-1 items-start md:items-center">
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
                          telemetry={card.metric}
                          accent={card.accent}
                        >
                          <h3 className="text-sm sm:text-xl font-extrabold text-[#e2e8f0] mb-1.5 sm:mb-2 leading-snug">
                            {card.headline}
                          </h3>
                          <p className="text-[11px] sm:text-sm text-neutral-300 leading-snug sm:leading-relaxed mb-2 sm:mb-3">
                            {card.body}
                          </p>
                          <div className="pt-1.5 sm:pt-2 border-t border-neutral-800/80 font-mono text-[8.5px] sm:text-[9.5px] text-neutral-400 leading-tight">
                            {card.citation}
                          </div>
                        </CartographyCard>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: 6-Post Angry Social Feed Mockup (Auto-scrolling with scrollProgress) */}
              <div className="md:col-span-7 order-1 md:order-2">
                <OutrageMultiplier
                  defaultMode="algorithmic"
                  scrollProgress={progress}
                  compact
                />
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
