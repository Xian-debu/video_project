import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, Stat, CheckGrid,
  checksOf, fmt4, fmtInt,
} from "../shared";
import { ConvKernelFig, PoolFig, ResBlockFig, GapCamFig, CamHeat, camHeat60 } from "../figs";

const ds = M.dataset;
const cv = M.conv;
const rs = M.residual;
const gc = M.gapcam;
const cam = M.cam;
const md = M.models;
const mt = M.meta;

const checkRows = (g: string) => checksOf(g).map((c) => [c.name, c.pass ? "过" : "错"]);

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：27 组全过 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              二十七组检查，
              <br />
              逐组看。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              单元断言证明代码没写崩，{mt.evidence.checks} 组证据检查证明读数是算出来的。六组：数据、卷积、残差、GAP、CAM、训练。全过才算成立。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{mt.evidence.passed} / {mt.evidence.checks} 过</Chip>
              <Chip color={C.amber}>{mt.evidence.seconds.toFixed(1)} s</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 850, top: 286, width: 1000 }}>
            <Card label="证据总表" accent={C.cyan} pad={22}>
              <CheckGrid width={900} />
              <div style={{ height: 18 }} />
              <div style={{ display: "flex", gap: 16 }}>
                <Stat label="检查" value={mt.evidence.passed + " / " + mt.evidence.checks} sub="全部通过" valueColor={C.cyan} valueSize={40} />
                <Stat label="耗时" value={mt.evidence.seconds.toFixed(1) + " s"} sub="含训练与搜索" valueColor={C.amber} valueSize={40} />
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：数据 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              先把数据
              <br />
              钉死。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              三百只股票、五个字段、六十步窗口、步长一百五十，一共 {fmtInt(ds.windows)} 个窗口。按股票切成 {ds.train} 训练、{ds.test} 测试——同一只股票的窗口不会跨两边。五个字段两两平均相关 {fmt4(ds.meanAbsCorr)}，这条写进数据检查。
            </Body>
            <div style={{ marginTop: 20 }}>
              {checksOf("data").map((c, i) => <Row key={i} name={["面板", "三类", "列数", "有限值", "切分", "相关"][i]} value={["1,942 × 300", "100 / 100 / 100", "与标签一致", "无 NaN / Inf", "945 / 233", fmt4(ds.meanAbsCorr)][i]} note={c.name} color={C.cyan} />)}
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 292, width: 990 }}>
            <Card label="数据组的六项检查" accent={C.cyan} pad={22}>
              <MiniTable head={["检查项", "结果"]} rows={checkRows("data")} colW={[620, 120]} width={840} rowH={40} />
              <div style={{ height: 12 }} />
              <Body color={C.inkDim} size={FT.meta}>
                样本按股票切分是最容易漏的一条：按窗口随机切会让同一段序列同时出现在训练和测试里。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：卷积 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 720 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              卷积的四条，
              <br />
              都能手算。
            </div>
            <Body style={{ marginTop: 20, width: 700 }}>
              四个输入点乘长度三的核 [1,0,−1]，输出 [−2,−2]；池化 [1,3,2,5] 出 [3,5]；平票 [2,2] 固定取索引零；维度账一路 60、53、26、19、9，展平 {cv.flat}。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="手算" value="[−2, −2]" note="4 点 × 核长 3" color={C.cyan} />
              <Row name="池化" value="[3, 5]" note="平票取 0" color={C.violet} />
              <Row name="维度账" value="60→53→26→19→9" note={"展平 " + cv.flat} color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 810, top: 288, width: 1030 }}>
            <Card label="前向形状与黄金值" accent={C.cyan} pad={20}>
              <ConvKernelFig width={960} />
              <div style={{ height: 6 }} />
              <PoolFig width={960} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：残差 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              残差四条，
              <br />
              两条恒等两条实测。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              捷径权重为零时，块就是恒等：[1,2,3] 原样回来。一乘一投影把 [1,2] 放大成 [2,4]。四块深网前向无 NaN。最后一条是实测：四块 {fmt4(rs.deepAcc)}，一块 {fmt4(rs.shallowAcc)}——加深没有换来精度。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="恒等" value="F=0 输出 1,2,3" note="原样传回" color={C.cyan} />
              <Row name="投影" value="W=2 → 2,4" note="一乘一升维" color={C.violet} />
              <Row name="深浅" value={fmt4(rs.deepAcc) + " / " + fmt4(rs.shallowAcc)} note={"深 − 浅 " + rs.deepMinusShallowPp.toFixed(1) + " pp"} color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 300, width: 1010 }}>
            <Card label="残差块：捷径只加不乘" accent={C.violet} pad={22}>
              <ResBlockFig width={930} />
              <div style={{ height: 14 }} />
              <MiniTable head={["检查项", "结果"]} rows={checkRows("res")} colW={[700, 120]} width={860} rowH={40} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：GAP */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              GAP 四条，
              <br />
              长度不进参数。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              [1,2,3,4] 的均值是 {gc.gap.toFixed(1)}；权重零点五，CAM 是 [0.5,1,1.5,2]；归一到 [0, 1/3, 2/3, 1]。六十步和一百二十步喂进同一套权重，都输出三类——GAP 把长度吃掉了。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="GAP" value="2.5" note="均值，不是加权" color={C.cyan} />
              <Row name="归一" value="0 / 1/3 / 2/3 / 1" note="落到 [0,1]" color={C.violet} />
              <Row name="长度" value="60 / 120 → 3 维" note="权重不变" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 292, width: 1010 }}>
            <Card label="GAP 与 CAM 的回路" accent={C.cyan} pad={20}>
              <GapCamFig width={960} />
              <div style={{ height: 10 }} />
              <Body color={C.inkDim} size={FT.meta}>
                CAM 不是另一张网：它是最后那层线性权的加权和，顺着虚线回放到时间轴上。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：真实数据 CAM */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              热图指出，
              <br />
              哪几天在起作用。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              取一只真实股票 {cam.stock}，标签是{classNameOf(cam.label)}。六十天窗口卷完剩 {cam.featureLen} 个特征位置（60 − 8 + 1，valid 卷积），上采样回六十天，归一到 [0,1]。最高的是第 {cam.top5[0] + 1} 天。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>特征长 {cam.featureLen}</Chip>
              <Chip color={C.amber}>top-5：{cam.top5.map((i) => i + 1).join(" / ")} 天</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 790, top: 286, width: 1060 }}>
            <Card label="真实样本的 CAM 热图" accent={C.amber} pad={20}>
              <CamHeat width={1000} />
              <div style={{ height: 10 }} />
              <MiniTable
                head={["日索引", "热值"]}
                rows={cam.top5.map((i) => [String(i + 1), fmt4(camHeat60()[i])])}
                colW={[200, 200]}
                width={420}
                rowH={38}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页七：六模型对照 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              六条路，
              <br />
              一张表。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              卷积比线性高 {fmt4((md.cnn.testAcc - md.linear.testAcc) * 100, 1)} 个百分点；深残差再高 {fmt4((md.resnet.testAcc - md.cnn.testAcc) * 100, 1)}；最浅的一层反而最好。GAP-CAM 掉 {fmt4((md.cnn.testAcc - md.gapcam.testAcc) * 100, 1)} 个百分点——这是换取热图付的价。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="卷积 − 线性" value={"+" + fmt4((md.cnn.testAcc - md.linear.testAcc) * 100, 1) + " pp"} note="卷积的精度收益" color={C.cyan} />
              <Row name="GAP-CAM − 卷积" value={fmt4((md.gapcam.testAcc - md.cnn.testAcc) * 100, 1) + " pp"} note="解释性的代价" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 288, width: 950 }}>
            <Card label="测试准确率：六条路同一批数据" accent={C.cyan} pad={22}>
              <MiniTable
                head={["模型", "训练", "测试"]}
                rows={[
                  ["随机", "—", fmt4(md.chance)],
                  ["线性", fmt4(md.linear.trainAcc), fmt4(md.linear.testAcc)],
                  ["卷积", fmt4(md.cnn.trainAcc), fmt4(md.cnn.testAcc)],
                  ["四块残差", fmt4(md.resnet.trainAcc), fmt4(md.resnet.testAcc)],
                  ["一块残差", "—", fmt4(md.resnetShallow.testAcc)],
                  ["GAP-CAM", fmt4(md.gapcam.trainAcc), fmt4(md.gapcam.testAcc)],
                ]}
                colW={[300, 200, 200]}
                width={820}
                rowH={42}
              />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

function classNameOf(k: number) {
  return ["电子", "医药", "装备"][k] ?? "未知";
}
