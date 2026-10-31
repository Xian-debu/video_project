import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, M, PAD, Pages, Scene, SceneHead, Stat, fmtInt, lf } from "../shared";

/* 开场：两个模型、四个数字、一段真实数据。 */

const Metric: React.FC<{ label: string; value: string; note: string; color: string; width: number }> = ({ label, value, note, color, width }) => (
  <Card label={label} accent={color} style={{ width, height: 250 }}>
    <div style={{ fontFamily: FONT.mono, fontSize: 58, color, lineHeight: 1.05, letterSpacing: -1.5, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <Body size={FT.meta} style={{ marginTop: 14 }}>{note}</Body>
  </Card>
);

const Beat: React.FC<{ no: string; head: string; text: string; color: string }> = ({ no, head, text, color }) => (
  <div style={{ display: "flex", gap: 18, alignItems: "baseline", marginTop: 18 }}>
    <div style={{ width: 56, fontFamily: FONT.mono, fontSize: FT.h2, color, fontVariantNumeric: "tabular-nums" }}>{no}</div>
    <div style={{ width: 560, fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>{head}</div>
    <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, lineHeight: 1.5 }}>{text}</div>
  </div>
);

export const SOpen: React.FC = () => {
  const m = M;
  return (
    <Scene id="open">
      <SceneHead id="open" />
      <Pages id="open" at={[0, 0.24, 0.5, 0.74]}>
        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            前面八集都在给序列做变换；这一集换一类东西：让网络自己学。
          </div>
          <Build at={lf("open", 0.03)}>
            <div style={{ position: "absolute", left: PAD, top: 320, display: "flex", gap: 26 }}>
              <Card label="多层感知机 · MLP" accent={C.cyan} style={{ width: 874, height: 340 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>把窗口展平</div>
                <Body style={{ marginTop: 16 }}>第 k 个输入和第 k+1 个输入，在权重矩阵里毫无关系。窗口内的顺序，不参与建模。</Body>
                <K style={{ display: "block", marginTop: 16 }}>式 (2.46) (2.47) · p.30–31</K>
              </Card>
              <Card label="时间卷积 · TCN" accent={C.violet} style={{ width: 876, height: 340 }}>
                <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink }}>把时间写进结构</div>
                <Body style={{ marginTop: 16 }}>核在时间轴上滑，滑到哪里只看那一段。第 t 个输出，永远看不见第 t+1 步。</Body>
                <K style={{ display: "block", marginTop: 16 }}>式 (2.62) (2.63) · p.33–34</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.08)}>
            <div style={{ position: "absolute", left: PAD, top: 700, width: 1776, background: C.panel, border: "1px solid " + C.panelLine, borderLeft: "3px solid " + C.cyan, borderRadius: 12, padding: "22px 26px" }}>
              <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>差别不在深度，在「谁能看见谁」。</div>
              <K style={{ display: "block", marginTop: 10 }}>这一集围着这一个性质转</K>
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            四个数：三个是参数，一个是测试结果。
          </div>
          <Build at={lf("open", 0.27)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Metric label="MLP 参数量" value="1,985" note="60 → 32 → 1，两层加偏置" color={C.cyan} width={432} />
              <Metric label="TCN 参数量" value="1,649" note="三层卷积 + 一个线性头" color={C.violet} width={432} />
              <Metric label="感受野" value="15" note="1 + (K−1)·Σd = 1 + 2·7" color={C.amber} width={432} />
              <Metric label="因果性最大差值" value="0" note="前十个输出逐位不变" color={C.coral} width={432} />
            </div>
          </Build>
          <Build at={lf("open", 0.32)}>
            <div style={{ position: "absolute", left: PAD, top: 606, width: 1776 }}>
              <Card accent={C.inkFaint} style={{ height: 116 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>参数量更少的那个，看得更远——这一集就讲这句话的代价。</div>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.36)}>
            <div style={{ position: "absolute", left: PAD, top: 760, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              先说为什么这件事容易写错：一个减号的事。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            三件事，从书页上的一个减号开始。
          </div>
          <Build at={lf("open", 0.53)}>
            <div style={{ position: "absolute", left: PAD, top: 312, width: 1776 }}>
              <Beat no="01" head="卷积照框架写，看到未来" text="式 (2.62) 直读是翻转；框架里的卷积是互相关。错版第一个输出 14，正确版是 3。" color={C.coral} />
              <Beat no="02" head="参数不是越多越好" text="MLP 把窗口展平，参数 1,985；TCN 只看三步核，参数 1,649，视野反而 15 步。" color={C.amber} />
              <Beat no="03" head="真实数据上两个都不灵" text="茅台 1,507 个测试窗口，误差比值 1.0215 和 1.0495，都比预测零差一点。" color={C.violet} />
            </div>
          </Build>
          <Build at={lf("open", 0.62)}>
            <div style={{ position: "absolute", left: PAD, top: 720, fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>
              第三件事不是实现错，是日频信噪比低；所以证据里并列两个基线。
            </div>
          </Build>
        </div>

        <div>
          <div style={{ position: "absolute", left: PAD, top: 236, fontFamily: FONT.sans, fontSize: FT.h2, color: C.inkDim }}>
            真实数据：两只票，收益率序列，七三开不打乱。
          </div>
          <Build at={lf("open", 0.77)}>
            <div style={{ position: "absolute", left: PAD, top: 312, display: "flex", gap: 24 }}>
              <Stat label="600519 · 贵州茅台" accent={C.cyan} value={fmtInt(m.data.daily600519.rows) + " 行"} sub={m.data.daily600519.first + " → " + m.data.daily600519.last + " · " + fmtInt(m.data.daily600519.returns) + " 个收益"} valueColor={C.cyan} style={{ width: 580, height: 210 }} />
              <Stat label="000001 · 上证指数标的" accent={C.violet} value={fmtInt(m.data.daily000001.rows) + " 行"} sub={m.data.daily000001.first + " → " + m.data.daily000001.last + " · " + fmtInt(m.data.daily000001.returns) + " 个收益"} valueColor={C.violet} style={{ width: 580, height: 210 }} />
              <Stat label="MLP 窗口 · 训练/测试" accent={C.amber} value={fmtInt(m.data.windows.mlpTrain) + " / " + fmtInt(m.data.windows.mlpTest)} sub={"全窗 " + fmtInt(m.data.windows.mlpAll) + "；后三成不许参与训练"} valueColor={C.amber} style={{ width: 590, height: 210 }} />
            </div>
          </Build>
          <Build at={lf("open", 0.82)}>
            <div style={{ position: "absolute", left: PAD, top: 566, width: 1776 }}>
              <Card accent={C.cyan} style={{ height: 140 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: FT.h2, color: C.ink }}>三十一项检查，零失败；十六加十九，三十五条断言。</div>
                <K style={{ display: "block", marginTop: 10 }}>证据：inventory/evidence/ch02-mlp · ch02-tcn</K>
              </Card>
            </div>
          </Build>
          <Build at={lf("open", 0.86)}>
            <div style={{ position: "absolute", left: PAD, top: 740, display: "flex", gap: 14, alignItems: "center" }}>
              <Chip color={C.cyan}>MLP</Chip><Chip color={C.violet}>TCN</Chip>
              <Body size={FT.body} style={{ marginLeft: 6 }}>一个多层感知机，一个时间卷积，两次当场跑给你看。</Body>
            </div>
          </Build>
        </div>
      </Pages>
    </Scene>
  );
};
