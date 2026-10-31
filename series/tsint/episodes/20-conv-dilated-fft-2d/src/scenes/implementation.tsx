import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, CodeBlock, Head, K, M, PAD, Pages, Row, Stat, pageAt } from "../shared";

const ez = (v: number) => (v === 0 ? "0" : v.toExponential(1));

const P1: React.FC = () => (
  <>
    <Head kicker="04 / 实现" title="空洞卷积：先补左边，再滑窗" goal="核序号在最外层" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1040 }}>
      <Card label="src/TsBase/Algos/Ch03/DilatedCausalConv.hs" accent={C.cyan} pad={18}>
        <CodeBlock
          lines={[
            { t: "causalConv1d k d stride w x =", hi: true },
            { t: "  let pad = (k - 1) * d", dim: true },
            { t: "      xp  = replicate pad 0 ++ x      -- 只左填", dim: true },
            { t: "      tap t kk = xp !! (t + kk * d)", dim: true },
            { t: "      out t = sum [ w!(kk*cin*cout + i*cout + o)", dim: true },
            { t: "                     * tap t kk", dim: true },
            { t: "                  | kk <- [0 .. k-1] ]", dim: true },
            { t: "  in  ... -- 逐层: conv -> ReLU -> 可选 BN", dim: true },
          ]}
          width={1000}
          size={FT.code}
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1070, top: 330, width: CW - 1070 }}>
      <Card label="布局与纪律" accent={C.amber} style={{ height: 400 }}>
        <Row name="核序号 k = 0" value="最旧抽头" note="读 t − (K−1)d" color={C.coral} width={CW - 1120} />
        <Row name="填充量" value="(K − 1) · d" note="四层合计三十个" color={C.cyan} width={CW - 1120} />
        <Row name="层内顺序" value="卷积 → ReLU" note="批归一化可选，本集关掉" color={C.violet} width={CW - 1120} />
        <Row name="感受野" value={"1 + Σ(K−1)d = " + M.meta.rf} note="用公式算，不靠试" color={C.amber} width={CW - 1120} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>前向就是一行一行往下走，每层只碰过去。</Body>
      <div style={{ marginTop: 8 }}><K>权重矩阵形状：核序号 × 输入通道 × 输出通道，行主序扁平化</K></div>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="04 / 实现" title="FFT 模块：确定性优先" goal="同样的振幅，频率小的优先" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1040 }}>
      <Card label="src/TsBase/Algos/Ch03/FftPeriod.hs" accent={C.violet} pad={18}>
        <CodeBlock
          lines={[
            { t: "topPeriods k x =", hi: true },
            { t: "  let n  = length x", dim: true },
            { t: "      z  = tail (rfft x)          -- 去掉直流", dim: true },
            { t: "      p f = clamp 2 n (ceiling (n / f))", dim: true },
            { t: "  in  take k (sortBy (ampDesc, fAsc) z)", dim: true },
            { t: "  where ampDesc a b = compare (mag b) (mag a)", dim: true },
            { t: "        fAsc    a b = compare (freq a) (freq b)", dim: true },
          ]}
          width={1000}
          size={FT.code}
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1070, top: 330, width: CW - 1070 }}>
      <Card label="四个选择" accent={C.cyan} style={{ height: 400 }}>
        <Row name="先去掉直流" value="均值不是周期" note="不移除，排序第一永远是它" color={C.coral} width={CW - 1120} />
        <Row name="只取正频率" value="实部 + 虚部" note="rFFT 的前 n/2 + 1 项" color={C.cyan} width={CW - 1120} />
        <Row name="周期取整" value="ceil(n / f)" note="再夹到 [2, n]，避免零周期" color={C.amber} width={CW - 1120} />
        <Row name="并列怎么办" value="频率小优先" note="不赌排序稳定性" color={C.violet} width={CW - 1120} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>周期是测量出来的，不是调参调出来的。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="04 / 实现" title="折叠与聚合：一条轴环形" goal="列方向循环，行方向零填" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1040 }}>
      <Card label="src/TsBase/Algos/Ch03/TwoDConvAgg.hs" accent={C.cyan} pad={18}>
        <CodeBlock
          lines={[
            { t: "timesBlock k r x =", hi: true },
            { t: "  let cols = head r            -- 周期 = 列", dim: true },
            { t: "      rows = ceiling (len / cols)", dim: true },
            { t: "      z    = fold rows cols (padTo (rows*cols) x)", dim: true },
            { t: "      ws   = normalize (amps r)   -- ΣA = 1", dim: true },
            { t: "  in  sum [ ws!i * conv2d (z!i) | i <- [0 .. k-1] ]", dim: true },
            { t: "  where conv2d = circularOn Cols . zeroPadRows", dim: true },
          ]}
          width={1000}
          size={FT.code}
        />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1070, top: 330, width: CW - 1070 }}>
      <Card label="两条边界，别写反" accent={C.coral} style={{ height: 400 }}>
        <Row name="列方向" value="环形" note="相位走完一圈接开头" color={C.cyan} width={CW - 1120} />
        <Row name="行方向" value="零填充" note="周期轴到头就是边界" color={C.coral} width={CW - 1120} />
        <Row name="先补齐" value="rows × cols" note="补到整数倍再 reshape" color={C.amber} width={CW - 1120} />
        <Row name="再归一化" value="ΣA = 1" note="否则周期数变了输出幅度就变" color={C.violet} width={CW - 1120} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW, display: "flex", gap: 22 }}>
      <Stat label="列方向环形测试" value={M.struct.circularAt.toString()} accent={C.cyan} style={{ width: 560 }} sub={<span>绕回的值符合预期</span>} />
      <Stat label="行方向零填充" value={M.struct.zeroRowAt.toString()} accent={C.coral} style={{ width: 560 }} sub={<span>越界读到的是零</span>} />
      <Stat label="恒等块误差" value={ez(M.struct.blockIdentityErr)} accent={C.violet} style={{ width: 560 }} sub={<span>1×1 核 + 归一化权重</span>} />
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="04 / 实现" title="三条纪律，三个可独立测试的模块" goal="不共享参数，不互相导入" />
    <div style={{ position: "absolute", left: PAD, top: 350, width: CW, display: "flex", gap: 22 }}>
      <Card label="纪律一" accent={C.cyan} style={{ flex: 1, height: 380 }}>
        <Body size={FT.h2} color={C.ink}>不共享参数。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          三个模块各管一段：卷积、频率、聚合。没有隐藏的全局状态，也没有互相初始化。
        </Body>
      </Card>
      <Card label="纪律二" accent={C.amber} style={{ flex: 1, height: 380 }}>
        <Body size={FT.h2} color={C.ink}>不互相导入。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          算法模块只依赖核心张量类型，互不引用。这样每个模块都能单独编译、单独测。
        </Body>
      </Card>
      <Card label="纪律三" accent={C.violet} style={{ flex: 1, height: 380 }}>
        <Body size={FT.h2} color={C.ink}>先测形状再测值。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          前向、解析梯度、边界、错误输入，四类断言分开写；形状错了，数值对也没意义。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 770, width: CW }}>
      <Card label="关于屏幕上的代码" accent={C.coral} pad={20}>
        <Body size={FT.body} color={C.ink}>
          示意摘录：函数名、参数排布与真实模块一致，循环写成伪代码；完整实现和测试在 ts-base 仓库。
        </Body>
      </Card>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, pageAt("implementation", 9), pageAt("implementation", 16), pageAt("implementation", 20)]}>
    <P1 />
    <P2 />
    <P3 />
    <P4 />
  </Pages>
);
