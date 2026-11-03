import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三条边界，<br />先于结论。</Body>
          <Body style={{ marginTop: 24 }}>
            这一集能说的只有「合成空间上的机制」和「真实任务上的负结果」。边界不写清楚，负结果就会被读成「策略无效」，正结果会被读成「搜索有效」。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="三条边界，各自有读数" accent={C.amber}>
            <Row name="第一条" value="合成最优在角" note="子空间往中间缩，结构上到不了 0.9 以上" width={1010} color={C.coral} />
            <Row name="第二条" value="真实任务无信号" note="次日收益预测不出方向，零基线最低" width={1010} color={C.amber} />
            <Row name="第三条" value="规模差十四个量级" note="10^6 对 10^20，预算比例不可直接搬" width={1010} color={C.violet} />
            <Row name="处理" value="都写进边界" note="不挑一个最合理解释" width={1010} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            三条边界对应三组检查：子空间六项、迁移五项、合成九项。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>子空间为什么<br />到不了角上。</Body>
          <Body style={{ marginTop: 24 }}>
            收缩盒的每一维都是「均值加减标准差」。合成空间的最优在四个角，角上的点会把均值拉向中间、把标准差压小，盒子于是越缩越偏。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.coral}>盒心 0.71</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>最优 &gt; 0.89</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="收缩的几何后果" accent={C.coral}>
            <Row name="初始盒" value="[0.35, 0.95]" note="覆盖整个右上角" width={1010} color={C.cyan} />
            <Row name="最终盒" value="[0.65, 0.79]" note="四维都在这个区间" width={1010} color={C.amber} />
            <Row name="最优值位置" value="四个角" note="每维 0.9 以上" width={1010} color={C.coral} />
            <Row name="差距" value="&gt; 0.10" note="盒子中心离角的最小距离" width={1010} color={C.violet} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这不是实现错误：收缩逻辑完全正确，它在「好点聚集」的假设下有效，而这个空间不满足该假设。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四个不能推。</Body>
          <Body style={{ marginTop: 24 }}>
            不能推真实任务有效、不能推更大规模有效、不能推别的数据集有效、不能推任何理论保证。前三条是范围，最后一条是性质。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="能说的与不能说的" accent={C.violet}>
            <Row name="能说" value="机制可复现" note="公式、预算、黄金值逐项成立" width={1010} color={C.cyan} />
            <Row name="能说" value="合成上抬升" note="比随机高零点一零到零点一四" width={1010} color={C.cyan} />
            <Row name="能说" value="真实上持平" note="最好只比零基线好万分之三" width={1010} color={C.amber} />
            <Row name="不能说" value="搜索有效" note="真实任务没有支持这一点的读数" width={1010} color={C.coral} />
            <Row name="不能说" value="换任务也行" note="只测了一种任务、一种切分" width={1010} color={C.coral} />
            <Row name="不能说" value="有理论保证" note="没有收敛性证明，只有实验" width={1010} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 580 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个常数，<br />一条可复现的路。</Body>
          <Body style={{ marginTop: 24 }}>
            合成空间一百万点、预算一万次、top 比例百分之一；真实任务三十只股票、六万零一百一十五个窗口。这些数字固定，换一个就要重跑证据。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="合成" v="10^6" color={C.cyan} />
            <KV k="预算" v="10^4" color={C.violet} />
            <KV k="top" v="0.01" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="这一集交付的边界" accent={C.cyan}>
            <Row name="算法" value="3 个模块" note="子空间 / 比较器 / 组合预测器" width={1010} color={C.cyan} />
            <Row name="合成" value="9 项检查" note="体积、间隙、阈值、盒宽" width={1010} color={C.violet} />
            <Row name="真实" value="5 项检查" note="零基线、最好、全距、家族" width={1010} color={C.amber} />
            <Row name="下一集" value="分布式与并行" note="搜索之外，还有怎么把训练铺开" width={1010} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            边界不是免责声明，是把结论钉在它能承受的范围里。
          </div>
        </div>
        <Foot>合成上成立，真实上不成立；两句话都写进了证据。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
