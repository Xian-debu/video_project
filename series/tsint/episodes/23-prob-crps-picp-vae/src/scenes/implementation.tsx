import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, CodeBlock, K } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [
    0,
    pageAt("implementation", 6),
    pageAt("implementation", 12),
    pageAt("implementation", 17),
    pageAt("implementation", 24),
    pageAt("implementation", 31),
  ];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1020 }}>
            <CodeBlock
              title="src/TsBase/Algos/Ch03/"
              lines={[
                { t: "Crps.hs" },
                { t: "  erf · normalCdf · normalPdf", dim: true },
                { t: "  crpsPoint · crpsSamples · crpsSorted · crpsGauss", dim: true },
                { t: "" },
                { t: "Picp.hs" },
                { t: "  picp · picpWith · covered · meanWidth · granularity", dim: true },
                { t: "" },
                { t: "VaeElbo.hs" },
                { t: "  vaeForward · elboLoss · elboGrad · trainVae", dim: true },
                { t: "  zeroW / addW / subW · forceVec / forceW", dim: true },
              ]}
              width={1020}
              size={FT.code}
            />
          </div>
          <div style={{ position: "absolute", left: PAD + 1060, top: 400, width: 660 }}>
            <Card label="三条约定" accent={C.cyan} style={{ height: 430 }}>
              <Row name="① 纯函数" value="不引数学库" note="erf 自己写" width={600} />
              <Row name="② 无互引" value="三个模块并列" note="算法之间不互相 import" width={600} />
              <Row name="③ 训练在外" value="证据程序里" note="模块只算值和梯度" width={600} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1020 }}>
            <CodeBlock
              title="Crps.hs — erf"
              lines={[
                { t: "normalCdf x = 0.5 * (1 + erf (x / sqrt 2))" },
                { t: "" },
                { t: "-- |x| <= 3：幂级数，逐项递推" },
                { t: "erf x = 2 / sqrt pi * sum_{n=0..N} term n" },
                { t: "  term_{n+1} = term_n * (-x^2)/(n+1) * (2n+1)/(2n+3)", dim: true },
                { t: "" },
                { t: "-- 大 |x|：连分式，从 300 层往下叠", hi: true },
                { t: "erfc x = exp (-x^2) / (sqrt pi * d)" },
                { t: "  d = foldr (\k acc -> x + (k/2)/acc) x [300,299..1]", dim: true },
              ]}
              width={1020}
              size={FT.code}
            />
          </div>
          <div style={{ position: "absolute", left: PAD + 1060, top: 400, width: 660 }}>
            <Stat label="全区间最大误差" value="6.8e-15" sub="与 math.erf 对照，含 3 附近切换点" accent={C.cyan} style={{ height: 170 }} />
            <Stat label="Φ(1.6449)" value="0.9500" sub="95% 分位点，四条分布断言里用到" accent={C.amber} style={{ height: 170, marginTop: 22 }} />
            <Stat label="erfc(3)" value="3e-10" sub="相对误差，连分式收敛足够" accent={C.violet} style={{ height: 170, marginTop: 22 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1020 }}>
            <CodeBlock
              title="Crps.hs — 两两距离，排序后一行"
              lines={[
                { t: "-- 直接式：S^2 对，复杂度 O(S^2)" },
                { t: "pairAbsSumDirect xs = sum [ |x_i - x_j| | i <- is, j <- is ] / 2" },
                { t: "" },
                { t: "-- 排序后：每个点被数了 (2i - n + 1) 次", hi: true },
                { t: "pairAbsSumSorted xs = 2 * sum [ (2*i - n + 1) * x_i ]" },
                { t: "  where x_i = 升序第 i 个（i 从 0 起）", dim: true },
              ]}
              width={1020}
              size={FT.code}
            />
          </div>
          <div style={{ position: "absolute", left: PAD + 1060, top: 400, width: 660 }}>
            <Stat label="排序 vs 直接" value="8.17e-16" sub="S = 1000 个样本，相对误差" accent={C.cyan} style={{ height: 240 }} />
            <Body size={FT.label} style={{ marginTop: 30 }}>
              直接式算的是“所有对”；排序式把每对的距离按位置拆开，O(S log S) 排序后一次遍历。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1020 }}>
            <CodeBlock
              title="退化与覆盖率"
              lines={[
                { t: "-- S = 1：估计就是绝对误差" },
                { t: "crpsSamples [x] y = |x - y|" },
                { t: "" },
                { t: "-- 全相等：同样退化为绝对误差" },
                { t: "crpsSamples (replicate n c) y = |c - y|", dim: true },
                { t: "" },
                { t: "-- 覆盖率：端点算盖住，容差相对" },
                { t: "coveredWith tol l u y = y >= l - t && y <= u + t" },
                { t: "  where t = tol * max 1 (max |l| |u|)", dim: true },
              ]}
              width={1020}
              size={FT.code}
            />
          </div>
          <div style={{ position: "absolute", left: PAD + 1060, top: 400, width: 660 }}>
            <Card label="为什么较真退化" accent={C.amber} style={{ height: 400 }}>
              <Body size={FT.label}>
                退化情形是最容易被“看起来对”的公式骗过的地方。把它写成断言，才敢说公式真的对。
              </Body>
              <div style={{ marginTop: 22 }}>
                <Row name="S = 1" value="= |x − y|" width={600} />
                <Row name="全相等" value="= |c − y|" width={600} />
                <Row name="栅格" value="1 / n" width={600} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1020 }}>
            <Card label="VAE：结构、参数量、训练" accent={C.violet} style={{ height: 460 }}>
              <Row name="维度" value="d = 768 · h = 32 · z = 8" width={940} />
              <Row name="参数量" value="50,768" note="d·h + h + 2(z·h + z) + h·z + h + d·h + d" width={940} />
              <Row name="训练" value="全批量 GD · lr 0.02 · 60 轮" width={940} />
              <Row name="样本" value="100 个窗口" note="每窗口 1000 维收益率特征" width={940} />
              <Row name="loss" value="1318.00 → 1095.83" note="−16.9%" color={C.cyan} width={940} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1060, top: 400, width: 660 }}>
            <Card label="一次 12 GB 的 OOM" accent={C.coral} style={{ height: 470 }}>
              <Body size={FT.label}>
                惰性求值攒着梯度，被内核杀掉，退出码 137。
              </Body>
              <CodeBlock
                title="修法：强制求值"
                lines={[
                  { t: "forceVec v = seq (V.foldl' step () v) v" },
                  { t: "  step acc x = seq x acc" },
                  { t: "" },
                  { t: "w' = forceW (subW w (scaleW (lr/n) g))" },
                ]}
                width={600}
                size={FT.code}
              />
              <Mono size={FT.micro} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>修完 80 秒跑完，常驻内存平稳。</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1060 }}>
            <CodeBlock
              title="VaeElbo.hs — 梯度里的一个真 bug"
              lines={[
                { t: "-- 错：漏了 dz，只有 KL 项在对 logvar 求导" },
                { t: "dlv = active * (0.5 * exp (0.5*l) * e + 0.5*(exp l - 1))", dim: true },
                { t: "" },
                { t: "-- 对：重建项经 z 回传，先有 dz，再乘链式项", hi: true },
                { t: "dlv = active * (dz * 0.5*exp(0.5*l) * e + 0.5*(exp l - 1))" },
                { t: "" },
                { t: "-- 定位：退化到 d = h = z = 1 的小例" },
                { t: "dL/dblv = 0.067848  (与解析式逐位对齐)" },
              ]}
              width={1060}
              size={FT.code}
            />
          </div>
          <div style={{ position: "absolute", left: PAD + 1100, top: 400, width: 620 }}>
            <Stat label="症状" value="3 – 30%" sub="W1 / b1 / Wlv / blv 偏，Wmu / W3 / W4 对" accent={C.coral} style={{ height: 230 }} />
            <Body size={FT.label} style={{ marginTop: 26 }}>
              四个参数偏、四个参数对，说明错误只在一条回传路径上。缩到一维，一算就现形。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
