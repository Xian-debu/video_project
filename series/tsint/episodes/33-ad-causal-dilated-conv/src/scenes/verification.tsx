import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, CurvePt, fmtInt, fmtF, fmtP, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Chip, KV, PRPlot, read } from "../shared";

const GROUPS: [string, number, string][] = [
  ["数据 / 样本", 4, "行数、sha、切分、无未来泄漏"],
  ["窗口", 4, "训练/测试数量与步长"],
  ["因果性", 3, "逐位不变、对称扰动"],
  ["感受野", 2, "公式 31、实测 31"],
  ["训练", 5, "损失下降、确定性、参数数"],
  ["注入", 6, "数量、率、幅度、长度"],
  ["打分与阈值", 3, "范围、分位、单调"],
  ["对比", 4, "F1 两种口径、AP、差"],
  ["上线口径", 4, "逐位、翻转、F1 移动"],
  ["交并比", 2, "尖峰 IoU、峰在段内"],
  ["双重卷积", 3, "两种读法、γ 线性"],
];

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 29), pageAt("verification", 45), pageAt("verification", 65)];
  const c = M.offline.causal;
  const s = M.offline.symmetric;
  const cs = M.stream.causal;
  const ss = M.stream.symmetric;
  const opAt = (pts: CurvePt[], tau: number) =>
    pts.reduce((a, b) => (Math.abs(b.tau - tau) < Math.abs(a.tau - tau) ? b : a));
  const opC = opAt(M.curves.causal, c.tau);
  const opS = opAt(M.curves.symmetric, s.tau);
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：四十个检查 + 离线 F1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            <Card label="四十个检查，一次跑完" accent={C.cyan}>
              {GROUPS.map(([name, n, note]) => (
                <div key={name} style={{ display: "flex", alignItems: "baseline", padding: "5px 0" }}>
                  <div style={{ width: 330, fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{name}</div>
                  <div style={{ width: 90, fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan }}>{n} 项</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>{note}</div>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, borderTop: "1px solid " + C.panelLine, paddingTop: 12 }}>
                <div style={{ width: 330, fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>合计</div>
                <div style={{ width: 140, fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan }}>40 / 40</div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>耗时 {fmtF(M.meta.runtimeSec, 1)} 秒</div>
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
            <Card label="离线 F1 · 最扫兴的一页" accent={C.amber}>
              <Row name="训练段" value={fmtF(c.trainF1.all, 4) + " / " + fmtF(s.trainF1.all, 4)} note="两个一模一样" width={580} />
              <Row name="测试段" value={fmtF(c.testF1.all, 4) + " / " + fmtF(s.testF1.all, 4)} note={"差 " + fmtF(M.offline.gap, 4)} width={580} color={C.amber} />
              <Row name="尖峰" value={fmtF(c.testF1.spike, 4) + " / " + fmtF(s.testF1.spike, 4)} note="按注入类型拆" width={580} />
              <Row name="形态替换" value="0.0000 / 0.0000" note="两个都看不见" width={580} color={C.coral} />
            </Card>
            <Card label="零点零零五五有多大" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                两千四百五十八个测试窗口里，就是十三个窗口。这不是一个能讲故事的差距，所以这一集不靠它。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：AP 反转 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 900 }}>
            <Card label="平均精度 · 离线喜欢偷看的那一个" accent={C.coral}>
              <Row name="因果卷积" value={fmtF(c.ap, 4)} note="没有未来信息" width={840} color={C.cyan} />
              <Row name="对称卷积" value={fmtF(s.ap, 4)} note="多看见前后两天" width={840} color={C.coral} />
              <Row name="差距" value={"+" + fmtF(s.ap - c.ap, 4)} note="离线指标反而奖励了偷看" width={840} />
            </Card>
            <Card label="为什么" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                尖峰的前后两天，对称核都看得见，重构更容易贴合，曲线因此更靠右上。操作点上的差距很小，平均精度分得开。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1130, top: 292, width: 720 }}>
            <Card label="PR 曲线 · 两条几乎重合" accent={C.cyan}>
              <PRPlot
                width={660} height={430} title=""
                series={[
                  { name: "因果", color: C.cyan, pts: M.curves.causal },
                  { name: "对称", color: C.coral, pts: M.curves.symmetric },
                ]}
                op={[
                  { r: opC.r, p: opC.p, color: C.cyan, label: "因果操作点" },
                  { r: opS.r, p: opS.p, color: C.coral, label: "对称操作点" },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：上线口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1080 }}>
            <Card label="上线口径 · 九千九百个位置" accent={C.cyan}>
              <div style={{ display: "flex", padding: "0 0 8px 0", borderBottom: "1px solid " + C.panelLine }}>
                <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>模型</div>
                <div style={{ width: 220, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>最大偏差</div>
                <div style={{ width: 200, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>翻转率</div>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>位置级 F1 离线 → 上线</div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", padding: "14px 0" }}>
                <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.h2, color: C.cyan }}>因果卷积</div>
                <div style={{ width: 220, fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan }}>{fmtF(cs.maxDelta, 3)}</div>
                <div style={{ width: 200, fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>{fmtP(cs.flipRate, 0)}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>
                  {fmtF(cs.full.f1, 4)} → <span style={{ color: C.cyan }}>{fmtF(cs.streaming.f1, 4)}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", padding: "14px 0", borderTop: "1px solid " + C.panelLine }}>
                <div style={{ width: 300, fontFamily: FONT.sans, fontSize: FT.h2, color: C.coral }}>对称卷积</div>
                <div style={{ width: 220, fontFamily: FONT.mono, fontSize: FT.body, color: C.coral }}>{fmtF(ss.maxDelta, 3)}</div>
                <div style={{ width: 200, fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>{fmtP(ss.flipRate, 1)}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>
                  {fmtF(ss.full.f1, 4)} → <span style={{ color: C.coral }}>{fmtF(ss.streaming.f1, 4)}</span>
                </div>
              </div>
            </Card>
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
              <Chip color={C.cyan}>因果：逐位相同</Chip>
              <Chip color={C.coral}>对称：方向是变好</Chip>
              <Chip color={C.violet}>补零只是模拟</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
            <Card label="注意方向" accent={C.coral}>
              <Body size={FT.body} color={C.ink}>
                对称模型上线版分数变高，不是变低：补零让它误报更多，召回涨了。但真实上线是逐点递推，补零只是其中一种模拟。
              </Body>
            </Card>
            <Card label="能写进合同的一条" accent={C.cyan} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                因果模型的两种口径完全一样。这是可以离线验证、也可以写进产品承诺的一条性质。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：黄金读数 + 结论 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <Card label="黄金读数" accent={C.cyan}>
              <Row name="尖峰注入段交并比" value={fmtF(c.iou.spike, 4)} note={"峰落在段内 " + fmtP(c.peakInTruth, 0)} width={1000} color={C.cyan} />
              <Row name="膨胀感受野" value="公式 31 / 实测 31" note="k 3 · d 1/2/4/8 · 四层" width={1000} />
              <Row name="梯度检查" value="8.7e-14" note="解析 vs 数值" width={1000} />
              <Row name="训练损失" value={fmtF(M.losses.causal[0].train, 4) + " → " + fmtF(M.losses.causal[M.losses.causal.length - 1].train, 4)} note={M.losses.causal.length + " 轮"} width={1000} />
              <Row name="双重卷积" value={fmtF(M.dual.maxReadingMean, 4) + " / " + fmtF(M.dual.gammaRatio, 3)} note="取最大读数为均值的 1.86 倍；取均值读法与均匀核逐位相同" width={1000} color={C.violet} />
            </Card>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
              <Chip color={C.cyan}>40 / 40 通过</Chip>
              <Chip color={C.amber}>{fmtF(M.meta.runtimeSec, 1)} 秒跑完</Chip>
              <Chip color={C.violet}>读数全部来自检查程序</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 630 }}>
            <Card label="结论三句" accent={C.violet}>
              <Body size={FT.body} color={C.ink}>
                一，因果卷积离线分数不高，和对称版差不多。
              </Body>
              <Body size={FT.body} color={C.ink} style={{ marginTop: 10 }}>
                二，因果卷积的上线口径可验证，两种口径逐位相同。
              </Body>
              <Body size={FT.body} color={C.ink} style={{ marginTop: 10 }}>
                三，对称卷积的离线分数会骗人，它奖励偷看。
              </Body>
            </Card>
            <Card label="这一集报什么" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                报的是可验证性，不是更高的准确率。这个区别很重要。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
