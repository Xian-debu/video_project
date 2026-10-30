import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtE, lf } from "../shared";

/* 收尾：三个数，三种坐标，一个问题。 */

export const SOutro: React.FC = () => {
  const f = M.stats.fft;
  const b = M.stats.basis;
  const p = M.stats.patch;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={[0, 0.375, 0.5625]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三个数，给这一集收尾。
          </div>
          <Build at={lf("outro", 0.04)}>
            <div style={{ position: "absolute", left: PAD, top: 310, display: "flex", gap: 26 }}>
              <Card label="Parseval 误差" accent={C.cyan} style={{ width: 574, height: 220 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.cyan }}>{fmtE(f.parseval_rel_err, 2)}</div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>时域能量 = 频域能量；512 点上的相对差</Body>
              </Card>
              <Card label="条件数" accent={C.amber} style={{ width: 574, height: 220 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.amber }}>{b.cond_normalized.toFixed(1)}</div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>归一化基；原始幂基是 3.44e13</Body>
              </Card>
              <Card label="Patch 往返误差" accent={C.violet} style={{ width: 574, height: 220 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.violet }}>{p.roundtrip_err}</div>
                <Body size={FT.meta} style={{ marginTop: 8 }}>48 点、p=8、s=4；填充与覆盖正好对上</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 600, fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink }}>
              三种坐标，一个共同的问题。
            </div>
          </Build>
          <Build at={lf("outro", 0.26)}>
            <div style={{ position: "absolute", left: PAD, top: 700, fontFamily: FONT.sans, fontSize: FT.lead, color: C.inkDim }}>
              换完之后，什么变简单了，什么变贵了。
            </div>
          </Build>
          <Build at={lf("outro", 0.33)}>
            <div style={{ position: "absolute", left: PAD, top: 800, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "18px 26px" }}>
              <Body size={FT.body} color={C.ink}>三种表示都能算，都能验证；但每种都有自己的代价。</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            换坐标之后，简单和贵，各自换了地方。
          </div>
          <Build at={lf("outro", 0.36)}>
            <div style={{ position: "absolute", left: PAD, top: 318, display: "flex", gap: 26 }}>
              <Card label="FFT" accent={C.cyan} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.cyan }}>频率变简单</div>
                <Body style={{ marginTop: 8 }}>每个频率多少能量，一眼看到。</Body>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.coral, marginTop: 18 }}>长度变贵</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>二的幂、整 bin、补零的代价。</Body>
              </Card>
              <Card label="基展开" accent={C.amber} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.amber }}>投影变简单</div>
                <Body style={{ marginTop: 8 }}>系数就是内积；拟合值就是投影。</Body>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.coral, marginTop: 18 }}>求逆变贵</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>线性系统、条件数、基的选择。</Body>
              </Card>
              <Card label="Patch" accent={C.violet} style={{ width: 574, height: 300 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.violet }}>局部性变简单</div>
                <Body style={{ marginTop: 8 }}>每一段自己一套表示，不用要求整段平稳。</Body>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.coral, marginTop: 18 }}>边界变贵</div>
                <Body size={FT.meta} style={{ marginTop: 6 }}>填充、重叠、拼回的顺序。</Body>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.52)}>
            <div style={{ position: "absolute", left: PAD, top: 700, fontFamily: FONT.sans, fontSize: FT.lead, color: C.inkDim }}>
              下一集，我们回到时间轴；但带着一个新问题。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            下一集的问题。
          </div>
          <Build at={lf("outro", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 310, width: 1776 }}>
              <Card label="留给下一集" accent={C.cyan} style={{ height: 230 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink }}>形状一样、长度一样的两条序列，频谱一定一样吗？</div>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.68)}>
            <div style={{ position: "absolute", left: PAD, top: 590, fontFamily: FONT.sans, fontSize: FT.lead, color: C.coral }}>
              如果不一样，差在哪里。
            </div>
          </Build>
          <Build at={lf("outro", 0.76)}>
            <div style={{ position: "absolute", left: PAD, top: 700, display: "flex", gap: 18 }}>
              <Chip color={C.cyan}>代码已入库</Chip>
              <Chip color={C.amber}>数据已落盘</Chip>
              <Chip color={C.violet}>证据可复算</Chip>
            </div>
          </Build>
          <Build at={lf("outro", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 770, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              这一集的每个数字，都能在证据里查到。
            </div>
          </Build>
          <Build at={lf("outro", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 870, fontFamily: FONT.sans, fontSize: FT.h1, color: C.ink }}>
              感谢观看，下一集见。
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
