import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Num, Plot, BP, beatAt, pct } from "../shared";

const LOG_BOTTOM = -16;
const LOG_TOP = -8;
const bx = (v: number) => 230 + ((Math.log10(v) - LOG_BOTTOM) / (LOG_TOP - LOG_BOTTOM)) * 560;

/** 验证：五组数字逐项对照，全部来自同一次运行。 */
export const SVerification: React.FC = () => {
  const f = useCurrentFrame();
  const b = (i: number) => beatAt("verification", i, 30);
  const k = BP.key;
  const grow = pct(f, b(0), b(0) + 60);

  const bars: { lab: string; v: number; c: string; note: string }[] = [
    { lab: "直接法 vs 闭式", v: k.relDirectClosed, c: C.violet, note: "4.7e−14" },
    { lab: "有限差分", v: k.relFiniteDiff, c: C.amber, note: "5.4e−10" },
    { lab: "RK4 vs 闭式", v: k.relRK4, c: C.cyan, note: "1.1e−15" },
    { lab: "连续伴随", v: k.relCont, c: C.cyan, note: "9.0e−15" },
  ];

  const mw = 720, mh = 240, mpl = 70, mpr = 26, mpt = 18, mpb = 46;
  const MX = (T: number) => mpl + ((Math.log10(T) - 5.2) / 1.2) * (mw - mpl - mpr);
  const MY = (by: number) => mh - mpb - ((Math.log10(by) - 4.4) / 3.8) * (mh - mpt - mpb);

  return (
    <Scene id="verification">
      <Head kicker="05 / 验证" title="每个数字都能回到一次运行" goal="闭式、直接、伴随、差分、内存，逐项对照" />

      <div style={{ position: "absolute", left: PAD, top: 256, width: 880 }}>
        <Build at={b(0)}>
          <Card label="相对误差 · 对数横轴" accent={C.amber} pad={16} style={{ width: 860 }}>
            <svg width={850} height={250} style={{ display: "block" }}>
              {[-16, -14, -12, -10, -8].map((e) => (
                <g key={e}>
                  <line x1={bx(10 ** e)} y1={10} x2={bx(10 ** e)} y2={218} stroke={C.panelLine} strokeWidth={1} opacity={0.55} />
                  <text x={bx(10 ** e)} y={238} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{e}</text>
                </g>
              ))}
              {bars.map((row, i) => {
                const y = 30 + i * 44;
                const full = bx(row.v) - 230;
                return (
                  <g key={row.lab}>
                    <text x={0} y={y + 15} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{row.lab}</text>
                    <rect x={230} y={y} width={Math.max(2, full * grow)} height={18} rx={3} fill={row.c} opacity={0.9} />
                    <text x={Math.min(820, 230 + full + 12)} y={y + 14} fill={row.c} fontFamily={FONT.mono} fontSize={FT.micro}>{row.note}</text>
                  </g>
                );
              })}
              <text x={230} y={252} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"log10(相对误差)"}</text>
            </svg>
            <div style={{ marginTop: 2 }}><Mono size={FT.micro} color={C.inkFaint}>{"伴随法与直接法逐位相同：rel = 0，不画柱。"}</Mono></div>
          </Card>
        </Build>

        <Build at={b(9)} style={{ marginTop: 12 }}>
          <Card label="峰值内存 · 直接法 vs 伴随法（对数轴）" accent={C.violet} pad={14} style={{ width: 860 }}>
            <Plot
              w={mw} h={mh} at={b(9)} dur={60}
              x={MX} y={MY}
              series={[
                { pts: [{ x: 200000, y: k.memDirect200k }, { x: 2000000, y: k.memDirect2m }], color: C.violet, width: 2.6, dot: true },
                { pts: [{ x: 200000, y: k.memAdjoint200k }, { x: 2000000, y: k.memAdjoint2m }], color: C.amber, width: 2.6, dot: true },
              ]}
              grid={{ x: [200000, 2000000], y: [1e5, 1e6, 1e7], fmtX: (v) => (v === 200000 ? "20 万步" : "200 万步"), fmtY: (v) => (v === 1e5 ? "100 KB" : v === 1e6 ? "1 MB" : "10 MB") }}
            />
            <div style={{ display: "flex", gap: 22 }}>
              <Mono size={FT.micro} color={C.violet}>{"— 直接法 ×11.955063174960559"}</Mono>
              <Mono size={FT.micro} color={C.amber}>{"— 伴随法 ×0.4656114414269645"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 960, top: 256, width: 860 }}>
        <Build at={b(3)}>
          <Card label="第一组 · 三个梯度，同一个数" accent={C.cyan} pad={14} style={{ width: 840 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"闭式"}</Mono><div><Num value={k.gradClosed} size={19} color={C.inkDim} /></div></div>
              <div><Mono size={FT.micro} color={C.violet}>{"直接"}</Mono><div><Num value={k.gradDirect} size={19} color={C.violet} /></div></div>
              <div><Mono size={FT.micro} color={C.amber}>{"伴随"}</Mono><div><Num value={k.gradAdjoint} size={19} color={C.amber} /></div></div>
            </div>
            <div style={{ marginTop: 6 }}><Mono size={FT.micro} color={C.inkFaint}>{"x_T = 2.7115171229292927　|　直接法与伴随法差值 = 0"}</Mono></div>
          </Card>
        </Build>

        <Build at={b(7)} style={{ marginTop: 10 }}>
          <Card label="第二组 · 独立裁判" accent={C.amber} pad={14} style={{ width: 840 }}>
            <div style={{ display: "flex", gap: 26 }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"有限差分"}</Mono><div><Num value={k.gradFiniteDiff} size={19} color={C.amber} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"相对误差"}</Mono><div><Num value={k.relFiniteDiff} size={19} color={C.inkDim} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"错误符号"}</Mono><div><Num value={k.gradWrongSign} size={19} color={C.inkFaint} /></div></div>
            </div>
            <div style={{ marginTop: 6 }}><Mono size={FT.micro} color={C.inkFaint}>{"RK4 与连续伴随分别对闭式：rel 1.110223024625157e−15 / 8.985420969244963e−15"}</Mono></div>
          </Card>
        </Build>

        <Build at={b(14)} style={{ marginTop: 10 }}>
          <Card label="第三组 · 内存实测（独立进程）" accent={C.violet} pad={14} style={{ width: 840 }}>
            <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"直接 20 万"}</Mono><div><Num value={k.memDirect200k} size={18} color={C.violet} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"直接 200 万"}</Mono><div><Num value={k.memDirect2m} size={18} color={C.violet} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"伴随 20 万"}</Mono><div><Num value={k.memAdjoint200k} size={18} color={C.amber} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"伴随 200 万"}</Mono><div><Num value={k.memAdjoint2m} size={18} color={C.amber} /></div></div>
            </div>
          </Card>
        </Build>

        <Build at={b(23)} style={{ marginTop: 10 }}>
          <Card label="彩蛋 · 把上一集的 k̂ 代进同一条链" accent={C.cyan} pad={14} style={{ width: 840 }}>
            <div style={{ display: "flex", gap: 26, alignItems: "baseline" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"k̂"}</Mono><div><Num value={k.stockK} size={18} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"终点"}</Mono><div><Num value={k.stockXT} size={18} color={C.violet} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"梯度"}</Mono><div><Num value={k.stockGrad} size={18} color={C.amber} /></div></div>
            </div>
            <div style={{ marginTop: 5 }}><Mono size={FT.micro} color={C.inkFaint}>{"200 步、x₀=1；不是预测，只是把真实参数放进这条链。"}</Mono></div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
