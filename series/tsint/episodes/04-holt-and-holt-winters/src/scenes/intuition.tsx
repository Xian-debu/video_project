import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, HoltPlot, K, Mono, PAD, Pages, Scene, SceneHead, lf, M } from "../shared";

/** 加性 vs 乘性：同样五个位置，水平翻倍时偏移怎么变。 */
const ScaleSketch: React.FC = () => {
  const add = [1.27, -1.53, -6.01, 0.45, 5.81];
  const W = 780, H = 258;
  const rows = [
    { label: "加法 · 水平翻倍，偏移不变", y: 96, mult: 1, color: C.cyan },
    { label: "乘法 · 水平翻倍，偏移也翻倍", y: 214, mult: 2, color: C.violet },
  ];
  const scale = 4.6;
  const sx = (i: number) => 356 + i * 86;
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      {rows.map((r) => {
        const up = Math.max(...add.map((v) => v * r.mult * scale));
        return (
          <g key={r.label}>
            <text x={20} y={r.y - up - 16} fill={r.color} fontFamily={FONT.mono} fontSize={FT.micro}>{r.label}</text>
            <line x1={20} y1={r.y} x2={W - 20} y2={r.y} stroke={C.panelLine} strokeWidth={1} />
            {add.map((v, i) => {
              const h = Math.max(2, Math.abs(v) * r.mult * scale);
              return (
                <rect
                  key={i}
                  x={sx(i) - 15}
                  y={v >= 0 ? r.y - h : r.y}
                  width={30}
                  height={h}
                  fill={r.color}
                  opacity={0.9}
                  rx={2}
                />
              );
            })}
            <text x={20} y={r.y + 18} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
              {r.mult === 1 ? "水平 = 1×" : "水平 = 2×"}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** 直觉：三个旋钮、一次往误差挪、外推的喇叭、两种季节。 */
export const SIntuition: React.FC = () => {
  const id = "intuition";
  const b = (k: number) => lf(id, k);
  const dl = M.holt.daily;
  const a5 = M.hw.add5;
  const ip = M.hw.intraday;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.26, 0.52, 0.76]}>
        {/* 1 · 三个旋钮 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 264, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>三个旋钮，各管一件事；它们争的是同一份误差。</Body>
          </div>
          {[
            { k: "α", t: "水平", d: "今天的数据信多少；大则快而抖，小则稳而慢。", c: C.amber },
            { k: "β", t: "趋势", d: "斜率更新多快；等于零就冻结趋势，退化成一次平滑。", c: C.cyan },
            { k: "γ", t: "季节", d: "这个位置的偏移改多少；等于零则季节形状不动。", c: C.violet },
          ].map((x, i) => (
            <div key={x.k} style={{ position: "absolute", left: PAD + i * 608, top: 350 }}>
              <Build at={b(0.02 + i * 0.03)}>
                <Card label={"旋钮 " + (i + 1)} accent={x.c} pad={22} style={{ width: 560, height: 300 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: x.c, lineHeight: 1 }}>{x.k}</div>
                    <Body size={FT.body} color={C.ink} style={{ fontFamily: FONT.serif }}>{x.t}</Body>
                  </div>
                  <Body size={FT.body} style={{ marginTop: 18 }}>{x.d}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 700, width: 1776 }}>
            <Build at={b(0.1)}>
              <Card accent={C.inkFaint} pad={18} style={{ width: 1776, height: 100 }}>
                <Body size={FT.body}>参数不是「调得越细越好」：三个旋钮合起来，只够决定一条曲线的形状和速度。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 三次挪 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 860 }}>
            <Build at={b(0.28)}>
              <Card label="一步递推 · 先算预测" accent={C.amber} pad={24} style={{ width: 860, height: 380 }}>
                <Mono size={FT.mono} color={C.ink}>ŷ_t = s_{"{t−1}"} + b_{"{t−1}"} + p_{"{t−L}"}</Mono>
                <div style={{ marginTop: 18 }}><Mono size={FT.mono} color={C.ink}>e_t = x_t − ŷ_t</Mono></div>
                <Body size={FT.body} style={{ marginTop: 20 }}>误差只有一份；三个状态分别往误差的方向挪，各自挪一个比例。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.amber}>预测先于误差</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 262, width: 876 }}>
            <Build at={b(0.32)}>
              <Card label="三次挪，三个比例" accent={C.cyan} pad={24} style={{ width: 876, height: 380 }}>
                {[
                  ["水平", "s_t ← s_{t−1} + b_{t−1} + α e_t", C.amber],
                  ["趋势", "b_t ← b_{t−1} + α β e_t", C.cyan],
                  ["季节", "p_t ← p_{t−L} + γ e_t", C.violet],
                ].map(([n, f, c]) => (
                  <div key={String(n)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid " + C.panelLine }}>
                    <K style={{ width: 56 }}>{n as string}</K>
                    <Mono size={FT.mono} color={c as string}>{f as string}</Mono>
                  </div>
                ))}
                <Body size={FT.body} style={{ marginTop: 16 }}>三行递推，其实就是三次往误差挪；这就是指数平滑家族的全部秘密。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 686, width: 1776 }}>
            <Build at={b(0.38)}>
              <Card accent={C.coral} pad={18} style={{ width: 1776, height: 100 }}>
                <Body size={FT.body}>顺序很重要：水平先用旧趋势，趋势再用新水平；换一下，曲线看起来也合理，但数值不同。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 外推 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 1400 }}>
            <Body color={C.ink} size={FT.lead}>外推：{dl.forecast.length} 步之后，斜线还在走，水平线已经停在原地。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 330 }}>
            <Build at={b(0.54)}>
              <HoltPlot width={1190} height={390} shows={["close", "holt"]} at={b(0.53)} from={560} title="尾部 170 个交易日 · 虚线是 5 步外推" forecast={{ from: 729, values: dl.forecast }} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1216, top: 330, width: 560 }}>
            <Build at={b(0.57)}>
              <Card label="外推的代价" accent={C.coral} pad={22} style={{ width: 560, height: 230 }}>
                <Body size={FT.body} color={C.ink}>h 步预测 = s + h · b；越远，误差方差越大。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>所以区间是一个张开的喇叭，不是一条确定的线。</Body>
              </Card>
            </Build>
            <Build at={b(0.6)}>
              <Card label="五步之后" accent={C.amber} pad={22} style={{ width: 560, height: 128, marginTop: 18 }}>
                <Mono size={FT.mono} color={C.amber}>{dl.forecast.map((x: number) => x.toFixed(1)).join(" / ")}</Mono>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 750, width: 1776 }}>
            <Body size={FT.meta}>斜线能走出去，但走不出转折；拐点要靠新数据一点点拽回来。</Body>
          </div>
        </div>

        {/* 4 · 两种季节 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 900 }}>
            <Build at={b(0.78)}>
              <Card label="同一个形状，两种写法" accent={C.violet} pad={22} style={{ width: 900, height: 430 }}>
                <ScaleSketch />
                <Body size={FT.meta} style={{ marginTop: 10 }}>上排是加法，下排是乘法；水平越高，乘法的偏移越大。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 262, width: 836 }}>
            <Build at={b(0.81)}>
              <Card label="日内成交量 · 形状在成交量里" accent={C.cyan} pad={22} style={{ width: 836, height: 430 }}>
                <Body size={FT.body} color={C.ink}>开盘最忙，中午最闲，收盘前又起来；价格里没有这个 U 形。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>所以 L=48 的季节，用成交量做，形状才稳定；用价格做，只会拟合噪声。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.cyan}>日内 {ip.L} 根 · {M.data.intradayDays} 天</Chip></div>
                <div style={{ marginTop: 12 }}><Chip color={C.coral}>但成交量有零，乘法要保护</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 716, width: 1776 }}>
            <Build at={b(0.87)}>
              <Card accent={C.amber} pad={18} style={{ width: 1776, height: 100 }}>
                <Body size={FT.body}>加法季节振幅 {a5.amp.toFixed(2)} 元；乘法把同一个形状写成水平乘数，水平翻倍，偏移也翻倍。</Body>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
