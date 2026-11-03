import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>只做<br />选择题。</Body>
          <Body style={{ marginTop: 26 }}>
            这一集不训练模型，不比预测精度，不跑下游任务。只回答：怎么选通道策略。输入是六列收益，输出是一个策略值，其余变量全部固定。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="输入" v="6 列" color={C.cyan} />
            <KV k="输出" v="策略" color={C.violet} />
            <KV k="训练" v="无" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="边界：只动策略" accent={C.amber}>
            <Row name="讲" value="三种策略" note="独立、混合、两两混合" width={1000} color={C.cyan} />
            <Row name="不讲" value="模型结构" note="不比较 transformer 与 MLP" width={1000} color={C.coral} />
            <Row name="不讲" value="训练目标" note="没有损失函数，也没有优化器" width={1000} color={C.coral} />
            <Row name="不讲" value="下游效果" note="不跑预测任务，不报精度" width={1000} color={C.coral} />
            <Row name="固定" value="其余变量" note="同一窗口、同一块长、同一维度" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>单变量</Chip>
            <Chip color={C.violet}>可比</Chip>
            <Chip color={C.amber}>20 分钟</Chip>
          </div>
        </div>
        <Foot>这样才能比较。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>数据也有限。</Body>
          <Body style={{ marginTop: 26 }}>
            六只股票，一只窗口，不能代表全市场。相关性随行情变：这段相关，下段可能不相关。滚动窗口可以重算，但这一集只算一次，结论只对这段数据。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="股票" v="6" color={C.cyan} />
            <KV k="窗口" v="512" color={C.violet} />
            <KV k="市场" v="不推广" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="数据边界：一段窗口，一次结论" accent={C.cyan}>
            <Row name="样本" value="6 × 512" note="六只 A 股，2024-09 → 2026-10" width={1000} color={C.cyan} />
            <Row name="代表性" value="有限" note="只覆盖六只股票，不代表全市场" width={1000} color={C.coral} />
            <Row name="时变性" value="会变" note="相关矩阵随行情漂移" width={1000} color={C.amber} />
            <Row name="滚动重算" value="可以" note="换窗口重跑同一条命令" width={1000} color={C.violet} />
            <Row name="本集" value="只算一次" note="结论只对这段数据成立" width={1000} color={C.coral} />
          </Card>
        </div>
        <Foot>这是数据边界。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>阈值，<br />也是边界。</Body>
          <Body style={{ marginTop: 26 }}>
            零点六、零点二、三，三个数都是我们定的。可以改成零点五五，也可以改成零点二五。换阈值，结论可能变，但流程不变：参数写进代码，也写进偏差表。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="混合" v="0.6" color={C.cyan} />
            <KV k="独立" v="0.2" color={C.amber} />
            <KV k="秩上限" v="3" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三个阈值都是选择，不是定理" accent={C.amber}>
            <Row name="混合阈值" value="0.60" note="平均绝对相关的下限" width={1000} color={C.cyan} />
            <Row name="独立阈值" value="0.20" note="低于它直接独立" width={1000} color={C.amber} />
            <Row name="秩上限" value="C / 2 = 3" note="有效秩不超过它才允许混合" width={1000} color={C.violet} />
            <Row name="换阈值" value="结论可变" note="0.55 / 0.25 都可能落到别的分支" width={1000} color={C.coral} />
            <Row name="流程" value="不变" note="改参数重跑，仍可复现" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>决策仍然可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四个<br />不能推。</Body>
          <Body style={{ marginTop: 26 }}>
            换模型也有效、换数据也有效、下游更好、这是最优策略——四条都不能推。这一集只证明三种切法都成立、判据可复现，没有比较模型，也没有比较精度。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="不能推" v="4 条" color={C.coral} />
            <KV k="模型对比" v="0" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="能说的与不能说的" accent={C.coral}>
            <Row name="不能推" value="换模型也有效" note="没有比较不同模型" width={1000} color={C.coral} />
            <Row name="不能推" value="换数据也有效" note="只有一只窗口" width={1000} color={C.coral} />
            <Row name="不能推" value="下游更好" note="没有跑预测任务" width={1000} color={C.coral} />
            <Row name="不能推" value="最优策略" note="只验证成立，不比较优劣" width={1000} color={C.coral} />
          </Card>
        </div>
        <Foot>能说的只有这些。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>边界之内，<br />结论成立。</Body>
          <Body style={{ marginTop: 26 }}>
            三种策略都跑通，决策规则可复现，token 数能手算，相关谱有结构。有效秩是近似，四舍五入会丢信息：二点四七取二，取三也说得通，选二是因为更省。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="能说" v="4 条" color={C.cyan} />
            <KV k="取二" v="更省" color={C.violet} />
            <KV k="下一集" v="进模型" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="能说的只有这些" accent={C.cyan}>
            <Row name="能说" value="三种策略都成立" note="独立、混合、两两混合都跑通" width={1000} color={C.cyan} />
            <Row name="能说" value="决策可复现" note="阈值写进代码与偏差表" width={1000} color={C.cyan} />
            <Row name="能说" value="token 可手算" note="96 / 16 / 32，全是乘法" width={1000} color={C.cyan} />
            <Row name="能说" value="谱有结构" note="top3 = 0.8726，能量集中" width={1000} color={C.cyan} />
            <Row name="近似" value="2.4714 → 2" note="取三也成立；选二更省位置" width={1000} color={C.amber} />
          </Card>
        </div>
        <Foot>写清楚，比藏起来好。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
