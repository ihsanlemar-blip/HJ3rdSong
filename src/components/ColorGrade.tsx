import React from "react";
import { AbsoluteFill } from "remotion";
import { TimelineSegment } from "../types/timeline";

interface ColorGradeProps {
  segment: TimelineSegment;
  frame: number;
}

export const ColorGrade: React.FC<ColorGradeProps> = ({ segment, frame }) => {
  const warmth = segment.warmth; // 0.0 (cool midnight) to 1.0 (warm gold)

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Warm Gold Highlight Tone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(240, 190, 90, 0.08) 0%, transparent 60%, rgba(200, 140, 50, 0.05) 100%)",
          opacity: warmth,
          mixBlendMode: "soft-light",
        }}
      />

      {/* Deep Midnight Blue Shadow Tone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(5, 12, 28, 0.12) 0%, transparent 40%, rgba(3, 8, 20, 0.22) 100%)",
          opacity: 1.0 - warmth * 0.5,
          mixBlendMode: "multiply",
        }}
      />

      {/* Subtle Procedural Film Grain SVG overlay */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.038,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <filter id="cinematic-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
            seed={Math.floor(frame * 0.5) % 100}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cinematic-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
