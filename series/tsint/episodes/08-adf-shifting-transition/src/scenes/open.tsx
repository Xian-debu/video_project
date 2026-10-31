import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, LinePlot, M, Matrix, PAD, Pages, Scene, SceneHead, Stat, fmtP, lf } from "../shared";

/* 开场：三个像概率的数、三处反直觉、一段真实数据。 */

const Metric: React.FC<{ name: string; value: string; note: string; color: string; width: number }> = ({ name, value, note, color, width }) => (
  <Card label={name} accent={color} style={{ width, height: 262 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 54, color, lineHeight: 1.05, letterSpacing: -1 }}>{value}</div>
    <Body size={FT.meta} style={{ marginTop: 14 }}>{note}</Body>
  </Card>
);

const ReadRow: React.FC<{ tag: string; tagColor: string; text: string }> = ({ tag, tagColor, text }) => (
  <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginTop: 12 }}>
    <div style={{ width: 132 }}><Chip color={tagColor}>{tag}</Chip></div>
    <Body size={FT.body} color={C.inkDim} style={{ flex: 1 }}>{text}</Body>
  </div>
);

export const SOpen: React.FC = () => {
  const s = M.stats;
  const d = M.series;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.115, 0.235, 0.35, 0.47, 0.575, 0.68, 0.83]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            这一集换一类东西：指标。
          </div>
          <Build at={lf("open", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Metric name="ADF 检验" value="τ" note="一个负数。越小，越有理由说序列平稳。" color={C.cyan} width={574} />
              <Metric name="漂移性" value="0.16" note="零到一之间。但零点五不代表中间。" color={C.amber} width={574} />
              <Metric name="转移性" value="2/3" note="完美周期是三分之二，常数序列是九分之二。" color={C.violet} width={574} />
            </div>
          </Build>
          <Build at={lf("open", 0.07)}>
            <div style={{ position: "absolute", left: PAD, top: 640, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>三个指标，每个只压出一个数；每个数，都长得像概率。</div>
              <K style={{ display: "block", marginTop: 8 }}>第 2 章 · 书页 p.13–14 · 三个数，三条规矩</K>
            </div>
          </Build>
          <Build at={lf("open", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 792, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              但它们都不是概率。这一集就讲，为什么这三个数容易读错。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个数，三种长相；读法都不一样。
          </div>
          <Build at={lf("open", 0.145)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Stat label="ADF · 茅台水平值" accent={C.cyan} value={s.adf.tau_level.toFixed(4)} sub="负的；越小越平稳，和 p 值方向相反" valueColor={C.cyan} style={{ width: 574, height: 216 }} />
              <Stat label="漂移性 · 最后 250 点" accent={C.amber} value={s.shifting.last250.toFixed(4)} sub="零到一之间；零点五只代表「对称」" valueColor={C.amber} style={{ width: 574, height: 216 }} />
              <Stat label="转移性 · 茅台符号" accent={C.violet} value={s.transition.sign_600519.toFixed(4)} sub="完美周期 2/3；常数序列 2/9" valueColor={C.violet} style={{ width: 574, height: 216 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.19)}>
            <div style={{ position: "absolute", left: PAD, top: 580, width: 1776 }}>
              <Card accent={C.coral} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>一个一直在动，一个一动不动；数字大小和直觉正好反过来。</div>
                <K style={{ display: "block", marginTop: 10 }}>后面的每一节，都在拆这句话</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.21)}>
            <div style={{ position: "absolute", left: PAD, top: 776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              先说为什么这三个数容易读错。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里式二点三，把同一个符号当了两件事。
          </div>
          <Build at={lf("open", 0.265)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 860 }}>
              <Card label="书里的式 (2.3) · p.13" accent={C.cyan} style={{ height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 66, color: C.ink, lineHeight: 1.2 }}>{"τ = γ̂ / se(γ̂)"}</div>
                <Body style={{ marginTop: 16 }}>式子里一个 τ，前面写作统计量，后面拿它和显著性水平比。</Body>
                <K style={{ display: "block", marginTop: 10 }}>两种读法共用一个符号，含义完全不同</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.295)}>
            <div style={{ position: "absolute", left: PAD + 900, top: 312, width: 876 }}>
              <Card label="两种读法" accent={C.coral} style={{ height: 300 }}>
                <ReadRow tag="读法一" tagColor={C.cyan} text="τ 是统计量，拿去和一张专门的临界值表比。" />
                <ReadRow tag="读法二" tagColor={C.coral} text="τ 是 p 值，小于零点零五就判平稳。" />
                <Body size={FT.meta} style={{ marginTop: 16 }}>这两件事之间，差一张临界值表；τ 服从的不是 t 分布。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.325)}>
            <div style={{ position: "absolute", left: PAD, top: 652, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              按字面实现，就是拿 τ 和零点零五比。我们照这个写法跑了一遍。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            七条序列，全部判成平稳；其中四条，本来是错的。
          </div>
          <Build at={lf("open", 0.38)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1120 }}>
              <Card label="字面实现的结果 · 只看 τ 是否小于 0.05" accent={C.coral} style={{ height: 372 }}>
                {s.naive.rows.map((r) => (
                  <div key={r.name} style={{ display: "flex", alignItems: "baseline", marginTop: 9 }}>
                    <div style={{ width: 330, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.name}</div>
                    <div style={{ width: 150, fontFamily: FONT.mono, fontSize: FT.body, color: r.tau < -3 ? C.cyan : C.coral }}>{r.tau.toFixed(2)}</div>
                    <div style={{ width: 190 }}><Chip color={C.cyan}>判平稳</Chip></div>
                    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: r.stationary ? C.inkFaint : C.coral }}>
                      {r.stationary ? "结论恰好对" : "错判"}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.43)}>
            <div style={{ position: "absolute", left: PAD + 1160, top: 312, width: 616 }}>
              <Stat label="判错条数" accent={C.coral} value={String(s.naive.wrong)} sub="随机游走、茅台水平、带趋势、滞后八阶" valueColor={C.coral} style={{ height: 176 }} />
              <Stat label="共同原因" accent={C.amber} value="τ < 0.05" sub="τ 的分布中心就在负值区，几乎永远成立" style={{ height: 176, marginTop: 16 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.45)}>
            <div style={{ position: "absolute", left: PAD, top: 722, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              这就是这一集的第一件事：符号没错，读法错了。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二件事：漂移性测的不是漂移。
          </div>
          <Build at={lf("open", 0.49)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Stat label="一条单边上涨的直线" accent={C.amber} value={s.shifting.ramp_250.toFixed(4)} sub="从 0 涨到 250，仍给零点五" valueColor={C.amber} style={{ width: 574, height: 200 }} />
              <Stat label="一条完美的等差数列" accent={C.amber} value={s.shifting.arith_1_10.toFixed(4)} sub="一到十，精确的 0.5" valueColor={C.amber} style={{ width: 574, height: 200 }} />
              <Stat label="它测的是" accent={C.cyan} value="形状" sub="上分位中位数怎么排；不是漂移强弱" valueColor={C.cyan} style={{ width: 574, height: 200 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 552, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              中位数总落在正中间；所以这个数只说明对称，不说明有没有漂移。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三件事：转移性测的不是停住。
          </div>
          <Build at={lf("open", 0.6)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <div style={{ width: 874 }}>
                <Card label="完美周期 1 2 3 · 每一行只有一格是 1" accent={C.violet} style={{ height: 252 }}>
                  <Matrix rows={s.hand.periodic.matrix} cell={62} showNumbers digits={0} color={C.violet} rowLabels={["1 →", "2 →", "3 →"]} colLabels={["到 1", "到 2", "到 3"]} />
                </Card>
              </div>
              <div style={{ width: 874 }}>
                <Card label="常数序列 · 只有第一行非零" accent={C.coral} style={{ height: 252 }}>
                  <Matrix rows={s.hand.constant.matrix} cell={62} showNumbers digits={0} color={C.coral} rowLabels={["1 →", "2 →", "3 →"]} colLabels={["到 1", "到 2", "到 3"]} />
                </Card>
              </div>
            </div>
          </Build>
          <Build at={lf("open", 0.64)}>
            <div style={{ position: "absolute", left: PAD, top: 592, display: "flex", gap: 26 }}>
              <Stat label="完美周期" accent={C.violet} value={s.transition.periodic.toFixed(4)} sub="三行的列方差各 2/9，加起来 2/3" valueColor={C.violet} style={{ width: 874, height: 150 }} />
              <Stat label="常数序列" accent={C.coral} value={s.transition.constant.toFixed(4)} sub="列方差各 1/9，加起来 2/9" valueColor={C.coral} style={{ width: 874, height: 150 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.66)}>
            <div style={{ position: "absolute", left: PAD, top: 764, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              一个一直在动，一个一动不动；动的那个数大。所以它测的是动力学的确定性。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            先看一段真实数据：茅台日线，加上一只小市值票。
          </div>
          <Build at={lf("open", 0.7)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <LinePlot series={[{ values: d.level.close, color: C.amber, name: "前复权收盘价（最后 250 交易日）" }]} width={1120} height={430} title={"600519 · 2013-01-04 → 2021-12-31 · 全段 " + M.data.daily600519.rows + " 行"} yFmt={(v) => v.toFixed(0)} at={lf("open", 0.72)} />
            </div>
          </Build>
          <Build at={lf("open", 0.74)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 300, width: 592 }}>
              <Stat label="ADF 窗口" accent={C.cyan} value="250" sub={"最后 250 个点；有效观测 " + s.adf.nobs_level} style={{ height: 136 }} />
              <Stat label="002456 对照" accent={C.violet} value={M.data.daily002456.rows + " 行"} sub="2019-01-02 → 2021-12-31" style={{ height: 136, marginTop: 14 }} />
              <Stat label="符号序列" accent={C.amber} value="250" sub="两只票的收益率符号，各取 250 个" style={{ height: 136, marginTop: 14 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.79)}>
            <div style={{ position: "absolute", left: PAD, top: 770, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              一个 ADF 数，一个漂移性数，一个转移性数；三个数，三次当场算给你看。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三条证据文件，四十三条检查。
          </div>
          <Build at={lf("open", 0.87)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Stat label="手算" accent={C.cyan} value={String(s.checks.manual)} sub="周期、常数、单符号、临界值、分箱" style={{ width: 574, height: 220 }} />
              <Stat label="真实数据" accent={C.amber} value={String(s.checks.data)} sub="茅台日线、收益率符号、转移 CSV" style={{ width: 574, height: 220 }} />
              <Stat label="失败" accent={C.cyan} value={String(s.checks.failed)} sub="四十三条全部通过" valueColor={C.cyan} style={{ width: 574, height: 220 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 580, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>所有数字都能在证据里查到；三条证据文件，四十三条检查。</div>
                <K style={{ display: "block", marginTop: 10 }}>{M.meta.evidence[0]} · {M.meta.evidence[3]} · {M.meta.evidence[6]}</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.94)}>
            <div style={{ position: "absolute", left: PAD, top: 776, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              先从那句错读开始。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
