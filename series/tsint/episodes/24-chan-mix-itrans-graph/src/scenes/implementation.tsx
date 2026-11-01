import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict, Chip, Formula } from "../shared";

const Code: React.FC<{ title: string; lines: string[] }> = ({ title, lines }) => (
  <div style={{ background: "#0A0E13", border: "1px solid " + C.panelLine, borderRadius: 4, padding: "16px 20px" }}>
    <Mono size={FT.micro} color={C.inkFaint}>{title}</Mono>
    {lines.map((l, i) => (
      <div key={i} style={{ fontFamily: FONT.mono, fontSize: FT.meta, lineHeight: 1.6, color: C.inkDim, whiteSpace: "pre" }}>{l}</div>
    ))}
  </div>
);

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 6), pageAt("implementation", 12), pageAt("implementation", 18), pageAt("implementation", 26)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 900 }}>
            <Code title="src/TSInt/Ch03/ChannelMix.hs" lines={[
              "channelMixMlp :: Int -> Int -> Matrix",
              "              -> Matrix Double",
              "channelMixMlp hidden seed x =",
              "  let z1 = sigma (addCol b1 (mmul w1 x))",
              "      z2 = addCol b2 (mmul w2 z1)",
              "  in add x z2      -- 残差",
              "",
              "timeMixMlp :: Int -> Matrix -> Matrix",
              "timeMixMlp hidden x = ...",
            ]} />
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 380, width: CW - 940 }}>
            <Code title="src/TSInt/Ch03/Itransformer.hs" lines={[
              "itransformer :: Cfg -> Matrix -> Matrix",
              "itransformer cfg x =",
              "  let z = embed (transpose x)  -- N 个 token",
              "      a = softmaxRow (q ## k)",
              "      o = mmul a v",
              "  in add z (mmul o wo)",
              "",
              "graphChannel :: Adj -> Matrix -> Matrix",
              "graphChannel adj h = ...",
            ]} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
            <Code title="src/TSInt/Ch03/GraphChannel.hs" lines={[
              "graphChannel adj h w =",
              "  let a'  = add adj (identity (n adj))   -- 自环",
              "      dn  = invSqrtDeg a'                -- D^(-1/2)",
              "      ah  = mmul (mmul dn a') dn",
              "  in sigma (mmul (mmul ah h) w)",
            ]} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1080 }}>
            <Card label="通道混合：两段 MLP，都是残差" accent={C.cyan} style={{ height: 260 }}>
              <Formula size={42}>Z′ = Z + W₂ σ(W₁ Z + b₁) + b₂</Formula>
              <Formula size={42} style={{ marginTop: 12 }}>Z″ = Z′ + σ(Z′ W₃ + b₃) W₄ + b₄</Formula>
            </Card>
            <Card label="两条关键约定" accent={C.amber} style={{ height: 300, marginTop: 24 }}>
              <Row name="残差" value="清零权重 → 恒等" note="不是“大致不变”，是逐元素相等" width={1020} />
              <Row name="置换等变" value="换通道顺序 → 输出同步换" note="权重列 W₁ 与行 W₂、b₂ 一起换" width={1020} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1120, top: 380, width: 600 }}>
            <Stat label="通道混合参数" value="144" sub="N = 8，H = 8：2NH + H + N" accent={C.cyan} style={{ height: 180 }} />
            <Stat label="时间混合参数" value="18,624" sub="T = 96：2TH + H + T" accent={C.coral} style={{ height: 180, marginTop: 20 }} />
            <Stat label="整块参数" value="1,784" sub="两个方向加起来，仍是四位数" accent={C.violet} style={{ height: 180, marginTop: 20 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1000 }}>
            <Card label="三行核心：转置、嵌入、手写注意力" accent={C.amber} style={{ height: 520 }}>
              <Code title="itransformer 的内循环" lines={[
                "let xt = transpose x       -- T×N → N×T",
                "    z  = ln (embed xt)     -- N×D",
                "    q  = mmul z wq",
                "    k  = mmul z wk",
                "    v  = mmul z wv",
                "    a  = softmaxRow (scale (q ## k))",
                "    o  = mmul (mmul a v) wo",
                "in add z o",
              ]} />
              <Body size={FT.label} style={{ marginTop: 16 }}>
                不用通用注意力层，手写 8×8 的 softmax：形状固定，调试成本低。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 380, width: 680 }}>
            <Stat label="复杂度" value="O(N² + NH)" sub="时间长度只在嵌入里出现" accent={C.amber} style={{ height: 180 }} />
            <Stat label="参数" value="53,248" sub="D = 32，d_ff = 3D" accent={C.violet} style={{ height: 180, marginTop: 20 }} />
            <Stat label="与线性层差" value="1e-13" sub="手写注意力 vs 展开的矩阵乘" accent={C.cyan} style={{ height: 180, marginTop: 20 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1120 }}>
            <Card label="图通道：归一化后的三行" accent={C.violet} style={{ height: 300 }}>
              <Code title="graphChannel 的归一化" lines={[
                "a' = add a (identity n)   -- 每个节点有自环",
                "dn = invSqrtDeg a'        -- D^(-1/2)",
                "ah = mmul (mmul dn a') dn -- 行和 = 1",
              ]} />
            </Card>
            <Card label="三条断言锁住实现" accent={C.cyan} style={{ height: 300, marginTop: 24 }}>
              <Row name="两节点金例" value="每行 0.5 / 0.5" note="h = 1 时输出精确为 1，可手算" width={1060} />
              <Row name="孤立节点" value="只剩自环" note="归一化后自环权重为 1，不丢自己" width={1060} />
              <Row name="稀疏性" value="边数 ≤ 2kN" note="kNN 对称化后每条边最多出现两次" width={1060} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 380, width: 560 }}>
            <Stat label="k = 2 的边数" value="29" sub="二十只票，稀疏度 14.5%" accent={C.violet} style={{ height: 210 }} />
            <Stat label="连通分量" value="3" sub="比行业数少一个，桥来自券商" accent={C.cyan} style={{ height: 210, marginTop: 24 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1120 }}>
            <Card label="两个真实的坑" accent={C.coral} style={{ height: 420 }}>
              <Row name="mwTb2 大小" value="必须是 T，不是 hidden" note="写反 → index out of bounds (3,3)" width={1060} />
              <Row name="initIt 参数序" value="(t, n, d, heads)" note="顺序错 → 形状对但语义错，测试才抓得住" width={1060} />
              <Row name="unsafeSlice" value="禁用" note="一次越界直接把 GHC 进程打成 segfault" width={1060} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 380, width: 560 }}>
            <Stat label="证据程序耗时" value="0.30 s" sub="四十四项检查全部读完真实面板" accent={C.cyan} style={{ height: 200 }} />
            <Stat label="测试" value="85 / 1,133" sub="套件 / 断言，零失败" accent={C.amber} style={{ height: 200, marginTop: 24 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 860, width: CW }}>
            <Body size={FT.label}>
              三个模块都是纯函数：输入矩阵、输出矩阵，没有隐藏状态。所以能一行一次断言。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
