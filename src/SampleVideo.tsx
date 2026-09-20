import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type SampleVideoProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly badgeText: string;
  readonly primaryColor: string;
  readonly accentColor: string;
};

export const SampleVideo: React.FC<SampleVideoProps> = ({
  title,
  subtitle,
  badgeText,
  primaryColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Entrance & exit transitions
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    },
  );

  const exitScale = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0.95],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    },
  );

  // Background glow animation
  const glowScale = interpolate(frame, [0, durationInFrames], [0.8, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const glowRotate = interpolate(frame, [0, durationInFrames], ["0deg", "45deg"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge entrance (starts at frame 5)
  const badgeOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const badgeTranslateY = interpolate(frame, [5, 25], ["-30px", "0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 14, stiffness: 120 }),
  });

  // Title entrance (starts at frame 12)
  const titleOpacity = interpolate(frame, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleScale = interpolate(frame, [12, 35], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 15, stiffness: 100 }),
    output: "perceptual-scale",
  });
  const titleTranslateY = interpolate(frame, [12, 35], ["40px", "0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 15, stiffness: 100 }),
  });

  // Subtitle entrance (starts at frame 22)
  const subtitleOpacity = interpolate(frame, [22, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const subtitleTranslateY = interpolate(frame, [22, 42], ["30px", "0px"], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 16, stiffness: 110 }),
  });

  // Bottom progress bar width across the 3 seconds (90 frames)
  const progressWidth = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0f",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        opacity: exitOpacity,
        scale: exitScale,
      }}
    >
      {/* Dynamic ambient radial gradients in the background */}
      <Interactive.Div
        name="Ambient glow 1"
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}44 0%, transparent 70%)`,
          filter: "blur(80px)",
          scale: glowScale,
          rotate: glowRotate,
          pointerEvents: "none",
        }}
      />
      <Interactive.Div
        name="Ambient glow 2"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "20%",
          width: 650,
          height: 650,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          filter: "blur(90px)",
          scale: glowScale,
          pointerEvents: "none",
        }}
      />

      {/* Main content container */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 120px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Badge */}
        <Interactive.Div
          name="Badge"
          style={{
            opacity: badgeOpacity,
            translate: `0px ${badgeTranslateY}`,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(12px)",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: primaryColor,
              boxShadow: `0 0 12px ${primaryColor}`,
            }}
          />
          <span
            style={{
              color: "#e2e8f0",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {badgeText}
          </span>
        </Interactive.Div>

        {/* Hero Title */}
        <Interactive.Div
          name="Hero Title"
          style={{
            opacity: titleOpacity,
            scale: titleScale,
            translate: `0px ${titleTranslateY}`,
            fontSize: "96px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#ffffff",
            marginBottom: "24px",
            textShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
          }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, #ffffff 30%, ${primaryColor} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </span>
        </Interactive.Div>

        {/* Subtitle */}
        <Interactive.Div
          name="Subtitle"
          style={{
            opacity: subtitleOpacity,
            translate: `0px ${subtitleTranslateY}`,
            fontSize: "44px",
            fontWeight: 400,
            color: "#94a3b8",
            maxWidth: "1100px",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Interactive.Div>
      </AbsoluteFill>

      {/* Bottom timeline indicator */}
      <Interactive.Div
        name="Timeline Indicator Bar"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "8px",
          width: `${progressWidth}%`,
          background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
          boxShadow: `0 0 16px ${primaryColor}88`,
        }}
      />
    </AbsoluteFill>
  );
};
