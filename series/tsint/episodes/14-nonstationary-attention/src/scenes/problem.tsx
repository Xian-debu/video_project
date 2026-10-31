import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Chip, CodeBlock, Formula, Head, K, LinePlot, M, Pages, PAD,
} from "../shared";

const P1: React.FC = () => {
  const sig = Array.from({ length: 60 }, (_, t) => Math.sqrt(1 + (9 * t) / 59));
  return (
    <>
      <Head kicker="02 / 问题" title="非平稳是怎么偷渡进注意力的" goal="位置没进模型，位置通过方差进来了" />
      <div style={{ position: "absolute", left: PAD, top: 340, width: 960 }}>
        <CodeBlock
          title="一个方差随时间变大的序列"
          width={960}
          lines={[
            { t: "x_t   = sigma_t * u_t            -- u_t ~ U(-1, 1)" },
            { t: "s_ij  = (x_i · x_j) / sqrt(dk)   -- logits 是内积" },
            { t: "A     = softmax(s)               -- 行内归一" },
            { t: "sigma_t = sqrt(1 + 9t / 59)      -- 方差 1 → 10", dim: true },
          ]}
        />
        <div style={{ marginTop: 26 }}>
          <Body size={FT.lead} color={C.ink}>
            晚段的 token 幅度更大，内积也更大。softmax 不看位置，只看数值大小。
          </Body>
          <Body size={FT.body} style={{ marginTop: 12 }}>
            于是「谁在末尾」这件事，借着方差混进了 logits。模型没学位置，位置自己长大了。
          </Body>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1090, top: 340, width: 730 }}>
        <Card label="尺度示意 · 60 个 token" accent={C.cyan} style={{ height: 470 }}>
          <LinePlot
            series={[
              { values: sig, color: C.coral, name: "+sigma_t" },
              { values: sig.map((v) => -v), color: C.cyan, name: "−sigma_t" },
            ]}
            width={680}
            height={330}
            title="sigma_t 从 1 涨到 3.16（方差 1 → 10）"
            yFmt={(v) => v.toFixed(1)}
            legend
          />
          <K>同一个分布形状，不同时间点的幅度</K>
        </Card>
      </div>
    </>
  );
};

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="式(2.9) 只给了两句话" goal="一条式子，一句「由 MLP 学出」" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <CodeBlock
        title="原文 式(2.9) —— 逐字抄下来"
        width={1120}
        lines={[
          { t: "log_tau = MLP(sigma, X)          -- τ 是正缩放标量" },
          { t: "Delta   = MLP(mu, X)             -- Δ 是偏移向量" },
          { t: "Attn    = Softmax((tau Q Kᵀ + 1 Deltaᵀ) / √dk) V", hi: true },
        ]}
      />
      <div style={{ marginTop: 30 }}>
        <Formula size={46} color={C.inkDim}>{"τ ∈ R⁺，Δ ∈ Rᵀ，二者由 MLP 从 μ、σ 中学习"}</Formula>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1270, top: 340, width: 560 }}>
      <Card label="书里没给的部分" accent={C.coral} style={{ height: 300 }}>
        <Body size={FT.body}>
          没有初始化、没有损失函数、没有训练配方，也没有说 τ 和 Δ 各自改动了什么。
        </Body>
        <Body size={FT.body} color={C.coral} style={{ marginTop: 14 }}>
          这些空白，就是这一集要自己填的地方。
        </Body>
      </Card>
      <Card label="所以这一集不做训练" accent={C.cyan} style={{ marginTop: 20, height: 210 }}>
        <Body size={FT.h2} color={C.ink}>只做前向判决。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
          把 τ、Δ 取到极限，看输出退化成什么。能退化，才说明理解对了。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="三条判决，一条比一条狠" goal="每条都要求逐位相等，或恰为零" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW, display: "flex", gap: 26 }}>
      <Card label="判决一" accent={C.cyan} style={{ flex: 1, height: 320 }}>
        <Formula size={36}>{"τ = 1，Δ = 0"}</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          必须逐位退回 EP9 的标准注意力。不是「差不多」，是 ==。
        </Body>
        <div style={{ marginTop: 14 }}><Chip color={C.cyan}>两条独立代码路径</Chip></div>
      </Card>
      <Card label="判决二" accent={C.violet} style={{ flex: 1, height: 320 }}>
        <Formula size={36}>{"τ = 2"}</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          必须逐位等于温度 0.5 的注意力。τ 若真有新东西，这条会失败。
        </Body>
        <div style={{ marginTop: 14 }}><Chip color={C.violet}>与温度对照</Chip></div>
      </Card>
      <Card label="判决三" accent={C.coral} style={{ flex: 1, height: 320 }}>
        <Formula size={36}>{"Δ 按行加"}</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          对按行加的偏置做有限差分，梯度必须恰为 0.0 —— 不是小，是不可辨识。
        </Body>
        <div style={{ marginTop: 14 }}><Chip color={C.coral}>梯度取证</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三条都不需要训练。需要的是两条独立实现，和一次不许四舍五入的比较。
      </Body>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, 0.4, 0.74]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
