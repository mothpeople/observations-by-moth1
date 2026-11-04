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
export function getCardEnvelope(
  progress,
  start,
  end,
  isFirst = false,
  isLast = false,
  fadeSpan = 0.06
) {
  if (typeof isFirst === 'number') {
    fadeSpan = isFirst;
    isFirst = false;
    isLast = false;
  }
  if (progress < start) {
    return isFirst ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 };
  }
  if (progress > end) {
    return isLast ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 };
  }
  const fadeInEnd = Math.min(end, start + fadeSpan);
  const fadeOutStart = Math.max(start, end - fadeSpan);

  if (!isFirst && progress < fadeInEnd) {
    const t = remap(progress, start, fadeInEnd, 0, 1);
    return { opacity: t, y: (1 - t) * 24 };
  }
  if (!isLast && progress > fadeOutStart && end < 0.98) {
    const t = remap(progress, fadeOutStart, end, 0, 1);
    return { opacity: 1 - t, y: -t * 20 };
  }
  return { opacity: 1, y: 0 };
}
