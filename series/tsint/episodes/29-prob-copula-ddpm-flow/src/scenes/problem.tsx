import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Stat, Verdict, Chip, Body, Mono, Formula, PairBar } from "../shared";

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 10), pageAt("problem", 20)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 872 }}>
            <Card label="问题 · 边缘与联合" accent={C.coral}>
              <Formula size={FT.lead} color={C.ink}>
                C(u, v) = Φ_Σ( Φ^(−1)(u), Φ^(−1)(v) )
              </Formula>
              <Body size={FT.body} style={{ marginTop: 16 }}>
                单变量预测只被要求说清边缘：均值、方差、分位数。CRPS 与 PICP 这些指标，全部只评边缘。
                可一旦要问「八只股票同时跌」的概率，边缘对完还不够 —— 联合分布的形状才是问题本身。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                边缘对 + 相关结构错 = 单变量指标全过，联合全错
              </Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 300, width: 848 }}>
            <Stat label="通道" value="8" sub="三组：白酒 / 银行 / 指数" accent={C.cyan} style={{ width: 808 }} />
            <Stat label="交易日" value={M.data.rows.toLocaleString("en-US")} sub={M.data.start + " → " + M.data.end} accent={C.cyan} style={{ width: 808, marginTop: 18 }} />
            <Stat label="滑动窗口" value={M.data.winCount.toLocaleString("en-US")} sub={"长度 " + M.data.winLen + " · 步长 " + M.data.winStride + " · 只取前 70% 定标"} accent={C.amber} style={{ width: 808, marginTop: 18 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 940 }}>
            <Card label="真实面板 · 同组与跨组相关">
              <div style={{ marginTop: 6 }}>
                <Row name="日收益 · 同组" value={M.copula.withinRet.toFixed(4)} note="白酒、银行、指数内部" color={C.cyan} width={900} />
                <Row name="日收益 · 跨组" value={M.copula.crossRet.toFixed(4)} note="不同行业之间" color={C.coral} width={900} />
                <Row name="差值" value={(M.copula.withinRet - M.copula.crossRet).toFixed(4)} note="看起来不小：行业结构有信号" color={C.amber} width={900} />
                <Row name="窗口内 · 同组" value={M.copula.withinWin.toFixed(4)} note="96 日窗口，先减窗内均值" color={C.cyan} width={900} />
                <Row name="窗口内 · 跨组" value={M.copula.crossWin.toFixed(4)} note="同样减窗内均值" color={C.coral} width={900} />
                <Row name="差值" value={(M.copula.withinWin - M.copula.crossWin).toFixed(4)} note="窗一变，行业结构几乎减半" color={C.amber} width={900} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 320, width: 788 }}>
            <PairBar
              a={{ label: "宽带 · 同组", value: M.copula.withinRet, text: M.copula.withinRet.toFixed(3) }}
              b={{ label: "宽带 · 跨组", value: M.copula.crossRet, text: M.copula.crossRet.toFixed(3) }}
              width={740}
              height={128}
              max={0.8}
              colorA={C.cyan}
              colorB={C.coral}
            />
            <div style={{ marginTop: 30 }}>
              <PairBar
                a={{ label: "窗内 · 同组", value: M.copula.withinWin, text: M.copula.withinWin.toFixed(3) }}
                b={{ label: "窗内 · 跨组", value: M.copula.crossWin, text: M.copula.crossWin.toFixed(3) }}
                width={740}
                height={128}
                max={0.8}
                colorA={C.cyan}
                colorB={C.coral}
              />
            </div>
            <Card label="读法" accent={C.violet} style={{ marginTop: 26 }}>
              <Body size={FT.body}>
                同一个市场，换一种估法，行业结构从 {((M.copula.withinRet - M.copula.crossRet) * 100).toFixed(0)} 个点掉到{" "}
                {((M.copula.withinWin - M.copula.crossWin) * 100).toFixed(0)} 个点。差值不是常数 —— 它取决于你减掉多少共模。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="所以，联合怎么估" accent={C.cyan}>
              <div style={{ marginTop: 4 }}>
                <Row name="一、Copula" value="先搬边缘，再拼相关" note="秩变换把每列变成正态分数，相关矩阵单独估" color={C.cyan} width={1080} />
                <Row name="二、扩散" value="先加噪，再退火" note="前向把数据化成噪声，反向学去噪，采样即生成" color={C.amber} width={1080} />
                <Row name="三、连续流" value="可逆映射搬整条密度" note="ODE 定义流，雅可比行列式修正体积" color={C.violet} width={1080} />
              </div>
            </Card>
            <div style={{ display: "flex", gap: 18, marginTop: 28 }}>
              <Verdict ok label="三条路都实现" />
              <Verdict ok label="三条路都有证据" />
              <Chip color={C.coral}>不做端到端训练</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1250, top: 300, width: 598 }}>
            <Card label="本集要回答" accent={C.violet}>
              <Body size={FT.body}>
                三种搬法各自把一个简单随机源搬到目标分布。本集只证明三件事：搬得对不对、数值稳不稳、边界在哪。
                不证明生成质量，也不拿它跟训练好的预测器比精度。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>
                读数是结构证据，不是效果证据
              </Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

