import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, KV, M, PAD, Pages, Row, Stat, WindowStrip, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 3 章 / 卷积" title="卷积看时序：三个先验" goal="因果 · 周期 · 聚合" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="本集论点" accent={C.cyan} style={{ height: 320 }}>
        <Body size={FT.lead} color={C.ink}>卷积把「局部形状」当成先验。</Body>
        <Body size={FT.lead} color={C.ink} style={{ marginTop: 6 }}>相邻点有关系，而且这个关系平移不变。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          代价也跟着来：不能看未来、窗口要有物理尺度、多个周期要先折成网格。
          这一集只验证这三个先验，不假装复现一个预测器。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1030, top: 340, width: CW - 1030 }}>
      <Card label="一个样本" accent={C.violet} style={{ height: 320 }} pad={18}>
        <WindowStrip h={M.meta.h} f={M.meta.f} width={CW - 1070} height={200} />
        <div style={{ marginTop: 8 }}><K>H = {M.meta.h} · F = {M.meta.f} · 四层 K = {M.meta.kernel} · d = {M.meta.dilations.join(",")}</K></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 690, width: 1160 }}>
      <Card label="时间序列不能随便卷" accent={C.cyan} pad={20}>
        <Row name="一 · 不能看未来" value="只左填充" note="两侧都填会读到未来，离线指标看不出来" color={C.coral} width={1120} />
        <Row name="二 · 窗口要有尺度" value="核宽 × 膨胀" note="局部多大，得用交易日来数" color={C.amber} width={1120} />
        <Row name="三 · 多个周期怎么合" value="折叠 + 加权" note="周期不是超参数，让频率说话" color={C.violet} width={1120} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1190, top: 700, width: CW - 1190 }}>
      <Card label="样本与窗口" accent={C.amber} style={{ height: 300 }}>
        <KV k="五分钟样本" v={fmtInt(M.data.minuteRows) + " 根"} note={M.data.days + " 个交易日 · 每天 " + M.data.barsPerDay + " 根"} />
        <KV k="窗长 / 输出" v={M.meta.h + " / " + M.meta.f} note="四层卷积，输出二十四步" color={C.cyan} />
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="教材给骨架，不给参数" goal="一条流水线，五个空格" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Card label="书里给了什么" accent={C.cyan} style={{ flex: 1, height: 400 }}>
        <Body size={FT.h2} color={C.ink}>五条式子，一张总图。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          3.14 时间轴空洞因果卷积；3.15 通道轴卷积；3.16 FFT 取周期；3.17 折叠后的二维卷积；3.18 按振幅聚合。
        </Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          图 3.5 画的是：嵌入、卷积、预测头。
        </Body>
      </Card>
      <Card label="书里没给什么" accent={C.coral} style={{ flex: 1, height: 400 }}>
        <Body size={FT.h2} color={C.ink}>五个空格。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          核宽 K；膨胀因子 d 取哪些；保留几个频率 k；通道数 D；训练配方和预测头公式。
        </Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          没有误差表，也没有可复现的超参数。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.coral}>勘误 E35 · C 级</Chip></div>
      </Card>
      <Card label="三根钉子" accent={C.amber} style={{ flex: 1, height: 400 }}>
        <Body size={FT.h2} color={C.ink}>先验能不能钉死。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          因果性：只左填充，扰动测试必须逐位为零。
        </Body>
        <Body size={FT.body} style={{ marginTop: 8 }}>
          感受野：1 + Σ(K − 1)d，四层等于 31。
        </Body>
        <Body size={FT.body} style={{ marginTop: 8 }}>
          周期：FFT 说话，48 根等于一个交易日。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 810, width: CW }}>
      <Card label="本集的纪律" accent={C.violet} pad={20}>
        <Body size={FT.h2} color={C.ink}>
          只验证结构，不报预测误差；屏幕上每个数都能在证据 JSON 里找到。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="先给结论，再给反例" goal="可证明的先验，与不可掩盖的缺样本" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Stat label="检查通过" value={M.meta.checks.ok + " / " + M.meta.checks.total} accent={C.cyan} style={{ flex: 1, height: 230 }}
        sub={<span>数据 7 · 结构 21 · 梯度 3 · 真实 3</span>} />
      <Stat label="测试套件" value={fmtInt(M.meta.tests.suites)} accent={C.amber} style={{ flex: 1, height: 230 }}
        sub={<span>断言 {fmtInt(M.meta.tests.asserts)} · 本集 8 / 9 / 10</span>} />
      <Stat label="感受野" value={M.meta.rf} accent={C.violet} style={{ flex: 1, height: 230 }}
        sub={<span>4 层 · K = 3 · d = 1,2,4,8</span>} />
      <Stat label="第一周期" value={M.spectrum.peaks[0].period + " 根"} accent={C.coral} style={{ flex: 1, height: 230 }}
        sub={<span>振幅 {M.spectrum.top1.toFixed(3)} · 比第二峰高 {((M.spectrum.top1 / M.spectrum.top2 - 1) * 100).toFixed(1)}%</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 640, width: 1120 }}>
      <Card label="结论" accent={C.cyan}>
        <Body size={FT.h2} color={C.ink}>因果性可以被证明，周期可以被测量。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          左填充之后，前九十行逐位相同；四层累加之后，感受野正好三十一。
          周期不是拍脑袋，是频谱里能量最大的那根。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 640, width: CW - 1150 }}>
      <Card label="反例" accent={C.coral} style={{ height: 250 }}>
        <Body size={FT.h2} color={C.ink}>周周期没有出现。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          二百四十根排第 {M.spectrum.weekly240Rank} 位，振幅 {M.spectrum.weekly240Amp}。
          {M.data.days} 个交易日只有二十来周，样本不够。
        </Body>
      </Card>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, pageAt("open", 9), pageAt("open", 20)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
