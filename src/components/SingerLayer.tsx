import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { TimelineSegment } from "../types/timeline";

interface SingerLayerProps {
  frame: number;
  segment: TimelineSegment;
  smoothedAudio: number;
  isOutro: boolean;
  outroProgress: number; // 0 to 1
  isRefrainActive: boolean;
  refrainPushProgress: number; // 0 to 1 for 1-2% subtle push
}

export const SingerLayer: React.FC<SingerLayerProps> = ({
  frame,
  segment,
  smoothedAudio,
  isOutro,
  outroProgress,
  isRefrainActive,
  refrainPushProgress,
}) => {
  const segFrames = Math.max(1, segment.endFrame - segment.startFrame);
  const progress = (frame - segment.startFrame) / segFrames;

  // 2.5D Parallax: Singer camera drift moves slightly faster than background
  let parallaxX = 0;
  let parallaxY = 0;

  switch (segment.cameraMotion) {
    case "drift-left":
      parallaxX = interpolate(progress, [0, 1], [14, -14], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "drift-right":
      parallaxX = interpolate(progress, [0, 1], [-14, 14], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "upward":
      parallaxY = interpolate(progress, [0, 1], [8, -12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "push":
      parallaxY = interpolate(progress, [0, 1], [3, -3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    case "pull":
      parallaxY = interpolate(progress, [0, 1], [-3, 3], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    default:
      parallaxX = 0;
      parallaxY = 0;
  }

  // Base scale from timeline + refrain camera push (1.00 -> 1.018)
  const refrainScaleMultiplier = 1.0 + refrainPushProgress * 0.018;
  const targetHeight = 1080 * segment.singerScale * refrainScaleMultiplier;

  // Docking: anchored nicely on the right side with bottom breathing room for name
  let containerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    transformOrigin: "bottom right",
    transform: `translate3d(${parallaxX.toFixed(2)}px, ${parallaxY.toFixed(2)}px, 0)`,
    willChange: "transform, opacity, filter",
    pointerEvents: "none",
    zIndex: 30,
  };

  if (segment.singerPosition === "center") {
    containerStyle = {
      ...containerStyle,
      left: "50%",
      transformOrigin: "bottom center",
      transform: `translate3d(calc(-50% + ${parallaxX.toFixed(2)}px), ${parallaxY.toFixed(
        2
      )}px, 0)`,
    };
  } else if (segment.singerPosition === "left") {
    containerStyle = {
      ...containerStyle,
      left: "30px",
      transformOrigin: "bottom left",
    };
  } else {
    // Default: right side
    containerStyle = {
      ...containerStyle,
      right: "30px",
    };
  }

  // Subtle warm rim light and luminescence responsive to music and refrain
  const rimIntensity = Math.min(
    0.32,
    0.10 + segment.warmth * 0.10 + smoothedAudio * 0.08 + (isRefrainActive ? 0.08 : 0)
  );

  // Outro fade: singer gently fades between outroProgress 0.2 and 0.6
  let singerOpacity = 1.0;
  if (isOutro) {
    singerOpacity = interpolate(outroProgress, [0.15, 0.6], [1.0, 0.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const singerFilter = `
    drop-shadow(0 0 22px rgba(220, 165, 75, ${rimIntensity.toFixed(3)}))
    drop-shadow(0 12px 28px rgba(0, 0, 0, 0.7))
    brightness(${(0.98 + segment.warmth * 0.04).toFixed(3)})
    contrast(1.02)
  `.trim();

  return (
    <div
      style={{
        ...containerStyle,
        opacity: singerOpacity,
      }}
    >
      {/* Singer Cutout with bottom feathering mask */}
      <div
        style={{
          position: "relative",
          height: `${targetHeight.toFixed(1)}px`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 4%, rgba(0,0,0,1) 10%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 4%, rgba(0,0,0,1) 10%)",
        }}
      >
        <Img
          src={staticFile("assets/singer/singer-cutout.png")}
          style={{
            height: "100%",
            width: "auto",
            objectFit: "contain",
            objectPosition: "bottom center",
            filter: singerFilter,
          }}
        />
      </div>

      {/* Singer Name Label below the picture of singer */}
      <div
        dir="rtl"
        lang="ps"
        style={{
          marginTop: "4px",
          marginBottom: "18px",
          fontFamily: '"Bahij Titr", "Noto Naskh Arabic", serif',
          fontWeight: "bold",
          fontSize: "36px",
          lineHeight: 1.25,
          color: "#FFF6DE",
          textShadow: `
            0 2px 6px rgba(0, 0, 0, 0.95),
            0 4px 18px rgba(0, 0, 0, 0.9),
            0 0 28px rgba(220, 165, 75, 0.5)
          `,
          letterSpacing: "0.5px",
          padding: "6px 28px 8px 28px",
          background:
            "radial-gradient(ellipse at center, rgba(6, 10, 18, 0.85) 0%, rgba(6, 10, 18, 0.45) 70%, transparent 100%)",
          borderBottom: "1.5px solid rgba(220, 175, 80, 0.55)",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        حکيم جان فریادي
      </div>
    </div>
  );
};
