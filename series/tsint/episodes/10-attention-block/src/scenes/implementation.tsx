import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, CodeBlock, K, M, PAD, Pages, Row, Scene, SceneHead, Stat, lf } from "../shared";

/* 实现：布局、softmax 反向、权重梯度、可复现与错误路径。 */

export const SImplementation: React.FC = () => {
  const m = M;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={[0, 0.27, 0.52, 0.77]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第一件容易写错的事：布局。行主序，T × d_k，一处写反就会崩。
          </div>
          <Build at={lf("implementation", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 30 }}>
              <Card label="矩阵怎么铺平" accent={C.cyan} style={{ width: 900, height: 430 }}>
                <CodeBlock
                  title="row-major layout"
                  width={840}
                  size={FT.meta}
                  at={lf("implementation", 0.05)}
                  lines={[
                    { t: "x[t][j]  ->  flat[t * d + j]", hi: true },
                    { t: "A[i][j]  ->  flat[i * T + j]", hi: true },
                    { t: "" },
                    { t: "-- Q K V 都是 T x d_k；A 是 T x T", dim: true },
                    { t: "-- 转置只改索引，不改数据", dim: true },
                    { t: "" },
                    { t: "matMul a b i j = sum [a!i!k * b!k!j | k]", hi: true },
                  ]}
                />
              </Card>
              <div style={{ width: 846 }}>
                <Row name="输入形状" value="16 × 24" note="内容 8 维拼位置码 16 维" width={846} />
                <Row name="分数矩阵" value="16 × 16" note="T² 个分数，这就是二次成本" width={846} />
                <Row name="输出形状" value="16 × 8" note="每个位置输出内容维度的向量" width={846} />
                <Row name="踩过的坑" value="单通道过、两层崩" note="第一个实现按时间主序铺，多通道时权重错位" color={C.coral} width={846} />
              </div>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第二件：softmax 的导数。一行里所有位置共享同一个减数。
          </div>
          <Build at={lf("implementation", 0.3)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 30 }}>
              <Card label="前向" accent={C.cyan} style={{ width: 760, height: 400 }}>
                <CodeBlock
                  width={700} size={FT.meta} at={lf("implementation", 0.32)}
                  lines={[
                    { t: "softmaxRow z =" },
                    { t: "  let m = maximum z", hi: true },
                    { t: "      e = map (exp . subtract m) z", hi: true },
                    { t: "  in map (/ sum e) e", hi: true },
                  ]}
                />
                <Body size={FT.meta} style={{ marginTop: 14 }}>先减行最大，避免 exp 溢出；结果与不减时逐位一致。</Body>
              </Card>
              <Card label="反向" accent={C.violet} style={{ width: 986, height: 400 }}>
                <CodeBlock
                  width={926} size={FT.meta} at={lf("implementation", 0.34)}
                  lines={[
                    { t: "dLogits[i][j] = A[i][j] * (dA[i][j] - dot_row)", hi: true },
                    { t: "dot_row = sum_k A[i][k] * dA[i][k]", hi: true },
                    { t: "" },
                    { t: "dQ = dLogits * K / sqrt d_k", dim: true },
                    { t: "dWq = transpose dQ * X", hi: true },
                  ]}
                />
                <Body size={FT.meta} style={{ marginTop: 14 }}>减数是整行共享的标量；写成逐元素就差了一个求和顺序。</Body>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            第三件：可复现。同一种子，两次训练必须逐位相同。
          </div>
          <Build at={lf("implementation", 0.55)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 26 }}>
              <Card label="训练配方" accent={C.cyan} style={{ width: 880, height: 400 }}>
                <Row name="优化器" value="Adam" note="beta = 0.9 / 0.999，eps = 1e-8" width={820} />
                <Row name="学习率" value="0.01" note="相加版本用 3e-3，明显不够" width={820} />
                <Row name="批大小" value="32" note="300 步，每步 32 条序列" width={820} />
                <Row name="随机数" value="splitmix64" note="自己写，不用 System.Random" color={C.violet} width={820} />
              </Card>
              <Card label="复现性怎么测" accent={C.violet} style={{ width: 870, height: 400 }}>
                <Row name="同 seed" value="逐位相等" note="两次 copyTrain 的参数向量完全一样" color={C.cyan} width={810} />
                <Row name="换 seed" value="参数不同" note="只改变初始化，不改变结构" width={810} />
                <Row name="为什么" value="让证据可复现" note="每个数字都能被同一个命令重跑出来" width={810} />
                <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                  <Chip color={C.cyan}>seed 42</Chip>
                  <Chip color={C.violet}>300 steps</Chip>
                  <Chip color={C.amber}>batch 32</Chip>
                </div>
              </Card>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            错误路径也测了：形状、长度、非有限、头数。只实现单头是有意的。
          </div>
          <Build at={lf("implementation", 0.8)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Stat label="长度不符" accent={C.coral} value="AttnBadShape" sub="Q 的行数不是 d_k 的整数倍" valueSize={44} valueColor={C.coral} style={{ width: 430, height: 210 }} />
              <Stat label="T 非正" accent={C.coral} value="AttnBadT" sub="序列长度为零或负数" valueSize={44} valueColor={C.coral} style={{ width: 430, height: 210 }} />
              <Stat label="含 NaN" accent={C.coral} value="AttnNonFinite" sub="输入先过一遍有限性检查" valueSize={44} valueColor={C.coral} style={{ width: 430, height: 210 }} />
              <Stat label="头数 ≠ 1" accent={C.amber} value="不支持" sub="单头是本集的刻意边界" valueSize={44} valueColor={C.amber} style={{ width: 430, height: 210 }} />
            </div>
          </Build>
          <Build at={lf("implementation", 0.88)}>
            <div style={{ position: "absolute", left: PAD, top: 566, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 150 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>代码四百多行，注释比代码多：每个数字都要能追到它的来源。</div>
                <K style={{ display: "block", marginTop: 10 }}>TsBase.Algos.Ch02.Attention · 32 条断言</K>
              </Card>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
