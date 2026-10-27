/**
 * 《卷积码：GSM 如何在噪声里听清你》—— 信道编码的一次完整拆解。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕，时间点由实测语音时长（data/convcode/voice.json）
 * 决定；没有实测时退回字数估算，所以脚本可以先写、后配音。
 *
 * 原文图版：data/source-figures.json 里的四张 3GPP TS 45.003 截图，在片子里以「原文」角标出现。
 * 它们的 id 必须出现在本文件里：content 的 plates 门禁与 engine 的 film_coverage 都读这里。
 */
import voiceJson from "../../data/convcode/voice.json";

export const FPS = 30;

/** 原文图版（顺序即入片顺序）。 */
export const PLATES = {
  parity: "plates/parity",
  convEncoder: "plates/conv-encoder",
  interleave: "plates/interleave",
  annexB: "plates/annexb",
} as const;

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
    kicker: "GSM / 信道编码",
    title: "声音变成比特，然后穿过噪声",
    goal: "从一段三十年前的手机通话说起",
    lines: [
      "先听一段三十年前的手机通话。",
      "声音被压成每秒五十帧，每帧两百六十个比特。",
      "这些比特要穿过空气，而空气里全是噪声。",
      "噪声会把零翻成一，也会把一翻成零。",
      "一旦翻错，对面听到的就是杂音。",
      "一九九零年代的 GSM，想了一个办法。",
      "不靠更强的发射功率，靠多加一点结构。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 冗余的代价",
    title: "多加一点，换回很多",
    goal: "信道编码要解决的是什么问题",
    lines: [
      "这个办法叫信道编码。",
      "思路很朴素：在信息里加冗余。",
      "就像寄信时多写一遍地址。",
      "收信人看到两行地址，有一行错了也能猜对。",
      "但冗余不能白加，它要占带宽。",
      "所以工程上的问题是：用最少的冗余，换最多的可靠。",
      "先看一段没有编码的链路。",
      "信噪比零 dB 时，一百个比特里错八个。",
      "这样的错误率，语音已经很难听清。",
    ],
  },
  {
    id: "spec",
    chapter: "标准",
    kicker: "02 / TS 45.003",
    title: "标准里的那张图",
    goal: "GSM 全速率语音信道怎么切分一帧",
    lines: [
      "GSM 的答案写在 3GPP TS 45.003 里。",
      "一张图，把语音、信道编码、交织串了起来。",
      "先看全速率语音信道，TCH/FS。",
      "一帧两百六十个比特，分成两类。",
      "一类一百八十二位，二类七十八位。",
      "一类更怕错，因为它是语音里最重要的部分。",
      "所以只保护一类，二类原样发出去。",
      "一类里再挑出最重要的五十位，加三个校验位。",
      "这一步是检错：翻了错误，能知道自己翻了。",
      "剩下的交给卷积码。",
    ],
  },
  {
    id: "encoder",
    chapter: "编码",
    kicker: "03 / 一个比特变两个",
    title: "四位记忆，两次异或",
    goal: "速率一比二的卷积码到底在算什么",
    lines: [
      "卷积码的核心，是一个四位的记忆。",
      "每来一个比特，它和记忆里的四位一起算两个输出。",
      "两个输出，一个来自多项式 G0，一个来自 G1。",
      "G0 是 1 加 D 三次方加 D 四次方。",
      "G1 多一项 D，也就是多看一眼上一位。",
      "所以一个输入比特，变成两个编码比特。",
      "速率是一比二，约束长度是五。",
      "图上这段公式，就是标准的原文。",
      "一帧一百八十九个输入，编出三百七十八位。",
      "再加四位的尾巴，把记忆清零。",
    ],
  },
  {
    id: "trellis",
    chapter: "解码",
    kicker: "04 / 维特比",
    title: "十六个状态，一条最像的路",
    goal: "接收端怎么从可能出错的比特里找回信息",
    lines: [
      "可是接收端只看到一串可能出错的比特。",
      "怎么从里面找回原来的信息？",
      "把编码器的所有状态画出来，就是网格图。",
      "四位记忆，一共十六个状态。",
      "每走一步，从当前状态出发，有两条路。",
      "一条输入零，一条输入一。",
      "接收端要做的事，是找一条最像收到的路。",
      "这就是维特比算法。",
      "它不需要记住所有路径，只记住每个状态最好的一条。",
      "每一步淘汰一半，计算量就下来了。",
      "软判决保留置信度，硬判决只剩零和一。",
      "所以软判决更准，代价是多一点存储。",
    ],
  },
  {
    id: "interleave",
    chapter: "交织",
    kicker: "05 / 把错误摊开",
    title: "鸡蛋不要放在一个篮子里",
    goal: "为什么编码之后还要再打乱一次",
    lines: [
      "还有一步，容易被忽略：交织。",
      "无线信道里的错误，常常是成串来的。",
      "一阵干扰，可能连翻几十个比特。",
      "如果这些错误挤在同一帧里，卷积码也救不回来。",
      "GSM 的办法是，把一帧的比特摊到八个突发上。",
      "每个突发只带五十七位，来自这一帧。",
      "连续的错误被切碎，分到不同帧里。",
      "这就像把鸡蛋分开放进八个篮子。",
      "标准里写成块对角交织，深度是四。",
      "代价是延迟：一帧要等八个突发才收齐。",
    ],
  },
  {
    id: "demo",
    chapter: "实测",
    kicker: "06 / 复现",
    title: "到底好多少，跑一遍",
    goal: "同样一套参数，在加性白噪声里量出误比特率",
    lines: [
      "说了这么多，实际能好多少？",
      "我用 Python 复现了这个编码器。",
      "速率一比二，约束长度五，多项式二十三和三十三。",
      "在加性白噪声里，每个点发了七十五万个比特。",
      "横轴是信噪比，纵轴是误比特率。",
      "不编码的曲线最靠右。",
      "硬判决维特比在中间。",
      "软判决维特比最靠左。",
      "在千分之一的误码率上，不编码要 6.8 dB。",
      "硬判决只要 5.2 dB，省 1.6 dB。",
      "软判决只要 3.2 dB，省 3.6 dB。",
      "再看纠错：一帧 456 位里翻 20 个。",
      "硬判决维特比还能救回八成。",
      "翻到 30 个，就只剩三成。",
    ],
  },
  {
    id: "impl",
    chapter: "实现",
    kicker: "07 / 剩下的活",
    title: "算法很短，工程很长",
    goal: "写出来要多少代码，难在哪里",
    lines: [
      "实现起来，其实不复杂。",
      "编码器就是一个移位寄存器，加几次异或。",
      "一帧三百七十八个输出，几百次操作。",
      "解码器复杂一些，但也可以写得很短。",
      "每个状态保留一条幸存路径，每一步更新一次。",
      "真正的工程难点，是定点化和吞吐。",
      "GSM 时代，这些要在 DSP 上实时跑完。",
      "今天同样的算法，躺在每一部手机里。",
      "从 GSM 到 LTE，卷积码换成了 Turbo 码。",
      "到 5G，又换成了 LDPC。",
      "但那条思路没变：加结构，换可靠。",
    ],
  },
  {
    id: "outro",
    chapter: "结语",
    kicker: "08 / 回到噪声",
    title: "它不显眼，却撑着你",
    goal: "把镜头拉回开头那段通话",
    lines: [
      "回到开头那段通话。",
      "噪声还在，比特还是会翻。",
      "但因为有这层结构，翻错的能被找回来。",
      "这就是信道编码。",
      "它不显眼，却撑着每一次无线通信。",
      "下次信号不好时，可以想起这张网格图。",
    ],
  },
];

