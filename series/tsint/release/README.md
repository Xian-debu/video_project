# tsint 发布清单（B 站批量投稿）

本目录是《时序智能》74 集的**可机读发布清单**：标题、简介、标签、分区、合集、文件路径、字节数、sha256、时长
全部落在这里。投稿时脚本读清单，不自己拼文案——清单是唯一事实源，改文案只改清单。

同构的先例：`/root/video_project/tools/bili_draft.mjs`（单集草稿 JSON，人的参考），
本目录是它的 74 集、可校验、带哈希的版本。

## 文件

| 文件 | 作用 |
| --- | --- |
| `manifest.json` | 清单本体：`series/generatedAt/collection/defaults/episodes[74]` |
| `verify_manifest.py` | 校验器。exit 0 = 全绿，exit 1 = 逐条列出不合格 |
| `ledger.json` | 空台账骨架 `{"series":"tsint","episodes":{}}`，**由投稿工具写，人不要手改** |
| `README.md` | 本文件（口径 + 流程 + 对接说明） |

面向人的操作 SOP 在 [docs/RELEASE-BILIBILI.md](../../../docs/RELEASE-BILIBILI.md)。

## 用法

```bash
cd /root/video_project/series/tsint
python3 release/verify_manifest.py           # 全量：结构 + 3.5 GB sha256 + PNG 尺寸 + ffprobe（约 5 s）
python3 release/verify_manifest.py --quick   # 只查结构与长度约束，不读大文件
```

全量通过时末尾打印 74 集统计（总时长、总体积、平均时长、标题/简介长度区间、标签数量）。

## 元数据口径（硬约束）

### 标题（≤80 字）

模板：`时序智能 · 第NN集｜<film.json 的 title 原文>`

- NN 两位补零；集号必须等于 `order`；分隔符是全角竖线 `｜`，不是 `|`。
- 实测 24–61 字，全 74 集 ≤ 80。
- 不堆书名号、不重复「时序智能」以外的系列名；film title 本身就是一句判断，不再改写。
- 例：`时序智能 · 第01集｜一条序列，五个问题：从任务定义到可复算的管线`
- **半角引号是平台侧的坑**：bilibili-tool 会把 `'`/`"` 自动换成全角并告警；清单里本来就避免半角引号。

### 简介（≤2000 字，8–12 行）

固定四段，段间空行（实测 282–331 字）：

```
<一句话：本集解决什么问题，≤60 字，与 plan.md 的 Thesis 一致>

本集分场（片内章节）：
· <章节 2>
· <章节 3>
· <章节 4>
· <章节 5>

源码与实验证据（Haskell）：https://github.com/Xian-debu/ts-base

系列：《时序智能》Haskell 算法实现，共 74 集。工程 https://github.com/Xian-debu/video_project
本片为自制：AI 配音（Edge TTS）+ 程序化渲染（Remotion），片中数字均可复现。
```

- **简介必须含源码仓 `github.com/Xian-debu/ts-base`**：这是用户直给的硬约束，单独成段、发布时不得删。
  校验器对每条 desc 断言该串与固定段 `源码与实验证据（Haskell）：` 同时存在，缺失即失败。
- 分场小节取自 `delivery/<prefix>.chapters.txt` 的第 2–5 章（跳过开场与收尾），与片内章节标题逐字一致。
- 一句话来自 `docs/plan.md` 的 `## Thesis`（部分集为 `## 一句话` / `## 这一集要讲清的一件事` / `## 核心判断`，
  再兜底取正文首段）；13 集自动截取不合格，已人工改写到 ≤60 字且与正文不矛盾。
- 不写夸张营销词（「震撼」「必看」），不写未在片中出现过的数字。

### 标签（3–10 个，每个 ≤20 字）

`["时间序列", "Haskell"]` + 本集 3 个人工精选关键词，共 5–6 个，最长 14 字。

- 不含 `#`，不含中文标点；允许 ASCII 连字符（`Holt-Winters`、`1-NN`、`GMM-VAE`）。
- 关键词从 film title 与 `plan.md` 的 Algorithms 段取，优先「算法名」「任务名」，不放大词（「人工智能」这类没人搜）。

