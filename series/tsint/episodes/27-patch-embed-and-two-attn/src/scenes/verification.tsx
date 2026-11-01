import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Bars, Verdict, KV } from "../shared";

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 5), pageAt("verification", 11), pageAt("verification", 18), pageAt("verification", 28)];
  const t = M.patchtst;
  const x = M.cross;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="三十一项检查，三组，零失败" accent={C.cyan} style={{ width: CW }}>
              <Bars
                items={[
                  { label: "块嵌入", value: 12, text: "12", color: C.cyan },
                  { label: "PatchTST", value: 10, text: "10", color: C.amber },
                  { label: "交叉注意力", value: 9, text: "9", color: C.violet },
                  { label: "合计", value: 31, text: "31", color: C.cyan, dim: true },
                ]}
                width={1600}
                max={31}
                rowH={78}
                unit={"证据检查项。" + M.meta.checks.ok + " / " + M.meta.checks.total + " 通过"}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW, display: "flex", gap: 26 }}>
            <Stat label="全仓套数" value={String(M.meta.tests.suites)} sub="九十二套，零失败" style={{ width: 540 }} />
            <Stat label="断言" value={M.meta.tests.asserts + " 条"} sub="全部通过" accent={C.cyan} style={{ width: 540 }} />
            <Stat label="耗时" value={M.meta.sec.toFixed(2) + " s"} sub="一组可用重跑的读数" accent={C.amber} style={{ width: 540 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
            <Card label="断言从哪里来 · 三条金例各二十条左右" style={{ width: CW }}>
              <Bars
                items={[
                  { label: "块嵌入 Spec", value: M.meta.tests.patchembed, text: String(M.meta.tests.patchembed), color: C.cyan },
                  { label: "PatchTST Spec", value: M.meta.tests.patchtst, text: String(M.meta.tests.patchtst), color: C.amber },
                  { label: "交叉注意力 Spec", value: M.meta.tests.crossattn, text: String(M.meta.tests.crossattn), color: C.violet },
                ]}
                width={1600}
                max={20}
                rowH={92}
                unit="不是每条都测数值，有的测形状、方向、掩码、置换"
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
            <Row name="金例来源" value="合成 + 真实面板" note="十一块、重叠、置换、通道独立都能手工验算" width={1660} />
            <Row name="零失败" value={"31 / " + M.meta.checks.total} note="失败即中止，不落文件" color={C.cyan} width={1660} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="块嵌入读数" accent={C.cyan} style={{ width: CW }}>
              <Row name="块数" value={String(M.patch.n)} note="九十六步，十六步一块，步长八" width={1660} />
              <Row name="参数" value={String(M.patch.params)} note="十六乘三十二，加三十二个偏置" width={1660} />
              <Row name="位置" value={String(M.patch.posParams)} note="十一个位置，每个三十二维" width={1660} />
              <Row name="切片误差" value={M.patch.sliceErr.toFixed(1)} note="每块逐位等于原序列对应切片" color={C.cyan} width={1660} />
              <Row name="不重叠拼回" value={M.patch.stitchPatches + " 块"} note="步长等于块长时，九十六除十六" width={1660} />
              <Row name="拼回误差" value={M.patch.stitchErr.toFixed(1)} note="原序列前三十二步逐位相等" color={C.cyan} width={1660} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="PatchTST 读数" accent={C.amber} style={{ width: CW }}>
              <Row name="编码器" value={String(t.encParams)} note="四个方阵加两个前馈矩阵" width={1660} />
              <Row name="预测头" value={String(t.headParams)} note="十一乘三十二，再乘二十四步" width={1660} />
              <Row name="合计" value={String(t.totalParams)} note="一层编码器加一个头" color={C.amber} width={1660} />
              <Row name="通道差" value={t.channelDiff.toFixed(1)} note="逐通道循环和整面板输入逐位相同" color={C.cyan} width={1660} />
              <Row name="置换差" value="8.88e−16" note="块顺序与位置编码同步打乱，结果不变" width={1660} />
              <Row name="遮蔽一块" value={t.noMaskDelta.toFixed(4)} note="扰动一块，输出差百分之一五" width={1660} />
              <Row name="感受野" value={t.receptiveSteps + " 步"} note="第一块只管前十六步" color={C.cyan} width={1660} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: CW }}>
            <Card label="交叉注意力读数" accent={C.violet} style={{ width: CW }}>
              <Row name="参数" value={String(x.params)} note="八个方阵加两段前馈加二十四个查询" width={1660} />
              <Row name="查询标准差" value={x.querySd.toFixed(4)} note="初始化 N(0, 0.02)，实测偏差万分之四内" width={1660} />
              <Row name="单记忆权重" value={x.oneTokenWeightErr.toFixed(1)} note="只有一个记忆时，权重恰为一" color={C.violet} width={1660} />
              <Row name="分支输出" value={x.branchErr.toFixed(1)} note="恰等于 V_e 乘输出投影，1e−12" color={C.violet} width={1660} />
              <Row name="上三角" value={x.upperTriMax.toFixed(1)} note="因果掩码，未来位置精确为零" width={1660} />
              <Row name="行和误差" value="4.44e−16" note="九十六列 softmax，行和为一" width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 890, width: CW, display: "flex", gap: 22, alignItems: "center" }}>
            <Verdict ok label={"31 / " + M.meta.checks.total + " 检查通过"} />
            <Verdict ok label={M.meta.tests.suites + " 套 / " + M.meta.tests.asserts + " 断言"} />
            <Mono size={FT.meta} color={C.inkFaint}>读数文件 inventory/evidence/ch3-patch-*，可重跑</Mono>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
