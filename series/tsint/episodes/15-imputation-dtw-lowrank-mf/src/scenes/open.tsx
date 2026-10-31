import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Bars, Card, Chip, CW, Head, K, M, PAD, Pages, PanelHeat, Stat, fmtF, fmtP } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 2 章 / 数据层" title="缺失值补全三法" goal="邻域、低秩、因子：三种相信" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW, display: "flex", gap: 26 }}>
      <Card label="最近邻 · KNN + DTW" accent={C.cyan} style={{ flex: 1, height: 340 }}>
        <Body size={FT.h2} color={C.ink}>相似的序列，</Body>
        <Body size={FT.h2} color={C.ink}>同一时刻也相似。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          局部、非参数。只借同一时刻别的序列的值，不假设整张表的结构。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.cyan}>距离 + 邻居</Chip></div>
      </Card>
      <Card label="低秩 · 交替投影" accent={C.violet} style={{ flex: 1, height: 340 }}>
        <Body size={FT.h2} color={C.ink}>整张面板，</Body>
        <Body size={FT.h2} color={C.ink}>落在低维子空间。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          全局、凸松弛。让重建矩阵的秩不超过 k，观测格保留原值。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.violet}>秩约束</Chip></div>
      </Card>
      <Card label="因子 · 矩阵分解" accent={C.amber} style={{ flex: 1, height: 340 }}>
        <Body size={FT.h2} color={C.ink}>同一件事，</Body>
        <Body size={FT.h2} color={C.ink}>写成两个因子。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          X 约等于时间因子乘变量因子。非凸，但每个因子都能单独看。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.amber}>式(2.40)</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 750, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三者解同一个补全问题。区别只在先验：信邻居，还是信秩。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="同一张面板，两种挖法" goal="随机挖格子，还是整列消失" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 800 }}>
      <PanelHeat z={M.panel.z} blockCols={M.panel.blockCols} width={800} height={430}
        title={"真实面板 · " + M.panel.rows + " 天 × " + M.panel.cols + " 只（显示裁剪）"} accent={C.cyan} />
      <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
        <K>暗红竖带 = 整段缺失的 10 只票</K>
        <K color={C.cyan}>颜色 = 当日对数收益的标准化值</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 840, top: 340, width: CW - 840, display: "flex", flexDirection: "column", gap: 22 }}>
      <Card label="面板规模" accent={C.cyan} style={{ height: 190 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>
          {M.data.codes} 只 × {M.data.days + 1} 天
        </div>
        <Body size={FT.meta} style={{ marginTop: 10 }}>
          {M.data.firstDate} → {M.data.lastDate}，{M.data.firstCode} … {M.data.lastCode}。
          CSV {M.data.csvBytes} 字节，全部来自 ts-admin 导出。
        </Body>
      </Card>
      <Card label="掩码一 · 随机" accent={C.violet} style={{ height: 190 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.violet }}>{M.masks.n} 格 · 20%</div>
        <Body size={FT.meta} style={{ marginTop: 10 }}>
          撒成散点。每一列都还剩大量观测，秩约束仍然管得住。
        </Body>
      </Card>
      <Card label="掩码二 · 块状" accent={C.coral} style={{ height: 190 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.coral }}>{M.masks.blockCols} 列整段缺</div>
        <Body size={FT.meta} style={{ marginTop: 10 }}>
          停牌 = 没有行，不是 NaN。这 10 列在窗口内一个观测都不剩。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="先看排序：谁赢" goal="四法 × 两种掩码，RMSE 越小越好" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW / 2 - 20 }}>
      <Card label="随机缺失 · RMSE" accent={C.violet} style={{ height: 400 }}>
        <Bars width={CW / 2 - 76} rowH={64} items={[
          { label: "列均值", value: M.random.mean, text: fmtF(M.random.mean, 4), color: C.inkDim },
          { label: "最近邻", value: M.random.knn, text: fmtF(M.random.knn, 4), color: C.cyan },
          { label: "低秩", value: M.random.lowrank, text: fmtF(M.random.lowrank, 4), color: C.violet },
          { label: "矩阵分解", value: M.random.mf, text: fmtF(M.random.mf, 4), color: C.amber },
        ]} unit="KNN 最小；低秩反而比列均值差 23%。" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + CW / 2 + 20, top: 350, width: CW / 2 - 20 }}>
      <Card label="块状缺失 · RMSE" accent={C.coral} style={{ height: 400 }}>
        <Bars width={CW / 2 - 76} rowH={64} items={[
          { label: "列均值", value: M.block.mean, text: fmtF(M.block.mean, 4), color: C.inkDim },
          { label: "最近邻", value: M.block.knn, text: fmtF(M.block.knn, 4), color: C.cyan },
          { label: "低秩", value: M.block.lowrank, text: fmtF(M.block.lowrank, 4), color: C.violet },
          { label: "矩阵分解", value: M.block.mf, text: fmtF(M.block.mf, 4), color: C.amber },
        ]} unit="排序不变。但整列的数字里藏着陷阱，后面拆。" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        最近邻两种都赢。低秩在它自己的主场上赢了八个数量级，在真实面板上却输。
        <span style={{ color: C.inkFaint }}> 这不是实现问题。</span>
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="四个数，先钉在墙上" goal="两个是真实面板的判决，两个是合成主场" />
    <div style={{ position: "absolute", left: PAD, top: 370, width: CW, display: "flex", gap: 24 }}>
      <Stat label="随机缺失 · 最近邻 vs 低秩" value={fmtF(M.random.knn, 4) + " / " + fmtF(M.random.lowrank, 4)}
        accent={C.cyan} style={{ flex: 1, height: 300 }}
        sub={<span>同一个掩码，同一批格子。最近邻低 26%。</span>} />
      <Stat label="整列全缺 · 相关系数" value={M.block.blockcol_corr_lowrank.toFixed(2) + " / " + M.block.blockcol_corr_knn.toFixed(3)}
        accent={C.coral} style={{ flex: 1, height: 300 }}
        sub={<span>低秩把整列补成 0，相关系数恰好为零。最近邻 0.329。</span>} />
      <Stat label="合成秩三 · 低秩误差" value="4.93e−9" accent={C.violet} style={{ flex: 1, height: 300 }}
        sub={<span>40 × 30 矩阵，挖掉 20%，精确恢复到机器精度附近。</span>} />
      <Stat label="真实面板 · 前五奇异值占比" value={fmtP(M.spectrum.rank5_share, 1)} accent={C.amber} style={{ flex: 1, height: 300 }}
        sub={<span>秩五只解释 41% 方差。真正的低秩矩阵应该接近 100%。</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        数字先摆上。机制、理由、边界，一层一层来。
      </Body>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, 0.28, 0.52, 0.76]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
