import "./index.css";
import { Composition } from "remotion";
import { SongComposition } from "./components/SongComposition";
import { TOTAL_COMPOSITION_FRAMES, AUDIO_FPS } from "./data/audio";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Premium Pashto Cinematic Remotion Music Motion Cover */}
      <Composition
        id="PashtoMotionCover"
        component={SongComposition}
        durationInFrames={TOTAL_COMPOSITION_FRAMES}
        fps={AUDIO_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
