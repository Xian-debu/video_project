import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Foot, KV, M, PAD, Pages, Scene, SceneHead, Stat, Verdict, checksOf, fmt2, fmt4, pagesOf } from "../shared";
import { F1Pair, ReconScores } from "../figs";

const CheckRows: React.FC<{ group: string }> = ({ group }) => (
  <div>
    {checksOf(group).map((c) => (
      <div key={c.name} style={{ display: "flex", alignItems: "center", borderTop: "1px solid " + C.panelLine, padding: "12px 0" }}>
        <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.meta, color: C.ink, lineHeight: 1.4 }}>{c.name}</div>
        <div style={{ width: 260, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{c.detail}</div>
        <div style={{ width: 78, textAlign: "right" }}><Verdict ok={c.ok} /></div>
      </div>
    ))}
  </div>
);

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>十九项<br />全过。</Body>
          <Body style={{ marginTop: 26 }}>
            数据 4 项、预测 5 项、重构 5 项、对照 5 项。零失败，用时 {M.timing.seconds.toFixed(2)} 秒。每一项都来自同一条命令，
            结果是 JSON 加一份逐行 checks.txt。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="通过" v={M.summary.passed + "/" + M.summary.total} color={C.cyan} />
            <KV k="失败" v={M.summary.failed} color={C.inkDim} />
            <KV k="耗时" v={fmt2(M.timing.seconds, 2) + " s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="检查总数" value={M.summary.total} sub="一条命令全部跑完" accent={C.cyan} style={{ width: 300 }} valueColor={C.ink} />
            <Stat label="失败" value={M.summary.failed} sub="没有一项失败" accent={C.coral} style={{ width: 300 }} valueColor={C.cyan} />
            <Stat label="证据耗时" value={fmt2(M.timing.seconds, 2) + " s"} sub="含 200 轮训练与扫描" accent={C.violet} style={{ width: 300 }} valueColor={C.violet} />
          </div>
          <Card label="四分组 · 逐项通过" accent={C.cyan} style={{ marginTop: 16, width: 960 }} pad={20}>
            <CheckGrid cell={26} />
          </Card>
        </div>
        <Foot>全过，才有资格说结论。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>尖峰<br />这一列。</Body>
          <Body style={{ marginTop: 26 }}>
            12 个尖峰，幅度 5 到 7 个标准差：预测残差 F1 0.7059，重构 0.0714，差近十倍。原因在前面已经埋好——
            残差逐点看，重构只错一个点。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="尖峰数" v={M.data.spikeCount} color={C.inkDim} />
            <KV k="预测 F1" v={fmt4(M.pred.spikeF1)} color={C.cyan} />
            <KV k="重构 F1" v={fmt4(M.recon.spikeF1)} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="尖峰上的两组分数" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <F1Pair kind="spike" width={950} height={200} />
          </Card>
          <Card label="预测组五项 · 全部通过" accent={C.cyan} style={{ marginTop: 16, width: 1010 }} pad={18}>
            <CheckRows group="pred" />
          </Card>
        </div>
        <Foot>尖峰上，残差赢得很干净。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>再看漂移<br />这一列。</Body>
          <Body style={{ marginTop: 26 }}>
            3 段各 60 点，共 180 个点：预测残差 F1 0.0914，重构 0.6199。漂移窗的平均重构分 2.750203，
            正常窗 1.013951，差 1.74 分。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="漂移点" v={M.data.driftPoints} color={C.inkDim} />
            <KV k="预测 F1" v={fmt4(M.pred.driftF1)} color={C.cyan} />
            <KV k="重构 F1" v={fmt4(M.recon.driftF1)} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="漂移上的两组分数" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <F1Pair kind="drift" width={950} height={200} />
          </Card>
          <Card label="重构分 · 正常窗口 vs 漂移窗口" accent={C.violet} style={{ marginTop: 16, width: 1010 }} pad={20}>
            <ReconScores width={950} height={165} />
          </Card>
        </div>
        <Foot>漂移上，重构赢得很清楚。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>五项<br />两项容易漏。</Body>
          <Body style={{ marginTop: 26 }}>
            同一初始化训一轮，参数逐位相同——证明训练是确定性的，不是「差不多」；扫描 6 档的 F1 与重新跑一遍的数一致——
            证明表格不是手抄的，也没有藏着的状态。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="对照组五项 · 全部通过" accent={C.amber} style={{ width: 1010 }} pad={18}>
            <CheckRows group="compare" />
          </Card>
          <Card label="重算一致性" accent={C.cyan} style={{ marginTop: 16, width: 1010 }} pad={20}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.9 }}>
              同种子 20201104 · 两次训练一轮 → 参数逐位相同（0 处差异）
              <br />
              阈值扫描 6 档 · 重算 F1 → 0.7059 与先前一致（无隐藏状态）
            </div>
          </Card>
        </div>
        <Foot>确定性也是可复现的一部分。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
