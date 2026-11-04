import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt2, fmt4, fmtInt, pagesOf } from "../shared";
import { ParamBudget } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>只训练<br />一小块。</Body>
          <Body style={{ marginTop: 26 }}>
            不问怎么表示，问怎么适配。冻结主干，只训练很小的一块——小到什么程度？
            三个数字先摆出来。
          </Body>
          <div style={{ display: "flex", marginTop: 30 }}>
            <KV k="线性探测" v={fmtInt(M.probe.params)} color={C.cyan} />
            <KV k="低秩旁路" v={String(M.lora.params)} color={C.violet} />
            <KV k="语义锚点" v="0" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1030 }}>
          <Card label="参数账 · 三个适配器与冻结主干" accent={C.cyan} style={{ width: 1010 }} pad={22}>
            <ParamBudget width={940} rowH={100} />
          </Card>
        </div>
        <Foot>上一集画成图，这一集换问法。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一千三、<br />五百一、零。</Body>
          <Body style={{ marginTop: 26 }}>
            三个数都能一眼算出来，不是估的。主干 70,209 个参数：线性头是它的百分之一点八五，
            旁路百分之零点七三，锚点是零。
          </Body>
          <div style={{ display: "flex", marginTop: 30 }}>
            <KV k="主干" v={fmtInt(M.frozen.total)} color={C.inkDim} />
            <KV k="模块" v={M.code.totalLines + " 行"} color={C.inkDim} />
            <KV k="单元测试" v={M.code.tests + " 条"} color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三个适配器 · 与主干比" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <Row name="线性探测" value={fmtInt(M.probe.params)} note={"65 × 20 · 占主干 " + M.probe.share.toFixed(2) + "%"} width={962} color={C.cyan} valueW={300} />
            <Row name="低秩旁路" value={String(M.lora.params)} note={"2 × 4 × 64 · 占主干 " + M.lora.share.toFixed(2) + "%"} width={962} color={C.violet} valueW={300} />
            <Row name="语义锚点" value="0" note="不学权重，只从词表选八个词拼前缀" width={962} color={C.amber} valueW={300} />
            <Row name="主干（冻结）" value={fmtInt(M.frozen.total)} note={"编码器 " + fmtInt(M.frozen.encParams) + " + 投影 " + fmtInt(M.frozen.pParams)} width={962} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.violet}>这些数能一眼算出来，不是估的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>但便宜<br />不等于有用。</Body>
          <Body style={{ marginTop: 26 }}>
            三个适配器，一个都没赢。线性头的相对误差 {" " + fmt4(M.probe.relMae)}，比「预测均值」差百分之五点四；
            旁路只把损失挪了百分之零点零三；锚点准确率 {fmt2(M.anchor.anchorAcc)}，同一任务上线性头是 {fmt2(M.anchor.probeSynthAcc)}。
          </Body>
          <div style={{ display: "flex", marginTop: 30 }}>
            <KV k="相对误差" v={fmt4(M.probe.relMae)} color={C.coral} />
            <KV k="损失变化" v={M.lora.dropPct + "%"} color={C.coral} />
            <KV k="锚点准确率" v={fmt2(M.anchor.anchorAcc)} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三个负结果 · 都照实讲" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="线性探测" value={fmt4(M.probe.relMae)} note="对「预测均值」1.0000，差百分之五点四；MAE 0.5887 对 0.5584" width={962} color={C.coral} valueW={300} />
            <Row name="低秩旁路" value={fmt4(M.lora.lossFirst)} note={"八十轮后 " + fmt4(M.lora.lossLast) + "，只降百分之零点零三"} width={962} color={C.coral} valueW={300} />
            <Row name="语义锚点" value={fmt2(M.anchor.anchorAcc)} note={"零参数；线性头 " + fmt2(M.anchor.probeSynthAcc) + "，机会水平 " + fmt2(M.anchor.chance)} width={962} color={C.coral} valueW={300} />
            <Row name="共同点" value="都没赢" note="三笔账都是负结果——这一集照实讲" width={962} color={C.inkDim} valueW={300} />
          </Card>
        </div>
        <Foot accent={C.coral}>三笔账都是负结果。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>接下来<br />分八场。</Body>
          <Body style={{ marginTop: 24 }}>
            先问为什么要适配，再给三个坐标系；然后钉口径、写实现，接着看检查结果，
            再讲边界和样本量，最后用一场收束。屏幕上的每个数，都能由仓库里的一条命令复现。
          </Body>
          <div style={{ display: "flex", marginTop: 24, gap: 12 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan, border: "1px solid " + C.panelLine, borderRadius: 4, padding: "5px 9px" }}>{M.code.totalLines} 行实现</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber, border: "1px solid " + C.panelLine, borderRadius: 4, padding: "5px 9px" }}>{M.code.checks} 项检查</div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.violet, border: "1px solid " + C.panelLine, borderRadius: 4, padding: "5px 9px" }}>纯函数 · 无随机</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 280, width: 1030 }}>
          <Card label="八场路线" accent={C.cyan} style={{ width: 1010 }} pad={18}>
            <Row name="01 问题" value="微调太贵" note="冻结、少参数、两笔账" width={974} pad={7} color={C.ink} valueW={330} />
            <Row name="02 定义" value="三个坐标系" note="线性头、低秩旁路、前缀" width={974} pad={7} color={C.ink} valueW={330} />
            <Row name="03 数据" value="70,209" note="主干冻结；再切 732 / 243 / 224" width={974} pad={7} color={C.ink} valueW={330} />
            <Row name="04 目标" value="20 维波动率" note="不预测收益，预测累计绝对幅度" width={974} pad={7} color={C.cyan} valueW={330} />
            <Row name="05 实现" value={M.code.totalLines + " 行"} note="闭式解、合并、形状" width={974} pad={7} color={C.cyan} valueW={330} />
            <Row name="06 验证" value="十九项，一百零七秒" note="5 / 6 / 5，逐条过" width={974} pad={7} color={C.cyan} valueW={330} />
            <Row name="07 边界" value="三个负结果" note="换过目标、换过任务" width={974} pad={7} color={C.coral} valueW={330} />
            <Row name="08 收束" value="把账放回问题" note="下一章：怎么评" width={974} pad={7} color={C.violet} valueW={330} />
          </Card>
        </div>
        <Foot>先从一个问题开始：为什么要适配？</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
