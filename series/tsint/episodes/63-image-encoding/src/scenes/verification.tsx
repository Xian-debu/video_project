import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Foot, KV, M, PAD, Pages, Scene, SceneHead, Stat, Verdict, checksOf, fmt2, fmt4, pagesOf } from "../shared";
import { GasfHand, MaeBars, RowSumBars } from "../figs";

const CheckRows: React.FC<{ group: string }> = ({ group }) => (
  <div>
    {checksOf(group).map((c) => (
      <div key={c.name} style={{ display: "flex", alignItems: "center", borderTop: "1px solid " + C.panelLine, padding: "12px 0" }}>
        <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.meta, color: C.ink, lineHeight: 1.4 }}>{c.name}</div>
        <div style={{ width: 280, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{c.detail}</div>
        <div style={{ width: 78, textAlign: "right" }}><Verdict ok={c.ok} /></div>
      </div>
    ))}
  </div>
);

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>十九项，<br />四秒半。</Body>
          <Body style={{ marginTop: 26 }}>
            十九项检查，四个分组：数据三项、格拉姆角场五项、转移场六项、卷积前端五项。全部通过，
            用时 {M.timing.seconds.toFixed(2)} 秒。每一项都来自同一条命令，结果是 JSON 加一份逐行清单。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="通过" v={M.summary.passed + "/" + M.summary.total} color={C.cyan} />
            <KV k="失败" v={M.summary.failed} color={C.inkDim} />
            <KV k="耗时" v={fmt2(M.timing.seconds, 2) + " s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Stat label="检查总数" value={M.summary.total} sub="一条命令全部跑完" accent={C.cyan} style={{ width: 300 }} valueColor={C.ink} />
            <Stat label="失败" value={M.summary.failed} sub="没有一项失败" accent={C.coral} style={{ width: 300 }} valueColor={C.cyan} />
            <Stat label="证据耗时" value={fmt2(M.timing.seconds, 2) + " s"} sub="含 124 窗卷积与岭回归" accent={C.violet} style={{ width: 300 }} valueColor={C.violet} />
          </div>
          <Card label="四分组 · 逐项通过" accent={C.cyan} style={{ marginTop: 16, width: 960 }} pad={20}>
            <CheckGrid cell={26} />
          </Card>
        </div>
        <Foot>全过，才有资格说结论。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>角场这一组：<br />没有可争的地方。</Body>
          <Body style={{ marginTop: 26 }}>
            手算两点的例子：输入负一和零，和场左上角一、右下角负一，差场反对称、对角为零。一百二十八乘一百二十八的图，
            对称、反对称、对角偏差都是零；反解最大误差 {M.gaf.inverseMaxErr.toExponential(1).replace("e-", "e−")}，门槛 1e−12。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="手算" v="2 × 2" color={C.cyan} />
            <KV k="反解误差" v={M.gaf.inverseMaxErr.toExponential(1).replace("e-", "e−")} color={C.violet} />
            <KV k="偏差" v="0" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="手算两点 · 和场与差场" accent={C.cyan} style={{ width: 1010 }} pad={18}>
            <GasfHand />
          </Card>
          <Card label="角场组五项 · 全部通过" accent={C.cyan} style={{ marginTop: 14, width: 1010 }} pad={16}>
            <CheckRows group="gaf" />
          </Card>
        </div>
        <Foot>反解是算术，误差只看浮点。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>转移场这一组：<br />十六不是巧合。</Body>
          <Body style={{ marginTop: 26 }}>
            八乘八矩阵，八行和都为一；图像每行和是十六。和「箱计数乘矩阵行」的偏差是二乘十的负十四次方——
            十六是每箱十六个点乘出来的。给定矩阵和状态序列，重放误差为零。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="W 行和" v="1.0000" color={C.cyan} />
            <KV k="图像行和" v={M.mtf.imgRowSum + ".0000"} color={C.violet} />
            <KV k="重放偏差" v="0" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="行和对照 · 1 与 16" accent={C.violet} style={{ width: 1010 }} pad={18}>
            <RowSumBars width={950} />
          </Card>
          <Card label="转移场组六项 · 全部通过" accent={C.violet} style={{ marginTop: 14, width: 1010 }} pad={16}>
            <CheckRows group="mtf" />
          </Card>
        </div>
        <Foot>「行和为 1」说的是 W，不是图像。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>卷积这一组：<br />图没有赢。</Body>
          <Body style={{ marginTop: 26 }}>
            特征一百九十二加三，共一百九十五维，加截距一百九十六个参数。滑窗一百二十四个，切六十、二十九、三十五。
            测试误差：图一点三九一三，三个数字一点三九零八，朴素基线二点一五五二。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="参数" v={M.vision.params} color={C.cyan} />
            <KV k="窗口" v={M.vision.windows} color={C.inkDim} />
            <KV k="特征" v={M.vision.featureDim + " + " + M.vision.ctxDim} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一批测试窗口 · 三个 MAE" accent={C.coral} style={{ width: 1010 }} pad={18}>
            <MaeBars width={950} />
          </Card>
          <Card label="卷积组五项 · 全部通过" accent={C.amber} style={{ marginTop: 14, width: 1010 }} pad={16}>
            <CheckRows group="vision" />
          </Card>
        </div>
        <Foot>图不更差，但也没有更好。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
