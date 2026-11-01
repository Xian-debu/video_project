import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, md, modelKeys, modelColor, modelShort, modelName, pagesOf, Pages, Scene, SceneHead,
  Card, Row, Body, Stat, Verdict, Chip, Bars, checksLike, groupOf, fmtInt, fmtP, fmtF, fmtE,
} from "../shared";

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  const groups = M.groups;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：先对口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              先对口径，再读数。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              一只票、日频、复权收盘。四个模型吃同一段窗口、同一套真值；阈值都在验证段挑，测试段一个点都不参与。
              单 AE 基线是一个对照组：同结构、同轮次，只去掉集成。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
              <Verdict ok label="训练 / 验证 / 测试 不重叠" />
              <Chip color={C.cyan}>种子写死，逐位可复现</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 282, width: 860 }}>
            <Card label="实验口径" accent={C.cyan} pad={26}>
              <Row name="标的" value={M.data.code} note={"两只白酒股取其一，日频 " + fmtInt(M.data.rows) + " 行"} />
              <Row name="训练 / 验证 / 测试" value={fmtInt(M.data.fit) + " / " + M.data.val + " / " + fmtInt(M.data.test)} note={"窗口 " + M.data.window + " 天，滑动一格"} />
              <Row name="窗口数" value={fmtInt(M.windows.fit) + " / " + M.windows.val + " / " + fmtInt(M.windows.test)} note="逐窗打分，不换算成天" />
              <Row name="阈值" value="验证段 F1 最优" note="四个模型同一条规则" />
              <Row name="真值窗" value={M.inject.truthPoints + " 个"} note={"占测试窗 " + M.inject.truthPct.toFixed(1) + "%"} color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：四个 F1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              四个读数，两个过零点二。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              USAD 和 DAGMM 落在零点二四附近，召回很高、精度很低；多 AE 只剩零点零六，单 AE 掉到零点二二。
              四个模型里没有一个过零点二五。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Bars
                width={840}
                rowH={70}
                items={modelKeys.map((k) => ({ label: modelShort[k], value: md(k).f1, text: md(k).f1.toFixed(4), color: modelColor[k] }))}
                unit="测试段 F1（阈值均来自验证段）"
              />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="精度 / 召回" accent={C.violet} pad={26}>
              {modelKeys.map((k) => (
                <Row key={k} name={modelName[k]} value={"P " + md(k).p.toFixed(3) + " · R " + md(k).r.toFixed(3)} note={"报警 " + (md(k).tp + md(k).fp) + " 个窗口"} color={modelColor[k]} />
              ))}
            </Card>
            <Card label="一句话读法" accent={C.amber} pad={22} style={{ marginTop: 18 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                高召回低精度 = 阈值挑得太松，几乎每个真值窗都报了，但也把大片干净窗一起报了。这不是「发现了异常」，是「不敢漏」。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：TP / FP / FN */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              逐窗数：命中的和误报的。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              真值窗一百六十八个。USAD 命中一百六十五、漏三个，但误报一千零四十三个；DAGMM 命中一百五十五、漏十三个。
              多 AE 几乎不报警：八次命中、九十八次误报，漏掉一百六十个。单 AE 在中间。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Row name="USAD" value={"TP " + md("usad").tp + " · FP " + fmtInt(md("usad").fp) + " · FN " + md("usad").fn} note="召回 0.982，精度 0.137" color={C.cyan} />
              <Row name="DAGMM" value={"TP " + md("dagmm").tp + " · FP " + fmtInt(md("dagmm").fp) + " · FN " + md("dagmm").fn} note="召回 0.923，精度 0.138" color={C.violet} />
              <Row name="多 AE" value={"TP " + md("ens").tp + " · FP " + md("ens").fp + " · FN " + md("ens").fn} note="召回 0.048，精度 0.075" color={C.amber} />
              <Row name="单 AE" value={"TP " + md("ae").tp + " · FP " + fmtInt(md("ae").fp) + " · FN " + md("ae").fn} note="召回 0.488，精度 0.144" color={C.inkDim} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="训练集上的稳定性" accent={C.cyan} pad={26}>
              <Row name="USAD 末轮 L1" value={fmtInt(M.usad.l1Last)} note={"暖启动末值 " + fmtInt(M.usad.l1[19]) + "，对抗后被抬高"} color={C.coral} />
              <Row name="DAGMM 条件数" value={fmtE(M.dagmm.cond0) + " → " + fmtE(M.dagmm.cond2)} note="λ2 加大，协方差条件数下降两个数量级" />
              <Row name="集成成员数" value={M.ens.members + " 个"} note={"每个 " + fmtInt(M.ens.params) + " 参数，共五个"} />
            </Card>
            <Card label="训练段 / 验证段 F1" accent={C.amber} pad={22} style={{ marginTop: 18 }}>
              <Row name="验证段最高" value={Math.max(...modelKeys.map((k) => md(k).f1Val)).toFixed(4)} note="单 AE" />
              <Row name="测试段最高" value={Math.max(...modelKeys.map((k) => md(k).f1)).toFixed(4)} note="DAGMM" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：阈值与三类窗口 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              阈值搬家，量纲各不同。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              四个分数不是同一把尺：USAD 是重建误差的加权和，阈值一百一十一；DAGMM 是负对数似然，阈值负七点四八；
              多 AE 是归一化重建误差，阈值零点八七。绝对值没有可比性，只有「过没过线」可比。
            </Body>
            <div style={{ marginTop: 26 }}>
              {modelKeys.map((k) => (
                <Row key={k} name={modelShort[k]} value={"τ = " + fmtF(md(k).tau, 3)} note={"验证段 F1 最优时取到"} color={modelColor[k]} />
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="三类窗口的中位分数" accent={C.violet} pad={24}>
              <Row name="USAD" value={M.kind.usad.spike.toFixed(1) + " · " + M.kind.usad.drift.toFixed(1) + " · " + M.kind.usad.clean.toFixed(1)} note="三类几乎一样" />
              <Row name="DAGMM" value={M.kind.dagmm.spike.toFixed(2) + " · " + M.kind.dagmm.drift.toFixed(2) + " · " + M.kind.dagmm.clean.toFixed(2)} note="差不到零点一" />
              <Row name="多 AE" value={M.kind.ens.spike.toFixed(3) + " · " + M.kind.ens.drift.toFixed(3) + " · " + M.kind.ens.clean.toFixed(3)} note="测试段整体偏高" />
            </Card>
            <Card label="为什么分不开" accent={C.coral} pad={22} style={{ marginTop: 18 }}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.8 }}>
                注入改变了少数窗口，但窗口之间重叠九十九天，异常被稀释到相邻窗口；三个模型的分数都对「整段风格」敏感，对「单日扰动」不敏感。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：57 项检查 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              五十七项，一次跑完。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              数据六项、窗口五项、USAD 九项、AE 三项、DAGMM 十项、集成六项、注入六项、读数八项、盲区四项。
              全部纯函数，没有随机数，同一份数据同一份种子，读数逐位复现。
            </Body>
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: 860 }}>
              {groups.map((g) => (
                <div key={g.g} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Chip color={C.cyan}>{g.g}</Chip>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: g.pass === g.total ? C.cyan : C.coral }}>
                    {g.pass + " / " + g.total}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 26, display: "flex", gap: 16 }}>
              <Stat label="运行时间" value={M.meta.evidence.seconds.toFixed(1) + " 秒"} sub="一次跑完，无随机" style={{ width: 280 }} />
              <Stat label="模块测试" value={fmtInt(M.meta.tests.suites) + " 套 / " + fmtInt(M.meta.tests.assertions)} sub="仓库合计" accent={C.violet} style={{ width: 320 }} />
              <Stat label="本集新增" value={M.meta.newCases + " 条"} sub="三个模块，二十六个案例" accent={C.amber} style={{ width: 280 }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="全绿不是结论" accent={C.coral} pad={26}>
              <Body style={{ fontSize: FT.meta, lineHeight: 1.9 }}>
                一张全绿的检查表，如果检查本身写松了，也是全绿。所以每集至少留三条「必须失败」的负向断言。
              </Body>
            </Card>
            <Card label="三条负向断言" accent={C.amber} pad={26} style={{ marginTop: 18 }}>
              <Row name="F1 不许满分" value="四个都 < 1" note="两个 0.24 是真的没做好" color={C.coral} />
              <Row name="集成必须掉" value="0.28 → 0.06" note="验证到测试掉 0.2 以上，记录迁移失败" color={C.coral} />
              <Row name="对抗必须抬 L1" value={fmtInt(M.usad.l1Last) + " > 2 × " + fmtInt(M.usad.l1[19])} note="曲线翘起来才是对抗训练" color={C.amber} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：可复现性 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>
              同一份数据，逐位复现。
            </div>
            <Body style={{ marginTop: 22, width: 860 }}>
              模型里没有随机数：初始化用线性同余序列，训练顺序按窗口下标。种子只出现在注入那一侧，决定第几天被改。
              换一台机器、换一个 GHC，读数应该一样；不一样的只有浮点末位。
            </Body>
            <div style={{ marginTop: 26 }}>
              <Row name="数据集" value={fmtInt(M.data.rows) + " 行 · 缺省最多 " + M.data.maxGapDays + " 天"} note="复权收盘转对数收益，停牌行去掉" />
              <Row name="注入种子" value={"尖峰 " + M.inject.seedSpike + " · 漂移 " + M.inject.seedDrift} note={"验证段 " + M.inject.valSeedSpike + " / " + M.inject.valSeedDrift} />
              <Row name="模型种子" value="固定序列" note="USAD 4001 · DAGMM 5001 · 集成 7001" />
              <Row name="证据文件" value="ch4-adversarial.json" note="检查明细、读数、曲线全部落盘" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 282, width: 850 }}>
            <Card label="读数的三个来源" accent={C.cyan} pad={26}>
              <Row name="证据 JSON" value={fmtInt(M.meta.evidence.checks) + " 项检查"} note="每项带组名和通过标记" />
              <Row name="包内数据" value="dual.json" note="曲线、分数、真值索引，全部来自证据" />
              <Row name="提交" value={"ts-base " + M.meta.commits.tsBase} note={"数据侧 " + M.meta.commits.tsAdmin} />
            </Card>
            <div style={{ marginTop: 18 }}>
              <Verdict ok label="检查 57 / 57 通过，用时 142.9 秒" />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
