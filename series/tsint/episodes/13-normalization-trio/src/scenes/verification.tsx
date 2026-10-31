import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import {
  Bars, Body, Bridge, CW, Card, Head, K, KV, M, Pages, PAD, Row, Stat, Verdict, fmtE,
} from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="三条桥接，全部为零" goal="参数取到极限时，三者必须逐位相同" />
    <div style={{ position: "absolute", left: PAD, top: 380, width: 1180 }}>
      <Bridge name="RevIN @ eps=0" target="vs Z-score" value={M.bridges.revin_zscore} />
      <Bridge name="DAIN @ alpha=mu" target="vs RevIN" value={M.bridges.dain_revin} />
      <Bridge name="SAN @ tau=T" target="vs RevIN" value={M.bridges.san_revin} />
    </div>
    <div style={{ position: "absolute", left: 1420, top: 380, width: 410 }}>
      <Stat label="往返最大差" value={fmtE(M.revin.roundtrip_max_diff)} accent={C.cyan}
        sub="归一化再反变换，双精度下能回到原值" />
      <Stat label="归一化后均值偏差" value={fmtE(M.revin.norm_mean_abs_max)} accent={C.cyan} style={{ marginTop: 20 }}
        sub="三万个数字逐个看" />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三个零不是「差不多」：是同一批输入、同一份统计量、逐位相等的判定。
        桥接测试的意义是，证明三个零件真的只差统计量，没混进别的逻辑。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="DAIN 学到了什么" goal="闭式解一步到位" />
    <div style={{ position: "absolute", left: PAD, top: 370, width: 700 }}>
      <Card label="拟合出来的权重" accent={C.violet} style={{ height: 420 }}>
        <Row name="W_a" value="[1, 0, 0]" note="只有均值那一维" color={C.violet} />
        <Row name="b_a" value={fmtE(M.dain.ba)} note="数值零" />
        <Row name="W_b" value="[0, 1, 0]" note="只有标准差那一维" color={C.violet} />
        <Row name="b_b" value={fmtE(M.dain.bb)} note="数值零" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 740, top: 370, width: 640 }}>
      <Card label="误差量级" accent={C.cyan} style={{ height: 420 }}>
        <KV k="训练损失" v={fmtE(M.dain.fit_loss)} note="ridge，正规方程直接解" />
        <KV k="alpha 平均绝对误差" v={fmtE(M.dain.alpha_mae)} note="相对 alpha 本身" />
        <KV k="W_b[1] 的精确值" v="0.9999999997" note="双精度能表示到这个程度" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1420, top: 370, width: 400 }}>
      <Card label="这说明" accent={C.amber} style={{ height: 420 }}>
        <Body size={FT.body}>
          它在数据上自动找到了 RevIN 的答案：alpha 就是均值，beta 就是标准差。
        </Body>
        <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 12 }}>
          学习能力没带来新东西，但也没走偏 —— 这是桥接测试之外的第二个证据。
        </Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="06 / 验证" title="一次诚实的失败" goal="SAN 第一阶段输给「沿用上一片」" />
    <div style={{ position: "absolute", left: PAD, top: 370, width: 1000 }}>
      <Bars
        width={1000} rowH={68} max={2.6}
        items={[
          { label: "mu 本轮", value: M.san.mu_mae, text: M.san.mu_mae.toFixed(2), color: C.coral },
          { label: "mu 基线", value: M.san.naive_mu_mae, text: M.san.naive_mu_mae.toFixed(2), color: C.cyan },
          { label: "sd 本轮", value: M.san.sigma_mae, text: M.san.sigma_mae.toFixed(2), color: C.coral },
          { label: "sd 基线", value: M.san.naive_sigma_mae, text: M.san.naive_sigma_mae.toFixed(2), color: C.cyan },
        ]}
        unit="平均绝对误差；基线 = 直接沿用上一片的统计量"
      />
    </div>
    <div style={{ position: "absolute", left: PAD + 1060, top: 370, width: 660 }}>
      <Card label="对比" accent={C.coral} style={{ height: 300 }}>
        <Row name="均值误差" value={M.san.mu_ratio_vs_naive.toFixed(2) + "×"} color={C.coral} note="比基线差三点六四倍" />
        <Row name="标准差误差" value={M.san.sigma_ratio_vs_naive.toFixed(2) + "×"} color={C.coral} note="比基线差一点五倍" />
        <Row name="测试对" value={M.san.pairs} note="30 个窗口 × 9 次片间转移" />
        <Row name="第一阶段损失" value={M.san.stage1_loss.toFixed(3)} note="rho=10.24 下的正则化目标" />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 720, width: CW }}>
      <Card label="检查口径" accent={C.amber} style={{ height: 180 }}>
        <Body size={FT.body}>
          二十四项检查，零失败。但其中两项写的是「误差同量级」，不是「我们赢了」。
          这项失败留在片子里 —— 网络在九十个训练窗口上没学到比「不动」更好的策略。
        </Body>
      </Card>
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages id="verification" at={[0, 0.34, 0.66]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
