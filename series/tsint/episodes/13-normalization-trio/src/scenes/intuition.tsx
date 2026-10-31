import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Formula, Head, K, KV, LinePlot, M, Pages, PAD, ShardStrip, Stat,
} from "../shared";

// 示意曲线：只用来讲「量级不同、形状相同」，不是真实行情数据。
const raw = Array.from({ length: 120 }).map((_, i) => 60 + 18 * Math.sin(i / 9) + 6 * Math.sin(i / 3.1) + 40 * Math.exp(i / 160));
const rawB = raw.map((v) => v / 12);
const normA = raw.map((v) => (v - raw.reduce((a, b) => a + b, 0) / raw.length) / 18);
const normB = rawB.map((v) => (v - rawB.reduce((a, b) => a + b, 0) / rawB.length) / (18 / 12));

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="减中心、除尺度，只剩形状" goal="为什么是这两个操作" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: 830 }}>
      <LinePlot
        width={830} height={330} legend
        title="示意：两段价格，量级差十二倍"
        series={[
          { values: raw, color: C.cyan, name: "票 A ≈ 百元" },
          { values: rawB, color: C.amber, name: "票 B ≈ 十元" },
        ]}
        yFmt={(v) => v.toFixed(0)}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 880, top: 380, width: 830 }}>
      <LinePlot
        width={830} height={330} legend
        title="归一化之后：同一条曲线"
        series={[
          { values: normA, color: C.cyan, name: "票 A" },
          { values: normB, color: C.amber, name: "票 B", dash: true },
        ]}
        yFmt={(v) => v.toFixed(1)}
      />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW, display: "flex", gap: 30 }}>
      <Card label="减中心" accent={C.cyan} style={{ flex: 1 }}>
        <Body size={FT.body}>去掉水平。一百元和十元的差别，是「贵不贵」，不是「走势像不像」。</Body>
      </Card>
      <Card label="除尺度" accent={C.cyan} style={{ flex: 1 }}>
        <Body size={FT.body}>去掉大小。同样涨百分之五，价格高的那只绝对涨得多，但幅度一样。</Body>
      </Card>
      <Card label="剩下的" accent={C.amber} style={{ flex: 1 }}>
        <Body size={FT.body} color={C.ink}>只剩形状 —— 而形状，才是跨股票可比的。</Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="三个零件，只在回答三个问题" goal="算 vs 学；整段 vs 每片；反变换用哪份" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
      <Card label="问题一" accent={C.cyan} style={{ flex: 1, height: 450 }}>
        <Body size={FT.h2} color={C.ink}>统计量是算的，还是学的？</Body>
        <KV k="RevIN" v="算" note="两遍扫描，零参数" />
        <KV k="DAIN" v="学" note="两个线性映射，十二参数" />
        <KV k="SAN" v="学一半" note="片内算，片间用网络猜" />
      </Card>
      <Card label="问题二" accent={C.violet} style={{ flex: 1, height: 450 }}>
        <Body size={FT.h2} color={C.ink}>作用范围有多大？</Body>
        <KV k="RevIN、DAIN" v="整个窗口" note="一份统计量管全部时刻" />
        <KV k="SAN" v="每一片" note="每片一份，片间不共享" />
      </Card>
      <Card label="问题三" accent={C.amber} style={{ flex: 1, height: 450 }}>
        <Body size={FT.h2} color={C.ink}>反变换用哪一份？</Body>
        <KV k="答案" v="前向存下来的那份" note="用同一份，才叫可逆" />
        <KV k="反例" v="重算一份" note="两次统计量不同，往返对不上" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 870, width: CW }}>
      <Body size={FT.lead} color={C.ink}>三个问题问完，三个零件的区别也就说完了。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="粒度这件事，用真数据回答" goal="120 只票、250 天、10 片" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 1180 }}>
      <ShardStrip total={M.data.days} tau={M.san.tau} width={1180} height={110} />
      <div style={{ display: "flex", gap: 26, marginTop: 26 }}>
        <Stat label="片内 sigma / 整段 sigma" value={M.san.shard_sigma_ratio_mean.toFixed(3)} accent={C.amber} style={{ flex: 1 }}
          sub="一百二十只票、每窗十片，逐片比值的平均" />
        <Stat label="整段 sigma" value="1.00" accent={C.cyan} style={{ flex: 1 }}
          sub="参照系：一份统计量管整段" />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1360, top: 360, width: 470 }}>
      <Card label="怎么读这个零点三九" accent={C.amber} style={{ height: 420 }}>
        <Body size={FT.body}>
          整段 sigma 里，混着两种东西：片内的局部波动，和整段的水平漂移。
        </Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          每一片自己算 sigma，就把漂移那部分去掉了 —— 所以平均只有整段的零点三九。
        </Body>
        <Formula size={40} color={C.amber} style={{ marginTop: 18 }}>{"sigma_片 <= sigma_段"}</Formula>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        整段一个 sigma，是把这些混成一锅；每片一个 sigma，是承认它们不一样。
      </Body>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, 0.38, 0.7]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);