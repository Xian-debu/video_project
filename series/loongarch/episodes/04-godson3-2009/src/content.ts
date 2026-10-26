import type { EpisodeContent } from "../series/loongarch/types";

export const CONTENT: EpisodeContent = {
  open: {
    kind: "open",
    year: "2009",
    lead: "龙芯系列 · 第四集",
    title: "四颗核，怎么连成一台机器",
    subtitle: "2009 年，65 纳米、四核、1GHz。这一代的问题不再是单核快不快，而是多核怎么协同，x86 软件怎么跑。",
    thesis: "核多起来之后，性能卡在哪里？",
  },
  timeline: {
    kind: "timeline",
    active: 3,
    note: "2009 年，Godson-3 登上 Hot Chips。四核、片上网络、x86 硬件翻译，三个词概括这一代。",
  },
  background: {
    kind: "problem",
    left: {
      head: "继续堆单核",
      items: ["功耗墙先到", "指令级并行见顶", "服务器要的是吞吐"],
    },
    right: {
      head: "直接堆核",
      items: ["核多了，总线先堵", "缓存一致性变复杂", "软件不一定能并行"],
    },
    bottom: "多核不是把核摆上去，难的是让它们共享数据而不打架。",
  },
  problem: {
    kind: "problem",
    left: {
      head: "互连",
      items: ["共享总线：一次只能一个主设备", "广播一致性：核越多流量越大", "16 核、64 核怎么扩"],
    },
    right: {
      head: "兼容",
      items: ["x86 二进制要能跑", "EFLAGS、x87 栈、80 位浮点", "纯软件翻译一条要几十条"],
    },
    bottom: "这一代同时押两件事：可扩展的片上网络，和给翻译器加硬件支点。",
  },
  thesis: {
    kind: "thesis",
    statement: "先扩互连，再补语义。",
    detail: "片上用 crossbar 把四核和四个 L2 bank 连起来，节点之间再用 mesh 扩；指令系统不换，而是在 MIPS64 上加一小套硬件指令，专门补 x86 的语义缺口。",
    stat: "4 核 · 1GHz",
    statLabel: "65 纳米七层金属；425M 晶体管；14.24×12.205 毫米",
  },
  paper: {
    kind: "paper",
    paperTitle: "Godson-3: A Scalable Multicore RISC Processor with x86 Emulation",
    meta: ["IEEE Micro, 2009, Vol.29 No.2", "Weiwu Hu, Rui Wang, Yunji Chen, et al.", "中国科学院计算技术研究所"],
    contributions: [
      { head: "节点内 crossbar", body: "四核、四个 L2 bank、一个 8×8 crossbar，节点内延迟四拍。" },
      { head: "2×2 mesh", body: "四个节点拼成 16 核；4×4 网格可扩到 64 核。" },
      { head: "x86 硬件辅助", body: "SetFlag、x86SUB、x87 TOP 指针，只补最贵的语义缺口。" },
    ],
  },
  node: {
    kind: "problem",
    left: {
      head: "一个节点",
      items: ["4 个 GS464 核", "4 个共享 L2 bank", "8×8 crossbar，4 拍延迟"],
    },
    right: {
      head: "节点之间",
      items: ["8 核 = 2 个节点", "16 核 = 2×2 网格", "4×4 网格可到 64 核"],
    },
    bottom: "四核版只用一个节点；论文里的 mesh 是为 8/16/64 核留的扩展路径。",
  },
  mesh: {
    kind: "diagram",
    variant: "noc",
    title: "2×2 网格：十六核的扩展单元",
    items: [{ label: "节点", value: "4 核 + 4 L2", note: "四核版只占一个节点；2×2 是 16 核。" }],
    caption: "节点内 crossbar，节点间四条方向；4×4 网格继续铺，可扩到 64 核。",
  },
  coherence: {
    kind: "quote",
    text: "目录协议维护 L1 对 L2 块的副本。",
    source: "IEEE Micro 2009 · 第 4 节",
    note: "论文没有给目录项数和状态机细节；扩到 64 核时，目录本身会不会成为瓶颈，论文没有回答。",
  },
  xlate_problem: {
    kind: "problem",
    left: {
      head: "x86 的坑",
      items: ["EFLAGS 六个常用标志", "x87 寄存器栈 + TOP", "80 位浮点与段式地址", "间接跳转与特权语义"],
    },
    right: {
      head: "纯软件翻译",
      items: ["一条 SUB + 四个标志约 40 条", "80↔64 位浮点超过 40 条", "代码膨胀，翻译缓存吃紧"],
    },
    bottom: "不是翻译不出来，是翻译出来太贵。",
  },
  xlate_hw: {
    kind: "problem",
    left: {
      head: "硬件加了什么",
      items: ["SetFlag 前缀：算术指令产 EFLAGS", "x86SUB：SUB 与标志一条完成", "TOP 指针：x87 栈顶硬件维护", "80↔64 位转换的新指令"],
    },
    right: {
      head: "省了什么",
      items: ["SUB + 四标志：约 40 条 → 1 条", "浮点栈顶：每条少翻十几条", "80 位转换：40 条 → 少量", "代价：译码器与异常处理更复杂"],
    },
    bottom: "硬件只补高频、最贵的语义缺口，不复制整颗 x86；论文的九个基准平均接近理想本地 MIPS 的 70%。",
  },
  experiment: {
    kind: "problem",
    left: {
      head: "实验设置",
      items: ["4 个核持续发访存请求", "4 个 L2 bank，队列容量 8", "跑 5 万个周期"],
    },
    right: {
      head: "两种互连",
      items: ["共享总线：串行服务、广播", "crossbar：按 bank 并行", "同一请求轨迹，只改互连"],
    },
    bottom: "A 级实验：离散事件模型，跑的是机制，不是 Godson-3 芯片。",
  },
  result: {
    kind: "metrics",
    title: "四核访存吞吐（结构模型）",
    unit: " 请求/拍",
    bars: [
      { label: "共享总线", value: 0.25, note: "延迟 34.6 拍 · 丢 83%" },
      { label: "crossbar", value: 1.0, note: "延迟 2.6 拍 · 不丢" },
    ],
    max: 1.2,
    caveat: "A 级实验：build/noc_sim.py；4 核、4 bank、5 万周期。总线吞吐是 crossbar 的四分之一，还丢掉 37472/44989 个请求。",
  },
  reconfig: {
    kind: "problem",
    left: {
      head: "可重构",
      items: ["AXI 插槽可以换核", "L2 块可在 bank 间迁移", "DMA 可以配置"],
    },
    right: {
      head: "论文的状态",
      items: ["研究特性，不是量产配置", "8/16 核仍在物理实现", "软件栈尚未验证"],
    },
    bottom: "论文把可重构写成方向；不能当成已经落地的产品。",
  },
  limits: {
    kind: "problem",
    left: {
      head: "四核论文给了",
      items: ["65 纳米、四核、1GHz 流片", "425M 晶体管，14.24×12.205 毫米", "七层金属，8×8 crossbar"],
    },
    right: {
      head: "四核论文没给",
      items: ["四核 SPEC 分数", "四核功耗", "目录协议细节"],
    },
    bottom: "42 平方毫米、51M、3–5 瓦是 90 纳米单核 2F8 的数据，不能安到四核头上。",
  },
  product: {
    kind: "problem",
    left: {
      head: "2F8：单核证明",
      items: ["90 纳米，单核 1GHz", "SPECint/fp2000 超过 500", "51M 晶体管，42mm²，3–5W"],
    },
    right: {
      head: "四核 Godson-3",
      items: ["2008 年流片", "四核 1GHz，425M 晶体管", "8/16 核研发中"],
    },
    bottom: "单核先证明 GS464 能打；四核先证明四颗核能协同。两笔账要分开算。",
  },
  verdict: {
    kind: "verdict",
    good: ["crossbar + 目录把多核扩展路径打开", "x86 硬件辅助把翻译成本压下来", "GS464 核心模板继续复用"],
    cost: ["四核没有公开 SPEC", "功耗与目录细节缺失", "可重构仍停在研究"],
    echo: ["2015 年 LoongISA 继续处理兼容", "2023 年 LoongArch 才拆掉 MIPS 授权", "多核互连从 mesh 走向更大规模"],
    line: "它证明了：四颗核可以连成一台机器，但账还没算完。",
  },
  handoff: {
    kind: "handoff",
    next: "LoongISA",
    nextTitle: "兼容的代价，开始算总账",
    line: "下一集：2015 年，为什么不换指令系统，而是先做融合。",
  },
};
