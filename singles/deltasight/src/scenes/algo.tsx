import React from "react";
import { useCurrentFrame } from "remotion";
import { MathLine } from "../../design/Math";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Head, PAD, PatchGrid, Pill, SIM, Scene, SyntheticBadge, beatAt, pct } from "../shared";
import { SCENES } from "../script";

/* 05 算法：Eq.(2)(3)——帧差、计数、阈值；再用合成序列把每个数摊开。 */

export const SAlgo: React.FC = () => {
  const f = useCurrentFrame();
  const id = "algo";
  const tEq = beatAt(id, 1, 11);
  const tCount = beatAt(id, 3, 11);
  const tKappa = beatAt(id, 5, 11);
  const tGrid = beatAt(id, 9, 11);
  return (
    <Scene id={id}>
      <Head kicker="04 / 公式一、二、三" title="三步判一个 patch 要不要算" goal="把「相似」写成可执行的算式" />

      <div style={{ position: "absolute", left: PAD, top: 300, width: 900 }}>
        <div style={{ opacity: pct(f, tEq, tEq + 12) }}>
          <MathLine tex={"D^{t}(x,y)=\\left\\|F^{t}(x,y)-F^{t-1}(x,y)\\right\\|_{1}"} no="(2)" size={34} active={f > tEq && f < tCount} />
          <Body size={FT.label} color={C.inkFaint} style={{ paddingLeft: 14, marginTop: -4 }}>
            逐像素相减取绝对值，再求和——曼哈顿距离。
          </Body>
        </div>

        <div style={{ opacity: pct(f, tCount, tCount + 12), marginTop: 18 }}>
          <MathLine tex={"c_i=\\sum_{(x,y)\\in I^{i}}\\mathbb{1}\\left[D_i(x,y)<\\tau\\right]"} no="(3)" size={34} active={f > tCount && f < tKappa} />
          <Body size={FT.label} color={C.inkFaint} style={{ paddingLeft: 14, marginTop: -4 }}>
            一个 patch 里，有多少像素的差小于阈值 τ。
          </Body>
        </div>

        <div style={{ opacity: pct(f, tKappa, tKappa + 12), marginTop: 18 }}>
          <MathLine tex={"s_i=\\mathbb{1}\\left[c_i\\ge\\kappa\\right]"} no="(3)" size={34} active={f > tKappa && f < tGrid} />
          <Body size={FT.label} color={C.inkFaint} style={{ paddingLeft: 14, marginTop: -4 }}>
            再拿这个计数去比 κ：够多就是相似（s_i=1），后面可以跳过。
          </Body>
        </div>

        <div style={{ marginTop: 22, opacity: pct(f, tGrid, tGrid + 14) }}>
          <Card label="把三步跑在合成序列上" accent={C.cyan}>
            <Body size={FT.label} color={C.inkDim}>
              6×8 个 patch，每个 16×16；格子里是 Eq.(3) 算出的计数 c_i。τ = {SIM.meta.tau_px}（强度级差），κ = {SIM.meta.kappa_count} 个像素。
            </Body>
          </Card>
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD + 940, top: 292, opacity: pct(f, tGrid, tGrid + 16) }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, letterSpacing: 2, marginBottom: 10 }}>
          c_i ≥ κ ? · {SIM.meta.grid_h}×{SIM.meta.grid_w} PATCHES
        </div>
        <PatchGrid cell={86} at={tGrid + 6} stagger={2} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Pill text={"相似 " + SIM.totals.similar_patches + " / 48"} color={C.inkFaint} bg="transparent" />
          <Pill text={"跳过率 " + (SIM.totals.skip_rate * 100).toFixed(1) + "%"} color={C.cyan} />
          <Pill text={"平均 " + SIM.totals.avg_bits.toFixed(2) + " bit"} color={C.amber} bg="rgba(251,191,36,0.10)" />
        </div>
      </div>

      <SyntheticBadge at={tGrid} />
    </Scene>
  );
};
