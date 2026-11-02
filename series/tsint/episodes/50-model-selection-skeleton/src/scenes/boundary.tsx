import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, K, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五条边界，<br />先说清楚。</Body>
          <Body style={{ marginTop: 24 }}>
            这一集的结论都带着条件。换一批股票、换一个池子、换一个指标，数字都会动。把条件写出来，结论才可复现、可反驳。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="结论只在下面这五条里成立" accent={C.coral}>
            <Row name="一 · 股票" value="20 只行业龙头" note="沪深三百，没有小盘和新股" width={1010} color={C.cyan} />
            <Row name="二 · 候选" value="10 个手挑" note="更优的模型可能不在池子里" width={1010} color={C.violet} />
            <Row name="三 · 预测" value="一步" note="多步预测误差会累加" width={1010} color={C.amber} />
            <Row name="四 · 指标" value="单指标 MAE" note="换指标会换冠军" width={1010} color={C.coral} />
            <Row name="五 · 频率" value="日线" note="两千根样本，显著性有限" width={1010} color={C.inkFaint} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>指标是选的，<br />不是推出来的。</Body>
          <Body style={{ marginTop: 24 }}>
            主指标定 MAE，是因为这一集关心预测误差。如果目标换成收益、换成胜率，冠军会换人。所以「指标」这一条本身就是一个假设，得写下来让人检验。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>MAE</Chip>
            <Chip color={C.violet}>MSE 只做稳健性</Chip>
            <Chip color={C.inkFaint}>Sharpe · 未做</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 296, width: 1080 }}>
          <Card label="两千根日线，能说明什么" accent={C.amber}>
            <Row name="样本" value={M.data.bars[0] + "–" + M.data.bars[1] + " 根"} note="每只股票" width={1000} color={C.cyan} />
            <Row name="验证" value={M.data.split.valid[0] + " 点"} note="排序只在这上面做" width={1000} color={C.violet} />
            <Row name="测试" value={M.data.split.test[0] + " 点"} note="真值只在这上面定" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1020 }}>
            二十只乘二百四十二个测试点，看起来很多；但每只股票只有一个答案，命中率的分辨率就是 5%。0.50 与 0.55 之间，只差一只股票。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>计划的预期，<br />没有成立。</Body>
          <Body style={{ marginTop: 24 }}>
            计划里写的是：池子从 3 扩到 5，Hit@1 至少涨十五个百分点。实测是零。上限确实涨了十个百分点，但命中率被验证噪声卡住。这个负结果照样放进片子。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 296, width: 1080 }}>
          <Card label="计划 vs 实测" accent={C.coral}>
            <Row name="计划 Hit@1" value="+15 个百分点" note="池 3 → 池 5" width={1000} color={C.inkFaint} />
            <Row name="实测 Hit@1" value={"+0 个百分点"} note={fmtPct(M.hit.pool3, 0) + " → " + fmtPct(M.hit.pool5, 0)} width={1000} color={C.coral} />
            <Row name="上限（覆盖）" value="+10 个百分点" note={fmtPct(M.coverage.pool3, 0) + " → " + fmtPct(M.coverage.pool5, 0)} width={1000} color={C.cyan} />
            <Row name="全池 Hit@1" value={fmtPct(M.hit.full, 0)} note="再扩池也只多一只" width={1000} color={C.violet} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            二十只股票，命中数 10 / 10 / 11 / 11 —— 一只股票的差别就是 5%
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>明确不做的事。</Body>
          <Body style={{ marginTop: 24 }}>
            这一集只把「选」这一件事讲透。元学习、多目标、在线更新、跨市场验证，都不做。不是不重要，是放进同一集就讲不深。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="四项不做" accent={C.inkFaint}>
            <Row name="元学习" value="不做" note="不拿别的任务迁移初始化" width={1010} color={C.inkFaint} />
            <Row name="多目标" value="不做" note="不排准确率与成本的权衡" width={1010} color={C.inkFaint} />
            <Row name="在线更新" value="不做" note="模型不滚动重训" width={1010} color={C.inkFaint} />
            <Row name="跨市场" value="不做" note="只验沪深三百" width={1010} color={C.inkFaint} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            下一集接着讲搜索：遗传算法和学习曲线外推，都是把拟合次数降下来的办法。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
