/**
 * 《概率预测入门：高斯 NLL、分位数损失、分位数指标》—— 第 3 章 · 概率与损失。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-22-prob-nll-quantile-eval/voice.json";

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
    kicker: "第 3 章 / 概率与损失",
    title: "概率预测入门",
    goal: "高斯 NLL · 分位数损失 · QL 指标",
    lines: [
      "第 3 章 · 概率与损失，第二十二集。",
      "上一集注意力只混合信息。",
      "这一集给它一个打分的出口。",
      "书在印刷版六十七到六十九页。",
      "式三·二八到三·三二讲损失。",
      "还有式三·四一和三·四二。",
      "两个损失，一个指标。",
      "高斯负对数似然，分位数损失。",
      "指标就是分位数损失 QL。",
      "式子短，但书里埋了三个口径问题。",
      "还漏了一个常数。",
      "计划书也抄错了一个数。",
      "这一集全部摊开。",
      "先说为什么要打分。",
      "注意力只回答「怎么混合」。",
      "它不回答「混得好不好」。",
      "损失函数才回答后一个问题。",
      "概率预测还要多一层。",
      "不是给一个点，是给一个分布。",
      "或者给几个分位数。",
      "分布好不好，要用概率口径评。",
      "本集就讲这三件事。",
      "高斯 NLL，分位数损失。",
      "以及 QL 指标的算法。",
      "交付仍然是两样。",
      "能跑的 Haskell 实现。",
      "和四十一项可复跑证据。",
      "还有一个必须坦白的边界。",
      "这些读数没有预测业绩的意思。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "没有损失，就没有梯度",
    goal: "三个口径坑",
    lines: [
      "先看问题在哪。",
      "上一集的注意力输出一个矩阵。",
      "形状九十六乘六十四。",
      "每行是一个时间步的表示。",
      "可是它没有和答案比过。",
      "没有比较，就没有梯度。",
      "没有梯度，就没法训练。",
      "所以需要损失函数。",
      "损失把预测和真值压成一个数。",
      "这个数越小，模型越好。",
      "听起来简单，第一个坑在高斯 NLL。",
      "书里式三·三零少一个常数。",
      "每元素少二分之一 log 二 pi。",
      "数值是零点九一八九。",
      "这不是小事。",
      "它会让损失出现负值。",
      "还好它不影响梯度。",
      "但报数时必须说清口径。",
      "第二个坑在分位数损失。",
      "同一个误差，方向不同价钱不同。",
      "tau 零点九时，低估罚一点八。",
      "高估只罚零点二。",
      "一比九，非常不对称。",
      "第三个坑在 QL 指标。",
      "书里式三·四二没有系数二。",
      "所以 tau 等于零点五时。",
      "QL 是 MAE 的一半。",
      "计划书却写成等于 MAE。",
      "三个坑都要在画面里说清。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "似然、pinball、QL",
    goal: "把三个式子钉住",
    lines: [
      "先把三个定义钉住。",
      "点预测只给一个数。",
      "概率预测给一个分布。",
      "或者给几个分位数。",
      "似然是「在这个参数下看到数据的概率」。",
      "连续变量用密度。",
      "密度可以大于一。",
      "所以负对数似然可以是负数。",
      "这点后面会再遇到。",
      "tau 分位数让左边占 tau。",
      "中位数是 tau 等于零点五。",
      "定义清楚了，看第一个式子。",
      "高斯负对数似然。",
      "假设 y 服从均值 mu、标准差 sigma。",
      "取负对数，保留与参数有关的项。",
      "得到二分之一 log sigma 平方。",
      "加上残差平方除以 sigma 平方。",
      "书里式三·三零只写到这里。",
      "本仓补上二分之一 log 二 pi。",
      "这样它才是完整的 NLL。",
      "手算一组数。",
      "mu 等于一，sigma 等于二，y 等于三。",
      "书版得到一点一九三一四七。",
      "标准版得到二点一一二零八六。",
      "差值零点九一八九三八五。",
      "正好是二分之一 log 二 pi。",
      "第二个式子，pinball。",
      "tau 零点九时，低估一块钱罚一点八。",
      "高估一块钱只罚零点二。",
      "零点一的分位数反过来。",
      "低估罚零点二，高估罚一点八。",
      "tau 零点五时，两边都是零点五。",
      "所以它等于零点五倍绝对误差。",
      "这就是为什么 QL 里有个二分之一。",
      "第三个式子，多分位数。",
      "五个 tau 各算一次，取平均。",
      "书里式三·四二。",
      "就是每个 tau 的平均 QL。",
      "注意它没有系数二。",
      "所以 tau 等于零点五时。",
      "QL 是 MAE 的一半。",
      "想直接和 MAE 比，就乘二。",
      "本仓两种都提供。",
      "口径写在证据里。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "不对称的损失",
    goal: "为什么分位数治得了偏科",
    lines: [
      "换个直觉看这三个东西。",
      "横轴是误差，纵轴是罚款。",
      "tau 零点九的线很陡。",
      "低估方向斜率是零点九。",
      "高估方向斜率只有零点一。",
      "所以模型宁可高估一点。",
      "这就是九十分位数的性格。",
      "tau 零点五时两边对称，像一个 V。",
      "再看最优常数预测。",
      "如果只能用同一个数预测所有样本。",
      "什么数让 pinball 最小？",
      "对 tau 零点五。",
      "答案是中位数，不是均值。",
      "对一加到十的样本。",
      "经验分位取五。",
      "五和六并列最优。",
      "这就是分位数回归的名字来源。",
      "真实收益上再看一次。",
      "二百四十个交易日。",
      "十个分位和九十个分位。",
      "实际覆盖率正好零点一和零点九。",
      "十到九十的区间覆盖零点八零。",
      "这是分位数预测的校准。",
      "最后看高斯 NLL 的性格。",
      "sigma 太小时，残差项爆炸。",
      "sigma 太大时，log sigma 项变大。",
      "最优 sigma 是残差绝对值。",
      "所以高斯 NLL 学的是均值和尺度。",
      "真实收益上，八十区间覆盖零点八四。",
      "比名义的零点八略高，尾部更厚。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个模块，一个口径",
    goal: "softplus、pinball、两套 QL",
    lines: [
      "看实现，三个模块。",
      "GaussNll 管高斯损失。",
      "QuantileLoss 管 pinball。",
      "EvalQl 管评估口径。",
      "sigma 不能直接当参数。",
      "我们参数化 raw，再 softplus。",
      "再加一个极小值 1e-6。",
      "保证 sigma 永远为正。",
      "为什么不用 exp？",
      "exp 太容易冲出去。",
      "softplus 在零点附近更稳。",
      "解析梯度对 mu 和 raw 各一个。",
      "数值梯度只用来对账。",
      "拟合用固定步长梯度下降。",
      "两千步，mu 学习率零点零五。",
      "sigma 学习率零点零二。",
      "合成样本上损失从二十八点八。",
      "降到一点七七四。",
      "均值五点零一一，标准差一点四二六。",
      "第二个模块，pinball。",
      "代码只有一行分支。",
      "两个方向要分开写。",
      "然后对元素取平均。",
      "多分位数就是循环 tau。",
      "经验分位数用 type-1 定义。",
      "排序后取第 ceil(tau n) 个。",
      "对小样本这是最稳的定义。",
      "第三个模块，评估。",
      "输入是预测矩阵和真值。",
      "预测列数是 tau 的个数。",
      "evalQl 按书里口径，不乘二。",
      "evalQl2 乘二，方便和 MAE 比。",
      "另外算一个交叉率。",
      "分位数预测应该随 tau 单调。",
      "交叉了就说明模型有问题。",
      "还有一个必须说的边界。",
      "真实日收益量级太小。",
      "固定步长梯度下降几乎不动。",
      "所以真实数据用闭式矩估计。",
      "证据里写明了这个限制。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "四十一项，零失败",
    goal: "五类检查各自的职责",
    lines: [
      "验证环节，四十一项。",
      "数据八项，高斯十一项。",
      "分位数八项，QL 指标七项。",
      "真实读数七项。",
      "全部通过，零失败。",
      "再加七十九套测试。",
      "一千零五十九条断言。",
      "先看数据本身。",
      "合成样本三百个点。",
      "均值五点零一一，标准差一点四二六。",
      "真实收益二百四十天。",
      "sha256 都记在证据里。",
      "再看高斯的黄金值。",
      "书版一点一九三一四七。",
      "标准版二点一一二零八六。",
      "差零点九一八九三九。",
      "再看分位数的黄金值。",
      "tau 零点九，低估一块，罚一点八。",
      "tau 零点一，同样误差，罚零点二。",
      "比值正好九。",
      "tau 零点五的损失。",
      "等于零点五倍 MAE。",
      "合成样本上是零点五七二六。",
      "除以 MAE 一点一四五一。",
      "正好是零点五。",
      "再看 QL 的两套口径。",
      "书版在 tau 零点五给零点五。",
      "乘二版给一点零，也就是 MAE。",
      "混合 tau 的黄金例。",
      "书版零点九，乘二版一点八。",
      "交叉率三个例子。",
      "单调零，全反一，四分之一是零点二五。",
      "最后看真实读数。",
      "十个分位覆盖零点一。",
      "九十个分位覆盖零点九。",
      "十分位到九十分位覆盖零点八零。",
      "高斯八十区间覆盖零点八四。",
      "经验分位 QL 是零点零零五五。",
      "常数中位数 QL 是零点零零七五。",
      "分位数预测更好。",
      "交叉率是零。",
      "高斯 NLL 是负三点一三六九。",
      "这不是 bug。",
      "连续密度可以大于一。",
      "所以负对数可以是负数。",
      "证据里专门解释了这一点。",
      "再看拟合轨迹。",
      "两百步时损失还有二点一。",
      "两千步收敛到一点七七四。",
      "梯度最大误差二乘十的负九次方。",
      "这个精度足够。",
      "检查只能证明实现和定义一致。",
      "不能证明模型有用。",
      "这就是边界。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "五条边界，一条勘误",
    goal: "不假装做过的事",
    lines: [
      "边界有五条。",
      "第一条，没有训练预测头。",
      "损失函数验证了。",
      "但没有接回模型做端到端训练。",
      "所以不报预测精度。",
      "第二条，只有一个标的。",
      "六百五十九，二百四十天。",
      "换市场换标的，结论要重验。",
      "第三条，高斯假设太强。",
      "真实收益有肥尾。",
      "八十区间覆盖零点八四。",
      "看起来还行，但尾部不够。",
      "第四条，书里的常数问题。",
      "式三·三零少二分之一 log 二 pi。",
      "式三·四二没有系数二。",
      "计划书的手算值也错了。",
      "都记在勘误 E37。",
      "第五条，brief 里的数字。",
      "一点七六五五一二。",
      "这个数是错的。",
      "正确书版是一点一九三一四七。",
      "标准版是二点一一二零八六。",
      "我们不沿用错数。",
      "还有一条关于负 NLL。",
      "负值不是错误。",
      "是连续密度的正常现象。",
      "两个 commit 号也说明一下。",
      "算法提交 eb61a30。",
      "证据提交 f46bdca。",
      "两个号不同不是笔误。",
      "A7 算法卡仍然欠着。",
      "留到 W 阶段统一补。",
      "演示 CLI 也还在规划中。",
      "这两项不假装完成。",
      "都说清了才敢说 ready。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "下一集，CRPS",
    lines: [
      "三句话带走。",
      "高斯 NLL 学均值和尺度。",
      "别忘了二分之一 log 二 pi。",
      "分位数损失不对称。",
      "tau 零点九时，低估罚九倍。",
      "QL 指标按书口径没有系数二。",
      "tau 零点五时是半个 MAE。",
      "验证的关键是对口径。",
      "书里的式子、brief 的数字。",
      "都要逐条对过才敢用。",
      "这一集最值钱的不是公式。",
      "是三个被抓住的口径错误。",
      "下一集讲 CRPS。",
      "把整个分布拿来打分。",
      "下一集再见。",
      "就讲到这里。",
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
