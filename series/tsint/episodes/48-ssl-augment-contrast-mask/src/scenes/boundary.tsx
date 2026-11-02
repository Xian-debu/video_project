import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Head, Card, Chip, KV, M, PAD, Pages, pagesOf, Row, Scene, SceneHead, Verdict, fmt2 } from "../shared";
import { Grid20Fig, OverlapFig } from "../figs";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <Head kicker="这一集之外" title="一千条不是一千条独立样本" goal="重叠 · 欠训练 · 小测试集" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>窗口重着<br />四十天。</Body>
          <Body style={{ marginTop: 28 }}>步长 {M.data.stride} 天，窗口 {M.data.length} 天，相邻两条样本共享 {M.data.length - M.data.stride} 天。一千条窗口其实只有三分之一是新的——有效样本量比看上去小得多。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <KV k="重叠" v={M.data.length - M.data.stride + " 天"} color={C.coral} size={FT.h3} />
            <KV k="有效" v="≈ 1/3" color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="同一只股票：四条相邻样本" accent={C.coral}>
            <OverlapFig width={980} />
            <div style={{ marginTop: 8, fontSize: FT.meta, color: C.inkFaint }}>所以预训练池看起来很大，实际独立信息少——这也是为什么只敢说「学到点东西」，不敢说「学得很好」。</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="这一集之外" title="一千条不是一千条独立样本" goal="重叠 · 欠训练 · 小测试集" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>十二轮、十轮，<br />都没收敛。</Body>
          <Body style={{ marginTop: 24 }}>对比十二轮、掩码十轮，是为了在一集里跑完三种对照。损失还在往下走，训练是欠的：再给十倍轮数，两个探针大概率都会更高——但那时比的就不是「方法」而是「预算」了。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="对比" value={M.contrast.epochs + " 轮"} note="损失仍未平" width={620} color={C.violet} />
            <Row name="掩码" value={M.mask.epochs + " 轮"} note="同理" width={620} color={C.amber} />
            <Row name="总耗时" value={(M.contrast.seconds + M.mask.seconds).toFixed(1) + " s"} note="两条管线" width={620} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="欠训练的两条证据" accent={C.amber}>
            <Row name="对比损失" value={String(M.contrast.lossStart) + " → " + String(M.contrast.lossEnd)} note="终点仍是正的" width={960} />
            <Row name="掩码损失" value={String(M.mask.lossStart) + " → " + String(M.mask.lossEnd)} note="同样未到 0" width={960} />
            <Row name="探针轮数" value="500" note="探针倒是训到收敛" width={960} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18 }}><Verdict ok={false} label="所以结论只在这十二轮里成立" /></div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="这一集之外" title="一千条不是一千条独立样本" goal="重叠 · 欠训练 · 小测试集" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>二十条测试，<br />一格五个点。</Body>
          <Body style={{ marginTop: 28 }}>对比 {fmt2(M.contrast.probeAcc)}、掩码 {fmt2(M.mask.probeAcc)}，差两个点六个点；可一格就是五个点。这点差距没有置信区间可言，只能当方向看。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>对比 {M.contrast.correct}/{M.data.testProbe}</Chip>
            <Chip color={C.amber}>掩码 {M.mask.correct}/{M.data.testProbe}</Chip>
            <Chip color={C.coral}>一格 5.0 个点</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 320, width: 1040 }}>
          <Card label="二十格：一格一条测试" accent={C.violet}>
            <Grid20Fig width={980} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="这一集之外" title="一千条不是一千条独立样本" goal="重叠 · 欠训练 · 小测试集" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>弯曲只试了<br />一个强度。</Body>
          <Body style={{ marginTop: 24 }}>“{M.augment.warpPct} 个百分点”这一个点就掉到了 {fmt2(M.probeTable.find((p) => p.aug === "warp")!.acc)}，但强度扫描没做：也许 5% 是好的、10% 刚好、20% 才过界。这一集只报告一个点，不给曲线。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="已试" value="20 个百分点" note="一个点" width={620} color={C.coral} />
            <Row name="未试" value="5 / 10 / 15" note="应该扫一遍" width={620} />
            <Row name="其它增强" value="各一个强度" note="同样没扫" width={620} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 320, width: 1020 }}>
          <Card label="这一集只做了最小实现" accent={C.coral}>
            <Row name="数据" value="300 只股票 · 一个快照" note="没有全市场" width={960} />
            <Row name="预训练" value="1000 条窗口" note="不是全量" width={960} />
            <Row name="编码器" value="两层 · 3008 / 5852 参数" note="不是 ResNet / Transformer" width={960} />
            <Row name="下游" value="一个三分类" note="没扫分类头" width={960} />
            <div style={{ marginTop: 14, fontSize: FT.meta, color: C.inkFaint }}>它的价值是把「没有标签怎么学」的三种机制写成能跑的代码、能对账的数字，而不是刷榜。</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="这一集之外" title="一千条不是一千条独立样本" goal="重叠 · 欠训练 · 小测试集" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>明确<br />不做的事。</Body>
          <Body style={{ marginTop: 28 }}>没有大模型、没有大数据、没有超参搜索，也没有跨数据集验证。四件事都不做，是因为它们会把这一集的「机制」讲成「调参」。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.coral}>不做大模型</Chip>
            <Chip color={C.coral}>不做调参</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="明确不做的事" accent={C.coral}>
            <Row name="大模型" value="不做" note="两层编码器足够讲机制" width={960} />
            <Row name="全量数据" value="不做" note="1000 条窗口" width={960} />
            <Row name="超参搜索" value="不做" note="一套配方跑到底" width={960} />
            <Row name="跨数据集" value="不做" note="只讲 A 股窗口" width={960} />
            <div style={{ marginTop: 14, fontSize: FT.meta, color: C.inkFaint }}>下一集会把这些机制用到图结构上——那时才需要更复杂的模型。</div>
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
