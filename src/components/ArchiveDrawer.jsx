import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';

export default function ArchiveDrawer({
  isOpen,
  onClose,
  dispatches = [],
  activeDispatch,
}) {
  const navigate = useNavigate();
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Move focus into the drawer sheet when opened for keyboard accessibility
    if (sheetRef.current) {
      sheetRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectIssue = (issue) => {
    onClose();
    navigate(`/${issue.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed Backdrop */}
          <motion.div
            key="archive-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs"
          />

          {/* Cyber-Zen Slide-Over Archive Drawer */}
          <motion.aside
            key="archive-panel"
            id="archive-drawer"
            ref={sheetRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Observations Archive"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#0c0d10]/95 backdrop-blur-xl border-l border-neutral-800 text-[#e6e4dd] flex flex-col justify-between shadow-2xl focus:outline-none"
          >
            {/* Top Drawer Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-block w-2 h-2 rotate-45 bg-[#d97706]" />
                <h2 className="font-mono text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[#e6e4dd]">
                  OBSERVATIONS <span className="text-[#dc2626]">//</span> ARCHIVE
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Archive Drawer"
                className="p-1.5 border border-neutral-800 bg-[#08090a] hover:border-[#dc2626] text-[#e6e4dd]/70 hover:text-[#e6e4dd] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Dispatches List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#e6e4dd]/50 mb-2">
                PUBLISHED DISPATCHES ({dispatches.length})
              </div>

              {dispatches.map((issue) => {
                const isActive = activeDispatch?.id === issue.id;
                return (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => handleSelectIssue(issue)}
                    className={`w-full text-left ink-panel border transition-all p-4 flex gap-4 items-start group cursor-pointer ${
                      isActive
                        ? 'border-[#d97706] bg-[#14171f]/95'
                        : 'border-neutral-800 bg-[#08090a]/90 hover:border-neutral-600'
                    }`}
                  >
                    {/* Tiny Ink-Wash Thumbnail */}
                    <div className="relative w-20 h-16 shrink-0 border border-neutral-800 bg-[#08090a] overflow-hidden">
                      <img
                        src={issue.cover}
                        alt={issue.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                      />
                      {isActive && (
                        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#d97706] shadow-[0_0_8px_#d97706]" />
                      )}
                    </div>

                    {/* Issue Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest mb-1">
                        <span
                          className={
                            isActive
                              ? 'text-[#d97706] font-bold'
                              : 'text-[#e6e4dd]/60'
                          }
                        >
                          ISSUE #{issue.id} {isActive ? '• ACTIVE' : ''}
                        </span>
                        <span className="text-[#e6e4dd]/50">
                          {issue.date}
                          {issue.readTime ? ` • ${issue.readTime}` : ''}
                        </span>
                      </div>

                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#e6e4dd] group-hover:text-[#d97706] transition-colors leading-snug mb-1 truncate">
                        {issue.title}
                      </h3>

                      <p className="font-sans text-xs text-[#e6e4dd]/65 line-clamp-2 leading-relaxed">
                        {issue.subtitle}
                      </p>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                        isActive
                          ? 'text-[#d97706]'
                          : 'text-neutral-600 group-hover:text-[#e6e4dd]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Bottom Drawer Footer */}
            <div className="p-6 border-t border-neutral-800 bg-[#08090a]/90 flex items-center justify-between font-mono text-[11px] text-[#e6e4dd]/60">
              <span>OBSERVATIONS BY MOTH1</span>
              <a
                href="https://observationsbymoth1.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d97706] hover:underline uppercase tracking-wider"
              >
                SUBSTACK ↗
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
