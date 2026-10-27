# Observations by Moth1 — Workspace Rules & Guardrails

## 1. Brand & Publication Identity
- **Publication Name**: Always write **`Observations by Moth1`** (never truncate to `Observations by Moth`).
- **Live Domains & Links**:
  - Interactive Web Essay: `https://observations.moth1.xyz/`
  - Substack Publication: `https://observationsbymoth1.substack.com/`
  - Substack Subscribe Endpoint: `https://observationsbymoth1.substack.com/subscribe?email=...`
  - GitHub Repository: `https://github.com/mothpeople/observations-by-moth1.git` (`main` branch)

## 2. Visual, Typography & Editorial Standards
- **Master Art Style**: Cyber-zen Japanese sumi-e ink wash meets modern graphic novel illustration (`#0d0d0d` / `#08090a` charcoal canvas, `#e6e4dd` bone-white ink, `#d97706` muted amber, `#dc2626` crimson seal).
- **Typography**: Use **Montserrat** (`'Montserrat', system-ui, -apple-system, sans-serif`) across all font classes (`font-sans`, `font-serif`, `font-editorial`, `font-mono`) so typography remains uniform from opening cover to finale.
- **No Structural Labels**: Never display `Beat 1`, `Card 2`, `Slide 3`, `Stage 1`, or `//` markers in user-facing UI. Show only clean titles and narrative copy.
- **Universal Imagery**: Ensure any text inside generated illustrations (e.g., protest banners) uses English only or universal symbols, avoiding nationality-specific scripts.
- **Empirical Citations**: Every chart, metric bar, and simulator must include an inline empirical source citation (`Ref: ...`) plus a consolidated **Sources & Empirical References** ledger in the conclusion.
- **All-Animated Illustrations**: Every illustration in the article (`public/issues/issue-XX/*.webp` and `public/assets/*.webp`) must be a seamless 24-frame animated WebP loop rather than a static image.

## 3. Scrollytelling & Mobile Layout Invariants
- **Sticky Viewport Pinning (`PinnedStage.jsx`)**:
  - Lock scrollytelling stages using native CSS `position: sticky; top: 0` with `.stage-dvh` (`height: 100vh; height: 100dvh;`).
  - Do NOT set `overflow-x: hidden` or `overflow-x: clip` on `html` or `body` (apply `overflow-hidden` inside `.stage-dvh` instead) so native `sticky` works without mobile address-bar jitter.
- **Preventing Card Overlap on Mobile**:
  - When a section displays a chart alongside multiple crossfading story cards (`StickySplitSection.jsx`), stack the cards in a flow-aware CSS Grid cell (`grid grid-cols-1 items-start md:items-center` on parent, `col-start-1 row-start-1` on each card) rather than `position: absolute` inside a fixed-height box. This guarantees long cards never overflow upward into the chart on mobile screens.
- **CSS Specificity Guardrail**:
  - Always scope `.ink-panel:not(.absolute):not(.fixed):not(.sticky) { position: relative; }` so `.ink-panel` never overrides absolute/fixed/sticky positioning on sequenced layers (`.seq-layer`).
- **Scroll-Driven Interactivity**:
  - All bar charts, comparison curves, doctrine simulators, timelines, and finale typewriter reveals must animate automatically via scroll progress (`progress`) with static reading plateaus before transitioning to the next card.
