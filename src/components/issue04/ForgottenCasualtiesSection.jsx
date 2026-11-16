import React from 'react';
import PinnedStage from '../PinnedStage';
import { getSteppedSlideIndex, clamp, remap } from '../../utils/math';

/**
 * ForgottenCasualtiesSection (Beat 4) — True Widescreen Stepped Horizontal Scroll Gallery
 * Uses `shrink-0` w-screen slides and `-steppedPos * 100vw` translation so each of the 4 points
 * is boxed inside a spacious widescreen rounded card rather than squished into narrow columns.
 */
export default function ForgottenCasualtiesSection({ data }) {
  const slides = data.slides || [];
  const totalSlides = slides.length;

  return (
    <PinnedStage id="forgotten-casualties" heightMultiplier={4.8}>
      {(progress) => {
        const steppedPos = getSteppedSlideIndex(progress, totalSlides, 0.62);
        const activeIdx = Math.min(totalSlides - 1, Math.round(steppedPos));

        return (
          <div className="relative w-full h-full bg-[#090a0f] text-[#e2e8f0] overflow-hidden flex flex-col justify-between pt-16 pb-4">
            {/* Full-Bleed Crossfading Background Matching Active Horizontal Card */}
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className="pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{
                  backgroundImage: `url('${s.image}')`,
                  opacity: activeIdx === idx ? 0.24 : 0,
                }}
              />
            ))}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(9,10,15,0.48) 0%, rgba(9,10,15,0.92) 85%)',
              }}
            />

            {/* Top Header & Horizontal Track Progress Pills */}
            <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-800/80">
              <div>
                <h2 className="text-base sm:text-2xl font-black text-white tracking-tight">
                  {data.title}
                </h2>
                <p className="hidden sm:block text-xs text-neutral-400">
                  {data.subtitle}
                </p>
              </div>

              {/* Horizontal Slide Stepper Pills */}
              <div className="flex items-center gap-1.5 bg-[#0e1017]/90 px-3 py-1.5 rounded-full border border-neutral-800">
                <span className="font-mono text-[9px] sm:text-[10px] text-[#eab308] uppercase font-bold mr-1">
                  0{activeIdx + 1} / 0{totalSlides}
                </span>
                {slides.map((s, idx) => (
                  <span
                    key={s.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIdx === idx
                        ? 'w-7 bg-[#ef4444]'
                        : idx < activeIdx
                          ? 'w-2 bg-[#eab308]'
                          : 'w-2 bg-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Widescreen Horizontal Track: Each slide is 100vw wide (shrink-0) */}
            <div className="relative z-10 flex-1 flex items-center overflow-hidden my-1 sm:my-2">
              <div
                style={{
                  transform: `translate3d(-${steppedPos * 100}vw, 0, 0)`,
                }}
                className="flex items-center shrink-0 transition-transform duration-150 ease-out will-change-transform"
              >
                {slides.map((slide, idx) => {
                  const slideStart = idx / totalSlides;
                  const slideEnd = (idx + 1) / totalSlides;
                  const barFill = clamp(
                    remap(
                      progress,
                      slideStart,
                      slideStart + (slideEnd - slideStart) * 0.65,
                      0.18,
                      1
                    ),
                    0.18,
                    1
                  );

                  return (
                    <article
                      key={slide.id}
                      className="w-screen shrink-0 flex items-center justify-center px-3 sm:px-8"
                    >
                      <div
                        style={{
                          borderColor: `${slide.accent}55`,
                          boxShadow:
                            '0 25px 65px rgba(0,0,0,0.92), inset 0 1px 0 rgba(255,255,255,0.06)',
                        }}
                        className="w-full max-w-5xl rounded-3xl bg-[#0b0d14]/95 border overflow-hidden backdrop-blur-xl grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 p-4 sm:p-7 items-center"
                      >
                        {/* Left 7 Cols: Large Rounded Animated Illustration + Floating Stat Pill */}
                        <div className="md:col-span-7 relative aspect-[16/9] max-h-[140px] sm:max-h-[320px] w-full rounded-2xl overflow-hidden border border-neutral-800 bg-[#090a0f]">
                          <img
                            src={slide.image}
                            alt={slide.headline}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#090a0f]/90 border border-neutral-700 font-mono text-[8.5px] sm:text-[10px] font-bold text-[#eab308] uppercase tracking-wider backdrop-blur-md">
                            {slide.badge}
                          </div>

                          {/* Giant Rounded Stat Callout Badge */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#090a0f]/92 border border-neutral-800 backdrop-blur-md">
                            <div>
                              <div className="font-mono text-[8px] sm:text-[9.5px] text-neutral-400 uppercase">
                                {slide.statLabel}
                              </div>
                              <div
                                style={{ color: slide.accent }}
                                className="font-mono text-base sm:text-2xl font-black"
                              >
                                {slide.stat}
                              </div>
                            </div>
                            <div className="w-24 sm:w-36 h-2 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
                              <div
                                style={{
                                  width: `${Math.round(barFill * 100)}%`,
                                  backgroundColor: slide.accent,
                                }}
                                className="h-full rounded-full transition-all duration-150"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right 5 Cols: Boxed Rounded Narrative Card */}
                        <div className="md:col-span-5 p-3.5 sm:p-5 rounded-2xl bg-[#10131d]/90 border border-neutral-800/90 flex flex-col justify-between space-y-2.5 sm:space-y-4">
                          <div className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[9px] sm:text-[10px] text-[#eab308] font-bold">
                            <span>
                              0{idx + 1} / 0{totalSlides} • ELDERLY COHORT TELEMETRY
                            </span>
                          </div>

                          <h3 className="text-base sm:text-2xl font-extrabold text-white leading-snug">
                            {slide.headline}
                          </h3>

                          <p className="text-xs sm:text-base text-neutral-200 leading-snug sm:leading-relaxed">
                            {slide.body}
                          </p>

                          <div className="pt-2 border-t border-neutral-800/80 font-mono text-[8.5px] sm:text-[10px] text-neutral-400">
                            {slide.citation}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Scroll Progress Track */}
            <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] text-neutral-400">
              <span>SCROLL TO GLIDE HORIZONTALLY →</span>
              <span className="truncate">{data.citation}</span>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
