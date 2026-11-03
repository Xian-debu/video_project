import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Formula, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, pagesOf } from "../shared";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 680 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>平均为什么<br />可能赢？</Body>
          <Body style={{ marginTop: 24 }}>
            因为误差里有一部分是运气。每个模型犯的错不一样，错得不一样，平均就会相互抵消。这是集成最老的理由，也是这一集要检验的第一条。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 820, top: 296, width: 1020 }}>
          <Card label="独立误差的算术" accent={C.cyan}>
            <Formula size={52}>Var(ȳ) = σ² / K</Formula>
            <div style={{ height: 18 }} />
            <Row name="K = 10" value="1/10 方差" note="标准差降到 1/√10，约三分之一" width={940} color={C.cyan} />
            <Row name="前提" value="误差独立" note="相关性越低，抵消越充分" width={940} />
            <Row name="实测" value="−9.37%" note="等权 10.16 对平均单模型 11.21" width={940} color={C.violet} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            降方差这一半，这一集确实成立。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>但误差里<br />还有偏差。</Body>
          <Body style={{ marginTop: 24 }}>
            偏差不会被平均抵消，它只会被平均保留。池子里如果有两个很差的成员，它们会把平均值往下拽。十个候选里，最好九点五四，最差十六点三零。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 292, width: 1060 }}>
          <Card label="十个候选的检验误差：两头差 6.76" accent={C.coral}>
            <Row name="最好" value="9.54" note="朴素；一阶自回归和两个 SARIMA 都在 9.66 附近" width={990} color={C.cyan} />
            <Row name="中间" value="9.72" note="两个岭回归；调参段都在 11.83 左右" width={990} color={C.inkDim} />
            <Row name="偏弱" value="11.34 / 11.42" note="漂移、指数平滑 0.5" width={990} color={C.amber} />
            <Row name="最差" value="15.06 / 16.30" note="调和平均、指数平滑 0.2" width={990} color={C.coral} />
          </Card>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>六个在 10 以下</Chip>
            <Chip color={C.coral}>两个在 15 以上</Chip>
            <Chip color={C.violet}>等权各给 10%</Chip>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>更麻烦的是，<br />挑选本身很强。</Body>
          <Body style={{ marginTop: 24 }}>
            每只股票用调参段选一个候选，检验误差是九点五五，离 oracle 只差零点零一。也就是说，池子里的冠军几乎都能被选出来。平均要赢它，很难。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 770, top: 292, width: 1070 }}>
          <Card label="二十只股票，按调参段选出的冠军" accent={C.cyan}>
            <Row name="朴素" value="9 只" note="多数股票的最优模型就是随机游走" width={1000} color={C.cyan} />
            <Row name="12 阶 SARIMA" value="4 只" note="有季节结构的少数派" width={1000} color={C.violet} />
            <Row name="漂移 / 5 阶 SARIMA" value="3 / 3 只" note="趋势与短周期" width={1000} color={C.amber} />
            <Row name="一阶自回归" value="1 只" note="唯一的 AR 冠军" width={1000} color={C.inkDim} />
            <Row name="合计误差" value={fmt2(M.levels.best)} note={"oracle " + fmt2(M.levels.oracle) + "，只差 0.01"} width={1000} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两个判据，<br />两种答案。</Body>
          <Body style={{ marginTop: 24 }}>
            判据一问降方差，判据二问替代挑选。两个都重要，但含义完全不同。这一集把两个都跑，不合并成一个分数。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 770, top: 292, width: 1070 }}>
          <Card label="十条基线关系，四个结论" accent={C.violet}>
            <Row name="判据一" value="10.16 < 11.21" note="等权低于平均单模型：降方差成立" width={1000} color={C.cyan} />
            <Row name="判据二" value="10.16 > 9.55" note="等权高于最强单模型：替代挑选不成立" width={1000} color={C.coral} />
            <Row name="胜负" value="0 / 20" note="二十只股票，等权一只也没赢过挑选" width={1000} color={C.coral} />
            <Row name="位置" value="+6.47%" note="离 oracle 的相对差距" width={1000} color={C.violet} />
          </Card>
          <div style={{ marginTop: 22, display: "flex", gap: 26 }}>
            <KV k="平均单模型" v={fmt2(M.levels.meanSingle)} color={C.inkDim} />
            <KV k="等权" v={fmt2(M.levels.equal)} color={C.amber} />
            <KV k="最强单模型" v={fmt2(M.levels.best)} color={C.cyan} />
            <KV k="oracle" v={fmt2(M.levels.oracle)} color={C.violet} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
