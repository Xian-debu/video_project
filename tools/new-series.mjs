#!/usr/bin/env node
// Scaffold a series container (series/<id>): series.json, readings, shared dirs, episodes/.
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, writeJson, checkRepo, formatErrors } from "./lib.mjs";

function arg(name, fallback = null) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function fail(msg) { console.error("new-series: " + msg); process.exit(2); }

const id = arg("id");
const title = arg("title");
const description = arg("description");
if (!id) fail("--id is required");
if (!title) fail("--title is required");
if (!description) fail("--description is required");

const rel = `series/${id}`;
const abs = join(REPO_ROOT, rel);
if (existsSync(abs)) fail(`${rel} already exists`);
for (const d of ["shared/src", "shared/data", "shared/public", "episodes", "docs"]) mkdirSync(join(abs, d), { recursive: true });
for (const d of ["shared/src", "shared/data", "shared/public", "episodes"]) writeFileSync(join(abs, d, ".gitkeep"), "");

writeJson(join(abs, "series.json"), {
  schemaVersion: 1,
  id,
  title,
  description,
  episodes: [],
  productionOrder: [],
});
writeFileSync(join(abs, "plan.md"), `# ${title}

` +
  `## 系列一句话

${description}

` +
  `## 叙事骨架

| 集 | 论点 | 承接上一集的什么 | 留给下一集的问题 |
|---|---|---|---|

` +
  `## 视觉与声音的系列一致性

- 色彩/字体/版式：与引擎 design tokens 一致；系列共享组件放 shared/src/。
- 开场/收尾/章节条：待定。

` +
  `## 生产顺序与理由

（productionOrder 必须列出全部集；顺序可以不同于年代顺序。）

` +
  `## 风险与依赖

- 论文原文/图版授权：
- 实验环境：
- 待核实事实：
`);
writeFileSync(join(abs, "docs", "sources.md"), `# 来源与证据

| 集 | 论文 | 原文 | 图/表 | 授权/引用方式 |
|---|---|---|---|---|
`);

const catalogPath = join(REPO_ROOT, "catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
if (!catalog.series.includes(id)) catalog.series.push(id);
writeJson(catalogPath, catalog);

const repo = checkRepo(REPO_ROOT);
if (repo.errors.length) {
  console.error(`new-series: created ${rel} but repository check fails:
` + formatErrors(repo.errors));
  process.exit(1);
}
console.log(`new-series: created ${rel}; catalog updated; add episodes with tools/new-episode.mjs`);
