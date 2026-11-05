# RELEASE — tsint 全链路总览（依赖 / 模型 / 环境 / 部署 / 改进）

这份文档回答一个问题：**这套东西由什么组成，换一台机器要多久才能跑起来。**
面向读者：想复现、想部署、或接手维护的人。更新日期 2026-11-05。

## 1. 四个仓，一条链

```
ts-admin（A 股数据仓库，Python）
    │  按集导出窄表 CSV + manifest.json（sha256）
    ▼
ts-base（算法库 + 证据程序，Haskell）
    │  evidence-* 子命令 → 证据 JSON（屏幕数字的唯一来源）
    ▼
video_project（内容源：讲稿 / dist.json / 组件 / 交付件）
    │  films sync 挂载
    ▼
video-pipeline-blueprint（引擎：Remotion 组件库 + 渲染/混音/QA 管线）
    │  make → mp4 / wav / srt / cover / chapters
    ▼
cdp-admin/bilibili-tool（发布：CDP 驱动 Edge，submit/batch/台账）
```

| 仓 | 角色 | 语言/栈 | 许可 |
| --- | --- | --- | --- |
| [ts-admin](https://github.com/Xian-debu/ts-admin) | 数据仓库与管理工程 | Python 3.11+ / DuckDB / Parquet | MIT |
| [ts-base](https://github.com/Xian-debu/ts-base) | 算法库 + 可复现证据 | Haskell（GHC 9.14.1） | BSD-3-Clause |
| [video_project](https://github.com/Xian-debu/video_project) | 内容源与发布清单 | TypeScript / JSON / CSV | BSD-3-Clause |
| [video-pipeline-blueprint](https://github.com/Xian-debu/video-pipeline-blueprint) | 渲染引擎与 QA 门 | TypeScript / Remotion / FFmpeg | 见仓内 LICENSE |

## 2. 工具链版本（作者实测）

| 组件 | 版本 | 用途 |
| --- | --- | --- |
| GHC / cabal | 9.14.1 / 3.16.1.0 | 算法库构建 |
| Node | 22.23.2 | 引擎、内容仓工具、bilibili-tool |
| Remotion | 4.0.536（React 19.3.1） | 程序化视频 |
| FFmpeg | 6.1.1 | 混音、转码、封装 |
| Python | 3.11+（venv） | ts-admin、TTS 与少量脚本 |
| DuckDB / pyarrow | ≥ 1.0 / ≥ 15 | 数据湖仓 |
| Edge TTS | `edge-tts`（zh-CN-YunyangNeural） | 中文旁白合成 |
| Edge / Chrome | Edg 156（CDP 9222） | 发布自动化 |

## 3. 模型与生成内容（如实声明）

- **旁白是 AI 语音合成**：Edge TTS，音色 `zh-CN-YunyangNeural`，逐行合成后按讲稿时间轴拼接；不是真人录音。
- **画面是代码生成**：Remotion（React）程序化绘制，图表数据来自证据 JSON；没有用文生图/文生视频模型。
- **音乐是程序化生成的配乐**（引擎仓 `render_music.mjs`），非采样素材。
- **讲稿与代码**：由作者与 AI 助手协作完成，所有数字必须由仓库命令跑出来（见 ts-base REPRODUCE.md）。
- 发布时按平台要求勾选 AI 生成内容声明（`statement: ai`），版权选项为自制（`copyright: self`）。

## 4. 环境与控制方法

- 宿主：WSL2（Ubuntu）+ Windows 侧 Edge 受管 profile；Docker 用于 Haskell 构建隔离。
- **构建隔离**：ts-base 只在 `haskell:9.14.1` 容器里验收（`/work` 挂载仓库、`/cabalhome` 挂载包缓存、`CABAL_DIR=/cabalhome`）。
- **内容与引擎分离**：`films.mjs sync` 把 pack 的 `src/ data/ public/` 复制进引擎的 gitignored 挂载点，引擎永不手改内容。
- **数字纪律**：屏幕数字只能来自 `data/dist.json`，而它由 `build/make_dist_data.py` 从证据 JSON 生成；证据 JSON 由 `tsbase evidence-*` 生成。
- **发布纪律**：清单 `series/tsint/release/manifest.json` 管「发什么」，台账 `ledger.json` 管「发到哪」，每次提交前 dry-run 读回 bvid。
- **浏览器纪律**：所有 CDP 走 `cdp-admin` 的受管 profile（`C:\Users\Public\cdp-admin\profiles\bili`），禁止指向真实用户 profile、禁止全局杀进程。

## 5. 部署难度（换机器自评）

| 目标 | 需要 | 难度 | 预计耗时 |
| --- | --- | --- | --- |
| 读讲稿 / 查数字 | 无 | ★☆☆☆☆ | 分钟级 |
| 构建 ts-base + 跑测试 | GHC 9.14.1（或 Docker 镜像） | ★☆☆☆☆ | 10 分钟 |
| 跑任意一集证据 | 同上 | ★☆☆☆☆ | 1 分钟 |
| 重建数据湖仓 | 数据源可访问 + ≥ 40 GB | ★★★★☆ | 数小时～一天 |
| 渲染一集 | Node 22 + Remotion + FFmpeg + 中文字体 | ★★★☆☆ | 10–30 分钟 |
| 渲染全 74 集 | 同上 + ≥ 100 GB + 稳定机器 | ★★★★☆ | 20–30 小时 |
| 自动发布到 B 站 | Windows + Edge + CDP 受管 profile + 登录态 | ★★★☆☆ | 半天（含风控观察） |

## 6. 已知问题（跨仓汇总）

1. **无 CI**：三个仓都没有 GitHub Actions；验证靠本地脚本与人工门（原因见 ts-base README 已知问题 1）。
2. **成片与大文件不入库**：mp4 / narration.wav 被忽略；重新生成需要 TTS 与渲染。
3. **数据源与历史窗口敏感**：ts-admin 的采集端点可能随上游变化；证据数字绑定切片 sha256。
4. **渲染耗时**：74 集全量重渲染是数十小时级，不适合频繁全量。
5. **发布依赖平台**：分区为单级（平台 2026-10 现状）、投稿按钮需人工/自动化兜底、限额与风控不可控。
6. **中文字体**：引擎仓字体文件较大，跨机器需确认字体许可与 fallback。

## 7. 改进方向

- [ ] 三个仓接 CI：ts-base 只跑「构建 + 子集断言」，ts-admin 跑单测 + schema 检查，video_project 跑 `tools/check.mjs`。
- [ ] ts-base 增加 `evidence all --jobs N`，把 73 个子命令并行化。
- [ ] 引擎把字体与中文字体子集化，降低克隆体积。
- [ ] 发布侧把「提交按钮」的自动化做成可审计的开关（默认关，人工确认后执行）。
- [ ] 内容仓把 74 集讲稿导出为可检索的文本索引，便于查重与校对。
