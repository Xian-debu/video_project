import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Formula, KV, Mono, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { ThreeLayer } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>式 6.11：<br />同一条边的权重。</Body>
          <Formula note="只在同一对 (i, j) 的三个算子上做 softmax">
            <span>w<sub>o</sub> = exp(α<sub>o</sub>) / Σ<sub>o′</sub> exp(α<sub>o′</sub>)</span>
          </Formula>
          <Body style={{ marginTop: 22 }}>
            混合算子就是这些权重的加权和。式子里没有新的网络层，只有一组参数 α。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 820, top: 286, width: 1020 }}>
          <Card label="两个黄金值：softmax 的手感" accent={C.cyan}>
            <Row name="α = [0, 0]" value={"[0.5, 0.5]"} note="平局：两条路径各一半" width={950} color={C.cyan} />
            <Row name="α = [0, 10]" value={"[4.54e-5, 0.99995]"} note="陡峭：softmax 把差距放大成指数" width={950} color={C.violet} valueW={470} />
            <Row name="α = [0, -10]" value={"[0.99995, 4.54e-5]"} note="镜像，方向反过来" width={950} color={C.amber} valueW={470} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            温度是 1 时才这样；温度也是可调的，但这一集不引入它。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
          <Card label="混合算子会把两条路径平均" accent={C.violet}>
            <Row name="权重" value="[0.5, 0.5]" note="α = [0, 0]" width={930} color={C.cyan} />
            <Row name="算子" value="恒等 + 置零" note="identity(x) = x，zero(x) = 0" width={930} color={C.violet} />
            <Row name="输入 [1, 2]" value="[0.5, 1.0]" note="0.5×[1,2] + 0.5×[0,0]" width={930} color={C.amber} />
            <Row name="one-hot 恒等" value="[1, 2]" note="权重 [1,0] 时原样复现" width={930} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            混合是连续的，离散是跳跃的；这两条检查同时成立，松弛才可信。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1110, top: 296, width: 740 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>平均，<br />不等于选择。</Body>
          <Body style={{ marginTop: 22 }}>
            输入是 1 和 2，混合输出 0.5 和 1.0。这个数值既不是恒等的结果，也不是置零的结果，而是它们之间。
          </Body>
          <Body style={{ marginTop: 14 }}>
            alpha 训到极端时，softmax 趋近 one-hot，混合才趋近离散。收敛之前，网络一直在「折中区」里训练。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 690 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>式 6.12：<br />在验证集上选 α。</Body>
          <Formula note="内层解 w*(α)，外层最小化验证损失">
            <span>min<sub>α</sub> L<sub>val</sub>( w*(α), α )</span>
          </Formula>
          <Body style={{ marginTop: 22 }}>
            这也是为什么搜索需要三份数据：训练、验证、检验。前两份参与搜索，最后一份只用来报告。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 800, top: 286, width: 1040 }}>
          <Card label="学习率的两个尺度" accent={C.amber}>
            <Row name="参数 w" value="1e-2" note="常规训练尺度" width={970} color={C.cyan} />
            <Row name="权重 α" value="3e-4" note="论文：远小于 w，避免提前塌缩" width={970} color={C.violet} />
            <Row name="本机 α" value="0.05" note="20 步内要走完，故意放大" width={970} color={C.amber} />
            <Row name="后果" value="不塌缩" note="20 步后平均最大权重仍 0.3338" width={970} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            学习率不是超参数细节，它决定了这一集能不能看到「塌缩」这个机制。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>式 6.13：<br />三层空间，每层一个 softmax。</Body>
          <Body style={{ marginTop: 20 }}>
            宏观选 block，微观选隐藏表达式，算子层选算子。每层各做一次 softmax，再嵌套组合。
          </Body>
          <div style={{ marginTop: 20 }}>
            <Chip color={C.cyan}>1.2 · 宏观</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>3.0 · 微观</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>6.5 · 三层</Chip>
          </div>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8 }}>
            0.9×1 + 0.1×3 = 1.2<br />
            0.5×2 + 0.5×4 = 3.0<br />
            0.5×3 + 0.5×10 = 6.5
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1060 }}>
          <ThreeLayer />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            12 个离散选择 = 2 个 block + 2 个表达式 + 8 条边的算子。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
          <Card label="三条性质，定义了「合法的权重」" accent={C.cyan}>
            <Row name="归一" value="Σ w = 1" note="softmax 天然满足，负权重不可能出现" width={930} color={C.cyan} />
            <Row name="凸包" value="输出 ∈ [1, 4]" note="0.2×1 + 0.3×2 + 0.5×4 = 2.8，不会越界" width={930} color={C.violet} />
            <Row name="置换等变" value="2.2" note="0.4×1 + 0.6×3，交换顺序结果不变" width={930} color={C.amber} />
            <Row name="确定性" value="无随机" note="同一组输入，永远同一组输出" width={930} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            {M.stg.choices} 个离散选择、{M.search.space.cells.toLocaleString("en-US")} 个格子架构，都能用这三条性质描述。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1110, top: 296, width: 740 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>归一、凸包、等变。</Body>
          <Body style={{ marginTop: 22 }}>
            这三条性质是后面所有黄金值的来源：检查不测「模型好不好」，只测「机制有没有被正确实现」。
          </Body>
          <Body style={{ marginTop: 14 }}>
            机制正确，不等于收益成立。这个区分会一直用到最后一场。
          </Body>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);