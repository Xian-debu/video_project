import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 实现：三个模块、50 条断言、边界表。 */
export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 58);
  return (
    <Scene id="verification">
      <Head kicker="06 / 三个模块" title="先把边界写成断言" goal="函数是协议，输入向量，输出报告" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <Build at={b(0)} style={{ width: 576 }}>
            <Card label="TemporalSplit.hs · 切分" accent={C.cyan} style={{ width: 576, height: 450 }} pad={22}>
              <Code lines={[
                "data Split = Split",
                "  { splitN   :: !Int",
                "  , trainIdx :: [Int]",
                "  , valIdx   :: [Int]",
                "  , testIdx  :: [Int] }",
              ]} />
              <div style={{ height: 10 }} />
              <Code lines={[
                "chronologicalSplit",
                "  :: Double -> Double -> Int -> Split",
                "splitLeaks :: Split -> [Leak]",
              ]} />
              <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6 }}>
                只存索引，不复制整列。<br />比例乘 n 加 1e-9 再 floor，只削 IEEE 噪声。
              </div>
              <div style={{ marginTop: 10 }}><Mono size={FT.meta} color={C.cyan}>19 条断言</Mono></div>
            </Card>
          </Build>

          <Build at={b(17)} style={{ width: 576 }}>
            <Card label="FixedForecast.hs · 固定预测" accent={C.violet} style={{ width: 576, height: 450 }} pad={22}>
              <Code lines={[
                "type Model =",
                "  Int -> Vector Double",
                "  -> (Vector Double, Vector Double)",
              ]} />
              <div style={{ height: 10 }} />
              <Code lines={[
                "fixedOrigin",
                "  :: Int -> Model -> Vector Double",
                "  -> FixedReport",
                "data FixedReport = FixedReport",
                "  { frTrainMse, frTestMse, frGap :: Double }",
              ]} />
              <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6 }}>
                模型拿不到测试点。标准化统计量也只从训练段算。
              </div>
              <div style={{ marginTop: 10 }}><Mono size={FT.meta} color={C.violet}>17 条断言</Mono></div>
            </Card>
          </Build>

          <Build at={b(26)} style={{ width: 576 }}>
            <Card label="RollingForecast.hs · 滚动预测" accent={C.amber} style={{ width: 576, height: 450 }} pad={22}>
              <Code lines={[
                "data Origin = Origin",
                "  { orRound, orTrainStart",
                "  , orTrainEnd, orTestStart",
                "  , orTestEnd :: !Int }",
              ]} />
              <div style={{ height: 10 }} />
              <Code lines={[
                "rollingOrigins",
                "  :: Int -> Int -> Int -> Int -> [Origin]",
                "  -- f -> n_init -> step -> n",
                "rollingReport :: ... -> RollingReport",
              ]} />
              <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6 }}>
                窗口左闭右开。每轮训练终点必须小于测试起点，否则直接报错。
              </div>
              <div style={{ marginTop: 10 }}><Mono size={FT.meta} color={C.amber}>14 条断言</Mono></div>
            </Card>
          </Build>
        </div>

        <Build at={b(35)} style={{ marginTop: 14 }}>
          <Card label="边界全部写成断言 · 50 条" accent={C.coral} style={{ width: 1776, height: 150 }} pad={12}>
            <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 24 }}>
                <Count v="19" k="temporal" c={C.cyan} />
                <Count v="17" k="fixed" c={C.violet} />
                <Count v="14" k="rolling" c={C.amber} />
              </div>
              <div style={{ width: 1, height: 108, background: C.panelLine }} />
              <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "8px 14px", maxWidth: 1200 }}>
                {[
                  "n = 0 / 1 / 9 → 报错",
                  "f ≥ n → 报错",
                  "n_init + f > n → 报错",
                  "step ≤ 0 → 报错",
                  "空集 → []，不返回 0",
                  "单类 / 重复索引 → 明确答案",
                  "正对照能检出",
                  "负对照不误报",
                ].map((t) => (
                  <span key={t} style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, border: "1px solid " + C.panelLine, borderRadius: 6, padding: "4px 10px" }}>{t}</span>
                ))}
              </div>
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(54)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>代码先写边界，再写协议。</div>
      </Build>
    </Scene>
  );
};

const Code: React.FC<{ lines: string[] }> = ({ lines }) => (
  <div style={{ background: C.bg, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "8px 12px" }}>
    {lines.map((l, i) => (
      <div key={i} style={{ fontFamily: FONT.mono, fontSize: FT.code, color: C.ink, lineHeight: 1.45, whiteSpace: "nowrap" }}>{l}</div>
    ))}
  </div>
);

const Count: React.FC<{ v: string; k: string; c: string }> = ({ v, k, c }) => (
  <div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: c }}>{v}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{k}</div>
  </div>
);
