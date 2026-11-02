import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Head, Card, Chip, Formula, KV, M, MiniTable, PAD, Pages, pagesOf, Row, Scene, SceneHead, Verdict, fmt2, fmt4 } from "../shared";
import { AugAccFig, ProbeCompareFig, ThreeUpFig } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <Head kicker="标签太贵" title="四十八个标签，撑不起一次预训练" goal="贵 · 少 · 有偏" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>标一条，<br />要一个人盯一天。</Body>
          <Body style={{ marginTop: 28 }}>行情不要钱，标签要钱。一条序列标成「电子」还是「银行」，得有人对着财报看。五十条已经是这一集能给的最大方——而随便一个监督模型都要几千条才够。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <KV k="无标签" v={M.data.windows} color={C.cyan} size={FT.h3} />
            <KV k="有标签" v={M.data.probe} color={C.coral} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 320, width: 1020 }}>
          <Card label="比例：一条标签对上二十条无标签" accent={C.coral}>
            <Row name="预训练池" value={M.data.windows + " 条"} note="没有标签" width={940} />
            <Row name="下游探针" value={M.data.probe + " 条"} note="行业三分类" width={940} color={C.cyan} />
            <Row name="比例" value={M.data.windows / M.data.probe + " : 1"} note="标签稀缺的真实写照" width={940} color={C.coral} />
            <Row name="测试集" value={M.data.testProbe + " 条"} note="只用来打分" width={940} />
          </Card>
          <div style={{ marginTop: 20, fontSize: FT.meta, color: C.inkFaint }}>五十条里三十条训练、二十条测试——每一条都很贵，所以每一格都要珍惜。</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="标签太贵" title="四十八个标签，撑不起一次预训练" goal="贵 · 少 · 有偏" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>自监督：<br />自己给自己出题。</Body>
          <Body style={{ marginTop: 24 }}>没有标签，就从数据本身挖监督信号：把一条曲线扰动一下，要网络认出「这还是同一条」；挖掉一段，要它补回来。答案不在文件里，在数据自身。</Body>
          <div style={{ marginTop: 22 }}><Formula size={46}>L = −log{"  "}exp(s⁺/τ) / Σ exp(s/τ)</Formula></div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="三种信号，三种毛病" accent={C.violet}>
            <MiniTable head={["方法", "监督信号从哪来", "毛病"]} colW={[160, 430, 370]} width={960}
              rows={[
                ["增强", "扰动同一条曲线的形状", "扰动太猛，语义就变了"],
                ["对比", "同源靠近、异源推远", "负例怎么采，决定学成什么"],
                ["掩码", "被挖掉的那一段", "重构得越好，不代表特征越有用"],
              ]} />
            <div style={{ marginTop: 16, fontSize: FT.meta, color: C.inkFaint }}>三种方法都不是万能药——所以这一集把三种都跑一遍，用同一把尺子量。</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="标签太贵" title="四十八个标签，撑不起一次预训练" goal="贵 · 少 · 有偏" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>一把尺子：<br />二十条测试。</Body>
          <Body style={{ marginTop: 28 }}>不管预训练怎么花，最后都冻住编码器，只用三十条标签训一个线性分类器，在剩下二十条上打分。二十条里对一条，就是五个百分点——尺子粗，所以结论要保守。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <KV k="训练" v={M.data.trainProbe} color={C.cyan} size={FT.h3} />
            <KV k="测试" v={M.data.testProbe} color={C.violet} size={FT.h3} />
            <KV k="基线" v={fmt2(M.data.baseline)} color={C.coral} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 320, width: 1020 }}>
          <ThreeUpFig width={960} />
          <div style={{ marginTop: 22, fontSize: FT.meta, color: C.inkFaint }}>三个数字是这一集的答案：对比 {fmt2(M.contrast.probeAcc)}、掩码 {fmt2(M.mask.probeAcc)}、未训练 {fmt2(M.control.untrainedProbe)}。</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="标签太贵" title="四十八个标签，撑不起一次预训练" goal="贵 · 少 · 有偏" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>三种答案，<br />先记住数。</Body>
          <Body style={{ marginTop: 24 }}>对比学习把探针从 {fmt2(M.control.untrainedProbe)} 抬到 {fmt2(M.contrast.probeAcc)}；掩码只抬到 {fmt2(M.mask.probeAcc)}；而时间弯曲这一类增强反而把成绩拉到 {fmt2(M.probeTable.find((p) => p.aug === "warp")!.acc)}——比基线还低。</Body>
          <div style={{ marginTop: 22 }}>
            <Verdict ok label={"对比 +" + fmt2((M.contrast.probeAcc - M.control.untrainedProbe) * 100) + " 个点"} />
            <Verdict ok={M.mask.probeAcc >= M.data.baseline} label={"掩码 " + fmt2(M.mask.probeAcc) + " · 刚过基线"} />
            <Verdict ok={false} label={"时间弯曲 " + fmt2(M.probeTable.find((p) => p.aug === "warp")!.acc)} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 310, width: 1020 }}>
          <AugAccFig width={960} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="标签太贵" title="四十八个标签，撑不起一次预训练" goal="贵 · 少 · 有偏" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>三个问题，<br />这一集要回答。</Body>
          <Body style={{ marginTop: 28 }}>第一，增强到什么程度还算同一条？第二，对比学习真比掩码强吗，还是只是这一次？第三，成绩提高是编码器的功劳，还是探针自己在背题？</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>增强强度</Chip>
            <Chip color={C.violet}>对比 vs 掩码</Chip>
            <Chip color={C.amber}>对照</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="三个问题的候选答案都写在证据里" accent={C.cyan}>
            <MiniTable head={["问题", "这一集的答案", "证据"]} colW={[240, 380, 300]} width={960}
              rows={[
                ["增强强度", "±20% 的时间弯曲已经越界", "warp 探针 " + fmt2(0.2)],
                ["对比 vs 掩码", "对比高 " + fmt2(M.contrast.probeAcc - M.mask.probeAcc), "同一把探针尺子"],
                ["是不是背题", "未训练编码器只有 " + fmt2(M.control.untrainedProbe), "标签错位 " + fmt2(M.control.shuffledProbe)],
              ]} />
            <div style={{ marginTop: 16 }}>
              <ProbeCompareFig width={960} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
