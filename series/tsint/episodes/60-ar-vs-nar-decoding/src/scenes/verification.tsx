import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, fmt2, fmt4, fmtInt, pagesOf } from "../shared";
import { ErrorHorizon, ExposureSplit, TimingBars, TwentyStepPlot } from "../figs";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>十八项，<br />一百二十二秒。</Body>
          <Body style={{ marginTop: 26 }}>
            证据程序跑完十八项检查，全部通过。时间主要花在编码器训练上。分组是数据四、自回归五、非自回归四、计时两项、曲线三项。
            数据组先确认四件事：六千六百行全集、七百二十八行测试段、一百九十七个窗口，以及测试段与全集切片逐值对齐。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="检查" v={M.summary.passed + "/" + M.summary.total} color={C.cyan} />
            <KV k="分组" v="4/5/4/2/3" color={C.violet} />
            <KV k="耗时" v="121.90 s" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="五项分组，逐项硬断言" accent={C.cyan} style={{ width: 1020 }}>
            <CheckGrid cell={30} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            证据 JSON {fmtInt(M.code.evidenceLines)} 行程序 · 检查全文写进 checks.txt · 全部由一条命令复现
          </div>
        </div>
        <Foot>全过，才有资格谈结论。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第八步，<br />两条线分家。</Body>
          <Body style={{ marginTop: 26 }}>
            横轴是 F，从一到二十；纵轴是相对误差。红线是持久化基线，恒等于一；青色是自回归，紫色是非自回归。F 小于等于六时两条曲线几乎重合，
            差距不到百分之二。第八步开始非自回归稳定领先，到第二十步差了百分之二十一。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="交叉点" v={"F = " + M.crossing} color={C.amber} />
            <KV k="F≤6 差距" v="< 2%" color={C.inkDim} />
            <KV k="F=20 差距" v="21%" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="误差随地平线：197 个窗口的平均" accent={C.cyan} style={{ width: 1020 }}>
            <ErrorHorizon width={970} height={400} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            交叉点定在第八步，判据是 NAR 首次低于 AR 的 98%——和书上 F ≈ 8 的说法一致。
          </div>
        </div>
        <Foot>交叉点不是设计出来的，是量出来的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>同一步，<br />同一个预测器。</Body>
          <Body style={{ marginTop: 26 }}>
            非自回归的头是一千三百二十个参数，六十六乘二十，每列一个输出点。第一步时两个模型的相对误差都是一点一三五二，因为它们共享同一个六十五维输入。
            复制函数检查：二十步 rollout 全等，这是纯定义检查，证明回灌写对了。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="NAR 头" v={fmtInt(M.params.narHead)} color={C.violet} />
            <KV k="F=1 相对误差" v={fmt4(M.ar.rel1)} color={C.cyan} />
            <KV k="恒等 MSE" v={fmt4(M.idMse)} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <Card label="四项定义检查" accent={C.cyan} style={{ width: 500 }} pad={18}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>
                <div>复制函数 · 二十步全等 <Verdict ok={M.ar.copyOk} /></div>
                <div>确定性 · 两次 rollout 逐位相同 <Verdict ok /></div>
                <div>NAR 前向 · 两次逐位相同 <Verdict ok /></div>
                <div>恒等任务 · 闭式解 MSE 0.0 <Verdict ok={M.idMse < 1e-9} /></div>
              </div>
              <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
                确定性不需要随机种子：整条链路是纯函数加闭式解。
              </div>
            </Card>
            <Card label="单个窗口：真值 / AR 回灌 / NAR 一次" accent={C.violet} style={{ width: 486 }} pad={18}>
              <TwentyStepPlot width={440} height={230} legend={false} />
              <div style={{ display: "flex", gap: 14, marginTop: 2, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
                <span style={{ color: C.ink }}>— 真实</span>
                <span style={{ color: C.cyan }}>— AR</span>
                <span style={{ color: C.violet }}>— NAR</span>
              </div>
            </Card>
          </div>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            参数 {fmtInt(M.params.arHead)} + {fmtInt(M.params.narHead)} + 编码器 {fmtInt(M.params.enc)}，全部闭式解一次拟合到账。
          </div>
        </div>
        <Foot>同一个输入，第一步就该给出同一个数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>快十五倍，<br />代价是曝光偏差。</Body>
          <Body style={{ marginTop: 26 }}>
            耗时对比在同一台机器、同一批窗口上做：自回归二十步零点三八秒，非自回归一次零点零二三秒，比值十五点七倍，超过验收线的五倍。
            差距主要来自二十次窗口复制。还有一件事：教师强制误差零点零七六二，自由回灌零点三五一零，差了零点二七四七，接近五倍。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="AR" v={fmt4(M.timing.arSeconds) + " s"} color={C.cyan} />
            <KV k="NAR" v={fmt4(M.timing.narSeconds) + " s"} color={C.violet} />
            <KV k="比值" v={fmt2(M.timing.ratio) + "×"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="197 个窗口上的总耗时（对数刻度）" accent={C.cyan} style={{ width: 1020 }}>
            <TimingBars width={950} />
          </Card>
          <Card label="训练看真值，推理看自己" accent={C.coral} style={{ marginTop: 16, width: 1020 }}>
            <ExposureSplit width={950} height={250} />
          </Card>
        </div>
        <Foot>训练时看真值，推理时看自己，这就是代价。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
