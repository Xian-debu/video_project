import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt4, pagesOf } from "../shared";
import { RelErrorBars, SqrtAmplification } from "../figs";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>两个都没赢。</Body>
          <Body style={{ marginTop: 26 }}>
            第一件：两个模型都打不过持久化基线。相对误差大于一，意思是还不如什么都不变。这不是实验失败，是数据在说话——第二十步的价格路径，
            信噪比很低。第二件：根号 F 的放大没有出现。如果误差是独立噪声，二十步该放大约四点四七倍；实测自回归只比非自回归差百分之二十一。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="AR" v={fmt4(M.ar.rel20)} color={C.cyan} />
            <KV k="NAR" v={fmt4(M.nar.rel20)} color={C.violet} />
            <KV k="基线" v="1.0000" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="F=20：两条都在基线右边" accent={C.coral} style={{ width: 1020 }} pad={20}>
            <RelErrorBars width={950} height={196} />
          </Card>
          <Card label="√F 的放大：预期对不上实测" accent={C.amber} style={{ marginTop: 16, width: 1020 }} pad={20}>
            <SqrtAmplification width={950} height={230} />
          </Card>
        </div>
        <Foot>一个负结果，两个数都大于一。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>偏差清单，<br />四条。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，非自回归参数是一千三百二十，不是一千三百，原因在偏置并入最后一列。第二，头输入多了窗口最后一点，没有这条直连第一步误差被重建损失支配。
            第三，每个地平线单独选惩罚系数，共用系数会让第一步被过度收缩。第四，验证集从五百提到一千，五百时相邻地平线的选参会跳变。
          </Body>
          <div style={{ display: "flex", marginTop: 26, gap: 10 }}>
            <Chip color={C.amber}>全部写进计划文档的偏差表</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="四条与计划书的偏差" accent={C.amber} style={{ width: 1020 }}>
            <Row name="偏差一" value="1,320 vs 1,300" note="偏置单独一列，多出二十个参数" width={972} color={C.amber} valueW={300} />
            <Row name="偏差二" value="直连最后一点" note="没有它，F=1 相对误差 6.98，连基线都打不过" width={972} color={C.amber} valueW={300} />
            <Row name="偏差三" value="逐地平线选 λ" note="共用 λ 会让第一步被过度收缩，比较不公平" width={972} color={C.amber} valueW={300} />
            <Row name="偏差四" value="验证 1,000" note="五百时选参在相邻地平线之间跳变，曲线不单调" width={972} color={C.amber} valueW={300} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            第五条偏差是 √F 的放大没有出现——它已经单独占了一屏。
          </div>
        </div>
        <Foot>偏差不是遮掩，是这一集的一部分。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>能说，<br />和不能说。</Body>
          <Body style={{ marginTop: 26 }}>
            能说：同一个编码器下，非自回归在长地平线上更稳；一次前向比二十次快十六倍左右；自回归的误差确实随步数增长，回灌是原因之一。
            不能说：非自回归更准——两者都没打过最简单的基线；不能说自回归一定差——短地平线上两者没有区别；也不能说根号 F 是规律。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="快" v={fmt2(M.timing.ratio) + "×"} color={C.cyan} />
            <KV k="准" v="都不如基线" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <Card label="可以说" accent={C.cyan} style={{ width: 500 }}>
              <Row name="长地平线" value="NAR 更稳" note="F=20 相对误差低 21%" width={452} color={C.cyan} valueW={210} />
              <Row name="速度" value={"快 " + fmt2(M.timing.ratio) + "×"} note="一次前向对二十次前向" width={452} color={C.cyan} valueW={210} />
              <Row name="误差增长" value="回灌是原因之一" note="曝光偏差 0.0762 → 0.3510" width={452} color={C.cyan} valueW={210} />
            </Card>
            <Card label="不能说" accent={C.coral} style={{ width: 500 }}>
              <Row name="更准" value="不成立" note="两者都没打过持久化基线" width={452} color={C.coral} valueW={210} />
              <Row name="AR 一定差" value="不成立" note="F≤6 时两者差不到 2%" width={452} color={C.coral} valueW={210} />
              <Row name="√F 是规律" value="只是直觉" note="它只是一个上界，不是定理" width={452} color={C.coral} valueW={210} />
            </Card>
          </div>
          <Card label="结论的范围，和数据的范围一样大" accent={C.amber} style={{ marginTop: 18, width: 1020 }} pad={18}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              一只股票、一个时间段、一个编码器。换掉任何一样，这两条曲线都该重新量一遍。
            </div>
          </Card>
        </div>
        <Foot>结论的范围，和数据的范围一样大。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
