import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Bars, Body, Card, Chip, CW, Formula, Head, K, KV, M, PAD, Pages, Row, Verdict, fmtE, fmtF } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第一层：真值可比" goal="自己造的低秩矩阵，挖洞再补" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW }}>
      <div style={{ display: "flex", gap: 26 }}>
        <Card label={"合成秩三 · " + M.synthetic.rank3_t + " × " + M.synthetic.rank3_n} accent={C.violet} style={{ flex: 1, height: 380 }}>
          <KV k="挖掉的格子" v="20%" />
          <KV k="低秩误差" v={fmtE(M.synthetic.rank3_err)} color={C.cyan} />
          <KV k="同一次缺失，最近邻" v={fmtF(M.synthetic.rank3_knn_rmse)} color={C.coral} />
          <Body size={FT.meta} style={{ marginTop: 16 }}>
            差了八个数量级。低秩在它自己的主场上是对的。
          </Body>
        </Card>
        <Card label={"合成秩二 · " + M.synthetic.rank2_t + " × " + M.synthetic.rank2_n} accent={C.violet} style={{ flex: 1, height: 380 }}>
          <KV k="挖掉的格子" v="七分之一" />
          <KV k="低秩误差" v={fmtE(M.synthetic.rank2_err)} color={C.cyan} />
          <Body size={FT.meta} style={{ marginTop: 16 }}>
            秩越低越好补。这条是上限场景，不代表真实面板。
          </Body>
        </Card>
        <Card label="这一层证明什么" accent={C.cyan} style={{ flex: 1, height: 380 }}>
          <Body size={FT.body}>
            实现没写错。如果连秩三矩阵都补不回来，后面所有对比都不必看。
          </Body>
          <Body size={FT.meta} style={{ marginTop: 16 }}>
            也说明低秩的失效不是算法 bug —— 是数据不像低秩矩阵。
          </Body>
        </Card>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第二层：随机掩码，五千格" goal="百分之二十，均匀撒" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label="真实面板 · 随机缺失 20%" accent={C.cyan} style={{ height: 430 }}>
        <Bars width={920} rowH={74} items={[
          { label: "列均值", value: M.random.mean, text: fmtF(M.random.mean), color: C.inkDim, dim: true },
          { label: "最近邻", value: M.random.knn, text: fmtF(M.random.knn), color: C.cyan },
          { label: "低秩", value: M.random.lowrank, text: fmtF(M.random.lowrank), color: C.violet },
          { label: "矩阵分解", value: M.random.mf, text: fmtF(M.random.mf), color: C.amber },
        ]} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Card label="低秩比列均值还差" accent={C.coral} style={{ height: 200 }}>
        <Formula size={30} color={C.coral}>{fmtF(M.random.lowrank) + "  >  " + fmtF(M.random.mean)}</Formula>
        <Body size={FT.meta} style={{ marginTop: 10 }}>
          补出来的值不如「整列直接填同一个数」。
        </Body>
      </Card>
      <Card label="原因" accent={C.amber} style={{ height: 200, marginTop: 26 }}>
        <Body size={FT.body}>
          真实收益不低秩：能量摊在几十个方向上，截到五个就扔掉了大部分。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第三层：块状掩码，十列整段挖掉" goal="平均误差好看，不等于补对了" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 960 }}>
      <Card label="真实面板 · 块状缺失" accent={C.cyan} style={{ height: 336 }}>
        <Bars width={880} rowH={60} items={[
          { label: "列均值", value: M.block.mean, text: fmtF(M.block.mean), color: C.inkDim, dim: true },
          { label: "最近邻", value: M.block.knn, text: fmtF(M.block.knn), color: C.cyan },
          { label: "低秩", value: M.block.lowrank, text: fmtF(M.block.lowrank), color: C.violet },
          { label: "矩阵分解", value: M.block.mf, text: fmtF(M.block.mf), color: C.amber },
        ]} />
      </Card>
      <Card label="只看那十列" accent={C.coral} style={{ height: 336, marginTop: 16 }}>
        <Row name="最近邻 RMSE" value={fmtF(M.block.blockcol_knn)} note="补出的是真实值" color={C.cyan} />
        <Row name="低秩 RMSE" value={fmtF(M.block.blockcol_lowrank)} note="还小一点点" color={C.coral} />
        <Row name="相关系数 · 最近邻" value={fmtF(M.block.blockcol_corr_knn, 3)} />
        <Row name="相关系数 · 低秩" value={fmtF(M.block.blockcol_corr_lowrank, 3)} note="零：补的全是同一个零" color={C.coral} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 330, width: CW - 1000 }}>
      <Card label="为什么零能骗过 RMSE" accent={C.amber} style={{ height: 300 }}>
        <Body size={FT.body}>
          预测零的均方误差，等于真值的均方根。停牌公司的波动和全市场同量级，这个数字自然不大。
        </Body>
        <Body size={FT.meta} style={{ marginTop: 14 }}>
          相关系数才是区分点：0 对 0.329。
        </Body>
      </Card>
      <Card label="读法" accent={C.cyan} style={{ height: 300, marginTop: 24 }}>
        <Body size={FT.body}>
          同一份数据，只看 RMSE 会得出「低秩略胜」，看相关系数就发现它在预测零。
        </Body>
        <Verdict ok label="别只看均方误差" />
      </Card>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="第四层：暴跌窗口，二十天" goal="二十四个检查，零失败" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1000 }}>
      <Card label={"截面最负的 " + M.block.crash_days + " 天"} accent={C.coral} style={{ height: 330 }}>
        <Row name="平均收益" value={fmtF(M.block.crash_mean_ret, 4)} note="百分之二点零六" color={C.coral} />
        <Row name="最近邻误差" value={fmtF(M.block.crash_rmse_knn, 4)} note="比真值低 19%" color={C.cyan} />
        <Row name="低秩 / 矩阵分解" value={fmtF(M.block.crash_rms_truth, 4)} note="等于真值 RMS，即预测零" color={C.coral} />
      </Card>
      <div style={{ display: "flex", gap: 26, marginTop: 24 }}>
        <Card label="前几集" accent={C.inkDim} style={{ flex: 1, height: 190 }}>
          <Body size={FT.body}>机制存在，真实数据里没有那个问题。</Body>
        </Card>
        <Card label="这一集" accent={C.cyan} style={{ flex: 1, height: 190 }}>
          <Body size={FT.body}>问题真实存在，低秩就是用不上。</Body>
        </Card>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Card label="二十四个检查" accent={C.cyan} style={{ height: 330 }}>
        <div style={{ display: "flex", gap: 30 }}>
          <div><K>数据</K><div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>5</div></div>
          <div><K>结构</K><div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>6</div></div>
          <div><K>行为</K><div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.cyan }}>13</div></div>
          <div><K>失败</K><div style={{ fontFamily: FONT.mono, fontSize: FT.h2, color: C.ink }}>0</div></div>
        </div>
        <Body size={FT.meta} style={{ marginTop: 18 }}>
          不是「跑完没崩」，是每条都断言了具体数字。
        </Body>
      </Card>
      <div style={{ marginTop: 24 }}>
        <Card label="结论" accent={C.amber} style={{ height: 190 }}>
          <Body size={FT.lead} color={C.ink}>四层结论一致：问题在，方法不匹配。</Body>
        </Card>
      </div>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, 0.25, 0.42, 0.76]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);