### 分区

清单里保留两级 `科技数码/计算机技术`；**平台 2026-10 实测投稿页是单级分区**（点一级后面板直接关闭，
`docs/selectors.json` 里 `partitionOptionSub` 为空）。bilibili-tool 的 `parsePartition` 会把两级拆成
`{top:"科技数码", sub:"计算机技术"}`，选一级即可；**提交时按一级「科技数码」落库**。
若后续改用手工投票，二级选不到属已知限制，报告里如实写「二级未选到」。

### 声明 / 水印 / 可见范围 / 版权

| 字段 | 值 | 含义 |
| --- | --- | --- |
| `statement` | `ai` | 创作声明「含AI生成内容」（AI 配音 + 程序化渲染，必选） |
| `watermark` | `false` | 平台默认是开的，必须点掉 |
| `visibility` | `public` | 公开可见 |
| `copyright` | `self` | 自制。平台没有独立的「自制/转载」下拉，转载才走 `statement:"reprint"` |

### 合集

全 74 集统一合集名 `《时序智能》Haskell 算法实现`（`collection.title`，每集也冗余一份 `collection`）。
合集需要在视频页/投稿页「加入合集」里选，且账号需有对应权益；条目创建一次后逐集追加。

## 与 bilibili-tool 的对接

工具：`/root/cdp-admin/bilibili-tool`（Node ≥ 22，CDP 驱动，**只落草稿、不自动提交**）。

```bash
cd /root/cdp-admin/bilibili-tool
cdpctl ensure --name bili --url https://www.bilibili.com/ --port 9222
node bin/bili.mjs doctor --json            # CDP + 页面 + 登录态
node bin/bili.mjs draft --spec <spec.json> --dry-run --json   # 填表 + 读回，不保存
node bin/bili.mjs draft --spec <spec.json> --yes              # 落草稿
node bin/bili.mjs list --json                                  # 草稿箱 + 本工具台账
```

### 字段映射（manifest episode → spec）

| manifest | spec | 备注 |
| --- | --- | --- |
| `episode.title` | `title` | 原样，不再改写 |
| `episode.desc` | `desc` | 原样，保留空行 |
| `episode.tags` | `tags` | 原样（工具会去重、去 `#`） |
| `episode.partition` | `partition` | 传一级 `科技数码`；传两级也能解析，但二级平台不认 |
| `episode.video`（相对 series 根） | `video` | **必须是 Windows 绝对路径**，见下 |
| `episode.cover` | `cover` | 同上，png/jpeg |
| `defaults.statement` | `statement` | `ai` → 含AI生成内容 |
| `defaults.watermark` | `watermark` | `false` |
| `defaults.visibility` | `visibility` | `public` → 公开可见 |
| `defaults.copyright` | — | 工具无此字段，自制 = 不选「内容为转载」 |
| — | `draftOnly` | 恒为 `true`：本流程从不自动点「立即投稿」 |

### 路径硬约束（最容易踩的坑）

`DOM.setFileInputFiles` 只认 Windows 路径，`lib/cdp.mjs` 的 `toWinPath()` 只接受 `/mnt/<盘>/...` 或 `X:\...`，
**`/root` 下的文件无法映射**。投稿前先把成片与封面 stage 到 Windows 可见目录（一次一批，用完即删）：

```bash
S=/root/video_project/series/tsint
STAGE=/mnt/c/Users/Public/cdp-admin/media/tsint
N=01; D=01-intro-why-time-series; C=Tsint01IntroWhyTimeSeries      # 取自 manifest 的 order/dir/composition
mkdir -p "$STAGE"
cp "$S/episodes/$D/delivery/$C.mp4"     "$STAGE/$N.mp4"
cp "$S/episodes/$D/delivery/cover.png" "$STAGE/$N-cover.png"
```

spec 里写 `C:\\Users\\Public\\cdp-admin\\media\\tsint\\01.mp4` 与 `…\\01-cover.png`。
C: 现有约 33 GB 空闲，单集 33–63 MB，**不要一次性把 3.56 GB 全拷过去**。

