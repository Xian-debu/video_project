import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Formula, Row, Body, Mono, Stat, Verdict } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 18), pageAt("definitions", 31)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Card label="定义一 · 双轴混合 MLP" accent={C.cyan} style={{ width: CW }}>
              <Formula size={58}>{"z₁ = Z + ReLU(W₁ Z) + ReLU(Z W₃)"}</Formula>
              <Formula size={52} color={C.inkDim}>{"Z_out = Z + ReLU(z₁ ⊙ G)"}</Formula>
              <div style={{ marginTop: 18 }}>
                <Row name="W₁ 时间混合" value="96 × 96 = 9,216" note="同一步在所有通道上共用，混的是时间" width={1640} />
                <Row name="W₃ 通道混合" value="8 × 8 = 64" note="同一时刻在所有时间上共用，混的是通道" width={1640} />
                <Row name="G 逐元素门" value="96 × 8 = 768" note="时间位置乘通道位置的缩放，权重共享之外再加一层" width={1640} />
                <Row name="合计" value="10,048" note="9,216 + 64 + 768，与冻结规格一致" color={C.cyan} width={1640} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
            <Body size={FT.meta} color={C.inkFaint}>输入输出都是 96 步 × 8 通道的矩阵，形状不变，所以可以堆叠。T × N 的乘积项在规格里记作 T·N。</Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="定义二 · 路由注意力" accent={C.amber} style={{ width: 1080 }}>
              <Formula size={50}>{"R = W_rᵀ H ∈ R^(c × d)"}</Formula>
              <Formula size={50}>{"A = softmax(R Hᵀ / √d)"}</Formula>
              <Formula size={48} color={C.inkDim}>{"H' = α Aᵀ V + (1 − α) H"}</Formula>
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                通道矩阵 H 先投到 c 个槽，再用槽和通道的内积算软分配，最后按分配把通道汇总成槽值、再摊回通道。α 控制改写多少，剩下保留原通道。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1440, top: 300, width: 440 }}>
            <Stat label="槽数" value={String(M.router.slots)} sub="固定 c，不随通道数长" style={{ width: 400 }} />
            <Stat label="槽维度" value={String(M.router.d)} sub={"书里是 " + M.router.dBook} accent={C.violet} style={{ width: 400, marginTop: 18 }} />
            <Stat label="参数" value={String(M.router.params)} sub={"c·d；按书的 d=32 是 " + M.router.paramsBook} accent={C.amber} style={{ width: 400, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 840, width: CW }}>
            <Row name="复杂度" value={"c·N = " + M.router.complexity + " vs N² = " + M.router.denseComplexity} note={"六十四通道、四个槽，比值 " + M.router.ratio + " 倍"} color={C.amber} width={1640} />
            <Row name="代价" value="槽是固定的表达瓶颈" note="所有通道只能通过 c 个槽交换信息" color={C.coral} width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="定义三 · 动态聚类" accent={C.violet} style={{ width: 1080 }}>
              <Formula size={52}>{"c_i = argmax_j cos(v_i, μ_j)"}</Formula>
              <Formula size={50}>{"μ_j = mean{v_i : c_i = j}"}</Formula>
              <Formula size={46} color={C.inkDim}>{"#θ = k · (H + 1) · F"}</Formula>
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                按余弦把通道分到 k 个簇，每簇一套从 H 步历史到 F 步预测的线性映射，最后一列是偏置。分配在推理窗口上现算，窗口变了簇也会变。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1440, top: 300, width: 440 }}>
            <Stat label="k = 4" value={String(M.cluster.paramsK4)} sub={"4 × 97 × " + M.cluster.F + " = 9,312"} accent={C.violet} style={{ width: 400 }} />
            <Stat label="k = 10" value={String(M.cluster.paramsK10)} sub="六十四通道分十簇的代价" style={{ width: 400, marginTop: 18 }} />
            <Stat label="路由对照" value="256" sub="比聚类的参数少三十六倍" accent={C.amber} style={{ width: 400, marginTop: 18 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 860, width: CW }}>
            <div style={{ display: "flex", gap: 18 }}>
              <Verdict ok label="三种模块全部实现" />
              <Verdict ok label="参数逐项可数" />
              <Mono size={FT.meta} color={C.inkFaint}>H={M.cluster.H} · F={M.cluster.F} · 通道数在训练时固定</Mono>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
