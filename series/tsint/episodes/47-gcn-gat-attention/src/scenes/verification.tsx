import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, KV, Verdict, CheckGrid, checksOf, fmt4, fmtInt,
} from "../shared";
import { AccFig, PermFig, ScaleFig, ScoreFig, TanhFig } from "../figs";

const d = M.data;

const CheckList: React.FC<{ g: string; w?: number }> = ({ g, w = 880 }) => (
  <div style={{ width: w }}>
    {checksOf(g).map((c, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 0", borderBottom: "1px solid " + C.panelLine }}>
        <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 30 }}>{String(i + 1).padStart(2, "0")}</div>
        <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: 19, color: C.inkDim, lineHeight: 1.45 }}>{c.name}</div>
        <Verdict ok={c.pass} />
      </div>
    ))}
  </div>
);

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：总览 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              二十八项，
              <br />
              一项不漏。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              {"证据程序把建图、三个模型、对照组和训练曲线拆成六组检查，一次跑完 " + M.meta.evidence.checks + " 项，全部通过，用时 " + M.meta.evidence.seconds.toFixed(1) + " 秒。数据是从 dist.json 读的，不是手抄的。"}
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{M.meta.evidence.passed + " / " + M.meta.evidence.checks + " 通过"}</Chip>
              <Chip color={C.violet}>{M.meta.tests.groups + " 组 · " + fmtInt(M.meta.tests.assertions) + " 断言"}</Chip>
              <Chip color={C.amber}>{M.meta.evidence.seconds.toFixed(1) + " 秒"}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
            <Card label={"全部 " + M.checks.length + " 项检查：一条一格，按组染色"} accent={C.cyan} pad={24}>
              <CheckGrid width={1030} />
            </Card>
            <div style={{ marginTop: 18, display: "flex", gap: 14 }}>
              <KV k="data" v={String(checksOf("data").length)} note="建图与划分" color={C.cyan} />
              <KV k="gcn" v={String(checksOf("gcn").length)} note="固定邻接" color={C.cyan} />
              <KV k="gat" v={String(checksOf("gat").length)} note="学边权" color={C.violet} />
              <KV k="attn" v={String(checksOf("attn").length)} note="不要图" color={C.amber} />
              <KV k="control" v={String(checksOf("control").length)} note="对照" color={C.coral} />
              <KV k="train" v={String(checksOf("train").length)} note="曲线" color={C.inkDim} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：data */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先证明图是真的。
            </div>
            <div style={{ marginTop: 22 }}>
              <CheckList g="data" w={880} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 292, width: 760 }}>
            <Card label="这一页钉住的四个数" accent={C.cyan} pad={24}>
              <Row name="面板" value={fmtInt(d.rows) + " 行 × " + d.cols + " 列"} note={d.firstDate + " 至 " + d.lastDate} color={C.cyan} width={700} />
              <Row name="对齐后" value={fmtInt(d.alignedDays) + " 天"} note="30 列全部有值" color={C.violet} width={700} />
              <Row name="边" value={d.edges + " 条"} note={"|corr| ≥ " + M.graph.theta} color={C.amber} width={700} />
              <Row name="划分" value={d.trainNodes + " / " + d.testNodes} note="训练 / 测试节点" color={C.coral} width={700} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"图只要有一点算错，后面三个模型的成绩就都不作数——所以建图本身也要有检查。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：gcn */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              GCN：手算得到的数，
              <br />
              程序也要给出来。
            </div>
            <div style={{ marginTop: 20 }}>
              <CheckList g="gcn" w={900} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 292, width: 740 }}>
            <Card label="两节点全连、权重 1、输入 1 → tanh(1)" accent={C.cyan} pad={22}>
              <TanhFig width={700} height={260} />
              <Row name="tanh(1)" value={fmt4(M.gcn.tanh1)} note="检查里写死的期望值" color={C.cyan} width={680} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"参数 " + M.gcn.params + " 个，与 " + d.cols + " 只股票无关；梯度核对偏差 " + M.gcn.gradDiff.toExponential(3) + "。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：gat */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              GAT：注意力只在
              <br />
              邻居上分。
            </div>
            <div style={{ marginTop: 18 }}>
              <CheckList g="gat" w={900} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 292, width: 740 }}>
            <Card label="打分 [0, ln3] → exp [1, 3] → α [0.25, 0.75]" accent={C.violet} pad={22}>
              <ScoreFig width={700} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"非邻居的系数不用「很小」，直接是精确的零；行和仍是 1。参数 " + M.gat.params + " 个，GCN 的 " + fmt4(M.gat.params / M.gcn.params, 2) + " 倍。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：attn */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              自注意力：缩放
              <br />
              要能被算出来。
            </div>
            <div style={{ marginTop: 20 }}>
              <CheckList g="attn" w={900} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 300, width: 740 }}>
            <Card label="d′=1 / 4 / 16 → 1 / 0.5 / 0.25" accent={C.amber} pad={22}>
              <ScaleFig width={700} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Row name="缩放 d′=4" value={fmt4(M.attn.scale)} note="1 / √4" color={C.amber} width={700} />
              <Row name="全零输入 α" value={fmt4(M.attn.uniform)} note="均匀一半一半" color={C.cyan} width={700} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页六：control */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              把图打乱，
              <br />
              成绩就掉到随机线。
            </div>
            <div style={{ marginTop: 22 }}>
              <CheckList g="control" w={900} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 292, width: 740 }}>
            <Card label="置换等变：图与节点同时重排，系数按同一置换重排" accent={C.coral} pad={22}>
              <PermFig width={700} />
              <Row name="最大误差" value={M.control.permEquivErr.toExponential(3)} note="< 1e-9" color={C.cyan} width={680} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Row name="打乱后 GCN" value={fmt4(M.control.shuffledTestAcc)} note={M.control.shuffledCorrect + " / " + d.testNodes + "，随机线 " + fmt4(d.chance)} color={C.coral} width={700} />
              <Row name="同种子重跑" value={M.control.reproSame ? "逐位相同" : "不一致"} note="结果可复现" color={C.cyan} width={700} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页七：train */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三百轮，
              <br />
              三条损失都往下走。
            </div>
            <div style={{ marginTop: 20 }}>
              <CheckList g="train" w={880} />
            </div>
            <div style={{ marginTop: 18 }}>
              <Row name="GCN 损失" value={fmt4(M.gcn.lossStart) + " → " + fmt4(M.gcn.lossEnd)} note="训练 300 轮" color={C.cyan} width={860} />
              <Row name="GAT 损失" value={fmt4(M.gat.lossStart) + " → " + fmt4(M.gat.lossEnd)} note="训练 300 轮" color={C.violet} width={860} />
              <Row name="自注意力损失" value={fmt4(M.attn.lossStart) + " → " + fmt4(M.attn.lossEnd)} note="训练 300 轮" color={C.amber} width={860} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 280, width: 780 }}>
            <Card label="五根柱子：三个模型、打乱对照、随机线" accent={C.coral} pad={22}>
              <AccFig width={740} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
