# HANDOFF — tsint 系列生产（2026-10-30）

> 本文件是跨会话交接单。当前进度、已验证数字、未完成项、下次入口都在这里。
> 用户 2026-10-30 指令：**只完成当前这一集（E67）；后续视频暂停；不发布 B 站。**
> E67 已完成并提交；本文件写完即进入暂停状态，下一次开工先读本文件与 `docs/tsint-production-plan-2026-10-30.md`。

## 1. 当前进度（截至 2026-10-30 13:59 +08:00）

- 已成片 9 / 74 集：E01、E65、E66、E67、E70–E74。
- 已实现 20 / 190 个算法模块、275 条断言：
  - ch09：11 模块 / 142 条（E70–E74）；
  - ch08：E65 3 / 37，E66 3 / 46，E67 3 / 50。
- 四仓当前 HEAD：
  - `video_project`（内容）：本文件所在提交（E67 最终提交）；
  - `ts-base`（算法/证据）：`b97c7db`；
  - `ts-admin`（数据导出）：`b071b6f`；
  - `video-pipeline-blueprint`（引擎）：`856d804`。
- E67 成片：`series/tsint/episodes/67-split-no-leakage/delivery/Tsint67SplitNoLeakage.mp4`。
  1364.93 s（22.75 min）/ 40948 帧 / 1920×1080 / 30 fps / 8 场；
  −15 LUFS，TP −2 dBFS；428 条字幕 cue，8 章，封面 frame 2200（73.33 s）。
- **未发布 B 站**。film 只到 `status: ready`，没有 `bili.bv`。

## 2. E67 交接：切数据的三条规矩

- pack：`series/tsint/episodes/67-split-no-leakage/`；标题「一百七十倍的假象」。
- 书页 p.199–204，节 8.4.3 / 8.6.1；计划 22 min，实做 22.75 min。
- 三个 Haskell 模块（ts-base）：
  - `TsBase.Algos.Ch08.TemporalSplit`：`chronologicalSplit`、`splitLeaks`、`leakCount`、`splitSizes`；
  - `TsBase.Algos.Ch08.FixedForecast`：`fixedOrigin`、`naiveModel`、`linearModel`、`trainStats`；
  - `TsBase.Algos.Ch08.RollingForecast`：`rollingOrigins`、`originIsClean`、`rollingReport`。
- 数据：ts-admin `inventory/scripts/export_ch08_split.py`；ts-base `data/episodes/67-split-no-leakage/`（2600 个交易日，2015-01-05..2025-09-10；20 只面板 49277 行）。
- 证据：ts-base `inventory/evidence/ch8-split.json`（50 tests：19/17/14，24 checks 全 PASS）。
- 屏幕数字（全部可复算）：
  - 划分 1820 / 260 / 520；训练终点 2022-06-28、验证 2022-06-29、测试 2023-07-24；
  - 时间切分泄漏 0，随机切分 2（order/train-val、order/val-test），未来点 519；
  - 查表探针 MSE 5.062234230353 → 0.029734124098，ratio 170.249986637171；
  - 固定预测 f=20：naive train 0.05851481981525 / test 0.0951015370496 / gap +0.03658671723435；linear 7.422038029699 / 0.673508705187 / −6.748529324512；
  - 滚动 70 轮：mean 0.680433157601、min 0.0075351491947、max 3.731959677546；
  - 面板：20 只、13 个训练终点、行数 473..1820、测试 514..520、日期违规 0。

## 3. 崩溃事件与待生效的修复（重要）

2026-10-30 10:09 宿主提交内存耗尽（Event 2004）：

- 证据：`vmmemWSL` 提交 56,124,280,832 B（52.3 GiB）；两个 pythonw 各约 4.4 GB；msedge 1.8 GB；Windows 提交限制 102,396,096,512 B，仅余 2,365,132,800 B。
- 已改 `/mnt/c/Users/ZYX/.wslconfig`：`memory=40GB`、`swap=24GB`，`[experimental]` 加 `autoMemoryReclaim=gradual`、`sparseVhd=true`；其余 mirrored / dnsTunneling / firewall / autoProxy / kernel 保留。
- **该配置只在 `wsl --shutdown` 后生效**；本会话不能执行（会杀死 DSH）。下次从 Windows 侧、确认没有长任务时执行 `wsl --shutdown`，再启动并核对 `vmmemWSL`。
- 立即保护已生效：`docker update --memory 12g --memory-swap 16g haskell-ts`。E67 测试曾触发 cgroup OOM（spec 被 12 GB 上限杀掉），没有再次拖垮宿主。
- 事后核对命令：Windows 任务管理器「提交大小」、`wsl -l -v`、容器内 `free -g`、`docker inspect haskell-ts --format '{{.HostConfig.Memory}}'`。

## 4. 复现/验收命令

```bash
# 算法与测试（容器）
docker start haskell-ts
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal build all && cabal test'

# 证据重生成（ts-base）
docker exec haskell-ts bash -lc 'export PATH=/opt/ghc/9.14.1/bin:$PATH; cd /work && cabal run evidence-ch08-split'

# 内容仓校验
cd /root/video_project && node tools/check.mjs && node tools/status.mjs

# 引擎校验与成片重建
cd /root/video-pipeline-blueprint
node scripts/films.mjs check --strict
node scripts/make.mjs --film=tsint-67-split-no-leakage --score=/root/video-pipeline-blueprint/out/e67-score-loop-48k.wav
```

- E67 的 score 是 E66 `delivery/score.wav`（822 s）两份、6 s 交叉淡化、atrim 1365 s，再重采样 48 kHz，落在 `out/e67-score-loop-48k.wav`。
- `render_music.mjs` 生成长配乐非常慢（1365 s 超过 14 min 未完成），长集优先复用既有 score。
- make 的 content check 要求内容仓 **已提交且 HEAD 与 registry 一致**；每次提交后先 `films.mjs sync` 再 make。
- `publish.coverFrame` 过去被 registry 丢掉，封面总是 180 帧；`856d804` 已修，E67 是首集全自动 2200 帧封面。

## 5. 下次入口（E68）

按 `ts-base/plans/series.json` 的 `production_order`，E67 之后是 **E68 fewshot-and-cost**：

- pack：`series/tsint/episodes/68-fewshot-and-cost/`（目前是 scaffold）；
- 标题「5% 的样本怎么选：Few-shot 采样器与它的成本账」；ch08；p.203–207；计划 16 min；依赖 E67；
- 2 个算法：`ch8-fewshot-sampler`（`TsBase.Algos.Ch08.FewShotSampler`）、`ch8-efficiency-bench`（`TsBase.Algos.Ch08.Efficiency`）；
- 验收必须出现：8 种采样组合的 50 点位置图；同种子两次采样逐位一致；3 个规模模型参数量（337 为自检数字）。
- 建议顺序：读 spec → 写 2 模块 + 黄金值/边界测试 → ts-admin 导出（沿用 E67 模板）→ 证据 JSON → 8 场 pack → TTS → make → 文档/提交。

## 6. 未完成/注意

- WSL 配置重启后生效这件事**尚未执行**；下次开工先确认宿主内存与容器限额。
- E67 `delivery/report.json` 记录的内容提交是 `b651b13`，且 `content.dirty=1`（因为封面在 make 检查后才生成）；成片与交付件本身已通过全部 gate，报告属于生成时快照。最终内容提交以本文件所在 HEAD 为准。
- `delivery/Tsint67SplitNoLeakage.mp4` 按仓库约定被 gitignore，只在磁盘交付；srt/chapters/cover 入库。
- 后续视频已按用户指令暂停；除 E67 收尾外没有启动 E68。
