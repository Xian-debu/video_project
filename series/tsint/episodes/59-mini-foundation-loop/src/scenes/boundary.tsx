import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, Verdict, fmt4, pagesOf } from "../shared";
import { CurveChart } from "../figs";

export const BoundaryScene: React.FC = () => (
  <Scene id="boundary">
    <SceneHead id="boundary" />
    <Pages id="boundary" at={pagesOf("boundary")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>现在讲边界。</Body>
          <Body style={{ marginTop: 26 }}>
            计划书说相对误差能降到零点九以下。实测是一点零六四三。差得不多，但方向反了。这不是实现 bug：换二十只股票，仍然是这个数。
            所以本集按负结果讲。不修饰，也不改口径。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="计划" v={"< 0.9"} color={C.inkFaint} />
            <KV k="实测" v="1.0643" color={C.coral} />
            <KV k="跨股票" v="1.0960" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="四条线：计划在 0.9 以下，实测都贴着 1" accent={C.coral}>
            <CurveChart />
          </Card>
        </div>
        <Foot>方向反了，就照实说方向反了。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>为什么打不过？<br />三个原因。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，二十天收益本来就难预测。第二，线性头容量有限。第三，我们的目标定义粗糙。二十天收益的信噪比极低，日线收益接近随机游走，
            线性模型很难赢过「未来等于现在」。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="信噪比" v="极低" color={C.coral} />
            <KV k="基线" v="随机游走" color={C.amber} />
            <KV k="头" v="线性" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="标签重叠：五千个窗口，有效样本远少于五千" accent={C.amber}>
            <Row name="窗口数" value="3,000 训练" note="相邻窗口只错开一天，未来二十天大段重合" width={1000} color={C.cyan} />
            <Row name="重叠" value="20 天中的 19 天" note="相邻两个样本共享 95% 的目标期" width={1000} color={C.coral} />
            <Row name="后果一" value="验证偏乐观" note="验证集与训练集的目标高度相关" width={1000} color={C.amber} />
            <Row name="后果二" value="预测不准" note="重叠不增加信息量，只让数字好看" width={1000} color={C.violet} />
            <Row name="结论" value="必须写明" note="不写清楚，就是自欺欺人" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>先承认标签重叠，再谈模型好坏。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一个反例：<br />探测很强，预测很弱。</Body>
          <Body style={{ marginTop: 26 }}>
            线性探测相对误差零点一三六四，看起来表示很强。但它还原的是窗口本身。窗口是平滑的日线，八成六的方差来自低频形状。
            这部分信息对预测未来帮助有限。「表示有信息」与「信息能预测」，是两个不同的问题。本集把两者分开测。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="探测" v="还原窗口" color={C.cyan} />
            <KV k="预测" v="预测未来" color={C.coral} />
            <KV k="结论" v="两件事" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="同一份表示，两个任务，两种命运" accent={C.violet}>
            <Row name="探测任务" value="还原 512 点窗口" note="目标在窗口内，低频形状占大头" width={1000} color={C.cyan} />
            <Row name="探测结果" value="0.1364" note="86% 方差线性可还原" width={1000} color={C.cyan} />
            <Row name="预测任务" value="未来 20 天收益" note="目标在窗口外，信噪比低" width={1000} color={C.coral} />
            <Row name="预测结果" value="1.0643" note="打不过 persistence" width={1000} color={C.coral} />
            <Row name="解释" value="形状不是未来" note="学的是形状，形状对预测的边际价值有限" width={1000} valueW={340} color={C.violet} />
          </Card>
        </div>
        <Foot>「有信息」不等于「有用」。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>真正的时序<br />基础模型要什么？</Body>
          <Body style={{ marginTop: 26 }}>
            更多股票，更多年份，更长的上下文。注意力结构，而不是两层全连接。更大的容量与更长的训练。
            还需要严格的时间切分。本集只做了最小闭环。规模不是这一集的主题，流程和口径才是。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="数据" v="20 只" color={C.cyan} />
            <KV k="结构" v="两层 MLP" color={C.amber} />
            <KV k="上下文" v="512 点" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="从最小闭环到基础模型，缺的五样" accent={C.cyan}>
            <Row name="宽度" value="20 只 → 全市场" note="横截面信息是收益预测的主要来源" width={1000} color={C.cyan} />
            <Row name="长度" value="27 年日线" note="已用满；还需要分钟级与更早年份" width={1000} color={C.violet} />
            <Row name="上下文" value="512 → 数千" note="跨股票的注意力，而不是单窗自编码" width={1000} color={C.amber} />
            <Row name="结构" value="MLP → 注意力" note="本集故意只用最小结构" width={1000} color={C.cyan} />
            <Row name="训练" value="64 秒 → 数天" note="容量与数据上去，训练预算也得上去" width={1000} color={C.violet} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            这些不是本集能回答的；本集只证明流程跑得通、口径守得住。
          </div>
        </div>
        <Foot>规模不是主题，可复现才是。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三个坑，<br />都写成了检查。</Body>
          <Body style={{ marginTop: 26 }}>
            第一，支持集绝不能碰测试集。我们从训练池抽，断言交集为空。第二，三档必须共用测试块，否则几档之间的比较没有意义。
            第三，标准化只能在窗口内做。用了全样本均值就是泄漏。这三条都写成了检查，任何一条破了，结论作废。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="支持集" v="只看池" color={C.cyan} />
            <KV k="测试块" v="三档共用" color={C.violet} />
            <KV k="标准化" v="窗口内" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三条不能破的规矩" accent={C.amber}>
            <Row name="规矩一" value="支持集从训练池抽" note="并断言与测试集交集为空" width={1000} color={C.cyan} />
            <Row name="规矩二" value="三档共用一个测试块" note="只换支持集，不换考卷" width={1000} valueW={420} color={C.violet} />
            <Row name="规矩三" value="标准化只用窗口内统计量" note="全样本均值、方差都算泄漏" width={1000} valueW={420} color={C.amber} />
            <Row name="写进代码" value="shotSplit 的断言" note="k 超池、重复数非法、交集非空，全部报错" width={1000} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>交集空</Chip>
            <Chip color={C.violet}>同考卷</Chip>
            <Chip color={C.amber}>窗口内标准化</Chip>
          </div>
        </div>
        <Foot>任何一条破了，结论作废。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>能说什么，<br />不能说什么。</Body>
          <Body style={{ marginTop: 26 }}>
            能说：三个模块实现正确，三十九条单测、三十四项检查全过；掩码重建在小模型上有效；冻结表示里确实有信息。
            不能说：预训练能提高交易收益；这个方法能推广到别的市场；零点九是可达的目标。本集没有做到。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="能说" v="4 条" color={C.cyan} />
            <KV k="不能说" v="3 条" color={C.coral} />
            <KV k="边界" v="写清楚" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="能说（青）与不能说（红）" accent={C.coral}>
            <Row name="能说" value="模块正确" note="39 条单测、34 项检查全过" width={1000} color={C.cyan} />
            <Row name="能说" value="重建有效" note="固定掩码损失比 0.2067" width={1000} color={C.cyan} />
            <Row name="能说" value="表示有信息" note="线性探测 0.1364" width={1000} color={C.cyan} />
            <Row name="不能" value="提高交易收益" note="相对 MAE 1.0643，没赢过基线" width={1000} color={C.coral} />
            <Row name="不能" value="推广到别的市场" note="只测了 20 只 A 股" width={1000} color={C.coral} />
            <Row name="不能" value="0.9 可达" note="计划目标未实现" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
            <Verdict ok={true} label="实现正确" />
            <Verdict ok={false} label="预测无效" />
            <span style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>两句话都要说，才叫结论。</span>
          </div>
        </div>
        <Foot>边界写清，结论才站得住。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
