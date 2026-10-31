import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, lf } from "../shared";

/* 数字：手算、梯度、合成数据、真实数据、因果性。 */

export const SVerification: React.FC = () => {
  const m = M;
  const loss = m.series.loss;
  const fit = m.series.fit;
  const ar2 = m.series.ar2;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.2, 0.38, 0.55, 0.74, 0.9]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一组，手算：这些都不依赖训练，是纯算出来的。
          </div>
          <Build at={lf("verification", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1776 }}>
              <Card label="手算黄金值" accent={C.cyan} style={{ height: 470 }}>
                <Row name="式 (2.62) 黄金值" value={JSON.stringify(m.hand.goldenY)} note="翻转核 + 左补零，逐项手算" color={C.cyan} width={1728} />
                <Row name="膨胀 d=2 黄金值" value={JSON.stringify(m.hand.dilY)} note="下标里多乘 d，隔一步取一个" color={C.violet} width={1728} />
                <Row name="错误版首值" value={String(m.tcn.leaky.first)} note={"正确版是 " + m.tcn.causal.first + "；差值来自未来两步"} color={C.coral} width={1728} />
                <Row name="感受野" value={String(m.tcn.rf)} note="支撑集断言的边界：扰动第 16 步必须不影响输出" width={1728} />
                <Row name="参数量" value={m.mlp.params + " / " + m.tcn.params} note="MLP / TCN，构造出来的常量" width={1728} />
                <Row name="布局黄金" value="[0, 0, 1, 2, 5, 10]" note="两层两通道手算，钉住通道主序" width={1728} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 810, display: "flex", gap: 14, alignItems: "center" }}>
              <Verdict ok={true} /><K>全部在 test/Algos/Ch02/MlpSpec.hs 与 TcnSpec.hs</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二组，梯度检查：两个都远小于门槛 1e-6。
          </div>
          <Build at={lf("verification", 0.23)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Stat label="MLP · 相对误差" accent={C.cyan} value={m.mlp.gradcheck.toExponential(3)} sub="门槛 1e-6；中心差分步长 1e-6" valueColor={C.cyan} valueSize={FT.h2} style={{ width: 860, height: 220 }} />
              <Stat label="TCN · 相对误差" accent={C.violet} value={m.tcn.gradcheck.toExponential(3)} sub="含两层 16 通道、膨胀 [1,2]" valueColor={C.violet} valueSize={FT.h2} style={{ width: 860, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.29)}>
            <div style={{ position: "absolute", left: PAD, top: 570, width: 1776 }}>
              <Card accent={C.amber} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>梯度检查过不了，训练曲线再漂亮也不能信。</div>
                <K style={{ display: "block", marginTop: 10 }}>单层对、多层错，问题一定在层间传递</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三组，合成数据：线性锚、二次曲线、异或。
          </div>
          <Build at={lf("verification", 0.41)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 860 }}>
              <Card label="训练损失 · 二次曲线 400 点" accent={C.cyan} style={{ height: 330 }}>
                <LinePlot series={[{ values: loss.loss, color: C.cyan, name: "MSE" }]} width={812} height={262} yFmt={(v) => v.toFixed(4)} legend={false} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.45)}>
            <div style={{ position: "absolute", left: PAD + 884, top: 306, width: 892 }}>
              <Card label="三条合成数据" accent={C.violet} style={{ height: 330 }}>
                <Row name="线性锚 50 点" value={"w=" + m.mlp.linear.w.toFixed(3)} note={"b=" + m.mlp.linear.b.toFixed(3) + "，MSE " + m.mlp.linear.mse.toExponential(2)} color={C.cyan} width={846} />
                <Row name="二次曲线" value={m.mlp.quad.mse.toExponential(2)} note={"直线拟合 " + m.mlp.quad.linearMse.toFixed(4) + "，比值 " + (m.mlp.quad.ratio * 100).toFixed(2) + "%"} color={C.violet} width={846} />
                <Row name="异或 4 点" value={m.mlp.xor.mse.toExponential(2)} note={"首损 " + m.mlp.xor.first.toFixed(4) + "，真学会了"} color={C.amber} width={846} />
                <K style={{ display: "block", marginTop: 10 }}>线性锚基本是零：5.67e-24</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.5)}>
            <div style={{ position: "absolute", left: PAD, top: 666, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              网络真学到了弯曲：误差比直线小四个数量级。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第四组，自回归序列：网络学到结构，比值零点四零六。
          </div>
          <Build at={lf("verification", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1090 }}>
              <Card label="AR(2) 合成序列 · 测试段 86 个窗口" accent={C.violet} style={{ height: 400 }}>
                <LinePlot series={[
                  { values: ar2.actual, color: C.inkDim, name: "真实" },
                  { values: ar2.pred, color: C.violet, name: "TCN 预测" },
                  { values: ar2.naive, color: C.coral, name: "持续基线", dash: true },
                ]} width={1042} height={316} yFmt={(v) => v.toFixed(2)} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.64)}>
            <div style={{ position: "absolute", left: PAD + 1114, top: 306, width: 662 }}>
              <Card label="两个基线" accent={C.amber} style={{ height: 400 }}>
                <Row name="TCN 误差" value={m.tcn.ar2.test.toFixed(3)} note="测试集" color={C.violet} width={616} />
                <Row name="持续预测" value={m.tcn.ar2.naive.toFixed(3)} note="重复上一个值" color={C.coral} width={616} />
                <Row name="比值" value={m.tcn.ar2.ratio.toFixed(4)} note="小于 0.8 才算学到东西" color={C.cyan} width={616} />
                <K style={{ display: "block", marginTop: 12 }}>这里它确实学到了结构</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            真实数据上，两个都比零预测差一点点；负结论原样写进证据。
          </div>
          <Build at={lf("verification", 0.77)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1090 }}>
              <Card label="茅台收益率 · 1,507 个测试窗口" accent={C.coral} style={{ height: 366 }}>
                <LinePlot series={[
                  { values: m.series.mlpReturns.actual, color: C.inkFaint, name: "实际" },
                  { values: m.series.mlpReturns.pred, color: C.cyan, name: "MLP" },
                  { values: m.series.tcnReturns.pred, color: C.violet, name: "TCN" },
                ]} width={1042} height={286} yFmt={(v) => v.toFixed(2)} zeroLine={true} />
              </Card>
            </div>
          </Build>
          <Build at={lf("verification", 0.82)}>
            <div style={{ position: "absolute", left: PAD + 1114, top: 306, width: 662 }}>
              <Card label="误差 / 零预测基线" accent={C.amber} style={{ height: 366 }}>
                <Row name="MLP" value={m.mlp.real.ratio.toFixed(4)} note={m.mlp.real.test.toFixed(4) + " vs " + m.mlp.real.base.toFixed(4)} color={C.cyan} width={616} />
                <Row name="TCN" value={m.tcn.real.ratio.toFixed(4)} note={m.tcn.real.test.toFixed(4) + " vs " + m.tcn.real.base.toFixed(4)} color={C.violet} width={616} />
                <Body size={FT.meta} style={{ marginTop: 14 }}>两个都比基线差 2% 到 5%；不是实现错，是日频信噪比低。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            最后是因果性：改掉第十一步之后的输入，前十个输出逐位比。
          </div>
          <Build at={lf("verification", 0.92)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 26 }}>
              <Stat label="前十个输出 · 最大差值" accent={C.cyan} value={String(m.tcn.causal.pastMaxdiff)} sub="逐位相等，容差为零" valueColor={C.cyan} style={{ width: 570, height: 216 }} />
              <Stat label="证据检查" accent={C.violet} value={m.meta.checks.total + " 项"} sub={m.meta.checks.failed + " 失败；manual " + m.meta.checks.manual + " / data " + m.meta.checks.data} valueColor={C.violet} style={{ width: 570, height: 216 }} />
              <Stat label="测试断言" accent={C.amber} value={m.meta.tests.mlp + " + " + m.meta.tests.tcn} sub={"全仓 " + m.meta.tests.asserts + " 条，全绿"} valueColor={C.amber} style={{ width: 588, height: 216 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.96)}>
            <div style={{ position: "absolute", left: PAD, top: 566, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 130 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>零，是这一集最重要的一个数。</div>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
