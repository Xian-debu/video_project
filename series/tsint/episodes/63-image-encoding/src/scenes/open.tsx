import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { Heat, MaeBars, SeriesStrip } from "../figs";

const sci = (v: number) => v.toExponential(1).replace("e-", "e−");

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>把序列<br />画成图。</Body>
          <Body style={{ marginTop: 26 }}>
            一百二十八个数字，画成一张方阵：横着是时间，竖着也是时间。每个格子是两个极角的余弦。
            这一集只问一件事——画成图，丢了多少信息。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="窗口" v={M.gaf.dim + " 点"} color={C.cyan} />
            <KV k="方阵" v={M.gaf.dim + " × " + M.gaf.dim} color={C.violet} />
            <KV k="格子" v="16,384" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="一段收益序列 · 128 个点" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <SeriesStrip vals={M.series.window} width={950} height={200} color={C.cyan}
              note={M.data.winStart + " → " + M.data.winEnd + " · 百分比对数收益"} />
          </Card>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 18 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.inkFaint }}>→</div>
            <Heat m={M.gaf.gasf40} width={300} signed title="同一段序列的格拉姆角场（截取 40×40）" />
            <div style={{ fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8, width: 360 }}>
              整张图是 128×128 = 16,384 个格子。
              <br />
              这里只截 40×40 的一角。
              <br />
              整片偏红：收益都挤在零附近。
              <br />
              横轴与纵轴都是时间，所以它天然对称。
            </div>
          </div>
        </div>
        <Foot>一百二十八个数字，一张方阵。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>答案先<br />摆出来。</Body>
          <Body style={{ marginTop: 26 }}>
            三种画法，三句结论。格拉姆角场几乎不丢信息，反解误差是一点三乘十的负十四次方；转移场保住的是结构，
            不是逐位信息；把图喂给卷积前端，它没有赢过三个数字。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="反解误差" v={sci(M.gaf.inverseMaxErr)} color={C.cyan} />
            <KV k="图像行和" v={M.mtf.imgRowSum} color={C.violet} />
            <KV k="图特征 MAE" v={fmt4(M.vision.maeImage)} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三句结论 · 逐条都能一命令复现" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Row name="格拉姆角场" value="可逆" note={"从对角线加第一行反解，最大误差 " + sci(M.gaf.inverseMaxErr) + "；只差整体反射"}
              width={962} color={C.cyan} valueW={280} />
            <Row name="转移场" value="只保结构" note={"8×8 矩阵行和为 1，128×128 图像行和为 " + M.mtf.imgRowSum + "（= 每箱点数）"}
              width={962} color={C.violet} valueW={280} />
            <Row name="图 vs 数字" value="没赢" note={"图 " + fmt4(M.vision.maeImage) + " 对三个数字 " + fmt4(M.vision.maeContext) + "，差距只有万分之四"}
              width={962} color={C.coral} valueW={280} />
            <Row name="两条都赢基线" value={fmt4(M.vision.maePersist)} note="朴素基线把下一天当零收益，赢它主要靠收缩"
              width={962} color={C.amber} valueW={280} />
          </Card>
        </div>
        <Foot>无损、结构、值不值得 —— 三个问题。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>第三件事：<br />值不值得。</Body>
          <Body style={{ marginTop: 26 }}>
            无损不等于有用。把图喂给卷积前端预测下一天，测试误差一点三九一三；只给三个尺度数字，是一点三九零八。
            图没有赢下来，差距在噪声里。这是一条负结果，我们照实讲。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="图特征" v={fmt4(M.vision.maeImage)} color={C.cyan} />
            <KV k="三个数字" v={fmt4(M.vision.maeContext)} color={C.violet} />
            <KV k="朴素基线" v={fmt4(M.vision.maePersist)} color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="同一批窗口 · 三个 MAE" accent={C.coral} style={{ width: 1010 }} pad={22}>
            <MaeBars width={950} />
          </Card>
          <Card label="为什么照实讲" accent={C.inkDim} style={{ marginTop: 16, width: 1010 }} pad={18}>
            <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, lineHeight: 1.8 }}>
              如果只挑「图能无损还原」来讲，会把二维表示说成稳赚。可工程上要问的是：这张图有没有让下一天预测得更准。
              这一集的答案是没有。没有赢，也没有输 —— 它只是不比三个数字更好。
            </div>
          </Card>
        </div>
        <Foot>负结果也是结果。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>接下来<br />分八场。</Body>
          <Body style={{ marginTop: 26 }}>
            先摆问题，再给定义，然后钉数据、量三件事、写实现、过检查、讲边界，最后收束。屏幕上的每个数都能
            由仓库里的一条命令复现。看完整集，你能自己画一张格拉姆角场，也能自己量它反解到多远。
          </Body>
          <div style={{ display: "flex", marginTop: 28, gap: 10 }}>
            <Chip color={C.cyan}>{M.code.totalLines} 行实现</Chip>
            <Chip color={C.amber}>{M.summary.total} 项检查</Chip>
            <Chip color={C.violet}>纯函数 · 无随机</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="八场路线" accent={C.cyan} style={{ width: 1010 }} pad={16}>
            {[
              { n: "01", tag: "问题", title: "画成图，丢了什么", note: "双射、结构、归纳偏置", color: C.cyan },
              { n: "02", tag: "定义", title: "缩放、极角与状态", note: "极角、和差场、转移矩阵", color: C.cyan },
              { n: "03", tag: "数据", title: "128 / 1,024", note: "一段画图，一段做预测", color: C.cyan },
              { n: "04", tag: "度量", title: "反解、行和、MAE", note: "三条口径，三条基线", color: C.cyan },
              { n: "05", tag: "实现", title: "三个模块 339 行", note: "GAF、MTF、卷积前端", color: C.cyan },
              { n: "06", tag: "验证", title: "十九项四秒半", note: "3 / 5 / 6 / 5 逐条过", color: C.cyan },
              { n: "07", tag: "边界", title: "无损只对一半", note: "递归、负结果、样本量", color: C.coral },
              { n: "08", tag: "收束", title: "把图放回表示", note: "下一集：怎么适配", color: C.violet },
            ].map((r) => (
              <div key={r.n} style={{ display: "flex", alignItems: "baseline", borderTop: "1px solid " + C.panelLine, padding: "11px 0" }}>
                <div style={{ width: 170, flexShrink: 0, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>{r.n} {r.tag}</div>
                <div style={{ width: 430, flexShrink: 0, fontFamily: FONT.sans, fontSize: FT.h2, color: r.color, lineHeight: 1.25 }}>{r.title}</div>
                <div style={{ flex: 1, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkDim }}>{r.note}</div>
              </div>
            ))}
          </Card>
        </div>
        <Foot>先从一句话开始：画成图，不丢信息 —— 只对一半。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
