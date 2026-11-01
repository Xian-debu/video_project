import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Mono, Formula, Chip, KV } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 14), pageAt("definitions", 39)];
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：三张公式 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 306, width: CW, display: "flex", gap: 26 }}>
            <Card label="式 4.10 · 重构 MSE" accent={C.cyan} style={{ width: 550 }}>
              <Formula size={36} note="窗内所有格子求平方差，除以格子数">
                R = Σ Σ (x − x̂)²
                <br />
                ／ (C·d)
              </Formula>
              <Body size={FT.meta} style={{ marginTop: 16 }}>C 是窗长，d 是通道数。分母只除一次。</Body>
            </Card>
            <Card label="式 4.11 · 重构 MAE" accent={C.amber} style={{ width: 550 }}>
              <Formula size={36} note="平方换成绝对值，分母不变">
                R = Σ Σ |x − x̂|
                <br />
                ／ (C·d)
              </Formula>
              <Body size={FT.meta} style={{ marginTop: 16 }}>同一个窗，同一个重构，只换范数。</Body>
            </Card>
            <Card label="式 4.14 · 预测" accent={C.violet} style={{ width: 550 }}>
              <Formula size={36} note="只看窗尾 F 个点，分母换成 F">
                R = Σ Σ (x − x̂)²
                <br />
                ／ (F·d)
              </Formula>
              <Body size={FT.meta} style={{ marginTop: 16 }}>不看整个窗，只考核“往后 F 步”。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 748, width: 1180 }}>
            <Body size={FT.body}>三个公式都很短，但每一处都能埋坑：分母、窗口、标签。</Body>
            <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
              <Chip color={C.coral}>分母只除一次</Chip>
              <Chip color={C.amber}>标签与窗口同形</Chip>
              <Chip color={C.violet}>折叠先于指标</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：两个坑与密度 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 990 }}>
            <Card label="第一处 · 分母" accent={C.coral}>
              <Formula size={40} note="除以格子数，只除一次">R = Σ Σ (x − x̂)² ／ (C·d)</Formula>
              <Row name="格子数" value="窗长 × 通道数" note="C · d" width={930} />
              <Row name="正确" value="÷ (C·d)" note="一个窗口一个数，量纲一致" width={930} color={C.cyan} />
              <Row name="错法" value="÷ (C·d) ÷ d" note="再除一遍通道数" width={930} color={C.coral} />
              <Row name="后果" value="分数整体缩 d 倍" note="排序不变，测试也不会报错 —— 静默错" width={930} />
            </Card>
            <div style={{ marginTop: 22 }}>
              <Body size={FT.meta}>它不会让程序崩，只会让换一个数据集之后的分数不可比。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 300, width: 700 }}>
            <Card label="第二处 · 窗口" accent={C.amber}>
              <Formula size={40} note="式 4.2：窗口从 t − C + 1 到 t">x[t−C+1 … t]</Formula>
              <Row name="窗口数" value="⌊(T − C)/s⌋ + 1" note="T 总长，C 窗长，s 步长" width={650} />
              <Row name="代入" value={M.window.count + " 窗"} note={"T = " + M.data.rows + "，C = " + M.window.len + "，s = " + M.window.stride} width={650} />
              <Row name="标签" value="与窗口同形" note="逐点 0/1，不是一个窗一个标签" width={650} />
            </Card>
            <Card label="这里出事了" accent={C.coral} style={{ marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 54, color: C.coral, lineHeight: 1.1 }}>{M.labels.windows} / {M.window.count}</div>
              <Body size={FT.body} style={{ marginTop: 12 }}>
                窗长 100，步长 10：一个点落在十个窗口里。百分之一的点异常，就让 {(M.labels.rate * 100).toFixed(2)}% 的窗口带标签。
              </Body>
              <div style={{ marginTop: 16 }}><Chip color={C.coral}>窗口级 F1 不可用</Chip></div>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：调整与 golden */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 990 }}>
            <Card label="折叠与调整" accent={C.violet}>
              <KV k="折叠" v="任一窗口标它，就算异常" note="586 个窗口 → 5,950 个逐点标签" />
              <Row name="点调整" value="命中一段任一点 → 整段命中" note="书里只提一句，公式按 Tatbul 2018 的口径" width={930} />
              <Row name="范围调整" value="覆盖比例 ≥ α → 命中" note="α 取 0.2；盖得不够就不算" width={930} />
              <Row name="折叠顺序" value="先折叠，再算指标" note="反过来算的是窗口级 F1，密度 53%，没有意义" width={930} color={C.cyan} />
            </Card>
            <div style={{ marginTop: 24 }}>
              <Body size={FT.body}>这两个调整没有公式可抄，只能把口径说死 —— 说死了，读数才有意义。</Body>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1120, top: 300, width: 700 }}>
            <Card label="golden 值 · 钉进单元测试" accent={C.cyan}>
              <Row name="完美重构" value="0" note="严格零，不是 1e-12" width={650} />
              <Row name="[1, 2] → [0, 0]" value="2.5" note="平方差 5，除以 2 个格子" width={650} />
              <Row name="输入翻倍" value="10.0" note="四倍关系：2.5 × 4" width={650} />
              <Row name="预测版 · 行尾十个 2" value="4.0" note="0² ×90 + 2² ×10，除以 F = 10" width={650} color={C.cyan} />
              <Row name="切窗 · C = 3" value="[1,2,3] [2,3,4] [3,4,5]" note="步长 1" width={650} />
              <Row name="折叠 · 单个掩码" value="假 假 真 假 假" note="第三位被标，折回逐点只亮第三位" width={650} />
            </Card>
            <div style={{ marginTop: 20 }}>
              <Mono size={FT.meta} color={C.inkFaint}>这些数，手算就能验。</Mono>
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
