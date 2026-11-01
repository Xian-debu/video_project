import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, Formula, PairBar, Chip } from "../shared";

/** 十根错位的窗口条：一根竖线穿过所有条，表示同一个点被十个窗口覆盖。 */
const Overlap: React.FC = () => {
  const n = 10;
  return (
    <div style={{ position: "relative", width: 620, height: n * 26 + 60, marginTop: 6 }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: i * 34, top: i * 26, width: 300, height: 10, borderRadius: 3,
          background: C.cyan, opacity: 0.32 + 0.05 * i,
        }} />
      ))}
      <div style={{ position: "absolute", left: 392, top: -4, width: 1, height: n * 26 - 10, background: C.coral, opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 0, top: n * 26 + 16, fontFamily: FONT.mono, fontSize: FT.micro, color: C.coral }}>竖线处同一个点：10 个窗口都在场</div>
    </div>
  );
};

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 22), pageAt("intuition", 44)];
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：重叠算术与标签密度 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1050 }}>
            <Card label="重叠 · 一个点进十个窗" accent={C.cyan}>
              <Body size={FT.body}>
                窗长 100，步长 10。每个点被十个窗口覆盖；反过来，一个窗口的标签，是窗内一百个点的并集。
              </Body>
              <Overlap />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="算一下" accent={C.cyan} pad={20}>
              <Formula size={44} note="C ÷ s：一个点被几个窗口覆盖">C / s = 100 / 10 = 10</Formula>
            </Card>
            <Card label="注入" accent={C.amber} pad={20} style={{ marginTop: 18 }}>
              <Row name="点数" value={M.inject.points + " 个"} note="占全序列 1%" width={590} />
              <Row name="段数" value={M.inject.segments + " 段"} note="每段 1–3 个点，5–10 sigma" width={590} />
              <Row name="带标签窗口" value={M.labels.windows + " / " + M.window.count} note="并集一叠，就连成片" width={590} color={C.coral} />
            </Card>
            <div style={{ marginTop: 20 }}>
              <PairBar
                a={{ label: "点级异常率", value: 1, text: "1.00%" }}
                b={{ label: "窗口正样本率", value: Math.round(M.labels.rate * 100), text: (M.labels.rate * 100).toFixed(2) + "%" }}
                width={620} height={120} max={100} colorB={C.coral}
              />
              <Body size={FT.meta} style={{ marginTop: 14 }}>
                百分之一的异常，换来一半以上的正窗口 —— 窗口级 F1 到这个密度就不可用，必须先折叠。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：折叠与精度天花板 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <Card label="折叠 · 586 窗 → 5,950 点" accent={C.cyan}>
              <Row name="折叠规则" value="任一窗标它 → 点异常" note="并集，不投票" width={950} />
              <Row name="选窗" value={"分数最高的 1% = " + M.labels.k + " 窗"} note="586 × 1% = 5.86，取六" width={950} />
              <Row name="折叠点数" value={M.labels.foldedMse + " 点"} note="六个相邻的百日窗叠成一段 150 点" width={950} />
              <Row name="真阳性" value="8 点" note="60 个注入点里只抓到 8 个" width={950} color={C.cyan} />
              <Row name="精度" value={"8 / 150 = " + fmtF(M.scores.mse.p, 4)} note="和重构口径的精度对上" width={950} />
              <Row name="召回" value={"8 / 60 = " + fmtF(M.scores.mse.r, 4)} width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 300, width: 680 }}>
            <Card label="精度的天花板" accent={C.amber} pad={22}>
              <div style={{ fontFamily: FONT.mono, fontSize: 76, color: C.amber, lineHeight: 1.05 }}>8 / 150</div>
              <Body size={FT.body} style={{ marginTop: 14 }}>
                预测是一整段一百五十点，真实异常一段只有一到三点。段越粗，精度越低 —— 这是窗口粗粒度的代价，不是模型的错。
              </Body>
            </Card>
            <Card label="预测口径不一样" accent={C.violet} pad={22} style={{ marginTop: 20 }}>
              <Row name="折叠" value={M.labels.foldedPred + " 点"} note="六个窗彼此错开，叠出 540 点" width={630} />
              <Row name="真阳性" value={"19 点"} note="19 / 540 = 3.52%" width={630} />
              <Row name="召回" value="19 / 60 = 31.67%" width={630} />
              <Body size={FT.meta} style={{ marginTop: 12 }}>所以召回高、精度低 —— 这是口径的差别，不是模型的能力。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：范围口径归零 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <Card label="范围口径为什么是零" accent={C.coral}>
              <Row name="预测" value="1 段 × 150 点" note="六个窗叠成一段" width={950} />
              <Row name="真实异常" value={M.inject.segments + " 段 × 1–3 点"} note="四十四段" width={950} />
              <Row name="覆盖比例" value="每段 < 2%" note="远小于 α = 0.2" width={950} />
              <Row name="预测段命中" value="0" note="没有一段盖够，精度就是 0" width={950} color={C.coral} />
              <Row name="召回" value={"4 / 44 = " + fmtF(M.scores.mse.rr, 4)} note="四段异常整个落在预测区间里" width={950} color={C.cyan} />
              <Row name="F1" value={fmtF(M.scores.mse.rf1, 4)} note="精度是零，F1 就是零" width={950} color={C.coral} />
            </Card>
            <div style={{ marginTop: 22 }}>
              <Body size={FT.meta}>召回还有一点，但它救不了 F1：范围口径先问“预测段对不对”，再问“盖住多少”。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 300, width: 680 }}>
            <Card label="三个口径，三种死法" accent={C.amber} pad={22}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <Chip color={C.cyan}>逐点</Chip>
                  <Body size={FT.body} style={{ marginTop: 6 }}>精度撞天花板：段越粗，分母越大，真阳性只有 8 个。</Body>
                </div>
                <div>
                  <Chip color={C.amber}>预测</Chip>
                  <Body size={FT.body} style={{ marginTop: 6 }}>精度换召回：多抓 11 个点，预测点从 150 涨到 540，精度掉到三分之二。</Body>
                </div>
                <div>
                  <Chip color={C.coral}>范围</Chip>
                  <Body size={FT.body} style={{ marginTop: 6 }}>精度直接归零：段对段比不上，召回再高也换不回 F1。</Body>
                </div>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
