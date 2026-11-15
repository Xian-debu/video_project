# DeltaSight：让摄像头只算它该算的

## 一页事实

- 论文：Qinyu Wang, Cen Chen, Jingkai Huang, Yawen Qiu, Hongen Shao, Xiaofeng Zou, Ziqian Zeng,
  *DeltaSight: Architecting Efficient Video AIoT Systems via Cross-Stage Consistent Redundancy Elimination*,
  DAC '26（Long Beach, CA），DOI [10.1145/3770743.3804070](https://doi.org/10.1145/3770743.3804070)，CC BY 4.0。
- 一句话结论：把「哪里冗余」的判据从像素级搬到 patch 级、并让采样/传输/计算共用同一套判据，
  传感省 2.4×、传输省 3.2×、端到端省 1.7×；跳过 64.8%（ImageNet VID）与 72.2%（NFS）的块，
  mAP 在 ID 上持平到略涨（+1.31），在 NFS 上小幅下滑（−0.34）。
- 观众带走：能耗的大头不在算，而在「采」和「传」；而采和传各自按自己的粒度判冗余，
  所以二者都无法真正消掉对方的冗余——粒度对齐比优化单级更划算。
- 规模：14 场 / 682.63 s / 20478.9 帧（1920×1080@30），142 句旁白，43 条 claims，8 张原文图版。
- 确定性：script.ts 是唯一时间真源，voice.json 是实测秒数；画面无随机、无 Date.now、无网络。

## 章节

| # | 场次 | 起点 (s) | 时长 (s) | 一个事实 |
|---|---|---|---|---|
| 1 | open | 0.00 | 38.39 | 一台路口摄像头 24 小时不关机：它「看」的每一帧都要采、要传、要算 |
| 2 | problem | 38.39 | 47.16 | 传感 + 传输占系统能耗 37%–53%，而传感里 ADC 是大头；三段被同一套假设绑住 |
| 3 | mismatch | 85.55 | 47.15 | 证据一：扔 60% 以上数据与计算，精度几乎不变；证据二：噪声加在前景掉 mAP、加在背景几乎不变 |
| 4 | criterion | 132.70 | 46.44 | 传感器逐像素判冗余，模型按 16×16 patch 取数据——粒度错配 |
| 5 | algo | 179.14 | 52.52 | 三步可执行判据：曼哈顿帧差 → 逐 patch 计数超阈值 → 记为相似/不相似 |
| 6 | route | 231.66 | 49.95 | 不相似的 patch 还分三种：出现、移动（高精度）、消失/遮挡（低精度），用 IoU 与 r_in 判 |
| 7 | adc | 281.61 | 64.57 | 复用 CDAC 记住上一帧：0.751 V vs 0.75 V，差 −1 mV，Cτ 注入 ±5 mV 两次比较判相似 |
| 8 | block | 346.18 | 43.49 | 读出域 16× 32（两个相邻块）、16 列并行 ADC、blk_sel 2:1 MUX 与 col_en 列门控 |
| 9 | pipeline | 389.67 | 57.83 | 四阶段位宽：相似→0 bit、高位 4 bit、语义先验、语义精化补 4 bit；79.4%/86.8% 像素不转换 |
| 10 | system | 447.50 | 46.19 | 只把变了的块拼成一帧（多 ROI 合并帧，帧头带块号），主机按块号替换重建 |
| 11 | accuracy | 493.69 | 59.76 | Table 1：ImageNet VID 平均 68.67→69.98（+1.31），NFS 72.71→73.05（+0.34），B/L 两档掉点 |
| 12 | energy | 553.45 | 48.43 | Fig.8/Fig.9：传感 2.4×、传输 3.2×、端到端 1.7×；相似识别自身占传感能耗的 25.98%/30.97% |
| 13 | limits | 601.88 | 47.61 | 面积是版图估算（6.81 mm² 阵列 / 7.4 mm² die）、片内 SRAM 0.9 MB、语义先验依赖主机上一帧 |
| 14 | outro | 649.49 | 33.14 | 命题：判据先于数据发生——把判据搬到产生数据的地方，并让三级用同一套粒度 |

