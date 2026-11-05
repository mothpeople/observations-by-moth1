import React from 'react';

/**
 * DossierCard — Issue #03 Brutalist Graphic Novel & Forensic Surveillance Container
 * Replaces Issue 02's CyberPanel with varied editorial forms ('clip' | 'stamp' | 'broadsheet' | 'ledger')
 * so each beat feels like a living graphic novel and declassified dossier rather than a slide deck.
 */
export default function DossierCard({
  label,
  stamp,
  accent = '#eab308',
  variant = 'clip',
  className = '',
  children,
}) {
  if (variant === 'broadsheet') {
    return (
      <div
        style={{ borderLeftColor: accent }}
        className={`relative border-l-4 bg-[#0a0b0e] border-y border-r border-slate-800/90 pl-3 sm:pl-6 pr-2.5 sm:pr-5 py-2 sm:py-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] ${className}`}
      >
        {(label || stamp) && (
          <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
            {label && (
              <span
                style={{ color: accent }}
                className="font-mono text-[9px] sm:text-[11px] font-black uppercase tracking-[0.16em] sm:tracking-[0.24em]"
              >
                {label}
              </span>
            )}
            {stamp && (
              <span
                style={{
                  borderColor: `${accent}66`,
                  color: accent,
                }}
                className="px-1.5 sm:px-2 py-0.5 border bg-[#0a0b0e]/90 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider sm:tracking-widest"
              >
                {stamp}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }

  if (variant === 'stamp') {
    return (
      <div
        className={`relative bg-[#0c0e13] border border-slate-800 shadow-[0_24px_60px_rgba(0,0,0,0.95)] ${className}`}
      >
        {/* Top Halftone Strip */}
        <div
          style={{
            backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
            backgroundSize: '6px 6px',
          }}
          className="h-1 sm:h-2 w-full opacity-45 border-b border-slate-800"
        />

        {(label || stamp) && (
          <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-5 pt-1.5 sm:pt-2.5 pb-1 sm:pb-2 border-b border-dashed border-slate-800">
            {label && (
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-slate-300 font-bold">
                {label}
              </span>
            )}
            {stamp && (
              <span
                style={{
                  borderColor: accent,
                  color: accent,
                }}
                className="-rotate-1 sm:-rotate-2 px-1.5 sm:px-2 py-0.5 border-2 font-mono text-[7.5px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest bg-[#0a0b0e]"
              >
                {stamp}
              </span>
            )}
          </div>
        )}

        <div className="p-2 sm:p-5">{children}</div>
      </div>
    );
  }

  // Default 'clip' or 'ledger': Brutalist clipped top-right corner + heavy top accent bar
  return (
    <div
      style={{
        clipPath:
          'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
      }}
      className={`relative bg-[#0c0e13] border border-slate-800 shadow-[0_24px_60px_rgba(0,0,0,0.95)] ${className}`}
    >
      {/* Top Brutalist Chemical Bar */}
      <div
        style={{ backgroundColor: accent }}
        className="h-1 w-full"
      />

      {label && (
        <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-5 py-1 sm:py-2 bg-[#08090c] border-b border-slate-800/90">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              style={{ backgroundColor: accent }}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 inline-block shrink-0"
            />
            <span
              style={{ color: accent }}
              className="font-mono text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.14em] sm:tracking-[0.2em]"
            >
              {label}
            </span>
          </div>
          {stamp && (
            <span className="font-mono text-[7.5px] sm:text-[9px] text-slate-400 uppercase tracking-wider">
              {stamp}
            </span>
          )}
        </div>
      )}

      <div className="p-2 sm:p-5">{children}</div>
    </div>
  );
}
