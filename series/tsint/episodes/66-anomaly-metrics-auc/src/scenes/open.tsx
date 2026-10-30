import React from "react";
import { useCurrentFrame } from "remotion";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 100 个点：99 个正常，1 个异常。位置固定，不随机。 */
const DOTS = Array.from({ length: 100 }, (_, i) => {
  const col = i % 10, row = Math.floor(i / 10);
  return { x: 10 + col * 39 + ((i * 7) % 5), y: 8 + row * 30 + ((i * 11) % 4), bad: i === 47 };
});

export const SOpen: React.FC = () => {
  const f = useCurrentFrame();
  const b = (i: number) => beatAt("open", i, 20);
  const syn = M.synthetic;
  const pooled = M.pooled;
  return (
    <Scene id="open">
      <Head kicker="第 8 章 / 测评基准" title="满分、随机、废" goal="同一份预测，三个指标，三种判决" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 880 }}>
        <Build at={b(1)}>
          <Card label="原文 · p.206 · 8.6.2 评估指标" accent={C.inkFaint} pad={20} style={{ width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.inkDim, lineHeight: 1.6 }}>
              当 AUC 为 0.5 时，表示模型的性能与随机猜测相当。
            </div>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.body, color: C.inkFaint, lineHeight: 1.65, marginTop: 8 }}>
              由于 ROC-AUC 不依赖于特定的分类阈值，因此能够从整体上反映模型的分类性能。
            </div>
            <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              《时序智能》p.206 · 短摘录 · CC BY-NC-ND 4.0
            </div>
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 22 }}>
          <Card label="本集要钉的三件事" accent={C.violet} style={{ width: 880, height: 196 }}>
            <div style={{ display: "flex", gap: 22 }}>
              {[
                ["01", "准确率会骗人", "多数类撑起分数"],
                ["02", "排序看 AUC 与 AP", "正类排得够不够前"],
                ["03", "边界写进代码", "分母、单类、并列"],
              ].map(([k, h, s]) => (
                <div key={k} style={{ flex: 1 }}>
                  <K>{k}</K>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 8 }}>{h}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 6 }}>{s}</div>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1050, top: 292, width: 750 }}>
        <Build at={b(3)}>
          <Card label="同一份数据 · 100 个点 · 1 个异常" accent={C.amber} style={{ width: 750, height: 300 }}>
            <svg width={420} height={210} style={{ display: "block" }}>
              {DOTS.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={d.bad ? 7 : 5.5}
                  fill={d.bad ? C.coral : C.inkFaint} opacity={d.bad ? 1 : 0.55} />
              ))}
            </svg>
            <div style={{ position: "absolute", left: 470, top: 52, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.8 }}>
              模型全判正常。<br />
              一个异常都没抓到，<br />
              准确率还是 0.99。
            </div>
          </Card>
        </Build>

        <Build at={b(6)} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { k: "准确率", v: syn.accuracy, c: C.amber, note: "看起来满分" },
              { k: "ROC-AUC", v: syn.auc, c: C.cyan, note: "等于随机" },
              { k: "AP", v: syn.ap, c: C.coral, note: "正类只有 1%" },
            ].map((x) => (
              <Card key={x.k} accent={x.c} pad={16} style={{ width: 238, height: 132 }}>
                <K>{x.k}</K>
                <div style={{ marginTop: 8 }}><Num value={x.v} digits={2} size={42} color={x.c} /></div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 6 }}>{x.note}</div>
              </Card>
            ))}
          </div>
        </Build>

        <Build at={b(14)} style={{ marginTop: 18 }}>
          <Card label="本机快照" accent={C.panelLine} pad={16} style={{ width: 750 }}>
            <Body size={FT.meta} style={{ lineHeight: 1.6 }}>
              {M.meta.stocks} 只 A 股 · {M.meta.pairs.toLocaleString("en-US")} 个点 · 正类 {M.meta.positives.toLocaleString("en-US")} 个
              （{pooled.prevalence.toFixed(3)}）· {M.meta.tests} 条断言
            </Body>
          </Card>
        </Build>
      </div>

      <Build at={b(16)} style={{ position: "absolute", left: PAD, top: 930, width: 1400 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>同一个模型，三个指标，三种判决。</div>
      </Build>
    </Scene>
  );
};
