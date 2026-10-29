import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Check } from 'lucide-react';
import { recordSiteEvent } from '../utils/telemetry';

export default function Masthead({
  activeDispatch,
  totalIssues = 1,
  isDrawerOpen,
  onToggleDrawer,
}) {
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  const handleShare = async () => {
    const slug = activeDispatch?.slug ? `/${activeDispatch.slug}` : '/';
    const origin =
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
        ? window.location.origin
        : 'https://observations.moth1.xyz';
    const shareUrl = `${origin}${slug}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopied(true);
      recordSiteEvent('share_copied', { path: slug, url: shareUrl });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      recordSiteEvent('share_copied', { path: slug, url: shareUrl });
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const formattedCount = String(totalIssues).padStart(2, '0');

  return (
    <header className="fixed top-0 inset-x-0 w-full z-50 bg-[#08090a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 h-12 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Minimal Logo Mark OBSERVATIONS // MOTH1 */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 group focus:outline-none"
        >
          <img
            src="/favicon.png"
            alt=""
            aria-hidden="true"
            className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-sm border border-neutral-700 object-cover group-hover:border-[#d97706] transition-colors"
          />
          <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.08em] sm:tracking-[0.2em] uppercase text-[#e6e4dd] group-hover:text-[#d97706] transition-colors truncate">
            OBSERVATIONS <span className="text-[#dc2626]">//</span> MOTH1
          </span>
        </Link>

        {/* Center: Thin Ink-Accented Scroll Progress Bar */}
        <div
          aria-hidden="true"
          className="hidden md:flex flex-1 max-w-md mx-6 items-center"
        >
          <div className="w-full h-1 bg-[#1f232b] overflow-hidden relative">
            <motion.div
              style={{ scaleX }}
              className="w-full h-full bg-gradient-to-r from-[#d97706] via-[#dc2626] to-[#d97706] origin-left shadow-[0_0_10px_rgba(217,119,6,0.65)]"
            />
          </div>
        </div>

        {/* Right Controls: SHARE ↗ & INDEX [X] */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
          <button
            type="button"
            onClick={handleShare}
            className="px-2 sm:px-3.5 py-1 sm:py-1.5 bg-[#0e1014] hover:bg-[#1f232b] border border-neutral-700 hover:border-[#d97706] text-[#e6e4dd] font-mono text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase transition-colors cursor-pointer whitespace-nowrap"
          >
            SHARE <span aria-hidden="true">↗</span>
          </button>

          <button
            type="button"
            onClick={onToggleDrawer}
            aria-expanded={isDrawerOpen}
            aria-controls="archive-drawer"
            className={`px-2 sm:px-3.5 py-1 sm:py-1.5 border font-mono text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase transition-colors cursor-pointer whitespace-nowrap ${
              isDrawerOpen
                ? 'bg-[#d97706] text-[#08090a] border-[#d97706]'
                : 'bg-[#0e1014] hover:bg-[#1f232b] text-[#e6e4dd] border-neutral-700 hover:border-[#d97706]'
            }`}
          >
            INDEX [{formattedCount}]
          </button>

          {/* Toast Notification ("Link copied") */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                role="status"
                aria-live="polite"
                className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-[#08090a] border border-[#d97706] text-[#e6e4dd] font-mono text-xs tracking-wider uppercase shadow-2xl flex items-center gap-1.5 whitespace-nowrap z-50"
              >
                <Check className="w-3.5 h-3.5 text-[#d97706]" aria-hidden="true" />
                <span>Link copied</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Bottom-Edge Thin Scroll Progress Bar */}
      <div aria-hidden="true" className="md:hidden w-full h-0.5 bg-[#1f232b]">
        <motion.div
          style={{ scaleX }}
          className="w-full h-full bg-gradient-to-r from-[#d97706] via-[#dc2626] to-[#d97706] origin-left"
        />
      </div>
    </header>
  );
}
