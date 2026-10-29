import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, beatAt } from "../shared";

const STAGES = [
  {
    no: "01", name: "统计学习", accent: C.cyan,
    bias: "偏置写在方程里",
    models: "ARIMA · ETS · Theta · VAR",
    good: "理论基础稳，参数可解释",
    bad: "难处理非线性与多变量",
  },
  {
    no: "02", name: "机器学习", accent: C.violet,
    bias: "偏置写在特征里",
    models: "XGBoost · GBRT · Random Forest · LightGBM",
    good: "模型多样，可处理非线性",
    bad: "依赖特征工程，容易过拟合",
  },
  {
    no: "03", name: "深度学习", accent: C.amber,
    bias: "偏置写在结构里",
    models: "MLP · CNN · RNN · TCN · GCN · Transformer",
    good: "自动表征，能抓长程与时空依赖",
    bad: "计算开销大，依赖数据量",
  },
  {
    no: "04", name: "预训练大模型", accent: C.coral,
    bias: "偏置写在数据里",
    models: "TimesFM · Moirai · Chronos · TimeGPT · MOMENT · UniTS",
    good: "泛化强，多任务适用",
    bad: "数据与算力需求大，可解释性差",
  },
];

export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 30);
  return (
    <Scene id="intuition">
      <Head kicker="03 / 四次阶段" title="不是替代，是偏置搬家" goal="从方程到特征，到结构，再到数据：每一次迁移换的是先验写在哪" />

      <div style={{ position: "absolute", left: PAD, top: 264, width: 1776, display: "flex", gap: 18 }}>
        {STAGES.map((s, i) => (
          <Build key={s.no} at={b(1 + i * 3)}>
            <Card label={"阶段 " + s.no} accent={s.accent} pad={18} style={{ width: 426, height: 392, position: "relative" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.2 }}>{s.name}</div>
              <div style={{ marginTop: 10 }}>
                <Chip color={s.accent}>{s.bias}</Chip>
              </div>
              <Body size={FT.body} color={C.inkDim} style={{ marginTop: 18, lineHeight: 1.55 }}>{s.models}</Body>
              <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
                <div style={{ borderTop: "1px solid " + C.panelLine, paddingTop: 8 }}>
                  <Body size={FT.meta} color={C.inkDim}>{"优势 · " + s.good}</Body>
                  <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 4 }}>{"代价 · " + s.bad}</Body>
                </div>
              </div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 676, width: 1776 }}>
        <Build at={b(18)}>
          <Card accent={C.cyan} pad={22} style={{ width: 1776, height: 196 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <Body size={FT.lead} color={C.ink}>{"三次迁移，搬的都是同一件事"}</Body>
              <K>{"归纳偏置没有消失，只是从一处挪到另一处"}</K>
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 14 }}>
              {[
                ["01", "方程 → 特征", "统计模型假设线性、平稳；机器学习把假设交给人工特征。"],
                ["02", "特征 → 结构", "深度网络不再手写特征，用卷积、循环、注意力把假设写进结构。"],
                ["03", "结构 → 数据", "预训练模型把先验放进大规模语料，再用少量任务数据适配。"],
              ].map(([n, t, d]) => (
                <div key={n} style={{ width: 560 }}>
                  <Mono size={FT.micro} color={C.cyan}>{n}</Mono>
                  <Body size={FT.body} color={C.ink} style={{ marginTop: 2 }}>{t}</Body>
                  <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 2, lineHeight: 1.5 }}>{d}</Body>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 890, width: 1776 }}>
        <Build at={b(27)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <Body size={FT.lead} color={C.ink}>{"四个阶段不是四个时代。"}</Body>
            <K>{"书中只给方法表，没有给逐年时间线；这一集也不补年份。"}</K>
          </div>
        </Build>
      </div>
    </Scene>
  );
};