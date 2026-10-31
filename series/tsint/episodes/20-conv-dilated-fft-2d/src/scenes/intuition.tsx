import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Chip, Head, K, LinePlot, M, PAD, Pages, Row, Stat, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 直觉" title="感受野：三十一步，一步不多" goal="真实窗口上的一次扰动" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <Card label="扰动响应 · 归一化差值" accent={C.cyan} style={{ height: 420 }} pad={18}>
        <LinePlot
          series={[{ values: M.rf.points.map((p) => p.diff), color: C.cyan, name: "输出差值" }]}
          width={1080}
          height={330}
          title="横轴 = 滞后（扰动相对输出的位置差）"
          legend
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Card label="读数" accent={C.amber} style={{ height: 420 }}>
        <Row name="第一个零点" value={"滞后 " + M.rf.firstZero} note="再往后贴零" color={C.amber} width={CW - 1200} />
        <Row name="滞后 30 的差" value={M.rf.points[30].diff.toFixed(4)} note="还在动" color={C.cyan} width={CW - 1200} />
        <Row name="更早的滞后" value={M.struct.rfPastDiff === 0 ? "0" : M.struct.rfPastDiff.toExponential(1)} note="全零" color={C.inkDim} width={CW - 1200} />
        <Body size={FT.body} style={{ marginTop: 14 }}>
          感受野不是「核宽乘层数」，是每层（K − 1)d 的累加：1 + 2 + 4 + 8 + 16 = 31。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 820, width: CW }}>
      <Body size={FT.lead} color={C.ink}>三十一个抽头，一个不多，一个不少。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 直觉" title="因果性：前九十行逐位相同" goal="在第九十行加一个扰动" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <Card label="扰动后减去扰动前 · 每一行的输出值" accent={C.coral} style={{ height: 420 }} pad={18}>
        <LinePlot
          series={[{ values: M.causal.rows.map((r) => r.after - r.before), color: C.coral, name: "扰动后 − 扰动前" }]}
          width={1080}
          height={330}
          title="横轴 = 时间行；零表示逐位相同"
          legend
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Card label="两条断言" accent={C.cyan} style={{ height: 420 }}>
        <Stat label="逐位相同的行" value={M.causal.sameRows} accent={C.cyan} style={{ height: 120 }} sub={<span>扰动之前的输出完全不变</span>} />
        <Stat label="第九十五行的差" value={M.causal.diffAt95.toFixed(4)} accent={C.coral} style={{ height: 120, marginTop: 14 }} sub={<span>才开始传播</span>} />
        <Body size={FT.body} style={{ marginTop: 14 }}>
          这就是左填充的代价与收益：过去完全不泄露，邻近的未来才受影响。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 820, width: CW }}>
      <Body size={FT.lead} color={C.ink}>如果两侧都补零，前九十行也会变；离线误差可能一样，但那是作弊。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 直觉" title="周期：一峰四十八，二峰二十四" goal="|五分钟对数收益| 的功率谱" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <Card label="前六个周期 · 振幅归一化到一" accent={C.amber} style={{ height: 420 }} pad={18}>
        <Bars
          items={M.spectrum.peaks.map((p, i) => ({
            label: p.period + " 根",
            value: p.amp,
            text: p.amp.toFixed(3),
            color: i === 0 ? C.amber : i === 1 ? C.cyan : C.violet,
            dim: i > 1,
          }))}
          width={1080}
          max={M.spectrum.top1}
          rowH={50}
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Card label="物理尺度" accent={C.cyan} style={{ height: 420 }}>
        <Row name="48 根" value="一个交易日" note="日内周期" color={C.amber} width={CW - 1200} />
        <Row name="24 根" value="半个交易日" note="谐波" color={C.cyan} width={CW - 1200} />
        <Row name="4991 根" value="趋势" note="接近全样本长度" color={C.violet} width={CW - 1200} />
        <Body size={FT.body} style={{ marginTop: 12 }}>
          前三峰里没有周周期；第一峰只比第二峰高 {((M.spectrum.top1 / M.spectrum.top2 - 1) * 100).toFixed(1)}%。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 820, width: CW }}>
      <Body size={FT.lead} color={C.ink}>是的，日内周期是真的；但它强得有限。</Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 直觉" title="周周期：这份样本测不出来" goal="诚实边界，不是卷积的错" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <Card label="二百四十根在哪里" accent={C.coral} style={{ height: 380 }}>
        <Row name="排名" value={"第 " + M.spectrum.weekly240Rank + " 位"} note="不在前六" color={C.coral} width={1060} />
        <Row name="振幅" value={M.spectrum.weekly240Amp.toFixed(3)} note={"第一峰是 " + M.spectrum.top1.toFixed(3) + "，差一个数量级"} color={C.inkDim} width={1060} />
        <Row name="可用样本" value={M.data.days + " 个交易日"} note="大约二十周" color={C.inkDim} width={1060} />
        <Row name="结论" value="样本不够" note="不能把「测不出」说成「不存在」" color={C.amber} width={1060} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 340, width: CW - 1150 }}>
      <Card label="所以这一集只能讲结构" accent={C.cyan} style={{ height: 380 }}>
        <Body size={FT.h2} color={C.ink}>三张图说完，回到实现。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          先验本身可以被证明；它在某份数据上有没有用，是另一个问题。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          下一屏：空洞卷积怎么写，权重怎么排。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.cyan}>下一屏 · 实现</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>一百零四个交易日只有二十来周，周周期在这里没有统计基础。</Body>
    </div>
  </>
);

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, pageAt("intuition", 8), pageAt("intuition", 16), pageAt("intuition", 24)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
