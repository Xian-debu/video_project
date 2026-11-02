import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, md, alertsOf, modelColor, pagesOf, Pages, Scene, SceneHead, ModelKey, Card, Row, Body, Bars, Verdict, Chip, Stat, fmtInt } from "../shared";

export const SVerification: React.FC = () => {
  const at = pagesOf("verification");
  const pairs: Array<[ModelKey, ModelKey]> = [["tvae", "gauss"], ["dcd", "patchAe"], ["sbt", "attn"]];
  const groups = M.groups;
  return (
    <Scene id="verification">
      <SceneHead id="verification" />
      <Pages id="verification" at={at}>
        {/* 页一：协议 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>先对口径，再读数。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              六个模型吃同一段窗口、同一套真值、同一份注入。阈值只在验证段挑，测试段一个点都不参与。基线同结构、同轮次，只换掉那一个假设。
            </Body>
            <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
              <Chip color={C.cyan}>同数据 · 同注入</Chip>
              <Chip color={C.violet}>阈值只从验证段来</Chip>
              <Chip color={C.amber}>种子写死</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1050, top: 290, width: 810 }}>
            <Card label="实验口径" accent={C.cyan} pad={20}>
              <Row name="标的" value="sh600519" note="日线，3,996 行" />
              <Row name="训练 / 验证 / 测试" value={fmtInt(M.windows.fit) + " / " + fmtInt(M.windows.val) + " / " + fmtInt(M.windows.test)} note="窗口 100 天，滑动一格" />
              <Row name="真值窗" value={fmtInt(M.inject.truth) + " 个"} note={"占测试 " + (M.inject.truthShare * 100).toFixed(1) + "%"} color={C.coral} />
              <Row name="阈值" value="验证段 F1 最优" note="六个模型同一条规则" />
              <Row name="分钟线" value={fmtInt(M.data.minuteRows) + " 根"} note="独立演示，不进主读数" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：三对 F1 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink }}>三个方法，一对一个基线。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 26 }}>
              {pairs.map(([k, b]) => {
                const v = md(k);
                const w = md(b);
                return (
                  <Card key={k} label={v.name + " 对 " + w.name} accent={modelColor[k]} pad={18}>
                    <Bars
                      width={470}
                      rowH={56}
                      items={[
                        { label: v.name, value: v.f1, text: v.f1.toFixed(4), color: modelColor[k] },
                        { label: w.name, value: w.f1, text: w.f1.toFixed(4), color: C.inkDim, dim: true },
                      ]}
                      max={0.4}
                    />
                    <Row name="测试 F1" value={v.f1.toFixed(4) + " 对 " + w.f1.toFixed(4)} color={modelColor[k]} />
                    <Row name="验证段" value={v.f1Val.toFixed(4) + " 对 " + w.f1Val.toFixed(4)} />
                  </Card>
                );
              })}
            </div>
            <div style={{ marginTop: 22 }}>
              <Row name="结论" value="两个赢 · 一个打平" note="TVAE 提升六成，DCdetector 提升一倍多，SBT 差千分之二" color={C.cyan} />
              <Row name="但看验证段" value="赢的两个没有领先" note="TVAE 0.3096 对 0.3101，DCdetector 0.2844 对 0.3516" color={C.coral} />
              <Row name="增益全部出现在测试段" value="这就是这一集的发现" note="不是方法变强了，是基线搬不过去" color={C.coral} />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：精确率召回率 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>精确率和召回率，同时看。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              每个模型都是「召回高、精确率低」：阈值偏向多报。差别在召回能到多高。DCdetector 召回满分，代价是几乎每个干净窗都报；patch-AE 精确率一样低，召回却少了一大截。
            </Body>
            <div style={{ marginTop: 24 }}>
              {(["tvae", "gauss", "dcd", "patchAe", "sbt", "attn"] as ModelKey[]).map((k) => {
                const v = md(k);
                return (
                  <Row key={k} name={v.name} value={"P " + v.p.toFixed(3) + " · R " + v.r.toFixed(3)} note={"报警 " + fmtInt(alertsOf(k)) + " 窗"} color={modelColor[k]} />
                );
              })}
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 296, width: 830 }}>
            <Card label="为什么都低" accent={C.coral} pad={22}>
              <Body>
                真值窗只占测试的百分之十三点七，而且只标窗口末尾。一个形态段铺二十个点，前十九个窗口不算真值，模型提前一两格报就算误报。窗口层的真值天生稀疏。
              </Body>
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="这不是调参能修的" accent={C.amber} pad={22}>
                <Body>
                  阈值只挑一个。想提精确率就得放弃召回，想保召回就得接受误报。书里不写这个取舍，因为书里不报测试读数。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：阈值与分类型 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>阈值不同，量纲也不同。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              六个分数不是同一把尺：SBT 和两个基线是重建误差，TVAE 是负对数似然，DCdetector 是对比损失。绝对值没有可比性，只有「过没过线」可比。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Row name="SBT" value={md("sbt").tau.toFixed(6)} note="验证段 F1 最优时取到" color={C.cyan} />
              <Row name="TVAE" value={md("tvae").tau.toFixed(6)} note="验证段 F1 最优时取到" color={C.violet} />
              <Row name="DCdetector" value={md("dcd").tau.toFixed(6)} note="验证段 F1 最优时取到" color={C.amber} />
              <Row name="两个基线" value="0.7210 · 4.5375" note="稠密注意力、高斯 VAE；patch-AE 0.1904" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 296, width: 830 }}>
            <Card label="按注入类型看" accent={C.cyan} pad={20}>
              <Row name="尖峰" value="8 段" note="单点，模型最容易看出" />
              <Row name="形态替换" value="4 段 × 20" note="整段换掉，三种方法分最高" />
              <Row name="相位翻转" value="4 段 × 20" note="半周期错位，最接近干净窗" color={C.coral} />
              <Body style={{ marginTop: 10, fontSize: FT.meta, color: C.inkDim }}>
                原因：窗口层真值被稀释。一段二十个点的注入，只有末尾一个窗口算真值，相邻窗口的分数被拉高却不算命中。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：检查表 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 284, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>六十四项，一次跑完。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              数据九项、窗口六项、SBT 八项、TVAE 八项、DCdetector 八项、基线三项、注入六项、读数十一项、盲区四项、分钟线四项。全部纯函数，同一份数据同一种子，读数逐位复现。
            </Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 22 }}>
              {groups.map((g) => (
                <div key={g.g} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Chip color={C.cyan}>{g.g}</Chip>
                  <span style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink }}>{g.pass} / {g.total}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 26 }}>
              <Stat label="运行时间" value={M.meta.evidence.seconds.toFixed(1) + " 秒"} sub="一次跑完，无随机" valueColor={C.cyan} />
              <Stat label="模块测试" value={"127 套 / " + fmtInt(M.meta.tests.assertions)} sub="仓库合计" />
              <Stat label="本集新增" value={M.meta.newCases + " 条"} sub="三个模块，55 个案例" valueColor={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 290, width: 830 }}>
            <Card label="三条负向断言" accent={C.coral} pad={20}>
              <Row name="没有满分 F1" value="六个都 < 1" note="0.24 是真的没做好" color={C.coral} />
              <Row name="SBT 打平不算赢" value="|差| < 0.01" note="赢的定义先写死，再读数" />
              <Row name="分钟线的形态替换没有抬高损失" value="负结果照记" note="注入行均值 1.62 低于干净行 3.30" />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="为什么还要报" accent={C.amber} pad={20}>
                <Body style={{ fontSize: FT.meta }}>
                  两个赢、一个打平，但赢的两个验证段都没领先。这种结果比一个漂亮的零点八更有信息量：它指出的不是方法不行，是「验证段挑阈值」这条协议在换分布时会失效。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页六：复现 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 42, color: C.ink }}>同一份数据，逐位复现。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              推断里没有随机数：TVAE 的八次采样由窗口下标定，掩码在训练前一次采好，模型的初始化用固定序列。换一台机器、换一个 GHC，读数应该一样；不一样的只有浮点末位。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Row name="数据集" value={fmtInt(M.data.dailyRows) + " 行 · 缺省最多 " + M.data.maxGapDays + " 天"} note="复权收盘对 log 收益，停牌行去掉" />
              <Row name="种子" value="42 · 4242 · 4243" note="验证段 43 · 4243 · 4344" />
              <Row name="模型种子" value="固定序列" note="SBT 4401 / TVAE 3621 / DCD 4401" />
              <Row name="证据文件" value="ch4-sparse-prior.json" note="检查明细、读数、曲线全部落盘" color={C.cyan} />
            </div>
            <div style={{ marginTop: 26 }}>
              <Verdict ok label={M.meta.evidence.passed + " / " + M.meta.evidence.checks + " 通过，用时 " + M.meta.evidence.seconds.toFixed(1) + " 秒"} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 296, width: 830 }}>
            <Card label="读数的三个来源" accent={C.violet} pad={20}>
              <Row name="证据 JSON" value={M.meta.evidence.checks + " 项检查"} note="每项带组名和通过标记" />
              <Row name="包内数据" value="sparse.json" note="曲线、分数、真值索引，全部来自证据" />
              <Row name="提交" value={"ts-base " + M.meta.commits.tsBase} note={"数据侧 " + M.meta.commits.tsAdmin} />
            </Card>
            <div style={{ marginTop: 16 }}>
              <Card label="全绿不等于结论" accent={C.amber} pad={20}>
                <Body style={{ fontSize: FT.meta }}>
                  一张全绿的检查表，如果检查本身写松了，也是全绿。六十四项里至少三条是「必须失败」的负向断言，钉住的正是这种可能。
                </Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
