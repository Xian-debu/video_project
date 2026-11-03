import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { CompareDemo, PruneDemo, SpaceScale } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>十的二十次方，<br />几百次评估。</Body>
          <Body style={{ marginTop: 24 }}>
            一个块里三条边，六个块联合起来就是十的二十次方。真实任务只允许几百次评估，百分之一的预算都算奢侈。这不是算力问题，是算术问题。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="真实空间" v="10^20" color={C.coral} />
            <KV k="常见预算" v="几百次" color={C.amber} />
            <KV k="合成预算" v="0.01" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="对数刻度：真实空间比合成大十四个数量级" accent={C.coral}>
            <SpaceScale width={1000} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            合成空间可以穷举真值；真实空间只能采样，所以只能比检验误差。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>随机不学习，<br />但它有上限。</Body>
          <Body style={{ marginTop: 24 }}>
            均匀采一万个点，取最大值。它不会越采越准，也不会用上已经评过的信息；但它给出了一个诚实的下界，三种策略必须跨过它。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>10,000 次</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>取最大</Chip>
            <Chip color={C.coral} style={{ marginLeft: 10 }}>3.7759</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="随机基线：一万个点里的最大值" accent={C.cyan}>
            <Row name="采样" value="10,000" note="空间的百分之一，固定种子" width={960} />
            <Row name="选择" value="取最大" note="只看已有样本，不建模型" width={960} color={C.violet} />
            <Row name="top 比例" value="0.01" note="前 1% 共 10,000 个点" width={960} color={C.cyan} />
            <Row name="阈值" value="3.3014" note="经验 99% 分位数" width={960} color={C.amber} />
            <Row name="最好值" value={fmt4(M.synth.randomBest)} note="这就是策略要越过的线" width={960} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            一万个点的最大值天然容易越过单点的 99% 分位线，所以后面要看抬升幅度。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>子空间：<br />假设好点聚在一起。</Body>
          <Body style={{ marginTop: 24 }}>
            先粗采一批点，保留表现好的那一半，用它们的均值和标准差画一个新盒子；下一轮只在新盒子里采。盒子会越来越小，希望好点越来越密。
          </Body>
          <div style={{ marginTop: 24, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            6,000 → 3,000 → 1,000<br />
            体积 0.0770 → 0.0059 → 0.0005
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="收缩的假设与代价" accent={C.cyan}>
            <Row name="假设" value="好点聚集" note="最优区域是一个连续的盒子" width={960} />
            <Row name="每轮" value="留一半" note="按已评分数排序，保留前 50%" width={960} color={C.violet} />
            <Row name="新盒" value="μ ± λσ" note="逐维均值与标准差，λ=1" width={960} color={C.cyan} />
            <Row name="风险" value="收缩偏了" note="一轮偏，后面越采越偏" width={960} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            合成空间的最优在四个角；盒子如果往中间缩，就永远到不了角上。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>比较与组合：<br />两种更便宜的预测。</Body>
          <Body style={{ marginTop: 24 }}>
            比较器只学「谁更高」，不给绝对分数；组合预测器把空间切块，用块内平均分决定留哪几块。前者省评估，后者省搜索范围。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 580 }}>
          <Card label="比较器：只判次序" accent={C.violet}>
            <CompareDemo />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1310, top: 286, width: 540 }}>
          <Card label="组合预测器：块内平均" accent={C.amber}>
            <PruneDemo />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两个口径，<br />不能混着说。</Body>
          <Body style={{ marginTop: 24 }}>
            合成空间能算真值，所以看机制；真实任务只能比检验误差，所以看收益。机制成立不等于收益成立，上一集刚讲过这句话。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="股票" v={M.data.stocks} color={C.cyan} />
            <KV k="窗口" v={M.data.windows.toLocaleString("en-US")} color={C.violet} />
            <KV k="回看" v="24" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="两套读数，一条底线" accent={C.cyan}>
            <Row name="合成" value="真值可算" note="10^6 个点全部评分，阈值精确" width={980} color={C.cyan} />
            <Row name="真实" value="12 个架构" note="30 只股票、60,115 个窗口，检验段 MAE" width={980} color={C.violet} />
            <Row name="机制" value="公式与流程" note="黄金值、预算、复现，能写成断言" width={980} color={C.amber} />
            <Row name="收益" value="检验误差" note="最好的架构能不能赢过零基线" width={980} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这一集先验证机制，再报告收益；两个结论分开写。
          </div>
        </div>
        <Foot>机制成立，收益不一定成立。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
