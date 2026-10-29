#!/usr/bin/env node
// Scaffold the tsint series packs from ts-base plans/series.json.
// Idempotent: existing episode directories are left untouched unless --force is given.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const PLAN = process.env.TSINT_PLAN || "/root/ts-base/plans/series.json";
const SERIES_ID = "tsint";
const SERIES_DIR = join(ROOT, "series", SERIES_ID);
const force = process.argv.includes("--force");

const plan = JSON.parse(readFileSync(PLAN, "utf8"));
const episodes = plan.episodes;

const dirOf = (e) => String(e.index).padStart(2, "0") + "-" + e.slug;
const pascal = (s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
const compOf = (e) => "Tsint" + String(e.index).padStart(2, "0") + pascal(e.slug);

function write(path, body) {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, body);
}

function stub(e, dir) {
  const comp = compOf(e);
  const total = Math.max(1, Math.round(e.runtime_min * 60 * 30));
  return [
    "// Generated stub for " + dir + " - replace during production.",
    "// The real episode exports a Remotion composition; these constants keep the",
    "// repo checker (and the render harness) able to find its entry points.",
    "export const TOTAL = " + total + ";",
    "export const FPS = 30;",
    "",
    "export const " + comp + " = () => null;",
    "",
  ].join("\n");
}

function planDoc(e, dir) {
  const algs = e.algorithms || [];
  const lines = [
    "# " + dir + " - " + e.title,
    "",
    "> status: draft (scaffolded, not produced)",
    "> chapter: " + e.chapter + " | runtime target: " + e.runtime_min + " min | algorithms: " + algs.length,
    "",
    "## Thesis",
    "",
    e.thesis || "",
    "",
    "## Verification",
    "",
    e.verification || "",
    "",
    "## Data",
    "",
    e.data || "",
    "",
    "## Algorithms",
    "",
  ];
  if (!algs.length) lines.push("- (none: this is an introduction episode)");
  for (const a of algs) lines.push("- " + a.unit_id + " - " + a.name_zh + " (" + a.module + ")");
  lines.push("");
  return lines.join("\n");
}

// series.json
const series = {
  schemaVersion: 1,
  id: SERIES_ID,
  title: "时序智能：把九章算法写成可验证的实现课",
  description:
    "把《时序智能》9 章 193 个算法单元讲成可验证的实现课：74 集，每集不超过 3 个完整 Haskell 算法，每个算法独立实现、有测试、有真实 A 股数据上的行为演示。",
  episodes: episodes.map(dirOf),
  productionOrder: (plan.production_order || episodes.map((e) => e.slug)).map((slug) => {
    const e = episodes.find((x) => x.slug === slug);
    return e ? dirOf(e) : slug;
  }),
};
write(join(SERIES_DIR, "series.json"), JSON.stringify(series, null, 2) + "\n");

// plan.md
const planLines = ["# tsint 生产计划", "", "叙事顺序 " + episodes.length + " 集；生产顺序 " + series.productionOrder.length + " 步。", "", "| # | 目录 | 章 | 算法 | 时长 |", "|---|---|---|---|---|"];
for (const e of episodes) planLines.push("| " + e.index + " | " + dirOf(e) + " | " + e.chapter + " | " + (e.algorithms || []).length + " | " + e.runtime_min + " |");
planLines.push("", "## 生产顺序", "");
series.productionOrder.forEach((d, i) => planLines.push((i + 1) + ". " + d));
planLines.push("");
write(join(SERIES_DIR, "plan.md"), planLines.join("\n"));

for (const sub of ["src", "data", "public"]) mkdirSync(join(SERIES_DIR, "shared", sub), { recursive: true });
for (const sub of ["src", "data", "public"]) write(join(SERIES_DIR, "shared", sub, ".gitkeep"), "");

let created = 0;
for (const e of episodes) {
  const dir = dirOf(e);
  const pack = join(SERIES_DIR, "episodes", dir);
  if (existsSync(pack) && !force) continue;
  mkdirSync(pack, { recursive: true });
  for (const sub of ["src", "data", "delivery", "docs", "assets/public", "assets/audio"]) mkdirSync(join(pack, sub), { recursive: true });
  const comp = compOf(e);
  write(join(pack, "src", comp + ".tsx"), stub(e, dir));
  write(join(pack, "docs", "plan.md"), planDoc(e, dir));
  for (const sub of ["data", "delivery", "assets/public", "assets/audio"]) write(join(pack, sub, ".gitkeep"), "");
  write(join(pack, "film.json"), JSON.stringify({
    schemaVersion: 1,
    id: SERIES_ID + "-" + String(e.index).padStart(2, "0") + "-" + e.slug,
    kind: "series-episode",
    title: e.title,
    series: { id: SERIES_ID, order: e.index, dir },
    composition: comp,
    entry: "src/" + comp + ".tsx",
    exports: { component: comp, total: "TOTAL", fps: "FPS" },
    width: 1920,
    height: 1080,
    fps: 30,
    prefix: SERIES_ID + "-" + String(e.index).padStart(2, "0"),
    status: "draft",
    narration: null,
    audio: { music: null },
    derive: [],
    derived: [],
    claims: null,
    paths: { src: "src", data: "data", public: "assets/public" },
    delivery: "delivery",
    docs: ["docs/plan.md"],
    assetsStatus: "incomplete",
  }, null, 2) + "\n");
  created += 1;
}

// catalog registration
const catPath = join(ROOT, "catalog.json");
const catalog = JSON.parse(readFileSync(catPath, "utf8"));
if (!catalog.series.includes(SERIES_ID)) {
  catalog.series.push(SERIES_ID);
  writeFileSync(catPath, JSON.stringify(catalog, null, 2) + "\n");
}

console.log("scaffold: " + created + " episode pack(s) created, " + episodes.length + " total, series/" + SERIES_ID);