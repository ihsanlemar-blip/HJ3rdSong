import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { TimelineSegment } from "../types/timeline";

interface EyeMotifLayerProps {
  frame: number;
  segment: TimelineSegment;
  isEyeThemedLyric: boolean; // "جانان زما د سترګو تور دی" or "جادوګرې دي"
  isOutro: boolean;
  outroProgress: number;
}

export const EyeMotifLayer: React.FC<EyeMotifLayerProps> = ({
  frame,
  segment,
  isEyeThemedLyric,
  isOutro,
  outroProgress,
}) => {
  const segFrames = Math.max(1, segment.endFrame - segment.startFrame);
  const progress = (frame - segment.startFrame) / segFrames;

  // Very slow breathing scale (1.00 -> 1.03)
  const breathingScale = 1.0 + Math.sin(frame * 0.015) * 0.015;

  // Slow subtle drift
  const driftX = interpolate(progress, [0, 1], [-8, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Target opacity strictly kept within 5% - 18%
  let baseOpacity = segment.eyeMotifOpacity;
  if (isEyeThemedLyric) {
    baseOpacity = Math.min(0.18, baseOpacity + 0.05);
  }

  // In outro, eye motif fades out early (before singer)
  if (isOutro) {
    baseOpacity = interpolate(outroProgress, [0.0, 0.25], [baseOpacity, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  if (baseOpacity <= 0.01) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "80%",
          height: "80%",
          left: "10%",
          top: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: baseOpacity,
          transform: `scale(${breathingScale.toFixed(4)}) translate3d(${driftX.toFixed(2)}px, 0, 0)`,
          mixBlendMode: "screen",
          willChange: "transform, opacity",
          maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)",
          WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)",
        }}
      >
        <Img
          src={staticFile("assets/overlays/eye-motif.png")}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: "blur(2px) brightness(1.1)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
