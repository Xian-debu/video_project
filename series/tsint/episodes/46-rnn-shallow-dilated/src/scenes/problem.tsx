import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, fmt4, fmtInt,
} from "../shared";
import { TanhChainFig, BrickFig, DilTapsFig, DataSplitFig } from "../figs";

const rn = M.rnn;
const br = M.brick;

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：串行的代价 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 690 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              串行，
              <br />
              贵在哪。
            </div>
            <Body style={{ marginTop: 20, width: 670 }}>
              一条五百步的序列，循环网络要走五百个时间步。每一步都要算一次输入、隐状态、输出；第 t 步算完，才能算第 t 加一步。反传也一样：梯度要从第五百步，一路乘回第一步。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>500 个时间步</Chip>
              <Chip color={C.coral}>500 次链式相乘</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 790, top: 290, width: 1070 }}>
            <Card label="一条五百步序列的账" accent={C.coral} pad={24}>
              <Row name="前向" value="500 步 × 3 次矩阵乘" note="一步都不能跳" color={C.cyan} width={980} />
              <Row name="反传" value="500 次链式" note="从第 500 步回第 1 步" color={C.coral} width={980} />
              <Row name="并行度" value="1" note="每一步都等上一步" color={C.inkDim} width={980} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Body color={C.inkDim} size={FT.meta}>
                {"所以长窗口的第一个代价，是时间；第二个代价更隐蔽：梯度会消失。"}
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：tanh 压缩与梯度消失 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              tanh 一压，
              <br />
              梯度就没了。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              每一步的隐状态都过一遍 tanh，而 tanh 的导数最大是一。链式乘下来，只会越来越小：{fmt4(rn.tanh05)}、{fmt4(rn.chain[1])}、{fmt4(rn.chain[2])}。三步已经掉了一半多。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="第一步" value={fmt4(rn.chain[0])} note="tanh 0.5" color={C.coral} />
              <Row name="第三步" value={fmt4(rn.chain[2])} note="只剩四分之一" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 292, width: 1090 }}>
            <Card label="tanh 把每一步都压一次" accent={C.coral} pad={20}>
              <TanhChainFig width={1040} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：brick 并行 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              切成十块，
              <br />
              串行只剩六十步。
            </div>
            <Body style={{ marginTop: 20, width: 600 }}>
              把五百步切成十块，每块五十步；十块同时跑，各自得到一个块末状态；再把十个状态喂给第二层，第二层只有十步。串行深度变成五十加十。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="深度" value={"500 → " + br.depthParallel} note={fmt4(br.depthRatio, 2) + " 倍"} color={C.cyan} />
              <Row name="参数" value={String(br.params)} note="与窗口长度无关" color={C.violet} />
              <Row name="代价" value="块间不通信" note="写在定义里" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 700, top: 292, width: 1140 }}>
            <Card label="十块并行，第二层只走十步" accent={C.cyan} pad={18}>
              <BrickFig width={1100} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：空洞卷积 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              核也可以
              <br />
              不连着放。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              核不连续地摆，隔 d 个点取一个。d 等于一是普通卷积，d 等于二跳过中间一个点。这样一层就能看到更长的一段，叠四层 d 取一二四八，感受野三十一天。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>rf {M.dil.rf31} 天</Chip>
              <Chip color={C.amber}>参数 {M.dil.stackParams}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 288, width: 1080 }}>
            <Card label="隔 d 个点取一个" accent={C.violet} pad={18}>
              <DilTapsFig width={1020} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：数据口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五百只股票，
              <br />
              一根长窗口。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              全市场按成交额取前五百，{fmtInt(M.data.rows)} 个交易日。窗口五百步、步长二百五，一只股票最多切出八个窗口，一共 {fmtInt(M.data.windows)} 个。标签是未来六十天收益的三分位。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="三类" value={M.data.classes.map((v) => fmtInt(v)).join(" / ")} note="各约三分之一" color={C.cyan} />
              <Row name="切分" value={M.data.trainStocks + " / " + M.data.testStocks} note="按股票切" color={C.violet} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 286, width: 1060 }}>
            <Card label="五百只 × 2,674 天" accent={C.cyan} pad={18}>
              <DataSplitFig width={1000} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
