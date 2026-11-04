import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import DossierCard from './DossierCard';
import { clamp, remap, getCardEnvelope } from '../../utils/math';
import { recordSiteEvent } from '../../utils/telemetry';

export default function MirrorConclusionSection({ data, sources }) {
  const [email, setEmail] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 35 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x, y });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    recordSiteEvent('substack_subscribe', {
      path: '/war-on-drugs',
      issueId: '03',
      email: email.trim(),
    });
    const targetUrl = email.trim()
      ? `https://observationsbymoth1.substack.com/subscribe?email=${encodeURIComponent(email.trim())}`
      : 'https://observationsbymoth1.substack.com/subscribe';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Beat 8: Full-Screen Surveillance Mirror Finale with 2 Sequenced Stages */}
      <PinnedStage id="the-mirror" heightMultiplier={4.3}>
        {(progress) => {
          // Artwork starts bright (0.90) in full screen, then gently dims (0.38) as cards appear
          const bgOpacity =
            progress < 0.1
              ? 0.9
              : remap(progress, 0.1, 0.35, 0.9, 0.38);
          const bgScale = remap(progress, 0, 1, 1.0, 1.08);

          // Stage 1 (0.10 -> 0.52): The 3 Winner Ledgers (Cartels, Security Apparatus, Politicians)
          const stage1Env = getCardEnvelope(progress, 0.1, 0.52, false, false);
          // Stage 2 (0.52 -> 1.00): The Working-Class Verdict Typewriter + Substack Subscribe
          const stage2Env = getCardEnvelope(progress, 0.52, 1.0, false, true);

          const bodyText = data.body;
          const charCount = Math.floor(
            clamp(
              remap(progress, 0.54, 0.78, 0, bodyText.length),
              0,
              bodyText.length
            )
          );
          const typedBody = bodyText.slice(0, charCount);
          const punchlineOpacity = clamp(
            remap(progress, 0.75, 0.86, 0, 1),
            0,
            1
          );

          return (
            <div
              onMouseMove={handleMouseMove}
              className="relative w-full h-full bg-[#0a0b0e] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center px-2.5 sm:px-8 pt-16 pb-4"
            >
              {/* Full-Screen Animated Surveillance Mirror Artwork */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-150 will-change-transform"
                style={{
                  backgroundImage: `url('${data.backgroundImage}')`,
                  opacity: bgOpacity,
                  transform: `scale(${bgScale})`,
                }}
              />

              {/* Cursor-Tracking Surveillance Spotlight & Reticle */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${cursorPos.x}% ${cursorPos.y}%, rgba(234,179,8,0.14) 0%, rgba(10,11,14,0.88) 72%)`,
                }}
              />

              {/* Subtle Cursor-Following Surveillance Crosshair */}
              <div
                style={{
                  left: `${cursorPos.x}%`,
                  top: `${cursorPos.y}%`,
                }}
                className="pointer-events-none hidden md:flex absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-[#eab308]/30 rounded-full items-center justify-center transition-all duration-75"
              >
                <div className="w-2 h-2 rounded-full bg-[#ef4444]/60" />
              </div>

              {/* Early Visual Caption before Text Runs In */}
              <div
                style={{
                  opacity: clamp(1 - remap(progress, 0.05, 0.14), 0, 1),
                }}
                className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 border border-[#eab308]/50 bg-[#0a0b0e]/90 px-4 py-2 font-mono text-[11px] tracking-[0.22em] text-[#eab308] uppercase"
              >
                The Mirror • Who Was Really Winning All Along?
              </div>

              {/* 2 Sequenced Finale Cards in Flow-Aware CSS Grid */}
              <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 items-center">
                {/* STAGE 1: Follow the Capital — The 3 Institutional Winners */}
                <div
                  style={{
                    opacity: stage1Env.opacity,
                    transform: `translate3d(0, ${stage1Env.y}px, 0)`,
                    pointerEvents: stage1Env.opacity > 0.2 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <DossierCard
                    variant="stamp"
                    label={data.kicker}
                    stamp="FOLLOW THE CAPITAL FLOW"
                    accent="#eab308"
                  >
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-[#e2e8f0] leading-tight mb-4">
                      {data.lead}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                      {data.winners.map((w, idx) => (
                        <div
                          key={idx}
                          style={{ borderColor: `${w.color}66` }}
                          className="p-2.5 sm:p-3.5 bg-[#0a0b0e]/95 border"
                        >
                          <div
                            style={{ color: w.color }}
                            className="font-mono text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider mb-0.5 sm:mb-1"
                          >
                            {w.metric}
                          </div>
                          <div className="text-xs sm:text-base font-extrabold text-[#e2e8f0] mb-1">
                            {w.actor}
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-300 leading-snug sm:leading-relaxed">
                            {w.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DossierCard>
                </div>

                {/* STAGE 2: The Working-Class Verdict Typewriter + Substack Subscribe */}
                <div
                  style={{
                    opacity: stage2Env.opacity,
                    transform: `translate3d(0, ${stage2Env.y}px, 0)`,
                    pointerEvents: stage2Env.opacity > 0.2 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <DossierCard
                    variant="clip"
                    label={data.title}
                    stamp="DECLASSIFIED VERDICT"
                    accent="#ef4444"
                  >
                    {/* Typewriter Reveal of the Working-Class Toll */}
                    <p className="text-sm sm:text-lg md:text-xl text-slate-200 leading-relaxed font-medium min-h-[3.5rem] sm:min-h-[4.2rem] mb-4">
                      {typedBody}
                      {charCount < bodyText.length && (
                        <span className="inline-block w-2.5 h-4 sm:h-5 ml-1 bg-[#eab308] animate-pulse align-middle" />
                      )}
                    </p>

                    <div
                      style={{ opacity: punchlineOpacity }}
                      className="space-y-4 transition-opacity duration-200"
                    >
                      <p className="text-sm sm:text-lg md:text-2xl font-extrabold text-[#eab308] border-l-4 border-[#eab308] pl-4 py-1 leading-snug">
                        {data.punchline}
                      </p>

                      {/* Dual-Track Substack / Direct Subscribe Box */}
                      <div className="pt-3.5 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        <div>
                          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#22c55e] font-bold">
                            Observations by Moth1
                          </div>
                          <div className="text-xs text-slate-300">
                            {data.substackPrompt}
                          </div>
                        </div>

                        <form
                          onSubmit={handleSubscribe}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                        >
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email..."
                            aria-label="Email address for Substack subscription"
                            className="bg-[#0a0b0e] border border-slate-700 px-3.5 py-2 text-xs font-mono text-[#e2e8f0] placeholder:text-slate-500 focus:outline-none focus:border-[#eab308]"
                          />
                          <button
                            type="submit"
                            className="bg-[#eab308] hover:bg-[#facc15] text-[#0a0b0e] font-mono text-xs font-extrabold uppercase tracking-wider px-4 py-2 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Subscribe on Substack
                          </button>
                        </form>
                      </div>
                    </div>
                  </DossierCard>
                </div>
              </div>
            </div>
          );
        }}
      </PinnedStage>

      {/* Consolidated Sources & Empirical References Ledger */}
      <footer className="w-full bg-[#08090c] border-t border-slate-800/80 py-10 px-4 sm:px-8 text-[#e2e8f0]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#eab308] font-bold">
              Sources &amp; Empirical References • Issue #03
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Observations by Moth1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((s) => (
              <div
                key={s.id}
                className="p-3.5 bg-[#0e1015] border border-slate-800/90 space-y-1"
              >
                <div className="font-mono text-xs font-bold text-[#22c55e]">
                  [{s.id}] {s.name}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
