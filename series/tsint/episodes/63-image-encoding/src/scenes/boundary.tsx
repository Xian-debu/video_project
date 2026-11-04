import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四条<br />能说的。</Body>
          <Body style={{ marginTop: 26 }}>
            格拉姆角场可逆，除整体反射之外逐位可还原——这条是数学事实，不是实验结果。转移场保留转移结构；
            图像特征不输三个数字；两者都赢朴素基线。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="能说 · 四条" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Row name="角场可逆" value="逐位" note="对角 + 第一行反解；只差整体反射，误差 1.3e−14" width={962} color={C.cyan} valueW={280} />
            <Row name="转移场保结构" value="行和为 1" note="W 是概率分布；给定 W 与状态序列，图像逐位重放" width={962} color={C.violet} valueW={280} />
            <Row name="图不输数字" value="打平" note={"图 " + fmt4(M.vision.maeImage) + " 对数字 " + fmt4(M.vision.maeContext) + "，差距在噪声内"} width={962} color={C.amber} valueW={280} />
            <Row name="两者都赢基线" value={fmt4(M.vision.maePersist)} note="朴素基线把下一天当零收益" width={962} color={C.inkDim} valueW={280} />
          </Card>
        </div>
        <Foot>能说的四条，都是可验证的。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四条<br />不能说的。</Body>
          <Body style={{ marginTop: 26 }}>
            不能说「图像化都不丢信息」——转移场就丢；不能说「图像特征更强」——它没有赢；不能说这些数可以搬走；
            也不能说一百二十四个样本够了。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="不能说 · 四条" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="都不丢信息" value="不能" note="转移场只保结构：同一张图可能来自不同序列" width={962} color={C.coral} valueW={280} />
            <Row name="图更强" value="不能" note="测试误差只差万分之四，方向还偏向数字那一侧" width={962} color={C.coral} valueW={280} />
            <Row name="数可以搬走" value="不能" note="换股票、换市场、换窗口，绝对值都会变" width={962} color={C.coral} valueW={280} />
            <Row name="124 样本够" value="不能" note="单一切分、五档网格，万分之四的差在噪声里" width={962} color={C.coral} valueW={280} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8 }}>
            所以这一集不给「图更好」的结论，只给「图不更差」的结论。这两句话差得很远。
          </div>
        </div>
        <Foot>边界写清楚，结论才站得住。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>还有一条<br />结构性限制。</Body>
          <Body style={{ marginTop: 26 }}>
            窗口三十二个点，图就是三十二乘三十二；池化到八乘八，只剩六十四个格子。信息在池化里被压掉。
            再加上单一切分、一只股票两段时期——这些条件下结论才成立。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.coral}>窗口 32</Chip>
            <Chip color={C.amber}>池化 8×8</Chip>
            <Chip color={C.violet}>单一切分</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="结论的适用条件" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="窗口" value="32 点" note="图是 32×32；池化到 8×8 后只剩 64 个格子" width={962} color={C.cyan} valueW={240} />
            <Row name="切分" value="单一切分" note="60 / 29 / 35，没有交叉验证" width={962} color={C.amber} valueW={240} />
            <Row name="正则" value="五档网格" note="1 到 1e4，只按验证段选" width={962} color={C.violet} valueW={240} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8 }}>
            窗口决定图像大小，池化压掉细节，切分决定样本量——这三条是结构限制，不是参数没调好。
          </div>
        </div>
        <Foot>信息在池化里被压掉。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>最后一条<br />边界：数据。</Body>
          <Body style={{ marginTop: 26 }}>
            一只股票，两段时期。百分比对数收益，日频；除了隔夜跳空，没有别的机制变化。
            这些条件下结论成立；出了这些条件，结论待验证。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>一只股票</Chip>
            <Chip color={C.amber}>两段时期</Chip>
            <Chip color={C.violet}>日频</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="数据与结论" accent={C.coral} style={{ width: 1010 }} pad={20}>
            <Row name="股票" value="一只" note="sz000001，两段不重叠的时期" width={962} color={C.cyan} valueW={240} />
            <Row name="频率" value="日频" note="百分比对数收益；没有日内数据" width={962} color={C.amber} valueW={240} />
            <Row name="时期" value="2015–19 · 2016" note="画图窗与预测段都在这两段里" width={962} color={C.violet} valueW={300} />
            <Row name="结论" value="条件内成立" note="出了这些条件，结论待验证——只搬方法，不搬数字" width={962} color={C.inkDim} valueW={240} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8 }}>
            这比「图像化有用」更诚实，也更接近工程上真正要问的问题：这套表示，在我的数据上值不值。
          </div>
        </div>
        <Foot>这一场收束。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
