import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";
import { FoldBars } from "../figs";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 520 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>{M.checks.length} 项，<br />全部通过。</Body>
          <Body style={{ marginTop: 22 }}>
            五组检查，覆盖数据、元学习、交叉验证、表征和演示。每一项都是实测陈述：不成立就失败，不会静默通过。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 660, top: 292, width: 1180 }}>
          <Card label="五组：从构造到判据" accent={C.cyan}>
            <CheckGrid cell={30} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            一条命令重跑：先跑 3,000 次拟合并计时，再跑检查，最后输出读数 JSON。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先钉契约，<br />再谈结果。</Body>
          <Body style={{ marginTop: 22 }}>
            两个库各六个黄金用例：argmin 选对、恒选朴素命中三分之二、四十条合成数据全对、五折互不重叠、类均值基线回落到常数。这些用例不依赖真实数据，改坏了立刻红。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 288, width: 1080 }}>
          <Card label="契约检查：可复现的最小事实" accent={C.violet}>
            <Row name="selectModel" value="argmin" note="[0,1,0] 里最低的索引 0 被选中" width={1000} />
            <Row name="恒选朴素" value="2/3" note="3 个任务里 2 个冠军就是朴素" width={1000} color={C.violet} />
            <Row name="合成数据" value="40/40" note="线性可分的合成任务全部选对" width={1000} color={C.cyan} />
            <Row name="五折" value="不重叠" note="每只股票恰好出现在验证集一次" width={1000} color={C.amber} />
            <Row name="类均值" value="回落常数" note="十维标签完全相同，预测就是常数" width={1000} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>数据先说清楚。</Body>
          <Body style={{ marginTop: 22 }}>
            {M.data.stocks} 只股票，{M.data.bars[0]}–{M.data.bars[1]} 根 K 线，{M.data.industries} 个行业。五折命中率从 {fmtPct(Math.min(...M.folds.stats), 1)} 到 {fmtPct(Math.max(...M.folds.stats), 1)}，均值 {fmtPct(M.hits.stats, 2)}。折与折之间波动有，但没有某一折崩掉。
          </Body>
          <div style={{ marginTop: 22, display: "flex" }}>
            <KV k="折数" v="5" color={C.cyan} />
            <KV k="均值" v={fmtPct(M.hits.stats, 2)} color={C.violet} />
            <KV k="极差" v={((Math.max(...M.folds.stats) - Math.min(...M.folds.stats)) * 100).toFixed(1) + "pp"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 296, width: 1120 }}>
          <Card label="五折命中率：按折" accent={C.cyan}>
            <FoldBars w={1000} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            每折留出 {Math.ceil(M.data.stocks / 5)} 只任务；同一套元学习器，不同的测试任务。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>表征保住了，<br />但没救回选择。</Body>
          <Body style={{ marginTop: 22 }}>
            六十四维表征命中 {fmtPct(M.hits.ts2vec, 2)}，比四维统计特征低 {Math.abs(M.ts2vec.gap * 100).toFixed(2)} 个百分点。编码器输出范数为 1、同参数两次编码逐位相等、季节相关性 {M.ts2vec.cosPeriod.toFixed(4)}。四项检查全过，但命中率没动。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>dim {M.ts2vec.dim}</Chip>
            <Chip color={C.violet}>cos {M.ts2vec.cosPeriod.toFixed(4)}</Chip>
            <Chip color={C.coral}>gap {M.ts2vec.gap.toFixed(4)}</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 288, width: 1060 }}>
          <Card label="演示组：留出、相关、耗时" accent={C.cyan}>
            <Row name="留出任务" value={M.hits.holdN + " 只"} note="完全没参与训练和交叉验证" width={1000} />
            <Row name="元学习命中" value={Math.round(M.hits.holdStats * M.hits.holdN) + "/" + M.hits.holdN} note="留出集上的 Hit@1" width={1000} color={C.violet} />
            <Row name="类均值命中" value={Math.round(M.hits.holdClass * M.hits.holdN) + "/" + M.hits.holdN} note="同一留出集上的基线" width={1000} color={C.coral} />
            <Row name="预测与真实相关" value={M.corr.toFixed(4)} note="300 × 10 的分数摊开算 Pearson" width={1000} color={C.cyan} />
            <Row name="全流程耗时" value={M.seconds.toFixed(1) + "s"} note={M.fits.toLocaleString("en-US") + " 次拟合 + 300 次编码"} width={1000} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>留出集：<br />差四只。</Body>
          <Body style={{ marginTop: 22 }}>
            三十只完全没见过的股票，元学习选中 {Math.round(M.hits.holdStats * M.hits.holdN)} 只，类均值基线选中 {Math.round(M.hits.holdClass * M.hits.holdN)} 只。差 {Math.round((M.hits.holdClass - M.hits.holdStats) * M.hits.holdN)} 只，方向和五折一致：元学习没有超过最简单的行业均值。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="留出集：30 只里的命中数" accent={C.coral}>
            <Row name="元学习" value={Math.round(M.hits.holdStats * M.hits.holdN) + " / 30"} note={fmtPct(M.hits.holdStats, 2)} width={980} color={C.cyan} />
            <Row name="注：类均值" value={Math.round(M.hits.holdClass * M.hits.holdN) + " / 30"} note={fmtPct(M.hits.holdClass, 2)} width={980} color={C.coral} />
            <Row name="多数类基线" value="—" note="按行业最常见的冠军猜，不算特征" width={980} color={C.inkDim} />
            <Row name="结论" value="−4 只" note="留出集重复了交叉验证的负结果" width={980} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            三十只的样本量只能做方向性对照，不能做显著性判断。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
