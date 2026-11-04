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
  bg: '#0a0b0e',
  panel: '#0e1015',
  text: '#f1f5f9',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  border: '#1e293b',
  yellow: '#eab308',
  green: '#22c55e',
  red: '#ef4444',
};

const TOTAL_FRAMES = 1080; // 36.0s at 30fps

const CyberPosterCard = ({
  children,
  accent = COLORS.yellow,
  style = {},
}) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'rgba(14, 16, 21, 0.92)',
        border: `2px solid ${COLORS.border}`,
        padding: '32px 36px',
        boxShadow: '0 28px 70px rgba(0, 0, 0, 0.92)',
        ...style,
      }}
    >
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

const VisualStage = ({
  children,
  bgImage,
  bgScale = 1.05,
  bgOpacity = 0.34,
  sectionLabel = 'THE WAR ON DRUGS',
  accent = COLORS.yellow,
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
            'linear-gradient(180deg, rgba(10,11,14,0.78) 0%, rgba(10,11,14,0.28) 35%, rgba(10,11,14,0.84) 78%, rgba(10,11,14,0.97) 100%)',
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
        <div
          style={{
            position: 'relative',
            padding: '16px 24px',
            backgroundColor: 'rgba(14, 16, 21, 0.90)',
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
              background: `linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.green}, ${COLORS.red})`,
            }}
          />
        </div>

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

        <div
          style={{
            padding: '14px 24px',
            backgroundColor: 'rgba(14, 16, 21, 0.90)',
            border: `1.5px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            letterSpacing: '0.14em',
            fontWeight: 800,
          }}
        >
          <span style={{ color: COLORS.slate300 }}>ISSUE #03</span>
          <span style={{ color: COLORS.yellow }}>
            observations.moth1.xyz/war-on-drugs
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 1 (0 - 180 frames / 6.0s): Giant Visual Hook & The $1 Trillion Lie
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
          ? 'issues/issue-03/class-contradiction.webp'
          : 'issues/issue-03/hero-dossier.webp'
      }
      bgScale={imgScale}
      bgOpacity={0.32}
      sectionLabel={isPartB ? 'THE CLASS DIVIDE' : 'ISSUE #03'}
      accent={isPartB ? COLORS.red : COLORS.yellow}
      globalProgress={frame / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 800,
          border: `2px solid ${isPartB ? COLORS.red : COLORS.yellow}`,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
        }}
      >
        <Img
          src={staticFile(
            isPartB
              ? 'issues/issue-03/class-contradiction.webp'
              : 'issues/issue-03/hero-dossier.webp'
          )}
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
            backgroundColor: 'rgba(10, 11, 14, 0.92)',
            border: `2px solid ${isPartB ? COLORS.red : COLORS.yellow}`,
            color: isPartB ? COLORS.red : COLORS.yellow,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {isPartB ? 'BOARDROOM VS. PRISON CELL' : '$1,000,000,000,000+ SPENT'}
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${interpolate(cardSpring, [0, 1], [32, 0])}px)`,
        }}
      >
        {!isPartB ? (
          <CyberPosterCard accent={COLORS.yellow}>
            <div
              style={{
                fontSize: 66,
                fontWeight: 900,
                lineHeight: 1.04,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: 18,
              }}
            >
              THE WAR NO ONE WAS{' '}
              <span style={{ color: COLORS.yellow }}>SUPPOSED TO WIN.</span>
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: COLORS.slate300,
                lineHeight: 1.25,
              }}
            >
              50 years later, drugs are cheaper and deadlier.
            </div>
          </CyberPosterCard>
        ) : (
          <CyberPosterCard accent={COLORS.red}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              THE STATE POLICES{' '}
              <span style={{ color: COLORS.red }}>CLASS, NOT CHEMISTRY.</span>
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: COLORS.slate300,
                lineHeight: 1.25,
              }}
            >
              Billionaires microdose in lofts; workers rot in cells.
            </div>
          </CyberPosterCard>
        )}
      </div>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 2 (180 - 390 frames / 7.0s): The Alcohol Paradox (Lancet Harm Matrix)
