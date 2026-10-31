import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, lf } from "../shared";

/* 收尾：三个数、三种压缩、下一集换模型。 */

export const SOutro: React.FC = () => {
  const s = M.stats;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={[0, 0.42, 0.72]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 230, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个数，给这一集收尾。
          </div>
          <Build at={lf("outro", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 26 }}>
              <Stat label="ADF · 茅台水平" accent={C.cyan} value={s.adf.tau_level.toFixed(4)} sub="一次回归的比值；查非标准的表" valueColor={C.cyan} style={{ width: 574, height: 236 }} />
              <Stat label="漂移性 · 最后 250 点" accent={C.amber} value={s.shifting.last250.toFixed(4)} sub="中位数的中位数；不测漂移强度" valueColor={C.amber} style={{ width: 574, height: 236 }} />
              <Stat label="转移性 · 茅台符号" accent={C.violet} value={s.transition.sign_600519.toFixed(4)} sub="矩阵的迹；不测自转移" valueColor={C.violet} style={{ width: 574, height: 236 }} />
            </div>
          </Build>
          <Build at={lf("outro", 0.14)}>
            <div style={{ position: "absolute", left: PAD, top: 590, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>三个数都能算，都能复现；但都不能跨口径比较。</div>
                <K style={{ display: "block", marginTop: 10 }}>描述现状，不给预测</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 230, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            到此为止，八集都在给序列做变换。下一集开始，让网络自己学。
          </div>
          <Build at={lf("outro", 0.47)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 26 }}>
              <Card label="下一集" accent={C.violet} style={{ width: 874, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 64, color: C.ink, lineHeight: 1.15 }}>MLP → TCN</div>
                <Body style={{ marginTop: 14 }}>先看多层感知机，再看时间卷积；同一个任务，换模型。</Body>
              </Card>
              <Card label="变的是什么" accent={C.cyan} style={{ width: 874, height: 300 }}>
                <Body>前八集：每一步都能手算，口径能写死，错误在类型里。</Body>
                <Body size={FT.meta} style={{ marginTop: 10 }}>下一集：参数是学出来的，口径藏在训练里。</Body>
                <div style={{ marginTop: 16 }}><Chip color={C.violet}>同样的输入，换一种「学」</Chip></div>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.62)}>
            <div style={{ position: "absolute", left: PAD, top: 646, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              留给下一集的问题：同样的输入，换成神经网络，会多学到什么？
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            又会丢掉什么东西？
          </div>
          <Build at={lf("outro", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 330, width: 1776 }}>
              <Card accent={C.violet} style={{ height: 190 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink }}>同样的输入，换成神经网络，会多学到什么？又会丢掉什么？</div>
                <Body size={FT.meta} style={{ marginTop: 14 }}>第八集的问题，留给第九集回答。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 590, fontFamily: FONT.serif, fontSize: FT.lead, color: C.inkDim }}>
              感谢观看，下一集见。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
