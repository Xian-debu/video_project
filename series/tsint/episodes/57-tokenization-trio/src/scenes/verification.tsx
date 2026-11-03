import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, Verdict, checkGroups, pagesOf } from "../shared";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>二十二项，<br />一条命令。</Body>
          <Body style={{ marginTop: 26 }}>
            数据四项，patch 七项，周期五项，前缀六项。跑完不到一秒。没有跳过，也没有「大概通过」；每项都带读数。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="检查" v="22 / 22" color={C.cyan} />
            <KV k="耗时" v="< 1 s" color={C.amber} />
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <Verdict ok label="全部通过" />
            <Chip color={C.cyan}>四组</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="二十二项，四组" accent={C.cyan}>
            {checkGroups().map((g) => (
              <Row key={g.g} name={g.g} value={g.pass + " / " + g.total} note="" width={1040} color={g.pass === g.total ? C.cyan : C.coral} />
            ))}
            <div style={{ marginTop: 18 }}>
              <CheckGrid cell={24} />
            </div>
            <div style={{ marginTop: 12, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
              data {M.summary.passed} / {M.summary.total} · 每组逐项对照
            </div>
          </Card>
        </div>
        <Foot>每项都带读数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>patch 组，<br />十二项读数。</Body>
          <Body style={{ marginTop: 26 }}>
            三种长度的计数、合计、重叠窗口、重构误差、正交误差、覆盖。十二、六、三之外，还有 21 和 11 两个合计读法。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="计数" v="12/6/3" color={C.cyan} />
            <KV k="合计" v="21" color={C.violet} />
            <KV k="重叠" v="11" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="patch 组：七项检查" accent={C.cyan}>
            <Row name="p=8" value="12 token" note="96 ÷ 8" width={1040} color={C.cyan} />
            <Row name="p=16" value="6 token" note="96 ÷ 16" width={1040} color={C.violet} />
            <Row name="p=32" value="3 token" note="96 ÷ 32" width={1040} color={C.amber} />
            <Row name="合计" value="21" note="12 + 6 + 3" width={1040} color={C.inkDim} />
            <Row name="重叠" value="11" note="p=16、stride=8" width={1040} color={C.cyan} />
            <Row name="重构误差" value="3.11e-15" note="小于 1e-10 阈值" width={1040} color={C.violet} />
            <Row name="覆盖" value="96 / 96" note="没有点被漏掉" width={1040} color={C.amber} />
          </Card>
        </div>
        <Foot>没有点被漏掉。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>周期组，<br />退化也被测到。</Body>
          <Body style={{ marginTop: 26 }}>
            lag 0 与 lag 24 都等于 1；主峰 24；真实序列 lag 24 只有 0.4243，且没有局部峰，返回空。退化路径也是一项检查。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="正弦峰" v="24" color={C.cyan} />
            <KV k="真实峰" v="无" color={C.coral} />
            <KV k="真实 lag24" v="0.4243" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="周期组：五项检查" accent={C.amber}>
            <Row name="lag 0" value="1.0000" note="自相关归一化" width={1040} color={C.cyan} />
            <Row name="lag 24" value="1.0000" note="正弦周期处" width={1040} color={C.violet} />
            <Row name="主峰" value="24" note="第一个过阈值的局部极大" width={1040} color={C.amber} />
            <Row name="真实 lag 24" value="0.4243" note="过 0.3 阈值，但没有局部峰" width={1040} color={C.coral} />
            <Row name="真实主峰" value="无" note="返回空，退化成固定 patch" width={1040} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Verdict ok label="退化路径 PASS" />
            <Chip color={C.cyan}>不硬凑</Chip>
          </div>
        </div>
        <Foot>退化路径也被测到。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>前缀组，<br />六项全绿。</Body>
          <Body style={{ marginTop: 26 }}>
            四档长度、前缀维度、拼接长度、最近档、表内查询。四档都在表里，没有越界；三取二、六取四，平手取小。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="档位" v="4" color={C.cyan} />
            <KV k="维度" v="32" color={C.violet} />
            <KV k="最近档" v="3→2 / 6→4" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="前缀组：六项检查" accent={C.violet}>
            <Row name="四档长度" value="512 → 64" note="四档：512/256/128/64，每降一档减半" width={1040} color={C.cyan} />
            <Row name="前缀维度" value="32" note="四档共用一张表" width={1040} color={C.violet} />
            <Row name="拼接长度" value="+1" note="前缀占一个位置" width={1040} color={C.amber} />
            <Row name="最近档 3" value="2" note="没有 r=3，取 2" width={1040} color={C.cyan} />
            <Row name="最近档 6" value="4" note="没有 r=6，取 4" width={1040} color={C.violet} />
            <Row name="表内查询" value="4 / 4" note="四档都命中，不越界" width={1040} color={C.amber} />
          </Card>
        </div>
        <Foot>这六项全绿。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
