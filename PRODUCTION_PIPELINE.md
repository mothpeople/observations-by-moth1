# Observations by Moth1 — Master Production Pipeline

Every new topic/issue for **Observations by Moth1** follows this locked-down 3-part multi-channel production standard:

---

## 1. Interactive Scrollytelling Web Essay (`observations.moth1.xyz`)
- **Aesthetic**: Cyber-zen Japanese sumi-e ink wash meets modern graphic novel (`#0d0d0d` / `#08090a` dark canvas, `#e6e4dd` bone-white text, `#d97706` muted amber, `#dc2626` crimson).
- **Typography**: **Montserrat** (`sans-serif`) across all titles, body copy, charts, and empirical citations (`index.html`, `tailwind.config.js`, `src/index.css`).
- **Editorial Cleanliness**: Titles and narrative text only—no `Beat`, `Card`, `Slide`, or `//` structural labels, and English-only/universal visual imagery.
- **All-Animated Illustrations**: Every illustration across the essay (`public/issues/issue-XX/*.webp` and `public/assets/*.webp`) is converted into a seamless 24-frame animated WebP loop (rain, embers, smoke plumes, ripples, ink bleeds, and bioluminescent glow).
- **Scroll-Driven Cinema (Desktop & Mobile)**:
  - Hardware-composited `position: sticky; top: 0; height: 100dvh` (`PinnedStage.jsx`) for zero-jitter mobile and desktop pinning.
  - Non-overlapping CSS Grid card stacks (`StickySplitSection.jsx`) and full-screen sequenced layers (`DataComparisonSection.jsx`).
  - Scroll-driven animated charts, simulators, and finale word-by-word typewriter reveal over a dimming background illustration (`ConclusionSection.jsx`).
  - Inline empirical source citations beneath every chart + a complete **Sources & Empirical References** ledger in the conclusion.

---

## 2. Substack Article & Animated Header (`observationsbymoth1.substack.com`)
- **Animated Substack Headers**:
  - `substack-header-16x9.gif` & `.webp` (`800x450`, `< 2 MB`) for article cover embeds.
  - `substack-banner-3x1.gif` (`960x320`, `< 2 MB`) for publication banners.
- **Subscription Integration**:
  - Footer form in [`ConclusionSection.jsx`](src/components/ConclusionSection.jsx) wired directly to `https://observationsbymoth1.substack.com/subscribe`.

---

## 3. 9:16 Instagram & Facebook Reel (`1080x1920`, `30fps`, `35s` via Remotion)
- **Specs**: `1080x1920` vertical canvas, `30fps`, `1,050 frames` (`35 seconds`), H.264 MP4 (`out/<issue-slug>-reel.mp4`).
- **Safe Zones**: Strict `220px` top padding and `320px` bottom padding so all typography and graphic novel panels stay clear of Instagram/Facebook Reels UI overlays.
- **4-Scene Structure** ([`src/remotion/WateringGrassReel.jsx`](src/remotion/WateringGrassReel.jsx)):
  1. **Scene 1 — Hook (`0–6s` / Frames `0–180`)**: Looping ink rain over hero backdrop + spring-animated hook quote.
  2. **Scene 2 — The Disconnect (`6–14s` / Frames `181–420`)**: Split-screen visual comparison + staggered 3-part data captions.
  3. **Scene 3 — The 4-Stage Loop (`14–25s` / Frames `421–750`)**: Rapid 4-stage cuts with Ken Burns zoom + subtext panel.
  4. **Scene 4 — Conclusion & CTA (`25–35s` / Frames `751–1050`)**: Scale visual + bold kinetic title + `observations.moth1.xyz` CTA badge.
- **Render Command**:
  ```bash
  npm run remotion:render
  ```
