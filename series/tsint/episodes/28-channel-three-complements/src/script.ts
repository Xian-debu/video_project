/**
 * 《通道三补集：混合 MLP、路由注意力、动态聚类》—— 第 3 章 · 序列模型。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-28-channel-three-complements/voice.json";

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
    kicker: "第 3 章 / 序列模型 · 第二十八集",
    title: "通道三补集",
    goal: "换一根轴 · 三种代价",
    lines: [
      "第三篇章，第二十八集。",
      "前两集先压时间轴。",
      "再切成块，换成块注意力。",
      "这一集换一根轴。",
      "换的是通道轴。",
      "八个通道怎么混。",
      "六十四个通道怎么混。",
      "三种做法，三种代价。",
      "第一种，双轴混合 MLP。",
      "时间轴混一次。",
      "通道轴混一次。",
      "一共一万零四十八个参数。",
      "第二种，路由注意力。",
      "四个槽去看六十四个通道。",
      "交互从四千零九十六降到二百五十六。",
      "少了十六倍。",
      "第三种，动态聚类。",
      "每个簇一套权重。",
      "四个簇，九千三百一十二个参数。",
      "三个模块，本集都实现。",
      "而且都测过了。",
      "三十八项检查，零失败。",
      "断言九十五套，一千三百一十三条。",
      "但先说清楚。",
      "这一集也没有训练。",
      "只报容量，和真实数据上的结构。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "通道上的平方",
    goal: "四零九六对，藏在共模下面",
    lines: [
      "为什么不再看时间轴。",
      "九十六步，九十六个位置。",
      "逐点注意力是九千二百一十六对。",
      "上一集，把它压到一百二十一。",
      "剩下的平方，在通道上。",
      "六十四个通道。",
      "两两相关，四千零九十六对。",
      "三百个通道呢。",
      "九万对交互。",
      "这是下一个平方。",
      "通道之间有什么关系。",
      "同一行业的股票，应该更同步。",
      "不同行业，应该更独立。",
      "实测是多少。",
      "六十四只，十个行业。",
      "同行业平均相关，零点四六六七。",
      "跨行业，零点四一六二。",
      "只差零点零五。",
      "为什么这么小。",
      "因为有一个共同因子。",
      "第一主成分，占四成三。",
      "市场一起涨，一起跌。",
      "行业信号被压在下面。",
      "把共模减掉。",
      "同行业，零点零六四。",
      "跨行业，负零点零二三。",
      "符号分开了。",
      "所以通道建模的第一个问题。",
      "不是模型不够大。",
      "是共同因子太响。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三种模块，三个接口",
    goal: "双轴混合 · 路由 · 聚类",
    lines: [
      "定义一，TSMixer 块。",
      "输入是一张时间乘通道的表。",
      "先混时间轴。",
      "再混通道轴。",
      "两个混合都是线性的。",
      "外面套修正线性。",
      "z 一等于 z，加上两段混合的激活。",
      "一段沿时间，一段沿通道。",
      "然后过一道逐元素的门。",
      "输出等于 z，加门控后的 z 一。",
      "w 一是九十六乘九十六。",
      "w 三是八乘八。",
      "门是九十六乘八。",
      "参数怎么算。",
      "九十六的平方，九千二百一十六。",
      "八的平方，六十四。",
      "时间乘通道，七百六十八。",
      "合计一万零四十八。",
      "定义二，路由注意力。",
      "输入是通道矩阵，六十四行。",
      "每行是一个相关画像。",
      "先投影到四个槽。",
      "投影矩阵只有四乘六十四。",
      "拿槽去和通道做内积。",
      "除以根号 d。",
      "过 softmax，得到六十四乘四。",
      "每行和是一。",
      "输出是槽的加权平均。",
      "再和原来的通道做凸组合。",
      "参数二百五十六个。",
      "书里按三十二维算，是一百二十八。",
      "定义三，动态聚类。",
      "把通道聚成 k 簇。",
      "每簇一套线性权重。",
      "分配规则是余弦最近。",
      "簇心是簇内均值。",
      "参数量 k 乘，h 加一，乘 f。",
      "四簇，九十六步，二十四步预测。",
      "四乘九十七乘二十四。",
      "九千三百一十二。",
      "三种做法的参数不在一个量级。",
      "这就是它们的三笔账。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "随机权重，没有行业",
    goal: "三种模块都不训练时抓不到什么",
    lines: [
      "先看双轴混合。",
      "w 一是随机初始化的。",
      "九十六乘九十六的方阵。",
      "如果学好了，应该有一条对角带。",
      "因为相邻时间点最相关。",
      "测带宽质量。",
      "带宽八以内，一共一千五百六十对。",
      "占九千二百一十六的零点一六九。",
      "实测零点一七二。",
      "和均匀基线几乎一样。",
      "随机初始化没有对角带。",
      "它得靠训练长出来。",
      "w 三怎么样。",
      "八乘八，行业块质量。",
      "实测零点二一七三。",
      "均匀基线是七除以二十八，零点二五。",
      "也在均匀附近。",
      "随机权重没有行业结构。",
      "再看真实相关。",
      "六十四乘六十四的相关矩阵。",
      "行业块质量零点三四三。",
      "比随机高，说明行业真的存在。",
      "但只高三成。",
      "再看路由的槽。",
      "四个槽，随机初始化。",
      "按槽给通道贴标签。",
      "和行业标签比，纯度零点一五六。",
      "调整兰德指数零点零零七。",
      "换成主成分初始化。",
      "每个相关画像先去均值。",
      "纯度零点二零三。",
      "比随机好一点。",
      "不去均值呢。",
      "所有通道挤进一个槽。",
      "市场共模把槽吃掉了。",
      "最后看聚类。",
      "k 等于十，五个窗口。",
      "原始纯度零点三四四，指数零点零五七。",
      "减掉市场共模。",
      "指数均值从零点零五七到零点零九六。",
      "差不多翻倍。",
      "但离一还很远。",
      "所以结论很直白。",
      "不训练，三种模块都抓不到行业。",
      "这一集量的是容量，不是效果。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个模块，四个坑",
    goal: "TSMixer.hs · ChannelRouterAttn.hs · ChannelCluster.hs",
    lines: [
      "三个模块，三个文件。",
      "TSMixer 点 hs。",
      "ChannelRouterAttn 点 hs。",
      "ChannelCluster 点 hs。",
      "同一个约定。",
      "显式权重，入口返回 Either。",
      "第一个坑，置换等变。",
      "轴分离是设计目标。",
      "时间轴置换，只该影响时间轴。",
      "通道轴置换，只该影响通道轴。",
      "一开始测试失败。",
      "通道置换后差三百三十六。",
      "时间置换后差一千九百四十。",
      "为什么失败。",
      "门是逐元素的。",
      "每个时间通道对一个门值。",
      "通道置换后门对不上。",
      "把门换成全一。",
      "通道差二点二乘十的负十三。",
      "时间差一点四乘十的负十二。",
      "阈值放到十的负十一次方。",
      "不是放水，是浮点重排。",
      "第二个坑，argmax 的符号。",
      "取最大值时下标取了负。",
      "忘了取反号。",
      "证据表里的槽号是负的。",
      "纯度不受影响。",
      "标签可以重排。",
      "但产物是错的。",
      "改回来，加一个负号。",
      "第三个坑，空簇。",
      "余弦分配之后可能没有点。",
      "空簇的均值没有定义。",
      "做法是从最大簇里搬一个点。",
      "搬最远的那个。",
      "搬完再算均值。",
      "没有空簇，才没有 NaN。",
      "第四个坑，余弦对尺度。",
      "整行放大一百倍，归属不变。",
      "只放大一部分行呢。",
      "均值先变，归属就变了。",
      "测试写的是整体缩放。",
      "这才是余弦真正的不变性。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "三十八项，零失败",
    goal: "结构读数与真实面板",
    lines: [
      "三十八项检查，四组。",
      "混合 MLP 十项。",
      "路由部分十项。",
      "聚类部分十项。",
      "数据部分五项。",
      "一项都没失败。",
      "断言，九十五套，一千三百一十三。",
      "本轮新增六十二条。",
      "读数一条条看。",
      "混合 MLP。",
      "参数一万零四十八。",
      "恒等误差零。",
      "手算矩阵积，误差零。",
      "通道置换等变，一点八乘十的负十五。",
      "时间置换等变，七点一乘十的负十五。",
      "对角带宽零点一七二。",
      "行业块零点二一七。",
      "均匀基线零点二五。",
      "市场模式占比零点四三二。",
      "八通道同组相关零点六九六。",
      "跨组零点四四四。",
      "路由的读数。",
      "书口径参数一百二十八。",
      "本证据口径，二百五十六。",
      "稠密混合，四千零九十六。",
      "复杂度二百五十六，比值十六。",
      "行和误差二点二乘十的负十六。",
      "c 等于一，全一，误差零。",
      "手算输出二，误差零。",
      "置换差二点二乘十的负十六。",
      "随机槽纯度零点一五六。",
      "去均值 PCA 槽，零点二零三。",
      "聚类的读数。",
      "四个簇，九千三百一十二。",
      "十个簇，二万三千二百八十。",
      "合成三簇，纯度一点零。",
      "真实单窗，纯度零点三四四。",
      "指数零点零五七。",
      "去共模，窗口均值零点零九六。",
      "同行业零点零六四。",
      "跨行业负零点零二三。",
      "空簇是零个。",
      "最后是数据。",
      "八通道二千六百五十七行。",
      "六十四通道二千六百五十九行。",
      "通道六十四，行业十。",
      "收益二千六百五十八个。",
      "两个哈希，都写进产物。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "四条边界，三笔债",
    goal: "哪些话不能说",
    lines: [
      "先说边界四条。",
      "第一，没有训练。",
      "所有读数都是结构与初始化的性质。",
      "没有拟合，就没有精度。",
      "不能说哪个更好。",
      "第二，行业对比只有零点零五。",
      "市场共模占四成三。",
      "这个面板里，行业信号很弱。",
      "换样本，结论可能变。",
      "第三，相关不是因果。",
      "两个通道同步。",
      "可能是同一个因子。",
      "也可能是上下游。",
      "相关矩阵分不出来。",
      "第四，一个市场，一段样本。",
      "二零一五年到二零二五年。",
      "六十四只，十个行业。",
      "不外推到全市场。",
      "也不外推到别的频率。",
      "日频，不等于分钟频。",
      "还有三笔债。",
      "算法卡没写。",
      "demo 子命令没做。",
      "端到端训练没做。",
      "三笔都记在账上。",
      "但没有影响本集的交付。",
      "所以这一集仍算 ready。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "换轴之后，先处理共模",
    lines: [
      "三句话带走。",
      "通道轴有三种代价。",
      "混合 MLP 一万零四十八。",
      "路由二百五十六。",
      "聚类九千三百一十二。",
      "不训练，三种都抓不到行业。",
      "共模是第一个要处理的。",
      "下一集，概率生成补集。",
      "Copula，扩散损失，连续流。",
      "第 28 集的证词是：",
      "通道不是空的。",
      "但通道信号要先把共模拿走。",
      "第 28 集，完。",
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
