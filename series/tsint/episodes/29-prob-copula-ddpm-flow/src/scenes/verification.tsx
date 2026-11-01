import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Chip, Body, Mono, Heat } from "../shared";

const gridMax = Math.max(...M.cnf.grid.flat().map((v) => Math.abs(v)));

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 10), pageAt("verification", 20), pageAt("verification", 30), pageAt("verification", 40)];
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 900 }}>
            <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="三组模块、数据、伪影，一次跑完" accent={C.cyan} valueSize={92} valueColor={C.cyan} style={{ width: 860 }} />
          </div>
          <div style={{ position: "absolute", left: 1020, top: 300, width: 828 }}>
            <Card label="底层断言" accent={C.violet} style={{ width: 788 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.ink }}>{M.meta.tests.asserts.toLocaleString("en-US")}</div>
                <Mono size={FT.meta} color={C.inkFaint}>{M.meta.tests.suites} 套 · 0 失败</Mono>
              </div>
              <div style={{ marginTop: 16 }}>
                <Row name="Copula" value={String(M.meta.tests.copula)} note="排名 / PIT / 相关 / 闭式值 / 端点" width={748} color={C.cyan} />
                <Row name="DDPM 损失" value={String(M.meta.tests.ddpm)} note="前向闭式 / 损失手算 / 梯度 / 复现" width={748} color={C.amber} />
                <Row name="连续流" value={String(M.meta.tests.cnf)} note="往返 / 行列式 / RK4 阶数 / 密度积分" width={748} color={C.violet} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 640, width: CW }}>
            <Row name="证据程序" value={M.meta.runtimeSec + " s"} note="二十四项检查、三份 evidence JSON、一份 summary.json" width={1640} />
            <Row name="数据复核" value={M.data.rows.toLocaleString("en-US") + " 行 · sha256 " + M.data.sha} note={"窗口 " + M.data.winCount + " 个 · 长度 " + M.data.winLen + " · 最长停牌 " + M.data.maxGapDays + " 天"} width={1640} color={C.cyan} />
            <Row name="本集新增" value={M.meta.tests.copula + M.meta.tests.ddpm + M.meta.tests.cnf + " 条"} note="此前 92 套 / 1,251 条，加完 99 套 / 1,371 条" width={1640} color={C.amber} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="零失败" />
            <Verdict ok label="读数全部来自刚跑的实现" />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: CW }}>
            <Card label="Copula · 从形状到闭式值" accent={C.cyan} style={{ width: CW }}>
              <div style={{ marginTop: 4 }}>
                <Row name="合成样本 KS 距离" value={M.copula.ks.toFixed(4)} note="10,000 条，阈值 0.06；排名变换后边缘应该完全对齐" width={1640} color={C.cyan} />
                <Row name="Kendall τ 偏差" value={Math.abs(M.copula.tau).toFixed(4)} note="目标相关结构在秩上的对应量" width={1640} />
                <Row name="Spearman ρ 偏差" value={Math.abs(M.copula.rho).toFixed(4)} note="同上，两种秩相关都对齐" width={1640} />
                <Row name="边缘往返误差" value={M.copula.roundtrip.toFixed(4)} note="PIT 正向 → 正态 → 反向还原" width={1640} />
                <Row name="相关矩阵拟合误差" value={M.copula.fitErr.toFixed(4)} note={"真实面板上，方向判定：" + M.copula.fitStatus} width={1640} color={C.amber} />
                <Row name="闭式值" value={M.copula.cCorrect.toFixed(6) + " vs 计划 " + M.copula.cPlan.toFixed(6)} note={"上界 min(u,v) = " + M.copula.bound.toFixed(1) + "，计划值直接越界"} width={1640} color={C.coral} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 852, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="测试钉死 1/3" />
            <Verdict ok label="并反向断言 0.583333 越界" />
            <Mono size={FT.meta} color={C.inkFaint}>闭式值不是抄来的，是手算 + 断言两边对齐</Mono>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 620 }}>
            <Card label="8 × 8 相关矩阵 · 真实面板" accent={C.cyan} style={{ width: 580 }}>
              <Heat matrix={M.copula.corr} labels={M.copula.labels} groups={M.data.groups} cell={52} gap={3} labelW={82} min={0.2} max={1} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 720, top: 300, width: 1130 }}>
            <Row name="日收益 · 同组" value={M.copula.withinRet.toFixed(4)} note="宽带口径" width={1090} color={C.cyan} />
            <Row name="日收益 · 跨组" value={M.copula.crossRet.toFixed(4)} note="宽带口径" width={1090} color={C.coral} />
            <Row name="窗口内 · 同组" value={M.copula.withinWin.toFixed(4)} note="96 日窗口，减窗内均值" width={1090} color={C.cyan} />
            <Row name="窗口内 · 跨组" value={M.copula.crossWin.toFixed(4)} note="96 日窗口，减窗内均值" width={1090} color={C.coral} />
            <Row name="差值对比" value={(M.copula.withinRet - M.copula.crossRet).toFixed(4) + " → " + (M.copula.withinWin - M.copula.crossWin).toFixed(4)} note="窗一变，行业结构缩水一半；同一批数据，两种口径" width={1090} color={C.amber} />
            <Card label="读法" accent={C.violet} style={{ marginTop: 26, width: 1090 }}>
              <Body size={FT.body}>
                矩阵的块结构肉眼可见：三个组的分块更亮，组内边框标出分组。但减掉窗内均值之后，块之间的差距明显收窄 ——
                这正是边界里要写清的那句话：行业结构不是数据里固定的常数。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="扩散 · 能跑通，但不宣称生成质量" accent={C.amber} style={{ width: 970 }}>
              <div style={{ marginTop: 4 }}>
                <Row name="t = 500 的 x_t" value={M.ddpm.xtHalf.toFixed(6)} note="√2，闭式解，误差 1e-12 级" width={930} color={C.cyan} />
                <Row name="oracle 损失" value={M.ddpm.oracleLoss.toFixed(1)} note="把真噪声当预测，损失应为 0" width={930} />
                <Row name="零预测损失" value={M.ddpm.zeroPredLoss.toFixed(1)} note="预测恒为 0，损失应等于 E‖ε‖² = 1" width={930} />
                <Row name="同 seed 损失" value={M.ddpm.sameSeed.toFixed(6)} note="逐位相等，复现性成立" width={930} color={C.amber} />
                <Row name="训练首步 → 末步" value={M.ddpm.trainFirst.toFixed(4) + " → " + M.ddpm.trainLast.toFixed(4)} note="只说明网络在学，不说明学好了" width={930} />
                <Row name="20 条 DDIM 路径" value={M.ddpm.allFinite ? "全部有限" : "出现 NaN"} note={"50 步 × 20 条，无 NaN"} width={930} color={C.cyan} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1110, top: 300, width: 738 }}>
            <Card label="诚实读数 · 样本均值与标准差" accent={C.coral}>
              <div style={{ marginTop: 4 }}>
                <Row name="样本均值误差" value={M.ddpm.meanErr.toFixed(2)} note="按维平均，单位是标准差" width={698} color={C.coral} />
                <Row name="样本标准差误差" value={M.ddpm.sdErr.toFixed(2)} note="样本 sd 62.69，数据 sd 2.30" width={698} color={C.coral} />
                <Row name="数据 sd" value={M.ddpm.dataSd.toFixed(2)} note="测试窗口上的真实标准差" width={698} />
              </div>
            </Card>
            <Card label="结论" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body}>
                去噪网络只训练 400 步、采样只有 20 条，样本明显发散。本集把这两个误差原样写进证据，而不是挑几条好看的路径。
                扩散这一节证明的是实现与复现，不是生成。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="连续流 · 密度、阶数、积分" accent={C.violet} style={{ width: 970 }}>
              <div style={{ marginTop: 4 }}>
                <Row name="仿射层 log |det J|" value={M.cnf.logDet.toFixed(6)} note="= log 2，手算可验" width={930} color={C.cyan} />
                <Row name="可逆往返" value={M.cnf.roundtrip.toExponential(2)} note="机器精度量级，映射真可逆" width={930} />
                <Row name="网格密度积分" value={M.cnf.integral.toFixed(10)} note="41 × 41 网格求和，等于一" width={930} color={C.cyan} />
                <Row name="RK4 8 步 / 16 步" value={M.cnf.rk4Err8.toExponential(2) + " / " + M.cnf.rk4Err16.toExponential(2)} note={"比值 " + M.cnf.rk4Ratio.toFixed(3) + "，理论 16"} width={930} color={C.amber} />
                <Row name="PCA 首成分占比" value={M.cnf.pcaShare.toFixed(4)} note={"特征值 " + M.cnf.eigen[0].toFixed(3) + " / " + M.cnf.eigen[1].toFixed(3)} width={930} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1110, top: 300, width: 738 }}>
            <Card label="密度网格 · 41 × 41" accent={C.violet} style={{ width: 698 }}>
              <Heat matrix={M.cnf.grid} labels={[]} cell={15} gap={1} labelW={0} min={0} max={gridMax} showVals={false} />
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>
                亮处是密度高的位置；积分恰为一
              </Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

