import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, U, pageAt, Pages, Scene, SceneHead, Card, Row, Body, Num, Verdict, K, Chip } from "../shared";

export const SOutro: React.FC = () => {
  const at = [0, pageAt("outro", 11)];
  const a = U("assoc");
  const s = U("sat");
  const t = U("tranad");
  return (
    <Scene id="outro">
      <SceneHead id="outro" />
      <Pages id="outro" at={at}>
        {/* 页一：三个读数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1776 }}>
            <div style={{ display: "flex", gap: 28 }}>
              {[
                { k: "关联差异", f1: a.f1, note: "零训练，F1 最高，告警 3.19%", c: C.cyan },
                { k: "次邻域遮罩", f1: s.f1, note: "两个参数，召回 99.21%，告警 34.54%", c: C.amber },
                { k: "两阶段焦点", f1: t.f1, note: "25,896 参数，AP 最高，14/14 段", c: C.violet },
              ].map((u) => (
                <div key={u.k} style={{ width: 574 }}>
                  <Card label={u.k} accent={u.c}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 76, color: u.c, lineHeight: 1.1 }}>{u.f1.toFixed(4)}</div>
                    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim, marginTop: 8 }}>F1（同一套 injected 真值）</div>
                    <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 10 }}>{u.note}</div>
                  </Card>
                </div>
              ))}
            </div>
            <Body style={{ marginTop: 34, width: 1700 }}>
              一集一个读数：关系被换掉时，数值可以不变，注意力矩阵会变。三个单元从三个角度量这件事 —— 一个不需要训练，一个只有两个参数，一个要手写反向。
            </Body>
            <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
              <Verdict ok label={M.meta.checks + " 项证据检查通过"} />
              <Chip color={C.cyan}>{M.meta.tests.asserts.toLocaleString("en-US") + " 条测试全绿"}</Chip>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页二：下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 1000 }}>
            <Card label={"下一集 · E" + M.next.episode} accent={C.violet}>
              <div style={{ fontFamily: FONT.serif, fontSize: 52, color: C.ink, lineHeight: 1.3, padding: "14px 8px 18px" }}>{M.next.title}</div>
              <Row name="从重构到概率" value={M.next.minutes + " 分钟"} note="AE 的重构误差 → VAE 的隐空间与 KL" width={950} />
              <Row name="两个陷阱" value="恒等映射 · 后验坍缩" note="潜维度不再是越大越好" width={950} />
              <Row name="同一套注入" value="继续复用" note="换尺子，不换考题" width={950} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1110, top: 292, width: 740 }}>
            <Card label="证据在哪" accent={C.amber}>
              <Row name="单元提交" value={M.meta.commits.units} note="三个模块 + 三个规格" width={690} />
              <Row name="证据提交" value={M.meta.commits.evidence} note={M.meta.checks + " 项检查 JSON"} width={690} />
              <Row name="数据提交" value={M.meta.commits.data} note="导出脚本 + 清单" width={690} />
            </Card>
            <Card label="怎么复现" accent={C.cyan} style={{ marginTop: 18 }}>
              <Row name="一条命令" value="tsbase 子命令" note="固定种子，逐字节可复现" width={690} />
              <Row name="数据" value={M.data.sha} note="与清单里的 sha256 对齐" width={690} />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
