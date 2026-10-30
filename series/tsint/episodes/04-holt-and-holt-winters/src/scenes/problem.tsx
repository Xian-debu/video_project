import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, HoltPlot, K, Mono, PAD, Pages, Scene, SceneHead, SeasonPlot, fmtInt, fmtM, lf, M } from "../shared";

/** 问题：水平线走不出去，斜线又走不稳；乘法还要面对零。 */
export const SProblem: React.FC = () => {
  const id = "problem";
  const b = (k: number) => lf(id, k);
  const d = M.data;
  const dl = M.holt.daily;
  const a5 = M.hw.add5;
  const v = M.hw.zero;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.27, 0.53, 0.76]}>
        {/* 1 · 两条外推 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 264, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>一次平滑只会说「还在这个水平」；Holt 说「还在往这个方向走」。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 350, width: 860 }}>
            <Build at={b(0.02)}>
              <Card label="一次平滑 · 一个状态" accent={C.cyan} pad={24} style={{ width: 860, height: 280 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.cyan }}>水平线</div>
                <div style={{ marginTop: 14 }}><Mono size={FT.mono} color={C.inkDim}>s_t = α x_t + (1-α) s_{"{t-1}"}</Mono></div>
                <Body size={FT.body} style={{ marginTop: 16 }}>外推 h 步，答案都是同一个 s；它没有方向可走。</Body>
                <K>预测的形状，由状态决定</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 350, width: 876 }}>
            <Build at={b(0.05)}>
              <Card label="Holt · 两个状态" accent={C.amber} pad={24} style={{ width: 876, height: 280 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.amber }}>斜线</div>
                <div style={{ marginTop: 14 }}><Mono size={FT.mono} color={C.inkDim}>ŷ_{"{t+h}"} = s_t + h · b_t</Mono></div>
                <Body size={FT.body} style={{ marginTop: 16 }}>多一个 b，就能把「每天涨多少」带出样本。</Body>
                <K>外推不是预测，只是把最后一个斜率延续</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 678, width: 1776 }}>
            <Build at={b(0.09)}>
              <Card accent={C.coral} pad={20} style={{ width: 1776, height: 116 }}>
                <Body size={FT.body}>但斜线不一定更准：一步预测里，b 带进来的是上一刻的斜率，也可能是噪声。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 日线证据 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 1400 }}>
            <Body color={C.ink} size={FT.lead}>日线上把误差加起来：Holt 反而输给同 α 的一次平滑。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 330 }}>
            <Build at={b(0.29)}>
              <HoltPlot width={1100} height={400} shows={["close", "holt"]} at={b(0.28)} title={"收盘价与 Holt 拟合 · " + d.daily.rows + " 个交易日"} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1128, top: 330, width: 648 }}>
            <Build at={b(0.32)}>
              <Card label="一步误差平方和" accent={C.amber} pad={20} style={{ width: 648, height: 128 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Mono size={FT.num} color={C.amber}>{fmtInt(dl.sse)}</Mono>
                  <K>Holt</K>
                </div>
              </Card>
            </Build>
            <Build at={b(0.34)}>
              <Card label="同 α 的一次平滑" accent={C.cyan} pad={20} style={{ width: 648, height: 128, marginTop: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Mono size={FT.num} color={C.cyan}>{fmtInt(dl.sseSes)}</Mono>
                  <K>SES</K>
                </div>
              </Card>
            </Build>
            <Build at={b(0.37)}>
              <Card label="差距" accent={C.coral} pad={20} style={{ width: 648, height: 108, marginTop: 18 }}>
                <Mono size={FT.num} color={C.coral}>{(dl.improve * 100).toFixed(2)}%</Mono>
                <K style={{ marginLeft: 12 }}>趋势让一步误差变差</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: 1776 }}>
            <Body size={FT.meta}>末态水平 {fmtM(dl.lastLevel, 1)}，趋势每天 {fmtM(dl.lastTrend, 2)} 元；斜线在外推里才开始有用。</Body>
          </div>
        </div>

        {/* 3 · 季节 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 264, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>季节是第二个新状态：同一个周期里的第几个位置，应该偏多少。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 340 }}>
            <Build at={b(0.55)}>
              <SeasonPlot mode="day5" width={1000} height={400} at={b(0.54)} title="周内 5 个位置 · 加性季节偏移（元）" />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: 736 }}>
            <Build at={b(0.57)}>
              <Card label="加法" accent={C.cyan} pad={20} style={{ width: 736, height: 186 }}>
                <Body size={FT.body} color={C.ink}>偏移是固定的元数：周五比均值高 {fmtM(Math.max(...a5.season), 2)} 元。</Body>
                <K>水平翻倍，偏移不变</K>
              </Card>
            </Build>
            <Build at={b(0.6)}>
              <Card label="乘法" accent={C.violet} pad={20} style={{ width: 736, height: 186, marginTop: 18 }}>
                <Body size={FT.body} color={C.ink}>偏移是水平的百分比：水平翻倍，偏移也翻倍。</Body>
                <K>更贴合「旺季更旺」，但要求值为正</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 768, width: 1776 }}>
            <Body size={FT.meta}>季节振幅 {(a5.amp).toFixed(2)} 元；五个偏移为 {a5.season.map((x: number) => fmtM(x, 2)).join(" / ")}。</Body>
          </div>
        </div>

        {/* 4 · 除法 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>乘法版本有两处除法，于是有两个爆点。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1060 }}>
            <Build at={b(0.78)}>
              <Card label="分母在哪里" accent={C.coral} pad={24} style={{ width: 1060, height: 300 }}>
                <div style={{ lineHeight: 2.05 }}>
                  <Mono size={FT.mono} color={C.ink}>s_t = α · x_t / p_{"{t-L}"} + (1-α)(s_{"{t-1}"} + b_{"{t-1}"})</Mono>
                  <div />
                  <Mono size={FT.mono} color={C.ink}>p_t = γ · x_t / (s_{"{t-1}"} + b_{"{t-1}"}) + (1-γ) · p_{"{t-L}"}</Mono>
                </div>
                <Body size={FT.body} style={{ marginTop: 18 }}>第一处分母是季节项，第二处是水平加趋势；任何一处小于等于零，模型就没有定义。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1100, top: 340, width: 676 }}>
            <Build at={b(0.81)}>
              <Card label="零的连锁" accent={C.amber} pad={22} style={{ width: 676, height: 300 }}>
                <Body size={FT.body} color={C.ink}>分子为零：看起来没事，季节项被拉向零。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>下一步，分母变零；再下一步，结果是无穷或者 NaN。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.coral}>入口拒绝，还是递推爆炸</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 680, width: 1776 }}>
            <Build at={b(0.84)}>
              <Card accent={C.cyan} pad={20} style={{ width: 1776, height: 120 }}>
                <Body size={FT.body}>实证：{fmtInt(d.volume.rows)} 行成交量里 {fmtInt(d.volume.zero_rows)} 个零；加法能跑，乘法直接报 {v.error.code}。</Body>
                <K>这不是边角料，是半个数据集</K>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
