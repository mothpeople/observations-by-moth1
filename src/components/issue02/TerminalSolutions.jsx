import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';

export default function TerminalSolutions({ data }) {
  const [manualIndex, setManualIndex] = useState(null);
  const propositions = data.propositions;

  return (
    <PinnedStage id="beat-4" heightMultiplier={3.6}>
      {(progress) => {
        // Scroll-driven default index across 3 propositions, overridable by user click
        const scrollIndex =
          progress < 0.36 ? 0 : progress < 0.68 ? 1 : 2;
        const activeIdx = manualIndex !== null ? manualIndex : scrollIndex;
        const activeProp = propositions[activeIdx];
        const barFill = clamp(remap(progress, 0.08, 0.85, 0.65, 1), 0.65, 1);

        return (
          <div className="relative w-full h-full bg-[#0f1115] text-[#e2e8f0] overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-14 pb-6">
            {/* Cyberpunk Grid & Radial Glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-500"
              style={{
                background: `radial-gradient(circle at 70% 40%, ${activeProp.accent}12 0%, rgba(15,17,21,0.96) 75%)`,
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto">
              {/* Terminal Top Bar */}
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#c084fc] animate-pulse" />
                    <span className="font-mono text-[10px] tracking-[0.22em] text-[#c084fc] uppercase">
                      {data.tag} // INTERACTIVE TERMINAL SELECTOR
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e2e8f0] tracking-tight">
                    {data.title}
                  </h2>
                </div>
                <p className="max-w-md text-xs sm:text-sm text-slate-400">
                  {data.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
                {/* LEFT SELECTOR MENU: 3 Radical Propositions */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
                  {propositions.map((prop, idx) => {
                    const isSelected = idx === activeIdx;
                    return (
                      <button
                        key={prop.id}
                        type="button"
                        onClick={() => setManualIndex(idx)}
                        style={{
                          borderColor: isSelected ? prop.accent : '#1e293b',
                          backgroundColor: isSelected
                            ? `${prop.accent}14`
                            : 'rgba(18,19,22,0.88)',
                        }}
                        className="group relative text-left p-4 sm:p-5 border transition-all duration-200 hover:border-slate-600 focus:outline-none"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[10px] tracking-[0.2em] uppercase">
                          <span
                            style={{
                              color: isSelected ? prop.accent : '#94a3b8',
                            }}
                            className="font-bold"
                          >
                            PROPOSITION // {prop.code}
                          </span>
                          <span
                            style={{
                              color: isSelected ? prop.accent : '#475569',
                            }}
                          >
                            {prop.status}
                          </span>
                        </div>

                        <div className="text-base sm:text-lg font-bold text-[#e2e8f0] group-hover:text-white transition-colors">
                          {prop.code}: {prop.title}
                        </div>

                        {isSelected && (
                          <div
                            style={{ backgroundColor: prop.accent }}
                            className="absolute left-0 top-0 bottom-0 w-1"
                          />
                        )}
                      </button>
                    );
                  })}

                  <div className="border border-slate-800/80 bg-[#121316]/80 px-3.5 py-2.5 flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>
                      MODE: {manualIndex !== null ? 'MANUAL OVERRIDE' : 'SCROLL SYNC'}
                    </span>
                    {manualIndex !== null && (
                      <button
                        type="button"
                        onClick={() => setManualIndex(null)}
                        className="text-[#67e8f9] hover:underline uppercase"
                      >
                        [Reset to Scroll]
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT TERMINAL OUTPUT PANEL */}
                <CyberPanel
                  tag={`[TERMINAL // PROP_${activeProp.code}]`}
                  accent={activeProp.accent}
                  className="lg:col-span-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
                      <span
                        style={{ color: activeProp.accent }}
                        className="font-mono text-xs uppercase tracking-[0.2em] font-bold"
                      >
                        &gt; {activeProp.code}: {activeProp.title}
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300">
                        {activeProp.status}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#e2e8f0] leading-snug mb-3">
                      {activeProp.headline}
                    </h3>

                    <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                      {activeProp.argument}
                    </p>

                    <div
                      style={{ borderColor: activeProp.accent }}
                      className="border-l-2 bg-[#121316]/90 p-3.5 mb-5"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">
                        STRUCTURAL POLICY SHIFT
                      </div>
                      <p className="text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
                        {activeProp.policyShift}
                      </p>
                    </div>
                  </div>

                  {/* Empirical Telemetry Bar */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-baseline justify-between gap-2 mb-1.5 font-mono">
                      <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                        {activeProp.metricLabel}
                      </span>
                      <span
                        style={{ color: activeProp.accent }}
                        className="text-sm sm:text-base font-extrabold tabular-nums"
                      >
                        {activeProp.metricValue}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 border border-slate-800 overflow-hidden mb-2.5">
                      <div
                        style={{
                          width: `${Math.round(activeProp.barPercent * barFill)}%`,
                          backgroundColor: activeProp.accent,
                        }}
                        className="h-full transition-all duration-300"
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
