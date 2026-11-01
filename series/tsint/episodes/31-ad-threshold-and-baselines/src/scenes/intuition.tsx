import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, Bars, Chip, TagDot } from "../shared";

const medium = M.routes.filter((r) => r.variant === "medium");

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 24)];
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：尾巴决定切点 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 62, color: C.ink, lineHeight: 1.3 }}>
              阈值的位置，
              <br />
              由尾巴决定。
            </div>
            <Body size={FT.body} style={{ marginTop: 22, width: 980 }}>
              主体是正态的，尾部不是。厚尾意味着极端值比正态多 —— 三倍标准差之外，还有不少点。固定阈值看不见这件事；分位看见了 1% 那一刀，但不知道 1% 以外的形状；SPOT 把尾巴单独拟合，所以能给出更靠外的切点。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
              <Chip color={C.cyan}>固定 3σ：切在 3.00</Chip>
              <Chip color={C.amber}>分位：切在 3.08</Chip>
              <Chip color={C.violet}>SPOT：切在 4.79</Chip>
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 26 }}>
              切点更靠外，不等于更好。要看多抓的是异常还是噪声。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 580 }}>
            <Card label="三个切点的距离" accent={C.violet}>
              <Bars
                items={[
                  { label: "固定", value: M.taus.fixed, text: fmtF(M.taus.fixed, 2), color: C.cyan },
                  { label: "分位", value: M.taus.trainQuantile, text: fmtF(M.taus.trainQuantile, 4), color: C.amber },
                  { label: "SPOT", value: M.taus.spot, text: fmtF(M.taus.spot, 4), color: C.violet },
                ]}
                width={520} rowH={60} max={5.2}
              />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
                固定与分位几乎同点 —— 这条数据的 1% 分位刚好在 3σ 附近。SPOT 多走了一点七。
              </Body>
            </Card>
            <Card label="切点靠外，抓什么" accent={C.cyan} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                尖峰 5–10 sigma，所以越靠外的切点越能避开噪声。换成 2–4 个局部 sigma 的偏移，这条就完全不成立。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：局部波动看不见 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="第二个实验 · 六十个中等偏移" accent={C.coral}>
              <Body size={FT.body} style={{ marginTop: 4 }}>
                每个点只在当天算 2–4 个局部标准差，放在全局尺度里不够高。三种切法，F1 全部低于 0.1。
              </Body>
              <Row name="固定 3σ" value={fmtF(medium[0].f1, 4)} note={medium[0].pos + " 个预测点，几乎全是误报"} width={1080} />
              <Row name="1% 分位" value={fmtF(medium[1].f1, 4)} note={medium[1].pos + " 个预测点"} width={1080} />
              <Row name="SPOT" value={fmtF(medium[2].f1, 4)} note={medium[2].pos + " 个预测点 —— 一个都没抓到"} width={1080} />
              <Row name="真值" value={String(M.inject.medium.testTruth) + " 个点"} note={"候选池 " + M.inject.medium.lowVolPool + " 个低波动点"} width={1080} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 20 }}>
              这不是阈值的问题，是分数的问题：全局 z 看不见局部尺度。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 300, width: 540 }}>
            <Card label="要抓这种异常，得先换分数" accent={C.amber}>
              <Body size={FT.body} color={C.ink}>
                比如用滚动窗口的标准差做归一化，让分数在局部尺度上度量。阈值只能在分数上切一刀，不能替分数看见东西。
              </Body>
            </Card>
            <Card label="一句话" accent={C.violet} style={{ marginTop: 18 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink, lineHeight: 1.35 }}>
                阈值救不了
                <br />
                瞎掉的分数。
              </div>
            </Card>
            <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
              <TagDot color={C.coral}>三种切法全部低于 0.1</TagDot>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
