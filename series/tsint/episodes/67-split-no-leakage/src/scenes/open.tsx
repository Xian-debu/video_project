import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 开场：同一份预测，两种切法，两个数量级。 */
export const SOpen: React.FC = () => {
  const b = (i: number) => beatAt("open", i, 43);
  const s = M.split;
  const ratio = s.leakProbe.ratio;
  return (
    <Scene id="open">
      <Head kicker="第 8 章 / 测评基准" title="一百七十倍的假象" goal="同一份预测，只换一种切法" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 860 }}>
        <Build at={b(0)}>
          <Card accent={C.inkFaint} pad={26} style={{ width: 860, height: 200 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.ink, lineHeight: 1.55 }}>
              同一只股票。同一段历史。<br />
              同一个查表模型。
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkFaint, marginTop: 10 }}>只换一种切法。</div>
          </Card>
        </Build>

        <Build at={b(5)} style={{ marginTop: 20 }}>
          <Card label="查表探针 · 同一份价格序列" accent={C.coral} style={{ width: 860, height: 170 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
              <div>
                <K>时间切分 · MSE</K>
                <div><Num value={s.leakProbe.chronoMse} digits={2} size={FT.num} color={C.ink} /></div>
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.inkFaint, paddingBottom: 8 }}>→</div>
              <div>
                <K>随机切分 · MSE</K>
                <div><Num value={s.leakProbe.shuffleMse} digits={3} size={FT.num} color={C.coral} /></div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <K>好看了</K>
                <div><Num value={ratio} digits={1} size={FT.num} color={C.coral} /><span style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.coral }}>×</span></div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(7)} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.coral }}>但这是假的。</div>
            <Body size={FT.meta} style={{ color: C.inkFaint }}>训练集看见了未来。</Body>
          </div>
        </Build>

        <Build at={b(16)} style={{ position: "absolute", left: 0, top: 470, width: 860 }}>
          <Card label="本集要钉的三件事" accent={C.violet} style={{ width: 860, height: 160 }} pad={20}>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                ["01", "切分先于模型", "先切时间"],
                ["02", "日期轴切一次", "面板共用"],
                ["03", "泄漏要能算", "断言说话"],
              ].map(([k, h, d]) => (
                <div key={k} style={{ flex: 1 }}>
                  <K>{k}</K>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 6 }}>{h}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>{d}</div>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1020, top: 292, width: 780 }}>
        <Build at={b(2)}>
          <Card label="同一份预测 · 两种切法" accent={C.cyan} style={{ width: 780, height: 320 }}>
            <Row label="时间切分" leak={false} value={s.leakProbe.chronoMse} color={C.cyan} note="最近的训练点，全在左边" />
            <div style={{ height: 1, background: C.panelLine, margin: "18px 0" }} />
            <Row label="随机切分" leak value={s.leakProbe.shuffleMse} color={C.coral} note="训练集里有更晚的观测" />
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 20 }}>
          <Card label="为什么" accent={C.coral} style={{ width: 780, height: 196 }} pad={22}>
            <Body color={C.inkDim} size={FT.body} style={{ lineHeight: 1.7 }}>
              不是模型偷看。<br />
              是切分把未来递了过去。
            </Body>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.coral, marginTop: 10 }}>
              future points in train = {s.shuffle.futureTestPoints}
            </div>
          </Card>
        </Build>

        <Build at={b(20)} style={{ marginTop: 20 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, letterSpacing: 1 }}>
            {M.meta.rows} 个交易日 · {M.meta.first} — {M.meta.last}
          </div>
        </Build>
      </div>

      <Build at={b(40)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>切分先于模型。</div>
      </Build>
    </Scene>
  );
};

const Row: React.FC<{ label: string; value: number; color: string; note: string; leak?: boolean }> = ({ label, value, color, note, leak }) => {
  const w = leak ? 40 : 680;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>{label}</div>
        <div><Num value={value} digits={leak ? 4 : 3} size={FT.num} color={color} /></div>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: C.panelLine, marginTop: 10, overflow: "hidden" }}>
        <div style={{ width: w, height: 10, background: color, opacity: 0.9 }} />
      </div>
      <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 8 }}>{note}</div>
    </div>
  );
};
