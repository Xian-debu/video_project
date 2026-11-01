import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Chip, K, CodeBlock, Stat } from "../shared";

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：两个模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1080 }}>
            <Card label="两个模块，全部纯函数" accent={C.violet}>
              {M.modules.map((m) => (
                <Row
                  key={m.id}
                  name={m.name}
                  value={m.lines + " 行"}
                  note={m.file.split("/").pop() + " · " + m.cases + " 条单元测试"}
                  width={1030}
                />
              ))}
            </Card>
            <Card label="测试与证据" accent={C.amber} style={{ marginTop: 20 }}>
              <Row name="新增测试" value="29 条" note={"两个套件，仓库合计 " + M.meta.tests.asserts.toLocaleString("en-US") + " 条"} width={1030} />
              <Row name="证据检查" value={M.meta.checks} note={M.meta.elapsedSec + " 秒，一次跑完"} width={1030} />
              <Row name="提交" value={M.meta.commits.units} note={"证据 " + M.meta.commits.evidence + "，数据 " + M.meta.commits.data} width={1030} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1230, top: 288, width: 620 }}>
            <Stat label="仓库测试" value={M.meta.tests.asserts.toLocaleString("en-US")} sub={M.meta.tests.suites + " 个套件全绿"} valueSize={54} />
            <Stat label="本集新增" value="29" sub="两个套件" accent={C.violet} style={{ marginTop: 18 }} valueSize={54} />
            <Stat label="证据耗时" value={M.meta.elapsedSec + " s"} sub="单线程，确定性" accent={C.amber} style={{ marginTop: 18 }} valueSize={54} />
          </div>
        </AbsoluteFill>

        {/* 页二：AE 接口 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1100 }}>
            <CodeBlock
              title="TsBase.Algos.Ch04.AE"
              width={1060}
              lines={[
                { t: "initAE      :: AECfg -> AEModel" },
                { t: "encoder     :: AECfg -> AEModel -> Vector Double -> Vector Double", hi: true },
                { t: "decoder     :: AECfg -> AEModel -> Vector Double -> Vector Double", hi: true },
                { t: "recon       :: AECfg -> AEModel -> Vector Double -> Vector Double" },
                { t: "windowScore :: AECfg -> AEModel -> Vector Double -> Double", hi: true },
                { t: "corrupt     :: Matrix -> Vector Double -> Vector Double" },
                { t: "trainAE     :: AECfg -> Matrix -> (AEModel, [Double])" },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1250, top: 288, width: 600 }}>
            <Card label="四个不变量" accent={C.cyan}>
              <Row name="目标" value="干净输入" note="掩码只碰输入，不碰目标" width={540} />
              <Row name="梯度" value="手写反向" note="有限差分对到 1e−9" width={540} />
              <Row name="裁剪" value="单窗范数 1" note="不裁剪会炸" width={540} />
              <Row name="顺序" value="固定不洗牌" note="同种子逐位可复现" width={540} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：VAE 接口 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 1100 }}>
            <CodeBlock
              title="TsBase.Algos.Ch04.VAE"
              width={1060}
              lines={[
                { t: "initVAE     :: VAECfg -> VAEModel" },
                { t: "latentMus   :: VAECfg -> VAEModel -> Vector Double -> Vector Double", hi: true },
                { t: "sigmaOf     :: VAECfg -> VAEModel -> Vector Double -> Vector Double" },
                { t: "klOf        :: Vector Double -> Vector Double -> Double", hi: true },
                { t: "vaeForward  :: VAECfg -> VAEModel -> Matrix -> (Matrix, Double)" },
                { t: "trainVAE    :: VAECfg -> Matrix -> (VAEModel, [Double])" },
                { t: "vaeFromAE   :: Int -> AECfg -> AEModel -> VAEModel", hi: true },
              ]}
            />
          </div>
          <div style={{ position: "absolute", left: 1250, top: 288, width: 600 }}>
            <Card label="一条最硬的测试" accent={C.violet}>
              <Row name="构造" value="AE 权重搬家" note="均值头放单位矩阵" width={540} />
              <Row name="方差头" value="零权重" note="logσ² 常数 −50" width={540} />
              <Row name="β = 0, ε = 0" value="逐位相同" note="不是近似，是相等" width={540} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 560, marginTop: 16 }}>
              这条测试比任何解释都硬：它保证两个模块的前向口径没有偷偷分叉。
            </Body>
            <Chip color={C.cyan} style={{ marginTop: 14 }}>每窗 SGD，不是全批量</Chip>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
