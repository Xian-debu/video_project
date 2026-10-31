import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 定义：三条签名、三张错误表；判决不藏在注释里。 */

const Err: React.FC<{ name: string; text: string }> = ({ name, text }) => (
  <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: 8 }}>
    <div style={{ width: 330, fontFamily: FONT.mono, fontSize: FT.meta, color: C.coral }}>{name}</div>
    <Body size={FT.meta} style={{ flex: 1 }}>{text}</Body>
  </div>
);

export const SDefinitions: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.26, 0.5, 0.71]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个算法，三条签名。第一条，ADF。
          </div>
          <Build at={lf("definitions", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <CodeBlock
                title="src/TsBase/Algos/Ch02/Adf.hs"
                width={1120}
                at={lf("definitions", 0.05)}
                size={FT.code}
                lines={[
                  { t: "data AdfConfig = AdfConfig", hi: true },
                  { t: "  { acRegression :: Regression   -- 无常数 / 仅常数 / 带趋势" },
                  { t: "  , acLag        :: Maybe Int    -- 不给就按 Schwert 规则" },
                  { t: "  , acAlpha      :: Double       -- 只接受 0.01 / 0.05 / 0.10" },
                  { t: "  }" },
                  { t: "" },
                  { t: "adf :: AdfConfig -> V.Vector Double", hi: true },
                  { t: "    -> Either AdfError AdfResult", hi: true },
                  { t: "" },
                  { t: "data AdfResult = AdfResult" },
                  { t: "  { arTau :: Double, arSe :: Double" },
                  { t: "  , arCrit :: (Double, Double, Double)   -- 1% / 5% / 10%" },
                  { t: "  , arStationary :: Bool                 -- 判决在类型里" },
                  { t: "  }" },
                ]}
              />
            </div>
          </Build>
          <Build at={lf("definitions", 0.12)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Stat label="配置三样" accent={C.cyan} value="型 / 阶 / α" sub="回归型、滞后阶、显著性水平" style={{ height: 156 }} />
              <Card label="结果四样" accent={C.cyan} style={{ height: 236, marginTop: 14 }}>
                <Body size={FT.meta}>tau、标准误、三个临界值，还有一个布尔值：平稳还是不平稳。</Body>
                <div style={{ marginTop: 12 }}><Chip color={C.cyan}>判决写在类型里，不藏在注释里</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 760, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              显著性水平只接受百分之一、五、十；别的值，走错误分支。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二条，漂移性。输入一个整数 m，一条序列。
          </div>
          <Build at={lf("definitions", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <CodeBlock
                title="src/TsBase/Algos/Ch02/Shifting.hs"
                width={1120}
                at={lf("definitions", 0.32)}
                lines={[
                  { t: "shifting :: Int -> V.Vector Double", hi: true },
                  { t: "         -> Either ShiftingError Double", hi: true },
                  { t: "" },
                  { t: "-- m 是阈值线的条数" },
                  { t: "-- 九条线、九个「线以上」的中位数、归一化、再取中位数" },
                  { t: "" },
                  { t: "data ShiftingError", hi: true },
                  { t: "  = ShiftingTooFewLines Int" },
                  { t: "  | ShiftingTooShort Int" },
                  { t: "  | ShiftingNotFinite Int" },
                  { t: "  | ShiftingDegenerate" },
                ]}
              />
            </div>
          </Build>
          <Build at={lf("definitions", 0.39)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Stat label="书中口径" accent={C.amber} value="未给" sub="m 的默认值、归一化区间，书里都没有写" style={{ height: 176 }} />
              <Stat label="本集" accent={C.amber} value="m = 9" sub="演示用九条线；工程上可以用二十" style={{ height: 176, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.46)}>
            <div style={{ position: "absolute", left: PAD, top: 700, width: 1776 }}>
              <Card accent={C.coral} style={{ height: 130 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>换一个 m，结论会变；所以 m 必须是显式参数，不能藏在默认值里。</div>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三条，转移性。输入状态数 k，一条序列。
          </div>
          <Build at={lf("definitions", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <CodeBlock
                title="src/TsBase/Algos/Ch02/Transition.hs"
                width={1120}
                at={lf("definitions", 0.56)}
                lines={[
                  { t: "transition :: Int -> V.Vector Double", hi: true },
                  { t: "           -> Either TransitionError (Double, V.Vector (V.Vector Double))", hi: true },
                  { t: "" },
                  { t: "-- 第一个返回值是指标，第二个是三乘三的转移概率" },
                  { t: "-- 书中固定三个符号；这里用 k 表示" },
                  { t: "" },
                  { t: "data TransitionError", hi: true },
                  { t: "  = TransitionTooFewStates Int" },
                  { t: "  | TransitionTooShort Int" },
                  { t: "  | TransitionNotFinite Int" },
                ]}
              />
            </div>
          </Build>
          <Build at={lf("definitions", 0.63)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Stat label="输出两样" accent={C.violet} value="数 + 矩阵" sub="指标值，还有那张概率矩阵" style={{ height: 156 }} />
              <Stat label="k = 3" accent={C.violet} value="符号 ±1" sub="茅台符号只用到两态；002456 用到三态" style={{ height: 156, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 760, width: 1776 }}>
              <Body size={FT.body} color={C.inkDim}>三条签名共用一个约定：错误用 Either 返回，不抛异常；调用方必须处理。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三条签名，三张错误表：五、四、三，一共十二种失败。
          </div>
          <Build at={lf("definitions", 0.75)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="ADF · 五种失败" accent={C.cyan} style={{ height: 340 }}>
                <Err name="AdfTooShort" text="序列太短，回归做不下去" />
                <Err name="AdfNotFinite" text="序列里有非有限值" />
                <Err name="AdfLagOutOfRange" text="滞后不合法：负数，或比样本还大" />
                <Err name="AdfAlphaInvalid" text="显著性水平不在三档里" />
                <Err name="AdfRankDeficient" text="设计矩阵秩亏（常数序列、差分全零）" />
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.82)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 306, width: 592 }}>
              <Card label="漂移性 · 四种" accent={C.amber} style={{ height: 164 }}>
                <Err name="ShiftingTooFewLines" text="m 太小" />
                <Err name="ShiftingTooShort" text="序列太短" />
                <Err name="ShiftingNotFinite" text="有非有限值" />
                <Err name="ShiftingDegenerate" text="整条序列是常数" />
              </Card>
              <Card label="转移性 · 三种" accent={C.violet} style={{ height: 148, marginTop: 14 }}>
                <Err name="TransitionTooFewStates" text="状态数太小" />
                <Err name="TransitionTooShort" text="序列太短" />
                <Err name="TransitionNotFinite" text="有非有限值" />
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 680, display: "flex", gap: 26 }}>
              <Stat label="错误总数" accent={C.coral} value="12" sub="每一种都有一条测试" valueColor={C.coral} style={{ width: 574, height: 150 }} />
              <Stat label="抛异常" accent={C.cyan} value="0" sub="没有一种是靠运行时崩出来的" valueColor={C.cyan} style={{ width: 574, height: 150 }} />
              <Stat label="测试断言" accent={C.cyan} value={String(s.tests.suite)} sub="套件总数（含前面几集）" style={{ width: 574, height: 150 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.96)}>
            <div style={{ position: "absolute", left: PAD, top: 848, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              画面后面每出现一个数字，它要么对应一个错误分支，要么对应一条检查。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
