import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, CodeBlock, Verdict, LinePlot, fmtE, fmtInt } from "../shared";

const fmt4 = (v: number) => v.toFixed(4);

export const SVerification: React.FC = () => {
  const at = [
    0,
    pageAt("verification", 5),
    pageAt("verification", 11),
    pageAt("verification", 18),
    pageAt("verification", 28),
    pageAt("verification", 36),
    pageAt("verification", 41),
  ];
  const hist = M.vae.history;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 760 }}>
            <Stat label="证据检查" value="41 / 41" sub="五类，按职责分工" accent={C.cyan} style={{ height: 260 }} />
            <Stat label="单元测试" value="82 套" sub={fmtInt(M.meta.tests.asserts) + " 条断言，CRPS 17 / PICP 10 / ELBO 11"} accent={C.amber} style={{ height: 260, marginTop: 30 }} />
          </div>
          <div style={{ position: "absolute", left: PAD + 800, top: 420, width: 920 }}>
            <Card label="五类各自的职责" accent={C.violet} style={{ height: 550 }}>
              <Row name="数据" value={M.meta.checks.data + " 项"} note="形状、统计量、sha256" width={860} />
              <Row name="CRPS" value={M.meta.checks.crps + " 项"} note="手算、闭式、排序恒等式、偏差" width={860} />
              <Row name="覆盖率" value={M.meta.checks.picp + " 项"} note="合成、栅格、端点、零宽度" width={860} />
              <Row name="ELBO" value={M.meta.checks.elbo + " 项"} note="KL 手算、梯度、训练" width={860} />
              <Row name="真实读数" value={M.meta.checks.real + " 项"} note="覆盖率、CRPS、潜变量相关" width={860} />
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>全部通过，单次重跑 79 秒。</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 900 }}>
            <Card label="先证明输入没被换过" accent={C.cyan} style={{ height: 470 }}>
              <Row name="面板" value={fmtInt(M.meta.panel.rows) + " 行 × " + M.meta.panel.channels} note="每行一个交易日" width={840} />
              <Row name="收益" value={fmtInt(M.meta.panel.returns)} note="差分后可用样本" width={840} />
              <Row name="窗口" value={fmtInt(M.meta.panel.windows)} note="每个 768 维" width={840} />
              <Mono size={FT.micro} color={C.amber} style={{ display: "block", marginTop: 16, lineHeight: 1.5, wordBreak: "break-all" }}>{"sha256  " + M.meta.panel.sha}</Mono>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>与 manifest 逐字节一致。</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 420, width: 780 }}>
            <Card label="已知缺口" accent={C.coral} style={{ height: 470 }}>
              <Body size={FT.label}>
                面板里有交易日缺口，最长一段十一天。窗口按行号连续切，缺口不剔除。
              </Body>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                这会轻微污染个别窗口，但对覆盖率与 CRPS 的量级没有决定性影响；证据里如实记着。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1060 }}>
            <Card label="三方对账" accent={C.cyan} style={{ height: 470 }}>
              <Row name="黄金值" value={M.crps.atMean.toFixed(10)} note="y = μ 时的 CRPS，手算 1/√π" width={1000} />
              <Row name="排序式 vs 直接式" value={fmtE(M.crps.sortRel)} note="相对误差，S = 1000" color={C.cyan} width={1000} />
              <Row name="两套 CRPS" value={fmtE(M.crps.directRel)} note="点式与样本式" color={C.cyan} width={1000} />
              <Row name="闭式 vs 两万样本" value={fmtE(M.crps.closedErr)} note="三个独立种子取平均" color={C.amber} width={1000} />
              <Row name="Φ(1.6449)" value="0.9500" note="分布函数常数检查" width={1000} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1100, top: 400, width: 620 }}>
            <CodeBlock
              title="断言长什么样"
              lines={[
                { t: "checkClose 1e-9 gold crps" },
                { t: "checkRel 1e-9 sorted direct" },
                { t: "checkAbs 1e-3 closed samp" },
                { t: "" },
                { t: "-- 失败就进 failures 列表" },
                { t: "unless (null failures) (error ...)" },
              ]}
              width={620}
              size={FT.code}
            />
            <Verdict ok label="41 / 41 通过" />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 390, width: 1080 }}>
            <Card label="采样偏差：实测 vs 理论 0.564/S" accent={C.coral} style={{ height: 500 }}>
              {M.crps.bias.map((r) => (
                <Row
                  key={r.S}
                  name={"S = " + r.S}
                  value={r.bias.toFixed(4)}
                  note={"理论 " + r.theory.toFixed(4) + " · " + r.seeds + " 个种子"}
                  color={Math.abs(r.bias - r.theory) < 0.0015 * Math.max(1, r.theory) ? C.cyan : C.amber}
                  width={1020}
                />
              ))}
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1120, top: 390, width: 600 }}>
            <Stat label="反例（单种子）" value="0.2225" sub="S = 10，种子 1；比真值还低，方向反了" accent={C.coral} style={{ height: 250 }} />
            <Body size={FT.label} style={{ marginTop: 26 }}>
              所以画面只报“一千个种子的平均”，并同时写出样本数。单个估计值不能单独当结论。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1000 }}>
            <Card label="覆盖率：合成 / 真实" accent={C.cyan} style={{ height: 470 }}>
              <Row name="合成 80%" value={fmt4(M.picp.synth80)} note="名义 0.8，一万个标准正态样本" width={940} />
              <Row name="合成 95%" value={fmt4(M.picp.synth95)} note="名义 0.95" width={940} />
              <Row name="真实 80%" value={fmt4(M.picp.realCov80)} note="八通道，240 天" color={C.amber} width={940} />
              <Row name="真实 95%" value={fmt4(M.picp.realCov95)} note="接近名义值" color={C.amber} width={940} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 400, width: 680 }}>
            <Card label="四条边界断言" accent={C.violet} style={{ height: 470 }}>
              <Row name="零宽度" value="覆盖率 = 0" note="区间缩成一点，观测不在点上" width={620} />
              <Row name="端点" value="算盖住" note="y 正好等于 l 或 u" width={620} />
              <Row name="栅格" value="1/24" note="二十四个观测" width={620} />
              <Row name="越界" value="明确报错" note="形状不匹配不静默" width={620} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 390, width: 1000 }}>
            <Card label="ELBO：手算、梯度、训练" accent={C.violet} style={{ height: 500 }}>
              <Row name="KL 手算" value={M.vae.klHand.toFixed(10)} note="μ = 1，σ² = 4" width={940} />
              <Row name="梯度 vs 中心差分" value={fmtE(M.vae.gradErr)} note="全部 88 个参数（测试配置）" color={C.cyan} width={940} />
              <Row name="训练 loss" value={M.vae.lossStart.toFixed(2) + " → " + M.vae.lossEnd.toFixed(2)} note={"−" + M.vae.dropPct.toFixed(1) + "%"} width={940} />
              <Row name="结构" value={"d " + M.vae.d + " · h " + M.vae.h + " · z " + M.vae.z} note={fmtInt(M.vae.params) + " 个参数"} width={940} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 390, width: 680 }}>
            <Card label="六十轮，单调下降" accent={C.cyan} style={{ height: 500 }} pad={12}>
              <LinePlot
                series={[{ values: hist.loss, color: C.cyan, name: "loss" }]}
                width={650}
                height={410}
                title="每轮记录一次"
                yFmt={(v) => v.toFixed(0)}
              />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 390, width: 1100 }}>
            <Card label="真实读数：八个通道" accent={C.amber} style={{ height: 500 }}>
              {M.real.channels.slice(0, 8).map((c) => (
                <Row
                  key={c.channel}
                  name={c.channel}
                  value={c.crps.toFixed(4) + " / " + c.mae.toFixed(4)}
                  note={"覆盖 80% " + c.cov80.toFixed(4) + " · 95% " + c.cov95.toFixed(4)}
                  color={c.crps < c.mae ? C.cyan : C.coral}
                  width={1040}
                />
              ))}
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1140, top: 390, width: 580 }}>
            <Stat label="CRPS 均值" value={M.real.crpsMean.toFixed(4)} sub="全部低于对应平均误差" accent={C.cyan} style={{ height: 200 }} />
            <Stat label="平均误差均值" value={M.real.maeMean.toFixed(4)} sub="同一组预测" accent={C.coral} style={{ height: 200, marginTop: 24 }} />
            <Stat label="潜变量相关" value={M.vae.corr.toFixed(4)} sub="连续，不是分簇" accent={C.violet} style={{ height: 200, marginTop: 24 }} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
