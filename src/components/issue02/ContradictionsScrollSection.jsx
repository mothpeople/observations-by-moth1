import React from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';

export default function ContradictionsScrollSection({ data }) {
  const steps = data.steps;
  const total = steps.length;

  return (
    <PinnedStage id="beat-3" heightMultiplier={5.2}>
      {(progress) => {
        // Map overall progress [0.04 .. 0.94] across 4 panels horizontally
        const trackProgress = clamp(remap(progress, 0.04, 0.94, 0, total - 1), 0, total - 1);
        const activeIndex = Math.min(total - 1, Math.max(0, Math.round(trackProgress)));
        const translateXPercent = -(trackProgress * (100 / total));

        return (
          <div className="relative w-full h-full bg-[#0f1115] text-[#e2e8f0] overflow-hidden flex flex-col justify-between pt-14 pb-5 px-4 sm:px-8">
            {/* Subtle Cyberpunk Grid Background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* Section Header + Step Progress Bar */}
            <div className="relative z-20 max-w-6xl w-full mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[#67e8f9] uppercase">
                    {data.tag}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    // HORIZONTAL SCRUB TRACK
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#e2e8f0] tracking-tight">
                  {data.title}:{' '}
                  <span className="text-slate-400 font-normal text-sm sm:text-base">
                    {data.subtitle}
                  </span>
                </h2>
              </div>

              {/* 4-Stage Indicator Pills */}
              <div className="flex items-center gap-2">
                {steps.map((step, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={step.id}
                      style={{
                        borderColor: isActive ? step.accent : '#1e293b',
                        backgroundColor: isActive ? `${step.accent}18` : '#121316',
                      }}
                      className="px-2.5 py-1 border font-mono text-[10px] tracking-wider uppercase transition-colors duration-200"
                    >
                      <span
                        style={{ color: isActive ? step.accent : '#64748b' }}
                        className="font-bold"
                      >
                        0{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Horizontal Scrub Track Container */}
            <div className="relative z-10 flex-1 flex items-center w-full max-w-6xl mx-auto overflow-hidden my-2">
              <div
                style={{
                  width: `${total * 100}%`,
                  transform: `translate3d(${translateXPercent}%, 0, 0)`,
                }}
                className="flex w-full h-full items-center will-change-transform"
              >
                {steps.map((step, idx) => {
                  const distance = Math.abs(trackProgress - idx);
                  const cardScale = clamp(1 - distance * 0.06, 0.92, 1);
                  const cardOpacity = clamp(1 - distance * 0.55, 0.25, 1);
                  const barGrowth = clamp(1 - distance * 0.8, 0.15, 1);

                  return (
                    <div
                      key={step.id}
                      style={{
                        width: `${100 / total}%`,
                        opacity: cardOpacity,
                        transform: `scale(${cardScale})`,
                      }}
                      className="px-1 sm:px-3 transition-opacity duration-75"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-center">
                        {/* Illustration Frame */}
                        <div className="lg:col-span-7 relative border border-slate-800 bg-[#121316] overflow-hidden aspect-video shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(to top, rgba(15,17,21,0.85) 0%, rgba(15,17,21,0.1) 50%, rgba(15,17,21,0.4) 100%)',
                            }}
                          />
                          <div className="absolute top-3 left-3 border border-slate-800 bg-[#0f1115]/90 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] uppercase text-[#e2e8f0]">
                            {step.tag}
                          </div>
                          <div
                            style={{ color: step.accent, borderColor: `${step.accent}50` }}
                            className="absolute bottom-3 right-3 border bg-[#0f1115]/90 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase font-bold"
                          >
                            {step.subtitle}
                          </div>
                        </div>

                        {/* Narrative + Telemetry Card */}
                        <CyberPanel
                          tag={step.tag}
                          accent={step.accent}
                          className="lg:col-span-5"
                        >
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#e2e8f0] tracking-tight mb-3">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed mb-5">
                            {step.copy}
                          </p>

                          {/* Scroll-Driven Metric Bar */}
                          <div className="p-3.5 bg-[#121316] border border-slate-800 mb-3">
                            <div className="flex items-baseline justify-between gap-2 mb-1.5 font-mono">
                              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                                {step.metricLabel}
                              </span>
                              <span
                                style={{ color: step.accent }}
                                className="text-sm sm:text-base font-extrabold tabular-nums"
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
                                className="h-full transition-all duration-150"
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
            <div className="relative z-20 max-w-6xl w-full mx-auto pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
              <span>
                 CONTRADICTION 0{activeIndex + 1} / 0{total} —{' '}
                <strong className="text-[#e2e8f0] uppercase">
                  {steps[activeIndex].title}
                </strong>
              </span>
              <div className="w-36 sm:w-56 h-1.5 bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  style={{
                    width: `${((trackProgress / (total - 1)) * 100).toFixed(1)}%`,
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
