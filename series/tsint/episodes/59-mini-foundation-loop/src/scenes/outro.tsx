import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { CurveChart } from "../figs";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>回答开头：<br />能，但只在重建上。</Body>
          <Body style={{ marginTop: 26 }}>
            模型能不能自己学出表示？在小规模上，能。遮住三成，二十轮，六十四秒。验证误差降到两成。但表示有用，不等于能预测。
            这是本集的主结论，也是「基础模型」这四个字的边界。下一步，是把表示用来解码。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="能" v="学表示" color={C.cyan} />
            <KV k="不能" v="预测收益" color={C.coral} />
            <KV k="成本" v="64 秒" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="一句话结论" accent={C.cyan}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, lineHeight: 1.45, color: C.ink }}>
              遮住三成，只学形状；<br />
              形状能还原窗口，<br />
              却不能替我们预测未来。
            </div>
            <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
              <Chip color={C.cyan}>重建 0.2067</Chip>
              <Chip color={C.coral}>预测 1.0643</Chip>
              <Chip color={C.inkFaint}>探测 0.1364</Chip>
            </div>
          </Card>
        </div>
        <Foot>一句话说完，再收数字。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下一集：<br />自回归与非自回归。</Body>
          <Body style={{ marginTop: 26 }}>
            误差会怎么随步数累积？自回归一步一步走，每一步的误差灌进下一步。非自回归一口气输出全部，误差不累积，但会抹平尖峰。
            两条曲线会在某个地平线交叉。我们用真实数据把交叉点找出来，还会量一次推理耗时。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="对比" v="AR vs NAR" color={C.cyan} />
            <KV k="量" v="误差-步数" color={C.violet} />
            <KV k="还会量" v="推理耗时" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="两条误差路径，一个交叉点" accent={C.violet}>
            <Row name="自回归" value="一步一填" note="误差逐级累积，长程生成质量高" width={1000} color={C.cyan} />
            <Row name="非自回归" value="一次全填" note="误差不累积，但平行位置互相独立" width={1000} color={C.violet} />
            <Row name="累积" value="随步数增长" note="粗略按步数的平方根量级" width={1000} color={C.amber} />
            <Row name="交叉" value="某个地平线" note="短程 NAR 便宜，长程 AR 更准" width={1000} color={C.cyan} />
            <Row name="下一集" value="第六十集" note="真实数据 + 推理计时" width={1000} color={C.coral} />
          </Card>
        </div>
        <Foot>下一集，换个问题：误差怎么累积。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>把数字再收一遍。</Body>
          <Body style={{ marginTop: 26 }}>
            数据六千六百个收盘，五千个窗口，三千加一千加一千。掩码一百五十四。编码器六万六千一百一十三，线性头一千三百，总参数六万七千四百一十三。
            训练二十轮，最佳十九，验证损失比零点二零六七。这些数字都在屏幕上。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="窗口" v="3,000 / 1,000 / 1,000" color={C.cyan} />
            <KV k="参数" v="67,413" color={C.violet} />
            <KV k="最佳轮" v="19" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="本集数字卡" accent={C.cyan}>
            <Row name="数据" value="6,600 收盘" note="1998-11-25 至 2026-10-28" width={1000} color={C.cyan} />
            <Row name="窗口" value="5,000 个" note="训 3,000 / 验 1,000 / 测 1,000，各隔 512 点" width={1000} color={C.violet} />
            <Row name="掩码" value="154" note="512 点中的 30%，9 段整遮 + 1 段前 10 点" width={1000} color={C.amber} />
            <Row name="编码器" value="66,113" note="512→64→512，含 1 个可学习掩码标量" width={1000} color={C.cyan} />
            <Row name="线性头" value="1,300" note="(64 + 1) × 20，冻结表示上只解一次" width={1000} color={C.violet} />
            <Row name="训练" value="20 轮 / 64 秒" note="最佳第 19 轮，验证损失比 0.2067" width={1000} color={C.amber} />
          </Card>
        </div>
        <Foot>数字都在屏幕上，可逐个复算。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>四条线，<br />都在一附近。</Body>
          <Body style={{ marginTop: 26 }}>
            零样本一点零零零零，五样本一点三一六四，十样本一点零九七五，一百样本一点零六四三。基线是一，越低越好。四条线都在一附近。
            这就是「打不过基线」。我们不修饰这张图，它是本集最诚实的一页。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="k=0" v="1.0000" color={C.inkFaint} />
            <KV k="k=5" v="1.3164" color={C.amber} />
            <KV k="k=100" v="1.0643" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="相对 MAE：越低越好，1.0 是基线" accent={C.coral}>
            <CurveChart />
          </Card>
        </div>
        <Foot>最诚实的一页，往往最不好看。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>复现只要<br />三条命令。</Body>
          <Body style={{ marginTop: 26 }}>
            第一条跑证据，第二条跑单测，第三条跑视频流水线。仓库里有完整参数。数据、代码、证据分三次提交，每一集都能单独回退。
            这是工程化的意义。这一集就讲到这里，谢谢观看。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="证据" v="34/34" color={C.cyan} />
            <KV k="单测" v="39/39" color={C.violet} />
            <KV k="提交" v="三次" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三条命令" accent={C.cyan}>
            <div style={{ fontFamily: FONT.mono, fontSize: 20, lineHeight: 2.05, color: C.inkDim, whiteSpace: "pre" }}>
              {"cabal run tsbase -- evidence-ch07-minifoundation\ncabal test\nnode scripts/make.mjs --film tsint-59-mini-foundation-loop"}
            </div>
            <div style={{ marginTop: 18 }}>
              <Row name="数据" value="ts-admin 导出" note="CSV + manifest，sha256 与行数入账" width={1000} color={C.cyan} />
              <Row name="代码" value="ts-base 三模块" note="39 条单测，纯函数，无 IO" width={1000} color={C.violet} />
              <Row name="证据" value="34 项检查" note="固定命令 + 硬编码期望值" width={1000} color={C.amber} />
              <Row name="成片" value="本集" note="讲稿、字幕、静帧、音量、交付" width={1000} color={C.cyan} />
            </div>
          </Card>
        </div>
        <Foot>这一集就讲到这里，谢谢观看。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
