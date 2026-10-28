import React from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';

export default function HeroMachineSection({ data }) {
  return (
    <PinnedStage id="beat-1" heightMultiplier={3.2}>
      {(progress) => {
        // Cover fades out 0.30 -> 0.48
        const coverOpacity =
          progress < 0.3
            ? 1
            : progress < 0.48
              ? 1 - remap(progress, 0.3, 0.48)
              : 0;
        const coverY =
          progress < 0.3 ? 0 : remap(progress, 0.3, 0.48, 0, -28);

        // Card 2 fades in 0.45 -> 0.62 and holds until end of section
        const cardOpacity =
          progress < 0.45
            ? 0
            : progress < 0.62
              ? remap(progress, 0.45, 0.62)
              : 1;
        const cardY =
          progress < 0.45
            ? 28
            : progress < 0.62
              ? remap(progress, 0.45, 0.62, 28, 0)
              : 0;

        // Bar growth 0.56 -> 0.85
        const barFill = clamp(remap(progress, 0.56, 0.85, 0, 1), 0, 1);

        // Background dim as text card appears
        const bgOpacity =
          progress < 0.35
            ? 0.68
            : remap(progress, 0.35, 0.6, 0.68, 0.32);
        const bgScale = remap(progress, 0, 1, 1.0, 1.07);

        return (
          <div className="relative w-full h-full bg-[#0f1115] text-[#e2e8f0] overflow-hidden">
            {/* Animated Cyberpunk Line-Art Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-150 will-change-transform"
              style={{
                backgroundImage: `url('/issues/issue-02/hero-machine.webp')`,
                opacity: bgOpacity,
                transform: `scale(${bgScale})`,
              }}
            />

            {/* Technical Grid & Gradient Vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 35%, rgba(15,17,21,0.25) 0%, rgba(15,17,21,0.92) 85%)',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* LAYER 1: Hero Title Cover */}
            <div
              style={{
                opacity: coverOpacity,
                transform: `translate3d(0, ${coverY}px, 0)`,
                pointerEvents: coverOpacity > 0.15 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
            >
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2.5 border border-slate-800 bg-[#121316]/90 px-3.5 py-1.5 mb-6">
                  <span className="h-2 w-2 rounded-full bg-[#86efac] animate-pulse" />
                  <span className="font-mono text-[11px] tracking-[0.24em] text-[#86efac] uppercase">
                    {data.meta.tag} // {data.meta.issue}
                  </span>
                </div>

                <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#e2e8f0] uppercase leading-[1.04] mb-6 drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]">
                  The Meat Grinder{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#86efac] via-[#67e8f9] to-[#fda4af]">
                    Needs More Meat
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal mb-8">
                  {data.meta.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono tracking-[0.2em] text-slate-400 uppercase">
                  <span className="border border-slate-800 bg-[#0f1115]/80 px-3 py-1.5 text-[#67e8f9]">
                    {data.meta.publication}
                  </span>
                  <span className="border border-slate-800 bg-[#0f1115]/80 px-3 py-1.5">
                    {data.meta.date}
                  </span>
                  <span className="border border-slate-800 bg-[#0f1115]/80 px-3 py-1.5 text-[#fda4af]">
                    2.1 TFR REPLACEMENT THRESHOLD
                  </span>
                </div>

                <div className="mt-12 flex flex-col items-center gap-2 text-slate-400">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#86efac]">
                    Scroll to Inspect the Machine
                  </span>
                  <div className="w-[1px] h-10 bg-gradient-to-b from-[#86efac] to-transparent" />
                </div>
              </div>
            </div>

            {/* LAYER 2: Opening Premise + Global TFR Freefall Chart */}
            <div
              style={{
                opacity: cardOpacity,
                transform: `translate3d(0, ${cardY}px, 0)`,
                pointerEvents: cardOpacity > 0.2 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 pt-14 pb-6"
            >
              <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center">
                {/* Left Narrative Panel */}
                <CyberPanel
                  tag={data.hero.tag}
                  accent="#fda4af"
                  className="lg:col-span-7"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e2e8f0] tracking-tight leading-tight mb-4">
                    {data.hero.card2Headline}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                    {data.hero.card2Copy}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed border-l-2 border-[#86efac] pl-3.5">
                    {data.hero.card2Subcopy}
                  </p>
                </CyberPanel>

                {/* Right TFR Telemetry Panel */}
                <CyberPanel
                  tag="[TELEMETRY // TFR FREEFALL]"
                  accent="#67e8f9"
                  className="lg:col-span-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#67e8f9] font-semibold">
                      Total Fertility Rate (2024–2025)
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      Births / Woman
                    </span>
                  </div>

                  <div className="space-y-3">
                    {data.hero.tfrStats.map((stat, idx) => {
                      const pct = Math.min(100, (stat.value / 2.4) * 100) * barFill;
                      const displayedVal = (stat.value * barFill).toFixed(2);
                      return (
                        <div key={stat.label} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span
                              className={
                                idx === 0
                                  ? 'text-[#86efac] font-semibold'
                                  : 'text-slate-300'
                              }
                            >
                              {stat.label}
                            </span>
                            <span
                              style={{ color: stat.color }}
                              className="font-bold tabular-nums"
                            >
                              {displayedVal}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden">
                            <div
                              style={{
                                width: `${pct}%`,
                                backgroundColor: stat.color,
                              }}
                              className="h-full transition-all duration-75"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-4 pt-3 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 leading-relaxed">
                    {data.hero.citation}
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
