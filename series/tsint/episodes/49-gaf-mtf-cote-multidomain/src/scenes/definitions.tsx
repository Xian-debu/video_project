import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Formula, KV, PAD, Pages, pagesOf, Row, Scene, SceneHead, fmt2 } from "../shared";
import { EncPipe, MatrixFig, VoteFig } from "../figs";

const RP_ID: number[][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const RP_BAND: number[][] = [[1, 1, 0], [1, 1, 1], [0, 1, 1]];
const RP_ALL: number[][] = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>GASF：<br />角度两两相加。</Body>
          <Formula size={52} style={{ marginTop: 26 }} note="先压到 [-1,1]，再取反余弦">φi = arccos(x̃i)</Formula>
          <Formula size={52} style={{ marginTop: 22 }} note="GASF 是余弦的和">Gij = cos(φi + φj)</Formula>
        </div>
        <div style={{ position: "absolute", left: 820, top: 290, width: 1000 }}>
          <Card label="序列取 0 和 1：四个数是手算的" accent={C.cyan}>
            <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
              <MatrixFig matrix={M.enc.gasf} cell={120} gap={10} caption="[−1, 0; 0, 1]" />
              <div style={{ paddingTop: 6 }}>
                <Row name="φ(0)" value="90°" width={520} />
                <Row name="φ(1)" value="0°" width={520} />
                <Row name="cos(90°+90°)" value="−1" width={520} color={C.coral} />
                <Row name="cos(90°+0°)" value="0" width={520} />
                <Row name="cos(0°+0°)" value="1" width={520} color={C.cyan} />
              </div>
            </div>
          </Card>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            注意 0 的位置：零度角的余弦是 1，九十度是 0 —— 矩阵的每个元素都是一对点的关系。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>GADF：<br />角度两两相减。</Body>
          <Formula size={52} style={{ marginTop: 26 }} note="只改一个符号">Gij = sin(φi − φj)</Formula>
          <Body style={{ marginTop: 24 }}>
            对角线永远是零，矩阵反对称：转置再取负。GASF 编码幅值，GADF 编码变化方向；两张图叠起来才是完整表示。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 820, top: 290, width: 1000 }}>
          <Card label="同一组输入：黄金值是 0、1、−1、0" accent={C.violet}>
            <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
              <MatrixFig matrix={M.enc.gadf} cell={120} gap={10} caption="[0, 1; −1, 0]" />
              <div style={{ paddingTop: 6 }}>
                <Row name="对角" value="sin(0) = 0" note="φi 减 φi" width={520} />
                <Row name="对称性" value="−Gᵀ" note="转置再取负" width={520} color={C.violet} />
                <Row name="本集使用" value="只用 GASF" note="更稳，也是证据里检查的" width={520} color={C.amber} />
              </div>
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 720 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>MTF：<br />先分箱，再数转移。</Body>
          <Body style={{ marginTop: 24 }}>
            收益是长尾的，等宽分箱会把九成观测塞进中间一箱。本集用分位数，把序列切成 {M.enc.bins} 箱，每箱差不多的样本量。
          </Body>
          <Formula size={46} style={{ marginTop: 22 }} note="b 是箱号，Q 是箱数">P(bj | bi) = 转移计数 / 出发计数</Formula>
        </div>
        <div style={{ position: "absolute", left: 840, top: 290, width: 980 }}>
          <Card label="序列 0、1、0，两箱：" accent={C.amber}>
            <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
              <MatrixFig matrix={M.enc.mtf} cell={100} gap={9} caption="行和都是 1" />
              <div style={{ paddingTop: 6 }}>
                <Row name="箱数 Q" value={String(M.enc.bins)} width={440} />
                <Row name="分箱" value="分位数" note="不是等宽" width={440} color={C.amber} />
                <Row name="0 → 1" value="一次" width={440} />
                <Row name="1 → 0" value="一次" width={440} />
                <Row name="每行概率" value="各 1/2" width={440} color={C.cyan} />
              </div>
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>递归图：<br />什么时候回来过。</Body>
          <Formula size={44} style={{ marginTop: 24 }} note="ε 是阈值">Rij = 1 if |xi − xj| &lt; ε</Formula>
          <Body style={{ marginTop: 24 }}>
            它不编码幅值，也不编码顺序，只标记两个时刻的值够不够近。所以它最适合看周期和驻留 —— 序列 0、1、2，阈值取不同值，图从单位阵变成一条带子，再变成全一。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 290, width: 1060 }}>
          <Card label="同一个序列，三档阈值" accent={C.coral}>
            <div style={{ display: "flex", gap: 34 }}>
              <MatrixFig matrix={RP_ID} cell={70} gap={5} caption="ε = 0.5：单位阵" />
              <MatrixFig matrix={RP_BAND} cell={70} gap={5} caption="ε = 1.5：一条带子" />
              <MatrixFig matrix={RP_ALL} cell={70} gap={5} caption="ε = 2.5：全一" />
            </div>
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            带子的宽度就是重复结构：越宽，说明这段行情在更长的窗口里反复出现。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>一百二十八，<br />降到三十二。</Body>
          <Body style={{ marginTop: 24 }}>
            编码出来是方阵，边长等于窗口长度；直接喂卷积太大，也不稳。四种编码统一用不重叠的均值池化降到 {M.enc.side}×{M.enc.side}，卷积网络才能公平比较。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="原图" v={M.data.length + "×" + M.data.length} color={C.inkDim} size={FT.h3} />
            <KV k="池化" v={M.enc.pool + "×" + M.enc.pool} color={C.amber} size={FT.h3} />
            <KV k="结果" v={M.enc.side + "×" + M.enc.side} color={C.cyan} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 320, width: 1060 }}>
          <EncPipe width={1020} />
          <div style={{ marginTop: 28 }}>
            <Card label="没有参数的一步" accent={C.violet}>
              <Row name="128 ÷ 32" value="4" note="每个格子取 4×4 的平均" width={980} />
              <Row name="16000 多格" value="1024 格" note="格子变少，信息不变" width={980} color={C.cyan} />
              <Row name="为什么统一" value="公平比较" note="四种编码同一尺寸进网络" width={980} />
            </Card>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>投票器：<br />按准确率加权。</Body>
          <Formula size={44} style={{ marginTop: 24 }} note="w 是归一后的权重，v 是该域投给每个类的票">c = argmax Σw · v</Formula>
          <Body style={{ marginTop: 22 }}>
            权重来自验证集准确率，归一之后加起来等于一。平票时用严格大于比较，保留更小的类号 —— 结果是确定的，不看运行顺序。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 300, width: 1080 }}>
          <Card label="权重 0.3478 / 0.3913 / 0.2609" accent={C.violet}>
            <VoteFig width={960} />
          </Card>
          <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
            <KV k="一类票" v={fmt2(0.3913 + 0.2609)} color={C.cyan} size={FT.h3} />
            <KV k="零类票" v={fmt2(0.3478)} color={C.coral} size={FT.h3} />
            <KV k="结果" v="一类" color={C.violet} size={FT.h3} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
