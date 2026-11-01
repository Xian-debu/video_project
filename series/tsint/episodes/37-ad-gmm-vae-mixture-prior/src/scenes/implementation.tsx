import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, CodeBlock, KV, Verdict, LinePlot, Stat } from "../shared";

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  const mod = M.modules[0];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：模块形状 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 980 }}>
            <Card label="模块 · Ch04 / GMMVAE.hs" accent={C.violet}>
              <Row name="行数" value={mod.lines + " 行"} note={mod.cases + " 条单元测试，全部纯函数"} width={930} />
              <Row name="复用" value="上一集的编码器与两个头" note="新增的是先验那一侧" width={930} />
              <Row name="新增" value="混合密度 · 分量后验 · EM 一步 · k-means 起点" note="梯度手写" width={930} />
              <Row name="训练循环" value="每二十轮一次 EM" note="六十轮后启用 k-means 重新初始化" width={930} />
            </Card>
            <Body style={{ marginTop: 20, width: 930 }}>
              顺序固定，同种子逐位可复现。有限差分对到 1e-4，绝对容限 1e-7。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 288, width: 780 }}>
            <CodeBlock
              title="全部纯函数，没有随机数"
              width={760}
              lines={[
                { t: "score    :: GMMVAE -> Matrix -> V.Vector Double", hi: true },
                { t: "logMix   :: GMMVAE -> V.Vector Double -> Double" },
                { t: "respOf   :: GMMVAE -> V.Vector Double -> V.Vector Double" },
                { t: "emStep   :: GMMCfg -> GMMVAE -> Matrix -> GMMVAE" },
                { t: "kmeans   :: Int -> Int -> Matrix -> (Matrix, V.Vector Int)" },
                { t: "trainGMMVAECurve :: GMMCfg -> GMMVAE -> Matrix -> [GMMVAE]" },
                { t: "" },
                { t: "  -- 分量密度走 log-sum-exp；协方差走 Cholesky+jitter", dim: true },
                { t: "  -- 梯度手写，与有限差分逐参数对账", dim: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页二：联合训练为什么只当诊断 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 980 }}>
            <Card label="联合训练 · EM 与梯度一起走" accent={C.coral}>
              <Row name="不加正则" value={M.gmm.emBefore.toFixed(4) + " → " + M.gmm.emAfter.toFixed(3)} note="EM 一步把协方差压到零，平均对数密度跳到 18" color={C.coral} width={930} />
              <Row name="加正则" value={M.gmm.emReg.toFixed(4)} note="协方差对角线 +0.05，权重下限 0.02" width={930} />
              <Row name="结论" value="能跑，学不到" note="从 -0.5252 到 -0.5261，没有变好" width={930} />
            </Card>
            <Body style={{ marginTop: 18, width: 930 }}>
              数字变大了，模型死了。这是一个塌缩，不是一个改进——不先证明模型没死，就不能拿它的分数说话。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 288, width: 780 }}>
            <LinePlot
              width={760}
              height={300}
              series={[{ values: M.series.gmmLoss, color: C.coral, name: "联合训练损失" }]}
              title={"每一轮的平均损失 · 首 " + M.gmm.lossFirst.toFixed(1) + " 末 " + M.gmm.lossLast.toFixed(1)}
              yFmt={(v) => v.toFixed(0)}
            />
            <Card label="两段式 · 冻结编码器再 EM 六十步" accent={C.violet} style={{ marginTop: 14 }}>
              <Row name="权重轨迹" value={"均分 → " + M.fit.pi.map((p) => p.toFixed(2)).join(" / ")} note="一直是一个主分量" width={730} />
              <Row name="最大分量" value={M.fit.piMax.toFixed(3)} note="真实数据没有四个清晰模式" width={730} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：K=1 等价与数值兜底 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="最后一条硬测试 · K 等于一" accent={C.cyan}>
              <Row name="设置" value="一个分量，权重一" note="均值零、协方差单位阵，固定" width={950} />
              <Row name="损失" value={M.k1.lossIdentical ? "与上一集 VAE 逐位相同" : "不同"} note="不是近似，是相等" color={C.cyan} width={950} />
              <Row name="参数" value={M.k1.paramsIdentical ? "也逐位相同" : "不同"} note="编码器与两个头同一条路径" color={C.cyan} width={950} />
              <Row name="首轮损失" value={M.k1.lossFirst.toFixed(4)} note="从同一个种子出发" width={950} />
            </Card>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Verdict ok={M.k1.lossIdentical} label="损失逐位一致" />
              <Verdict ok={M.k1.paramsIdentical} label="参数逐位一致" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 288, width: 700 }}>
            <Card label="数值兜底 · 两个坑" accent={C.amber}>
              <Row name="近奇异协方差" value={"jitter 后 " + M.stability.jitterLogP.toFixed(2)} note={"直接算 log-det 是 " + M.stability.naiveLogDet} width={640} />
              <Row name="远端八维一百" value={"log-sum-exp " + M.stability.stableFar.toFixed(0)} note={"朴素写法是 " + M.stability.naiveFar} width={640} />
            </Card>
            <Stat label="这两条都写成了检查" value="不藏在备注里" sub="朴素写法的失败同样写进证据" valueSize={34} accent={C.amber} style={{ marginTop: 20 }} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
