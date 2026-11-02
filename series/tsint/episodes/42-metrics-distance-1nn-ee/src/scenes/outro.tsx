import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Body, Chip, Row, Stat, fmtF } from "../shared";

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  const ed = M.main.ed, ee = M.main.ee;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1080 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 96, color: C.ink, lineHeight: 1.1 }}>距离不是万能钥匙。</div>
            <Body style={{ marginTop: 26, width: 1000 }}>
              换 DTW，准确率没动；集成多对三只，统计上不显著；合成数据上 DTW 完胜，真实数据上打平。差别不在算法，在数据里有没有可对齐的平移。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1240, top: 300, width: 600 }}>
            <Stat label="ED → DTW" value="+0.0 pp" sub="25 / 60 对 25 / 60" valueColor={C.coral} valueSize={44} />
            <div style={{ marginTop: 14 }}>
              <Stat label="EE 对 ED" value="+3 窗" sub={"0.4167 → " + fmtF(ee.acc, 4) + "，不显著"} valueColor={C.violet} valueSize={44} />
            </div>
          </div>
        </AbsoluteFill>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.24 }}>下一集：只比一小段形状。</div>
            <Body style={{ marginTop: 22, width: 860 }}>
              Shapelet 不要求两条序列整体相似，只问「这一段波形出没出现过」。PIPs 再把时间轴压到只剩拐点。整条序列的距离，到这里为止。
            </Body>
            <div style={{ marginTop: 24, display: "flex", gap: 14 }}>
              <Chip color={C.violet}>E43 · Shapelet</Chip>
              <Chip color={C.cyan}>PIPs</Chip>
              <Chip color={C.amber}>进度 52 / 74</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 300, width: 830 }}>
            <div style={{ borderLeft: "2px solid " + C.cyan, paddingLeft: 26 }}>
              <Row name="本集新增测试" value={M.meta.newCases + " 条"} width={760} />
              <Row name="证据检查" value="20 / 20" width={760} />
              <Row name="主读数" value={fmtF(ed.acc, 4) + " / " + fmtF(M.main.dtw.acc, 4) + " / " + fmtF(ee.acc, 4)} width={760} />
              <Row name="结论" value="净提升 0，不显著" color={C.coral} width={760} />
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
