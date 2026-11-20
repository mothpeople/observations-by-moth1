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
  bg: '#090a0f',
  panel: '#0d1018',
  text: '#f8fafc',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  border: '#1e293b',
  amber: '#eab308',
  red: '#ef4444',
  green: '#22c55e',
};

const TOTAL_FRAMES = 1050; // 35.0s at 30fps

/**
 * RoundedGlassCard — Issue #04 Curved Glassmorphic Poster Overlay
 * Designed for instant 1-second mobile readability (3–6 word headlines + 5–7 word sub-lines).
 */
const RoundedGlassCard = ({
  children,
  accent = COLORS.amber,
  badge,
  style = {},
}) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'rgba(13, 16, 24, 0.94)',
        borderRadius: 34,
        border: `2.5px solid ${accent}66`,
        padding: '30px 38px',
        boxShadow: `0 28px 70px rgba(0, 0, 0, 0.95), inset 0 1px 0 ${accent}33`,
        ...style,
      }}
    >
      {badge && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 22px',
            borderRadius: 999,
            backgroundColor: `${accent}20`,
            border: `2px solid ${accent}`,
            color: accent,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: accent,
            }}
          />
          {badge}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * StoryStage — 1080x1920 Vertical Canvas with Safe Zones & Progress Bar
 */
