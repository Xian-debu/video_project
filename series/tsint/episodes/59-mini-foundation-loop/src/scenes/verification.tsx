import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { CurveChart, LossCurve, SegmentGrid } from "../figs";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三十四项，<br />全部通过。</Body>
          <Body style={{ marginTop: 26 }}>
            证据程序跑了一百零二秒，其中训练六十四秒。八组检查：数据四、掩码五、参数四、训练五、线性头六、协议四、曲线三、跨股票三。
            每一组都能单独复现。输出三份文件：证据 JSON、检查清单、摘要。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="检查" v="34/34" color={C.cyan} />
            <KV k="单测" v="39" color={C.violet} />
            <KV k="耗时" v="102 秒" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="八组检查：每格一项，全绿" accent={C.cyan}>
            <CheckGrid cell={30} at={0} />
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              数据 4 · 掩码 5 · 参数 4 · 训练 5 · 线性头 6 · 协议 4 · 曲线 3 · 跨股票 3
            </div>
          </Card>
        </div>
        <Foot>每组一条命令，每组一个 JSON。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先看结构与参数。</Body>
          <Body style={{ marginTop: 26 }}>
            掩码一百五十四个位置：九段整遮，一段前十个点，三十二段逐段核对。编码器六万六千一百一十三，计划数六万五千八百五十六，差二百五十七，已登记。
            线性头一千三百，总参数六万七千四百一十三。每个数都能在代码里重算。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="掩码" v="154" color={C.cyan} />
            <KV k="编码器" v="66,113" color={C.violet} />
            <KV k="总参数" v="67,413" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="逐段核对：9 段整遮 + 1 段前 10 点" accent={C.cyan}>
            <SegmentGrid />
          </Card>
          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>154 = 9 × 16 + 10</Chip>
            <Chip color={C.amber}>差 257 已登记</Chip>
            <Chip color={C.violet}>逐段可重算</Chip>
          </div>
        </div>
        <Foot>参数账不怕差，怕的是没说。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>训练这组，<br />看四条。</Body>
          <Body style={{ marginTop: 26 }}>
            训练损失逐轮下降，末轮除以首轮是零点四二四六。验证损失低于未训练模型，比值零点二零六七，门槛零点八五。
            最佳轮次第十九轮，早停记录完整。每轮都换掩码，二十对记录，梯度检查相对误差零。五项全过。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="末轮/首轮" v="0.4246" color={C.cyan} />
            <KV k="损失比" v="0.2067" color={C.violet} />
            <KV k="最佳轮" v="19" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="训练与验证：二十轮，最佳第十九轮" accent={C.violet}>
            <LossCurve />
          </Card>
        </div>
        <Foot>损失曲线不撒谎，前提是掩码每轮都换。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>线性头六项，<br />两项是新的。</Body>
          <Body style={{ marginTop: 26 }}>
            参数一千三百。岭回归一阶最优性残差零。惩罚增大，系数范数单调不增：从二十点三七降到零点八四。对偶路径训练行残差零。
            线性探测相对误差零点一三六四，探测头三万三千二百八十。六项里有两项是本集新增的，它们回答「表示里有什么」。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="‖W‖ 起点" v="20.3736" color={C.cyan} />
            <KV k="‖W‖ 终点" v="0.8367" color={C.amber} />
            <KV k="探测" v="0.1364" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="六项逐条" accent={C.cyan}>
            <Row name="参数个数" value="1,300" note="(64 + 1) × 20，线性头不带隐层" width={1000} color={C.cyan} />
            <Row name="一阶最优性" value="残差 0" note="梯度为零，闭式解与迭代解一致" width={1000} color={C.violet} />
            <Row name="惩罚单调" value="20.3736 → 0.8367" note="λ 从 1e-3 增到 1000，‖W‖ 单调不增" width={1000} valueW={400} color={C.amber} />
            <Row name="对偶路径" value="训练残差 0" note="n < p 时走对偶，返回 p 维" width={1000} color={C.cyan} />
            <Row name="线性探测" value="相对 MSE 0.1364" note="64 维还原 512 点，头 33,280 参数" width={1000} color={C.violet} />
            <Row name="探测参数" value="33,280" note="只拟合，不反传；回答表示里有什么" width={1000} color={C.amber} />
          </Card>
        </div>
        <Foot>闭式解的正确性，靠残差与单调性两把尺。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>协议四项，<br />条条防泄漏。</Body>
          <Body style={{ marginTop: 26 }}>
            样本数为五，支持集恰好五条，且与测试集没有交集。零样本、五样本、全样本，切出同一个测试块。零样本的支持集为空，全样本的是整池。
            重复五次，支持集各不相同。这些是防泄漏的基本功，每一条都是硬断言。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="支持集" v="5 条" color={C.cyan} />
            <KV k="测试块" v="同一个" color={C.violet} />
            <KV k="重复" v="5 次" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="四条断言" accent={C.amber}>
            <Row name="k = 5" value="支持集 5 条" note="与测试集交集为空，逐条断言" width={1000} color={C.cyan} />
            <Row name="三档同测" value="测试块相同" note="零样本、五样本、全样本只换支持集" width={1000} color={C.violet} />
            <Row name="零样本" value="支持集为空" note="池仍是整池，测试块不变" width={1000} color={C.amber} />
            <Row name="五次重复" value="种子各不同" note="seed + rep × 7919，支持集两两不同" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            支持集只能从训练池抽；测试集只在最后打分时出现一次。
          </div>
        </div>
        <Foot>比较的意义，来自同一张考卷。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>最后是曲线<br />与跨股票。</Body>
          <Body style={{ marginTop: 26 }}>
            零样本相对误差一点零零零零，五样本一点三一六四，十样本一点零九七五，一百样本一点零六四三。标准差从零点二六降到零点零二。
            跨二十只股票，一百样本一点零九六零；掩码重建误差零点二四九八。重建能迁移，预测不能。这就是三十四项的全貌。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="k=100" v="1.0643" color={C.coral} />
            <KV k="跨股票" v="1.0960" color={C.coral} />
            <KV k="重建" v="0.2498" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="四条不同颜色的线，都贴着一" accent={C.coral}>
            <CurveChart />
            <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>跨股票重建 0.2498</Chip>
              <Chip color={C.coral}>跨股票收益 1.0960</Chip>
              <Chip color={C.inkFaint}>标准差 0.26 → 0.02</Chip>
            </div>
          </Card>
        </div>
        <Foot>三十四项，讲完最诚实的一组。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
