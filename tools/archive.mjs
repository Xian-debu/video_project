#!/usr/bin/env node
// tools/archive.mjs — 分档清理派生资产（默认 dry-run）。
// 用法: node tools/archive.mjs [--apply] [--json] [--include-clips] [--engine <dir>]
// 判据: CONVENTIONS.md「交付目录的保留策略」+ docs/CLOSEOUT-PLAN-2026-11-15.md §5。
// 铁律: 每集必须具备成品凭据（manifest 的 sha/bytes/时长 + ledger 的 bvid）才允许清理；
//       A1 clips 默认保留（367MiB，可在不重跑 TTS 的情况下重建 narration）。
import { existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, loadCatalog, loadReleaseFacts } from "./lib.mjs";

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const apply = has("--apply");
const asJson = has("--json");
const includeClips = has("--include-clips");
const engineIdx = argv.indexOf("--engine");
const engineDir = engineIdx >= 0 ? argv[engineIdx + 1] : null;

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}
function collect(paths) {
  const out = [];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    const st = statSync(p);
    if (st.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}
const bytesOf = (files) => files.reduce((a, p) => a + statSync(p).size, 0);
const GiB = (n) => (n / 2 ** 30).toFixed(2) + " GiB";
const MiB = (n) => (n / 2 ** 20).toFixed(1) + " MiB";

const catalog = loadCatalog(REPO_ROOT);
const facts = loadReleaseFacts(REPO_ROOT);
const plans = [];
const skips = [];

function ledgerEntry(sid, order) {
  const l = facts.ledgers.get(sid);
  if (!l || !l.episodes) return null;
  if (l.episodes[String(order)]) return l.episodes[String(order)];
  return Object.values(l.episodes).find((x) => x && x.order === order) || null;
}

for (const entry of catalog.films) {
  const film = entry.film;
  const packAbs = entry.packAbs;
  let guard = null;
  let why = null;
  const sid = entry.series && entry.series.id ? entry.series.id : film.series && film.series.id;
  if (entry.kind === "series-episode" && sid) {
    const order = (film.series && film.series.order) || (entry.series && entry.series.order);
    const ep = facts.epByOrder.get(sid + ":" + order);
    const led = order ? ledgerEntry(sid, order) : null;
    if (ep && ep.videoSha256 && ep.videoBytes > 0 && ep.durationSec > 0 && led && led.bvid) {
      guard = { bv: led.bvid, sha: String(ep.videoSha256).slice(0, 12) + "...", sec: ep.durationSec, note: null };
    } else if (film.bili && film.bili.bv) {
      const missing = [];
      if (!ep) missing.push("release manifest");
      if (!led || !led.bvid) missing.push("ledger bvid");
      guard = { bv: film.bili.bv, sha: "film.json bili (no manifest)", sec: null, note: "no " + missing.join(" + ") + "; fell back to film.bili.bv" };
    } else {
      why = ep ? "release facts incomplete and no film.bili.bv" : "manifest has no entry for " + sid + ":" + order + " and no film.bili.bv";
    }
  } else if (film.bili && film.bili.bv) {
    guard = { bv: film.bili.bv, sha: "single (no manifest)", sec: null, note: film.status !== "published" ? "status=" + film.status + " but bili.bv present" : null };
  } else {
    why = "status=" + film.status + ", no film.bili.bv (publish fact missing)";
  }
  if (!guard) {
    skips.push({ packRel: entry.packRel, why });
    continue;
  }
  const del = join(packAbs, film.delivery || "delivery");
  const topMp4 = existsSync(del)
    ? readdirSync(del).filter((f) => f.endsWith(".mp4") && f !== "raw_video.mp4" && f !== "programme_unnorm.mp4").map((f) => join(del, f))
    : [];
  const filesA1 = includeClips ? collect([join(packAbs, "assets/audio/clips")]) : [];
  const filesA2 = collect([
    join(del, "raw_video.mp4"),
    join(del, "programme_unnorm.mp4"),
    join(del, "scenes"),
    join(del, "stills"),
  ]);
  const filesB1 = topMp4;
  const filesB2 = [...collect([del]).filter((p) => p.endsWith(".wav")), join(packAbs, "assets/audio/narration.wav")]
    .filter((p) => existsSync(p));
  const tiers = [
    { tier: "A1-clips", files: filesA1 },
    { tier: "A2-intermediate", files: filesA2 },
    { tier: "B1-final-mp4", files: filesB1 },
    { tier: "B2-derivative-wav", files: filesB2 },
  ].filter((t) => t.files.length > 0);
  if (tiers.length) plans.push({ packRel: entry.packRel, guard, tiers });
}

const totByTier = new Map();
let totalFiles = 0;
let totalBytes = 0;
for (const p of plans) {
  for (const t of p.tiers) {
    const n = t.files.length;
    const b = bytesOf(t.files);
    totalFiles += n;
    totalBytes += b;
    const cur = totByTier.get(t.tier) || { files: 0, bytes: 0 };
    totByTier.set(t.tier, { files: cur.files + n, bytes: cur.bytes + b });
  }
}

// 引擎侧：out/ 临时工作区 + webpack 构建缓存（都可再生）
const enginePlan = [];
if (engineDir) {
  const outDir = join(engineDir, "out");
  if (existsSync(outDir)) {
    const files = collect([outDir]);
    if (files.length) enginePlan.push({ tier: "C-engine-out", files });
  }
  const cacheDir = join(engineDir, "node_modules/.cache");
  if (existsSync(cacheDir)) {
    const files = walkFiles(cacheDir);
    if (files.length) enginePlan.push({ tier: "C-engine-cache", files });
  }
}
for (const t of enginePlan) {
  const cur = totByTier.get(t.tier) || { files: 0, bytes: 0 };
  totByTier.set(t.tier, { files: cur.files + t.files.length, bytes: cur.bytes + bytesOf(t.files) });
  totalFiles += t.files.length;
  totalBytes += bytesOf(t.files);
}

const pruneEmpty = [];
function removeDirIfEmpty(dir) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return;
  const ents = readdirSync(dir);
  if (ents.length === 0) rmdirSync(dir);
}

