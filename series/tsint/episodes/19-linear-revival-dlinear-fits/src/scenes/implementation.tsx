import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, CodeBlock, Head, K, M, PAD, Pages, Row, Stat, fmtE, fmtInt, pageAt } from "../shared";

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="共享线性：一个 generate 就是前向" goal="解析梯度，行主序扁平参数" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1010 }}>
      <CodeBlock width={1010} size={17} title="src/TsBase/Algos/Ch03/LinearShared.hs" lines={[
        { t: "sharedForward m x = V.generate f row" },
        { t: "  where row k = b V.! k + dot (V.slice (k*h) h w) x" },
        { t: "" },
        { t: "sharedLossGrad samples m = (loss, V.concat [gw, gb])" },
        { t: "  where dy = [forward x - y | (x, y) <- samples]" },
        { t: "        coef = 2 / (N * F)" },
        { t: "        gw = [coef * Σ dy_k * x_i | k <- 0..F-1, i <- 0..H-1]" },
        { t: "        gb = [coef * Σ dy_k       | k <- 0..F-1]" },
        { t: "" },
        { t: "sharedBatch m = map (sharedForward m)   -- 八路共享" },
        { t: "sharedFromParams h f p = W = p[0..h*f), b = p[h*f..]" },
      ]} />
      <div style={{ marginTop: 16 }}>
        <K color={C.inkFaint}>示意摘录：函数名与参数排布与真实模块一致，循环写成伪代码</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1040, top: 340, width: CW - 1040 }}>
      <Stat label="参数量" value={fmtInt(M.meta.params.shared)} accent={C.cyan} style={{ height: 140 }} sub={<span>(96 + 1) × 24</span>} />
      <Stat label="梯度 / 数值差分" value={fmtE(M.grad.shared)} accent={C.amber} style={{ height: 160, marginTop: 16 }} sub={<span>门槛 1e-6</span>} />
      <Card label="口径" accent={C.violet} style={{ marginTop: 16 }}>
        <Row name="损失" value="MSE，分母 N·F" width={520} />
        <Row name="初始化" value="U(±1/√H)，b = 0" width={520} />
        <Row name="批量恒等" value={"max err " + M.struct.batchErr} width={520} />
      </Card>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="DLinear：分解必须先通过三项断言" goal="复制填充、奇数核、恒等式" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1050 }}>
      <CodeBlock width={1050} size={17} title="src/TsBase/Algos/Ch03/DLinear.hs" lines={[
        { t: "dlinearDecompose k x" },
        { t: "  | k < 1     = Left \"dlinear: kernel must be >= 1\"" },
        { t: "  | even k    = Left \"dlinear: kernel must be odd\"" },
        { t: "  | V.null x  = Left \"dlinear: empty input\"" },
        { t: "  | otherwise = Right (trend, V.zipWith (-) x trend)" },
        { t: "  where padded = [head x]*(k/2) ++ x ++ [last x]*(k/2)" },
        { t: "        trend  = [sum (padded[t..t+k)) / k | t <- 0..n-1]" },
        { t: "" },
        { t: "forward m x = do" },
        { t: "  (t, s) <- dlinearDecompose (dlK m) x" },
        { t: "  pure (branch Wt bt t + branch Ws bs s)" },
      ]} />
      <div style={{ marginTop: 14 }}><K color={C.inkFaint}>示意摘录：判定顺序与返回类型照抄模块，填充写法简化</K></div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1080, top: 340, width: CW - 1080 }}>
      <Stat label="参数量" value={fmtInt(M.meta.params.dlinear)} accent={C.amber} style={{ height: 140 }} sub={<span>2 × 97 × 24</span>} />
      <Stat label="梯度 / 数值差分" value={fmtE(M.grad.dlinear)} accent={C.amber} style={{ height: 160, marginTop: 16 }} sub={<span>门槛 1e-6</span>} />
      <Card label="三项断言" accent={C.cyan} style={{ marginTop: 16 }}>
        <Row name="t + s = x" value={fmtE(M.struct.decompErr)} width={520} />
        <Row name="k = 1 退化差距" value={fmtE(M.struct.k1EquivErr)} width={520} />
        <Row name="偶数核报错" value="Left" width={520} />
      </Card>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 实现" title="FITS：频域基矩阵一次算好" goal="只保留 R = 24 个频点" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1030 }}>
      <CodeBlock width={1030} size={16} title="src/TsBase/Algos/Ch03/Fits.hs" lines={[
        { t: "fitsBins n r x = [Re Z_0..Re Z_{r-1}, Im Z_0..Im Z_{r-1}]" },
        { t: "  Re_k = Σ_t x_t cos(2πkt/n)" },
        { t: "  Im_k = -Σ_t x_t sin(2πkt/n)" },
        { t: "" },
        { t: "fitsBasis n f r = V.generate (f * 2r) coeff" },
        { t: "  t = i / 2r;  a = i % 2r;  k = a % r" },
        { t: "  θ = 2π k (n - f + t) / n;  w = reWeight n k" },
        { t: "  a < r ?  w cos θ  :  -w sin θ" },
        { t: "" },
        { t: "u = W z + b;  yhat = B u   -- 只取最后 f 行" },
      ]} />
      <div style={{ marginTop: 14 }}>
        <K color={C.amber}>示意摘录 · DC 与 Nyquist 权重 1/n，其余 2/n；丢掉 DC，误差立刻爆</K>
      </div>
    </div>
    <div style={{ position: "absolute", left: PAD + 1060, top: 340, width: CW - 1060 }}>
      <Stat label="参数量" value={fmtInt(M.meta.params.fits)} accent={C.violet} style={{ height: 140 }} sub={<span>4R² + 2R，R = 24</span>} />
      <Stat label="往返误差" value={fmtE(M.struct.fftRoundTrip)} accent={C.cyan} style={{ height: 160, marginTop: 16 }} sub={<span>49 个频点；门槛 1e-10</span>} />
      <Stat label="DC 保持误差" value={fmtE(M.struct.dcErr)} accent={C.cyan} style={{ height: 160, marginTop: 16 }} sub={<span>均值 = Re Z_0 / n</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 850, width: CW }}>
      <Card label="训练协议 · 三个模型完全相同" accent={C.amber} pad={18}>
        <div style={{ display: "flex", gap: 60 }}>
          <Body size={FT.body}>Adam，lr = {M.meta.training.lr}，全批量</Body>
          <Body size={FT.body}>最多 {M.meta.training.epochsCap} 轮，耐心 {M.meta.training.patience}</Body>
          <Body size={FT.body}>训练窗步长 {M.meta.training.stride}，验证全用</Body>
          <Body size={FT.body}>早停看完整验证集，反变换后算 MAE</Body>
        </div>
      </Card>
    </div>
  </>
);

export const SImplementation: React.FC = () => (
  <Pages id="implementation" at={[0, pageAt("implementation", 10), pageAt("implementation", 20)]}>
    <P1 />
    <P2 />
    <P3 />
  </Pages>
);