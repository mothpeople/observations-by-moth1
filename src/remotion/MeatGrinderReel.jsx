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
  bg: '#0b0d10',
  panel: '#121316',
  text: '#f1f5f9',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  border: '#1e293b',
  mint: '#86efac',
  cyan: '#67e8f9',
  coral: '#fda4af',
  lavender: '#c084fc',
};

const TOTAL_FRAMES = 1080; // 36.0s at 30fps

/**
 * CyberPosterCard: High-impact poster overlay with '+' corner brackets
 * Designed for giant mobile-first typography and minimal word count
 */
const CyberPosterCard = ({
  children,
  accent = COLORS.mint,
  style = {},
}) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'rgba(14, 16, 20, 0.90)',
        border: `2px solid ${COLORS.border}`,
        padding: '32px 36px',
        boxShadow: '0 28px 70px rgba(0, 0, 0, 0.9)',
        ...style,
      }}
    >
      {/* '+' Corner Brackets */}
      {[
        { top: -14, left: -9 },
        { top: -14, right: -9 },
        { bottom: -14, left: -9 },
        { bottom: -14, right: -9 },
      ].map((pos, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            color: accent,
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          +
        </span>
      ))}

      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${accent} 0%, transparent 90%)`,
        }}
      />

      {children}
    </div>
  );
};

/**
 * VisualStage: Full-bleed 1080x1920 visual canvas with Reel safe-zone HUD
 */
const VisualStage = ({
  children,
  bgImage,
  bgScale = 1.05,
  bgOpacity = 0.35,
  sectionLabel = 'THE MEAT GRINDER',
  accent = COLORS.mint,
  globalProgress = 0,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif",
        color: COLORS.text,
        overflow: 'hidden',
      }}
    >
      {/* Full-Bleed Animated Background Layer */}
      {bgImage && (
        <Img
          src={staticFile(bgImage)}
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
      )}

      {/* Deep Cinematic Gradient Scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(11,13,16,0.75) 0%, rgba(11,13,16,0.25) 35%, rgba(11,13,16,0.82) 78%, rgba(11,13,16,0.96) 100%)',
        }}
      />

      {/* Safe Zone Stage (Top 185px, Bottom 265px) */}
      <div
        style={{
          position: 'absolute',
          top: 185,
          bottom: 265,
          left: 48,
          right: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {/* Minimal Top HUD Pill */}
        <div
          style={{
            position: 'relative',
            padding: '16px 24px',
            backgroundColor: 'rgba(14, 16, 20, 0.88)',
            border: `1.5px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 19,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 800,
          }}
        >
          <span style={{ color: COLORS.text }}>OBSERVATIONS BY MOTH1</span>
          <span style={{ color: accent }}>{sectionLabel}</span>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 3,
              width: `${Math.min(100, Math.max(0, globalProgress * 100))}%`,
              background: `linear-gradient(90deg, ${COLORS.mint}, ${COLORS.cyan}, ${COLORS.lavender})`,
            }}
          />
        </div>

        {/* Main Visual + Giant Type Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 22,
            paddingBottom: 22,
          }}
        >
          {children}
        </div>

        {/* Minimal Bottom URL Bar */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: 'rgba(14, 16, 20, 0.88)',
            border: `1.5px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            letterSpacing: '0.14em',
            fontWeight: 800,
          }}
        >
          <span style={{ color: COLORS.slate300 }}>ISSUE #02</span>
          <span style={{ color: COLORS.cyan }}>observations.moth1.xyz</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 1 (0 - 180 frames / 6.0s): Giant Visual Hook & The Meat Grinder
// ============================================================================
const SceneHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPartB = frame >= 90;
  const localFrame = isPartB ? frame - 90 : frame;

  const imgScale = interpolate(localFrame, [0, 90], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });
  const cardSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 140 },
  });

  return (
    <VisualStage
      bgImage={
        isPartB
          ? 'issues/issue-02/hero-grinder.webp'
          : 'issues/issue-02/hero-machine.webp'
      }
      bgScale={imgScale}
      bgOpacity={0.32}
      sectionLabel={isPartB ? 'THE REAL PANIC' : 'ISSUE #02'}
      accent={isPartB ? COLORS.coral : COLORS.mint}
      globalProgress={frame / TOTAL_FRAMES}
    >
      {/* Giant Hero Visual Showcase Window (820px tall!) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 800,
          border: `2px solid ${isPartB ? COLORS.coral : COLORS.mint}`,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
        }}
      >
        <Img
          src={staticFile(
            isPartB
              ? 'issues/issue-02/hero-grinder.webp'
              : 'issues/issue-02/hero-machine.webp'
          )}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

        {/* Floating Top-Left Pill on Artwork */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            padding: '10px 22px',
            backgroundColor: 'rgba(11, 13, 16, 0.90)',
            border: `2px solid ${isPartB ? COLORS.coral : COLORS.cyan}`,
            color: isPartB ? COLORS.coral : COLORS.cyan,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {isPartB ? 'WHY BILLIONAIRES PANIC' : 'GLOBAL BIRTH RATE FREEFALL'}
        </div>
      </div>

      {/* Giant Kinetic Typography Poster Card */}
      <div
        style={{
          transform: `translateY(${interpolate(cardSpring, [0, 1], [32, 0])}px)`,
        }}
      >
        {!isPartB ? (
          <CyberPosterCard accent={COLORS.mint}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                lineHeight: 1.02,
                textTransform: 'uppercase',
                color: COLORS.text,
                marginBottom: 16,
              }}
            >
              THE MEAT GRINDER{' '}
              <span style={{ color: COLORS.mint }}>NEEDS MORE MEAT.</span>
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: COLORS.cyan,
                letterSpacing: '0.04em',
              }}
            >
              Why we stopped feeding the machine.
            </div>
          </CyberPosterCard>
        ) : (
          <CyberPosterCard accent={COLORS.coral}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: COLORS.coral,
                marginBottom: 14,
              }}
            >
              IT’S NOT SELFISHNESS.
            </div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                lineHeight: 1.18,
                color: COLORS.text,
                marginBottom: 22,
              }}
            >
              They just need more taxpayers &amp; cheap cogs.
            </div>

            {/* 3 Giant Stat Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 14,
              }}
            >
              {[
                { stat: '1.73x', label: 'EARTHS USED', color: COLORS.mint },
                { stat: '2050', label: 'SINKING CITIES', color: COLORS.cyan },
                { stat: '300M', label: 'AI JOB RISK', color: COLORS.coral },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{
                    backgroundColor: '#090b0e',
                    border: `1.5px solid ${b.color}`,
                    padding: '12px 14px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: b.color,
                      lineHeight: 1.05,
                    }}
                  >
                    {b.stat}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: COLORS.slate300,
                      letterSpacing: '0.1em',
                      marginTop: 4,
                    }}
                  >
                    {b.label}
                  </div>
                </div>
              ))}
            </div>
          </CyberPosterCard>
        )}
      </div>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 2 (180 - 390 frames / 7.0s): The Collapsing Venn Diagram
// ============================================================================
const SceneVenn = () => {
  const frame = useCurrentFrame();

  const sep = interpolate(frame, [35, 135], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ax = interpolate(sep, [0, 1], [170, 96]);
  const ay = interpolate(sep, [0, 1], [140, 82]);
  const bx = interpolate(sep, [0, 1], [230, 304]);
  const by = interpolate(sep, [0, 1], [140, 82]);
  const cx = 200;
  const cy = interpolate(sep, [0, 1], [190, 262]);

  const currentTfr = (2.1 - sep * 1.38).toFixed(2);
  const isCollapsed = sep > 0.48;
  const accent = isCollapsed ? COLORS.coral : COLORS.mint;

  return (
    <VisualStage
      bgImage={
        isCollapsed
          ? 'issues/issue-02/venn-blackhole.webp'
          : 'issues/issue-02/venn-village.webp'
      }
      bgScale={1.06}
      bgOpacity={0.35}
      sectionLabel="THE VENN COLLAPSE"
      accent={accent}
      globalProgress={(180 + frame) / TOTAL_FRAMES}
    >
      {/* Top Split: Huge Artwork + Live Animated Venn */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 820,
          border: `2px solid ${accent}`,
          backgroundColor: 'rgba(11, 13, 16, 0.86)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Background Illustration Inside Stage */}
        <Img
          src={staticFile(
            isCollapsed
              ? 'issues/issue-02/venn-blackhole.webp'
              : 'issues/issue-02/venn-village.webp'
          )}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.42,
          }}
        />

        {/* Giant Live TFR Readout Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '22px 30px',
            backgroundColor: 'rgba(11, 13, 16, 0.90)',
            borderBottom: `1.5px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: COLORS.text,
              letterSpacing: '0.08em',
            }}
          >
            {isCollapsed ? '2026: BROKEN CONTRACT' : '1970s: THE VILLAGE'}
          </span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: accent,
            }}
          >
            {currentTfr} TFR
          </span>
        </div>

        {/* Giant High-Contrast SVG Venn */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="780" height="620" viewBox="0 0 400 330">
            {/* Circle A: Family Support */}
            <g transform={`translate(${ax}, ${ay})`}>
              <circle
                cx="0"
                cy="0"
                r="78"
                fill={COLORS.mint}
                fillOpacity="0.22"
                stroke={COLORS.mint}
                strokeWidth="3.5"
              />
              <text
                x="0"
                y="-34"
                textAnchor="middle"
                fill={COLORS.mint}
                fontSize="15"
                fontWeight="900"
              >
                FAMILY VILLAGE
              </text>
            </g>

            {/* Circle B: Housing */}
            <g transform={`translate(${bx}, ${by})`}>
              <circle
                cx="0"
                cy="0"
                r="78"
                fill={COLORS.cyan}
                fillOpacity="0.22"
                stroke={COLORS.cyan}
                strokeWidth="3.5"
              />
              <text
                x="0"
                y="-34"
                textAnchor="middle"
                fill={COLORS.cyan}
                fontSize="15"
                fontWeight="900"
              >
                HOUSING
              </text>
            </g>

            {/* Circle C: 1-Income Living */}
            <g transform={`translate(${cx}, ${cy})`}>
              <circle
                cx="0"
                cy="0"
                r="78"
                fill={COLORS.coral}
                fillOpacity="0.22"
                stroke={COLORS.coral}
                strokeWidth="3.5"
              />
              <text
                x="0"
                y="46"
                textAnchor="middle"
                fill={COLORS.coral}
                fontSize="15"
                fontWeight="900"
              >
                LIVING WAGE
              </text>
            </g>

            {/* Center Node */}
            {!isCollapsed ? (
              <g transform="translate(200, 162)">
                <circle
                  cx="0"
                  cy="0"
                  r="38"
                  fill="#0b0d10"
                  stroke={COLORS.mint}
                  strokeWidth="3"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill={COLORS.mint}
                  fontSize="14"
                  fontWeight="900"
                >
                  BABY
                </text>
              </g>
            ) : (
              <g transform="translate(200, 162)">
                <circle
                  cx="0"
                  cy="0"
                  r="54"
                  fill="#050608"
                  stroke={COLORS.coral}
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                />
                <text
                  x="0"
                  y="-2"
                  textAnchor="middle"
                  fill={COLORS.coral}
                  fontSize="15"
                  fontWeight="900"
                >
                  BLACK HOLE
                </text>
                <text
                  x="0"
                  y="16"
                  textAnchor="middle"
                  fill={COLORS.text}
                  fontSize="11"
                  fontWeight="800"
                >
                  NO OVERLAP
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Giant Poster Headline */}
      <CyberPosterCard accent={accent}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            lineHeight: 1.06,
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 12,
          }}
        >
          {!isCollapsed ? '1 INCOME = 5 KIDS.' : 'THE MIDDLE COLLAPSED.'}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.22,
            color: COLORS.text,
          }}
        >
          {!isCollapsed
            ? 'When housing, wages & family overlapped.'
            : 'Cash handouts cannot fix a broken social contract.'}
        </div>
      </CyberPosterCard>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 3 (390 - 670 frames / 9.33s): 4 Contradictions (Visual-First)
