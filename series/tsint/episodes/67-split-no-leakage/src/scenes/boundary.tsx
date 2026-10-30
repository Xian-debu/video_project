import React from "react";
import { useCurrentFrame } from "remotion";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt, pct } from "../shared";

/** 边界：四组数字、70 轮误差、固定预测的 train/test/gap。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 54);
  const s = M.split, fx = M.fixed, r = M.rolling, p = M.panel;
  return (
    <Scene id="boundary">
      <Head kicker="07 / 四组数字" title="每个数都能回到一次运行" goal="合成样本、真实数据、阈值、二十只股票" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <Build at={b(0)} style={{ width: 429 }}>
            <Stat4 label="第一组 · 十点切分" value="7 / 1 / 2" color={C.cyan} lines={["train 0–6", "val 7 · test 8–9"]} />
          </Build>
          <Build at={b(7)} style={{ width: 429 }}>
            <Stat4 label="第二组 · 滚动轮数" value="8 轮" color={C.violet} lines={["n=100 f=5 n_init=60 s=5", "末轮 train [1..95]"]} />
          </Build>
          <Build at={b(17)} style={{ width: 429 }}>
            <Stat4 label="第三组 · 真实数据" value="1820 / 260 / 520" color={C.amber} lines={["2600 个交易日", "leaks 0 vs 2"]} />
          </Build>
          <Build at={b(27)} style={{ width: 429 }}>
            <Stat4 label="第四组 · 查表探针" value="170.2×" color={C.coral} lines={["5.062 → 0.0297", "一个数量级"]} />
          </Build>
        </div>

        <Build at={b(44)} style={{ marginTop: 20 }}>
          <Card label="滚动预测 · 70 轮误差 · f=20 · n_init=1200 · step=20" accent={C.coral} style={{ width: 980, height: 430 }} pad={20}>
            <RollingChart at={b(44)} />
            <div style={{ display: "flex", gap: 26, marginTop: 8 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>mean <span style={{ color: C.cyan }}>{r.mean.toFixed(3)}</span></span>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>min <span style={{ color: C.cyan }}>{r.min.toFixed(4)}</span> · r44</span>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>max <span style={{ color: C.coral }}>{r.max.toFixed(2)}</span> · r14</span>
              <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>末轮 train→{r.lastTrainEnd} · test→{r.lastTestEnd}</span>
            </div>
          </Card>
        </Build>

        <Build at={b(28)} style={{ position: "absolute", left: 1000, top: 170, width: 776 }}>
          <Card label="固定预测 · f=20 · 最后 20 个交易日" accent={C.violet} style={{ width: 776, height: 300 }} pad={20}>
            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr 1fr", rowGap: 8 }}>
              <H>head</H><H right>train</H><H right>test</H><H right>gap</H>
              <Row2 name="naive" a={fx.naive.train_mse} b={fx.naive.test_mse} g={fx.naive.gap} gc={C.cyan} />
              <Row2 name="linear" a={fx.linear.train_mse} b={fx.linear.test_mse} g={fx.linear.gap} gc={C.coral} />
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "12px 0" }} />
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.55 }}>
              朴素头 train 0.059 / test 0.095，测试比训练差，符合预期。<br />
              线性头 train 7.42，负 gap 不是泛化好，是训练都没拟合——欠拟合。
            </div>
          </Card>
        </Build>

        <Build at={b(52)} style={{ position: "absolute", left: 1000, top: 486, width: 776 }}>
          <Card accent={C.cyan} style={{ width: 776, height: 94 }} pad={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Mono size={FT.num} color={C.cyan}>50</Mono>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
                条断言全部通过 · 面板 {p.symbols} 只日期违规 {p.dateViolations} · 共享日期轴生效
              </div>
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(50)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>机制可复现，数字可复算。</div>
      </Build>
    </Scene>
  );
};

const Stat4: React.FC<{ label: string; value: string; color: string; lines: string[] }> = ({ label, value, color, lines }) => (
  <Card label={label} accent={color} style={{ width: 429, height: 170 }} pad={18}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color, letterSpacing: -0.5 }}>{value}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 6, lineHeight: 1.5 }}>
      {lines.map((l) => <div key={l}>{l}</div>)}
    </div>
  </Card>
);

const H: React.FC<{ children: React.ReactNode; right?: boolean }> = ({ children, right }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, textAlign: right ? "right" : "left" }}>{children}</div>
);

const Row2: React.FC<{ name: string; a: number; b: number; g: number; gc: string }> = ({ name, a, b, g, gc }) => (
  <>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink }}>{name}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, textAlign: "right" }}>{a.toFixed(4)}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, textAlign: "right" }}>{b.toFixed(4)}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: gc, textAlign: "right" }}>{g > 0 ? "+" : ""}{g.toFixed(3)}</div>
  </>
);

const RollingChart: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = pct(f, at, at + 50);
  const errs = M.rolling.errors;
  const w = 936, h = 300, padL = 48, padB = 28, padT = 10;
  const maxY = 4;
  const x = (i: number) => padL + (i / (errs.length - 1)) * (w - padL - 8);
  const y = (v: number) => padT + (1 - v / maxY) * (h - padT - padB);
  const pts = errs.map((v, i) => x(i).toFixed(1) + "," + y(v).toFixed(1)).join(" ");
  const maxI = errs.indexOf(Math.max(...errs));
  const minI = errs.indexOf(Math.min(...errs));
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      {[0, 1, 2, 3, 4].map((v) => (
        <line key={v} x1={padL} y1={y(v)} x2={w - 8} y2={y(v)} stroke={C.panelLine} strokeWidth={1} opacity={0.5} />
      ))}
      {[0, 1, 2, 3, 4].map((v) => (
        <text key={"t" + v} x={padL - 10} y={y(v) + 4} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{v}</text>
      ))}
      <polyline points={pts} fill="none" stroke={C.coral} strokeWidth={2} strokeLinejoin="round" pathLength={1}
        strokeDasharray={p + " 1"} />
      <line x1={padL} y1={y(M.rolling.mean)} x2={w - 8} y2={y(M.rolling.mean)} stroke={C.cyan} strokeWidth={1.4} strokeDasharray="5 5" opacity={0.9} />
      <text x={w - 10} y={y(M.rolling.mean) - 6} textAnchor="end" fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro}>mean 0.680</text>
      <circle cx={x(maxI)} cy={y(errs[maxI])} r={4} fill={C.coral} opacity={p} />
      <text x={x(maxI) + 8} y={y(errs[maxI]) - 8} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro} opacity={p}>max 3.73</text>
      <circle cx={x(minI)} cy={y(errs[minI])} r={4} fill={C.cyan} opacity={p} />
      <text x={x(minI) + 8} y={y(errs[minI]) + 16} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro} opacity={p}>min 0.0075</text>
      <text x={padL} y={h - 6} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>round 1</text>
      <text x={w - 8} y={h - 6} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>round 70</text>
    </svg>
  );
};
