/**
 * 《非平稳注意力：一个标量 τ 与一个向量 Δ 能改什么》—— 第 2 章 · 数据层。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-14-nonstationary-attention/voice.json";

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
    title: "注意力里的两个旋钮",
    goal: "τ 是温度，Δ 是偏置",
    lines: [
      "第 2 章 · 数据层，第十四集。",
      "非平稳注意力。",
      "EP9 讲过标准注意力。",
      "书里式(2.9) 在它上面拧了两个旋钮。",
      "一个标量，叫 tau。",
      "一个向量，叫 Delta。",
      "书里说，两个都从均值和标准差里学出来。",
      "一个乘在 logits 上，一个加在 logits 上。",
      "这一集不训练。",
      "只问三个问题。",
      "第一，tau 是新东西吗？",
      "第二，Delta 加在哪一维？",
      "第三，真实数据上有偏置可纠吗？",
      "答案是：不是，按列，没有。",
      "先说结论。",
      "tau 就是温度，换了件衣服。",
      "Delta 只能按列加，按行加是幻觉。",
      "真实窗口三段几乎均匀，没有可纠的偏置。",
      "这一集要钉四个数。",
      "第一个，三点三零七三，合成数据的注意力熵。",
      "第二个，二点五六八二，tau 等于二时的熵。",
      "第三个，零点四八二对零点二零八。",
      "末段和早段的注意力质量。",
      "第四个，零点零三六三。",
      "真实窗口三段的极差。",
      "前三个说明机制存在。",
      "第四个说明这份数据没有那个问题。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "非平稳是怎么偷渡进注意力的",
    goal: "位置没进模型，位置通过方差进来了",
    lines: [
      "先看非平稳是怎么偷渡进注意力的。",
      "一个序列，方差随时间变大。",
      "每个 token 的值，等于尺度乘一个噪声。",
      "注意力算内积。",
      "尺度大的 token，内积也大。",
      "softmax 只看数值，不看位置。",
      "于是晚段被抬高。",
      "位置没进模型，位置通过方差进来了。",
      "书里的解法，是给 logits 加两个东西。",
      "一个正缩放标量 tau。",
      "一个偏移向量 Delta。",
      "式子是，tau 乘 QK 转置，再加 1 乘 Delta 转置。",
      "除以根号 dk，然后进 softmax。",
      "书里只说了两句话。",
      "tau 是正缩放标量，Delta 是偏移向量。",
      "二者由 MLP 从均值和标准差里学出来。",
      "没有初始化，没有损失，没有训练配方。",
      "也没说，这两个量各自改了什么。",
      "所以这一集不做训练。",
      "只做前向判决。",
      "把参数取到极限，看输出退化成什么。",
      "第一条，tau 等于一、Delta 等于零，必须退回标准注意力。",
      "第二条，tau 等于二，必须等于温度零点五。",
      "第三条，按行加的偏置，梯度必须恰为零。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "把式子拆成两个旋钮",
    goal: "一个乘在整行，一个加在每一列",
    lines: [
      "先把这个式子拆开。",
      "softmax 里面，第一项是 tau 乘 logit。",
      "第二项是每个 key 自己的 Delta j。",
      "tau 是标量，整行乘同一个数。",
      "它改的是分布的尖平。",
      "不改谁比谁高的顺序。",
      "Delta 是长度 T 的向量。",
      "第 j 个 key，被抬高 Delta j。",
      "每个 key 被抬得不同，顺序才会变。",
      "书里的 1 乘 Delta 转置，是每行同一份 Delta。",
      "Delta 只跟 key 走，不跟 query 走。",
      "先看 tau。",
      "有一个恒等式。",
      "softmax 里面乘 tau，等于温度改成 tau 分之一。",
      "也就是把温度改成 tau 分之一。",
      "tau 等于二，就是温度零点五。",
      "温度是已有注意力里的一个超参。",
      "tau 没有引入新结构。",
      "实测最大差是零。",
      "两条独立实现，逐位相等。",
      "再看 Delta。",
      "三乘三的例子。",
      "按列加，每个 key 抬一个数。",
      "第一行被抬成均匀分布，顺序变了。",
      "按行加，整行常数直接被吃掉。",
      "softmax 的结果逐位不变。",
      "所以 Delta 必须按列加。",
      "抄成按行，代码能跑，梯度为零。",
      "最后说边界。",
      "书里 tau 和 Delta 是学出来的，我们没有训练。",
      "书里要的是 NSformer 的预测收益，我们没测。",
      "Delta 不用缩放，直接加在 logits 上。",
      "这三条写进自授条目 A31。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "方差一大，注意力就往末尾走",
    goal: "合成数据看得见，真实数据看不见",
    lines: [
      "先看合成数据。",
      "两千条序列，长度六十。",
      "方差从一涨到十。",
      "内积就是 x 乘 x 转置。",
      "注意力矩阵行是 query，列是 key。",
      "看平均热图。",
      "合成数据的右下角亮起来。",
      "晚段 token 幅度大，softmax 把它们抬高。",
      "把矩阵横竖各切三段。",
      "合成数据，早段两成，中段三成一，晚段四成八。",
      "真实数据，三段是三五、三三六、三一四。",
      "几乎是均匀的。",
      "极差只有零点零三六。",
      "机制存在，不等于数据里有这个问题。",
      "再做一个探针。",
      "给 Delta 一个线性位置偏置。",
      "Delta t 等于 a 乘上一减二 t 除以五十九。",
      "a 从负六扫到正六。",
      "a 等于正二时，合成数据的早段质量从零点二抬到零点六。",
      "晚段从零点四八压到零点一三。",
      "真实数据的早段，从零点三五抬到零点七三五。",
      "但它的熵掉了零点四七。",
      "这不是纠偏，是加偏。",
      "真实窗口本来三段均衡。",
      "没有那个偏置可修。",
      "这就是这一集的诚实结论。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "一条式子，两条独立实现",
    goal: "判决靠 ==，不靠差不多",
    lines: [
      "实现放在 Ch02 的 NonstatAttn 模块。",
      "一条式子，两条独立实现。",
      "第一条，nsAttention 乘 tau 再加 Delta。",
      "第二条，temperatureAttention 除温度。",
      "还有一条 standardAttention，是 EP9 的那条。",
      "比较用双等号，不用小于某个阈值。",
      "判决一：tau 等于一，Delta 全零。",
      "输出必须和标准注意力逐位相等。",
      "判决二：tau 等于二，对温度零点五。",
      "也必须逐位相等。",
      "两个数都是零。",
      "不是十的负十六次方，是零。",
      "因为两条路径只差一个乘法。",
      "再看 Delta 的坑。",
      "按列加，是给每个 key 一个偏置。",
      "按行加，是给每个 query 一个偏置。",
      "按行的写法，我们也留了一份。",
      "叫 rowBiasAttentionRaw，真的加进 logits。",
      "它和标准注意力的差，只有一点六七乘十的负十六。",
      "但它的有限差分梯度，恰为零。",
      "按列加的梯度，最大分量是零点六零九四。",
      "逐列不同，有符号。",
      "梯度之和是零，这是它该有的性质。",
      "按行加能编译，能跑，看不出错。",
      "只有梯度会告诉你，它是零。",
      "所以 Delta 只能按列加。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "六条判决，二十一项检查",
    goal: "三条桥接 + 三项梯度取证",
    lines: [
      "二十一项检查，零失败。",
      "四条数据，七条结构，十条行为。",
      "第一条，tau 等于一，Delta 全零，最大差零。",
      "第二条，tau 等于二对温度零点五，最大差零。",
      "第三条，按行加进 logits，差一点六七乘十的负十六。",
      "舍入级，等于没加。",
      "第四条，按行偏置的有限差分，恰为零。",
      "按列偏置的梯度，最大零点六零九四。",
      "梯度之和，噪声量级一点三六乘十的负九。",
      "合成数据上，标准注意力熵三点三零七三。",
      "tau 等于二时，熵掉到二点五六八二。",
      "三段质量，早段零点二零八，晚段零点四八二。",
      "探针 a 等于正二，早段抬到零点五九九。",
      "熵几乎不动，还是三点三零八七。",
      "说明偏置只搬质量，不改总量级。",
      "真实数据，六十只票，六十个交易日。",
      "注意力熵三点五五九二，比合成更平。",
      "三段是三四九九、三三六五、三一三六。",
      "极差零点零三六三。",
      "探针 a 等于正二，熵压掉零点四七。",
      "早段被抬到零点七三五。",
      "这不是纠偏，是把均匀变尖。",
      "真实窗口里，没有可纠的位置偏置。",
      "这不是说 Delta 没用。",
      "这是说，这份数据没有那个问题。",
      "要证明收益，得训完整 NSformer。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "这一集没做的三件事",
    goal: "没做的，画面标出来",
    lines: [
      "这一集没做三件事。",
      "第一，没有训练。",
      "书里 tau 和 Delta 由 MLP 从均值和标准差学出。",
      "没有初始化，没有损失，没有配方。",
      "第二，tau 不是新结构。",
      "它等价于温度，训练它等于调一个标量超参。",
      "它能改尖平，不能让模型看见新东西。",
      "第三，Delta 只在 logits 上。",
      "它不改 Q、K、V。",
      "注意力之外的一切，它都碰不到。",
      "三条边界合起来，就是一句话。",
      "这一集验证的是机制，不是收益。",
      "真实数据也不承诺有偏置。",
      "三段质量是三五、三三六、三一四。",
      "极差不到四个百分点。",
      "要证明有用，还差三步。",
      "把 tau 和 Delta 接进真正的 NSformer。",
      "在两阶段训练里学出它们。",
      "看测试集的预测误差，不看热图。",
      "这三步都不在这一集的范围里。",
      "我们证明了机制，没有证明收益。",
      "这两件事不能混着说。",
      "口径已经冻结在自授 A31。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "一句话，四个数",
    goal: "下一集：缺失值补全三法",
    lines: [
      "一句话：tau 是温度，Delta 是偏置。",
      "加在行上，是幻觉。",
      "三个问题回扣。",
      "tau 不是新东西，等价于温度。",
      "Delta 只能按列加，按行梯度恰为零。",
      "真实数据没有偏置可纠。",
      "四个数回扣：三点三零七三，二点五六八二。",
      "零点四八二对零点二零八。",
      "真实三段极差零点零三六三。",
      "机制存在，收益未测。",
      "下一集，缺失值补全三法。",
      "DTW、低秩、矩阵分解。",
      "这一集就到这里。",
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
