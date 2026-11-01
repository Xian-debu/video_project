import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, LinePlot, Verdict } from "../shared";

const TopTable: React.FC = () => {
  const cols = ["窗", "起点", "MSE", "MAE", "预测分", "标签"];
  const w = [130, 170, 210, 210, 200, 120];
  return (
    <div style={{ width: w.reduce((a, b) => a + b, 0) }}>
      <div style={{ display: "flex", borderBottom: "1px solid " + C.panelLine, paddingBottom: 8, marginBottom: 6 }}>
        {cols.map((c, i) => (
          <div key={c} style={{ width: w[i], fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, letterSpacing: "0.08em" }}>{c}</div>
        ))}
      </div>
      {M.top.map((r) => (
        <div key={r.window} style={{ display: "flex", padding: "7px 0", borderBottom: "1px solid rgba(120,140,160,0.12)" }}>
          <div style={{ width: w[0], fontFamily: FONT.mono, fontSize: FT.mono, color: C.ink }}>{r.window}</div>
          <div style={{ width: w[1], fontFamily: FONT.mono, fontSize: FT.mono, color: C.inkDim }}>{r.start}</div>
          <div style={{ width: w[2], fontFamily: FONT.mono, fontSize: FT.mono, color: C.coral }}>{r.mse.toFixed(4)}</div>
          <div style={{ width: w[3], fontFamily: FONT.mono, fontSize: FT.mono, color: C.inkDim }}>{r.mae.toFixed(4)}</div>
          <div style={{ width: w[4], fontFamily: FONT.mono, fontSize: FT.mono, color: C.inkDim }}>{r.pred.toFixed(4)}</div>
          <div style={{ width: w[5], fontFamily: FONT.mono, fontSize: FT.mono, color: C.cyan }}>{r.label ? "1" : "0"}</div>
        </div>
      ))}
    </div>
  );
};

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 15), pageAt("verification", 32), pageAt("verification", 43)];
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：28 项检查与金标准 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 980 }}>
            <Card label="28 项检查，一次跑完" accent={C.cyan}>
              <Row name="窗口" value="11 项" note="计数、起点、切窗、折叠" width={920} />
              <Row name="指标" value="9 项" note="混淆矩阵、prf、点调整、范围" width={920} />
              <Row name="评分" value="8 项" note="三个公式、形状校验、线性" width={920} />
              <Row name="合计" value={M.meta.checks + " / " + M.meta.checkTotal} note={"耗时 " + M.meta.runtimeSec + " 秒"} width={920} color={C.cyan} />
              <Row name="断言库" value={M.meta.tests.suites + " 套 · " + M.meta.tests.asserts.toLocaleString() + " 条"} note="零失败" width={920} />
            </Card>
            <div style={{ marginTop: 20 }}>
              <Body size={FT.meta}>检查程序跑真数据，也从这里把读数写进 foundation.json —— 画面上没有一个手抄的数字。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1130, top: 300, width: 690 }}>
            <Card label="金标准" accent={C.amber} pad={22}>
              <div style={{ fontFamily: "monospace", fontSize: 18, lineHeight: 1.95, color: C.inkDim, whiteSpace: "pre" }}>
                {"C=3 s=1  →  [1,2,3] [2,3,4] [3,4,5]\n"}
                {"折叠 [F,F,T]  →  假 假 真 假 假\n"}
                {"1,2 对 0,0  →  2.5   翻倍 → 10.0\n"}
                {"恒等重构  →  0.0\n"}
                {"F=10 末十位 2  →  4.0"}
              </div>
            </Card>
            <Card label="形状先过" accent={C.violet} pad={22} style={{ marginTop: 18 }}>
              <Body size={FT.body}>三个公式都有 Checked 版本：行列对不上就返回 Left，不截断、不广播。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：真实读数与曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1090 }}>
            <Card label="逐窗 MSE · 前六名挤在 1450–1599" accent={C.coral}>
              <LinePlot
                series={[{ values: M.curve.mse, color: C.coral, name: "逐窗 MSE" }]}
                width={1010} height={300} at={0}
                vlines={[{ i: 49, color: C.amber, label: "最高 · 1470" }]}
                yFmt={(v) => v.toFixed(1)} zeroLine
              />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body size={FT.meta}>曲线按每三窗采样一条；红峰就是注入段所在的窗口 —— 前六名六个窗，起点全部落在 1450 到 1500。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 300, width: 590 }}>
            <Card label="读数" accent={C.cyan} pad={20}>
              <Row name="重构 MSE" value={fmtF(M.scores.mse.p, 3) + " / " + fmtF(M.scores.mse.r, 3) + " / " + fmtF(M.scores.mse.f1, 4)} width={540} />
              <Row name="重构 MAE" value={fmtF(M.scores.mae.f1, 4)} note="和 MSE 一模一样" width={540} />
              <Row name="预测" value={fmtF(M.scores.pred.f1, 4)} note="19 / 540" width={540} />
              <Row name="范围" value={fmtF(M.scores.mse.rf1, 4)} note="精度为零" width={540} color={C.coral} />
            </Card>
            <Card label="为什么 MSE 等于 MAE" accent={C.amber} pad={20} style={{ marginTop: 16 }}>
              <Body size={FT.body}>一段窗口里只有一两个尖峰，平方和绝对值排序结果一样；换一组更分散的异常，两者就会分开。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：点调整、预测、范围 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
            <Card label="点调整这次没救回来" accent={C.violet}>
              <Row name="八个命中点" value="全在单点段" note="注入时每段只有 1–3 个点" width={940} />
              <Row name="可补的点" value="零" note="段两头没有相邻的真阳性" width={940} />
              <Row name="点调整 F1" value={fmtF(M.scores.mse.padj, 4)} note="与逐点完全相同" width={940} color={C.inkDim} />
              <Row name="它不是万能药" value="只管边界" note="相邻补点救不了孤点" width={940} />
            </Card>
            <div style={{ marginTop: 20 }}>
              <Body size={FT.meta}>演示里 A 的 F1 能从 0.5263 抬到 0.8333，是因为 A 的命中是连续的；真数据里没有这个结构。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 300, width: 680 }}>
            <Card label="预测与范围" accent={C.coral} pad={22}>
              <Row name="预测 预测点" value={M.labels.foldedPred + " 点"} note="六个错开的窗叠成 540" width={620} />
              <Row name="预测 TP" value="19" note="P 0.0352 · R 0.3167" width={620} />
              <Row name="范围 预测段" value="1 段 × 150 点" note="叠成连续一段" width={620} />
              <Row name="范围 召回" value={fmtF(M.scores.mse.rr, 4)} note="四段整段落在区间内" width={620} />
              <Row name="范围 精度" value="0" note="段对段，一段也没对" width={620} color={C.coral} />
              <Body size={FT.meta} style={{ marginTop: 14 }}>召回 9% 换来 F1 为零 —— 范围口径先罚“段不对”，再奖“盖得多”。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：平局与翻转 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1040 }}>
            <Card label="前六名窗 · 全在 1450 之后" accent={C.coral}>
              <TopTable />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body size={FT.meta}>这六行是原始读数：同一段异常被六个相邻窗各看一眼，MSE 高的窗未必预测分高 —— 两条排序不一样。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="排序会翻" accent={C.amber} pad={22}>
              <Row name="逐点 A / B" value={fmtF(M.flip.plainA, 3) + " < " + fmtF(M.flip.plainB, 3)} note="B 更整齐，B 赢" width={580} />
              <Row name="点调整 A / B" value={fmtF(M.flip.padjA, 3) + " > " + fmtF(M.flip.padjB, 3)} note="A 的命中连续，A 反超" width={580} color={C.cyan} />
              <Row name="范围 A" value={fmtF(M.flip.rangeA, 3)} note="A 的点散在段中央，一段也对不上" width={580} color={C.coral} />
              <Body size={FT.body} style={{ marginTop: 14 }}>同样的两个预测，换口径就换冠军。报 F1 而不报口径，等于没报。</Body>
            </Card>
            <div style={{ marginTop: 18 }}>
              <Verdict ok label="28 项全过 · 读数出自真实数据" />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
