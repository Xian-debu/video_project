import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, fmt4,
} from "../shared";
import { GraphTeaserFig } from "../figs";

const rn = M.rnn;
const dl = M.dil;
const br = M.brick;
const lg = M.long;
const sy = M.synthetic;
const meta = M.meta;

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              结构能算清，
              <br />
              精度量不出。
            </div>
            <Body style={{ marginTop: 20, width: 600 }}>
              这一集的读数：tanh 零点五等于 {fmt4(rn.tanh05)}；空洞黄金值四六八；感受野三十一、参数约四分之一；串行深度五百对六十，八点三倍；真实测试准确率 {fmt4(lg[2].testAcc)}，随机水平；合成任务 {fmt4(sy.testAcc)}；三十项检查全过。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Chip color={C.cyan}>{meta.evidence.passed} / {meta.evidence.checks} 检查</Chip>
              <Chip color={C.amber}>{meta.evidence.seconds} s</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 720, top: 288, width: 1130 }}>
            <Card label="本集读数" accent={C.cyan} pad={22}>
              <MiniTable
                head={["读数", "值", "备注"]}
                rows={[
                  ["tanh(0.5)", fmt4(rn.tanh05), "不是 0.5"],
                  ["空洞黄金值", dl.golden.map((v) => String(v)).join(" · "), "d=2 · 核 [1,1]"],
                  ["感受野（四层 → 五层）", dl.rf31 + " → " + dl.rf63, "参数比 " + fmt4(dl.paramRatio)],
                  ["串行 : 并行深度", br.depthSerial + " : " + br.depthParallel, fmt4(br.depthRatio) + "×"],
                  ["真实测试准确率", fmt4(lg[2].testAcc), "随机 0.3333"],
                  ["合成任务准确率", fmt4(sy.testAcc), "同一个实现"],
                  ["证据检查", meta.evidence.passed + " / " + meta.evidence.checks, meta.evidence.seconds + " 秒"],
                ]}
                colW={[380, 300, 340]}
                width={1070}
                rowH={44}
                size={FT.meta}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 620 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              下一集换
              <br />
              一个方向。
            </div>
            <Body style={{ marginTop: 20, width: 600 }}>
              三十只股票，一张相关性图。图卷积、图注意力、自注意力，三条路都吃这张图。把图打乱，看准确率掉不掉——掉了，才知道模型真的在用图上的关系。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="节点" value="30 只股票" note="一张相关性图" color={C.cyan} />
              <Row name="下一集" value={meta.next.title.split("：")[0]} note={meta.next.id} color={C.violet} />
              <Row name="时长" value={meta.next.minutes + " 分钟"} note="第四十七集" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 770, top: 290, width: 1080 }}>
            <Card label="下一集：三十只股票，一张相关性图" accent={C.violet} pad={20}>
              <GraphTeaserFig width={1030} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
