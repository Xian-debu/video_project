import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, CodeBlock, Formula, Head, K, M, Pages, PAD, Row, Verdict, fmtF } from "../shared";

const Mat: React.FC<{ rows: string[][]; accent?: string; label: string; sub?: string }> = ({ rows, accent = C.cyan, label, sub }) => (
  <div>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginBottom: 8 }}>{label}</div>
    <div style={{ display: "inline-block", border: "1px solid " + C.panelLine, borderRadius: 8, overflow: "hidden" }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex" }}>
          {row.map((v, j) => (
            <div key={j} style={{
              width: 96, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONT.mono, fontSize: FT.meta, color: accent,
              background: (i + j) % 2 === 0 ? C.panel : C.bgSoft, borderRight: "1px solid " + C.panelLine, borderBottom: "1px solid " + C.panelLine,
            }}>{v}</div>
          ))}
        </div>
      ))}
    </div>
    {sub ? <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 6, maxWidth: 300 }}>{sub}</div> : null}
  </div>
);

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="把式子拆成两个旋钮" goal="一个乘在整行，一个加在每一列" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <Formula size={70} style={{ textAlign: "center" }}>{"softmax( τ · s_ij + Δ_j )"}</Formula>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 520, width: CW, display: "flex", gap: 30 }}>
      <Card label="τ：标量" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>整行乘同一个数。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          它抬高或压低所有 logits，softmax 之后只改分布的尖平，不改「谁比谁高」的顺序。
        </Body>
      </Card>
      <Card label="Δ：长度 T 的向量" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>每个 key 加一个自己的数。</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          第 j 个 key 被抬高 Δ_j。不同的 key 被不同地抬高，顺序会变 —— 这才是新的自由度。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.amber}>1Δᵀ：每行同一份 Δ</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 870, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>
        Δ 只跟 key 走，不跟 query 走：第 1 个 query 和第 40 个 query 面对的是同一个 Δ。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="τ 就是温度，换了件衣服" goal="一个标量，解释掉了全部行为" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1120 }}>
      <CodeBlock
        title="恒等式 —— 不需要近似"
        width={1120}
        lines={[
          { t: "softmax(τ · s)  =  softmax(s / (1/τ))", hi: true },
          { t: "τ = 2      ⇒  temp = 0.5   -- 更尖" },
          { t: "τ = 0.5    ⇒  temp = 2     -- 更平" },
        ]}
      />
      <div style={{ marginTop: 28 }}>
        <Body size={FT.lead} color={C.ink}>
          温度是已有注意力里的一个超参。τ 乘上去，等于把它改小。
        </Body>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1270, top: 340, width: 560 }}>
      <Card label="实测" accent={C.cyan} style={{ height: 330 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 74, color: C.cyan }}>0.00</div>
        <K>τ=2 与温度 0.5 的最大差</K>
        <div style={{ marginTop: 14 }}><Verdict ok label="逐位相等" /></div>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16 }}>
          两条实现：一条乘 τ，一条除温度。结果是 ==，不是差 1e−16。
        </Body>
      </Card>
      <Card label="所以" accent={C.violet} style={{ marginTop: 20, height: 190 }}>
        <Body size={FT.h2} color={C.ink}>τ 换了名字，没换机制。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="Δ 加在哪一维，决定它存不存在" goal="同一个 3×3 例子，两种加法" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW, display: "flex", gap: 36 }}>
      <Card label="原始 logits 的 softmax" accent={C.cyan} style={{ width: 600, height: 520 }} pad={20}>
        <Mat label="z" rows={[["1", "0", "−1"], ["0", "1", "0"], ["1", "1", "0"]]} />
        <div style={{ marginTop: 18 }}>
          <Mat label="softmax(z)" accent={C.inkDim} rows={[["0.6652", "0.2447", "0.0900"], ["0.2119", "0.5761", "0.2119"], ["0.4223", "0.4223", "0.1554"]]} />
        </div>
      </Card>
      <Card label="按列加：z_ij + Δ_j，Δ = [0, 1, 2]" accent={C.amber} style={{ width: 600, height: 520 }} pad={20}>
        <Mat label="z + Δ（每一列抬一样多）" accent={C.amber} rows={[["1", "1", "1"], ["0", "2", "2"], ["1", "2", "2"]]} />
        <div style={{ marginTop: 18 }}>
          <Mat label="softmax(z + Δ)" accent={C.amber} rows={[["0.3333", "0.3333", "0.3333"], ["0.0634", "0.4683", "0.4683"], ["0.1554", "0.4223", "0.4223"]]} />
        </div>
        <K>顺序变了：第一行被抬成均匀分布</K>
      </Card>
      <Card label="按行加：z_ij + δ_i，δ = [2, −1, 0.5]" accent={C.coral} style={{ width: 600, height: 520 }} pad={20}>
        <Mat label="z + δ（每一行抬一样多）" accent={C.coral} rows={[["3", "2", "1"], ["−1", "0", "−1"], ["1.5", "1.5", "0.5"]]} />
        <div style={{ marginTop: 18 }}>
          <Mat label="softmax(z + δ)" accent={C.coral} rows={[["0.6652", "0.2447", "0.0900"], ["0.2119", "0.5761", "0.2119"], ["0.4223", "0.4223", "0.1554"]]} />
        </div>
        <K>和左边逐位相同：整行常数被吃掉了</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 890, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        书里的 1Δᵀ 是列偏置。抄成按行加，代码能跑，梯度为零。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="书里给的，和这一集做的" goal="没做的那一步，画面标出来" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
      <Card label="口径对照" accent={C.amber} style={{ height: 430 }}>
        <Row name="书里：τ、Δ 由 MLP 从 μ、σ 学出" value="我们没有训练" note="只做前向判决；训练需要第 3 章的预测骨架" color={C.coral} />
        <Row name="书里：目标是 NSformer 的预测收益" value="我们没测收益" note="只证明了机制等价，没有证明下游更好" color={C.coral} />
        <Row name="本仓口径：Δ 直接加在 logits 上" value="τ=1 时与书中逐位相同" note="书里的 Δ 就是这里的 Δ，不用缩放" color={C.cyan} />
        <Row name="本仓口径：数值稳定 softmax" value="减行最大值" note="沿用 EP9 的做法，不用 −Infinity" color={C.inkDim} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 830, width: CW, display: "flex", gap: 18, alignItems: "center" }}>
      <Chip color={C.amber}>SELF-AUTH A31</Chip>
      <Body size={FT.body} color={C.inkDim}>这三条边界写进了自授条目，后续集不能悄悄改口径。</Body>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, 0.3, 0.58, 0.82]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
