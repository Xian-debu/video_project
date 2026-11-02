import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, CodeBlock, Stat,
  fmt4, fmt2, fmtInt,
} from "../shared";
import { DimChainFig } from "../figs";

const mt = M.meta;
const cv = M.conv;
const md = M.models;

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三个模块，
              <br />
              四十二条新断言。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              Cnn 管卷积、池化与反传，十九条；ResNet 管残差块与深网，十条；GapCam 管 GAP、CAM 与训练，十三条。全仓现在是 {mt.tests.groups} 套、{fmtInt(mt.tests.assertions)} 条断言，三套 spec 全绿。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{mt.tests.groups} 套 · {fmtInt(mt.tests.assertions)} 条</Chip>
              <Chip color={C.amber}>新增 {mt.newCases} 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 288, width: 980 }}>
            <Card label="新增模块与断言数" accent={C.cyan} pad={22}>
              <MiniTable
                head={["模块", "职责", "断言"]}
                rows={mt.modules.map((m) => [m.file.split("/").pop() ?? m.file, m.file.endsWith("Cnn.hs") ? "卷积、池化、反传" : m.file.endsWith("ResNet.hs") ? "残差块、深网" : "GAP、CAM、训练", String(m.cases)])}
                colW={[150, 300, 110]}
                width={860}
                rowH={42}
              />
              <div style={{ height: 12 }} />
              <Body color={C.inkDim} size={FT.meta}>
                每个模块的 spec 与实现同目录，跑 cabal test 一次全验。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：维度账显式 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              形状写错，
              <br />
              第一层就报错。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              卷积层显式记输入通道、输出通道、核长；池化只记窗口。前向一路带着形状走：60、53、26、19、9。展平 9×32 = {cv.flat}。形状写错，第一层就报错，比训到一半发现不收敛便宜得多。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 800, top: 292, width: 1040 }}>
            <Card label="前向一遍，形状随时可查" accent={C.cyan} pad={20}>
              <DimChainFig width={980} />
              <div style={{ height: 8 }} />
              <CodeBlock
                width={980}
                lines={[
                  { t: "data Shape = Shape { ch :: Int, len :: Int }" },
                  { t: "conv k cin cout = ...  -- len' = len - k + 1", dim: true },
                  { t: "pool 2         = ...  -- len' = len `div` 2", dim: true },
                  { t: "flatten (Shape 9 32) = 288", hi: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：反传两坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              反传有两个
              <br />
              必踩的坑。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              第一个是池化：梯度只回最大值那个位置，其余是零，所以前向要记下 argmax，反传按表路由；平票时固定取第一个。第二个是卷积：对输入要做 full 卷积，对权重才做互相关。方向搞反，形状先对不上，改完再谈数值。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="池化" value="argmax 路由" note="平票取索引 0" color={C.cyan} />
              <Row name="卷积" value="输入 full / 权重互相关" note="方向别搞反" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 292, width: 1010 }}>
            <Card label="两个坑的写法" accent={C.coral} pad={20}>
              <CodeBlock
                width={950}
                lines={[
                  { t: "-- 池化前向：记 argmax" },
                  { t: "poolFwd xs = [(maximum w, argmax w) | w <- windows 2 xs]", dim: true },
                  { t: "-- 反传：梯度只给 argmax 那一格", dim: true },
                  { t: "poolBwd g (v, i) = zeros (length v) // [i] = g" },
                  { t: "" },
                  { t: "-- 卷积：对输入是 full，对权重是互相关", hi: true },
                  { t: "dInput  = convFull (reverse w) g", dim: true },
                  { t: "dWeight = corr x g", dim: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：GAP 与 bias */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              CAM 有两条
              <br />
              写死的纪律。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              第一，GAP 把任意长度压成一个均值向量：同一套权重吃六十步输出三类，吃一百二十步还是三类，长度不进参数量。第二，最后一层线性层不许带 bias——bias 与时间无关，会让整条热图整体平移，热图就不再是「哪几天」的证据。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="长度" value="60 / 120 步同一套权重" note="GAP 不吃长度" color={C.cyan} />
              <Row name="bias" value="最后一层置零" note="否则热图平移" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 292, width: 1010 }}>
            <Card label="GAP 与无 bias 的线性头" accent={C.amber} pad={20}>
              <CodeBlock
                width={950}
                lines={[
                  { t: "-- GAP：沿时间取均值，长度随便" },
                  { t: "gap f = map (meanOfTime f) [0..c-1]", dim: true },
                  { t: "" },
                  { t: "-- 线性头不带 bias：热图才可归因", hi: true },
                  { t: "camLogits = w <> gapOut        -- 无 + b", dim: true },
                  { t: "" },
                  { t: "-- 上采样回 60 个日位置，再归一到 [0,1]" },
                  { t: "heat = (cam - minimum cam) ./ (maximum cam - minimum cam)", dim: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：训练循环 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              训练循环，
              <br />
              两层。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              外层轮数，内层小批量。每个批量：前向、算交叉熵、反传、Adam 更新。卷积层、池化层、线性头，梯度一路传回去。卷积和残差都用一千轮里的固定配方，GAP-CAM 学习率稍大一点。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>Adam</Chip>
              <Chip color={C.amber}>批量 32</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1040 }}>
            <Card label="trainCnn（伪码）" accent={C.cyan} pad={20}>
              <CodeBlock
                width={980}
                lines={[
                  { t: "for e <- [0 .. epochs-1] do" },
                  { t: "  shuffled <- shuffle (seed + e * 101) train" },
                  { t: "  for batch <- chunksOf 32 shuffled do" },
                  { t: "    let g = backprop (loss batch) params" },
                  { t: "    params <- adamStep lr g params", hi: true },
                  { t: "  record e (modelLoss params train)" },
                  { t: "" },
                  { t: "-- 三层都参与反传：卷积 → 池化 → 线性头", dim: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：配方 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              配方朴素，
              <br />
              全部 CPU。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              卷积 {md.cnn.epochs} 轮、{fmt4(md.cnn.seconds, 1)} 秒；四块残差 {md.resnet.epochs} 轮、{fmt4(md.resnet.seconds, 1)} 秒；GAP-CAM {md.gapcam.epochs} 轮、{fmt4(md.gapcam.seconds, 1)} 秒。三套加起来不到两分钟。证据程序总共 {mt.evidence.seconds.toFixed(1)} 秒、{mt.evidence.checks} 项检查——这是这一集所有数字的来源。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{mt.evidence.passed} / {mt.evidence.checks} 检查</Chip>
              <Chip color={C.amber}>{mt.evidence.seconds.toFixed(1)} s</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 288, width: 980 }}>
            <Card label="训练配方与耗时" accent={C.amber} pad={22}>
              <MiniTable
                head={["模型", "轮数", "学习率", "批量", "耗时"]}
                rows={[
                  ["卷积", String(md.cnn.epochs), "0.005", "32", md.cnn.seconds.toFixed(1) + " s"],
                  ["四块残差", String(md.resnet.epochs), "0.005", "32", md.resnet.seconds.toFixed(1) + " s"],
                  ["GAP-CAM", String(md.gapcam.epochs), "0.01", "32", md.gapcam.seconds.toFixed(1) + " s"],
                ]}
                colW={[220, 120, 160, 120, 160]}
                width={880}
                rowH={44}
              />
              <div style={{ height: 12 }} />
              <Body color={C.inkDim} size={FT.meta}>
                没有 GPU、没有早停、没有学习率调度；所有对照共用这套配方，差别只在结构。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
