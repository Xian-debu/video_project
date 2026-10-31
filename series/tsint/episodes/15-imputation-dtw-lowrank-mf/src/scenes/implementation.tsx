import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, CW, Head, K, KV, PAD, Pages, Row } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="三个模块，都在 Ch02" goal="输入带空格的矩阵，输出补全矩阵" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <CodeBlock width={CW} size={FT.mono} lines={[
        { t: "knnImpute   :: Int -> Int -> Matrix -> Either DtwError Matrix", hi: true },
        { t: "               k     w    m", dim: true },
        { t: "lowRankImpute :: Int -> Int -> Double -> Matrix -> Either LowRankError Matrix", hi: true },
        { t: "                 k     iters  tol", dim: true },
        { t: "mfImpute      :: Int -> Int -> Double -> Matrix -> Either MfError (Matrix, Matrix)", hi: true },
        { t: "                 k     iters  lam", dim: true },
      ]} />
      <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
        <Card label="DtwKnn" accent={C.cyan} style={{ flex: 1, height: 250 }}>
          <KV k="k" v="5" />
          <KV k="带宽 w" v="⌈T/10⌉，本例 25" />
          <KV k="权重" v="等权 1/k" note="距离只排序" />
        </Card>
        <Card label="LowRank" accent={C.violet} style={{ flex: 1, height: 250 }}>
          <KV k="k" v="5" />
          <KV k="迭代" v="300" />
          <KV k="容差" v="1e−10" note="缺失部分相对变化" />
        </Card>
        <Card label="MatrixFactorization" accent={C.amber} style={{ flex: 1, height: 250 }}>
          <KV k="k" v="5" />
          <KV k="迭代" v="300" />
          <KV k="岭项 λ" v="1e−3" note="解唯一化的最小代价" />
        </Card>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="三个显式选择，都不是默认" goal="退化行为要留出声来" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1000 }}>
      <Card label="① 初值：缺失格填该列观测均值" accent={C.violet} style={{ height: 250 }}>
        <Row name="填 0" value="从很远的地方出发" note="实测收敛慢两个数量级" color={C.coral} />
        <Row name="填列均值" value="本仓选择" note="列尺度已经对齐，投影不必先爬坡" color={C.cyan} />
        <Row name="整列全缺" value="均值为 0 / 0" note="于是这一列从 0 出发，也停在 0" color={C.coral} />
      </Card>
      <Card label="② 整列全缺：不报错，显式补零" accent={C.coral} style={{ height: 250, marginTop: 22 }}>
        <Body size={FT.body}>
          本可以让它返回错误、或者跳过这一列。本仓选择补零并把行为写进测试。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 12 }}>
          因为这一集要拿它和最近邻对照 —— 这个零是主角，不能藏起来。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 330, width: CW - 1040 }}>
      <Card label="③ 最近邻：等权，不按距离加权" accent={C.cyan} style={{ height: 250 }}>
        <Body size={FT.body}>
          近的邻居不额外加分。距离只用来选人，不用来分配话语权。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 12 }}>
          换权重会改变排序，这一集不允许这件事混进来。
        </Body>
      </Card>
      <Card label="因子不唯一，所以" accent={C.amber} style={{ height: 250, marginTop: 22 }}>
        <Body size={FT.body}>
          矩阵分解的断言只比重建矩阵，不逐位比因子。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 12 }}>
          另钉一条：F 乘 2、X̂ 除 2，重建矩阵逐位相等。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="三个模块，四十七条断言" goal="全仓五十九组、八百八十条" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <div style={{ display: "flex", gap: 26 }}>
        <Card label="DtwKnnSpec" accent={C.cyan} style={{ flex: 1, height: 260 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan, lineHeight: 1.1 }}>17</div>
          <K>断言</K>
          <Body size={FT.meta} style={{ marginTop: 12 }}>
            递推、带宽、非度量反例、整列回退。
          </Body>
        </Card>
        <Card label="LowRankSpec" accent={C.violet} style={{ flex: 1, height: 260 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.violet, lineHeight: 1.1 }}>16</div>
          <K>断言</K>
          <Body size={FT.meta} style={{ marginTop: 12 }}>
            秩恢复、软阈值轨迹、整列退化、初值敏感性。
          </Body>
        </Card>
        <Card label="MatrixFactSpec" accent={C.amber} style={{ flex: 1, height: 260 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.amber, lineHeight: 1.1 }}>14</div>
          <K>断言</K>
          <Body size={FT.meta} style={{ marginTop: 12 }}>
            重建闭环、缩放不变、岭项、整列退化。
          </Body>
        </Card>
      </div>
      <Card label="全仓" accent={C.ink} style={{ height: 200, marginTop: 26 }}>
        <div style={{ display: "flex", gap: 80 }}>
          <div><K>套件</K><div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>59 组</div></div>
          <div><K>断言</K><div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>880 条</div></div>
          <div><K>状态</K><div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>全绿</div></div>
          <div style={{ paddingTop: 6 }}><Chip color={C.cyan}>本集 +47</Chip></div>
        </div>
      </Card>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, 0.385, 0.9]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);