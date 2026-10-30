import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, K, M, beatAt, fmtP } from "../shared";

const Item: React.FC<{ n: number; label: string; children: React.ReactNode; w: number; accent?: string }> = ({ n, label, children, w, accent = C.inkFaint }) => (
  <Card label={label} accent={accent} style={{ width: w, height: 244 }} pad={20}>
    <div style={{ display: "flex", gap: 14 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: accent, lineHeight: 1.1 }}>{String(n).padStart(2, "0")}</div>
      <Body size={FT.meta} color={C.inkDim} style={{ lineHeight: 1.72 }}>{children}</Body>
    </div>
  </Card>
);

/** 边界：七条不能说的话。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 21);
  return (
    <Scene id="boundary">
      <Head kicker="07 / 边界" title="七条不能说的话" goal="哪些结论成立，哪些不成立" />

      <div style={{ position: "absolute", left: PAD, top: 268, display: "flex", gap: 16 }}>
        <Build at={b(1)}><Item n={1} label="阈值" w={420} accent={C.amber}>60% 是本仓约定，书里只给密度图的读法。换阈值，结论会变。</Item></Build>
        <Build at={b(3)}><Item n={2} label="≠ 数据坏" w={420} accent={C.cyan}>真实分布本来就常常集中；要看任务是否需要尾部覆盖。</Item></Build>
        <Build at={b(5)}><Item n={3} label="信息损失" w={420}>32 天的路径、极值、顺序被压成两个数。同 μ 同 σ，可能是完全不同的窗口。</Item></Build>
        <Build at={b(7)}><Item n={4} label="不是全市场" w={420} accent={C.coral}>二十只 A 股，蓝筹只代表大盘；不能推到小盘、别的市场与别的年份。</Item></Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 528, display: "flex", gap: 16 }}>
        <Build at={b(9)}><Item n={5} label="分母会变" w={565}>同样九成样本，网格 15 与 60 的 concentrate 不同；本集固定 30 并报敏感度。</Item></Build>
        <Build at={b(11)}><Item n={6} label="不是唯一判据" w={565}>还要看任务误差、时间切分、覆盖度。集中度只是第一道体检。</Item></Build>
        <Build at={b(13)}><Item n={7} label="不能说 SOTA 无效" w={565} accent={C.violet}>只能说验证集集中在这 {M.panel20.k20} 个格子里；结论要跟着证据走。</Item></Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 800, width: 1728 }}>
        <Build at={b(16)}>
          <Card accent={C.coral} style={{ width: 1728, height: 110 }} pad={20}>
            <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>
              集中度 {fmtP(M.panel20.concentration)} 是这一份数据的属性，不是「所有 A 股」的属性。
            </Body>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
