import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

const DOTS = Array.from({ length: 100 }, (_, i) => {
  const col = i % 10, row = Math.floor(i / 10);
  return { x: 8 + col * 31, y: 8 + row * 24, bad: i === 47 };
});

const Cell: React.FC<{ label: string; value: number; color: string; note?: string }> = ({ label, value, color, note }) => (
  <div style={{ width: 150, padding: "12px 0" }}>
    <K>{label}</K>
    <div style={{ marginTop: 4 }}><Num value={value} size={34} color={color} /></div>
    {note ? <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>{note}</div> : null}
  </div>
);

export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 26);
  const syn = M.synthetic;
  const p = M.pooled;
  return (
    <Scene id="problem">
      <Head kicker="01 / 不平衡的样本" title="全判正常，准确率九十九" goal="多数类撑起准确率，少数类决定任务" />

      <div style={{ position: "absolute", left: PAD, top: 288, width: 900 }}>
        <Build at={b(1)}>
          <Card label="一百个样本 · 一个正类" accent={C.amber} style={{ width: 900, height: 380 }}>
            <div style={{ display: "flex", gap: 34 }}>
              <svg width={330} height={250} style={{ display: "block", flexShrink: 0 }}>
                {DOTS.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={d.bad ? 6 : 4.2}
                    fill={d.bad ? C.coral : C.inkFaint} opacity={d.bad ? 1 : 0.45} />
                ))}
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.7 }}>
                  预测全部是「正常」。<br />
                  一个异常都没抓到。
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 18px", marginTop: 18 }}>
                  <Cell label="真阳 TP" value={0} color={C.ink} />
                  <Cell label="假阳 FP" value={0} color={C.ink} />
                  <Cell label="假阴 FN" value={1} color={C.coral} note="漏掉的异常" />
                  <Cell label="真阴 TN" value={99} color={C.cyan} />
                </div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(9)} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { k: "准确率", v: "0.99", c: C.amber, note: "99 / 100" },
              { k: "召回率", v: "0.00", c: C.coral, note: "0 / 1" },
              { k: "精确率", v: "—", c: C.inkFaint, note: "从没预测过正类" },
              { k: "F1", v: "0.00", c: C.coral, note: "召回为零" },
            ].map((x) => (
              <Card key={x.k} accent={x.c} pad={14} style={{ width: 214, height: 120 }}>
                <K>{x.k}</K>
                <div style={{ marginTop: 6 }}><Mono size={34} color={x.c}>{x.v}</Mono></div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>{x.note}</div>
              </Card>
            ))}
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1050, top: 288, width: 750 }}>
        <Build at={b(13)}>
          <Card label="换到真实数据 · 20 只 A 股" accent={C.violet} style={{ width: 750, height: 380 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>全判正常，准确率</div>
                <div style={{ marginTop: 2 }}><Num value={p.allNormal.accuracy * 100} digits={1} size={64} color={C.amber} /><span style={{ fontFamily: FONT.mono, fontSize: 30, color: C.amber }}>%</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <K>正类比例</K>
                <div><Num value={p.prevalence * 100} digits={1} size={40} color={C.cyan} /><span style={{ fontFamily: FONT.mono, fontSize: 22, color: C.cyan }}>%</span></div>
              </div>
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <div style={{ display: "flex", gap: 20 }}>
              {[
                [p.n.toLocaleString("en-US"), "总样本"],
                [p.positives.toLocaleString("en-US"), "异常点"],
                ["2,217", "一个没抓到"],
              ].map(([v, k]) => (
                <div key={k} style={{ flex: 1 }}>
                  <div><Mono size={30} color={C.ink}>{v}</Mono></div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>
            <Body size={FT.meta} style={{ marginTop: 14, lineHeight: 1.6 }}>
              多数类占九成，全判正常就能拿九十点七。漏掉的异常，指标里看不见。
            </Body>
          </Card>
        </Build>

        <Build at={b(22)} style={{ marginTop: 18 }}>
          <Card label="所以换一个问法" accent={C.cyan} style={{ width: 750, height: 120 }} pad={16}>
            <Body size={FT.body} color={C.inkDim}>
              不看猜对多少，看正类排得够不够前。
            </Body>
          </Card>
        </Build>
      </div>

      <Build at={b(24)} style={{ position: "absolute", left: PAD, top: 930, width: 1400 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>准确率看的是多数类，不是任务。</div>
      </Build>
    </Scene>
  );
};
