# 《时序智能》系列（tsint）制作蓝图

> 状态：🧭 规划冻结（2026-10-29）——**不是**开工令。逐集目录见 [series-tsint-episodes.md](series-tsint-episodes.md)：**74 集 / 190 个完整算法 / 190 of 193 单元**（27.2 小时）。
> 硬约束见 [CONVENTIONS.md §8](../CONVENTIONS.md)；算法侧规范见 ts-base 的 `ALGORITHM-SPEC.md`；逐集规划真源是 ts-base 的 `plans/series.json`。

## 0. 一句话

把《时序智能》9 章、193 个算法单元讲成**可验证的实现课**：74 集，每集不超过 3 个完整 Haskell 算法（合计 190 个），
每个算法在 ts-base 里独立实现、有测试、有真实 A 股数据上的行为演示，视频里每个数字都能一条命令复现。

## 1. 三个仓的分工

| 仓 | 角色 | 本系列里的产物 |
|---|---|---|
| **ts-base** | 算法与证据的唯一真源 | `src/TsBase/Algos/ChNN/*.hs`、`test/**`、`docs/algos/*.md`、`inventory/evidence/*`、`plans/series.json` |
| **video_project**（本仓） | 镜头、讲稿、素材、交付 | `series/tsint/**`、本蓝图、`claims.json` 校验 |
| **ts-admin** | 数据真源 | `inventory/scripts/export_demo.py` 导出的切片（sha256 manifest） |
| **gen24-admin** | 跨天长任务台账 | 进度、验收记录、风险 |

**单一真源原则**：集号/标题/范围只在 `plans/series.json` 定义；video_project 的 `series.json`
是它的**投影**（由脚本生成，不手改）。

## 2. 系列结构

```
series/tsint/
  series.json                 # 从 plans/series.json 生成（episodes 顺序 = 生产顺序）
  plan.md                     # 叙事主张 + 生产顺序 + 依赖（人工可读摘要）
  docs/
    sources.md                # 原文页码索引（印刷页 ↔ 章节 ↔ 算法单元）
    fact-ledger.md            # 事实核查台账：每条断言 → 证据文件 → 复核状态
    production-log.md         # 每集生产记录（日期、卡点、返工）
  shared/
    src/                      # 全系列共用的画面组件（片头、公式排版、终端截图框）
    data/                     # 全系列共用的口径数据（总集数、总算法数、数据规模）
    public/                   # 共享字体/纹理（staticFile("series/tsint/…")）
    build/                    # 共享脚本（生成系列级图表的 CSV）
  episodes/
    01-<slug>/ …              # 每集一个标准 pack
```

## 3. 每集 pack 的附加约定（在标准 pack 合同之上）

| 文件 | 额外要求 |
|---|---|
| `film.json.notes` | 必写 `unit: <unit_id>; <unit_id>`（本集算法单元） |
| `film.json.paper` | `[{title:"时序智能", pages:"41–44", license:"CC BY-NC-ND 4.0"}]` |
| `data/evidence.json` | 从 ts-base `inventory/evidence/` 复制的指标（**不要手写**） |
| `claims.json` | 屏上每个数字一行，见 §5 |
| `docs/plan.md` | 六段结构（问题/公式/直觉/实现/验证/边界）+ 每段的证据位置 |
| `build/` | 至少一个脚本从 `data/`（或 ts-base evidence）生成图数据，确定性 |

## 4. 一集的制作流程（S2 之后的稳定流水线）

```
① ts-base 实现算法 → cabal test 全绿 → tsbase export 产出 evidence
② 写算法卡（公式来源/推导/实现要点/验证/边界）
③ 写本集 docs/plan.md（六段 + 分镜草图）
④ build/ 脚本生成图数据 → data/*.csv|json
⑤ 写 src/ 组件 + script.ts（旁白稿，数字从 data/ 取）
⑥ 原创示意图 + 原文截取（标页码/许可）+ 公式排版
⑦ TTS 旁白 → 对时长 → 音画对齐
⑧ node tools/check.mjs + 引擎 render → 人工看关键帧 → 交付
⑨ 提交：ts-base 一次（algos），video_project 一次（tsint/NN-slug）
```

## 5. claims.json 契约

```json
{
  "schemaVersion": 1,
  "episode": "tsint-12",
  "claims": [
    {"id":"ic-mean","value":-0.06825,"unit":"Rank IC","screen":"02:41",
     "source":"ts-base:inventory/evidence/ch2-xxx/2026-10-29T12-00-00Z.json#/metrics/ic_mean",
     "command":"docker exec haskell-ts bash -lc 'cd /work && cabal run tsbase -- demo ch2-xxx'"}
  ]
}
```

规则：`value` 必须与 evidence 文件里的数值**逐位一致**；`command` 必须是能真跑的命令；
没有 `source` 的数字不允许出现在画面上（包括旁白里口播的数字）。

## 6. 视觉素材三类（每集齐备）

