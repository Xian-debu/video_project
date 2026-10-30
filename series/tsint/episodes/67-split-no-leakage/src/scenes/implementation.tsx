import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

const TRAIN_END = ["sh688981", "sz300750", "sh600036", "sh600028"];

/** 索引：十个点、三个日期、二十只面板。 */
export const SImplementation: React.FC = () => {
  const b = (i: number) => beatAt("implementation", i, 62);
  const p = M.panel;
  const picked = p.rows.filter((r) => TRAIN_END.includes(r.code));
  return (
    <Scene id="implementation">
      <Head kicker="05 / 先把索引写死" title="先把索引写死" goal="十个点、三个日期、二十只面板" />

      <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
        <Build at={b(0)}>
          <Card label="最小例子 · n = 10 · 7 : 1 : 2" accent={C.cyan} style={{ width: 1000, height: 218 }} pad={20}>
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const c = i <= 6 ? C.cyan : i === 7 ? C.violet : C.amber;
                return (
                  <div key={i} style={{ width: 86, height: 84, borderRadius: 8, border: "1.5px solid " + c, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: c }}>{i}</span>
                    <span style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>{i <= 6 ? "train" : i === 7 ? "val" : "test"}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 26, marginTop: 12 }}>
              <Mono size={FT.meta} color={C.cyan}>train 0–6 · 7 个</Mono>
              <Mono size={FT.meta} color={C.violet}>val 7 · 1 个</Mono>
              <Mono size={FT.meta} color={C.amber}>test 8–9 · 2 个</Mono>
              <span style={{ marginLeft: "auto", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>0 基索引 · n=100 → 70 / 10 / 20</span>
            </div>
          </Card>
        </Build>

        <Build at={b(12)} style={{ marginTop: 12 }}>
          <Card label="真实数据 · 三个日期" accent={C.violet} style={{ width: 1000, height: 150 }} pad={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <DateCell k="训练最后一天" v="2022-06-28" c={C.cyan} />
              <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.inkFaint }}>→</div>
              <DateCell k="验证第一天" v="2022-06-29" c={C.violet} />
              <div style={{ fontFamily: FONT.mono, fontSize: FT.lead, color: C.inkFaint }}>→</div>
              <DateCell k="测试第一天" v="2023-07-24" c={C.amber} />
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <K>中间隔了一年</K>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>验证段用来选模型，选完封存</div>
              </div>
            </div>
          </Card>
        </Build>

        <Build at={b(28)} style={{ marginTop: 12 }}>
          <Card label="面板 · 每只股票各切一刀会怎样" accent={C.coral} style={{ width: 1000, height: 205 }} pad={16}>
            <div style={{ display: "grid", gridTemplateColumns: "190px 1fr 120px", rowGap: 4, columnGap: 12 }}>
              <HeadCell>股票</HeadCell><HeadCell>训练终点</HeadCell><HeadCell right>训练行数</HeadCell>
              {picked.map((r) => (
                <React.Fragment key={r.code}>
                  <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{r.name}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: r.trainEnd === p.sharedTrainEnd ? C.inkFaint : C.coral }}>{r.trainEnd}</div>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.ink, textAlign: "right" }}>{r.trainRows}</div>
                </React.Fragment>
              ))}
            </div>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1132, top: 292, width: 698 }}>
        <Build at={b(30)}>
          <Card label="二十只股票 · 各切各的" accent={C.coral} style={{ width: 698, height: 330 }} pad={22}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <Num value={p.distinctTrainEndDates} size={FT.cover} color={C.coral} />
              <span style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>/ {p.symbols} 个训练终点</span>
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 2 }}>early {p.minTrainEnd} · late {p.maxTrainEnd}</div>
            <div style={{ height: 1, background: C.panelLine, margin: "16px 0" }} />
            <Bar label="中芯国际 · 473 行" w={160} c={C.coral} />
            <Bar label="中国石化 · 1820 行" w={620} c={C.cyan} />
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 10 }}>
              样本量差四倍。两个模型的指标，不可比。这不是模型差异，是切分差异。
            </div>
          </Card>
        </Build>

        <Build at={b(51)} style={{ marginTop: 16 }}>
          <Card label="正确做法 · 日期轴只切一次" accent={C.cyan} style={{ width: 698, height: 256 }} pad={22}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.ink, lineHeight: 1.5 }}>
              所有股票共用<br />同一个训练终点。
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
              <div><K>训练终点</K><div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{p.sharedTrainEnd}</div></div>
              <div><K>测试起点</K><div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber }}>{p.sharedTestStart}</div></div>
              <div><K>日期违规</K><div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan }}>{p.dateViolations}</div></div>
            </div>
          </Card>
        </Build>
      </div>

      <Build at={b(58)} style={{ position: "absolute", left: PAD, top: 930, width: 1500 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: FT.num, color: C.ink }}>日期是全局坐标，索引只是局部行号。</div>
      </Build>
    </Scene>
  );
};

const DateCell: React.FC<{ k: string; v: string; c: string }> = ({ k, v, c }) => (
  <div>
    <K>{k}</K>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.body, color: c, marginTop: 4 }}>{v}</div>
  </div>
);

const HeadCell: React.FC<{ children: React.ReactNode; right?: boolean }> = ({ children, right }) => (
  <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, textAlign: right ? "right" : "left" }}>{children}</div>
);

const Bar: React.FC<{ label: string; w: number; c: string }> = ({ label, w, c }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{label}</div>
    <div style={{ width: w, height: 8, borderRadius: 4, background: c, marginTop: 4, opacity: 0.9 }} />
  </div>
);
