import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, Chip, Stat, PAD, Pages, Scene, SceneHead, Bars, CodeBlock, fmtInt, fmtE, fmtP, fmtF, M, lf } from "../shared";

/** 验证：golden 例子、方差恒等式、LOCF 代价、两种口径的 MAE、分段表。 */
export const SVerification: React.FC = () => {
  const id = "verification";
  const b = (k: number) => lf(id, k);
  const g = M.golden;
  const v = M.variance;
  const l = M.locf;
  const z = M.zeros;
  const mp = M.maePrice.p5;
  const mr = M.maeReturns.p5;
  const cell = (x: number | null, color: string, masked: boolean) => (
    <div style={{
      width: 92, height: 76, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
      background: masked ? "rgba(251,113,133,0.10)" : C.panel,
      border: "1.5px solid " + (masked ? C.coral : C.panelLine),
      fontFamily: FONT.mono, fontSize: FT.num, color: masked ? color : C.inkDim,
    }}>{x === null ? "NaN" : String(x)}</div>
  );
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.2, 0.4, 0.6, 0.79]}>
        {/* 1 · golden */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 860 }}>
            <Build at={b(0.02)}>
              <Card label="序列 1, NaN, NaN, 4" accent={C.inkFaint} pad={22} style={{ width: 860, height: 520 }}>
                <div style={{ display: "flex", gap: 10 }}>{g.series.map((x, i) => cell(x, C.coral, x === null))}</div>
                <div style={{ marginTop: 22, display: "flex", gap: 10, alignItems: "center" }}>
                  <Mono size={FT.meta} color={C.amber} style={{ width: 92 }}>LOCF</Mono>
                  {g.locf.map((x, i) => cell(x, C.amber, i === 1 || i === 2))}
                </div>
                <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
                  <Mono size={FT.meta} color={C.cyan} style={{ width: 92 }}>线性</Mono>
                  {g.linear.map((x, i) => cell(x, C.cyan, i === 1 || i === 2))}
                </div>
                <div style={{ marginTop: 24 }}><K color={C.coral}>{g.locfForwardError}</K></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 280, width: 876 }}>
            <Build at={b(0.08)}>
              <Card label="这个例子在测试里" accent={C.cyan} pad={22} style={{ width: 876, height: 250 }}>
                <div style={{ display: "flex", gap: 56 }}>
                  <div>
                    <Mono size={FT.num} color={C.coral}>{g.mean[1]}</Mono>
                    <K style={{ display: "block" }}>均值 = 中位数</K>
                  </div>
                  <div>
                    <Mono size={FT.num} color={C.cyan}>2, 3</Mono>
                    <K style={{ display: "block" }}>线性插值的两个内点</K>
                  </div>
                </div>
                <Body size={FT.body} style={{ marginTop: 18 }}>首端缺失对 LOCF 是错误，对 locfForward 是可跳过的前缀。</Body>
              </Card>
            </Build>
            <Build at={b(0.13)}>
              <Card label="错误也是断言" accent={C.violet} pad={18} style={{ width: 876, marginTop: 14 }}>
                <Body size={FT.meta}>三种缺失 + 一个坐标错误，各自有一个用例；不写「应该抛异常」这类模糊测试。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 方差 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 860 }}>
            <Body color={C.ink} size={FT.lead}>方差少掉的，正好等于挖掉的比例。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 360, width: 880 }}>
            <Build at={b(0.22)}>
              <Card label="实测 vs 解析" accent={C.coral} pad={20} style={{ width: 880, height: 420 }}>
                {[
                  { k: "p = 5%", o: v.p5.obs, i: v.p5.imputed, rel: v.p5.relErr },
                  { k: "p = 20%", o: v.p20.obs, i: v.p20.imputed, rel: v.p20.relErr },
                ].map((r) => (
                  <div key={r.k} style={{ marginBottom: 26 }}>
                    <Mono size={FT.meta} color={C.inkFaint}>{r.k} · 原始 {fmtE(r.o, 4)}</Mono>
                    <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                      <div style={{ width: 300, height: 16, background: C.panelLine, borderRadius: 4 }}>
                        <div style={{ width: (r.i / v.p5.obs) * 300, height: 16, borderRadius: 4, background: C.coral }} />
                      </div>
                      <Mono size={FT.mono} color={C.coral} style={{ marginLeft: 16 }}>{fmtE(r.i, 4)}</Mono>
                      <K style={{ marginLeft: 12 }}>(1−p) × 原方差</K>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 6 }}>
                  <Chip color={C.cyan}>相对误差 0.0（两挡都是）</Chip>
                </div>
                <K style={{ display: "block", marginTop: 14 }}>中位数填充 {fmtE(v.p5.median, 4)}：接近，但没恒等式</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 920, top: 360, width: 856 }}>
            <Build at={b(0.28)}>
              <Stat label="原始方差" value={fmtE(v.p5.obs, 4)} accent={C.inkFaint} style={{ width: 856, height: 130 }} sub="5833 个日收益 · 总体口径" />
            </Build>
            <Build at={b(0.31)}>
              <Stat label="p = 5% 填充后" value={fmtE(v.p5.imputed, 4)} accent={C.coral} valueColor={C.coral} style={{ width: 856, height: 130, marginTop: 12 }} sub={"预测 " + fmtE(v.p5.predicted, 4)} />
            </Build>
            <Build at={b(0.34)}>
              <Stat label="p = 20% 填充后" value={fmtE(v.p20.imputed, 4)} accent={C.coral} valueColor={C.coral} style={{ width: 856, height: 130, marginTop: 12 }} sub={"预测 " + fmtE(v.p20.predicted, 4)} />
            </Build>
          </div>
        </div>

        {/* 3 · LOCF 代价 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 860 }}>
            <Body color={C.ink} size={FT.lead}>再看末值填充的代价：零收益变多，平台变长。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 360, width: 880 }}>
            <Build at={b(0.42)}>
              <Card label="零收益个数" accent={C.amber} pad={20} style={{ width: 880, height: 230 }}>
                <Bars width={820} rowH={62} at={b(0.44)} items={[
                  { label: "原始", value: z.orig, text: fmtInt(z.orig), color: C.inkDim },
                  { label: "单点遮挡", value: z.single, text: fmtInt(z.single), color: C.amber },
                  { label: "连续双点", value: z.doublet, text: fmtInt(z.doublet), color: C.amber },
                ]} unit={"新增 " + fmtInt(z.added) + " 个零收益"} />
              </Card>
            </Build>
            <Build at={b(0.5)}>
              <Card label="最大跳跃" accent={C.coral} pad={20} style={{ width: 880, height: 150, marginTop: 16 }}>
                <div style={{ display: "flex", gap: 56, alignItems: "baseline" }}>
                  <Mono size={FT.h1} color={C.coral}>{fmtP(l.single.maxJump, 1)}</Mono>
                  <K>单点遮挡 · 把一段下跌压成一次跳变</K>
                </div>
                <K style={{ display: "block", marginTop: 10 }}>连续双点 {fmtP(l.doublet.maxJump, 1)}</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 920, top: 360, width: 856 }}>
            <Build at={b(0.46)}>
              <CodeBlock width={856} size={FT.code} title="平台与误差（单点 → 连续双点）" lines={[
                { t: "runs        292  →  146   平台数减半" },
                { t: "levelMae  " + fmtF(l.single.levelMae, 2) + " →  " + fmtF(l.doublet.levelMae, 2) + "   误差变大" , hi: true },
                { t: "varRet   " + fmtE(l.single.varReturns, 3) + " → " + fmtE(l.doublet.varReturns, 3) },
                { t: "zeros      324  →  324   一样多" },
              ]} />
            </Build>
            <Build at={b(0.56)}>
              <Card accent={C.inkFaint} pad={18} style={{ width: 856, marginTop: 14 }}>
                <Body size={FT.meta}>平台越长，误差累积越多；所以遮挡形态本身就是一个变量，不能只报一个数。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 两种口径 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 276, width: 860 }}>
            <Body color={C.ink} size={FT.lead}>价格口径与收益率口径，排名会翻转。</Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 356, width: 880 }}>
            <Build at={b(0.62)}>
              <Card label="价格 MAE · 元（对数刻度）" accent={C.cyan} pad={20} style={{ width: 880, height: 400 }}>
                <Bars width={820} rowH={92} log at={b(0.64)} items={[
                  { label: "线性", value: mp.linear, text: fmtF(mp.linear, 2) + " 元", color: C.cyan },
                  { label: "LOCF", value: mp.locf, text: fmtF(mp.locf, 2) + " 元", color: C.amber },
                  { label: "均值", value: mp.mean, text: fmtF(mp.mean, 2) + " 元", color: C.coral },
                ]} unit="差了两个数量级：百元级价格上，常数填充就是系统性偏移" />
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 920, top: 356, width: 856 }}>
            <Build at={b(0.66)}>
              <Card label="收益率 MAE · 无单位" accent={C.coral} pad={20} style={{ width: 856, height: 400 }}>
                <Bars width={800} rowH={92} at={b(0.68)} items={[
                  { label: "均值", value: mr.mean, text: fmtF(mr.mean, 4), color: C.coral },
                  { label: "线性", value: mr.linear, text: fmtF(mr.linear, 4), color: C.cyan },
                  { label: "LOCF", value: mr.locf, text: fmtF(mr.locf, 4), color: C.amber },
                ]} unit="收益率是百分级，均值填充的常数更接近 0：这是口径差异，不是自相矛盾" />
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 790, width: 1776 }}>
            <Build at={b(0.72)}>
              <Card accent={C.amber} pad={16} style={{ width: 1776, height: 100 }}>
                <Body size={FT.body}>所以屏幕上报误差，必须写口径。本集重点看价格口径与方差，收益率口径只用来说明排名为何翻转。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 5 · 分段 + 证据 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 268, width: 940 }}>
            <Build at={b(0.81)}>
              <Card label="分段看：误差随价格水平变化" accent={C.violet} pad={18} style={{ width: 940, height: 420 }}>
                <div style={{ display: "flex", height: 34, borderBottom: "1px solid " + C.panelLine }}>
                  {["区间", "遮挡", "均值 MAE", "线性", "LOCF"].map((h, i) => (
                    <K key={h} style={{ width: i === 0 ? 300 : 150 }}>{h}</K>
                  ))}
                </div>
                {M.blocks20.map((r) => (
                  <div key={r.from} style={{ display: "flex", height: 64, alignItems: "center", borderBottom: "1px solid " + C.panelLine }}>
                    <Mono size={FT.tiny} color={C.inkDim} style={{ width: 300 }}>{r.from.slice(0, 7) + " → " + r.to.slice(0, 7)}</Mono>
                    <Mono size={FT.tiny} color={C.inkFaint} style={{ width: 150 }}>{fmtInt(r.masked)}</Mono>
                    <Mono size={FT.tiny} color={C.coral} style={{ width: 150 }}>{fmtF(r.meanMae, 2)}</Mono>
                    <Mono size={FT.tiny} color={C.cyan} style={{ width: 150 }}>{fmtF(r.linearMae, 3)}</Mono>
                    <Mono size={FT.tiny} color={C.amber} style={{ width: 150 }}>{fmtF(r.locfMae, 3)}</Mono>
                  </div>
                ))}
                <K style={{ display: "block", marginTop: 10 }}>最后一段均价高，同样的方法误差到 13 元；不是方法变差，是价格变了</K>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 980, top: 268, width: 796 }}>
            <Build at={b(0.86)}>
              <Card label="证据" accent={C.cyan} pad={20} style={{ width: 796, height: 260 }}>
                <div style={{ display: "flex", gap: 40 }}>
                  <div><Mono size={FT.h1} color={C.cyan}>{M.meta.checks.total}</Mono><K style={{ display: "block" }}>条检查全过</K></div>
                  <div><Mono size={FT.h1} color={C.violet}>{M.meta.tests.suite_total}</Mono><K style={{ display: "block" }}>总测试</K></div>
                </div>
                <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>sha256 {M.data.sha256.slice(0, 12)}…</Mono>
                <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 6 }}>{M.meta.evidenceRunAt} · ts-base {M.meta.tsBaseCommit}</Mono>
              </Card>
            </Build>
            <Build at={b(0.9)}>
              <Card accent={C.inkFaint} pad={18} style={{ width: 796, marginTop: 14 }}>
                <Body size={FT.meta}>数据哈希写在证据里，四十九条检查可以重跑；本集不手工抄数字，屏幕上的每个数都能回到一条断言。</Body>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};