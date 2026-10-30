import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Stat, M, beatAt, fmtMs, fmtMse } from "../shared";

/** 验证：位置/种子/边界 + 三规模成本表 + lazy 对照。 */
export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 46);
  const eff = M.efficiency;
  const rows: [string, string, string][] = [
    ["8 策略 × 50 点", "400 个位置", "全部落在 0–999"],
    ["前端窗口 / 前端点", "0 – 49", "3 个月"],
    ["后端窗口 / 后端点", "950 – 999", "3 个月"],
    ["均匀窗口 10 窗", "跨度 999", "最大空洞 106"],
    ["随机窗口 seed 42", "首 16 · 末 906", "最大空洞 168"],
    ["等距反例", "步长 20 · 50 段", "最大空洞 19"],
    ["撒点反例", "50 个孤点", "最大空洞 123"],
    ["同种子 / 换种子", "true / true", "逐位相同 / 不同"],
    ["n=10 · ρ=5%", "round → 0", "提升到 1 点 · 1 窗"],
  ];
  return (
    <Scene id="verification">
      <Head kicker="06 / 数字" title="三十三条断言" goal="位置、种子、边界、成本：每条都有名字" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 838 }}>
        <Build at={b(0)}>
          <Card label="采样器 · 18 条断言 · 22 条证据检查" accent={C.cyan} style={{ width: 838, height: 530 }} pad={20}>
            <div style={{ display: "flex", paddingBottom: 8, borderBottom: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: 1 }}>
              <div style={{ width: 300 }}>断言</div>
              <div style={{ width: 260 }}>结果</div>
              <div style={{ flex: 1 }}>口径</div>
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid " + C.panelLine, alignItems: "baseline" }}>
                <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r[0]}</div>
                <div style={{ width: 260, fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink }}>{r[1]}</div>
                <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{r[2]}</div>
              </div>
            ))}
          </Card>
        </Build>
        <Build at={b(20)}>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7 }}>
            33 条新断言（18 + 15）· 总套件 308 条 · 证据 {M.meta.checks.total} 条（{M.meta.checks.fewshot} + {M.meta.checks.efficiency}）
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 934, top: 292, width: 914 }}>
        <Build at={b(6)}>
          <Card label="效率 · 15 条断言 · 13 条证据检查" accent={C.amber} style={{ width: 914, height: 336 }} pad={20}>
            <div style={{ display: "flex", paddingBottom: 8, borderBottom: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: 1 }}>
              <div style={{ width: 150 }}>参数量</div>
              <div style={{ width: 190, textAlign: "right" }}>训练</div>
              <div style={{ width: 190, textAlign: "right" }}>推理</div>
              <div style={{ width: 190, textAlign: "right" }}>峰值</div>
              <div style={{ flex: 1, textAlign: "right" }}>MSE</div>
            </div>
            {eff.scales.map((s) => (
              <div key={s.params} style={{ display: "flex", padding: "14px 0", borderBottom: "1px solid " + C.panelLine, alignItems: "baseline", fontFamily: FONT.mono, fontSize: FT.meta }}>
                <div style={{ width: 150, color: C.ink }}>{s.params.toLocaleString("en-US")}</div>
                <div style={{ width: 190, textAlign: "right", color: C.inkDim }}>{fmtMs(s.trainMs)}</div>
                <div style={{ width: 190, textAlign: "right", color: C.inkDim }}>{fmtMs(s.inferMs)}</div>
                <div style={{ width: 190, textAlign: "right", color: C.inkDim }}>{s.peakMb.toFixed(1)} MB</div>
                <div style={{ flex: 1, textAlign: "right", color: s.mse > 0.005 ? C.coral : C.inkDim }}>{fmtMse(s.mse)}</div>
              </div>
            ))}
            <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, lineHeight: 1.7 }}>
              同预算 200 步 · 推理前 force · 峰值取 max residency；{eff.scales[2].params.toLocaleString("en-US")} 参数一档误差最大。
            </div>
          </Card>
        </Build>
        <Build at={b(24)}>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <Stat label="lazy（未求值）" value={eff.scales[0].lazyMs.toFixed(4) + " ms"} accent={C.inkFaint} style={{ width: 449, height: 150 }} valueSize={FT.h2} valueColor={C.inkDim} />
            <Stat label="forced（求值后）" value={fmtMs(eff.scales[0].inferMs)} accent={C.cyan} style={{ width: 449, height: 150 }} valueSize={FT.h2} />
          </div>
        </Build>
        <Build at={b(30)}>
          <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
            lazy 0.000743 ms → forced 0.0953 ms，差 128 倍：计时前 force 不是仪式，是正确性。
          </Body>
        </Build>
        <Build at={b(36)}>
          <Card accent={C.coral} style={{ width: 914, height: 112 }} pad={16}>
            <Body size={FT.meta} color={C.inkDim}>
              规模 162×、训练 285×、推理 119×、峰值 69×，误差却从 0.00300 走到 0.0100：
              固定 200 步预算下，大模型没有更准。这个数字保留，不做修饰。
            </Body>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};