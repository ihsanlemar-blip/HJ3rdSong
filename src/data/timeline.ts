import { TimelineSegment, BackgroundId } from "../types/timeline";

export const TIMELINE_SEGMENTS: TimelineSegment[] = [
  {
    id: "seg_1_opening",
    name: "Opening Enchantment",
    startFrame: 0,
    endFrame: 998, // 00:00:00 - 00:00:33.266
    background: "twilight",
    singerPosition: "right",
    singerScale: 0.72,
    warmth: 0.70,
    eyeMotifOpacity: 0.05,
    afghanMotifOpacity: 0.06,
    foregroundDepthOpacity: 0.22,
    cameraMotion: "push",
    atmosphereIntensity: 0.35,
    isInstrumental: false,
    description: "Opening in Enchanted Twilight; singer established immediately on right third.",
  },
  {
    id: "seg_2_instrumental_1",
    name: "Instrumental Expansion 1",
    startFrame: 998,
    endFrame: 1708, // 00:00:33.266 - 00:00:56.933
    background: "twilight",
    singerPosition: "right",
    singerScale: 0.70,
    warmth: 0.65,
    eyeMotifOpacity: 0.04,
    afghanMotifOpacity: 0.07,
    foregroundDepthOpacity: 0.32,
    cameraMotion: "drift-left",
    atmosphereIntensity: 0.45,
    isInstrumental: true,
    description: "First instrumental breathing space; slow cinematic drift, landscape breathes.",
  },
  {
    id: "seg_3_mountains_rise",
    name: "Enchantment & Rise of Mountains",
    startFrame: 1708,
    endFrame: 3004, // 00:00:56.933 - 00:01:40.133
    background: "twilight",
    transitionToBackground: "mountains",
    transitionStartFrame: 2200, // around 'داسې یې حال شي، لیونی د غرونو وینه'
    singerPosition: "right",
    singerScale: 0.65,
    warmth: 0.52,
    eyeMotifOpacity: 0.06,
    afghanMotifOpacity: 0.04,
    foregroundDepthOpacity: 0.25,
    cameraMotion: "pull",
    atmosphereIntensity: 0.40,
    isInstrumental: false,
    description: "Dreamlike depth increases; dissolves into Vast Mountains as lyrics invoke the wild peaks.",
  },
  {
    id: "seg_4_instrumental_2",
    name: "Instrumental Expansion 2",
    startFrame: 3004,
    endFrame: 3695, // 00:01:40.133 - 00:02:03.166
    background: "mountains",
    singerPosition: "right",
    singerScale: 0.64,
    warmth: 0.46,
    eyeMotifOpacity: 0.04,
    afghanMotifOpacity: 0.05,
    foregroundDepthOpacity: 0.35,
    cameraMotion: "drift-right",
    atmosphereIntensity: 0.45,
    isInstrumental: true,
    description: "Second instrumental break; majestic mountain vistas and parallax foreground depth.",
  },
  {
    id: "seg_5_sacrifice",
    name: "Love & Sacrifice",
    startFrame: 3695,
    endFrame: 4964, // 00:02:03.166 - 00:02:45.466
    background: "mountains",
    singerPosition: "right",
    singerScale: 0.68,
    warmth: 0.50,
    eyeMotifOpacity: 0.07,
    afghanMotifOpacity: 0.04,
    foregroundDepthOpacity: 0.28,
    cameraMotion: "push",
    atmosphereIntensity: 0.42,
    isInstrumental: false,
    description: "Themes of devotion and sacrifice; deep contrast, atmospheric wind, warm backlight.",
  },
  {
    id: "seg_6_night_transition",
    name: "Instrumental Transition into Night",
    startFrame: 4964,
    endFrame: 5655, // 00:02:45.466 - 00:03:08.500
    background: "mountains",
    transitionToBackground: "stars",
    transitionStartFrame: 5200,
    singerPosition: "right",
    singerScale: 0.63,
    warmth: 0.30,
    eyeMotifOpacity: 0.08,
    afghanMotifOpacity: 0.03,
    foregroundDepthOpacity: 0.24,
    cameraMotion: "drift-left",
    atmosphereIntensity: 0.35,
    isInstrumental: true,
    description: "Third instrumental break; luminance transition cools world into Midnight Stars.",
  },
  {
    id: "seg_7_midnight_stars",
    name: "Night / Stars / Longing",
    startFrame: 5655,
    endFrame: 6916, // 00:03:08.500 - 00:03:50.533
    background: "stars",
    singerPosition: "right",
    singerScale: 0.60,
    warmth: 0.22,
    eyeMotifOpacity: 0.09,
    afghanMotifOpacity: 0.03,
    foregroundDepthOpacity: 0.18,
    cameraMotion: "upward",
    atmosphereIntensity: 0.30,
    isInstrumental: false,
    description: "Deep solitude under midnight stars; wide calm framing, delicate star shimmer.",
  },
  {
    id: "seg_8_instrumental_4",
    name: "Instrumental Breathing Space",
    startFrame: 6916,
    endFrame: 7603, // 00:03:50.533 - 00:04:13.433
    background: "stars",
    transitionToBackground: "intimate",
    transitionStartFrame: 7200,
    singerPosition: "right",
    singerScale: 0.70,
    warmth: 0.50,
    eyeMotifOpacity: 0.10,
    afghanMotifOpacity: 0.04,
    foregroundDepthOpacity: 0.26,
    cameraMotion: "push",
    atmosphereIntensity: 0.38,
    isInstrumental: true,
    description: "Fourth instrumental gap; camera moves closer as warm shadows filter into frame.",
  },
  {
    id: "seg_9_intimate_dark",
    name: "Intimate Longing",
    startFrame: 7603,
    endFrame: 8884, // 00:04:13.433 - 00:04:56.133
    background: "intimate",
    singerPosition: "right",
    singerScale: 0.76,
    warmth: 0.72,
    eyeMotifOpacity: 0.12,
    afghanMotifOpacity: 0.04,
    foregroundDepthOpacity: 0.20,
    cameraMotion: "push",
    atmosphereIntensity: 0.40,
    isInstrumental: false,
    description: "Intimate Dark world; closer framing, soft warm light sweeping slowly across portrait.",
  },
  {
    id: "seg_10_instrumental_5",
    name: "Instrumental Eye Motif Development",
    startFrame: 8884,
    endFrame: 9594, // 00:04:56.133 - 00:05:19.800
    background: "intimate",
    singerPosition: "right",
    singerScale: 0.73,
    warmth: 0.68,
    eyeMotifOpacity: 0.16,
    afghanMotifOpacity: 0.05,
    foregroundDepthOpacity: 0.28,
    cameraMotion: "drift-right",
    atmosphereIntensity: 0.42,
    isInstrumental: true,
    description: "Fifth instrumental passage; Eye Motif surfaces softly behind singer with warm illumination.",
  },
  {
    id: "seg_11_light_of_eyes",
    name: "Beloved as the Light of His Eyes",
    startFrame: 9594,
    endFrame: 10826, // 00:05:19.800 - 00:06:00.866
    background: "intimate",
    singerPosition: "right",
    singerScale: 0.74,
    warmth: 0.70,
    eyeMotifOpacity: 0.18,
    afghanMotifOpacity: 0.05,
    foregroundDepthOpacity: 0.24,
    cameraMotion: "push",
    atmosphereIntensity: 0.45,
    isInstrumental: false,
    description: "The beloved as the light of his eyes ('د سترګو تور'); prominent eye motif and warm rim light.",
  },
  {
    id: "seg_12_instrumental_6",
    name: "Final Instrumental Return",
    startFrame: 10826,
    endFrame: 11509, // 00:06:00.866 - 00:06:23.633
    background: "intimate",
    transitionToBackground: "twilight",
    transitionStartFrame: 11050,
    singerPosition: "right",
    singerScale: 0.72,
    warmth: 0.72,
    eyeMotifOpacity: 0.12,
    afghanMotifOpacity: 0.06,
    foregroundDepthOpacity: 0.30,
    cameraMotion: "drift-left",
    atmosphereIntensity: 0.40,
    isInstrumental: true,
    description: "Sixth instrumental passage; circular return toward transformed Enchanted Twilight.",
  },
  {
    id: "seg_13_final_verse",
    name: "Final Verse & Concluding Refrains",
    startFrame: 11509,
    endFrame: 13076, // 00:06:23.633 - 00:07:15.866
    background: "twilight",
    singerPosition: "right",
    singerScale: 0.75,
    warmth: 0.78,
    eyeMotifOpacity: 0.10,
    afghanMotifOpacity: 0.05,
    foregroundDepthOpacity: 0.22,
    cameraMotion: "push",
    atmosphereIntensity: 0.42,
    isInstrumental: false,
    description: "Hakim Jan verse and final resolving refrains culminating in peak 'حال مې بل دی' signature.",
  },
  {
    id: "seg_14_outro",
    name: "Cinematic Outro",
    startFrame: 13076,
    endFrame: 13220, // 00:07:15.866 - 00:07:20.660 (~4.8 sec)
    background: "twilight",
    singerPosition: "right",
    singerScale: 0.74,
    warmth: 0.60,
    eyeMotifOpacity: 0.0,
    afghanMotifOpacity: 0.0,
    foregroundDepthOpacity: 0.15,
    cameraMotion: "pull",
    atmosphereIntensity: 0.20,
    isInstrumental: true,
    description: "Outro fade order: lyrics gone -> effects diminish -> singer fades -> landscape lingers -> black.",
  },
];

