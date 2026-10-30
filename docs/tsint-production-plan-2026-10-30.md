# tsint 74 集生产计划（2026-10-30 起）

> 状态：✅ 执行中（用户 2026-10-30 08:54 全权委托，见 `SELF-AUTH.md` A3/A4）
> 目标：74 集全部 `ready`（190 个 Haskell 算法 + 可复算视频），不发布 B 站。

## 0. 当前基线

- 已成片：E01（821.77 s）、E70–E74（ch09 五集）。
- 已实现算法：ch09 11 个模块 / 142 条断言；其余 179 个算法未实现。
- 下一批：ch08 五集（E65–E69，12 个指标/协议算法），然后 ch02 15 集。

## 1. 批次与顺序

| 批次 | 集 | 章 | 算法数 | 说明 |
|---|---|---|---|---|
| W1 | E65–E69 | ch08 数据/评估层 | 12 | 无训练，纯函数 + 数据协议；共享 score 与指标视觉语法 |
| W2 | E02–E16 | ch02 基础概念 | 46 | 缺失值/平滑/差分/归一化等，部分需小样本 |
| W3 | E17–E30 | ch03 预测 | 52 | 统计/ML/深度基线，训练规模压到 CPU <30 min |
| W4 | E31–E42 | ch04 异常检测 | 48 | 合成 + 真实标签混合 |
| W5 | E43–E50 | ch05 分类 | 32 | UEA 小样本 |
| W6 | E51–E57 | ch06 自动分析 | 28 | 特征/搜索 |
| W7 | E58–E65 | ch07 基础模型 | 32 | 只做轻量适配/推理演示 |

> 编号是叙事顺序的 pack 编号；生产顺序以 `ts-base/plans/series.json` 的 `production_order` 为准。W1 的 pack 目录是 65–69。

## 2. 单集流水线（固定 10 步）

1. 读 `plans/series.json` 的算法 spec、书页、验收句。
2. ts-base：实现模块 + 黄金值/性质/边界测试（`cabal test` 全绿）。
3. ts-admin：从既有 lake 导出该集小样本 CSV（≤5 MB，带 manifest），不新增采集。
4. ts-base：生成 `data/episodes/<ep>/summary.json` 与证据 JSON。
5. video pack：8 场 `src/scenes/*.tsx` + `script.ts`，只用已核对的数字。
6. `dump_script` → TTS（205 行级别，edge-tts zh-CN-YunyangNeural）→ 实测时长 → 回填 TOTAL/STARTS。
7. 复用 822 s score；`make` 全 gate（still/music/flicker/loudnorm）。
8. 封面帧按 film.publish.coverFrame 渲染；检查交付件 srt/chapters/cover。
9. 更新 `docs/plan.md`、`docs/production-log.md`、film.json；单集一个提交。
10. `npm run sync` + `films check --strict`。

## 3. 工程约束

- **不发布**：film 最多 `status: ready`，不写 `bili.bv`，不调用上传。
- **数字纪律**：屏幕上每个数必须能指到测试名/命令/证据 JSON；书里没有的实验标 C。
- **引用边界**：书页图只截所需区域，保留图注，标注《时序智能》· CC BY-NC-ND 4.0。
- **长任务**：score/render 用 `setsid nohup`，日志落 `/tmp`；不依赖会话存活。
- **复用**：ch08 五集共用 822 s score（runtime ≤13:30），musicGainDb 按混音 gate 微调。
- **提交**：每集独立提交；自主决定逐条追加到四仓 `SELF-AUTH.md`。

## 4. 验收

- `cabal test` 全绿、每集 `summary.json` 可复算。
- `films check --strict` 无错；成片 I=-15 LUFS、TP≤-2 dBFS。
- 每集 `docs/plan.md` 的 Verification 三条在画面中都能找到对应镜头。
