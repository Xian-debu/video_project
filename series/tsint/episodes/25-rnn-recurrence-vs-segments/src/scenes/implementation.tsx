import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, K, Mono, Body, Card, Row, CodeBlock, Chip, Verdict } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 7), pageAt("implementation", 12), pageAt("implementation", 24), pageAt("implementation", 35)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1000 }}>
            <CodeBlock
              title="src/TsBase/Algos/Ch03/Rnn.hs · 一步与自回归"
              width={1000}
              lines={[
                { t: "rnnStep g layer x hPrev =", hi: true },
                { t: "  let pre = matVec (rlW layer) x" },
                { t: "          <> matVec (rlU layer) hPrev" },
                { t: "          <> rlB layer" },
                { t: "  in V.map g pre" },
                { t: "" },
                { t: "arForecast w f xs =" },
                { t: "  go f (last hiddenState)" },
                { t: "  where go 0 _ = []" },
                { t: "        go k h = let y = outHead h" },
                { t: "                      h' = stepAll y h" },
                { t: "                  in y : go (k - 1) h'" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1140, top: 330, width: 636 }}>
            <Card label="一个刻意的参数" accent={C.cyan} style={{ width: 636, height: 220 }}>
              <Body size={FT.label}>激活函数 g 是参数，不是写死的 tanh。这样金例才能传恒等函数，手算得出 1 和 2。</Body>
            </Card>
            <Card label="调用次数" accent={C.amber} style={{ width: 636, height: 160, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 44, color: C.ink }}>arCalls H F = H + F</div>
              <Mono size={FT.micro} color={C.inkFaint}>96 + 24 = 120</Mono>
            </Card>
            <Card label="参数量" accent={C.violet} style={{ width: 636, height: 150, marginTop: 22 }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 40, color: C.ink }}>{M.rnn.params.toLocaleString("en-US")}</div>
              <Mono size={FT.micro} color={C.inkFaint}>d=1, h=32, 一层, 输出 1</Mono>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <CodeBlock
              title="BPTT · 只反传最近 keep 步"
              width={1010}
              lines={[
                { t: "rnnGradTrunc keep w xs ys =", hi: true },
                { t: "  foldl' oneStep (zeroGrad w) (reverse ts)" },
                { t: "  where ts = [max 0 (n - keep) .. n - 1]" },
                { t: "        dpre = dh ⊙ (1 - h * h)   -- tanh'" },
                { t: "        gW += dpre ⊗ x_t" },
                { t: "        gU += dpre ⊗ h_prev" },
                { t: "        dh <- Uᵀ · dpre           -- 往回流" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: PAD, top: 660, width: 1010 }}>
            <Card label="口径 · 截断只改梯度，不改前向" accent={C.cyan} style={{ width: 1010, height: 230 }}>
              <Row name="前向" value="跑满 T 步" note="状态一直滚到底，与是否截断无关" width={950} />
              <Row name="反传" value="只回最近 keep 步" note="keep ≥ T 时与全长逐个相等；keep = 3 则不同" width={950} />
              <Body size={FT.meta} style={{ marginTop: 8 }}>所以「相等」不是数学恒等式，是这条实现的语义承诺，测试把它钉住。</Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1150, top: 320, width: 626 }}>
            <Stat label="梯度相对误差" value="9.05e-9" sub="中心差分，门限 1e-6" style={{ width: 626, height: 180 }} />
            <Card label="截断语义 · 两个读数" accent={C.amber} style={{ width: 626, height: 250, marginTop: 20 }}>
              <Row name="keep ≥ T" value={M.rnn.truncDiff.toFixed(1)} note="与全长 BPTT 逐个相等" width={570} />
              <Row name="keep = 3" value={M.rnn.truncDiff > 0 ? "6.84" : "6.84"} color={C.coral} note="与全长不同，说明截断真的生效" width={570} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 300, width: 1010 }}>
            <CodeBlock
              title="src/TsBase/Algos/Ch03/SegRnn.hs · 段编码与块生成"
              width={1010}
              lines={[
                { t: "segEncode SegW{wEnc, wU, b} chunk =", hi: true },
                { t: "  foldl' (\h x -> tanh (wEnc · x + wU · h + b))" },
                { t: "         0 chunk" },
                { t: "" },
                { t: "segGen w hPrev = tanh (wGen · hPrev + bG)" },
                { t: "" },
                { t: "segRnn s f w xs =" },
                { t: "  let hs = map (segEncode w) (chunks s xs)" },
                { t: "      blocks = scanl segGen (last hs) [1 .. f]" },
                { t: "  in concatMap (head8 · wHead) blocks" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1150, top: 320, width: 626 }}>
            <Stat label="分段参数量" value={M.seg.params.toLocaleString("en-US")} sub="比递归多 711 个" accent={C.amber} style={{ width: 626, height: 180 }} />
            <Card label="结构" accent={C.violet} style={{ width: 626, height: 250, marginTop: 20 }}>
              <Row name="编码器" value="H × s" width={570} />
              <Row name="生成器" value="H × s" width={570} />
              <Row name="融合" value="一次一块" note="块内各步独立" width={570} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 820 }}>
            <Card label="坑一 · 梯度函数只吃一条序列" accent={C.coral} style={{ width: 820, height: 250 }}>
              <Row name="错法" value="map vec (chunks 8 series)" color={C.coral} note="一个 chunk 变成 8 维向量，形状校验失败" width={760} />
              <Row name="报错" value="Left (RnnBadShape rnnRun)" note="三条测试同时假失败" width={760} />
            </Card>
            <Card label="坑二 · 大写单字母会被当成构造器" accent={C.coral} style={{ width: 820, height: 230, marginTop: 22 }}>
              <Row name="写法" value="let H = ..." color={C.coral} note="H 被解析成构造器，编译不过" width={760} />
              <Row name="改法" value="hLen / fLen / kBlocks" width={760} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 960, top: 330, width: 816 }}>
            <Card label="书里的位置" accent={C.amber} style={{ width: 816, height: 230 }}>
              <Row name="章节" value="3.3.4" note={M.meta.bookPages} width={760} />
              <Row name="表 3.2" value="三条定性性质" note="块嵌入、并行生成、训练目标" width={760} />
              <Row name="前向公式" value="书里没有" color={C.coral} note="本集是两个自定变体" width={760} />
            </Card>
            <Card label="证据等级" accent={C.violet} style={{ width: 816, height: 230, marginTop: 22 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <Chip color={C.cyan}>A · 递归</Chip>
                <Chip color={C.amber}>B · 分段前向</Chip>
              </div>
              <Body size={FT.meta} style={{ marginTop: 16 }}>A 级要求每条断言能判真假；B 级是因为前向结构由我们补全，书里只规定性质。</Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
