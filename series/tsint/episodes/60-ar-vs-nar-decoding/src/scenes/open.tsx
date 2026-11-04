import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmt2, fmt4, pagesOf } from "../shared";
import { ErrorHorizon, TwoPaths } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一步一步，<br />还是一口气。</Body>
          <Body style={{ marginTop: 26 }}>
            预测未来二十天，有两种解码方式。自回归一步一步走：每走一步，都把自己的输出塞回输入。非自回归一口气吐出来：一次矩阵乘法，
            直接给出二十个点。这不是模型结构之争，是解码方式之争。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="自回归" v="20 次前向" color={C.cyan} />
            <KV k="非自回归" v="1 次前向" color={C.violet} />
            <KV k="地平线" v="F = 1…20" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一个编码器 · 同一个窗口 · 只换最后一步" accent={C.cyan}>
            <TwoPaths />
          </Card>
        </div>
        <Foot>两条路都从同一个六十四维表示出发。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>解码方式决定<br />两件事。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，误差怎么长：回灌会让每一步的误差进入下一步的输入。第二，算力怎么花：二十次前向，每次都要复制一遍五百一十二点的窗口。
            非自回归没有累积，但二十个点之间也不再有条件依赖。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="误差结构" v="累积" color={C.coral} />
            <KV k="算力" v="20 × 复制" color={C.amber} />
            <KV k="代价" v="无依赖" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <Card label="误差怎么长" accent={C.coral} style={{ width: 500 }}>
              <Row name="回灌" value="自己的输出" width={452} color={C.coral} valueW={240} />
              <Row name="走向" value="滚雪球" width={452} color={C.coral} valueW={240} />
              <Row name="预期" value="单调增长" width={452} color={C.coral} valueW={240} />
            </Card>
            <Card label="算力怎么花" accent={C.amber} style={{ width: 500 }}>
              <Row name="二十次" value="20 次前向" width={452} color={C.amber} valueW={240} />
              <Row name="窗口复制" value="20 × 512 点" width={452} color={C.amber} valueW={240} />
              <Row name="一次派" value="1 次前向" width={452} color={C.amber} valueW={240} />
            </Card>
          </div>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.6 }}>
            书里的直觉：两条曲线在中间交叉——短地平线上 AR 有优势，长地平线上 NAR 更稳。本集的任务，就是把这个交叉点量出来。
          </div>
        </div>
        <Foot>问题不是哪个更先进，而是各自在哪一段地平线上赢。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四个数，<br />先钉住。</Body>
          <Body style={{ marginTop: 26 }}>
            一百九十七个测试窗口，地平线从一走到二十。第二十步，自回归的相对误差是一点五六四七，非自回归是一点二九三二。
            两条曲线在第八步交叉。同样一批窗口，非自回归快十五点七倍。四组数都来自同一条命令，十八项检查全过。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="窗口" v="197" color={C.cyan} />
            <KV k="交叉" v="F = 8" color={C.amber} />
            <KV k="加速" v={fmt2(M.timing.ratio) + "×"} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="AR · F=20" value={fmt4(M.ar.rel20)} sub="相对误差 · 回灌二十步" accent={C.cyan} style={{ width: 240 }} valueColor={C.cyan} />
            <Stat label="NAR · F=20" value={fmt4(M.nar.rel20)} sub="相对误差 · 一次前向" accent={C.violet} style={{ width: 240 }} valueColor={C.violet} />
            <Stat label="交叉点" value={"F = " + M.crossing} sub="之后 NAR 稳定领先" accent={C.amber} style={{ width: 240 }} valueColor={C.amber} />
            <Stat label="耗时比" value={fmt2(M.timing.ratio) + "×"} sub="NAR 更快" accent={C.coral} style={{ width: 240 }} valueColor={C.coral} />
          </div>
          <Card label="误差随地平线：三条曲线" accent={C.cyan} style={{ marginTop: 16, width: 1020 }} pad={18}>
            <ErrorHorizon width={980} height={288} legend={false} />
          </Card>
          <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.coral }}>
            注意：两个相对误差都大于一——都还没打过最简单的基线。这句话留到边界页。
          </div>
        </div>
        <Foot>两个数都大于一，这本身就是结论的一部分。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>接下来<br />分八场。</Body>
          <Body style={{ marginTop: 26 }}>
            先把问题摆出来，再给定义，然后定度量、写实现、摊开证据、讲边界，最后收束。每一屏上的数字都能由仓库里的一条命令复现。
            看完整集，你能自己搭这两条解码路，也能自己量它们。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>290 秒证据</Chip>
            <Chip color={C.amber}>18 项检查</Chip>
            <Chip color={C.violet}>闭式解 · 无随机</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="八场路线" accent={C.cyan} style={{ width: 1020 }}>
            <Row name="01 问题" value="误差为什么会成长" note="回灌、√F 的上界直觉、三条预期" width={972} color={C.cyan} valueW={300} />
            <Row name="02 定义" value="递推 vs 一次" note="三个纯函数接口、曝光偏差、1,320 个参数" width={972} color={C.cyan} valueW={300} />
            <Row name="03 度量" value="相对误差与基线" note="持久化基线、MAE 口径、197 / 3,418 / 1,000" width={972} color={C.cyan} valueW={300} />
            <Row name="04 实现" value="两个模块 143 行" note="rollout、直连消融、计时的垃圾回收坑" width={972} color={C.cyan} valueW={300} />
            <Row name="05 验证" value="十八项全过" note="曲线、参数、确定性、耗时、曝光偏差" width={972} color={C.cyan} valueW={300} />
            <Row name="06 边界" value="两条都没赢" note="都大于一，√F 的放大没有出现" width={972} color={C.coral} valueW={300} />
            <Row name="07 收束" value="指向下一集" note="从解码器到分布：分位损失" width={972} color={C.violet} valueW={300} />
          </Card>
        </div>
        <Foot>先从一个具体的困境说起。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
