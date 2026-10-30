import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt, TimeAxis } from "../shared";

/** 问题：同一批点，两种切法；时间切分 0 泄漏，随机切分 2 条。 */
export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 57);
  const s = M.split;
  return (
    <Scene id="problem">
      <Head kicker="02 / 一件真事" title="一次随机切，误差掉两个数量级" goal="集合大小不变，顺序全错" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 940 }}>
        <Build at={b(0)}>
          <Card label="两千六百个交易日 · 同一批点 · 只换切法" accent={C.cyan} style={{ width: 940, height: 342 }} pad={20}>
            <AxisRow id="problem" mode="chrono" label="时间切分" value={s.leakProbe.chronoMse} color={C.cyan} at={b(16)}
              counts={[s.train, s.val, s.test]} />
            <div style={{ height: 1, background: C.panelLine, margin: "12px 0" }} />
            <AxisRow id="problem" mode="shuffle" label="随机切分" value={s.leakProbe.shuffleMse} color={C.coral} at={b(28)}
              counts={[s.shuffle.train, s.shuffle.val, s.shuffle.test]} />
          </Card>
        </Build>

        <Build at={b(35)} style={{ marginTop: 16 }}>
          <Card label="泄漏检测器 · 三条规矩逐个查" accent={C.violet} style={{ width: 940, height: 236 }} pad={20}>
            <CheckRow ok label="时间切分" count={s.chronoLeaks} text="顺序合法，未来没有进训练集" />
            <CheckRow label="随机切分" count={s.shuffle.leaks} text={s.shuffle.leakKinds.join(" · ")} />
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginTop: 12 }}>
              leak = order(train, val) ∨ order(val, test) ∨ overlap
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1050, top: 292, width: 780 }}>
        <Build at={b(3)}>
          <Card label="同一份预测 · 两个分数" accent={C.coral} style={{ width: 780, height: 342 }} pad={22}>
            <div style={{ display: "flex", gap: 26 }}>
              <div style={{ flex: 1 }}>
                <K>时间切分</K>
                <div style={{ marginTop: 4 }}><Num value={s.leakProbe.chronoMse} digits={3} size={FT.num} color={C.cyan} /></div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>真实误差</div>
              </div>
              <div style={{ flex: 1 }}>
                <K>随机切分</K>
                <div style={{ marginTop: 4 }}><Num value={s.leakProbe.shuffleMse} digits={4} size={FT.num} color={C.coral} /></div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>考卷泄题</div>
              </div>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "18px 0" }} />
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <K>好看倍数</K>
                <div><Num value={s.leakProbe.ratio} digits={1} size={FT.num} color={C.coral} /><span style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.coral }}>×</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <K>测试点里，训练集有更晚观测</K>
                <div><Num value={s.shuffle.futureTestPoints} size={FT.num} color={C.coral} /></div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(39)} style={{ marginTop: 16 }}>
          <Card label="同一条断言，两种答案" accent={C.amber} style={{ width: 780, height: 236 }} pad={22}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.ink, lineHeight: 1.5 }}>
              答案差在顺序。
            </div>
            <Body size={FT.body} style={{ marginTop: 10, lineHeight: 1.65 }}>
              切分先于模型。<br />
              先切时间，再谈模型。
            </Body>
          </Card>
        </Build>
      </div>

      <Build at={b(48)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>未来不能倒流进训练集。</div>
      </Build>
    </Scene>
  );
};

const AxisRow: React.FC<{
  id: string; mode: "chrono" | "shuffle"; label: string; value: number; color: string;
  at: number; counts: [number, number, number];
}> = ({ id, mode, label, value, color, at, counts }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>{label}</div>
      <div><Num value={value} digits={mode === "chrono" ? 3 : 4} size={FT.num} color={color} /></div>
    </div>
    <TimeAxis w={890} h={86} at={at} mode={mode} trainPct={0.7} valPct={0.1} testPct={0.2} />
    <div style={{ display: "flex", gap: 18, marginTop: -6 }}>
      <Legend c={C.cyan} text={"训练 " + counts[0]} />
      <Legend c={C.violet} text={"验证 " + counts[1]} />
      <Legend c={C.amber} text={"测试 " + counts[2]} />
    </div>
  </div>
);

const Legend: React.FC<{ c: string; text: string }> = ({ c, text }) => (
  <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
    <span style={{ display: "inline-block", width: 16, height: 8, background: c, marginRight: 6 }} />{text}
  </span>
);

const CheckRow: React.FC<{ label: string; count: number; text: string; ok?: boolean }> = ({ label, count, text, ok }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
    <div style={{ width: 130, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{label}</div>
    <div style={{ width: 90 }}>
      <Mono size={FT.num} color={ok ? C.cyan : C.coral}>{String(count).padStart(2, "0")}</Mono>
      <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}> 条</span>
    </div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: ok ? C.inkFaint : C.coral }}>{text}</div>
    <div style={{ marginLeft: "auto" }}><span style={{ fontFamily: FONT.mono, fontSize: FT.label, color: ok ? C.cyan : C.coral }}>{ok ? "PASS" : "FAIL"}</span></div>
  </div>
);
