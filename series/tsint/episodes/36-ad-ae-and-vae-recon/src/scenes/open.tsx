import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, CodeBlock, Stat, unitName, unitColor } from "../shared";
import { SCENES } from "../script";

const mmss = (s: number) => Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：这一集问一个更基础的问题 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.18 }}>
              重构误差，
              <br />
              没有概率含义。
            </div>
            <Body style={{ marginTop: 26, width: 860 }}>
              自编码器把窗口压进潜空间再还原，损失只看还原得准不准。隐层一宽，模型可以把输入原样抄回去：
              损失为零，分数也为零。这一集给潜空间加一个先验，再看异常到底有没有被抓到。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              <Verdict ok label={M.meta.checks + " 项证据检查通过"} />
              <Chip color={C.violet}>新测试 29 条 · 仓库 1,602 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 292, width: 810 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {(["ae16", "ae100", "vae01", "vae1"] as const).map((k) => (
                <Card key={k} label={unitName[k]} accent={unitColor[k]} pad={20}>
                  <Stat label="F1" value={M.units[k].f1.toFixed(4)} sub={unitColor[k] === C.coral ? "恒等模型，分数全零" : "点调整口径"} valueSize={52} valueColor={unitColor[k]} />
                </Card>
              ))}
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 790 }}>
              四个模型吃同一套注入、同一条阈值口径。恒等模型不是训练失败，是损失允许的精确解。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：三个问题，两套证据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1060 }}>
            <Card label="三个问题" accent={C.cyan}>
              <Row name="重构损失为什么量不到关系" value="目标里没这一项" note="只看输出像不像输入，不看潜空间怎么摆" width={1010} />
              <Row name="恒等陷阱要多宽" value="d ≥ C 就够了" note="线性解码器把编码器求逆，损失恰好为零" width={1010} />
              <Row name="KL 买到了什么" value="先验，不是检测" note="潜空间被钉住，F1 却没抬起来" width={1010} />
            </Card>
            <Card label="两个模块，一套证据" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="AE.hs" value={M.modules[0].lines + " 行"} note={M.modules[0].cases + " 条单元测试，纯函数"} width={1010} />
              <Row name="VAE.hs" value={M.modules[1].lines + " 行"} note={M.modules[1].cases + " 条单元测试，手写梯度"} width={1010} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1210, top: 288, width: 640 }}>
            <Card label="账本" accent={C.amber}>
              <Row name="新增测试" value={"29 条"} note={"两个套件"} width={580} />
              <Row name="仓库合计" value={"1,602 条"} note={M.meta.tests.suites + " 个套件"} width={580} />
              <Row name="证据检查" value={M.meta.checks} note={M.meta.elapsedSec + " 秒跑完"} width={580} />
            </Card>
            <Card label="数据" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="两只白酒" value={M.data.rows + " 行"} note="2010-01 至 2026-06" width={580} />
              <Row name="训练/测试窗" value={M.windows.train + " / " + M.windows.test} note={"窗长 " + M.windows.C + " 天"} width={580} />
              <Row name="注入" value={"10 + 10 段"} note={M.inject.truthPts + " 个真值点"} width={580} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：口径先立住 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="打分口径" accent={C.amber}>
              <Row name="点级打分" value="覆盖它的窗取最大" note="逐日判定，不是窗口级判定" width={960} />
              <Row name="阈值" value="训练段 99 分位" note="测试段一个数都不进阈值" width={960} />
              <Row name="命中" value="点调整口径" note="一段命中一次整段记 TP，验证页专门交代" width={960} />
              <Row name="分数" value="重构 MSE" note="VAE 用均值路径，不加采样噪声" width={960} />
            </Card>
            <CodeBlock
              title="打分与阈值"
              width={1000}
              lines={[
                { t: "score(t) = max { recon(W) | W 覆盖 t }", hi: true },
                { t: "tau      = quantile(0.99, { score(t) | t 在训练段 })" },
                { t: "pred(t)  = score(t) > tau" },
                { t: "  // 窗长 100 天，步长 1；窗内跨度 > 10 天就丢" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1160, top: 288, width: 690 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              这些口径决定后面每个数字怎么读。先把尺子钉死，再报成绩。
            </Body>
            <Card label="两个失败，分开说" accent={C.coral} style={{ marginTop: 26 }}>
              <Row name="分数归零" value="恒等映射" note="模型活着，检测器死了" width={630} />
              <Row name="全高" value="阈值不迁移" note="2021 年后干净点整体抬高" width={630} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：八页路线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            {SCENES.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "10px 0", borderBottom: "1px solid " + C.panelLine }}>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.mono, color: C.inkFaint, width: 36 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink, width: 120 }}>{s.chapter}</span>
                <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, flex: 1 }}>{s.title}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{mmss(s.dur)}</span>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 1240, top: 288, width: 610 }}>
            <Card label="片长" accent={C.violet}>
              <Row name="总时长" value={mmss(SCENES.reduce((a, s) => a + s.dur, 0))} note="按实测配音" width={550} />
              <Row name="集数" value={M.progress.delivered + " / " + M.progress.total} note={"本集是第 " + M.progress.delivered + " 集"} width={550} />
            </Card>
            <Card label="这一集的重点" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="先跑失效对照" value="再跑检测" note="顺序错了，叙事被数字带走" width={550} />
              <Row name="两条负向检查" value="写进断言" note="失败不是删掉，是钉住" width={550} />
            </Card>
            <K style={{ display: "block", marginTop: 18 }}>下一集：混合先验，GMM-VAE。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