const StoryStage = ({
  children,
  bgImage,
  bgScale = 1.06,
  bgOpacity = 0.34,
  beatLabel = 'ISSUE #04',
  accent = COLORS.amber,
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

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(9,10,15,0.82) 0%, rgba(9,10,15,0.25) 38%, rgba(9,10,15,0.86) 78%, rgba(9,10,15,0.98) 100%)',
        }}
      />

      {/* Safe Zone Container (Top 175px, Bottom 250px, Left/Right 44px) */}
      <div
        style={{
          position: 'absolute',
          top: 175,
          bottom: 250,
          left: 44,
          right: 44,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {/* Top Rounded Progress Pill */}
        <div
          style={{
            position: 'relative',
            padding: '16px 28px',
            borderRadius: 999,
            backgroundColor: 'rgba(13, 16, 24, 0.92)',
            border: `2px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 19,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 800,
            overflow: 'hidden',
          }}
        >
          <span style={{ color: COLORS.text }}>OBSERVATIONS BY MOTH1</span>
          <span style={{ color: accent }}>{beatLabel}</span>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 4,
              width: `${Math.min(100, Math.max(0, globalProgress * 100))}%`,
              background: `linear-gradient(90deg, ${COLORS.amber}, ${COLORS.red}, ${COLORS.green})`,
            }}
          />
        </div>

        {/* Main Visual + Short Headline Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {children}
        </div>

        {/* Minimal Bottom URL Pill */}
        <div
          style={{
            padding: '14px 28px',
            borderRadius: 999,
            backgroundColor: 'rgba(13, 16, 24, 0.92)',
            border: `1.5px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            letterSpacing: '0.12em',
            fontWeight: 800,
          }}
        >
          <span style={{ color: COLORS.slate300 }}>ISSUE #04</span>
          <span style={{ color: COLORS.amber }}>
            observations.moth1.xyz
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// BEAT 0 (Frames 0–105 / 0.0s–3.5s): Title Hook — Humen 1839 vs. 2:00 AM Bed
// ============================================================================
const SceneTitleHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = interpolate(frame, [0, 105], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  const pop = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  // Sweeping eye-tracking reticle over the 2:00 AM bedroom side
  const retX = 680 + Math.sin(frame * 0.08) * 45;
  const retY = 440 + Math.cos(frame * 0.06) * 30;

  return (
    <StoryStage
      bgImage="issues/issue-04/hero-humen-2am.webp"
      bgScale={imgScale}
      beatLabel="ISSUE #04 • COLD OPEN"
      accent={COLORS.amber}
      globalProgress={frame / TOTAL_FRAMES}
    >
      {/* Giant 920px Visual Window */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 920,
          borderRadius: 36,
          border: `3px solid ${COLORS.amber}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile('issues/issue-04/hero-humen-2am.webp')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

        {/* Animated Biometric Reticle Overlay */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 920"
          style={{ position: 'absolute', inset: 0 }}
        >
          <g transform={`translate(${retX}, ${retY})`} fill="none">
            <circle
              r="95"
              stroke={COLORS.red}
              strokeWidth="3"
              strokeDasharray="14 8"
            />
            <circle r="45" stroke={COLORS.amber} strokeWidth="2.5" />
            <line
              x1="-130"
              y1="0"
              x2="-60"
              y2="0"
              stroke={COLORS.amber}
              strokeWidth="3"
            />
            <line
              x1="60"
              y1="0"
              x2="130"
              y2="0"
              stroke={COLORS.amber}
              strokeWidth="3"
            />
          </g>
        </svg>

        {/* Top Split Pill Badges inside Visual */}
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 26,
            right: 26,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `2px solid ${COLORS.amber}`,
              color: COLORS.amber,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.14em',
            }}
          >
            1839: BRITISH OPIUM
          </span>
          <span
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `2px solid ${COLORS.red}`,
              color: COLORS.red,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.14em',
            }}
          >
            2026: 2:00 AM FEEDS
          </span>
        </div>
      </div>

      {/* Opening Title Card: Issue Number - Full Title */}
      <div
        style={{
          transform: `translateY(${interpolate(pop, [0, 1], [35, 0])}px)`,
        }}
      >
        <RoundedGlassCard
          accent={COLORS.amber}
          badge="ISSUE #04 • OBSERVATIONS BY MOTH1"
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.05,
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            ISSUE #04: THE CENTURY OF{' '}
            <span style={{ color: COLORS.amber }}>
              SELF-INFLICTED HUMILIATION
            </span>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: COLORS.slate300,
              lineHeight: 1.2,
            }}
          >
            How algorithmic feeds became the modern opium trade.
          </div>
        </RoundedGlassCard>
      </div>
    </StoryStage>
  );
};

// ============================================================================
// BEAT 1 (Frames 105–210 / 3.5s–7.0s): 1839 Opium Wars — Pacified Without Cannons
// ============================================================================
const SceneOpiumWars = () => {
  const frame = useCurrentFrame();
  const isPartB = frame >= 52;
  const imgScale = interpolate(frame, [0, 105], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  const opiumLbs = Math.round(
    interpolate(frame, [5, 75], [200000, 2600000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const activeImg = isPartB
    ? 'issues/issue-04/gunboats-to-dopamine.webp'
    : 'issues/issue-04/humen-trenches-1839.webp';

  return (
    <StoryStage
      bgImage={activeImg}
      bgScale={imgScale}
      beatLabel="1839 • THE FIRST OPIUM WAR"
      accent={COLORS.amber}
      globalProgress={(105 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 920,
          borderRadius: 36,
          border: `3px solid ${COLORS.amber}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile(activeImg)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

        {/* Giant Live Metric Overlay inside Visual */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: 28,
            right: 28,
            padding: '22px 30px',
            borderRadius: 28,
            backgroundColor: 'rgba(9, 10, 15, 0.92)',
            border: `2px solid ${COLORS.amber}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: COLORS.slate300,
                letterSpacing: '0.14em',
              }}
            >
              HUMEN BEACH, 1839
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: COLORS.amber,
              }}
            >
              {opiumLbs.toLocaleString()} LBS DESTROYED
            </div>
          </div>
          <div
            style={{
              padding: '12px 22px',
              borderRadius: 20,
              backgroundColor: `${COLORS.red}25`,
              border: `2px solid ${COLORS.red}`,
              color: COLORS.red,
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            40M ADDICTED
          </div>
        </div>
      </div>

      <RoundedGlassCard
        accent={COLORS.amber}
        badge="IMPERIAL EXTRACTION"
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.04,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          PACIFIED{' '}
          <span style={{ color: COLORS.amber }}>FROM WITHIN.</span>
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.slate300,
          }}
        >
          No cannons needed when citizens are hooked.
        </div>
      </RoundedGlassCard>
    </StoryStage>
  );
};

// ============================================================================
// BEAT 2 (Frames 210–330 / 7.0s–11.0s): How Social Media Feeds on Attention
// ============================================================================
const SceneAttentionSlot = () => {
  const frame = useCurrentFrame();
  const imgScale = interpolate(frame, [0, 120], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  const days = interpolate(frame, [10, 85], [5, 35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <StoryStage
      bgImage="issues/issue-04/attention-slot-machine.webp"
      bgScale={imgScale}
      beatLabel="THE ATTENTION REFINERY"
      accent={COLORS.red}
      globalProgress={(210 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 920,
          borderRadius: 36,
          border: `3px solid ${COLORS.red}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile('issues/issue-04/attention-slot-machine.webp')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

        {/* Visual Comparison Strip: 1839 Silver vs 2026 Attention */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: 28,
            right: 28,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 24,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `2px solid ${COLORS.amber}`,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: COLORS.amber,
                letterSpacing: '0.14em',
              }}
            >
              1839 CURRENCY
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: COLORS.text,
                marginTop: 4,
              }}
            >
              SILVER INGOTS
            </div>
          </div>

          <div
            style={{
              padding: '20px 24px',
              borderRadius: 24,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `2px solid ${COLORS.red}`,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: COLORS.red,
                letterSpacing: '0.14em',
              }}
            >
              2026 CURRENCY
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: COLORS.red,
                marginTop: 4,
              }}
            >
              {Math.round(days)} FULL DAYS / YR
            </div>
          </div>
        </div>
      </div>

      <RoundedGlassCard
        accent={COLORS.red}
        badge="CASINO SLOT MECHANICS"
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.04,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          YOU ARE THE{' '}
          <span style={{ color: COLORS.red }}>RAW MATERIAL.</span>
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.slate300,
          }}
        >
          7 hours a day refined into ad revenue.
        </div>
      </RoundedGlassCard>
    </StoryStage>
  );
};

