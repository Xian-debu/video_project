# 21-attn-mhsa-block-masked — 注意力三件套：多头自注意力、Transformer 块、因果掩码

> status: ready（证据 35/35；画面与旁白已按实测语音对齐）
> chapter: ch03 · 注意力 | 书 p.53–56（印刷页） | units: ch3-mhsa / ch3-transformer-block / ch3-masked-attn
> 算法：ts-base 1e3df18；证据：ts-base b1f9322；数据：ts-admin 41523b5

## 一句话

书只给了骨架（式 3.19–3.21），本集把骨架补成可跑的 Haskell，并用 35 项检查证明实现与定义一致；
**不训练、不预测、不声称任何注意力头学到了东西**。

## 口径决定（写片前冻结）

1. **缩放**：打分先除 √d_k 再 softmax。不做「去掉缩放会 NaN」的叙事——计划草稿里的这句是错的。
   双精度下最大 logit 从 5.7144 升到 22.8577，softmax 饱和、熵从 6.1576 bit 掉到 4.1173 bit，**没有 NaN**。
   该更正已写入 `docs/09-book-errata.md` E36。
2. **拼接顺序**：本仓选「按时间步交错」（row-interleaved），前向与求导必须共用同一顺序。
   曾经两边不一致：单测自洽照常通过，跨前向对照误差 3.96；统一后 2.6157e-10。
3. **掩码**：上三角置 −∞（不是 0），softmax 后严格上三角权重和恰为 0；首 token 只 attend 自己。
4. **参数账**：偏置全省略。注意力 16,384；块矩阵（FFN + 两个 LN）49,152；合计 49,920。
   不是 49,728——每项都按形状算，可复算。
5. **只有 MHSA 有解析梯度**：`mhsaLossGrad` 覆盖 256 个小矩阵参数，中心差分 eps=1e-5，
   最大误差 2.6157e-10，门槛 1e-6；五步 GD lr=0.05，损失 5.8324 → 0.6802。
   Transformer 块只有前向，**块的梯度检查是本集明确空白**。
6. **没有位置编码**：置换等变误差精确为 0，这是设计性质；需要顺序信息得另外加。
7. **不报预测误差**：没有预测头、没有回测、没有准确率。本集只验机制。

## 数据

- 窗口：96 个交易日 × 8 条序列（6 只 hfq 股票 + sh000300 + sz399001），
  内连接 2024-01-01..2025-12-31 后取最后 96 个交易日 = **2025-08-12 .. 2025-12-31**。
- 列内 z 分数（总体标准差）；sha256 `19a81d77…`；window_daily_8.csv **9,565 B**。
- 导出：ts-admin `inventory/scripts/export_ch03_attn_window.py`（manifest 记录 commit afe5628）。

## 三个模块

- `TsBase.Algos.Ch03.Mhsa`：initMhsa / mhsaForward / mhsaLossGrad；4 头、d_model 64、d_k 16。
- `TsBase.Algos.Ch03.TransformerBlock`：LN → MHSA → 残差 → LN → FFN(GELU, d_ff=256) → 残差；LN eps=1e-5。
- `TsBase.Algos.Ch03.MaskedAttn`：maskedAttnWith（显式权重版本），便于对掩码逐项检查。

## 证据读数（已冻结，画面逐项复述）

| 检查 | 读数 |
| --- | --- |
| 证据程序 | 35/35 PASS（数据 6 / 结构 19 / 梯度 2 / 真实窗口 8） |
| cabal 测试 | 76 套 / 1,030 断言全绿（mhsa 7 / block 4 / masked 5） |
| softmax 行和 | 双精度误差 < 1e-12（CSV 舍入另见 8e-8） |
| 置换等变 | 0 |
| 零块退化 | 逐行 block(Z)=LN(LN(Z))，误差 0 |
| 参数 | 16,384 / 49,152 / 49,920 |
| 掩码 | 严格上三角和 0；前 3 行输出不变；首 token 只看自己 |
| 梯度 | 256 参数，eps 1e-5，maxErr 2.6157386641e-10（门槛 1e-6） |
| 下降 | loss 5.8324198901 → 0.6801658564，lr 0.05，5 步 |
| 缩放消融 | 5.7144176288 vs 22.857670515（max \|logit\|）；6.157630739 vs 4.1172522468 bit（熵） |
| 手算 2×2 | 权重 0.2689414214/0.7310585786 与 0.1192029220/0.8807970780；输出 17.31058579 / 18.80797078 |

## 画面

8 场 33 页：开场 3 / 问题 3 / 定义 4 / 直觉 4 / 实现 5 / 验证 7 / 边界 5 / 收尾 2。
讲稿 256 行、每行 ≤34 字；页切换以 `pageAt(scene, lineIndex)` 吸附到实测语音行首。
关键画面：96×8 窗口 z 分数、head0 的 48×48 热图（步长 2 抽样）、手算 softmax 两行、
每头平均熵（近均匀，5.9869–6.2723 bit，上限 log₂96=6.585）、最后一行 top6 注意力日期、
拼接事故对照 3.96 → 2.6e-10、参数账、掩码流形、缩放消融两组读数。

## 边界（片内第 7 场逐条讲）

无训练（头近均匀是预期）；块无解析梯度（明确空白）；无预测/回测/准确率；只有一个窗口；
无位置编码（置换等变是设计性质）；书外维度与写法是本仓选择；双精度不会 NaN（勘误 E36）；
证据 JSON 记 b1f9322 而 summary.json 记 19ba447（编译时 HEAD，跨提交对照会差一个）；
A7 算法卡片留到 W 阶段；演示 CLI 仍是规划中，当前只有证据子命令。

## 复跑

```
cd /root/ts-base
cabal run -v0 tsbase -- evidence-ch03-attn \
  --data data/episodes/21-attn-mhsa-block-masked \
  --out data/episodes/21-attn-mhsa-block-masked \
  --evidence inventory/evidence
cabal test
```

pack 数据：`python3 build/generate_attn_data.py`（读 ts-base 的 summary/CSV，重建 `data/attn.json`，derived）。
