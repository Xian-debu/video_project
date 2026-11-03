import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个数，<br />三句话。</Body>
          <Body style={{ marginTop: 24 }}>
            百分之一的预算；二百零一次的评估；不到百分之一的真实全距。机器能省，但省下来的评估不一定买到更好的架构。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="预算" v="1%" color={C.cyan} />
            <KV k="比较器" v="201" color={C.violet} />
            <KV k="全距" v={M.real.spreadPct.toFixed(4) + "%"} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="三句话，各自有读数" accent={C.cyan}>
            <Row name="第一" value="机制成立" note="三种策略都在同一套预算下跑通" width={980} color={C.cyan} />
            <Row name="第二" value="合成上抬升" note="比随机高零点一零到零点一四" width={980} color={C.violet} />
            <Row name="第三" value="真实上持平" note={"全距 " + M.real.spreadPct.toFixed(4) + "%，最好只低万分之三"} width={980} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>机制成立</Chip>
            <Chip color={C.coral}>收益不成立</Chip>
          </div>
        </div>
        <Foot>百分之一的预算，换来的是一句诚实的负结果。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>这一集<br />交付了什么。</Body>
          <Body style={{ marginTop: 24 }}>
            三个模块、二十七条单测、三十三项证据、一集成片。所有读数一条命令复现；不需要 GPU，不需要联网。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="交付清单" accent={C.cyan}>
            <Row name="三个模块" value="385 行" note="子空间 / 比较器 / 组合预测器" width={1010} color={C.cyan} />
            <Row name="新增单测" value="27 条" note="黄金值、边界、预算" width={1010} color={C.violet} />
            <Row name="证据检查" value="33 项" note="六组，一条命令，四点八一秒" width={1010} color={C.amber} />
            <Row name="判断" value="一条" note="合成上抬升，真实上持平" width={1010} color={C.coral} />
            <Row name="成片" value="36 页 / 360 行" note="1920×1080，八场" width={1010} color={C.inkDim} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            复现命令写在 plan 里；数据路径、提交号、读数表一一对应。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三种策略，<br />三个假设。</Body>
          <Body style={{ marginTop: 24 }}>
            子空间假设好点聚集，比较器假设次序可学，组合预测器假设块内同质。合成空间满足它们，真实任务不满足——差别就在这里。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="假设与结果" accent={C.violet}>
            <Row name="子空间" value="好点聚集" note={"合成：抬升 " + fmt4(M.synth.gaps.cherry) + "；盒子缩到 0.0005 体积"} width={1010} color={C.cyan} />
            <Row name="比较器" value="次序可学" note={"合成：抬升 " + fmt4(M.synth.gaps.cmp) + "；200 对样本够用"} width={1010} color={C.violet} />
            <Row name="组合预测器" value="块内同质" note={"合成：抬升 " + fmt4(M.synth.gaps.comb) + "；8 块留 4 块"} width={1010} color={C.amber} />
            <Row name="真实任务" value="都不满足" note="次日收益没有可学信号，假设落空" width={1010} color={C.coral} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            抬升是真实的，幅度是小的；假设一旦不成立，抬升就消失。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>会省钱，<br />也要会认输。</Body>
          <Body style={{ marginTop: 28 }}>
            省评估是工程问题，找到更好的架构是科学问题。这一集把前一半做实了，后一半诚实地报告为「没有」。
          </Body>
          <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>省算力</Chip>
            <Chip color={C.amber}>可复现</Chip>
            <Chip color={C.coral}>负结果</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 780, top: 340, width: 1060 }}>
          <Card label="两条结论，不能互相替代" accent={C.cyan} pad={30}>
            <Row name="省评估" value="成立" note="33 项检查里有一半在证这一点" width={940} color={C.cyan} />
            <Row name="找对架构" value="不成立" note="真实任务的读数不支持" width={940} color={C.coral} />
            <Row name="写法" value="分开报告" note="不因为一个失败就否定另一个" width={940} color={C.violet} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>还留三个问题。</Body>
          <Body style={{ marginTop: 24 }}>
            换成有信号的任务，策略会不会真的赢？预算再压到一百次，还能不能排序？把合成空间换成真实搜索空间，抬升还在不在？
          </Body>
          <Body style={{ marginTop: 20, color: C.inkFaint }}>
            这三个问题都没有在本集回答；它们属于更大的实验。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1130 }}>
          <Card label="留给下一集和以后" accent={C.amber}>
            <Row name="问题一" value="有信号的任务" note="换一个能预测的任务，再测三种策略" width={1010} color={C.cyan} />
            <Row name="问题二" value="更小预算" note="一百次评估以内，比较器还排得动吗" width={1010} color={C.violet} />
            <Row name="问题三" value="真实搜索空间" note="10^20 量级上，子空间假设还成立吗" width={1010} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            本集做到这里：机制、合成读数、真实负结果，三样都能复现。
          </div>
        </div>
        <Foot>下一集：把训练铺开，看分布式与并行。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
