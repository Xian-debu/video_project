# 收尾计划（2026-11-15）——74/74 交付后的清理、状态修正、推送、复验与经验提炼

> 本文件是 tsint 系列（74 集）交付完成后的**收尾唯一计划**。取代此前"下一步"性质的临时说明；
> `docs/HANDOFF-E45.md` 仍是**生产期流水线**的权威记录（本文件不改写它，只在其上做"生产结束、仓库收口"）。
> 状态：draft → 执行中 → 完成后本文件即为收尾报告（§9 记录实测数字）。

## 0 授权与边界（本次任务书要点）

- 用户任务：①清理垃圾（尤其是 video_project 里几乎 1G/集的视频资源，**保留生成它们的方法步骤**，被生成物可清理；其它垃圾自行探测，没有就不要乱删）；②整理并更新项目后**推送到对应 GitHub 仓库**（"以前出现过项目状态不正确的情况，务必认真整理"）；③**本次不重新生成视频**，只验证整理后的项目没问题；④前三步完成后提炼经验成 skill/plugin。
- 授权范围：可对 `gen24-admin` / `video_project` / `video-pipeline-blueprint` 做上述规划与提交。
- 硬边界：不动其它项目（`models`/`AirLLM-data`/`tex_project`/`rag-kb`/`ts-admin`/`ts-base` 只读）；不发布 B 站；不重渲染；不删 tracked 的交付凭据（cover/srt/chapters）。
- 判据：任何删除都必须给出**证据**（字节相同 / 0 引用 / 有在库凭据可重建），三条都给不出的一律保留（pre-cleanup-audit 铁律）。

## 1 起点事实（2026-11-15 实测）

| 项 | 值 |
| --- | --- |
| tsint 交付 | 74/74 已投稿，`release/ledger.json` 全 submitted + bvid；B 站 BV 号齐全 |
| video_project | master，HEAD `e684040`，clean，**52G**（git 仅 420MB，tracked 3011 文件） |
| video-pipeline-blueprint | main，HEAD `a667688`，**ahead 7 未推送**，21G（node_modules 16G + out/ 4.4G） |
| gen24-admin | master，HEAD `9cf1005`，clean，11M |
| ts-base / ts-admin | 均 clean 同步（本次不改） |
| 磁盘 | `/` 1007G 总 / 469G 用 / 487G 可用 |
| 体检 | `node tools/check.mjs` 在**作者树**=0 error；在**干净克隆**=73 error（见 D5） |

## 2 发现的"项目状态不正确"清单（全部有实测证据）

- **D1 已发布事实没有进 pack**：74 个 `film.json` 全部没有 `bili` 字段，`status` 仍为 `ready`。`tools/status.mjs` 因此把 74 行 BV 全打成 `-`，与 `STATUS.md` 的 74 个 BV 矛盾。根因：发布收尾只跑 `release/backfill_status.py` 回填了 `STATUS.md`，没回填 `film.json`（而 `README` 规则 6 要求 `film.json.bili.bv` 记录已发布视频；`tools/lib.mjs:252` 校验 `published` 必须带 `bili.bv`）。
- **D2 STATUS.md 的 status 列不可由仓库推出**：74 集写 `published`，源数据是 `ready` → `node tools/status.mjs --md` 与 STATUS.md 差 150 行（74 行 status+BV，另 12 行 sec）。
- **D3 sec 列不可复现**：只有第 53–64 集有数字，来源是人工从 manifest 抄；`status.mjs` 靠正则读 entry 的 `export const TOTAL = <number>` 取帧数，而 74 集全部是 DYNAMIC（`TOTAL` 由 `script.ts` 的 `SCENES.reduce` 算出），正则全部落空。
- **D4 delivery 列不可复现**：`status.mjs` 用 `readdirSync(delivery)` 数目录条目，把本机 ignored 残渣（mp4/wav/stills）也数进去；克隆仓只有 5 个 tracked 文件。
- **D5 干净克隆过不了自家体检（最严重）**：`git worktree add --detach /tmp/vp-clean HEAD && node tools/check.mjs` → **73 error**，全部是 `narration is missing: assets/audio/narration.wav`。因为 `narration.wav` 是派生且被 gitignore，而 `checkPack` 无条件要求它存在。→ 任何人克隆这个仓库，第一道门禁就红。
- **D6 体积与策略自相矛盾**：`narration.wav` 被判为派生（根 `.gitignore` 有 `**/assets/audio/narration.wav`），但**历史上有 11 个被 tracked**（7 个 loongarch + 38-ad-graph-contrastive 99.5MB + singles/arc 55.9MB + convcode 37.3MB + hawk 69.3MB，合计 578,396,644 B），且 `README` 第 33 行写"narration.wav 入库"——与 .gitignore、与 74 集共 13GB 的实际不可能入库都冲突。

