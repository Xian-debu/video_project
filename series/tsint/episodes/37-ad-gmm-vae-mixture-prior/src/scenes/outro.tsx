import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Stat, CodeBlock, K, unitName, unitColor, Verdict } from "../shared";

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
              {(["prior1", "mix4"] as const).map((k) => (
                <Card key={k} label={unitName[k]} accent={unitColor[k]} pad={24} style={{ width: 470 }}>
                  <Stat label="F1" value={U(k).f1.toFixed(4)} sub={"召回 " + U(k).recall.toFixed(4) + " · 报警 " + U(k).alertPct.toFixed(2) + "%"} valueSize={64} valueColor={unitColor[k]} />
                </Card>
              ))}
            </div>
            <Body size={FT.lead} color={C.inkDim} style={{ marginTop: 28, width: 1000, lineHeight: 1.7 }}>
              混合没有提高检测。它证明的是两件事：多个正常模式可以被拟合，但拟合出来的模式会把趋势吸收进去。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 660 }}>
            <Card label="判据与真实数据" accent={C.amber}>
              <Row name="书的判据" value="任何分量都解释不了" note="才算异常" width={610} />
              <Row name="真实数据" value="边界很模糊" note="趋势段被某个分量收下" width={610} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Verdict ok label="47 项检查 · 失败也写进证据" />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集与重跑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1040 }}>
            <Card label={"下一集 · " + M.next.title} accent={C.cyan}>
              <Row name="换一种关系" value="图" note="每只票当节点，TopK 邻接" width={990} />
              <Row name="方法" value="图神经网络 + 对比学习" note="增强、对比损失、负样本" width={990} />
            </Card>
            <CodeBlock
              title="一条命令重跑全部数字"
              width={1000}
              lines={[
                { t: "cabal run -v0 tsbase -- evidence-ch04-gmm-vae", hi: true },
                { t: "  --data data/episodes/37-ad-gmm-vae-mixture-prior" },
                { t: "  --out  data/episodes/37-ad-gmm-vae-mixture-prior" },
                { t: "  --evidence inventory/evidence", dim: true },
                { t: "  // 数据与清单在数据目录，导出脚本在 ts-admin", dim: true },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1200, top: 288, width: 640 }}>
            <Card label="这一集的账本" accent={C.violet}>
              <Row name="新增测试" value={M.meta.tests.newAsserts + " 条"} note={"GMMVAE.hs " + M.modules[0].cases + " 条"} width={590} />
              <Row name="仓库合计" value={M.meta.tests.asserts.toLocaleString("en-US") + " 条"} note={M.meta.tests.suites + " 个套件"} width={590} />
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
