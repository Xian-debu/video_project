import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Bars, Formula, Body, Mono } from "../shared";

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 8), pageAt("verification", 22), pageAt("verification", 33)];
  const tm = M.tsmixer;
  const rt = M.router;
  const cl = M.cluster;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1100 }}>
            <Card label="断言 · 三个模块加数据" style={{ width: 1060 }}>
              <Bars
                items={[
                  { label: "双轴混合", value: M.meta.tests.tsmixer, text: String(M.meta.tests.tsmixer), color: C.cyan },
                  { label: "路由注意力", value: M.meta.tests.router, text: String(M.meta.tests.router), color: C.amber },
                  { label: "动态聚类", value: M.meta.tests.cluster, text: String(M.meta.tests.cluster), color: C.violet },
                  { label: "全仓断言", value: M.meta.tests.asserts, text: M.meta.tests.asserts.toLocaleString("en-US"), color: C.inkDim, dim: true },
                ]}
                width={1000}
                rowH={64}
                unit={"新增 " + (M.meta.tests.tsmixer + M.meta.tests.router + M.meta.tests.cluster) + " 条；全仓 " + M.meta.tests.suites + " 套，零失败"}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 620 }}>
            <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="三组模块、数据、伪影，逐条落盘" accent={C.cyan} valueColor={C.cyan} style={{ width: 580 }} />
            <Stat label="全仓套数" value={String(M.meta.tests.suites)} sub={"断言 " + M.meta.tests.asserts + " 条"} accent={C.violet} style={{ width: 580, marginTop: 20 }} />
            <Stat label="本集新增" value={String(M.meta.tests.tsmixer + M.meta.tests.router + M.meta.tests.cluster)} sub="20 + 21 + 21，全部在零失败套件里跑" accent={C.amber} style={{ width: 580, marginTop: 20 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW, display: "flex", gap: 18 }}>
            <Verdict ok label="38 / 38 检查" />
            <Verdict ok label="1,313 / 1,313 断言" />
            <Mono size={FT.meta} color={C.inkFaint}>先跑算法断言，再跑证据程序；证据程序里的每条读数都来自刚跑过的实现</Mono>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Card label="双轴混合 MLP · 可测读数" accent={C.cyan} style={{ width: CW }}>
              <Row name="参数量" value={tm.params.toLocaleString("en-US")} note={tm.T + "² + " + tm.N + "² + " + tm.T + "×" + tm.N + " = 9,216 + 64 + 768"} width={1640} />
              <Row name="零权重恒等" value={tm.identityErr === 0 ? "0.0" : String(tm.identityErr)} note="W₁ = W₃ = 0、门 = 0 时输出等于输入，阈值 1e-15" width={1640} />
              <Row name="手算矩阵积" value={tm.handProdErr === 0 ? "0.0" : String(tm.handProdErr)} note="2×2 手算对照，阈值 1e-12" width={1640} />
              <Row name="通道等变残差" value={tm.chanEquiv.toExponential(2)} note="只混通道轴时，通道置换不改变结果" color={C.cyan} width={1640} />
              <Row name="时间等变残差" value={tm.timeEquiv.toExponential(2)} note="只混时间轴时，时间置换不改变结果；均一门前提" color={C.cyan} width={1640} />
              <Row name="带内质量 / 均匀" value={tm.bandMass.toFixed(4) + " / " + (1560 / 9216).toFixed(4)} note="初始化权重近乎各向同性，幅度差 0.003" color={C.amber} width={1640} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="路由注意力 · 可测读数" accent={C.amber} style={{ width: 1040 }}>
              <Row name="参数 c·d" value={rt.params + "（书里 " + rt.paramsBook + "）"} note={"d = " + rt.d + "，按书的 d = " + rt.dBook + " 是 " + rt.paramsBook} width={980} />
              <Row name="复杂度 c·N" value={rt.complexity + " vs " + rt.denseComplexity} note={"比值 " + rt.ratio + " 倍；槽数不随通道数增长"} color={C.amber} width={980} />
              <Row name="每行和" value={rt.rowSumErr.toExponential(2)} note="softmax 行归一，阈值 1e-12" width={980} />
              <Row name="c = 1 权重" value={rt.c1Err === 0 ? "恰为 1" : String(rt.c1Err)} note="单槽时权重全一，输出就是通道均值" width={980} />
              <Row name="手算均值" value={rt.handMeanErr === 0 ? "0.0" : String(rt.handMeanErr)} note="N=3、c=1、d=1、α=1 时三行都是 2" color={C.cyan} width={980} />
              <Row name="置换残差" value={rt.permDiff.toExponential(2)} note="通道置换下权重与输出同步置换" width={980} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 300, width: 640 }}>
            <Stat label="随机槽 纯度" value={rt.randPurity.toFixed(4)} sub={"ARI " + rt.randARI.toFixed(4)} style={{ width: 600 }} />
            <Stat label="PCA 槽 纯度" value={rt.pcaPurity.toFixed(4)} sub={"ARI " + rt.pcaARI.toFixed(4)} accent={C.violet} style={{ width: 600, marginTop: 20 }} />
            <Card label="读法" style={{ width: 600, marginTop: 20 }}>
              <Body size={FT.meta}>
                未训练的槽不会对齐行业。纯度 0.16 到 0.20，主要是市场共模被堆进少数槽；这个读数写进边界，不写成效果。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="动态聚类 · 可测读数" accent={C.violet} style={{ width: 1040 }}>
              <Row name="k = 4 参数" value={cl.paramsK4.toLocaleString("en-US")} note={"4 × (96 + 1) × " + cl.F + "，偏置单独一列"} width={980} />
              <Row name="k = 10 参数" value={cl.paramsK10.toLocaleString("en-US")} note="十簇商链，证据程序里实际跑的配置" width={980} />
              <Row name="合成恢复纯度" value={cl.synPurity.toFixed(4)} note="三簇十二通道，允许一次标签置换，阈值 0.99" color={C.cyan} width={980} />
              <Row name="十簇真实纯度" value={cl.rawPurity.toFixed(4)} note="最后一个窗口，行业标签对照" color={C.violet} width={980} />
              <Row name="原始 / 减共模 ARI" value={cl.rawARI.toFixed(4) + " / " + cl.residARIMean.toFixed(4)} note="五个窗口，聚类在同一套余弦特征上" color={C.cyan} width={980} />
              <Row name="同 / 跨行业相关" value={cl.withinRaw.toFixed(4) + " / " + cl.acrossRaw.toFixed(4)} note="减共模前，六十四通道训练段" width={980} />
              <Row name="同 / 跨 · 减共模" value={cl.withinResid.toFixed(4) + " / " + cl.acrossResid.toFixed(4)} note="减共模后，符号分开" color={C.cyan} width={980} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 300, width: 640 }}>
            <Card label="数据 · 面板事实" style={{ width: 600 }}>
              <Row name="八通道面板" value={M.data.rows8 + " 行"} note="六只股票加两个指数" width={540} />
              <Row name="六十四通道" value={M.data.rows64 + " 行"} note={M.data.start + " 到 " + M.data.end} width={540} />
              <Row name="收益率" value={M.data.returns + " 个"} note="六十四通道，逐日对数收益" width={540} />
              <Row name="行业数" value={String(M.data.industries)} note="电子到建材，行业表写进证据" width={540} />
            </Card>
            <Card label="复现" style={{ width: 600, marginTop: 20 }}>
              <Mono size={FT.tiny} color={C.inkDim} style={{ display: "block", lineHeight: 1.7 }}>
                cabal run -v0 tsbase -- evidence-ch03-channel --data data/episodes/28-channel-three-complements --out ... --evidence inventory/evidence
              </Mono>
              <Mono size={FT.tiny} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>sha256 {M.data.sha256_64.slice(0, 16)}…</Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
