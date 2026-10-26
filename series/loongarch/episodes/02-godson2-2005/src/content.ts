import type { EpisodeContent } from "../series/loongarch/types";

export const CONTENT: EpisodeContent = {
  open: {
    kind: "open",
    year: "2005",
    lead: "龙芯系列 · 第二集",
    title: "Godson-2：把乱序核做成模板",
    subtitle: "2005 年，一颗 0.18 微米、400MHz 的中国芯片，把四发射、乱序执行和寄存器重命名做进了同一颗处理器。",
    thesis: "当主频追不上时，能不能靠每周期做更多事，把性能差距补回来？",
  },
  timeline: {
    kind: "timeline",
    active: 1,
    note: "2005 年，Godson-2 的论文发表。这一代的关键词不是主频，而是 IPC。",
  },
  background: {
    kind: "problem",
    left: {
      head: "换指令系统",
      items: ["Itanium 走全新 64 位 ISA", "软件要重新编译", "生态门槛极高"],
    },
    right: {
      head: "扩 64 位",
      items: ["AMD x86-64 选择兼容", "旧软件继续能跑", "Godson-2 同样选兼容 MIPS"],
    },
    bottom: "资源最少的时候，兼容不是保守，而是活下去的前提。",
  },
  problem: {
    kind: "problem",
    left: {
      head: "拉主频",
      items: ["换更先进工艺，成本与周期都不可控", "0.18 微米下，频率上不去", "主频落后，单靠工艺补不回来"],
    },
    right: {
      head: "提 IPC",
      items: ["四发射，让每个周期取四条指令", "乱序执行，避开不必要的等待", "重命名，拿掉 WAW/WAR 假依赖"],
    },
    bottom: "工艺是外部约束，微架构是内部变量；这一代把筹码压在后者。",
  },
  thesis: {
    kind: "thesis",
    statement: "低主频，高 IPC。",
    detail: "物理寄存器映射、保留站、非阻塞 Cache，被组织成一套可复用的乱序核心模板。Godson-2 是这套模板的第一次完整实现。",
    stat: "4 发射",
    statLabel: "64 位乱序执行；64 项物理寄存器堆；0.18 微米",
  },
  paper: {
    kind: "paper",
    paperTitle: "Microarchitecture of the Godson-2 Processor",
    meta: ["J. Comput. Sci. & Technol., Mar. 2005, Vol.20, No.2", "Wei-Wu Hu, Fu-Xin Zhang, Zu-Song Li", "中国科学院计算技术研究所"],
    contributions: [
      { head: "合并式重命名", body: "架构寄存器与重命名寄存器共用 64 项物理寄存器堆，靠映射表解开假依赖。" },
      { head: "四发射乱序", body: "16 项定点保留站、16 项浮点保留站、32 项重排序队列，动态调度。" },
      { head: "非阻塞存储", body: "16 项访存队列做动态内存消歧，支持 load 推测、store 转发与非阻塞 Cache。" },
    ],
  },
  rename: {
    kind: "diagram",
    variant: "rename",
    title: "重命名：架构寄存器 → 物理寄存器",
    items: [{ label: "rename", value: "64", note: "架构寄存器与重命名寄存器共用同一个物理堆（合并式）" }],
    caption: "提交之前旧映射仍要保留；异常时靠它精确回滚。",
  },
  issue: {
    kind: "problem",
    left: {
      head: "保留站",
      items: ["定点 16 项 + 浮点 16 项", "等操作数就绪再发射", "同一个周期可以选中多条"],
    },
    right: {
      head: "执行单元",
      items: ["定点 2 个、浮点 2 个、访存 1 个", "谁空闲谁执行，允许乱序", "结果带标签写回，提交时按序更新"],
    },
    bottom: "四发射是入口宽度；真正同时在飞多少，由保留站和重排序队列决定。",
  },
  pipeline: {
    kind: "diagram",
    variant: "pipeline",
    title: "九段流水：取指到提交",
    items: [
      { label: "取指", value: "4 条", tone: "cyan" },
      { label: "预译码", value: "分支预测" },
      { label: "译码", value: "内部格式" },
      { label: "重命名", value: "PRMT" },
      { label: "分派", value: "保留站" },
      { label: "发射", value: "乱序" },
      { label: "读寄存器", value: "PRF" },
      { label: "执行", value: "5 个单元" },
      { label: "提交", value: "有序", tone: "amber" },
    ],
    caption: "每个周期最多四条指令进入；执行可以乱序，提交必须按序。",
  },
  predict: {
    kind: "problem",
    left: {
      head: "预测结构",
      items: ["16 项 BTB：分支目标缓存", "4K 项 BHT：方向历史表", "9 位全局历史 + 4 项返回地址栈"],
    },
    right: {
      head: "为什么重要",
      items: ["取错一条，后面九段全部作废", "乱序核在飞指令多，恢复代价大", "预测精度直接决定有效 IPC"],
    },
    bottom: "前端供得上指令，后面的四发射和乱序才有意义。",
  },
  cache: {
    kind: "diagram",
    variant: "cache",
    title: "存储层次：容量、相联与延迟",
    items: [
      { label: "L1 指令 Cache", value: "64KB / 4 路", note: "片内" },
      { label: "L1 数据 Cache", value: "64KB / 4 路", note: "非阻塞" },
      { label: "L2（片外）", value: "最大 8MB", note: "统一" },
      { label: "TLB", value: "64 项全相联", note: "地址翻译" },
    ],
    caption: "访存队列允许 load 推测与 store 转发；一次缺失尽量不冻结整条流水线。",
  },
  quote: {
    kind: "quote",
    text: "Godson-2 implements the merged approach and has a 64-entry physical register file",
    source: "Microarchitecture of the Godson-2 Processor, §4.1",
    note: "定点与浮点各一个 64 项物理寄存器堆；重命名不是外挂，而是长在寄存器堆里。",
  },
  experiment: {
    kind: "problem",
    left: {
      head: "不重命名",
      items: ["32 个架构寄存器反复复用", "WAW / WAR 假依赖卡住发射", "同一时刻只有一次迭代在飞"],
    },
    right: {
      head: "重命名之后",
      items: ["每条写指令分配新的物理寄存器", "假依赖消失，只剩真 RAW", "并行度受 ROB 与 PRF 容量限制"],
    },
    bottom: "结构模型：每次迭代 4 条指令、链长 6 拍；ROB 固定 64 项。",
  },
  result: {
    kind: "metrics",
    title: "物理寄存器数量 vs IPC（结构模型）",
    unit: " IPC",
    bars: [
      { label: "不重命名", value: 0.67, note: "迭代串行" },
      { label: "48 项 PRF", value: 3.33, note: "5 次迭代并行" },
      { label: "64 项 PRF", value: 4.0, note: "10 次，填满四发射" },
      { label: "96 项 PRF", value: 4.0, note: "ROB 封顶" },
      { label: "128 项 PRF", value: 4.0, note: "无额外收益" },
    ],
    max: 4.2,
    caveat: "A 级实验：build/rename_sim.py 结构模型；4 条指令/迭代、链长 6 拍、ROB 64；不是 Godson-2 实测。",
  },
  limits: {
    kind: "problem",
    left: {
      head: "论文证明了",
      items: ["64 位四发射乱序结构可以流片", "合并式重命名与动态调度可实现", "0.18 微米、2.3ns 周期、约 6.7×6.2mm"],
    },
    right: {
      head: "论文没有证明",
      items: ["没有第三方 SPEC 实测分数", "2–3W 是 400MHz 下的设计估计", "Linux PC 仍在开发，缺整机体验数据"],
    },
    bottom: "结构追上了一步，不等于产品追上了；这两件事要分开说。",
  },
  product: {
    kind: "problem",
    left: {
      head: "核心模板",
      items: ["Godson-2E / 2F 继续沿用", "频率与接口逐步提升", "乱序窗口可参数化扩展"],
    },
    right: {
      head: "产品与系统",
      items: ["2006 年系统优化论文接棒", "Cache、TLB 与操作系统成为重点", "整机产品仍在补课"],
    },
    bottom: "核心站住之后，短板转到存储系统与软件；这正是下一集的主题。",
  },
  verdict: {
    kind: "verdict",
    good: ["四发射、乱序、合并式重命名把 IPC 路线走通", "核心模板可参数化，能继续迭代", "非阻塞 Cache 与访存推测进入主设计"],
    cost: ["0.18 微米、400MHz，绝对性能仍受工艺限制", "没有公开第三方基准，外部可验证性弱", "软件生态与整机产品仍未跟上"],
    echo: ["Godson-2E / 2F 沿用同一套核心模板", "后续三代继续扩展乱序窗口", "“低主频、高 IPC”成为长期技术路线"],
    line: "它证明了：核心设计可以靠方法追，不必等工艺追平。",
  },
  handoff: {
    kind: "handoff",
    next: "Godson-2 System",
    nextTitle: "龙芯2号系统优化：核心之外的战争",
    line: "下一集：同一代核心，换一套缓存与系统软件，性能还能再涨一截。",
  },
};
