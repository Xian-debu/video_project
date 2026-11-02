import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, M, KV, Head, MiniTable, PAD, Pages, pagesOf, Row, Scene, SceneHead, fmt2 } from "../shared";
import { CountFig, SeriesFig } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <Head kicker="第 5 章 / 时间序列分类 · 第四十八集" title="没有标签怎么办：增强、对比与掩码重构" goal="一千条窗口 · 三种自监督 · 一条基线" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>一千条窗口，<br />没有一个标签。</Body>
          <Body style={{ marginTop: 28 }}>沪深三百里挑出 {M.data.withWindows} 只股票，每只切出若干六十天的对数收益。窗口有一千条，标签一条也没有——只有五十条股票知道行业。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <KV k="窗口" v={M.data.windows} color={C.cyan} size={FT.h3} />
            <KV k="长度" v={M.data.length + " 天"} color={C.violet} size={FT.h3} />
            <KV k="有标签" v={M.data.probe} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 820, top: 280, width: 1000 }}>
          <Card label="三条样本：三个行业各一条" accent={C.cyan}>
            {M.samples.slice(0, 3).map((s, i) => (
              <div key={s.code} style={{ marginBottom: i < 2 ? 8 : 0 }}>
                <div style={{ fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>{s.short} · {s.code}</div>
                <SeriesFig width={940} height={150} series={s.series} color={[C.cyan, C.violet, C.amber][i]} />
              </div>
            ))}
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="第 5 章 / 时间序列分类 · 第四十八集" title="没有标签怎么办：增强、对比与掩码重构" goal="一千条窗口 · 三种自监督 · 一条基线" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>四个数<br />说明这道题有多穷。</Body>
          <Body style={{ marginTop: 24 }}>一千条窗口做预训练；五十条有标签，只够做线性探针；候选窗口三万两千条，挑一千条进池子；{M.data.pool} 只股票在池子里，{M.data.withWindows} 只有可用窗口。</Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 320, width: 1040 }}>
          <CountFig width={1000} />
          <div style={{ marginTop: 30 }}>
            <Card label="切窗规则" accent={C.violet}>
              <Row name="步长" value={M.data.stride + " 天"} note="相邻窗口重叠 40 天" width={960} />
              <Row name="清洗" value="|单日收益| < 0.5" note="剔除异常跳动" width={960} />
              <Row name="标签" value="行业三分类" note="电子 / 银行 / 券商" width={960} />
            </Card>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="第 5 章 / 时间序列分类 · 第四十八集" title="没有标签怎么办：增强、对比与掩码重构" goal="一千条窗口 · 三种自监督 · 一条基线" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>三千分之一的<br />运气也要算进来。</Body>
          <Body style={{ marginTop: 24 }}>五十条探针里三类是 {M.data.classes.join(" / ")}，多数类占 {fmt2(M.data.baseline)}。任何模型低于这条线就是白学——所以后面每张成绩单都画一条红线。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.coral}>基线 {fmt2(M.data.baseline)}</Chip>
            <Chip color={C.cyan}>测试 {M.data.testProbe} 条</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 330, width: 1060 }}>
          <Card label="五十条探针的类别分布" accent={C.amber}>
            <MiniTable head={["类别", "条数", "占比"]} colW={[220, 180, 200]} width={900}
              rows={M.data.classes.map((n, i) => [["电子", "银行", "券商"][i], String(n), fmt2(n / M.data.probe)])} />
            <div style={{ marginTop: 16 }}>
              <Row name="多数类基线" value={fmt2(M.data.baseline)} note={M.data.classes[0] + " / " + M.data.probe} width={900} color={C.coral} />
              <Row name="训练 / 测试" value={M.data.trainProbe + " / " + M.data.testProbe} note="每类前 10 条训练" width={900} />
              <Row name="一条测试" value={"5 个百分点"} note="20 条里对 1 条" width={900} color={C.violet} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <Head kicker="第 5 章 / 时间序列分类 · 第四十八集" title="没有标签怎么办：增强、对比与掩码重构" goal="一千条窗口 · 三种自监督 · 一条基线" />
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>这一集<br />讲三种造标签的办法。</Body>
          <Body style={{ marginTop: 24 }}>增强不改标签，把一条曲线变成另一条；对比学习让同一条的两次增强靠近、不同条推远；掩码重构挖掉一段，让网络把它补回来。三条路都不需要人标。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>增强</Chip>
            <Chip color={C.violet}>对比</Chip>
            <Chip color={C.amber}>掩码</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="三种自监督信号，一套下游任务" accent={C.cyan}>
            <MiniTable head={["方法", "监督信号", "维度", "参数"]} colW={[220, 420, 140, 160]} width={960}
              rows={[
                ["增强", "同一窗口的四种扰动", "不训练", "—"],
                ["对比", "同源靠近、异源推远", "32 维", String(M.contrast.params)],
                ["掩码", "遮住 15% + 10% 再补回", "32 维", String(M.mask.params)],
              ]} />
            <div style={{ marginTop: 18 }}>
              <Row name="下游任务" value="行业三分类" note="线性探针，只训一层" width={960} color={C.cyan} />
              <Row name="对照" value="未训练 / 标签错位" note="证明提升不是白来的" width={960} />
              <Row name="评测" value={fmt2(M.contrast.probeAcc) + " / " + fmt2(M.mask.probeAcc)} note="对比 / 掩码" width={960} color={C.violet} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
