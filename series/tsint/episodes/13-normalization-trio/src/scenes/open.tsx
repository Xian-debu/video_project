import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, Card, CW, Formula, Head, K, M, Pages, PAD, Stat, fmtE,
} from "../shared";

const parts = [
  { name: "RevIN", tag: "算", params: "0", note: "这一窗自己的 mu、sigma", color: C.cyan },
  { name: "DAIN", tag: "学", params: "12", note: "两个线性映射学出 alpha、beta", color: C.violet },
  { name: "SAN", tag: "猜", params: "44", note: "分片统计，再用小网络猜下一片", color: C.amber },
];

const P1: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
      <div style={{ display: "flex", gap: 26 }}>
        {parts.map((p) => (
          <Card key={p.name} label={p.tag + "统计量"} accent={p.color} style={{ flex: 1, height: 300 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.lead, color: C.ink }}>{p.name}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 92, color: p.color, lineHeight: 1.2, marginTop: 4 }}>
              {p.params}
            </div>
            <K>个参数</K>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>{p.note}</Body>
          </Card>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Body size={FT.h2} color={C.ink}>三个式子都是同一个形状：先减一个中心，再除一个尺度。</Body>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 40 }}>
        <Formula size={56} color={C.cyan}>{"x̂ = (x − mu) / sigma"}</Formula>
        <Body size={FT.lead} color={C.inkDim}>
          差别只剩一件事：那个 mu 和 sigma 是谁。
        </Body>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="这一集 / 四个数" title="四个数，先钉在墙上" goal="一对矛盾、一次判决、一个发现" />
    <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 26 }}>
      <Stat label="字面实现的输出差" value={fmtE(M.revin.literal_max_diff)} accent={C.coral} style={{ flex: 1, height: 240 }}
        sub="照着式(2.7)写：输出与输入几乎一样，这一层什么都没做" valueColor={C.coral} />
      <Stat label="正确实现的输出差" value={M.revin.forward_max_diff.toFixed(2)} accent={C.cyan} style={{ flex: 1, height: 240 }}
        sub="同一批数据：归一化之后离开原值七十八个单位" />
      <Stat label="三条桥接" value="0.00" accent={C.cyan} style={{ flex: 1, height: 240 }}
        sub="RevIN / DAIN / SAN 在极限处逐位退化成同一条" />
      <Stat label="片内 sigma / 整段 sigma" value={M.san.shard_sigma_ratio_mean.toFixed(3)} accent={C.amber} style={{ flex: 1, height: 240 }}
        sub="局部波动只占整段的一部分；整段 sigma 把漂移也算了进去" />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW }}>
      <Body size={FT.lead} color={C.inkDim}>
        前两个数是一对，说明原文那个式子有问题；第三个是判决，第四个是真实数据上的发现。
      </Body>
    </div>
  </>
);

export const SOpen: React.FC = () => (
  <Pages id="open" at={[0, 0.6]}>
    <P1 />
    <P2 />
  </Pages>
);
