import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Chip, Body, Mono, Formula, LinePlot, Bars } from "../shared";

const barSeries = (() => {
  const v = M.ddpm.barAlpha;
  const step = Math.max(1, Math.floor(v.length / 240));
  const out: (number | null)[] = [];
  for (let i = 0; i < v.length; i += step) out.push(v[i]);
  return out;
})();

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 12), pageAt("intuition", 24)];
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW, display: "flex", gap: 22 }}>
            <Card label="01 · Copula" accent={C.cyan} style={{ width: 566 }}>
              <Mono size={FT.label} color={C.cyan}>均匀源 → 排名 → 相关正态</Mono>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, marginTop: 16, lineHeight: 1.4 }}>
                边缘靠排名对齐，
                <br />
                相关靠一个矩阵。
              </div>
              <Body size={FT.body} style={{ marginTop: 16 }}>
                一步到位，没有迭代。真实数据的每列都换成自己的排名，再用相关矩阵把列缝在一起。边缘的厚尾、偏态，排名自动吃掉。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                代价：一次排序 + 一次 Cholesky
              </Mono>
            </Card>
            <Card label="02 · 扩散" accent={C.amber} style={{ width: 566 }}>
              <Mono size={FT.label} color={C.amber}>标准正态 → 前向加噪 → 反向退火</Mono>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, marginTop: 16, lineHeight: 1.4 }}>
                一千步把结构拆掉，
                <br />
                五十步把它长回来。
              </div>
              <Body size={FT.body} style={{ marginTop: 16 }}>
                前向是固定的，不用学；学的是每一步怎么去噪。采样是一条链，每一步只看当前样本和步号。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                代价：训练 400 步 · 采样 50 步 × 20 条
              </Mono>
            </Card>
            <Card label="03 · 连续流" accent={C.violet} style={{ width: 566 }}>
              <Mono size={FT.label} color={C.violet}>标准正态 → ODE 积分 → 目标密度</Mono>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, marginTop: 16, lineHeight: 1.4 }}>
                一条轨迹搬整条密度，
                <br />
                行列式修正体积。
              </div>
              <Body size={FT.body} style={{ marginTop: 16 }}>
                映射必须可逆，所以能算密度、也能反向采样。网格上的密度积分正好等于一，是这套结构最直接的自检。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                代价：RK4 20 步 × 每步 4 次向量场
              </Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 892, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="三条路都从标准正态/均匀源出发" />
            <Chip color={C.coral}>区别只在搬法，不在源</Chip>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1120 }}>
            <Card label="ᾱ_t · 信号还剩多少" accent={C.amber} style={{ width: 1080 }}>
              <LinePlot
                series={[{ values: barSeries, color: C.amber, name: "ᾱ_t", dash: false }]}
                width={1020}
                height={400}
                yMin={0}
                yMax={1}
                title="线性 β 调度，T = 1000"
                hlines={[]}
                vlines={[{ i: 120, color: C.cyan, label: "500 步" }]}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Stat label="500 步" value={M.ddpm.aBar500.toFixed(6)} sub="信号只剩不到百分之八" accent={C.cyan} style={{ width: 558 }} />
            <Stat label="1000 步" value={M.ddpm.aBar1000.toExponential(2)} sub="基本是纯噪声，但没到零" accent={C.amber} style={{ width: 558, marginTop: 18 }} />
            <Card label="读法" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body}>
                采样从第 1,000 步的纯噪声出发，一步一步往回退。每一步都要问「这个噪声里，哪一部分是数据、哪一部分是噪声」——
                学到的就是这件事。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 852, width: CW }}>
            <Row name="为什么不让 ᾱ 到 0" value="终点是 N(0, I)" note="ᾱ 到零就没有可逆的起点；4e-5 已经足够小" width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 940 }}>
            <Card label="三种搬法的代价" accent={C.cyan} style={{ width: 900 }}>
              <Bars
                items={[
                  { label: "Copula", value: 1, text: "一次排序", color: C.cyan },
                  { label: "连续流", value: 20, text: "20 步 RK4", color: C.violet },
                  { label: "扩散", value: 50, text: "50 步采样", color: C.amber },
                ]}
                width={860}
                rowH={54}
              />
              <Body size={FT.meta} style={{ marginTop: 18 }}>
                这是采样步数的量级，不是实际秒数。真实耗时由每步的计算量决定：扩散每步一次网络前向，流每步四次向量场。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 300, width: 768 }}>
            <Card label="训练与采样" accent={C.violet}>
              <div style={{ marginTop: 4 }}>
                <Row name="Copula" value="无训练" note="排名 + 经验相关矩阵，闭式解" width={728} color={C.cyan} />
                <Row name="连续流" value="无训练" note="解析向量场 + 固定 RK4，验证离散误差" width={728} color={C.violet} />
                <Row name="扩散" value="400 步" note="小网络 + 噪声预测损失，只到能跑通" width={728} color={C.amber} />
              </div>
            </Card>
            <Card label="本集不做的" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body}>
                不训练预测器，不比较生成质量，不宣称样本可当数据用。三种搬法只证明各自的结构、数值和可检验性。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

