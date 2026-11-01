import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Heat, SigBars, K, Verdict } from "../shared";

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 11), pageAt("intuition", 23)];
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：干净窗 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288 }}>
            <Heat matrix={M.heat.pixClean} labels={[]} cell={15} gap={2} labelW={0} min={0} max={1} />
            <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.label, color: C.cyan }}>干净窗 · 100 × 100 注意力</div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 288, width: 1010 }}>
            <Card label="一条斜带" accent={C.cyan}>
              <Row name="权重落在哪" value="对角线附近" note="近的点最像，先验也这么认为" width={960} />
              <Row name="带内质量" value={M.heat.bandShareClean.toFixed(3)} note="±5 格以内占多少" width={960} />
              <Row name="带外质量" value={M.heat.outMassClean.toFixed(3)} note="远处仍然有权重，但稀" width={960} />
              <Row name="行熵" value={M.heat.entClean.toFixed(3)} note="每行都摊开，不是针" width={960} />
            </Card>
            <Body style={{ marginTop: 18, width: 980 }}>
              正常窗口的注意力像一条斜带：每个点主要看自己附近。先验 P 画的也是这条带，所以两者的对称 KL 很小。
            </Body>
            <SigBars w={980} h={230} at={8} />
          </div>
        </AbsoluteFill>

        {/* 页二：尖峰窗 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288 }}>
            <Heat matrix={M.heat.pixSpike} labels={[]} cell={15} gap={2} labelW={0} min={0} max={1} />
            <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.label, color: C.coral }}>尖峰窗 · 第 {M.heat.spikeRow} 行被注入</div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 288, width: 1010 }}>
            <Card label="一根针" accent={C.coral}>
              <Row name="坍缩的那一行" value={"第 " + M.heat.spikeRow + " 行"} note="5 到 10 个 σ 的尖峰，只跟自己最像" width={960} />
              <Row name="行熵" value={M.heat.entSpike.toFixed(3)} note="整行压成一个点，熵归零" width={960} color={C.coral} />
              <Row name="带外质量" value={M.heat.outMassSpike.toFixed(3)} note="远处的权重被抢光" width={960} />
              <Row name="带内质量" value={M.heat.bandShareSpike.toFixed(3)} note="连邻居都吸不动它" width={960} />
            </Card>
            <Body style={{ marginTop: 18, width: 980 }}>
              先验那一行还是平滑的，注意力那一行成了针 —— 两个分布差得很远，这一行的对称 KL 就被顶起来。一条尖峰只污染一行，但点级打分取覆盖它的窗的最大值，这一个点就够报警。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：形状窗 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288 }}>
            <Heat matrix={M.heat.pixShape} labels={[]} cell={15} gap={2} labelW={0} min={0} max={1} />
            <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.label, color: C.violet }}>形状窗 · 第 {M.heat.shapeRow} 行附近整段替换</div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 288, width: 1010 }}>
            <Card label="一片糊" accent={C.violet}>
              <Row name="不是坍缩" value="是分散" note="注意力从带子里漏出来" width={960} />
              <Row name="行熵" value={M.heat.entShape.toFixed(3)} note={"比干净的 " + M.heat.entClean.toFixed(3) + " 还高"} width={960} color={C.violet} />
              <Row name="带外质量" value={M.heat.outMassShape.toFixed(3)} note={"干净窗只有 " + M.heat.outMassClean.toFixed(3)} width={960} />
              <Row name="带内质量" value={M.heat.bandShareShape.toFixed(3)} note="和干净窗几乎一样，抓不住" width={960} />
            </Card>
            <Verdict ok={false} label="只看带内质量，形状替换会被放过" />
            <Body style={{ marginTop: 14, width: 980 }}>
              这是这一集最反直觉的一条：形状替换不改变「带内有多少权重」，它改变「带外的权重涨了多少」。所以检查里我盯的是带外质量和行熵，不是带内质量。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
