import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, CodeBlock, Chip, Verdict } from "../shared";

export const SImplementation: React.FC = () => {
  const at = [0, pageAt("implementation", 13), pageAt("implementation", 20), pageAt("implementation", 27)];
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <CodeBlock
              title="PatchEmbed.hs"
              width={1150}
              lines={[
                { t: "peForward :: PeCfg -> PeW -> V.Vector Double" },
                { t: "          -> Either PeError (Int, V.Vector Double)" },
                { t: "" },
                { t: "peForward cfg w x = do" },
                { t: "  let n = pePatchCount (pcLen cfg) (pcPat cfg) (pcStride cfg)" },
                { t: "      rows = [ patchRow cfg w i | i <- [0 .. n - 1] ]" },
                { t: "  pure (n, V.concat rows)", hi: true },
              ]}
            />
            <Body size={FT.label} style={{ marginTop: 18 }}>
              切片、乘矩阵、加偏置、加位置。一个入口，块数由窗口和步长现算，不写死。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 320, width: 558 }}>
            <Stat label="块嵌入" value={String(M.patch.params) + " 参数"} sub="每块共享同一套" style={{ width: 558, height: 210 }} />
            <Stat label="入口" value="peForward" sub="返回块数与十一乘三十二的表" accent={C.cyan} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: CW }}>
            <Card label="坑一 · 拼表用行主序，V.concat 是列主序" accent={C.coral} style={{ width: CW }}>
              <div style={{ display: "flex", gap: 22 }}>
                <CodeBlock
                  title="错法：一个通道一次 concat"
                  width={760}
                  lines={[
                    { t: "-- 每行是一个通道的 24 步" },
                    { t: "V.concat (map fwdChannel [0 .. n-1])", dim: true },
                    { t: "-- 展平后按列走，行主序被切乱" },
                  ]}
                />
                <CodeBlock
                  title="正法：先摆成行主序"
                  width={860}
                  lines={[
                    { t: "V.generate (f * n) $ \idx ->" },
                    { t: "  let j = div idx n; c = mod idx n" },
                    { t: "  in (cols !! c) V.! j", hi: true },
                  ]}
                />
              </div>
              <Row name="症状" value="通道差 3.402" note="看起来像模型不独立" color={C.coral} width={1660} />
              <Row name="真相" value="拼错了" note="模型本身逐通道独立，是输出装配的错" width={1660} />
              <Row name="修完" value={M.patchtst.channelDiff.toFixed(1)} note="通道差精确为零，1e−12 断言通过" color={C.cyan} width={1660} />
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <CodeBlock
              title="CrossAttnDecoder.hs · 方向只有一个"
              width={1150}
              lines={[
                { t: "caCrossBranch cfg w memory target = do" },
                { t: "  let q = target        -- 查询来自解码端" },
                { t: "      k = memory        -- 键来自编码端" },
                { t: "      v = memory" },
                { t: "  pure $ attnOut (caDim cfg) (caHeads cfg)" },
                { t: "         (caCrossWeights cfg w target memory)" },
                { t: "         (matMul v (cwCv w)) (cwCo w)", hi: true },
              ]}
            />
            <Row name="方向" value="Q=解码端，K/V=编码端" note="反过来也能跑，但那就不是解码器" width={1050} />
            <Row name="钉死方式" value="两个翻转测试" note="交换查询和记忆，输出必须变" width={1050} />
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="交叉权重" value={"24 × 96"} sub="查询乘记忆，不是记忆乘查询" accent={C.violet} style={{ width: 558, height: 210 }} />
            <Stat label="方向测试" value="通过" sub="交换后输出不同" accent={C.cyan} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="坑三 · 层归一化的 epsilon 要写进口径" accent={C.amber} style={{ width: 1150 }}>
              <CodeBlock
                title="层归一化"
                width={1050}
                lines={[
                  { t: "layerNormRow eps x =" },
                  { t: "  let v = var x; d = sqrt (v + eps)   -- eps = 1e-5" },
                  { t: "  in (x - mean x) / d", hi: true },
                ]}
              />
              <Row name="方差里加" value="1e−5" note="防止除零，数值稳定" width={1050} />
              <Row name="行的标准差" value="0.9999951" note="不是精确的一" color={C.amber} width={1050} />
              <Row name="测试阈值" value="1e−4" note="不是放水，是把口径写清" width={1050} />
              <Body size={FT.label} style={{ marginTop: 14 }}>
                若阈值卡 1e−9，这个测试永远红。把它写成一万分之一，并通过注释说明原因。
              </Body>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="标准差" value="0.999995" sub="epsilon 引起的系统偏差" accent={C.amber} style={{ width: 558, height: 210 }} />
            <Stat label="阈值" value="1e−4" sub="口径而非精度" accent={C.amber} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
