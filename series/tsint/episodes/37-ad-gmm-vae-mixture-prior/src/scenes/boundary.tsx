import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Chip, KV, K } from "../shared";

export const SABoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：这套数字管不到的地方 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1060 }}>
            <Card label="这套数字管不到的地方" accent={C.coral}>
              <Row name="八只票，全是白酒" value="同行业同市场" note="换行业、换市场，结论要重跑" width={1010} />
              <Row name="K 等于四，固定" value="没有学习模态数" note="模态数也是超参，没做选择" width={1010} />
              <Row name="真值只有两类" value="尖峰 + 斜坡" note="形状、周期、结构性断点都没试" width={1010} />
              <Row name="阈值全局一个数" value="不随季节重估" note="这正是报警率高的直接原因" width={1010} />
            </Card>
            <Body style={{ marginTop: 20, width: 1010 }}>
              w 的推断书里没写，我们选了两段式。换一种推断，数字会变——这不是免责声明，是这一集的实验边界。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1220, top: 288, width: 620 }}>
            <KV k="数据" v={"八只白酒 · " + M.data.rows + " 行"} note={M.data.start + " 至 " + M.data.end} />
            <KV k="那个洞" v={M.data.maxGap.days + " 天"} note={M.data.maxGap.pair + "，整段缺失"} color={C.coral} />
            <KV k="处理" v="丢窗，不补" note="窗内跨过这个洞就不能用" />
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12, width: 600 }}>
              插值会造出不存在的关系，后面所有分数都会被污染。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：两笔口径债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1040 }}>
            <Card label="两笔口径债" accent={C.amber}>
              <Row name="阈值按训练段定" value="测试段一个数不进" note="如果按测试段自己的分数重估，数字会好看" width={990} />
              <Row name="训练段只用了 207 窗" value={M.windows.train + " 个里每 " + M.windows.trainStride + " 取 1"} note="为了控时间；换全量训练，分量形状可能不同" width={990} />
              <Row name="分数整体变低" value="阈值跟着低" note="报警率就高" width={990} />
            </Card>
            <Body style={{ marginTop: 20, width: 990 }}>
              这是同一个阈值迁移问题，不是新问题。混合只是换了一个分数，没有解决迁移。按测试期自己的分数重估阈值，数字会好看很多，但那不是同一个实验，我们不做。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1200, top: 300, width: 640 }}>
            <Chip color={C.coral}>这次没做的诚实选择</Chip>
            <Body size={FT.lead} color={C.inkDim} style={{ marginTop: 18, width: 620, lineHeight: 1.7 }}>
              一条口径能救一张表，也能毁掉可比性。我们选择让报警率高着。
            </Body>
            <Card label="代价直接写在读数里" accent={C.coral} style={{ marginTop: 22 }}>
              <Row name="报警率" value={U("mix4").alertPct.toFixed(1) + "%"} note="几乎每一段都报警" width={580} />
              <Row name="精确率" value={U("mix4").precision.toFixed(4)} note="被误报吃掉" width={580} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：不声称的事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1000 }}>
            <Card label="不声称的事" accent={C.violet}>
              <Row name="不声称 SOTA" value="没有公开基准" note="只有八只票、这一套注入" width={950} />
              <Row name="不声称通用" value="只给两类异常" note="换形状要重跑结论" width={950} />
              <Row name="不声称实时" value="批处理" note="窗口要满一百天才打一次分" width={950} />
              <Row name="不声称混合提升检测" value="实测 0.2918 对 0.2756" note="差在噪声量级" width={950} />
              <Row name="不声称四个模式都是真的" value="一个主分量占六成" note="数据里没有四个清晰模式" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1160, top: 288, width: 680 }}>
            <Card label="这一集能带走两件事" accent={C.cyan}>
              <Row name="一个可复现的失败" value="混合不区分趋势" note="最小分量 NLL 比正常还低" width={630} />
              <Row name="一条口径" value="先证明模型没死" note="再谈分数" width={630} />
            </Card>
            <K style={{ display: "block", marginTop: 18 }}>下一集换一种关系：图。</K>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12, width: 650 }}>
              {M.next.title}
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
