import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat,
  Row, Verdict, fmtF, fmtM,
} from "../shared";

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：样本与标签 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>六十个窗，不是六十个独立样本。</div>
            <Body style={{ marginTop: 20, width: 820 }}>
              每个窗来自一只股票，窗口之间不重叠，但同行业的股票同涨同跌。有效样本远少于六十，置信区间比二项分布算出来的宽。这一集所有读数都要按「小样本」读。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="样本窗" value="60" width={800} />
              <Row name="每窗天数" value={M.dataset.window} width={800} />
              <Row name="独立性强弱" value="同行业内高度相关" color={C.coral} width={800} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 300, width: 800 }}>
            <Card label="标签也不干净" accent={C.coral} pad={22}>
              <Body>
                行业来自证监会门类，粗，而且边界重叠。半导体和电子设备被分在同一门类，医药里混了医疗器械与中药。类别本身就有噪声，准确率的天花板不是百分之百。
              </Body>
              <div style={{ marginTop: 16 }}>
                <Chip color={C.amber}>标签噪声 → 上限被压低</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：权重泄漏 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>权重在全部六十只上算，读数偏乐观。</div>
            <Body style={{ marginTop: 20, width: 860 }}>
              留一权重用到了全部六十个窗，再用同一批数据评集成。集成看到了「哪些距离在这批数据上准」，等于提前偷看答案。正确做法是双层留一：外层留一个窗，内层只用剩下的窗算权重。这一集没有做。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 300, width: 770 }}>
            <Card label="本集做法 vs 正确做法" accent={C.coral} pad={22}>
              <Row name="本集" value="单层留一 + 全量权重" color={C.coral} width={710} />
              <Row name="偏差方向" value="集成读数偏高" width={710} />
              <Row name="正确" value="双层留一" color={C.cyan} width={710} />
              <Row name="代价" value="权重每折重算 60 次" width={710} />
              <Body style={{ marginTop: 14, fontSize: FT.meta }}>
                下一轮实现会补上。这一集如实记录，不把偏乐观的读数当成结论。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：参数选择 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>带宽六与容差零点二，是选的。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              没有做参数敏感性扫描。换一个带宽，或者换一个 LCSS 容差，读数会动。固定参数的好处是干净、可复现；代价是不知道结论对参数有多敏感。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="DTW 带宽" value="6（固定）" width={820} />
              <Row name="LCSS 容差" value="0.2（固定）" width={820} />
              <Row name="加权 DTW g" value="0.05（固定）" width={820} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 790 }}>
            <Card label="已知的一个敏感点" accent={C.amber} pad={22}>
              <Row name="带宽 6" value={fmtF(M.main.dtw.acc, 4)} width={730} />
              <Row name="去掉带宽" value={fmtF(M.main.dtwFree.acc, 4)} color={C.coral} width={730} />
              <Row name="差" value={fmtM((M.main.dtw.acc - M.main.dtwFree.acc) * 100, 1) + " 个百分点"} width={730} />
              <Body style={{ marginTop: 14, fontSize: FT.meta }}>
                约束本身有效。但没有扫「3、6、9、12」这条曲线，不知道六是不是最优点。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：检验力与下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>不显著，不等于没有差异。</div>
            <Body style={{ marginTop: 20, width: 860 }}>
              二十次抽样、每次三十个窗，Nemenyi 的检验力有限。三对秩差都没过临界差，只能说这批数据看不出来，不能说三个距离等价。小样本加弱检验，正确的结论是「保留判断」。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Verdict ok={false} label="显著差异：没有证据" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 790 }}>
            <Card label="下一集换武器" accent={C.violet} pad={22}>
              <Body>
                不再比整条序列。从序列里挖一小段有判别力的形状，叫 Shapelet；再讲 PIPs，感知重要点。如果整条序列的距离不够用，就只比最有信息的那一段。
              </Body>
              <div style={{ marginTop: 16 }}>
                <Chip color={C.violet}>E43 · Shapelet / PIPs</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
