import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, M, PAD, Pages } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="三句话带走" goal="下一集，线性模型复兴" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Card label="第一句" accent={C.cyan} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>归一化是模型的一部分，</Body>
        <Body size={FT.h2} color={C.ink}>不是预处理。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          基准从输入窗算，反变换用保存的统计量，两步都在模型里。
        </Body>
      </Card>
      <Card label="第二句" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>减什么，</Body>
        <Body size={FT.h2} color={C.ink}>就是选什么不变量。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          减均值对平移不变，减末值对水平位置不变，再除标准差对尺度也不变。
        </Body>
      </Card>
      <Card label="第三句" accent={C.amber} style={{ flex: 1, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>漂移选末值，</Body>
        <Body size={FT.h2} color={C.ink}>平稳选均值。</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          合成数据上排序翻转，指数上末值领先，成交量上两者只差百分之一。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Formula size={30} color={C.ink}>x̂ = f(x − base) + base</Formula>
      <Body size={FT.body} style={{ marginTop: 12 }}>
        三个名字，一个骨架。base 不同，假设不同，读数就不同。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收尾" title="下一集" goal="线性模型复兴" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW, display: "flex", gap: 26 }}>
      <Card label="下一集" accent={C.cyan} style={{ flex: 1.2, height: 300 }}>
        <Body size={FT.h2} color={C.ink}>共享权重线性、DLinear、FITS</Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          参数少、结构简单，在多个基准上赢过复杂模型。归一化这一层已经铺好，下一集直接把 base 装进模型。
        </Body>
      </Card>
      <Card label="本集证据" accent={C.violet} style={{ flex: 1, height: 300 }}>
        <Body size={FT.body} color={C.inkDim}>
          二十八项检查、六十七组套件、九百六十五个断言；三个模块、四条自授条目、一处勘误。
        </Body>
        <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Chip color={C.cyan}>evidence {M.artifacts.checksPassed} / {M.meta.checks.total}</Chip>
          <Chip color={C.violet}>tests {M.meta.tests.suites}</Chip>
          <Chip color={C.amber}>commit {M.artifacts.evidenceCommit}</Chip>
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        数字、代码、证据，都在仓库里。
      </Body>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, 0.516]}>
    <P1 />
    <P2 />
  </Pages>
);
