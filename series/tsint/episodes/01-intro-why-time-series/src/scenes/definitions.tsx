import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Math as TeX } from "../../design/Math";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, Figure, beatAt } from "../shared";

export const SDefinitions: React.FC = () => {
  const b = (i: number) => beatAt("definitions", i, 33);
  return (
    <Scene id="definitions">
      <Head kicker="02 / 定义与分类" title="一条序列，三种切法" goal="式 (1.1) 的形式定义，以及五个任务各自的输出" />

      <div style={{ position: "absolute", left: PAD, top: 270, width: 860 }}>
        <Build at={b(1)}>
          <Card label="形式定义 · 式 (1.1)" accent={C.cyan} pad={22} style={{ width: 860, height: 260 }}>
            <TeX tex="X = (x_1, x_2, \ldots, x_T) \in \mathbb{R}^{T \times N}" block size={42} color={C.ink} align="left" />
            <div style={{ marginTop: 10 }}>
              <Body size={FT.body} color={C.inkDim}>
                {"每一行是一个观测向量，都记在时间戳 "}<Mono size={FT.body} color={C.cyan}>{"t"}</Mono>
                {" 上；T 是长度，N 是变量数。"}
              </Body>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
              <Chip color={C.violet}>{"t 是时间戳，不是行号"}</Chip>
              <Chip color={C.cyan}>{"N = 1 单变量"}</Chip>
              <Chip color={C.cyan}>{"N > 1 多变量"}</Chip>
            </div>
          </Card>
        </Build>

        <Build at={b(17)}>
          <Card label="三条读法 · 不写清楚就会对不上" accent={C.amber} pad={20} style={{ width: 860, height: 310, marginTop: 24 }}>
            {[
              ["01", "时间戳可以等距，也可以被事件触发", "等距叫均匀采样；不等距叫非均匀采样。两种都用 T 表示长度，但不能假设 t 就是 1..T。"],
              ["02", "变量数决定是单条还是成组", "气象站的气温是一条；四个路口一周的流量是四条，且彼此相关。"],
              ["03", "五个任务，输出不同", "预测给未来值，异常检测给分数，分类给标签，插值补缺失，聚类分组。"],
            ].map(([n, t, d], i) => (
              <div key={n} style={{ display: "flex", gap: 12, marginTop: i ? 10 : 0 }}>
                <Mono size={FT.micro} color={C.amber} style={{ minWidth: 26 }}>{n}</Mono>
                <div>
                  <Body size={FT.body} color={C.ink} style={{ lineHeight: 1.45 }}>{t}</Body>
                  <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 2, lineHeight: 1.5 }}>{d}</Body>
                </div>
              </div>
            ))}
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 968, top: 270, width: 880 }}>
        <Build at={b(7)}>
          <Figure
            file="tsint-01-intro-why-time-series/book/fig1-1.png"
            label="原文 · 图 1.1 · p.2"
            caption=""
            width={880}
            height={460}
          />
        </Build>
        <div style={{ marginTop: 10, width: 880 }}>
          <Body size={FT.meta} color={C.inkFaint}>
            {"预测、异常检测、分类、插值、聚类：同一串观测，问的问题不同，输出就不同。本系列把前四个作成算法主线，聚类只在这一页出现。"}
          </Body>
        </div>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 884, width: 1776 }}>
        <Build at={b(29)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <Body size={FT.lead} color={C.ink}>{"定义只规定形状，任务才规定输出。"}</Body>
            <K>{"式 (1.1) 不区分五个任务；是标签定义和评价指标把它们分开。"}</K>
          </div>
        </Build>
      </div>
    </Scene>
  );
};