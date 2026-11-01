import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, K, Verdict, Chip } from "../shared";

export const SFloor: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：不声称的事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>不声称的事，先摆出来</div>
            <Body style={{ marginTop: 18, width: 860 }}>
              这一集只回答「这两个经典判据在日频单票上是什么表现」，不回答「哪个方法更好」。
              样本是一只票、一个市场、一种频率，所有读数都只在这个口径内成立。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 282, width: 840 }}>
            <Card label="五条边界" accent={C.coral} pad={24}>
              <Row name="不声称 SOTA" value="无公开基准" note="一只票，四十九项检查" />
              <Row name="不声称通用" value="A 股 · 白酒" note="换市场、换品种，全部重跑" />
              <Row name="不声称实时" value="日频 · 收盘后" note="批处理，不是在线检测" />
              <Row name="不声称 MP 更好" value="两种看不见" note="一个漏在相位，一个漏在阈值" />
              <Row name="不声称停牌可推广" value="人工构造" note="240 天极端对照，不是统计规律" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三条债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>三条债，这一集没还</div>
            <div style={{ display: "flex", gap: 22, marginTop: 26 }}>
              <Card label="一 · 阈值不迁移" accent={C.coral} pad={24} style={{ width: 550 }}>
                <Row name="训练 99 分位" value={"τ = " + M.arima.tau.toFixed(3)} note="测试段分布已经变了" />
                <Body style={{ marginTop: 12 }}>两个方法都栽在同一个地方：阈值是从训练段搬过来的，不是从测试段学出来的。</Body>
              </Card>
              <Card label="二 · MP 的自由参数" accent={C.amber} pad={24} style={{ width: 550 }}>
                <Row name="窗口 / 排除区" value="100 / 25" note="换一个 m，前五名换人" />
                <Body style={{ marginTop: 12 }}>m 决定「什么算一种形态」；没有理论值，只有经验值。</Body>
              </Card>
              <Card label="三 · 宽口径" accent={C.violet} pad={24} style={{ width: 550 }}>
                <Row name="F1 点调整" value={M.arima.f1PointAdj.toFixed(4)} note="不是检测能力" />
                <Body style={{ marginTop: 12 }}>一段报一次就整段算命中，读数会随真值段的长度变化；本集只用它做对照。</Body>
              </Card>
            </div>
            <div style={{ marginTop: 26 }}>
              <Verdict ok={false} label="三条都留给后续：" />
              <span style={{ marginLeft: 12, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>阈值在线更新 · 参数敏感性 · 段级指标怎么定义</span>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>下一集：两个解码器，一个说谎</div>
            <Body style={{ marginTop: 18, width: 860 }}>
              经典统计到这里为止。下一集换成神经网络：USAD 用对抗训练逼出重建误差，DAGMM 在高斯混合里算能量分数，
              再加一个多 AE 中位数做稳健集成。三个都不是经典统计，但都要回答同一个问题：分数在测试段还可比吗。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>USAD</Chip>
              <Chip color={C.violet}>DAGMM</Chip>
              <Chip color={C.amber}>多 AE 中位数</Chip>
            </div>
            <div style={{ marginTop: 26, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              {M.meta.next.slug} · 约 {M.meta.next.minutes} 分钟
            </div>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 286, width: 800 }}>
            <Card label="从距离换到密度" accent={C.cyan} pad={24}>
              <Row name="USAD" value="对抗训练" note="编码器 vs 两个解码器" />
              <Row name="DAGMM" value="能量分数" note="高斯混合里的似然" />
              <Row name="多 AE" value="中位数集成" note="三个模型的一致性" />
            </Card>
            <Body style={{ marginTop: 18 }}>
              不变的问题：训练上学到的「正常」，到测试段还算不算正常。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
