import type { EpisodeContent } from "../series/loongarch/types";

export const CONTENT: EpisodeContent = {
  open: {
    kind: "open",
    year: "2003",
    lead: "龙芯系列 · 第一集",
    title: "第一块芯片：先证明能跑",
    subtitle: "2003 年，龙芯1号用一块样片跑通 Linux，也第一次暴露了与世界先进水平的真实差距。",
    thesis: "在工艺和主频都追不上的年代，第一代通用 CPU 应该先解决什么问题？",
  },
  timeline: {
    kind: "timeline",
    active: 0,
    note: "2003 年 4 月，龙芯1号的论文发表。它是六篇论文的起点，也是整个系列的时间原点。",
  },
  background: {
    kind: "problem",
    left: {
      head: "自己做",
      items: ["核心 CPU 依赖进口，产业受制于人", "通用 CPU 是集成电路的龙头", "没有自主产品，就没有议价权"],
    },
    right: {
      head: "买现成",
      items: ["成熟产品唾手可得", "软件生态现成", "但核心能力永远在别人手里"],
    },
    bottom: "路线争论的焦点不是要不要做，而是先做什么、怎么活下来。",
  },
  route: {
    kind: "problem",
    left: {
      head: "不做的事",
      items: ["不从嵌入式低端往上爬", "不为了自主而放弃兼容", "不跳过验证直接流片"],
    },
    right: {
      head: "做的事",
      items: ["直接攻高性能通用 CPU", "兼容 MIPS，先借生态", "C 模拟器 → FPGA → 流片"],
    },
    bottom: "高起点、兼容性、分阶段验证：三句话决定了资源怎么花。",
  },
  thesis: {
    kind: "thesis",
    statement: "先借后还：用兼容换时间，用结构换性能。",
    detail: "借用成熟指令系统，先进入生态；再用微结构创新，把性能差距一寸寸补回来。龙芯1号是这套方法论的第一次考试。",
    stat: "200MHz",
    statLabel: "首片工作频率；最高工作频率 266MHz",
  },
  paper: {
    kind: "paper",
    paperTitle: "龙芯1号处理器结构设计",
    meta: ["《计算机学报》2003 年第 26 卷第 4 期", "胡伟武 等", "中国科学院计算技术研究所"],
    contributions: [
      { head: "操作队列复用", body: "不建独立物理寄存器堆，用队列项承载重命名结果，省面积。" },
      { head: "精确例外", body: "结果先写回队列，退休时再写寄存器，例外可以精确恢复。" },
      { head: "系统安全", body: "针对缓冲区溢出攻击，在流水线里加入访问限制机制。" },
    ],
  },
  rename: {
    kind: "problem",
    left: {
      head: "常规做法",
      items: ["独立物理寄存器堆", "映射表 + 空闲表 + 活跃表", "面积大、时序紧"],
    },
    right: {
      head: "龙芯1号",
      items: ["复用操作队列项", "队列位置就是重命名号", "省面积、简化控制"],
    },
    bottom: "代价：队列容量有限，重命名宽度被队列长度锁死。",
  },
  pipeline: {
    kind: "diagram",
    variant: "pipeline",
    title: "七段流水：执行乱序，退休有序",
    items: [
      { label: "取指", value: "PC", tone: "cyan" },
      { label: "译码", value: "IR" },
      { label: "重命名", value: "队列号" },
      { label: "发射", value: "保留站" },
      { label: "执行", value: "乱序" },
      { label: "写回", value: "结果总线" },
      { label: "完成", value: "有序退休", tone: "amber" },
    ],
    caption: "单发射：每周期最多一条指令进入流水线；执行阶段可能多拍。",
  },
  quote: {
    kind: "quote",
    text: "运算结果并不直接写回寄存器，而是写到操作队列的相应项。",
    source: "《龙芯1号处理器结构设计》第 1 节",
    note: "精确例外与低面积，在同一个结构选择里同时成立。",
  },
  experiment: {
    kind: "metrics",
    title: "一次 20 拍的缺失，能藏住多少工作",
    unit: " 拍",
    bars: [
      { label: "顺序执行", value: 42, note: "load 挡住后面全部" },
      { label: "窗口 2", value: 34, note: "1.24×" },
      { label: "窗口 4", value: 30, note: "1.40×" },
      { label: "窗口 8", value: 28, note: "1.50×" },
      { label: "窗口 16", value: 27, note: "1.56×" },
    ],
    max: 45,
    caveat: "A 级实验：build/queue_sim.py 周期级模型；load 20 拍、ALU 1 拍、按序提交；不是龙芯1号实测。",
  },
  scorecard: {
    kind: "problem",
    left: {
      head: "做到了",
      items: ["一次流片成功，成品率 80% 以上", "200MHz 跑通 Linux 2.4", "最高工作频率 266MHz"],
    },
    right: {
      head: "没做到",
      items: ["单发射，指令级并行有限", "8KB 指令 Cache，访存带宽受限", "gcc 尚未针对该结构优化"],
    },
    bottom: "200MHz 下功耗约 0.4–0.5W；这是一块能用的芯片，不是一块能打的芯片。",
  },
  metrics: {
    kind: "metrics",
    title: "SPEC CPU2000（200MHz 样机，ref 规模）",
    unit: "",
    bars: [
      { label: "SPECint-base2000", value: 18.5, note: "ref 规模" },
      { label: "SPECfp-base2000", value: 24.8, note: "ref 规模" },
    ],
    max: 30,
    caveat: "跨平台、跨年代的分数不可直接比较；这里只记录 2003 年的绝对值。",
  },
  cache: {
    kind: "diagram",
    variant: "cache",
    title: "存储层次：容量与拐点",
    items: [
      { label: "龙芯1号 L1 指令 Cache", value: "8KB / 2 路", note: "随机替换" },
      { label: "参考机 O2 的带宽拐点", value: "32KB", note: "拐点" },
    ],
    caption: "块大小超过 8KB 后，龙芯1号的访存带宽急剧下降；这不是工艺问题，是结构问题。",
  },
  security: {
    kind: "problem",
    left: {
      head: "通用做法",
      items: ["操作系统划分保护区", "硬件检查读 / 写权限", "堆栈可执行，攻击面仍在"],
    },
    right: {
      head: "龙芯1号",
      items: ["TLB 增加可执行位", "限制从堆栈段取指", "取指时做权限检查"],
    },
    bottom: "论文报告：针对缓冲区溢出的安全机制测试有效。这不是性能优化，而是把安全放进了流水线。",
  },
  honest: {
    kind: "quote",
    text: "但龙芯1号处理器的 Cache 过小，在组织方式上也有待改进。",
    source: "《龙芯1号处理器结构设计》摘要",
    note: "作者把短板写进了论文，也写进了下一代的设计目标。",
  },
  product: {
    kind: "problem",
    left: {
      head: "论文能证明",
      items: ["一次流片成功", "Linux 2.4、gcc、浏览器跑通", "安全机制测试有效"],
    },
    right: {
      head: "论文不能证明",
      items: ["量产成绩与整机体验", "第三方独立评测", "生态与编译器成熟度"],
    },
    bottom: "公开、可复现的第三方评测很少；这是事实，不是结论。",
  },
  verdict: {
    kind: "verdict",
    good: ["一次流片成功，验证了完整链路", "动态流水线效率高于同频静态流水线", "安全设计能防范缓冲区溢出攻击"],
    cost: ["单发射限制了指令级并行", "8KB Cache 让访存带宽过早见顶", "编译器与生态尚未跟上"],
    echo: ["2005 年 Godson-2 升级到四发射", "Cache 容量与相联度同步提升", "转移猜测、非阻塞访存被列入下一代"],
    line: "第一块芯片的价值，不是分数，而是把从设计到流片的整条路走通了。",
  },
  handoff: {
    kind: "handoff",
    next: "Godson-2",
    nextTitle: "从单发射到四发射：把乱序核心做成模板",
    line: "第一块芯片证明能跑；第二块芯片要证明能追。",
  },
};
