import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtF, lf } from "../shared";

/* 开场：从「无状态」到「带着状态走」，四个数。 */

const Metric: React.FC<{ label: string; value: string; note: string; color: string; width: number }> = ({ label, value, note, color, width }) => (
  <Card label={label} accent={color} style={{ width, height: 262 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 46, color, lineHeight: 1.1, letterSpacing: -1.5, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <Body size={FT.meta} style={{ marginTop: 14 }}>{note}</Body>
  </Card>
);

export const SOpen: React.FC = () => {
  const m = M;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.28, 0.58, 0.84]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            上一集让每个位置自己去看；这一集让每个位置记住前面。
          </div>
          <Build at={lf("open", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Card label="上一集 · 无状态" accent={C.inkFaint} style={{ width: 875, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>注意力</div>
                <Body style={{ marginTop: 16 }}>每次都要看整条序列，位置之间两两打分。算完就丢，下一步从头再来。</Body>
                <K style={{ display: "block", marginTop: 16 }}>E10 · 式 (2.65) · 代价 T² 个分数</K>
              </Card>
              <Card label="这一集 · 带状态" accent={C.cyan} style={{ width: 875, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>循环</div>
                <Body style={{ marginTop: 16 }}>把走过的历史压进一个隐藏状态，每来一个新输入就更新一次，再往下传。</Body>
                <K style={{ display: "block", marginTop: 16 }}>式 (2.49) (2.50) · 第二章 p.32</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 690, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>同一个问题：过去的输入，怎么留到后面用？</div>
              <K style={{ display: "block", marginTop: 8 }}>代价压在梯度上：它必须沿时间一步一步回传</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            四个数，看到结尾你都能对上。
          </div>
          <Build at={lf("open", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Metric label="RNN 梯度传递率" value={fmtE(m.grad.decay19, 2)} note="零点五乘十九次：十九步以前的输入" color={C.cyan} width={426} />
              <Metric label="LSTM 传递率" value={fmtF(m.grad.transfer20, 3)} note="零点九九九乘二十次：加法路径" color={C.violet} width={426} />
              <Metric label="两者之比" value={fmtE(m.grad.ratio, 3)} note="同一件事，差了五个数量级" color={C.amber} width={426} />
              <Metric label="参数量" value={m.params.rnn.total + " / " + m.params.lstm.total + " / " + m.params.gru.total} note="RNN / LSTM / GRU，输入八维、隐藏十二维" color={C.coral} width={426} />
            </div>
          </Build>
          <Build at={lf("open", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 620, display: "flex", gap: 24 }}>
              <Stat label="判决实验 · 序列长度" accent={C.cyan} value={m.delay.T + " 步"} sub="每步只给一个符号，正一或负一" valueSize={56} style={{ width: 570, height: 190 }} />
              <Stat label="延迟" accent={C.violet} value={m.delay.ds.join(" / ")} sub="标签是往回第 d 步的符号" valueColor={C.violet} valueSize={56} style={{ width: 570, height: 190 }} />
              <Stat label="样本" accent={C.amber} value={m.delay.train + " + " + m.delay.test} sub="训练 + 测试，测试集独立生成" valueColor={C.amber} valueSize={56} style={{ width: 588, height: 190 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里三个式子，其余全是自己定的。
          </div>
          <Build at={lf("open", 0.61)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={52} style={{ color: C.ink }}>h_t = σ(W_xh · x_t + W_hh · h_t−1 + b_h)</Formula>
              <K style={{ display: "block", marginTop: 14 }}>式 (2.49) · 第二章 p.32；σ 在书里写作 tanh 或 ReLU，本仓取 tanh</K>
            </div>
          </Build>
          <Build at={lf("open", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 452, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>RNN：乘法链</Chip>
              <Chip color={C.violet}>LSTM：加法通路</Chip>
              <Chip color={C.amber}>GRU：门控插值</Chip>
              <Chip color={C.coral}>同一套超参</Chip>
            </div>
          </Build>
          <Build at={lf("open", 0.76)}>
            <div style={{ position: "absolute", left: PAD, top: 560, width: 1776 }}>
              <Stat label="检查与测试" accent={C.cyan} value={m.meta.checks.total + " 项检查 · 41 条断言"} sub={"零失败；全仓 " + m.meta.tests.suites + " 组 / " + m.meta.tests.asserts + " 条断言全绿"} valueColor={C.ink} style={{ height: 200 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看公式说的道理，再看十五次训练给的答案。
          </div>
          <Build at={lf("open", 0.87)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Card label="公式说" accent={C.violet} style={{ width: 875, height: 380 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>加法路径保信号</div>
                <Body style={{ marginTop: 16 }}>梯度沿 cell 回去只乘一个遗忘门，理论上可以传很远。这是结构给的便利。</Body>
              </Card>
              <Card label="实验说" accent={C.amber} style={{ width: 875, height: 380 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>长延迟都没学会</div>
                <Body style={{ marginTop: 16 }}>一百二十八条样本、四十轮上限，三个结构在四十步延迟上都离学会很远。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.93)}>
            <div style={{ position: "absolute", left: PAD, top: 740, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>
              这一集要讲的，就是这两句话中间的距离。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
