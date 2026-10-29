import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, PricePlot, beatAt, V } from "../shared";

const HIST = [
  { label: "1 天", n: 4742, w: 1.0 },
  { label: "2 天", n: 16, w: 0.0034 },
  { label: "3 天", n: 1115, w: 0.2351 },
  { label: "超过 3 天", n: 156, w: 0.0329 },
];

export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 25);
  const st = V.series.stats;
  return (
    <Scene id="problem">
      <Head kicker="01 / 顺序不是普通的一列" title="把时间抹掉，信息就没了" goal="价格几乎完全自相关，收益率几乎不相关；还有一次 53 天的停牌" />

      <div style={{ position: "absolute", left: PAD, top: 270, width: 980 }}>
        <Build at={b(1)}>
          <Card label="600519 · 全历史日线 · 6030 根" accent={C.cyan} pad={20} style={{ width: 980, height: 518 }}>
            <PricePlot w={934} h={392} at={b(3)} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <K>{"2001-08-27 → 2026-10-28 · 收盘价（元）"}</K>
              <Mono size={FT.micro} color={C.coral}>{"2006-02-23 → 2006-04-17 · 53 天 · 停牌"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1072, top: 270, width: 776 }}>
        <Build at={b(8)}>
          <Card label="滞后一阶自相关 · 同一段 6030 个点" accent={C.violet} pad={20} style={{ width: 776, height: 240 }}>
            <div style={{ display: "flex", gap: 34 }}>
              <div style={{ minWidth: 330 }}>
                <K>{"价格水平"}</K>
                <div style={{ marginTop: 2 }}><Num value={st.acfPrice} size={30} color={C.violet} /></div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 4 }}>{"今天的价格几乎等于昨天。"}</Body>
              </div>
              <div style={{ minWidth: 300 }}>
                <K>{"收益率"}</K>
                <div style={{ marginTop: 2 }}><Num value={st.acfReturn} size={30} color={C.cyan} /></div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 4 }}>{"涨跌方向几乎不可由昨天预测。"}</Body>
              </div>
            </div>
            <div style={{ marginTop: 12, borderTop: "1px solid " + C.panelLine, paddingTop: 10 }}>
              <Body size={FT.meta} color={C.inkDim}>
                {"同一对象、同一条序列：水平值自相关 0.9995513，收益率 0.0098871。把时间顺序打乱，价格序列仍然是价格，但预测问题已经换了一个。"}
              </Body>
            </div>
          </Card>
        </Build>

        <Build at={b(15)}>
          <Card label="采样间隔 · 6029 个相邻日" accent={C.amber} pad={20} style={{ width: 776, height: 272, marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <Body size={FT.lead} color={C.ink}>{"不是每天都开盘"}</Body>
              <Chip color={C.amber}>{"> 3 天：156 次"}</Chip>
            </div>
            <div style={{ marginTop: 10 }}>
              {HIST.map((h) => (
                <div key={h.label} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                  <Mono size={FT.micro} color={C.inkFaint} style={{ minWidth: 74 }}>{h.label}</Mono>
                  <div style={{ height: 14, width: Math.max(2, 300 * h.w), background: C.amber, opacity: 0.82, borderRadius: 3 }} />
                  <Num value={h.n} size={FT.mono} color={C.inkDim} />
                </div>
              ))}
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
              {"最长一次 53 天。停牌不是缺失值；填掉，任务就换掉了。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 820, width: 1776 }}>
        <Build at={b(22)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <Body size={FT.lead} color={C.ink}>{"顺序本身就是信息。"}</Body>
            <K>{"价格水平 / 收益率 / 采样间隔，三件不同的事；后面七十三集都要用。"}</K>
          </div>
        </Build>
      </div>
    </Scene>
  );
};