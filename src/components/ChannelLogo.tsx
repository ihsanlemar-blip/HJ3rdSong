import React from "react";
import { Img, staticFile } from "remotion";

interface ChannelLogoProps {
  frame?: number;
}

export const ChannelLogo: React.FC<ChannelLogoProps> = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "24px",
        right: "32px",
        zIndex: 50,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile("assets/branding/logo.png")}
        style={{
          width: "185px",
          height: "auto",
          objectFit: "contain",
          filter: `
            drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.95))
            drop-shadow(0 0 4px rgba(255, 255, 255, 0.75))
            drop-shadow(0 0 16px rgba(225, 175, 75, 0.45))
            drop-shadow(0 4px 14px rgba(0, 0, 0, 0.9))
          `,
        }}
      />
    </div>
  );
};
