import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, Foot, KV, M, PAD, Pages, Row, Scene, SceneHead, fmtInt, pagesOf } from "../shared";
import { MaskStrip, SegmentGrid, TimeSplit } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>为什么要遮？</Body>
          <Body style={{ marginTop: 26 }}>
            日线有价格，没有标签。监督学习要的未来收益，噪声很大。自监督换个思路：输入本身就是答案。
            遮住一部分，让模型补；补得准，说明它懂结构。这跟去噪是同一件事，也是本章「基础模型」的入口。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="监督" v="要标签" color={C.inkFaint} />
            <KV k="自监督" v="输入即答案" color={C.cyan} />
            <KV k="掩码率" v="30%" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="先看数据：一条后复权日线，五百一十二点一个窗口" accent={C.cyan}>
            <MaskStrip />
          </Card>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <Chip color={C.amber}>遮住的是段，不是点</Chip>
            <Chip color={C.cyan}>损失只算掩码位置</Chip>
          </div>
        </div>
        <Foot>把补洞当训练目标。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>六千六百个收盘，<br />五千个窗口。</Body>
          <Body style={{ marginTop: 26 }}>
            数据是平安银行的后复权日线。从一九九八年到二零二六年，六千六百个收盘价。五百一十二点一个窗口，窗口内做标准化：均值零，方差一。
            这样不同年代的波动可比。可用窗口六千零六十九个，我们只用其中五千个：训练三千，验证一千，测试一千。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="收盘" v={fmtInt(M.data.rows)} color={C.cyan} />
            <KV k="窗口" v={fmtInt(M.data.windows)} color={C.amber} />
            <KV k="训练" v={fmtInt(M.data.trainN)} color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="时间切分：0 … 6068" accent={C.cyan}>
            <TimeSplit />
          </Card>
          <Card label="三段互不重叠" accent={C.amber} style={{ marginTop: 14 }} pad={18}>
            <Row name="训练" value="0 – 2999" note="三千个窗口，起点从原始第 0 点算" width={1000} color={C.cyan} />
            <Row name="验证" value="3512 – 4511" note="一千个窗口，前面留 512 点隔离带" width={1000} color={C.amber} />
            <Row name="测试" value="5024 – 6023" note="一千个窗口，再留 512 点" width={1000} color={C.violet} />
          </Card>
        </div>
        <Foot>切分是硬切，不是随机打乱。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>隔离带，<br />留了整整一个窗口。</Body>
          <Body style={{ marginTop: 26 }}>
            三个集合在原始序列上不重叠，中间还留了五百一十二点的隔离带。为什么留这么宽？因为窗口长度就是五百一十二。
            不留隔离带，训练窗的尾巴会伸进验证集。这是时间序列最常见的泄漏。训练止于第三千五百一十一点，验证从三千五百一十二开始。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="隔离带" v="512 点" color={C.amber} />
            <KV k="训练止" v="3511" color={C.cyan} />
            <KV k="验证起" v="3512" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="窗口与原始点的关系：一个窗口覆盖 512 个点" accent={C.coral}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 120 }}>
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} style={{ width: 15, height: 40 + (i % 7) * 9, background: i < 30 ? C.cyan : i < 35 ? C.coral : C.amber, opacity: 0.7, borderRadius: 2 }} />
              ))}
            </div>
            <div style={{ marginTop: 10, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
              训练窗末尾与验证窗开头，至少隔 512 个原始点
            </div>
          </Card>
          <Card label="为什么不能随机切" accent={C.coral} style={{ marginTop: 14 }} pad={18}>
            <Row name="随机切" value="会泄漏" note="相邻窗口大量重叠，验证集不再是「未来」" width={1000} color={C.coral} />
            <Row name="时间切" value="更严格" note="训练只见到验证/测试之前的数据" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>先堵住泄漏，再谈效果。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>按点遮太容易，<br />所以按段遮。</Body>
          <Body style={{ marginTop: 26 }}>
            如果按点随机遮，相邻的点几乎一模一样，看一眼左右就能猜出来。所以按段遮：每段十六个点，五百一十二点正好三十二段。
            遮三成就是一百五十四个点：九个整段，加十个点。画面里那三十二列，就是三十二段。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="段长" v="16" color={C.cyan} />
            <KV k="段数" v="32" color={C.amber} />
            <KV k="被遮" v="154" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="512 点 = 32 段 × 16 点；亮色为被遮位置" accent={C.amber}>
            <SegmentGrid />
          </Card>
        </div>
        <Foot>遮整段，才逼它用上下文，而不是抄邻居。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>154 = 9 × 16 + 10</Body>
          <Body style={{ marginTop: 26 }}>
            一百五十四除以十六：商九，余十。先无放回抽九个整段，再从剩下段里抽一段，只遮它的前十个点。
            所以是三十二段里的十段被动过：九段全遮，一段遮前十个，其余二十二段原样保留。这个数会反复出现。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="整段" v="9 × 16 = 144" color={C.amber} />
            <KV k="余数" v="10" color={C.cyan} />
            <KV k="合计" v="154" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="掩码账：抽段，不是逐点抛硬币" accent={C.cyan}>
            <Row name="段数" value="32" note="512 / 16 整除，没有半段" width={1000} color={C.cyan} />
            <Row name="目标点数" value="154" note="round(0.3 × 512) = round(153.6)" width={1000} color={C.amber} />
            <Row name="整段" value="9" note="154 // 16，无放回抽 9 段" width={1000} color={C.violet} />
            <Row name="余数" value="10" note="154 % 16，再抽一段遮前 10 点" width={1000} color={C.coral} />
            <Row name="校验" value="9×16 + 10 = 154" note="证据里逐段核对：9 段满、1 段前 10、其余 0" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>本集的第一个验收数字。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>遮住的位置，<br />填什么？</Body>
          <Body style={{ marginTop: 26 }}>
            最直接的想法是填零。但 A 股的零有含义：收盘价为零，通常表示停牌。填零等于告诉模型「这里停牌了」，语义就错了。
            所以我们用一个可学习的向量，书里叫 mask token。它和权重一起训练，只占一个参数。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="填零" v="语义错" color={C.coral} />
            <KV k="mask token" v="1 个参数" color={C.cyan} />
            <KV k="一起训练" v="是" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="同样被遮，两种填法的含义完全不同" accent={C.coral}>
            <Row name="填 0" value="0.0000" note="在 A 股语义里，0 收盘 = 停牌；模型会学到错误的先验" width={1000} color={C.coral} />
            <Row name="mask token" value="可学习" note="一个标量，和 W1/W2/偏置一起用梯度更新" width={1000} color={C.cyan} />
            <Row name="初始化" value="与输入同尺度" note="不参与重建的输入，只负责占位" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
            mask token 在参数账里只有 1 个：66,113 = 512×64 + 64 + 64×512 + 512 + 1
          </div>
        </div>
        <Foot>语义比数值重要。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>为什么模型这么小？<br />为什么用线性头？</Body>
          <Body style={{ marginTop: 26 }}>
            这一集要讲清闭环，不是刷榜。五百一十二到六十四，再回五百一十二；一个隐层，六万六千一百一十三个参数。单机一分钟能训完，流程才是重点。
            预训练完，表示是冻结的，只接一层线性映射：能预测，就说明表示有用。微调也能变好，但证明不了表示本身。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="编码器" v="66,113" color={C.cyan} />
            <KV k="线性头" v="1,300" color={C.violet} />
            <KV k="总参数" v="67,413" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="参数账：计划与实际" accent={C.violet}>
            <Row name="编码器（实算）" value={fmtInt(M.params.enc)} note="512×64 + 64 + 64×512 + 512 + 1" width={1000} color={C.cyan} />
            <Row name="编码器（计划）" value={fmtInt(M.params.planEnc)} note="计划书口径，差 257：偏置与 mask 标量的记法" width={1000} color={C.inkFaint} />
            <Row name="线性头" value={fmtInt(M.params.head)} note="(64 + 1) × 20 = 1,300" width={1000} color={C.violet} />
            <Row name="总计（实算）" value={fmtInt(M.params.total)} note="计划 66,956，差 457" width={1000} color={C.amber} />
            <Row name="探测头" value={fmtInt(M.params.probe)} note="64 × 512 + 512，只接线不预训练" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 12, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
            偏差写进文档，不硬凑数字：上屏一律用实算值。
          </div>
        </div>
        <Foot>少样本协议同理：支持集只从训练池抽。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
