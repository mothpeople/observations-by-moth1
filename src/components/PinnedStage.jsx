import React, { useRef, useState, useEffect } from 'react';

/**
 * PinnedStage guarantees that a scrollytelling beat stays 100% static/locked in the viewport
 * (`position: fixed; top: 0; height: 100vh`) while the user scrolls through its `heightVh` track,
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
  const [pinState, setPinState] = useState('before'); // 'before' | 'fixed' | 'after'
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

      if (rect.top > 0) {
        setPinState('before');
      } else if (rect.bottom >= vh) {
        setPinState('fixed');
      } else {
        setPinState('after');
      }
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

  const stagePositionStyle =
    pinState === 'fixed'
      ? { position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', zIndex: 20 }
      : pinState === 'after'
      ? { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100vh', zIndex: 10 }
      : { position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 10 };

  return (
    <section
      ref={containerRef}
      id={id}
      aria-label={ariaLabel}
      style={{ height: `${heightVh}vh` }}
      className={`relative w-full ${className}`}
    >
      <div style={stagePositionStyle} className="w-full overflow-hidden">
        {typeof children === 'function' ? children(progress) : children}
      </div>
    </section>
  );
}
