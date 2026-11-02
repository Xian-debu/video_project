import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, pagesOf, Row, Scene, SceneHead, fmtInt } from "../shared";
import { EncPipe, QuadFig, WindowFig } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>把曲线<br />画成图。</Body>
          <Body style={{ marginTop: 26 }}>
            一百二十八根日线的收盘价，切出 {fmtInt(M.data.windows)} 条窗口。这一步把它们摊成矩阵：两条坐标轴上排的是同一段行情，格子里的值是两天的夹角或者两箱的转移。
          </Body>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <KV k="窗口" v={fmtInt(M.data.windows)} color={C.cyan} size={FT.h3} />
            <KV k="长度" v={M.data.length + " 天"} color={C.violet} size={FT.h3} />
            <KV k="步长" v={M.data.stride + " 天"} color={C.amber} size={FT.h3} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 280, width: 1020 }}>
          <Card label="三条窗口：三类走势各一条" accent={C.cyan}>
            {M.samples.slice(0, 3).map((s, i) => (
              <div key={s.code} style={{ marginBottom: i < 2 ? 10 : 0 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{s.code} · {s.end} · 二十日收益 {s.ret20.toFixed(4)}</div>
                <WindowFig width={950} height={128} idx={i} color={[C.cyan, C.violet, C.amber][i]} label={["下行", "震荡", "上行"][i]} />
              </div>
            ))}
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>这一集做三件事。</Body>
          <Body style={{ marginTop: 24 }}>
            把窗口编码成图，用卷积在图上分三类，再用四个域的判断加权投票。三种编码都是双射，信息一点不丢；但实验结果不站在我们这边。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>编码成图</Chip>
            <Chip color={C.violet}>卷积分类</Chip>
            <Chip color={C.amber}>四域投票</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 290, width: 1080 }}>
          <Card label="三个零件，一条流水线" accent={C.cyan}>
            <Row name="编码" value="GAF / MTF / 递归图" note={M.data.length + "×" + M.data.length + " 的方阵"} width={1000} color={C.cyan} />
            <Row name="卷积" value="两层，池化两次" note={"参数量 " + M.cnn.paramsDual + " / " + M.cnn.paramsSingle} width={1000} />
            <Row name="投票" value="四域加权，一个类" note="COTE" width={1000} color={C.violet} />
          </Card>
          <div style={{ marginTop: 26 }}>
            <EncPipe width={1000} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>无损，<br />不等于有用。</Body>
          <Body style={{ marginTop: 24 }}>
            编码确实不丢信息，GAF 甚至能从对角线把幅值反解回来。但下游标签是二十日方向，本身接近随机：三条通道全落在随机带里，四域投票也没超过最好的单域。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>双射</Chip>
            <Chip color={C.amber}>随机带</Chip>
            <Chip color={C.coral}>负结果</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 290, width: 1060 }}>
          <QuadFig captions={["幅值", "方向", "转移", "递归"]} />
          <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>
            同一个窗口的四张 16×16 缩略图：GASF 看幅值，GADF 看方向，MTF 看状态转移，递归图看什么时候回到过原点。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
