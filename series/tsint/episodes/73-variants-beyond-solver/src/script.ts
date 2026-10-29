/**
 * 《不求解器也能算》—— 第 9 章 · CfC 的闭式解与灰色 GM-ODE。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json 里的实测
 * 语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 *
 * 本集没有书页图版：p.219 只有两段机制描述，没有图。原文以短摘录卡片出现，
 * 页码与 CC BY-NC-ND 4.0 标注由 shared.tsx 的 Quote 统一加。
 */
import voiceJson from "../../data/tsint-73-variants-beyond-solver/voice.json";

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
    kicker: "第 9 章 / 神经微分方程",
    title: "不求解器也能算",
    goal: "两条去掉求解器的路，和一条其实没去掉的路",
    lines: [
      "这一集讲两个变体。",
      "它们都出现在书的第 9 章，219 页。",
      "一个叫 CfC，闭式连续时间网络。",
      "一个叫 GM-ODE，灰色神经微分方程。",
      "书里给的说法很诱人。",
      "CfC 比传统方法快一百到十万倍。",
      "GM-ODE 的测试集 MAPE 不到百分之一。",
      "但书里只有两段机制描述。",
      "没有数据，没有代码，没有复现协议。",
      "所以这两个数字只能标 C 级。",
      "这一集不复述结论，只拆机制。",
      "拆完你会发现，两条路并不一样。",
      "一条真的去掉了求解器。",
      "另一条，求解器还在。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 求解器的账",
    title: "到底去掉了什么",
    goal: "八百次函数求值，和一次指数运算",
    lines: [
      "先把求解器的账算清楚。",
      "RK4 走一步，要算四次右端项。",
      "两百步，就是八百次函数求值。",
      "每次求值都要访问一遍网络。",
      "这是训练和推理共同的开销。",
      "CfC 的想法是：对常数输入，这条 ODE 有闭式解。",
      "既然有闭式解，为什么还要一步一步积。",
      "一次指数运算，就能得到任意时刻的状态。",
      "于是求解器被整个拿掉。",
      "GM-ODE 的出发点不同。",
      "它关心的不是求解器太慢。",
      "它关心的是小样本下，右端项学不准。",
      "灰色理论给了一个白化方程。",
      "右端项从黑箱网络，换成带结构的线性项。",
      "但方程本身仍然要积分。",
      "论文里用的是四阶龙格库塔。",
      "所以 GM-ODE 没有去掉求解器。",
      "它去掉的是黑箱右端项。",
      "把这两件事混为一谈，这一集就白做了。",
      "下面把两条路分别拆开。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "02 / 闭式解与灰色白化",
    title: "两条方程，两种闭式",
    goal: "CfC 的指数解，GM(1,1) 的累加与最小二乘",
    lines: [
      "先看 CfC 的标量版本。",
      "这是它的微分方程。",
      "左边是变化率，右边是负 f 乘 x 减 A。",
      "这里用标量版本，w_tau 已经并进 f。",
      "A 是候选状态。",
      "对常数输入，这是一个一阶线性方程。",
      "解是指数衰减，加上一个常数偏移。",
      "x(t) 等于 A，加上 x0 减 A，乘 e 的负 f t 次方。",
      "初值在 x0，时间大了收敛到 A。",
      "网络不需要积分，只要学 f 和 A。",
      "但完整的 CfC 还有两个候选状态。",
      "一个叫 g，一个叫 h。",
      "它用 Sigmoid 门在两个候选之间插值。",
      "门控曲线和指数解不是同一条曲线。",
      "但它同样只需要一次 exp。",
      "这就是闭式解近似。",
      "它把 ODE 的时间演化，压成一次前向。",
      "代价是，它不保证逐点等于原方程的解。",
      "再看 GM-ODE 的灰色部分。",
      "第一步是累加生成，AGO。",
      "把原始序列逐项累加，得到一条单调上升的序列。",
      "一阶差分就是逆运算，IAGO。",
      "GM(1,1) 在白化方程里假设，累加序列满足 dz/dt 加 a z 等于 b。",
      "把离散观测代进去，得到一组线性方程。",
      "两个未知数，a 和 b。",
      "用最小二乘一次解出来。",
      "这是闭式拟合，不需要训练。",
      "然后解白化方程，得到累加层的预测。",
      "再做一次 IAGO，回到原始尺度。",
      "预测公式是一个指数。",
      "所以 GM(1,1) 的骨架，是指数加最小二乘。",
      "GM-ODE 把它嵌进神经微分方程，右端项仍然交给 RK4。",
      "这就是两条路的第一个区别。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "03 / 一次前向与八百次求值",
    title: "形状对了就够了",
    goal: "指数近似、累加阶梯，以及可比的只有计算量",
    lines: [
      "先看 CfC 的两条曲线。",
      "紫线是标量方程的闭式解。",
      "x0 等于一，A 等于零，f 等于二。",
      "它从一出发，指数衰减到零。",
      "黄线是门控混合。",
      "g 等于零点二，h 等于零点八。",
      "t 等于零时，门停在两条候选的中点。",
      "时间变大，它收敛到 h。",
      "两条线不是逐点对照。",
      "它们回答的是两个不同的问题。",
      "紫线问：给定初值，解长什么样。",
      "黄线问：门如何在两个候选之间移动。",
      "共同点是，都只要一次 exp。",
      "都不需要八百次 RK4。",
      "再看 GM-ODE 的累加层。",
      "原始序列在下降。",
      "累加之后，变成一条上升的阶梯。",
      "白化方程拟合的是这条阶梯。",
      "拟合完，再差分回原始尺度。",
      "所以屏幕上会有两条曲线。",
      "一条是原始观测，一条是还原后的预测。",
      "它们不重合，因为模型只有一个指数。",
      "但这一个指数，已经把趋势抓住了。",
      "最后再看一眼计算量。",
      "闭式解一次求值，RK4 两百步八百次。",
      "这是这一集唯一可以直接比较的倍数。",
      "书里说的一百到十万倍，不是这个数。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "04 / 两个 Haskell 模块",
    title: "把两条方程写成可测试的代码",
    goal: "softplus、闭式解、正规方程，以及模块隔离",
    lines: [
      "实现放在两个 Haskell 模块里。",
      "CfC 模块只有六个函数。",
      "稳定 softplus、朴素 softplus、log-sum-exp。",
      "闭式解、门控混合、轨迹生成。",
      "先看 softplus。",
      "x 大于零时，把 e 的 x 次方提出来。",
      "写成 x 加 log 一加 e 的负 x 次方。",
      "这样 x 再大，也不会先溢出。",
      "朴素版直接算 log 一加 e 的 x 次方。",
      "x 等于一千时，结果就是无穷。",
      "这不是数学错，是浮点数的边界。",
      "log-sum-exp 用同样的技巧。",
      "先减最大值，再取指数，最后加回去。",
      "GM-ODE 模块自带 RK4 的一步。",
      "这是仓库规则：算法模块之间不互相 import。",
      "重复十几行，换每个模块可以单独验证。",
      "gm11Fit 解一个二乘二的正规方程。",
      "ago 和 iago 都是一行扫描。",
      "gmOdeIntegrate 仍然调用 RK4。",
      "这一点，代码里看得最清楚。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "05 / 四组数字",
    title: "每个数字都能回到一次运行",
    goal: "AGO、拟合、白化方程、softplus 溢出",
    lines: [
      "第一组：AGO 和 IAGO。",
      "输入序列是一二三四。",
      "累加得到一、三、六、十。",
      "差分回到一二三四。",
      "逐位相等，没有误差。",
      "第二组：GM(1,1) 的拟合。",
      "二十四个点，公比零点九七。",
      "拟合出 a 等于零点零三零四五七。",
      "b 等于十二点一八二七。",
      "这两个数和手算的离散公式对得上。",
      "还原到原始尺度，MAPE 是零点零零四八一四。",
      "也就是百分之零点四八。",
      "不是书里的零点八二，也不是一点一三。",
      "因为数据是合成的，任务也不同。",
      "第三组：白化方程的解。",
      "RK4 步长零点零一，走两千四百步。",
      "整数点和闭式解的最大误差，二点五六乘十的负十三次方。",
      "这说明 RK4 和闭式解在同一个方程上对上了。",
      "第四组：softplus 的溢出。",
      "朴素版在 x 等于一千时返回无穷。",
      "稳定版返回一千。",
      "log-sum-exp 在两个一千上返回一千点六九三。",
      "这就是数值稳定的全部意义。",
      "测试一共一百零八条。",
      "前面七十三条是前几集留下的。",
      "这一集新增十七条 CfC，十八条 GM-ODE。",
      "一百零八条全部通过。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "06 / 什么时候不能信",
    title: "两个数字，五条边界",
    goal: "C 级声明、标量近似、线性假设、小样本、求解器仍在",
    lines: [
      "最后说几条使用边界。",
      "第一，书里的两个性能数字，都只能标 C。",
      "CfC 的一百到十万倍，没有说基线、数据和硬件。",
      "GM-ODE 的 MAPE，没有说划分和预处理。",
      "我们能复现的是机制，不是这两个数。",
      "第二，这里只验证了标量版本。",
      "完整网络还有门控、归一化和多层耦合。",
      "一层对上，不等于整个模型没有误差。",
      "第三，GM(1,1) 的白化方程是线性的。",
      "真实序列有季节、有拐点、有冲击。",
      "一个指数抓不住这些。",
      "第四，MAPE 在小样本上很不稳定。",
      "接近零的观测会把百分比放大。",
      "所以零点八二和一点一三，不能直接搬到别的任务。",
      "第五，GM-ODE 仍然要积分。",
      "它的计算瓶颈没有被闭式解消掉。",
      "它换来的是小样本下的结构先验。",
      "这两笔账，要分开算。",
    ],
  },
  {
    id: "outro",
    chapter: "收束",
    kicker: "07 / 一句话",
    title: "一个省求值，一个省样本。",
    goal: "把两条路收成一句话，然后交给下一集",
    lines: [
      "如果只记一句话。",
      "CfC 用闭式解换掉求解器。",
      "GM-ODE 用灰色结构换掉黑箱右端项。",
      "一个省的是函数求值。",
      "一个省的是样本。",
      "两个都值得学，但不是同一个技巧。",
      "代码、证据和全部数字，都在 ts-base 仓库。",
      "下一集，把保真度写进损失函数。",
      "总变差和动态时间规整，接着讲。",
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
