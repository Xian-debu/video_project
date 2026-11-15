#!/usr/bin/env node
// Human/JSON status of every pack: size, derived state, narration, delivery, bili.
//
// 单一真源原则（docs/CLOSEOUT-PLAN-2026-11-15.md §6）：
//   这张表只能由 **git 里的事实** 推出，才能在任何克隆里得到同一结果：
//     status          <- film.json.status              （由 release/backfill_status.py 从 ledger.json 投影）
//     sec             <- release/manifest.json.durationSec
//                        -> delivery/report.json（**只在它被 git 跟踪时**）
//                        -> src 里 export const TOTAL = <n> / fps
//                        -> "-"
//     audio           <- film.json.narration
//     derived         <- film.json.derived/derive（"方法在库"判据，不看本机文件是否还在）
//     delivery        <- git ls-files <pack>/delivery 的条目数（不数本机 ignored 残渣）
//     BV              <- film.json.bili.bv -> release/ledger.json
//
// 用法：
//   node tools/status.mjs            # TSV（含本机体积/dirty，供人看）
//   node tools/status.mjs --md       # Markdown（STATUS.md 的内容）
//   node tools/status.mjs --check    # STATUS.md 是否与生成结果逐字节一致（CI 门禁）
//   node tools/status.mjs --json
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { checkRepo, git, isGitRepo, REPO_ROOT, loadReleaseFacts } from "./lib.mjs";

const argv = process.argv.slice(2);
const asJson = argv.includes("--json");
const doCheck = argv.includes("--check");
const asMd = argv.includes("--md") || doCheck;

const repo = checkRepo(REPO_ROOT);
const facts = loadReleaseFacts(REPO_ROOT);
const errors = [...repo.errors, ...facts.errors];
const rows = [];

