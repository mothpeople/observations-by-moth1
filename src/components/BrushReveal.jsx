import React from 'react';
import { motion } from 'framer-motion';

/**
 * Graphic Novel Frame Pacing: "Brush-Reveal" mask animation.
 * Combines a directional clipPath wipe with a black-ink brush curtain (scaleX / opacity)
 * so panels feel drawn onto the washi canvas with sumi ink.
 */
export default function BrushReveal({
  children,
  className = '',
  delay = 0,
  direction = 'left',
  accentColor = '#dc2626',
}) {
  const initialClip =
    direction === 'right'
      ? 'inset(0% 0% 0% 100%)'
      : direction === 'up'
      ? 'inset(100% 0% 0% 0%)'
      : 'inset(0% 100% 0% 0%)';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: initialClip, opacity: 0.15 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
        viewport={{ once: false, amount: 0.22 }}
        transition={{
          duration: 0.78,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="brush-reveal-node w-full h-full"
      >
        {children}
      </motion.div>

      {/* Sumi ink brush-stroke curtain that sweeps across during reveal */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 1, opacity: 0.9 }}
        whileInView={{ scaleX: 0, opacity: 0 }}
        viewport={{ once: false, amount: 0.22 }}
        transition={{
          duration: 0.82,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          transformOrigin: direction === 'right' ? '0% 50%' : '100% 50%',
          background: `linear-gradient(90deg, #08090a 75%, ${accentColor} 100%)`,
        }}
        className="pointer-events-none absolute inset-0 z-30"
      />
    </div>
  );
}
