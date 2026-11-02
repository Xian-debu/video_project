import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Bars, Body, Card, CheckGrid, Chip, Formula, KV, PAD, Pages, pagesOf, Row, Scene, SceneHead } from "../shared";
import { MatrixFig } from "../figs";

const RP_ID: number[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const RP_ALL: number[][] = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>二十八项检查，<br />一项不漏。</Body>
          <Body style={{ marginTop: 24 }}>
            七组：数据、编码、图像、Fisher、卷积、投票、演示。每一项都打印实测值，不是打个勾；全部通过才允许出片。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="检查" v={String(M.meta.evidence.checks)} color={C.cyan} size={FT.h3} />
            <KV k="通过" v={String(M.meta.evidence.passed)} color={C.violet} size={FT.h3} />
            <KV k="耗时" v={M.meta.evidence.seconds.toFixed(1) + " s"} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 300, width: 1100 }}>
          <Card label="二十八项检查，按组染色" accent={C.cyan}>
            <CheckGrid width={1000} />
            <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              绿 = 通过 · 红 = 失败 · 出片前跑一次，全绿才往下走
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>四组黄金值，<br />手算的。</Body>
          <Body style={{ marginTop: 24 }}>
            库代码和证据脚本用的是同一套定义：屏幕上的数和测试里的数对得上，对不上就出不了片。只要有一处符号错，立刻变红。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>GASF</Chip>
            <Chip color={C.violet}>GADF</Chip>
            <Chip color={C.amber}>MTF</Chip>
            <Chip color={C.coral}>RP</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 660, top: 290, width: 1180 }}>
          <div style={{ display: "flex", gap: 28 }}>
            <MatrixFig matrix={M.enc.gasf} cell={86} gap={6} caption="GASF · [−1, 0; 0, 1]" />
            <MatrixFig matrix={M.enc.gadf} cell={86} gap={6} caption="GADF · [0, 1; −1, 0]" />
            <MatrixFig matrix={M.enc.mtf} cell={58} gap={5} caption="MTF · 行和 1" />
            <div>
              <MatrixFig matrix={RP_ID} cell={58} gap={5} caption="RP · ε=0.5 单位阵" />
              <div style={{ marginTop: 12 }}>
                <MatrixFig matrix={RP_ALL} cell={40} gap={4} caption="ε=2.5 全一" />
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>双射：从对角线<br />反解幅值。</Body>
          <Formula size={44} style={{ marginTop: 24 }} note="Gjj = 2x̃j² − 1，开方拿回绝对值">|x̃j| = sqrt((Gjj + 1) / 2)</Formula>
          <Body style={{ marginTop: 22 }}>
            符号拿不回来，要靠 GADF 联合定。min-max 之后误差是浮点精度，z-score 之后误差是 1.7 —— 同样是双射，差别只在前置归一化。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="反解误差：两个前置步骤，两个量级" accent={C.cyan}>
            <Row name="min-max" value="1e-16" note="浮点精度极限" width={960} color={C.cyan} />
            <Row name="z-score" value="1.7" note="截断砍尾" width={960} color={C.coral} />
            <Row name="符号" value="靠 GADF 联合定" note="对角线只给幅值" width={960} color={C.amber} />
          </Card>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>
            这一条是本集最重要的实现细节，也是我自己踩过的坑。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>Fisher 那条，<br />查的是实现。</Body>
          <Body style={{ marginTop: 24 }}>
            要求四个值都是有限正数，并且 GASF 和 MTF 不能相等。倍数 {(M.fisher.gasf / M.fisher.mtf).toFixed(4)}，不是刚好两倍 —— 类均值本身带噪声，方向对、量级对就够了。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="GASF / MTF" v={(M.fisher.gasf / M.fisher.mtf).toFixed(4)} color={C.cyan} size={FT.h3} />
            <KV k="最小值" v={M.fisher.mtf.toFixed(4)} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="四个 Fisher 判别比：全为正，量级不同" accent={C.cyan}>
            <Bars width={940} max={0.014} rowH={74}
              items={[
                { label: "GASF", value: M.fisher.gasf, text: M.fisher.gasf.toFixed(4), color: C.cyan },
                { label: "GADF", value: M.fisher.gadf, text: M.fisher.gadf.toFixed(4), color: C.violet },
                { label: "MTF", value: M.fisher.mtf, text: M.fisher.mtf.toFixed(4), color: C.amber },
                { label: "RP", value: M.fisher.rp, text: M.fisher.rp.toFixed(4), color: C.coral },
              ]} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>卷积那条，<br />写的是负结果。</Body>
          <Body style={{ marginTop: 24 }}>
            三条通道必须落在 {M.cnn.band[0]} 到 {M.cnn.band[1]} 之间，也就是三分类的随机带；双通道还必须不超过任一单通道。实测双通道最低 —— 我们没有改数据，也没有换标签，结果就是这样。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.coral}>随机带</Chip>
            <Chip color={C.amber}>双通道最差</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="三条通道：全在带内" accent={C.coral}>
            <Bars width={940} max={0.5} rowH={72}
              items={[
                { label: "GASF", value: M.cnn.gasf, text: M.cnn.gasf.toFixed(4), color: C.cyan },
                { label: "MTF", value: M.cnn.mtf, text: M.cnn.mtf.toFixed(4), color: C.amber },
                { label: "双通道", value: M.cnn.dual, text: M.cnn.dual.toFixed(4), color: C.coral },
              ]} />
            <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>随机带 {M.cnn.band[0]}–{M.cnn.band[1]} · 双通道比两条单通道都低</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>投票那条，<br />两半都过了。</Body>
          <Body style={{ marginTop: 24 }}>
            第一半：COTE 不能低于最差的单域。第二半：四个域都近随机时，COTE 不许超过最好的单域。两半都成立，说明多域集成的前提是至少两个域真的强。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.h3, color: C.ink }}>
            四个弱域加在一起，还是弱。
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="COTE 与三种对照" accent={C.violet}>
            <Row name="COTE" value={M.cote.cote.toFixed(4)} note="加权投票" width={980} color={C.violet} />
            <Row name="最差单域" value={M.cote.worst.toFixed(4)} note="第一半：不低于它，过了" width={980} color={C.coral} />
            <Row name="等权投票" value={M.cote.uniform.toFixed(4)} note="也不如它" width={980} color={C.amber} />
            <Row name="最好单域" value={M.cote.best.toFixed(4)} note="第二半：不超过它，过了" width={980} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            差 {((M.cote.best - M.cote.cote) * 100).toFixed(2)} 个百分点 —— 就是四个域都弱的那一点差距
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>复现性与<br />参数量。</Body>
          <Body style={{ marginTop: 24 }}>
            六十条小样本、一轮训练，同种子重训，两次损失逐位相同。参数量那条：双通道 {M.cnn.paramsDual}，单通道 {M.cnn.paramsSingle}，差 {M.cnn.paramsDual - M.cnn.paramsSingle} —— 正好是第一层的输入通道。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="双通道" v={String(M.cnn.paramsDual)} color={C.violet} size={FT.h3} />
            <KV k="单通道" v={String(M.cnn.paramsSingle)} color={C.cyan} size={FT.h3} />
            <KV k="差" v={String(M.cnn.paramsDual - M.cnn.paramsSingle)} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="两个检查，两个结论" accent={C.cyan}>
            <Row name="复现" value="损失逐位相同" note="并行、顺序、洗牌都不影响" width={980} color={C.cyan} />
            <Row name="参数量" value={M.cnn.paramsDual + " / " + M.cnn.paramsSingle} note="差值可解释，比较才公平" width={980} color={C.violet} />
            <Row name="防的是什么" value="算错账" note="双通道多几百个参数就不公平了" width={980} color={C.amber} />
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
