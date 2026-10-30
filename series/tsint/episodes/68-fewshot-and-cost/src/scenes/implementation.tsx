import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, M, beatAt } from "../shared";

const Code: React.FC<{ lines: string[]; color?: string }> = ({ lines, color = C.ink }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: FT.code, color, lineHeight: 1.85, whiteSpace: "pre" }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

/** 实现：采样器纯函数 + 参数量手算 + 计时协议。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 45);
  const eff = M.efficiency;
  const self = eff.selfCheck;
  return (
    <Scene id="implementation">
      <Head kicker="05 / 两个模块" title="采样器与效率三件套" goal="337 = 48 + 272 + 17 · 计时前必须 force" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 576 }}>
        <Build at={b(0)}>
          <Card label="sampleFewShot" accent={C.cyan} style={{ width: 576, height: 660 }} pad={20}>
            <Code lines={[
              "data FewShotCfg = FewShotCfg",
              "  { rho, kind, anchor, window, seed }",
              "",
              "sampleFewShot :: FewShotCfg",
              "  -> V.Vector a",
              "  -> (V.Vector a, [Int])",
            ]} color={C.cyan} />
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <Code lines={[
              "kp = max 1 (round (rho*n))",
              "kw = min (n div w)",
              "         (max 1 (round (rho*n/w)))",
              "",
              "front  = [0 .. kw*w-1]",
              "back   = [n-kw*w .. n-1]",
              "uniform= [floor (i*(n-w)/(k-1)+1e-9)]",
              "random = take k (sortOn lcgKey [0..n-w])",
            ]} />
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <Body size={FT.meta} color={C.inkFaint}>
              索引一定返回：否则无法复核「50 个点落在哪」。
              非法组合（点×均匀、点×随机）直接 error，不是返回空。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD + 600, top: 292, width: 576 }}>
        <Build at={b(14)}>
          <Card label="参数量 · 不手填" accent={C.violet} style={{ width: 576, height: 660 }} pad={20}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.mono, lineHeight: 2.0 }}>
              <div>W1  2×16 + 16  = <span style={{ color: C.amber }}>48</span></div>
              <div>W2  16×16 + 16 = <span style={{ color: C.amber }}>272</span></div>
              <div>W3  16×1 + 1   = <span style={{ color: C.amber }}>17</span></div>
              <div style={{ borderTop: "1px solid " + C.panelLine, marginTop: 8, paddingTop: 8, color: C.ink }}>
                |θ| = 48 + 272 + 17 = <span style={{ color: C.cyan, fontSize: FT.h2 }}>{self.params}</span>
              </div>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <Body size={FT.meta} color={C.inkFaint}>
              同样的两层、同样 16 个隐藏单元，输入若只有 1 维：
              第一层少 16 个权重 → {self.oneInput}。计划写 337，所以模型用两个滞后输入
              （t−1、t−2），画面两边并排。
            </Body>
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <Code lines={[
              "shape  = [2, 16, 16, 1]",
              "layout = [48, 272, 17]",
              "params = 337",
            ]} color={C.inkDim} />
            <div style={{ marginTop: 12 }}><K>三规模：2→8→8 / 2→32→32 / 2→128→128</K></div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD + 1200, top: 292, width: 576 }}>
        <Build at={b(29)}>
          <Card label="效率三件套 · 协议" accent={C.amber} style={{ width: 576, height: 660 }} pad={20}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.code, color: C.ink, lineHeight: 1.9 }}>
              warm-up × {eff.protocol.warmup}<br />
              measure × {eff.protocol.reps} → 中位数<br />
              train {eff.protocol.steps} step · batch {eff.protocol.batch} · lr {eff.protocol.lr}<br />
              n = {eff.protocol.n}（train {eff.protocol.train} / test {eff.protocol.test}）
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <Body size={FT.meta} color={C.inkFaint}>
              推理前必须 force：不 force 测到的是 thunk，不是计算。
              峰值内存不靠估算，取 RTS 统计的 max residency。
            </Body>
            <div style={{ height: 1, background: C.panelLine, margin: "14px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {eff.scales.map((s) => (
                <div key={s.params} style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
                  <span>{s.params} 参数</span>
                  <span>{s.trainMs >= 1000 ? (s.trainMs / 1000).toFixed(1) + " s" : s.trainMs.toFixed(1) + " ms"}</span>
                  <span style={{ color: C.inkFaint }}>{s.peakMb.toFixed(1)} MB</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <Body size={FT.meta} color={C.coral}>同预算 200 步：大模型不一定更准。</Body>
            </div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
