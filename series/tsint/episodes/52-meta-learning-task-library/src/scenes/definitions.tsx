import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";
import { FoldBars, SplitBar } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五个量，<br />一条流水线。</Body>
          <Body style={{ marginTop: 24 }}>
            任务、元特征、元样本、命中率、后悔值。前三个是构造，后两个是判据。整集只围绕这五个词展开，每个词在后面都有对应的代码和读数。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 820, top: 288, width: 1020 }}>
          <Card label="流水线：从任务到判据" accent={C.cyan}>
            <Row name="任务" value="dataset" note="一只股票的一段历史 + 十个候选" width={960} />
            <Row name="元特征" value="4 维" note="描述任务长相，不碰价格序列本身" width={960} color={C.violet} />
            <Row name="元样本" value="4 → 10" note="特征配十维验证误差" width={960} color={C.cyan} />
            <Row name="命中率" value="Hit@1" note="选中的是不是真值冠军" width={960} color={C.amber} />
            <Row name="后悔值" value="ΔMAE" note="为这次选择多花的测试误差" width={960} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四个数，<br />描述一个任务。</Body>
          <Body style={{ marginTop: 24 }}>
            均值看水平，标准差看波动，一阶自相关看惯性，季节强度看周期。周期从五到二十二天逐个试，取相关性最强的那个。四个数拼成一个向量，就是任务在元学习器眼里的全部样子。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="metaFeatures：四维" accent={C.violet}>
            <Row name="μ" value="均值" note="收盘价的平均水平，取对数差分后的尺度" width={1000} />
            <Row name="σ" value="标准差" note="波动大小；高波动的任务常配稳健模型" width={1000} color={C.violet} />
            <Row name="ρ₁" value="一阶自相关" note="明天的价格有多像今天" width={1000} color={C.cyan} />
            <Row name="S" value="季节强度" note="周期 5–22 天里最强的那个" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            四个数全部来自训练段，验证段和测试段不参与。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>十维标签，<br />任务内中心化。</Body>
          <Body style={{ marginTop: 24 }}>
            一个任务把十个候选都拟合一遍，每个候选在验证段给一个误差，十个误差就是一条标签。特征先标准化，标签在任务内减均值。中心化不改变谁是冠军，只去掉任务难度。
          </Body>
          <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>4 维进</Chip>
            <Chip color={C.violet}>10 维出</Chip>
            <Chip color={C.amber}>L2 正则 0.1</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 292, width: 1060 }}>
          <Card label="多输出岭回归的闭式解" accent={C.cyan}>
            <div style={{ fontFamily: FONT.serif, fontSize: 46, color: C.ink, padding: "6px 0 18px" }}>
              W = (XᵀX + λI)⁻¹ XᵀY
            </div>
            <Row name="X" value="n × 5" note="四维特征 + 截距" width={1000} />
            <Row name="Y" value="n × 10" note="任务内中心化后的十维误差" width={1000} color={C.violet} />
            <Row name="W" value="5 × 10" note="一次求逆，十个输出一起解" width={1000} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 680 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>命中率是硬的，<br />后悔值是软的。</Body>
          <Body style={{ marginTop: 24 }}>
            命中率只看第一名：选中的候选等于真值冠军才记一分。后悔值看实际花了多少：选中候选的测试误差减去冠军的。一个回答「选对没有」，一个回答「贵了多少」。这一集两个都报，因为它们讲的是两个故事。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 820, top: 288, width: 1020 }}>
          <Card label="两个判据，各看一层" accent={C.coral}>
            <Row name="命中率" value={fmtPct(M.hits.stats, 2)} note={"300 个任务里选对 " + Math.round(M.hits.stats * M.data.stocks) + " 次"} width={960} color={C.coral} />
            <Row name="平均后悔" value={M.regret.mean.toFixed(4)} note="选错时多花的 MAE 均值" width={960} color={C.violet} />
            <Row name="最大后悔" value={M.regret.max.toFixed(4)} note="最贵的一次选择" width={960} color={C.amber} />
            <Row name="选错次数" value={M.regret.wrong} note={"300 个任务里有 " + M.regret.wrong + " 次没选中冠军"} width={960} color={C.inkDim} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两层切分：<br />时间、任务。</Body>
          <Body style={{ marginTop: 22 }}>
            第一层是时间：训练、验证、测试按日历切。第二层是任务：五折交叉验证，任务轮流做留出，折与折不共享信息。另留三十只完全没见过的股票，只做最终对照。
          </Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="折数" v="5" color={C.cyan} />
            <KV k="留出" v={M.hits.holdN} color={C.violet} />
            <KV k="每折任务" v={Math.ceil(M.data.stocks / 5)} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 300, width: 1130 }}>
          <Card label="五折：每折的命中率" accent={C.cyan}>
            <FoldBars w={1000} />
          </Card>
          <div style={{ marginTop: 16 }}>
            <SplitBar w={1000} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
