import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { TimelineSegment } from "../types/timeline";

interface AtmosphereLayerProps {
  frame: number;
  segment: TimelineSegment;
  smoothedAudio: number;
}

// Deterministic pseudo-random generator
function deterministicRandom(seed: number) {
  const x = Math.sin(seed * 9999 + 123.456) * 10000;
  return x - Math.floor(x);
}

export const AtmosphereLayer: React.FC<AtmosphereLayerProps> = ({
  frame,
  segment,
  smoothedAudio,
}) => {
  // Generate 20 deterministic ambient dust particles
  const particles = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const baseX = deterministicRandom(i * 13 + 1) * 1920;
      const baseY = deterministicRandom(i * 17 + 2) * 1080;
      const size = 1.5 + deterministicRandom(i * 19 + 3) * 2.5;
      const speedY = 0.2 + deterministicRandom(i * 23 + 4) * 0.4;
      const speedX = -0.15 + deterministicRandom(i * 29 + 5) * 0.3;
      const phase = deterministicRandom(i * 31 + 6) * Math.PI * 2;
      return { baseX, baseY, size, speedY, speedX, phase };
    });
  }, []);

  const intensity = segment.atmosphereIntensity;

  // Audio-reactive atmosphere breathing
  const reactiveHaze = intensity * (0.8 + smoothedAudio * 0.2);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(2, 4, 8, 0.55) 85%, rgba(1, 2, 4, 0.85) 100%)",
        }}
      />

      {/* Atmospheric Horizon Haze & Color Tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            segment.background === "stars"
              ? "radial-gradient(ellipse at 50% 100%, rgba(15, 25, 55, 0.3) 0%, transparent 70%)"
              : "radial-gradient(ellipse at 70% 80%, rgba(220, 150, 60, 0.08) 0%, transparent 60%)",
          opacity: reactiveHaze,
          mixBlendMode: "screen",
        }}
      />

      {/* Subtle deterministic floating dust motes */}
      {particles.map((p, idx) => {
        const y = (p.baseY - frame * p.speedY) % 1120;
        const actualY = y < -20 ? y + 1120 : y;
        const x = (p.baseX + Math.sin(frame * 0.02 + p.phase) * 20 + frame * p.speedX) % 1960;
        const actualX = x < -20 ? x + 1960 : x;
        const particleOpacity =
          (0.25 + 0.3 * Math.sin(frame * 0.03 + p.phase)) * intensity;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `${actualX.toFixed(1)}px`,
              top: `${actualY.toFixed(1)}px`,
              width: `${p.size.toFixed(1)}px`,
              height: `${p.size.toFixed(1)}px`,
              borderRadius: "50%",
              backgroundColor: segment.warmth > 0.4 ? "#FFE8B3" : "#C8D8FF",
              opacity: particleOpacity,
              boxShadow: `0 0 6px ${segment.warmth > 0.4 ? "rgba(240, 180, 80, 0.4)" : "rgba(180, 210, 255, 0.4)"}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
