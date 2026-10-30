import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, Plot, M, beatAt } from "../shared";

/** 直觉：MAE 与 MAPE 不共线；MASE 用训练段做分母，才敢跨股票比。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 27);
  const W = 960, H = 448;
  const lx = (v: number) => 70 + ((Math.log10(v) + 1.4) / 2.6) * (W - 110);
  const ly = (v: number) => H - 70 - ((v - 0.5) / 1.7) * (H - 120);
  const focus = ["sh600900", "sh600519", "sh601398", "sh601888"];
  const dots = M.levels.map((l) => ({
    l,
    on: focus.includes(l.code),
  }));

  return (
    <Scene id="intuition">
      <Head kicker="03 / 两把尺不共线" title="点不沿斜线排" goal="MAE 小，MAPE 不一定小" />

      <Build at={b(0)} style={{ position: "absolute", left: PAD, top: 282 }}>
        <Card label="20 只 A 股 · naive-1 · 横轴对数价格误差，纵轴百分比误差" accent={C.cyan} pad={20} style={{ width: 1010 }}>
          <Plot
            w={W} h={H} at={b(3)} dur={8}
            x={lx} y={ly}
            grid={{
              x: [0.04, 0.4, 4],
              y: [0.5, 1, 1.5, 2],
              fmtX: (v) => "MAE " + (v < 0.1 ? v.toFixed(2) : String(v)),
              fmtY: (v) => v.toFixed(1) + "%",
            }}
            series={dots.map((d) => ({
              pts: [{ x: d.l.mae, y: d.l.mapePct }],
              color: d.on ? C.amber : C.inkFaint,
              dot: true,
              width: d.on ? 0 : 0,
            }))}
            labels={[
              { x: 0.186, y: 0.6868, text: "长江电力 · MAE 6 / MAPE 1", color: C.cyan, dx: 12, dy: 24 },
              { x: 13.553, y: 0.929, text: "贵州茅台 · MAE 20 / MAPE 4", color: C.coral, dx: -10, dy: 26, anchor: "end" },
              { x: 0.054, y: 0.874, text: "工商银行 · MAE 1 / MAPE 2", color: C.amber, dx: 10, dy: -16 },
              { x: 1.171, y: 1.65, text: "中国中免 · MASE 最小", color: C.violet, dx: 10, dy: -16 },
            ]}
          />
          <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 6 }}>
            {"横轴每跨一格，价格误差乘十；纵轴是百分比。四个标注是后面要用到的点。"}
          </Body>
        </Card>
      </Build>

      <Build at={b(16)} style={{ position: "absolute", left: 1160, top: 282, width: 640 }}>
        <Card label="MASE · 训练段做分母" accent={C.violet} pad={22} style={{ width: 640 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <Num value={M.mase.belowOne} size={72} color={C.violet} />
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"/ 20 只小于 1"}</div>
          </div>
          <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
            {"小于 1 表示比季节朴素基准好；中位数 " + M.mase.median.toFixed(4) + "。"}
          </Body>
          <div style={{ marginTop: 18, borderTop: "1px solid " + C.panelLine, paddingTop: 14 }}>
            {[
              ["最小", M.mase.minName, M.mase.min.toFixed(4), C.cyan],
              ["最大", M.mase.maxName, M.mase.max.toFixed(4), C.coral],
            ].map(([k, n, v, c]) => (
              <div key={String(k)} style={{ display: "flex", alignItems: "baseline", marginBottom: 10 }}>
                <K>{String(k)}</K>
                <div style={{ flex: 1, marginLeft: 12, fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink }}>{String(n)}</div>
                <Mono size={FT.h3} color={String(c)}>{String(v)}</Mono>
              </div>
            ))}
          </div>
          <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 10 }}>
            {"MASE 的分母只用训练段，测试段不参与，所以能横着比。MAE 和 MAPE 没有这个基准。"}
          </Body>
        </Card>
      </Build>

      <Build at={b(23)} style={{ position: "absolute", left: PAD, top: 900, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"排序不是一维的；先问误差按什么罚。"}</div>
          <K>{"点在平面里散开，名次才会打架。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
