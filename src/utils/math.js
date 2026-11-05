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
 * with a continuous crossfade around adjacent card boundaries and zero dead zones.
 */
export function getCardEnvelope(
  progress,
  start,
  end,
  isFirst = false,
  isLast = false,
  fadeSpan = 0.035
) {
  if (typeof isFirst === 'number') {
    fadeSpan = isFirst;
    isFirst = false;
    isLast = false;
  }

  // Ensure fade half-span does not exceed 25% of card duration to preserve reading plateau
  const cardDuration = Math.max(0.01, end - start);
  const half = Math.min(fadeSpan, cardDuration * 0.25);

  // Before card entrance window
  if (progress < start - half) {
    if (isFirst && start <= 0.04) {
      return { opacity: 1, y: 0 };
    }
    return { opacity: 0, y: 12 };
  }

  // During card fade-in window centered around `start`
  if (progress < start + half) {
    if (isFirst && start <= 0.04) {
      return { opacity: 1, y: 0 };
    }
    const t = remap(progress, start - half, start + half, 0, 1);
    return { opacity: t, y: (1 - t) * 12 };
  }

  // Past card exit window
  if (progress > end + half) {
    if (isLast || end >= 0.98) {
      return { opacity: 1, y: 0 };
    }
    return { opacity: 0, y: -12 };
  }

  // During card fade-out window centered around `end`
  if (progress > end - half) {
    if (isLast || end >= 0.98) {
      return { opacity: 1, y: 0 };
    }
    const t = remap(progress, end - half, end + half, 0, 1);
    return { opacity: 1 - t, y: -t * 12 };
  }

  // Static reading plateau: full opacity, zero translation
  return { opacity: 1, y: 0 };
}
