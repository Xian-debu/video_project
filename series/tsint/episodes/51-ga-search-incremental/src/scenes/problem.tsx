import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, fmtInt, pagesOf } from "../shared";
import { SplitBar } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两笔账，<br />一起算。</Body>
          <Body style={{ marginTop: 24 }}>
            上一集的结论是池子决定天花板。池子越大，代价也越大：十个候选乘二十只股票，是两百次整段拟合；每次都要扫过一千六百多根训练样本。第一笔账是拟合次数，第二笔是每次拟合本身贵不贵。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这一集只算一次验证段的打分，不训练、不调参
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 290, width: 1090 }}>
          <Card label="一次验证段打分的账单" accent={C.coral}>
            <Row name="候选 × 股票" value={"10 × 20"} note="两百次整段拟合，才是真值的价" width={1030} color={C.coral} />
            <Row name="每次拟合" value={fmtInt(M.data.split.train[1]) + " 行"} note="训练段一千六百八十六到一千七百零五根" width={1030} color={C.cyan} />
            <Row name="换成网格" value={"648 次"} note="七维超参，一轮网格等于一轮完整训练" width={1030} color={C.amber} />
            <Row name="评分段" value={M.data.split.valid[1] + " 点"} note="验证段四百八十三到四百八十四根" width={1030} color={C.violet} />
          </Card>
          <div style={{ marginTop: 20 }}>
            <SplitBar w={1030} stages={false} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.32 }}>两条路线，<br />方向相反。</Body>
          <Body style={{ marginTop: 24 }}>
            一条压缩搜索空间：少试几个组合。一条压缩每次拟合：用部分数据先排序。前者让好的组合多繁殖，后者把误差往全量推。两条路线依赖同一个前提：省下来的部分不改变排序。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Chip color={C.coral}>少试几个</Chip>
            <Chip color={C.violet}>少拟合几次</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 296, width: 1060 }}>
          <Card label="方向相反，前提相同" accent={C.violet}>
            <Row name="压缩空间" value="遗传算法" note="在组合空间里跳着找，不逐个试" width={1000} color={C.coral} />
            <Row name="压缩拟合" value="曲线外推" note="三点小样本拟合，把误差推到全量" width={1000} color={C.violet} />
            <Row name="前提" value="排序不变" note="省钱可以，换答案不行" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1000 }}>
            这个前提成立不成立，只能量。这一集的全部工作，就是量这件事：先各写一个实现，再在同样二十只股票、同样十个候选上跑一遍。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>先把搜索问题<br />翻成基因。</Body>
          <Body style={{ marginTop: 24 }}>
            七维超参就是七段基因，每段带上下界；一个组合叫个体，一群个体叫种群。个体好坏由适应度打分，这里的适应度是验证段 MAE 的相反数。每代做三件事：选择、交叉、变异，再加精英保留。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.coral}>选择</Chip>
            <Chip color={C.coral}>交叉</Chip>
            <Chip color={C.coral}>变异</Chip>
            <Chip color={C.cyan}>精英保留</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 292, width: 1040 }}>
          <Card label="六个词，一件事" accent={C.coral}>
            <Row name="基因" value="七段整数" note="每段有上下界，越界就夹回去" width={980} color={C.coral} />
            <Row name="种群" value={M.ga.evals / 10 + " 个个体"} note="两百次评估 ÷ 十代" width={980} color={C.cyan} />
            <Row name="适应度" value="−valid MAE" note="越小越好，取反就变成越大越好" width={980} color={C.violet} />
            <Row name="选择" value="锦标赛 3 选 1" note="随机抓三个，留最好的" width={980} color={C.amber} />
            <Row name="交叉 / 变异" value="0.8 / 0.1" note="换尾段；按小概率重抽一位" width={980} color={C.inkDim} />
            <Row name="精英" value="2 个" note="最好的两个原样进下一代" width={980} color={C.inkDim} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 650 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>参数固定，<br />结果可复现。</Body>
          <Body style={{ marginTop: 24 }}>
            种群二十、十代、精英两个；锦标赛规模三，交叉率零点八，变异率零点一；种子固定，序列就在那里。二十乘十，每只股票两百次评估。评估不等于训练：同一个个体会被反复抽到，缓存命中时唯一训练次数会远小于两百。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这一集专门加了覆盖率读数，后面会看到它一次都没命中
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 292, width: 1060 }}>
          <Card label="默认参数：写死在代码里" accent={C.amber}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 34px", width: 1000 }}>
              <KV k="种群" v="20" color={C.cyan} />
              <KV k="代数" v="10" color={C.cyan} />
              <KV k="精英" v="2" color={C.violet} />
              <KV k="锦标赛" v="3" color={C.violet} />
              <KV k="交叉率" v="0.8" color={C.amber} />
              <KV k="变异率" v="0.1" color={C.amber} />
              <KV k="种子" v="20261103" color={C.coral} />
              <KV k="评估 / 只" v={String(M.ga.evals)} color={C.coral} />
            </div>
            <div style={{ marginTop: 24, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1000 }}>
              缓存键是整个基因向量：同一个基因在十代里被反复抽到，就只训练一次。覆盖率记的就是去重后的训练次数 —— 这是判断遗传算法值不值的直接依据。
            </div>
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 18 }}>
            <KV k="评估" v={String(M.ga.evals)} color={C.ink} />
            <KV k="去重训练" v={String(M.ga.unique)} color={C.coral} />
            <KV k="缓存命中" v={String(M.ga.evals - M.ga.unique) + " 次"} color={C.coral} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