let removedFiles = 0;
let removedBytes = 0;
if (apply) {
  for (const p of plans) {
    for (const t of p.tiers) {
      for (const f of t.files) {
        const b = statSync(f).size;
        unlinkSync(f);
        removedFiles += 1;
        removedBytes += b;
      }
    }
    pruneEmpty.push(join(REPO_ROOT, p.packRel, "delivery/scenes"));
    pruneEmpty.push(join(REPO_ROOT, p.packRel, "delivery/stills"));
    if (includeClips) pruneEmpty.push(join(REPO_ROOT, p.packRel, "assets/audio/clips"));
  }
  for (const t of enginePlan) {
    for (const f of t.files) {
      const b = statSync(f).size;
      unlinkSync(f);
      removedFiles += 1;
      removedBytes += b;
    }
  }
  for (const d of pruneEmpty) removeDirIfEmpty(d);
}

const result = {
  mode: apply ? "applied" : "dry-run",
  includeClips,
  packsWithCredentials: plans.length,
  skipped: skips.length,
  totalFiles,
  totalBytes,
  totalGiB: Number((totalBytes / 2 ** 30).toFixed(2)),
  removedFiles,
  removedBytes,
  tiers: [...totByTier.entries()].map(([tier, v]) => ({ tier, files: v.files, bytes: v.bytes, GiB: Number((v.bytes / 2 ** 30).toFixed(2)) })),
  engineDir,
  skips,
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log("archive: " + result.mode + " — " + plans.length + " pack(s) 凭据齐全, " + totalFiles + " file(s), " + GiB(totalBytes));
  for (const t of result.tiers) {
    console.log("  " + t.tier.padEnd(22) + String(t.files).padStart(6) + " file(s)  " + GiB(t.bytes).padStart(10));
  }
  if (!includeClips) console.log("  (A1 clips 保留: 需 --include-clips 才纳入清理)");
  if (skips.length) {
    console.log("  skipped pack(s): " + skips.length);
    for (const s of skips.slice(0, 10)) console.log("    - " + s.packRel + ": " + s.why);
  }
  if (apply) console.log("archive: removed " + removedFiles + " file(s), " + GiB(removedBytes) + " — 请接着跑 node tools/check.mjs");
  else console.log("archive: dry-run only — 加 --apply 执行删除");
}

if (apply && catalog.errors.length) {
  console.error("catalog errors: " + catalog.errors.length);
  process.exitCode = 1;
}
