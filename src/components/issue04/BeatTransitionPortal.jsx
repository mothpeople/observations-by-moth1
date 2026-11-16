import React from 'react';
import PinnedStage from '../PinnedStage';
import { clamp, remap } from '../../utils/math';

/**
 * BeatTransitionPortal — Full-Screen Interactive Image Transition Between Beats
 * Morphs from the outgoing scene image into the incoming beat's scene image
 * with an expanding astrolabe iris and floating rounded glass chapter pill.
 */
export default function BeatTransitionPortal({
  fromImage,
  toImage,
  eyebrow,
  headline,
  accent = '#eab308',
}) {
  return (
    <PinnedStage heightMultiplier={1.65}>
      {(progress) => {
        const crossfade = clamp(remap(progress, 0.15, 0.78, 0, 1), 0, 1);
        const scaleFrom = remap(progress, 0, 1, 1.0, 1.14);
        const scaleTo = remap(progress, 0, 1, 1.12, 1.0);
        const irisRadius = Math.round(remap(crossfade, 0, 1, 12, 115));

        const pillOpacity =
          progress < 0.12
            ? remap(progress, 0.0, 0.12, 0, 1)
            : progress < 0.82
              ? 1
              : 1 - remap(progress, 0.82, 0.98, 0, 1);
        const pillY = remap(progress, 0, 1, 22, -22);

        return (
          <div className="relative w-full h-full bg-[#090a0f] overflow-hidden flex items-center justify-center">
            {/* Outgoing Full-Bleed Animated Scene */}
            <div
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url('${fromImage}')`,
                opacity: 0.75 * (1 - crossfade * 0.65),
                transform: `scale(${scaleFrom})`,
              }}
            />

            {/* Incoming Full-Bleed Animated Scene Expanding via Astrolabe Iris */}
            <div
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url('${toImage}')`,
                clipPath: `circle(${irisRadius}% at 50% 50%)`,
                opacity: 0.88,
                transform: `scale(${scaleTo})`,
              }}
            />

            {/* Soft Radial Vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(9,10,15,0.22) 0%, rgba(9,10,15,0.78) 80%, rgba(9,10,15,0.96) 100%)',
              }}
            />

            {/* Expanding Astrolabe Ring SVG */}
            <svg
              aria-hidden="true"
              viewBox="0 0 800 450"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-55"
            >
              <g transform="translate(400, 225)" fill="none">
                <circle
                  r={Math.max(24, irisRadius * 2.4)}
                  stroke={accent}
                  strokeWidth="1.5"
                  strokeDasharray="10 6"
                />
                <circle
                  r={Math.max(12, irisRadius * 1.6)}
                  stroke="#e2e8f0"
                  strokeWidth="0.7"
                  strokeOpacity="0.45"
                />
              </g>
            </svg>

            {/* Floating Rounded Glass Chapter Portal Pill */}
            <div
              style={{
                opacity: pillOpacity,
                transform: `translate3d(0, ${pillY}px, 0)`,
              }}
              className="relative z-10 max-w-xl mx-auto px-4 text-center pointer-events-none"
            >
              <div
                style={{
                  borderColor: `${accent}66`,
                  boxShadow: `0 25px 65px rgba(0,0,0,0.92), 0 0 35px ${accent}22`,
                }}
                className="rounded-3xl bg-[#090a0f]/88 border px-6 py-4 sm:px-8 sm:py-5 backdrop-blur-xl"
              >
                <div
                  style={{ color: accent }}
                  className="font-mono text-[9.5px] sm:text-xs font-extrabold uppercase tracking-[0.22em] mb-1.5"
                >
                  {eyebrow}
                </div>
                <div className="text-base sm:text-2xl font-black text-white leading-snug">
                  {headline}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </PinnedStage>
  );
}
