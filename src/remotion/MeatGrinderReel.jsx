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

const COLORS = {
  bg: '#0f1115',
  panel: '#121316',
  text: '#e2e8f0',
  mint: '#86efac',
  cyan: '#67e8f9',
  coral: '#fda4af',
  lavender: '#c084fc',
};

const SafeFrame = ({ children, tag = '[SEC // 02]', accent = COLORS.mint }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif",
        color: COLORS.text,
      }}
    >
      {/* Safe Zone Container: Top 220px, Bottom 320px */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          bottom: 320,
          left: 64,
          right: 64,
          border: '2px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          backgroundColor: COLORS.panel,
        }}
      >
        {/* Top Metadata Bar */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accent,
            fontWeight: 700,
            zIndex: 10,
            backgroundColor: 'rgba(15,17,21,0.9)',
          }}
        >
          <span>OBSERVATIONS BY MOTH1</span>
          <span>{tag}</span>
        </div>

        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          {children}
        </div>

        {/* Bottom Metadata Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 16,
            letterSpacing: '0.18em',
            color: '#94a3b8',
            zIndex: 10,
            backgroundColor: 'rgba(15,17,21,0.9)',
          }}
        >
          <span>ISSUE #02 // THE MEAT GRINDER</span>
          <span style={{ color: COLORS.cyan }}>observations.moth1.xyz</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 1 (0 - 180): Hook
const SceneHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(frame, [0, 180], [1.02, 1.14], {
    extrapolateRight: 'clamp',
  });
  const textSpring = spring({ frame: frame - 10, fps, config: { damping: 16 } });

  return (
    <SafeFrame tag="[DISPATCH // 02]" accent={COLORS.mint}>
      <Img
        src={staticFile('issues/issue-02/hero-machine.webp')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(15,17,21,0.3) 0%, rgba(15,17,21,0.92) 85%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 48,
        }}
      >
        <div
          style={{
            opacity: textSpring,
            transform: `translateY(${interpolate(textSpring, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              border: `1px solid ${COLORS.coral}`,
              color: COLORS.coral,
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.2em',
              marginBottom: 24,
            }}
          >
            GLOBAL TFR FREEFALL
          </div>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.08,
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            The Meat Grinder Is Running Out of{' '}
            <span style={{ color: COLORS.mint }}>Meat.</span>
          </h1>
          <p style={{ fontSize: 28, lineHeight: 1.45, color: '#cbd5e1' }}>
            Politicians don’t care about family dignity. They care about future
            taxpayers and warm bodies for GDP.
          </p>
        </div>
      </div>
    </SafeFrame>
  );
};

// Scene 2 (181 - 420): Collapsing Venn Diagram
const SceneVenn = () => {
  const frame = useCurrentFrame();
  const sep = interpolate(frame, [20, 160], [0, 110], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const holeOpacity = interpolate(frame, [80, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SafeFrame tag="[THE VENN COLLAPSE]" accent={COLORS.cyan}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 44,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 46,
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Why the Family Venn Collapsed
          </h2>
          <p style={{ fontSize: 24, color: '#94a3b8' }}>
            Family Support • Housing Policy • Financial Security
          </p>
        </div>

        <svg width="720" height="580" viewBox="0 0 400 340">
          <circle
            cx={185 - sep * 0.55}
            cy={155 - sep * 0.42}
            r="75"
            fill={COLORS.mint}
            fillOpacity="0.18"
            stroke={COLORS.mint}
            strokeWidth="2.5"
          />
          <circle
            cx={215 + sep * 0.55}
            cy={155 - sep * 0.42}
            r="75"
            fill={COLORS.cyan}
            fillOpacity="0.18"
            stroke={COLORS.cyan}
            strokeWidth="2.5"
          />
          <circle
            cx={200}
            cy={185 + sep * 0.58}
            r="75"
            fill={COLORS.coral}
            fillOpacity="0.18"
            stroke={COLORS.coral}
            strokeWidth="2.5"
          />
          <g style={{ opacity: holeOpacity }}>
            <circle
              cx="200"
              cy="168"
              r="46"
              fill="#090a0d"
              stroke={COLORS.coral}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <text
              x="200"
              y="165"
              textAnchor="middle"
              fill={COLORS.coral}
              fontSize="12"
              fontWeight="800"
            >
              TFR BLACK HOLE
            </text>
            <text
              x="200"
              y="180"
              textAnchor="middle"
              fill={COLORS.lavender}
              fontSize="10"
              fontWeight="700"
            >
              0.72 – 0.97 TFR
            </text>
          </g>
        </svg>

        <div
          style={{
            padding: 28,
            border: '1px solid #1e293b',
            backgroundColor: '#0f1115',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 26, fontWeight: 700, color: COLORS.coral }}>
            All 3 circles drifted apart, leaving a demographic void in the center.
          </p>
        </div>
      </div>
    </SafeFrame>
  );
};

// Scene 3 (421 - 750): The 4 Contradictions Rapid Cut
const SceneContradictions = () => {
  const frame = useCurrentFrame();
  const stages = [
    {
      img: 'issues/issue-02/contradiction-1-ai.webp',
      title: '01 // AI & Stolen Ladders',
      sub: 'Automating entry-level careers while demanding more future workers.',
      accent: COLORS.mint,
    },
    {
      img: 'issues/issue-02/contradiction-2-sinking.webp',
      title: '02 // Sinking Cities (2050)',
      sub: '30-year mortgages in coastal cities facing chronic sea-level flooding.',
      accent: COLORS.cyan,
    },
    {
      img: 'issues/issue-02/contradiction-3-subsidy.webp',
      title: '03 // The Paid Gig Baby',
      sub: 'One-off baby bonuses against $300K+ child-rearing & housing costs.',
      accent: COLORS.coral,
    },
    {
      img: 'issues/issue-02/contradiction-4-sandwich.webp',
      title: '04 // Sandwich Generation Fatigue',
      sub: 'Supporting aging parents with zero time or bandwidth left.',
      accent: COLORS.lavender,
    },
  ];
  const idx = Math.min(3, Math.floor(frame / 82));
  const current = stages[idx];

  return (
    <SafeFrame tag="[THE 4 CONTRADICTIONS]" accent={current.accent}>
      <Img
        src={staticFile(current.img)}
        style={{
          width: '100%',
          height: '62%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          padding: 40,
          height: '38%',
          backgroundColor: '#0f1115',
          borderTop: `2px solid ${current.accent}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: current.accent,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.16em',
            marginBottom: 14,
          }}
        >
          {current.title}
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.3 }}>
          {current.sub}
        </div>
      </div>
    </SafeFrame>
  );
};

// Scene 4 (751 - 1050): Quiet Earth & CTA
const SceneConclusion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgeSpring = spring({ frame: frame - 15, fps, config: { damping: 14 } });

  return (
    <SafeFrame tag="[QUIET EARTH // FINALE]" accent={COLORS.mint}>
      <Img
        src={staticFile('issues/issue-02/quiet-earth.webp')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(15,17,21,0.45) 0%, rgba(15,17,21,0.95) 85%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 28,
            color: COLORS.mint,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Maybe the Earth Is Simply Exhausted
        </p>
        <h1
          style={{
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.06,
            textTransform: 'uppercase',
            marginBottom: 36,
          }}
        >
          THE MEAT GRINDER NEEDS MORE MEAT
        </h1>
        <div
          style={{
            transform: `scale(${badgeSpring})`,
            padding: '22px 36px',
            backgroundColor: COLORS.mint,
            color: '#0f1115',
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          observations.moth1.xyz/the-meat-grinder
        </div>
      </div>
    </SafeFrame>
  );
};

export const MeatGrinderReel = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sequence from={0} durationInFrames={180}>
        <SceneHook />
      </Sequence>
      <Sequence from={180} durationInFrames={240}>
        <SceneVenn />
      </Sequence>
      <Sequence from={420} durationInFrames={330}>
        <SceneContradictions />
      </Sequence>
      <Sequence from={750} durationInFrames={300}>
        <SceneConclusion />
      </Sequence>
    </AbsoluteFill>
  );
};
