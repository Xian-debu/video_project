import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Stat, CodeBlock, K, unitName, unitColor, Verdict, fmtInt } from "../shared";

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：一集一个读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1040 }}>
            <div style={{ display: "flex", gap: 22 }}>
              {(["graph", "flat"] as const).map((k) => (
                <Card key={k} label={unitName[k]} accent={unitColor[k]} pad={24} style={{ width: 470 }}>
                  <Stat label="F1" value={U(k).f1.toFixed(4)} sub={"P " + U(k).p.toFixed(4) + " · 报警 " + U(k).alertPct.toFixed(2) + "%"} valueSize={64} valueColor={unitColor[k]} />
                </Card>
              ))}
            </div>
            <Body size={FT.lead} color={C.inkDim} style={{ marginTop: 28, width: 1000, lineHeight: 1.7 }}>
              图学得到结构，但结构没有变成读数。两个模型在阈值前一起退化，连报警日都相同。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 660 }}>
            <Card label="学到了什么" accent={C.amber}>
              <Row name="邻接精度" value={M.gnn.precision.toFixed(3)} note={"随机 " + M.gnn.baseline.toFixed(3)} width={610} />
              <Row name="图训练损失" value={M.gnn.lossLast.toFixed(4)} note={"无图 " + M.gnn.flatLossLast.toFixed(4)} width={610} />
              <Row name="干净日中位" value={M.scores.cleanMedianGraph.toFixed(3)} note="阈值之上" width={610} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Verdict ok label={M.meta.checks + " 项检查 · 失败也写进证据"} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集与重跑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1040 }}>
            <Card label={"下一集 · " + M.next.title} accent={C.cyan}>
              <Row name="换一种关系" value="经典基线" note="先有垫底，再谈提升" width={990} />
              <Row name="方法" value="ARIMA 残差 + 矩阵轮廓" note="不用图，也不用对比学习" width={990} />
              <Row name="片长" value={"约 " + M.next.minutes + " 分钟"} note="第 39 集" width={990} />
            </Card>
            <CodeBlock
              title="一条命令重跑全部数字"
              width={1000}
              lines={[
                { t: "cabal run -v0 tsbase -- evidence-ch04-graph", hi: true },
                { t: "  --data data/episodes/38-ad-graph-contrastive" },
                { t: "  --out  data/episodes/38-ad-graph-contrastive" },
                { t: "  --evidence inventory/evidence", dim: true },
                { t: "  // 数据与清单在数据目录，导出脚本在 ts-admin", dim: true },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1200, top: 288, width: 640 }}>
            <Card label="这一集的账本" accent={C.violet}>
              <Row name="新增测试" value={M.meta.tests.newAsserts + " 条"} note={"三个模块 " + M.modules.map((m) => m.cases).join(" + ") + " 条"} width={590} />
              <Row name="仓库合计" value={fmtInt(M.meta.tests.asserts) + " 条"} note={M.meta.tests.suites + " 个套件"} width={590} />
              <Row name="证据检查" value={M.meta.checks} note={M.meta.elapsedSec.toFixed(1) + " 秒"} width={590} />
              <Row name="片长" value={M.progress.delivered + " / " + M.progress.total + " 集"} note={"本集第 " + M.meta.episode + " 集"} width={590} />
            </Card>
            <K style={{ display: "block", marginTop: 18 }}>这一集到这里，我们下次见。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

