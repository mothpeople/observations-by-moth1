import React from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';

/**
 * Computes stepped horizontal position (0 -> 3) and per-slide bar fill (0 -> 1)
 * so each card locks in place, animates its metric bar to 100%, pauses for reading,
 * and only then scrolls horizontally to the next card.
 */
function getSteppedTrackState(progress) {
  // 4 plateaus:
  // Slide 0: [0.00 .. 0.21], transition -> Slide 1: [0.21 .. 0.27]
  // Slide 1: [0.27 .. 0.48], transition -> Slide 2: [0.48 .. 0.54]
  // Slide 2: [0.54 .. 0.75], transition -> Slide 3: [0.75 .. 0.81]
  // Slide 3: [0.81 .. 1.00]
  let trackPosition = 0;
  if (progress < 0.21) {
    trackPosition = 0;
  } else if (progress < 0.27) {
    trackPosition = remap(progress, 0.21, 0.27, 0, 1);
  } else if (progress < 0.48) {
    trackPosition = 1;
  } else if (progress < 0.54) {
    trackPosition = remap(progress, 0.48, 0.54, 1, 2);
  } else if (progress < 0.75) {
    trackPosition = 2;
  } else if (progress < 0.81) {
    trackPosition = remap(progress, 0.75, 0.81, 2, 3);
  } else {
    trackPosition = 3;
  }

  // Per-slide bar fill (animates from 0 -> 1 while the slide is parked on screen)
  const barFills = [
    clamp(remap(progress, 0.02, 0.16, 0, 1), 0, 1),
    clamp(remap(progress, 0.28, 0.43, 0, 1), 0, 1),
    clamp(remap(progress, 0.55, 0.7, 0, 1), 0, 1),
    clamp(remap(progress, 0.82, 0.95, 0, 1), 0, 1),
  ];

  return { trackPosition, barFills };
}

export default function ContradictionsScrollSection({ data }) {
  const steps = data.steps;
  const total = steps.length;

  return (
    <PinnedStage id="beat-3" heightMultiplier={8.5}>
      {(progress) => {
        const { trackPosition, barFills } = getSteppedTrackState(progress);
        const activeIndex = Math.min(
          total - 1,
          Math.max(0, Math.round(trackPosition))
        );
        const translateXPercent = -(trackPosition * 100);

        return (
          <div className="relative w-full h-full bg-[#121316] text-[#e2e8f0] overflow-hidden flex flex-col justify-between pt-16 pb-5 px-4 sm:px-8">
            {/* Subtle Background Artwork Texture from Active Slide */}
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 blur-sm transition-all duration-500"
              style={{
                backgroundImage: `url('${steps[activeIndex].image}')`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(18,19,22,0.78) 0%, rgba(18,19,22,0.96) 85%)',
              }}
            />

            {/* Subtle Cyberpunk Linework Grid Background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* Section Header + 4-Panel Progress Pills */}
            <div className="relative z-20 max-w-6xl w-full mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#e2e8f0] tracking-tight leading-tight">
                  {data.title}
                </h2>
                {data.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {data.subtitle}
                  </p>
                )}
              </div>

              {/* 4-Panel Indicator Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
                {steps.map((step, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={step.id}
                      style={{
                        borderColor: isActive ? step.accent : '#1e293b',
                        backgroundColor: isActive
                          ? `${step.accent}18`
                          : '#0f1115',
                      }}
                      className="px-2 sm:px-2.5 py-1 border font-mono text-[10px] tracking-wider uppercase transition-colors duration-200"
                    >
                      <span
                        style={{ color: isActive ? step.accent : '#64748b' }}
                        className="font-bold"
                      >
                        <span className="sm:hidden">0{idx + 1}</span>
                        <span className="hidden sm:inline">{step.subtitle}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Full-Width Horizontal Scrub Track Container */}
            <div className="relative z-10 flex-1 flex items-center w-full max-w-6xl mx-auto overflow-hidden my-1 sm:my-2">
              <div
                style={{
                  transform: `translate3d(${translateXPercent}%, 0, 0)`,
                }}
                className="flex w-full h-full items-center will-change-transform"
              >
                {steps.map((step, idx) => {
                  const distance = Math.abs(trackPosition - idx);
                  const cardOpacity = clamp(1 - distance * 0.65, 0.15, 1);
                  const barGrowth = barFills[idx];

                  return (
                    <div
                      key={step.id}
                      style={{
                        opacity: cardOpacity,
                      }}
                      className="w-full shrink-0 px-1 sm:px-2 transition-opacity duration-75"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 md:gap-8 items-center">
                        {/* Graphic-Novel Illustration Panel (7 cols on Desktop) */}
                        <div className="lg:col-span-7 relative border border-slate-800 bg-[#0f1115] overflow-hidden aspect-video max-h-[175px] sm:max-h-[260px] lg:max-h-none shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(to top, rgba(18,19,22,0.82) 0%, rgba(18,19,22,0.06) 50%, rgba(18,19,22,0.35) 100%)',
                            }}
                          />
                          <div
                            style={{
                              color: step.accent,
                              borderColor: `${step.accent}55`,
                            }}
                            className="absolute bottom-3 left-3 border bg-[#121316]/92 px-3 py-1 font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase font-bold"
                          >
                            {step.subtitle}
                          </div>
                        </div>

                        {/* Narrative + Telemetry Card (5 cols on Desktop, Full Width on Mobile) */}
                        <CyberPanel
                          label={step.subtitle}
                          accent={step.accent}
                          className="lg:col-span-5"
                        >
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#e2e8f0] tracking-tight leading-snug mb-3.5">
                            {step.title}
                          </h3>
                          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
                            {step.copy}
                          </p>

                          {/* Scroll-Driven Metric Bar (Animates to end while card is parked) */}
                          <div className="p-3.5 bg-[#0f1115] border border-slate-800 mb-3">
                            <div className="flex items-baseline justify-between gap-2 mb-1.5 font-mono">
                              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                                {step.metricLabel}
                              </span>
                              <span
                                style={{ color: step.accent }}
                                className="text-xs sm:text-sm font-extrabold tabular-nums shrink-0"
                              >
                                {step.metricValue}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden">
                              <div
                                style={{
                                  width: `${Math.round(step.barPercent * barGrowth)}%`,
                                  backgroundColor: step.accent,
                                }}
                                className="h-full transition-all duration-100"
                              />
                            </div>
                          </div>

                          <p className="font-mono text-[10px] text-slate-400 leading-relaxed">
                            {step.citation}
                          </p>
                        </CyberPanel>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Horizontal Scrub Bar */}
            <div className="relative z-20 max-w-6xl w-full mx-auto pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4 font-mono text-[10px] sm:text-xs text-slate-400">
              <span>
                <strong
                  style={{ color: steps[activeIndex].accent }}
                  className="uppercase"
                >
                  {steps[activeIndex].title}
                </strong>
              </span>
              <div className="w-40 sm:w-64 h-1.5 bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  style={{
                    width: `${(progress * 100).toFixed(1)}%`,
                    backgroundColor: steps[activeIndex].accent,
                  }}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
