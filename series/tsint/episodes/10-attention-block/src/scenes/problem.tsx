import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Formula, K, M, Matrix, PAD, Pages, Row, Scene, SceneHead, Stat, fmtE, fmtF, lf, LinePlot } from "../shared";

/* 问题：损失会骗人、softmax 会溢出、没有位置编码就置换等变。 */

export const SProblem: React.FC = () => {
  const m = M;
  const loss = m.series.loss;
  const a = m.series.matrix.a;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.3, 0.58, 0.82]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一个会骗人的数字：损失。它一路往下，却说明不了对齐学会了。
          </div>
          <Build at={lf("problem", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Card label="复制任务训练损失" accent={C.cyan} style={{ width: 1040, height: 430 }}>
                <LinePlot
                  series={[{ values: loss.train, color: C.cyan, name: "train MSE" }]}
                  width={980} height={330} at={lf("problem", 0.05)}
                  yFmt={(v) => v.toFixed(3)} zeroLine
                  title="steps 0 → 300（横轴等距取点，非线性步长）"
                />
              </Card>
              <div style={{ width: 710, display: "flex", flexDirection: "column", gap: 20 }}>
                <Stat label="初始损失" accent={C.inkFaint} value={fmtF(m.attn.copyInitialLoss, 4)} sub="300 步之前，模型对输入一无所知" style={{ height: 200 }} />
                <Stat label="最终损失" accent={C.cyan} value={fmtE(m.attn.copyFinalLoss, 3)} sub="看起来收敛得很干净" valueColor={C.cyan} style={{ height: 200 }} />
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            该看的是矩阵：第 t 行是不是只在第 t 列上有一。
          </div>
          <Build at={lf("problem", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 40, alignItems: "flex-start" }}>
              <Matrix rows={a} cell={36} showNumbers={false} color={C.cyan} caption="训练后的注意力 A（16 × 16，行列都是位置）" at={lf("problem", 0.35)} />
              <div style={{ width: 700, display: "flex", flexDirection: "column", gap: 24 }}>
                <Card label="第一次实现 · 位置码相加" accent={C.coral} style={{ width: 700, height: 210 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.coral }}>3.31e−2</div>
                  <Body size={FT.meta} style={{ marginTop: 8 }}>与单位阵的平均偏差，损失卡在 0.0325，对角线压不干净。</Body>
                </Card>
                <Card label="改成拼接之后" accent={C.cyan} style={{ width: 700, height: 210 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 52, color: C.cyan }}>1.46e−3</div>
                  <Body size={FT.meta} style={{ marginTop: 8 }}>同一套超参，只把输入从 8+8 相加改成 8 | 16 拼接。</Body>
                </Card>
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二个会骗人的数字：softmax。教科书直写在 +1000 时是一屏 NaN。
          </div>
          <Build at={lf("problem", 0.61)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 860 }}>
              <Card label="stable · 先减行最大" accent={C.cyan} style={{ width: 860, height: 400 }}>
                <Row name="z = 1, 2, 3" value={m.series.softmax.stable.slice(0, 3).map((v) => fmtF(v, 4)).join("  ")} note="三项都是有限值" width={800} />
                <Row name="z 全 +1000" value={m.series.softmax.stable.slice(3).map((v) => fmtF(v, 4)).join("  ")} note="与上一行逐位一致" color={C.cyan} width={800} />
                <Row name="最大差值" value="0.0" note="减行最大不改变结果，只改计算顺序" color={C.cyan} width={800} />
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 900, top: 312, width: 876 }}>
              <Card label="naive · 先 exp 再归一" accent={C.coral} style={{ width: 876, height: 400 }}>
                <Row name="z = 1, 2, 3" value={m.series.softmax.naive.slice(0, 3).map((v) => (v === null ? "NaN" : fmtF(v, 4))).join("  ")} note="小数值时没问题" width={816} />
                <Row name="z 全 +1000" value="NaN  NaN  NaN" note="exp(1001) 溢出成无穷，无穷除无穷" color={C.coral} width={816} />
                <Row name="谁对" value="stable" note="这一步不是优化，是正确性" color={C.cyan} width={816} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三个数字：没有位置编码，注意力对顺序一无所知。
          </div>
          <Build at={lf("problem", 0.85)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 30 }}>
              <Card label="打乱输入的行" accent={C.amber} style={{ width: 870, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>A 跟着换行换列</div>
                <Body style={{ marginTop: 14 }}>输出同样跟着换位置。两次结果逐元素相减，最大差值 {fmtE(m.attn.permA, 2)}。</Body>
                <K style={{ display: "block", marginTop: 12 }}>这不是数值误差，是零</K>
              </Card>
              <Card label="这意味着什么" accent={C.coral} style={{ width: 876, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>它分不清先后</div>
                <Body style={{ marginTop: 14 }}>没有位置编码时，注意力是一个集合函数：只认「有哪些位置」，不认「谁在第几位」。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.94)}>
            <div style={{ position: "absolute", left: PAD, top: 656, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.amber, borderRadius: 12, padding: "18px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>所以验证方法只有一条：把矩阵画出来，把偏差算出来。</div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
