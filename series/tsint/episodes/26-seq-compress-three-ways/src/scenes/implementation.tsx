import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, CodeBlock, Formula, K, Chip } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 6), pageAt("implementation", 11), pageAt("implementation", 17), pageAt("implementation", 26)];
  const p = M.params;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1140 }}>
            <CodeBlock
              title="SCINet.hs · 奇偶拆分与交互卷积"
              width={1140}
              lines={[
                { t: "-- 奇偶拆分是一个置换" },
                { t: "splitOE xs = (evens xs, odds xs)" },
                { t: "mergeEO (e, o) = interleave e o" },
                { t: "" },
                { t: "-- 交互卷积：两条分支各出一半" },
                { t: "interact w x = let (e, o) = splitOE x" },
                { t: "                   a = conv w wEE e + conv w wEO o", dim: true },
                { t: "                   b = conv w wOE e + conv w wOO o", dim: true },
                { t: "               in mergeEO (a, b)" },
                { t: "" },
                { t: "-- 因果卷积：只往回看" },
                { t: "conv w k xs = zip (map (dot k) (causalWindows w xs)) …", dim: true },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1250, top: 320, width: 598 }}>
            <Stat label="卷积核参数" value={p.scin.toString()} sub="四个分支，各两个权" style={{ width: 598, height: 190 }} />
            <Stat label="乘加" value={p.denseMacs + " → " + p.compressedMacs} sub="压缩到位后只算十二步" accent={C.amber} style={{ width: 598, height: 190, marginTop: 22 }} />
            <Card label="金例 · 手算钉住" style={{ width: 598, marginTop: 22 }}>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block" }}>输入 0 1 2 3 → 偶数位 1,5</Mono>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block", marginTop: 8 }}>因果卷积 → 2,5,7</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1140 }}>
            <CodeBlock
              title="SparseTsf.hs · 相位折叠与稀疏窗口"
              width={1140}
              lines={[
                { t: "-- 相位：按 p 取模折成 m 条" },
                { t: "phaseOf p xs q = [x | (i, x) <- zip [0..] xs, i mod p == q]" },
                { t: "" },
                { t: "-- 只取每条相位的最后 w 个点" },
                { t: "window w zs = drop (length zs - w) zs" },
                { t: "" },
                { t: "-- 输出下标钉死：q + b * p" },
                { t: "forward w = [ sum [w[q][b][j] * zq[j] | j <- 0..w-1]", dim: true },
                { t: "            | q <- 0..p-1, b <- 0..k-1 ]", dim: true },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1250, top: 320, width: 598 }}>
            <Stat label="参数" value={p.sparse.toString()} sub={"p × K × w = 12 × 2 × 4"} accent={C.amber} style={{ width: 598, height: 190 }} />
            <Card label="金例 · p 等于二" style={{ width: 598, marginTop: 22 }}>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block" }}>输入 1 2 3 4 → 输出 30, 8, 3, 12</Mono>
              <Body size={FT.label} style={{ marginTop: 10 }}>权重摆好后，读数可由纸笔逐位复算。</Body>
            </Card>
            <Card label="为什么输出下标要钉死" accent={C.coral} style={{ width: 598, marginTop: 22 }}>
              <Body size={FT.label}>相位在前、块在后：同一相位的下一步必须落在同一条线上，否则折叠会错位。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1140 }}>
            <CodeBlock
              title="LastStepCompress.hs · 只留最后 L 步"
              width={1140}
              lines={[
                { t: "-- 截掉前面的历史" },
                { t: "lastSteps l xs = drop (length xs - l) xs" },
                { t: "" },
                { t: "-- 头是线性映射" },
                { t: "forward w z = matVec w z + b" },
                { t: "" },
                { t: "-- 闭式拟合：正规方程 + 高斯消元" },
                { t: "fit l = solve (gram xs) (matVecT xs ys)", dim: true },
                { t: "  where xs = map (lastSteps l) histories", dim: true },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1250, top: 320, width: 598 }}>
            <Stat label="参数" value={p.last.toString()} sub="24 × 8 + 24" accent={C.violet} style={{ width: 598, height: 190 }} />
            <Stat label="读多少历史" value="8 / 96" sub="前面八十八根全丢" accent={C.violet} style={{ width: 598, height: 190, marginTop: 22 }} />
            <Card label="金例 · 全一权重" style={{ width: 598, marginTop: 22 }}>
              <Mono size={FT.label} color={C.inkDim} style={{ display: "block" }}>历史 1 2 3 → 输出 6</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW, display: "flex", gap: 26 }}>
            <Card label="同一个求解器" accent={C.cyan} style={{ width: 860, height: 300 }}>
              <Formula size={34}>{"A^T A w = A^T y"}</Formula>
              <Body size={FT.label} style={{ marginTop: 14 }}>三个头都用正规方程加高斯消元。没有随机初始化，读数可逐位复现。</Body>
            </Card>
            <Card label="坑一 · 宽度必须精确" accent={C.coral} style={{ width: 860, height: 300 }}>
              <Mono size={FT.label} color={C.coral} style={{ display: "block" }}>lscFit: history width</Mono>
              <Body size={FT.label} style={{ marginTop: 12 }}>把整窗传进 lscFit 会直接报错：它要求历史宽度精确等于 L。最后八根必须先截。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 690, width: CW }}>
            <Card label="坑二 · 兜底写成空列表" accent={C.amber} style={{ width: CW }}>
              <Body size={FT.body}>
                尖峰子集的兜底写成 0，会让元素类型从列表变成数，编译期就拦住。写成空列表才是对的类型：没取到就是没有。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 26 }}>
            <Stat label="测试套" value={M.meta.tests.suites + " 套"} sub={M.meta.tests.asserts + " 条断言，零失败"} style={{ width: 560, height: 240 }} />
            <Stat label="本集新增" value="12 + 12 + 10" sub="奇偶 12、周期 12、最后时刻 10" accent={C.amber} style={{ width: 560, height: 240 }} />
            <Stat label="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="四组检查，零失败" accent={C.violet} style={{ width: 560, height: 240 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
            <Row name="三个模块" value={p.scin + " · " + p.sparse + " · " + p.last} note="卷积核、稀疏窗口、线性头，参数逐级变多" width={1500} />
            <Row name="一个比一个短" value="SCINet → SparseTsf → LastStep" note="最后一条只剩截断加一个矩阵乘" width={1500} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
