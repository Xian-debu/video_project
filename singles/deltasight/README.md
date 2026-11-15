# DeltaSight：让摄像头只算它该算的

`deltasight` — 单集，第六部论文精读片。论文：*DeltaSight: Architecting Efficient Video AIoT Systems via Cross-Stage Consistent Redundancy Elimination*（DAC'26，DOI 10.1145/3770743.3804070，CC BY 4.0）。

成片 1920×1080 / 30 fps / h264 + aac，14 场（开场 + 13 章），旁白 142 句。脚本 `src/script.ts` 是唯一真源：时间轴、字幕、章节表、旁白时长全部由它派生。

## 结构

| 路径 | 内容 |
|---|---|
| `src/script.ts` | 14 场 SPEC（id/chapter/kicker/title/goal/lines）+ 时间轴推导 + `PLATES` 短键表 |
| `src/shared.tsx` | 本片共用的版式件：Head / Card / Body / Line / Plate / Scene / PatchGrid / BitWeights / Bars |
| `src/Deltasight.tsx` | 组合壳：`SCENE_COMPONENTS` 映射 14 场 + 全片字幕 |
| `src/scenes/*.tsx` | 每场一个文件，14 个 |
| `data/eval.json` | 手写数字台账（论文数字 + 推导值，逐条注出处） |
| `data/claims.json` | 43 条「屏幕数字 → 原文引句 → 台账字段」对账行，由 `build/make_claims.py` 生成 |
| `data/paper.txt` | 论文全文（`build/deltasight_paper.py` 从 PDF 抽，claims 的 quote 必须能在此逐字查到） |
| `data/source-figures.json` | 8 张原文图版的七字段清单（含许可与实测宽高） |
| `data/voice.json` | 142 句实测旁白时长（TTS 产物，入库） |
| `data/sim.json` / `data/adc.json` | 派生（固定种子自测数据），由 `film.json.derive` 生成，不入 git |
| `assets/public/plates/*.png` | 8 张原文图版（300 dpi、annots=False、四周补白边） |
| `assets/audio/narration.wav` | 派生旁白（`build/tts_narration.py`），不入 git |

## 重新生成

所有命令都在 pack 根目录下运行。

```bash
# 1) 论文全文 + 8 张原文图版（一次做完，字节可复现）
python3 build/deltasight_paper.py --fail-on-annots

# 2) 派生自测数据（固定 seed，两次运行逐字节一致）
python3 build/generate_deltasight_data.py

# 3) 43 条 claims 对账行（从 paper.txt 唯一定位引句）
python3 build/make_claims.py --check

# 4) 旁白：dump_script → TTS（IndexTTS-2）→ narration.wav
node <engine>/scripts/qa/dump_script.mjs src/script.ts data/lines.json   # 引擎侧命令，需挂载后跑
# TTS 在 gen24 发行版里跑（见 docs/plan.md「执行记录」），产物写 data/voice.json
python3 build/tts_narration.py

# 5) 一命令一交付（引擎仓内）
node scripts/make.mjs --film deltasight
```

`data/lines.json`、`data/clips.json`、`assets/audio/clips/`、`delivery/*.mp4`、`delivery/*.wav` 都是派生/媒体，已在 `.gitignore`。

## 数字口径

- **论文数字**：一律来自 `data/paper.txt`，在 `data/claims.json` 里有 quote 可查；`claims_check.mjs` 机械证明「引句在原文、数值在台账、场次存在」三件事，不证明语义。
- **推导值**：`data/eval.json` 的 `derived` 段（VID 平均 mAP +1.31、NFS 平均 +0.34、传输占比 35.2%/27.8% 等），上屏时标注「推导值」。
- **自测值**：`data/sim.json`（patch 判据与三场景路由）与 `data/adc.json`（10-bit SAR 定点二分）由固定种子脚本产出，`meta.synthetic = true`，屏幕带「合成·自测」角标。二者与论文数字不混排。

## 图版许可

8 张图版均裁自论文 PDF（CC BY 4.0），出处逐张写入 `data/source-figures.json`（file/source/doc/page/figure/license/attribution），片内每张带「原文」徽标、页码与出处条。

## 状态

- `film.json.status`：`draft` → `ready`（make 全绿后）→ `published`（投稿回填 BV 后）。
- 详细计划与验收判据：`docs/plan.md`；跨仓执行报告见 `gen24-admin/docs/60-deltasight-film-report.md`。
