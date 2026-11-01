import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, Stat,
  Formula, CodeBlock, K, fmtInt,
} from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：USAD 两阶段 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              两个解码器，两种姿态。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              USAD 训练分两段。前二十轮只优化重建误差，把两个解码器都教会重建正常窗口；之后每轮交替走两个损失：
              第一步让两个解码器都学得好，第二步让第二个解码器学会「重建第一个解码器的输出」，逼出差异。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Formula size={32} color={C.cyan}>
                L1 = (1/n)·||x − AE1(x)||<sup>2</sup> + (1 − 1/n)·||x − AE2(x)||<sup>2</sup>
              </Formula>
              <Formula size={32} color={C.cyan} style={{ marginTop: 14 }}>
                L2 = (1/n)·||x − AE2(x)||<sup>2</sup> − (1 − 1/n)·||x − AE2(AE1(x))||<sup>2</sup>
              </Formula>
            </div>
            <Body style={{ marginTop: 20, width: 860, color: C.inkDim }}>
              n 是当前轮次：第一轮 n = 1，L1 几乎只看第一个解码器；轮次越大，第二个解码器的话语权越重。这个「n」是 USAD 自己的写法，容易误读成样本数。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="训练安排" accent={C.cyan} pad={26}>
              <Row name="暖启动" value="20 轮" note="只走 L1，把两个解码器都压到低重建误差" />
              <Row name="对抗阶段" value="20 轮" note="每轮 L1、L2 交替，α = 1/3，β = 2/3" />
              <Row name="分数" value="s = α·s1 + β·s2" note="s1、s2 是两路重建误差，α、β 固定不学" color={C.cyan} />
              <Row name="参数量" value={fmtInt(md("usad").params)} note="d = 8 的瓶颈层，两个解码器" />
            </Card>
            <Card label="为什么对抗会抖" accent={C.amber} pad={26} style={{ marginTop: 18 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                两个解码器共享编码器：一个想重建得更准，一个想重建「另一个的输出」。目标相反，同一组参数被两边拉扯，
                L2 没有下界，训练曲线会翘起来。这是方法本身的性质，不是实现 bug。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三套超参数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              三张表，全部写死。
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1730, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
            <Card label="USAD" accent={C.cyan} pad={24}>
              <Row name="瓶颈" value="d = 8" note="压缩到八个维度" />
              <Row name="轮次" value="20 + 20" note="暖启动 + 对抗" />
              <Row name="学习率" value="0.01" note="逐窗 SGD，梯度裁剪 1.0" />
              <Row name="α / β" value="1/3 · 2/3" note="分数加权" />
              <Row name="参数" value={fmtInt(md("usad").params)} note="编码器 + 两个解码器" color={C.cyan} />
            </Card>
            <Card label="DAGMM" accent={C.violet} pad={24}>
              <Row name="潜变量" value="1 维" note="压到一个数，再增广" />
              <Row name="混合成分" value="K = 4" note="高斯混合，EM 二十轮" />
              <Row name="λ1 / λ2" value="0.1 · 0.005" note="重建项 · 协方差正则" />
              <Row name="轮次" value="8" note="每轮后重估 GMM" />
              <Row name="参数" value={fmtInt(md("dagmm").params)} note="AE + 四个成分" color={C.violet} />
            </Card>
            <Card label="多 AE 集成" accent={C.amber} pad={24}>
              <Row name="成员" value="M = 5" note="种子 7001 起，步长 911" />
              <Row name="瓶颈" value="d = 16" note="每个成员同构" />
              <Row name="轮次" value="10" note="与单 AE 基线同设置" />
              <Row name="聚合" value="中位数" note="逐窗取五个分数的中位数" />
              <Row name="参数" value={fmtInt(md("ens").params)} note="单个成员；五个共 16,580" color={C.amber} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 900, width: 1730 }}>
            <Row name="基线" value="单 AE" note={"同瓶颈 d = 16、同十轮，参数 " + fmtInt(md("ae").params) + "；用来回答「集成到底有没有用」。"} />
          </div>
        </AbsoluteFill>

        {/* 页三：DAGMM 的能量 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              能量 = 负对数似然。
            </div>
            <Body style={{ marginTop: 22, width: 840 }}>
              潜变量只有一维，DAGMM 把它和两个重建统计量拼起来：相对欧氏距离、余弦相似度。三维向量送进四个高斯成分的混合，
              算这一点的负对数似然，就是异常分数。
            </Body>
            <Formula size={34} color={C.violet} style={{ marginTop: 24 }}>
              z = [ z<sub>c</sub> ; (||x − x̂|| / ||x||) ; cos(x, x̂) ]
            </Formula>
            <Formula size={34} color={C.violet} style={{ marginTop: 14 }}>
              E(z) = −log Σ<sub>k=1..4</sub> π<sub>k</sub> N(z | μ<sub>k</sub>, Σ<sub>k</sub>)
            </Formula>
            <Body style={{ marginTop: 20, width: 840, color: C.inkDim }}>
              分母里的两个范数都夹了下界，防止零向量把整条链变成 NaN。协方差矩阵用 Cholesky 分解，加抖动兜底。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 990, top: 282, width: 870 }}>
            <CodeBlock
              title="dagmmEnergy（纯函数）"
              width={830}
              lines={[
                { t: "augOf cfg dae x = z ++ [relDist, cosine]" },
                { t: "  where z = encodeDAE dae x" },
                { t: "        rel = ||x - x̂|| / max 1e-12 ||x||", dim: true },
                { t: "        cos = dot x x̂ / (||x||·||x̂||)", dim: true },
                { t: "gmmEnergyZ gmm z = -logSumExp [ log πk + logN ]", hi: true },
                { t: "  -- Σ 走 cholFactor 0 → 1e-6 → 单位阵", dim: true },
                { t: "energy = gmmEnergyZ gmm (augOf ...)", hi: true },
              ]}
            />
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              训练时 GMM 用 EM 重估，每轮一次；推理时参数全冻结。
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：中位数聚合 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              五个成员，取中间那个。
            </div>
            <Body style={{ marginTop: 22, width: 840 }}>
              五个 AE 结构一样、初始化不同，各自给一个重建误差。按大小排序，取正中间的值当分数。均值会被一个坏成员拉走，中位数不会。
            </Body>
            <Formula size={36} color={C.amber} style={{ marginTop: 26 }}>
              s(x) = sort(s<sub>1</sub> … s<sub>5</sub>)[2]
            </Formula>
            <Body style={{ marginTop: 20, width: 840, color: C.inkDim }}>
              偶数个成员没有正中项，取中间两个的平均，同时打一条警告。这条规则写进代码，也写进检查表；不然五变四的时候，聚合口径悄悄变了没人知道。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
              <Chip color={C.amber}>奇数：取正中</Chip>
              <Chip color={C.coral}>偶数：平均 + 警告</Chip>
              <Chip color={C.cyan}>M = 1：退化为单 AE</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 990, top: 282, width: 870 }}>
            <Card label="检查表里钉住的三条" accent={C.cyan} pad={26}>
              <Row name="中位数 ≠ 均值" value="[1, 2, 100]" note="中位数 2，均值 34.33；差一个数量级" />
              <Row name="对无穷稳健" value="M ≥ 3" note="一个成员爆炸，中位数仍是正常成员的值" />
              <Row name="M = 1 退化" value="逐位等于单 AE" note="同种子、同轮次，分数误差小于 1e-12" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：四条数值约定 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              四条数值约定，缺一条数就变了。
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 386, width: 1730, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            <Card label="一 · 阈值只在验证段挑" accent={C.coral} pad={24}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                验证段上扫阈值，取 F1 最大的一组。测试段一个点都不参与调参，连提前看一眼都不行。
              </Body>
            </Card>
            <Card label="二 · 四个模型同一套口径" accent={C.cyan} pad={24}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                同样的窗口、同样的真值、同样的阈值规则。读数不同只能来自分数本身，不能来自口径差距。
              </Body>
            </Card>
            <Card label="三 · 协方差必须正定" accent={C.violet} pad={24}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                高斯成分的 Σ 用 Cholesky 分解，奇异时从 1e-6 起加抖动；再不行退回单位阵。绝不让 log 里出现非正数。
              </Body>
            </Card>
            <Card label="四 · 模型里没有随机数" accent={C.amber} pad={24}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                种子只决定注入落在哪；模型初始化用固定序列，同一份数据、同一个种子，逐位可复现。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 850, width: 1730 }}>
            <Body style={{ color: C.inkDim }}>
              四条都不是实现细节，是方法的边界。写不清楚，任何一次读数都不可复现；这一集的五十七项检查，前二十项就是在钉这四条。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
