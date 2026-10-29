import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const BACKGROUND_SCENES = [
  {
    id: 'scene-02-hero',
    issueId: '02',
    image: '/issues/issue-02/hero-machine.webp',
    label: 'Issue #02 • The Meat Grinder Needs More Meat',
    accent: '#86efac',
  },
  {
    id: 'scene-01-hero',
    issueId: '01',
    image: '/issues/issue-01/hero-storm.webp',
    label: 'Issue #01 • Watering Grass in a Thunderstorm',
    accent: '#d97706',
  },
  {
    id: 'scene-02-earth',
    issueId: '02',
    image: '/issues/issue-02/quiet-earth.webp',
    label: 'Issue #02 • Biological Correction',
    accent: '#67e8f9',
  },
  {
    id: 'scene-01-protest',
    issueId: '01',
    image: '/issues/issue-01/protest-1.webp',
    label: 'Issue #01 • The Geriatric Disconnect',
    accent: '#dc2626',
  },
];

export default function LandingPage({ dispatches = [] }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [hoveredIssueId, setHoveredIssueId] = useState(null);
  const [email, setEmail] = useState('');

  // Automatically crossfade between animated topic backgrounds every 5 seconds
  useEffect(() => {
    if (hoveredIssueId) return;
    const timer = setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % BACKGROUND_SCENES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hoveredIssueId]);

  const activeScene = hoveredIssueId
    ? BACKGROUND_SCENES.find((s) => s.issueId === hoveredIssueId) ||
      BACKGROUND_SCENES[sceneIndex]
    : BACKGROUND_SCENES[sceneIndex];

  const handleSubscribe = (e) => {
    e.preventDefault();
    const targetUrl = email.trim()
      ? `https://observationsbymoth1.substack.com/subscribe?email=${encodeURIComponent(email.trim())}`
      : 'https://observationsbymoth1.substack.com/subscribe';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Display newest dispatch first, followed by earlier issues
  const orderedDispatches = [...dispatches].reverse();

  return (
    <div className="relative min-h-screen w-full bg-[#090a0d] text-[#e6e4dd] overflow-x-hidden flex flex-col justify-between pt-16 sm:pt-20 pb-8 px-4 sm:px-8">
      {/* FULL-SCREEN DYNAMIC CROSSFADING ANIMATED ARTWORK BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#090a0d]">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.52, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.5, ease: 'easeInOut' },
              scale: { duration: 6.5, ease: 'linear' },
            }}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url('${activeScene.image}')`,
            }}
          />
        </AnimatePresence>

        {/* Deep Vignette & Readability Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 28%, rgba(9,10,13,0.42) 0%, rgba(9,10,13,0.92) 82%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10 max-w-6xl w-full mx-auto my-auto space-y-6 sm:space-y-9 py-2 sm:py-6">
        {/* 1. Publication Introduction & Manifesto */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2.5 border border-white/15 bg-[#0e1014]/90 backdrop-blur-md px-3.5 py-1.5">
            <img
              src="/favicon.png"
              alt=""
              aria-hidden="true"
              className="w-4 h-4 rounded-xs object-cover"
            />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#86efac] font-semibold">
              Interactive Visual Essays &amp; Dispatches
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-[#e6e4dd] leading-[1.05] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            Observations by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d97706] via-[#86efac] to-[#67e8f9]">
              Moth1
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-[#e6e4dd]/90 leading-relaxed font-normal max-w-2xl">
            Visual essays on power, generational economics, and street-level
            reality. Dissecting the structural contradictions we are told to
            accept, through animated graphic-novel scrollytelling and empirical
            data.
          </p>
        </div>

        {/* 2. Interactive Dispatches Grid (Direct Links to All Topics) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/15 pb-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#e6e4dd]/70">
            <span>Select a Dispatch to Launch Interactive Exploration</span>
            <span className="hidden sm:inline text-[#86efac]">
              {dispatches.length} Issues Published
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {orderedDispatches.map((issue, idx) => {
              const isIssue02 = issue.id === '02';
              const accent = isIssue02 ? '#86efac' : '#d97706';

              return (
                <Link
                  key={issue.id}
                  to={`/${issue.slug}`}
                  onMouseEnter={() => setHoveredIssueId(issue.id)}
                  onMouseLeave={() => setHoveredIssueId(null)}
                  onFocus={() => setHoveredIssueId(issue.id)}
                  onBlur={() => setHoveredIssueId(null)}
                  style={{
                    borderColor:
                      hoveredIssueId === issue.id
                        ? accent
                        : 'rgba(255,255,255,0.14)',
                  }}
                  className="group relative bg-[#0e1014]/90 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)] hover:-translate-y-1"
                >
                  {/* Animated Issue Artwork Preview */}
                  <div className="relative w-full aspect-[16/8.5] overflow-hidden bg-[#08090a] border-b border-white/10">
                    <img
                      src={issue.cover}
                      alt={issue.title}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(14,16,20,0.92) 0%, rgba(14,16,20,0.15) 55%, rgba(14,16,20,0.45) 100%)',
                      }}
                    />

                    {/* Top-Left Issue Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        style={{
                          backgroundColor: accent,
                          color: '#090a0d',
                        }}
                        className="px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-widest"
                      >
                        ISSUE #{issue.id}
                      </span>
                      {idx === 0 && (
                        <span className="px-2.5 py-0.5 bg-[#090a0d]/90 border border-white/20 font-mono text-[10px] uppercase tracking-widest text-[#e6e4dd]">
                          LATEST
                        </span>
                      )}
                    </div>

                    {/* Top-Right Date & Read Time */}
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#090a0d]/85 border border-white/15 font-mono text-[10px] uppercase tracking-wider text-[#e6e4dd]/80">
                      {issue.date}
                      {issue.readTime ? ` • ${issue.readTime}` : ''}
                    </div>
                  </div>

                  {/* Card Copy & Launch CTA */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#e6e4dd] group-hover:text-white tracking-tight leading-snug mb-2">
                        {issue.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#e6e4dd]/75 leading-relaxed mb-4">
                        {issue.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                      <span
                        style={{ color: accent }}
                        className="font-bold group-hover:underline"
                      >
                        Launch Exploration
                      </span>
                      <ArrowUpRight
                        style={{ color: accent }}
                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. Substack Subscription Box & Dynamic Background Indicator */}
        <div className="p-4 sm:p-6 bg-[#0e1014]/90 backdrop-blur-md border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#d97706] font-bold">
              Subscribe to Observations by Moth1
            </div>
            <p className="text-xs sm:text-sm text-[#e6e4dd]/75">
              Receive new interactive visual essays and Substack companion
              dispatches directly in your inbox.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              aria-label="Email address for Substack subscription"
              className="bg-[#08090a] border border-neutral-700 px-3.5 py-2 text-xs font-mono text-[#e6e4dd] placeholder:text-neutral-500 focus:outline-none focus:border-[#d97706] min-w-[220px]"
            />
            <button
              type="submit"
              className="bg-[#d97706] hover:bg-[#f59e0b] text-[#08090a] font-mono text-xs font-extrabold uppercase tracking-[0.18em] px-5 py-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              Subscribe ↗
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar: Dynamic Background Scene Indicator */}
      <div className="relative z-10 max-w-6xl w-full mx-auto pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-[#e6e4dd]/60">
        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: activeScene.accent }}
            className="w-2 h-2 rounded-full animate-pulse"
          />
          <span className="uppercase tracking-wider">
            Background Canvas: {activeScene.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {BACKGROUND_SCENES.map((scene, i) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => {
                setHoveredIssueId(null);
                setSceneIndex(i);
              }}
              aria-label={`Show background scene: ${scene.label}`}
              style={{
                backgroundColor:
                  activeScene.id === scene.id
                    ? activeScene.accent
                    : 'rgba(255,255,255,0.2)',
              }}
              className="h-1.5 w-5 transition-all cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
