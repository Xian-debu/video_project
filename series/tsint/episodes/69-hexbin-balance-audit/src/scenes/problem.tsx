import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, M, beatAt, fmtInt, fmtP } from "../shared";

/** 问题：两组数据放在一起，集中度差了两成二。 */
export const SProblem: React.FC = () => {
  const b = (i: number) => beatAt("problem", i, 30);
  const p = M.panel20;
  const q = M.blue3;
  const rows: [string, string, string][] = [
    ["股票数", "20", "3"],
    ["窗口数", fmtInt(p.windows), fmtInt(q.windows)],
    ["占用格子", fmtInt(p.occupiedBins), fmtInt(q.occupiedBins)],
    ["前 20% 格子", String(p.k20), String(q.k3)],
    ["集中度", fmtP(p.concentration), fmtP(q.concentration)],
    ["最大格子", fmtInt(p.maxBinCount), "220"],
    ["最大格子占比", fmtP(M.topBinShare), "2.78%"],
  ];
  return (
    <Scene id="problem">
      <Head kicker="02 / 一件真事" title="不均衡的基准，撑不起 SOTA" goal="九成样本挤在少数格子里" />

      <div style={{ position: "absolute", left: PAD, top: 272, width: 1150 }}>
        <Build at={b(9)}>
          <Card accent={C.cyan} style={{ width: 1150 }} pad={28}>
            <div style={{ display: "flex", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, paddingBottom: 12, borderBottom: "1px solid " + C.panelLine }}>
              <div style={{ width: 360 }}>指标</div>
              <div style={{ width: 360 }}>二十只 A 股</div>
              <div style={{ flex: 1 }}>三只蓝筹</div>
            </div>
            {rows.map((r, i) => {
              const hot = r[0] === "集中度";
              return (
                <div key={r[0]} style={{ display: "flex", alignItems: "baseline", height: 62, borderBottom: i === rows.length - 1 ? "none" : "1px solid " + "rgba(34,48,63,0.55)" }}>
                  <div style={{ width: 360, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r[0]}</div>
                  <div style={{ width: 360, fontFamily: FONT.mono, fontSize: hot ? FT.h2 : FT.body, color: hot ? C.coral : C.ink }}>{r[1]}</div>
                  <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: hot ? FT.h2 : FT.body, color: hot ? C.amber : C.inkDim }}>{r[2]}</div>
                </div>
              );
            })}
          </Card>
        </Build>

        <Build at={b(20)}>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            数值来自 ts-base 证据运行 summary.json（同一窗口定义、同一网格尺寸 30×30）；蓝筹 = sh600519 / sh601318 / sh600036。
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1272, top: 272, width: 528 }}>
        <Build at={b(12)}>
          <Card label="本仓判据" accent={C.amber} style={{ width: 528, height: 210 }} pad={20}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <Mono size={FT.num} color={C.amber}>60%</Mono>
              <K>前 20% 占用格子覆盖的样本占比</K>
            </div>
            <Body size={FT.meta} style={{ marginTop: 12 }}>
              超过 60% 记为不均衡。书里只给密度图的判读方式，没有给这个数字；阈值是本仓约定。
            </Body>
          </Card>
        </Build>

        <Build at={b(13)}>
          <Card label="两组都超过了阈值" accent={C.coral} style={{ width: 528, height: 190, marginTop: 16 }} pad={20}>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <div>
                <K>二十只</K>
                <div><Mono size={FT.h2} color={C.coral}>{fmtP(p.concentration)}</Mono></div>
              </div>
              <div>
                <K>三只蓝筹</K>
                <div><Mono size={FT.h2} color={C.amber}>{fmtP(q.concentration)}</Mono></div>
              </div>
            </div>
            <Body size={FT.meta} style={{ marginTop: 12 }}>蓝筹更集中，因为三只大盘走势更像彼此。</Body>
          </Card>
        </Build>

        <Build at={b(22)}>
          <Card label="为什么平均会骗人" accent={C.inkFaint} style={{ width: 528, height: 200, marginTop: 16 }} pad={20}>
            <Body size={FT.meta}>
              总误差是平均。稀疏格子里的失败权重很小，但极端行情恰恰在尾部。
              基准不均衡，结论的适用范围就窄。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 862, width: 1728 }}>
        <Build at={b(24)}>
          <Card accent={C.coral} style={{ width: 1728, height: 96 }} pad={20}>
            <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>
              数据不均衡，后面的指标都要打折扣。先看数据怎么变成窗口。
            </Body>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