/** 讲稿节奏：中文 4.5 字/秒，句间 0.55 s，场首 1.2 s，场尾 2.2 s。 */
const CPS = 4.5;
const GAP = 0.55;
const LEAD = 1.2;
const TAIL = 2.2;
const MAX_CHARS = 34;

const MEASURED = voiceJson as Record<string, number>;
const LINE_PAD = 0.35;
const MIN_LINE = 1.4;

const round2 = (v: number) => Math.round(v * 100) / 100;

type Scene = SceneSpec & { dur: number; start: number; chapterIndex: number };
type Line = { start: number; dur: number; speech: string; scene: string; index: number };

const problems: string[] = [];

const built: { scenes: Scene[]; lines: Line[] } = (() => {
  const scenes: Scene[] = [];
  const lines: Line[] = [];
  let cursor = 0;
  SPEC.forEach((s, i) => {
    s.lines.forEach((text, k) => {
      if (text.length > MAX_CHARS) problems.push(s.id + "[" + k + "] " + text.length + " chars: " + text);
      if (text.length < 8) problems.push(s.id + "[" + k + "] too short: " + text);
      const said = MEASURED[s.id + "#" + k];
      if (said) {
        const cps = text.length / said;
        if (cps < 3.6 || cps > 9.0) problems.push(s.id + "[" + k + "] measured " + cps.toFixed(2) + " chars/s: " + text);
      }
    });
    const durs = s.lines.map((t, k) => {
      const said = MEASURED[s.id + "#" + k];
      return Math.max(MIN_LINE, (said ?? t.length / CPS) + LINE_PAD);
    });
    const speech = durs.reduce((a, b) => a + b, 0) + GAP * Math.max(0, s.lines.length - 1);
    const dur = round2(LEAD + speech + TAIL);
    const start = round2(cursor);
    scenes.push({ ...s, dur, start, chapterIndex: i + 1 });
    let t = start + LEAD;
    s.lines.forEach((text, k) => {
      lines.push({ start: round2(t), dur: round2(durs[k]), speech: text, scene: s.id, index: k });
      t += durs[k] + GAP;
    });
    cursor += dur;
  });
  return { scenes, lines };
})();

export const SCENES = built.scenes;
export const LINES = built.lines;
export const SCRIPT_PROBLEMS = problems;
export const TOTAL_SEC = round2(SCENES.reduce((a, s) => a + s.dur, 0));
export const TOTAL = Math.round(TOTAL_SEC * FPS);

export const STARTS: Record<string, number> = (() => {
  const o: Record<string, number> = {};
  for (const s of SCENES) o[s.id] = Math.round(s.start * FPS);
  return o;
})();

export const CAPTIONS = LINES.map((l) => ({ from: l.start, to: l.start + l.dur, text: l.speech }));

export const linesOf = (id: string) => LINES.filter((l) => l.scene === id);
export const sceneOf = (id: string) => SCENES.find((s) => s.id === id)!;
export const within = (id: string, k: number) => {
  const ls = linesOf(id);
  const l = ls[Math.min(ls.length - 1, Math.max(0, k))];
  return l.start - sceneOf(id).start;
};
export const frameOf = (id: string, k: number) => Math.round(within(id, k) * FPS);
