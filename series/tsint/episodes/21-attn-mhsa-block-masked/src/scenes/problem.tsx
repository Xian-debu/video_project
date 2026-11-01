import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, CodeBlock, Formula, Head, K, KV, M, PAD, Pages, Row, Stat, fmtF, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="教材不是施工图" goal="骨架之外，参数全空" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="书里的注意力（全部）" accent={C.inkFaint} style={{ height: 300 }}>
        <Body size={FT.h2} color={C.ink}>softmax(QKᵀ / √d_k) · V</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          一行式子，三个矩阵符号。Q、K、V 各自从哪来、多少维、怎么初始化，
          式子里一个都没有。
        </Body>
        <K style={{ display: "block", marginTop: 14 }}>书 p.53–56 · 勘误 E36 记录了「骨架只有式 3.19–3.21」</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="三个必须自己回答的问题" accent={C.coral} style={{ height: 300 }}>
        <Row name="缩放" value="除不除 √d_k" color={C.amber} />
        <Row name="拼接" value="按头拼，还是按步交错" color={C.cyan} />
        <Row name="掩码" value="负无穷，还是零" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Body size={FT.lead} color={C.ink}>三个问题各自都有「看起来对」的错误答案。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="第一个空格：缩放" goal="点积的方差随宽度线性增长" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 900 }}>
      <Card label="为什么会变尖" accent={C.amber} style={{ height: 330 }}>
        <Formula size={46} note="q·k 是 d_k 项乘积之和；若每项方差为 1，和的方差就是 d_k">
          Var(q·k) = d_k
        </Formula>
        <Body size={FT.body} style={{ marginTop: 22 }}>
          每头 d_k = 16，打分的标准差约为 4。不除 √d_k，logit 就整体放大四倍。
          softmax 的输入越大，输出越接近 one-hot。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 350, width: CW - 940 }}>
      <Card label="本仓的两组实际读数" accent={C.coral} style={{ height: 330 }}>
        <Row name="缩放后 · 最大 |logit|" value={fmtF(M.scaling.scaledMax, 4)} color={C.cyan} />
        <Row name="不缩放 · 最大 |logit|" value={fmtF(M.scaling.unscaledMax, 4)} color={C.coral} />
        <Row name="缩放后 · 平均熵" value={fmtF(M.scaling.scaledEntropy, 4) + " bit"} color={C.cyan} />
        <Row name="不缩放 · 平均熵" value={fmtF(M.scaling.unscaledEntropy, 4) + " bit"} color={C.coral} />
        <K style={{ display: "block", marginTop: 10 }}>96 行真实窗口，四个头平均；验证环节会逐项复述</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Card label="一句话" accent={C.cyan} pad={18}>
        <Body size={FT.body} color={C.ink}>缩放不是让模型更强，而是让 softmax 待在工作区间里。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="第二、三个空格：顺序与掩码" goal="两个都能自洽地写错" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 860 }}>
      <CodeBlock width={820} size={FT.meta} title="两种拼接，都说得通" lines={[
        { t: "// 按头拼（head-major）", dim: true },
        { t: "[h0_t0, h0_t1, ..., h1_t0, ...]" },
        { t: "// 按步交错（row-interleaved）", dim: true, hi: true },
        { t: "[h0_t0, h1_t0, ..., h0_t1, ...]" },
        { t: "两者输出形状都是 96×64。", dim: true },
        { t: "选哪种都行，但前向与求导必须一致。", hi: true },
      ]} />
    </div>
    <div style={{ position: "absolute", left: PAD + 900, top: 340, width: CW - 900 }}>
      <Card label="掩码的三种写法" accent={C.coral} style={{ height: 300 }}>
        <Row name="上三角 = −∞" value="正确" note="softmax 后恰为 0" color={C.cyan} />
        <Row name="上三角 = 0" value="错误" note="exp(0)=1，仍会分到权重" color={C.coral} />
        <Row name="整行遮蔽" value="视需求" note="首 token 只能看自己时用到" color={C.amber} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 660, width: 940 }}>
      <Card label="拼接顺序那次事故" accent={C.amber} style={{ height: 290 }}>
        <Body size={FT.body} color={C.ink}>
          前向改成按步交错以后，求导函数里还留着按头拼。两边各自自洽，
          梯度检查照常通过——因为它拿自己的损失和自己的梯度比。
        </Body>
        <K style={{ display: "block", marginTop: 12 }}>第一次跨前向对照，误差 3.96；改完 2.6×10⁻¹⁰</K>
      </Card>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, pageAt("problem", 10), pageAt("problem", 19)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
