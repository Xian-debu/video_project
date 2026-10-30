import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Head, Scene, PAD, Card, Body, Mono, K, M, beatAt } from "../shared";

/** 边界：七条 + 一条隐藏边界。 */
export const SBoundary: React.FC = () => {
  const b = (i: number) => beatAt("boundary", i, 38);
  const items: { t: string; d: string; c: string }[] = [
    { t: "证据等级", d: "采样协议 B 级（书只有定义与图）；实现与数字 A 级（33 条断言、35 条证据检查）。", c: C.cyan },
    { t: "数据范围", d: "单票 000001.SZ、1,200 个交易日、前复权；不跨市场，不外推到其他资产。", c: C.violet },
    { t: "采样口径", d: "5% 按「点」算；窗宽 5 → 10 窗；前/后端按连续窗口定义（书未写死，本仓标注）。", c: C.amber },
    { t: "效率协议", d: "固定 200 步、同 CPU、同批数据；峰值用 RTS max residency，预热 3 次取 7 次中位数。", c: C.cyan },
    { t: "误差非单调", d: "同预算下大模型误差更大（0.00300 / 0.00316 / 0.0100）；不能外推成「大模型无用」。", c: C.coral },
    { t: "反例语义", d: "等距与撒点不是「效果差」，是「不合法」：时间连续性被破坏，库直接报错。", c: C.coral },
    { t: "复现路径", d: "命令、ts-base 提交、证据文件、sha256 全在仓内；数字由 data/fewshot.json 单一真源给出。", c: C.cyan },
    { t: "隐藏边界", d: "前端窗口与前端点的索引完全相同（0–49），但样本单元不同：10 个 5 点窗口 vs 50 个单点。", c: C.inkFaint },
  ];
  return (
    <Scene id="boundary">
      <Head kicker="07 / 边界" title="七条边界" goal="哪些话能说、哪些不能说" />

      {items.map((it, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div key={it.t} style={{ position: "absolute", left: PAD + col * 884, top: 292 + row * 168, width: 860 }}>
            <Build at={b(Math.min(36, i * 4))}>
              <Card label={it.t} accent={it.c} style={{ width: 860, height: 152 }} pad={18}>
                <Body size={FT.meta} color={C.inkDim}>{it.d}</Body>
              </Card>
            </Build>
          </div>
        );
      })}
    </Scene>
  );
};
