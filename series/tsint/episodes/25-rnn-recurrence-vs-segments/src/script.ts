/**
 * 《递归与分段：RNN 的两条生成路》—— 第 3 章 · 序列模型。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-25-rnn-recurrence-vs-segments/voice.json";

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
    kicker: "第 3 章 / 序列模型 · 第二十五集",
    title: "递归与分段",
    goal: "RNN 的两条生成路",
    lines: [
      "第三篇章，第二十五集。",
      "上一集把通道关系讲完了。",
      "这一集回到时间轴。",
      "给定九十六步历史。",
      "要一次预测未来二十四步。",
      "这件事有两种做法。",
      "第一种，逐点递归。",
      "把历史读成一个状态。",
      "再一步一步往外推。",
      "第二种，分段并行。",
      "历史切成十二块。",
      "生成切成三块。",
      "两条路，同一份数据。",
      "同一把尺子量。",
      "逐点递归要调用一百二十次。",
      "分段只要十五次。",
      "八倍的速度差。",
      "但快的未必准。",
      "第 24 步的平均误差。",
      "递归是 0.4135。",
      "分段是 0.3972。",
      "分段还更准一点。",
      "那故事是不是很简单。",
      "不是。",
      "有一个读数反过来了。",
      "看完代码再说。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "一百二十次串行",
    goal: "自回归为什么慢，误差为什么涨",
    lines: [
      "先说递归为什么慢。",
      "因为它是自回归的。",
      "第 t 步的输出，是第 t+1 步的输入。",
      "要预测二十四步。",
      "模型得把自己喂二十四次。",
      "每一步都要更新隐藏状态。",
      "九十六步历史加二十四步生成。",
      "一共一百二十次单元前向。",
      "这是数学上的下限。",
      "没法并行。",
      "误差也是从这条路来的。",
      "预测错了，就把错的值当输入。",
      "一步的偏差，变成下一步的起点。",
      "误差因此累积。",
      "我们量了这条曲线。",
      "第 1 步，误差 0.3758。",
      "第 24 步，0.4135。",
      "膨胀了 1.10 倍。",
      "看起来不夸张。",
      "这是在标准化收益上的。",
      "换成价格，会放大。",
      "分段的动机就在这里。",
      "既然必须串行，能不能少串几次。",
      "把时间轴切开。",
      "每段只算一次。",
      "块与块之间并行。",
      "这就是 SegRNN 的想法。",
      "速度换来了。",
      "代价也带来了。",
      "后面一个一个看。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "一步、一段、两条路",
    goal: "式 3.12 · 式 3.13 · 段编码",
    lines: [
      "先把两条路写清楚。",
      "循环网络的一步，是式 3.12。",
      "h_t 等于 g，作用于三项之和。",
      "第一项是输入项，W 乘 z。",
      "第二项是循环项，U 乘上一时刻。",
      "第三项是偏置 b。",
      "g 在本集取 tanh。",
      "多层的层间输入，是上一层的输出。",
      "输出头是式 3.13。",
      "x hat 等于 Head 作用于 h。",
      "把一步按时间串起来，就是网络。",
      "我们的口径，写在模块注释里。",
      "隐藏维 32。",
      "一层，tanh。",
      "截断反向传播 48 步。",
      "梯度裁剪 1.0。",
      "学习率 1e-3。",
      "自回归生成 24 步。",
      "加历史，一共 120 次调用。",
      "手算金例，输入两个 1。",
      "权重全 1，偏置 0，激活取恒等。",
      "第一步 h1 等于 1。",
      "第二步 h2 等于 2。",
      "精确等于 2，不是约等于。",
      "分段网络换了一种参数化。",
      "历史切成 m 段。",
      "m 等于 ceil(H 除以 s)。",
      "每段用同一个单元读一遍。",
      "96 步，s 等于 8，就是 12 段。",
      "生成切三块。",
      "前向调用 12 加 3，等于 15。",
      "参数 1832 个。",
      "比递归的 1121 个还多。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "滚动的摘要，切开的块",
    goal: "误差曲线与平滑度",
    lines: [
      "直觉上，递归像一个滚动的摘要。",
      "每读一步，就把历史压进 32 维。",
      "读到最后，96 步只剩一个向量。",
      "再靠这个向量往外吐 24 步。",
      "信息在这里被压掉了。",
      "分段看得更宽。",
      "每一块单独编码，保留块内形状。",
      "块与块之间，靠解码器融合。",
      "左边是误差曲线。",
      "横轴是预测步数，1 到 24。",
      "青色是逐点递归。",
      "珊瑚色是直接多步头。",
      "灰色是朴素基线。",
      "递归从 0.3758 涨到 0.4135。",
      "直接多步头基本是平的。",
      "0.3684 到 0.3731。",
      "朴素基线一直在 0.42 以上。",
      "分段呢。",
      "第 1 步 0.4438，不如递归。",
      "第 24 步 0.3972，反超。",
      "曲线是往下走的。",
      "看起来分段更稳。",
      "我们还想验证一件事。",
      "分段生成应该更平滑。",
      "因为块内是一起生成的。",
      "用二阶差分的平均绝对值衡量。",
      "逐点递归 0.4435。",
      "分段 0.6353。",
      "分段抖了 1.43 倍。",
      "和直觉相反。",
      "为什么，边界那页再说。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "两个模块，一种口径",
    goal: "Rnn.hs 与 SegRnn.hs",
    lines: [
      "两个模块，一个文件一个。",
      "先看逐点递归。",
      "step 函数只做一件事。",
      "把输入项、循环项、偏置加起来。",
      "再过激活函数。",
      "我们的实现把激活函数当参数。",
      "这样金例才能用恒等函数验。",
      "预测用 arForecast。",
      "先跑完历史，拿到最后的状态。",
      "然后循环，把输出喂回输入。",
      "循环次数就是 horizon。",
      "梯度用 BPTT。",
      "反向遍历时间步。",
      "截断参数默认 48。",
      "截断小于序列长度，结果会不同。",
      "这一点专门测了。",
      "截断 100 和全长一致，差 0。",
      "截断 3 和全长差 6.84。",
      "这两个数就是截断语义的证据。",
      "梯度校验用中心差分。",
      "相对误差 9.05e-9。",
      "门限是 1e-6。",
      "过了四个数量级。",
      "分段模块的结构不同。",
      "编码器是矩阵，H 乘 s。",
      "把一段 8 步读成一个向量。",
      "生成器再把这个向量变回 8 步。",
      "解码器融合已经生成的块。",
      "一块一次调用。",
      "参数 1832 个。",
      "书里表 3.2 只给三条性质。",
      "块嵌入、并行生成、训练目标。",
      "具体前向是我们自己定的。",
      "证据等级标成 B。",
      "两个坑也记一下。",
      "梯度函数只吃一条序列。",
      "传一个批次进去，会报形状错。",
      "单字母大写的局部变量，会被当成构造器。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "三十一项，零失败",
    goal: "从断言到真实读数",
    lines: [
      "验证分四组。",
      "数据 7 项。",
      "递归 13 项。",
      "分段 11 项。",
      "一共 31 项，零失败。",
      "先说数据。",
      "2674 行日线。",
      "2673 个对数收益。",
      "2015 年 1 月到 2025 年 12 月。",
      "sha256 是 06019e23 开头。",
      "96 加 24 的窗口，2554 个。",
      "训练用 224 个窗口。",
      "测试用最后 80 个。",
      "参数量手算对上了。",
      "递归 1121 个。",
      "分段 1832 个。",
      "梯度门限过了。",
      "截断语义两项都过。",
      "调用次数 15 对 120。",
      "比值正好 8。",
      "训练 loss 从 1.032 降到 0.954。",
      "分段从 1.167 降到 0.843。",
      "两条曲线都在下降。",
      "没有发散。",
      "四张表都在数据目录里。",
      "误差曲线，分段曲线，训练曲线，样本。",
      "测试套件现在 87 组。",
      "1161 条断言。",
      "新增 13 条递归，15 条分段。",
      "全部通过。",
      "复现只要一条命令。",
      "种子固定 25。",
      "同样的数据，同样的读数。",
      "证据等级是 A。",
      "因为每条断言都能判真假。",
      "这一集不是演示，是可复查。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "六条必须说的话",
    goal: "不假装完成",
    lines: [
      "现在说边界。",
      "第一件，平滑度那个反直觉结果。",
      "我们原本以为分段更平滑。",
      "实测 0.6353 对 0.4435。",
      "分段抖了 1.43 倍。",
      "原因不复杂。",
      "块内是独立生成的。",
      "我们没有在块内加平滑约束。",
      "块内每一步的误差不共享。",
      "所以拼接处会跳。",
      "这是这个变体的真实性质。",
      "不是实现错误。",
      "第二件，分段前向是自定变体。",
      "书里只给三条定性描述。",
      "块嵌入、并行生成、训练目标。",
      "怎么融合，书里没写。",
      "所以证据等级标 B。",
      "第三件，只有一个标的。",
      "一个指数，十年。",
      "不能代表全市场。",
      "第四件，没做端到端回测。",
      "我们只量预测误差。",
      "误差小不等于赚钱。",
      "第五件，膨胀只有 1.10 倍。",
      "这不是夸张的数字。",
      "标准化收益上的 10%。",
      "换成价格会放大。",
      "但别把它说成爆炸。",
      "第六件，数据有缺口。",
      "2020 年春节，断了 11 天。",
      "窗口按行连续切，不剔除。",
      "读数是近似。",
      "这些都不是 bug。",
      "是口径必须一起报的东西。",
      "账都记在证据里，不藏着。",
      "所以这一集仍算 ready。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "一条轴，两种切法",
    lines: [
      "三句话。",
      "逐点递归，用串行换稳定。",
      "分段并行，用切块换速度。",
      "快的未必准，准的未必平滑。",
      "第 24 步分段反超，只差 0.016。",
      "不是碾压，是一条路。",
      "下一集，序列压缩三法。",
      "池化、卷积、补丁。",
      "把长序列压短，是另一条路。",
      "第 25 集的证词是：",
      "两条路各有各的代价。",
      "第 25 集，完。",
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

