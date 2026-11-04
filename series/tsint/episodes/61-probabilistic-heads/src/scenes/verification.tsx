import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, Verdict, checksOf, fmt2, fmt3, fmt4, pagesOf } from "../shared";

const CheckList: React.FC<{ group: string; width?: number }> = ({ group, width = 972 }) => (
  <div style={{ width }}>
    {checksOf(group).map((c) => (
      <div key={c.name} style={{ display: "flex", alignItems: "center", borderTop: "1px solid " + C.panelLine, padding: "5px 0" }}>
        <div style={{ width: 620, flexShrink: 0 }}>
          <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.25 }}>{c.name}</div>
          {c.detail ? <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint, marginTop: 1 }}>{c.detail}</div> : null}
        </div>
        <div style={{ flex: 1, textAlign: "right" }}><Verdict ok={c.ok} /></div>
      </div>
    ))}
  </div>
);

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>十八项，<br />二点二秒。</Body>
          <Body style={{ marginTop: 26 }}>
            证据程序跑十八项检查：数据四、pinball 四、交叉六、分布四，全部通过，用时二点一八秒。
            十八项都来自同一条命令，结果是 JSON 加一份逐行 checks.txt。全过，才有资格说结论。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="通过" v={M.summary.passed + "/" + M.summary.total} color={C.cyan} />
            <KV k="分组" v="4/4/6/4" color={C.inkDim} />
            <KV k="耗时" v={fmt2(M.timing.seconds, 2) + " s"} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="检查总数" value={M.summary.total} sub="一条命令全部跑完" accent={C.cyan} style={{ width: 326 }} />
            <Stat label="失败" value={M.summary.failed} sub="没有一项失败" accent={C.cyan} style={{ width: 326 }} valueColor={C.cyan} />
            <Stat label="证据耗时" value={fmt2(M.timing.seconds, 2) + " s"} sub="含拟合与覆盖率统计" accent={C.violet} style={{ width: 326 }} valueColor={C.violet} />
          </div>
          <Card label="四分组：数据 / pinball / 交叉 / 分布" accent={C.cyan} style={{ marginTop: 16, width: 1020 }} pad={18}>
            <CheckGrid cell={30} />
          </Card>
        </div>
        <Foot>全过，才有资格说结论。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>交叉：<br />八百八十一到零。</Body>
          <Body style={{ marginTop: 26 }}>
            手工样例：三条线、两个样本、三个逆序对，程序数出来也是三。真实数据八百八十一个逆序对，摊在两万六千二百零八对上，
            是三点三六；排序后是零。这个零不是把线画平换来的，每个样本的九个值原样保留。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="手工样例" v="3" color={C.amber} />
            <KV k="实测" v={M.crossing.pairs} color={C.coral} />
            <KV k="排序后" v="0" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="交叉组：六项逐条" accent={C.coral} style={{ width: 1020 }}>
            <CheckList group="crossing" />
          </Card>
        </div>
        <Foot>交叉是被消除了，不是被掩盖了。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>pinball：<br />四个黄金值。</Body>
          <Body style={{ marginTop: 26 }}>
            黄金值零点九、零点一、零点一、零点九；tau 等于零点五时，损失退化成半个绝对误差，y 等于三、q 等于一时是一点零。
            中位数那条线应该最小化平均绝对误差，实测一点六六六七，基线一点七二四九，确实更小。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="黄金值" v="0.9/0.1" color={C.amber} />
            <KV k="中位数" v={fmt3(M.pinball.medianMae)} color={C.cyan} />
            <KV k="基线" v={fmt3(M.pinball.medianBaseline)} color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="pinball 组：四项逐条" accent={C.amber} style={{ width: 1020 }}>
            <CheckList group="pinball" />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, width: 1000 }}>
            四件事合起来证明实现没走样，然后才敢说排序的代价是零。
          </div>
        </div>
        <Foot>黄金值对上，才敢往下走。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>分布：锚点、<br />梯度与覆盖率。</Body>
          <Body style={{ marginTop: 26 }}>
            锚点：mu 等于 y、sigma 等于一，NLL 零点九一八九，半乘 ln 二 pi 加半，手算对上了。拟合高斯的测试段 NLL 二点二七四五，
            解析梯度与数值梯度也一致。覆盖率零点九二四，低于名义九十五，检查如实记录——这一项同时是一条边界。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="锚点" v={fmt4(M.dist.nllAnchor)} color={C.cyan} />
            <KV k="NLL" v={fmt4(M.dist.nll)} color={C.violet} />
            <KV k="覆盖" v={fmt3(M.dist.coverage)} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="分布组：四项逐条" accent={C.violet} style={{ width: 1020 }}>
            <CheckList group="dist" />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.coral, width: 1000 }}>
            覆盖率这一项不是通过就算了：它同时说明高斯头会在尾部失准，下一场讲这件事。
          </div>
        </div>
        <Foot>高斯头会在尾部失准。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
