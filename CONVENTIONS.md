# CONVENTIONS

本仓的规则不是风格偏好，是**可验证的约束**。`tools/check.mjs` 能查的，CI/提交前必须过；
查不了的（画面质量、事实准确性）由 `docs/52` 的验收关和人工 review 负责。

## 0. 两个仓的边界

| | video_project（本仓） | video-pipeline-blueprint（引擎） |
| --- | --- | --- |
| 回答 | 这部片讲什么、数据从哪来、长什么样 | 怎么渲染、怎么混音、怎么出交付件 |
| 所有 | 组件、讲稿、输入数据、生成脚本、资产、制作文档、交付件 | 设计系统、storyboard、通用 QA、音频链、发布工具 |
| 不知道 | 引擎内部实现 | **任何片名**（只读 catalog/manifest） |
| 变更节奏 | 每部片子独立 | 改一次影响全部片子，必须更谨慎 |

引擎通过复制挂载消费本仓。挂载点是**只读副本**：手改会在下一次 `sync` 被覆盖，且
`films.mjs check` 会报 manifest 不一致。

## 1. 一个 pack 的合同

`film.json` 是 pack 的唯一入口，字段含义见 `schema/film.schema.json`。硬规则：

- `id`：小写字母开头，只含 `a-z0-9-`；全仓唯一。系列集也用独立 id（如 `loongarch-01`），
  不要用目录序号当 id。
- `composition`：PascalCase，全局唯一；Root 注册用的就是它，改名等于换片。
- `entry`：pack 相对路径，必须在 `src/` 下，且导出 `exports.component/total/fps` 三个名字。
- `width/height/fps` 与组件里的 `useVideoConfig()` 必须一致；默认 1920×1080@30。
- `paths` 固定为 `{"src":"src","data":"data","public":"assets/public"}`；不要自创第四种。
  pack 的 `data/` 挂载到引擎 `data/<id>/`，所以组件里仍写 `../../data/<id>/...`。
- `derived`：可再生成的路径（pack 相对，如 `data/sim.json`），必须被 gitignore；提交前 `git ls-files` 必须为空。
- `narration`：入股的 `assets/audio/narration.wav`，或 `null`（静音片）。TTS 中间件在
  `assets/audio/clips/`，永不入库。
- `delivery`：交付目录。`*.mp4` 不入库，`*.srt / *.chapters.txt / *.ffmeta.txt / cover.png /
  report.json` 入库（体积小、可审计）。
- `status`：`draft → ready → published`（`retired` 为下架）。`published` 必须有 `bili.bv`。

## 2. 路径与命名空间

片子在引擎里的相对深度是固定的：`src/<id>/Foo.tsx` 到 `data/<id>/` 是 `../../data/<id>/`，
到设计系统是 `../../design/...`。因此：

- 组件内的相对 import 深度**不要改**；迁移时保持 `src/<id>/` 这一层。
- `staticFile("...")` 的字符串必须以 `<id>/` 开头（资产在 `public/<id>/`）。
- 系列共享资产用 `staticFile("series/<sid>/...")`，共享代码用 `../series/<sid>/...`。
- **禁止**跨片引用：`../<other-id>/`、`../../data/<other-id>/`、`staticFile("<other-id>/...")`。
  需要共用就提升到系列的 `shared/`（同系列）或引擎的 `design/storyboard/showcase`（通用）。
- pack 的 `data/` 里的文件只属于本片（挂到引擎 `data/<id>/`）。引擎的 `film_isolation` 与 `check.mjs` 都会查。

## 3. 数据与派生物

- 手写输入（参数、论文摘录、claims 账本、voice 时长）入库；由脚本算出的中间量不入库。
- `build/` 脚本的工作目录是 pack 根：`ROOT = Path(__file__).resolve().parents[1]`，
  输出写 pack 的 `data/`（引擎里是 `data/<id>/`），不要写引擎的绝对路径。
- 每个派生脚本必须确定性（固定 seed、无网络、无时钟依赖；计时类允许 shape 稳定但要在
  meta 里声明）。`derived` 里的计时文件如果字节不稳定，必须在 `film.json.derivedNote` 说明。
- 数字只有一个家：组件从 `data/` import，讲稿（`script.ts`）也从同一文件取数；注释里可以
  解释，但不许写第二份会过期的数。

## 4. 系列

系列是**叙事单位**，不是文件夹美化：

- `series.json.episodes` 是有序的集目录名数组，顺序 = 系列的叙事/生产顺序；目录名用
  `NN-slug`，NN 从 01 连续。
- 每集 `film.json.series = {id, order}`，`order` 与数组下标一致（从 1 开始）。
- `plan.md` 至少写：一句话主张、目标观众、每集叙事任务、事实核查清单、制作顺序与依赖、
  共享资产清单、发布节奏。
- `shared/` 只放**两集以上真的会用**的东西。只给一集用的，放回那一集。
- 系列集 id 用 `<sid>-NN`，composition 用 `<SeriesPascal><NN>`；不要复用历史单集的 id。

## 5. Git

- 一阶段一提交。提交前：`node tools/check.mjs`、`git status --short`、确认没有 `delivery/*.mp4`。
- 消息：`<对象>/<阶段>: 做了什么`，例如
  `loongarch/plan: 六篇论文脉络与七集结构冻结`、
  `arc/pack: 迁入单集目录并修正 staticFile 命名空间`。
- 不动别人的 pack 不打招呼；跨 pack 重构单独提交，并在 body 写清影响面。
- Tag：迁移/改版前打 `pre-<change>`；验收通过打 `v<major>.<minor>.<patch>-<stage>`。
- 禁止 `git add -A` 盲提交；先看 `git status`。

## 6. 验收（每部片子）

出片前：

1. `node tools/check.mjs` 通过（合同、路径、命名空间、派生物）。
2. 引擎 `films.mjs sync && films.mjs check` 通过；`tsc --noEmit` 通过。
3. `data/` 的每个数能追到 `build/` 脚本或手写输入；claims 账本与论文原文一致。
4. 关键帧 still 人工看过（不是只看指标）；讲稿时长与画面节拍对齐。
5. 静音/有声、音乐、响度（I∈[-16.5,-13] LUFS，TP≤-1.5 dBTP）、flicker 闸门全过。

出片后：

6. `delivery/` 有 mp4、srt、chapters、cover、report.json；`film.json.bili.bv` 回填。
7. 本仓提交含 `film.json` 状态与交付件；引擎仓提交含管线变更（若有）。

## 7. 迁移期的特别约定

- 2026-10 的引擎/内容分仓迁移以 `gen24-admin/docs/52` 为准；本仓的 `baseline/` 保存
  迁移前哈希与比对结果。
- 迁移只允许**搬移 + 路径适配**，不允许顺手改内容/视觉；任何内容改动单独提交并写明原因。
- 迁移验收的像素对比以 `/root/work/split-baseline` 为基准；PSNR 阈值与抽样帧见 docs/52。
