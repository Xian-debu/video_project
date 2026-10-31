import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Formula, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmtE, fmtF, fmtInt, lf } from "../shared";

/* 收尾：四个数字、一句话、下一集。 */

export const SOutro: React.FC = () => {
  const m = M;
  const g = m.grad;
  const p = m.params;
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={[0, 0.42, 0.74]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            四个数字，收个尾。
          </div>
          <Build at={lf("outro", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306, display: "flex", gap: 24 }}>
              <Stat label="零点五的十九次方" accent={C.coral} value={fmtE(g.decay19, 2)} sub="朴素连乘走到最后" valueColor={C.coral} valueSize={64} style={{ width: 426, height: 200 }} />
              <Stat label="零点九九九的二十次方" accent={C.cyan} value={fmtF(g.transfer20, 3)} sub="加法路径保住信号" valueSize={64} style={{ width: 426, height: 200 }} />
              <Stat label="两者之比" accent={C.violet} value={fmtInt(g.ratio)} sub="五个数量级" valueColor={C.violet} valueSize={64} style={{ width: 426, height: 200 }} />
              <Stat label="参数量" accent={C.amber} value={p.rnn.total + " / " + p.lstm.total} sub={"与 " + p.gru.total + "，输出头都是 13"} valueColor={C.amber} valueSize={64} style={{ width: 426, height: 200 }} />
            </div>
          </Build>
          <Build at={lf("outro", 0.14)}>
            <div style={{ position: "absolute", left: PAD, top: 552, width: 1776 }}>
              <Card label="判决表补一句" accent={C.coral} style={{ width: 1776, height: 200 }}>
                <Row name="长延迟" value="三者都远没学会" note="四十步最好的也才 0.617，比随机高 2.6σ" color={C.coral} width={1710} />
                <Row name="短延迟" value="三个都满命中" note="一步、五步，RNN 也不掉" width={1710} />
                <Row name="所以" value="差别不在「谁更聪明」" note="在「信号能传多远」" color={C.cyan} width={1710} />
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            这一集真正想说的，是一句话。
          </div>
          <Build at={lf("outro", 0.45)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1776, textAlign: "center" }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink, lineHeight: 1.5 }}>
                循环结构的差别，在梯度沿时间回传时走哪条路。
              </div>
              <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.cyan, marginTop: 14 }}>
                乘法链会衰减，加法路径能保住信号。
              </div>
            </div>
          </Build>
          <Build at={lf("outro", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 530, display: "flex", gap: 24 }}>
              <Card label="乘法链" accent={C.coral} style={{ width: 570, height: 200 }}>
                <Row name="RNN" value={fmtE(g.decay19, 2)} note="十九步连乘，信号掉到百万分之一" color={C.coral} width={520} />
                <Row name="代价" value="越深越短" note="梯度不是消失，是被乘没了" width={520} />
              </Card>
              <Card label="加法路径" accent={C.cyan} style={{ width: 570, height: 200 }}>
                <Row name="LSTM cell" value={fmtF(g.transfer20, 3)} note="c 沿穿行累加，门只调节" color={C.cyan} width={520} />
                <Row name="代价" value="三个门要学" note="参数是 RNN 的四倍" width={520} />
              </Card>
              <Card label="但这不是保证" accent={C.amber} style={{ width: 570, height: 200 }}>
                <Row name="f 是学出来的" value="不是给定的" note="能不能学到零点九九九，看数据" color={C.amber} width={520} />
                <Row name="中间隔着" value="三样都要" note="数据、预算、初始化，所以判决表才是判决" width={520} />
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.7)}>
            <div style={{ position: "absolute", left: PAD, top: 780, display: "flex", alignItems: "center", gap: 20 }}>
              <Chip color={C.cyan}>保住信号 ≠ 学会记住</Chip>
              <Body size={FT.meta}>这句话对工程更有用：短延迟上 RNN 便宜又快，长延迟上只有谁掉得慢</Body>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            下一集换一个维度。
          </div>
          <Build at={lf("outro", 0.78)}>
            <div style={{ position: "absolute", left: PAD, top: 300, display: "flex", gap: 24 }}>
              <Card label="前面十集" accent={C.inkDim} style={{ width: 570, height: 300 }}>
                <Row name="时间" value="都是那条线" note="一维序列，位置就是时刻" width={520} />
                <Row name="卷积" value="核沿时间滑" note="邻域由距离定义" width={520} />
                <Row name="但很多序列" value="不只有时间" note="还有空间：节点与边" width={520} />
              </Card>
              <Card label="下一集的问题" accent={C.violet} style={{ width: 570, height: 300 }}>
                <Row name="卷积核" value="能不能定义在图结构上" note="邻域不再是「前后各两格」" color={C.violet} width={520} />
                <Row name="图卷积" value="邻接矩阵变成骨架" note="A 决定谁能看谁" width={520} />
                <Row name="这一换" value="把时序与结构接起来" note="也是第 2 章最后一块" width={520} />
              </Card>
              <Card label="第 12 集" accent={C.cyan} style={{ width: 570, height: 300 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: 40, color: C.ink, lineHeight: 1.4 }}>卷积网络<br />与图卷积网络</div>
                <div style={{ height: 14 }} />
                <K>从时间邻域，走到图邻域</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("outro", 0.9)}>
            <div style={{ position: "absolute", left: PAD, top: 660, width: 1776, textAlign: "center" }}>
              <Formula size={32} color={C.inkFaint}>感谢观看，下一集见。</Formula>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
