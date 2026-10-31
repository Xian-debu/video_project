import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmtF, fmtInt, lf } from "../shared";

/* 边界：真实收益、预算、任务、指标；不说「LSTM 更好」。 */

export const SBoundary: React.FC = () => {
  const m = M;
  const r = m.real;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={[0, 0.3, 0.58, 0.82]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            最后一个实验：从行情库里导出的真实收益。
          </div>
          <Build at={lf("boundary", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Stat label="票数" accent={C.cyan} value={String(r.returns.codes)} sub="全市场抽样" valueSize={58} style={{ width: 426, height: 190 }} />
              <Stat label="交易日" accent={C.violet} value={String(r.returns.days)} sub={r.returns.first + " 至 " + r.returns.last.slice(0, 7)} valueColor={C.violet} valueSize={58} style={{ width: 426, height: 190 }} />
              <Stat label="总行数" accent={C.amber} value={fmtInt(r.returns.rows)} sub="前复权、剔停牌" valueColor={C.amber} valueSize={58} style={{ width: 426, height: 190 }} />
              <Stat label="精确零收益" accent={C.coral} value={String(r.returns.zeros)} sub={"占 " + fmtF(r.returns.zeroShare * 100, 2) + "%"} valueColor={C.coral} valueSize={58} style={{ width: 426, height: 190 }} />
            </div>
          </Build>
          <Build at={lf("boundary", 0.14)}>
            <div style={{ position: "absolute", left: PAD, top: 536, width: 1776 }}>
              <Card label="面板数据的第一条纪律 · 零收益不是停牌" accent={C.coral} style={{ width: 1776, height: 290 }}>
                <Row name="平盘日" value={"收益精确等于 0 · " + r.returns.zeros + " 行"} note={"占 " + fmtF(r.returns.zeroShare * 100, 2) + "%，是真实成交价没变"} width={1710} />
                <Row name="停牌日" value="那一行根本不存在" note="不是零收益，是缺行；补零会把停牌当成平盘" color={C.coral} width={1710} />
                <Row name="导出时" value="前复权 + 剔停牌" note="否则除权日会出现假跳空" width={1710} />
                <Row name="为什么说这个" value="后面算自相关，零会被当成有效观测" note="偏差不大，但分配含义变了" width={1710} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            算滞后一阶到十阶的自相关，每只票先算自己的，再取横截面平均。
          </div>
          <Build at={lf("boundary", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
              <Card label="横截面平均的自相关系数 · 十个滞后" accent={C.cyan} style={{ width: 1120, height: 470 }}>
                <LinePlot
                  width={1060}
                  height={330}
                  at={lf("boundary", 0.36)}
                  series={[{ values: r.lag.mean, color: C.cyan, name: "平均 ρ" }]}
                  from={0}
                  to={9}
                  zeroLine
                  padB={44}
                  padT={30}
                  yFmt={(v) => v.toFixed(2)}
                  hlines={[
                    { v: r.lag.band, color: C.coral, label: "+2/√T" },
                    { v: -r.lag.band, color: C.coral, label: "−2/√T" },
                  ]}
                />
                <K style={{ display: "block", marginTop: 8 }}>横轴 1–10 阶；虚线是 2 / √250 = {fmtF(r.lag.band, 4)} 的抽样带</K>
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 1160, top: 300, display: "flex", flexDirection: "column", gap: 20 }}>
              <Card label="三个数" accent={C.amber} style={{ width: 616, height: 300 }}>
                <Row name="平均 |ρ|" value={fmtF(r.lag.meanAbs, 4)} note="十阶平均的绝对值" color={C.amber} width={560} />
                <Row name="最大" value={fmtF(r.lag.maxAbs, 4)} note="负相关，仍在带内" width={560} />
                <Row name="出带比例" value="两阶" note="十阶里只有两阶超出虚线" width={560} />
              </Card>
              <Card label="结论" accent={C.cyan} style={{ width: 616, height: 150 }}>
                <Body>真实日收益几乎没有可被记忆的线性结构。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            边界要说三条：预算、任务、指标。
          </div>
          <Build at={lf("boundary", 0.61)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Card label="一 · 预算" accent={C.coral} style={{ width: 570, height: 400 }}>
                <Row name="训练样本" value={m.delay.train + " 条"} note="刻意的小预算，不是上限" color={C.coral} width={520} />
                <Row name="轮数上限" value={m.delay.epochs + " 轮"} note={"patience " + m.delay.patience} width={520} />
                <Row name="书里" value="没有训练配方" note="errata E01：整章没给超参" width={520} />
                <K style={{ display: "block", marginTop: 14 }}>换成一千条样本、几百轮，判决表可能会变</K>
              </Card>
              <Card label="二 · 任务" accent={C.violet} style={{ width: 570, height: 400 }}>
                <Row name="任务" value="延迟复制" note="纯记忆，没有任何结构可利用" color={C.violet} width={520} />
                <Row name="序列" value={m.delay.T + " 步 · 八维输入"} note="只有第 0 维是信号" width={520} />
                <Row name="真实序列" value="有季节、趋势、跳跃" note="比它容易，也比它复杂" width={520} />
                <K style={{ display: "block", marginTop: 14 }}>判决表只对这个任务成立</K>
              </Card>
              <Card label="三 · 指标" accent={C.amber} style={{ width: 570, height: 400 }}>
                <Row name="命中率" value="只说明符号" note="有没有记住，不说明记住多少" color={C.amber} width={520} />
                <Row name="不说明" value="幅度 / 时序 / 预测力" note="二分类准确率看不出来" width={520} />
                <Row name="随机基线" value={fmtF(m.delay.base, 1)} note={"抽样标准差 " + fmtF(m.delay.sd, 3)} width={520} />
                <K style={{ display: "block", marginTop: 14 }}>一百二十八条测试，一个标准差就是四点四个百分点</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.74)}>
            <div style={{ position: "absolute", left: PAD, top: 740, display: "flex", gap: 20 }}>
              <Chip color={C.coral}>小预算</Chip>
              <Chip color={C.violet}>单一任务</Chip>
              <Chip color={C.amber}>单指标</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            所以这一集不能说「LSTM 更好」。
          </div>
          <Build at={lf("boundary", 0.85)}>
            <div style={{ position: "absolute", left: PAD, top: 300, width: 1776 }}>
              <Card label="能说的和不能说的" accent={C.cyan} style={{ width: 1776, height: 420 }}>
                <Row name="不能说的" value="LSTM 学会了长延迟" note="四十步的零点六一七只是高基线 2.6σ" color={C.coral} width={1710} />
                <Row name="能说的" value="同样预算下，加法路径在长延迟上留住了更多信号" note="d = 20 时 GRU 还略高于 LSTM" color={C.cyan} width={1710} />
                <Row name="这是结构的优势" value="不是训练的保证" note="要变成保证，得靠数据量和训练配方" color={C.amber} width={1710} />
                <Row name="而这恰恰" value="是书里没写的那部分" note="errata E01 与 E15 都指向同一件事" width={1710} />
              </Card>
            </div>
          </Build>
          <Build at={lf("boundary", 0.93)}>
            <div style={{ position: "absolute", left: PAD, top: 760, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "18px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>短延迟上 RNN 便宜又快；长延迟上，没有谁便宜，只有谁掉得慢一点。</div>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
