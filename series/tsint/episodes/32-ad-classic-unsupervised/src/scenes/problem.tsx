import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, fmtInt, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Chip, KV } from "../shared";

export const SProblem: React.FC = () => {
  const at = [0, pageAt("problem", 14), pageAt("problem", 26)];
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：没有标签，异常是什么 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: CW }}>
            <Body size={FT.body} style={{ width: 1080, marginBottom: 24 }}>
              有标签的时候，异常检测就是分类：学一个边界。现在标签没了，第一步不是选模型，是先把"异常"定义出来。
            </Body>
            <div style={{ display: "flex", gap: 30 }}>
              <Card label="定义一 / 离群" accent={C.cyan} style={{ width: 540 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>远的就是异常</div>
                <Body size={FT.body} style={{ marginTop: 12 }}>大多数点聚在一起，离群点是距离最远的那些。K 均值用这个定义。</Body>
              </Card>
              <Card label="定义二 / 密度低" accent={C.amber} style={{ width: 540 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>邻居少的就是异常</div>
                <Body size={FT.body} style={{ marginTop: 12 }}>一个点周围的邻居密度明显低于邻居自己的密度，它就像异常。LOF 用这个定义。</Body>
              </Card>
              <Card label="定义三 / 容易被孤立" accent={C.violet} style={{ width: 540 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>切几刀就出来的是异常</div>
                <Body size={FT.body} style={{ marginTop: 12 }}>随机切分时，少数点很快被单独切开，多数点要切很多次。孤立森林用这个定义。</Body>
              </Card>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
              <Chip color={C.cyan}>距离</Chip>
              <Chip color={C.amber}>密度</Chip>
              <Chip color={C.violet}>随机分割</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1010 }}>
            <Card label="比较口径 · 先把规则写死" accent={C.cyan}>
              <Row name="样本" value="一只股票 24 天收益" note="24 维向量，不是整窗 192 维" width={960} />
              <Row name="规模" value={fmtInt(M.samples.total) + " 个"} note={"训练 " + fmtInt(M.samples.train) + " · 测试 " + fmtInt(M.samples.test)} width={960} />
              <Row name="标准化" value="训练段均值 / 标准差" note="每一维单独，测试段只套用" width={960} />
              <Row name="注入位置" value="只落测试段" note="训练段保持干净，阈值才能定" width={960} />
              <Row name="操作点" value={"测试分数 " + M.params.q * 100 + "% 分位"} note="不看标签，每个方法同一规则" width={960} />
              <Row name="真值" value={M.inject.spike + " + " + M.inject.swap + " 个"} note={"各 " + M.inject.perStock + " 个 / 只，逐点已知"} width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="两种注入，两种形状" accent={C.amber}>
              <KV k="尖峰" v="1–3 天，5–10σ" note="一只股票的连续日加脉冲，符号随机" />
              <KV k="形态替换" v="24 天整段" note="换成另一只股票同一段日期的收益轨迹" />
              <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
                两种注入的总幅度接近，形状完全不同：一个尖，一个换。
              </Body>
            </Card>
            <Card label="为什么拆成 24 维" accent={C.coral} style={{ marginTop: 18 }}>
              <Body size={FT.body} color={C.ink}>
                整窗 192 维时，一只股票的尖峰只动两个坐标，距离被高维稀释。计划书里 192 维的偏差写进了证据文件。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：F1 的口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
            <Card label="这份 F1 是什么" accent={C.violet}>
              <Row name="分数" value="三种分数，三种单位" note="距离、比值、0–1" width={950} />
              <Row name="统一" value="同一个操作点" note="都取测试分数 99% 分位" width={950} />
              <Row name="标签" value="注入题" note="真实市场没有逐点标注" width={950} />
              <Row name="结论边界" value="只回答谁更接近异常方向" note="不回答能不能赚钱" width={950} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 20 }}>
              所以这一集比的不是模型容量 —— 三个检测器都没有参数可学，最多一个 K、一个邻居数。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="第一个问题" accent={C.cyan}>
              <Body size={FT.body} color={C.ink}>分数怎么造。</Body>
              <Body size={FT.body} color={C.inkDim} style={{ marginTop: 10 }}>三种几何各给一个分数，公式都很短。</Body>
            </Card>
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
              <Chip color={C.cyan}>不用真值</Chip>
              <Chip color={C.amber}>同一操作点</Chip>
              <Chip color={C.violet}>注入对答案</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