function totalFrames(entryAbs, totalName) {
  if (!existsSync(entryAbs)) return null;
  const text = readFileSync(entryAbs, "utf8");
  const re = new RegExp("export\\s+(?:const|let)\\s+" + totalName + "\\s*(?::[^=]+)?=\\s*([0-9]+)");
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
function trackedUnder(packRel, sub) {
  if (!isGitRepo(REPO_ROOT)) return null;
  const out = git(REPO_ROOT, ["ls-files", "-z", "--", packRel + "/" + sub]).stdout;
  return out.split("\0").filter(Boolean);
}

for (const f of repo.films) {
  const film = f.film;
  const deliverySub = film.delivery || "delivery";
  const deliveryRel = f.packRel + "/" + deliverySub;
  const trackedDelivery = trackedUnder(f.packRel, deliverySub);

  // --- seconds: manifest -> 被跟踪的 report.json -> entry 里的 TOTAL -> "-"
  let secSource = null;
  let secs = null;
  const ep = film.series ? facts.epByOrder.get(film.series.id + ":" + film.series.order) : null;
  if (ep && Number.isFinite(ep.durationSec)) {
    secs = ep.durationSec;
    secSource = "manifest";
  }
  if (secs === null && trackedDelivery && trackedDelivery.includes(deliveryRel + "/report.json")) {
    const reportAbs = join(f.packAbs, deliverySub, "report.json");
    if (existsSync(reportAbs)) {
      try {
        const r = JSON.parse(readFileSync(reportAbs, "utf8"));
        const v = Number.isFinite(r.seconds) ? r.seconds
          : Number.isFinite(r.durationSec) ? r.durationSec
          : (Number.isFinite(r.frames) && film.fps ? r.frames / film.fps : null);
        if (Number.isFinite(v)) { secs = v; secSource = "report"; }
      } catch (e) { /* fall through */ }
    }
  }
  if (secs === null) {
    const frames = totalFrames(join(f.packAbs, film.entry), film.exports.total);
    if (frames) { secs = frames / film.fps; secSource = "entry"; }
  }

  // --- derived: 只看"方法是否在库"，保证任何克隆同值
  const derivedList = film.derived || [];
  const deriveList = film.derive || [];
  const derivedCol = derivedList.length === 0 ? "ok"
    : deriveList.length === 0 ? derivedList.length + " no-method"
    : "ok";

  // --- delivery: 只数被 git 跟踪的条目
  let deliveryCount;
  if (trackedDelivery !== null) deliveryCount = trackedDelivery.length;
  else if (existsSync(join(f.packAbs, deliverySub))) deliveryCount = readdirSync(join(f.packAbs, deliverySub)).length;
  else deliveryCount = 0;

  const bv = (film.bili && film.bili.bv) || facts.bvById.get(film.id) || null;
  const dirty = isGitRepo(REPO_ROOT)
    ? git(REPO_ROOT, ["status", "--porcelain", "--", f.packRel]).stdout.trim().split("\n").filter(Boolean).length
    : null;

  rows.push({
    id: film.id,
    kind: f.kind,
    series: f.series ? f.series.id : null,
    title: film.title,
    composition: film.composition,
    status: film.status,
    seconds: secs === null ? null : Math.round(secs * 10) / 10,
    secondsSource: secSource,
    narration: film.narration ? "yes" : "silent",
    assets: film.assetsStatus,
    derived: derivedCol,
    derivedCount: derivedList.length,
    delivery: deliveryCount,
    deliveryTracked: trackedDelivery !== null,
    bili: bv,
    dirty,
    packKiB: Math.round(sizeOf(f.packAbs) / 1024),
  });
}

function mdTable() {
  const out = [];
  out.push("| id | title | status | sec | audio | derived | delivery | BV |");
  out.push("|---|---|---|---|---|---|---|---|");
  for (const r of rows) {
    const title = String(r.title).replace(/\|/g, "\\|");
    out.push("| " + r.id + " | " + title + " | " + r.status + " | " + (r.seconds === null ? "-" : r.seconds.toFixed(1)) +
      " | " + r.narration + " | " + r.derived + " | " + r.delivery + " | " + (r.bili || "-") + " |");
  }
  return out.join("\n") + "\n";
}

if (doCheck) {
  const statusPath = join(REPO_ROOT, "STATUS.md");
  if (!existsSync(statusPath)) {
    console.error("status: STATUS.md 不存在（先跑 node tools/status.mjs --md > STATUS.md）");
    process.exit(1);
  }
  const want = mdTable();
  const got = readFileSync(statusPath, "utf8");
  if (want !== got) {
    const a = want.split("\n"), b = got.split("\n");
    const diffs = [];
    for (let i = 0; i < Math.max(a.length, b.length) && diffs.length < 10; i++) {
      if (a[i] !== b[i]) diffs.push("  L" + (i + 1) + "\n    generated: " + (a[i] === undefined ? "<eof>" : a[i]) + "\n    STATUS.md: " + (b[i] === undefined ? "<eof>" : b[i]));
    }
    console.error("status: STATUS.md 与生成结果不一致（" + rows.length + " 行数据）\n" + diffs.join("\n"));
    console.error("  修法：node tools/status.mjs --md > STATUS.md");
    process.exit(1);
  }
  if (errors.length) {
    console.error("status: 表格一致，但 checkRepo 报 " + errors.length + " 个错误");
    for (const e of errors.slice(0, 20)) console.error("  x " + e);
    process.exit(1);
  }
  console.log("status: OK — STATUS.md 与生成结果逐字节一致（" + rows.length + " film(s)）");
  process.exit(0);
} else if (asMd) {
  process.stdout.write(mdTable());
} else if (asJson) {
  console.log(JSON.stringify({ ok: errors.length === 0, films: rows, series: repo.series.map((s) => s.id), errors }, null, 2));
} else {
  const header = ["id", "status", "comp", "sec", "from", "audio", "derived?", "deliv", "dirty", "KiB", "BV"];
  console.log(header.join("\t"));
  for (const r of rows) {
    console.log([
      r.id, r.status, r.composition, r.seconds === null ? "-" : r.seconds, r.secondsSource || "-", r.narration,
      r.derived, r.delivery, r.dirty === null ? "-" : r.dirty, r.packKiB, r.bili || "-",
    ].join("\t"));
  }
  for (const e of errors) console.log("! " + e);
}
process.exit(errors.length ? 1 : 0);
