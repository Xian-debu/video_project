import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { ADC, Body, Card, Head, Mono, PAD, Pill, Plate, Scene, beatAt, pct } from "../shared";
import { SCENES } from "../script";

/* 06 ADC：不加采样保持，怎么记住上一帧。
   左边是 §4.2.1 的算例，三拍：① 这一帧进来 ② 上一帧的码打回 CDAC ③ Cτ 注入 ±τ 做两次比较。
   右边是原文 Figure 6 的三阶段。所有数字来自 data/adc.json（derived，synthetic 标记），
   与 claims 的 adc-* 七条逐条对齐。 */

const mv = (v: number): string => (v * 1000).toFixed(0);

const Step: React.FC<{ i: string; cn: string; en: string; color: string; at: number; children: React.ReactNode }> = ({ i, cn, en, color, at, children }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ opacity: pct(f, at, at + 12), display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid " + C.panelLine }}>
      <div style={{ width: 5, background: color, borderRadius: 3, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <Mono size={FT.meta} color={C.inkFaint}>{i}</Mono>
          <span style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{cn}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: FT.tiny, color: C.inkFaint, letterSpacing: FT_T.meta }}>{en}</span>
        </div>
        <div style={{ marginTop: 6 }}>{children}</div>
      </div>
    </div>
  );
};

const Branch: React.FC<{ sign: string; tau: string; vminus: number; comp: number; at: number }> = ({ sign, tau, vminus, comp, at }) => {
  const f = useCurrentFrame();
  const ok = comp === 1;
  return (
    <div style={{ opacity: pct(f, at, at + 12), display: "flex", alignItems: "baseline", gap: 10, padding: "5px 0" }}>
      <Mono size={FT.label} color={C.violet} style={{ width: 56 }}>{sign}</Mono>
      <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>注入</span>
      <Mono size={FT.label} color={C.ink}>{sign === "+τ" ? "+" + tau : "−" + tau} mV</Mono>
      <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>→ V− =</span>
      <Mono size={FT.label} color={C.ink}>{mv(vminus)} mV</Mono>
      <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>→ 比较器</span>
      <Mono size={FT.h2} color={ok ? C.cyan : C.coral}>{String(comp)}</Mono>
    </div>
  );
};

export const SAdc: React.FC = () => {
  const f = useCurrentFrame();
  const id = "adc";
  const s = SCENES.find((x) => x.id === id)!;
  const t1 = beatAt(id, 1, 12);
  const t2 = beatAt(id, 2, 12);
  const t3 = beatAt(id, 3, 12);
  const t4 = beatAt(id, 4, 12);
  const t5 = beatAt(id, 5, 12);
  const t6 = beatAt(id, 6, 12);
  const t7 = beatAt(id, 7, 12);
  const t8 = beatAt(id, 8, 12);
  const t9 = beatAt(id, 9, 12);
  const t10 = beatAt(id, 10, 12);
  const t11 = beatAt(id, 11, 12);

  const vin = ADC.sar.vin;
  const vdac = ADC.cDAC.reconstructed_v;
  const code = ADC.cDAC.prev_code;
  const res = mv(ADC.similarity.delta_v);
  const tau = mv(ADC.similarity.tau_v);
  const [plus, minus] = ADC.similarity.cases;
  const cmp = ADC.comparison_count;

  return (
    <Scene id={id}>
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />

      {/* 左：§4.2.1 的算例，三拍 */}
      <div style={{ position: "absolute", left: PAD, top: 278, width: 660 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: pct(f, t1, t1 + 12) }}>
          <Mono size={FT.meta} color={C.inkFaint} style={{ letterSpacing: FT_T.meta }}>§4.2.1 算例</Mono>
          <div style={{ flex: 1, height: 1, background: C.panelLine }} />
          <Pill text={"V_REF = 1 V"} color={C.inkDim} bg="rgba(255,255,255,0.04)" />
        </div>

        <Step i="①" cn="这一帧进来" en="sampling" color={C.cyan} at={t2}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <Mono size={FT.num} color={C.ink}>{vin.toFixed(3)}</Mono>
            <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>V 的像素电压，先给 C_L 充上</span>
          </div>
        </Step>

        <Step i="②" cn="上一帧的码打回 CDAC" en="reconstruction" color={C.violet} at={t4}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <Mono size={FT.meta} color={C.inkDim}>SRAM 里存着上帧码</Mono>
            <Mono size={FT.h2} color={C.violet}>{code}</Mono>
            <Mono size={FT.meta} color={C.inkDim}>→ V_DAC =</Mono>
            <Mono size={FT.num} color={C.ink}>{vdac.toFixed(2)}</Mono>
            <Mono size={FT.meta} color={C.inkDim}>V</Mono>
          </div>
        </Step>

        <Step i="③" cn="先看差了多少" en="residual" color={C.amber} at={t6}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <Mono size={FT.meta} color={C.inkDim}>{vin.toFixed(3)} − {vdac.toFixed(2)} =</Mono>
            <Mono size={FT.num} color={C.amber}>{res}</Mono>
            <Mono size={FT.meta} color={C.inkDim}>mV，落在 ±{tau} mV 以内</Mono>
          </div>
        </Step>

        {/* 关键：不是直接比大小，而是注入 ±τ 再比两次 */}
        <div style={{ marginTop: 16, opacity: pct(f, t7, t7 + 14) }}>
          <Card label="不直接比大小：Cτ 注入 ±τ，比两次" accent={C.violet} pad={16}>
            <Branch sign="+τ" tau={tau} vminus={plus.vminus_v} comp={plus.comparator} at={t7 + 8} />
            <Branch sign="−τ" tau={tau} vminus={minus.vminus_v} comp={minus.comparator} at={t8} />
            <div style={{ borderTop: "1px solid " + C.panelLine, marginTop: 8, paddingTop: 10, opacity: pct(f, t9, t9 + 12) }}>
              <Body size={FT.label} color={C.ink}>
                两次结果不同 → 差值小于 τ ≈ {tau} mV，<span style={{ color: C.cyan }}>判为相似</span>，不用转。
              </Body>
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 12, opacity: pct(f, t10, t10 + 14) }}>
          <Mono size={FT.meta} color={C.inkFaint}>比较次数</Mono>
          <Mono size={FT.h2} color={C.inkFaint}>{cmp.full_sar}</Mono>
          <span style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.inkFaint }}>→</span>
          <Mono size={FT.h2} color={C.cyan}>{cmp.similarity_mode}</Mono>
          <Body size={FT.meta} color={C.inkDim}>完整 SAR 十次，相似模式两次。</Body>
        </div>
      </div>

      {/* 右：原文 Figure 6 的三阶段 */}
      <div style={{ position: "absolute", left: 744, top: 280, width: 1104, opacity: pct(f, t1 + 6, t1 + 20) }}>
        <Plate id="fig6" width={1104} caption="原文 Figure 6：① 采样保持 ② 上一帧重建 ③ 阈值比较（底部是 CDAC 的比较结果）" />
      </div>

      <div style={{ position: "absolute", left: 744, top: 748, width: 1104, opacity: pct(f, t11, t11 + 12) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 5, height: 26, background: C.cyan, borderRadius: 3 }} />
          <Body size={FT.label} color={C.inkDim}>
            关键是 <span style={{ color: C.ink }}>Cτ 只占主阵列的 0.5%</span> —— 注入只挪几毫伏，不会把比较结果带偏。
          </Body>
        </div>
      </div>
    </Scene>
  );
};
