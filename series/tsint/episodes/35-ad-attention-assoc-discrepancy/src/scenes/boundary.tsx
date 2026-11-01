import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 9), pageAt("boundary", 19)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：四条限制 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
            <Card label="这套数字管不到的地方" accent={C.coral}>
              <Row name="输入只有一种表示" value="逐窗 z 分数" note="不是多变量，也没有做频域" width={950} />
              <Row name="形状注入来自另一只票" value="真实漂移未必长这样" note="所以形状召回是对这一类形状的召回" width={950} />
              <Row name="阈值全局一个数" value="不随季节变" note="冷却季和财报季共用一个 99 分位" width={950} />
              <Row name="只做离线" value="没有流式版" note="窗口要凑满 100 天才打一次分" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1110, top: 292, width: 740 }}>
            <Card label="还有一个结构性限制" accent={C.amber}>
              <Row name="两票" value="同为白酒" note="相关性高，代表不了整个市场" width={690} />
              <Row name="九十六天的洞" value={M.data.maxGap.days + " 天"} note="源数据整段缺失，不是停牌" width={690} />
              <Row name="丢窗规则" value="跨度 &gt; 10 天就丢" note="窗内出现空档一律不进样本" width={690} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 700 }}>
              A 股之外同样没验证过。这些限制不影响「关系视角有效」这个结论，但决定了它不能直接搬到生产。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页二：两笔口径债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1010 }}>
            <Card label="第一笔：真值点去的重" accent={C.amber}>
              <Row name="原始真值" value={M.inject.rawLen + " 点"} note="两个注入窗重叠时同一个点会被算两次" width={960} />
              <Row name="去重之后" value={M.inject.truthPts + " 点"} note="TP + FN = " + (M.units.assoc.tp + M.units.assoc.fn) + " 点，与关联差异的 FP/FN 对齐" width={960} color={C.cyan} />
              <Row name="屏幕口径" value="只用去重值" note={"所以是 " + M.inject.truthRuns + " 段 " + M.inject.truthPts + " 点"} width={960} />
            </Card>
            <Card label="第二笔：计划书里的 KL" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="计划估的" value={M.golden.planKl.toFixed(4)} note="验收清单里早期手算" width={960} />
              <Row name="规格锁的" value={M.golden.specTotal.toFixed(4)} note="14 条测试逐位比对，以它为准" width={960} color={C.violet} />
              <Row name="差别在哪" value="先验归一化方式" note="计划按连续高斯算，实现按离散归一" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 292, width: 730 }}>
            <Card label="还有一笔，我选择不报" accent={C.coral}>
              <Row name="真值点分数中位数" value="有" note="三个单元都记进了证据" width={680} />
              <Row name="干净点中位数" value="没用" note="实现里未覆盖的点默认 0" width={680} color={C.coral} />
              <Row name="原因" value="口径 artifact" note="不是模型行为，是统计窗口的写法" width={680} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 18, width: 700 }}>
              那个 0 是「没被任何测试窗覆盖到的点保持初值」造成的。它对结果没有任何影响，但如果拿上台讲「干净中位数是 0」，就是在讲一个 bug。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页三：不能说的事 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
            <Card label="这一集不声称的事" accent={C.coral}>
              <Row name="不声称 SOTA" value="没跑公开基准" note="SWaT / WADI 的表 4.2 是文献值，本机不可复现，屏幕不引用" width={1720} />
              <Row name="不声称通用" value="只验过这两只票" note="换市场、换频率，阈值和带宽都要重定" width={1720} />
              <Row name="不声称实时" value="离线批处理" note="在线版本要重新处理窗口与延迟" width={1720} />
              <Row name="不声称可解释" value="只给分数" note="知道哪个点异常，但说不出是哪一类关系坏了" width={1720} />
            </Card>
            <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
              <Verdict ok label="关系视角在这套数据上有效" />
              <Chip color={C.amber}>离线 · 两票 · 单一表示</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
