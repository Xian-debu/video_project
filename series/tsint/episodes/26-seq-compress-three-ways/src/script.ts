/**
 * 《序列压缩三法：奇偶下采样、周期下采样、最后时刻压缩》—— 第 3 章 · 序列模型。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-26-seq-compress-three-ways/voice.json";

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
    "id": "open",
    "chapter": "开场",
    "kicker": "第 3 章 / 序列模型 · 第二十六集",
    "title": "序列压缩三法",
    "goal": "奇偶 · 周期 · 最后时刻",
    "lines": [
      "第三篇章，第二十六集。",
      "上一集，递归和分段都做完了。",
      "这一集问一个更基础的问题。",
      "九十六条历史，一定要全看吗。",
      "如果先把它压短呢。",
      "压到十二条，再预测二十四步。",
      "计算量从两千三百零四。",
      "降到二百八十八。",
      "八倍的差距。",
      "三条压缩路，本集都实现。",
      "奇偶拆分。",
      "周期折叠。",
      "只留最后八根。",
      "同一份六十分钟线。",
      "同一把尺子量。",
      "只有一条能无损往返。",
      "另外两条必然丢信息。",
      "那它们还值得做吗。",
      "值得，而且读数有点意外。",
      "参数最少的那个，误差反而最小。",
      "参数最多的那个，比常数基线还差。",
      "这集把三个模块和真实读数。",
      "一并摆出来。",
      "先看问题的形状。",
      "再看三条路怎么定义。",
      "最后看代价。"
    ]
  },
  {
    "id": "problem",
    "chapter": "问题",
    "kicker": "02 / 问题",
    "title": "九十六步，喂给两千三百个参数",
    "goal": "样本很瘦，头很胖",
    "lines": [
      "直接把九十六步拼成一个输入。",
      "预测未来二十四步。",
      "头有二十四乘九十六。",
      "加二十四个偏置，两千三百二十八。",
      "训练窗口只有六百九十个。",
      "而且它们互相重叠。",
      "这是一个很瘦的样本。",
      "喂一个很胖的头。",
      "结果平均误差 0.8973。",
      "常数基线是多少。",
      "把最后一根价格重复二十四遍。",
      "0.8249。",
      "稠密线性头输给了不学习的基线。",
      "为什么。",
      "因为九十六维输入里全是冗余。",
      "相邻的收益高度相关。",
      "最小二乘在样本不足时。",
      "会把噪声也拟合进去。",
      "所以问题不是模型不够大。",
      "是输入没有被压缩过。",
      "压缩不只是省算力。",
      "它还在做正则。",
      "三条路可以做。",
      "第一，按奇偶拆成两条子序列。",
      "第二，按周期把点折成相位。",
      "第三，干脆只看最后几根。",
      "三条路各有各的丢法。",
      "这一集把三条都写完，再量。"
    ]
  },
  {
    "id": "definitions",
    "chapter": "定义",
    "kicker": "03 / 定义",
    "title": "三种压法，同一个问题",
    "goal": "置换 · 折叠 · 截断",
    "lines": [
      "定义一，奇偶下采样。",
      "把序列按下标拆成偶数位和奇数位。",
      "偶数位一条，奇数位一条。",
      "用的时候交错回去。",
      "这是一个置换。",
      "置换不丢信息。",
      "往返误差精确到零。",
      "定义二，周期下采样。",
      "取周期 p 等于十二。",
      "九十六步正好折成十二个相位。",
      "每个相位八个点。",
      "只保留最后四个。",
      "每条相位用一个窗口做线性读数。",
      "参数量 p 乘 K 乘 w。",
      "十二乘二乘四，九十六个。",
      "定义三，最后时刻压缩。",
      "只读最后 L 根。",
      "L 等于八。",
      "头是二十四乘八加二十四。",
      "二百一十六个参数。",
      "三个头都用闭式最小二乘拟合。",
      "没有随机初始化。",
      "没有梯度下降。",
      "所以读数可复现。",
      "复制的是同一份数据。",
      "同一份标准化口径。",
      "训练窗口取前七成。",
      "测试取最后一百六十个。",
      "压缩比口径也要钉死。",
      "稠密乘加九十六乘二十四。",
      "两千三百零四。",
      "压缩后十二乘二十四。",
      "二百八十八。",
      "比值八。",
      "这个八是这集的核心数字。"
    ]
  },
  {
    "id": "intuition",
    "chapter": "直觉",
    "kicker": "04 / 直觉",
    "title": "三种丢法，三种赌注",
    "goal": "先看形状，再看代价",
    "lines": [
      "先看奇偶拆分长什么样。",
      "取真实收盘价三十二根。",
      "偶数位十六根，奇数位十六根。",
      "两条序列各自保留原顺序。",
      "交错回来，和原序列逐位相等。",
      "误差 0.0。",
      "这不是近似，是恒等。",
      "再看周期折叠。",
      "九十六步铺成十二行。",
      "每行八个点，是同一个相位。",
      "十二个相位，像十二个小序列。",
      "周期下采样只留每行最后四个。",
      "一半的点被扔掉。",
      "留下的都是最近的形状。",
      "最后时刻压缩最粗暴。",
      "前面八十八根直接不看。",
      "只留最后八根。",
      "连周期都不管。",
      "三种丢法，三种赌注。",
      "奇偶赌的是置换不丢信息。",
      "周期赌的是同相位的历史可加。",
      "最后时刻赌的是未来只由最近决定。",
      "三个赌注哪个赢。",
      "不能靠嘴说。",
      "要拿同一份数据量。",
      "先记住这个八。",
      "压缩比八，误差会怎样。"
    ]
  },
  {
    "id": "implementation",
    "chapter": "实现",
    "kicker": "05 / 实现",
    "title": "三个模块，一个求解器",
    "goal": "SCINet.hs · SparseTsf.hs · LastStepCompress.hs",
    "lines": [
      "三个模块，一个比一个短。",
      "SCINet.hs 的核心只有三个函数。",
      "拆分、交错、交互卷积。",
      "交互卷积每次吃两条分支。",
      "金例里输入零一二三。",
      "偶数位得到一和五。",
      "因果卷积金例是二五七。",
      "SparseTsf.hs 负责折叠。",
      "相位函数把序列按 p 取模。",
      "窗口只取每条相位的最后 w 个点。",
      "前向输出下标是 q 加 b 乘 p。",
      "金例 p 等于二时输出三十八三十二。",
      "LastStepCompress.hs 最短。",
      "只保留最后 L 步。",
      "头是线性映射。",
      "金例全一权重，历史一二三。",
      "输出六。",
      "三个模块都用同一个最小二乘求解器。",
      "正规方程加高斯消元。",
      "两个坑要记下来。",
      "第一，lscFit 要求历史宽度精确等于 L。",
      "把整窗传进去会直接报错。",
      "最后八根必须先截。",
      "第二，尖峰子集的兜底要写空列表。",
      "写成零会让元素类型错掉。",
      "编译期就拦住。",
      "测试九十套，一千一百九十五条断言。",
      "本集新增十二、十二、十。",
      "零失败。"
    ]
  },
  {
    "id": "verification",
    "chapter": "验证",
    "kicker": "06 / 验证",
    "title": "三十一项，零失败",
    "goal": "从断言到真实读数",
    "lines": [
      "三十一项检查，四组。",
      "数据七项。",
      "奇偶八项。",
      "周期八项。",
      "最后时刻八项。",
      "零失败。",
      "先看参数与乘加。",
      "奇偶的卷积核只有八个参数。",
      "稠密乘加两千三百零四。",
      "压缩后二百八十八。",
      "比值八。",
      "周期头九十六个参数。",
      "最后八根头二百一十六个。",
      "稠密头两千三百二十八个。",
      "再看测试误差。",
      "周期稀疏 0.6226。",
      "最后八根 0.7092。",
      "稠密 0.8973。",
      "常数基线 0.8249。",
      "参数最少的，误差最小。",
      "参数最多的，输给基线。",
      "这不是实现错。",
      "是六百九十个重叠窗口喂不饱。",
      "尖峰子集更清楚。",
      "周期稀疏 0.9529。",
      "最后八根 1.0071。",
      "稠密 1.1656。",
      "常数 1.2583。",
      "尖峰把差距放大。",
      "但顺序没有变。",
      "数据的口径也要报。",
      "四千零六十三根六十分钟线。",
      "一千零一十六个交易日。",
      "九百八十六个窗口。",
      "测试一百六十个。",
      "一次运行，四点七六秒。"
    ]
  },
  {
    "id": "boundary",
    "chapter": "边界",
    "kicker": "07 / 边界",
    "title": "四条边界，三笔债",
    "goal": "哪些话不能说",
    "lines": [
      "边界四条。",
      "第一，三个头是闭式拟合。",
      "不是随机梯度下降，也不是端到端训练。",
      "所以不能说 SCINet 训练收敛。",
      "只说了三个头在同一份数据上的对照。",
      "第二，数据降频。",
      "原计划五分钟线。",
      "但湖里五分钟线只剩最近五千根。",
      "不够十年窗口。",
      "改用六十分钟线。",
      "这件事写在脚本和证据里。",
      "第三，单只票。",
      "只有茅台，不跨股票。",
      "结论不外推到全市场。",
      "第四，稠密头输给基线。",
      "这是样本问题，不是线性模型的原罪。",
      "六百九十个窗口，九十六维高度相关。",
      "换更大样本，结论可能反过来。",
      "还有三笔债。",
      "算法卡没写。",
      "demo 子命令还没做。",
      "ready 的定义还散在文档里。",
      "这些不影响本集交付。",
      "但都记在账上。",
      "所以这一集仍算 ready。",
      "但只敢说三条压缩的对照。",
      "不敢说压缩一定提升预测。"
    ]
  },
  {
    "id": "outro",
    "chapter": "收尾",
    "kicker": "08 / 收尾",
    "title": "三句话带走",
    "goal": "压得最狠的，反而最准",
    "lines": [
      "三句话。",
      "奇偶拆分是唯一无损的。",
      "周期稀疏用九十六个参数。",
      "赢过两千三百二十八个。",
      "压缩不只是省算力。",
      "还顺手做了正则。",
      "尖峰上差距更明显。",
      "下一集，块嵌入与两种注意力。",
      "PatchTST 和交叉注意力解码器。",
      "九十六步切成十二个块，注意力矩阵缩到十二乘十二。",
      "第 26 集的证词是：",
      "压得最狠的，反而最准。",
      "第 26 集，完。"
    ]
  }
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

