import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { TimelineSegment } from "../types/timeline";

interface ForegroundLayerProps {
  frame: number;
  segment: TimelineSegment;
  smoothedAudio: number;
}

export const ForegroundLayer: React.FC<ForegroundLayerProps> = ({
  frame,
  segment,
  smoothedAudio,
}) => {
  const segFrames = Math.max(1, segment.endFrame - segment.startFrame);
  const progress = (frame - segment.startFrame) / segFrames;

  // Fastest parallax speed hierarchy (approx 2.5x background movement)
  let parallaxX = 0;
  let parallaxY = 0;

  switch (segment.cameraMotion) {
    case "drift-left":
      parallaxX = interpolate(progress, [0, 1], [30, -35], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "drift-right":
      parallaxX = interpolate(progress, [0, 1], [-30, 35], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "upward":
      parallaxY = interpolate(progress, [0, 1], [25, -30], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "push":
      parallaxY = interpolate(progress, [0, 1], [8, -8], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "pull":
      parallaxY = interpolate(progress, [0, 1], [-8, 8], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    default:
      parallaxX = 0;
      parallaxY = 0;
  }

  // Subtle audio modulation on depth atmosphere
  const targetOpacity = Math.min(
    0.4,
    segment.foregroundDepthOpacity * (0.85 + smoothedAudio * 0.25)
  );

  if (targetOpacity <= 0.01) {
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
          width: "106%",
          height: "106%",
          left: "-3%",
          top: "-3%",
          transform: `translate3d(${parallaxX.toFixed(2)}px, ${parallaxY.toFixed(2)}px, 0)`,
          opacity: targetOpacity,
          mixBlendMode: "screen",
          willChange: "transform, opacity",
        }}
      >
        <Img
          src={staticFile("assets/overlays/foreground-depth.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(0.8px)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
