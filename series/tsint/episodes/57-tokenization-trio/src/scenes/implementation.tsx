import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const ImplementationScene: React.FC = () => (
  <Scene id="implementation">
    <SceneHead id="implementation" />
    <Pages id="implementation" at={pagesOf("implementation")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>PatchEmbed，<br />两个字段。</Body>
          <Body style={{ marginTop: 26 }}>
            一个 patch 只需要长度和步长。切开、投影、重构，三个纯函数。投影矩阵不存，每次按 DCT 现算，省掉一张参数表。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="模块" v="3" color={C.cyan} />
            <KV k="总行数" v="433" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <CodeBlock width={1040} title="PatchEmbed.hs · 切开与投影" lines={[
            { t: "data PatchSpec = PatchSpec" },
            { t: "  { patchLen    :: Int" },
            { t: "  , patchStride :: Int }" },
            { t: "" },
            { t: "splitPatches :: PatchSpec -> V.Vector Double -> [V.Vector Double]" },
            { t: "projectionMatrix :: Int -> Int -> [[Double]]" },
            { t: "  -- DCT-II: sqrt(2/p) * cos(pi*(i+0.5)*j/p)" },
            { t: "patchEmbed :: Int -> PatchSpec -> V.Vector Double -> [V.Vector Double]" },
            { t: "  -- token = W p * patch" },
            { t: "reconstruct :: Int -> PatchSpec -> [V.Vector Double] -> V.Vector Double" },
            { t: "  -- 逆 = 转置，正交矩阵" },
            { t: "multiScaleTokens :: [Int] -> PatchSpec -> V.Vector Double -> [[V.Vector Double]]" },
          ]} />
        </div>
        <Foot>模块小，函数纯。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>PeriodToken，<br />无偏自相关。</Body>
          <Body style={{ marginTop: 26 }}>
            自相关先减均值，再除以方差；每一项除以 n−k 修正样本数。不做无偏，正弦的 lag 24 只剩 0.75，峰会被压低，阈值就误判。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="阈值" v="0.3" color={C.coral} />
            <KV k="主峰" v="24" color={C.cyan} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <CodeBlock width={1040} title="PeriodToken.hs · 找周期" lines={[
            { t: "acf :: V.Vector Double -> Int -> V.Vector Double" },
            { t: "  -- 中心化，无偏: sum k / (n-k) / (denom/n)" },
            { t: "" },
            { t: "cycleStrength :: V.Vector Double -> Int -> Double" },
            { t: "" },
            { t: "dominantPeriod :: Int -> Int -> V.Vector Double -> Maybe Int" },
            { t: "  -- lag 2..maxLag，r >= 0.3 且局部极大，取首个" },
            { t: "" },
            { t: "periodCount :: Int -> Int -> V.Vector Double -> Int" },
            { t: "periodRemainder :: Int -> Int -> V.Vector Double -> Int" },
            { t: "periodTokens :: Int -> V.Vector Double -> [V.Vector Double]" },
            { t: "  -- 只取完整周期，尾部丢弃" },
          ]} />
        </div>
        <Foot>找不到，返回空。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>ResPrefix，<br />查表加一。</Body>
          <Body style={{ marginTop: 26 }}>
            降采样用块均值，除不尽丢尾巴；前缀表是四行三十二列的正弦编码，不训练；最近档按绝对差找，平手取小的；拼接后长度加一。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="档位" v="4" color={C.cyan} />
            <KV k="维度" v="32" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <CodeBlock width={1040} title="ResPrefix.hs · 降采样与前缀" lines={[
            { t: "defaultResolutions :: [Int]" },
            { t: "  -- [1, 2, 4, 8]" },
            { t: "" },
            { t: "downsample :: Int -> V.Vector Double -> V.Vector Double" },
            { t: "  -- 块均值，丢尾巴" },
            { t: "downsampleCount :: Int -> Int -> Int" },
            { t: "" },
            { t: "resolutionEmbedding :: Int -> Int -> V.Vector Double" },
            { t: "prefixTable :: Int -> [V.Vector Double]" },
            { t: "nearestResolution :: [Int] -> Int -> Int" },
            { t: "withPrefix :: V.Vector Double -> [V.Vector Double] -> [V.Vector Double]" },
            { t: "withResolutionPrefix :: Int -> Int -> [V.Vector Double] -> [V.Vector Double]" },
          ]} />
        </div>
        <Foot>长度加一，位置偏移。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>证据程序，<br />二百二十二行。</Body>
          <Body style={{ marginTop: 26 }}>
            读 CSV，取最后九十六点；依次跑 patch、重叠、周期、分辨率；每组读数写进 JSON，二十二项检查逐项对照。跑完不到一秒。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="证据行数" v="222" color={C.cyan} />
            <KV k="耗时" v="< 1 s" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="一只序列，一条流水线" accent={C.violet}>
            <Row name="01 读 CSV" value="两列" note="日期、后复权收盘" width={1040} color={C.cyan} />
            <Row name="02 切窗口" value="96 点" note="取最后一段，与合成序列同长" width={1040} color={C.violet} />
            <Row name="03 patch" value="12 / 6 / 3" note="三种长度各跑一遍" width={1040} color={C.amber} />
            <Row name="04 重叠" value="11" note="p=16、stride=8" width={1040} color={C.cyan} />
            <Row name="05 周期" value="24 / 4" note="正弦主峰与 token 数" width={1040} color={C.violet} />
            <Row name="06 写 JSON" value="22 项" note="检查清单与读数一起落盘" width={1040} color={C.amber} />
          </Card>
        </div>
        <Foot>二十二项检查，逐项对照。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 600 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>五十条单测。</Body>
          <Body style={{ marginTop: 26 }}>
            patch 十七，周期十五，分辨率前缀十八。测计数、测重叠、测正交、测重构、测峰、测最近档。五十条全绿，才提交。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="单测" v="50" color={C.cyan} />
            <KV k="patch" v="17" color={C.violet} />
            <KV k="周期" v="15" color={C.amber} />
            <KV k="前缀" v="18" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <Card label="黄金值：先把定义钉住" accent={C.amber}>
            <Row name="计数" value="12 / 6 / 3" note="96 除以 8 / 16 / 32" width={1040} color={C.cyan} />
            <Row name="重叠" value="11" note="(96−16)/8 + 1" width={1040} color={C.violet} />
            <Row name="正交" value="< 1e-12" note="WᵀW 与单位阵" width={1040} color={C.amber} />
            <Row name="重构" value="< 1e-10" note="拼回原序列" width={1040} color={C.cyan} />
            <Row name="周期峰" value="24" note="正弦 lag 24 最大" width={1040} color={C.violet} />
            <Row name="最近档" value="3→2 / 6→4" note="没有的档取最近" width={1040} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>全绿</Chip>
            <Chip color={C.violet}>确定性</Chip>
            <Chip color={C.amber}>无外部依赖</Chip>
          </div>
        </div>
        <Foot>五十条全绿，才提交。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
