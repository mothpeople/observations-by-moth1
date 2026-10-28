import React from 'react';

/**
 * Technical Cyberpunk Line-Art Panel for Issue #02
 * Ultra-fine 1px slate-800 border, '+' corner bracket markers, and optional monospace tag.
 */
export default function CyberPanel({
  children,
  tag,
  accent = '#86efac',
  className = '',
  style = {},
}) {
  return (
    <div
      style={style}
      className={`relative bg-[#0f1115]/92 backdrop-blur-md border border-slate-800 p-5 sm:p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85)] ${className}`}
    >
      {/* Technical '+' Corner Brackets */}
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className="pointer-events-none select-none absolute -top-2 -left-1.5 font-mono text-xs leading-none opacity-80"
      >
        +
      </span>
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className="pointer-events-none select-none absolute -top-2 -right-1.5 font-mono text-xs leading-none opacity-80"
      >
        +
      </span>
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className="pointer-events-none select-none absolute -bottom-2 -left-1.5 font-mono text-xs leading-none opacity-80"
      >
        +
      </span>
      <span
        aria-hidden="true"
        style={{ color: accent }}
        className="pointer-events-none select-none absolute -bottom-2 -right-1.5 font-mono text-xs leading-none opacity-80"
      >
        +
      </span>

      {/* Top accent hairline */}
      <div
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, ${accent}66 0%, transparent 85%)`,
        }}
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
      />

      {tag && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            style={{ color: accent, borderColor: `${accent}40` }}
            className="inline-flex items-center gap-1.5 border bg-[#121316]/90 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.22em] uppercase"
          >
            <span
              style={{ backgroundColor: accent }}
              className="h-1.5 w-1.5 rounded-full"
            />
            {tag}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">
            SYS // DEMOGRAPHICS
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
