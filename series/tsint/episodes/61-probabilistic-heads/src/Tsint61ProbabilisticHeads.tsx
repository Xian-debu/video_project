import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../design/tokens";
import { SCENES, LINES, TOTAL, FPS } from "./script";
import { clamp } from "./shared";
import { OpenScene } from "./scenes/open";
import { ProblemScene } from "./scenes/problem";
import { DefinitionsScene } from "./scenes/definitions";
import { MetricsScene } from "./scenes/metrics";
import { ImplementationScene } from "./scenes/implementation";
import { VerificationScene } from "./scenes/verification";
import { BoundaryScene } from "./scenes/boundary";
import { OutroScene } from "./scenes/outro";

const SCENE_COMPONENTS: Record<string, React.FC> = {
  open: OpenScene,
  problem: ProblemScene,
  definitions: DefinitionsScene,
  metrics: MetricsScene,
  implementation: ImplementationScene,
  verification: VerificationScene,
  boundary: BoundaryScene,
  outro: OutroScene,
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const line = LINES.find((c) => t >= c.start && t < c.start + c.dur);
  if (!line) return null;
  const local = (t - line.start) / Math.max(line.dur, 0.01);
  const opacity = interpolate(local, [0, 0.06, 0.94, 1], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, display: "flex", justifyContent: "center", opacity }}>
      <div style={{ background: C.panel, border: "1px solid " + C.panelLine, borderRadius: 10, padding: "12px 26px", maxWidth: 1480 }}>
        <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, textAlign: "center", lineHeight: 1.3 }}>{line.speech}</div>
      </div>
    </div>
  );
};

export const Tsint61ProbabilisticHeads: React.FC<{ music?: string | null; narration?: string | null }> = ({ music = null, narration = null }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {music ? <Audio src={staticFile(music)} volume={0.16} /> : null}
    {narration ? <Audio src={staticFile(narration)} volume={1} /> : null}
    {SCENES.map((s, i) => {
      const from = Math.round(s.start * FPS);
      const next = SCENES[i + 1];
      const durationInFrames = next ? Math.round(next.start * FPS) - from : TOTAL - from;
      const Comp = SCENE_COMPONENTS[s.id];
      if (!Comp) return null;
      return (
        <Sequence key={s.id} from={from} durationInFrames={durationInFrames}>
          <Comp />
        </Sequence>
      );
    })}
    <Subtitle />
  </AbsoluteFill>
);

export { TOTAL, FPS };
