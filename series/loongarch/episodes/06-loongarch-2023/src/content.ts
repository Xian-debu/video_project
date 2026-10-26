import type { EpisodeContent } from "../series/loongarch/types";

export const CONTENT: EpisodeContent = {
  open: {
    kind: "open",
    year: "2023",
    lead: "龙芯系列 · 第六集",
    title: "换掉地基",
    subtitle: "2023 年，3A5000 成为第一颗跑 LoongArch 的芯片。指令系统不再借 MIPS 的壳，编码、ABI 和兼容方式都重新写了一遍。",
    thesis: "重做一套指令系统，到底值不值？",
  },
  timeline: {
    kind: "timeline",
    active: 5,
    note: "2023 年，LoongArch 随 3A5000 量产。六篇论文在这里收束：从证明能跑，走到自己定规则。",
  },
  background: {
    kind: "problem",
    left: {
      head: "LoongISA 的做法",
      items: ["在 MIPS 上加 x86/ARM 语义", "补丁塞进 MIPS 编码与 UDI 槽", "向量、虚拟化只能绕路"],
    },
    right: {
      head: "走到头的信号",
      items: ["指令系统仍属于 MIPS", "扩展空间被主编码锁住", "生态自主权没有解决"],
    },
    bottom: "补丁越打越厚，地基还是别人的。",
  },
  thesis: {
    kind: "thesis",
    statement: "换地基，不是换装修。",
    detail: "LoongArch 重新定义基础编码、寄存器和 ABI；x86、ARM、MIPS 的兼容被移到 LBT 翻译层。3A5000 是这套新契约的第一颗芯片。",
    stat: "≈2000 条",
    statLabel: "基础集 LBase + LVZ/LBT/LSX/LASX 四个扩展；32 位定长编码",
  },
  paper: {
    kind: "paper",
    paperTitle: "龙芯指令系统架构技术",
    meta: ["《计算机研究与发展》2023, 60(1): 2–16", "胡伟武、汪文祥、吴瑞阳、王焕东 等", "中国科学院计算技术研究所"],
    contributions: [
      { head: "编码", body: "32 位定长、4 字节对齐、9 种格式；操作码从高位摆，寄存器域从低位摆。" },
      { head: "组成", body: "基础集 LBase 加四个扩展：LVZ 虚拟化、LBT 二进制翻译、LSX 128 位、LASX 256 位向量。" },
      { head: "兼容", body: "兼容不写进主编码，由 LBT 提供标志位、x87、双页表和便签寄存器。" },
    ],
  },
  subtraction: {
    kind: "problem",
    left: {
      head: "MIPS 留下的包袱",
      items: ["分支延迟槽", "HI/LO 专用乘除结果寄存器", "溢出陷阱与固定地址分段"],
    },
    right: {
      head: "LoongArch 删掉",
      items: ["取消延迟槽，分支直接生效", "乘除结果直接写通用寄存器", "取消陷阱指令，地址空间改为平整"],
    },
    bottom: "这些减法不直接加分，但让流水线和编译器少背历史包袱。",
  },
  encoding: {
    kind: "problem",
    left: {
      head: "变长编码",
      items: ["指令 1 到 15 字节", "译码先找边界，再译内容", "一条指令可能跨 Cache 行"],
    },
    right: {
      head: "LoongArch 定长",
      items: ["固定 32 位，4 字节对齐", "每条指令都从 4 字节边界开始", "64 字节取指块正好 16 个槽"],
    },
    bottom: "定长牺牲一点代码密度，换来取指和译码的可预测性。",
  },
  abi: {
    kind: "problem",
    left: {
      head: "MIPS ABI 的保留",
      items: ["at 给汇编器用", "k0/k1 给内核用", "gp 指向全局数据区"],
    },
    right: {
      head: "LoongArch 的取舍",
      items: ["删掉 at、k0/k1、gp", "a0/a1 兼作函数返回值", "新增 tp 做线程指针"],
    },
    bottom: "ABI 每省一个寄存器，编译器的寄存器压力就少一分。",
  },
  lbt: {
    kind: "problem",
    left: {
      head: "LBT 补四类语义",
      items: ["EFLAGS：产标志指令 + SETX86J", "x87：3 位 TOP、TOP 寻址、80 位转换", "双页表：TLB 同时放宿主与客户机映射"],
    },
    right: {
      head: "省下的指令",
      items: ["SUB + 四标志：近 30 条 → 4 条", "x86 访存：14 条 → 2 条，地址位够时 1 条", "便签寄存器：翻译器有临时寄存器可用"],
    },
    bottom: "硬件只补最高频、最贵的语义缺口，不复制整套 x86。",
  },
  latm: {
    kind: "quote",
    text: "MIPS 到 LoongArch 的翻译是无损的：九成以上的 MIPS 指令一对一映射。",
    source: "《龙芯指令系统架构技术》第 4.4.1 节",
    note: "20MHz FPGA 上，翻译运行 MIPS 二进制的平均速度达到原生 LoongArch 的 91%，超过原生 MIPS。",
  },
  latx: {
    kind: "metrics",
    title: "翻译层的效率（相对原生）",
    unit: "%",
    bars: [
      { label: "原生 LoongArch", value: 100, note: "基准" },
      { label: "LATM 翻译 MIPS", value: 91, note: "SPEC CINT2000" },
      { label: "LATX 翻译 x86 定点", value: 65.5, note: "QEMU 的 3.6×" },
      { label: "LATX 翻译 x86 浮点", value: 70.3, note: "QEMU 的 40.7×" },
    ],
    max: 105,
    caveat: "论文表 8/9：LATM 在 20MHz FPGA，LATX 在 3A5000；口径不同，只作相对参考。",
  },
  experiment: {
    kind: "problem",
    left: {
      head: "模型做什么",
      items: ["生成 32 位定长指令流", "生成 1 到 15 字节变长流", "数译码四条指令要几步"],
    },
    right: {
      head: "模型不做什么",
      items: ["不实现完整 LoongArch 编码", "不跑真实 x86 程序", "不代表 3A5000 实测"],
    },
    bottom: "A 级实验：build/isa_sim.py；验证的是编码结构，不是芯片性能。",
  },
  result: {
    kind: "problem",
    left: {
      head: "模型输出",
      items: ["定长：四条指令 1 步切分", "变长：平均要 4 步串行找边界", "64 字节块：定长固定 16 个槽"],
    },
    right: {
      head: "这意味着",
      items: ["译码器可以并行切多条", "分支目标天然 4 字节对齐", "代价：代码密度不如变长"],
    },
    bottom: "定长不是免费的优势，是拿密度换可预测性。",
  },
  performance: {
    kind: "metrics",
    title: "3A5000 相对 3A4000 的提升",
    unit: "%",
    bars: [
      { label: "SPECint 单核", value: 74.8, note: "定点几何平均" },
      { label: "SPECfp 单核", value: 68.7, note: "浮点几何平均" },
      { label: "UnixBench 单线程", value: 113.6, note: "整机综合" },
    ],
    max: 120,
    caveat: "含主频、内存与 Cache 变化，不是纯指令系统收益；同微结构 FPGA 上 LoongArch 平均快约 7%。",
  },
  ecosystem: {
    kind: "problem",
    left: {
      head: "三年四步",
      items: ["工具链 + 模拟器：约 6 个月", "最小 Linux + BIOS/内核：约 6 个月", "Chrome/KVM/Docker 等：约 6 个月", "上游社区与第三方：约 18 个月"],
    },
    right: {
      head: "做出来的量",
      items: ["24,300+ 源码包", "58,100+ 二进制包", "40 万行以上架构适配"],
    },
    bottom: "生态不是发布会，是一条条包和一行行适配堆出来的。",
  },
  limits: {
    kind: "problem",
    left: {
      head: "论文承认的短板",
      items: ["编译器还没充分利用乘加", "x86 应用翻译仍在成熟", "绝对性能仍落后同期桌面 CPU"],
    },
    right: {
      head: "没做到的事",
      items: ["LATX 定点效率只有 65.5%", "系统级翻译原型仍在完善", "“2025 年消除壁垒”是目标"],
    },
    bottom: "换地基解决的是自主权，不是性能差距。",
  },
  verdict: {
    kind: "verdict",
    good: ["编码、ABI、扩展一次重写，不再受 MIPS 约束", "定长编码让取指和译码可预测", "兼容被移出 ISA，交给 LATM/LATX/LATA"],
    cost: ["生态从零重建，三年才补齐常用软件", "绝对性能与编译器仍有差距", "翻译效率 65.5%/70.3%，兼容不免费"],
    echo: ["2015 年融合买时间，2023 年换地基收尾", "LoongArch 成为后续龙芯 CPU 的指令系统基线", "六篇论文的主线在此合拢"],
    line: "它证明了：指令系统可以自己定，代价也要自己付。",
  },
  handoff: {
    kind: "handoff",
    next: "总览",
    nextTitle: "六次选择，一条主线",
    line: "下一集：把六篇论文放回一条时间线，算总账。",
  },
};
