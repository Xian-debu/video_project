import { buildScript } from "../series/loongarch/timing";
import type { SceneSpec } from "../series/loongarch/types";
import voice from "../../data/overview/voice.json";

const SPEC: SceneSpec[] = [
  {
    id: "open",
    chapter: "总览",
    kicker: "龙芯系列 · 第七集",
    title: "二十年，一条被约束推出来的主线",
    goal: "收束全系列",
    lines: [
      "六篇论文，五次转身，一次换地基。",
      "这不是一份事先写好的路线图。",
      "每一步，都是当时条件下能走的那一步。",
    ],
  },
  {
    id: "timeline",
    chapter: "时间线",
    kicker: "发展脉络 / 2003–2023",
    title: "六篇论文，一条主线",
    goal: "把六集放回同一条时间线",
    lines: [
      "2003 年先证明能跑，2005 年追 IPC，2006 年补系统。",
      "2009 年上多核，2015 年做融合，2023 年换掉地基。",
      "顺序不是 PDF 编号，而是发表年份。",
    ],
  },
  {
    id: "problem",
    chapter: "两种读法",
    kicker: "回看",
    title: "如果只看结果，会以为这是一条规划好的路",
    goal: "区分叙事与约束",
    lines: [
      "只看结果，会以为每一步都是主动选择。",
      "但当年的约束很硬：工艺买不到，生态搬不动，授权拿不到。",
      "路线不是先画好的，是走一步解一个约束。",
    ],
  },
  {
    id: "thesis",
    chapter: "判断",
    kicker: "全系列论点",
    title: "主线不是规划出来的，是被约束推出来的",
    goal: "给出全系列的核心判断",
    lines: [
      "这不是贬低，而是解释。",
      "正因为先解决生存问题，才有机会在后面谈性能与自主。",
    ],
  },
  {
    id: "lineage",
    chapter: "五条线",
    kicker: "继承关系",
    title: "五个方向，在同一张时间线上反复出现",
    goal: "把六集的技术线索叠在一起",
    lines: [
      "乱序核骨架被反复扩参，这是最快的一条线。",
      "指令系统和二进制翻译是另一条更慢、也更难的路。",
      "存储与并行度，则跟着工艺和产品形态一起变。",
    ],
  },
  {
    id: "experiment",
    chapter: "回查",
    kicker: "数字 / 条",
    title: "把六篇论文的引文全部回查一遍",
    goal: "验证系列的事实底座",
    lines: [
      "这一集不测芯片，做一次证据回查。",
      "把前六集 claims 台账里的每一条引文，拿回对应论文原文里找。",
      "这是本集的 A 级实验：可复现，但只验证引文存在，不验证解释正确。",
    ],
  },
  {
    id: "result",
    chapter: "回查结果",
    kicker: "数字 / 条",
    title: "六集共 109 条引文，全部能在原文中找到",
    goal: "给出可复现的证据统计",
    lines: [
      "六篇论文，一共一百零九条引文。",
      "逐条回查，全部命中原文。",
      "这说明数字有出处；不等于每个解释都对。",
    ],
  },
  {
    id: "performance",
    chapter: "可比性",
    kicker: "读数字的方式",
    title: "这些数字不能连成一条性能曲线",
    goal: "避免跨论文误读",
    lines: [
      "六篇论文的平台、工艺、编译器都不同。",
      "绝对主频和 SPEC 分数，不能直接连成一条增长曲线。",
      "能连起来的，是选择：每一次为什么这么选。",
    ],
  },
  {
    id: "ecosystem",
    chapter: "生态",
    kicker: "补课",
    title: "硬件之外，还有一笔更长的账",
    goal: "把生态成本说清楚",
    lines: [
      "2006 年补系统软件，2015 年补二进制翻译，2023 年补生态。",
      "生态不是发布会，是一条包、一行适配堆出来的。",
      "这笔账，比流片更长。",
    ],
  },
  {
    id: "limits",
    chapter: "边界",
    kicker: "不能说的话",
    title: "哪些话，这个系列不能说",
    goal: "守住事实边界",
    lines: [
      "不能说自主指令系统一换，性能就自动追上了。",
      "不能说 2009 年的可重构研究都已经落地。",
      "也不能说 2025 年消除壁垒已经实现，那还是目标。",
    ],
  },
  {
    id: "verdict",
    chapter: "结论",
    kicker: "总账",
    title: "它证明了：路可以自己走，但每一步都要付账",
    goal: "给出全系列结论",
    lines: [
      "做对的，是在约束里保住了继续迭代的资格。",
      "付出的，是性能和生态上的长期欠账。",
      "还没解决的，是绝对性能、软件生态和开发者习惯。",
    ],
  },
  {
    id: "handoff",
    chapter: "回到开头",
    kicker: "系列完",
    title: "一条还在走的路",
    goal: "收束并回指第一集",
    lines: [
      "六篇论文讲完，主线还在继续。",
      "如果只看一句，请记住：先活下来，才有资格谈追上。",
    ],
  },
];

export const { SCENES, LINES, TOTAL_SEC, TOTAL, FPS, SCRIPT_PROBLEMS } = buildScript(
  SPEC,
  voice as Record<string, number>,
  30,
);
