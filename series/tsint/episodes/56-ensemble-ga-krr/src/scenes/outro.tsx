import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

const gainVsEqual = ((M.fusion.equal - M.fusion.pEq) / M.fusion.equal) * 100;
const lossVsSubset = ((M.fusion.krr - M.fusion.pEq) / M.fusion.pEq) * 100;

const cmd = [
  { t: "tsbase evidence-ch06-ga-krr \\" },
  { t: "  --data data/episodes/56-ensemble-ga-krr \\" },
  { t: "  --out  data/episodes/56-ensemble-ga-krr \\" },
  { t: "  --evidence inventory/evidence/56-ensemble-ga-krr.ch6-ga-krr.json" },
  { t: "" },
  { t: "cabal test   # 17 项单测" },
];

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>筛选成立，<br />调权不成立。</Body>
          <Body style={{ marginTop: 24 }}>
            三句话收尾：筛选有效，调权没有额外收益，机制都能复现。这一集认的是第二步，不是第一步。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>会省钱</Chip>
            <Chip color={C.coral} style={{ marginLeft: 10 }}>也要会认输</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1140 }}>
          <Card label="三句话，各自有读数" accent={C.cyan}>
            <Row name="第一 筛选" value="成立" note={"子集等权 " + fmt4(M.fusion.pEq) + "，改进 " + gainVsEqual.toFixed(2) + "%"} width={1080} color={C.cyan} />
            <Row name="第二 调权" value="不成立" note={"核岭回归 " + fmt4(M.fusion.krr) + "，没有跑赢子集等权"} width={1080} color={C.coral} />
            <Row name="第三 机制" value="可复现" note="一条命令，24 项检查，48 秒" width={1080} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            {M.fusion.relImprovePct.toFixed(2)}% 对全池等权；−{lossVsSubset.toFixed(1)}% 对子集等权。
          </div>
        </div>
        <Foot>会省钱，也要会认输。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先看交付清单。</Body>
          <Body style={{ marginTop: 24 }}>
            一个模块，一个证据程序，十七项单测，二十四项检查；十个候选，二十只股票，两段各三百六十五个点。全部可复现。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="这一集交付了什么" accent={C.violet}>
            <Row name="模块" value="477 行" note="TsBase.Algos.Ch06.GaEnsemble" width={1040} color={C.cyan} />
            <Row name="证据程序" value="517 行" note="Ch06GaEnsembleEvidence.hs" width={1040} color={C.violet} />
            <Row name="单测" value="17 项" note="黄金值、极限、前沿、稳定性" width={1040} color={C.amber} />
            <Row name="检查" value="24 项 / 5 组" note="四十八点二秒，全绿" width={1040} color={C.cyan} />
            <Row name="数据" value="10 / 20" note="十个候选，二十只股票" width={1040} color={C.inkDim} />
            <Row name="切分" value="365 / 365" note="调参段与检验段各一年" width={1040} color={C.inkDim} />
          </Card>
        </div>
        <Foot>全部可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>复现命令，一条。</Body>
          <Body style={{ marginTop: 24 }}>
            加数据目录、输出目录、证据路径；四十八秒写出 JSON，检查清单也在里面。单测用 cabal test，十七项全绿。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            数据：data/episodes/56-ensemble-ga-krr<br />
            模块：TsBase.Algos.Ch06<br />
            证据：app/Ch06GaEnsembleEvidence.hs
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <CodeBlock title="一条命令，写出 24 项检查" lines={cmd} width={1040} size={FT.code} />
          <div style={{ marginTop: 18, display: "flex" }}>
            <KV k="耗时" v="48.2s" color={C.amber} />
            <KV k="检查" v="24 / 24" color={C.cyan} />
            <KV k="seed" v={M.ga.seed} color={C.violet} />
          </div>
        </div>
        <Foot>四十八秒，写出 JSON。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>这一集最贵的一课：<br />怎么承认调权没用。</Body>
          <Body style={{ marginTop: 24 }}>
            核修正的调参段误差很低，检验段却更差。低误差不等于好模型，交叉验证也不等于检验段。能做的，是把两段分开；能说的，是把负结果写出来。
          </Body>
          <Body style={{ marginTop: 16 }}>
            这就是会认输。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="同一套参数，两段读数" accent={C.coral}>
            <Row name="调参段 核回归" value="11.5177" note="比等权 13.4317 低，看起来有用" width={1020} color={C.cyan} />
            <Row name="调参段 等权" value="13.4317" note="同一段，未修正" width={1020} color={C.inkDim} />
            <Row name="检验段 核回归" value={fmt4(M.fusion.krr)} note="比子集等权 9.5721 差" width={1020} color={C.coral} />
            <Row name="检验段 等权" value={fmt4(M.fusion.pEq)} note="同一批股票，同一检验段" width={1020} color={C.cyan} />
          </Card>
        </div>
        <Foot accent={C.coral}>低误差，不等于好模型。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>下一集，<br />换一个问题。</Body>
          <Body style={{ marginTop: 24 }}>
            序列怎么切成 token？三种切法：patch、周期、分辨率。九十六个点，切成十二、六、三。token 越少，能装下的周期越短。
          </Body>
          <Body style={{ marginTop: 16 }}>
            从集成走到表示，从选模型走到切序列。底层还是同一件事：预算有限。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="第七章第一集：序列的切法" accent={C.cyan}>
            <Row name="题目" value="序列 token 化" note="patch / 周期 / 分辨率" width={1040} color={C.cyan} />
            <Row name="长度" value="96 点" note="切成 12、6、3 三档" width={1040} color={C.violet} />
            <Row name="取舍" value="token 越少" note="能装下的周期越短" width={1040} color={C.amber} />
            <Row name="不变" value="预算有限" note="从集成到表示，同一件事" width={1040} color={C.inkDim} />
          </Card>
        </div>
        <Foot>下一集再见。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
