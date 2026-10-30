import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Build } from "../../design/primitives";
import { Head, Scene, PAD, Card, Body, Mono, K, Num, M, beatAt } from "../shared";

/** 验证：四组数字逐项对照；MASE 全表与收益率失效计数都在屏幕上。 */
export const SVerification: React.FC = () => {
  const b = (i: number) => beatAt("verification", i, 26);
  const stats = [
    ["股票", M.meta.stocks, "只", "2020–2025，剔除停牌"],
    ["断言", M.meta.tests, "条", "3 个模块，全部通过"],
    ["行数", M.meta.rows, "行", "CSV 快照，sha256 可查"],
    ["收益点", 483, "点", "5 只股票，逐日预测"],
  ] as const;
  const half = Math.ceil(M.mase.values.length / 2);
  const left = M.mase.values.slice(0, half);
  const right = M.mase.values.slice(half);

  return (
    <Scene id="verification">
      <Head kicker="05 / 四组数字" title="每个数都能回到一次运行" goal="指标、样本、失效计数，逐项对照" />

      <div style={{ position: "absolute", left: PAD, top: 270, display: "flex", gap: 20 }}>
        {stats.map(([k, v, u, note], i) => (
          <Build key={k} at={b(i * 2)}>
            <Card accent={i === 1 ? C.cyan : C.panelLine} pad={18} style={{ width: 400 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <Num value={Number(v)} size={FT.num} color={i === 1 ? C.cyan : C.ink} />
                <K>{u}</K>
              </div>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink, marginTop: 2 }}>{k}</div>
              <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 2 }}>{note}</Body>
            </Card>
          </Build>
        ))}
      </div>

      <Build at={b(9)} style={{ position: "absolute", left: PAD, top: 438, width: 900 }}>
        <Card label="MASE(5) · 20 只升序 · 训练段做分母" accent={C.violet} pad={18} style={{ width: 900, height: 480 }}>
          <div style={{ display: "flex", gap: 24 }}>
            {[left, right].map((col, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                {col.map((x, i) => {
                  const hot = x.mase5 === M.mase.min || x.mase5 === M.mase.max;
                  return (
                    <div key={x.code} style={{ display: "flex", alignItems: "baseline", padding: "5px 0", borderBottom: "1px solid " + C.panelLine }}>
                      <Mono size={FT.micro} color={C.inkFaint} style={{ width: 26 }}>{String(ci * half + i + 1).padStart(2, "0")}</Mono>
                      <div style={{ flex: 1, fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{x.name}</div>
                      <Mono size={FT.meta} color={hot ? C.cyan : C.ink}>{x.mase5.toFixed(4)}</Mono>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <Body size={FT.micro} color={C.inkFaint} style={{ marginTop: 10 }}>
            {"小于 1 的 " + M.mase.belowOne + " 只；中位数 " + M.mase.median.toFixed(4) + "。最小 " + M.mase.minName + "，最大 " + M.mase.maxName + "。"}
          </Body>
        </Card>
      </Build>

      <Build at={b(16)} style={{ position: "absolute", left: 1050, top: 438, width: 750 }}>
        <Card label="收益率 MAPE · 5 只 · 483 点" accent={C.coral} pad={18} style={{ width: 750, height: 480 }}>
          <div style={{ display: "flex", paddingBottom: 8, borderBottom: "1px solid " + C.panelLine }}>
            <div style={{ flex: 1 }}><K>{"股票"}</K></div>
            <div style={{ width: 90, textAlign: "right" }}><K>{"跳过"}</K></div>
            <div style={{ width: 130, textAlign: "right" }}><K>{"sMAPE"}</K></div>
          </div>
          {M.returns.map((r, i) => (
            <div key={r.code} style={{ display: "flex", alignItems: "baseline", padding: "9px 0", borderBottom: "1px solid " + C.panelLine }}>
              <div style={{ flex: 1, fontFamily: FONT.serif, fontSize: FT.h3, color: C.ink }}>{r.name}</div>
              <Mono size={FT.meta} color={i === 0 ? C.coral : C.inkDim} style={{ width: 90, textAlign: "right" }}>{r.skipped + "/483"}</Mono>
              <Mono size={FT.meta} color={C.ink} style={{ width: 130, textAlign: "right" }}>{r.smapePct.toFixed(2) + "%"}</Mono>
            </div>
          ))}
          <Body size={FT.micro} color={C.inkDim} style={{ marginTop: 12 }}>
            {"茅台 483 点里 265 个负收益、2 个零，严格 MAPE 会直接报错；跳过 267 个后，sMAPE 仍在 147% 量级。MAPE 的 2086% 不能当精度宣传。"}
          </Body>
          <div style={{ marginTop: 8 }}><K>{"数据来自 20 只 A 股快照；本集没有拟合模型，也不是书的实验。"}</K></div>
        </Card>
      </Build>

      <Build at={b(22)} style={{ position: "absolute", left: PAD, top: 942, width: 1680 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{"本集没有拟合结果，也没有性能数字。"}</div>
          <K>{"四组数只证明：数据可复算，指标能判决。"}</K>
        </div>
      </Build>
    </Scene>
  );
};
