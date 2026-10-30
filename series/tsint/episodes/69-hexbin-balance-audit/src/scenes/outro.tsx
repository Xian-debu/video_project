import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, Stat, M, beatAt, fmtP } from "../shared";

/** 收尾：三个数、一个判据、下一集。 */
export const SOutro: React.FC = () => {
  const b = (i: number) => beatAt("outro", i, 18);
  const p = M.panel20;
  return (
    <Scene id="outro">
      <Head kicker="08 / 收尾" title="三个数，一个判据" goal="先体检，再谈分数" />

      <div style={{ position: "absolute", left: PAD, top: 268, display: "flex", gap: 16 }}>
        <Build at={b(2)}>
          <Stat label="窗口" value={p.windows.toLocaleString("en-US")} accent={C.cyan} style={{ width: 420, height: 160 }}
            sub="20 只 A 股 · 32 日 / 窗" />
        </Build>
        <Build at={b(4)}>
          <Stat label="占用格子" value={String(p.occupiedBins)} accent={C.violet} style={{ width: 420, height: 160 }}
            sub="六边形 30×30" />
        </Build>
        <Build at={b(6)}>
          <Stat label="前 20% 格子覆盖" value={fmtP(p.concentration)} accent={C.coral} style={{ width: 420, height: 160 }}
            valueColor={C.coral} sub={"=" + String(p.k20) + " 格 / " + String(p.occupiedBins) + " 格"} />
        </Build>
        <Build at={b(8)}>
          <Card label="判据" accent={C.amber} style={{ width: 452, height: 160 }} pad={20}>
            <Body size={FT.body} color={C.ink}>
              前 20% 的占用格子覆盖超过 <Mono size={FT.h2} color={C.amber}>60%</Mono> 的样本 → 记为不均衡。
            </Body>
          </Card>
        </Build>
      </div>

      <div style={{ position: "absolute", left: PAD, top: 470, width: 900 }}>
        <Build at={b(10)}>
          <Card accent={C.cyan} style={{ width: 900, height: 210 }} pad={22}>
            <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif, lineHeight: 1.5 }}>
              数据均衡性，是评估之前的第一步。<br />
              不均衡的基准，会放大平均误差的错觉。
            </Body>
            <K>ts-base 191 行 + 23 条断言 · 12 条证据检查 · 全 A 级</K>
          </Card>
        </Build>

        <Build at={b(13)}>
          <div style={{ marginTop: 16 }}>
            <K>下一集 · 70 · 欧拉法把弹簧算成了永动机</K>
            <Body size={FT.meta} style={{ marginTop: 6 }}>
              步长 0.1、十个周期，能量涨 517 倍；换 RK4，误差按四阶下降。
            </Body>
          </div>
        </Build>
      </div>

      <div style={{ position: "absolute", left: 1032, top: 470, width: 768 }}>
        <Build at={b(12)}>
          <Card label="本集交付" accent={C.inkFaint} style={{ width: 768, height: 300 }} pad={22}>
            <Body size={FT.meta} style={{ lineHeight: 1.9 }}>
              代码：TsBase.Algos.Ch08.HexbinBalance（191 行）<br />
              测试：23 条断言 / 总套件 331 条<br />
              证据：ch8-hexbin-balance · 12 条检查 · 含输入 sha256<br />
              成片：8 场 · 字幕 · 章节 · 封面<br />
              复现：一条命令重算全部数字
            </Body>
          </Card>
        </Build>
      </div>
    </Scene>
  );
};
