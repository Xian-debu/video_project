import type { EpisodeContent } from "../series/loongarch/types";

export const CONTENT: EpisodeContent = {
  open: {
    kind: "open",
    year: "2003–2023",
    lead: "龙芯系列 · 第七集",
    title: "二十年，一条被约束推出来的主线",
    subtitle: "六篇论文，五次转身，一次换地基。从能跑，到能追，再到自己定规则。",
    thesis: "先活下来，才有资格谈追上。",
  },
  timeline: {
    kind: "timeline",
    active: 5,
    note: "六篇论文放在一条时间线上；顺序不是 PDF 编号，而是发表年份。",
  },
  problem: {
    kind: "problem",
    left: {
      head: "看起来是规划",
      items: ["2003：先做能跑的核", "2005：追 IPC", "2006：补系统软件", "2009：上多核"],
    },
    right: {
      head: "其实是被约束推着",
      items: ["工艺买不到，就改结构", "生态搬不动，就先兼容", "授权拿不到，就只能先借壳", "每一步都在解当时的约束"],
    },
    bottom: "路线不是先画好的，是走一步解一个约束。",
  },
  thesis: {
    kind: "thesis",
    statement: "主线不是规划出来的，是被约束推出来的。",
    detail: "这不是贬低，而是解释。正因为先解决生存问题，才有机会在后面谈性能与自主。",
    stat: "6 篇",
    statLabel: "2003–2023 · 五次转向",
  },
  lineage: {
    kind: "diagram",
    variant: "lineage",
    title: "五个方向，在同一张时间线上反复出现",
    items: [{ label: "五条线", note: "乱序核、ISA、翻译、存储、并行：每一年只有一个方向真正往前走" }],
    caption: "同一套乱序核骨架被反复扩参；ISA 与翻译则是另一条更慢、也更难的路。",
  },
  experiment: {
    kind: "problem",
    left: {
      head: "样本",
      items: ["六篇论文", "六份 claims 台账", "共 109 条引文", "覆盖年份、结构、性能与工艺"],
    },
    right: {
      head: "方法",
      items: ["逐条取出台账中的 quote", "统一空白后回查 paper.txt", "命中即通过，缺失即失败", "只验证引文，不验证解释"],
    },
    bottom: "A 级实验：可复现的文本回查，不重跑芯片。",
  },
  result: {
    kind: "metrics",
    title: "六集引文条数（回查全部命中）",
    unit: "条",
    bars: [
      { label: "01 龙芯1号", value: 9, note: "2003" },
      { label: "02 Godson-2", value: 16, note: "2005" },
      { label: "03 系统优化", value: 15, note: "2006" },
      { label: "04 Godson-3", value: 22, note: "2009" },
      { label: "05 LoongISA", value: 25, note: "2015" },
      { label: "06 LoongArch", value: 22, note: "2023" },
    ],
    max: 30,
    caveat: "109/109 命中。回查只证明引文存在，不证明解释正确；图表数字与未入账表述不在范围内。",
  },
  performance: {
    kind: "problem",
    left: {
      head: "能放在一起说的",
      items: ["同一颗核换 ISA 的对比（+7%）", "同一代核的微结构指标", "同一平台上的翻译效率"],
    },
    right: {
      head: "不能放在一起比的",
      items: ["跨工艺的绝对主频", "跨编译器、跨基准的 SPEC 分数", "不同年份的功耗与面积"],
    },
    bottom: "论文之间的数字不能连成一条性能曲线，只能连成一条选择曲线。",
  },
  ecosystem: {
    kind: "problem",
    left: {
      head: "补了三次课",
      items: ["2006：TLB、Cache 与 Linux 内核", "2015：二进制翻译与运行时", "2023：三年四步补生态"],
    },
    right: {
      head: "补不回来的",
      items: ["商业软件与游戏", "第三方独立评测", "开发者习惯与迁移成本"],
    },
    bottom: "生态的账，只能用年和包数来还。",
  },
  limits: {
    kind: "problem",
    left: {
      head: "可以说的",
      items: ["MIPS 授权让前十二年受制", "早期性能被 Cache 与编译器限制", "2009 年的可重构没有量产"],
    },
    right: {
      head: "不能说的",
      items: ["自主 ISA 一换，性能就自动追上", "2025 年消除壁垒已经实现", "多核与可重构研究都已落地"],
    },
    bottom: "把没做到的事写清楚，比把做到的事说大更重要。",
  },
  verdict: {
    kind: "verdict",
    good: ["在约束里保住了继续迭代的资格", "核心模板与系统软件形成积累", "最终换掉 MIPS 这层壳"],
    cost: ["性能与生态的长期欠账", "前十二年受制于 MIPS 授权", "早期缺少第三方可验证数据"],
    echo: ["绝对性能仍在追", "软件生态仍在补", "开发者习惯仍在迁移"],
    line: "它证明了：路可以自己走，但每一步都要付账。",
  },
  handoff: {
    kind: "handoff",
    next: "回到第一集",
    nextTitle: "2003：先证明能跑",
    line: "先活下来，才有资格谈追上。",
  },
};
