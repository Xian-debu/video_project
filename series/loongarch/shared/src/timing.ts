import type { Line, Scene, SceneSpec } from "./types";

/**
 * 系列统一的讲稿节奏：讲稿即字幕（TTS 输入与字幕同一条字符串）。
 * 时间点由实测语音（data/voice.json，键 "scene#index"）决定，测不到才按字速估。
 * 每集只写 SPEC，不写时间点——这样重录一句不会让全片错位。
 */
const CPS = 4.5;
const GAP = 0.55;
const LEAD = 1.2;
const TAIL = 2.2;
export const MAX_CHARS = 34;
const LINE_PAD = 0.35;
const MIN_LINE = 1.4;

const round2 = (v: number) => Math.round(v * 100) / 100;

export type ScriptBuild = {
  SCENES: Scene[];
  LINES: Line[];
  TOTAL_SEC: number;
  TOTAL: number;
  FPS: number;
  SCRIPT_PROBLEMS: string[];
  STARTS: Record<string, number>;
  CAPTIONS: { from: number; to: number; text: string }[];
  linesOf: (id: string) => Line[];
  sceneOf: (id: string) => Scene;
};

export function buildScript(spec: SceneSpec[], measured: Record<string, number>, fps = 30): ScriptBuild {
  const problems: string[] = [];
  const scenes: Scene[] = [];
  const lines: Line[] = [];
  let cursor = 0;

  spec.forEach((s, i) => {
    s.lines.forEach((text, k) => {
      if (text.length > MAX_CHARS) problems.push(s.id + "[" + k + "] " + text.length + " chars: " + text);
      if (text.length < 8) problems.push(s.id + "[" + k + "] too short: " + text);
      const said = measured[s.id + "#" + k];
      if (said) {
        const cps = text.length / said;
        if (cps < 3.6 || cps > 9.0) problems.push(s.id + "[" + k + "] measured " + cps.toFixed(2) + " chars/s: " + text);
      }
    });
    const durs = s.lines.map((t, k) => {
      const said = measured[s.id + "#" + k];
      return Math.max(MIN_LINE, (said ?? t.length / CPS) + LINE_PAD);
    });
    const speech = durs.reduce((a, b) => a + b, 0) + GAP * Math.max(0, s.lines.length - 1);
    const dur = round2(LEAD + speech + TAIL);
    const start = round2(cursor);
    scenes.push({ ...s, dur, start, chapterIndex: i + 1 });
    let t = start + LEAD;
    s.lines.forEach((text, k) => {
      lines.push({ start: round2(t), dur: round2(durs[k]), speech: text, scene: s.id, index: k });
      t += durs[k] + GAP;
    });
    cursor += dur;
  });

  const totalSec = round2(scenes.reduce((a, s) => a + s.dur, 0));
  const starts: Record<string, number> = {};
  for (const s of scenes) starts[s.id] = Math.round(s.start * fps);

  return {
    SCENES: scenes,
    LINES: lines,
    TOTAL_SEC: totalSec,
    TOTAL: Math.round(totalSec * fps),
    FPS: fps,
    SCRIPT_PROBLEMS: problems,
    STARTS: starts,
    CAPTIONS: lines.map((l) => ({ from: l.start, to: l.start + l.dur, text: l.speech })),
    linesOf: (id) => lines.filter((l) => l.scene === id),
    sceneOf: (id) => scenes.find((s) => s.id === id)!,
  };
}
