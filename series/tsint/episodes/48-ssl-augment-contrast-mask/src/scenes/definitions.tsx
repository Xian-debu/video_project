import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, KV, M, MiniTable, PAD, Pages, pagesOf, Row, Scene, SceneHead, fmt2, fmt4 } from "../shared";
import { AugQuadFig, EncoderFig, MaskInputFig, MaskStripFig, ParamFig, SimFig, TauFig } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>四种扰动，<br />一个强度参数。</Body>
          <Body style={{ marginTop: 24 }}>抖动加点噪声、缩放整体乘个系数、翻转把曲线倒过来、时间弯曲把数轴拉扯一下。强度都用相对量写：抖动 σ = {M.augment.jitterSigma}，缩放 σγ = {M.augment.scalingSigma}，弯曲 {M.augment.warpPct} 个百分点。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="抖动" value={"σ = " + M.augment.jitterSigma} note="相对标准差" width={620} />
            <Row name="缩放" value={"σγ = " + M.augment.scalingSigma} note="对数正态" width={620} />
            <Row name="弯曲" value={M.augment.warpPct + " 个百分点"} note="20 = 0.2" width={620} color={C.amber} />
            <Row name="混合" value={"Beta(" + M.augment.mixupLambda + ", " + M.augment.mixupLambda + ")"} note="Mixup 系数" width={620} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 290, width: 1020 }}>
          <Card label="同一条窗口，四种扰动" accent={C.cyan}>
            <AugQuadFig width={960} />
            <div style={{ marginTop: 14, fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>灰线 = 原窗口 · 彩线 = 扰动后 · 纵轴单位是对数收益</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>InfoNCE：<br />一次四选一。</Body>
          <Body style={{ marginTop: 24 }}>把同一条窗口的两次增强当一个正例，把别的三条当负例；相似度除以温度 τ 再 softmax。正例拿到的权重越大，损失越小。均匀分布时是 ln 3 = {fmt4(M.contrast.uniform)}，本集的黄金值是 {fmt4(M.contrast.infoNce)}。</Body>
          <div style={{ marginTop: 20 }}><Formula size={44}>−log{"  "}w⁺ · w = softmax(s / τ)</Formula></div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <Card label="锚点与四个候选：相似度 → 权重 → 损失" accent={C.violet}>
            <SimFig width={960} />
            <div style={{ marginTop: 14 }}>
              <TauFig width={960} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>编码器：<br />两层，3008 个参数。</Body>
          <Body style={{ marginTop: 24 }}>六十维输入压到三十二维，再过一层还是三十二维，最后得到 32 维的 z。参数是 (60×32+32) + (32×32+32) = {M.contrast.params}。这层网络一次都没见过标签。</Body>
          <div style={{ marginTop: 22 }}>
            <KV k="输入" v={M.data.length + " 维"} color={C.cyan} size={FT.h3} />
            <KV k="隐层" v={M.contrast.dim + " 维"} color={C.violet} size={FT.h3} />
            <KV k="参数" v={M.contrast.params} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 320, width: 1040 }}>
          <Card label="编码器结构" accent={C.violet}>
            <EncoderFig width={980} />
            <div style={{ marginTop: 22 }}>
              <Row name="层数" value="2 层线性 + tanh" note="最后一层不加激活" width={980} />
              <Row name="输出" value={M.contrast.dim + " 维"} note="探针的输入" width={980} color={C.violet} />
              <Row name="参数核对" value={M.contrast.params} note="1952 + 1056" width={980} color={C.cyan} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>掩码：<br />挖掉再补。</Body>
          <Body style={{ marginTop: 24 }}>两种挖法合起来：每个点以 15% 的概率被随机挖掉，再挖掉一段连续的 10%（六个点）。挖掉的位置填 0，另外给一路 0/1 标记告诉网络哪里少了东西。</Body>
          <div style={{ marginTop: 20 }}>
            <Row name="随机点" value={M.augment.maskFrac} note="逐点独立" width={620} />
            <Row name="连续块" value={M.augment.blockFrac} note={"块长 " + M.augment.blockLen + " 天"} width={620} color={C.violet} />
            <Row name="平均掩码率" value={fmt4(M.augment.meanMaskRate)} note="实测" width={620} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="一条窗口上的两路掩码" accent={C.amber}>
            <MaskStripFig width={980} />
            <div style={{ marginTop: 26 }}>
              <MaskInputFig width={980} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>重构损失<br />只算被挖掉的地方。</Body>
          <Body style={{ marginTop: 24 }}>把 120 维（60 值 + 60 标记）送进编码器，再预测 60 个值；损失只在掩码位上算平方误差。四个数的黄金例：输入 [1,2,3,4]、遮第三位、预测全 0，损失等于 {fmt2(M.mask.reconGolden)}。</Body>
          <div style={{ marginTop: 20 }}><Formula size={44}>L = (1/|M|) Σ_{"{i∈M}"} (x̂ᵢ − xᵢ)²</Formula></div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="掩码网络的参数" accent={C.amber}>
            <ParamFig width={980} />
            <div style={{ marginTop: 12 }}>
              <Row name="黄金值" value={fmt2(M.mask.reconGolden)} note="[1,2,3,4] 遮第三位，预测全 0" width={980} color={C.amber} />
              <Row name="完美重构" value="0" note="掩码位全对" width={980} />
              <Row name="空掩码" value="报错" note="损失无定义" width={980} color={C.coral} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>线性探针：<br />冻住编码器，只训一层。</Body>
          <Body style={{ marginTop: 24 }}>预训练完之后，编码器参数冻住，只加一个 32 分类 3 的线性层，用三十条标签训到收敛，在剩下二十条上打分。线性层能学好，说明特征本身可分；学不好，说明特征里没有行业信息。</Body>
          <div style={{ marginTop: 22 }}>
            <KV k="训练" v={M.data.trainProbe} color={C.cyan} size={FT.h3} />
            <KV k="测试" v={M.data.testProbe} color={C.violet} size={FT.h3} />
            <KV k="基线" v={fmt2(M.data.baseline)} color={C.coral} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="探针：同一把尺子量三个编码器" accent={C.cyan}>
            <MiniTable head={["编码器", "预训练目标", "参数", "探针"]} colW={[200, 400, 160, 160]} width={960}
              rows={[
                ["对比", "InfoNCE，τ = " + M.contrast.tau, String(M.contrast.params), fmt2(M.contrast.probeAcc)],
                ["掩码", "15% + 10% 重构", String(M.mask.params), fmt2(M.mask.probeAcc)],
                ["未训练", "无", String(M.contrast.params), fmt2(M.control.untrainedProbe)],
              ]} />
            <div style={{ marginTop: 18 }}>
              <Row name="探针 lr" value="0.01" note="全批量 Adam" width={960} />
              <Row name="训练轮数" value="300" note="线性层收敛" width={960} />
              <Row name="对照" value={"标签错位 " + fmt2(M.control.shuffledProbe) + " / permEquivErr 0"} note="后者是模块不变量" width={960} color={C.coral} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
