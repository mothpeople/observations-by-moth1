import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import CartographyCard from './CartographyCard';
import { clamp, remap, getCardEnvelope } from '../../utils/math';
import { recordSiteEvent } from '../../utils/telemetry';

export default function MirrorHistoryConclusionSection({ data, sources }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    recordSiteEvent('substack_subscribe', {
      path: '/century-of-self-inflicted-humiliation',
      issueId: '04',
      email: email.trim(),
    });
    const targetUrl = email.trim()
      ? `https://observationsbymoth1.substack.com/subscribe?email=${encodeURIComponent(email.trim())}`
      : 'https://observationsbymoth1.substack.com/subscribe';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Beat 8: The Mirror of History Finale */}
      <PinnedStage id="mirror-of-history" heightMultiplier={4.3}>
        {(progress) => {
          const bgOpacity =
            progress < 0.1
              ? 0.92
              : remap(progress, 0.1, 0.35, 0.92, 0.36);
          const bgScale = remap(progress, 0, 1, 1.0, 1.08);

          const stage1Env = getCardEnvelope(progress, 0.1, 0.52, false, false);
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
            <div className="relative w-full h-full bg-[#090a0f] text-[#e2e8f0] overflow-hidden flex items-start md:items-center justify-center px-2.5 sm:px-8 pt-16 pb-4">
              {/* Full-Screen Animated Mirror of History Artwork */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-150 will-change-transform"
                style={{
                  backgroundImage: `url('${data.backgroundImage}')`,
                  opacity: bgOpacity,
                  transform: `scale(${bgScale})`,
                }}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 42%, rgba(9,10,15,0.35) 0%, rgba(9,10,15,0.88) 76%)',
                }}
              />

              {/* Early Rounded Pill Caption before Text Runs In */}
              <div
                style={{
                  opacity: clamp(1 - remap(progress, 0.05, 0.14), 0, 1),
                }}
                className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-[#eab308]/50 bg-[#090a0f]/90 px-5 py-2 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-[#eab308] uppercase whitespace-nowrap backdrop-blur-md"
              >
                The Mirror of History • 1839 vs. 2026
              </div>

              {/* 2 Sequenced Rounded Finale Cards */}
              <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 items-center">
                {/* STAGE 1: Internal Cohesion & The Two Opium Wars */}
                <div
                  style={{
                    opacity: stage1Env.opacity,
                    transform: `translate3d(0, ${stage1Env.y}px, 0)`,
                    pointerEvents: stage1Env.opacity > 0.2 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <CartographyCard
                    telemetry="1839 CANTON • 2026 ALGORITHMIC FEED"
                    accent="#eab308"
                  >
                    <h2 className="text-sm sm:text-2xl md:text-3xl font-black tracking-tight text-[#e2e8f0] leading-snug sm:leading-tight mb-3 sm:mb-5">
                      {data.lead}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3.5">
                      {data.parallels.map((p, idx) => (
                        <div
                          key={idx}
                          style={{ borderColor: `${p.color}55` }}
                          className="p-3 sm:p-4 rounded-2xl bg-[#090a0f]/95 border"
                        >
                          <div
                            style={{ color: p.color }}
                            className="font-mono text-[8.5px] sm:text-[10px] font-extrabold uppercase tracking-wider mb-0.5 sm:mb-1"
                          >
                            {p.metric}
                          </div>
                          <div className="text-xs sm:text-base font-extrabold text-[#e2e8f0] mb-0.5 sm:mb-1">
                            {p.era}
                          </div>
                          <p className="text-[10.5px] sm:text-xs text-neutral-300 leading-snug sm:leading-relaxed">
                            {p.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CartographyCard>
                </div>

                {/* STAGE 2: Typewriter Verdict + Substack Subscription */}
                <div
                  style={{
                    opacity: stage2Env.opacity,
                    transform: `translate3d(0, ${stage2Env.y}px, 0)`,
                    pointerEvents: stage2Env.opacity > 0.2 ? 'auto' : 'none',
                  }}
                  className="col-start-1 row-start-1 w-full transition-opacity duration-75"
                >
                  <CartographyCard
                    variant="chronicle"
                    telemetry="OBSERVATIONS BY MOTH1 • FINAL VERDICT"
                    accent="#ef4444"
                  >
                    <p className="text-xs sm:text-xl text-[#e2e8f0] leading-snug sm:leading-relaxed mb-3 sm:mb-4 min-h-[3.5rem] sm:min-h-[5rem]">
                      {typedBody}
                      <span className="inline-block w-2 h-4 rounded-full bg-[#eab308] ml-1 animate-pulse" />
                    </p>

                    <div
                      style={{ opacity: punchlineOpacity }}
                      className="p-3 sm:p-4 rounded-2xl bg-[#090a0f] border border-[#eab308]/50 mb-3 sm:mb-5 transition-opacity duration-200"
                    >
                      <p className="text-xs sm:text-xl font-black text-[#eab308] leading-snug">
                        {data.punchline}
                      </p>
                    </div>

                    {/* Rounded Substack Subscribe Form */}
                    <form
                      onSubmit={handleSubscribe}
                      className="pt-3 sm:pt-4 border-t border-neutral-800 flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between"
                    >
                      <div>
                        <div className="font-mono text-[9px] sm:text-[10px] text-[#22c55e] uppercase font-bold tracking-widest">
                          SUBSCRIBE TO OBSERVATIONS BY MOTH1
                        </div>
                        <div className="text-[11px] sm:text-xs text-neutral-300">
                          Receive new interactive visual essays directly via Substack.
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email..."
                          aria-label="Email address for Substack subscription"
                          className="px-4 py-1.5 sm:py-2 rounded-full bg-[#090a0f] border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-[#eab308]"
                        />
                        <button
                          type="submit"
                          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#eab308] text-[#090a0f] font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-[#facc15] transition-colors cursor-pointer shrink-0"
                        >
                          Subscribe ↗
                        </button>
                      </div>
                    </form>
                  </CartographyCard>
                </div>
              </div>
            </div>
          );
        }}
      </PinnedStage>

      {/* Consolidated Sources & Empirical References Ledger (Rounded Cards) */}
      <section
        aria-label="Sources and Empirical References"
        className="bg-[#07080c] border-t border-neutral-800/90 py-14 px-4 sm:px-8 text-[#e2e8f0]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-neutral-800">
            <div>
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#eab308] uppercase font-bold">
                OBSERVATIONS BY MOTH1 • ISSUE 04 ARCHIVE
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Sources &amp; Empirical References
              </h3>
            </div>
            <a
              href="https://observationsbymoth1.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full border border-[#eab308]/60 bg-[#090a0f] font-mono text-[10px] text-[#eab308] uppercase tracking-wider hover:bg-[#eab308] hover:text-black transition-colors font-bold"
            >
              Read on Substack ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0b0d14] border border-neutral-800/90 space-y-1.5"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#eab308]">
                  <span>[{src.id}]</span>
                  <span className="text-white">{src.title}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {src.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
