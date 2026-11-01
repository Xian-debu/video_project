import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict, Chip, Heat } from "../shared";

const MixBar: React.FC<{ label: string; v: number }> = ({ label, v }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
    <Mono size={FT.label} color={C.inkDim} style={{ width: 130 }}>{label}</Mono>
    <div style={{ width: 520, height: 22, background: C.bgSoft, borderRadius: 2 }}>
      <div style={{ width: 520 * (v / 0.6), height: 22, background: C.cyan, opacity: 0.75, borderRadius: 2 }} />
    </div>
    <Mono size={FT.label} color={C.cyan} style={{ marginLeft: 18 }}>{v.toFixed(4)}</Mono>
  </div>
);

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 6), pageAt("intuition", 12), pageAt("intuition", 18), pageAt("intuition", 25)];
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380 }}>
            <Card label="八通道相关矩阵 · 同色框 = 同行业" accent={C.cyan} style={{ padding: 24 }}>
              <Heat matrix={M.real.corr8} labels={M.real.names8} groups={M.real.groups8} cell={44} labelW={110} min={-0.2} max={1} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 600, top: 380, width: CW - 600 }}>
            <Card label="两块亮斑，一片暗区" accent={C.cyan} style={{ height: 430 }}>
              <Row name="白酒 + 银行" value="0.6537 / 0.6588" note="同行业内平均相关，两块对角亮" width={1000} />
              <Row name="指数与成分" value="0.9228" note="券商与指数的关系最紧" width={1000} />
              <Row name="跨行业" value="0.4367" note="整片暗区仍不是零，市场共同因子" width={1000} />
              <Body size={FT.label} style={{ marginTop: 18 }}>
                矩阵看起来像“四块对角 + 一层均匀底噪”。这就是图卷积想要的先验。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380 }}>
            <Card label="同一块面板，通道注意力矩阵" accent={C.amber} style={{ padding: 24 }}>
              <Heat matrix={M.real.attn8} labels={M.real.names8} groups={M.real.groups8} cell={44} labelW={110} min={0} max={0.25} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 600, top: 380, width: CW - 600 }}>
            <Card label="注意力也看行业，但弱得多" accent={C.amber} style={{ height: 430 }}>
              <Row name="行业内注意力" value="0.1432" note="行内均值，八通道注意力" width={1000} />
              <Row name="行业间注意力" value="0.0600" note="差 2.4 倍，但绝对值只有相关的四分之一" width={1000} />
              <Row name="为什么弱" value="注意力是归一化后的分数" note="softmax 把行压成 1，行业信号被摊薄" width={1000} />
              <Body size={FT.label} style={{ marginTop: 18 }}>
                注意力可以学到关系，但它不保证“结构对”——这正是图的意义。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 350 }}>
            <Card label="二十只股票 · 二十乘二十相关" accent={C.violet} style={{ padding: 18 }}>
              <Heat matrix={M.real.corr20} labels={M.real.names20} groups={M.real.groups20} cell={25} gap={2} labelW={86} min={-0.2} max={1} size={FT.micro} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 710, top: 350, width: CW - 710 }}>
            <Card label="结构更细，但仍是四块" accent={C.violet} style={{ height: 460 }}>
              <Row name="四个行业" value="白酒 / 银行 / 券商 / 地产" note="每块 5 只，块内亮、块间暗" width={1000} />
              <Row name="边不只看相关" value="相关 kNN → 29 条边" note="相关高不等于边，取每个节点前 k 个邻居" width={1000} />
              <Row name="图的连通性" value="3 个连通分量" note="比行业数少一个：券商与指数把两块连起来" width={1000} />
              <Body size={FT.label} style={{ marginTop: 18 }}>
                二十只票的图不是“四块”，而是“三块 + 一座桥”。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 370, width: 760 }}>
            <Card label="关系稳定吗？前一半 vs 后一半" accent={C.cyan} style={{ height: 300 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.cyan }}>0.8192</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                两段相关矩阵之间的相关。关系不是噪声，但也不是常数。
              </Body>
            </Card>
            <Card label="图的稀疏性" accent={C.amber} style={{ height: 260, marginTop: 24 }}>
              <Row name="稠密相关" value="8 × 8 = 64 个格子" note="全部参与消息传递" width={700} />
              <Row name="kNN 图" value="2 · k · N" note="k = 2，N = 8 → 上界 32 条有向边" width={700} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 800, top: 370, width: CW - 800 }}>
            <Card label="通道混合的能量占比" accent={C.coral} style={{ height: 590 }}>
              <Body size={FT.label} style={{ marginBottom: 16 }}>
                每一个通道，时间混合之后剩给自己的能量占比：
              </Body>
              {M.real.mixing.map((v, i) => (
                <MixBar key={M.real.names8[i]} label={M.real.names8[i]} v={v} />
              ))}
              <Row name="平均占比" value="0.3585" note="通道混合确实在混合，不是走过场" width={880} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 1120 }}>
            <Card label="三句话" accent={C.cyan} style={{ height: 480 }}>
              <Row name="一" value="通道之间有结构" note="行业内 0.694：矩阵不是随机的" width={1050} />
              <Row name="二" value="结构是稀疏的" note="kNN 图 29 条边，稠密要 400 个格子" width={1050} />
              <Row name="三" value="结构可以学，也可以算" note="注意力学、相关图算，本集两条都实现" width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 420, width: 520 }}>
            <Stat label="结构稳定性" value="0.8192" sub="前一半 vs 后一半相关" accent={C.cyan} style={{ height: 220 }} />
            <Stat label="通道混合占比" value="35.85%" sub="剩余能量，八个通道平均" accent={C.coral} style={{ height: 220, marginTop: 40 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 950, width: CW, display: "flex", gap: 16 }}>
            <Chip color={C.cyan}>关系不是噪声</Chip>
            <Chip color={C.violet}>也不是常数</Chip>
            <Verdict ok label="接下来：三个模块怎么写成代码" />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
