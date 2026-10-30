# 生产日志（production-log）

> 状态：🧭 规划期建立（2026-10-29）。每集生产完成后追加一段。
> 记录：日期、集号、卡点、返工、最终提交号。用于复盘"哪类集最费时间"。

## 模板

```
## E<NN> <slug> — <YYYY-MM-DD>
- ts-base: <commit>（算法 + 测试 + evidence）
- video_project: <commit>（pack + delivery）
- 用时: <算法 h / 素材 h / 渲染 h>
- 卡点: <一句话>
- 返工: <有/无 + 原因>
- 备注: <对接下游集的影响>
```

## 记录

## E70 ode-solvers-from-scratch — 2026-10-29
- ts-base: dbc3d85（analytic / Euler / RK4 + 34 断言 + 3 份 evidence）
- video_project: 6fa7265（pack 首版）→ 06ddedc（关键帧修复）→ 3416d4f（图例避让）→ 44b6dc1（score −2.5 dB）；交付 srt/chapters/cover 随后提交
- 引擎: 06b5c49（make 支持 film.audio.musicGainDb）
- 成片: 676.97 s（11.28 min），−15 LUFS，TP −2 dBFS，20309 帧，8 场
- 流水线: score 渲染 29 min（677 s 音频，已知慢点 K15）；画面分段渲染 3 min；全流程一次通过 QA（still lint / music gate / loudnorm / flicker）
- 卡点: ① staticFile 必须用 film.id 而非 prefix；② still lint 抓到图例压轴标签；③ 混音 bed 仅比人声低 4.7 dB，gate 要求 ≤ −5 dB → 新增 film.audio.musicGainDb = −2.5
- 返工: 3 次（关键帧排版、still lint、mix gate），均无内容重写
- 偏差: 计划 22 min，实做 11.28 min；首集先打通全链路，后续集按主题密度决定是否加长
- 备注: 首集即模板；下一集 ch9-nd-solver（第 71 集）

## E01 intro-why-time-series — 2026-10-30
- ts-base: f6dfce8（ep74 证据清理后基线；本集 0 算法，复用 ch09 的 142 条断言快照）
- video_project: 550eda8（pack/script/narration timing）→ 5764fd5（bed gain −4.5 dB + coverFrame 2300）→ 本次 delivery 提交
- 引擎: f140af4（film 自定义封面帧）
- 成片: 821.77 s（13.70 min），−15 LUFS，TP −2 dBFS，24653 帧，8 场；205 条旁白，686.1 s 语音
- 流水线: score 渲染 38 min（822 s 音频）；画面分段渲染 4 min；stills→mix→loudnorm→flicker→publish 全过
- 卡点: ① 首次 mix gate 失败（bed 仅比语音低 4.8 dB）→ `audio.musicGainDb=-4.5`；② make 默认封面 180 帧，改为 film.publish.coverFrame=2300 后单独重出
- 返工: 2 次（open 卡片高度、definitions 卡片高度/文案；均由 still 复核发现）
- 偏差: 计划 14 min，实做 13.70 min；导论集无算法，保留 0 个算法单元的诚实计数
- 备注: 首个非 ch09 集；下一集按 production_order 为 E65 error-metrics-trio（ch08）