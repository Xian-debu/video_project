import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, KV, M, PAD, Pages, Row, Stat, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="01 / 问题" title="一条流水线，五个空格" goal="书里只画了结构，不给超参数" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1060 }}>
      <Card label="图 3.5 · 通用卷积预测架构" accent={C.cyan} style={{ height: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
          {["嵌入", "卷积堆叠", "预测头"].map((t, i) => (
            <React.Fragment key={t}>
              <div style={{ padding: "16px 22px", border: "1px solid " + (i === 1 ? C.cyan : C.panelLine), borderRadius: 10, fontFamily: FONT.sans, fontSize: FT.h2, color: i === 1 ? C.cyan : C.inkDim }}>
                {t}
              </div>
              {i < 2 ? <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: C.inkFaint }}>→</div> : null}
            </React.Fragment>
          ))}
        </div>
        <Body size={FT.body} style={{ marginTop: 20 }}>
          输入 X 是窗长乘通道数；卷积在时间轴上滑动；最后接一个预测头，输出未来 F 步。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          图上没有写：卷积堆几层、核多宽、膨胀因子怎么取。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1090, top: 350, width: CW - 1090 }}>
      <Card label="流水线要跑起来，还缺" accent={C.coral} style={{ height: 380 }}>
        <Row name="核宽 K" value="未给" note="决定局部窗口" color={C.coral} width={CW - 1140} />
        <Row name="膨胀因子 d" value="未给" note="决定跨步与感受野" color={C.coral} width={CW - 1140} />
        <Row name="频率个数 k" value="未给" note="书里写「预定义的超参数」" color={C.coral} width={CW - 1140} />
        <Row name="通道数 D" value="未给" note="嵌入维度与隐藏层" color={C.coral} width={CW - 1140} />
        <Row name="训练与预测头" value="未给" note="损失、优化器、轮数、输出层" color={C.coral} width={CW - 1140} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.lead} color={C.ink}>书只给体重，不给身高。所以我们对齐口径，不对齐数字。</Body>
      <div style={{ marginTop: 10 }}><K>五条式子来自 p.49–51；C 级引用，只借结构，不借结论。</K></div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="01 / 问题" title="五个口径，五条检查" goal="把空格填成可断言的定义" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <Card label="每个口径都要能被测试钉住" accent={C.amber}>
        <Row name="因果性怎么保证" value="只左填充" note="两侧都填会读未来；离线指标可能一样，扰动测试能抓到" color={C.cyan} width={CW - 60} />
        <Row name="感受野怎么数" value="按层累加" note="1 + Σ(K − 1)d = 31；不是核宽逐层相乘" color={C.cyan} width={CW - 60} />
        <Row name="周期从哪来" value="FFT 定" note="去直流，取振幅最大的 k 个频率，周期由窗长除频率" color={C.amber} width={CW - 60} />
        <Row name="折叠后哪个轴环形" value="只列方向" note="相位轴环形；周期轴是边界，零填充" color={C.violet} width={CW - 60} />
        <Row name="聚合权重归一化" value="ΣA = 1" note="不归一化，周期数一变输出幅度就变" color={C.coral} width={CW - 60} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 22 }}>
      <Stat label="频率个数" value={"k = " + M.meta.r} accent={C.amber} style={{ width: 560 }} sub={<span>三个周期叠成一个二维网格</span>} />
      <Stat label="折叠形状" value={M.fold.rows + " × " + M.fold.cols} accent={C.violet} style={{ width: 560 }} sub={<span>窗长 96 · 周期 48 · 96 / 48 = 2 行</span>} />
      <Stat label="权重和" value={M.struct.ampSum} accent={C.cyan} style={{ width: 560 }} sub={<span>聚合前的振幅归一化</span>} />
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="01 / 问题" title="一只股票，一百零四天" goal="日内周期只能用日内数据看" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1080 }}>
      <Card label="五分钟线 · sh600519" accent={C.amber} style={{ height: 360 }}>
        <div style={{ display: "flex", gap: 34 }}>
          <div>
            <KV k="样本" v={fmtInt(M.data.minuteRows) + " 根"} note={M.data.days + " 个交易日"} />
            <KV k="每日根数" v={M.data.barsPerDay} note="09:35 → 15:00" color={C.amber} />
          </div>
          <div>
            <KV k="窗口" v={M.data.first.slice(0, 10)} note={M.data.first.slice(11)} />
            <KV k="结束" v={M.data.last.slice(0, 10)} note={M.data.last.slice(11)} />
          </div>
          <div>
            <KV k="最大绝对收益" v={M.data.maxAbsReturn.toFixed(4)} note="单根对数收益" color={C.coral} />
            <KV k="文件" v={Math.round(M.data.bytes / 1024) + " KB"} note={"sha256 " + M.data.sha256.slice(0, 10) + "…"} color={C.inkFaint} />
          </div>
        </div>
        <Body size={FT.body} style={{ marginTop: 22 }}>
          为什么不选日线：日内周期必须用日内数据才可能被看见。
          为什么不选多只股票：这一集测的是结构，不是横截面。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1110, top: 340, width: CW - 1110 }}>
      <Card label="这一集不做什么" accent={C.coral} style={{ height: 360 }}>
        <Body size={FT.h2} color={C.ink}>没有预测头。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          书里没给预测头公式，这一集也不补。所以不报 MAE，不排名，不说谁赢。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          计划书里的「折叠卷积对仅相位卷积」对照，因为没有预测头而取消，后面会再声明一次。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.coral}>scope · 不报误差</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Body size={FT.lead} color={C.ink}>把五个空格填成口径，就可以开始定义了。</Body>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, pageAt("problem", 11), pageAt("problem", 22)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
