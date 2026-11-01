import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, fmtP, read, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Stat, Chip } from "../shared";

const pts = M.pca.scatter;
const xs = pts.map((p) => p[0]);
const ys = pts.map((p) => p[1]);
const x0 = Math.min(...xs), x1 = Math.max(...xs);
const y0 = Math.min(...ys), y1 = Math.max(...ys);
const SW = 1060, SH = 700, SP = 54;
const sx = (v: number) => SP + ((v - x0) / Math.max(1e-9, x1 - x0)) * (SW - SP * 2);
const sy = (v: number) => SH - SP - ((v - y0) / Math.max(1e-9, y1 - y0)) * (SH - SP * 2);
const colorOf = (k: number) => (k === 0 ? "#46556c" : k === 1 ? C.cyan : k === 3 ? C.coral : k === 4 ? C.violet : C.amber);
const radiusOf = (k: number) => (k === 2 ? 9 : k === 3 || k === 4 ? 4.2 : 2.6);
const order = [...pts].sort((a, b) => a[2] - b[2]);

const LEGEND: [string, string][] = [
  ["训练样本 500", colorOf(0)],
  ["测试样本 500", colorOf(1)],
  ["簇心 8", colorOf(2)],
  ["尖峰 80", colorOf(3)],
  ["形态替换 80", colorOf(4)],
];

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 15)];
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：PCA 散点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD - 30, top: 252 }}>
            <svg width={SW} height={SH} style={{ display: "block" }}>
              <rect x={SP} y={SP} width={SW - SP * 2} height={SH - SP * 2} fill="none" stroke={C.panelLine} />
              <line x1={SP} y1={SH - SP} x2={SW - SP} y2={SH - SP} stroke={C.inkFaint} strokeWidth={1} opacity={0.5} />
              <line x1={SP} y1={SP} x2={SP} y2={SH - SP} stroke={C.inkFaint} strokeWidth={1} opacity={0.5} />
              {order.map((p, i) => (
                <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={radiusOf(p[2])} fill={colorOf(p[2])} opacity={p[2] === 0 ? 0.5 : p[2] === 1 ? 0.6 : 0.95} />
              ))}
              <text x={SW / 2} y={SH - 14} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>第一主成分 · {fmtP(M.pca.ratio1, 2)}</text>
              <text x={20} y={SH / 2} textAnchor="middle" transform={"rotate(-90 20 " + SH / 2 + ")"} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>第二主成分 · {fmtP(M.pca.ratio2, 2)}</text>
            </svg>
            <div style={{ position: "absolute", left: SP + 12, top: 12, display: "flex", gap: 22 }}>
              {LEGEND.map(([label, col]) => (
                <span key={label} style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>
                  <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 9, background: col, marginRight: 6 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 260, width: 670 }}>
            <Card label="这张图说明什么" accent={C.cyan}>
              <Row name="第一主成分" value={fmtP(M.pca.ratio1, 2)} note="只解释这么一点" width={620} />
              <Row name="第二主成分" value={fmtP(M.pca.ratio2, 2)} note="几乎一样" width={620} />
              <Row name="前十累计" value={fmtP(M.pca.cum10, 1)} note="24 维里没有少数关键方向" width={620} />
            </Card>
            <Card label="簇心不是状态" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                收益轨迹各向同性，八个簇心更像把空间均分的锚点，不是八种波动状态。
              </Body>
            </Card>
            <Card label="形状决定可见性" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.inkDim}>
                红色尖峰散在四周，紫色替换点混在蓝点里 —— 同一张图上，两类异常的可分性完全不同。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：为什么分数长这样 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: CW }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Card label="K 均值 / 距离" accent={C.cyan} style={{ width: 560 }}>
                <Stat label="F1" value={fmtF(M.headline.kmeansSpikeF1, 4)} valueColor={C.cyan} sub="尖峰上最高" />
                <Body size={FT.meta} style={{ marginTop: 14 }}>点离锚点远，距离分数直接变大。尖峰样本的分数增量均值 {fmtF(M.boundary.spikeDelta, 3)}。</Body>
              </Card>
              <Card label="LOF / 密度" accent={C.amber} style={{ width: 560 }}>
                <Stat label="F1" value={fmtF(read("spike", "lof").f1, 4)} valueColor={C.amber} sub="一半多一点" />
                <Body size={FT.meta} style={{ marginTop: 14 }}>邻居变远，自己的密度变低，但分母也一起变低，比值被稀释。</Body>
              </Card>
              <Card label="孤立森林 / 随机分割" accent={C.violet} style={{ width: 560 }}>
                <Stat label="F1" value={fmtF(read("spike", "iforest").f1, 4)} valueColor={C.violet} sub="几乎看不见" />
                <Body size={FT.meta} style={{ marginTop: 14 }}>尖峰只动 1–3 个维度，随机切很难恰好切到那几个维度。平均分 {fmtF(M.diag.ifMean, 4)}。</Body>
              </Card>
            </div>
            <div style={{ display: "flex", gap: 26, marginTop: 30 }}>
              <Card label="尖峰分数增量 vs 标准化位移" accent={C.coral} style={{ width: 830 }}>
                <Row name="K 均值分数增量" value={fmtF(M.boundary.spikeDelta, 3)} note="均值，80 个尖峰" width={780} />
                <Row name="标准化位移" value={fmtF(M.boundary.zShift, 3)} note="注入幅度本身" width={780} />
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
                  分数增量只有位移的一半左右，剩下的被 24 维平均掉。
                </Body>
              </Card>
              <Card label="一句话" accent={C.violet} style={{ width: 860 }}>
                <Body size={FT.body} color={C.ink}>分数只对一种形状敏感。</Body>
                <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>换形状，排序就换 —— 这就是下一节要验证的。</Body>
                <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
                  <Chip color={C.cyan}>距离</Chip>
                  <Chip color={C.amber}>密度</Chip>
                  <Chip color={C.violet}>分割</Chip>
                </div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
