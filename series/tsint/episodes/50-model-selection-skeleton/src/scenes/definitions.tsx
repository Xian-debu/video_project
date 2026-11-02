import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Formula, K, PAD, Pages, Row, Scene, SceneHead, fmtInt, pagesOf } from "../shared";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>第一组指标：<br />误差有多大。</Body>
          <Body style={{ marginTop: 24 }}>
            平均绝对误差罚所有残差，均方误差罚大残差。同一个预测，两个指标可能给出不同的排序——这就是后面「指标换冠军」的来源。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 292, width: 1120 }}>
          <Card label="MAE · 绝对误差的平均" accent={C.cyan} style={{ marginBottom: 18 }}>
            <Formula size={46}>MAE = (1/n) · Σ |ŷᵢ − yᵢ|</Formula>
            <K style={{ marginTop: 6, display: "block" }}>黄金值 0.5（真值 1,2,3；预测 1.5,2,2）</K>
          </Card>
          <Card label="MSE · 先平方再平均" accent={C.violet} style={{ marginBottom: 18 }}>
            <Formula size={46}>MSE = (1/n) · Σ (ŷᵢ − yᵢ)²</Formula>
            <K style={{ marginTop: 6, display: "block" }}>黄金值 {M.metrics.mse.toFixed(4)}（同一组数）</K>
          </Card>
          <Card label="RMSE · 开根号，回到原量纲" accent={C.amber}>
            <Formula size={46}>RMSE = √MSE</Formula>
            <K style={{ marginTop: 6, display: "block" }}>黄金值 {M.metrics.rmse.toFixed(4)}，恒 ≥ MAE</K>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>第二组：<br />百分比与命中数。</Body>
          <Body style={{ marginTop: 24 }}>
            MAPE 把误差除以真值，真值接近零时分母会炸，所以实现里先跳过近零样本。Accuracy@k 看预测集合与真值集合的交集，这一集只拿它做黄金值检查。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 292, width: 1120 }}>
          <Card label="MAPE · 百分比误差" accent={C.cyan} style={{ marginBottom: 18 }}>
            <Formula size={44}>MAPE = (100/n) · Σ |(ŷᵢ − yᵢ) / yᵢ|</Formula>
            <K style={{ marginTop: 6, display: "block" }}>黄金值 {M.metrics.mape.toFixed(4)}% · 跳过 |y| &lt; 1e-8 的样本</K>
          </Card>
          <Card label="Accuracy@k · 前 k 个候选里的命中数" accent={C.violet}>
            <Formula size={44}>Acc@k = |top-k(ŷ) ∩ top-k(y)| / k</Formula>
            <K style={{ marginTop: 6, display: "block" }}>黄金值 {M.metrics.acc3.toFixed(4)}（预测 1,3,4 对真值 1,2,3，交集 2 个）</K>
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            日线预测更关心误差大小，不关心名次，所以主指标用 MAE，Accuracy@k 只做实现校验。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>选择器自己<br />也要打分。</Body>
          <Body style={{ marginTop: 24 }}>
            真值最优记作 t，池子挑出来的记作 â。â = t 记一次命中，比例就是 Hit@1。放宽到前两名是 Hit@2；真值最优在验证排序里的平均名次是 Average Rank，比 Hit@1 更细。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 292, width: 1120 }}>
          <Card label="Hit@k · 命中率" accent={C.cyan} style={{ marginBottom: 18 }}>
            <Formula size={46}>Hit@k = 命中数 / N</Formula>
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 10 }}>分子数：â 落在池子验证排序的前 k 名里，且 â = t。k = 1 就是 Hit@1。</Body>
            <K style={{ marginTop: 6, display: "block" }}>本集 Hit@1：池 3 {(M.hit.pool3 * 100).toFixed(0)}% · 池 5 {(M.hit.pool5 * 100).toFixed(0)}% · 全池 {(M.hit.full * 100).toFixed(0)}%</K>
          </Card>
          <Card label="Average Rank · 真值最优的名次" accent={C.violet}>
            <Formula size={46}>AvgRank = (1/N) · Σ rank<sub>valid</sub>(tᵢ)</Formula>
            <K style={{ marginTop: 6, display: "block" }}>本集 池 5 = {M.hit.avgRank.toFixed(2)}，Hit@2 = {(M.hit.hit2 * 100).toFixed(0)}%</K>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>网格用 AIC：<br />拟合好，还要罚参数。</Body>
          <Body style={{ marginTop: 24 }}>
            赤池信息量把拟合优度和参数个数放在一个数里。k 是参数个数，likelihood 用高斯残差近似。同一个样本上，AIC 随残差平方和单调，跟 MSE 的口径一致。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 300, width: 1120 }}>
          <Card label="AIC · 2k − 2lnL" accent={C.amber}>
            <Formula size={54}>AIC = 2k − 2·ln L</Formula>
            <div style={{ display: "flex", gap: 40, marginTop: 22 }}>
              <div>
                <K>黄金值</K>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.ink }}>{M.grid.aicGold.toFixed(0)}</div>
                <K>lnL = −100，k = 3</K>
              </div>
              <div>
                <K>罚项随 k 增长</K>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, marginTop: 6 }}>
                  参数越多，同样的残差平方和，AIC 越大。
                </div>
              </div>
            </div>
          </Card>
          <Card label="为什么用 AIC 而不是验证集误差" accent={C.cyan} style={{ marginTop: 18 }}>
            <Row name="验证段" value="只看一次切分" note="容易过拟合切点" width={1030} color={C.cyan} />
            <Row name="AIC" value="拟合 + 复杂度" note="同一份数据内部的相对比较" width={1030} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>648 到 81，<br />是八分之一。</Body>
          <Body style={{ marginTop: 24 }}>
            七项各取小范围，乘起来 648。锁住季节周期 m、差分 d、D 三个维度之后，剩四个自由维各三档，81 种。计划里的 54 和这个维度表对不上，按实际的 81 报。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>3 · 3 · 2 · 2 · 3 · 3 · 2 = {M.grid.full}</Chip>
            <Chip color={C.violet}>3⁴ = {M.grid.locked}</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 296, width: 1060 }}>
          <Card label="锁的是哪三个维度" accent={C.violet}>
            <Row name="m" value="季节周期" note="数据里估出来的，不是搜出来的" width={1000} color={C.cyan} />
            <Row name="d" value="差分阶" note="平稳性检验给定" width={1000} color={C.violet} />
            <Row name="D" value="季节差分阶" note="同样由检验给定" width={1000} color={C.amber} />
            <Row name="剩下的" value="p q P Q" note="各取 0–2，81 种组合" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            全网格 {fmtInt(M.grid.full)} · 锁后 {fmtInt(M.grid.locked)} · 比例 {(M.grid.locked / M.grid.full).toFixed(4)}
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
