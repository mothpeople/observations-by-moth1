import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Color Palette — Cyber-Zen Sumi-e Graphic Novel
const COLORS = {
  charcoal: '#08090a',
  panelBg: 'rgba(14, 16, 20, 0.92)',
  offWhite: '#e6e4dd',
  amber: '#d97706',
  crimson: '#dc2626',
  borderMuted: 'rgba(230, 228, 221, 0.22)',
};

// Instagram Vertical Safe Zones (1080x1920):
// Avoid top 200px and bottom 300px for platform UI icons
const SAFE_ZONE_STYLE = {
  paddingTop: 220,
  paddingBottom: 320,
  paddingLeft: 64,
  paddingRight: 64,
  boxSizing: 'border-box',
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
};

/**
 * Reusable Graphic Novel Frame with Corner Brackets
 */
const GraphicPanel = ({ children, accentColor = COLORS.amber, style = {} }) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: COLORS.panelBg,
        border: `2px solid ${COLORS.borderMuted}`,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.92), 8px 8px 0px #08090a',
        padding: '40px 44px',
        ...style,
      }}
    >
      {/* Top-Left Corner Bracket */}
      <div
        style={{
          position: 'absolute',
          top: -3,
          left: -3,
          width: 24,
          height: 24,
          borderTop: `4px solid ${COLORS.offWhite}`,
          borderLeft: `4px solid ${COLORS.offWhite}`,
        }}
      />
      {/* Bottom-Right Corner Bracket */}
      <div
        style={{
          position: 'absolute',
          bottom: -3,
          right: -3,
          width: 24,
          height: 24,
          borderBottom: `4px solid ${accentColor}`,
          borderRight: `4px solid ${accentColor}`,
        }}
      />
      {children}
    </div>
  );
};

/**
 * Looping Sumi-e Ink Rain Overlay
 */
