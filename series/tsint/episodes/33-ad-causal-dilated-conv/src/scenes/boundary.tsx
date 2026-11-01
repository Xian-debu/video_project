import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Chip, KV } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 21)];
  const c = M.offline.causal;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：四条边界 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, display: "flex", gap: 20 }}>
            <Card label="边界一 · 差距太小" accent={C.cyan} style={{ width: 424 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan }}>{fmtF(M.offline.gap, 4)}</div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
                两千四百五十八个窗口里十三项。讲不出故事。
              </Body>
              <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
                所以这一集不拿它当主张。主张放在逐位相同上。
              </Body>
            </Card>
            <Card label="边界二 · 形态替换盲区" accent={C.coral} style={{ width: 424 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.coral }}>0.0000 / 0.0000</div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
                两个模型都完全看不见。
              </Body>
              <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
                卷积只认局部形状。整段换一只股票，误差不大 —— 这和第 32 集接上了。
              </Body>
            </Card>
            <Card label="边界三 · 段定位粗糙" accent={C.amber} style={{ width: 424 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.amber }}>{fmtF(c.iou.spike, 4)}</div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
                误差峰在段内，但边界糊。
              </Body>
              <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
                尖峰只有五个点宽，重构误差会摊到前后几天。段找得粗，但没找错地方。
              </Body>
            </Card>
            <Card label="边界四 · 公式歧义" accent={C.violet} style={{ width: 424 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.violet }}>{fmtF(M.dual.maxReadingMean, 3)}</div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
                取最大读数是均值的 1.86 倍。
              </Body>
              <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
                书上的式子和正文对不上。两种读法都实现、都留读数，哪一种对，得看后续章节。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 720 }}>
            <Body size={FT.body} color={C.inkDim}>
              这一集不争“谁更准”。它争的是：哪一个模型的分数，上线之后还是同一个数。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
              <Chip color={C.cyan}>差距太小</Chip>
              <Chip color={C.coral}>换形态即盲</Chip>
              <Chip color={C.amber}>只能定位到段</Chip>
              <Chip color={C.violet}>公式两种读法</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：三笔债 + 下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="三笔债" accent={C.amber}>
              <div style={{ borderLeft: "2px solid " + C.coral, paddingLeft: 16, marginBottom: 16 }}>
                <Body size={FT.meta} color={C.inkFaint}>第一笔 · 上线口径只是模拟</Body>
                <Body size={FT.body} color={C.ink} style={{ marginTop: 6 }}>
                  补零不等于真实在线滚动。真实系统要逐点递推，那是另一个工程问题。
                </Body>
              </div>
              <div style={{ borderLeft: "2px solid " + C.violet, paddingLeft: 16, marginBottom: 16 }}>
                <Body size={FT.meta} color={C.inkFaint}>第二笔 · 长程依赖还没做</Body>
                <Body size={FT.body} color={C.ink} style={{ marginTop: 6 }}>
                  感受野三十一天。再长的记忆，卷积要加层，或者换一种结构。
                </Body>
              </div>
              <div style={{ borderLeft: "2px solid " + C.cyan, paddingLeft: 16 }}>
                <Body size={FT.meta} color={C.inkFaint}>第三笔 · 多变量面板没用上</Body>
                <Body size={FT.body} color={C.ink} style={{ marginTop: 6 }}>
                  现在是一只股票一个窗口，横截面信息没进来。
                </Body>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
            <Card label="这一集证明了一件事" accent={C.cyan}>
              <Body size={FT.body} color={C.ink}>
                因果性可以离线验证。不用等上线才知道分数会不会变。
              </Body>
            </Card>
            <Card label="下一集" accent={C.violet} style={{ marginTop: 18 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink, lineHeight: 1.25 }}>
                把记忆交给门
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.violet, marginTop: 6 }}>
                GRU 与 LSTM
              </div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
                预测下一段，误差就是分数 —— 先造一个会忘、也会记的模型。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
