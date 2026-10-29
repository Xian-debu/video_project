import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, V, beatAt } from "../shared";

const Seq: React.FC<{ xs: number[]; color: string }> = ({ xs, color }) => (
  <span style={{ display: "inline-flex", gap: 6 }}>
    {xs.map((v, i) => (
      <span key={i} style={{
        minWidth: 38, textAlign: "center", padding: "3px 7px", border: "1px solid " + C.panelLine,
        borderRadius: 7, fontFamily: "monospace", fontSize: FT.meta, color,
      }}>{String(v)}</span>
    ))}
  </span>
);

/** 验证：AGO、拟合、白化方程、softplus，四组数字都能回到一次运行。 */
export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 27);
  const k = V.key;

  return (
    <Scene id="verification">
      <Head kicker="05 / 四组数字" title="每个数字都能回到一次运行" goal="AGO、拟合、白化方程、softplus 溢出" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 880 }}>
        <Build at={b(0)}>
          <Card label="第一组 · 累加与还原" accent={C.cyan} pad={20} style={{ width: 880 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Seq xs={[1, 2, 3, 4]} color={C.inkDim} />
              <K>{"AGO"}</K>
              <Seq xs={k.ago} color={C.cyan} />
              <K>{"IAGO"}</K>
              <Seq xs={k.iago} color={C.inkDim} />
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 10 }}>
              {"输入 1,2,3,4；累加得到 1,3,6,10；差分逐位回到 1,2,3,4。整数运算，没有误差。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(15)} style={{ marginTop: 18 }}>
          <Card label="第三组 · 白化方程：RK4 vs 闭式" accent={C.violet} pad={20} style={{ width: 880 }}>
            <div style={{ display: "flex", gap: 40, alignItems: "flex-end" }}>
              <div>
                <K>{"最大误差（2400 步 · dt=0.01）"}</K>
                <div><Mono size={FT.h2} color={C.violet}>{String(k.rk4MaxError)}</Mono></div>
              </div>
              <div>
                <K>{"步数"}</K>
                <div><Num value={2400} size={32} color={C.inkDim} /></div>
              </div>
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
              {"RK4 与闭式解在 24 个整数点逐点对照；误差在 1e-13 量级，说明两条路径解的是同一个方程。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 996, top: 286, width: 780 }}>
        <Build at={b(5)}>
          <Card label="第二组 · GM(1,1) 闭式拟合" accent={C.amber} pad={20} style={{ width: 780 }}>
            <div style={{ display: "flex", gap: 26 }}>
              <div><K>{"a · 发展系数"}</K><div><Mono size={FT.body} color={C.cyan}>{String(k.a)}</Mono></div></div>
              <div><K>{"b · 灰作用量"}</K><div><Mono size={FT.body} color={C.cyan}>{String(k.b)}</Mono></div></div>
            </div>
            <div style={{ display: "flex", gap: 26, marginTop: 8 }}>
              <div><K>{"MAPE"}</K><div><Mono size={FT.body} color={C.amber}>{(k.mape * 100).toFixed(4) + "%"}</Mono></div></div>
              <div><K>{"末点还原"}</K><div><Mono size={FT.body} color={C.amber}>{String(k.forecastLast)}</Mono></div></div>
            </div>
            <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 8 }}>
              {"24 点，公比 0.97 的合成序列；两个未知数由 2×2 正规方程一次解出。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(19)} style={{ marginTop: 18 }}>
          <Card label="第四组 · softplus 的浮点边界" accent={C.cyan} pad={20} style={{ width: 780 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <K>{"x = 1000"}</K>
              <span style={{ fontFamily: "monospace", fontSize: FT.body, color: C.coral }}>{"朴素 → " + k.softplusNaive}</span>
              <span style={{ color: C.inkFaint }}>{"·"}</span>
              <span style={{ fontFamily: "monospace", fontSize: FT.body, color: C.cyan }}>{"稳定 → " + String(k.softplusStable)}</span>
            </div>
            <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 10 }}>
              <K>{"logSumExp([1000,1000])"}</K>
              <Mono size={FT.meta} color={C.cyan}>{String(k.logSumExp)}</Mono>
            </div>
            <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 8 }}>
              {"朴素版先 exp(1000) 溢出；稳定版提出公共指数，结果落在同一量级。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Build at={b(24)}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Mono size={FT.meta} color={C.cyan}>{"108 tests"}</Mono>
            <K>{"73 旧 + 17 CfC + 18 GM-ODE · 全部通过"}</K>
          </div>
        </Build>
        <Build at={b(25)}>
          <Mono size={FT.micro} color={C.inkFaint}>{"evidence/ch9-variants-20261029T155634.json · " + V.meta.evidenceSha.slice(0, 12)}</Mono>
        </Build>
      </div>
    </Scene>
  );
};