// ============================================================================
// BEAT 3 (Frames 330–465 / 11.0s–15.5s): Outrage Content (5x Angry Multiplier)
// ============================================================================
const SceneOutrageMultiplier = () => {
  const frame = useCurrentFrame();
  const imgScale = interpolate(frame, [0, 135], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  const barFill = interpolate(frame, [10, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <StoryStage
      bgImage="issues/issue-04/rage-multiplier-5x.webp"
      bgScale={imgScale}
      beatLabel="THE RAGE ALGORITHM"
      accent={COLORS.red}
      globalProgress={(330 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 920,
          borderRadius: 36,
          border: `3px solid ${COLORS.red}`,
          overflow: 'hidden',
          backgroundColor: 'rgba(9, 10, 15, 0.9)',
        }}
      >
        <Img
          src={staticFile('issues/issue-04/rage-multiplier-5x.webp')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.5,
            transform: `scale(${imgScale})`,
          }}
        />

        {/* Visual Social Feed Weight Comparison Overlay */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            padding: '38px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '12px 26px',
              borderRadius: 999,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `2px solid ${COLORS.red}`,
              color: COLORS.red,
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: '0.15em',
            }}
          >
            INTERNAL ALGORITHM WEIGHTS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* 5x Angry Card */}
            <div
              style={{
                padding: '28px 32px',
                borderRadius: 28,
                backgroundColor: 'rgba(24, 11, 15, 0.95)',
                border: `2.5px solid ${COLORS.red}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 34,
                  fontWeight: 900,
                  marginBottom: 14,
                }}
              >
                <span>😡 ANGRY REACTION</span>
                <span style={{ color: COLORS.red }}>5X BOOST</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 36,
                  borderRadius: 999,
                  backgroundColor: '#090a0f',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.round(98 * barFill)}%`,
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: COLORS.red,
                  }}
                />
              </div>
            </div>

            {/* 1x Like Card */}
            <div
              style={{
                padding: '28px 32px',
                borderRadius: 28,
                backgroundColor: 'rgba(13, 16, 24, 0.92)',
                border: `2px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 32,
                  fontWeight: 800,
                  color: COLORS.slate300,
                  marginBottom: 14,
                }}
              >
                <span>❤️ STANDARD LIKE</span>
                <span>1X WEIGHT</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 36,
                  borderRadius: 999,
                  backgroundColor: '#090a0f',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.round(20 * barFill)}%`,
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: COLORS.slate400,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoundedGlassCard
        accent={COLORS.red}
        badge="THE MATH OF DIVISION"
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.04,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          SELLING RAGE{' '}
          <span style={{ color: COLORS.red }}>AT 5X WEIGHT.</span>
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.slate300,
          }}
        >
          Peace closes the app. Outrage keeps you scrolling.
        </div>
      </RoundedGlassCard>
    </StoryStage>
  );
};

