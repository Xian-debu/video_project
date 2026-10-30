import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, Mono, PAD, Pages, Scene, SceneHead, Stat, fmtM, lf } from "../shared";

const CellRow: React.FC<{ values: (string | number)[]; color: string; label: string; sub?: string }> = ({ values, color, label, sub }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 250 }}>
      <K>{label}</K>
      {sub ? <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 4 }}>{sub}</div> : null}
    </div>
    {values.map((v, i) => (
      <div key={i} style={{
        minWidth: 108, height: 62, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#101823", border: "1px solid " + C.panelLine, borderTop: "2px solid " + color,
        borderRadius: 8, fontFamily: FONT.mono, fontSize: FT.mono + 6, color: C.ink,
      }}>{v}</div>
    ))}
  </div>
);

export const SDefinitions: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={[0, 0.28, 0.54, 0.79]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            差分有两个下标：阶数 d，和季节周期 L。
          </div>
          <Build at={lf("definitions", 0.06)}>
            <div style={{ position: "absolute", left: PAD, top: 320, width: 1180 }}>
              <Card accent={C.cyan} style={{ height: 440 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink, lineHeight: 1.6 }}>
                  <div>Δx<sub>t</sub> = x<sub>t</sub> − x<sub>t−1</sub></div>
                  <div style={{ marginTop: 10 }}>Δ<sub>L</sub>x<sub>t</sub> = x<sub>t</sub> − x<sub>t−L</sub></div>
                </div>
                <Body style={{ marginTop: 26 }}>
                  一阶差分是今天减昨天；季节差分是今天减上一个周期的同一天。周内数据 L=5，日内四十八根 L=48。
                </Body>
                <Body style={{ marginTop: 10 }}>这一集固定：先做 d 次普通差分，再做一次季节差分。两个算子可交换，但误差传播不同，所以口径写死。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.1)}>
            <div style={{ position: "absolute", left: PAD + 1184, top: 320, width: 592 }}>
              <Card accent={C.coral} style={{ height: 440 }}>
                <K>两条硬规则</K>
                <Body style={{ marginTop: 14 }}>一、索引和时间戳必须一起丢。差一次少一个点，差两次少两个点。</Body>
                <Body style={{ marginTop: 14 }}>二、只丢值不丢日期，日期会静默错位——曲线看起来合理，数字全错。</Body>
                <div style={{ marginTop: 18 }}><Chip color={C.coral}>错位不报错</Chip></div>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            手算一遍：差分把多项式趋势降一阶。
          </div>
          <Build at={lf("definitions", 0.32)}>
            <div style={{ position: "absolute", left: PAD, top: 318 }}>
              <CellRow label="原序列" sub="平方数" values={[1, 4, 9, 16]} color={C.inkFaint} />
              <div style={{ height: 26 }} />
              <CellRow label="一阶差分" sub="Δx_t" values={s.manualD1} color={C.cyan} />
              <div style={{ height: 26 }} />
              <CellRow label="二阶差分" sub="Δ²x_t" values={s.manualD2} color={C.cyan} />
              <div style={{ height: 26 }} />
              <CellRow label="季节差分 L=2" sub="Δ₂x_t" values={s.manualSeasonal2} color={C.amber} />
            </div>
          </Build>
          <Build at={lf("definitions", 0.36)}>
            <div style={{ position: "absolute", left: PAD, top: 640, width: 1180 }}>
              <Body>二次变线性，线性变常数；常数再差就是零。L=2 的季节差分把 [1,4,9,16] 变成 [8,12]——它减的是间隔一位的数。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            对数：最简单的公式，最容易被忽略的定义域。
          </div>
          <Build at={lf("definitions", 0.58)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 880 }}>
              <Card accent={C.amber} style={{ height: 420 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 48, color: C.ink }}>y<sub>t</sub> = log x<sub>t</sub></div>
                <Body style={{ marginTop: 22 }}>
                  逐元素取对数，底数 e / 10 / 2 只是单位不同。零和负数没有实对数：不能返回 −∞，也不能返回 NaN。
                </Body>
                <div style={{ marginTop: 16 }}><Chip color={C.coral}>LogNonPositive 下标 + 原值</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.62)}>
            <div style={{ position: "absolute", left: PAD + 944, top: 318, width: 832 }}>
              <Stat label="A 股成交量里的零" accent={C.coral} value="4,487 行 / 2,491 个零" sub="上一集那只长停牌样本；最长连续 1,628 天" style={{ height: 210 }} valueSize={40} />
              <Body style={{ marginTop: 18 }}>
                直接取对数，一半数据变成负无穷。加一是办法，但要写进口径。这一集的做法是：先检查，再变换；拒绝，不猜。
              </Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            Z-score：三行里最长的公式，但它只改坐标。
          </div>
          <Build at={lf("definitions", 0.83)}>
            <div style={{ position: "absolute", left: PAD, top: 318, width: 880 }}>
              <Card accent={C.violet} style={{ height: 420 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 48, color: C.ink }}>z<sub>t</sub> = (x<sub>t</sub> − μ) / σ</div>
                <Body style={{ marginTop: 22 }}>μ 与 σ 用总体口径，除以 T，不是 T−1；与书中式 2.5 一致。</Body>
                <div style={{ marginTop: 16 }}><Chip color={C.violet}>σ=0 → 常量序列，报错</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("definitions", 0.87)}>
            <div style={{ position: "absolute", left: PAD + 944, top: 318, width: 832 }}>
              <div style={{ display: "flex", gap: 18 }}>
                <Stat label="μ" accent={C.violet} value={fmtM(s.mu, 2)} sub="总体均值" style={{ width: 400, height: 200 }} />
                <Stat label="σ" accent={C.violet} value={fmtM(s.sd, 2)} sub="总体标准差" style={{ width: 400, height: 200 }} />
              </div>
              <Body style={{ marginTop: 18 }}>
                变换之后均值 0、方差 1。形状没变，自相关也没变——所以它叫标准化，不叫平稳化。
              </Body>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
