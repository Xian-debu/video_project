import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Verdict, Chip, K, Stat } from "../shared";

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：一集一个读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 280, width: 1776 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
              {(["ae16", "vae01", "vae1", "ae100"] as const).map((k) => (
                <Card key={k} label={M.units[k].short} accent={C.cyan}>
                  <div style={{ fontFamily: FONT.mono, fontSize: k === "ae100" ? 64 : 76, color: k === "ae100" ? C.coral : C.ink, lineHeight: 1.05 }}>
                    {U(k).f1.toFixed(4)}
                  </div>
                  <K style={{ display: "block", marginTop: 10 }}>{k === "ae100" ? "恒等模型，分数全零" : "F1（同一套注入真值）"}</K>
                  <Body size={FT.meta} color={C.inkFaint} style={{ marginTop: 8 }}>
                    {k === "ae100" ? "损失为零，检测器已死" : "报警率 " + U(k).alertPct.toFixed(2) + "% · 命中 " + U(k).detected + " / " + M.inject.truthRuns}
                  </Body>
                </Card>
              ))}
            </div>
            <Body style={{ marginTop: 26, width: 1700 }}>
              一集一个读数：重构损失没有概率含义。恒等陷阱让分数归零，KL 把潜空间钉住，但钉住不等于能检测——
              三个非零读数都停在零点四几，这是这一集的实测，不是调参没调够。
            </Body>
            <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
              <Verdict ok label={M.meta.checks + " 项检查全过"} />
              <Chip color={C.violet}>{M.meta.tests.asserts.toLocaleString("en-US")} 条测试全绿</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 880 }}>
            <Card label={"下一集 · 第 " + M.next.episode + " 集"} accent={C.cyan}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink, lineHeight: 1.3 }}>{M.next.title}</div>
              <Body style={{ marginTop: 14, width: 800 }}>
                如果一个高斯不够，就用多个高斯拼一个先验。混合模型把「多个正常模式」写进潜空间，代价是模态数和初始化。
              </Body>
              <K style={{ display: "block", marginTop: 12 }}>{M.next.minutes} 分钟 · {M.next.slug}</K>
            </Card>
            <Card label="证据在哪" accent={C.amber} style={{ marginTop: 18 }}>
              <Row name="单元提交" value={M.meta.commits.units} note="两个模块 + 两个套件" width={820} />
              <Row name="证据提交" value={M.meta.commits.evidence} note={M.meta.checks + " 项检查"} width={820} />
              <Row name="数据清单" value={M.meta.commits.data} note={"sha " + M.data.sha.slice(0, 16)} width={820} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 288, width: 840 }}>
            <Card label="怎么复现" accent={C.violet}>
              <Row name="命令" value="cabal run tsbase" note="evidence-ch04-ae-vae" width={780} />
              <Row name="数据" value={M.data.rows + " 行"} note={M.data.file + " · " + M.data.bytes.toLocaleString("en-US") + " B"} width={780} />
              <Row name="窗口" value={M.windows.C + " 天，步长一"} note={"训练 " + M.windows.train + "，测试 " + M.windows.test} width={780} />
              <Row name="种子" value={M.inject.seed + " / " + M.latent.seed} note="注入 / 散点，各自固定" width={780} />
            </Card>
            <Body size={FT.meta} color={C.inkFaint} style={{ width: 800, marginTop: 16 }}>
              全部数字确定性生成：换机器、换时间重跑，读数逐位相同。唯一的变量是数据文件本身。
            </Body>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
