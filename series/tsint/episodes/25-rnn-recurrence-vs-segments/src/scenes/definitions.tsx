import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, Formula, Chip } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 5), pageAt("definitions", 12), pageAt("definitions", 19), pageAt("definitions", 25)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1280 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.cyan }}>式 3.12 · 一步循环</div>
            <Formula size={78} style={{ marginTop: 22 }}>h_t = g( W·z_t + U·h_{"{t-1}"} + b )</Formula>
            <Body style={{ marginTop: 26, maxWidth: 1180 }} size={FT.body}>
              第 l 层的输入 z_t 是上一层的输出；本集 g 取 tanh。把这一步按时间重复，就是循环网络。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 360, width: 536, display: "flex", flexDirection: "column", gap: 22 }}>
            <Card label="输入项" accent={C.cyan} style={{ width: 536, height: 160 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>W · z_t</div>
              <Mono size={FT.micro} color={C.inkFaint}>这一步看到什么</Mono>
            </Card>
            <Card label="循环项" accent={C.amber} style={{ width: 536, height: 160 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>U · h_{"{t-1}"}</div>
              <Mono size={FT.micro} color={C.inkFaint}>上一步记住什么</Mono>
            </Card>
            <Card label="偏置" accent={C.violet} style={{ width: 536, height: 160 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>b</div>
              <Mono size={FT.micro} color={C.inkFaint}>不随输入变化的底</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1060 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.cyan }}>式 3.13 · 输出头</div>
            <Formula size={78} style={{ marginTop: 20 }}>x̂_t = Head( h_t )</Formula>
            <Body style={{ marginTop: 20, maxWidth: 1000 }} size={FT.body}>预测不是隐藏状态本身，而是它再过一个线性头。本集预测的是下一步收益。</Body>
            <div style={{ marginTop: 40 }}>
              <Row name="隐藏维 d_h" value="32" note="单层，tanh" width={1000} />
              <Row name="截断 BPTT" value="48 步" note="只反传最近 48 步，边界处梯度清零" width={1000} />
              <Row name="梯度裁剪" value="1.0" note="按全局范数裁剪" width={1000} />
              <Row name="学习率 / 批次" value="1e-3 / 16" note="Adam，b1 0.9，b2 0.999" width={1000} />
              <Row name="训练轮数" value="25" note="种子 25，确定性重放" width={1000} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 360, width: 596 }}>
            <Card label="两节点金例" accent={C.cyan} style={{ width: 596, height: 520 }}>
              <Mono size={FT.meta} color={C.inkFaint}>输入 x = [1, 1]，W = U = 1，b = 0，g 取恒等</Mono>
              <Formula size={40} style={{ marginTop: 22 }}>h_1 = 1·1 + 1·0 + 0 = 1</Formula>
              <Formula size={40} style={{ marginTop: 10 }}>h_2 = 1·1 + 1·1 + 0 = 2</Formula>
              <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
                <Chip color={C.cyan}>h1 = 1</Chip>
                <Chip color={C.amber}>h2 = 2</Chip>
              </div>
              <Body size={FT.meta} style={{ marginTop: 18 }}>精确等于 2，不是约等于。四项证据里专门有一条判这个数。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1240 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, letterSpacing: FT_T.meta, color: C.amber }}>分段网络 · 块嵌入 + 并行生成</div>
            <Formula size={64} style={{ marginTop: 18 }}>h_i = RNN( x_{"{is+1}"} … x_{"(i+1)s"} )</Formula>
            <Formula size={64} style={{ marginTop: 12 }}>m = ⌈ H / s ⌉ = ⌈ 96 / 8 ⌉ = 12</Formula>
            <Body style={{ marginTop: 22, maxWidth: 1160 }} size={FT.body}>
              每段 s = 8 步，用一个循环单元读成一个向量；生成时把 24 步切成 3 块，每块一次出 8 步。
            </Body>
            <div style={{ marginTop: 26, display: "flex", gap: 10 }}>
              {Array.from({ length: M.meta.window.blocks }).map((_, i) => (
                <div key={i} style={{ width: 90, height: 56, background: C.bgSoft, border: "1px solid " + C.panelLine, borderTop: "3px solid " + C.amber, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>seg {i + 1}</div>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", left: 1370, top: 360, width: 406 }}>
            <Stat label="段数" value="12" sub="96 步 / 8" accent={C.amber} style={{ width: 406, height: 170 }} />
            <Stat label="生成块" value="3" sub="24 步 / 8" accent={C.amber} style={{ width: 406, height: 170, marginTop: 20 }} />
            <Stat label="总调用" value="15" sub="12 编码 + 3 生成" accent={C.violet} style={{ width: 406, height: 170, marginTop: 20 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 860 }}>
            <Card label="逐点递归 · 参数量 1,121" accent={C.cyan} style={{ width: 860, height: 560 }}>
              <Row name="输入 W" value="h · d = 32 · 1 = 32" width={800} />
              <Row name="循环 U" value="h · h = 32 · 32 = 1,024" width={800} />
              <Row name="偏置 b" value="h = 32" width={800} />
              <Row name="输出头" value="o · h + o = 33" width={800} />
              <div style={{ height: 1, background: C.panelLine, margin: "18px 0" }} />
              <Row name="合计" value="1,121" color={C.cyan} note="手算与代码一致" width={800} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 960, top: 330, width: 816 }}>
            <Card label="分段 · 参数量 1,832" accent={C.amber} style={{ width: 816, height: 560 }}>
              <Row name="编码器" value="H · s = 256" width={760} />
              <Row name="生成器" value="H · s = 256" width={760} />
              <Row name="循环 U" value="H · H = 1,024" width={760} />
              <Row name="偏置 / 头" value="32 + 256 + 8 = 296" width={760} />
              <Row name="合计" value="1,832" color={C.amber} note="比递归多 711 个" width={760} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
