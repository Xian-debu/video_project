#!/usr/bin/env node
// Validate every pack in this repo. No dependencies.
import { checkRepo, formatErrors, REPO_ROOT } from "./lib.mjs";
import { relative } from "node:path";

const asJson = process.argv.includes("--json");
const result = checkRepo(REPO_ROOT);

if (asJson) {
  console.log(JSON.stringify({
    ok: result.errors.length === 0,
    films: result.films.length,
    series: result.series.length,
    errors: result.errors,
    warnings: result.warnings,
  }, null, 2));
} else {
  for (const w of result.warnings) console.log("  ! " + w);
  if (result.errors.length) {
    console.error(`check: ${result.errors.length} error(s)\n` + formatErrors(result.errors));
  }
  console.log(`check: ${result.films.length} film(s), ${result.series.length} series, ` +
    `${result.errors.length} error(s), ${result.warnings.length} warning(s)`);
}
process.exit(result.errors.length ? 1 : 0);
