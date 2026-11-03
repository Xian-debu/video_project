import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, Formula, KV, Mono, PAD, Pages, Row, Scene, SceneHead, fmt4, pagesOf } from "../shared";
import { CompareDemo, PruneDemo } from "../figs";

export const DefinitionsScene: React.FC = () => (
  <Scene id="definitions">
    <SceneHead id="definitions" />
    <Pages id="definitions" at={pagesOf("definitions")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>式 6.14：<br />收缩盒。</Body>
          <div style={{ marginTop: 20 }}>
            <Formula size={42} note="逐维取均值与标准差；λ=1">
              μ ± λσ
            </Formula>
          </div>
          <Body style={{ marginTop: 24 }}>
            给定一批已评点，新盒的每一维是「均值加减 λ 倍标准差」。样本少于两个时报错；λ=0 时退化成均值点，体积归零。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="黄金值：[0, 2, 4] → [0.3670, 3.6330]" accent={C.cyan}>
            <Row name="样本" value="[0, 2, 4]" note="三个一维点" width={960} />
            <Row name="均值" value="2" note="逐维平均" width={960} color={C.violet} />
            <Row name="标准差" value={fmt4(M.golden.shrink.sd)} note="总体标准差，不是样本标准差" width={960} color={C.cyan} />
            <Row name="下界" value={fmt4(M.golden.shrink.lo)} note="2 − 1.6330" width={960} color={C.amber} />
            <Row name="上界" value={fmt4(M.golden.shrink.hi)} note="2 + 1.6330" width={960} color={C.amber} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            体积从 4 收缩到约 3.27；盒子在动，方向由样本决定。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>式 6.15：<br />成对比较。</Body>
          <div style={{ marginTop: 20 }}>
            <Formula size={42} note="w 由成对标签拟合，不预测绝对分数">
              ŝ(x) = w · x
            </Formula>
          </div>
          <Body style={{ marginTop: 22 }}>
            不要求它说「这个架构值多少分」，只要求它说「A 比 B 高」。200 个成对样本做岭回归，再用比较器排序十万个候选。
          </Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="训练样本" v="200 对" color={C.violet} />
            <KV k="评估" v="201 次" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 300, width: 580 }}>
          <Card label="只问一个问题：谁更高？" accent={C.violet}>
            <CompareDemo />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1310, top: 300, width: 540 }}>
          <Card label="排序结果" accent={C.amber}>
            <KV k="真值序" v="0.9 / 0.7 / 0.5 / 0.3" color={C.inkDim} />
            <div style={{ height: 18 }} />
            <KV k="排出的序" v="[1, 3, 2, 4]" color={C.cyan} />
            <div style={{ height: 18 }} />
            <KV k="位置准确率" v={fmt4(M.golden.cmpAccuracy)} color={C.violet} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            号位逐个对应；线性真值上留出检查全对。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>式 6.16：<br />剪枝与继承。</Body>
          <div style={{ marginTop: 20 }}>
            <Formula size={40} note="按块内平均分保留前 ⌈ρn⌉ 块；α 控制旧参数保留多少">
              keep = top⌈ρn⌉(块均分)
            </Formula>
          </div>
          <div style={{ marginTop: 14 }}>
            <Formula size={40} note="α=0.7：七成旧参数 + 三成新参数">
              p ← α · p_old + (1−α) · p_new
            </Formula>
          </div>
          <Body style={{ marginTop: 20 }}>
            组合预测器把空间切块，用块内平均分决定留哪几块；参数继承让被留下的块带着旧经验开始下一轮，不用从零训练。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 560 }}>
          <Card label="八块，留四块" accent={C.amber}>
            <PruneDemo />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 1360, top: 300, width: 490 }}>
          <Card label="两个黄金值" accent={C.cyan}>
            <KV k="保留" v="[5, 6, 7, 8]" color={C.amber} />
            <div style={{ height: 20 }} />
            <KV k="继承" v={String(M.golden.inheritMix)} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.7 }}>
            八块留下后四块；<br />0.7×[1,2] + 0.3×[3,4]。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>三个黄金值，<br />先钉住实现。</Body>
          <Body style={{ marginTop: 24 }}>
            黄金值不测性能，只测实现有没有写错：排序顺序、保留的索引、参数混合的比例。这三条一旦对上，公式层就站住了。
          </Body>
          <div style={{ marginTop: 24 }}>
            <Chip color={C.cyan}>排序 [1,3,2,4]</Chip>
            <Chip color={C.amber} style={{ marginLeft: 10 }}>保留四块</Chip>
            <Chip color={C.violet} style={{ marginLeft: 10 }}>混合 1.6/2.6</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="四条读数，四个断言" accent={C.cyan}>
            <Row name="排序" value="[1, 3, 2, 4]" note="架构编码 [分数, 编号]" width={980} color={C.cyan} />
            <Row name="保留" value="[5, 6, 7, 8]" note="比例 0.5，按索引升序返回" width={980} color={C.amber} />
            <Row name="继承" value={String(M.golden.inheritMix)} note="α=0.7 的逐元素结果" width={980} color={C.violet} />
            <Row name="二次曲面" value={fmt4(M.golden.quadraticBest)} note="3 轮收缩后的最好值，≥ −0.01" width={980} color={C.cyan} />
          </Card>
          <div style={{ marginTop: 18, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            黄金值全部写进单测；正式证据程序会再来一遍，防止两边一起错。
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
