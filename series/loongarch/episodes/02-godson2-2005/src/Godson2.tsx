import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const FPS = 30;
export const TOTAL = 90;

export const Godson2: React.FC<{ music?: string | null; narration?: string | null }> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0e1116", color: "#e8eef7", fontFamily: "sans-serif" }}>
      <div style={{ margin: "auto", fontSize: 64 }}>Godson-2：一颗可复用的乱序核</div>
      <div style={{ position: "absolute", bottom: 40, right: 60, opacity: 0.5 }}>frame {frame}</div>
    </AbsoluteFill>
  );
};
