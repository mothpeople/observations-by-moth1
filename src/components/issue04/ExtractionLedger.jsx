import React, { useState } from 'react';

export default function ExtractionLedger({ scrollEra = null, compact = false }) {
  const [manualEra, setManualEra] = useState(null); // null | '1839' | 'modern'
  const era = manualEra || scrollEra || 'modern';

  const ledgers = {
    '1839': {
      badge: 'EAST INDIA COMPANY LEDGER • 1839',
      title: 'The Canton Silver Extraction Engine',
      subtitle:
        'Weaponising biological dependency to reverse a sovereign trade deficit.',
      metrics: [
        {
          label: 'Primary Commodity',
          value: 'Bengal Opium',
          note: 'Cultivated in British India and smuggled into Canton ports.',
        },
        {
          label: 'Population Captured',
          value: '40+ Million',
          note: 'Roughly 10% to 15% of Qing China addicted by the late 19th century.',
        },
        {
          label: 'Extracted Currency',
          value: 'Imperial Silver',
          note: 'Drained Qing state treasuries and collapsed domestic defence capacity.',
        },
        {
          label: 'Delivery Mechanism',
          value: 'Opium Dens',
          note: 'Tolerated by corrupt port officials bribed to look the other way.',
        },
      ],
      verdict:
        'Result: The Century of Humiliation; an empire hollowed out from within without a single foreign army occupying the interior.',
      citation:
        'Ref: Imperial Maritime Customs Archives & Lovell, The Opium War (2011)',
    },
    modern: {
      badge: 'ALGORITHMIC ATTENTION LEDGER • 2026',
      title: 'The Digital Canton Extraction Engine',
      subtitle:
        'Weaponising variable-reward loops to harvest human waking hours.',
      metrics: [
        {
          label: 'Primary Commodity',
          value: 'Algorithmic Feeds',
          note: 'Infinite short-form video loops engineered by behavioural psychologists.',
        },
        {
          label: 'Population Captured',
          value: '5.1+ Billion',
          note: 'Average user surrenders 35+ full waking days per year to social feeds.',
        },
        {
          label: 'Extracted Currency',
          value: 'Human Attention',
          note: 'Refined into micro-targeted behavioural ad inventory and surveillance data.',
        },
        {
          label: 'Delivery Mechanism',
          value: 'Smartphones',
          note: 'Carried voluntarily in every pocket; subsidised by mobile data plans.',
        },
      ],
      verdict:
        'Result: Self-inflicted cognitive atrophy; citizens pay for the connection and thank the dealer for the distraction.',
      citation:
        'Ref: DataReportal Global Digital Overview (2025) & Natasha Dow Schüll, Addiction by Design',
    },
  };

  const active = ledgers[era];
  const accentColor = era === '1839' ? '#eab308' : '#ef4444';

  return (
    <div
      style={{
        borderColor: `${accentColor}44`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.92), inset 0 1px 0 ${accentColor}22`,
      }}
      className={`w-full rounded-3xl bg-[#0b0d14]/95 border text-[#e2e8f0] font-sans relative overflow-hidden backdrop-blur-xl transition-colors duration-300 ${
        compact ? 'p-3 sm:p-6' : 'max-w-4xl mx-auto my-8 sm:my-12 p-4 sm:p-8'
      }`}
    >
      {/* Header & Rounded Pill Era Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-2.5 sm:pb-4 mb-2.5 sm:mb-4">
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-mono tracking-widest uppercase font-bold border ${
              era === '1839'
                ? 'text-[#eab308] border-[#eab308]/40 bg-[#eab308]/10'
                : 'text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10'
            }`}
          >
            {active.badge}
          </span>
          <h3 className="text-sm sm:text-xl font-extrabold text-white mt-1 leading-snug">
            {active.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-neutral-700/80 bg-[#090a0f] p-1 self-start">
          <button
            type="button"
            onClick={() => setManualEra('1839')}
            className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[9px] sm:text-xs font-mono uppercase transition-all cursor-pointer ${
              era === '1839'
                ? 'bg-[#eab308] text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            1839 • Canton
          </button>
          <button
            type="button"
            onClick={() => setManualEra('modern')}
            className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[9px] sm:text-xs font-mono uppercase transition-all cursor-pointer ${
              era === 'modern'
                ? 'bg-[#ef4444] text-white font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            2026 • Feeds
          </button>
          {manualEra !== null && (
            <button
              type="button"
              onClick={() => setManualEra(null)}
              className="px-2 text-[8.5px] font-mono text-[#22c55e] underline cursor-pointer"
            >
              Auto
            </button>
          )}
        </div>
      </div>

      <p className="hidden sm:block text-xs sm:text-sm text-neutral-400 mb-3 sm:mb-4 font-sans">
        {active.subtitle}
      </p>

      {/* 4-Card Rounded Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3.5 mb-2.5 sm:mb-4">
        {active.metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-2.5 sm:p-4 rounded-2xl bg-[#10131d]/90 border border-neutral-800/90"
          >
            <div className="text-[8.5px] sm:text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-0.5 truncate">
              {m.label}
            </div>
            <div
              className={`text-xs sm:text-xl font-mono font-extrabold mb-0.5 sm:mb-1 ${
                era === '1839' ? 'text-[#eab308]' : 'text-[#ef4444]'
              }`}
            >
              {m.value}
            </div>
            <p className="text-[9.5px] sm:text-xs text-neutral-300 leading-snug">
              {m.note}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Rounded Verdict Pill Box */}
      <div
        className={`p-2.5 sm:p-3.5 rounded-2xl bg-[#121520] border ${
          era === '1839' ? 'border-[#eab308]/40' : 'border-[#ef4444]/40'
        } text-[10px] sm:text-xs font-mono text-neutral-200 leading-snug`}
      >
        {active.verdict}
      </div>

      <div className="hidden sm:block mt-2.5 pt-2 border-t border-neutral-800/80 font-mono text-[9.5px] text-neutral-400">
        {active.citation}
      </div>
    </div>
  );
}