const InkRainOverlay = ({ frame, opacity = 0.35 }) => {
  const drops = Array.from({ length: 36 }).map((_, i) => {
    const seedX = (i * 137) % 1080;
    const speed = 28 + (i % 5) * 9;
    const y = ((frame * speed + i * 190) % 2100) - 100;
    const len = 55 + (i % 4) * 25;
    const isAmber = i % 6 === 0;
    return { x: seedX, y, len, isAmber };
  });

  return (
    <svg
      width="1080"
      height="1920"
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
      }}
    >
      {drops.map((d, idx) => (
        <line
          key={idx}
          x1={d.x}
          y1={d.y}
          x2={d.x - 14}
          y2={d.y + d.len}
          stroke={d.isAmber ? COLORS.amber : COLORS.offWhite}
          strokeWidth={d.isAmber ? 2.5 : 1.5}
          strokeOpacity={d.isAmber ? 0.65 : 0.38}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

/**
 * SCENE 1: Hook (Frames 0 - 180 / 0 - 6s)
 * Background: Looping ink rain over city skyline (/assets/hero-storm.webp)
 * Text: "People don't take to the streets if governments were doing their jobs."
 */
const Scene1Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom & pan on background illustration
  const bgScale = interpolate(frame, [0, 180], [1.02, 1.16], {
    extrapolateRight: 'clamp',
  });
  const bgTranslateY = interpolate(frame, [0, 180], [0, -28], {
    extrapolateRight: 'clamp',
  });

  // Spring fade-in and upward entrance for hook typography
  const textSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });
  const textOpacity = interpolate(frame, [8, 32, 162, 180], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textY = interpolate(textSpring, [0, 1], [65, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal }}>
      {/* Ken Burns Background Frame */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('assets/hero-storm.webp')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgScale}) translateY(${bgTranslateY}px)`,
            filter: 'contrast(1.12) brightness(0.75)',
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(8,9,10,0.85) 0%, rgba(8,9,10,0.35) 45%, rgba(8,9,10,0.92) 100%)',
          }}
        />
      </AbsoluteFill>

      <InkRainOverlay frame={frame} opacity={0.48} />

      {/* Safe Zone Content Container */}
      <AbsoluteFill
        style={{
          ...SAFE_ZONE_STYLE,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Masthead Tag */}
        <div
          style={{
            opacity: textOpacity,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            alignSelf: 'flex-start',
            backgroundColor: COLORS.charcoal,
            border: `2px solid ${COLORS.amber}`,
            padding: '12px 24px',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: COLORS.crimson,
              transform: 'rotate(45deg)',
            }}
          />
          <span
            style={{
              color: COLORS.offWhite,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            OBSERVATIONS BY MOTH1
          </span>
        </div>

        {/* Center Hook Graphic Novel Panel */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <GraphicPanel accentColor={COLORS.amber}>
            <div
              style={{
                color: COLORS.amber,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              ISSUE #01 // COLD OPEN
            </div>
            <h1
              style={{
                color: COLORS.offWhite,
                fontSize: 60,
                fontWeight: 800,
                lineHeight: 1.18,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              &ldquo;People don&apos;t take to the streets if governments were{' '}
              <span style={{ color: COLORS.amber }}>doing their jobs.</span>&rdquo;
            </h1>
          </GraphicPanel>
        </div>

        {/* Bottom Subtle Progress Line inside Safe Zone */}
        <div
          style={{
            width: '100%',
            height: 6,
            backgroundColor: 'rgba(230,228,221,0.15)',
          }}
        >
          <div
            style={{
              width: `${interpolate(frame, [0, 180], [0, 100])}%`,
              height: '100%',
              backgroundColor: COLORS.amber,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * SCENE 2: The Geriatric Disconnect (Frames 181 - 420 / 6 - 14s -> 240 frames)
 * Visual: Split-screen panel showing the hoarded boardroom vs. city below (/assets/protest-1.webp)
 * Captions: "1.5°C climate goals missed. Housing unattainable. Governed by leaders decades past retirement."
 */
const Scene2Disconnect = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelEnter = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const topZoom = interpolate(frame, [0, 240], [1.0, 1.14], {
    extrapolateRight: 'clamp',
  });
  const bottomZoom = interpolate(frame, [0, 240], [1.14, 1.0], {
    extrapolateRight: 'clamp',
  });

  const captions = [
    { text: '1.5°C climate goals missed.', delay: 18, accent: COLORS.amber },
    { text: 'Housing unattainable.', delay: 78, accent: COLORS.offWhite },
    {
      text: 'Governed by leaders decades past retirement.',
      delay: 138,
      accent: COLORS.crimson,
    },
  ];

  const sceneFadeOut = interpolate(frame, [220, 239], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.charcoal, opacity: sceneFadeOut }}
    >
      <InkRainOverlay frame={frame + 181} opacity={0.25} />

      <AbsoluteFill
        style={{
          ...SAFE_ZONE_STYLE,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Split-Screen Graphic Novel Panels (Top: Hoarded Boardroom / Bottom: Street Below) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            height: 760,
            transform: `scale(${interpolate(panelEnter, [0, 1], [0.94, 1])})`,
            opacity: panelEnter,
          }}
        >
          {/* Top Split Panel: The Hoarded Boardroom Balcony */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              border: `3px solid ${COLORS.offWhite}`,
              backgroundColor: '#0e1014',
            }}
          >
            <Img
              src={staticFile('assets/disconnect-balcony.webp')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${topZoom})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: 'rgba(8, 9, 10, 0.9)',
                border: `1.5px solid ${COLORS.crimson}`,
                padding: '8px 18px',
                color: COLORS.crimson,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.14em',
              }}
            >
              AVG LEADER AGE: 70+ YRS
            </div>
          </div>

          {/* Bottom Split Panel: The Street Below (/assets/protest-1.webp) */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              border: `3px solid ${COLORS.amber}`,
              backgroundColor: '#0e1014',
            }}
          >
            <Img
              src={staticFile('assets/protest-1.webp')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${bottomZoom})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                backgroundColor: 'rgba(8, 9, 10, 0.9)',
                border: `1.5px solid ${COLORS.amber}`,
                padding: '8px 18px',
                color: COLORS.amber,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '0.14em',
              }}
            >
              MEDIAN HOME PRICE: 11.4x WAGES
            </div>
          </div>
        </div>

        {/* Staggered Captions Panel */}
        <GraphicPanel accentColor={COLORS.crimson} style={{ padding: '32px 38px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {captions.map((cap, idx) => {
              const s = spring({
                frame: frame - cap.delay,
                fps,
                config: { damping: 14, stiffness: 110 },
              });
              const y = interpolate(s, [0, 1], [28, 0]);
              return (
                <div
                  key={idx}
                  style={{
                    opacity: s,
                    transform: `translateY(${y}px)`,
                    color: cap.accent,
                    fontSize: 38,
                    fontWeight: 800,
                    lineHeight: 1.22,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {cap.text}
                </div>
              );
            })}
          </div>
        </GraphicPanel>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * SCENE 3: The 4-Stage Protest Loop (Frames 421 - 750 / 14 - 25s -> 330 frames)
 * Rapidly cuts across the 4 stages:
 *   1. Peaceful rally
 *   2. Overpowered police force
 *   3. Multi-generational strikes
 *   4. Opportunistic chaos
 * Subtext: "The loop repeats. The resentment bubbles."
 */
const Scene3ProtestLoop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stages = [
    {
      num: 'STAGE 01',
      title: 'Peaceful rally',
      stat: '1,000 GATHERED',
      img: 'assets/protest-1.webp',
      accent: COLORS.amber,
    },
    {
      num: 'STAGE 02',
      title: 'Overpowered police force',
      stat: 'MILITARY RIOT GEAR',
      img: 'assets/protest-2.webp',
      accent: COLORS.crimson,
    },
    {
      num: 'STAGE 03',
      title: 'Multi-generational strikes',
      stat: '500,000 CITIZENS',
      img: 'assets/protest-3.webp',
      accent: COLORS.amber,
    },
    {
      num: 'STAGE 04',
      title: 'Opportunistic chaos',
      stat: 'THE AFTERMATH VOID',
      img: 'assets/protest-4.webp',
      accent: COLORS.crimson,
    },
  ];

  // 330 frames divided across 4 stages (~82 frames / 2.75s each)
  const stageDuration = 82;
  const activeStageIndex = Math.min(3, Math.floor(frame / stageDuration));
  const localFrame = frame - activeStageIndex * stageDuration;
  const currentStage = stages[activeStageIndex];

  const slamSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const imgScale = interpolate(localFrame, [0, stageDuration], [1.03, 1.16], {
    extrapolateRight: 'clamp',
  });

  const subtextSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  const fadeOut = interpolate(frame, [310, 329], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal, opacity: fadeOut }}>
      <InkRainOverlay frame={frame + 421} opacity={0.35} />

      <AbsoluteFill
        style={{
          ...SAFE_ZONE_STYLE,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* 4-Stage Progress Pills */}
        <div style={{ display: 'flex', gap: 12 }}>
          {stages.map((st, idx) => {
            const isActive = idx === activeStageIndex;
            const isPast = idx < activeStageIndex;
            return (
              <div
                key={st.num}
                style={{
                  flex: 1,
                  height: 12,
                  backgroundColor: isActive
                    ? st.accent
                    : isPast
                    ? COLORS.offWhite
                    : 'rgba(230,228,221,0.18)',
                  border: `1px solid ${COLORS.borderMuted}`,
                }}
              />
            );
          })}
        </div>

        {/* Active Stage Framed Illustration + Kinetic Label */}
        <div
          style={{
            transform: `scale(${interpolate(slamSpring, [0, 1], [0.92, 1])})`,
            opacity: slamSpring,
          }}
        >
          <div
            style={{
              position: 'relative',
              height: 820,
              border: `4px solid ${currentStage.accent}`,
              overflow: 'hidden',
              backgroundColor: '#0e1014',
              boxShadow: '0 28px 65px rgba(0,0,0,0.95)',
            }}
          >
            <Img
              src={staticFile(currentStage.img)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${imgScale})`,
              }}
            />
            <AbsoluteFill
              style={{
                background:
                  'linear-gradient(180deg, rgba(8,9,10,0.65) 0%, transparent 40%, rgba(8,9,10,0.95) 100%)',
              }}
            />

            {/* Top Stage Counter Badge */}
            <div
              style={{
                position: 'absolute',
                top: 24,
                left: 24,
                right: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  backgroundColor: currentStage.accent,
                  color: COLORS.charcoal,
                  padding: '10px 22px',
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                }}
              >
                {currentStage.num}
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(8, 9, 10, 0.9)',
                  border: `1.5px solid ${COLORS.offWhite}`,
                  color: COLORS.offWhite,
                  padding: '10px 20px',
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                }}
              >
                {currentStage.stat}
              </span>
            </div>

            {/* Bottom Stage Title Inside Frame */}
            <div
              style={{
                position: 'absolute',
                bottom: 32,
                left: 32,
                right: 32,
              }}
            >
              <h2
                style={{
                  color: COLORS.offWhite,
                  fontSize: 56,
                  fontWeight: 800,
                  margin: 0,
                  lineHeight: 1.12,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  textShadow: '0 6px 24px rgba(0,0,0,0.95)',
                }}
              >
                {currentStage.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Subtext Panel in Safe Zone */}
        <div
          style={{
            opacity: subtextSpring,
            transform: `translateY(${interpolate(subtextSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <GraphicPanel accentColor={COLORS.amber} style={{ padding: '28px 36px' }}>
            <p
              style={{
                margin: 0,
                color: COLORS.offWhite,
                fontSize: 38,
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: 1.25,
              }}
            >
              &ldquo;The loop repeats.{' '}
              <span style={{ color: COLORS.amber }}>The resentment bubbles.</span>&rdquo;
            </p>
          </GraphicPanel>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * SCENE 4: Conclusion & Link in Bio (Frames 751 - 1050 / 25 - 35s -> 300 frames)
 * Visual: Minimalist balance scale illustration (/assets/scale.webp)
 * Big bold kinetic text: "WATERING GRASS IN A THUNDERSTORM"
 * Subtitle / Badge: "Read the interactive exploration at observations.moth1.xyz"
 */
const Scene4Conclusion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 300], [1.0, 1.15], {
    extrapolateRight: 'clamp',
  });

  const scalePanelSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  const kineticWords = ['WATERING', 'GRASS IN A', 'THUNDERSTORM'];

  const badgeSpring = spring({
    frame: frame - 68,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal }}>
      {/* Background Scale Illustration with Ken Burns Zoom */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('assets/scale.webp')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${bgScale})`,
            opacity: 0.45,
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(8,9,10,0.9) 0%, rgba(8,9,10,0.55) 45%, rgba(8,9,10,0.95) 100%)',
          }}
        />
      </AbsoluteFill>

      <InkRainOverlay frame={frame + 751} opacity={0.42} />

      <AbsoluteFill
        style={{
          ...SAFE_ZONE_STYLE,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Framed Balance Scale Visual Panel */}
        <div
          style={{
            opacity: scalePanelSpring,
            transform: `scale(${interpolate(scalePanelSpring, [0, 1], [0.92, 1])})`,
          }}
        >
          <div
            style={{
              position: 'relative',
              height: 440,
              border: `3px solid ${COLORS.borderMuted}`,
              overflow: 'hidden',
              backgroundColor: '#0e1014',
            }}
          >
            <Img
              src={staticFile('assets/scale.webp')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${bgScale})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(8, 9, 10, 0.9)',
                padding: '10px 20px',
                border: `1px solid ${COLORS.borderMuted}`,
                fontSize: 19,
                fontWeight: 700,
              }}
            >
              <span style={{ color: COLORS.crimson }}>78% PUBLIC SECURITY</span>
              <span style={{ color: COLORS.amber }}>22% EDUCATION &amp; HEALTH</span>
            </div>
          </div>
        </div>

        {/* Big Bold Kinetic Title */}
        <GraphicPanel accentColor={COLORS.amber} style={{ padding: '40px 44px' }}>
          <div
            style={{
              color: COLORS.amber,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.22em',
              marginBottom: 18,
              textTransform: 'uppercase',
            }}
          >
            OBSERVATIONS BY MOTH1 // ISSUE #01
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {kineticWords.map((line, i) => {
              const lineSpring = spring({
                frame: frame - (20 + i * 12),
                fps,
                config: { damping: 13, stiffness: 120 },
              });
              return (
                <div
                  key={line}
                  style={{
                    opacity: lineSpring,
                    transform: `translateY(${interpolate(lineSpring, [0, 1], [40, 0])}px)`,
                    color: i === 2 ? COLORS.amber : COLORS.offWhite,
                    fontSize: 68,
                    fontWeight: 900,
                    lineHeight: 1.06,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </GraphicPanel>

        {/* Call to Action / Link in Bio Badge */}
        <div
          style={{
            opacity: badgeSpring,
            transform: `translateY(${interpolate(badgeSpring, [0, 1], [35, 0])}px)`,
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.amber,
              color: COLORS.charcoal,
              padding: '28px 32px',
              border: `3px solid ${COLORS.offWhite}`,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                marginBottom: 8,
              }}
            >
              Read the interactive exploration at
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: '0.02em',
              }}
            >
              observations.moth1.xyz
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Master 9:16 Instagram Reel Composition (1080x1920, 30fps, 1050 frames / 35s)
 */
export const WateringGrassReel = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal }}>
      {/* Load Montserrat Typography */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap');`}
      </style>

      {/* Scene 1: Hook (Frames 0 - 180 / 0 - 6s) */}
      <Sequence from={0} durationInFrames={181} name="Scene 1: Hook">
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: The Geriatric Disconnect (Frames 181 - 420 / 6 - 14s) */}
      <Sequence
        from={181}
        durationInFrames={240}
        name="Scene 2: The Geriatric Disconnect"
      >
        <Scene2Disconnect />
      </Sequence>

      {/* Scene 3: The 4-Stage Protest Loop (Frames 421 - 750 / 14 - 25s) */}
      <Sequence
        from={421}
        durationInFrames={330}
        name="Scene 3: The 4-Stage Protest Loop"
      >
        <Scene3ProtestLoop />
      </Sequence>

      {/* Scene 4: Conclusion & Link in Bio (Frames 751 - 1050 / 25 - 35s) */}
      <Sequence
        from={751}
        durationInFrames={300}
        name="Scene 4: Conclusion & CTA"
      >
        <Scene4Conclusion />
      </Sequence>
    </AbsoluteFill>
  );
};
