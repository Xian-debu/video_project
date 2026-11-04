import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Foot, KV, M, PAD, Pages, Scene, SceneHead, Stat, Verdict, checksOf, fmt2, fmt4, fmtInt, pagesOf } from "../shared";
import { AccBars } from "../figs";

const CheckRows: React.FC<{ group: string }> = ({ group }) => (
  <>
    {checksOf(group).map((c) => (
      <div key={c.name} style={{ display: "flex", alignItems: "center", width: 962, borderTop: "1px solid " + C.panelLine, padding: "11px 0" }}>
        <div style={{ width: 460, flexShrink: 0, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{c.name}</div>
        <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", textAlign: "right", paddingRight: 18, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{c.detail ?? ""}</div>
        <Verdict ok={c.ok} />
      </div>
    ))}
  </>
);

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>十九项，<br />一百零七秒。</Body>
          <Body style={{ marginTop: 24 }}>
            四个分组：数据三项，线性头五项，旁路六项，锚点五项。全部通过，用时 {M.timing.seconds.toFixed(2)} 秒。
            一条命令全部跑完。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="通过" v={M.code.checks + "/" + M.code.checks} color={C.cyan} />
            <KV k="失败" v="0" color={C.inkDim} />
            <KV k="用时" v={M.timing.seconds.toFixed(2) + " s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 280, width: 1030 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <Stat label="检查总数" value={M.code.checks} sub="一条命令全部跑完" style={{ width: 320 }} />
            <Stat label="失败" value="0" sub="没有一项失败" accent={C.cyan} valueColor={C.cyan} style={{ width: 320 }} />
            <Stat label="证据耗时" value={M.timing.seconds.toFixed(2) + " s"} sub="含 1,219 个下游窗口" accent={C.violet} valueColor={C.violet} style={{ width: 320 }} />
          </div>
          <Card label="四个分组 · 逐项通过" accent={C.cyan} style={{ width: 1010, marginTop: 20 }} pad={18}>
            <CheckGrid cell={26} />
          </Card>
        </div>
        <Foot>先看线性头。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 580 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>线性头：<br />五项。</Body>
          <Body style={{ marginTop: 22 }}>
            参数 {fmtInt(M.probe.params)}，占主干 {M.probe.share.toFixed(2)}%。岭为零时能精确复原真值，
            误差 {M.probe.exactErr.toExponential(3).replace("e-", "e−")}；λ 选中 {String(M.probe.lambda)}。
          </Body>
          <Body style={{ marginTop: 14, color: C.coral }}>
            相对误差 {fmt4(M.probe.relMae)}，MAE {fmt4(M.probe.mae)}；随机特征头 {fmt4(M.probe.randomRelMae)}——这一项赢了。
          </Body>
          <Body style={{ marginTop: 14, color: C.amber }}>表示里有信息，但不够多。</Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 268, width: 1100 }}>
          <Card label="线性头五项 · 全部通过" accent={C.cyan} style={{ width: 1010 }} pad={18}>
            <CheckRows group="probe" />
          </Card>
        </div>
        <Foot>岭参数只在验证段选。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 580 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>旁路：<br />六项。</Body>
          <Body style={{ marginTop: 22 }}>
            参数 {M.lora.params}，占 {M.lora.share.toFixed(2)}%。B 全零时输出差 0.0，逐位相同；
            减掉旁路后底座复原误差 {M.lora.mergeRestore.toExponential(3).replace("e-", "e−")}。
          </Body>
          <Body style={{ marginTop: 14 }}>
            训练损失 {fmt4(M.lora.lossFirst)} → {fmt4(M.lora.lossLast)}，只降百分之零点零三。
          </Body>
          <Body style={{ marginTop: 14, color: C.coral }}>测试 MSE {fmt4(M.lora.testMse)} 对冻结模型 {fmt4(M.lora.frozenMse)}。</Body>
          <Body style={{ marginTop: 14, color: C.amber }}>秩四改不动这块表示。</Body>
        </div>
        <div style={{ position: "absolute", left: 700, top: 262, width: 1120 }}>
          <Card label="旁路六项 · 全部通过" accent={C.violet} style={{ width: 1010 }} pad={18}>
            <CheckRows group="lora" />
          </Card>
        </div>
        <Foot accent={C.violet}>把旁路减掉，底座复原。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 580 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>锚点：<br />五项。</Body>
          <Body style={{ marginTop: 22 }}>
            六十四词两两正交，偏差 {M.anchor.orthoDev.toExponential(3).replace("e-", "e−")}；top 八与暴力排序一致。
            锚点 {fmt2(M.anchor.anchorAcc)}，线性头 {fmt2(M.anchor.probeSynthAcc)}，机会 {fmt2(M.anchor.chance)}。
          </Body>
          <Body style={{ marginTop: 14, color: C.coral }}>零参数的锚点，打不过 1,300 参数的头。</Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="前缀" v={M.anchor.prefixLen + " token"} color={C.amber} />
            <KV k="参数" v="0" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 268, width: 1100 }}>
          <Card label="锚点五项 · 全部通过" accent={C.amber} style={{ width: 1010 }} pad={18}>
            <CheckRows group="anchor" />
          </Card>
          <div style={{ marginTop: 18 }}>
            <AccBars width={820} />
          </div>
        </div>
        <Foot accent={C.amber}>零参数的锚点，打不过线性头。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
