import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { BackgroundLayer } from "./BackgroundLayer";
import { SingerLayer } from "./SingerLayer";
import { ForegroundLayer } from "./ForegroundLayer";
import { EyeMotifLayer } from "./EyeMotifLayer";
import { AfghanMotifLayer } from "./AfghanMotifLayer";
import { RefrainTreatment } from "./RefrainTreatment";
import { LyricRenderer } from "./LyricRenderer";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { ColorGrade } from "./ColorGrade";
import { OutroSequence } from "./OutroSequence";
import { ChannelLogo } from "./ChannelLogo";
import { getInterpolatedVisualState } from "../data/timeline";
import { getAudioFrameData, TOTAL_COMPOSITION_FRAMES } from "../data/audio";
import { getActiveSubtitleState } from "../data/lyrics";

// Load local Pashto typography fonts deterministically
loadFont({
  family: "Bahij Titr",
  url: staticFile("assets/fonts/BahijTitr-Bold.ttf"),
  weight: "bold",
});

loadFont({
  family: "PashtoFont",
  url: staticFile("assets/fonts/NotoNaskhArabic-Variable.ttf"),
});

loadFont({
  family: "PashtoSans",
  url: staticFile("assets/fonts/NotoSansArabic-Variable.ttf"),
});

export const SongComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Visual State from Timeline Director
  const visualState = getInterpolatedVisualState(frame);
  const { segment, activeBackground, secondaryBackground, crossfadeProgress } = visualState;

  // Smoothed Audio Data
  const audio = getAudioFrameData(frame);

  // Subtitle State
  const activeSubtitleState = getActiveSubtitleState(frame);
  const currentSub = activeSubtitleState.current;
  const isEyeThemedLyric =
    (currentSub?.text.includes("سترګو") || currentSub?.text.includes("جادوګرې")) ?? false;

  // Refrain Camera Push
  const isRefrainActive = currentSub?.isRefrain ?? false;
  const isHalMeBalDay = currentSub?.refrainType === "hal_me_bal_day";
  const refrainPushProgress = isHalMeBalDay
    ? Math.min(activeSubtitleState.enterProgress, activeSubtitleState.exitProgress)
    : 0;

  // Outro State
  const outroStartFrame = 13070; // 00:07:15.666
  const isOutro = frame >= outroStartFrame;
  const outroProgress = isOutro
    ? (frame - outroStartFrame) / Math.max(1, TOTAL_COMPOSITION_FRAMES - outroStartFrame)
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#020408" }}>
      {/* 1. Master Audio Track */}
      <Audio src={staticFile("assets/audio/song.mp3")} />

      {/* 2. Background Layer with subtle camera movement & crossfades */}
      <BackgroundLayer
        frame={frame}
        segment={segment}
        activeBackground={activeBackground}
        secondaryBackground={secondaryBackground}
        crossfadeProgress={crossfadeProgress}
        bassEnergy={audio.bass}
      />

      {/* 3. Eye Motif Layer (mysterious midground behind singer) */}
      <EyeMotifLayer
        frame={frame}
        segment={segment}
        isEyeThemedLyric={isEyeThemedLyric}
        isOutro={isOutro}
        outroProgress={outroProgress}
      />

      {/* 4. Singer Layer (canonical identity, 2.5D parallax, rim lighting) */}
      <SingerLayer
        frame={frame}
        segment={segment}
        smoothedAudio={audio.smoothed}
        isOutro={isOutro}
        outroProgress={outroProgress}
        isRefrainActive={isRefrainActive}
        refrainPushProgress={refrainPushProgress}
      />

      {/* 5. Cinematic Grounding Shadow: anchors singer and provides clean typography contrast */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "260px",
          background:
            "linear-gradient(to top, rgba(2, 4, 8, 0.92) 0%, rgba(2, 4, 8, 0.65) 45%, rgba(2, 4, 8, 0.2) 75%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 25,
        }}
      />

      {/* 6. Foreground Depth Layer (fastest parallax plane) */}
      <ForegroundLayer
        frame={frame}
        segment={segment}
        smoothedAudio={audio.smoothed}
      />

      {/* 7. Afghan Motif Layer (subtle corner textural accent) */}
      <AfghanMotifLayer frame={frame} segment={segment} />

      {/* 8. Refrain Treatment (light texture travel & golden bloom) */}
      <RefrainTreatment
        frame={frame}
        activeSubtitle={currentSub}
        enterProgress={activeSubtitleState.enterProgress}
        exitProgress={activeSubtitleState.exitProgress}
      />

      {/* 9. Atmosphere Layer (vignette, horizon haze, floating dust motes) */}
      <AtmosphereLayer
        frame={frame}
        segment={segment}
        smoothedAudio={audio.smoothed}
      />

      {/* 10. Pashto Typography Lyric Renderer (RTL, Noto Naskh font, safe zone) */}
      <LyricRenderer
        activeState={activeSubtitleState}
        singerPosition={segment.singerPosition}
      />

      {/* 11. Filmic Color Grading & 35mm Grain */}
      <ColorGrade segment={segment} frame={frame} />

      {/* 12. Channel Branding Logo (Bottom-right corner) */}
      <ChannelLogo frame={frame} />

      {/* 13. Cinematic Outro Sequence (Audio-tail matched blackout) */}
      <OutroSequence
        frame={frame}
        outroStartFrame={outroStartFrame}
        totalFrames={TOTAL_COMPOSITION_FRAMES}
      />
    </AbsoluteFill>
  );
};
