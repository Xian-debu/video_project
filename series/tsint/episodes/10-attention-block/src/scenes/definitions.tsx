import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, Formula, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmtF, lf } from "../shared";

/* 定义：式 2.65 的四个零件、掩码、位置编码、参数量与熵。 */

const causal = Array.from({ length: 6 }).map((_, i) => Array.from({ length: 6 }).map((_, j) => (j <= i ? 1 : 0)));

export const SDefinitions: React.FC = () => {
  const m = M;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.28, 0.52, 0.76]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 246, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            把式二点六五拆成四个零件。
          </div>
          <Build at={lf("definitions", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306 }}>
              <Formula size={60} style={{ color: C.ink }}>softmax(Q Kᵀ / √d_k) V</Formula>
            </div>
          </Build>
          <Build at={lf("definitions", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 400, display: "flex", gap: 24 }}>
              <Card label="Q 查询" accent={C.cyan} style={{ width: 432, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>我要什么</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>第 i 行是第 i 个位置的需求向量。</Body>
                <K style={{ display: "block", marginTop: 10 }}>Q = X W_q</K>
              </Card>
              <Card label="K 键" accent={C.violet} style={{ width: 432, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>我是什么</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>第 j 行是第 j 个位置的标识向量。</Body>
                <K style={{ display: "block", marginTop: 10 }}>K = X W_k</K>
              </Card>
              <Card label="V 值" accent={C.amber} style={{ width: 432, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>我带着什么</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>被看中的位置，贡献的就是这一行。</Body>
                <K style={{ display: "block", marginTop: 10 }}>V = X（复制任务）</K>
              </Card>
              <Card label="√d_k 缩放" accent={C.coral} style={{ width: 432, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>压分数</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>内积随维度线性增长；不除，softmax 退化成 one hot。</Body>
                <K style={{ display: "block", marginTop: 10 }}>d_k = 16，√d_k = 4</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            因果掩码：把「未来」的分数压到负十的三十次方。
          </div>
          <Build at={lf("definitions", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 44, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginBottom: 10 }}>掩码（1 = 允许看，0 = 屏蔽）</div>
                <div style={{ display: "inline-block" }}>
                  {causal.map((row, i) => (
                    <div key={i} style={{ display: "flex", marginBottom: 6 }}>
                      {row.map((v, j) => (
                        <div key={j} style={{
                          width: 86, height: 70, marginRight: 6, borderRadius: 8,
                          border: "1px solid " + C.panelLine,
                          background: v ? C.cyan : C.panel,
                          opacity: v ? 0.55 : 0.9,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: FONT.mono, fontSize: FT.meta, color: v ? C.bg : C.inkFaint,
                        }}>{v ? "0" : "−1e30"}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: 780 }}>
                <Row name="为什么不用 −∞" value="整行屏蔽会 NaN" note="先减行最大，剩下的还是 −∞，exp 是 0，0/0 是 NaN" color={C.coral} width={780} />
                <Row name="−1e30 的 exp" value="0" note="下溢到零，但分母还有允许看的位置撑着" width={780} />
                <Row name="上三角实测" value="精确 0" note="不是很小，是逐元素等于零" color={C.cyan} width={780} />
                <Row name="每行和" value="1 − 1.11e−16" note="屏蔽之后仍然归一化" width={780} />
                <Row name="代价" value="相差 > 1e30 会整行变零" note="比 NaN 好排查，所以接受" width={780} />
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            位置编码是闭式：没有参数，只保证不同位置拿到的向量不一样。
          </div>
          <Build at={lf("definitions", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 40 }}>
              <Card label="闭式" accent={C.violet} style={{ width: 1000, height: 400 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>PE[p, 2i]&nbsp;&nbsp;&nbsp;= sin(p / 10000^(2i/d))</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink, marginTop: 12 }}>PE[p, 2i+1] = cos(p / 10000^(2i/d))</div>
                <Body size={FT.meta} style={{ marginTop: 20 }}>偶数维正弦、奇数维余弦；频率随列号指数下降。</Body>
                <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                  <Chip color={C.violet}>PE[0] = 0,1,0,1,…</Chip>
                  <Chip color={C.amber}>PE[1][0] = sin 1 = {fmtF(m.hand.pe10, 4)}</Chip>
                </div>
              </Card>
              <div style={{ width: 700 }}>
                <Row name="参数" value="0" note="整张表由位置和维度算出来，不进梯度" width={700} />
                <Row name="形状" value="16 × 16" note="行是位置，列是频率" width={700} />
                <Row name="用途" value="给每个位置一个指纹" note="没有它，注意力分不清先后" color={C.violet} width={700} />
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            参数量与诊断量：七百六十八个参数，一个行熵。
          </div>
          <Build at={lf("definitions", 0.79)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="参数量怎么来" accent={C.cyan} style={{ width: 880, height: 380 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.cyan }}>{m.hand.paramsExpr}</div>
                <Body style={{ marginTop: 10 }}>两个投影各 {m.hand.wqParams} 个参数，没有偏置；注意力本身没有别的参数。</Body>
                <Row name="W_q" value={m.hand.wqParams + ""} note="16 × 24，行是输出维度" width={820} />
                <Row name="W_k" value={m.hand.wkParams + ""} note="与 W_q 同形状、独立初始化" width={820} />
              </Card>
              <Card label="行熵：矩阵散还是尖" accent={C.amber} style={{ width: 870, height: 380 }}>
                <Bars
                  items={[
                    { label: "均匀 16 点", value: m.attn.entropyUniform, text: fmtF(m.attn.entropyUniform, 4), color: C.amber },
                    { label: "复制任务", value: m.attn.copyEntropy, text: fmtF(m.attn.copyEntropy, 4), color: C.cyan },
                    { label: "真实窗口", value: m.attn.real600519.entropy, text: fmtF(m.attn.real600519.entropy, 4), color: C.violet },
                  ]}
                  width={810} max={m.attn.entropyUniform} rowH={72} at={lf("definitions", 0.82)}
                  unit="熵越低 = 权重越集中在少数位置（ln 16 = 2.7726 为上限）"
                />
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
