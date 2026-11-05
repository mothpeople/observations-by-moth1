import React from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { clamp, remap, getCardEnvelope } from '../../utils/math';

export default function HeroPhantomSection({ data }) {
  const { meta, hero } = data;

  return (
    <PinnedStage id="phantom" heightMultiplier={5.2}>
      {(progress) => {
        // PHASE 1 (0.00 -> 0.05): Pure Full-Bright Artwork Opening (no title words covering the center)
        // PHASE 2 (0.05 -> 0.13): Background dims from 1.0 -> 0.28 while Hero Title & Subtitle fade in cleanly
        // PHASE 3 (0.13 -> 0.25): Hero Title & Subtitle hold on a dimmed background for effortless reading
        // PHASE 4 (0.25 -> 0.32): Hero Title dissolves seamlessly into Stage Exhibit 01 + Card 1
        const coverFadeIn = clamp(remap(progress, 0.05, 0.13, 0, 1), 0, 1);
        const coverFadeOut =
          progress < 0.25 ? 1 : 1 - clamp(remap(progress, 0.25, 0.32, 0, 1), 0, 1);
        const coverOpacity = coverFadeIn * coverFadeOut;
        const coverY =
          progress < 0.13
            ? remap(progress, 0.05, 0.13, 24, 0)
            : progress < 0.25
              ? 0
              : remap(progress, 0.25, 0.32, 0, -20);

        // Early floating scroll prompt visible at 0.00 -> 0.08 while artwork is in full bright mode
        const earlyPromptOpacity = clamp(1 - remap(progress, 0.03, 0.09, 0, 1), 0, 1);

        // Cold Open Story Stage fades in 0.25 -> 0.32 in exact unison with Title dissolve
        const stageOpacity =
          progress < 0.25
            ? 0
            : progress < 0.32
              ? remap(progress, 0.25, 0.32)
              : 1;

        // 3-way artwork crossfade across the 3 sequenced Cold Open cards:
        // Card 1 (0.30 -> 0.54): hero-dossier.webp
        // Card 2 (0.54 -> 0.77): trillion-burn.webp
        // Card 3 (0.77 -> 1.00): cartel-kpi.webp
        const img1Opacity =
          progress < 0.50 ? 1 : 1 - clamp(remap(progress, 0.50, 0.57, 0, 1), 0, 1);
        const img2Opacity =
          progress < 0.50
            ? 0
            : progress < 0.73
              ? clamp(remap(progress, 0.50, 0.57, 0, 1), 0, 1)
              : 1 - clamp(remap(progress, 0.73, 0.80, 0, 1), 0, 1);
        const img3Opacity =
          progress < 0.73 ? 0 : clamp(remap(progress, 0.73, 0.80, 0, 1), 0, 1);

        // Background starts at 1.0 (full bright mode) at progress 0, then dims down to 0.28 as words fade in
        const bgMasterOpacity =
          progress < 0.04
            ? 1.0
            : progress < 0.13
              ? remap(progress, 0.04, 0.13, 1.0, 0.28)
              : 0.28;
        const vignetteOpacity = clamp(remap(progress, 0.04, 0.13, 0.18, 0.92), 0.18, 0.92);
        const bgScale = remap(progress, 0, 1, 1.0, 1.08);

        // Live ticker climbs from $120B to $1,000,000,000,000+
        const tickerValue = Math.round(
          remap(clamp(progress, 0.05, 0.55), 0.05, 0.55, 120000000000, hero.tickerTarget)
        );

        // Thermal drone crosshair sweep
        const reticleX = Math.sin(progress * Math.PI * 2) * 38;
        const reticleY = Math.cos(progress * Math.PI * 1.5) * 18;

        return (
          <div className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden">
            {/* Background Layer: Ambient Hero Dossier Artwork */}
            <div
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url('${hero.image}')`,
                opacity: bgMasterOpacity,
              }}
            />

            {/* Forensic Blueprint Grid & Dynamic Surveillance Vignette */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #eab308 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: vignetteOpacity,
                background:
                  'radial-gradient(circle at 50% 38%, rgba(10,11,14,0.65) 0%, rgba(10,11,14,0.88) 65%, rgba(10,11,14,0.97) 95%)',
              }}
            />

            {/* Pulsing Wireframe Thermal Surveillance Crosshairs */}
            <svg
              aria-hidden="true"
              viewBox="0 0 800 450"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-35"
            >
              <g
                transform={`translate(${400 + reticleX}, ${210 + reticleY})`}
                stroke="#eab308"
                fill="none"
              >
                <circle r="86" strokeWidth="1" strokeDasharray="6 4" />
                <circle r="42" strokeWidth="0.8" stroke="#22c55e" />
                <line x1="-115" y1="0" x2="-52" y2="0" strokeWidth="1.2" />
                <line x1="52" y1="0" x2="115" y2="0" strokeWidth="1.2" />
                <line x1="0" y1="-115" x2="0" y2="-52" strokeWidth="1.2" />
                <line x1="0" y1="52" x2="0" y2="115" strokeWidth="1.2" />
                <rect x="-4" y="-4" width="8" height="8" stroke="#ef4444" strokeWidth="1.2" />
              </g>
            </svg>

            {/* LAYER 0: High-Contrast Solid Opaque Textbox at Opening Frame (fades out as title words fade in) */}
            <div
              style={{
                opacity: earlyPromptOpacity,
                pointerEvents: 'none',
              }}
              className="seq-layer absolute inset-x-0 bottom-5 sm:bottom-8 z-10 flex flex-col items-center justify-center px-3 text-center"
            >
              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#08090c] border-2 border-[#eab308] shadow-[0_20px_50px_rgba(0,0,0,1)]">
                <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-ping shrink-0" />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.22em] text-white uppercase font-extrabold">
                  {meta.publication}
                </span>
                <span className="px-2 py-0.5 bg-[#eab308] text-[#08090c] font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  {meta.issue}
                </span>
                <span className="font-mono text-[9.5px] sm:text-xs tracking-[0.18em] text-[#22c55e] uppercase font-bold">
                  Scroll to Reveal Title ↓
                </span>
              </div>
            </div>

            {/* LAYER 1: Hero Title Cover (fades in as image dims out) */}
            <div
              style={{
                opacity: coverOpacity,
                transform: `translate3d(0, ${coverY}px, 0)`,
                pointerEvents: coverOpacity > 0.15 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-12 pb-2"
            >
              <div className="max-w-4xl mx-auto">
                {/* High-Contrast Issue 03 Badge Pill */}
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border border-[#eab308]/80 sm:border-2 sm:border-[#eab308] bg-[#08090c] px-2.5 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-4 shadow-[0_12px_30px_rgba(0,0,0,0.98)]">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#ef4444] animate-ping shrink-0" />
                  <span className="font-mono text-[8.5px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] text-white uppercase font-extrabold">
                    {meta.publication}
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 bg-[#eab308] text-[#08090c] font-mono text-[8.5px] sm:text-[11px] font-black uppercase tracking-wider">
                    {meta.issue} • {meta.date}
                  </span>
                </div>

                {/* Overhead Live Digital Ticker: Sleek minimal eyebrow on mobile so the Title dominates; full boxed ticker on desktop */}
                <div className="mb-2 sm:mb-5">
                  <div className="sm:hidden font-mono text-[10px] tracking-[0.2em] text-[#eab308] uppercase font-bold">
                    ${tickerValue.toLocaleString()}+{' '}
                    <span className="text-[#ef4444]">PUBLIC WEALTH BURNED</span>
                  </div>
                  <div className="hidden sm:inline-block border border-[#ef4444]/80 bg-[#08090c] px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
                    <div className="font-mono text-[10px] tracking-[0.24em] text-slate-300 uppercase mb-0.5">
                      {hero.tickerLabel}
                    </div>
                    <div className="font-mono text-3xl font-black text-[#eab308] tabular-nums tracking-wider">
                      ${tickerValue.toLocaleString()}+{' '}
                      <span className="text-sm text-[#ef4444] font-bold">
                        SPENT
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="font-editorial text-[36px] sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.04] sm:leading-[1.05] my-2 sm:my-0 mb-4 sm:mb-5 drop-shadow-[0_12px_40px_rgba(0,0,0,1)]">
                  The War No One Was{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eab308] via-[#22c55e] to-[#ef4444]">
                    Supposed to Win
                  </span>
                </h1>

                {/* Subtitle: Clean editorial lead on mobile; full boxed backdrop on desktop */}
                <div className="max-w-2xl mx-auto mb-5 sm:mb-7 px-3 py-2 sm:px-6 sm:py-4 bg-[#08090c]/85 sm:bg-[#08090c]/95 border-l-2 border-[#eab308] sm:border sm:border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.98)]">
                  <p className="text-[13px] sm:text-xl md:text-2xl text-slate-200 sm:text-white leading-relaxed font-medium sm:font-semibold">
                    {hero.subtitle}
                  </p>
                </div>

                {/* Desktop-Only Stat Pills (hidden on mobile to prevent stacked-box clutter) */}
                <div className="hidden sm:flex flex-wrap items-center justify-center gap-3 text-xs font-mono tracking-[0.14em] text-white uppercase">
                  <span className="border border-[#eab308] bg-[#08090c] px-3 py-1 text-[#eab308] font-bold shadow-lg">
                    $1T+ Public Wealth Burned
                  </span>
                  <span className="border border-[#ef4444] bg-[#08090c] px-3 py-1 text-[#ef4444] font-bold shadow-lg">
                    Alcohol Harm Score: 72
                  </span>
                  <span className="border border-[#22c55e] bg-[#08090c] px-3 py-1 text-[#22c55e] font-bold shadow-lg">
                    Portugal Law 30/2000
                  </span>
                </div>

                <div className="mt-3 sm:mt-8 flex flex-col items-center gap-1.5 text-slate-300">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 sm:bg-[#08090c] sm:border sm:border-[#eab308]/60 font-mono text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#eab308] sm:text-white font-bold">
                    Scroll to Declassify Dossier
                  </span>
                  <div className="w-[1px] h-5 sm:h-9 bg-gradient-to-b from-[#eab308] to-transparent" />
                </div>
              </div>
            </div>

            {/* LAYER 2: 3 Sequenced Graphic-Novel Cold-Open Exhibits */}
            <div
              style={{
                opacity: stageOpacity,
                pointerEvents: stageOpacity > 0.15 ? 'auto' : 'none',
              }}
              className="seq-layer absolute inset-0 z-20 flex items-start lg:items-center justify-center px-2.5 sm:px-6 pt-16 pb-2 lg:py-0"
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-6 items-center">
                {/* Left Column: 3-Way Crossfading Forensic Artwork Frame (Compact on mobile so card fits cleanly) */}
                <div className="lg:col-span-7">
                  <div className="relative w-full aspect-[16/9] max-h-[135px] sm:max-h-[260px] lg:max-h-none border border-slate-800 bg-[#08090c] shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden">
                    <img
                      src={hero.image}
                      alt="Exhibit 01: The Half-Century Siege"
                      style={{ opacity: img1Opacity }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src={hero.burnImage}
                      alt="Exhibit 02: Cheaper, Purer, Deadlier"
                      style={{ opacity: img2Opacity }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src={hero.kpiImage || hero.burnImage}
                      alt="Exhibit 03: When Failure Is the Objective"
                      style={{ opacity: img3Opacity }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Top Telemetry Overlay Bar */}
                    <div className="absolute top-0 inset-x-0 flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-b from-[#0a0b0e]/95 to-transparent font-mono text-[8.5px] sm:text-[11px]">
                      <span className="text-white font-bold uppercase tracking-wider sm:tracking-widest truncate pr-2">
                        {img3Opacity > 0.5
                          ? 'EXHIBIT 03 • $650B+ CARTEL VALUATION'
                          : img2Opacity > 0.5
                            ? 'EXHIBIT 02 • -81% PRICE / +190% POTENCY'
                            : 'EXHIBIT 01 • FIFTY-YEAR FISCAL BURN'}
                      </span>
                      <span className="px-1.5 sm:px-2 py-0.5 bg-[#08090c] border border-[#ef4444]/80 text-[#ef4444] font-bold shrink-0">
                        ${tickerValue.toLocaleString()}+ BURNED
                      </span>
                    </div>

                    {/* Bottom Citation Bar */}
                    <div className="absolute bottom-0 inset-x-0 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#08090c]/95 border-t border-slate-800/80 font-mono text-[8px] sm:text-[10px] text-slate-300 truncate">
                      {hero.citation}
                    </div>
                  </div>
                </div>

                {/* Right Column: 3 Sequenced Dossier Stamp Cards with Live Scroll-Animated Metrics */}
                <div className="lg:col-span-5 grid grid-cols-1 items-start md:items-center">
                  {hero.cards.map((card, idx) => {
                    const env = getCardEnvelope(
                      progress,
                      card.start,
                      card.end,
                      idx === 0,
                      idx === hero.cards.length - 1
                    );

                    // Scroll-driven progress inside each card's active window (0 -> 1)
                    const cardProgress = clamp(
                      remap(
                        progress,
                        card.start + 0.02,
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

                    // Animated live metric counter text per card
                    let animatedMetricText = card.metricValue;
                    if (idx === 0) {
                      const burnVal = Math.round(
                        remap(cardProgress, 0, 1, 150000000000, 1000000000000)
                      );
                      animatedMetricText = `$${burnVal.toLocaleString()}+`;
                    } else if (idx === 1) {
                      const priceDrop = Math.round(
                        remap(cardProgress, 0, 1, 10, 81)
                      );
                      const potencyGain = Math.round(
                        remap(cardProgress, 0, 1, 20, 190)
                      );
                      animatedMetricText = `-${priceDrop}% Price • +${potencyGain}% Potency`;
                    } else if (idx === 2) {
                      const cartelB = Math.round(
                        remap(cardProgress, 0, 1, 80, 650)
                      );
                      animatedMetricText = `$${cartelB}B+ Annual Turnover`;
                    }

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
                          variant="stamp"
                          label={hero.kicker}
                          stamp={card.stamp}
                          accent={card.accent}
                        >
                          <h2 className="text-base sm:text-2xl font-extrabold text-[#e2e8f0] leading-snug mb-1.5 sm:mb-2.5">
                            {card.headline}
                          </h2>
                          <p className="text-xs sm:text-base text-slate-300 leading-snug sm:leading-relaxed mb-2 sm:mb-3">
                            {card.body}
                          </p>
                          {card.punchline && (
                            <p className="text-xs sm:text-base font-extrabold text-[#eab308] border-l-2 border-[#eab308] pl-2.5 sm:pl-3 py-0.5 sm:py-1 mb-2 sm:mb-3">
                              {card.punchline}
                            </p>
                          )}

                          {/* Scroll-Animated KPI Bar & Counter per Card */}
                          <div className="pt-2 sm:pt-3 border-t border-slate-800/90 space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between gap-2 font-mono text-[9.5px] sm:text-xs">
                              <span className="text-slate-400 truncate">
                                {card.metricLabel}
                              </span>
                              <span
                                style={{ color: card.accent }}
                                className="font-black tabular-nums shrink-0"
                              >
                                {animatedMetricText}
                              </span>
                            </div>
                            <div className="w-full h-2 sm:h-2.5 bg-[#08090c] border border-slate-800 overflow-hidden">
                              <div
                                style={{
                                  width: `${animatedBarWidth}%`,
                                  backgroundColor: card.accent,
                                }}
                                className="h-full"
                              />
                            </div>
                          </div>
                        </DossierCard>
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
