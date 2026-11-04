import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { getCardEnvelope } from '../../utils/math';

export default function RemedyWeaponSection({ data }) {
  // null = scroll-driven (0 -> 1 -> 2 -> 3 -> 4 life domains locked out), or boolean override
  const [manualStamped, setManualStamped] = useState(null);

  return (
    <PinnedStage id="remedy-weapon" heightMultiplier={4.8}>
      {(progress) => {
        // Hold all 4 domains CLEAN (green titles only) from 0.00 -> 0.34,
        // then progressively stamp GUILTY across each of the 4 domains one-by-one as the user scrolls:
        // 0.34 -> 0.45: Domain 1 locked (Employment)
        // 0.45 -> 0.56: Domain 2 locked (Housing)
        // 0.56 -> 0.67: Domain 3 locked (Education)
        // 0.67 -> 1.00: Domain 4 locked (Civic & Family Custody)
        const autoLockedCount =
          progress < 0.34
            ? 0
            : progress < 0.45
              ? 1
              : progress < 0.56
                ? 2
                : progress < 0.67
                  ? 3
                  : 4;

        const lockedCount =
          manualStamped === true
            ? 4
            : manualStamped === false
              ? 0
              : autoLockedCount;
        const isStamped = lockedCount > 0;

        return (
          <div className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden flex items-center justify-center">
            {/* Forensic Evidence Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ef4444 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-12 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center">
              {/* LEFT COLUMN: 3 Sequenced Narrative Cards + Crossfading Artwork */}
              <div className="md:col-span-5 flex flex-col gap-3 order-2 md:order-1">
                {/* Crossfading Transition Artwork Window */}
                <div className="hidden md:block relative w-full aspect-[16/9] max-h-[175px] overflow-hidden border border-slate-800 bg-[#08090c] shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
                  <img
                    src={data.image}
                    alt={data.title}
                    style={{
                      opacity: lockedCount > 0 && lockedCount < 4 ? 0 : 0.9,
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />
                  <img
                    src={data.cellImage || data.image}
                    alt="Statutory Lockout & Holding Cell"
                    style={{
                      opacity: lockedCount > 0 && lockedCount < 4 ? 0.9 : 0,
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  />

                  {isStamped && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0b0e]/45">
                      <div className="-rotate-6 border-2 border-[#ef4444] bg-[#0a0b0e]/95 px-3 py-1 shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                        <div className="font-mono text-xs sm:text-sm font-black tracking-[0.2em] text-[#ef4444] uppercase">
                          GUILTY • {lockedCount} / 4 DOMAINS BARRED
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3 Sequenced Narrative Cards */}
                <div className="grid grid-cols-1 items-start md:items-center">
                  {data.cards.map((card, idx) => {
                    const env = getCardEnvelope(
                      progress,
                      card.start,
                      card.end,
                      idx === 0,
                      idx === data.cards.length - 1,
                      0.05
                    );

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
                        <DossierCard
                          variant="stamp"
                          label={data.title}
                          stamp={card.metric}
                          accent={card.accent}
                        >
                          <h2 className="text-base sm:text-2xl font-extrabold text-[#e2e8f0] leading-snug mb-2">
                            {card.headline}
                          </h2>
                          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
                            {card.body}
                          </p>
                        </DossierCard>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive 4-Domain Statutory Background Check Dossier */}
              <div className="md:col-span-7 order-1 md:order-2">
                <DossierCard
                  variant="clip"
                  label={data.kicker}
                  stamp={
                    isStamped
                      ? `${lockedCount} / 4 LIFE PILLARS REVOKED`
                      : 'CLEAN RECORD • ALL PILLARS ELIGIBLE'
                  }
                  accent={isStamped ? '#ef4444' : '#22c55e'}
                >
                  {/* Dossier Header & Interactive Stamp Toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-800">
                    <div>
                      <div className="font-mono text-[9.5px] sm:text-[11px] text-slate-400 uppercase">
                        STATUTORY POSSESSION DOSSIER • LOW-LEVEL OFFENSE
                      </div>
                      <div className="text-xs sm:text-base font-bold text-[#e2e8f0]">
                        Collateral Consequences of a Criminal Record
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setManualStamped(!isStamped)}
                        className={`px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer border transition-colors ${
                          isStamped
                            ? 'border-[#22c55e] bg-[#22c55e]/15 text-[#22c55e]'
                            : 'border-[#ef4444] bg-[#ef4444]/20 text-[#ef4444]'
                        }`}
                      >
                        {isStamped
                          ? 'Preview Clean Record'
                          : 'Stamp Guilty Conviction'}
                      </button>
                      {manualStamped !== null && (
                        <button
                          type="button"
                          onClick={() => setManualStamped(null)}
                          className="font-mono text-[9px] text-[#eab308] underline cursor-pointer"
                        >
                          Auto
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4 Life-Domain Application Forms:
                      Starts with ONLY the clean green titles & status;
                      transitions to red with the full lockout text as scroll reaches each box */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                    {data.records.map((rec, idx) => {
                      const isDomainLocked = idx < lockedCount;

                      return (
                        <div
                          key={rec.id}
                          className={`relative p-2.5 sm:p-3.5 border transition-all duration-300 bg-[#0a0b0e] flex flex-col justify-center min-h-[78px] sm:min-h-[118px] ${
                            isDomainLocked
                              ? 'border-[#ef4444] bg-[#ef4444]/[0.06] shadow-[inset_0_0_24px_rgba(239,68,68,0.14)]'
                              : 'border-[#22c55e]/60 bg-[#22c55e]/[0.04]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 font-mono text-[8px] sm:text-[9.5px] mb-1">
                            <span
                              className={`truncate font-bold ${
                                isDomainLocked
                                  ? 'text-slate-300'
                                  : 'text-[#22c55e]'
                              }`}
                            >
                              {rec.domain}
                            </span>
                            <span
                              className={
                                isDomainLocked
                                  ? 'px-1 sm:px-1.5 py-0.5 bg-[#ef4444] text-white font-black shrink-0 uppercase'
                                  : 'px-1 sm:px-1.5 py-0.5 bg-[#22c55e]/20 border border-[#22c55e] text-[#22c55e] font-bold shrink-0 uppercase'
                              }
                            >
                              {isDomainLocked ? rec.stat : 'ELIGIBLE'}
                            </span>
                          </div>

                          <div
                            className={`font-mono text-[9.5px] sm:text-xs font-black uppercase truncate ${
                              isDomainLocked
                                ? 'text-[#ef4444] mb-1'
                                : 'text-[#22c55e]'
                            }`}
                          >
                            {isDomainLocked ? rec.afterStatus : rec.beforeStatus}
                          </div>

                          {/* Only reveal the punitive lockout consequence text when the scroll stamps this domain red */}
                          {isDomainLocked && (
                            <p className="text-[9.5px] sm:text-xs text-slate-200 leading-snug border-t border-[#ef4444]/30 pt-1.5 mt-0.5">
                              {rec.detail}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 font-mono text-[9px] sm:text-[10px] text-slate-400">
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
