import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Formula, Head, K, KV, M, PAD, Pages, Row } from "../shared";

const Cell: React.FC<{ w: number; h: number; state: 0 | 1 | 2; accent?: string }> = ({ w, h, state, accent = C.cyan }) => (
  <div style={{
    width: w, height: h,
    border: "1px solid " + C.panelLine, marginRight: -1, marginTop: -1,
    background: state === 2 ? "rgba(255,107,107,0.16)" : state === 1 ? "rgba(94,234,212,0.14)" : C.panel,
  }} />
);

const MiniMask: React.FC<{ cols: number; rows: number; kind: "scatter" | "block"; cw?: number; ch?: number }> = ({ cols, rows, kind, cw = 26, ch = 18 }) => {
  const holes = new Set<string>();
  if (kind === "scatter") {
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      if ((i * 7 + j * 13) % 5 === 0) holes.add(i + "-" + j);
    }
  } else {
    for (let j of [3, 8]) for (let i = 0; i < rows; i++) holes.add(i + "-" + j);
  }
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex" }}>
          {Array.from({ length: cols }).map((__, j) => (
            <Cell key={j} w={cw} h={ch} state={holes.has(i + "-" + j) ? 2 : 0} />
          ))}
        </div>
      ))}
    </div>
  );
};

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="缺法有两种，性质完全不同" goal="随机挖格子，还是整列消失" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 26 }}>
      <Card label="随机缺失 · 散点" accent={C.violet} style={{ flex: 1, height: 430 }}>
        <MiniMask cols={22} rows={12} kind="scatter" cw={28} ch={22} />
        <Body size={FT.body} style={{ marginTop: 18 }}>
          数据商漏传、字段偶尔为空。空和值本身无关，每一列都还剩大量观测。
        </Body>
      </Card>
      <Card label="整段缺失 · 整列" accent={C.coral} style={{ flex: 1, height: 430 }}>
        <MiniMask cols={22} rows={12} kind="block" cw={28} ch={22} />
        <Body size={FT.body} style={{ marginTop: 18 }}>
          停牌 = 没有行，不是 NaN。这一列在窗口内一个观测都不剩，而且停牌的公司往往正是出事的那批。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        两种空，同一张表，同一种方法未必都管用。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="目标函数只算观测格" goal="没有观测的那一列，方程里没有它" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="低秩补全的目标" accent={C.violet} style={{ height: 300 }}>
        <Formula size={44} color={C.ink}>{"min ‖ P_Ω(X − Z) ‖²  s.t.  rank(Z) ≤ k"}</Formula>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          Ω 是观测到的格子。缺失格不参与残差 —— 它们不是已知点。先把缺失当 0 塞进残差，等于把整张表的幅度压小。
        </Body>
      </Card>
      <Card label="如果一列整段缺失" accent={C.coral} style={{ height: 300, marginTop: 24 }}>
        <Row name="Ω 里这一列的观测数" value="0" note="目标函数里没有它" color={C.coral} />
        <Row name="初值（列均值）" value="0" note="没有观测，均值就是 0" />
        <Row name="迭代后的值" value="0" note="L = X Q Qᵀ，X 的这列本身是 0" color={C.coral} />
        <Body size={FT.meta} style={{ marginTop: 14 }}>
          这不是实现 bug，是模型性质：列没有进入方程，就没有任何东西推它离开 0。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Card label="记住这一条" accent={C.amber} style={{ height: 300 }}>
        <Body size={FT.body}>
          后面所有关于「低秩补出来是 0」的数字，都能从这一页推出来。
        </Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          也正因如此，块状缺失下低秩的 RMSE 会和真实值的均方根一模一样 —— 它在预测零。
        </Body>
        <div style={{ marginTop: 18 }}><Chip color={C.amber}>模型性质，不是 bug</Chip></div>
      </Card>
      <Card label="最近邻在这里的对偶" accent={C.cyan} style={{ height: 300, marginTop: 24 }}>
        <Body size={FT.body}>
          最近邻不需要这一列自己的观测。它用同一时刻别的列的值，跨序列取值。
        </Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          一列全缺，KNN 反而没受影响 —— 这是它唯一的优势，也正好是这一集最值钱的一段。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="书里给了什么，没给什么" goal="都在这两页里，别的没有" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Card label="书中原文" accent={C.cyan} style={{ height: 250 }}>
        <Row name="printed p.16–18 · 2.2.1" value="一句文字列举：KNN[29]、DTW[30]"
          note="「计算序列间距离度量，找 k 个最相似序列」" />
        <Row name="printed p.23–26 · 2.2.4" value="式(2.40)：X ≈ F · X̂，附文献[28]"
          note="「多变量 SVD / NMF 的低秩近似可用于补全」" />
        <Row name="共同点" value="没有公式细节" note="没有超参，没有目标函数，没有迭代式" color={C.coral} />
      </Card>
      <Card label="这一集要自己填的空白" accent={C.amber} style={{ height: 320, marginTop: 26 }}>
        <div style={{ display: "flex", gap: 60 }}>
          <div style={{ flex: 1 }}>
            <KV k="DTW 递推式" v="三条转移 + 带宽" />
            <KV k="KNN 权重" v="等权，距离只排序" />
            <KV k="邻居数与带宽" v="k = 5，w = ⌈T/10⌉" />
          </div>
          <div style={{ flex: 1 }}>
            <KV k="低秩目标函数" v="只在 Ω 上算残差" />
            <KV k="迭代与容差" v="300 轮，1e−10" />
            <KV k="矩阵分解解法" v="交替最小二乘 + 岭项" />
          </div>
        </div>
        <Body size={FT.meta} style={{ marginTop: 16, color: C.inkFaint }}>
          每一条都登记在自授条目 A32 里，画面逐条标注「书中未给」。
        </Body>
      </Card>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, 0.54, 0.75]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);