import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

interface OutroSequenceProps {
  frame: number;
  outroStartFrame: number;
  totalFrames: number;
}

export const OutroSequence: React.FC<OutroSequenceProps> = ({
  frame,
  outroStartFrame,
  totalFrames,
}) => {
  if (frame < outroStartFrame) {
    return null;
  }

  const outroDuration = totalFrames - outroStartFrame;
  const progress = (frame - outroStartFrame) / outroDuration;

  // Final landscape to black fade (progress 0.75 to 1.0)
  const blackOpacity = interpolate(progress, [0.72, 0.98], [0, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: "#000000",
        opacity: blackOpacity,
        zIndex: 50,
      }}
    />
  );
};
