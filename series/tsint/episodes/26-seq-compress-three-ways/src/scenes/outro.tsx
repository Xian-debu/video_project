import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Chip, Verdict } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 6)];
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1180 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 86, lineHeight: 1.32, color: C.ink }}>
              压缩不只是省算力，
              <br />
              还顺手做了正则。
            </div>
            <div style={{ marginTop: 40 }}>
              <Row name="三句话" value="奇偶无损 · 96 参数最准" note="尖峰上差距更大；三条路各有各的丢法" width={1120} />
              <Row name="下一集" value="序列分解与周期对齐" note="STL 与傅里叶：趋势、季节、残差" width={1120} />
              <Row name="本集证词" value="压得最狠的，反而最准" note={"证据 " + M.meta.checks.ok + "/" + M.meta.checks.total + "，零失败"} color={C.cyan} width={1120} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1330, top: 380, width: 518 }}>
            <Card label="交付" accent={C.cyan} style={{ width: 518 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="实现" />
                <Verdict ok label="证据" />
                <Verdict ok label="成片" />
              </div>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 16 }}>第 26 集 · 完</Mono>
            </Card>
            <Card label="编号" accent={C.amber} style={{ width: 518, marginTop: 24 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.ink }}>E26 / 74</div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: CW }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 96, color: C.ink }}>第 26 集，完。</div>
            <Body style={{ marginTop: 20, maxWidth: 1400 }} size={FT.h2}>
              下一集，把一条序列拆成趋势、季节、残差，看周期对齐能不能救回被压缩丢掉的信息。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
