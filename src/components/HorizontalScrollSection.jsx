import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import PinnedStage from './PinnedStage';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const invLerp = (a, b, v) => clamp((v - a) / (b - a));

/**
 * Stepped horizontal camera curve: pauses on each of the 4 slides so the reader
 * can watch the slide's bar animation complete and read the full card while static.
 */
function getSteppedSlideIndex(p) {
  if (p < 0.20) return 0;
  if (p < 0.28) return invLerp(0.20, 0.28, p);
  if (p < 0.48) return 1;
  if (p < 0.56) return 1 + invLerp(0.48, 0.56, p);
  if (p < 0.74) return 2;
  if (p < 0.82) return 2 + invLerp(0.74, 0.82, p);
  return 3;
}

export default function HorizontalScrollSection({ data }) {
  const [imgErrors, setImgErrors] = useState({});
  const steps = data.steps || [];

  const barWindows = [
    [0.01, 0.12],
    [0.24, 0.36],
    [0.52, 0.64],
    [0.78, 0.90],
  ];

  return (
    <PinnedStage
      id="protest-cycle"
      ariaLabel={data.sectionTitle}
      heightVh={360}
      className="bg-[#0c0d10] border-b border-neutral-800"
    >
      {(progress) => {
        const steppedSlide = getSteppedSlideIndex(progress);
        const translateXPct = -(steppedSlide / 4) * 100; // 0% -> -75%
        const activeIdx = Math.min(3, Math.round(steppedSlide));

        return (
          <div className="relative w-full h-full flex flex-col justify-between bg-[#0c0d10] bg-sumi-grid overflow-hidden">
            {/* Top Header — Clean Section Title Only */}
            <div className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-10 pt-14 sm:pt-16 pb-2 sm:pb-3 border-b border-neutral-800 flex items-end justify-between gap-6 shrink-0">
              <h2 className="font-serif text-xl sm:text-4xl font-bold text-[#e6e4dd]">
                {data.sectionTitle}
              </h2>
            </div>

            {/* Stepped Horizontal Track (400vw) */}
            <div className="relative flex-1 flex items-center overflow-hidden">
              <div
                style={{ transform: `translateX(${translateXPct}%)` }}
                className="flex w-[400vw] h-full items-center will-change-transform"
              >
                {steps.map((item, index) => {
                  const imageSrc =
                    item.image || `/issues/issue-01/protest-${index + 1}.webp`;
                  const [bStart, bEnd] = barWindows[index] || [0, 1];
                  const barPct =
                    invLerp(bStart, bEnd, progress) * item.tensionLevel;

                  return (
                    <article
                      key={item.phaseTitle}
                      className={`relative w-screen h-full shrink-0 flex items-center justify-center px-4 sm:px-12 ${
                        index < steps.length - 1
                          ? 'border-r border-neutral-800'
                          : ''
                      }`}
                    >
                      <div
                        className={`ink-panel ${
                          item.accent === '#dc2626' ? 'ink-panel-crimson' : ''
                        } relative w-full max-w-5xl border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md overflow-hidden`}
                      >
                        {!imgErrors[index] && (
                          <div className="relative h-28 sm:h-56 md:h-72 w-full overflow-hidden border-b border-neutral-800 bg-[#08090a]">
                            <img
                              src={imageSrc}
                              alt={item.phaseTitle}
                              width="1376"
                              height="768"
                              loading="lazy"
                              onError={() =>
                                setImgErrors((prev) => ({
                                  ...prev,
                                  [index]: true,
                                }))
                              }
                              className="w-full h-full object-cover opacity-85 mix-blend-lighten contrast-125"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1014] via-[#0e1014]/25 to-transparent" />
                          </div>
                        )}

                        <div className="p-3 sm:p-7 md:p-9 grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-6 lg:gap-8 items-center">
                          <div className="lg:col-span-8">
                            <h3 className="font-serif text-base sm:text-3xl md:text-4xl font-bold text-[#e6e4dd] tracking-tight mb-1 sm:mb-3">
                              {item.phaseTitle}
                            </h3>
                            <p className="font-editorial text-[13px] sm:text-xl md:text-2xl text-[#e6e4dd] leading-snug sm:leading-relaxed mb-1.5 sm:mb-3">
                              {item.copy}
                            </p>
                            {item.aftermathCopy && (
                              <p className="font-editorial text-xs sm:text-lg text-[#d97706] italic leading-snug sm:leading-relaxed border-l-2 border-[#dc2626] pl-2.5 sm:pl-4 mt-1 sm:mt-3">
                                {item.aftermathCopy}
                              </p>
                            )}
                          </div>

                          <div className="lg:col-span-4 flex flex-col justify-between p-2.5 sm:p-5 bg-[#08090a] border border-neutral-800">
                            <div className="flex lg:block items-baseline justify-between gap-2">
                              <div>
                                <span className="font-mono text-[9.5px] sm:text-xs uppercase tracking-widest text-[#e6e4dd]/60 block mb-0.5 sm:mb-1">
                                  ESCALATION SCALE
                                </span>
                                <div
                                  className="font-mono text-lg sm:text-3xl md:text-4xl font-bold tracking-tight my-0.5 sm:my-1.5"
                                  style={{ color: item.accent }}
                                >
                                  {item.crowdCount}
                                </div>
                              </div>
                              <span className="font-mono text-[9.5px] sm:text-xs uppercase tracking-widest text-[#e6e4dd]/80">
                                {item.crowdUnit}
                              </span>
                            </div>

                            <div className="mt-2 sm:mt-5 pt-2 sm:pt-4 border-t border-neutral-800">
                              <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs mb-1 sm:mb-2">
                                <span className="text-[#e6e4dd]/60 uppercase">
                                  STREET TENSION
                                </span>
                                <span
                                  style={{ color: item.accent }}
                                  className="font-bold"
                                >
                                  {item.tensionLevel}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 sm:h-2.5 bg-[#1f232b] overflow-hidden p-0.5 mb-1 sm:mb-2">
                                <div
                                  style={{
                                    width: `${barPct}%`,
                                    backgroundColor: item.accent,
                                  }}
                                  className="h-full"
                                />
                              </div>
                              <div className="font-mono text-[9px] sm:text-[10px] text-[#e6e4dd]/60 leading-tight">
                                Ref: Carnegie Global Protest Tracker (2024–25) &amp; ACLED Demonstration Monitor
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Stepped Timeline Bar */}
            <div className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-10 pb-3 sm:pb-6 pt-2 sm:pt-3 border-t border-neutral-800 shrink-0">
              <div className="hidden sm:flex items-center justify-between font-mono text-xs text-[#e6e4dd]/60 mb-2">
                {steps.map((s, idx) => (
                  <div
                    key={s.phaseTitle}
                    className={`flex items-center gap-2 ${
                      idx === activeIdx ? 'text-[#e6e4dd] font-bold' : ''
                    }`}
                  >
                    <span>{s.phaseTitle}</span>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-600 ml-2" />
                    )}
                  </div>
                ))}
              </div>
              <div className="h-1.5 w-full bg-[#08090a] border border-neutral-800 overflow-hidden">
                <div
                  style={{ width: `${25 + (steppedSlide / 3) * 75}%` }}
                  className="h-full bg-gradient-to-r from-[#d97706] via-[#dc2626] to-[#d97706]"
                />
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
