import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat,
  Row, CodeBlock, CheckGrid, fmtInt, fmtF, fmtM,
} from "../shared";

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>三个模块，五十八个新测试。</div>
            <Body style={{ marginTop: 20, width: 860 }}>
              度量模块管混淆矩阵、逐类指标、平均秩与临界差；DTW 模块管距离、带宽、路径与 1-NN；弹性集成模块管四个距离、留一权重与投票。全部手写，不调库。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
              <Stat label="度量" value="24 测试" sub="Metrics.hs" valueColor={C.cyan} valueSize={38} />
              <Stat label="DTW" value="16 测试" sub="Dtw.hs" valueColor={C.amber} valueSize={38} />
              <Stat label="集成" value="18 测试" sub="ElasticEnsemble.hs" valueColor={C.violet} valueSize={38} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 300, width: 750 }}>
            <Card label="仓库位置" accent={C.violet} pad={22}>
              <CodeBlock
                width={700}
                lines={[
                  { t: "src/TsBase/Algos/Ch05/Metrics.hs" },
                  { t: "src/TsBase/Algos/Ch05/Dtw.hs" },
                  { t: "src/TsBase/Algos/Ch05/ElasticEnsemble.hs" },
                  { t: "" },
                  { t: "app/Ch05MetricsEvidence.hs", hi: true },
                ]}
              />
              <Body style={{ marginTop: 14, fontSize: FT.meta }}>
                证据程序单独一个模块，命令行入口叫 evidence-ch05-metrics。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：两种向量 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>boxed 与 unboxed，不能混。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              度量模块用 boxed 向量，因为要装元组与嵌套表；DTW 的序列是 unboxed Double 数组，省内存也快。混用时索引操作符与 sum 都不一样，编译器连报六个类型错。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Chip color={C.coral}>本集最花时间的坑</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 300, width: 810 }}>
            <Card label="两套 import" accent={C.amber} pad={22}>
              <CodeBlock
                width={760}
                lines={[
                  { t: "-- Metrics：boxed" },
                  { t: "import qualified Data.Vector as VB" },
                  { t: "" },
                  { t: "-- Dtw：unboxed" },
                  { t: "import qualified Data.Vector.Unboxed as V" },
                  { t: "type Series = V.Vector Double", hi: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：带宽 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>带宽是参数，不是常数。</div>
            <Body style={{ marginTop: 20, width: 820 }}>
              接口写成整数参数，证据里固定传六。带宽六时留一准确率零点四一六七；不带带宽约束掉到零点三五，差六点七个百分点。约束本身在起作用。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="带宽 6" value={fmtF(M.main.dtw.acc, 4)} width={800} />
              <Row name="无约束" value={fmtF(M.main.dtwFree.acc, 4)} color={C.coral} width={800} />
              <Row name="差值" value={fmtM((M.main.dtw.acc - M.main.dtwFree.acc) * 100, 1) + " 个百分点"} width={800} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 300, width: 820 }}>
            <Card label="签名" accent={C.cyan} pad={22}>
              <CodeBlock
                width={770}
                lines={[
                  { t: "dtwBand :: Int" },
                  { t: "        -> Series -> Series" },
                  { t: "        -> Maybe (Double, [(Int,Int)])", hi: true },
                  { t: "" },
                  { t: "-- 带外格子 = +infinity" },
                  { t: "-- 终点不可达则 Nothing" },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：留一权重 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>权重用留一算，不用训练集拟合。</div>
            <Body style={{ marginTop: 20, width: 860 }}>
              每个距离各跑一次留一：每次留一个窗，用剩下五十九个找最近邻，数对错。准确率减去三分之一，负数截断，再归一化。这样权重反映的是「这个距离在没见过它自己的窗时有多准」。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 790 }}>
            <Card label="四步" accent={C.violet} pad={22}>
              <Row name="1 · 留一准确率" value="acc_m" width={720} />
              <Row name="2 · 扣随机" value="acc_m − 1/3" width={720} />
              <Row name="3 · 截断" value="max(0, ·)" width={720} />
              <Row name="4 · 归一化" value="w_m = s_m / Σ s" width={720} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：确定性 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>合成数据用写死的线性同余。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              合成对照要能复现，所以不用系统随机源。线性同余每步乘一万一千零三十五万一千五百二十四，加一万二千三百四十五，对二的三十一次方取模。换机器重跑，读数逐位一样。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 300, width: 820 }}>
            <Card label="lcgNext" accent={C.cyan} pad={22}>
              <CodeBlock
                width={770}
                lines={[
                  { t: "lcgNext :: Int -> Int" },
                  { t: "lcgNext s = mod (1103515245 * s + 12345)", hi: true },
                  { t: "               2147483648", hi: true },
                  { t: "" },
                  { t: "-- 高斯用 Box-Muller" },
                  { t: "-- 相位与噪声都可复现" },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：检查 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>二十项检查，一段跑完。</div>
            <Body style={{ marginTop: 20, width: 730 }}>
              数据八项、主任务四项、抽样四项、合成四项。每项都是一个明确的不变量：窗口数、标签配对、准确率范围、权重和为一、路径合法、合成数据在平移前后的准确率。全绿才允许提交。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
              <Chip color={C.cyan}>{M.meta.evidence.passed} / {M.meta.evidence.checks} PASS</Chip>
              <Chip color={C.amber}>{Math.round(M.meta.evidence.seconds)} 秒</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 900 }}>
            <Card label="四组检查" accent={C.cyan} pad={22}>
              <CheckGrid />
              <Body style={{ marginTop: 16, fontSize: FT.meta }}>
                测试总数 {fmtInt(M.meta.tests.assertions)} 条，{M.meta.tests.suites} 个套件；本集新增用例 {M.meta.newCases} 条。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
