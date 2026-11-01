import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict, Chip, Heat, PairBar } from "../shared";

export const SVerification: React.FC = () => {
  const at = [0, pageAt("verification", 7), pageAt("verification", 14), pageAt("verification", 21), pageAt("verification", 28)];
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 980 }}>
            <Card label="四十四项，按来源分组" accent={C.cyan} style={{ height: 460 }}>
              <Row name="数据 data" value="7 项" note="行长、首末日期、缺口、字节数、sha" width={920} />
              <Row name="混合 mix" value="9 项" note="参数量、恒等、线性、置换、残差" width={920} />
              <Row name="变量注意力 itrans" value="9 项" note="参数、注意力、打乱、尺度" width={920} />
              <Row name="图 graph" value="8 项" note="自环、归一化、分量、纯度、ARI" width={920} />
              <Row name="真实读数 real" value="11 项" note="相关、注意力、稳定性、能量占比" width={920} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1020, top: 380, width: 720 }}>
            <Stat label="总检查" value="44 / 44" sub="零失败，耗时 0.30 s" accent={C.cyan} style={{ height: 200 }} />
            <Stat label="测试" value="85 / 1,133" sub="套件 / 断言，零失败" accent={C.amber} style={{ height: 200, marginTop: 24 }} />
            <Stat label="新增套件" value="11 / 11 / 14" sub="混合 · 注意力 · 图" accent={C.violet} style={{ height: 200, marginTop: 24 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1100 }}>
            <Card label="数据先说话：两块面板的指纹" accent={C.cyan} style={{ height: 420 }}>
              <Row name="面板 A" value="2,657 行 · 8 列" note="2015-01-05 → 2025-12-31，271,718 字节" width={1040} />
              <Row name="A 的 sha256" value="d0529c0e…" note="前八位，整串存在 summary.json 里" width={1040} />
              <Row name="A 的最大缺口" value="17 个交易日" note="2018-02-05 附近，春节叠加熔断" width={1040} />
              <Row name="面板 B" value="240 行 · 20 列" note="2025-01-07 → 2025-12-31，56,898 字节" width={1040} />
              <Row name="B 的最大缺口" value="9 个交易日" note="2025-02-05 附近，缺的一天被窗口跳过" width={1040} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1140, top: 380, width: 600 }}>
            <Verdict ok label="数据检查 7 / 7" />
            <Body size={FT.label} style={{ marginTop: 24 }}>
              数据检查不是形式主义：行数、首末日期、最大缺口、字节数、sha 任何一项变了，后面所有数字都不可信。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 370 }}>
            <Card label="八通道图 · 邻接矩阵" accent={C.violet} style={{ padding: 24 }}>
              <Heat matrix={M.real.corr8} labels={M.real.names8} groups={M.real.groups8} cell={44} labelW={110} min={-0.2} max={1} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 600, top: 370, width: CW - 600 }}>
            <Card label="图的三项事实" accent={C.violet} style={{ height: 430 }}>
              <Row name="连通分量" value="3 个" note="与行业分组一致：两块对角 + 一座桥" width={1000} />
              <Row name="k = 2 的邻接" value="32 条有向边上界" note="实际 29 条，去重后更少" width={1000} />
              <Row name="纯度" value="0.8621" note="同一分量内的行业一致性" width={1000} />
              <Row name="ARI" value="0.5191" note="与行业标签的调整兰德指数" width={1000} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: 1060 }}>
            <Card label="二十只票：三块不是四块" accent={C.amber} style={{ height: 300 }}>
              <Row name="连通分量" value="3" note="白酒、银行各一块，券商与地产通过指数连成第三块" width={1000} />
              <Row name="边数" value="29" note="二十个节点，k = 2，稀疏度 14.5%" width={1000} />
              <Row name="纯度 / ARI" value="0.8621 / 0.5191" note="图结构与行业标签高度一致" width={1000} />
            </Card>
            <Card label="k 的敏感性：这是弱点" accent={C.coral} style={{ height: 300, marginTop: 24 }}>
              <PairBar
                a={{ label: "k = 2", value: M.graph.ari, text: "0.519" }}
                b={{ label: "k = 3", value: M.graph.k3ari, text: "0.296" }}
                width={900} max={0.6} colorA={C.cyan} colorB={C.inkFaint}
              />
              <Body size={FT.label} style={{ marginTop: 18 }}>
                k 从 2 加到 3，ARI 掉到 0.296。这个 k 是看到结果之后选的——诚实地说，这是弱点。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD + 1100, top: 380, width: 640 }}>
            <Stat label="纯度" value="0.8621" sub="分量对行业的解释力" accent={C.amber} style={{ height: 250 }} />
            <Stat label="ARI（k = 3）" value="0.296" sub="多挑一个邻居，结构就散" accent={C.coral} style={{ height: 250, marginTop: 24 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 390, width: CW }}>
            <Card label="五条关键读数的对照表" accent={C.cyan} style={{ height: 480 }}>
              <Row name="混合参数" value="144 = 2NH + H + N" note="与手算一致，容差 0" width={1660} />
              <Row name="置换等变" value="diff = 0" note="换通道顺序后输出同步换，逐元素为 0" width={1660} />
              <Row name="手写注意力" value="1e-13" note="与展开的矩阵乘相比，浮点误差量级" width={1660} />
              <Row name="两节点金例" value="1.000000" note="归一化后 0.5 / 0.5，输出精确为 1" width={1660} />
              <Row name="真实面板" value="44 / 44" note="全部读完真实数据，不依赖模拟量" width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 900, width: CW, display: "flex", gap: 16 }}>
            <Chip color={C.cyan}>每一行都能复算</Chip>
            <Chip color={C.amber}>容差写死在报告里</Chip>
            <Verdict ok label="四十四项 · 零失败" />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
