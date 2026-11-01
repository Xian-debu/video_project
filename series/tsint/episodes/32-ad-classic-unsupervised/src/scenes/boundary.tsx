import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Body, Chip } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 20)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：四条边界 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: CW, display: "flex", gap: 22 }}>
            <Card label="边界一 · 没有最准" accent={C.cyan} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                同一批尖峰三个 F1，换个异常形状排序就全变。无监督只有"和形状最配"，没有"最准"。
              </Body>
            </Card>
            <Card label="边界二 · 形态替换是盲区" accent={C.amber} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                换形态不换尺度。距离、密度、随机切割全部低于 {fmtF(0.0214, 4)} —— 要抓得先换表示。
              </Body>
            </Card>
            <Card label="边界三 · 高维会让距离失效" accent={C.violet} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                整窗 192 维上最好只有 0.1835，PCA 降到 10 维更差。单日尖峰只动一两个坐标，被距离集中淹没。
              </Body>
            </Card>
            <Card label="边界四 · 阈值口径决定 F1" accent={C.coral} style={{ width: 410 }}>
              <Body size={FT.body} color={C.ink}>
                训练段分位只报 {M.boundary.posAtTrainTau} 个，测试段分位报 107 个。报 F1 必须报分位在哪段取的。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: 1500 }}>
            <Body size={FT.body}>
              这一集不报模型。它报的是几何：同一份嵌入，距离、密度、随机分割，谁看得见哪种形状。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
              <Chip color={C.cyan}>没有最准，只有最配</Chip>
              <Chip color={C.inkFaint}>分数只对一种形状敏感</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：三笔债 + 下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="三笔债" accent={C.amber}>
              <Card label="第一笔 · 标签很少的时候" accent={C.amber} pad={16} style={{ marginTop: 12 }}>
                <Body size={FT.meta} color={C.inkDim}>完全无监督放弃了已有的少量标签，半监督怎么接，不在这一章。</Body>
              </Card>
              <Card label="第二笔 · 时间结构还没用" accent={C.violet} pad={16} style={{ marginTop: 12 }}>
                <Body size={FT.meta} color={C.inkDim}>24 天被当成无序向量，先后顺序丢了。下一集开始用序列模型把它补回来。</Body>
              </Card>
              <Card label="第三笔 · 阈值还在打补丁" accent={C.cyan} pad={16} style={{ marginTop: 12 }}>
                <Body size={FT.meta} color={C.inkDim}>99% 分位是约定，不是风险模型。SPOT 那条线留到有标签的章节再结算。</Body>
              </Card>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="这一集证明了一件事" accent={C.coral}>
              <Body size={FT.body} color={C.ink}>
                无监督能给出分数，但分数只对一种异常形状有效。它没有告诉你哪种形状。
              </Body>
            </Card>
            <Card label="下一集" accent={C.violet} style={{ marginTop: 18 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink, lineHeight: 1.35 }}>
                把时间结构
                <br />
                用起来。
              </div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
                自回归与状态空间 —— 预测下一段，再看残差。残差大的地方，就是异常。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
