import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, Verdict, Chip } from "../shared";

export const SBoundary: React.FC = () => {
  const at = [0, pageAt("boundary", 6), pageAt("boundary", 11), pageAt("boundary", 15), pageAt("boundary", 22)];
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 410, width: 900 }}>
            <Card label="第一条：没有端到端训练" accent={C.coral} style={{ height: 420 }}>
              <Body size={FT.label}>
                这里验证的是损失函数和梯度的实现，没有把 CRPS 接回一个预测头去训练。
              </Body>
              <Row name="CRPS 值对" value="实现正确" note="只能说明口径一致" color={C.cyan} width={840} />
              <Row name="预测更准" value="没有证据" note="本集不宣称" color={C.coral} width={840} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 410, width: 780 }}>
            <Card label="第二条：VAE 只在一百个窗口上训练" accent={C.coral} style={{ height: 420 }}>
              <Body size={FT.label}>
                六十轮全批量，没有正则、没有早停、没有学习率衰减。换数据集，ELBO 的绝对值不能直接比。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>
                只保证：损失下降、梯度对、编码可解。
              </Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 410, width: 900 }}>
            <Card label="第三条：只有一个市场" accent={C.coral} style={{ height: 420 }}>
              <Row name="标的" value="8 只" note="A 股，日频" width={840} />
              <Row name="区间" value="2015 → 2025" note="含缺口" width={840} />
              <Row name="换市场" value="覆盖率要重验" note="不要把这里的数当通用结论" color={C.amber} width={840} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 410, width: 780 }}>
            <Card label="第四条：估计必须带样本数" accent={C.coral} style={{ height: 420 }}>
              <Formula size={44} style={{ lineHeight: 1.5 }}>偏差 ≈ 0.5642 / S</Formula>
              <Body size={FT.label} style={{ marginTop: 16 }}>
                S = 10 时偏差五个百分点，S = 100 时半个百分点。只报估计值、不报 S，读者无法判断偏差量级。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 410, width: 900 }}>
            <Card label="第五条：覆盖率不是越高越好" accent={C.coral} style={{ height: 430 }}>
              <Body size={FT.label}>
                覆盖高，往往是区间宽。宽区间当然盖得住，但信息量更少。要和名义值比，也要和宽度一起比。
              </Body>
              <Row name="名义 80%" value="实测 85.3%" note="宽了，盖多了" color={C.amber} width={840} />
              <Row name="名义 95%" value="实测 94.4%" note="接近名义" color={C.cyan} width={840} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 410, width: 780 }}>
            <Stat label="正确的问法" value="窄且准" sub="不是“覆盖率高”" accent={C.cyan} style={{ height: 200 }} />
            <Body size={FT.label} style={{ marginTop: 24 }}>
              覆盖率是必要条件，不是目标。两个模型覆盖率相同，宽度更窄的那个更好。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 420, width: 1000 }}>
            <Card label="已知偏差：数据缺口" accent={C.amber} style={{ height: 430 }}>
              <Row name="最长缺口" value="11 天" note="2015 年，连续交易日缺失" color={C.amber} width={940} />
              <Row name="处理" value="不剔除" note="窗口按行号连续切" width={940} />
              <Row name="影响" value="近似" note="少数窗口跨缺口" width={940} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 420, width: 680 }}>
            <Card label="这些都不是 bug" accent={C.cyan} style={{ height: 430 }}>
              <Body size={FT.label}>
                它们是口径必须一起报的东西：样本数、容差、市场、样本量、缺口。账记在证据里，不在画面里藏。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 410, width: 1000 }}>
            <Card label="所以这一集仍算 ready" accent={C.cyan} style={{ height: 440 }}>
              <Row name="实现" value="三个模块" note="CRPS / PICP / VAE" width={940} />
              <Row name="证据" value="41 / 41" note="79 秒可重跑" width={940} />
              <Row name="账" value="五条边界" note="逐条写在上面" width={940} />
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>
                ready 说的是“这一集的内容可交付”，不是“整个项目没有缺口”。
              </Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1040, top: 410, width: 680 }}>
            <Card label="还欠着的两件事" accent={C.coral} style={{ height: 440 }}>
              <Row name="A7 算法卡" value="欠着" note="统一在 W 阶段补" color={C.coral} width={620} />
              <Row name="演示 CLI" value="欠着" note="现在只有证据子命令" color={C.coral} width={620} />
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>计划里写 pending，不写 done。</Mono>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