// ============================================================================
const SceneContradictions = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slides = [
    {
      code: '01 / 04',
      tag: 'THE AUTOMATION PARADOX',
      stat: '300M JOBS',
      statSub: 'EXPOSED TO AI',
      punchline: 'Breeding workers for a market automating them out.',
      img: 'issues/issue-02/contradiction-1-ai.webp',
      accent: COLORS.mint,
    },
    {
      code: '02 / 04',
      tag: '2050 SINKING CITIES',
      stat: '1.73 EARTHS',
      statSub: 'CONSUMED EVERY YEAR',
      punchline: 'Cities are flooding, yet leaders beg for more mouths.',
      img: 'issues/issue-02/contradiction-2-sinking.webp',
      accent: COLORS.cyan,
    },
    {
      code: '03 / 04',
      tag: 'FINANCIALISED SHELTER',
      stat: '$310,000+',
      statSub: 'COST TO RAISE ONE CHILD',
      punchline: 'Homes became assets to flip, not places to raise kids.',
      img: 'issues/issue-02/contradiction-3-subsidy.webp',
      accent: COLORS.coral,
    },
    {
      code: '04 / 04',
      tag: 'THE SANDWICH TRAP',
      stat: '54% STRAIN',
      statSub: 'DUAL-GENERATION CAREGIVERS',
      punchline: 'Carrying aging parents while pressured for babies.',
      img: 'issues/issue-02/contradiction-4-sandwich.webp',
      accent: COLORS.lavender,
    },
  ];

  const slideLen = 70; // 2.33s per visual card
  const idx = Math.min(3, Math.floor(frame / slideLen));
  const localFrame = frame - idx * slideLen;
  const item = slides[idx];

  const imgScale = interpolate(localFrame, [0, slideLen], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  return (
    <VisualStage
      bgImage={item.img}
      bgScale={imgScale}
      bgOpacity={0.35}
      sectionLabel="4 CONTRADICTIONS"
      accent={item.accent}
      globalProgress={(390 + frame) / TOTAL_FRAMES}
    >
      {/* Giant 820px Hero Illustration Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 820,
          border: `2.5px solid ${item.accent}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile(item.img)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

        {/* Top Counter Badge */}
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
              padding: '10px 22px',
              backgroundColor: 'rgba(11, 13, 16, 0.92)',
              border: `2px solid ${item.accent}`,
              color: item.accent,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.16em',
            }}
          >
            {item.tag}
          </span>
          <span
            style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(11, 13, 16, 0.92)',
              border: `1.5px solid ${COLORS.border}`,
              color: COLORS.text,
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            {item.code}
          </span>
        </div>
      </div>

      {/* Giant Stat + 8-Word Punchline Card */}
      <div
        style={{
          transform: `translateY(${interpolate(pop, [0, 1], [28, 0])}px)`,
        }}
      >
        <CyberPosterCard accent={item.accent}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 14,
              borderBottom: `1.5px solid ${COLORS.border}`,
              paddingBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 74,
                fontWeight: 900,
                color: item.accent,
                lineHeight: 1,
              }}
            >
              {item.stat}
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: COLORS.slate300,
                letterSpacing: '0.12em',
              }}
            >
              {item.statSub}
            </span>
          </div>

          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              lineHeight: 1.2,
              color: COLORS.text,
            }}
          >
            {item.punchline}
          </div>
        </CyberPosterCard>
      </div>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 4 (670 - 880 frames / 7.0s): 3 Counter-Proposals (Visual-First)
