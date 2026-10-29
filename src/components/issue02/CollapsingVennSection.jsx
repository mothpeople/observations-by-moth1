import React, { useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import CyberPanel from './CyberPanel';
import { getCardEnvelope, remap } from '../../utils/math';

export default function CollapsingVennSection({ data }) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Framer Motion useTransform driving circle separation across the 300vh section
  const separationProgress = useTransform(
    scrollYProgress,
    [0, 0.22, 0.72, 1],
    [0, 0, 1, 1]
  );
  const [sep, setSep] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(latest);
  });

  useMotionValueEvent(separationProgress, 'change', (latest) => {
    setSep(latest);
  });

  // Interpolate the 3 Venn circle positions outward from overlapping center
  const ax = remap(sep, 0, 1, 174, 104);
  const ay = remap(sep, 0, 1, 148, 92);

  const bx = remap(sep, 0, 1, 226, 296);
  const by = remap(sep, 0, 1, 148, 92);

  const cx = 200;
  const cy = remap(sep, 0, 1, 192, 268);

  // Center Glowing Heart ("Make Baby") fades out as circles drift apart
  const makeBabyOpacity = remap(sep, 0, 0.42, 1, 0);
  const makeBabyScale = remap(sep, 0, 0.42, 1, 0.6);

  // Center "TFR BLACK HOLE" negative space fades in as circles separate
  const blackHoleOpacity = remap(sep, 0.34, 0.82, 0, 1);
  const blackHoleScale = remap(sep, 0.34, 0.85, 0.55, 1.04);

  const divergencePct = Math.round(sep * 100);
  const currentTfr = (2.1 - sep * 1.13).toFixed(2);

  return (
    <section
      id="beat-2"
      ref={containerRef}
      style={{ height: '320vh' }}
      className="relative w-full bg-[#121316] text-[#e2e8f0]"
    >
      <div className="sticky top-0 left-0 w-full stage-dvh overflow-hidden flex items-center justify-center">
        {/* Subtle Wireframe Grid & Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(134,239,172,0.07) 0%, rgba(18,19,22,0.96) 75%)',
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-12 pb-2 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-7 items-center">
          {/* LEFT COLUMN: Interactive Collapsing SVG Venn Diagram */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <CyberPanel
              label={data.sectionTitle}
              accent="#86efac"
              className="w-full p-2.5 sm:p-5"
            >
              {/* Top Telemetry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-800/80 text-[9.5px] sm:text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">CIRCLE DRIFT:</span>
                  <span
                    className={
                      divergencePct > 50
                        ? 'text-[#fda4af] font-bold'
                        : 'text-[#86efac] font-bold'
                    }
                  >
                    {divergencePct}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">FERTILITY RATE:</span>
                  <span
                    className={
                      divergencePct > 50
                        ? 'text-[#fda4af] font-bold'
                        : 'text-[#67e8f9] font-bold'
                    }
                  >
                    {currentTfr}
                  </span>
                </div>
              </div>

              {/* SVG Venn Wireframe Canvas */}
              <div className="relative w-full aspect-[4/3] max-h-[140px] sm:max-h-[270px] md:max-h-[350px] flex items-center justify-center">
                <svg
                  viewBox="0 0 400 340"
                  className="w-full h-full overflow-visible select-none"
                  role="img"
                  aria-label="Collapsing Venn Diagram of Family Support, Social Policies and Housing, and Financial Sustainability"
                >
                  <defs>
                    <radialGradient id="blackHoleGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#050608" stopOpacity="1" />
                      <stop offset="68%" stopColor="#0b0d11" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#fda4af" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heartGlowGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fda4af" stopOpacity="0.55" />
                      <stop offset="60%" stopColor="#86efac" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#121316" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Subtle Crosshair Axis Lines */}
                  <line
                    x1="200"
                    y1="20"
                    x2="200"
                    y2="320"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="30"
                    y1="166"
                    x2="370"
                    y2="166"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Circle 1: Family Support (Mint Green #86efac) */}
                  <g transform={`translate(${ax}, ${ay})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="75"
                      fill="#86efac"
                      fillOpacity="0.12"
                      stroke="#86efac"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="none"
                      stroke="#86efac"
                      strokeWidth="0.6"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <text
                      x="0"
                      y="-42"
                      textAnchor="middle"
                      fill="#86efac"
                      className="font-mono text-[9.5px] font-bold uppercase tracking-wider"
                    >
                      Family Support
                    </text>
                    <text
                      x="0"
                      y="-29"
                      textAnchor="middle"
                      fill="#cbd5e1"
                      className="font-mono text-[7px]"
                    >
                      Caregiving &amp; Extended Kin
                    </text>
                  </g>

                  {/* Circle 2: Social Policies & Housing (Pastel Cyan #67e8f9) */}
                  <g transform={`translate(${bx}, ${by})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="75"
                      fill="#67e8f9"
                      fillOpacity="0.12"
                      stroke="#67e8f9"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="none"
                      stroke="#67e8f9"
                      strokeWidth="0.6"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <text
                      x="0"
                      y="-42"
                      textAnchor="middle"
                      fill="#67e8f9"
                      className="font-mono text-[9.5px] font-bold uppercase tracking-wider"
                    >
                      Social Policies &amp; Housing
                    </text>
                    <text
                      x="0"
                      y="-29"
                      textAnchor="middle"
                      fill="#cbd5e1"
                      className="font-mono text-[7px]"
                    >
                      Parental Leave &amp; Shelter
                    </text>
                  </g>

                  {/* Circle 3: Financial Sustainability (Peach/Coral #fda4af) */}
                  <g transform={`translate(${cx}, ${cy})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="75"
                      fill="#fda4af"
                      fillOpacity="0.12"
                      stroke="#fda4af"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="none"
                      stroke="#fda4af"
                      strokeWidth="0.6"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <text
                      x="0"
                      y="42"
                      textAnchor="middle"
                      fill="#fda4af"
                      className="font-mono text-[9.5px] font-bold uppercase tracking-wider"
                    >
                      Financial Sustainability
                    </text>
                    <text
                      x="0"
                      y="55"
                      textAnchor="middle"
                      fill="#cbd5e1"
                      className="font-mono text-[7px]"
                    >
                      Mobility &amp; Real Savings
                    </text>
                  </g>

                  {/* INITIAL OVERLAP STATE: Glowing Heart ("Make Baby") */}
                  <g
                    opacity={makeBabyOpacity}
                    transform={`translate(200, 164) scale(${makeBabyScale})`}
                  >
                    <circle cx="0" cy="0" r="38" fill="url(#heartGlowGrad)" />
                    <circle
                      cx="0"
                      cy="0"
                      r="27"
                      fill="#121316"
                      fillOpacity="0.92"
                      stroke="#fda4af"
                      strokeWidth="1.5"
                    />
                    {/* Glowing Pastel Heart Path */}
                    <path
                      d="M0 -4 C-3 -9, -11 -9, -11 -2 C-11 4, 0 10, 0 13 C0 10, 11 4, 11 -2 C11 -9, 3 -9, 0 -4 Z"
                      fill="#fda4af"
                      fillOpacity="0.88"
                      stroke="#e2e8f0"
                      strokeWidth="0.8"
                      transform="translate(0, -6) scale(0.95)"
                    />
                    <text
                      x="0"
                      y="16"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      className="font-mono text-[8.5px] font-extrabold uppercase tracking-wider"
                    >
                      Make Baby
                    </text>
                  </g>

                  {/* SEPARATED NEGATIVE SPACE: "TFR BLACK HOLE" */}
                  <g
                    opacity={blackHoleOpacity}
                    transform={`translate(200, 164) scale(${blackHoleScale})`}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="46"
                      fill="url(#blackHoleGrad)"
                      stroke="#fda4af"
                      strokeWidth="1.4"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="34"
                      fill="#050608"
                      stroke="#c084fc"
                      strokeWidth="0.9"
                    />
                    <text
                      x="0"
                      y="-3"
                      textAnchor="middle"
                      fill="#fda4af"
                      className="font-mono text-[9px] font-extrabold uppercase tracking-[0.14em]"
                    >
                      TFR BLACK HOLE
                    </text>
                    <text
                      x="0"
                      y="9"
                      textAnchor="middle"
                      fill="#c084fc"
                      className="font-mono text-[7px] uppercase tracking-widest"
                    >
                      THE MIDDLE FELL THROUGH
                    </text>
                  </g>
                </svg>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[8.5px] sm:text-[10px] font-mono text-slate-400 leading-tight">
                <span className="truncate">{data.citation}</span>
              </div>
            </CyberPanel>
          </div>

          {/* RIGHT COLUMN: Flow-Aware CSS Grid Illustrated Story Cards (No Mobile Overlap) */}
          <div className="md:col-span-6 grid grid-cols-1 items-start md:items-center">
            {data.cards.map((card) => {
              const { opacity, y } = getCardEnvelope(
                scrollProgress,
                card.start,
                card.end
              );
              return (
                <div
                  key={card.id}
                  style={{
                    opacity,
                    transform: `translate3d(0, ${y}px, 0)`,
                    pointerEvents: opacity > 0.25 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <CyberPanel
                    label={card.headline}
                    accent={card.accent}
                    className="p-2.5 sm:p-4 lg:p-5"
                  >
                    {/* Animated Graphic-Novel Illustration inside each Venn Card */}
                    {card.image && (
                      <div className="relative w-full h-[115px] sm:h-[155px] md:h-[185px] mb-2 sm:mb-3 border border-slate-800 bg-[#0f1115] overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.headline}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              'linear-gradient(to top, rgba(18,19,22,0.7) 0%, transparent 55%)',
                          }}
                        />
                      </div>
                    )}

                    <p className="text-xs sm:text-sm lg:text-[15px] text-[#e2e8f0]/95 leading-snug sm:leading-relaxed mb-2 sm:mb-3">
                      {card.body}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[8.5px] sm:text-[10.5px] font-mono leading-tight">
                      <span style={{ color: card.accent }} className="font-bold">
                        {card.metric}
                      </span>
                      <span className="text-slate-400">{card.citation}</span>
                    </div>
                  </CyberPanel>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
