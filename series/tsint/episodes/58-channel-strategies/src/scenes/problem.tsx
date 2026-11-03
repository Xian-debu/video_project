import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, Foot, KV, PAD, Pages, Row, Scene, SceneHead, fmt4, fmtInt, pagesOf } from "../shared";
import { ChannelStack, DecisionLines, SHORT, TokenRun } from "../figs";

export const ProblemScene: React.FC = () => (
  <Scene id="problem">
    <SceneHead id="problem" />
    <Pages id="problem" at={pagesOf("problem")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>六只股票，<br />一条相关性。</Body>
          <Body style={{ marginTop: 26 }}>
            六只 A 股，两年数据。五百一十三个收盘，五百一十二个对数收益，六列对齐、没有缺失。每天六个收益，必须一起看。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="收盘" v="513" color={C.cyan} />
            <KV k="收益" v="512" color={C.violet} />
            <KV k="缺失" v="0" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="六条通道，同一段窗口" accent={C.cyan}>
            {M.data.codes.map((c, i) => (
              <div key={c} style={{ display: "flex", alignItems: "baseline", borderTop: i === 0 ? "none" : "1px solid " + C.panelLine, padding: "12px 0" }}>
                <div style={{ width: 120, fontFamily: FONT.mono, fontSize: FT.body, color: C.cyan }}>{c}</div>
                <div style={{ width: 130, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{SHORT[c]}</div>
                <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>日对数收益，标准化后进模型</div>
              </div>
            ))}
            <div style={{ marginTop: 14, fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{M.data.firstDate} → {M.data.lastDate} · {M.data.rows} 行原始收盘 · {M.data.samples} 个收益</div>
          </Card>
        </div>
        <Foot>每天六个收益，一起看。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>通道独立，<br />九十六个位置。</Body>
          <Body style={{ marginTop: 26 }}>
            每列单独标准化，每列切三十二点一块。五百一十二除以三十二，每条通道十六个 token。六条通道就是九十六个，每个三十二维。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="每条" v="16" color={C.cyan} />
            <KV k="合计" v="96" color={C.violet} />
            <KV k="注意力" v="96 × 96" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="通道独立：每条通道自己切，位置编码九十六个" accent={C.cyan}>
            <ChannelStack rows={6} perRow={16} codes={M.data.codes} cell={17} gap={3} />
            <div style={{ marginTop: 18, display: "flex", gap: 26 }}>
              <KV k="token / 通道" v="16" color={C.cyan} />
              <KV k="维度" v="32" color={C.violet} />
              <KV k="总 token" v="96" color={C.amber} />
              <KV k="参数" v="6 套" color={C.inkDim} />
            </div>
          </Card>
        </div>
        <Foot>通道之间不共享参数。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>通道混合，<br />只有十六个。</Body>
          <Body style={{ marginTop: 26 }}>
            同一时刻，六个值先拼成一百九十二维；每段投影回三十二维。五百一十二个时刻切十六段，每段装六条通道。位置只有十六个，通道信息揉在一起。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="拼宽" v="192" color={C.cyan} />
            <KV k="投影" v="32" color={C.violet} />
            <KV k="token" v="16" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="通道混合：每段 32 点，一段装六个通道" accent={C.amber}>
            <TokenRun count={16} groups={1} tokenW={48} h={54} />
            <div style={{ marginTop: 18, display: "flex", gap: 26 }}>
              <KV k="每段" v="32 点" color={C.cyan} />
              <KV k="每段维度" v="6 × 32 = 192" color={C.violet} />
              <KV k="token" v="16" color={C.amber} />
              <KV k="参数" v="1 套" color={C.inkDim} />
            </div>
          </Card>
        </div>
        <Foot>参数少，算得快。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>算一笔<br />注意力账。</Body>
          <Body style={{ marginTop: 26 }}>
            九十六的平方乘三十二，二十九万四千九百一十二。十六的平方乘三十二，八千一百九十二。比值三十六，正好是六的平方。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="CI" v="294,912" color={C.cyan} />
            <KV k="CM" v="8,192" color={C.amber} />
            <KV k="比" v="36" color={C.coral} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="注意力代价：T² · d，d = 32" accent={C.coral}>
            <Row name="CI" value="96² × 32" note="294,912" width={1000} color={C.cyan} />
            <Row name="CM" value="16² × 32" note="8,192" width={1000} color={C.amber} />
            <Row name="比值" value="36" note="6²；token 少 6 倍，代价少 36 倍" width={1000} color={C.coral} />
            <Row name="Hybrid 2" value="32² × 32" note="32,768，比独立省 9 倍" width={1000} color={C.violet} />
          </Card>
        </div>
        <Foot>token 少六倍，代价少三十六倍。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>能不能混，<br />看相关性。</Body>
          <Body style={{ marginTop: 26 }}>
            相关高，混了损失小；相关低，混了丢细节。真实平均相关零点五一，不高不低，卡在中间。独立太贵，混合太糙，需要一个折中。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="mean|ρ|" v="0.5109" color={C.cyan} />
            <KV k="max|ρ|" v="0.8401" color={C.amber} />
            <KV k="答案" v="折中" color={C.violet} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="按相关性分组，再混合" accent={C.violet}>
            <DecisionLines at={0} />
            <div style={{ marginTop: 14, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint }}>
              0.5109 不到 0.6，不能直接混；也高于 0.2，不能独立。中间地带，组数取有效秩。
            </div>
          </Card>
        </div>
        <Foot>这正是两两混合。</Foot>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 292, width: 640 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>分几组？<br />不能拍脑袋。</Body>
          <Body style={{ marginTop: 26 }}>
            分组分几组、哪些通道放一组，不能凭感觉。相关矩阵给出结构，特征值给出维度，有效秩给出组数，两个阈值做判断。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="矩阵" v="6 × 6" color={C.cyan} />
            <KV k="特征值" v="6 个" color={C.violet} />
            <KV k="组数" v="round(2.4714)" color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, top: 286, width: 1050 }}>
          <Card label="四个问题，四个答案" accent={C.amber}>
            <Row name="结构" value="相关矩阵" note="整体有多像，哪里最像" width={1000} color={C.cyan} />
            <Row name="维度" value="特征值" note="能量集中在几个方向" width={1000} color={C.violet} />
            <Row name="组数" value="有效秩 2.4714" note="二点四七，四舍五入取二" width={1000} color={C.amber} />
            <Row name="边界" value="0.6 / 0.2 / 3" note="两个阈值，都是我们定的" width={1000} color={C.coral} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>能量集中</Chip>
            <Chip color={C.violet}>组数可算</Chip>
            <Chip color={C.amber}>阈值写进偏差表</Chip>
          </div>
        </div>
        <Foot>先把定义写清楚。</Foot>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
