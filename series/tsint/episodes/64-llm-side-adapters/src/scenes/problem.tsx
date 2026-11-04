import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmtInt, pagesOf } from "../shared";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>微调太贵，<br />换一条路。</Body>
          <Body style={{ marginTop: 26 }}>
            微调要改全部参数，70,209 个一个不落。代价是三件事：显存、时间、数据。
            更麻烦的是，改完之后原模型就没了——想留一份干净的底座，做不到。
          </Body>
          <div style={{ display: "flex", marginTop: 30 }}>
            <KV k="全量微调" v="70,209" color={C.inkDim} />
            <KV k="本集做法" v="冻结 + 适配" color={C.cyan} />
            <KV k="改动参数" v="≤ 1.85%" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="全量微调 · 三笔代价" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="显存" value="全部梯度" note="70,209 个参数的梯度与优化器状态都要留着" width={962} color={C.inkDim} valueW={300} />
            <Row name="时间" value="每步全反传" note="训练慢，试错成本高；一轮就要重来" width={962} color={C.inkDim} valueW={300} />
            <Row name="数据" value="整库重训" note="数据一换，旧模型只能作废" width={962} color={C.inkDim} valueW={300} />
            <Row name="更麻烦" value="底座没了" note="改完只剩新模型，干净的底座留不下" width={962} color={C.coral} valueW={300} />
          </Card>
        </div>
        <Foot>所以工程上换做法：冻结主干，只训练一小块。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三种做法，<br />三种「小」。</Body>
          <Body style={{ marginTop: 26 }}>
            第一种线性探测，主干冻结，只加一个线性头；第二种低秩旁路，在权重旁边加一对小矩阵；
            第三种语义锚点，一个权重都不学，只从词表里挑词拼前缀。
          </Body>
          <div style={{ display: "flex", marginTop: 30 }}>
            <KV k="线性探测" v="加一个头" color={C.cyan} />
            <KV k="低秩旁路" v="加一对矩阵" color={C.violet} />
            <KV k="语义锚点" v="加一段前缀" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三种做法 · 参数都在这一行" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <Row name="线性探测" value={fmtInt(M.probe.params)} note="输入 64 维表示，输出 20 个数；65 × 20" width={962} color={C.cyan} valueW={300} />
            <Row name="低秩旁路" value={String(M.lora.params)} note={"B 是 64×4，A 是 4×64，合起来 B·A 仍是 64×64"} width={962} color={C.violet} valueW={300} />
            <Row name="语义锚点" value="0" note="从 64 词词表挑八个锚词，加一个查询拼成前缀" width={962} color={C.amber} valueW={300} />
            <Row name="共同点" value="主干不动" note="三个适配器都不改 W0；底座始终是干净的" width={962} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.violet}>三种做法，三种「小」。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>两笔账，<br />要分开算。</Body>
          <Body style={{ marginTop: 26 }}>
            「小」不是目的。目的是用很小的代价，换到效果。所以有两笔账：一笔参数账，加减乘除；
            一笔效果账，要定目标、切数据、选口径。这一集两笔都算。
          </Body>
          <div style={{ display: "flex", marginTop: 30 }}>
            <KV k="参数账" v="可手算" color={C.cyan} />
            <KV k="效果账" v="要口径" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="两笔账" accent={C.amber} style={{ width: 1010 }} pad={20}>
            <Row name="参数账" value="一眼算清" note="1,300 / 512 / 0；和 70,209 比，就是三个百分比" width={962} color={C.cyan} valueW={300} />
            <Row name="效果账" value="先钉口径" note="目标、切分、基线，一个都不能含糊，否则数没意义" width={962} color={C.amber} valueW={300} />
            <Row name="这一集" value="都算一遍" note="参数账赢在便宜，效果账三笔都输" width={962} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.amber}>参数账好算，效果账不好算。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>参数账<br />怎么来的。</Body>
          <Body style={{ marginTop: 24 }}>
            得先把三个坐标系摆出来：线性头是从 64 维到 20 维的一个矩阵；旁路是两个小矩阵的乘积；
            锚点是一串词表下标。摆清楚，参数就自己长出来了。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三个坐标系的形状" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Row name="线性头" value="65 × 20" note={"64 维输入 + 一列截距 → 20 维输出；" + fmtInt(M.probe.params) + " 个参数"} width={962} color={C.cyan} valueW={300} />
            <Row name="低秩旁路" value="2 × 4 × 64" note={"B(64×4) 与 A(4×64)，合并后仍是 64×64；" + M.lora.params + " 个参数"} width={962} color={C.violet} valueW={300} />
            <Row name="语义锚点" value="0" note="不是训练出来的数，是从词表里查出来的下标" width={962} color={C.amber} valueW={300} />
            <Row name="下一场" value="逐个摆开" note="线性头用闭式解，旁路看初始化，锚点看正交" width={962} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot>下一场看参数账。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