## 3 终态验收（A 类，机器可判）

| # | 断言 | 命令 | 期望 |
| --- | --- | --- | --- |
| A1 | 干净克隆全绿（源码级） | `git worktree add --detach /tmp/vp-clean HEAD && (cd /tmp/vp-clean && node tools/check.mjs)` | `0 error` |
| A2 | 状态可复现 | `node tools/status.mjs --check` | exit 0（STATUS.md 与生成结果逐字节一致） |
| A3 | 发布事实一致 | `python3 series/tsint/release/verify_release_state.py` | 74/74 film.json.status+ bili.bv 与 ledger.json 一致、check.mjs 0 error |
| A4 | 体积 | `du -sh /root/video_project`；引擎 `du -sh out` | ≤ 1.2GB；out/ 不存在 |
| A5 | 推送 | `git ls-remote <each repo>` vs `git rev-parse HEAD` | 三仓 SHA 相同（blueprint 7 个旧提交也在远端） |
| A6 | 方法可复现 | 抽样 5 集跑 `film.json.derive[].command` | 全部 exit 0 且产出 JSON 合法 |
| A7 | 不重生成视频 | 无 make 调用；（可选）`release/manifest.json` 里 videoSha256/bytes 作为成品凭据保留 | 74 条凭据齐全 |

## 4 阶段与门禁

**P0 计划入库**（本文件）：三仓各提交规划说明；建 goal。
**P1 状态修正（先做，因为最不可逆的是"错的状态被提交"）**
1. `tools/status.mjs`：`sec` 改 `delivery/report.json` → `release/manifest.json.durationSec` → `-`；`delivery` 列只数 **tracked** 文件；`BV` 走 `film.bili.bv`（缺失时回退 ledger）；新增 `--check`。
2. `release/backfill_status.py` 扩展：从 `ledger.json` 写 `film.json.status="published"` + `bili={bv,url,title?}`（幂等，只补不覆盖人工字段）。
3. 生成物化：`node tools/status.mjs --md > STATUS.md`；CI 式入口 `node tools/status.mjs --check`。
4. `checkPack` 区分**源码检查**与**资产检查**：`check.mjs` 默认不要求派生资产存在（D5），`check.mjs --assets` 在出片/交付时要求；`narration` 统一为派生（被 gitignore），修 D6：`git rm --cached` 11 个 + README/CONVENTIONS 改口径。
   → 门禁：A1 绿、A2 绿、A3 绿，提交 `tools+release: 状态单一真源`。
**P2 清理（分档、逐档提交、df 记账）**：见 §5。每档删前 `du` 记录，删后跑 A1/A2 复验。
**P3 推送**：video_project、blueprint（7 提交）、gen24-admin（本计划 + 收尾报告）。推完用 `git ls-remote` 对 SHA（推送成功 ≠ 仓库内容对）。
**P4 干净树复验**：A1–A7 全套跑一遍，输出落 `docs/CLOSEOUT-RECEIPT.md`（每条门禁的**原样输出数字**）。
**P5 收尾报告**：`docs/CLOSEOUT-RECEIPT.md` + `STATUS.md` + `gen24-admin/docs/58-final-closeout-report.md`；三仓再提交。
**P6 经验提炼**：先写 `docs/SKILL-CANDIDATES.md` 再落 skill/plugin（见 §9）。

## 5 清理分档（证据 + 凭据）

