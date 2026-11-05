# 《时序智能》B 站发布 SOP

面向人的操作规范：把 `series/tsint` 的 74 集按统一口径发到 B 站。机读清单与校验器在
[`series/tsint/release/`](../series/tsint/release/README.md)，本文件只讲**人怎么按流程走、按什么验收**。

- 系列：74 集，总时长 22.07 h，总体积 3.56 GB，单集 10–27 分钟。
- 工具：`/root/cdp-admin/bilibili-tool`（CDP，「bili」CLI）；它只落**草稿**，「立即投稿」永远由人点。
- 清单：`series/tsint/release/manifest.json`；台账：`series/tsint/release/ledger.json`。

## 0. 前置检查（缺一项就别开投）

```bash
cd /root/video_project/series/tsint
python3 release/verify_manifest.py                # 必须 exit 0（全绿）
grep -c '^| tsint-' /root/video_project/STATUS.md  # 必须 74
```

| 项 | 判据 | 不满足怎么办 |
| --- | --- | --- |
| 清单 | `verify_manifest.py` exit 0 | 修清单再发，别在网页上「手工补」 |
| 成片状态 | STATUS.md 74 行全 `ready`、BV 列全 `-` | 有 BV 说明已投过，先核对再动 |
| CDP | `node bin/bili.mjs doctor --json` 退出码 0 | `cdpctl ensure --name bili --url https://www.bilibili.com/ --port 9222` |
| 登录态 | `node bin/bili.mjs login --check --json` 退出码 0 | `login --open` 扫码；**用受管 profile，绝不指向真实用户 profile** |
| 合集权益 | 投稿页「加入合集」可选到目标合集 | **当前未开通（Lv2 门槛）**：按 §2 降级为无合集发布，升级后补挂；不要用标题硬凑「第 N 集」 |
| 暂存盘 | `/mnt/c` 空闲 ≥ 10 GB | 清 `/mnt/c/Users/Public/cdp-admin/media/tsint/` 里上一批的残留 |
| 时点 | 避开整点高峰与平台维护窗口 | 转码排队会更久，见 §5 |

## 1. 一次投稿的标准动作

以第 NN 集为例（`dir/composition` 从清单取）：

