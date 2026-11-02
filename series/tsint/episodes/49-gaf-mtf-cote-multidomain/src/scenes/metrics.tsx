import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Bars, Body, Card, Chip, KV, MiniTable, PAD, Pages, pagesOf, Row, Scene, SceneHead, fmtInt } from "../shared";
import { CnnArch, DomainFig } from "../figs";

const CL = ["下行", "震荡", "上行"];
const CLC = [C.coral, C.cyan, C.violet];

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>二十只股票，<br />八千多条窗口。</Body>
          <Body style={{ marginTop: 24 }}>
            沪深三百里按行业门类分层，每个门类取一只，日线从二〇一五年到二〇二五年。窗口 {M.data.length} 根，步长 {M.data.stride} 根，每条窗口在内部做归一化。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="候选" v={fmtInt(M.data.windows)} color={C.cyan} size={FT.h3} />
            <KV k="训练" v={fmtInt(M.data.train)} color={C.violet} size={FT.h3} />
            <KV k="测试" v={fmtInt(M.data.test)} color={C.amber} size={FT.h3} />
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>以 {M.data.split} 为界</div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 280, width: 1060 }}>
          <Card label="二十只股票：一个行业门类一只" accent={C.cyan}>
            <MiniTable head={["门类", "代码", "成分数", "有效日"]} colW={[300, 240, 160, 200]} width={980}
              rows={M.data.industries.slice(0, 9).map((it) => [it.short, it.code, String(it.n), String(it.bars)])} />
            <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>另有十一只不逐行列出 · 门类内取有效交易日最多的一只</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>标签是二十日<br />前向收益。</Body>
          <Body style={{ marginTop: 24 }}>
            按三分位切成三类，三类比例很接近 —— 这是故意的。多数类基线就是三分之一，任何模型的准确率必须跟这条线比。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Row name="训练池" value={fmtInt(M.data.train)} note={M.data.trainClasses.join(" / ")} width={600} color={C.cyan} />
            <Row name="测试池" value={fmtInt(M.data.test)} note={M.data.testClasses.join(" / ")} width={600} color={C.violet} />
            <Row name="基线" value="0.3333" note="三分之一，多数类" width={600} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 300, width: 1080 }}>
          <Card label="训练池的类别分布" accent={C.violet}>
            <Bars width={940} max={2000} rowH={64}
              items={M.data.trainClasses.map((n, i) => ({ label: CL[i], value: n, text: fmtInt(n), color: CLC[i] }))} />
            <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>测试池 {M.data.testClasses.map((n) => fmtInt(n)).join(" / ")} · 比例都接近三分之一</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>Fisher 判别比：<br />类间除以类内。</Body>
          <Body style={{ marginTop: 24 }}>
            数字越大，说明两类在这张图上越容易分开。四种编码在同一批窗口上算，GASF 是 MTF 的两倍多 —— 说明两个通道编码的偏置真的不同。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="GASF / MTF" v={(M.fisher.gasf / M.fisher.mtf).toFixed(4)} color={C.cyan} size={FT.h3} />
            <KV k="四个值" v="全为正" color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 300, width: 1080 }}>
          <Card label="同一批窗口，四种编码的 Fisher 判别比" accent={C.cyan}>
            <Bars width={940} max={0.014} rowH={70}
              items={[
                { label: "GASF", value: M.fisher.gasf, text: M.fisher.gasf.toFixed(4), color: C.cyan },
                { label: "GADF", value: M.fisher.gadf, text: M.fisher.gadf.toFixed(4), color: C.violet },
                { label: "MTF", value: M.fisher.mtf, text: M.fisher.mtf.toFixed(4), color: C.amber },
                { label: "RP", value: M.fisher.rp, text: M.fisher.rp.toFixed(4), color: C.coral },
              ]} />
            <div style={{ marginTop: 6, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>倍数是 {(M.fisher.gasf / M.fisher.mtf).toFixed(4)}，不是刚好两倍：类均值本身带噪声</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>图喂进卷积，<br />三条通道全落空。</Body>
          <Body style={{ marginTop: 24 }}>
            训练 {fmtInt(M.data.cnnTrain)} 条、测试 {fmtInt(M.data.cnnTest)} 条，三类各八百和四百。结果都在随机带里：网络什么都没学到，双通道反而最差。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.coral}>随机带 {M.cnn.band[0]}–{M.cnn.band[1]}</Chip>
            <Chip color={C.amber}>负结果</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 290, width: 1080 }}>
          <Bars width={980} max={0.5} rowH={68}
            items={[
              { label: "GASF 单通道", value: M.cnn.gasf, text: M.cnn.gasf.toFixed(4), color: C.cyan },
              { label: "MTF 单通道", value: M.cnn.mtf, text: M.cnn.mtf.toFixed(4), color: C.amber },
              { label: "GASF + MTF", value: M.cnn.dual, text: M.cnn.dual.toFixed(4), color: C.coral },
            ]} />
          <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            灰带 {M.cnn.band[0]}–{M.cnn.band[1]} 是三分类的随机带 · 参数量 {M.cnn.paramsSingle} / {M.cnn.paramsDual}
          </div>
          <div style={{ marginTop: 26 }}>
            <CnnArch width={980} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>四域投票，<br />也救不回来。</Body>
          <Body style={{ marginTop: 24 }}>
            四个域在验证集上的准确率不一样，加权之后 COTE 是 {M.cote.cote.toFixed(4)}。等权投票是 {M.cote.uniform.toFixed(4)}，最好的单域是 {M.cote.best.toFixed(4)} —— COTE 打不过它，也打不过等权。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Row name="COTE" value={M.cote.cote.toFixed(4)} width={600} color={C.violet} />
            <Row name="等权" value={M.cote.uniform.toFixed(4)} width={600} color={C.amber} />
            <Row name="最好单域" value={M.cote.best.toFixed(4)} width={600} color={C.cyan} />
            <Row name="最差单域" value={M.cote.worst.toFixed(4)} width={600} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 290, width: 1080 }}>
          <Card label="四个域：验证集与测试集" accent={C.violet}>
            <DomainFig width={960} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            四个域都弱的时候，加权只会把弱的平均一下：0.3322 比最好的单域低，比等权也低。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
