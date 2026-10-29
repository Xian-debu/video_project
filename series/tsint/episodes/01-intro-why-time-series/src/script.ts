/**
 * 《一条序列，五个问题》—— 第 1 章 · 初识时间序列。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 *
 * 本集无算法，数字来自 ts-admin 快照、六个 demo 切片、600519 日线与 cabal test。
 * 图 1.1 / 图 1.2 来自书页图版；短摘录与页码由 shared.tsx 的 Quote/Figure 统一加。
 */
import voiceJson from "../../data/tsint-01-intro-why-time-series/voice.json";

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
    kicker: "第 1 章 / 初识时间序列",
    title: "一条序列，五个问题",
    goal: "从一次数据快照，走到全部七十四集",
    lines: [
      "这一集是整部系列的地图。",
      "书的第一章没有算法，只给了定义、任务和一张方法表。",
      "它列了五个任务。",
      "预测、异常检测、分类、插值、聚类。",
      "前四个，本系列各有一条算法主线。",
      "聚类只有一句列举，没有形式化定义，不硬做。",
      "所以这一集的算法数是零。",
      "但零不等于空。",
      "它要钉住三件事。",
      "第一，五个任务分别在问什么。",
      "第二，为什么时间顺序不是普通特征。",
      "第三，屏幕上的数凭什么可复算。",
      "书把方法分成四个阶段。",
      "统计学习、机器学习、深度学习、预训练大模型。",
      "这不是四个时代，是四次偏置搬家。",
      "方程、特征、结构、数据。",
      "后面七十三集，都会回到这条主线。",
      "先从一条真实的日线说起。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 顺序不是普通的一列",
    title: "把时间抹掉，信息就没了",
    goal: "价格几乎完全自相关，收益率几乎不相关；还有一次 53 天的停牌",
    lines: [
      "这是贵州茅台从两千零一年到两千零二十六年的日线。",
      "一共六千零三十个交易日。",
      "先看一个数：价格水平的滞后一阶自相关。",
      "零点九九九五五一三。",
      "几乎等于一。",
      "意思是，今天的价格几乎就是昨天的价格。",
      "再看收益率。",
      "零点零零九八八七一。",
      "几乎等于零。",
      "同一条序列，水平值和收益率，给出完全不同的自相关。",
      "这就是非平稳。",
      "均值从一百一十三点九六，走到一千一百一十五点六三。",
      "把时间顺序打乱，价格还是价格。",
      "但预测问题已经换了一个。",
      "再看采样间隔。",
      "六千零二十九个相邻间隔里，四千七百四十二个是一天。",
      "十六个是两天，一千一百一十五个是三天。",
      "超过三天的，只有一百五十六个。",
      "最长的一次，五十三天。",
      "从二零零六年二月二十三，到四月十七。",
      "这是停牌，不是传感器掉线。",
      "把它当缺失值填掉，任务就换掉了。",
      "所以顺序、间隔、停牌，都是问题的一部分。",
      "不是预处理里可以随便抹掉的噪声。",
      "下面把定义写清楚。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "02 / 定义与分类",
    title: "一条序列，三种切法",
    goal: "式 (1.1) 的形式定义，以及五个任务各自的输出",
    lines: [
      "定义写在式一点一。",
      "X 等于 x1 到 xT 组成的向量。",
      "属于 R 的 T 乘 N。",
      "x_t 是时间戳 t 上的观测向量。",
      "T 是长度，N 是变量数。",
      "这里有三个容易混的地方。",
      "第一，t 是时间戳，不是行号。",
      "采样可以等距，也可以被事件触发。",
      "等距叫均匀采样。",
      "不等距叫非均匀采样。",
      "第二，N 等于一是单变量。",
      "N 大于一是多变量。",
      "气象站的气温是一条。",
      "四个路口一周的流量是四条。",
      "它们彼此相关，不能当成四条独立序列。",
      "第三，五个任务的输出不同。",
      "预测给未来值。",
      "异常检测给异常分数。",
      "分类给类别标签。",
      "插值补缺失值。",
      "聚类给分组。",
      "书里的图一点一画了这五个任务。",
      "同一串观测，问的问题不同，输出就不同。",
      "预测是历史序列接到预测序列。",
      "异常检测在序列里标出异常点。",
      "分类把整条序列映射到类别。",
      "插值把缺口补上。",
      "聚类把相似序列放进同一组。",
      "这些任务的评价指标也不一样。",
      "预测看误差。",
      "异常检测看命中与误报。",
      "分类看准确率。",
      "插值看缺口段误差。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "03 / 四次阶段",
    title: "不是替代，是偏置搬家",
    goal: "从方程到特征，到结构，再到数据：每一次迁移换的是先验写在哪",
    lines: [
      "方法表把几十年压成四个阶段。",
      "统计学习，代表是 ARIMA、ETS、Theta、VAR。",
      "偏置写在方程里。",
      "假设线性、平稳、误差有分布。",
      "好处是可解释，坏处是难处理非线性和多变量。",
      "机器学习，代表是 XGBoost、GBRT、随机森林、LightGBM。",
      "偏置写在特征里。",
      "人先造出滞后、滚动均值、日历特征。",
      "好处是模型多样，坏处是依赖特征工程。",
      "深度学习，代表从 MLP 到 Transformer。",
      "偏置写在结构里。",
      "卷积假设局部，循环假设递推，注意力假设全局相关。",
      "好处是自动表征，坏处是算力和数据。",
      "预训练大模型，代表是 TimesFM、Moirai、Chronos。",
      "偏置写在数据里。",
      "先在大量序列上预训练，再用少量任务数据适配。",
      "好处是泛化，坏处是可解释性和成本。",
      "这四次迁移，不是简单替代。",
      "统计模型今天还在用。",
      "深度模型也不总比树模型好。",
      "大模型更不是所有任务的默认答案。",
      "真正变的是，人把假设放在了哪里。",
      "从方程，到特征，到结构，到数据。",
      "每一次搬家，都换来了新的能力。",
      "也换走了旧的可解释性。",
      "书里没有给逐年时间线。",
      "这一集也不补年份。",
      "只把四阶段和它们的代价说清楚。",
      "下一集开始，逐个实现。",
      "先看这条管线怎么把数变成证据。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "04 / 管线",
    title: "每个数都能回到一次运行",
    goal: "湖 → 六个 CSV 切片 → manifest 指纹 → Haskell 断言",
    lines: [
      "这一集没有模型，只有一条管线。",
      "起点是本机的 ts-admin 数据湖。",
      "一条 tsa status，给出这一天的快照。",
      "日线一千七百七十六万行。",
      "分钟线一亿零五百四十三万行。",
      "五千九百一十七个标的。",
      "体积一千三百九十点六兆。",
      "从湖里导出六个演示切片。",
      "单票全历史，六千零三十行。",
      "同一只票的前复权，两千八百七十行。",
      "一百二十只票一年的面板，两万八千三百五十三行。",
      "含停牌空档的一年，二百四十四行。",
      "单只票一个月的五分钟线，九百六十行。",
      "二十只票两周的分钟面板，一万零三十二行。",
      "六个切片合计四万八千四百八十九行。",
      "每个切片都有 manifest。",
      "行数、字节、原文件 sha256。",
      "任何一个字节变了，指纹就对不上。",
      "然后进入 ts-base。",
      "用 Haskell 写实现。",
      "为什么是 Haskell。",
      "不是为了快。",
      "是为了让每条断言都能被编译器和测试判决。",
      "类型不对，编译不过。",
      "边界不对，测试不过。",
      "这一集没有新算法。",
      "但已有的一百四十二条测试全部通过。",
      "十二个模块，一个测试套件。",
      "GHC 九点十四点一，cabal 三点十六。",
      "这就是本集的账本。",
      "下面逐项对数字。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "05 / 四组数字",
    title: "每个数都能回到一次运行",
    goal: "湖快照、切片指纹、序列统计、测试计数：逐项对照，不取整",
    lines: [
      "第一组，湖快照。",
      "日线一千七百七十六万三千六百一十七行。",
      "分钟线一亿零五百四十三万五千六百八十六行。",
      "标的五千九百一十七个。",
      "体积一千三百九十点六兆。",
      "第二组，六个切片。",
      "合计四万八千四百八十九行。",
      "合计三百八十四万五千八百三十字节。",
      "六个文件，六个 sha256。",
      "第三组，六百五十九的统计。",
      "长度六千零三十。",
      "价格自相关零点九九九五五一三。",
      "收益率自相关零点零零九八八七一。",
      "最长间隔五十三天。",
      "从二零零六年二月二十三到四月十七。",
      "六千零二十九个间隔里，一百五十六个超过三天。",
      "第四组，测试。",
      "一百四十二条全部通过。",
      "十二个模块。",
      "其中第九章十一个模块，一百三十五条。",
      "core 的向量模块七条。",
      "这些数字都能回到一次运行。",
      "没有一条是手填的。",
      "本集也没有拟合结果。",
      "所以这里不比较模型。",
      "只证明管线跑通。",
      "下一个问题，这条管线不能证明什么。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "06 / 什么时候不能信",
    title: "一张地图，七条边界",
    goal: "证据等级、快照、样本、任务、性能、实现、等级",
    lines: [
      "第一条，证据等级。",
      "书的第一章没有实验。",
      "没有数据，没有代码，没有基线。",
      "这一集的数字来自本机快照，不是书的实验。",
      "所以只能标 C。",
      "第二条，快照时间。",
      "二零零六年十月二十八日之后就变了。",
      "湖每天增长，重跑会得到新行数。",
      "画面锁在这一天的 status 文件上。",
      "第三条，样本范围。",
      "一只票不是市场。",
      "面板只有一百二十只票一年。",
      "生存偏差、停牌、涨跌停都在。",
      "不能外推成市场结论。",
      "第四条，任务范围。",
      "书列五个任务。",
      "本系列只做前四个的算法主线。",
      "聚类只有名字，没有形式化定义。",
      "不把五个任务说成五条主线。",
      "第五条，性能。",
      "没有基线就不排序。",
      "没有切分、没有误差、没有对照模型。",
      "第六条，实现。",
      "Haskell 慢，这是事实。",
      "选它是为了可判决，不是为了速度。",
      "第七条，等级。",
      "C 不抬成 A，机制可复现，性能数字不可复现。",
    ],
  },
  {
    id: "outro",
    chapter: "收束",
    kicker: "07 / 一句话",
    title: "先问任务，再问模型。",
    goal: "五个任务，四次迁移，一条可复算的管线",
    lines: [
      "这一集没有算法。",
      "它给了三样东西。",
      "五个任务，四条主线。",
      "四次迁移，一个方向。",
      "一条管线，一百四十二条断言。",
      "先问任务，再问模型。",
      "先问数据，再问指标。",
      "先问证据，再问结论。",
      "第 02 集开始，进入具体算法。",
      "下一集是缺失值三法。",
      "三种补洞，先看谁在改方差。",
      "均值填充、末值填充、线性插值。",
      "每一个都有公式，也都有代价。",
      "愿你看数字时，先看它漏掉了什么。",
    ],
  },
];

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