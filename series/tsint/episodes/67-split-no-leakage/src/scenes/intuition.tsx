import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 定义：切分、固定预测、滚动预测三层；标准化只碰训练段。 */
export const SIntuition: React.FC = () => {
  const b = (i: number) => beatAt("intuition", i, 63);
  const s = M.split;
  return (
    <Scene id="intuition">
      <Head kicker="04 / 三个定义" title="定义分三层" goal="切分、固定预测、滚动预测" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <Build at={b(0)} style={{ width: 576 }}>
            <Card label="第一层 · 切分" accent={C.cyan} style={{ width: 576, height: 480 }} pad={22}>
              <Code lines={["n_train = floor(0.70 n)", "n_val   = floor(0.10 n)", "n_test  = n - n_train - n_val"]} />
              <div style={{ height: 1, background: C.panelLine, margin: "18px 0" }} />
              <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan, lineHeight: 1.7 }}>
                max(train) &lt; min(val)<br />&lt; min(test)
              </div>
              <Body size={FT.meta} style={{ marginTop: 14, color: C.inkFaint }}>
                先按时间排好，再从前往后切。除不尽，余数全部给测试。训练和验证都从前面取整。
              </Body>
              <div style={{ marginTop: 12 }}><Mono size={FT.meta} color={C.amber}>7:1:2 · 6:2:2 都能传</Mono></div>
            </Card>
          </Build>

          <Build at={b(27)} style={{ width: 576 }}>
            <Card label="第二层 · 固定预测" accent={C.violet} style={{ width: 576, height: 480 }} pad={22}>
              <Code lines={["train = [1 .. n-f]", "test  = [n-f+1 .. n]"]} />
              <div style={{ height: 1, background: C.panelLine, margin: "18px 0" }} />
              <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.violet, lineHeight: 1.7 }}>
                fit once · predict once
              </div>
              <Body size={FT.meta} style={{ marginTop: 14, color: C.inkFaint }}>
                只训练一次，只预测一次，没有第二次机会。训练段越短，越容易记住噪声。
              </Body>
              <div style={{ marginTop: 12 }}><Mono size={FT.meta} color={C.amber}>f = 20 · {M.fixed.trainN} / {M.fixed.testN}</Mono></div>
            </Card>
          </Build>

          <Build at={b(37)} style={{ width: 576 }}>
            <Card label="第三层 · 滚动预测" accent={C.amber} style={{ width: 576, height: 480 }} pad={22}>
              <Code lines={["rounds = floor((n-f-n_init)/s)+1", "train_r = [1 .. n_init+(r-1)s]", "test_r  = f 个点"]} />
              <div style={{ height: 1, background: C.panelLine, margin: "18px 0" }} />
              <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.amber, lineHeight: 1.7 }}>
                refit every round
              </div>
              <Body size={FT.meta} style={{ marginTop: 14, color: C.inkFaint }}>
                每轮新增 s 个观测，重新拟合。测试窗口等长，互不重叠，首尾相接。除不尽时最后一轮被截掉。
              </Body>
              <div style={{ marginTop: 12 }}><Mono size={FT.meta} color={C.amber}>{M.rolling.nInit} + {M.rolling.step} · {M.rolling.rounds} 轮</Mono></div>
            </Card>
          </Build>
        </div>

        <Build at={b(52)} style={{ marginTop: 16 }}>
          <Card label="三条规矩 · 缺一不可" accent={C.coral} style={{ width: 1776, height: 128 }} pad={16}>
            <div style={{ display: "flex", gap: 26 }}>
              {[
                ["01", "先切时间", "切分先于模型"],
                ["02", "只用训练段", "均值方差，不碰验证测试"],
                ["03", "逐轮重算", "标准化跟着窗口走"],
              ].map(([k, h, d]) => (
                <div key={k} style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 10 }}>
                  <K>{k}</K>
                  <span style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>{h}</span>
                  <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{d}</span>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(59)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>切时间，只拟合训练段，逐轮重算。</div>
      </Build>
    </Scene>
  );
};

const Code: React.FC<{ lines: string[] }> = ({ lines }) => (
  <div style={{ background: C.bg, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "14px 16px" }}>
    {lines.map((l, i) => (
      <div key={i} style={{ fontFamily: FONT.mono, fontSize: FT.mono, color: C.ink, lineHeight: 1.7, whiteSpace: "nowrap" }}>{l}</div>
    ))}
  </div>
);
