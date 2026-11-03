import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>只讲切法。</Body>
          <Body style={{ marginTop: 26 }}>
            这一集只回答「怎么切」。不讲模型结构，不讲训练目标，不讲下游效果。输入一段序列，输出 token；变量只有切法，其余全部固定。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="输入" v="96 点" color={C.cyan} />
            <KV k="输出" v="token" color={C.violet} />
            <KV k="变量" v="切法" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="边界：只动切法" accent={C.amber}>
            <Row name="讲" value="三种变换" note="patch、周期、分辨率前缀" width={1010} color={C.cyan} />
            <Row name="不讲" value="模型结构" note="不比较 transformer 与 MLP" width={1010} color={C.inkDim} />
            <Row name="不讲" value="训练目标" note="没有损失函数，也没有优化器" width={1010} color={C.inkDim} />
            <Row name="不讲" value="下游效果" note="不跑预测任务，不报精度" width={1010} color={C.inkDim} />
            <Row name="固定" value="其余变量" note="同一段序列、同一窗口、同一 d" width={1010} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>单变量</Chip>
            <Chip color={C.violet}>可比较</Chip>
            <Chip color={C.amber}>18 分钟</Chip>
          </div>
        </div>
        <Foot>这样才能比较。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>真实序列，<br />周期很弱。</Body>
          <Body style={{ marginTop: 26 }}>
            只有一只股票的一段窗口。自相关在 24 处只有 0.4243，且没有局部峰。周期切退化，不是程序错，是数据本来就没有稳定周期。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="lag 24" v="0.4243" color={C.amber} />
            <KV k="局部峰" v="无" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="真实数据与合成数据，不能混着说" accent={C.coral}>
            <Row name="真实数据" value="512 点" note="000001.SZ，2024-09 到 2026-10" width={1010} color={C.cyan} />
            <Row name="股票数" value="1" note="只有一只，不能代表全市场" width={1010} color={C.violet} />
            <Row name="周期" value="弱" note="lag 24 只有 0.4243" width={1010} color={C.amber} />
            <Row name="局部峰" value="无" note="单调衰减，没有回弹" width={1010} color={C.coral} />
            <Row name="合成序列" value="P = 24" note="验证公式用，不代替真实结论" width={1010} color={C.cyan} />
          </Card>
        </div>
        <Foot>两者不能混着说。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>书中未给，<br />我们定。</Body>
          <Body style={{ marginTop: 26 }}>
            书里给了三种切法的名字和动机，没给具体算子。DCT 投影、0.3 阈值、四档分辨率、32 维前缀，都是这一集的选择，写进偏差表。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="算子" v="DCT" color={C.cyan} />
            <KV k="阈值" v="0.3" color={C.amber} />
            <KV k="前缀维" v="32" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="书中未给，逐项落到参数" accent={C.violet}>
            <Row name="算子" value="DCT-II" note="正交矩阵，可选 IDFT / Hadamard" width={1010} color={C.cyan} />
            <Row name="阈值" value="0.3" note="自相关峰的下限，可选 0.2 或 0.4" width={1010} color={C.amber} />
            <Row name="分辨率" value="4 档" note="1/2/4/8，可加 16 或减 8" width={1010} color={C.cyan} />
            <Row name="前缀维度" value="32" note="与 token 维度 d 一致" width={1010} color={C.violet} />
            <Row name="归属" value="偏差表" note="不是书里的，是我们的" width={1010} color={C.coral} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>可复现</Chip>
            <Chip color={C.violet}>不唯一</Chip>
            <Chip color={C.amber}>写清选择</Chip>
          </div>
        </div>
        <Foot>可复现，但不唯一。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四个不能推。</Body>
          <Body style={{ marginTop: 26 }}>
            不能推：换模型、换数据集、下游更好、这是最优。能说的是：三种切法都成立，token 数能手算，变换近无损，退化路径成立。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="能说" v="4 条" color={C.cyan} />
            <KV k="不能说" v="4 条" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="能说的与不能说的" accent={C.cyan}>
            <Row name="不能推" value="换模型也有效" note="没有比较不同模型" width={1010} color={C.coral} />
            <Row name="不能推" value="换数据也有效" note="只有一只股票、一段窗口" width={1010} color={C.coral} />
            <Row name="不能推" value="下游更好" note="没有跑预测任务" width={1010} color={C.coral} />
            <Row name="不能推" value="最优切法" note="只验证成立，不比较优劣" width={1010} color={C.coral} />
            <Row name="能说" value="三种切法都成立" note="计数、覆盖、重构都有读数" width={1010} color={C.cyan} />
            <Row name="能说" value="token 数可手算" note="96 ÷ p，整数除法" width={1010} color={C.cyan} />
          </Card>
        </div>
        <Foot>能说的只有这些。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
