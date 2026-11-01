/**
 * 《概率生成补集：Copula、扩散损失、连续流》—— 第 3 章 · 序列模型。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-29-prob-copula-ddpm-flow/voice.json";

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
    kicker: "第 3 章 / 序列模型 · 第二十九集",
    title: "概率生成补集",
    goal: "三种搬法 · 一分布",
    lines: [
      "第三篇章，第二十九集。",
      "前两集在处理轴。",
      "先压时间轴，再切通道轴。",
      "这一集处理分布。",
      "概率生成有三条路。",
      "Copula，扩散损失，连续流。",
      "看上去是三件事。",
      "其实是同一件事。",
      "把简单随机源，搬成目标分布。",
      "Copula 用秩变换搬边缘。",
      "扩散用一千步加噪，再退火。",
      "连续流用可逆映射，搬整条密度。",
      "三个模块，本集都实现。",
      "而且都测过了。",
      "二十四个检查点，全部通过。",
      "断言九十九套，一千三百七十一条。",
      "屏幕上会有三个数。",
      "第一个，三分之一。",
      "高斯 Copula 的闭式值。",
      "ρ 等于零点五的时候。",
      "书里的计划，写零点五八三三三三。",
      "那个值违反上界。",
      "上界是二分之一。",
      "正确值是三分之一。",
      "这件事，我们钉进了测试。",
      "第二个数，一点四一四二一四。",
      "扩散前向，t 等于五百时的 x_t。",
      "第三个数，零点六九三一四七。",
      "仿射流的对数行列式，就是 log 2。",
      "三个数，三条证据链。",
      "先说为什么需要它们。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "边缘对了，联合不一定对",
    goal: "预测要交付整条分布",
    lines: [
      "先说问题本身。",
      "序列模型通常给的是点预测。",
      "或者几个分位数。",
      "CRPS 和 PICP，评的都是边缘。",
      "边缘对了，联合不一定对。",
      "两个变量都是标准正态。",
      "相关系数零点九的时候，联合分布完全不同。",
      "要交付的，是整条联合分布。",
      "真实面板给了一个例子。",
      "八个通道，两千六百五十七个交易日。",
      "一千个窗口，每个九十六步。",
      "同组相关的均值是零点六七六。",
      "跨组是零点三八五。",
      "差值零点二九。",
      "看起来行业结构很清楚。",
      "换一个口径再看。",
      "把窗长缩到九十六步以内。",
      "同组零点六九九。",
      "跨组零点五五二。",
      "差值只剩零点一五。",
      "同一个面板，同一批通道。",
      "窗长一变，结论减半。",
      "所以问题不是有没有行业。",
      "问题是联合分布怎么估。",
      "三种生成式做法，各搬一种东西。",
      "也都各留一笔账。",
      "往下看定义。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三种生成器，三个接口",
    goal: "Copula · 扩散 · 连续流",
    lines: [
      "定义一，Copula。",
      "先把每条通道拉到零到一。",
      "用经验分布做概率积分变换。",
      "u 是平均秩除以样本数。",
      "再拉进高斯空间。",
      "z 等于 Φ 逆 u。",
      "联合分布写成 Φ_Σ。",
      "Σ 是相关矩阵。",
      "边缘用经验分布，不用高斯假设。",
      "这是 Copula 和直接多元高斯的唯一差别。",
      "定义二，扩散损失。",
      "前向是马尔可夫链。",
      "x_t 等于根号 ᾱ_t 乘 x0，加根号一减 ᾱ_t 乘 ε。",
      "训练目标是预测噪声。",
      "损失是 ε 与 ε_θ 的差的平方。",
      "时间步必须编码进模型。",
      "不然只学得到一个平均噪声水平。",
      "定义三，连续归一化流。",
      "dz 比 dt，等于 f(z,t)。",
      "密度用迹积分搬。",
      "log p 等于 log p(z)，减去积分项。",
      "仿射流的对数行列式，是 Σ log 绝对值 s。",
      "三条定义，三个接口。",
      "原文都只有一句。",
      "书里 p.67 到 p.68，只点名。",
      "公式是标准结果，文献待核。",
      "所以口径要自己钉死。",
      "Copula 的边缘做经验 CDF。",
      "正态分数裁到 1e-6。",
      "相关矩阵加 1e-6 抖动。",
      "扩散用线性 beta，从 1e-4 到 0.02。",
      "T 等于一千，d 等于三十二。",
      "流用两层仿射，softplus 保正。",
      "RK4，二十步，d 等于八。",
      "三个实现，三个测试文件。",
      "二十二条，二十一条，十五条。",
      "加起来五十八条新断言。",
      "全仓一千三百七十一条，零失败。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "同一个随机源，三种搬法",
    goal: "一步搬不完，就一千步",
    lines: [
      "先给一层直觉。",
      "三种做法都在搬同一个东西。",
      "从一个简单随机源开始。",
      "标准正态，最简单。",
      "Copula 的搬法是三段。",
      "原空间，均匀空间，高斯空间。",
      "散点变形三次。",
      "秩变换把边缘压平。",
      "相关矩阵把散点拉成椭圆。",
      "再逆变换，回到原空间。",
      "扩散的搬法是一千步。",
      "ᾱ_t 从一衰减到零。",
      "t 等于五百时，ᾱ 是零点零七八六。",
      "t 等于一千时，是四乘十的负五次方。",
      "信号项越来越小。",
      "噪声项越来越大。",
      "训练时只学一件事。",
      "给定噪声输入，预测噪声。",
      "推理时反过来。",
      "从纯噪声开始退火。",
      "连续流是第三段。",
      "不迭代，解一个常微分方程。",
      "可逆，所以密度能算。",
      "同维数，双向映射。",
      "三个搬法，一个共同点。",
      "都不直接拟合密度。",
      "都从简单源出发。",
      "一步搬不完的，用一千步。",
      "一千步也不行的，用可逆映射。",
      "代价依次上升。",
      "Copula 最便宜。",
      "扩散最费算力。",
      "连续流居中。",
      "本集不训练预测器。",
      "只把三种搬法，各实现一遍。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "四个坑，都是静默错误",
    goal: "Copula.hs · DdpmLoss.hs · Cnf.hs",
    lines: [
      "实现，四个坑。",
      "第一个坑，在扩散的梯度。",
      "损失下降得很正常。",
      "但梯度是转置的。",
      "写成 k j，应该是 j k。",
      "loss 一直降，没人看得出来。",
      "发现靠两件事。",
      "固定 seed，两次逐位相等。",
      "和有限差分对不上。",
      "改回 jt k，等于 Σ resid_j 乘 x_t,k。",
      "第二个坑，在 RK4 的系数。",
      "第一版写成 k3 加两倍 k4，除以六。",
      "对称性没错。",
      "但不再是四阶。",
      "步数减半，误差只降两倍。",
      "改成 k1 加两倍 k2，加两倍 k3 加 k4。",
      "比值变成十六点八九。",
      "理论是十六。",
      "第三个坑，在矩阵指数。",
      "scaling 加 squaring 的泰勒项。",
      "除以固定 n，而不是当前阶 k。",
      "二乘二的例子上就偏了。",
      "改成除以 k 之后，对上解析解。",
      "第四个坑，在 PIT。",
      "均匀分布取 Φ 逆，端点会发散。",
      "u 等于零和一，都不能碰。",
      "裁到 1e-6 到 1 减 1e-6。",
      "相关矩阵必须加抖动。",
      "不加，Cholesky 直接崩。",
      "崩出来是 NaN，不是报错。",
      "四个坑，三种表现。",
      "都是静默错误。",
      "所以每条都配了测试。",
      "梯度有有限差分对照。",
      "RK4 有误差比区间。",
      "矩阵指数有解析解。",
      "PIT 有 KS 统计量。",
      "时间步也是可复现的。",
      "t 等于一加 floor(u 乘 T 减一)。",
      "u 来自 seed 加十七。",
      "同一个 seed，t 和 ε 都一样。",
      "所以同 seed 损失，逐位相等。",
      "这不是巧合，是设计。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "二十四个检查点，零失败",
    goal: "合成读数与真实面板",
    lines: [
      "验证放在第三层。",
      "二十四个检查点，全部通过。",
      "跑了八点七秒。",
      "先看 Copula。",
      "PIT 的 KS 距离，零点零一零五。",
      "阈值是零点零六。",
      "独立退化，秩相关零点零零三五。",
      "皮尔逊零点零零六二。",
      "闭式值是三分之一。",
      "计划里那个零点五八三三三三。",
      "写成了一条失败断言。",
      "抽样来回，误差零点零一四二。",
      "拟合误差零点零五二五。",
      "再看真实面板。",
      "八乘八的秩相关矩阵。",
      "白酒三只，亮成一块。",
      "银行三只，一块。",
      "指数两只，一块。",
      "块结构，肉眼可见。",
      "然后看扩散。",
      "前向闭式，一点四一四二一四。",
      "刚好是根号二。",
      "完美去噪器，损失零。",
      "零去噪器，损失一。",
      "同 seed 两次，零点九五八八八三五。",
      "换 seed，一点一零二五二七五五。",
      "训练四百步，零点九九八六到零点七六四九。",
      "二十条 DDIM 路径，全部有限。",
      "最后看连续流。",
      "仿射对数行列式，零点六九三一四七。",
      "三层流往返误差，二点二二乘十的负十六次方。",
      "一维高斯积分，一点零零零零。",
      "RK4 误差比，十六点八八九。",
      "主成分解释率，零点七九五三。",
      "特征值五点一二七和一点二三五。",
      "密度网格四十一乘四十一。",
      "网格全部有限。",
      "三个模块，三条证据链。",
      "数据来自同一个面板。",
      "两千六百五十七个交易日。",
      "一千个窗口。",
      "三份 evidence JSON，落盘。",
      "summary 里是二十四项检查。",
      "每一项都能重跑。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "四条边界，三笔债",
    goal: "哪些话不能说",
    lines: [
      "边界，四条。",
      "第一，没有训练成预测器。",
      "Copula 用经验边缘。",
      "扩散只训了四百步。",
      "连续流是小维度小场。",
      "所以本集不报生成质量。",
      "不报 FID，不报 CRPS。",
      "第二，DDIM 的二十条路径。",
      "样本标准差六十二点七。",
      "数据标准差二点三。",
      "均值差十二点四六。",
      "标准差比六十四点八七。",
      "这个配置不构成生成声明。",
      "只验证损失与可复现。",
      "第三，行业结构随窗长变。",
      "整段差值零点二九。",
      "窗口内差值零点一五。",
      "所以行业在哪，不能从单一窗长下结论。",
      "相关，也不等于因果。",
      "第四，原文缺口。",
      "书里只有点名，没有公式。",
      "文献编号，要回 PDF 核。",
      "计划里的闭式值，也写错了。",
      "我们双登记，画面同时给两个数。",
      "三笔债，写在账上。",
      "算法卡没写。",
      "demo 子命令没做。",
      "端到端训练没做。",
      "三笔都记在账上。",
      "但没有影响本集的交付。",
      "所以这一集，仍算 ready。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "搬分布的三条路",
    lines: [
      "三句话带走。",
      "生成式概率预测，都在搬分布。",
      "Copula 搬边缘，扩散搬噪声，流搬密度。",
      "第一条，简单随机源是共同起点。",
      "第二条，闭式值要自己验。",
      "书里的零点五八三三三三，是错的。",
      "正确值是三分之一。",
      "第三条，静默错误比崩溃更贵。",
      "转置的梯度，除以错的泰勒项。",
      "都写得像对的。",
      "下一集，异常检测的地基。",
      "窗口，指标，评分。",
      "同一组输出，三种口径。",
      "F1 的排序会翻转。",
      "第 29 集，完。",
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

