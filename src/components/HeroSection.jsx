import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PinnedStage from './PinnedStage';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const invLerp = (a, b, v) => clamp((v - a) / (b - a));

export default function HeroSection({ data, meta }) {
  const [imgError, setImgError] = useState(false);
  const heroImageSrc = data.image || '/issues/issue-01/substack-header-16x9.webp';

  return (
    <PinnedStage
      id="hero"
      ariaLabel="Watering Grass in a Thunderstorm"
      heightVh={260}
      className="bg-[#0d0d0d] border-b border-neutral-800"
    >
      {(progress) => {
        const coverFade = 1 - invLerp(0.14, 0.38, progress);
        const coverOpacity = Math.max(0.08, coverFade * 0.9);
        const coverScale = 1 + invLerp(0, 0.45, progress) * 0.14;

        const titleExit = invLerp(0.12, 0.34, progress);
        const titleOpacity = 1 - titleExit;
        const titleY = -titleExit * 72;
        const titleScale = 1 - titleExit * 0.14;

        const cardEnter = invLerp(0.24, 0.40, progress);
        const cardOpacity = cardEnter;
        const cardY = (1 - cardEnter) * 44;
        const cardScale = 0.94 + cardEnter * 0.06;

        const barPct = invLerp(0.32, 0.48, progress) * 100;
        const cueOpacity = 1 - invLerp(0, 0.14, progress);

        return (
          <div className="relative w-full h-full flex items-center justify-center px-6 sm:px-10 bg-[#0d0d0d]">
            {/* Layer 1: Full-Screen Sumi-e Cover Image */}
            {!imgError && (
              <div
                style={{
                  opacity: coverOpacity,
                  transform: `scale(${coverScale})`,
                }}
                className="pointer-events-none absolute inset-0 z-0 will-change-transform"
              >
                <img
                  src={heroImageSrc}
                  alt="Sumi-e illustration of a lone figure watering barren cracked earth in a thunderstorm"
                  fetchPriority="high"
                  width="1376"
                  height="768"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/50 via-transparent to-[#0d0d0d]" />
              </div>
            )}

            {/* Layer 2: Faint, slow-pulsing background visual of rain falling on dry cracked soil */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 animate-pulse"
              style={{ animationDuration: '4.2s' }}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 1200 800"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="cold-open-rain"
                    width="120"
                    height="160"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(12)"
                  >
                    <line
                      x1="30"
                      y1="0"
                      x2="30"
                      y2="55"
                      stroke="#e6e4dd"
                      strokeWidth="1"
                      strokeOpacity="0.24"
                    />
                    <line
                      x1="90"
                      y1="65"
                      x2="90"
                      y2="135"
                      stroke="#d97706"
                      strokeWidth="1"
                      strokeOpacity="0.18"
                    />
                  </pattern>
                </defs>
                <rect width="1200" height="800" fill="url(#cold-open-rain)" />
                <g
                  stroke="#e6e4dd"
                  strokeOpacity="0.18"
                  strokeWidth="1.2"
                  fill="none"
                >
                  <path d="M 0 710 Q 300 695 600 712 T 1200 705" />
                  <path d="M 180 710 L 145 755 L 195 795" />
                  <path d="M 460 706 L 490 748 L 440 790" />
                  <path d="M 490 748 L 545 775" />
                  <path d="M 780 712 L 750 760 L 810 798" />
                  <path d="M 1020 708 L 1055 752 L 1010 795" />
                </g>
              </svg>
            </div>

            {/* Stage A: Opening Full-Screen Title */}
            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px) scale(${titleScale})`,
                pointerEvents: titleOpacity > 0.2 ? 'auto' : 'none',
              }}
              className="absolute inset-x-6 z-10 max-w-5xl mx-auto text-center will-change-transform"
            >
              <div className="inline-block px-3.5 py-1 mb-5 border border-neutral-700 bg-[#08090a]/85 font-mono text-xs uppercase tracking-[0.25em] text-[#d97706]">
                {meta.publication}
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#e6e4dd] leading-[1.05] drop-shadow-[0_8px_28px_rgba(0,0,0,0.95)]">
                Watering Grass in a{' '}
                <span className="block sm:inline italic font-editorial font-normal text-[#dc2626]">
                  Thunderstorm
                </span>
              </h1>
            </div>

            {/* Stage B: Opening Card — Locked dead-center on the #0d0d0d black screen */}
            <div
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px) scale(${cardScale})`,
                pointerEvents: cardOpacity > 0.2 ? 'auto' : 'none',
              }}
              className="absolute inset-x-4 sm:inset-x-6 z-20 max-w-3xl mx-auto will-change-transform"
            >
              <div className="ink-panel ink-panel-crimson border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md p-4 sm:p-10 shadow-2xl">
                <p className="font-editorial text-lg sm:text-2xl md:text-3xl text-[#e6e4dd] leading-snug sm:leading-relaxed font-medium mb-4 sm:mb-6">
                  {data.paragraphs[0]}
                </p>

                <div className="border-l-2 border-[#dc2626] pl-3.5 sm:pl-5">
                  <p className="font-sans text-sm sm:text-lg md:text-xl text-[#e6e4dd]/90 leading-snug sm:leading-relaxed mb-3.5 sm:mb-5">
                    {data.paragraphs[1]}
                  </p>

                  {/* Scroll-Driven Bar Chart that completes and stays static during reading hold */}
                  <div className="p-2.5 sm:p-3.5 bg-[#08090a] border border-neutral-800">
                    <div className="flex items-center justify-between font-mono text-[11px] sm:text-xs mb-1.5 sm:mb-2">
                      <span className="text-[#e6e4dd]/70 uppercase">
                        1.5°C CLIMATE GOAL BREACH
                      </span>
                      <span className="text-[#dc2626] font-bold">
                        +1.55°C BREACHED
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#1f232b] overflow-hidden mb-1.5 sm:mb-2">
                      <div
                        style={{ width: `${barPct}%` }}
                        className="h-full bg-gradient-to-r from-[#d97706] to-[#dc2626]"
                      />
                    </div>
                    <div className="font-mono text-[10px] sm:text-[11px] text-[#e6e4dd]/55 leading-tight">
                      Ref: World Meteorological Organization (WMO), &ldquo;State of the Global Climate 2024&rdquo; &amp; EU Copernicus Climate Change Service (2025)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Scroll Cue */}
            <div
              style={{ opacity: cueOpacity }}
              className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#e6e4dd]/80">
                {data.scrollHint}
              </span>
              <div className="w-10 h-10 border border-neutral-700 bg-[#08090a]/90 flex items-center justify-center animate-bounce">
                <ChevronDown className="w-5 h-5 text-[#dc2626]" />
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
