import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtInt, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip } from "../shared";

const R = (det: string) => M.readings.find((r) => r.injection === "spike" && r.detector === det)!;

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 14), pageAt("open", 24)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：标题与三个 F1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1080 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 96, color: C.ink, lineHeight: 1.18 }}>
              没有标签，
              <br />
              怎么找异常。
            </div>
            <Body size={FT.body} style={{ marginTop: 28, width: 1000 }}>
              上一集给分数配了尺子，这一集问分数本身：没有真值，靠什么把异常挑出来。
              三种几何 —— 距离、密度、随机分割 —— 用同一份数据、同一批注入、同一个操作点比一次。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Chip color={C.amber}>同一批样本 · 三种几何</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 296, width: 580 }}>
            <Card label="尖峰注入 · 三个 F1" accent={C.cyan}>
              <Row name="K 均值" value={fmtF(R("kmeans").f1, 4)} color={C.cyan} note="距离最近簇心" width={520} />
              <Row name="LOF" value={fmtF(R("lof").f1, 4)} color={C.amber} note="局部密度比" width={520} />
              <Row name="孤立森林" value={fmtF(R("iforest").f1, 4)} color={C.violet} note="随机分割路径" width={520} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                80 个尖峰，107 个报警，同一批测试窗口。差三倍多。
              </Body>
            </Card>
            <Card label="一句话" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>没有最准的无监督。</Body>
              <Body size={FT.body} color={C.ink}>只有和异常形状最配的那一种。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三种几何 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Body size={FT.body} style={{ width: 1000, marginBottom: 26 }}>
              没有真值，异常只能由几何来定义。三种定义，三种分数，三种盲区。
            </Body>
            <div style={{ display: "flex", gap: 30 }}>
              <Card label="01 / 距离" accent={C.cyan} style={{ width: 540 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>离簇心有多远</div>
                <Body size={FT.body} style={{ marginTop: 12 }}>K 均值把样本聚成 K 簇，点到最近簇心的距离就是分数。簇心是训练数据自己长出来的。</Body>
              </Card>
              <Card label="02 / 密度" accent={C.amber} style={{ width: 540 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>邻居有多稀</div>
                <Body size={FT.body} style={{ marginTop: 12 }}>LOF 比一个点自己的局部密度和邻居的密度。比值大于一，说明它比周围稀。</Body>
              </Card>
              <Card label="03 / 随机分割" accent={C.violet} style={{ width: 540 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>几刀能切出来</div>
                <Body size={FT.body} style={{ marginTop: 12 }}>孤立森林随机选维、随机选点，把每个点切到单独成组。路径越短越容易被孤立。</Body>
              </Card>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 40 }}>
              <Chip color={C.cyan}>不用真值</Chip>
              <Chip color={C.amber}>只比几何</Chip>
              <Chip color={C.violet}>同一个操作点</Chip>
              <Chip color={C.coral}>同一批注入</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：数据与证据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="数据 · 八只白酒股，两万零六百个样本" accent={C.cyan}>
              <Row name="数据" value="8 只白酒股 · 2015-05-28 起" note="复权日线，交集交易日" width={970} />
              <Row name="交易日" value={fmtInt(M.data.rows) + " 天"} note={"最长缺口 " + M.data.maxGapDays + " 天 · " + M.data.maxGapAt} width={970} />
              <Row name="样本" value={fmtInt(M.samples.total) + " 个 · " + M.samples.dim + " 维"} note="一只股票 24 天收益轨迹" width={970} />
              <Row name="训练 / 测试" value={fmtInt(M.samples.train) + " / " + fmtInt(M.samples.test)} note="2015-01-01..2020-12-31 / 2021-01-01..2026-06-30" width={970} />
              <Row name="注入" value={M.inject.spike + " 尖峰 + " + M.inject.swap + " 替换"} note={"测试段 " + M.inject.ratePct + "% · seed " + M.inject.seed} width={970} />
              <Row name="检查" value={M.meta.checks + " / " + M.meta.checkTotal} note={"耗时 " + M.meta.runtimeSec + " 秒 · " + M.meta.tests.suites + " 套 · " + fmtInt(M.meta.tests.asserts) + " 条"} width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="实现与证据" accent={C.violet}>
              <Row name="算法" value={"ts-base " + M.meta.algoCommit} note="KMeans · Lof · IForest" width={590} />
              <Row name="证据" value={"ts-base " + M.meta.evidenceCommit} note={M.meta.checks + " 个检查，零失败"} width={590} />
              <Row name="数据" value={"ts-admin " + M.meta.dataCommit} note="逐字节校验" width={590} />
              <Row name="sha256" value={M.data.sha.slice(0, 12) + "..."} note={fmtInt(M.data.bytes) + " 字节"} width={590} />
            </Card>
            <Card label="这一集的回答" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                无监督能给出分数，但分数只对一种异常形状有效。换一种形状，排序就全变 —— 这不是调参能修的。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
