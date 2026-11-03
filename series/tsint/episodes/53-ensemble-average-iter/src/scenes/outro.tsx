import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>记住<br />三句话。</Body>
          <Body style={{ marginTop: 24 }}>
            等权降方差，这一半成立。挑选几乎免费，这一半没让集成赢。平均是保险，不是更强的模型。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 800, top: 292, width: 1040 }}>
          <Card label="三个数" accent={C.cyan}>
            <Row name="等权" value={fmt2(M.levels.equal)} note="比平均单模型低 9.37%，比最强单模型高 6.35%" width={960} color={C.amber} />
            <Row name="最强单模型" value={fmt2(M.levels.best)} note="调参段选出来，离 oracle 只差 0.01" width={960} color={C.cyan} />
            <Row name="岭权重" value={fmt2(M.levels.fit)} note="二十比零赢过等权，低 5.16%" width={960} color={C.violet} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            三个数放在一起，就是这一集的全部结论。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>这一集的<br />全部读数。</Body>
          <Body style={{ marginTop: 22 }}>
            二十八项检查、八点九秒、二十只股票、十个候选。三个模块，二十七条单测。全部可复现。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>28 / 28</Chip>
            <Chip color={C.violet}>8.9 s</Chip>
            <Chip color={C.amber}>2,138 条</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 288, width: 1120 }}>
          <Card label="读数与提交" accent={C.violet}>
            <Row name="检验 MAE" value="10.16 / 9.55" note="等权 vs 最强单模型；oracle 9.54" width={1040} color={C.amber} />
            <Row name="胜负" value="0 / 20 与 20 / 20" note="等权输挑选；调权赢等权" width={1040} color={C.violet} />
            <Row name="迭代" value="9.6296 → 9.5501" note="η=0.1 到 η=0.5，轮数越多越低" width={1040} color={C.cyan} />
            <Row name="噪声" value="16.71 → 10.61" note="集成比单变体平均好；干净单模型 9.66" width={1040} color={C.coral} />
            <Row name="ts-base" value="5893dc0 / bb3fc52" note="证据程序 + 数据快照" width={1040} color={C.inkDim} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>下一集：<br />自动微分。</Body>
          <Body style={{ marginTop: 24 }}>
            这一集是手工试。下一集把架构搜索变成可微的，梯度直接穿过结构。DARTS，三层搜索空间，二十六分钟。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 292, width: 1060 }}>
          <Card label="第 54 集 · 把架构搜索变成可微" accent={C.amber}>
            <Row name="标题" value="DARTS" note="可微架构搜索与三层搜索空间" width={980} color={C.cyan} />
            <Row name="时长" value="26 分钟" note="比这一集长四分钟" width={980} color={C.amber} />
            <Row name="依赖" value="这一集" note="权重学习的思想会被复用" width={980} color={C.violet} />
          </Card>
          <div style={{ marginTop: 22, display: "flex", gap: 30 }}>
            <KV k="集数" v="54 / 74" color={C.cyan} />
            <KV k="组" v="F4 自动集成" color={C.violet} />
            <KV k="章节" v="第 6 章" color={C.amber} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>这一集<br />交付。</Body>
          <Body style={{ marginTop: 24 }}>
            三个模块、二十八项检查、二十只股票的逐只读数、一条命令能重跑的证据。数字全部来自同一份 summary。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="交付清单" accent={C.cyan}>
            <Row name="代码" value="3 模块 + 27 单测" note="Ensemble / NoiseAugEnsemble / IterEnsemble" width={1000} color={C.cyan} />
            <Row name="证据" value="28 项，8.9 秒" note="data 4 / ensemble 6 / cv 7 / iter 6 / noise 5" width={1000} color={C.violet} />
            <Row name="数据" value="20 只 × 10 候选" note="48,572 根日线，切分 70 / 15 / 15" width={1000} color={C.amber} />
            <Row name="成片" value="这一集" note="三十二页、三百二十行、八场" width={1000} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            下一集见：把架构搜索变成可微。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
