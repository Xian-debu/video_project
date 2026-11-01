import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Stat } from "../shared";

const SIG = [
  "-- Window.hs  切窗、起点、计数、折叠",
  "windowCount        :: Int -> Int -> Int -> Int",
  "windowStarts       :: Int -> Int -> Int -> [Int]",
  "windows            :: Int -> Int -> Matrix -> [Matrix]",
  "collapseWindowMask :: Int -> Int -> Int -> [Vector Bool] -> Vector Bool",
  "",
  "-- Metrics.hs 混淆矩阵与三种口径",
  "counts / prf / f1PointAdjusted / rangePRF",
  "",
  "-- Score.hs   三个公式，各一个函数，再各一个带校验的版本",
  "reconScore / reconScoreMae / predScore",
  "reconScoreChecked / predScoreChecked :: -> Either ScoreError Double",
].join("\n");

const PIT1 = [
  "-- 我第一版（错）：每个窗口一个 0/1 标签",
  "collapseWindowMask 100 10 5950 wm",
  "   => 只折出了第 0 窗的第 2 位",
  "-- 它要的是：每个窗口每个位置的掩码",
  "mask_i = replicate 100 (wm ! i)",
  "   => 按窗展开，再求并集",
].join("\n");

const pre = { fontFamily: "monospace", whiteSpace: "pre" as const };

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 10), pageAt("implementation", 30)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1090 }}>
            <Card label="src/TsBase/Algos/Ch04 · 三个模块，一套约定">
              <div style={{ ...pre, fontSize: FT.mono, lineHeight: 1.85, color: C.inkDim }}>{SIG}</div>
            </Card>
            <div style={{ marginTop: 20 }}>
              <Body size={FT.meta}>形状不对就返回 Left，不静默截断 —— 这是 E29 留下的规矩，这里继续用。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1220, top: 300, width: 600 }}>
            <Card label="约定" accent={C.amber} pad={22}>
              <Row name="窗长 C" value={String(M.window.len)} width={550} />
              <Row name="步长 s" value={String(M.window.stride)} note={"训练 " + M.window.strideTrain + "，推理 " + M.window.strideInfer} width={550} />
              <Row name="注入" value={M.inject.rate * 100 + "%"} note={"seed " + M.inject.seed + "，5–10σ"} width={550} />
              <Row name="选窗" value="1%" note={M.labels.k + " / " + M.window.count} width={550} />
              <Row name="范围 α" value="0.2" note="Tatbul 2018" width={550} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：坑一、坑二 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 850 }}>
            <Card label="第一个坑 · 折叠函数的参数" accent={C.coral}>
              <div style={{ ...pre, fontSize: 19, lineHeight: 1.75, color: C.inkDim, background: "#101823", border: "1px solid " + C.panelLine, borderRadius: 8, padding: "12px 14px" }}>{PIT1}</div>
              <Body size={FT.meta} style={{ marginTop: 16 }}>看上去没报错，断言也写错了期望。现在它钉的期望是：假 假 真 假 假。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 980, top: 300, width: 840 }}>
            <Card label="第二个坑 · 基线太弱" accent={C.amber}>
              <Row name="尖峰 10σ 进均值基线" value="只加 0.25–1.0" note="k² / 100，被一百个格子摊薄" width={790} />
              <Row name="正常窗口 MSE 最大" value="1.45" note="尖峰的贡献落在噪音区间里" width={790} />
              <Row name="选出的六个窗" value="与尖峰无关" note="真阳性 0，整张表全零" width={790} color={C.coral} />
              <Row name="改成逐窗直线拟合" value="残差 ≈ 尖峰本身" note="一次投影，不用训练" width={790} color={C.cyan} />
              <Body size={FT.meta} style={{ marginTop: 14 }}>这一集最重要的一次调试：同样的口径，换一个够强的重构基线，读数才不是零。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：坑三、坑四与断言 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 850 }}>
            <Card label="第三个坑 · 注入器" accent={C.coral}>
              <Row name="第一版" value="16 点 / 12 段" note="先按均匀分布排序，再拿光标往后推" width={790} color={C.coral} />
              <Row name="为什么" value="最小的数落在序列末尾" note="光标跟着跳到末尾，后面的候选全被跳过" width={790} />
              <Row name="改成占用表" value={M.inject.points + " 点 / " + M.inject.segments + " 段"} note="命中过的地方不再选，一次就对" width={790} color={C.cyan} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 980, top: 300, width: 840 }}>
            <Card label="第四个坑 · 分母" accent={C.amber}>
              <Row name="正确" value="分数 ÷ (C·d)" note="一个窗口一个数" width={790} />
              <Row name="错法" value="再除一遍 d" note="分数小一个数量级，排序不变" width={790} color={C.coral} />
              <Row name="测试会报吗" value="不会" note="所有断言都只看序，不看量级" width={790} />
              <Row name="钉住它的断言" value="输入翻倍 → 分数 ×4" note="线性关系一旦破坏，立刻红" width={790} color={C.cyan} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: CW, display: "flex", gap: 20 }}>
            <Stat label="Window 断言" value="16" sub="切窗、计数、折叠" accent={C.cyan} style={{ width: 400 }} />
            <Stat label="Metrics 断言" value="15" sub="混淆矩阵、三种口径" accent={C.amber} style={{ width: 400 }} />
            <Stat label="Score 断言" value="16" sub="三个公式、边界、形状" accent={C.violet} style={{ width: 400 }} />
            <Stat label="本集新增" value={String(M.meta.tests.new)} sub="全部是静默错误的守门人" accent={C.coral} style={{ width: 440 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 946, width: CW }}>
            <Verdict ok label="四个坑，四条断言，零静默" />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
