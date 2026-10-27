import React, { useRef, useState, useEffect } from 'react';

/**
 * PinnedStage locks a scrollytelling beat in the viewport using native compositor-backed
 * `position: sticky; top: 0; height: 100dvh` while the user scrolls through its `heightVh` track,
 * and exposes normalized `progress` (0 -> 1) to children.
 */
export default function PinnedStage({
  id,
  ariaLabel,
  heightVh = 300,
  className = '',
  children,
}) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = null;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = Math.max(1, rect.height - vh);
      const rawProgress = -rect.top / scrollable;
      const clamped = Math.min(1, Math.max(0, rawProgress));
      setProgress(clamped);
    };

    const onScrollOrResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id={id}
      aria-label={ariaLabel}
      style={{ height: `${heightVh}vh` }}
      className={`relative w-full ${className}`}
    >
      <div className="sticky top-0 left-0 w-full stage-dvh overflow-hidden">
        {typeof children === 'function' ? children(progress) : children}
      </div>
    </section>
  );
}
