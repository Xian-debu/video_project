import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, Card, CodeBlock, CW, Formula, Head, K, KV, M, Pages, PAD, Row, ShardStrip,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="三个式子，三份统计量" goal="来源、范围、参数" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
      <Card label="RevIN" accent={C.cyan} style={{ flex: 1, height: 360 }}>
        <Formula size={44} color={C.cyan}>{"(x − mu) / sigma"}</Formula>
        <KV k="mu、sigma 从哪来" v="这段输入自己" note="两遍扫描：先算，再变换" />
        <KV k="作用范围" v="整个窗口" />
        <KV k="可学参数" v="零" color={C.cyan} />
      </Card>
      <Card label="DAIN" accent={C.violet} style={{ flex: 1, height: 360 }}>
        <Formula size={44} color={C.violet}>{"(x − alpha) / beta"}</Formula>
        <KV k="alpha、beta 从哪来" v="两个线性映射" note="输入是窗口特征 [mu, sigma, 末值]" />
        <KV k="作用范围" v="整个窗口" />
        <KV k="可学参数" v="十二" color={C.violet} />
      </Card>
      <Card label="SAN" accent={C.amber} style={{ flex: 1, height: 360 }}>
        <Formula size={44} color={C.amber}>{"(x − mu_i) / sigma_i"}</Formula>
        <KV k="mu_i、sigma_i 从哪来" v="每一片自己" note="第 i 片内部独立统计" />
        <KV k="作用范围" v="每一片" />
        <KV k="可学参数" v="四十四" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三个零件，三个数字：零、十二、四十四。这就是「用谁的统计量」的全部差别。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="DAIN：统计量是学出来的" goal="3 个特征、2 个映射、1 个门" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 980 }}>
      <CodeBlock
        title="两条线性映射"
        width={980}
        size={FT.mono}
        lines={[
          { t: "f     = [ mu , sigma , x_T ]      -- 均值、标准差、末值" },
          { t: "alpha = Wa . f + ba               -- 权重 3 + 偏置 1" },
          { t: "beta  = Wb . f + bb               -- 权重 3 + 偏置 1" },
          { t: "c     = (x - alpha) / beta", hi: true },
          { t: "out   = gamma * c                     -- 门乘在归一化结果上" },
        ]}
      />
      <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
        门是原文给的：gamma 乘在归一化结果上，3 + 1 = 4 个参数。特征扩成 [mu, sd, 末值] 是我们的选择，所以参数才对到十二。
      </Body>
    </div>
    <div style={{ position: "absolute", left: 1120, top: 360, width: 700 }}>
      <Card label="参数清点" accent={C.violet} style={{ height: 380 }}>
        <Row name="W_a（3 维）" value="3" note="alpha 的权重" />
        <Row name="b_a" value="1" note="alpha 的偏置" />
        <Row name="W_b（3 维）" value="3" note="beta 的权重" />
        <Row name="b_b" value="1" note="beta 的偏置" />
        <Row name="W_c、b_c" value="4" note="门的映射" />
        <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
        <Row name="合计" value="12" color={C.violet} note="3+1+3+1+4，特征扩展的代价" />
      </Card>
      <Card label="桥接参数" accent={C.cyan} style={{ height: 180, marginTop: 20 }}>
        <Body size={FT.meta}>
          W_a = [1, 0, 0]、b_a = 0 时，alpha 就等于 mu；W_b = [0, 1, 0] 时，beta 就等于 sigma。
          于是 DAIN 退化成 RevIN —— 这是第三条桥接要验的事。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="SAN：先分片，再猜下一片" goal="T=250、tau=25、M=10" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
      <ShardStrip total={M.data.days} tau={M.san.tau} width={CW} height={100} />
      <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
        {M.data.days} 个交易日切成 {M.san.shards} 片，每片 {M.san.tau} 天。除不尽的残片直接丢掉 —— 这是我们的选择，不是书里的。
      </Body>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 560, width: 980 }}>
      <CodeBlock
        title="逐片归一化 + 预测下一片"
        width={980}
        size={FT.mono}
        lines={[
          { t: "M      = T div tau                     -- 10" },
          { t: "mu_i   = mean(x[片 i])" },
          { t: "sig_i  = sd  (x[片 i])" },
          { t: "y_i    = (x_i - mu_i) / sig_i", hi: true },
          { t: "(mu', sig') = MLP(mu_i, sig_i)   -- 2 -> 8 -> 2" },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: 1120, top: 560, width: 700 }}>
      <Card label="参数清点" accent={C.amber} style={{ height: 350 }}>
        <Row name="MLP 两层" value="42" note="2×8+8 与 8×2+2" />
        <Row name="逐通道权重" value="2" note="W1、W2" />
        <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
        <Row name="合计" value="44" color={C.amber} />
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          只训第一阶段：拿上一片统计量猜下一片。书里 (2.11) 还要全局均值与片内均值，我们只用 (mu, sigma)。
        </Body>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="Z-score 与 RevIN：同一个式子" goal="差别不在算式，在位置" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
      <Card label="Z-score" accent={C.inkFaint} style={{ flex: 1, height: 340 }}>
        <Row name="统计量来源" value="训练集" note="一次算好，全程固定" />
        <Row name="作用位置" value="模型之前" note="预处理，数据先被改好" />
        <Row name="可逆" value="不需要" note="原值没人要回去" />
      </Card>
      <Card label="RevIN" accent={C.cyan} style={{ flex: 1, height: 340 }}>
        <Row name="统计量来源" value="当前输入" note="每窗一份，逐窗变化" />
        <Row name="作用位置" value="模型之内" note="可学习层的一部分" />
        <Row name="可逆" value="必须" note="反向用同一份统计量" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        eps 取零时，两边算式逐位相同。桥接测的就是这一条 —— 差别只在位置，不在算术。
      </Body>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, 0.4, 0.72, 0.775]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
