import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { F1Quad, SpikeDriftIntro } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>两种错，<br />两条路。</Body>
          <Body style={{ marginTop: 26 }}>
            尖峰是一天的事，漂移是六十天的事。一个检测器很难同时把两者都看清——这一集量的就是它们各自的适用边界，
            以及边界为什么长在这里。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="尖峰" v="6σ · 1 天" color={C.coral} />
            <KV k="漂移" v="2σ · 60 天" color={C.cyan} />
            <KV k="方法" v="2 种" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一段测试序列 · 两处被动过的地方" accent={C.cyan} style={{ width: 1010 }}>
            <SpikeDriftIntro width={950} height={250} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 980 }}>
            左边是第 200 天的一处尖峰，右边是从第 120 天起的一段漂移。两处注入都直接加在标准化之后的 z 分数上。
          </div>
        </div>
        <Foot>一条曲线，两处被动过的地方。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>答案先<br />摆出来。</Body>
          <Body style={{ marginTop: 26 }}>
            把两种异常分别喂给两个检测器：预测残差的阈值，和自编码器的重构分。结果并不一致——一个在尖峰上压倒，
            一个在漂移上反超。这两个数不是误差，是两种方法的边界。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="尖峰 · 预测" v={fmt4(M.pred.spikeF1)} color={C.cyan} />
            <KV k="漂移 · 重构" v={fmt4(M.recon.driftF1)} color={C.violet} />
            <KV k="Ae 参数" v={M.recon.params} color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一批注入点 · 两组 F1" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <F1Quad width={940} height={330} />
          </Card>
        </div>
        <Foot>两个数不是误差，是两种方法的边界。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一个阈值，<br />量不了两种错。</Body>
          <Body style={{ marginTop: 26 }}>
            大多数人只训一个检测器、定一个阈值，然后用它量所有异常。可尖峰在残差眼里是六倍标准差，在重构眼里只是一个点
            错了三十二分之一；漂移正好反过来。尺子选错，漏掉的不是一点。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="一把尺子的四种后果" accent={C.coral} style={{ width: 1010 }}>
            <Row name="单检测器" value="只认一种" note="训练一个分数，定一个阈值，对所有异常一视同仁" width={962} color={C.coral} valueW={280} />
            <Row name="尖峰在残差里" value="6σ" note="一天一个数，逐点比较就能顶到阈值以上" width={962} color={C.cyan} valueW={280} />
            <Row name="尖峰在重构里" value="1 / 32" note="窗口里只错一个点，均方误差被摊薄" width={962} color={C.violet} valueW={280} />
            <Row name="漂移在残差里" value="2σ" note="每天只偏 2σ，落在厚尾阈值之下" width={962} color={C.amber} valueW={280} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 990 }}>
            同一个异常，两种分数看到的大小并不相同。这就是为什么需要两把尺子。
          </div>
        </div>
        <Foot>尺子选错，漏掉的不是一点。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>接下来<br />分八场。</Body>
          <Body style={{ marginTop: 26 }}>
            先摆问题，再给定义，然后钉数据、量两边、写实现、过检查、讲边界，最后收束。每一屏的数字都能由仓库里的一条命令复现。
            看完整集，你能自己训一个检测器，也能自己量它在两种异常上的上限。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>{M.code.totalLines} 行实现</Chip>
            <Chip color={C.amber}>{M.summary.total} 项检查</Chip>
            <Chip color={C.violet}>纯函数 · 种子写死</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="八场路线" accent={C.cyan} style={{ width: 1010 }} pad={16}>
            {[
              { n: "01", tag: "问题", title: "一条曲线只认一种错", note: "尖峰与漂移，两种形态", color: C.cyan },
              { n: "02", tag: "定义", title: "三个坐标系", note: "残差、因果窗口、自编码器", color: C.cyan },
              { n: "03", tag: "数据", title: "6,599 / 732 / 728", note: "全集、窗口、测试点", color: C.cyan },
              { n: "04", tag: "度量", title: "两种异常各赢一场", note: "F1 四格、阈值、扫描", color: C.cyan },
              { n: "05", tag: "实现", title: "两个模块 251 行", note: "预测残差与重构误差", color: C.cyan },
              { n: "06", tag: "验证", title: "十九项全过", note: "数据、预测、重构、对照", color: C.cyan },
              { n: "07", tag: "边界", title: "检测器不是万能的", note: "幅度、长度、窗口长度", color: C.coral },
              { n: "08", tag: "收束", title: "各管一边", note: "下一集：两把尺子并用", color: C.violet },
            ].map((r) => (
              <div key={r.n} style={{ display: "flex", alignItems: "baseline", borderTop: "1px solid " + C.panelLine, padding: "11px 0" }}>
                <div style={{ width: 170, flexShrink: 0, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{r.n} {r.tag}</div>
                <div style={{ width: 430, flexShrink: 0, fontFamily: FONT.sans, fontSize: FT.h2, color: r.color, lineHeight: 1.25 }}>{r.title}</div>
                <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.note}</div>
              </div>
            ))}
          </Card>
        </div>
        <Foot>先从一条曲线的两处伤口说起。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
