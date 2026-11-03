import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, checkGroups, checksOf, fmt4, pagesOf } from "../shared";

const mk = (g: string, i: number): string => checksOf(g)[i]?.name ?? "";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>二十四项，<br />一条命令。</Body>
          <Body style={{ marginTop: 26 }}>
            没有一项跳过，没有大概通过，每项都带读数。数据四项、相关六项、谱九项、决策三项、token 两项，二十四项全过，用时零点零二秒。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="检查" v="24 / 24" color={C.cyan} />
            <KV k="分组" v="5" color={C.violet} />
            <KV k="耗时" v="0.02 s" color={C.amber} />
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>全部通过</Chip>
            <Chip color={C.violet}>五组</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="二十四项，五组" accent={C.cyan}>
            {checkGroups().map(({ g, pass, total }) => (
              <Row key={g} name={g} value={`${pass} / ${total}`} note={checksOf(g)[0]?.name ?? ""} width={1000} color={C.cyan} />
            ))}
            <div style={{ marginTop: 18 }}>
              <CheckGrid cell={30} />
            </div>
            <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>data 24 / 24 · 五组逐项对照</div>
          </Card>
        </div>
        <Foot>每项都带读数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>数据与相关，<br />十项。</Body>
          <Body style={{ marginTop: 26 }}>
            通道数六，样本五百一十二；日期从九月十号到十月二十八号；无缺失、无 NaN、六列严格对齐。相关矩阵对角全是一，最大偏差一点七的负十五，完全对称。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="数据" v="4 / 4" color={C.cyan} />
            <KV k="相关" v="6 / 6" color={C.violet} />
            <KV k="mean|ρ|" v="0.5109" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="数据组与相关组：连边界也查" accent={C.cyan}>
            <Row name="通道数" value="6" note={checksOf("data")[0]?.detail} width={1000} color={C.cyan} />
            <Row name="样本" value="512" note={checksOf("data")[1]?.detail} width={1000} color={C.cyan} />
            <Row name="日期范围" value="2024-09" note={checksOf("data")[2]?.detail} width={1000} color={C.cyan} />
            <Row name="对角" value="1.0000" note={checksOf("corr")[0]?.detail} width={1000} color={C.violet} />
            <Row name="合成 ρ=0" value="0.0000" note={checksOf("corr")[3]?.detail} width={1000} color={C.violet} />
            <Row name="真实 mean|ρ|" value="0.5109" note="0.3 < mean|ρ| < 0.7，中等相关" width={1000} color={C.amber} />
          </Card>
        </div>
        <Foot>每一项都查。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>谱组，<br />九项。</Body>
          <Body style={{ marginTop: 26 }}>
            迹等于通道数六，特征值降序；最大特征向量残差八点九的负十六。合成独立有效秩四，合成高相关一点一七，真实二点四七；真实前三占比零点八七，全部在阈值内。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="谱" v="9 / 9" color={C.cyan} />
            <KV k="残差" v="8.9e-16" color={C.violet} />
            <KV k="top3" v="0.8726" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="谱组：特征值、有效秩、方差占比" accent={C.violet}>
            <Row name="迹" value="6.0000" note="六个特征值之和 = 通道数" width={1000} color={C.cyan} />
            <Row name="最大残差" value="8.9e-16" note="特征向量满足 C v = λ v" width={1000} color={C.violet} />
            <Row name="合成独立" value="4.0000" note="四通道、rho = 0" width={1000} color={C.cyan} />
            <Row name="合成高相关" value="1.1662" note="四通道、rho = 0.9" width={1000} color={C.amber} />
            <Row name="真实有效秩" value="2.4714" note="六通道，介于两极之间" width={1000} color={C.violet} />
            <Row name="真实 top3" value="0.8726" note="前三个特征值占 87.3%" width={1000} color={C.cyan} />
            <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>另三项：特征值降序、两组 top1 占比、真实 top3 &gt; top1。</div>
          </Card>
        </div>
        <Foot>全部在阈值内。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>决策组，<br />三个分支。</Body>
          <Body style={{ marginTop: 26 }}>
            相关零，判独立；相关零点九，判混合；真实数据判 Hybrid 2。三个分支都走到，不是只测了一条路。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="决策" v="3 / 3" color={C.cyan} />
            <KV k="独立" v="rho = 0" color={C.violet} />
            <KV k="混合" v="rho = 0.9" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三个分支：独立、混合、折中" accent={C.amber}>
            <Row name="合成 rho = 0" value="Independent" note="mean 0.0000 ≤ 0.2" width={1000} color={C.cyan} />
            <Row name="合成 rho = 0.9" value="Mixed" note="mean 0.9000 ≥ 0.6 且 effRank 1.1662 ≤ 3" width={1000} color={C.violet} />
            <Row name="真实数据" value="Hybrid 2" note="mean 0.5109 卡在中间，round(2.4714) = 2" width={1000} color={C.amber} />
            <Row name="分支覆盖" value="3 / 3" note="三条路径都执行过" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>三个分支都走到。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>token 组，<br />两项全绿。</Body>
          <Body style={{ marginTop: 26 }}>
            九十六、十六、三十二，注意力比三十六。二十四项全部有读数，没有一项靠目测。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="token" v="2 / 2" color={C.cyan} />
            <KV k="比值" v="36" color={C.violet} />
            <KV k="目测" v="0" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="token 组两项：三档计数、代价比" accent={C.cyan}>
            <Row name="CI" value="96" note="6 × 16" width={1000} color={C.cyan} />
            <Row name="CM" value="16" note="512 / 32 = 16" width={1000} color={C.amber} />
            <Row name="Hybrid 2" value="32" note="2 × 16" width={1000} color={C.violet} />
            <Row name="注意力比" value="36" note="294,912 / 8,192 = 6²" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>24 / 24</Chip>
            <Chip color={C.violet}>全部有读数</Chip>
            <Chip color={C.amber}>0.02 s</Chip>
          </div>
        </div>
        <Foot>没有一项靠目测。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
