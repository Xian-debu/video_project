/**
 * 《不平衡数据上的三门考卷：Acc 0.99 的模型其实什么都没学到》—— 第 8 章 · 测评基准。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点优先用 data/<film.id>/voice.json
 * 里的实测语音长度，没有实测时按字数估，所以可以先写稿、后配音。
 */
import voiceJson from "../../data/tsint-66-anomaly-metrics-auc/voice.json";

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
    "kicker": "第 8 章 / 测评基准",
    "title": "满分、随机、废",
    "goal": "同一份预测，三个指标，三种判决",
    "lines": [
      "这一集讲三把尺子。",
      "同一份数据，三个指标，三种判决。",
      "九十九个正常，一个异常。",
      "模型全判正常。",
      "准确率零点九九，看起来满分。",
      "ROC-AUC 是零点五，等于随机猜。",
      "AP 是零点零一，等于正类比例。",
      "一个模型，三个分数，谁在说谎。",
      "书在二百零六页写得很清楚。",
      "AUC 等于零点五，就是随机猜测。",
      "但如果只看准确率，它像满分。",
      "这一集钉三件事。",
      "准确率在不平衡数据上会骗人。",
      "ROC 和 PR 曲线怎么读。",
      "三个指标怎么写成可测代码。",
      "先看一个九十九比一的样本。",
      "再看两万三千八百二十九个真实点。",
      "最后看二十只股票，谁排第一。",
      "同一份预测，三把尺子。",
      "先问谁在少数。"
    ]
  },
  {
    "id": "problem",
    "chapter": "问题",
    "kicker": "01 / 不平衡的样本",
    "title": "全判正常，准确率九十九",
    "goal": "多数类撑起准确率，少数类决定任务",
    "lines": [
      "全判正常，准确率九十九。",
      "一百个样本，一个正类。",
      "预测全部是正常。",
      "混淆矩阵：真阳零、假阳零。",
      "假阴一，真阴九十九。",
      "准确率等于九十九除以一百。",
      "零点九九。",
      "但召回率是零。",
      "一个异常都没抓到。",
      "精确率没有定义。",
      "因为模型从没预测过正类。",
      "F1 也是零。",
      "准确率给了满分，召回率给了零分。",
      "换到真实数据。",
      "两万三千八百二十九个点。",
      "正类两千两百一十七个。",
      "占百分之九点三。",
      "全判正常，准确率九十点七。",
      "还是很高。",
      "但漏掉两千两百一十七个异常。",
      "这就是不平衡数据的陷阱。",
      "多数类撑起准确率。",
      "少数类决定任务。",
      "所以要看排序，不只看阈值。",
      "AUC 和 AP 都在问同一件事。",
      "正类排得够不够前。"
    ]
  },
  {
    "id": "definitions",
    "chapter": "定义",
    "kicker": "02 / 三个指标",
    "title": "四个计数，三条曲线",
    "goal": "从混淆矩阵到 ROC 与 PR",
    "lines": [
      "先把四个计数写清楚。",
      "真阳、假阳、假阴、真阴。",
      "精确率等于真阳除以真阳加假阳。",
      "召回率等于真阳除以真阳加假阴。",
      "准确率等于真阳加真阴除以总数。",
      "F1 是精确率和召回率的调和平均。",
      "书里给了式八点七到八点十。",
      "这四个都依赖一个阈值。",
      "换个阈值，四个数全变。",
      "ROC 曲线把阈值全扫一遍。",
      "横轴是假阳率。",
      "纵轴是真阳率。",
      "曲线下的面积就是 AUC。",
      "AUC 零点五，随机。",
      "AUC 一，完美排序。",
      "它只看排序，不看阈值。",
      "PR 曲线换两个轴。",
      "横轴召回率，纵轴精确率。",
      "曲线下的面积叫 PR-AUC。",
      "平均精确率 AP 是它的阶梯版。",
      "AP 的随机基线不是零点五。",
      "是正类比例。",
      "这里正类占百分之九点三。",
      "所以 AP 零点零九三才算随机。",
      "三个指标，三种问法。",
      "准确率问：猜对多少。",
      "AUC 问：排得对不对。",
      "AP 问：前面抓得准不准。",
      "书里只给定义，没给实现。",
      "本集把三个都写成代码。",
      "边界也要写进去。",
      "空集、单类、NaN，都要有答案。"
    ]
  },
  {
    "id": "intuition",
    "chapter": "直觉",
    "kicker": "03 / 排序与阈值",
    "title": "曲线只比随机高一点",
    "goal": "AUC 零点五四，AP 零点一一",
    "lines": [
      "看真实的 ROC 曲线。",
      "横轴假阳率，纵轴真阳率。",
      "对角线是随机猜。",
      "这条曲线只比对线高一点。",
      "AUC 零点五四零八。",
      "比随机高零点零四。",
      "二十只股票里，十五只超过零点五。",
      "中位数零点五五八。",
      "最高工商银行，零点七九八。",
      "最低中国中免，零点四六五。",
      "同一个分数，换只股票就翻车。",
      "再看 PR 曲线。",
      "横轴召回率，纵轴精确率。",
      "底部虚线是正类比例。",
      "曲线大部分贴着底部。",
      "AP 零点一一二一。",
      "是随机基线的一点二倍。",
      "不算零，也远谈不上好。",
      "注意这两张图讲的是同一份分数。",
      "ROC 看起来还行。",
      "PR 看起来很差。",
      "因为 PR 关心前面。",
      "正类少的时候，前面全是假阳。",
      "精确率就掉下来。",
      "两个指标不矛盾。",
      "它们在问不同的问题。"
    ]
  },
  {
    "id": "implementation",
    "chapter": "实现",
    "kicker": "04 / 三个模块",
    "title": "先把边界写成断言",
    "goal": "分母为零、单类、并列分数",
    "lines": [
      "三个模块，四十六条断言。",
      "第一个是混淆矩阵。",
      "四个计数用整数。",
      "精确率、召回率、准确率、F1。",
      "分母为零时返回什么。",
      "这里返回空值，不返回零。",
      "因为没预测过正类，精确率不存在。",
      "第二个是 ROC-AUC。",
      "用 Mann-Whitney 秩和。",
      "并列分数取平均秩。",
      "单类样本返回空值。",
      "因为 AUC 没有定义。",
      "第三个是 PR-AUC 和 AP。",
      "按分数降序扫。",
      "每一步算召回率和精确率。",
      "阶梯面积求和。",
      "端点写死，避免浮点抖动。",
      "三个模块都不读文件。",
      "输入是向量，输出是数字。",
      "这样测试才能判。",
      "四十六条断言全部通过。",
      "边界、黄金值、随机基线。",
      "黄金值 AUC 零点七五。",
      "黄金值 AP 零点五。",
      "不是从数据里抄的。",
      "是手算能对上的。",
      "代码先写边界，再算指标。"
    ]
  },
  {
    "id": "verification",
    "chapter": "验证",
    "kicker": "05 / 四组数字",
    "title": "每个数都能回到一次运行",
    "goal": "合成样本、真实数据、阈值、二十只股票",
    "lines": [
      "四组数字，逐项对照。",
      "第一组，合成样本。",
      "一百个点，一个正类。",
      "准确率零点九九，AUC 零点五。",
      "AP 零点零一。",
      "第二组，真实数据。",
      "两万三千八百二十九个点。",
      "正类两千两百一十七个。",
      "AUC 零点五四零八。",
      "AP 零点一一二一。",
      "第三组，阈值一点零。",
      "真阳四百四十一。",
      "假阳两千九百零六。",
      "精确率百分之十三点二。",
      "召回率百分之十九点九。",
      "准确率百分之八十点四。",
      "比全判正常还低十点三个点。",
      "第四组，二十只股票。",
      "十五只 AUC 超过零点五。",
      "最高零点七九八，最低零点四六五。",
      "四十六条测试全部通过。",
      "每个数字都能回到一次运行。",
      "本集没有训练模型。",
      "也没有调参。",
      "只有标签、分数、阈值。",
      "和一套可复算的指标。"
    ]
  },
  {
    "id": "boundary",
    "chapter": "边界",
    "kicker": "06 / 什么时候不能信",
    "title": "七个边界，一把尺子",
    "goal": "公式能复用，结论不能外推",
    "lines": [
      "七个边界，一把尺子。",
      "第一，证据等级。",
      "书里只有定义和公式。",
      "没有代码，没有实验。",
      "本集所有数字来自本机快照。",
      "第二，标签定义。",
      "未来五日跌百分之五。",
      "换一个阈值，正类就换一批。",
      "第三，分数定义。",
      "二十日波动率的 z 分数。",
      "不是模型输出，是手工特征。",
      "第四，样本范围。",
      "二十只大盘股，六年。",
      "不是全市场。",
      "第五，阈值选择。",
      "一点零、一点五、二点零。",
      "都是事先写死的。",
      "没有调参挑最好看。",
      "第六，单类未定义。",
      "一只股票没有正类，AUC 就没有。",
      "代码返回空值。",
      "第七，等级。",
      "机制可复现，数字可复算。",
      "但没有基线模型，不能外推。"
    ]
  },
  {
    "id": "outro",
    "chapter": "收束",
    "kicker": "07 / 一句话",
    "title": "先问谁在少数。",
    "goal": "三个指标，三条边界，下一集讲划分",
    "lines": [
      "一句话，先问谁在少数。",
      "准确率、AUC、AP。",
      "三个指标，三种问法。",
      "不平衡数据上，先看少数类。",
      "再看排序，最后看阈值。",
      "这一集给了三把尺子。",
      "也给了三条边界。",
      "下一集讲数据划分。",
      "训练集、验证集、测试集。",
      "时间序列不能随机切。",
      "切错一次，指标全废。",
      "先问谁在少数。",
      "再问尺子量的是什么。"
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
