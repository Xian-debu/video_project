import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, Formula, K, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, lf } from "../shared";

/* 定义：三个结构、同一套 Cfg；参数从一处反推。 */

export const SDefinitions: React.FC = () => {
  const m = M;
  const p = m.params;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.28, 0.55, 0.8]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个模块共用一套配置：输入八维、隐藏十二维、输出一维。
          </div>
          <Build at={lf("definitions", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 292 }}>
              <Formula size={40} style={{ color: C.cyan }}>h_t = σ(W_xh x_t + W_hh h_t−1 + b_h)　　y_t = φ(W_hy h_t + b_y)</Formula>
              <K style={{ display: "block", marginTop: 10 }}>式 (2.49) (2.50) · tanh 作 σ，恒等作 φ，h_0 = 0</K>
            </div>
          </Build>
          <Build at={lf("definitions", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 404, width: 1776 }}>
              <Card label="RNN 的参数 · 一块循环体加一个输出头" accent={C.cyan} style={{ width: 1776, height: 430 }}>
                <Row name="W_xh" value="12 × 8 = 96" note="输入到隐藏" width={1710} />
                <Row name="W_hh" value="12 × 12 = 144" note="隐藏到隐藏，梯度沿它连乘" width={1710} />
                <Row name="b_h" value="12" note="一个偏置" width={1710} />
                <Row name="循环体" value={String(p.rnn.body)} note="96 + 144 + 12，后面所有参数比的基准" color={C.cyan} width={1710} />
                <Row name="输出头 W_hy + b_y" value={p.rnn.head + "（12 + 1）"} note="三个结构完全一样" width={1710} />
                <Row name="合计" value={String(p.rnn.total)} note="265 = 252 + 13" color={C.cyan} width={1710} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            LSTM 把一次更新拆成四个门，共享一套四 H 的布局。
          </div>
          <Build at={lf("definitions", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={38} style={{ color: C.violet }}>f, i, o = σ(W x_t + U h_t−1 + b)　　c̃ = tanh(W_c x_t + U_c h_t−1 + b_c)</Formula>
              <K style={{ display: "block", marginTop: 10 }}>式 (2.51)–(2.53) (2.55)</K>
            </div>
          </Build>
          <Build at={lf("definitions", 0.36)}>
            <div style={{ position: "absolute", left: PAD, top: 404, display: "flex", gap: 26 }}>
              <Card label="四个门的权重布局" accent={C.violet} style={{ width: 1120, height: 400 }}>
                <Row name="每门" value="252" note="12 × 8 + 12 × 12 + 12，即 W 96 + U 144 + b 12" width={1060} />
                <Row name="四门" value={"252 × 4 = " + p.lstm.body} note="拼成 4H 的偏置与权重，门顺序 f、i、o、c̃" color={C.violet} width={1060} />
                <Row name="输出头" value={"+ " + p.lstm.head} note="与 RNN/GRU 同一个输出头" width={1060} />
                <Row name="合计" value={String(p.lstm.total)} note="1021 = 1008 + 13" color={C.violet} width={1060} />
              </Card>
              <Card label="书里的空白 · errata E05" accent={C.coral} style={{ width: 630, height: 400 }}>
                <Row name="原文" value="式体为空" note="只有编号；渲染页确认那一行确实没有内容" color={C.coral} width={580} />
                <Row name="补全" value="四门同形" note="共享一套 4H 的布局" color={C.violet} width={580} />
                <Row name="初值" value="b_f = 1" note="遗忘门偏置取一，其余取零" width={580} />
                <Row name="状态" value="已核实" note="errata E05 · SELF-AUTH A24" color={C.cyan} width={580} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            GRU 只有两组门，加一个候选。
          </div>
          <Build at={lf("definitions", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={36} style={{ color: C.amber }}>z, r = σ(W x_t + U h_t−1 + b)　　h̃ = tanh(W_h x_t + U_h (r ⊙ h_t−1) + b_h)</Formula>
              <K style={{ display: "block", marginTop: 10 }}>式 (2.58)–(2.61) · 注意 r 只乘在 h_t−1 上</K>
            </div>
          </Build>
          <Build at={lf("definitions", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 404, width: 1776 }}>
              <Card label="GRU 的参数 · 三组独立的权重" accent={C.amber} style={{ width: 1776, height: 400 }}>
                <Row name="更新门 z" value="252" note="12 × 8 + 12 × 12 + 12，独立一套" width={1710} />
                <Row name="重置门 r" value="252" note="不是共享权重，另外一套" width={1710} />
                <Row name="候选 h̃" value="252" note="它的输入是 r ⊙ h_t−1，不是 h_t−1" width={1710} />
                <Row name="循环体" value={String(p.gru.body)} note="252 × 3 = 756" color={C.amber} width={1710} />
                <Row name="合计" value={String(p.gru.total)} note="769 = 756 + 13，输出头依旧三处相同" color={C.amber} width={1710} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            参数差别全在循环体里，输出头三处一样。
          </div>
          <Build at={lf("definitions", 0.83)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1120 }}>
              <Card label="参数量 · 同一套 Cfg（D = 8、H = 12、O = 1）" accent={C.cyan} style={{ width: 1120, height: 400 }}>
                <Bars
                  width={1060}
                  max={1100}
                  rowH={96}
                  at={lf("definitions", 0.85)}
                  items={[
                    { label: "RNN", value: p.rnn.total, text: String(p.rnn.total), color: C.cyan },
                    { label: "LSTM", value: p.lstm.total, text: String(p.lstm.total), color: C.violet },
                    { label: "GRU", value: p.gru.total, text: String(p.gru.total), color: C.amber },
                  ]}
                />
                <K style={{ display: "block", marginTop: 14 }}>输出头 13 相同，所以差别就是 252 / 1008 / 756</K>
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 1160, top: 312, display: "flex", flexDirection: "column", gap: 18 }}>
              <Stat label="RNN 循环体" accent={C.cyan} value={String(p.rnn.body)} sub="96 + 144 + 12" valueSize={56} style={{ width: 616, height: 122 }} />
              <Stat label="LSTM 循环体" accent={C.violet} value={String(p.lstm.body)} sub="252 × 4" valueColor={C.violet} valueSize={56} style={{ width: 616, height: 122 }} />
              <Stat label="GRU 循环体" accent={C.amber} value={String(p.gru.body)} sub="252 × 3" valueColor={C.amber} valueSize={56} style={{ width: 616, height: 122 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.92)}>
            <div style={{ position: "absolute", left: PAD, top: 760, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>维数只从一处反推</Chip>
              <Chip color={C.violet}>形状错误直接报错</Chip>
              <Chip color={C.amber}>扁平 / 反扁平都可逆</Chip>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
