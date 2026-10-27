import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import issueData from './data/issueData.json';
import HeroSection from './components/HeroSection';
import StickySplitSection from './components/StickySplitSection';
import HorizontalScrollSection from './components/HorizontalScrollSection';
import DataComparisonSection from './components/DataComparisonSection';
import ConclusionSection from './components/ConclusionSection';

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-[#0c0d10] text-[#e6e4dd] selection:bg-[#dc2626] selection:text-[#e6e4dd]">
      {/* Global SVG Filters: Washi Rice Paper Grain (opacity 0.04) & Sumi-e Brush Edge Displacement */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 w-full h-full z-50 opacity-[0.04]"
      >
        <defs>
          <filter id="washi-paper-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.78"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id="sumi-brush-stroke" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.035"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="3.8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#washi-paper-noise)" />
      </svg>

      {/* Top Crimson/Amber Ink Brush Progress Bar */}
      <motion.div
        style={{ scaleX }}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dc2626] via-[#d97706] to-[#dc2626] origin-left z-50 shadow-[0_0_12px_rgba(220,38,38,0.65)]"
      />

      {/* Floating Graphic Novel Act Index (Desktop) */}
      <nav
        aria-label="Graphic Novel Acts"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 p-2.5 ink-panel border border-neutral-800 bg-[#0e1014]/90 backdrop-blur-md"
      >
        {[
          { href: '#hero', label: 'PROLOGUE // Storm' },
          { href: '#fracture', label: 'ACT I // The Fracture' },
          { href: '#protest-cycle', label: 'ACT II // Protest Scroll' },
          { href: '#budget-imbalance', label: 'ACT III // The Scale' },
          { href: '#conclusion', label: 'ACT IV // Reckoning' },
        ].map((chapter) => (
          <a
            key={chapter.href}
            href={chapter.href}
            title={chapter.label}
            aria-label={chapter.label}
            className="group relative flex items-center justify-center w-3 h-3 rotate-45 border border-neutral-600 bg-[#08090a] hover:bg-[#dc2626] hover:border-[#e6e4dd] transition-colors"
          >
            <span className=" -rotate-45 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-7 whitespace-nowrap px-2.5 py-1 border border-neutral-800 bg-[#08090a] font-mono text-[10px] uppercase tracking-widest text-[#e6e4dd]">
              {chapter.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Main Scrollytelling Visual Essay Flow */}
      <main className="relative z-10">
        <HeroSection data={issueData.hero} meta={issueData.meta} />
        <StickySplitSection data={issueData.stickySplit} />
        <HorizontalScrollSection data={issueData.protestCycle} />
        <DataComparisonSection data={issueData.dataComparison} />
        <ConclusionSection data={issueData.conclusion} meta={issueData.meta} />
      </main>
    </div>
  );
}
