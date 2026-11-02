import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, fmtInt, fmtPct, pagesOf } from "../shared";
import { CostLadder, EvalGrid, GapRuler, SplitBar } from "../figs";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>二十六项，<br />五组。</Body>
          <Body style={{ marginTop: 22 }}>
            数据四项管地基：样本、切分、阶段点、行数。遗传算法六项：黄金值、精英、交叉、变异、随机流、覆盖率。学习曲线五项：黄金值、外推、截断、护栏、采样。演示六项，预算五项。全过，{M.seconds.toFixed(1)} 秒。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            数据歪了，上面的读数一个都不能用 —— 所以先看数据
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 282, width: 1130 }}>
          <Card label="检查清单：按组成簇，一格一项" accent={C.cyan}>
            <CheckGrid cell={30} />
            <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              数据 4 · 遗传 6 · 曲线 5 · 演示 6 · 预算 5 = {M.checks.length} 项
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先看数据，<br />再看读数。</Body>
          <Body style={{ marginTop: 22 }}>
            二十只股票，每只两千四百根以上日线；训练段一千六百八十六到一千七百零五根，验证段四百八十三到四百八十四根，测试段两百四十二根。阶段点 {M.data.stages.map((n) => fmtInt(n)).join("、")}，日期无重复，切点按日历写死。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>20 只</Chip>
            <Chip color={C.violet}>三段切分</Chip>
            <Chip color={C.amber}>无重复日期</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 282, width: 1130 }}>
          <Card label="数据组：四项全过" accent={C.cyan}>
            <SplitBar w={1060} />
            <div style={{ display: "flex", gap: 26, marginTop: 24 }}>
              <KV k="根数" v={M.data.bars[0] + "–" + M.data.bars[1]} color={C.cyan} />
              <KV k="训练" v={M.data.split.train[0] + "–" + M.data.split.train[1]} color={C.violet} />
              <KV k="验证" v={M.data.split.valid[0] + "–" + M.data.split.valid[1]} color={C.amber} />
              <KV k="测试" v={String(M.data.split.test[1])} color={C.coral} />
              <KV k="切点" v={M.data.cut.trainEnd} color={C.inkFaint} />
            </div>
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1060 }}>
            验证段 483–484 根，测试段 242 根 —— 每天一根日线，逐只股票核对过，切片不含未来数据。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 282, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>花了两百次<br />训练。</Body>
          <Body style={{ marginTop: 22 }}>
            每只股票两百次评估，去重后仍是两百次训练，缓存一次都没命中。因为二十个个体的初始种群、十代下来，基因在界内几乎不重复。和穷举十次比，多花二十倍；选出的候选和穷举完全一样，二十只全对。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            两百除以六百四十八，是它在七维网格上的占比
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 280, width: 1130 }}>
          <Card label={"评估 " + M.ga.evals + " 次 = 训练 " + M.ga.unique + " 次"} accent={C.coral}>
            <EvalGrid cols={20} cell={22} />
            <div style={{ display: "flex", gap: 26, marginTop: 22 }}>
              <KV k="答案一致" v={M.ga.same + " / " + M.data.stocks} color={C.cyan} />
              <KV k="网格占比" v={fmt2(M.budget.gridShare) + "%"} color={C.amber} />
              <KV k="相对穷举" v={"20×"} color={C.coral} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 282, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>线性外推<br />系统性低估。</Body>
          <Body style={{ marginTop: 22 }}>
            平均绝对差 {fmt4(M.demo.lin.errMean)}，最大 {fmt2(M.demo.lin.errMax, 1)}；Top-1 只有 {fmtPct(M.demo.lin.acc1, 0)}，Top-2 全等 {M.demo.lin.acc2n} 只，平均交集 {fmt2(M.demo.lin.overlap, 1)} 个名额。这不是实现错误，是方法本身的偏：凸曲线的割线永远高估下降幅度。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.coral}>误差 4.76</Chip>
            <Chip color={C.coral}>最大 219</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 280, width: 1130 }}>
          <Card label="演示组：线性外推的四项读数" accent={C.coral}>
            <Row name="平均绝对差" value={fmt4(M.demo.lin.errMean)} note={"最大 " + fmt2(M.demo.lin.errMax, 1) + "，出现在拟合型候选上"} width={1060} color={C.coral} />
            <Row name="Top-1 命中" value={fmtPct(M.demo.lin.acc1, 0)} note={"二十只里挑对 " + Math.round(M.demo.lin.acc1 * M.data.stocks) + " 只"} width={1060} color={C.ink} />
            <Row name="Top-2 全等" value={M.demo.lin.acc2n + " 只"} note="两个名额的集合完全一样" width={1060} color={C.ink} />
            <Row name="平均交集" value={fmt2(M.demo.lin.overlap, 1)} note="宽松口径，全对是 1.0" width={1060} color={C.ink} />
            <Row name="单调对" value={M.demo.mono + " / " + M.demo.monoOf} note="三点 MAE 非递增的比例，八成" width={1060} color={C.inkDim} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 282, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>换成幂律，<br />误差压到三分之一。</Body>
          <Body style={{ marginTop: 22 }}>
            误差 {fmt4(M.demo.pow.errMean)}，比线性小 {fmt2(M.demo.lin.errMean / M.demo.pow.errMean)} 倍；最大差 {fmt2(M.demo.pow.errMax, 1)}。但 Top-1 只到 {fmtPct(M.demo.pow.acc1, 0)}，Top-2 全等 {M.demo.pow.acc2n} 只，交集 {fmt2(M.demo.pow.overlap, 1)}。和全量的 100% 比，差七十个点。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            三点都在下降段，幂律把下降段延长，看不见平台
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 280, width: 1130 }}>
          <Card label="同一个演示，换成幂律假设" accent={C.violet}>
            <Row name="平均绝对差" value={fmt4(M.demo.pow.errMean)} note={"线性 " + fmt4(M.demo.lin.errMean) + "，压掉 " + fmtPct(1 - M.demo.pow.errMean / M.demo.lin.errMean, 0)} width={1060} color={C.violet} />
            <Row name="Top-1 命中" value={fmtPct(M.demo.pow.acc1, 0)} note={"全量 " + fmtPct(M.demo.acc1Full, 0) + "，差 " + Math.round((M.demo.acc1Full - M.demo.pow.acc1) * 100) + " 个点"} width={1060} color={C.cyan} />
            <Row name="Top-2 全等" value={M.demo.pow.acc2n + " 只"} note="放宽到两个名额，恢复 3 只" width={1060} color={C.ink} />
            <Row name="平均交集" value={fmt2(M.demo.pow.overlap, 1)} note={"线性 " + fmt2(M.demo.lin.overlap, 1)} width={1060} color={C.ink} />
            <Row name="平台段" value="843 → 1,686" note="真实 MAE 几乎没动，外推读成继续下降" width={1060} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 282, width: 590 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>最后看<br />那个判据。</Body>
          <Body style={{ marginTop: 22 }}>
            冠军和亚军平均只差 {fmt4(M.demo.gap)}；幂律外推误差 {fmt4(M.demo.pow.errMean)}，是它的 {fmt2(M.demo.ratio)} 倍。误差比信号大二十倍，排序不可能恢复。这条结论可以推广：省下来的数据，只在候选差距大的空间里换得到排序。
          </Body>
          <div style={{ marginTop: 20, display: "flex", gap: 22 }}>
            <KV k="数据比" v={fmtPct(M.budget.dataRatio, 1)} color={C.amber} />
            <KV k="网格占比" v={fmt2(M.budget.gridShare) + "%"} color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 280, width: 1130 }}>
          <Card label="判据：误差 ÷ 排序差距" accent={C.cyan}>
            <GapRuler w={1060} />
          </Card>
          <div style={{ marginTop: 18 }}>
            <Card label="预算组：两笔省下的账" accent={C.amber}>
              <CostLadder w={1020} at={0} />
            </Card>
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
