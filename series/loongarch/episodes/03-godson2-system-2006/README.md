# 龙芯2号系统优化：让整机跟上核

`godson2sys` — 单集。契约见 `film.json`；工程约定见仓库根 `CONVENTIONS.md`。

- 引擎入口：`src/Godson2System.tsx`（挂载为引擎 `src/godson2sys/`）
- 合成名：`Godson2System`
- 数据：`data/`（挂载为引擎 `data/godson2sys/`）
- 资源：`assets/public/`（挂载为引擎 `public/godson2sys/`）

## 重新生成

```bash
cd <pack>
# 这里的命令必须与 film.json.derive 一致
```