| 档 | 对象 | 体积 | 判据 | 动作 |
| --- | --- | --- | --- | --- |
| A1 | `**/assets/audio/clips/*.mp3` | 0.36GB / 21480 个 | TTS 片段缓存，`lines.json`+`voice.json`+`tts_narration.py` 可重建 | 删 |
| A2 | `**/delivery/scenes/`、`stills/`、`raw_video.mp4`、`programme_unnorm.mp4`、`report.json`、`score.meta.json` | 约 1.1GB | 中间产物，成品 mp4 另行留凭据 | 删 |
| B1 | `delivery/*.mp4` 成品（74 集） | 3.56GB | 已投稿，`manifest.json` 存 videoSha256+bytes+时长，B 站 BV 可复核 | 删（可重渲） |
| B2 | `delivery/score.wav`、`mix.wav`、`narration.wav` | 39.5GB | 纯派生物：score 由共享床+时长合成、mix 由 narration+score、narration 由 clips | 删 |
| B3 | 11 个 tracked `narration.wav` | 0.578GB | D6：策略统一为派生 | `git rm --cached` + 删盘 |
| C | `__pycache__`、`.dsh-ops-*` 锁、`*.tmp`、引擎 `out/` | 引擎 4.4GB | gitignore 的本地残渣 | 删 |
| D | `node_modules` | 16GB | **保留**：验证需要，重装要网 | 留 |
| E | 其它项目（models/AirLLM-data/tex_project…） | 100GB+ | G5 不是本任务的 | **不碰** |

目标：video_project 52G → **≤1.2G**；引擎 21G → **≈17G**。预估回收 ≈ 55.7GB。

## 6 状态修正链路（单一真源）

```
release/ledger.json      (发布事实：bvid / url / status=submitted)
release/manifest.json    (成品度量：videoBytes / videoSha256 / durationSec)
        │
        ├─→ film.json  { status:"published", bili:{ bv, url } }        ← backfill_status.py
        └─→ STATUS.md  (status / sec / audio / derived / delivery / BV) ← status.mjs --md
```
规则：`ledger.json` 只由发布动作写；`film.json` 与 `STATUS.md` 都是**投影**，由脚本生成；`--check` 断投影一致。

## 7 复验门禁（P4 逐条落 `docs/CLOSEOUT-RECEIPT.md`）

G1 干净克隆 `check.mjs` 0 error（A1）｜G2 `status.mjs --check` exit 0（A2）｜G3 `verify_release_state.py` 74/74（A3）｜G4 抽样 5 集 `derive` 命令 exit 0（A6）｜G5 `verify_manifest.py --quick` 通过｜G6 引擎侧 `VIDEO_PROJECT=/tmp/vp-clean node scripts/films.mjs sync && node scripts/films.mjs check --strict` 通过｜G7 引擎 `out/` 不存在且 `git status` clean｜G8 三仓 `ls-remote` SHA == 本地 HEAD、远端可 `git cat-file` 读到 STATUS.md 新版本 blob。

## 8 回退点与风险

- 回退点：P1/P2/P3 各阶段一个提交；清理前 `git stash list` 空 + `git status` clean 已确认。
- 风险 R1：删 `clips/*.mp3` 后若需重生成某集配音，要联网 edge-tts（离线不可重建）→ 已在 CONVENTIONS 记录"配音需要网络，重建成本 = 一次 TTS 全量"。
- 风险 R2：`git rm --cached` 11 个大文件后 `.git` 历史仍含 578MB → 不动历史（改写历史风险大于收益），只在 README 记明。
- 风险 R3：`check.mjs` 语义变更可能让 CI 变松 → 用 `--assets` 在交付步骤补严，并在 README 写明两种模式。

## 9 经验提炼交接（P6，详见 `docs/SKILL-CANDIDATES.md`）

长线工程四类经验：①控制范式（goal+400 轮、交接文档取代前文、self-auth 自授权清单、暂停/续跑协议）；②工程搭建（四仓职责与挂载方向、14 步流水线、证据→数据→画面单向数据流、门禁链）；③踩坑（OOM 137、反引号、TTS 缓存、tsc 查引擎副本、dump 两轮、限流 137022）；④收尾（清理分档、状态投影单一真源、干净树复验）。
交付：追加/新建 skill + 评估 `delivery-archive-guard` 升 plugin。
