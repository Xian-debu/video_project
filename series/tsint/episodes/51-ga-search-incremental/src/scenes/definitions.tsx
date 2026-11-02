import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Formula, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, fmtInt, fmtPct, pagesOf } from "../shared";
import { SplitBar } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>一，搜索<br />空间多大。</Body>
          <Body style={{ marginTop: 24 }}>
            所有超参取值个数的乘积。这一集的候选是十个现成模型，不是网格，所以搜索空间就是十；上一集的七维网格是六百四十八。后面说遗传算法只在搜不完的空间里划算，指的就是这两种规模的差别。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>本集 10</Chip>
            <Chip color={C.amber}>上集 648</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 292, width: 1060 }}>
          <Card label="定义一 · 空间大小" accent={C.cyan}>
            <Formula size={56} note="N = 每个超参取值个数之积">
              N = ∏ᵢ nᵢ
            </Formula>
            <div style={{ marginTop: 26 }}>
              <Row name="十个候选" value="10" note="穷举十次就完了，没有省的空间" width={1000} color={C.cyan} />
              <Row name="七维网格" value="648" note="穷举六百四十八次，优势只能出现在这里" width={1000} color={C.amber} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>二，评估<br />预算。</Body>
          <Body style={{ marginTop: 24 }}>
            一次评估是拿一个基因组去打分，一次训练是真正拟合一遍模型，两者不是一回事。有缓存时同一个基因只训练一次。这一集的缓存键就是整个基因向量，同一基因在十代里可能被反复抽到。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            覆盖率 = 去重后的训练次数，每代记一次，取末值
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 292, width: 1060 }}>
          <Card label="定义二 · 评估与训练" accent={C.violet}>
            <Row name="一次评估" value="打分" note="一个基因组喂给适应度函数" width={1000} color={C.cyan} />
            <Row name="一次训练" value="拟合" note="扫训练段，得到验证段预测" width={1000} color={C.violet} />
            <Row name="缓存键" value="整个基因" note="同基因复用，不重复训练" width={1000} color={C.amber} />
            <Row name="覆盖率" value="去重训练数" note="判断 GA 值不值的直接依据" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="本集评估" v={String(M.ga.evals)} color={C.cyan} />
            <KV k="去重训练" v={String(M.ga.unique)} color={C.coral} />
            <KV k="穷举对照" v={String(M.data.candidates)} color={C.inkDim} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三，阶段点<br />选在哪。</Body>
          <Body style={{ marginTop: 22 }}>
            阶段点是训练量的采样位置：取八分之一、四分之一、二分之一，三个点单调递增。三次部分拟合接触的数据加起来是八分之七，不是一半。
          </Body>
          <div style={{ marginTop: 20 }}>
            <Formula size={44} color={C.cyan} note="理论 0.875，实测 0.874，差在取整">
              1/8 + 1/4 + 1/2 = 7/8
            </Formula>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 290, width: 1090 }}>
          <Card label={"阶段点：" + M.data.stages.map((n) => fmtInt(n)).join(" / ")} accent={C.amber}>
            <SplitBar w={1030} />
            <div style={{ display: "flex", gap: 24, marginTop: 22 }}>
              <KV k="数据比" v={fmtPct(M.budget.dataRatio, 1)} color={C.amber} />
              <KV k="部分拟合" v={fmtInt(M.budget.fitsInc) + " 次"} color={C.cyan} />
              <KV k="全量拟合" v={fmtInt(M.budget.fitsFull) + " 次"} color={C.violet} />
            </div>
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1030 }}>
            这个数字决定了省钱的上限：三点部分拟合已经碰过 87.4% 的数据，剩下能省的只有 12.6% 的读取量，以及外推带来的排序风险。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四，外推<br />怎么推。</Body>
          <Body style={{ marginTop: 22 }}>
            线性外推假设误差随训练量线性下降，两点定线、三点做最小二乘。真实的学习曲线是凸的，凸曲线的割线永远高估下降幅度，所以线性外推会系统性低估误差。幂律换一个假设。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            幂律取对数后还是直线，拟合方式一样，但形状对上了：凸、递减、有平台
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1090 }}>
          <Card label="两种假设，一条曲线" accent={C.coral}>
            <Formula size={46} color={C.coral} note="三点最小二乘，斜率恒定">
              m(n) = a + b · n
            </Formula>
            <div style={{ height: 22 }} />
            <Formula size={46} color={C.violet} note="取对数后仍是直线：log m = log a − b · log n">
              m(n) = a · n⁻ᵇ
            </Formula>
            <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              黄金值：三点 (10, 1.1) (20, 1.0) (30, 0.9) → 斜率 {fmt2(M.curve.slope, 3)}、截距 {fmt2(M.curve.intercept, 2)}、外推到 60 得 {fmt2(M.curve.extrap60, 1)}。
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 288, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五，误差和<br />排序分开量。</Body>
          <Body style={{ marginTop: 22 }}>
            外推误差是外推 MAE 与全量验证 MAE 的平均绝对差，比的是 MAE，不是排序。排序对不对要另外几个量：Top-1 命中、Top-2 全等、平均交集，最后是冠军与亚军的差距 —— 那是信号的尺度。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            误差比差距大多少倍，就是排序能不能恢复的判据
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 288, width: 1090 }}>
          <Card label="定义五 · 五个读数" accent={C.violet}>
            <Row name="外推误差" value={fmt4(M.demo.pow.errMean)} note="幂律外推 MAE 与全量 MAE 的平均差" width={1030} color={C.violet} />
            <Row name="Top-1 命中" value={fmtPct(M.demo.pow.acc1, 0)} note={"二十只里挑对 " + M.demo.pow.acc1 * M.data.stocks + " 只"} width={1030} color={C.cyan} />
            <Row name="Top-2 全等" value={M.demo.pow.acc2n + " 只"} note="两个名额的集合完全一样" width={1030} color={C.amber} />
            <Row name="平均交集" value={fmt2(M.demo.pow.overlap, 1) + " 个"} note="宽松口径：两个名额里重合几个" width={1030} color={C.coral} />
            <Row name="冠军 − 亚军" value={fmt4(M.demo.gap)} note="验证 MAE 差距，排序要恢复的量" width={1030} color={C.ink} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
