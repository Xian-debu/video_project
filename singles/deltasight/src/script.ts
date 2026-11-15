/**
 * 《DeltaSight：让摄像头只算它该算的》—— DAC'26 论文精读。
 *
 * 唯一真源：章节、讲稿、时长。讲稿即字幕；时间点由实测语音时长（data/deltasight/voice.json）
 * 决定，没有实测时退回字数估算，所以可以先写脚本、后配音。
 *
 * 原文图版：data/source-figures.json 里的 8 张图（Fig.1/2/3/5/6/7、Table 1、Fig.9），
 * 以「原文」角标出现。它们的 id 必须出现在本文件里——content 的 plates 门禁与引擎的
 * film_coverage 都读这里。
 */
import voiceJson from "../../data/deltasight/voice.json";

export const FPS = 30;

/** 原文图版（顺序即入片顺序）。 */
export const PLATES = {
  fig1: "plates/fig1-pipeline",
  fig2: "plates/fig2-pruning",
  fig3: "plates/fig3-scenes",
  fig5: "plates/fig5-arch",
  fig6: "plates/fig6-cdac",
  fig7: "plates/fig7-block",
  table1: "plates/table1-accuracy",
  fig9: "plates/fig9-energy",
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
    kicker: "DAC 2026 / 论文精读",
    title: "一台一直在看的摄像头",
    goal: "从一个路口摄像头说起，问一个很朴素的问题",
    lines: [
      "先看一台装在路口的摄像头。",
      "它一天二十四小时不关机。",
      "可画面里，真正在动的地方很少。",
      "树叶、云、走过的影子，大部分像素一遍遍重复。",
      "可系统不管这些。",
      "它仍然按固定帧率、全分辨率采样，",
      "再把每一帧都传上去、都算一遍。",
      "这篇 DAC 2026 的论文问的是：",
      "能不能只算它该算的那部分？",
    ],
  },
  {
    id: "problem",
    chapter: "问题",
    kicker: "01 / 三段流水线",
    title: "采样、传输、计算，各干各的",
    goal: "视频 AIoT 系统的能耗花在哪一段",
    lines: [
      "一个视频 AIoT 系统，通常分三段。",
      "先传感：像素阵列采集，ADC 转成数字，ISP 做处理。",
      "再传输：一帧图像经 MIPI 送到主机。",
      "最后计算：模型在这一帧上做检测或者识别。",
      "论文引用的调查说，传感加传输占了系统能耗的百分之三十七到五十三。",
      "而传感这一段里，能耗大头是 ADC。",
      "所以想省能耗，绕不开 ADC。",
      "问题是，这三段各自为政。",
      "固定帧率、全分辨率、统一精度，三段都被同一套假设绑住。",
    ],
  },
  {
    id: "mismatch",
    chapter: "动机",
    kicker: "02 / 两个证据",
    title: "冗余是真的，重要性是不一样的",
    goal: "为什么「全都算」不合理",
    lines: [
      "先看第一个证据：冗余是真的存在。",
      "论文的实测是，扔掉六成以上的数据，",
      "连同对应的那部分计算一起扔掉，",
      "模型的精度几乎不掉。",
      "第二个证据更扎心。",
      "同样往画面里加噪声，加在前景上，精度明显掉；",
      "加在背景上，几乎没影响。",
      "不同区域对结果的重要性，差得很远。",
      "既然能扔、又该区别对待，",
      "为什么系统还是全采、全传、全算？",
      "论文给这个现象起了个名字，叫粒度错配。",
    ],
  },
  {
    id: "criterion",
    chapter: "判据",
    kicker: "03 / 像素级对 patch 级",
    title: "传感器和模型，数的不是同一格",
    goal: "错配到底错在哪一层",
    lines: [
      "现在的智能传感器，是在像素级判冗余的。",
      "相邻两帧，这个像素没变，就不采。",
      "但下游的 Transformer 不吃像素。",
      "它把图像切成一格一格的 patch，",
      "每个 patch 就当一个 token，整帧串起来交给模型。",
      "在这篇论文的设定里，patch 是十六乘十六。",
      "传感器按像素判，模型按 patch 用。",
      "传感器扔掉的，可能正是模型要的；",
      "模型要的，传感器又没保住。",
      "所以判据得搬到 patch 级，而且要跟下游用同一套粒度。",
    ],
  },
  {
    id: "algo",
    chapter: "判据",
    kicker: "04 / 公式一、二、三",
    title: "三步判一个 patch 要不要算",
    goal: "把「相似」写成可执行的算式",
    lines: [
      "判据本身不复杂，三步。",
      "第一步算帧差：这一帧减上一帧，取绝对值。",
      "论文用的是曼哈顿距离，逐像素相减再把差值加起来。",
      "第二步，在 patch 里数一数。",
      "有多少像素的差小于阈值 τ，就记多少。",
      "第三步，拿这个数去比 κ。",
      "数出来的像素够多，这个 patch 就判为相似。",
      "相似的 patch，后面的转换、传输、计算都可以跳过。",
      "不相似的，进下一步，还要分场景。",
      "这几步我照论文写成了代码，",
      "跑在合成的帧序列上，屏幕上每个数都能复算。",
    ],
  },
  {
    id: "route",
    chapter: "判据",
    kicker: "05 / 三种场景",
    title: "出现、移动、消失",
    goal: "不相似的 patch 怎么分轻重",
    lines: [
      "不相似的 patch，也不是一视同仁。",
      "论文把它们分成三种情况。",
      "第一种 appearing：上一帧这里什么都没有，这一帧出现了东西。",
      "第二种 moving：东西还在，但位置变了。",
      "第三种 disappearing：东西走了，或者被挡住了。",
      "怎么分？用两个量。",
      "一个是 IoU：不相似区域的掩码，和上一帧的检测框交并比。",
      "另一个是内部变化率，变化落在框里的比例。",
      "IoU 高、内部变化率也高，就判成第三种。",
      "前两种走高精度，第三种走低精度，框外直接跳过。",
    ],
  },
  {
    id: "adc",
    chapter: "硬件",
    kicker: "06 / 复用 CDAC",
    title: "不加采样保持，也能记住上一帧",
    goal: "硬件怎么在传感器里判「相似」",
    lines: [
      "接下来是最硬的一段：硬件怎么在传感器里做这件事。",
      "常规做法是加一套采样保持电路，把上一帧的电压存起来。",
      "论文不加，它复用 ADC 自己的电容阵列。",
      "上一帧的量化结果本来就存在 SRAM 里。",
      "需要比较时，把这串数字码打回电容阵列，",
      "它就还原成上一帧的模拟电压。",
      "论文给的算例：这一帧输入零点七五一伏，参考电压一伏。",
      "上一帧的码是一一后面八个零，还原出来零点七五零伏。",
      "一减，剩下负一毫伏。",
      "再在上极板挂一个很小的电容，注入正负 τ 的偏置。",
      "τ 大约是五毫伏。",
      "加 τ 变成正四毫伏，比较器输出一；",
      "减 τ 变成负六毫伏，输出零。",
    ],
  },
  {
    id: "block",
    chapter: "硬件",
    kicker: "07 / 块级读出",
    title: "十六列并行，按块门控",
    goal: "单个像素的判断怎么汇总成 patch 的判断",
    lines: [
      "单个像素判完了，还得按 patch 汇总。",
      "论文的做法叫块级读出。",
      "读出域是十六乘三十二，正好对应一组 patch。",
      "每个 ADC 阵列有十六列并行通道，同一个采样时钟。",
      "控制器用块选择信号，在两组 ADC 之间选。",
      "再用列使能逐列门控。",
      "不需要的列直接高阻，连采样电荷都不消耗。",
      "块之间负载不均怎么办？",
      "相邻读出域之间有开关和连接盒，可以把块重映射到空闲的 ADC 上。",
    ],
  },
  {
    id: "pipeline",
    chapter: "位宽",
    kicker: "08 / 四阶段",
    title: "相似还不够，要变成位数",
    goal: "判断怎么变成省下来的能耗",
    lines: [
      "到这里，相似还只是一个判断。",
      "要把它变成省下来的能耗，还得改转换的精度。",
      "论文把 A 到 D 转换分成四段。",
      "第一段，块级相似检测：整块相似就跳过，零比特。",
      "第二段，不相似的块先只转高四位，拿一个粗量化。",
      "第三段，传感器里的 NPU 算语义重要性。",
      "重要区域再把低四位补上，恢复到十位。",
      "其余区域就用那个四位的结果。",
      "ImageNet VID 上，百分之七十九点四的像素是零比特。",
      "只有百分之十八点一需要完整的十位。",
      "转换能耗因此降了百分之七十四点二，NFS 上降百分之八十三点九。",
    ],
  },
  {
    id: "system",
    chapter: "系统",
    kicker: "09 / 拼帧与协议",
    title: "只传变了的块",
    goal: "传感器省下的东西怎么送出去、主机怎么用",
    lines: [
      "传感器省下的东西，要传出去才叫省。",
      "但下游模型还得知道，哪块变了、哪块没变。",
      "论文的做法是，把更新的块拼成一帧。",
      "它叫多感兴趣区合并帧。",
      "帧头记下每个更新块的编号。",
      "主机保留上一帧，按编号替换对应区域。",
      "整帧就重建出来了。",
      "物理层还是标准 MIPI CSI-2。",
      "只改了协议层：加块级差分和语义索引。",
      "计算那侧直接用相似掩码，跳过没变的 patch，复用缓存特征。",
    ],
  },
  {
    id: "accuracy",
    chapter: "结果",
    kicker: "10 / Table 1",
    title: "精度：涨了一点，也掉了一点",
    goal: "跳过这么多，mAP 到底会不会掉",
    lines: [
      "接下来看结果。先说精度。",
      "两个数据集，三个模型，τ 固定零点五个百分点。",
      "ImageNet VID 上，三个模型的 mAP，",
      "分别是 41.06、82.37、83.51。",
      "都比基线高一点点。",
      "平均从 68.67 涨到 69.98。",
      "跳过率是百分之六十四点八。",
      "NFS 上，故事就不一样了。",
      "ViTDeT-S 从 53.58 涨到 55.99，涨得最多。",
      "可 ViTDeT-B 从 82.19 掉到 81.69，",
      "ViTDeT-L 从 82.35 掉到 81.47。",
      "平均还是涨的，因为 S 涨得多。",
      "跳过率更高，百分之七十二点二。",
    ],
  },
  {
    id: "energy",
    chapter: "结果",
    kicker: "11 / Fig.8、Fig.9",
    title: "能耗：两段各省两倍多",
    goal: "这些节省加起来是多少",
    lines: [
      "再说能耗，这是论文最想让人记住的一组数。",
      "传感这一段，平均省了 2.4 倍。",
      "传输这一段，平均省了 3.2 倍。",
      "合起来，端到端是 1.7 倍。",
      "NFS 上的增益更大。",
      "因为帧率高，相邻两帧更像，能跳过的更多。",
      "但相似识别本身不是免费的。",
      "它占了传感器功耗的百分之二十五点九八到三十点九七。",
      "相当于原来整套传感器能量的百分之十一点八六。",
      "花一成多的能量，省掉两倍多的能耗，这笔账是划算的。",
    ],
  },
  {
    id: "limits",
    chapter: "边界",
    kicker: "12 / 它没做完的",
    title: "面积是估的，先验会传错",
    goal: "这篇论文的边界在哪",
    lines: [
      "这篇论文也有它没做完的地方。",
      "面积是版图估算的，七点四平方毫米，没有流片实测。",
      "语义先验来自上一帧的推理结果，",
      "一旦上一帧判错，误差会往后传。",
      "阈值 τ 和 κ 选多少，只给了扫描，没给自动标定。",
      "patch 固定十六乘十六，是跟 ViT 对齐的；换模型就得重调。",
      "主机侧解析感兴趣区、重建帧的开销，没有单独算进去。",
      "还有第一帧、场景切换，这些没有历史可用的时刻。",
      "论文自己没列这些；这是我读下来最想问的几件事。",
    ],
  },
  {
    id: "outro",
    chapter: "结语",
    kicker: "13 / 回到路口",
    title: "把判据搬到产生数据的地方",
    goal: "收束全片",
    lines: [
      "回到开头那个问题。",
      "能不能只算它该算的那部分？",
      "DeltaSight 说能，但要先把判据搬到产生数据的地方。",
      "让传感器在 patch 级判冗余，",
      "让这个判断同时指导采样、传输和计算。",
      "这就是它说的跨级一致。",
      "端到端 1.7 倍，代价是精度上的一点波动和面积上的一点开销。",
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
