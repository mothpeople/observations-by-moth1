import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import CartographyCard from './CartographyCard';
import { getCardEnvelope } from '../../utils/math';

export default function StateComplicitySection({ data }) {
  const [manualActive, setManualActive] = useState(null);

  return (
    <PinnedStage id="state-complicity" heightMultiplier={4.6}>
      {(progress) => {
        // 3 distinct stages (1/3 -> 2/3 -> 3/3), each with its own dedicated image
        const autoCount =
          progress < 0.34 ? 1 : progress < 0.67 ? 2 : 3;
        const revealedCount =
          manualActive !== null ? manualActive : autoCount;

        const stageImages = [
          data.image,
          data.secondImage || data.image,
          data.thirdImage || data.image,
        ];
        const stageCaptions = [
          '01 / 03 • VOLUNTARY MASS SURVEILLANCE INFRASTRUCTURE',
          '02 / 03 • ELECTORAL OUTRAGE RADAR & GEOPOLITICAL AI RACE',
          '03 / 03 • 1830 CANTON CUSTOMS: WAVING THE CLIPPERS THROUGH',
        ];
        const activeImgIdx = Math.min(2, Math.max(0, revealedCount - 1));

        return (
          <div className="relative w-full h-full bg-[#090a0f] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            {/* 3-Way Crossfading Full-Bleed Background */}
            {stageImages.map((imgUrl, i) => (
              <div
                key={i}
                className="pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{
                  backgroundImage: `url('${imgUrl}')`,
                  opacity: activeImgIdx === i ? 0.25 : 0,
                }}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(9,10,15,0.48) 0%, rgba(9,10,15,0.92) 85%)',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-16 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start md:items-center">
              {/* LEFT COLUMN: 4 Concise Rounded Story Cards */}
              <div className="md:col-span-5 grid grid-cols-1 items-start md:items-center order-2 md:order-1">
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
                        <h3 className="text-sm sm:text-2xl font-extrabold text-[#e2e8f0] mb-1.5 sm:mb-2.5 leading-snug">
                          {card.headline}
                        </h3>
                        <p className="text-[11px] sm:text-base text-neutral-300 leading-snug sm:leading-relaxed mb-2 sm:mb-3">
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

              {/* RIGHT COLUMN: 3-Image Rounded Artwork Stage & 3 State Utility Pods */}
              <div className="md:col-span-7 order-1 md:order-2">
                <CartographyCard
                  telemetry={`${revealedCount} / 3 STATE UTILITIES DECLASSIFIED`}
                  accent="#eab308"
                >
                  {/* 3-Image Crossfading Rounded Artwork Frame */}
                  <div className="relative w-full aspect-[16/9] max-h-[115px] sm:max-h-[215px] mb-2 sm:mb-3.5 rounded-2xl overflow-hidden border border-neutral-800 bg-[#090a0f]">
                    {stageImages.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt={stageCaptions[i]}
                        style={{ opacity: activeImgIdx === i ? 0.95 : 0 }}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                      />
                    ))}
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#090a0f]/92 border border-[#eab308]/70 font-mono text-[7.5px] sm:text-[10px] font-bold text-[#eab308] uppercase tracking-wider truncate max-w-[92%]">
                      {stageCaptions[activeImgIdx]}
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      {[1, 2, 3].map((stepNum) => (
                        <button
                          key={stepNum}
                          type="button"
                          onClick={() =>
                            setManualActive(
                              manualActive === stepNum ? null : stepNum
                            )
                          }
                          className={`px-2 py-0.5 rounded-full font-mono text-[8px] sm:text-[9px] uppercase cursor-pointer border ${
                            revealedCount === stepNum
                              ? 'bg-[#eab308] text-black border-[#eab308] font-bold'
                              : 'bg-[#090a0f]/90 text-neutral-300 border-neutral-700'
                          }`}
                        >
                          {stepNum}/3
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3 Rounded State Dependency Pods (3 columns on mobile & desktop so they never overflow vertically) */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                    {data.pillars.map((p, idx) => {
                      const isRevealed = idx < revealedCount;
                      return (
                        <div
                          key={p.id}
                          style={{
                            borderColor: isRevealed
                              ? `${p.accent}88`
                              : '#262626',
                          }}
                          className={`p-2 sm:p-3.5 rounded-2xl border transition-all duration-300 bg-[#10131d]/90 ${
                            isRevealed ? 'opacity-100' : 'opacity-45'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-[7.5px] sm:text-[9px] mb-0.5 sm:mb-1">
                            <span
                              style={{ color: p.accent }}
                              className="font-bold uppercase"
                            >
                              {p.code}
                            </span>
                            <span
                              style={{
                                borderColor: `${p.accent}55`,
                                color: p.accent,
                              }}
                              className="hidden sm:inline-block px-2 py-0.2 rounded-full border bg-[#090a0f] font-bold uppercase text-[8px] truncate"
                            >
                              {p.stat}
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-sm font-extrabold text-white mb-0.5 sm:mb-1 leading-tight sm:leading-snug">
                            {p.title}
                          </div>
                          <p className="hidden sm:block text-xs text-neutral-300 leading-snug">
                            {p.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CartographyCard>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
