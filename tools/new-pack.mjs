#!/usr/bin/env node
// Scaffold one standalone film pack (singles/<id>) and register it in catalog.json.
import { existsSync, readFileSync, mkdirSync, writeFileSync, copyFileSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, loadCatalog, writeJson, isDir, checkRepo, formatErrors } from "./lib.mjs";

function arg(name, fallback = null) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function fail(msg) { console.error("new-pack: " + msg); process.exit(2); }
function fill(text, map) { for (const [k, v] of Object.entries(map)) text = text.split(k).join(v); return text; }
function copyTree(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const e of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, e.name), d = join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d); else copyFileSync(s, d);
  }
}

const id = arg("id");
const title = arg("title");
const composition = arg("composition") || (id ? id.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("") : null);
if (!id) fail("--id is required (lower-kebab-case)");
if (!title) fail("--title is required");
const packRel = `singles/${id}`;
const packAbs = join(REPO_ROOT, packRel);
if (existsSync(packAbs)) fail(`${packRel} already exists`);

const tpl = join(REPO_ROOT, "template", "pack");
copyTree(tpl, packAbs);
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
for (const d of ["data", "assets/public", "assets/audio", "build", "delivery"]) {
  const k = join(packAbs, d, ".gitkeep");
  if (!existsSync(k)) writeFileSync(k, "");
}

const film = {
  schemaVersion: 1, id, kind: "single", title,
  composition,
  entry,
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
};
if (process.argv.includes("--with-plates")) {
  // A material-based film shows the source itself. The scaffold starts as optional: an empty
  // manifest that already fails the gate would make the first commit red for the wrong reason.
  film.material = "optional";
  writeJson(join(packAbs, "data", "source-figures.json"), { schemaVersion: 1, plates: [] });
  mkdirSync(join(packAbs, "assets", "public", "plates"), { recursive: true });
  writeFileSync(join(packAbs, "assets", "public", "plates", ".gitkeep"), "");
  console.log("new-pack: source-figure scaffold at data/source-figures.json + assets/public/plates/");
}
writeJson(join(packAbs, "film.json"), film);

const catalogPath = join(REPO_ROOT, "catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
if (!catalog.singles.includes(id)) catalog.singles.push(id);
writeJson(catalogPath, catalog);

const repo = checkRepo(REPO_ROOT);
if (repo.errors.length) {
  console.error(`new-pack: created ${packRel} but repository check fails:
` + formatErrors(repo.errors));
  process.exit(1);
}
console.log(`new-pack: created ${packRel} (composition ${composition}, entry ${entry}); catalog updated; check ok`);
