import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, KV, PAD, Pages, Row, Scene, SceneHead, checkGroups, fmtPct, pagesOf } from "../shared";
import { ClassBars, HitsBars, RegretBins, CorrPanel } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 520 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五组，<br />{M.checks.length} 项，<br />{M.seconds.toFixed(1)} 秒。</Body>
          <Body style={{ marginTop: 22 }}>
            全部通过。下面按组看：先看主线命中率，再看相关与命中的矛盾，最后看代价与分行业。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 660, top: 292, width: 1180 }}>
          <Card label="五组检查：按组成簇" accent={C.cyan}>
            <CheckGrid cell={30} />
          </Card>
          <div style={{ display: "flex", gap: 24, marginTop: 18 }}>
            {checkGroups().map((g) => (
              <KV key={g.g} k={g.g} v={g.pass + "/" + g.total} color={C.cyan} size={FT.body} />
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四条命中率，<br />一条比一条低。</Body>
          <Body style={{ marginTop: 22 }}>
            元学习 {fmtPct(M.hits.stats, 2)}，比行业类均值低 {Math.abs(M.hits.gain * 100).toFixed(2)} 个百分点，比恒选朴素低 {((M.hits.naive - M.hits.stats) * 100).toFixed(2)} 个百分点。换成六十四维表征，再低 {((M.hits.stats - M.hits.ts2vec) * 100).toFixed(2)} 个百分点。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.coral}>恒选 {fmtPct(M.hits.naive, 2)}</Chip>
            <Chip color={C.violet}>类均值 {fmtPct(M.hits.classMean, 2)}</Chip>
            <Chip color={C.cyan}>元学习 {fmtPct(M.hits.stats, 2)}</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 290, width: 1080 }}>
          <Card label="Hit@1：选中的是不是真值冠军" accent={C.coral}>
            <HitsBars w={1000} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            计划里写的增益是 +0.10；实测 {M.hits.gain.toFixed(4)}。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>预测准，<br />选择笨。</Body>
          <Body style={{ marginTop: 22 }}>
            把 300 × 10 的分数全部摊开，预测误差和真实误差的相关系数是 {M.corr.toFixed(4)}。但冠军和亚军的差距太小，千分之几的预测误差就足以换掉第一名。打分是回归问题，选冠军是排序问题。
          </Body>
          <div style={{ marginTop: 22, display: "flex" }}>
            <KV k="相关" v={M.corr.toFixed(4)} color={C.cyan} />
            <KV k="平均名次" v={M.hits.avgRank.toFixed(4)} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 288, width: 1060 }}>
          <Card label="预测 vs 真实：几乎一条直线" accent={C.cyan}>
            <CorrPanel w={1000} h={330} />
          </Card>
          <div style={{ display: "flex", gap: 30, marginTop: 18 }}>
            <KV k="元学习测试 MAE" v={M.testMae.meta.toFixed(4)} color={C.violet} />
            <KV k="冠军测试 MAE" v={M.testMae.truth.toFixed(4)} color={C.cyan} />
            <KV k="只差" v={M.testMae.delta.toFixed(4)} color={C.amber} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>选错冠军，<br />很少真花钱。</Body>
          <Body style={{ marginTop: 22 }}>
            {M.regret.wrong} 次没选对，平均多花 {M.regret.mean.toFixed(4)}，最多的一次多花 {M.regret.max.toFixed(4)}。对比一遍误差量级：朴素模型的平均验证 MAE 是 {M.candidates[0].validMae.toFixed(3)}，后悔值不到它的百分之一。
          </Body>
          <div style={{ marginTop: 22, display: "flex" }}>
            <KV k="平均后悔" v={M.regret.mean.toFixed(4)} color={C.violet} />
            <KV k="最大后悔" v={M.regret.max.toFixed(4)} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 288, width: 1060 }}>
          <Card label="后悔值分布：绝大多数任务几乎为 0" accent={C.violet}>
            <RegretBins w={1000} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>行业之间<br />差一倍。</Body>
          <Body style={{ marginTop: 22 }}>
            软件和信息技术服务业二十八只、{fmtPct(M.classHit[1].hit, 1)}；计算机通信电子三十五只、{fmtPct(M.classHit[0].hit, 1)}；医药制造业十一只、{fmtPct(M.classHit.find((c) => c.name.startsWith("C27"))!.hit, 1)}。样本又小，别过度解读，但它说明选模型的难度本身不均匀。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 288, width: 1120 }}>
          <Card label="分行业命中率：样本最多的八类" accent={C.amber}>
            <ClassBars w={1040} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
