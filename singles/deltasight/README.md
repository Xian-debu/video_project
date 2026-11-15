# DeltaSight：让摄像头只算它该算的

`deltasight` — 单集。契约见 `film.json`；工程约定见仓库根 `CONVENTIONS.md`。

- 引擎入口：`src/Deltasight.tsx`（挂载为引擎 `src/deltasight/`）
- 合成名：`Deltasight`
- 数据：`data/`（挂载为引擎 `data/deltasight/`）
- 资源：`assets/public/`（挂载为引擎 `public/deltasight/`）

## 重新生成

```bash
cd <pack>
# 这里的命令必须与 film.json.derive 一致
```
