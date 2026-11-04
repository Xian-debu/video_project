import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmt2, pagesOf } from "../shared";
import { SeriesStrip, SplitWindows } from "../figs";

export const MetricsScene: React.FC = () => (
  <Scene id="metrics">
    <SceneHead id="metrics" />
    <Pages id="metrics" at={pagesOf("metrics")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>两段数据，<br />同一只股票。</Body>
          <Body style={{ marginTop: 26 }}>
            第一段一百二十八个点，从二零一六年六月一日到十二月八日，用来画图；第二段一千零二十四个点，
            从二零一五年十月到二零一九年底，用来做预测。单位是百分比对数收益。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="画图" v={M.data.windowRows + " 点"} color={C.cyan} />
            <KV k="预测" v={M.data.seriesRows.toLocaleString() + " 点"} color={C.violet} />
            <KV k="单位" v="% 对数收益" color={C.inkDim} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label={"第一段 · " + M.data.winStart + " → " + M.data.winEnd} accent={C.cyan} style={{ width: 1010 }} pad={16}>
            <SeriesStrip vals={M.series.window} width={950} height={150} color={C.cyan} lo={M.data.winMin} hi={M.data.winMax}
              note="128 个点 · 拉伸后画成 128×128 方阵" />
          </Card>
          <Card label={"第二段 · " + M.data.seriesStart + " → " + M.data.seriesEnd} accent={C.violet} style={{ marginTop: 14, width: 1010 }} pad={16}>
            <SeriesStrip vals={M.series.series1024} width={950} height={150} color={C.violet} lo={M.data.seriesMin} hi={M.data.seriesMax}
              note="1,024 个点 · 切 124 个窗口做预测" />
          </Card>
        </div>
        <Foot>两段数据来自同一只股票，口径也一样。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>一千零二十四个点，<br />切一百二十四个窗。</Body>
          <Body style={{ marginTop: 26 }}>
            窗口三十二个点，步长八。训练六十，验证二十九，测试三十五。窗口重叠，样本不独立——这一点写进边界页。
            特征两种：一百九十二维的图特征，和只有三个数字的尺度特征，两条都加一个截距。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="窗口" v={M.vision.winLen + " 点"} color={C.cyan} />
            <KV k="步长" v={M.vision.stride} color={C.inkDim} />
            <KV k="窗口数" v={M.vision.windows} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="1,024 个点 → 124 个重叠窗口" accent={C.violet} style={{ width: 1010 }} pad={20}>
            <SplitWindows width={950} />
          </Card>
          <Card label="切分与特征" accent={C.cyan} style={{ marginTop: 14, width: 1010 }} pad={18}>
            <Row name="切分" value={M.vision.train + " / " + M.vision.val + " / " + M.vision.test} note="训练 / 验证 / 测试：按时间顺序切，不随机打乱" width={962} color={C.ink} valueW={300} />
            <Row name="图特征" value={M.vision.featureDim + " 维"} note="三个核各池化到 8×8，拼起来；加截距进线性头" width={962} color={C.cyan} valueW={300} />
            <Row name="尺度特征" value={M.vision.ctxDim + " 个数字"} note="末值、均值、标准差；补回被缩放吃掉的尺度" width={962} color={C.violet} valueW={300} />
          </Card>
        </div>
        <Foot>窗口重叠，样本不独立 —— 这句话要记住。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>线性头，<br />闭式解。</Body>
          <Body style={{ marginTop: 26 }}>
            正则强度在验证段上选，网格五档：一、十、一百、一千、一万。图像侧选中一万，数字侧选中一百。
            测试段完全不参与选择——这是「先钉口径」的全部含义。
          </Body>
          <div style={{ display: "flex", marginTop: 28 }}>
            <KV k="图像 λ" v="10000" color={C.cyan} />
            <KV k="数字 λ" v="100" color={C.violet} />
            <KV k="测试段" v="不参与" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="正则强度在这五档里选" accent={C.amber} style={{ width: 1010 }} pad={20}>
            <Row name="网格" value="1 → 1e4" note="五档：1 / 10 / 100 / 1e3 / 1e4，每侧各跑五遍，只看验证误差" width={962} color={C.amber} valueW={200} />
            <Row name="图像侧" value="10000" note="特征多、样本少，需要更强收缩" width={962} color={C.cyan} valueW={360} />
            <Row name="数字侧" value="100" note="三个数字本身已经很稳" width={962} color={C.violet} valueW={360} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.8 }}>
            测试段一次都不碰：不选 λ，不调窗口，不改分箱。屏幕上的测试误差就是「拿去用」时的误差。
          </div>
        </div>
        <Foot>先定口径，再读数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三条口径，<br />三种数法。</Body>
          <Body style={{ marginTop: 26 }}>
            反解误差：反解序列和原序列逐位比，允许整体反射，取两种符号里误差小的那个，报最大值。行和：矩阵与图像
            分别求和。预测：平均绝对误差，单位和收益一样（百分点）。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 790, top: 292, width: 1030 }}>
          <Card label="三个口径 · 都不能含糊" accent={C.cyan} style={{ width: 1010 }} pad={20}>
            <Row name="反解误差" value={M.gaf.inverseMaxErr.toExponential(1).replace("e-", "e−")} note="逐位最大绝对误差；允许整体反射后再比" width={962} color={C.cyan} valueW={300} />
            <Row name="矩阵行和" value={"1.0000"} note="8×8 转移矩阵，八行都是 1" width={962} color={C.violet} valueW={300} />
            <Row name="图像行和" value={M.mtf.imgRowSum.toFixed(4)} note="128×128 图像，每行是 16（= 每箱点数）" width={962} color={C.amber} valueW={300} />
            <Row name="预测误差" value={M.vision.maeImage.toFixed(4)} note={"测试 MAE：图 " + M.vision.maeImage.toFixed(4) + " · 数字 " + M.vision.maeContext.toFixed(4) + " · 基线 " + M.vision.maePersist.toFixed(4)} width={962} color={C.coral} valueW={300} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7, width: 990 }}>
            这些数都由证据程序一条命令跑出来：十九项检查、四个分组、四秒半。
          </div>
        </div>
        <Foot>口径钉死，后面的数才有意义。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
