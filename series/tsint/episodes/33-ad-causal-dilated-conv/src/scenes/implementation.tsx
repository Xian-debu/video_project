import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtInt, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, CodeBlock, Chip } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 11), pageAt("implementation", 23), pageAt("implementation", 36)];
  const p = M.params;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：模块与接口 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1080 }}>
            <CodeBlock
              width={1040} size={FT.code}
              title="-- src/TsBase/Algos/Ch04 · 三个模块，一个核心函数"
              lines={[
                { t: "data Tensor = Tensor { tsRows, tsCols :: Int, tsData :: V.Vector Double }" },
                { t: "conv1d          :: PadMode -> ConvCfg -> Tensor -> Tensor", hi: true },
                { t: "receptiveFieldOf :: Int -> [Int] -> Int" },
                { t: "perturbRange    :: [ConvCfg] -> Int -> Double -> Int -> Int" },
                { t: "dualisticConv   :: Double -> Double -> Int -> Int -> Matrix -> Matrix", hi: true },
                { t: "initTCN         :: TCNCfg -> TCN" },
                { t: "tcnRecon        :: TCN -> V.Vector Double -> V.Vector Double", hi: true },
                { t: "tcnScore        :: TCN -> V.Vector Double -> Double" },
                { t: "tcnTrain        :: TCNCfg -> V.Vector (V.Vector Double) -> (TCN, [(Double, Double)])" },
              ]}
            />
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 1000 }}>
              打分为分数 = 窗口重构误差的平方均值。误差大，分数大；阈值在训练段定一次，测试段只读。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 650 }}>
            <Card label="约定" accent={C.cyan}>
              <Row name="核 k" value={String(p.k)} note="四层共用" width={580} />
              <Row name="膨胀" value={p.dilations.join(" / ")} note="四层" width={580} />
              <Row name="隐藏" value={String(p.hidden)} note="单通道" width={580} />
              <Row name="参数量" value={fmtInt(p.paramCount)} note="可解释的规模" width={580} />
            </Card>
            <Card label="纯函数" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                三个模块都是纯函数：同样输入同样输出，种子固定到每一次随机初始化。离线验证和上线模拟因此可以逐位比较。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：坑一、坑二 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="坑一 · 填充方向" accent={C.coral} style={{ marginBottom: 24 }}>
              <CodeBlock
                width={1000} size={FT.code}
                lines={[
                  { t: "-- 因果填充：左边补 (k-1)*d 个零，右边一个不补" },
                  { t: "padLeft = (k - 1) * d", hi: true },
                  { t: "padRight = 0            -- 写错成 padLeft 就变成对称核" },
                ]}
              />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
                没有内置的因果填充，只能手补。补错方向，检查里的“逐位不变”会立刻失败。
              </Body>
            </Card>
            <Card label="坑二 · 逐位验证" accent={C.cyan}>
              <Row name="做法" value="改掉 t 之后的数据" note="把未来换成噪声或 1e9" width={1000} />
              <Row name="比较" value="前 t 位重构" note="浮点相等，不是相关系数" width={1000} color={C.cyan} />
              <Row name="结果" value="最大偏差 0.000" note="因果版逐位不动" width={1000} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
            <Card label="为什么用浮点相等" accent={C.amber}>
              <Body size={FT.body} color={C.ink}>
                如果只比统计量（均值、方差），泄漏可以被“差不多”掩盖。逐位相等没有灰色地带。
              </Body>
            </Card>
            <Card label="检查里的一句话" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                “扰动 t≥60 之后，recon[0..59] 逐位相同。”这是这一集最硬的一条检查。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：坑三、坑四 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="坑三 · 两种口径" accent={C.coral} style={{ marginBottom: 22 }}>
              <Row name="离线" value="整窗可见" note="训练和验证看到的世界" width={1000} />
              <Row name="上线" value="t 之后补零" note="下界口径，不是真实分布" width={1000} />
              <Row name="因果" value="两种口径逐位相同" note="补零对它是精确的" width={1000} color={C.cyan} />
              <Row name="对称" value="两种口径不同" note="离线分数预测不了上线" width={1000} color={C.coral} />
            </Card>
            <Card label="坑四 · 双重卷积两种读法" accent={C.violet}>
              <Row name="取最大" value={"均值 " + fmtF(M.dual.maxReadingMean, 4)} note="非均匀核，只量统计量" width={1000} color={C.violet} />
              <Row name="取均值" value={"均值 " + fmtF(M.dual.meanReadingMean, 4)} note="退化成均匀核卷积" width={1000} color={C.cyan} />
              <Row name="检查" value="逐点相同" note="取均值版 = 均匀核因果卷积" width={1000} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
            <Card label="γ 的线性" accent={C.amber}>
              <Row name="γ = 1" value="基准" note="一次卷积" width={580} />
              <Row name="γ = 2" value="恰好 2 倍" note={"比值 " + fmtF(M.dual.gammaRatio, 3)} width={580} color={C.amber} />
            </Card>
            <Card label="为什么不判对错" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                书上的式子和正文打架，这一集没有依据判哪一种对。把两种都实现、都留读数，是更诚实的做法。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：坑五 残差 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="坑五 · 残差" accent={C.cyan}>
              <CodeBlock
                width={1000} size={FT.code}
                lines={[
                  { t: "y = relu( x + F x )" , hi: true },
                  { t: "-- F = 三次膨胀卷积 + 一次 1x1 投影；x 走直通路" },
                  { t: "gradCheck: max |analytic - numeric| = 8.717e-14" },
                ]}
              />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
                数值梯度和解析梯度差 1e-13 量级，说明反向传播写对了。这是能证明实现正确的唯一办法。
              </Body>
            </Card>
            <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
              <Card label="训练" accent={C.amber} style={{ width: 490 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>{fmtF(M.losses.causal[0].train, 4)} → {fmtF(M.losses.causal[M.losses.causal.length - 1].train, 4)}</div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>{M.losses.causal.length} 轮收敛，残差让深度可以叠</Body>
              </Card>
              <Card label="梯度" accent={C.violet} style={{ width: 490 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.violet }}>8.7e-14</div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>解析与数值的最大差</Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
            <Card label="实现的边界" accent={C.coral}>
              <Body size={FT.body} color={C.ink}>
                这一集的实现全部是单变量、单通道。多变量面板没有进来，所以“因果”只在单序列上被验证过。
              </Body>
            </Card>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
              <Chip color={C.cyan}>纯函数</Chip>
              <Chip color={C.amber}>浮点相等</Chip>
              <Chip color={C.violet}>梯度检查</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
