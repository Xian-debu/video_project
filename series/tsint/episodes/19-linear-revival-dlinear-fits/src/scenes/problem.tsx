import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, M, PAD, Pages, Row, Stat, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="一句话，五个没答" goal="书里只给参数量，不给可复现实验" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 880 }}>
      <Card label="教材 p.46 · 3.3.3" accent={C.coral} style={{ height: 400 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 40, lineHeight: 1.5, color: C.ink }}>
          「线性模型参数少，效果不差。」
        </div>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          表 3.1 把线性结构和 Transformer 并排，最后一列是参数量：
          大模型 7.05e4 与 1.397e5，DLinear 4.5e3。
        </Body>
        <div style={{ marginTop: 20 }}><Chip color={C.coral}>这一句撑不起一集</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 910, top: 350, width: CW - 910 }}>
      <Card label="书里没给的" accent={C.violet} style={{ height: 400 }}>
        <Row name="输入 H / 输出 F" value="未给" width={800} />
        <Row name="训练配方" value="损失、优化器、学习率、轮数" width={800} />
        <Row name="归一化与反变换" value="未给" width={800} />
        <Row name="早停与随机种子" value="未给" width={800} />
        <Row name="可复现的数字" value="表 3.1 只有参数量" width={800} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        只给体重，不给身高。所以我们不对齐数字，只对齐问题设定。
      </Body>
      <K color={C.amber} style={{ display: "block", marginTop: 12 }}>
        表 3.1 的 7.05e4 / 1.397e5 / 4.5e3 在本集只作量级引用（C 级证据）
      </K>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="把参数一个个数出来" goal="H=96 · F=24 · R=24" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Card label="共享权重线性" accent={C.cyan} style={{ flex: 1, height: 330 }}>
        <Formula size={34}>{"W ∈ R^(96×24), b ∈ R^24"}</Formula>
        <Body size={FT.body} style={{ marginTop: 14 }}>96 × 24 + 24</Body>
        <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.cyan, marginTop: 8 }}>{fmtInt(M.meta.params.shared)}</div>
        <K>每个预测步一套权重</K>
      </Card>
      <Card label="DLinear" accent={C.amber} style={{ flex: 1, height: 330 }}>
        <Formula size={34}>{"W_t, W_s ∈ R^(96×24)"}</Formula>
        <Body size={FT.body} style={{ marginTop: 14 }}>2 × (96 × 24 + 24)</Body>
        <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.amber, marginTop: 8 }}>{fmtInt(M.meta.params.dlinear)}</div>
        <K>趋势、季节各一条支路</K>
      </Card>
      <Card label="FITS" accent={C.violet} style={{ flex: 1, height: 330 }}>
        <Formula size={34}>{"W ∈ R^(48×48), b ∈ R^48"}</Formula>
        <Body size={FT.body} style={{ marginTop: 14 }}>48 × 48 + 48</Body>
        <div style={{ fontFamily: FONT.mono, fontSize: 56, color: C.violet, marginTop: 8 }}>{fmtInt(M.meta.params.fits)}</div>
        <K>4R² + 2R，R = 24</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Card label="数得出来，才验得动" accent={C.cyan} pad={20}>
        <Body size={FT.h2} color={C.ink}>
          参数不是从论文抄的，是形状算出来的；证据程序会对三个数逐个断言。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="实验设计写死" goal="切分、归一化、优化器、早停" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1120 }}>
      <Card label="一条样本的旅程" accent={C.cyan} style={{ height: 380 }}>
        <Step n="1" t="八条日线" d={fmtInt(M.data.dailyRows) + " 行"} />
        <Step n="2" t="时间八二开" d="前八成训练" />
        <Step n="3" t="实例标准化" d="减均值、除标准差" />
        <Step n="4" t="Adam 全批量" d={"lr " + M.meta.training.lr} />
        <Step n="5" t="早停" d={"耐心 " + M.meta.training.patience} />
        <Step n="6" t="反变换评分" d="MAE，单位元" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 350, width: CW - 1150 }}>
      <Stat label="日线面板" value={fmtInt(M.data.dailyRows)} accent={C.cyan} style={{ height: 150 }}
        sub={<span>{M.data.dailyFirst} → {M.data.dailyLast}</span>} />
      <Stat label="训练窗步长" value="2" accent={C.amber} style={{ height: 150, marginTop: 18 }} sub={<span>验证窗全用；最大 120 轮</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 770, width: CW }}>
      <Card label="第一个坑 · 早停比学习率更敏感" accent={C.coral} pad={20}>
        <Body size={FT.body}>
          线性模型对 lr 不算敏感；但早停早一轮、晚一轮，验证集排序就可能变。
          所以后面报的每个数，都带最优轮次，且早停看完整验证集，不看子集。
        </Body>
      </Card>
    </div>
  </>
);

const Step: React.FC<{ n: string; t: string; d: string }> = ({ n, t, d }) => (
  <div style={{ display: "flex", alignItems: "baseline", marginTop: 7 }}>
    <div style={{ width: 46, fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{n}</div>
    <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{t}</div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{d}</div>
  </div>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, pageAt("problem", 9), pageAt("problem", 19)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);