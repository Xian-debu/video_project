import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat, Scatter, LinePlot } from "../shared";

export const SIntuition: React.FC = () => {
  const at = pagesOf("intuition");
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：二维散点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 270, width: 860 }}>
            <Card label="二维潜空间，β = 0.1" accent={C.cyan} pad={16}>
              <Scatter
                width={800}
                height={560}
                normal={M.latent.normal}
                spike={M.latent.spike}
                drift={M.latent.drift}
                title={"均值路径 · 种子 " + M.latent.seed}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 990, top: 288, width: 850 }}>
            <Card label="半径中位数" accent={C.violet}>
              <Row name="正常窗" value={M.latent.normMedian.toFixed(3)} note="120 个点" width={790} />
              <Row name="尖峰窗" value={M.latent.spikeMedian.toFixed(3)} note="每段取 3 个窗" width={790} />
              <Row name="斜坡窗" value={M.latent.driftMedian.toFixed(3)} note="每段取 3 个窗" width={790} />
              <Row name="全部注入" value={M.latent.injMedian.toFixed(3)} note={"比值 " + (M.latent.injMedian / M.latent.normMedian).toFixed(3)} width={790} />
            </Card>
            <Body style={{ marginTop: 20, width: 820 }}>
              三个数挤在一起，没有谁飞出去。虚线圈是标准正态的一倍标准差：多数点落在圈外，说明后验没有被完全压回先验；
              但异常也没有被推到远处，它就混在正常团里。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：恒等对照 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="十六维瓶颈：在学" accent={C.cyan} pad={16}>
              <LinePlot
                series={[{ values: M.series.ae16Loss, color: C.cyan, name: "AE d=16 训练损失" }]}
                width={960}
                height={380}
                title="训练损失（每轮末）"
                yFmt={(v) => v.toFixed(3)}
                legend
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1130, top: 288, width: 720 }}>
            <Card label="一百维线性：在抄" accent={C.coral}>
              <Row name="参数" value={M.ae.params100.toLocaleString("en-US")} note="两万个参数" width={660} />
              <Row name="训练损失" value="没有曲线" note="一步到位，精确解" width={660} />
              <Row name="干净窗分数" value={M.ae.cleanMean100.toFixed(2)} note="恒等模型分数恒为零" width={660} />
            </Card>
            <Card label="两个干净窗均值" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="d = 16" value={M.ae.cleanMean16.toFixed(4)} note="在学，分数有区分度" width={660} />
              <Row name="d = 100" value={M.ae.cleanMean100.toFixed(4)} note="在抄，分数恒为零" width={660} />
            </Card>
            <Verdict ok={false} label="只看训练损失，会选错模型" />
          </div>
        </AbsoluteFill>

        {/* 页三：beta 交换 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1060 }}>
            <Card label="同一个模型，只换 β" accent={C.violet}>
              <Row name="每窗 KL" value={M.vae.klMean01.toFixed(3) + " → " + M.vae.klMean1.toFixed(3)} note="β 0.1 → 1，KL 被压紧" width={1010} />
              <Row name="重构 MSE" value={M.vae.reconMSE01.toFixed(4) + " → " + M.vae.reconMSE1.toFixed(4)} note="压得越紧，还原越吃力" width={1010} />
              <Row name="F1" value={M.units.vae01.f1.toFixed(4) + " → " + M.units.vae1.f1.toFixed(4)} note="几乎没变" width={1010} />
              <Row name="报警率" value={M.units.vae01.alertPct.toFixed(2) + "% → " + M.units.vae1.alertPct.toFixed(2) + "%"} note="略微下降，仍不可用" width={1010} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1210, top: 288, width: 640 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 610, lineHeight: 1.7 }}>
              KL 压得越紧，还原越吃力，这是必然的交换。但检测分数没跟着变好：0.4229 到 0.4412，差别在噪声量级。
            </Body>
            <Chip color={C.violet} style={{ marginTop: 18 }}>KL 买到的是先验，不是检测能力</Chip>
            <K style={{ display: "block", marginTop: 18 }}>这是这一集最重要的一句。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
