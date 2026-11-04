import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { clamp, remap, getCardEnvelope } from '../../utils/math';

export default function SupplyDelusionSection({ data }) {
  // null = scroll-driven interdiction pressure (12% -> 95%)
  const [manualPressure, setManualPressure] = useState(null);

  return (
    <PinnedStage id="supply-delusion" heightMultiplier={4.0}>
      {(progress) => {
        // Strictly monotonic pressure climb across the 3 sequenced story cards
        const autoPressure = Math.round(
          clamp(remap(progress, 0.06, 0.88, 12, 95), 12, 95)
        );
        const pressure =
          manualPressure !== null ? manualPressure : autoPressure;

        // As enforcement pressure rises, organic volume shrinks while synthetic branches surge
        const organicFlow = Math.max(8, 100 - pressure);
        const syntheticFlow = Math.min(100, Math.round(pressure * 1.05));
        const potencyMultiple = Math.round(remap(pressure, 0, 100, 1, 250));

        const activeMutationIdx =
          pressure < 38 ? 0 : pressure < 72 ? 1 : 2;

        // 3 distinct transition images on the right column (1 per card, never duplicating the left hydrant map):
        // Card 1 (0 -> 0.34): press-seizure.webp (Press-Conference Botanical Bales)
        // Card 2 (0.34 -> 0.67): postal-synthetics.webp (Flat Postal Envelopes)
        // Card 3 (0.67 -> 1.00): synthetic-lab.webp (Clandestine Lab Nitazenes)
        const rightCardIdx =
          progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;

        return (
          <div className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center">
            {/* Tactical Wireframe Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #eab308 1px, transparent 1px), linear-gradient(to bottom, #ef4444 1px, transparent 1px)',
                backgroundSize: '52px 52px',
              }}
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-2.5 sm:px-6 pt-16 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-6 items-start md:items-center">
              {/* LEFT COLUMN: Interactive Iron Law of Prohibition / Hydrant Network Map */}
              <div className="md:col-span-7">
                <DossierCard
                  variant="clip"
                  label={data.kicker}
                  stamp={`POTENCY MULTIPLIER: ${potencyMultiple}x`}
                  accent="#ef4444"
                >
                  {/* Interactive SVG Network Flow Map over Supply Hydrant Blueprint */}
                  <div className="relative w-full aspect-[16/9] max-h-[125px] sm:max-h-[225px] mb-1.5 sm:mb-3 bg-[#08090c] border border-slate-800 overflow-hidden">
                    <img
                      src={data.image}
                      alt={data.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-42"
                    />

                    <svg
                      viewBox="0 0 600 280"
                      className="absolute inset-0 w-full h-full"
                      role="img"
                      aria-label="Network flow map showing border interdiction splitting organic supply into synthetic fentanyl, nitazenes, and lab cannabinoids"
                    >
                      {/* Baseline Demand Node (Left) */}
                      <rect
                        x="18"
                        y="108"
                        width="120"
                        height="64"
                        fill="#0e1015"
                        stroke="#eab308"
                        strokeWidth="2"
                      />
                      <text
                        x="78"
                        y="135"
                        textAnchor="middle"
                        fill="#eab308"
                        className="font-mono text-[10px] font-bold"
                      >
                        BASELINE DEMAND
                      </text>
                      <text
                        x="78"
                        y="153"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        className="font-mono text-[9px]"
                      >
                        100% Constant
                      </text>

                      {/* Primary Pipe to Interdiction Choke Point */}
                      <line
                        x1="138"
                        y1="140"
                        x2="255"
                        y2="140"
                        stroke="#22c55e"
                        strokeWidth={Math.max(2, organicFlow / 8)}
                      />

                      {/* Interdiction Choke Point Valve (Center) */}
                      <circle
                        cx="275"
                        cy="140"
                        r="28"
                        fill="#0a0b0e"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                      />
                      <text
                        x="275"
                        y="137"
                        textAnchor="middle"
                        fill="#ef4444"
                        className="font-mono text-[9px] font-bold"
                      >
                        SEIZURE
                      </text>
                      <text
                        x="275"
                        y="150"
                        textAnchor="middle"
                        fill="#e2e8f0"
                        className="font-mono text-[9px]"
                      >
                        {pressure}%
                      </text>

                      {/* Branch 1: Fentanyl Analogues */}
                      <path
                        d="M 303 130 C 355 115, 375 58, 425 58"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth={Math.max(1.5, syntheticFlow / 14)}
                        strokeDasharray="6 3"
                      />
                      <rect
                        x="425"
                        y="32"
                        width="156"
                        height="52"
                        fill="#0e1015"
                        stroke="#eab308"
                        strokeWidth="1.5"
                      />
                      <text
                        x="503"
                        y="54"
                        textAnchor="middle"
                        fill="#eab308"
                        className="font-mono text-[10px] font-bold"
                      >
                        FENTANYL ANALOGUES
                      </text>
                      <text
                        x="503"
                        y="70"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        className="font-mono text-[8.5px]"
                      >
                        50x–100x • Postal Envelope
                      </text>

                      {/* Branch 2: Nitazenes */}
                      <path
                        d="M 303 140 L 425 140"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth={Math.max(1.5, syntheticFlow / 12)}
                      />
                      <rect
                        x="425"
                        y="114"
                        width="156"
                        height="52"
                        fill="#0e1015"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                      />
                      <text
                        x="503"
                        y="136"
                        textAnchor="middle"
                        fill="#ef4444"
                        className="font-mono text-[10px] font-bold"
                      >
                        NITAZENE OPIOIDS
                      </text>
                      <text
                        x="503"
                        y="152"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        className="font-mono text-[8.5px]"
                      >
                        100x–500x • Lab Synthetics
                      </text>

                      {/* Branch 3: Synthetic Cannabinoids */}
                      <path
                        d="M 303 150 C 355 165, 375 222, 425 222"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth={Math.max(1.5, syntheticFlow / 15)}
                        strokeDasharray="5 3"
                      />
                      <rect
                        x="425"
                        y="196"
                        width="156"
                        height="52"
                        fill="#0e1015"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                      />
                      <text
                        x="503"
                        y="218"
                        textAnchor="middle"
                        fill="#22c55e"
                        className="font-mono text-[10px] font-bold"
                      >
                        SYNTH CANNABINOIDS
                      </text>
                      <text
                        x="503"
                        y="234"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        className="font-mono text-[8.5px]"
                      >
                        Zero Botanical Footprint
                      </text>
                    </svg>
                  </div>

                  {/* Interactive Interdiction Pressure Valve Slider */}
                  <div className="mb-3 px-1">
                    <div className="flex justify-between font-mono text-[9.5px] sm:text-[10px] mb-1">
                      <span className="text-slate-300">
                        BORDER INTERDICTION PRESSURE VALVE:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#ef4444] font-bold">
                          {pressure}% ENFORCEMENT CLAMP
                        </span>
                        {manualPressure !== null && (
                          <button
                            type="button"
                            onClick={() => setManualPressure(null)}
                            className="text-[#22c55e] underline cursor-pointer"
                          >
                            Auto
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="98"
                      value={pressure}
                      onChange={(e) => setManualPressure(Number(e.target.value))}
                      aria-label="Adjust border interdiction pressure"
                      className="w-full accent-[#ef4444] cursor-pointer h-1.5 bg-slate-800"
                    />
                  </div>

                  {/* 3 Mutation Stage Selector Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    {data.mutations.map((m, idx) => {
                      const isActive = idx === activeMutationIdx;
                      return (
                        <div
                          key={m.id}
                          style={{
                            borderColor: isActive ? m.color : '#1e293b',
                          }}
                          className="p-2 bg-[#0a0b0e] border transition-colors"
                        >
                          <div
                            style={{ color: m.color }}
                            className="font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase truncate"
                          >
                            {m.stage}
                          </div>
                          <div className="text-[10px] sm:text-xs font-bold text-[#e2e8f0] truncate mt-0.5">
                            {m.name}
                          </div>
                          <div className="font-mono text-[8.5px] text-slate-400 truncate mt-0.5">
                            {m.potency}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 font-mono text-[9px] sm:text-[10px] text-slate-400">
                    {data.citation}
                  </div>
                </DossierCard>
              </div>

              {/* RIGHT COLUMN: 3 Distinct Card-Specific Illustrations + 3 Sequenced Narrative Cards */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="hidden md:block relative w-full aspect-[16/9] max-h-[175px] overflow-hidden border border-slate-800 bg-[#08090c] shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
                  {data.cards.map((card, idx) => (
                    <img
                      key={card.id}
                      src={card.image}
                      alt={card.headline}
                      style={{ opacity: rightCardIdx === idx ? 0.94 : 0 }}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    />
                  ))}
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 bg-[#0a0b0e]/92 border border-[#eab308]/60 font-mono text-[9px] text-[#eab308] uppercase font-bold">
                    {data.cards[rightCardIdx]?.caption || data.title}
                  </div>
                </div>

                {/* 3 Sequenced Narrative Cards (1 at a time) */}
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
                        className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                      >
                        <DossierCard
                          variant="broadsheet"
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
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
