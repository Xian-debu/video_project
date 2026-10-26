import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { S, TONE } from "./theme";
import { TIMELINE } from "./data/timeline";
import type { EpisodeContent, EpisodeMeta, Line, Scene, SceneContent } from "./types";
import { Diagram } from "./diagrams";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const reveal = (f: number, delay = 0, dur = 16) => {
  const t = interpolate(f, [delay, delay + dur], [0, 1], clamp);
  return { opacity: t, transform: "translateY(" + (1 - t) * 18 + "px)" };
};

export const Kicker: React.FC<{ children: React.ReactNode; tone?: string }> = ({ children, tone = S.cyan }) => (
  <div style={{ fontFamily: S.mono, fontSize: S.micro, letterSpacing: 3, color: tone, textTransform: "uppercase" }}>{children}</div>
);

const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; tone?: string }> = ({ children, style, tone = S.line }) => (
  <div style={{ background: S.panel, border: "1px solid " + tone, borderRadius: 16, padding: "26px 30px", ...style }}>{children}</div>
);

/* ============================ 场景 ============================ */

const OpenScene: React.FC<{ c: Extract<SceneContent, { kind: "open" }>; f: number; meta: EpisodeMeta }> = ({ c, f, meta }) => (
  <div style={{ position: "absolute", inset: 0, padding: "150px " + S.pad + "px 120px" }}>
    <div style={{ position: "absolute", right: 70, top: 70, fontFamily: S.mono, fontSize: 300, lineHeight: 1, color: S.ink, opacity: 0.055, letterSpacing: -10 }}>{c.year}</div>
    <div style={reveal(f, 4)}><Kicker>{c.lead}</Kicker></div>
    <div style={{ ...reveal(f, 16), fontFamily: S.serif, fontSize: 92, lineHeight: 1.12, color: S.ink, fontWeight: 700, marginTop: 24, maxWidth: 1240 }}>{c.title}</div>
    <div style={{ ...reveal(f, 30), fontSize: 36, color: S.dim, marginTop: 18, maxWidth: 1180 }}>{c.subtitle}</div>
    <div style={{ ...reveal(f, 44), marginTop: 64, maxWidth: 1180 }}>
      <Panel tone="rgba(94,234,212,0.35)" style={{ borderLeft: "4px solid " + S.cyan }}>
        <div style={{ fontFamily: S.mono, fontSize: S.micro, color: S.cyan, letterSpacing: 2, marginBottom: 10 }}>这一集要回答</div>
        <div style={{ fontSize: 30, lineHeight: 1.5, color: S.ink }}>{c.thesis}</div>
      </Panel>
    </div>
    <div style={{ ...reveal(f, 60), position: "absolute", left: S.pad, bottom: 108, display: "flex", gap: 18, alignItems: "center", color: S.faint, fontFamily: S.mono, fontSize: 18, letterSpacing: 1 }}>
      <span>{meta.seriesTitle}</span><span style={{ color: S.cyan }}>·</span><span>EP {String(meta.order).padStart(2, "0")} / {String(meta.total).padStart(2, "0")}</span>
    </div>
  </div>
);

const ThesisScene: React.FC<{ c: Extract<SceneContent, { kind: "thesis" }>; f: number }> = ({ c, f }) => (
  <div style={{ position: "absolute", inset: 0, padding: "190px " + S.pad + "px 130px", display: "flex", gap: 70, alignItems: "center" }}>
    <div style={{ flex: 1, ...reveal(f, 6) }}>
      <div style={{ fontFamily: S.serif, fontSize: 74, lineHeight: 1.32, color: S.ink, fontWeight: 700 }}>{c.statement}</div>
      {c.detail ? <div style={{ fontSize: 30, lineHeight: 1.65, color: S.dim, marginTop: 28, maxWidth: 1020 }}>{c.detail}</div> : null}
    </div>
    {c.stat ? (
      <div style={{ ...reveal(f, 34), width: 420 }}>
        <Panel tone="rgba(251,191,36,0.35)">
          <div style={{ fontFamily: S.mono, fontSize: 76, color: S.amber, lineHeight: 1 }}>{c.stat}</div>
          <div style={{ fontSize: 22, color: S.dim, marginTop: 14, lineHeight: 1.4 }}>{c.statLabel ?? ""}</div>
        </Panel>
      </div>
    ) : null}
  </div>
);

