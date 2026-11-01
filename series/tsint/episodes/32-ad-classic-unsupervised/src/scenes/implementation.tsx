import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, fmtInt, pageAt, Pages, Scene, SceneHead, Card, Row, KV, Body, CodeBlock, Verdict } from "../shared";

const MODULE_LINES = [
  { t: "-- src/TsBase/Algos/Ch04 · 三个模块，一个核心函数" },
  { t: "type Matrix = V.Vector (V.Vector Double)" },
  { t: "kmeans :: Int -> Int -> Matrix -> ([V.Vector Double], V.Vector Int)", hi: true },
  { t: "kmeansScore :: [V.Vector Double] -> V.Vector Double -> Double" },
  { t: "lof :: Int -> Matrix -> V.Vector Double", hi: true },
  { t: "lrd / reachDist / kNearest  内部，全部平方复杂度" },
  { t: "iforest :: IForestCfg -> Matrix -> V.Vector Double", hi: true },
  { t: "iforestScore :: IForestCfg -> Matrix -> Matrix -> V.Vector Double" },
  { t: "data IForestCfg = IForestCfg { ifTrees, ifSampleSize, ifSeed }" },
  { t: "defaultIForest = IForestCfg 100 256 42" },
];

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 12), pageAt("implementation", 25)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：接口 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            <CodeBlock title="三个模块的接口" lines={MODULE_LINES} width={1060} size={FT.code} />
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              训练和查询分成两个矩阵：阈值在训练集上定一次，测试段只读，不会用未来数据改分数。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 288, width: 600 }}>
            <Card label="约定" accent={C.cyan}>
              <Row name="K" value={String(M.params.k)} note="簇数" width={550} />
              <Row name="迭代" value={String(M.params.iters)} note="Lloyd" width={550} />
              <Row name="邻居 k" value={String(M.params.lofK)} note="LOF" width={550} />
              <Row name="树" value={String(M.params.trees)} note={"每棵 ψ=" + M.params.psi} width={550} />
              <Row name="小簇" value={M.params.smallShare * 100 + "%"} note="小于即标出" width={550} />
            </Card>
            <Card label="纯函数" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                三个模块都是纯函数：同样输入同样输出，种子固定到每一个随机选择。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：四个坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="四个坑" accent={C.coral}>
              <Row name="坑一 · 初始化" value="k-means++" note="按距离平方加权选种子，固定 seed 42，否则标签逐轮漂移" width={960} />
              <Row name="坑二 · 空簇" value="保留旧簇心" note="某一轮没有簇分到点时，直接丢弃会让簇数变少" width={960} />
              <Row name="坑三 · 复杂度" value="每只股票一块" note="平方复杂度，两万样本就是两亿次距离" width={960} />
              <Row name="坑四 · 归一化" value="除以 c(ψ)" note="路径长度用精确调和数归一，符号方向别写反" width={960} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 20 }}>
              四个坑有共同点：都不报错。分数照算，F1 照出，只是全错。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 296, width: 630 }}>
            <Card label="为什么是转导块" accent={C.amber}>
              <Body size={FT.body} color={C.ink}>
                转导：检测时同时看到训练点和测试点。无监督允许这样，因为不用标签；如果换成需要标签的模型，这就不成立了。
              </Body>
            </Card>
            <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
              <Verdict ok label="形状检查通过" />
              <Verdict ok label="确定性通过" />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：口径偏差 + 断言 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="一条口径偏差，必须写在证据里" accent={C.coral}>
              <Row name="原计划" value="整窗 192 维" note="8 只股票 × 24 天" width={960} />
              <Row name="实测 192 维" value={"best F1 " + fmtF(0.1835, 4)} note="尖峰只动 1–3 个坐标，被距离集中稀释" width={960} />
              <Row name="PCA 降到 10 维" value={fmtF(0.0910, 4)} note="更差：单点尖峰在降维里被平均掉" width={960} />
              <Row name="最终样本" value="24 维 / 一只股票" note="2 万样本，单点尖峰不再被稀释" width={960} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              这不是为了把数做漂亮：偏差本身是这一集的一条边界，192 维的失败读数也写进了 SELF-AUTH。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 296, width: 630 }}>
            <Card label="断言" accent={C.cyan}>
              <Row name="本集新增" value={M.meta.tests.new + " 条"} note="三个 spec" width={580} />
              <Row name="全量" value={M.meta.tests.suites + " 套 · " + fmtInt(M.meta.tests.asserts) + " 条"} note="零失败" width={580} />
              <Row name="检查" value={M.meta.checks + " / " + M.meta.checkTotal} note={"耗时 " + M.meta.runtimeSec + " 秒"} width={580} />
            </Card>
            <Card label="下一节" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>读数：同一批注入，三种几何，三十四个检查。</Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
