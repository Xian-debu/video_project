import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Math as TeX } from "../../design/Math";
import { Head, Scene, PAD, Card, Body, Mono, K, Chip, beatAt } from "../shared";

/** 定义：TV 的 l1 与次梯度，DTW 的递推与三个约定。 */
export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 29);

  return (
    <Scene id="definitions">
      <Head kicker="02 / 总变差与动态时间规整" title="两个指标，两种账本" goal="TV 的 l1、DTW 的递推，以及三个约定" />

      <div style={{ position: "absolute", left: PAD, top: 288, width: 820 }}>
        <Build at={b(0)}>
          <Card label="TV · 总变差" accent={C.amber} pad={24} style={{ width: 820 }}>
            <TeX block size={FT.h2} color={C.amber} align="left" tex={"TV(x) = \\sum_{t=0}^{n-2} \\left| x_{t+1} - x_t \\right|"} />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>
              {"相邻差绝对值的和；常数序列为零，拐得越多越大。"}
            </Body>
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <TeX block size={FT.h2} color={C.cyan} align="left" tex={"L = \\mathrm{MSE} + \\lambda \\cdot TV"} />
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <Chip color={C.cyan}>{"λ 是权重"}</Chip>
              <Chip color={C.amber}>{"MSE 平方量纲"}</Chip>
              <Chip color={C.amber}>{"TV 一次量纲"}</Chip>
            </div>
            <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 10 }}>
              {"量纲不同，比较前先标准化；λ 不是学习率。"}
            </Body>
          </Card>
        </Build>

        <Build at={b(9)} style={{ marginTop: 20 }}>
          <Card label="TV 的次梯度 · 差为零时取零" accent={C.violet} pad={22} style={{ width: 820 }}>
            <TeX block size={FT.h3} color={C.violet} align="left" tex={"\\frac{\\partial TV}{\\partial x_i} = \\operatorname{sign}(x_i - x_{i-1}) - \\operatorname{sign}(x_{i+1} - x_i)"} />
            <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 8 }}>
              {"l1 在零点不可导；这里取一个次梯度，而不是求导。"}
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 970, top: 288, width: 770 }}>
        <Build at={b(4)}>
          <Card label="DTW · 动态时间规整" accent={C.cyan} pad={24} style={{ width: 770 }}>
            <TeX block size={FT.body} color={C.cyan} align="left" tex={"D(i,j) = |x_i - y_j| + \\min\\{D(i-1,j),\\; D(i,j-1),\\; D(i-1,j-1)\\}"} />
            <Body size={FT.meta} color={C.inkDim} style={{ marginTop: 12 }}>
              {"第一行与第一列直接累加；终点 D(n−1,m−1) 就是代价。前驱是上、左、左上。"}
            </Body>
            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>{"本集用未开方版本"}</Chip>
              <Chip color={C.inkDim}>{"零基下标"}</Chip>
            </div>
          </Card>
        </Build>

        <Build at={b(14)} style={{ marginTop: 20 }}>
          <Card label="三个约定 · 不写清楚数字就对不上" accent={C.amber} pad={22} style={{ width: 770 }}>
            {[
              ["01", "未开方", "开方版叫 rooted DTW，量纲不同"],
              ["02", "零基下标", "路径第一个点是 (0,0)，不是 (1,1)"],
              ["03", "按路径长度归一化", "长度不同的序列不能直接比代价"],
            ].map(([n, t, d]) => (
              <div key={n} style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: n === "01" ? 0 : 9 }}>
                <Mono size={FT.micro} color={C.cyan}>{n}</Mono>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.body, color: C.ink, minWidth: 170 }}>{t}</div>
                <Body size={FT.micro} color={C.inkFaint} style={{ flex: 1 }}>{d}</Body>
              </div>
            ))}
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 900, width: 1680, display: "flex", justifyContent: "space-between" }}>
        <Build at={b(18)}>
          <K>{"书里只给了名字；TV 的 l1 与 DTW 的递推都是标准定义，本集标为推断。"}</K>
        </Build>
        <Build at={b(20)}>
          <Mono size={FT.micro} color={C.inkFaint}>{"inferred · 不冒充原文"}</Mono>
        </Build>
      </div>
    </Scene>
  );
};