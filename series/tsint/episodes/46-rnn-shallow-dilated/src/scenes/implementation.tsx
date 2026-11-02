import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, CodeBlock, fmt4,
} from "../shared";
import { BlockOrderFig, DilGoldenFig } from "../figs";

const rn = M.rnn;
const dl = M.dil;
const md = M.meta.modules;
const duty: Record<string, string> = {
  "src/TsBase/Algos/Ch05/Rnn.hs": "单步、前向、损失、反传",
  "src/TsBase/Algos/Ch05/ShallowRnn.hs": "切块、两层并行",
  "src/TsBase/Algos/Ch05/Dilated.hs": "空洞、感受野",
};

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三个模块，
              <br />
              二十七条新断言。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              Rnn 管单步、前向、损失、反传，十条；ShallowRnn 管切块与两层并行，八条；Dilated 管空洞卷积与感受野，九条。全仓现在是一百四十五组、一千九百六十五条断言，每个模块配一份 spec，跑 cabal test 一次全验。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{M.meta.tests.groups} 组 · {M.meta.tests.assertions} 条</Chip>
              <Chip color={C.amber}>新增 {M.meta.newCases} 条</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 300, width: 1090 }}>
            <Card label="新增模块与断言数" accent={C.cyan} pad={22}>
              <MiniTable
                head={["模块", "职责", "断言"]}
                rows={md.map((m) => [m.file.split("/").pop(), duty[m.file] ?? "", String(m.cases)])}
                colW={[300, 520, 140]}
                width={1000}
                rowH={44}
                size={FT.meta}
              />
              <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
                每个模块的 spec 与实现同目录，跑一次 cabal test 全验。
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：先写 Rnn */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 660 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先写 Rnn：
              <br />
              反传最容易错。
            </div>
            <Body style={{ marginTop: 20, width: 640 }}>
              参数用扁平数组存，初始化固定一颗种子；前向走一遍，每一步都记下隐状态；序列走完，隐状态取平均，再进线性层；损失用交叉熵，带 softmax 的数值稳定写法。反传三步：先传回平均池化，再把梯度分回每一步，然后每一步往前传并累加。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="梯度核对" value={rn.gradDiff.toExponential(2)} note="解析 vs 中心差分" color={C.cyan} />
              <Row name="参数" value={String(rn.params)} note="D=1, H=4" color={C.violet} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 288, width: 1050 }}>
            <Card label="BPTT：三步一步都不能漏" accent={C.cyan} pad={18}>
              <CodeBlock
                title="rnn / bptt（伪码）"
                width={1000}
                lines={[
                  { t: "-- 前向：每一步都记下隐状态", dim: true },
                  { t: "hs <- scanl (\\h x -> tanh (wx*x + wh*h + b)) h0 xs" },
                  { t: "meanH = sum hs / length hs" },
                  { t: "", dim: true },
                  { t: "-- 反传三步", dim: true },
                  { t: "dh <- dMeanPool loss meanH  -- 1. 分回每一步", hi: true },
                  { t: "dwx <- ... ; dwh <- ...    -- 2. 沿时间累加", hi: true },
                  { t: "dParams <- evaluate (sum grads)  -- 3. 强制求值", hi: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：三个坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三个坑，
              <br />
              都踩过一遍。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              第一是漏步：反传漏掉平均池化那一步，梯度就对不上。第二是类型：向量有 boxed 和 unboxed 两种，混用要么编译不过，要么悄悄变慢。第三是惰性求值：只算损失而不强制，训练其实没发生。三条都写进提交说明，下次不踩。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Chip color={C.coral}>三条都写进提交说明</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 300, width: 1090 }}>
            <Card label="三个坑与对策" accent={C.coral} pad={22}>
              <Row name="漏步" value="梯度对不上" note="三步都要做" color={C.coral} width={1000} />
              <Row name="类型" value="boxed / unboxed" note="混用慢或编译不过" color={C.amber} width={1000} />
              <Row name="惰性" value="训练没发生" note="每个循环都 evaluate" color={C.violet} width={1000} />
              <div style={{ marginTop: 22 }}>
                <CodeBlock
                  title="每个训练循环的最后一行"
                  width={1000}
                  lines={[
                    { t: "let params' = adamStep lr g params" },
                    { t: "evaluate params'   -- 不写这行，参数只是 thunk", hi: true },
                  ]}
                />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：brick 三层 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              切块分三层，
              <br />
              浅就浅在第二层。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              第一层 brickify 按块切开，第二层对每块跑 RNN 只取块末状态，第三层把块末状态拼起来再跑一个短 RNN。检查里有一条：T 等于十二、块长四，要切出三块，拼回逐项相等。第二层只吃三个状态、每个四维——窗口再长，第二层也只有十步。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="切块" value="T=12 · k=4" note="正好三块" color={C.cyan} />
              <Row name="第二层输入" value="3 × 4" note="块末状态" color={C.violet} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 300, width: 1070 }}>
            <Card label="切开、各跑、拼回：逐项相等" accent={C.cyan} pad={18}>
              <BlockOrderFig width={1020} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：空洞实现 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              空洞的实现
              <br />
              反而最短。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              一个循环：对每个输出位置，按 d 的间隔取核。核长三、d 等于二，五个点出三个输出，黄金值是四、六、八。还要一条退化检查：d 等于一就和普通卷积一样，输出负二、负二。输出长度和感受野各写一个纯函数，证据程序直接调用。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="黄金值" value={dl.golden.join(" / ")} note="d=2 · 核 [1,1]" color={C.cyan} />
              <Row name="退化" value={dl.degenerate.join(" / ")} note="d=1 · 核 [1,0,-1]" color={C.coral} />
              <Row name="输出长" value={String(dl.stackLen)} note="500 过 5 层" color={C.violet} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 770, top: 296, width: 1080 }}>
            <Card label="跳过中间点：五点取三点" accent={C.cyan} pad={20}>
              <DilGoldenFig width={1030} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：配方 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 650 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              配方朴素，
              <br />
              全部单线程。
            </div>
            <Body style={{ marginTop: 20, width: 630 }}>
              Adam，学习率零点零一，批量十六，全局裁剪五，三十轮，种子七。一轮一点五七秒；没有 GPU、没有早停、没有学习率调度。所有对照共用这套配方，差别只在结构和数据——所以读数之间是能比的。代价是慢：一轮只有一百二十个训练样本，全量四千个窗口单线程跑不动。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Chip color={C.amber}>1 轮 = {rn.seconds} s</Chip>
              <Chip color={C.coral} style={{ marginLeft: 12 }}>120 样本 / 轮</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 296, width: 1070 }}>
            <Card label="训练配方（所有对照共用）" accent={C.amber} pad={22}>
              <Row name="优化器" value={"Adam · lr " + rn.lr} note="不调度" color={C.cyan} width={1000} />
              <Row name="批量" value={String(rn.batch)} note={"全局裁剪 " + fmt4(rn.clipNorm, 1)} color={C.violet} width={1000} />
              <Row name="轮数" value={String(rn.epochs)} note={"种子 " + rn.seed} color={C.cyan} width={1000} />
              <Row name="单轮耗时" value={rn.seconds + " s"} note="单线程 CPU" color={C.amber} width={1000} />
              <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
                全量 3,525 个训练窗口跑不动：只抽 {M.data.sampleTrain} 个训练、{M.data.sampleTest} 个测试。
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
