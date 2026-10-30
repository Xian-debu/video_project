import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, Stat, PAD, Pages, Scene, SceneHead, GapTimeline, fmtInt, M, lf } from "../shared";

/** 开场：一条断了六年的序列，三种填法，三个数。 */
export const SOpen: React.FC = () => {
  const id = "open";
  const b = (k: number) => lf(id, k);
  const s = M.suspension;
  const rows = M.manifest.files;
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.17, 0.4, 0.63, 0.85]}>
        {/* 1 · 六年的洞 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268 }}>
            <Build at={b(0.01)}>
              <GapTimeline width={1560} height={330} at={b(0.03)} />
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 1600, top: 268, width: 176 }}>
            <Build at={b(0.02)}>
              <Card label="最长空档" accent={C.coral} pad={16} style={{ width: 176 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.coral }}>2450</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>天没有一行数据</Body>
              </Card>
            </Build>
            <Build at={b(0.05)}>
              <Card accent={C.inkFaint} pad={16} style={{ width: 176, marginTop: 16 }}>
                <Body size={FT.meta} color={C.ink}>不是比喻。是三只股票里最长的一段空档。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 三种填法 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>三种填法，代码都不到一百行；但填完之后，方差会变。</Body>
          </div>
          {[
            { t: "上一次观测值，往前带", code: "locf : [Maybe a] -> Either Err ([a],[Bool])", c: C.amber, note: "阶梯 · 零收益变多" },
            { t: "均值，或者中位数", code: "statimp : Stat -> [Maybe a] -> ([a],[Bool])", c: C.coral, note: "常数 · 不贡献方差" },
            { t: "线性插值", code: "lininterp : (a,a) Int -> Either Err ([a],[Bool])", c: C.cyan, note: "直线 · 跳空被抹平" },
          ].map((m, i) => (
            <div key={m.t} style={{ position: "absolute", left: PAD + i * 600, top: 356, width: 560 }}>
              <Build at={b(0.2 + i * 0.02)}>
                <Card label={"填法 " + (i + 1)} accent={m.c} pad={20} style={{ width: 560, height: 210 }}>
                  <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{m.t}</Body>
                  <div style={{ marginTop: 18 }}><Mono size={FT.code} color={m.c}>{m.code}</Mono></div>
                  <K style={{ display: "block", marginTop: 16 }}>{m.note}</K>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 620, width: 1776 }}>
            <Build at={b(0.31)}>
              <Card accent={C.coral} pad={22} style={{ width: 1776, height: 132 }}>
                <Body color={C.ink} size={FT.lead} style={{ fontFamily: FONT.serif }}>
                  这一集不比谁更准，只回答一个问题：你填进去的那个数，凭什么。
                </Body>
                <K>收益的分布会变，后面所有指标都跟着变</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 数据 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>三只股票，二十五年日线，全部前复权。</Body>
          </div>
          {rows.map((r, i) => {
            const names = ["贵州茅台", "平安银行", "ST 锌业（已退市）"];
            return (
              <div key={r.code} style={{ position: "absolute", left: PAD + i * 600, top: 350, width: 560 }}>
                <Build at={b(0.44 + i * 0.02)}>
                  <Stat label={r.code + " · " + names[i]} value={fmtInt(r.rows) + " 行"}
                    accent={i === 2 ? C.coral : C.cyan} style={{ width: 560, height: 170 }}
                    sub={r.first + " → " + r.last} />
                </Build>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: PAD, top: 560, width: 880 }}>
            <Build at={b(0.52)}>
              <Card label="三份文件" accent={C.cyan} pad={20} style={{ width: 860, height: 150 }}>
                <Mono size={FT.num}>{fmtInt(M.manifest.totalBytes)}</Mono>
                <Mono size={FT.body} color={C.inkFaint}> 字节 · sha256 45ba1824…</Mono>
                <Body size={FT.meta} style={{ marginTop: 8 }}>价格和行情软件不一样：2009 年前复权 57 元，不是 200 元。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 560, width: 876 }}>
            <Build at={b(0.55)}>
              <Card label="关键一句" accent={C.coral} pad={20} style={{ width: 856, height: 150 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>缺失不是空值，是这一行根本不存在。</Body>
                <K>停牌的日子没有行；这句话决定了后面所有选择</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 两种对齐 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 860 }}>
            <Build at={b(0.66)}>
              <Card label="按行号对齐" accent={C.coral} pad={22} style={{ width: 860, height: 250 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>把停牌当成数据。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>六年断档被压缩成相邻两行，一个跨六年的收益被算成一天。</Body>
                <div style={{ marginTop: 16 }}><K color={C.coral}>这是最危险的错</K></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 280, width: 876 }}>
            <Build at={b(0.68)}>
              <Card label="按日期对齐（本集）" accent={C.cyan} pad={22} style={{ width: 876, height: 250 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>缺口就是缺口，不补日期。</Body>
                <Body size={FT.body} style={{ marginTop: 14 }}>日期轴上的空白保留；缺失只发生在序列内部，首尾各留一个观测。</Body>
                <div style={{ marginTop: 16 }}><K color={C.cyan}>代码按日期对齐</K></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 570, width: 1776 }}>
            <Build at={b(0.73)}>
              <Card accent={C.violet} pad={20} style={{ width: 1776, height: 120 }}>
                <Body size={FT.body}>遮挡实验：只在内部挖洞，遮 5% 或 20%，用三种方法填回去，再和真值比。</Body>
                <K>比较三个指标：价格 MAE、收益 MAE、方差</K>
              </Card>
            </Build>
          </div>
        </div>

        {/* 5 · 三个数 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>先记住三个数字，下面逐个解释。</Body>
          </div>
          {[
            { l: "收益率个数", v: "5,833", sub: "5834 个收盘价 → 5833 个日收益", c: C.cyan },
            { l: "5% 遮挡点数", v: "292", sub: "20% 是 1,167 个", c: C.violet },
            { l: "线性插值价格 MAE", v: "4.53 元", sub: "均值填充 521.63 元 · LOCF 6.82 元", c: C.amber },
          ].map((d, i) => (
            <div key={d.l} style={{ position: "absolute", left: PAD + i * 600, top: 380, width: 560 }}>
              <Build at={b(0.87 + i * 0.02)}>
                <Card label={d.l} accent={d.c} pad={24} style={{ width: 560, height: 240 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.display, color: d.c, lineHeight: 1 }}>{d.v}</div>
                  <Body size={FT.meta} style={{ marginTop: 16 }}>{d.sub}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 680, width: 1776 }}>
            <Build at={b(0.95)}>
              <Body color={C.inkDim} size={FT.body}>三个数分别对应：样本规模、遮挡规模、误差量级。</Body>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
