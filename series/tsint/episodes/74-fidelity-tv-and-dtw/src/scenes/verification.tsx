import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, beatAt, V } from "../shared";

const Seq: React.FC<{ xs: number[]; color: string }> = ({ xs, color }) => (
  <span style={{ display: "inline-flex", gap: 6 }}>
    {xs.map((v, i) => (
      <span key={i} style={{
        minWidth: 32, textAlign: "center", padding: "2px 6px", border: "1px solid " + C.panelLine,
        borderRadius: 6, fontFamily: FONT.mono, fontSize: FT.meta, color,
      }}>{String(v)}</span>
    ))}
  </span>
);

/** 验证：六组数字来自同一次证据运行。 */
export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 26);
  const k = V.key;

  return (
    <Scene id="verification">
      <Head kicker="05 / 六组数字" title="每个数字都能回到一次运行" goal="定义、λ 曲线、黄金例、平移、三角反例、带约束" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 820 }}>
        <Build at={b(0)}>
          <Card label="第一组 · TV 的定义" accent={C.amber} pad={20} style={{ width: 820 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Seq xs={[1, 2, 4, 7]} color={C.inkDim} />
              <K>{"相邻差"}</K>
              <Seq xs={[1, 2, 3]} color={C.amber} />
            </div>
            <div style={{ display: "flex", gap: 44, alignItems: "flex-end", marginTop: 10 }}>
              <div><K>{"TV"}</K><div><Num value={6} size={FT.h2} color={C.amber} /></div></div>
              <div><K>{"黄金例代价"}</K><div><Num value={k.golden.cost} size={FT.h2} color={C.cyan} /></div></div>
              <div style={{ paddingBottom: 5 }}><Chip color={C.cyan}>{"路径 3 步"}</Chip></div>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 960, top: 286, width: 780 }}>
        <Build at={b(4)}>
          <Card label="第二组 · 三档 λ 的完整数值" accent={C.cyan} pad={18} style={{ width: 780 }}>
            {[
              ["λ = 0", k.lambdaZero],
              ["λ = 0.005", k.best],
              ["λ = 0.05", k.over],
            ].map(([label, m]) => (
              <div key={String(label)} style={{ display: "flex", gap: 12, alignItems: "baseline", marginTop: label === "λ = 0" ? 0 : 7 }}>
                <Mono size={FT.micro} color={C.inkFaint} style={{ minWidth: 92 }}>{String(label)}</Mono>
                <K>{"TV"}</K>
                <Mono size={FT.meta} color={C.amber} style={{ minWidth: 200 }}>{String((m as typeof k.best).tv)}</Mono>
                <K>{"clean MSE"}</K>
                <Mono size={FT.meta} color={C.cyan}>{String((m as typeof k.best).cleanMse)}</Mono>
              </div>
            ))}
            <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 8 }}>
              {"八档全部在 data/evidence/tv_curve.csv；这里只挑三档。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 590, width: 820 }}>
        <Build at={b(9)}>
          <Card label="第三组 · 相位平移" accent={C.violet} pad={20} style={{ width: 820 }}>
            <div style={{ display: "flex", gap: 38, alignItems: "flex-end" }}>
              <div><K>{"逐点 MSE"}</K><div><Num value={k.shift.mse} size={FT.h2} color={C.amber} /></div></div>
              <div><K>{"DTW"}</K><div><Num value={k.shift.cost} size={FT.h2} color={C.cyan} /></div></div>
              <div><K>{"路径长度"}</K><div><Num value={k.shift.pathLength} size={FT.h2} color={C.violet} /></div></div>
            </div>
            <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 8 }}>
              {"同一个 21 点形状，晚三步；MSE 与 DTW 差出一个数量级以上。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 960, top: 590, width: 780 }}>
        <Build at={b(15)}>
          <Card label="第四组 · 三角反例与带约束" accent={C.coral} pad={20} style={{ width: 780 }}>
            <div style={{ display: "flex", gap: 22, alignItems: "baseline" }}>
              <Mono size={FT.meta} color={C.violet}>{"DTW(x,z) = " + k.triangle.xz}</Mono>
              <Mono size={FT.meta} color={C.inkDim}>{">"}</Mono>
              <Mono size={FT.meta} color={C.inkDim}>{"DTW(x,y) + DTW(y,z) = " + k.triangle.sum}</Mono>
              <Chip color={C.coral}>{"违反 " + k.triangle.violation}</Chip>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "12px 0" }} />
            <div style={{ display: "flex", gap: 30 }}>
              <div><K>{"banded · n / w"}</K><div><Mono size={FT.meta} color={C.inkDim}>{k.banded.n + " / " + k.banded.w}</Mono></div></div>
              <div><K>{"代价"}</K><div><Mono size={FT.meta} color={C.cyan}>{String(k.banded.cost)}</Mono></div></div>
              <div><K>{"耗时"}</K><div><Mono size={FT.meta} color={C.amber}>{k.banded.ms + " ms"}</Mono></div></div>
            </div>
            <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 8 }}>
              {"带约束代价与完整 DTW 相等；耗时是这一次运行的实测值。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Build at={b(22)}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Mono size={FT.meta} color={C.cyan}>{V.meta.tests + " tests"}</Mono>
            <K>{"108 旧 + 19 TvReg + 15 Dtw · 全部通过"}</K>
          </div>
        </Build>
        <Build at={b(24)}>
          <Mono size={FT.micro} color={C.inkFaint}>{"evidence/ch9-fidelity-20261029T165851.json · " + V.meta.tsBaseCommit}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
