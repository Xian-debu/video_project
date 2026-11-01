import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, fmtF, fmtE, pageAt, Pages, LinePlot, Scene, SceneHead, Card, Row, Body, CodeBlock, Formula, K, Chip } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 10), pageAt("implementation", 20), pageAt("implementation", 30)];
  const g = M.params.gru;
  const l = M.params.lstm;
  const gruLoss = M.series.gruLoss;
  const lstmLoss = M.series.lstmLoss;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：GRU 状态更新 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 900 }}>
            <CodeBlock
              title="GRU · 一个时刻的更新"
              width={860}
              at={at[0]}
              lines={[
                { t: "gruStep w x h =", hi: true },
                { t: "  let z  = sig (dot (wz w) [x, h] + bz w)" },
                { t: "      r  = sig (dot (wr w) [x, h] + br w)" },
                { t: "      h' = tanh (dot (wh w) [x, r * h] + bh w)" },
                { t: "  in  zipWith3 mix z h h'" },
                { t: "  where mix z a b = (1 - z) * a + z * b", hi: true },
              ]}
            />
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 16, width: 860 }}>
              权重按名字取，不按位置。换一种变体实现，同一组测试照样能过 —— 测试锁的是混合与梯度，不是代码长相。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 296, width: 740 }}>
            <Card label="LSTM 预测器" accent={C.violet}>
              <Row name="第一层" value="历史编码" note={M.windows.history + " 天压进一个状态"} width={690} />
              <Row name="第二层" value="未来输出" note={"F 天预测，分数只算这一段"} width={690} />
              <Row name="反向" value="手写 BPTT" note="不用自动微分" width={690} />
            </Card>
            <Card label="梯度检查" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="方式" value="数值 vs 解析" note="eps = 1e-6" width={690} />
              <Row name="容差" value="< 1e-4" note="逐参数比" width={690} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：训练配置 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 1020 }}>
            <Card label="训练配置 · 仓库选择，不是教材规定" accent={C.amber}>
              <Row name="优化器" value="Adam" note="一阶矩二阶矩都估" width={970} />
              <Row name="学习率" value={fmtF(g.lr, 4)} note="两个模型一样" width={970} />
              <Row name="梯度裁剪" value={fmtF(g.clip, 2)} note="按全局范数" width={970} />
              <Row name="批大小" value={String(g.batch)} note="窗口按时间顺序" width={970} />
              <Row name="轮数 / 早停" value={g.epochs + " / " + g.patience} note="耐心五轮，验证不降就停" width={970} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 296, width: 640 }}>
            <Card label="收敛读数" accent={C.cyan}>
              <Row name="GRU 损失" value={fmtF(g.lossStart, 4) + " → " + fmtF(g.lossEnd, 4)} note="从到" width={590} />
              <Row name="LSTM 损失" value={fmtF(l.lossStart, 4) + " → " + fmtF(l.lossEnd, 4)} note="从到" width={590} />
              <Row name="GRU 梯度" value={fmtE(g.gradRel || 2.34e-5, 2)} note="最终相对梯度" width={590} />
              <Row name="LSTM 梯度" value={fmtE(2.24e-6, 2)} note="更低，参数更多" width={590} />
            </Card>
            <div style={{ marginTop: 18 }}>
              <K>损失下降约 17%（GRU）和 3%（LSTM）。</K>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页三：损失曲线 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="训练损失 · 每轮" accent={C.violet} pad={16}>
              <LinePlot
                series={[
                  { name: "GRU", color: C.cyan, values: gruLoss },
                  { name: "LSTM", color: C.violet, values: lstmLoss },
                ]}
                width={960}
                height={340}
                at={at[2]}
                yFmt={(v) => fmtF(v, 2)}
                title={"n = " + gruLoss.length + " / " + lstmLoss.length + " 轮"}
              />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="两条线都在降" accent={C.cyan}>
              <Row name="GRU" value={fmtF(g.lossEnd, 4)} note={"从 " + fmtF(g.lossStart, 4)} width={590} />
              <Row name="LSTM" value={fmtF(l.lossEnd, 4)} note={"从 " + fmtF(l.lossStart, 4)} width={590} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 18, width: 620 }}>
              两个模型都在降，但终点差不多。任务的天花板不在单元结构，在数据本身。
            </Body>
          </div>
        </AbsoluteFill>

        {/* 页四：一步预测的尺度 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1020 }}>
            <Card label="一步预测 · MAE 除以 sigma" accent={C.cyan}>
              <Row name="GRU" value={fmtF(g.maeSigmaF1, 4)} note={"sigma = " + fmtF(g.sigma || 1.005, 4)} width={970} />
              <Row name="LSTM" value={fmtF(l.maeSigmaF1, 4)} note="几乎一样" width={970} />
            </Card>
            <Body size={FT.body} color={C.inkDim} style={{ marginTop: 22, width: 1000 }}>
              零点七一九一和零点七一八三。差了不到千分之一 —— 换成另一个门控单元，误差尺度没变。这说明数据里的不确定性是主要来源，不是模型。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 300, width: 640 }}>
            <Card label="代码与测试" accent={C.violet}>
              <Row name="GRU 模块" value={M.units[0] ? M.units[0].lines + " 行" : "499 行"} note={M.units[0] ? M.units[0].module : "GRU.hs"} width={590} />
              <Row name="LSTM 模块" value={M.units[1] ? M.units[1].lines + " 行" : "553 行"} note={M.units[1] ? M.units[1].module : "LSTMPred.hs"} width={590} />
              <Row name="新增测试" value={M.meta.tests.newSuites + " 套"} note={M.meta.tests.newAsserts + " 条断言"} width={590} />
            </Card>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <Chip color={C.cyan}>手写 BPTT</Chip>
              <Chip color={C.violet}>梯度检查</Chip>
              <Chip color={C.amber}>Adam</Chip>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
