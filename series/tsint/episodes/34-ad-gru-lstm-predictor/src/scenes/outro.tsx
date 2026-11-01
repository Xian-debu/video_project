import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, det, fmtF, fmtInt, pageAt, Pages, Scene, SceneHead, Stat, Card, Row, Body, K, Chip } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 6)];
  const f1 = det("f1");
  const f5 = det("f5");
  const m1 = f1.spikeMean / f1.tau;
  const m5 = f5.spikeMean / f5.tau;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：四个读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1720 }}>
            <Body size={FT.h3} color={C.inkDim} style={{ marginBottom: 34, width: 1600 }}>
              这一集只留四个数。它们一起说明：稀释是真的，判据是假的，相位是共同的盲区。
            </Body>
            <div style={{ display: "flex", gap: 24 }}>
              <Stat label="F1 · F=1 → F=5" value={fmtF(f1.f1, 4) + " → " + fmtF(f5.f1, 4)} sub="计划的方向反了" accent={C.cyan} />
              <Stat label="信噪比" value={fmtF(m1, 2) + "× → " + fmtF(m5, 2) + "×"} sub="阈值追不上分数" accent={C.amber} />
              <Stat label="单点检出" value={f1.spike1.hit + "/" + f1.spike1.n} sub={"F=5 下 " + f5.spike1.hit + "/" + f5.spike1.n} accent={C.violet} />
              <Stat label="检查" value={M.meta.checks} sub={fmtInt(M.meta.elapsedSec) + " 秒跑完"} accent={C.cyan} />
            </div>
            <div style={{ marginTop: 30 }}>
              <K>一个门控单元，一条软记忆；稀释改变尺度，不改变排序。</K>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label={"第 " + M.next.episode + " 集 · 下一集"} accent={C.violet}>
              <Body size={FT.h3} color={C.ink} style={{ lineHeight: 1.5 }}>{M.next.title}</Body>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                历史窗还是一条定长的记忆。下一集换成注意力：让它自己决定看多远、看向哪里。
              </Body>
            </Card>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>状态 → 注意力</Chip>
              <Chip color={C.violet}>有限窗 → 加权窗</Chip>
              <Chip color={C.amber}>相位债还在</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 300, width: 580 }}>
            <Card label="整集回看" accent={C.cyan}>
              <Row name="01" value="问题" note="预测窗口，分数只看未来" width={530} />
              <Row name="02" value="两个单元" note="GRU 与 LSTM，手写反向传播" width={530} />
              <Row name="03" value="一次转向" note="从改历史到改真值" width={530} />
              <Row name="04" value="一个反例" note="计划说会掉，实测没掉" width={530} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
