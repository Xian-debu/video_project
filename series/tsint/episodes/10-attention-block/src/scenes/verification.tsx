import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, fmtE, fmtF, lf, LinePlot } from "../shared";

/* 验证：手算、合成任务、真实窗口三档；最后是计数。 */

export const SVerification: React.FC = () => {
  const m = M;
  const rt = m.series.real;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={[0, 0.26, 0.52, 0.76]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一档，手算：每一个数都能用式子重算出来。
          </div>
          <Build at={lf("verification", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="softmax 与数值稳定" accent={C.cyan} style={{ width: 880, height: 470 }}>
                <Row name="softmax 1 2 3" value={m.attn.softmax123.map((v) => fmtF(v, 4)).join("  ")} note="与手算三项误差 < 1e−15" width={820} />
                <Row name="行和偏差" value={fmtE(m.attn.rowsumDev, 2)} note="十六行，每行减一后取最大" width={820} />
                <Row name="+1000 平移" value={fmtF(m.attn.shiftMaxdiff, 1)} note="稳定版逐位一致" color={C.cyan} width={820} />
                <Row name="朴素版" value={m.attn.naiveNaN ? "全是 NaN" : "正常"} note="exp(1001) 溢出" color={C.coral} width={820} />
                <Row name="熵" value={fmtF(m.attn.entropyUniform, 4) + " = ln 16"} note={"one-hot " + fmtE(m.attn.entropyOne, 2)} width={820} />
              </Card>
              <Card label="掩码与置换" accent={C.violet} style={{ width: 870, height: 470 }}>
                <Row name="上三角" value="精确 0" note="不做近似，逐元素等于零" color={C.violet} width={810} />
                <Row name="掩码行和" value={fmtE(m.attn.maskRowsumDev, 2)} note="屏蔽之后仍然归一化" width={810} />
                <Row name="置换 A 差值" value={fmtE(m.attn.permA, 2)} note="打乱输入，矩阵跟着换" width={810} />
                <Row name="置换输出差值" value={fmtE(m.attn.permOut, 2)} note="输出也跟着换" width={810} />
                <Row name="PE[1][0]" value={fmtF(m.attn.pe10, 4)} note="= sin 1，固定常数" width={810} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二档，合成任务：三百步，注意力收敛到单位阵。
          </div>
          <Build at={lf("verification", 0.29)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1040 }}>
              <Card label="训练损失 · 快照点" accent={C.cyan} style={{ width: 1040, height: 430 }}>
                <LinePlot
                  series={[{ values: m.series.loss.train, color: C.cyan, name: "MSE" }]}
                  width={980} height={330} at={lf("verification", 0.31)}
                  yFmt={(v) => v.toFixed(3)} zeroLine
                  title="steps 0,10,25,50,100,200,300"
                />
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 1080, top: 312, width: 690, display: "flex", flexDirection: "column", gap: 18 }}>
              <Stat label="初始 → 最终" accent={C.inkFaint} value={fmtF(m.attn.copyInitialLoss, 4) + " → " + fmtE(m.attn.copyFinalLoss, 2)} sub={"测试集 " + fmtE(m.attn.copyTestLoss, 2)} valueSize={52} style={{ height: 190 }} />
              <Stat label="与单位阵的平均偏差" accent={C.cyan} value={fmtF(m.attn.copyDev, 4)} sub="阈值 0.05，实测小 34 倍" valueColor={C.cyan} style={{ height: 190 }} />
              <Stat label="行熵" accent={C.violet} value={fmtF(m.attn.copyEntropy, 4)} sub="均匀是 2.7726，这里接近零" valueColor={C.violet} style={{ height: 190 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三档，真实窗口：同一个诊断量，数字会松一档。
          </div>
          <Build at={lf("verification", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1180 }}>
              <Card label="与单位阵的平均偏差 · 逐窗" accent={C.violet} style={{ width: 1180, height: 420 }}>
                <LinePlot
                  series={[
                    { values: rt.mt.dev, color: C.violet, name: "600519" },
                    { values: rt.pa.dev, color: C.amber, name: "000001", dash: true },
                  ]}
                  width={1120} height={320} at={lf("verification", 0.57)}
                  yFmt={(v) => v.toFixed(3)} zeroLine
                  title="197 / 193 个 16 × 8 窗口，横轴是窗口序号"
                />
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 1220, top: 312, width: 556, display: "flex", flexDirection: "column", gap: 16 }}>
              <Stat label="600519 · dev" accent={C.violet} value={fmtF(m.attn.real600519.dev, 4)} sub={"熵 " + fmtF(m.attn.real600519.entropy, 4)} valueColor={C.violet} style={{ width: 556, height: 190 }} />
              <Stat label="000001 · dev" accent={C.amber} value={fmtF(m.attn.real000001.dev, 4)} sub={"熵 " + fmtF(m.attn.real000001.entropy, 4)} valueColor={C.amber} style={{ width: 556, height: 190 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.62)}>
            <div style={{ position: "absolute", left: PAD, top: 774, display: "flex", gap: 22 }}>
              <Row name="600519 单窗 MSE" value={fmtE(m.attn.real600519.loss, 2)} note="合成任务 4.67e−4，松 7.5 倍" width={820} />
              <Row name="000001 单窗 MSE" value={fmtE(m.attn.real000001.loss, 2)} note="两个品种同一个量级" width={820} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三档放在一起：三十一项检查，零失败。
          </div>
          <Build at={lf("verification", 0.79)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Stat label="手算断言" accent={C.cyan} value="12 条" sub="softmax、手算黄金值、掩码、置换" style={{ width: 430, height: 216 }} />
              <Stat label="合成任务" accent={C.violet} value="8 条" sub="参数、可复现、收敛、对齐" valueColor={C.violet} style={{ width: 430, height: 216 }} />
              <Stat label="真实窗口" accent={C.amber} value="6 条" sub="两只票的 dev / 熵 / 损失" valueColor={C.amber} style={{ width: 430, height: 216 }} />
              <Stat label="数据断言" accent={C.inkDim} value={m.meta.checks.data + " 条"} sub="行数、收益数、窗口数" style={{ width: 430, height: 216 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.87)}>
            <div style={{ position: "absolute", left: PAD, top: 576, display: "flex", gap: 24 }}>
              <Stat label="证据检查" accent={C.violet} value={m.meta.checks.total + " 项"} sub={m.meta.checks.failed + " 失败；manual " + m.meta.checks.manual + " / data " + m.meta.checks.data} valueColor={C.violet} style={{ width: 570, height: 200 }} />
              <Stat label="本集断言" accent={C.cyan} value={m.meta.tests.attention + " 条"} sub="AttentionSpec 四个分组" valueColor={C.cyan} style={{ width: 570, height: 200 }} />
              <Stat label="全仓" accent={C.amber} value={m.meta.tests.suites + " 组 / " + m.meta.tests.asserts} sub="所有断言全绿" valueColor={C.amber} style={{ width: 588, height: 200 }} />
            </div>
          </Build>
          <Build at={lf("verification", 0.94)}>
            <div style={{ position: "absolute", left: PAD, top: 800, display: "flex", alignItems: "center", gap: 16 }}>
              <Verdict ok label="结论" />
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>复制任务学到对齐；真实窗口只说明分布外会变松。</div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
