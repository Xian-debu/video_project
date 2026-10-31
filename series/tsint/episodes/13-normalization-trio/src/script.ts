/**
 * 《归一化三兄弟：差别只在「用谁的统计量」》—— 第 2 章 · 数据层。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-13-normalization-trio/voice.json";

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
    kicker: "第 2 章 / 数据层",
    title: "三个零件，同一个形状",
    goal: "RevIN、DAIN、SAN：差别只在统计量",
    lines: [
      "第 2 章 · 数据层，第十三集。",
      "归一化三兄弟。",
      "书里给了三个名字：RevIN、DAIN、SAN。",
      "三个式子摆在一起，形状几乎一样。",
      "都是先减一个中心，再除一个尺度。",
      "差别只有一件事：统计量从哪来。",
      "这一集不是讲三个模型，是讲三个零件。",
      "它们都嵌在预测模型里，自己不是模型。",
      "第一个零件，RevIN。",
      "它用当前这段输入自己的均值和标准差。",
      "没有参数，算一遍就能用。",
      "第二个，DAIN。",
      "统计量不再是算出来的，是两个映射学出来的。",
      "十二个参数。",
      "第三个，SAN。",
      "把窗口切片，每片用自己的一片统计量。",
      "再用一个小网络，去猜下一片会是什么。",
      "四十四参数。",
      "这一集要钉四个数。",
      "第一个，一点四乘十的负十四次方。",
      "第二个，七十八点七。",
      "第三个，零。",
      "第四个，零点三九。",
      "前两个是一对，说明原文那个式子有问题。",
      "第三个是判决，说明三者真的只差统计量。",
      "最后一个是真实数据上的发现。",
      "这一集有二十四项检查，全部通过。",
      "但其中两项的口径是「同量级」，不是「更好」。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "式二点七是个恒等层",
    goal: "照原文实现，什么都没做",
    lines: [
      "先看原文式二点七，RevIN。",
      "前三行很干净：减均值，除标准差。",
      "第四行：r 等于 X 减 X 撇。",
      "第五行：X 两撇等于 X 撇加 r。",
      "把 r 代进去。",
      "X 撇加上 X 减 X 撇，还是 X。",
      "也就是说，照书里的式子写出来，这一层什么也没做。",
      "它是个恒等层。",
      "我们照着写了一版，跑了。",
      "输出和输入的最大差，一点四乘十的负十四次方。",
      "浮点舍入级。",
      "但一个正常的归一化，输出应该离输入很远。",
      "实测，七十八点七。",
      "一个是一点四乘十的负十四次方，一个是七十八点七。",
      "差了大约十六个数量级。",
      "这就是式二点七的问题。",
      "它不是算错了，它是没有写完。",
      "作者想说的，是前向保存统计量、反向拿回来。",
      "可式子里没写统计量存在哪。",
      "式二点六也有小毛病。",
      "第一式的撇，第二式也是单撇。",
      "按上下文，第二个应该是双撇。",
      "这类排印缺陷不致命，但会让人抄错。",
      "所以第一课是：照公式实现之前，先问它闭不闭环。",
      "闭环的意思是：前向的输出，能反变换回输入。",
      "式二点七当然闭环，只是闭在恒等上。",
      "所以我们把统计量显式存下来，反变换再显式取回。",
      "勘误表里这条记为 E04，状态是待文献核实。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三个式子，三份统计量",
    goal: "零参数、十二参数、四十四参数",
    lines: [
      "现在把三个式子并排放。",
      "RevIN 的统计量：这段输入自己的 mu 和 sigma。",
      "位置：整个窗口。",
      "参数：零，不用学。",
      "DAIN 的统计量：alpha 和 beta。",
      "alpha 等于 W_a 乘窗口特征加偏置。",
      "beta 同理。",
      "特征取三个：均值、标准差、末值。",
      "所以参数是 3 加 1 加 3 加 1，共八。",
      "再加门的三个权重一个偏置，一共十二。",
      "SAN 的统计量：每一片的 mu 和 sigma。",
      "片长 tau，片数 M 等于 T 除以 tau。",
      "每一片独立归一化。",
      "再拿一个 MLP，从上一片的统计量猜下一片。",
      "输入两维，隐层八维，输出两维。",
      "四十二个参数，加两个逐通道权重，四十四。",
      "三个零件，三个数字：零、十二、四十四。",
      "这就是「用谁的统计量」的全部差别。",
      "书里还给了两个细节。",
      "DAIN 的门：gamma 等于 sigmoid。",
      "SAN 的两阶段训练：先统计、再预测。",
      "细节先记着，等下要用。",
      "先看这三个式子到底哪里一样。",
      "把减法和除法抽出来。",
      "剩下的只有一件事：那个 mu 和 sigma 是谁。",
      "还要说清一件事：RevIN 不是 Z-score。",
      "Z-score 用训练集的统计量，全程固定。",
      "RevIN 用当前这一段输入自己的统计量。",
      "前者是预处理，后者是模型的一部分。",
      "所以 RevIN 必须可逆，Z-score 不需要。",
      "这也是三条桥接里最基础的一条。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "统计量的粒度",
    goal: "为什么分片有意义",
    lines: [
      "同一个形状：减中心，除尺度。",
      "为什么是这两个操作？",
      "减中心，去掉水平。",
      "除尺度，去掉大小。",
      "剩下的只有一个东西：形状。",
      "不同股票的价格量级差几十倍。",
      "归一化之后，它们才在同一个坐标系里。",
      "那三个零件差在哪？",
      "第一个问题：统计量是算的，还是学的？",
      "RevIN 算，DAIN 学，SAN 学和用各一半。",
      "第二个问题：统计量的作用范围有多大？",
      "整段，还是每一片？",
      "第三个问题：反变换用哪一份统计量？",
      "这就是可逆性。",
      "我们拿真实数据回答了第二个问题。",
      "一百二十只票，每只二百五十天。",
      "切成十片，每片二十五天。",
      "片内 sigma 与整段 sigma 的比，平均是零点三九。",
      "意思是，整段 sigma 里混着局部波动和整段的漂移。",
      "整段一个 sigma，把这些混成一锅。",
      "每片一个 sigma，只留下片内那部分。",
      "这就是 SAN 存在的理由。",
      "粒度不止影响统计量，还影响谁被平均。",
      "整段统计量把趋势算进方差，片统计量不算。",
      "这对预测是好处还是坏处，取决于漂移多快。",
      "漂移慢，整段够用；漂移快，分片更灵敏，也更吵。",
      "为什么分片能代表局部？",
      "因为一段里的均值和方差变化慢。",
      "这句话是假设，不是定理。",
      "假设不成立，分片统计量就没用。",
      "所以 SAN 的收益，依赖数据本身的平稳程度。",
      "这一点，下一集会正面处理。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "几十行代码，三个坑",
    goal: "保存统计量、beta 保护、残片",
    lines: [
      "实现层面，三个模块都是几十行。",
      "RevIN 最干净。",
      "两遍扫描：第一遍算 mu 和 sigma。",
      "第二遍减和除。",
      "反变换用保存下来的那一份统计量。",
      "只许复用，不许重算。",
      "重算就不是同一次变换，往返也对不上。",
      "DAIN 的核心是两个线性映射。",
      "alpha 等于三个特征的线性组合。",
      "beta 也一样的形状。",
      "分母要加保护。",
      "beta 可能正好是零。",
      "所以取绝对值再挤一个 eps。",
      "门是一个 sigmoid，把归一化结果整体缩放。",
      "书中没有关门的开关。",
      "但做桥接测试必须能关。",
      "我们加了一个显式开关。",
      "SAN 的第一件事是分片。",
      "片数 M 等于 T 除以 tau，整除不了的部分丢掉。",
      "这是我们的选择，书里没写。",
      "丢多少行，要打印出来。",
      "SAN 的 MLP 是两维进，八维隐，两维出。",
      "训练只做第一阶段：预测下一片的统计量。",
      "第二阶段要完整预测器，那是后面的集。",
      "三个模块的接口都很小。",
      "revin 收一个矩阵，返回矩阵加统计量。",
      "revinInv 收那份统计量，返回矩阵。",
      "sanForward 多返回一样东西：分片统计，供下一片预测用。",
      "测试是十三、十五、十四，共四十二条断言。",
      "整个仓库现在是四百零九条，五十五个套件。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "三条桥接，全部为零",
    goal: "逐位相等，以及一次诚实的失败",
    lines: [
      "三条桥接，全部零。",
      "第一条：eps 归零，RevIN 就是 Z-score。",
      "第二条：把 alpha、beta 换成真值，就回到 RevIN。",
      "第三条：SAN 的 tau 取 T，统计量给真值。",
      "三个零，都是双精度下的逐位相等。",
      "往返误差三点六乘十的负十五次方。",
      "这就是可逆。",
      "DAIN 的拟合，闭式解一步到位。",
      "拟合出来的 W_a，第一维是一点零。",
      "其余两个维度是十的负十一次方。",
      "W_b 的第二维是零点九九九九九九九九九七。",
      "它学到的就是 mu 和 sigma。",
      "损失九点六乘十的负十次方。",
      "alpha 的平均误差三点八乘十的负十一次方。",
      "然后是诚实的部分。",
      "SAN 的第一阶段，输了。",
      "预测下一片均值，平均误差二点五一。",
      "直接沿用上一片，零点六九。",
      "差三点六四倍。",
      "预测标准差，零点三四对零点二三。",
      "差一点五倍。",
      "二十四项检查，零失败。",
      "但其中两项检查，写的是「误差同量级」。",
      "不是「我们赢了」。",
      "这句话必须留在片子里。",
      "再说一次：检查全过，结论仍然是没赢。",
      "因为检查验的是「实现对不对」，不是「模型强不强」。",
      "这两件事分开说，才不会被数字骗。",
      "桥接怎么做的：把参数写死，再比较。",
      "DAIN 的 W_a 换成单位阵，偏置换成零。",
      "SAN 的 tau 取满一个窗口，旁路掉 MLP。",
      "三种情况下，输出与 RevIN 的差都是零。",
      "零不是误差小，是逐位相同。",
      "这说明形状一样，差别真在统计量。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "归一化不承诺什么",
    goal: "不创造信息，不解决漂移",
    lines: [
      "归一化承诺什么，不承诺什么。",
      "第一，它不创造信息。",
      "可逆的归一化，信息原样都在。",
      "它只是换了一套坐标。",
      "第二，它不解决漂移。",
      "分布变了，窗口统计量跟着变，只能跟上，不能预测。",
      "预测，是 SAN 想做的事，也是它第一阶段没做成的事。",
      "第三，MSE 小不等于预测更准。",
      "统计量预测得准，不代表下游任务更好。",
      "那要训完整模型才知道，那是后面的集。",
      "数据方面，一百二十只票，二百五十个交易日。",
      "九十个窗口训练，三十个测试。",
      "全是前复权收盘价。",
      "书里没给训练配方。",
      "优化器、学习率、轮数，一章都没有。",
      "所以 DAIN 用闭式最小二乘，SAN 用固定步长梯度下降。",
      "这些都不是书里的。",
      "画面会标出来。",
      "还有一件事：常数序列。",
      "停牌段的 sigma 是零。",
      "除零会毁掉整条链，所以 eps 不是可选项。",
      "我们另做了两个合成用例。",
      "常数序列的 sigma 是零，直接走 eps 保护。",
      "短于 tau 的序列，分片数为零，返回错误而不是崩溃。",
      "这两个用例在测试里，不在证据里。",
      "另一个边界：归一化不改变信息量。",
      "它只做线性变换，秩不变。",
      "所以它不能让模型看见新东西。",
      "能让模型更稳，不能让它更聪明。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "一句话，四个数",
    goal: "下一集：非平稳 Transformer",
    lines: [
      "一句话：三个归一化，只差一件事。",
      "统计量从哪来。",
      "算的，学的，还是猜的。",
      "RevIN 算，零参数。",
      "DAIN 学，十二参数。",
      "SAN 分片再猜，四十四参数。",
      "四个数回扣：一点四乘十的负十四，七十八点七，零，零点三九。",
      "下一集，非平稳 Transformer。",
      "它把统计量直接塞进注意力里。",
      "那一集会用到这一集的 sigma。",
      "这一集就到这里。",
      "统计量从哪来，决定了这一层能学什么。",
      "下一集，再见。",
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
export const frameOf = (id: string, k: number) => Math.round(within(id, k) * FPS);

export { SCENES, LINES };
