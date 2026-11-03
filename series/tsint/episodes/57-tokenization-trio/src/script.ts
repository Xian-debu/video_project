/**
 * 第 7 章 · 时间序列基础模型 · 第五十七集。
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 voice.json 的实测值。
 */
import voiceJson from "../../data/tsint-57-tokenization-trio/voice.json";

export const FPS = 30;

type SceneSpec = {
  id: string;
  chapter: string;
  kicker: string;
  title: string;
  goal: string;
  pages: number[];
  lines: string[];
};

const SPEC: SceneSpec[] = [
 {
  "id": "open",
  "chapter": "ch07",
  "kicker": "第 7 章 / 时间序列基础模型 · 第五十七集",
  "title": "三种切法，一套 token",
  "goal": "96 点 · 12/6/3 · 24",
  "pages": [
   0,
   10,
   20,
   30
  ],
  "lines": [
   "上一集，模型集成收尾。",
   "这一集换一个问题。",
   "序列怎么切成 token。",
   "一根日线，五百一十二个点。",
   "直接喂给模型，太长。",
   "先切块，再投影。",
   "这一集看三种切法。",
   "patch、周期、分辨率前缀。",
   "都不训练模型，只是变换。",
   "先看一棵最小的例子。",
   "取一段九十六点的合成序列。",
   "正弦波，周期二十四。",
   "第一种切法，patch。",
   "每八点一个 token，十二个。",
   "每十六点，六个。",
   "每三十二点，三个。",
   "第二种，按周期切。",
   "周期二十四，切成四个。",
   "第三种，按分辨率切。",
   "四档分辨率，各切各的。",
   "token 数为什么重要？",
   "模型算注意力，按 token 对 token。",
   "token 越少，能装下的周期越短。",
   "token 越多，位置越多，算得越慢。",
   "切法决定 token 数。",
   "token 数决定容量。",
   "容量决定能看多长的周期。",
   "这是三种切法的共同账。",
   "没有一种免费。",
   "先看这笔账怎么算。",
   "三个数先摆出来。",
   "九十六个点，十二、六、三。",
   "重叠切分，十一个 token。",
   "自相关主峰，周期二十四。",
   "四档分辨率，五百一十二到六十四。",
   "证据二十二项，四组。",
   "三个模块，四百三十三行。",
   "五十条单测，全部通过。",
   "四段路线：问题、定义、读数、验收。",
   "从最小例子开始。"
  ]
 },
 {
  "id": "problem",
  "chapter": "ch07",
  "kicker": "问题 / 三个切法",
  "title": "九十六个点，三种切法",
  "goal": "patch · 周期 · 前缀",
  "pages": [
   0,
   10,
   20,
   30,
   40
  ],
  "lines": [
   "先看原始序列。",
   "五百一十二个交易日。",
   "从二零二四年九月，到二零二六年十月。",
   "价格从一千零八十四，涨到一千四百四十三。",
   "最高一千五百六十。",
   "直接喂，每个点一个位置。",
   "五百一十二个位置，太长。",
   "先把它切成窗口。",
   "这一集，窗口九十六点。",
   "九十六点，就是一页。",
   "九十六点，怎么切？",
   "patch 大小取八、十六、三十二。",
   "九十六除以八，十二。",
   "九十六除以十六，六。",
   "九十六除以三十二，三。",
   "三种切法，正好整除。",
   "token 数分别是十二、六、三。",
   "token 越少，每块越长。",
   "每块越长，能装的周期越长。",
   "这是一笔反比账。",
   "但切法不一定要不重叠。",
   "取 patch 十六，步长八。",
   "相邻两块重叠八个点。",
   "九十六点，能放下十一个窗口。",
   "十一个 token，比不重叠多五个。",
   "重叠让边界点被两个 token 看到。",
   "代价是 token 变多。",
   "收益是边界不丢。",
   "重叠切分，是 patch 的一个变体。",
   "十一个，是这一集的第二个数。",
   "第二种切法，按周期切。",
   "周期从哪来？",
   "先算自相关。",
   "自相关在 lag 二十四，等于一。",
   "二十四就是周期。",
   "九十六除以二十四，四个 token。",
   "每个 token，正好一个周期。",
   "这一集，四个 token。",
   "不会多，也不会少。",
   "周期切，token 数和周期成反比。",
   "第三种切法，换分辨率。",
   "同一段序列，降采样四次。",
   "五百一十二，二百五十六。",
   "一百二十八，六十四。",
   "每一档，配一个前缀向量。",
   "前缀告诉模型，这是哪一档。",
   "前缀维度三十二。",
   "拼接时放在 token 最前面。",
   "总长度加一。",
   "位置编码，整体偏移一位。"
  ]
 },
 {
  "id": "definitions",
  "chapter": "ch07",
  "kicker": "定义 / 三个对象",
  "title": "patch、周期、前缀",
  "goal": "DCT · ACF · 向量表",
  "pages": [
   0,
   10,
   20,
   30,
   40
  ],
  "lines": [
   "先定义 patch。",
   "把序列按长度 p 切开。",
   "每块是一个 p 维向量。",
   "乘一个 p 乘 d 的矩阵。",
   "得到 d 维 token。",
   "这一步叫 patch embedding。",
   "这一集，d 取三十二。",
   "矩阵用 DCT 构造。",
   "正交矩阵，逆就是转置。",
   "投影不丢信息。",
   "为什么用 DCT？",
   "它正交：W 乘 W 转置，是单位阵。",
   "正交的意思是，没有信息损失。",
   "切出去，能原样拼回来。",
   "重构误差，三乘十的负十五次方。",
   "正交误差，二乘十的负十五次方。",
   "都在浮点精度以内。",
   "token 覆盖整段序列。",
   "不重叠时，每个点只属于一个 token。",
   "这是最好的自验证。",
   "再定义周期。",
   "自相关函数，量的是自己和自己像不像。",
   "lag 为零，等于一。",
   "lag 为 k，是错开 k 点的相关。",
   "有周期 P，lag P 处会出现峰。",
   "这一集，找第一个显著峰。",
   "阈值取零点三。",
   "还要求是局部极大。",
   "正弦序列，峰在二十四。",
   "真实序列，峰不一定有。",
   "周期切，按整周期切。",
   "第 j 个 token，取 j 到 j 加一周期。",
   "token 数，九十六除以二十四。",
   "整数除法，四个。",
   "余下的点，不足一周期。",
   "丢掉，不补零。",
   "补零会污染注意力。",
   "找不到周期怎么办？",
   "退化成固定 patch。",
   "这是兜底，也是诚实。",
   "分辨率前缀，是一个向量表。",
   "每一档分辨率，一个向量。",
   "e 的下标 r，是分辨率档位。",
   "这一集四档：一、二、四、八。",
   "前缀维度三十二。",
   "拼接时放在最前。",
   "位置编码要从一位开始。",
   "新分辨率来了怎么办？",
   "查表；没有就取最近一档。",
   "这一集，没有第三档，取二。"
  ]
 },
 {
  "id": "metrics",
  "chapter": "ch07",
  "kicker": "读数 / 四组数字",
  "title": "十二、六、三",
  "goal": "21 · 11 · 4 · 32",
  "pages": [
   0,
   10,
   20,
   30
  ],
  "lines": [
   "先算第一组数。",
   "patch 八，十二个 token。",
   "patch 十六，六个。",
   "patch 三十二，三个。",
   "合计二十一个 token。",
   "每个 token 的长度，就是 patch 长度。",
   "八、十六、三十二。",
   "token 越长，个数越少。",
   "这是反比，不是巧合。",
   "九十六除以 p，就是个数。",
   "第二组数，重叠切分。",
   "patch 十六，步长八。",
   "九十六减十六，除以八。",
   "再加一，十一个。",
   "重叠八个点，换来边界可见。",
   "第三组数，周期。",
   "正弦序列，lag 二十四等于一。",
   "真实序列，lag 二十四等于零点四二。",
   "但没过阈值，也没有局部峰。",
   "真实数据，退化成固定 patch。",
   "第四组数，分辨率。",
   "四档长度：五百一十二。",
   "二百五十六，一百二十八，六十四。",
   "每降一档，点数减半。",
   "前缀维度三十二。",
   "总长度，加一。",
   "重构误差，三乘十的负十五次方。",
   "正交误差，二乘十的负十五次方。",
   "数字很小，说明变换无损。",
   "最近档：三取二，六取四。",
   "四组数，四个结论。",
   "patch 数，反比于 patch 长度。",
   "重叠，用 token 换边界。",
   "周期切，用周期换容量。",
   "分辨率前缀，用一维换多档。",
   "四种变换，都不训练。",
   "DCT 固定，前缀固定。",
   "所以全部可复现。",
   "token 数，都能手算。",
   "这就是这一集的读数。"
  ]
 },
 {
  "id": "implementation",
  "chapter": "ch07",
  "kicker": "实现 / 四百三十三行",
  "title": "三个纯函数，五十条单测",
  "goal": "PatchEmbed · PeriodToken · ResPrefix",
  "pages": [
   0,
   10,
   20,
   30,
   40
  ],
  "lines": [
   "实现分三个模块。",
   "第一个，PatchEmbed。",
   "数据结构只有两个字段。",
   "patch 长度，和步长。",
   "切开，投影，重构。",
   "投影矩阵，DCT 生成。",
   "不存参数，每次现算。",
   "九十六点，十二个 token。",
   "模块小，函数纯。",
   "先看三个接口。",
   "第二个，PeriodToken。",
   "自相关，无偏估计。",
   "减去均值，除以方差。",
   "除以 n 减 k，修正样本数。",
   "不做无偏，峰会被压低。",
   "正弦序列，lag 二十四只剩零点七五。",
   "找了第一个局部峰，还要过阈值。",
   "找不到，返回空。",
   "调用方退化到固定 patch。",
   "接口只有三个函数。",
   "第三个，ResPrefix。",
   "降采样，块均值。",
   "五百一十二，变二百五十六。",
   "除不尽，丢掉尾巴。",
   "前缀表，四行三十二列。",
   "正弦编码，固定，不训练。",
   "最近档，按绝对差找。",
   "平手取小的。",
   "拼接，前缀加 token。",
   "长度加一，位置偏移。",
   "证据程序，二百二十二行。",
   "读 CSV，两列。",
   "取最后九十六点。",
   "先跑 patch，三种长度。",
   "再跑重叠，十一个。",
   "再跑周期，找峰。",
   "最后跑分辨率，四档。",
   "每组读数，写进 JSON。",
   "二十二项检查，逐项对照。",
   "跑完不到一秒。",
   "单测五十条。",
   "patch 十七，周期十五。",
   "分辨率前缀十八。",
   "测计数，十二、六、三。",
   "测重叠，十一。",
   "测正交，误差小于十的负十二。",
   "测重构，误差小于十的负十。",
   "测周期，峰在二十四。",
   "测最近档，三取二。",
   "五十条全绿，才提交。"
  ]
 },
 {
  "id": "verification",
  "chapter": "ch07",
  "kicker": "验收 / 二十二项",
  "title": "二十二个检查，四组",
  "goal": "数据 · patch · 周期 · 前缀",
  "pages": [
   0,
   10,
   20,
   30
  ],
  "lines": [
   "验收二十二项。",
   "数据四项，patch 七项。",
   "周期五项，前缀六项。",
   "一条命令跑完。",
   "跑完不到一秒。",
   "没有跳过，也没有大概通过。",
   "每项都带读数。",
   "读数写进 JSON。",
   "证据在仓库里。",
   "这是第一层。",
   "第一组，patch。",
   "三种长度，十二、六、三。",
   "合计二十一。",
   "重叠切分，十一。",
   "重构误差，三乘十的负十五次方。",
   "正交误差，二乘十的负十五次方。",
   "都小于阈值。",
   "token 覆盖九十六点。",
   "没有点被漏掉。",
   "这一组全绿。",
   "第二组，周期。",
   "lag 零，等于一。",
   "lag 二十四，等于一。",
   "主峰，二十四。",
   "真实序列，lag 二十四零点四二。",
   "过了零点三的阈值。",
   "但没有局部峰。",
   "所以返回空。",
   "退化路径也被测到。",
   "这一组全绿。",
   "第三组，分辨率前缀。",
   "四档长度，五百一十二到六十四。",
   "前缀维度三十二。",
   "前缀放在最前。",
   "总长度加一。",
   "最近档，三取二。",
   "最近档，六取四。",
   "四档都在表里。",
   "拼接后位置偏移。",
   "这六项全绿。"
  ]
 },
 {
  "id": "boundary",
  "chapter": "ch07",
  "kicker": "边界 / 四个不能推",
  "title": "十八分钟，只讲切法",
  "goal": "玩具 · 退化 · 书中未给",
  "pages": [
   0,
   10,
   20,
   30
  ],
  "lines": [
   "边界先说清楚。",
   "这一集只讲切法。",
   "不讲模型结构。",
   "不讲训练目标。",
   "不讲下游效果。",
   "十八分钟，三个变换。",
   "输入一段序列，输出 token。",
   "变量只有切法。",
   "其余全部固定。",
   "这样才能比较。",
   "真实数据，只有一段。",
   "五百一十二个交易日。",
   "只有一只股票。",
   "周期不明显。",
   "自相关在二十四只有零点四二。",
   "没有局部峰，退化。",
   "这不是失败，是现实。",
   "合成序列，周期二十四。",
   "用来验证公式。",
   "两者不能混着说。",
   "书里给了什么？",
   "三种切法的名字和动机。",
   "具体算子，书里没给。",
   "DCT 投影，是我们选的。",
   "阈值零点三，是我们定的。",
   "四档分辨率，是我们选的。",
   "前缀维度三十二，是我们定的。",
   "这些写进偏差表。",
   "不是书里的，是我们的。",
   "可复现，但不唯一。",
   "四个不能推。",
   "不能推：换模型也有效。",
   "不能推：换数据集也有效。",
   "不能推：下游一定更好。",
   "不能推：这是最优切法。",
   "能说的是：三种切法都成立。",
   "token 数都能手算。",
   "变换都无损或近无损。",
   "真实序列的退化路径成立。",
   "能说的只有这些。"
  ]
 },
 {
  "id": "outro",
  "chapter": "ch07",
  "kicker": "收尾 / 三句话",
  "title": "切完，再喂给模型",
  "goal": "12/6/3 · 11 · 22/22",
  "pages": [
   0,
   10,
   20,
   30
  ],
  "lines": [
   "三句话收尾。",
   "第一，三种切法都成立。",
   "patch，周期，分辨率前缀。",
   "第二，token 数和块长成反比。",
   "九十六点，十二、六、三。",
   "第三，真实序列周期弱。",
   "找不到峰，就退化。",
   "三句话，都有读数。",
   "都能一条命令复现。",
   "这就是这一集。",
   "先看交付清单。",
   "三个模块，四百三十三行。",
   "五十条单测。",
   "二十二项检查。",
   "五百一十二个点。",
   "九十六点窗口。",
   "四档分辨率。",
   "全部可复现。",
   "不需要 GPU。",
   "不需要联网。",
   "复现命令，一条。",
   "tsbase evidence-ch07-token。",
   "加数据目录、输出目录、证据路径。",
   "不到一秒，写出 JSON。",
   "检查清单也在里面。",
   "单测用 cabal test。",
   "五十项全绿。",
   "证据二十二项全绿。",
   "时间是零点零秒。",
   "读数都对得上。",
   "下一集，换一个问题。",
   "token 切好了，怎么处理通道？",
   "多变量序列，通道独立还是混合？",
   "通道独立，每个变量一套参数。",
   "通道混合，所有变量一起看。",
   "两种策略，各有代价。",
   "下一集，二十分钟。",
   "从切序列，走到选通道。",
   "底层还是同一件事：预算有限。",
   "下一集再见。"
  ]
 }
];

