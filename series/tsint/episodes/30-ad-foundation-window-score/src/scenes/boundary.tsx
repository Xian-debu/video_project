import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FT } from "../../design/tokens";
import { PAD, CW, M, fmtF, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Formula, Chip } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 12), pageAt("boundary", 21)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：不报模型 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1030 }}>
            <Card label="这一集没有模型" accent={C.coral}>
              <Row name="重构基线" value="逐窗直线拟合" note="闭式解，没有参数可学" width={970} />
              <Row name="预测基线" value="前 90 点外推后 10 点" note="同样是一次拟合" width={970} />
              <Row name="标签来源" value="人工注入" note="真实市场没有逐点标注" width={970} />
              <Row name="所以不比较" value="生成质量 · 模型能力" note="只比较口径内部的自洽" width={970} color={C.coral} />
            </Card>
            <div style={{ marginTop: 20 }}>
              <Body size={FT.meta}>这不是谦虚，是口径要求：评分公式的输入是“预测 + 真值”，它不关心预测从哪来。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1170, top: 300, width: 650 }}>
            <Card label="平局不可推广" accent={C.amber} pad={22}>
              <Body size={FT.body}>
                {M.scores.mse.f1 === M.scores.mae.f1
                  ? "这组数据里 MSE 与 MAE 的排序完全一致：异常少而尖，平方被少数点主导。换成密集的小偏移，两者立刻分开。"
                  : "两种口径的读数不同，别把其中一种当成另一种的近似。"}
              </Body>
              <Body size={FT.meta} style={{ marginTop: 14 }}>一个实验里相等，不等于定义上相等。</Body>
            </Card>
            <Card label="窗口级 F1 的使用条件" accent={C.violet} pad={22} style={{ marginTop: 18 }}>
              <Formula size={34} note="只有 s = C、窗口不重叠时，窗口数才是点数的 C 分之一">窗口数 ≈ N / C</Formula>
              <Body size={FT.meta} style={{ marginTop: 10 }}>本集 s = 10，一个点进十窗 —— 窗口级 F1 不能直接和逐点指标比。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三笔债 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <div style={{ display: "flex", gap: 22 }}>
              <Card label="债一 · 阈值" accent={C.cyan} style={{ width: 552 }}>
                <Body size={FT.body}>分数怎么变成 0/1？取 1% 是拍脑袋；阈值一变，P、R、F1 全变。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>这一集只固定了“取前 1%”，没论证它好。</Body>
              </Card>
              <Card label="债二 · 分类器" accent={C.amber} style={{ width: 552 }}>
                <Body size={FT.body}>同样的分数喂给不同分类器 —— 阈值、聚类、隔离森林 —— 排序会再翻一次。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>评分只是第一步，判定是第二步。</Body>
              </Card>
              <Card label="债三 · 统计基线" accent={C.violet} style={{ width: 552 }}>
                <Body size={FT.body}>比直线拟合更笨的基线：移动平均、季节分解、EWMA。它们可能赢。</Body>
                <Body size={FT.meta} style={{ marginTop: 12 }}>没有这些基线，“够强”只是相对自己的旧版本。</Body>
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 620, width: CW }}>
            <Card label="所以这一集只回答一个问题" accent={C.cyan}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <Chip color={C.cyan}>已答</Chip>
                <Body size={FT.body}>同一组预测，换评分口径，F1 会变、排序会翻 —— 报指标必须报口径。</Body>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 16 }}>
                <Chip color={C.coral}>未答</Chip>
                <Body size={FT.body}>哪种口径更好、阈值取多少、模型该多强 —— 后面五集。</Body>
              </div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：交给 E31 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <Card label="下一集 · 阈值与基线" accent={C.cyan}>
              <Row name="问题" value="分数怎么变成 0/1" note="阈值不是常数" width={950} />
              <Row name="配方" value="阈值 + 分类器 + 最笨的基线" note="三件套，一个都不能少" width={950} />
              <Row name="口径" value="同一分数，扫一遍阈值" note="P/R/F1 三条曲线一起动" width={950} />
              <Row name="预警" value={fmtF(M.scores.mse.f1, 4) + " 这个数" } note="别把它当模型水平" width={950} color={C.coral} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 300, width: 670 }}>
            <Card label="留给观众的判断" accent={C.amber} pad={22}>
              <Body size={FT.body}>下次看到一篇异常检测论文报 F1，先问三件事：口径是逐点、点调整还是范围？阈值怎么定？有没有和移动平均比？</Body>
              <Body size={FT.meta} style={{ marginTop: 14 }}>三个问题里有两个没答，那个 F1 就没法复现。</Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
