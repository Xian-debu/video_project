import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, Mono, PAD, Pages, Row } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="书上写了什么" goal="四个式子，三页纸" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 860 }}>
      <Card label="第三章 · printed p.41–44" accent={C.cyan} style={{ height: 380 }}>
        <Formula size={26} note="式(3.1) 预测映射：一个函数，从输入窗口到未来窗口">
          X̂ = f_θ(X)
        </Formula>
        <div style={{ marginTop: 20 }}>
          <Formula size={22} note="式(3.2) 训练损失：均方误差">L = 1/F Σ (x_i − x̂_i)²</Formula>
          <div style={{ marginTop: 12 }}>
            <Formula size={22} note="式(3.3) 训练损失：平均绝对误差">L = 1/F Σ |x_i − x̂_i|</Formula>
          </div>
          <div style={{ marginTop: 12 }}>
            <Formula size={22} note="式(3.4) 选模：验证损失取最小">θ* = arg min L_val(θ)</Formula>
          </div>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 890, top: 330, width: CW - 890 }}>
      <Card label="四个评估指标 · p.44" accent={C.violet} style={{ height: 380 }}>
        <Row name="式(3.5) · MAE" value="1/F Σ |e|" color={C.cyan} width={CW - 890 - 48} />
        <Row name="式(3.6) · MSE" value="1/F Σ e²" color={C.violet} width={CW - 890 - 48} />
        <Row name="式(3.7) · MAPE" value="100%/F Σ |e|/|x|" color={C.amber} width={CW - 890 - 48} />
        <Row name="式(3.8) · RMSE" value="√MSE" color={C.coral} width={CW - 890 - 48} />
        <Body size={FT.body} style={{ marginTop: 18 }}>
          前三个是绝对量，第四个是相对量。书上把四个并排写在一起，没说什么时候用哪个。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 770, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        整章就这些。滑窗、切分、优化器、早停，一个字没有。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="五个没说，一句笔误" goal="写死五项，登记三处" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 880 }}>
      <Card label="书上没有的" accent={C.coral} style={{ height: 400 }}>
        <Row name="滑窗怎么切" value="没说" note="按索引还是按日历？" color={C.coral} width={880 - 48} />
        <Row name="三段怎么分" value="没说" note="训练、验证、测试的比例？" color={C.coral} width={880 - 48} />
        <Row name="边界留不留空" value="没说" note="不留空就是未来泄漏" color={C.coral} width={880 - 48} />
        <Row name="优化器与学习率" value="没说" note="Adam？SGD？1e-3？" color={C.coral} width={880 - 48} />
        <Row name="早停停在哪轮" value="没说" note="最后一步还是最优一步？" color={C.coral} width={880 - 48} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 910, top: 330, width: CW - 910, display: "flex", flexDirection: "column", gap: 22 }}>
      <Card label="一句笔误 · p.43" accent={C.amber} style={{ height: 230 }}>
        <Body size={FT.body} color={C.ink}>
          「T^train 是整个测试集的样本数量」。
        </Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          上下文和下标都对不上。按训练集理解，记勘误 E32。
        </Body>
        <div style={{ marginTop: 14 }}><Chip color={C.amber}>E32 · 测试集 → 训练集</Chip></div>
      </Card>
      <Card label="三处登记" accent={C.violet} style={{ height: 148 }}>
        <Body size={FT.body}>
          E30 式(3.1) 是预测映射，不是滑窗定义；E31 窗口数 176 漏加一；E32 上面那句。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        这五项全部写死，进自授条目 A35 到 A37，测试逐条守。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="02 / 问题" title="零值这一处，书说了失效" goal="式(3.7) 的分母" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 820 }}>
      <Card label="式(3.7) · 百分比误差" accent={C.cyan} style={{ height: 340 }}>
        <Formula size={34}>MAPE = 100% / F · Σ |x_i − x̂_i| / |x_i|</Formula>
        <Body size={FT.body} style={{ marginTop: 22 }}>
          书上只加了一句：真实值为零时失效。
          没说怎么办，没给 eps，也没说失效的项怎么计数。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 850, top: 340, width: CW - 850 }}>
      <Card label="同一个零值，三个答案" accent={C.coral} style={{ height: 340 }}>
        <Row name="照书直除 · 默认" value="Infinity" color={C.coral} width={CW - 850 - 48} />
        <Row name="跳过这一对" value="25.0%" color={C.amber} width={CW - 850 - 48} />
        <Row name="分母加 1e-8" value="3.33e9" color={C.violet} width={CW - 850 - 48} />
        <Body size={FT.body} style={{ marginTop: 16 }}>
          真值 [0,1,2]，预测 [1,1,1]。三个数字都不是笔误，是三种口径。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 750, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        本仓默认照书，让失效暴露出来；另外两个策略必须显式要。
      </Body>
      <div style={{ marginTop: 12 }}>
        <K color={C.coral}>悄悄改成零，读数就变成另一个故事</K>
      </div>
    </div>
  </>
);

export const SProblem: React.FC = () => (
  <Pages id="problem" at={[0, 0.42, 0.74]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);
