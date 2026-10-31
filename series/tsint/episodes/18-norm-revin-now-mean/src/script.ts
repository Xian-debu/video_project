/**
 * 《归一化三兄弟：RevIN、NowNorm、MeanNorm》—— 第 3 章 · 预测层。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-18-norm-revin-now-mean/voice.json";

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
    kicker: "第 3 章 / 预测层",
    title: "归一化三兄弟",
    goal: "RevIN、NowNorm、MeanNorm",
    lines: [
      "第 3 章 · 预测层，第十八集。",
      "归一化三兄弟：RevIN、NowNorm、MeanNorm。",
      "上一集把窗口、指标、选模做完。",
      "这一集只问一件事。",
      "输入进模型之前，要不要先减去什么。",
      "书里给了三个名字，三句话。",
      "可逆实例归一化，先减均值，再除标准差。",
      "输出之后，按同一组统计量变回来。",
      "名字里的可逆，说的是这一步能精确还原。",
      "NowNorm 更简单，只减最后一个观测值。",
      "MeanNorm 只减均值，不做除法。",
      "三个人做的是同一件事。",
      "先减掉一个基准，让模型只看变化。",
      "差别只在基准是什么。",
      "先给四个数。",
      "第一个，量纲差。",
      "茅台均价五千五百九十六元，工行八点五元。",
      "差六百五十八点七倍。",
      "第二个，合成序列上有漂移时。",
      "二十四步平均绝对误差，NowNorm 零点九七。",
      "MeanNorm 两点零九。",
      "差二点一五倍。",
      "第三个，把趋势去掉再跑。",
      "排序反过来。",
      "NowNorm 一点零零，MeanNorm 零点五二。",
      "差一点九三倍。",
      "第四个，真实的上证指数。",
      "二十四步误差，NowNorm 七十六点五五。",
      "RevIN 八十二点二五，MeanNorm 八十四点八八。",
      "四个数，两组对照。",
      "第一组，基准选错，误差差一倍。",
      "第二组，基准选对，排序还能翻过来。",
      "所以这一集的论点是。",
      "归一化不是预处理，是模型的一部分。",
      "减什么，就是在问模型该对什么不变。",
      "减均值，模型对平移不变。",
      "减末值，模型对水平位置不变。",
      "减去再除以标准差，平移和尺度都不变。",
      "书里没有这句总结，但三个名字都在回答它。",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "02 / 问题",
    title: "三句话，五个没答",
    goal: "书里的归一化只有文字",
    lines: [
      "书里关于归一化，只有三句话。",
      "四十五页，讲 NLinear。",
      "先用序列的最后一个值减去输入。",
      "过一个线性层，再加回来。",
      "四十六页，讲 SparseTSF。",
      "减去序列本身的均值，输出之后再加回。",
      "再加一句，大多数模型采用可逆实例归一化。",
      "会引入一个带参数的仿射变换。",
      "书上就这些。",
      "书里没有公式。",
      "减均值，是减整条序列的均值，还是窗口的均值。",
      "除标准差，标准差是哪一个。",
      "方差接近零的时候，除出来是无穷，怎么办。",
      "仿射的两个参数，初值是什么。",
      "可逆的时候，用哪一组统计量反变换。",
      "五个问题，书里一个都没答。",
      "表三点一里，六个模型的归一化各不相同。",
      "TSMixer、RLinear、TimeMixer，用可逆实例归一化。",
      "NLinear 用 NowNorm。",
      "SparseTSF 用 MeanNorm。",
      "DLinear 什么都不用。",
      "FITS 用实例归一化，但没有仿射。",
      "六行表格，五种做法。",
      "书里没有一段文字比较它们。",
      "所以这一集要补两件事。",
      "第一，把三种归一化写成能跑的公式。",
      "第二，找一个能把它们分开的实验。",
      "实验的答案不在公式里。",
      "答案在数据的漂移里。",
    ],
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "03 / 定义",
    title: "三个基准，一套骨架",
    goal: "公式来自原论文，骨架统一",
    lines: [
      "先写公式。书上没有，按原论文实现。",
      "RevIN，对窗口里的四十八个点。",
      "先减窗口均值，再除窗口标准差。",
      "标准差里加一个极小值 eps，取一万分之一。",
      "这里和第二章不一样。",
      "第二章是 sigma 加 eps，这里是先平方再开方。",
      "只在方差接近零的时候，两个口径才有区别。",
      "仿射变换，乘 gamma 加 beta。",
      "两个参数都可学，本仓默认关掉。",
      "关掉的时候，gamma 等于一，beta 等于零。",
      "反变换，乘回标准差，加回均值。",
      "NowNorm，减窗口最后一个值。",
      "一个数，没有除法。",
      "反变换，加回同一个数。",
      "它假设窗口的水平位置，由末值代表。",
      "做预测时，这句话等于说：明天从今天出发。",
      "MeanNorm，减窗口均值，不除。",
      "反变换，加回同一个均值。",
      "它假设窗口的中心是均值。",
      "序列往上走的时候，均值在窗口中间。",
      "末值在窗口右端。",
      "两个基准之间，差半个窗口的漂移量。",
      "骨架统一：减基准，过线性层，再加回。",
      "线性层共享权重，四十八进，二十四出。",
      "参数一千一百七十六个。",
      "一千一百五十二个权重，二十四个偏置。",
      "训练协议书里没有，本仓写死。",
      "Adam，学习率五千分之一，批三十二。",
      "四十轮上限，耐心八轮。",
      "随机种子固定，结果可复跑。",
      "每一窗的基准只用输入段算。",
      "不看标签，这一条是防泄漏的底线。",
    ],
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "04 / 直觉",
    title: "基准跟不跟得上",
    goal: "漂移时末值赢，平稳时均值赢",
    lines: [
      "先看基准在窗口里的位置。",
      "一条带漂移的序列，输入四十八点，预测二十四点。",
      "窗口均值在中间，像一条水平线。",
      "末值在右端，是一个点。",
      "序列往上走，均值落后于末值。",
      "用均值当基准，模型要自己补上这段差。",
      "用末值当基准，这段差已经减掉了。",
      "合成序列，斜率零点零五，加一个周期，加噪声。",
      "每一步漂移零点零五，四十八步就是两点四。",
      "二十四步预测的平均绝对误差。",
      "NowNorm 零点九七。",
      "MeanNorm 两点零九。",
      "差二点一五倍。",
      "把趋势项去掉，只留周期和噪声。",
      "同样的两个模型，同一组参数初始化。",
      "NowNorm 一点零零。",
      "MeanNorm 零点五二。",
      "差一点九三倍。",
      "排序翻转了。",
      "唯一变的，是基准跟不跟得上序列。",
      "这就是这一集的核心。",
      "归一化选的是假设，不是精度。",
      "换成真实数据，上证指数。",
      "三千八百六十七个交易日，切出窗口。",
      "三条曲线随视野上升。",
      "第一点，NowNorm 最低。",
      "到第二十四步，七十六点五五。",
      "RevIN 八十二点二五。",
      "MeanNorm 八十四点八八。",
      "顺序是 NowNorm、RevIN、MeanNorm。",
      "指数比合成序列更平滑，漂移也更持续。",
    ],
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "05 / 实现",
    title: "三个文件，一个骨架",
    goal: "每个模块只差 base 怎么算",
    lines: [
      "代码拆成三个文件，骨架一样。",
      "Revin.hs，核心三行。",
      "先算窗口均值和方差。",
      "除以根号下方差加 eps。",
      "反变换，乘标准差，加均值。",
      "仿射是可选项，默认 Nothing。",
      "关闭时 gamma 等于一，beta 等于零。",
      "配置和函数分开，测试好写。",
      "NowNorm.hs 和 MeanNorm.hs 各一个函数。",
      "减基准，跑线性层，加回来。",
      "差别只有 base 怎么算。",
      "lastBase 取最后一个元素。",
      "meanBase 就是窗口均值。",
      "两行代码，换一个假设。",
      "训练用上一集的 TrainLoss，没有改。",
      "线性层共享权重，四十八乘二十四。",
      "参数一千一百七十六。",
      "测试六十七组，九百六十五个断言。",
      "这一集加了二十个。",
      "RevIN 八条，NowNorm 六条，MeanNorm 六条。",
      "每个模块都测三件事：往返、平移、常数窗。",
      "往返必须精确到零。",
      "不是小于阈值，是等于零。",
      "因为减掉再加回来，浮点上没有理由留误差。",
    ],
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "06 / 验证",
    title: "四层验证，零失败",
    goal: "恒等式、eps、量纲、对比",
    lines: [
      "验证第一层，恒等式。",
      "四个数都是零。",
      "RevIN 往返，零。",
      "仿射往返，零。",
      "NowNorm 平移零，MeanNorm 单位层零。",
      "常数窗，五个五，输出全零。",
      "反变换还原五点零。",
      "末值定位，末值三点零，输出三点零。",
      "第二层，eps 与仿射。",
      "方差一，eps 零，还原精确到一。",
      "eps 一万分之一，差就是一万分之一。",
      "这个数小到不影响读数。",
      "但让零方差不出无穷。",
      "仿射默认关，gamma 等于零也不炸。",
      "因为反变换先乘标准差，再乘 gamma。",
      "第三层，量纲。",
      "茅台均价五千五百九十六，工行八点五。",
      "比六百五十八点七。",
      "不归一化，茅台二十四步误差九百六十四元。",
      "归一化后，四百八十二元。",
      "工行不归一化，零点九五元。",
      "归一化后，零点三六元。",
      "归一化之后，两个序列在模型眼里几乎一样大。",
      "输入比，零点九九五。",
      "误差还是差三个数量级。",
      "因为量纲最后被加回来了。",
      "第四层，合成对比。",
      "漂移时，NowNorm 零点九七，MeanNorm 两点零九。",
      "无趋势时，NowNorm 一点零零，MeanNorm 零点五二。",
      "两组数，排序相反。",
      "这不是模型变强了。",
      "是假设对上了数据。",
      "第五层，真实指数和总账。",
      "指数二十四步，七十六点五五、八十二点二五、八十四点八八。",
      "成交量上，两种归一化只差百分之一。",
      "归一化不解决可预测性，只解决尺度。",
      "二十八项检查，零失败。",
      "六十七组套件，九百六十五个断言。",
    ],
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "07 / 边界",
    title: "三条边界，两处偏差",
    goal: "归一化不是万灵药",
    lines: [
      "边界三条，先说清楚。",
      "第一，归一化不创造信息。",
      "减掉基准，也减掉了一部分可预测的信号。",
      "成交量上，两种归一化只差百分之一。",
      "这是最直接的证据。",
      "第二，模型是单变量线性层。",
      "四十八个输入，二十四个输出，没有非线性。",
      "结论只在这个容量下成立。",
      "第三，四十轮不是收敛保证。",
      "早停耐心八轮，只说明这份数据够用。",
      "还有两处口径偏差。",
      "简报里的手算例子写四，实际是一。",
      "因为一减三乘一加三，等于一。",
      "简报里的量纲写三百二十倍。",
      "那是未复权口径，后复权是六百五十八点七。",
      "两处都记在自授条目里。",
      "最后五条不做。",
      "不做多变量，不做非线性。",
      "不做多种子，不做超参搜索。",
      "不拿测试集调归一化。",
      "所有数字都能在证据包里查到。",
    ],
  },
  {
    id: "outro",
    chapter: "收尾",
    kicker: "08 / 收尾",
    title: "三句话带走",
    goal: "下一集，线性模型复兴",
    lines: [
      "收尾，三句话。",
      "第一，归一化是模型的一部分，不是预处理。",
      "第二，减什么，就是选什么不变量。",
      "第三，漂移选末值，平稳选均值。",
      "下一集，线性模型复兴。",
      "共享权重线性、DLinear、FITS。",
      "参数少，结构简单。",
      "归一化这一层已经铺好，下一集直接用。",
      "数字、代码、证据，都在仓库里。",
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

