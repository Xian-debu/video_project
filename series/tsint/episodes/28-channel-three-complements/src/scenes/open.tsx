import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Verdict, Bars, Formula } from "../shared";

export const SOpen: React.FC = () => {
  const at = [0, pageAt("open", 12), pageAt("open", 19)];
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 470, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>CHANNEL · 8 → 64</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 128, color: C.ink, marginTop: 18, lineHeight: 1.08 }}>通道三补集</div>
            <Body style={{ marginTop: 24, maxWidth: 1360 }} size={FT.body}>
              时间轴压完，换一根轴：通道之间怎么互相看。混合 MLP 在通道上做一次矩阵乘，路由注意力用四个槽去汇总，动态聚类把通道分簇、每簇一套权重。三种代价，同一把尺子。
            </Body>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW, display: "flex", gap: 28 }}>
            <Stat label="双轴混合" value={M.tsmixer.params.toLocaleString("en-US")} sub="时间方阵加通道方阵加门" style={{ width: 520 }} />
            <Stat label="路由注意力" value={M.router.complexity + " / " + M.router.denseComplexity} sub="四个槽，交互少十六倍" accent={C.amber} style={{ width: 520 }} />
            <Stat label="动态聚类" value={M.cluster.paramsK4.toLocaleString("en-US")} sub="四个簇，每簇一套线性权重" accent={C.violet} style={{ width: 520 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 26 }}>
            <Card label="01 · 双轴混合 MLP" accent={C.cyan} style={{ width: 570, height: 356 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>TSMixer</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                时间轴混一次，通道轴混一次，外面套残差和逐元素门。九个六乘九十六的方阵，八乘八的通道方阵，九十六乘八的门。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>{M.tsmixer.T}×{M.tsmixer.T} + {M.tsmixer.N}×{M.tsmixer.N} + {M.tsmixer.T}×{M.tsmixer.N}</Mono>
            </Card>
            <Card label="02 · 路由注意力" accent={C.amber} style={{ width: 570, height: 356 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Router</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                把通道投影到少量槽，用槽和通道的内积做软分配，再和原通道做凸组合。复杂度是槽数乘通道数，不是通道数的平方。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>{M.router.slots} 槽 · {M.router.params} 参数 · 比值 {M.router.ratio}</Mono>
            </Card>
            <Card label="03 · 动态聚类" accent={C.violet} style={{ width: 570, height: 356 }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink }}>Cluster</div>
              <Body size={FT.label} style={{ marginTop: 12 }}>
                按余弦把通道分到 k 个簇，每个簇一套从历史到预测的线性映射。分配在推理时按当前窗口算，所以叫动态。
              </Body>
              <Mono size={FT.meta} color={C.inkFaint} style={{ display: "block", marginTop: 18 }}>k={M.cluster.kParams} · {M.cluster.paramsK4} 参数 · 空簇回收</Mono>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
            <Row name="通道对数" value={M.data.channels * (M.data.channels - 1) / 2 + " 对"} note="六十四只，两两相关；三百只就是四万四千八百五十对" width={1660} />
            <Row name="本集证据" value={M.meta.checks.total + " / " + M.meta.checks.total} note={"三组模块加数据，零失败；断言 " + M.meta.tests.asserts + " 条"} color={C.cyan} width={1660} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
            <Card label="三种代价 · 参数量与交互数不在一个量级" style={{ width: CW }}>
              <Bars
                items={[
                  { label: "双轴混合 10048", value: M.tsmixer.params, text: M.tsmixer.params.toLocaleString("en-US"), color: C.cyan },
                  { label: "路由 256", value: M.router.params, text: String(M.router.params), color: C.amber },
                  { label: "稠密混合 4096", value: M.router.denseParams, text: String(M.router.denseParams), color: C.coral, dim: true },
                  { label: "聚类 k=4 9312", value: M.cluster.paramsK4, text: M.cluster.paramsK4.toLocaleString("en-US"), color: C.violet },
                ]}
                width={1700}
                rowH={74}
                at={0}
                unit="参数：双轴混合按 96 步 8 通道算；路由与稠密按 64 通道算"
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
            <Formula size={44} color={C.inkDim}>{"交互：c·N = " + M.router.complexity + "，N² = " + M.router.denseComplexity + "，比值 " + M.router.ratio + " ×"}</Formula>
            <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
              <Verdict ok label={M.meta.checks.total + " / " + M.meta.checks.total + " 检查"} />
              <Verdict ok label={M.meta.tests.suites + " 套 / " + M.meta.tests.asserts + " 断言"} />
              <Mono size={FT.meta} color={C.inkFaint}>本集与前两集同一套证据口径</Mono>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
