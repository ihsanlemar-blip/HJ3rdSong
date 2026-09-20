export type BackgroundId = "twilight" | "mountains" | "stars" | "intimate";

export type CameraMotion = "push" | "pull" | "drift-left" | "drift-right" | "still" | "upward";

export type SingerPosition = "right" | "left" | "center";

export interface TimelineSegment {
  id: string;
  name: string;
  startFrame: number;
  endFrame: number;
  background: BackgroundId;
  transitionToBackground?: BackgroundId;
  transitionStartFrame?: number;
  singerPosition: SingerPosition;
  singerScale: number; // e.g. 0.65 to 0.78
  warmth: number; // 0.0 (cool midnight blue) to 1.0 (warm amber/gold)
  eyeMotifOpacity: number; // 0.0 to 0.20
  afghanMotifOpacity: number; // 0.0 to 0.10
  foregroundDepthOpacity: number; // 0.0 to 0.40
  cameraMotion: CameraMotion;
  atmosphereIntensity: number; // 0.0 to 1.0
  isInstrumental: boolean;
  description: string;
}

export interface Subtitle {
  id: number;
  text: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
  isRefrain: boolean;
  refrainType: "hal_me_bal_day" | "jadoogare" | null;
}

export interface AudioAnalysisData {
  fps: number;
  totalFrames: number;
  durationSeconds: number;
  rms: number[];
  bass: number[];
  smoothed: number[];
  intensity: number[];
}
