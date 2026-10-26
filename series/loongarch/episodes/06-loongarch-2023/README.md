# LoongArch：自己的指令系统

`loongarch` — 单集。契约见 `film.json`；工程约定见仓库根 `CONVENTIONS.md`。

- 引擎入口：`src/LoongArch.tsx`（挂载为引擎 `src/loongarch/`）
- 合成名：`LoongArch`
- 数据：`data/`（挂载为引擎 `data/loongarch/`）
- 资源：`assets/public/`（挂载为引擎 `public/loongarch/`）

## 重新生成

```bash
cd <pack>
# 这里的命令必须与 film.json.derive 一致
```
