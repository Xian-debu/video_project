import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Formula, Stat, PairBar } from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：损失只问像不像 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 980 }}>
            <Card label="自编码器的目标" accent={C.cyan}>
              <Formula size={FT.h1} note="式(4.6)：编码 Z = f(X)，解码 X̂ = g(Z)；对每个窗求重构平方和">
                L = Σ ‖X − g(f(X))‖²
              </Formula>
            </Card>
            <Card label="它看得见什么，看不见什么" accent={C.amber}>
              <Row name="均值" value="看得见" note="还原不准就罚" width={930} />
              <Row name="方差" value="看得见" note="波动大小会影响重构误差" width={930} />
              <Row name="点与点的关系" value="看不见" note="顺序被打乱，只要值能还原，损失不变" width={930} />
              <Row name="异常分数" value="没有概率含义" note="只是一个重构误差，不是似然" width={930} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              潜空间里怎么摆，这条损失完全不问。只要解码器能把它还原，横着摆、挤成一团、全堆在原点，损失都一样。
            </Body>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 660, marginTop: 18 }}>
              上一集用注意力矩阵补的正是这个盲区。这一集换个方向：不换尺子，先给分数一个分布。
            </Body>
            <Card label="这一集的两个失败" accent={C.coral} style={{ marginTop: 26 }}>
              <Row name="分数归零" value="恒等映射" note="隐层够宽时的精确解" width={640} />
              <Row name="全高" value="阈值不迁移" note="分布漂移下的必然" width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：恒等陷阱是精确解 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 960 }}>
            <Card label="恒等陷阱，真跑了一次" accent={C.coral}>
              <Row name="结构" value="100 → 100 → 100" note="线性激活，隐层等于输入维" width={910} />
              <Row name="参数" value={M.ae.params100.toLocaleString("en-US") + " 个"} note="两万个参数只干一件事：抄" width={910} />
              <Row name="样本内 MSE" value={M.ae.trapTrainMSE.toFixed(4)} note="单位矩阵对单位矩阵，精确解" width={910} />
              <Row name="干净窗分数均值" value={M.ae.cleanMean100.toFixed(4)} note="分数为零，阈值也是零" width={910} />
              <Row name="F1" value={U("ae100").f1.toFixed(4)} note="检测器死了，指标停在最漂亮的数上" width={910} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 288, width: 730 }}>
            <Card label="为什么它是精确解" accent={C.amber}>
              <Row name="条件" value="d ≥ C" note="隐层不小于输入维" width={670} />
              <Row name="解码器" value="学成编码器的逆" note="线性时就是两个单位矩阵" width={670} />
              <Row name="损失" value="恰好为零" note="不用训练，构造就有" width={670} />
            </Card>
            <Verdict ok={false} label="指标全绿，检测器已死" />
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 690, marginTop: 18 }}>
              这不是训练不充分，是目标函数允许的解。换损失不行，得换约束；KL 就是一种约束。
            </Body>
            <Chip color={C.coral} style={{ marginTop: 14 }}>同名对照：d=C 与 d=16</Chip>
          </div>
        </AbsoluteFill>

        {/* 页三：第二种失败是阈值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1040 }}>
            <Card label="瓶颈自编码器，同一套注入" accent={C.cyan}>
              <Row name="召回" value={U("ae16").recall.toFixed(4)} note={"20 段抓到 " + U("ae16").detected + " 段"} width={990} />
              <Row name="精确率" value={U("ae16").precision.toFixed(4)} note="报警多，命中少" width={990} />
              <Row name="报警率" value={U("ae16").alertPct.toFixed(2) + "%"} note="干净点里七成被判成异常" width={990} />
              <Row name="阈值" value={U("ae16").tau.toFixed(4)} note="训练段 99 分位，2020 年的尺子" width={990} />
            </Card>
            <Body style={{ marginTop: 22, width: 1000 }}>
              二〇二一年以后波动结构换了，干净窗的重构误差整体抬高。拿旧阈值去量新数据，召回好看，代价是七成误报。
              这不是 bug，是分布漂移下阈值法的固有代价。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 288, width: 650 }}>
            <Card label="训练段 vs 测试段" accent={C.amber}>
              <Row name="训练 MSE" value={M.ae.trainMSE16.toFixed(4)} note="2010-2020" width={590} />
              <Row name="干净窗均值" value={M.ae.cleanMean16.toFixed(4)} note="2021-2026，抬高约三倍" width={590} />
            </Card>
            <Card label="两种失败，别混着说" accent={C.violet} style={{ marginTop: 18 }}>
              <Row name="恒等陷阱" value="KL 能救" note="给潜空间一个先验" width={590} />
              <Row name="阈值迁移" value="KL 救不了" note="后面会看到它也误报六成" width={590} />
            </Card>
            <K style={{ display: "block", marginTop: 18 }}>功劳要记对，否则下一集没法接。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
