/**
 * 《相关性与 STL：一个数说面板，一条分解说序列》—— 第 2 章 · 数据层。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-16-correlation-and-stl/voice.json";

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
    title: "相关性与 STL",
    goal: "一个数说面板，一条分解说序列",
    lines: [
      "第 2 章 · 数据层，第十六集。",
      "相关读数与 STL。",
      "一张面板，一百只票，两百五十一个交易日。",
      "书里给了一个数，把整张面板压成一行。",
      "式二点四，相关读数。",
      "同一个面板，价格和收益各算一次。",
      "一个一点零六八四，一个一点二一八八。",
      "差得不多，看起来都「快到一个半」。",
      "但把配对相关系数的方差拆出来看。",
      "价格是零点一六九三。",
      "收益是零点零一七七。",
      "差了九点六倍。",
      "读数只差零点一五。",
      "第三个数，零点一五九六。",
      "茅台三年的周内季节强度，用 STL 算。",
      "第四个，零点零零八三。",
      "同一瓶茅台，同一周期，经典分解算。",
      "两套分解，强度差十九倍。",
      "剖面形状却几乎一样。",
      "四个数，两组对照。",
      "第一组说，读数被一个饱和项压住了。",
      "第二组说，强度是相对量，换方法就换量级。",
      "这一集把这两件事各讲一遍。",
      "先拆读数，再拆分解。",
      "最后说这两个数能拿来干什么。",
      "数据、代码、证据，都在仓库里。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "两个问题，同一个毛病",
    goal: "读数里谁在动，分解给的是什么",
    lines: [
      "先说读数这一侧。",
      "书上对式二点四只有一句话。",
      "所有变量对的皮尔逊相关系数，求均值，求方差。",
      "书里就这一句。",
      "缺失值怎么处理，没说。",
      "方差是总体还是样本，没说。",
      "常数序列方差为零，相关系数没定义，没说。",
      "变量对怎么数，对称两半算不算两次，没说。",
      "四个选择，每一个都能让读数动。",
      "本仓把四个选择全部写死。",
      "记在自授条目 A 三十三里，逐条讲。",
      "但真正的问题不在这些选择上。",
      "式二点四只有两项。",
      "一项是平均相关。",
      "一项是一加方差分之一。",
      "第二项永远是零到一之间的数。",
      "方差越大，它越接近零。",
      "方差越小，它越接近一。",
      "这是一个饱和项。",
      "价格面板的方差是收益面板的九点六倍。",
      "饱和项从零点八五五走到零点九八三。",
      "只走了零点一三。",
      "剩下的差别，全被压住了。",
      "这就是第一个问题：均值和离散被压成一个数。",
      "再说分解这一侧。",
      "书上说一条序列能拆成趋势、季节、残差。",
      "季节强度按式二点二的句式定义。",
      "分子是季节，分母是季节加残差。",
      "残差是什么，取决于分解方法。",
      "换方法，同一句定义给不同的数。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "读数的零件，分解的骨架",
    goal: "均值项、饱和项、趋势项、季节项",
    lines: [
      "先把读数拆成零件。",
      "均值项，所有配对相关的算术平均。",
      "本仓价格面板是零点二一三二。",
      "收益面板是零点二三六一。",
      "两项的差，主要来自这一项。",
      "饱和项，一加方差分之一。",
      "价格面板的方差零点一六九三。",
      "饱和项零点八五五一。",
      "收益面板的方差零点零一七六六。",
      "饱和项零点九八二六。",
      "两项一加，就是读数。",
      "价格一点零六八四，收益一点二一八八。",
      "差零点一五。",
      "方差差九点六倍。",
      "读数的分辨率不在方差上。",
      "再看四个口径选择。",
      "第一，缺失值按配对完整算，不删整行。",
      "第二，变量对上三角枚举，每对只算一次。",
      "第三，方差取总体方差，除以对数。",
      "第四，一对都算不出来时，返回错误。",
      "不是返回零。",
      "这四条写进自授条目 A 三十三。",
      "再看分解怎么做。",
      "STL 三件事：趋势、相位季节、残差。",
      "趋势用 LOESS，季节在相位上用 LOESS。",
      "剩下的才是残差。",
      "内循环两轮，外循环零轮，这是默认。",
      "记在 A 三十四。",
      "书上没有 STL 的公式。",
      "公式取自 Cleveland 一九九零。",
      "窗口、带宽、端点是显式选择。",
      "季节强度，一减残差方差比去季节方差。",
      "小于零截成零。",
      "分母里的残差，看用什么分解方法。",
      "同一个句子，两个分母。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "离散度藏在分布里",
    goal: "同一个面板，两种相关分布",
    lines: [
      "为什么读数不动。",
      "把四千九百五十对相关系数画出来。",
      "价格面板，三百二十对超过零点八。",
      "一千五百三十三对是负的。",
      "收益面板，超过零点八只有四对。",
      "负相关的只有一百一十三对。",
      "同一个面板，同一批股票。",
      "价格里有一大簇强相关，也有一大簇负相关。",
      "收益里几乎全挤在零点二附近。",
      "均值几乎一样。",
      "方差差九点六倍。",
      "读数差零点一五。",
      "所以读数不是在说「相关有多强」。",
      "它在说，平均相关，加一致的奖励。",
      "一致，指的是方差小。",
      "方差小，饱和项接近一。",
      "可方差小也可以因为所有相关都为零。",
      "一组零相关的变量，读数接近一。",
      "一组高度相关的变量，方差大，读数反而掉。",
      "这就是式二点四的反直觉处。",
      "再看分解这一侧。",
      "茅台三年，七百三十个交易日。",
      "周内周期，长度五。",
      "STL 的相位剖面：负零点二六、零点三九、负三点零五。",
      "接着是零点九九、二点零三。",
      "经典分解：负零点三二、零点三八、负二点八八。",
      "接着是零点九六、一点八六。",
      "逐相位最大差零点一六六元。",
      "形态一模一样。",
      "振幅五点零七元，占均价百分之零点四。",
      "强度一个零点一六，一个零点零零八。",
      "强度不是幅度，是比例。",
      "分母换了，比例就换了。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "两个模块，一套口径",
    goal: "Correlation.hs 与 Stl.hs 怎么写",
    lines: [
      "代码在 ts-base 仓，第 2 章两个模块。",
      "相关性模块，四个导出。",
      "单对皮尔逊，配对完整面板，统计量，一步到位。",
      "关键三行：上三角枚举、配对完整、均值加饱和项。",
      "缺失哨兵是 NaN 和无穷。",
      "一对至少两个共同观测才留下。",
      "两列在共同观测上方差必须为正。",
      "否则整对丢掉，不当零参与平均。",
      "STL 模块，七个导出。",
      "配置、结果、默认、奇数化、三次核、LOESS、分解。",
      "内循环：趋势 LOESS，减掉，相位 LOESS，减掉。",
      "剩下的进残差。",
      "外循环零轮，稳健权重不开。",
      "窗口半径三周期，端点用局部线性。",
      "这些都在 A 三十四里。",
      "测试：相关性二十条，STL 十七条。",
      "全仓六十一个套件，九百一十七条断言。",
      "一个坑：合成 STL 的断言。",
      "一开始用六十个点，深内点误差二乘十的负三。",
      "为什么？端点偏差沿相位窗传进了内点。",
      "六十个点时，相位子序列只有十二个点。",
      "没有一个点离端点够远。",
      "改成两百个点，断言六十到一百三十九。",
      "误差降到二点八乘十的负十四。",
      "这不是精度问题，是测试设计问题。",
      "断言要落在方法真正成立的地方。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "四条读数，四层交叉",
    goal: "价格、收益、两条去趋势路径",
    lines: [
      "验证分四层。",
      "第一层，同一个面板四个读数。",
      "价格，均值零点二一三二，方差零点一六九三。",
      "读数一点零六八四。",
      "收益，均值零点二三六一，方差零点零一七六六。",
      "读数一点二一八八。",
      "STL 去趋势，均值零点二一二四，方差零点零二零零。",
      "读数一点一九二七。",
      "经典分解去趋势，均值零点二四九六，方差零点零一八七九。",
      "读数一点二三一二。",
      "第二层，两条去趋势路径。",
      "两条独立实现，读数差零点零三八。",
      "方差都塌到零点零二附近。",
      "塌缩不是某个实现的毛病。",
      "第三层，分布。",
      "价格超过零点八的配对三百二十三对。",
      "收益面板只有四对。",
      "负相关从一千五百三十三掉到一百一十三。",
      "第四层，单只股票。",
      "茅台 STL 季节强度零点一五九六。",
      "经典分解零点零零八三。",
      "强度差十九倍。",
      "但剖面逐相位最大差零点一六六元。",
      "不到振幅的百分之四。",
      "形状一致，强度不一致。",
      "第五层，合成数据。",
      "两百点，趋势已知，季节已知。",
      "深内段趋势误差一点八乘十的负十五。",
      "季节误差八点九乘十的负十六。",
      "恒等式误差零。",
      "二十二条证据检查，全部通过。",
      "二十条加十七条单元测试，也在里面。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "两个数，各自的边界",
    goal: "读数不当强度，强度不跨方法",
    lines: [
      "边界有三条。",
      "第一，相关读数不能当相关强度。",
      "方差差九点六倍，读数只差零点一五。",
      "读数接近上限，不代表变量一起动。",
      "它可能只是方差小。",
      "而方差小，也可能因为全都是零相关。",
      "要判断结构，得看分布，不能只看一行。",
      "第二，季节强度不能跨方法比较。",
      "零点一五九六和零点零零八三，差十九倍。",
      "剖面却是同一条。",
      "报强度必须同时报方法。",
      "跨方法比强度，比的是分母。",
      "第三，本集的口径是显式的。",
      "配对完整、上三角、总体方差、错误不补零。",
      "STL 的窗口、内循环、端点策略，都写死了。",
      "换数据、换频率、换窗口，这些数都会变。",
      "本集没有做全市场。",
      "一百只票，只是沪市主板的一个切片。",
      "也没有做预测检验。",
      "这两个数能不能改进预测，是下一章的事。",
      "能说的只有：读数机制在这里，偏差在这里。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "记住两组数",
    goal: "一集两个对照",
    lines: [
      "收尾，四个数再念一遍。",
      "读数一点零六八四，对一点二一八八。",
      "方差零点一六九三，对零点零一七六六。",
      "季节强度零点一五九六，对零点零零八三。",
      "第一组，读数被饱和项压住。",
      "第二组，强度是相对量。",
      "下一集，窗口指标与验证集选择。",
      "从一个数，走到一组指标。",
    ],
  },
;
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
