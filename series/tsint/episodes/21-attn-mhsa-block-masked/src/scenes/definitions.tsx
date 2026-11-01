import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, HeatMatrix, K, KV, M, PAD, Pages, Row, Stat, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="从窗口到 Z，再到 Q/K/V" goal="形状链的第一步" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="输入与嵌入" accent={C.cyan} style={{ height: 330 }}>
        <Row name="窗口" value="96 个交易日 × 8 条序列" />
        <Row name="列内 z 分数" value="均值 0，总体标准差 1" />
        <Row name="线性嵌入" value="8 → 64" />
        <Row name="Z 的形状" value="96 × 64" color={C.cyan} />
        <K style={{ display: "block", marginTop: 12 }}>嵌入用固定种子 uniform(±√(3/8))；只为可复跑，不代表最优。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="三个投影" accent={C.violet} style={{ height: 330 }}>
        <Formula size={44} note="三个权重矩阵都是 64 × 64，偏置本仓省略">
          Q = Z W_q · K = Z W_k · V = Z W_v
        </Formula>
        <div style={{ marginTop: 16, display: "flex", gap: 18 }}>
          <KV k="头数 h" v={String(M.meta.config.heads)} color={C.cyan} />
          <KV k="每头 d_k" v={String(M.meta.config.dk)} color={C.amber} />
          <KV k="d_model" v={String(M.meta.config.dModel)} color={C.violet} />
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>四乘十六，正好六十四：每个头分到一段独立子空间。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="打分、缩放、softmax、拼接" goal="式 3.19 的实际展开" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1080 }}>
      <Card label="一个头" accent={C.cyan} style={{ height: 320 }}>
        <Formula size={40} note="A 是 96 × 96；每一行是一个 query 对所有 key 的权重">
          A = softmax(Q Kᵀ / √d_k) · head = A V
        </Formula>
        <Row name="打分矩阵" value="96 × 96" />
        <Row name="行和" value="1（softmax 定义）" color={C.cyan} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1120, top: 340, width: CW - 1120 }}>
      <Card label="多头拼接" accent={C.amber} style={{ height: 320 }}>
        <Body size={FT.body} color={C.ink}>四个头各得 96 × 16。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 8 }}>按时间步交错拼回 96 × 64。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 8 }}>再乘 W_o，输出 96 × 64。</Body>
        <K style={{ display: "block", marginTop: 12 }}>拼接顺序是本仓约定，书里没写</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Card label="注意" accent={C.coral} pad={18}>
        <Body size={FT.body} color={C.ink}>
          本仓把四个头的 Q、K、V 合成一个 64 × 64 的大矩阵再切片，数学上等价，参数计数更清楚。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="块：两次归一化，两次残差" goal="注意力只是块的一半" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="Transformer 块（前向顺序）" accent={C.violet} style={{ height: 340 }}>
        <Row name="① 层归一化" value="LN(Z)，eps = 1e-5" />
        <Row name="② 多头自注意力" value="MHSA(·)" color={C.cyan} />
        <Row name="③ 残差相加" value="Z + MHSA(LN(Z))" color={C.amber} />
        <Row name="④ 再归一化" value="LN(·)，eps = 1e-5" />
        <Row name="⑤ 前馈" value="64 → 256 → GELU → 64" />
        <Row name="⑥ 再残差" value="+ FFN(·)" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Card label="参数账" accent={C.cyan} style={{ height: 340 }}>
        <KV k="注意力（Q/K/V/O 各 64×64）" v={fmtInt(M.meta.params.mhsa)} color={C.cyan} size={FT.h2} />
        <KV k="前馈 + 两个 LN（含偏置）" v={fmtInt(M.meta.params.blockMatrix)} color={C.amber} size={FT.h2} />
        <KV k="合计" v={fmtInt(M.meta.params.blockTotal)} color={C.violet} size={FT.h2} />
        <K style={{ display: "block", marginTop: 10 }}>和证据程序的断言逐项对齐</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        残差的作用：把「学到的修正」叠加到原表示上，深度增加时信息不会逐层衰减。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="因果掩码：上三角是未来" goal="第 i 个位置只能看 0…i" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 640 }}>
      <HeatMatrix values={M.heads.heatmaps[0].values} size={560} mask title="head0（96 日窗口，步长 2 抽样）" note="灰色 = 被掩掉的未来；彩色 = 允许的过去与现在" />
    </div>
    <div style={{ position: "absolute", left: PAD + 640, top: 340, width: CW - 640 }}>
      <Card label="掩码规则" accent={C.coral} style={{ height: 330 }}>
        <Formula size={40} note="M 是 96×96：上三角为 −∞，其余为 0">
          A = softmax((Q Kᵀ / √d_k) + M)
        </Formula>
        <Row name="严格上三角权重和" value={String(M.mask.strictUpperSum)} color={C.cyan} />
        <Row name="首 token" value="只 attend 自己" color={C.amber} />
        <Row name="前 3 行输出是否变化" value={"不变（" + M.mask.rowsUnchanged + " 行）"} color={C.cyan} />
      </Card>
      <div style={{ marginTop: 18 }}>
        <Chip color={C.coral}>注意：置零 ≠ 掩码。exp(0)=1，仍会分到权重。</Chip>
      </div>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, pageAt("definitions", 9), pageAt("definitions", 23), pageAt("definitions", 30)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
