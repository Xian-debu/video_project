import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, md, modelColor, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Chip, Stat, fmtInt } from "../shared";

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：不声称 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>不声称的事，先摆出来。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              这一集只回答「三个替换在日频单票上有什么表现」，不回答「哪个方法更好」，也不声称任何一个能上生产。三个替换都是单点改动，增益和失败都只在这一只票、这一段数据上成立。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 296, width: 830 }}>
            <Row name="不声称 SOTA" value="无公开基准" note="一只票、六十四项检查，够说明现象，不够排名" />
            <Row name="不声称通用" value="A 股 · 白酒" note="换市场、换品种，全部重跑" />
            <Row name="不声称实时" value="日频 · 收盘后" note="批处理；没有在线检测的延迟与漂移处理" />
            <Row name="不声称稀疏更好" value="SBT 打平" note="稀疏没有带来增益，只带来更少的参数" color={C.coral} />
            <Row name="不声称重尾万能" value="TVAE 只赢在测试段" note="验证段还落后基线千分之五" color={C.coral} />
            <Body style={{ marginTop: 14, fontSize: FT.meta, color: C.inkDim }}>
              三个替换里只有两个赢，而且赢的位置不在验证段。这个结果本身就是边界的一部分。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：三笔债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>三笔债，这一集没还。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 28 }}>
              <Card label="一 · 稀疏没有增益" accent={C.cyan} pad={20}>
                <div style={{ fontFamily: FONT.mono, fontSize: 30, color: C.cyan, marginTop: 8 }}>0.1009 对 0.0987</div>
                <Body style={{ marginTop: 12, fontSize: FT.meta }}>
                  二值稀疏注意力打平稠密基线。窗口只有一百点，稠密注意力的成本本来就不是瓶颈；稀疏的价值可能要到更长的窗口才显现，这一集没有测。
                </Body>
              </Card>
              <Card label="二 · 验证段只有六十四窗" accent={C.violet} pad={20}>
                <div style={{ fontFamily: FONT.mono, fontSize: 30, color: C.violet, marginTop: 8 }}>64 窗</div>
                <Body style={{ marginTop: 12, fontSize: FT.meta }}>
                  验证段真值窗只有六十四个，阈值在这么小的样本上扫出来，本身就有方差。赢的两个验证段都没领先，可能正是这个方差。
                </Body>
              </Card>
              <Card label="三 · 窗口重叠九十九天" accent={C.amber} pad={20}>
                <div style={{ fontFamily: FONT.mono, fontSize: 30, color: C.amber, marginTop: 8 }}>99 天</div>
                <Body style={{ marginTop: 12, fontSize: FT.meta }}>
                  相邻窗口共享九十九天。一千二百二十九个测试窗不是独立样本，F1 的置信区间没法直接算。这一集只报点估计，不报区间。
                </Body>
              </Card>
            </div>
            <div style={{ marginTop: 26 }}>
              <Row name="三笔都留给后续" value="更长窗口 · 更大真值集 · 重叠样本的区间估计" note="不是这一集的旁枝，是下一集之后要还的主债" color={C.coral} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>下一集：把邻居请回来。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              这一集三个方法都在学一个参数化模型。下一集回到非参数：不训练，直接比距离。一近邻加动态时间规整，再加弹性集成。
            </Body>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <Chip color={C.cyan}>1-NN</Chip>
              <Chip color={C.violet}>DTW</Chip>
              <Chip color={C.amber}>弹性集成</Chip>
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, marginTop: 16 }}>
              {M.meta.next.id} · 约 {M.meta.next.minutes} 分钟
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 296, width: 830 }}>
            <Card label="从「学一个模型」换到「找最近的邻居」" accent={C.cyan} pad={22}>
              <Row name="1-NN" value="不训练" note="拿最近邻的距离当分数" />
              <Row name="DTW" value="允许时间轴伸缩" note="同形不同速的形态才对得上" />
              <Row name="弹性集成" value="多个邻居投票" note="距离尺度不同，集成要标准化" />
              <Body style={{ marginTop: 12, fontSize: FT.meta, color: C.inkDim }}>
                不变的问题：训练上学到的「正常」，到测试段还算不算正常。这一次，「正常」直接就是训练段本身。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  const keys = ["tvae", "dcd", "sbt"] as const;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：结论 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.2 }}>
              两个赢，
              <br />
              一个打平。
            </div>
            <Body style={{ marginTop: 26, width: 850 }}>
              替换一个假设，赢面不一样：重尾先验和双视图对比把测试段分数抬高了一大截，稀疏注意力只换来更少的连接。更重要的共同点：赢的两个验证段都没领先，增益全部出现在换分布之后。
            </Body>
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <Chip color={C.cyan}>64 项证据检查通过</Chip>
              <Chip color={C.amber}>状态：51 / 74 · 未发布</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 286, width: 800, display: "flex", flexDirection: "column", gap: 14 }}>
            {keys.map((k) => {
              const v = md(k);
              return (
                <Card key={k} label={v.name} accent={modelColor[k]} pad={14}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: 38, color: modelColor[k] }}>{v.f1.toFixed(4)}</span>
                    <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
                      F1 · 验证 {v.f1Val.toFixed(3)} · 阈值 {v.tau.toFixed(3)}
                    </span>
                  </div>
                </Card>
              );
            })}
            <Card label="基线" accent={C.inkDim} pad={14}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 30, color: C.inkDim }}>0.1301 · 0.1130 · 0.0987</span>
                <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>高斯 · patch-AE · 稠密</span>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：账本 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>这一集的账本</div>
            <div style={{ marginTop: 24 }}>
              <Row name="新增测试" value={M.meta.newCases + " 条"} note="SBT 14 · TVAE 18 · DCDetector 23" />
              <Row name="仓库合计" value={fmtInt(M.meta.tests.assertions) + " 条"} note={M.meta.tests.suites + " 套"} />
              <Row name="证据检查" value={M.meta.evidence.checks + " 项"} note={M.meta.evidence.seconds.toFixed(1) + " 秒跑完"} />
              <Row name="本集进度" value={M.meta.progress.delivered + " / " + M.meta.progress.total} note="全系列第 41 集" color={C.cyan} />
            </div>
            <div style={{ marginTop: 22 }}>
              <Chip color={C.amber}>状态：{M.meta.progress.delivered} / {M.meta.progress.total} · 未发布</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 286, width: 800 }}>
            <Card label="下一集" accent={C.cyan} pad={22}>
              <div style={{ fontFamily: FONT.serif, fontSize: 26, color: C.ink, lineHeight: 1.3 }}>{M.meta.next.title}</div>
              <Body style={{ marginTop: 10, fontSize: FT.meta }}>预估 {M.meta.next.minutes} 分钟。</Body>
            </Card>
            <Body style={{ marginTop: 18, width: 780 }}>
              三个替换，一个读数：假设换掉之后，分数涨不涨是次要的，先看它涨在验证段还是测试段。这一集到这里，我们下次见。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
