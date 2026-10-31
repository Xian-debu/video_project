import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, M, PAD, Pages, Row, Stat, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="07 / 收束" title="三句话带走" goal="因果、感受野、周期" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 22 }}>
      <Card label="一 · 因果" accent={C.cyan} style={{ flex: 1, height: 420 }}>
        <Body size={FT.h2} color={C.ink}>靠左填充，不靠损失函数。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          右侧一个都不补；扰动测试逐位为零，才算真的没看未来。
        </Body>
        <div style={{ marginTop: 14 }}><Stat label="前九十行差" value="0" accent={C.cyan} sub={<span>扰动前的输出完全不变</span>} /></div>
      </Card>
      <Card label="二 · 感受野" accent={C.amber} style={{ flex: 1, height: 420 }}>
        <Body size={FT.h2} color={C.ink}>是层次累加，不是核宽相乘。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          四层、核宽三、膨胀一二四八：1 + 2 + 4 + 8 + 16 = {M.meta.rf}。
        </Body>
        <div style={{ marginTop: 14 }}><Stat label="感受野" value={M.meta.rf} accent={C.amber} sub={<span>滞后 31 处的扰动是零</span>} /></div>
      </Card>
      <Card label="三 · 周期" accent={C.violet} style={{ flex: 1, height: 420 }}>
        <Body size={FT.h2} color={C.ink}>让 FFT 说话。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          四十八根是一天，二十四根是半天；周周期没出现，就老实说没出现。
        </Body>
        <div style={{ marginTop: 14 }}><Row name="第一峰" value="48 根" note={"振幅 " + M.spectrum.top1.toFixed(3)} color={C.violet} width={420} /></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 810, width: CW }}>
      <Body size={FT.lead} color={C.ink}>三个先验，三个能被测试钉死的定义。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="07 / 收束" title="证据、数据、清单，全部进版本库" goal="下一集回到注意力" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1120 }}>
      <Card label="第 20 集交付" accent={C.cyan}>
        <Row name="算法模块" value="3 个" note="卷积、频率、聚合，互不导入" color={C.cyan} width={1060} />
        <Row name="检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} note="零失败，全部进证据 JSON" color={C.cyan} width={1060} />
        <Row name="测试" value={fmtInt(M.meta.tests.suites) + " 套件"} note={fmtInt(M.meta.tests.asserts) + " 个断言"} color={C.amber} width={1060} />
        <Row name="数据" value={fmtInt(M.data.minuteRows) + " 根"} note={M.data.days + " 个交易日，sha256 " + M.data.sha256.slice(0, 8) + "…"} color={C.violet} width={1060} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 350, width: CW - 1150 }}>
      <Card label="下一集" accent={C.violet} style={{ height: 340 }}>
        <Body size={FT.h2} color={C.ink}>注意力：分块与掩码。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          先验从「局部」变成「两两相关」；因果掩码、多头拆分、分块计算。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.violet}>E21 · attn-mhsa-block-masked</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink }}>第 20 集完</div>
        <Chip color={C.cyan}>tsint · 卷积</Chip>
        <K>证据提交 {M.meta.tsBaseCommit.slice(0, 7)}</K>
      </div>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, pageAt("outro", 5)]}>
    <P1 />
    <P2 />
  </Pages>
);
