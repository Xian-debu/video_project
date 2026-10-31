import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CellGrid, Chip, CW, Formula, Head, K, KV, M, PAD, Pages, PanelHeat, Row, Verdict, fmtF, fmtP } from "../shared";

const P1: React.FC = () => {
  const rows = [[0.62, -0.31, NaN], [0.18, 0.44, 0.03], [-0.55, 0.09, -0.21]];
  return (
    <>
      <Head kicker="04 / 直觉" title="三乘三的表，缺最右一列的上半" goal="两种先验在这里都够用" />
      <div style={{ position: "absolute", left: PAD, top: 330, width: 900 }}>
        <Card label="玩具矩阵 · 3 × 3" accent={C.violet} style={{ height: 330 }}>
          <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
            <CellGrid rows={rows} cell={104} label="观测" missing={[[0, 2]]} />
            <div style={{ paddingTop: 20 }}>
              <KV k="观测格" v="8 / 9" />
              <KV k="最近邻能补" v="同刻的左邻列" color={C.cyan} />
              <KV k="低秩能补" v="另外两行的方向" color={C.violet} />
            </div>
          </div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: PAD + 940, top: 330, width: CW - 940 }}>
        <Card label="两种先验" accent={C.cyan} style={{ height: 330 }}>
          <Row name="最近邻" value="邻居在同一时刻的值" note="局部、横向" />
          <Row name="低秩" value="同一列的其他行" note="整体、纵向" />
          <Body size={FT.meta} style={{ marginTop: 14 }}>
            三乘三的表太小，哪种办法都能补上。真正的分叉在下面这张图里。
          </Body>
        </Card>
      </div>
    </>
  );
};

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="整列消失，低秩就只剩零" goal="十列对目标函数没有贡献" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 900 }}>
      <PanelHeat z={M.panel.z} blockCols={M.panel.blockCols} width={860} height={470}
        title={M.panel.rows + " 天 × " + M.panel.cols + " 只 · 标准化 log 收益"} />
      <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 8 }}>
        暗红竖带是整段缺失的 10 只票（原始面板里是 10 × 250 的全空列）。
      </Body>
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 330, width: CW - 940 }}>
      <Card label="低秩眼中" accent={C.coral} style={{ height: 260 }}>
        <Body size={FT.body}>
          目标函数只数观测格。那十列没有观测，就不在方程里。
        </Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          迭代结束后补出来全是零 —— 图上是一条平直的零线。
        </Body>
        <div style={{ marginTop: 14 }}><Chip color={C.coral}>参数里叫退化</Chip></div>
      </Card>
      <Card label="最近邻眼中" accent={C.cyan} style={{ height: 260, marginTop: 22 }}>
        <Body size={FT.body}>
          这一列自己没有序列，但它不需要。同一时刻别的 90 列都在。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 12 }}>
          跨序列、同一时刻取值 —— 恰好绕开整列缺失。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="停牌的票是不是更可能暴跌" goal="是。这正是要补的那种格" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1000 }}>
      <Card label={"截面最负的 " + M.block.crash_days + " 天"} accent={C.coral} style={{ height: 430 }}>
        <Row name="这 20 天的平均收益" value={fmtF(M.block.crash_mean_ret, 4)} note="全市场都在跌" color={C.coral} />
        <Row name="真值的均方根" value={fmtF(M.block.crash_rms_truth, 4)} note="这批格的波动幅度" />
        <Row name="最近邻误差" value={fmtF(M.block.crash_rmse_knn, 4)} note="比真值小 19%" color={C.cyan} />
        <Row name="低秩 / 矩阵分解" value={fmtF(M.block.crash_rms_truth, 4)} note="预测零，误差 = 真值 RMS" color={C.coral} />
      </Card>
      <div style={{ marginTop: 20 }}>
        <Verdict ok label="低秩在这个窗口等于「全部填零」" />
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 330, width: CW - 1040 }}>
      <Card label="为什么最近邻能行" accent={C.cyan} style={{ height: 430 }}>
        <Body size={FT.body}>
          停牌的那只票自己没有序列，没法参加「找相似序列」。
        </Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          但同一行业的票在同一时刻在跌。它借的是这个共动。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 20 }}>
          低秩借的是「跨股票的低维结构」。停牌把某个变量整段拿走后，这个结构里没有它，借不到。
        </Body>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="这张面板本来就不低秩" goal="谱一看就知道" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1000 }}>
      <Card label="前 k 个奇异值占的能量" accent={C.amber} style={{ height: 430 }}>
        <Row name="前 5 个" value={fmtP(M.spectrum.rank5_share)} note="真秩五矩阵应接近 100%" color={C.amber} />
        <Row name="前 10 个" value={fmtP(M.spectrum.rank10_share)} note="仍然刚过一半" color={C.amber} />
        <Row name="前 20 个" value={fmtP(M.spectrum.rank20_share)} note="还在慢慢爬" />
        <Body size={FT.meta} style={{ marginTop: 16 }}>
          能量摊在几十个方向里。截到 5 个，剩下的全被扔掉。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 330, width: CW - 1040 }}>
      <Card label="所以" accent={C.cyan} style={{ height: 430 }}>
        <Body size={FT.lead} color={C.ink}>
          低秩在这张真实面板上本来就不该赢。
        </Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          它在自己造的低秩数据上赢八个数量级，在这张表上输给最近邻 —— 两件事不矛盾。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 16 }}>
          下一段用合成数据把这两种情形分开量。
        </Body>
      </Card>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, 0.13, 0.4, 0.79]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);