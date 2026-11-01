import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, Chip, Bars, Formula, TagDot } from "../shared";

const spike = M.routes.filter((r) => r.variant === "spike");
const R = (key: string) => spike.find((r) => r.key === key)!;

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 19), pageAt("problem", 24)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：切一刀 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 970 }}>
            <Card label="问题 · 一个数字，两个结果">
              <Body size={FT.body} style={{ marginTop: 4 }}>
                每天算一个异常分数，分数越大越像异常。要在某个地方切一刀：左边正常，右边异常。切在哪，谁说了算？
              </Body>
              <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
                <TagDot color={C.cyan}>固定 3σ</TagDot>
                <TagDot color={C.amber}>训练段 1% 分位</TagDot>
                <TagDot color={C.violet}>SPOT</TagDot>
              </div>
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
                三种切法都是行业标准，都能在论文里找到。问题不是谁对谁错，是同一串分数，F1 能差多远。
              </Body>
            </Card>
            <Card label="第一种 · 人拍一个数" accent={C.cyan} style={{ marginTop: 22 }}>
              <Body size={FT.body} color={C.ink}>三倍标准差，教科书写了三十年。它不看数据的两端，只信正态。</Body>
            </Card>
            <Card label="第二种 · 看分位" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>取训练段 1% 分位，让 1% 的点被判异常。注意方向：要 1% 超限，取的是 99% 分位。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="第三种 · 看尾巴" accent={C.violet}>
              <Body size={FT.body} color={C.ink}>
                SPOT 不拍数，它假设尾部服从广义帕累托分布，再给定风险率反推阈值 —— 解一个方程，不是选一个常数。
              </Body>
              <Row name="尾部参数 xi" value={fmtF(M.spot.xi, 3)} note="负值：尾部有界，但界不是物理界" width={600} />
              <Row name="尺度 beta" value={fmtF(M.spot.beta, 4)} note={"尾部门槛 u = " + fmtF(M.spot.u, 4)} width={600} />
              <Row name="风险率" value={M.spot.risk} note={"q = " + M.spot.q + "；尾部点不足 " + M.spot.tailMin + " 时退回分位"} width={600} />
            </Card>
            <Card label="三个切点" accent={C.amber} style={{ marginTop: 20 }}>
              <Row name="固定 3σ" value={fmtF(M.taus.fixed, 2)} width={600} />
              <Row name="1% 分位" value={fmtF(M.taus.trainQuantile, 4)} note={"训练段；测试段分位 " + fmtF(M.taus.testQuantile, 4) + " 更小，说明没泄漏"} width={600} />
              <Row name="SPOT" value={fmtF(M.taus.spot, 4)} note="最高" width={600} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：一个分数，三条判据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 980 }}>
            <Body size={FT.body} style={{ width: 940 }}>
              先把三条判据写清楚，后面所有数字都从这三条来。
            </Body>
            <Formula style={{ marginTop: 26 }} size={40} note="k = 3；没有参数可学">
              固定：x &gt; μ + k·σ 判异常
            </Formula>
            <Formula style={{ marginTop: 30 }} size={40} note="q 是分位水平 0.99，不是超限率 0.01">
              分位：x &gt; Q_q(训练分数) 判异常
            </Formula>
            <Formula style={{ marginTop: 30 }} size={40} note="xi 为负，幂次翻转；尾部点不足 50 时退回分位">
              SPOT：τ = u + (β/ξ)·((n·r/n_t)^(−ξ) − 1)
            </Formula>
          </div>
          <div style={{ position: "absolute", left: 1170, top: 300, width: 650 }}>
            <Card label="同一批分数，三种切点" accent={C.cyan}>
              <Row name="固定 3σ" value={fmtF(R("fixed").tau, 2)} width={610} />
              <Row name="1% 分位" value={fmtF(R("quantile").tau, 4)} width={610} />
              <Row name="SPOT" value={fmtF(R("spot").tau, 4)} width={610} />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                固定和分位只差 0.08 —— 这条数据的分位刚好落在 3σ 附近。SPOT 直接跳到 4.79。
              </Body>
            </Card>
            <Card label="判据必须严格大于" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                等于阈值算正常。改成大于等于，边界点会多算一次；数值不变，实现变更。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：三个数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1130 }}>
            <Card label="同一批真值 · 三种切法" accent={C.violet}>
              <div style={{ display: "flex", marginTop: 8 }}>
                <div style={{ flex: "0 0 26%", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>切法</div>
                <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>预测点</div>
                <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>精度</div>
                <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>召回</div>
                <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>F1</div>
              </div>
              {spike.map((r, i) => (
                <div key={r.key} style={{ display: "flex", alignItems: "baseline", marginTop: 14 }}>
                  <div style={{ flex: "0 0 26%", fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>{r.label}</div>
                  <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color: C.inkDim }}>{r.pos}</div>
                  <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color: i === 2 ? C.violet : C.ink }}>{fmtF(r.p, 4)}</div>
                  <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color: i === 2 ? C.violet : C.ink }}>{fmtF(r.r, 4)}</div>
                  <div style={{ flex: "0 0 16%", textAlign: "right", fontFamily: FONT.mono, fontSize: FT.body, color: i === 2 ? C.violet : C.amber }}>{fmtF(r.f1, 4)}</div>
                </div>
              ))}
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18 }}>
                真值 {M.inject.spike.testTruth} 个点。固定与分位都全召回，但多抓了十几个误报；SPOT 一个不多一个不少。
              </Body>
            </Card>
            <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
              <Chip color={C.cyan}>阈值越高，精度越高</Chip>
              <Chip color={C.amber}>召回开始掉的时候就要停</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1280, top: 300, width: 540 }}>
            <Card label="预测点数" accent={C.cyan}>
              <Bars
                items={spike.map((r, i) => ({ label: r.key === "fixed" ? "固定" : r.key === "quantile" ? "分位" : "SPOT", value: r.pos, text: String(r.pos), color: i === 2 ? C.violet : i === 1 ? C.amber : C.cyan }))}
                width={480} rowH={58} max={34}
              />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
                真值线在 16。固定和分位多抓的不是异常，是噪声。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
