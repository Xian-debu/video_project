/**
 * 《通道关系三法：混合 MLP、iTransformer、图通道》—— 第 3 章 · 通道与图。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-24-chan-mix-itrans-graph/voice.json";

export const FPS = 30;

type SceneSpec = {
  id: string;
  chapter: string;
  kicker: string;
  title: string;
  goal: string;
  lines: string[];
};

const SPEC: SceneSpec[] = [
  {
    id: "open",
    chapter: "开场",
    kicker: "第 3 章 / 通道与图 · 第二十四集",
    title: "通道关系三法",
    goal: "混合 MLP · iTransformer · 图通道",
    lines: [
      "第三篇章，第二十四集。",
      "上一集把预测做成了分布。",
      "这一集换一个轴。",
      "前面十几集，注意力都放在时间轴上。",
      "这一集把它翻到通道轴上。",
      "八个通道，谁跟谁有关系。",
      "这就是本集的问题。",
      "书在印刷版五十五到六十二页。",
      "书里给了三种做法。",
      "一种用 MLP 混合通道。",
      "一种把变量当成 token 做注意力。",
      "还有一种先建一张图，再做卷积。",
      "三个模块，四十四项证据。",
      "八十五组测试，一千一百三十三条断言。",
      "三个数字先记住。",
      "一百四十四，是八个通道混合的参数量。",
      "六十四对九千二百一十六，是两种注意力规模。",
      "零点五，是两节点图的手算值。",
      "真实数据上还有一个数：三。",
      "八通道的图，恰好分成三个行业块。",
      "这一集证明的是结构，不是精度。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "为什么把注意力翻到通道轴",
    goal: "更少的 token，更稠密的关系",
    lines: [
      "先算一笔账。",
      "时间轴上，九十六个时间步两两比较。",
      "注意力矩阵是九十六乘九十六，九千二百一十六格。",
      "通道轴上只有八个变量。",
      "八乘八，六十四格。",
      "相差一百四十四倍。",
      "便宜不等于有用。",
      "关键是通道之间真的有关系。",
      "同一块面板，行业内外差得很明显。",
      "行业内平均相关 0.694。",
      "行业间只有 0.437。",
      "二十只票的面板更清楚。",
      "行业内 0.505，行业间 0.194。",
      "差了 2.6 倍。",
      "这层关系，时间轴上的注意力看不见。",
      "因为时间轴比的是同一条序列的不同时刻。",
      "通道轴比的是不同标的的同一个时刻。",
      "所以这一集要回答三件事。",
      "第一，怎么用最少的参数混合通道。",
      "第二，怎么让注意力直接作用在变量上。",
      "第三，怎么把关系画成一张图。",
      "三种做法对应书里的三种策略。",
      "完全依赖、完全依赖、部分依赖。",
      "第一种是稠密混合。",
      "第二种是稠密注意力。",
      "第三种是稀疏图。",
      "稠密和稀疏，是这一集的分水岭。",
      "后面每一页都会回到这条线。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三种做法，一个通道轴",
    goal: "混合 · 变量注意力 · 图卷积",
    lines: [
      "先把三种做法钉住。",
      "输入都是一块面板。",
      "T 行是时间，N 列是通道。",
      "第一种，通道混合 MLP。",
      "先把每个时刻的 N 个通道，乘一个 N×N 矩阵。",
      "Z 一撇，等于 Z 加 W2 乘激活 W1 乘 Z。",
      "这一步只混通道，不动时间。",
      "再换一个方向，混时间。",
      "Z 两撇，等于 Z 一撇加激活后的时间混合。",
      "两个方向交错，就是 TSMixer 的结构。",
      "参数量是二 N 平方加 N，N 等于八。",
      "一百四十四。",
      "第二种，iTransformer。",
      "它把面板转置，每一列变成一个 token。",
      "八个变量，就是八个 token。",
      "Z 等于 Embed，作用在 X 的转置上。",
      "注意力在八个 token 之间算。",
      "A 等于 softmax，Z WQ 乘 Z WK 的转置。",
      "再除以根号 dk。",
      "复杂度是 N 平方加 N 乘 H，不是 T 平方。",
      "第三种，图通道。",
      "先算两两相关，每个节点取最近的 k 个邻居。",
      "得到邻接矩阵 A，加上自环，变成 A 波浪。",
      "再做归一化。",
      "H 一撇，等于激活，乘 D 负二分之一。",
      "再乘 A 波浪，再乘 D 负二分之一，乘 H 乘 W。",
      "这一步是消息传递。",
      "图建错了，后面全错。",
      "书在 3.3.6、3.4.3、3.4.4 三节。",
      "表 3.4 在五十五页，三种策略一张表。",
      "独立、完全依赖、部分依赖。",
      "这一集三个模块，就是后两种的三个代表。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "八个通道，两组行业",
    goal: "相关矩阵上的块结构",
    lines: [
      "先看数据本身。",
      "面板 A，八通道，二千六百五十七行。",
      "三只白酒，三只银行，两只宽基指数。",
      "白酒三只，平均相关 0.654。",
      "银行三只，0.659。",
      "两只指数，0.923。",
      "指数跟个股之间，也不低。",
      "因为指数就是这些票加权出来的。",
      "所以相关矩阵上，有两个明显的块。",
      "左上角白酒，中间银行。",
      "右边两格指数，几乎全亮。",
      "把相关按行做 softmax，得到一张注意力图。",
      "行业内平均 0.143。",
      "行业间只有 0.060。",
      "差 2.4 倍。",
      "注意，这张图是解析探针。",
      "不是训练出来的权重。",
      "它只能说明结构存在，不能说明模型学到了。",
      "再看稳定性。",
      "把收益切成前后两半。",
      "各自算一套相关矩阵。",
      "二十八个非对角元素，跨半段相关 0.819。",
      "结构不是某一段的噪声。",
      "最后看混合能量。",
      "同行业的相关之和，占全部的比例。",
      "平均 0.358。",
      "银行三只最高，0.495。",
      "两只指数最低，只有 0.205。",
      "因为指数没有第三个同类伙伴。",
      "这组数说明一件事：",
      "行业是这组数据里最粗的那层结构。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个模块，三套约定",
    goal: "参数量与结构断言",
    lines: [
      "三个模块都在算法库里。",
      "混合、变量注意力、图卷积。",
      "三个都不互相引用。",
      "每个模块自带张量，不共享内部。",
      "先看参数量。",
      "通道混合，N 等于八，一百四十四。",
      "时间混合，T 等于九十六，一万八千六百二十四。",
      "合起来一个块，一千七百八十四。",
      "iTransformer，D 等于三十二，五万三千二百四十八。",
      "这些数都写成了断言。",
      "第一组结构断言是残差。",
      "把混合权重清零，输出必须等于输入。",
      "误差小于十的负十五次方。",
      "第二组是置换等变。",
      "把通道顺序换一下，输出也该跟着换。",
      "这里踩过一个坑。",
      "只换输入，不换权重，等变不成立。",
      "必须同时换 W1 的列、W2 的行。",
      "修正之后，误差小于十的负十二次方。",
      "iTransformer 这边，重点在转置。",
      "先对每行做层归一化，再把列当 token。",
      "手写的八乘八注意力，跟模块逐元素一致。",
      "时间顺序打乱，输出必须变。",
      "因为 token 是变量，不是时间步。",
      "图这边，重点是归一化。",
      "两节点、一条边，加上自环。",
      "归一化后每行是 0.5 和 0.5。",
      "输入 h 等于 1，输出精确等于 1。",
      "孤立节点靠自环保恒等。",
      "还有一个实现纪律。",
      "前向路径里不用 unsafeSlice。",
      "上一版用它，直接段错误。",
      "全改成安全切片之后，四十四项一次跑通。",
      "跑一遍只要 0.3 秒。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "四十四项，零失败",
    goal: "从断言到真实读数",
    lines: [
      "证据分五组。",
      "数据七项，混合九项。",
      "iTransformer 九项。",
      "图八项，真实读数十一项。",
      "合计四十四项，全部通过。",
      "先证明输入没被换过。",
      "面板 A 的 sha256，跟 manifest 对上。",
      "二千六百五十七行，八列。",
      "面板 B 二百四十行，二十列。",
      "起止日期也逐字对上。",
      "再看混合模块的三条。",
      "清零后恒等，误差十的负十六次方。",
      "线性情形，跟右乘矩阵一致。",
      "置换等变，十的负十三次方。",
      "iTransformer 这边，四条。",
      "手写注意力对模块，十的负十三次方。",
      "每行和为 1。",
      "变量置换等变。",
      "时间打乱后，输出差 3.8。",
      "图这边，五条。",
      "两节点金例，精确到 1。",
      "三节点、一条边，度数和等于 5。",
      "合成四块，1-NN 图恰好四个分量。",
      "然后是真实图。",
      "八通道，最近邻取 1。",
      "恰好三个连通分量。",
      "跟白酒、银行、指数，逐一对应。",
      "这是本集最强的一条读数。",
      "二十只票，最近邻取 2。",
      "三个分量，二十九条边。",
      "边纯度 0.862，调整兰德指数 0.519。",
      "换成 3 个邻居，只剩两个分量。",
      "调整兰德指数掉到 0.296。",
      "所以证据固定 k 等于 2。",
      "换数据集，k 要重选。",
      "这就是四十四项里的关键几条。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "五条必须说的话",
    goal: "不假装完成",
    lines: [
      "第一条，注意力是解析探针。",
      "相关矩阵做 softmax，不是训练出来的。",
      "它证明结构存在，不证明模型可用。",
      "第二条，图是静态相关图。",
      "书里 3.4.3 还讲了动态图和时变图。",
      "这一集没有实现。",
      "第三条，没有端到端训练。",
      "验证的是实现，不是预测精度。",
      "八通道的误差，不等于模型能力。",
      "第四条，k 是选过的。",
      "k 等于 2 是看了结果之后定的。",
      "这不是作弊，但必须报出来。",
      "换市场，换行业，k 要重选。",
      "第五条，数据有缺口。",
      "面板 A 最大缺口十七天。",
      "二〇一八年春节附近。",
      "面板 B 最大缺口九天。",
      "窗口按行连续切，不剔除缺口。",
      "所以读数是近似。",
      "还有两项欠账。",
      "算法卡还欠着。",
      "演示命令行也还欠着。",
      "这两项留到统一补。",
      "这些都不是 bug。",
      "是口径必须一起报的东西。",
      "账都记在证据里，不藏着。",
      "所以这一集仍算 ready。",
      "ready 说的是内容可交付。",
      "不是整个项目没有缺口。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "一条轴，两张图，三个数",
    lines: [
      "第一句，通道轴更便宜。",
      "六十四格对九千二百一十六格。",
      "第二句，通道关系能测。",
      "行业内外差 1.6 倍，面板 B 差 2.6 倍。",
      "图能把这层结构，还原成三个分量。",
      "第三句，图是建模选择，不是事实。",
      "k 变了，分块就变。",
      "下一集，递归与分段。",
      "RNN 的两条生成路。",
      "这一集的证词是：",
      "结构能测，不等于模型能赢。",
      "第 24 集完。",
    ],
  },
];

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
export const TOTAL_SEC = round2(SCENES.reduce((a, s) => a + s.dur, 0));
export const TOTAL = Math.round(TOTAL_SEC * FPS);

export const STARTS = SCENES.map((s) => s.start);
export const CAPTIONS = LINES.map((l) => ({ start: l.start, dur: l.dur, text: l.speech }));

export const linesOf = (id: string) => LINES.filter((l) => l.scene === id);
export const sceneOf = (id: string) => SCENES.find((s) => s.id === id)!;
export const within = (id: string, k: number) => {
  const s = sceneOf(id);
  return s.start + s.dur * k;
};

export const frameOf = (sec: number) => Math.round(sec * FPS);
