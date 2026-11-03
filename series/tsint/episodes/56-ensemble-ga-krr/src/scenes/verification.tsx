import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, CheckGrid, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, checkGroups, fmt4, pagesOf } from "../shared";

export const VerificationScene: React.FC = () => (
  <Scene id="verification">
    <SceneHead id="verification" />
    <Pages id="verification" at={pagesOf("verification")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>一条命令，<br />二十四项检查。</Body>
          <Body style={{ marginTop: 24 }}>
            数据四项，遗传算法七项，核岭回归六项，前沿两项，融合五项；四十八点二秒跑完。全绿，没有跳过的项，也没有大概通过的项。
          </Body>
          <div style={{ marginTop: 24, display: "flex" }}>
            <KV k="检查" v="24 / 24" color={C.cyan} />
            <KV k="耗时" v="48.2s" color={C.amber} />
          </div>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            每项都带读数，读数写进 JSON。
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="二十四项，五组" accent={C.cyan}>
            <CheckGrid cell={26} />
            <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              {checkGroups().map((g) => g.g + " " + g.pass + "/" + g.total).join("　")}
            </div>
          </Card>
        </div>
        <Foot>没有跳过的项。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>黄金值组，<br />先过。</Body>
          <Body style={{ marginTop: 24 }}>
            零点八七五一分不差；lambda 零时插值误差为零；lambda 一百万时预测二点二乘十的负六；核宽保持为正；lambda 只从网格里取。
          </Body>
          <div style={{ marginTop: 22 }}>
            <Chip color={C.cyan}>同 seed 前沿相同</Chip>
            <Chip color={C.cyan} style={{ marginLeft: 10 }}>互不支配</Chip>
            <Chip color={C.cyan} style={{ marginLeft: 10 }}>选点在前沿上</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="数学性质先钉死，再谈数据" accent={C.amber}>
            <Row name="黄金值" value="0.8750" note="krrFitWith 0.5，两个点" width={1020} color={C.amber} />
            <Row name="λ = 0 插值" value="0.00e0" note="两个训练点的最大误差" width={1020} color={C.cyan} />
            <Row name="λ = 1e6 收缩" value="2.21e-6" note="预测绝对值，已经等于不修正" width={1020} color={C.coral} />
            <Row name="核宽" value="> 0" note="训练集两两距离中位数归一化" width={1020} color={C.violet} />
            <Row name="λ 网格" value="3 个" note="0.01 / 0.1 / 1.0，不越界" width={1020} color={C.cyan} />
            <Row name="同 seed" value="一致" note="两次调用，前沿逐点相同" width={1020} color={C.inkDim} />
          </Card>
        </div>
        <Foot>零点八七五，一分不差。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>数据组与 GA 组，<br />都在说同一件事。</Body>
          <Body style={{ marginTop: 24 }}>
            二十只股票全部读入，每只至少两千四百根日线；切分从左到右，候选池十个。遗传算法每只都选出子集，平均三点八五个，前沿平均二点八五个。
          </Body>
          <Body style={{ marginTop: 16 }}>
            双目标与只看精度，二十只里有十三只选出不同子集。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="数据四项，GA 七项" accent={C.cyan}>
            <Row name="股票" value={M.data.stocks} note="全部读入，最少 2412 个交易日" width={1040} color={C.cyan} />
            <Row name="切分" value="左 → 右" note="训练 < 调参 < 检验，不重叠" width={1040} color={C.inkDim} />
            <Row name="候选池" value={M.data.candidates} note="五个模型 × 两个超参档" width={1040} color={C.violet} />
            <Row name="子集大小" value={fmt4(M.ga.selKMean, 2)} note="每只都选出，至少两个成员" width={1040} color={C.cyan} />
            <Row name="前沿规模" value={fmt4(M.ga.frontMean, 2)} note="平均二点八五个互不支配的点" width={1040} color={C.amber} />
            <Row name="两种目标" value={M.ga.biasOnlyDiffer + " / 20"} note="选出的子集不同；偏差略低、方差更高" width={1040} color={C.coral} />
          </Card>
        </div>
        <Foot>每只股票都选出子集。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>核岭回归组，<br />调参段确实降了。</Body>
          <Body style={{ marginTop: 24 }}>
            调参段误差十一点五一七七，等权十三点四三一七，核修正把调参段压低了不少；交叉验证均值十二点零四六七。lambda 计数是零、二、十八。
          </Body>
          <Body style={{ marginTop: 16 }}>
            多数股票选了最大的 lambda。这是检查，不是调参。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="调参段好看，不等于检验段好看" accent={C.violet}>
            <Row name="调参段 核回归" value="11.5177" note="KRR 在调参段的 MAE" width={1040} color={C.violet} />
            <Row name="调参段 等权" value="13.4317" note="同一段的等权 MAE" width={1040} color={C.inkDim} />
            <Row name="交叉验证均值" value="12.0467" note="5 折 × 20 只股票" width={1040} color={C.amber} />
            <Row name="λ 计数" value={M.krr.lamCounts.join(" / ")} note="0.01 / 0.1 / 1.0：零、二、十八" width={1040} color={C.cyan} />
            <Row name="λ 网格" value="3 个" note="三个都在网格里，没有越界" width={1040} color={C.inkDim} />
            <Row name="核宽" value="正数" note="距离中位数归一化，不会退化" width={1040} color={C.cyan} />
          </Card>
        </div>
        <Foot>这是检查，不是调参。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>融合组，<br />五项对照全部成立。</Body>
          <Body style={{ marginTop: 24 }}>
            核岭回归低于全池等权，也低于全池核回归；子集等权、Top-3、最好单模型都低于全池等权。五项方向都成立，负结果也写成检查。
          </Body>
          <Body style={{ marginTop: 16 }}>
            「核修正没有额外收益」这句话，写在 detail 里。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 286, width: 1100 }}>
          <Card label="五项对照，方向全部成立" accent={C.cyan}>
            <Row name="KRR < 全池等权" value="10.0322" note="对 10.1566；但子集等权 9.5721 更好" width={1040} color={C.amber} />
            <Row name="KRR < 全池核" value="10.0322" note="对 10.2115，胜 12/20" width={1040} color={C.cyan} />
            <Row name="子集等权 < 全池" value="9.5721" note="对 10.1566，筛选的收益" width={1040} color={C.cyan} />
            <Row name="Top-3 < 全池" value="9.6050" note="对 10.1566" width={1040} color={C.violet} />
            <Row name="最好单模型" value="9.5397" note="oracle 下界，不能算融合收益" width={1040} color={C.inkFaint} />
          </Card>
          <div style={{ marginTop: 16, fontFamily: FONT.mono, fontSize: FT.meta, color: C.coral }}>
            detail：核修正没有额外收益（10.0322 vs 9.5721）。
          </div>
        </div>
        <Foot accent={C.coral}>负结果，也写成检查。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
