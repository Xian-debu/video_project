import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, fmtF, fmtInt, lf } from "../shared";

/* 开场：从「结构定死」到「自己决定看哪里」，四个数字。 */

const Metric: React.FC<{ label: string; value: string; note: string; color: string; width: number }> = ({ label, value, note, color, width }) => (
  <Card label={label} accent={color} style={{ width, height: 258 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 56, color, lineHeight: 1.05, letterSpacing: -1.5, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <Body size={FT.meta} style={{ marginTop: 14 }}>{note}</Body>
  </Card>
);

export const SOpen: React.FC = () => {
  const m = M;
  const p = m.attn.softmax123;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.3, 0.6, 0.86]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            前面九集都在给序列做变换；这一集换一个问题：谁该看谁。
          </div>
          <Build at={lf("open", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Card label="上一集 · 结构定死" accent={C.inkFaint} style={{ width: 874, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>固定邻域</div>
                <Body style={{ marginTop: 16 }}>多层感知机看整个窗口，时间卷积看核覆盖的那一段。谁能看见谁，写死在结构里。</Body>
                <K style={{ display: "block", marginTop: 16 }}>E09 · 式 (2.46) (2.62)</K>
              </Card>
              <Card label="这一集 · 权重自己学" accent={C.cyan} style={{ width: 876, height: 320 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>注意力</div>
                <Body style={{ marginTop: 16 }}>每个位置算出一行权重，决定自己要看序列里的哪些位置。权重是参数，不是结构。</Body>
                <K style={{ display: "block", marginTop: 16 }}>式 (2.65) · p.35</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 676, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "20px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>一行式子，三件事：归一化、选择、可解释。</div>
              <K style={{ display: "block", marginTop: 8 }}>前两件能钉死，第三件才是这一集的演示核心</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            四个数，看到结尾你都能对上。
          </div>
          <Build at={lf("open", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Metric label="softmax 三项" value={fmtF(p[0], 4)} note={"另外两项 " + fmtF(p[1], 4) + " / " + fmtF(p[2], 4)} color={C.cyan} width={432} />
              <Metric label="行和偏差" value={fmtE(m.attn.rowsumDev, 2)} note="十六行，每行权重之和减一" color={C.violet} width={432} />
              <Metric label="复制任务偏差" value={fmtF(m.attn.copyDev, 4)} note="三百步后，注意力矩阵与单位阵的平均距离" color={C.amber} width={432} />
              <Metric label="置换等变差值" value="0" note="没有位置编码，打乱输入输出跟着换" color={C.coral} width={432} />
            </div>
          </Build>
          <Build at={lf("open", 0.42)}>
            <div style={{ position: "absolute", left: PAD, top: 640, display: "flex", gap: 24 }}>
              <Card label="合成 · 复制任务" accent={C.cyan} style={{ width: 874, height: 200 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.cyan }}>{fmtInt(m.data.windows.copyTrain)} + {m.data.windows.copyTest} 条</div>
                <Body style={{ marginTop: 10 }}>训练 + 测试，16 步 × 8 维内容拼 16 维位置码。</Body>
              </Card>
              <Card label="真实 · 日线窗口" accent={C.violet} style={{ width: 876, height: 200 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.h1, color: C.violet }}>{m.data.windows.real600519} / {m.data.windows.real000001} 窗</div>
                <Body style={{ marginTop: 10 }}>茅台与上证那只票，16 × 8 收益率窗口，只看对齐诊断量。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里只给了这一行，其余全是自己定的。
          </div>
          <Build at={lf("open", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={62} style={{ color: C.ink }}>Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V</Formula>
              <K style={{ display: "block", marginTop: 14 }}>式 (2.65) · 第二章 p.35</K>
            </div>
          </Build>
          <Build at={lf("open", 0.7)}>
            <div style={{ position: "absolute", left: PAD, top: 480, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>归一化：行和 = 1</Chip>
              <Chip color={C.violet}>选择：分数高权重大</Chip>
              <Chip color={C.amber}>可解释：矩阵能画出来</Chip>
              <Chip color={C.coral}>代价：T² 个分数</Chip>
            </div>
          </Build>
          <Build at={lf("open", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 596, width: 1776 }}>
              <Stat label="检查与测试" accent={C.cyan} value={m.meta.checks.total + " 项检查 · " + m.meta.tests.attention + " 条断言"} sub={"零失败；全仓 " + m.meta.tests.suites + " 组 / " + m.meta.tests.asserts + " 条断言全绿"} valueColor={C.ink} style={{ height: 188 }} />
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