1. **原创示意图**：由 `build/` 脚本生成（CSV → SVG/组件）或手写 SVG；数据可溯源。
2. **原文截取**：只截必要的一小段/一张图，角标 `时序智能 p.XX · CC BY-NC-ND 4.0`；
   禁止整页铺满、禁止做背景板、禁止改编重绘后不标注。
3. **LaTeX 公式**：逐符号排版（不用截图糊），每个符号在画面或旁白里有解释。

## 7. 门禁（每集必须全过）

| 门 | 检查 | 谁保证 |
|---|---|---|
| G-A | `cabal test all` 全绿，算法卡齐备 | ts-base |
| G-B | `tsbase export` 证据落盘，sha256 可查 | ts-base |
| G-C | `node tools/check.mjs` 通过 | video_project |
| G-D | claims 全覆盖（画面上没有无源数字） | 人工 review + 脚本 |
| G-E | 版权角标齐（原文页/许可） | 人工 review |
| G-F | 关键帧人工看过；响度/静音/闪烁闸门通过 | 引擎 QA + 人工 |

## 8. 生产顺序（系列级）

| 阶段 | 内容 | 产出 |
|---|---|---|
| S0 | 系列骨架 + 前 3 集 pack 骨架（无内容） | catalog 登记、check 通过 |
| S1 | 全书算法卡草稿（不写代码）+ 事实台账 | 每 unit 一页卡 |
| S2 | 首集样片（推荐 ch09 的 ODE 欧拉/RK4 或 ch08 指标：零数据、可精确断言） | 1 集 published-ready |
| S3 | 按章推进：先章内全部算法+测试，再批量出片 | 每章里程碑 |
| S4 | 总览集（全书地图 + 复现指引） | 1 集 |
| S5 | 收尾：全片单、B 站发布、验收报告 | 系列完成 |

**为什么首集选 ch08/ch09**：这两个章的算法是纯函数/解析解，A 级证据最硬（黄金值可手算），
能最快验证"实现→证据→视频"整条流水线，避免先啃训练类算法导致卡住。

## 9. 风险与回退

见 ts-base `docs/08-risks.md`（同一张表）。video 侧特有风险：
**视觉风格与算法节奏不匹配**（公式密度过高导致画面闷）——缓解：每集至少两个动态画面
（数据图动画、终端跑测试），公式段落 ≤ 90 秒且必须有符号标注。

## 10. 工具缺口（来自 session-54db5817 的真实复盘）

龙芯系列的生产复盘（ts-base `docs/research/session54-workflow.md`，462 行）给出了 27 道 `make.mjs` 门禁与 23 条坑。
可直接复用的有 9 项（pack 结构 / sync+隔离 / 27 门禁 / claims / plates / TTS / 混音+loudnorm / publish / series 结构）。
本系列**必须新增**以下 8 项，现状全部未实现，按依赖顺序：

| # | 新增件 | 验收判据 | 归属 |
|---|---|---|---|
| 1 | `tsbase export` → `inventory/evidence/<unit>/<ts>.json`（sha256/metrics/command/seed）+ `tools/evidence.mjs` | claims.value 与 evidence 逐位一致；sha256 对得上；command 真跑退出 0 | ts-base → 本仓 |
| 2 | 公式：构建期 katex SSR 成 SVG 存 `data/` | 渲染期零排版计算；同一公式两次构建字节一致 | 本仓 |
| 3 | 代码：构建期 shiki → tokens JSON | 揭示动画只读 tokens，不改文字 | 本仓 |
| 4 | `TestTerminal` + `data/test-run.json` | `cabal test` 输出确定性（固定 seed/输入），屏上 PASS 可对到日志行 | ts-base(产) → 本仓(读) |
| 5 | `tools/section_check.mjs` | script.ts 六段 `// SECTION:` 标记齐；缺一段 check 失败 | 本仓 |
| 6 | `tools/series_project.mjs` | `series/tsint/series.json` 由 `plans/series.json` 生成；手改被 check 抓到 | ts-base → 本仓 |
| 7 | `schema/film.schema.json` 的 `paper` 改 `oneOf` | 龙芯/convcode 对象形态仍通过；tsint 数组 + pages/license 通过 | 本仓 |
| 8 | `SourceBadge` 组件 | 页码 p.XX + CC BY-NC-ND 4.0；每 plate 至少出现 N 秒由门禁断言 | 本仓 |

**S2 首集规则**（由复盘强化）：样片必须是零外部数据、黄金值可手算的一集（ch08 指标或 ch09 ODE），
样片验收通过前不铺量；先章内算法与测试全绿，再批量出片（TTS 重跑约 12 min/集）。

**坑（必读）**：`films sync` 会删派生 `lines.json`；「门禁全绿」≠内容正确（G0 掩码曾全绿但错）；
旁白 clip 数 ≠ 讲稿行数；claims 有无源数字时删数字而不是造来源；长任务走受管后台 job。