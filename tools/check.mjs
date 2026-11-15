#!/usr/bin/env node
// Validate every pack in this repo. No dependencies.
//
// 两种模式（见 docs/CLOSEOUT-PLAN-2026-11-15.md §2 D5/D6）：
//   node tools/check.mjs           源码模式：任何干净克隆都应 0 error（派生资产不要求存在）
//   node tools/check.mjs --assets  资产模式：出片/交付机上跑，narration.wav 与 delivery/*.mp4 必须在
import { checkRepo, formatErrors, REPO_ROOT } from "./lib.mjs";

const argv = process.argv.slice(2);
const asJson = argv.includes("--json");
const assets = argv.includes("--assets");
const result = checkRepo(REPO_ROOT, { assets });
const mode = assets ? "assets" : "source";

if (asJson) {
  console.log(JSON.stringify({
    ok: result.errors.length === 0,
    mode,
    films: result.films.length,
    series: result.series.length,
    errors: result.errors,
    warnings: result.warnings,
  }, null, 2));
} else {
  for (const w of result.warnings) console.log("  ! " + w);
  if (result.errors.length) {
    console.error(`check[${mode}]: ${result.errors.length} error(s)\n` + formatErrors(result.errors));
  }
  console.log(`check[${mode}]: ${result.films.length} film(s), ${result.series.length} series, ` +
    `${result.errors.length} error(s), ${result.warnings.length} warning(s)`);
}
process.exit(result.errors.length ? 1 : 0);
