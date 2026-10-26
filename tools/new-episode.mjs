#!/usr/bin/env node
// Scaffold one episode inside a series: series/<sid>/episodes/NN-slug, and register it in series.json.
import { existsSync, readFileSync, mkdirSync, writeFileSync, copyFileSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, writeJson, checkRepo, formatErrors } from "./lib.mjs";

function arg(name, fallback = null) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function fail(msg) { console.error("new-episode: " + msg); process.exit(2); }
function fill(text, map) { for (const [k, v] of Object.entries(map)) text = text.split(k).join(v); return text; }
function copyTree(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const e of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, e.name), d = join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d); else copyFileSync(s, d);
  }
}

const sid = arg("series");
const dirName = arg("dir");
const id = arg("id");
const title = arg("title");
const composition = arg("composition");
if (!sid) fail("--series is required");
if (!dirName || !/^[0-9]{2}-[a-z0-9-]+$/.test(dirName)) fail("--dir must look like 01-godson1-2003");
if (!id) fail("--id is required");
if (!title) fail("--title is required");
if (!composition) fail("--composition is required (PascalCase)");

const seriesAbs = join(REPO_ROOT, "series", sid);
const seriesPath = join(seriesAbs, "series.json");
if (!existsSync(seriesPath)) fail(`series ${sid} does not exist`);
const sj = JSON.parse(readFileSync(seriesPath, "utf8"));
const order = sj.episodes.length + 1;
const expected = String(order).padStart(2, "0") + "-";
if (!dirName.startsWith(expected)) fail(`next episode must start with ${expected}; got ${dirName}`);
const packRel = `series/${sid}/episodes/${dirName}`;
const packAbs = join(REPO_ROOT, packRel);
if (existsSync(packAbs)) fail(`${packRel} already exists`);

copyTree(join(REPO_ROOT, "template", "pack"), packAbs);
const entry = `src/${composition}.tsx`;
const component = composition;
renameSync(join(packAbs, "src", "__COMPOSITION__.tsx"), join(packAbs, entry));
for (const rel of ["README.md", entry, "docs/plan.md"]) {
  const p = join(packAbs, rel);
  writeFileSync(p, fill(readFileSync(p, "utf8"), {
    __TITLE__: title, __ID__: id, __COMPOSITION__: composition, __COMPONENT__: component, __ENTRY__: `${composition}.tsx`,
  }));
}
for (const d of ["data", "assets/public", "assets/audio", "build", "delivery", "docs"]) mkdirSync(join(packAbs, d), { recursive: true });
for (const d of ["data", "assets/public", "assets/audio", "build", "delivery"]) writeFileSync(join(packAbs, d, ".gitkeep"), "");

writeJson(join(packAbs, "film.json"), {
  schemaVersion: 1, id, kind: "series-episode", title,
  series: { id: sid, order, dir: dirName },
  composition, entry,
  exports: { component, total: "TOTAL", fps: "FPS" },
  width: 1920, height: 1080, fps: 30,
  prefix: id,
  status: "draft",
  paper: null, claims: null,
  derive: [], derived: [], derivedNote: "无派生文件",
  narration: null, audio: { music: null },
  delivery: "delivery",
  docs: ["docs/plan.md"],
  bili: null,
  assetsStatus: "complete",
  paths: { src: "src", data: "data", public: "assets/public" },
});

sj.episodes.push(dirName);
if (!Array.isArray(sj.productionOrder)) sj.productionOrder = [];
sj.productionOrder.push(dirName);
writeJson(seriesPath, sj);

const repo = checkRepo(REPO_ROOT);
if (repo.errors.length) {
  console.error(`new-episode: created ${packRel} but repository check fails:
` + formatErrors(repo.errors));
  process.exit(1);
}
console.log(`new-episode: created ${packRel} (composition ${composition}); series ${sid} now has ${sj.episodes.length} episode(s); check ok`);
