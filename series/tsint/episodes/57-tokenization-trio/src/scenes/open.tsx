import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { TokenStrip } from "../figs";


export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三种切法，<br />一套 token。</Body>
          <Body style={{ marginTop: 26 }}>
            序列太长，模型吃不下。先切块，再投影。这一集只做三种确定性变换：patch、周期、分辨率前缀。都不训练，token 数都能手算。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="窗口" v="96 点" color={C.cyan} />
            <KV k="token" v="12 / 6 / 3" color={C.violet} />
            <KV k="周期" v="24" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三个变换，一个目标" accent={C.amber}>
            <Row name="输入" value="96 点" note="一段合成正弦，周期 24" width={1000} color={C.cyan} />
            <Row name="patch 切" value="12 / 6 / 3" note="p = 8 / 16 / 32，不重叠" width={1000} color={C.violet} />
            <Row name="重叠切" value="11 token" note="p = 16，步长 8" width={1000} color={C.amber} />
            <Row name="周期切" value="4 token" note="每块正好一个周期 24" width={1000} color={C.cyan} />
            <Row name="分辨率前缀" value="4 档" note="512 / 256 / 128 / 64，各配 e_r" width={1000} color={C.violet} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>不训练</Chip>
            <Chip color={C.amber}>可手算</Chip>
            <Chip color={C.violet}>可复现</Chip>
          </div>
        </div>
        <Foot>都不训练模型，只是变换。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>九十六点，<br />三种切法。</Body>
          <Body style={{ marginTop: 26 }}>
            同一个窗口，换 patch 长度，token 数就换。patch 越长，token 越少，每块装下的周期越长。这是这一集唯一的反比关系。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="窗口" v="96" color={C.cyan} />
            <KV k="最长块" v="32" color={C.violet} />
            <KV k="最少 token" v="3" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三种 patch 长度" accent={C.cyan}>
            <TokenStrip p={8} width={950} height={44} />
            <div style={{ height: 10 }} />
            <TokenStrip p={16} width={950} height={44} />
            <div style={{ height: 10 }} />
            <TokenStrip p={32} width={950} height={44} />
          </Card>
        </div>
        <Foot>每块就是一段连续的点。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>token 数，<br />决定容量。</Body>
          <Body style={{ marginTop: 26 }}>
            transformer 算注意力，token 对 token。token 少了，位置少，算得快，但每块能覆盖的周期变短。容量和成本，是同一枚硬币的两面。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="复杂度" v="O(n²)" color={C.coral} />
            <KV k="n" v="token 数" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一笔容量账" accent={C.coral}>
            <Row name="token 少" value="算得快" note="能装下的周期更短" width={1000} color={C.cyan} />
            <Row name="token 多" value="看得细" note="位置多，注意力更贵" width={1000} color={C.violet} />
            <Row name="切法决定" value="n" note="同一段序列，三种 n" width={1000} color={C.amber} />
            <Row name="容量决定" value="最长周期" note="每块越长，能装的周期越长" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>快</Chip>
            <Chip color={C.coral}>贵</Chip>
            <Chip color={C.amber}>容量</Chip>
          </div>
        </div>
        <Foot>没有一种免费。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个数，<br />四段路线。</Body>
          <Body style={{ marginTop: 26 }}>
            九十六个点，十二、六、三；重叠切分十一个；周期二十四。三个数之后，是二十二项检查和五十条单测。四段：问题、定义、读数、验收。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="token" v="12/6/3" color={C.cyan} />
            <KV k="重叠" v="11" color={C.violet} />
            <KV k="主峰" v="24" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="这一集要出现的数" accent={C.amber}>
            <Row name="patch 数" value="12 / 6 / 3" note="96 除以 8 / 16 / 32" width={1000} color={C.cyan} />
            <Row name="合计" value="21 token" note="三种长度加起来" width={1000} color={C.violet} />
            <Row name="重叠切" value="11 token" note="p=16，stride=8" width={1000} color={C.amber} />
            <Row name="周期" value="24" note="自相关主峰，4 个 token" width={1000} color={C.cyan} />
            <Row name="前缀维度" value="32" note="四档分辨率共用一张表" width={1000} color={C.violet} />
            <Row name="验收" value="22 / 22" note="数据、patch、周期、前缀" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            96 ÷ 8 = 12；三种长度合计 21 个 token。
          </div>
        </div>
        <Foot>从最小例子开始。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
