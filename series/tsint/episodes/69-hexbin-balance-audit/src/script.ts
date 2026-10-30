/**
 * 《你的基准数据集均衡吗：PCA 投影 + Hexbin 密度图》—— 第 8 章 · 评估层。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-69-hexbin-balance-audit/voice.json";

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
    kicker: "第 8 章 / 评估层",
    title: "前 20% 的格子，装下 92%",
    goal: "五万个窗口，先数格子再谈精度",
    lines: [
      "这一集做一个体检。",
      "体检对象，是一份基准数据集。",
      "问题只有一句话：它均衡吗？",
      "数据是二十只 A 股，十年日线。",
      "五万零七百五十七行。",
      "从二零一五年一月五日。",
      "到二零二五年十二月三十一日。",
      "最长的一只，两千六百多个交易日。",
      "用三十二个日收益做一个窗口。",
      "一天一天往后滑。",
      "一共五万零一百一十七个窗口。",
      "每个窗口压成两个数。",
      "一个是平均日收益。",
      "一个是日收益的波动。",
      "把五万个点画到平面上。",
      "再盖上六边形格子，数人头。",
      "三百三十三个格子被用到。",
      "前百分之二十，是六十七个格子。",
      "这六十七个格子装了多少样本？",
      "百分之九十二点零四。",
      "最大的一个格子，装了两千五百八十三个窗口。",
      "占全部样本的百分之五点一五。",
      "换三只大盘蓝筹来看。",
      "七千九百二十一个窗口。",
      "集中度百分之七十点零九。",
      "书里的评估章，从数据切分讲起。",
      "网格化密度图本身不新。",
      "但很少有人真的把集中度算一遍。",
      "这一集把三件事做完整。",
      "投影、数格子、算出可复核的集中度。",
      "二十三条断言，十二条证据检查。",
      "所有数字都进 git。",
      "先记住三个数。",
      "五万零一百一十七个窗口。",
      "三百三十三个格子。",
      "百分之九十二点零四。"
    ]
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 一件真事",
    title: "不均衡的基准，撑不起 SOTA",
    goal: "九成样本挤在少数格子里",
    lines: [
      "先说为什么均衡重要。",
      "模型在全量数据上算一个总误差。",
      "总误差是平均，平均会藏东西。",
      "如果九成样本挤在少数格子里。",
      "那么总误差主要由这些格子决定。",
      "稀疏格子里的失败，权重很小。",
      "但真实世界恰恰是稀疏区更危险。",
      "极端行情、极端波动，都在尾部。",
      "所以基准的均衡性，决定了结论的适用范围。",
      "看这两组数。",
      "二十只股票，集中度九成二。",
      "三只蓝筹，集中度七成。",
      "蓝筹更集中，因为它们更像彼此。",
      "这不是数据错误，是真实的分布形态。",
      "但拿它当基准，覆盖就有限。",
      "稀疏的格子里，样本只有个位数。",
      "一个模型在这些格子上错得很离谱。",
      "总误差也未必看得出来。",
      "所以需要一个可量化的判据。",
      "本集用的判据，是集中度。",
      "前百分之二十的占用格子。",
      "承载的样本占比。",
      "超过百分之六十，记为不均衡。",
      "这个阈值是本仓约定。",
      "书里没有给数字，只给了图形判读。",
      "这本书在二百零二页讲评估设置。",
      "二百零五页开始讲评估指标。",
      "数据层体检，是评估之前的评估。",
      "数据不均衡，后面的指标都要打折扣。",
      "先看数据怎么变成窗口。"
    ]
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "一个窗口，两个数，三行公式",
    goal: "从三十二天到一个点",
    lines: [
      "定义从窗口开始。",
      "一个窗口，取连续三十二个日收益。",
      "需要三十三个收盘价，才算得出来。",
      "每只股票两千六百多个交易日。",
      "去掉头尾不够一个窗口的部分。",
      "每只股票，一千二百到两千六百个窗口。",
      "二十只加起来，五万零一百一十七个。",
      "每个窗口压成两个数。",
      "第一个是均值，记作 μ。",
      "第二个是波动，记作 σ。",
      "波动用总体标准差。",
      "除以三十二，不是三十一。",
      "因为我们要的是这一段窗口的描述统计。",
      "这两个数，就是平面的横纵坐标。",
      "但两者的量级差很多。",
      "均值大约万分之五。",
      "波动大约百分之二。",
      "不标准化，第一主成分只会是波动。",
      "所以逐维做 z-score。",
      "减均值，再除以标准差。",
      "标准化之后，协方差矩阵对角都是 1。",
      "只剩一个相关系数 b。",
      "二维有闭式解。",
      "特征值是一加减 b 的绝对值。",
      "本数据 b 等于零点零七四四。",
      "于是 λ1 等于一点零七四四。",
      "λ2 等于零点九二五六。",
      "两个特征值加起来，正好是二。",
      "特征向量是四十五度。",
      "第一主成分，就是均值加波动，除以根号二。",
      "这不是巧合。",
      "对角相等时，特征向量与 b 无关。",
      "投影之后再反变换，误差是二点七八乘十的负十七次方。",
      "下一个问题，怎么数格子。"
    ]
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 看图",
    title: "图上每一格，都是一群窗口",
    goal: "密度图的读法",
    lines: [
      "六边形分箱，和方格不同。",
      "方格有四个邻居，六边形有六个。",
      "六边形更接近圆，方向偏差更小。",
      "坐标用轴向整数对。",
      "列是 col，行是 row。",
      "中心横坐标，等于 s 乘 col，再加半行的偏移。",
      "中心纵坐标，等于 s 乘二分之根号三，再乘 row。",
      "反过来，给一个点找格子。",
      "先按纵坐标算出 row。",
      "再按横坐标和行偏移算出 col。",
      "两次 round，就近取整。",
      "再加一个极小数，削掉浮点噪声。",
      "s 由网格数决定。",
      "三十乘三十时，s 是最大值除以三十。",
      "本数据里，s 大约千分之三。",
      "图上每个六边形，就是一群窗口。",
      "颜色越暖，样本越多。",
      "密集区在均值零附近。",
      "波动在百分之二左右。",
      "越往外越稀。",
      "边缘的格子，只有个位数样本。",
      "图形还略微向右上倾斜。",
      "高波动的窗口，均值也略高。",
      "相关系数是正的，零点零七四四。",
      "换网格尺寸会怎样？",
      "十五、二十、三十、四十、六十。",
      "集中度依次是：",
      "零点九二一三。",
      "零点九二〇二。",
      "零点九二〇四。",
      "零点九〇二四。",
      "零点八六二三。",
      "从十五到三十，几乎不变。",
      "到六十才降到零点八六。",
      "说明九成二不是画法造成的。",
      "但格子越细，尾部越容易漏。",
      "占用格子从一百零二，涨到九百五十一。",
      "所以报集中度，必须同时报网格尺寸。",
      "现在看实现。"
    ]
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "一百九十行，四个函数",
    goal: "不需要 LAPACK 的 2x2",
    lines: [
      "模块在 TsBase 的第八章。",
      "名字叫 HexbinBalance。",
      "核心只有四个函数。",
      "pca2 算均值、标准差、旋转和特征值。",
      "project2 和 reconstruct2 做投影与反变换。",
      "binOf 和 hexCenter 做分箱与格心。",
      "concentration 算集中度。",
      "先看 pca2。",
      "两遍扫描。",
      "第一遍算均值和标准差。",
      "第二遍算相关系数 b。",
      "特征值是一加减 b 的绝对值。",
      "旋转角固定四十五度。",
      "不用调线性代数库。",
      "二乘二的手写解，二十二行。",
      "精度足够：反变换误差十的负十七次方。",
      "再看 binOf。",
      "先算 row，再算 col。",
      "两个 round，就近取整。",
      "中心公式和分箱公式互为逆。",
      "二十三条断言里，有一条就是全部占用格子互逆。",
      "计数用 Data.Map.Strict。",
      "稀疏整数映射，按 key 排序，可审计。",
      "这是本仓第一次引入 containers。",
      "复杂度是线性的。",
      "每个窗口一次分箱，五万个窗口不到一秒。",
      "断言一共二十三条。",
      "四个格心，落四个格子。",
      "九加一，集中度是零点九。",
      "十个均匀格子，集中度是零点二。",
      "平移之后，集中度不变。",
      "完全相关时，λ1 等于二，λ2 等于零。",
      "常量列不产生 NaN。",
      "输入 NaN 必须报错。",
      "证据生成器调用同一批函数。",
      "屏幕上的数，和测试里的数是同一个来源。",
      "这就是可复核。",
      "下面看数字。"
    ]
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 数字",
    title: "二十三个断言，十二条检查",
    goal: "每个数都能回到一条断言",
    lines: [
      "左边，是数据体检。",
      "五万零七百五十七行原始数据。",
      "二十只股票，窗口一千二百到两千六百。",
      "五万零一百一十七个窗口。",
      "三百三十三个占用格子。",
      "六十七个格子，承载九成二。",
      "最大格子两千五百八十三个样本。",
      "占全部样本的百分之五点一五。",
      "反变换最大误差，二点七八乘十的负十七次方。",
      "特征值之和，二点零零零零。",
      "三只蓝筹：七千九百二十一个窗口。",
      "三百一十九个格子，集中度七成零一。",
      "右边，是网格敏感度。",
      "五个尺寸，集中度从零点九二一到零点八六二。",
      "每个尺寸的占用格子也报出来。",
      "十二条证据检查，全部通过。",
      "二十三条断言，来自测试套件。",
      "总套件三百三十一条。",
      "证据 JSON 记录了输入的 sha256。",
      "数据文件的哈希，和证据一致。",
      "复现命令只有一行。",
      "运行证据生成器，重算全部数字。",
      "如果数据被改动，哈希对不上。",
      "证据就作废。",
      "版本也写进证据：GHC 九点一四，cabal 三点一六。",
      "提交哈希写在 JSON 里。",
      "所以每个数字，都能追到一次具体的运行。",
      "这是 A 级证据的要求。",
      "断言不是装饰。",
      "它是数字的身份证。",
      "下面说边界。"
    ]
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "七条不能说的话",
    goal: "哪些结论成立，哪些不成立",
    lines: [
      "第一条，阈值是我们定的。",
      "百分之六十不是书里的数字。",
      "书里只给了密度图的读法。",
      "换阈值，结论会变。",
      "第二条，集中度高不等于数据坏。",
      "真实分布本来就常常集中。",
      "要看任务是否需要尾部覆盖。",
      "第三条，二维窗口丢了内部形状。",
      "三十二天里的路径、极值、顺序，全被压成两个数。",
      "同均值同波动的两个窗口，可能完全不同。",
      "第四条，二十只股票不是全市场。",
      "蓝筹又只代表大盘。",
      "结论不能推到小盘和别的市场。",
      "第五条，网格尺寸会改变分母。",
      "本集固定三十乘三十，并给出敏感度。",
      "第六条，集中度不是唯一判据。",
      "还要看任务误差、覆盖度和时间切分。",
      "第七条，不能说 SOTA 无效。",
      "只能说，验证集中在这六十七个格子里。",
      "结论要跟着证据走。",
      "这就是边界。"
    ]
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三个数，一个判据",
    goal: "先体检，再谈分数",
    lines: [
      "回到开头那三个数。",
      "五万零一百一十七个窗口。",
      "三百三十三个格子。",
      "前六十七个格子，装了九成二。",
      "一个判据：前百分之二十的格子，覆盖超过六成。",
      "记为不均衡。",
      "一句话总结。",
      "数据均衡性，是评估之前的第一步。",
      "不均衡的基准，会放大平均误差的错觉。",
      "下一集进入第九章。",
      "一个弹簧振子，用显式欧拉算十个周期。",
      "步长零点一，能量涨了五百一十七倍。",
      "换成 RK4，误差按四阶下降。",
      "那就是数值积分。",
      "这一集的代码、证据、成片。",
      "都在 git 里。",
      "数字可复核，结论有边界。",
      "我们下集见。"
    ]
  }
];

const CPS = 4.5;
const GAP = 0.55;
const LEAD = 1.2;
const TAIL = 2.2;
const MAX_CHARS = 44;
const LINE_PAD = 0.35;
const MIN_LINE = 1.4;

const round2 = (v: number) => Math.round(v * 100) / 100;

const voice = voiceJson as Record<string, number>;

const problems: string[] = [];

type Scene = { id: string; chapter: string; kicker: string; title: string; goal: string; start: number; dur: number };
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
    if (text.length < 8) problems.push(spec.id + "#" + i + " too short: " + text.length + " chars");
    const cps = text.length / d;
    if (measured && (cps < 3.4 || cps > 9.2)) problems.push(spec.id + "#" + i + " cps " + cps.toFixed(2));
  });
  const total = speech.reduce((a, b) => a + b, 0) + GAP * Math.max(0, speech.length - 1);
  const dur = round2(LEAD + total + TAIL);
  let t = sceneStart + LEAD;
  spec.lines.forEach((text, i) => {
    LINES.push({ scene: spec.id, index: i, start: round2(t), dur: round2(speech[i]), speech: text });
    t += speech[i] + GAP;
  });
  SCENES.push({ id: spec.id, chapter: spec.chapter, kicker: spec.kicker, title: spec.title, goal: spec.goal, start: round2(sceneStart), dur });
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
