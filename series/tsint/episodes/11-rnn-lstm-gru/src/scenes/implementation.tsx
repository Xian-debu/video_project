import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, Formula, K, KV, M, PAD, Pages, Row, Scene, SceneHead, Stat, fmtE, lf } from "../shared";

/* 实现：手写 BPTT；三个坑：末步 tanh′、Adam 第零步、梯度检查阈值。 */

export const SImplementation: React.FC = () => {
  const m = M;
  const g = m.grad;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={[0, 0.28, 0.54, 0.78]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            前向扫一遍存中间量，反向就是 BPTT。
          </div>
          <Build at={lf("implementation", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 306 }}>
              <CodeBlock title="bpttStep（RNN 的循环体，LSTM / GRU 同形）" width={1140} size={17} lines={[
                { t: "bpttStep p dy (x, hPrev, h, pre) =" },
                { t: "  let dhOut  = matTVec (rpWhy p) dy      -- 输出头" },
                { t: "      dPre   = vMul dhOut (V.map tanhDeriv pre)" , hi: true },
                { t: "      dhPrev = vAdd (matTVec (rpWxh p) dPre)" },
                { t: "                    (matTVec (rpWhh p) dPre)" },
                { t: "      dWxh   = outer dPre x", dim: true },
                { t: "      dWhh   = outer dPre hPrev", dim: true },
                { t: "      dbh    = dPre", dim: true },
                { t: "  in (dhPrev, dWxh, dWhh, dbh)" },
              ]} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.12)}>
            <div style={{ position: "absolute", left: PAD + 1180, top: 306, width: 596 }}>
              <Card label="三个坑 · 都写进了模块头" accent={C.coral} style={{ width: 596, height: 470 }}>
                <KV k="一 · 末步 dh" v="不该再乘 tanh′" note="否则梯度小一整个因子" color={C.coral} />
                <KV k="二 · Adam 步数" v="从 1 起算" note="第零步偏置校正除零，参数全 NaN" color={C.coral} />
                <KV k="三 · 舍入" v="阈值分档" note="中心差分误差随网络变大" color={C.coral} />
                <K style={{ display: "block", marginTop: 18 }}>三个坑都能复现，测试里钉住了前两个</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.2)}>
            <div style={{ position: "absolute", left: PAD, top: 690, display: "flex", gap: 22 }}>
              <Chip color={C.cyan}>手写反向，不用自动微分</Chip>
              <Chip color={C.violet}>参数 / 梯度都可扁平化</Chip>
              <Chip color={C.amber}>三个模块互不 import</Chip>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一个坑：最后一步的 dh，不该再乘一次激活导数。
          </div>
          <Build at={lf("implementation", 0.31)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <CodeBlock title="修前 / 修后（只差一行）" width={1120} size={17} lines={[
                { t: "-- 修前：把末步也当成循环体的输入" },
                { t: "dhLast = vMul (matTVec (rpWhy p) dy)" , dim: true },
                { t: "                  (V.map tanhDeriv preT)" , dim: true },
                { t: "", dim: true },
                { t: "-- 修后：从输出头直接取，循环体的导数在 bpttStep 里" },
                { t: "dhLast = matTVec (rpWhy p) dy" , hi: true },
                { t: "", dim: true },
                { t: "-- 一步网络的解析 / 数值（相对误差）" },
                { t: "修前 0.9584   修后 1.554e-09" },
              ]} />
            </div>
            <div style={{ position: "absolute", left: PAD + 1160, top: 306, display: "flex", flexDirection: "column", gap: 14 }}>
              <Stat label="一步 · 修前" accent={C.coral} value="0.9584" sub="差百分之四，肉眼几乎看不出来" valueColor={C.coral} valueSize={54} style={{ width: 616, height: 140 }} />
              <Stat label="一步 · 修后" accent={C.cyan} value="1.554e−09" sub="中心差分的舍入量级" valueColor={C.cyan} valueSize={54} style={{ width: 616, height: 140 }} />
              <Stat label="两步 · 修后" accent={C.violet} value="5.218e−09" sub="T = 2 也一样干净" valueColor={C.violet} valueSize={54} style={{ width: 616, height: 140 }} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.42)}>
            <div style={{ position: "absolute", left: PAD, top: 776, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.coral, borderRadius: 12, padding: "16px 24px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.ink }}>这种错不会报错，只会让训练变慢、结果变差；只有梯度检查能抓到它。</div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二个坑：Adam 的偏置校正从第零步开始是无穷大。
          </div>
          <Build at={lf("implementation", 0.57)}>
            <div style={{ position: "absolute", left: PAD, top: 306, width: 1120 }}>
              <CodeBlock title="adamParams · 步数从 1 起" width={1120} size={17} lines={[
                { t: "-- 修前：step 从 0 开始" },
                { t: "lr * mhat / (sqrt vhat + eps)" },
                { t: "  where mhat = m / (1 - b1 ** step)" , dim: true },
                { t: "        -- step = 0 → 1 - 1 = 0 → Infinity" , dim: true },
                { t: "", dim: true },
                { t: "-- 修后：计数从 1 开始" },
                { t: "adamParams lr (step + 1) g" , hi: true },
              ]} />
            </div>
            <div style={{ position: "absolute", left: PAD + 1160, top: 306, width: 616 }}>
              <Card label="症状：训练安静地失败" accent={C.coral} style={{ width: 616, height: 430 }}>
                <Row name="参数" value="全变 NaN" note="一次除零污染整个向量" color={C.coral} width={560} />
                <Row name="损失" value="全是 1e18" note="NaN 传播后的哨兵值" width={560} />
                <Row name="修后" value="1.218 → 0.411" note="八十轮，合成任务的训练损失" color={C.cyan} width={560} />
                <K style={{ display: "block", marginTop: 16 }}>这个坑也解释了：为什么训练曲线一开始全是常数</K>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三个坑是舍入：梯度检查的阈值要按网络大小分档。
          </div>
          <Build at={lf("implementation", 0.81)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1120 }}>
              <Card label="中心差分 · 3 × 8 探针、D = 8、H = 12、seed 42" accent={C.cyan} style={{ width: 1120, height: 400 }}>
                <Row name="RNN" value={fmtE(g.gradcheck.rnn, 3)} note={"阈值 " + fmtE(g.bound.rnn, 0) + "，通过"} color={C.cyan} width={1060} />
                <Row name="LSTM" value={fmtE(g.gradcheck.lstm, 3)} note={"阈值 " + fmtE(g.bound.lstm, 0) + "，通过"} color={C.violet} width={1060} />
                <Row name="GRU" value={fmtE(g.gradcheck.gru, 3)} note={"阈值 " + fmtE(g.bound.gru, 0) + "，通过"} color={C.amber} width={1060} />
                <Row name="为什么分档" value="H 越大，误差越大" note="小网络能到 1e−9，默认网络只能到 1e−5" width={1060} />
                <Row name="阈值来源" value="实测值 × 2 以内" note="不是拍脑袋，是量出来再定的" width={1060} />
              </Card>
            </div>
            <div style={{ position: "absolute", left: PAD + 1160, top: 312, width: 616 }}>
              <Card label="训练配置 · 三个模型同一套" accent={C.violet} style={{ width: 616, height: 400 }}>
                <Row name="优化器" value="Adam 1e−2" note="批量 32，MSE 不除二" width={560} />
                <Row name="轮数" value={"最多 " + m.delay.epochs + " 轮"} note={"patience " + m.delay.patience + "，早停还原最优轮"} width={560} />
                <Row name="初始化" value="Xavier" note="splitmix64，种子 42，可复现" width={560} />
                <Row name="并行" value="12 路" note="forkIO + MVar，十五次训练四分钟跑完" color={C.violet} width={560} />
              </Card>
            </div>
          </Build>
          <Build at={lf("implementation", 0.93)}>
            <div style={{ position: "absolute", left: PAD, top: 760, display: "flex", alignItems: "center", gap: 16 }}>
              <Formula size={26} color={C.inkFaint}>数值梯度 ≈ (L(θ+h) − L(θ−h)) / 2h</Formula>
              <Body size={FT.meta}>h 取 1e−6；只用来验证解析梯度，不参与训练</Body>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
