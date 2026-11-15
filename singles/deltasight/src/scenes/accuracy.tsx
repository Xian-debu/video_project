import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, EV, Head, Mono, PAD, Pill, Plate, Scene, beatFrames, pct } from "../shared";
import { SCENES } from "../script";

/* 10 精度：VID 三行都涨，NFS 的 B / L 掉点，平均还是涨的。
 * 所有读数取自 EV.values.table1、EV.values.skipPct 与 EV.derived，不手写数字。
 * 拍点：beatFrames 与 beatAt 同源（同一份 LINES 真实旁白起点）。本场 13 句长短
 * 不一，beatAt 的「就近吸附」会把第 i 句吸到邻句上，所以这里按句序直接取拍点，
 * 保证每个元素和它所讲的那一句同帧出现。 */

type T1Row = { dataset: string; model: string; kappa: number; base: number; ds: number; skip: number };
const T1 = EV.values.table1 as T1Row[];
const VID = T1.filter((r) => r.dataset === "ImageNet VID");
const NFS = T1.filter((r) => r.dataset === "NFS");
const rowOf = (rows: T1Row[], model: string): T1Row => {
  const hit = rows.find((r) => r.model === model);
  if (!hit) throw new Error("table1: missing row " + model);
  return hit;
};
const SKIP = EV.values.skipPct as { vid: number; nfs: number };
const GAIN = EV.derived as { vidAvgGainMap: string; nfsAvgGainMap: string; nfsBDelta: string; nfsLDelta: string };
const TAU = String(EV.values.tau);
const f2 = (v: number) => v.toFixed(2);
const VID_AVG = rowOf(VID, "Average");
const NFS_AVG = rowOf(NFS, "Average");
const MODELS = ["ViTDeT-S", "ViTDeT-B", "ViTDeT-L"];

const LEFT_X = PAD;
const LEFT_W = 980;
const RIGHT_X = 1076;
const RIGHT_W = 772;

const ReadRow: React.FC<{
  model: string;
  base: number;
  ds: number;
  at: number;
  dsAt: number;
  tone?: "up" | "down";
  right?: React.ReactNode;
  rightAt?: number;
}> = ({ model, base, ds, at, dsAt, tone = "up", right = null, rightAt = 0 }) => {
  const f = useCurrentFrame();
  const show = (t: number, dur = 12) => pct(f, t, t + dur);
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "6px 0", borderBottom: "1px solid " + C.panelLine }}>
      <div style={{ width: 150, fontFamily: FONT.sans, fontSize: FT.label, color: C.inkDim, opacity: show(at) }}>{model}</div>
      <div style={{ width: 100, fontFamily: FONT.mono, fontSize: FT.mono, color: C.inkFaint, opacity: show(at) }}>{f2(base)}</div>
      <div style={{ width: 40, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, opacity: show(at) }}>→</div>
      <div
        style={{
          width: 104,
          fontFamily: FONT.mono,
          fontSize: FT.h2,
          fontVariantNumeric: "tabular-nums",
          color: tone === "down" ? C.coral : C.ink,
          opacity: show(dsAt),
        }}
      >
        {f2(ds)}
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", opacity: rightAt > 0 ? show(rightAt) : 1 }}>{right}</div>
    </div>
  );
};

const AvgRow: React.FC<{ base: number; ds: number; gain: string; at: number }> = ({ base, ds, gain, at }) => {
  const f = useCurrentFrame();
  const op = pct(f, at, at + 14);
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "8px 0 2px", borderTop: "1px solid " + C.panelLine, opacity: op }}>
      <div style={{ width: 150, fontFamily: FONT.sans, fontSize: FT.label, color: C.ink }}>平均</div>
      <div style={{ width: 100, fontFamily: FONT.mono, fontSize: FT.mono, color: C.inkDim }}>{f2(base)}</div>
      <div style={{ width: 40, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>→</div>
      <div style={{ width: 104, fontFamily: FONT.mono, fontSize: FT.h2, fontVariantNumeric: "tabular-nums", color: C.ink }}>{f2(ds)}</div>
      <div style={{ flex: 1, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, fontVariantNumeric: "tabular-nums", color: C.cyan }}>{gain}</div>
    </div>
  );
};

