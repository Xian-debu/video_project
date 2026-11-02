import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 284, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五条边界，<br />先说清楚。</Body>
          <Body style={{ marginTop: 22 }}>
            二十只股票、十个候选，样本很小；学习曲线只有三个点；只用一个指标 MAE；只有一份数据、一个切分；遗传算法的参数是手写默认值。五条都成立，结论也只能在这个范围内说。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Chip color={C.inkDim}>样本</Chip>
            <Chip color={C.inkDim}>三点</Chip>
            <Chip color={C.inkDim}>单指标</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 280, width: 1130 }}>
          <Card label="五条边界：每条都成立" accent={C.violet}>
            <Row name="样本" value="20 只 × 10 候选" note="样本很小，比率的分辨率只有 5%" width={1060} color={C.violet} />
            <Row name="阶段点" value="3 个" note="1/8 · 1/4 · 1/2，读不出平台" width={1060} color={C.cyan} />
            <Row name="指标" value="单指标 MAE" note="换 MSE 或命中率，结论会动" width={1060} color={C.amber} />
            <Row name="数据" value="一份 · 一个切分" note="没有跨行业、跨时段验证" width={1060} color={C.coral} />
            <Row name="参数" value="手写默认值" note="没做种子分布，也没调参" width={1060} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1060 }}>
            换成两百个候选，遗传算法可能真的划算；换成五个阶段点，外推可能读得出平台 —— 这些都没试，不能说。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 284, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两条负结果，<br />也留在证据里。</Body>
          <Body style={{ marginTop: 22 }}>
            一条是遗传算法在小空间上白忙；一条是学习曲线外推救不回排序。负结果也是结果，只要读数可复现。四条不做的事写进计划，留给后面的集：不做种子分布、不重设候选池、不做多指标一致性、不做跨行业推广。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 280, width: 1130 }}>
          <Card label="负结果 × 2" accent={C.coral}>
            <Row name="GA 白忙" value="200 = 200" note={"200 次评估 = 200 次训练，答案与穷举一致 " + M.ga.same + "/" + M.data.stocks} width={1060} color={C.coral} />
            <Row name="外推救不回" value={fmtPct(M.demo.pow.acc1, 0) + " Top-1"} note={"误差是排序差距的 " + M.demo.ratio.toFixed(1) + " 倍，全量 100%"} width={1060} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18 }}>
            <Card label="明确不做的事：四项" accent={C.inkDim}>
              <Row name="种子分布" value="不做" note="单种子，只保证可复现" width={1060} color={C.inkDim} />
              <Row name="重设候选池" value="不做" note="沿用上一集的十个候选" width={1060} color={C.inkDim} />
              <Row name="多指标一致性" value="不做" note="只报 MAE，不做指标投票" width={1060} color={C.inkDim} />
              <Row name="跨行业推广" value="不做" note="二十只 HS300，不做行业外推" width={1060} color={C.inkDim} />
            </Card>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 284, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>边界不是免责，<br />是标定范围。</Body>
          <Body style={{ marginTop: 22 }}>
            在范围内可复核，范围外不下结论。这一集的所有数字都有唯一来源：证据程序一跑，画面就不能改。先写实现，再写证据，最后写画稿 —— 顺序不能反，反了就会挑数字。
          </Body>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            挑出来的数字，不叫证据
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 282, width: 1090 }}>
          <Card label="数字的唯一来源" accent={C.cyan}>
            <Row name="检查" value={M.checks.length + " 项全过"} note={"一次跑完 " + M.seconds.toFixed(1) + " 秒"} width={1020} color={C.cyan} />
            <Row name="数据" value="daily.csv" note="20 只 × 2,412–2,431 根，切点写死" width={1020} color={C.violet} />
            <Row name="实现" value={"ts-base " + M.meta.commits.tsBase} note="三个模块 + 十一个黄金用例" width={1020} color={C.amber} />
            <Row name="导出" value={"ts-admin " + M.meta.commits.tsAdmin} note="Lake 快照，后复权收盘价" width={1020} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="来源" v="summary.json" color={C.inkDim} />
            <KV k="画面" v="禁止手填" color={C.coral} />
            <KV k="重跑" v="一条命令" color={C.cyan} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
