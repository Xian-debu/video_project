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
  const f = useCurrentFrame();
  const t = f / FPS;
  const line = LINES.find((c) => t >= c.start && t < c.start + c.dur);
  if (!line) return null;
  const local = (t - line.start) / line.dur;
  const op = interpolate(local, [0, 0.06, 0.94, 1], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{
        background: C.panel, border: "1px solid " + C.panelLine, borderRadius: 12, padding: "10px 26px",
        fontFamily: FONT.sans, fontSize: FT.h2, lineHeight: 1.45, color: C.ink, maxWidth: 1480, textAlign: "center",
      }}>{line.speech}</div>
    </div>
  );
};

export const Tsint51GaSearchIncremental: React.FC<{ music?: string | null; narration?: string | null }> = ({
  music = null, narration = null,
}) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {music ? <Audio src={staticFile(music)} volume={0.16} /> : null}
    {narration ? <Audio src={staticFile(narration)} volume={1} /> : null}
    {SCENES.map((s, i) => {
      const from = Math.round(s.start * FPS);
      const to = i + 1 < SCENES.length ? Math.round(SCENES[i + 1].start * FPS) : TOTAL;
      return (
        <Sequence key={s.id} from={from} durationInFrames={to - from} name={s.id}>
          {SCENE_COMPONENTS[s.id] ? React.createElement(SCENE_COMPONENTS[s.id]) : null}
        </Sequence>
      );
    })}
    <Subtitle />
  </AbsoluteFill>
);

export { TOTAL, FPS };