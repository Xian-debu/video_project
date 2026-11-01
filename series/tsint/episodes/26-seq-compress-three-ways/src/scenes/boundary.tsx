import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, K, Chip, Verdict } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 5), pageAt("boundary", 11), pageAt("boundary", 18)];
  const dense = M.compress.find((c) => c.model === "dense")!;
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
            <Card label="边界一 · 闭式拟合" accent={C.coral} style={{ width: 860, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>不是训练</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                三个头都是解析解，没有随机梯度下降，也没有端到端训练。所以不能说 SCINet 训练收敛，只说三个头在同一份数据上的对照。
              </Body>
            </Card>
            <Card label="边界二 · 数据降频" accent={C.amber} style={{ width: 860, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>六十分钟，不是五分钟</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                原计划用五分钟线，但湖里五分钟线只剩最近五千根，不够十年窗口。改用六十分钟线，这件事写在脚本和证据里。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
            <Row name="能说的" value="三个头在同一份数据上的对照" note="同一输入、同一求解器、同一尺子" color={C.cyan} width={1500} />
            <Row name="不能说的" value="压缩一定提升预测" note="换样本、换频率，排序可能变" color={C.coral} width={1500} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1150 }}>
            <Card label="湖里的分钟线 · 只保留每只最近五千根" accent={C.amber} style={{ width: 1150 }}>
              <Row name="五分钟线" value="不够十年" note="最老的也只到最近五千根" width={1050} />
              <Row name="六十分钟线" value={M.data.rows.toLocaleString("en-US") + " 根"} note={M.data.start + " 起，覆盖 " + M.data.days + " 个交易日"} width={1050} />
              <Row name="选择" value="降频到六十分钟" note="窗口够长，代价是粒度变粗" color={C.amber} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 340, width: 558 }}>
            <Stat label="数据" value={M.data.rows.toLocaleString("en-US")} sub="根六十分钟线" accent={C.amber} style={{ width: 558, height: 200 }} />
            <Card label="如实记录" style={{ width: 558, marginTop: 24 }}>
              <Body size={FT.label}>脚本头部与证据 JSON 都写了降频原因。观众能复核，也能判断这个选择值不值。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 26 }}>
            <Card label="边界三 · 单只票" accent={C.violet} style={{ width: 860, height: 320 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>只有茅台</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                一份序列，不跨股票，不外推到全市场。三个压缩的对照只在这条线上成立。
              </Body>
            </Card>
            <Card label="边界四 · 稠密头输给基线" accent={C.coral} style={{ width: 860, height: 320 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>样本问题</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                六百九十个窗口，九十六维高度相关。换更大样本，结论可能反过来。这不是线性模型的原罪。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
            <Row name="稠密头" value={dense.mae.toFixed(4)} note="两千三百二十八个参数" color={C.coral} width={1500} />
            <Row name="常数基线" value={M.baseline.constant.toFixed(4)} note="不学习，重复最后一根" width={1500} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1150 }}>
            <Card label="三笔债 · 不影响本集交付" accent={C.amber} style={{ width: 1150 }}>
              <Row name="算法卡" value="未写" note="每个算法的口径还散在模块注释里" width={1050} />
              <Row name="demo 子命令" value="未做" note="tsbase demo 仍是文档里的规划" width={1050} />
              <Row name="ready 定义" value="散在文档" note="三条交付标准还没收成一处" width={1050} />
            </Card>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <Chip color={C.cyan}>实现通过</Chip>
              <Chip color={C.amber}>证据通过</Chip>
              <Chip color={C.violet}>仍算 ready</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 340, width: 558 }}>
            <Card label="敢说" accent={C.cyan} style={{ width: 558 }}>
              <Body size={FT.label}>三条压缩在同一份数据上的对照：参数、乘加、误差、尖峰、复现命令。</Body>
            </Card>
            <Card label="不敢说" accent={C.coral} style={{ width: 558, marginTop: 24 }}>
              <Body size={FT.label}>压缩一定提升预测。这需要多票、多频、端到端训练，本集都没做。</Body>
            </Card>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <Verdict ok label="实现通过" />
              <Verdict ok label="证据通过" />
              <Verdict ok={false} label="未做端到端训练" />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
