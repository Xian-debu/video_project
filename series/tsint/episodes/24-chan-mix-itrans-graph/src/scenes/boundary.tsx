import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict, Chip } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 7), pageAt("boundary", 14), pageAt("boundary", 22)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1120 }}>
            <Card label="第一条：解析探测 ≠ 训练过的权重" accent={C.coral} style={{ height: 330 }}>
              <Row name="我们验证的" value="结构、参数量、等式" note="是否等变、是否归一到 1、输出是否精确" width={1060} />
              <Row name="我们没验证的" value="这些权重能赚钱吗" note="没有训练、没有损失曲线、没有样本外" width={1060} />
              <Row name="差在哪" value="结构正确 ≠ 效果好" note="图上消息传递的收益是实证问题，不是数学问题" width={1060} />
            </Card>
            <Card label="第二条：静态图 ≠ 时变图" accent={C.amber} style={{ height: 250, marginTop: 24 }}>
              <Row name="本集" value="一张图用到底" note="全样本相关 → kNN → 固定邻接" width={1060} />
              <Row name="书里 3.4.3" value="TPGNN 类时变图" note="每个窗口一张图，代价与稳定性都不同" width={1060} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 380, width: 560 }}>
            <Stat label="训练" value="0" sub="本集没有任何优化步骤" accent={C.coral} style={{ height: 210 }} />
            <Stat label="图" value="1 张" sub="静态，不随时间更新" accent={C.amber} style={{ height: 210, marginTop: 24 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 390, width: 1120 }}>
            <Card label="第三条：k 是看到结果之后选的" accent={C.coral} style={{ height: 260 }}>
              <Row name="k = 2" value="ARI 0.519" note="汇报值" width={1060} />
              <Row name="k = 3" value="ARI 0.296" note="没有汇报成主值，但也不该藏起来" width={1060} />
            </Card>
            <Card label="第四条：缺口与对齐" accent={C.amber} style={{ height: 340, marginTop: 24 }}>
              <Row name="最大缺口" value="17 个交易日" note="2018-02-05 附近，春节 + 熔断停牌" width={1060} />
              <Row name="另一处缺口" value="9 个交易日" note="2025-02-05 附近，窗口直接从缺口上跨过" width={1060} />
              <Row name="处理方式" value="按行切窗，不插值" note="相邻窗口可能跨月，时间戳仍单调" width={1060} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1160, top: 390, width: 560 }}>
            <Verdict ok label="弱点要写在明面上" />
            <Body size={FT.label} style={{ marginTop: 24 }}>
              每一条“没做”都写进报告：没训练、没时变图、k 事后选、缺口未插值。隐藏弱点比弱点本身更危险。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: 800 }}>
            <Card label="缺口的形状" accent={C.amber} style={{ height: 420 }}>
              <Row name="2018-02-05" value="17 天" note="春节休市叠加熔断后停牌" width={740} />
              <Row name="2025-02-05" value="9 天" note="同一位置，短一些" width={740} />
              <Row name="窗口 96" value="跨缺口" note="一个窗口可以同时含缺口前后" width={740} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 840, top: 400, width: 900 }}>
            <Card label="工程债：三条" accent={C.violet} style={{ height: 420 }}>
              <Row name="A7 算法卡" value="未写" note="书上 3.3.6 / 3.4.3 的映射还没进卡片" width={860} />
              <Row name="demo CLI" value="未开" note="没有一条命令能现场跑出 44 项" width={860} />
              <Row name="ready 定义" value="待统一" note="本集的 ready 只到“证据可复算”" width={860} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 880, width: CW, display: "flex", gap: 16 }}>
            <Chip color={C.coral}>不训练</Chip>
            <Chip color={C.amber}>静态图</Chip>
            <Chip color={C.violet}>k 事后选</Chip>
            <Chip color={C.inkFaint}>缺口不插值</Chip>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 410, width: 1000 }}>
            <Card label="这一集敢说的" accent={C.cyan} style={{ height: 480 }}>
              <Row name="敢说" value="三个模块实现了" note="混合、变量注意力、图卷积，都是纯函数" width={940} />
              <Row name="敢说" value="四十四项检查可复算" note="0.30 s，读真实面板，容差写死" width={940} />
              <Row name="敢说" value="关系是真的" note="行业内 0.694 vs 行业间 0.437，差 1.6 倍" width={940} />
              <Row name="不敢说" value="能预测收益" note="没有任何训练或样本外检验" width={940} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 410, width: 680 }}>
            <Stat label="可复算项" value="44" sub="全部零失败" accent={C.cyan} style={{ height: 220 }} />
            <Stat label="敢说能预测吗" value="不能" sub="没有训练，就没有资格谈效果" accent={C.coral} style={{ height: 220, marginTop: 40 }} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
