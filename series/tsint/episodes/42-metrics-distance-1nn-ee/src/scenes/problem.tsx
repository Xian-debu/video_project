import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat,
  LinePlot, Row, Formula, CodeBlock, groupColor, groupName, groupKeys, fmtF, fmtInt,
} from "../shared";

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  const c = M.cases[0];
  const ds = M.dataset;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：任务 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <Card label="输入 · 一段 60 天的对数收益" accent={C.cyan} pad={18}>
              <LinePlot
                width={840} height={270} legend={false} zeroLine
                yFmt={(v) => v.toFixed(1)}
                series={[{ name: c.code + " " + c.name, color: C.cyan, values: c.series }]}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 286, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.22 }}>三分类，没有调参空间。</div>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              {groupKeys.map((k) => (
                <Chip key={k} color={groupColor[k]} style={{ fontSize: FT.meta, padding: "6px 12px" }}>{groupName[k]}</Chip>
              ))}
            </div>
            <Body style={{ marginTop: 22, width: 780 }}>
              {c.code} {c.name}，{groupName[c.group]}。输入是它的一段六十天对数收益窗，输出是三个行业之一。样本量只有六十，所以每一个读数都要带上不确定性。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="窗口长度" value={ds.window + " 个交易日"} width={760} />
              <Row name="股票数" value={ds.stocks + " 只"} width={760} />
              <Row name="区间" value={ds.start + " 至 " + ds.end} width={760} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：为什么用收益 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 940 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>价格有量纲，收益没有。</div>
            <Body style={{ marginTop: 18, width: 900 }}>
              贵州茅台两千块，京东方四块。直接比价格，最近邻只会找价位相近的票，不会找形态相近的票。取对数收益，再逐窗 z 标准化，比的就只剩形状与波动节奏。
            </Body>
            <div style={{ marginTop: 22 }}>
              <CodeBlock
                width={900}
                lines={[
                  { t: "r_t = log(P_t / P_{t-1})", hi: true },
                  { t: "z_t = (r_t - mean(r)) / std(r)", hi: true },
                  { t: "" },
                  { t: "mean(z) = 0,   std(z) = 1", dim: true },
                ]}
              />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 300, width: 700 }}>
            <Card label="为什么不用原始价格" accent={C.coral} pad={22}>
              <Body>
                价格是非平稳的：均值漂移、方差随价位变化。两段走势相同、价位不同的窗，原始价格距离会很大。收益近似平稳，量纲统一，才轮得到「形状」说话。
              </Body>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Stat label="每只股票的有效收益点" value={fmtInt(ds.minReturns) + " – " + fmtInt(ds.maxReturns)} sub="2015 至 2025，日频" valueSize={34} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：1-NN */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>分类器只有一个：最近邻。</div>
            <Body style={{ marginTop: 18, width: 820 }}>
              没有训练，没有梯度，也没有超参数。留一个窗出来，在剩下五十九个窗里找距离最小的那条，把它的标签抄过来。换距离，就是换这个「找」的方式。
            </Body>
            <div style={{ marginTop: 22 }}>
              <CodeBlock
                width={820}
                title="1-NN 留一"
                lines={[
                  { t: "for q in windows:" },
                  { t: "  best = argmin_{x != q} d(q, x)", hi: true },
                  { t: "  pred[q] = label[best]" },
                  { t: "" },
                  { t: "acc = mean(pred == truth)" },
                ]}
              />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 300, width: 810 }}>
            <Card label="三种距离，同一个分类器" accent={C.violet} pad={22}>
              <Row name="欧氏 ED" value="逐点平方和开方" note="对错位零容忍" width={760} />
              <Row name="DTW" value="代价矩阵 + 带宽 6" note="允许拉伸" width={760} />
              <Row name="弹性集成 EE" value="四个距离加权投票" note="权重来自留一" width={760} />
            </Card>
            <Body style={{ marginTop: 16, width: 780, fontSize: FT.meta }}>
              书的第 5 章说：DTW 的增益通常不到两个百分点。这句「不到两个点」是这一集要验证的主张，不是结论。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页四：ED 与 DTW 的一眼区别 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 850 }}>
            <Formula size={54} note="欧氏：第 i 点只跟第 i 点比">
              ED(a,b) = sqrt( Σ (aᵢ − bᵢ)² )
            </Formula>
            <div style={{ marginTop: 30 }}>
              <Formula size={50} note="DTW：允许 aᵢ 对 bⱼ，取最小累计代价" color={C.amber}>
                D(i,j) = d(aᵢ,bⱼ) + min(D(i−1,j), D(i,j−1), D(i−1,j−1))
              </Formula>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 300, width: 820 }}>
            <Card label="错位一格，欧氏就锁死" accent={C.coral} pad={22}>
              <Body>
                两条完全相同的曲线，只要整体平移五个点，欧氏会认为每个位置都不同。DTW 会把 a 的第 i 点对到 b 的第 i+5 点，路径沿对角线平移，距离仍然很小。
              </Body>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Stat label="本集固定" value="带宽 6 · 归一化 sqrt(D/(n+m))" sub="两个都不调，避免把测试集当验证集" valueSize={28} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>六十只股票，三个行业。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 24 }}>
              {groupKeys.map((k) => (
                <Stat key={k} label={groupName[k]} value={ds.groups[k] + " 只"} sub={groupColor[k] === C.cyan ? "sh600000 等" : k === "semi" ? "中芯国际 等" : "恒瑞医药 等"} valueColor={groupColor[k]} valueSize={40} />
              ))}
            </div>
            <Body style={{ marginTop: 22, width: 880 }}>
              沪深三百成分股里，银行 25 只、半导体 18 只、医药 17 只。每个行业只取一只股票的一个窗，六十个窗就是全部样本。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 300, width: 760 }}>
            <Card label="计划偏差，如实记录" accent={C.coral} pad={22}>
              <Row name="计划" value="三个行业各 30 只" width={700} />
              <Row name="实际" value="25 / 18 / 17" color={C.coral} width={700} />
              <Row name="处理" value="类内抽样 + macro 读数" width={700} />
              <Body style={{ marginTop: 14, fontSize: FT.meta }}>
                不强凑三十只。类别不平衡本身成为这一集的一部分：准确率会骗人，macro-F1 不会。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：评估协议 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>留一法，二十次重复抽样。</div>
            <Body style={{ marginTop: 18, width: 840 }}>
              六十个窗，每次留一个当测试，其余五十九个当训练。留一跑完得到主读数。再做二十次平衡抽样：每次每类抽十只，共三十窗，给三个分类器排名，用 Nemenyi 临界差判断差异是否显著。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Row name="主读数" value="60 窗留一" width={820} />
              <Row name="显著性" value={M.repeats.n + " 次 × 每类 " + M.repeats.perClass + " 只"} width={820} />
              <Row name="合成对照" value={M.synth.train + " 训练 / " + M.synth.test + " 测试"} width={820} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 300, width: 790 }}>
            <Card label="为什么还要合成对照" accent={C.violet} pad={22}>
              <Body>
                真实收益窗里可能没有「同形状、不同相位」的样本，DTW 的优势就无处发挥。合成三类周期 motif，再人为平移查询，才能把「DTW 抗错位」这句话单独拎出来验证。
              </Body>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Chip color={C.cyan}>结果：平移后 ED 0.0000 · DTW 1.0000</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
