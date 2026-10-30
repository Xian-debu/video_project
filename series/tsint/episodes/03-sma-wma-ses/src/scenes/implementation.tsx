import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, Mono, PAD, Pages, Scene, SceneHead, lf } from "../shared";

const codeLines = (a: string[]) => a.map((t) => ({ t }));

/** 实现：三个模块，不到三百行；换算与测试。 */
export const SImplementation: React.FC = () => {
  const id = "implementation";
  const b = (k: number) => lf(id, k);
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.35, 0.65]}>
        {/* 1 · 三模块 + SMA */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 860 }}>
            {[
              { p: "TsBase.Algos.Ch02.Sma", e: "sma, smaDirect", c: C.amber, s: "滑动和增量 + 每千步重算一次" },
              { p: "TsBase.Algos.Ch02.Wma", e: "WmaError(..), wma, meanLag", c: C.cyan, s: "权重和归一；质心直接算" },
              { p: "TsBase.Algos.Ch02.Ses", e: "SesError(..), ses, sesAuto, alphaForWindow", c: C.violet, s: "稳定式：s + α (x - s)" },
            ].map((m, i) => (
              <Build key={m.p} at={b(0.02 + i * 0.03)}>
                <Card label={"模块 " + (i + 1)} accent={m.c} pad={20} style={{ width: 860, height: 158, marginTop: i ? 12 : 0 }}>
                  <Mono size={FT.meta} color={m.c}>{m.p}</Mono>
                  <Body size={FT.body} style={{ marginTop: 6 }}>{m.s}</Body>
                  <Mono size={FT.micro} color={C.inkFaint} style={{ marginTop: 6, display: "block" }}>{m.e}</Mono>
                </Card>
              </Build>
            ))}
            <Build at={b(0.1)}>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Chip color={C.violet}>只依赖 vector</Chip>
                <Chip color={C.cyan}>纯函数，无 IO</Chip>
              </div>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 252 }}>
            <Build at={b(0.03)}>
              <CodeBlock
                title="Sma.hs · 增量滑动和"
                width={876}
                size={FT.code}
                lines={codeLines([
                  "-- 一次遍历，窗口和增量更新",
                  "win = V.sum (V.take n xs)",
                  "go !i !acc",
                  "  | i >= m = acc",
                  "  | otherwise =",
                  "    let win' = win + xs ! (i+n)",
                  "               - xs ! i",
                  "    in go (i+1) (win' : acc)",
                  "-- 每 1024 步重算，压掉累积误差",
                ])}
              />
            </Build>
            <Build at={b(0.07)}>
              <Card accent={C.amber} pad={20} style={{ width: 876, marginTop: 16 }}>
                <Body size={FT.body}>增量式每步做两次加减，常数时间；误差每千步被重算清零一次。</Body>
                <K>画面上只讲一条：窗口和不是每次重加的</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · WMA + SES */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 860 }}>
            <Build at={b(0.37)}>
              <CodeBlock
                title="Wma.hs · 分母是权重和"
                width={860}
                size={FT.code}
                lines={codeLines([
                  "wma w xs",
                  "  | V.null w = Left EmptyWeights",
                  "  | V.any (< 0) w = Left NegativeWeight",
                  "  | tot == 0 = Left ZeroWeights",
                  "  | otherwise = Right (V.zipWith (*) w xs",
                  "                        / pure tot)",
                  "  where tot = V.sum w",
                  "-- meanLag = Σ i·w_i / Σ w_i",
                ])}
              />
            </Build>
            <Build at={b(0.41)}>
              <Card accent={C.coral} pad={20} style={{ width: 860, marginTop: 14 }}>
                <Body size={FT.body}>全零权重不是“结果为零”，是没有定义；错误要显式返回。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 250, width: 876 }}>
            <Build at={b(0.44)}>
              <CodeBlock
                title="Ses.hs · 稳定式"
                width={876}
                size={FT.code}
                lines={codeLines([
                  "ses a s0 xs",
                  "  | a <= 0 || a > 1 = Left BadAlpha",
                  "  | otherwise = Right (V.scanl' step s0 xs)",
                  "  where step s x = s + a * (x - s)",
                  "-- 代数等价：αx + (1-α)s",
                  "-- 稳定式在 s 很大、x 很小时不丢精度",
                ])}
              />
            </Build>
            <Build at={b(0.48)}>
              <Card accent={C.cyan} pad={20} style={{ width: 876, marginTop: 14 }}>
                <Body size={FT.body}>α 的合法范围是 (0, 1]；等于一就是恒等映射，测试里钉住了。</Body>
                <K>sesAuto：初值取前三个点的均值</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 换算与测试 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 260, width: 860 }}>
            <Build at={b(0.67)}>
              <Card label="两条换算" accent={C.violet} pad={24} style={{ width: 860, height: 268 }}>
                <div style={{ marginBottom: 10 }}><Mono size={FT.body} color={C.ink}>alphaForWindow n = 2 / (n + 1)</Mono></div>
                <div><Mono size={FT.body} color={C.ink}>windowForAlpha a = 2 / a - 1</Mono></div>
                <Body size={FT.body} style={{ marginTop: 16 }}>两条函数互为反函数；合起来就是这一集的判据：要让两种平滑器的质心相等，就用这一对。</Body>
                <Chip color={C.violet}>N 与 α 是一把尺子的两种刻度</Chip>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 260, width: 876 }}>
            <Build at={b(0.7)}>
              <Card label="测试" accent={C.cyan} pad={24} style={{ width: 876, height: 268 }}>
                <div style={{ display: "flex", gap: 44 }}>
                  <div><Mono size={FT.h1} color={C.amber}>12</Mono><Body size={FT.micro}>SMA 断言</Body></div>
                  <div><Mono size={FT.h1} color={C.cyan}>13</Mono><Body size={FT.micro}>WMA 断言</Body></div>
                  <div><Mono size={FT.h1} color={C.violet}>16</Mono><Body size={FT.micro}>SES 断言</Body></div>
                </div>
                <Body size={FT.body} style={{ marginTop: 18 }}>新增 41 条，整套四百零八条全部通过；每一条都能回到定义下一行公式。</Body>
                <K>测试不是装饰：÷N 和 ÷Σw 的差别，就是被它们钉住的</K>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
