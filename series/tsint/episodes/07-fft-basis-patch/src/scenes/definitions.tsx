import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 定义：三条签名、三套约定、三个错误类型。 */

const Conv: React.FC<{ n: string; text: string; color?: string }> = ({ n, text, color = C.inkDim }) => (
  <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginTop: 12 }}>
    <div style={{ width: 34, fontFamily: FONT.mono, fontSize: FT.label, color: C.inkFaint }}>{n}</div>
    <Body size={FT.body} color={color}>{text}</Body>
  </div>
);

export const SDefinitions: React.FC = () => {
  const b = M.stats.basis;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.4, 0.74, 0.87]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看 FFT：长度、单位、归一化，三件事先说死。
          </div>
          <Build at={lf("definitions", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <CodeBlock
                title="TsBase.Algos.Ch02.Fft"
                lines={[
                  { t: "fft :: Vector Complex -> Either FftError (Vector Complex)", hi: true },
                  { t: "bandFilter :: (Double, Double) -> Int -> Vector Double -> Vector Double", hi: true },
                  { t: "  --            (loHz, hiHz)   fs      x", dim: true },
                ]}
                width={1060} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("definitions", 0.09)}>
            <div style={{ position: "absolute", left: PAD, top: 520, width: 1060 }}>
              <Card label="三套约定" accent={C.cyan} style={{ height: 300 }}>
                <Conv n="01" text="长度必须是 2 的幂；不是就报 FftBadLen，不悄悄补零。" />
                <Conv n="02" text="频带单位是赫兹，不是 bin；用户说 10 Hz，指的是频率。" />
                <Conv n="03" text="正变换不归一化，逆变换除以 N；所以 FFT→IFFT 回到原序列。" />
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.18)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="频带内能量" accent={C.cyan} value="掩码清零" sub="频带外的 bin 直接置零，再逆变换" style={{ height: 150 }} />
              <Stat label="硬边的代价" accent={C.coral} value="振铃" sub="等价于在频域加了一个矩形窗" valueColor={C.coral} style={{ height: 150, marginTop: 16 }} />
              <Stat label="往返恒等式" accent={C.amber} value="机器精度" sub="Parseval 与 FFT→IFFT 各有一条检查" style={{ height: 150, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.24)}>
            <div style={{ position: "absolute", left: PAD, top: 850, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              约定写进签名，不写在注释里；调用者不用猜。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            基展开：输入一组基和一个观测向量，输出系数和拟合值。
          </div>
          <Build at={lf("definitions", 0.42)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <CodeBlock
                title="TsBase.Algos.Ch02.BasisExp"
                lines={[
                  { t: "basisFit :: [BasisFn] -> Vector Double -> Either BasisError (Vector Double, Vector Double)", hi: true },
                  { t: "--            (coeffs, fitted)", dim: true },
                ]}
                width={1060} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("definitions", 0.47)}>
            <div style={{ position: "absolute", left: PAD, top: 480, width: 1060 }}>
              <Card label="三套约定" accent={C.amber} style={{ height: 340 }}>
                <Conv n="01" text="基的个数不能超过观测个数；多了就是欠定，报 Underdetermined。" />
                <Conv n="02" text="设计矩阵必须满秩；不满就是 SingularDesign，不硬解。" />
                <Conv n="03" text="基函数用 v 坐标，v = 2u − 1，u 是归一化时间；数值条件好得多。" />
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.56)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="归一化基条件数" accent={C.cyan} value={b.cond_normalized.toFixed(3)} sub="v 坐标；满秩且良态" valueColor={C.cyan} style={{ height: 150 }} />
              <Stat label="原始幂基条件数" accent={C.coral} value={b.cond_raw.toExponential(2)} sub="直接用 t 的幂；差十二个数量级" valueColor={C.coral} style={{ height: 150, marginTop: 16 }} />
              <Stat label="实测残差" accent={C.amber} value={b.lin_resid_max.toExponential(1)} sub="线性序列上的精确拟合" style={{ height: 150, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.66)}>
            <div style={{ position: "absolute", left: PAD, top: 850, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              同一个拟合问题，只换了一组坐标，条件数差十二个数量级。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            Patch：段数公式写死，填充只发生在末尾。
          </div>
          <Build at={lf("definitions", 0.76)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <CodeBlock
                title="TsBase.Algos.Ch02.Patchify"
                lines={[
                  { t: "patchify :: Int -> Int -> Int -> Vector Double -> Either PatchError (Vector (Vector Double))", hi: true },
                  { t: "--            len  p     s      x", dim: true },
                  { t: "", dim: true },
                  { t: "count = (len - p) div s + 2   -- 公式写死", hi: true },
                ]}
                width={1060} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("definitions", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 560, width: 1060 }}>
              <Card label="加二与填充" accent={C.violet} style={{ height: 270 }}>
                <Body color={C.ink} size={FT.h2}>开头一段、结尾一段，中间按步长走；末尾补 S 个最后的值。</Body>
                <Body style={{ marginTop: 14 }}>填充不是补零：补零会在末尾造出一个假的跳变。</Body>
                <Body size={FT.meta} style={{ marginTop: 8 }}>48 个点、p=8、s=4：补到 52，正好 12 段。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.86)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="段数" accent={C.violet} value="12" sub="⌊(48−8)/4⌋ + 2" style={{ height: 150 }} />
              <Stat label="填充后长度" accent={C.violet} value="52" sub="48 + 4 个重复值" style={{ height: 150, marginTop: 16 }} />
              <Stat label="覆盖" accent={C.cyan} value="48 点" sub="所有原有点都被至少一段覆盖" style={{ height: 150, marginTop: 16 }} />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三条签名，三个错误类型；错误用 Either 返回，不抛异常。
          </div>
          <Build at={lf("definitions", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <CodeBlock
                title="错误分支也是接口"
                lines={[
                  { t: "data FftError   = FftNonFinite Int | FftBadBand Double Double", hi: true },
                  { t: "data BasisError = BasisEmpty | Underdetermined Int Int | SingularDesign", hi: true },
                  { t: "data PatchError = PatchBadDims Int Int | PatchTooShort Int Int | ...", hi: true },
                  { t: "", dim: true },
                  { t: "-- 全部 deriving (Eq, Show)", dim: true },
                ]}
                width={1060} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("definitions", 0.94)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="错误总数" accent={C.coral} value="9 类" sub="每个都能被一条测试单独触发" valueColor={C.coral} style={{ height: 160 }} />
              <Stat label="测试覆盖" accent={C.cyan} value="逐条" sub="错误分支不留给运行时" valueColor={C.cyan} style={{ height: 160, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.97)}>
            <div style={{ position: "absolute", left: PAD, top: 672, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>后面每一条数字，都对应一个错误分支，或者一条检查。</div>
              <K style={{ display: "block", marginTop: 8 }}>Either 返回 · 不抛异常 · 测试逐条覆盖</K>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