1. **stage**：把成片与封面拷到 `C:\Users\Public\cdp-admin\media\tsint\`（WSL 的 `/root` 路径 CDP 读不到）。
   拷完用 `sha256sum` 对照清单里的 `videoSha256`——**这一步防的是「发错版本」**。
2. **生成 spec**：按 [release/README.md](../series/tsint/release/README.md) 的映射生成 `/tmp/spec-NN.json`。
3. **dry-run**：`node bin/bili.mjs draft --spec /tmp/spec-NN.json --dry-run --json`
   判据：`fieldReport` 每步 `ok:true`；`form` 读回的标题/简介/分区/声明/标签/水印/可见范围与清单一致。
4. **落草稿**：同命令去掉 `--dry-run`、加 `--yes`。
5. **人眼复核**（必须，不复核不许提交）：
   - 封面是否 16:9 安全区（1920×1080 → 平台双预览里标题不被裁）；
   - 合集是否选对、集号是否连续；
   - 字幕是否随视频上传（本流程不自动传字幕，需要时在「更多设置 → 字幕」手工传 `.srt` 并**重选语言「中文」再点确认**）；
   - 创作声明 = 含AI生成内容；水印已关；可见范围 = 公开。
6. **提交**：点「立即投稿」→ 出现「稿件投递成功」→ 点「查看进度」→
   URL 形如 `…/archive-process?bvid=BV1xxxxxxxxx`，**BV 就在 URL 里**。
7. **记台账**：`ledger.json` 里 `episodes[dir] = {status:"published", bvid, publishedAt, videoSha256, attempts}`；
   同时在 STATUS.md 的 BV 列回填（由发布者或 Lead 统一改，投稿脚本不碰 STATUS.md）。
8. **清暂存**：删掉本集 `media/tsint/` 下的 mp4/png，别攒。

> 审核期直接打开 `bilibili.com/video/<BV>` 会显示「视频不见了」——这是正常的审核态，不是投稿失败。
> 判断成功只看三处：投递成功页、进度页 URL 有 BV、稿件管理页该条状态为「审核中/转码完成」。

## 2. 合集（当前不可用，降级为「先发布、后补合集」）

- **2026-11-05 实测：本账号合集功能未开通**（权益中心 Lv2 门槛），投稿页没有「加入合集」控件；`bili submit/batch --collection` 会 fail-closed 报 `COLLECTION_UNAVAILABLE`，不会静默跳过。
- 因此本批发布**不带合集**：`bili batch` 默认不传 collection（合集必须显式 `--collection` 开启）。
- 合集名保留为 `《时序智能》Haskell 算法实现`（清单 `collection.title`），作为**升级后补挂**的目标。
- 账号达到 Lv2 后：先建合集，再按 §2 的「稿件管理 → 编辑 → 加入合集 → 保存」逐集补挂（会重新走审核），顺序按 `order`。
- 合集页 74 集且顺序正确，验收项顺延为「升级后补挂完成」，不阻塞本批 74/74 发布。

## 3. 分区

- 目标「科技数码 / 计算机技术」；**平台 2026-10 实测投稿页是单级分区**（点一级后面板直接关闭，
  `docs/selectors.json` 里没有二级选择器）。所以实际落库为一级「**科技数码**」，属平台限制，不是填错。
- 想精确到二级只能在有 CDP 的浏览器里试，或投稿后编辑——会重新走审核，通常不值得。
- 报告/记录里如实写「二级未选到及原因」，别假装选上了。

## 4. 创作声明 / 水印 / 可见范围 / 版权

| 项 | 值 | 位置 | 坑 |
| --- | --- | --- | --- |
| 创作声明 | **含AI生成内容** | 主表单（不在「更多设置」里） | 2026-10 起是必填项；7 个选项里选「含AI生成内容」 |
| 水印 | **关** | 更多设置 | 默认是**开**的，必须点掉并回看确认 |
| 可见范围 | 公开 | 更多设置 | 定时发布默认关，别误开 |
| 版权 | 自制 | 无独立下拉 | 「内容为转载」在创作声明里；自制就不选它，也不填转载源 |

AI 配音（Edge TTS）+ 程序化渲染（Remotion）必须声明，这既是平台合规要求，也是这个系列「可复算」可信度的一部分。
简介里已经写明「本片为自制：AI 配音 + 程序化渲染」，**发布时不要删这段，也不要删源码仓地址那一段**。

## 5. 限额与风控（本项目做法）

平台不给公开的每日投稿上限，风控按账号、体积、频率浮动。本项目按下面这套走，宁可慢不可停号：

- **每批 3–5 集**，批间 ≥ 30 分钟；单日先按 5 集试探，稳定后再加。
- 单集 33–63 MB、10–27 分钟，转码通常几分钟；**同一账号不要并发**（一次只跑一个 `bili draft`）。
- 每批前跑 `verify_manifest.py --quick`，每批后 `bili list --json` 核对草稿箱与台账。
- **红线**：出现验证码、`429`、稿件反复驳回、上传卡在 0% 超过 10 分钟 → 立刻停，当天不再投，
  记录现象到台账 `lastError`。不要换 IP、不要并发硬刷。
- 暂停期间已完成投稿的集不受影响；恢复后从台账第一个非 `published` 继续（§6 断点续跑）。

## 6. 失败处理

| 现象 | 原因 | 处置 |
| --- | --- | --- |
| `toWinPath: 无法把 /root/… 映射成 Windows 路径` | 视频没 stage 到 `/mnt/c` | 按 §1 第 1 步拷到 `C:\Users\Public\cdp-admin\media\tsint\` |
| `文件不存在或不可读` | stage 文件名与 spec 不一致 | spec 里用 `NN.mp4` / `NN-cover.png`，别用长 composition 名 |
| 退出码 2，`缺少必填项: title/partition/video` | spec 字段缺 | 从清单重新生成 spec，别手改 |
| 退出码 3 | 未登录 | `login --open` 扫码；受管 profile |
| 退出码 4 | CDP 不在线 | `cdpctl ensure --name bili …`；先 `cdpctl status` |
| 退出码 7 | 选择器找不到（页面改版） | `bili selectors --live` 复核，必要时 `bili recon` 重校准后再投 |
| 分区填不进 | 单级分区限制 | 一级「科技数码」，记录原因 |
| 标签加不上 | 平台预填 3 个 + 上限 10 | 工具会先清预填；若仍失败，手工删 chip 后重跑 |
| 上传卡 60–100% 数分钟 | 平台转码/校验 | 别重复点，等「上传完成」文本出现 |
| `--submit` 被拒（REFUSED） | 工具刻意不支持自动提交 | 人工点「立即投稿」，这是设计而非故障 |
| 提交后没弹成功页 | 有必填项红字未填 | 截图找红字项补齐 |
| 审核被驳回 | 文案/封面/声明问题 | 按驳回理由改文案或封面 → 编辑重投（BV 不变） |

**断点续跑**：驱动脚本只读 `ledger.json` —— 只有 `status=="published" 且 bvid 非空` 才跳过；
`draft` 的先用 `bili list --json` 核对是否还在草稿箱（在则复用，不在则重落）；`failed` 的按 order 升序重试，
`attempts` 累计，单集 ≥3 次失败就停下来人工查。

**回滚**：

- 草稿：`node bin/bili.mjs purge --title "<标题>"`（先不带 `--yes` 看目标，再加 `--yes`；只删本工具台账里的稿件）。
- 已投稿未过审：稿件管理 → 编辑（改文案/封面/合集）或删除（BV 作废，需重投）。
- 换片不换 BV：编辑 → 「更换视频」（BV 不变，重新转码 + 重新审核）。

## 7. 验收标准：74/74

全部满足才算这一轮发布完成：

1. `python3 release/verify_manifest.py` exit 0（清单 74 条全部合格）。
2. `ledger.json` 里 74 条 `status=="published"`，每条 `bvid` 匹配 `^BV1[0-9A-Za-z]{9}$`，且 `videoSha256` 与清单一致。
3. STATUS.md 的 BV 列 74 个都不是 `-`（与台账逐条对得上）。
4. 合集页显示 74 集、顺序与 `order` 一致。
5. 抽检 ≥ 5 集（含第 1、74 集与任意 3 集），逐项核对：标题含「时序智能 · 第NN集」、简介含源码仓
   `github.com/Xian-debu/ts-base` 与系列说明、标签 5–6 个、分区科技数码、声明含AI生成内容、水印关、
   封面为自带 1920×1080。
6. 审核通过的集在 `bilibili.com/video/<BV>` 可播，合集里能连着播（播放器自动下一集）。
7. 台账另有 `batch` 与 `publishedAt`，能回答「哪批、什么时候、哪版片子」。

## 8. 收尾

- 清理 `/mnt/c/Users/Public/cdp-admin/media/tsint/` 与 `/tmp/spec-*.json`。
- `cdpctl status` 确认没有残留 CDP 会话；一次性 profile 用 `cdpctl gc` 回收。
- 台账与清单一起提交（`series/tsint/release/`），STATUS.md 的 BV 列由 Lead 统一提交，投稿脚本不直接改。
