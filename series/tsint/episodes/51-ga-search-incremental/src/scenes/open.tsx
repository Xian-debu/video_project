import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, fmtPct, pagesOf } from "../shared";
import { CandChips, CostLadder } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.22 }}>省算力的<br />两把刀。</Body>
          <Body style={{ marginTop: 26 }}>
            上一集换了问法，这一集换工具。模型选择有两笔账：候选多、拟合贵。省算力也只有两条路：少试几个、少拟合几次。这一集把两条路都实现、都量一遍。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="候选" v={M.data.candidates} color={C.cyan} />
            <KV k="股票" v={M.data.stocks} color={C.violet} />
            <KV k="检查" v={M.checks.length} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 288, width: 1060 }}>
          <Card label="两条反向的路线，一个共同前提" accent={C.cyan}>
            <Row name="压缩空间" value="遗传算法" note="不逐个试，按适应度养种群" width={1000} color={C.coral} />
            <Row name="压缩拟合" value="学习曲线外推" note="先小样本拟合，再往全量推" width={1000} color={C.violet} />
            <Row name="共同前提" value="排序不变" note="省下来的部分，不能改变谁最好" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.coral}>十次穷举就够的空间</Chip>
            <Chip color={C.violet}>六百四十八格的网格</Chip>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先看三个<br />数字。</Body>
          <Body style={{ marginTop: 24 }}>
            两百：遗传算法每只股票评估两百次，穷举只要十次。一点三八：幂律外推后的平均误差。三成：外推把排序救回来的比例。三个数放在一起，这一集的结论就出来了。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            两百次评估 = {M.ga.unique} 次不重复训练，缓存一次没命中
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1090 }}>
          <Card label="花掉的算力，换回来什么" accent={C.coral}>
            <CostLadder w={1020} />
          </Card>
          <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
            <KV k="线性外推误差" v={fmt4(M.demo.lin.errMean)} color={C.coral} />
            <KV k="幂律外推误差" v={fmt4(M.demo.pow.errMean)} color={C.violet} />
            <KV k="排序差距" v={fmt4(M.demo.gap)} color={C.cyan} />
            <KV k="倍数" v={fmt4(M.demo.ratio) + "×"} color={C.ink} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三句话<br />先放这里。</Body>
          <Body style={{ marginTop: 24 }}>
            第一，省算力的前提是信号比噪声大。第二，遗传算法只在搜不完的空间里划算。第三，学习曲线要先看形状，再看平台期。三句都不是推的，是量出来的。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Chip color={C.cyan}>信号</Chip>
            <Chip color={C.coral}>空间</Chip>
            <Chip color={C.violet}>形状</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 296, width: 1040 }}>
          <Card label="三句话，三个读数" accent={C.amber}>
            <Row name="信号比噪声" value={fmt4(M.demo.ratio) + "×"} note="外推误差 ÷ 冠军-亚军差距" width={980} color={C.cyan} />
            <Row name="搜不完的空间" value={"200 : 10"} note={"每只股票 200 次评估，穷举 10 次；网格 648 格"} width={980} color={C.coral} />
            <Row name="平台期" value={"843 → 1,686"} note="最后一段 MAE 几乎不动，外推看不见" width={980} color={C.violet} />
            <Row name="省下的数据" value={fmtPct(M.budget.dataRatio, 1)} note="三点部分拟合接触的数据占比" width={980} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);

export const OpenChips: React.FC = () => (
  <Card label="十个候选，同一套指标">
    <CandChips w={1000} />
  </Card>
);
