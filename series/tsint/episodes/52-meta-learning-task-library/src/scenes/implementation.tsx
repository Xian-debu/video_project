import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个模块，<br />零外部依赖。</Body>
          <Body style={{ marginTop: 22 }}>
            元学习库九个函数，从元特征到交叉验证；表征库实现空洞卷积栈与闭式自监督；证据程序把两者接起来，一遍算出所有读数。全部用 Haskell 写，没有机器学习框架。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>MetaLearn</Chip>
            <Chip color={C.violet}>Ts2Vec</Chip>
            <Chip color={C.amber}>Ch06MetaEvidence</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 288, width: 1080 }}>
          <Card label="模块与职责" accent={C.cyan}>
            <Row name="MetaLearn" value="9 个函数" note="metaFeatures / centerRows / fitPredictor / selectModel / folds / classMeanBaseline / hitRate / avgRank / regret" width={1000} />
            <Row name="Ts2Vec" value="编码器" note="空洞卷积栈 + 分层池化 + 闭式预测头" width={1000} color={C.violet} />
            <Row name="Evidence" value="29 项" note="数据、元学习、交叉验证、表征、演示" width={1000} color={C.cyan} />
            <Row name="黄金用例" value="6 + 6" note="两个库各自钉住契约" width={1000} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>三个核心<br />函数。</Body>
          <Body style={{ marginTop: 20, fontSize: FT.label }}>
            metaFeatures 把任务变成四维向量；fitPredictor 用元样本解多输出岭回归；selectModel 对一条特征选冠军。辅助函数负责中心化、切折、基线和三个判据。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="正则" v="0.1" color={C.cyan} />
            <KV k="折数" v="5" color={C.violet} />
            <KV k="用例" v="6" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 240, width: 1070 }}>
          <CodeBlock
            title="TsBase/Algos/Ch06/MetaLearn.hs"
            width={1030}
            lines={[
              { t: "metaFeatures :: Dataset -> [Double]", hi: true },
              { t: "metaFeatures d = [mean xs, std xs, acf1 xs, seasonStrength xs]" },
              { t: "" },
              { t: "fitPredictor :: Double -> [[Double]] -> [[Double]] -> Predictor", hi: true },
              { t: "fitPredictor lam xs ys = solve (xtx + lam*I) (xty xs ys)" },
              { t: "" },
              { t: "selectModel :: Predictor -> [Double] -> Int", hi: true },
              { t: "selectModel p f = argmin (apply p (1 : f))" },
            ]}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>表征：保留结构，<br />换掉训练。</Body>
          <Body style={{ marginTop: 20, fontSize: FT.label }}>
            书里用对比学习训练编码器，纯手写反向传播单机跑不动。我们保留空洞卷积栈加分层池化，把训练换成闭式岭回归：用整段表示预测后段表示，前六成丢掉，只学不变性。这个偏差记在计划的偏差表里。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 236, width: 1070 }}>
          <CodeBlock
            title="TsBase/Algos/Ch06/Ts2Vec.hs · 闭式自监督"
            width={1030}
            lines={[
              { t: "-- 输入整段，丢掉前 60%，只保留后 40% 作目标" },
              { t: "encode :: Encoder -> [Double] -> [Double]" },
              { t: "" },
              { t: "selfSupervised :: [[Double]] -> Predictor" },
              { t: "selfSupervised rows =" },
              { t: "  let h = map (encode enc . take n) rows", hi: true },
              { t: "      y = map (drop (n*6 `div` 10)) rows" },
              { t: "  in  ridge 1.0 h y   -- 一次求逆，无随机性", hi: true },
            ]}
          />
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            同参数两次编码逐位相等 · 相关系数 {M.corr.toFixed(4)}
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>证据程序：<br />先算，再查。</Body>
          <Body style={{ marginTop: 20, fontSize: FT.label }}>
            先跑三千次拟合并计时，再跑二十九项检查，最后把读数写成 JSON。检查全部是实测陈述，失败会中止，不会静默通过。一条命令重跑，数字全部来自同一份输出。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="检查" v={M.checks.length + "/" + M.checks.length} color={C.cyan} />
            <KV k="耗时" v={M.seconds.toFixed(1) + "s"} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 230, width: 1090 }}>
          <CodeBlock
            title="cabal run re24-ch06-meta-evidence"
            width={1050}
            lines={[
              { t: "data    tasks 300 bars [1535,2431] industries 53" },
              { t: "meta    hitStats 0.2733 classMean 0.3867 naive 0.4333" },
              { t: "cv      5 folds [0.2,0.2333,0.4,0.25,0.2833]" },
              { t: "ts2vec  dim 64 hit 0.2667 gap -0.0067", hi: true },
              { t: "demo    corr 0.9983 regret 0.0263/3.2029" },
              { t: "checks  29/29 passed in " + M.seconds.toFixed(1) + " s", hi: true },
            ]}
            size={FT.meta}
          />
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
