# 收尾复验回执（2026-11-15）

本回执记录「时序智能 74 集」长线工程的收尾：状态单一真源修正（P1）、分档清理（P2）、
三仓推送（P3）、干净树复验 G1–G8（P4）。**未重新生成任何视频**，只验证整理后的工程自洽。

- 复验对象：`c32546e`（video_project master）、`995440e`（video-pipeline-blueprint main）、`4326f98`（gen24-admin master）
- 复验环境：`git worktree add --detach /tmp/vp-clean2 c32546e`（只用 tracked 文件，无本机派生资产、无 ignored 残渣）
- 时间：2026-11-15 20:00–20:40 Asia/Shanghai

## 1 结论

| 项 | 判据 | 结果 |
| --- | --- | --- |
| A1 干净树源检 | `check.mjs` 0 error | **通过**（0 error / 1 warning，见 G1） |
| A2 状态投影一致 | `status.mjs --check` exit 0 | **通过**（90 film 逐字节一致，见 G2） |
| A3 发布事实交叉 | `verify_release_state.py` | **通过**（ledger 74/74，见 G3） |
| A4 清理有据 | 三证门 + df 记账 | **通过**（见 §2，52G→1.2G、21G→1.4G） |
| A5 推送一致 | 远端 raw 内容 sha256 == 本地 | **通过**（见 G8） |
| A6 派生可复建 | 抽样 5 集 `derive` exit 0 | **通过**（5/5，见 G4；产物全部被 gitignore，跑完 `git status` 仍 0 行） |
| A7 引擎侧契约 | `films.mjs sync` + `check --strict` | **通过**（90 film / 2 series / registry current，见 G6） |

## 2 清理记账（P2）

清理工具：`tools/archive.mjs`（默认 dry-run，`--apply` 才删；每集必须同时具备
`manifest.videoSha256`+`videoBytes`+`durationSec` 与 `ledger.bvid` 才允许动；无凭据整包跳过）。

| 对象 | 清前 | 清后 | 回收 | 判据 |
| --- | --- | --- | --- | --- |
| `/root/video_project` | 52G | 1.2G | ≈50.6G | 84 包 × 1658 文件：B2 派生 wav 39.91G、B1 成品 mp4 3.73G、A2 中间产物 6.93G |
| `/root/video-pipeline-blueprint` | 21G | 1.4G | 18.74G | C-engine-out 4.31G + C-engine-cache 14.43G（webpack/remotion 构建缓存） |

df 记账（`/`）：`470G used → 419G`（P2 视频）→ `401G`（P2 引擎）。20:35 再读为 `409G`，
差额来自后台服务写入，与本项目无关（实测 video_project 1.2G、引擎 1.4G 未变）。

保留（有据不删）：

- `assets/audio/clips/*.mp3`（21480 个，367MiB）：保留以免重跑一次全量 TTS 才能重建 narration；
  **偏差登记**——计划 §5 原定 A1 删除，实际改为保留（收益/成本不划算）。
- 4 个未发布 singles（`gears`/`hawk`/`lecture`/`mult`，含 hawk 的 `delivery/Hawk.mp4`）：
  无 `manifest` 也无 `bili.bv`，属"唯一副本"，不满足三条清理判据 → 原样保留。
- `.git`（413M，含早期 11 个 narration.wav 的历史）：不改写历史（风险 > 收益），仅在 CONVENTIONS 记明。
- 引擎 `node_modules`（1.2G）：验证需要，保留。

## 3 门禁原始输出

### G1 干净树源检（worktree @ c32546e）

```text
  ! singles/mult/film.json: derived outputs are declared but no derive command is given (method not in repo)
check[source]: 90 film(s), 2 series, 0 error(s), 1 warning(s)
G1_EXIT=0
```

（改前同一干净树是 `73 error(s)`，全部为 `narration is missing: assets/audio/narration.wav`，即 D5。）

### G2 状态投影一致

```text
status: OK — STATUS.md 与生成结果逐字节一致（90 film(s)）
G2_EXIT=0
```

### G3 发布事实交叉校验

```text
release state: OK — ledger 74/74 已发布，film.json 全部 published 且 bvid 对齐，manifest 成品度量齐全
  film.status 分布: published=74
G3_EXIT=0
```

