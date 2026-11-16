import React from 'react';
import PinnedStage from '../PinnedStage';
import CartographyCard from './CartographyCard';
import { clamp, remap, getCardEnvelope } from '../../utils/math';

export default function HeroHumiliationSection({ data }) {
  const { meta, hero } = data;

  return (
    <PinnedStage id="humen-2am" heightMultiplier={5.8}>
      {(progress) => {
        // PHASE 1 (0.00 -> 0.05): Full-bright opening artwork (Humen 1839 vs 2:00 AM Bedroom)
        // PHASE 2 (0.05 -> 0.13): Artwork dims from 1.0 -> 0.30 as Hero Title & Subtitle fade in
        // PHASE 3 (0.13 -> 0.22): Title & Subtitle hold on dimmed backdrop
        // PHASE 4 (0.22 -> 0.28): Title fades out as the 4 Cold-Open Exhibits fade in
        const coverFadeIn = clamp(remap(progress, 0.05, 0.13, 0, 1), 0, 1);
        const coverFadeOut =
          progress < 0.22
            ? 1
            : 1 - clamp(remap(progress, 0.22, 0.28, 0, 1), 0, 1);
        const coverOpacity = coverFadeIn * coverFadeOut;
        const coverY =
          progress < 0.13
            ? remap(progress, 0.05, 0.13, 24, 0)
            : progress < 0.22
              ? 0
              : remap(progress, 0.22, 0.28, 0, -28);

        const earlyPromptOpacity = clamp(
          1 - remap(progress, 0.03, 0.08, 0, 1),
          0,
          1
        );

        const stageOpacity =
          progress < 0.25
            ? 0
            : progress < 0.31
              ? remap(progress, 0.25, 0.31)
              : 1;

        // Active card index (0, 1, 2, 3) for 4-way full-screen & frame artwork transitions
        const activeCardIdx =
          progress < 0.44
            ? 0
            : progress < 0.62
              ? 1
              : progress < 0.8
                ? 2
                : 3;

        const bgMasterOpacity =
          progress < 0.04
            ? 1.0
            : progress < 0.13
              ? remap(progress, 0.04, 0.13, 1.0, 0.32)
              : 0.32;
        const vignetteOpacity = clamp(
          remap(progress, 0.04, 0.13, 0.16, 0.88),
          0.16,
          0.88
        );
        const bgScale = remap(progress, 0, 1, 1.0, 1.09);

        // Biometric eye-tracking crosshair sweep
        const eyeX = Math.sin(progress * Math.PI * 2.5) * 42;
        const eyeY = Math.cos(progress * Math.PI * 1.8) * 20;

        return (
          <div className="relative w-full h-full bg-[#090a0f] text-[#e2e8f0] overflow-hidden">
            {/* Full-Bleed Animated Background Layers (Crossfading across all 4 cards) */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 will-change-transform"
              style={{
                backgroundImage: `url('${hero.image}')`,
                opacity:
                  progress < 0.26
                    ? bgMasterOpacity
                    : activeCardIdx === 0
                      ? 0.35
                      : 0,
                transform: `scale(${bgScale})`,
              }}
            />
            {hero.cards.map((c, i) => (
              <div
                key={c.id}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 will-change-transform"
                style={{
                  backgroundImage: `url('${c.image}')`,
                  opacity:
                    progress >= 0.26 && activeCardIdx === i ? 0.36 : 0,
                  transform: `scale(${bgScale})`,
                }}
              />
            ))}

            {/* Soft Vignette */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-150"
              style={{
                opacity: vignetteOpacity,
                background:
                  'radial-gradient(circle at 50% 38%, rgba(9,10,15,0.52) 0%, rgba(9,10,15,0.86) 68%, rgba(9,10,15,0.96) 96%)',
              }}
            />

            {/* Biometric Eye-Tracking & Astrolabe Reticle */}
            <svg
              aria-hidden="true"
              viewBox="0 0 800 450"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-30"
            >
              <g
                transform={`translate(${400 + eyeX}, ${210 + eyeY})`}
                stroke="#eab308"
                fill="none"
              >
                <circle r="96" strokeWidth="1" strokeDasharray="8 5" />
                <circle r="48" strokeWidth="0.9" stroke="#ef4444" />
                <circle r="5" stroke="#ef4444" strokeWidth="1.5" />
              </g>
            </svg>

            {/* LAYER 0: Rounded Pill at Opening Frame (fades out as title fades in) */}
            <div
              style={{
                opacity: earlyPromptOpacity,
                pointerEvents: 'none',
              }}
              className="seq-layer absolute inset-x-0 bottom-6 sm:bottom-9 z-10 flex flex-col items-center justify-center px-3 text-center"
            >
              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#090a0f]/95 border border-[#eab308]/80 shadow-[0_20px_50px_rgba(0,0,0,1)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-ping shrink-0" />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-white uppercase font-extrabold">
                  {meta.publication}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eab308] text-[#090a0f] font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  {meta.issue}
                </span>
                <span className="font-mono text-[9.5px] sm:text-xs tracking-[0.18em] text-[#eab308] uppercase font-bold">
                  Scroll to Reveal Title ↓
                </span>
              </div>
            </div>

            {/* LAYER 1: Uncluttered Hero Title Cover (Only Badge, Title, Subtitle, Scroll Prompt) */}
            <div
              style={{
                opacity: coverOpacity,
                transform: `translate3d(0, ${coverY}px, 0)`,
                pointerEvents: coverOpacity > 0.15 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-14 pb-2"
            >
              <div className="max-w-4xl mx-auto">
                {/* Rounded Issue 04 Pill */}
                <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#eab308]/80 bg-[#090a0f]/95 px-3.5 sm:px-5 py-1 sm:py-1.5 mb-4 sm:mb-6 shadow-[0_12px_30px_rgba(0,0,0,0.98)]">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-ping shrink-0" />
                  <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] text-white uppercase font-extrabold">
                    {meta.publication}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#eab308] text-[#090a0f] font-mono text-[9px] sm:text-[11px] font-black uppercase tracking-wider">
                    {meta.issue} • {meta.date}
                  </span>
                </div>

                <h1 className="font-editorial text-[34px] sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.04] sm:leading-[1.05] mb-4 sm:mb-6 drop-shadow-[0_12px_40px_rgba(0,0,0,1)]">
                  The Century of{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] via-[#ef4444] to-[#22c55e]">
                    Self-Inflicted Humiliation
                  </span>
                </h1>

                {/* Rounded Glass Subtitle */}
                <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4 py-3 sm:px-7 sm:py-5 rounded-3xl bg-[#090a0f]/88 border border-neutral-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                  <p className="text-xs sm:text-xl md:text-2xl text-neutral-100 leading-relaxed font-medium sm:font-semibold">
                    {hero.subtitle}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 text-neutral-300">
                  <span className="px-4 py-1.5 rounded-full bg-[#090a0f]/90 border border-[#eab308]/50 font-mono text-[9.5px] sm:text-[10px] tracking-[0.24em] uppercase text-[#eab308] font-bold">
                    Scroll to Enter Humen Beach, 1839
                  </span>
                  <div className="w-[1px] h-6 sm:h-10 bg-gradient-to-b from-[#eab308] to-transparent" />
                </div>
              </div>
            </div>

            {/* LAYER 2: 4 Sequenced Cold-Open Rounded Cards + 4-Way Animated Artwork Stage */}
            <div
              style={{
                opacity: stageOpacity,
                pointerEvents: stageOpacity > 0.15 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-20 flex items-start lg:items-center justify-center px-2.5 sm:px-6 pt-16 pb-2 lg:py-0"
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-6 items-center">
                {/* Left Column: 4-Way Crossfading Rounded Cinema Window */}
                <div className="lg:col-span-7">
                  <div className="relative w-full aspect-[16/9] max-h-[145px] sm:max-h-[275px] lg:max-h-none rounded-3xl border border-neutral-700/80 bg-[#090a0f] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden">
                    {hero.cards.map((c, i) => (
                      <img
                        key={c.id}
                        src={c.image}
                        alt={c.headline}
                        style={{ opacity: activeCardIdx === i ? 1 : 0 }}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                      />
                    ))}

                    {/* Floating Rounded Pill Indicator inside Artwork */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-[#090a0f]/90 border border-neutral-700 font-mono text-[8.5px] sm:text-[10px] text-white font-bold uppercase tracking-wider backdrop-blur-md truncate">
                        {hero.cards[activeCardIdx]?.stamp}
                      </span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#090a0f]/90 border border-neutral-800">
                        {hero.cards.map((c, i) => (
                          <span
                            key={c.id}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              activeCardIdx === i
                                ? 'w-5 bg-[#eab308]'
                                : 'w-1.5 bg-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bottom Citation Strip */}
                    <div className="absolute bottom-0 inset-x-0 px-4 py-1.5 bg-[#090a0f]/90 border-t border-neutral-800/80 font-mono text-[8px] sm:text-[10px] text-neutral-300 truncate">
                      {hero.citation}
                    </div>
                  </div>
                </div>

                {/* Right Column: 4 Concise Rounded Story Cards (No redundant section title) */}
                <div className="lg:col-span-5 grid grid-cols-1 items-start md:items-center">
                  {hero.cards.map((card, idx) => {
                    const env = getCardEnvelope(
                      progress,
                      card.start,
                      card.end,
                      false,
                      idx === hero.cards.length - 1
                    );

                    const cardProgress = clamp(
                      remap(
                        progress,
                        card.start + 0.015,
                        card.start + (card.end - card.start) * 0.72,
                        0,
                        1
                      ),
                      0,
                      1
                    );
                    const animatedBarWidth = Math.round(
                      card.barPercent * cardProgress
                    );

                    let animatedMetricText = card.metricValue;
                    if (idx === 0) {
                      const lbs = Math.round(
                        remap(cardProgress, 0, 1, 250000, 2600000)
                      );
                      animatedMetricText = `${lbs.toLocaleString()} lbs Flushed`;
                    } else if (idx === 1) {
                      const millions = Math.round(
                        remap(cardProgress, 0, 1, 5, 40)
                      );
                      animatedMetricText = `${millions},000,000+ Addicted`;
                    } else if (idx === 3) {
                      const days = remap(cardProgress, 0, 1, 5, 35.4).toFixed(1);
                      animatedMetricText = `${days} Full Waking Days / Yr`;
                    }

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
                          telemetry={card.stamp}
                          accent={card.accent}
                        >
                          <h2 className="text-sm sm:text-2xl font-extrabold text-[#e2e8f0] leading-snug mb-1.5 sm:mb-2.5">
                            {card.headline}
                          </h2>
                          <p className="text-[11px] sm:text-base text-neutral-300 leading-snug sm:leading-relaxed mb-2 sm:mb-3">
                            {card.body}
                          </p>
                          {card.punchline && (
                            <p className="text-[11px] sm:text-base font-extrabold text-[#eab308] rounded-2xl bg-[#eab308]/10 border border-[#eab308]/35 px-3 py-2 mb-2 sm:mb-3">
                              {card.punchline}
                            </p>
                          )}

                          {/* Scroll-Animated Rounded Metric Pill Bar */}
                          <div className="pt-2 sm:pt-3 border-t border-neutral-800/90 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 font-mono text-[9px] sm:text-xs">
                              <span className="text-neutral-400 truncate">
                                {card.metricLabel}
                              </span>
                              <span
                                style={{ color: card.accent }}
                                className="font-black tabular-nums shrink-0"
                              >
                                {animatedMetricText}
                              </span>
                            </div>
                            <div className="w-full h-2 sm:h-2.5 rounded-full bg-[#07080c] border border-neutral-800 overflow-hidden">
                              <div
                                style={{
                                  width: `${animatedBarWidth}%`,
                                  backgroundColor: card.accent,
                                }}
                                className="h-full rounded-full transition-all duration-75"
                              />
                            </div>
                          </div>
                        </CartographyCard>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