export const PAGES_INDEX: Record<string, number[]> = {
    "open": [
      0,
      10,
      20,
      30
    ],
    "problem": [
      0,
      10,
      20,
      30,
      40
    ],
    "definitions": [
      0,
      10,
      20,
      30,
      40
    ],
    "metrics": [
      0,
      10,
      20,
      30
    ],
    "implementation": [
      0,
      10,
      20,
      30,
      40
    ],
    "verification": [
      0,
      10,
      20,
      30
    ],
    "boundary": [
      0,
      10,
      20,
      30
    ],
    "outro": [
      0,
      10,
      20,
      30
    ]
  };
const LEAD = 1.2;
const TAIL = 2.2;
const MAX_CHARS = 34;
const LINE_PAD = 0.35;
const MIN_LINE = 1.4;
const CPS = 4.5;
const GAP = 0.18;

const round2 = (v: number) => Math.round(v * 100) / 100;

const voice = voiceJson as Record<string, number>;

const problems: string[] = [];

type Scene = { id: string; chapter: string; kicker: string; title: string; goal: string; start: number; dur: number; lines: string[] };
type Line = { scene: string; index: number; start: number; dur: number; speech: string };

export const SCENES: Scene[] = [];
export const LINES: Line[] = [];

let cursor = 0;
for (const spec of SPEC) {
  const sceneStart = cursor;
  const speech: number[] = [];
  spec.lines.forEach((text, i) => {
    const measured = voice[spec.id + "#" + i];
    const est = text.length / CPS;
    const d = measured && measured > 0.4 ? Math.max(0.01, measured + LINE_PAD) : Math.max(MIN_LINE, est + LINE_PAD);
    speech.push(d);
    if (text.length > MAX_CHARS) problems.push(spec.id + "#" + i + " too long: " + text.length + " chars");
    if (text.length < 6) problems.push(spec.id + "#" + i + " too short: " + text.length + " chars");
    const cps = text.length / d;
    if (measured && (cps < 3.2 || cps > 9.4)) problems.push(spec.id + "#" + i + " cps " + cps.toFixed(2));
  });
  const total = speech.reduce((a, b) => a + b, 0) + GAP * Math.max(0, speech.length - 1);
  const dur = round2(LEAD + total + TAIL);
  let t = sceneStart + LEAD;
  spec.lines.forEach((text, i) => {
    LINES.push({ scene: spec.id, index: i, start: round2(t), dur: round2(speech[i]), speech: text });
    t += speech[i] + GAP;
  });
  SCENES.push({ id: spec.id, chapter: spec.chapter, kicker: spec.kicker, title: spec.title, goal: spec.goal, start: round2(sceneStart), dur, lines: spec.lines });
  cursor += dur;
}

export const SCRIPT_PROBLEMS = problems;
export const TOTAL = Math.round(SCENES.reduce((a, s) => a + s.dur, 0) * FPS);
export const TOTAL_SEC = round2(SCENES.reduce((a, s) => a + s.dur, 0));

export const STARTS = SCENES.map((s) => s.start);
export const CAPTIONS = LINES.map((l) => ({ start: l.start, dur: l.dur, text: l.speech }));

export const linesOf = (id: string) => LINES.filter((l) => l.scene === id);
export const sceneOf = (id: string) => SCENES.find((s) => s.id === id)!;
export const within = (id: string, k: number) => {
  const s = sceneOf(id);
  return [s.start + 0.6, s.start + s.dur - 0.4 * k] as const;
};
