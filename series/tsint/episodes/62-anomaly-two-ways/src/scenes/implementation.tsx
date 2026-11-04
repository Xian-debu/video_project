import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, KV, M, PAD, Pages, Scene, SceneHead, pagesOf } from "../shared";
import { ModuleBars } from "../figs";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>实现只有<br />两个模块。</Body>
          <Body style={{ marginTop: 26 }}>
            PredAnomaly 管残差、分位、阈值、F1，104 行；ReconAnomaly 管初始化、前向、解析梯度，147 行。
            都是纯函数，没有 IO、没有随机——初始化种子写死，训练确定性可以逐位比对。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>纯函数</Chip>
            <Chip color={C.amber}>无 IO</Chip>
            <Chip color={C.violet}>种子写死</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三个文件的规模" accent={C.cyan} style={{ width: 1010 }} pad={22}>
            <ModuleBars width={960} height={230} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
            <KV k="预测单测" v={M.code.predTests + " 条"} color={C.cyan} />
            <KV k="重构单测" v={M.code.reconTests + " 条"} color={C.violet} />
            <KV k="合计" v={M.code.tests + " 条"} color={C.inkDim} />
          </div>
        </div>
        <Foot>没有 IO，才敢说可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>预测侧的<br />接口很小。</Body>
          <Body style={{ marginTop: 26 }}>
            五个函数就够：残差、分位阈值、阈值判定、混淆矩阵、F1。阈值扫描只是在同一套函数上换一个 q，
            不碰训练，也不碰预测。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.PredAnomaly"
            width={1010}
            lines={[
              { t: "-- 一条残差：实际减预测，取绝对值", dim: true },
              { t: "residualOf :: Double -> Double -> Double" },
              { t: "residualOf y yhat = abs (y - yhat)" },
              { t: "" },
              { t: "-- 阈值：排序后取第 ceil(q*n) 个（type-1 分位）", dim: true },
              { t: "quantileThreshold :: Double -> [Double] -> Double", hi: true },
              { t: "quantileThreshold q xs" },
              { t: "  | q <= 0 || q >= 1 = error \"q out of (0,1)\"" },
              { t: "  | otherwise = sorted !! (ceiling (q * n) - 1)" },
              { t: "  where sorted = sort xs; n = fromIntegral (length xs)" },
              { t: "" },
              { t: "-- 单个阈值扫全段，返回每档的 F1", dim: true },
              { t: "sweepThresholds :: [Double] -> [Double] -> [Bool] -> [(Double, Double)]", hi: true },
            ]}
          />
        </div>
        <Foot>接口小，才容易逐行审。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>重构侧要<br />手写梯度。</Body>
          <Body style={{ marginTop: 26 }}>
            前向是矩阵乘加 tanh。反向传播最容易错的是隐层梯度：它要把 W2 按列取出来再乘输出梯度——按行取就是错的。
            这一版第一次就写错了，数值梯度检查当场报错，差了几个数量级。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>解析梯度</Chip>
            <Chip color={C.amber}>中心差分校验</Chip>
            <Chip color={C.coral}>错一次，修一次</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="TsBase.Algos.Ch07.ReconAnomaly"
            width={1010}
            lines={[
              { t: "-- dHidden_j = (1 - h_j^2) * sum_i W2[i][j] * dOut_i", dim: true },
              { t: "dHidden = zipWith (\\hj j ->" },
              { t: "  (1 - hj * hj) * sum [ aeW2 net !! i !! j * dOut !! i", hi: true },
              { t: "                      | i <- [0 .. d - 1] ]) h [0 .. hidden - 1]" },
              { t: "" },
              { t: "-- W1 是 hidden 行 × d 列；dW1[j][k] = dHidden_j * x_k" },
              { t: "dW1 = [[ dHidden !! j * x !! k | k <- [0 .. d - 1] ]", hi: true },
              { t: "      | j <- [0 .. hidden - 1] ]" },
              { t: "-- W2 是 d 行 × hidden 列；dW2[i][j] = dOut_i * h_j" },
              { t: "dW2 = [[ dOut !! i * h !! j | j <- [0 .. hidden - 1] ]" },
              { t: "      | i <- [0 .. d - 1] ]" },
            ]}
          />
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            数值梯度检查：扰动 W1[0][1]，解析梯度与中心差分误差 &lt; 1e-6 才算过。
          </div>
        </div>
        <Foot>梯度写错，训练也会收敛，只是收敛到错的地方。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>证据程序<br />三百四十九行。</Body>
          <Body style={{ marginTop: 26 }}>
            一条命令跑完 19 项检查，输出 summary.json 与逐行 checks.txt。屏幕上的每个数都从这份 JSON 来，
            改一行代码，重跑一遍就知道哪个数动了。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="检查" v={M.summary.total + " 项"} color={C.cyan} />
            <KV k="耗时" v={M.timing.seconds.toFixed(1) + " s"} color={C.amber} />
            <KV k="失败" v={M.summary.failed} color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock
            title="复现：一条命令 + 一次测试"
            width={1010}
            lines={[
              { t: "cabal run tsbase -- evidence-ch07-anom \\" },
              { t: "  --data data/episodes/62-anomaly-two-ways \\" },
              { t: "  --out out/evidence-62 \\", hi: true },
              { t: "  --evidence inventory/evidence/62-anomaly-two-ways.ch7-anom.json", hi: true },
              { t: "" },
              { t: "cabal test    # 2 个模块、24 条单测" },
              { t: "" },
              { t: "-- 输出：summary.json（屏幕上的每个数）+ checks.txt（逐行）" },
            ]}
          />
          <Card label="19 项检查的四个分组" accent={C.violet} style={{ marginTop: 16, width: 1010 }} pad={18}>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { k: "数据", n: "4", note: "行数、段数、注入点", c: C.cyan },
                { k: "预测", n: "5", note: "系数、两条 F1、报警率", c: C.cyan },
                { k: "重构", n: "5", note: "参数、损失、两条 F1", c: C.violet },
                { k: "对照", n: "5", note: "胜负、确定性、重算", c: C.amber },
              ].map((g) => (
                <div key={g.k} style={{ flex: 1, borderTop: "1px solid " + C.panelLine, paddingTop: 10 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: g.c }}>{g.k}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.ink, marginTop: 4 }}>{g.n} 项</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 4 }}>{g.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Foot>{`一条命令，十九项检查，${Math.round(M.timing.seconds)} 秒。`}</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
