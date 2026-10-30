import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt, TimeAxis } from "../shared";

/** 定义：随机切计数合法、顺序非法；三条规矩给出 0 与 2 的对照。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 63);
  const s = M.split;
  return (
    <Scene id="definitions">
      <Head kicker="03 / 问题出在哪" title="计数全对，顺序全错" goal="每个点只出现一次，仍然可以泄漏" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 940 }}>
        <Build at={b(2)}>
          <Card label="同一批索引 · 两种排列" accent={C.coral} style={{ width: 940, height: 302 }} pad={20}>
            <Mini mode="chrono" label="时间切分" color={C.cyan} note="每个训练点，都在测试点之前" at={b(8)} />
            <div style={{ height: 1, background: C.panelLine, margin: "10px 0" }} />
            <Mini mode="shuffle" label="随机切分" color={C.coral} note="训练里有 2023，测试里有 2015" at={b(15)} />
          </Card>
        </Build>

        <Build at={b(22)} style={{ marginTop: 16 }}>
          <Card label="查表探针 · 只查最近邻" accent={C.violet} style={{ width: 940, height: 252 }} pad={20}>
            <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <K>时间切分 · 最近邻全在过去</K>
                <div><Num value={s.leakProbe.chronoMse} digits={3} size={FT.num} color={C.cyan} /></div>
              </div>
              <div style={{ flex: 1 }}>
                <K>随机切分 · 最近邻可能来自未来</K>
                <div><Num value={s.leakProbe.shuffleMse} digits={4} size={FT.num} color={C.coral} /></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <K>误差比</K>
                <div><Num value={s.leakProbe.ratio} digits={1} size={FT.num} color={C.coral} /><span style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.coral }}>×</span></div>
              </div>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <Body size={FT.meta} style={{ color: C.inkFaint }}>
              误差越小，不是模型越强，是答案抄得越准。分数越高，说明漏得越多。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1050, top: 292, width: 780 }}>
        <Build at={b(37)}>
          <Card label="泄漏检测器 · 只查顺序与相交" accent={C.violet} style={{ width: 780, height: 390 }} pad={22}>
            <Rule n="01" expr="max(train) < min(val)" chrono="通过" shuffle="违规" />
            <Rule n="02" expr="max(val) < min(test)" chrono="通过" shuffle="违规" />
            <Rule n="03" expr="train ∩ val ∩ test = ∅" chrono="通过" shuffle="通过" />
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <K>时间切分</K>
                <div><Mono size={FT.num} color={C.cyan}>0</Mono><span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}> 条泄漏</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <K>随机切分</K>
                <div><Mono size={FT.num} color={C.coral}>2</Mono><span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}> 条泄漏</span></div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(49)} style={{ marginTop: 16 }}>
          <Card label="硬证据" accent={C.coral} style={{ width: 780, height: 216 }} pad={22}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <Num value={s.shuffle.futureTestPoints} size={FT.num} color={C.coral} />
              <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>个测试点</span>
            </div>
            <Body size={FT.meta} style={{ marginTop: 6, color: C.inkFaint }}>
              训练集里有更晚的观测。不是看图看出来的，是一条断言算出来的。
            </Body>
          </Card>
        </Build>
      </div>

      <Build at={b(54)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>顺序不是细节，是定义。</div>
      </Build>
    </Scene>
  );
};

const Mini: React.FC<{ mode: "chrono" | "shuffle"; label: string; color: string; note: string; at: number }> = ({ mode, label, color, note, at }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>{label}</div>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color }}>{note}</div>
    </div>
    <TimeAxis w={890} h={70} at={at} mode={mode} trainPct={0.7} valPct={0.1} testPct={0.2} dates={false} />
  </div>
);

const Rule: React.FC<{ n: string; expr: string; chrono: string; shuffle: string }> = ({ n, expr, chrono, shuffle }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 0" }}>
    <div style={{ width: 28, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{n}</div>
    <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>{expr}</div>
    <div style={{ width: 60, fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{chrono}</div>
    <div style={{ width: 60, fontFamily: FONT.mono, fontSize: FT.meta, color: shuffle === "违规" ? C.coral : C.cyan }}>{shuffle}</div>
  </div>
);
