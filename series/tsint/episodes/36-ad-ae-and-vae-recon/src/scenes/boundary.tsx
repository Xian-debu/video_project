import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat } from "../shared";

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：四条限制 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            <Card label="这套数字管不到的地方" accent={C.coral}>
              <Row name="只有两只票" value="都是白酒" note="同行业、同市场，代表不了全市场" width={1030} />
              <Row name="一个九十六天的洞" value={M.data.maxGap.days + " 天"} note="源数据整段缺失，不是停牌标记" width={1030} />
              <Row name="真值只有两类" value="尖峰 + 斜坡" note="换异常形状，结论要重跑" width={1030} />
              <Row name="阈值全局一个数" value="不随季节重估" note="这正是报警率高的直接原因" width={1030} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 670 }}>
            <Card label="那个洞" accent={C.amber}>
              <Row name="位置" value={M.data.maxGap.pair} note="2015 年三季度" width={610} />
              <Row name="处理" value="丢窗，不补" note="窗内跨度超过十天就丢" width={610} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 640, marginTop: 16 }}>
              窗口内部跨过这个洞就不能用：插值会造出不存在的关系，后面所有分数都会被污染。
            </Body>
            <Chip color={C.coral} style={{ marginTop: 16 }}>单票、单市场、点调整口径</Chip>
          </div>
        </AbsoluteFill>

        {/* 页二：口径债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1060 }}>
            <Card label="两笔口径债" accent={C.amber}>
              <Row name="真值段很短" value="尖峰 2 点 / 斜坡 25.5 点" note="点调整会放大短段的命中" width={1010} />
              <Row name="训练只用了一部分" value={M.windows.trainUsed + " / " + M.windows.train} note={"每 " + M.windows.trainStride + " 个取一个，为控时间"} width={1010} />
              <Row name="散点是抽样" value="每 8 窗取 1 点" note="半径中位数是全量算的" width={1010} />
            </Card>
            <Body style={{ marginTop: 20, width: 1020 }}>
              如果按测试期自己的分数重估阈值，数字会好看很多。但那不是同一个实验，我们不做。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 288, width: 650 }}>
            <Stat label="报警率（AE-16）" value={U("ae16").alertPct.toFixed(1) + "%"} sub="阈值不迁移的直接代价" accent={C.coral} valueSize={62} />
            <Stat label="干净点中位 vs 阈值" value={M.stats.ae16 ? M.stats.ae16.cleanMedian.toFixed(3) : "0.607"} sub="高于训练阈值，必然误报" style={{ marginTop: 20 }} valueSize={52} />
          </div>
        </AbsoluteFill>

        {/* 页三：不声称的事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            <Card label="不声称的事" accent={C.violet}>
              <Row name="不声称 SOTA" value="没有公开基准" note="只看这两只票、这一套注入" width={1030} />
              <Row name="不声称通用" value="只给两类异常" note="形状、周期、结构性断点都没试" width={1030} />
              <Row name="不声称实时" value="批处理" note="窗口要填满一百天才打一次分" width={1030} />
              <Row name="不声称 KL 提升检测" value="实测略低" note="0.4229 / 0.4412 对 0.4507" width={1030} />
              <Row name="不声称恒等陷阱只在玩具里" value="它是精确解" note="目标函数允许，换损失不行" width={1030} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1190, top: 288, width: 660 }}>
            <Verdict ok label="一个可复现的失败对照" />
            <Body style={{ width: 630, marginTop: 18 }}>
              这一集能带走的是两件事：一个能复现的恒等陷阱，一条口径——先证明模型没死，再谈分数。
            </Body>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 630, marginTop: 14 }}>
              如果异常很短，短到只影响一两行，注意力类的方法也许看不出；重构类的反而可能更敏感。这个对比留到后面。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