const TimelineScene: React.FC<{ c: Extract<SceneContent, { kind: "timeline" }>; f: number }> = ({ c, f }) => {
  const active = Math.max(0, Math.min(5, c.active));
  const x0 = 200;
  const x1 = 1290;
  const step = (x1 - x0) / 5;
  return (
    <div style={{ position: "absolute", inset: 0, padding: "170px " + S.pad + "px 130px" }}>
      <div style={reveal(f, 4)}><Kicker>发展脉络 / {TIMELINE[active].year}</Kicker></div>
      <div style={{ ...reveal(f, 12), fontSize: 52, color: S.ink, fontWeight: 700, marginTop: 14 }}>{TIMELINE[active].title}</div>
      <div style={{ position: "absolute", left: x0 - 100, right: 100, top: 430 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 52, height: 2, background: S.line }} />
        <div style={{ position: "absolute", left: 0, top: 52, height: 2, width: step * active, background: S.cyan }} />
        {TIMELINE.map((t, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <div key={t.year} style={{ position: "absolute", left: i * step - 70, width: 140, top: 0, textAlign: "center" }}>
              <div style={{ fontFamily: S.mono, fontSize: 22, color: on ? S.cyan : done ? S.dim : S.faint }}>{t.year}</div>
              <div style={{ width: on ? 18 : 12, height: on ? 18 : 12, borderRadius: 99, background: on ? S.cyan : done ? S.dim : S.line, margin: "28px auto 0", boxShadow: on ? "0 0 22px rgba(94,234,212,0.65)" : "none" }} />
              <div style={{ marginTop: 18, fontSize: 19, color: on ? S.ink : S.faint, lineHeight: 1.3 }}>{t.short}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: S.pad, right: S.pad, top: 610 }}>
        <Panel style={{ maxWidth: 1200 }} tone={S.line}>
          <div style={{ fontSize: 27, lineHeight: 1.6, color: S.dim }}>{c.note}</div>
        </Panel>
      </div>
    </div>
  );
};

const PaperScene: React.FC<{ c: Extract<SceneContent, { kind: "paper" }>; f: number }> = ({ c, f }) => (
  <div style={{ position: "absolute", inset: 0, padding: "155px " + S.pad + "px 120px", display: "flex", gap: 64 }}>
    <div style={{ width: 640, ...reveal(f, 6) }}>
      <Kicker>论文</Kicker>
      <div style={{ fontFamily: S.serif, fontSize: 50, lineHeight: 1.28, color: S.ink, fontWeight: 700, marginTop: 18 }}>{c.paperTitle}</div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 8 }}>
        {c.meta.map((m) => <div key={m} style={{ fontFamily: S.mono, fontSize: 19, color: S.dim, letterSpacing: 0.3 }}>{m}</div>)}
      </div>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, paddingTop: 6 }}>
      {c.contributions.map((it, i) => (
        <div key={it.head} style={{ ...reveal(f, 24 + i * 14), display: "flex", gap: 22, alignItems: "flex-start" }}>
          <div style={{ fontFamily: S.mono, fontSize: 20, color: S.cyan, width: 44, paddingTop: 4 }}>0{i + 1}</div>
          <div>
            <div style={{ fontSize: 29, color: S.ink, fontWeight: 600 }}>{it.head}</div>
            <div style={{ fontSize: 22, color: S.dim, marginTop: 6, lineHeight: 1.5 }}>{it.body}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProblemScene: React.FC<{ c: Extract<SceneContent, { kind: "problem" }>; f: number }> = ({ c, f }) => (
  <div style={{ position: "absolute", inset: 0, padding: "160px " + S.pad + "px 130px" }}>
    <div style={{ display: "flex", gap: 42 }}>
      {[c.left, c.right].map((col, i) => (
        <div key={col.head} style={{ ...reveal(f, 8 + i * 18), flex: 1 }}>
          <Panel tone={i === 0 ? "rgba(94,234,212,0.28)" : "rgba(251,113,133,0.28)"} style={{ height: 410 }}>
            <div style={{ fontFamily: S.mono, fontSize: S.micro, letterSpacing: 2, color: i === 0 ? S.cyan : S.coral, marginBottom: 18 }}>0{i + 1}</div>
            <div style={{ fontSize: 36, color: S.ink, fontWeight: 700, marginBottom: 22 }}>{col.head}</div>
            {col.items.map((it) => (
              <div key={it} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 14 }}>
                <span style={{ color: i === 0 ? S.cyan : S.coral, fontSize: 22, lineHeight: 1.5 }}>—</span>
                <span style={{ fontSize: 23, color: S.dim, lineHeight: 1.5 }}>{it}</span>
              </div>
            ))}
          </Panel>
        </div>
      ))}
    </div>
    {c.bottom ? <div style={{ ...reveal(f, 55), marginTop: 30, fontFamily: S.mono, fontSize: 21, color: S.faint }}>{c.bottom}</div> : null}
  </div>
);

const DiagramScene: React.FC<{ c: Extract<SceneContent, { kind: "diagram" }>; f: number }> = ({ c, f }) => (
  <div style={{ position: "absolute", inset: 0, padding: "140px " + S.pad + "px 110px" }}>
    <div style={reveal(f, 4)}><Kicker>{c.title}</Kicker></div>
    <div style={{ ...reveal(f, 12), marginTop: 16, background: "rgba(21,30,43,0.55)", border: "1px solid " + S.line, borderRadius: 18, padding: "8px 18px 0" }}>
      <svg viewBox="0 0 1440 560" style={{ width: "100%", display: "block" }}><Diagram variant={c.variant} items={c.items} /></svg>
    </div>
    <div style={{ ...reveal(f, 26), marginTop: 14, fontSize: 22, color: S.dim, lineHeight: 1.5 }}>{c.caption}</div>
  </div>
);

const QuoteScene: React.FC<{ c: Extract<SceneContent, { kind: "quote" }>; f: number }> = ({ c, f }) => (
  <div style={{ position: "absolute", inset: 0, padding: "200px " + S.pad + "px 140px", display: "flex", gap: 60 }}>
    <div style={{ width: 6, background: S.amber, borderRadius: 3, ...reveal(f, 4) }} />
    <div style={{ flex: 1 }}>
      <div style={{ ...reveal(f, 12), fontFamily: S.serif, fontSize: 52, lineHeight: 1.55, color: S.ink, fontWeight: 600 }}>{c.text}</div>
      <div style={{ ...reveal(f, 32), marginTop: 34, fontFamily: S.mono, fontSize: 20, color: S.amber }}>{c.source}</div>
      {c.note ? <div style={{ ...reveal(f, 44), marginTop: 16, fontSize: 22, color: S.dim }}>{c.note}</div> : null}
    </div>
  </div>
);

const MetricsScene: React.FC<{ c: Extract<SceneContent, { kind: "metrics" }>; f: number }> = ({ c, f }) => (
  <div style={{ position: "absolute", inset: 0, padding: "150px " + S.pad + "px 120px" }}>
    <div style={reveal(f, 4)}><Kicker>数字 / {c.unit}</Kicker></div>
    <div style={{ ...reveal(f, 12), fontSize: 44, color: S.ink, fontWeight: 700, marginTop: 12 }}>{c.title}</div>
    <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 24 }}>
      {c.bars.map((b, i) => {
        const w = Math.max(2, (b.value / c.max) * 1000);
        return (
          <div key={b.label} style={{ ...reveal(f, 22 + i * 12), display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 330, textAlign: "right", fontSize: 22, color: S.dim }}>{b.label}</div>
            <div style={{ position: "relative", flex: 1, height: 42, background: "rgba(255,255,255,0.035)", borderRadius: 6 }}>
              <div style={{ width: w, height: 42, background: i === 0 ? "rgba(94,234,212,0.30)" : "rgba(251,191,36,0.22)", borderLeft: "3px solid " + (i === 0 ? S.cyan : S.amber), borderRadius: 6 }} />
            </div>
            <div style={{ width: 190, fontFamily: S.mono, fontSize: 22, color: S.ink }}>{b.value}{c.unit}</div>
            {b.note ? <div style={{ width: 220, fontSize: 18, color: S.faint }}>{b.note}</div> : null}
          </div>
        );
      })}
    </div>
    <div style={{ ...reveal(f, 55), marginTop: 30, fontSize: 20, color: S.faint, fontFamily: S.mono }}>{c.caveat}</div>
  </div>
);

