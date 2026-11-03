import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, fmtInt, pagesOf } from "../shared";
import { ChannelStack, CorrMatrix, TokenRun } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>六条通道，<br />三种策略。</Body>
          <Body style={{ marginTop: 26 }}>
            上一集把序列切成了 token。这一集多出六条通道：每条独立切，还是先拼起来再切？不是口味问题，是一个由相关性决定的选择题。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="通道" v="6" color={C.cyan} />
            <KV k="CI" v="96" color={C.cyan} />
            <KV k="CM" v="16" color={C.amber} />
            <KV k="Hybrid" v="32" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一个选择，三种策略" accent={C.cyan}>
            <Row name="通道独立" value="96 token" note="每条通道 16 个 token，各自一套参数" width={1000} color={C.cyan} />
            <Row name="通道混合" value="16 token" note="同一时刻六个值先拼起来，再切 16 段" width={1000} color={C.amber} />
            <Row name="两两混合" value="32 token" note="按相关性分 2 组，组内混合、组间独立" width={1000} color={C.violet} />
            <Row name="判据" value="两个数" note="mean|ρ| 与 effRank，两个阈值" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>不训练</Chip>
            <Chip color={C.amber}>可手算</Chip>
            <Chip color={C.violet}>可复现</Chip>
          </div>
        </div>
        <Foot>先看数据，再选策略。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>六只 A 股，<br />六条通道。</Body>
          <Body style={{ marginTop: 26 }}>
            平安、万科、五粮液、浦发、茅台、招商。两年日线，五百一十二个对数收益，六列严格对齐。每天六个收益，同时进模型。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="通道" v="6" color={C.cyan} />
            <KV k="收益" v="512" color={C.violet} />
            <KV k="起点" v="2024-09" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="六条通道的相关矩阵" accent={C.cyan}>
            <div style={{ display: "flex", gap: 34 }}>
              <CorrMatrix corr={M.data.corr} codes={M.data.codes} cell={58} />
              <div style={{ paddingTop: 20 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>MEAN |ρ|</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.cyan, marginTop: 4 }}>{fmt4(M.data.meanAbsCorr)}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 20 }}>MAX |ρ|</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.amber, marginTop: 4 }}>{fmt4(M.data.maxAbsCorr)}</div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 20, width: 300, lineHeight: 1.5 }}>颜色越亮，相关越强；对角恒为 1。</div>
              </div>
            </div>
          </Card>
        </div>
        <Foot>六列并排，就是六条通道。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>同一段序列，<br />两种切法。</Body>
          <Body style={{ marginTop: 26 }}>
            通道独立：每条通道自己切十六块，六条并排九十六个 token。通道混合：每一时刻六个值拼成一百九十二维，再投影、再切，只有十六个 token。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="CI" v="96" color={C.cyan} />
            <KV k="CM" v="16" color={C.amber} />
            <KV k="H2" v="32" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="上：通道独立 6 × 16；下：通道混合 16 段" accent={C.amber}>
            <ChannelStack rows={6} perRow={16} codes={M.data.codes} cell={15} gap={3} />
            <div style={{ height: 22, borderTop: "1px solid " + C.panelLine }} />
            <TokenRun count={16} groups={1} tokenW={48} h={46} />
          </Card>
        </div>
        <Foot>九十六对十六。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>代价，<br />差三十六倍。</Body>
          <Body style={{ marginTop: 26 }}>
            注意力是 token 对 token，复杂度是 token 数的平方再乘维度。九十六平方乘三十二，二十九万四千九百一十二；十六平方乘三十二，八千一百九十二。比值正好三十六，等于通道数的平方。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="CI 代价" v="294,912" color={C.cyan} />
            <KV k="CM 代价" v="8,192" color={C.amber} />
            <KV k="比值" v="36" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一次前向的注意力代价（T² · d，d = 32）" accent={C.coral}>
            <Bars
              items={[
                { label: "CI · 96", value: M.tokens.costCi, text: fmtInt(M.tokens.costCi), color: C.cyan },
                { label: "Hybrid 2 · 32", value: M.tokens.costHybrid, text: fmtInt(M.tokens.costHybrid), color: C.violet },
                { label: "CM · 16", value: M.tokens.costCm, text: fmtInt(M.tokens.costCm), color: C.amber },
              ]}
              width={1000} rowH={78} at={0}
            />
            <div style={{ marginTop: 10, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>比值 36 = 6²；Hybrid 2 比独立省 9 倍，比混合多一倍位置。</div>
          </Card>
        </div>
        <Foot>token 少六倍，代价少三十六倍。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三件事，<br />一条判据。</Body>
          <Body style={{ marginTop: 26 }}>
            这一集只算三件事：相关矩阵、特征值、有效秩。再用两个阈值做决策。三种策略都实现，二十四项检查，二十九条单测。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="检查" v="24" color={C.cyan} />
            <KV k="单测" v="29" color={C.violet} />
            <KV k="结论" v="Hybrid 2" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="这一集的四段路线" accent={C.amber}>
            <Row name="01 相关" value="6×6 矩阵" note="标准化后两两皮尔逊，取绝对值" width={1000} color={C.cyan} />
            <Row name="02 谱" value="6 个特征值" note="Jacobi 旋转，降序排列" width={1000} color={C.violet} />
            <Row name="03 秩" value="2.4714" note="(Σλ)² / Σλ²，能量集中的方向数" width={1000} color={C.amber} />
            <Row name="04 决策" value="Hybrid 2" note="mean|ρ| 0.5109 卡在中间，组数取 2" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>24 项全过</Chip>
            <Chip color={C.violet}>29 单测</Chip>
            <Chip color={C.amber}>不到一秒</Chip>
          </div>
        </div>
        <Foot>先看问题有多大。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