export function getCurrentSegment(frame: number): TimelineSegment {
  for (let i = 0; i < TIMELINE_SEGMENTS.length; i++) {
    const seg = TIMELINE_SEGMENTS[i];
    if (frame >= seg.startFrame && frame < seg.endFrame) {
      return seg;
    }
  }
  return TIMELINE_SEGMENTS[TIMELINE_SEGMENTS.length - 1];
}

export function getInterpolatedVisualState(frame: number) {
  const seg = getCurrentSegment(frame);
  const segProgress = Math.max(
    0,
    Math.min(1, (frame - seg.startFrame) / Math.max(1, seg.endFrame - seg.startFrame))
  );

  const activeBackground: BackgroundId = seg.background;
  let secondaryBackground: BackgroundId | null = null;
  let crossfadeProgress = 0;

  if (seg.transitionToBackground && seg.transitionStartFrame && frame >= seg.transitionStartFrame) {
    const transitionLength = Math.min(60, seg.endFrame - seg.transitionStartFrame);
    crossfadeProgress = Math.min(
      1,
      Math.max(0, (frame - seg.transitionStartFrame) / transitionLength)
    );
    secondaryBackground = seg.transitionToBackground;
  }

  return {
    segment: seg,
    segProgress,
    activeBackground,
    secondaryBackground,
    crossfadeProgress,
  };
}
