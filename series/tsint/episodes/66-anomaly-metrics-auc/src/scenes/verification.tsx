import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

const Row: React.FC<{ cells: string[]; color?: string; head?: boolean }> = ({ cells, color = C.inkDim, head }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 8, padding: "3px 0", borderBottom: "1px solid rgba(34,48,63,.5)" }}>
    {cells.map((c, i) => (
      <div key={i} style={{
        fontFamily: i === 0 ? FONT.sans : FONT.mono, fontSize: head ? FT.micro : 17,
        color: head ? C.inkFaint : i === 0 ? color : i === 1 ? C.cyan : C.amber,
        textAlign: i === 0 ? "left" : "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{c}</div>
    ))}
  </div>
);

export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 26);
  const p = M.pooled;
  const lv = M.levels;
  const half = Math.ceil(lv.length / 2);
  return (
    <Scene id="verification">
      <Head kicker="05 / 四组数字" title="每个数都能回到一次运行" goal="合成样本、真实数据、阈值、二十只股票" />

      <div style={{ position: "absolute", left: PAD, top: 266, display: "flex", gap: 18 }}>
        {[
          { n: "100", u: "个点", k: "合成样本", c: C.cyan, note: "99 负 · 1 正" },
          { n: "23,829", u: "个点", k: "真实样本", c: C.amber, note: "正类 2,217 · 9.3%" },
          { n: "1.20", u: "倍", k: "AP / 基线", c: C.violet, note: "0.1121 / 0.0930" },
          { n: "46", u: "条", k: "断言", c: C.cyan, note: "三个模块全部通过" },
        ].map((x) => (
          <Build key={x.k} at={b(0)}>
            <Card accent={x.c} pad={18} style={{ width: 396, height: 200 }}>
              <K>{x.k}</K>
              <div style={{ marginTop: 4 }}>
                <Mono size={52} color={x.c}>{x.n}</Mono>
                <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkFaint, marginLeft: 8 }}>{x.u}</span>
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>{x.note}</div>
            </Card>
          </Build>
        ))}
      </div>

      <div style={{ position: "absolute", left: PAD, top: 502, width: 980 }}>
        <Build at={b(8)}>
          <Card label="20 只股票 · AUC 与 AP · 按 AUC 降序" accent={C.violet} style={{ width: 980, height: 410 }} pad={18}>
            <div style={{ display: "flex", gap: 34 }}>
              {[lv.slice(0, half), lv.slice(half)].map((col, ci) => (
                <div key={ci} style={{ flex: 1 }}>
                  <Row cells={["股票", "AUC", "AP"]} head />
                  {col.map((x) => (
                    <Row key={x.code} cells={[x.name, x.auc.toFixed(3), x.ap.toFixed(3)]}
                      color={x.auc > 0.5 ? C.inkDim : C.coral} />
                  ))}
                </div>
              ))}
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
              15 只 AUC 超过 0.5；最高工商银行 0.7977，最低中国中免 0.4650。AP 最高海康威视 0.2143。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1130, top: 502, width: 660 }}>
        <Build at={b(14)}>
          <Card label="阈值 z · 同一份分数，四个阈值" accent={C.cyan} style={{ width: 660, height: 410 }} pad={18}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr", gap: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, paddingBottom: 6, borderBottom: "1px solid " + C.panelLine }}>
              <div>阈值</div><div style={{ textAlign: "right" }}>精确率</div><div style={{ textAlign: "right" }}>召回率</div><div style={{ textAlign: "right" }}>准确率</div><div style={{ textAlign: "right" }}>F1</div>
            </div>
            {[{ threshold: "全判正常", precision: null, recall: 0, accuracy: p.allNormal.accuracy, f1: 0 }, ...p.thresholds].map((t) => (
              <div key={String(t.threshold)} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1fr", gap: 6, padding: "9px 0", borderBottom: "1px solid rgba(34,48,63,.5)", fontFamily: FONT.mono, fontSize: 17 }}>
                <div style={{ color: C.inkDim }}>{String(t.threshold) === "全判正常" ? "全判正常" : "z ≥ " + Number(t.threshold).toFixed(1)}</div>
                <div style={{ textAlign: "right", color: t.precision == null ? C.inkFaint : C.amber }}>{t.precision == null ? "—" : (t.precision * 100).toFixed(1) + "%"}</div>
                <div style={{ textAlign: "right", color: C.cyan }}>{(t.recall * 100).toFixed(1) + "%"}</div>
                <div style={{ textAlign: "right", color: C.ink }}>{(t.accuracy * 100).toFixed(1) + "%"}</div>
                <div style={{ textAlign: "right", color: C.inkDim }}>{t.f1.toFixed(3)}</div>
              </div>
            ))}
            <Body size={FT.meta} color={C.coral} style={{ marginTop: 10 }}>
              z≥1.0 的准确率 80.4%，比全判正常还低 10.3 个点；假阳 2,906 个。
            </Body>
          </Card>
        </Build>
      </div>

      <Build at={b(21)} style={{ position: "absolute", left: PAD, top: 940, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>本集没有训练模型，只有标签、分数、阈值。</div>
      </Build>
    </Scene>
  );
};
