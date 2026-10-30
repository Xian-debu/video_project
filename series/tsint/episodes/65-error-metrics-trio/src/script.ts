/**
 * 《误差三件套：同一组预测，MSE 涨 4 倍而 MAE 一动不动》—— 第 8 章 · 测评基准。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-65-error-metrics-trio/voice.json";

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
    kicker: "第 8 章 / 测评基准",
    title: "同一组预测，两种罚法",
    goal: "MSE 涨四倍，MAE 一动不动",
    lines: [
      "这一集讲三个误差指标。",
      "同一组预测，换个罚法，结论就变了。",
      "四个误差，一、一、一、一。",
      "MSE 是一，MAE 也是一。",
      "换成四、零、零、零。",
      "MSE 涨到四，MAE 还是一。",
      "大偏差被平方放大，小偏差被平均抹平。",
      "这不是数字游戏，是两种价值观。",
      "书在二百零五页给了六条公式。",
      "MSE、RMSE、MAE。",
      "还有 MPE、sMAPE、MASE。",
      "但书里没给代码，也没给数据。",
      "这一集钉三件事。",
      "平方罚和绝对罚差在哪。",
      "跨序列为什么不能只看 MAE。",
      "MASE 的分母用哪一段。",
      "先看同一组误差，两种罚法。",
      "再看二十只股票，两种排名。",
      "最后把三个指标写成可测试的代码。"
    ]
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 同一组误差",
    title: "MAE 稳，MSE 狠",
    goal: "四个小错和一个大错，谁更贵",
    lines: [
      "先做一个最小实验。",
      "两组误差，都是四个点。",
      "A 组是四个一。",
      "B 组是一个四，三个零。",
      "两组的绝对误差和都是四。",
      "所以 MAE 都是一。",
      "平方之后，A 组和是四。",
      "B 组和是十六。",
      "平均下来，MSE 从一涨到四。",
      "RMSE 开根号，从一涨到二。",
      "MAE 呢，一动不动。",
      "这不是说 MAE 更好。",
      "它只说，MAE 不区分大错和小错。",
      "四个小错和一个大错，一样重。",
      "MSE 把大错按面积放大。",
      "代价是对离群点敏感。",
      "指标不是裁判，是一个权重。",
      "选哪个，先问你要罚哪种错。",
      "再看真实数据。",
      "二十只 A 股，二零二零到二零二五。",
      "训练四年，测试两年。",
      "预测规则只有一条：昨天等于今天。",
      "按 MAE 排，工商银行最小。",
      "按 MAPE 排，长江电力第一。",
      "长江电力的 MAE 只排第六。",
      "贵州茅台 MAE 垫底，MAPE 却第四。",
      "同一组预测，两把尺，两个冠军。",
      "下面把公式写清楚。"
    ]
  },
  {
    id: "definitions",
    chapter: "定义",
    kicker: "02 / 三个指标，六条公式",
    title: "误差的三种罚法",
    goal: "平方、绝对值、比例，以及各自的基准",
    lines: [
      "三个指标，六条编号公式。",
      "先约定符号。",
      "Y_k 是真实值，F_k 是预测值。",
      "h 是预测步数。",
      "误差方向统一写成 F 减 Y，正数高估。",
      "第一条，MSE。",
      "误差平方，求和，除以 h。",
      "平方让正负不抵消。",
      "也让大误差按平方增长。",
      "第二条，RMSE。",
      "就是 MSE 开根号，量纲回到原序列。",
      "但仍然按平方罚。",
      "第三条，MAE。",
      "误差取绝对值，求和，除以 h。",
      "每个误差权重相同，更稳。",
      "但它在零点不可导，要用次梯度。",
      "再看百分比。",
      "MPE 先算 Y 减 F，再除以 Y。",
      "方向反了，正数表示低估。",
      "MAPE 取绝对值，再除以 Y 的绝对值。",
      "它把不同价格拉到同一把尺上。",
      "但 Y 等于零就爆，负数也没有意义。",
      "收益率序列不能直接算 MAPE。",
      "sMAPE 换分母，用两个绝对值的平均。",
      "上下对称，代价是上限只有百分之二百。",
      "最后一个，MASE。",
      "分子是测试段的平均绝对误差。",
      "分母是训练段的季节朴素误差。",
      "季节 s 自己指定，分母只用训练段。",
      "书里把分母写成 M 减 S。",
      "本集统一用小写 s，含义一样。",
      "六条公式写完，看它们怎么打架。"
    ]
  },
  {
    id: "intuition",
    chapter: "直觉",
    kicker: "03 / 二十只股票，两把尺",
    title: "点不沿斜线排",
    goal: "MAE 看价格，MAPE 看比例，MASE 看基准",
    lines: [
      "现在看二十只股票。",
      "横轴是 MAE，对数刻度。",
      "纵轴是 MAPE，百分比。",
      "每个点是一只股票。",
      "如果两把尺一致，点应该沿斜线排。",
      "实际不是。",
      "左边是长江电力。",
      "MAE 只有零点一八六，排第六。",
      "MAPE 只有零点六八七个百分点，排第一。",
      "右边是贵州茅台。",
      "MAE 十三点五五，垫底。",
      "MAPE 零点九三，排第四。",
      "为什么。",
      "茅台一股一千多块，十几块只占百分之一。",
      "长江电力一股二十多块，一毛八也占零点七。",
      "绝对误差看价格，百分比看比例。",
      "两把尺问的不是同一个问题。",
      "再看 MASE。",
      "二十只股票，十四只小于一。",
      "小于一，说明测试误差比训练基准还小。",
      "中位数是零点七九一七九三五。",
      "中国中免最小，零点二八。",
      "工商银行最大，二点二七。",
      "同一套规则，换只股票，结论翻过来。",
      "不要问哪个指标最好。",
      "先问你比较的是价格、比例，还是基准。",
      "下面把三个指标写成代码。"
    ]
  },
  {
    id: "implementation",
    chapter: "实现",
    kicker: "04 / 三个模块，一种写法",
    title: "先把边界写成断言",
    goal: "长度、空值、零分母，全部先报错",
    lines: [
      "代码在 ts-base，三个模块。",
      "第一个，ErrorMetrics。",
      "mse、rmse、mae 三个函数。",
      "输入两个向量，输出一个数。",
      "入口检查长度、空值和 NaN。",
      "长度不等直接报错。",
      "出现 NaN 或无穷也报错。",
      "求和用 Kahan 补偿。",
      "避免长序列的浮点累积误差。",
      "第二个，PercentageErrors。",
      "mpe、smape、mape 三个函数。",
      "默认 eps 是一乘十的负十二次方。",
      "严格版遇到 Y 小于等于零就报错。",
      "skipping 版跳过，并返回计数。",
      "全部被跳过也报错，不静默返回零。",
      "第三个，Mase。",
      "参数是季节 s、训练段、真实值、预测值。",
      "分母只从训练段算。",
      "s 小于一，报错。",
      "训练段不够两个季节，报错。",
      "分母为零，返回正无穷。",
      "不返回零，也不返回 NaN。",
      "三个模块，三十七条测试。",
      "十三条给误差三件套，十四条给百分比。",
      "十条给 MASE，全部在 cabal test 里跑。",
      "代码写完，看数字。"
    ]
  },
  {
    id: "verification",
    chapter: "验证",
    kicker: "05 / 四组数字",
    title: "每个数都能回到一次运行",
    goal: "误差例子、MASE、排序、收益率，逐项对照",
    lines: [
      "先说数据。",
      "二十只 A 股，两万八千九百四十九行。",
      "训练二零二零到二零二三。",
      "测试二零二四到二零二五。",
      "预测规则是 naive-1。",
      "第一组，误差例子。",
      "A 组 MSE 一，RMSE 一，MAE 一。",
      "B 组 MSE 四，RMSE 二，MAE 一。",
      "第二组，MASE。",
      "中位数零点七九一七九三五四一。",
      "十四只小于一。",
      "中国中免最小，零点二八一六一二四。",
      "工商银行最大，二点二七五二七七六。",
      "第三组，排序。",
      "工商银行 MAE 第一，长江电力 MAPE 第一。",
      "长江电力 MAE 第六。",
      "贵州茅台 MAE 第二十，MAPE 第四。",
      "第四组，收益率。",
      "每只四百八十三个点。",
      "茅台有二百六十五个负收益，两个零。",
      "MAPE 只能算二百一十六个点。",
      "跳过二百六十七个，超过一半。",
      "剩下这些点，MAPE 是两千零八十六。",
      "sMAPE 是百分之一百四十七点三九。",
      "这不是模型好坏，是尺子失效。",
      "三十七条测试全过，每个数回到一次运行。"
    ]
  },
  {
    id: "boundary",
    chapter: "边界",
    kicker: "06 / 什么时候不能信",
    title: "七个边界，一把尺子",
    goal: "指标能排序，但不能替你决定",
    lines: [
      "七个边界。",
      "第一，MSE 按平方罚。",
      "一个离群点能主导整个分数。",
      "第二，RMSE 和原序列同量纲。",
      "但它仍然不是绝对值平均。",
      "第三，MAE 在零点不可导。",
      "训练时要换次梯度或平滑。",
      "第四，MAPE 怕零和负数。",
      "收益率序列一半的点不能算。",
      "第五，sMAPE 有上限，最多各罚百分之二百。",
      "第六，MASE 依赖季节 s。",
      "s 选错，分母就错。",
      "训练段太短，也估不出基准。",
      "第七，二十只股票不是市场。",
      "两年测试也不是长期。",
      "这一集没有模型，只有指标。",
      "所以不给模型排名。",
      "也不说哪个指标最好。",
      "指标是尺子，不是结论。",
      "先问你要罚哪种错。",
      "再问序列有没有零。",
      "最后问基准从哪来。",
      "这三问答完，再选指标。"
    ]
  },
  {
    id: "outro",
    chapter: "收束",
    kicker: "07 / 一句话",
    title: "先问误差怎么罚",
    goal: "再问模型谁更好",
    lines: [
      "一句话。",
      "先问误差怎么罚，再问模型谁更好。",
      "三个指标，回答三个问题。",
      "平方罚、绝对罚、比例罚。",
      "一条管线，二十只股票，三十七条测试。",
      "下一集，异常检测的指标。",
      "九十九比一的数据，全判正常。",
      "准确率九十九，AUC 只有零点五。",
      "那是另一把尺的陷阱。",
      "七十四集，一百九十个算法。",
      "每集都可复算。",
      "愿你看分数时，先看它怎么罚。"
    ]
  }
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
