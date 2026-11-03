import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt2, pagesOf } from "../shared";
import { AcfChart, OverlapStrip, ResolutionLadder, TokenStrip, WaveStrip } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>五百一十二点，<br />先切窗口。</Body>
          <Body style={{ marginTop: 26 }}>
            最后九十六点是一个窗口。序列本身只需要两列：日期、后复权收盘。切法，是这个窗口上的确定性变换。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="总点数" v={String(M.data.points)} color={C.cyan} />
            <KV k="窗口" v={String(M.data.h)} color={C.violet} />
            <KV k="区间" v="2024-09 → 2026-10" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="最后 96 个交易日（后复权）" accent={C.cyan}>
            <WaveStrip values={M.data.tail96} width={1020} height={250} color={C.cyan} />
            <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              首 {fmt2(M.data.first)}，末 {fmt2(M.data.last)}；最高 {fmt2(M.data.max)}。
            </div>
          </Card>
        </div>
        <Foot>九十六点，就是一页。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>九十六点，<br />怎么切？</Body>
          <Body style={{ marginTop: 26 }}>
            patch 长度取 8、16、32，都能整除 96。token 数就是 96 除以 p。每块长度不同，token 数不同，覆盖的点数相同。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="p" v="8 / 16 / 32" color={C.cyan} />
            <KV k="token" v="12 / 6 / 3" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="三种长度，三组个数" accent={C.violet}>
            <Row name="p = 8" value="12 token" note="每块 8 点，96 ÷ 8" width={1010} color={C.cyan} />
            <Row name="p = 16" value="6 token" note="每块 16 点，96 ÷ 16" width={1010} color={C.violet} />
            <Row name="p = 32" value="3 token" note="每块 32 点，96 ÷ 32" width={1010} color={C.amber} />
            <Row name="合计" value="21 token" note="12 + 6 + 3，三种切法各算一遍" width={1010} color={C.inkDim} />
            <Row name="每块长度" value="8 / 16 / 32" note="token 越长，个数越少" width={1010} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>整除</Chip>
            <Chip color={C.violet}>反比</Chip>
            <Chip color={C.amber}>覆盖 96 点</Chip>
          </div>
        </div>
        <Foot>这是一笔反比账。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>重叠切分，<br />十一个 token。</Body>
          <Body style={{ marginTop: 26 }}>
            p=16、步长 8：相邻两块共享 8 个点。窗口从 0 滑到 80，一共 11 个位置。边界点被两个 token 同时看到，代价是多 5 个 token。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="p / stride" v="16 / 8" color={C.cyan} />
            <KV k="重叠" v="8 点" color={C.amber} />
            <KV k="窗口" v="11" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="11 个滑动窗口，逐个错开 8 点" accent={C.amber}>
            <OverlapStrip width={1010} stride={M.patch.stride} p={M.patch.overlapLen} />
          </Card>
        </div>
        <Foot>十一个，是第二个数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>按周期切，<br />四个 token。</Body>
          <Body style={{ marginTop: 26 }}>
            周期不是猜的，算自相关。正弦序列在 lag 24 处等于 1，主峰就是 24。96 除以 24，正好四个 token，每块一个完整周期。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="周期" v="24" color={C.cyan} />
            <KV k="token" v="4" color={C.violet} />
            <KV k="每块" v="24 点" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="自相关：lag 24 是主峰" accent={C.cyan}>
            <AcfChart data={M.period.sinAcf} peak={M.period.peak} threshold={M.period.threshold} width={1010} height={280} label="合成序列 sin(2πt/24)，lag 24 处相关系数 1.0。" />
          </Card>
        </div>
        <Foot>周期切，token 数和周期成反比。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>换分辨率，<br />四档前缀。</Body>
          <Body style={{ marginTop: 26 }}>
            同一段序列，降采样四次：512、256、128、64。每一档配一个前缀向量 e_r，拼在 token 最前面。前缀告诉模型，这是哪一档。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="档位" v="1 / 2 / 4 / 8" color={C.cyan} />
            <KV k="前缀维" v="32" color={C.violet} />
            <KV k="长度" v="512 → 64" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="四档分辨率，四行长度" accent={C.violet}>
            <ResolutionLadder width={1010} />
          </Card>
        </div>
        <Foot>位置编码，整体偏移一位。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
