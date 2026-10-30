import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, M, beatAt, StrategyStrip } from "../shared";

/** 直觉：八行、每条横轴 0–999、每行 50 点。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 42);
  const rows = M.strategies;
  return (
    <Scene id="intuition">
      <Head kicker="04 / 位置图" title="八行位置，八种覆盖" goal="同一横轴上的 8 × 50 个采样位置" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
        {rows.map((s, i) => (
          <Build key={s.key} at={b(Math.min(38, Math.floor(i * 3.6)))}>
            <div style={{ marginBottom: 12 }}>
              <StrategyStrip s={s} width={1776} height={26} />
            </div>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 872, width: 1776 }}>
        <Build at={b(32)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Mono size={FT.micro} color={C.inkFaint}>{M.data.trainFirst} · 索引 0</Mono>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.cyan }}>■ 窗口段</span>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.violet }}>● 单点</span>
              <span style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.coral }}>● 反例（不合法）</span>
            </div>
            <Mono size={FT.micro} color={C.inkFaint}>{M.data.trainLast} · 索引 999</Mono>
          </div>
        </Build>
        <Build at={b(36)}>
          <div style={{ marginTop: 18, display: "flex", gap: 24 }}>
            <Card accent={C.cyan} style={{ width: 860, height: 76 }} pad={14}>
              <Body size={FT.meta} color={C.inkDim}>
                窗口与点可以重合：前端窗口 0–49 与前端点 0–49 的索引完全相同，
                但样本单元一个是 10 段、一个是 50 点。
              </Body>
            </Card>
            <Card accent={C.coral} style={{ width: 860, height: 76 }} pad={14}>
              <Body size={FT.meta} color={C.inkDim}>
                散得越开，覆盖月份越多，但连续段越碎：等距 46 个月 / 50 段，撒点 21 个月 / 50 段。
              </Body>
            </Card>
          </div>
        </Build>
      </div>
    </Scene>
  );
};
