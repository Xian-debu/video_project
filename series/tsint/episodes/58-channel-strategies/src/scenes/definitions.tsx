import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, Formula, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";
import { CorrMatrix, DecisionLines, SpectrumBars, TokenCountRows } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>先定义<br />相关矩阵。</Body>
          <Body style={{ marginTop: 26 }}>
            六条通道，六乘六。对角是一，自己和自己；非对角是皮尔逊相关，取值负一到一。我们取绝对值，因为正负相关都算依赖。
          </Body>
          <Formula size={40} style={{ marginTop: 24 }} note="对标准化后的收益，按样本数减一归一">
            ρ<sub>ij</sub> = Σ z<sub>i</sub> z<sub>j</sub> / (n − 1)
          </Formula>
          <div style={{ display: "flex", marginTop: 20 }}>
            <KV k="矩阵" v="6 × 6" color={C.cyan} />
            <KV k="对角" v="1" color={C.violet} />
            <KV k="mean|ρ|" v="0.5109" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="相关矩阵：对称，对角为一，非对角取绝对值" accent={C.cyan}>
            <CorrMatrix corr={M.data.corr} codes={M.data.codes} cell={56} />
            <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>正负相关都算依赖；最大相关 0.8401 出现在茅台与五粮液之间。</div>
          </Card>
        </div>
        <Foot>平均绝对相关，一个数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>再看<br />特征值。</Body>
          <Body style={{ marginTop: 26 }}>
            相关矩阵对称半正定，六个特征值非负，加起来等于六，迹不变。特征值大，能量集中；特征值小，方向独立。排序，从大到小。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="λ₁" v="3.5953" color={C.cyan} />
            <KV k="λ₂" v="1.0091" color={C.violet} />
            <KV k="迹" v="6" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="真实数据的相关谱：六个特征值，降序" accent={C.cyan}>
            <SpectrumBars eig={M.data.eig} width={960} height={420} />
            <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              前三个占 87.3%，后面三个加起来不到 13%；λ₁ 一项就占 59.9%。
            </div>
          </Card>
        </div>
        <Foot>能量集中在少数方向。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>有效秩，<br />不是整数。</Body>
          <Body style={{ marginTop: 26 }}>
            它衡量有几个方向真正在用。公式是迹的平方除以平方和：全部相等等于通道数，一条独大接近一。真实数据二点四七。
          </Body>
          <Formula size={56} style={{ marginTop: 26 }} note="effRank = (Σλ)² / Σλ²">
            (Σλ)² / Σλ²
          </Formula>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="真实" v="2.4714" color={C.cyan} />
            <KV k="独立" v="4.0000" color={C.violet} />
            <KV k="高相关" v="1.1662" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="有效秩比特征值更好读：直接告诉你几组够用" accent={C.violet}>
            <Row name="全部相等" value="= C = 6" note="六个方向各占一份，完全独立" width={1000} color={C.cyan} />
            <Row name="一条独大" value="→ 1" note="能量集中在一个方向" width={1000} color={C.amber} />
            <Row name="真实数据" value="2.4714" note="介于两者之间，偏向集中" width={1000} color={C.violet} />
            <Row name="四舍五入" value="2 组" note="组数取 int(effRank + 0.5)" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>它直接告诉你，几组够用。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第三个定义，<br />决策规则。</Body>
          <Body style={{ marginTop: 26 }}>
            平均相关大于零点六，且有效秩不超过三，就直接混合。平均相关小于零点二，就直接独立。中间地带两两混合，组数取有效秩的四舍五入。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="混合" v="0.6 / ≤3" color={C.cyan} />
            <KV k="独立" v="≤ 0.2" color={C.amber} />
            <KV k="折中" v="round(effRank)" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="两个阈值，三个分支，没有默认值" accent={C.amber}>
            <DecisionLines at={0} />
            <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              阈值不是书里的定理，是我们定的参数；写进代码与偏差表，换阈值流程不变。
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>模式匹配</Chip>
              <Chip color={C.violet}>无默认分支</Chip>
              <Chip color={C.amber}>可复现</Chip>
            </div>
          </Card>
        </div>
        <Foot>两个阈值，都是我们定的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>token 数，<br />三个公式。</Body>
          <Body style={{ marginTop: 26 }}>
            独立是通道数乘每通道块数，六乘十六，九十六。混合只有十六。两两混合是组数乘块数，二乘十六，三十二。块长三十二点，五百一十二正好十六块。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="CI" v="C · m = 96" color={C.cyan} />
            <KV k="CM" v="m = 16" color={C.amber} />
            <KV k="H2" v="k · m = 32" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="同一段 512 点，三种切法得到三种 token 数" accent={C.violet}>
            <TokenCountRows width={980} />
            <div style={{ marginTop: 20, borderTop: "1px solid " + C.panelLine, paddingTop: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              m = 512 / 32 = 16；CI = 6 × 16 = 96；CM = 16；Hybrid 2 = 2 × 16 = 32。
            </div>
          </Card>
        </div>
        <Foot>三个数，一条线。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>注意力代价<br />怎么算。</Body>
          <Body style={{ marginTop: 26 }}>
            token 数的平方乘维度。维度统一三十二。独立是九十六平方乘三十二，混合是十六平方乘三十二，比值三十六。两两混合是三十二平方乘三十二，比独立省九倍。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="CI" v="294,912" color={C.cyan} />
            <KV k="CM" v="8,192" color={C.amber} />
            <KV k="H2" v="32,768" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一次注意力：T × T × d，乘法和加法同阶" accent={C.coral}>
            <Row name="CI" value="T = 96" note="96² × 32 = 294,912" width={1000} color={C.cyan} />
            <Row name="CM" value="T = 16" note="16² × 32 = 8,192" width={1000} color={C.amber} />
            <Row name="Hybrid 2" value="T = 32" note="32² × 32 = 32,768" width={1000} color={C.violet} />
            <Row name="比值" value="36 / 9" note="CI : CM = 36；CI : Hybrid = 9" width={1000} color={C.coral} />
          </Card>
        </div>
        <Foot>定义到此为止。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
