import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Chip, Head, K, KV, M, Pages, PAD, Row, Stat,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="归一化不承诺什么" goal="第一条：不创造信息" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
      <Card label="它做了什么" accent={C.cyan} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>换了一套坐标。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          减一个常数、除一个正数，都是可逆的线性/仿射操作。信息量不变，只是刻度变了。
        </Body>
      </Card>
      <Card label="它没做什么" accent={C.coral} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>没有多出任何信息。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          归一化不会让模型看到未来。它让不同量级的序列可比，这是表达上的便利，不是信息上的增益。
        </Body>
      </Card>
      <Card label="所以" accent={C.amber} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>别指望它提分。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          如果下游模型本来就能学到同样的缩放，归一化带不来额外的东西 —— 它省的是优化难度，不是数据。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="第二条：不解决漂移" goal="追上可以，预测很难" />
    <div style={{ position: "absolute", left: PAD, top: 370, width: CW, display: "flex", gap: 26 }}>
      <Card label="分布变了" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <Body size={FT.body}>
          窗口统计量跟着窗口变，模型至少不会被旧尺度带偏。这是「跟上」。
        </Body>
      </Card>
      <Card label="要预测" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.body}>
          SAN 想做的事：用上一片猜下一片。这一集的第一阶段没做成 —— 输给「不动」一点五到三点六倍。
        </Body>
      </Card>
      <Card label="而且" accent={C.coral} style={{ flex: 1, height: 300 }}>
        <Body size={FT.body}>
          统计量预测得准，不等于下游预测更准。MSE 小是必要条件，不是充分条件。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        要证明「有用」，得训完整预测器，看测试集误差。那是后面的集。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="07 / 边界" title="数据、配方、与一个除零陷阱" goal="哪些是书里的，哪些是我们的" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 760 }}>
      <Card label="数据" accent={C.cyan} style={{ height: 380 }}>
        <KV k="票池" v={M.data.codes + " 只"} note={"全市场等距抽样 " + M.data.firstCode + " … " + M.data.lastCode} />
        <KV k="交易日" v={M.data.days + " 天"} note={"共 " + M.data.rows.toLocaleString("en-US") + " 个 (票, 日) 格子"} />
        <KV k="窗口" v={M.san.train + " 训 / " + M.san.test + " 测"} note="面板 × 时间窗" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 800, top: 360, width: 920 }}>
      <Card label="配方：书里没有" accent={C.amber} style={{ height: 380 }}>
        <Row name="优化器" value="闭式最小二乘 / 固定步长梯度" note="书里一章都没给训练细节" color={C.amber} />
        <Row name="学习率、轮数" value="我们的选择" note="没调参，只求能收敛" />
        <Row name="片长 tau" value={M.san.tau} note="25 个交易日，五个交易周" />
        <Chip color={C.amber} style={{ marginTop: 14 }}>画面标注：非书中设定</Chip>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Card label="除零陷阱" accent={C.coral} style={{ height: 170 }}>
        <Body size={FT.body}>
          常数序列的 sigma 是零。除零不是「误差变大」，是整条链变成 NaN。
          所以 eps 不是防御性编程的可选项，是正确性的一部分。
        </Body>
      </Card>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, 0.32, 0.64]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
