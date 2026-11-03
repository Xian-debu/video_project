import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";
import { GapNote } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>二十只股票，<br />十个候选。</Body>
          <Body style={{ marginTop: 26 }}>
            前几集在省算力：少试几个候选、少拟合几次。这一集换一个更朴素的问题：把十个模型平均起来，能不能赢？先给答案，再给量法。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="股票" v={M.data.stocks} color={C.cyan} />
            <KV k="候选" v={M.data.candidates.length} color={C.violet} />
            <KV k="日线" v={M.data.rows.toLocaleString("en-US")} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <Card label="三个数，一句话" accent={C.amber}>
            <Row name="等权集成" value={fmt2(M.levels.equal)} note="十个候选各占十分之一" width={990} color={C.amber} />
            <Row name="平均单模型" value={fmt2(M.levels.meanSingle)} note="十个候选各自的检验误差，再平均" width={990} />
            <Row name="最强单模型" value={fmt2(M.levels.best)} note="每只股票用调参段挑一个，再平均" width={990} color={C.cyan} />
            <Row name="oracle" value={fmt2(M.levels.oracle)} note="每只股票都用事后最好的那一个" width={990} color={C.violet} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>比平均单模型低 9.37%</Chip>
            <Chip color={C.coral}>比最强单模型高 6.35%</Chip>
            <Chip color={C.violet}>20 只全输</Chip>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>两条基线，<br />一个偏序。</Body>
          <Body style={{ marginTop: 24 }}>
            判据一：等权是否低于平均单模型。这检验集成有没有真的降方差。判据二：等权是否低于最强单模型。这检验集成能不能替代挑选。两个判据可能给出相反答案。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 820, top: 292, width: 1020 }}>
          <Card label="同一把尺，三种问法" accent={C.cyan}>
            <Row name="降方差" value="成立" note="10.1566 < 11.2070，低 9.37%" width={950} color={C.cyan} />
            <Row name="替代挑选" value="不成立" note="10.1566 > 9.5498，高 6.35%；20 只全输" width={950} color={C.coral} />
            <Row name="离天花板" value="+6.47%" note="比 oracle 9.5397 高出的比例" width={950} color={C.violet} />
          </Card>
          <div style={{ marginTop: 26 }}>
            <GapNote a={fmt2(M.levels.meanSingle)} b={fmt2(M.levels.equal)} diff="−9.37%" color={C.cyan} />
            <div style={{ height: 12 }} />
            <GapNote a={fmt2(M.levels.equal)} b={fmt2(M.levels.best)} diff="+6.35%" color={C.coral} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>池子里有<br />两个拖后腿的。</Body>
          <Body style={{ marginTop: 24 }}>
            指数平滑零点二的检验误差是十六点三零，调和平均是十五点零六。等权平均把它们也当十分之一，降方差的收益被偏差吃掉了。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.coral}>最差 16.30</Chip>
            <Chip color={C.cyan} style={{ marginLeft: 10 }}>最好 9.54</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="十个候选，两头拉开" accent={C.coral}>
            <Row name="指数平滑 0.2" value="16.30" note="调参段 19.37，检验段也没救回来" width={1010} color={C.coral} />
            <Row name="调和平均" value="15.06" note="调参段 17.60" width={1010} color={C.coral} />
            <Row name="两个 SARIMA" value="9.66 / 9.65" note="和朴素几乎并肩" width={1010} color={C.cyan} />
            <Row name="朴素" value="9.54" note="二十只里九只的最优选择" width={1010} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            等权不是「取长补短」；它把短处也原样保留。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四段路线。</Body>
          <Body style={{ marginTop: 24 }}>
            定义、读数、实现、验收。每一段都有真实读数，读数来自同一份证据程序：二十八项检查，八点九秒，一条命令跑完。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="从定义到二十八项检查" accent={C.cyan}>
            <Row name="01 定义" value="4 个量" note="加权平均、岭权重、有效权重、切分" width={1040} />
            <Row name="02 读数" value="7 条基线" note="平均单模型到 oracle 的同一条尺" width={1040} color={C.violet} />
            <Row name="03 实现" value="3 个模块" note="纯函数、无随机、可复现" width={1040} color={C.cyan} />
            <Row name="04 验收" value="28 项" note="数据 / 集成 / 交叉验证 / 迭代 / 噪声" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="股票" v={M.data.stocks} color={C.cyan} />
            <KV k="行数" v={M.data.rows.toLocaleString("en-US")} color={C.violet} />
            <KV k="检查" v={"28 / 28"} color={C.amber} />
            <KV k="耗时" v={M.seconds.toFixed(1) + "s"} color={C.inkDim} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
