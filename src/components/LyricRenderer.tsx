import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Subtitle, SingerPosition } from "../types/timeline";
import { ActiveSubtitleState } from "../data/lyrics";

interface LyricRendererProps {
  activeState: ActiveSubtitleState;
  singerPosition: SingerPosition;
}

export const LyricRenderer: React.FC<LyricRendererProps> = ({
  activeState,
  singerPosition,
}) => {
  const { current, previous, enterProgress, exitProgress, consecutiveHandoff } = activeState;

  if (!current && !previous) {
    return null;
  }

  // Safe zone layout calculations based on singer position
  let containerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "135px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    pointerEvents: "none",
    zIndex: 40,
  };

  if (singerPosition === "right") {
    // Left / Center-left safe zone
    containerStyle = {
      ...containerStyle,
      left: "140px",
      maxWidth: "920px",
      alignItems: "flex-start",
      textAlign: "right",
    };
  } else if (singerPosition === "left") {
    // Right / Center-right safe zone
    containerStyle = {
      ...containerStyle,
      right: "140px",
      maxWidth: "920px",
      alignItems: "flex-end",
      textAlign: "right",
    };
  } else {
    // Centered safe zone
    containerStyle = {
      ...containerStyle,
      left: "180px",
      right: "180px",
      alignItems: "center",
      textAlign: "center",
    };
  }

  const renderSubtitleLine = (
    sub: Subtitle,
    opacity: number,
    animProgress: number,
    isEntering: boolean
  ) => {
    const isRefrain = sub.isRefrain;
    const isHalMeBalDay = sub.refrainType === "hal_me_bal_day";

    // Typographic scale: standard 58px, refrains 68-76px
    const fontSize = isHalMeBalDay ? "74px" : isRefrain ? "64px" : "58px";
    const lineHeight = 1.55;

    // Phrase-level transform (never split Arabic/Pashto letters)
    const translateY = isEntering
      ? interpolate(animProgress, [0, 1], [8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(animProgress, [0, 1], [0, -5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

    const scale = isEntering
      ? interpolate(animProgress, [0, 1], [0.985, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1.0;

    const blurVal = isEntering
      ? interpolate(animProgress, [0, 1], [2.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(animProgress, [0, 1], [0, 2.5], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

    // Elegant typography styling: Soft ivory with warm gold tint for refrains
    const textColor = isHalMeBalDay
      ? "#FFF2C8"
      : isRefrain
      ? "#FBF4E6"
      : "#F7F5EE";

    return (
      <div
        key={sub.id}
        dir="rtl"
        lang="ps"
        style={{
          opacity: Math.max(0, Math.min(1, opacity)),
          transform: `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
          filter: blurVal > 0.1 ? `blur(${blurVal.toFixed(1)}px)` : "none",
          willChange: "transform, opacity, filter",
          fontSize,
          lineHeight,
          fontFamily: '"Bahij Titr", "Noto Naskh Arabic", "Noto Sans Arabic", serif',
          fontWeight: isHalMeBalDay ? 700 : isRefrain ? 600 : 500,
          color: textColor,
          textShadow: `
            0 2px 5px rgba(0, 0, 0, 0.95),
            0 6px 22px rgba(0, 0, 0, 0.85),
            0 0 40px ${isHalMeBalDay ? "rgba(230, 175, 75, 0.35)" : "rgba(0, 0, 0, 0.7)"}
          `,
          direction: "rtl",
          unicodeBidi: "plaintext",
          padding: "6px 20px 10px 20px",
          background:
            "radial-gradient(ellipse at center right, rgba(2, 6, 14, 0.45) 0%, rgba(2, 6, 14, 0.15) 70%, transparent 100%)",
          borderRight: isHalMeBalDay ? "4px solid rgba(230, 180, 80, 0.75)" : "none",
        }}
      >
        {sub.text}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={containerStyle}>
        {/* Render previous subtitle during handoff if consecutive */}
        {previous && consecutiveHandoff && exitProgress < 1 && (
          <div style={{ position: "absolute", bottom: 0 }}>
            {renderSubtitleLine(previous, 1 - enterProgress, 1 - enterProgress, false)}
          </div>
        )}

        {/* Render current active subtitle */}
        {current && (
          renderSubtitleLine(
            current,
            Math.min(enterProgress, exitProgress),
            enterProgress,
            true
          )
        )}
      </div>
    </AbsoluteFill>
  );
};
