import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, MiniTable, PAD, Pages, pagesOf, Row, Scene, SceneHead } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>三条边界，<br />先说清楚。</Body>
          <Body style={{ marginTop: 24 }}>
            这一集讲编码，不讲选股。所有数字都是在 {M.data.stocks} 只股票、{M.data.windows.toLocaleString("en-US")} 条窗口上算的 —— 换成别的池子，结论可能全变。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="能带走的，与带不走的" accent={C.amber}>
            <Row name="能带走" value="编码不丢信息" note="GASF 对角可反解，误差 1e-16" width={980} color={C.cyan} />
            <Row name="能带走" value="偏置不同" note={"同一窗口 Fisher 是 " + (M.fisher.gasf / M.fisher.mtf).toFixed(2) + " 倍"} width={980} color={C.cyan} />
            <Row name="带不走" value="预测能力" note="三条通道都在随机带" width={980} color={C.coral} />
            <Row name="带不走" value="集成红利" note="四个弱域投票还是弱" width={980} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>标签口径，<br />说清楚。</Body>
          <Body style={{ marginTop: 24 }}>
            标签是【未来二十个交易日的对数收益】的三分位：上行、震荡、下行。三分位在全体窗口上切，切完才抬头 —— 也就是说，这件事本身是一个后视镜。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>20 日</Chip>
            <Chip color={C.violet}>对数收益</Chip>
            <Chip color={C.amber}>三分位</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="标签怎么来的" accent={C.cyan}>
            <Row name="前向窗口" value={String(M.data.fwd) + " 个交易日"} note="收盘到收盘" width={980} />
            <Row name="切分" value="三分位" note="上行 / 震荡 / 下行 各约三分之一" width={980} color={C.violet} />
            <Row name="切点" value="全体窗口统一" note="不随训练测试分开" width={980} color={C.amber} />
            <Row name="训练 / 测试" value={M.data.split} note="按窗口末日切，不重叠" width={980} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>窗口重叠，<br />有效样本没那么多。</Body>
          <Body style={{ marginTop: 24 }}>
            长度 {M.data.length}，步长 {M.data.stride} —— 相邻两个窗口重叠 {(100 - (M.data.stride / M.data.length) * 100).toFixed(1)}%。训练池 {M.data.train.toLocaleString("en-US")} 条，按独立段折算只剩大约 {Math.round(M.data.train / (M.data.length / M.data.stride))} 条独立信息。这也是二分之一千这个样本量看起来大、其实不大的原因。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            {M.data.train.toLocaleString("en-US")} / {(M.data.length / M.data.stride).toFixed(1)} ≈ {Math.round(M.data.train / (M.data.length / M.data.stride))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="重叠的代价" accent={C.coral}>
            <Row name="窗口长度" value={String(M.data.length)} note="128 根日线" width={980} />
            <Row name="步长" value={String(M.data.stride)} note="每 5 根滑一格" width={980} color={C.amber} />
            <Row name="重叠" value={((1 - M.data.stride / M.data.length) * 100).toFixed(1) + "%"} note="相邻窗口共享 123 根" width={980} color={C.coral} />
            <Row name="有效样本" value={"约 " + Math.round(M.data.train / (M.data.length / M.data.stride))} note="训练池折算" width={980} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>明确不做的事。</Body>
          <Body style={{ marginTop: 24 }}>
            这一集不讲怎么赚钱，不追 SOTA 数字，不做统计显著性检验和多重比较校正，也没有调过超参、没有做集成调优。三个编码器、一个投票器，讲清楚它们的机制和边界，这就是本集的全部。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.coral}>不调参</Chip>
            <Chip color={C.amber}>不做显著性</Chip>
            <Chip color={C.inkDim}>不发布 B 站</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="本集的克制" accent={C.violet}>
            <Row name="超参" value="全程默认" note="没有搜索" width={980} />
            <Row name="对照" value="随机带 + 等权" note="不是 SOTA 对比表" width={980} color={C.cyan} />
            <Row name="显著性" value="不做" note="只说方向和量级" width={980} color={C.amber} />
            <Row name="分发" value="本地归档" note="不进 B 站，不发布" width={980} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>下一集，<br />换一个问题。</Body>
          <Body style={{ marginTop: 24 }}>
            编码讲完了，接下来讲怎么选模型：同样的数据，换一种模型搜索池，结果能差多少。这比调一个模型更值钱。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="下一集" v="自动选模型" color={C.violet} size={FT.h3} />
            <KV k="时长" v={String(M.meta.next.minutes) + " 分钟"} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="第 50 集预告" accent={C.violet}>
            <Row name="主题" value="池子比策略更重要" note={M.meta.next.id} width={980} color={C.violet} />
            <Row name="问题" value="同一套特征，换模型空间" note="结果差多少" width={980} />
            <Row name="方法" value="模型骨架搜索" note="先讲空间，再讲选择" width={980} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
