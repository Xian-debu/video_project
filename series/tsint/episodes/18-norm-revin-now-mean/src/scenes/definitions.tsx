import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, LinePlot, M, PAD, Pages, Row, Stat, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="三个基准，一套骨架" goal="公式来自原论文" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 20 }}>
      <Card label="RevIN · 可逆实例归一化" accent={C.cyan} style={{ flex: 1, height: 340 }}>
        <Formula size={27} color={C.cyan}>x̃ = (x − μ) / √(σ² + ε)</Formula>
        <Formula size={24} color={C.cyan} style={{ marginTop: 10 }}>ŷ = γ·x̃ + β</Formula>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          μ、σ 只用输入窗的四十八个点。ε 取一万分之一。仿射默认关。
        </Body>
      </Card>
      <Card label="NowNorm · 末值平移" accent={C.violet} style={{ flex: 1, height: 340 }}>
        <Formula size={27} color={C.violet}>x̃ = x − x_T</Formula>
        <Formula size={24} color={C.violet} style={{ marginTop: 10 }}>ŷ = W·x̃ + b + x_T</Formula>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          只减不除。x_T 是输入窗最后一个观测，不是最后一个预测。
        </Body>
      </Card>
      <Card label="MeanNorm · 均值平移" accent={C.amber} style={{ flex: 1, height: 340 }}>
        <Formula size={27} color={C.amber}>x̃ = x − mean(x)</Formula>
        <Formula size={24} color={C.amber} style={{ marginTop: 10 }}>ŷ = W·x̃ + b + mean(x)</Formula>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          只减不除。保留幅值，输出可以直接进有量纲语义的损失。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三个公式共用一个骨架：先减基准，过同一个线性层，再加回基准。
      </Body>
      <div style={{ marginTop: 12 }}>
        <Chip color={C.cyan}>A38</Chip> <Chip color={C.violet}>A39</Chip> <Chip color={C.amber}>A40</Chip>
        <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginLeft: 12 }}>三条自授条目，各带断言</span>
      </div>
    </div>
  </>
);

const P2: React.FC = () => {
  const w = M.synthetic.slice(100, 172);
  const inp = w.slice(0, 48);
  const mu = inp.reduce((a, b) => a + b, 0) / inp.length;
  const last = inp[inp.length - 1];
  return (
    <>
      <Head kicker="03 / 定义" title="基准在窗口里的位置" goal="一条带漂移的窗口" />
      <div style={{ position: "absolute", left: PAD, top: 336, width: 1180 }}>
        <LinePlot
          width={1180}
          height={470}
          legend={false}
          series={[{ values: w, color: C.inkDim, name: "序列" }]}
          yFmt={(v) => fmtF(v, 1)}
          yMin={98}
          title="输入四十八点（左），未来二十四点（右）"
          hlines={[{ v: mu, color: C.amber, label: "窗口均值 " + fmtF(mu, 2) }]}
          vlines={[{ i: 47, color: C.violet, label: "末值 " + fmtF(last, 2) }]}
        />
      </div>
      <div style={{ position: "absolute", left: PAD + 1220, top: 336, width: CW - 1220, display: "flex", flexDirection: "column", gap: 18 }}>
        <Stat label="窗口均值 μ" value={fmtF(mu, 2)} accent={C.amber} style={{ height: 150 }} sub={<span>落在窗口中间</span>} />
        <Stat label="末值 x_T" value={fmtF(last, 2)} accent={C.violet} style={{ height: 150 }} sub={<span>落在窗口右端</span>} />
        <Stat label="两个基准差" value={fmtF(last - mu, 2)} accent={C.coral} style={{ height: 150 }} sub={<span>约半个窗口的漂移量</span>} />
      </div>
      <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
        <Body size={FT.body} color={C.inkDim}>
          序列往上走：均值落后，末值在右端。用均值当基准，模型得自己补上这段差。
        </Body>
      </div>
    </>
  );
};

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="三个不变量" goal="每个断言都能算到零" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Card label="平移不变" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.body} color={C.inkDim}>整条序列加一百，NowNorm 与 MeanNorm 的输出减回一百后逐位相同。</Body>
        <div style={{ marginTop: 16 }}><K color={C.violet}>误差 0 · A39 / A40</K></div>
      </Card>
      <Card label="尺度不变" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <Body size={FT.body} color={C.inkDim}>RevIN 把窗口除以自己的标准差：同一形状，不同量纲，归一化后输入一样。</Body>
        <div style={{ marginTop: 16 }}><K color={C.cyan}>输入比 {fmtF(M.norm.normScaleRatio, 3)}</K></div>
      </Card>
      <Card label="精确可逆" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <Body size={FT.body} color={C.inkDim}>反变换用保存的 μ、σ，不重算。往返必须是零，不是小于阈值。</Body>
        <div style={{ marginTop: 16 }}><K color={C.amber}>往返 {M.norm.revRoundtrip}</K></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三个不变量，对应代码里的三条测试：平移零、尺度一比、往返零。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="协议写死" goal="书里没有的，本仓定" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 22 }}>
      <Stat label="线性骨干" value="48 → 24" accent={C.cyan} style={{ flex: 1, height: 200 }} sub={<span>共享权重，无非线性</span>} />
      <Stat label="参数量" value={fmtInt(M.meta.params)} accent={C.violet} style={{ flex: 1, height: 200 }} sub={<span>1152 权重 + 24 偏置</span>} />
      <Stat label="Adam 学习率" value={fmtF(M.meta.training.lr, 3)} accent={C.amber} style={{ flex: 1, height: 200 }} sub={<span>批 {M.meta.training.batch} · 种子 {M.meta.training.seed}</span>} />
      <Stat label="轮数 / 耐心" value={M.meta.training.epochs + " / " + M.meta.training.patience} accent={C.coral} style={{ flex: 1, height: 200 }} sub={<span>到上限就停，恢复最优轮</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 620, width: CW }}>
      <Row name="统计窗" value="只用输入 H 段" color={C.cyan} note="碰输出段就是泄漏，推理时也拿不到" />
      <Row name="反变换" value="用保存的 μ、σ" color={C.violet} note="重算就不是同一次变换" />
      <Row name="归一化位置" value="模型内，训练外" color={C.amber} note="验证与测试用各自的窗口统计量" />
      <Row name="结果" value="固定种子可复跑" color={C.inkDim} note="所有数字来自证据程序一次运行" />
      <div style={{ marginTop: 30 }}>
        <Body size={FT.lead} color={C.ink}>
          这四条不在书里，但少一条，数字就不可比。
        </Body>
      </div>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, 0.336, 0.568, 0.806]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
