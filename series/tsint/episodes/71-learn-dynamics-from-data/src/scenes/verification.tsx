import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Mono, Num, Plot, beatAt, NEURAL } from "../shared";

/** 验证：每个数字都能回到一次运行。 */
export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 29);
  const k = NEURAL.key;
  const sin = NEURAL.neuralSin;
  const st = NEURAL.neuralStock;
  const pw = 780, ph = 230;
  const PX = (t: number) => 54 + t * (pw - 76);

  return (
    <Scene id="verification">
      <Head kicker="05 / 验证" title="每个数字都能回到一次运行" goal="闭式解、轨迹、误差、成本：逐项对照证据文件" />

      <div style={{ position: "absolute", left: PAD, top: 264, width: 840 }}>
        <Build at={b(0)}>
          <Card label="合成数据 · sin(2πt) · 6 个训练窗" accent={C.amber} pad={14}>
            <Plot
              w={pw} h={ph} at={b(0)} dur={60}
              x={PX} y={(v) => ph - 42 - ((v + 1.3) / 2.9) * (ph - 68)}
              series={[
                { pts: sin.map((p) => ({ x: p.t, y: p.truth })), color: C.inkDim, width: 2.2 },
                { pts: sin.map((p) => ({ x: p.t, y: p.pred })), color: C.amber, width: 2.6, dash: true },
              ]}
              grid={{ x: [0, 0.5, 1], y: [-1, 0, 1], fmtX: (v) => (v === 0 ? "0" : v === 1 ? "1" : "0.5"), fmtY: (v) => v.toFixed(1) }}
            />
            <div style={{ display: "flex", gap: 22 }}>
              <Mono size={FT.micro} color={C.inkDim}>{"— 精确解"}</Mono>
              <Mono size={FT.micro} color={C.amber}>{"— 训练后的 f_θ 积分"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"整段 RMSE 0.7499706868863578"}</Mono>
            </div>
          </Card>
        </Build>

        <Build at={b(5)} style={{ marginTop: 14 }}>
          <Card label="真实数据 · sz000001 · 12 个训练窗" accent={C.violet} pad={14}>
            <Plot
              w={pw} h={ph} at={b(5)} dur={60}
              x={PX} y={(v) => ph - 42 - ((v - 0.7) / 3.2) * (ph - 68)}
              series={[
                { pts: st.map((p) => ({ x: p.t, y: p.truth })), color: C.inkDim, width: 2.2 },
                { pts: st.map((p) => ({ x: p.t, y: p.pred })), color: C.violet, width: 2.6, dash: true },
              ]}
              grid={{ x: [0, 0.5, 1], y: [1, 2, 3], fmtX: (v) => (v === 0 ? "0" : v === 1 ? "1" : "0.5"), fmtY: (v) => v.toFixed(0) }}
            />
            <div style={{ display: "flex", gap: 22 }}>
              <Mono size={FT.micro} color={C.inkDim}>{"— 真实"}</Mono>
              <Mono size={FT.micro} color={C.violet}>{"— f_θ 积分"}</Mono>
              <Mono size={FT.micro} color={C.inkFaint}>{"整段 RMSE 0.45960674293569964"}</Mono>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 920, top: 264, width: 920 }}>
        <Build at={b(8)}>
          <Card label="第一组 · 常数模型 · 合成数据" accent={C.amber} pad={14} style={{ width: 900 }}>
            <div style={{ display: "flex", gap: 34 }}>
              {[["真实 k", k.kTrue, C.inkDim], ["闭式 k̂", k.kClosed, C.cyan], ["梯度下降 k̂", k.kGrad, C.violet]].map(([lab, v, col]) => (
                <div key={lab as string}>
                  <Mono size={FT.micro} color={C.inkFaint}>{lab as string}</Mono>
                  <div><Num value={v as number} size={26} color={col as string} /></div>
                </div>
              ))}
            </div>
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 12 }}>
          <Card label="第二组 · 常数模型 · 真实数据" accent={C.cyan} pad={14} style={{ width: 900 }}>
            <div style={{ display: "flex", gap: 46, alignItems: "baseline" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"k̂"}</Mono> <div><Num value={k.kStock} size={28} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"R²"}</Mono> <div><Num value={k.r2Stock} size={28} color={C.violet} /></div></div>
             
            </div>
          </Card>
        </Build>

        <Build at={b(16)} style={{ marginTop: 12 }}>
          <Card label="第三组 · 轨迹误差：窗口内 vs 整段" accent={C.violet} pad={14} style={{ width: 900 }}>
            <div style={{ display: "flex", gap: 30 }}>
              <div style={{ flex: 1 }}>
                <Mono size={FT.micro} color={C.amber}>{"sin · MSE 0.004183903121311322"}</Mono>
                <div style={{ marginTop: 4, display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"25 步 RMSE"}</Mono><Num value={k.rmseSin25} size={22} color={C.ink} /></div>
                <div style={{ marginTop: 2, display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"整段 RMSE"}</Mono><Num value={k.rmseSinFull} size={22} color={C.amber} /></div>
              </div>
              <div style={{ flex: 1 }}>
                <Mono size={FT.micro} color={C.violet}>{"stock · MSE 0.007876871203340616"}</Mono>
                <div style={{ marginTop: 4, display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"50 步 RMSE"}</Mono><Num value={k.rmseStock50} size={22} color={C.ink} /></div>
                <div style={{ marginTop: 2, display: "flex", gap: 8, alignItems: "baseline" }}><Mono size={FT.micro} color={C.inkFaint}>{"整段 RMSE"}</Mono><Num value={k.rmseStockFull} size={22} color={C.violet} /></div>
              </div>
            </div>
            <div style={{ marginTop: 8 }}><Mono size={FT.micro} color={C.inkFaint}>{"窗口内插值好，整段外推就掉队：这是训练目标只在给定时刻算损失的直接后果。"}</Mono></div>
          </Card>
        </Build>

        <Build at={b(22)} style={{ marginTop: 12 }}>
          <Card label="第四组 · 训练成本" accent={C.amber} pad={14} style={{ width: 900 }}>
            <div style={{ display: "flex", gap: 36, alignItems: "baseline" }}>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"训练耗时 / s"}</Mono> <div><Num value={k.trainSeconds} size={26} color={C.amber} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"前向 / epoch"}</Mono> <div><Num value={674} size={26} color={C.cyan} /></div></div>
              <div><Mono size={FT.micro} color={C.inkFaint}>{"epoch"}</Mono> <div><Num value={300} size={26} color={C.inkDim} /></div></div>
            </div>
            <div style={{ marginTop: 4 }}><Mono size={FT.micro} color={C.inkFaint}>{"337 个参数 × 中心差分两次扰动；固定 seed，数字可重跑。"}</Mono></div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};