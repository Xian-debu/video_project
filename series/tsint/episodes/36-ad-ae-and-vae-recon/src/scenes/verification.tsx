import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, PRPlot, prOf, Bars, Stat, UnitKey } from "../shared";

const Reading: React.FC<{ unit: UnitKey; width?: number }> = ({ unit, width = 640 }) => {
  const u = U(unit);
  return (
    <Card label={"读数 · " + u.name} accent={C.cyan}>
      <Row name="精确率 / 召回" value={u.precision.toFixed(4) + " / " + u.recall.toFixed(4)} note={"TP " + u.tp + " · FP " + u.fp + " · FN " + u.fn} width={width} />
      <Row name="命中段" value={u.detected + " / " + M.inject.truthRuns} note={"共 " + M.inject.truthPts + " 个真值点"} width={width} />
      <Row name="报警率" value={u.alertPct.toFixed(2) + "%"} note="干净测试点被判异常的比例" width={width} />
      <Row name="阈值" value={u.tau.toFixed(4)} note="训练段 99 分位" width={width} />
      <Row name="平均精度" value={u.ap.toFixed(4)} note="面积，不挑阈值" width={width} />
    </Card>
  );
};

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：数据与注入 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1040 }}>
            <Card label="数据与样本" accent={C.cyan}>
              <Row name="两只白酒" value={M.data.rows + " 行"} note={M.data.start + " 至 " + M.data.end} width={990} />
              <Row name="最大间隔" value={M.data.maxGap.days + " 天"} note={M.data.gapNote} width={990} />
              <Row name="训练 / 测试窗" value={M.windows.train + " / " + M.windows.test} note={"窗长 " + M.windows.C + " 天，步长一"} width={990} />
              <Row name="实际使用" value={M.windows.trainUsed + " 个"} note={"训练每 " + M.windows.trainStride + " 个取一个"} width={990} />
            </Card>
            <Card label="注入" accent={C.coral} style={{ marginTop: 18 }}>
              <Row name="尖峰" value={"10 段 · " + M.inject.truthPts + " 点里的 20"} note={"加 " + M.inject.spike.amp + "，长 " + M.inject.spike.len} width={990} />
              <Row name="斜坡" value={"10 段 · 255 点"} note={M.inject.drift.len + "，" + M.inject.drift.net} width={990} />
              <Row name="真值" value={M.inject.truthPts + " 点 / " + M.inject.truthRuns + " 段"} note={"只落在测试段，种子 " + M.inject.seed} width={990} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1190, top: 288, width: 660 }}>
            <Verdict ok label={M.meta.checks + " 项检查全过"} />
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 630, marginTop: 16 }}>
              用时 {M.meta.elapsedSec} 秒，单线程，种子固定。两项是负向结论，最后单独指出来。
            </Body>
            <Card label="分类型真值" accent={C.amber} style={{ marginTop: 20 }}>
              <Row name="尖峰点" value={M.byKind.ae16.spike.n + " 个"} note="短段，点数少" width={600} />
              <Row name="斜坡点" value={M.byKind.ae16.drift.n + " 个"} note="长段，占绝大多数" width={600} />
            </Card>
            <K style={{ display: "block", marginTop: 16 }}>点调整口径会放大短段命中，已知偏差。</K>
          </div>
        </AbsoluteFill>

        {/* 页二：瓶颈自编码器 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <PRPlot width={660} height={470} series={[{ name: "瓶颈自编码器", color: C.cyan, pts: prOf(M.curves.ae16) }]} />
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1030 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <Stat label="F1" value={U("ae16").f1.toFixed(4)} sub="点调整口径" valueSize={78} />
              <Stat label="召回" value={U("ae16").recall.toFixed(4)} sub={"抓到 " + U("ae16").detected + " / " + M.inject.truthRuns + " 段"} accent={C.amber} valueSize={54} />
            </div>
            <Reading unit="ae16" />
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 980, marginTop: 14 }}>
              曲线贴着右边：召回几乎满分，代价是七成干净点被误报。这个是阈值不迁移的直接后果。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：恒等模型 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="恒等模型，同一套注入" accent={C.coral}>
              <Row name="结构" value="100 → 100 → 100" note="线性，d 等于 C" width={950} />
              <Row name="参数" value={M.ae.params100.toLocaleString("en-US")} note="两万个参数" width={950} />
              <Row name="干净窗分数" value={M.ae.cleanMean100.toFixed(4)} note="恒为零" width={950} />
              <Row name="阈值 / F1" value="0.0000 / 0.0000" note="零阈值的直接后果" width={950} />
              <Row name="检测到" value={U("ae100").detected + " 段"} note="一段都没抓到" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 288, width: 730 }}>
            <Verdict ok={false} label="检测器死了，指标却显示它活着" />
            <Body style={{ width: 700, marginTop: 18 }}>
              它没有损失曲线，因为不需要训练：单位矩阵对单位矩阵就是精确解。如果只看训练损失，它是最完美的那个模型。
            </Body>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 700, marginTop: 14 }}>
              所以我们把它放进片子里，而不是放进备注。恒等陷阱不是玩具，它是这个目标函数允许的解。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页四：VAE beta 0.1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <PRPlot width={660} height={470} series={[{ name: "变分自编码器 β=0.1", color: C.violet, pts: prOf(M.curves.vae01) }]} />
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1030 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <Stat label="F1" value={U("vae01").f1.toFixed(4)} sub="点调整口径" valueSize={78} />
              <Stat label="每窗 KL" value={M.vae.klMean01.toFixed(3)} sub="β 放松，KL 较大" accent={C.violet} valueSize={54} />
            </div>
            <Reading unit="vae01" />
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 980, marginTop: 14 }}>
              八个维度，一千八百五十二个参数。重构项不除以维度，所以分数整体更高，阈值也跟着抬高。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页五：VAE beta 1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <PRPlot width={660} height={470} series={[{ name: "变分自编码器 β=1", color: C.amber, pts: prOf(M.curves.vae1) }]} />
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1030 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <Stat label="F1" value={U("vae1").f1.toFixed(4)} sub="点调整口径" valueSize={78} />
              <Stat label="每窗 KL" value={M.vae.klMean1.toFixed(3)} sub="β=1，KL 被压紧" accent={C.amber} valueSize={54} />
            </div>
            <Reading unit="vae1" />
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 980, marginTop: 14 }}>
              KL 压到原来的四成多，重构 MSE 从 {M.vae.reconMSE01.toFixed(4)} 抬到 {M.vae.reconMSE1.toFixed(4)}，F1 只动了 0.018。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页六：三条曲线与三个坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 820 }}>
            <Card label="三条曲线叠在一起" accent={C.violet} pad={14}>
              <PRPlot
                width={790}
                height={430}
                series={[
                  { name: "AE d=16", color: C.cyan, pts: prOf(M.curves.ae16) },
                  { name: "VAE β=0.1", color: C.violet, pts: prOf(M.curves.vae01), dash: true },
                  { name: "VAE β=1", color: C.amber, pts: prOf(M.curves.vae1) },
                ]}
              />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 780, marginTop: 12 }}>
              三条曲线几乎重合。瓶颈自编码器略高，两条变分曲线在召回端更靠左。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 930, top: 288, width: 920 }}>
            <Bars
              width={880}
              labelW={190}
              items={(["ae16", "vae01", "vae1"] as const).flatMap((k) => [
                { label: M.units[k].short + " 尖峰", value: M.byKind[k].spike.hit, text: M.byKind[k].spike.hit + " / " + M.byKind[k].spike.n, color: C.coral },
                { label: M.units[k].short + " 斜坡", value: M.byKind[k].drift.hit, text: M.byKind[k].drift.hit + " / " + M.byKind[k].drift.n, color: C.cyan, dim: true },
              ])}
            />
          </div>
        </AbsoluteFill>

        {/* 页七：两项负向结论 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>两条断言，把失败钉住。</div>
            <Body style={{ width: 1040, marginTop: 16 }}>
              这两条不是「通过」，是把这一集的负向结论写成可回归的检查。换数据、换参数，它们会立刻报警。
            </Body>
            {M.checks
              .filter((c) => c.name.startsWith("ae.alert") || c.name.startsWith("latent."))
              .map((c) => (
                <Card key={c.name} label={c.name} accent={c.ok ? C.amber : C.coral} style={{ marginTop: 16 }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, marginTop: 8, lineHeight: 1.5 }}>{c.detail}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 6 }}>{c.ok ? "成立" : "失败"} · 写进证据，不藏</div>
                </Card>
              ))}
          </div>
          <div style={{ position: "absolute", left: 1210, top: 300, width: 640 }}>
            <Verdict ok label="40 / 40，含两条负向" />
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 610, marginTop: 16 }}>
              一条说阈值不迁移：七成干净点被误报，干净点中位高于训练阈值。
              一条说异常没有飞出去：注入窗半径与正常窗之比在 0.8 到 1.2 之间。
            </Body>
            <Card label="路上踩到的三个坑" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="注入绝对值" value="分数失真" note="收盘价被换掉" width={580} />
              <Row name="注入窗重叠" value="20 段 → 18 段" note="真值被并段" width={580} />
              <Row name="相对误差" value="近零误报" note="绝对容限 1e-9" width={580} />
            </Card>
            <Chip color={C.amber} style={{ marginTop: 16 }}>下一集：多个正常模式</Chip>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
