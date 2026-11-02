import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, K, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";
import { GridDots } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>人工选模型<br />有三步。</Body>
          <Body style={{ marginTop: 24 }}>
            想出一批候选，在验证集上打分，挑分数最好的那个。三步听着直白，但每一步都能出错：候选漏了、打分偏了、挑的时候看错了集合。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 296, width: 1060 }}>
          <Card label="三步里，每一步都在做选择" accent={C.cyan}>
            <Row name="一 · 空间" value="想出候选" note="漏掉的模型，后面永远选不到" width={1000} color={C.cyan} />
            <Row name="二 · 判据" value="验证集打分" note="用什么指标，就选什么冠军" width={1000} color={C.violet} />
            <Row name="三 · 策略" value="挑一个" note="穷举还是预筛，决定成本" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
            <Card label="本集的空间" accent={C.violet} style={{ width: 490 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.ink }}>{M.data.candidates} 个候选</div>
              <K>naive / drift / exp / ar / ridge / sarima / hmean</K>
            </Card>
            <Card label="本集的判据" accent={C.amber} style={{ width: 490 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.ink }}>{M.data.stocks} 只 × 3 段</div>
              <K>训练拟合 · 验证打分 · 测试定真值</K>
            </Card>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>两条路线，<br />这一集只走一条。</Body>
          <Body style={{ marginTop: 24 }}>
            一条是搜索：在参数空间里找更优的点。另一条是元学习：拿别的任务的经验来初始化。元学习要多套数据、多轮迁移，这一集没有那个条件，所以只做搜索。
          </Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>搜索</Chip>
            <Chip color={C.inkFaint}>元学习 · 不做</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 296, width: 1060 }}>
          <Card label="搜索的第一步：把空间写清楚" accent={C.cyan}>
            <Row name="哪些超参" value="7 项" note="SARIMA 的 p q d D m P Q" width={1000} color={C.cyan} />
            <Row name="取值范围" value="0–2" note="每一项都取三档，组合立刻爆炸" width={1000} color={C.violet} />
            <Row name="约束" value="季节项 + m" note="m 与 P、Q 必须同时在场" width={1000} color={C.amber} />
            <Row name="判据" value="验证集 MAE" note="不是测试集，测试集只用来定真值" width={1000} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>七个维度，<br />组合就爆炸。</Body>
          <Body style={{ marginTop: 24 }}>
            七项各取三档，是 3 的 7 次方。这一集按计划锁住 m、d、D 三个维度，剩下的 p、q、P、Q 自由组合，是 3 的 4 次方，81 种。全网格 648 种。
          </Body>
          <div style={{ marginTop: 22, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            3·3·2·2·3·3·2 = {M.grid.full} → 锁三维 = {M.grid.locked}
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label={"全网格 " + M.grid.full + " 个组合，锁后 " + M.grid.locked + " 个（亮色）"} accent={C.violet}>
            <GridDots cols={27} rows={24} cell={15} lit={M.grid.locked} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, width: 1030 }}>
            计划里写的是 648 → 54，但 54 和七维网格自相矛盾；实际按 81 报，八分之一。这一条写进了偏差记录。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>真值是<br />事后才有的。</Body>
          <Body style={{ marginTop: 24 }}>
            十个候选都在训练段拟合，然后对全序列做单步预测。验证段用来打分排序，测试段用来定真值。选模型就是：用验证段猜测试段会选谁。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 780, top: 296, width: 1060 }}>
          <Card label="一条纪律，贯穿全集" accent={C.coral}>
            <Row name="训练段" value="拟合参数" note={"到 " + M.data.cut.trainEnd + " 为止"} width={1000} color={C.cyan} />
            <Row name="验证段" value="排序打分" note={"到 " + M.data.cut.validEnd + " 为止"} width={1000} color={C.violet} />
            <Row name="测试段" value="只定真值" note={"快照 " + M.data.cut.snapshot} width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 22, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, width: 1030 }}>
            真值的定义：把十个候选在测试段上的 MAE 排一遍，最小的那个就是 t。命中率问的是：验证段挑出来的 â，在多少只股票上等于 t。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
