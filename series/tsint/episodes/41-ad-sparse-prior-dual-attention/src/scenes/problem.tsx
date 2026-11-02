import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Formula, Chip, Stat, Verdict, fmtInt } from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：三个没写下来的假设 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.2 }}>
              三个假设，
              <br />
              三个替换。
            </div>
            <Body style={{ marginTop: 26, width: 840 }}>
              上一集的四个方法，验证段都在零点二八到零点三一，搬到测试段最好的也只有零点二五。这一集不看分数，看它们共同依赖的三个假设：噪声是白的、一个窗口只有一种模式、注意力越稠密越好。
            </Body>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <Chip color={C.cyan}>只换一个假设</Chip>
              <Chip color={C.violet}>其余全部锁死</Chip>
              <Chip color={C.amber}>同数据 · 同注入</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 300, width: 820 }}>
            <Card label="上一集留下的坑" accent={C.coral} pad={22}>
              <Row name="验证段" value="0.28 – 0.31" note="四个方法都落在这个区间" />
              <Row name="测试段最高" value="0.2405" note="DAGMM，其余更低" color={C.coral} />
              <Row name="落差" value="0.22" note="多 AE 从 0.2840 掉到 0.0584" color={C.coral} />
              <Body style={{ marginTop: 12, fontSize: FT.meta, color: C.inkDim }}>
                分数不是不够高，是搬不过去。搬不过去的根，通常在没写下来的假设里。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：假设、违约、替换 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 1730, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <Card label="假设一：噪声是白的" accent={C.cyan} pad={22}>
              <Body>
                现实的正收益里有跳空、涨跌停、停牌。高斯先验把这些点当成异常，模型天天报警，真异常被淹掉。
              </Body>
              <div style={{ marginTop: 14 }}>
                <Row name="违约" value="跳空" note="尾部不是指数衰减" />
                <Row name="替换" value="Student-t" note="nu 等于五，尾巴更重" color={C.cyan} />
              </div>
            </Card>
            <Card label="假设二：一个视图就够" accent={C.violet} pad={22}>
              <Body>
                同一段形态，放在不同尺度、不同位置看都不一样。单视图重建只学会一种读法，形态变了它分不清是异常还是换个说法。
              </Body>
              <div style={{ marginTop: 14 }}>
                <Row name="违约" value="多义" note="同形不同位" />
                <Row name="替换" value="双视图对比" note="特征方向 + 样本方向" color={C.violet} />
              </div>
            </Card>
            <Card label="假设三：注意力越稠密越好" accent={C.amber} pad={22}>
              <Body>
                窗口只有一百个点，稠密注意力的成本不是瓶颈，但它连噪声一起学。稀疏掩码把一半连接固定切断，只留时间上的过去。
              </Body>
              <div style={{ marginTop: 14 }}>
                <Row name="违约" value="学噪声" note="一半连接本该为零" />
                <Row name="替换" value="二值稀疏" note="掩码冻结 + Step-T 因果" color={C.amber} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: 1730 }}>
            <Row name="验证办法" value="同数据 · 同注入 · 同阈值规则" note="每个方法只换掉那一个假设，基线同结构、同轮次" color={C.cyan} />
          </div>
        </AbsoluteFill>

        {/* 页三：注入配方 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 870 }}>
            <Body style={{ width: 840 }}>
              真值是人造的，配方要写死。三种注入，窗口互不重叠：尖峰只标一个点，形态和相位整段标。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Row name="尖峰" value={M.inject.spikes + " 段"} note="一个点乘五到十个标准差" color={C.cyan} />
              <Row name="形态替换" value={M.inject.shapes + " 段"} note="换成另一只票的整段形态" color={C.violet} />
              <Row name="相位翻转" value={M.inject.phases + " 段"} note="半周期错位，首尾段互换" color={C.amber} />
              <Row name="真值窗口" value={fmtInt(M.inject.truth) + " 个"} note={"占测试 " + (M.inject.truthShare * 100).toFixed(1) + "%"} color={C.coral} />
              <Row name="种子" value="42 · 4242 · 4243" note="验证段 43 · 4243 · 4344" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 288, width: 840 }}>
            <Card label="两条纪律" accent={C.violet} pad={22}>
              <Row name="一" value="段起点至少隔 130 天" note="窗口长 100，不重叠真值才逐位对得上" />
              <Row name="二" value="真值只认窗口末尾" note="窗口的最后一个点被注入，这个窗口才算真值" />
              <Body style={{ marginTop: 10, fontSize: FT.meta, color: C.inkDim }}>
                之前把两段的窗口叠在一起，真值多算了二十个，读数才偏。
              </Body>
            </Card>
            <div style={{ marginTop: 18 }}>
              <Card label="验证段另做一套" accent={C.cyan} pad={20}>
                <Body style={{ fontSize: FT.meta }}>
                  四段尖峰、两段形态、一段相位，种子换掉。验证段只用来挑阈值，不参与最终读数。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