const Headline: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, opacity: pct(f, at, at + 14) }}>{text}</div>
  );
};

export const SAccuracy: React.FC = () => {
  const f = useCurrentFrame();
  const id = "accuracy";
  const s = SCENES.find((x) => x.id === id)!;
  const beats = beatFrames(id);
  const at = (k: number) => (beats.length ? beats[Math.min(k, beats.length - 1)] : 0);
  const show = (t: number, dur = 14) => pct(f, t, t + dur);
  const arrow = { fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan };

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      {/* 左：原文 Table 1 */}
      <div style={{ position: "absolute", left: LEFT_X, top: 270, width: LEFT_W, opacity: show(at(0), 18) }}>
        <Plate id="table1" width={LEFT_W} caption="原文 Table 1：两套数据集 × 三个模型的 mAP 与跳过率（§5.2）" />
      </div>
      <div style={{ position: "absolute", left: LEFT_X, top: 796, width: LEFT_W, display: "flex", alignItems: "center", gap: 16, opacity: show(at(1), 16) }}>
        <Mono size={FT.meta} color={C.inkFaint}>三列怎么读</Mono>
        <Body size={FT.label} color={C.inkDim}>基线 mAP → DeltaSight mAP，最右列是被跳过的区域比例。</Body>
        <span style={{ flex: "0 0 auto" }}>
          <Pill text={"τ " + TAU} color={C.inkFaint} bg="rgba(102,117,138,0.12)" size={FT.micro} />
        </span>
      </div>

      {/* 右：两组读数 */}
      <div style={{ position: "absolute", left: RIGHT_X, top: 270, width: RIGHT_W }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", minHeight: 40 }}>
          <Headline text="ImageNet VID" at={at(2)} />
          <div style={{ display: "flex", gap: 10, opacity: show(at(4), 12) }}>
            <Pill text="三行都涨" color={C.cyan} bg="rgba(94,234,212,0.10)" />
            <span style={{ opacity: show(at(6), 12) }}>
              <Pill text={"跳过 " + SKIP.vid + "%"} color={C.inkFaint} bg="rgba(102,117,138,0.12)" />
            </span>
          </div>
        </div>
        {MODELS.map((m) => {
          const r = rowOf(VID, m);
          return <ReadRow key={m} model={m} base={r.base} ds={r.ds} at={at(2)} dsAt={at(3)} right={<span style={arrow}>↑</span>} rightAt={at(3)} />;
        })}
        <AvgRow base={VID_AVG.base} ds={VID_AVG.ds} gain={GAIN.vidAvgGainMap} at={at(5)} />

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 16, minHeight: 40 }}>
          <Headline text="NFS" at={at(7)} />
          <div style={{ opacity: show(at(12), 12) }}>
            <Pill text={"跳过 " + SKIP.nfs + "%"} color={C.inkFaint} bg="rgba(102,117,138,0.12)" />
          </div>
        </div>
        {MODELS.map((m, i) => {
          const r = rowOf(NFS, m);
          const down = r.ds < r.base;
          const delta = m === "ViTDeT-B" ? GAIN.nfsBDelta : m === "ViTDeT-L" ? GAIN.nfsLDelta : "";
          const right = down ? (
            <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.coral, fontVariantNumeric: "tabular-nums" }}>↓ {delta}</span>
          ) : (
            <Pill text="涨得最多" color={C.cyan} bg="rgba(94,234,212,0.10)" size={FT.micro} />
          );
          return (
            <ReadRow key={m} model={m} base={r.base} ds={r.ds} at={at(8 + i)} dsAt={at(8 + i)} tone={down ? "down" : "up"} right={right} rightAt={at(8 + i)} />
          );
        })}
        <AvgRow base={NFS_AVG.base} ds={NFS_AVG.ds} gain={GAIN.nfsAvgGainMap} at={at(11)} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, opacity: show(at(11) + 6, 16) }}>
          <span style={{ width: 5, height: 20, background: C.cyan, borderRadius: 3, flex: "0 0 auto" }} />
          <Body size={FT.label} color={C.inkDim}>平均还是涨的——NFS 上 S 涨得最多，把 B、L 的掉点补了回来。</Body>
        </div>
      </div>
    </Scene>
  );
};
