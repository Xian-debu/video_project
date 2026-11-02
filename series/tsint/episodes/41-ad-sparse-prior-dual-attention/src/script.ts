/**
 * 第 4 章 · 异常检测 · 第四十一集。
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 voice.json 的实测值。
 */
import voiceJson from "../../data/tsint-41-ad-sparse-prior-dual-attention/voice.json";

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
    id: "open",
    chapter: "开场",
    kicker: "第 4 章 / 异常检测 · 第四十一集",
    title: "换掉一个假设：稀疏二值注意力、重尾先验与双视图",
    goal: "稀疏 · 重尾 · 双视图",
    pages: [],
    lines: [
"上一集，四个神经网络判据都没到零点二五。",
"问题不在模型深浅。",
"在三个没人写下来的假设。",
"这一集换掉它们。",
"第一个假设：注意力必须稠密。",
"SBT 换成二值稀疏掩码。",
"时间上也只让模型看过去。",
"Step-T 因果，一个点一个点往前走。",
"第二个假设：重构误差服从高斯。",
"TVAE 把先验换成 Student-t。",
"尾部更重，跳空不再被当成异常。",
"第三个假设：一个视图就够。",
"DCdetector 同时看特征和样本两个方向。",
"用对比学习判断哪段模式更一致。",
"三个替换，三种赌法。",
"先说结论。",
"两个赢了，一个打平。",
"TVAE 测试 F1 零点二一，高斯 VAE 零点一三。",
"DCdetector 零点二四，patch-AE 零点一一。",
"SBT 零点一零，稠密注意力也是零点一零。",
"打平。",
"数据还是茅台一只票。",
"日线三千九百九十六行。",
"训练两千一百八十天，验证四百八十七天。",
"测试一千三百二十八天。",
"注入三种异常。",
"八段尖峰、四段形态替换、四段相位翻转。",
"真值一百六十八个窗口，占一成四。",
"另外拉了五千根五分钟线。",
"给 DCdetector 做一次独立演示。"
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "一个问题，三个没写下来的假设",
    title: "三个假设，三个替换",
    goal: "噪声白 · 单视图 · 稠密",
    pages: [],
    lines: [
"先看上一集留下的坑。",
"四个方法，验证段都在零点二八到零点三一。",
"搬到测试段，最好的也只有零点二五。",
"这一次不看分数，看假设。",
"第一个隐藏假设：噪声是白的。",
"现实里跳空、涨跌停、停牌。",
"这些点会被高斯先验判成异常。",
"第二个隐藏假设：一个窗口只有一种模式。",
"同一段形态，放在不同尺度上不一样。",
"单视图重建分不清。",
"第三个隐藏假设：注意力越稠密越好。",
"一百个点的窗口，稠密注意力的成本不是瓶颈。",
"真正的问题是它把噪声也学进去。",
"三个假设，对应三个替换。",
"验证办法：同数据、同注入、同阈值规则。",
"每个方法配一个同结构基线。",
"只换掉那一个假设。",
"其余全部锁死。",
"注入三种异常。",
"尖峰：一个点乘五到十个标准差。",
"形态替换：把整段换成另一只票的形态。",
"相位翻转：半周期错位。",
"尖峰八段，形态四段，相位四段。",
"真值一百六十八个窗口。",
"验证段另做一套小的注射。",
"四段尖峰、两段形态、一段相位。",
"种子写死：四十二、四二四二、四二四三。",
"验证段用四十三、四二四三、四三四四。",
"两条纪律：窗口不重叠；真值只认窗口末尾。",
"所有读数都在窗口层算。"
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "三条公式，三种赌法",
    title: "先看公式，再看约定",
    goal: "二值稀疏 · Student-t · InfoNCE",
    pages: [],
    lines: [
"第一块：SBT 的稀疏二值注意力。",
"掩码矩阵 B 每个位置独立采样。",
"一半保留，一半清零。",
"采样一次就冻结，不参与训练。",
"注意力还是标准形式。",
"分数矩阵乘掩码，再 softmax。",
"被清零的位置，权重直接为零。",
"每一层都有 Q、K、V、O 四个投影。",
"权重二值化：只取正一、零、负一。",
"反向传播用直通估计。",
"梯度原样穿过 sign 函数。",
"时间上再做一次因果掩码。",
"第 t 个点只看一到 t。",
"这叫 Step-T 因果。",
"参数量只有一百六十九。",
"一个窗口连一千个参数都不到。",
"第二块：TVAE 的重尾先验。",
"普通 VAE 让潜码服从标准高斯。",
"尾部按指数衰减。",
"一个跳空点就能把似然拉爆。",
"TVAE 换成 Student-t。",
"密度正比于一加 z 方比 nu 的负幂。",
"nu 越小，尾巴越重。",
"本集固定 nu 等于五。",
"分数是负对数似然加 KL。",
"用八次蒙特卡洛采样估期望。",
"先验重尾，跳空就不再被当成异常。",
"但形态变了，它照样报警。",
"第三块：DCdetector 的双注意力。",
"一个窗口切成十一段 patch。",
"两个视图：一段一段看，和隔段看。",
"同一个窗口的两个视图互为正样本。",
"别的窗口的 patch 当负样本。",
"损失是 InfoNCE。",
"温度 tau 取零点一。",
"黄金值：所有相似度相等时。",
"损失等于 log 负样本数加一。",
"十一个负样本，就是 log 十一。",
"四条数值约定。",
"阈值只在验证段挑。",
"六个模型同一套窗口、同一套真值。",
"种子全写死，没有随机数。",
"换机器重跑，读数逐位一样。"
    ],
  },

  {
    id: "intuition",
    chapter: "直觉",
    kicker: "稀疏省在哪，重尾变在哪",
    title: "曲线 · 尾部 · 验证段",
    goal: "曲线 · 尾部 · 验证段",
    pages: [],
    lines: [
"先看稀疏到底省了什么。",
"掩码率零点六二五。",
"不是精确的一半，因为因果三角也被算进去。",
"二值权重取值只有负一、零、正一。",
"训练完，权重里一半以上是零。",
"这不是剪枝，是训练时就长这样。",
"Step-T 因果检查：改未来点。",
"窗口后半段全改成一亿。",
"前十步的重构一动不动。",
"说明它真的没看未来。",
"对比稠密注意力基线。",
"同样的窗口，同样的训练轮次。",
"结果：测试段两者打平。",
"再看重尾先验的形状。",
"横轴是离均值几个标准差。",
"纵轴是负对数密度。",
"高斯是抛物线。",
"Student-t 在尾部更低。",
"差在尾巴上，不在中间。",
"中间两个分布几乎重合。",
"所以干净窗的分数几乎一样。",
"差别只在跳空那几个点。",
"尖峰窗上，t 先验不抬高分数。",
"这就是重尾先验四个字的实际含义。",
"DCdetector 的对比损失，在注入窗口整段抬高。",
"单视图 patch-AE 只有零星几个尖刺。",
"形态替换和相位翻转，双视图能看到。",
"测试 F1 零点二四，patch-AE 零点一一，两倍多。",
"三个替换，三种结果。",
"打平一个，赢两个。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "三个模块，一千零二十一行",
    title: "手写 · 直通估计 · 训练成本",
    goal: "手写 · 直通估计 · 训练成本",
    pages: [],
    lines: [
"实现：三个模块，一千零二十一行。",
"SBT 三百一十四行，十四个测试。",
"TVAE 二百二十七行，十八个测试。",
"DCdetector 二百六十行，二十三个测试。",
"全部纯函数，没有第三方数值库。",
"矩阵乘、Cholesky、自动微分都手写。",
"SBT 的直通估计最先写错。",
"初版把 sign 乘进了梯度。",
"结果负权重那半边方向反了。",
"训练照样收敛。",
"但方向性检查立刻失败。",
"单测里专门做了反向对照。",
"正常方向，第二个解码器更不会重建第一个的输出。",
"方向反了，检查直接判失败。",
"训练成本是个真问题。",
"两千零八十一个窗口，注意力是平方复杂度。",
"一轮要一分半，十轮就爆内存。",
"解法不是加内存。",
"是拟合段每五个窗口取一个。",
"四百一十七个窗口训练。",
"分数仍在全量窗口上算。",
"TVAE 的 gamma 函数用 Lanczos 近似。",
"卡方采样用 Marsaglia-Tsang。",
"十万次采样做一次数值体检。",
"数值兜底也要写进代码。",
"协方差矩阵加 Cholesky 抖动。",
"分母夹下界，防止零向量出 NaN。",
"每个模块都有反向检查。",
"检查不是看损失降没降，是看方向对不对。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "六个读数，一个结论",
    title: "同数据 · 同注入 · 同阈值",
    goal: "同数据 · 同注入 · 同阈值",
    pages: [],
    lines: [
"验证协议。",
"标的：贵州茅台，日频，复权收盘。",
"三千九百九十六行，二零一零到二零二六。",
"训练到二零一八年底。",
"验证两年，测试从二零二一年起。",
"窗口长一百，滑动一格。",
"拟合两千零八十一窗。",
"验证三百八十八窗。",
"测试一千二百二十九窗。",
"阈值只在验证段挑，取 F1 最优。",
"测试段一个点都不参与调参。",
"六个模型，同一套窗口、同一套真值。",
"读数。",
"TVAE 零点二一，高斯 VAE 零点一三。",
"提升六成。",
"DCdetector 零点二四，patch-AE 零点一一。",
"提升一倍多。",
"SBT 零点一零，稠密注意力也是零点一零。",
"打平。",
"但看验证段：TVAE 和高斯都是零点三一。",
"DCdetector 反而更低。",
"增益全部出现在测试段。",
"精确率和召回率。",
"TVAE 精确率零点一四，召回零点四六。",
"高斯 VAE 精确率零点一一，召回零点一六。",
"DCdetector 精确率零点一四，召回零点九九。",
"patch-AE 精确率零点一零，召回零点三一。",
"SBT 精确率零点一三，召回零点九五。",
"召回高、精确率低，是这套数据的常态。",
"阈值和量纲。",
"六个模型的阈值没有可比性。",
"SBT 是重建误差，高斯 VAE 是负对数似然。",
"DCdetector 是对比损失。",
"只有过没过线可比。",
"按注入类型拆开看。",
"尖峰窗、形态窗、相位窗、干净窗。",
"三个方法在形态窗上分最高。",
"尖峰窗反而最接近干净窗。",
"原因：窗口一百个点，一个尖峰只占百分之一。",
"窗口层读数把它稀释了。",
"六十四项检查，一次跑完。",
"数据、窗口、三个方法、基线，各管一段。",
"注入、读数、盲区、分钟线，也各管一段。",
"TVAE 八项、DC 八项、SBT 八项。",
"全绿。",
"还有负向断言。",
"没有满分 F1。",
"SBT 打平不算赢。",
"分钟线的形态替换没有抬高损失。",
"读数的来源。",
"证据 JSON、包内数据、两个仓的提交号。",
"换机器重跑，差异只在浮点末位。",
"六十四项，四百零二秒。",
"全部通过。"
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "三个替换，一条边界",
    title: "不声称 · 三笔债 · 下一集",
    goal: "不声称 · 三笔债 · 下一集",
    pages: [],
    lines: [
"不声称的事，先摆出来。",
"不声称 SOTA。",
"没有公开基准，只有一只票。",
"不声称通用。",
"换市场、换品种，全部要重跑。",
"不声称实时。",
"日频收盘后批处理。",
"不声称稀疏一定更好。",
"SBT 这一集只是打平。",
"不声称阈值可迁移。",
"验证到测试的落差，每一集都在。",
"三个替换，只证明了两件事。",
"三笔债，这一集没还。",
"一：SBT 的增益为零。",
"二值化削掉的表达力，没找回来。",
"二：验证段样本太少。",
"七段注射，六十四个真值窗口。",
"阈值挑得抖，读数跟着抖。",
"三：窗口重叠九十九天。",
"一千二百二十九个窗口不是独立样本。",
"下一集：把距离本身当模型。",
"从 1-NN 加 DTW 到弹性集成。",
"距离决定一切。"
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "一集一个读数",
    title: "两个赢 · 一个打平 · 下一集",
    goal: "两个赢 · 一个打平 · 下一集",
    pages: [],
    lines: [
"换掉一个假设。",
"两个赢，一个打平。",
"TVAE 重尾，赢了高斯。",
"DCdetector 双视图，赢了一倍。",
"SBT 稀疏，打平。",
"但赢的两个，验证段都没领先。",
"这是这一集最该记住的一句。",
"新增测试五十五条。",
"三个模块：十四、十八、二十三。",
"仓库合计一千七百四十四条。",
"证据检查六十四项。",
"本集进度五十一 / 七十四。",
"下一集：距离决定一切。",
"换假设，说到这里。"
    ],
  },
];

export const PAGES_INDEX: Record<string, number[]> = {
  open: [0, 21],
  problem: [0, 13, 18],
  definitions: [0, 16, 28, 38],
  intuition: [0, 13, 24],
  implementation: [0, 6, 14, 24],
  verification: [0, 12, 22, 29, 40, 49],
  boundary: [0, 12, 20],
  outro: [0, 12],
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
export const TOTAL_SEC = round2(SCENES.reduce((a, s) => a + s.dur, 0));
export const TOTAL = Math.round(TOTAL_SEC * FPS);

export const STARTS = SCENES.map((s) => s.start);
export const CAPTIONS = LINES.map((l) => ({ start: l.start, dur: l.dur, text: l.speech }));

export const linesOf = (id: string) => LINES.filter((l) => l.scene === id);
export const sceneOf = (id: string) => SCENES.find((s) => s.id === id)!;
export const within = (id: string, k: number) => {
  const s = sceneOf(id);
  return [s.start + 0.6, s.start + s.dur - 0.4 * k] as const;
};
