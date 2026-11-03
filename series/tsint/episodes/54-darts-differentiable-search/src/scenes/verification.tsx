import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { CHECK_GROUPS, GROUP_NAME, M, Body, Card, CheckGrid, Chip, KV, PAD, Pages, Row, Scene, SceneHead, checksOf, pagesOf } from "../shared";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>二十八项怎么过：<br />先数据，再机制。</Body>
          <Body style={{ marginTop: 20 }}>
            一条命令，五组检查，三点八秒。格子一行一组，每一格是一项；全绿才算过，没有跳过的项。
          </Body>
          <div style={{ marginTop: 24 }}>
            <CheckGrid at={18} />
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            {CHECK_GROUPS.map((g) => GROUP_NAME[g] + " " + checksOf(g).length).join(" · ")}
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="数据组 · 四项" accent={C.cyan}>
            <Row name="股票" value={M.data.stocks + " 只"} note="每只至少 1,500 根日线" width={980} color={C.cyan} />
            <Row name="共同交易日" value={M.data.commonDays.toLocaleString("en-US")} note="取交集后再滑窗，避免错位" width={980} color={C.violet} />
            <Row name="窗口" value={M.data.windows.total.toLocaleString("en-US")} note={"每只 " + M.data.windows.min.toLocaleString("en-US") + " – " + M.data.windows.max.toLocaleString("en-US")} width={980} color={C.amber} />
            <Row name="切分" value="42,067 / 9,003 / 9,045" note="三段之和 = 60,115，不重叠" width={980} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            每只股票各自切 70 / 15 / 15：时间上不能穿越，股票之间也不能借数据。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1010 }}>
          <Card label="DARTS 组 · 六项" accent={C.violet}>
            <Row name="α = [0, 0]" value="[0.5, 0.5]" note="平局：两条路径各一半" width={940} color={C.cyan} />
            <Row name="α = [0, 10]" value="[4.54e-5, 0.99995]" note="极端：softmax 放大指数差" width={940} color={C.violet} />
            <Row name="混合" value="[0.5, 1.0]" note="恒等 + 置零，输入 [1, 2]" width={940} color={C.amber} />
            <Row name="one-hot" value="[1, 2]" note="权重全给恒等，复现输入" width={940} color={C.cyan} />
            <Row name="20 步损失" value="0.3763 → 0.2798" note="参数更新确实在下降" width={940} color={C.violet} />
            <Row name="走一步" value="位移 0.0029" note="步数 +1，α 真的在动" width={940} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            前四项是公式的黄金值，后两项证明优化循环接得对。阈值不是现场定的，写在测试里。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1120, top: 296, width: 730 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>黄金值的作用：<br />抓实现，不抓性能。</Body>
          <Body style={{ marginTop: 20 }}>
            如果 softmax 忘了减最大值，极端值会溢出；如果混合算子把权重当成加数，输出就会错位。这两类错误都会被黄金值当场抓住。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>搜索组 · 六项：<br />空间、阶梯、塌缩。</Body>
          <Body style={{ marginTop: 20 }}>
            空间 3 个算子、8 条边、6,561 个架构，48 个离散决策；两万分之一，与原论文不可比。
          </Body>
          <Body style={{ marginTop: 14 }}>
            学习率阶梯五档，末步权重从 0.3338 升到 0.9424；只有 500 这一档在第十二步塌到六条边。
          </Body>
          <div style={{ marginTop: 20 }}>
            <Chip color={C.cyan}>6,561 个架构</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>48 个决策</Chip>
            <Chip color={C.coral} style={{ marginLeft: 10 }}>≈ 1/20,833</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 770, top: 286, width: 1070 }}>
          <Card label="五档学习率的终点" accent={C.amber}>
            <Row name="lr = 0.05" value="0.3338" note="未塌缩，所有边仍三选一" width={1000} color={C.cyan} />
            <Row name="lr = 0.5" value="0.3382" note="开始抬头，仍未塌缩" width={1000} color={C.cyan} />
            <Row name="lr = 5" value="0.3806" note="权重变尖，仍然分散" width={1000} color={C.amber} />
            <Row name="lr = 50" value="0.6585" note="逼近塌缩，但没有越过阈值" width={1000} color={C.amber} />
            <Row name="lr = 500" value="0.9424" note="第 12 步 6/8 条边塌缩，仅 2 种算子" width={1000} color={C.coral} />
            <Row name="默认跑分" value="0.3338" note="20 步，塌缩边 0；全流程 3.79 s" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            塌缩的检查同时断言「步数 + 边数 + 算子种类」：塌缩不等于全押一种，也不等于选对。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1010 }}>
          <Card label="三层空间组 · 六项" accent={C.cyan}>
            <Row name="宏观" value="1.2" note="0.9×1 + 0.1×3" width={940} color={C.cyan} />
            <Row name="微观" value="3.0" note="0.5×2 + 0.5×4" width={940} color={C.violet} />
            <Row name="三层" value="6.5" note="0.5×3 + 0.5×10" width={940} color={C.amber} />
            <Row name="凸包" value="2.8 ∈ [1, 4]" note="0.2×1 + 0.3×2 + 0.5×4，不外插" width={940} color={C.cyan} />
            <Row name="置换等变" value="2.2" note="0.4×1 + 0.6×3，换序不变" width={940} color={C.violet} />
            <Row name="离散选择" value="12" note="2 块 + 2 表达式 + 8 边" width={940} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这一组不碰数据，只碰组合律：三层都能写成加权求和，性质就要逐条成立。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1120, top: 286, width: 730 }}>
          <Card label="演示组 · 六项" accent={C.coral}>
            <Row name="超网" value="288.4740" note="高于所有离散架构" width={670} color={C.inkFaint} />
            <Row name="top-1 vs 随机" value="+16.04%" note="267.2185 vs 230.2738" width={670} color={C.coral} />
            <Row name="全部 vs 零基线" value="更低" note="所有重训架构都输给 221.8159" width={670} color={C.coral} />
            <Row name="同批差" value="7 / 8" note="不切验证集，七条边不同" width={670} color={C.amber} />
            <Row name="top-2 vs top-1" value="4.09%" note="相对差，小于 5% 阈值" width={670} color={C.violet} />
            <Row name="同种子" value="逐位一致" note="两次跑分完全相同" width={670} color={C.cyan} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 680 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>负结果，<br />也写成断言。</Body>
          <Body style={{ marginTop: 22 }}>
            这是这一集最想让你看到的做法。计划里猜的三个结论，两个不成立；不成立的部分没有删掉，而是变成了会失败的检查。
          </Body>
          <Body style={{ marginTop: 14 }}>
            以后引用这一集，只能用这些数：别把机制成立说成收益成立，也别把本机复现说成论文复现。
          </Body>
          <div style={{ marginTop: 22, display: "flex", gap: 22 }}>
            <KV k="通过" v={M.meta.passed + " / " + M.meta.total} color={C.cyan} />
            <KV k="阈值" v="未改" color={C.violet} />
            <KV k="耗时" v={M.seconds.toFixed(2) + "s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 286, width: 1040 }}>
          <Card label="检查的排序：数据 → 机制 → 收益" accent={C.cyan}>
            <Row name="数据" value="4 项" note="股票、共同日、窗口、切分" width={970} color={C.cyan} />
            <Row name="机制" value="12 项" note="DARTS 公式 6 + 三层空间 6" width={970} color={C.violet} />
            <Row name="过程" value="6 项" note="空间、阶梯、塌缩、默认跑分、时限" width={970} color={C.amber} />
            <Row name="收益" value="6 项" note="七个 MAE 的偏序、差值、复现" width={970} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            三点八秒能跑完，是因为规模小；换成原论文规模要按小时算。但检查的结构不变。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
