import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt4, fmtInt, pagesOf } from "../shared";
import { RelErrorBars, SplitStrip } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>相对误差，<br />基线是一。</Body>
          <Body style={{ marginTop: 26 }}>
            预测的不是收益，是标准化后的价格路径：每个点减去窗口均值、除以窗口标准差。持久化基线把窗口最后一点原样重复二十次，
            它回答「如果什么都不变，误差多大」。所有模型误差都除以这个基线。
          </Body>
          <Formula size={40} style={{ marginTop: 24 }} note="小于一：比基线好；大于一：比基线差">
            rel = MAE / MAE<span style={{ fontSize: 24 }}>persist</span> = MAE / {fmt4(M.persistMae20)}
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="F=20：三条横线，一根竖线" accent={C.coral} style={{ width: 1020 }}>
            <RelErrorBars width={950} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            用相对误差，不同股票之间也能比较；这也是为什么本集的两个主数字都大于一，却仍然可比。
          </div>
        </div>
        <Foot>相对误差让不同量纲的窗口能放在一张表里。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>为什么用<br />平均绝对误差。</Body>
          <Body style={{ marginTop: 26 }}>
            均方误差被大波动主导，一个极端点能左右结论；平均绝对误差每个点同权，和基线对照更直白。代价是它对系统性偏差的惩罚更线性，
            所以我们同时看两端：第一步和第二十步。第一步接近一说明模型几乎没有信息，第二十步的变化才说明它有没有积累优势。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="第一步" v={fmt4(M.ar.rel1)} color={C.inkDim} />
            <KV k="第二十步 AR" v={fmt4(M.ar.rel20)} color={C.cyan} />
            <KV k="第二十步 NAR" v={fmt4(M.nar.rel20)} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="两种损失，为什么选一种用" accent={C.amber} style={{ width: 1020 }}>
            <Row name="均方误差" value="大波动主导" note="一个极端点能左右整条结论；量纲是价格的平方" width={972} color={C.amber} valueW={280} />
            <Row name="平均绝对误差" value="每点同权" note="和基线同量纲，除一下就是相对误差" width={972} color={C.cyan} valueW={280} />
            <Row name="本集" value="用 MAE" note="MSE 只作为辅助读数，记录在证据 JSON 里" width={972} color={C.inkDim} valueW={280} />
          </Card>
          <Card label="两端读数：第一步看不出差别，第二十步开始分家" accent={C.violet} style={{ marginTop: 16, width: 1020 }}>
            <Row name="F = 1" value={fmt4(M.ar.rel1) + " / " + fmt4(M.nar.rel1)} note="AR / NAR 同一个预测器，完全相同" width={972} color={C.violet} valueW={300} />
            <Row name="F = 20" value={fmt4(M.ar.rel20) + " / " + fmt4(M.nar.rel20)} note="差 21%，NAR 更稳" width={972} color={C.violet} valueW={300} />
          </Card>
        </div>
        <Foot>两端一起看，才知道优势是不是积累出来的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>六千六百行，<br />切三段。</Body>
          <Body style={{ marginTop: 26 }}>
            全集是六千六百个后复权收盘，从一九九八年十一月到二零二六年十月。测试段取二零二零到二零二二这三年，共七百二十八点——
            这一段波动大，模型的问题更容易露出来，能切一百九十七个窗口，每个五百一十二点。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="全集" v={fmtInt(M.data.seriesRows)} color={C.inkDim} />
            <KV k="测试段" v={M.data.segmentRows} color={C.coral} />
            <KV k="窗口" v={M.data.windows} color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三段：全集 / 测试段 / 训练池" accent={C.cyan} style={{ width: 1020 }}>
            <SplitStrip width={960} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            起点在全集第 {fmtInt(M.data.testStart)} 行（{M.data.segmentStart}）；测试段到 {M.data.segmentEnd} 为止。
          </div>
        </div>
        <Foot>测试段是挑出来的高波动段，不是随机抽的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>编码器重训，<br />头是闭式解。</Body>
          <Body style={{ marginTop: 26 }}>
            编码器不沿用上一集的权重，重新训练：结构一样，512 到 64 再回到 512，六万六千一百一十三个参数，二十轮，验证损失零点二三零三，
            最佳轮次正是第二十轮。用二零二零年前的窗口训练，测试段完全没碰过。线性头全是岭回归闭式解。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="训练" v={fmtInt(M.data.trainN)} color={C.cyan} />
            <KV k="验证" v={fmtInt(M.data.valN)} color={C.amber} />
            <KV k="测试" v={M.data.testN} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="编码器参数" value={fmtInt(M.params.enc)} sub="512-64-512，两层全连接" accent={C.cyan} style={{ width: 326 }} />
            <Stat label="验证损失" value="0.2303" sub="最佳轮次 #20，二十轮封顶" accent={C.amber} style={{ width: 326 }} valueColor={C.amber} />
            <Stat label="训练池窗口" value={fmtInt(M.data.preWindows)} sub="2020 年前，可切 4,418" accent={C.violet} style={{ width: 326 }} valueColor={C.violet} />
          </div>
          <Card label="闭式解：没有随机性，就没有选种子的空间" accent={C.cyan} style={{ marginTop: 16, width: 1020 }}>
            <Row name="AR 单步头" value="66 参数" note="64 维表示 + 直连 + 偏置，一个输出" width={972} color={C.cyan} valueW={260} />
            <Row name="NAR 头" value="1,320 参数" note="每个地平线各训一个，20 × 66" width={972} color={C.violet} valueW={260} />
            <Row name="惩罚系数" value="按地平线各选" note="0.01 / 0.1 / 1 / 10 / 100 / 1000，验证误差最小者胜" width={972} color={C.amber} valueW={260} />
          </Card>
        </div>
        <Foot>度量讲完，下一场看代码。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
