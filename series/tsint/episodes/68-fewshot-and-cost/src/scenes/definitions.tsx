import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Chip, Quote, M, beatAt } from "../shared";

const Code: React.FC<{ lines: string[]; color?: string }> = ({ lines, color = C.ink }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: FT.code, color, lineHeight: 1.9, whiteSpace: "pre" }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

/** 定义：预算、四个锚点、合法边界。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 42);
  const w = M.window;
  const bd = M.boundary;
  return (
    <Scene id="definitions">
      <Head kicker="03 / 定义" title="窗口、点、合法与非法" goal="6 个合法组合 + 2 个反例 + 1 条取整边界" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 576 }}>
        <Build at={b(0)}>
          <Card label="1 · 预算与窗口数" accent={C.cyan} style={{ width: 576, height: 440 }} pad={20}>
            <Code lines={[
              "ρ = 0.05   n_train = 1000",
              "budget = max 1 (round (ρ·n))",
              "       = 50",
              "w = 5",
              "k = min (n div w) (budget div w)",
              "  = 50 / 5 = 10 窗",
              "总点数 = k × w = 50",
            ]} />
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <Body size={FT.meta} color={C.inkFaint}>
              预算按「点」算，窗口是采样单元。窗宽 5、预算 50 → 固定 10 个窗口；
              前端十个窗口首尾相接，正好 0–49。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD + 600, top: 292, width: 576 }}>
        <Build at={b(9)}>
          <Card label="2 · 四个锚点" accent={C.violet} style={{ width: 576, height: 440 }} pad={20}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 2.0 }}>
              <div style={{ color: C.cyan }}>front    [0 .. k·w−1]</div>
              <div style={{ color: C.cyan }}>back     [n−k·w .. n−1]</div>
              <div style={{ color: C.amber }}>uniform  floor(i·(n−w)/(k−1) + 1e−9)</div>
              <div style={{ color: C.violet }}>random   LCG(seed) 排序取前 k</div>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <Body size={FT.meta} color={C.inkFaint}>
              锚点之外再加「采样单元」：窗口采样取 5 点宽的一段，点采样只取 1 点。
              点采样的前/后端仍取连续段，不能撒点。
            </Body>
            <div style={{ marginTop: 10 }}><Mono size={FT.micro} color={C.inkFaint}>1e−9 削浮点噪声；k=10、w=5 → 均匀起点 0, 110, …, 995（末窗止于 999）</Mono></div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD + 1200, top: 292, width: 576 }}>
        <Build at={b(17)}>
          <Card label="3 · 合法与反例" accent={C.coral} style={{ width: 576, height: 440 }} pad={20}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["窗口×前", "窗口×后", "窗口×均匀", "窗口×随机", "点×前", "点×后"].map((t) => (
                <span key={t} style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid " + C.cyan, color: C.cyan, fontFamily: FONT.mono, fontSize: FT.micro }}>{t} ✓</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Chip>点×均匀 等距 ✗</Chip>
              <Chip>点×随机 撒点 ✗</Chip>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <div style={{ fontFamily: FONT.mono, fontSize: FT.code, color: C.ink, lineHeight: 1.9 }}>
              n = {bd.n}, ρ = {bd.rho}<br />
              round(0.5) = {bd.rawRound}<br />
              → 至少 {bd.liftedPoints} 点 / {bd.windows} 窗
            </div>
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 10 }}>
              四舍五入会得到 0 个点；口径写死「至少 1」，文档、画面、测试三处一致。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 756, width: 1776 }}>
        <Build at={b(30)}>
          <Quote width={1776} label="原文 · p.203–204 · 8.6.1" lines={[
            "窗口采样：以连续时间窗口为单元提取片段，适配大模型的序列建模能力。前端窗口捕获初始模式，后端窗口提取最新动态，均匀窗口保证全局覆盖，随机窗口增强分布鲁棒性。",
            "点采样：由于需保证单个样本的时间连续性，在固定采样率（如 5%）下无法随机离散选择点，因此仅采用位置策略。",
          ]} />
        </Build>
      </div>
    </Scene>
  );
};