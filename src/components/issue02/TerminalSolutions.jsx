import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';

export default function TerminalSolutions({ data }) {
  const [manualIndex, setManualIndex] = useState(null);
  const propositions = data.propositions;

  return (
    <PinnedStage id="beat-4" heightMultiplier={4.8}>
      {(progress) => {
        // Scroll-driven default index across 3 propositions, overridable by user click
        const scrollIndex =
          progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
        const activeIdx = manualIndex !== null ? manualIndex : scrollIndex;
        const activeProp = propositions[activeIdx];

        // Per-proposal bar fill animates to 100% during its dwell plateau
        const barFills = [
          clamp(remap(progress, 0.03, 0.26, 0, 1), 0, 1),
          clamp(remap(progress, 0.36, 0.59, 0, 1), 0, 1),
          clamp(remap(progress, 0.69, 0.92, 0, 1), 0, 1),
        ];
        const barFill =
          manualIndex !== null ? 1 : barFills[activeIdx];

        return (
          <div className="relative w-full h-full bg-[#121316] text-[#e2e8f0] overflow-hidden flex flex-col justify-center px-4 sm:px-6 pt-16 pb-4">
            {/* Full-Bleed Animated Artwork Backdrop Matching Active Proposal */}
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-28 transition-all duration-500 scale-105"
              style={{
                backgroundImage: `url('${activeProp.image}')`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 65% 45%, rgba(18,19,22,0.68) 0%, rgba(18,19,22,0.94) 80%)',
              }}
            />

            {/* Subtle Cyberpunk Linework Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto">
              {/* Compact Header with Safe Top Clearance Below Masthead */}
              <div className="mb-3 sm:mb-4 border-b border-slate-800/90 pb-2.5">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#e2e8f0] tracking-tight leading-tight">
                  {data.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6 items-stretch">
                {/* LEFT SIDE: 3-Col Horizontal Selector on Mobile, Vertical Stack on Desktop */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-2 sm:gap-2.5">
                  <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2 sm:gap-2.5 flex-1">
                    {propositions.map((prop, idx) => {
                      const isSelected = idx === activeIdx;
                      return (
                        <button
                          key={prop.id}
                          type="button"
                          onClick={() => setManualIndex(idx)}
                          style={{
                            borderColor: isSelected ? prop.accent : '#1e293b',
                          }}
                          className="group relative text-left p-2.5 sm:p-4 border overflow-hidden transition-all duration-200 hover:border-slate-500 focus:outline-none cursor-pointer flex-1 flex flex-col justify-between min-h-[64px] sm:min-h-[82px] lg:min-h-[96px]"
                        >
                          {/* Matching Artwork Texture Inside Each Tab */}
                          <div
                            className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{
                              backgroundImage: `url('${prop.image}')`,
                              opacity: isSelected ? 0.38 : 0.2,
                            }}
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background: isSelected
                                ? `linear-gradient(90deg, rgba(15,17,21,0.92) 0%, rgba(15,17,21,0.65) 100%)`
                                : `linear-gradient(90deg, rgba(15,17,21,0.95) 0%, rgba(15,17,21,0.78) 100%)`,
                            }}
                          />

                          <div className="relative z-10 flex items-center justify-between gap-1 font-mono text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.18em] uppercase">
                            <span
                              style={{
                                color: isSelected ? prop.accent : '#cbd5e1',
                              }}
                              className="font-bold truncate"
                            >
                              0{idx + 1}
                            </span>
                            <span
                              style={{
                                color: isSelected ? prop.accent : '#94a3b8',
                              }}
                              className="hidden sm:inline px-2 py-0.5 bg-[#0f1115]/85 border border-slate-800"
                            >
                              {isSelected ? 'ACTIVE' : 'VIEW ↗'}
                            </span>
                          </div>

                          <div className="relative z-10 text-xs sm:text-base md:text-lg font-bold text-[#e2e8f0] group-hover:text-white transition-colors leading-snug mt-1 line-clamp-2">
                            {prop.title}
                          </div>

                          {isSelected && (
                            <div
                              style={{ backgroundColor: prop.accent }}
                              className="absolute left-0 top-0 bottom-0 w-1 z-10"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border border-slate-800/80 bg-[#0f1115]/90 px-3 py-1.5 sm:py-2 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-slate-400">
                    <span>
                      {manualIndex !== null
                        ? 'MANUAL SELECTION ACTIVE'
                        : 'SCROLL OR TAP PROPOSAL TO INSPECT'}
                    </span>
                    {manualIndex !== null && (
                      <button
                        type="button"
                        onClick={() => setManualIndex(null)}
                        className="text-[#67e8f9] hover:underline uppercase cursor-pointer"
                      >
                        Resume Scroll Sync
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: Illustrated Radical Observation Panel */}
                <CyberPanel
                  accent={activeProp.accent}
                  className="lg:col-span-7 p-4 sm:p-5 md:p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Dedicated Animated Graphic-Novel Illustration for each Taboo Reality */}
                    {activeProp.image && (
                      <div className="relative w-full aspect-video max-h-[165px] sm:max-h-[210px] md:max-h-[235px] mb-3.5 border border-slate-800 bg-[#0f1115] overflow-hidden">
                        <img
                          src={activeProp.image}
                          alt={activeProp.title}
                          className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(18,19,22,0.72) 0%, transparent 55%)',
                          }}
                        />
                      </div>
                    )}

                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#e2e8f0] leading-snug mb-2">
                      {activeProp.title}
                    </h3>

                    <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed mb-4">
                      {activeProp.copy}
                    </p>
                  </div>

                  {/* Empirical Telemetry Bar */}
                  <div className="pt-2.5 border-t border-slate-800">
                    <div className="flex items-baseline justify-between gap-2 mb-1 font-mono">
                      <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                        {activeProp.metricLabel}
                      </span>
                      <span
                        style={{ color: activeProp.accent }}
                        className="text-xs sm:text-sm font-extrabold tabular-nums"
                      >
                        {activeProp.metricValue}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden mb-1.5">
                      <div
                        style={{
                          width: `${Math.round(activeProp.barPercent * barFill)}%`,
                          backgroundColor: activeProp.accent,
                        }}
                        className="h-full transition-all duration-150"
                      />
                    </div>
                    <p className="font-mono text-[10px] text-slate-400">
                      {activeProp.citation}
                    </p>
                  </div>
                </CyberPanel>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
