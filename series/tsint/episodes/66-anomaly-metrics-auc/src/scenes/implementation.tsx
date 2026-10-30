import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, beatAt } from "../shared";

const Sample: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    marginTop: 12, background: C.bg, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "10px 12px",
    fontFamily: FONT.mono, fontSize: 13, lineHeight: 1.7, color: C.inkFaint, whiteSpace: "pre",
  }}>{children}</div>
);

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    background: C.bg, border: "1px solid " + C.panelLine, borderRadius: 8, padding: "12px 14px",
    fontFamily: FONT.mono, fontSize: 15, lineHeight: 1.65, color: C.inkDim, whiteSpace: "pre", overflow: "hidden",
  }}>{children}</div>
);

export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 27);
  const w = 536;
  return (
    <Scene id="implementation">
      <Head kicker="04 / 三个模块" title="先把边界写成断言" goal="分母为零、单类、并列分数" />

      <div style={{ position: "absolute", left: PAD, top: 288, display: "flex", gap: 24 }}>
        <Build at={b(0)}>
          <Card label="ConfusionMetrics.hs · 式 8.7–8.10" accent={C.cyan} pad={20} style={{ width: w, height: 530 }}>
            <Code>{`data Confusion = Confusion
  { tp, fp, fn, tn :: !Int }

precision :: Confusion -> Maybe Double
recall, accuracy, f1
  :: Confusion -> Double
fbeta :: Double -> Confusion -> Double

-- 分母为零：precision = Nothing
-- 不做 0/0 的静默补零`}</Code>
            <div style={{ marginTop: 14 }}>
              <K>{"19 条断言"}</K>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 4 }}>
                空混淆矩阵、全判正类、全判负类；Fβ 的 β=0 与 β=1 两端。
              </Body>
            </div>
            <Sample>{`actual [T,T,T,F,F,F,F,F,F,F]
pred   [T,T,F,T,F,F,F,F,F,F]
tp 2 · fp 1 · fn 1 · tn 6
P = R = F1 = 2/3 · Acc 0.8`}</Sample>
          </Card>
        </Build>

        <Build at={b(7)}>
          <Card label="RocAuc.hs · p.206" accent={C.violet} pad={20} style={{ width: w, height: 530 }}>
            <Code>{`rocAuc
  :: V.Vector Double  -- 分数
  -> V.Vector Bool    -- 标签
  -> Maybe Double

-- 1. 按分数降序，并列取平均秩
-- 2. 正类秩和减 n+(n++1)/2
-- 3. 除以 n+ * n-
-- 单类样本：Nothing`}</Code>
            <div style={{ marginTop: 14 }}>
              <K>{"14 条断言"}</K>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 4 }}>
                黄金值 0.75；全并列回到 0.5；单类返回空值；长度不等报错。
              </Body>
            </div>
            <Sample>{`scores [0.5,0.4,0.3,0.9]
labels [F,T,F,T]
-> Just 0.75

all tied -> Just 0.5
single class -> Nothing`}</Sample>
          </Card>
        </Build>

        <Build at={b(14)}>
          <Card label="PrAuc.hs · p.206" accent={C.amber} pad={20} style={{ width: w, height: 530 }}>
            <Code>{`prAuc, averagePrecision
  :: V.Vector Double
  -> V.Vector Bool
  -> Maybe Double

-- 按分数降序扫
-- 每一步：recall, precision
-- AP = Σ (R_n - R_n-1) P_n
-- 端点写死 (0,1) / (1,base)`}</Code>
            <div style={{ marginTop: 14 }}>
              <K>{"13 条断言"}</K>
              <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 4 }}>
                黄金值 AP 0.5；顶部分数全正时 AP=1；随机基线等于正类比例。
              </Body>
            </div>
            <Sample>{`scores [0.9,0.8,0.3,0.2]
labels [F,T,F,T]
-> AP = 0.5

top two positive
-> AP = 1.0`}</Sample>
          </Card>
        </Build>
      </div>

      <Build at={b(20)} style={{ position: "absolute", left: PAD, top: 850, width: 1500 }}>
        <Card accent={C.panelLine} pad={16} style={{ width: 1500 }}>
          <div style={{ display: "flex", gap: 30 }}>
            <Mono size={FT.meta} color={C.cyan}>{"cabal test: 46 / 46 pass"}</Mono>
            <Mono size={FT.meta} color={C.inkFaint}>{"confusion 19 · ROC 14 · PR 13"}</Mono>
            <Mono size={FT.meta} color={C.inkFaint}>{"GHC 9.14.1 · no partial functions"}</Mono>
          </div>
        </Card>
      </Build>

      <Build at={b(23)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>四十六条断言，先判边界，再算指标。</div>
      </Build>
    </Scene>
  );
};