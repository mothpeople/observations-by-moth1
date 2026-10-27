import React, { useState } from 'react';
import PinnedStage from './PinnedStage';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const invLerp = (a, b, v) => clamp((v - a) / (b - a));

export default function StickySplitSection({ data }) {
  const [lockoutImgError, setLockoutImgError] = useState(false);
  const [elderImgError, setElderImgError] = useState(false);

  const cards = data.cards || [];
  const lockoutImgSrc = data.lockoutImage || '/issues/issue-01/youth-lockout.webp';
  const elderImgSrc = data.image || '/issues/issue-01/disconnect-balcony.webp';

  return (
    <PinnedStage
      id="fracture"
      ariaLabel={data.sectionTitle}
      heightVh={360}
      className="bg-[#0c0d10] border-b border-neutral-800"
    >
      {(progress) => {
        const activeIndex = progress < 0.34 ? 0 : progress < 0.66 ? 1 : 2;
        const currentCard = cards[activeIndex] || cards[0];
        const ageMorph = invLerp(0.60, 0.72, progress);
        const isAgeMode = ageMorph > 0.5;

        // Animated background pan/zoom for Cards 1 & 2 (Youth Lockout) -> Crossfades to Old Politician on Card 3
        const bg1Scale = 1.02 + progress * 0.1;
        const bg1X = -progress * 24;
        const bg2Scale = 1.12 - ageMorph * 0.08;

        // Continuous scroll-driven chart animation for Home Prices vs Youth Wages (0.02 -> 0.55)
        const wageCurveDraw = invLerp(0.02, 0.45, progress);
        const wageStrokeOffset = Math.round((1 - wageCurveDraw) * 380);
        const gapHighlight = invLerp(0.12, 0.48, progress);

        // Left Graphic Bar Animations
        const wageAnim = invLerp(0.03, 0.25, progress);
        const homePricePct = 8 + wageAnim * 84;
        const youthWagePct = 8 + wageAnim * 14;
        const leaderAgePct = ageMorph * 88;
        const popAgePct = ageMorph * 35;

        // Right Column: 3 Cards with dedicated Animate-In -> Bar-Complete -> Static-Reading-Hold windows
        const cardWindows = [
          { enterStart: 0.0, enterEnd: 0.08, barEnd: 0.15, holdEnd: 0.28, exitEnd: 0.34, targetBar: 86 },
          { enterStart: 0.33, enterEnd: 0.41, barEnd: 0.48, holdEnd: 0.60, exitEnd: 0.66, targetBar: 92 },
          { enterStart: 0.65, enterEnd: 0.73, barEnd: 0.80, holdEnd: 0.96, exitEnd: 1.01, targetBar: 96 },
        ];

        const cardCitations = [
          'Ref: Harvard JCHS "State of the Nation’s Housing 2024" & OECD House Price-to-Income Ratio (1990–2024)',
          'Ref: U.S. Federal Reserve Distributional Financial Accounts & ILO Global Employment Trends for Youth (2024)',
          'Ref: Pew Research Center "Age of World Leaders" (2024); IPU Parline Database & UN DESA Median Age (28–30.5 yrs)',
        ];

        return (
          <div className="relative w-full h-full flex flex-col justify-between px-4 sm:px-10 py-3 sm:py-8 bg-[#0c0d10] overflow-hidden">
            {/* Full-Bleed Animated Background Image 1: Youth Lockout (Cards 1 & 2) */}
            {!lockoutImgError && (
              <div
                style={{
                  opacity: (1 - ageMorph) * 0.34,
                  transform: `scale(${bg1Scale}) translateX(${bg1X}px)`,
                }}
                className="pointer-events-none absolute inset-0 z-0 will-change-transform"
              >
                <img
                  src={lockoutImgSrc}
                  alt="Sumi-e illustration of young people locked outside padlocked shutters"
                  loading="lazy"
                  width="1376"
                  height="768"
                  onError={() => setLockoutImgError(true)}
                  className="w-full h-full object-cover mix-blend-lighten"
                />
              </div>
            )}

            {/* Full-Bleed Animated Background Image 2: Elderly Politician (Card 3) */}
            {!elderImgError && (
              <div
                style={{
                  opacity: ageMorph * 0.42,
                  transform: `scale(${bg2Scale})`,
                }}
                className="pointer-events-none absolute inset-0 z-0 will-change-transform"
              >
                <img
                  src={elderImgSrc}
                  alt="Sumi-e illustration of geriatric politicians overlooking a decaying city"
                  loading="lazy"
                  width="1376"
                  height="768"
                  onError={() => setElderImgError(true)}
                  className="w-full h-full object-cover mix-blend-lighten"
                />
              </div>
            )}

            {/* Dark Ink Vignette Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#0c0d10]/90 via-[#0c0d10]/70 to-[#0c0d10]/90"
            />

            {/* Top Section Title */}
            <div className="relative z-10 max-w-6xl w-full mx-auto flex items-end justify-between border-b border-neutral-800 pb-2 sm:pb-3 shrink-0">
              <h2 className="font-serif text-xl sm:text-4xl font-bold text-[#e6e4dd]">
                {data.sectionTitle}
              </h2>
            </div>

            {/* Main 50/50 Split Stage */}
            <div className="relative z-10 max-w-6xl w-full mx-auto my-auto grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-center">
              {/* Left Pinned Comparison Card (5 cols) */}
              <div className="md:col-span-5 ink-panel ink-panel-crimson border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md p-3 md:p-5">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 md:pb-2.5 mb-2 md:mb-3 font-mono text-[11px] md:text-xs">
                  <span className="text-[#e6e4dd] font-bold truncate">
                    {isAgeMode
                      ? 'LEADER AGE (70+) VS. POPULATION (28)'
                      : 'MEDIAN HOME PRICES VS. YOUTH WAGES'}
                  </span>
                  <span className="text-[#dc2626] font-bold shrink-0 ml-2">
                    {isAgeMode ? '+42 YR GAP' : '11.4x GAP'}
                  </span>
                </div>

                {/* Morphing Thumbnail Plate (Desktop only — mobile sees full-screen animated background) */}
                <div className="hidden md:block relative aspect-video overflow-hidden border border-neutral-800 bg-[#08090a] mb-3">
                  {!lockoutImgError && (
                    <img
                      src={lockoutImgSrc}
                      alt="Locked out youth"
                      style={{ opacity: 1 - ageMorph }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {!elderImgError && (
                    <img
                      src={elderImgSrc}
                      alt="Geriatric politicians on balcony"
                      style={{ opacity: ageMorph }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-xs text-[#e6e4dd]">
                    <span>
                      {isAgeMode
                        ? 'GERIATRIC POLITICIANS (70+)'
                        : 'SHUTTERS PULLED DOWN'}
                    </span>
                    <span
                      style={{ color: currentCard.accent }}
                      className="font-bold"
                    >
                      {currentCard.metric}
                    </span>
                  </div>
                </div>

                {/* Animated SVG Comparison Chart Highlighting Stark Divergence */}
                <div className="bg-[#08090a] border border-neutral-800 p-2 md:p-3 mb-0 md:mb-3">
                  <svg
                    viewBox="0 0 360 135"
                    className="w-full max-h-[100px] md:max-h-none h-auto overflow-visible"
                  >
                    <line
                      x1="25"
                      y1="25"
                      x2="335"
                      y2="25"
                      stroke="rgba(230,228,221,0.08)"
                      strokeDasharray="3 4"
                    />
                    <line
                      x1="25"
                      y1="72"
                      x2="335"
                      y2="72"
                      stroke="rgba(230,228,221,0.08)"
                      strokeDasharray="3 4"
                    />
                    <line
                      x1="25"
                      y1="118"
                      x2="335"
                      y2="118"
                      stroke="rgba(230,228,221,0.08)"
                      strokeDasharray="3 4"
                    />

                    {/* MODE 1: Animated Home Prices Surging vs Flat Youth Wages + Stark Chasm Bracket */}
                    <g style={{ opacity: 1 - ageMorph }}>
                      {/* Shaded Affordability Chasm */}
                      <path
                        d="M 25 118 C 110 98, 195 52, 315 18 L 315 114 C 210 115, 115 116, 25 118 Z"
                        fill="rgba(220,38,38,0.16)"
                        style={{ opacity: gapHighlight }}
                      />
                      {/* Animated Home Price Curve */}
                      <path
                        d="M 25 118 C 110 98, 195 52, 315 18"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="380"
                        strokeDashoffset={wageStrokeOffset}
                      />
                      {/* Flatlined Youth Wages */}
                      <path
                        d="M 25 118 C 115 116, 210 115, 315 114"
                        fill="none"
                        stroke="rgba(230,228,221,0.55)"
                        strokeWidth="3"
                        strokeDasharray="6 5"
                      />
                      {/* Stark Gap Callout Bracket on Right */}
                      <g style={{ opacity: gapHighlight }}>
                        <line
                          x1="315"
                          y1="18"
                          x2="315"
                          y2="114"
                          stroke="#dc2626"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                        <circle cx="315" cy="18" r="4.5" fill="#d97706" />
                        <circle cx="315" cy="114" r="3.5" fill="#e6e4dd" />
                        <rect
                          x="212"
                          y="52"
                          width="96"
                          height="22"
                          fill="#08090a"
                          stroke="#dc2626"
                          strokeWidth="1.5"
                        />
                        <text
                          x="260"
                          y="66"
                          textAnchor="middle"
                          fill="#dc2626"
                          className="font-mono text-[9px] font-bold"
                        >
                          11.4x STARK GAP
                        </text>
                      </g>
                      <text
                        x="28"
                        y="18"
                        fill="#d97706"
                        className="font-mono text-[10px] font-bold"
                      >
                        HOME PRICES (+310%)
                      </text>
                      <text
                        x="28"
                        y="108"
                        fill="#e6e4dd"
                        fillOpacity="0.75"
                        className="font-mono text-[10px]"
                      >
                        YOUTH WAGES (FLAT)
                      </text>
                    </g>

                    {/* MODE 2: Animated Leader Age (70+) vs Population Age (28) + 42-Year Chasm Callout */}
                    <g style={{ opacity: ageMorph }}>
                      {/* Towering 70+ Leader Pillar */}
                      <rect
                        x="48"
                        y={118 - ageMorph * 94}
                        width="72"
                        height={ageMorph * 94}
                        fill="rgba(220,38,38,0.35)"
                        stroke="#dc2626"
                        strokeWidth="2"
                      />
                      {/* Low 28 Population Pillar */}
                      <rect
                        x="232"
                        y={118 - ageMorph * 38}
                        width="72"
                        height={ageMorph * 38}
                        fill="rgba(217,119,6,0.28)"
                        stroke="#d97706"
                        strokeWidth="2"
                      />
                      {/* Stark 42-Year Chasm Connector */}
                      <line
                        x1="120"
                        y1={118 - ageMorph * 94}
                        x2="268"
                        y2={118 - ageMorph * 94}
                        stroke="#dc2626"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="268"
                        y1={118 - ageMorph * 94}
                        x2="268"
                        y2={118 - ageMorph * 38}
                        stroke="#dc2626"
                        strokeWidth="2"
                      />
                      <rect
                        x="134"
                        y="42"
                        width="112"
                        height="22"
                        fill="#08090a"
                        stroke="#dc2626"
                        strokeWidth="1.5"
                      />
                      <text
                        x="190"
                        y="56"
                        textAnchor="middle"
                        fill="#dc2626"
                        className="font-mono text-[9px] font-bold"
                      >
                        +42 YR DISCONNECT
                      </text>
                      <text
                        x="38"
                        y="16"
                        fill="#dc2626"
                        className="font-mono text-[10px] font-bold"
                      >
                        LEADERS: 70+ YRS
                      </text>
                      <text
                        x="215"
                        y="72"
                        fill="#d97706"
                        className="font-mono text-[10px] font-bold"
                      >
                        POPULATION: 28 YRS
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Live Bar Charts (Desktop only — mobile sees per-card bar below) */}
                <div className="hidden md:block p-3 bg-[#08090a] border border-neutral-800 space-y-2 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#d97706]">MEDIAN HOME PRICES</span>
                      <span>11.4x WAGES</span>
                    </div>
                    <div className="h-2 bg-[#1f232b] overflow-hidden">
                      <div
                        style={{ width: `${homePricePct}%` }}
                        className="h-full bg-[#d97706]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#e6e4dd]/70">YOUTH REAL WAGES</span>
                      <span>STAGNANT</span>
                    </div>
                    <div className="h-2 bg-[#1f232b] overflow-hidden">
                      <div
                        style={{ width: `${youthWagePct}%` }}
                        className="h-full bg-[#e6e4dd]/60"
                      />
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-neutral-800">
                    <div className="flex justify-between mb-1">
                      <span className="text-[#dc2626]">
                        AVG LEADER AGE (70+) VS POP (28)
                      </span>
                      <span className="text-[#dc2626]">70+ YRS</span>
                    </div>
                    <div className="h-2 bg-[#1f232b] overflow-hidden flex gap-1 mb-1.5">
                      <div
                        style={{ width: `${leaderAgePct}%` }}
                        className="h-full bg-[#dc2626]"
                      />
                      <div
                        style={{ width: `${popAgePct}%` }}
                        className="h-full bg-[#d97706]"
                      />
                    </div>
                    <div className="text-[10px] text-[#e6e4dd]/55">
                      Ref: OECD Housing Database (2024); Pew Research Center &amp; UN DESA (2024)
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stage (7 cols): Cards 1, 2, 3 with Static Reading Plateaus */}
              <div className="md:col-span-7 relative min-h-[255px] sm:min-h-[320px] md:min-h-[360px]">
                {cards.map((card, idx) => {
                  const w = cardWindows[idx];
                  const enter = invLerp(w.enterStart, w.enterEnd, progress);
                  const exit = invLerp(w.holdEnd, w.exitEnd, progress);
                  const opacity = enter * (1 - exit);
                  const y = (1 - enter) * 44 - exit * 36;
                  const scale = 0.95 + opacity * 0.05;
                  const barFill =
                    invLerp(w.enterStart, w.barEnd, progress) * w.targetBar;

                  return (
                    <div
                      key={card.id}
                      style={{
                        opacity,
                        transform: `translateY(${y}px) scale(${scale})`,
                        pointerEvents: opacity > 0.4 ? 'auto' : 'none',
                      }}
                      className="seq-layer will-change-transform"
                    >
                      <article
                        className={`ink-panel ${
                          card.accent === '#dc2626' ? 'ink-panel-crimson' : ''
                        } w-full border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md p-4 sm:p-8`}
                      >
                        <div className="mb-2.5 sm:mb-4 pb-2 sm:pb-3 border-b border-neutral-800">
                          <h3
                            className="font-serif text-base sm:text-xl font-bold"
                            style={{ color: card.accent }}
                          >
                            {card.tag}
                          </h3>
                        </div>

                        <p className="font-editorial text-base sm:text-2xl lg:text-3xl text-[#e6e4dd] leading-snug sm:leading-relaxed mb-3.5 sm:mb-6">
                          {card.copy}
                        </p>

                        {/* Card Bar Chart — Completes before reading hold */}
                        <div className="p-2.5 sm:p-4 bg-[#08090a] border border-neutral-800">
                          <div className="flex items-baseline justify-between gap-3 mb-1.5 sm:mb-2">
                            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#e6e4dd]/70">
                              {card.metricLabel}
                            </span>
                            <span
                              className="font-mono text-lg sm:text-2xl font-bold shrink-0"
                              style={{ color: card.accent }}
                            >
                              {card.metric}
                            </span>
                          </div>
                          <div className="h-2 sm:h-2.5 w-full bg-[#1f232b] overflow-hidden p-0.5 mb-1.5 sm:mb-2">
                            <div
                              style={{
                                width: `${barFill}%`,
                                backgroundColor: card.accent,
                              }}
                              className="h-full"
                            />
                          </div>
                          <div className="font-mono text-[10px] sm:text-[11px] text-[#e6e4dd]/55 leading-tight">
                            {cardCitations[idx]}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Indicator */}
            <div className="relative z-10 max-w-6xl w-full mx-auto pt-2">
              <div className="h-1 w-full bg-[#08090a] border border-neutral-800 overflow-hidden">
                <div
                  style={{ width: `${progress * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#d97706] to-[#dc2626]"
                />
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
