/**
 * 《块嵌入与两种注意力架构：PatchTST 与交叉注意力解码器》—— 第 3 章 · 序列模型。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-27-patch-embed-and-two-attn/voice.json";

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
    kicker: "第 3 章 / 序列模型 · 第二十七集",
    title: "块嵌入与两种注意力",
    goal: "96 步 → 11 个块 · 121 对交互",
    lines: [
      "第三篇章，第二十七集。",
      "上一集，把九十六步压成了十二步。",
      "这一集换一条路。",
      "不压时间轴，改压注意力。",
      "九十六个时间点，注意力矩阵九十六乘九十六。",
      "一共九千二百一十六对交互。",
      "切成十一个块之后。",
      "只剩十一乘十一。",
      "一百二十一对。",
      "少了七十六倍。",
      "这就是 PatchTST 的出发点。",
      "再加一个交叉注意力解码器。",
      "让解码端的二十四个查询。",
      "直接读到编码端的九十六个记忆。",
      "三个模块，本集都实现。",
      "块嵌入。",
      "通道独立的编码器。",
      "交叉注意力解码。",
      "参数分别是五百四十四。",
      "两万零七百三十六。",
      "和一万七千一百五十二。",
      "全部有测试，有读数。",
      "但先说清楚一件事。",
      "本集没有训练。",
      "也不报预测精度。",
      "只报结构和真实数据上的性质。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "九十六个位置，九千二百一十六对",
    goal: "平方的账，先砍时间轴",
    lines: [
      "逐点模型怎么做。",
      "九十六步，每步一个向量。",
      "自注意力在九十六个位置之间做。",
      "平方复杂度。",
      "九十六乘九十六，九千二百一十六对。",
      "参数量不算大，但交互对数是平方的。",
      "窗口再长呢。",
      "三百三十六步，就是十一万对。",
      "所以时间序列里的注意力。",
      "第一刀通常砍在时间轴上。",
      "怎么砍。",
      "把相邻的若干步并成一个块。",
      "这一步叫分块。",
      "每个块用一个向量表示。",
      "块数从九十六降到十一。",
      "交互从九千二百一十六。",
      "降到一百二十一。",
      "代价是什么。",
      "块内部十六步。",
      "被一个线性映射压成一个点。",
      "块内的细节没了。",
      "只能靠块间的关系补。",
      "这是一个赌注。",
      "赌块内的高频不重要。",
      "赌块间的低频结构更重要。",
      "PatchTST 赌了。",
      "它还有第二个赌注。",
      "通道之间互相独立。",
      "每个通道单独建模。",
      "这条更反直觉。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三种模块，三个接口",
    goal: "块嵌入 · 通道独立编码 · 交叉解码",
    lines: [
      "定义一，块嵌入。",
      "九十六步，块长十六，步长八。",
      "第一个块是第一步到第十六步。",
      "第二个块从第九步开始。",
      "所以相邻块重叠八个点。",
      "块数怎么算。",
      "九十六减十六，除以八，加一。",
      "等于十一。",
      "不是十二。",
      "这个一必须记住。",
      "每个块乘一个十六乘三十二的矩阵。",
      "加三十二个偏置。",
      "十六乘三十二加三十二。",
      "五百四十四个参数。",
      "再加十一个位置编码。",
      "三百五十二个。",
      "输出是十一行三十二列。",
      "定义二，PatchTST 编码器。",
      "每个通道自己走一遍。",
      "一层编码器，四个头。",
      "前馈宽度一百二十八。",
      "注意力四块方阵，四乘三十二的平方。",
      "四千零九十六。",
      "前馈两层，二乘三十二乘一百二十八。",
      "八千一百九十二。",
      "编码器一万二千二百八十八。",
      "预测头是十一乘三十二。",
      "再乘二十四步。",
      "八千四百四十八。",
      "合计两万零七百三十六。",
      "定义三，交叉注意力解码器。",
      "查询来自解码端，二十四个。",
      "键和值来自编码端的记忆。",
      "每层有自注意力、交叉注意力、前馈。",
      "自注意力带因果掩码。",
      "交叉注意力不掩。",
      "归一化都在残差之后。",
      "也就是 Post-LN。",
      "八个方阵，加两段前馈，加查询。",
      "一万七千一百五十二。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "十一个块，十六步视野",
    goal: "块内丢掉的，块间补回来",
    lines: [
      "先看块怎么铺。",
      "九十六根收盘价。",
      "第一块盖住一到十六。",
      "第二块盖住九到二十四。",
      "每块往后挪八个点。",
      "最后一块从八十一到九十六。",
      "正好十一个。",
      "若要十二个块。",
      "步长得是六又三分之二。",
      "不均匀。",
      "所以书上写的十二是九十六除以八。",
      "真正的块数是十一。",
      "再看感受野。",
      "第一个块只看到前十六步。",
      "改第十六步，第一个块变。",
      "改第十七步，第一个块不变。",
      "这条性质能测。",
      "读出十六步。",
      "后面全是空的。",
      "这就是分辨率的代价。",
      "再看注意力矩阵。",
      "横轴是九十六个位置。",
      "纵轴是二十四个查询。",
      "每行和是一。",
      "但这个矩阵是未训练的。",
      "查询是随机初始化。",
      "位置是固定的线性投影。",
      "所以它只说明结构。",
      "不说明模型学到了什么。",
      "这句话要写进画面。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个模块，两个坑",
    goal: "PatchEmbed.hs · PatchTst.hs · CrossAttnDecoder.hs",
    lines: [
      "三个模块，都在 Haskell 里。",
      "PatchEmbed.hs 最短。",
      "切片、乘矩阵、加偏置、加位置。",
      "一个入口 peForward。",
      "PatchTst.hs 长一些。",
      "先切块，再嵌入。",
      "然后过一层编码器。",
      "多头注意力加残差。",
      "前馈加残差。",
      "两次层归一化都在后面。",
      "最后按通道循环。",
      "每个通道输出二十四步。",
      "再拼回一张表。",
      "这里踩了一个坑。",
      "拼表用的是行主序。",
      "但 V.concat 是列主序。",
      "第一次跑出来通道差三点四。",
      "看起来像模型不独立。",
      "其实是拼错了。",
      "修完之后通道差精确为零。",
      "第二个模块方向要钉死。",
      "交叉注意力里，查询来自解码端。",
      "键和值来自编码端。",
      "反过来也能跑。",
      "但那就不是解码器了。",
      "所以写了两个翻转测试。",
      "交换查询和记忆，输出必须变。",
      "第三个坑是层归一化的 epsilon。",
      "方差里加了一乘十的负五次方。",
      "标准差是零点九九九九五。",
      "不是精确的一。",
      "测试阈值放到一万分之一。",
      "这不是放水，是写清口径。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "三十一项，零失败",
    goal: "结构读数与合成金例",
    lines: [
      "三十一项检查，三组。",
      "块嵌入十二项。",
      "PatchTST 十项。",
      "交叉注意力九项。",
      "零失败。",
      "断言呢。",
      "块嵌入二十条。",
      "PatchTST 二十条。",
      "交叉注意力十六条。",
      "全仓九十二套，一千二百五十一条。",
      "零失败。",
      "读数一条条看。",
      "块嵌入：十一块。",
      "参数五百四十四。",
      "位置三百五十二。",
      "切片误差零。",
      "不重叠时能拼回六块。",
      "拼回误差零。",
      "PatchTST：编码器一万二千二百八十八。",
      "头八千四百四十八。",
      "合计两万零七百三十六。",
      "通道差零。",
      "置换差八点九乘十的负十六。",
      "遮挡一块，输出差一点五乘十的负二。",
      "感受野十六步。",
      "交互一百二十一。",
      "稠密九千二百一十六。",
      "比值七十六点一七。",
      "交叉注意力：参数一万七千一百五十二。",
      "查询标准差零点零二零零。",
      "单记忆 token，权重全一。",
      "分支误差零。",
      "上三角最大零。",
      "行和误差四点四乘十的负十六。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "四条边界，三笔债",
    goal: "哪些话不能说",
    lines: [
      "边界四条。",
      "第一，没有训练。",
      "所有读数都是结构与初始化的性质。",
      "不报预测精度。",
      "不能说得比证据多。",
      "第二，块内信息是有损的。",
      "十六步压成一个向量。",
      "一个线性映射。",
      "它可能抹掉高频。",
      "这是方法本身的设计。",
      "不是实现的 bug。",
      "第三，注意力热图是未训练的。",
      "查询随机初始化。",
      "位置是固定的线性投影。",
      "所以它只能说明形状。",
      "不能说明模型关注哪里。",
      "第四，单一面板。",
      "八个通道，两千六百五十七行。",
      "三百一十八个窗口。",
      "训练段二百二十二个。",
      "不外推到全市场。",
      "还有三笔债。",
      "算法卡没写。",
      "demo 子命令没做。",
      "端到端训练没做。",
      "这些不影响交付。",
      "但都记在账上。",
      "所以这一集仍算 ready。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "压掉分辨率，换回全局",
    lines: [
      "三句话。",
      "分块把交互从九千二百一十六。",
      "降到一百二十一。",
      "代价是块内的细节。",
      "交叉注意力的方向必须钉死。",
      "查询在解码端。",
      "键值在编码端。",
      "下一集，通道三补集。",
      "混合 MLP、路由注意力、动态聚类。",
      "把时间轴换成通道轴。",
      "第 27 集的证词是：",
      "压掉的是分辨率。",
      "换回来的是全局。",
      "第 27 集，完。",
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
