import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, PairBar, pct, clamp } from "../shared";

/** 潜变量散点：横轴窗口活跃度，纵轴潜变量范数。 */
const Scatter: React.FC<{ width?: number; height?: number }> = ({ width = 900, height = 470 }) => {
  const f = useCurrentFrame();
  const p = pct(f, 0, 20);
  const pts = M.vae.latent;
  const xs = pts.map((q) => q.act);
  const ys = pts.map((q) => q.norm);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const padL = 110, padB = 74, padT = 30, padR = 30;
  const sx = (v: number) => padL + ((v - x0) / (x1 - x0 || 1)) * (width - padL - padR);
  const sy = (v: number) => height - padB - ((v - y0) / (y1 - y0 || 1)) * (height - padT - padB);
  return (
    <svg width={width} height={height} style={{ display: "block", opacity: p }}>
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={padL} y1={sy(y0 + (y1 - y0) * t)} x2={width - padR} y2={sy(y0 + (y1 - y0) * t)} stroke={C.panelLine} strokeWidth={1} />
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={height - padB} stroke={C.panelLine} strokeWidth={1} />
      <line x1={padL} y1={height - padB} x2={width - padR} y2={height - padB} stroke={C.panelLine} strokeWidth={1} />
      {pts.map((q, i) => (
        <circle key={i} cx={sx(q.act)} cy={sy(q.norm)} r={4.6} fill={C.cyan} opacity={0.62} />
      ))}
      <text x={width - padR} y={height - 12} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>窗口活跃度（平均 |z|）</text>
      <text x={16} y={padT + 12} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>‖μ‖</text>
    </svg>
  );
};

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 9), pageAt("intuition", 18), pageAt("intuition", 29)];
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1000 }}>
            <Card label="CRPS 是 pinball 的积分" accent={C.cyan} style={{ height: 430 }}>
              <Formula size={52} style={{ lineHeight: 1.55 }}>CRPS = 2 ∫&#8320;&#185; pinball_τ(q_τ, y) dτ</Formula>
              <Body size={FT.label} style={{ marginTop: 20 }}>
                上一集按 τ 一个一个报价；这一集把整条 τ 曲线积成一个数。每个分位数都在罚，权重自动出现。
              </Body>
              <Body size={FT.label} style={{ marginTop: 12 }} color={C.amber}>
                所以 CRPS 跟分位数回归是一家人，但它能直接和平均误差比。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 400, width: 680 }}>
            <Stat label="点误差" value="只看中心" sub="分布再宽，只要中心对，损失不变" accent={C.inkFaint} style={{ height: 190 }} />
            <Stat label="分布分数" value="中心和宽度" sub="宽窄报错，也要付钱" accent={C.cyan} style={{ height: 190, marginTop: 40 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 980 }}>
            <Card label="八个通道，平均（真实数据）" accent={C.cyan} style={{ height: 470 }}>
              <PairBar
                a={{ label: "CRPS", value: M.real.crpsMean, text: M.real.crpsMean.toFixed(4) }}
                b={{ label: "平均误差", value: M.real.maeMean, text: M.real.maeMean.toFixed(4) }}
                width={900}
                height={300}
                max={M.real.maeMean * 1.1}
              />
              <Body size={FT.label} style={{ marginTop: 12 }}>
                CRPS 在全部八个通道上都更低；平均低了 24%。这不是巧合，是分布多报了一层信息。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1020, top: 400, width: 700 }}>
            <Card label="为什么能更低" accent={C.amber} style={{ height: 470 }}>
              <Body size={FT.label}>
                平均误差只罚点，窄区间和宽区间同价；CRPS 罚形状，报得越贴合真实分布越便宜。
              </Body>
              <div style={{ marginTop: 24 }}>
                <Row name="CRPS 均值" value={M.real.crpsMean.toFixed(4)} color={C.cyan} width={640} />
                <Row name="平均误差均值" value={M.real.maeMean.toFixed(4)} color={C.coral} width={640} />
                <Row name="低了多少" value="24.1%" note="1 − 0.0096 / 0.0126" width={640} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 980 }}>
            <Card label="覆盖率：名义 vs 实测" accent={C.coral} style={{ height: 470 }}>
              <PairBar
                a={{ label: "名义 80%", value: 0.8, text: "" }}
                b={{ label: "实测 85.3%", value: M.picp.realCov80, text: M.picp.realCov80.toFixed(4) }}
                width={900}
                height={150}
                colorA={C.inkFaint}
                colorB={C.coral}
                max={1}
              />
              <PairBar
                a={{ label: "名义 95%", value: 0.95, text: "" }}
                b={{ label: "实测 94.4%", value: M.picp.realCov95, text: M.picp.realCov95.toFixed(4) }}
                width={900}
                height={150}
                colorA={C.inkFaint}
                colorB={C.cyan}
                max={1}
              />
              <Body size={FT.meta} style={{ marginTop: 10 }}>
                80% 区间偏宽（盖多了），95% 区间接近名义值。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1020, top: 400, width: 700 }}>
            <Card label="为什么偏高" accent={C.amber} style={{ height: 470 }}>
              <Body size={FT.label}>
                残差的尾巴比正态厚，为了凑够 80% 的名义覆盖，σ 被撑大，中心区间也跟着变宽。
              </Body>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                同一个现象上一集出现过：高斯 80% 区间实际盖到 83.8%。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 22 }}>
                覆盖高不是“更准”，是“更保守”。
              </Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 960 }}>
            <Card label="VAE 潜空间：125 个窗口（每 8 个取一个）" accent={C.violet} style={{ height: 500 }}>
              <Scatter />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1000, top: 400, width: 720 }}>
            <Card label="怎么看" accent={C.cyan} style={{ height: 500 }}>
              <Row name="相关系数" value="0.7807" note="‖μ‖ 与窗口活跃度" color={C.cyan} width={660} />
              <Row name="结构" value="连续，不分簇" note="没有明显的几团" color={C.amber} width={660} />
              <Body size={FT.label} style={{ marginTop: 20 }}>
                这说明八维编码保留了一条与活跃度相关的方向，但不代表它学会了分类。画面不写“自动聚类”。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
