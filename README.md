# video_project — 视频内容仓

这里是**内容**的唯一真源。引擎（Remotion 组件、设计系统、渲染/混音/发布管线）在
`video-pipeline-blueprint`；本仓只放“这部片子是什么”。

一只片子 = 一个目录；一个系列 = 一个目录 + 若干集目录。引擎不认得任何片名：它读
`catalog.json`，把每个 pack 的 `src/`、`data/`、`assets/public/` 复制挂载进引擎对应
位置，再生成 `src/films.generated.tsx`。**本仓是源，引擎里的挂载点是副本，永远不要手改。**

## 目录

```
catalog.json                 # 唯一的清单：哪些单集、哪些系列（引擎只认这个文件）
singles/<id>/                # 单集，一部一个目录
  film.json                  # 合同：composition / entry / exports / 时长 / 产物 / 论文 / 投稿信息
  src/                       # Remotion 组件与 script.ts（挂到引擎 src/<id>/）
  data/                      # 输入数据与生成的派生物（挂到引擎 data/<id>/）
  assets/public/             # staticFile 根（挂到引擎 public/<id>/）
  assets/audio/              # narration.wav 入库；clips/ 是 TTS 中间产物，忽略
  build/                     # 数据生成、TTS、Blender 等脚本（cwd=pack 运行）
  docs/                      # 这部片子的制作笔记（plan.md 等）
  delivery/                  # 交付产物：mp4 / srt / chapters / cover / report（mp4 忽略）
  baseline/                  # 迁移或改版前的验收底片（可选）
series/<sid>/                # 一个系列
  series.json                # 脉络：标题、描述、集目录顺序、共享区
  plan.md                    # 系列级规划（制作顺序、每集控制信息）
  docs/                      # 系列级资料（时间线、参考文献、事实核查）
  shared/{src,data,public}/  # 全系列共享的组件/数据/资产（挂到引擎 src|data|public/series/<sid>/）
  episodes/<NN-slug>/        # 一集一个目录，结构同 singles
tools/                       # 本仓自己的校验与脚手架（Node 标准库，无依赖）
schema/                      # film.json / series.json / catalog.json 的 JSON Schema
```

## 快速开始

```bash
# 1) 校验整个仓（结构、合同、路径、派生物是否误入库、staticFile 命名空间）
node tools/check.mjs

# 2) 看状态
node tools/status.mjs

# 3) 新单集 / 新系列
node tools/new-pack.mjs my-film --title "标题" --composition MyFilm
node tools/new-series.mjs my-series --title "系列名"
node tools/new-episode.mjs my-series 01-first --title "第一集" --composition Series01
```

## 与引擎的配合

```bash
# 引擎仓根目录；VIDEO_PROJECT 不设时按 .video-project.json / 同级 ../video_project 查找
node scripts/films.mjs sync          # 复制挂载 + 生成 src/films.generated.tsx + .films/index.json
node scripts/films.mjs check         # 挂载是否与内容一致、合同是否自洽
npm run make -- --composition Arc    # 具体参数见引擎 docs
```

挂载点（引擎侧，全部由 `films.mjs` 管理、由引擎 `.gitignore` 忽略）：

| 内容仓 | 引擎 |
| --- | --- |
| `singles/<id>/src/` | `src/<id>/` |
| `singles/<id>/data/` | `data/<id>/` |
| `singles/<id>/assets/public/` | `public/<id>/` |
| `series/<sid>/shared/src/` | `src/series/<sid>/` |
| `series/<sid>/shared/data/` | `data/series/<sid>/` |
| `series/<sid>/shared/public/` | `public/series/<sid>/` |

## 规则（短版）

1. **一物一处**：屏幕上的每个数字都能追到 `data/` 里的一个文件；注释、文档不重复存数。
2. **派生物不入库**：`film.json.derived` 列出的路径必须被 `.gitignore` 忽略；`check.mjs` 会查
   `git ls-files`。`build/` 里的脚本必须能从已入库输入重建它们。
3. **命名空间**：`staticFile()` 的第一个参数必须以本片 id（或本系列 `series/<sid>/`）开头；
   片子之间不许互相 import 组件或数据。
4. **不手改引擎挂载点**：改内容仓，然后 `films.mjs sync`。
5. **一阶段一提交**，消息用 `<对象>/<阶段>: 做了什么`，提交前 `node tools/check.mjs` 与
   `git status`。
6. **发布可追溯**：`film.json.bili.bv` 记录已发布视频；`delivery/` 保留交付件（mp4 不入库）。

详细规则见 [CONVENTIONS.md](CONVENTIONS.md)；引擎侧验收见 `gen24-admin/docs/52`。
