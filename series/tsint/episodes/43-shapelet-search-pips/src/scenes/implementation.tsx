import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, Verdict,
  MiniTable, CheckGrid, fmt4, fmtInt,
} from "../shared";

const CODE: React.CSSProperties = { background: "#101823", borderRadius: 10, padding: "14px 18px", fontFamily: FONT.mono, fontSize: FT.code, lineHeight: 1.62, color: C.inkDim, whiteSpace: "pre" };

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              三个模块，
              <br />
              四十四条新断言。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              三个 Haskell 模块都在 Ch05 下面：Shapelet 十九个测试，Pips 十一个，DistTest 十四个，合计四十四条新断言。整个仓库现在一百三十六套测试、一千八百四十六条断言，全部通过。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>136 套 · 1,846 条</Chip>
              <Verdict ok label="0 FAIL" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 940 }}>
            <Card label="新增模块与测试数" accent={C.cyan} pad={20}>
              <MiniTable
                head={["模块", "路径", "测试数"]}
                colW={[240, 560, 120]}
                width={880}
                rowH={44}
                rows={M.modules.map((m) => [m.path.split("/").pop() || m.path, m.path, String(m.tests)])}
              />
              <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: FT.body, color: C.ink }}>
                <span style={{ color: C.inkFaint }}>合计</span>
                <span>{M.meta.tests.assertions} 条新断言</span>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              三层循环，
              <br />
              一条命中记录。
            </div>
            <Body style={{ marginTop: 20, width: 670 }}>
              对每条训练序列、每个长度、每个起点：截出候选，算它与九十条序列的距离，用 bestSplitFor 算增益。保留下来的是一条命中记录：长度、起点、序列号、类别、增益、阈值。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Verdict ok label="shapeletSearch 返回 [Hit]" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 286, width: 1000 }}>
            <Card label="搜索主循环（Haskell 伪码）" accent={C.violet} pad={18}>
              <div style={CODE}>{["search train lens =","  [ Hit len start si cls g th","  | (si, xs) <- zip [0..] train","  , len <- lens","  , start <- [0 .. length xs - len]","  , let s = slice start len xs","  , let ds = map (slideMinDist s) train","  , let (cls, g, th) = bestSplitFor ds labels","  ]"].join("\n")}</div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              类别字段
              <br />
              不是序列标签。
            </div>
            <Body style={{ marginTop: 20, width: 750 }}>
              命中记录里的类别，是「这条候选对哪个类分裂最好」，不是候选所在序列的标签。这两个值经常不一样。分类器用的时候必须按这个字段过滤，否则准确率会掉到零。这是本集踩过的最大的坑。
            </Body>
            <div style={{ marginTop: 20, background: "#101823", border: "1px solid " + C.coral, borderRadius: 10, padding: "14px 18px", fontFamily: FONT.mono, fontSize: FT.code, color: C.coral, whiteSpace: "pre" }}>
              {"filter (\\h -> hitClass h == labelOf (train !! hitSeries h))"}
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="Top-5 检查：命中的类和来源序列" accent={C.coral} pad={20}>
              <MiniTable
                head={["起点", "来源序列", "序列标签", "命中类别", "匹配"]}
                colW={[140, 200, 200, 200, 140]}
                width={880}
                rowH={40}
                rows={M.top5.map((t) => [String(t.start), "#" + t.series, "第 " + (t.series + 1) + " 类", "第 " + (t.class + 1) + " 类", t.class === t.series ? "是" : "否"])}
              />
            </Card>
            <div style={{ marginTop: 14 }}>
              <Card label="过滤前 vs 过滤后" accent={C.amber} pad={18}>
                <Row name="不过滤" value="准确率 0.0" note="模板和标签对不上" width={860} color={C.coral} />
                <Row name="按 hitClass 过滤" value="准确率 1.0" note="六十条测试全对" width={860} color={C.cyan} />
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 720 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              排序，扫一遍，
              <br />
              取最大增益。
            </div>
            <Body style={{ marginTop: 20, width: 690 }}>
              把距离和标签配对，按距离排序；从左往右扫，维护正类前缀计数；每个严格上升的位置算一次增益，取最大的那个，记下相邻两个距离的中点作为阈值。复杂度是排序的 O(n log n)。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Card label="为什么只在中点切" accent={C.amber} pad={18}>
                <Body>
                  相等的距离不能被劈开：如果 d_k 等于 d_(k+1)，切出来的阈值会把同一距离的样本分到两边，增益是虚高的。
                </Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 286, width: 1000 }}>
            <Card label="bestSplitFor（去掉了格式化细节）" accent={C.cyan} pad={18}>
              <div style={CODE}>{["bestSplitFor ds labels =","  let pairs = sortOn fst (zip ds labels)","      n = length pairs","      pos = scanl (\\a (_, l) -> a + l) 0 pairs","      cands = [ (gainAt i, mid i)","              | i <- [1 .. n-1]","              , fst (pairs !! (i-1)) < fst (pairs !! i)","              ]","  in maximumBy (comparing fst) cands","","gainAt i = entropy pos_n","         - (i%n) * entropy (pos i)","         - ((n-i)%n) * entropy (pos n - pos i)"].join("\n")}</div>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              选点与检验，
              <br />
              两段更短的代码。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              PIPs 从首尾开始，每轮找最大偏差点，偏差用相邻已选点的线性插值算，选满十个为止。DistTest 里 F 的 p 值走不完全 beta 函数，H 先把所有值换成平均秩、做并列校正，再走卡方分布。
            </Body>
            <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
              <Chip color={C.amber}>PIPs 十个点</Chip>
              <Chip color={C.violet}>并列值取平均秩</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 286, width: 960 }}>
            <Card label="PIPs：贪心选偏差点" accent={C.amber} pad={18}>
              <div style={CODE}>{["pips xs k =","  sort (go [0, length xs - 1])","  where go picked","          | length picked >= k = picked","          | otherwise = go (insert (argmaxDeviation xs picked) picked)","","argmaxDeviation xs picked =","  maximumBy (comparing dev) [0 .. length xs - 1]","  where dev i = abs (xs !! i - interp picked i)"].join("\n")}</div>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="H：秩与并列校正" accent={C.violet} pad={18}>
                <div style={CODE}>{["ranks = map avgRank values","h = 12 / (n * (n + 1))","      * sum [ r_i^2 / n_i | i <- [1 .. k] ]","      - 3 * (n + 1)","p = chiSquaredCdf (k - 1) h"].join("\n")}</div>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.2 }}>
              二十三组检查，
              <br />
              全过。
            </div>
            <Body style={{ marginTop: 20, width: 730 }}>
              证据程序跑二十三组检查，全过，耗时三十六点八秒。结果写进 summary 与 checks 两个文件，任何一个读数与 dist.json 不一致，生成过程就会中止。
            </Body>
            <div style={{ marginTop: 22 }}>
              <Card label="证据程序" accent={C.violet} pad={20}>
                <div style={{ display: "flex", gap: 14 }}>
                  <Stat label="检查" value={M.meta.evidence.passed + " / " + M.meta.evidence.checks} sub="全部通过" valueColor={C.cyan} valueSize={34} />
                  <Stat label="耗时" value={fmt4(M.meta.evidence.seconds, 1) + " s"} sub="含全部搜索与检验" valueColor={C.amber} valueSize={34} />
                </div>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 286, width: 940 }}>
            <Card label="二十三项检查的分组" accent={C.cyan} pad={20}>
              <CheckGrid width={880} />
              <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
                数据 5 · 合成 8 · 真实 5 · 黄金小例 5。证据读数与 dist.json 逐字段对齐。
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
