# Godson-3：多核、NoC 与 x86 翻译

`godson3` — 单集。契约见 `film.json`；工程约定见仓库根 `CONVENTIONS.md`。

- 引擎入口：`src/Godson3.tsx`（挂载为引擎 `src/godson3/`）
- 合成名：`Godson3`
- 数据：`data/`（挂载为引擎 `data/godson3/`）
- 资源：`assets/public/`（挂载为引擎 `public/godson3/`）

## 重新生成

```bash
cd <pack>
# 这里的命令必须与 film.json.derive 一致
```
