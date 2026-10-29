import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Body, Num, beatAt, NEURAL } from "../shared";

/** 边界：窗口内成立的东西，出了窗口要重新审。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 21);
  const k = NEURAL.key;
  const w = 824, h = 286;

  return (
    <Scene id="boundary">
      <Head kicker="06 / 边界" title="窗口内很好，窗口外呢" goal="四类失效条件：局部、成本、采样、外推" />

      <div style={{ position: "absolute", left: PAD, top: 266, display: "flex", gap: 30 }}>
        <Build at={b(2)}>
          <Card label="第一类 · 局部拟合" accent={C.amber} pad={18} style={{ width: w, height: h }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"拟合 ≠ 长程预测"}</div>
            <Body size={FT.body} style={{ marginTop: 8 }}>
              {"12 个窗、每窗只看 4 个后续点；整段 200 天里，损失曲线没见过的部分只能靠积分器自己走。"}
            </Body>
            <div style={{ display: "flex", gap: 26, marginTop: 12, alignItems: "baseline" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"50 步 RMSE"}</Mono><Num value={k.rmseStock50} size={24} color={C.cyan} /></div>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"整段 RMSE"}</Mono><Num value={k.rmseStockFull} size={24} color={C.amber} /></div>
            </div>
          </Card>
        </Build>

        <Build at={b(6)}>
          <Card label="第二类 · 数值梯度" accent={C.violet} pad={18} style={{ width: w, height: h }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"成本换透明"}</div>
            <Body size={FT.body} style={{ marginTop: 8 }}>
              {"337 个参数，每个两次扰动，就是 674 次前向；误差 O(h²)，但对每个参数都要重跑整条轨迹。"}
            </Body>
            <div style={{ display: "flex", gap: 26, marginTop: 12, alignItems: "baseline" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"前向 / epoch"}</Mono><Num value={674} size={24} color={C.violet} /></div>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"300 epoch / s"}</Mono><Num value={k.trainSeconds} size={24} color={C.cyan} /></div>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 584, display: "flex", gap: 30 }}>
        <Build at={b(11)}>
          <Card label="第三类 · 采样" accent={C.cyan} pad={18} style={{ width: w, height: h }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"不规则时刻不是网格"}</div>
            <Body size={FT.body} style={{ marginTop: 8 }}>
              {"停牌、周末、不同交易所的收盘时间：训练和推理都必须把真实时间戳喂给网络，而不是假装等间隔。"}
            </Body>
            <div style={{ marginTop: 12 }}><Mono size={FT.micro} color={C.inkFaint}>{"t 归一化之后，缺口仍是缺口"}</Mono></div>
          </Card>
        </Build>

        <Build at={b(16)}>
          <Card label="第四类 · 外推" accent={C.coral} pad={18} style={{ width: w, height: h }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"网络没有守恒律"}</div>
            <Body size={FT.body} style={{ marginTop: 8 }}>
              {"sin 在一个周期末应收敛到 0，训练后的积分停在 0.178；f_θ 只学过数据，没人告诉它能量该守恒。"}
            </Body>
            <div style={{ display: "flex", gap: 24, marginTop: 12, alignItems: "baseline" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"预测末值"}</Mono><Num value={0.178049359818} size={22} color={C.coral} /></div>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"精确末值"}</Mono><Num value={-2.449293598295e-16} size={22} color={C.inkDim} /></div>
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(19)} style={{ position: "absolute", left: PAD, top: 910, width: 1780 }}>
        <div style={{ height: 1, background: C.panelLine, marginBottom: 14 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Mono size={FT.meta} color={C.inkDim}>{"所以下一集：让梯度穿过整个求解器，而不是只在前向里验证。"}</Mono>
          <Mono size={FT.meta} color={C.cyan}>{"72 · backprop-through-solver →"}</Mono>
        </div>
      </Build>
    </Scene>
  );
};