const VerdictScene: React.FC<{ c: Extract<SceneContent, { kind: "verdict" }>; f: number }> = ({ c, f }) => {
  const cols = [
    { head: "做对了什么", items: c.good, tone: TONE.cyan },
    { head: "付出了什么", items: c.cost, tone: TONE.coral },
    { head: "后来怎么回应", items: c.echo, tone: TONE.amber },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, padding: "150px " + S.pad + "px 130px" }}>
      <div style={{ ...reveal(f, 4), fontFamily: S.serif, fontSize: 52, color: S.ink, fontWeight: 700 }}>{c.line}</div>
      <div style={{ display: "flex", gap: 28, marginTop: 40 }}>
        {cols.map((col, i) => (
          <div key={col.head} style={{ ...reveal(f, 20 + i * 16), flex: 1 }}>
            <Panel tone={col.tone.fg + "55"} style={{ height: 390 }}>
              <div style={{ fontFamily: S.mono, fontSize: S.micro, letterSpacing: 2, color: col.tone.fg, marginBottom: 18 }}>{col.head}</div>
              {col.items.map((it) => (
                <div key={it} style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <span style={{ color: col.tone.fg }}>·</span>
                  <span style={{ fontSize: 21, color: S.dim, lineHeight: 1.55 }}>{it}</span>
                </div>
              ))}
            </Panel>
          </div>
        ))}
      </div>
    </div>
  );
};

