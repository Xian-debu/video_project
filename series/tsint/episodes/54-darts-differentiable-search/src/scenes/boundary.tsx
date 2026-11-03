import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 286, width: 700 }}>
          <Card label="成立的：机制层" accent={C.cyan}>
            <Row name="式 6.11–6.13" value="全部成立" note="黄金值逐条验证" width={640} color={C.cyan} />
            <Row name="softmax" value="归一" note="权重非负且和为一" width={640} color={C.cyan} />
            <Row name="混合/凸包/等变" value="成立" note="三条性质分别断言" width={640} color={C.cyan} />
            <Row name="离散化流程" value="跑通" note="冻结、重训、上检验集" width={640} color={C.cyan} />
            <Row name="复现" value="逐位一致" note="同种子两次结果相同" width={640} color={C.cyan} />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 800, top: 286, width: 1040 }}>
          <Card label="不成立的：收益层" accent={C.coral}>
            <Row name="二十步搜索" value="没塌缩" note="0.3334 → 0.3338，只挪万分之四" width={970} color={C.coral} />
            <Row name="放大到 lr 500" value="塌缩但选错" note="6/8 条边塌，仅 2 种算子" width={970} color={C.coral} />
            <Row name="top-1 vs 随机" value="差 16.04%" note="267.2185 vs 230.2738" width={970} color={C.coral} />
            <Row name="全部 vs 零基线" value="全输" note="所有重训架构都不如 221.8159" width={970} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Chip color={C.cyan}>机制成立</Chip>
            <Chip color={C.coral}>收益不成立</Chip>
            <Chip color={C.inkDim}>两句话不能互换</Chip>
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这一集不能声称「搜索有效」。它只能声称「搜索机制被正确实现，并在这个任务上没有收益」。
          </div>
        </div>
        <Foot accent={C.coral}>机制成立，收益不成立；两句话不能互换。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1010 }}>
          <Card label="为什么没塌缩：三个可能，一个也不选" accent={C.amber}>
            <Row name="第一" value="步数太少" note="论文 50 轮 × 600 步；本机 20 步" width={940} color={C.cyan} />
            <Row name="第二" value="学习率错位" note="论文 3e-4，本机放大到 0.05 仍不够" width={940} color={C.violet} />
            <Row name="第三" value="任务太弱" note="次日收益没有可学信号" width={940} color={C.coral} />
            <Row name="处理" value="都写进边界" note="不挑一个当答案" width={940} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            把三个可能并列写出来，比事后挑一个「最合理」的解释更诚实。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1110, top: 292, width: 740 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>还有一个近似：<br />下层只走一步。</Body>
          <Body style={{ marginTop: 20 }}>
            一阶近似忽略了海森矩阵。步数越少，忽略越明显；本机没有二阶近似，所以搜索结果和论文不可比。
          </Body>
          <div style={{ marginTop: 18 }}>
            <KV k="内层步数" v="1" color={C.violet} />
            <KV k="二阶项" v="省掉" color={C.coral} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>第三个边界：<br />规模差两万倍。</Body>
          <Body style={{ marginTop: 20 }}>
            本机三个算子、八条边、两个块；论文十个左右算子、更大的格子、更深的堆叠。四十八个决策对约一百万个。
          </Body>
          <Body style={{ marginTop: 14 }}>
            空间规模直接决定两件事：搜索能不能塌缩、结论能不能外推。两万倍差距下，不能外推。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 770, top: 286, width: 1070 }}>
          <Card label="第四个边界：数据" accent={C.violet}>
            <Row name="样本" value="30 只股票" note="一个市场，七年多" width={1000} color={C.cyan} />
            <Row name="任务" value="单步 · 单变量" note="次日收益，线性头" width={1000} color={C.violet} />
            <Row name="没有的" value="协变量 / 图 / 多任务" note="这些都不是论文的设置" width={1000} color={C.amber} />
            <Row name="标签噪声" value="主导" note="任务本身没有信号，任何架构都学不到方向" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            负结果的一部分来自任务，一部分来自重训不足；这一集把两者分开写在边界里，不合并成一句「方法不行」。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1020 }}>
          <Card label="两句话，各自成立，不能互换" accent={C.cyan}>
            <Row name="机制成立" value="实现正确" note="公式、黄金值、流程、复现" width={950} color={C.cyan} />
            <Row name="收益不成立" value="这个任务没用" note="搜索没有赢过零基线" width={950} color={C.coral} />
            <Row name="不能反推" value="机制错" note="收益差不等于实现错" width={950} color={C.amber} />
            <Row name="也不能反推" value="方法有用" note="机制对不等于方法有效" width={950} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这一集的价值，就在于把这两件事拆开，各自给出可复现的证据。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1120, top: 296, width: 730 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>别把负结果<br />读成失败。</Body>
          <Body style={{ marginTop: 20 }}>
            二十八项全过，包括那几条「不如随机」「不如零基线」的断言。这说明管线是对的：它没有替结果化妆。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>下一集：<br />把空间变小。</Body>
          <Body style={{ marginTop: 20 }}>
            这一集把选择变连续；下一集换一个方向：怎么少试几次。三种剪枝——子空间、比较器、组合预测器。
          </Body>
          <Body style={{ marginTop: 14 }}>
            它们回答同一个问题：在算力有限时，怎么用更少的评估找到更好的架构。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Chip color={C.cyan}>这一集：连续化</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>下一集：剪空间</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 770, top: 286, width: 1070 }}>
          <Card label="三种省算力的思路" accent={C.violet}>
            <Row name="子空间" value="缩范围" note="只在大空间的一个小区域里搜" width={1000} color={C.cyan} />
            <Row name="比较器" value="找廉价代理" note="用便宜的指标替代完整训练" width={1000} color={C.violet} />
            <Row name="组合预测器" value="预测组合" note="由已评估的块推测未评估的块" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="本集决策" v={M.search.decisions} color={C.cyan} />
            <KV k="搜索步数" v="20" color={C.violet} />
            <KV k="保留路径" v="top-2" color={C.amber} />
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            记住：四十八、二十、两条路径。再记一句：机制成立，收益不成立。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);