import React from 'react';

/**
 * CartographyCard — Issue #04 Rounded Glassmorphic & Astrolabe HUD Container
 * Uses tactile rounded-3xl corners, soft ambient glow borders, and pill badges
 * so Issue #04 feels completely distinct from Issue #03's sharp rectangular dossiers.
 */
export default function CartographyCard({
  telemetry,
  accent = '#eab308',
  variant = 'glass',
  className = '',
  children,
}) {
  if (variant === 'chronicle') {
    return (
      <div
        style={{
          borderColor: `${accent}44`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.88), inset 0 1px 0 ${accent}22`,
        }}
        className={`relative rounded-3xl border bg-gradient-to-br from-[#0d1018]/95 via-[#0a0c12]/92 to-[#090a0f]/90 p-3.5 sm:p-6 backdrop-blur-xl ${className}`}
      >
        {telemetry && (
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
            <span
              style={{
                borderColor: `${accent}55`,
                color: accent,
                backgroundColor: `${accent}14`,
              }}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border font-mono text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider"
            >
              <span
                style={{ backgroundColor: accent }}
                className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
              />
              {telemetry}
            </span>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        borderColor: `${accent}38`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.92), inset 0 1px 0 ${accent}25`,
      }}
      className={`relative rounded-3xl bg-[#0b0d14]/94 border backdrop-blur-xl overflow-hidden ${className}`}
    >
      {/* Subtle Top Curved Glow Line */}
      <div
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${accent} 50%, transparent 95%)`,
        }}
        className="h-[2px] w-full opacity-80"
      />

      {telemetry && (
        <div className="flex items-center justify-between gap-2 px-3.5 sm:px-6 pt-2.5 sm:pt-4 pb-1">
          <span
            style={{
              borderColor: `${accent}55`,
              color: accent,
              backgroundColor: `${accent}14`,
            }}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border font-mono text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider"
          >
            <span
              style={{ backgroundColor: accent }}
              className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
            />
            {telemetry}
          </span>
        </div>
      )}

      <div className="p-3.5 sm:p-6 pt-2 sm:pt-3">{children}</div>
    </div>
  );
}
