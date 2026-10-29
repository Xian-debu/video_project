import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, Num, K, Chip, Quote, beatAt, V } from "../shared";

const TASKS = [
  { no: "01", name: "预测", en: "TSF", out: "未来值", ch: "ch03", main: true },
  { no: "02", name: "异常检测", en: "TSAD", out: "异常分数", ch: "ch04", main: true },
  { no: "03", name: "分类", en: "TSC", out: "类别标签", ch: "ch05", main: true },
  { no: "04", name: "插值", en: "TSI", out: "缺失值", ch: "ch02", main: true },
  { no: "05", name: "聚类", en: "Clustering", out: "分组", ch: "只提名", main: false },
];

export const SOpen: React.FC = () => {
  const b = (i: number) => beatAt("open", i, 18);
  return (
    <Scene id="open">
      <Head kicker="第 1 章 / 初识时间序列" title="一条序列，五个问题" goal="从一次数据快照，走到全部七十四集" />

      <div style={{ position: "absolute", left: PAD, top: 286, width: 900 }}>
        <Build at={b(0)}>
          <Quote
            width={900}
            lines={[
              "时间序列是通过对某一特定实体的指标在时间维度上的采样，记录其随时间变化的动态过程。",
              "每个数据点都关联到一个特定的时间戳。",
            ]}
          />
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 570, width: 900, display: "flex", gap: 18 }}>
        <Build at={b(2)}>
          <Card accent={C.coral} pad={18} style={{ width: 288, height: 176 }}>
            <K>{"本集算法"}</K>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <Num value={0} size={56} color={C.coral} />
              <Body size={FT.label} color={C.inkDim}>{"个"}</Body>
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 4 }}>{"导论集，只钉地图。"}</Body>
          </Card>
        </Build>
        <Build at={b(4)}>
          <Card accent={C.cyan} pad={18} style={{ width: 288, height: 176 }}>
            <K>{"已交付断言"}</K>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <Num value={V.tests.pass} size={56} color={C.cyan} />
              <Body size={FT.label} color={C.inkDim}>{"条"}</Body>
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 4 }}>{"章九的 142 条全部通过。"}</Body>
          </Card>
        </Build>
        <Build at={b(6)}>
          <Card accent={C.amber} pad={18} style={{ width: 288, height: 176 }}>
            <K>{"系列规模"}</K>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <Num value={74} size={56} color={C.amber} />
              <Body size={FT.label} color={C.inkDim}>{"集"}</Body>
            </div>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 4 }}>{"9 章，190 个算法。"}</Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 752, width: 900 }}>
        <Build at={b(9)}>
          <Card accent={C.violet} pad={20} style={{ width: 900, height: 172 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Body size={FT.lead} color={C.ink}>{"这一集只做三件事"}</Body>
              <Chip color={C.violet}>{"地图，不是算法集"}</Chip>
            </div>
            <div style={{ display: "flex", gap: 26, marginTop: 12 }}>
              {[
                ["01", "五个任务分别在问什么"],
                ["02", "为什么顺序不是普通特征"],
                ["03", "每个数凭什么可复算"],
              ].map(([n, t]) => (
                <div key={n} style={{ minWidth: 250 }}>
                  <K color={C.violet}>{n}</K>
                  <Body size={FT.body} color={C.inkDim} style={{ marginTop: 3 }}>{t}</Body>
                </div>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1012, top: 286, width: 836 }}>
        <Build at={b(2)}>
          <Card label="书里列了五个任务 · p.2–4" accent={C.cyan} pad={20} style={{ width: 836, height: 592 }}>
            {TASKS.map((t, i) => (
              <div key={t.no} style={{
                display: "flex", alignItems: "center", gap: 16, minHeight: 82,
                borderTop: i ? "1px solid " + C.panelLine : undefined,
                opacity: t.main ? 1 : 0.62,
              }}>
                <Mono size={FT.meta} color={t.main ? C.cyan : C.inkFaint} style={{ minWidth: 34 }}>{t.no}</Mono>
                <div style={{ minWidth: 178 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{t.name}</div>
                  <K>{t.en}</K>
                </div>
                <div style={{ minWidth: 150 }}>
                  <K>{"输出"}</K>
                  <Body size={FT.body} color={C.inkDim} style={{ marginTop: 2 }}>{t.out}</Body>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <Chip color={t.main ? C.violet : C.inkFaint}>{t.ch}</Chip>
                  <div style={{ marginTop: 5 }}><K>{t.main ? "算法主线" : "只有一句列举"}</K></div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, borderTop: "1px solid " + C.panelLine, paddingTop: 12 }}>
              <Body size={FT.meta} color={C.inkFaint}>
                {"本系列把 01–04 做成四条主线；聚类只有名字，没有形式化定义，不硬做。"}
              </Body>
            </div>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};