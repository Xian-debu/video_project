import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtInt, fmtF, fmtRate, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, Num } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 14), pageAt("open", 24)];
  const c = M.offline.causal;
  const s = M.offline.symmetric;
  const sc = M.stream.causal;
  const ss = M.stream.symmetric;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：标题与离线一对 F1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1080 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 96, color: C.ink, lineHeight: 1.18 }}>
              卷积看见了
              <br />
              未来。
            </div>
            <Body size={FT.body} style={{ marginTop: 28, width: 1010 }}>
              一个普通的卷积，重构窗口中间那个点时，把它的前后十五天都读了进去。离线验证发现不了
              —— 验证也在整窗上做。换成上线口径，只剩过去，分数就换了。
            </Body>
            <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Chip color={C.amber}>同一批窗口 · 两种口径</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 296, width: 580 }}>
            <Card label="离线 · 测试 F1" accent={C.cyan}>
              <Row name="因果卷积" value={fmtF(c.testF1.all, 4)} color={C.cyan} note="左填充，不看未来" width={520} />
              <Row name="对称卷积" value={fmtF(s.testF1.all, 4)} color={C.coral} note="左右各看十五天" width={520} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                差 {fmtF(M.offline.gap, 4)}。差不多，谁也没赢。
              </Body>
            </Card>
            <Card label="一句话" accent={C.violet} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>这一集不报更高的 F1。</Body>
              <Body size={FT.body} color={C.ink}>报一个能验证的承诺。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：上线口径两行 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1060 }}>
            <Body size={FT.body} style={{ marginBottom: 24 }}>
              同一个模型，两种口径各跑一遍：整窗可见，和从每个位置往后补零。因果模型该逐位相同，对称模型该变。
            </Body>
            <div style={{ display: "flex", gap: 24 }}>
              <Card label="因果卷积 · 位置级 F1" accent={C.cyan} style={{ width: 505 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <Num value={sc.full.f1} digits={4} color={C.cyan} />
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.inkFaint }}>=</div>
                  <Num value={sc.streaming.f1} digits={4} color={C.cyan} />
                </div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
                  最大偏差 {fmtF(sc.maxDelta, 3)} · 翻转 {fmtRate(sc.flipRate)} · {fmtInt(sc.positions)} 个位置
                </Body>
              </Card>
              <Card label="对称卷积 · 位置级 F1" accent={C.coral} style={{ width: 505 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <Num value={ss.full.f1} digits={4} color={C.inkDim} />
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.inkFaint }}>→</div>
                  <Num value={ss.streaming.f1} digits={4} color={C.coral} />
                </div>
                <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
                  最大偏差 {fmtF(ss.maxDelta, 3)} · 翻转 {fmtRate(ss.flipRate)} · 变成另一个数
                </Body>
              </Card>
            </div>
            <div style={{ marginTop: 30 }}>
              <Body size={FT.body} color={C.inkDim}>
                注意方向：对称版补零后 F1 是变好的 —— 因为它误报更多、召回涨了。这说明离线分数根本预测不了上线行为，好和坏都可能。
              </Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1210, top: 300, width: 620 }}>
            <Card label="判据" accent={C.amber}>
              <Row name="因果" value="逐位相同" note="离线验证对上线精确" width={560} />
              <Row name="对称" value="不能逐位" note="离线只是另一个故事" width={560} />
            </Card>
            <Card label="零件" accent={C.violet} style={{ marginTop: 18 }}>
              <Row name="01" value="因果卷积" note="左填充，右边不填" width={560} />
              <Row name="02" value="膨胀核" note="感受野三撑到三十一" width={560} />
              <Row name="03" value="残差 TCN" note="四层叠起来还能训" width={560} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：数据与实现 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="数据 · 两只白酒股，三千九百三十二行" accent={C.cyan}>
              <Row name="股票" value={M.data.stocks.map((x) => x.name).join(" · ")} note="贵州茅台 · 五粮液" width={970} />
              <Row name="区间" value={M.data.start + " .. " + M.data.end} note={"最长缺口 " + M.data.maxGapDays + " 天 · " + M.data.maxGapAt} width={970} />
              <Row name="窗口" value={fmtInt(M.windows.dim) + " 维 · 训练 " + fmtInt(M.windows.train)} note={"测试 " + fmtInt(M.windows.test) + " 个 · 采样步长 " + M.windows.stride} width={970} />
              <Row name="注入" value={M.inject.spike + " 尖峰 + " + M.inject.swap + " 替换"} note={"各 " + fmtF(M.inject.spikeRatePct, 2) + "% · seed " + M.inject.seed} width={970} />
              <Row name="检查" value={M.meta.checks + " / " + M.meta.checkTotal} note={"耗时 " + M.meta.runtimeSec + " 秒 · " + M.meta.tests.suites + " 套 · " + fmtInt(M.meta.tests.asserts) + " 条"} width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="实现与证据" accent={C.violet}>
              <Row name="算法" value={"ts-base " + M.meta.algoCommit} note="CausalConv · DualConv · TCN" width={590} />
              <Row name="修" value={"ts-base " + M.meta.fixCommit} note="默认权重非零" width={590} />
              <Row name="证据" value={"ts-base " + M.meta.evidenceCommit} note={M.meta.checks + " 个检查，零失败"} width={590} />
              <Row name="数据" value={"ts-admin " + M.meta.dataCommit} note="逐字节校验" width={590} />
              <Row name="sha256" value={M.data.sha256.slice(0, 12) + "..."} note={fmtInt(M.data.rows) + " 行"} width={590} />
            </Card>
            <Card label="这一集的回答" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                离线 F1 分不出好坏，因为离线口径允许偷看。因果卷积的承诺不在分数，在两种口径逐位相同。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
