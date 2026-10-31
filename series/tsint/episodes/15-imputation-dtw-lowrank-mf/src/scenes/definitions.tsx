import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CellGrid, Chip, CodeBlock, CW, Formula, Head, K, KV, M, PAD, Pages, Row, Verdict, fmtF, fmtM } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="DTW：允许时间轴伸缩的对齐" goal="递推式书中未给，本仓补充" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1010 }}>
      <Card label="递推" accent={C.cyan} style={{ height: 330 }}>
        <Formula size={38} color={C.ink}>{"D[i][j] = |x_i − y_j| + min( D[i−1][j], D[i][j−1], D[i−1][j−1] )"}</Formula>
        <div style={{ display: "flex", gap: 40, marginTop: 14 }}>
          <div><K>代价</K><Body size={FT.meta}>两点的绝对差，路径累加</Body></div>
          <div><K>初值</K><Body size={FT.meta}>首行首列除原点外全是无穷大</Body></div>
          <div><K>带宽</K><Body size={FT.meta}>Sakoe-Chiba，|i − j| 超过 w 置无穷</Body></div>
        </div>
      </Card>
      <Card label="两条转移不能省" accent={C.amber} style={{ height: 240, marginTop: 24 }}>
        <Row name="只走 x / 只走 y" value="允许伸缩" note="这就是 DTW 与逐点距离的全部区别" />
        <Row name="不归一化路径长度" value="本仓选择" note="归一化会让长短序列不可比，KNN 只需同批排序" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1050, top: 330, width: CW - 1050 }}>
      <Card label="小例子" accent={C.violet} style={{ height: 330 }}>
        <CodeBlock width={CW - 1098} size={FT.mono} lines={[
          { t: "x = [1, 2, 3]" },
          { t: "y = [1, 3]" },
          { t: "一配一，二配三，三配三", dim: true },
          { t: "0 + 1 + 0  =  1", hi: true },
          { t: "逐点对齐要 4，DTW 只要 1", dim: true },
        ]} />
      </Card>
      <Card label="它不是距离" accent={C.coral} style={{ height: 240, marginTop: 24 }}>
        <Body size={FT.body}>不满足三角不等式：</Body>
        <Formula size={30} color={C.coral} style={{ marginTop: 8 }}>{"4  >  1 + 2"}</Formula>
        <Body size={FT.meta} style={{ marginTop: 10 }}>
          没有度量结构，就不能三角剪枝、不能上 KD-tree。KNN 只能全量两两算。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="KNN：跨序列、同一时刻取值" goal="权重式书中未给，本仓用等权" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 880 }}>
      <Card label={"一个真实例子 · " + M.neighbours.date} accent={C.cyan} style={{ height: 560 }}>
        <Body size={FT.meta}>
          目标列 {M.neighbours.colCode} 在这段停牌，它在 {M.neighbours.date} 的值由 5 个最近邻在同一时刻的值给出。
        </Body>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, borderBottom: "1px solid " + C.panelLine, paddingBottom: 6 }}>
            <div style={{ width: 90 }}>排名</div>
            <div style={{ width: 190 }}>序列</div>
            <div style={{ width: 150 }}>DTW 距离</div>
            <div style={{ width: 130 }}>权重</div>
            <div style={{ width: 150 }}>当日值</div>
          </div>
          {M.neighbours.items.map((it) => (
            <div key={it.rank} style={{ display: "flex", alignItems: "baseline", padding: "7px 0", borderBottom: "1px solid " + C.panelLine }}>
              <div style={{ width: 90, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{it.rank}</div>
              <div style={{ width: 190, fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{it.code}</div>
              <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{it.dist.toFixed(3)}</div>
              <div style={{ width: 130, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{it.w.toFixed(3)}</div>
              <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.meta, color: it.value < 0 ? C.coral : C.cyan }}>{it.value.toFixed(4)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 18 }}>
          <div>
            <K>加权预测</K>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>{M.neighbours.pred.toFixed(4)}</div>
          </div>
          <div>
            <K>真实值</K>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.coral }}>{M.neighbours.truth.toFixed(4)}</div>
          </div>
          <div>
            <K>权重</K>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>1/5 各一</div>
          </div>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 920, top: 330, width: CW - 920 }}>
      <Card label="本仓的选择" accent={C.violet} style={{ height: 260 }}>
        <Body size={FT.body}>
          距离只用来排序，不参与加权：五个邻居各占五分之一。书中未给权重式。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 12 }}>
          其它实现常用 1/(d+ε) 归一。这一集不换权重，免得排序变化被误读成方法的差异。
        </Body>
      </Card>
      <Card label="填补方向" accent={C.amber} style={{ height: 260, marginTop: 24 }}>
        <Body size={FT.body}>
          第 t 行第 n 列缺失时，用它 k 个最近邻序列在 t 时刻的观测值。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 12 }}>
          跨列、不跨行。邻居在该时刻也缺失就跳过；全缺时回退到该列均值。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="低秩：只在观测格上算残差" goal="交替投影，观测永远保留原值" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <Card label="目标" accent={C.violet} style={{ height: 200 }}>
        <Formula size={40} color={C.ink}>{"min ‖ P_Ω(X − Z) ‖²   s.t.   rank(Z) ≤ k"}</Formula>
      </Card>
      <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
        <Card label="硬截断 · 交替投影" accent={C.violet} style={{ flex: 1, height: 300 }}>
          <Row name="① 观测格" value="保留原值" />
          <Row name="② 缺失格" value="填当前重建值" />
          <Row name="③ 投影" value="截到 rank ≤ k" />
          <Body size={FT.meta} style={{ marginTop: 14 }}>
            反复三轮直到缺失部分相对变化小于容差。本仓 k = 5，300 轮，1e−10。
          </Body>
        </Card>
        <Card label="软阈值 · Soft-Impute" accent={C.amber} style={{ flex: 1, height: 300 }}>
          <Body size={FT.body}>
            换成核范数惩罚：对奇异值做 max(σ − λ, 0) 收缩，迭代是 MM。
          </Body>
          <Body size={FT.meta} style={{ marginTop: 12 }}>
            轨迹记 0.5·SSE + λ·‖Z‖*，单调不增。SSE 恒为零（观测格保留），实际看的是核范数下降。
          </Body>
        </Card>
        <Card label="解不唯一" accent={C.cyan} style={{ flex: 1, height: 300 }}>
          <Body size={FT.body}>
            rank-k 因子只在列空间意义下唯一。测试比较重建矩阵和子空间，不逐位比因子。
          </Body>
          <Body size={FT.meta} style={{ marginTop: 12 }}>
            矩阵分解那边同理：因子能互相乘一个非奇异方阵。
          </Body>
        </Card>
      </div>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="矩阵分解：一处维度勘误" goal="式(2.40) 的乘法顺序，书中不自洽" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 940 }}>
      <Card label="书中写法 · printed p.26" accent={C.coral} style={{ height: 260 }}>
        <Formula size={46} color={C.ink}>{"X  ≈  F · X̂"}</Formula>
        <div style={{ display: "flex", gap: 30, marginTop: 10 }}>
          <K>F ∈ R^(k×N)</K>
          <K>X̂ ∈ R^(T×k)</K>
          <K>X ∈ R^(T×N)</K>
        </div>
        <Body size={FT.meta} style={{ marginTop: 10, color: C.coral }}>
          (k×N)·(T×k) 只有 k = T 时才能乘。一般情形下乘不起来。
        </Body>
      </Card>
      <Card label="本仓实现" accent={C.cyan} style={{ height: 260, marginTop: 24 }}>
        <Formula size={46} color={C.ink}>{"X  ≈  X̂ · F"}</Formula>
        <div style={{ display: "flex", gap: 30, marginTop: 10 }}>
          <K>X̂ ∈ R^(T×k)</K>
          <K>F ∈ R^(k×N)</K>
          <K>→ R^(T×N)</K>
        </div>
        <Body size={FT.meta} style={{ marginTop: 10 }}>
          只改乘法顺序：时间因子在前，变量因子在后。两个因子各自的含义不变。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 980, top: 330, width: CW - 980 }}>
      <Card label="登记为勘误 E29" accent={C.amber} style={{ height: 300 }}>
        <Body size={FT.body}>
          这不是排版问题，是维度不自洽：书里两块矩阵按书写顺序乘不上。
        </Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          照书写，只有把 k 取成 T 才能跑通 —— 那等于放弃降维。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.amber}>E29 · 已核实</Chip></div>
      </Card>
      <Card label="交替最小二乘" accent={C.violet} style={{ height: 300, marginTop: 24 }}>
        <Row name="固定 F" value="解 X̂ 的每一行" note="k×k 正规方程 + 岭项 λI" />
        <Row name="固定 X̂" value="解 F 的每一列" note="同上，逐列独立" />
        <Row name="初始值" value="确定性小量" note="不用随机数，逐位可重跑" />
        <Row name="退化" value="整列全缺 → 因子为 0" note="岭项给出唯一解" color={C.coral} />
      </Card>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, 0.3, 0.58, 0.82]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
