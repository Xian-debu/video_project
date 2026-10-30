import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Stat, Quote, M, beatAt } from "../shared";

/** 问题：同样 50 点预算，八种位置的世界完全不同。 */
export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 42);
  const rows = M.strategies;
  const front = rows.find((s) => s.key === "window-front")!;
  const uniform = rows.find((s) => s.key === "point-uniform")!;
  return (
    <Scene id="problem">
      <Head kicker="02 / 一件真事" title="同一预算，不同的世界" goal="位置一换，分数不可比" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 1090 }}>
        <Build at={b(1)}>
          <div style={{ display: "flex", gap: 0, padding: "0 0 10px 0", borderBottom: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: 1 }}>
            <div style={{ width: 300 }}>策略</div>
            <div style={{ width: 170 }}>首日期</div>
            <div style={{ width: 170 }}>末日期</div>
            <div style={{ width: 130, textAlign: "right" }}>连续段</div>
            <div style={{ width: 140, textAlign: "right" }}>最大空洞</div>
            <div style={{ width: 110, textAlign: "right" }}>月份</div>
            <div style={{ width: 70, textAlign: "right" }}>状态</div>
          </div>
        </Build>
        {rows.map((s, i) => (
          <Build key={s.key} at={b(3 + Math.round(i * 2.4))}>
            <div style={{
              display: "flex", alignItems: "baseline", padding: "11px 0",
              borderBottom: "1px solid " + C.panelLine,
              fontFamily: FONT.mono, fontSize: FT.meta,
              color: s.legal ? C.inkDim : C.coral,
            }}>
              <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.body, color: s.legal ? C.ink : C.coral }}>{s.label}</div>
              <div style={{ width: 170 }}>{s.firstDate}</div>
              <div style={{ width: 170 }}>{s.lastDate}</div>
              <div style={{ width: 130, textAlign: "right" }}>{s.runs}</div>
              <div style={{ width: 140, textAlign: "right" }}>{s.maxGap}</div>
              <div style={{ width: 110, textAlign: "right" }}>{s.months}</div>
              <div style={{ width: 70, textAlign: "right" }}>{s.legal ? "✓" : "✗"}</div>
            </div>
          </Build>
        ))}
        <Build at={b(22)}>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7 }}>
            8 种策略、每种 50 点、合计 400 个位置；训练窗 1,000 点，空洞按交易日计数。
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1190, top: 292, width: 658 }}>
        <Build at={b(19)}>
          <Card accent={C.amber} style={{ width: 658, height: 150 }} pad={18}>
            <Body color={C.inkDim} size={FT.meta} style={{ lineHeight: 1.7 }}>
              随机窗口（seed 42）最后一块停在索引 906：训练窗末尾
              <span style={{ color: C.amber }}> 93 个点</span>一次都没被看到。
            </Body>
          </Card>
        </Build>
        <Build at={b(25)}>
          <Stat label="覆盖跨度" value={front.months + " → " + uniform.months + " 个月"}
            sub="前端窗口 3 个月；等距反例 46 个月（但 50 段，不合法）"
            accent={C.coral} style={{ width: 658, height: 176, marginTop: 16 }} valueSize={FT.num} />
        </Build>
        <Build at={b(36)}>
          <Quote width={658} lines={[
            "由于需保证单个样本的时间连续性，在固定采样率（如 5%）下无法随机离散选择点，因此仅采用位置策略。",
            "前、后端窗口：捕获初始模式 / 提取最新动态。",
          ]} label="原文 · p.204 · 8.6.1" source="《时序智能》p.204 · 短摘录 · CC BY-NC-ND 4.0" />
        </Build>
      </div>
    </Scene>
  );
};