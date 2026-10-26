# 龙芯系列制作日志

单一真源：本文件记录每集状态、阻塞、验收与交付证据。只有这里的状态可以对外说“完成”。

## 状态总表

| 集 | 包 | 时长 | 内容 | 配音 | 配乐 | 渲染 | 交付 | 投稿 |
|---|---|---|---|---|---|---|---|---|
| 01 | 01-godson1-2003 | 437.0s | ready | ready | ready | ready | ready | 待投稿 |
| 02 | 02-godson2-2005 | 552.6s | ready | ready | ready | ready | ready | 待投稿 |
| 03 | 03-godson2-system-2006 | 547.1s | ready | ready | ready | ready | ready | 待投稿 |
| 04 | 04-godson3-2009 | 480.9s | ready | ready | ready | ready | ready | 待投稿 |
| 05 | 05-loongisa-2015 | 498.1s | ready | ready | ready | ready | ready | 待投稿 |
| 06 | 06-loongarch-2023 | 437.0s | ready | ready | ready | ready | ready | 待投稿 |
| 07 | 07-overview | 210.1s | ready | ready | ready | 制作中 | — | — |

## 逐集记录

### 01 龙芯1号（2003）

- 内容提交：5cced1a，18 场景 / 76 行，claims 9 条。
- 配音：76 段，437.0s，0 超时。
- 渲染：make 全门禁通过；封面、srt、chapters、report 已生成。
- 交付提交：3f47531，film.status=ready。
- 人工审片：2/30/79/80/103/105/174/176/240/300/400/430s 抽帧；cache 图标签重叠已修复，TopBar 无裁切。

### 02 Godson-2（2005）

- 内容提交：7c1a5b7，18 场景 / 90 行，claims 16 条。
- 配音：90 段，552.6s，0 超时。
- 配乐：out/godson2/score.wav（566s，seed=23，bpm=86），单核约 22 分钟；已复制为系列床 /root/work/scores/series-566.wav。
- 渲染：make 全门禁通过，552.6s，-15 LUFS，TP -2 dBFS；抽帧 2/60/120/180/300/420/480/540s 审片通过。
- 交付：Godson2.mp4 + srt/chapters/cover/report 已生成，film.status=ready。

### 03 Godson-2 系统优化（2006）

- 内容提交：55bf3cd，18 场景 / 79 行，claims 15 条，A 级实验 build/page_sim.py。
- 配音：79 段，547.1s，0 超时。
- 配乐：复用系列床 series-566.wav（03 时长 547.1s，落在 566s 内）；自渲染 660s 版本已放弃。
- 渲染：make 全门禁通过，547.1s，-15 LUFS，TP -2 dBFS；抽帧 2/60/120/180/300/420/480/530s 审片通过。
- 交付：Godson2System.mp4 + srt/chapters/cover/report 已生成，film.status=ready。

### 04 Godson-3（2009）

- 内容提交：fe50df9，18 场景 / 71 行，claims 22 条，A 级实验 build/noc_sim.py。
- 配音：71 段，480.9s，0 超时。
- 配乐：复用系列床 series-566.wav（04 时长 480.9s，落在 566s 内）。
- 渲染：make 全门禁通过，480.9s，-15 LUFS，TP -2 dBFS；抽帧 2/60/120/180/240/300/360/460s 审片通过。
- 交付：Godson3.mp4 + srt/chapters/cover/report 已生成，film.status=ready。

### 05 LoongISA（2015）

- 内容提交：dda5c00（draft）、6802253（narration），18 场景 / 82 行，claims 25 条，A 级实验 build/flags_sim.py。
- 配音：82 段，498.1s，0 超时；narration.wav 46M。
- 配乐：复用系列床 series-566.wav（498.1s < 566s）。
- 渲染：make 全门禁通过，498.1s，-15 LUFS，TP -2 dBFS；修掉 thesis 统计卡换行后重渲，110s 复验通过；抽帧 2/60/120/180/240/300/360/420/480/495s 审片通过。
- 交付：LoongISA.mp4 + srt/chapters/cover/report 已生成，film.status=ready。

### 06 LoongArch（2023）

- 内容提交：409e01d（draft）、101c0e0（narration），18 场景 / 72 行，claims 22 条，A 级实验 build/isa_sim.py。
- 配音：72 段，437.0s，0 超时；narration.wav 41M。
- 配乐：复用系列床 series-566.wav（437.0s < 566s）。
- 渲染：make 全门禁通过，437.0s，-15 LUFS，TP -2 dBFS；抽帧 2/60/120/180/240/300/360/420s 审片通过；handoff 标签由 Overview 改为“总览”。
- 交付：LoongArch.mp4 + srt/chapters/cover/report 已生成，film.status=ready。

### 07 总览（2003–2023）

- 内容提交：4e913b9（draft）、a239e06（narration），12 场景 / 34 行，无 claims（总览集）。
- A 级实验：build/verify_claims.py 回查前六集 claims 台账，109/109 条引文命中各自 paper.txt；只验证引文存在，不验证解释。
- 配音：34 段，210.1s，0 超时。
- 配乐：复用系列床 series-566.wav（210.1s < 566s）。
- 视觉预检：修正 open 标题换行、timeline 标题复用别集文案、thesis 大字与统计卡相撞、lineage 文案重复；共享层 timeline 增加可选 title，lineage 高亮步长 150→90 帧。

## 系列级约定

- 为控制单核算力，02–07 复用同一张 566s 系列配乐床（make --score）；各集按 ≤566s 设计，若某集超长，先补长床再渲染。
- 每集渲染前必须 content 仓干净（make 的 contentRevision 检查），提交后再 render。
- 07 是总览集，不要求单篇论文与 claims；它的“证据”是前六集的 claims 回查。

## 阻塞与决定

- 配乐生成是单核纯 JS，约 2.3 秒 CPU/秒音频；566s 实测约 22 分钟。决定：系列从 02 起共用这一张 566s 长床，避免每集重复 20 分钟以上。
- 所有视频由 Lead 逐集串行渲染，不并行，避免 Remotion/ffmpeg 抢占内存与 CPU。
- 每集渲染前必须 content 仓干净（make 的 contentRevision 检查），提交后再 render。
