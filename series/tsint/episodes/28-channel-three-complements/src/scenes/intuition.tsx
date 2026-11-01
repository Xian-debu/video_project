import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, LinePlot, Heat, SlotGrid, Stat, Row, Body, Mono, Formula } from "../shared";

const byCode = (code: string): string => {
  const i = M.series.codes64.indexOf(code);
  return i >= 0 ? M.series.labels64[i] : code;
};

export const SIntuition: React.FC = () => {
  const at = [0, pageAt("intuition", 18), pageAt("intuition", 23), pageAt("intuition", 35)];
  const randItems = M.series.router.map((r) => ({ label: byCode(r.code), group: r.industry, slot: r.slot_random }));
  const pcaItems = M.series.router.map((r) => ({ label: byCode(r.code), group: r.industry, slot: r.slot_pca }));
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1180 }}>
            <Card label="W₁ 的滞后剖面 · 平均绝对权重随步距衰减" style={{ width: 1140 }}>
              <LinePlot
                series={[{ values: M.series.lagProfile, color: C.cyan, name: "mean |W₁|" }]}
                width={1080}
                height={330}
                title="横轴：|i − j|，纵轴：平均绝对权重"
                yFmt={(v) => v.toFixed(3)}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1360, top: 300, width: 500 }}>
            <Stat label="带内质量" value={M.tsmixer.bandMass.toFixed(4)} sub={"|i−j| ≤ " + M.tsmixer.bandWidth + " 的权重占全部 9216 个"} accent={C.cyan} style={{ width: 460 }} />
            <Stat label="均匀基线" value={(1560 / 9216).toFixed(4)} sub="带内共 1,560 个位置，1560 / 9216" accent={C.inkFaint} valueColor={C.inkDim} style={{ width: 460, marginTop: 20 }} />
            <Stat label="W₃ 通道块质量" value={M.tsmixer.w3BlockMass.toFixed(4)} sub={"均匀基线 " + M.tsmixer.w3UniformMass.toFixed(2) + "，行业块只多一点点"} accent={C.amber} style={{ width: 460, marginTop: 20 }} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
            <Row name="读法" value="形状有结构，幅度很弱" note="带内 0.1721 对均匀 0.1693：初始化权重近乎各向同性" width={1640} />
            <Row name="结论" value="不能把随机初始化的权重当训练好的证据" note="本集只量结构是否可测，不量它有没有用" color={C.coral} width={1640} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
            <Card label="八通道相关矩阵 · 三组各三只" style={{ width: 960 }}>
              <Heat matrix={M.series.corr8} labels={M.series.labels8} groups={M.series.groups8} cell={62} gap={4} min={0} max={1} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 300, width: 740 }}>
            <Stat label="同组平均" value={M.tsmixer.withinCorr8.toFixed(4)} sub="白酒三只、银行三只、指数两只" accent={C.cyan} style={{ width: 700 }} />
            <Stat label="跨组平均" value={M.tsmixer.crossCorr8.toFixed(4)} sub="同一条时间线，同一段收益" accent={C.coral} style={{ width: 700, marginTop: 20 }} />
            <Stat label="行业块质量" value={M.tsmixer.corrBlockMass8.toFixed(4)} sub="块内相关质量占全部 64 个格子的比例" accent={C.amber} style={{ width: 700, marginTop: 20 }} />
            <div style={{ marginTop: 26 }}>
              <Body size={FT.meta} color={C.inkDim}>
                块很明显，但相关整体都在零点四到零点七之间：市场共模把每个格子都抬高了。下一集要处理的就是这件事。
              </Body>
            </div>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: CW }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.label, letterSpacing: FT_T.label, color: C.cyan }}>SLOTS · RANDOM vs PCA</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 54, color: C.ink, marginTop: 12 }}>四个槽，两种初始化，都抓不到行业。</div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 470, width: 760 }}>
            <SlotGrid items={randItems} cell={88} title={"随机初始化 · 纯度 " + M.router.randPurity.toFixed(4)} />
            <Mono size={FT.tiny} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>ARI {M.router.randARI.toFixed(4)} · 底色是槽，边框是行业</Mono>
          </div>
          <div style={{ position: "absolute", left: 920, top: 470, width: 760 }}>
            <SlotGrid items={pcaItems} cell={88} title={"中心化 PCA 初始化 · 纯度 " + M.router.pcaPurity.toFixed(4)} />
            <Mono size={FT.tiny} color={C.inkFaint} style={{ display: "block", marginTop: 10 }}>ARI {M.router.pcaARI.toFixed(4)} · 不中心化会塌成一个槽（塌缩 {M.router.collapsedSlots} 个）</Mono>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 928, width: 1400 }}>
            <Body size={FT.meta} color={C.inkDim}>
              未训练的路由器没有理由把槽对齐到行业；本集不训练，只记录容量与可测性。
            </Body>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1120 }}>
            <Card label="五个连续窗口 · 消费链十簇" style={{ width: 1080 }}>
              <LinePlot
                series={[
                  { values: M.series.ari.map((a) => a.ari), color: C.coral, name: "原始 ARI" },
                  { values: M.series.ari.map((a) => a.resid_ari), color: C.cyan, name: "减共模 ARI" },
                ]}
                width={1020}
                height={340}
                yFmt={(v) => v.toFixed(3)}
                zeroLine
                title="横轴：第几个窗口，纵轴：调整兰德指数"
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1320, top: 300, width: 540 }}>
            <Stat label="原始 ARI 均值" value={M.cluster.rawARIMean.toFixed(4)} sub="十个簇对十个行业" accent={C.coral} style={{ width: 500 }} />
            <Stat label="减共模 ARI 均值" value={M.cluster.residARIMean.toFixed(4)} sub="同一份数据，同一套聚类" accent={C.cyan} style={{ width: 500, marginTop: 20 }} />
            <Stat label="纯度 原始 / 减共模" value={M.cluster.rawPurityMean.toFixed(4) + " / " + M.cluster.residPurityMean.toFixed(4)} sub="平均每个窗口的最大簇纯度" accent={C.amber} style={{ width: 500, marginTop: 20 }} valueSize={36} />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 830, width: CW }}>
            <Formula size={44} color={C.inkDim}>{"同行业 " + M.cluster.withinRaw.toFixed(4) + " vs 跨行业 " + M.cluster.acrossRaw.toFixed(4) + " → 减共模 " + M.cluster.withinResid.toFixed(4) + " vs " + M.cluster.acrossResid.toFixed(4)}</Formula>
            <Row name="读法" value="聚类只能读到相关结构里剩下的一点点" note="ARI 0.03 到 0.13，都不高；减共模后大约翻倍" color={C.cyan} width={1640} />
            <Row name="结论" value="行业标签不是这套特征的主要成分" note="动态聚类有容量，但日频相关里行业信号很薄" color={C.coral} width={1640} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
