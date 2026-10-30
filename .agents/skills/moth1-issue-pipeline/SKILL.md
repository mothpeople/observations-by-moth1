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

## Deliverable 3: 9:16 Instagram / Facebook Reel (`1080x1920`, `30fps`, `36s`)

1. **Remotion Composition (`src/remotion/`, modeled on `MeatGrinderReel.jsx`)**:
   - **Visual-First & Giant Typography Rule**: Never copy multi-sentence website paragraphs into the Reel. Every scene must feature an **`800px+` tall hero illustration window** (with smooth Ken Burns zoom) over a full-bleed animated background, paired with **giant `60px–74px` poster headlines / stat callouts** and **short 6–10 word punchlines (`36px–40px`)**.
   - Canvas: `1080x1920`, `30fps`, `1080 frames` (`36 seconds`).
   - Safe Zones: Enforce `top: 185`, `bottom: 265`, `left/right: 48` so all HUD bars and poster cards stay clear of Instagram/Facebook Reels UI overlays.
   - **5-Beat Visual Timeline**:
     - `Frames 0–180 (0–6s)`: Giant `800px` hero visual + poster hook (`72px` title -> `64px` thesis + 3 bold `36px` stat badges).
     - `Frames 180–390 (6–13s)`: `820px` animated diagram/visual stage + `60px` before/after poster headline.
     - `Frames 390–670 (13–22.3s)`: 4 rapid visual slides (`70 frames` each) with `820px` artwork + `74px` stat callout + 8-word punchline (`40px`).
     - `Frames 670–880 (22.3–29.3s)`: 3 rapid counter-proposal slides (`70 frames` each) with `820px` artwork + `64px` title + 8-word punchline (`38px`).
     - `Frames 880–1080 (29.3–36s)`: Unobstructed `740px` finale artwork showcase + `64px` closing poster headline + `observations.moth1.xyz` CTA bar.
2. **ESM Import Rule & Render Command**:
   - Because `package.json` uses `"type": "module"`, always include explicit `.jsx` extensions on relative imports in `src/remotion/index.js` (`./Root.jsx`) and `src/remotion/Root.jsx` (`./WateringGrassReel.jsx`).
   - Run the render outside the sandbox (`BypassSandbox: true` required for headless Chromium Mach port IPC):
     ```bash
     npx remotion render src/remotion/index.js WateringGrassReel out/watering-grass-reel.mp4 --codec=h264
     ```

## Deliverable 4: Local Preview Verification & Gated GitHub Deployment

1. Run `npm run build` to verify the Vite production bundle compiles cleanly.
2. Start the local dev server (`npm run dev`) so the user can inspect the new issue locally at `http://localhost:5173/<slug>` and request any copy, visual, or layout adjustments.
3. **Do NOT push (`git push`) automatically.** Only stage, commit, and push to `origin/main` (`https://github.com/mothpeople/observations-by-moth1.git`) after the user has checked the local version and explicitly instructed to push it online.
