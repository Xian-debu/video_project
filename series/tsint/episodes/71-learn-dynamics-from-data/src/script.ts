/**
 * 《把 k 换成一张表》—— 第 9 章 · 参数辨识与神经微分方程前向。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json 里的实测
 * 语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 *
 * 原文图版：data/source-figures.json 里的三张书页裁图（p.214 式 9.14–9.15、p.215 式 9.18、
 * p.217 式 9.21–9.22），它们的 id 必须出现在本文件里：content 的 plates 门禁与 engine 的
 * film_coverage 都读这里。
 */
import voiceJson from "../../data/tsint-71-learn-dynamics-from-data/voice.json";

export const FPS = 30;

/** 原文图版（顺序即入片顺序）。 */
export const PLATES = {
  compound: "plates/eq-compound",
  neuralode: "plates/eq-neuralode",
  odesolve: "plates/eq-odesolve",
} as const;

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
    kicker: "第 9 章 / 神经微分方程",
    title: "一条曲线，一个常数",
    goal: "先看拟合，再看它为什么不够",
    lines: [
      "这一集从一条两百天的股票走势开始。",
      "二零零六年十一月，到二零零七年十月。",
      "把收盘价除以第一天的值。",
      "得到一条几乎单边的曲线。",
      "用一个常数增长率去拟合它。",
      "屏幕上的 R²，是这个数。",
      "增长率 k，也只有一个数。",
      "两百个观测，两个参数。",
      "拟合得很紧，紧到像一条动力学定律。",
      "但这只是把一条曲线按住。",
      "如果 k 每天都在变呢。",
      "这一集，把 k 换成一张表。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 采样与动力学",
    title: "拟合不是解释",
    goal: "为什么真实序列需要一个能随时间变的右端项",
    lines: [
      "真实系统里，增长率不是常数。",
      "宏观环境、公司盈利、市场情绪，都在换。",
      "更麻烦的是采样。",
      "交易日不连续，周末和停牌都在里面。",
      "固定步长的离散模型，得先把这些洞补上。",
      "微分方程不要求等间隔。",
      "任意时刻都能问，积分器走到哪算到哪。",
      "这是它的原生优势，也是这一集的动机。",
      "把右端项换成网络以后，有三个问题。",
      "第一步，k 怎么估。",
      "f 怎么参数化。",
      "训练怎么穿过求解器。",
      "先看最简单的一步：一个常数。",
      "再看不那么简单的：一个三百多参数的网络。",
      "两者用同一个损失、同一个前向。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "02 / 闭式解与可学习函数",
    title: "一行闭式解，一个可学习函数",
    goal: "从式 9.14 走到式 9.22，把每个符号落到代码",
    lines: [
      "先把连续模型写下来。",
      "状态的变化率，等于 k 乘状态。",
      "这是书里式 9.14。",
      "它的解是初始值乘指数，式 9.15。",
      "给定初值，整条轨迹就定了。",
      "现在只有离散观测，怎么估 k。",
      "把两边同时取对数。",
      "指数曲线就变成一条直线。",
      "直线的斜率，就是 k。",
      "最小二乘有闭式解。",
      "分母是时间的中心化方差。",
      "分子是时间与对数观测的协方差。",
      "一行公式，不需要迭代。",
      "神经微分方程把 k 换成一个函数。",
      "书里式 9.18，右端是 fθ(x,t)。",
      "θ 是网络权重，x 和 t 是输入。",
      "给定初值和目标时刻，求解器输出估计。",
      "这写成式 9.21。",
      "损失还是均方误差，式 9.22。",
      "网络两层 tanh，宽度十六。",
      "输入两维：状态和归一化时间。",
      "输出一维变化率，参数一共三百三十七个。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "03 / 对数、宽度与差分",
    title: "从两个参数到三百三十七个",
    goal: "解释闭式解、网络结构和训练成本为什么长这样",
    lines: [
      "为什么闭式解能一行算出来。",
      "因为对数把乘法变成加法。",
      "指数曲线在 log 坐标里是直线。",
      "直线的斜率，就是增长率。",
      "股票这条，取对数后仍有波动。",
      "R² 只衡量直线贴得多紧。",
      "它不证明背后真是指数动力学。",
      "这是第一层要记住的边界。",
      "网络的思路完全不同。",
      "它不假设函数形状。",
      "只假设变化率能由状态和时间算出来。",
      "两层十六，中间用 tanh。",
      "为什么要加时间。",
      "自治函数无法表达显式的时间依赖。",
      "加了 t，才能拟合像正弦这样的轨迹。",
      "t 必须先归一化。",
      "否则输入尺度差太多，梯度会乱。",
      "训练用中心差分。",
      "三百三十七个参数，每个扰动两次。",
      "一个 epoch 要六百七十四次前向。",
      "窗口只有四步，每步最多走四分之一。",
      "损失只在窗口内计算。",
      "所以训练误差可以很小。",
      "也正是整段积分会漂移的原因。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "04 / 两个模块",
    title: "把训练写成可测试的 Haskell",
    goal: "看闭式解、网络前向、有限差分和测试怎么落地",
    lines: [
      "实现分两个模块。",
      "ParamFit 负责常数拟合。",
      "NeuralODE 负责网络前向和训练。",
      "fitK 是闭式解。",
      "输入时间和观测两列，输出 k。",
      "观测太少，或者时间全一样，直接报错。",
      "fitKGradient 用梯度下降做对照。",
      "损失是原始空间的均方误差。",
      "梯度可以手推，也可以用差分。",
      "两条路给出同一个答案，才能互相当裁判。",
      "NeuralODE 里，MLP 就是一串 Double。",
      "参数拍平成一个向量，方便有限差分。",
      "forwardMLP 做两层矩阵乘加 tanh。",
      "integrateRHS 用 RK4 走一小段。",
      "forward 把一个窗口积出来。",
      "lossMSE 把预测和观测相减。",
      "trainFiniteDiff 是外层循环。",
      "每个参数正负各扰动一次，算中心差分。",
      "Haskell 是惰性的，训练必须强制求值。",
      "不加 evaluate，计时会得到零。",
      "测试一共五十条，边界也在里面。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "05 / 五组证据",
    title: "每个数字都能回到一次运行",
    goal: "合成拟合、股票拟合、两条轨迹、训练成本，逐项对照",
    lines: [
      "第一组：合成数据。",
      "真值 k 是零点一。",
      "观测上加了百分之二的噪声。",
      "闭式解给出屏幕上这个数。",
      "梯度版给出这个数。",
      "两个都贴着真值。",
      "第二组：真实股票。",
      "同一条 2006 到 2007 的走势。",
      "拟出 k 等于这个数。",
      "R² 等于这个数。",
      "这是归一化时间上的增长率。",
      "不是年化收益率，别混。",
      "第三组：正弦轨迹。",
      "网络有三百三十七个参数。",
      "训练窗口内的 MSE 是这个数。",
      "这个数看起来很小。",
      "但整段积分，RMSE 是这个数。",
      "二十五步 rollout 是这个数。",
      "误差在累积，不在窗口里。",
      "第四组：股票轨迹。",
      "窗口 MSE 是这个数。",
      "五十步 rollout 是这个数。",
      "整段 RMSE 是这个数。",
      "末段预测已经明显偏离。",
      "第五组：训练成本。",
      "两段训练一共这个秒数。",
      "每个 epoch 六百七十四次前向。",
      "所有数字都写进证据 JSON。",
      "提交号、命令、校验和都在。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "06 / 什么时候不能信",
    title: "窗口内很好，窗口外呢",
    goal: "说清局部拟合、有限差分、采样和外推的失效条件",
    lines: [
      "现在说这一集的边界。",
      "第一类：局部拟合不等于长程预测。",
      "训练只约束窗口内的四步。",
      "窗口外没有数据，误差会累积。",
      "正弦的整段 RMSE 是 0.75。",
      "股票的末段也偏了。",
      "这不是训练失败，是目标函数没管那么远。",
      "第二类：有限差分。",
      "三百三十七个参数，每个两次前向。",
      "参数再多一个量级，成本就不可接受。",
      "而且差分有截断误差和舍入误差。",
      "步长太大不准，太小相减相消。",
      "第三类：采样不规则。",
      "ODE 能接受任意时刻。",
      "但训练窗口要自己切。",
      "停牌、节假日、缺失值，都会改变窗口。",
      "第四类边界：外推。",
      "网络只在数据覆盖的区域里可信。",
      "走出分布，它没有物理约束。",
      "所以下一集，手写反向传播。",
      "让梯度穿过求解器，而不是扰动参数。",
    ],
  },
  {
    id: "outro",
    chapter: "收束",
    kicker: "07 / 下一集",
    title: "把常数换成函数",
    goal: "收束结论，交接到反向传播",
    lines: [
      "这一集做了三件事。",
      "把一个常数拟合写成闭式解。",
      "把 k 换成一个三百多参数的网络。",
      "用同一个 RK4 前向和 MSE 训练它。",
      "如果只记一句话。",
      "把常数换成函数，ODE 就变成可训练模型。",
      "代码、证据和全部数字，都在 ts-base 仓库。",
      "下一集，梯度怎么穿过求解器。",
    ],
  },
];

/** 讲稿节奏：中文 4.5 字/秒，句间 0.55 s，场首 1.2 s，场尾 2.2 s。 */
const CPS = 4.5;
const GAP = 0.55;
const LEAD = 1.2;
const TAIL = 2.2;
const MAX_CHARS = 44;

const MEASURED = voiceJson as Record<string, number>;
const LINE_PAD = 0.35;
const MIN_LINE = 1.4;

const round2 = (v: number) => Math.round(v * 100) / 100;

type Scene = SceneSpec & { dur: number; start: number; chapterIndex: number };
type Line = { start: number; dur: number; speech: string; scene: string; index: number };

const problems: string[] = [];

const built: { scenes: Scene[]; lines: Line[] } = (() => {
  const scenes: Scene[] = [];
  const lines: Line[] = [];
  let cursor = 0;
  SPEC.forEach((s, i) => {
    s.lines.forEach((text, k) => {
      if (text.length > MAX_CHARS) problems.push(s.id + "[" + k + "] " + text.length + " chars: " + text);
      if (text.length < 8) problems.push(s.id + "[" + k + "] too short: " + text);
      const said = MEASURED[s.id + "#" + k];
      if (said) {
        const cps = text.length / said;
        if (cps < 3.4 || cps > 9.2) problems.push(s.id + "[" + k + "] measured " + cps.toFixed(2) + " chars/s: " + text);
      }
    });
    const durs = s.lines.map((t, k) => {
      const said = MEASURED[s.id + "#" + k];
      return Math.max(MIN_LINE, (said ?? t.length / CPS) + LINE_PAD);
    });
    const speech = durs.reduce((a, b) => a + b, 0) + GAP * Math.max(0, s.lines.length - 1);
    const dur = round2(LEAD + speech + TAIL);
    const start = round2(cursor);
    scenes.push({ ...s, dur, start, chapterIndex: i + 1 });
    let t = start + LEAD;
    s.lines.forEach((text, k) => {
      lines.push({ start: round2(t), dur: round2(durs[k]), speech: text, scene: s.id, index: k });
      t += durs[k] + GAP;
    });
    cursor += dur;
  });
  return { scenes, lines };
})();

export const SCENES = built.scenes;
export const LINES = built.lines;
export const SCRIPT_PROBLEMS = problems;
export const TOTAL_SEC = round2(SCENES.reduce((a, s) => a + s.dur, 0));
export const TOTAL = Math.round(TOTAL_SEC * FPS);

export const STARTS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const s of SCENES) o[s.id] = Math.round(s.start * FPS);
  return o;
})();

export const CAPTIONS = LINES.map((l) => ({ from: l.start, to: l.start + l.dur, text: l.speech }));

export const linesOf = (id: string) => LINES.filter((l) => l.scene === id);
export const sceneOf = (id: string) => SCENES.find((s) => s.id === id)!;
export const within = (id: string, k: number) => {
  const ls = linesOf(id);
  const l = ls[Math.min(ls.length - 1, Math.max(0, k))];
  return l.start - sceneOf(id).start;
};
export const frameOf = (id: string, k: number) => Math.round(within(id, k) * FPS);
