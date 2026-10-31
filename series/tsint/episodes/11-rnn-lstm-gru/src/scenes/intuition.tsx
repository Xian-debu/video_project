import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, KV, M, PAD, Pages, Row, Scene, SceneHead, lf } from "../shared";

/* 直觉：三条路。乘法链 / 加法通路 / 门控插值。 */

const Path: React.FC<{ label: string; accent: string; formula: React.ReactNode; note: string; lines: string[]; width: number }> = ({ label, accent, formula, note, lines, width }) => (
  <Card label={label} accent={accent} style={{ width, height: 596 }}>
    <Formula size={25} color={accent} style={{ marginBottom: 12 }}>{formula}</Formula>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginBottom: 14 }}>{note}</div>
    {lines.map((t, i) => (
      <div key={i} style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div style={{ width: 6, background: accent, borderRadius: 3, flexShrink: 0, opacity: 0.7 }} />
        <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.5 }}>{t}</div>
      </div>
    ))}
  </Card>
);

export const SIntuition: React.FC = () => {
  const m = M;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={[0, 0.3, 0.58, 0.82]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看三条路，不用数字。
          </div>
          <Build at={lf("intuition", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 25 }}>
              <Path
                label="RNN · 乘法链"
                accent={C.cyan}
                formula="h_t = σ(W_xh x_t + W_hh h_t−1 + b_h)"
                note="式 (2.49) (2.50)"
                lines={[
                  "h 一由 h 零算出，h 二由 h 一算出。",
                  "梯度回去必须原路穿过每一个环节。",
                  "每一环乘一个矩阵和一个导数。",
                  "链越长，连乘越多。",
                  "消失不是 bug，是结构。",
                ]}
                width={570}
              />
              <Path
                label="LSTM · 加法通路"
                accent={C.violet}
                formula="c_t = f_t ⊙ c_t−1 + i_t ⊙ c̃_t"
                note="式 (2.56)"
                lines={[
                  "cell 沿时间走，只做加法和逐元素乘。",
                  "梯度沿 c 回去，只乘一个 f。",
                  "f 接近一，信号就能一直传。",
                  "门是旋钮：f 管忘，i 管记。",
                  "输出门 o 决定这一刻露多少。",
                ]}
                width={570}
              />
              <Path
                label="GRU · 门控插值"
                accent={C.amber}
                formula="h_t = (1 − z_t) ⊙ h_t−1 + z_t ⊙ h̃_t"
                note="式 (2.61)"
                lines={[
                  "把 cell 和隐藏状态合成一个 h。",
                  "z 是插值系数：零保留，一整段改写。",
                  "r 是重置门，决定用多少旧状态。",
                  "两个门，一组候选。",
                  "参数比 LSTM 少四分之一。",
                ]}
                width={570}
              />
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            门不是装饰：每个门管一个方向的流量。
          </div>
          <Build at={lf("intuition", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1140 }}>
              <Card label="LSTM 的四个门 · 布局与本文实现" accent={C.violet} style={{ width: 1140, height: 560 }}>
                <KV k="遗忘门 f · 管旧 cell 留多少" v="σ(W_f x + U_f h + b_f)" note="本仓偏置初值取一" color={C.violet} />
                <KV k="输入门 i · 管新候选写多少" v="σ(W_i x + U_i h + b_i)" note="写进去的份额" />
                <KV k="候选 c̃ · 要写的内容本身" v="tanh(W_c x + U_c h + b_c)" note="四门里唯一不是 σ 的" />
                <KV k="输出门 o · 往外露多少" v="σ(W_o x + U_o h + b_o)" note="h = o ⊙ tanh(c)" />
                <KV k="四门同形 · 每门 252" v="12 × 8 + 12 × 12 + 12" note="共享一套 4H 的布局" color={C.violet} />
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 1180, top: 312, width: 596 }}>
              <Card label="秘密在哪" accent={C.cyan} style={{ width: 596, height: 560 }}>
                <Body>门的数量不是秘密。秘密是 c 那条加法通路：梯度不必穿过四组矩阵。</Body>
                <div style={{ fontFamily: FONT.mono, fontSize: 46, color: C.cyan, marginTop: 26, fontVariantNumeric: "tabular-nums" }}>{m.grad.transfer20.toFixed(4)}</div>
                <Body size={FT.meta} style={{ marginTop: 10 }}>f = 0.999 时，二十步后 cell 还能传 98%。</Body>
                <K style={{ display: "block", marginTop: 18 }}>0.999^20，与式 (2.56) 的加法项一致</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            GRU 只有两个旋钮，行为可以逐条读出来。
          </div>
          <Build at={lf("intuition", 0.61)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1776 }}>
              <Card label="两个极端与两个门 · 都能用手算钉住" accent={C.amber} style={{ width: 1776, height: 430 }}>
                <Row name="z → 0" value="h_t = h_t−1" note="更新门关死：旧状态原样保留，新信息一点不写" color={C.amber} width={1710} />
                <Row name="z → 1" value="h_t = h̃_t" note="更新门全开：整段改写，旧状态被候选顶掉" color={C.amber} width={1710} />
                <Row name="r → 0" value="h̃_t = tanh(b_h)" note="重置门关死：候选完全看不到旧状态" width={1710} />
                <Row name="r → 1" value="h̃_t = tanh(W_h x + U_h h_t−1 + b_h)" note="重置门全开：候选照常用旧状态" width={1710} />
                <Row name="注意" value="r 只乘在 h_t−1 上" note="不是乘在候选上，顺序错了数值全变" color={C.coral} width={1710} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三条路放在一起，差别只有一句。
          </div>
          <Build at={lf("intuition", 0.85)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={44} style={{ color: C.ink }}>梯度回去时，乘的是矩阵，还是乘一个接近一的标量？</Formula>
            </div>
          </Build>
          <Build at={lf("intuition", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 430, display: "flex", gap: 26 }}>
              <Card label="这句话解释了公式" accent={C.cyan} style={{ width: 875, height: 280 }}>
                <Body>乘法链会指数衰减，加法通路能保住信号。这是结构层面的事实，与数据无关。</Body>
              </Card>
              <Card label="但它解释不了训练" accent={C.coral} style={{ width: 875, height: 280 }}>
                <Body>f 是学出来的，不是给定的。它能不能学到 0.999，要看数据、预算、初始化。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("intuition", 0.95)}>
            <div style={{ position: "absolute", left: PAD, top: 760, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>结构给假设</Chip>
              <Chip color={C.amber}>实验给判决</Chip>
              <Chip color={C.violet}>先把式子摆清楚</Chip>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
