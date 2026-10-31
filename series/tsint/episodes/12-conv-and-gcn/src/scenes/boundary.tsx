import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, lf } from "../shared";

/* 边界：数据、任务、指标，三条都不承诺。 */

export const SBoundary: React.FC = () => {
  const m = M;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={[0, 0.065, 0.26, 0.48, 0.65, 0.94]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 296, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            边界要说三条：数据、任务、指标。
          </div>
          <Build at={lf("boundary", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 384, display: "flex", gap: 26 }}>
              <Card label="一 · 数据" accent={C.cyan} style={{ width: 570, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>图是我们造的</div>
                <Body style={{ marginTop: 14 }}>两条收益序列的相关系数，过阈值就连边；阈值取多少，书里没有。</Body>
              </Card>
              <Card label="二 · 任务" accent={C.violet} style={{ width: 570, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>合成任务埋了陷阱</div>
                <Body style={{ marginTop: 14 }}>每个节点自己就有答案，邻居的信息全是噪声：平均进来只有坏处。</Body>
              </Card>
              <Card label="三 · 指标" accent={C.amber} style={{ width: 588, height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>两个数都很窄</div>
                <Body style={{ marginTop: 14 }}>准确率只说符号对不对，余弦相似度只说节点被同化到什么程度。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一条是数据：图不是数据的属性，是我们的选择。
          </div>
          <Build at={lf("boundary", 0.09)}>
            <div style={{ position: "absolute", left: PAD, top: 372, display: "flex", gap: 24 }}>
              <Stat label="票数" accent={C.inkFaint} value={String(m.data.codes)} sub="全市场等距抽样" valueSize={54} style={{ width: 380, height: 200 }} />
              <Stat label="交易日" accent={C.violet} value={String(m.data.days)} sub={m.data.firstDate + " → " + m.data.lastDate} valueColor={C.violet} valueSize={54} style={{ width: 540, height: 200 }} />
              <Stat label="特征日" accent={C.cyan} value={String(m.data.featureDays)} sub={"训练 " + m.data.trainDays + " / 测试 " + m.data.testDays} valueColor={C.cyan} valueSize={54} style={{ width: 440, height: 200 }} />
              <Stat label="输入维" accent={C.amber} value={String(m.struct.params.feat)} sub="收益、波动、量比、均线偏离" valueColor={C.amber} valueSize={54} style={{ width: 340, height: 200 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.17)}>
            <div style={{ position: "absolute", left: PAD, top: 604, width: 1776 }}>
              <Row name="连边规则" value="| 两条收益序列的相关系数 | > 阈值" note="阈值取零点六到零点三，四个档都跑了" width={1776} />
              <Row name="阈值本身" value="书里没有" note="加自环、按度归一化、阈值：三个约定全是我们定的" color={C.coral} width={1776} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.22)}>
            <div style={{ position: "absolute", left: PAD, top: 772, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              真实日收益几乎没有线性结构，这一点上一集已经量过；准确率贴着零点五，不是图卷积的错。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二条是任务：合成任务量的是另一件事。
          </div>
          <Build at={lf("boundary", 0.29)}>
            <div style={{ position: "absolute", left: PAD, top: 372, width: 1080 }}>
              <Row name="节点信号" value="第一维：自己的固定符号" note="标签就是这个符号，跟邻居无关" width={1080} />
              <Row name="邻居信号" value="纯噪声" note="八维里其余七维均匀随机，平均进来只有坏处" color={C.coral} width={1080} />
              <Row name="环半径" value="往耳朵里掺噪声的旋钮" note="半径越大，掺进来的邻居越多" color={C.amber} width={1080} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.37)}>
            <div style={{ position: "absolute", left: 1180, top: 372, width: 620 }}>
              <Card label="这个任务测什么" accent={C.cyan} style={{ width: 620, height: 300 }}>
                <Body style={{ color: C.ink }}>结构注入会不会破坏个体信息。</Body>
              </Card>
              <Card label="不测什么" accent={C.coral} style={{ width: 620, height: 200, marginTop: 20 }}>
                <Body style={{ color: C.ink }}>幅度、时序、预测能力：一个都不测。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 292, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三条是指标：两个数都不能说明学到了什么结构。
          </div>
          <Build at={lf("boundary", 0.51)}>
            <div style={{ position: "absolute", left: PAD, top: 372, display: "flex", gap: 26 }}>
              <Card label="准确率" accent={C.cyan} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>符号对不对</div>
                <Body style={{ marginTop: 12 }}>零点五零二一和零点四九八一，在这个样本量下都读不出差别。</Body>
              </Card>
              <Card label="余弦相似度" accent={C.violet} style={{ width: 875, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>节点有多像</div>
                <Body style={{ marginTop: 12 }}>它只说明同化程度，不说明信息还在不在。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 288, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            还有一条更根本的。
          </div>
          <Build at={lf("boundary", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 366, width: 1776 }}>
              <Row name="谱上界小于一" value="只保证不放大误差" note={"实测最大比值 " + m.struct.spectralRatio.toFixed(3) + "，一百个随机方向"} width={1776} />
              <Row name="不保证" value="保留有用的信号" color={C.coral} width={1776} />
              <Row name="也不保证" value="堆更多层会更好" note="书里自己写了：层数多了会过平滑；我们在一层上就看到了" color={C.coral} width={1776} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 704, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "18px 24px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>图卷积不是更聪明的卷积：它是把「邻居」换成图上邻居的同一个卷积。</div>
              <K style={{ display: "block", marginTop: 8 }}>定义域换了，算子没换：承诺没变多，问题也没变少</K>
            </div>
          </Build>
        </div>

        <div>
          <Build at={lf("boundary", 0.96)}>
            <div style={{ position: "absolute", left: PAD, top: 320 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>下一集换一个方向：归一化。归一化也是一句话的事——用谁的统计量。</div>
              <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
                <Chip color={C.cyan}>批归一化：用整个批</Chip>
                <Chip color={C.violet}>层归一化：用一层所有通道</Chip>
                <Chip color={C.amber}>实例归一化：用一个样本</Chip>
              </div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};