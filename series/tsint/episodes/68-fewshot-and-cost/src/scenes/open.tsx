import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Stat, M, beatAt, StrategyStrip } from "../shared";

/** 开场：同一只股票、同一段历史，只换采样位置。 */
export const SOpen: React.FC = () => {
  const b = (i: number) => beatAt("open", i, 33);
  const w = M.window;
  const front = M.strategies.find((s) => s.key === "window-front")!;
  const uniform = M.strategies.find((s) => s.key === "window-uniform")!;
  const random = M.strategies.find((s) => s.key === "window-random")!;
  return (
    <Scene id="open">
      <Head kicker="第 8 章 / 评估层" title="五十个点看四年" goal="50 点预算怎么铺满 1,000 点训练窗" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
        <Build at={b(0)}>
          <Card label="数据" accent={C.cyan} style={{ width: 700, height: 150 }} pad={20}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Mono size={FT.num}>{w.total.toLocaleString("en-US")}</Mono>
              <K>个交易日 · {M.data.code}</K>
            </div>
            <Body size={FT.meta} style={{ marginTop: 10 }}>{M.data.first} → {M.data.last} · 前复权 · 剔停牌</Body>
          </Card>
        </Build>

        <Build at={b(3)}>
          <Card label="预算" accent={C.violet} style={{ width: 700, height: 150, marginTop: 16 }} pad={20}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Mono size={FT.num}>{w.budget}</Mono>
              <K>5% × 1,000 = 50 点</K>
            </div>
            <Body size={FT.meta} style={{ marginTop: 10 }}>窗宽 {w.window} → {w.windows} 个窗口 · 每个窗口 5 点</Body>
          </Card>
        </Build>

        <Build at={b(5)}>
          <Card label="组合" accent={C.amber} style={{ width: 700, height: 150, marginTop: 16 }} pad={20}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Mono size={FT.num}>400</Mono>
              <K>8 策略 × 50 点</K>
            </div>
            <Body size={FT.meta} style={{ marginTop: 10 }}>6 个合法组合 + 2 个反例 · 位置全部可复核</Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 820, top: 292, width: 1028 }}>
        <Build at={b(7)}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginBottom: 12 }}>
            同一横轴：训练窗 0–999 · 每行 50 个采样点
          </div>
        </Build>
        <Build at={b(8)}>
          <div style={{ marginBottom: 26 }}><StrategyStrip s={front} width={1028} height={32} /></div>
        </Build>
        <Build at={b(10)}>
          <div style={{ marginBottom: 26 }}><StrategyStrip s={uniform} width={1028} height={32} /></div>
        </Build>
        <Build at={b(13)}>
          <div style={{ marginBottom: 26 }}><StrategyStrip s={random} width={1028} height={32} /></div>
        </Build>
        <Build at={b(15)}>
          <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7 }}>
            窗口 = 实心带（每个窗口是一个样本）· 点 = 孤立标记（每个点是样本）<br />
            前端只看到 3 个月；均匀铺满 4 年（10 个窗口）；随机只落在 8 个月份，最大空洞 168 点。
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 820, top: 812, width: 1028 }}>
        <Build at={b(17)}>
          <Card accent={C.coral} style={{ width: 1028, height: 128 }} pad={20}>
            <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, lineHeight: 1.45 }}>
              模型没变，测试集也没变。换一种窗口，分数不可比。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 812, width: 700 }}>
        <Build at={b(15)}>
          <Stat label="训练窗" value="0 – 999" sub={`${M.data.trainFirst} → ${M.data.trainLast}`} accent={C.cyan} style={{ width: 700, height: 128 }} valueSize={FT.num} />
        </Build>
      </div>
    </Scene>
  );
};