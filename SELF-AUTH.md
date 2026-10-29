# SELF-AUTH —— 自主决定清单（video_project / tsint）

用户 2026-10-29 夜全权委托（「我遇到的、有自己想法的，我全部授权给你了，你只需在 git 提交时单独增量提交一个自授权清单即可」）。按时间追加：决定 / 依据 / 可逆性 / 返工成本。

## A1 一次性建 74 集空包骨架，按叙事顺序固定编号（2026-10-29 夜）

- **决定**：用 `tools/scaffold-series.mjs` 从 ts-base `plans/series.json` 一次生成 `series/tsint/episodes/` 全部 74 个包（各含最小 film.json、stub 组件、docs/plan.md、data/delivery/assets 目录），并在 catalog 注册 `tsint`。
- **依据**：`tools/new-episode.mjs` 只允许追加 `episodes.length+1` 命名的目录，而生产顺序首集是第 70 集；若按生产顺序逐个 append，叙事顺序会被打乱且 film.series.order 需反复重排。一次建骨架可让「叙事顺序」与「生产顺序」彻底分离（`series.json.episodes` vs `productionOrder`）。
- **可逆性**：高（目录可删、catalog 一行；未产生任何内容资产）。
- **返工成本**：重跑生成器 1 分钟。

## A2 首集样片门取消，直接正式生产（2026-10-29 夜）

- **决定**：不再单独拍样片，按 `productionOrder` 从 `70-ode-solvers-from-scratch` 开始逐集生产；film `status` 最多 `ready`。
- **依据**：用户明确「也不用样片了，直接正式开工了」；流水线已有 loongarch 7 集与 16 个 singles 实证。
- **可逆性**：高（单集一个提交）。
- **返工成本**：单集 ≤1 天。
