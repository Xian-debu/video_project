import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, CW, Card, Head, K, M, PAD, Pages, Row, Stat, Verdict, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第一层：恒等式" goal="必须是零，不是小于阈值" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 20 }}>
      <Stat label="RevIN 往返" value="0" accent={C.cyan} style={{ flex: 1, height: 230 }} sub={<span>revin → revinInv</span>} />
      <Stat label="仿射往返" value="0" accent={C.violet} style={{ flex: 1, height: 230 }} sub={<span>γ=1.7, β=−2 也还原</span>} />
      <Stat label="NowNorm 平移" value="0" accent={C.amber} style={{ flex: 1, height: 230 }} sub={<span>整条加一百，减回后相等</span>} />
      <Stat label="MeanNorm 单位层" value="0" accent={C.coral} style={{ flex: 1, height: 230 }} sub={<span>恒等线性层还原原序列</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 640, width: CW }}>
      <Row name="常数窗 · 五个五" value="归一化后全零" color={C.cyan} note="σ = 0，eps 兜底，输出 0 不是 NaN" />
      <Row name="常数窗反变换" value="还原 5.000000" color={C.violet} note="0 乘标准差不产生误差" />
      <Row name="末值定位 · x_T = 3" value="输出 3.000000" color={C.amber} note="线性层任意权重都不动末值" />
      <Row name="末值定位 · x_T = 0" value="输出 0" color={C.inkDim} note="基准为零时等于不归一化" />
      <div style={{ marginTop: 34 }}>
        <Body size={FT.lead} color={C.ink}>
          四个零、两个定位。往返是零，因为减掉再加回来没有理由留误差。
        </Body>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第二层：eps 与仿射" goal="零方差不许出无穷" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
      <Row name="方差一、eps 为零" value="还原 1.000000" color={C.cyan} note="口径对齐，总体方差除以 H" />
      <Row name="eps 一万分之一" value={"差 " + fmtF(M.norm.eps, 5)} color={C.amber} note="开方后的相对差更小" />
      <Row name="零方差窗" value="0 / 0 被兜住" color={C.violet} note="eps 让分母不为零" />
      <Row name="γ = 0 的反变换" value="不出 Inf" color={C.coral} note="反仿射保底，配置错误由文档说明" />
      <Row name="仿射默认关闭" value="γ=1, β=0" color={C.inkDim} note="关闭时与无仿射逐位相同" />
      <div style={{ marginTop: 34 }}>
        <Body size={FT.lead} color={C.ink}>
          这一层不测精度，只测定义域：零方差、零 gamma、关闭仿射。
        </Body>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 340, width: CW - 1020, display: "flex", flexDirection: "column", gap: 16 }}>
      <Stat label="MeanNorm 与 z-score 最大差" value={fmtF(M.norm.meanVsZscore, 4)} accent={C.violet} style={{ height: 170 }} sub={<span>只减不除，幅值保留</span>} />
      <Stat label="对照 RevIN 往返" value="0" accent={C.cyan} style={{ height: 170 }} sub={<span>仿射开也能精确反</span>} />
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第三层：量纲" goal="归一化后一样大，误差回去差三个数量级" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 20 }}>
      <Stat label="茅台 / 工行 均价" value={fmtF(M.data.levelRatio, 1) + "×"} accent={C.cyan} style={{ flex: 1, height: 220 }} sub={<span>{fmtInt(M.data.maotaiMean)} 对 {fmtF(M.data.icbcMean, 1)} 元</span>} />
      <Stat label="茅台 MAE · 无 / RevIN" value={fmtF(M.mae.scale.maotaiNone, 1) + " → " + fmtF(M.mae.scale.maotaiRev, 1)} accent={C.amber} valueSize={32} style={{ flex: 1, height: 220 }} sub={<span>元，二十四步</span>} />
      <Stat label="工行 MAE · 无 / RevIN" value={fmtF(M.mae.scale.icbcNone, 4) + " → " + fmtF(M.mae.scale.icbcRev, 4)} accent={C.violet} valueSize={32} style={{ flex: 1, height: 220 }} sub={<span>元，二十四步</span>} />
      <Stat label="归一化后输入比" value={fmtF(M.norm.normScaleRatio, 4)} accent={C.coral} style={{ flex: 1, height: 220 }} sub={<span>模型眼里两个序列一样大</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 620, width: CW }}>
      <Row name="量纲差的来源" value="后复权口径" color={C.cyan} note="未复权是三百二十倍，后复权是六百五十八点七" />
      <Row name="归一化做了什么" value="把输入压到同一尺度" color={C.violet} note="不是把误差也压小" />
      <Row name="误差为何还差三个数量级" value="反变换把量纲加回来了" color={C.amber} note="读数仍是元" />
      <div style={{ marginTop: 30 }}>
        <Body size={FT.lead} color={C.ink}>
          归一化解决的是「模型把大数当成大信号」，不是「数据变得可预测」。
        </Body>
      </div>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第四层：合成对比" goal="只换 base，排序翻转" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 900 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.amber, marginBottom: 10 }}>有漂移</div>
      <Bars
        width={860}
        max={2.2}
        items={[
          { label: "NowNorm", value: M.mae.drift.now, text: fmtF(M.mae.drift.now, 4), color: C.violet },
          { label: "MeanNorm", value: M.mae.drift.mean, text: fmtF(M.mae.drift.mean, 4), color: C.amber },
          { label: "RevIN", value: M.mae.drift.revin, text: fmtF(M.mae.drift.revin, 4), color: C.cyan },
        ]}
      />
      <div style={{ fontFamily: FONT.mono, fontSize: FT.label, color: C.violet, marginTop: 30, marginBottom: 10 }}>无趋势</div>
      <Bars
        width={860}
        max={2.2}
        items={[
          { label: "NowNorm", value: M.mae.flat.now, text: fmtF(M.mae.flat.now, 4), color: C.violet },
          { label: "MeanNorm", value: M.mae.flat.mean, text: fmtF(M.mae.flat.mean, 4), color: C.amber },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 980, top: 340, width: CW - 980, display: "flex", flexDirection: "column", gap: 16 }}>
      <Stat label="漂移组 · 末值领先" value={fmtF(M.mae.drift.mean / M.mae.drift.now, 2) + "×"} accent={C.amber} style={{ height: 150 }} sub={<span>{fmtF(M.mae.drift.now, 4)} 对 {fmtF(M.mae.drift.mean, 4)}</span>} />
      <Stat label="平稳组 · 均值领先" value={fmtF(M.mae.flat.now / M.mae.flat.mean, 2) + "×"} accent={C.violet} style={{ height: 150 }} sub={<span>{fmtF(M.mae.flat.mean, 4)} 对 {fmtF(M.mae.flat.now, 4)}</span>} />
      <Card label="结论" accent={C.coral}>
        <Body size={FT.body} color={C.inkDim}>
          不是模型变强了，是 base 的假设对上了数据的漂移结构。
        </Body>
      </Card>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="总账" goal="二十八项，零失败" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 20 }}>
      <Stat label="证据检查" value={M.artifacts.checksPassed + " / " + M.meta.checks.total} accent={C.cyan} style={{ flex: 1, height: 210 }} sub={<span>数据、结构、行为三层</span>} />
      <Stat label="测试套件" value={fmtInt(M.meta.tests.suites)} accent={C.violet} style={{ flex: 1, height: 210 }} sub={<span>断言 {fmtInt(M.meta.tests.asserts)}</span>} />
      <Stat label="指数 MAE · 末值 / RevIN / 均值" value={fmtF(M.mae.index.now, 1) + " / " + fmtF(M.mae.index.revin, 1)} accent={C.amber} valueSize={28} style={{ flex: 1, height: 210 }} sub={<span>均值 {fmtF(M.mae.index.mean, 1)}</span>} />
      <Stat label="成交量 · 两种归一化差" value={fmtF(((M.mae.volume.mean - M.mae.volume.now) / M.mae.volume.now) * 100, 1) + "%"} accent={C.coral} style={{ flex: 1, height: 210 }} sub={<span>归一化不是万灵药</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 610, width: CW }}>
      <Row name="data 组" value="4 / 4" color={C.cyan} note="行数、日期、后缀、量纲" />
      <Row name="struct 组" value="4 / 4" color={C.violet} note="窗口切分与统计量独立" />
      <Row name="behavior 组" value="20 / 20" color={C.amber} note="往返、平移、排序、量纲" />
      <div style={{ marginTop: 30 }}>
        <Body size={FT.lead} color={C.ink}>
          二十八个检查全部通过，每个数都能在证据包里查到。
        </Body>
        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <Verdict ok={true} label={"evidence " + M.artifacts.checksPassed + " / " + M.meta.checks.total} />
          <K>commit {M.artifacts.evidenceCommit} · data {M.meta.dataCommit}</K>
        </div>
      </div>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, 0.182, 0.369, 0.543, 0.777]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
