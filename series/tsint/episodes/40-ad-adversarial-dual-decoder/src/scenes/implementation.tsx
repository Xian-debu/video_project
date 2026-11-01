import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Stat, Verdict, Chip,
  CodeBlock, Formula, fmtInt, fmtE,
} from "../shared";

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个文件 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              三个文件，一千零二十一行。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              不引线性代数库，不用求导框架。前向、反向、EM、Cholesky 全手写，纯函数，种子只决定注入落在哪。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
              {M.modules.map((m) => (
                <Card key={m.file} label={m.file} accent={m.file.indexOf("USAD") >= 0 ? C.cyan : m.file.indexOf("DAGMM") >= 0 ? C.violet : C.amber} pad={18} style={{ width: 320 }}>
                  <Stat label="行数 / 测试" value={m.lines + " / " + m.tests} valueSize={40} />
                </Card>
              ))}
            </div>
            <div style={{ marginTop: 26 }}>
              <Row name="合计" value={M.modules.reduce((a, b) => a + b.lines, 0) + " 行 · " + M.modules.reduce((a, b) => a + b.tests, 0) + " 个测试"} note="单测覆盖：方向性、退化、梯度、数值兜底" color={C.cyan} />
              <Row name="依赖" value="纯 Haskell" note="无外部数值库；矩阵乘和 Cholesky 都在仓库里" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <CodeBlock
              title="核心入口（纯函数）"
              width={810}
              lines={[
                { t: "usadScore :: USADCfg -> Matrix -> Vector Double" },
                { t: "  trainUSAD 20+20 -> s = alpha*s1 + beta*s2", dim: true },
                { t: "dagmmEnergy :: DAGMMCfg -> Matrix -> Vector Double" },
                { t: "  AE + GMM(EM) -> -logsum pi_k N", dim: true },
                { t: "aeEnsembleScore :: Int -> Matrix -> Vector Double" },
                { t: "  5 seeds -> median", dim: true },
                { t: "no RNG in models; seed only places injections", hi: true },
              ]}
            />
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              参数量：USAD {fmtInt(md("usad").params)} · DAGMM {fmtInt(md("dagmm").params)} · 单个 AE {fmtInt(md("ae").params)}
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：一次 OOM */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              一次内存事故：每轮更新都留着没算。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              逐窗 SGD 写成惰性 zipWith 之后，foldl 只强制了最外层的构造器，四万次权重更新全留成 thunk 链。跑到第十三项检查，
              进程被容器杀掉：退出码一百三十七，峰值内存八点一七吉，上限十二吉。
            </Body>
            <Body style={{ marginTop: 18, width: 860, color: C.inkDim }}>
              修法不是加内存，是每算完一个阶段就强制一次：权重更新用 V.force 包住，阶段结束 evaluate 一次求和。
              同样四万次更新，常驻内存从八点一七吉降到四百兆。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
              <Stat label="修复前峰值" value="8.17 GB" sub="上限 12 GB，被 OOM killer 杀" accent={C.coral} style={{ width: 300 }} />
              <Stat label="修复后常驻" value="0.4 GB" sub="逐阶段强制，thunk 不再堆积" accent={C.cyan} style={{ width: 300 }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <CodeBlock
              title="stepVec / stepMat（强制求值）"
              width={810}
              lines={[
                { t: "stepVec lr g w = V.force (V.zipWith f w g)" },
                { t: "  where f wi gi = wi - lr * gi", dim: true },
                { t: "" },
                { t: "stepMat lr g w = V.force (V.map V.force" },
                { t: "  (V.zipWith (V.zipWith f) w g))", dim: true },
                { t: "" },
                { t: "-- stage end: evaluate (sum l1 + sum l2 + ...)", hi: true },
                { t: "-- lazy chain cut: heap drops one order", dim: true },
              ]}
            />
            <Card label="教训" accent={C.amber} pad={22} style={{ marginTop: 16 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                纯函数不等于惰性无害。数值循环里每一次更新都要落到具体数值上，不然内存账单最后一起结。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：方向性自检 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              把符号翻过来，方向性必须消失。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              USAD 的第二阶段是减少第二个解码器对第一个输出的重建误差。如果实现里符号写反，训练照样收敛，但方向性的检查会立刻失败。
              所以单测里专门做了一个反向训练器：用相反符号训同样轮次，再量两个重建误差。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Row name="正常方向" value={"s2 " + fmtInt(201.0) + " → s3 " + fmtInt(54.1)} note="对抗成立：AE2 更不会重建 AE1 的输出" color={C.cyan} />
              <Row name="符号翻转" value={"s2 " + fmtE(2.3e-2) + " · s3 " + fmtE(1.0e-1)} note="方向性反转：检查直接判失败" color={C.coral} />
              <Row name="过拟合" value={"L1 " + fmtE(9.0e-5)} note="单窗五百步，L1 小于 1e-4" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="三条检查，各管一个方向" accent={C.violet} pad={26}>
              <Row name="方向性" value="s3 < s2" note="正常训练下成立：AE2 更不会重建 AE1 的输出" />
              <Row name="反向对照" value="翻转符号后不成立" note="证明检查测的是方法，不是噪声" />
              <Row name="过拟合" value="单窗五百步 L1 < 1e-4" note="证明优化器真的在下降" />
            </Card>
            <Card label="梯度检查" accent={C.cyan} pad={26} style={{ marginTop: 18 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                手写反向传播，用中心差分对四个参数各查一次，误差小于 1e-6。共享编码器处两路梯度相加，这里最容易写漏一路。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：偶数成员警告 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              五变四，口径悄悄变了。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              中位数在偶数个成员时没有正中项。如果代码默默取中间两个的平均，成员数一变，聚合口径就变了，读数跟着变而没人知道。
              本集的聚合函数在这种情况下返回一条警告，测试里专门检查它。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Row name="[1, 2, 100]" value="中位数 2 · 均值 34.33" note="均值被一个坏成员拉走" color={C.amber} />
              <Row name="[1, 2, 5, 100]" value="中位数 3.5" note="偶数：中间两个平均 + 警告" />
              <Row name="一个成员为无穷" value="中位数仍是 2" note="M 大于等于 3 时对无穷稳健" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <CodeBlock
              title="medianOf / medianWarning"
              width={810}
              lines={[
                { t: "medianOf xs = if odd n then xs !! (n div 2)" },
                { t: "  else (xs !! (n div 2 - 1) + xs !! (n div 2)) / 2" },
                { t: "" },
                { t: "medianWarning m" },
                { t: "  | m < 1  = Just \"empty\"" },
                { t: "  | even m = Just \"even members\"" },
                { t: "  | otherwise = Nothing", hi: true },
              ]}
            />
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              警告不抛异常：默认 M = 5，偶数只在换配置时出现。
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
