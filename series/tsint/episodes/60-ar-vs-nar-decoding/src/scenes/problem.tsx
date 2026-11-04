import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";
import { ParamCompare, RolloutDiagram } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>同一个编码器，<br />两种头。</Body>
          <Body style={{ marginTop: 26 }}>
            你手上有一个能压缩窗口的编码器，输出六十四维；还有一个线性头，把六十四维映射成一个数。自回归拿这个头一步步预测；
            非自回归给每个地平线各训一个头，一次输出二十维。两条路共用编码器，差别只在头的形状。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="编码器" v="66,113" color={C.cyan} />
            <KV k="AR 头" v="66" color={C.coral} />
            <KV k="NAR 头" v="1,320" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="参数账：同一张表示，两种出口" accent={C.cyan} style={{ width: 1020 }}>
            <ParamCompare width={968} />
          </Card>
          <Card label="差别只在最后一步" accent={C.violet} style={{ marginTop: 18, width: 1020 }}>
            <Row name="AR" value="预测 1 个点" note="拿这个点接回窗口，再预测下一个" width={972} color={C.cyan} valueW={300} />
            <Row name="NAR" value="输出 20 个点" note="一次矩阵向量乘，二十行各管一个未来时刻" width={972} color={C.violet} valueW={300} />
          </Card>
        </div>
        <Foot>结构一样，出口的形状不一样。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>误差被<br />喂回自己。</Body>
          <Body style={{ marginTop: 26 }}>
            自回归的第一个隐患是误差回灌。第一步的预测有误差，它会被当成第二步的输入；第二步的误差又进第三步。如果每一步的误差相互独立，
            方差线性相加，二十步之后标准差大约是一步的四点四七倍。这就是根号 F 的来源。
          </Body>
          <Formula size={46} style={{ marginTop: 26 }} note="F 是地平线长度；√20 = 4.47">
            √F = √20 ≈ <span style={{ color: C.amber }}>4.47</span>
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="回灌：每一步把窗口往前推一格" accent={C.coral} style={{ width: 1020 }}>
            <RolloutDiagram width={968} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            这是一个上界式的直觉，不是定理。真实模型里误差有系统性成分，每一步都往同一个方向推，不会相互抵消——所以实测曲线可能更陡，也可能更平。
          </div>
        </div>
        <Foot>滚雪球的样子，先画出来再量。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先把预期<br />写下来。</Body>
          <Body style={{ marginTop: 26 }}>
            预期一：自回归的误差随步数单调增长。预期二：非自回归长得更慢，最终反超。预期三：两步之间的误差不是独立噪声，
            所以根号 F 的曲线大概率不会贴住实测。贴住了说明误差接近白噪声，差很远说明模型有系统性偏差——两种结果都值得讲清楚。
          </Body>
          <div style={{ display: "flex", marginTop: 26, gap: 10 }}>
            <Chip color={C.cyan}>固定窗口</Chip>
            <Chip color={C.cyan}>固定编码器</Chip>
            <Chip color={C.cyan}>固定切分</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三条预期，逐条验" accent={C.cyan} style={{ width: 1020 }}>
            <Row name="预期一" value="单调增长" note="AR 的相对误差随 F 只升不降" width={972} color={C.cyan} valueW={300} />
            <Row name="预期二" value="NAR 反超" note="长地平线上 NAR 误差低于 AR" width={972} color={C.violet} valueW={300} />
            <Row name="预期三" value="不是独立噪声" note="√F 的 4.47 倍放大不会出现" width={972} color={C.amber} valueW={300} />
            <Row name="方法论" value="别把巧合当规律" note="三条固定之后，一次比较才有意义" width={972} color={C.coral} valueW={300} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            预期写下来再测，避免看到结果才编解释。
          </div>
        </div>
        <Foot>预期三，最后是唯一没被兑现的那一条。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个问题，<br />三组检查。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，回灌式 rollout 写得对不对——检验办法是复制函数：每一步都返回窗口最后一点，二十步之后每个输出都该等于那个点，
            纯定义检查。第二，误差随地平线怎么长。第三，非自回归一次能比自回归二十次快多少。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="ar 组" v="5 项" color={C.cyan} />
            <KV k="curve 组" v="3 项" color={C.violet} />
            <KV k="timing 组" v="2 项" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三问对应三组检查" accent={C.violet} style={{ width: 1020 }}>
            <Row name="第一问" value="复制函数" note="rollout 每一步都返回窗口最后一点，二十步后应全等" width={972} color={C.cyan} valueW={300} />
            <Row name="第二问" value="误差曲线" note="197 个窗口、F=1…20，找交叉点与放大倍数" width={972} color={C.violet} valueW={300} />
            <Row name="第三问" value="耗时比" note="同一台机器、同一批窗口上测量" width={972} color={C.amber} valueW={300} />
          </Card>
          <Card label="验收线" accent={C.coral} style={{ marginTop: 18, width: 1020 }} pad={18}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.coral, lineHeight: 1 }}>5×</div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
                非自回归一次前向必须比自回归二十次快五倍以上，否则这个解码方式在本集的数据上不值得讲。
              </div>
            </div>
          </Card>
        </div>
        <Foot>答案在第五场，先把定义写清楚。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
