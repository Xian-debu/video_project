import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, det, fmtF, fmtP, pctOf, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Formula, Chip, K, Num, Verdict } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 12), pageAt("definitions", 26), pageAt("definitions", 32)];
  const g = M.params.gru;
  const l = M.params.lstm;
  const q = M.params.quantile;
  const extra = l.params - g.params;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：GRU */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="定义一 · GRU 单元" accent={C.cyan}>
              <Row name="更新门" value="z = σ(Wz·[x, h])" note="决定新状态换多少" width={960} />
              <Row name="重置门" value="r = σ(Wr·[x, h])" note="决定旧状态用多少" width={960} />
              <Row name="候选" value="h̃ = tanh(Wh·[x, r⊙h])" note="先把旧状态按 r 打折，再混合" width={960} />
              <Row name="状态" value="h′ = (1−z)⊙h + z⊙h̃" note="书上的式(4.35)给了这个混合，没给门的摆法" width={960} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              门的摆法按 Cho 等 2014 年的原始安排。换一种摆法，单元测试还能过：测试只锁混合本身与梯度。
            </Body>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{g.params} 参数</Chip>
              <Chip color={C.inkFaint}>{g.hidden} 维隐状态</Chip>
              <Chip color={C.inkFaint}>σ 与 tanh 各半</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="一个位置要几个数" accent={C.violet}>
              <Row name="权重" value="3 组" note="z / r / 候选，各一组" width={590} />
              <Row name="偏置" value="3 组" note="跟权重一一对应" width={590} />
              <Row name="输出" value="1 个 h" note="下一时刻靠自己" width={590} />
            </Card>
            <Card label="为什么不是 RNN" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>朴素 RNN 只有一条混合路径，梯度走一百步就没了。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：LSTM */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="定义二 · LSTM 细胞" accent={C.violet}>
              <Row name="门" value="i, f, o = σ(...)" note="输入、遗忘、输出，三个 sigmoid" width={960} />
              <Row name="候选" value="c̃ = tanh(...)" note="写进细胞状态的新内容" width={960} />
              <Row name="细胞" value="c′ = f⊙c + i⊙c̃" note="书上的式(4.34)" width={960} />
              <Row name="隐状态" value="h′ = o⊙tanh(c′)" note="门控读出来" width={960} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              细胞状态是一条直通线：门控写进去、擦掉、读出来。梯度顺着这条线走，所以能记更长。
            </Body>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <Chip color={C.violet}>{l.params} 参数</Chip>
              <Chip color={C.inkFaint}>{l.hidden} 维细胞状态</Chip>
              <Chip color={C.inkFaint}>式(4.34)</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="和 GRU 的差别" accent={C.cyan}>
              <Row name="记忆线" value="多一条 c" note="不被输出门污染" width={590} />
              <Row name="门数" value="3 个" note="GRU 是 2 个" width={590} />
              <Row name="参数" value={extra + " 个"} note="贵一点，记久一点" width={590} />
            </Card>
            <Card label="本集两个模型" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>GRU 和 LSTM 各练一个，同一批窗口，同一套注入。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：分数与阈值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <Card label="定义三 · 预测分数" accent={C.cyan}>
              <Formula size={50} note="式(4.14)：F 步预测的均方误差">
                {"s(x) = (1/F) · Σ (xᵢ − x̂ᵢ)²"}
              </Formula>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                F 等于一，就是一步误差。F 等于五，五步平均。平均把单点的信号摊薄。
              </Body>
            </Card>
            <Card label="定义四 · 报警阈值" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="取法" value={"训练段干净窗口的 " + fmtP(q)} note="分位数" width={960} />
              <Row name="判读" value="分数 > τ 就报警" note="测试段只读，不回填" width={960} />
              <Row name="危险" value="连续异常会脏了分位数" note="前提是干净窗口占多数" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="定义五 · 注入" accent={C.violet}>
              <Row name="尖峰" value={M.inject.spike.amp} note={M.inject.spike.span} width={590} />
              <Row name="相位" value={M.inject.phase.lag} note={M.inject.phase.how} width={590} />
              <Row name="个数" value={M.inject.count + " + " + M.inject.count} note={"占测试窗 " + pctOf(M.inject.rate)} width={590} />
            </Card>
            <Card label="真值" accent={C.cyan} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>只改未来窗的真值，历史窗保持干净 —— 修的是脏数据，不是脏历史。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：数据口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="五张定义，落到同一套口径上" accent={C.cyan}>
              <Row name="历史窗" value={M.windows.history + " 天"} note="前一百天" width={970} />
              <Row name="未来窗" value={M.windows.futures.join(" / ") + " 天"} note="两个 F 各跑一遍" width={970} />
              <Row name="采样步长" value={String(M.windows.stride)} note="训练每十六个窗取一个" width={970} />
              <Row name="标准化" value="训练段均值方差" note="测试段只看不学" width={970} />
              <Row name="阈值" value={fmtF(det("f1").tau, 4)} note={"训练段 " + fmtP(q) + " 分位"} width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="单位与记号" accent={C.violet}>
              <Row name="h" value="隐状态" note="GRU 与 LSTM 输出" width={590} />
              <Row name="c" value="细胞状态" note="只有 LSTM 有" width={590} />
              <Row name="z / r" value="两个门" note="取值零到一" width={590} />
              <Row name="σ" value="sigmoid" note="把数压进门控区间" width={590} />
            </Card>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>式(4.34)</Chip>
              <Chip color={C.violet}>式(4.35)</Chip>
              <Chip color={C.inkFaint}>式(4.14)</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
