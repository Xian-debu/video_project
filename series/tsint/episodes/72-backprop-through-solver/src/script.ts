/**
 * 《用时间换空间》—— 第 9 章 · 穿过求解器的反向传播。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json 里的实测
 * 语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 *
 * 原文图版：data/source-figures.json 里的三张书页裁图（p.217 式 9.23–9.25、
 * p.218 图 9.6、p.218 表 9.1），它们的 id 必须出现在本文件里。
 */
import voiceJson from "../../data/tsint-72-backprop-through-solver/voice.json";

export const FPS = 30;

/** 原文图版（顺序即入片顺序）。 */
export const PLATES = {
  backprop: "eq-backprop",
  adjoint: "fig-adjoint",
  complexity: "table-complexity",
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
    kicker: "第 9 章 / 神经微分方程",
    title: "一条链，两次反向",
    goal: "同一个梯度，两条完全不同的路",
    lines: [
      "这一集只有一条链。",
      "两百步显式欧拉，一个参数。",
      "初值一，步长零点零一，参数零点五。",
      "走完两百步，终点是二点七一。",
      "损失是终点的平方。",
      "现在要求，损失对参数的梯度。",
      "闭式解给出这个数。",
      "直接反传给出这个数。",
      "伴随法给出同一个数。",
      "数字一样，代价不一样。",
      "一个把每一步都存下来。",
      "一个只存检查点，其余重算。",
      "这一集，把两条路都走一遍。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 梯度与内存",
    title: "梯度从哪里来",
    goal: "为什么反传会吃掉内存，伴随法又拿什么换",
    lines: [
      "前向只有一件事：一步一步推状态。",
      "反传要做另一件事：把终点的误差送回去。",
      "直接法沿路存下每一个状态。",
      "反向时按原路取用。",
      "两百步，就存两百零一个状态。",
      "步数再大，内存跟着线性涨。",
      "实测从二十万步到两百万步，峰值内存涨了将近十二倍。",
      "伴随法不存整条路。",
      "它每二十步留一个检查点。",
      "两百步只留十一个。",
      "反向时从检查点重算一小段。",
      "内存降到常数附近，时间多花一次前向。",
      "这就是用时间换空间。",
      "问题是，换来的梯度还可信吗。",
      "先看直接法怎么推。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "02 / 链式法则与伴随方程",
    title: "把求解器摊开",
    goal: "从一步欧拉走到式 9.23 到 9.25",
    lines: [
      "把求解器摊开，它就是一条计算链。",
      "状态从 x0 走到 xT。",
      "每一步，x 加上步长乘右端项。",
      "损失只看轨迹的终点。",
      "所以终点的梯度，先从这里来。",
      "对终点求导，得到伴随变量的初值。",
      "然后一步一步往回走。",
      "每退一步，伴随变量乘上这一歩的雅可比。",
      "参数梯度把每一步的贡献加起来。",
      "这是直接法，也是标准的反传。",
      "书里把它写成式 9.23。",
      "伴随法换一个角度。",
      "它不逐歩存状态，而是让伴随量自己满足一个微分方程。",
      "式 9.24，伴随量的变化率等于负的雅可比转置乘伴随量。",
      "从终点反向积分，回到起点。",
      "参数梯度是整条轨迹上的积分，式 9.25。",
      "一个是离散递推，一个是连续反向。",
      "表 9.1 把代价写得很清楚。",
      "直接法空间随求解器调用次数线性涨。",
      "伴随法空间是常数。",
      "两者时间都是线性的。",
      "连续反向积分，还得知道整条前向轨迹。",
      "所以真正做的时候，仍然要存一些状态。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "03 / 磁带与检查点",
    title: "两种走法",
    goal: "磁带、检查点、重算，以及连续伴随的近似",
    lines: [
      "直接法像一卷磁带。",
      "前向走一遍，每一步都录下来。",
      "反向播放，按帧取状态。",
      "磁带越长，占的地方越大。",
      "伴随法像分段重跑。",
      "每二十步做一个书签。",
      "反向到一个书签，就从这里重新跑到下一段。",
      "两百步，十一个书签就够。",
      "每一段重算二十步。",
      "总计算量大约变成前向的两倍。",
      "空间只要书签和当前段。",
      "这是 checkpoint 的基本算术。",
      "再把连续版本写下来。",
      "它把离散的递推换成反向的微分方程。",
      "状态从终点退到起点。",
      "伴随量也跟着退。",
      "参数梯度沿路积分。",
      "它不需要存每一步。",
      "但反向积分本身也有误差。",
      "步长、积分器、刚性，都会进来。",
      "所以伴随法的常数空间，不是免费的。",
      "它是拿重算和数值误差，换掉磁带。",
      "这笔账，要在每一步都算清楚。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "04 / 两个 Haskell 模块",
    title: "把反传写成可测试的 Haskell",
    goal: "签名、严格向量、检查点和相对误差",
    lines: [
      "实现分两个模块。",
      "DirectGrad 走磁带。",
      "Adjoint 走检查点。",
      "两个模块的入口签名几乎一样。",
      "给右端项、两个偏导、步长、初值、步数。",
      "直接法返回一个梯度。",
      "伴随法多一个检查点间隔。",
      "磁带用严格向量，不用惰性列表。",
      "两百零一个状态，索引是常数时间。",
      "反向循环里，伴随量先乘雅可比。",
      "参数梯度再累加这一歩的贡献。",
      "顺序写反，梯度就错。",
      "伴随法先做一次前向，只收检查点。",
      "反向时从检查点重建一小段。",
      "每一段仍然用同一套递推。",
      "错方向版本，就是把符号翻过来。",
      "它用来演示漏负号的 bug。",
      "测试一共七十二條。",
      "五十条是前几集留下的。",
      "这一集新增十条直接法，十二条伴随法。",
      "没有用固定的一乘十的负九次方容差。",
      "用的是相对误差。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "05 / 五组数字",
    title: "每个数字都能回到一次运行",
    goal: "闭式、直接、伴随、差分、内存，逐项对照",
    lines: [
      "第一组：闭式解。",
      "参数零点五，走两百步。",
      "梯度是二十九点二六二九八五五零四二三三八三六。",
      "第二组：直接法。",
      "同一个梯度，末位差四乘十的负十四次方。",
      "这个差是浮点舍入，不是算法错。",
      "第三组：伴随法。",
      "它和直接法逐位相同。",
      "不是近似相等，是完全相等。",
      "因为两百步的链，每一段都精确重算。",
      "第四组：有限差分。",
      "只扰动参数，不碰求解器内部。",
      "相对误差五乘十的负十次方。",
      "它和反传互相独立，数字对上了。",
      "第五组：RK4 与连续伴随。",
      "四阶直接法对闭式，误差一乘十的负十五次方。",
      "连续伴随对闭式，误差九乘十的负十五次方。",
      "内存这一组，看峰值。",
      "二十万步到两百万步。",
      "直接法涨了将近十二倍。",
      "伴随法没有跟着涨。",
      "最后是一个彩蛋。",
      "把上一集的股票增长率代进同一条链。",
      "两百步，终点三点五四七六。",
      "梯度二十五点零一二一一四八二八二八二三二。",
      "这不是预测，只是把真实参数放进这条链。",
      "所有数字都在证据 JSON 里。",
      "提交号、命令、校验和都在。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "06 / 什么时候不能信",
    title: "什么时候不该用伴随法",
    goal: "内存、重算、刚性、可逆性和符号，五类失效条件",
    lines: [
      "现在说这一集的边界。",
      "第一类：直接法的内存。",
      "步数一大，磁带就装不下。",
      "这不是实现问题，是复杂度。",
      "第二类：伴随法的重算。",
      "省了内存，时间至少多一倍。",
      "检查点太稀，重算变长；太密，内存又上去。",
      "第三类：刚性和不连续。",
      "右端项变化太快，反向积分会失稳。",
      "分段常数的数据，导数在拐点处不存在。",
      "伴随方程也就没有定义。",
      "第四类：可逆性。",
      "连续伴随要求能把状态倒着积回去。",
      "耗散系统会丢信息，倒积会放大误差。",
      "所以实际实现仍然存轨迹，只是存得少。",
      "第五类边界：符号。",
      "伴随方程前面有一个负号。",
      "漏掉它，梯度会整体翻过来。",
      "这个错，数值上很容易看见。",
      "所以先跑小规模对照，再上大规模。",
      "下一集，把这条链放进网络里。",
    ],
  },
  {
    id: "outro",
    chapter: "收束",
    kicker: "07 / 一笔账",
    title: "用时间换空间。",
    goal: "把梯度、磁带和检查点收成一句话",
    lines: [
      "如果只记一句话。",
      "反传要梯度，也要内存。",
      "直接法存整条磁带。",
      "伴随法只存检查点，其余重算。",
      "数字一样，代价不同。",
      "选哪条路，看内存更贵，还是时间更贵。",
      "代码、证据和全部数字，都在 ts-base 仓库。",
      "下一集，把梯度穿进网络。",
    ],
  },
];

/** 讲稿节奏：中文 4.5 字/秒，句间 0.55 s，场首 1.2 s，场尾 2.2 s。 */
const CPS = 4.5;
const GAP = 0.55;
const LEAD = 1.2;
const TAIL = 2.2;
const MAX_CHARS = 44;

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
        if (cps < 3.4 || cps > 9.2) problems.push(s.id + "[" + k + "] measured " + cps.toFixed(2) + " chars/s: " + text);
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