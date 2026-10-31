import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, K, M, PAD, Scene, SceneHead, Stat, fmtE, fmtF, lf } from "../shared";

/* 收尾：四个数字，一句主线，下一集。 */

export const SOutro: React.FC = () => {
  const m = M;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <div style={{ position: "absolute", left: PAD, top: 226, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
        四个数字，一句话：一次 softmax，把对齐变成了可以看的矩阵。
      </div>
      <Build at={lf("outro", 0.04)}>
        <div style={{ position: "absolute", left: PAD, top: 300, display: "flex", gap: 18 }}>
          <Stat label="softmax 三项" accent={C.cyan} value={m.attn.softmax123.map((v) => fmtF(v, 2)).join(" · ")} sub="归一化，行和为 1" valueColor={C.cyan} style={{ width: 427, height: 250 }} valueSize={56} />
          <Stat label="行和偏差" accent={C.violet} value={fmtE(m.attn.rowsumDev, 1)} sub="十六行，最大偏差" valueColor={C.violet} style={{ width: 427, height: 250 }} valueSize={56} />
          <Stat label="复制任务偏差" accent={C.amber} value={fmtF(m.attn.copyDev, 4)} sub="三百步后，与单位阵的平均距离" valueColor={C.amber} style={{ width: 427, height: 250 }} valueSize={56} />
          <Stat label="置换等变差值" accent={C.coral} value="0" sub="没有位置编码，顺序毫无意义" valueColor={C.coral} style={{ width: 427, height: 250 }} valueSize={56} />
        </div>
      </Build>
      <Build at={lf("outro", 0.16)}>
        <div style={{ position: "absolute", left: PAD, top: 606, width: 1776 }}>
          <Card label="下一集" accent={C.violet} style={{ width: 1776, height: 260 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>循环神经网络 · LSTM · GRU：把时间写进隐藏状态</div>
            <Body style={{ marginTop: 12 }}>注意力让每个位置自己决定看哪里；下一集换一条路，让状态带着过去往前走。</Body>
            <K style={{ display: "block", marginTop: 12 }}>E11 · rnn-lstm-gru · 第 2 章 / 数据层</K>
          </Card>
        </div>
      </Build>
    </Scene>
  );
};