// ============================================================================
const SceneAlcoholParadox = () => {
  const frame = useCurrentFrame();

  const imgScale = interpolate(frame, [0, 210], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });
  const barFill = interpolate(frame, [15, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bars = [
    { name: 'ALCOHOL (LEGAL & TAXED)', score: 72, color: COLORS.yellow },
    { name: 'HEROIN (CONTRABAND)', score: 55, color: COLORS.red },
    { name: 'CANNABIS (CRIMINALISED)', score: 20, color: COLORS.green },
    { name: 'PSILOCYBIN (FELONY)', score: 6, color: COLORS.green },
  ];

  return (
    <VisualStage
      bgImage="issues/issue-03/alcohol-paradox.webp"
      bgScale={imgScale}
      bgOpacity={0.34}
      sectionLabel="THE ALCOHOL PARADOX"
      accent={COLORS.yellow}
      globalProgress={(180 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 820,
          border: `2px solid ${COLORS.yellow}`,
          overflow: 'hidden',
          backgroundColor: 'rgba(10, 11, 14, 0.85)',
        }}
      >
        <Img
          src={staticFile('issues/issue-03/alcohol-paradox.webp')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45,
            transform: `scale(${imgScale})`,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '44px 42px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '0.18em',
              color: COLORS.yellow,
            }}
          >
            THE LANCET DRUG HARM MATRIX (0–100)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {bars.map((b) => (
              <div key={b.name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 28,
                    fontWeight: 900,
                    marginBottom: 12,
                  }}
                >
                  <span>{b.name}</span>
                  <span style={{ color: b.color }}>{b.score} PTS</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 34,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: `1.5px solid ${COLORS.border}`,
                  }}
                >
                  <div
                    style={{
                      width: `${Math.round((b.score / 75) * 100 * barFill)}%`,
                      height: '100%',
                      backgroundColor: b.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: 20,
              color: COLORS.slate300,
              fontWeight: 700,
            }}
          >
            Ref: Prof. David Nutt et al., The Lancet (16 Harm Criteria)
          </div>
        </div>
      </div>

      <CyberPosterCard accent={COLORS.yellow}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            lineHeight: 1.06,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          DEADLIEST DRUG:{' '}
          <span style={{ color: COLORS.yellow }}>SCORE 72 ON THE TOP SHELF.</span>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: COLORS.slate300,
          }}
        >
          Law is drawn by excise tax, not toxicology.
        </div>
      </CyberPosterCard>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 3 (390 - 670 frames / 9.3s): 4 Rapid Evidence Slides (70 frames each)
// ============================================================================
const EVIDENCE_SLIDES = [
  {
    image: 'issues/issue-03/class-contradiction.webp',
    badge: 'THE OLIGARCH PHARMACY',
    stat: '82% WORKING-CLASS ARRESTS',
    punchline: 'Identical molecules. Sovereign capital buys total immunity.',
    accent: COLORS.yellow,
  },
  {
    image: 'issues/issue-03/rat-park.webp',
    badge: 'THE RAT PARK REALITY',
    stat: '-91% MORPHINE INTAKE',
    punchline: 'Connected communities reject addiction. Isolation breeds it.',
    accent: COLORS.green,
  },
  {
    image: 'issues/issue-03/supply-hydrant.webp',
    badge: 'THE HYDRANT PROBLEM',
    stat: '50x–500x LETHAL POTENCY',
    punchline: 'Seizing leaves incentivizes cartels to mail fentanyl.',
    accent: COLORS.red,
  },
  {
    image: 'issues/issue-03/remedy-weapon.webp',
    badge: 'THE REMEDY AS A WEAPON',
    stat: '44,000+ LEGAL BARRIERS',
    punchline: 'Convictions destroy jobs and housing faster than drugs.',
    accent: COLORS.red,
  },
];

const SceneEvidenceLoop = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(3, Math.floor(frame / 70));
  const localFrame = frame - idx * 70;
  const slide = EVIDENCE_SLIDES[idx];

  const imgScale = interpolate(localFrame, [0, 70], [1.0, 1.1], {
    extrapolateRight: 'clamp',
  });

  return (
    <VisualStage
      bgImage={slide.image}
      bgScale={imgScale}
      bgOpacity={0.34}
      sectionLabel={slide.badge}
      accent={slide.accent}
      globalProgress={(390 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 820,
          border: `2px solid ${slide.accent}`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile(slide.image)}
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
            backgroundColor: 'rgba(10, 11, 14, 0.92)',
            border: `2px solid ${slide.accent}`,
            color: slide.accent,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.16em',
          }}
        >
          {slide.badge}
        </div>
      </div>

      <CyberPosterCard accent={slide.accent}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: slide.accent,
            lineHeight: 1.04,
            marginBottom: 16,
          }}
        >
          {slide.stat}
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.text,
            lineHeight: 1.24,
          }}
        >
          {slide.punchline}
        </div>
      </CyberPosterCard>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 4 (670 - 880 frames / 7.0s): Portugal Law 30/2000 Blueprint (3 slides)
