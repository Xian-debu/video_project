import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, fmtInt } from "../shared";

export const SFloor: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：管不到的部分 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="这张图管不到什么" accent={C.coral}>
              <Row name="面板" value={M.params.nodes + " 只票"} note="十二个节点，换一批票结论要重跑" width={960} />
              <Row name="层数" value="一层传播" note="多跳关系传不过来" width={960} />
              <Row name="阈值" value="一个数" note="训练段的尺子，测试段已经松了" width={960} />
              <Row name="市场" value="一个" note="A 股白酒与啤酒，没有跨市场证据" width={960} />
              <Row name="时间" value="一日一次" note="盘中跳水里看不见" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              这一集能证明的很少：邻接从表示里学得出来，方向是行业同步性。它不能证明图对检测有用——读数上恰好相反。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：口径债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="这一集欠下的三笔账" accent={C.amber}>
              <Row name="阈值搬家" value="没解决" note={"干净中位 " + M.scores.cleanMedianGraph.toFixed(3) + " 高于训练阈值 " + M.scores.tauG.toFixed(2)} width={960} />
              <Row name="离散邻接" value="没有梯度" note="TopK 不能反传，图是「停下来选」的结果" width={960} />
              <Row name="增强质量" value="参差" note="裁剪相关 1.0、最大差 0.0，等于没增强" width={960} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 20, width: 960, lineHeight: 1.65 }}>
              三笔账都不是实现错误。阈值搬家是分数尺度的老问题，离散邻接是 TopK 的定义，增强质量是对比学习的输入。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="读数上的代价" accent={C.coral}>
              <Row name="图报警率" value={M.regime.alertGraph.toFixed(1) + "%"} note="对照期，无注入" width={660} />
              <Row name="无图报警率" value={M.regime.alertFlat.toFixed(1) + "%"} note="同一段行情" width={660} />
              <Row name="F1" value={U("graph").f1.toFixed(4) + " / " + U("flat").f1.toFixed(4)} note="图 / 无图，逐位相同" width={660} />
            </Card>
            <K style={{ display: "block", marginTop: 16 }}>图把板块同步放大了，放大到了每天都报警。</K>
          </div>
        </AbsoluteFill>

        {/* 页三：不声称 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="不声称的事" accent={C.cyan}>
              <Row name="不声称 SOTA" value="没有公开基准" note="十二只票、一套注入、一份面板" width={960} />
              <Row name="不声称通用" value="只验证了一个面板" note="换股票池、换市场要重跑" width={960} />
              <Row name="不声称实时" value="批处理" note="窗口需要一百天" width={960} />
              <Row name="不声称图更好" value="读数逐位相同" note="结构学到了，检测没接上" color={C.coral} width={960} />
              <Row name="不声称学到了因果" value="只是相关" note="邻接是同步性，不是传导" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 660 }}>
              <Verdict ok label={M.meta.checks + " 项检查 · 失败也写进证据"} />
              <Chip color={C.cyan}>邻接可复现</Chip>
              <Chip color={C.violet}>六种增强都有读数</Chip>
              <Chip color={C.amber}>对照期给了同一段行情</Chip>
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 660 }}>
              下一集换一种更笨的关系：先做经典基线，看图和对比学习到底挣了多少。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

