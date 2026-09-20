import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { Subtitle } from "../types/timeline";

interface RefrainTreatmentProps {
  frame: number;
  activeSubtitle: Subtitle | null;
  enterProgress: number;
  exitProgress: number;
}

export const RefrainTreatment: React.FC<RefrainTreatmentProps> = ({
  frame,
  activeSubtitle,
  enterProgress,
  exitProgress,
}) => {
  const isRefrain = activeSubtitle?.isRefrain ?? false;
  const refrainType = activeSubtitle?.refrainType;

  if (!isRefrain || !refrainType) {
    return null;
  }

  // Calculate life progress within this refrain line
  const duration = Math.max(1, activeSubtitle!.durationFrames);
  const currentProgress = (frame - activeSubtitle!.startFrame) / duration;

  // Progressive enrichment across the song:
  // Early (< frame 4000): subtle (0.12)
  // Middle (frame 4000 to 9000): richer (0.18)
  // Late (> frame 9000): strongest elegant signature (0.24)
  let maxRefrainOpacity = 0.14;
  if (frame > 9000) {
    maxRefrainOpacity = 0.25;
  } else if (frame > 4000) {
    maxRefrainOpacity = 0.19;
  }

  // Smooth envelope for the light texture
  const envelope = Math.min(enterProgress, exitProgress);
  const currentOpacity = envelope * maxRefrainOpacity;

  // Multi-second gentle diagonal/horizontal travel
  const travelX = interpolate(currentProgress, [0, 1], [-40, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const travelScale = interpolate(currentProgress, [0, 1], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Warm atmospheric light leak / texture travel */}
      <div
        style={{
          position: "absolute",
          width: "115%",
          height: "115%",
          left: "-7%",
          top: "-7%",
          opacity: currentOpacity,
          transform: `translate3d(${travelX.toFixed(1)}px, 0, 0) scale(${travelScale.toFixed(
            3
          )})`,
          mixBlendMode: "screen",
          willChange: "transform, opacity",
          filter: "sepia(0.6) hue-rotate(-20deg) brightness(1.15) blur(2px)",
        }}
      >
        <Img
          src={staticFile("assets/overlays/light-texture.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Gentle golden bloom along right/center frame during 'حال مې بل دی' */}
      {refrainType === "hal_me_bal_day" && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "55%",
            background:
              "radial-gradient(ellipse at 75% 50%, rgba(240, 180, 80, 0.12) 0%, rgba(200, 140, 40, 0.04) 50%, transparent 80%)",
            opacity: envelope,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
