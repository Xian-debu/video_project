import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { ReconCompare } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>指标一：<br />重建误差。</Body>
          <Body style={{ marginTop: 26 }}>
            就是掩码位置的均方误差。窗口已标准化，方差为一，所以「全预测零」的误差接近一。训练后验证误差零点二四。
            这是绝对尺度，还要一个相对尺度，才能和「什么都不做」比。下一屏定义相对误差，它是本集最重要的指标。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="验证 MSE" v="0.2407" color={C.cyan} />
            <KV k="全零基线" v="≈ 1.0" color={C.inkFaint} />
            <KV k="掩码" v="154" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一个窗口：灰为真实，青为重建，底色为掩码区" accent={C.cyan}>
            <ReconCompare />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            标准化后，预测零的均方误差约等于 1：这就是「不学」的尺度。
          </div>
        </div>
        <Foot>先有绝对误差，才有相对误差。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>预测目标是<br />未来二十天。</Body>
          <Body style={{ marginTop: 26 }}>
            具体是相对窗口最后一点的变化，再除以窗口的标准差。为什么要除？让不同波动期的目标可比。
            基线叫 persistence，意思是「未来等于现在」。在这个目标下，基线就是零，所以基线的绝对误差可以直接算。相对误差等于模型误差除以基线误差。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="地平线" v="20 天" color={C.cyan} />
            <KV k="目标" v="Δ / σ" color={C.amber} />
            <KV k="基线" v="0" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="相对误差的定义" accent={C.amber}>
            <Formula size={50} note="y 是未来 20 天相对最后一点的变化，除以窗口标准差；persistence 预测 0">
              rel = MAE(ŷ, y) / MAE(0, y)
            </Formula>
            <div style={{ marginTop: 20 }}>
              <Row name="目标" value="Δc / σ" note="未来相对最后一点的变化，除以窗口内标准差" width={1000} color={C.cyan} />
              <Row name="基线" value="ŷ = 0" note="未来等于现在，误差就是 |y| 本身" width={1000} color={C.violet} />
              <Row name="模型" value="ŷ = 线性头(h)" note="h 是冻结的 64 维表示" width={1000} color={C.amber} />
              <Row name="比值" value="rel = 1.0000" note="k = 0 时模型输出恒为 0，与基线逐位相同" width={1000} color={C.coral} />
            </div>
          </Card>
        </div>
        <Foot>没有基线，就没有「有没有用」。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一比一，<br />才是分水岭。</Body>
          <Body style={{ marginTop: 26 }}>
            相对误差等于一，说明没学到东西；小于一，才算有技能；大于一，比基线还差。
            为什么用 MAE 不用 MSE？MAE 对极端值不敏感。收益的尾部很厚，MSE 会被几个大涨大跌主导，MAE 更接近「典型误差」。两个都记，主指标用 MAE。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="rel = 1" v="无技能" color={C.inkFaint} />
            <KV k={"rel < 1"} v="有技能" color={C.cyan} />
            <KV k={"rel > 1"} v="更差" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="同一批预测，两种损失" accent={C.coral}>
            <Row name="MSE" value="平方" note="大误差被平方放大，少数样本主导" width={1000} color={C.amber} />
            <Row name="MAE" value="绝对值" note="典型误差，对尾部稳健" width={1000} color={C.cyan} />
            <Row name="主指标" value="相对 MAE" note="模型 MAE / 基线 MAE，无量纲" width={1000} color={C.violet} />
            <Row name="辅助" value="MSE / R²" note="只作旁证，不参与好坏判断" width={1000} color={C.inkFaint} />
          </Card>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>越低越好</Chip>
            <Chip color={C.coral}>1.0 是基线</Chip>
          </div>
        </div>
        <Foot>主指标只有一个：相对 MAE。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>固定掩码，<br />才比得出损失比。</Body>
          <Body style={{ marginTop: 26 }}>
            训练中每轮都换掩码；验证时固定一批掩码。为什么不固定？不固定，验证损失本身在抖，比值就没法比。
            已训练模型零点二二八八，未训练模型一点一零七，比值零点二零六七。含义是误差降到两成。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="已训练" v="0.2288" color={C.cyan} />
            <KV k="未训练" v="1.1069" color={C.inkFaint} />
            <KV k="比值" v="0.2067" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="损失比：同一个固定掩码，两个模型" accent={C.amber}>
            <Bars
              items={[
                { label: "未训练", value: M.train.valUntrained, text: fmt4(M.train.valUntrained), color: C.inkFaint },
                { label: "已训练", value: M.train.valTrained, text: fmt4(M.train.valTrained), color: C.cyan },
                { label: "训练损失末轮", value: M.train.trainLoss[19], text: fmt4(M.train.trainLoss[19]), color: C.violet },
              ]}
              width={980} rowH={76} at={0}
            />
            <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              验证损失比 = 0.2288 / 1.1069 = 0.2067；门槛是 0.85。
            </div>
          </Card>
        </div>
        <Foot>固定掩码，是让两个模型面对同一张考卷。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>指标四：<br />线性探测。</Body>
          <Body style={{ marginTop: 26 }}>
            表示是六十四维，要还原整个五百一十二点窗口。线性头有六十四乘五百一十二，加五百一十二个偏置，一共三万三千二百八十个参数。
            它只接线，不参与预训练。相对误差零点一三六四，也就是还原了八成六的方差。这是表示「有信息」的直接证据。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="探测头" v="33,280" color={C.cyan} />
            <KV k="相对 MSE" v="0.1364" color={C.violet} />
            <KV k="解释方差" v="86%" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="探测：从 64 维还原 512 点" accent={C.cyan}>
            <Bars
              items={[
                { label: "全零基线", value: 1.0, text: "1.0000", color: C.inkFaint },
                { label: "线性探测", value: M.probe.relMSE, text: fmt4(M.probe.relMSE), color: C.cyan },
              ]}
              width={980} rowH={76} at={0}
            />
            <div style={{ marginTop: 10 }}>
              <Row name="输入" value="64 维 h" note="编码器输出，冻结" width={1000} color={C.cyan} />
              <Row name="输出" value="512 点" note="逐点线性重建，不加隐层" width={1000} color={C.violet} />
              <Row name="参数" value="64 × 512 + 512" note="= 33,280，只拟合、不反传" width={1000} color={C.amber} />
              <Row name="解释" value="1 − 0.1364 = 0.864" note="窗口方差的 86% 能被这 64 个数线性还原" width={1000} color={C.coral} />
            </div>
          </Card>
        </div>
        <Foot>表示里有信息，这一条是硬证据。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>指标五：<br />梯度检查。</Body>
          <Body style={{ marginTop: 26 }}>
            手写反传容易错。我们用中心差分对一遍：每个参数单独扰动，比较解析梯度与数值梯度。相对误差小于百万分之一才算过。
            实测的梯度误差是零。打印出来是零点零零零零零零。这不是巧合，是逐项对过。反传正确，后面的数才可信。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="解析梯度" v="手写反传" color={C.cyan} />
            <KV k="数值梯度" v="中心差分" color={C.amber} />
            <KV k="最大相对误差" v="0.000000" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="梯度在 32 维小模型上逐项对" accent={C.violet}>
            <Row name="目标函数" value="掩码 MSE" note="同一个 Encoder 结构，只缩小 n 与 d" width={1000} color={C.cyan} />
            <Row name="扰动" value="eps = 1e-5" note="中心差分：(f(x+ε) − f(x−ε)) / 2ε" width={1000} color={C.amber} />
            <Row name="判据" value={"相对误差 < 1e-6"} note="所有参数逐项比较，取最大值" width={1000} color={C.coral} />
            <Row name="实测" value="0.000000" note="通过，写进证据 JSON 的 gradErr" width={1000} color={C.cyan} />
            <Row name="单测" value="14 条" note="掩码、损失、梯度、训练行为都覆盖" width={1000} color={C.violet} />
          </Card>
        </div>
        <Foot>反传不对，后面所有数字都是假的。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
