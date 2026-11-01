import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FT } from "../../design/tokens";
import { PAD, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, KV, Body, Formula, Mono } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 12), pageAt("definitions", 22)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：K 均值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 980 }}>
            <Formula size={46} note="Score(x) = 到最近簇心的欧氏距离">
              Score(x) = min_k ‖x − c_k‖₂
            </Formula>
            <Formula size={36} color={C.inkDim} note="簇心 = 簇内样本均值" style={{ marginTop: 26 }}>
              c_k = mean(S_k)
            </Formula>
            <Body size={FT.body} style={{ marginTop: 30, width: 900 }}>
              训练段里没有标签，K 个簇心是迭代出来的：先初始化，再把点分给最近的簇心，再更新簇心，重复一百轮。
              分数是点到最近簇心的距离 —— 不是概率，也不是判据。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
              <KV k="K" v={String(M.params.k)} note="和股票数一样" />
              <KV k="迭代" v={String(M.params.iters) + " 轮"} note="收敛即停" />
              <KV k="种子" v={String(M.params.seed)} note="逐位可复现" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 292, width: 680 }}>
            <Card label="黄金读数" accent={C.cyan}>
              <Row name="两团点云" value="簇心 0 / 10" note="误差 0 ±1e-9" width={630} />
              <Row name="归属不变" value="每点到本簇心最近" note="assignment invariant" width={630} />
              <Row name="K = 1" value="分数 = 到全局均值距离" note="退化情形" width={630} />
              <Row name="确定性" value="两次运行逐位相同" note="k-means++ 也固定种子" width={630} />
            </Card>
            <Card label="小簇怎么办" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                簇小于 3% 的样本要单独标出来 —— 它可能是异常，也可能是 K 选大了。
              </Body>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
                本集读数：小簇 0 个（占比 0.0%）。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：LOF */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 1010 }}>
            <Formula size={34} note="k 距离取第 k 近邻的距离；可达距离至少是 k 距离">
              rd_k(x, o) = max(k-dist(o), d(x, o))
            </Formula>
            <Formula size={34} color={C.inkDim} note="局部可达密度：可达距离均值的倒数" style={{ marginTop: 22 }}>
              lrd_k(x) = 1 / mean_o∈N_k(x) rd_k(x, o)
            </Formula>
            <Formula size={40} color={C.cyan} note="邻居的密度 / 自己的密度" style={{ marginTop: 22 }}>
              LOF(x) = mean_o∈N_k(x) lrd_k(o) / lrd_k(x)
            </Formula>
            <Body size={FT.body} style={{ marginTop: 26, width: 940 }}>
              距离近就密度高。密度用可达距离的倒数表示，相除时量纲消掉，只剩一个比值。
              LOF 大于一，说明自己的局部密度低于邻居 —— 像异常。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1170, top: 286, width: 650 }}>
            <Card label="黄金读数" accent={C.amber}>
              <Row name="k" value={String(M.params.lofK)} note="看十个邻居" width={600} />
              <Row name="五边形五点" value="LOF 1.0000" note="规则图形，密度均匀" width={600} />
              <Row name="远处一点" value="LOF 84.51" note="远到没有邻居" width={600} />
              <Row name="n ≤ k" value="全部 1.0" note="没有邻居，密度比无意义" width={600} />
            </Card>
            <Card label="代价" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                平方复杂度。两万样本就是两亿次距离 —— 实现里拆成每只股票一个转导块。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：孤立森林 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 1010 }}>
            <Formula size={40} note="E[h] 是平均路径长度，c(n) 是归一化因子">
              s(x, n) = 2 ^ (−E[h(x)] / c(n))
            </Formula>
            <Formula size={34} color={C.inkDim} note="H 是精确调和数">
              c(n) = 2H(n−1) − 2(n−1)/n
            </Formula>
            <Body size={FT.body} style={{ marginTop: 28, width: 940 }}>
              随机选一维、随机选切点，把数据切开，直到点单独成组。异常点更容易被早早切开，路径更短。
              平均路径越长，s 越小；s 越接近一，越异常。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
              <KV k="树" v={String(M.params.trees)} note="独立随机" />
              <KV k="采样" v={String(M.params.psi)} note="每棵树抽 ψ 个点" />
              <KV k="深度上限" v="ceil(log2 ψ)" note="8 层" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1170, top: 286, width: 650 }}>
            <Card label="黄金读数" accent={C.violet}>
              <Row name="均匀随机点" value="均分 ≈ 0.5" note="±0.05" width={600} />
              <Row name="明显离群点" value="高于正常均值" note="+0.1 以上" width={600} />
              <Row name="ψ = 1" value="0.5" note="单点无法孤立" width={600} />
              <Row name="确定性" value="固定种子逐位相同" note="100 棵树" width={600} />
            </Card>
            <Card label="符号别写反" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                平均路径越长，分数越低。写反了，异常就全跑到分数低的那一端。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
