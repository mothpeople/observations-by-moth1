import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { getCardEnvelope, clamp, remap } from '../../utils/math';

export default function RatParkSection({ data }) {
  // null = scroll-driven, or 'cage' | 'park'
  const [manualEnv, setManualEnv] = useState(null);

  return (
    <PinnedStage id="rat-park" heightMultiplier={4.0}>
      {(progress) => {
        // Scroll morphs from Solitary Wire Cage (0 -> 0.34) to Rat Park Colony (0.34 -> 0.67)
        // and transitions to Bureaucratic Malpractice artwork on Card 3 (0.67 -> 1.0)
        const autoMorph =
          manualEnv === 'cage'
            ? 0
            : manualEnv === 'park'
              ? 1
              : clamp(remap(progress, 0.24, 0.52, 0, 1), 0, 1);

        const isPark = autoMorph >= 0.5;
        const isMalpracticeStage = manualEnv === null && progress >= 0.65;
        const activeHabitat = isPark
          ? data.environments.park
          : data.environments.cage;

        // 3-way artwork crossfade:
        // Card 1 (0 -> 0.34): concrete-cell.webp
        // Card 2 (0.34 -> 0.67): rat-park.webp
        // Card 3 (0.67 -> 1.00): bureaucratic-malpractice.webp
        const malpracticeFade =
          manualEnv !== null
            ? 0
            : clamp(remap(progress, 0.63, 0.72, 0, 1), 0, 1);

        // Interpolated experimental metrics
        const spaceMultiple = Math.round(remap(autoMorph, 0, 1, 1, 200));
        const socialPct = Math.round(remap(autoMorph, 0, 1, 0, 100));
        const morphineMg = remap(autoMorph, 0, 1, 19.2, 1.8).toFixed(1);
        const overdosePct = Math.round(remap(autoMorph, 0, 1, 96, 4));

        return (
          <div className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            {/* Scientific Blueprint Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-16 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-6 items-start md:items-center">
              {/* LEFT COLUMN: Interactive Rat Park Environmental Morph Simulator */}
              <div className="md:col-span-7">
                <DossierCard
                  variant="clip"
                  label={data.kicker}
                  stamp={
                    isMalpracticeStage
                      ? 'HUMAN CAGES DEEPEN ALIENATION'
                      : isPark
                        ? '200x CONNECTED COLONY'
                        : '1x SOLITARY CAGE'
                  }
                  accent={
                    isMalpracticeStage
                      ? '#eab308'
                      : isPark
                        ? '#22c55e'
                        : '#ef4444'
                  }
                >
                  {/* Environment Toggle Header */}
                  <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 pb-1.5 mb-1.5 sm:pb-2.5 sm:mb-2.5 border-b border-slate-800">
                    <span className="font-mono text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                      SIMON FRASER UNIVERSITY • ENVIRONMENTAL TRIALS
                    </span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <button
                        type="button"
                        onClick={() => setManualEnv('cage')}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[8px] sm:text-[10px] uppercase cursor-pointer border transition-colors ${
                          !isPark
                            ? 'border-[#ef4444] bg-[#ef4444]/20 text-[#ef4444] font-bold'
                            : 'border-slate-800 bg-[#0a0b0e] text-slate-400'
                        }`}
                      >
                        Solitary Cage (1x)
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualEnv('park')}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[8px] sm:text-[10px] uppercase cursor-pointer border transition-colors ${
                          isPark
                            ? 'border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e] font-bold'
                            : 'border-slate-800 bg-[#0a0b0e] text-slate-400'
                        }`}
                      >
                        Rat Park Colony (200x)
                      </button>
                      {manualEnv !== null && (
                        <button
                          type="button"
                          onClick={() => setManualEnv(null)}
                          className="font-mono text-[8px] sm:text-[9px] text-[#eab308] underline cursor-pointer ml-1"
                        >
                          Auto
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 3-Stage Crossfading Habitat Artwork Window (Solitary Cage -> Rat Park -> Bureaucratic Malpractice) */}
                  <div className="relative w-full aspect-[16/9] max-h-[115px] sm:max-h-[240px] mb-1.5 sm:mb-3 overflow-hidden border border-slate-800 bg-[#08090c]">
                    <img
                      src={data.cellImage || data.image}
                      alt="Solitary Isolation Cage"
                      style={{
                        opacity: (1 - autoMorph) * (1 - malpracticeFade),
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src={data.image}
                      alt={data.title}
                      style={{
                        opacity: autoMorph * (1 - malpracticeFade),
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <img
                      src={data.malpracticeImage || data.cellImage}
                      alt="Bureaucratic Malpractice: Caging Alienated Citizens"
                      style={{
                        opacity: malpracticeFade,
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div
                      style={{
                        borderColor: isMalpracticeStage
                          ? '#eab308'
                          : activeHabitat.color,
                        color: isMalpracticeStage
                          ? '#eab308'
                          : activeHabitat.color,
                      }}
                      className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#0a0b0e]/92 border font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-wider"
                    >
                      {isMalpracticeStage
                        ? 'BUREAUCRATIC MALPRACTICE • PUNITIVE CAGES'
                        : activeHabitat.name}
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#0a0b0e]/92 border border-slate-700 font-mono text-[8px] sm:text-[10px] text-slate-200">
                      Habitat Volume: <strong>{spaceMultiple}x</strong> • Social
                      Bonding: <strong>{socialPct}%</strong>
                    </div>
                  </div>

                  {/* Live Environmental Telemetry Bars (2 columns on both mobile and desktop) */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 mb-0 sm:mb-2.5">
                    <div className="p-1.5 sm:p-2.5 bg-[#0a0b0e] border border-slate-800">
                      <div className="flex items-center justify-between font-mono text-[8px] sm:text-[10px] mb-1 gap-1">
                        <span className="text-slate-400 truncate">
                          <span className="sm:hidden">MORPHINE:</span>
                          <span className="hidden sm:inline">
                            MORPHINE SOLUTION INTAKE:
                          </span>
                        </span>
                        <span
                          style={{
                            color: isPark ? '#22c55e' : '#ef4444',
                          }}
                          className="font-bold shrink-0"
                        >
                          {morphineMg} mg/kg
                        </span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-slate-900 border border-slate-800 overflow-hidden">
                        <div
                          style={{
                            width: `${overdosePct}%`,
                            backgroundColor: isPark ? '#22c55e' : '#ef4444',
                          }}
                          className="h-full"
                        />
                      </div>
                    </div>

                    <div className="p-1.5 sm:p-2.5 bg-[#0a0b0e] border border-slate-800">
                      <div className="flex items-center justify-between font-mono text-[8px] sm:text-[10px] mb-1 gap-1">
                        <span className="text-slate-400 truncate">
                          <span className="sm:hidden">SOCIAL BOND:</span>
                          <span className="hidden sm:inline">
                            SOCIAL &amp; HABITAT ENRICHMENT:
                          </span>
                        </span>
                        <span className="text-[#eab308] font-bold shrink-0">
                          {socialPct}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 sm:h-2 bg-slate-900 border border-slate-800 overflow-hidden">
                        <div
                          style={{
                            width: `${Math.max(4, socialPct)}%`,
                            backgroundColor: '#eab308',
                          }}
                          className="h-full"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="hidden sm:block text-[11px] sm:text-xs text-slate-300 leading-snug mb-2">
                    {activeHabitat.summary}
                  </p>

                  <div className="hidden sm:block pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                    {data.citation}
                  </div>
                </DossierCard>
              </div>

              {/* RIGHT COLUMN: 3 Sequenced Narrative Cards */}
              <div className="md:col-span-5 grid grid-cols-1 items-start md:items-center">
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
                        variant="stamp"
                        label={data.title}
                        stamp={card.metric}
                        accent={card.accent}
                      >
                        <h3 className="text-sm sm:text-2xl font-extrabold text-[#e2e8f0] mb-1 sm:mb-3 leading-snug">
                          {card.headline}
                        </h3>
                        <p className="text-[11px] sm:text-base text-slate-300 leading-snug sm:leading-relaxed mb-1.5 sm:mb-4">
                          {card.body}
                        </p>
                        <div className="pt-1.5 sm:pt-2.5 border-t border-slate-800 font-mono text-[8.5px] sm:text-[10px] text-slate-400 leading-tight">
                          {card.citation}
                        </div>
                      </DossierCard>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
