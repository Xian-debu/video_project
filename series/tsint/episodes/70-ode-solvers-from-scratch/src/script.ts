/**
 * 《欧拉法把弹簧算成了永动机》—— 第 9 章 · 常微分方程的数值解。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json 里的实测
 * 语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 *
 * 原文图版：data/source-figures.json 里的三张书页裁图（p.213 式 9.11–9.13，p.214 式 9.16–9.17），
 * 它们的 id 必须出现在本文件里：content 的 plates 门禁与 engine 的 film_coverage 都读这里。
 */
import voiceJson from "../../data/tsint-70-ode-solvers-from-scratch/voice.json";

export const FPS = 30;

/** 原文图版（顺序即入片顺序）。 */
export const PLATES = {
  euler: "plates/eq-euler",
  rk4: "plates/eq-rk4",
  spring: "plates/eq-spring",
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
    kicker: "第 9 章 / 常微分方程",
    title: "一条本该闭合的轨迹",
    goal: "先看现象：同一张网格，两个求解器走向相反",
    lines: [
      "先看一条完全确定的轨迹。",
      "一根弹簧，初始位移是一，速度是零。",
      "没有摩擦，也没有外力。",
      "所以振子的能量应该守恒。",
      "精确解是一条闭合曲线：转一圈，回到原处。",
      "现在用最简单的数值方法走一遍。",
      "每一步，点都往外偏一点。",
      "十个周期之后，振幅已经明显偏大。",
      "屏幕上的能量比值，停在这个数。",
      "同一张网格，换四阶龙格库塔。",
      "十个周期之后，它还在原地。",
      "这一集，把这两个结果拆开算给你看。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 只能一步一步推",
    title: "没有解析解的时候",
    goal: "为什么时间序列研究绕不开数值积分",
    lines: [
      "时间序列建模里，微分方程出现得比想象中多。",
      "连续时间的动力学，写成状态对时间的导数。",
      "给定初始状态，解就唯一确定一条轨迹。",
      "这叫初值问题，书里写作式 9.11。",
      "能写出解析解的方程，其实很少。",
      "复利、弹簧，还有少数线性系统，教科书里解过。",
      "真实模型里的右端项，往往是神经网络。",
      "也可能是分段定义的规则，或者一张查表。",
      "没有公式可套，只能一步一步往前推。",
      "推法不同，结果可能差得很远。",
      "这一集只问三个问题。",
      "单步公式怎么写，误差多大，什么时候会失效。",
      "先看书中给的两个方法。",
      "欧拉法用当前斜率走直线。",
      "龙格库塔一步采四个斜率，再加权平均。",
      "接下来把它们写成 Haskell，用同一组数据对比。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "02 / 两个单步公式",
    title: "一步到底算了什么",
    goal: "把欧拉、RK4 与弹簧方程写成可计算的式子",
    lines: [
      "先把记号钉死。",
      "状态是向量，时间从起点走到终点，步长固定。",
      "第 n 步的时间，是起点加上 n 个步长。",
      "欧拉法只做一件事：沿当前切线走一步。",
      "公式是下一个状态，等于当前状态加步长乘斜率。",
      "对导数等于自身的方程，从一出发走一步。",
      "得到一点一。",
      "这个数不用积分，手算就能对上。",
      "龙格库塔在同一段里采四个斜率。",
      "第一个在起点，第二第三个在中点，第四个在终点。",
      "然后按一、二、二、一的权重加起来，再除以六。",
      "同一个方程，一步得到屏幕上这个数。",
      "它和真实值只差一点点。",
      "弹簧要写成两个一阶方程。",
      "位移的导数是速度，速度的导数是负的角频率平方乘位移。",
      "角频率等于根号下刚度除以质量，书里式 9.16 和 9.17。",
      "精确解是余弦加正弦，周期是二派除以角频率。",
      "能量等于动能加势能，精确解让它保持不变。",
      "这就是我们的裁判。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "03 / 放大因子",
    title: "误差不是运气，是特征值",
    goal: "从一步的线性映射推出能量为什么单调上涨",
    lines: [
      "欧拉法错在哪，可以从一个二阶矩阵看出来。",
      "把位移和速度写成向量，一步更新就是线性的。",
      "矩阵的左上和右下是一，右上角是步长。",
      "左下角是负的步长乘角频率平方。",
      "它的两个特征值，是一加减虚数单位的步长。",
      "模长的平方，等于一加步长平方。",
      "每走一步，能量就乘上这个因子。",
      "不管步长多小，这个因子都大于一。",
      "所以欧拉法在无阻尼振子上，永远在注入能量。",
      "这不是舍入误差，是方法本身的性质。",
      "走十个周期，就是把这个因子连乘六百多次。",
      "结果就是屏幕上这个数。",
      "龙格库塔的放大因子，是一个四次多项式。",
      "对线性方程，它等于一加自变量，加自变量平方除以二。",
      "再加三次方除以六，四次方除以二十四。",
      "把自变量换成虚数单位乘步长。",
      "模长的平方，主项是步长的六次方。",
      "所以能量误差是六阶小量。",
      "步长减半，能量误差降到六十四分之一。",
      "这就是为什么同一张网格，它看起来像没动过。",
      "但龙格库塔不是免费的：一步要四次求值。",
      "代码更长，也更容易写错。",
      "而且它同样有自己的稳定边界。",
      "先记住这两个因子，验证时还要用。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "04 / 四个模块",
    title: "把公式写成可测试的 Haskell",
    goal: "看签名、严格求值、边界和测试怎么落地",
    lines: [
      "实现拆成四个模块，都在 ts-base 仓库里。",
      "物理模块只负责两件事：角频率和能量。",
      "解析模块给两个基准：复利和弹簧。",
      "欧拉和龙格库塔各自一个文件。",
      "它们的签名完全一样。",
      "接收右端函数、起点、初值、步长和步数，返回整条轨迹。",
      "注意返回的是 Vector，不是列表。",
      "轨迹要反复索引、要算长度，Vector 更合适。",
      "步进循环用 iterateN，累加器严格求值。",
      "不加感叹号，惰性求值会把几百万个未求值的表达式堆在内存里。",
      "这是数值代码在 Haskell 里最常见的坑。",
      "边界也要管：步长非正、步数为负，直接报错。",
      "测试用一个小 harness，三十四条断言。",
      "每条断言都有期望值和实际值，失败就停。",
      "欧拉的代码只有这几行。",
      "龙格库塔多了三个斜率，结构一样。",
      "同一套函数，既被测试调用，也被证据程序调用。",
      "证据程序把轨迹写成 CSV，再算能量比和收敛阶。",
      "这样屏幕上的每个数，都能回到一次真实运行。",
      "接下来跑给你看。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "05 / 五组证据",
    title: "每个数字都能回到一次运行",
    goal: "单步、能量、收敛阶、相图、测试，逐项对照",
    lines: [
      "第一组验证：单步。",
      "欧拉一步一点一，龙格库塔一步屏幕上这个数。",
      "和解析值对照：欧拉的差看得见，龙格库塔的差在小数点后很多位。",
      "第二组：十个周期的能量。",
      "欧拉的能量比，屏幕上这个数。",
      "和理论连乘只差最后几位。",
      "龙格库塔的能量比，屏幕上这个数。",
      "十圈之后，它损失了不到万分之一。",
      "第三组：误差随步长怎么降。",
      "横轴是步长，纵轴是终点误差，双对数坐标。",
      "欧拉法的拟合斜率，屏幕上这个数。",
      "龙格库塔的拟合斜率，屏幕上这个数。",
      "一个接近一阶，一个接近四阶。",
      "这不是挑出来的好看数字，是最小二乘的结果。",
      "第四组：相图。",
      "精确解是闭合曲线，欧拉是向外扩张的螺旋。",
      "龙格库塔的螺旋，几乎和它重合。",
      "第五组：代码测试。",
      "三十四条断言全部通过，边界错误也按预期抛出。",
      "证据 JSON 记录了提交号、运行时间、编译器和每个产物的校验和。",
      "任何一项对不上，checker 就拒绝。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "06 / 什么时候会炸",
    title: "稳定域与光滑性假设",
    goal: "说清方法的失效条件，而不是只报喜",
    lines: [
      "现在说边界，也就是什么时候不能用。",
      "第一类边界是稳定性：欧拉法在振子上没有稳定步长。",
      "步长再小，能量仍在涨，只是涨得慢。",
      "如果方程本身是衰减的，情况不同。",
      "测试方程里，导数等于负的衰减率乘状态。",
      "欧拉的放大因子，是一减步长乘衰减率。",
      "要求它落在负一到一之间。",
      "也就是步长乘衰减率小于二。",
      "超过二，数值解会振荡发散，哪怕真解在衰减。",
      "这叫绝对稳定性，刚性方程就卡在这里。",
      "龙格库塔的稳定域更大，但也是有限的。",
      "在虚轴上，边界是步长乘角频率小于二倍根号二。",
      "超过这个步长，它也会炸。",
      "第二类边界是光滑性。",
      "四阶收敛，假设右端项足够光滑。",
      "股票收盘价是分段常数，或者分段线性。",
      "拐点处斜率跳变，高阶方法的阶数会掉下来。",
      "这不是实现错误，是假设不成立。",
      "第三类边界是成本。",
      "龙格库塔一步四次求值，反传还要穿过整个求解器。",
      "神经微分方程的训练成本，主要就花在这里。",
      "所以下一集，我们把求解器放进网络里。",
    ],
  },
  {
    id: "outro",
    chapter: "收束",
    kicker: "07 / 下一集",
    title: "方法也是模型的一部分",
    goal: "收束结论，交接到神经微分方程",
    lines: [
      "这一集做了三件事。",
      "把欧拉和龙格库塔写成可测试的 Haskell。",
      "用解析解和能量守恒做裁判。",
      "量出了它们的误差阶和失效边界。",
      "如果只记一句话：方法的选择，是模型的一部分。",
      "同样的数据，换一个积分器，结论可能反过来。",
      "代码、证据和这一集的全部数字，都在 ts-base 仓库。",
      "下一集，我们让神经网络自己学动力学。",
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
