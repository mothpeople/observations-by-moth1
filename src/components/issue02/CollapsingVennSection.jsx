import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import CyberPanel from './CyberPanel';
import { getCardEnvelope } from '../../utils/math';

export default function CollapsingVennSection({ data }) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(latest);
  });

  // Circle A: Family Support (Mint #86efac) — moves Top-Left outward
  const circleAX = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [175, 175, 108, 108]);
  const circleAY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [150, 150, 96, 96]);

  // Circle B: Social Policies & Housing (Cyan #67e8f9) — moves Top-Right outward
  const circleBX = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [225, 225, 292, 292]);
  const circleBY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [150, 150, 96, 96]);

  // Circle C: Financial Sustainability (Coral #fda4af) — moves Bottom-Center outward
  const circleCX = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [200, 200, 200, 200]);
  const circleCY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [192, 192, 268, 268]);

  // Center "MAKE BABY" intersection fades out as circles drift apart
  const makeBabyOpacity = useTransform(scrollYProgress, [0, 0.18, 0.42], [1, 1, 0]);
  const makeBabyScale = useTransform(scrollYProgress, [0, 0.18, 0.42], [1, 1, 0.65]);

  // Center "TFR BLACK HOLE" negative space fades in as circles separate
  const blackHoleOpacity = useTransform(scrollYProgress, [0.35, 0.62, 1], [0, 1, 1]);
  const blackHoleScale = useTransform(scrollYProgress, [0.35, 0.68, 1], [0.55, 1, 1.05]);

  // Separation distance metric (0% -> 100% divergence)
  const divergencePct = Math.round(
    Math.min(100, Math.max(0, ((scrollProgress - 0.18) / 0.54) * 100))
  );
  const currentTfr = (2.1 - (divergencePct / 100) * 1.13).toFixed(2);

  return (
    <section
      id="beat-2"
      ref={containerRef}
      style={{ height: '300vh' }}
      className="relative w-full bg-[#0f1115] text-[#e2e8f0]"
    >
      <div className="sticky top-0 left-0 w-full stage-dvh overflow-hidden flex items-center justify-center">
        {/* Technical Grid & Subtle Radial Glow */}
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
              'radial-gradient(circle at 30% 50%, rgba(134,239,172,0.06) 0%, rgba(15,17,21,0.96) 75%)',
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-4 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
          {/* LEFT COLUMN: Interactive Collapsing SVG Venn Diagram */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            <CyberPanel
              tag={data.tag}
              accent="#86efac"
              className="w-full p-3 sm:p-5 md:p-6"
            >
              {/* Top Telemetry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-slate-800/80 text-[10px] sm:text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">STRUCTURAL DIVERGENCE:</span>
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
                  <span className="text-slate-400">IMPLIED URBAN TFR:</span>
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

              {/* SVG Venn Canvas */}
              <div className="relative w-full aspect-[4/3] max-h-[250px] sm:max-h-[320px] md:max-h-[380px] flex items-center justify-center">
                <svg
                  viewBox="0 0 400 340"
                  className="w-full h-full overflow-visible select-none"
                  role="img"
                  aria-label="Collapsing Venn Diagram of Family Support, Social Policies and Housing, and Financial Sustainability"
                >
                  <defs>
                    <radialGradient id="blackHoleGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#090a0d" stopOpacity="0.98" />
                      <stop offset="65%" stopColor="#0f1115" stopOpacity="0.92" />
                      <stop offset="100%" stopColor="#fda4af" stopOpacity="0" />
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
                    y1="168"
                    x2="370"
                    y2="168"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Circle A: Family Support (Mint #86efac) */}
                  <motion.g style={{ x: circleAX, y: circleAY }}>
                    <circle
                      cx="0"
                      cy="0"
                      r="74"
                      fill="#86efac"
                      fillOpacity="0.14"
                      stroke="#86efac"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="none"
                      stroke="#86efac"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
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
                      fill="#94a3b8"
                      className="font-mono text-[7.5px]"
                    >
                      [Kin & Village Care]
                    </text>
                  </motion.g>

                  {/* Circle B: Social Policies & Housing (Cyan #67e8f9) */}
                  <motion.g style={{ x: circleBX, y: circleBY }}>
                    <circle
                      cx="0"
                      cy="0"
                      r="74"
                      fill="#67e8f9"
                      fillOpacity="0.14"
                      stroke="#67e8f9"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="none"
                      stroke="#67e8f9"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
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
                      fill="#94a3b8"
                      className="font-mono text-[7.5px]"
                    >
                      [Space &amp; Time Security]
                    </text>
                  </motion.g>

                  {/* Circle C: Financial Sustainability (Coral #fda4af) */}
                  <motion.g style={{ x: circleCX, y: circleCY }}>
                    <circle
                      cx="0"
                      cy="0"
                      r="74"
                      fill="#fda4af"
                      fillOpacity="0.14"
                      stroke="#fda4af"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="70"
                      fill="none"
                      stroke="#fda4af"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                      opacity="0.6"
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
                      fill="#94a3b8"
                      className="font-mono text-[7.5px]"
                    >
                      [1-to-2 Income Cushion]
                    </text>
                  </motion.g>

                  {/* INITIAL OVERLAP STATE: "Make Baby" */}
                  <motion.g
                    style={{
                      opacity: makeBabyOpacity,
                      scale: makeBabyScale,
                      transformOrigin: '200px 164px',
                    }}
                  >
                    <circle
                      cx="200"
                      cy="164"
                      r="28"
                      fill="#0f1115"
                      fillOpacity="0.9"
                      stroke="#86efac"
                      strokeWidth="1.5"
                    />
                    <text
                      x="200"
                      y="162"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      className="font-mono text-[9.5px] font-extrabold uppercase tracking-wider"
                    >
                      Make Baby
                    </text>
                    <text
                      x="200"
                      y="173"
                      textAnchor="middle"
                      fill="#86efac"
                      className="font-mono text-[7px] uppercase tracking-widest"
                    >
                      2.1 TFR Overlap
                    </text>
                  </motion.g>

                  {/* SEPARATED NEGATIVE SPACE: "TFR BLACK HOLE" */}
                  <motion.g
                    style={{
                      opacity: blackHoleOpacity,
                      scale: blackHoleScale,
                      transformOrigin: '200px 164px',
                    }}
                  >
                    <circle
                      cx="200"
                      cy="164"
                      r="44"
                      fill="url(#blackHoleGrad)"
                      stroke="#fda4af"
                      strokeWidth="1.25"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx="200"
                      cy="164"
                      r="32"
                      fill="#08090c"
                      stroke="#c084fc"
                      strokeWidth="0.8"
                    />
                    <text
                      x="200"
                      y="160"
                      textAnchor="middle"
                      fill="#fda4af"
                      className="font-mono text-[9px] font-extrabold uppercase tracking-[0.14em]"
                    >
                      TFR BLACK HOLE
                    </text>
                    <text
                      x="200"
                      y="172"
                      textAnchor="middle"
                      fill="#c084fc"
                      className="font-mono text-[7px] uppercase tracking-widest"
                    >
                      0.72 – 0.97 VOID
                    </text>
                  </motion.g>
                </svg>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{data.citation}</span>
                <span className="text-[#c084fc]">SCROLL TO SEPARATE ↗</span>
              </div>
            </CyberPanel>
          </div>

          {/* RIGHT COLUMN: Flow-Aware CSS Grid Story Cards (No Mobile Overlap) */}
          <div className="md:col-span-5 grid grid-cols-1 items-start md:items-center">
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
                  <CyberPanel tag={card.badge} accent={card.accent}>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#e2e8f0] tracking-tight leading-snug mb-3">
                      {card.headline}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                      {card.body}
                    </p>
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span style={{ color: card.accent }} className="font-bold">
                        {card.metric}
                      </span>
                      <span className="text-slate-500">
                        VENN STATE // {divergencePct < 35 ? 'INTACT' : 'COLLAPSED'}
                      </span>
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