### 从清单生成一份 spec

```bash
cd /root/video_project/series/tsint
python3 - <<'PY' > /tmp/spec-01.json
import json
m = json.load(open("release/manifest.json"))
e = next(x for x in m["episodes"] if x["order"] == 1)
d = m["defaults"]
stage = r"C:\Users\Public\cdp-admin\media\tsint"
print(json.dumps({
    "title": e["title"], "desc": e["desc"], "tags": e["tags"],
    "partition": "科技数码",
    "video": stage + r"\%02d.mp4" % e["order"],
    "cover": stage + r"\%02d-cover.png" % e["order"],
    "statement": d["statement"], "watermark": d["watermark"],
    "visibility": d["visibility"], "draftOnly": True,
}, ensure_ascii=False, indent=2))
PY
node /root/cdp-admin/bilibili-tool/bin/bili.mjs draft --spec /tmp/spec-01.json --dry-run --json
```

## 发布流程（dry-run → 单集试发 → 分批 → 断点续跑）

0. **前置**：`verify_manifest.py` 全绿；`STATUS.md` 74 行全 `ready`；BV 列全 `-`（没有重复投稿）。
1. **dry-run 单集**（第 1 集）：`draft --dry-run --json`，看 `fieldReport` 每步 `ok:true`、`form` 读回标题/简介/分区/声明/标签/水印全对。
   dry-run 也会真上传视频（只是不保存），所以它同时验证了路径与体积。
2. **单集试发**：`draft --yes` 落草稿 → 人工在网页复核封面（16:9 安全区）、合集、字幕 → 点「立即投稿」→
   从进度页 URL 取 BV（`…archive-process?bvid=BV…`）→ 写进 `ledger.json`。
3. **分批**：3–5 集/批，批间 ≥ 30 分钟（转码 + 审核 + 风控）。每批前重跑 `verify_manifest.py --quick`，
   批后核对草稿箱与台账一致（`bili list --json`）。
4. **断点续跑**：驱动脚本只信台账——`episodes[dir].status == "published" 且 bvid 非空`才跳过；
   其余（含 `draft`/`failed`/缺省）按 order 升序重试。已 `draft` 的先 `bili list` 核对是否还在草稿箱，
   在就复用，不在就重落。
5. **回滚**：
   - 草稿阶段：`node bin/bili.mjs purge --title "<标题>"`（不带 `--yes` 只报目标）→ 加 `--yes` 真删；只删本工具台账里的稿件。
   - 已投稿未过审：稿件管理 → 编辑（改文案）或删除（BV 作废，需重新投稿）。
   - 片子内容要换但不换 BV：编辑 → 「更换视频」（BV 不变，重新转码 + 重新审核）。

## 台账字段（`ledger.json`）

```json
{
  "series": "tsint",
  "episodes": {
    "01-intro-why-time-series": {
      "order": 1,
      "id": "tsint-01-intro-why-time-series",
      "title": "时序智能 · 第01集｜…",
      "status": "published",
      "bvid": "BV1xxxxxxxxx",
      "draftUrl": "https://member.bilibili.com/platform/upload-manager/archive-process?bvid=BV…",
      "publishedAt": "2026-11-06T10:00:00+08:00",
      "videoSha256": "…",
      "attempts": 1,
      "lastError": null,
      "batch": "2026-11-06-A"
    }
  }
}
```

状态机：缺省 `pending` → `draft`（已落草稿、待人工提交）→ `published`（有 BV）；失败记 `failed` + `lastError` + `attempts`。
`videoSha256` 是发出去那份的指纹，用来回答「这个 BV 对应哪版片子」（重渲染后对不上就要走「更换视频」）。
本文件由投稿工具写；骨架由人建（当前为空）。

## 校验器查什么

