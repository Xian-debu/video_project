import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Bars, Body, CW, Card, Chip, Head, Heatmap, K, LinePlot, M, Pages, PAD, Row, fmtF,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="方差一大，注意力就往末尾走" goal="合成数据上看得见，真实数据上看不见" />
    <div style={{ position: "absolute", left: PAD, top: 330 }}>
      <Heatmap rows={M.heat.synthetic} size={430} title="合成：2000 条 · 方差 1→10 · 平均注意力" accent={C.cyan} thirds />
    </div>
    <div style={{ position: "absolute", left: 570, top: 330 }}>
      <Heatmap rows={M.heat.real} size={430} title="真实：60 只 × 60 日 · 平均注意力" accent={C.amber} thirds />
    </div>
    <div style={{ position: "absolute", left: 1070, top: 330, width: 760 }}>
      <Card label="合成：右下角亮起来" accent={C.cyan} style={{ height: 230 }}>
        <Body size={FT.body}>
          晚段 token 的幅度大，内积大，softmax 把质量吸到矩阵右下角。行是 query，列是 key。
        </Body>
      </Card>
      <Card label="真实：几乎均匀" accent={C.amber} style={{ marginTop: 22, height: 230 }}>
        <Body size={FT.body}>
          同一张热图，亮暗几乎没有结构。三段质量 34.99 / 33.65 / 31.36，最大差 0.036。
        </Body>
      </Card>
      <div style={{ marginTop: 18 }}>
        <Chip color={C.cyan}>机制存在 ≠ 数据里有那个问题</Chip>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 直觉" title="三段质量：合成 vs 真实" goal="把热图压成三个数" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: 780 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.cyan, marginBottom: 12 }}>合成 · 2000 条，方差 1→10</div>
      <Bars
        width={760}
        rowH={84}
        at={8}
        items={[
          { label: "早段 key", value: M.synthetic.early_mass, text: M.synthetic.early_mass.toFixed(4), color: C.cyan },
          { label: "中段 key", value: M.synthetic.mid_mass, text: M.synthetic.mid_mass.toFixed(4), color: C.cyanDeep },
          { label: "晚段 key", value: M.synthetic.late_mass, text: M.synthetic.late_mass.toFixed(4), color: C.coral },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: 1000, top: 360, width: 780 }}>
      <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.amber, marginBottom: 12 }}>真实 · 60 只 × 60 日</div>
      <Bars
        width={760}
        rowH={84}
        at={30}
        items={[
          { label: "早段 key", value: M.real.early_mass, text: M.real.early_mass.toFixed(4), color: C.amber },
          { label: "中段 key", value: M.real.mid_mass, text: M.real.mid_mass.toFixed(4), color: C.amber },
          { label: "晚段 key", value: M.real.late_mass, text: M.real.late_mass.toFixed(4), color: C.amber },
        ]}
      />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Card label="差多少" accent={C.coral} style={{ height: 170 }}>
        <Row name="合成：晚段 − 早段" value={fmtF(M.synthetic.late_mass - M.synthetic.early_mass, 4)} note="非平稳造出了 27 个百分点的位置偏置" color={C.coral} />
        <Row name="真实：三段最大值 − 最小值" value={fmtF(M.real.third_spread, 4)} note="不到 4 个百分点，几乎均匀" color={C.cyan} />
      </Card>
    </div>
  </>
);

const P3: React.FC = () => {
  const a = M.grid.map((g) => g.a);
  const series = [
    { values: M.grid.map((g) => g.syn_early), color: C.cyan, name: "合成 · 早段" },
    { values: M.grid.map((g) => g.syn_late), color: C.coral, name: "合成 · 晚段" },
    { values: M.grid.map((g) => g.real_early), color: C.amber, name: "真实 · 早段", dash: true },
    { values: M.grid.map((g) => g.real_late), color: C.violet, name: "真实 · 晚段", dash: true },
  ];
  return (
    <>
      <Head kicker="04 / 直觉" title="Δ 能把质量搬走，但真实窗口没有可搬的东西" goal="线性位置偏置 Δ_t = a(1 − 2t/(T−1))，a 从 −6 到 6" />
      <div style={{ position: "absolute", left: PAD, top: 350, width: 1140 }}>
        <Card accent={C.amber} style={{ height: 560 }} pad={18}>
          <LinePlot
            series={series}
            width={1090}
            height={480}
            title="早段 / 晚段注意力质量 vs 偏置强度 a（纵轴是比例）"
            yFmt={(v) => v.toFixed(2)}
            zeroLine={false}
            legend
          />
        </Card>
      </div>
      <div style={{ position: "absolute", left: 1290, top: 350, width: 540 }}>
        <Card label="a = +2 时" accent={C.violet} style={{ height: 300 }}>
          <Row name="合成早段" value={"0.209 → 0.599"} color={C.cyan} />
          <Row name="真实早段" value={"0.350 → 0.735"} color={C.amber} />
          <Row name="合成熵" value={"3.305 → 3.305"} note="几乎不动" color={C.inkDim} />
          <Row name="真实熵" value={"3.559 → 3.089"} note="−0.4706，明显变尖" color={C.coral} />
        </Card>
        <Card label="读法" accent={C.coral} style={{ marginTop: 22, height: 200 }}>
          <Body size={FT.body}>
            偏置能把质量搬到任何一段。但真实窗口本来三段均衡，搬走只是把均匀变成尖 —— 不是纠偏，是加偏。
          </Body>
        </Card>
      </div>
    </>
  );
};

export const SIntuition: React.FC = () => (
  <Pages id="intuition" at={[0, 0.36, 0.68]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
