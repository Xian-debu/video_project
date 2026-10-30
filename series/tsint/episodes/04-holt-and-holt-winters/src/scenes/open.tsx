import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, HoltPlot, K, Mono, PAD, Pages, Scene, SceneHead, fmtInt, lf, M } from "../shared";

/** 开场示意：一次平滑的预测是一条水平线，Holt 的是一条斜线。 */
const Flatten: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const pts = [0.12, 0.17, 0.14, 0.21, 0.19, 0.26, 0.31, 0.28, 0.36, 0.33, 0.44];
  const n = pts.length;
  const sx = (i: number) => 46 + (i / (n - 1)) * (width - 110);
  const lo = 0.08;
  const hi = 0.6;
  const yTop = 62;
  const yBot = height - 54;
  // 价格越往上，屏幕上的 y 越小。
  const sy = (v: number) => yBot - ((v - lo) / (hi - lo)) * (yBot - yTop);
  const d = pts.map((v, i) => (i === 0 ? "M" : "L") + sx(i).toFixed(1) + "," + sy(v).toFixed(1)).join(" ");
  const lastX = sx(n - 1);
  const lastY = sy(pts[n - 1]);
  const slopeY = lastY - 46;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <line x1={46} y1={yBot + 26} x2={width - 40} y2={yBot + 26} stroke={C.panelLine} />
      <line x1={46} y1={yTop - 22} x2={46} y2={yBot + 26} stroke={C.panelLine} />
      <path d={d} fill="none" stroke={C.inkFaint} strokeWidth={2} opacity={0.85} />
      <line x1={lastX} y1={lastY} x2={width - 40} y2={lastY} stroke={C.cyan} strokeWidth={2.4} strokeDasharray="7 6" />
      <line x1={lastX} y1={lastY} x2={width - 40} y2={slopeY} stroke={C.amber} strokeWidth={2.4} strokeDasharray="7 6" />
      <text x={width - 44} y={lastY + 20} textAnchor="end" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>水平预测</text>
      <text x={width - 44} y={slopeY - 12} textAnchor="end" fill={C.amber} fontFamily={FONT.mono} fontSize={FT.micro}>斜线预测</text>
    </svg>
  );
};

