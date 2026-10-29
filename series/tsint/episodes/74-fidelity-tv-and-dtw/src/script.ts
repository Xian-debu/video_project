/**
 * 《别只看 MSE：总变差正则与 DTW 保真度》—— 第 9 章 · 保真度指标。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 *
 * 本集没有书页图版：p.219 只有两句提名，没有公式。原文以短摘录卡片出现，
 * 页码与 CC BY-NC-ND 4.0 标注由 shared.tsx 的 Quote 统一加。
 */
import voiceJson from "../../data/tsint-74-fidelity-tv-and-dtw/voice.json";

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
    title: "别只看 MSE",
    goal: "两条序列，两个指标，和它们各自的账",
    lines: [
      "这一集讲两个保真度指标。",
      "先看两条形状相同、只是错开三步的序列。",
      "逐点 MSE 是十五点八一。",
      "DTW 却是零。",
      "同一个形状，两个指标给出完全不同的答案。",
      "书里在二百一十九页只留了两句话。",
      "一句是 TV 正则，控制预测精度与动态保真度。",
      "一句是 DTW，作为超越 MSE 的指标。",
      "没有公式，没有数据，没有复现协议。",
      "所以书里的百分之四十五点九只能标 C 级。",
      "这一集补上定义、代码和可复算的数。",
      "先看 TV 怎样把抖动写进损失。",
      "再看 DTW 怎样对齐两条形状。",
      "最后说清楚，它们各自不是什么。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 逐点误差的盲区",
    title: "相位错了，逐点全错",
    goal: "MSE 看得见幅度，看不见对齐",
    lines: [
      "MSE 的算法很直接。",
      "两条序列逐点相减，平方，再平均。",
      "形状对、只是晚三步，每个点都会被罚。",
      "这不是模型错了，是相位错了。",
      "把二十一点序列画出来，错位看得更清楚。",
      "紫色是原序列，黄色晚三步。",
      "每个采样点都落在不同的相位上。",
      "逐点误差累加，就是十五点八一。",
      "DTW 换了一个问题。",
      "它不要求第 i 个点只对第 i 个点。",
      "允许一个点对多个点，也允许多个点对一个点。",
      "只要路径从左上走到右下，代价最小。",
      "黄金例：一、二、三，对二、三。",
      "一条最优路径是 (0,0)、(1,0)、(2,1)。",
      "代价是一，不是零。",
      "但路径不是唯一的，这里只展示一条。",
      "回到二十一点序列，DTW 的代价是零。",
      "路径长度三十三，说明它把很多点重复对齐了。",
      "所以 DTW 零不等于两条序列相同。",
      "它只说：允许拉伸之后，形状可以完全重合。",
      "这两个指标回答的不是同一个问题。",
      "下面把定义写清楚。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "02 / 总变差与动态时间规整",
    title: "两个指标，两种账本",
    goal: "TV 的 l1、DTW 的递推，以及三个约定",
    lines: [
      "先定义 TV。",
      "对序列 x，TV 是相邻差绝对值的和。",
      "公式是 sum |x_{t+1} - x_t|。",
      "它衡量的是这条曲线一共拐了多少路。",
      "常数序列的 TV 是零。",
      "抖动越多，TV 越大。",
      "损失写成 MSE 加 lambda 乘 TV。",
      "lambda 是权重，不是学习率。",
      "lambda 越大，越不愿意看到抖动。",
      "但 TV 是一次量纲，MSE 是平方量纲。",
      "比较之前，先把序列标准化。",
      "TV 在相邻差为零的地方不可导。",
      "所以用次梯度。",
      "第 i 个分量是两个 sign 相减。",
      "sign(x_i 减 x_{i-1})，减 sign(x_{i+1} 减 x_i)。",
      "差为零时，次梯度取零。",
      "再看 DTW。",
      "D(i,j) 等于 |x_i 减 y_j| 加三个前驱的最小值。",
      "三个前驱是上、左、左上。",
      "第一行和第一列直接累加。",
      "终点 D(n-1,m-1) 就是代价。",
      "本集用未开方版本。",
      "开方版叫 rooted DTW，量纲不同。",
      "序列长度不同时，还要按路径长度归一化。",
      "这三个约定不写清楚，数字就会对不上。",
      "书里只给了名字。",
      "TV 的 l1 形式、DTW 的递推，都是标准定义。",
      "本集把它们标成推断，不冒充原文。",
      "定义写完，看它们各自买到了什么。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "03 / 一个 λ，一条路径",
    title: "λ 在买什么",
    goal: "平滑与峰值，对齐与路径长度",
    lines: [
      "先看 TV 的 lambda 在买什么。",
      "取一条干净的正弦加趋势。",
      "观测上叠加交替的正负零点四噪声。",
      "训练时只看观测，评估时看干净信号。",
      "lambda 等于零，模型拟合每一个噪声点。",
      "TV 是九十四点九八。",
      "干净 MSE 是零点一六。",
      "加大 lambda，TV 迅速下降。",
      "到零点零零五，TV 是十三点九九。",
      "干净 MSE 降到零点零零七。",
      "这就是甜区：抖动少了，误差也小了。",
      "再加大到零点零五。",
      "TV 只剩四点五四。",
      "干净 MSE 反而升到零点一八七。",
      "为什么？峰值被抹平了。",
      "数据项拉不回来，细节就丢了。",
      "所以 lambda 不是越大越好。",
      "它买的是平滑，卖的是峰值。",
      "再看 DTW 的对齐网格。",
      "两个序列的每个点对，都有一个代价。",
      "最优路径从左上到右下。",
      "相位错开时，它沿着对角线平移。",
      "代价可以降到零，但路径变长了。",
      "路径长度三十三，就是代价。",
      "最后看三角不等式。",
      "x 到 z 的 DTW 是六。",
      "x 到 y 是二，y 到 z 是零。",
      "六大于二加零，违反量是四。",
      "所以 DTW 不是度量。",
      "这两条曲线，回答的是两个不同的问题。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "04 / 两个 Haskell 模块",
    title: "把两个指标写成可测试的代码",
    goal: "TvReg 与 Dtw，两套函数",
    lines: [
      "代码在 ts-base 的第 9 章。",
      "两个模块，互不 import。",
      "TvReg 导出 TV、MSE、损失、次梯度、下降。",
      "关键行是 TV 的定义。",
      "V.zipWith (-) (V.tail xs) xs，再取绝对值求和。",
      "次梯度处理边界：左邻和右邻分别判断。",
      "差为零时返回零，这是 l1 的次梯度选择。",
      "tvDescent 做的是确定性的次梯度下降。",
      "学习率和 lambda 分开传，避免混淆。",
      "Dtw 模块先建整张表。",
      "每个格子取三个前驱的最小值。",
      "回溯时记录路径，返回零基下标。",
      "dtwCost 只要距离，用滚动两行。",
      "空间从 n 乘 m 降到 min(n,m)。",
      "dtwBanded 加 Sakoe-Chiba 窗口。",
      "带宽 w 是设计参数，不是常数。",
      "三个容易错的地方。",
      "第一，lambda 和 MSE 的量纲不同。",
      "第二，TV 在零处不可导，不能直接求导。",
      "第三，DTW 不是度量，不能当距离用。",
      "还有复杂度：无窗口是 n 乘 m。",
      "一万点以上，要加窗口或降采样。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "05 / 四组数字",
    title: "每个数字都能回到一次运行",
    goal: "TV 曲线、黄金例、三角反例、带约束",
    lines: [
      "所有数字来自同一次证据运行。",
      "测试一共一百四十二条。",
      "先看 TV 的定义。",
      "序列一、二、四、七。",
      "相邻差是一、二、三。",
      "TV 等于六。",
      "再看三个 lambda。",
      "lambda 零：TV 九十四点九八，干净 MSE 零点一六。",
      "lambda 零点零零五：TV 十三点九九，干净 MSE 零点零零七。",
      "lambda 零点零五：TV 四点五四，干净 MSE 零点一八七。",
      "甜区和过平滑，都能回到 CSV。",
      "黄金例：一、二、三，对二、三。",
      "代价是一，路径三步。",
      "平移例：MSE 十五点八一，DTW 零，路径三十三步。",
      "这两个数放在一起，就是本集的核心。",
      "三角不等式：六，二，零。",
      "六大于二加零，违反量四。",
      "带约束：五百点，窗口二十。",
      "代价二十八点五三，和完整 DTW 相等。",
      "耗时三十一点五毫秒。",
      "这些数都在证据 JSON 里。",
      "提交号是 a32c1e0。",
      "一百四十二条断言全部通过。",
      "屏幕上的每个数，都能回到这次运行。",
      "下面说边界。",
      "哪些话不能说。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "06 / 什么时候不能信",
    title: "两个数字，七条边界",
    goal: "C 级声明、量纲、度量、复杂度",
    lines: [
      "第一条边界：书里的百分之四十五点九。",
      "它没有基线，没有数据，没有硬件。",
      "只能标 C，不能当结论。",
      "第二条：TV 的 l1 形式。",
      "书里只写了名字，公式是本集补的。",
      "换成平方 TV，数值会变。",
      "第三条：lambda 的甜区。",
      "零点零零五是这条合成序列上的值。",
      "换数据、换噪声，甜区会移动。",
      "第四条：TV 会抹掉峰值。",
      "拐点、冲击、尖峰，都是 TV 要罚的东西。",
      "第五条：DTW 不是度量。",
      "三角不等式可以差出四。",
      "它也不能直接比较不同长度的序列。",
      "归一化方式不同，数值就不同。",
      "第六条：DTW 的复杂度。",
      "无窗口是 n 乘 m，内存也扛不住。",
      "带宽能提速，但可能把最优路径挡在外面。",
      "最后一条：本集用的是合成序列。",
      "它能验证定义，不能替代真实任务。",
      "所以下面这些话，都要带上条件。",
    ],
  },
  {
    id: "outro",
    chapter: "收束",
    kicker: "07 / 一句话",
    title: "误差有三种，指标只有一种。",
    goal: "把 MSE、TV、DTW 放回各自的位置",
    lines: [
      "误差有三种。",
      "幅度错，MSE 管。",
      "抖动多，TV 管。",
      "相位错，DTW 管。",
      "没有一个指标能同时管三种。",
      "选指标之前，先问误差长什么样。",
      "第 9 章到这里结束。",
      "这个系列也到这里结束。",
      "七十四个问题，一百九十个算法。",
      "愿你看数字时，先看它漏掉了什么。",
    ],
  },
];

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