// ============================================================================
// BEAT 4 (Frames 465–600 / 15.5s–20.0s): The Impact on Seniors
// ============================================================================
const SceneForgottenSeniors = () => {
  const frame = useCurrentFrame();
  const isPartB = frame >= 68;
  const imgScale = interpolate(frame, [0, 135], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });

  const activeImg = isPartB
    ? 'issues/issue-04/elder-foot-soldiers.webp'
    : 'issues/issue-04/forgotten-elders.webp';

  return (
    <StoryStage
      bgImage={activeImg}
      bgScale={imgScale}
      beatLabel="THE FORGOTTEN CASUALTIES"
      accent={COLORS.amber}
      globalProgress={(465 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 920,
          borderRadius: 36,
          border: `3px solid ${COLORS.amber}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile(activeImg)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

        {/* 2 Giant Senior Telemetry Pills at Bottom of Visual */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: 28,
            right: 28,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 24,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `2px solid ${COLORS.amber}`,
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: COLORS.amber,
              }}
            >
              +50% RISK
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: COLORS.slate300,
                letterSpacing: '0.1em',
              }}
            >
              ISOLATION DEMENTIA
            </div>
          </div>

          <div
            style={{
              padding: '20px 24px',
              borderRadius: 24,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `2px solid ${COLORS.red}`,
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: COLORS.red,
              }}
            >
              7X MORE
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: COLORS.slate300,
                letterSpacing: '0.1em',
              }}
            >
              FAKE NEWS SHARED (65+)
            </div>
          </div>
        </div>
      </div>

      <RoundedGlassCard
        accent={COLORS.amber}
        badge="ELDERS IN SILENT ROOMS"
      >
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            lineHeight: 1.04,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          LONELY SENIORS{' '}
          <span style={{ color: COLORS.amber }}>RADICALISED.</span>
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.slate300,
          }}
        >
          24/7 panic feeds replace real community.
        </div>
      </RoundedGlassCard>
    </StoryStage>
  );
};

// ============================================================================
// BEAT 5 & 6 (Frames 600–735 / 20.0s–24.5s): Tech Elites & State Complicity
// ============================================================================
const SceneElitesAndState = () => {
  const frame = useCurrentFrame();
  const isStateBeat = frame >= 68;
  const localFrame = isStateBeat ? frame - 68 : frame;
  const imgScale = interpolate(localFrame, [0, 68], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  const activeImg = isStateBeat
    ? 'issues/issue-04/electoral-outrage-radar.webp'
    : 'issues/issue-04/palo-alto-asymmetry.webp';

  return (
    <StoryStage
      bgImage={activeImg}
      bgScale={imgScale}
      beatLabel={isStateBeat ? 'STATE COMPLICITY' : 'CLASS ASYMMETRY'}
      accent={isStateBeat ? COLORS.red : COLORS.green}
      globalProgress={(600 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 920,
          borderRadius: 36,
          border: `3px solid ${isStateBeat ? COLORS.red : COLORS.green}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile(activeImg)}
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
            top: 26,
            left: 26,
            padding: '12px 26px',
            borderRadius: 999,
            backgroundColor: 'rgba(9,10,15,0.92)',
            border: `2px solid ${isStateBeat ? COLORS.red : COLORS.green}`,
            color: isStateBeat ? COLORS.red : COLORS.green,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.15em',
          }}
        >
          {isStateBeat
            ? 'SURVEILLANCE & VOTER RAGE'
            : 'PALO ALTO SCREEN BAN VS. MASS FEEDS'}
        </div>
      </div>

      {!isStateBeat ? (
        <RoundedGlassCard
          accent={COLORS.green}
          badge="DEALERS DON’T SMOKE IT"
        >
          <div
            style={{
              fontSize: 62,
              fontWeight: 900,
              lineHeight: 1.04,
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            TECH CEOS BAN{' '}
            <span style={{ color: COLORS.green }}>SCREENS AT HOME.</span>
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 600,
              color: COLORS.slate300,
            }}
          >
            Wooden toys for elite kids; feeds for everyone else.
          </div>
        </RoundedGlassCard>
      ) : (
        <RoundedGlassCard
          accent={COLORS.red}
          badge="WHY GOVERNMENTS ALLOW IT"
        >
          <div
            style={{
              fontSize: 62,
              fontWeight: 900,
              lineHeight: 1.04,
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            STATES USE THE{' '}
            <span style={{ color: COLORS.red }}>SURVEILLANCE.</span>
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 600,
              color: COLORS.slate300,
            }}
          >
            Free citizen tracking and election outrage.
          </div>
        </RoundedGlassCard>
      )}
    </StoryStage>
  );
};

// ============================================================================
// BEAT 7 (Frames 735–915 / 24.5s–30.5s): The 4 Solutions (Clearly Labelled)
// ============================================================================
const SOLUTIONS = [
  {
    step: 'SOLUTION 01 / 04',
    image: 'issues/issue-04/zk-kyc-shield.webp',
    headline: 'KILL THE BOT FARMS.',
    sub: '1:1 human verification (Zero-Knowledge KYC).',
    accent: COLORS.green,
  },
  {
    step: 'SOLUTION 02 / 04',
    image: 'issues/issue-04/chronological-stream-law.webp',
    headline: 'BAN RAGE ALGORITHMS.',
    sub: 'Restore chronological feeds you actually follow.',
    accent: COLORS.amber,
  },
  {
    step: 'SOLUTION 03 / 04',
    image: 'issues/issue-04/attention-slot-machine.webp',
    headline: 'END SLOT-MACHINE UI.',
    sub: 'Ban auto-play traps and open walled gardens.',
    accent: COLORS.red,
  },
  {
    step: 'SOLUTION 04 / 04',
    image: 'issues/issue-04/third-places-renewal.webp',
    headline: 'REBUILD THIRD PLACES.',
    sub: 'Tax ad giants to fund parks, libraries & clubs.',
    accent: COLORS.green,
  },
];

