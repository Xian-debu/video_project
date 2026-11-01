import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, LinePlot, Chip, Verdict } from "../shared";

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 5), pageAt("verification", 13), pageAt("verification", 24)];
  const loss = M.curves.loss;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Stat label="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="四组：数据 7 · 递归 13 · 分段 11" style={{ width: 560, height: 230 }} />
              <Stat label="测试套件" value={M.meta.tests.suites + " 套"} sub={M.meta.tests.asserts + " 条断言，零失败"} accent={C.amber} style={{ width: 560, height: 230 }} />
              <Stat label="新增" value={M.meta.tests.rnn + " + " + M.meta.tests.segrnn} sub="递归 13 条，分段 15 条断言" accent={C.violet} style={{ width: 560, height: 230 }} />
            </div>
            <div style={{ marginTop: 60 }}>
              <Row name="复现命令" value="tsbase evidence-ch03-rnn" note="--data / --out / --evidence，一条命令重跑全部" width={1700} />
              <Row name="种子" value="25" note="数据、初始化、小批量顺序全部确定" width={1700} />
              <Row name="耗时" value={M.meta.durationSec.toFixed(1) + " s"} note="递归 214 s，分段 54 s，其余是数据与评测" width={1700} />
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 900 }}>
            <Card label="数据" accent={C.cyan} style={{ width: 900, height: 560 }}>
              <Row name="行数" value={M.meta.data.rows.toLocaleString("en-US")} note={M.meta.data.start + " → " + M.meta.data.end} width={840} />
              <Row name="对数收益" value={M.meta.data.returns.toLocaleString("en-US")} width={840} />
              <Row name="窗口 96+24" value={M.meta.data.windows.toLocaleString("en-US")} width={840} />
              <Row name="训练 / 测试窗口" value={M.meta.data.train + " / " + M.meta.data.test} note="前 70% 训练，最后 80 个窗口测试" width={840} />
              <Row name="最大缺口" value={M.meta.data.maxGapDays + " 天"} color={C.coral} note={M.meta.data.maxGapAt + " → " + M.meta.data.maxGapNext} width={840} />
              <div style={{ marginTop: 18 }}><Chip color={C.cyan}>sha256 {M.meta.data.sha256.slice(0, 8)}…</Chip></div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 330, width: 756 }}>
            <Card label="两项一致性检查" accent={C.amber} style={{ width: 756, height: 560 }}>
              <Row name="起始日" value="2015-01-05" note="与清单一致" width={700} />
              <Row name="结束日" value="2025-12-31" note="与清单一致" width={700} />
              <Row name="文件字节" value={M.meta.data.bytes.toLocaleString("en-US")} width={700} />
              <div style={{ height: 1, background: C.panelLine, margin: "20px 0" }} />
              <Body size={FT.label}>行数、日期、sha256 三项都对着证据文件校验，任何一项不一致，检查就红。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1180 }}>
            <LinePlot
              title="训练曲线 · 25 轮，均方误差"
              series={[
                { values: loss.map((r) => r.rnn), color: C.cyan, name: "逐点递归" },
                { values: loss.map((r) => r.seg), color: C.amber, name: "分段并行" },
              ]}
              width={1180} height={520} padL={104} padB={64} yFmt={(v) => v.toFixed(2)}
            />
          </div>
          <div style={{ position: "absolute", left: 1300, top: 360, width: 476 }}>
            <Card label="递归 loss" accent={C.cyan} style={{ width: 476, height: 170 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>1.032 → 0.954</div>
              <Mono size={FT.micro} color={C.inkFaint}>25 轮，214 秒</Mono>
            </Card>
            <Card label="分段 loss" accent={C.amber} style={{ width: 476, height: 170, marginTop: 20 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>1.167 → 0.843</div>
              <Mono size={FT.micro} color={C.inkFaint}>25 轮，54 秒</Mono>
            </Card>
            <Card label="判定" accent={C.violet} style={{ width: 476, height: 150, marginTop: 20 }}>
              <Verdict ok label="下降" />
              <Verdict ok label="有限" />
              <Body size={FT.meta} style={{ marginTop: 10 }}>两条曲线都没有发散。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1180 }}>
            <Card label="四组检查的关键读数" accent={C.cyan} style={{ width: 1180, height: 500 }}>
              <Row name="两节点金例" value="h1 = 1 · h2 = 2" note="手算，精确相等" width={1110} />
              <Row name="梯度校验" value="9.05e-9" note="门限 1e-6" width={1110} />
              <Row name="截断一致性" value="0 vs 6.84" note="keep ≥ T 与全长逐个相等；keep = 3 不同" width={1110} />
              <Row name="调用次数" value="120 vs 15" note="比值 8" width={1110} />
              <Row name="24 步误差" value={M.rnn.arMae24.toFixed(4) + " vs " + M.seg.mae24.toFixed(4)} note="分段反超 0.016" width={1110} />
              <Row name="平滑度" value={M.seg.smoothAr.toFixed(4) + " vs " + M.seg.smoothSeg.toFixed(4)} color={C.coral} note="分段更抖 1.43 倍" width={1110} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1300, top: 330, width: 476 }}>
            <Stat label="证据等级" value="A" sub="每条断言都能判真假" accent={C.cyan} style={{ width: 476, height: 170 }} />
            <Card label="复现" accent={C.amber} style={{ width: 476, height: 300, marginTop: 20 }}>
              <Mono size={FT.micro} color={C.inkDim}>cabal run -v0 tsbase -- evidence-ch03-rnn</Mono>
              <Body size={FT.meta} style={{ marginTop: 12 }}>同样数据、同样种子，读数完全一致。</Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
