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
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  border: '#1e293b',
  mint: '#86efac',
  cyan: '#67e8f9',
  coral: '#fda4af',
  lavender: '#c084fc',
};

/**
 * CyberPanel card with subtle '+' corner brackets matching the live Issue #02 web essay
 */
const CyberCard = ({
  children,
  label,
  accent = COLORS.mint,
  style = {},
}) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'rgba(18, 19, 22, 0.92)',
        border: `1.5px solid ${COLORS.border}`,
        padding: '28px 32px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
        ...style,
      }}
    >
      {/* '+' Corner Brackets */}
      {[
        { top: -12, left: -8 },
        { top: -12, right: -8 },
        { bottom: -12, left: -8 },
        { bottom: -12, right: -8 },
      ].map((pos, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            color: accent,
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1,
            opacity: 0.8,
          }}
        >
          +
        </span>
      ))}

      {/* Top pastel accent hairline */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${accent} 0%, transparent 85%)`,
        }}
      />

      {label && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: accent,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              color: accent,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        </div>
      )}

      {children}
    </div>
  );
};

/**
 * SafeFrame: 9:16 Vertical Stage respecting Instagram/Facebook Reel safe zones
 * (Top 210px and Bottom 300px kept clear for platform UI overlays)
 */
const SafeFrame = ({
  children,
  sectionLabel = 'THE MEAT GRINDER NEEDS MORE MEAT',
  accent = COLORS.mint,
  globalProgress = 0,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif",
        color: COLORS.text,
      }}
    >
      {/* Safe Zone Container: Top 210px, Bottom 300px */}
      <div
        style={{
          position: 'absolute',
          top: 210,
          bottom: 300,
          left: 56,
          right: 56,
          border: `2px solid ${COLORS.border}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          backgroundColor: COLORS.panel,
        }}
      >
        {/* Top Masthead Bar (No '//' structural markers) */}
        <div
          style={{
            position: 'relative',
            padding: '18px 26px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 17,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 700,
            zIndex: 10,
            backgroundColor: 'rgba(15, 17, 21, 0.94)',
          }}
        >
          <span style={{ color: COLORS.text }}>OBSERVATIONS BY MOTH1</span>
          <span style={{ color: accent }}>{sectionLabel}</span>

          {/* Progress Hairline */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 2,
              width: `${Math.min(100, Math.max(0, globalProgress * 100))}%`,
              background: `linear-gradient(90deg, ${COLORS.mint}, ${COLORS.cyan}, ${COLORS.lavender})`,
            }}
          />
        </div>

        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          {children}
        </div>

        {/* Bottom Metadata Bar */}
        <div
          style={{
            padding: '15px 26px',
            borderTop: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 15,
            letterSpacing: '0.15em',
            color: COLORS.slate400,
            fontWeight: 600,
            zIndex: 10,
            backgroundColor: 'rgba(15, 17, 21, 0.94)',
          }}
        >
          <span>THE MEAT GRINDER NEEDS MORE MEAT</span>
          <span style={{ color: COLORS.cyan, fontWeight: 700 }}>
            observations.moth1.xyz/the-meat-grinder
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 1 (0 - 210 frames / 7.0s): Hero Cover -> Cold Open & 3 Data Anchors
// ============================================================================
const SceneHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, 210], [1.02, 1.12], {
    extrapolateRight: 'clamp',
  });

  // Part A (0 - 95): Cover Title, Part B (85 - 210): Cold Open + 3 Data Points
  const coverOpacity = interpolate(frame, [0, 12, 78, 98], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const coldOpenOpacity = interpolate(frame, [86, 108], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const barFill = interpolate(frame, [104, 165], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleSpring = spring({ frame: frame - 5, fps, config: { damping: 16 } });

  const anchors = [
    {
      label: 'The Ecological Deficit (Carrying Capacity)',
      value: '1.73 Earths',
      pct: 87,
      color: COLORS.mint,
    },
    {
      label: 'The 2050 Inundation Horizon',
      value: 'Bangkok • Saigon • Jakarta • Manila',
      pct: 82,
      color: COLORS.cyan,
    },
    {
      label: 'The Billionaire / State Contradiction',
      value: '300M Jobs Exposed to AI',
      pct: 91,
      color: COLORS.coral,
    },
  ];

  return (
    <SafeFrame
      sectionLabel="THE COLD OPEN"
      accent={COLORS.cyan}
      globalProgress={frame / 1260}
    >
      {/* Background Layer 1: Hero Skyline */}
      <Img
        src={staticFile('issues/issue-02/hero-machine.webp')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
          opacity: interpolate(frame, [78, 105], [0.75, 0.28], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 35%, rgba(103,232,249,0.08) 0%, rgba(18,19,22,0.92) 88%)',
        }}
      />

      {/* PART A: Hero Title Cover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: coverOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 44,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(titleSpring, [0, 1], [36, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 20px',
              border: `1px solid ${COLORS.border}`,
              backgroundColor: 'rgba(18,19,22,0.9)',
              color: COLORS.cyan,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 26,
            }}
          >
            OBSERVATIONS BY MOTH1 • NOV 2026
          </div>

          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.05,
              textTransform: 'uppercase',
              marginBottom: 24,
              color: COLORS.text,
            }}
          >
            The Meat Grinder{' '}
            <span style={{ color: COLORS.mint }}>Needs More Meat</span>
          </h1>

          <p
            style={{
              fontSize: 30,
              color: COLORS.slate300,
              fontWeight: 500,
              marginBottom: 34,
            }}
          >
            The billionaire panic vs. the biological scam.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            {[
              { text: '1.73 Earths Consumed', color: COLORS.mint },
              { text: '2050 Coastal Horizon', color: COLORS.cyan },
              { text: 'The Biological Scam', color: COLORS.lavender },
            ].map((pill) => (
              <span
                key={pill.text}
                style={{
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: 'rgba(18,19,22,0.9)',
                  padding: '8px 16px',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: pill.color,
                }}
              >
                {pill.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PART B: Cold Open Spread + 3 Undeniable Data Points */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: coldOpenOpacity,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 32,
          gap: 20,
        }}
      >
        <CyberCard label="The Cold Open" accent={COLORS.cyan}>
          <div
            style={{
              width: '100%',
              height: 250,
              border: `1px solid ${COLORS.border}`,
              overflow: 'hidden',
              marginBottom: 18,
            }}
          >
            <Img
              src={staticFile('issues/issue-02/hero-grinder.webp')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <h2
            style={{
              fontSize: 27,
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: 14,
              color: COLORS.text,
            }}
          >
            You know why the total fertility rate is in freefall worldwide and
            people simply refuse to have children?
          </h2>

          <p
            style={{
              fontSize: 21,
              lineHeight: 1.42,
              color: COLORS.slate300,
              marginBottom: 12,
            }}
          >
            Listen to politicians and tech billionaires whine on podcasts, and
            they will tell you civilisation is collapsing because people have
            become selfish. What they really mean is the meat grinder is running
            out of meat.
          </p>

          <p
            style={{
              fontSize: 20,
              lineHeight: 1.4,
              color: COLORS.text,
              borderLeft: `3px solid ${COLORS.lavender}`,
              paddingLeft: 14,
            }}
          >
            They care about future taxpayers to fund old-age welfare deficits,
            and warm bodies to keep consumer demand humming.
          </p>
        </CyberCard>

        <CyberCard label="Three Undeniable Data Points" accent={COLORS.mint}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {anchors.map((a) => (
              <div
                key={a.label}
                style={{
                  padding: '12px 16px',
                  backgroundColor: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: COLORS.text }}>{a.label}</span>
                  <span style={{ color: a.color }}>{a.value}</span>
                </div>
                <div
                  style={{
                    height: 8,
                    width: '100%',
                    backgroundColor: '#090b0e',
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round(a.pct * barFill)}%`,
                      backgroundColor: a.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              color: COLORS.slate400,
            }}
          >
            Ref: Global Footprint Network (1.73 Earths Overshoot Index), Climate
            Central 2050 Coastal DEM &amp; WEF Future of Jobs Report.
          </div>
        </CyberCard>
      </div>
    </SafeFrame>
  );
};

// ============================================================================
// SCENE 2 (210 - 450 frames / 8.0s): The Collapsing Venn Diagram
// ============================================================================
const SceneVenn = () => {
  const frame = useCurrentFrame();

  const sep = interpolate(frame, [45, 165], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ax = interpolate(sep, [0, 1], [174, 104]);
  const ay = interpolate(sep, [0, 1], [148, 92]);
  const bx = interpolate(sep, [0, 1], [226, 296]);
  const by = interpolate(sep, [0, 1], [148, 92]);
  const cx = 200;
  const cy = interpolate(sep, [0, 1], [192, 268]);

  const makeBabyOpacity = interpolate(sep, [0, 0.42], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blackHoleOpacity = interpolate(sep, [0.34, 0.82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const divergencePct = Math.round(sep * 100);
  const currentTfr = (2.1 - sep * 1.13).toFixed(2);
  const isCollapsed = sep > 0.5;

  return (
    <SafeFrame
      sectionLabel="THE COLLAPSING VENN DIAGRAM"
      accent={isCollapsed ? COLORS.coral : COLORS.mint}
      globalProgress={(210 + frame) / 1260}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 32,
          gap: 18,
        }}
      >
        {/* Top SVG Venn Panel */}
        <CyberCard
          label="The Collapsing Venn Diagram"
          accent={isCollapsed ? COLORS.coral : COLORS.mint}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 12,
              borderBottom: `1px solid ${COLORS.border}`,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            <span>
              CIRCLE DRIFT:{' '}
              <strong style={{ color: isCollapsed ? COLORS.coral : COLORS.mint }}>
                {divergencePct}%
              </strong>
            </span>
            <span>
              FERTILITY RATE:{' '}
              <strong style={{ color: isCollapsed ? COLORS.coral : COLORS.cyan }}>
                {currentTfr}
              </strong>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <svg width="620" height="470" viewBox="0 0 400 340">
              <line
                x1="200"
                y1="20"
                x2="200"
                y2="320"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1="30"
                y1="166"
                x2="370"
                y2="166"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Circle A: Family Support */}
              <g transform={`translate(${ax}, ${ay})`}>
                <circle
                  cx="0"
                  cy="0"
                  r="75"
                  fill={COLORS.mint}
                  fillOpacity="0.14"
                  stroke={COLORS.mint}
                  strokeWidth="2.2"
                />
                <text
                  x="0"
                  y="-40"
                  textAnchor="middle"
                  fill={COLORS.mint}
                  fontSize="11"
                  fontWeight="800"
                >
                  FAMILY SUPPORT
                </text>
              </g>

              {/* Circle B: Social Policies & Housing */}
              <g transform={`translate(${bx}, ${by})`}>
                <circle
                  cx="0"
                  cy="0"
                  r="75"
                  fill={COLORS.cyan}
                  fillOpacity="0.14"
                  stroke={COLORS.cyan}
                  strokeWidth="2.2"
                />
                <text
                  x="0"
                  y="-40"
                  textAnchor="middle"
                  fill={COLORS.cyan}
                  fontSize="11"
                  fontWeight="800"
                >
                  SOCIAL POLICIES &amp; HOUSING
                </text>
              </g>

              {/* Circle C: Financial Sustainability */}
              <g transform={`translate(${cx}, ${cy})`}>
                <circle
                  cx="0"
                  cy="0"
                  r="75"
                  fill={COLORS.coral}
                  fillOpacity="0.14"
                  stroke={COLORS.coral}
                  strokeWidth="2.2"
                />
                <text
                  x="0"
                  y="46"
                  textAnchor="middle"
                  fill={COLORS.coral}
                  fontSize="11"
                  fontWeight="800"
                >
                  FINANCIAL SUSTAINABILITY
                </text>
              </g>

              {/* Initial Overlap: Make Baby */}
              <g opacity={makeBabyOpacity} transform="translate(200, 164)">
                <circle
                  cx="0"
                  cy="0"
                  r="30"
                  fill="#121316"
                  stroke={COLORS.coral}
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={COLORS.text}
                  fontSize="10"
                  fontWeight="800"
                >
                  MAKE BABY
                </text>
              </g>

              {/* Separated Void: TFR BLACK HOLE */}
              <g opacity={blackHoleOpacity} transform="translate(200, 164)">
                <circle
                  cx="0"
                  cy="0"
                  r="48"
                  fill="#050608"
                  stroke={COLORS.coral}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill={COLORS.coral}
                  fontSize="11"
                  fontWeight="900"
                >
                  TFR BLACK HOLE
                </text>
                <text
                  x="0"
                  y="11"
                  textAnchor="middle"
                  fill={COLORS.lavender}
                  fontSize="8.5"
                  fontWeight="700"
                >
                  THE MIDDLE FELL THROUGH
                </text>
              </g>
            </svg>
          </div>

          <div style={{ fontSize: 13, color: COLORS.slate400 }}>
            Ref: OECD Family Database (2024), SingStat (0.97 TFR) &amp;
            Statistics Korea KOSTAT (0.72 TFR).
          </div>
        </CyberCard>

        {/* Bottom Narrative Card Synchronized to Circle Drift */}
        <CyberCard
          label={
            !isCollapsed
              ? 'When the Circles Held Together'
              : 'The Middle Fell Through'
          }
          accent={!isCollapsed ? COLORS.cyan : COLORS.coral}
        >
          <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
            <div
              style={{
                width: 280,
                height: 175,
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Img
                src={staticFile(
                  !isCollapsed
                    ? 'issues/issue-02/venn-village.webp'
                    : 'issues/issue-02/venn-blackhole.webp'
                )}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 20,
                  lineHeight: 1.42,
                  color: COLORS.text,
                  marginBottom: 12,
                }}
              >
                {!isCollapsed
                  ? "In our grandparents' era, these circles held together: extended families, community trust, and a baseline where one income could house and feed five kids."
                  : 'In the early 2000s, those circles drifted apart. Today, governments toss baby-bonus cash into that black hole and wonder why the needle does not move.'}
              </p>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: !isCollapsed ? COLORS.cyan : COLORS.coral,
                }}
              >
                {!isCollapsed
                  ? '2.10 REPLACEMENT OVERLAP'
                  : '0.72 TO 0.97 TFR BLACK HOLE'}
              </div>
            </div>
          </div>
        </CyberCard>
      </div>
    </SafeFrame>
  );
};

// ============================================================================
// SCENE 3 (450 - 770 frames / 10.67s): The Grand Contradictions (4 Slides)
// ============================================================================
const SceneContradictions = () => {
  const frame = useCurrentFrame();

  const stages = [
    {
      code: '01',
      subtitle: 'AI & Stolen Ladders',
      title: 'The Automation Paradox',
      copy: 'People breeding workers for a market that is aggressively automating them out of existence. Kids born today face a world where cognitive work is taken by models and entry-level career ladders are dismantled.',
      img: 'issues/issue-02/contradiction-1-ai.webp',
      metricLabel: 'ENTRY-LEVEL & COGNITIVE ROLES EXPOSED TO AI',
      metricValue: '300M ROLES AT RISK',
      barPercent: 86,
      accent: COLORS.mint,
      citation:
        "Ref: Goldman Sachs Global Macro Research & WEF 'Future of Jobs Report' (2025)",
    },
    {
      code: '02',
      subtitle: '1.73 Earths & Rising Seas',
      title: 'Sinking Cities (The 2050 Horizon)',
      copy: 'By 2050, major coastal hubs from Bangkok and Manila to southern Vietnam face chronic flooding and displacement. We consume 1.73 Earths every year; the planet is choking on extraction, yet leaders plead for more mouths to feed.',
      img: 'issues/issue-02/contradiction-2-sinking.webp',
      metricLabel: 'GLOBAL ECOLOGICAL CONSUMPTION DEFICIT',
      metricValue: '1.73 EARTHS / YEAR',
      barPercent: 90,
      accent: COLORS.cyan,
      citation:
        'Ref: Global Footprint Network (1.73 Earths) & Climate Central 2050 Projections',
    },
    {
      code: '03',
      subtitle: 'Financialised Shelter & Subsidies',
      title: 'The "Paid Gig" Child',
      copy: 'In modern hyper-expensive cities, housing was transformed from shelter into an appreciating financial asset to flip. Subsidies and paternal leave do not guarantee your child will not grow up trapped in a rat race.',
      img: 'issues/issue-02/contradiction-3-subsidy.webp',
      metricLabel: 'HOUSING & CHILD COST VS. SUBSIDY TOKEN',
      metricValue: '$310K+ COST BURDEN',
      barPercent: 93,
      accent: COLORS.coral,
      citation:
        'Ref: Brookings Institution Lifetime Child Cost Analysis & Demographia Index',
    },
    {
      code: '04',
      subtitle: 'Sandwich Generation Trap',
      title: 'The Sandwich Meat',
      copy: "Today's adults are the sandwich filling: exhausted caregivers carrying aging parents past retirement on one shoulder, while being pressured to bear children on the other, with zero community support.",
      img: 'issues/issue-02/contradiction-4-sandwich.webp',
      metricLabel: 'WORKING ADULTS SQUEEZED BY DUAL CAREGIVING',
      metricValue: '54% CAREGIVER STRAIN',
      barPercent: 96,
      accent: COLORS.lavender,
      citation:
        'Ref: Pew Research Center Intergenerational Care Study & OECD Projections',
    },
  ];

  const slideDuration = 80;
  const idx = Math.min(3, Math.floor(frame / slideDuration));
  const localFrame = frame - idx * slideDuration;
  const current = stages[idx];

  const barGrowth = interpolate(localFrame, [6, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SafeFrame
      sectionLabel="THE GRAND CONTRADICTIONS"
      accent={current.accent}
      globalProgress={(450 + frame) / 1260}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 32,
          gap: 18,
        }}
      >
        {/* Top Section Header + 01-04 Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 14,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.text }}>
            The Grand Contradictions
          </h2>
          <div style={{ display: 'flex', gap: 10 }}>
            {stages.map((s, i) => {
              const active = i === idx;
              return (
                <div
                  key={s.code}
                  style={{
                    padding: '6px 16px',
                    border: `1.5px solid ${active ? s.accent : COLORS.border}`,
                    backgroundColor: active ? `${s.accent}22` : COLORS.bg,
                    color: active ? s.accent : COLORS.slate400,
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  {s.code}
                </div>
              );
            })}
          </div>
        </div>

        {/* Large Full-Width Illustration Panel */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 490,
            border: `1.5px solid ${COLORS.border}`,
            overflow: 'hidden',
            backgroundColor: COLORS.bg,
          }}
        >
          <Img
            src={staticFile(current.img)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 18,
              left: 18,
              padding: '8px 18px',
              backgroundColor: 'rgba(18, 19, 22, 0.92)',
              border: `1px solid ${current.accent}`,
              color: current.accent,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            {current.subtitle}
          </div>
        </div>

        {/* Narrative & Animated Metric Card */}
        <CyberCard label={current.subtitle} accent={current.accent}>
          <h3
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.text,
              marginBottom: 14,
            }}
          >
            {current.title}
          </h3>
          <p
            style={{
              fontSize: 22,
              lineHeight: 1.44,
              color: COLORS.slate300,
              marginBottom: 22,
            }}
          >
            {current.copy}
          </p>

          <div
            style={{
              padding: '16px 20px',
              backgroundColor: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              <span style={{ color: COLORS.slate400 }}>
                {current.metricLabel}
              </span>
              <span style={{ color: current.accent, fontWeight: 800 }}>
                {current.metricValue}
              </span>
            </div>
            <div
              style={{
                height: 10,
                width: '100%',
                backgroundColor: '#090b0e',
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.round(current.barPercent * barGrowth)}%`,
                  backgroundColor: current.accent,
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: 14, color: COLORS.slate400 }}>
            {current.citation}
          </div>
        </CyberCard>
      </div>
    </SafeFrame>
  );
};

// ============================================================================
// SCENE 4 (770 - 1010 frames / 8.0s): Three Uncomfortable Counter-Proposals
// ============================================================================
const SceneProposals = () => {
  const frame = useCurrentFrame();

  const proposals = [
    {
      code: '01',
      title: 'Redefine the Family Unit',
      copy: 'The rigid state definition of a nuclear family, father, mother, and legal marriage, is completely outdated. Housing and childcare frameworks must open fully to cohabitation, single parents, and queer partnerships.',
      img: 'issues/issue-02/taboo-1-unit.webp',
      metricLabel: 'NON-TRADITIONAL & COHABITING HOUSEHOLD SHARE',
      metricValue: '62% OF MODERN HOUSEHOLDS',
      barPercent: 80,
      accent: COLORS.mint,
      citation:
        'Ref: OECD Household Projections (2024-2040) & Family Policy Inclusivity Index',
    },
    {
      code: '02',
      title: 'Normalise Dignity in Aging (Euthanasia)',
      copy: 'Millions of elderly citizens are trapped in physical decay, feeling like indefinite financial burdens on their exhausted children. End-of-life autonomy and legalised euthanasia restore dignity and relieve caregiver strain.',
      img: 'issues/issue-02/taboo-2-dignity.webp',
      metricLabel: 'FINAL-YEAR MEDICAL SHARE & PUBLIC AUTONOMY SUPPORT',
      metricValue: '74% SUPPORT END-OF-LIFE AUTONOMY',
      barPercent: 85,
      accent: COLORS.cyan,
      citation:
        'Ref: The Lancet Commission on the Value of Death (2022) & OECD Care Expenditure',
    },
    {
      code: '03',
      title: 'Kill the "Growth at All Costs" Fetish',
      copy: 'You cannot prioritize perpetual GDP expansion and expect people to build healthy families. An economic model that demands infinite growth on a finite, overheated planet will always sacrifice human wellbeing.',
      img: 'issues/issue-02/taboo-3-degrowth.webp',
      metricLabel: 'PLANETARY BIOCAPACITY OVERSHOOT',
      metricValue: '1.73 EARTHS CONSUMED ANNUALLY',
      barPercent: 92,
      accent: COLORS.lavender,
      citation:
        'Ref: Global Footprint Network Earth Overshoot Index & Hickel et al. (Nature, 2022)',
    },
  ];

  const propDuration = 80;
  const idx = Math.min(2, Math.floor(frame / propDuration));
  const localFrame = frame - idx * propDuration;
  const activeProp = proposals[idx];

  const barGrowth = interpolate(localFrame, [6, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SafeFrame
      sectionLabel="THREE COUNTER-PROPOSALS"
      accent={activeProp.accent}
      globalProgress={(770 + frame) / 1260}
    >
      {/* Matching Background Artwork Texture */}
      <Img
        src={staticFile(activeProp.img)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.24,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 32,
          gap: 18,
        }}
      >
        <div
          style={{
            paddingBottom: 12,
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.text }}>
            Three Uncomfortable Counter-Proposals
          </h2>
        </div>

        {/* 3 Proposal Selector Tabs with Artwork Backdrops */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {proposals.map((p, i) => {
            const selected = i === idx;
            return (
              <div
                key={p.code}
                style={{
                  position: 'relative',
                  padding: '16px 18px',
                  border: `1.5px solid ${selected ? p.accent : COLORS.border}`,
                  backgroundColor: COLORS.bg,
                  overflow: 'hidden',
                }}
              >
                <Img
                  src={staticFile(p.img)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: selected ? 0.35 : 0.15,
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    fontSize: 15,
                    fontWeight: 800,
                    color: selected ? p.accent : COLORS.slate400,
                    marginBottom: 6,
                  }}
                >
                  {p.code} {selected ? '• ACTIVE' : ''}
                </div>
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    fontSize: 18,
                    fontWeight: 700,
                    color: COLORS.text,
                    lineHeight: 1.25,
                  }}
                >
                  {p.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Proposal Artwork + Card */}
        <CyberCard accent={activeProp.accent} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                width: '100%',
                height: 390,
                border: `1px solid ${COLORS.border}`,
                overflow: 'hidden',
                marginBottom: 20,
              }}
            >
              <Img
                src={staticFile(activeProp.img)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h3
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: COLORS.text,
                marginBottom: 12,
              }}
            >
              {activeProp.title}
            </h3>

            <p
              style={{
                fontSize: 21,
                lineHeight: 1.42,
                color: COLORS.slate300,
              }}
            >
              {activeProp.copy}
            </p>
          </div>

          <div
            style={{
              paddingTop: 16,
              borderTop: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              <span style={{ color: COLORS.slate400 }}>
                {activeProp.metricLabel}
              </span>
              <span style={{ color: activeProp.accent }}>
                {activeProp.metricValue}
              </span>
            </div>
            <div
              style={{
                height: 10,
                width: '100%',
                backgroundColor: '#090b0e',
                border: `1px solid ${COLORS.border}`,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.round(activeProp.barPercent * barGrowth)}%`,
                  backgroundColor: activeProp.accent,
                }}
              />
            </div>
            <div style={{ fontSize: 14, color: COLORS.slate400 }}>
              {activeProp.citation}
            </div>
          </div>
        </CyberCard>
      </div>
    </SafeFrame>
  );
};

// ============================================================================
// SCENE 5 (1010 - 1260 frames / 8.33s): Full-Screen Quiet Earth Finale
// ============================================================================
const SceneConclusion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 250], [1.0, 1.08], {
    extrapolateRight: 'clamp',
  });
  const bgOpacity = interpolate(frame, [0, 35, 80], [0.92, 0.92, 0.48], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardOpacity = interpolate(frame, [28, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bodyText =
    "But when you look around at an unaffordable world, an unstable climate, and an automated job landscape run by billionaires who hoard the ladder, having less people is not a crisis. It is a biological correction. The planet is tired of us, and declining birth rates are simply society's immune response.";

  const charCount = Math.floor(
    interpolate(frame, [45, 165], [0, bodyText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedBody = bodyText.slice(0, charCount);

  const punchlineOpacity = interpolate(frame, [160, 190], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badgeSpring = spring({
    frame: frame - 170,
    fps,
    config: { damping: 14 },
  });

  return (
    <SafeFrame
      sectionLabel="BIOLOGICAL CORRECTION"
      accent={COLORS.mint}
      globalProgress={(1010 + frame) / 1260}
    >
      {/* Full-Screen Animated Botanical Reclamation Artwork */}
      <Img
        src={staticFile('issues/issue-02/quiet-earth.webp')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: bgOpacity,
          transform: `scale(${bgScale})`,
        }}
      />

      {/* Atmospheric Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(18,19,22,0.25) 0%, rgba(18,19,22,0.88) 88%)',
        }}
      />

      {/* Words Running Over Full-Screen Artwork */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          opacity: cardOpacity,
        }}
      >
        <CyberCard
          label="Biological Correction"
          accent={COLORS.mint}
          style={{
            backgroundColor: 'rgba(18, 19, 22, 0.85)',
            width: '100%',
          }}
        >
          <h2
            style={{
              fontSize: 40,
              fontWeight: 900,
              lineHeight: 1.18,
              color: COLORS.text,
              marginBottom: 22,
            }}
          >
            People will have kids when they genuinely feel the future is
            brighter than the past.
          </h2>

          <p
            style={{
              fontSize: 25,
              lineHeight: 1.5,
              color: COLORS.slate300,
              fontWeight: 500,
              minHeight: 190,
              marginBottom: 24,
            }}
          >
            {typedBody}
            {charCount < bodyText.length && (
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 26,
                  marginLeft: 6,
                  backgroundColor: COLORS.mint,
                  verticalAlign: 'middle',
                }}
              />
            )}
          </p>

          <div style={{ opacity: punchlineOpacity }}>
            <p
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.mint,
                borderLeft: `4px solid ${COLORS.mint}`,
                paddingLeft: 18,
                marginBottom: 28,
              }}
            >
              Everything else is just noise from people who need more cogs in
              their machine.
            </p>

            <div
              style={{
                paddingTop: 22,
                borderTop: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: COLORS.cyan,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  Observations by Moth1
                </div>
                <div style={{ fontSize: 15, color: COLORS.slate300 }}>
                  Interactive Visual Essays
                </div>
              </div>

              <div
                style={{
                  transform: `scale(${interpolate(badgeSpring, [0, 1], [0.85, 1])})`,
                  padding: '16px 26px',
                  backgroundColor: COLORS.mint,
                  color: '#121316',
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                observations.moth1.xyz/the-meat-grinder
              </div>
            </div>
          </div>
        </CyberCard>
      </div>
    </SafeFrame>
  );
};

export const MeatGrinderReel = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sequence from={0} durationInFrames={210}>
        <SceneHook />
      </Sequence>
      <Sequence from={210} durationInFrames={240}>
        <SceneVenn />
      </Sequence>
      <Sequence from={450} durationInFrames={320}>
        <SceneContradictions />
      </Sequence>
      <Sequence from={770} durationInFrames={240}>
        <SceneProposals />
      </Sequence>
      <Sequence from={1010} durationInFrames={250}>
        <SceneConclusion />
      </Sequence>
    </AbsoluteFill>
  );
};
