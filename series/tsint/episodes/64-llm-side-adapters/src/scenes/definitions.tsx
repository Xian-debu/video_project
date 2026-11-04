import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, fmtInt, pagesOf } from "../shared";
import { AnchorDiagram, LoraDiagram, ProbeDiagram } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第一个坐标系：<br />线性头。</Body>
          <Body style={{ marginTop: 24 }}>
            输入是主干吐出的 64 维表示，输出 20 个数。再加一列截距，所以是 65 行、20 列——
            1,300 个参数。拟合用闭式解：正规方程加岭项，一次解出来，不用迭代。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="输入" v="64 维" color={C.inkDim} />
            <KV k="输出" v="20 个" color={C.violet} />
            <KV k="参数" v={fmtInt(M.probe.params)} color={C.cyan} />
          </div>
          <Formula size={FT.body} note="岭项只罚权重，截距列单独留着" style={{ marginTop: 26 }}>
            w = (XᵀX + λI₀)⁻¹ XᵀY
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <ProbeDiagram width={1000} />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            左边是冻结主干的输出，右边是 20 个数；中间那个矩阵就是全部要学的东西。
          </div>
        </div>
        <Foot>拟合一列一次解出来，不用迭代。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第二个坐标系：<br />低秩旁路。</Body>
          <Body style={{ marginTop: 24 }}>
            底座 W0 是 64×64，冻结不动。旁边加两个小矩阵 A(4×64)、B(64×4)，
            合起来 B·A 仍是 64×64，参数 512。
          </Body>
          <Body style={{ marginTop: 16, color: C.amber }}>
            初始化：A 取很小随机数，B 全零——输出与冻结模型逐位相同。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="W0" v="64 × 64" color={C.inkDim} />
            <KV k="B" v="64 × 4" color={C.violet} />
            <KV k="A" v="4 × 64" color={C.cyan} />
            <KV k="参数" v={String(M.lora.params)} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1060 }}>
          <LoraDiagram width={1000} />
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            合并只在训练前做一次；训练完成后，旁路可以直接乘回 W0，推理不多一行。
          </div>
        </div>
        <Foot accent={C.violet}>A 小随机，B 全零 —— 起点就是原模型。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第三个坐标系：<br />语义锚点。</Body>
          <Body style={{ marginTop: 24 }}>
            词表 64 个 64 维向量，两两正交。20 个类，每类一个原型；各挑一个余弦最近的词，
            锚点就是这个下标。
          </Body>
          <Body style={{ marginTop: 16, color: C.amber }}>
            没有权重，参数是零。前缀是八个锚词加一个查询。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="词表" v="64 个 · 正交" color={C.cyan} />
            <KV k="类" v="20 个" color={C.violet} />
            <KV k="前缀" v={M.anchor.prefixLen + " token"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <AnchorDiagram width={1000} />
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            词表正交偏差 {M.anchor.orthoDev.toExponential(3).replace("e-", "e−")}；top 八与暴力排序逐位一致。
          </div>
        </div>
        <Foot accent={C.amber}>不学权重，只挑词。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三笔账，<br />和主干比一下。</Body>
          <Body style={{ marginTop: 24 }}>
            主干是 {fmtInt(M.frozen.total)} 个参数。三个适配器分别是百分之一点八五、百分之零点七三、零。
            这就是「只训练一小块」的字面意思——参数账算完了，该定口径了。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Card label="占主干的比例" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Row name="线性探测" value={fmtInt(M.probe.params)} note={"1.85% · 65 × 20；一次闭式解"} width={962} color={C.cyan} valueW={300} />
            <Row name="低秩旁路" value={String(M.lora.params)} note={"0.73% · 2 × 4 × 64；合并后推理不变"} width={962} color={C.violet} valueW={300} />
            <Row name="语义锚点" value="0" note="0% · 只改输入前缀，不改任何权重" width={962} color={C.amber} valueW={300} />
            <Row name="主干（冻结）" value={fmtInt(M.frozen.total)} note={"100% · 编码器 " + fmtInt(M.frozen.encParams) + " + 投影 " + fmtInt(M.frozen.pParams)} width={962} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot>参数账算完，该定口径。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
