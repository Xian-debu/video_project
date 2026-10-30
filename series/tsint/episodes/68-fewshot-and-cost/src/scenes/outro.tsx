import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Stat, Chip, M, beatAt, fmtMs, fmtMse } from "../shared";

/** 收尾：三个数、成本四件套、下一集。 */
export const SOutro: React.FC = () => {
  const b = (i: number) => beatAt("outro", i, 24);
  const w = M.window;
  const self = M.efficiency.selfCheck;
  const r = M.efficiency.ratios;
  const s0 = M.efficiency.scales[0];
  const s2 = M.efficiency.scales[2];
  return (
    <Scene id="outro">
      <Head kicker="08 / 收尾" title="三个数，四件套" goal="采样协议先于模型" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 820 }}>
        <Build at={b(0)}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="预算" value={w.budget} sub="5% × 1,000" accent={C.cyan} style={{ width: 262, height: 210 }} />
            <Stat label="训练窗" value="1,000" sub="点 · 后 200 测试" accent={C.violet} style={{ width: 262, height: 210 }} />
            <Stat label="参数量" value={self.params} sub="48 + 272 + 17" accent={C.amber} style={{ width: 262, height: 210 }} />
          </div>
        </Build>
        <Build at={b(6)}>
          <Card label="成本四件套（同预算 200 步）" accent={C.cyan} style={{ width: 820, height: 306, marginTop: 20 }} pad={18}>
            <div style={{ display: "flex", paddingBottom: 8, borderBottom: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              <div style={{ flex: 1 }}>指标</div><div style={{ width: 220, textAlign: "right" }}>105 参数</div><div style={{ width: 220, textAlign: "right" }}>17,025 参数</div><div style={{ width: 130, textAlign: "right" }}>倍数</div>
            </div>
            {[
              ["训练时间", fmtMs(s0.trainMs), fmtMs(s2.trainMs), r.train + "×"],
              ["推理时间", fmtMs(s0.inferMs), fmtMs(s2.inferMs), r.infer + "×"],
              ["峰值内存", s0.peakMb.toFixed(1) + " MB", s2.peakMb.toFixed(1) + " MB", r.peak + "×"],
              ["误差 MSE", fmtMse(s0.mse), fmtMse(s2.mse), r.mse + "×"],
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
                <div style={{ flex: 1, fontFamily: FONT.sans }}>{row[0]}</div>
                <div style={{ width: 220, textAlign: "right" }}>{row[1]}</div>
                <div style={{ width: 220, textAlign: "right" }}>{row[2]}</div>
                <div style={{ width: 130, textAlign: "right", color: i === 3 ? C.coral : C.amber }}>{row[3]}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              越大越慢，也未必越准；误差不是单调下降。
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 936, top: 292, width: 912 }}>
        <Build at={b(10)}>
          <Card label="一句话" accent={C.coral} style={{ width: 912, height: 210 }} pad={24}>
            <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, lineHeight: 1.5 }}>
              采样先定协议：窗口类型、锚点、窗宽、种子，四个都写死；再报成本：参数量、训练、推理、峰值内存。
            </Body>
          </Card>
        </Build>
        <Build at={b(14)}>
          <Card label="下一集 · 69" accent={C.violet} style={{ width: 912, height: 236, marginTop: 20 }} pad={22}>
            <Body size={FT.h2} color={C.ink} style={{ fontFamily: FONT.serif }}>你的基准数据集均衡吗？</Body>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>
              50,000 个窗口投影到 PCA 平面，用 hexbin 密度图看「前 20% 的格子」覆盖了多少样本；
              再用三只蓝筹股对照。
            </Body>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Chip color={C.violet}>PCA</Chip>
              <Chip color={C.violet}>hexbin</Chip>
              <Chip color={C.violet}>5 万窗口</Chip>
            </div>
          </Card>
        </Build>
        <Build at={b(20)}>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            50 / 1,000 / 337 · 数据 {M.data.rows} 行 · {M.meta.tests.suite} 条断言
          </div>
        </Build>
      </div>
    </Scene>
  );
};