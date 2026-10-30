import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 一件真事：书给了公式，三个缺口由我们补，补法都写进自授权。 */

export const SProblem: React.FC = () => {
  const b = M.stats.basis;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.23, 0.37, 0.6]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里第二十五页，式 2.39。形式很清楚，系数没给。
          </div>
          <Build at={lf("problem", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 860 }}>
              <Card label="式 (2.39) · p.25" accent={C.cyan} style={{ height: 400 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 72, color: C.ink, lineHeight: 1.2 }}>{"X = Σ θᵢ · vᵢ"}</div>
                <Body style={{ marginTop: 24 }}>选一组基 v，把序列投影上去，θ 是投影系数。</Body>
                <Body size={FT.meta} style={{ marginTop: 8 }}>写法只说明了「存在这样一组数」；怎么算，没有。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.08)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 318, width: 876 }}>
              <Card label="书里唯一的线索" accent={C.amber} style={{ height: 400 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: 40, color: C.ink, lineHeight: 1.4 }}>引了一篇参考文献，编号 42。</div>
                <Body style={{ marginTop: 18 }}>没有推导、没有算法、没有复杂度；读者得自己去补。</Body>
                <div style={{ marginTop: 26 }}><Chip color={C.coral}>第一个缺口 · 系数求解</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.14)}>
            <div style={{ position: "absolute", left: PAD, top: 760, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              这一集的做法：书里给的照做，书里没给的标出来，补什么、依据谁，都写清楚。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            我们的补法：经典最小二乘，正规方程加 Cholesky。
          </div>
          <Build at={lf("problem", 0.26)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 860 }}>
              <Card label="补法 · 两步" accent={C.cyan} style={{ height: 380 }}>
                <div style={{ display: "flex", gap: 20 }}>
                  <Stat label="第一步" value="AᵀA θ = Aᵀx" sub="正规方程；A 是基在观测点上的取值" style={{ width: 390, height: 190 }} valueSize={30} />
                  <Stat label="第二步" value="Cholesky" sub="对称正定，分解成 L Lᵀ 再回代" style={{ width: 390, height: 190 }} valueSize={30} />
                </div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>Golub &amp; Van Loan, Matrix Computations, 1996。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.3)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 318, width: 876 }}>
              <Card label="补法的代价" accent={C.coral} style={{ height: 380 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 92, color: C.coral, lineHeight: 1.1 }}>cond²</div>
                <Body style={{ marginTop: 10 }}>正规方程把条件数平方；这是它便宜、但不总是稳的原因。</Body>
                <Body size={FT.meta} style={{ marginTop: 8 }}>{"归一化后 " + b.cond_normalized.toFixed(3) + "；原始幂基 " + b.cond_raw.toExponential(2) + "。"}</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 750, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              后面的「两种基，两个条件数」，说的就是这一条代价。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二个缺口在第二十九页：书里写的是连续变换。
          </div>
          <Build at={lf("problem", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 860 }}>
              <Card label="书里给了什么" accent={C.amber} style={{ height: 380 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 46, color: C.ink, lineHeight: 1.35 }}>{"Y = IFFT( f( FFT(X) ) )"}</div>
                <Body style={{ marginTop: 16 }}>连续傅里叶变换的定义，和「变换 → 处理 → 逆变换」的流程。</Body>
                <Body size={FT.meta} style={{ marginTop: 8 }}>这是流程，不是可执行算法。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.46)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 318, width: 876 }}>
              <Card label="缺了什么" accent={C.cyan} style={{ height: 380 }}>
                <Body color={C.ink} size={FT.h2}>离散 DFT 怎么写；radix-2 的蝶形怎么排。</Body>
                <Body style={{ marginTop: 14 }}>补的是 Cooley 与 Tukey 的离散算法（引 51），不是把连续变换搬过来。</Body>
                <div style={{ marginTop: 20 }}><Chip color={C.cyan}>第二个缺口 · 离散算法</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.52)}>
            <div style={{ position: "absolute", left: PAD, top: 750, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              后面的实现，是按离散公式一步步写的；蝶形顺序、位反转，都有出处。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三个缺口在第二十八页：末尾要填充，填什么没说。
          </div>
          <Build at={lf("problem", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 860 }}>
              <Card label="书里的公式 · Triformer" accent={C.amber} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.ink, lineHeight: 1.25 }}>{"N = ⌊(L − P) / S⌋ + 2"}</div>
                <Body style={{ marginTop: 14 }}>只说了一句「在末尾填充」，加二从填充来，但填什么值没写。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.68)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 318, width: 876 }}>
              <Card label="我们的选择" accent={C.violet} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: 38, color: C.ink, lineHeight: 1.45 }}>填最后那个值，填 S 个。</div>
                <Body style={{ marginTop: 14 }}>不补零。补零会在末尾造出一个假的跳变，Patch 自己会看见它。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.73)}>
            <div style={{ position: "absolute", left: PAD, top: 690, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 170 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>三处都写进了自授权文件：书里没有、我们补了什么、依据是谁。</div>
                <K style={{ display: "block", marginTop: 8 }}>SELF-AUTH A19 · ch02-fft / ch02-basis-exp / ch02-patchify</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.8)}>
            <div style={{ position: "absolute", left: PAD, top: 900, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              规矩是书里给的照做，书里没给的标出来；不把补的东西说成书里的。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
