import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三笔账，<br />三个负结果。</Body>
          <Body style={{ marginTop: 24 }}>
            第一笔：线性头没赢过预测均值。第二笔：旁路只挪了百分之零点零三。第三笔：锚点只有线性头的四分之一。
            这三句话都不好听，但它们是这一集量到的东西。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="相对误差" v={fmt4(M.probe.relMae)} color={C.coral} />
            <KV k="损失变化" v={M.lora.dropPct + "%"} color={C.coral} />
            <KV k="锚点 / 线性头" v={fmt2(M.anchor.anchorAcc) + " / " + fmt2(M.anchor.probeSynthAcc)} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三笔账 · 都照实讲" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="第一笔" value="没赢基线" note={"线性头 1.0543 对预测均值 1.0000；差百分之五点四"} width={962} color={C.coral} valueW={300} />
            <Row name="第二笔" value="没挪动" note={"损失 36.4925 → 36.4807，只降百分之零点零三"} width={962} color={C.coral} valueW={300} />
            <Row name="第三笔" value="差四倍" note={"锚点 0.09，线性头 0.365；机会 0.05"} width={962} color={C.coral} valueW={300} />
            <Row name="能确认的" value="参数账是准的" note="闭式解、逐位相同、正交词表，都是硬事实" width={962} color={C.cyan} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.coral}>三句话都不好听，但是量到的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>目标<br />换过一次。</Body>
          <Body style={{ marginTop: 24 }}>
            最早想预测 20 个未来收益：线性头 1.03，随机特征 1.05，都赢不了预测零。
            判定是：这个目标根本不在信号里。换到波动率，才有了现在的数。
          </Body>
          <Body style={{ marginTop: 16, color: C.amber }}>换目标不是作弊，但换过之后要说明白。</Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="换目标的经过" accent={C.amber} style={{ width: 1010 }} pad={20}>
            <Row name="原目标" value="20 个未来收益" note="方向 + 幅度；试着直接回归" width={962} color={C.inkDim} valueW={300} />
            <Row name="线性头" value="1.03" note="对预测均值 1.00，还是输" width={962} color={C.coral} valueW={300} />
            <Row name="随机特征" value="1.05" note="同参数量；说明不是正则没调好" width={962} color={C.coral} valueW={300} />
            <Row name="判定" value="不可预测" note="目标不在信号里，换目标是最小改动" width={962} color={C.amber} valueW={300} />
            <Row name="现目标" value="20 维波动率" note="累计平均绝对收益取对数；信号确实存在" width={962} color={C.cyan} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.amber}>换目标不是作弊，是承认原目标不在信号里。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>合成任务<br />也换过一次。</Body>
          <Body style={{ marginTop: 24 }}>
            最早用 20 类自回归序列，过编码器再做线性分类，准确率 0.045——就是机会水平。
            说明冻结编码器对这类序列不分层。后来改成表示空间的合成类，随机原型加噪声，这才分得开。
          </Body>
          <Body style={{ marginTop: 16, color: C.amber }}>这个失败路径留在代码里，没删。</Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="换任务的经过" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <Row name="原任务" value="20 类自回归" note="原始序列过编码器 → 线性分类" width={962} color={C.inkDim} valueW={300} />
            <Row name="结果" value="0.045" note="机会水平 0.05；冻结编码器不分层" width={962} color={C.coral} valueW={300} />
            <Row name="新任务" value="表示空间合成类" note="20 个随机原型 + 噪声；在 64 维空间里造类" width={962} color={C.violet} valueW={300} />
            <Row name="过程" value="保留失败路径" note="证据程序里仍跑旧的分类，只是不报为主要结论" width={962} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.violet}>失败路径留在代码里，没删。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>数据边界<br />也要说清楚。</Body>
          <Body style={{ marginTop: 24 }}>
            一只股票，两段时期；一个切分，没有交叉验证；旁路只用 92 对样本、八十轮；
            锚点任务在表示空间，不是原始数据。这些条件下结论成立，出了这些条件待验证。
          </Body>
          <Body style={{ marginTop: 16 }}>所以这一集给的不是「适配有效」，是「适配的代价可以被精确算出来」。</Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Card label="结论的适用条件" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="股票" value="一只" note="sz000001；百分比对数收益，日频" width={962} color={C.inkDim} valueW={300} />
            <Row name="切分" value="单一切分" note="732 / 243 / 224，没有交叉验证" width={962} color={C.amber} valueW={300} />
            <Row name="旁路样本" value={String(M.lora.pairs) + " 对"} note={"八十轮，lr 0.001；样本少，结论不牢"} width={962} color={C.coral} valueW={300} />
            <Row name="锚点任务" value="表示空间" note="合成类 + 噪声，不是原始序列" width={962} color={C.violet} valueW={300} />
            <Row name="结论" value="条件内成立" note="出了这些条件，待验证" width={962} color={C.cyan} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.coral}>说得清边界，才算讲完。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