const HandoffScene: React.FC<{ c: Extract<SceneContent, { kind: "handoff" }>; f: number }> = ({ c, f }) => (
  <div style={{ position: "absolute", inset: 0, padding: "220px " + S.pad + "px 150px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
    <div style={{ ...reveal(f, 6), fontFamily: S.mono, fontSize: 20, color: S.cyan, letterSpacing: 3 }}>下一集</div>
    <div style={{ ...reveal(f, 18), fontFamily: S.serif, fontSize: 88, color: S.ink, fontWeight: 700, marginTop: 18 }}>{c.next}</div>
    <div style={{ ...reveal(f, 32), fontSize: 34, color: S.dim, marginTop: 12 }}>{c.nextTitle}</div>
    <div style={{ ...reveal(f, 46), display: "flex", alignItems: "center", gap: 22, marginTop: 58 }}>
      <div style={{ width: 240, height: 2, background: S.cyan }} />
      <div style={{ color: S.cyan, fontSize: 30 }}>→</div>
      <div style={{ fontSize: 25, color: S.dim, maxWidth: 900, lineHeight: 1.5 }}>{c.line}</div>
    </div>
  </div>
);

/* ============================ 壳 ============================ */

const Subtitle: React.FC<{ lines: Line[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const line = lines.find((l) => t >= l.start && t < l.start + l.dur);
  if (!line) return null;
  const local = (t - line.start) / line.dur;
  const op = interpolate(local, [0, 0.06, 0.94, 1], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ background: "rgba(11,15,20,0.78)", border: "1px solid " + S.line, borderRadius: 12, padding: "10px 26px", fontSize: 29, lineHeight: 1.45, color: S.ink, maxWidth: 1480, textAlign: "center" }}>{line.speech}</div>
    </div>
  );
};

const TopBar: React.FC<{ meta: EpisodeMeta; progress: number }> = ({ meta, progress }) => (
  <>
    <div style={{ position: "absolute", left: 0, top: 0, height: 3, width: "100%", background: S.line }}>
      <div style={{ width: (progress * 100).toFixed(3) + "%", height: 3, background: S.cyan }} />
    </div>
    <div style={{ position: "absolute", left: S.pad, top: 34, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 10, height: 10, borderRadius: 99, background: S.cyan, boxShadow: "0 0 14px rgba(94,234,212,0.7)" }} />
      <div style={{ fontFamily: S.mono, fontSize: 17, letterSpacing: 2.4, color: S.dim }}>{meta.seriesTitle}</div>
    </div>
    <div style={{ position: "absolute", right: S.pad, top: 34, fontFamily: S.mono, fontSize: 18, letterSpacing: 1.6, color: S.faint }}>
      EP {String(meta.order).padStart(2, "0")} / {String(meta.total).padStart(2, "0")} · {meta.year}
    </div>
  </>
);

// Hard cut between scenes. A cross-fade of even 0.4 s reads as a dip in the
// luma gate and, at this pace, as a flicker: the series cuts, it does not dissolve.
const SceneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill>{children}</AbsoluteFill>;

export const Episode: React.FC<{
  meta: EpisodeMeta;
  scenes: Scene[];
  lines: Line[];
  total: number;
  content: EpisodeContent;
  music?: string | null;
}> = ({ meta, scenes, lines, total, content, music = null }) => {
  const f = useCurrentFrame();
  const progress = total > 0 ? Math.min(1, f / total) : 0;
  return (
    <AbsoluteFill style={{ background: S.bg, color: S.ink, fontFamily: S.font }}>
      {music ? <Audio src={staticFile(music)} volume={0.16} /> : null}
      <TopBar meta={meta} progress={progress} />
      {scenes.map((s, i) => {
        const from = Math.round(s.start * 30);
        const to = i + 1 < scenes.length ? Math.round(scenes[i + 1].start * 30) : total;
        const c = content[s.id];
        return (
          <Sequence key={s.id} from={from} durationInFrames={to - from} name={s.id}>
            <SceneFrame>
              {c ? <SceneBody c={c} meta={meta} /> : null}
            </SceneFrame>
          </Sequence>
        );
      })}
      <Subtitle lines={lines} />
    </AbsoluteFill>
  );
};

const SceneBody: React.FC<{ c: SceneContent; meta: EpisodeMeta }> = ({ c, meta }) => {
  const f = useCurrentFrame();
  switch (c.kind) {
    case "open": return <OpenScene c={c} f={f} meta={meta} />;
    case "thesis": return <ThesisScene c={c} f={f} />;
    case "timeline": return <TimelineScene c={c} f={f} />;
    case "paper": return <PaperScene c={c} f={f} />;
    case "problem": return <ProblemScene c={c} f={f} />;
    case "diagram": return <DiagramScene c={c} f={f} />;
    case "quote": return <QuoteScene c={c} f={f} />;
    case "metrics": return <MetricsScene c={c} f={f} />;
    case "verdict": return <VerdictScene c={c} f={f} />;
    case "handoff": return <HandoffScene c={c} f={f} />;
    default: return null;
  }
};
