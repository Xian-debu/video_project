import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Bars, CodeBlock, fmtInt, fmtP } from "../shared";

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  const v = M.aug.views;
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：三个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="模块 · 三件套" accent={C.cyan}>
              {M.modules.map((m) => (
                <Row key={m.name} name={m.name} value={fmtInt(m.lines) + " 行"} note={m.cases + " 条单元测试，全部纯函数"} width={960} />
              ))}
              <Row name="合计" value={fmtInt(M.modules.reduce((s, m) => s + m.lines, 0)) + " 行"} note={M.meta.tests.newAsserts + " 条新测试"} color={C.cyan} width={960} />
            </Card>
            <Card label="训练配置" accent={C.violet} style={{ marginTop: 20 }}>
              <Row name="轮数 / 学习率" value={M.params.epochs + " / " + M.params.lr} note={"种子 " + M.params.seed + "，可复现"} width={960} />
              <Row name="训练窗" value={M.windows.trainUsed + " 个"} note={"从 " + M.windows.train + " 个里每 " + M.windows.trainStride + " 取一"} width={960} />
              <Row name="对照" value="同结构、去邻接" note="W_n 那一项置零，其余逐位相同" width={960} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Body size={FT.lead} color={C.inkDim} style={{ width: 660, lineHeight: 1.7 }}>
              三件事拆开写：图怎么连、消息怎么传、损失怎么算。每一件都能单独测，也都能单独错。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
              <Chip color={C.cyan}>GNN.hs</Chip>
              <Chip color={C.violet}>Augment.hs</Chip>
              <Chip color={C.amber}>InfoNCE.hs</Chip>
            </div>
            <K style={{ display: "block", marginTop: 18 }}>纯函数，没有随机数表；种子只决定初始化。</K>
          </div>
        </AbsoluteFill>

        {/* 页二：六种增强 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1010 }}>
            <Card label="六种增强 · 与原序列的关系" accent={C.cyan}>
              <Bars
                items={[
                  { label: "抖动", value: v[0].corr ?? 0, color: C.cyan, text: v[0].corr == null ? "无定义" : v[0].corr.toFixed(4) },
                  { label: "缩放", value: v[1].corr ?? 0, color: C.cyan, text: v[1].corr == null ? "无定义" : v[1].corr.toFixed(4) },
                  { label: "裁剪", value: v[2].corr ?? 0, color: C.cyan, text: v[2].corr == null ? "无定义" : v[2].corr.toFixed(4) },
                  { label: "分块打乱", value: v[3].corr ?? 0, color: C.amber, text: v[3].corr == null ? "无定义" : v[3].corr.toFixed(4) },
                  { label: "频域掩码", value: v[4].corr ?? 0, color: C.cyan, text: v[4].corr == null ? "无定义" : v[4].corr.toFixed(4) },
                  { label: "差分", value: 0, color: C.coral, text: "长度少一 · 无定义", dim: true },
                ]}
                width={960}
                max={1}
                labelW={120}
                rowH={50}
              />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 14, width: 960 }}>
              相关只说明「改没改形状」。裁剪的相关是 1.0、最大差 0.0——它几乎什么都没做，却占了一个增强名额。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 288, width: 700 }}>
            <Card label="每种增强改了什么" accent={C.violet}>
              <Row name="抖动" value={"最大差 " + v[0].maxAbsDiff.toFixed(3)} note={"峰位 " + v[0].argmax + "，加小噪声"} width={640} />
              <Row name="缩放" value={"最大差 " + v[1].maxAbsDiff.toFixed(3)} note={"峰位 " + v[1].argmax + "，整体幅度变"} width={640} />
              <Row name="分块打乱" value={"最大差 " + v[3].maxAbsDiff.toFixed(3)} note={"峰位 " + v[3].argmax + "，时序被拆散"} color={C.amber} width={640} />
              <Row name="频域掩码" value={"最大差 " + v[4].maxAbsDiff.toFixed(3)} note={"峰位 " + v[4].argmax + "，只动高频"} width={640} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：余弦的坑 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1040 }}>
            <CodeBlock
              title="余弦相似度：两种写法"
              width={1000}
              size={FT.meta}
              lines={[
                { t: "right  = dot(u, v) / (norm u * norm v)   -- 正确", hi: true },
                { t: "wrong  = dot(u, v) / (norm u * norm u)   -- 错，自相似仍是 1" },
                { t: "", dim: true },
                { t: "diag 右: 1.0000    diag 错: 1.0000    -- 对角看不出来", dim: true },
                { t: "off-diag 最大差: " + M.cosine.maxOffDiff.toFixed(4) + "             -- 只在非对角暴露", hi: true },
              ]}
            />
            <Card label="为什么容易漏" accent={C.amber} style={{ marginTop: 22 }}>
              <Row name="对角" value="两种写法都是 1" note="对角线查不出这个错" width={980} />
              <Row name="非对角" value={"最大差 " + M.cosine.maxOffDiff.toFixed(4)} note="邻居排序会整体偏" width={980} />
              <Row name="范数范围" value={M.cosine.normMin.toFixed(2) + " 至 " + M.cosine.normMax.toFixed(2)} note="不等长，所以分母必须用两个范数" width={980} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 660 }}>
            <Body size={FT.body} color={C.inkDim} style={{ width: 620, lineHeight: 1.65 }}>
              这一条写进了负向检查：如果哪天有人把它改回去，非对角差会掉到零，证据会红。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
              <Chip color={C.coral}>只看对角会骗自己</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：训练循环 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1040 }}>
            <CodeBlock
              title="一轮训练在做什么"
              width={1000}
              size={FT.meta}
              lines={[
                { t: "encode  = encoder(win)            -- 12 x 12 x 100 -> 12 x 16" },
                { t: "A       = topkAdj(cos(encode))     -- 每行三条边，0/1" },
                { t: "hOut    = tanh(Ws*h + degNorm(Wn*Ah) + b)" },
                { t: "recon   = decoder(hOut)            -- 12 x 12 x 100" },
                { t: "loss    = mse(recon, win) + infoNCE(aug(win), tau)", hi: true },
                { t: "loss    = loss + 1e-4 * ||W||^2    -- 只压权重，不压邻接" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1180, top: 288, width: 700 }}>
            <Card label="两个坑" accent={C.coral}>
              <Row name="argmax" value="取成了索引" note="V.maximum 比较第一个分量，永远返回 99" width={660} />
              <Row name="elapsed" value="打印 0.0 秒" note="evaluate 只到 WHNF，惰性工作没被算" width={660} />
            </Card>
            <K style={{ display: "block", marginTop: 16 }}>两个都是「看上去对」的错，靠检查钉住。</K>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

