import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { getCardEnvelope, clamp, remap } from '../../utils/math';

export default function AlcoholParadoxSection({ data }) {
  // 'total' | 'harmToOthers' | 'harmToUser' | null (auto-driven by scroll)
  const [manualMode, setManualMode] = useState(null);

  return (
    <PinnedStage id="alcohol-paradox" heightMultiplier={3.8}>
      {(progress) => {
        // Scroll steps cleanly across all 3 Lancet modes: Combined -> Harm to Society -> Harm to User
        const autoMode =
          progress < 0.34
            ? 'total'
            : progress < 0.67
              ? 'harmToOthers'
              : 'harmToUser';

        const activeMode = manualMode || autoMode;
        const barReveal = clamp(remap(progress, 0.03, 0.25, 0.35, 1), 0.35, 1);

        // Dynamically sort substances from most harmful to least harmful for the active metric
        const sortedSubstances = [...data.substances].sort((a, b) => {
          const valA =
            activeMode === 'harmToOthers'
              ? a.harmToOthers
              : activeMode === 'harmToUser'
                ? a.harmToUser
                : a.total;
          const valB =
            activeMode === 'harmToOthers'
              ? b.harmToOthers
              : activeMode === 'harmToUser'
                ? b.harmToUser
                : b.total;
          if (valB !== valA) return valB - valA;
          return b.total - a.total;
        });

        // Crossfade between alcohol-paradox.webp and stadium-excise.webp on Card 2
        const showStadium = progress >= 0.32 && progress < 0.68;

        return (
          <div className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            {/* Subtle Forensic Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-16 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-6 items-start md:items-center">
              {/* LEFT COLUMN: Sequenced Artwork Window + 3 Dossier Cards */}
              <div className="md:col-span-5 flex flex-col gap-3 order-2 md:order-1">
                {/* Crossfading Transition Artwork Window */}
                <div className="hidden md:block relative w-full aspect-[16/9] max-h-[175px] overflow-hidden border border-slate-800 bg-[#08090c] shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
                  <img
                    src={data.image}
                    alt={data.title}
                    style={{ opacity: showStadium ? 0 : 0.92 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <img
                    src={data.stadiumImage || data.image}
                    alt="Stadium Beer Sponsorship vs Emergency Room"
                    style={{ opacity: showStadium ? 0.92 : 0 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#0a0b0e]/90 border border-[#eab308]/50 font-mono text-[9px] text-[#eab308] uppercase">
                    {showStadium
                      ? 'Societal Collateral • Stadiums & ER Wards'
                      : 'Top-Shelf Excise Tax vs. Schedule I Felony'}
                  </div>
                </div>

                {/* 3 Sequenced Narrative Cards in Flow-Aware CSS Grid */}
                <div className="grid grid-cols-1 items-start md:items-center">
                  {data.cards.map((card, idx) => {
                    const env = getCardEnvelope(
                      progress,
                      card.start,
                      card.end,
                      idx === 0,
                      idx === data.cards.length - 1
                    );

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
                          variant="clip"
                          label={data.title}
                          stamp={card.metric}
                          accent={card.accent}
                        >
                          <h3 className="text-sm sm:text-xl font-extrabold text-[#e2e8f0] mb-1 sm:mb-2 leading-snug">
                            {card.headline}
                          </h3>
                          <p className="text-[11px] sm:text-sm text-slate-300 leading-snug sm:leading-relaxed mb-1.5 sm:mb-3">
                            {card.body}
                          </p>
                          <div className="pt-1 sm:pt-2 border-t border-slate-800/80 font-mono text-[8.5px] sm:text-[9px] text-slate-400 leading-tight">
                            {card.citation}
                          </div>
                        </DossierCard>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive David Nutt Lancet 16-Criteria Harm Matrix */}
              <div className="md:col-span-7 order-1 md:order-2">
                <DossierCard
                  variant="stamp"
                  label={data.kicker}
                  stamp={
                    activeMode === 'harmToUser'
                      ? 'VIEWING: HARM TO USER'
                      : activeMode === 'harmToOthers'
                        ? 'VIEWING: HARM TO SOCIETY'
                        : 'VIEWING: COMBINED HARM (72)'
                  }
                  accent={
                    activeMode === 'harmToUser'
                      ? '#ef4444'
                      : activeMode === 'harmToOthers'
                        ? '#eab308'
                        : '#22c55e'
                  }
                >
                  {/* Mode Selector Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 pb-1.5 mb-1.5 sm:pb-2.5 sm:mb-2.5 border-b border-slate-800">
                    <span className="font-mono text-[9px] sm:text-xs text-[#eab308] font-bold uppercase tracking-wider">
                      THE LANCET 16-CRITERIA HARM MATRIX
                    </span>
                    <div className="flex items-center gap-1">
                      {[
                        {
                          id: 'total',
                          label: 'Combined (0–100)',
                          color: '#22c55e',
                        },
                        {
                          id: 'harmToOthers',
                          label: 'Harm to Society',
                          color: '#eab308',
                        },
                        {
                          id: 'harmToUser',
                          label: 'Harm to User',
                          color: '#ef4444',
                        },
                      ].map((tab) => {
                        const isSelected = activeMode === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setManualMode(tab.id)}
                            style={
                              isSelected
                                ? {
                                    borderColor: tab.color,
                                    color: tab.color,
                                    backgroundColor: `${tab.color}22`,
                                  }
                                : undefined
                            }
                            className={`px-1.5 py-0.5 sm:px-2 sm:py-1 font-mono text-[8px] sm:text-[10px] uppercase transition-colors cursor-pointer border ${
                              isSelected
                                ? 'font-extrabold'
                                : 'border-slate-800 bg-[#0a0b0e] text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                      {manualMode !== null && (
                        <button
                          type="button"
                          onClick={() => setManualMode(null)}
                          className="ml-1 font-mono text-[8px] sm:text-[9px] text-[#22c55e] underline cursor-pointer"
                        >
                          Auto
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-Bar Harm Comparison Chart (Sorted Descending by Active Harm Score) */}
                  <div className="space-y-0.5 sm:space-y-2">
                    {sortedSubstances.map((s, rankIdx) => {
                      const maxScale =
                        activeMode === 'harmToOthers'
                          ? 50
                          : activeMode === 'harmToUser'
                            ? 45
                            : 80;

                      const userWidthPct = Math.min(
                        100,
                        Math.round((s.harmToUser / maxScale) * 100 * barReveal)
                      );
                      const othersWidthPct = Math.min(
                        100,
                        Math.round(
                          (s.harmToOthers / maxScale) * 100 * barReveal
                        )
                      );

                      return (
                        <div key={s.name} className="space-y-0 sm:space-y-0.5">
                          <div className="flex items-center justify-between text-[9px] sm:text-xs font-mono leading-tight">
                            <div className="flex items-center gap-1.5 sm:gap-2 truncate pr-2">
                              <span className="text-slate-500 text-[8.5px] sm:text-[9.5px] font-bold w-3.5 sm:w-4 shrink-0">
                                #{rankIdx + 1}
                              </span>
                              <span className="text-[#e2e8f0] font-semibold truncate">
                                {s.name}
                              </span>
                              <span
                                style={{
                                  borderColor: `${s.statusColor}55`,
                                  color: s.statusColor,
                                }}
                                className="hidden sm:inline-block px-1.5 py-0.2 border text-[8.5px] uppercase tracking-wider bg-[#0a0b0e]"
                              >
                                {s.legalStatus}
                              </span>
                            </div>

                            {/* Dynamic Score Breakdown Label */}
                            <div className="font-mono text-[9px] sm:text-xs tabular-nums shrink-0 flex items-center gap-1.5">
                              {activeMode === 'total' && (
                                <>
                                  <span className="hidden sm:inline text-[9.5px] text-[#ef4444]">
                                    User: {s.harmToUser}
                                  </span>
                                  <span className="hidden sm:inline text-slate-600">
                                    +
                                  </span>
                                  <span className="hidden sm:inline text-[9.5px] text-[#eab308]">
                                    Society: {s.harmToOthers}
                                  </span>
                                  <span className="font-black text-[#e2e8f0]">
                                    = {s.total} pts
                                  </span>
                                </>
                              )}
                              {activeMode === 'harmToOthers' && (
                                <span className="font-black text-[#eab308]">
                                  Society: {s.harmToOthers} pts
                                </span>
                              )}
                              {activeMode === 'harmToUser' && (
                                <span className="font-black text-[#ef4444]">
                                  User: {s.harmToUser} pts
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Distinctly Colored Stacked / Isolated Bar Track */}
                          <div className="w-full h-1.5 sm:h-3 bg-[#08090c] border border-slate-800/90 overflow-hidden flex">
                            {activeMode === 'total' && (
                              <>
                                {/* Harm to User segment in Vermilion (#ef4444) */}
                                <div
                                  style={{
                                    width: `${userWidthPct}%`,
                                    backgroundColor: '#ef4444',
                                  }}
                                  className="h-full"
                                  title={`Harm to User: ${s.harmToUser} pts`}
                                />
                                {/* Harm to Others segment in Acid Amber (#eab308) */}
                                <div
                                  style={{
                                    width: `${othersWidthPct}%`,
                                    backgroundColor: '#eab308',
                                  }}
                                  className="h-full border-l border-[#0a0b0e]"
                                  title={`Harm to Society: ${s.harmToOthers} pts`}
                                />
                              </>
                            )}
                            {activeMode === 'harmToOthers' && (
                              <div
                                style={{
                                  width: `${othersWidthPct}%`,
                                  backgroundColor: '#eab308',
                                }}
                                className="h-full"
                              />
                            )}
                            {activeMode === 'harmToUser' && (
                              <div
                                style={{
                                  width: `${userWidthPct}%`,
                                  backgroundColor: '#ef4444',
                                }}
                                className="h-full"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Color Legend & Empirical Citation */}
                  <div className="mt-1.5 pt-1 sm:mt-3 sm:pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-1 sm:gap-2 font-mono text-[8px] sm:text-[10px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[#ef4444] font-bold">
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#ef4444] inline-block" />
                        Harm to User
                        <span className="hidden sm:inline">(Direct Toxicology)</span>
                      </span>
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[#eab308] font-bold">
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#eab308] inline-block" />
                        Harm to Society
                        <span className="hidden sm:inline">(Collateral)</span>
                      </span>
                    </div>
                    <span className="text-slate-400">
                      Most → Least Harmful
                    </span>
                  </div>
                  <div className="hidden sm:block mt-1 font-mono text-[9.5px] text-slate-400">
                    {data.citation}
                  </div>
                </DossierCard>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
