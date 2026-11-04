import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";
import { Heat, PolarCircle } from "../figs";

const sci = (v: number) => v.toExponential(1).replace("e-", "e−");

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一个点，<br />变成一个角度。</Body>
          <Body style={{ marginTop: 26 }}>
            每个窗口单独做最小最大缩放：缩到负一到正一。常数窗口给一个宽度为一的假区间，否则会除零。
            缩放是单调的，所以顺序不变，但它吃掉了绝对水平——这是后面反解要带回来的东西。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="缩放" v="[−1, 1]" color={C.cyan} />
            <KV k="角度" v="[0, π]" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <Card label="缩放与极角" accent={C.cyan} style={{ width: 440 }} pad={18}>
              <PolarCircle width={400} height={330} />
            </Card>
            <div style={{ width: 560 }}>
              <Formula size={28} color={C.cyan} note="先做最小最大缩放">x̃ = 2(x − min)/(max − min) − 1</Formula>
              <div style={{ height: 16 }} />
              <Formula size={28} color={C.violet} note="反余弦把 [−1,1] 映射到 [0,π]">φ = arccos(x̃)</Formula>
              <div style={{ height: 16 }} />
              <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8 }}>
                一个点变成一个角度。
                <br />
                两个角度相加、相减，
                <br />
                就得到两张图。
              </div>
            </div>
          </div>
        </div>
        <Foot>先缩放，再取极角 —— 两步都不含时间。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>和场与差场，<br />一张对称一张反对称。</Body>
          <Body style={{ marginTop: 26 }}>
            两个角度相加取余弦，得到和场；相减取正弦，得到差场。和场对称，对角线是两倍角的余弦；
            差场反对称，对角线恒为零。反解就从这条对角线开始。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="GASF" v="对称" color={C.cyan} />
            <KV k="GADF" v="反对称" color={C.violet} />
            <KV k="对角" v="0" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 26 }}>
            <Heat m={M.gaf.gasf40} width={330} signed title="和场 · cos(φi + φj)" diag note="对角被琥珀色标出" />
            <div style={{ width: 580 }}>
              <Formula size={34} color={C.cyan} note="对称：i 与 j 交换不变">GASF_ij = cos(φ_i + φ_j)</Formula>
              <div style={{ height: 14 }} />
              <Formula size={34} color={C.violet} note="反对称：交换变号，对角为零">GADF_ij = sin(φ_i − φ_j)</Formula>
              <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.8 }}>
                和场的对称性和差场的反对称性，不是训练出来的，是公式本身的性质。
                这两条性质让「对角线 + 第一行」足以还原整张图对应的序列。
              </div>
            </div>
          </div>
        </div>
        <Foot>对称性不是巧合，是公式的骨架。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>反解：<br />从对角线和第一行。</Body>
          <Body style={{ marginTop: 26 }}>
            对角线给出每个点的绝对值，因为余弦二倍角公式；符号还缺一半，用第一行补上。逐列比较两个候选角，
            选更接近的那个。配合缩放参数，就是完整反解。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="用到" v="对角 + 第一行" color={C.cyan} />
            <KV k="误差" v={sci(M.gaf.inverseMaxErr)} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="两步反解" accent={C.cyan} style={{ width: 1010 }} pad={24}>
            <Formula size={38} color={C.cyan} note="第一步：对角给出绝对值">|x_i| = √((1 + GASF_ii) / 2)</Formula>
            <div style={{ height: 16 }} />
            <Formula size={38} color={C.violet} note="第二步：第一行给出符号，逐列二选一">sign(x_i) = argmin |cos(φ_1 + φ_i) − GASF_1i|</Formula>
          </Card>
          <Card label="为什么一定能还原" accent={C.inkDim} style={{ marginTop: 16, width: 1010 }} pad={18}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.8 }}>
              绝对值由对角唯一确定，符号只有正负两种候选；第一行把每个角与第一个角绑在一起，逐列一比就能挑出来。
              唯一解不出来的情形是整体翻面：所有符号同时取反，图和第一行都完全不变。
            </div>
          </Card>
        </div>
        <Foot>反解是算术，不是拟合。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第三个坐标系：<br />转移矩阵。</Body>
          <Body style={{ marginTop: 26 }}>
            怎么切，是这一集的一个决定。按值切会被相等值卡住——收益里零很多，一卡一整箱。所以按秩切：排序后
            每箱个数一样，一百二十八个点八箱，每箱十六个。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="分箱" v="按秩" color={C.violet} />
            <KV k="每箱" v="16 点" color={C.cyan} />
            <KV k="矩阵" v="8 × 8" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 30 }}>
            <Heat m={M.mtf.w} width={330} signed={false} title="转移矩阵 W（8×8）" />
            <div style={{ width: 600 }}>
              <Row name="按秩分箱" value="每箱 16" note="相等值多时按值切会让一箱吃掉全部样本" width={580} color={C.violet} valueW={150} />
              <Row name="逐行归一" value="行和为 1" note="每行是一条概率分布；空行退化成均匀分布" width={580} color={C.cyan} valueW={150} />
              <Row name="铺回时间轴" value="128²" note="每个格子取 W 的对应行，图像行和因此是 16" width={580} color={C.amber} valueW={150} />
            </div>
          </div>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 990 }}>
            转移矩阵只数「相邻两箱」的配对，所以它记住的是怎么跳，不是哪天跳到哪。
          </div>
        </div>
        <Foot>状态、转移、铺开 —— 三步都有损。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
