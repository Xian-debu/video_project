import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Body, Card, EV, Head, Mono, Num, PAD, Pill, Plate, Scene, beatFrames, pct } from "../shared";
import { SCENES } from "../script";

/* 11 能耗：传感 2.4×、传输 3.2×、端到端 1.7×，再翻出代价——相似识别本身吃掉
 * 传感器功耗的 25.98%（VID）/30.97%（NFS），折成原整套传感能量 11.86%。
 * 落点：花一成多，省两倍多。数字全部来自 EV.values.speedup / similarityId。
 * 拍点按句序取 beatFrames（与 beatAt 同源的旁白起点），元素与所讲那一句同帧。 */

type Speedup = { sensing: number; transmission: number; e2e: number };
type SimId = { vidPct: number; nfsPct: number; baseFullPct: number; budgetPct: number };
const SP = EV.values.speedup as Speedup;
const SI = EV.values.similarityId as SimId;

const METRIC: { en: string; cn: string; v: number; color: string; label: string }[] = [
  { en: "SENSING", cn: "传感", v: SP.sensing, color: C.cyan, label: "传感这一段，平均" },
  { en: "TRANSMISSION", cn: "传输", v: SP.transmission, color: C.amber, label: "传输这一段，平均" },
  { en: "END-TO-END", cn: "端到端", v: SP.e2e, color: C.violet, label: "合起来，端到端" },
];
const BUDGET = "折成原整套传感能量（预算口径 " + SI.budgetPct + "%）";

export const SEnergy: React.FC = () => {
  const f = useCurrentFrame();
  const id = "energy";
  const s = SCENES.find((x) => x.id === id)!;
  const beats = beatFrames(id);
  const at = (k: number) => (beats.length ? beats[Math.min(k, beats.length - 1)] : 0);
  const show = (t: number, dur = 14) => pct(f, t, t + dur);

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      {/* 三个大数：传感、传输、端到端，各跟一句旁白 */}
      <div style={{ position: "absolute", left: PAD, top: 250, width: 1776, display: "flex", gap: 33 }}>
        {METRIC.map((m, i) => (
          <div key={m.en} style={{ width: 570, opacity: show(at(1 + i), 16) }}>
            <Card accent={m.color}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.inkDim }}>
                {m.en} <span style={{ color: m.color }}>{m.cn}</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <Num value={m.v} unit="×" size={FT.display} color={m.color} label={m.label} />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* 左：原文 Fig.9 的分段能量节省 */}
      <div style={{ position: "absolute", left: PAD, top: 484, width: 880, opacity: show(at(0), 18) }}>
        <Plate id="fig9" width={880} caption="原文 Fig.9：传感、传输、端到端各自的能量节省（§5.2）" />
      </div>

      {/* 右上：NFS 为什么赚得更多 */}
      <div style={{ position: "absolute", left: 1016, top: 484, width: 832, opacity: show(at(4), 16) }}>
        <Card accent={C.cyan} pad={18}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ flex: "0 0 auto" }}>
              <Pill text="NFS 增益更大" color={C.cyan} bg="rgba(94,234,212,0.10)" />
            </span>
            <Body size={FT.body} color={C.inkDim} style={{ opacity: show(at(5), 16) }}>
              帧率高，相邻两帧更像，能跳过的更多。
            </Body>
          </div>
        </Card>
      </div>

      {/* 右下：代价卡 —— 相似识别不是免费的，但账仍然划算 */}
      <div style={{ position: "absolute", left: 1016, top: 580, width: 832, opacity: show(at(6), 18) }}>
        <Card label="代价 · 相似识别本身不是免费的" accent={C.coral} pad={24}>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1, opacity: show(at(7), 14) }}>
              <Num value={SI.vidPct} unit="%" size={FT.num} color={C.coral} label="VID 的传感器功耗占比" />
            </div>
            <div style={{ flex: 1, opacity: show(at(7) + 8, 14) }}>
              <Num value={SI.nfsPct} unit="%" size={FT.num} color={C.coral} label="NFS 的传感器功耗占比" />
            </div>
            <div style={{ flex: 1, opacity: show(at(8), 14) }}>
              <Num value={SI.baseFullPct} unit="%" size={FT.num} color={C.amber} label={BUDGET} />
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid " + C.panelLine, opacity: show(at(9), 16) }}>
            <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              花<span style={{ color: C.amber }}>一成多</span>的能量，省<span style={{ color: C.cyan }}>两倍多</span>的能耗——这笔账划算。
            </span>
          </div>
        </Card>
      </div>
    </Scene>
  );
};