// ============================================================================
const SceneProposals = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const proposals = [
    {
      code: 'FIX 01 / 03',
      title: 'REDEFINE FAMILY',
      stat: '62% NON-NUCLEAR',
      punchline: 'Open housing & childcare beyond traditional marriage.',
      img: 'issues/issue-02/taboo-1-unit.webp',
      accent: COLORS.mint,
    },
    {
      code: 'FIX 02 / 03',
      title: 'DIGNITY IN AGING',
      stat: '74% BACK AUTONOMY',
      punchline: 'End-of-life choice restores dignity & relieves strain.',
      img: 'issues/issue-02/taboo-2-dignity.webp',
      accent: COLORS.cyan,
    },
    {
      code: 'FIX 03 / 03',
      title: 'END INFINITE GROWTH',
      stat: '1.73 EARTHS USED',
      punchline: 'Choose human wellbeing over endless GDP expansion.',
      img: 'issues/issue-02/taboo-3-degrowth.webp',
      accent: COLORS.lavender,
    },
  ];

  const slideLen = 70;
  const idx = Math.min(2, Math.floor(frame / slideLen));
  const localFrame = frame - idx * slideLen;
  const prop = proposals[idx];

  const imgScale = interpolate(localFrame, [0, slideLen], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  return (
    <VisualStage
      bgImage={prop.img}
      bgScale={imgScale}
      bgOpacity={0.35}
      sectionLabel="3 REAL SOLUTIONS"
      accent={prop.accent}
      globalProgress={(670 + frame) / TOTAL_FRAMES}
    >
      {/* Giant 820px Hero Illustration Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 820,
          border: `2.5px solid ${prop.accent}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile(prop.img)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

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
              padding: '10px 22px',
              backgroundColor: 'rgba(11, 13, 16, 0.92)',
              border: `2px solid ${prop.accent}`,
              color: prop.accent,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.16em',
            }}
          >
            {prop.stat}
          </span>
          <span
            style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(11, 13, 16, 0.92)',
              border: `1.5px solid ${COLORS.border}`,
              color: COLORS.text,
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            {prop.code}
          </span>
        </div>
      </div>

      {/* Giant Poster Headline */}
      <div
        style={{
          transform: `translateY(${interpolate(pop, [0, 1], [28, 0])}px)`,
        }}
      >
        <CyberPosterCard accent={prop.accent}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.04,
              color: prop.accent,
              marginBottom: 12,
            }}
          >
            {prop.title}
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              lineHeight: 1.2,
              color: COLORS.text,
            }}
          >
            {prop.punchline}
          </div>
        </CyberPosterCard>
      </div>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 5 (880 - 1080 frames / 6.67s): Full-Screen Quiet Earth Finale
