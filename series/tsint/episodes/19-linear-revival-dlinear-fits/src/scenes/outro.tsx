import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, M, PAD, Pages, Stat, fmtF, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="08 / 收束" title="三句话带走" goal="结构、参数量、诚实结论" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 24 }}>
      <Card label="一 · 结构" accent={C.cyan} style={{ flex: 1, height: 350 }}>
        <Body size={FT.h2} color={C.ink}>线性骨架没变</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          共享权重是最小形式；DLinear 先分解再各乘；FITS 换到频域再乘。
          三者都还是「输入乘矩阵加偏置」，变的是坐标。
        </Body>
      </Card>
      <Card label="二 · 参数" accent={C.amber} style={{ flex: 1, height: 350 }}>
        <Body size={FT.h2} color={C.ink}>小三十倍</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          96 进 24 出：共享 2328，DLinear 4656，FITS 2352。书里大模型 1.397e5，
          参数量差 31 倍；但我们自己的三个模型差不到 2 倍。
        </Body>
      </Card>
      <Card label="三 · 结论" accent={C.coral} style={{ flex: 1, height: 350 }}>
        <Body size={FT.h2} color={C.ink}>没赢最朴素基线</Body>
        <Body size={FT.body} style={{ marginTop: 14 }}>
          日线 142.07 vs 148.61，五分钟 42.69 vs 45.59。
          DLinear 在三条线性模型里赢七条日线序列，FITS 赢五分钟线——仅此而已。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        线性复兴不是「简单模型更强」的口号，而是「参数少到这个程度，误差还能贴身」的事实。
      </Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="08 / 收束" title="下一集：卷积看时序" goal="E20 · 因果空洞卷积、FFT 周期、二维聚合" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1120 }}>
      <Card label="为什么接着讲卷积" accent={C.cyan} style={{ height: 380 }}>
        <Body size={FT.h2} color={C.ink}>
          线性层把九十六个点压成二十四步；卷积想知道「局部形状」能不能帮上忙。
        </Body>
        <Body size={FT.body} style={{ marginTop: 16 }}>
          因果空洞卷积扩大感受野，FFT 周期给卷积核一个物理尺度，二维聚合把变量维也卷进来。
          下一集仍然用同一套证据纪律：结构断言、梯度检查、真实数据、诚实结论。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1150, top: 350, width: CW - 1150 }}>
      <Stat label="本集参数" value={"2328 / 4656 / 2352"} valueSize={FT.h2} accent={C.amber} style={{ height: 180 }} sub={<span>共享 / DLinear / FITS</span>} />
      <Stat label="本集检查" value={M.meta.checks.ok + " / " + M.meta.checks.total} accent={C.cyan} style={{ height: 180, marginTop: 18 }} sub={<span>全部通过</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>第 19 集完</div>
        <Chip color={C.cyan}>tsint · 时序智能</Chip>
        <K color={C.inkFaint}>证据提交 {M.artifacts.evidenceCommit} · 数据 {fmtInt(M.data.dailyRows)} 行</K>
      </div>
    </div>
  </>
);

export const SOutro: React.FC = () => (
  <Pages id="outro" at={[0, pageAt("outro", 7)]}>
    <P1 />
    <P2 />
  </Pages>
);