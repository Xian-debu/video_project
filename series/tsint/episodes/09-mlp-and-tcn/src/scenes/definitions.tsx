import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, PAD, Pages, Row, Scene, SceneHead, lf } from "../shared";

/* 符号：式 (2.46)(2.47)(2.62)(2.63) 与参数量、感受野。 */

export const SDefinitions: React.FC = () => {
  const m = M;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.24, 0.48, 0.72]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            把符号钉死：W、b、z、h，一层一层往上写。
          </div>
          <Build at={lf("definitions", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1100 }}>
              <Card label="书里的两行 · p.30" accent={C.cyan} style={{ height: 366 }}>
                <Formula size={58} note="式 (2.46)：线性部分；W 行是输出维，列是输入维">{"z^(l) = W^(l) · h^(l−1) + b^(l)"}</Formula>
                <Formula size={58} note="式 (2.47)：激活之后的输出" style={{ marginTop: 22 }}>{"h^(l) = φ(z^(l))"}</Formula>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.12)}>
            <div style={{ position: "absolute", left: PAD + 1124, top: 306, width: 652 }}>
              <Card label="我们的选择" accent={C.violet} style={{ height: 366 }}>
                <Row name="隐层激活 φ" value="tanh" note="输出落在 −1 到 1" width={606} />
                <Row name="输出层" value="线性" note="不套激活，范围不受限" width={606} />
                <Row name="损失" value="MSE" note="不除 2，也不除批大小" width={606} />
                <K style={{ display: "block", marginTop: 12 }}>两个常数只影响学习率，不影响最优点</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.18)}>
            <div style={{ position: "absolute", left: PAD, top: 706, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              结构是 {m.mlp.dims.join(" → ")}：输入一个窗口，输出下一期收益率。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            书里没有训练配方，这一屏全是我们的选择，写进自查表。
          </div>
          <Build at={lf("definitions", 0.27)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1776 }}>
              <Card label="训练配置 · 非书（A21）" accent={C.amber} style={{ height: 470 }}>
                <Row name="初始化" value="Xavier" note="标准差 = √(2 / (fan_in + fan_out))" width={1728} />
                <Row name="优化器" value="Adam" note="学习率 1e-3，β = (0.9, 0.999)，ε = 1e-8" width={1728} />
                <Row name="批大小" value="64" note="每轮先打乱，再切批" width={1728} />
                <Row name="早停" value="patience 5" note="连续 5 轮验证损失不降就停" width={1728} />
                <Row name="验证集" value="训练集尾部" note="不打乱，不泄漏" width={1728} />
                <Row name="随机数" value="splitmix64" note="同种子跨机器逐位相同" width={1728} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            卷积：核长 K，翻转，再从左往右；膨胀版本下标里多乘一个 d。
          </div>
          <Build at={lf("definitions", 0.51)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1080 }}>
              <Card label="式 (2.62) · 一维因果卷积" accent={C.cyan} style={{ height: 340 }}>
                <Formula size={54} note="K 是核长；下标 t − K + k 是翻转">{"(f ∗ x)(t) = Σ k=1..K  f_k · x_{t−K+k}"}</Formula>
                <Formula size={54} note="式 (2.63)：膨胀版本，相邻权重隔 d 步" style={{ marginTop: 22 }}>{"(f ∗_d x)(t) = Σ k=1..K  f_k · x_{t−(K−k)d}"}</Formula>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.58)}>
            <div style={{ position: "absolute", left: PAD + 1104, top: 306, width: 672 }}>
              <Card label="膨胀做了什么" accent={C.violet} style={{ height: 340 }}>
                <Body size={FT.body}>第 k 个权重，看的是第 t − (K−k)·d 步。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>相邻权重之间隔 d 步。</Body>
                <Chip color={C.violet}>不增参数，只增视野</Chip>
                <K style={{ display: "block", marginTop: 18 }}>dils = [{m.tcn.layers.dils.join(", ")}]，K = {m.tcn.layers.k}</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            两个参数量，一条感受野公式，各有一条断言钉住。
          </div>
          <Build at={lf("definitions", 0.75)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <Card label="参数量怎么算" accent={C.cyan} style={{ height: 420 }}>
                <Formula size={46} note="全连接：输入维 × 输出维 + 输出维">MLP：60·32+32 + 32·1+1 = 1985</Formula>
                <Formula size={46} note="卷积：K × C_in × C_out + C_out，每层 784" style={{ marginTop: 20 }}>TCN：48+16 + 768+16 + 768+16 + 16·1+1 = 1649</Formula>
                <Body size={FT.meta} style={{ marginTop: 18 }}>卷积层里 1→16 首层与 16→16 两层各 784；残差只改连接，不加参数。</Body>
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <Chip color={C.cyan}>{m.mlp.params.toLocaleString("en-US")}</Chip>
                  <Chip color={C.violet}>{m.tcn.params.toLocaleString("en-US")}</Chip>
                  <K>写成断言：参数个数是构造出来的常量</K>
                </div>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.83)}>
            <div style={{ position: "absolute", left: PAD + 1144, top: 306, width: 632 }}>
              <Card label="感受野" accent={C.amber} style={{ height: 420 }}>
                <Formula size={44} color={C.amber}>{"RF = 1 + (K−1)·Σd"}</Formula>
                <Body size={FT.meta} style={{ marginTop: 14 }}>K = 3，Σd = 7，所以 1 + 14 = 15。</Body>
                <K style={{ display: "block", marginTop: 18 }}>{m.hand.rfCalc}</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.88)}>
            <div style={{ position: "absolute", left: PAD, top: 762, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              W、b、φ、K、d，后面反复用；现在可以看实现了。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
