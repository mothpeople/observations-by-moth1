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

/**
 * Computes a stepped horizontal slide position (0 .. totalSlides - 1)
 * with static reading plateaus on each slide before smoothly gliding to the next.
 */
export function getSteppedSlideIndex(
  progress,
  totalSlides = 4,
  plateauRatio = 0.65
) {
  if (totalSlides <= 1) return 0;
  const p = clamp(progress, 0, 1);
  if (p >= 1) return totalSlides - 1;

  const seg = 1 / totalSlides;
  const idx = Math.min(totalSlides - 1, Math.floor(p / seg));
  if (idx === totalSlides - 1) return totalSlides - 1;

  const localP = (p - idx * seg) / seg;
  if (localP <= plateauRatio) {
    return idx;
  }
  const t = clamp((localP - plateauRatio) / (1 - plateauRatio), 0, 1);
  // Smoothstep easing for horizontal glide
  const smoothT = t * t * (3 - 2 * t);
  return idx + smoothT;
}
