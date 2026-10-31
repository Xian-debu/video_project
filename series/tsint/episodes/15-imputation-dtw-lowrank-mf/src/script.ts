/**
 * 《缺失值三法：邻域、低秩、因子》—— 第 2 章 · 数据层。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-15-imputation-dtw-lowrank-mf/voice.json";

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
    kicker: "第 2 章 / 数据层",
    title: "缺失值补全三法",
    goal: "邻域、低秩、因子，三种相信",
    lines: [
      "第 2 章 · 数据层，第十五集。",
      "缺失值补全三法。",
      "一列数据缺了几格，怎么补。",
      "书里在同一节给了三个方向。",
      "最近邻、低秩、矩阵分解。",
      "三个方向，三种相信。",
      "第一个相信，相似的序列同一时刻也相似。",
      "第二个相信，整张面板落在低维子空间里。",
      "第三个把同一件事写成两个因子。",
      "这一集把它们放在同一张面板上比。",
      "一百只票，两百五十个交易日。",
      "随机挖掉五千格。",
      "再按整段停牌挖掉五千格。",
      "两种挖法，各跑一次。",
      "先说结论。",
      "随机缺失，最近邻赢，低秩不如列均值。",
      "整段停牌，低秩的误差数字看着还行。",
      "但它补出来的是零。",
      "相关系数是零。",
      "这一集钉四个数。",
      "第一个，零点零一九三对零点零二六一。",
      "随机缺失上，最近邻和低秩的误差。",
      "第二个，零对零点三二九。",
      "整列全缺时，和真实值的相关系数。",
      "第三个，四点九乘十的负九。",
      "合成秩三矩阵，低秩补全的误差。",
      "第四个，四成一。",
      "真实面板，前五个奇异值只占这么多方差。",
      "数字先摆上。",
      "机制、理由、边界，一层一层来。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "缺法有两种，性质完全不同",
    goal: "随机挖格子，还是整列消失",
    lines: [
      "先说问题。",
      "面板是时刻乘变量的一张表。",
      "一百只股票，两百五十天。",
      "大部分格子有数。",
      "少数格子是空的。",
      "空有两种来源。",
      "第一种，随机漏掉。",
      "数据商漏传，字段偶尔为空。",
      "这种空和值本身没有关系。",
      "第二种，整段没有。",
      "股票停牌，一整只票几十天没有一行。",
      "这种空和值有关系。",
      "停牌的公司，往往正是出事的那批。",
      "两种空，性质完全不同。",
      "随机缺失，把格子挖成散点。",
      "每一列都还剩很多观测。",
      "整段缺失，挖掉的是一整列。",
      "这一列一个观测都不剩。",
      "接下来是最关键的一句。",
      "低秩补全的目标函数，只在观测格上算残差。",
      "一列全空的列，目标函数里没有它。",
      "它没有约束，只能被压成零。",
      "这不是实现 bug，是模型性质。",
      "记住这一条，后面全部对得上。",
      "书里给了什么。",
      "第十六到十八页，一句话列举了 KNN 和 DTW。",
      "第二十六页，式二点四零给了矩阵分解。",
      "没有距离公式，没有邻居权重，没有超参。",
      "没有目标函数，没有迭代式，没有秩的取法。",
      "这些空白，是这一集要自己填的。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三个先验，三套写法",
    goal: "距离、秩、两个因子",
    lines: [
      "先定义距离。",
      "两个序列，长度可以不同。",
      "DTW 允许时间轴伸缩。",
      "每个点只做三件事。",
      "两边各走一步，或者只走一边。",
      "每一步的代价，是两点的绝对差。",
      "整条路径的代价加起来，取最小。",
      "小例子。",
      "第一个序列一二三，第二个一三。",
      "一配一，二配三，三配三。",
      "代价是零加一加零。",
      "距离等于一。",
      "逐点对齐要四，DTW 只要一。",
      "再说一个性质。",
      "DTW 不满足三角不等式。",
      "距离四，可以大于一加二。",
      "所以不能做三角剪枝。",
      "每个序列对都要算一遍。",
      "代价是序列数的平方乘长度的平方。",
      "接下来是邻居权重。",
      "书里没给，本仓用等权。",
      "距离只用来排序，不参与加权。",
      "五个邻居，各占五分之一。",
      "再看低秩。",
      "目标只有一句话。",
      "只在观测到的格子上，让重建贴近原值。",
      "重建矩阵的秩不超过 k。",
      "解法是交替投影。",
      "观测格永远保留原值。",
      "缺失格填重建值。",
      "反复投影到秩 k 子空间。",
      "最后是矩阵分解。",
      "书里写，X 约等于 F 乘 X hat。",
      "F 是 k 乘 N，X hat 是 T 乘 k。",
      "这两个矩阵乘不起来。",
      "只有 k 等于 T 才能乘。",
      "这是勘误 E29。",
      "本仓按 X hat 乘 F 实现。",
      "时间那一侧在前，变量那一侧在后。",
      "只改乘法顺序，不改两个因子的含义。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "整列消失，低秩就只剩零",
    goal: "没有观测，就没有约束",
    lines: [
      "先看一个玩具。",
      "三乘三的表，缺一个格。",
      "左边两列能同时看到。",
      "可以用最近邻补。",
      "也可以用低秩补。",
      "再看真实面板。",
      "这张热图是四十天乘三十只票。",
      "颜色是收益的标准化值。",
      "暗的那几列，是整段缺失的十只票。",
      "低秩看这张图，只看到剩下九十列。",
      "那十列对目标函数没有贡献。",
      "于是补出来全是零。",
      "零在图上是一条直线。",
      "参数里这叫退化。",
      "回到真实数字。",
      "停牌的公司是不是更可能暴跌。",
      "是。",
      "截面最负的二十天，平均跌百分之二点零六。",
      "这二十天里，最近邻的误差是零点零二一八。",
      "低秩的误差是零点零二六九。",
      "正好等于真实值的均方根。",
      "因为低秩预测了零。",
      "最近邻低百分之十九。",
      "为什么最近邻能行。",
      "停牌的那只票自己没有序列。",
      "但同行业的票在同一时刻在跌。",
      "跨序列、同一时刻取值。",
      "这就是最近邻的假设。",
      "再用谱看一眼整张面板。",
      "前五个奇异值，只占四成一。",
      "前十个，五成四。",
      "真正的秩五矩阵，前五个应该接近百分之百。",
      "所以这张真实面板不低秩。",
      "所以低秩在这张表上本来就不该赢。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个模块，四十七条断言",
    goal: "退化行为要显式保留",
    lines: [
      "三个模块，都在 Ch02。",
      "DtwKnn，LowRank。",
      "还有 MatrixFactorization。",
      "先说最近邻。",
      "输入是带空格的矩阵。",
      "输出是补全后的矩阵，加一个已知位掩码。",
      "五个邻居，带宽取长度的十分之一。",
      "整列全缺时，那一列没有自己的序列。",
      "本仓的做法是，按同一时刻其余有观测的列。",
      "等权平均。",
      "这是明确的选择，不是默认。",
      "再说低秩。",
      "硬截断版，迭代三百次，容差十的负十次方。",
      "初值把缺失格填成该列的观测均值。",
      "填零会让迭代从很远的地方出发。",
      "这一点实测过，差两个数量级。",
      "整列全缺，本仓不返回错误。",
      "而是显式保留补成零的行为。",
      "因为这一集要拿它和最近邻对照。",
      "最后是矩阵分解。",
      "交替最小二乘。",
      "固定一个因子，解另一个。",
      "每一步都是带岭项的正规方程。",
      "因子不唯一，所以测试只比重建矩阵。",
      "还钉了一条，F 乘二、X hat 除二，重建逐位相等。",
      "三个模块，四十七条断言。",
      "全仓五十九组，八百八十条。",
      "都绿。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "二十四个检查，零失败",
    goal: "四层：真值、随机、块状、暴跌",
    lines: [
      "验证分四层。",
      "第一层，真值。",
      "合成秩三矩阵，四十乘三十，挖掉百分之二十。",
      "低秩补全误差，四点九乘十的负九。",
      "同一次缺失，最近邻的误差是一点一七八。",
      "差了八个数量级。",
      "合成秩二矩阵，三十乘二十，挖掉七分之一。",
      "低秩误差六点五乘十的负十。",
      "这两条说明，低秩在它自己的主场上是对的。",
      "第二层，随机掩码。",
      "五千格，百分之二十。",
      "列均值零点零二一三。",
      "最近邻零点零一九三。",
      "低秩零点零二六一。",
      "矩阵分解零点零三一二。",
      "低秩比列均值还差。",
      "原因就是上一段说的，真实收益不低秩。",
      "第三层，块状掩码。",
      "十列整段挖掉，其余随机。",
      "列均值零点零一九七。",
      "最近邻零点零一八六。",
      "低秩零点零二三四。",
      "矩阵分解零点零二三八。",
      "只看这十列，数字变得很奇怪。",
      "低秩零点零一七六四，最近邻零点零一七八零。",
      "低秩好像还赢一点点。",
      "但相关系数是零对零点三二九。",
      "低秩补出来的是零。",
      "零的均方误差，等于真值的均方根。",
      "这个数字好看，是因为停牌公司的波动和全市场同量级。",
      "所以别只看均方误差。",
      "第四层，暴跌窗口。",
      "二十天，平均跌百分之二点零六。",
      "最近邻零点零二一八。",
      "低秩和矩阵分解都是零点零二六九。",
      "前一集说注意力机制存在，但真实数据没有那个问题。",
      "这一集正好反过来。",
      "问题真实存在，低秩就是用不上。",
      "最后，二十四个检查，零失败。",
      "五个数据，六个结构，十三个行为。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "这一集没做的事",
    goal: "没做的，画面标出来",
    lines: [
      "这一集没做六件事。",
      "第一，没有换更大的面板。",
      "一百只票，一年，够说明机制。",
      "不够代表全市场。",
      "第二，没有做下游。",
      "我们只比补全误差。",
      "没有拿补全后的矩阵去训练预测模型。",
      "补得准不等于预测准。",
      "第三，没有调超参。",
      "邻居数、带宽、秩、岭项，都是固定的小值。",
      "调参会改变排序，这一点必须说清楚。",
      "第四，整段缺失的退化。",
      "低秩补出零，是模型的必然。",
      "不是我们没实现。",
      "第五，DTW 不是距离。",
      "它不满足三角不等式，没有度量结构。",
      "所以最近邻是暴力两两算。",
      "第六，书里没给的，都是本仓补的。",
      "距离公式、邻居权重、目标函数、迭代式、超参。",
      "全部登记在自授 A32。",
      "式二点四零的维度，登记在勘误 E29。",
      "口径冻结。",
      "后续集不能悄悄改。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "一句话，四个数",
    goal: "下一集：相关性与 STL 分解",
    lines: [
      "一句话。",
      "缺失值的补法，取决于缺失的样子。",
      "随机缺失，看邻居。",
      "整段缺失，邻居是唯一有信号的。",
      "四个数回扣。",
      "零点零一九三对零点零二六一。",
      "零对零点三二九。",
      "四点九乘十的负九。",
      "四成一。",
      "下一集，相关性与 STL 分解。",
      "从补格子，转到拆结构。",
      "这一集就到这里。",
      "下一集，再见。",
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

const SCENES: Scene[] = [];
const LINES: Line[] = [];

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
export const frameOf = (id: string, k: number) => Math.round(within(id, k) * FPS);

export { SCENES, LINES };
