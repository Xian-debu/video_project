import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Chip, Body, Mono, Formula, CodeBlock, KV } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 12), pageAt("implementation", 24), pageAt("implementation", 36)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <CodeBlock
              title="src/TsBase/Algos/Ch03"
              width={1080}
              lines={[
                { t: "Copula.hs      gaussCopula :: Matrix -> Either CopulaError GaussCopula", hi: true },
                { t: "               gcCorr / gcMargins —— 相关矩阵与边缘分位分开存" },
                { t: "DdpmLoss.hs    ddpmLoss :: Denoiser -> Tensor -> (Double, Tensor)", hi: true },
                { t: "               前向闭式取样 + 噪声预测损失 + 手写反向" },
                { t: "Cnf.hs         cnfLogProb :: VectorField -> Tensor -> (Double, Tensor)", hi: true },
                { t: "               RK4 积分 + 仿射层 log|det| + 密度网格" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Card label="三个约定" accent={C.violet}>
              <div style={{ marginTop: 2 }}>
                <KV k="PIT" v="(rank − 0.5) / T" note="平均秩，避免并列名次造成偏置" />
                <KV k="时间步" v="⌊u(T−1)⌋+1" note="u 来自 seed+17，同 seed 逐位可复现" color={C.cyan} />
                <KV k="仿射层" v="shift → scale → mask" note="顺序固定，log|det| 只累加 scale" />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 852, width: CW }}>
            <Row name="规模" value="T=1000 · d=32 · 批 64 · 训练 400 步" note="DDIM 50 步、20 条路径；连续流 d=8、两层、RK4 20 步" width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1120 }}>
            <Card label="第一个坑 · 反向传播的转置" accent={C.coral} style={{ width: 1080 }}>
              <CodeBlock
                title="想的是一套，写的是另一套"
                width={1020}
                lines={[
                  { t: "resid_j = xt_j − pred_j        -- 残差，逐样本" },
                  { t: "jt k   = Σ_j resid_j * jac j k -- 对（jac 的）第 k 个输入求导", hi: true },
                  { t: "jt k   = Σ_j resid_j * jac k j -- 错误：转置了", dim: true },
                ]}
              />
              <Body size={FT.body} style={{ marginTop: 18 }}>
                损失仍然从 {M.ddpm.trainFirst.toFixed(4)} 掉到 {M.ddpm.trainLast.toFixed(4)} —— 转置后的梯度也是梯度，只是方向不对。
                同 seed 两次训练逐位相等并不能发现它；有限差分梯度检查才把它钉住。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Stat label="训练首步" value={M.ddpm.trainFirst.toFixed(4)} sub="初始损失，接近 log 方差" style={{ width: 558 }} />
            <Stat label="训练末步" value={M.ddpm.trainLast.toFixed(4)} sub="降了，但转置时同样会降" accent={C.coral} style={{ width: 558, marginTop: 18 }} />
            <Stat label="同 seed 损失" value={M.ddpm.sameSeed.toFixed(6)} sub="逐位相等 —— 复现性不是正确性" accent={C.amber} style={{ width: 558, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 856, width: CW }}>
            <Row name="另一 seed" value={M.ddpm.otherSeed.toFixed(6)} note="换 seed 损失不同，但仍在同一量级；所以「损失能降」从来不是梯度正确的证据" width={1640} color={C.amber} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1120 }}>
            <Card label="第二个坑 · RK4 权重写成两段" accent={C.amber} style={{ width: 1080 }}>
              <CodeBlock
                title="Cnf.hs · rk4Step"
                width={1020}
                lines={[
                  { t: "next = z + h/6 * (k3 + 2*k4)              -- 错误：只有后半段", dim: true },
                  { t: "next = z + h/6 * ((k1 + 2*k2) + (2*k3 + k4))", hi: true },
                ]}
              />
              <Body size={FT.body} style={{ marginTop: 18 }}>
                少掉前半段时误差仍然随步长变小，但四阶退化成近似二阶 —— 只错了两倍，肉眼很难怀疑。
                用步长减半看误差比：{M.cnf.rk4Err8.toExponential(2)} → {M.cnf.rk4Err16.toExponential(2)}，比值 {M.cnf.rk4Ratio.toFixed(3)}，接近 16 才是四阶。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Stat label="8 步误差" value={M.cnf.rk4Err8.toExponential(2)} sub="RK4，步长 h" style={{ width: 558 }} />
            <Stat label="16 步误差" value={M.cnf.rk4Err16.toExponential(2)} sub="步长减半" accent={C.cyan} style={{ width: 558, marginTop: 18 }} />
            <Stat label="误差比" value={M.cnf.rk4Ratio.toFixed(3)} sub="理论 2⁴ = 16" accent={C.amber} style={{ width: 558, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 856, width: CW }}>
            <Row name="第三个坑 · expm 的泰勒项" value="term / n，而非 term / k" note="矩阵指数求和时除错了下标，结果看起来平滑，往返误差却兜不住" width={1640} color={C.violet} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1120 }}>
            <Card label="第四个坑 · 端点与正定，都是静默 NaN" accent={C.violet} style={{ width: 1080 }}>
              <CodeBlock
                title="Copula.hs · 两处兜底"
                width={1020}
                lines={[
                  { t: "u = clip (rank − 0.5) / T  ε=1e-6  (1 − ε)", hi: true },
                  { t: "sigma = choleskyWith 1e-6 sigma0   -- 非正定时加抖动", hi: true },
                  { t: "z = invNormalCdf u                -- Acklam，误差 1.2e-9", dim: true },
                ]}
              />
              <Body size={FT.body} style={{ marginTop: 18 }}>
                排名取到 0 或 1，Φ⁻¹ 直接发散；Σ 非正定，Cholesky 的对角线上出现负数再开方。
                两种错都不会崩，只会在若干步之后让整条路径变成 NaN。证据要求 20 条路径全部有限，网格密度积分恰好为一。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Stat label="20 条路径有限" value={M.ddpm.allFinite ? "是" : "否"} sub="NaN 检查，不是目测" accent={C.cyan} style={{ width: 558 }} />
            <Stat label="密度积分" value={M.cnf.integral.toFixed(10)} sub="离散化之后仍然等于一" accent={C.violet} style={{ width: 558, marginTop: 18 }} />
            <Stat label="往返误差" value={M.cnf.roundtrip.toExponential(2)} sub="机器精度量级" accent={C.amber} style={{ width: 558, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 856, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="四条坑各有一条断言守着" />
            <Chip color={C.coral}>静默错误比崩溃贵</Chip>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

