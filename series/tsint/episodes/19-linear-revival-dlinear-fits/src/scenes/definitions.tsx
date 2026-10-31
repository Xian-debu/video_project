import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, M, PAD, Pages, Row, Stat, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="共享权重线性：一条矩阵乘法" goal="所有通道共用一套 (W, b)" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1050 }}>
      <Card label="前向" accent={C.cyan} style={{ height: 360 }}>
        <Formula size={52} color={C.ink}>{"ŷ_k = b_k + Σ_j w_(k,j) · x_j"}</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          k = 1..24，j = 1..96。二十四套权重拼成 96×24 的矩阵，再加二十四个偏置。
        </Body>
        <div style={{ display: "flex", gap: 26, marginTop: 18 }}>
          <Chip color={C.cyan}>通道独立</Chip>
          <Chip color={C.cyan}>权重共享</Chip>
          <Chip color={C.inkFaint}>无隐藏层</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1080, top: 350, width: CW - 1080 }}>
      <Stat label="参数量" value={fmtInt(M.meta.params.shared)} accent={C.cyan} style={{ height: 170 }} sub={<span>(H + 1) · F = 97 × 24</span>} />
      <Stat label="表达能力" value="全部线性映射" accent={C.violet} valueSize={FT.h2} style={{ height: 170, marginTop: 18 }} sub={<span>从 R^96 到 R^24，无约束</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        同一套权重，八个股票一起训练。它学得会任意固定线性组合，学不会组合随时间变化。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="DLinear：先拆趋势与季节" goal="移动平均核 k = 25，端点复制填充" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1050 }}>
      <Card label="分解 + 两条支路" accent={C.amber} style={{ height: 380 }}>
        <Formula size={36}>{"t = AvgPool_25(x),   s = x − t"}</Formula>
        <Formula size={36} style={{ marginTop: 18 }}>{"ŷ = W_t t + b_t + W_s s + b_s"}</Formula>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          趋势支路学方向，季节支路学波动；两条支路的输出直接相加。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1080, top: 350, width: CW - 1080 }}>
      <Stat label="参数量" value={fmtInt(M.meta.params.dlinear)} accent={C.amber} style={{ height: 170 }} sub={<span>2 · (H + 1) · F</span>} />
      <Stat label="趋势核" value={M.meta.kernel} accent={C.violet} style={{ height: 170, marginTop: 18 }} sub={<span>只允许奇数；中心对齐</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 770, width: 860 }}>
      <Card label="先拆，再分别乘" accent={C.amber} pad={18}>
        <Row name="趋势" value="移动平均，抹平毛刺" width={820} />
        <Row name="季节" value="原序列减趋势" width={820} />
        <Row name="汇合" value="两条线性输出相加" width={820} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 900, top: 770, width: CW - 900 }}>
      <Body size={FT.body} color={C.inkDim}>
        分解式不在书里，出自 DLinear 原文；教材只有一句「趋势加季节」。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="拆开以后，函数集合没变" goal="4656 个参数，有效维度 2328" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1080 }}>
      <Card label="把两条支路展开" accent={C.coral} style={{ height: 380 }}>
        <Formula size={38} color={C.ink}>{"ŷ = (W_t A + W_s (I − A)) x + (b_t + b_s)"}</Formula>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          A 是移动平均矩阵。t + s = x，两条支路又都是线性的，
          所以合成以后仍然只是一个 96×24 的矩阵。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          让 W_t = W_s = M，输出立刻退化成共享线性。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1110, top: 350, width: CW - 1110 }}>
      <Stat label="扁平参数" value={fmtInt(M.meta.params.dlinear)} accent={C.coral} style={{ height: 170 }} sub={<span>实现里的向量长度</span>} />
      <Stat label="有效维度" value={fmtInt(M.meta.params.shared)} accent={C.cyan} style={{ height: 170, marginTop: 18 }} sub={<span>和共享线性同一个函数集合</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        那百分之三点三从哪来？优化路径：两条支路的梯度不同，Adam 的步长不同，早停位置不同。
      </Body>
      <K color={C.amber} style={{ display: "block", marginTop: 10 }}>这一条会用零误差的退化实验验证</K>
    </div>
  </>
);

const Stage: React.FC<{ title: string; dim: string; color: string; sub?: string }> = ({ title, dim, color, sub }) => (
  <div style={{ width: 286, height: 150, border: "1px solid " + C.panelLine, borderTop: "2px solid " + color, borderRadius: 10, padding: "14px 16px", boxSizing: "border-box", background: C.panel }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{sub}</div>
    <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink, marginTop: 6 }}>{title}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color, marginTop: 6 }}>{dim}</div>
  </div>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="FITS：换到频域再乘" goal="保留 24 个频点，带宽受限" />
    <div style={{ position: "absolute", left: PAD, top: 370, width: CW, display: "flex", alignItems: "center", gap: 18 }}>
      <Stage title="输入" dim="96 个点" color={C.cyan} sub="时域" />
      <Arrow />
      <Stage title="rFFT" dim="48 维实数" color={C.cyan} sub="24 个复频点" />
      <Arrow />
      <Stage title="线性层" dim="48 × 48 + 48" color={C.violet} sub="W · z + b" />
      <Arrow />
      <Stage title="逆变换基" dim="24 × 48" color={C.amber} sub="只取最后 24 行" />
      <Arrow />
      <Stage title="输出" dim="24 步" color={C.amber} sub="预测" />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 590, width: 1080 }}>
      <Card label="公式" accent={C.violet} style={{ height: 230 }}>
        <Formula size={38}>{"u = W z + b,     ŷ = B u"}</Formula>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          z 是前 24 个频点的实部与虚部；B 是逆变换在最后 24 个时刻上的取值。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1110, top: 590, width: CW - 1110 }}>
      <Stat label="参数量" value={fmtInt(M.meta.params.fits)} accent={C.violet} style={{ height: 230 }} sub={<span>4R² + 2R，R = 24</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 850, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        只保留零到二十三个频率，周期短于 4.17 个交易日的波动表达不出来。这是结构性低通，不是初始化技巧。
      </Body>
    </div>
  </>
);

const Arrow: React.FC = () => (
  <div style={{ fontFamily: FONT.mono, fontSize: 28, color: C.inkFaint }}>→</div>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, pageAt("definitions", 10), pageAt("definitions", 22), pageAt("definitions", 32)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
