import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, K, Verdict, Stat, unitColor, fmtInt } from "../shared";

export const SOutro: React.FC = () => {
  const at = pagesOf("outro");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：成绩单 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.16 }}>
              两个都不到
              <br />
              零点一三。
            </div>
            <Body style={{ marginTop: 24, width: 830 }}>
              书里两句话，实测下来是两个基线。残差只认点，距离只认形；点与形都不是异常的全部。
              停牌二百四十天，一个静默，一个爆炸——这就是经典判据的边界。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1020, top: 286, width: 840 }}>
            <Card label="ARIMA(0,0,2) 残差" accent={unitColor.arima} pad={22}>
              <Row name="F1" value={U("arima").f1.toFixed(4)} note="严口径" color={unitColor.arima} />
              <Row name="P / R" value={U("arima").p.toFixed(3) + " / " + U("arima").r.toFixed(3)} note="只抓点" />
              <Row name="报警" value={String(U("arima").alerts) + " 天"} note={"占 " + U("arima").alertPct.toFixed(2) + "%"} />
            </Card>
            <div style={{ height: 16 }} />
            <Card label="Matrix Profile（m=100）" accent={unitColor.mp} pad={22}>
              <Row name="F1" value={U("mp").f1.toFixed(4)} note="一次报警都没有" color={unitColor.mp} />
              <Row name="最大分 / 阈值" value="11.02 / 11.40" note="差 0.38 没过线" />
              <Row name="停牌" value="严格 42 天" note="无穷口径的边界" />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：账本 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 296, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>这一集的账本</div>
            <div style={{ marginTop: 22 }}>
              <Row name="新增测试" value={String(M.meta.tests.newCases) + " 条"} note="ARIMA 10 · MP 8" />
              <Row name="仓库合计" value={fmtInt(M.meta.tests.assertions) + " 条"} note={M.meta.tests.suites + " 套"} />
              <Row name="证据检查" value={M.meta.evidence.total + " 项"} note={M.meta.evidence.seconds.toFixed(1) + " 秒跑完"} />
              <Row name="本集进度" value={M.meta.progress.delivered + " / " + M.meta.progress.total} note="全系列第 39 集" />
            </div>
            <div style={{ marginTop: 24 }}>
              <Verdict ok label={"状态：" + M.meta.progress.delivered + "/" + M.meta.progress.total + " · 未发布"} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1000, top: 300, width: 860 }}>
            <Card label="下一集" accent={C.cyan} pad={24}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{M.meta.next.title}</div>
              <Body style={{ marginTop: 14 }}>
                USAD 的对抗训练、DAGMM 的能量分数、多 AE 中位数。预估 {M.meta.next.minutes} 分钟。
              </Body>
            </Card>
            <div style={{ marginTop: 24, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim, lineHeight: 1.7 }}>
              两个读数，一个结论：判据写得越短，藏在里面的口径越多。这一集到这里，我们下次见。
            </div>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
