---
name: moth1-issue-pipeline
description: >-
  End-to-end production workflow for creating a new Observations by Moth1 issue:
  (1) Interactive scrollytelling web essay with 24-frame animated sumi-e WebP loops,
  (2) Substack article and <2MB animated header GIFs, and (3) 9:16 Instagram/Facebook
  Reel MP4 rendered via Remotion. Activate whenever the user starts a new topic or issue.
---

# Observations by Moth1 — 3-Part Issue Production Skill

Use this workflow whenever the user introduces a new topic, script, or issue for **Observations by Moth1**. Every topic produces three synchronized deliverables.

## Deliverable 1: Interactive Scrollytelling Site with Animated Loops

1. **Generate Base Sumi-e Illustrations (`16:9`)**:
   - Prefix all image prompts with:
     `Cyber-zen ink wash style, Japanese sumi-e painting meets modern graphic novel illustration, expressive suibokuga dry brush strokes, heavy black ink splatters, dilute ink bleeds, gritty manga linework, textured washi rice paper background, atmospheric negative space, cinematic framing, moody and philosophical, high-contrast monochrome with subtle muted amber accent lighting --ar 16:9 --style raw --v 6.0`
   - Ensure any text on signs/banners is in English only.
2. **Convert All Illustrations into 24-Frame Seamless Animated WebP Loops**:
   - Crop/resize each illustration to `800x450` (`16:9`) and composite 24 frames (`65ms`/frame, `loop=0`, `quality=80`) of scene-matched sumi-e motion (driving rain streaks, rising embers, drifting smoke plumes, puddle ripples, ink bleeds, or bioluminescent glow).
   - Save the animated `.webp` loops to both `public/issues/issue-XX/` and `public/assets/`.
3. **Wire Narrative Beats & Scroll-Driven Animations**:
   - **Beat 1 (`HeroSection.jsx`)**: Full-screen animated cover + title -> zooms/fades into Opening Card on `#0d0d0d` with scroll-driven metric bar and reading plateau.
   - **Beat 2 (`StickySplitSection.jsx`)**: Pinned comparison SVG chart (with animated curve/pillars and stark gap bracket) + 3 sequenced story cards in a CSS Grid stack (`col-start-1 row-start-1`).
   - **Beat 3 (`HorizontalScrollSection.jsx`)**: Stepped horizontal 4-stage track (`getSteppedSlideIndex`) that pauses on each stage while its tension bar completes.
   - **Beat 4 (`DataComparisonSection.jsx`)**: Full-screen sequenced `.seq-layer` stage: Step 1 (Tipping Scale moves up on completion) -> Step 2 (Scroll-driven 2-mode simulator) -> Step 3 (Scroll-driven 3-era timeline).
   - **Beat 5 (`ConclusionSection.jsx`)**: Finale animated backdrop starts at full brightness (`0.95` opacity) and dims (`0.25`) as the scroll-driven word-by-word typewriter reveals the closing statement, followed by the Substack subscribe card and **Sources & Empirical References** ledger.

## Deliverable 2: Substack Article & Animated Header GIFs

1. **Generate `< 2 MB` Substack Animated GIFs**:
   - Create `substack-header-16x9.gif` (`800x450`) and `substack-banner-3x1.gif` (`960x320`) using 24 frames (`65ms`/frame).
   - **Size Optimization Invariant**: Keep the background illustration static (`scale=1.0`) and quantize all 24 frames against a single shared master 256-color palette (`master_rgb.quantize(colors=256, dither=Image.Dither.NONE)`) so the resulting GIF stays ~1.4 MB with zero background pixel jitter.
2. **Verify Substack Subscription Hook**:
   - Ensure the conclusion form opens `https://observationsbymoth1.substack.com/subscribe?email=...`.

## Deliverable 3: 9:16 Instagram / Facebook Reel (`1080x1920`, `30fps`, `35s`)

1. **Remotion Composition (`src/remotion/`)**:
   - Canvas: `1080x1920`, `30fps`, `1050 frames` (`35 seconds`).
   - Safe Zones: Enforce `paddingTop: 220`, `paddingBottom: 320`, `paddingLeft/Right: 64` so all text and panels stay clear of Instagram/Facebook Reels UI icons.
   - **4-Scene Timeline**:
     - `Frames 0–180 (0–6s)`: Hook quote with `spring` entrance over looping ink rain & Ken Burns backdrop.
     - `Frames 181–420 (6–14s)`: Split-screen visual comparison + 3 staggered data captions.
     - `Frames 421–750 (14–25s)`: Rapid 4-stage sequence (`~82 frames` each) with `spring` slam cuts + subtext panel.
     - `Frames 751–1050 (25–35s)`: Framed scale visual + kinetic title (`WATERING GRASS IN A THUNDERSTORM`) + CTA badge (`observations.moth1.xyz`).
2. **ESM Import Rule & Render Command**:
   - Because `package.json` uses `"type": "module"`, always include explicit `.jsx` extensions on relative imports in `src/remotion/index.js` (`./Root.jsx`) and `src/remotion/Root.jsx` (`./WateringGrassReel.jsx`).
   - Run the render outside the sandbox (`BypassSandbox: true` required for headless Chromium Mach port IPC):
     ```bash
     npx remotion render src/remotion/index.js WateringGrassReel out/watering-grass-reel.mp4 --codec=h264
     ```

## Deliverable 4: Build Verification & GitHub Deployment

1. Run `npm run build` to verify the Vite production bundle compiles cleanly.
2. Stage, commit, and push to `origin/main` (`https://github.com/mothpeople/observations-by-moth1.git`).
