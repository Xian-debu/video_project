import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, lf } from "../shared";

/* 实现：三种做法，三种代价。 */

const Step: React.FC<{ n: string; text: string; color?: string }> = ({ n, text, color = C.inkDim }) => (
  <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginTop: 12 }}>
    <div style={{ width: 40, fontFamily: FONT.mono, fontSize: FT.label, color: C.inkFaint }}>{n}</div>
    <Body size={FT.body} color={color}>{text}</Body>
  </div>
);

export const SImplementation: React.FC = () => {
  const s = M.stats.fft;
  const b = M.stats.basis;
  const p = M.stats.patch;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={[0, 0.36, 0.67, 0.9]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先说 FFT：位反转，然后按级做蝶形。
          </div>
          <Build at={lf("implementation", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <Card label="radix-2 的三步" accent={C.cyan} style={{ height: 380 }}>
                <Step n="01" text="位反转置换：把下标按二进制倒过来，蝶形就不用来回跳。" />
                <Step n="02" text="按级做蝶形：log₂N 级，每级 N/2 个蝶形，原地写回。" />
                <Step n="03" text="旋转因子每 256 个蝶形重算一次：省内存，多算几次三角函数。" />
                <Body size={FT.meta} style={{ marginTop: 14 }}>用 ST 可变向量原地做，不复制；代价是这段代码不再是纯函数。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.12)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="与朴素 DFT 对比" accent={C.cyan} value="n = 1024" sub="两种实现，同一组输入" style={{ height: 150 }} />
              <Stat label="最大误差" accent={C.cyan} value={fmtE(1.22e-10, 2)} sub="相对值；这一档就是浮点噪声" valueColor={C.cyan} style={{ height: 150, marginTop: 16 }} />
              <Stat label="原地重算旋转因子" accent={C.amber} value="每 256 蝶形" sub="内存换三角函数" style={{ height: 150, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 740, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              频带滤波：先把频带外的 bin 清零，再逆变换；掩码是硬边，不是窗。
            </div>
          </Build>
          <Build at={lf("implementation", 0.26)}>
            <div style={{ position: "absolute", left: PAD, top: 800, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "18px 26px" }}>
              <Body size={FT.body} color={C.ink}>硬边会带来振铃；振铃不是 bug，是矩形窗的傅里叶变换。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            再说基展开：设计矩阵、正规方程、Cholesky，先查秩再分解。
          </div>
          <Build at={lf("implementation", 0.38)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <Card label="四步" accent={C.amber} style={{ height: 360 }}>
                <Step n="01" text="设计矩阵：一列一个基函数，在观测点上取值。" />
                <Step n="02" text="正规方程：AᵀA θ = Aᵀx；矩阵乘转置，解一个线性系统。" />
                <Step n="03" text="Cholesky：只对对称正定矩阵有效；所以先检查秩，再分解。" />
                <Step n="04" text="拟合值 = A θ；残差 = x − 拟合值。" />
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.46)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="真实数据" accent={C.amber} value="250 点" sub="贵州茅台前 250 个收盘价 · 三次多项式" style={{ height: 150 }} />
              <Stat label="残差最大值" accent={C.coral} value={b.data_resid_max.toFixed(2)} sub="价格本身在几百到两千之间" valueColor={C.coral} style={{ height: 150, marginTop: 16 }} />
              <Stat label="重建误差" accent={C.cyan} value={fmtE(b.data_recon_err, 0)} sub="拟合值 + 残差 = 观测；恒等式" valueColor={C.cyan} style={{ height: 150, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.56)}>
            <div style={{ position: "absolute", left: PAD, top: 730, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 120 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>这条是恒等式，不是拟合得好；所以重建误差这个数，永远接近零。</div>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            最后说 Patch：末尾补四个重复值，按步长四切，正好十二段。
          </div>
          <Build at={lf("implementation", 0.69)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1060 }}>
              <CodeBlock
                title="填充 → 切段 → 拼回"
                lines={[
                  { t: "len = 48, p = 8, s = 4", hi: true },
                  { t: "padded   = 48 + s        = 52", dim: true },
                  { t: "patches  = (48 - 8)/4 + 2 = 12", dim: true },
                  { t: "covered  = 48 / 48", dim: true },
                  { t: "roundtrip = max |x - unpatchify(patchify(x))|", hi: true },
                  { t: "          = 0", hi: true },
                ]}
                width={1060} size={FT.code}
              />
            </div>
          </Build>
          <Build at={lf("implementation", 0.74)}>
            <div style={{ position: "absolute", left: PAD + 1100, top: 310, width: 676 }}>
              <Stat label="填充后长度" accent={C.violet} value={String(p.padded_len)} sub="补 S 个最后的值，不补零" style={{ height: 150 }} />
              <Stat label="段数" accent={C.violet} value={String(p.patches)} sub="每段 8 个点，步长 4" style={{ height: 150, marginTop: 16 }} />
              <Stat label="往返误差" accent={C.cyan} value={fmtE(p.roundtrip_err, 0)} sub="精确零；填充与覆盖次数正好对上" valueColor={C.cyan} style={{ height: 150, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 700, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              换个步长，这个零就没了；重叠越多，平均得越狠。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三种实现，三种代价。
          </div>
          <Build at={lf("implementation", 0.92)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Card label="FFT" accent={C.cyan} style={{ width: 574, height: 260 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.cyan }}>快</div>
                <Body style={{ marginTop: 10 }}>但要求长度是二的幂；不是就补零，补零有代价。</Body>
              </Card>
              <Card label="基展开" accent={C.amber} style={{ width: 574, height: 260 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.amber }}>准</div>
                <Body style={{ marginTop: 10 }}>但要解一个线性系统；条件数决定结果稳不稳。</Body>
              </Card>
              <Card label="Patch" accent={C.violet} style={{ width: 574, height: 260 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.violet }}>灵活</div>
                <Body style={{ marginTop: 10 }}>但要处理边界：填充、重叠、拼回的顺序。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.96)}>
            <div style={{ position: "absolute", left: PAD, top: 630, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 130 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>这些代价，都会在数字那节出现；每个数对应一条检查。</div>
                <K style={{ display: "block", marginTop: 8 }}>三条证据文件 · 55 条检查 · 47 条新断言</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
