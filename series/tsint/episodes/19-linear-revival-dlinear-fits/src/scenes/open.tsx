import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Chip, Head, K, M, PAD, Pages, Stat, WindowStrip, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 3 章 / 预测层" title="线性复兴：同一条骨干" goal="共享权重线性 · DLinear · FITS" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
      <Card label="本集论点" accent={C.cyan} style={{ height: 330 }}>
        <Body size={FT.lead} color={C.ink}>没有注意力，没有卷积，没有隐藏层。</Body>
        <Body size={FT.lead} color={C.ink} style={{ marginTop: 6 }}>输入九十六个交易日，输出未来二十四步。</Body>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          三个模型只改坐标：怎么分解，以及在时域还是频域乘。
          归一化沿用上一集的实例标准化，这一集不是变量。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1010, top: 340, width: CW - 1010 }}>
      <Card label="一个样本" accent={C.violet} style={{ height: 330 }} pad={18}>
        <WindowStrip h={M.meta.h} f={M.meta.f} width={CW - 1050} height={210} />
        <div style={{ marginTop: 8 }}><K>H = {M.meta.h} · F = {M.meta.f} · 通道独立，权重共享</K></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三个问题：参数差多少、分解有没有用、到底赢没赢基线。
      </Body>
      <div style={{ marginTop: 16, display: "flex", gap: 22 }}>
        <Stat label="共享权重线性" value={fmtInt(M.meta.params.shared)} accent={C.cyan} valueSize={FT.num} style={{ width: 520 }} sub={<span>每个预测步一套权重</span>} />
        <Stat label="训练窗口" value={fmtInt(M.data.dailyRows)} accent={C.amber} valueSize={FT.num} style={{ width: 520 }} sub={<span>{M.data.dailyFirst} → {M.data.dailyLast}</span>} />
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="两条论文，一句话教材" goal="线性模型为什么在 2023 年前后被重新讨论" />
    <div style={{ position: "absolute", left: PAD, top: 356, width: CW, display: "flex", gap: 22 }}>
      <Card label="2022 · 问题被重新提出" accent={C.cyan} style={{ flex: 1, height: 370 }}>
        <Body size={FT.h2} color={C.ink}>Transformer 到底有没有用？</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          把注意力换成一个线性层，在多个长序列基准上不输。
          论文的标题本身就是一个问句。
        </Body>
      </Card>
      <Card label="2023 · DLinear" accent={C.amber} style={{ flex: 1, height: 370 }}>
        <Body size={FT.h2} color={C.ink}>先分解，再两条线性层。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          趋势用移动平均，季节用残差；两条支路各自乘一个矩阵再相加。
          参数翻倍，函数集合不变。
        </Body>
      </Card>
      <Card label="2023 · FITS" accent={C.violet} style={{ flex: 1, height: 370 }}>
        <Body size={FT.h2} color={C.ink}>不在时域，在频域乘。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          只保留前二十四个频率分量，用一个四十八乘四十八的线性层混合，
          再用逆变换还原。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Card label="教材 p.46 · 3.3.3" accent={C.coral} pad={20}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
          <Body size={FT.h2} color={C.ink} style={{ flex: 1 }}>
            书里只有一句话：线性模型参数少、效果不差。
          </Body>
          <Chip color={C.coral}>没有公式 · 勘误 E34</Chip>
          <Chip color={C.inkFaint}>表 3.1 只给参数量</Chip>
        </div>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="三个数，自己数出来" goal="H=96, F=24, R=24 下的参数量" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Stat label="共享权重线性" value={fmtInt(M.meta.params.shared)} accent={C.cyan} style={{ flex: 1, height: 250 }}
        sub={<span>(H + 1) · F = 97 × 24</span>} />
      <Stat label="DLinear" value={fmtInt(M.meta.params.dlinear)} accent={C.amber} valueSize={FT.num} style={{ flex: 1, height: 250 }}
        sub={<span>2 · (H + 1) · F</span>} />
      <Stat label="FITS · R=24" value={fmtInt(M.meta.params.fits)} accent={C.violet} style={{ flex: 1, height: 250 }}
        sub={<span>4R² + 2R = 2304 + 48</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 660, width: 1180 }}>
      <Card label="书里的表 3.1（C 级，仅量级引用）" accent={C.inkFaint}>
        <Bars width={1100} rowH={44}
          items={[
            { label: "书·大模型", value: M.meta.params.bookLarge, text: "13.97 万", color: C.coral },
            { label: "书·DLinear", value: M.meta.params.bookDlinear, text: "4,500", color: C.amber },
            { label: "本仓·shared", value: M.meta.params.shared, text: "2,328", color: C.cyan },
            { label: "本仓·DLinear", value: M.meta.params.dlinear, text: "4,656", color: C.amber },
            { label: "本仓·FITS", value: M.meta.params.fits, text: "2,352", color: C.violet },
          ]} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1220, top: 660, width: CW - 1220 }}>
      <Card label="三十倍" accent={C.coral} style={{ height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.ink }}>{fmtInt(139700)} / {fmtInt(4500)}</div>
        <Body size={FT.body} style={{ marginTop: 12 }}>≈ 31×。但书里没给输入输出、没给训练配方，数字不能直接对齐。</Body>
        <K color={C.amber} style={{ display: "block", marginTop: 16 }}>同量级 ≠ 对得上</K>
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="先说结论：最后一个值赢了" goal="24 步日线 MAE，越低越好" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 980 }}>
      <Card label="八条 A 股日线 · 合并 MAE" accent={C.coral} style={{ height: 380 }}>
        <Bar label="最后一个值" value={M.mae.dailyLast} max={M.mae.dailyShared} color={C.coral} />
        <Bar label="共享线性" value={M.mae.dailyShared} max={M.mae.dailyShared} color={C.cyan} />
        <Bar label="DLinear" value={M.mae.dailyDlinear} max={M.mae.dailyShared} color={C.amber} />
        <Bar label="FITS" value={M.mae.dailyFits} max={M.mae.dailyShared} color={C.violet} />
        <K style={{ display: "block", marginTop: 10 }}>单位：元 / 股，二十四步平均绝对误差；越低越好</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1010, top: 350, width: CW - 1010 }}>
      <Card label="这一集要讲清楚" accent={C.cyan} style={{ height: 380 }}>
        <Body size={FT.h2} color={C.ink}>为什么 4656 个参数</Body>
        <Body size={FT.h2} color={C.ink}>可以退化成 2328 个。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          为什么退化以后误差反而低百分之三点三；为什么三个模型都没赢过朴素基线；
          以及为什么这仍然值得学。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Body size={FT.lead} color={C.ink}>先看问题设定：书里给了什么，没给什么。</Body>
    </div>
  </>
);

const Bar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
    <div style={{ width: 180, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{label}</div>
    <div style={{ flex: 1, height: 22, background: C.panelLine, borderRadius: 4, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (value / max) * 100 + "%", background: color, borderRadius: 4, opacity: 0.9 }} />
    </div>
    <div style={{ width: 130, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color }}>{value.toFixed(2)}</div>
  </div>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, pageAt("open", 8), pageAt("open", 19), pageAt("open", 30)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);