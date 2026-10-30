import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

const Mod: React.FC<{ name: string; api: string; err: string; color: string; width: number }> = ({ name, api, err, color, width }) => (
  <Card label={name} accent={color} style={{ width, height: 230 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta + 2, color: C.ink, lineHeight: 1.5 }}>{api}</div>
    <K style={{ display: "block", marginTop: 14 }}>{err}</K>
  </Card>
);

export const SImplementation: React.FC = () => {
  const meta = M.meta;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={[0, 0.36, 0.69]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个模块互相不依赖，只依赖 vector；没有 IO，没有随机数。
          </div>
          <Build at={lf("implementation", 0.06)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Mod name="TsBase.Algos.Ch02.Diff" api="diff :: Int -> Maybe Int -> Vector Double -> Either DiffError (Vector Double)" err="DiffBadOrder / DiffBadSeason / DiffTooShort" color={C.cyan} width={574} />
              <Mod name="TsBase.Algos.Ch02.LogT" api="logT :: LogBase -> Vector Double -> Either LogTError (Vector Double)" err="LogNonPositive index value" color={C.amber} width={574} />
              <Mod name="TsBase.Algos.Ch02.ZScore" api="zscore :: Maybe (Double, Double) -> Vector Double -> Either ZScoreError (Vector Double, Double, Double)" err="ZSTooShort / ZSConstantSeries / ZSBadScale" color={C.violet} width={574} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.12)}>
            <div style={{ position: "absolute", left: PAD, top: 580, width: 1180 }}>
              <CodeBlock width={1180} at={lf("implementation", 0.13)} title="diff：先拒绝非法阶数，再逐次差分" lines={[
                { t: "diff d mSeason xs" },
                { t: "  | d < 0            = Left DiffBadOrder", dim: true },
                { t: "  | V.null xs        = Right V.empty" },
                { t: "  | V.length xs <= d = Left DiffTooShort", dim: true },
                { t: "  | otherwise        = seasonally mSeason (iterateN d diffOnce xs)" },
                { t: "  where seasonally Nothing  = Right" },
                { t: "        seasonally (Just l) = diffSeasonal l", hi: true },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.18)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 580, width: 592 }}>
              <Card accent={C.cyan} style={{ height: 300 }}>
                <K>为什么先普通后季节</K>
                <Body style={{ marginTop: 10 }}>两个算子可交换，但先固定口径，结果才可复现。输出长度 = 输入 − d − L。</Body>
                <Body style={{ marginTop: 10 }}>时间戳要一起截掉，不是只截数值。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            两个容易写错的地方：对数先检查，标准化用两遍扫描。
          </div>
          <Build at={lf("implementation", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 900 }}>
              <CodeBlock width={900} at={lf("implementation", 0.41)} title="logT：先找非正数，找到就拒绝" lines={[
                { t: "logT base xs = case V.findIndex (<= 0) xs of" },
                { t: "  Just i  -> Left (LogNonPositive (i + 1) (xs V.! i))", hi: true },
                { t: "  Nothing -> Right (V.map (logBaseFn base) xs)" },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.45)}>
            <div style={{ position: "absolute", left: PAD + 940, top: 310, width: 856 }}>
              <CodeBlock width={856} at={lf("implementation", 0.46)} title="zscore：先求 μ、σ，再逐点变换" lines={[
                { t: "zscore Nothing xs = do" },
                { t: "  (mu, sd) <- zscoreStats xs   -- 两遍扫描，总体口径", dim: true },
                { t: "  if sd == 0 then Left ZSConstantSeries" },
                { t: "    else Right (V.map (\\x -> (x - mu) / sd) xs, mu, sd)", hi: true },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.52)}>
            <div style={{ position: "absolute", left: PAD, top: 620, width: 1776 }}>
              <div style={{ display: "flex", gap: 18 }}>
                <Card accent={C.coral} style={{ width: 580 }}><K>为什么不用 E[x²]−μ²</K><Body style={{ marginTop: 8 }}>大基线上两个大数相减，有效位被吃掉；测试用 1e8 基线钉住。</Body></Card>
                <Card accent={C.violet} style={{ width: 580 }}><K>反变换</K><Body style={{ marginTop: 8 }}>返回 μ、σ，调用方可以逐位还原；最大误差 1.1e−13。</Body></Card>
                <Card accent={C.amber} style={{ width: 580 }}><K>常数序列</K><Body style={{ marginTop: 8 }}>σ=0 时拒绝，而不是除以零得到 NaN。</Body></Card>
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三十四条新断言；整套四百七十五条，全过。
          </div>
          <Build at={lf("implementation", 0.73)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Stat label="DiffSpec" accent={C.cyan} value="15" sub="黄金值、季节、随机游走、错误分支" style={{ width: 574, height: 230 }} />
              <Stat label="LogSpec" accent={C.amber} value="9" sub="黄金值、零与负数、乘法变加法、异方差" style={{ width: 574, height: 230 }} />
              <Stat label="ZScoreSpec" accent={C.violet} value="10" sub="μ/σ、Σz、Σz²、反变换、1e8 基线" style={{ width: 574, height: 230 }} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 600, width: 1180 }}>
              <CodeBlock width={1180} at={lf("implementation", 0.79)} title="测试命令" lines={[
                { t: "docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal test'", hi: true },
                { t: "35 suites / 475 cases / 0 failures" },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.84)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 600, width: 592 }}>
              <div style={{ marginTop: 0 }}>
                <Chip color={C.cyan}>证据 {meta.checks.total} 条检查 · {meta.checks.failed} 失败</Chip>
              </div>
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                手算 {meta.checks.manual} 条、真实数据 {meta.checks.data} 条、合成 {meta.checks.synthetic} 条。
              </Body>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
