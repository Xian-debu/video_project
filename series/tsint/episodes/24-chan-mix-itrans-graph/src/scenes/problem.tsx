import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, PairBar, Verdict, Chip, Formula } from "../shared";

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 6), pageAt("problem", 14), pageAt("problem", 22)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 900 }}>
            <Card label="时间轴注意力" accent={C.inkFaint} style={{ height: 380 }}>
              <Formula size={60}>T × T = 96 × 96</Formula>
              <div style={{ fontFamily: FONT.mono, fontSize: 88, color: C.inkFaint, marginTop: 12 }}>9,216</div>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                九十六个时间步两两比较。计算量随窗口长度平方增长。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 400, width: 780 }}>
            <Card label="通道轴注意力" accent={C.cyan} style={{ height: 380 }}>
              <Formula size={60}>N × N = 8 × 8</Formula>
              <div style={{ fontFamily: FONT.mono, fontSize: 88, color: C.cyan, marginTop: 12 }}>64</div>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                八个变量两两比较。通道数通常远小于时间长度。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 820, width: CW }}>
            <PairBar
              a={{ label: "时间轴", value: M.itrans.stdMult, text: "9,216" }}
              b={{ label: "通道轴", value: M.itrans.attnMult, text: "64" }}
              width={1080} colorA={C.inkFaint} colorB={C.cyan}
            />
            <Body size={FT.label} style={{ marginTop: 18 }}>
              相差 144 倍。但便宜不是理由——理由在下面这句话里。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 900 }}>
            <Card label="面板 A · 8 个通道（2015 → 2025）" accent={C.cyan} style={{ height: 400 }}>
              <PairBar
                a={{ label: "行业内", value: M.real.withinA, text: M.real.withinA.toFixed(3) }}
                b={{ label: "行业间", value: M.real.acrossA, text: M.real.acrossA.toFixed(3) }}
                width={800} max={0.8} colorA={C.cyan} colorB={C.inkFaint}
              />
              <Body size={FT.label} style={{ marginTop: 24 }}>
                行业内平均相关 0.694，行业间 0.437，差 1.6 倍。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 400, width: 780 }}>
            <Card label="面板 B · 20 只票 · 4 个行业" accent={C.amber} style={{ height: 400 }}>
              <PairBar
                a={{ label: "行业内", value: M.real.withinB, text: M.real.withinB.toFixed(3) }}
                b={{ label: "行业间", value: M.real.acrossB, text: M.real.acrossB.toFixed(3) }}
                width={680} max={0.8} colorA={C.amber} colorB={C.inkFaint}
              />
              <Body size={FT.label} style={{ marginTop: 24 }}>
                行业内 0.505，行业间 0.194，差 2.6 倍。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 850, width: CW }}>
            <Body size={FT.label}>
              时间轴上比的是同一条序列的不同时刻，通道轴上比的是不同标的的同一个时刻。前者是自相关，后者才是关系。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 410, width: CW }}>
            <div style={{ display: "flex", gap: 26 }}>
              <Card label="问题 1" accent={C.cyan} style={{ width: 600, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>怎么用最少的参数混合通道？</div>
                <Body size={FT.label} style={{ marginTop: 16 }}>
                  通道混合是右乘一个 N×N，不是逐点 MLP。参数量 144。
                </Body>
              </Card>
              <Card label="问题 2" accent={C.amber} style={{ width: 600, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>怎么让注意力直接作用在变量上？</div>
                <Body size={FT.label} style={{ marginTop: 16 }}>
                  把面板转置，每个变量一个 token。注意力矩阵 64 格。
                </Body>
              </Card>
              <Card label="问题 3" accent={C.violet} style={{ width: 600, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>怎么把关系画成一张图？</div>
                <Body size={FT.label} style={{ marginTop: 16 }}>
                  相关取 kNN，加自环、归一化，再做消息传递。图错了全错。
                </Body>
              </Card>
            </div>
            <div style={{ marginTop: 40 }}>
              <Row name="共同点" value="三个模块都只作用在 (T, N) 面板上" note="纯前向、纯函数、互不引用" width={1240} />
              <Row name="分歧点" value="稠密混合 · 稠密注意力 · 稀疏图" note="对应书里 3.3.6 的三种通道策略" width={1240} />
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 410, width: 1100 }}>
            <Card label="书里的三种通道策略（表 3.4 · 印刷版 55 页）" accent={C.cyan} style={{ height: 430 }}>
              <Row name="独立" value="每个通道一套参数" note="不借力，最省，也最笨" width={1040} />
              <Row name="完全依赖" value="稠密混合 / 稠密注意力" note="TSMixer、iTransformer 走这条路" width={1040} />
              <Row name="部分依赖" value="稀疏图 / 路由注意力" note="MTGNN 的 K 近邻图、Crossformer 的路由" width={1040} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1140, top: 410, width: 580 }}>
            <Stat label="本集覆盖" value="后两种" sub="稠密与稀疏各取一个代表" accent={C.amber} style={{ height: 195 }} />
            <Stat label="不做的部分" value="动态图 / 时变图" sub="书里 3.4.3 提了，本集没有实现" accent={C.coral} style={{ height: 195, marginTop: 40 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW, display: "flex", gap: 16 }}>
            <Chip color={C.cyan}>稠密 = 完全依赖</Chip>
            <Chip color={C.violet}>稀疏 = 部分依赖</Chip>
            <Chip color={C.inkFaint}>独立 = 不建模通道关系</Chip>
            <Verdict ok label="分水岭：稠密还是稀疏" />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
