import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, CodeBlock, Row, Body, Mono, Stat, Formula, Verdict, Chip } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 6), pageAt("implementation", 22)];
  const tm = [
    { t: "module TsBase.Algos.Ch03.TSMixer", hi: true },
    { t: "tmParams t n = t*t + n*n + t*n" },
    { t: "tmForward :: TmW -> Int -> Tensor" },
    { t: "  -> Either TmError Tensor" },
    { t: "tmAxisEquivariance :: TmW -> Int -> Tensor" },
    { t: "  -> (Double, Double)", dim: true },
    { t: "-- 门必须均匀，否则不等变", dim: true },
  ];
  const ra = [
    { t: "module TsBase.Algos.Ch03.ChannelRouterAttn", hi: true },
    { t: "data RaCfg = RaCfg { rcSlots, rcDim, rcAlpha }" },
    { t: "raScores cfg w h = H Wr^T / sqrt d" },
    { t: "raWeights = softmax over slots per row" },
    { t: "raForward = alpha * A^T V + (1-alpha) * H" },
    { t: "routerAttn :: Int -> Int -> Tensor -> Tensor", dim: true },
  ];
  const cc = [
    { t: "module TsBase.Algos.Ch03.ChannelCluster", hi: true },
    { t: "clusterChannels :: Int -> Tensor" },
    { t: "  -> Either CcError ([Int], [Matrix])" },
    { t: "ccAssign  = cosine, 8 iterations" },
    { t: "ccCentroids = raw mean of members" },
    { t: "ccWeights k h f = k 套 (F x (H+1))", dim: true },
    { t: "-- 空簇要回收，不能不处理", dim: true },
  ];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>THREE MODULES · THREE FILES</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 54, color: C.ink, marginTop: 12 }}>三个模块，三个文件，互不导入。</div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 450, width: CW, display: "flex", gap: 24 }}>
            <CodeBlock title="TSMixer" lines={tm} width={540} size={FT.tiny} />
            <CodeBlock title="ChannelRouterAttn" lines={ra} width={540} size={FT.tiny} />
            <CodeBlock title="ChannelCluster" lines={cc} width={540} size={FT.tiny} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
            <Row name="参数口径" value="逐个矩阵元素数" note="不按张量个数，也不按乘法次数；规格里的数字都是这么来的" width={1640} />
            <Row name="报错口径" value="形状与数值都走 Either" note="没有异常，也没有静默 NaN；错误构造子带字符串或下标" color={C.cyan} width={1640} />
            <Row name="测试口径" value="断言只给期望值，不给容差" note="容差写在条件里：1e-15、1e-12、1e-11 分档" color={C.amber} width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Card label="第一个坑 · 门不是均匀的，等变性就不成立" accent={C.coral} style={{ width: CW }}>
              <Formula size={44}>{"G ∈ R^(96 × 8)，每个 (t, n) 一个缩放"}</Formula>
              <Body size={FT.meta} style={{ marginTop: 10 }}>
                通道排列时，时间位置没变、通道位置变了，逐元素门把不同的缩放乘到不同的通道上。想让「只混一个轴」保持干净，门必须全一。
              </Body>
              <div style={{ display: "flex", gap: 24, marginTop: 22 }}>
                <div style={{ width: 520 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.tiny, color: C.inkFaint }}>门按 (t, n) 取值</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.coral, marginTop: 8 }}>336.78 / 1940.6</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>通道 / 时间 两个方向的残差</div>
                </div>
                <div style={{ width: 520 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.tiny, color: C.inkFaint }}>门全一</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.cyan, marginTop: 8 }}>2.27e-13 / 1.36e-12</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>阈值 1e-11，标注「浮点重排」</div>
                </div>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 860, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok={false} label="第一次跑：不等变" />
            <Verdict ok label="改成均匀门：浮点级" />
            <Mono size={FT.meta} color={C.inkFaint}>测试没有放宽，是模型里加了一条真实约束</Mono>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="第二个坑 · 取最大值的下标取反了" accent={C.amber} style={{ width: 1040 }}>
              <Formula size={40}>{"argmax = negate (snd (maximum [(x, negate i) ...]))"}</Formula>
              <Body size={FT.meta} style={{ marginTop: 10 }}>
                第一版用 (x, -i) 打包再取最大，回来的是负下标。纯度和 ARI 对标签置换不变，所以两组读数都还是对的；错的是落盘的 router_assign.csv，槽号全是负数。
              </Body>
              <Row name="症状" value="CSV 里 slot_random = −3" note="纯度 0.1562 / ARI 0.0074 全部照常" width={980} />
              <Row name="修完" value="槽号 0..3" note="重建证据 JSON 与 CSV，读数不变" color={C.cyan} width={980} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 660 }}>
            <Card label="第三个坑 · 空簇" accent={C.violet} style={{ width: 620 }}>
              <Body size={FT.meta}>
                余弦分配会把某个簇抽空。不处理就会在簇心均值里除以零，得到 NaN，再传播到权重。
              </Body>
              <Row name="做法" value="把最远点搬进空簇" note="重复到每簇非空；簇心保留上一轮" width={560} />
              <Row name="读数" value={"空簇数 " + M.cluster.emptyClusters} note="六十四通道、十簇、五个窗口" color={C.cyan} width={560} />
            </Card>
            <Card label="第四个坑 · 余弦只对整体缩放不变" accent={C.coral} style={{ width: 620, marginTop: 20 }}>
              <Body size={FT.meta}>
                逐行放大一百倍会改变原始均值的簇心，归属自然会变。可复现的说法只能是「整体放大」。
              </Body>
              <Row name="改法" value="整体放大 100 倍归属不变" note="测试因此改名，不是放宽" width={560} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
