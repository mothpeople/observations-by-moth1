import React, { useState } from 'react';
import { Mail, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import PinnedStage from './PinnedStage';
import { recordSiteEvent } from '../utils/telemetry';

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const invLerp = (a, b, v) => clamp((v - a) / (b - a));

export default function ConclusionSection({ data, meta }) {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bgError, setBgError] = useState(false);

  const leadWords = (data.statementLead || '').split(' ');
  const punchWords = (data.statementPunchline || '').split(' ');
  const totalWords = leadWords.length + punchWords.length;

  const finaleBgSrc = data.backgroundImage || '/issues/issue-01/anchor-finale.webp';

  const validateEmailValue = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Please enter your email address to subscribe.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address (e.g., reader@domain.com).';
    }
    return '';
  };

  const handleBlur = (e) => {
    if (e.target.value.length > 0) {
      setErrorMessage(validateEmailValue(e.target.value));
    }
  };

  const handleInput = (e) => {
    setEmail(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateEmailValue(email);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage('');
    setIsSubmitted(true);
    recordSiteEvent('substack_subscribe', {
      path: '/watering-grass-in-a-thunderstorm',
      issueId: '01',
      email: email.trim(),
    });
    window.open(
      `https://observationsbymoth1.substack.com/subscribe?email=${encodeURIComponent(email.trim())}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <PinnedStage
      id="conclusion"
      ariaLabel="Conclusion"
      heightVh={280}
      className="bg-[#08090a]"
    >
      {(progress) => {
        // Start with the background image already at its brightest (0.95),
        // then dim it down (0.95 -> 0.25) to reveal the words appearing as the user scrolls!
        const dimProgress = invLerp(0.05, 0.28, progress);
        const bgOpacity = 0.95 - dimProgress * 0.70;
        const bgScale = 1 + progress * 0.08;

        // Scroll-driven word-by-word typewriter reveal (0.12 -> 0.66), then static hold
        const typeProgress = invLerp(0.12, 0.66, progress);
        const revealedCount = Math.round(typeProgress * totalWords);
        const formReveal = invLerp(0.64, 0.75, progress);

        return (
          <div className="relative w-full h-full flex flex-col justify-between pt-14 pb-3 sm:pt-16 sm:pb-8 px-4 sm:px-10 bg-[#08090a] overflow-hidden">
            {/* Dramatic Sumi-e Finale Background Image — Starts at Brightest, Dims as Words Appear */}
            {!bgError && (
              <div
                style={{
                  opacity: bgOpacity,
                  transform: `scale(${bgScale})`,
                }}
                className="pointer-events-none absolute inset-0 z-0 will-change-transform"
              >
                <img
                  src={finaleBgSrc}
                  alt="Sumi-e illustration of storm clouds parting over a city horizon at dawn"
                  loading="lazy"
                  width="1376"
                  height="768"
                  onError={() => setBgError(true)}
                  className="w-full h-full object-cover"
                />
                <div
                  style={{ opacity: dimProgress }}
                  className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/70 to-[#08090a]/90"
                />
              </div>
            )}

            {/* Main Center Finale Stage */}
            <div className="relative z-10 max-w-4xl mx-auto w-full my-auto">
              {/* Word-by-Word Scroll Typewriter Statement */}
              <blockquote className="mb-3 sm:mb-8 min-h-[88px] sm:min-h-[190px]">
                <p className="font-serif text-base sm:text-3xl md:text-4xl font-bold leading-snug sm:leading-[1.2] tracking-tight mb-2 sm:mb-5">
                  {leadWords.map((word, idx) => {
                    const isVisible = idx < revealedCount;
                    const isCursor =
                      idx === revealedCount - 1 &&
                      revealedCount <= leadWords.length;
                    return (
                      <React.Fragment key={`lead-${idx}`}>
                        <span
                          style={{
                            opacity: isVisible ? 1 : 0,
                            color: '#e6e4dd',
                          }}
                          className="transition-opacity duration-75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                        >
                          {word}{' '}
                        </span>
                        {isCursor && (
                          <span className="inline-block w-2.5 sm:w-3 h-5 sm:h-9 bg-[#dc2626] align-middle animate-pulse ml-0.5" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </p>

                <p className="font-serif text-base sm:text-3xl md:text-4xl font-bold leading-snug sm:leading-[1.2] tracking-tight">
                  {punchWords.map((word, idx) => {
                    const globalIdx = leadWords.length + idx;
                    const isVisible = globalIdx < revealedCount;
                    const isCursor = globalIdx === revealedCount - 1;
                    return (
                      <React.Fragment key={`punch-${idx}`}>
                        <span
                          style={{
                            opacity: isVisible ? 1 : 0,
                            color: '#dc2626',
                          }}
                          className="transition-opacity duration-75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                        >
                          {word}{' '}
                        </span>
                        {isCursor && (
                          <span className="inline-block w-2.5 sm:w-3 h-5 sm:h-9 bg-[#d97706] align-middle animate-pulse ml-0.5" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </p>
              </blockquote>

              {/* Substack Subscription Container — Appears once typewriter finishes & holds static */}
              <div
                style={{
                  opacity: formReveal,
                  transform: `translateY(${(1 - formReveal) * 28}px)`,
                  pointerEvents: formReveal > 0.3 ? 'auto' : 'none',
                }}
                className="ink-panel border border-neutral-800 bg-[#0e1014]/95 backdrop-blur-md p-3.5 sm:p-7 will-change-transform"
              >
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#08090a] border border-neutral-700 text-[#d97706] font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-1.5 sm:mb-2.5">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#dc2626]" />
                    <span>{meta.publication}</span>
                  </div>

                  <h3 className="font-serif text-base sm:text-2xl font-bold text-[#e6e4dd] mb-0.5 sm:mb-1">
                    {data.substack.heading}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#e6e4dd]/75 leading-snug sm:leading-relaxed mb-2.5 sm:mb-3 font-sans">
                    {data.substack.description}
                  </p>

                  <form
                    method="post"
                    action="#subscribe"
                    noValidate
                    onSubmit={handleSubmit}
                    className="w-full"
                  >
                    <div className="flex flex-row gap-2 sm:gap-3">
                      <input
                        id="substack-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        placeholder={data.substack.placeholder}
                        autoComplete="email"
                        enterKeyHint="send"
                        required
                        disabled={isSubmitted}
                        aria-label="Email Address"
                        aria-invalid={Boolean(errorMessage)}
                        aria-describedby="substack-feedback"
                        className="flex-1 min-w-0 min-h-[38px] sm:min-h-[44px] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#08090a] border border-neutral-700 text-[#e6e4dd] font-mono placeholder:text-neutral-500 focus:border-[#dc2626] transition-colors disabled:opacity-60"
                      />

                      <button
                        type="submit"
                        disabled={isSubmitted}
                        className="min-h-[38px] sm:min-h-[44px] px-4 sm:px-6 py-1.5 sm:py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-[#e6e4dd] font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shrink-0 border border-[#e6e4dd]/20 disabled:opacity-60 cursor-pointer"
                      >
                        {isSubmitted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>Subscribed</span>
                          </>
                        ) : (
                          <>
                            <span>{data.substack.buttonText}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div
                      id="substack-feedback"
                      aria-live="polite"
                      className="min-h-[14px] sm:min-h-[18px] mt-1"
                    >
                      {errorMessage && (
                        <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-[#dc2626] font-mono">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errorMessage}</span>
                        </p>
                      )}
                      {isSubmitted && !errorMessage && (
                        <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs text-[#d97706] font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Subscribed ({email}).</span>
                        </p>
                      )}
                    </div>
                  </form>
                </div>

                {/* Complete Sources & Empirical Citations Ledger */}
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-neutral-800 font-mono text-[9px] sm:text-[11px] text-[#e6e4dd]/65">
                  <div className="text-[#d97706] font-bold uppercase tracking-widest mb-1 sm:mb-1.5">
                    Sources &amp; Empirical References
                  </div>
                  <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5 sm:gap-y-1 list-decimal list-inside leading-tight sm:leading-snug">
                    <li>
                      <strong className="text-[#e6e4dd]">1.5°C Climate Breach (+1.55°C):</strong> World Meteorological Organization (WMO), <em>State of the Global Climate 2024</em> &amp; EU Copernicus Climate Change Service (Jan 2025).
                    </li>
                    <li>
                      <strong className="text-[#e6e4dd]">Home Prices vs. Youth Wages:</strong> OECD <em>Affordable Housing Database</em> (2024) &amp; Harvard JCHS, <em>State of the Nation&apos;s Housing 2024</em>.
                    </li>
                    <li>
                      <strong className="text-[#e6e4dd]">Leader Age (70+) vs. Median Population (28 yrs):</strong> Pew Research Center, <em>Age of World Leaders</em> (2024), IPU Parline Database &amp; UN DESA.
                    </li>
                    <li>
                      <strong className="text-[#e6e4dd]">Protest Escalation &amp; Repression:</strong> Carnegie Endowment <em>Global Protest Tracker</em> (2024–25), ACLED &amp; CIVICUS <em>Monitor</em>.
                    </li>
                    <li>
                      <strong className="text-[#e6e4dd]">Security vs. Education Spend &amp; Policing:</strong> OECD <em>Government at a Glance</em> (2024), SIPRI &amp; Maguire et al. (<em>Criminology &amp; Public Policy</em>).
                    </li>
                    <li>
                      <strong className="text-[#e6e4dd]">Generational Wealth &amp; Family Viability:</strong> U.S. Federal Reserve <em>Survey of Consumer Finances</em> (1989–2024) &amp; OECD <em>Society at a Glance 2024</em>.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 max-w-4xl mx-auto w-full pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-[#e6e4dd]/50">
              <div>{meta.publication}</div>
              <a
                href="#hero"
                className="text-[#e6e4dd]/70 hover:text-[#d97706] transition-colors uppercase tracking-wider"
              >
                Back to Top &uarr;
              </a>
            </footer>
          </div>
        );
      }}
    </PinnedStage>
  );
}