/** 开场：三次递推、两个新状态、三个数字。 */
export const SOpen: React.FC = () => {
  const id = "open";
  const b = (k: number) => lf(id, k);
  const d = M.data;
  const man = M.holt.manual;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.19, 0.38, 0.6, 0.82]}>
        {/* 1 · 水平线 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 960 }}>
            <Build at={b(0.008)}>
              <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, lineHeight: 1.5 }}>一次平滑的预测，是一条水平线。</Body>
            </Build>
            <Build at={b(0.02)}>
              <Body size={FT.lead} style={{ marginTop: 12 }}>它只知道水平，不知道方向，也不知道季节。</Body>
            </Build>
            <Build at={b(0.04)}>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <Chip color={C.coral}>看不见趋势</Chip>
                <Chip color={C.violet}>看不见季节</Chip>
                <Chip color={C.cyan}>只剩一个状态</Chip>
              </div>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 448, width: 980 }}>
            <Build at={b(0.05)}>
              <Card accent={C.amber} pad={20} style={{ width: 940, height: 140 }}>
                <Body size={FT.body}>Holt 加趋势，Holt-Winters 再加季节；每加一个状态，多一行递推、多一个旋钮。</Body>
                <K>这一集就讲这两次加法，以及它们各自的代价</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1060, top: 262, width: 716 }}>
            <Build at={b(0.03)}>
              <Card accent={C.panelLine} pad={18} style={{ width: 700, height: 330 }}>
                <Flatten width={660} height={280} />
                <K>灰线是价格；虚线是两种模型的外推</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 数据 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 1400 }}>
            <Body color={C.ink} size={FT.lead}>贵州茅台，二零一九年初到二零二一年底；七百三十个交易日，前复权。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 330 }}>
            <Build at={b(0.21)}>
              <HoltPlot width={1190} height={406} shows={["close", "holt"]} at={b(0.2)} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1216, top: 330, width: 560 }}>
            <Build at={b(0.24)}>
              <Card label="样本" accent={C.cyan} pad={22} style={{ width: 560, height: 188 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: C.cyan, lineHeight: 1 }}>{fmtInt(d.daily.rows)} 行</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>{d.daily.first} → {d.daily.last}</Body>
              </Card>
            </Build>
            <Build at={b(0.27)}>
              <Card label="区间" accent={C.amber} pad={22} style={{ width: 560, height: 188, marginTop: 30 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: C.amber, lineHeight: 1 }}>+{d.gainPct.toFixed(2)}%</div>
                <Body size={FT.meta} style={{ marginTop: 12 }}>从 {d.firstClose.toFixed(0)} 元，到最高 {d.daily.max.toFixed(0)} 元</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 三个数 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>先记住三个数：手算到第三步的三个状态量。</Body>
          </div>
          {[
            { l: "水平 s3", v: "13.28125", s: "α=0.5 · 三步之后", c: C.amber },
            { l: "趋势 b3", v: "1.296875", s: "单位：每天涨多少", c: C.cyan },
            { l: "下一步预测 ŷ4", v: "14.578125", s: "s3 + b3", c: C.violet },
          ].map((x, i) => (
            <div key={x.l} style={{ position: "absolute", left: PAD + i * 608, top: 380, width: 560 }}>
              <Build at={b(0.4 + i * 0.02)}>
                <Card label={x.l} accent={x.c} pad={22} style={{ width: 560, height: 240 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.display - 6, color: x.c, lineHeight: 1, letterSpacing: -1 }}>{x.v}</div>
                  <Body size={FT.meta} style={{ marginTop: 14 }}>{x.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 660, width: 1776 }}>
            <Build at={b(0.44)}>
              <Card accent={C.inkFaint} pad={20} style={{ width: 1776, height: 118 }}>
                <Body size={FT.body}>这三个数，后面每一个都能回到一条断言：{man.x.join("、")} 三步的手算。</Body>
                <K>黄金样例，不靠眼睛</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 家族 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>同一个家族，三个成员；差别只在状态个数。</Body>
          </div>
          {[
            { n: "SES", st: "水平", kn: "α", c: C.cyan, f: "s_t = α x_t + (1-α) s_{t-1}" },
            { n: "Holt", st: "水平 + 趋势", kn: "α β", c: C.amber, f: "s_t = α x_t + (1-α)(s+b); b_t = β Δs + (1-β) b" },
            { n: "Holt-Winters", st: "水平 + 趋势 + 季节", kn: "α β γ L", c: C.violet, f: "再加上 p_t，周期 L" },
          ].map((x, i) => (
            <div key={x.n} style={{ position: "absolute", left: PAD + i * 608, top: 360 }}>
              <Build at={b(0.62 + i * 0.02)}>
                <Card label={"成员 " + (i + 1)} accent={x.c} pad={22} style={{ width: 560, height: 300 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: x.c }}>{x.n}</div>
                  <Body size={FT.body} color={C.ink} style={{ marginTop: 10 }}>{x.st}</Body>
                  <div style={{ marginTop: 12 }}><Mono size={FT.code} color={C.inkDim}>{x.f}</Mono></div>
                  <div style={{ marginTop: 14 }}><K>旋钮：{x.kn}</K></div>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 688, width: 1776 }}>
            <Build at={b(0.68)}>
              <Card accent={C.cyan} pad={20} style={{ width: 1776, height: 116 }}>
                <Body size={FT.body}>周内季节 L=5，日内季节 L=48；每多一个状态，就多一个旋钮要交代。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 5 · 除法 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 860 }}>
            <Build at={b(0.84)}>
              <Card label="加法与乘法的分界" accent={C.coral} pad={24} style={{ width: 860, height: 360 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>乘法把季节写成百分比，于是出现除法。</Body>
                <div style={{ marginTop: 18 }}><Mono size={FT.mono} color={C.inkDim}>s_t = α (x_t / p_{"{t-L}"}) + (1-α)(s_{"{t-1}"} + b_{"{t-1}"})</Mono></div>
                <Body size={FT.body} style={{ marginTop: 16 }}>分母为零或负，递推当场失效。不是精度问题，是定义域问题。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.coral}>零是一个会传染的状态</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 288, width: 876 }}>
            <Build at={b(0.87)}>
              <Card label="A 股成交量里的零" accent={C.amber} pad={24} style={{ width: 876, height: 360 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontFamily: FONT.mono, fontSize: FT.display - 20, color: C.amber }}>{fmtInt(d.volume.zero_rows)}</div><Body size={FT.micro}>零的交易日</Body></div>
                  <div><div style={{ fontFamily: FONT.mono, fontSize: FT.display - 20, color: C.coral }}>{fmtInt(d.volume.max_zero_run)}</div><Body size={FT.micro}>最长连续零（天）</Body></div>
                  <div><div style={{ fontFamily: FONT.mono, fontSize: FT.display - 20, color: C.cyan }}>{fmtInt(d.volume.rows)}</div><Body size={FT.micro}>总行数</Body></div>
                </div>
                <Body size={FT.body} style={{ marginTop: 18 }}>停牌记零，不是缺失；四千四百八十七行里，一半以上是零。</Body>
                <K>乘法模型不能直接吃进去</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 676, width: 1776 }}>
            <Build at={b(0.9)}>
              <Card accent={C.violet} pad={20} style={{ width: 1776, height: 118 }}>
                <Body size={FT.body}>另一条主线：趋势对一步误差可能是负担，但在外推时是唯一的出路。</Body>
                <K>两件事要分开说，不能合成一句「趋势有用」</K>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
