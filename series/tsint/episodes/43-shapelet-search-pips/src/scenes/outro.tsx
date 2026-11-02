import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Stat, Row, fmt4, fmtInt } from "../shared";

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.16 }}>
              挖出一小段形状，
              <br />
              给它打分。
            </div>
            <Body style={{ marginTop: 24, width: 750 }}>
              这一集挖出了一小段形状，学会用信息增益给它打分，也看见它在真实收益上失效。下一集解决另一个问题：搜索里的 min 不可导，梯度到这里就断了。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>shapelet</Chip>
              <Chip color={C.amber}>PIPs</Chip>
              <Chip color={C.violet}>F 与 H</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 940 }}>
            <Card label="本集读数" accent={C.cyan} pad={20}>
              <Row name="最优增益" value={fmt4(M.synth.full.gain) + " bit"} note="全搜索与拐点搜索相同" width={860} color={C.cyan} />
              <Row name="加速" value={fmt4(M.synth.speedup, 2) + "×"} note="候选压到 9.82%" width={860} color={C.amber} />
              <Row name="真实准确率" value={fmt4(M.real.accuracy)} note="随机 0.3333" width={860} color={C.coral} />
              <Row name="证据检查" value={M.meta.evidence.passed + " / " + M.meta.evidence.checks} note={fmt4(M.meta.evidence.seconds, 1) + " 秒"} width={860} color={C.violet} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.16 }}>
              下一集：
              <br />
              把 min 换成 SoftMin。
            </div>
            <Body style={{ marginTop: 24, width: 750 }}>
              换成 SoftMin，梯度处处存在。alpha 每放大十倍，落点误差小十倍；但 alpha 太大，梯度会下溢，训练反而停住。下一集见。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 940 }}>
            <Card label="下一集的三件事" accent={C.violet} pad={22}>
              <Row name="可微" value="min → SoftMin" note="梯度处处存在" width={860} color={C.violet} />
              <Row name="精度" value="alpha ×10 → 误差 ÷10" note="落点误差" width={860} color={C.cyan} />
              <Row name="风险" value="alpha 太大 → 梯度下溢" note="训练停住" width={860} color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
