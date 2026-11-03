import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>会打分，<br />不等于会挑。</Body>
          <Body style={{ marginTop: 26, fontFamily: FONT.serif, fontSize: FT.lead, color: C.inkDim, lineHeight: 1.75 }}>
            预测误差和真实误差相关 {M.corr.toFixed(4)}；命中率只有 {fmtPct(M.hits.stats, 2)}；选错的平均代价 {M.regret.mean.toFixed(4)}。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 800, top: 296, width: 1040 }}>
          <Card label="三句话记住这一集" accent={C.cyan}>
            <Row name="回归" value={M.corr.toFixed(4)} note="预测几乎复刻真实误差" width={980} color={C.cyan} />
            <Row name="排序" value={fmtPct(M.hits.stats, 2)} note="但还是选不中冠军" width={980} color={C.coral} />
            <Row name="代价" value={M.regret.mean.toFixed(4)} note="选错通常不贵，除非贵的那次很贵" width={980} color={C.violet} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>数字都在<br />这一组里。</Body>
          <Body style={{ marginTop: 22 }}>
            三个判据、两个负结果、一条边界。全部来自同一份证据 JSON，同一个提交，同一条命令。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 288, width: 1060 }}>
          <Card label="本集读数" accent={C.violet}>
            <Row name="Hit@1" value={fmtPct(M.hits.stats, 2)} note={"留出集 " + Math.round(M.hits.holdStats * M.hits.holdN) + "/" + M.hits.holdN} width={1000} color={C.cyan} />
            <Row name="类均值" value={fmtPct(M.hits.classMean, 2)} note={"恒选朴素 " + fmtPct(M.hits.naive, 2)} width={1000} color={C.amber} />
            <Row name="后悔" value={M.regret.mean.toFixed(4)} note={"最大 " + M.regret.max.toFixed(4) + "，选错 " + M.regret.wrong + " 次"} width={1000} color={C.violet} />
            <Row name="检查" value={M.checks.length + "/" + M.checks.length} note={"耗时 " + M.seconds.toFixed(1) + " 秒"} width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 28 }}>
            <Chip color={C.cyan}>ts-base {M.meta.commits.tsBase.slice(0, 7)}</Chip>
            <Chip color={C.violet}>ts-admin {M.meta.commits.tsAdmin.slice(0, 7)}</Chip>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>下一集：<br />集成。</Body>
          <Body style={{ marginTop: 22 }}>
            既然选不准，那就别选。把十个候选平均起来，误差往往比冠军还低。但加权是另一回事，调得不好反而更差。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 290, width: 1060 }}>
          <Card label={"第 " + M.meta.next.id + " 集 · 第 " + M.meta.chapter + " 章"} accent={C.cyan}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.3, marginBottom: 18 }}>{M.meta.next.title}</div>
            <Row name="时长" value={M.meta.next.minutes + " 分钟"} note="从选择问题转向组合问题" width={1000} color={C.cyan} />
            <Row name="核心" value="平均就赢" note="等权集成几乎总是不亏" width={1000} color={C.violet} />
            <Row name="陷阱" value="乱调权重" note="用验证误差调权，过拟合验证集" width={1000} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>本集完。</Body>
          <Body style={{ marginTop: 24 }}>
            代码在 ts-base，数据在 ts-admin，视频能重跑。第 {M.meta.next.id} 集见。
          </Body>
          <div style={{ marginTop: 26, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>{M.checks.length} 项检查</Chip>
            <Chip color={C.violet}>{M.fits.toLocaleString("en-US")} 次拟合</Chip>
            <Chip color={C.amber}>{M.seconds.toFixed(1)} 秒</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 840, top: 300, width: 1000 }}>
          <Card label="交付" accent={C.cyan}>
            <Row name="ts-base" value={M.meta.commits.tsBase.slice(0, 7)} note="算法库 + 证据程序 + 黄金用例" width={940} color={C.cyan} />
            <Row name="ts-admin" value={M.meta.commits.tsAdmin.slice(0, 7)} note="导出数据与清单" width={940} color={C.violet} />
            <Row name="重跑" value="一条命令" note="cabal run re24-ch06-meta-evidence" width={940} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
