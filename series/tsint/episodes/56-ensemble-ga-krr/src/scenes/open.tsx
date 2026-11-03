import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { FusionBars, SplitBar } from "../figs";

const improve = ((M.fusion.equal - M.fusion.pEq) / M.fusion.equal) * 100;

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先筛，<br />再调权。</Body>
          <Body style={{ marginTop: 26 }}>
            上一集把十个模型等权平均。这一集做两步：先用遗传算法挑子集，再用核岭回归学权重。十个候选，二十只股票，目标只有一个——检验段误差更低。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="候选" v="10" color={C.cyan} />
            <KV k="筛后平均" v={fmt4(M.ga.selKMean, 2)} color={C.violet} />
            <KV k="相对改进" v={M.fusion.relImprovePct.toFixed(2) + "%"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="两步，四个读数" accent={C.amber}>
            <Row name="候选池" value="10" note="五个模型 × 两个超参档" width={1000} color={C.cyan} />
            <Row name="GA 筛选" value={fmt4(M.ga.selKMean, 2) + " 个"} note="平均留下的模型数，至少两个" width={1000} color={C.violet} />
            <Row name="全池等权" value={fmt4(M.fusion.equal)} note="十个候选等权，检验段 MAE" width={1000} color={C.inkDim} />
            <Row name="核岭回归" value={fmt4(M.fusion.krr)} note="子集等权再加核修正" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>先筛</Chip>
            <Chip color={C.amber}>再调</Chip>
            <Chip color={C.violet}>20 只股票</Chip>
          </div>
        </div>
        <Foot>平均是最稳的融合，也是最笨的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三句结论，<br />一句比一句硬。</Body>
          <Body style={{ marginTop: 24 }}>
            筛选有效，调权没有额外收益，机制都能复现。前两句是读数，第三句是证据；先摆结论，再拆机制。
          </Body>
          <div style={{ display: "flex", marginTop: 24, gap: 10 }}>
            <Chip color={C.cyan}>筛选 −5.75%</Chip>
            <Chip color={C.coral}>调权 1.22%</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 730, top: 286, width: 1110 }}>
          <Card label="三句话，各自有读数" accent={C.cyan}>
            <Row name="第一句 筛选" value="−5.75%" note={"从 " + fmt4(M.fusion.equal) + " 到 " + fmt4(M.fusion.pEq)} width={1060} color={C.cyan} />
            <Row name="第二句 调权" value="1.22%" note="相对全池等权好 1.22%，相对子集等权差 4.8%" width={1060} color={C.coral} />
            <Row name="第三句 机制" value="24 / 24" note="五组检查，四十八点二秒" width={1060} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            三个数：十个候选，三点八五，一点二二。
          </div>
        </div>
        <Foot>筛选有效，调权没有额外收益。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>为什么先筛？<br />为什么再调？</Body>
          <Body style={{ marginTop: 24 }}>
            十个候选，每个选或不选，就是一千零二十四个子集；每个子集在三百六十五个点上算误差，全评一遍要三十七万次预测。筛，是为了不穷举。
          </Body>
          <Body style={{ marginTop: 16 }}>
            等权又假设每个模型一样可信。调，是为了让可信的模型多说话。两件事都在调参段完成，检验段完全不参与。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="四件事，同一套切分" accent={C.violet}>
            <Row name="子集总数" value="1,024" note="二的十次方" width={1040} color={C.cyan} />
            <Row name="穷举预测" value="373,760" note="1024 × 365 次" width={1040} color={C.coral} />
            <Row name="调参点" value="365" note="GA 适应度 + KR 拟合都只用这段" width={1040} color={C.violet} />
            <Row name="检验点" value="365" note="只报告，不参与任何选择" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20 }}>
            <SplitBar width={1040} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>十、三点八五、<br />一点二二。</Body>
          <Body style={{ marginTop: 24 }}>
            十是候选数，三点八五是遗传算法平均留下的模型数，一点二二是核岭回归相对等权的改进。三个数背后，一条曲线往下走，一条走平。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="候选" v="10" color={C.cyan} />
            <KV k="留下" v={fmt4(M.ga.selKMean, 2)} color={C.violet} />
            <KV k="改进" v={M.fusion.relImprovePct.toFixed(2) + "%"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1140 }}>
          <Card label="六个误差，同一批检验段" accent={C.amber}>
            <FusionBars width={1060} />
          </Card>
        </div>
        <Foot>往下的是筛选，走平的是调权。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四段路线，<br />一份证据。</Body>
          <Body style={{ marginTop: 24 }}>
            问题、定义、读数、验收。每一段都有读数，读数来自同一份证据程序：二十四项检查，五组，一条命令跑完。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="股票" v={M.data.stocks} color={C.cyan} />
            <KV k="检查" v="24 / 24" color={C.amber} />
            <KV k="耗时" v="48.2s" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="从问题到 24 项检查" accent={C.cyan}>
            <Row name="01 问题" value="1,024 个子集" note="为什么不能穷举；双目标与三段切分" width={1040} />
            <Row name="02 定义" value="2 个对象" note="零一串个体；核方程与前沿" width={1040} color={C.violet} />
            <Row name="03 读数" value="6 个误差" note="黄金值 0.875；二十只股票" width={1040} color={C.cyan} />
            <Row name="04 验收" value="24 项" note="数据 / GA / KRR / 前沿 / 融合" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            十个候选，二十只股票，两段各三百六十五个点。
          </div>
        </div>
        <Foot>先看第一个问题。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
