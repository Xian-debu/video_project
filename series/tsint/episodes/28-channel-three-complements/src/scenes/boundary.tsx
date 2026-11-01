import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Mono } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {[<AbsoluteFill key="b0">
          <div style={{ position: "absolute", left: PAD, top: 296, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.coral }}>BOUNDARY · 四句话不能说</div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 352, width: CW, display: "flex", gap: 22 }}>
            <Card label="边界一 · 没有训练" accent={C.coral} style={{ width: 540, height: 300 }}>
              <Body size={FT.label}>
                三个模块只证明结构、参数与可测性质。路由槽的纯度、聚类 ARI 都是未训练读数，不是预测效果。
              </Body>
              <Mono size={FT.tiny} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>没有拟合，就没有精度可报</Mono>
            </Card>
            <Card label="边界二 · 行业信号很薄" accent={C.amber} style={{ width: 540, height: 300 }}>
              <Body size={FT.label}>
                同行业与跨行业只差 0.05，市场共模占 43%。聚类 ARI 0.03 到 0.13，减共模后翻倍也仍然很低。
              </Body>
              <Mono size={FT.tiny} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>{"同 " + M.cluster.withinResid.toFixed(4) + " vs 跨 " + M.cluster.acrossResid.toFixed(4) + "（减共模后）"}</Mono>
            </Card>
            <Card label="边界三 · 相关不是因果" accent={C.violet} style={{ width: 540, height: 300 }}>
              <Body size={FT.label}>
                通道相关里混着市场、行业、风格和共同流动性。减第一主成分只减掉一个方向，剩下的仍不是行业结构本身。
              </Body>
              <Mono size={FT.tiny} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>聚类分出的簇不等于行业</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 680, width: 1140 }}>
            <Card label="三笔债 · 记在账上" style={{ width: 1140 }}>
              <Row name="算法卡" value="没写" note="接口、口径、与书的差异待成文" color={C.amber} width={1080} />
              <Row name="demo 子命令" value="没做" note="routerAttn / clusterDemo 只是库入口，没有一键跑" color={C.amber} width={1080} />
              <Row name="端到端训练" value="没做" note="没有拟合，就没有与其他通道模型的精度对照" color={C.amber} width={1080} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1270, top: 680, width: 560 }}>
            <Card label="交付状态" accent={C.cyan} style={{ width: 560 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="实现通过" />
                <Verdict ok label="证据通过" />
                <Verdict ok={false} label="未做端到端训练" />
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 12 }}>
                {M.meta.checks.ok} / {M.meta.checks.total} 检查 · {M.meta.tests.suites} 套 / {M.meta.tests.asserts} 断言
              </Mono>
            </Card>
            <Mono size={FT.tiny} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>
              边界是为了可复现：写清不能说什么，剩下的读数才可信。下一集换到概率轴，账继续记。
            </Mono>
          </div>
        </AbsoluteFill>]}
      </Pages>
    </Scene>
  );
};
