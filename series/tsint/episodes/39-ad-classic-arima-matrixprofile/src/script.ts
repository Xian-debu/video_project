/**
 * 《残差与邻居：ARIMA 残差检测与 Matrix Profile discord》—— 第 4 章 · 异常检测 · 第 39 集。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 voice.json 的实测值。
 */
import voiceJson from "../../data/tsint-39-ad-classic-arima-matrixprofile/voice.json";

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
    kicker: "第 4 章 / 异常检测 · 第三十九集",
    title: "残差与邻居：ARIMA 残差检测与 Matrix Profile discord",
    goal: "残差 · 距离 · 停牌",
    pages: [0, 12, 24],
    lines: [
      "上一集把十二只票画成一张图。",
      "结构学到了，读数没接上。",
      "这一集退回去，看两种经典写法。",
      "一个看残差，一个看邻居。",
      "ARIMA：模型解释不了的，当异常。",
      "残差大，就是异常。",
      "Matrix Profile：找不到相似邻居的，当异常。",
      "邻居远，就是异常。",
      "两句定义，书里各一句话。",
      "没有公式，也没有超参数。",
      "我们把公式补上，标「非书中」。",
      "先给结论：两个都不好看。",
      "ARIMA 原始 F1 零点一二。",
      "精确率零点九六，召回零点零六五。",
      "它抓住四十三个点，漏掉六百一十八个。",
      "Matrix Profile 一次都没报警。",
      "F1 是零，召回也是零。",
      "但点级调整后，ARIMA 到零点九九八。",
      "这个数字很好听，也很危险。",
      "规则是：一个真值段里报过一次警，整段都算命中。",
      "停牌对照两百四十天，两个都露馅。",
      "ARIMA 一天都不报，MP 报四十二天。",
      "三个问题：残差怎么定义。",
      "邻居怎么定义。",
      "停牌为什么把两个都打穿。",
      "数据是茅台一只票。",
      "三千九百九十六行，一零年到二六年。",
      "训练两千六百六十七个收益。",
      "测试一千三百二十八个。",
      "注入二十段尖峰、二十段相位。",
      "真值六百六十一点，占测试段一半。",
      "加了二百四十天停牌，当对照。",
      "四十九项检查，三秒三跑完。",
      "八页，从问题开始。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "两个定义，一句书，零个公式",
    goal: "残差 · 最近邻距离 · 阈值",
    pages: [0, 12, 24],
    lines: [
      "先说清楚，残差为什么能当异常分数。",
      "任何预测模型都能这么用。",
      "拿模型预测下一天，再减掉真实值。",
      "差得越大，越异常。",
      "书里就是这么一句。",
      "但残差有个隐藏前提。",
      "模型的误差要在整段上可比。",
      "波动大的年份，误差天然大。",
      "不标准化，阈值就跟着波动走。",
      "所以分数写成残差除以训练段标准差。",
      "第二个前提：模型别把异常学进去。",
      "拟合得越乖，越容易吃掉尖峰。",
      "邻居的定义更直接。",
      "取一个长度一百的子序列。",
      "找整段里最像它的另一段。",
      "像不像，用 z 归一化欧氏距离。",
      "距离越大，越没有同伴。",
      "没有同伴的子序列，叫 discord。",
      "书里就这一个词。",
      "三个隐含选择，书没写。",
      "窗口多长。",
      "多近的邻居算「自己」，要排除。",
      "子序列分数怎么落到某一天。",
      "这三个选择，后面都会咬人。",
      "再看数据。",
      "茅台的复权收盘，一零年到二六年。",
      "三千九百九十六行，最大间隔十一天。",
      "训练到二零二零年底，测试之后。",
      "测试从二一年一月四日开始。",
      "二十段尖峰，单点或连续三点，五到十个标准差。",
      "二十段相位，把六十点窗口前后两半对调。",
      "真值共六百六十一点，占测试段四成九。",
      "再加二百四十天收益置零，模拟停牌。",
      "这段停牌，是这一集的判官。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "一条残差，一条最近邻",
    goal: "式(4.41) · 式(4.42) · 数值四条",
    pages: [0, 10, 20, 32, 42],
    lines: [
      "先写 ARIMA，式(4.41) 的位置。",
      "非书中：书只写了「ARIMA」三个字母。",
      "phi(B) 乘 (1-B) 的 d 次方，再乘 y_t。",
      "等于 c 加 theta(B) 乘 eps_t。",
      "B 是滞后算子，eps 是白噪声。",
      "d 是差分阶数，把趋势磨平。",
      "残差从拟合里递推出来。",
      "分数取绝对值，除以训练段 sigma。",
      "阶数怎么定：AIC 网格。",
      "p 从零到三，d 取零或一，q 从零到二。",
      "最后选中的是 ARIMA(0,0,2)。",
      "两阶移动平均，没有自回归项。",
      "为什么不是 ARIMA(1,0,1)。",
      "AIC 差在这里很小，选谁都能跑。",
      "我们固定这套选择，不再调。",
      "参数一共四个：c、两个 theta、sigma。",
      "c 是漂移，theta 是移动平均。",
      "拟合分两步，叫 Hannan-Rissanen。",
      "第一步：先拟合一个高阶 AR。",
      "拿它的残差，当 MA 项的替身。",
      "第二步：把 y 的滞后和残差滞后拼起来。",
      "做一次最小二乘，解出 phi、theta、c。",
      "最小二乘用 Householder QR，手写。",
      "因为环境里没有 LAPACK。",
      "AR 那一步用 Levinson-Durbin 递推。",
      "复杂度是阶数的平方，不解矩阵。",
      "两步法不是最优，但足够稳。",
      "真实数据上，它的 theta 会越界。",
      "这个坑后面专门讲。",
      "再写 Matrix Profile。",
      "非书中：书只有一句「全局最近邻距离」。",
      "P(i) 等于 i 之外所有子序列的距离最小值。",
      "排除区里的子序列不算。",
      "距离用 z 归一化欧氏距离。",
      "式(4.42) 的写法是平方展开。",
      "两段的点积，减均值乘积，再除标准差。",
      "外面乘二 m 的一减。",
      "这一展开把复杂度从三次降到平方。",
      "三个选择，我们这样定。",
      "窗口一百，排除区二十五，取前五名。",
      "数值四条，先钉住。",
      "第一，常数段的标准差是零。",
      "零方差除零，会出 NaN。",
      "所以常数子序列的距离记为正无穷，跳过。",
      "第二，排除区不能省。",
      "省了，最近的邻居就是它自己。",
      "每个距离都是零，profile 全灭。",
      "排除区取窗口的四分之一。",
      "第三，前缀和算方差会消去。",
      "常值段上，均方减平方均值会掉到噪声里。",
      "这也是仿射不变性只在有限距离上成立的原因。",
      "第四，子序列分数怎么变成日分数。",
      "一个点被多个窗口覆盖，取最小距离。",
      "取最小，就是「最像它的邻居有多近」。",
      "一个靠拟合，一个靠距离。",
      "两条完全不同的问题路径。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "残差抓点，距离抓形",
    goal: "逐日分数 · 前五名 discord · 停牌",
    pages: [0, 12, 24],
    lines: [
      "先看 ARIMA 在测试段的分数。",
      "一千三百二十八个点，干净日中位零点零九。",
      "阈值三点零六，画成一条虚线。",
      "绝大多数点趴在阈值下面。",
      "尖峰注入的地方，分数跳起来。",
      "最高十点四，三倍于阈值。",
      "四十五个点过线，报警四十五天。",
      "四十个尖峰点，一个不落。",
      "再加三个相位点，两个误报。",
      "精确率零点九六，这是它唯一好看的数。",
      "但真值有六百六十一点。",
      "召回只有零点零六五。",
      "它只认得「点」上的异常。",
      "再看 Matrix Profile。",
      "测试段干净日中位六点八六。",
      "阈值十一点四，训练段九十九分位。",
      "评估段最大值十一点零二。",
      "离阈值还差零点三八。",
      "一个都没过线，报警是零。",
      "两个 F1 都不到零点一三。",
      "为什么最大的 discord 不是异常。",
      "前五名在第三十四、九百零七、第六段。",
      "这些位置没有注入。",
      "它们是行情自己的重复结构。",
      "停牌段更有意思。",
      "二百四十天收益置零，价格走成一条直线。",
      "ARIMA 的残差在这里是零。",
      "零除 sigma，分数还是零。",
      "它一天都不报警。",
      "Matrix Profile 的距离是无穷。",
      "无穷大于阈值，严格口径报四十二天。",
      "把无穷改成零的宽松口径，报零天。",
      "同一段停牌，两种极端。",
      "这就是两个方法的边界。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "两个文件，四百六十七行",
    goal: "Householder · Levinson-Durbin · 前缀和",
    pages: [0, 10, 20, 32],
    lines: [
      "模块在 Ch04 下，两个文件。",
      "ARIMA.hs 三百三十八行，十个单测。",
      "MatrixProfile.hs 一百二十九行，八个单测。",
      "合计四百六十七行，十八个测试。",
      "全部纯函数，没有随机数。",
      "种子只决定注入落在哪。",
      "三个难点，都用递推替代库。",
      "Householder QR 解最小二乘。",
      "Levinson-Durbin 递推 AR 系数。",
      "前缀和加对角递推，算完全部距离。",
      "签名很短。",
      "arimaResidualScore 收阶数和序列。",
      "返回逐点分数。",
      "matrixProfile 收窗口和排除区。",
      "返回长度 n 减 m 加一的 profile。",
      "两个都是纯函数，可逐位复现。",
      "没有梯度，只有递推。",
      "顺序固定，同种子逐位相同。",
      "第一个坑：theta 越界，残差发散。",
      "Hannan-Rissanen 解出的 theta 可能不可逆。",
      "递推一步就冲到无穷。",
      "实测两千六百六十七个残差，一千九百一十二个是无穷。",
      "修法：theta 夹到正负零点九八。",
      "phi 夹到正负零点九九。",
      "非有限值一律写零。",
      "第二个坑：排除区。",
      "省掉它，每个窗口最近的邻居是自己。",
      "距离全零，分数全零。",
      "第三个坑：点级调整会把读数吹起来。",
      "规则是：一个真值段里只要报过一次警。",
      "整段都算命中。",
      "ARIMA 的四十三个命中，摊成六百六十一点。",
      "F1 从零点一二跳到零点九九八。",
      "这不是模型变好，是口径变宽。",
      "所以这一集同时报两个数。",
      "一个严，一个宽。",
      "宽的只用来对照。",
      "严的才算结论。",
      "两条命令可以复现全部数字。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "两个基线，两种失败",
    goal: "661 点真值 · 49 项检查",
    pages: [0, 12, 24, 38, 50, 60],
    lines: [
      "先对口径，再读数。",
      "一只票，日频，复权收盘。",
      "训练二零一零到二零二零，测试之后。",
      "最大间隔十一天，中间没有停牌缺口。",
      "ARIMA 用对数收益，不用价格。",
      "价格是非平稳的，收益才近似平稳。",
      "差分阶数最后选在零。",
      "Matrix Profile 也用同一份收益。",
      "两个模型吃同一段测试，同一套真值。",
      "阈值都取训练段九十九分位。",
      "测试段一个数都不进阈值。",
      "停牌对照二百四十天，不参与调参。",
      "第一个读数：ARIMA(0,0,2)。",
      "AIC 负两万一千零二十三。",
      "sigma 零点零一九四，c 零点零零一一。",
      "两个 theta：零点零一四七和负零点零三六六。",
      "阈值三点零六四，F1 零点一二二。",
      "精确率零点九五六，召回零点零六五。",
      "TP 四十三，FP 二，FN 六百一十八。",
      "报警四十五天，占测试段百分之三点七。",
      "第二个读数：Matrix Profile。",
      "窗口一百，排除区二十五。",
      "阈值十一点四零，F1 是零。",
      "一次报警都没有，召回也是零。",
      "ARIMA 为什么只抓点。",
      "尖峰点的分数中位七点五四，过半在阈值上。",
      "相位点的分数中位零点四三。",
      "干净日中位零点零九。",
      "相位点只比干净点高一点。",
      "因为重排一段窗口，不改边际分布。",
      "残差看的是相邻两天的关系。",
      "把窗口前后两半对调，只有接缝变了。",
      "接缝只有两个点，被淹没在六百个点里。",
      "所以召回只有百分之六点五。",
      "这不是实现错，是方法看不见。",
      "MP 为什么也只抓点。",
      "尖峰点的距离中位八点五三。",
      "相位点的距离中位七点八三。",
      "干净日中位六点八六。",
      "三类分不开，阈值一划，全在下面。",
      "窗口一百，比相位的六十点点还长。",
      "一个窗口跨过整个相位段，形状被平均掉。",
      "前五名 discord 里，有两个在热身段。",
      "剩下三个在真实行情里，不是注入。",
      "停牌对照是最干净的对照。",
      "ARIMA 分数最高零点零六八。",
      "阈值三点零六，差五十倍。",
      "残差恒为零，方法静默。",
      "MP 严格口径四十二天报警。",
      "宽松口径零天报警。",
      "两个口径差四十二天，边界就在这里。",
      "常值窗口一百四十一个。",
      "profile 长度一千二百二十九。",
      "四十九项检查，一次跑完，三秒三。",
      "数据六项、收益三项、ARIMA 十一项。",
      "MP 八项、盲区四项、注入五项。",
      "读数八项、类型四项。",
      "三条负向断言也写进证据。",
      "第一：训练残差 ACF 超出白噪声带。",
      "实测零点零八十，带宽零点零三八。",
      "真实收益有自相关，这不是 bug。",
      "第二：仿射变换后有限距离不变。",
      "最大差四点三乘十的负五次方。",
      "第三：F1 不许满分。",
      "四十九项全过，才算这张片子有据。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "两个基线，一条死路",
    goal: "一只票 · 一个市场 · 两种口径",
    pages: [0, 12, 22],
    lines: [
      "不声称的事，先摆出来。",
      "不声称 SOTA。",
      "没有公开基准，只有一只票。",
      "不声称通用。",
      "只验证了 A 股一只白酒股。",
      "换市场、换品种，要重跑。",
      "不声称实时。",
      "批处理，日频，收盘后算。",
      "不声称 MP 更好或更差。",
      "它只是另一种看不见。",
      "不声称停牌结论能推广。",
      "二百四十天是人工构造的极端。",
      "三条债，这一集没还。",
      "第一，阈值仍然不迁移。",
      "训练九十九分位，测试段分布已经变了。",
      "两个方法都栽在同一个地方。",
      "第二，MP 的窗口和排除区是自由参数。",
      "换一个 m，前五名会换人。",
      "第三，点级调整会把读数吹起来。",
      "零点九九八不是检测能力。",
      "下一集换一种关系：两个解码器。",
      "USAD 用对抗训练，一个编码器两个解码器。",
      "DAGMM 用能量分数，在高斯混合里算密度。",
      "再加一个多 AE 中位数，做稳健集成。",
      "三个都不是经典统计。",
      "但它们都要回答同一个问题。",
      "分数在测试段还可比吗。",
      "这一集到这里。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "一集一个读数",
    goal: "两个基线 · 一个结论 · 下一集",
    pages: [0, 12],
    lines: [
      "两个读数，收在一张图上。",
      "ARIMA：F1 零点一二二。",
      "精确率零点九五六，召回零点零六五。",
      "Matrix Profile：F1 零。",
      "一次报警都没有。",
      "书里的判据是「残差或显著偏离」。",
      "实测下来，残差只认点，距离只认形。",
      "点与形都不是异常的全部。",
      "停牌二百四十天，一个静默，一个爆炸。",
      "这就是经典基线的边界。",
      "也是下一集的起点。",
      "这一集的账本。",
      "新增测试十八条，两个模块。",
      "仓库合计一千六百六十三条。",
      "证据检查四十九项，三秒三。",
      "片长十九分钟，全系列第四十九部。",
      "下一集：两个解码器，一个说谎。",
      "USAD、DAGMM、多 AE 中位数。",
      "把分数从「距离」换成「密度」。",
      "这一集到这里，我们下次见。",
    ],
  },
];

/** 分页起点：每页第一句在该场景 lines 里的下标。 */
export const PAGES_INDEX: Record<string, number[]> = {
  open: [0, 4, 12],
  problem: [0, 12, 24],
  definitions: [0, 8, 17, 29, 38],
  intuition: [0, 13, 24],
  implementation: [0, 18, 25, 28],
  verification: [0, 12, 20, 24, 35, 44],
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
