import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, K, Formula, Verdict, Stat, unitColor, Strip } from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：残差为什么能当分数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 830 }}>
            <Formula size={56} color={C.cyan}>
              e<sub>t</sub> = y<sub>t</sub> − ŷ<sub>t</sub>
            </Formula>
            <Formula size={56} color={C.cyan} style={{ marginTop: 18 }}>
              s<sub>t</sub> = |e<sub>t</sub>| / σ̂
            </Formula>
            <Body style={{ marginTop: 26, width: 800 }}>
              ARIMA 拟合训练段，再逐日预测测试段。预测值减真实值就是残差；除以训练段标准差，是为了让不同年份的误差可比。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 960, top: 282, width: 900 }}>
            <Card label="两个隐藏前提" accent={C.coral} pad={26}>
              <Row name="前提一：残差可比" value="σ̂ 固定" note="波动大的年份，误差天然大。不标准化，阈值就跟着波动走。" />
              <Row name="前提二：模型别吃异常" value="阶数克制" note="拟合得越乖，越容易把尖峰学进去；异常就变成了正常。" />
              <Row name="落地" value="训练定阈值" note="阈值取训练分数 99 分位，测试段一个数都不进阈值。" color={C.cyan} />
            </Card>
            <Body style={{ marginTop: 22 }}>
              书里只有一句「用 ARIMA 残差当异常分数」，剩下全是口径：用价格还是收益，用预测残差还是拟合残差，阈值怎么定。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：邻居的隐含选择 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 840 }}>
            <Formula size={50} color={C.violet}>
              d(i, j) = √(2m(1 − ρ̂<sub>ij</sub>))
            </Formula>
            <Body style={{ marginTop: 24, width: 810 }}>
              z 归一化之后，两条子序列的欧氏距离可以写成相关系数的一减。距离越大，形状越不像。
              每个窗口的最近邻距离记成 P(i)；P 最大的那一段，就是全段最孤独的片段。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Verdict ok={false} label="书里只有一个词：discord" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 980, top: 282, width: 890 }}>
            <Card label="三个隐含选择" accent={C.violet} pad={26}>
              <Row name="窗口多长" value="m = 100" note="一个窗口要盖住一种形态；太长会把两种形态平均掉。" />
              <Row name="多近算自己" value="excl = 25" note="不排除，最近的邻居永远是它自己，距离全零。" />
              <Row name="分数怎么落到某天" value="取 min" note="一个点被多个窗口覆盖，取最小距离，即「最像它的邻居有多近」。" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：数据与注入 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 870 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <Stat label="样本" value="3,996 行" sub={M.data.start + " – " + M.data.end} style={{ width: 270 }} />
              <Stat label="训练 / 测试" value="2,668 / 1,328" sub={"测试从 " + M.data.testStart} style={{ width: 300 }} />
            </div>
            <Body style={{ marginTop: 26, width: 840 }}>
              复权收盘价转对数收益。二十段尖峰，单点或连续三点，五到十个标准差；二十段相位，把六十点窗口前后两半对调。
              真值按点算，共六百六十一点，占测试段四成九。
            </Body>
            <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              停牌对照：收益置零 240 天（测试第 {M.inject.flatStart} 点起），模拟一段没有任何行情的横线。
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 286, width: 860 }}>
            <K>真值 661 点 · 停牌 240 天 · 测试 1328 天</K>
            <div style={{ marginTop: 16 }}>
              <Strip idx={M.series.truthIdx} total={M.data.test} width={820} height={20} color={C.coral} flat={{ start: M.inject.flatStart, len: M.inject.flatLen, color: C.amber }} />
            </div>
            <div style={{ marginTop: 26 }}>
              <Row name="点尖峰" value="20 段 / 40 点" note="5–10σ，单点或连续三点，符号随机。" />
              <Row name="相位平移" value="20 段 / 60 点" note="窗口内前后两半对调，边际分布不变。" color={C.violet} />
              <Row name="停牌" value="1 段 / 240 天" note="收益全零，价格走成直线。" color={C.amber} />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
