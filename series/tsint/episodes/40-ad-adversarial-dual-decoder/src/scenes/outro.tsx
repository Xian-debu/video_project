import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, modelKeys, modelColor, modelShort, pagesOf, Pages, Scene, SceneHead,
  Card, Row, Body, Stat, Verdict, Chip, fmtInt,
} from "../shared";

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：一个读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              四个都不到
              <br />
              零点二五。
            </div>
            <Body style={{ marginTop: 26, width: 840 }}>
              书里三句话，实测三种失败：对抗会抖，能量分不开，集成在测试段失灵。四个读数摆在一起，没有一个能当检测器用。
              但每一种失败都指出了一个具体的问题，下一集就从这些问题接着走。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.evidence.checks + " 项证据检查通过"} />
              <Chip color={C.amber}>状态：{M.meta.progress.delivered} / {M.meta.progress.total} · 未发布</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 292, width: 830, display: "flex", flexDirection: "column", gap: 16 }}>
            {modelKeys.map((k) => (
              <Card key={k} label={modelShort[k]} accent={modelColor[k]} pad={18}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: 40, color: modelColor[k], fontVariantNumeric: "tabular-nums" }}>{md(k).f1.toFixed(4)}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>F1 · 报警 {md(k).tp + md(k).fp} · 阈值 {md(k).tau.toFixed(3)}</div>
                </div>
              </Card>
            ))}
          </div>
        </AbsoluteFill>

        {/* 页二：账本 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              这一集的账本
            </div>
            <div style={{ marginTop: 26 }}>
              <Row name="新增测试" value={M.meta.newCases + " 条"} note="USAD 9 · DAGMM 10 · 集成 7" />
              <Row name="仓库合计" value={fmtInt(M.meta.tests.assertions) + " 条"} note={M.meta.tests.suites + " 套"} />
              <Row name="证据检查" value={M.meta.evidence.checks + " 项"} note={M.meta.evidence.seconds.toFixed(1) + " 秒跑完"} />
              <Row name="本集进度" value={M.meta.progress.delivered + " / " + M.meta.progress.total} note={"全系列第 " + Number(M.meta.episode.slice(0, 2)) + " 集"} />
            </div>
            <div style={{ marginTop: 18 }}>
              <Chip color={C.amber}>状态：{M.meta.progress.delivered} / {M.meta.progress.total} · 未发布</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="下一集" accent={C.cyan} pad={26}>
              <Body style={{ fontSize: FT.body, color: C.ink, lineHeight: 1.6 }}>
                {M.meta.next.title}
              </Body>
              <Body style={{ fontSize: FT.meta, marginTop: 12 }}>
                SPADE 的少样本先验、DualAttention 的双向加权。预估 {M.meta.next.minutes} 分钟。
              </Body>
            </Card>
            <Body style={{ marginTop: 22, color: C.inkDim }}>
              四个读数，一个结论：判据写得越短，藏在里面的口径越多。这一集到这里，我们下次见。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
