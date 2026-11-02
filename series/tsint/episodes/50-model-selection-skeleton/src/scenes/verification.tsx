import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Bars, Body, Card, CheckGrid, Chip, K, KV, PAD, Pages, Row, Scene, SceneHead, checkGroups, fmtInt, fmtPct, pagesOf } from "../shared";
import { GridDots, PairBars } from "../figs";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>二十六项检查，<br />六组。</Body>
          <Body style={{ marginTop: 24 }}>
            数据、指标、池子、预筛、网格、演示，每一组都对着一个可以独立验证的说法。全跑完 {M.seconds.toFixed(1)} 秒，{M.checks.length} 项全过。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            {checkGroups().map((g) => (
              <Chip key={g.g} color={C.cyan}>{g.pass}/{g.total}</Chip>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 296, width: 1080 }}>
          <Card label="26 项检查，按组排" accent={C.cyan}>
            <CheckGrid cell={26} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先验数据，<br />再验指标。</Body>
          <Body style={{ marginTop: 24 }}>
            数据组的四条：根数、切分点数、验证段长度、行数与重复日期。指标组钉住五个黄金值，另外两条：RMSE 必须大于 MAE，MAPE 必须跳过近零样本。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 296, width: 1120 }}>
          <Card label="数据 · 4 项" accent={C.cyan} style={{ marginBottom: 18 }}>
            <Row name="根数" value={M.data.bars[0] + "–" + M.data.bars[1]} note="每只 2,400 根以上" width={1030} color={C.cyan} />
            <Row name="切分" value={M.data.split.train[0] + " / " + M.data.split.valid[0] + " / " + M.data.split.test[0]} note="训练 / 验证 / 测试" width={1030} color={C.violet} />
          </Card>
          <Card label="指标 · 5 项" accent={C.violet}>
            <Row name="黄金值" value="0.5 · 0.4167 · 0.6455" note="MAE · MSE · RMSE" width={1030} color={C.violet} />
            <Row name="RMSE > MAE" value="0.6455 > 0.5" note="平方放大残差的性质" width={1030} color={C.amber} />
            <Row name="Acc@3" value={M.metrics.acc3.toFixed(4)} note="交集两个 / 三" width={1030} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>池子抬了上限，<br />没抬命中。</Body>
          <Body style={{ marginTop: 24 }}>
            覆盖是上限：池子里有没有真值最优。命中是实际拿到：验证集排序的第一名对不对。两条线分开看，才知道问题出在池子还是策略。
          </Body>
          <K style={{ display: "block", marginTop: 16 }}>左：覆盖率 · 右：Hit@1</K>
        </div>
        <div style={{ position: "absolute", left: 660, top: 290, width: 590 }}>
          <Card label="覆盖率（上限）" accent={C.violet}>
            <PairBars width={540} colors={[C.cyan, C.violet]} rows={[
              { label: "池 3", a: M.coverage.pool3, b: M.coverage.pool3, aText: fmtPct(M.coverage.pool3, 0), bText: M.coverage.pool3n + "/20" },
            ]} />
            <div style={{ marginTop: 10 }}>
              <Bars width={540} rowH={52} max={1} labelW={104} items={[
                { label: "池 3", value: M.coverage.pool3, text: fmtPct(M.coverage.pool3, 0), color: C.cyan },
                { label: "池 5", value: M.coverage.pool5, text: fmtPct(M.coverage.pool5, 0), color: C.violet },
                { label: "全池", value: M.coverage.all, text: "100%", color: C.amber },
              ]} />
            </div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1290, top: 290, width: 560 }}>
          <Card label="Hit@1（实际命中）" accent={C.coral}>
            <Bars width={510} rowH={52} max={1} labelW={104} items={[
              { label: "池 3", value: M.hit.pool3, text: fmtPct(M.hit.pool3, 0), color: C.cyan },
              { label: "池 5", value: M.hit.pool5, text: fmtPct(M.hit.pool5, 0), color: C.violet },
              { label: "全池", value: M.hit.full, text: fmtPct(M.hit.full, 0), color: C.amber },
            ]} />
            <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              Hit@2 {fmtPct(M.hit.hit2, 0)} · AvgRank {M.hit.avgRank.toFixed(2)}
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>省三成五的算力，<br />一分命中没掉。</Body>
          <Body style={{ marginTop: 24 }}>
            预筛组的核心：全池遍历和两阶段预筛，在二十只股票上的 Hit@1 都是 {(M.hit.full * 100).toFixed(0)}%。省下 {fmtPct(M.prefilter.saved, 1)} 的评测点，Top-4 召回了 {fmtPct(M.prefilter.top4Recall, 0)} 的真值最优。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="评测点数：全池 vs 预筛" accent={C.amber}>
            <Bars width={1040} rowH={64} max={M.prefilter.evalsFull} labelW={130} items={[
              { label: "全池遍历", value: M.prefilter.evalsFull, text: fmtInt(M.prefilter.evalsFull), color: C.inkFaint },
              { label: "两阶段预筛", value: M.prefilter.evalsPre, text: fmtInt(M.prefilter.evalsPre), color: C.amber },
            ]} />
            <div style={{ display: "flex", gap: 28, marginTop: 18 }}>
              <KV k="省下" v={fmtPct(M.prefilter.saved, 1)} color={C.amber} size={FT.lead} />
              <KV k="命中" v={fmtPct(M.hit.full, 0) + " = " + fmtPct(M.hit.pre, 0)} color={C.cyan} size={FT.lead} />
              <KV k="Top-4 召回" v={fmtPct(M.prefilter.top4Recall, 0)} color={C.violet} size={FT.lead} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>网格和演示，<br />验的是边界。</Body>
          <Body style={{ marginTop: 24 }}>
            网格组：全组合 {fmtInt(M.grid.full)} 个，锁后 {M.grid.locked} 个；拟合失败要丢掉不能抛异常；AIC 随残差单调。演示组放两个反例：指标选错会选错模型；拿真值排序当策略，平均名次恒为一。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 290, width: 1100 }}>
          <Card label={"组合空间 " + M.grid.full + " → " + M.grid.locked} accent={C.violet}>
            <GridDots cols={27} rows={12} cell={13} lit={40} />
          </Card>
          <Card label="演示组的两个自洽性检查" accent={C.cyan} style={{ marginTop: 18 }}>
            <Row name="指标反例" value="排序翻转" note="指标不同，冠军不同" width={1010} color={C.coral} />
            <Row name="自洽性" value="AvgRank = 1" note="用真值排序时必然命中" width={1010} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
