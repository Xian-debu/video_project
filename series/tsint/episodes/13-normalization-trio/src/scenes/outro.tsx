import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, CW, Card, Formula, Head, K, KV, M, Pages, PAD, Row, Stat, fmtE,
} from "../shared";

const P1: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <div style={{ fontFamily: FONT.serif, fontSize: 76, color: C.ink, lineHeight: 1.3 }}>
        一句话：三个归一化，只差一件事。
      </div>
      <div style={{ fontFamily: FONT.serif, fontSize: 76, color: C.cyan, lineHeight: 1.3, marginTop: 6 }}>
        统计量从哪来。
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 600, width: CW, display: "flex", gap: 26 }}>
      <Card label="RevIN" accent={C.cyan} style={{ flex: 1, height: 220 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.cyan }}>算</div>
        <Row name="参数" value="0" note="本窗统计量，两遍扫描" />
      </Card>
      <Card label="DAIN" accent={C.violet} style={{ flex: 1, height: 220 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.violet }}>学</div>
        <Row name="参数" value="12" note="两个线性映射，一个门" />
      </Card>
      <Card label="SAN" accent={C.amber} style={{ flex: 1, height: 220 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 64, color: C.amber }}>猜</div>
        <Row name="参数" value="44" note="先分片统计，再猜下一片" />
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="四个数，一句话" goal="下一集：非平稳 Transformer" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: CW, display: "flex", gap: 24 }}>
      <Stat label="式(2.7) 字面实现" value={fmtE(M.revin.literal_max_diff)} accent={C.coral} style={{ flex: 1, height: 210 }}
        sub="照抄 = 恒等层" valueColor={C.coral} />
      <Stat label="正确实现" value={M.revin.forward_max_diff.toFixed(2)} accent={C.cyan} style={{ flex: 1, height: 210 }}
        sub="归一化本该如此" />
      <Stat label="三条桥接" value="0.00" accent={C.cyan} style={{ flex: 1, height: 210 }} sub="逐位相等" />
      <Stat label="片内 / 整段 sigma" value={M.san.shard_sigma_ratio_mean.toFixed(3)} accent={C.amber} style={{ flex: 1, height: 210 }}
        sub="粒度是真的不同" />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 680, width: CW }}>
      <Card label="下一集" accent={C.violet} style={{ height: 200 }}>
        <Body size={FT.h2} color={C.ink}>非平稳 Transformer：把统计量直接塞进注意力里。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
          这一集的 sigma，下一集会变成注意力的一行缩放。
        </Body>
      </Card>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, 0.5]}>
    <P1 />
    <P2 />
  </Pages>
);
