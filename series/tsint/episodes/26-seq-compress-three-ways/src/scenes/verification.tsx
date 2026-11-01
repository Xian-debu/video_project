import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Bars, Formula, K, Chip } from "../shared";

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 6), pageAt("verification", 14), pageAt("verification", 23), pageAt("verification", 30)];
  const p = M.params;
  const dense = M.compress.find((c) => c.model === "dense")!;
  const sparse = M.compress.find((c) => c.model === "sparse")!;
  const last8 = M.compress.find((c) => c.model === "last8")!;
  const norm = M.spike.find((r) => r.subset === "normal")!;
  const spike = M.spike.find((r) => r.subset === "spike")!;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
            <Stat label="证据" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="四组检查，零失败" style={{ width: 560, height: 240 }} />
            <Stat label="测试套" value={M.meta.tests.suites + " 套"} sub={M.meta.tests.asserts + " 条断言，零失败"} accent={C.amber} style={{ width: 560, height: 240 }} />
            <Stat label="运行耗时" value={M.meta.sec + " s"} sub="一次命令跑完数据、拟合与评测" accent={C.violet} style={{ width: 560, height: 240 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 700, width: 900 }}>
            <Bars
              width={860}
              rowH={58}
              items={[
                { label: "数据", value: 7, text: "7 项", color: C.inkDim },
                { label: "奇偶", value: 8, text: "8 项", color: C.cyan },
                { label: "周期", value: 8, text: "8 项", color: C.amber },
                { label: "最后时刻", value: 8, text: "8 项", color: C.violet },
              ]}
              max={8}
            />
          </div>
          <div style={{ position: "absolute", left: 1090, top: 700, width: 760 }}>
            <Row name="新增断言" value="12 · 12 · 10" note="奇偶、周期、最后时刻" width={720} />
            <Row name="组合" value="7 + 8 + 8 + 8 = 31" note="四组加总是证据总数" width={720} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 900 }}>
            <Bars
              width={860}
              rowH={64}
              items={[
                { label: "稠密头", value: p.dense, text: p.dense.toLocaleString("en-US"), color: C.coral },
                { label: "最后八根", value: p.last, text: p.last.toString(), color: C.violet },
                { label: "周期稀疏", value: p.sparse, text: p.sparse.toString(), color: C.amber },
                { label: "卷积核", value: p.scin, text: p.scin.toString(), color: C.cyan },
              ]}
              max={p.dense}
            />
          </div>
          <div style={{ position: "absolute", left: 1050, top: 340, width: 800 }}>
            <Stat label="稠密乘加" value={p.denseMacs.toLocaleString("en-US")} sub="九十六步全看" accent={C.coral} style={{ width: 800, height: 180 }} />
            <Stat label="压缩后乘加" value={p.compressedMacs.toString()} sub="只做十二步读出" style={{ width: 800, height: 180, marginTop: 22 }} />
            <Stat label="比值" value={p.ratio + " ×"} sub="算力掉到八分之一" accent={C.cyan} style={{ width: 800, height: 180, marginTop: 22 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
            <Bars
              width={940}
              rowH={66}
              items={[
                { label: "周期稀疏", value: sparse.mae, text: sparse.mae.toFixed(4), color: C.cyan },
                { label: "最后八根", value: last8.mae, text: last8.mae.toFixed(4), color: C.violet },
                { label: "常数基线", value: M.baseline.constant, text: M.baseline.constant.toFixed(4), color: C.inkDim, dim: true },
                { label: "稠密线性", value: dense.mae, text: dense.mae.toFixed(4), color: C.coral },
              ]}
              max={1.0}
            />
          </div>
          <div style={{ position: "absolute", left: 1130, top: 340, width: 720 }}>
            <Row name="最准" value={"周期稀疏 " + sparse.mae.toFixed(4)} note="九十六个参数" color={C.cyan} width={680} />
            <Row name="居中" value={"最后 8 根 " + last8.mae.toFixed(4)} note="二百一十六个参数" color={C.violet} width={680} />
            <Row name="输给基线" value={"稠密 " + dense.mae.toFixed(4)} note={"基线 " + M.baseline.constant.toFixed(4)} color={C.coral} width={680} />
            <Card label="这不是实现错" accent={C.amber} style={{ width: 720, marginTop: 24 }}>
              <Body size={FT.label}>六百九十个重叠窗口喂不饱两千三百二十八个参数。样本问题，不是线性模型的原罪。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
            <Bars
              width={940}
              rowH={66}
              items={[
                { label: "周期稀疏", value: spike.mae_sparse, text: spike.mae_sparse.toFixed(4), color: C.cyan },
                { label: "最后八根", value: spike.mae_last8, text: spike.mae_last8.toFixed(4), color: C.violet },
                { label: "稠密线性", value: spike.mae_dense, text: spike.mae_dense.toFixed(4), color: C.coral },
                { label: "常数基线", value: spike.mae_constant, text: spike.mae_constant.toFixed(4), color: C.inkDim, dim: true },
              ]}
              max={1.4}
            />
          </div>
          <div style={{ position: "absolute", left: 1130, top: 340, width: 720 }}>
            <Card label="尖峰子集 · 二十四步累计波动前十分之一" style={{ width: 720 }}>
              <Row name="周期稀疏" value={spike.mae_sparse.toFixed(4)} note="比全样本高 0.33" color={C.cyan} width={680} />
              <Row name="最后八根" value={spike.mae_last8.toFixed(4)} note="比全样本高 0.30" color={C.violet} width={680} />
              <Row name="稠密" value={spike.mae_dense.toFixed(4)} note="比全样本高 0.27" color={C.coral} width={680} />
            </Card>
            <Card label="顺序没变" accent={C.cyan} style={{ width: 720, marginTop: 22 }}>
              <Body size={FT.label}>尖峰把差距放大，但排序不动：压得最狠的一条仍然最准，常数基线仍然最差。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 26 }}>
            <Stat label="六十分钟线" value={M.data.rows.toLocaleString("en-US")} sub={"根，覆盖 " + M.data.days + " 个交易日"} style={{ width: 560, height: 230 }} />
            <Stat label="窗口" value={M.data.windows.toString()} sub={"训练 " + M.data.train + "，测试 " + M.data.test} accent={C.amber} style={{ width: 560, height: 230 }} />
            <Stat label="一次运行" value={M.meta.sec + " s"} sub="复现只需一条命令" accent={C.violet} style={{ width: 560, height: 230 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
            <Card label="复现命令" style={{ width: CW }}>
              <Mono size={FT.label} color={C.cyan} style={{ display: "block" }}>{"tsbase evidence-ch03-compress --data / --out / --evidence"}</Mono>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>{"数据 sha256 " + M.data.sha256.slice(0, 16) + "…  ·  " + M.data.start + " → " + M.data.end}</Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
