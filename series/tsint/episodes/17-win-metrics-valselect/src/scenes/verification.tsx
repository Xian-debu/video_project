import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, LinePlot, M, PAD, Pages, Row, Stat, Verdict, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="窗口与切分，逐条数" goal="二十四项检查全过" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 22 }}>
      <Stat label="滑窗总数" value={fmtInt(M.windows.total)} accent={C.cyan} style={{ flex: 1, height: 230 }}
        sub={<span>3,880 − 96 − 24 + 1</span>} />
      <Stat label="训练段" value={fmtInt(M.windows.train)} accent={C.cyan} style={{ flex: 1, height: 230 }}
        sub={<span>2,328 − 120 + 1</span>} />
      <Stat label="验证段" value={fmtInt(M.windows.val)} accent={C.amber} style={{ flex: 1, height: 230 }}
        sub={<span>776 − 120 + 1</span>} />
      <Stat label="测试段" value={fmtInt(M.windows.test)} accent={C.coral} style={{ flex: 1, height: 230 }}
        sub={<span>728 − 120 + 1</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 640, width: CW }}>
      <Row name="黄金窗口 · 1..10，H=3，F=2" value="6 个，起点 0..5" color={C.cyan} width={CW} />
      <Row name="覆盖不变量" value="每个窗口落在自己段内" color={C.violet} width={CW} />
      <Row name="无泄漏" value="训练与验证无交集" color={C.violet} width={CW} />
      <Row name="三段之和" value="2,209 + 657 + 609 = 3,475" note="加两道 24 帧和零头，回到 3,761" color={C.inkFaint} width={CW} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 860, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        窗口、切分、覆盖、泄漏，四组断言都钉在真实帧数上。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="指标算术，手算能对上" goal="真值 2,4,6 · 预测 3,4,5" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 860 }}>
      <Card label="一组残差 · 四个读数" accent={C.cyan} style={{ height: 400 }}>
        <Row name="MAE · 式(3.5)" value="0.666667" note="(1+0+1)/3" color={C.cyan} width={860 - 48} />
        <Row name="MSE · 式(3.6)" value="0.666667" note="(1+0+1)/3" color={C.violet} width={860 - 48} />
        <Row name="RMSE · 式(3.8)" value="0.816497" note="√(2/3)" color={C.amber} width={860 - 48} />
        <Row name="MAPE · 式(3.7)" value="22.2222%" note="(50+0+16.67)/3" color={C.coral} width={860 - 48} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 890, top: 340, width: CW - 890 }}>
      <Card label="三条恒等与边界" accent={C.violet} style={{ height: 400 }}>
        <Row name="完美预测" value="四个全 0" note="x = x̂ 时精确零" color={C.cyan} width={CW - 890 - 48} />
        <Row name="整体乘十" value="MAPE 不变" note="相对量对尺度不敏感" color={C.violet} width={CW - 890 - 48} />
        <Row name="长度不等" value="Left" note="返回错误，不截断" color={C.coral} width={CW - 890 - 48} />
        <Body size={FT.body} style={{ marginTop: 16 }}>
          断言不是比大小，是拿笔能算出来的数。四个指标全部手算核对过。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        分母、开方、计数，每一处都单独测。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="零值：三个答案" goal="真值 0,1,2 · 预测 1,1,1" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 24 }}>
      <Card label="MapeRaw · 默认" accent={C.coral} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.coral }}>Inf</div>
        <Body size={FT.meta} style={{ marginTop: 8 }}>照式直除，零作分母</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          不悄悄换数，让失效暴露出来。读数不是可用读数。
        </Body>
      </Card>
      <Card label="MapeSkip" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.amber }}>25.0%</div>
        <Body size={FT.meta} style={{ marginTop: 8 }}>跳过真值为零的那一对</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          三项里只有两项参与，metMapeCount 等于二。
        </Body>
      </Card>
      <Card label="MapeEps 1e-8" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.violet }}>3.33e9</div>
        <Body size={FT.meta} style={{ marginTop: 8 }}>分母加一个极小值</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          数字最刺眼，也最容易被误读成一个正常读数。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Row name="默认策略" value="MapeRaw" note="照书；另两个必须显式传" color={C.coral} width={CW} />
      <Row name="计数" value="3 / 2" note="参与 MAE 的项数与参与 MAPE 的项数" color={C.inkFaint} width={CW} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 870, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三个数都写在测试里。谁改了默认，测试立刻红。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="训练曲线与早停" goal="最优一轮才作数" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1100 }}>
      <LinePlot
        width={1100}
        height={520}
        series={[
          { values: M.training.curve.map((p) => p.train), color: C.cyan, name: "训练损失" },
          { values: M.training.curve.map((p) => p.val), color: C.amber, name: "验证损失" },
        ]}
        yFmt={(v) => v.toFixed(3)}
        title={"逐轮损失 · 合成数据 · 共 " + String(M.training.epochsRun) + " 轮"}
        vlines={[{ i: Math.max(0, M.training.bestEpoch - 1), color: C.violet, label: "最优第 " + String(M.training.bestEpoch) + " 轮" }]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1140, top: 340, width: CW - 1140, display: "flex", flexDirection: "column", gap: 16 }}>
      <Stat label="梯度相对误差" value={"1.41e−11"} accent={C.cyan} style={{ height: 130 }}
        sub={<span>中心差分，门槛 1e-6</span>} />
      <Stat label="早停最优轮" value={String(M.training.earlyStopBest)} accent={C.amber} style={{ height: 130 }}
        sub={<span>单元测试场景，耐心 10</span>} />
      <Stat label="端到端最优" value={String(M.training.bestEpoch) + " / " + String(M.training.epochsRun)} accent={C.violet} style={{ height: 130 }}
        sub={<span>恢复这一轮的权重</span>} />
      <Stat label="参数量" value={String(M.training.params)} accent={C.coral} style={{ height: 130 }}
        sub={<span>H·F + F = 8·4 + 4</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 890, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        恢复的是验证损失最低那一轮的权重，不是最后一步。
      </Body>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="选模与总账" goal="二十四项，零失败" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 22 }}>
      <Stat label="证据检查" value={String(M.meta.checks.ok) + " / " + String(M.meta.checks.total)} accent={C.cyan} style={{ flex: 1, height: 230 }}
        sub={<span>数据、结构、行为三层</span>} />
      <Stat label="测试套件" value={fmtInt(M.meta.tests.suites)} accent={C.violet} style={{ flex: 1, height: 230 }}
        sub={<span>断言 {fmtInt(M.meta.tests.asserts)}</span>} />
      <Stat label="选模 · MAPE" value={M.synthetic.mapePick} accent={C.amber} style={{ flex: 1, height: 230 }}
        sub={<span>{fmtF(M.synthetic.valMul102Mape, 4)}% 对 {fmtF(M.synthetic.valAdd5Mape, 4)}%</span>} />
      <Stat label="选模 · MAE" value={M.synthetic.maePick} accent={C.coral} style={{ flex: 1, height: 230 }}
        sub={<span>{fmtF(M.synthetic.add5Mae, 2)} 对 {fmtF(M.synthetic.mul102Mae, 2)}</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 650, width: CW }}>
      <Row name="valSelect 规则" value="分数升序" note="同分按标签字典序" color={C.violet} width={CW} />
      <Row name="测试集" value="只碰一次" note="选完才打开" color={C.coral} width={CW} />
      <Row name="窗口覆盖" value="3,761 个，零重叠" note="三段 + 两道空" color={C.cyan} width={CW} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        五个断言组，二十四项检查，零失败。每个数都能在证据包里查到。
      </Body>
      <div style={{ marginTop: 14, display: "flex", gap: 14, alignItems: "center" }}>
        <Chip color={C.cyan}>evidence 24 / 24</Chip>
        <Verdict ok label="全部通过" />
        <K>commit 2229df0 · data commit 5e63b2f</K>
      </div>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, 6 / 34, 12 / 34, 18 / 34, 26 / 34]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
