import type { EpisodeContent } from "../series/loongarch/types";

export const CONTENT: EpisodeContent = {
  open: {
    kind: "open",
    year: "2006",
    lead: "龙芯系列 · 第三集",
    title: "系统优化：把核用起来",
    subtitle: "2006 年，龙芯2号的整机跑起来了。同样一颗核，系统软件不同，整机性能可能差出一截。",
    thesis: "核心造出来之后，性能还丢在哪里？",
  },
  timeline: {
    kind: "timeline",
    active: 2,
    note: "2006 年，论文把镜头从核内转向核外：地址翻译、页大小、I/O。",
  },
  background: {
    kind: "problem",
    left: {
      head: "继续堆硬件",
      items: ["提高主频，受工艺限制", "加大 Cache，成本上升", "扩大乱序窗口，边际递减"],
    },
    right: {
      head: "系统软件",
      items: ["地址怎么翻译", "页开多大", "I/O 路径怎么走"],
    },
    bottom: "硬件决定上限，系统软件决定这台机器能跑到上限的几成。",
  },
  problem: {
    kind: "problem",
    left: {
      head: "Cache 别名",
      items: ["虚地址索引、物理地址匹配", "两个虚地址可能指向同一物理页", "硬件不维护一致性"],
    },
    right: {
      head: "TLB 与 I/O",
      items: ["64 项 TLB，4KB 页只覆盖 256KB", "三级页表，一次重填 5 次访存", "Uncache 写一次一次总线事件"],
    },
    bottom: "三笔账，都在核外；不改一行硬件，也能把性能拿回来一部分。",
  },
  thesis: {
    kind: "thesis",
    statement: "处理器的性能，有一半在核外。",
    detail: "地址怎么翻译、页开多大、I/O 怎么走，都会直接改变跑分。龙芯2号的做法，是在 Linux 内核里把这三个坑一个个填上。",
    stat: "405MHz",
    statLabel: "512MB 内存；L1 64KB 四路；L2 8MB；Linux 2.4.22",
  },
  paper: {
    kind: "paper",
    paperTitle: "龙芯2号处理器系统优化关键技术",
    meta: ["《计算机研究与发展》2006 年 43 卷 6 期", "伍鸣、张福新、林伟、许先超、袁楠、王剑", "中国科学院计算技术研究所"],
    contributions: [
      { head: "Cache 别名", body: "比较 16KB 大页、页着色、动态检测三种内核解法，给出适用边界。" },
      { head: "TLB 失效", body: "软 TLB 把重填降到 3 次访存；FAST TLB REFILL 缓存第三级页表指针。" },
      { head: "Uncache Accelerate", body: "32B 缓冲区把零散 Uncache 写合成突发写，加速视频输出。" },
    ],
  },
  alias: {
    kind: "diagram",
    variant: "alias",
    title: "Cache 别名：两个虚地址，两个副本",
    items: [{ label: "64KB / 4 路", value: "14 位索引", note: "颜色位 (13..12) 可能不同" }],
    caption: "页大小 4KB 时，颜色位不同就会索引到不同 Cache 行，却映射同一个物理页。",
  },
  coloring: {
    kind: "problem",
    left: {
      head: "页着色 / 大页",
      items: ["页着色：分配时保证颜色位一致", "16KB 页：低 14 位天然一致", "代价：伙伴分配器变复杂，页缓存频繁拆建"],
    },
    right: {
      head: "动态检测",
      items: ["建立或断开映射时检查颜色位", "不同就写回并置无效", "代价：频繁刷新 Cache，失效次数增加"],
    },
    bottom: "三种解法都不是免费的；论文最终把 16KB 页作为更自然的折中。",
  },
  pages: {
    kind: "metrics",
    title: "64 项 TLB 的覆盖范围（结构模型）",
    unit: " KB",
    bars: [
      { label: "4KB 页", value: 256, note: "失效 4678 次" },
      { label: "16KB 页", value: 1024, note: "失效 2441 次" },
      { label: "64KB 页", value: 4096, note: "失效 1346 次" },
    ],
    max: 4500,
    caveat: "A 级实验：build/page_sim.py，20 万次访问，85% 落在 192KB 热区；不是龙芯2号实测。",
  },
  softtlb: {
    kind: "metrics",
    title: "软 TLB 直接映射命中率（结构模型）",
    unit: "%",
    bars: [
      { label: "256 项", value: 40.5, note: "太小" },
      { label: "1K 项", value: 85.4, note: "接近可用" },
      { label: "4K 项", value: 89.6, note: "论文的选择" },
      { label: "16K 项", value: 91.7, note: "收益递减" },
    ],
    max: 100,
    caveat: "A 级实验：build/page_sim.py 的重填局部性模型； 论文实测 1KB 以上软 TLB 命中率可达 90% 左右。",
  },
  fastrefill: {
    kind: "problem",
    left: {
      head: "三级页表",
      items: ["64 位 Linux/mips64 用三级页表", "一次重填 5 次访存", "可能带来 2–4 次 Cache 失效"],
    },
    right: {
      head: "FAST TLB REFILL",
      items: ["全局缓存第三级页表指针", "重填时跳过前两级", "进程切换只拷固定几个指针"],
    },
    bottom: "在 TLB 失效频繁的程序上提高 1%–7%，vortex 提高 7.17%。",
  },
  ua: {
    kind: "problem",
    left: {
      head: "普通 Uncache 写",
      items: ["每次 2 个系统周期", "一次写就是一次总线事件", "阻塞后续访存"],
    },
    right: {
      head: "UA 突发写",
      items: ["32B 缓冲区攒连续写", "一次突发写 5 个周期", "连续访问加速 1.6–3.2 倍"],
    },
    bottom: "MPlayer 的视频输出时间提高 1–2 倍；优化点在页表项的 Cache Algorithm 域。",
  },
  experiment: {
    kind: "problem",
    left: {
      head: "实验设置",
      items: ["64 项全相联 TLB，LRU", "20 万次访问，块内 12 次连续", "85% 热区 192KB，15% 冷区 8MB"],
    },
    right: {
      head: "变量与产出",
      items: ["页大小 4KB / 16KB / 64KB", "统计失效次数与 MPKI", "同一轨迹，只改页大小"],
    },
    bottom: "A 级实验：模型跑的是因果链，不是芯片；数字用于解释趋势，不替代实测。",
  },
  result: {
    kind: "problem",
    left: {
      head: "论文的 SPECint",
      items: ["64KB 比 16KB，SPECint 高约 5%", "浮点程序收益不到 1%", "16KB 比 4KB：只有定性结论"],
    },
    right: {
      head: "论文的 dbench",
      items: ["64KB 页带宽明显下降", "页缓存冗余 I/O 变多", "并发进程越多，下降越明显"],
    },
    bottom: "所以 16KB 是折中：既缓解别名，又不把文件 I/O 拖垮。",
  },
  limits: {
    kind: "problem",
    left: {
      head: "论文证明了",
      items: ["不改硬件，只改内核也能提升整机性能", "三类问题可以在同一套系统支持里处理", "16KB 页对 SPECint 有稳定收益"],
    },
    right: {
      head: "论文没有证明",
      items: ["对所有负载都成立", "64KB 页总是更好", "软 TLB 与 UA 能替代硬件优化"],
    },
    bottom: "系统优化是场景工程：收益真实，但边界同样真实。",
  },
  product: {
    kind: "problem",
    left: {
      head: "落地",
      items: ["Linux 2.4.22 龙芯2号内核", "龙芯2E / 2F 整机沿用", "UA 进入 MPlayer 视频输出路径"],
    },
    right: {
      head: "仍待补课",
      items: ["驱动与外设支持", "浏览器与办公软件", "开发者和用户生态"],
    },
    bottom: "核心与系统软件都站住了，生态是下一道更长的坎。",
  },
  verdict: {
    kind: "verdict",
    good: ["把 Cache 别名、TLB、I/O 放进同一套系统支持", "证明不改硬件也能拿回可观的整机性能", "16KB 页成为后续内核的默认折中"],
    cost: ["方案高度依赖负载", "页大小、软 TLB、UA 都要按场景调", "生态与整机体验仍未跟上"],
    echo: ["后续龙芯继续在核外补系统", "页大小与 TLB 成为长期调优项", "UA 思路延续到后续 I/O 路径"],
    line: "它证明了：同一颗核，系统软件可以决定整机跑成什么样。",
  },
  handoff: {
    kind: "handoff",
    next: "Godson-3",
    nextTitle: "四颗核，怎么连成一台机器",
    line: "下一集：2009 年，龙芯从单核走到四核，还要在片上讲一致性。",
  },
};
