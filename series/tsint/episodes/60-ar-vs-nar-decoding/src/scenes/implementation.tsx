import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Foot, Formula, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, pagesOf } from "../shared";
import { DirectLinkBars, TimingBars } from "../figs";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一百四十三行，<br />两个模块。</Body>
          <Body style={{ marginTop: 26 }}>
            自回归八十三行，非自回归六十行。没有 IO，没有外部库，唯一依赖是随机数核心。十八个单测，每个模块九条。证据程序四百二十一行，
            把读数写进 JSON。算法之间互不引用，这是仓库的硬规矩——所以这两个模块可以单独拷走用。
          </Body>
          <div style={{ display: "flex", marginTop: 26, gap: 10 }}>
            <Chip color={C.cyan}>纯函数</Chip>
            <Chip color={C.amber}>无 IO</Chip>
            <Chip color={C.violet}>可单模块拷走</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="两个模块，三块职责" accent={C.cyan} style={{ width: 1020 }}>
            <Row name="自回归" value={M.code.arLines + " 行"} note="Autoregressive.hs · 预测器类型、rollout、教师强制、断言" width={972} color={C.cyan} valueW={280} />
            <Row name="非自回归" value={M.code.narLines + " 行"} note="NonAutoregressive.hs · 行主序矩阵、narDecode、augmentFeat" width={972} color={C.violet} valueW={280} />
            <Row name="合计" value={M.code.moduleLines + " 行"} note="十八个单测分居两处，各九条" width={972} color={C.ink} valueW={280} />
            <Row name="证据程序" value={M.code.evidenceLines + " 行"} note="一条命令跑完 18 项检查，写 JSON 与 checks.txt" width={972} color={C.amber} valueW={280} />
            <Row name="依赖" value="TsBase.Core.Rand" note="仅用于数据切分与恒等样本；算法本身无随机" width={972} color={C.coral} valueW={280} />
          </Card>
        </div>
        <Foot>没有 IO，才敢说可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>rollout<br />是一个循环。</Body>
          <Body style={{ marginTop: 26 }}>
            每一步用当前窗口预测一个点，接到结果末尾，然后把窗口往前推一格。推进用 pushWindow：丢掉最老的点，追加新点。窗口是定长向量，
            复制是必要开销；F 等于二十时它占了主要时间。注释里写了改进方向：换成环形缓冲——本集没做，因为优先要正确性。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="复制量" v="20 × 512" color={C.amber} />
            <KV k="断言" v="3 条" color={C.coral} />
            <KV k="环形缓冲" v="仅注释" color={C.inkFaint} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <CodeBlock width={1010} size={FT.mono} title="rollout 的骨架：严格累加，窗口每次前进一格" lines={[
            { t: "rollout f w n = go w n []" },
            { t: "  where" },
            { t: "    go _ 0 acc  = reverse acc" },
            { t: "    go w k acc  = let y = f w" },
            { t: "                       w' = pushWindow w y" },
            { t: "                   in go w' (k - 1) (y : acc)" },
            { t: "" },
            { t: "pushWindow :: Window -> Double -> Window", hi: true },
            { t: "pushWindow w y = drop 1 w ++ [y]   -- 定长，复制" },
            { t: "" },
            { t: "-- 边界硬断言：负步数、空窗口都直接报错" },
            { t: "rollout _ []  _ = error \"empty window\"" },
            { t: "rollout _ _   n | n < 0 = error \"negative horizon\"" },
          ]} />
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, width: 1000 }}>
            复制成了主成本，这也解释了后面计时为什么是 15.71× 而不是十几倍以上的数量级。
          </div>
        </div>
        <Foot>先正确，再快。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一条直连，<br />救回一切。</Body>
          <Body style={{ marginTop: 26 }}>
            头用岭回归闭式解，没有梯度下降：样本只有几千、特征只有六十五维，闭式解一遍就够，还能精确报告残差。输入是六十四维表示，
            再拼窗口最后一点。这条直连是关键设计：没有它，头的误差被重建损失盖住，单步相对误差会涨到六点九八，连基线都打不过。
          </Body>
          <Formula size={40} style={{ marginTop: 24 }} note="加窗口最后一点 z，F=1 从 6.98 回到 1.14">
            ϕ(x) = [ h<sub style={{ fontSize: 22 }}>64</sub> , z ]
          </Formula>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="消融：F=1 时的相对误差" accent={C.coral} style={{ width: 1020 }}>
            <DirectLinkBars width={950} />
          </Card>
          <Card label="为什么必须单独立一项" accent={C.cyan} style={{ marginTop: 18, width: 1020 }}>
            <Row name="没有直连" value="6.98×" note="表示里的低频形状够还原窗口，不够预测下一点" width={972} color={C.coral} valueW={260} />
            <Row name="加上直连" value={fmt4(M.ar.rel1) + "×"} note="自回归与 NAR 在第一步是同一个预测器" width={972} color={C.cyan} valueW={260} />
          </Card>
        </div>
        <Foot>这条直连是本集最大的设计决定。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第一次测，<br />NAR 反而更慢。</Body>
          <Body style={{ marginTop: 26 }}>
            比值零点九一，和常识相反。查了很久，问题在垃圾回收：第一次强制求值产生大量垃圾，下一段才回收，回收开销被记到了下一个计时窗口。
            修法三段：先回收、再读时钟、再强制求值；并且在计时前把三条路径都预热一遍。单次测量还会抖，所以重复三次取最小值。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="首测" v="0.91×" color={C.coral} />
            <KV k="三次取最小" v={fmt4(M.timing.ratio) + "×"} color={C.cyan} />
            <KV k="验收线" v="5×" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一台机器、同一批窗口" accent={C.cyan} style={{ width: 1020 }}>
            <TimingBars width={950} />
          </Card>
          <Card label="计时事故的定位记录" accent={C.amber} style={{ marginTop: 18, width: 1020 }}>
            <Row name="现象" value="0.91×" note="NAR 比 AR 还慢，与常识相反" width={972} color={C.coral} valueW={260} />
            <Row name="真因" value="垃圾回收" note="首轮求值的垃圾在下一段才回收" width={972} color={C.violet} valueW={260} />
            <Row name="修法" value="三段计时" note="先回收、再读钟、再强制求值，加预热，三次取最小" width={972} color={C.cyan} valueW={260} />
          </Card>
        </div>
        <Foot>计时器量的不是算法，是整个堆。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
