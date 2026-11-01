/**
 * 《注意力三件套：多头自注意力、Transformer 块、因果掩码》—— 第 3 章 · 注意力。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-21-attn-mhsa-block-masked/voice.json";

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
    kicker: "第 3 章 / 注意力",
    title: "注意力三件套",
    goal: "三行式子，和一个必须诚实的边界",
    lines: [
      "第 3 章 · 注意力，第二十一集。",
      "这一集讲注意力三件套。",
      "书里给它三行式子。",
      "剩下的全要自己补。",
      "第三件套是掩码。",
      "先说清三件事各管什么。",
      "多头自注意力，管信息混合。",
      "Transformer 块，管深度与残差。",
      "因果掩码，管不许偷看未来。",
      "书在印刷版五十三到五十六页。",
      "式三·一九到三·二一给了骨架。",
      "骨架之外，一个参数都没给。",
      "头数、维度、初始化、位置编码。",
      "还有 dropout 和训练配方。",
      "这些空缺，本仓自己定。",
      "定完还要能验证。",
      "所以我们交两样东西。",
      "一份能跑的 Haskell 实现。",
      "一份三十五项的证据清单。",
      "证据里每一项都能复跑。",
      "先看这条式子长什么样。",
      "它只有三次矩阵乘法。",
      "乘完做一次按行的 softmax。",
      "再乘值矩阵，就完了。",
      "简单得让人怀疑。",
      "但简单不等于没有坑。",
      "本集就讲这几个坑。",
      "以及我们怎么证明没掉进去。",
      "先说书的骨架缺了什么。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "骨架之外，五个空格",
    goal: "教材不是施工图",
    lines: [
      "书上的注意力只写了一行。",
      "softmax 除以根号 d_k，再乘 V。",
      "Q、K、V 从哪来，没写。",
      "多头怎么拼回去，也没写。",
      "残差和层归一化，在下一节。",
      "掩码只有半句话。",
      "这些空白不是书的错。",
      "它是教材，不是施工图。",
      "施工图得我们自己画。",
      "第一个空白是缩放。",
      "不除根号 d_k 会怎样。",
      "点积的方差随维度线性增长。",
      "维度越大，logit 越大。",
      "softmax 就越接近 one-hot。",
      "梯度被压平，训练变慢。",
      "我们实测了这个效应。",
      "别急，验证环节给数字。",
      "第二个空白是拼接顺序。",
      "四个头各算一份输出。",
      "拼回 64 维时按什么顺序。",
      "按头拼，还是按时间步交错。",
      "两种拼法都说得通。",
      "但必须和前向保持一致。",
      "这里我们摔过一次。",
      "而且是测试没抓住的那种。",
      "第三个空白是掩码。",
      "掩码写错，模型会看到未来。",
      "训练时分数好看得离谱。",
      "上线就原形毕露。",
      "所以掩码要单独验。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "从 Z 到块，四步",
    goal: "公式是本仓的施工图，不是书的原文",
    lines: [
      "先把符号钉死。",
      "输入是一个 96 乘 8 的窗口。",
      "96 个交易日，8 条序列。",
      "每条序列先做列内 z 分数。",
      "这一步只为数值稳定。",
      "然后线性映射到 64 维。",
      "记这个矩阵为 Z。",
      "Z 的形状是 96 乘 64。",
      "Q 是 Z 乘 W_q。",
      "K 是 Z 乘 W_k，V 是 Z 乘 W_v。",
      "三个权重都是 64 乘 64。",
      "打分矩阵是 Q 乘 K 转置。",
      "形状 96 乘 96。",
      "第 i 行第 j 列，是第 i 天问第 j 天。",
      "除以根号 d_k，再按行 softmax。",
      "d_k 是每个头的宽度。",
      "本仓设 4 个头，每头 16 维。",
      "四乘十六，正好六十四。",
      "每个头独立算一份注意力。",
      "四份输出并排拼回 64 维。",
      "再乘输出矩阵 W_o。",
      "这就是多头自注意力。",
      "块的第二半是前馈网络。",
      "先层归一化，再注意力，加残差。",
      "再层归一化，再前馈，加残差。",
      "前馈隐层 256 维。",
      "激活用 GELU。",
      "层归一化的 eps 是十的负五次方。",
      "现在数参数。",
      "本仓把四个头合成一个 64 乘 64。",
      "所以 Q、K、V、O 一共四个矩阵。",
      "四乘四千零九十六，一万六千三百八十四。",
      "这是注意力部分的参数。",
      "块里另外两个线性层。",
      "64 到 256，256 回 64。",
      "加偏置，共四万九千一百五十二。",
      "两项相加，四万九千九百二十。",
      "和证据里的数字一致。",
      "最后是掩码。",
      "位置 i 只能看 j 小于等于 i。",
      "j 大于 i 的位置，打分设负无穷。",
      "softmax 之后权重恰好为零。",
      "第一个 token 只能看自己。",
      "这就是因果掩码。",
      "它把矩阵的上三角抹掉。",
      "抹掉不是置零，是置负无穷。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "软查表、温度、与没训练的四个头",
    goal: "三个直觉，一个反直觉",
    lines: [
      "先建立三个直觉。",
      "第一，注意力是一次软查表。",
      "每个位置拿自己的问题去问所有位置。",
      "答案按相关度加权求和。",
      "相关度高，权重就大。",
      "这就是 Q 和 K 的分工。",
      "第二，缩放是在调温度。",
      "不缩放，softmax 太尖。",
      "缩放之后，分布更平。",
      "第三，多头是并行看几种关系。",
      "每个头有自己的 Q、K、V。",
      "理论上可以分工。",
      "但分工不是自动发生的。",
      "要训练才会分化。",
      "这一点很关键。",
      "我们的权重是初始化值。",
      "没有训练过一步。",
      "所以四个头长得差不多。",
      "熵都在六比特附近。",
      "均匀分布的上限是六点五八五。",
      "head0 是五点九八七。",
      "head1 是六点二七二。",
      "head2 是六点一六五。",
      "head3 是六点二零六。",
      "都很平，接近均匀。",
      "最后一天那一行，最大权重只有百分之四点七。",
      "它没有学到日周期。",
      "也没学到任何结构。",
      "这是事实，得说在前面。",
      "那这一集还验什么。",
      "验机制，不验效果。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个模块，三处易错",
    goal: "形状链、softmax、拼接顺序与掩码",
    lines: [
      "实现拆成三个模块。",
      "Mhsa 管多头自注意力。",
      "TransformerBlock 管残差与归一化。",
      "MaskedAttn 管因果掩码。",
      "先看前向的形状链。",
      "96 乘 8，映射成 96 乘 64。",
      "四个头各得 96 乘 96 的权重。",
      "拼回 96 乘 64，再过 W_o。",
      "块输出还是 96 乘 64。",
      "三处容易写错。",
      "第一处，softmax 要按行减最大值。",
      "不然 exp 会溢出。",
      "第二处，缩放要乘在 softmax 之前。",
      "除根号 d_k，别忘。",
      "第三处，拼接顺序必须固定。",
      "我们改过一次。",
      "前向先按时间步交错拼。",
      "求导那边还按头拼。",
      "两边各自自洽，梯度检查照样过。",
      "但和整体前向对，对不上。",
      "第一次跑，误差是三点九六。",
      "改完降到二点六乘十的负十次方。",
      "这是本集最值钱的坑。",
      "测试自洽，不等于实现对。",
      "掩码那边也一样。",
      "上三角设负无穷，不是设零。",
      "设零，softmax 会给它权重。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "三十五项检查，零失败",
    goal: "数据、结构、梯度、真实窗口",
    lines: [
      "证据程序跑出三十五项检查。",
      "六项查数据，十九项查结构。",
      "两项查梯度，八项查真实窗口。",
      "全部通过，零失败。",
      "先说数据本身。",
      "窗口九十六行，八列。",
      "从二零二五年八月十二日。",
      "到十二月三十一日。",
      "sha256 是 19a81d77 开头。",
      "文件九千五百六十五字节。",
      "六只股票加两个指数。",
      "内连接后取最后九十六个交易日。",
      "结构检查先看行和。",
      "每行 softmax 权重和等于一。",
      "误差在十的负十二次方以内。",
      "再看置换等变。",
      "把输入行打乱，输出同样打乱。",
      "误差精确是零。",
      "这是没有位置编码的必然结果。",
      "然后看零块。",
      "把注意力和前馈权重全设零。",
      "块退化成两次层归一化。",
      "逐行误差是零。",
      "参数计数也要对。",
      "注意力一万六千三百八十四。",
      "块矩阵四万九千一百五十二。",
      "合计四万九千九百二十。",
      "三项都和公式对上。",
      "掩码检查三项。",
      "严格上三角，权重和恰为零。",
      "前三个 token 的输出不变。",
      "第一个 token 只 attend 自己。",
      "梯度检查用了二百五十六个参数。",
      "中心差分，步长十的负五次方。",
      "最大误差二点六二乘十的负十次方。",
      "门槛是十的负六次方。",
      "还做了五步梯度下降。",
      "损失从五点八三降到零点六八。",
      "学习率零点零五。",
      "最后是缩放消融。",
      "缩放后的最大 logit 是五点七一四。",
      "不缩放是二十二点八五八。",
      "熵是六点一五八比特。",
      "不缩放掉到四点一一七比特。",
      "注意，没有出现 NaN。",
      "双精度下它只是变尖。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "十条边界，一条勘误",
    goal: "把不能说的先说清楚",
    lines: [
      "现在划边界。",
      "第一，没有训练。",
      "所有头都是初始化权重。",
      "注意力接近均匀，这很正常。",
      "不能说它学到了日周期。",
      "也不能拿它做预测。",
      "第二，块没有解析梯度。",
      "只有多头注意力写了反向传播。",
      "块的梯度检查，本集不做。",
      "这是明确的空白，不是遗漏。",
      "第三，没有预测头。",
      "没有回测，没有准确率。",
      "本集只回答机制对不对。",
      "第四，只有一个窗口。",
      "九十六天，八条序列。",
      "换个市场，结论要重验。",
      "第五，没有位置编码。",
      "置换等变是设计性质。",
      "要顺序信息，得另外加。",
      "第六，书里没有的部分，我们补了。",
      "补的部分是本仓的选择。",
      "不是书的标准答案。",
      "第七，双精度不会 NaN。",
      "计划草稿里写的会炸，是错的。",
      "真实效应是饱和与熵塌缩。",
      "这个错误已经写进勘误表。",
      "第八，证据里的 commit 是 b1f9322。",
      "那是证据提交本身。",
      "summary.json 里写的是 19ba447。",
      "因为二进制在那之前编好。",
      "这个差异也写在文档里。",
      "第九，A7 卡片还没写。",
      "留到 W 阶段统一补。",
      "第十，演示 CLI 还是规划中。",
      "现在只有证据子命令。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "下一集，概率与损失",
    lines: [
      "三件套讲完了。",
      "一句话各记一句。",
      "多头自注意力，软查表加并行。",
      "块，残差加深，归一化稳住。",
      "掩码，把未来从打分里删掉。",
      "验证的核心是互相对照。",
      "自洽的测试救不了错的实现。",
      "所以证据要跨层对。",
      "下一集换到概率。",
      "负对数似然、分位数、CRPS。",
      "我们下集见。",
      "就讲到这里。",
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
