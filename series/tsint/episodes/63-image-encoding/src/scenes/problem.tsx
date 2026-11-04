import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";
import { Heat, MtfTiles } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>为什么<br />要画成图。</Body>
          <Body style={{ marginTop: 26 }}>
            一个现实理由：图像模型多。卷积、池化、预训练权重，都在二维上成熟。把序列变成图，就能借这些工具。
            但借工具是有代价的——代价可能是信息，也可能是归纳偏置。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="常见说法" v="双射" color={C.amber} />
            <KV k="实际" v="只对一半" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="借工具的三笔账" accent={C.cyan} style={{ width: 1010 }}>
            <Row name="图模型成熟" value="卷积 · 池化" note="二维工具多、权重多、调参经验多" width={962} color={C.cyan} valueW={280} />
            <Row name="代价一" value="信息" note="有些画法把点与点的对应关系抹掉" width={962} color={C.coral} valueW={280} />
            <Row name="代价二" value="偏置" note="图天然假设平移不变，可序列的顺序未必如此" width={962} color={C.amber} valueW={280} />
            <Row name="常见说法" value="都是双射" note="「画成图不丢信息」——这句话只对一半" width={962} color={C.inkDim} valueW={280} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 990 }}>
            这一集把它拆成两问：格拉姆角场丢了什么，转移场丢了什么。答案不一样。
          </div>
        </div>
        <Foot>把「图像化」当成一个词，就会讲错。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第一问：<br />角场丢了什么。</Body>
          <Body style={{ marginTop: 26 }}>
            它把每个点压成一个角度，角度只由这个点在窗口里的相对位置决定。绝对水平被缩放吃掉了；
            符号也翻不回来——序列整体乘负一，图一模一样。除这两样，逐位都能还原。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="丢掉" v="绝对水平" color={C.coral} />
            <KV k="丢掉" v="整体符号" color={C.coral} />
            <KV k="保留" v="逐位形状" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 26 }}>
            <Heat m={M.gaf.gasf40} width={300} signed title="序列 x 的 GASF" />
            <Heat m={M.gaf.gasf40} width={300} signed title="序列 −x 的 GASF" />
            <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.9 }}>
              两张图逐格相同。
              <br />
              因为 φ → π − φ 时，
              <br />
              cos(φi + φj) 不变。
              <br />
              整体翻面是唯一的死角 ——
              <br />
              反解只能还原到「差一个符号」。
            </div>
          </div>
          <Card label="这一点为什么重要" accent={C.coral} style={{ marginTop: 20, width: 1010 }} pad={18}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.8 }}>
              如果一维序列代表「涨跌幅」，整体符号就是「今天是涨还是跌」的镜像。图分不出这两种世界。所以「几乎不丢」
              这句话必须带着这个尾巴说。
            </div>
          </Card>
        </div>
        <Foot>差一个整体反射，这是无损的全部边界。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第二问：<br />转移场丢了什么。</Body>
          <Body style={{ marginTop: 26 }}>
            它先把每个点换成状态，再数相邻状态对，得到转移矩阵，最后把矩阵按状态序列铺回时间轴。
            图像里每个格子是「从状态甲到状态乙的概率」。它保住了怎么转移，丢掉了每个点具体是多少。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="保住" v="转移结构" color={C.violet} />
            <KV k="丢掉" v="逐点位置" color={C.coral} />
            <KV k="性质" v="结构保持" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一段序列 · 三张图" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <MtfTiles width={950} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 990 }}>
            同一张图像，可以来自很多条序列：只要状态序列的相邻对计数一样，图就一样。这一半不叫双射，叫结构保持。
          </div>
        </div>
        <Foot>转移场记住的是「怎么跳」，不是「在哪天」。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>两问合起来，<br />就是立场。</Body>
          <Body style={{ marginTop: 26 }}>
            一维到二维，可以无损，也可以有损。无损的是格拉姆角场，差一个整体反射；有损的是转移场，只有结构。
            把两者混成一句「图像化不丢信息」，会讲错。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>角场：可逆</Chip>
            <Chip color={C.violet}>转移场：结构</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="无损的那一半" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Row name="格拉姆角场" value="双射" note="对角 + 第一行可反解；只差整体反射" width={962} color={C.cyan} valueW={280} />
            <Row name="反解误差" value={M.gaf.inverseMaxErr.toExponential(1).replace("e-", "e−")} note="逐位最大误差，门槛 1e−12" width={962} color={C.cyan} valueW={280} />
          </Card>
          <Card label="有损的那一半" accent={C.violet} style={{ marginTop: 16, width: 1010 }} pad={20}>
            <Row name="转移场" value="结构保持" note="保住状态间的转移概率，不保逐点位置" width={962} color={C.violet} valueW={280} />
            <Row name="图像行和" value={M.mtf.imgRowSum} note="8×8 矩阵是 1，128×128 图像是每箱点数" width={962} color={C.violet} valueW={280} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7 }}>
            第三件要问的是：无损值不值得。无损不等于有用 —— 这是最后一场的问题。
          </div>
        </div>
        <Foot>先分清无损与有损，再谈值不值。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
