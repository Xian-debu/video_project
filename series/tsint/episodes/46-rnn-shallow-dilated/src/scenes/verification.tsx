import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, CheckGrid, checksOf,
  fmt4, fmtInt,
} from "../shared";

const rn = M.rnn;
const dl = M.dil;
const br = M.brick;
const lg = M.long;
const sy = M.synthetic;

const passRows = (g: string) => checksOf(g).map((c) => [c.name, c.pass ? "过" : "不过"]);

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：总览 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三十项检查，
              <br />
              逐组摆开。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              数据五项，RNN 七项，brick 五项，空洞六项，长窗口两项，训练五项——六组三十项，{M.meta.evidence.seconds} 秒，全过。每一组的格子都在右边，过不了这一关，后面全是假的。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{M.meta.evidence.passed} / {M.meta.evidence.checks} 全过</Chip>
              <Chip color={C.amber}>{M.meta.evidence.seconds} s</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 770, top: 292, width: 1080 }}>
            <Card label="证据总表：六组三十项" accent={C.cyan} pad={22}>
              <CheckGrid width={1010} />
              <div style={{ marginTop: 26, display: "flex", gap: 18 }}>
                <div style={{ flex: 1, border: "1px solid " + C.panelLine, borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>检查</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan, marginTop: 6 }}>{M.meta.evidence.passed} / {M.meta.evidence.checks}</div>
                  <div style={{ fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>全部通过</div>
                </div>
                <div style={{ flex: 1, border: "1px solid " + C.panelLine, borderRadius: 10, padding: "14px 18px" }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>耗时</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.amber, marginTop: 6 }}>{M.meta.evidence.seconds} s</div>
                  <div style={{ fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>含训练与合成</div>
                </div>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：数据五项 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 600 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              第一组是数据，
              <br />
              五项。
            </div>
            <Body style={{ marginTop: 20, width: 580 }}>
              面板两千六百七十四行、五百列；区间二零一五年一月五号到二零二五年十二月三十一号；五百只股票每只都有对数收益，没有整列空；窗口四千三百九十二个，每只八到九个；三分位标签，三类占比都在三成上下。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="面板" value={fmtInt(M.data.rows) + " × " + M.data.cols} note="行 × 列" color={C.cyan} />
              <Row name="窗口" value={fmtInt(M.data.windows)} note={"每只 " + M.data.perStock.join("–") + " 个"} color={C.violet} />
              <Row name="三类" value={M.data.classes.map(fmtInt).join(" / ")} note="三分位" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 296, width: 1090 }}>
            <Card label="数据组的五项检查" accent={C.cyan} pad={22}>
              <MiniTable head={["检查项", "结果"]} rows={passRows("data")} colW={[880, 120]} width={1010} rowH={52} size={FT.meta} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：RNN 七项 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              再钉 RNN
              <br />
              的黄金值。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              tanh 零点五等于零点四六二一，三步链是零点四六二一、零点二二七零、零点一一三零——不是零点五、零点二五、零点一二五。参数三十九，零权重网络损失就是 log 三。手算的对，说明口径没歪；实现的对，说明代码没崩。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="tanh 0.5" value={fmt4(rn.tanh05)} note="不是 0.5" color={C.coral} />
              <Row name="三步链" value={rn.chain.map((v) => fmt4(v)).join(" / ")} color={C.violet} />
              <Row name="零权重损失" value={fmt4(rn.lossChance)} note="log 3" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 292, width: 1090 }}>
            <Card label="RNN 组七项：手算 + 梯度 + 裁剪 + 种子" accent={C.violet} pad={22}>
              <MiniTable head={["检查项", "结果"]} rows={passRows("rnn")} colW={[880, 120]} width={1010} rowH={44} size={FT.meta} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：brick 五项 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              切块保序，
              <br />
              深度真降了。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              T 等于十二、块长四，切出三块，拼回逐项相等；T 等于五百、块长五十，十块、每块五十；第二层只吃三个块末状态，每个四维；串行深度五百，并行深度六十，比 {fmt4(br.depthRatio)}；参数八十七，和窗口长度无关。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="串行深度" value={String(br.depthSerial)} note="五百步" color={C.coral} />
              <Row name="并行深度" value={String(br.depthParallel)} note="50 + 10" color={C.cyan} />
              <Row name="比值" value={fmt4(br.depthRatio) + "×"} note="结构账" color={C.cyan} />
            </div>
            <div style={{ marginTop: 16 }}>
              <Chip color={C.amber}>第二层的准确率没训，写在边界里</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 292, width: 1090 }}>
            <Card label="brick 组五项" accent={C.cyan} pad={22}>
              <MiniTable head={["检查项", "结果"]} rows={passRows("brick")} colW={[880, 120]} width={1010} rowH={52} size={FT.meta} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：空洞六项 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 640 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              空洞六项，
              <br />
              真证据在周期上。
            </div>
            <Body style={{ marginTop: 20, width: 620 }}>
              d 等于二、核一一，对一到五输出四六八；d 等于一退化成普通卷积，输出负二负二。五百点过五层剩 {dl.stackLen}；感受野四层三十一、五层六十三；参数十五对六十三，比值 {fmt4(dl.paramRatio)}。周期八的正弦隔八差分完全抵消，隔一差分还剩 {fmt4(dl.periodNormal)}。
            </Body>
            <div style={{ marginTop: 18 }}>
              <Row name="感受野" value={dl.rf31 + " / " + dl.rf63} note="4 层 / 5 层" color={C.coral} />
              <Row name="抵消" value={dl.periodCancel.toExponential(3)} note="周期 8 · d=8" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 288, width: 1090 }}>
            <Card label="空洞组六项" accent={C.violet} pad={22}>
              <MiniTable head={["检查项", "结果"]} rows={passRows("dil")} colW={[880, 120]} width={1010} rowH={46} size={FT.meta} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：长窗口 + 训练 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 600 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              最后两项：
              <br />
              长窗口与训练。
            </div>
            <Body style={{ marginTop: 20, width: 580 }}>
              五十步 {fmt4(lg[0].testAcc)}，两百五十步 {fmt4(lg[1].testAcc)}，五百步 {fmt4(lg[2].testAcc)}，都在随机水平上；窗口拉长十倍，变化不到零点零六。合成周期序列训练测试都是 {fmt4(sy.trainAcc)}，四十一秒；真实三分位离三分之一不超过零点零五。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="真实三分位" value={fmt4(lg[2].testAcc)} note="距 1/3 不到 0.05" color={C.coral} />
              <Row name="合成" value={fmt4(sy.testAcc)} note="同一个 RNN" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 740, top: 288, width: 1110 }}>
            <Card label="长窗口两项：T = 50 / 250 / 500" accent={C.coral} pad={20}>
              <MiniTable
                head={["窗口 T", "训练", "测试", "耗时 s"]}
                rows={lg.map((r) => [String(r.T), fmt4(r.trainAcc), fmt4(r.testAcc), fmt4(r.seconds, 2)])}
                colW={[220, 220, 220, 240]}
                width={1010}
                rowH={46}
              />
              <div style={{ marginTop: 22 }}>
                <MiniTable head={["训练组检查项", "结果"]} rows={passRows("train")} colW={[880, 120]} width={1010} rowH={38} size={FT.micro} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页七：六条路 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 600 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              六条路，
              <br />
              一张表。
            </div>
            <Body style={{ marginTop: 20, width: 580 }}>
              随机是 {fmt4(M.models.chance)}；串行在五十、两百五十、五百步上都是随机水平；合成任务是一点零。结论不是 RNN 不行，是这批数据没有方向信号。结构上的账一条一条都算清了，精度上的账这一集没有。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.coral}>结构能算清</Chip>
              <Chip color={C.amber}>精度量不出</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 288, width: 1090 }}>
            <Card label="六条路，同一批窗口" accent={C.amber} pad={22}>
              <MiniTable
                head={["路径", "训练", "测试", "说明"]}
                rows={[
                  ["随机猜", "—", fmt4(M.models.chance), "1/3"],
                  ["串行 T=50", fmt4(lg[0].trainAcc), fmt4(lg[0].testAcc), "随机水平"],
                  ["串行 T=250", fmt4(lg[1].trainAcc), fmt4(lg[1].testAcc), "随机水平"],
                  ["串行 T=500", fmt4(lg[2].trainAcc), fmt4(lg[2].testAcc), "随机水平"],
                  ["brick 第二层", "—", "—", "未训练"],
                  ["合成周期序列", fmt4(sy.trainAcc), fmt4(sy.testAcc), "有信号"],
                ]}
                colW={[300, 190, 190, 280]}
                width={1010}
                rowH={50}
                hilite={5}
              />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