| 组 | 检查 |
| --- | --- |
| 顶层 | `series=="tsint"`；`generatedAt` ISO8601；`collection.title/desc` 非空且合集名等于约定值；`defaults` 五个字段齐全且取值合法 |
| 数量与序号 | 74 条；`order` 恰为 1..74 且唯一；`id` 唯一；`id == "tsint-" + dir`；dir 以两位集号开头 |
| 与 film.json 对齐 | `id`/`composition`/`series.dir` 与 film.json 一致；`title` 以 film.json 的 title 结尾 |
| 与 STATUS.md 对齐 | STATUS 有 74 行 tsint、每条 id 在表内、`status=="ready"`（否则 WARN）、已有 BV 则 WARN；`sec` 能解析成数字时才比时长（±2 s） |
| 文件 | video/cover/srt 都在 `episodes/<dir>/delivery/` 下且存在；video 不得指向 raw_video.mp4 / programme_unnorm.mp4 / mix.wav / score.wav |
| 视频指纹 | `videoBytes` 与磁盘字节数一致；`videoSha256` 实测一致；文件名 == `<composition>.mp4` |
| 封面 | PNG 签名 + IHDR 尺寸 == 1920x1080；`coverSha256` 实测一致 |
| 字幕 | srt 存在且 > 100 字节 |
| 时长 | `durationSec` 与 `report.json numbers.seconds` 差 ≤ 1 s（例外登记见下）；与 ffprobe 实测差 ≤ 1 s；`reportSec` 与 report.json 原文一致（±0.05 s） |
| 文案 | title ≤80、符合 `时序智能 · 第NN集｜…` 模板且集号 == order；desc ≤2000、≥2 行、含 `github.com/Xian-debu/ts-base` + 固定源码段 + 工程仓；tags 3–10、每个 ≤20 字、无重复、无禁用标点、含「时间序列」「Haskell」；partition/collection 非空 |

任一不合格 → 列出全部问题并 exit 1。`--quick` 只跳过 sha256、PNG 尺寸、ffprobe 三项重活。

## 已知例外（已核验，不是错误）

1. **第 06 集时长**：`report.json` 记 1374.73 s（渲染长度），成片 1369.90 s（按音轨 `-shortest` 截短，
   `numbers.mix.seconds` = 1369.87 s），差 4.83 s > 1 s。登记在 `verify_manifest.py` 的
   `KNOWN_REPORT_MISMATCH`；其余 73 集差值 ≤ 0.07 s。
2. **STATUS.md 的 sec 列全为 `-`**：74 行都没记秒数，所以「与 STATUS.md 差 ≤2 s」这条在校验里自动跳过
   （`parse_sec` 返回 None）。STATUS 以后补了秒数，这条会重新生效。
3. **第 25 集的 prefix 陷阱**：`film.json.prefix` 是 `tsint-25-rnn-recurrence-vs-segments`，但交付件实际叫
   `tsint-25.srt` / `tsint-25.chapters.txt`。清单按磁盘上的真实文件名写，别用 prefix 拼。

## 素材从哪来

| 产物 | 来源 | 清单字段 |
| --- | --- | --- |
| 成片 | `episodes/<dir>/delivery/<Composition>.mp4`（33–63 MB，不带 raw/未归一化中间产物） | `video`/`videoBytes`/`videoSha256`/`durationSec` |
| 封面 | `episodes/<dir>/delivery/cover.png`（1920x1080 PNG，0.06–0.28 MB） | `cover`/`coverSha256` |
| 字幕 | `episodes/<dir>/delivery/*.srt`（标准 SRT；B 站 CC 字幕需在上传后选语言「中文」再确认） | `srt` |
| 章节 | `episodes/<dir>/delivery/*.chapters.txt`（`HH:MM:SS  类型 · 标题`，各 8 章） | 只用于生成 desc 的「本集分场」；平台章节需手工填 |
| 时长 | `delivery/report.json` 的 `numbers.seconds`；成片以 ffprobe 实测为准 | `reportSec` / `durationSec` |

## 维护

集数变了（新增/重渲染）就整份重生成，别手改 manifest：

1. 重算该集 `videoBytes/videoSha256/durationSec` 与 desc 里受影响的文案；
2. `python3 release/verify_manifest.py` 直到全绿；
3. 若时长或哈希变了且该集已发布，台账里保留旧 `videoSha256` 做审计，新版本走「更换视频」。
