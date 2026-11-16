import React from 'react';
import PinnedStage from '../PinnedStage';
import OutrageMultiplier from './OutrageMultiplier';
import { getSteppedSlideIndex, getCardEnvelope, clamp, remap } from '../../utils/math';

/**
 * MultifoldAntidoteSection (Beat 7) — Widescreen Horizontal 4-Card Reform Track + 7-Post Reformed Social App Mockup
 * Stage 1 (0.00 -> 0.64): Widescreen Stepped Horizontal Scroll Carousel across the 4 Structural Interventions (`100vw` per slide).
 * Stage 2 (0.64 -> 1.00): Interactive 7-post <OutrageMultiplier defaultMode="reformed" /> auto-scrolling with scroll progress.
 */
export default function MultifoldAntidoteSection({ data }) {
  const fronts = data.fronts || [];
  const totalFronts = fronts.length;

  return (
    <PinnedStage id="multifold-antidote" heightMultiplier={6.4}>
      {(progress) => {
        const horizProgress = clamp(progress / 0.62, 0, 1);
        const steppedPos = getSteppedSlideIndex(
          horizProgress,
          totalFronts,
          0.62
        );
        const activeFrontIdx = Math.min(
          totalFronts - 1,
          Math.round(steppedPos)
        );

        const stage0Env = getCardEnvelope(
          progress,
          0.0,
          0.64,
          true,
          false,
          0.04
        );
        const stage1Env = getCardEnvelope(
          progress,
          0.64,
          1.0,
          false,
          true,
          0.04
        );

        // Local scroll progress (0 -> 1) inside Stage 2 to auto-scroll the 7-post Reformed Feed
        const stage2FeedProgress = clamp(remap(progress, 0.66, 0.98, 0, 1), 0, 1);

        const activeBgImage =
          progress >= 0.64
            ? '/issues/issue-04/third-places-renewal.webp'
            : fronts[activeFrontIdx]?.image;

        return (
          <div className="relative w-full h-full bg-[#090a0f] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center pt-16 pb-3">
            {/* Full-Bleed Animated Background */}
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: `url('${activeBgImage}')`,
                opacity: 0.25,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(9,10,15,0.45) 0%, rgba(9,10,15,0.92) 85%)',
              }}
            />

            <div className="relative z-10 w-full grid grid-cols-1 items-start md:items-center">
              {/* STAGE 1: Widescreen Horizontal 4-Card Structural Antidote Track */}
              <div
                style={{
                  opacity: stage0Env.opacity,
                  transform: `translate3d(0, ${stage0Env.y}px, 0)`,
                  pointerEvents: stage0Env.opacity > 0.2 ? 'auto' : 'none',
                }}
                className="col-start-1 row-start-1 w-full transition-opacity duration-75"
              >
                {/* Top Intro Bar */}
                <div className="max-w-5xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 mb-2.5 sm:mb-4 pb-2 border-b border-neutral-800/80">
                  <div className="max-w-3xl">
                    <h2 className="text-base sm:text-2xl font-black text-white">
                      {data.title}
                    </h2>
                    <p className="text-[11px] sm:text-sm text-neutral-300 leading-snug mt-0.5">
                      {data.leadParagraph}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#0e1017]/90 px-3 py-1.5 rounded-full border border-neutral-800 shrink-0">
                    <span className="font-mono text-[9px] text-[#22c55e] uppercase font-bold mr-1">
                      0{activeFrontIdx + 1} / 0{totalFronts}
                    </span>
                    {fronts.map((f, idx) => (
                      <span
                        key={f.code}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeFrontIdx === idx
                            ? 'w-7 bg-[#22c55e]'
                            : idx < activeFrontIdx
                              ? 'w-2 bg-[#eab308]'
                              : 'w-2 bg-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Widescreen Horizontal Track (100vw per slide, shrink-0) */}
                <div className="w-full overflow-hidden">
                  <div
                    style={{
                      transform: `translate3d(-${steppedPos * 100}vw, 0, 0)`,
                    }}
                    className="flex items-center shrink-0 transition-transform duration-150 ease-out will-change-transform"
                  >
                    {fronts.map((front) => (
                      <article
                        key={front.code}
                        className="w-screen shrink-0 flex items-center justify-center px-3 sm:px-8"
                      >
                        <div
                          style={{
                            borderColor: `${front.accent}55`,
                            boxShadow:
                              '0 25px 65px rgba(0,0,0,0.92), inset 0 1px 0 rgba(255,255,255,0.06)',
                          }}
                          className="w-full max-w-5xl rounded-3xl bg-[#0b0d14]/95 border p-4 sm:p-7 backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-center"
                        >
                          {/* Artwork Window */}
                          <div className="md:col-span-6 relative aspect-[16/9] max-h-[140px] sm:max-h-[290px] w-full rounded-2xl overflow-hidden border border-neutral-800 bg-[#090a0f]">
                            <img
                              src={front.image}
                              alt={front.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#090a0f]/90 border border-neutral-700 font-mono text-[8.5px] sm:text-[10px] font-bold text-[#22c55e] uppercase tracking-wider">
                              {front.shortLabel}
                            </div>
                          </div>

                          {/* Boxed Rounded Narrative Card */}
                          <div className="md:col-span-6 p-3.5 sm:p-5 rounded-2xl bg-[#10131d]/90 border border-neutral-800/90 space-y-2 sm:space-y-3">
                            <span
                              style={{
                                borderColor: `${front.accent}66`,
                                color: front.accent,
                                backgroundColor: `${front.accent}15`,
                              }}
                              className="inline-block px-3 py-1 rounded-full border font-mono text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider"
                            >
                              {front.stat}
                            </span>
                            <h3 className="text-base sm:text-2xl font-extrabold text-white leading-snug">
                              {front.title}
                            </h3>
                            <p className="text-[11px] sm:text-sm text-neutral-200 leading-snug sm:leading-relaxed">
                              {front.body}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* STAGE 2: Live 7-Post Reformed Social App Mockup + Sunlit Third Places Showcase */}
              <div
                style={{
                  opacity: stage1Env.opacity,
                  transform: `translate3d(0, ${stage1Env.y}px, 0)`,
                  pointerEvents: stage1Env.opacity > 0.2 ? 'auto' : 'none',
                }}
                className="col-start-1 row-start-1 w-full max-w-6xl mx-auto px-3 sm:px-8 transition-opacity duration-75"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-center">
                  <div className="md:col-span-5 space-y-3">
                    <div className="rounded-3xl bg-[#0b0d14]/94 border border-[#22c55e]/45 p-4 sm:p-6 backdrop-blur-xl">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/50 font-mono text-[9px] sm:text-[10px] text-[#22c55e] font-bold uppercase tracking-wider mb-2">
                        REFORMED PUBLIC SPHERE IN ACTION
                      </span>
                      <h3 className="text-base sm:text-2xl font-extrabold text-white mb-2 leading-snug">
                        When Bot Farms Vanish and Chronology Returns
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-3">
                        Every account maps to a verified, accountable human
                        being, and local civic infrastructure, senior clubs, and
                        empirical research reach 100% of subscribers without
                        synthetic rage amplification.
                      </p>
                      <div className="font-mono text-[8.5px] sm:text-[10px] text-neutral-400">
                        {data.citation}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7">
                    <OutrageMultiplier
                      defaultMode="reformed"
                      scrollProgress={stage2FeedProgress}
                      compact
                    />
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
