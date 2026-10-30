import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, M, beatAt, fmtInt, fmtP, fmtSci } from "../shared";

/** 验证：数据体检的十二行 + 证据与断言。 */
export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 31);
  const p = M.panel20;
  const q = M.blue3;
  const rows: [string, string, string][] = [
    ["原始行数", fmtInt(M.data.rows), M.data.codes + " 只 · 2015–2025"],
    ["窗口数", fmtInt(p.windows), "32 日 / 窗 · 逐日滑 1 步"],
    ["占用格子", fmtInt(p.occupiedBins), "六边形 30×30"],
    ["前 20% 格子", String(p.k20), "max 1 (round(0.2 × 333))"],
    ["集中度", fmtP(p.concentration), "本仓判据 60%"],
    ["最大格子", fmtInt(p.maxBinCount), "占 " + fmtP(M.topBinShare)],
    ["反变换最大误差", fmtSci(p.reconMaxErr), "投影 → 反变换"],
    ["λ1 + λ2", (p.lam1 + p.lam2).toFixed(6), "恒等于 2"],
    ["蓝筹窗口", fmtInt(q.windows), "3 只 · " + q.occupiedBins + " 格"],
    ["蓝筹集中度", fmtP(q.concentration), "前 20% = " + q.k3 + " 格"],
    ["数据 sha256", M.data.sha256.slice(0, 12) + "…", "证据 JSON 同源"],
    ["网格敏感度", "15 → 60", "0.9213 → 0.8623"],
  ];
  return (
    <Scene id="verification">
      <Head kicker="06 / 数字" title="二十三个断言，十二条检查" goal="每个数都能回到一条断言" />

      <div style={{ position: "absolute", left: PAD, top: 264, width: 1040 }}>
        <Build at={b(2)}>
          <Card label="数据体检 · 全部 A 级" accent={C.cyan} style={{ width: 1040 }} pad={22}>
            {rows.map((r, i) => (
              <div key={r[0]} style={{ display: "flex", alignItems: "baseline", height: 45, borderBottom: i === rows.length - 1 ? "none" : "1px solid rgba(34,48,63,0.5)" }}>
                <div style={{ width: 280, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r[0]}</div>
                <div style={{ width: 290, fontFamily: FONT.mono, fontSize: FT.body, color: i === 4 || i === 5 ? C.coral : C.ink }}>{r[1]}</div>
                <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, textAlign: "right" }}>{r[2]}</div>
              </div>
            ))}
          </Card>
        </Build>
        <Build at={b(25)}>
          <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            十五条数字、十二条证据检查、二十三条断言，全部 pass；总套件三百三十一条。
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1132, top: 264, width: 640 }}>
        <Build at={b(16)}>
          <Card label="证据 · 一次具体运行" accent={C.amber} style={{ width: 640, height: 320 }} pad={20}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <K>证据检查</K>
                <div><Mono size={FT.h2} color={C.amber}>12</Mono></div>
              </div>
              <div>
                <K>断言</K>
                <div><Mono size={FT.h2} color={C.amber}>23</Mono></div>
              </div>
              <div>
                <K>总套件</K>
                <div><Mono size={FT.h2} color={C.amber}>331</Mono></div>
              </div>
            </div>
            <Body size={FT.meta} style={{ lineHeight: 1.8 }}>
              GHC 9.14.1 · cabal 3.16.1.0<br />
              ts-base HEAD {M.meta.tsBaseHead.slice(0, 7)} · 证据 {M.meta.tsBaseCommit.slice(0, 7)}<br />
              ts-admin {M.meta.tsAdminHead.slice(0, 7)} · 运行 {M.meta.evidenceRunAt}
            </Body>
          </Card>
        </Build>

        <Build at={b(21)}>
          <Card label="断言不是装饰" accent={C.inkFaint} style={{ width: 640, height: 180, marginTop: 14 }} pad={18}>
            <Body size={FT.meta} style={{ lineHeight: 1.8 }}>
              2.78e-17 与 92.04% 不是两次独立计算：<br />
              证据生成器调用的是同一批库函数。<br />
              屏幕上的数 = summary.json = 证据 tests。
            </Body>
          </Card>
        </Build>

        <Build at={b(26)}>
          <Card label="复现命令 · 一行" accent={C.cyan} style={{ width: 640, height: 150, marginTop: 14 }} pad={18}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink, lineHeight: 1.6 }}>
              cabal run -v0 tsbase -- evidence-ch08-hexbin<br />
              --data data/episodes/69-hexbin-balance-audit<br />
              --out data/episodes/69-hexbin-balance-audit<br />
              --evidence inventory/evidence
            </div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
