# LoongISA：把兼容做进系统

`loongisa` — 单集。契约见 `film.json`；工程约定见仓库根 `CONVENTIONS.md`。

- 引擎入口：`src/LoongISA.tsx`（挂载为引擎 `src/loongisa/`）
- 合成名：`LoongISA`
- 数据：`data/`（挂载为引擎 `data/loongisa/`）
- 资源：`assets/public/`（挂载为引擎 `public/loongisa/`）

## 重新生成

```bash
cd <pack>
# 这里的命令必须与 film.json.derive 一致
```
