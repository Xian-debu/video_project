import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Formula,
  SoftMinCurve, AccBars, fmt4, fmtInt,
} from "../shared";

const sm = M.softmin;

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：黄金值 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              让模板
              <br />
              自己学。
            </div>
            <Body style={{ marginTop: 22, width: 780 }}>
              上一集用 min 量「模板和窗口」的距离。min 只挑最小的那个窗口，其余九十二个窗口的梯度是零 —— 模板只能从数据里截，学不了。这一集把 min 换成 SoftMin，让梯度从每个窗口一起回来。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>SoftMin 黄金值 −1.0986</Chip>
              <Chip color={C.coral}>min 的零权重比例 0.9892</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 940, top: 288, width: 900 }}>
            <Card label="本集的黄金值：三个零距离" accent={C.cyan} pad={22}>
              <Formula size={FT.h2}>{"SoftMin(1; [0, 0, 0]) = −log 3 = −1.0986"}</Formula>
              <div style={{ marginTop: 16, display: "flex", gap: 14 }}>
                <Stat label="α = 1 时的 SoftMin" value="−1.0986" sub="= −log 3" valueColor={C.cyan} valueSize={38} />
                <Stat label="min 的值" value="0.0000" sub="硬最小值" valueColor={C.inkDim} valueSize={38} />
              </div>
              <Body style={{ marginTop: 14, color: C.inkDim }}>
                后面每一步都拿这个数校验：公式错一位，黄金值就对不上。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：十倍规则 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              书里的
              <br />
              十倍规则没出现。
            </div>
            <Body style={{ marginTop: 22, width: 710 }}>
              书里说 α 每放大十倍，学到的模板落点误差缩小约十倍。我们实测 α 等于一、十、一百：模板误差是一点八一一三、二点一二四二、二点一四一五，越大反而略差。分类准确率三档全对。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>α=1 · 1.8113</Chip>
              <Chip color={C.amber}>α=10 · 2.1242</Chip>
              <Chip color={C.violet}>α=100 · 2.1415</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 820, top: 280, width: 1030 }}>
            <Card label="三条 SoftMin 曲线：α=1 / 20 / 200" accent={C.cyan} pad={16}>
              <SoftMinCurve width={980} height={330} grid={sm.grid} curves={sm.curves} minCurve={sm.minCurve} colors={[C.cyan, C.amber, C.violet]} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：真实读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.coral, lineHeight: 1 }}>0.5524</div>
            <Body style={{ marginTop: 18, width: 740 }}>
              一百五十只股票，每只取最后一百个交易日的收盘价。学出来的五个模板，在一百零五条测试窗上准确率零点五五二四。上一集暴力搜索是零点三四二九，高了二十一个百分点。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>比搜索 +21.0 pp</Chip>
              <Chip color={C.violet}>DTW 1-NN 0.5143</Chip>
              <Chip color={C.inkDim}>随机 0.3333</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 960 }}>
            <Card label="四个准确率放在同一把尺子上" accent={C.cyan} pad={18}>
              <AccBars width={900} />
            </Card>
            <div style={{ marginTop: 12 }}>
              <Body color={C.inkDim} size={FT.meta}>
                学出来的模板比搜索模板高 {fmt4(M.real.lsAcc - M.real.searchBaseline, 4)}（{fmt4((M.real.lsAcc - M.real.searchBaseline) * 100, 1)} 个百分点），说明「让模板可学」确实换来了判别力。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：三件事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 1776 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>这一集讲三件事。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginTop: 30 }}>
              <Card label="一 · 梯度" accent={C.cyan} pad={22}>
                <Body>
                  min 只让一个窗口有梯度，SoftMin 让每个窗口都有一份权重。推导权重就是 softmax，和恒等于一。
                </Body>
                <div style={{ marginTop: 16 }}>
                  <Chip color={C.cyan}>黄金值 −1.0986</Chip>
                </div>
              </Card>
              <Card label="二 · 学习" accent={C.amber} pad={22}>
                <Body>
                  五个模板的位置和形状都变成参数，用 Adam 加三段退火训练。真实收益从 0.3429 拉到 0.5524。
                </Body>
                <div style={{ marginTop: 16 }}>
                  <Chip color={C.amber}>α 退火 1 → 20 → 200</Chip>
                </div>
              </Card>
              <Card label="三 · 边界" accent={C.violet} pad={22}>
                <Body>
                  书里两条定量结论都没复现：十倍规则不成立，α 超过五百训练也没停。两条都按实测讲，写进边界。
                </Body>
                <div style={{ marginTop: 16 }}>
                  <Chip color={C.violet}>下溢 ≠ 断流</Chip>
                </div>
              </Card>
            </div>
            <div style={{ marginTop: 26 }}>
              <Body color={C.inkDim}>
                先把 min 的问题看清楚：一条序列九十三个窗口，为什么只有一个是「有用」的。
              </Body>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
