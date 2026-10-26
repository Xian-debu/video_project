import type { EpisodeContent } from "../series/loongarch/types";

export const CONTENT: EpisodeContent = {
  open: {
    kind: "open",
    year: "2015",
    lead: "龙芯系列 · 第五集",
    title: "先融合，再自主",
    subtitle: "2015 年，龙芯没有换指令系统，而是把 x86 和 ARM 的语义补进 MIPS。LoongISA 想用一套并集，把三家的软件装进同一个壳。",
    thesis: "兼容能不能靠扩展指令系统买回来？",
  },
  timeline: {
    kind: "timeline",
    active: 4,
    note: "2015 年，LoongISA 发布。它不是新指令系统，而是 MIPS 的功能并集；八年后的 LoongArch 才真正拆掉这层壳。",
  },
  background: {
    kind: "problem",
    left: {
      head: "软件在哪里",
      items: ["存量软件编译到 x86", "移动软件编译到 ARM", "Linux 生态刚起步"],
    },
    right: {
      head: "两条路",
      items: ["换指令系统：生态清零", "做翻译：语义差距太大", "第三条：把宿主做厚"],
    },
    bottom: "兼容不是把软件搬过来，而是让翻译器有足够的指令可用。",
  },
  problem: {
    kind: "problem",
    left: {
      head: "x86 的一条 SUB",
      items: ["结果写回寄存器", "同时产生 6 个 EFLAGS", "下一条指令按标志跳转"],
    },
    right: {
      head: "MIPS 要模拟",
      items: ["MIPS 没有标志位", "四个常用标志近 40 条", "翻译器还没开始优化"],
    },
    bottom: "一条运算指令的语义缺口，就能把翻译成本放大一个数量级。",
  },
  thesis: {
    kind: "thesis",
    statement: "不换指令系统，先做并集。",
    detail: "在 MIPS 上增加 x86 和 ARM 有、MIPS 没有的语义；功能上是三家指令系统的并集。目标不是兼容层，而是让翻译器少写指令。",
    stat: "3 套",
    statLabel: "三家 ISA 的语义并集；编码仍走 MIPS UDI",
  },
  paper: {
    kind: "paper",
    paperTitle: "龙芯指令系统融合技术",
    meta: ["《中国科学：信息科学》2015, 45(4): 459–479", "胡伟武、靳国杰、汪文祥、张晓春、王焕东", "中国科学院计算技术研究所"],
    contributions: [
      { head: "指令功能", body: "EFLAGS、ARM 条件执行、x87 栈、非对齐访存、间接跳转、读 PC。" },
      { head: "运行时环境", body: "通用寄存器够用；浮点/向量扩展到 64 个 256 位；留出控制寄存器。" },
      { head: "核心态", body: "客态、独立控制寄存器、独立 TLB 例外入口，支撑系统级翻译。" },
    ],
  },
  eflags_problem: {
    kind: "problem",
    left: {
      head: "x86 的六个标志",
      items: ["CF 进位、PF 奇偶", "AF 辅助进位、ZF 清零", "SF 符号、OF 溢出"],
    },
    right: {
      head: "纯软件模拟",
      items: ["一条 SUB + 四个标志约 40 条", "每条转移再按标志翻译", "代码膨胀，翻译缓存吃紧"],
    },
    bottom: "MIPS 没有标志位，只能拿指令一条条把语义算出来。",
  },
  eflags_solution: {
    kind: "problem",
    left: {
      head: "LoongISA 加了什么",
      items: ["SETFLAG 前缀：运算同时产标志", "标志写进通用寄存器", "X86JE：按寄存器标志转移"],
    },
    right: {
      head: "省了多少",
      items: ["SUB + 四标志：40 条 → 4 条", "不需要硬件标志位", "代价：译码器多一种前缀"],
    },
    bottom: "同一段 SUB 加条件跳转，从四十条降到四条；标志仍在软件可见的寄存器里。",
  },
  arm_cond: {
    kind: "problem",
    left: {
      head: "ARM 条件执行",
      items: ["ADDGT 只在大于时写回", "先判 Z，再判 N 和 V", "两次转移 + 结果生成"],
    },
    right: {
      head: "LoongISA 条件 MOV",
      items: ["先算结果，再按标志决定搬不搬", "ARMADDGT + ARMMOVGT", "3 条，没有分支"],
    },
    bottom: "条件执行翻成 MIPS 要分支；条件 MOV 把分支换成一次数据搬移。",
  },
  x87: {
    kind: "problem",
    left: {
      head: "x87 的三个包袱",
      items: ["8 个栈寄存器相对 3 位 TOP 编号", "16 位 Tag 记录 8 个寄存器状态", "80 位浮点，RISC 只有 64 位"],
    },
    right: {
      head: "LoongISA 的补法",
      items: ["3 位 TOP 硬件寄存器，译码时相加", "专用 Tag 模拟 + 栈溢出例外入口", "80→64 一条，64→80 两条"],
    },
    bottom: "每条访问 x87 寄存器的浮点指令少算十几条；80 位转换从四十多条降到三条。",
  },
  other: {
    kind: "problem",
    left: {
      head: "访存与跳转",
      items: ["MIPS 要求对齐，x86/ARM 不要求", "LWL/LWR、LDL/LDR 扩展到浮点寄存器", "间接跳转目标地址要查表翻译"],
    },
    right: {
      head: "LoongISA 的两个补丁",
      items: ["非对齐访存可落到浮点寄存器", "64 项 CAM 缓存间接跳转映射", "一条读 PC 指令，避开 link 副作用"],
    },
    bottom: "每一项都不大；翻译器的日常开销，就是这些小事累出来的。",
  },
  runtime_system: {
    kind: "problem",
    left: {
      head: "运行时环境",
      items: ["32 个通用寄存器，够模拟 x86/ARM", "浮点/向量扩展到 64 个 256 位", "6 个 64 位 Hi/Lo 寄存器给控制寄存器模拟"],
    },
    right: {
      head: "核心态",
      items: ["客态：客—核心、客—管理、客—用户", "两套独立控制寄存器", "独立的 TLB 例外入口"],
    },
    bottom: "这些设计不产生性能数字，但决定系统级翻译能不能跑，尤其是 Windows 这类客户机。",
  },
  experiment: {
    kind: "problem",
    left: {
      head: "模型做什么",
      items: ["按论文算法展开翻译序列", "四种语义场景", "只数指令条数"],
    },
    right: {
      head: "模型不做什么",
      items: ["不测周期与流水线", "不测 Cache 与分支预测", "不代表 3A1500 实测"],
    },
    bottom: "A 级实验：build/flags_sim.py；指令条数是下界，不是性能的全部。",
  },
  result: {
    kind: "metrics",
    title: "同一段语义要多少条指令（结构模型）",
    unit: " 条",
    bars: [
      { label: "x86 SUB + 四标志", value: 40, note: "LoongISA 4 条 · 10×" },
      { label: "ARM 条件执行", value: 5, note: "LoongISA 3 条 · 1.7×" },
      { label: "x87 寄存器寻址", value: 13, note: "LoongISA 1 条 · 13×" },
      { label: "80 位浮点转换", value: 41, note: "LoongISA 1 条（单向）· 41×" },
    ],
    max: 44,
    caveat: "A 级实验：build/flags_sim.py；只数指令条数，不是周期，也不是 3A1500 实测。",
  },
  cost: {
    kind: "problem",
    left: {
      head: "整机数字",
      items: ["Linux 启动：本地 MIPS 2.49 亿周期", "优化翻译 3.12 亿，达到本地 79.8%", "原版 QEMU 65.3 亿，是本地的 26 倍"],
    },
    right: {
      head: "论文没证明的事",
      items: ["实验平台是 RTL 仿真，不是流片芯片", "ARM 方向硬件仍从设计走向实现", "Windows 没有真正跑起来"],
    },
    bottom: "更根本的是：LoongISA 仍然长在 MIPS 上，指令编码要走 MIPS 的 UDI 槽。",
  },
  product: {
    kind: "problem",
    left: {
      head: "龙芯 3A1500",
      items: ["4 颗 GS464E，12 级流水", "128 项重排序队列，3 个保留站", "4MB 共享三级 Cache"],
    },
    right: {
      head: "时间与状态",
      items: ["2014 年 9 月流片", "论文分析流片前 RTL 平台", "LoongISA 的第一次完整实现"],
    },
    bottom: "它证明 LoongISA 能实现；也把兼容路线的天花板摆在了台面上。",
  },
  verdict: {
    kind: "verdict",
    good: ["用并集把 x86/ARM 的语义缺口补上", "翻译成本从数十条降到几条", "系统级翻译有了客态与控制寄存器"],
    cost: ["指令系统仍属于 MIPS，自主权没解决", "实验停在 RTL 仿真", "ARM 与 Windows 都未验证"],
    echo: ["2023 年 LoongArch 拆掉 MIPS 授权", "兼容被移到翻译层，不再写进 ISA", "“先借后还”走到还款日"],
    line: "它证明了：融合能买到时间，但买不到指令系统的自主。",
  },
  handoff: {
    kind: "handoff",
    next: "LoongArch",
    nextTitle: "拆掉 MIPS 这层壳",
    line: "下一集：2023 年，为什么终于换掉 MIPS。",
  },
};
