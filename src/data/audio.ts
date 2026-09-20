import analysisData from "./audio-analysis.json";
import { AudioAnalysisData } from "../types/timeline";

const data = analysisData as AudioAnalysisData;

export function getAudioFrameData(frame: number) {
  const safeFrame = Math.max(0, Math.min(data.totalFrames - 1, Math.floor(frame)));
  return {
    rms: data.rms[safeFrame] || 0,
    bass: data.bass[safeFrame] || 0,
    smoothed: data.smoothed[safeFrame] || 0,
    intensity: data.intensity[safeFrame] || 0,
  };
}

export const TOTAL_COMPOSITION_FRAMES = data.totalFrames; // 13220
export const AUDIO_FPS = data.fps; // 30
export const AUDIO_DURATION = data.durationSeconds; // 440.66
