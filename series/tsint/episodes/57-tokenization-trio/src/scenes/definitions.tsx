import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, Formula, fmt4, pagesOf } from "../shared";
import { AcfChart, PrefixDiagram, PrefixNearest, TokenStrip } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先定义 patch。</Body>
          <Body style={{ marginTop: 24 }}>
            把序列按长度 p 切开，每块是一个 p 维向量；乘一个 p×d 的投影矩阵，得到 d 维 token。这一集 d=32，矩阵用 DCT 构造。
          </Body>
          <Formula size={44} style={{ marginTop: 24 }}>z = W_p · x</Formula>
          <div style={{ marginTop: 20, display: "flex" }}>
            <KV k="p" v="8 / 16 / 32" color={C.cyan} />
            <KV k="d" v="32" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="patch embedding：切开、投影" accent={C.cyan}>
            <TokenStrip p={8} width={1040} height={52} />
            <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              W_p 由 DCT-II 生成：正交，行列式 ±1，不放大也不缩小。
            </div>
          </Card>
        </div>
        <Foot>投影不丢信息。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>正交，<br />所以无损。</Body>
          <Body style={{ marginTop: 26 }}>
            W 乘 W 转置是单位阵。切出去，能原样拼回来。重构误差和正交误差都在浮点精度以内，说明这一步不是「近似」，而是「换坐标」。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="重构误差" v="3.11e-15" color={C.cyan} />
            <KV k="正交误差" v="2.02e-15" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="四个读数，都是自验证" accent={C.violet}>
            <Row name="重构误差" value="3.11e-15" note="WᵀW 之后与原序列比，最大误差" width={1040} color={C.cyan} />
            <Row name="正交误差" value="2.02e-15" note="WᵀW 与单位阵的最大偏差" width={1040} color={C.violet} />
            <Row name="覆盖" value="96 / 96" note="不重叠时，每个点恰好属于一个 token" width={1040} color={C.amber} />
            <Row name="token 维度" value="32" note="三种 patch 长度共用 d" width={1040} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>可逆</Chip>
            <Chip color={C.violet}>不训练</Chip>
            <Chip color={C.amber}>精度内</Chip>
          </div>
        </div>
        <Foot>这是最好的自验证。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>自相关，<br />找第一个峰。</Body>
          <Body style={{ marginTop: 26 }}>
            自相关量的是「错开 k 点之后，自己还像不像自己」。lag 为 0 等于 1；有周期 P 时，lag P 处出现峰。找第一个过阈值、且是局部极大的 lag。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="阈值" v="0.3" color={C.coral} />
            <KV k="要求" v="局部极大" color={C.amber} />
            <KV k="主峰" v="24" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="自相关在 lag 24 达到 1" accent={C.cyan}>
            <AcfChart data={M.period.sinAcf} peak={M.period.peak} threshold={M.period.threshold} width={1040} height={300} label="合成序列：lag 24 与 lag 48 都是峰；取第一个，24。" />
          </Card>
        </div>
        <Foot>真实序列，峰不一定有。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>周期切，<br />只取整周期。</Body>
          <Body style={{ marginTop: 24 }}>
            第 j 个 token 取 j 到 j+P 这一段。token 数用整数除法，余下的点不足一个周期，直接丢掉。不补零，因为补零会污染注意力。
          </Body>
          <Formula size={38} style={{ marginTop: 22 }}>T_j = x[jP : (j+1)P]</Formula>
          <div style={{ marginTop: 18, display: "flex" }}>
            <KV k="token" v="4" color={C.cyan} />
            <KV k="每块" v="24" color={C.violet} />
            <KV k="余数" v="0" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="五个约定" accent={C.amber}>
            <Row name="token 数" value="4" note="96 ÷ 24，整数除法" width={1040} color={C.cyan} />
            <Row name="每块长度" value="24 点" note="正好一个周期" width={1040} color={C.violet} />
            <Row name="余下不足" value="0 点" note="96 是 24 的整数倍" width={1040} color={C.amber} />
            <Row name="尾块处理" value="丢弃" note="不补零，补零会污染注意力" width={1040} color={C.coral} />
            <Row name="找不到周期" value="退化" note="退回固定 patch，不硬凑" width={1040} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>整周期</Chip>
            <Chip color={C.coral}>不补零</Chip>
            <Chip color={C.amber}>可退化</Chip>
          </div>
        </div>
        <Foot>这是兜底，也是诚实。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>分辨率前缀，<br />一个向量。</Body>
          <Body style={{ marginTop: 26 }}>
            每一档分辨率配一个可学习向量 e_r。拼接时放在 token 最前面，长度加一。位置编码要整体偏移一位，因为前缀也占一个位置。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="档位" v="1 / 2 / 4 / 8" color={C.cyan} />
            <KV k="维度" v="32" color={C.violet} />
            <KV k="长度" v="+1" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="前缀 + 四个周期 token" accent={C.violet}>
            <PrefixDiagram width={1040} />
            <div style={{ height: 18 }} />
            <PrefixNearest width={1040} />
          </Card>
        </div>
        <Foot>位置编码，从一位开始。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