### G4 抽样 derive 可复建（5 集，均在干净树内跑）

```text
G4.1 series/loongarch/episodes/01-godson1-2003  python3 build/queue_sim.py        EXIT=0
G4.2 series/loongarch/episodes/02-godson2-2005  python3 build/rename_sim.py       EXIT=0
G4.3 series/tsint/episodes/14-nonstationary-attention  generate_attn_data.py      EXIT=0
G4.4 singles/hawk       python3 build/generate_hawk_data.py                       EXIT=0  (37/37 断言)
G4.5 singles/quickselect python3 build/generate_quickselect_data.py               EXIT=0  (880 行校验)
```

跑完 5 集 derive 后 `git status --porcelain` 仍为 **0 行** → 派生物确实全部被 `.gitignore` 覆盖。

### G6 引擎侧契约（content 指向干净树）

```text
films: synced 90 film(s), 2 series from /tmp/vp-clean2
films: ok — 90 film(s), 2 series; registry current; content clean
```

### G7 引擎清洁度

```text
out/ absent
0                     # git status --porcelain 行数
```

### G8 远端一致性

```text
OK  /root/video_project                master c32546ea4e4b3645ede407772dcdbf53b48496f4
OK  /root/video-pipeline-blueprint     main   995440ee07e2956a852e2fae15f3a4f9237474fa
OK  /root/gen24-admin                  master 4326f98290b9ab93e4b1f89f6d517601b98d3c42

e901baa0...  STATUS.md            (本地)  == e901baa0...  (远端 raw, http=200, 12608B)
3395828c...  tools/archive.mjs    (本地)  == 3395828c...  (远端 raw, http=200,  8039B)
```

## 4 偏差登记（不静默）

1. **远端整包克隆不可用**：`git clone git@github.com:...` 在 18MB 处停滞（代理下 SSH 大包拉不动），
   改用「同 commit SHA 的本地 worktree 跑门禁 + 远端 raw 文件 sha256 对拍」。
   依据：同一 commit SHA 的树/字节内容按定义一致；raw 对拍证明工作区文件确实已在远端。
2. **A1 clips 保留**（计划 §5 原定删）：见 §2，367MiB 换掉一次全量 TTS。
3. **新增 C-engine-cache**（计划 §5 未列）：`node_modules/.cache` 14.43G 是 webpack/remotion 构建缓存，
   与源码无关、下次渲染自动重建，故纳入清理；引擎 `node_modules` 本体未动。
4. **loongarch 系列无 `release/`**：该系列 2026-10 发布时还没有 manifest 机制，
   凭据回退到 `film.json.bili.bv`（7 集均有 BV），清理仍逐包记录。
5. **成品 mp4 已删**，本机不再能重算 `videoSha256`；成品身份由 `manifest.json` 的
   `videoSha256`+`videoBytes`+`durationSec` 与 B 站 BV 共同承担（见 CONVENTIONS「交付目录的保留策略」）。
6. **状态漂移残留**：`singles/convcode` 有 `bili.bv` 但 `status=ready`（历史遗留）；
   `arc/char/char2/quickselect` 为 `published`。未擅自改 convcode 状态（需人工确认后回填），已登记待后续处理。

## 5 复现命令

```bash
git worktree add --detach /tmp/vp-verify HEAD
cd /tmp/vp-verify && node tools/check.mjs                          # G1
node tools/status.mjs --check                                      # G2
python3 series/tsint/release/verify_release_state.py               # G3
node tools/archive.mjs                                             # 清理 dry-run（应看到 0 candidate 或仅剩未发布包）
cd /root/video-pipeline-blueprint && VIDEO_PROJECT=/tmp/vp-verify node scripts/films.mjs sync
VIDEO_PROJECT=/tmp/vp-verify node scripts/films.mjs check --strict   # G6
```

## 6 本回执的边界

- 未重新渲染任何一集，未重新上传任何一集；B 站侧 74 条视频状态未在本回执内复核（见 `release/ledger.json` 与 `docs/RELEASE-REPORT.md`）。
- 未改写 git 历史；`.git` 仍含早期大文件历史（413M）。
- 未清理其它项目（`models`/`AirLLM-data`/`tex_project` 等），G5 授权范围外。
