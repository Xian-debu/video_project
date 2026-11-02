import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, KV, Formula, fmt4, fmt2, fmtInt,
} from "../shared";
import { NormFig, MessageFig, ScoreFig, MaskFig, ScaleFig } from "../figs";

const d = M.data;
const gm = M.graph;

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：三样东西 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              图、邻接、
              <br />
              度。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              {"图写成 G = (V, E)：三十个节点，一百六十二条无向边。邻接矩阵 A 把它摊成 30 × 30 的 0/1 表，对角为 0。度 dᵢ 是第 i 行加起来的总和，落在 " + gm.minDeg + " 到 " + gm.maxDeg + " 之间。"}
            </Body>
            <div style={{ marginTop: 22 }}>
              <Formula size={44} note="阈值 θ 只有 0.3 一条，没有第二种规则">
                {"Aᵢⱼ = 1  若 |corr(i, j)| ≥ " + fmt2(gm.theta, 1)}
              </Formula>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 286, width: 1060 }}>
            <Card label="三个量，一个图" accent={C.cyan} pad={24}>
              <div style={{ display: "flex", gap: 22 }}>
                <div style={{ flex: 1 }}>
                  <KV k="节点 V" v={String(d.cols)} note="三个行业各十只" color={C.cyan} size={FT.num} />
                </div>
                <div style={{ flex: 1 }}>
                  <KV k="边 E" v={String(d.edges)} note={"从 " + fmtInt(d.pairs) + " 对里"} color={C.violet} size={FT.num} />
                </div>
                <div style={{ flex: 1 }}>
                  <KV k="度 dᵢ" v={gm.minDeg + "–" + gm.maxDeg} note="最多只能到 29" color={C.amber} size={FT.num} />
                </div>
              </div>
              <div style={{ marginTop: 26 }}>
                <Row name="邻接 A" value={d.cols + " × " + d.cols} note="对称，对角 0，稀疏" color={C.inkDim} width={980} />
                <Row name="行业内部" value={fmt4(gm.intraRate)} note={" " + d.intra + " / " + d.intraPairs + " 对"} color={C.cyan} width={980} />
                <Row name="跨行业" value={fmt4(gm.crossRate)} note={" " + d.cross + " / " + d.crossPairs + " 对"} color={C.coral} width={980} />
              </div>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"这三个量在证据 JSON 的 data 组里都有检查：面板、边数、划分、对齐收益。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：归一化 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先把邻接
              <br />
              归一化。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              {"直接乘 A，度大的节点会把聚合值抬得比谁都高。先加自环 A + I，让每个点都看见自己；再用 D⁻¹ᐟ² 两边各除一次，得到对称归一化矩阵 P。两个点一条边的玩具图上，P 的每一行都是 0.5 和 0.5。"}
            </Body>
            <div style={{ marginTop: 22 }}>
              <Formula size={54} note="tilde A 的对角全是 1；行和正好是 1">
                {"P = D⁻¹ᐟ² (A + I) D⁻¹ᐟ²"}
              </Formula>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 290, width: 1060 }}>
            <Card label="两个点：P 退化成两行 0.5" accent={C.cyan} pad={20}>
              <NormFig width={1000} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"检查项：两节点一图，P 的每一行都是 " + fmt4(0.5) + " 加上 " + fmt4(0.5) + "。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：GCN */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              GCN 一层
              <br />
              是一次平均。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              {"H = tanh(P X W + b)：先用 P 把邻居的特征平均过来，再乘可学的 W、加偏置、过 tanh。两层：5 → 16 → 3，参数 " + M.gcn.params + " 个，就是 " + M.gcn.layers[0] + " 加 " + M.gcn.layers[1] + "。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="一层" value="tanh(PXW + b)" note="P 固定，W 可学" color={C.cyan} />
              <Row name="tanh(1)" value={fmt4(M.gcn.tanh1)} note="不等于 1，容易被记错" color={C.coral} />
              <Row name="参数量" value={fmtInt(M.gcn.params)} note={M.gcn.layers[0] + " + " + M.gcn.layers[1]} color={C.violet} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1060 }}>
            <Card label="5 → 16 → 3，两次聚合一次分类" accent={C.cyan} pad={22}>
              <MessageFig width={1000} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"tanh 把每层的值压在 (−1, 1) 里；梯度核对给出最大偏差 " + M.gcn.gradDiff.toExponential(3) + "。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：GAT */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              GAT 给每条边
              <br />
              学一个权重。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              {"GCN 的平均是一视同仁；GAT 让两个端点各出一个向量打分，LeakyReLU 过一遍，再在邻居上做 softmax。四个头、每头四维，两层之后参数 " + M.gat.params + " 个。两个邻居打分 [0, ln 3]，归一化后是 [0.25, 0.75]。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="打分" value="a₁ᵀWhᵢ + a₂ᵀWhⱼ" note="两个方向各一半" color={C.violet} />
              <Row name="激活" value="LeakyReLU(0.2)" note="负半轴不归零" color={C.cyan} />
              <Row name="多头" value={M.gat.heads + " 头 · " + M.gat.dim + " 维"} note={"参数 " + M.gat.params} color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 290, width: 1060 }}>
            <Card label="softmax([0, ln 3]) = [0.25, 0.75]" accent={C.violet} pad={22}>
              <ScoreFig width={1000} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：掩码 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              掩码：非邻居
              <br />
              连机会都没有。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              {"softmax 之前，把所有非邻居的打分改成 −1e30。这个数足够小，exp 之后精确下溢到 0，不会留下 1e-13 这种尾巴。于是每一行的权重只落在邻居和自己身上，行和精确等于 1。"}
            </Body>
            <div style={{ marginTop: 22 }}>
              <Formula size={50} note="mask 只在邻居处为 0，其余为 −1e30">
                {"αᵢⱼ = softmaxⱼ( mask(eᵢⱼ) )"}
              </Formula>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 290, width: 1060 }}>
            <Card label="非邻居权重精确 0.0000，行和 1.0000" accent={C.coral} pad={22}>
              <MaskFig width={1000} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"检查项要求非邻居是精确的 0，不是小于某个容差的 0。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页六：自注意力 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              自注意力：
              <br />
              把图扔掉。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              {"每个位置出一份 Q、K、V，打分是 QKᵀ 除以 √d′。d′ = " + M.attn.dim + " 时缩放系数是 " + fmt4(M.attn.scale) + "，点积不再随维度膨胀。没有掩码，所有点两两互看；四个头、两层，参数 " + M.attn.params + " 个，比 GAT 多一倍多。"}
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="缩放" value={"1/√" + M.attn.dim + " = " + fmt4(M.attn.scale)} note="d′ 越大压得越狠" color={C.cyan} />
              <Row name="掩码" value="全 1" note="没有图结构可用" color={C.coral} />
              <Row name="参数量" value={fmtInt(M.attn.params)} note={M.attn.layers[0] + " + " + M.attn.layers[1]} color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1060 }}>
            <Card label="缩放系数 0.5；全零输入退化成均匀的 0.5 / 0.5" accent={C.amber} pad={22}>
              <ScaleFig width={1000} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"四个头各出一份 4 维表示，拼回 16 维再降到 3 类。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
