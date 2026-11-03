import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";
import { IterCurve, NoisePanel } from "../figs";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五组，<br />二十八项，<br />八点九秒。</Body>
          <Body style={{ marginTop: 24 }}>
            全套跑完不到九秒。数据四项管切分，集成六项管公式，交叉验证七项管胜负，迭代六项管自伤，噪声五项管退化。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 292, width: 1100 }}>
          <Card label="二十八项检查：按组成簇" accent={C.cyan}>
            <CheckGrid cell={30} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 22 }}>
            <KV k="数据" v="4" color={C.cyan} />
            <KV k="集成" v="6" color={C.violet} />
            <KV k="交叉验证" v="7" color={C.amber} />
            <KV k="迭代" v="6" color={C.cyan} />
            <KV k="噪声" v="5" color={C.violet} />
          </div>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            判据全部写成实测陈述：计划不成立时，检查写成负结果并通过。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>先钉死<br />六个黄金值。</Body>
          <Body style={{ marginTop: 24 }}>
            公式对了，数字才对。加权平均、中位数、有效权重、迭代一步、噪声退化、同种子复现，都是精确断言，不是模糊比较。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 700, top: 292, width: 1140 }}>
          <Card label="六条精确断言" accent={C.violet}>
            <Row name="式 6.5" value="1.7000" note="权重 0.5/0.3/0.2 乘 1/2/3" width={1060} color={C.cyan} />
            <Row name="中位数" value="2.0000" note="{1, 2, 100} 取中位，离群值不拉偏" width={1060} color={C.violet} />
            <Row name="有效权重" value={fmt4(M.fit.effW, 2)} note="1/Σw²；等权时是 10，单选时是 1" width={1060} color={C.amber} />
            <Row name="σ = 0 退化" value="0.0" note="偏差小于 1e-12，逐元素相同" width={1060} color={C.cyan} />
            <Row name="同种子复现" value="逐位相等" note="噪声加成也是确定性的" width={1060} color={C.violet} />
            <Row name="迭代一步" value="0.6 / 0.4" note="误差 1 与 3，eta 0.1 的精确值" width={1060} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>三条预言，<br />全部落空。</Body>
          <Body style={{ marginTop: 22 }}>
            计划说等权会低三到八个百分点，实测高了六点三五；计划说按残差调权会自伤，实测二十比零全改善。不是代码错了，是计划想反了。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1140 }}>
          <Card label="计划 vs 实测：方向反了三次" accent={C.coral}>
            <Row name="等权 vs 最强" value="+6.35%" note="计划低 3–8%；实测高 6.35%，0/20 胜" width={1060} color={C.coral} />
            <Row name="岭权重 vs 等权" value="−5.16%" note="计划说会自伤；实测 20/20 改善" width={1060} color={C.cyan} />
            <Row name="迭代 vs 等权" value="−5.78%" note="计划说会自伤；实测 20/20 改善" width={1060} color={C.violet} />
            <Row name="eta 0.5 vs 0.1" value="低 0.0172" note="计划说步长越大越糟；实测更小" width={1060} color={C.amber} />
            <Row name="噪声偏离" value={fmt4(M.noise.devRatio, 4)} note="计划小于 0.5；这一条成立" width={1060} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 520 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>两条曲线，<br />两个结论。</Body>
          <Body style={{ marginTop: 22 }}>
            左图：迭代越多轮，检验误差越低，两条都贴着最强单模型。右图：噪声集成比单变体平均好得多，但还是不如干净的单模型。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>9.6296 → 9.5501</Chip>
            <Chip color={C.amber}>省了方差，没省偏差</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 620, top: 276, width: 1220 }}>
          <Card label="迭代曲线（左）与噪声增强（右）" accent={C.amber}>
            <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
              <IterCurve width={620} height={330} />
              <NoisePanel width={520} />
            </div>
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            迭代曲线纵轴 9.54–9.645，只为了让两条线分开；最强单模型 9.55 是虚线。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
