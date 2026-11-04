import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { getCardEnvelope, clamp, remap } from '../../utils/math';

export default function PortugalDossierSection({ data }) {
  // null = scroll-driven step (0, 1, 2), or manual step index
  const [manualStep, setManualStep] = useState(null);

  return (
    <PinnedStage id="portugal-blueprint" heightMultiplier={6.0}>
      {(progress) => {
        // 3 clean sequenced scroll stages with dedicated scroll plateaus for all 3 steps of Stage 1:
        // Stage 0 (0.00 - 0.54): The 3-Step Dissuasion Commission Flow
        //   - Step 01 (0.00 - 0.18): 01 • POLICE INTERCEPTION
        //   - Step 02 (0.18 - 0.36): 02 • THE DISSUASION PANEL
        //   - Step 03 (0.36 - 0.54): 03 • BUDGET REALLOCATION (Health Infrastructure Replaces Cages)
        // Stage 1 (0.54 - 0.78): The 20-Year Statistical Outcome Ledger (-90% HIV, ~6/1M Overdose, -65% Incarceration)
        // Stage 2 (0.78 - 1.00): The 3 Pragmatic Policy Pillars (with sunlit positive civic-renewal.webp illustration)
        const autoStep =
          progress < 0.18 ? 0 : progress < 0.36 ? 1 : 2;
        const activeStep = manualStep !== null ? manualStep : autoStep;
        const currentStepData = data.steps[activeStep] || data.steps[0];

        // Sub-progress bar inside Stage 0 showing the 3 steps advancing automatically on scroll
        const step0Fill = clamp(remap(progress, 0.0, 0.18, 0, 100), 0, 100);
        const step1Fill = clamp(remap(progress, 0.18, 0.36, 0, 100), 0, 100);
        const step2Fill = clamp(remap(progress, 0.36, 0.52, 0, 100), 0, 100);
        const stepFills = [step0Fill, step1Fill, step2Fill];

        const stage0Env = getCardEnvelope(progress, 0.0, 0.54, true, false, 0.04);
        const stage1Env = getCardEnvelope(progress, 0.54, 0.78, false, false, 0.04);
        const stage2Env = getCardEnvelope(progress, 0.78, 1.0, false, true, 0.04);

        const activeArtStage =
          progress < 0.52 ? 0 : progress < 0.76 ? 1 : 2;

        return (
          <div className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            {/* Architectural Blueprint Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #eab308 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-13 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-6 items-start md:items-center">
              {/* LEFT COLUMN: 3-Way Crossfading Architectural & Civic Renewal Artwork Frame */}
              <div className="md:col-span-5">
                <div className="relative w-full aspect-[16/9] md:aspect-[4/3] max-h-[125px] sm:max-h-[340px] border border-slate-800 bg-[#08090c] shadow-[0_24px_60px_rgba(0,0,0,0.92)] overflow-hidden">
                  {/* Stage 0 Image: Lisbon Dissuasion Commission Model */}
                  <img
                    src={data.image}
                    alt={data.title}
                    style={{ opacity: activeArtStage === 0 ? 0.94 : 0 }}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />
                  {/* Stage 1 Image: 20-Year Statistical Outcomes & Clinical Outreach */}
                  <img
                    src={data.outreachImage || data.image}
                    alt="Lisbon Mobile Health Outreach & 20-Year Statistical Drop"
                    style={{ opacity: activeArtStage === 1 ? 0.94 : 0 }}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />
                  {/* Stage 2 Image: Positive Sunlit Civic Renewal & Community Health Plaza */}
                  <img
                    src={data.pillarsImage || data.image}
                    alt="Pragmatic Governance Architecture: Sunlit Community Health & Recovery Plaza"
                    style={{ opacity: activeArtStage === 2 ? 0.96 : 0 }}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />

                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#0a0b0e]/92 border border-[#22c55e]/60 font-mono text-[9px] sm:text-[10px] font-bold text-[#22c55e] uppercase tracking-wider">
                    {activeArtStage === 2
                      ? 'PUBLIC HEALTH TRIUMPH • CIVIC RENEWAL'
                      : activeArtStage === 1
                        ? 'SICAD & EMCDDA • 20-YEAR OUTCOMES'
                        : `LAW 30/2000 • STEP 0${activeStep + 1} OF 03`}
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/90 to-transparent">
                    <div className="font-mono text-[9.5px] text-[#eab308] uppercase font-bold mb-0.5">
                      {data.kicker}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#e2e8f0] leading-snug">
                      {data.subtitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 3 Sequenced Scroll Stages in Non-Overlapping CSS Grid */}
              <div className="md:col-span-7 grid grid-cols-1 items-start md:items-center">
                {/* STAGE 1: Decriminalisation & The 3-Step Dissuasion Commission */}
                <div
                  style={{
                    opacity: stage0Env.opacity,
                    transform: `translate3d(0, ${stage0Env.y}px, 0)`,
                    pointerEvents: stage0Env.opacity > 0.2 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <DossierCard
                    variant="clip"
                    label="Law 30/2000 • Administrative Health Referral"
                    stamp={`STEP 0${activeStep + 1} OF 03`}
                    accent="#22c55e"
                  >
                    <p className="text-xs sm:text-base text-slate-300 leading-relaxed mb-3">
                      {data.leadParagraph}
                    </p>

                    {/* 3 Interactive + Scroll-Driven Step Tabs with Live Scroll Fill Bars */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2.5">
                      {data.steps.map((s, idx) => {
                        const isActive = activeStep === idx;
                        const fillPct =
                          manualStep !== null
                            ? isActive
                              ? 100
                              : 0
                            : stepFills[idx];

                        return (
                          <button
                            key={s.code}
                            type="button"
                            onClick={() => setManualStep(idx)}
                            className={`relative p-2 sm:p-2.5 text-left transition-all border cursor-pointer overflow-hidden ${
                              isActive
                                ? 'border-[#eab308] bg-[#eab308]/15 text-white shadow-[0_0_20px_rgba(234,179,8,0.18)]'
                                : 'border-slate-800 bg-[#0a0b0e] text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-[8.5px] sm:text-[10px] font-mono font-bold tracking-wider truncate">
                              {s.label}
                            </div>
                            {/* Scroll-Driven Progress Indicator Track inside each Step Button */}
                            <div className="w-full h-1 bg-slate-900 mt-1.5 overflow-hidden">
                              <div
                                style={{
                                  width: `${fillPct}%`,
                                  backgroundColor: isActive
                                    ? '#eab308'
                                    : '#22c55e',
                                }}
                                className="h-full transition-all duration-75"
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Step Detail Card */}
                    <div className="p-3 sm:p-4 bg-[#0a0b0e] border border-[#eab308]/50 relative">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[9.5px] sm:text-[10px] font-extrabold text-[#22c55e] uppercase tracking-wider">
                          {currentStepData.label}
                        </span>
                        {manualStep !== null ? (
                          <button
                            type="button"
                            onClick={() => setManualStep(null)}
                            className="font-mono text-[9px] text-[#eab308] underline cursor-pointer"
                          >
                            Resume Auto-Scroll
                          </button>
                        ) : (
                          <span className="font-mono text-[8.5px] text-slate-400 uppercase">
                            Scroll Advances Steps 01 → 03
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-lg font-extrabold text-[#eab308] mb-1">
                        {currentStepData.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {currentStepData.desc}
                      </p>
                    </div>
                  </DossierCard>
                </div>

                {/* STAGE 2: The 20-Year Statistical Outcome Ledger */}
                <div
                  style={{
                    opacity: stage1Env.opacity,
                    transform: `translate3d(0, ${stage1Env.y}px, 0)`,
                    pointerEvents: stage1Env.opacity > 0.2 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <DossierCard
                    variant="stamp"
                    label="20-Year Empirical Outcomes (1999 vs. Post-Reform)"
                    stamp="SICAD & EMCDDA VERIFIED"
                    accent="#eab308"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2.5 mb-2 sm:mb-3">
                      {data.outcomes.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 sm:p-3 bg-[#0a0b0e] border border-slate-800/90 flex flex-col justify-between"
                        >
                          <div className="flex sm:block items-baseline justify-between gap-2">
                            <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono mb-0.5 sm:mb-1">
                              {item.metric}
                            </div>
                            <div className="text-sm sm:text-2xl font-black font-mono text-[#22c55e] mb-0.5 sm:mb-1 shrink-0">
                              {item.drop}
                            </div>
                          </div>
                          <div className="text-[8.5px] sm:text-[10px] font-mono text-slate-400 mb-1 sm:mb-2">
                            Was: {item.before} • Now:{' '}
                            <span className="text-[#e2e8f0] font-bold">
                              {item.after}
                            </span>
                          </div>
                          <p className="text-[9.5px] sm:text-xs text-slate-300 border-t border-slate-800/80 pt-1 sm:pt-2 leading-snug">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 font-mono text-[9px] sm:text-[10px] text-slate-400">
                      {data.citation}
                    </div>
                  </DossierCard>
                </div>

                {/* STAGE 3: The 3 Pragmatic Policy Pillars */}
                <div
                  style={{
                    opacity: stage2Env.opacity,
                    transform: `translate3d(0, ${stage2Env.y}px, 0)`,
                    pointerEvents: stage2Env.opacity > 0.2 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <DossierCard
                    variant="broadsheet"
                    label="Pragmatic Governance Architecture"
                    stamp="HEALTH OVER HANDCUFFS"
                    accent="#22c55e"
                  >
                    <div className="space-y-2.5 mb-3.5">
                      {data.pillars.map((p) => (
                        <div
                          key={p.code}
                          className="p-2.5 sm:p-3 bg-[#0a0b0e] border border-slate-800/90"
                        >
                          <div className="flex items-center gap-2 font-mono text-xs font-extrabold mb-1">
                            <span style={{ color: p.accent }}>{p.code}.</span>
                            <span className="text-[#e2e8f0] uppercase">
                              {p.title}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                            {p.copy}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs sm:text-base text-[#22c55e] font-bold border-l-2 border-[#22c55e] pl-3 py-0.5 leading-snug">
                      {data.closingParagraph}
                    </p>
                  </DossierCard>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
