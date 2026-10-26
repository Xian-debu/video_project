/** 系列共享类型：每集只提供内容数据，版式与动效在共享层。 */
export type SceneSpec = {
  id: string;
  chapter: string;
  kicker: string;
  title: string;
  goal: string;
  lines: string[];
};

export type Scene = SceneSpec & { dur: number; start: number; chapterIndex: number };
export type Line = { start: number; dur: number; speech: string; scene: string; index: number };

export type TimelineNode = {
  year: string;
  short: string;
  title: string;
  active?: boolean;
};

export type DiagramItem = {
  label: string;
  value?: string;
  note?: string;
  tone?: "cyan" | "amber" | "violet" | "dim";
};

export type SceneContent =
  | { kind: "open"; year: string; lead: string; title: string; subtitle: string; thesis: string }
  | { kind: "thesis"; statement: string; detail?: string; stat?: string; statLabel?: string }
  | { kind: "timeline"; active: number; note: string }
  | {
      kind: "paper";
      paperTitle: string;
      meta: string[];
      contributions: { head: string; body: string }[];
    }
  | {
      kind: "problem";
      left: { head: string; items: string[] };
      right: { head: string; items: string[] };
      bottom?: string;
    }
  | {
      kind: "diagram";
      variant: "pipeline" | "rename" | "cache" | "noc" | "translation" | "isa" | "lineage" | "alias";
      title: string;
      items: DiagramItem[];
      caption: string;
    }
  | { kind: "quote"; text: string; source: string; note?: string }
  | {
      kind: "metrics";
      title: string;
      unit: string;
      bars: { label: string; value: number; note?: string }[];
      max: number;
      caveat: string;
    }
  | { kind: "verdict"; good: string[]; cost: string[]; echo: string[]; line: string }
  | { kind: "handoff"; next: string; nextTitle: string; line: string };

export type EpisodeContent = Record<string, SceneContent>;

export type EpisodeMeta = {
  seriesId: string;
  seriesTitle: string;
  order: number;
  total: number;
  year: string;
  label: string;
};
