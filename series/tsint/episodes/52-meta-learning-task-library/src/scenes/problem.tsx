import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";
import { ScaleBars, WinBars } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>贵不是问题。<br />选错才是。</Body>
          <Body style={{ marginTop: 24 }}>
            三百个任务、每个十个候选、每个候选拟合一次评分两次，一共 {M.fits.toLocaleString("en-US")} 次拟合。证据程序跑完只用 {M.seconds.toFixed(1)} 秒。成本已经被算力吃掉了，剩下的问题只有一个：选得准不准。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="拟合" v={M.fits.toLocaleString("en-US")} color={C.cyan} />
            <KV k="耗时" v={M.seconds.toFixed(1) + "s"} color={C.violet} />
            <KV k="任务" v={M.data.stocks} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 296, width: 1060 }}>
          <Card label="三千次拟合花在哪" accent={C.cyan}>
            <Row name="训练段" value="拟合一次" note="每个候选在每个任务上拟合一个模型" width={1000} />
            <Row name="验证段" value="评分一次" note="选出每折里的冠军" width={1000} color={C.violet} />
            <Row name="测试段" value="评分一次" note="算命中、名次、后悔值" width={1000} color={C.amber} />
            <Row name="合计" value={M.fits.toLocaleString("en-US")} note={"300 任务 × 10 候选，单机 " + M.seconds.toFixed(1) + " 秒"} width={1000} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>冠军是<br />长尾的。</Body>
          <Body style={{ marginTop: 24 }}>
            naive 赢了 {M.candidates[0].wins} 次，十二阶 SARIMA 赢了 {M.candidates.find((c) => c.name === "sar12")!.wins} 次，AR1 赢了 {M.candidates.find((c) => c.name === "ar1")!.wins} 次。两个指数平滑一次都没赢。分布有长尾，但尾巴上确实有别的选择。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>naive {M.candidates[0].wins}</Chip>
            <Chip color={C.violet}>sar12 {M.candidates.find((c) => c.name === "sar12")!.wins}</Chip>
            <Chip color={C.amber}>ar1 {M.candidates.find((c) => c.name === "ar1")!.wins}</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 288, width: 1080 }}>
          <Card label="真值冠军的胜场数" accent={C.violet}>
            <WinBars w={990} max={140} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>元学习：<br />只做一次<br />矩阵乘法。</Body>
          <Body style={{ marginTop: 24 }}>
            在训练任务上收集元样本：四维特征进，十维误差出。拟合一个多输出岭回归。到了新任务，只读四个统计量，预测十个分数，取最低的那个。不拟合任何候选模型。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 800, top: 292, width: 1040 }}>
          <Card label="四个元特征 → 十个预测" accent={C.cyan}>
            <Row name="输入" value="μ, σ, ρ₁, S" note="均值 / 标准差 / 一阶自相关 / 季节强度" width={980} />
            <Row name="模型" value="W (10×5)" note="四维特征加截距，一次矩阵求逆" width={980} color={C.violet} />
            <Row name="输出" value="10 个误差" note="任务内中心化后的预期 MAE" width={980} color={C.cyan} />
            <Row name="选择" value="argmin" note="预测最低的候选就是选择结果" width={980} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            一次 5×5 求逆 + 一次 5×10 乘法，比拟合任何一个候选模型都便宜。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>但有一个<br />极强的基线。</Body>
          <Body style={{ marginTop: 24 }}>
            恒选朴素模型，命中率 {fmtPct(M.hits.naive, 2)}，比行业类均值高 {((M.hits.naive - M.hits.classMean) * 100).toFixed(2)} 个百分点。为什么？因为多数股票的最优模型就是朴素。元学习要证明的，是它认得出那些例外。
          </Body>
          <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
            <Chip color={C.coral}>恒选 naive {fmtPct(M.hits.naive, 2)}</Chip>
            <Chip color={C.violet}>类均值 {fmtPct(M.hits.classMean, 2)}</Chip>
            <Chip color={C.cyan}>元学习 {fmtPct(M.hits.stats, 2)}</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 290, width: 1040 }}>
          <Card label="候选的平均验证误差：naive 已经很低" accent={C.coral}>
            <ScaleBars w={960} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            朴素模型的平均验证 MAE 是 {M.candidates[0].validMae.toFixed(3)}；两个指数平滑在 {Math.min(M.candidates.find((c) => c.name === "exp0.2")!.validMae, M.candidates.find((c) => c.name === "exp0.5")!.validMae).toFixed(3)} 以上。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
