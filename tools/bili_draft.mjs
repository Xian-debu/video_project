#!/usr/bin/env node
// Build the Bilibili submission draft for one film from its own metadata, so the upload form is
// copied from a file instead of from memory. It does not upload and does not touch the network.
//
//   node tools/bili_draft.mjs --film convcode            # JSON on stdout
//   node tools/bili_draft.mjs --film convcode --out out/convcode/bili.json
//
// Fields the platform decides (分区, 创作声明) are declared here as constants; the description is
// a template the author edits, with the paper citation, experiment note and AI disclosure already
// in place. The draft is evidence of what was submitted, not an API.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, isAbsolute } from "node:path";

import { loadCatalog, REPO_ROOT } from "./lib.mjs";

function arg(name, fallback = null) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const id = arg("film");
if (!id) { console.error("bili_draft: --film <id> is required"); process.exit(2); }
const catalog = loadCatalog(REPO_ROOT);
const entry = catalog.films.find((f) => f.film.id === id);
if (!entry) { console.error("bili_draft: no such film: " + id); process.exit(2); }
const film = entry.film;

const paper = film.paper
  ? `${film.paper.title}（${(film.paper.authors || []).join("、")}，${film.paper.venue || ""} ${film.paper.year ?? ""}）`
  : null;
const claims = film.claims ? `引文台账：${film.claims.ledger}（每条数字回查 ${film.claims.paper}）` : null;
const experiment = (film.derive || []).map((d) => d.command).filter(Boolean);
const lines = [
  "【本集讲什么】<一句话钩子 + 本集要回答的问题>",
  "",
  "【片子里的演示】<这段演示/实验做了什么、能看到什么现象>",
  ...(experiment.length ? ["实验脚本（随内容仓管理）：" + experiment.join("；")] : []),
  ...(paper ? ["【原文】" + paper] : []),
  ...(claims ? [claims] : []),
  "画面中的图表若为作者重绘，会在片中标注；原文图版均注明出处与页码。",
  "",
  "【关于本片】本片为论文/标准解读，含 AI 生成的画面与配音；事实与数字来自上述公开资料，实验为本机可复现的模型演示，不代表芯片实测。",
].filter((l) => l !== null);
const draft = {
  schemaVersion: 1,
  generatedBy: "tools/bili_draft.mjs",
  film: { id: film.id, title: film.title, pack: entry.packRel, status: film.status, bv: film.bili?.bv ?? null },
  platform: {
    partition: "科技数码",
    declaration: "含AI生成内容",
    watermark: false,
    visibility: "公开可见",
    coverFrame: 180,
  },
  title: film.title,
  description: lines.join("\n"),
  tags: arg("tags") ? arg("tags").split(",").map((t) => t.trim()).filter(Boolean) : ["论文解读", "通信原理", "信道编码", "卷积码", "GSM", "科技史", "AI生成"],
  series: entry.series ? { id: entry.series.id, title: entry.series.json?.title ?? null } : null,
  notes: "tags/description are drafts: edit before submitting, then paste the final text into the form.",
};
const text = JSON.stringify(draft, null, 2) + "\n";
const out = arg("out");
if (out) {
  const p = isAbsolute(out) ? out : join(REPO_ROOT, out);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text);
  console.log("bili_draft: wrote " + out);
} else {
  process.stdout.write(text);
}
