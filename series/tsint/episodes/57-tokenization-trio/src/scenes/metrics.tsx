import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";
import { AcfChart } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>九十六除以 p，<br />就是个数。</Body>
          <Body style={{ marginTop: 26 }}>
            第一组数不需要跑程序，手算就能得到。12、6、3，对应每块 8、16、32 点。合计 21 个 token，三种切法各算一遍。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="p = 8" v="12" color={C.cyan} />
            <KV k="p = 16" v="6" color={C.violet} />
            <KV k="p = 32" v="3" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="第一组：token 数" accent={C.cyan}>
            <Row name="p = 8" value="12 token" note="每块 8 点，96 ÷ 8 = 12" width={1010} color={C.cyan} />
            <Row name="p = 16" value="6 token" note="每块 16 点，96 ÷ 16 = 6" width={1010} color={C.violet} />
            <Row name="p = 32" value="3 token" note="每块 32 点，96 ÷ 32 = 3" width={1010} color={C.amber} />
            <Row name="合计" value="21" note="三种长度各切一遍的总 token 数" width={1010} color={C.inkDim} />
            <Row name="每块长度" value="8 / 16 / 32" note="token 越长，个数越少" width={1010} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            反比：个数 × 块长 = 96。
          </div>
        </div>
        <Foot>反比，不是巧合。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>重叠，<br />用 token 换边界。</Body>
          <Body style={{ marginTop: 26 }}>
            第二组数：11 个窗口。96 减 16 除以 8 再加一；相邻窗口重叠 8 点。比不重叠的 6 个多 5 个 token，换来边界点被两个 token 看到。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="窗口" v="11" color={C.cyan} />
            <KV k="重叠" v="8 点" color={C.amber} />
            <KV k="多出" v="+5" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="第二组：滑动窗口" accent={C.amber}>
            <Row name="窗口数" value="11" note="(96 − 16) ÷ 8 + 1" width={1010} color={C.cyan} />
            <Row name="每窗长度" value="16 点" note="patch 长度 p" width={1010} color={C.violet} />
            <Row name="步长" value="8 点" note="每次向右滑 8 点" width={1010} color={C.cyan} />
            <Row name="重叠" value="8 点" note="p − stride" width={1010} color={C.amber} />
            <Row name="对比不重叠" value="6 → 11" note="多 5 个 token，换边界可见" width={1010} color={C.coral} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            覆盖同样是 96 点，只是被看了不止一次。
          </div>
        </div>
        <Foot>重叠让边界点被两个 token 看到。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>真实序列，<br />没有峰。</Body>
          <Body style={{ marginTop: 26 }}>
            第三组数：正弦 lag 24 等于 1，真实序列 lag 24 只有 0.42。过了 0.3 的阈值，却不是局部极大。于是返回空，退化成固定 patch。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="正弦" v="1.0000" color={C.cyan} />
            <KV k="真实" v="0.4243" color={C.amber} />
            <KV k="主峰" v="无" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="真实 512 点的自相关：慢慢衰减，没有局部峰" accent={C.coral}>
            <AcfChart data={M.period.realAcf} peak={null} threshold={M.period.threshold} width={1010} height={280} yMin={0} yMax={1.05} color={C.amber} label="lag 0 为 1，之后单调下降；lag 24 仅 0.4243。没有峰，周期切退化。" />
          </Card>
        </div>
        <Foot>真实数据，退化成固定 patch。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四组数，<br />四个结论。</Body>
          <Body style={{ marginTop: 26 }}>
            patch 数反比于块长；重叠用 token 换边界；周期切用周期换容量；分辨率前缀用一维换多档。四种变换都不训练，所以全部可复现。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="重构" v="3.11e-15" color={C.cyan} />
            <KV k="前缀维" v="32" color={C.violet} />
            <KV k="最近档" v="3→2 / 6→4" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="四个结论，都能手算" accent={C.cyan}>
            <Row name="patch" value="反比" note="token 数 = 96 ÷ p" width={1010} color={C.cyan} />
            <Row name="重叠" value="换边界" note="多 5 个 token，边界被看两次" width={1010} color={C.violet} />
            <Row name="周期切" value="换容量" note="每块一个周期，4 个 token" width={1010} color={C.amber} />
            <Row name="分辨率前缀" value="换多档" note="一维前缀，四档共用" width={1010} color={C.cyan} />
            <Row name="共同点" value="不训练" note="DCT 固定、前缀固定、阈值固定" width={1010} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>确定性</Chip>
            <Chip color={C.violet}>可复现</Chip>
            <Chip color={C.amber}>有读数</Chip>
          </div>
        </div>
        <Foot>token 数，都能手算。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
