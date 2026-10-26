/** 系列共同时间线：六篇论文 + 一集总览。年份与顺序是事实层，改这里必须同步 sources。 */
export const TIMELINE = [
  { year: "2003", short: "龙芯1号", title: "第一块芯片：单发射乱序", paper: "龙芯1号处理器结构设计" },
  { year: "2005", short: "Godson-2", title: "四发射乱序核：可复用的模板", paper: "Microarchitecture of the Godson-2 Processor" },
  { year: "2006", short: "系统优化", title: "让整机跟上核：缓存、TLB、非对齐", paper: "龙芯2号处理器系统优化关键技术" },
  { year: "2009", short: "Godson-3", title: "四核、NoC 与 x86 硬件翻译", paper: "Godson-3: A Scalable Multicore RISC Processor" },
  { year: "2015", short: "LoongISA", title: "兼容做进系统：x86/ARM 双翻译", paper: "龙芯指令系统融合技术" },
  { year: "2023", short: "LoongArch", title: "自主指令系统与三向翻译", paper: "龙芯指令系统架构技术" },
] as const;

export const THREADS = [
  { id: "core", label: "乱序核模板", color: "cyan" },
  { id: "isa", label: "指令系统", color: "amber" },
  { id: "bt", label: "二进制翻译", color: "violet" },
  { id: "mem", label: "存储层次", color: "cyan" },
  { id: "par", label: "并行度", color: "amber" },
] as const;

export type TimelineIndex = 0 | 1 | 2 | 3 | 4 | 5;
