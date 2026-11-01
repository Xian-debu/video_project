import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, KV, M, PAD, Pages, Row, Stat, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="没有损失，就没有梯度" goal="注意力输出了表示，然后呢" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="从表示到训练" accent={C.cyan} style={{ height: 330 }}>
        <Row name="① 上一集的输出" value="96 × 64 的表示矩阵" />
        <Row name="② 每一行是什么" value="一个时间步的混合表示" />
        <Row name="③ 它和真值比过吗" value="没有，所以没有误差" color={C.coral} />
        <Row name="④ 没有误差会怎样" value="没有梯度，参数不会动" color={C.coral} />
        <Row name="⑤ 所以需要" value="损失函数：把预测和真值压成一个数" color={C.cyan} />
        <K style={{ display: "block", marginTop: 10 }}>这个数越小，模型越好；对它有梯度，才能训练。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1100, top: 350, width: CW - 1100 }}>
      <Card label="三个口径坑" accent={C.coral} style={{ height: 330 }} pad={18}>
        <KV k="① 常数漏了" v="0.9189 / 元素" color={C.amber} size={FT.body} />
        <KV k="② 方向不同价" v="1.8 vs 0.2（9 倍）" color={C.coral} size={FT.body} />
        <KV k="③ QL 系数" v="0.5 vs 1.0（τ=0.5）" color={C.violet} size={FT.body} />
        <K style={{ display: "block", marginTop: 12 }}>三处都不影响“能不能跑”，只影响“报得对不对”。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.lead} color={C.ink}>损失函数是概率预测的入口。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="第一个坑：漏掉的常数" goal="书版 NLL 与标准 NLL 差一项" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="同一个式子，两种写法" accent={C.amber} style={{ height: 340 }}>
        <Formula size={34} note="书里式 3.30：只保留与参数有关的项">
          L_book = ½[log σ² + (y−μ)²/σ²]
        </Formula>
        <Formula size={34} note="标准高斯 NLL：每元素多 ½log 2π">
          L_std = ½[log 2π + log σ² + (y−μ)²/σ²]
        </Formula>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 350, width: CW - 1020 }}>
      <Card label="手算 μ=1, σ=2, y=3" accent={C.cyan} style={{ height: 362 }}>
        <Row name="书版" value={M.nll.book.toFixed(10)} color={C.amber} />
        <Row name="标准版" value={M.nll.std.toFixed(10)} color={C.cyan} />
        <Row name="差值" value={M.nll.gap.toFixed(10)} color={C.coral} />
        <K style={{ display: "block", marginTop: 8 }}>差值正好是 ½log 2π，和 μ、σ、y 都无关。</K>
        <Stat label="300 点合计差" value={M.nll.gapTotal.toFixed(2)} accent={C.coral} style={{ marginTop: 8 }} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Card label="为什么常数不能省" accent={C.coral} pad={16}>
        <Body size={FT.body} color={C.ink}>
          常数不影响梯度，但影响报数：少一项会让损失整体偏低 0.9189/元素，跨论文比较时口径就不一致。
          本仓两套都实现（gaussNll / gaussNllBook），证据里显式报出差值。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="第二、三个坑：方向与系数" goal="同一个误差，罚多少钱" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="pinball：误差方向决定价格" accent={C.amber} style={{ height: 330 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Chip color={C.amber}>τ = 0.9</Chip>
          <Chip color={C.inkFaint}>低估 1 元 → 罚 {M.quantile.under.toFixed(1)}</Chip>
          <Chip color={C.inkFaint}>高估 1 元 → 罚 {M.quantile.over.toFixed(1)}</Chip>
        </div>
        <div style={{ marginTop: 12 }}>
          <Row name="比值" value={M.quantile.ratio.toFixed(0) + " 倍"} color={C.coral} />
          <Row name="τ = 0.5" value="两边都是 0.5，等于 ½|误差|" color={C.cyan} />
          <Row name="τ = 0.1" value="反过来：低估 0.2，高估 1.8" />
        </div>
        <K style={{ display: "block", marginTop: 8 }}>所以“平均误差”在分位数口径下不够用，必须分 τ 报。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="QL：书版没有系数 2" accent={C.violet} style={{ height: 330 }}>
        <Formula size={30} note="式 3.42：对 τ 与样本取平均">
          QL = mean_τ mean_i L_τ(x_i, q_τ,i)
        </Formula>
        <Row name="τ = 0.5 · 书版" value={M.eval.book05.toFixed(2)} color={C.violet} />
        <Row name="τ = 0.5 · ×2" value={M.eval.x205.toFixed(2)} color={C.cyan} />
        <K style={{ display: "block", marginTop: 8 }}>brief 把 τ=0.5 的 QL 写成等于 MAE，实际书版只有一半。</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        三个坑的共同点：都不报错，只是让数字悄悄换了口径。证据的第一职责就是把口径钉死。
      </Body>
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
