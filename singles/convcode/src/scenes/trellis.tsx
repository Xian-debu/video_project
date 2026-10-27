import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Card, Mono, Body, Head, Scene, PAD, beatAt, DEMO } from "../shared";

const W = 1330;
const H = 600;
const ROWS = 16;
const nodeY = (s: number) => 40 + (ROWS - 1 - s) * ((H - 90) / (ROWS - 1));
const nodeX = (i: number) => 60 + i * ((W - 140) / 7);

/** 网格图：十六个状态，七步；细线是全部候选，亮线是维特比挑出的那条。 */
const Trellis: React.FC<{ highlight: number[]; showAll: number }> = ({ highlight, showAll }) => {
  const edges: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    for (let s = 0; s < ROWS; s++) {
      for (const b of [0, 1]) {
        const ns = (s >> 1) | (b << 3);
        edges.push(
          <line key={i + "-" + s + "-" + b} x1={nodeX(i)} y1={nodeY(s)} x2={nodeX(i + 1)} y2={nodeY(ns)}
            stroke={C.panelLine} strokeWidth={1} opacity={0.55 * showAll} />,
        );
      }
    }
  }
  const path = highlight.slice(0, 8);
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      {edges}
      {path.slice(0, -1).map((s, i) => (
        <line key={"p" + i} x1={nodeX(i)} y1={nodeY(s)} x2={nodeX(i + 1)} y2={nodeY(path[i + 1])}
          stroke={C.cyan} strokeWidth={3.5} opacity={0.95} />
      ))}
      {path.map((s, i) => (
        <g key={"n" + i}>
          <circle cx={nodeX(i)} cy={nodeY(s)} r={i === 0 || i === path.length - 1 ? 8 : 6} fill={C.cyan} />
          {i === 0 ? (
            <text x={nodeX(i) + 14} y={nodeY(s) - 16} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.micro} letterSpacing={FT_T.micro}>{"起点 · 状态 0"}</text>
          ) : null}
        </g>
      ))}
      {Array.from({ length: ROWS }).map((_, r) => (
        <text key={"s" + r} x={26} y={nodeY(ROWS - 1 - r) + 5} textAnchor="middle" fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>
          {(ROWS - 1 - r).toString()}
        </text>
      ))}
      <text x={nodeX(0)} y={H - 10} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro} letterSpacing={FT_T.micro}>{"t = 0"}</text>
      <text x={nodeX(7)} y={H - 10} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro} letterSpacing={FT_T.micro} textAnchor="end">{"t = 7"}</text>
    </svg>
  );
};

/** 解码：全部候选 vs 幸存路径。右边三块是「为什么能算得动」和软/硬判决的差别。 */
export const STrellis: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => beatAt("trellis", i, 12));
  const states = DEMO.example.states.slice(0, 8);
  return (
    <Scene id="trellis">
      <Head kicker="04 / 维特比" title="十六个状态，一条最像的路" goal="接收端怎么从可能出错的比特里找回信息" />

      <Build at={beats[3]} style={{ position: "absolute", left: PAD - 10, top: 278, width: W }}>
        <Trellis highlight={states} showAll={1} />
      </Build>

      <Build at={beats[6]} style={{ position: "absolute", right: PAD, top: 286, width: 400 }}>
        <Card label="每一步在做的事" accent={C.cyan} pad={22}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <Mono size={FT.h2} color={C.ink}>{"32 条候选"}</Mono>
              <Body size={FT.meta} style={{ marginTop: 4 }}>每个状态有两条入边</Body>
            </div>
            <div style={{ height: 1, background: C.panelLine }} />
            <div>
              <Mono size={FT.h2} color={C.cyan}>{"留下 16 条"}</Mono>
              <Body size={FT.meta} style={{ marginTop: 4 }}>每个状态只留代价最小的一条</Body>
            </div>
            <div style={{ height: 1, background: C.panelLine }} />
            <div>
              <Mono size={FT.h2} color={C.ink}>{"4 位尾零"}</Mono>
              <Body size={FT.meta} style={{ marginTop: 4 }}>把路径拉回状态零，收尾确定</Body>
            </div>
          </div>
        </Card>
      </Build>

      <Build at={beats[9]} style={{ position: "absolute", left: PAD, top: 880, width: 900 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <Card accent={C.amber} pad={18} style={{ flex: 1 }}>
            <Mono size={FT.label} color={C.amber}>{"软判决"}</Mono>
            <Body size={FT.meta} style={{ marginTop: 6 }}>信道给的是「有多像 0/1」的置信度，度量用欧氏距离</Body>
          </Card>
          <Card accent={C.inkFaint} pad={18} style={{ flex: 1 }}>
            <Mono size={FT.label} color={C.inkFaint}>{"硬判决"}</Mono>
            <Body size={FT.meta} style={{ marginTop: 6 }}>先判成 0/1 再解码，度量只剩汉明距离</Body>
          </Card>
          <Card accent={C.cyan} pad={18} style={{ flex: 1 }}>
            <Mono size={FT.label} color={C.cyan}>{"代价"}</Mono>
            <Body size={FT.meta} style={{ marginTop: 6 }}>复杂度 O(状态数 × 步数)，16 个状态在 1990 年代完全可以实时</Body>
          </Card>
        </div>
      </Build>
    </Scene>
  );
};