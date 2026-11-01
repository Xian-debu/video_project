import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Chip, CW } from "../shared";

const N = 31;
const CELL = 27;
const GAP = 3;

/** 三十一格的窗口：中心是待重构的点，红格是未来。 */
const LeakDiagram: React.FC<{ width: number }> = ({ width }) => {
  const rowY = [26, 132];
  const capY = [8, 114];
  const rows = [
    { label: "对称核", color: C.coral, from: 0, to: 30 },
    { label: "因果核", color: C.cyan, from: 0, to: 15 },
  ];
  return (
    <svg width={width} height={214} style={{ display: "block" }}>
      {rows.map((r, ri) => (
        <g key={r.label}>
          <text x={0} y={capY[ri]} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.meta}>{r.label}</text>
          {Array.from({ length: N }).map((_, i) => {
            const future = i > 15;
            const inKernel = i >= r.from && i <= r.to;
            const fill = inKernel ? (future ? C.coralDeep : C.cyanDeep) : "#101823";
            return (
              <rect key={i} x={i * (CELL + GAP)} y={rowY[ri]} width={CELL} height={30} rx={3}
                fill={fill} stroke={i === 15 ? C.ink : C.panelLine} strokeWidth={i === 15 ? 2 : 1} />
            );
          })}
          <text x={15 * (CELL + GAP) + 13} y={rowY[ri] + 46} textAnchor="middle" fill={C.ink} fontFamily={FONT.mono} fontSize={FT.micro}>t</text>
          <text x={30 * (CELL + GAP) + 13} y={rowY[ri] + 46} textAnchor="middle" fill={C.coral} fontFamily={FONT.mono} fontSize={FT.micro}>未来</text>
        </g>
      ))}
      <text x={0} y={206} fill={C.inkFaint} fontFamily={FONT.sans} fontSize={FT.micro}>红格 = 核看得见、但上线时拿不到的那一半；中心格 t 是待重构的点。</text>
    </svg>
  );
};

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 14), pageAt("problem", 28)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：泄漏示意 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <Body size={FT.body} style={{ marginBottom: 22, width: 980 }}>
              一个点怎么算重构误差：取它前后各十五天，拼成一个长度三十一的窗口，卷积核在上面滑。问题出在核看得见哪半边。
            </Body>
            <Card label="同一个窗口，两种核" accent={C.cyan}>
              <LeakDiagram width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1140, top: 300, width: 690 }}>
            <Card label="泄漏长什么样" accent={C.coral}>
              <Row name="改掉最后一天" value="位置 30" note="窗口右端的那一天" width={640} />
              <Row name="对称核" value="左边 15 位也变" note="它们的未来被改了" width={640} color={C.coral} />
              <Row name="因果核" value="左边 15 位不动" note="左填充，右边不填" width={640} color={C.cyan} />
            </Card>
            <Card label="为什么离线发现不了" accent={C.amber} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                因为离线验证也在整窗上做。训练和验证都拿得到未来，分数自然漂亮；上线时模型只拿到过去。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：两种口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Body size={FT.body} style={{ marginBottom: 26, width: 1120 }}>
              把“看不见未来”变成一个可以量的问题：同一个模型，两种口径各跑一遍。
            </Body>
            <div style={{ display: "flex", gap: 28 }}>
              <Card label="口径一 · 整窗可见" accent={C.inkFaint} style={{ width: 560 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>离线验证</div>
                <Body size={FT.body} style={{ marginTop: 10 }}>
                  重构第 t 位时，窗口里 t 之后的真实值都在。检查里就是这么算的，也是训练时看到的世界。
                </Body>
              </Card>
              <Card label="口径二 · 逐位可得" accent={C.cyan} style={{ width: 560 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>上线模拟</div>
                <Body size={FT.body} style={{ marginTop: 10 }}>
                  重构第 t 位时，t 之后全部补零。因果模型的前 t 位重构该与口径一逐位相同；对称模型会变。
                </Body>
              </Card>
              <Card label="这就是判据" accent={C.amber} style={{ width: 560 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>逐位相等</div>
                <Body size={FT.body} style={{ marginTop: 10 }}>
                  浮点相等是硬判据，不是统计判据。检查里直接比前 60 位的重构值，差零才算因果。
                </Body>
              </Card>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
              <Chip color={C.cyan}>同一批窗口</Chip>
              <Chip color={C.amber}>同一个阈值</Chip>
              <Chip color={C.violet}>两种口径</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：三个零件的分工 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Body size={FT.body} style={{ marginBottom: 24 }}>
              三个零件各有分工。因果卷积负责不看未来；膨胀核负责把感受野撑开；残差 TCN 负责叠深以后还能训。
            </Body>
            <Card label="分工" accent={C.cyan}>
              <Row name="因果卷积" value="CausalConv" note="左填充 k-1 乘 d 个零，右边一个不补" width={1060} color={C.cyan} />
              <Row name="膨胀核" value="d = 1, 2, 4, 8" note="四层 k=3，感受野 1+(k-1) 求和 d = 31" width={1060} color={C.amber} />
              <Row name="残差 TCN" value="y = ReLU(x + F(x))" note="F 是三次膨胀卷积加一次投影，参数量 1,086" width={1060} color={C.violet} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1220, top: 300, width: 610 }}>
            <Card label="外加一个双重卷积" accent={C.violet}>
              <Body size={FT.body} color={C.ink}>
                书上的式 4.16a 很短，正文却说核覆盖的子序列取最大。取最大和取均值是两种模型 —— 两种都实现，都留读数。
              </Body>
            </Card>
            <Card label="这一集要量什么" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="离线" value="两种核的 F1" note="看谁赢" width={560} />
              <Row name="上线" value="逐位与翻转" note="看谁可信" width={560} />
              <Row name="感受野" value="公式 31 / 实测 31" note="看谁对得上" width={560} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

