import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Chip, CodeBlock, Head, K, KV, M, Pages, PAD, Row,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="RevIN：两遍扫描" goal="存统计量，反变换不重算" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 1000 }}>
      <CodeBlock
        title="revin：前向保存，反向使用"
        width={1000}
        size={FT.mono}
        lines={[
          { t: "mu    = mean x                        -- 第一遍" },
          { t: "sigma = sd   x                        -- 总体方差，除以 T" },
          { t: "y     = (x - mu) / sigma              -- 第二遍" },
          { t: "revinInv st y = y * sigma + mu        -- 用 st 里存的那份", hi: true },
        ]}
      />
      <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
        反变换的函数签名收一个 stats 参数：统计量是显式传进来的，不是函数里重新算的。
      </Body>
    </div>
    <div style={{ position: "absolute", left: 1140, top: 360, width: 680 }}>
      <Card label="校验" accent={C.cyan} style={{ height: 330 }}>
        <Row name="往返最大差" value={"3.55e−15"} note="模型层 13 条断言之一" />
        <Row name="归一化后均值" value={"1.14e−13"} note="双精度舍入级" />
        <Row name="归一化后 sd 偏差" value={"1.44e−15"} note="被压到 1" />
      </Card>
      <Card label="为什么强调不重算" accent={C.coral} style={{ height: 190, marginTop: 20 }}>
        <Body size={FT.meta}>
          重算一份统计量，两次的 mu、sigma 只要差一个 ulp，往返就回不到原值。
          可逆性是这样丢的：不是算错，是算了第二遍。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="DAIN：两个映射与一个坑" goal="分母保护，门的开关" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 1000 }}>
      <CodeBlock
        title="dainForward：alpha、beta 由特征线性给出"
        width={1000}
        size={FT.mono}
        lines={[
          { t: "feats = [mean x, sd x, last x]       -- 3 维" },
          { t: "alpha = dot wa feats + ba" },
          { t: "beta  = dot wb feats + bb" },
          { t: "den   = max (abs beta) eps           -- 坑：beta 可能正好是 0", hi: true },
          { t: "c     = (x - alpha) / den" },
          { t: "out   = g * c + (1 - g) * x          -- g = sigmoid(dot wc feats + bc)" },
        ]}
      />
      <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
        eps 是配置项，默认 1e-5。取绝对值再夹下界，既防零也防负 —— 负的尺度会把走势整个翻过来。
      </Body>
    </div>
    <div style={{ position: "absolute", left: 1140, top: 360, width: 680 }}>
      <Card label="书中没有的开关" accent={C.amber} style={{ height: 260 }}>
        <Body size={FT.body}>
          DAIN 的门在书里是常开的。但要做桥接测试，必须能把它关掉 ——
          否则 DAIN 永远也退不回 RevIN。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.amber}>dcUseGate = False</Chip></div>
      </Card>
      <Card label="训练：闭式最小二乘" accent={C.cyan} style={{ height: 260, marginTop: 20 }}>
        <Body size={FT.body}>
          逐窗的最优解是 alpha = mu、beta = sigma，于是整个训练化成一个 ridge 回归。
          一步解出，不迭代。
        </Body>
        <K style={{ display: "block", marginTop: 10 }}>书里没给训练配方，这是我们的选择</K>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="SAN：分片，然后丢掉余数" goal="M = T div tau，残片丢弃" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 1000 }}>
      <CodeBlock
        title="sanForward：逐片统计 + 残片丢弃"
        width={1000}
        size={FT.mono}
        lines={[
          { t: "m      = T div tau                   -- 250 div 25 = 10" },
          { t: "used   = m * tau                     -- 250，正好整除" },
          { t: "rest   = T - used                    -- 不为零就丢，并打印", hi: true },
          { t: "shard i: mu_i = mean, sig_i = sd" },
          { t: "y      = (x_i - mu_i) / max sig_i eps" },
        ]}
      />
      <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
        这一集的数据正好整除；但代码不假设整除。丢掉多少行，输出里会写成 rest。
      </Body>
    </div>
    <div style={{ position: "absolute", left: 1140, top: 360, width: 680 }}>
      <Card label="预测下一片" accent={C.amber} style={{ height: 300 }}>
        <Body size={FT.body}>
          MLP 吃上一片的 (mu, sigma)，吐下一片的预测值。两维进、八维隐、两维出，tanh 激活。
        </Body>
        <Row name="训练窗口" value={M.san.train} note="90 个窗口" />
        <Row name="测试窗口" value={M.san.test} note="30 个窗口" />
      </Card>
      <Card label="这一集只做第一阶段" accent={C.coral} style={{ height: 220, marginTop: 20 }}>
        <Body size={FT.meta}>
          第二阶段要把统计量接回完整预测器，那需要整套训练流程。这一集只验：统计量本身能不能预测。
        </Body>
      </Card>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, 0.36, 0.7]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
