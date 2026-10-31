import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CW, Formula, Head, K, M, Pages, PAD, Stat, fmtF } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="第 2 章 / 数据层" title="注意力里的两个旋钮" goal="τ 是温度，Δ 是偏置" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW, display: "flex", gap: 26 }}>
      <Card label="EP9 已经讲过的" accent={C.cyan} style={{ flex: 1, height: 330 }}>
        <Formula size={40}>{"softmax( Q Kᵀ / √dk ) · V"}</Formula>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          每一行是一个 query，对全部 key 做一次加权平均。位置不进模型，先后顺序只由 token 的下标决定。
        </Body>
      </Card>
      <Card label="式(2.9) 多了两个东西" accent={C.violet} style={{ flex: 1, height: 330 }}>
        <div style={{ display: "flex", gap: 34 }}>
          <div>
            <div style={{ fontFamily: FONT.serif, fontSize: 58, color: C.violet }}>τ</div>
            <K>一个标量</K>
          </div>
          <div>
            <div style={{ fontFamily: FONT.serif, fontSize: 58, color: C.amber }}>Δ</div>
            <K>一个向量，长度 T</K>
          </div>
        </div>
        <Body size={FT.body} style={{ marginTop: 18 }}>
          书里说：二者都由 MLP 从均值和标准差里学出来。一个乘在 logits 上，一个加在 logits 上。
        </Body>
      </Card>
      <Card label="这一集要回答" accent={C.amber} style={{ flex: 1, height: 330 }}>
        <Body size={FT.body}>一、τ 换掉了什么？</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>二、Δ 加在哪一维？</Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>三、真实数据上，有偏置可纠吗？</Body>
        <div style={{ marginTop: 18 }}><Chip color={C.amber}>三个问题，三条判决</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        注意力不是「看谁」，是「按什么比例看」。两个旋钮拧的都是比例。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="三个问题，先摆上桌" goal="答案都在后面，判决用逐位比较" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW, display: "flex", gap: 26 }}>
      <Card label="问题一" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>τ 是新东西吗？</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          EP9 的注意力里已经有一个温度。τ 是那个温度换了个名字，还是另一个自由度？
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.cyan}>判决：温度</Chip></div>
      </Card>
      <Card label="问题二" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>Δ 加在哪一维？</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          每行加一个数，和每列加一个数，都叫「加偏置」。softmax 只认其中一种。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.violet}>判决：按列合法</Chip></div>
      </Card>
      <Card label="问题三" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>真实数据有偏置可纠吗？</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          合成数据上能把质量吸到末尾，不等于真实窗口里也有同样的偏置。
        </Body>
        <div style={{ marginTop: 16 }}><Chip color={C.amber}>判决：没有</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.inkDim}>
        三个问题，二十一项检查。没有训练，只有两条独立的代码路径和逐位比较。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 开场" title="四个数，先钉在墙上" goal="三个是合成的效应，一个是真实的「没有效应」" />
    <div style={{ position: "absolute", left: PAD, top: 370, width: CW, display: "flex", gap: 24 }}>
      <Stat label="合成 · 注意力熵" value={fmtF(M.synthetic.entropy_std, 4)} accent={C.cyan} style={{ flex: 1, height: 300 }}
        sub={<span>均匀分布是 ln 60 ≈ 4.094。3.31 已经偏尖。</span>} />
      <Stat label="同一条数据 · τ = 2" value={fmtF(M.synthetic.entropy_tau2, 4)} accent={C.violet} style={{ flex: 1, height: 300 }}
        sub={<span>τ 把 logits 乘 2，等于温度减半。质量更集中。</span>} />
      <Stat label="末段 vs 早段质量" value={"0.482 / 0.208"} accent={C.coral} style={{ flex: 1, height: 300 }}
        sub={<span>方差从 1 涨到 10，softmax 把质量吸到序列末尾。</span>} />
      <Stat label="真实窗口 · 三段最大差" value={fmtF(M.real.third_spread, 4)} accent={C.amber} style={{ flex: 1, height: 300 }}
        sub={<span>35.0% / 33.6% / 31.4%，几乎均匀 —— 没有可纠的偏置。</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        前三个数说明机制存在；第四个数说明这份真实数据没有那个问题。
        <span style={{ color: C.inkFaint }}> 两件事分开说。</span>
      </Body>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, 0.38, 0.7]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
