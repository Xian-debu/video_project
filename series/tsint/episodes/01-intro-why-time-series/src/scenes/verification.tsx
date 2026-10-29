import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, beatAt, V } from "../shared";

const fmt = (n: number) => n.toLocaleString("en-US");

export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 27);
  const st = V.series.stats;
  const mods = Object.entries(V.tests.moduleCounts);
  return (
    <Scene id="verification">
      <Head kicker="05 / 四组数字" title="每个数都能回到一次运行" goal="湖快照、切片指纹、序列统计、测试计数：逐项对照，不取整" />

      <div style={{ position: "absolute", left: PAD, top: 258, width: 874 }}>
        <Build at={b(1)}>
          <Card label="第一组 · ts-admin 湖快照" accent={C.cyan} pad={18} style={{ width: 874, height: 272 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 26px" }}>
              {[
                ["日线", fmt(V.lake.barsDaily), "1990-12-19 → 2026-10-28"],
                ["分钟线", fmt(V.lake.barsMinute), "2008-10-23 → 2026-10-28"],
                ["标的", fmt(V.lake.instruments), "日线覆盖 " + fmt(V.lake.dailyCodes) + " 个代码"],
                ["体积", V.lake.sizeMb.toFixed(1) + " MB", "日线 + 分钟线 + 复权事件"],
              ].map(([k, v, d]) => (
                <div key={k}>
                  <K>{k}</K>
                  <div style={{ marginTop: 2 }}><Mono size={26} color={C.cyan}>{v}</Mono></div>
                  <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 2 }}>{d}</Body>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 968, top: 258, width: 880 }}>
        <Build at={b(7)}>
          <Card label="第二组 · 六个切片" accent={C.violet} pad={18} style={{ width: 880, height: 272 }}>
            <div style={{ display: "flex", gap: 30, alignItems: "baseline" }}>
              <div><K>{"合计行数"}</K><div><Mono size={30} color={C.violet}>{fmt(V.totals.rows)}</Mono></div></div>
              <div><K>{"合计字节"}</K><div><Mono size={30} color={C.violet}>{fmt(V.totals.bytes)}</Mono></div></div>
              <div><K>{"文件"}</K><div><Mono size={30} color={C.violet}>{V.totals.count}</Mono></div></div>
            </div>
            <div style={{ marginTop: 10, borderTop: "1px solid " + C.panelLine, paddingTop: 6 }}>
              {V.slices.map((s) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", height: 23 }}>
                  <div style={{ width: 330, fontFamily: FONT.mono, fontSize: 14, color: C.inkDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  <div style={{ width: 100, textAlign: "right" }}><Mono size={14} color={C.ink}>{fmt(s.rows)}</Mono></div>
                  <div style={{ width: 138, textAlign: "right", fontFamily: FONT.mono, fontSize: 13, color: C.inkFaint }}>{s.sha12}</div>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 548, width: 874 }}>
        <Build at={b(14)}>
          <Card label="第三组 · 600519 序列统计" accent={C.amber} pad={18} style={{ width: 874, height: 300 }}>
            <div style={{ display: "flex", gap: 26 }}>
              <div style={{ minWidth: 210 }}>
                <K>{"长度"}</K>
                <div><Num value={st.n} size={30} color={C.amber} /></div>
                <div style={{ marginTop: 2 }}><Mono size={14} color={C.inkFaint}>{"2001-08-27 → 2026-10-28"}</Mono></div>
              </div>
              <div style={{ minWidth: 330 }}>
                <K>{"lag-1 自相关"}</K>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 2 }}>
                  <Mono size={FT.micro} color={C.inkFaint}>{"价格"}</Mono><Num value={st.acfPrice} size={20} color={C.amber} />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginTop: 2 }}>
                  <Mono size={FT.micro} color={C.inkFaint}>{"收益"}</Mono><Num value={st.acfReturn} size={20} color={C.cyan} />
                </div>
              </div>
              <div style={{ minWidth: 200 }}>
                <K>{"最长间隔"}</K>
                <div><Mono size={30} color={C.coral}>{st.maxGap + " 天"}</Mono></div>
                <div style={{ marginTop: 2 }}><Mono size={14} color={C.inkFaint}>{st.maxGapFrom + " → " + st.maxGapTo}</Mono></div>
              </div>
            </div>
            <div style={{ marginTop: 12, borderTop: "1px solid " + C.panelLine, paddingTop: 8 }}>
              <Body size={FT.meta} color={C.inkFaint}>
                {"6029 个相邻间隔，156 个超过 3 天，1 个超过 30 天。数字来自 data/intro.json，由 build/generate_intro_data.py 断言后写出。"}
              </Body>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 968, top: 548, width: 880 }}>
        <Build at={b(20)}>
          <Card label="第四组 · cabal test" accent={C.cyan} pad={18} style={{ width: 880, height: 300 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <Num value={V.tests.pass} size={FT.display} color={C.cyan} />
              <Body size={FT.lead} color={C.ink}>{"条全部通过"}</Body>
              <Chip color={C.cyan}>{V.tests.modules + " 个模块"}</Chip>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
              {mods.map(([m, n]) => (
                <span key={m} style={{ fontFamily: FONT.mono, fontSize: 12, color: C.inkFaint, border: "1px solid " + C.panelLine, borderRadius: 5, padding: "1px 6px" }}>
                  {m.replace("algos.ch09.", "ch09.") + " " + n}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <K>{"GHC " + V.meta.ghc + " · cabal " + V.meta.cabal + " · 1/1 test suite passed"}</K>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 860, width: 1776 }}>
        <Build at={b(25)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <Body size={FT.lead} color={C.ink}>{"本集没有拟合结果，也没有性能数字。"}</Body>
            <K>{"这四组数只证明：管线跑通，快照可查，切片可复算，断言可重跑。"}</K>
          </div>
        </Build>
      </div>
    </Scene>
  );
};