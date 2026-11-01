import React from "react";
import { C, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, CodeBlock, Formula, Head, K, KV, M, PAD, Pages, Row, fmtE, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="三个模块，各管一段" goal="按书的三行式子分工" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 980 }}>
      <CodeBlock width={940} size={FT.meta} title="src/TsBase/Algos/Ch03/" lines={[
        { t: "Mhsa.hs", hi: true },
        { t: "  initMhsa 21 64 4      -- 种子 → Q/K/V/O 四个 64×64" },
        { t: "  mhsaForward / mhsaLossGrad", dim: true },
        { t: "TransformerBlock.hs", hi: true },
        { t: "  blockForward          -- LN → MHSA → 残差 → LN → FFN → 残差" },
        { t: "MaskedAttn.hs", hi: true },
        { t: "  maskedAttnWith        -- 显式权重版本，便于检查掩码" },
      ]} />
    </div>
    <div style={{ position: "absolute", left: PAD + 1020, top: 340, width: CW - 1020 }}>
      <Card label="三条设计约定" accent={C.cyan} style={{ height: 420 }}>
        <Body size={FT.body} color={C.ink}>① 四个头合成一个大矩阵再切片，形状简单。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>② 偏置全部省略，参数账才干净。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>③ 只有注意力写解析梯度，块用数值。</Body>
        <K style={{ display: "block", marginTop: 14 }}>约定都是本仓选择，书里没有</K>
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="前向的形状链" goal="每一步都能报出维度" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 1000 }}>
      <Card label="从窗口到块输出" accent={C.violet} style={{ height: 420 }}>
        <Row name="① 窗口" value="96 × 8" note="z 分数" />
        <Row name="② 线性嵌入" value="96 × 64" color={C.cyan} />
        <Row name="③ 三个投影" value="96 × 64 各一份" />
        <Row name="④ 每头打分" value="96 × 96，共 4 份" color={C.amber} />
        <Row name="⑤ 加权求和" value="每头 96 × 16" />
        <Row name="⑥ 交错拼接 + W_o" value="96 × 64" color={C.violet} />
        <Row name="⑦ 块输出" value="96 × 64" color={C.cyan} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 350, width: CW - 1040 }}>
      <Card label="三个数字" accent={C.cyan} style={{ height: 420 }}>
        <KV k="每头宽度 d_k" v={String(M.meta.config.dk)} color={C.cyan} size={FT.h2} />
        <KV k="头数 h" v={String(M.meta.config.heads)} color={C.amber} size={FT.h2} />
        <KV k="前馈宽度 d_ff" v={String(M.meta.config.dff)} color={C.violet} size={FT.h2} />
        <Body size={FT.meta} style={{ marginTop: 14 }}>四乘十六等于六十四；前馈是四倍宽再回来。</Body>
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="前两处易错" goal="都在数值细节里" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 900 }}>
      <CodeBlock width={860} size={FT.meta} title="softmax 的两步（省一不可）" lines={[
        { t: "m = max(row)            -- 先减最大值", hi: true },
        { t: "e = exp(x - m)          -- 防溢出" },
        { t: "w = e / sum(e)", dim: true },
        { t: "" },
        { t: "scores = Q K^T / sqrt(dk)   -- 再除", hi: true },
        { t: "A = softmax(scores)", dim: true },
      ]} />
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 340, width: CW - 940 }}>
      <Card label="为什么两处都不能省" accent={C.coral} style={{ height: 360 }}>
        <Body size={FT.body} color={C.ink}>不减最大值：exp 的输入一大就溢出。</Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 12 }}>除得晚：softmax 已经在放大的 logit 上做完了。</Body>
        <Body size={FT.body} color={C.cyan} style={{ marginTop: 12 }}>
          本仓把缩放写进打分的最后一步，softmax 只拿到已经除过的值。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 730, width: CW }}>
      <Chip color={C.amber}>数值细节不会报错，只会悄悄改变输出。</Chip>
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="第三处易错：拼接顺序" goal="本集最值钱的一次事故" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 960 }}>
      <Card label="两次对照，两种结果" accent={C.coral} style={{ height: 380 }}>
        <Row name="前向" value="按时间步交错" color={C.cyan} />
        <Row name="求导" value="还按头拼" color={C.coral} />
        <Row name="各自单测" value="都通过" />
        <Row name="跨前向对照" value={"误差 " + fmtE(3.959897148, 2) + " → " + fmtE(M.grad.maxErr, 2)} color={C.cyan} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1000, top: 350, width: CW - 1000 }}>
      <Card label="为什么单测没抓到" accent={C.amber} style={{ height: 380 }}>
        <Body size={FT.body} color={C.ink}>
          梯度检查拿 mhsaLossGrad 自己的损失，和自己的梯度比。两边用的是同一种拼接，所以自洽。
        </Body>
        <Body size={FT.body} color={C.ink} style={{ marginTop: 14 }}>
          只有和 mhsaForward 的输出逐元素对照，才暴露顺序不一致。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 760, width: CW }}>
      <Body size={FT.lead} color={C.coral}>自洽的测试，救不了错的实现。</Body>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="掩码：把未来设成负无穷" goal="不是设零" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: 900 }}>
      <Card label="三种效果的差别" accent={C.coral} style={{ height: 360 }}>
        <Row name="上三角 = −∞" value="exp 后为 0" note="权重恰为 0" color={C.cyan} />
        <Row name="上三角 = 0" value="exp(0) = 1" note="仍分到权重" color={C.coral} />
        <Row name="整行 = −∞" value="NaN" note="分母为 0，要单独处理" color={C.amber} />
        <K style={{ display: "block", marginTop: 12 }}>本仓逐行操作，不会出现整行遮蔽</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 940, top: 350, width: CW - 940 }}>
      <Card label="证据里的三项掩码检查" accent={C.cyan} style={{ height: 360 }}>
        <Row name="严格上三角权重和" value={String(M.mask.strictUpperSum)} color={C.cyan} />
        <Row name="前几行输出不变" value={M.mask.rowsUnchanged + " 行"} color={C.cyan} />
        <Row name="首 token 只看自己" value={M.mask.firstTokenOnlySelf ? "是" : "否"} color={C.cyan} />
        <K style={{ display: "block", marginTop: 12 }}>maskedAttnWith 接受显式权重，检查不依赖内部状态</K>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 740, width: CW }}>
      <Formula size={34} note="M 的严格上三角是 −∞，对角线与下三角是 0">
        A = softmax((Q Kᵀ / √d_k) + M)
      </Formula>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, pageAt("implementation", 6), pageAt("implementation", 10), pageAt("implementation", 14), pageAt("implementation", 23)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
