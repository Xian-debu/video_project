import { C, FONT, FT, SB, T } from "../../design/tokens";

/** 系列视觉：沿用引擎的暗底与主色，只增加系列自己的版式常量。 */
export const S = {
  bg: C.bg,
  panel: C.panel,
  line: C.panelLine,
  ink: C.ink,
  dim: C.inkDim,
  inkDim: C.inkDim,
  faint: C.inkFaint,
  cyan: C.cyan,
  amber: C.amber,
  violet: C.violet,
  coral: C.coral,
  paper: C.paper,
  font: FONT.sans,
  serif: FONT.serif,
  mono: FONT.mono,
  pad: 104,
  title: 88,
  h2: 44,
  body: 30,
  small: 22,
  micro: 17,
} as const;

export const TONE = {
  cyan: { fg: C.cyan, bg: "rgba(84,214,230,0.10)" },
  amber: { fg: C.amber, bg: "rgba(240,180,90,0.10)" },
  violet: { fg: C.violet, bg: "rgba(160,150,255,0.10)" },
  dim: { fg: C.inkDim, bg: "rgba(255,255,255,0.04)" },
  coral: { fg: C.coral, bg: "rgba(251,113,133,0.10)" },
  paper: { fg: C.paper, bg: "rgba(243,238,227,0.08)" },
} as const;

export type Tone = keyof typeof TONE;

export { FT, SB, T };
