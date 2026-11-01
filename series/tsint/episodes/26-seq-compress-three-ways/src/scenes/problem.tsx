import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, PairBar, K, Chip, Verdict } from "../shared";

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 8), pageAt("problem", 13), pageAt("problem", 20)];
  const dense = M.compress.find((c) => c.model === "dense")!;
  const sparse = M.compress.find((c) => c.model === "sparse")!;
  const last8 = M.compress.find((c) => c.model === "last8")!;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 900 }}>
            <Card label="输入 · 九十六步拼成一条向量" style={{ width: 900 }}>
              <Formula size={44}>{"X = [x_t-95, …, x_t] ∈ R^96"}</Formula>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                一根六十分钟线，九十六步历史拼成一个输入向。头是一个线性映射。
              </Body>
            </Card>
            <Card label="头 · 二十四乘九十六" accent={C.coral} style={{ marginTop: 40, width: 900 }}>
              <Formula size={44}>{"W ∈ R^{24×96},  b ∈ R^24"}</Formula>
              <Row name="权重" value={(24 * 96).toLocaleString("en-US")} note="二十四步，每步一个九十六维读出" width={820} />
              <Row name="偏置" value="24" note="每步一个" width={820} />
              <Row name="合计参数" value={dense.params.toLocaleString("en-US")} note="一条线全给每步用一次" color={C.coral} width={820} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 330, width: 848 }}>
            <Card label="样本 · 还是同一批窗口" accent={C.amber} style={{ width: 848 }}>
              <Row name="训练窗口" value={M.data.train.toString()} note={"全部窗口 " + M.data.windows + "，步长 4，互相重叠"} width={760} />
              <Row name="测试窗口" value={M.data.test.toString()} note="最后一百六十个，不参与拟合" width={760} />
              <Row name="每窗维度" value="96" note="相邻两步收益高度相关" width={760} />
              <Body size={FT.label} style={{ marginTop: 14 }}>
                很瘦的样本，喂一个很胖的头。这不是模型不够大，是输入没被压缩过。
              </Body>
            </Card>
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>2,304 次乘加</Chip>
              <Chip color={C.amber}>690 个训练窗口</Chip>
              <Chip color={C.coral}>2,328 个参数</Chip>
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
            <PairBar
              a={{ label: "稠密线性头", value: dense.mae, text: dense.mae.toFixed(4) }}
              b={{ label: "常数基线", value: M.baseline.constant, text: M.baseline.constant.toFixed(4) }}
              colorA={C.coral} colorB={C.inkFaint} width={1240} max={1.0}
            />
            <div style={{ marginTop: 56 }}>
              <Row name="稠密头误差" value={dense.mae.toFixed(4)} note="两千三百二十八个参数" color={C.coral} width={1400} />
              <Row name="常数基线" value={M.baseline.constant.toFixed(4)} note="把最后一根价格重复二十四遍" width={1400} />
              <Row name="差距" value={"+" + (dense.mae - M.baseline.constant).toFixed(4)} note="学出来的头，输给不学习的基线" color={C.coral} width={1400} />
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
            <Card label="这不是线性模型的原罪" accent={C.amber} style={{ width: CW, height: 170 }}>
              <Body size={FT.body}>
                九十六维输入里全是冗余：相邻收益高度相关。最小二乘在样本不足时会把噪声也拟合进去。换更大样本，结论可能反过来；在这份数据上，压缩是必需品。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
            <Card label="原因一 · 输入冗余" accent={C.cyan} style={{ width: 570, height: 320 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>96 → 12</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                九十六步里，相邻两步的信息大部分重叠。把它压成十二条，剩下的才是新的。
              </Body>
            </Card>
            <Card label="原因二 · 样本不足" accent={C.amber} style={{ width: 570, height: 320 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>690 窗</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                窗口互相重叠，有效独立样本远小于六百九十。参数越多，越容易把噪声背下来。
              </Body>
            </Card>
            <Card label="原因三 · 压缩即正则" accent={C.coral} style={{ width: 570, height: 320 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>96 参数</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                周期稀疏头只要九十六个参数，误差 0.6226。压得最狠的一条，反而最准。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
            <Card label="所以问题不是模型不够大" accent={C.cyan} style={{ width: CW, height: 160 }}>
              <Body size={FT.body}>是输入没有被压缩过。压缩不只是省算力，它还在做正则——这一集要量的就是这件事。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
            <Card label="路一 · 奇偶下采样" accent={C.cyan} style={{ width: 570, height: 380 }}>
              <Formula size={30}>{"X = [x_0, x_1, x_2, …]"}</Formula>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 14 }}>偶数位 x_0, x_2, …</Mono>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 6 }}>奇数位 x_1, x_3, …</Mono>
              <Body size={FT.label} style={{ marginTop: 14 }}>置换不丢信息，往返精确为零。</Body>
            </Card>
            <Card label="路二 · 周期下采样" accent={C.amber} style={{ width: 570, height: 380 }}>
              <Formula size={30}>{"p = 12,  相位 12 × 8"}</Formula>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 14 }}>每相位八点留四点</Mono>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 6 }}>12 × 2 × 4 = 96 参数</Mono>
              <Body size={FT.label} style={{ marginTop: 14 }}>有损，但只保留最近形状。</Body>
            </Card>
            <Card label="路三 · 最后时刻压缩" accent={C.violet} style={{ width: 570, height: 380 }}>
              <Formula size={30}>{"L = 8"}</Formula>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 14 }}>前面八十八根直接不看</Mono>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 6 }}>24 × 8 + 24 = {last8.params}</Mono>
              <Body size={FT.label} style={{ marginTop: 14 }}>最粗暴，最短，连周期都不管。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
            <Row name="同一份数据" value="4,063 根六十分钟线" note={"茅台 · " + M.data.start + " 起"} width={1400} />
            <Row name="同一把尺子" value="平均绝对误差" note="二十四步逐步平均，参数最少的 0.6226" width={1400} />
            <Row name="三条路都有代价" value="这一集把三条都写完，再量" note="不是选一条，是量清楚差在哪" color={C.cyan} width={1400} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
