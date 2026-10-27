import React, { useState } from 'react';
import PinnedStage from './PinnedStage';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const invLerp = (a, b, v) => clamp((v - a) / (b - a));

export default function DataComparisonSection({ data }) {
  const [scaleImgError, setScaleImgError] = useState(false);
  const scaleImageSrc = data.scaleImage || '/issues/issue-01/scale.webp';

  const yearStats = {
    '1990': { stocks: '+40%', family: '78%', fracture: 'LOW (14%)', bar: 18 },
    '2008': { stocks: '+135%', family: '51%', fracture: 'MODERATE (48%)', bar: 52 },
    '2026': { stocks: '+285%', family: '24%', fracture: 'CRITICAL (91%)', bar: 94 },
  };

  return (
    <PinnedStage
      id="budget-imbalance"
      ariaLabel={data.sectionTitle}
      heightVh={400}
      className="bg-[#0c0d10] border-b border-neutral-800"
    >
      {(progress) => {
        // ============================================================================
        // STEP 1 (0.00 -> 0.32): Full-screen Weighing Scale tips to completion (0.02 -> 0.16),
        // holds static (0.16 -> 0.25), then moves upward and fades out (0.25 -> 0.33).
        // ============================================================================
        const tip = invLerp(0.02, 0.16, progress);
        const beamDeg = -tip * 24;
        const leftPanY = tip * 44;
        const rightPanY = -tip * 40;
        const secShare = Math.round(50 + tip * 28);
        const eduShare = 100 - secShare;

        const scaleExit = invLerp(0.25, 0.33, progress);
        const scaleOpacity = 1 - scaleExit;
        const scaleY = -scaleExit * 130;

        // ============================================================================
        // STEP 2 (0.31 -> 0.65): Detached from Street Reality card enters center stage.
        // Scroll automatically drives the Doctrine Simulator from "Swing Harder (Status Quo)"
        // (0.31 -> 0.48) to "Civic Accountability" (0.48 -> 0.65) without clicking!
        // ============================================================================
        const p1Enter = invLerp(0.31, 0.38, progress);
        const p1Exit = invLerp(0.60, 0.67, progress);
        const p1Opacity = p1Enter * (1 - p1Exit);
        const p1Y = (1 - p1Enter) * 80 - p1Exit * 120;

        // Scroll-driven transition inside Card 1: 0 = Swing Harder, 1 = Civic Accountability
        const civicMorph = invLerp(0.46, 0.52, progress);
        const isCivic = civicMorph > 0.5;
        const forceSpendVal = Math.round(142 - civicMorph * 182); // +142% -> -40%
        const forceSpendStr = forceSpendVal > 0 ? `+${forceSpendVal}%` : `${forceSpendVal}%`;
        const unrestVal = Math.round(95 - civicMorph * 77); // 95% -> 18%
        const trustVal = Math.round(14 + civicMorph * 68); // 14% -> 82%

        // ============================================================================
        // STEP 3 (0.65 -> 1.00): How Societies Fracture card enters center stage.
        // Scroll automatically steps through 1990 (0.65 -> 0.77) -> 2008 (0.77 -> 0.88)
        // -> 2026 (0.88 -> 1.00) without needing to manually click!
        // ============================================================================
        const p2Enter = invLerp(0.65, 0.72, progress);
        const p2Opacity = p2Enter;
        const p2Y = (1 - p2Enter) * 80;

        const activeYear =
          progress < 0.77 ? '1990' : progress < 0.88 ? '2008' : '2026';
        const currentYearStat = yearStats[activeYear];

        return (
          <div className="relative w-full h-full flex flex-col justify-between px-6 sm:px-10 py-5 sm:py-7 bg-[#0c0d10] overflow-hidden">
            {/* Full-Screen Background Visual Crossfade Across the 3 Steps */}
            <div
              style={{ opacity: scaleOpacity * 0.22 }}
              className="pointer-events-none absolute inset-0 z-0"
            >
              <img
                src={scaleImageSrc}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover mix-blend-lighten"
              />
            </div>
            <div
              style={{ opacity: p1Opacity * 0.24 }}
              className="pointer-events-none absolute inset-0 z-0"
            >
              <img
                src="/issues/issue-01/protest-2.webp"
                alt=""
                loading="lazy"
                className="w-full h-full object-cover mix-blend-lighten"
              />
            </div>
            <div
              style={{ opacity: p2Opacity * 0.26 }}
              className="pointer-events-none absolute inset-0 z-0"
            >
              <img
                src="/issues/issue-01/protest-4.webp"
                alt=""
                loading="lazy"
                className="w-full h-full object-cover mix-blend-lighten"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#0c0d10]/95 via-[#0c0d10]/80 to-[#0c0d10]/95"
            />

            {/* Top Header — Clean Section Title Only */}
            <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-wrap items-end justify-between gap-3 border-b border-neutral-800 pb-2.5 shrink-0">
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#e6e4dd]">
                {data.sectionTitle}
              </h2>
            </div>

            {/* Center Full-Screen Sequenced Stage (Each Step in its own absolute .seq-layer) */}
            <div className="relative z-10 max-w-5xl w-full mx-auto flex-1 my-2">
              {/* ================================================================= */}
              {/* LAYER 1: FULL-SCREEN WEIGHING SCALE (Moves up after animation)     */}
              {/* ================================================================= */}
              <div
                style={{
                  opacity: scaleOpacity,
                  transform: `translateY(${scaleY}px) scale(${1 - scaleExit * 0.05})`,
                  pointerEvents: scaleOpacity > 0.4 ? 'auto' : 'none',
                }}
                className="seq-layer will-change-transform"
              >
                <div className="ink-panel ink-panel-crimson w-full max-w-4xl border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md p-5 sm:p-7 overflow-hidden">
                  {!scaleImgError && (
                    <img
                      src={scaleImageSrc}
                      alt="Minimalist sumi-e balance scale"
                      loading="lazy"
                      width="1376"
                      height="768"
                      onError={() => setScaleImgError(true)}
                      className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-lighten"
                    />
                  )}

                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2.5 mb-3 font-mono text-xs uppercase tracking-widest text-[#e6e4dd]/80">
                    <span>NATIONAL PRIORITY SCALE</span>
                    <span className="text-[#dc2626] font-bold">
                      {secShare}% PUBLIC SECURITY VS {eduShare}% EDUCATION &amp; HEALTH
                    </span>
                  </div>

                  {/* Full-Width Minimalist Visual Scale Tipping Violently */}
                  <div className="relative z-10 bg-[#08090a]/90 border border-neutral-800 p-3 sm:p-4 mb-3">
                    <svg
                      viewBox="0 0 560 200"
                      className="w-full max-h-[210px] mx-auto overflow-visible"
                      role="img"
                      aria-label="Scale tipping violently toward Public Security Budgets over Healthcare and Education"
                    >
                      <path
                        d="M 50 186 L 510 186"
                        stroke="#1f232b"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 260 186 L 280 78 L 300 186 Z"
                        fill="#08090a"
                        stroke="#e6e4dd"
                        strokeWidth="2.5"
                      />
                      <circle cx="280" cy="78" r="6" fill="#d97706" />

                      <g
                        style={{
                          transform: `rotate(${beamDeg}deg)`,
                          transformOrigin: '280px 78px',
                        }}
                      >
                        <line
                          x1="90"
                          y1="78"
                          x2="470"
                          y2="78"
                          stroke="#e6e4dd"
                          strokeWidth="5.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="90"
                          y1="78"
                          x2="280"
                          y2="78"
                          stroke="#dc2626"
                          strokeWidth="5.5"
                          strokeLinecap="round"
                        />
                      </g>

                      <g style={{ transform: `translateY(${leftPanY}px)` }}>
                        <line
                          x1="120"
                          y1="78"
                          x2="92"
                          y2="122"
                          stroke="#dc2626"
                          strokeWidth="2"
                        />
                        <line
                          x1="120"
                          y1="78"
                          x2="148"
                          y2="122"
                          stroke="#dc2626"
                          strokeWidth="2"
                        />
                        <path
                          d="M 68 122 Q 120 156 172 122 Z"
                          fill="#dc2626"
                        />
                        <text
                          x="42"
                          y="162"
                          fill="#dc2626"
                          className="font-mono text-[11px] font-bold uppercase"
                        >
                          {data.heavySideLabel}
                        </text>
                      </g>

                      <g style={{ transform: `translateY(${rightPanY}px)` }}>
                        <line
                          x1="440"
                          y1="78"
                          x2="414"
                          y2="118"
                          stroke="#d97706"
                          strokeWidth="1.8"
                        />
                        <line
                          x1="440"
                          y1="78"
                          x2="466"
                          y2="118"
                          stroke="#d97706"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M 392 118 Q 440 138 488 118 Z"
                          fill="#d97706"
                        />
                        <text
                          x="348"
                          y="152"
                          fill="#d97706"
                          className="font-mono text-[11px] font-bold uppercase"
                        >
                          {data.lightSideLabel}
                        </text>
                      </g>
                    </svg>
                  </div>

                  {/* Animated Split Bar */}
                  <div className="relative z-10 font-mono text-xs">
                    <div className="h-8 w-full flex bg-[#08090a] p-1 gap-1 border border-neutral-800 font-bold mb-2">
                      <div
                        style={{ width: `${secShare}%` }}
                        className="h-full bg-[#dc2626] text-[#e6e4dd] flex items-center justify-between px-3 truncate"
                      >
                        <span>PUBLIC SECURITY &amp; RIOT BUDGETS</span>
                        <span>{secShare}%</span>
                      </div>
                      <div
                        style={{ width: `${eduShare}%` }}
                        className="h-full bg-[#d97706] text-[#08090a] flex items-center justify-center px-2 truncate"
                      >
                        <span>{eduShare}%</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#e6e4dd]/60">
                      Ref: OECD &ldquo;Government at a Glance&rdquo; (2024) &amp; SIPRI Domestic Security vs. Per-Capita Education Growth Index
                    </div>
                  </div>
                </div>
              </div>

              {/* ================================================================= */}
              {/* LAYER 2: DETACHED FROM STREET REALITY (Scroll-Driven Simulator)    */}
              {/* ================================================================= */}
              <div
                style={{
                  opacity: p1Opacity,
                  transform: `translateY(${p1Y}px)`,
                  pointerEvents: p1Opacity > 0.4 ? 'auto' : 'none',
                }}
                className="seq-layer will-change-transform"
              >
                <article className="ink-panel ink-panel-crimson w-full max-w-4xl border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md p-6 sm:p-8 overflow-hidden">
                  <img
                    src="/issues/issue-01/protest-2.webp"
                    alt=""
                    loading="lazy"
                    className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-lighten"
                  />

                  <div className="relative z-10">
                    <div className="mb-3 pb-2.5 border-b border-neutral-800">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#dc2626]">
                        Detached from Street Reality
                      </h3>
                    </div>

                    <p className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#e6e4dd] leading-relaxed mb-5">
                      {data.paragraphs[0]}
                    </p>

                    {/* Scroll-Driven Doctrine Comparison: Swing Harder -> Civic Accountability */}
                    <div className="p-4 bg-[#08090a]/95 border border-neutral-800 font-mono text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-neutral-800">
                        <span className="text-[#e6e4dd]/70 uppercase">
                          STATE DOCTRINE SIMULATION:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 border transition-colors ${
                              !isCivic
                                ? 'border-[#dc2626] bg-[#dc2626] text-white font-bold'
                                : 'border-neutral-700 bg-[#0e1014] text-[#e6e4dd]/50'
                            }`}
                          >
                            Swing Harder (Status Quo)
                          </span>
                          <span
                            className={`px-2.5 py-1 border transition-colors ${
                              isCivic
                                ? 'border-[#d97706] bg-[#d97706] text-black font-bold'
                                : 'border-neutral-700 bg-[#0e1014] text-[#e6e4dd]/50'
                            }`}
                          >
                            Civic Accountability
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center mb-2.5">
                        <div className="p-2.5 bg-[#0e1014] border border-neutral-800">
                          <div className="text-[#e6e4dd]/60 mb-1">RIOT &amp; FORCE SPEND</div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: isCivic ? '#d97706' : '#dc2626' }}
                          >
                            {forceSpendStr}
                          </div>
                        </div>
                        <div className="p-2.5 bg-[#0e1014] border border-neutral-800">
                          <div className="text-[#e6e4dd]/60 mb-1">ESCALATION RATE</div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: isCivic ? '#d97706' : '#dc2626' }}
                          >
                            {unrestVal}%
                          </div>
                        </div>
                        <div className="p-2.5 bg-[#0e1014] border border-neutral-800">
                          <div className="text-[#e6e4dd]/60 mb-1">PUBLIC TRUST</div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: isCivic ? '#d97706' : '#dc2626' }}
                          >
                            {trustVal}%
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#e6e4dd]/55 pt-2 border-t border-neutral-800/80">
                        Ref: ACLED State Repression Monitor (2024); Maguire et al., &ldquo;Policing Protests&rdquo; (Criminology &amp; Public Policy)
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* ================================================================= */}
              {/* LAYER 3: HOW SOCIETIES FRACTURE (Scroll-Driven 1990->2008->2026)  */}
              {/* ================================================================= */}
              <div
                style={{
                  opacity: p2Opacity,
                  transform: `translateY(${p2Y}px)`,
                  pointerEvents: p2Opacity > 0.4 ? 'auto' : 'none',
                }}
                className="seq-layer will-change-transform"
              >
                <article className="ink-panel w-full max-w-4xl border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md p-6 sm:p-8 overflow-hidden">
                  <img
                    src="/issues/issue-01/protest-4.webp"
                    alt=""
                    loading="lazy"
                    className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-lighten"
                  />

                  <div className="relative z-10">
                    <div className="mb-3 pb-2.5 border-b border-neutral-800">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#d97706]">
                        How Societies Fracture
                      </h3>
                    </div>

                    <p className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#e6e4dd] leading-relaxed mb-5">
                      {data.paragraphs[1]}
                    </p>

                    {/* Scroll-Driven Generational Fracture Timeline: 1990 -> 2008 -> 2026 */}
                    <div className="p-4 bg-[#08090a]/95 border border-neutral-800 font-mono text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-neutral-800">
                        <span className="text-[#e6e4dd]/70 uppercase">
                          GENERATIONAL FRACTURE TIMELINE:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {['1990', '2008', '2026'].map((yr) => (
                            <span
                              key={yr}
                              className={`px-2.5 py-1 border transition-colors ${
                                activeYear === yr
                                  ? 'border-[#d97706] bg-[#d97706] text-black font-bold'
                                  : 'border-neutral-700 bg-[#0e1014] text-[#e6e4dd]/50'
                              }`}
                            >
                              {yr}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center mb-2.5">
                        <div className="p-2 bg-[#0e1014] border border-neutral-800">
                          <div className="text-[#e6e4dd]/60 mb-0.5">
                            65+ COHORT WEALTH
                          </div>
                          <div className="text-base font-bold text-[#dc2626]">
                            {currentYearStat.stocks}
                          </div>
                        </div>
                        <div className="p-2 bg-[#0e1014] border border-neutral-800">
                          <div className="text-[#e6e4dd]/60 mb-0.5">
                            FAMILY VIABILITY
                          </div>
                          <div className="text-base font-bold text-[#d97706]">
                            {currentYearStat.family}
                          </div>
                        </div>
                        <div className="p-2 bg-[#0e1014] border border-neutral-800">
                          <div className="text-[#e6e4dd]/60 mb-0.5">
                            FRACTURE INDEX
                          </div>
                          <div className="text-base font-bold text-[#dc2626]">
                            {currentYearStat.fracture}
                          </div>
                        </div>
                      </div>

                      {/* Fracture Bar */}
                      <div className="h-2 w-full bg-[#1f232b] overflow-hidden mb-2">
                        <div
                          style={{ width: `${currentYearStat.bar}%` }}
                          className="h-full bg-gradient-to-r from-[#d97706] to-[#dc2626] transition-all duration-150"
                        />
                      </div>

                      <div className="text-[11px] text-[#e6e4dd]/55 pt-1.5 border-t border-neutral-800/80">
                        Ref: U.S. Federal Reserve Survey of Consumer Finances (Wealth by Age, 1989–2024); OECD &ldquo;Society at a Glance 2024&rdquo; (Fertility &amp; Family Cost)
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            <div className="relative z-10 max-w-5xl w-full mx-auto pt-2 shrink-0">
              <div className="h-1 w-full bg-[#08090a] border border-neutral-800 overflow-hidden">
                <div
                  style={{ width: `${progress * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#dc2626] to-[#d97706]"
                />
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
