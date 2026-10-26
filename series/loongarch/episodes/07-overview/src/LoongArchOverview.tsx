import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const FPS = 30;
export const TOTAL = 90;

export const LoongArchOverview: React.FC<{ music?: string | null; narration?: string | null }> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0e1116", color: "#e8eef7", fontFamily: "sans-serif" }}>
      <div style={{ margin: "auto", fontSize: 64 }}>二十年五条线：龙芯做对了什么</div>
      <div style={{ position: "absolute", bottom: 40, right: 60, opacity: 0.5 }}>frame {frame}</div>
    </AbsoluteFill>
  );
};
