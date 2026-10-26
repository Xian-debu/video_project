#!/usr/bin/env node
// Human/JSON status of every pack: size, derived state, narration, delivery, bili.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { checkRepo, git, isGitRepo, REPO_ROOT } from "./lib.mjs";

const asJson = process.argv.includes("--json");
const repo = checkRepo(REPO_ROOT);
const rows = [];

function totalFrames(entryAbs, totalName) {
  if (!existsSync(entryAbs)) return null;
  const text = readFileSync(entryAbs, "utf8");
  const re = new RegExp(`export\\s+(?:const|let)\\s+${totalName}\\s*(?::[^=]+)?=\\s*([0-9]+)`);
  const m = text.match(re);
  return m ? Number(m[1]) : null;
}
function sizeOf(dir) {
  if (!existsSync(dir)) return 0;
  let sum = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) sum += statSync(p).size;
    }
  };
  walk(dir);
  return sum;
}

for (const f of repo.films) {
  const film = f.film;
  const frames = totalFrames(join(f.packAbs, film.entry), film.exports.total);
  const seconds = frames ? frames / film.fps : null;
  const deriveMissing = (film.derived || []).filter((p) => !existsSync(join(f.packAbs, p)));
  const dirty = isGitRepo(REPO_ROOT)
    ? git(REPO_ROOT, ["status", "--porcelain", "--", f.packRel]).stdout.trim().split("\n").filter(Boolean).length
    : null;
  const delivery = existsSync(join(f.packAbs, film.delivery))
    ? readdirSync(join(f.packAbs, film.delivery)).filter((n) => !n.endsWith(".mp4") && !n.endsWith(".work"))
    : [];
  rows.push({
    id: film.id,
    kind: f.kind,
    series: f.series ? f.series.id : null,
    title: film.title,
    composition: film.composition,
    status: film.status,
    seconds: seconds === null ? null : Math.round(seconds * 10) / 10,
    narration: film.narration ? "yes" : "silent",
    assets: film.assetsStatus,
    derivedMissing: deriveMissing.length,
    delivery: delivery.length,
    bili: film.bili && film.bili.bv ? film.bili.bv : null,
    dirty,
    packKiB: Math.round(sizeOf(f.packAbs) / 1024),
  });
}

if (asJson) {
  console.log(JSON.stringify({ ok: repo.errors.length === 0, films: rows, series: repo.series.map((s) => s.id), errors: repo.errors }, null, 2));
} else {
  const header = ["id", "status", "comp", "sec", "audio", "derived?", "deliv", "dirty", "KiB", "BV"];
  console.log(header.join("\t"));
  for (const r of rows) {
    console.log([
      r.id, r.status, r.composition, r.seconds ?? "-", r.narration,
      r.derivedMissing ? `${r.derivedMissing} missing` : "ok",
      r.delivery, r.dirty ?? "-", r.packKiB, r.bili ?? "-",
    ].join("\t"));
  }
  for (const e of repo.errors) console.log("! " + e);
}
process.exit(repo.errors.length ? 1 : 0);
