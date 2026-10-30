import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, Plot, M, beatAt } from "../shared";

const CH = 300;
const RO = M.pooled.curves.roc.map(([x, y]) => ({ x, y }));
const PR = M.pooled.curves.pr.map(([x, y]) => ({ x, y }));

const Stat: React.FC<{ k: string; v: string; c: string; note?: string }> = ({ k, v, c, note }) => (
  <div style={{ flex: 1 }}>
    <K>{k}</K>
    <div style={{ marginTop: 2 }}><Mono size={34} color={c}>{v}</Mono></div>
    {note ? <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint }}>{note}</div> : null}
  </div>
);

export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 26);
  const p = M.pooled;
  const e = M.extremes;
  return (
    <Scene id="intuition">
      <Head kicker="03 / 排序与阈值" title="曲线只比随机高一点" goal="AUC 零点五四，AP 零点一一" />

      <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
        <Build at={b(0)}>
          <Card label="真实数据 · ROC 曲线 · 23,829 个点" accent={C.cyan} style={{ width: 1000, height: 560 }} pad={20}>
            <div style={{ display: "flex", gap: 30 }}>
              <div>
                <div style={{ fontSize: 11, color: C.inkFaint, marginLeft: 8 }}>ROC</div>
                <Plot w={430} h={CH} at={b(1)} dur={46}
                  x={(v) => 34 + v * 370} y={(v) => (1 - v) * 250 + 18}
                  grid={{ x: [0, 0.25, 0.5, 0.75, 1], y: [0, 0.25, 0.5, 0.75, 1], fmtX: (v) => v.toFixed(2), fmtY: (v) => v.toFixed(2) }}
                  series={[
                    { pts: [{ x: 0, y: 0 }, { x: 1, y: 1 }], color: C.inkFaint, width: 1.5, dash: true },
                    { pts: RO, color: C.cyan, width: 3 },
                  ]}
                  labels={[
                    { x: 0.55, y: 0.10, text: "AUC 0.5408", color: C.cyan, dx: 6, dy: -8 },
                    { x: 0.62, y: 0.62, text: "随机 0.5", color: C.inkFaint, dx: 6, dy: -8 },
                  ]} />
                <div style={{ textAlign: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>假阳率 FPR</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.inkFaint, marginLeft: 8 }}>PR</div>
                <Plot w={430} h={CH} at={b(9)} dur={46}
                  x={(v) => 34 + v * 370} y={(v) => (1 - v) * 250 + 18}
                  grid={{ x: [0, 0.25, 0.5, 0.75, 1], y: [0, 0.25, 0.5, 0.75, 1], fmtX: (v) => v.toFixed(2), fmtY: (v) => v.toFixed(2) }}
                  series={[
                    { pts: [{ x: 0, y: p.prevalence }, { x: 1, y: p.prevalence }], color: C.coral, width: 1.5, dash: true },
                    { pts: PR, color: C.amber, width: 3 },
                  ]}
                  labels={[
                    { x: 0.32, y: 0.112, text: "AP 0.1121", color: C.amber, dx: 6, dy: -8 },
                    { x: 0.10, y: p.prevalence, text: "随机基线 0.0930", color: C.coral, dx: 6, dy: 16 },
                  ]} />
                <div style={{ textAlign: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>召回率 Recall</div>
              </div>
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 8 }}>
              同一份分数：ROC 只是比对角线高一点；PR 大部分贴着正类比例。纵轴：ROC 是真阳率，PR 是精确率。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1140, top: 288, width: 660 }}>
        <Build at={b(12)}>
          <Card label="同一份分数 · 两种读法" accent={C.violet} style={{ width: 660, height: 360 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Stat k="ROC-AUC" v={p.auc.toFixed(4)} c={C.cyan} note={"随机 0.5 · 只高 " + (p.auc - 0.5).toFixed(3)} />
              <Stat k="PR-AP" v={p.ap.toFixed(4)} c={C.amber} note={"随机 " + p.prevalence.toFixed(4)} />
              <Stat k="AP / 基线" v={p.apOverPrevalence.toFixed(2) + "×"} c={C.violet} note="比随机好一点" />
            </div>
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ flex: 1 }}>
                <K>{"20 只股票 · AUC"}</K>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, marginTop: 6, lineHeight: 1.7 }}>
                  {e.aboveHalf} 只超过 0.5<br />
                  中位数 {e.medianAuc.toFixed(3)}<br />
                  最高 {e.aucMax.name} {e.aucMax.value.toFixed(3)}<br />
                  最低 {e.aucMin.name} {e.aucMin.value.toFixed(3)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <K>{"20 只股票 · AP"}</K>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, marginTop: 6, lineHeight: 1.7 }}>
                  最高 {e.apMax.name}<br />
                  <Mono size={FT.meta} color={C.amber}>{e.apMax.value.toFixed(4)}</Mono><br />
                  最低 {e.apMin.name}<br />
                  <Mono size={FT.meta} color={C.coral}>{e.apMin.value.toFixed(4)}</Mono>
                </div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(21)} style={{ marginTop: 16 }}>
          <Card label="为什么两张图不矛盾" accent={C.cyan} style={{ width: 660, height: 150 }} pad={16}>
            <Body size={FT.meta} color={C.inkDim}>
              ROC 看全局排序；PR 只看排在前面的那一段。正类少时，前面全是假阳，精确率就掉下来。
            </Body>
          </Card>
        </Build>
      </div>

      <Build at={b(23)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>AUC 看全局，AP 看前面。</div>
      </Build>
    </Scene>
  );
};