const SceneSolutions = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(3, Math.floor(frame / 45));
  const localFrame = frame - idx * 45;
  const sol = SOLUTIONS[idx];

  const imgScale = interpolate(localFrame, [0, 45], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  return (
    <StoryStage
      bgImage={sol.image}
      bgScale={imgScale}
      beatLabel="THE MULTIFOLD ANTIDOTE"
      accent={sol.accent}
      globalProgress={(735 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 920,
          borderRadius: 36,
          border: `3px solid ${sol.accent}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile(sol.image)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
          }}
        />

        {/* Clear Top Solution Step Header */}
        <div
          style={{
            position: 'absolute',
            top: 26,
            left: 26,
            right: 26,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              backgroundColor: 'rgba(9,10,15,0.94)',
              border: `2.5px solid ${sol.accent}`,
              color: sol.accent,
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '0.16em',
            }}
          >
            {sol.step}
          </span>

          {/* 4-Dot Stepper */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              padding: '12px 20px',
              borderRadius: 999,
              backgroundColor: 'rgba(9,10,15,0.92)',
              border: `1.5px solid ${COLORS.border}`,
            }}
          >
            {SOLUTIONS.map((s, i) => (
              <span
                key={s.step}
                style={{
                  width: i === idx ? 36 : 12,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: i === idx ? sol.accent : '#334155',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <RoundedGlassCard accent={sol.accent} badge={sol.step}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.04,
            color: sol.accent,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          {sol.headline}
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.text,
            lineHeight: 1.2,
          }}
        >
          {sol.sub}
        </div>
      </RoundedGlassCard>
    </StoryStage>
  );
};

// ============================================================================
// BEAT 8 (Frames 915–1050 / 30.5s–35.0s): The Mirror of History Finale & CTA
// ============================================================================
const SceneMirrorFinale = () => {
  const frame = useCurrentFrame();
  const imgScale = interpolate(frame, [0, 135], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });

  return (
    <StoryStage
      bgImage="issues/issue-04/mirror-of-history.webp"
      bgScale={imgScale}
      beatLabel="THE MIRROR OF HISTORY"
      accent={COLORS.amber}
      globalProgress={(915 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 880,
          borderRadius: 36,
          border: `3px solid ${COLORS.amber}`,
          overflow: 'hidden',
          boxShadow: '0 28px 70px rgba(0,0,0,0.9)',
        }}
      >
        <Img
          src={staticFile('issues/issue-04/mirror-of-history.webp')}
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
            top: 26,
            left: 26,
            padding: '12px 26px',
            borderRadius: 999,
            backgroundColor: 'rgba(9,10,15,0.92)',
            border: `2px solid ${COLORS.amber}`,
            color: COLORS.amber,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.16em',
          }}
        >
          1839 GUNBOATS • 2026 POCKET SCREENS
        </div>
      </div>

      <RoundedGlassCard
        accent={COLORS.amber}
        badge="DISMANTLE THE ENGINE"
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          THE OPIUM DEN IS{' '}
          <span style={{ color: COLORS.amber }}>IN YOUR POCKET.</span>
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: COLORS.green,
          }}
        >
          Explore Issue #04 → observations.moth1.xyz
        </div>
      </RoundedGlassCard>
    </StoryStage>
  );
};

export const SelfInflictedHumiliationReel = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sequence from={0} durationInFrames={105}>
        <SceneTitleHook />
      </Sequence>
      <Sequence from={105} durationInFrames={105}>
        <SceneOpiumWars />
      </Sequence>
      <Sequence from={210} durationInFrames={120}>
        <SceneAttentionSlot />
      </Sequence>
      <Sequence from={330} durationInFrames={135}>
        <SceneOutrageMultiplier />
      </Sequence>
      <Sequence from={465} durationInFrames={135}>
        <SceneForgottenSeniors />
      </Sequence>
      <Sequence from={600} durationInFrames={135}>
        <SceneElitesAndState />
      </Sequence>
      <Sequence from={735} durationInFrames={180}>
        <SceneSolutions />
      </Sequence>
      <Sequence from={915} durationInFrames={135}>
        <SceneMirrorFinale />
      </Sequence>
    </AbsoluteFill>
  );
};
