# 经验提炼候选清单（2026-11-15，P6）

> 输入：五会话 digest（`/tmp/sess/*/DIGEST.md`）、收尾计划/回执、本轮 P1–P5 实测。
> 原则：能追加就追加（避免技能增殖）；同一主题已有技能则修正/合并；只把「跨项目可复用」的写进去，项目细节留在仓库文档。

## 0 结论一览

| # | 候选经验 | 归入技能 | 动作 | 证据 |
| --- | --- | --- | --- | --- |
| S1 | 五棒会话接力、单一 goal、状态落盘、SELF-AUTH 决策 log、收尾退出协议 | `long-task-goal-orchestration` | **追加** §9 | 74 集 / 5 会话 / 22.07h；248/88/82 提交 |
| S2 | 交接文档写成「路径 + 判据 + 剩余清单」，接手先 triage 上棒遗留 | `cross-session-handoff` | **追加** §13 | 五份 DIGEST；遗留进程 152% CPU；E49 诚实负结果 |
| S3 | 可再生产物归档清理：三证门 + 分档 + dry-run + 账 | `pre-cleanup-audit` | **追加** §15 | 84 包/1658 文件/50.57GiB；引擎 18.74GiB |
| S4 | 门禁双模式（source/assets）与状态投影即门禁 | `delivery-gate-design` | **追加** §12 | 干净树 73 error → 0；`--check` 逐字节 |
| S5 | 收尾复验执行包（worktree + 抽样 derive + raw 对拍 + receipt） | `verification-before-completion` | **追加** §「干净树复验执行包」 | G1–G8 全绿；sha256 逐字节 |
| S6 | B 站 137022 滚动 24h 频控与批量投放断点 | `bilibili-publish` | **追加** §10 | 74/74 投稿，限流零提示 |
| S7 | 发布事实四层台账（manifest/ledger/film.json/STATUS 生成器） | **新技能** `release-state-ledger` | 新建 | D1–D6；`verify_release_state.py` OK |
| S8 | 系列生产工厂：四仓职责、挂载方向、plan-as-data、固定顺序 | **新技能** `series-production-factory` | 新建 | 74 集/190 算法/90 film 包 |
| S9 | 单集 commit→sync→make 顺序、「HEAD moved」拒绝渲染 | 并入 S8（流水线纪律） | 合并 | 39f2d02d 第4棒 |
| S10 | TTS 缓存/检查点坑（342 条只出 217 mp3、3 个 0 字节、lines.json 时长错） | 并入 S8（§TTS） | 合并 | 第4棒实测 |
| S11 | 干净树门禁（K34）新实例 | 并入 S5；并在 `delivery-gate-design` 交叉引用 | 合并 | 作者树全绿 ≠ 克隆能过 |
| S12 | `delivery-archive-guard` 升级为 DSH plugin | — | **不升级（记录理由 + 设计草案）** | 见 §3 |

## 1 已有技能的追加点（写清为谁、何时读）

### S1 `long-task-goal-orchestration`（追加 §9）
系列级控制范式：goal 只当「防断开关」；真状态在仓库（STATUS/CONVENTIONS/SELF-AUTH/plans/*.json）；
每集一提交；收尾是退出协议而非清理动作。附 A 类验收判据模板与三条反模式（手填状态表、派生资产无条件要求、从不跑干净树）。

### S2 `cross-session-handoff`（追加 §13）
五棒接力的交接实证：DIGEST 六段结构、接手第一小时的 triage 清单、授权不继承的再确认、
「不要复述历史，给路径和判据」；失败模式：顺序纪律只写在心里、限流只在对话里说。

### S3 `pre-cleanup-audit`（追加 §15）
把「可再生产物判据」落成可执行工具：三证门（sha256 + bytes + duration + bvid）、默认 dry-run、
档位化、空目录 prune、删除后三命令复验；实测数字与四个坑（series 对象、无 release 回退、tracked wav 残留、成品删后不能重算 sha256）。

### S4 `delivery-gate-design`（追加 §12）
两类新反模式：①对 gitignored 派生物无条件 `need()`（73 error 事故）；②人看状态表手填（不可由仓库推出）。
处方：门禁双模式 + 状态生成器 + `--check` + 发布事实三方交叉。

### S5 `verification-before-completion`（追加执行包）
干净树复验八步，给可复制命令与替代路径（克隆卡住 → worktree + raw sha256 + 偏差登记）。

### S6 `bilibili-publish`（追加 §10）
137022 频控识别（console 探针）与批量投放策略（串行、ledger 断点、次日续投）。

## 2 新技能（两个，均跨项目复用）

- `release-state-ledger`：作品发布的数据模型与工具契约（backfill 幂等、verify 三方、status 生成 + check）。
- `series-production-factory`：系列生产工厂（四仓、挂载方向、数据驱动计划、14 步、顺序纪律、TTS 与无人值守）。

两者都不写 tsint 项目专有数字以外的东西；案例段落只作证据。归入 skill-packs 的 `gen24-video` 组（产线）。

## 3 为什么 `delivery-archive-guard` 不升级为 plugin（记录决定）

判据：插件面 = 工具/钩子/UI。本经验的执行体是**仓库内工具**（`tools/archive.mjs`、`tools/check.mjs`、`status.mjs`），
它们天然依赖项目 schema（film.json、manifest、ledger）；做成插件就要跨仓库复制 schema 或引入配置中心，
维护成本 > 复用收益。且安装插件需重启 DSH Web（G4 系统变更授权），收尾阶段做会引入新风险。

若未来出现第三个内容仓复用同一 schema，再按此草案升级：
插件 `dsh-delivery-guard` 暴露三个只读工具——`delivery_audit(worktree)`（跑 G1–G3）、
`archive_plan(roots)`（dry-run 三证门并发 JSON）、`release_verify(series)`（ledger×manifest 交叉），
写操作永远留给仓库脚本。

## 4 不做的事

- 不把 74 集的单集细节抄进技能（在 `series/tsint/` 与 release manifest 里）。
- 不新建「视频产线」类第 4 个技能：`remotion-lecture-pipeline` 已覆盖引擎侧，新增只补系列级与发布侧。
- 不改写历史提交；技能仓本地提交（该仓无 remote）。
