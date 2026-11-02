import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, CheckGrid, Chip, KV, M, PAD, Pages, pagesOf, Row, Scene, SceneHead, checksOf, fmt2, fmt4 } from "../shared";
import { AugAccFig, AugQuadFig } from "../figs";
import { Grid20Fig, MaskStripFig, ProbeCompareFig, SimFig } from "../figs";

const List: React.FC<{ group: string }> = ({ group }) => (
  <div>
    {checksOf(group).map((c, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", height: 46, borderBottom: "1px solid " + C.panelLine }}>
        <div style={{ width: 40, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{String(i + 1).padStart(2, "0")}</div>
        <div style={{ flex: 1, fontSize: FT.meta, color: C.inkDim }}>{c.name}</div>
        <div style={{ width: 70, textAlign: "right" }}><Chip color={c.pass ? C.cyan : C.coral}>{c.pass ? "通过" : "失败"}</Chip></div>
      </div>
    ))}
  </div>
);

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.25 }}>二十八项，<br />一项不漏。</Body>
          <Body style={{ marginTop: 28 }}>证据程序把数据、增强、对比、掩码、对照、训练拆成六组检查，一次跑完 {M.checks.length} 项，全部通过，用时 {M.meta.evidence.seconds} 秒。所有数字都从 dist.json 读，不是手抄的。</Body>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <Chip color={C.cyan}>{M.meta.evidence.passed} / {M.meta.evidence.checks} 通过</Chip>
            <Chip color={C.violet}>{M.meta.tests.groups} 组测试</Chip>
            <Chip color={C.amber}>{M.meta.tests.assertions.toLocaleString("en-US")} 断言</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 300, width: 1040 }}>
          <Card label="六组、二十八格，按组染色" accent={C.cyan}>
            <CheckGrid width={980} />
            <div style={{ marginTop: 26 }}>
              <Row name="data · 数据" value="5 项" note="面板、切窗、类别、基线" width={980} />
              <Row name="augment · 增强" value="5 项" note="σ=0、翻转、混合、弯曲、复现" width={980} />
              <Row name="contrast · 对比" value="6 项" note="黄金值、温度、B=1 报错" width={980} />
              <Row name="mask · 掩码" value="5 项" note="9.0、空掩码、参数" width={980} />
              <Row name="control · 对照" value="4 项" note="未训练、标签错位、置换不变" width={980} />
              <Row name="train · 训练" value="3 项" note="两条损失都下降" width={980} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>先证明数据<br />是真的。</Body>
          <div style={{ marginTop: 26, width: 600 }}><List group="data" /></div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="这一页钉住的四个数" accent={C.cyan}>
            <Row name="窗口" value={M.data.windows + " 条 × " + M.data.length} note="无标签预训练池" width={1000} />
            <Row name="探针" value={M.data.probe + " 条"} note={"三类 " + M.data.classes.join(" / ")} width={1000} color={C.violet} />
            <Row name="基线" value={fmt2(M.data.baseline)} note="多数类" width={1000} color={C.coral} />
            <Row name="测试" value={M.data.testProbe + " 条"} note="每类 7/7/6" width={1000} />
          </Card>
          <div style={{ marginTop: 18, fontSize: FT.meta, color: C.inkFaint }}>数据只要错一处，后面四个模型的成绩就都不作数——所以数据本身也要查。</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>增强五项：<br />每一条都能手算。</Body>
          <div style={{ marginTop: 26, width: 600 }}><List group="augment" /></div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="四种扰动对同一条窗口" accent={C.cyan}>
            <AugQuadFig width={1000} />
            <div style={{ marginTop: 14, fontSize: FT.micro, color: C.inkFaint, fontFamily: FONT.mono }}>σ=0 返回原样 · 翻转两次还原 · λ=0.5 混合 [1,2] 与 [3,4] 得 [2,3] · 同种子逐元素相同</div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>对比六项：<br />黄金值算得出来。</Body>
          <div style={{ marginTop: 22, width: 600 }}><List group="contrast" /></div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="相似度 → 权重 → 损失：整数全在图上" accent={C.violet}>
            <SimFig width={1000} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>掩码五项：<br />边界条件也钉住。</Body>
          <div style={{ marginTop: 26, width: 600 }}><List group="mask" /></div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="这条窗口上的掩码：随机点 + 连续块" accent={C.amber}>
            <MaskStripFig width={1000} />
            <div style={{ marginTop: 22 }}>
              <Row name="黄金重构损失" value={fmt4(9)} note="[1,2,3,4] 遮第三位" width={1000} color={C.amber} />
              <Row name="平均掩码率" value={fmt4(M.augment.meanMaskRate)} note="15% 名义值，实测略高" width={1000} />
              <Row name="参数" value={M.mask.params} note="32 × 120 + 32 + 60 × 32 + 60" width={1000} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>对照组：<br />提升不是白来的。</Body>
          <div style={{ marginTop: 26, width: 600 }}><List group="control" /></div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="四个编码器，同一把探针尺子" accent={C.coral}>
            <ProbeCompareFig width={1000} />
            <div style={{ marginTop: 16 }}>
              <Row name="未训练" value={fmt2(M.control.untrainedProbe)} note={M.control.untrainedCorrect + "/" + M.data.testProbe} width={1000} color={C.inkFaint} />
              <Row name="标签错位" value={fmt2(M.control.shuffledProbe)} note={M.control.shuffledCorrect + "/" + M.data.testProbe + " · 编码器不变"} width={1000} color={C.coral} />
              <Row name="置换等变误差" value={String(M.control.permEquivErr)} note="对比模块的数值不变量" width={1000} color={C.cyan} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>训练三项：<br />损失都往下走。</Body>
          <div style={{ marginTop: 26, width: 600 }}><List group="train" /></div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 300, width: 1060 }}>
          <Card label="同一套增强，五种条件下的探针" accent={C.violet}>
            <AugAccFig width={1000} />
            <div style={{ marginTop: 16 }}>
              <Row name="对比损失" value={fmt4(M.contrast.lossStart) + " → " + fmt4(M.contrast.lossEnd)} note={M.contrast.epochs + " 轮"} width={1000} color={C.violet} />
              <Row name="掩码损失" value={fmt4(M.mask.lossStart) + " → " + fmt4(M.mask.lossEnd)} note={M.mask.epochs + " 轮"} width={1000} color={C.amber} />
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
