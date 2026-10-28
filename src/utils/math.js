export function clamp(val, min = 0, max = 1) {
  return Math.min(max, Math.max(min, val));
}

export function remap(val, inMin, inMax, outMin = 0, outMax = 1) {
  if (inMax === inMin) return outMin;
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

/**
 * Computes opacity and vertical translateY envelope for sequenced scrollytelling cards
 * with a clean static reading plateau between fade-in and fade-out.
 */
export function getCardEnvelope(progress, start, end, fadeSpan = 0.07) {
  if (progress < start || progress > end) {
    return { opacity: 0, y: progress < start ? 24 : -24 };
  }
  const fadeInEnd = Math.min(end, start + fadeSpan);
  const fadeOutStart = Math.max(start, end - fadeSpan);

  if (progress < fadeInEnd) {
    const t = remap(progress, start, fadeInEnd, 0, 1);
    return { opacity: t, y: (1 - t) * 24 };
  }
  if (progress > fadeOutStart && end < 0.96) {
    const t = remap(progress, fadeOutStart, end, 0, 1);
    return { opacity: 1 - t, y: -t * 20 };
  }
  return { opacity: 1, y: 0 };
}
