import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Formula, Head, K, M, PAD, Pages, Row, SplitBar, Stat, WindowStrip, fmtF, fmtInt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="滑窗：一行公式" goal="窗口数 = ⌊(T−H−F)/s⌋ + 1" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <WindowStrip h={M.windows.h} f={M.windows.f} width={1000} height={250} />
      <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
        <K color={C.cyan}>输入 {M.windows.h} 根历史</K>
        <K color={C.amber}>标签 {M.windows.f} 根未来</K>
        <K>起点每步走一格</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Card label="windowCount · T = 3,880，H = 96，F = 24" accent={C.cyan} style={{ height: 320 }}>
        <Formula size={20} note="h ≤ 0、f ≤ 0、s ≤ 0 或 t − off < h + f 时返回 0">
          (t − off − h − f) div s + 1
        </Formula>
        <div style={{ marginTop: 16 }}>
          <Row name="步长 1" value="3,761 个" color={C.cyan} width={CW - 1040 - 48} />
          <Row name="步长 5" value="177 个" color={C.violet} width={CW - 1040 - 48} />
          <Row name="简报写的 176" value="漏了 +1" color={C.coral} width={CW - 1040 - 48} />
        </div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三千八百八十，减九十六，再减二十四，整除步长，加一。
      </Body>
      <div style={{ marginTop: 10 }}>
        <K color={C.amber}>加的这个一，是序列开头那一个窗口</K>
      </div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="切分：6:2:2，两道空" goal="purge gap = 24 帧" />
    <div style={{ position: "absolute", left: PAD, top: 360, width: CW }}>
      <SplitBar
        total={M.data.rows}
        segments={[
          { start: 0, len: 2328, label: "训练", value: M.windows.train, color: C.cyan },
          { start: 2352, len: 776, label: "验证", value: M.windows.val, color: C.amber },
          { start: 3152, len: 728, label: "测试", value: M.windows.test, color: C.coral },
        ]}
        width={CW}
        height={140}
      />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 560, width: CW }}>
      <Row name="训练段 · 帧 0–2,327" value={fmtInt(M.windows.train) + " 个窗口"} color={C.cyan} width={CW} />
      <Row name="验证段 · 帧 2,352–3,127" value={fmtInt(M.windows.val) + " 个窗口"} color={C.amber} width={CW} />
      <Row name="测试段 · 帧 3,152–3,879" value={fmtInt(M.windows.test) + " 个窗口"} color={C.coral} width={CW} />
      <Row name="丢弃的边界" value="2 × 24 = 48 帧" note="一整个标签长度，防未来泄漏" color={C.inkFaint} width={CW} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        三段加两道空，正好三千七百六十一。不留空，验证集的答案提前漏进训练集。
      </Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="四个指标，两种量纲" goal="前三绝对，第四相对" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", gap: 22 }}>
        <Card label="MAE · 式(3.5)" accent={C.cyan} style={{ flex: 1, height: 200 }}>
          <Formula size={26}>1/F · Σ |x − x̂|</Formula>
          <Body size={FT.meta} style={{ marginTop: 12 }}>绝对量：错了多少元</Body>
        </Card>
        <Card label="MSE · 式(3.6)" accent={C.violet} style={{ flex: 1, height: 200 }}>
          <Formula size={26} color={C.violet}>1/F · Σ (x − x̂)²</Formula>
          <Body size={FT.meta} style={{ marginTop: 12 }}>平方放大大误差，量纲变成元的平方</Body>
        </Card>
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        <Card label="RMSE · 式(3.8)" accent={C.amber} style={{ flex: 1, height: 200 }}>
          <Formula size={26} color={C.amber}>√MSE</Formula>
          <Body size={FT.meta} style={{ marginTop: 12 }}>开方回到元；必须由 MSE 开方，不是 MAE</Body>
        </Card>
        <Card label="MAPE · 式(3.7)" accent={C.coral} style={{ flex: 1, height: 200 }}>
          <Formula size={26} color={C.coral}>100%/F · Σ |x − x̂| / |x|</Formula>
          <Body size={FT.meta} style={{ marginTop: 12 }}>相对量：错了百分之几，不跟价格涨</Body>
        </Card>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 810, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        绝对量跟着价格放大，相对量不跟。四个指标，量的是四件不同的事。
      </Body>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="03 / 定义" title="选模：只认验证集" goal="式(3.4) 一句，其余全写死" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 860 }}>
      <Card label="训练超参 · 书中未给" accent={C.cyan} style={{ height: 380 }}>
        <Row name="优化器" value="Adam" note="lr 1e-3，β (0.9, 0.999)，eps 1e-8" color={C.cyan} width={860 - 48} />
        <Row name="批大小" value="32" note="固定 seed 的 LCG 采样，可复跑" color={C.cyan} width={860 - 48} />
        <Row name="轮数上限" value="200" note="早停先触发就提前停" color={C.cyan} width={860 - 48} />
        <Row name="耐心" value="10 轮" note="最小改善 1e-6" color={C.amber} width={860 - 48} />
        <Row name="损失" value="MSE / MAE" note="式(3.2) / (3.3)" color={C.violet} width={860 - 48} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 890, top: 340, width: CW - 890 }}>
      <Card label="valSelect · 规则" accent={C.violet} style={{ height: 380 }}>
        <Formula size={26} color={C.violet}>arg min score</Formula>
        <Row name="排序" value="验证分数升序" color={C.violet} width={CW - 890 - 48} />
        <Row name="同分" value="按标签字典序" color={C.violet} width={CW - 890 - 48} />
        <Row name="测试集" value="不参加选模" color={C.coral} width={CW - 890 - 48} />
        <Body size={FT.body} style={{ marginTop: 16 }}>
          测试集只在选完之后打开一次。用测试集调参，这个数就废了。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Body size={FT.lead} color={C.ink}>
        五件事：窗口、切分、指标、训练、选模。每一件都写死。
      </Body>
    </div>
  </>
);

export const SDefinitions: React.FC = () => (
  <Pages id="definitions" at={[0, 0.3, 0.55, 0.78]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