// ============================================================================
const PORTUGAL_SLIDES = [
  {
    image: 'issues/issue-03/lisbon-model.webp',
    badge: 'LAW 30/2000 • PORTUGAL',
    title: '-90% NEW HIV INFECTIONS',
    punchline: 'Health panels and outreach replaced handcuffs and cages.',
    accent: COLORS.green,
  },
  {
    image: 'issues/issue-03/lisbon-model.webp',
    badge: '20-YEAR EMPIRICAL LEDGER',
    title: '6 PER 1M OVERDOSE DEATHS',
    punchline: 'Europe’s lowest mortality vs. 300+ per million in the US.',
    accent: COLORS.yellow,
  },
  {
    image: 'issues/issue-03/lisbon-model.webp',
    badge: 'THE PRAGMATIC BLUEPRINT',
    title: '-65% DRUG INCARCERATION',
    punchline: 'Treat trauma and regulate supply to starve street cartels.',
    accent: COLORS.green,
  },
];

const ScenePortugal = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(2, Math.floor(frame / 70));
  const localFrame = frame - idx * 70;
  const slide = PORTUGAL_SLIDES[idx];

  const imgScale = interpolate(localFrame, [0, 70], [1.0, 1.09], {
    extrapolateRight: 'clamp',
  });

  return (
    <VisualStage
      bgImage={slide.image}
      bgScale={imgScale}
      bgOpacity={0.34}
      sectionLabel={slide.badge}
      accent={slide.accent}
      globalProgress={(670 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 820,
          border: `2px solid ${slide.accent}`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile(slide.image)}
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
            backgroundColor: 'rgba(10, 11, 14, 0.92)',
            border: `2px solid ${slide.accent}`,
            color: slide.accent,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.16em',
          }}
        >
          {slide.badge}
        </div>
      </div>

      <CyberPosterCard accent={slide.accent}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: slide.accent,
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          {slide.title}
        </div>
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: COLORS.text,
            lineHeight: 1.24,
          }}
        >
          {slide.punchline}
        </div>
      </CyberPosterCard>
    </VisualStage>
  );
};

// ============================================================================
// SCENE 5 (880 - 1080 frames / 6.7s): Finale Mirror & CTA
// ============================================================================
const SceneFinale = () => {
  const frame = useCurrentFrame();
  const imgScale = interpolate(frame, [0, 200], [1.0, 1.12], {
    extrapolateRight: 'clamp',
  });

  return (
    <VisualStage
      bgImage="issues/issue-03/the-mirror.webp"
      bgScale={imgScale}
      bgOpacity={0.38}
      sectionLabel="THE MIRROR"
      accent={COLORS.yellow}
      globalProgress={(880 + frame) / TOTAL_FRAMES}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 740,
          border: `2px solid ${COLORS.yellow}`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('issues/issue-03/the-mirror.webp')}
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
            backgroundColor: 'rgba(10, 11, 14, 0.92)',
            border: `2px solid ${COLORS.yellow}`,
            color: COLORS.yellow,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.16em',
          }}
        >
          CARTELS • PRISONS • POLITICIANS
        </div>
      </div>

      <CyberPosterCard accent={COLORS.yellow}>
        <div
          style={{
            fontSize: 58,
            fontWeight: 900,
            lineHeight: 1.06,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          THE WAR ISN’T BROKEN.{' '}
          <span style={{ color: COLORS.yellow }}>
            IT WORKS EXACTLY AS INTENDED.
          </span>
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: COLORS.green,
          }}
        >
          Read Issue #03 → observations.moth1.xyz/war-on-drugs
        </div>
      </CyberPosterCard>
    </VisualStage>
  );
};

export const WarOnDrugsReel = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Sequence from={0} durationInFrames={180}>
        <SceneHook />
      </Sequence>
      <Sequence from={180} durationInFrames={210}>
        <SceneAlcoholParadox />
      </Sequence>
      <Sequence from={390} durationInFrames={280}>
        <SceneEvidenceLoop />
      </Sequence>
      <Sequence from={670} durationInFrames={210}>
        <ScenePortugal />
      </Sequence>
      <Sequence from={880} durationInFrames={200}>
        <SceneFinale />
      </Sequence>
    </AbsoluteFill>
  );
};
