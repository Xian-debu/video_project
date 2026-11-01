import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, Chip, CodeBlock } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 14), pageAt("implementation", 30)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1130 }}>
            <CodeBlock
              width={1080}
              title="src/TsBase/Algos/Ch04 · 三个模块"
              size={FT.code}
              lines={[
                { t: "-- Threshold.hs  三种阈值 + 拟合", hi: false },
                { t: "data Threshold = FixedThreshold Double", hi: false },
                { t: "               | QuantileThreshold Double", hi: false },
                { t: "               | SpotThreshold SpotCfg Double", hi: false },
                { t: "fitQuantile :: Double -> [Double] -> Threshold", hi: true, dim: false },
                { t: "applyThreshold :: Threshold -> Double -> Bool", hi: true },
                { t: "", dim: true },
                { t: "-- SupCls.hs  逻辑回归分类器", hi: false },
                { t: "trainLogisticChecked :: Config -> [Sample] -> Either SupClsError Logistic", hi: false },
                { t: "", dim: true },
                { t: "-- Smoothing.hs  移动平均 / 指数平滑", hi: false },
                { t: "residualZ :: SmoothCfg -> [Double] -> [Double]", hi: false },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1280, top: 300, width: 560 }}>
            <Card label="约定" accent={C.amber}>
              <Row name="窗长 C" value="100" width={520} />
              <Row name="步长 s" value="10" note="训练 1，推理 10" width={520} />
              <Row name="风险率" value={M.spot.risk} note="三档扫参：0.5% / 1% / 2%" width={520} />
              <Row name="尾部最小点" value={M.spot.tailMin} note="不足退回分位" width={520} />
              <Row name="分类器窗口" value={M.classifier.window + " 天"} width={520} />
              <Row name="训练轮数" value={M.classifier.epochs + " 轮"} note={"学习率 " + M.classifier.lr} width={520} />
            </Card>
            <Card label="四个坑的共同点" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                都不报错。分数照算，F1 照出，只是全错。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：前两个坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1090 }}>
            <Card label="第一个坑 · 分位数的方向" accent={C.coral}>
              <Body size={FT.body} color={C.ink}>
                q 是分位水平，不是超限率。要 1% 超限，传 0.99；传 0.01，阈值落到 0.0127，2641 个点被判异常。
              </Body>
              <CodeBlock
                width={1040}
                lines={[
                  { t: "fitQuantile 0.99 xs  -- 阈值 3.0844  ✓", hi: true },
                  { t: "fitQuantile 0.01 xs  -- 阈值 0.0127  ✗ 程序不报错", dim: false },
                ]}
              />
            </Card>
            <Card label="第二个坑 · 帕累托的方程退化" accent={C.coral} style={{ marginTop: 22 }}>
              <Body size={FT.body} color={C.ink}>
                极大似然两个方程，第二个在 xi 接近 0 时退化。直接牛顿迭代发散。改成剖面似然：xi 网格上扫，每个点解第一个方程，再三分细化；|xi| 小于 1e−6 走指数极限。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 300, width: 590 }}>
            <Card label="为什么这两条最贵" accent={C.amber}>
              <Body size={FT.body} color={C.ink}>
                第一条把判据方向弄反，整条流水线还在跑；第二条让拟合不发散但也不准。两条都只能靠断言钉住：一个断言分位方向，一个断言合成数据上的回收。
              </Body>
            </Card>
            <Card label="验证方式" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="分位方向" value="q=0 → τ=min" note="四个数的手算例子" width={550} />
              <Row name="GPD 合成" value={fmtF(M.spot.synTau, 4)} note="x=(1−u)^(−0.3)−1，两万点" width={550} />
              <Row name="合成超限率" value={M.spot.synRate} note="目标 0.001；回收到这个量级" width={550} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：后两个坑 + 分类器参数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1090 }}>
            <Card label="第三个坑 · 计划里的黄金值写错了" accent={C.coral}>
              <Body size={FT.body} color={C.ink}>
                移动平均的初始值，计划里手算成 NaN NaN 一 一 一，实际是 NaN NaN 一点五 一点五 一点五 —— 前 k 个位置没有完整窗口，窗口内均值是 1.5。计划写错，断言把它钉住。
              </Body>
              <Row name="计划值" value="NaN NaN 1 1 1" color={C.coral} width={1040} />
              <Row name="实际值" value={M.golden.maGold} color={C.cyan} width={1040} />
            </Card>
            <Card label="第四个坑 · 维度不匹配" accent={C.coral} style={{ marginTop: 22 }}>
              <Body size={FT.body} color={C.ink}>
                训练样本长度不一致时，报错必须指出是第几个样本、长度多少。只说维度不对，等于没说 —— 这是排查成本最高的一类错误。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 300, width: 590 }}>
            <Card label="Checked 版本" accent={C.violet}>
              <Body size={FT.body} color={C.ink}>
                三个模块都有返回 Either 的版本：形状不对返回 Left，不静默截断，不静默广播。上一集留下的规矩，这一集继续用。
              </Body>
            </Card>
            <Card label="分类器的参数" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="正样本权重" value={fmtF(M.classifier.posWeight, 2)} note="异常太少，必须加权" width={550} />
              <Row name="训练窗口" value={M.classifier.trainWindows.toLocaleString("en-US")} width={550} />
              <Row name="测试窗口" value={M.classifier.testWindows.toLocaleString("en-US")} width={550} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
