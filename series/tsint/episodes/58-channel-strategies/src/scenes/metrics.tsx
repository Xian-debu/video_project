import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { EffRankScale, MatrixMini } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>相关谱，<br />结构清楚。</Body>
          <Body style={{ marginTop: 26 }}>
            六个特征值排开：三点六零、一点零一、零点六三、零点三八、零点二五、零点一四。第一个占六成，前三个占八成七，后面三个不到一成三。能量明显集中。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="λ₁" v="3.5953" color={C.cyan} />
            <KV k="top1" v="59.9%" color={C.violet} />
            <KV k="top3" v="87.3%" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="能量分配：前三个方向拿走 87.3%" accent={C.cyan}>
            <Bars
              items={[
                { label: "top1", value: M.data.top1, text: (M.data.top1 * 100).toFixed(1) + "%", color: C.cyan },
                { label: "top3", value: M.data.top3, text: (M.data.top3 * 100).toFixed(1) + "%", color: C.violet },
                { label: "后三个", value: 1 - M.data.top3, text: ((1 - M.data.top3) * 100).toFixed(1) + "%", color: C.amber },
              ]}
              width={1000} max={1} rowH={72}
            />
            <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>λ₁ / 6 = 0.5992，λ₁+λ₂+λ₃ 占 0.8726；剩下三个方向共 0.1274。</div>
          </Card>
        </div>
        <Foot>能量明显集中。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>有效秩，<br />落在中间。</Body>
          <Body style={{ marginTop: 26 }}>
            真实二点四七，合成独立四点零零，合成高相关一点一七。三个数放一起，真实在中间：不像独立那么散，也不像高相关那么紧。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="真实" v="2.4714" color={C.cyan} />
            <KV k="独立" v="4.0000" color={C.violet} />
            <KV k="高相关" v="1.1662" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="有效秩刻度：0 到 6，真实数据在中段" accent={C.violet}>
            <EffRankScale
              width={960}
              values={[
                { label: "合成独立 rho=0", value: M.synth.rho0.effRank, color: C.cyan },
                { label: "真实 6 通道", value: M.data.effRank, color: C.violet },
                { label: "合成高相关 rho=0.9", value: M.synth.rho9.effRank, color: C.amber },
              ]}
            />
            <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>2.4714 四舍五入为 2；若取 3 也说得通，选 2 是因为更省位置。</div>
          </Card>
        </div>
        <Foot>真实数据在中间。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>决策：<br />Hybrid 2。</Body>
          <Body style={{ marginTop: 26 }}>
            平均相关零点五一，不到零点六，不能直接混；也高于零点二，不能独立。中间地带走折中，组数取有效秩二。结论是 Hybrid 2，三十二个 token。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="mean|ρ|" v="0.5109" color={C.cyan} />
            <KV k="effRank" v="2.4714" color={C.violet} />
            <KV k="策略" v="Hybrid 2" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="两个阈值逐项过：先判混合，再判独立，其余折中" accent={C.amber}>
            <Row name="混合条件" value="0.5109 < 0.6" note="不满足，不能直接混合" width={1000} color={C.cyan} />
            <Row name="独立条件" value="0.5109 > 0.2" note="不满足，不能完全独立" width={1000} color={C.amber} />
            <Row name="折中分支" value="k = round(2.4714)" note="k = 2 组" width={1000} color={C.violet} />
            <Row name="代价" value="32,768" note="比独立省 9 倍，比混合多一倍位置" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>32 token</Chip>
            <Chip color={C.violet}>2 组</Chip>
            <Chip color={C.amber}>省钱 9×</Chip>
          </div>
        </div>
        <Foot>结论：Hybrid 2。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>两个极端，<br />做对照。</Body>
          <Body style={{ marginTop: 26 }}>
            相关为零，四条独立通道，有效秩四点零，首特征占比零点二五，决策独立。相关零点九，四条强相关，有效秩一点一七，首特征占比零点九二五，决策混合。一条规则，两端都对。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="rho = 0" v="独立" color={C.cyan} />
            <KV k="rho = 0.9" v="混合" color={C.violet} />
            <KV k="真实" v="Hybrid 2" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="四个合成通道的两个极端" accent={C.cyan}>
            <div style={{ display: "flex", gap: 70 }}>
              <div>
                <MatrixMini rho={0} cell={22} label="rho = 0 · 对角为一，非对角为零" />
                <div style={{ marginTop: 14, display: "flex", gap: 24 }}>
                  <KV k="effRank" v={fmt4(M.synth.rho0.effRank)} color={C.cyan} />
                  <KV k="top1" v={fmt4(M.synth.rho0.top1)} color={C.violet} />
                </div>
                <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan }}>→ ChannelIndependent</div>
              </div>
              <div>
                <MatrixMini rho={0.9} cell={22} label="rho = 0.9 · 非对角全是 0.9" />
                <div style={{ marginTop: 14, display: "flex", gap: 24 }}>
                  <KV k="effRank" v={fmt4(M.synth.rho9.effRank)} color={C.cyan} />
                  <KV k="top1" v={fmt4(M.synth.rho9.top1)} color={C.violet} />
                </div>
                <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.body, color: C.amber }}>→ ChannelMixed</div>
              </div>
            </div>
          </Card>
        </div>
        <Foot>一条规则，两端都对。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四组读数，<br />四个结论。</Body>
          <Body style={{ marginTop: 26 }}>
            相关谱看结构，有效秩看组数，决策规则看边界，token 账看成本。全部能手算，全部写进证据。二十四项逐项对照，没有一项靠目测。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="读数" v="4 组" color={C.cyan} />
            <KV k="检查" v="24" color={C.violet} />
            <KV k="人工" v="0" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="读数 → 结论 → 能说的话" accent={C.violet}>
            <Row name="相关谱" value="top3 = 87.3%" note="结构集中，少数方向解释大部分" width={1000} color={C.cyan} />
            <Row name="有效秩" value="2.4714 → 2" note="两组够用，取二更省" width={1000} color={C.violet} />
            <Row name="决策" value="Hybrid 2" note="两个阈值都不过，走中间" width={1000} color={C.amber} />
            <Row name="token 成本" value="32,768" note="96/16/32 三档，比值 9 / 36" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>可手算</Chip>
            <Chip color={C.violet}>可复现</Chip>
            <Chip color={C.amber}>24 项</Chip>
          </div>
        </div>
        <Foot>这就是可复现。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
