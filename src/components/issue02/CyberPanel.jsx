import React from 'react';

/**
 * Clean Cyberpunk Graphic-Novel Panel for Issue #02
 * Pale bone-slate (#121316) surface, 1px slate-800 border, and subtle '+' corner brackets.
 */
export default function CyberPanel({
  children,
  label,
  accent = '#86efac',
  className = '',
  style = {},
  theme = 'dark',
  ...rest
}) {
  const isLight = theme === 'light';
  return (
    <div
      style={style}
      data-panel="cyber"
      {...rest}
      className={`relative p-3.5 sm:p-5 md:p-7 transition-colors duration-200 ${
        isLight
          ? 'bg-white/95 border border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.06)] text-slate-800'
          : 'bg-[#121316]/94 border border-slate-800/90 shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-[#e2e8f0]'
      } ${className}`}
    >
      {/* Subtle '+' Corner Brackets */}
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className={`pointer-events-none select-none absolute -top-2 -left-1.5 font-mono text-xs leading-none ${
          isLight ? 'opacity-90 font-bold' : 'opacity-75'
        }`}
      >
        +
      </span>
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className={`pointer-events-none select-none absolute -top-2 -right-1.5 font-mono text-xs leading-none ${
          isLight ? 'opacity-90 font-bold' : 'opacity-75'
        }`}
      >
        +
      </span>
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className={`pointer-events-none select-none absolute -bottom-2 -left-1.5 font-mono text-xs leading-none ${
          isLight ? 'opacity-90 font-bold' : 'opacity-75'
        }`}
      >
        +
      </span>
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className={`pointer-events-none select-none absolute -bottom-2 -right-1.5 font-mono text-xs leading-none ${
          isLight ? 'opacity-90 font-bold' : 'opacity-75'
        }`}
      >
        +
      </span>

      {/* Top pastel accent hairline */}
      <div
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, ${accent}75 0%, transparent 85%)`,
        }}
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
      />

      {label && (
        <div className="mb-2 sm:mb-3 flex items-center gap-2">
          <span
            style={{ backgroundColor: accent }}
            className="h-1.5 w-1.5 rounded-full shrink-0"
          />
          <span
            style={{ color: accent }}
            className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold truncate"
          >
            {label}
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
