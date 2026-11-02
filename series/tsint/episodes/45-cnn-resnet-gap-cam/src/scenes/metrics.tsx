import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, Stat,
  fmt4, fmt2, fmtInt, fmtPct,
} from "../shared";
import { AccBars45, CompareBars } from "../figs";

const ds = M.dataset;
const md = M.models;
const gp = M.gapcam;

export const SMetrics: React.FC = () => {
  const at = pagesOf("metrics");
  return (
    <Scene id="metrics">
      <SceneHead id="metrics" />
      <Pages id="metrics" at={at}>
        {/* 页一：口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先定口径，
              <br />
              再看数。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              {fmtInt(ds.stocks)} 只股票，三个行业各 {fmtInt(ds.groups.electronics)}。每只取 {ds.perStock} 个窗口，一共 {fmtInt(ds.windows)} 个。按股票切分：训练 {fmtInt(ds.train)} 窗，测试 {fmtInt(ds.test)} 窗。每个窗口 {ds.window} 步、五个字段，各自标准化。三分类，随机猜三分之一。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{fmtInt(ds.rows)} 行 × {fmtInt(ds.stocks)} 列</Chip>
              <Chip color={C.inkDim}>{ds.start} → {ds.end}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 288, width: 980 }}>
            <Card label="数据与切分" accent={C.cyan} pad={22}>
              <Row name="窗口数 / 训练 / 测试" value={fmtInt(ds.windows) + " / " + fmtInt(ds.train) + " / " + fmtInt(ds.test)} note="按股票切" color={C.cyan} />
              <Row name="窗口长度 / 步长" value={ds.window + " / " + ds.stride} note="每只四个窗口" />
              <Row name="字段" value="开、高、低、收、量" note="五个通道" />
              <Row name="三个行业" value={Object.values(ds.groups).join(" / ")} note="各 100 只" />
              <Row name="随机基线" value={fmt4(md.chance)} note="1/3" color={C.inkDim} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：四个模型 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五个模型，
              <br />
              同一批窗口。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              线性 {fmt4(md.linear.testAcc)}；卷积 {fmt4(md.cnn.testAcc)}，训练集 {fmt2(md.cnn.trainAcc, 2)}；四块残差 {fmt4(md.resnet.testAcc)}；一块残差 {fmt4(md.resnetShallow.testAcc)}；GAP-CAM {fmt4(md.gapcam.testAcc)}。最高的是最浅的残差，卷积比线性高三个多点。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="卷积 − 线性" value={"+" + fmt4((md.cnn.testAcc - md.linear.testAcc) * 100, 1) + " pp"} note="卷积唯一的收益" color={C.cyan} />
              <Row name="GAP-CAM − 卷积" value={fmt4((md.gapcam.testAcc - md.cnn.testAcc) * 100, 1) + " pp"} note="可解释的代价" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 286, width: 960 }}>
            <Card label="测试准确率" accent={C.cyan} pad={18}>
              <AccBars45 width={920} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：残差深浅 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              深的那个，
              <br />
              反而掉下来。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              四块：训练 {fmt4(md.resnet.trainAcc)}，测试 {fmt4(md.resnet.testAcc)}，中间差了将近两毛。一块：测试 {fmt4(md.resnetShallow.testAcc)}。参数少，泛化好。窗口只有 60 步，样本只有一千出头——深网没有足够的数据去用它的容量。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="深 四块 · 测试" value={fmt4(md.resnet.testAcc)} note={"训练 " + fmt4(md.resnet.trainAcc)} color={C.violet} />
              <Row name="浅 一块 · 测试" value={fmt4(md.resnetShallow.testAcc)} note={"高 " + fmt4(md.resnetShallow.testAcc - md.resnet.testAcc)} color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 870, top: 292, width: 970 }}>
            <Card label="深浅对照：同一份训练配方" accent={C.violet} pad={22}>
              <CompareBars width={910} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：字段冗余 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五个字段，
              <br />
              本来就很像。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              五个字段两两相关，平均绝对值 {fmt4(ds.meanAbsCorr)}。开盘、最高、最低、收盘本来就捆在一起，成交量稍微独立一点。通道依赖本该从五个通道里学互补信息——在这批数据上，互补信息不多。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>平均 |r| = {fmt4(ds.meanAbsCorr)}</Chip>
              <Chip color={C.inkDim}>不是实现错，是数据冗余</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 300, width: 980 }}>
            <Card label="字段相关：平均绝对相关" accent={C.amber} pad={22}>
              <svg width={910} height={120} style={{ display: "block" }}>
                <rect x={0} y={30} width={910} height={22} rx={5} fill={C.panelLine} />
                <rect x={0} y={30} width={910 * ds.meanAbsCorr} height={22} rx={5} fill={C.amber} opacity={0.85} />
                <text x={910 * ds.meanAbsCorr - 10} y={47} textAnchor="end" fill={C.bg} fontFamily={FONT.mono} fontSize={FT.meta}>{fmt4(ds.meanAbsCorr)}</text>
                <text x={0} y={88} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"0"}</text>
                <text x={910} y={88} textAnchor="end" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"1"}</text>
              </svg>
              <div style={{ height: 8 }} />
              <Body color={C.inkDim} size={FT.meta}>
                卷积的通道依赖把五个通道当互补源；相关高的时候，它学到的更多是「同一件事的加权平均」。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：损失 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              训练损失，
              <br />
              也要看一眼。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              卷积十二轮，损失 {fmt4(md.cnn.lossStart)} → {fmt4(md.cnn.lossEnd)}；残差十五轮，{fmt4(md.resnet.lossStart)} → {fmt4(md.resnet.lossEnd)}；GAP-CAM 三十轮，{fmt4(md.gapcam.lossStart)} → {fmt4(md.gapcam.lossEnd)}，几乎没动。它不是训不动，是容量太小：单层卷积、{gp.channels} 个通道。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>CNN 12 轮 · {fmt4(md.cnn.seconds, 1)} s</Chip>
              <Chip color={C.violet}>ResNet 15 轮 · {fmt4(md.resnet.seconds, 1)} s</Chip>
              <Chip color={C.coral}>GAP-CAM 30 轮 · {fmt4(md.gapcam.seconds, 1)} s</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 288, width: 980 }}>
            <Card label="损失：起点 → 终点" accent={C.cyan} pad={22}>
              <MiniTable
                head={["模型", "轮数", "损失起", "损失终", "耗时"]}
                rows={[
                  ["卷积", String(md.cnn.epochs), fmt4(md.cnn.lossStart), fmt4(md.cnn.lossEnd), fmt4(md.cnn.seconds, 1) + " s"],
                  ["四块残差", String(md.resnet.epochs), fmt4(md.resnet.lossStart), fmt4(md.resnet.lossEnd), fmt4(md.resnet.seconds, 1) + " s"],
                  ["GAP-CAM", String(md.gapcam.epochs), fmt4(md.gapcam.lossStart), fmt4(md.gapcam.lossEnd), fmt4(md.gapcam.seconds, 1) + " s"],
                ]}
                colW={[200, 110, 150, 150, 150]}
                width={880}
                rowH={44}
                hilite={2}
              />
              <div style={{ height: 12 }} />
              <Body color={C.inkDim} size={FT.meta}>
                损失停在 log 3 ≈ 1.0986 附近，是「三分类完全猜」的水平；{fmt4(md.gapcam.lossEnd)} 只比它低一点点。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
