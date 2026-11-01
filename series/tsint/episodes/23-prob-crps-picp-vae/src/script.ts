/**
 * 《概率预测进阶：CRPS、区间覆盖率、VAE 的 ELBO》—— 第 3 章 · 概率与损失。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-23-prob-crps-picp-vae/voice.json";

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
    kicker: "第 3 章 / 概率与损失 · 第二十三集",
    title: "概率预测进阶",
    goal: "CRPS · 区间覆盖率 · VAE 的 ELBO",
    lines: [
      "第三篇章，第二十三集。",
      "上一集讲两个损失，一个指标。",
      "这一集把评分再往前推一步。",
      "上一集的预测，是一个数或一组分位数。",
      "这一集让模型交出一整个分布。",
      "分布怎么打分？用连续排序概率分数。",
      "简称 CRPS，单位跟平均误差一样。",
      "区间报得准不准，用覆盖率 PICP 查。",
      "分布从哪来？生成器可以给一个。",
      "这一集用 VAE 的 ELBO 做例子。",
      "书在印刷版六十八到六十九页。",
      "三件事：CRPS、覆盖率、ELBO。",
      "三个数字要先记住。",
      "零点二三四，是高斯在零点的 CRPS。",
      "一点三零七，是 KL 的手算值。",
      "四十一项证据，全部通过。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "点预测漏掉了什么",
    goal: "对称误差的价格问题",
    lines: [
      "先说点预测的问题。",
      "它只报一个数，误差只按大小算。",
      "低估和高估，罚一样多。",
      "可真实收益，左边尾巴更长。",
      "同样差一块钱，方向不同风险不同。",
      "分布预测要贵一点，也更强。",
      "它报的是整个形状，不只是中心。",
      "形状错了，中心再准也要罚。",
      "CRPS 就是干这个的。",
      "它把预测分布和观测值，积成一个数。",
      "这个数越小，分布越贴近真值。",
      "好消息是，高斯分布有闭式解。",
      "坏消息是，采样估计有偏差。",
      "偏差方向还容易被搞反。",
      "我们的估计，把两两距离也平均进去。",
      "双求和把样本自己和自己，也算了一对。",
      "结果是系统性偏高，不是偏低。",
      "高出的量，是零点五六四除以样本数。",
      "样本十个，偏差就超过五个百分点。",
      "只报估计值，不报样本数，等于没说。",
      "第二个坑，区间覆盖率。",
      "覆盖率就是落在区间里的比例。",
      "听起来简单，边界算不算？",
      "我们定了相对容差，十的负十二次方。",
      "端点算盖住，这是约定，不是对错。",
      "不写清楚，同一组预测能出两个覆盖率。",
      "第三个坑，ELBO 里的 KL。",
      "计划书写了一点八零六八五三。",
      "手算是 1.306853，差在系数。",
      "这三个坑都不报错，只会悄悄换口径。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三种输出，三种价格",
    goal: "分布 · 区间 · 生成器",
    lines: [
      "先把三种输出钉住。",
      "点预测，给一个数。",
      "分位数预测，给 τ 个分位数。",
      "概率预测，给一个分布。",
      "三种输出的错误价格，完全不一样。",
      "点预测用平方误差或绝对误差。",
      "分位数预测用 pinball，上一集讲过。",
      "分布预测用 CRPS，也可以写成积分。",
      "CRPS 的定义，是平方差的积分。",
      "积分里是预测分布函数，减去观测的阶跃。",
      "直观说，就是每个分位数都罚一次。",
      "所以它同时管中心和形状。",
      "高斯的闭式解长这样。",
      "σ 乘 z，再乘两倍分布函数减一。",
      "加两倍密度，再减掉根号派分之一。",
      "当 y 等于 μ，只剩常数。",
      "这个常数是根号派分之一。",
      "约等于零点二三四，是 CRPS 的黄金值。",
      "再看覆盖率。",
      "覆盖率等于盖住的观测，除以总数。",
      "它只能落在 1/n 的栅格上。",
      "二十四个观测，就只能是二十四分之一。",
      "一万个样本盖住 8023 个。",
      "所以覆盖率报 0.8023。",
      "最后是 ELBO。",
      "变分下界等于重建项加 KL。",
      "我们的 loss，是负的 ELBO。",
      "高斯先验下，KL 有闭式。",
      "均值平方，加方差，减一，减对数方差。",
      "手算 μ 等于一、方差等于四。",
      "结果是 1.3068528194。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "为什么分布能赢",
    goal: "误差的价格与形状",
    lines: [
      "直觉上，CRPS 在积分什么？",
      "把分位数损失，按 τ 积起来。",
      "每个 τ 都在罚，权重自动出现。",
      "所以它跟分位数回归是一家人。",
      "但 CRPS 用一个数总结全部 τ。",
      "好处是，能直接和平均误差比。",
      "同一组预测，误差越小，两个数都越小。",
      "但它们的价格不同。",
      "平均误差只看点，CRPS 看整个分布。",
      "所以 CRPS 可以比平均误差更小。",
      "真实数据上，就是这么回事。",
      "八个通道，CRPS 全部低于平均误差。",
      "平均是 0.0096 对 0.0126。",
      "低了大约四分之一。",
      "这点优势从哪来？",
      "从区间的宽度来。",
      "分布敢在窄的地方报窄。",
      "平均误差没有宽度这个概念。",
      "覆盖率的故事正好相反。",
      "覆盖率高的，不一定更好。",
      "名义八成，实际八成五。",
      "为什么偏高？",
      "因为 σ 被尾巴撑大了。",
      "区间宽了，自然盖得多。",
      "这是保守，不是准确。",
      "同一现象上一集也出现过。",
      "那次是八成四，这次八成五。",
      "所以覆盖率必须和宽度一起报。",
      "只报覆盖率，等于只报一半。",
      "VAE 这边，直觉是压缩。",
      "七百六十八维，压到八维。",
      "我们想看看，八维里有没有结构。",
      "结果有一条连续的相关。",
      "潜变量的范数，跟窗口活跃度相关。",
      "相关系数是 0.7807。",
      "但它不是分簇。",
      "只是同一条斜线上，散着走。",
      "所以画面不写自动聚类。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个模块，一个口径",
    goal: "erf · 排序恒等式 · ELBO",
    lines: [
      "实现分三个模块。",
      "Crps，负责分布评分。",
      "Picp，负责覆盖率。",
      "VaeElbo，负责生成器。",
      "都只做纯函数的事。",
      "训练循环留在证据程序里。",
      "先说 CRPS 的第一个麻烦。",
      "高斯闭式解要正态分布函数。",
      "本仓不引数学库，自己写。",
      "小 x 用幂级数，大 x 用连分式。",
      "全区间最大误差，6.8e-15。",
      "比双精度还紧。",
      "第二个麻烦，两两距离求和。",
      "平方复杂度，样本大了就慢。",
      "排序之后就有一行公式。",
      "二乘，指标加权的和。",
      "跟直接式对上，8.17e-16。",
      "第三个麻烦，退化情形。",
      "样本一个，CRPS 就是绝对误差。",
      "样本全相等，也该退化。",
      "这两条都写成断言。",
      "覆盖率的实现最短。",
      "一个容差，一个栅格。",
      "再普通不过。",
      "ELBO 这边，结构是 d 768、h 32、z 8。",
      "参数量 50,768。",
      "训练只有全批量梯度下降。",
      "学习率 0.02，六十轮。",
      "一开始，内存直接爆。",
      "惰性求值把梯度全积起来了。",
      "加了强制求值才跑通。",
      "还有一个真 bug。",
      "梯度里 log 方差那项漏乘了 dz。",
      "症状是四个矩阵偏了三到三成。",
      "定位方法，是退化到一维。",
      "一维时正确值 0.067848。",
      "教训写进交接了。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "四十一项，零失败",
    goal: "五类检查各自的职责",
    lines: [
      "证据程序跑四十一项检查。",
      "数据七项，CRPS 十一项。",
      "覆盖率七项，ELBO 九项。",
      "真实读数七项。",
      "全部通过，耗时七十九秒。",
      "先看数据本身。",
      "面板 2669 行，八列。",
      "起止 2015 到 2025。",
      "窗口一千个，每个 768 维。",
      "先证明输入没被换过。",
      "sha256 跟 manifest 对上。",
      "再看 CRPS 的三方对账。",
      "排序式对直接式，8.17e-16。",
      "两套 CRPS，1.83e-15。",
      "闭式对两万样本，7.05e-4。",
      "黄金值零点二三四。",
      "分布函数在 1.6449 处等于 0.95。",
      "erfc(3) 相对误差 3e-10。",
      "然后是偏差实测。",
      "样本十个，一千个种子平均。",
      "偏差 0.0541，理论 0.0564。",
      "样本三十，0.0184 对 0.0188。",
      "样本一百，0.0054 对 0.0056。",
      "样本一千，偏差已淹没在噪声里。",
      "单种子会给出相反符号。",
      "种子一，十个样本，估计 0.2225。",
      "比真值还低。",
      "所以画面只报多种子平均。",
      "覆盖率这边，先看合成。",
      "一万个标准正态样本。",
      "名义八成，实测 0.8023。",
      "名义九五，实测 0.9486。",
      "都落在预期区间。",
      "零宽度区间，覆盖率是零。",
      "端点上的点，算盖住。",
      "栅格是二十四分之一。",
      "ELBO 这边，先看手算。",
      "KL 等于 1.3068528194。",
      "梯度对全部八十八个参数，4.42e-10。",
      "训练从 1318 降到 1095.83。",
      "降了 16.9%。",
      "真实读数最后看。",
      "八个通道，CRPS 全部小于平均误差。",
      "覆盖率八成是 0.8534。",
      "九五覆盖 0.9439。",
      "潜变量相关 0.7807。",
      "这四个数，就是本集的结论。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "五条必须说的话",
    goal: "不假装完成",
    lines: [
      "第一条，没有端到端训练。",
      "这里验证的是实现，不是模型。",
      "CRPS 的值对，不等于预测准。",
      "第二条，VAE 只在一百个窗口上训练。",
      "六十轮，全批量，没有正则。",
      "换个数据集，ELBO 的数值不能比。",
      "第三条，只有一个市场。",
      "八只标的，都是 A 股。",
      "换市场要重新验覆盖率。",
      "第四条，CRPS 的估计必须带样本数。",
      "不带样本数，偏差量级就不可知。",
      "第五条，覆盖率不是越高越好。",
      "覆盖高，往往是区间宽。",
      "宽区间当然盖得住。",
      "要和名义值比，也要和宽度比。",
      "还有一个已知偏差。",
      "面板里有缺口，最大十一天。",
      "缺口窗口没有剔除。",
      "所以这部分的读数是近似。",
      "这些都不是 bug。",
      "是口径必须一起报的东西。",
      "账都记在证据里，不藏着。",
      "所以这一集仍算 ready。",
      "ready 说的是内容可交付。",
      "不是整个项目没有缺口。",
      "算法卡还欠着。",
      "演示命令行也还欠着。",
      "这两项留到统一补。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "一个分数，一个覆盖率，一个下界",
    lines: [
      "第一句，CRPS 把分布打分。",
      "采样估计偏高，偏差约 0.564 除以样本数。",
      "第二句，覆盖率必须报宽度和容差。",
      "端点算不算，要先说清楚。",
      "第三句，ELBO 是两个可算的项。",
      "手算能对上，梯度能对上，才敢用。",
      "下一集，通道混合。",
      "八个通道，怎么互相借力。",
      "iTrans 和一张图。",
      "这一集的证词是：",
      "验证只能证明实现和定义一致。",
      "不能证明分布有用。",
      "第 23 集完。",
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