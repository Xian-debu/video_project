import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict, Bars } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 9), pageAt("open", 14), pageAt("open", 22)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 470, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>PATCH · 96 → 11</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 128, color: C.ink, marginTop: 18, lineHeight: 1.08 }}>块嵌入与两种注意力</div>
            <Body style={{ marginTop: 24, maxWidth: 1300 }} size={FT.body}>
              把九十六步切成十一个块，注意力矩阵从九十六乘九十六缩到十一乘十一；再用一个交叉注意力解码器，让二十四个查询直接读编码端的记忆。三个模块，一套尺子。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW, display: "flex", gap: 28 }}>
            <Stat label="块嵌入参数" value={M.patch.params.toString()} sub={"十六乘三十二，加三十二个偏置"} style={{ width: 520 }} />
            <Stat label="编码器加头" value={M.patchtst.totalParams.toString()} sub={"一万二千二百八十八加八千四百四十八"} accent={C.amber} style={{ width: 520 }} />
            <Stat label="交叉解码器" value={M.cross.params.toString()} sub={"八个方阵，两段前馈，二十四个查询"} accent={C.violet} style={{ width: 520 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 26 }}>
            <Card label="01 · 块嵌入" accent={C.cyan} style={{ width: 570, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Patch</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                九十六步铺成十一个块，每块十六步，相邻重叠八个点。每块乘一个十六乘三十二的矩阵，加位置编码。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>{M.patch.n} 块 · {M.patch.params} 参数 · 位置 {M.patch.posParams}</Mono>
            </Card>
            <Card label="02 · 通道独立编码" accent={C.amber} style={{ width: 570, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Channel-wise</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                每个通道单独走一遍一层编码器：四个头的自注意力、两段前馈、两次 Post-LN，最后按通道拼回一张表。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>{M.patchtst.d} 维 · {M.patchtst.heads} 头 · 前馈 {M.patchtst.dff}</Mono>
            </Card>
            <Card label="03 · 交叉注意力解码" accent={C.violet} style={{ width: 570, height: 340 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Cross</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                查询来自解码端的二十四个可学习向量，键和值来自编码端的九十六个记忆；自注意力带因果掩码，交叉注意力不掩。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>查询 {M.cross.queries} · 记忆 {M.cross.memLen} · 参数 {M.cross.params}</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
            <Row name="交互对数" value={M.patchtst.denseInteractions + " → " + M.patchtst.interactions} note="九十六乘九十六，缩到十一乘十一" width={1500} />
            <Row name="几何倍数" value={M.patchtst.ratio.toFixed(2) + " ×"} note={"九千二百一十六除以一百二十一"} color={C.cyan} width={1500} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
            <Card label="注意力交互对数 · 稠密对分块" style={{ width: CW }}>
              <Bars
                items={[
                  { label: "稠密 96×96", value: M.patchtst.denseInteractions, text: M.patchtst.denseInteractions.toLocaleString("en-US"), color: C.coral },
                  { label: "分块 11×11", value: M.patchtst.interactions, text: String(M.patchtst.interactions), color: C.cyan },
                  { label: "比值", value: M.patchtst.ratio, text: M.patchtst.ratio.toFixed(2) + "×", color: C.cyan, dim: true },
                ]}
                width={1660}
                max={M.patchtst.denseInteractions}
                unit="单位：对数（比值那条按同尺度画，只为对照长度）"
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 26 }}>
            <Stat label="证据检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} sub="三组合成金例，零失败" accent={C.amber} style={{ width: 540 }} />
            <Stat label="测试" value={M.meta.tests.suites + " 套"} sub={M.meta.tests.asserts + " 条断言，零失败"} accent={C.violet} style={{ width: 540 }} />
            <Stat label="读数耗时" value={M.meta.sec.toFixed(2) + " s"} sub="evidence-ch03-patch，可重跑" style={{ width: 540 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 380, width: CW }}>
            <Card label="先说清楚 · 本集的证词范围" accent={C.coral} style={{ width: CW }}>
              <Row name="有" value="结构、参数、置换、方向、掩码" note="每一条都能用一条断言钉住" width={1660} />
              <Row name="没有" value="训练、损失、预测精度" note="没有拟合，就没有 MAE 可以报" color={C.coral} width={1660} />
              <Row name="热图" value="未训练" note="查询随机初始化，位置是固定线性投影，只说明形状" color={C.amber} width={1660} />
              <Row name="数据" value={M.data.rows + " 行 · " + M.data.channels + " 通道"} note={"面板 " + M.data.start + " 到 " + M.data.end} width={1660} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: CW, display: "flex", gap: 26 }}>
            <Card label="交付口径" accent={C.cyan} style={{ width: 860, height: 170 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Verdict ok label="实现通过" />
                <Verdict ok label="证据通过" />
                <Verdict ok={false} label="未做端到端训练" />
              </div>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 14 }}>book {M.meta.bookPages} · 算法提交 {M.meta.commit}</Mono>
            </Card>
            <Card label="这一集的赌注" accent={C.amber} style={{ width: 860, height: 170 }}>
              <Body size={FT.label}>赌块内的高频不重要，赌块间的低频更重要；还赌通道之间可以互相独立。</Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
