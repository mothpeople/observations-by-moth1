import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';
import { recordSiteEvent } from '../../utils/telemetry';

export default function QuietEarthConclusion({ data, sources }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    recordSiteEvent('substack_subscribe', {
      path: '/the-meat-grinder',
      issueId: '02',
      email: email.trim(),
    });
    const targetUrl = email.trim()
      ? `https://observationsbymoth1.substack.com/subscribe?email=${encodeURIComponent(email.trim())}`
      : 'https://observationsbymoth1.substack.com/subscribe';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Beat 5: Full-Screen Reclaimed Botanical Artwork with Words Running Over It */}
      <PinnedStage id="beat-5" heightMultiplier={4.0}>
        {(progress) => {
          // Artwork starts bright (0.90) in full screen, then gently dims (0.42) so running words read crisply
          const bgOpacity =
            progress < 0.14
              ? 0.9
              : remap(progress, 0.14, 0.42, 0.9, 0.42);
          const bgScale = remap(progress, 0, 1, 1.0, 1.07);

          const cardOpacity =
            progress < 0.1
              ? 0
              : progress < 0.24
                ? remap(progress, 0.1, 0.24, 0, 1)
                : 1;

          const bodyText = data.body;
          const charCount = Math.floor(
            clamp(
              remap(progress, 0.2, 0.68, 0, bodyText.length),
              0,
              bodyText.length
            )
          );
          const typedBody = bodyText.slice(0, charCount);
          const punchlineOpacity = clamp(remap(progress, 0.66, 0.82, 0, 1), 0, 1);

          return (
            <div className="relative w-full h-full bg-[#121316] text-[#e2e8f0] overflow-hidden flex items-center justify-center px-4 sm:px-8 pt-14 pb-6">
              {/* Full-Screen Animated Botanical Reclamation Artwork */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-150 will-change-transform"
                style={{
                  backgroundImage: `url('${data.backgroundImage}')`,
                  opacity: bgOpacity,
                  transform: `scale(${bgScale})`,
                }}
              />

              {/* Atmospheric Vignette over Full-Screen Artwork */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(18,19,22,0.28) 0%, rgba(18,19,22,0.88) 88%)',
                }}
              />

              {/* Early Visual Caption before Text Runs In */}
              <div
                style={{ opacity: clamp(1 - remap(progress, 0.08, 0.2), 0, 1) }}
                className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 border border-slate-800 bg-[#121316]/90 px-4 py-2 font-mono text-[11px] tracking-[0.22em] text-[#86efac] uppercase"
              >
                Biological Correction • Reclaimed Earth
              </div>

              {/* Words Running Over the Full-Screen Artwork */}
              <div
                style={{ opacity: cardOpacity }}
                className="relative z-10 w-full max-w-4xl mx-auto"
              >
                <CyberPanel
                  label="Biological Correction"
                  accent="#86efac"
                  className="bg-[#121316]/84 backdrop-blur-md p-3.5 sm:p-6"
                >
                  <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#e2e8f0] leading-tight mb-2.5 sm:mb-4">
                    {data.lead}
                  </h2>

                  <p className="text-sm sm:text-lg md:text-xl text-slate-200 leading-snug sm:leading-relaxed font-medium min-h-[4rem] sm:min-h-[5.5rem] mb-3.5 sm:mb-5">
                    {typedBody}
                    {charCount < bodyText.length && (
                      <span className="inline-block w-2.5 h-5 sm:h-6 ml-1 bg-[#86efac] animate-pulse align-middle" />
                    )}
                  </p>

                  <div
                    style={{ opacity: punchlineOpacity }}
                    className="space-y-3.5 sm:space-y-5 transition-opacity duration-200"
                  >
                    <p className="text-sm sm:text-lg md:text-2xl font-extrabold text-[#86efac] border-l-2 border-[#86efac] pl-3 sm:pl-4 py-0.5 sm:py-1 leading-snug">
                      {data.punchline}
                    </p>

                    {/* Dual-Track Substack / Direct Subscribe Box */}
                    <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
                      <div>
                        <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#67e8f9] font-bold">
                          Observations by Moth1
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-300">
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
                          placeholder="Enter your email for future dispatches..."
                          aria-label="Email address for Substack subscription"
                          className="bg-[#0b0d10] border border-slate-700 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-mono text-[#e2e8f0] placeholder:text-slate-500 focus:outline-none focus:border-[#86efac]"
                        />
                        <button
                          type="submit"
                          className="bg-[#86efac] text-[#121316] font-mono text-xs font-extrabold uppercase tracking-[0.18em] px-4 py-1.5 sm:px-5 sm:py-2 hover:bg-[#67e8f9] transition-colors cursor-pointer"
                        >
                          Subscribe ↗
                        </button>
                      </form>
                    </div>
                  </div>
                </CyberPanel>
              </div>
            </div>
          );
        }}
      </PinnedStage>

      {/* Consolidated Sources & Empirical References Ledger */}
      <footer className="relative bg-[#0b0d10] border-t border-slate-800/90 text-[#e2e8f0] py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-[#86efac]" />
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#86efac] font-bold">
                Sources &amp; Empirical References
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3.5 bg-[#121316] border border-slate-800/90 flex gap-3 items-start"
                >
                  <span className="font-mono text-[11px] text-[#67e8f9] font-bold shrink-0">
                    [{src.id}]
                  </span>
                  <div className="text-xs leading-relaxed">
                    <div className="font-bold text-[#e2e8f0]">{src.name}</div>
                    <div className="text-slate-400">{src.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-500">
            <span>OBSERVATIONS BY MOTH1: THE MEAT GRINDER NEEDS MORE MEAT</span>
            <span>observations.moth1.xyz/the-meat-grinder</span>
          </div>
        </div>
      </footer>
    </>
  );
}
