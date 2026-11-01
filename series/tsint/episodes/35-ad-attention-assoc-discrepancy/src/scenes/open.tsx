import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Heat, CodeBlock, Stat, Formula } from "../shared";
import { SCENES } from "../script";

const mmss = (s: number) => Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 14), pageAt("open", 26), pageAt("open", 38)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：这一集换一把尺子 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              关系变了，
              <br />
              数值可以不变。
            </div>
            <Body style={{ marginTop: 26, width: 840 }}>
              上一集用重构误差量「预测错了多少」。这一集换一把尺子：量一个窗口里点与点的关系。
              关系被换掉时，数值可以一模一样，距离类的分数就瞎了；注意力矩阵不会。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.checks + " 项证据检查通过"} />
              <Chip color={C.violet}>F1 0.8880 / 0.5320 / 0.8274</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 292, width: 840 }}>
            <div style={{ display: "flex", gap: 26 }}>
              <div>
                <Heat matrix={M.heat.pixClean} labels={[]} cell={8} gap={1} labelW={0} min={0} max={1} />
                <div style={{ marginTop: 10, fontFamily: FONT.sans, fontSize: FT.label, color: C.cyan }}>干净窗</div>
                <K>一条斜带</K>
              </div>
              <div>
                <Heat matrix={M.heat.pixSpike} labels={[]} cell={8} gap={1} labelW={0} min={0} max={1} />
                <div style={{ marginTop: 10, fontFamily: FONT.sans, fontSize: FT.label, color: C.coral }}>尖峰窗</div>
                <K>一行坍缩成针</K>
              </div>
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 800 }}>
              四十乘四十降采样，颜色是对数压缩后的注意力权重，只影响观感、不影响分数。同一套权重、同一组参数，唯一区别是注入了什么。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：三个问题，三个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            <Card label="三个问题" accent={C.cyan}>
              <Row name="为什么重构误差看不见关系" value="目标里没这一项" note="损失只量数值差，换形状等于没换" width={1030} />
              <Row name="关联差异在比什么" value="先验 vs 注意力" note="逐行对称 KL，差得越远分越高" width={1030} />
              <Row name="另外两个补哪个洞" value="池化 · 焦点" note="次邻域补召回，两阶段补重建难度" width={1030} />
            </Card>
            <Card label="三个模块，同一套注入" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="AssocDiff.hs" value="141 行" note="关联差异，无需训练" width={1030} />
              <Row name="SAT.hs" value="109 行" note="次邻域遮罩，两个参数" width={1030} />
              <Row name="TranAD.hs" value="248 行" note="两阶段焦点，25,896 参数" width={1030} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 288, width: 620 }}>
            <Card label="账本" accent={C.amber}>
              <Row name="新增测试" value={"36 条"} note="三个套件" width={560} />
              <Row name="仓库合计" value={"1,573 条"} note={M.meta.tests.suites + " 个套件"} width={560} />
              <Row name="证据检查" value={M.meta.checks} note={M.meta.elapsedSec + " 秒跑完"} width={560} />
            </Card>
            <Card label="数据" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="两票交集" value={M.data.rows + " 行"} note="2015-01 至 2026-06" width={560} />
              <Row name="训练/测试窗" value={M.windows.train + " / " + M.windows.test} note={"窗长 " + M.windows.C + " 天"} width={560} />
              <Row name="注入" value={"10 + 10 窗"} note={M.inject.truthPts + " 个真值点"} width={560} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：口径先立住 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="打分口径" accent={C.amber}>
              <Row name="点级打分" value="覆盖它的窗取最大" note="不是窗口级判定，是逐日判定" width={950} />
              <Row name="阈值" value="训练段 99 分位" note="测试段一个数都不许进阈值" width={950} />
              <Row name="命中" value="点调整口径" note="一段里命中一次，整段记 TP；验证段专门交代" width={950} />
              <Row name="注入" value={"种子 " + M.inject.seed} note="确定性生成，换机器结果一样" width={950} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 22, width: 980 }}>
              这些口径决定了后面每个数字怎么读。先把它们钉死，再报成绩。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1130, top: 288, width: 720 }}>
            <CodeBlock
              title="点级打分（伪代码）"
              width={690}
              lines={[
                { t: "score(t) = max { s(W) | W 覆盖 t }" },
                { t: "" },
                { t: "tau = quantile(0.99, { s(W) | W 在训练段 })" },
                { t: "" },
                { t: "pred(t) = score(t) > tau", hi: true },
                { t: "" },
                { t: "// W 的起点铺满测试段，步长 1", dim: true },
                { t: "// 窗内日历跨度 > 10 天就直接丢", dim: true },
              ]}
            />
          </div>
        </AbsoluteFill>

        {/* 页四：路线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1000 }}>
            {SCENES.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "baseline", gap: 18, height: 62, borderBottom: i + 1 < SCENES.length ? "1px solid " + C.panelLine : "none" }}>
                <div style={{ width: 48, fontFamily: FONT.mono, fontSize: FT.mono, color: C.cyan }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ width: 220, fontFamily: FONT.sans, fontSize: FT.label, color: C.ink }}>{s.chapter}</div>
                <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.label, color: C.inkDim }}>{s.title}</div>
                <div style={{ width: 80, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{mmss(s.dur)}</div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 660 }}>
            <Card label="片长与进度" accent={C.violet}>
              <Row name="总时长" value={mmss(SCENES.reduce((a, s) => a + s.dur, 0))} note="讲稿即字幕" width={600} />
              <Row name="集数" value={M.progress.delivered + " / " + M.progress.total} note="本集是第 35 集" width={600} />
              <Row name="下一集" value={"E" + M.next.episode} note={M.next.title} width={600} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
              每段都能单独看懂，连起来是一条证据链：问题 → 定义 → 直觉 → 实现 → 验证 → 边界。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
