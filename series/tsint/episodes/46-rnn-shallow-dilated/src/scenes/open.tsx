import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, fmt4,
} from "../shared";
import { SeriesRetFig, BrickFig, LongAccFig } from "../figs";

const md = M.models;
const lng = M.long;

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：500 步窗口 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五百步，
              <br />
              一条序列。
            </div>
            <Body style={{ marginTop: 22, width: 640 }}>
              上一集把 300 个数压成了 288 个特征，窗口只有 60 步。这一集把窗口拉长：一只股票，从 2015 年走到 2025 年，整整 500 步的收益序列。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>T = {M.data.window}</Chip>
              <Chip color={C.violet}>{M.data.cols} 只股票</Chip>
              <Chip color={C.amber}>{"2,674 个交易日"}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
            <Card label="一只股票的整条历史" accent={C.cyan} pad={20}>
              <SeriesRetFig width={1020} />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"序列模型只有一条路：一步一步往前传。第 t 步的输出，取决于第 t−1 步。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：串行深度 500 → 60 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              串行深度，
              <br />
              从五百到六十。
            </div>
            <Body style={{ marginTop: 20, width: 690 }}>
              把五百步切成十块，每块五十步，块内串行；十块同时跑，块与块之间并行，最后只串十步。串行深度 {M.brick.depthSerial} → {M.brick.depthParallel}，结构上就是 {fmt4(M.brick.depthRatio, 2)} 倍。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="窗口" value={String(M.data.window) + " 步"} note="一条序列" color={C.cyan} />
              <Row name="并行深度" value={String(M.brick.depthParallel) + " 步"} note={"50 + " + M.brick.blocks} color={C.violet} />
              <Row name="深度比" value={fmt4(M.brick.depthRatio, 2)} note="结构上算出来的" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 286, width: 1060 }}>
            <Card label="切块：串行变并行" accent={C.cyan} pad={18}>
              <BrickFig width={1000} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：精度贴随机线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 680 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              精度贴着
              <br />
              随机线。
            </div>
            <Body style={{ marginTop: 20, width: 660 }}>
              五百步的真实三分位标签，测试准确率 {fmt4(md.serial.testAcc)}——正好是三类分类的三分之一。窗口从 50 拉到 500，准确率没动。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="T = 50" value={fmt4(lng[0].testAcc)} note="测试" color={C.inkDim} />
              <Row name="T = 250" value={fmt4(lng[1].testAcc)} note="测试" color={C.inkDim} />
              <Row name="T = 500" value={fmt4(lng[2].testAcc)} note="测试" color={C.coral} />
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>随机水平</Chip>
              <Chip color={C.amber}>长窗口没换来精度</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 820, top: 288, width: 1040 }}>
            <Card label="三个窗口长度，同一批股票" accent={C.coral} pad={18}>
              <LongAccFig width={990} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：这一集讲三件事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              这一集
              <br />
              讲三件事。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              单步 RNN 怎么算、梯度怎么回传；brick 并行把深度从五百压到六十；空洞卷积怎么用十五个参数拿到三十一天感受野。最后还会拆掉书里的两条预期。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>结构能算清</Chip>
              <Chip color={C.coral}>精度量不出</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 290, width: 1060 }}>
            <Card label="三件事：一件比一件省" accent={C.cyan} pad={24}>
              <Row name="单步 RNN" value={"tanh 0.5 = " + fmt4(M.rnn.tanh05)} note="39 个参数" color={C.cyan} width={960} />
              <Row name="brick 并行" value={"500 → " + M.brick.depthParallel} note={fmt4(M.brick.depthRatio, 2) + " 倍"} color={C.violet} width={960} />
              <Row name="空洞卷积" value={"rf " + M.dil.rf31} note={"15 个参数"} color={C.amber} width={960} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"书里说训练快六倍、精度差不到一个百分点。这两条在我们的单线程实验里都没站住，原因放在边界一页。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
