import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, Formula, MiniTable,
  fmt4, fmt2, fmtInt,
} from "../shared";
import { ConvKernelFig, PoolFig, ResBlockFig, GapCamFig, CamHeat } from "../figs";

const cv = M.conv;
const rs = M.residual;
const gp = M.gapcam;

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：卷积手算 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先钉一个
              <br />
              黄金值。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              输入四个点：一、二、三、四；核长三：一、零、负一；偏置零。第一个位置：1×1 + 2×0 + 3×(−1) = −2；第二个位置：2 − 4 = −2。输出就两个数：{cv.golden.map((v) => v.toFixed(0)).join("、")}。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="输出长度" value={"4 − 3 + 1 = " + cv.goldenLen} note="不补零" color={C.cyan} />
              <Row name="输出" value={"[" + cv.golden.map((v) => v.toFixed(0)).join(", ") + "]"} note="写死在测试里" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 840, top: 292, width: 980 }}>
            <Card label="卷积 = 乘、加、滑" accent={C.cyan} pad={22}>
              <Formula size={44} color={C.cyan}>{"y_i = Σ_k w_k · x_{i+k} + b"}</Formula>
              <div style={{ height: 8 }} />
              <ConvKernelFig width={920} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：池化 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              池化是把两个
              <br />
              并成一个。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              窗口里取最大：一和三留三，二和五留五，输出 [{cv.poolOut.map((v) => v.toFixed(0)).join(", ")}]。两个一样大时取最左边那个，这条要写进测试，不然梯度会乱走。池化把长度减半，也把「在哪里」变成「有没有」。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>输入 {cv.poolIn.join(" / ")}</Chip>
              <Chip color={C.amber}>输出 {cv.poolOut.map((v) => v.toFixed(0)).join(" / ")}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 840, top: 296, width: 960 }}>
            <Card label="最大池化，窗口 2" accent={C.cyan} pad={22}>
              <PoolFig width={900} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：残差 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              残差块，
              <br />
              只有一行。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              输出等于 ReLU，作用在「输入加残差」上。残差退化成零，输出就是输入本身：一二三进，{rs.identity.join("、")} 出。通道数变了要加一个 1×1 投影，权重取二，一二进，{rs.proj.map((v) => v.toFixed(0)).join("、")} 出。投影只是把通道对齐。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="恒等" value={"[" + rs.identity.join(", ") + "]"} note="1, 2, 3" color={C.cyan} />
              <Row name="1×1 投影" value={"[" + rs.proj.join(", ") + "]"} note="1, 2 → 2, 4" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 840, top: 300, width: 980 }}>
            <Card label="x + F(x)" accent={C.amber} pad={22}>
              <Formula size={40} color={C.amber}>{"y = ReLU( x + F(x) )"}</Formula>
              <div style={{ height: 6 }} />
              <ResBlockFig width={900} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：通道 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五个通道，
              <br />
              一起看还是分开看。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              通道独立：每个通道各卷各的，最后拼起来；通道依赖：同一个核同时看五个通道。前者参数少，后者能学通道间的关系。我们的网络用通道依赖：输入 5 通道、输出 16 通道，一个核 5×{cv.k} 是四十个权重，加 16 个偏置。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>5 → 16 → 32</Chip>
              <Chip color={C.amber}>核 5×8 = 40 权重</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 870, top: 296, width: 950 }}>
            <Card label="同一层里两种做法" accent={C.violet} pad={22}>
              <MiniTable
                head={["做法", "参数", "能学到"]}
                rows={[
                  ["通道独立", "5 × 16 × 8 = 640", "每种字段自己的形状"],
                  ["通道依赖", "16 × (5×8) = 640 + 16", "字段之间的关系"],
                ]}
                colW={[200, 320, 340]}
                width={860}
                rowH={44}
              />
              <div style={{ height: 14 }} />
              <Body color={C.inkDim} size={FT.meta}>
                参数量几乎一样，区别在于「关系」算不算特征。数据里五个字段平均相关 {fmt4(M.dataset.meanAbsCorr)}，互补信息不多——这一条后面要回到边界。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：GAP */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              一段的长度，
              <br />
              不再是问题。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              全局平均池化对时间维取平均，不管序列多长。一、二、三、四，平均 {fmt4(gp.gap, 1)}。同一套权重吃 60 步和 120 步都行，输出都是三个 logits。坏处也明显：时间顺序被平均掉了，所以它必须配 CAM 把顺序找回来。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="60 步" value={gp.len60 + " 个 logits"} note="同一套权重" color={C.cyan} />
              <Row name="120 步" value={gp.len120 + " 个 logits"} note="长度无关" color={C.cyan} />
              <Row name="GAP 黄金值" value={fmt4(gp.gap, 1)} note="四数平均" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 292, width: 1000 }}>
            <Card label="GAP 之后接线性头" accent={C.cyan} pad={22}>
              <GapCamFig width={940} />
              <div style={{ height: 8 }} />
              <Formula size={36} color={C.cyan}>{"z_c = Σ_t w_c(t) · f(t)"}</Formula>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：CAM */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              CAM 是一行
              <br />
              加权和。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              分类头的权重乘回每个位置的通道，再做 min-max 归一化。权重取零点五，四个位置：{gp.cam.map((v) => v.toFixed(1)).join("、")}；归一化后 {gp.norm.map((v) => v.toFixed(4)).join("、")}。屏幕上是零、零点三三三三、零点六六六七、一。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>归一化四元组</Chip>
              <Chip color={C.inkDim}>只对 GAP + 线性头成立</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 840, top: 292, width: 980 }}>
            <Card label="四格权重 → 归一化" accent={C.coral} pad={22}>
              <div style={{ display: "flex", gap: 14 }}>
                {gp.norm.map((v, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{ height: 84, background: "rgba(94,234,212," + (0.18 + 0.7 * (v / 1.0)) + ")", borderRadius: 6, border: "1px solid " + C.panelLine }} />
                    <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>{fmt4(v)}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>位置 {i + 1}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 14 }} />
              <Body color={C.inkDim} size={FT.meta}>
                归一化前后排序不变；乘一个正常数也不变。所以 CAM 只能读「相对重要」，不能读绝对权重。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
