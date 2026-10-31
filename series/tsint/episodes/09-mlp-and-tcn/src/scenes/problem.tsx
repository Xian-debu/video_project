import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, KernelGrid, M, PAD, Pages, Row, Scene, SceneHead, Verdict, lf } from "../shared";

/* 一件真事：式 (2.62) 的减号，字面实现会看到未来。 */

const NumRow: React.FC<{ label: string; values: number[]; color: string; note: string; strike?: boolean }> = ({ label, values, color, note, strike }) => (
  <div style={{ marginTop: 14 }}>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ width: 250, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{label}</div>
      {values.map((v, i) => (
        <div key={i} style={{
          width: 84, height: 62, borderRadius: 10, border: "1px solid " + color,
          background: C.panel, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT.mono, fontSize: FT.h2, color: strike ? C.inkFaint : color,
          textDecoration: strike ? "line-through" : "none", fontVariantNumeric: "tabular-nums",
        }}>{v}</div>
      ))}
    </div>
    <K style={{ display: "block", marginTop: 8 }}>{note}</K>
  </div>
);

export const SProblem: React.FC = () => {
  const m = M;
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={[0, 0.3, 0.58, 0.8]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书页第三十四页，式二点六二写的是卷积。
          </div>
          <Build at={lf("problem", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1050 }}>
              <Card label="书里的式 (2.62) · p.34 · 一维卷积" accent={C.cyan} style={{ height: 300 }}>
                <Formula size={62} note="K 是核长；下标 t − K + k 意味着核是反过来用的">{"(f ∗ x)(t) = Σ k=1..K  f_k · x_{t−K+k}"}</Formula>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.09)}>
            <div style={{ position: "absolute", left: PAD + 1074, top: 312, width: 702 }}>
              <Card label="框架里的卷积" accent={C.coral} style={{ height: 300 }}>
                <Formula size={54} color={C.coral} note="等价于互相关：不翻转核">{"out_t = Σ k=0..K−1  w_k · x_{t+k}"}</Formula>
                <Body size={FT.meta} style={{ marginTop: 16 }}>一个减，一个加。差别就是，看不看得到未来。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 664, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              注意这个减号：它意味着，核是反过来用的。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            输入 1..5，核 1,2,3，左补两个零，逐项算。
          </div>
          <Build at={lf("problem", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1100 }}>
              <Card label="正确版本 · 翻转核 + 左补 K−1 个零" accent={C.cyan} style={{ height: 420 }}>
                <NumRow label="黄金值" values={m.hand.goldenY} color={C.cyan} note="第一个输出只有一项：3；第二个 2·1 + 3·2 = 8" />
                <NumRow label="计划里原来写的" values={m.hand.planY} color={C.coral} note="第二项 11 是手算错的；按式子直读应该是 8 —— 已登记勘误 E26" strike />
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 22 }}>
                  <Verdict ok={true} label="黄金值" /><K>全仓统一 [3, 8, 14, 20, 26]</K>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.4)}>
            <div style={{ position: "absolute", left: PAD + 1124, top: 306, width: 652 }}>
              <Card label="错在哪" accent={C.amber} style={{ height: 420 }}>
                <Body size={FT.body}>计划里的 11，是把第二项写成了 2·1 + 3·2 之外的组合。</Body>
                <Body size={FT.meta} style={{ marginTop: 14 }}>这一条不改代码，只改期望值：式子直读得 8。</Body>
                <Body size={FT.meta} style={{ marginTop: 14 }}>勘误登记后，测试的黄金值改为 3、8、14、20、26。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.44)}>
            <div style={{ position: "absolute", left: PAD, top: 760, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              现在看错误版本：同一组输入，同一个核，不翻转。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            不翻转的版本，第一个输出是 14；它用了还没发生的两步。
          </div>
          <Build at={lf("problem", 0.61)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1010 }}>
              <Card label="错误版本 · 互相关，从 t 往后看三步" accent={C.coral} style={{ height: 372 }}>
                <NumRow label="输出" values={m.hand.leakyY} color={C.coral} note="第一个 = 1·1 + 2·2 + 3·3 = 14，用了输入 2、3、4" />
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20 }}>
                  <Chip color={C.coral}>首值 {m.tcn.leaky.first}</Chip>
                  <Chip color={C.cyan}>正确版 {m.tcn.causal.first}</Chip>
                  <K>差出来的 11，来自还没发生的输入</K>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.66)}>
            <div style={{ position: "absolute", left: PAD + 1034, top: 306, width: 742 }}>
              <Card label="更麻烦的是：它还能训练" accent={C.amber} style={{ height: 372 }}>
                <Body size={FT.body}>损失一样往下掉，参数一样收敛到某个值。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>损失下降只能证明拟合，不证明正确。</Body>
                <K style={{ display: "block", marginTop: 18 }}>只有因果性测试能抓住它</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.72)}>
            <div style={{ position: "absolute", left: PAD, top: 712, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              我们的做法：改掉第十一步之后的输入，前十个输出逐位比，一位都不能变。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            因果性测试：前十个输出逐位不变，实测差值零。
          </div>
          <Build at={lf("problem", 0.83)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Card label="测试设计" accent={C.cyan} style={{ width: 1090, height: 360 }}>
                <Row name="输入" value="15 步序列" note="前 5 步不动，后 10 步全部换掉" width={1042} />
                <Row name="比对" value="前 10 个输出" note="逐位相等，容差为零，不用近似" width={1042} />
                <Row name="实测最大差值" value={String(m.tcn.causal.pastMaxdiff)} note="past_maxdiff = 0.0" color={C.cyan} width={1042} />
                <Row name="反例首值" value={String(m.tcn.leaky.first)} note="错误版会立刻被这条测试抓住" color={C.coral} width={1042} />
              </Card>
              <Card label="为什么值得单独测" accent={C.amber} style={{ width: 662, height: 360 }}>
                <Body size={FT.body}>这个测试比损失曲线更可信。</Body>
                <Body size={FT.meta} style={{ marginTop: 14 }}>一个看到未来的模型，损失会更低——因为未来就是答案。</Body>
                <Body size={FT.meta} style={{ marginTop: 14 }}>所以每次改卷积，先跑因果性测试。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("problem", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 706, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>
              这是这一集的第一件事，也是后面每一层的底线。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
