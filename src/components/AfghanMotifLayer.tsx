import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { TimelineSegment } from "../types/timeline";

interface AfghanMotifLayerProps {
  frame: number;
  segment: TimelineSegment;
}

export const AfghanMotifLayer: React.FC<AfghanMotifLayerProps> = ({
  segment,
}) => {
  const opacity = segment.afghanMotifOpacity;

  if (opacity <= 0.01) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Subtle corner framing texture */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "60px",
          width: "280px",
          height: "280px",
          opacity: opacity,
          mixBlendMode: "screen",
          maskImage: "radial-gradient(circle at top left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "radial-gradient(circle at top left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)",
        }}
      >
        <Img
          src={staticFile("assets/overlays/afghan-motif.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "sepia(0.4) brightness(0.9)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
