import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtF, fmtRate, pageAt, Pages, Scene, SceneHead, Card, Row, Body, LinePlot, PRPlot, Chip } from "../shared";

const op = (k: "causal" | "symmetric") => {
  const pts = M.curves[k];
  const tau = M.offline[k].tau;
  let best = pts[0];
  for (const q of pts) if (Math.abs(q.tau - tau) < Math.abs(best.tau - tau)) best = q;
  return best;
};

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 12), pageAt("intuition", 24)];
  const lc = M.losses.causal;
  const ls = M.losses.symmetric;
  const oc = op("causal");
  const os = op("symmetric");
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：感受野与泄漏 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <Body size={FT.body} style={{ marginBottom: 22, width: 970 }}>
              感受野三十一天：一个月前的价格，还在影响今天的重构。超出一个月的记忆，卷积要靠加层或加膨胀。
            </Body>
            <Card label="扰动实验 · 改掉 t 之后的数据" accent={C.cyan}>
              <Row name="因果卷积" value={"最大偏差 " + fmtF(M.stream.causal.maxDelta, 3)} note="前 60 位逐位相同" width={950} color={C.cyan} />
              <Row name="对称卷积" value={"最大偏差 " + fmtF(M.stream.symmetric.maxDelta, 3)} note="前 60 位跟着变" width={950} color={C.coral} />
              <Row name="扰动范围" value="31" note="把 t 往后挪，第一位变化的距离 = 感受野" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1160, top: 300, width: 670 }}>
            <Card label="三个数一起看" accent={C.amber}>
              <Row name="公式" value="31" note="1 + (k−1)·Σd" width={620} />
              <Row name="实测" value="31" note="扰动第一位之差" width={620} />
              <Row name="一个月" value="31 天" note="交易日大约 21 天" width={620} />
            </Card>
            <Card label="直觉" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                因果卷积能算的是“过去的三十一天”。它不是记得更久，只是把这一段看全了。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：训练曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1040 }}>
            <Card label="训练曲线 · 验证损失" accent={C.cyan}>
              <LinePlot
                width={980} height={470} padL={80} padB={58} padT={30}
                series={[
                  { name: "因果 训练", color: C.cyan, values: lc.map((x) => x.train) },
                  { name: "因果 验证", color: C.amber, values: lc.map((x) => x.val) },
                  { name: "对称 验证", color: C.violet, values: ls.map((x) => x.val), dash: true },
                ]}
                yMin={0} yMax={0.06} yFmt={(v) => v.toFixed(3)}
                hlines={[{ v: M.losses.causal[M.losses.causal.length - 1].train, color: C.inkFaint, label: fmtF(M.losses.causal[M.losses.causal.length - 1].train, 4) }]}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 650 }}>
            <Card label="读数" accent={C.violet}>
              <Row name="起点" value={fmtF(M.losses.causal[0].train, 4)} note="第 1 轮训练损失" width={600} />
              <Row name="终点" value={fmtF(M.losses.causal[M.losses.causal.length - 1].train, 4)} note={M.losses.causal.length + " 轮，降两个数量级"} width={600} />
              <Row name="轮数" value={M.losses.causal.length + " / " + M.params.epochs} note="早停没触发，是收敛了" width={600} />
            </Card>
            <Card label="可疑之处" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                残差让模型几乎学成恒等映射：输入原样输出，误差就很小。异常靠残差大，不靠重构完美 —— 这解释了下一组数字。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：PR 曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
            <Card label="PR 曲线 · 窗口级" accent={C.cyan}>
              <PRPlot
                width={930} height={470}
                series={[
                  { name: "因果卷积", color: C.cyan, pts: M.curves.causal },
                  { name: "对称卷积", color: C.coral, pts: M.curves.symmetric },
                ]}
                op={[
                  { r: oc.r, p: oc.p, color: C.cyan, label: "因果操作点" },
                  { r: os.r, p: os.p, color: C.coral, label: "对称操作点" },
                ]}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 300, width: 680 }}>
            <Card label="两条曲线几乎重合" accent={C.coral}>
              <Row name="因果 AP" value={fmtF(M.offline.causal.ap, 4)} note="曲线下面积" width={630} color={C.cyan} />
              <Row name="对称 AP" value={fmtF(M.offline.symmetric.ap, 4)} note="离线指标更喜欢偷看的那个" width={630} color={C.coral} />
              <Row name="差" value={fmtF(M.offline.symmetric.ap - M.offline.causal.ap, 4)} note="方向：偷看的更高" width={630} />
            </Card>
            <Card label="为什么" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                对称核看得见尖峰前后两天。同样的阈值，它更容易在对的位置报警 —— 离线指标奖励的正是这份未来信息。
              </Body>
              <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
                <Chip color={C.cyan}>因果 AP {fmtF(M.offline.causal.ap, 4)}</Chip>
                <Chip color={C.coral}>AP 差 {fmtF(M.offline.symmetric.ap - M.offline.causal.ap, 3)}</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
