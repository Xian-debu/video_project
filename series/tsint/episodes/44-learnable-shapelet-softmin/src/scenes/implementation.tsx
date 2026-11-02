import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  MiniTable, CodeBlock, CheckGrid, fmt4, fmtInt, checkGroups,
} from "../shared";

const sm = M.softmin;
const mt = M.meta;

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：模块表 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三个模块，
              <br />
              五十条新断言。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              LearnShapelet 管可导模板与训练，ShapeletTree 管「距离当特征」的决策树，Mlp 管分类头与反传。三套 spec 共 {mt.newCases} 条新断言，全仓库现在是 {mt.tests.groups} 套、{fmtInt(mt.tests.assertions)} 条。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{mt.tests.groups} 套 · {fmtInt(mt.tests.assertions)} 条</Chip>
              <Verdict ok label="0 FAIL" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="新增模块与测试数" accent={C.cyan} pad={20}>
              <MiniTable
                head={["模块", "路径", "测试数"]}
                colW={[190, 560, 150]}
                width={880}
                rowH={44}
                rows={mt.modules.map((m) => [m.file.split("/").pop() ?? m.file, m.file, String(m.cases)])}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim}>
                证据程序跑 {mt.evidence.passed}/{mt.evidence.checks} 检查、{fmt4(mt.evidence.seconds, 1)} 秒，把下面的每个读数都写进 summary 和 checks 两个文件。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：训练主循环 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              训练是
              <br />
              一个双层循环。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              外层按轮次走，内层按小批量走。每个批量里，五个模板对每条训练窗算距离、拼 logits、算交叉熵，再用反向传播把梯度回传到五个模板的形状、3×5 权重和偏置。模板长度是超参数，固定不学。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Card label="优化器" accent={C.amber} pad={16}>
                <Body>
                  Adam，β₁ 零点九、β₂ 零点九九九、eps 1e-8；批量三十二，学习率零点零一，随机种子七，三十轮三段退火。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 286, width: 960 }}>
            <CodeBlock
              width={900}
              title="trainShapelets（伪码）"
              lines={[
                { t: "for epoch <- [0 .. epochs-1] do" },
                { t: "  let alpha = alphaAt params epoch" },
                { t: "  for batch <- batches (shuffle seed) train do" },
                { t: "    let g = sum [ sampleGrad alpha shapes w b x y" },
                { t: "                  | (x, y) <- batch ]", hi: true },
                { t: "    step Adam lr g" },
                { t: "  record loss (modelLoss alpha shapes w b train)" },
                { t: "" },
                { t: "alphaAt ps e = if e < 8 then 1" },
                { t: "                else if e < 20 then 20 else 200" },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页三：dds 链式坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              这一集踩过
              <br />
              最大的一个坑。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              反传到模板形状时，形状的梯度要乘「损失对这个模板距离的梯度」，不是「距离本身」。第一版把距离直接当 dL/dd 传进去，单个样本的解析梯度与数值梯度差了三倍，损失也对不上。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Card label="症状与修法" accent={C.coral} pad={16}>
                <Row name="症状" value="数值 1.303 vs 解析 5.136" note="同一参数，同一损失" />
                <Row name="根因" value="把 d 当成 dL/dd" note="漏了乘 logits 的梯度" color={C.coral} />
                <Row name="修法" value="先算 dds = Σ dlogit · W" note="再对形状求导" color={C.cyan} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 286, width: 960 }}>
            <CodeBlock
              width={900}
              title="形状梯度的正确链式"
              lines={[
                { t: "-- 错：直接拿距离当梯度" },
                { t: "-- shapeGrads = zipWith3 goShape shapes ds windows", dim: true },
                { t: "" },
                { t: "-- 对：先把 logits 的梯度乘回权重矩阵" },
                { t: "dds = [ sum [ dl * (w !! c !! j)" },
                { t: "          | (c, dl) <- zip [0..] dlogits ]" },
                { t: "      | j <- [0 .. length ds - 1] ]", hi: true },
                { t: "" },
                { t: "shapeGrads = zipWith3 goShape shapes dds windows", hi: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页四：log-sum-exp */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              数值稳定，
              <br />
              用一个减最大值。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              算 exp(−α x) 之前先减去最大指数项，权重不变但中间量不会溢出或集体下溢。同样的技巧在第二集的 softmax、第 41 集的注意力里都出现过，这是第三次。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>下溢比例函数 underflowFraction</Chip>
              <Chip color={C.amber}>α=500 时 {fmt4(sm.underflow[1].fraction, 4)}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 960 }}>
            <CodeBlock
              width={900}
              title="log-sum-exp 变形"
              lines={[
                { t: "softMin alpha xs =" },
                { t: "  let m = maximum (map (negate . (* alpha)) xs)" },
                { t: "      s = sum [ exp ((-alpha) * x - m) | x <- xs ]" },
                { t: "  in negate (m + log s) / alpha", hi: true },
                { t: "" },
                { t: "-- 两版数学等价；第二版不会 exp 溢出" },
                { t: "underflowFraction alpha xs =" },
                { t: "  count (== 0) weights / length weights", dim: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页五：检查网格 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              {mt.evidence.checks} 组检查，
              <br />
              全过。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              证据程序跑 {mt.evidence.passed}/{mt.evidence.checks} 检查，全过，耗时 {fmt4(mt.evidence.seconds, 1)} 秒。分组是数据、合成、SoftMin、扫描、退火、停住、MLP、DTW、树、真实十块。任何一块的读数与预期不一致，程序直接报错退出。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              {checkGroups().slice(0, 5).map((g) => (
                <Chip key={g.g} color={C.cyan}>{g.g} {g.pass}/{g.total}</Chip>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 300, width: 900 }}>
            <Card label={mt.evidence.checks + " 格检查"} accent={C.cyan} pad={20}>
              <CheckGrid width={850} />
              <div style={{ marginTop: 16 }}>
                <Body color={C.inkDim} size={FT.meta}>
                  每一格对应一个带名字的断言，名字就是它检查的内容。全绿才算证据成立。
                </Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
