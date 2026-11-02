import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, fmt4, fmtInt,
} from "../shared";
import { ParamFig, SampleFig } from "../figs";

const rn = M.rnn;
const br = M.brick;
const dl = M.dil;
const lg = M.long;
const meta = M.meta;

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：数据口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              数据是借来的，
              <br />
              口径要写清楚。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              计划写沪深三百里取五百只，但指数成分只有一期快照、三百只，拿不到历史成分，只好改成全市场按成交额取前五百。成交额字段整列为空，改用收盘价乘成交量近似。计划二零一五到二零二五、T 等于五百，两千六百七十四个交易日，每只股票只切出八到九个窗口。
            </Body>
            <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.inkFaint}>计划：HS300 内 500 只</Chip>
              <Chip color={C.coral}>实际：全市场同口径</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 292, width: 1070 }}>
            <Card label="计划与实际的三处偏移" accent={C.coral} pad={22}>
              <Row name="来源" value="全市场 · 成交额前 500" note="计划 HS300 内 500 只" color={C.coral} width={1000} />
              <Row name="字段" value="close × volume" note="amount 整列 NaN" color={C.amber} width={1000} />
              <Row name="窗口" value="2,674 日 → 每只 8–9 个" note="T=500 · 步长 250" color={C.violet} width={1000} />
              <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
                三处偏移都写进 delivery 的口径说明：来源、字段、窗口数，一条不漏。
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：墙钟 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              结构上能并行，
              <br />
              墙钟上没快。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              书里说训练时间降到六分之一。深度比确实是 {fmt4(br.depthRatio)} 倍；但单线程测墙钟只测到零点四三八，不到一，就是说并行反而更慢。要快六倍得有多核或多流，我们没有——所以这条只能写成「结构上能并行」。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="结构深度比" value={fmt4(br.depthRatio) + "×"} note="500 : 60" color={C.cyan} />
              <Row name="墙钟比" value={fmt4(br.wallRatio)} note="单线程一次测量" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 292, width: 1070 }}>
            <Card label="书里的六倍，我们只敢说结构" accent={C.coral} pad={22}>
              <MiniTable
                head={["量的是什么", "值", "能不能当结论"]}
                rows={[
                  ["结构深度（串行 / 并行）", fmt4(br.depthRatio) + "×", "能"],
                  ["单线程墙钟（并行 / 串行）", fmt4(br.wallRatio), "不能，不到 1"],
                  ["多线程墙钟加速", "未测", "没有多核，测不出来"],
                ]}
                colW={[520, 220, 240]}
                width={1000}
                rowH={54}
              />
              <div style={{ marginTop: 22 }}>
                <Chip color={C.amber}>六倍需要多核或多流，本机没有</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：精度差证不了 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              「精度没掉」
              <br />
              这句话证不了。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              这句话需要一个前提：串行 RNN 本身能学到东西。可我们的串行 RNN 测试准确率 {fmt4(rn.testAcc)}，正好是随机；brick 也一样。两边都在随机线上，差多少都测不出来。能证的是结构等价、深度更低、参数不变。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="串行 RNN" value={fmt4(lg[2].testAcc)} note="随机水平" color={C.coral} />
              <Row name="brick" value="未训" note="第二层没训" color={C.amber} />
              <Row name="随机" value={fmt4(M.models.chance)} note="1/3" color={C.inkFaint} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 292, width: 1070 }}>
            <Card label="两边都在随机线上，差多少都测不出" accent={C.coral} pad={22}>
              <Row name="串行 T=500" value={fmt4(lg[2].testAcc)} note="vs 随机 0.3333" color={C.coral} width={1000} />
              <Row name="串行 T=250" value={fmt4(lg[1].testAcc)} note="vs 随机 0.3333" color={C.coral} width={1000} />
              <Row name="能证的" value="结构等价 · 深度更低 · 参数不变" note="不是精度" color={C.cyan} width={1000} />
              <div style={{ marginTop: 20, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
                没有信号的数据上，精度差没有分辨力；这就是为什么这一集只算结构的账。
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：空洞两条 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              空洞这边，
              <br />
              两条要改口径。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              书里说五分之一参数，我们算出来是十五对六十三，约四分之一，差值不大但数字要改。感受野三十一是总宽度，不是单边；实现是 valid 卷积不补零，五百步进来四百三十八步出去。周期八的正弦隔八差分完全抵消，这是合成序列上的干净证据——真实数据没有这么干净的周期。
            </Body>
            <div style={{ marginTop: 16 }}>
              <Row name="参数" value={dl.stackParams + " / " + dl.plainParams} note={"比值 " + fmt4(dl.paramRatio)} color={C.coral} />
              <Row name="感受野" value={String(dl.rf31)} note="总宽，不是单边" color={C.amber} />
              <Row name="输出长" value={String(dl.stackLen)} note="valid，不补零" color={C.violet} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 296, width: 1070 }}>
            <Card label="五分之一 对 四分之一：参数账" accent={C.coral} pad={20}>
              <ParamFig width={1020} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：一次训练一个种子 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              一次训练，
              <br />
              一个种子。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              训练窗口只抽了一百二十个，测试六十个；没有多次初始化，没有交叉验证。表里小数点后四位的差，没有置信区间——差三个百分点以内，当噪声看更稳妥。这一集给的是方向和量级，不是精确排名。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="训练抽样" value={String(M.data.sampleTrain)} note={"共 " + fmtInt(M.data.trainWindows)} color={C.cyan} />
              <Row name="测试抽样" value={String(M.data.sampleTest)} note="全量 867" color={C.violet} />
              <Row name="重复" value="未跑" note="没有多次初始化" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 296, width: 1050 }}>
            <Card label="从全量窗口里抽一小撮" accent={C.cyan} pad={20}>
              <SampleFig width={1000} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：四件没做的事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              四件没做的事，
              <br />
              和下一集。
            </div>
            <Body style={{ marginTop: 20, width: 600 }}>
              第一，brick 的第二层没训；第二，多线程的墙钟加速没测；第三，换种子重跑没做；第四，真实数据上的空洞卷积没做对照。这四条挂在这里，下一集不用还——但读者得知道它们还欠着。
            </Body>
            <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.amber}>下一集：图卷积、图注意力、自注意力</Chip>
              <Chip color={C.cyan}>{meta.next.minutes} 分钟</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 720, top: 292, width: 1130 }}>
            <Card label="未验证清单" accent={C.coral} pad={22}>
              <MiniTable
                head={["没做的事", "为什么挂着", "下次怎么做"]}
                rows={[
                  ["brick 第二层没训", "只测结构，不测精度", "补一次短 RNN 训练"],
                  ["多线程墙钟没测", "单线程比是 1 附近", "多流或多核再测"],
                  ["换种子重跑", "只有种子 7 的一次", "3–5 颗种子取均值"],
                  ["真实数据空洞对照", "只做了合成周期", "同窗口换卷积对照"],
                ]}
                colW={[330, 360, 340]}
                width={1070}
                rowH={50}
              />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
