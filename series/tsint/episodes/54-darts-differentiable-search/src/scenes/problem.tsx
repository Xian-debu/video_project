import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { SpaceCompare } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>离散空间里，<br />没有「再走一点」。</Body>
          <Body style={{ marginTop: 24 }}>
            一个神经网络里有大量可以选的结构：用哪种算子，连几条边，堆几个模块。这些选择原本靠人做经验判断。自动机器学习想把它们交给搜索算法。
          </Body>
          <Body style={{ marginTop: 16 }}>
            但架构是离散对象，选项之间不连续。你不能问「往这个方向走一点会怎样」，因为没有方向，只有跳变。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
          <Card label="一个块里，选择长这样" accent={C.violet}>
            <Row name="算子" value="3 选 1" note="恒等 / 一维卷积 / 置零" width={990} color={C.cyan} />
            <Row name="边" value="8 条" note="每条边独立选择" width={990} color={C.violet} />
            <Row name="block" value="2 个" note="共享同一套选择" width={990} color={C.amber} />
            <Row name="离散决策" value={M.search.decisions} note="3 × 8 × 2，全部是离散变量" width={990} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            梯度要求连续；选择是离散的。这就是全部矛盾。
          </div>
        </div>
        <Foot accent={C.violet}>离散空间没有方向，只有跳变。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
          <Card label="穷举的代价可以算出来" accent={C.coral}>
            <Row name="一个块" value={M.search.space.cells.toLocaleString("en-US")} note="3^8 种算子组合" width={930} color={C.cyan} />
            <Row name="每个架构" value="150 步" note="重训才拿得到真实误差" width={930} color={C.violet} />
            <Row name="一次全枚举" value="≈ 98 万步" note="6,561 × 150，还不含验证" width={930} color={C.coral} />
            <Row name="论文空间" value="≈ 10^6" note="图更深、算子更多、边更密" width={930} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            穷举不可行；随机撒点更省，但命中率随空间膨胀迅速下跌。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1090, top: 296, width: 760 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>算力，是第一个约束。</Body>
          <Body style={{ marginTop: 22 }}>
            随机搜索不需要梯度，但它没有记忆：每次采样都是独立事件，学不到「哪个方向更好」。
          </Body>
          <Body style={{ marginTop: 14 }}>
            要省算力，就得让每一次评估都留下信息。梯度恰好就是这种信息。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>把「选」，<br />换成「加权」。</Body>
          <Body style={{ marginTop: 24 }}>
            每个算子配一个实数权重，权重过 softmax 变成概率。混合算子的输出是所有算子输出的加权和。
          </Body>
          <Body style={{ marginTop: 14 }}>
            这样输出对权重可导，权重就是普通参数。搜索变成训练，训练有成熟的优化器、学习率和正则，可以直接复用。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="松弛只改了一件事" accent={C.cyan}>
            <Row name="原来" value="argmax" note="从三个算子里挑一个，不可导" width={1000} color={C.inkDim} />
            <Row name="现在" value="softmax" note="三个算子各给一个权重，可导" width={1000} color={C.cyan} />
            <Row name="混合输出" value="Σ wᵢ · oᵢ(x)" note="三条路径同时存在" width={1000} color={C.violet} />
            <Row name="搜索目标" value="min L(α, w)" note="α 是权重参数，w 是网络参数" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            选择没有被删掉，只是从「取最大」推迟到「最后再取最大」。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 1030 }}>
          <Card label="但松弛的网络，不是离散的网络" accent={C.amber}>
            <Row name="搜索时" value="3 条路径" note="混合输出的数量级是折中的" width={960} color={C.violet} />
            <Row name="离散后" value="1 条路径" note="每条边只留权重最大的算子" width={960} color={C.cyan} />
            <Row name="能不能继承" value="不能" note="必须冻结选择、重新训练" width={960} color={C.coral} />
            <Row name="本机重训" value="150 步" note="算力所限，不是收敛值" width={960} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            这是这一集最重要的工程约束：离散化不是一次格式转换，而是一次重新训练。
          </div>
        </div>
        <div style={{ position: "absolute", left: 1120, top: 296, width: 730 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>一百五十步，<br />够不够？</Body>
          <Body style={{ marginTop: 22 }}>
            两千步会让所有权重过拟合，四百步仍然偏晚；一百五十步是在本机算力下，让「重训」这件事还能跑完的折中。
          </Body>
          <Body style={{ marginTop: 14 }}>
            这个折中会直接反映到最后的误差上。后面读数会看到：重训不足，负结果有一部分来自这里。
          </Body>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>权重在验证集上学，<br />参数在训练集上学。</Body>
          <Body style={{ marginTop: 24 }}>
            否则权重只学会在训练集上挑模型，搜索出来的架构一上检验集就垮。这就是双层优化：内层训练参数，外层选择权重。
          </Body>
          <Body style={{ marginTop: 14 }}>
            精确解要算海森矩阵，代价是参数量的平方。本机用一阶近似：内层只走一步，把这一步的梯度当成权重的梯度。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1050 }}>
          <Card label="双层：谁在哪份数据上更新" accent={C.violet}>
            <Row name="内层" value="训练批" note="更新 w，一步" width={980} color={C.cyan} />
            <Row name="外层" value="验证批" note="更新 α，用一阶近似" width={980} color={C.violet} />
            <Row name="省掉的" value="海森" note="不做二阶展开，误差不推导" width={980} color={C.amber} />
            <Row name="验收方式" value="28 项" note="事后检查，不做事前保证" width={980} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 22 }}>
            <KV k="内层步数" v="1" color={C.cyan} />
            <KV k="搜索步数" v="20" color={C.violet} />
            <KV k="α 学习率" v="0.05" color={C.amber} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);