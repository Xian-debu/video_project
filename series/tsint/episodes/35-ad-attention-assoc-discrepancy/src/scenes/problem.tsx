import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Formula, Chip, K, Heat, CodeBlock } from "../shared";

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 10), pageAt("problem", 20)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：重构误差只量数值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 960 }}>
            <Card label="自编码器在做什么" accent={C.cyan}>
              <Formula size={54} note="输入一个窗口，压到低维，再还原；误差就是异常分">
                {"L = ‖x − D(E(x))‖²"}
              </Formula>
            </Card>
            <Card label="把一段形状换掉之后" accent={C.coral} style={{ marginTop: 22 }}>
              <Row name="均值" value="不变" note="整段替换前先逐段标准化" width={910} />
              <Row name="方差" value="不变" note="标准化之后，尺度也一致" width={910} />
              <Row name="重构误差" value="很小" note="网络完全学得会这种形状" width={910} />
              <Row name="异常分" value="漏报" note="不是网络不够大，是目标函数里没这一项" width={910} color={C.coral} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1090, top: 292, width: 760 }}>
            <CodeBlock
              title="重构损失看不见的东西"
              width={720}
              lines={[
                { t: "x = [ ... 100 个标准化后的点 ... ]" },
                { t: "" },
                { t: "损失 = Σ (x_i - x̂_i)^2          // 只量数值", hi: true },
                { t: "" },
                { t: "// 关系被换掉时：" },
                { t: "//   数值  、  重构误差  ？" },
                { t: "" },
                { t: "// 损失里没有「谁和谁像」这一项", dim: true },
                { t: "// 所以它压根没被要求看见", dim: true },
              ]}
            />
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 720 }}>
              这不是这一集的假设，是重构类方法的结构性盲区：目标函数里没有关系项，分数就不会对关系变化敏感。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：注意力矩阵的三种签名 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1776 }}>
            <div style={{ display: "flex", gap: 44 }}>
              {[
                { m: M.heat.pixClean, t: "干净窗", d: "权重贴着对角线，铺成一条带", c: C.cyan, band: M.heat.bandShareClean, out: M.heat.outMassClean, ent: M.heat.entClean },
                { m: M.heat.pixSpike, t: "尖峰窗", d: "被注入的那一行坍缩成一个点", c: C.coral, band: M.heat.bandShareSpike, out: M.heat.outMassSpike, ent: M.heat.entSpike },
                { m: M.heat.pixShape, t: "形状窗", d: "带子被抹平，能量散到矩阵四周", c: C.violet, band: M.heat.bandShareShape, out: M.heat.outMassShape, ent: M.heat.entShape },
              ].map((h) => (
                <div key={h.t} style={{ width: 548 }}>
                  <Heat matrix={h.m} labels={[]} cell={10} gap={2} labelW={0} min={0} max={1} />
                  <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.h2, color: h.c }}>{h.t}</div>
                  <Body size={FT.meta} style={{ marginTop: 4 }}>{h.d}</Body>
                  <div style={{ display: "flex", gap: 26, marginTop: 10 }}>
                    <div><K>带内质量</K><div style={{ fontFamily: FONT.mono, fontSize: FT.mono, color: C.ink }}>{h.band.toFixed(3)}</div></div>
                    <div><K>带外质量</K><div style={{ fontFamily: FONT.mono, fontSize: FT.mono, color: C.ink }}>{h.out.toFixed(3)}</div></div>
                    <div><K>行熵</K><div style={{ fontFamily: FONT.mono, fontSize: FT.mono, color: C.ink }}>{h.ent.toFixed(3)}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：三个单元的分工 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
            <Card label="关联差异" accent={C.cyan}>
              <Row name="参照" value="高斯先验" note="近的点权重大" width={510} />
              <Row name="尺子" value="对称 KL" note="逐行比分布" width={510} />
              <Row name="训练" value="不需要" note="零可学参数" width={510} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 680, top: 292, width: 560 }}>
            <Card label="次邻域遮罩" accent={C.amber}>
              <Row name="先池化" value="环形平均" note="左右邻域先混" width={510} />
              <Row name="再比较" value="同一个先验" note="池化后仍逐行比" width={510} />
              <Row name="参数" value="两个" note="半宽 1 / 5" width={510} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1288, top: 292, width: 560 }}>
            <Card label="两阶段焦点" accent={C.violet}>
              <Row name="第一阶段" value="压成隐向量" note="100 → 32" width={510} />
              <Row name="第二阶段" value="带着焦点重建" note="32 → 64 → 100" width={510} />
              <Row name="参数" value="25,896 个" note="手写梯度" width={510} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: 1776 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <Chip color={C.cyan}>不需要训练 · 最准</Chip>
              <Chip color={C.amber}>只两个参数 · 最全</Chip>
              <Chip color={C.violet}>要训练 · 平均精度最高</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
