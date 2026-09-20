import lyricsJson from "./lyrics.json";
import { Subtitle } from "../types/timeline";

export const SUBTITLES: Subtitle[] = lyricsJson as Subtitle[];

export interface ActiveSubtitleState {
  current: Subtitle | null;
  previous: Subtitle | null;
  enterProgress: number; // 0 to 1
  exitProgress: number; // 0 to 1 (1 = fully visible, 0 = faded out)
  isRefrain: boolean;
  refrainType: "hal_me_bal_day" | "jadoogare" | null;
  consecutiveHandoff: boolean;
}

export function getActiveSubtitleState(frame: number): ActiveSubtitleState {
  let current: Subtitle | null = null;
  let previous: Subtitle | null = null;

  for (let i = 0; i < SUBTITLES.length; i++) {
    const sub = SUBTITLES[i];
    // We allow a tiny 4-frame window for smooth fade in before startFrame if space allows
    if (frame >= sub.startFrame && frame <= sub.endFrame) {
      current = sub;
      if (i > 0) {
        previous = SUBTITLES[i - 1];
      }
      break;
    }
  }

  if (!current) {
    // Check if we are in the slight tail (6 frames) of the previous subtitle
    for (let i = 0; i < SUBTITLES.length; i++) {
      const sub = SUBTITLES[i];
      if (frame > sub.endFrame && frame <= sub.endFrame + 8) {
        previous = sub;
        break;
      }
    }

    if (previous) {
      const exitProgress = Math.max(0, 1 - (frame - previous.endFrame) / 8);
      return {
        current: null,
        previous,
        enterProgress: 1,
        exitProgress,
        isRefrain: previous.isRefrain,
        refrainType: previous.refrainType,
        consecutiveHandoff: false,
      };
    }

    return {
      current: null,
      previous: null,
      enterProgress: 0,
      exitProgress: 0,
      isRefrain: false,
      refrainType: null,
      consecutiveHandoff: false,
    };
  }

  // Calculate enter animation (faster for short captions, smooth for longer)
  // For short lines like 'حال مې بل دی' (approx 30-40 frames), enter in 7 frames
  const isShort = current.durationFrames < 45;
  const enterDuration = isShort ? 6 : 12;
  const exitDuration = isShort ? 6 : 10;

  const framesIntoCaption = frame - current.startFrame;
  const enterProgress = Math.min(1, Math.max(0, framesIntoCaption / enterDuration));

  const framesRemaining = current.endFrame - frame;
  const exitProgress = Math.min(1, Math.max(0, framesRemaining / exitDuration));

  // Check if consecutive subtitle follows immediately
  const currentIndex = SUBTITLES.findIndex((s) => s.id === current!.id);
  const nextSub = currentIndex >= 0 && currentIndex < SUBTITLES.length - 1 ? SUBTITLES[currentIndex + 1] : null;
  const consecutiveHandoff = nextSub !== null && nextSub.startFrame - current.endFrame <= 4;

  return {
    current,
    previous,
    enterProgress,
    exitProgress,
    isRefrain: current.isRefrain,
    refrainType: current.refrainType,
    consecutiveHandoff,
  };
}
