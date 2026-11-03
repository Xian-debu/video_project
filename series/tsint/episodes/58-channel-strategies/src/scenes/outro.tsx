import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, CodeBlock, Foot, KV, PAD, Pages, Row, Scene, SceneHead, pagesOf } from "../shared";

export const OutroScene: React.FC = () => (
  <Scene id="outro">
    <SceneHead id="outro" />
    <Pages id="outro" at={pagesOf("outro")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>选完通道，<br />再进模型。</Body>
          <Body style={{ marginTop: 26 }}>
            三句话收尾：通道策略可选，相关谱给出答案；三种策略都成立，token 数九十六、十六、三十二；真实数据走折中，Hybrid 2。三句话都有读数，都能一条命令复现。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="CI / CM" v="96 / 16" color={C.cyan} />
            <KV k="Hybrid" v="32" color={C.violet} />
            <KV k="检查" v="24 / 24" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="三句话，各自有读数" accent={C.cyan}>
            <Row name="第一" value="策略可选" note="相关谱 → 有效秩 → 判据" width={1000} color={C.cyan} />
            <Row name="第二" value="三种都成立" note="96 / 16 / 32 个 token" width={1000} color={C.violet} />
            <Row name="第三" value="真实走折中" note="Hybrid 2，32 个 token" width={1000} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>能手算</Chip>
            <Chip color={C.violet}>可复现</Chip>
            <Chip color={C.amber}>24 项</Chip>
          </div>
        </div>
        <Foot>三句话，都有读数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>交付清单。</Body>
          <Body style={{ marginTop: 26 }}>
            一个模块二百六十九行、十八个导出、二十九条单测、二十四项检查、五百一十二个收益、六条通道并排、三种策略齐全。全部可复现，不需要 GPU。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="模块" v="269 行" color={C.cyan} />
            <KV k="单测" v="29" color={C.violet} />
            <KV k="检查" v="24" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="这一集交付了什么" accent={C.violet}>
            <Row name="模块" value="1 个 / 269 行" note="ChannelMix.hs，18 个导出" width={1000} color={C.cyan} />
            <Row name="单测" value="29 条" note="相关、谱、决策、计数" width={1000} color={C.violet} />
            <Row name="检查" value="24 项 / 5 组" note="数据、相关、谱、决策、token" width={1000} color={C.amber} />
            <Row name="数据" value="6 × 512" note="六只 A 股，两年日线" width={1000} color={C.cyan} />
            <Row name="策略" value="3 种" note="CI / CM / Hybrid 2" width={1000} color={C.violet} />
          </Card>
        </div>
        <Foot>全部可复现。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 590 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>复现命令，<br />两条。</Body>
          <Body style={{ marginTop: 26 }}>
            加数据目录、输出目录、证据路径；不到一秒写出 JSON，检查清单也在里面。单测用 cabal test，二十九条全绿；证据二十四项全过。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="证据" v="24 / 24" color={C.cyan} />
            <KV k="单测" v="29 / 29" color={C.violet} />
            <KV k="耗时" v="0.02 s" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 720, top: 286, width: 1080 }}>
          <CodeBlock
            title="一条证据命令，一条单测命令"
            width={1040}
            lines={[
              { t: "tsbase evidence-ch07-channel \\" },
              { t: "  --data data/episodes/58-channel-strategies \\" },
              { t: "  --out  data/episodes/58-channel-strategies \\" },
              { t: "  --evidence inventory/evidence/58-channel-strategies.ch7-channel.json" },
              { t: "" },
              { t: "cabal test spec   # 29 条单测" },
            ]}
          />
          <div style={{ marginTop: 16, display: "flex", gap: 34 }}>
            <KV k="证据" v="24 / 24" color={C.cyan} />
            <KV k="单测" v="29 / 29" color={C.violet} />
          </div>
        </div>
        <Foot>一行命令，两个绿灯。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>下一集，<br />搭模型。</Body>
          <Body style={{ marginTop: 26 }}>
            token 有了，通道有了，模型还没搭。第五十九集，迷你基础模型：一个小模型，五个部件，从 patch 到预测头。二十分钟，从零件到整机。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="下一集" v="迷你基础模型" color={C.cyan} />
            <KV k="时长" v="20 分钟" color={C.violet} />
            <KV k="部件" v="5" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="第五十九集：迷你基础模型" accent={C.amber}>
            <Row name="输入" value="token 序列" note="这一集选出的策略作为输入" width={1000} color={C.cyan} />
            <Row name="部件" value="5 个" note="patch、嵌入、注意力、FFN、预测头" width={1000} color={C.violet} />
            <Row name="规模" value="一个小模型" note="不求精度，只求整机可跑" width={1000} color={C.amber} />
            <Row name="时长" value="20 分钟" note="从零件到整机" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>从零件到整机。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三种策略，<br />一条判据。</Body>
          <Body style={{ marginTop: 26 }}>
            相关高，混合；相关低，独立；中间，折中。数字都写进证据，代码都在仓库，视频都在这一集。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="高" v="混合" color={C.cyan} />
            <KV k="低" v="独立" color={C.amber} />
            <KV k="中" v="折中" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="这一集就到这里" accent={C.cyan}>
            <Row name="相关高" value="Mixed" note="mean|ρ| ≥ 0.6 且 effRank ≤ 3" width={1000} color={C.cyan} />
            <Row name="相关低" value="Independent" note="mean|ρ| ≤ 0.2" width={1000} color={C.amber} />
            <Row name="中间" value="Hybrid k" note="k = round(effRank)" width={1000} color={C.violet} />
            <Row name="证据" value="24 项" note="一条命令写出 JSON" width={1000} color={C.cyan} />
          </Card>
        </div>
        <Foot>下一集，模型见。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
