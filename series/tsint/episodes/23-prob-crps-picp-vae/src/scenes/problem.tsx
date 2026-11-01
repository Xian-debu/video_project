import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, K, CodeBlock } from "../shared";

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 9), pageAt("problem", 14), pageAt("problem", 20), pageAt("problem", 27)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 780 }}>
            <Card label="点预测" accent={C.inkFaint} style={{ height: 380 }}>
              <Formula size={64}>y&#770; = f(x)</Formula>
              <div style={{ marginTop: 26 }}>
                <Row name="误差" value="|y − y&#770;|" note="只看大小" width={700} />
                <Row name="低估 1 元" value="罚 1" note="和高估同价" width={700} />
                <Row name="高估 1 元" value="罚 1" note="真实收益左尾更长" width={700} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 820, top: 420, width: 780 }}>
            <Card label="分布预测" accent={C.cyan} style={{ height: 380 }}>
              <Formula size={64}>p(y | x)</Formula>
              <div style={{ marginTop: 26 }}>
                <Row name="误差" value="对分布积分" note="形状错了也要罚" width={700} />
                <Row name="低估 1 元" value="价更高" note="左尾更厚，赌错方向更贵" width={700} />
                <Row name="高估 1 元" value="价更低" note="这正是 CRPS 的形状" width={700} />
              </div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 850, width: CW }}>
            <Body size={FT.label}>点预测把方向抹掉了；真实收益的左右尾不一样厚，所以“同样差一块钱”并不等价。</Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 1120 }}>
            <Card label="连续排序概率分数" accent={C.cyan} style={{ height: 420 }}>
              <Formula size={56} style={{ lineHeight: 1.5 }}>
                CRPS(F, y) = ∫ ( F(x) − 1&#123;x ≥ y&#125; )² dx
              </Formula>
              <Body size={FT.label} style={{ marginTop: 20 }}>
                等价于把 pinball 损失按 τ 积分：每个分位数都罚一次，所以它同时管中心和形状。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 16 }}>积分域是整个实数轴；闭式解只在少数分布上存在</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 400, width: 560 }}>
            <Stat label="一个数就够" value="越小越好" sub="单位与平均误差相同，可以直接比大小" accent={C.amber} style={{ height: 190 }} />
            <Stat label="但估计有偏差" value="越高？" sub="下面两页把这个方向钉死" accent={C.coral} style={{ height: 190, marginTop: 40 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 900 }}>
            <Card label="采样估计的偏差（一千个种子平均）" accent={C.coral} style={{ height: 470 }}>
              <Row name="S = 10" value="0.0541" note={"理论 0.0564 · 偏高 " + "5.4 个百分点"} color={C.coral} width={820} />
              <Row name="S = 30" value="0.0184" note="理论 0.0188" color={C.coral} width={820} />
              <Row name="S = 100" value="0.0054" note="理论 0.0056" color={C.coral} width={820} />
              <Row name="S = 300" value="0.0008" note="理论 0.0019（种子少，噪声大）" color={C.amber} width={820} />
              <Row name="S = 1000" value="0.0031" note="已被噪声淹没" color={C.inkFaint} width={820} />
              <Mono size={FT.micro} color={C.inkFaint} style={{ display: "block", marginTop: 16 }}>偏差 = 实测估计 − 闭式真值；正值表示系统性偏高。</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 400, width: 780 }}>
            <Card label="为什么偏高" accent={C.cyan} style={{ height: 470 }}>
              <Formula size={48} style={{ lineHeight: 1.5 }}>E[估计] = CRPS + 0.5642 / S</Formula>
              <Body size={FT.label} style={{ marginTop: 18 }}>
                双求和把样本自己和自己也算成一对，距离按零记；分母仍是 2S²，两两距离项于是被低估。CRPS 减这一项，减得少了，估计就系统性偏高。
              </Body>
              <CodeBlock
                title="极小例：S = 1 时估计就是 |X − y|"
                lines={[{ t: "估计 = (1/S²) ΣΣ |x_i − x_j| / 2" }, { t: "i = j 项 = 0，被计入平均", dim: true }]}
                width={720}
                size={FT.code}
              />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 980 }}>
            <Card label="区间覆盖率：边界算不算" accent={C.amber} style={{ height: 430 }}>
              <Row name="定义" value="盖住的观测 / 总数" note="只能落在 1/n 的栅格上" width={900} />
              <Row name="n = 24" value="1/24 = 0.0417" note="覆盖率只能以这个步长跳" width={900} />
              <Row name="端点" value="算盖住" note="相对容差 1e-12，写在实现里" width={900} />
              <Row name="不写清" value="两个答案" note="同一组预测，两种覆盖率" width={900} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1020, top: 420, width: 700 }}>
            <CodeBlock
              title="Picp.hs"
              lines={[
                { t: "coveredWith tol l u y =" },
                { t: "  y >= l - t && y <= u + t" },
                { t: "  where t = tol * max 1 (max |l| |u|)" },
                { t: "" },
                { t: "tolFactor = 1e-12", hi: true },
              ]}
              width={700}
              size={FT.code}
            />
            <Body size={FT.meta} style={{ marginTop: 24 }}>
              这是本仓的约定，不是数学定理。写成约定，证据才能复现同一个数。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 1080 }}>
            <Card label="ELBO 里的 KL" accent={C.violet} style={{ height: 430 }}>
              <Row name="计划书" value="1.806853" note="早先版本里的数" color={C.coral} width={1000} />
              <Row name="手算" value="1.3068528194" note="μ = 1，σ² = 4" color={C.cyan} width={1000} />
              <Row name="差" value="0.5" note="恰好半个单位，来自系数写法" color={C.amber} width={1000} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1120, top: 420, width: 600 }}>
            <Formula size={44} style={{ lineHeight: 1.5 }}>KL = ½(μ² + σ² − 1 − log σ²)</Formula>
            <Body size={FT.meta} style={{ marginTop: 20 }}>
              手算把两项都摊开，程序算完必须同值；差一点就说明口径换过了。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
