#!/usr/bin/env python3
"""Generate src/script.ts for episode 55 from build/script_spec.json.

The spec is the single source of truth: eight scenes, page split every ten lines.
Run: python3 build/make_script.py
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SPEC = json.load(open(os.path.join(HERE, "script_spec.json")))
OUT = os.path.join(ROOT, "src", "script.ts")

HEAD = '''/**
 * 第 6 章 · 自动化模型设计 · 第五十五集。
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 voice.json 的实测值。
 */
import voiceJson from "../../data/tsint-55-generalizable-search/voice.json";

export const FPS = 30;

type SceneSpec = {
  id: string;
  chapter: string;
  kicker: string;
  title: string;
  goal: string;
  pages: number[];
  lines: string[];
};

const SPEC: SceneSpec[] = '''

TAIL = '''
export const PAGES_INDEX: Record<string, number[]> = __PAGES__;
const LEAD = 1.2;
const TAIL = 2.2;
const MAX_CHARS = 34;
const LINE_PAD = 0.35;
const MIN_LINE = 1.4;
const CPS = 4.5;
const GAP = 0.18;

const round2 = (v: number) => Math.round(v * 100) / 100;

const voice = voiceJson as Record<string, number>;

const problems: string[] = [];

type Scene = { id: string; chapter: string; kicker: string; title: string; goal: string; start: number; dur: number; lines: string[] };
type Line = { scene: string; index: number; start: number; dur: number; speech: string };

export const SCENES: Scene[] = [];
export const LINES: Line[] = [];

let cursor = 0;
for (const spec of SPEC) {
  const sceneStart = cursor;
  const speech: number[] = [];
  spec.lines.forEach((text, i) => {
    const measured = voice[spec.id + "#" + i];
    const est = text.length / CPS;
    const d = measured && measured > 0.4 ? Math.max(0.01, measured + LINE_PAD) : Math.max(MIN_LINE, est + LINE_PAD);
    speech.push(d);
    if (text.length > MAX_CHARS) problems.push(spec.id + "#" + i + " too long: " + text.length + " chars");
    if (text.length < 6) problems.push(spec.id + "#" + i + " too short: " + text.length + " chars");
    const cps = text.length / d;
    if (measured && (cps < 3.2 || cps > 9.4)) problems.push(spec.id + "#" + i + " cps " + cps.toFixed(2));
  });
  const total = speech.reduce((a, b) => a + b, 0) + GAP * Math.max(0, speech.length - 1);
  const dur = round2(LEAD + total + TAIL);
  let t = sceneStart + LEAD;
  spec.lines.forEach((text, i) => {
    LINES.push({ scene: spec.id, index: i, start: round2(t), dur: round2(speech[i]), speech: text });
    t += speech[i] + GAP;
  });
  SCENES.push({ id: spec.id, chapter: spec.chapter, kicker: spec.kicker, title: spec.title, goal: spec.goal, start: round2(sceneStart), dur, lines: spec.lines });
  cursor += dur;
}

export const SCRIPT_PROBLEMS = problems;
export const TOTAL = Math.round(SCENES.reduce((a, s) => a + s.dur, 0) * FPS);
export const TOTAL_SEC = round2(SCENES.reduce((a, s) => a + s.dur, 0));

export const STARTS = SCENES.map((s) => s.start);
export const CAPTIONS = LINES.map((l) => ({ start: l.start, dur: l.dur, text: l.speech }));

export const linesOf = (id: string) => LINES.filter((l) => l.scene === id);
export const sceneOf = (id: string) => SCENES.find((s) => s.id === id)!;
export const within = (id: string, k: number) => {
  const s = sceneOf(id);
  return [s.start + 0.6, s.start + s.dur - 0.4 * k] as const;
};
'''

spec = []
pages_index = {}
for sc in SPEC["scenes"]:
    n = len(sc["lines"])
    if n % 10 != 0:
        sys.exit("scene %s has %d lines, not a multiple of 10" % (sc["id"], n))
    pages = list(range(0, n, 10))
    pages_index[sc["id"]] = pages
    bad = [(i, l) for i, l in enumerate(sc["lines"]) if len(l) > 34 or len(l) < 6]
    if bad:
        sys.exit("scene %s has out-of-range lines: %r" % (sc["id"], bad))
    spec.append(dict(id=sc["id"], chapter=sc["chapter"], kicker=sc["kicker"],
                     title=sc["title"], goal=sc["goal"], pages=pages, lines=sc["lines"]))

body = json.dumps(spec, ensure_ascii=False, indent=1)
pages_ts = json.dumps(pages_index, ensure_ascii=False, indent=2).replace("\n", "\n  ")
text = HEAD + body + ";\n" + TAIL.replace("__PAGES__", pages_ts)

with open(OUT, "w") as f:
    f.write(text)

lines = sum(len(s["lines"]) for s in SPEC["scenes"])
print("wrote %s (%d bytes)" % (os.path.relpath(OUT, ROOT), len(text.encode())))
print("scenes %d | pages %d | lines %d" % (len(SPEC["scenes"]), lines // 10, lines))
for sc in spec:
    print("  %-14s %2d pages %3d lines" % (sc["id"], len(sc["pages"]), len(sc["lines"])))