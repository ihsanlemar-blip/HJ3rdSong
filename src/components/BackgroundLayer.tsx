import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { BackgroundId, TimelineSegment } from "../types/timeline";

interface BackgroundLayerProps {
  frame: number;
  segment: TimelineSegment;
  activeBackground: BackgroundId;
  secondaryBackground: BackgroundId | null;
  crossfadeProgress: number;
  bassEnergy: number;
}

const BG_IMAGES: Record<BackgroundId, string> = {
  twilight: staticFile("assets/backgrounds/enchanted-twilight.png"),
  mountains: staticFile("assets/backgrounds/vast-mountains.png"),
  stars: staticFile("assets/backgrounds/midnight-stars.png"),
  intimate: staticFile("assets/backgrounds/intimate-dark.png"),
};

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  frame,
  segment,
  activeBackground,
  secondaryBackground,
  crossfadeProgress,
  bassEnergy,
}) => {
  // Relative progress inside current segment
  const segFrames = Math.max(1, segment.endFrame - segment.startFrame);
  const progress = (frame - segment.startFrame) / segFrames;

  // Camera scale: restrained 1.00 to 1.035 + tiny audio reactivity (0.006)
  let baseScale = 1.0;
  let translateX = 0;
  let translateY = 0;

  switch (segment.cameraMotion) {
    case "push":
      baseScale = interpolate(progress, [0, 1], [1.0, 1.035], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "pull":
      baseScale = interpolate(progress, [0, 1], [1.035, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "drift-left":
      baseScale = 1.02;
      translateX = interpolate(progress, [0, 1], [10, -12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "drift-right":
      baseScale = 1.02;
      translateX = interpolate(progress, [0, 1], [-10, 12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "upward":
      baseScale = 1.025;
      translateY = interpolate(progress, [0, 1], [6, -10], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    default:
      baseScale = 1.015;
  }

  // Subtle audio breathing on bass
  const reactiveScale = baseScale + bassEnergy * 0.005;

  const primarySrc = BG_IMAGES[activeBackground];
  const secondarySrc = secondaryBackground ? BG_IMAGES[secondaryBackground] : null;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#020408" }}>
      {/* Primary Background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `scale(${reactiveScale.toFixed(4)}) translate3d(${translateX.toFixed(
            2
          )}px, ${translateY.toFixed(2)}px, 0)`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <Img
          src={primarySrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      </div>

      {/* Secondary Background for crossfade transition */}
      {secondarySrc && crossfadeProgress > 0 && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: crossfadeProgress,
            transform: `scale(${reactiveScale.toFixed(4)}) translate3d(${translateX.toFixed(
              2
            )}px, ${translateY.toFixed(2)}px, 0)`,
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        >
          <Img
            src={secondarySrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
