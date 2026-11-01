import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, CodeBlock, LinePlot, K, Stat } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 9), pageAt("implementation", 19), pageAt("implementation", 30)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个模块与测试 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1120 }}>
            <Card label="三个模块，全部纯函数" accent={C.cyan}>
              {M.modules.map((m) => (
                <Row key={m.id} name={m.file + "  ·  " + m.name} value={m.lines + " 行"} note={m.cases + " 条单元测试"} width={1070} />
              ))}
            </Card>
            <Card label="测试与证据" accent={C.amber} style={{ marginTop: 20 }}>
              <Row name="新增测试" value={M.meta.tests.newAsserts + " 条"} note={M.meta.tests.newSuites + " 个套件，仓库合计 " + M.meta.tests.asserts.toLocaleString("en-US") + " 条"} width={1070} />
              <Row name="证据检查" value={M.meta.checks} note={M.meta.elapsedSec + " 秒，一次跑完"} width={1070} />
              <Row name="提交" value={M.meta.commits.units} note={"证据 " + M.meta.commits.evidence + "，数据 " + M.meta.commits.data} width={1070} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 292, width: 610 }}>
            <Stat label="仓库测试" value={M.meta.tests.asserts.toLocaleString("en-US")} sub={M.meta.tests.suites + " 个套件全绿"} accent={C.cyan} />
            <Stat label="本集新增" value={String(M.meta.tests.newAsserts)} sub="三个套件" accent={C.violet} style={{ marginTop: 18 }} />
            <Stat label="证据耗时" value={M.meta.elapsedSec + " s"} sub="单线程，确定性" accent={C.amber} style={{ marginTop: 18 }} />
          </div>
        </AbsoluteFill>

        {/* 页二：AssocDiff 接口 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <CodeBlock
              title="TsBase.Algos.Ch04.AssocDiff"
              width={970}
              size={FT.code}
              lines={[
                { t: "gaussianPrior  :: Double -> Int -> Matrix" },
                { t: "seriesAssoc    :: AssocCfg -> Matrix -> Matrix", hi: true },
                { t: "klDiv          :: Vector Double -> Vector Double -> Double" },
                { t: "symKl          :: Matrix -> Matrix -> Vector Double", hi: true },
                { t: "assocScore     :: AssocCfg -> Matrix -> Vector Double" },
                { t: "bandShare      :: Int -> Matrix -> Double" },
                { t: "rowEntropy     :: Vector Double -> Double" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1120, top: 288, width: 730 }}>
            <Card label="四个不变量，测试锁死" accent={C.cyan}>
              <Row name="先验行和" value={M.golden.priorRowSumMaxDev.toExponential(1)} note="偏差不超过机器精度" width={680} />
              <Row name="注意力行和" value={M.golden.rowSumMaxDev.toExponential(1)} note="softmax 之后每行恰好归一" width={680} />
              <Row name="自身 KL" value={M.golden.symKlSelf.toFixed(1)} note="同一矩阵比自己是 0" width={680} />
              <Row name="温度无关性" value="独立" note="σ 只进先验，已单独立测试" width={680} color={C.amber} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 700 }}>
              这几个不变量是排版之外唯一值得背下来的东西：行归一、自比为 0、两个旋钮互不越界。它们出错时分数会「看起来还行」但完全不可信。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：TranAD 手写梯度 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <CodeBlock
              title="TsBase.Algos.Ch04.TranAD"
              width={970}
              size={FT.code}
              lines={[
                { t: "initModel  :: TranCfg -> TransModel     -- 7 组参数" },
                { t: "stage1     :: TransModel -> Vec -> Vec   -- 100 -> 32 -> 100" },
                { t: "focusOf    :: Vec -> Vec -> Vec          -- (x - x1)^2 / 中位残差" },
                { t: "stage2     :: TransModel -> Vec -> Vec -> Vec   -- [x; f] -> 64 -> 100" },
                { t: "sampleGrad :: TransModel -> Vec -> Vec   -- 手写，与损失一致", hi: true },
                { t: "tranScore  :: TransModel -> Vec -> Double  -- 残差 / 中位残差" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1120, top: 288, width: 730 }}>
            <Card label="梯度是怎么对的" accent={C.violet}>
              <Row name="问题" value="焦点漏反传" note="把 f 当常数，梯度就对不上" width={680} color={C.coral} />
              <Row name="修法" value="−2(x − x1)" note="f 依赖 x1，要接着往下走" width={680} />
              <Row name="核对" value={M.golden.gradRel.toExponential(2)} note="中心差分的相对误差" width={680} color={C.cyan} />
              <Row name="参数总数" value={M.params.tranParams.toLocaleString("en-US")} note="全部手写反向" width={680} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 700 }}>
              一开始梯度的相对误差是 1.9e-2，而且换步长不变 —— 说明不是数值问题，是漏了一项。补上焦点对 x1 的导数之后掉到 7.75e-11。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页四：训练曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1100 }}>
            <Card label="训练损失（每 10 轮记一次）" accent={C.violet}>
              <LinePlot
                width={1040}
                height={420}
                at={6}
                legend
                series={[{ name: "损失", color: C.violet, values: M.series.tranadLoss }]}
                yFmt={(v: number) => v.toFixed(2)}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1220, top: 292, width: 630 }}>
            <Card label="收敛读数" accent={C.cyan}>
              <Row name="第 1 轮" value={M.series.tranadLoss[0].toFixed(4)} note="起步" width={580} />
              <Row name="第 10 轮" value={M.series.tranadLoss[1].toFixed(4)} note="掉得最快的一段" width={580} />
              <Row name="第 40 轮" value={M.series.tranadLoss[4].toFixed(4)} note="训练结束" width={580} color={C.cyan} />
              <Row name="收缩倍数" value={(M.series.tranadLoss[0] / M.series.tranadLoss[4]).toFixed(1) + " 倍"} note="80% 的损失在第 10 轮内消掉" width={580} />
            </Card>
            <Card label="确定性" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="初始化" value={"种子 " + M.inject.seed} note="自带的 LCG，不依赖库" width={580} />
              <Row name="打乱" value="固定顺序" note="每轮同一个顺序" width={580} />
              <Row name="重复跑" value="逐位相同" note="证据 JSON 可逐字节比对" width={580} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
