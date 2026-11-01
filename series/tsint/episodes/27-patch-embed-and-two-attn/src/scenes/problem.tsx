import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Chip, Bars } from "../shared";

const dense = M.patchtst.denseInteractions;
const folded = M.patchtst.interactions;
const long = 336 * 336;

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 10), pageAt("problem", 17), pageAt("problem", 26)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <Card label="逐点模型 · 九十六个位置就是九十六个 token" accent={C.coral} style={{ width: 1150 }}>
              <Formula size={46}>{"X = [x_1, x_2, …, x_96] ∈ R^{96×d}"}</Formula>
              <Formula size={46} style={{ marginTop: 16 }}>{"A = softmax(Q K^T / √d_k),  A ∈ R^{96×96}"}</Formula>
              <Body size={FT.body} style={{ marginTop: 20 }}>
                每个时间点一个向量，自注意力在全部位置之间做。交互对数是位置的平方，窗口一长就爆。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 320, width: 558 }}>
            <Stat label="交互对数" value={dense.toLocaleString("en-US")} sub="九十六乘九十六" accent={C.coral} style={{ width: 558, height: 210 }} />
            <Stat label="窗口三百三十六步" value={long.toLocaleString("en-US")} sub="十一万对，平方的账" accent={C.coral} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="第一刀 · 把时间轴折成块" accent={C.cyan} style={{ width: 1150 }}>
              <Formula size={46}>{"x_{1:96} → (p_1, p_2, …, p_11),   p_i ∈ R^{16}"}</Formula>
              <Row name="块长" value={String(M.patch.pat)} note="每块十六步" width={1050} />
              <Row name="步长" value={String(M.patch.stride)} note={"相邻块重叠 " + M.patch.overlap + " 个点"} width={1050} />
              <Row name="块数" value={String(M.patch.n)} note="九十六减十六，除以八，加一" color={C.cyan} width={1050} />
              <Body size={FT.label} style={{ marginTop: 14 }}>
                注意力从九十六乘九十六降到十一乘十一。位置少了，每对交互管辖的跨度就长了。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="块数" value={String(M.patch.n)} sub="不是十二" accent={C.cyan} style={{ width: 558, height: 210 }} />
            <Stat label="交互" value={String(folded)} sub={"从 " + dense.toLocaleString("en-US") + " 降下来"} accent={C.cyan} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
            <Card label="代价 · 块内十六步被压成一个点" accent={C.amber} style={{ width: CW }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: 6 }}>
                <Formula size={54} color={C.amber}>{"16 步 → 1 个向量"}</Formula>
                <Chip color={C.amber}>一个线性映射</Chip>
                <Chip color={C.coral}>不可逆</Chip>
              </div>
              <Row name="块内信息" value="有损" note="十六步的细节被一个投影摊平" color={C.amber} width={1660} />
              <Row name="能补回吗" value="只能靠块间" note="重叠八个点，相邻块共享一半上下文" width={1660} />
              <Row name="赌注" value="高频不重要，低频更重要" note="这是一个方法层面的选择，不是失误" color={C.cyan} width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 26 }}>
            <Card label="第二个赌注 · 通道独立" accent={C.violet} style={{ width: 860, height: 170 }}>
              <Body size={FT.label}>八个通道各走各的编码器，参数共享，顺序无关。通道之间的关系完全不建模。</Body>
            </Card>
            <Card label="为什么敢赌" accent={C.cyan} style={{ width: 860, height: 170 }}>
              <Body size={FT.label}>时间序列样本少，通道间混合容易过拟合；先保住每条的时序结构，再谈跨通道。</Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
