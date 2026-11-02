import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable,
  fmt4, fmtInt, fmt2,
} from "../shared";
import { DimChainFig, AccBars45, CamHeat } from "../figs";

const mt = M.meta;
const ds = M.dataset;
const md = M.models;
const cv = M.conv;

export const SOpen: React.FC = () => {
  const at = pagesOf("open");
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        {/* 页一：300 个数压成 288 个特征 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 720 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              三百个数，
              <br />
              压成二百八十八个特征。
            </div>
            <Body style={{ marginTop: 22, width: 700 }}>
              一条窗口 {ds.window} 步、五个字段，一共三百个数。过两层卷积和池化，长度一路缩到九个位置，每个位置三十二个通道，展平正好 {cv.flat} 个特征。窗口变短，通道变多，这是这一集的第一笔账。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>窗口 60 步 × 5 通道</Chip>
              <Chip color={C.amber}>展平 {cv.flat}</Chip>
              <Chip color={C.violet}>核长 {cv.k}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 286, width: 1040 }}>
            <Card label="维度账：每一步都要对上" accent={C.cyan} pad={22}>
              <DimChainFig width={990} />
            </Card>
            <div style={{ marginTop: 12 }}>
              <Body color={C.inkDim} size={FT.meta}>
                卷积不补零，所以序列一定会缩：缩多少，只取决于核长和层数，与数据无关。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：六个读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              六个读数，
              <br />
              一把尺子。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              同一批窗口，三分类：电子、医药、装备。随机猜三分之一。线性 softmax {fmt4(md.linear.testAcc)}，卷积 {fmt4(md.cnn.testAcc)}，四块残差 {fmt4(md.resnet.testAcc)}，一块残差 {fmt4(md.resnetShallow.testAcc)}，GAP-CAM {fmt4(md.gapcam.testAcc)}。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="最高的" value={fmt4(md.resnetShallow.testAcc)} note="一块残差" color={C.amber} />
              <Row name="第二高" value={fmt4(md.resnet.testAcc)} note="四块残差" color={C.violet} />
              <Row name="最低的" value={fmt4(md.gapcam.testAcc)} note="GAP-CAM" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 286, width: 960 }}>
            <Card label="测试准确率：一批窗口，六个模型" accent={C.cyan} pad={18}>
              <AccBars45 width={920} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：热图 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              哪几天
              <br />
              在起作用。
            </div>
            <Body style={{ marginTop: 20, width: 680 }}>
              看一张热图。同一条六十步窗口，GAP-CAM 给出每一天的权重。最亮的五天索引是 {M.cam.top5.join("、")}，全在窗口尾巴上——最后一周的走势，撑起了这次判断。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{M.cam.stock}</Chip>
              <Chip color={C.coral}>特征长 {M.cam.featureLen}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 780, top: 288, width: 1080 }}>
            <Card label="sh600130 的 60 天权重" accent={C.coral} pad={20}>
              <CamHeat width={1030} />
            </Card>
            <div style={{ marginTop: 10 }}>
              <Body color={C.inkDim} size={FT.meta}>
                热图不是事后补的：它就是分类头权重乘回特征，再按 min-max 归一化。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：三件事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 284, width: 1776 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>这一集讲三件事。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginTop: 28 }}>
              <Card label="一 · 卷积" accent={C.cyan} pad={22}>
                <Body>
                  核在序列上滑动，同一组权重看遍所有位置。三百个数压成二百八十八个特征，位置被池化丢掉一半。
                </Body>
                <div style={{ marginTop: 16 }}>
                  <Chip color={C.cyan}>{cv.flat} 个特征</Chip>
                </div>
              </Card>
              <Card label="二 · 残差" accent={C.amber} pad={22}>
                <Body>
                  书里说残差让深层更强。我们做四块，测试 {fmt4(md.resnet.testAcc)}；只做一块，{fmt4(md.resnetShallow.testAcc)}。深的反倒低了三点四个百分点。
                </Body>
                <div style={{ marginTop: 16 }}>
                  <Chip color={C.coral}>{fmt4(M.residual.deepMinusShallowPp, 1)} pp</Chip>
                </div>
              </Card>
              <Card label="三 · GAP-CAM" accent={C.violet} pad={22}>
                <Body>
                  全局平均池化给出长度无关的分类头，CAM 再把权重铺回每一天。热图能看，但精度掉了九点九个点。
                </Body>
                <div style={{ marginTop: 16 }}>
                  <Chip color={C.violet}>top-5 都在窗口尾</Chip>
                </div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