## 证据与实验

- **数字台账** `data/eval.json`：手写，每个数字带来源（`meta.note` 写明「derived 只做算术」）；
  派生量（`vidAvgDelta` 1.31、`nfsAvgDelta` 0.34、`nfsB` −0.50、`nfsL` −0.88、
  `transmittedPct` 35.2/27.8）单独放在 `derived`，不与原文数值混放。
- **claims** `data/claims.json`：43 行，覆盖 14 场。生成器 `build/make_claims.py` 用 hint 在
  `paper.txt` 里唯一定位整句，再校验 `value` 在该句（或退化到整段）里出现、且出现在某个台账中；
  `DERIVED` / `SENTENCE-SUPPORT` 两类行豁免「值在引文里」，但仍必须在台账中出现。
  门禁 `claims_check.mjs --film=deltasight` 只证三件机械事实（引文在 paper.txt、值在台账、场次存在），
  证不了语义——语义靠读论文和目检画面。
- **合成示意** `data/sim.json` / `data/adc.json`：由 `build/generate_deltasight_data.py` 生成，
  固定 `SEED = 20261115`，两次运行逐字节一致；16 条内置断言覆盖 ADC 算例
  （`V_IN 0.751` → `V_DAC 0.75` → 残差 `−1 mV` → `+τ` 分支 `+4 mV`/比较器 1 → `−τ` 分支 `−6 mV`/比较器 0）
  与 SAR 逐位判决。两个文件都带 `meta.synthetic = true`，画面上有「合成示意」角标；
  κ 用计数阈值（64 像素）而不是比例，与 Table 1 的口径一致，数值在 `meta` 里注明是合成值。
- **图版** `data/source-figures.json`：8 张，逐张记 doc/page/figure/license/attribution 与实测宽高；
  渲染统一走引擎的 `SourcePlate`（原文徽标 + 出处条），不自己重绘原文图。

## 素材来源与许可

- `assets/public/plates/` 8 张，全部由 `build/deltasight_paper.py` 从论文 PDF 以 300 dpi、
  `annots=False` 裁切生成（p1 Fig.1、p2 Fig.2、p3 Fig.3、p3 Fig.5、p4 Fig.6、p5 Fig.7、
  p6 Table 1、p6 Fig.9），论文本身 CC BY 4.0，出处条写明作者/会议/页码/许可。
- 裁切后四周补白边（上 4%、下 5.5% 宽度比例），让徽标与出处条落在白边而不是图内文字上；
  这一步只加白、不改内容，`--fail-on-annots` 同时校验裁切区不与批注相交。
- 生成器同时把裁切区记进 `RECTS` 并写回实测宽高，任何一张图版换页/改框都会在 check 里报出来。

## 复现

```bash
cd /root/video_project && node tools/check.mjs          # 内容仓门禁（91 films, 0 error）
cd /root/video-pipeline-blueprint
node scripts/films.mjs sync --content /root/video_project
node scripts/qa/dump_script.mjs src/deltasight/script.ts <pack>/data/lines.json
# 旁白：gen24 上的 IndexTTS-2 合成 142 句切片 → data/voice.json + data/clips.json
cd <pack> && python3 build/tts_narration.py            # 铺时间轴 → assets/audio/narration.wav
cd /root/video-pipeline-blueprint && node scripts/make.mjs --film deltasight
```

## 执行记录

- 2026-11-15：建包、8 张图版、eval/claims 台账、14 场脚本与画面落地；
  旁白在 gen24 发行版上用 IndexTTS-2 合成（142 句，实测语音 512.64 s，RTF≈1.0–1.8），
  回写 `voice.json` 后时间轴从估算 769.25 s 收敛到实测 682.63 s。
- 计划里的「5 张图版」在执行期扩到 8 张（补 Fig.5 与 Fig.9/Table 1 的对应关系），
  见 `docs/59-deltasight-film.md` 的执行期修订附录与本文件 §素材来源。
