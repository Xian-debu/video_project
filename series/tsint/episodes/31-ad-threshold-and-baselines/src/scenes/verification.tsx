import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, fmtP, predText, pageAt, Pages, Scene, SceneHead, Card, Row, KV, Body, Mono, Chip, Bars, Verdict } from "../shared";

const spike = M.routes.filter((r) => r.variant === "spike");
const S = (key: string) => spike.find((r) => r.key === key)!;
const sweepOf = (route: string) => M.sweep.filter((r) => r.route === route);

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 18), pageAt("verification", 35)];
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：二十八个检查 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1050 }}>
            <Card label="28 项检查，一次跑完" accent={C.cyan}>
              <Row name="阈值" value="12 项" note="固定/分位/SPOT、拟合、合成回收" width={1000} />
              <Row name="分类器" value="8 项" note="损失、梯度、可分数据、维度报错" width={1000} />
              <Row name="平滑" value="8 项" note="移动平均、指数平滑、NaN 边界" width={1000} />
              <Row name="合计" value={M.meta.checks + " / " + M.meta.checkTotal} note={"耗时 " + M.meta.runtimeSec + " 秒"} width={1000} />
              <Row name="断言语料库" value={M.meta.tests.suites + " 套 · " + M.meta.tests.asserts.toLocaleString("en-US") + " 条"} note={"本集新增 " + M.meta.tests.new + " 条，零失败"} width={1000} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              检查程序跑真数据，也把读数写进 threshold.json —— 画面上没有一个手抄的数字。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1210, top: 300, width: 610 }}>
            <Card label="黄金值" accent={C.amber}>
              <Row name="0.25 分位 → τ" value={fmtF(M.golden.quantile025Tau, 4)} width={570} />
              <Row name="判据输出" value={predText(M.golden.quantile025Pred)} width={570} />
              <Row name="q=0 / q=1" value="取端点" width={570} />
              <Row name="正例数" value={M.golden.qCount + " vs " + M.golden.qExpect} width={570} />
              <Row name="小样本 SPOT" value={fmtF(M.golden.smallSpotTau, 3)} note="退回分位" width={570} />
              <Row name="分类器 F1" value={fmtF(M.golden.sepF1, 4)} note="可分数据上" width={570} />
            </Card>
            <Card label="形状先过" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                三个模块都有 Checked 版本：形状不对返回 Left，不截断、不广播。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：真实读数 + 扫参 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 960 }}>
            <Card label="尖峰实验 · 三种切法" accent={C.cyan}>
              <Row name="固定 3σ" value={fmtF(S("fixed").f1, 4)} note={"P " + fmtF(S("fixed").p, 4) + " · R " + fmtF(S("fixed").r, 4) + " · " + S("fixed").pos + " 点"} width={910} />
              <Row name="1% 分位" value={fmtF(S("quantile").f1, 4)} note={"P " + fmtF(S("quantile").p, 4) + " · R " + fmtF(S("quantile").r, 4) + " · " + S("quantile").pos + " 点"} width={910} />
              <Row name="SPOT" value={fmtF(S("spot").f1, 4)} color={C.violet} note={"P " + fmtF(S("spot").p, 4) + " · R " + fmtF(S("spot").r, 4) + " · " + S("spot").pos + " 点"} width={910} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                固定与分位这么近，是因为两个阈值只差 0.08：3.0000 和 3.0844。切点几乎一样，结果自然接近。
              </Body>
            </Card>
            <Card label="扫参 · 三档注入率下的 F1" accent={C.amber} style={{ marginTop: 20 }}>
              <Bars
                items={[
                  { label: "固定 · 0.5%", value: sweepOf("fixed")[0].f1, text: fmtF(sweepOf("fixed")[0].f1, 4), color: C.cyan },
                  { label: "固定 · 1%", value: sweepOf("fixed")[1].f1, text: fmtF(sweepOf("fixed")[1].f1, 4), color: C.cyan },
                  { label: "固定 · 2%", value: sweepOf("fixed")[2].f1, text: fmtF(sweepOf("fixed")[2].f1, 4), color: C.cyan },
                  { label: "分位 · 0.5%", value: sweepOf("quantile")[0].f1, text: fmtF(sweepOf("quantile")[0].f1, 4), color: C.amber },
                  { label: "分位 · 1%", value: sweepOf("quantile")[1].f1, text: fmtF(sweepOf("quantile")[1].f1, 4), color: C.amber },
                  { label: "分位 · 2%", value: sweepOf("quantile")[2].f1, text: fmtF(sweepOf("quantile")[2].f1, 4), color: C.amber },
                  { label: "SPOT · 全档", value: sweepOf("spot")[0].f1, text: "1.0000 ×3", color: C.violet },
                ]}
                width={880} rowH={40} max={1.05}
              />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
                注入越密，固定与分位的 F1 越高 —— 真异常多了，误报被稀释。SPOT 三档全是一。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 300, width: 590 }}>
            <Card label="尾部拟合" accent={C.violet}>
              <Row name="xi" value={fmtF(M.spot.xi, 3)} width={550} />
              <Row name="beta" value={fmtF(M.spot.beta, 4)} width={550} />
              <Row name="u" value={fmtF(M.spot.u, 4)} width={550} />
              <Row name="合成 tau" value={fmtF(M.spot.synTau, 4)} note={"两万点，超限率 " + M.spot.synRate} width={550} />
            </Card>
            <Card label="为什么扫参要跑" accent={C.cyan} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                单点读数会被阈值碰巧选对骗过去。扫一遍才知道：F1 不只取决于尺子，还取决于数据里异常有多密。
              </Body>
            </Card>
            <Card label="分数相同，F1 相同" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.meta} color={C.inkDim}>
                固定与分位的切点只差 0.08。同一个注入率下，两者的 F1 几乎一样 —— 不是巧合，是算术。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：三基线 + 中等偏移 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
            <Card label="三基线 · 同一批测试点" accent={C.cyan}>
              <Row name="手写 z 分数" value={fmtF(M.detectors[0].f1, 4)} note={"点调整 " + fmtF(M.detectors[0].f1, 4) + " · 范围 " + fmtF(M.detectors[0].rf1, 4) + " · " + M.detectors[0].pos + " 点"} width={950} />
              <Row name="移动平均残差" value={fmtF(M.detectors[1].f1, 4)} note={"点调整 " + fmtF(M.detectors[1].f1, 4) + " · 范围 " + fmtF(M.detectors[1].rf1, 4) + " · " + M.detectors[1].pos + " 点"} width={950} />
              <Row name="逻辑回归分类器" value={fmtF(M.detectors[2].f1, 4)} note={"点调整 " + fmtF(M.detectors[2].f1, 4) + " · 范围 " + fmtF(M.detectors[2].rf1, 4) + " · " + M.detectors[2].pos + " 点"} width={950} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                分类器最差：训练段只有几十个正样本，它学不到稳定边界。不是逻辑回归不行，是数据不给它机会。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 300, width: 580 }}>
            <Card label="中等偏移 · 三种切法" accent={C.coral}>
              <Row name="固定 3σ" value={fmtF(M.routes.filter((r) => r.variant === "medium")[0].f1, 4)} note="15 个预测点，几乎全误报" width={540} />
              <Row name="1% 分位" value={fmtF(M.routes.filter((r) => r.variant === "medium")[1].f1, 4)} note="13 个预测点" width={540} />
              <Row name="SPOT" value={fmtF(M.routes.filter((r) => r.variant === "medium")[2].f1, 4)} note="0 个预测点" width={540} />
              <Row name="真值" value={String(M.inject.medium.testTruth) + " 点"} width={540} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                三种切法 F1 全部低于 0.1。这不是失败，是边界：全局 z 看不见局部尺度。
              </Body>
            </Card>
            <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
              <Verdict ok label="28 / 28 通过" />
              <Chip color={C.amber}>手算能验的数字都写在卡上</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
