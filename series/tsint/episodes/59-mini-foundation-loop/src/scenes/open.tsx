import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt4, fmtInt, pagesOf } from "../shared";
import { CurveChart, EncoderDiagram, LossCurve, MaskStrip, ParamSplit } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>没有标签，<br />也能学表示。</Body>
          <Body style={{ marginTop: 26 }}>
            上一集把序列切成了 token。这一集问一个更基本的问题：不给标签，只给收盘价，模型能不能自己学出表示？
            办法是遮住一段，再让它补。五百一十二个点，遮掉三成，正好一百五十四个位置。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="窗口" v="512" color={C.cyan} />
            <KV k="掩码" v="154" color={C.amber} />
            <KV k="参数" v="66,113" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="四步闭环：遮 → 压 → 头 → 少样本" accent={C.cyan}>
            <Row name="01 掩码" value="154 / 512" note="按 16 点整段遮，30% 位置；只在这些位置算损失" width={1000} color={C.amber} />
            <Row name="02 编码器" value="512 → 64 → 512" note="两层全连接 + 一个可学习 mask token，六万六千一百一十三参数" width={1000} color={C.cyan} />
            <Row name="03 线性头" value="1,300" note="冻结表示上接岭回归，预测未来二十天" width={1000} color={C.violet} />
            <Row name="04 少样本" value="k = 0/5/10/100" note="支持集只从训练池抽，测试块逐位相同" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>纯函数</Chip>
            <Chip color={C.amber}>手写反传</Chip>
            <Chip color={C.violet}>六十四秒训完</Chip>
          </div>
        </div>
        <Foot>不给标签，用掩码自己出题。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>这么小的模型，<br />配得上「基础」两个字吗？</Body>
          <Body style={{ marginTop: 26 }}>
            五百一十二维压到六十四维，再升回去。两层、一个隐层、六万六千一百一十三个参数。加上线性头，一共六万七千四百一十三。
            训练二十轮，每轮三千个窗口，在普通处理器上六十四秒。这不是大模型，是一个能跑通的闭环。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="隐层" v="64" color={C.cyan} />
            <KV k="训练" v="20 轮" color={C.amber} />
            <KV k="耗时" v="64 秒" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="结构：512 → 64 → 512" accent={C.cyan}>
            <EncoderDiagram />
          </Card>
          <Card label="参数账" accent={C.violet} style={{ marginTop: 12 }} pad={18}>
            <ParamSplit />
          </Card>
        </div>
        <Foot>小规模，但流程一步不少。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先看它<br />学得怎么样。</Body>
          <Body style={{ marginTop: 26 }}>
            训练损失从零点三零降到零点一三，验证损失从零点三八降到零点二四，最佳出现在第十九轮。再固定一批掩码测一次：
            已训练模型零点二二九，没训练时一点一零七，比值零点二零六七。重建这件事，它确实学会了。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="训练损失" v="0.13" color={C.cyan} />
            <KV k="验证损失" v="0.24" color={C.amber} />
            <KV k="损失比" v="0.2067" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="二十轮：训练（青）与验证（琥珀）" accent={C.amber}>
            <LossCurve />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            最佳轮次 #{M.train.bestEpoch} · 早停耐心 5 轮 · 每轮 {M.train.epochSec.toFixed(1)} 秒
          </div>
        </div>
        <Foot>损失降了，但这只说明它会补洞。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>学会重建，<br />不等于有用。</Body>
          <Body style={{ marginTop: 26 }}>
            三个下游测试。第一，线性探测：把六十四维表示接回整窗，相对误差零点一三六四，表示里装着八成六的方差。
            第二，预测未来二十天收益：相对误差一点零六四三，比什么都不做还差。第三，换二十只没见过的股票：一点零九六零，同一结论。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="探测" v="0.1364" color={C.cyan} />
            <KV k="收益头" v="1.0643" color={C.coral} />
            <KV k="换股票" v="1.0960" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="线性探测 · 相对 MSE" value={fmt4(M.probe.relMSE)} sub="原始 512 点窗口，三万三千二百八十个参数" accent={C.cyan} style={{ width: 330 }} />
            <Stat label="收益头 · 相对 MAE" value={fmt4(M.curve[3].relMAE)} sub="未来二十天，一百条支持样本" accent={C.coral} style={{ width: 330 }} valueColor={C.coral} />
            <Stat label="换股票 · 相对 MAE" value={fmt4(M.cross.rel100)} sub="二十只没见过的股票，每只各自选惩罚" accent={C.coral} style={{ width: 330 }} valueColor={C.coral} />
          </div>
          <Card label="同一张表示，三种问法" accent={C.violet} style={{ marginTop: 18 }}>
            <Row name="有信息吗" value="有，八成六" note="探测能把窗口还原到相对 MSE 0.1364" width={1000} color={C.cyan} />
            <Row name="能预测吗" value="不能" note="收益头打不过「未来等于现在」的基线" width={1000} color={C.coral} />
            <Row name="能迁移吗" value="重建能，预测不能" note="换股票重建 MSE 0.2498，收益头 1.0960" width={1000} color={C.amber} />
          </Card>
        </div>
        <Foot>表示里有信息，是真的；信息能预测未来，是假的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>计划写 0.9，<br />实测没出现。</Body>
          <Body style={{ marginTop: 26 }}>
            计划书的验收线是相对误差降到零点九以下。实测一百条样本是一点零六四三，换二十只股票是一点零九六零。
            我们没有改数据去凑它。这一集按实测讲：一个诚实的负结果，加上一条正面的探测证据。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="计划" v={"< 0.9"} color={C.inkFaint} />
            <KV k="实测" v="1.0643" color={C.coral} />
            <KV k="复现" v="1.0960" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="相对 MAE：k 条支持样本" accent={C.coral}>
            <CurveChart />
          </Card>
        </div>
        <Foot>四条线都在 1.0 附近：打不过基线，也照样上屏。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个模块，<br />三十四项检查。</Body>
          <Body style={{ marginTop: 26 }}>
            先讲问题：为什么遮、怎么遮。再讲定义：三个模块的接口。然后讲指标、实现、逐条验证，最后讲边界：哪些话不能说。
            八百二十二行纯函数，三十九条单测，证据程序一百零二秒跑完三十四项检查。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="模块" v="822 行" color={C.cyan} />
            <KV k="单测" v="39" color={C.violet} />
            <KV k="检查" v="34/34" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="八组检查，逐项硬断言" accent={C.cyan}>
            <CheckGrid cell={24} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            证据：{M.checks.length} 项 · 检查全文 {fmtInt(M.code.evidenceLines)} 行 · 单测 {M.code.tests} 条
          </div>
        </div>
        <Foot>看完，你能自己搭这个闭环。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
