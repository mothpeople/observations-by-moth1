import React from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';

export default function HeroMachineSection({ data }) {
  const { meta, hero } = data;

  return (
    <PinnedStage id="beat-1" heightMultiplier={3.4}>
      {(progress) => {
        // Cover fades out 0.28 -> 0.45
        const coverOpacity =
          progress < 0.28
            ? 1
            : progress < 0.45
              ? 1 - remap(progress, 0.28, 0.45)
              : 0;
        const coverY =
          progress < 0.28 ? 0 : remap(progress, 0.28, 0.45, 0, -28);

        // Cold Open Story Spread fades in 0.42 -> 0.58 and holds
        const cardOpacity =
          progress < 0.42
            ? 0
            : progress < 0.58
              ? remap(progress, 0.42, 0.58)
              : 1;
        const cardY =
          progress < 0.42
            ? 28
            : progress < 0.58
              ? remap(progress, 0.42, 0.58, 28, 0)
              : 0;

        // Bar growth 0.54 -> 0.84
        const barFill = clamp(remap(progress, 0.54, 0.84, 0, 1), 0, 1);

        // Background dim as Cold Open spread appears
        const bgOpacity =
          progress < 0.32
            ? 0.78
            : remap(progress, 0.32, 0.58, 0.78, 0.26);
        const bgScale = remap(progress, 0, 1, 1.0, 1.06);

        return (
          <div className="relative w-full h-full bg-[#121316] text-[#e2e8f0] overflow-hidden">
            {/* Animated Cyberpunk Line-Art Skyline Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-150 will-change-transform"
              style={{
                backgroundImage: `url('${hero.image}')`,
                opacity: bgOpacity,
                transform: `scale(${bgScale})`,
              }}
            />

            {/* Soft Pastel Cyan & Muted Lavender Window Glow + Vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 35%, rgba(103,232,249,0.08) 0%, rgba(192,132,252,0.08) 40%, rgba(18,19,22,0.92) 88%)',
              }}
            />

            {/* LAYER 1: Hero Title Cover */}
            <div
              style={{
                opacity: coverOpacity,
                transform: `translate3d(0, ${coverY}px, 0)`,
                pointerEvents: coverOpacity > 0.15 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center pt-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 border border-slate-800 bg-[#121316]/90 px-3.5 py-1.5 mb-5">
                  <span className="h-2 w-2 rounded-full bg-[#67e8f9] animate-pulse" />
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-[#67e8f9] uppercase">
                    {meta.publication} • {meta.date}
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#e2e8f0] uppercase leading-[1.05] mb-4 sm:mb-5 drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
                  The Meat Grinder{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86efac] via-[#67e8f9] to-[#c084fc]">
                    Needs More Meat
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto text-base sm:text-xl md:text-2xl text-[#e2e8f0]/90 leading-relaxed font-medium mb-6 sm:mb-8">
                  {hero.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono tracking-[0.16em] text-slate-300 uppercase">
                  <span className="border border-slate-800 bg-[#121316]/85 px-3 py-1 text-[#86efac]">
                    1.73 Earths Consumed
                  </span>
                  <span className="border border-slate-800 bg-[#121316]/85 px-3 py-1 text-[#67e8f9]">
                    2050 Coastal Horizon
                  </span>
                  <span className="border border-slate-800 bg-[#121316]/85 px-3 py-1 text-[#c084fc]">
                    The Biological Scam
                  </span>
                </div>

                <div className="mt-8 sm:mt-12 flex flex-col items-center gap-2 text-slate-400">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#67e8f9]">
                    Scroll to Enter
                  </span>
                  <div className="w-[1px] h-8 sm:h-10 bg-gradient-to-b from-[#67e8f9] to-transparent" />
                </div>
              </div>
            </div>

            {/* LAYER 2: The Cold Open Graphic-Novel Spread */}
            <div
              style={{
                opacity: cardOpacity,
                transform: `translate3d(0, ${cardY}px, 0)`,
                pointerEvents: cardOpacity > 0.2 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-20 flex items-center justify-center px-3 sm:px-6 pt-14 pb-3 sm:pb-6"
            >
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 md:gap-7 items-center">
                {/* Left Column: Animated Illustration + Cold Open Copy */}
                <CyberPanel
                  label="The Cold Open"
                  accent="#67e8f9"
                  className="lg:col-span-7"
                >
                  {/* Embedded Animated Graphic-Novel Panel */}
                  <div className="relative w-full aspect-[16/8.5] max-h-[115px] sm:max-h-[200px] lg:max-h-[240px] mb-2.5 sm:mb-4 border border-slate-800 bg-[#0f1115] overflow-hidden">
                    <img
                      src={hero.grinderImage || hero.image}
                      alt="The Billionaire Podcast vs. The Meat Grinder"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(18,19,22,0.75) 0%, transparent 50%)',
                      }}
                    />
                  </div>

                  <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-[#e2e8f0] tracking-tight leading-snug mb-2 sm:mb-3">
                    {hero.coldOpenHeadline}
                  </h2>

                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
                    {hero.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className={
                          i === 1
                            ? 'border-l-2 border-[#c084fc] pl-3 text-[#e2e8f0]/90'
                            : ''
                        }
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </CyberPanel>

                {/* Right Column: Three Undeniable Data Anchors */}
                <CyberPanel
                  label="Three Undeniable Data Points"
                  accent="#86efac"
                  className="lg:col-span-5"
                >
                  <div className="space-y-2 sm:space-y-3.5">
                    {hero.anchors.map((anchor) => {
                      const pct = Math.round(anchor.percent * barFill);
                      return (
                        <div
                          key={anchor.label}
                          className="p-2 sm:p-3 bg-[#0f1115]/90 border border-slate-800/90 space-y-1 sm:space-y-1.5"
                        >
                          <div className="flex items-baseline justify-between gap-2 font-mono text-[10px] sm:text-xs">
                            <span className="text-[#e2e8f0] font-semibold truncate">
                              {anchor.label}
                            </span>
                            <span
                              style={{ color: anchor.color }}
                              className="font-bold shrink-0"
                            >
                              {anchor.value}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900 border border-slate-800 overflow-hidden">
                            <div
                              style={{
                                width: `${pct}%`,
                                backgroundColor: anchor.color,
                              }}
                              className="h-full transition-all duration-100"
                            />
                          </div>
                          <p className="hidden sm:block text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                            {anchor.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-800/80 font-mono text-[9px] sm:text-[10px] text-slate-400 leading-relaxed">
                    {hero.citation}
                  </p>
                </CyberPanel>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
