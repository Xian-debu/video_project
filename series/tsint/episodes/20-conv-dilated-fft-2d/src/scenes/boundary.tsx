import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, M, PAD, Pages, Row, Stat, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 边界" title="哪些话不能说" goal="没有预测头，就不报误差" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 22 }}>
      <Card label="不能说 · 一" accent={C.coral} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>「我们复现了书里的模型。」</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          书里没有超参数，也没有预测头。我们只复现了三个结构件：卷积、频率、聚合。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.coral}>C 级引用 · 只借结构</Chip></div>
      </Card>
      <Card label="不能说 · 二" accent={C.coral} style={{ flex: 1, height: 330 }}>
        <Body size={FT.h2} color={C.ink}>「在分钟线上赢了基线。」</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          这一集没有预测头。没有预测，就没有误差，也没有胜负。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.coral}>scope · 不排名</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Card label="被取消的对照实验" accent={C.amber} pad={22}>
        <Body size={FT.h2} color={C.ink}>
          计划书里写过：折叠卷积对仅相位卷积，比二十四步误差。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          它需要预测头，这一集没建。所以实验取消，不是「结果不好没放」，是根本没做。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 900, width: CW }}>
      <K>屏幕上写清楚，比数字好看更重要。</K>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 边界" title="还有三句不能说" goal="样本、标的、超参数" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Card label="不能说 · 三" accent={C.coral} style={{ flex: 1, height: 400 }}>
        <Body size={FT.h2} color={C.ink}>「卷积找到了周周期。」</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          二百四十根排第 {M.spectrum.weekly240Rank} 位，振幅 {M.spectrum.weekly240Amp}。样本只有 {M.data.days} 个交易日，约二十周。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          测不出，不等于不存在；但这一集只能承认测不出。
        </Body>
      </Card>
      <Card label="不能说 · 四" accent={C.coral} style={{ flex: 1, height: 400 }}>
        <Body size={FT.h2} color={C.ink}>「这是全部 A 股的结论。」</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          一只股票、一段行情、一个频率。换标的、换年份，排序就可能变。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.coral}>单样本 · 单标的</Chip></div>
      </Card>
      <Card label="不能说 · 五" accent={C.coral} style={{ flex: 1, height: 400 }}>
        <Body size={FT.h2} color={C.ink}>「这是最优结构。」</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          核宽三、膨胀一二四八，是我们选的。书里没给，论文里还有别的组合；没有做超参搜索。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.coral}>未消融</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 810, width: CW }}>
      <Body size={FT.lead} color={C.ink}>最硬的一句：这一集证明的是结构，不是效果。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 边界" title="两处没做，写进清单" goal="不是假装做过，是留给后续" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1080 }}>
      <Card label="式 3.15 的通道轴" accent={C.amber} style={{ height: 360 }}>
        <Body size={FT.h2} color={C.ink}>没有单独实现。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          书里把时间轴和通道轴的空洞卷积分开写。我们把通道混进权重布局：等价，但没有单独测这条式子。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          后果：如果论文里的通道轴有额外约束，这一集没有验证。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1110, top: 350, width: CW - 1110 }}>
      <Card label="频率个数与归一化" accent={C.violet} style={{ height: 360 }}>
        <Body size={FT.h2} color={C.ink}>固定三个，没有消融。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          频率个数 k 固定为三，没有扫。聚合权重只测了归一化，没测学习出来的权重。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          归一化沿用上一集的实例标准化，这一集不是变量。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 770, width: CW }}>
      <Card label="这些缺口影响什么" accent={C.cyan} pad={20}>
        <Body size={FT.body} color={C.ink}>
          不影响结构断言，但影响你能从数字里读出的结论：三个模块各自可证，但「这个组合更好」没有被验证。
        </Body>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 边界" title="数据上的四处偏离" goal="写进清单，不藏在脚注" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <Card label="偏离清单" accent={C.amber}>
        <Row name="一 · 窗口只有 104 天" value="样本短" note="周周期没有统计基础；跨年比较不可做" color={C.coral} width={1060} />
        <Row name="二 · 只取绝对值收益" value="丢了符号" note="方向信息被抹平；这是频率分析的选择，不是预测口径" color={C.amber} width={1060} />
        <Row name="三 · 周期检测用全样本" value="不分训练验证" note="在真正预测时，这里会引入前视偏差" color={C.coral} width={1060} />
        <Row name="四 · 聚合只测归一化" value="不测学习" note="权重是振幅算出来的，不是训练出来的" color={C.inkDim} width={1060} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Card label="下一集" accent={C.violet} style={{ height: 430 }}>
        <Body size={FT.h2} color={C.ink}>回到注意力。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          多头自注意力，分块与掩码。那里的先验不是局部，是两两相关。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          问题还是同一个：它到底学到了什么？
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.violet}>E21 · attn-mhsa-block-masked</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>偏差写出来，读的人才知道这些数能撑多重的结论。</Body>
    </div>
  </>
);

export const SBoundary: React.FC = () => (
  <Pages id="boundary" at={[0, pageAt("boundary", 10), pageAt("boundary", 20), pageAt("boundary", 28)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
