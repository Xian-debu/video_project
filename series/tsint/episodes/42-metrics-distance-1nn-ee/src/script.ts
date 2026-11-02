/**
 * 第 5 章 · 时间序列分类 · 第四十二集。
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 voice.json 的实测值。
 */
import voiceJson from "../../data/tsint-42-metrics-distance-1nn-ee/voice.json";

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
    kicker: "第 5 章 / 时间序列分类 · 第四十二集",
    title: "距离决定一切：从 1-NN+DTW 到弹性集成",
    goal: "欧氏 · DTW · 弹性集成",
    pages: [],
    lines: [
"一条曲线，向左挪五个点。",
"欧氏距离从一跳到十五。",
"DTW 只从零点三六起步。",
"同一个形状，两种距离给出两个世界。",
"这一集问一个更硬的问题。",
"换个距离，分类真的会变好吗。",
"六十只股票，三个行业。",
"六十天的收益窗，贴上行业标签。",
"欧氏 1-NN 准确率零点四一六七。",
"换成带宽 6 的 DTW。",
"还是零点四一六七。",
"净提升零个百分点。",
"书里说提升不到两个百分点。",
"我们测出来是零。",
"四个弹性距离加权集成。",
"升到零点四六六七。",
"但 Nemenyi 检验说，不显著。",
"这一集把三件事拆开讲。",
"距离怎么算。",
"分类器怎么评。",
"集成为什么还是赢不了显著。",
"先看那条挪了五个点的曲线。"
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "一个三分类任务，两把距离",
    title: "六十天收益窗，三个行业",
    goal: "收益窗 · 1-NN · 两把尺",
    pages: [],
    lines: [
"任务是三分类。",
"输入是一段六十天的对数收益。",
"输出是三个行业之一。",
"银行、半导体、医药。",
"为什么用收益，不用价格。",
"价格有量纲，也有长期趋势。",
"收益近似平稳，量纲也统一。",
"每个窗口再做 z 标准化。",
"均值归零，方差归一。",
"这样比的是形状，不是价位。",
"分类器只用一个：最近邻。",
"训练集里找距离最近的那条。",
"它的标签就是预测。",
"这叫 1-NN，没有参数可调。",
"基线距离是欧氏。",
"逐点相减，平方，求和，开方。",
"它对时间轴上的错位零容忍。",
"第二个距离是 DTW。",
"允许时间轴拉伸，再对齐求和。",
"书上说 DTW 通常更好。",
"提升不到两个百分点。",
"这一集要验证这句话。",
"数据来自沪深三百成分股。",
"银行二十五只，半导体十八只。",
"医药十七只，合计六十只。",
"计划本来写的是各三十只。",
"湖里只有这么多，如实记录。",
"每只股票取一个窗口。",
"窗口长度六十个交易日。",
"起点按固定步长错开，避免重叠。",
"样本少，所以读数要看不确定性。",
"这就是问题设定。"
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "两条公式，四个弹性距离",
    title: "欧氏逐点，DTW 允许拉伸",
    goal: "代价矩阵 · 递推 · 投票",
    pages: [],
    lines: [
"先把距离定义清楚。",
"两条等长序列，a 和 b。",
"欧氏距离：逐点差，平方，求和，开方。",
"公式写成根号下 Σ 平方差。",
"它假设第 i 点只跟第 i 点比。",
"时间轴错一格，误差就锁死。",
"DTW 放开这个假设。",
"允许 a 的第 i 点对上 b 的第 j 点。",
"代价矩阵 D 逐格填。",
"第一行第一列先累加。",
"其余每格：局部平方差加三选一。",
"三选一是左边、上边、左上。",
"写出来就是 D 等于 d 加 min。",
"这条递推是 DTW 的全部。",
"终点取右下角，除以 n 加 m。",
"再开方，距离才可比。",
"不除，长序列会被系统性惩罚。",
"带宽是第二个约束。",
"只允许 i 减 j 的绝对值不超过 6。",
"带外格子代价记为正无穷。",
"带宽把搜索限制在一条走廊。",
"没有带宽，DTW 会乱拉。",
"本集固定带宽 6，不调。",
"对齐路径从右下往左上回溯。",
"每步走向左、上、左上。",
"路径就是一条时间对应关系。",
"它能把两段形态对上。",
"也能把不同长度的段对齐。",
"代价矩阵画出来是一张热图。",
"深色是低代价，浅色是高代价。",
"路径贴着低代价走。",
"这是 DTW 唯一能看见的中间量。",
"弹性集成不只用一个距离。",
"四个成员：DTW、导数 DTW、加权 DTW、LCSS。",
"导数 DTW 先对序列求导。",
"它比的是形状的斜率。",
"加权 DTW 给时间轴加惩罚。",
"参数 g 等于零点零五。",
"LCSS 数最长公共子序列。",
"容差 eps 取零点二。",
"四个距离，四种偏好。",
"集成给每个成员一个权重。",
"权重来自留一准确率。",
"减掉随机猜测的三分之一。",
"小于零就截断为零。",
"再归一化，让权重和为一。",
"预测时四个距离各投一票。",
"也可以按权重加权投票。",
"这就是弹性集成。"
    ],
  },
  {
    id: "metrics",
    chapter: "度量",
    kicker: "混淆矩阵到临界差",
    title: "分类器要评，就得有尺子",
    goal: "macro-F1 · 平均秩 · CD",
    pages: [],
    lines: [
"分类器要评，就得有尺子。",
"第一把尺子是混淆矩阵。",
"行是真值，列是预测。",
"对角线上是判对的窗。",
"三个行业，就是三乘三。",
"准确率等于对角线之和除以总数。",
"简单，但会骗人。",
"两类极不平衡时尤其会骗。",
"五个 A、一个 B，全判成 A。",
"准确率是六分之五，零点八三三三。",
"可 B 类一个都没召回。",
"宏平均 F1 只有零点四五四六。",
"所以第二把尺子是逐类精度召回。",
"精度：预测为该类的里面，对的比例。",
"召回：该类真值里，被找出的比例。",
"F1 是精度和召回的调和平均。",
"调和平均偏向小的那一边。",
"宏平均：每类各算一份，再平均。",
"它给每个类一张等值的选票。",
"小类不再被大类淹没。",
"黄金值来了。",
"十个窗，两个行业各错一个。",
"准确率是零点八零。",
"宏平均 F1 是零点八三三三。",
"不是算错，是加权方式不同。",
"准确率按样本计票。",
"宏平均按类别计票。",
"第三把尺子：统计显著性。",
"三个分类器，二十次平衡抽样。",
"每次每类抽十只，共三十窗。",
"每次给三个分类器排名。",
"平均秩越小越好。",
"弹性集成一点七五，欧氏一点九零。",
"DTW 二点三五，最差。",
"平均秩差要跟临界差比。",
"CD 等于 q 乘根号下 k(k+1)/6N。",
"三个分类器，二十次抽样。",
"q 取二点三四三。",
"临界差是零点七四零九。",
"计划里写的一点一六，是算错的。",
"三对秩差：零点四五、零点一五、零点六零。",
"全部小于临界差。",
"结论：三个分类器没有显著差异。",
"这句比任何一个准确率都重要。"
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "三个模块，五十八个测试",
    title: "手写递推 · 留一权重 · 确定性随机",
    goal: "Haskell · 留一 · 检查",
    pages: [],
    lines: [
"实现放在 Haskell 仓。",
"三个模块，五十八个新测试。",
"度量模块二十四个测试。",
"DTW 模块十六个。",
"弹性集成十八个。",
"度量模块管混淆矩阵和秩。",
"它用的是 boxed 向量。",
"DTW 模块用 unboxed 向量。",
"序列是 double 数组，省内存。",
"两种向量不能混着写。",
"混了会连报六个类型错。",
"这是本集最花时间的坑。",
"DTW 的带宽写成整数参数。",
"带宽六在证据里是固定的。",
"不带带宽，准确率掉到零点三五。",
"带不带，差六点七个百分点。",
"集成权重用留一准确率算。",
"留一就是每次留一个窗不训练。",
"用剩下的五十九个窗找最近邻。",
"四个距离各算一次留一。",
"权重等于准确率减三分之一。",
"负数截断，再归一化。",
"合成数据用确定性随机数。",
"线性同余，种子写死。",
"换机器重跑，读数逐位一样。",
"证据程序二十项检查。",
"数据八项，主任务四项。",
"抽样四项，合成四项。",
"一次跑完五十九秒。",
"全绿才允许提交。"
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "三个读数，一个零",
    title: "同数据 · 同窗口 · 同一把尺",
    goal: "0.4167 · 0.4167 · 0.4667",
    pages: [],
    lines: [
"先看主任务的读数。",
"欧氏 1-NN 判对二十五只。",
"准确率零点四一六七。",
"宏平均 F1 零点三九一八。",
"DTW 也判对二十五只。",
"准确率还是零点四一六七。",
"宏平均 F1 零点四零八四。",
"净提升零个百分点。",
"书里说提升不到两个点，实测是零。",
"弹性集成判对二十八只。",
"准确率零点四六六七。",
"宏平均 F1 零点四五五七。",
"三个读数，一个比一个好。",
"但混淆矩阵讲的故事更细。",
"欧氏的医药召回只有零点一七六五。",
"十七只医药，只认出三只。",
"另外十四只被判成银行或半导体。",
"DTW 把医药召回提到零点三五二九。",
"认出了六只。",
"但银行和半导体的对称误分补回来。",
"所以总数没变。",
"这就是净提升为零的机制。",
"集成在医药上也是零点三五二九。",
"但它在银行上召回零点五六。",
"半导体零点四四四四。",
"多对的三只，来自这里。",
"看四个弹性距离的权重。",
"导数 DTW 零点七二七三。",
"加权 DTW 零点一八一八。",
"普通 DTW 零点零九零九。",
"LCSS 是零。",
"导数距离拿走了七成权重。",
"说明斜率比绝对值更稳。",
"LCSS 容差零点二下，留一只猜对三分之一。",
"减掉三分之一，正好是零。",
"二十次抽样看排名。",
"集成平均秩一点七五。",
"欧氏一点九零。",
"DTW 二点三五。",
"集成最好，DTW 最差。",
"但临界差是零点七四零九。",
"最大的一对差才零点六零。",
"三对全不显著。",
"合成对照给出另一面。",
"三类周期，干净查询全对。",
"欧氏、DTW、集成都是一点零。",
"把查询循环左移五个点。",
"欧氏掉到零点零。",
"DTW 还是一点零。",
"集成也是一点零。",
"教科书结论在合成数据上成立。",
"在真实收益窗上不成立。",
"这不是矛盾。",
"是数据里没有可对齐的平移。"
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "样本、标签、权重三笔债",
    title: "不声称显著，也不声称通用",
    goal: "六十窗 · 粗标签 · 双层留一",
    pages: [],
    lines: [
"先把边界摆出来。",
"只有六十个窗，每个窗一个样本。",
"窗口不重叠，但股票不独立。",
"同一行业，同涨同跌。",
"有效样本远少于六十。",
"行业标签是证监会门类。",
"粗，而且有重叠。",
"半导体和电子设备，被分在一起。",
"医药里混了医疗器械和中药。",
"类别本身就不干净。",
"集成权重不是嵌套的。",
"权重在全部六十只上算留一。",
"再用同一批数据评集成。",
"这会让集成读数偏乐观。",
"正确做法是双层留一。",
"这一集没有做。",
"带宽 6 和容差 0.2 是选的。",
"没有做参数敏感性扫描。",
"换一个带宽，读数会动。",
"Nemenyi 检验的检验力有限。",
"二十次抽样，三十个窗。",
"不显著不等于没有差异。",
"只能说这批数据看不出来。",
"下一集换武器。",
"不再比整条序列。",
"从序列里挖一小段形状。",
"叫 Shapelet。",
"还要讲 PIPs，感知重要点。"
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "一集一个读数",
    title: "距离不是万能钥匙",
    goal: "零提升 · 不显著 · 下一集",
    pages: [],
    lines: [
"这一集的结论。",
"距离不是万能钥匙。",
"换 DTW，准确率没动。",
"集成多对三只，但不显著。",
"合成数据上 DTW 完胜。",
"真实数据上打平。",
"差别在数据里有没有平移。",
"新增五十八条测试。",
"二十项证据检查。",
"本集进度五十二 / 七十四。",
"下一集：Shapelet。",
"从一条序列里挖出判别力。",
"距离决定一切，说到这里。"
    ],
  },
];

export const PAGES_INDEX: Record<string, number[]> = {
  open: [0, 4, 8, 12, 17],
  problem: [0, 10, 14, 18, 21, 26],
  definitions: [0, 6, 8, 13, 17, 23, 28, 32, 42],
  metrics: [0, 6, 12, 20, 27, 35],
  implementation: [0, 5, 12, 16, 21, 25],
  verification: [0, 8, 13, 22, 26, 35, 43],
  boundary: [0, 10, 15, 18],
  outro: [0, 6],
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

