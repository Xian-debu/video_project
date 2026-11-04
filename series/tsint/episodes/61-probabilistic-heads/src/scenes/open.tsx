import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, pagesOf } from "../shared";
import { CrossingBars, CrossingSchematic } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>这一集<br />换一个问法。</Body>
          <Body style={{ marginTop: 26 }}>
            不问明天涨多少，问它会落在哪。点预测只给一个数，分布预测给一条线；线上钉着若干分位点，每个点回答一件事：
            低于它的概率有多大。这一集就量这些点，以及它们会不会互相穿过。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="点预测" v="1 个数" color={C.inkDim} />
            <KV k="分布预测" v="1 条线" color={C.cyan} />
            <KV k="分位点" v="0.1 … 0.9" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一个窗口 · 同一个编码器 · 输出从数变成线" accent={C.cyan}>
            <CrossingSchematic width={950} height={322} />
          </Card>
        </div>
        <Foot>问题不是涨多少，是它会落在哪一段。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>为什么值得<br />单独讲一集。</Body>
          <Body style={{ marginTop: 26 }}>
            因为分位数之间有一个天然的次序：九成线必须在一成线上面。可如果九条线各自独立训练，它们并不知道彼此，
            区间就可能翻过来。交叉让区间失去意义，而修它要不要牺牲精度，是这一集真正要量的事。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="一件定义带来的麻烦" accent={C.coral} style={{ width: 1020 }}>
            <Row name="次序" value="天生有" note="九成线的值必须高于一成线，这是定义的一部分" width={972} color={C.cyan} valueW={280} />
            <Row name="独立训练" value="各说各话" note="每个分位只看自己的损失，不知道别的线在哪" width={972} color={C.coral} valueW={280} />
            <Row name="后果" value="区间翻转" note="上线掉到下线下面，宽度为负，没法解释" width={972} color={C.coral} valueW={280} />
            <Row name="修法代价" value="待量" note="如果接近零，就没有理由不加这个约束" width={972} color={C.amber} valueW={280} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6, width: 1000 }}>
            书里给的量级是百分之三到五。本集的第一件事，就是在这份数据上把这个数复现出来。
          </div>
        </div>
        <Foot>一个会说谎的区间，比没有区间更糟。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四个数，<br />先钉住。</Body>
          <Body style={{ marginTop: 26 }}>
            七百二十八个测试样本，九条分位线。交叉率三点三六一六，排序之后精确归零。pinball 损失只变了零点二六，
            证据程序跑完二点一八秒，十八项检查全过。这四个数合起来说一件事：顺序可以免费加上。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="样本" v={M.crossing.samples} color={C.inkDim} />
            <KV k="检查" v="18/18" color={C.cyan} />
            <KV k="代价" v={fmt2(Math.abs(M.pinball.relDelta) * 100, 2) + "%"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="交叉率" value={fmt2(M.crossing.rate * 100, 2) + "%"} sub="排序前 · 881 / 26,208" accent={C.coral} style={{ width: 240 }} valueColor={C.coral} />
            <Stat label="排序后" value="0" sub="精确的零 · 逆序对清零" accent={C.cyan} style={{ width: 240 }} valueColor={C.cyan} />
            <Stat label="pinball 变化" value={fmt2(M.pinball.relDelta * 100, 2) + "%"} sub="容差 2% · 几乎不动" accent={C.amber} style={{ width: 240 }} valueColor={C.amber} />
            <Stat label="证据耗时" value={fmt2(M.timing.seconds, 2) + " s"} sub="18 项检查 · 一条命令" accent={C.violet} style={{ width: 240 }} valueColor={C.violet} />
          </div>
          <Card label="交叉率：排序前与排序后" accent={C.cyan} style={{ marginTop: 16, width: 1020 }} pad={18}>
            <CrossingBars width={930} height={200} />
          </Card>
        </div>
        <Foot>顺序可以免费加上，精度几乎不掉。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>接下来<br />分八场。</Body>
          <Body style={{ marginTop: 26 }}>
            先摆问题，再给定义，然后钉数据、量交叉、写实现、过检查、讲边界，最后收束。每一屏的数字都能由仓库里的一条命令复现。
            看完整集，你能自己训九条分位线，也能自己量它们有没有交叉。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>259 行实现</Chip>
            <Chip color={C.amber}>18 项检查</Chip>
            <Chip color={C.violet}>纯函数 · 无随机</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="八场路线" accent={C.cyan} style={{ width: 1020 }} pad={16}>
            {[
              { n: "01", tag: "问题", title: "一个数不够", note: "线为什么会交叉", color: C.cyan },
              { n: "02", tag: "定义", title: "损失 · 次序 · 分布", note: "pinball、重排、高斯头", color: C.cyan },
              { n: "03", tag: "数据", title: "6,599 / 400 / 728", note: "序列、拟合、测试与覆盖率", color: C.cyan },
              { n: "04", tag: "度量", title: "3.3616% 到零", note: "交叉率、代价、NLL", color: C.cyan },
              { n: "05", tag: "实现", title: "三个模块 259 行", note: "损失、排序、解析梯度", color: C.cyan },
              { n: "06", tag: "验证", title: "十八项全过", note: "黄金值、逆序对、锚点", color: C.cyan },
              { n: "07", tag: "边界", title: "交叉率是设定的函数", note: "换窗口就换数", color: C.coral },
              { n: "08", tag: "收束", title: "从分布到异常", note: "下一集：异常检测", color: C.violet },
            ].map((r) => (
              <div key={r.n} style={{ display: "flex", alignItems: "baseline", borderTop: "1px solid " + C.panelLine, padding: "11px 0" }}>
                <div style={{ width: 170, flexShrink: 0, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
                  {r.n} {r.tag}
                </div>
                <div style={{ width: 430, flexShrink: 0, fontFamily: FONT.sans, fontSize: FT.h2, color: r.color, lineHeight: 1.25 }}>{r.title}</div>
                <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.note}</div>
              </div>
            ))}
          </Card>
        </div>
        <Foot>先从一个具体的困境说起。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);