import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Body, Card, CodeBlock, CW, Chip, Formula, Head, K, M, Pages, PAD, Row, Verdict, fmtE,
} from "../shared";

const P1: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1000 }}>
      <CodeBlock
        title="原文 式(2.7) —— 逐字抄下来"
        width={1000}
        lines={[
          { t: "X'   = (X − mu) / sigma        -- 前三行很干净" },
          { t: "r    = X − X'" },
          { t: "X''  = X' + r", hi: true },
        ]}
      />
      <div style={{ marginTop: 26 }}>
        <Formula size={54} color={C.coral}>{"X' + (X − X') = X"}</Formula>
        <Body size={FT.lead} color={C.inkDim} style={{ marginTop: 10 }}>
          代进去，X 撇消掉了。这一层原样返回输入。
        </Body>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1120, top: 330, width: 700 }}>
      <Card label="为什么原文要这么写" accent={C.cyan} style={{ height: 260 }}>
        <Body size={FT.body}>
          作者想说的是：前向把统计量存下来，反向再用它还原。
          这是 RevIN 的核心，也是它可逆的原因。
        </Body>
        <Body size={FT.body} color={C.coral} style={{ marginTop: 14 }}>
          但式子里没写统计量存在哪，也没写反向怎么拿回来。
        </Body>
      </Card>
      <Card label="结论" accent={C.coral} style={{ height: 200, marginTop: 22 }}>
        <Body size={FT.h2} color={C.ink}>照抄实现 = 恒等层。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
          r 那一行是拿 X 减 X 撇；第五行又把 r 加回 X 撇。
        </Body>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="一个数 vs 另一个数" goal="同一批数据，照抄的和写对的" />
    <div style={{ position: "absolute", left: PAD, top: 400, width: CW, display: "flex", gap: 30 }}>
      <Card label="照式(2.7)实现" accent={C.coral} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 84, color: C.coral, lineHeight: 1.1 }}>{fmtE(M.revin.literal_max_diff)}</div>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          输出与输入的最大差。浮点舍入级 —— 等于什么都没做。
        </Body>
      </Card>
      <Card label="按语义写对" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 84, color: C.cyan, lineHeight: 1.1 }}>{M.revin.forward_max_diff.toFixed(2)}</div>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          同样的数据、同样的窗口。归一化之后，离原值七十八个单位。
        </Body>
      </Card>
      <Card label="差了多少" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 84, color: C.amber, lineHeight: 1.1 }}>{"≈16"}</div>
        <K>个数量级</K>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          一个是十的负十四次方，一个是十的负两次方还不到。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        一个正常的归一化，输出应该离输入很远。这组数字就是证据：
        <span style={{ color: C.coral }}> 照抄的那一版，什么都没做。</span>
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="式(2.6) 的小毛病" goal="排印缺陷，顺手记在勘误表" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: CW }}>
      <Card label="DAIN 的两条式子" accent={C.amber} style={{ height: 240 }}>
        <Formula size={52}>{"alpha = W_a [mu, sigma, x_T] + b_a"}</Formula>
        <Formula size={52} style={{ marginTop: 14 }}>{"beta  = W_b [mu, sigma, x_T] + b_b"}</Formula>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14 }}>
          原文两条都是单撇；按上下文，第二条的 beta 应该是双撇。抄错不会报错，只会让记号乱掉。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 700, width: CW, display: "flex", gap: 30 }}>
      <Card label="所以第一课" accent={C.cyan} style={{ flex: 1, height: 190 }}>
        <Body size={FT.h2} color={C.ink}>照公式实现之前，先问它闭不闭环。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
          输入经过它、再经过反变换，能不能回到原样？式(2.7) 的答案是「能，但它根本没变」。
        </Body>
      </Card>
      <Card label="第二课" accent={C.cyan} style={{ flex: 1, height: 190 }}>
        <Body size={FT.h2} color={C.ink}>把书里的式子当需求，不当实现。</Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 10 }}>
          需求是「用本窗统计量归一化，并保证可逆」；实现可以是任何满足它的写法。
        </Body>
      </Card>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, 0.42, 0.74]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
