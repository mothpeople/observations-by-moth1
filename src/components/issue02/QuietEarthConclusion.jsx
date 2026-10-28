import React, { useState } from 'react';
import PinnedStage from '../PinnedStage';
import CyberPanel from './CyberPanel';
import { clamp, remap } from '../../utils/math';

export default function QuietEarthConclusion({ data, sources }) {
  const [email, setEmail] = useState('');
  const [copiedTeaser, setCopiedTeaser] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const targetUrl = email.trim()
      ? `https://observationsbymoth1.substack.com/subscribe?email=${encodeURIComponent(email.trim())}`
      : 'https://observationsbymoth1.substack.com/subscribe';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const substackTeaserText = `Subject: The Meat Grinder Needs More Meat

You know why the total fertility rate is in freefall worldwide and people simply refuse to have children?

Listen to politicians and tech billionaires whine, and they’ll tell you society is collapsing because younger generations became selfish. What they really mean is: the meat grinder is running out of meat.

They do not care about procreation or the dignity of human life. They care about future taxpayers to fund pension deficits, and warm bodies to keep consumer demand humming.

But how do you ask people to breed workers for an economy that is simultaneously automating entry-level careers with AI, locking them out of housing, and ignoring that low-lying cities will be dealing with chronic sea-level flooding by 2050?

In our latest interactive exploration, we break down the collapse of the 21st-century family Venn diagram, the demographic contradictions of AI, and three deeply uncomfortable alternatives governments refuse to discuss.

[▶ Launch Interactive Exploration: The Meat Grinder Needs More Meat] (https://observations.moth1.xyz/the-meat-grinder)`;

  const copySubstackTeaser = async () => {
    try {
      await navigator.clipboard.writeText(substackTeaserText);
      setCopiedTeaser(true);
      setTimeout(() => setCopiedTeaser(false), 2400);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      {/* Pinned Finale Typewriter Reveal over Quiet Earth */}
      <PinnedStage id="beat-5" heightMultiplier={3.8}>
        {(progress) => {
          // Quiet Earth starts bright (0.92) so reader admires botanical reclamation, then dims as typewriter begins
          const bgOpacity =
            progress < 0.16
              ? 0.92
              : remap(progress, 0.16, 0.45, 0.92, 0.28);
          const bgScale = remap(progress, 0, 1, 1.0, 1.06);

          const panelOpacity =
            progress < 0.12
              ? 0
              : progress < 0.26
                ? remap(progress, 0.12, 0.26)
                : 1;

          const fullText = data.statement;
          const charCount = Math.floor(
            clamp(remap(progress, 0.18, 0.68, 0, fullText.length), 0, fullText.length)
          );
          const typedStatement = fullText.slice(0, charCount);
          const subtextOpacity = clamp(remap(progress, 0.66, 0.82, 0, 1), 0, 1);

          return (
            <div className="relative w-full h-full bg-[#0f1115] text-[#e2e8f0] overflow-hidden flex items-center justify-center px-4 sm:px-6">
              {/* Quiet Earth Animated Botanical Reclamation Loop */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-150 will-change-transform"
                style={{
                  backgroundImage: `url('/issues/issue-02/quiet-earth.webp')`,
                  opacity: bgOpacity,
                  transform: `scale(${bgScale})`,
                }}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(15,17,21,0.2) 0%, rgba(15,17,21,0.92) 85%)',
                }}
              />

              {/* Early Visual Caption Badge */}
              <div
                style={{ opacity: clamp(1 - remap(progress, 0.1, 0.24), 0, 1) }}
                className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 border border-slate-800 bg-[#0f1115]/90 px-4 py-2 font-mono text-[11px] tracking-[0.22em] text-[#86efac] uppercase"
              >
                [QUIET EARTH // BOTANICAL EQUILIBRIUM]
              </div>

              {/* Typewriter Finale Card */}
              <div
                style={{ opacity: panelOpacity }}
                className="relative z-10 w-full max-w-4xl mx-auto"
              >
                <CyberPanel tag={data.tag} accent="#86efac">
                  <p className="text-xl sm:text-2xl md:text-4xl font-bold text-[#e2e8f0] leading-snug tracking-tight mb-6 min-h-[4.5rem]">
                    {typedStatement}
                    {charCount < fullText.length && (
                      <span className="inline-block w-2.5 h-6 sm:h-8 ml-1 bg-[#86efac] animate-pulse align-middle" />
                    )}
                  </p>

                  <div
                    style={{ opacity: subtextOpacity }}
                    className="space-y-5 transition-opacity duration-200"
                  >
                    <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed border-l-2 border-[#67e8f9] pl-4">
                      {data.subtext}
                    </p>

                    <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#86efac] font-bold">
                          Observations by Moth1
                        </div>
                        <div className="text-xs text-slate-400">
                          {data.substackPrompt}
                        </div>
                      </div>

                      <form
                        onSubmit={handleSubscribe}
                        className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                      >
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="reader@domain.com"
                          aria-label="Email address for Substack subscription"
                          className="bg-[#121316] border border-slate-700 px-3.5 py-2 text-xs font-mono text-[#e2e8f0] placeholder:text-slate-500 focus:outline-none focus:border-[#86efac]"
                        />
                        <button
                          type="submit"
                          className="bg-[#86efac] text-[#0f1115] font-mono text-xs font-extrabold uppercase tracking-[0.18em] px-4 py-2 hover:bg-[#67e8f9] transition-colors"
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

      {/* Consolidated Sources & Empirical References Ledger + Substack Companion Teaser */}
      <footer className="relative bg-[#0b0d10] border-t border-slate-800/90 text-[#e2e8f0] py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Substack Companion Dispatch Card */}
          <CyberPanel tag="[SUBSTACK COMPANION TEASER // ISSUE 02]" accent="#c084fc">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#e2e8f0]">
                  Substack Companion Dispatch: &ldquo;The Meat Grinder Needs More Meat&rdquo;
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  observationsbymoth1.substack.com • Ready for newsletter syndication
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copySubstackTeaser}
                  className="border border-[#c084fc]/50 bg-[#121316] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#c084fc] hover:bg-[#c084fc]/15 transition-colors"
                >
                  {copiedTeaser ? '✓ Copied Teaser' : 'Copy Substack Copy'}
                </button>
                <a
                  href="https://observationsbymoth1.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-700 bg-[#121316] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#86efac] hover:border-[#86efac] transition-colors"
                >
                  Open Substack ↗
                </a>
              </div>
            </div>

            <blockquote className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed border-l-2 border-[#c084fc] pl-4">
              <p>
                <strong>Subject: The Meat Grinder Needs More Meat</strong>
              </p>
              <p>
                You know why the total fertility rate is in freefall worldwide and people simply refuse to have children?
              </p>
              <p>
                Listen to politicians and tech billionaires whine, and they’ll tell you society is collapsing because younger generations became selfish. What they really mean is: the meat grinder is running out of meat.
              </p>
              <p>
                They do not care about procreation or the dignity of human life. They care about future taxpayers to fund pension deficits, and warm bodies to keep consumer demand humming.
              </p>
              <p>
                But how do you ask people to breed workers for an economy that is simultaneously automating entry-level careers with AI, locking them out of housing, and ignoring that low-lying cities will be dealing with chronic sea-level flooding by 2050?
              </p>
              <p>
                In our latest interactive exploration, we break down the collapse of the 21st-century family Venn diagram, the demographic contradictions of AI, and three deeply uncomfortable alternatives governments refuse to discuss.
              </p>
            </blockquote>
          </CyberPanel>

          {/* Empirical Sources Ledger */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-[#67e8f9]" />
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#67e8f9] font-bold">
                Sources &amp; Empirical References // Issue #02
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3.5 bg-[#121316] border border-slate-800/90 flex gap-3 items-start"
                >
                  <span className="font-mono text-[11px] text-[#86efac] font-bold shrink-0">
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
            <span>OBSERVATIONS BY MOTH1 // ISSUE #02 — THE MEAT GRINDER NEEDS MORE MEAT</span>
            <span>observations.moth1.xyz/the-meat-grinder</span>
          </div>
        </div>
      </footer>
    </>
  );
}
