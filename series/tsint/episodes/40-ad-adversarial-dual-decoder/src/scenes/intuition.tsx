import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, modelKeys, modelColor, modelShort, pagesOf, Pages, Scene, SceneHead,
  Card, Body, Stat, Row, Verdict, Chip, LinePlot, Bars, fmtInt, fmtP,
} from "../shared";

export const SIntuition: React.FC = () => {
  const at = pagesOf("intuition");
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：USAD 训练曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              对抗一开始，损失就翘起来。
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 372, width: 1120 }}>
            <LinePlot
              series={[{ values: M.usad.l1, color: C.cyan, name: "L1（重建）" }]}
              width={1100}
              height={420}
              title="USAD 训练：前 20 轮暖启动，后 20 轮交替对抗"
              vlines={[{ i: 20, color: C.amber, label: "对抗开始" }]}
              yMin={0}
              yFmt={(v) => fmtInt(v)}
            />
          </div>
          <div style={{ position: "absolute", left: 1240, top: 372, width: 620 }}>
            <Stat label="暖启动二十轮" value={"L1 " + fmtInt(M.usad.l1First) + " → " + fmtInt(M.usad.l1[19])} sub="下降五个多点，两个解码器都学会了重建" valueSize={40} />
            <Stat label="对抗二十轮末值" value={fmtInt(M.usad.l1Last)} sub={"比暖启动末值高 " + (M.usad.l1Last / M.usad.l1[19]).toFixed(1) + " 倍"} accent={C.coral} style={{ marginTop: 16 }} valueSize={40} />
            <Card label="这不是训练坏了" accent={C.amber} pad={22} style={{ marginTop: 16 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                L2 没有下界，两个解码器目标相反，共享编码器被两边拉扯。曲线每次翘起来，都是第二个解码器刚学会「重建第一个的输出」。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：DAGMM 能量 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              能量分数几乎是一条直线。
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 372, width: 1120 }}>
            <LinePlot
              series={[{ values: M.series.dagmm, color: C.violet, name: "能量分数（越高越异常）" }]}
              width={1100}
              height={420}
              from={100}
              hlines={[{ v: md("dagmm").tau, color: C.coral, label: "τ = " + md("dagmm").tau.toFixed(2) }]}
              title="DAGMM 在测试段的逐窗能量（前 100 窗热身不计）"
              yFmt={(v) => v.toFixed(1)}
            />
          </div>
          <div style={{ position: "absolute", left: 1240, top: 372, width: 620 }}>
            <Stat label="测试段报警" value={fmtInt(md("dagmm").tp + md("dagmm").fp) + " 个"} sub={"阈值 " + md("dagmm").tau.toFixed(2) + " 落在分布中段，报警量很大"} valueSize={40} />
            <Card label="三类窗口拉不开" accent={C.violet} pad={22} style={{ marginTop: 16 }}>
              <Row name="尖峰" value={M.kind.dagmm.spike.toFixed(3)} note="中位能量" />
              <Row name="漂移" value={M.kind.dagmm.drift.toFixed(3)} note="中位能量" />
              <Row name="干净" value={M.kind.dagmm.clean.toFixed(3)} note={"差 " + Math.abs(M.kind.dagmm.spike - M.kind.dagmm.clean).toFixed(3)} />
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8, marginTop: 10 }}>
                三类中位数只差零点一，阈值一划全在下面或者全在上面。方法能报「今天有点怪」，报不出「怪在哪」。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：集成在测试段失灵 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              五个成员，一半失灵。
            </div>
            <Body style={{ marginTop: 22, width: 840 }}>
              多 AE 在验证段的 F1 是零点二八，测试段掉到零点零六。五个成员里只要有三个对测试段的分数偏高，中位数就会被抬到阈值以上，
              或者反过来——总之不是「五个都错」，而是「错得不一样」时，中位数没有把差异抹平，反而把报警压没了。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Bars
                width={820}
                rowH={66}
                items={modelKeys.map((k) => ({ label: modelShort[k], value: md(k).f1, text: md(k).f1.toFixed(4), color: modelColor[k] }))}
                unit="测试段 F1（阈值均来自验证段）"
              />
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
              <Chip color={C.coral}>集成迁移失败：掉 0.2 以上</Chip>
              <Chip color={C.amber}>中位数不等于更稳</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <LinePlot
              series={[{ values: M.series.ens, color: C.amber, name: "中位重建误差" }]}
              width={820}
              height={420}
              from={100}
              hlines={[{ v: md("ens").tau, color: C.coral, label: "τ = " + md("ens").tau.toFixed(3) }]}
              title="多 AE 中位数分数（测试段）"
              yFmt={(v) => v.toFixed(2)}
            />
            <Card label="验证段 vs 测试段" accent={C.amber} pad={20} style={{ marginTop: 16 }}>
              <Row name="验证段 F1" value={md("ens").f1Val.toFixed(4)} note="阈值在这里挑的" />
              <Row name="测试段 F1" value={md("ens").f1.toFixed(4)} note={"只报警 " + (md("ens").tp + md("ens").fp) + " 次，命中 " + md("ens").tp} color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
