import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 一件真事：式 (2.3) 的同一个 τ，两种读法、两个结论。 */

const Row: React.FC<{ name: string; tau: number; note: string; bad?: boolean }> = ({ name, tau, note, bad }) => (
  <div style={{ display: "flex", alignItems: "baseline", marginTop: 10 }}>
    <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{name}</div>
    <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.body, color: bad ? C.coral : C.cyan }}>{tau.toFixed(2)}</div>
    <div style={{ flex: 1 }}><Body size={FT.meta}>{note}</Body></div>
  </div>
);

export const SProblem: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.34, 0.6, 0.79]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里的写法，是把 τ 和显著性水平放在一起。
          </div>
          <Build at={lf("problem", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 860 }}>
              <Card label="书里的式 (2.3) · p.13" accent={C.cyan} style={{ height: 330 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 66, color: C.ink, lineHeight: 1.2 }}>{"τ = γ̂ / se(γ̂)"}</div>
                <Body style={{ marginTop: 18 }}>式子里有一个 τ。书里的写法，是把 τ 和显著性水平放在一起。</Body>
                <K style={{ display: "block", marginTop: 12 }}>同一个符号，两种含义，读者得自己判断是哪一种</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.08)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 312, width: 876 }}>
              <Card label="两种读法" accent={C.coral} style={{ height: 330 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <div style={{ width: 118 }}><Chip color={C.cyan}>读法一</Chip></div>
                  <Body size={FT.body} color={C.inkDim}>τ 是统计量，拿去和一张专门的临界值表比。</Body>
                </div>
                <Body size={FT.meta} style={{ marginTop: 8, marginLeft: 132 }}>结论要跨过那条线才算。</Body>
                <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: 22 }}>
                  <div style={{ width: 118 }}><Chip color={C.coral}>读法二</Chip></div>
                  <Body size={FT.body} color={C.inkDim}>τ 是 p 值，小于零点零五就判平稳。</Body>
                </div>
                <Body size={FT.meta} style={{ marginTop: 8, marginLeft: 132 }}>按这个读法，代码只有一行。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 682, width: 1776 }}>
              <Card accent={C.amber} style={{ height: 130 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>两种读法共用一个符号，含义完全不同。</div>
                <K style={{ display: "block", marginTop: 10 }}>差别不在符号，在符号后面那张表</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            按第二种读法写代码，只有一行。
          </div>
          <Build at={lf("problem", 0.37)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 860 }}>
              <CodeBlock
                title="字面实现 · 只看符号和 0.05"
                width={860}
                at={lf("problem", 0.38)}
                lines={[
                  { t: "stationary = tau < 0.05", hi: true },
                  { t: "" },
                  { t: "-- τ 是负的", dim: true },
                  { t: "-- 所以这一行几乎永远返回 True", dim: true },
                ]}
              />
            </div>
          </Build>
          <Build at={lf("problem", 0.44)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 306, width: 876 }}>
              <Card label="跑在七条序列上" accent={C.coral} style={{ height: 372 }}>
                {s.naive.rows.map((r) => (
                  <Row key={r.name} name={r.name} tau={r.tau} note={r.stationary ? "本该平稳 · 判对" : "本不平稳 · 判错"} bad={!r.stationary} />
                ))}
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.5)}>
            <div style={{ position: "absolute", left: PAD, top: 712, width: 1776 }}>
              <div style={{ display: "flex", gap: 26 }}>
                <Stat label="判成平稳" accent={C.coral} value="7 / 7" sub="包括一条随机游走、一条收盘价水平值" valueColor={C.coral} style={{ width: 874, height: 140 }} />
                <Stat label="真正的错判" accent={C.coral} value={String(s.naive.wrong)} sub="随机游走、茅台水平、带趋势、滞后八阶" valueColor={C.coral} style={{ width: 874, height: 140 }} />
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            为什么不报错？因为 τ 本来就是负的。
          </div>
          <Build at={lf("problem", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1120 }}>
              <Card label="七条序列的 τ · 全部落在 0.05 左边" accent={C.coral} style={{ height: 350 }}>
                {s.naive.rows.map((r) => {
                  const w = Math.min(1, Math.abs(r.tau) / 6);
                  return (
                    <div key={r.name} style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                      <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.name}</div>
                      <div style={{ width: 640, height: 12, background: C.panelLine, borderRadius: 3, position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 640 * w, borderRadius: 3, background: r.stationary ? C.cyan : C.coral, opacity: 0.9 }} />
                      </div>
                      <div style={{ width: 96, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: r.stationary ? C.cyan : C.coral }}>{r.tau.toFixed(2)}</div>
                    </div>
                  );
                })}
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.7)}>
            <div style={{ position: "absolute", left: PAD + 1160, top: 312, width: 616 }}>
              <Stat label="τ 的分布" accent={C.amber} value="负值区" sub="统计量的分布中心不在零附近，而在负值区" style={{ height: 170 }} />
              <Stat label="错误的形态" accent={C.coral} value="不崩" sub="它不会报错，只会一直说平稳" valueColor={C.coral} style={{ height: 170, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("problem", 0.75)}>
            <div style={{ position: "absolute", left: PAD, top: 690, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              这就是这个错误最危险的地方：它看起来工作得很好。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            正确的读法，是把 τ 和临界值比。
          </div>
          <Build at={lf("problem", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 26 }}>
              <Stat label="1% 临界值" accent={C.cyan} value="−3.43" sub="只含常数项的回归" valueColor={C.cyan} style={{ width: 574, height: 168 }} />
              <Stat label="5% 临界值" accent={C.cyan} value="−2.86" sub="最常用的一档" valueColor={C.cyan} style={{ width: 574, height: 168 }} />
              <Stat label="10% 临界值" accent={C.cyan} value="−2.57" sub="越负，越有理由拒绝单位根" valueColor={C.cyan} style={{ width: 574, height: 168 }} />
            </div>
          </Build>
          <Build at={lf("problem", 0.88)}>
            <div style={{ position: "absolute", left: PAD, top: 506, display: "flex", gap: 26 }}>
              <Card label="茅台的收盘价" accent={C.coral} style={{ width: 874, height: 210 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 46, color: C.coral }}>{s.adf.tau_level.toFixed(4)}</div>
                <Body style={{ marginTop: 10 }}>离 −2.86 还差一截；所以水平值不平稳。</Body>
              </Card>
              <Card label="做一次差分" accent={C.cyan} style={{ width: 874, height: 210 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 46, color: C.cyan }}>{s.adf.tau_diff.toFixed(4)}</div>
                <Body style={{ marginTop: 10 }}>跨过了 −2.86，判平稳。价格不平稳，收益率平稳。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.94)}>
            <div style={{ position: "absolute", left: PAD, top: 744, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "18px 26px" }}>
              <Body size={FT.body} color={C.ink}>这一集的做法：把这张表写进代码；不是把 τ 当概率，而是拿它去查表。</Body>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
