import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个数，<br />三句话。</Body>
          <Body style={{ marginTop: 22 }}>
            四十八个离散选择；二十步搜索；两条路径 top-1 和 top-2。架构能被连续化，但没有搜出收益。
          </Body>
          <div style={{ marginTop: 24, display: "flex" }}>
            <KV k="离散选择" v={M.search.decisions} color={C.cyan} />
            <KV k="搜索步数" v="20" color={C.violet} />
            <KV k="路径" v="top-2" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <Card label="三句话，各自有证据" accent={C.cyan}>
            <Row name="第一" value="可微成立" note="混合算子公式与黄金值都过" width={990} color={C.cyan} />
            <Row name="第二" value="没塌缩" note="二十步不动；放大学习率才塌，塌了也不等于选对" width={990} color={C.violet} />
            <Row name="第三" value="全输给零基线" note="任务没有信号，不是架构搜索单独的问题" width={990} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <Chip color={C.cyan}>机制成立</Chip>
            <Chip color={C.coral}>收益不成立</Chip>
          </div>
        </div>
        <Foot>四十八 · 二十 · 两条路径。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 980 }}>
          <Card label="再看一眼证据" accent={C.violet}>
            <Row name="检查" value={"28 项 / 5 组"} note="数据 4 · DARTS 6 · 搜索 6 · 三层 6 · 演示 6" width={910} color={C.cyan} />
            <Row name="耗时" value={M.seconds.toFixed(2) + " s"} note="一条命令，无 GPU，无网络" width={910} color={C.violet} />
            <Row name="全仓断言" value="2,158" note="本集新增 20 条" width={910} color={C.amber} />
            <Row name="模块代码" value="311 行" note="Darts 245 + StgBlock 66" width={910} color={C.cyan} />
            <Row name="证据程序" value="519 行" note="读数据、切分、批处理、搜索、重训、写读数" width={910} color={C.violet} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这些数字都能复现。复现命令在 plan 里，一行命令，一条数据路径。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1100, top: 296, width: 750 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>可验证的意思是：<br />每次都是同一组数。</Body>
          <Body style={{ marginTop: 20 }}>
            不是跑通一次，是每次都能跑出同一组数。不需要 GPU，不需要联网，随机性全部固定种子。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>下一集：<br />把试的次数减少。</Body>
          <Body style={{ marginTop: 20 }}>
            这一集把选择变成训练；下一集把训练再变回试更少：子空间、比较器、组合预测器。三种剪枝，一个目标。
          </Body>
          <Body style={{ marginTop: 14 }}>
            系列做到这里，已经交付六十四集。第六章还剩十集：从搜索到集成，从剪枝到基础模型。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 770, top: 286, width: 1070 }}>
          <Card label="三种省法" accent={C.violet}>
            <Row name="子空间" value="缩小范围" note="只在大空间的一个区域里搜" width={1000} color={C.cyan} />
            <Row name="比较器" value="廉价代理" note="用便宜指标替代完整训练" width={1000} color={C.violet} />
            <Row name="组合预测器" value="预测组合" note="由已评估的块推测未评估的块" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            每一集都有一个可复现的证据程序，每一集都有一个明确的负结果或正结果。这是这个系列的做法。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1030 }}>
          <Card label="这一集交付了什么" accent={C.cyan}>
            <Row name="两个模块" value="311 行" note="可微搜索 + 三层空间" width={960} color={C.cyan} />
            <Row name="20 条单测" value="黄金值" note="softmax / 混合 / 三层 / 性质" width={960} color={C.violet} />
            <Row name="28 项证据" value="一条命令" note="3.79 s 跑完，负结果也在里面" width={960} color={C.amber} />
            <Row name="一集成片" value="本集" note="1920×1080，40 页，400 行字幕" width={960} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            下一集见。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1130, top: 296, width: 720 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>如果你只记<br />一句话。</Body>
          <Body style={{ marginTop: 20 }}>
            机制成立，收益不成立。这一集验证了前半句，也诚实地报告了后半句。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 1780 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>四十八 · 二十 · 两条路径。</Body>
          <Body size={FT.h2} color={C.coral} style={{ marginTop: 26 }}>机制成立，收益不成立。</Body>
          <div style={{ marginTop: 36, display: "flex", gap: 40 }}>
            <KV k="检查" v="28 / 28" color={C.cyan} />
            <KV k="耗时" v="3.79 s" color={C.violet} />
            <KV k="断言" v="2,158" color={C.amber} />
            <KV k="下一集" v="第 55 集 · 三种剪枝" color={C.inkDim} />
          </div>
          <div style={{ marginTop: 30, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            第 6 章 · 自动化模型设计 · 第五十四集 —— 完
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);