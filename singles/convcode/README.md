# 卷积码：GSM 如何在噪声里听清你

`convcode` — 单集，9 场，1920×1080 / 30 fps。契约见 `film.json`；工程约定见仓库根 `CONVENTIONS.md`；
拍摄与取舍见 `docs/plan.md`。

- 引擎入口：`src/Convcode.tsx`（挂载为引擎 `src/convcode/`）
- 合成名：`Convcode`
- 数据：`data/`（挂载为引擎 `data/convcode/`）
- 资源：`assets/public/`（挂载为引擎 `public/convcode/`）

## 片子在讲什么

GSM 全速率语音信道里的一段速率 1/2、K=5 卷积码：260 位一帧怎么分成 182 + 78，
50 位 class 1a 为什么加 3 个校验位，189 位怎么用四位记忆编成 378 位，
16 个状态的网格上维特比怎么挑一条最像的路，最后把一帧摊到 8 个突发里。
规格数字全部指向 3GPP TS 45.003 V18.0.0（`data/spec.txt`），出处见 `data/claims.json`。

## 数据

| 文件 | 内容 | 是否提交 |
|---|---|---|
| `data/spec.txt` | 3GPP TS 45.003 V18.0.0 的 pdftotext -layout 文本 | 是 |
| `data/eval.json` | 手写的规范数字，每条带原文引用 | 是 |
| `data/claims.json` | 上屏/上口数字的账本（quote 是 spec.txt 单行切片） | 是 |
| `data/source-figures.json` | 四张原文图的清单（出处、页码、许可、宽高） | 是 |
| `data/demo.json` | BER 曲线、1e-3 增益、翻位恢复率、交织示意 | 否（生成） |
| `data/voice.json` | 逐句实测旁白长度（script.ts 用它排时间轴） | 是 |
| `data/lines.json`、`data/clips.json` | dump 出的台词表与片段索引 | 否 |

## 素材许可

`assets/public/plates/` 下四张图是 3GPP TS 45.003 V18.0.0（© ETSI）的**局部摘录**，
按引用（quoted excerpt）使用：只截正文段落、附页码与标准号、不改动内容、仅用于技术解读。
片子本身与生成脚本原创；`build/generate_convcode_data.py` 无外部依赖（numpy 即可）。

## 重新生成

```bash
# 1) 仿真数据（固定 seed，两次运行逐字节一致）
python3 build/generate_convcode_data.py

# 2) 逐句旁白（IndexTTS-2；在引擎仓根目录跑，路径按引擎挂载）
python3 scripts/tts/synthesize_lines.py --lines data/convcode/lines.json \
  --out-dir public/voice/convcode --voice-json data/convcode/voice.json \
  --clips-json data/convcode/clips.json --indextts /opt/aigen/video2/pkg/index-tts \
  --model-dir /opt/aigen/video2/shared/models/IndexTTS-2 \
  --ref-audio /opt/aigen/video2/pkg/index-tts/examples/voice_03.wav --fp16

# 3) 旁白拼轨
python3 scripts/tts/build_narration_lines.py --lines data/convcode/lines.json \
  --clips-json data/convcode/clips.json --clips public/voice/convcode \
  --out public/voice/convcode_narration.wav

# 4) 成片
npm run make -- --film convcode --out out/convcode
```

`film.json.derive` 只登记第 1 步（静态检查要求 derived 文件在 .gitignore 里）；
旁白与成片是构建产物，不提交。
