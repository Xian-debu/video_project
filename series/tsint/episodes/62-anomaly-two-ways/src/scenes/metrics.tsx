import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt4, pagesOf } from "../shared";
import { SplitBar, SweepLines } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>数据是<br />000001 的日收益。</Body>
          <Body style={{ marginTop: 26 }}>
            百分比对数收益，1998 到 2026 共 6,599 行。本集只用其中两段：2015–2019 训练与标定，2020–2022 测试。
            中间留出的年份既不训练也不测试。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="全集" v="6,599 行" color={C.inkDim} />
            <KV k="训练" v="1,219 行" color={C.cyan} />
            <KV k="测试" v="728 行" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="全集" value={M.data.returnsRows.toLocaleString("en-US")} sub="1998-11-26 → 2026-10-28" accent={C.cyan} style={{ width: 300 }} valueColor={C.ink} />
            <Stat label="训练与标定" value={M.data.trainRows.toLocaleString("en-US")} sub="2015-01-05 → 2019-12-31" accent={C.cyan} style={{ width: 300 }} valueColor={C.cyan} />
            <Stat label="测试" value={M.data.testRows} sub="2020-01-02 → 2022-12-30" accent={C.coral} style={{ width: 300 }} valueColor={C.coral} />
          </div>
          <Card label="全集与两段的相对长度" accent={C.cyan} style={{ marginTop: 16, width: 960 }} pad={18}>
            <SplitBar width={920} height={200} />
          </Card>
        </div>
        <Foot>先钉数据，后面每个数才有出处。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>窗口把行数<br />变成样本数。</Body>
          <Body style={{ marginTop: 26 }}>
            拟合用 2015–2017 的 732 个窗口，标定用 2018–2019 的 487 个，测试是 2020–2022 的 728 个点。
            三段互不重叠：阈值只在标定段上定，测试段一次都不碰。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="拟合" v="732 窗" color={C.cyan} />
            <KV k="标定" v="487 窗" color={C.amber} />
            <KV k="测试" v="728 点" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三段切分 · 段与段不重叠" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <SplitBar width={950} height={210} windows />
          </Card>
          <Card label="三段的窗口长度一样" accent={C.amber} style={{ marginTop: 16, width: 1010 }} pad={18}>
            <Row name="窗口" value="32 点" note="三段同长，只换数据，不换定义" width={962} color={C.cyan} valueW={240} />
            <Row name="步长" value="1 天" note="窗口重叠，一天一个样本" width={962} color={C.inkDim} valueW={240} />
            <Row name="训练轮数" value={M.recon.epochs + " 轮"} note="同一批窗口反复过 200 遍，学习率 0.02" width={962} color={C.inkDim} valueW={240} />
          </Card>
        </div>
        <Foot>三段互不重叠，阈值只在标定段上定。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>两边各有<br />一个阈值。</Body>
          <Body style={{ marginTop: 26 }}>
            预测侧阈值 3.446733，标定段报警率 0.8214%；重构侧阈值 1.624461。两个数都由同一段标定数据的分位数给出，
            测试段完全不参与——这是「先钉口径再读数」的全部含义。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="预测阈值 τ" value={fmt4(M.pred.threshold, 6)} sub="标定段残差 0.99 分位" accent={C.cyan} style={{ width: 300 }} valueColor={C.cyan} valueSize={52} />
            <Stat label="标定报警率" value={fmt2(M.pred.calibRate * 100, 4) + "%"} sub="487 窗 · 约 1%" accent={C.amber} style={{ width: 300 }} valueColor={C.amber} valueSize={52} />
            <Stat label="重构阈值" value={fmt4(M.recon.threshold, 6)} sub="标定段重构分 0.99 分位" accent={C.violet} style={{ width: 300 }} valueColor={C.violet} valueSize={52} />
          </div>
          <Card label="为什么阈值不拿测试段定" accent={C.coral} style={{ marginTop: 16, width: 960 }} pad={20}>
            <Row name="偷看测试段" value="F1 会虚高" note="阈值跟着测试集调，等于提前看了答案" width={912} color={C.coral} valueW={300} />
            <Row name="只用标定段" value="数字可复现" note="换一段数据，阈值跟着变，但流程不变" width={912} color={C.cyan} valueW={300} />
            <Row name="代价" value="报警率 0.82%" note="略低于名义 1%，因为标定段残差比测试段更薄尾" width={912} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot>阈值在标定段定，测试段一次都不碰。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>百分之九十九<br />不是唯一选择。</Body>
          <Body style={{ marginTop: 26 }}>
            把 q 从 0.90 扫到 0.999：q 越大阈值越高，尖峰侧的 F1 越高、漂移侧越低。0.99 是两条曲线都还站得住的位置，
            也是这一集所有数字的口径。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="扫描" v={M.sweep.length + " 档"} color={C.inkDim} />
            <KV k="尖峰最高" v={fmt4(M.sweep[5].predSpike)} color={C.coral} />
            <KV k="漂移最高" v={fmt4(M.sweep[4].reconDrift)} color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="阈值扫描 · 四条 F1 曲线" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <SweepLines width={950} height={300} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 990 }}>
            实线是赢家、虚线是输家：q 提高，尖峰侧的残差更占优；漂移侧正好相反，q 越低越容易把整段报警。
          </div>
        </div>
        <Foot>换个 q，两种异常的名次会变。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
