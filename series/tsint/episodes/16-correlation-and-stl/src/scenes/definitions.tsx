import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Formula, Head, K, M, PAD, Pages, Row, fmtF } from "../shared";

const READINGS: { name: string; tag: string; color: string; st: typeof M.readings.price }[] = [
  { name: "价格面板", tag: "收盘价", color: C.cyan, st: M.readings.price },
  { name: "收益面板", tag: "log 收益", color: C.violet, st: M.readings.returns },
  { name: "STL 去趋势", tag: "残差面板", color: C.amber, st: M.readings.stl },
  { name: "经典去趋势", tag: "残差面板", color: C.coral, st: M.readings.classic },
];

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="读数的零件，分解的骨架" goal="均值项、饱和项、趋势项、季节项" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <div style={{ display: "flex", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, paddingBottom: 10, borderBottom: "1px solid " + C.panelLine }}>
        <div style={{ flex: "0 0 22%" }}>面板</div>
        <div style={{ flex: "0 0 18%" }}>mean(p)</div>
        <div style={{ flex: "0 0 18%" }}>var(p)</div>
        <div style={{ flex: "0 0 18%" }}>1/(1+var)</div>
        <div style={{ flex: "0 0 14%" }}>读数</div>
      </div>
      {READINGS.map((r) => (
        <div key={r.name} style={{ display: "flex", alignItems: "baseline", padding: "16px 0", borderBottom: "1px solid " + C.panelLine, fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>
          <div style={{ flex: "0 0 22%", fontFamily: FONT.sans, fontSize: FT.body, color: r.color }}>{r.name}</div>
          <div style={{ flex: "0 0 18%" }}>{fmtF(r.st.mean, 4)}</div>
          <div style={{ flex: "0 0 18%" }}>{fmtF(r.st.var, 4)}</div>
          <div style={{ flex: "0 0 18%" }}>{fmtF(1 / (1 + r.st.var), 4)}</div>
          <div style={{ flex: "0 0 14%", color: r.color }}>{fmtF(r.st.score, 4)}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        价格和收益的 mean 只差 0.023，var 差 9.6 倍。两张表读到最后一行，读数差 0.15。
      </Body>
    </div>
  </>
);

const SAT_W = 1020;
const SAT_H = 470;
const satX = (v: number) => 70 + (v / 0.35) * (SAT_W - 130);
const satY = (val: number) => SAT_H - 60 - ((val - 0.7) / 0.3) * (SAT_H - 110);

const P2: React.FC = () => {
  const pts = M.saturation.vars.map((v, i) => (i === 0 ? "M" : "L") + satX(v).toFixed(1) + "," + satY(M.saturation.vals[i]).toFixed(1));
  const marks = [
    { v: M.readings.returns.var, label: "收益 var 0.0177", color: C.violet },
    { v: M.readings.price.var, label: "价格 var 0.1693", color: C.cyan },
  ];
  return (
    <>
      <Head kicker="03 / 定义" title="饱和项的形状" goal="方差再大，这一项也只掉到一个数" />
      <div style={{ position: "absolute", left: PAD, top: 320 }}>
        <svg width={SAT_W} height={SAT_H} style={{ display: "block" }}>
          {[0.8, 0.9, 1.0].map((tv) => (
            <g key={tv}>
              <line x1={70} y1={satY(tv)} x2={SAT_W - 60} y2={satY(tv)} stroke={C.panelLine} />
              <text x={56} y={satY(tv) + 5} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{tv.toFixed(1)}</text>
            </g>
          ))}
          <path d={pts.join(" ")} fill="none" stroke={C.amber} strokeWidth={2.6} />
          {marks.map((mk) => (
            <g key={mk.label}>
              <line x1={satX(mk.v)} y1={satY(1 / (1 + mk.v))} x2={satX(mk.v)} y2={SAT_H - 60} stroke={mk.color} strokeDasharray="4 4" />
              <circle cx={satX(mk.v)} cy={satY(1 / (1 + mk.v))} r={5} fill={mk.color} />
              <text x={satX(mk.v) + 12} y={satY(1 / (1 + mk.v)) - 12} fill={mk.color} fontFamily={FONT.mono} fontSize={FT.meta}>{mk.label}</text>
              <text x={satX(mk.v) + 12} y={satY(1 / (1 + mk.v)) + 12} fill={mk.color} fontFamily={FONT.mono} fontSize={FT.meta}>{fmtF(1 / (1 + mk.v), 4)}</text>
            </g>
          ))}
          <text x={SAT_W - 60} y={SAT_H - 30} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>var(p)</text>
        </svg>
      </div>
      <div style={{ position: "absolute", left: PAD + 1070, top: 340, width: CW - 1070 }}>
        <Card label="为什么压得住" accent={C.amber} style={{ height: 420 }}>
          <Body size={FT.body} color={C.ink}>
            第二项的值域是 (0, 1]。方差从 0.018 涨到 0.169，
            只把它从 0.983 拉到 0.855。
          </Body>
          <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
            要让这一项掉一半，方差得涨到 1.0 以上。
          </Body>
          <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
            读数 = 平均相关 + 一个不敏感的奖励项。
          </Body>
        </Card>
      </div>
    </>
  );
};

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="四个口径，全写死" goal="自授条目 A 三十三" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW, display: "flex", flexWrap: "wrap", gap: 24 }}>
      <Card label="口径一 · 缺失值" accent={C.cyan} style={{ width: (CW - 48) / 2, height: 250 }}>
        <Body size={FT.h2} color={C.ink}>配对完整</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          一对变量各自留下非缺失的时刻，取交集算 Pearson。
          不删整行：删行会把一只票的停牌传播到所有票。
        </Body>
      </Card>
      <Card label="口径二 · 变量对" accent={C.violet} style={{ width: (CW - 48) / 2, height: 250 }}>
        <Body size={FT.h2} color={C.ink}>上三角枚举</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          i 小于 j，每对只算一次。对称的两半是同一份数据，
          重复计入会人为压小 var(p)。
        </Body>
      </Card>
      <Card label="口径三 · 方差" accent={C.amber} style={{ width: (CW - 48) / 2, height: 250 }}>
        <Body size={FT.h2} color={C.ink}>总体方差，除以 K</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          对数就是总体，不是样本。Pearson 本身的 n 与 n−1 在分子分母里约掉，
          只有式(2.4) 的 var 需要选。
        </Body>
      </Card>
      <Card label="口径四 · 算不出来" accent={C.coral} style={{ width: (CW - 48) / 2, height: 250 }}>
        <Body size={FT.h2} color={C.ink}>返回错误，不返回零</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          一对都算不出来（共同观测少于 2、或某列方差为零）就整对丢弃；
          K 为零时返回 Left。返回 0 会被读成「完全不相关」。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 860, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        四条都写死在 Correlation.hs 里，测试守住边界。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="STL 的骨架" goal="趋势、相位季节、残差，三件事" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 24 }}>
      <Card label="一 · 趋势" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>对 X 跑 LOESS</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          窗口跨整周期，局部线性拟合。得到 T，从 X 里减掉。
        </Body>
      </Card>
      <Card label="二 · 季节" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>按相位分组再 LOESS</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          周期五，把 X−T 分成五条相位子序列，各自 LOESS，
          再做一个低通平滑。得到 S。
        </Body>
      </Card>
      <Card label="三 · 残差" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>剩下的就是 R</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          R = X − T − S，逐位恒等。恒等式是测试里的一条断言。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Card label="默认配置 · 自授条目 A 三十四" accent={C.coral} style={{ height: 210 }}>
        <div style={{ display: "flex", gap: 46, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim }}>
          <span>period = 5</span>
          <span>n_s = 7</span>
          <span>n_t = 11</span>
          <span>inner = 2</span>
          <span>低通 = MA(5)² · MA(3)</span>
        </div>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          书里没有 STL 的公式，公式取自 Cleveland 一九九零。n_s 取 nextOdd(7L)，n_t 取 nextOdd(1.5L/(1−1.5/n_s)) = 11，
          与 R 的 stl() 默认一致。不做鲁棒外层：没有 bisquare 权重。
        </Body>
      </Card>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, 0.36, 0.55, 0.78]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
