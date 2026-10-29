import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, beatAt, V } from "../shared";

const STEP = [
  ["01", "ts-admin 湖", "一条命令，1.39 GB 的日线与分钟线"],
  ["02", "6 个演示切片", "48,489 行，覆盖单票、面板、停牌、分钟"],
  ["03", "manifest 指纹", "每个切片都有行数、字节与原文件 sha256"],
  ["04", "ts-base 断言", "Haskell 实现，cabal test 142 条全过"],
];

export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 31);
  return (
    <Scene id="implementation">
      <Head kicker="04 / 管线" title="每个数都能回到一次运行" goal="湖 → 六个 CSV 切片 → manifest 指纹 → Haskell 断言" />

      <div style={{ position: "absolute", left: PAD, top: 258, width: 1080 }}>
        <Build at={b(1)}>
          <Card label="data/manifests · 6 个演示切片" accent={C.cyan} pad={18} style={{ width: 1080, height: 448 }}>
            <div style={{ display: "flex", borderBottom: "1px solid " + C.panelLine, paddingBottom: 8 }}>
              {[["切片", 258], ["行数", 100], ["字节", 118], ["sha256", 150], ["用途", 400]].map(([t, w]) => (
                <div key={String(t)} style={{ width: Number(w), flexShrink: 0 }}><K>{String(t)}</K></div>
              ))}
            </div>
            {V.slices.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", height: 54, borderBottom: "1px solid " + C.panelLine }}>
                <div style={{ width: 258, flexShrink: 0, fontFamily: FONT.mono, fontSize: 15, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                <div style={{ width: 100, flexShrink: 0 }}><Num value={s.rows} size={15} color={C.inkDim} /></div>
                <div style={{ width: 118, flexShrink: 0 }}><Num value={s.bytes} size={15} color={C.inkDim} /></div>
                <div style={{ width: 150, flexShrink: 0, fontFamily: FONT.mono, fontSize: 14, color: C.violet }}>{s.sha12}</div>
                <div style={{ width: 400, flexShrink: 0, fontFamily: FONT.sans, fontSize: 16, color: C.inkFaint }}>{s.note}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <K>{"合计 " + String(V.totals.rows) + " 行 / " + String(V.totals.bytes) + " 字节"}</K>
              <K>{"单票 6030 · 分钟 960 · 面板 28353 · 停牌 244"}</K>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1174, top: 258, width: 674 }}>
        <Build at={b(12)}>
          <Card label="从湖到断言 · 四步" accent={C.violet} pad={20} style={{ width: 674, height: 510 }}>
            {STEP.map(([n, t, d], i) => (
              <div key={n} style={{ display: "flex", gap: 14, marginTop: i ? 16 : 0 }}>
                <Mono size={FT.micro} color={C.violet} style={{ minWidth: 26 }}>{n}</Mono>
                <div style={{ flex: 1 }}>
                  <Body size={FT.body} color={C.ink}>{t}</Body>
                  <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 3 }}>{d}</Body>
                  {i < STEP.length - 1 ? <div style={{ marginTop: 12, height: 1, background: C.panelLine }} /> : null}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, borderTop: "1px solid " + C.panelLine, paddingTop: 10 }}>
              <Body size={FT.meta} color={C.inkDim}>
                {"没有 TA-Lib；每条断言都要能被编译器与测试判决。"}
              </Body>
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 780, width: 1776 }}>
        <Build at={b(27)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <Body size={FT.lead} color={C.ink}>{"本集没有模型，只有账本。"}</Body>
            <K>{"142 条不是性能结论，是这一集所有数字的来路。"}</K>
          </div>
        </Build>
      </div>
    </Scene>
  );
};