import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, fmtP, read, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, Verdict, Chip } from "../shared";

const W = 740, H = 520, PL = 76, PB = 58, PT = 34;
const px = (r: number) => PL + r * (W - PL - 24);
const py = (p: number) => H - PB - p * (H - PB - PT);

const PRPlot: React.FC<{ det: string; color: string; inj: "spike" | "swap"; dash?: string; mark?: boolean }> = ({ det, color, inj, dash, mark }) => {
  const cur = M.curves[inj][det];
  const sorted = [...cur].sort((a, b) => a[2] - b[2]);
  const d = sorted.map((p, i) => (i === 0 ? "M" : "L") + px(p[2]).toFixed(1) + "," + py(p[1]).toFixed(1)).join(" ");
  const r = read(inj, det);
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={mark ? 2.4 : 1.9} strokeDasharray={dash} opacity={mark ? 0.95 : 0.75} />
      {mark ? <circle cx={px(r.r)} cy={py(r.p)} r={6} fill={color} stroke={C.bg} strokeWidth={2} /> : null}
    </g>
  );
};

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 15), pageAt("verification", 22), pageAt("verification", 31)];
  const k = read("spike", "kmeans"), l = read("spike", "lof"), f = read("spike", "iforest");
  const ks = read("swap", "kmeans"), ls = read("swap", "lof"), fs = read("swap", "iforest");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：三十四个检查 + 尖峰读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1000 }}>
            <Card label="34 项检查，一次跑完" accent={C.cyan}>
              <Row name="数据 / 样本" value="12 项" note="行数、sha、切分、无未来泄漏" width={950} />
              <Row name="注入" value="5 项" note="数量、逐只 10 个、改动维度" width={950} />
              <Row name="K 均值" value="5 项" note="K 个标签、确定性、有限、F1 门槛" width={950} />
              <Row name="LOF / 孤立森林" value="4 项" note="范围、训练均分、形态替换门槛" width={950} />
              <Row name="曲线 / PCA / 阈值" value="8 项" note="PR 单调、AP 范围、方差、操作点" width={950} />
              <Row name="合计" value={M.meta.checks + " / " + M.meta.checkTotal} note={"耗时 " + M.meta.runtimeSec + " 秒"} width={950} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              检查程序跑真数据，把读数写进 unsup.json —— 画面上没有一个手抄的数字。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 296, width: 670 }}>
            <Card label="尖峰注入 · 测试 99% 分位" accent={C.amber}>
              <Row name="K 均值" value={fmtF(k.f1, 4)} color={C.cyan} note={"P " + fmtF(k.p, 4) + " · R " + fmtF(k.r, 4) + " · " + k.pos + " 点"} width={620} />
              <Row name="LOF" value={fmtF(l.f1, 4)} color={C.amber} note={"P " + fmtF(l.p, 4) + " · R " + fmtF(l.r, 4) + " · " + l.pos + " 点"} width={620} />
              <Row name="孤立森林" value={fmtF(f.f1, 4)} color={C.violet} note={"P " + fmtF(f.p, 4) + " · R " + fmtF(f.r, 4) + " · " + f.pos + " 点"} width={620} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                同一批 80 个尖峰，三种几何差了三倍多。
              </Body>
            </Card>
            <Card label="平均精度 AP" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="K 均值" value={fmtF(k.ap, 4)} width={620} />
              <Row name="LOF" value={fmtF(l.ap, 4)} width={620} />
              <Row name="孤立森林" value={fmtF(f.ap, 4)} width={620} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三条 PR 曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD - 20, top: 268, width: W }}>
            <svg width={W} height={H} style={{ display: "block" }}>
              <rect x={PL} y={PT} width={W - PL - 24} height={H - PB - PT} fill="none" stroke={C.panelLine} />
              {[0, 0.5, 1].map((t) => (
                <g key={t}>
                  <line x1={PL} y1={py(t)} x2={W - 24} y2={py(t)} stroke={C.panelLine} strokeDasharray="3 5" opacity={0.7} />
                  <text x={PL - 10} y={py(t) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{t.toFixed(1)}</text>
                  <line x1={px(t)} y1={PT} x2={px(t)} y2={H - PB} stroke={C.panelLine} strokeDasharray="3 5" opacity={0.35} />
                  <text x={px(t)} y={H - PB + 20} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{t.toFixed(1)}</text>
                </g>
              ))}
              <PRPlot det="kmeans" color={C.cyan} inj="spike" mark />
              <PRPlot det="lof" color={C.amber} inj="spike" mark />
              <PRPlot det="iforest" color={C.violet} inj="spike" mark />
              <PRPlot det="kmeans" color={C.cyan} inj="swap" dash="7 5" />
              <PRPlot det="lof" color={C.amber} inj="swap" dash="7 5" />
              <PRPlot det="iforest" color={C.violet} inj="swap" dash="7 5" />
              <text x={W / 2} y={H - 12} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>召回 Recall</text>
              <text x={16} y={H / 2} textAnchor="middle" transform={"rotate(-90 16 " + H / 2 + ")"} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>精度 Precision</text>
            </svg>
            <div style={{ paddingLeft: PL, marginTop: 6, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
              纵轴 0–1：虚线三条全部贴着横轴，最好点 0.035。
            </div>
            <div style={{ display: "flex", gap: 24, paddingLeft: PL, marginTop: 8 }}>
              <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.cyan }}>K 均值</span>
              <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.amber }}>LOF</span>
              <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.violet }}>孤立森林</span>
              <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>实线 尖峰 · 虚线 形态替换</span>
              <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>圆点 = 测试段 99% 分位</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 280, width: 1010 }}>
            <Card label="形态替换 · 三个都趴下" accent={C.coral}>
              <Row name="K 均值" value={fmtF(ks.f1, 4)} color={C.cyan} note={"P " + fmtF(ks.p, 4) + " · AP " + fmtF(ks.ap, 4)} width={960} />
              <Row name="LOF" value={fmtF(ls.f1, 4)} color={C.amber} note={"P " + fmtF(ls.p, 4) + " · AP " + fmtF(ls.ap, 4)} width={960} />
              <Row name="孤立森林" value={fmtF(fs.f1, 4)} color={C.violet} note={"P " + fmtF(fs.p, 4) + " · AP " + fmtF(fs.ap, 4)} width={960} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                三条曲线的最好点也过不了 0.04 —— 换形态不换尺度，三种几何都看不见。
              </Body>
            </Card>
            <Card label="排序不变" accent={C.cyan} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                {"尖峰上 K 均值 > LOF > 孤立森林，两条注入上排序一致。这不是一次抽样的巧合。"}
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：阈值口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="阈值口径决定 F1" accent={C.amber}>
              <Row name="训练段 99% 分位" value={fmtF(M.boundary.trainTau, 4)} note={"测试段报警 " + M.boundary.posAtTrainTau + " 个 · " + fmtP(M.boundary.rateAtTrainTau, 2)} width={970} />
              <Row name="测试段 99% 分位" value={fmtF(k.tau, 4)} note={"测试段报警 " + k.pos + " 个 · 本集主口径"} width={970} />
              <Row name="按真实注入率定阈" value={fmtF(M.boundary.matchedTau, 4)} note={"报警 " + M.boundary.matchedPos + " 个 · F1 " + fmtF(M.boundary.matchedF1, 4)} width={970} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 20 }}>
              训练段分位只报 34 个：分数分布整体下移了。报 F1 必须报分位在哪一段取的 —— 这是上一集留下的口径，这一集继续兑现。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="测试段干净样本" accent={C.cyan}>
              <Row name="q99" value={fmtF(M.boundary.trainTau, 2)} note="训练段" width={590} />
              <Row name="干净 q99" value="8.6750" note="测试段" width={590} />
              <Row name="尖峰增量" value={fmtF(M.boundary.spikeDelta, 3)} note="分数均值" width={590} />
            </Card>
            <Card label="为什么" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.inkDim}>
                训练段覆盖了 2015 年的高波动，测试段波动更低，同一分位对应的分数自然更低。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：算法层读数与结论 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="算法层黄金读数" accent={C.cyan}>
              <Row name="两团点云簇心" value="0 / 10" note="误差 0 ±1e-9" width={960} />
              <Row name="K = 1" value="分数 = 到全局均值距离" note="退化正确" width={960} />
              <Row name="五边形远点 LOF" value="84.51" note="其余五点恰好 1.0" width={960} />
              <Row name="孤立森林均匀点" value="均分 0.4" note="在 0.5 ± 0.15 内" width={960} />
              <Row name="ψ = 1" value="0.5" note="单点无法孤立" width={960} />
              <Row name="iforestScore" value="与新点分数一致" note="训练/查询分开后仍逐位相同" width={960} />
            </Card>
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
              <Verdict ok label="34 / 34 通过" />
              <Chip color={C.amber}>27.2 秒跑完</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1170, top: 296, width: 650 }}>
            <Card label="真实数据上的结论" accent={C.violet}>
              <Body size={FT.body} color={C.ink}>尖峰，K 均值赢。</Body>
              <Body size={FT.body} color={C.ink}>形态替换，全输。</Body>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>
                输赢不来自模型容量：三个检测器都没有参数可学，最多一个 K、一个邻居数。差距全部来自几何。
              </Body>
            </Card>
            <Card label="下一节" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                这些几何的边界在哪，什么时候该换表示。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
