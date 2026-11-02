import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  MiniTable, GainBar, fmt4, fmtInt,
} from "../shared";

export const SMetrics: React.FC = () => {
  const at = pagesOf("metrics");
  const s = M.synth;
  return (
    <Scene id="metrics">
      <SceneHead id="metrics" />
      <Pages id="metrics" at={at}>
        {/* 页一：算账 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              先算一笔账。
            </div>
            <Body style={{ marginTop: 22, width: 750 }}>
              九十条序列，每条两百六十三个起点，两万三千六百七十个候选。每个候选都要在九十条序列上做滑动最小距离，总计算量两百多万次。实测二十二点一五秒。
            </Body>
            <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim, lineHeight: 1.8 }}>
              <div>23,670 候选 × 90 条序列</div>
              <div style={{ color: C.cyan }}>= 2,130,300 次滑动距离</div>
              <div>→ 22.15 s（Haskell，单线程）</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 300, width: 920 }}>
            <Card label="全搜索的成本结构" accent={C.cyan} pad={22}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Stat label="训练序列" value="90" sub="三类各 30 条" valueColor={C.ink} valueSize={40} />
                <Stat label="每条起点" value="263" sub="长度 8 / 12 / 20" valueColor={C.ink} valueSize={40} />
                <Stat label="候选总数" value={fmtInt(s.full.candidates)} sub="所有长度、所有序列" valueColor={C.cyan} valueSize={40} />
                <Stat label="实测耗时" value={fmt4(s.full.seconds, 2) + " s"} sub="证据程序全搜索一遍" valueColor={C.amber} valueSize={40} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：PIPs 候选 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              起点只许落在
              <br />
              十个拐点上。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              长度八放得下九个拐点，长度十二九个，长度二十也是九个。每条序列平均二十六个起点。九十条序列一共两千三百二十五个候选，占全搜索的百分之九点八二。
            </Body>
            <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim }}>
              候选少了 10.2 倍，时间也少了 10.2 倍。
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 286, width: 960 }}>
            <Card label="两条路径并排" accent={C.amber} pad={20}>
              <MiniTable
                head={["", "全搜索", "拐点起点", "差值"]}
                colW={[300, 200, 200, 200]}
                width={920}
                rowH={40}
                rows={[
                  ["候选数", fmtInt(s.full.candidates), fmtInt(s.pips.candidates), "−21,345"],
                  ["候选占比", "100%", (s.pips.candidateRatio * 100).toFixed(2) + "%", "−90.18%"],
                  ["搜索耗时", fmt4(s.full.seconds, 2) + " s", fmt4(s.pips.seconds, 2) + " s", fmt4(s.speedup, 2) + "×"],
                  ["最优增益", fmt4(s.full.gain), fmt4(s.pips.gain), "0.0000"],
                  ["测试准确率", fmt4(s.full.accuracy, 2), fmt4(s.pips.accuracy, 2), "0.0000"],
                ]}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <GainBar
                width={920}
                max={s.full.candidates}
                items={[
                  { label: "全搜索候选", value: s.full.candidates, color: C.inkDim },
                  { label: "拐点起点候选", value: s.pips.candidates, color: C.cyan, note: (s.pips.candidateRatio * 100).toFixed(2) + "%" },
                ]}
                labelW={260}
                valueFmt={(v) => Math.round(v).toLocaleString("en-US")}
              />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：增益没掉 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 800 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              看上去是
              <br />
              免费的午餐。
            </div>
            <Body style={{ marginTop: 20, width: 770 }}>
              全搜索零点八四七五 bit，拐点搜索也是零点八四七五 bit，增益差值是零。准确率都是一点零，六十条测试全对。候选少了十分之九，判别力一点没掉。
            </Body>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <Chip color={C.cyan}>增益差 0.0000 bit</Chip>
              <Chip color={C.amber}>准确率 1.0 = 1.0</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 920, top: 300, width: 920 }}>
            <Card label="三组读数，一个差值" accent={C.violet} pad={22}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Stat label="候选差" value="−21,345" sub="−90.18%" valueColor={C.cyan} valueSize={36} />
                <Stat label="耗时差" value="−19.98 s" sub="10.21 倍" valueColor={C.amber} valueSize={36} />
                <Stat label="增益差" value="0.0000" sub="bit，完全一样" valueColor={C.violet} valueSize={36} />
              </div>
              <div style={{ marginTop: 16 }}>
                <Row name="两条路径的模板" value="不是同一条" note="平局有运气成分" width={860} color={C.coral} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：两个注意 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              增益一样，
              <br />
              模板不一样。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              第一，两条路径找到的不是同一条模板。全搜索的最优起点是第八个点，拐点集合里没有八。第二，增益相同不等于模板相同：周期八的形状会重复出现，不同起点能截出几乎一样的片段。所以这个平局有运气成分。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="风险：周期 20 的长模板" accent={C.coral} pad={18}>
                <Body>
                  换成周期二十的长模板，起点就被拐点卡住了。这是 PIPs 的真实风险：合成数据上没漏，不代表真实数据不漏。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 292, width: 960 }}>
            <Card label="同一条序列，五个起点，同一个增益" accent={C.amber} pad={20}>
              <MiniTable
                head={["起点", "长度", "增益", "阈值"]}
                colW={[220, 180, 240, 240]}
                width={900}
                rowH={38}
                rows={M.top5.map((t) => [String(t.start), String(t.len), fmt4(t.gain), fmt4(t.threshold)])}
              />
              <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
                五条模板全部来自第 1 条训练序列，全部对第 3 类分裂最好。
              </div>
            </Card>
            <div style={{ marginTop: 14 }}>
              <Card label="拐点集合里没有 8" accent={C.coral} pad={18}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim }}>
                  PIPs = [0, 5, 9, 13, 17, 29, 33, 38, 42, 99]
                </div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：链路 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 820 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              一条链路，
              <br />
              只有一处近似。
            </div>
            <Body style={{ marginTop: 20, width: 790 }}>
              十倍加速来自候选数；候选数来自起点限制；起点限制来自十个拐点；十个拐点来自贪心选点。整条链路只有一处近似，它省掉了百分之九十的搜索，判别力在这份合成数据上没有掉。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Verdict ok label="23 / 23 项证据检查通过" />
              <Chip color={C.cyan}>36.8 秒</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 940, top: 300, width: 900 }}>
            <Card label="从结果追到原因" accent={C.cyan} pad={22}>
              <Row name="10.21× 加速" value="← 候选少 90.18%" note="2,325 / 23,670" width={840} color={C.cyan} />
              <Row name="候选少" value="← 起点只落在拐点" note="26 个起点 / 263" width={840} color={C.amber} />
              <Row name="起点少" value="← 十个 PIP" note="贪心选最远点" width={840} color={C.violet} />
              <Row name="唯一的近似" value="可能错过最优起点" note="周期 20 的模板就被卡住" width={840} color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
