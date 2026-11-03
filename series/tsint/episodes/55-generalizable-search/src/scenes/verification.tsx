import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三十三项，<br />六组，一条命令。</Body>
          <Body style={{ marginTop: 24 }}>
            数据四项、合成九项、子空间六项、比较器五项、组合四项、迁移五项。全绿才算过，没有跳过的项；四点八一秒跑完。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="检查" v="33 / 33" color={C.cyan} />
            <KV k="组" v="6" color={C.violet} />
            <KV k="耗时" v={M.meta.seconds.toFixed(2) + "s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 600 }}>
          <Card label="逐格：三十三项" accent={C.cyan}>
            <CheckGrid cell={28} />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1360, top: 286, width: 490 }}>
          <Card label="六组分布" accent={C.violet}>
            {([
              ["数据", "data", C.cyan],
              ["合成", "synth", C.cyan],
              ["子空间", "cherry", C.violet],
              ["比较器", "cmp", C.amber],
              ["组合", "comb", C.cyan],
              ["迁移", "transfer", C.coral],
            ] as [string, string, string][]).map(([label, group, color]) => (
              <div key={group} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid " + C.panelLine }}>
                <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{label}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.lead, color }}>{M.checks.filter((c) => c.group === group).length}</span>
              </div>
            ))}
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>黄金值先过，<br />公式才算数。</Body>
          <Body style={{ marginTop: 24 }}>
            排序、保留、继承都有固定读数；任何一处写错——排序方向反了、保留索引没升序、混合系数用反——都会被当场抓住。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>顺序</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>索引</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>系数</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="子空间 / 比较器 / 组合：黄金值" accent={C.violet}>
            <Row name="排序" value="[1, 3, 2, 4]" note="四个架构按真值降序" width={1010} color={C.cyan} />
            <Row name="保留" value="[5, 6, 7, 8]" note="八块按均分留后四块，升序返回" width={1010} color={C.amber} />
            <Row name="继承" value={String(M.golden.inheritMix)} note="α=0.7 的混合结果" width={1010} color={C.violet} />
            <Row name="比较准确率" value={fmt4(M.golden.cmpAccuracy)} note="线性真值上的留出排序" width={1010} color={C.cyan} />
            <Row name="二次曲面" value={fmt4(M.golden.quadraticBest)} note="三轮收缩后 ≥ −0.01" width={1010} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            同一组黄金值在单测与证据程序里各跑一遍：两边独立，写错一个就有一边红。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>预算这笔账，<br />也要断言。</Body>
          <Body style={{ marginTop: 24 }}>
            每种策略都记录真实评估次数：子空间一万、比较器二百零一、组合一万、随机一万。体积必须单调缩小，末体积小于零点零一。
          </Body>
          <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            体积 0.0770 → 0.0059 → 0.0005<br />
            盒宽每一维都小于 0.2
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="预算与收缩：五项检查" accent={C.cyan}>
            <Row name="随机预算" value={String(M.synth.budgets.random)} note="真正评分的点数" width={1010} color={C.inkDim} />
            <Row name="子空间预算" value={String(M.synth.budgets.cherry)} note="6,000 + 3,000 + 1,000" width={1010} color={C.cyan} />
            <Row name="比较器预算" value={String(M.synth.budgets.cmp)} note="200 对样本 + 一次整体" width={1010} color={C.violet} />
            <Row name="组合预算" value={String(M.synth.budgets.comb)} note="八块 × 二十点，再挖完" width={1010} color={C.amber} />
            <Row name="末体积" value={fmt4(M.synth.cherryVolumes[2])} note="小于 0.01 阈值" width={1010} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            省评估不等于省钱：比较器几乎不评估，但拟合与排序也要算时间。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>迁移这组，<br />诚实地失败。</Body>
          <Body style={{ marginTop: 24 }}>
            真实任务上，最好的架构只比零基线好万分之三，全距不到百分之一；长回看家族反而最差。这一组的检查写成「不优化」而不是「赢」。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.coral}>全距 &lt; 1.5%</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>好于零基线 &lt; 0.001</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="真实迁移：五项都不支持「搜索有效」" accent={C.coral}>
            <Row name="零基线" value={fmt4(M.real.zeroMae)} note="永远预测零" width={1010} color={C.cyan} />
            <Row name="最好" value={fmt4(M.real.best.mae)} note={M.real.best.name + "，检验误差最低"} width={1010} color={C.violet} />
            <Row name="最差" value={fmt4(M.real.worst.mae)} note={M.real.worst.name + "，长回看一族"} width={1010} color={C.coral} />
            <Row name="短家族最好" value={fmt4(M.real.family5Best)} note="回看 5 天" width={1010} color={C.cyan} />
            <Row name="长家族最好" value={fmt4(M.real.family20Best)} note="回看 20 天，比短家族差" width={1010} color={C.amber} />
            <Row name="全距" value={M.real.spreadPct.toFixed(4) + "%"} note="小于 1.5% 的阈值" width={1010} color={C.coral} />
          </Card>
        </div>
        <Foot>三十三项全绿，包括那些证明「没赢」的项。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
