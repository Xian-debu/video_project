import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>切完，<br />再喂给模型。</Body>
          <Body style={{ marginTop: 26 }}>
            三句话收尾：三种切法都成立；token 数和块长成反比；真实序列周期弱，找不到就退化。三句话都有读数，都能一条命令复现。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="token" v="12/6/3" color={C.cyan} />
            <KV k="重叠" v="11" color={C.violet} />
            <KV k="检查" v="22/22" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="三句话，各自有读数" accent={C.cyan}>
            <Row name="第一 切法" value="成立" note="patch、周期、前缀都跑通" width={1010} color={C.cyan} />
            <Row name="第二 反比" value="12/6/3" note="96 点，块越长，token 越少" width={1010} color={C.violet} />
            <Row name="第三 周期" value="弱" note="真实序列没有峰，退化固定 patch" width={1010} color={C.amber} />
          </Card>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>能手算</Chip>
            <Chip color={C.violet}>可复现</Chip>
            <Chip color={C.amber}>会退化</Chip>
          </div>
        </div>
        <Foot>三句话，都有读数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>交付清单。</Body>
          <Body style={{ marginTop: 26 }}>
            三个模块、五十条单测、二十二项检查、五百一十二个点、九十六点窗口、四档分辨率。全部可复现，不需要 GPU，不需要联网。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="模块" v="3" color={C.cyan} />
            <KV k="单测" v="50" color={C.violet} />
            <KV k="检查" v="22" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="这一集交付了什么" accent={C.violet}>
            <Row name="模块" value="3 个 / 433 行" note="PatchEmbed、PeriodToken、ResPrefix" width={1010} color={C.cyan} />
            <Row name="单测" value="50 条" note="17 + 15 + 18" width={1010} color={C.violet} />
            <Row name="检查" value="22 项 / 4 组" note="数据、patch、周期、前缀" width={1010} color={C.amber} />
            <Row name="数据" value="512 点" note="000001.SZ，后复权" width={1010} color={C.cyan} />
            <Row name="窗口" value="96 点" note="合成序列同长" width={1010} color={C.violet} />
            <Row name="分辨率" value="4 档" note="512 / 256 / 128 / 64" width={1010} color={C.amber} />
          </Card>
        </div>
        <Foot>全部可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>复现命令，<br />一条。</Body>
          <Body style={{ marginTop: 26 }}>
            加数据目录、输出目录、证据路径；不到一秒写出 JSON，检查清单也在里面。单测用 cabal test，五十项全绿。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="耗时" v="0.0 s" color={C.cyan} />
            <KV k="检查" v="22 / 22" color={C.violet} />
            <KV k="单测" v="50" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1110 }}>
          <CodeBlock width={1040} title="一条命令，写出 22 项检查" lines={[
            { t: "tsbase evidence-ch07-token" },
            { t: "  --data data/episodes/57-tokenization-trio" },
            { t: "  --out  data/episodes/57-tokenization-trio" },
            { t: "  --evidence inventory/evidence/57-tokenization-trio.ch7-token.json" },
            { t: "cabal test spec  # 50 条单测" },
          ]} />
          <div style={{ marginTop: 18, display: "flex", gap: 28 }}>
            <KV k="证据" v="22 / 22" color={C.cyan} />
            <KV k="耗时" v="0.0 s" color={C.amber} />
            <KV k="单测" v="50 / 50" color={C.violet} />
          </div>
        </div>
        <Foot>不到一秒，写出 JSON。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 620 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下一集，<br />选通道。</Body>
          <Body style={{ marginTop: 26 }}>
            token 切好了，多变量序列怎么处理通道？每个变量一套参数，还是所有变量一起看？下一集，二十分钟，从切序列走到选通道。
          </Body>
          <div style={{ marginTop: 26, display: "flex" }}>
            <KV k="下一集" v="通道策略" color={C.cyan} />
            <KV k="时长" v="20 分钟" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 286, width: 1080 }}>
          <Card label="第七章第二集：通道策略" accent={C.amber}>
            <Row name="题目" value="通道独立 vs 混合" note="每个变量一套参数，还是共享" width={1010} color={C.cyan} />
            <Row name="通道独立" value="Channel Independent" note="每列单独建模，参数多、更灵活" width={1010} color={C.violet} />
            <Row name="通道混合" value="Channel Mixing" note="所有变量一起看，参数少、能借力" width={1010} color={C.amber} />
            <Row name="时长" value="20 分钟" note="比这一集多两分钟" width={1010} color={C.cyan} />
            <Row name="不变" value="预算有限" note="从切序列到选通道，同一件事" width={1010} color={C.violet} />
          </Card>
        </div>
        <Foot>下一集再见。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
