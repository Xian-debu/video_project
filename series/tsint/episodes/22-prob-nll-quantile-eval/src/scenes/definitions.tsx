import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, KV, M, PAD, Pages, Row, Stat, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="三种输出，三种口径" goal="似然 · 分位数 · 汇总分数" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="同一个问题，三种答法" accent={C.cyan} style={{ height: 330 }}>
        <Row name="点预测" value="给一个数 ŷ" />
        <Row name="概率预测" value="给一个分布 p(y|x)" color={C.cyan} />
        <Row name="分位数预测" value="给 τ 个分位数 q_τ" color={C.amber} />
        <K style={{ display: "block", marginTop: 10 }}>本集三种都实现，重点是它们各自的“错误价格”不同。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="密度可以大于 1" accent={C.coral} style={{ height: 362 }}>
        <Row name="高斯峰值" value="1 / (σ√2π)" />
        <Row name="σ = 1" value="0.3989" />
        <Row name="σ = 0.01" value="39.89" color={C.coral} />
        <K style={{ display: "block", marginTop: 8 }}>密度不是概率，可以超过一；取对数就可能是负数。</K>
        <Stat label="真实收益 NLL" value={M.real.nll.toFixed(4)} accent={C.coral} style={{ marginTop: 6 }} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.lead} color={C.ink}>先把定义钉住，再看数字。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="高斯负对数似然" goal="式 3.30 加一项常数" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="完整形式" accent={C.cyan} style={{ height: 340 }}>
        <Formula size={32} note="y ~ N(μ, σ²)；每元素">
          −log p = ½log 2π + log σ + (y−μ)²/(2σ²)
        </Formula>
        <Formula size={30} note="书版式 3.30 省略了这两处">
          L_book = ½[log σ² + (y−μ)²/σ²]
        </Formula>
        <K style={{ display: "block", marginTop: 6 }}>等价写法：½log σ² 就是 log σ；残差项系数是 1/2。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="手算 μ=1, σ=2, y=3" accent={C.amber} style={{ height: 340 }}>
        <Row name="书版" value={M.nll.book.toFixed(10)} color={C.amber} />
        <Row name="标准版" value={M.nll.std.toFixed(10)} color={C.cyan} />
        <Row name="差值" value={M.nll.gap.toFixed(10)} color={C.coral} />
        <Row name="½log 2π" value={(0.5 * Math.log(2 * Math.PI)).toFixed(10)} />
        <K style={{ display: "block", marginTop: 8 }}>差值只由常数决定，换任何 μ、σ、y 都不变。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>梯度两边完全一样；差别只在“报出来的数”，所以必须写明用的是哪一版。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="pinball：分位数损失" goal="低估与高估价格不同" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="定义" accent={C.amber} style={{ height: 330 }}>
        <Formula size={34} note="写成分段形式；e = y − q">
          L_τ = τe if e ≥ 0 else (τ−1)e
        </Formula>
        <K style={{ display: "block", marginTop: 6 }}>τ 大 → 更怕低估；τ 小 → 更怕高估。</K>
        <Row name="τ = 0.9 · 低估 1" value={"罚 " + (0.9).toFixed(1)} color={C.amber} />
        <Row name="τ = 0.9 · 高估 1" value={"罚 " + (0.1).toFixed(1)} color={C.cyan} />
        <Row name="τ = 0.5" value="两边都 0.5 → ½|e|" color={C.violet} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="三个 τ 的价格表" accent={C.cyan} style={{ height: 330 }}>
        <KV k="τ = 0.1" v="低估 0.2 · 高估 1.8" size={FT.body} />
        <KV k="τ = 0.5" v="低估 0.5 · 高估 0.5" color={C.violet} size={FT.body} />
        <KV k="τ = 0.9" v="低估 1.8 · 高估 0.2" color={C.amber} size={FT.body} />
        <K style={{ display: "block", marginTop: 10 }}>
          τ 与 1−τ 互为镜像：分位数 0.9 的损失，正好是 0.1 的翻转。
        </K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>这条不对称是分位数的全部价值：它让“保守”和“激进”有不同的代价。</Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="多分位数与 QL" goal="对 τ 取平均，别丢系数" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="书里式 3.42" accent={C.violet} style={{ height: 330 }}>
        <Formula size={32} note="对 τ 集合与样本取平均">
          QL = (1/|T|) Σ_τ (1/n) Σ_i L_τ(y_i, q_τ,i)
        </Formula>
        <Row name="τ 集合" value={M.meta.taus.join(" / ")} />
        <Row name="τ = 0.5 时" value="QL = ½ · MAE（书版）" color={C.cyan} />
        <Row name="想和 MAE 比" value="乘 2" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="本仓提供两套" accent={C.cyan} style={{ height: 330 }}>
        <Row name="书版 QL（τ=.5）" value={M.eval.book05.toFixed(2)} color={C.violet} />
        <Row name="×2 版 QL（τ=.5）" value={M.eval.x205.toFixed(2)} color={C.cyan} />
        <Row name="混合 τ 集合 · 书版" value={M.eval.mixBook.toFixed(2)} />
        <Row name="混合 τ 集合 · ×2" value={M.eval.mixScaled.toFixed(2)} color={C.amber} />
        <K style={{ display: "block", marginTop: 8 }}>证据同时报出两套，跨论文比较前先看对方用哪套。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        定义到齐：NLL 管分布，pinball 管单个分位数，QL 把多个分位数合成一个分数。
      </Body>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, pageAt("definitions", 12), pageAt("definitions", 24), pageAt("definitions", 36)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
