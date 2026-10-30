import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Quote, Num, beatAt } from "../shared";

/** 开场：同一组误差，MSE 与 MAE 给出两个答案；本集只钉三件事。 */
export const SOpen: React.FC = () => {
  const b = (i: number) => beatAt("open", i, 19);
  const A = [
    { v: 1, c: C.cyan },
    { v: 1, c: C.cyan },
    { v: 1, c: C.cyan },
    { v: 1, c: C.cyan },
  ];
  const B = [
    { v: 4, c: C.amber },
    { v: 0, c: C.inkFaint },
    { v: 0, c: C.inkFaint },
    { v: 0, c: C.inkFaint },
  ];
  const Bars = ({ data, color }: { data: { v: number; c: string }[]; color: string }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 96 }}>
      {data.map((d, i) => (
        <div key={i} style={{ width: 54, height: Math.max(3, d.v * 22), background: d.v ? d.c : C.panelLine, borderRadius: 4, opacity: d.v ? 0.9 : 0.6 }} />
      ))}
      <div style={{ marginLeft: 8, alignSelf: "flex-end", fontFamily: FONT.mono, fontSize: FT.meta, color }}>
        {data.map((d) => d.v).join(" ")}
      </div>
    </div>
  );

  return (
    <Scene id="open">
      <Head kicker="第 8 章 / 测评基准" title="同一组预测，两种罚法" goal="MSE 涨四倍，MAE 一动不动" />

      <div style={{ position: "absolute", left: PAD, top: 296, width: 850 }}>
        <Build at={b(7)}>
          <Quote
            width={850}
            lines={["预测任务指标用于衡量模型对未来数值的预测精度，", "如 MAE、RMSE、MAPE 和 MASE 等。"]}
          />
        </Build>

        <Build at={b(9)} style={{ marginTop: 22 }}>
          <Card label="本集要钉的三件事" accent={C.violet} pad={22} style={{ width: 850 }}>
            <div style={{ display: "flex", gap: 28 }}>
              {[
                ["01", "平方罚与绝对罚", "大错小错，谁更贵"],
                ["02", "跨序列比较", "价格、比例、基准"],
                ["03", "可测试的实现", "长度、零分母、NaN"],
              ].map(([n, t, d]) => (
                <div key={n} style={{ flex: 1 }}>
                  <Mono size={FT.micro} color={C.cyan}>{n}</Mono>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink, marginTop: 4 }}>{t}</div>
                  <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 4 }}>{d}</Body>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1000, top: 296, width: 800 }}>
        <Build at={b(2)}>
          <Card label="同一组误差 · 四个点" accent={C.amber} pad={24} style={{ width: 800 }}>
            <div style={{ display: "flex", gap: 30 }}>
              <div style={{ flex: 1 }}>
                <K>{"A 组"}</K>
                <div style={{ marginTop: 10 }}><Bars data={A} color={C.cyan} /></div>
                <div style={{ display: "flex", gap: 26, marginTop: 16 }}>
                  <div><K>{"MAE"}</K><div><Num value={1} size={FT.h2} color={C.cyan} /></div></div>
                  <div><K>{"MSE"}</K><div><Num value={1} size={FT.h2} color={C.cyan} /></div></div>
                </div>
              </div>
              <div style={{ width: 1, background: C.panelLine }} />
              <div style={{ flex: 1 }}>
                <K>{"B 组"}</K>
                <div style={{ marginTop: 10 }}><Bars data={B} color={C.amber} /></div>
                <div style={{ display: "flex", gap: 26, marginTop: 16 }}>
                  <div><K>{"MAE"}</K><div><Num value={1} size={FT.h2} color={C.amber} /></div></div>
                  <div><K>{"MSE"}</K><div><Num value={4} size={FT.h2} color={C.amber} /></div></div>
                </div>
              </div>
            </div>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 18 }}>
              {"绝对误差和都是四。平方和从四变成十六。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 22 }}>
          <Card label="证据等级 · 书里只有公式" accent={C.coral} pad={20} style={{ width: 800 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 64, lineHeight: 1, color: C.coral }}>C</div>
              <Body size={FT.meta} color={C.inkDim} style={{ flex: 1 }}>
                {"p.205 给了六条公式，没有代码、没有数据、没有基线。本集所有数字来自本机 20 只 A 股快照，不是书的实验。"}
              </Body>
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(15)} style={{ position: "absolute", left: PAD, top: 936, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"平方罚和绝对罚，不是同一把尺。"}</div>
          <K>{"指标不是裁判，是一个权重。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
