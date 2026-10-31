import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, fmtE, fmtF, fmtInt, lf } from "../shared";

/* 验证：手算三档、门恒等式与传递率、判决表、计数。 */

const MODEL_COLOR: Record<string, string> = { rnn: C.cyan, lstm: C.violet, gru: C.amber };

const Cell: React.FC<{ v: number; epochs: number; color: string }> = ({ v, epochs, color }) => (
  <div style={{ width: 340, padding: "10px 0" }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 40, color: v <= 0.52 ? C.inkFaint : color, letterSpacing: -0.5 }}>
      {fmtF(v, 4)}
    </div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>
      {epochs < 40 ? "第 " + epochs + " 轮早停" : epochs + " 轮"}
    </div>
  </div>
);

export const SVerification: React.FC = () => {
  const m = M;
  const g = m.grad;
  const h = m.hand;
  const d = m.delay;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.3, 0.56, 0.82]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一档：最小的网络，手算一遍，再让程序对。
          </div>
          <Build at={lf("verification", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Card label="RNN · D = H = 1" accent={MODEL_COLOR.rnn} style={{ width: 570, height: 474 }}>
                <KV k="权重" v="W_xh = 2，W_hh = 0.5" note="输入 0.3，旧状态 0" />
                <KV k="pre" v="0.6" note="2 × 0.3 + 0.5 × 0" color={MODEL_COLOR.rnn} />
                <KV k="h" v={fmtF(h.rnn.h, 6)} note="tanh 0.6，断言到最后一位" color={MODEL_COLOR.rnn} />
                <KV k="测试" v="RnnSpec" note="单步黄金值与参数 265 都钉住" />
              </Card>
              <Card label="LSTM · 只剩偏置" accent={MODEL_COLOR.lstm} style={{ width: 570, height: 474 }}>
                <KV k="偏置" v="0.5 / −0.3 / 0.2 / 0.7" note="权重与输入全取零" />
                <KV k="f / i / o" v={fmtF(h.lstm.f, 3) + " / " + fmtF(h.lstm.i, 3) + " / " + fmtF(h.lstm.o, 3)} note="三个门，同一组偏置形状" color={MODEL_COLOR.lstm} />
                <KV k="候选 c̃" v={fmtF(h.lstm.cg, 6)} note="tanh 0.7" />
                <KV k="c → h" v={fmtF(h.lstm.c, 6) + " → " + fmtF(h.lstm.h, 6)} note="i ⊙ 候选，再乘 o ⊙ tanh" color={MODEL_COLOR.lstm} />
              </Card>
              <Card label="GRU · 两门一候选" accent={MODEL_COLOR.gru} style={{ width: 570, height: 474 }}>
                <KV k="输入" v="x = 0.5，h_t−1 = 0.4" note="权重取 0.6 / 0.8 一类的固定值" />
                <KV k="z / r" v={fmtF(h.gru.z, 4) + " / " + fmtF(h.gru.r, 4)} note="更新门与重置门" color={MODEL_COLOR.gru} />
                <KV k="候选 h̃" v={fmtF(h.gru.hh, 6)} note="tanh(0.47) 量级" />
                <KV k="h" v={fmtF(h.gru.h, 6)} note="(1 − z) 乘旧状态 + z 乘候选" color={MODEL_COLOR.gru} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.16)}>
            <div style={{ position: "absolute", left: PAD, top: 812, display: "flex", alignItems: "center", gap: 20 }}>
              <Chip color={C.cyan}>先手算，再让程序对</Chip>
              <Body size={FT.meta}>三个值都断言到 1e−9 的相对误差，不是从程序里抄回来的</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二、三档：门恒等式与梯度传递率，都是解析值。
          </div>
          <Build at={lf("verification", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 875 }}>
              <Card label="门恒等式 · 最高偏差是双精度的舍入上限" accent={C.violet} style={{ width: 875, height: 384 }}>
                <Formula size={36} style={{ color: C.violet }}>σ(z) + σ(−z) = 1</Formula>
                <div style={{ height: 16 }} />
                <Row name="实测最大偏差" value={fmtE(g.gateDev, 2)} note="二点二乘十的负十六，等于精确成立" color={C.violet} width={815} />
                <Row name="断言阈值" value="1e−12" note="Test 里留了四个数量级的余量" width={815} />
                <Row name="意义" value="门控的稳态没有漂移" note="否则长时间循环会累积误差" width={815} />
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 905, top: 300, width: 871 }}>
              <Card label="梯度传递率 · 解析，不依赖任何训练" accent={C.cyan} style={{ width: 871, height: 384 }}>
                <Row name="0.5 ^ 19" value={fmtE(g.decay19, 4)} note="朴素连乘十九步之后" color={C.coral} width={811} />
                <Row name="0.999 ^ 20" value={fmtF(g.transfer20, 6)} note="遗忘门接近一，二十步的 cell 传递" color={C.cyan} width={811} />
                <Row name="比值" value={fmtInt(g.ratio) + " 倍"} note="五个数量级的差距" color={C.cyan} width={811} />
                <Row name="来源" value="rnnDecay / lstmCellTransfer" note="两个函数各自独立算出，测试里对齐" width={811} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.44)}>
            <div style={{ position: "absolute", left: PAD, top: 720, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "18px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>这两个数在任何训练发生之前就定了：它们说的是「路径能传多远」，不是「模型学没学会」。</div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第四档是判决表：十五次训练，五个延迟，三个模型。
          </div>
          <Build at={lf("verification", 0.59)}>
            <div style={{ position: "absolute", left: PAD, top: 296, width: 1220 }}>
              <div style={{ display: "flex", borderBottom: "1px solid " + C.panelLine, paddingBottom: 8 }}>
                <div style={{ width: 200, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>往回延迟</div>
                <div style={{ width: 340, fontFamily: FONT.sans, fontSize: FT.meta, color: C.cyan }}>RNN</div>
                <div style={{ width: 340, fontFamily: FONT.sans, fontSize: FT.meta, color: C.violet }}>LSTM</div>
                <div style={{ width: 340, fontFamily: FONT.sans, fontSize: FT.meta, color: C.amber }}>GRU</div>
              </div>
              {d.table.map((r, i) => (
                <Build key={r.d} at={lf("verification", 0.6 + i * 0.035)}>
                  <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid " + C.panelLine }}>
                    <div style={{ width: 200 }}>
                      <div style={{ fontFamily: FONT.sans, fontSize: 30, color: C.ink }}>{r.d} 步</div>
                      <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{m.delay.T} 步序列</div>
                    </div>
                    <Cell v={r.rnn.acc} epochs={r.rnn.epochs} color={MODEL_COLOR.rnn} />
                    <Cell v={r.lstm.acc} epochs={r.lstm.epochs} color={MODEL_COLOR.lstm} />
                    <Cell v={r.gru.acc} epochs={r.gru.epochs} color={MODEL_COLOR.gru} />
                  </div>
                </Build>
              ))}
            </div>
          </Build>
          <Build at={lf("verification", 0.74)}>
            <div style={{ position: "absolute", left: PAD + 1250, top: 296, display: "flex", flexDirection: "column", gap: 20 }}>
              <Card label="随机基线" accent={C.inkDim} style={{ width: 526, height: 236 }}>
                <Row name="基线" value={fmtF(d.base, 1)} note="蒙对一半" width={470} />
                <Row name="抽样标准差" value={fmtF(d.sd, 3)} note={"1 / 2√" + d.test} width={470} />
                <Row name="LSTM 四十步" value={fmtF(d.z.lstm40, 2) + " σ"} note="弱信号，仍在带外" color={MODEL_COLOR.lstm} width={470} />
                <Row name="GRU 四十步" value={fmtF(d.z.gru40, 2) + " σ"} note="在噪声带内" color={MODEL_COLOR.gru} width={470} />
              </Card>
              <Card label="两个早停点" accent={C.coral} style={{ width: 526, height: 236 }}>
                <Row name="RNN 二十步" value="十轮" note="验证集不再降" color={C.coral} width={470} />
                <Row name="LSTM 四十步" value="二十五轮" note="同上" color={C.coral} width={470} />
                <Row name="含义" value="预算没花完" note="不是发散" width={470} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.87)}>
            <div style={{ position: "absolute", left: PAD, top: 838, width: 1220 }}>
              <Body size={FT.body}>结论：五步内 RNN 满命中；二十步它回到随机；LSTM 与 GRU 在长延迟留住部分信号。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            最后一页是计数：二十二项检查、四十一条断言。
          </div>
          <Build at={lf("verification", 0.84)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Stat label="证据检查" accent={C.cyan} value={String(m.meta.checks.total) + " 项"} sub={m.meta.checks.failed + " 失败 · 手工 " + m.meta.checks.manual + " / 数据 " + m.meta.checks.data} valueSize={62} style={{ width: 426, height: 196 }} />
              <Stat label="本集断言" accent={C.violet} value={"+" + String(m.meta.tests.rnn + m.meta.tests.lstm + m.meta.tests.gru)} sub="三个 Spec 之和" valueColor={C.violet} valueSize={62} style={{ width: 426, height: 196 }} />
              <Stat label="全仓套件" accent={C.amber} value={String(m.meta.tests.suites) + " 组"} sub="cabal test 全绿" valueColor={C.amber} valueSize={62} style={{ width: 426, height: 196 }} />
              <Stat label="全仓断言" accent={C.cyan} value={String(m.meta.tests.asserts)} sub="零失败" valueSize={62} style={{ width: 426, height: 196 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 540, display: "flex", gap: 24 }}>
              <Card label="RNN" accent={MODEL_COLOR.rnn} style={{ width: 570, height: 150 }}>
                <Row name="新增" value={String(m.meta.tests.rnn) + " 条"} note="参数、手算、梯度检查、训练、可复现" color={MODEL_COLOR.rnn} width={520} />
              </Card>
              <Card label="LSTM" accent={MODEL_COLOR.lstm} style={{ width: 570, height: 150 }}>
                <Row name="新增" value={String(m.meta.tests.lstm) + " 条"} note="四门形状、传递率、初值直通" color={MODEL_COLOR.lstm} width={520} />
              </Card>
              <Card label="GRU" accent={MODEL_COLOR.gru} style={{ width: 570, height: 150 }}>
                <Row name="新增" value={String(m.meta.tests.gru) + " 条"} note="三组权重、重置门只乘旧状态" color={MODEL_COLOR.gru} width={520} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.95)}>
            <div style={{ position: "absolute", left: PAD, top: 726, display: "flex", alignItems: "center", gap: 20 }}>
              <Verdict ok label="三档验证零失败" />
              <Body size={FT.meta}>解析值说明路径对不对，判决表说明这条路径值多少钱</Body>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
