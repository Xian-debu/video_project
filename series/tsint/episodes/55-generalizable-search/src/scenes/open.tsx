import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { BudgetBars, RealBars, SynthBars } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>省算力的<br />三种剪枝。</Body>
          <Body style={{ marginTop: 26 }}>
            上一集把架构选择变成权重。这一集不训练超网：只给一万次真实评估，看三种策略能不能在百分之一的预算里，找到接近最优的架构。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="合成空间" v="1,000,000" color={C.cyan} />
            <KV k="预算" v="1%" color={C.violet} />
            <KV k="真实全距" v={M.real.spreadPct.toFixed(4) + "%"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三个数，两条结论" accent={C.amber}>
            <Row name="合成空间" value="1,000,000" note="10^6 个四维点，真值可算" width={980} color={C.cyan} />
            <Row name="预算" value="10,000" note="空间的百分之一，只够一万次评估" width={980} color={C.violet} />
            <Row name="真实全距" value={M.real.spreadPct.toFixed(4) + "%"} note="12 个架构的检验误差差距" width={980} color={C.amber} />
            <Row name="最好与零基线" value="万分之三" note="这一集的核心负结果" width={980} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>合成上赢</Chip>
            <Chip color={C.coral}>真实上平</Chip>
            <Chip color={C.violet}>33 项全过</Chip>
          </div>
        </div>
        <Foot>一百万次里，只给一万次。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三种做法，<br />一个共同的约束。</Body>
          <Body style={{ marginTop: 24 }}>
            真实评估最贵。子空间收缩、成对比较、组合预测，都在想办法少评几次；随机基线是它们的对照组。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>子空间</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>比较器</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>组合预测器</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="四种做法，同一套预算" accent={C.cyan}>
            <Row name="子空间" value="3 轮" note="采点、留一半、用均值和标准差画新盒子" width={960} color={C.cyan} />
            <Row name="比较器" value="201 次" note="200 个成对样本训练，再排序十万个候选" width={960} color={C.violet} />
            <Row name="组合预测器" value="8 → 4" note="八块各采二十点，留四块，剩余预算继续挖" width={960} color={C.amber} />
            <Row name="随机基线" value="10,000" note="不学习，均匀采样取最大" width={960} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 18 }}>
            <BudgetBars width={960} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>合成上，<br />三种都抬高了一点。</Body>
          <Body style={{ marginTop: 24 }}>
            随机一万个点，最好值三点七七五九；三种策略把最好值抬高零点一零到零点一四。幅度不大，但方向一致。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            阈值 3.3014；四种做法的最大值都越过阈值。<br />
            随机自己也越线，所以不能只看「过线」。
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1150 }}>
          <Card label="四个最大值，一条阈值线" accent={C.cyan}>
            <SynthBars width={1060} />
          </Card>
        </div>
        <Foot>阈值之上，比的不是过线，是抬升。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>真实上，<br />优势消失。</Body>
          <Body style={{ marginTop: 24 }}>
            换到股票次日收益，十二个架构的检验误差全距不到百分之一。最好的 L5-mom 只比零基线好万分之三，长回看家族反而最差。
          </Body>
          <div style={{ display: "flex", marginTop: 24 }}>
            <KV k="零基线" v={fmt4(M.real.zeroMae)} color={C.cyan} />
            <KV k="最好" v={fmt4(M.real.best.mae)} color={C.violet} />
            <KV k="全距" v={M.real.spreadPct.toFixed(4) + "%"} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 286, width: 1170 }}>
          <Card label="12 个架构，一条零基线" accent={C.coral}>
            <div style={{ height: 12 }} />
            <RealBars width={1080} />
          </Card>
        </div>
        <Foot accent={C.coral}>全距不到 1%，最好只比零基线好万分之三。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四段路线，<br />一份证据。</Body>
          <Body style={{ marginTop: 24 }}>
            定义、合成、真实、验收。每一段都有读数，读数来自同一份证据程序：三十三项检查，六组，一条命令跑完。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="从定义到 33 项检查" accent={C.cyan}>
            <Row name="01 定义" value="3 个式子" note="收缩、比较、剪枝与参数继承" width={1040} />
            <Row name="02 合成" value="4 条读数" note="随机与三种策略，同一百万点空间" width={1040} color={C.violet} />
            <Row name="03 真实" value="12 个架构" note="股票次日收益，三十只股票" width={1040} color={C.cyan} />
            <Row name="04 验收" value="33 项" note="数据 / 合成 / 子空间 / 比较器 / 组合 / 迁移" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="股票" v={M.data.stocks} color={C.cyan} />
            <KV k="窗口" v={M.data.windows.toLocaleString("en-US")} color={C.violet} />
            <KV k="检查" v="33 / 33" color={C.amber} />
            <KV k="耗时" v={M.meta.seconds.toFixed(2) + "s"} color={C.inkDim} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
