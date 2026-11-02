import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, K, KV, PAD, Pages, Row, Scene, SceneHead, fmtInt, pagesOf } from "../shared";
import { PrefilterPipe, SplitBar } from "../figs";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个模块，<br />一行一行写。</Body>
          <Body style={{ marginTop: 22 }}>
            指标是纯函数，选择是排序，网格是组合加打分。每个模块配黄金用例，十四个用例全部通过，才有资格跑证据。
          </Body>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>14 个用例</Chip>
            <Chip color={C.violet}>纯函数</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 660, top: 268, width: 1180 }}>
          <CodeBlock width={1160} title="src/TsBase/Algos/Ch06/Metrics.hs" lines={[
            { t: "mae :: VU.Vector Double -> VU.Vector Double -> Double", hi: true },
            { t: "mae y yhat = V.sum (V.zipWith (\\a b -> abs (a - b)) y yhat) / n", dim: true },
            { t: "", dim: true },
            { t: "mse :: VU.Vector Double -> VU.Vector Double -> Double", hi: true },
            { t: "mse y yhat = V.sum (V.zipWith (\\a b -> let e = a - b in e * e) y yhat) / n", dim: true },
            { t: "", dim: true },
            { t: "rmse y yhat = sqrt (mse y yhat)", dim: true },
            { t: "mape = mapeWith 1e-12 False   -- 分母截断，近零样本不跳过", dim: true },
          ]} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>数据切三段，<br />按年份。</Body>
          <Body style={{ marginTop: 24 }}>
            训练段到 2021 年底，验证段 2022 到 2023，测试段 2024。每只股票两千四百根以上日线，验证段至少四百八十个点，测试段二百四十二个点。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 18 }}>
            <KV k="训练" v={M.data.split.train[0] + "–" + M.data.split.train[1]} color={C.cyan} />
            <KV k="验证" v={M.data.split.valid[0] + "–" + M.data.split.valid[1]} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="三段切分：按时间，不随机" accent={C.cyan}>
            <SplitBar width={1030} />
          </Card>
          <Card label="候选池的三个版本" accent={C.violet} style={{ marginTop: 20 }}>
            <Row name="池 3" value="naive · exp · ar1" note="覆盖真值最优 75%" width={1000} color={C.cyan} />
            <Row name="池 5" value="+ ridge · sar12" note="覆盖 85%" width={1000} color={C.violet} />
            <Row name="全池" value="十个候选" note="覆盖 100%，但最贵" width={1000} color={C.inkFaint} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两百次拟合，<br />只算一次。</Body>
          <Body style={{ marginTop: 24 }}>
            每个候选在训练段拟合一次，得到一条全序列的逐点预测。验证段和测试段都复用这条预测，不重复拟合。十个候选乘二十只股票，就是两百次最小二乘。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>拟合 1 次</Chip>
            <Chip color={C.violet}>两段复用</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="单步预测：每个点都有预测值" accent={C.amber}>
            <Row name="朴素" value="ŷₜ = yₜ₋₁" note="昨天的收盘价" width={1000} color={C.cyan} />
            <Row name="漂移" value="ŷₜ = yₜ₋₁ + d" note="d 是训练段平均收益" width={1000} color={C.violet} />
            <Row name="AR(1)" value="ŷₜ = b₀ + b₁·yₜ₋₁" note="最小二乘两个参数" width={1000} color={C.amber} />
            <Row name="岭回归" value="五阶滞后 + λ" note="正规方程对角线加 λ" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            十个候选 × 二十只 = 200 次拟合 · 评测点 {fmtInt(M.prefilter.evalsFull)} 次（全池）
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>太贵就预筛：<br />先粗后细。</Body>
          <Body style={{ marginTop: 24 }}>
            第一步特征锁：估季节强度，过线的锁周期十二，没过线的锁周期四，顺手剔掉季节候选。第二步粗排：只用验证段前一百二十个点排一遍，留前四名，再在整段上精排。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 300, width: 1120 }}>
          <PrefilterPipe width={1080} />
          <Card label="省下来的评测点" accent={C.amber} style={{ marginTop: 22 }}>
            <Row name="全池遍历" value={fmtInt(M.prefilter.evalsFull)} note="十个候选 × 全验证段" width={1010} color={C.inkFaint} />
            <Row name="两阶段预筛" value={fmtInt(M.prefilter.evalsPre)} note={"十 × 120 + 四 × 全段，省 " + (M.prefilter.saved * 100).toFixed(1) + "%"} width={1010} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            本集 20 只股票全锁 m=4（季节强度都低于 0.64），共剔除 {M.prefilter.pruned} 个候选组合
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
