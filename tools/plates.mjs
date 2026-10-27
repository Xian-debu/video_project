#!/usr/bin/env node
// Report the source-figure manifest of every film, and fail on any structural problem.
//
//   node tools/plates.mjs            # human table + errors
//   node tools/plates.mjs --json     # machine form
//
// The contract lives in tools/lib.mjs (checkPlates). A film that declares material:"required"
// must show at least two original figures, each with provenance and licence, and each referenced
// from its mounted src/. The manifest is data/source-figures.json; the files live under
// assets/public/plates/.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { checkRepo, formatErrors, REPO_ROOT } from "./lib.mjs";

const asJson = process.argv.includes("--json");
const result = checkRepo(REPO_ROOT);
const rows = result.films.map((f) => {
  const manifestPath = join(f.packAbs, "data/source-figures.json");
  let plates = [];
  if (existsSync(manifestPath)) {
    try {
      const doc = JSON.parse(readFileSync(manifestPath, "utf8"));
      plates = Array.isArray(doc.plates) ? doc.plates : [];
    } catch { plates = []; }
  }
  return {
    id: f.film.id,
    pack: f.packRel,
    material: f.film.material ?? "optional",
    plates: plates.length,
    licences: [...new Set(plates.map((p) => p.license).filter(Boolean))],
    files: plates.map((p) => p.file).filter(Boolean),
  };
});
const related = (e) => e.includes("source-figures") || e.includes("plate") || e.includes("material");
const plateErrors = result.errors.filter(related);
const plateWarnings = result.warnings.filter(related);
if (asJson) {
  console.log(JSON.stringify({ ok: plateErrors.length === 0, films: rows, errors: plateErrors, warnings: plateWarnings }, null, 2));
} else {
  console.log(["film", "material", "plates", "licences"].join("\t"));
  for (const r of rows) {
    console.log([r.id, r.material, r.plates, r.licences.join(",") || "-"].join("\t"));
  }
  for (const w of plateWarnings) console.log("  ! " + w);
  if (plateErrors.length) {
    console.error("plates: " + plateErrors.length + " error(s)");
    console.error(formatErrors(plateErrors));
  } else {
    const total = rows.reduce((n, r) => n + r.plates, 0);
    console.log("plates: ok — " + total + " source figure(s) across " + rows.length + " film(s)");
  }
}
process.exit(plateErrors.length ? 1 : 0);
