import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, KV, M, MiniTable, PAD, Pages, pagesOf, Row, Scene, SceneHead, Verdict, fmt2, fmt4 } from "../shared";
import { AugAccFig, LossFig, ProbeCompareFig, ThreeUpFig } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>配方只有<br />一个变量：监督信号。</Body>
          <Body style={{ marginTop: 28 }}>两套预训练除了目标函数完全一样：Adam、十二轮（对比）与十轮（掩码）、全批量、种子 7。下游探针也不变：三百轮、lr 0.01、三十条训练、二十条测试。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <KV k="对比轮数" v={M.contrast.epochs} color={C.violet} size={FT.h3} />
            <KV k="掩码轮数" v={M.mask.epochs} color={C.amber} size={FT.h3} />
            <KV k="测试" v={M.data.testProbe} color={C.cyan} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="两套预训练的超参" accent={C.cyan}>
            <MiniTable head={["项目", "对比", "掩码"]} colW={[300, 330, 330]} width={960}
              rows={[
                ["监督信号", "InfoNCE", "15% + 10% 重构"],
                ["轮数 / 批大小", M.contrast.epochs + " / " + M.contrast.batch, M.mask.epochs + " / " + M.mask.batch],
                ["学习率 / 种子", M.contrast.lr + " / 7", M.mask.lr + " / 7"],
                ["编码器维度", M.contrast.dim + " / " + M.contrast.dim + " / " + M.contrast.dim, M.mask.dim + " / " + M.mask.dim + " / " + M.mask.dim],
                ["参数", String(M.contrast.params), String(M.mask.params)],
              ]} />
            <div style={{ marginTop: 16, fontSize: FT.meta, color: C.inkFaint }}>唯一的区别就是监督信号本身——这样比出来的差距才归因清楚。</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>对比损失<br />掉到三分之一。</Body>
          <Body style={{ marginTop: 24 }}>从 {fmt4(M.contrast.lossStart)} 降到 {fmt4(M.contrast.lossEnd)}，用了十二轮。最后编码器在二十条测试上拿到 {fmt2(M.contrast.probeAcc)}（{M.contrast.correct} 条对），比未训练的 {fmt2(M.control.untrainedProbe)} 高出 {fmt2((M.contrast.probeAcc - M.control.untrainedProbe) * 100)} 个百分点。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="损失终值" value={fmt4(M.contrast.lossEnd)} note={"τ = " + M.contrast.tau + " · 黄金值 " + fmt4(M.contrast.infoNce)} width={620} color={C.violet} />
            <Row name="探针" value={fmt2(M.contrast.probeAcc)} note={M.contrast.correct + "/" + M.data.testProbe + " · 基线 " + fmt2(M.data.baseline)} width={620} color={C.cyan} />
            <Row name="耗时" value={M.contrast.seconds.toFixed(1) + " s"} note="一次跑完" width={620} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="两条损失：对比（线性）与掩码（对数）" accent={C.violet}>
            <LossFig width={980} />
            <div style={{ marginTop: 18 }}>
              <Row name="对比" value={fmt4(M.contrast.lossStart) + " → " + fmt4(M.contrast.lossEnd)} note="12 轮" width={980} color={C.violet} />
              <Row name="掩码" value={fmt4(M.mask.lossStart) + " → " + fmt4(M.mask.lossEnd)} note="10 轮 · 纵轴对数" width={980} color={C.amber} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: 'absolute', left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>掩码也能学，<br />但学得少一点。</Body>
          <Body style={{ marginTop: 24 }}>重构损失从 {fmt4(M.mask.lossStart)} 压到 {fmt4(M.mask.lossEnd)}，掩码位的平方误差已经很小；可探针只到 {fmt2(M.mask.probeAcc)}，刚过基线 {fmt2(M.data.baseline)}。补得准和学得有用，是两件事。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="重构损失" value={fmt4(M.mask.lossEnd)} note="15% + 10% 掩码位" width={620} color={C.amber} />
            <Row name="探针" value={fmt2(M.mask.probeAcc)} note={M.mask.correct + "/" + M.data.testProbe} width={620} color={C.cyan} />
            <Row name="参数" value={M.mask.params} note="掩码网，含 120 维输入" width={620} />
          </div>
          <div style={{ marginTop: 18 }}><Verdict ok={M.mask.probeAcc >= M.data.baseline} label={"比基线高 " + fmt2((M.mask.probeAcc - M.data.baseline) * 100) + " 个点：刚好一条"} /></div>
        </div>
        <div style={{ position: 'absolute', left: 780, top: 300, width: 1040 }}>
          <Card label="同尺子上的四个编码器" accent={C.cyan}>
            <ProbeCompareFig width={980} />
            <div style={{ marginTop: 16, fontSize: FT.meta, color: C.inkFaint }}>未训练的 3008 个参数也在图上：它拿 {fmt2(M.control.untrainedProbe)}——预训练值 {fmt2((M.contrast.probeAcc - M.control.untrainedProbe) * 100)} 个点。</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>增强的强度，<br />一走神就过头。</Body>
          <Body style={{ marginTop: 24 }}>同一套对比编码器，换不同增强做第二次预训练：抖动、缩放、翻转都保持 {fmt2(M.contrast.probeAcc)}；时间弯曲到 {M.augment.warpPct} 个百分点，探针掉到 {fmt2(M.probeTable.find((p) => p.aug === "warp")!.acc)}，比基线还低。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="无损组" value={fmt2(0.45)} note="抖动 / 缩放 / 翻转" width={620} color={C.cyan} />
            <Row name="弯曲" value={fmt2(0.2)} note="20 个百分点 · 单点" width={620} color={C.coral} />
            <Row name="基线" value={fmt2(M.data.baseline)} note="多数类" width={620} />
          </div>
          <div style={{ marginTop: 18 }}><Verdict ok={false} label="时间弯曲是把时间轴拧弯，形态被改了" /></div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="五种增强条件下的探针准确率" accent={C.violet}>
            <AugAccFig width={960} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>三张成绩单，<br />放在一起看。</Body>
          <Body style={{ marginTop: 28 }}>对比 {fmt2(M.contrast.probeAcc)}、掩码 {fmt2(M.mask.probeAcc)}、未训练 {fmt2(M.control.untrainedProbe)}；随机基线 {fmt2(M.data.baseline)}。两个学到东西，一个没有——但测试只有二十条，每一格五个点，差距要小心读。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <KV k="最高" v={fmt2(M.contrast.probeAcc)} color={C.violet} size={FT.h3} />
            <KV k="最低" v={fmt2(M.control.untrainedProbe)} color={C.inkFaint} size={FT.h3} />
            <KV k="一格" v="5 个点" color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 310, width: 1040 }}>
          <ThreeUpFig width={980} />
          <div style={{ marginTop: 20 }}>
            <Row name="对比 − 掩码" value={fmt2((M.contrast.probeAcc - M.mask.probeAcc) * 100) + " 个点"} note="两格" width={980} />
            <Row name="标签错位" value={fmt2(M.control.shuffledProbe)} note="编码器不变，标签打乱后掉下来" width={980} color={C.coral} />
            <Row name="置换等变误差" value={"0"} note="对比模块的数值不变量" width={980} color={C.cyan} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