// ============================================================================
const SceneConclusion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = interpolate(frame, [0, 200], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });
  const pop = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <VisualStage
      bgImage="issues/issue-02/quiet-earth.webp"
      bgScale={imgScale}
      bgOpacity={0.78}
      sectionLabel="BIOLOGICAL CORRECTION"
      accent={COLORS.mint}
      globalProgress={(880 + frame) / TOTAL_FRAMES}
    >
      {/* Giant Unobstructed Quiet Earth Artwork Showcase (740px tall) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 740,
          border: `2.5px solid ${COLORS.mint}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile('issues/issue-02/quiet-earth.webp')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            padding: '10px 22px',
            backgroundColor: 'rgba(11, 13, 16, 0.90)',
            border: `2px solid ${COLORS.mint}`,
            color: COLORS.mint,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.18em',
          }}
        >
          SOCIETY’S IMMUNE RESPONSE
        </div>
      </div>

      {/* Giant Poster Finale Card */}
      <div
        style={{
          transform: `translateY(${interpolate(pop, [0, 1], [32, 0])}px)`,
        }}
      >
        <CyberPosterCard accent={COLORS.mint}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.04,
              textTransform: 'uppercase',
              color: COLORS.text,
              marginBottom: 14,
            }}
          >
            NOT A CRISIS.{' '}
            <span style={{ color: COLORS.mint }}>A CORRECTION.</span>
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              lineHeight: 1.24,
              color: COLORS.slate300,
              marginBottom: 24,
            }}
          >
            People have kids when the future looks brighter than the past.
          </div>

          <div
            style={{
              padding: '18px 24px',
              backgroundColor: COLORS.mint,
              color: '#0b0d10',
              fontSize: 25,
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            READ FULL ESSAY → observations.moth1.xyz
          </div>
        </CyberPosterCard>
      </div>
    </VisualStage>
  );
};

export const MeatGrinderReel = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sequence from={0} durationInFrames={180}>
        <SceneHook />
      </Sequence>
      <Sequence from={180} durationInFrames={210}>
        <SceneVenn />
      </Sequence>
      <Sequence from={390} durationInFrames={280}>
        <SceneContradictions />
      </Sequence>
      <Sequence from={670} durationInFrames={210}>
        <SceneProposals />
      </Sequence>
      <Sequence from={880} durationInFrames={200}>
        <SceneConclusion />
      </Sequence>
    </AbsoluteFill>
  );
};
