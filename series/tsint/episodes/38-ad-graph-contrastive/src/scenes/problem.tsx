import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Formula, fmtInt, names } from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  const n = names();
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：单票还是板块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="一只票跳，还是整个板块跳" accent={C.cyan}>
              <Row name="单票口径" value="每只票单独打分" note="前三十七集一直是这个口径" width={960} />
              <Row name="板块口径" value="十二只一起看同步性" note="一只跳是噪声，一组同时跳才是事件" width={960} />
              <Row name="行业标签" value={M.data.subgroupNames.join(" / ")} note={"写死的分组：7 / 3 / 2，外部知识"} width={960} />
              <Row name="学出来的邻接" value={"TopK · K=" + M.params.topK} note="每行恰好三条边，有向" color={C.cyan} width={960} />
              <Row name="传播层数" value="一层" note="节点数不变，仍是十二个" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              图不是把十二列拼起来。它要回答的是：谁和谁一起动，这件事能不能从数据里学出来。
            </Body>
            <Card label="三种写法" accent={C.amber} style={{ marginTop: 26 }}>
              <Row name="行业标签" value="外部知识" note="最准，也最不诚实" width={640} />
              <Row name="相关系数" value="对称、全连接" note="每一对都有边，噪声也在里面" width={640} />
              <Row name="学出来" value="有向、稀疏" note="由表示决定，表示又由任务决定" width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三个问题 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="先摆三个问题" accent={C.cyan}>
              <Row name="邻接凭什么" value="余弦相似度选邻居" note="不是行业分组，是表示空间里的方向" width={960} />
              <Row name="表示怎么训" value="对比损失" note="同票两个视图靠近，别的票推开" width={960} />
              <Row name="图有没有用" value="读数上为零" note="两个模型的 F1 到小数点后十位都相同" color={C.coral} width={960} />
            </Card>
            <Card label="为什么两个数会一样" accent={C.coral} style={{ marginTop: 20 }}>
              <Row name="分数" value="逐日取十二只票的最大" note="图与无图都越过了阈值" width={960} />
              <Row name="阈值" value="训练段 99 分位" note="测试段干净日中位已经高于它" width={960} />
              <Row name="结果" value="每天报警" note="召回 1.0，精确率 0.0588" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              这一集不是「图有没有用」的证明题，是「结构能不能变成读数」的验证题。答案不乐观，但每一层都写成了检查。
            </Body>
            <Card label="这一集要交的东西" accent={C.violet} style={{ marginTop: 26 }}>
              <Row name="邻接" value="一张 12×12" note="有向、每行三条边、可复现" width={640} />
              <Row name="对比" value="一条损失" note="三个温度、正负样本距离" width={640} />
              <Row name="读数" value="两套 F1" note="图与无图对照，同口径" width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="数据 · 十二只票" accent={C.cyan}>
              <Row name={n.slice(0, 4).join(" · ")} value="白酒四只" note={M.data.subgroupNames[0] + " 组共 7 只"} width={960} />
              <Row name={n.slice(4, 7).join(" · ")} value="白酒三只" note="与上一组同行业，不同价位段" width={960} />
              <Row name={n.slice(7, 10).join(" · ")} value="啤酒三只" note={M.data.subgroupNames[1] + " 组"} width={960} />
              <Row name={n.slice(10).join(" · ")} value="其他两只" note={M.data.subgroupNames[2] + " 组"} width={960} />
              <Row name="对齐后" value={fmtInt(M.data.rows) + " 行"} note={M.data.start + " 至 " + M.data.end} width={960} />
              <Row name="最大间隔" value={M.data.maxGap.days + " 天"} note={M.data.maxGap.pair + "，整段缺数据"} color={C.coral} width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="窗口与注入" accent={C.violet}>
              <Row name="窗长 / 步长" value={M.windows.C + " 天 / 1"} note={"窗内跨度超过 " + M.windows.maxGapDays + " 天就丢"} width={640} />
              <Row name="训练 / 测试" value={M.windows.train + " / " + M.windows.test} note={"训练取 " + M.windows.trainUsed + " 个，步长 " + M.windows.trainStride} width={640} />
              <Row name="尖峰" value={M.inject.spikeRuns + " 段"} note={M.inject.spike.amp + " · 窗内第 15–40 位"} width={640} />
              <Row name="斜坡" value={M.inject.spreadRuns + " 段"} note={M.inject.spread.nodes + " · " + M.inject.spread.amp} width={640} />
              <Row name="真值" value={M.inject.truthPts + " 点 / " + M.inject.truthDays + " 日"} note={"占窗口 " + M.inject.ratePct.toFixed(2) + "%，种子 " + M.inject.seed} width={640} />
            </Card>
            <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
              <Chip color={C.cyan}>2015–2019 训练</Chip>
              <Chip color={C.violet}>2020–2026 测试</Chip>
              <Chip color={C.amber}>对照 2020-02 至 04</Chip>
            </div>
            <K style={{ display: "block", marginTop: 16 }}>十二只票，同一市场，同一段行情。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

