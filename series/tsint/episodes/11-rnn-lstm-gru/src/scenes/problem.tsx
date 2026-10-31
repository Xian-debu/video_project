import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Formula, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmtE, fmtF, lf } from "../shared";

/* 问题：梯度沿时间连乘会消失；公式停下之后，实验从这里接上。 */

export const SProblem: React.FC = () => {
  const m = M;
  const g = m.grad;
  const d = m.delay;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.27, 0.55, 0.78]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            梯度回去要穿过十九步，每一步乘一次矩阵和一个导数。
          </div>
          <Build at={lf("problem", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 296 }}>
              <Formula size={46} style={{ color: C.ink }}>∂L/∂h_0 = ∏ (t = 1…T)  W_hh · diag σ′(pre_t)</Formula>
              <K style={{ display: "block", marginTop: 12 }}>BPTT：链式法则沿时间展开，乘 T 次</K>
            </div>
          </Build>
          <Build at={lf("problem", 0.1)}>
            <div style={{ position: "absolute", left: PAD, top: 432, display: "flex", gap: 26 }}>
              <Card label="w_hh 取 0.5，导数取上界 1" accent={C.cyan} style={{ width: 875, height: 372 }}>
                <Row name="一步" value={fmtF(Math.pow(0.5, 1), 4)} note="只剩一半" width={820} />
                <Row name="五步" value={fmtE(Math.pow(0.5, 5), 2)} note="百分之三" width={820} />
                <Row name="十步" value={fmtE(Math.pow(0.5, 10), 2)} note="千分之一" width={820} />
                <Row name="十五步" value={fmtE(Math.pow(0.5, 15), 2)} note="十万分之三" width={820} />
                <Row name="十九步" value={fmtE(g.decay19, 2)} note="这就是画面上的第一个数" color={C.cyan} width={820} />
              </Card>
              <Card label="同一串连乘，把 0.5 换成 2" accent={C.coral} style={{ width: 875, height: 372 }}>
                <Row name="一步" value={fmtF(Math.pow(2, 1), 4)} note="翻一倍" width={820} />
                <Row name="五步" value={fmtF(Math.pow(2, 5), 1)} note="三十二倍" width={820} />
                <Row name="十步" value={fmtF(Math.pow(2, 10), 0)} note="一千倍" width={820} />
                <Row name="十九步" value={fmtF(Math.pow(2, 19), 0)} note="五十二万倍" color={C.coral} width={820} />
                <Row name="两边夹住" value="消失 / 爆炸" note="同一个连乘，只由谱半径决定方向" width={820} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里对这件事只写了一句话。
          </div>
          <Build at={lf("problem", 0.3)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1776 }}>
              <Card label="第二章 p.32–33 的原文与空白" accent={C.amber} style={{ width: 1776, height: 356 }}>
                <Row name="书里写了" value="指数衰减 / 爆炸" note="BPTT 展开之后，梯度会随步数指数衰减或者爆炸" width={1710} />
                <Row name="书里没写" value="任何数字" note="没有谱半径、没有衰减率、没有多少步算太长" width={1710} />
                <Row name="书里也没写" value="训练配方" note="学习率、批大小、轮数、初始化，一个字都没有（errata E01）" width={1710} />
                <Row name="所以" value="全部自定" note="这一集每个超参都是本仓的选择，画面上要标清楚" color={C.amber} width={1710} />
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.4)}>
            <div style={{ position: "absolute", left: PAD, top: 720, display: "flex", gap: 22 }}>
              <Chip color={C.amber}>没有训练配方</Chip>
              <Chip color={C.violet}>超参是本仓定的</Chip>
              <Chip color={C.cyan}>结论只能用这一套预算说</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            LSTM 加了一条辅路：cell 状态只做加法和逐元素乘。
          </div>
          <Build at={lf("problem", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 300 }}>
              <Formula size={46} style={{ color: C.violet }}>c_t = f_t ⊙ c_t−1 + i_t ⊙ c̃_t</Formula>
              <K style={{ display: "block", marginTop: 12 }}>式 (2.56) · 梯度沿 c 回去，只乘一个 f_t</K>
            </div>
          </Build>
          <Build at={lf("problem", 0.63)}>
            <div style={{ position: "absolute", left: PAD, top: 430, display: "flex", gap: 24 }}>
              <Stat label="RNN · 十九步后" accent={C.cyan} value={fmtE(g.decay19, 2)} sub="乘法链，参数取 0.5" valueColor={C.cyan} style={{ width: 570, height: 210 }} />
              <Stat label="LSTM · 二十步后" accent={C.violet} value={fmtF(g.transfer20, 4)} sub="f 取 0.999，只乘一个标量" valueColor={C.violet} style={{ width: 570, height: 210 }} />
              <Stat label="两者比值" accent={C.amber} value={fmtE(g.ratio, 3)} sub="五个数量级" valueColor={C.amber} style={{ width: 588, height: 210 }} />
            </div>
          </Build>
          <Build at={lf("problem", 0.7)}>
            <div style={{ position: "absolute", left: PAD, top: 696, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.violet, borderRadius: 12, padding: "18px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>公式说到这里就停了：它没说门控真能学会把 f 留在 0.999。</div>
              <K style={{ display: "block", marginTop: 6 }}>f 是学出来的，不是给定的</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            于是换一个任务，只测记忆本身：延迟复制。
          </div>
          <Build at={lf("problem", 0.81)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1120 }}>
              <Card label="任务定义 · 与训练损失无关" accent={C.cyan} style={{ width: 1120, height: 520 }}>
                <Row name="序列长度" value={d.T + " 步"} note="每一步都是一个时间点" width={1060} />
                <Row name="输入" value={m.params.cfg.d + " 维，只有第 0 维非零"} note="u_t ∈ {+1, −1}，其余七维恒为零" width={1060} />
                <Row name="标签" value="u 的第 T − d 步" note="不是最后一步，是往回 d 步的那个符号" color={C.cyan} width={1060} />
                <Row name="延迟" value={d.ds.join(" / ")} note="一个模型跑五个延迟，看谁先掉下来" width={1060} />
                <Row name="样本" value={d.train + " 训练 / " + d.test + " 测试"} note="测试集从 k = 1001 开始，与训练不重叠" width={1060} />
                <Row name="乱猜基线" value={fmtF(d.base, 1)} note="两个符号等概率，命中率就是一半" width={1060} />
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 1160, top: 312 }}>
              <CodeBlock title="uAt 生成（splitmix64）" width={616} size={17} lines={[
                { t: "uAt k t =" },
                { t: "  if testBit (mix64" },
                { t: "      (k*7919 + t*104729" },
                { t: "        + 12345)) 0" },
                { t: "  then 1 else -1" },
                { t: "", dim: true },
                { t: "-- 标签 = uAt k (T - d)" },
                { t: "-- 模型只看 0..T-1 步" },
              ]} />
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
