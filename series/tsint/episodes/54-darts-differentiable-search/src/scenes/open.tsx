import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";
import { EdgeGrid, SpaceCompare } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>把选择<br />变成权重。</Body>
          <Body style={{ marginTop: 26 }}>
            上一集把十个模型平均起来，赢不过最强的那一个。这一集换一个问题：架构本身能不能被搜索出来。先给结论：机制成立，收益不成立。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="离散选择" v={M.search.decisions} color={C.cyan} />
            <KV k="搜索步数" v={20} color={C.violet} />
            <KV k="保留路径" v="top-2" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三个数，两条结论" accent={C.amber}>
            <Row name="离散决策" value={M.search.decisions} note="3 算子 × 8 边 × 2 block" width={980} color={C.cyan} />
            <Row name="架构组合" value={M.search.space.cells.toLocaleString("en-US")} note="单个 block 的 3^8 种选法" width={980} color={C.violet} />
            <Row name="搜索步数" value={20} note="论文尺度的 alpha 学习率" width={980} />
            <Row name="重训步数" value={150} note="离散化之后每个架构重训" width={980} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>机制成立</Chip>
            <Chip color={C.coral}>收益不成立</Chip>
            <Chip color={C.violet}>完整跑通 28 项</Chip>
          </div>
        </div>
        <Foot>架构能被连续化，但这一集没有搜出收益。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>一个玩具格子：<br />八条边，三个算子。</Body>
          <Body style={{ marginTop: 24 }}>
            每条边从恒等、一维卷积、置零里选一个。一个 block 的架构数是三的八次方。两个 block 共享同一套选择，所以一共四十八个离散决策。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>3^8 = {M.search.space.cells.toLocaleString("en-US")}</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>3×8×2 = {M.search.decisions}</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="缩小两万倍，但结构完整" accent={C.cyan}>
            <SpaceCompare width={960} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            空间小，不代表问题简单：离散空间本身没有梯度。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>松弛：<br />不要选一个，先全都要。</Body>
          <Body style={{ marginTop: 24 }}>
            每个算子给一个权重，权重过 softmax，非负且和为一。混合输出对权重可导，权重对参数可导，于是选择变成了训练。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.9 }}>
            α = [0, 0] → 权重 [0.5, 0.5]<br />
            α = [0, 10] → [4.54e-5, 0.99995]
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 292, width: 1120 }}>
          <Card label="混合算子：三条路径同时存在" accent={C.violet}>
            <Row name="恒等算子" value="x" note="原样输出" width={1040} color={C.cyan} />
            <Row name="一维卷积" value="conv(x)" note="邻域加权" width={1040} color={C.violet} />
            <Row name="置零算子" value="0" note="直接消失" width={1040} color={C.coral} />
            <Row name="加权输出" value="Σ w_i · o_i(x)" note="w 由 α 的 softmax 给出" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            搜索 = 训练；反向传播直接把梯度送到 α 上。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>权重在验证集上学，<br />参数在训练集上学。</Body>
          <Body style={{ marginTop: 24 }}>
            这是双层优化。精确的二阶梯度要算海森矩阵，太贵；本机只走一步内层，再更新权重。搜索完还必须离散化，再重训。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Chip color={C.cyan}>内层：训练参数</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>外层：验证权重</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一次搜索的四步" accent={C.cyan}>
            <Row name="01 内层" value="1 步" note="用训练批更新参数，只走一步" width={980} />
            <Row name="02 外层" value="验证梯" note="在验证批上算 alpha 的梯度" width={980} color={C.violet} />
            <Row name="03 离散" value="top-1 / 2" note="每条边取权重最大的算子，冻结" width={980} color={C.amber} />
            <Row name="04 重训" value="150 步" note="离散架构重新训练，再上检验集" width={980} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            省掉海森矩阵，代价是近似误差；这一集不做理论分析，只做事后验收。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>四段路线，<br />一份证据。</Body>
          <Body style={{ marginTop: 24 }}>
            定义、读数、实现、验收。每一段都有真实读数，读数来自同一份证据程序：二十八项检查，三点八秒，一条命令跑完。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="从定义到 28 项检查" accent={C.cyan}>
            <Row name="01 定义" value="3 个式子" note="softmax 权重、双层目标、三层空间" width={1040} />
            <Row name="02 读数" value="7 组 MAE" note="零基线到超网的同一条尺" width={1040} color={C.violet} />
            <Row name="03 实现" value="2 个模块" note="311 行纯函数，无随机" width={1040} color={C.cyan} />
            <Row name="04 验收" value="28 项" note="数据 / DARTS / 搜索 / 三层空间 / 演示" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="股票" v={M.data.stocks} color={C.cyan} />
            <KV k="窗口" v={M.data.windows.total.toLocaleString("en-US")} color={C.violet} />
            <KV k="检查" v="28 / 28" color={C.amber} />
            <KV k="耗时" v={M.seconds.toFixed(2) + "s"} color={C.inkDim} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);