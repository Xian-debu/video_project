import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Formula, K, M, Matrix, PAD, Pages, Row, Scene, SceneHead, Stat, fmtF, lf } from "../shared";

/* 直觉：复制任务要的是单位阵；位置码为什么要拼不要加。 */

export const SIntuition: React.FC = () => {
  const m = M;
  const pe = m.series.pe.v;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.28, 0.54, 0.76]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            复制任务：输入十六步，每步八个随机数，输出要求一模一样。
          </div>
          <Build at={lf("intuition", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Card label="任务" accent={C.cyan} style={{ width: 874, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>抄一遍</div>
                <Body style={{ marginTop: 14 }}>模型唯一的线索是每一步自己的值。想抄对，第 t 个输出只能从第 t 个输入取值。</Body>
                <K style={{ display: "block", marginTop: 14 }}>所以 A 必须收敛到单位阵 I</K>
              </Card>
              <Card label="条件" accent={C.violet} style={{ width: 876, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>给每步一个指纹</div>
                <Body style={{ marginTop: 14 }}>拼接十六维正弦位置码，不同位置几乎正交；查询和键都从拼接后的二十四维投影出来。</Body>
                <K style={{ display: "block", marginTop: 14 }}>同位置的 qᵀk 最大，别的很小</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 690, display: "flex", gap: 24 }}>
              <Stat label="参数量" accent={C.amber} value={m.attn.copyParams + ""} sub="2 × 16 × 24，无偏置" valueColor={C.amber} style={{ width: 430, height: 190 }} />
              <Stat label="训练 / 测试" accent={C.inkDim} value={m.data.windows.copyTrain + " / " + m.data.windows.copyTest} sub="条序列，seed 42，300 步 Adam 1e-2" style={{ width: 430, height: 190 }} />
              <Stat label="稳态损失" accent={C.cyan} value={fmtF(m.attn.copyFinalLoss, 5)} sub={"测试集 " + fmtF(m.attn.copyTestLoss, 5)} valueColor={C.cyan} style={{ width: 430, height: 190 }} />
              <Stat label="与 I 的平均偏差" accent={C.violet} value={fmtF(m.attn.copyDev, 4)} sub="单位阵距离，越小越尖" valueColor={C.violet} style={{ width: 430, height: 190 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            位置码是一张固定的表：十六行、十六列，没有参数。
          </div>
          <Build at={lf("intuition", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 40, alignItems: "flex-start" }}>
              <Matrix rows={pe} cell={36} showNumbers={false} color={C.violet} caption="PE [16 × 16]：行是位置，列是频率" at={lf("intuition", 0.33)} />
              <div style={{ width: 740 }}>
                <Row name="第 0 行" value="0 1 0 1 …" note="sin 0 = 0，cos 0 = 1，交替到底" width={740} />
                <Row name="第 1 行首列" value={fmtF(m.hand.pe10, 4)} note="sin(1)，固定常数，不参与训练" width={740} />
                <Row name="频率" value="1 / 10000^(2i/d)" note="低频维看大尺度，高频维看相邻位置" width={740} />
                <Row name="性质" value="位置之间近正交" note="这是复制任务能学会对齐的前提" color={C.violet} width={740} />
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            手算一个两行两维的例子：Q = K = I，V = 10·I。
          </div>
          <Build at={lf("intuition", 0.57)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 36, alignItems: "center" }}>
              <Card label="分数 Q Kᵀ / √d_k" accent={C.amber} style={{ width: 520, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.ink }}>[[0.7071, 0],</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.ink }}>&nbsp;[0, 0.7071]]</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>1 / √2 = 0.70710678</Body>
              </Card>
              <Card label="softmax 每行" accent={C.cyan} style={{ width: 520, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.cyan }}>[[{fmtF(m.hand.aDiag, 4)}, {fmtF(m.hand.aOff, 4)}],</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.cyan }}>&nbsp;[{fmtF(m.hand.aOff, 4)}, {fmtF(m.hand.aDiag, 4)}]]</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>每行和为 1</Body>
              </Card>
              <Card label="输出 A V" accent={C.violet} style={{ width: 640, height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.violet }}>[[{fmtF(m.hand.out0, 4)}, {fmtF(m.hand.out1, 4)}],</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.violet }}>&nbsp;[{fmtF(m.hand.out1, 4)}, {fmtF(m.hand.out0, 4)}]]</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>V 的对角是 10，所以 10 × 0.6698 = 6.6976</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            最贵的一课：位置码要拼接，不能相加。
          </div>
          <Build at={lf("intuition", 0.79)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="相加 · 8 维空间" accent={C.coral} style={{ width: 874, height: 430 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 50, color: C.coral }}>loss 0.0325</div>
                <Body style={{ marginTop: 14 }}>内容和位置码混在一起，十六个位置在八维空间里挤不开，对角线压不干净。</Body>
                <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ width: 62, height: 62, borderRadius: 8, background: C.coral, opacity: 0.18 + i * 0.09 }} />
                  ))}
                </div>
                <K style={{ display: "block", marginTop: 18 }}>偏差 3.31e−2，训练再多步也下不去</K>
              </Card>
              <Card label="拼接 · 24 维空间" accent={C.cyan} style={{ width: 876, height: 430 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 50, color: C.cyan }}>loss 0.000467</div>
                <Body style={{ marginTop: 14 }}>内容 8 维、位置码 16 维各占一段，投影自己去学怎么组合。</Body>
                <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} style={{ width: 29, height: 62, borderRadius: 6, background: i < 8 ? C.cyan : C.violet, opacity: i < 8 ? 0.8 : 0.35 + (i - 8) * 0.03 }} />
                  ))}
                </div>
                <K style={{ display: "block", marginTop: 18 }}>偏差 1.46e−3，测试集 6.98e−4</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
