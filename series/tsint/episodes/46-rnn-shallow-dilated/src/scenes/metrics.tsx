import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, fmt4,
} from "../shared";
import { LongAccFig, LossFig, SynthFig, WallFig } from "../figs";

const rn = M.rnn;
const br = M.brick;
const sy = M.synthetic;
const lg = M.long;

export const SMetrics: React.FC = () => {
  const at = pagesOf("metrics");
  return (
    <Scene id="metrics">
      <SceneHead id="metrics" />
      <Pages id="metrics" at={at}>
        {/* 页一：三样分开量 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三样分开量，
              <br />
              才知道哪层坏了。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              结构不靠训练，算出来就是算出来；可学性要给一个有信号的合成任务，网络学得会，说明实现没写坏；真实标签上的准确率最诚实，也最不好看。三样分开看，才知道问题出在哪一层。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>结构</Chip>
              <Chip color={C.violet}>可学性</Chip>
              <Chip color={C.coral}>真实标签</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1070 }}>
            <Card label="三样分开量，各看各的" accent={C.cyan} pad={22}>
              <Row name="结构" value="深度 · 参数 · 感受野" note="闭式，不训练" color={C.cyan} width={1000} />
              <Row name="可学性" value="合成周期序列" note="有信号就该学会" color={C.violet} width={1000} />
              <Row name="真实标签" value="三分位方向" note="最诚实的一格" color={C.coral} width={1000} />
              <div style={{ marginTop: 18 }}>
                <Row name="训练配方" value={"Adam · 30 轮 · 种子 " + rn.seed} note="所有对照共用" color={C.inkDim} width={1000} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：真实标签 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先把真实标签
              <br />
              打开。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              五百只股票的对数收益，窗口从五十步拉到五百步。测试准确率分别是 {fmt4(lg[0].testAcc)}、{fmt4(lg[1].testAcc)}、{fmt4(lg[2].testAcc)}——都在随机线上。训练集 {fmt4(rn.trainAcc)}，只说明记住了一点噪声。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="真实测试" value={fmt4(lg[0].testAcc) + " → " + fmt4(lg[2].testAcc)} note="50 / 250 / 500 步" color={C.coral} />
              <Row name="随机猜" value={fmt4(M.models.chance)} note="三类各 1/3" color={C.inkFaint} />
              <Row name="训练集" value={fmt4(rn.trainAcc)} note="没学到能迁移的" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 290, width: 1090 }}>
            <Card label="窗口拉长十倍，准确率一条平线" accent={C.coral} pad={20}>
              <LongAccFig width={1040} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：损失 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              损失看得见
              <br />
              一点点下降。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              三十轮下来，训练损失从 {fmt4(rn.lossStart)} 降到 {fmt4(rn.lossEnd)}。三个类均匀猜是 log 3，也就是 {fmt4(rn.lossChance)}。这点下降，基本就是把训练集背下来；测试损失不跟着降，曲线是平的。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="起点" value={fmt4(rn.lossStart)} note="第 1 轮" color={C.inkDim} />
              <Row name="终点" value={fmt4(rn.lossEnd)} note="第 30 轮" color={C.cyan} />
              <Row name="均匀猜" value={fmt4(rn.lossChance)} note="log 3" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 290, width: 1070 }}>
            <Card label="三十轮训练损失：降了 0.0382" accent={C.cyan} pad={20}>
              <LossFig width={1020} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：合成任务 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              换一个有信号的
              <br />
              合成任务。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              三类序列，周期八、十二、二十，每条六十步，加两成噪声。同一个 RNN，隐状态十六，四十轮：训练和测试准确率都是一点零，{sy.seconds} 秒跑完。同一个实现，换个任务就学得会。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="周期" value={sy.periods.join(" / ")} note="三类，差别只在周期" color={C.violet} />
              <Row name="准确率" value={fmt4(sy.trainAcc) + " / " + fmt4(sy.testAcc)} note="训练 / 测试" color={C.cyan} />
              <Row name="耗时" value={sy.seconds + " s"} note="单线程" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 292, width: 1090 }}>
            <Card label="周期 8 / 12 / 20：有信号就学得会" accent={C.violet} pad={20}>
              <SynthFig width={1040} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：三个定义 + 墙钟 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三个量写成
              <br />
              可复现的定义。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              深度比：串行五百步除以并行六十步。参数：两套都数一遍，八十七对三十九加分类头。感受野：一加核长减一乘间隔之和。墙钟时间：单线程，六十个五百步窗口各跑一遍。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="结构深度比" value={fmt4(br.depthRatio) + "×"} note="500 : 60" color={C.cyan} />
              <Row name="墙钟比" value={fmt4(br.wallRatio)} note="单线程一次测量，不到 1" color={C.coral} />
              <Row name="结论" value="只能给结构比" note="快六倍缺多流" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 790, top: 290, width: 1060 }}>
            <Card label="结构比 8.33×，墙钟比 1× 附近" accent={C.coral} pad={20}>
              <WallFig width={1010} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
