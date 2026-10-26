// tools/lib.mjs — content repo contracts. Node 22 stdlib only.
import { readFileSync, existsSync, statSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(TOOLS_DIR, "..");

export const ID_RE = /^[a-z][a-z0-9-]*$/;
export const COMPOSITION_RE = /^[A-Z][A-Za-z0-9]*$/;
export const PREFIX_RE = /^[a-z][a-z0-9-]*$/;
export const EXPORT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
export const STATUSES = new Set(["draft", "ready", "published", "retired"]);
export const ASSET_STATUSES = new Set(["complete", "incomplete"]);
// Composition ids owned by the engine's demo/showcase layer (engine src/Root.tsx). A film may not
// take one: the registry would silently shadow the demo, and the demo would shadow the film.
export const RESERVED_COMPOSITIONS = new Set([
  "Storyboard", "Showreel", "Transitions", "Typesetting", "ThreeCube", "ThreeStage",
  "PlateStage", "PropStage", "Presets", "ManimOverlay", "LintFixtures", "Char2Probe",
]);
export const ENGINE_SRC_DIRS = new Set(["design", "storyboard", "qa", "showcase", "spike"]);

export function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

export function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

export function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}
export function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

export function listFiles(dir, exts = null) {
  const out = [];
  if (!isDir(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "__pycache__") continue;
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p, exts));
    else if (!exts || exts.some((e) => entry.name.endsWith(e))) out.push(p);
  }
  return out;
}

export function relSafe(value, what, errors) {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${what}: expected a non-empty path`);
    return false;
  }
  if (value.startsWith("/") || /^[A-Za-z]:[\\/]/.test(value)) {
    errors.push(`${what}: absolute path is forbidden: ${value}`);
    return false;
  }
  const segs = value.split("/");
  if (segs.includes("..")) {
    errors.push(`${what}: ".." is forbidden: ${value}`);
    return false;
  }
  return true;
}

export function git(root, args) {
  return spawnSync("git", ["-C", root, ...args], { encoding: "utf8" });
}

export function isGitRepo(root) {
  return isDir(join(root, ".git")) || (git(root, ["rev-parse", "--git-dir"]).status === 0);
}

export function gitTracked(root, paths) {
  if (!isGitRepo(root) || paths.length === 0) return [];
  const r = git(root, ["ls-files", "-z", "--", ...paths]);
  if (r.status !== 0) return [];
  return r.stdout.split("\0").filter(Boolean);
}

export function gitIgnored(root, path) {
  if (!isGitRepo(root)) return null;
  const r = git(root, ["check-ignore", "-q", "--", path]);
  return r.status === 0;
}

// ---------- catalog ----------

export function loadCatalog(root = REPO_ROOT) {
  const errors = [];
  const warnings = [];
  const catalogPath = join(root, "catalog.json");
  if (!isFile(catalogPath)) {
    return { errors: ["catalog.json is missing"], warnings, catalog: null, films: [], series: [] };
  }
  const catalog = readJson(catalogPath);
  if (catalog.schemaVersion !== 1) errors.push("catalog.json: schemaVersion must be 1");
  if (!Array.isArray(catalog.singles)) errors.push("catalog.json: singles must be an array");
  if (!Array.isArray(catalog.series)) errors.push("catalog.json: series must be an array");
  const singles = Array.isArray(catalog.singles) ? catalog.singles : [];
  const seriesIds = Array.isArray(catalog.series) ? catalog.series : [];

  const films = [];
  const series = [];
  const seenIds = new Map();
  const seenCompositions = new Map();
  const seenPrefixes = new Map();

  const register = (film, packRel, kind, seriesRef, episodeDir) => {
    const ctx = `${packRel}/film.json`;
    validateFilm(film, { packRel, kind, seriesRef }, errors, warnings);
    for (const [key, map, label] of [
      [film.id, seenIds, "id"],
      [film.composition, seenCompositions, "composition"],
      [film.prefix, seenPrefixes, "prefix"],
    ]) {
      if (typeof key !== "string") continue;
      if (map.has(key)) errors.push(`${ctx}: duplicate ${label} "${key}" (also ${map.get(key)})`);
      else map.set(key, packRel);
    }
    films.push({ packRel, packAbs: join(root, packRel), film, kind, series: seriesRef, episodeDir });
  };

  for (const id of singles) {
    if (typeof id !== "string" || !ID_RE.test(id)) {
      errors.push(`catalog.json: bad single id ${JSON.stringify(id)}`);
      continue;
    }
    const packRel = `singles/${id}`;
    if (!isDir(join(root, packRel))) {
      errors.push(`catalog.json: ${packRel} does not exist`);
      continue;
    }
    const fp = join(root, packRel, "film.json");
    if (!isFile(fp)) {
      errors.push(`${packRel}: film.json is missing`);
      continue;
    }
    const film = readJson(fp);
    if (film.id !== id) errors.push(`${packRel}/film.json: id "${film.id}" does not match folder "${id}"`);
    if (film.kind !== "single") errors.push(`${packRel}/film.json: kind must be "single"`);
    register(film, packRel, "single", null, null);
  }

  for (const sid of seriesIds) {
    if (typeof sid !== "string" || !ID_RE.test(sid)) {
      errors.push(`catalog.json: bad series id ${JSON.stringify(sid)}`);
      continue;
    }
    const sRel = `series/${sid}`;
    const sp = join(root, sRel, "series.json");
    if (!isFile(sp)) {
      errors.push(`${sRel}: series.json is missing`);
      continue;
    }
    const sj = readJson(sp);
    const sctx = `${sRel}/series.json`;
    if (sj.schemaVersion !== 1) errors.push(`${sctx}: schemaVersion must be 1`);
    if (sj.id !== sid) errors.push(`${sctx}: id "${sj.id}" does not match folder "${sid}"`);
    if (typeof sj.title !== "string" || !sj.title) errors.push(`${sctx}: title is required`);
    if (typeof sj.description !== "string" || !sj.description) errors.push(`${sctx}: description is required`);
    if (!Array.isArray(sj.episodes)) {
      errors.push(`${sctx}: episodes must be an array`);
      continue;
    }
    const epRoot = join(root, sRel, "episodes");
    const listed = new Set(sj.episodes);
    if (isDir(epRoot)) {
      for (const ent of readdirSync(epRoot, { withFileTypes: true })) {
        if (ent.isDirectory() && !listed.has(ent.name)) {
          errors.push(`${sRel}/episodes/${ent.name}: directory is not listed in series.json.episodes`);
        }
      }
    }
    sj.episodes.forEach((dirName, i) => {
      if (typeof dirName !== "string" || !/^[0-9]{2}-[a-z0-9-]+$/.test(dirName)) {
        errors.push(`${sctx}: episodes[${i}] must look like "01-slug"`);
        return;
      }
      const expectPrefix = String(i + 1).padStart(2, "0") + "-";
      if (!dirName.startsWith(expectPrefix)) errors.push(`${sctx}: episodes[${i}] should start with "${expectPrefix}"`);
      const packRel = `${sRel}/episodes/${dirName}`;
      const fp = join(root, packRel, "film.json");
      if (!isFile(fp)) {
        errors.push(`${packRel}: film.json is missing`);
        return;
      }
      const film = readJson(fp);
      if (film.kind !== "series-episode") errors.push(`${packRel}/film.json: kind must be "series-episode"`);
      if (!film.series || film.series.id !== sid) errors.push(`${packRel}/film.json: series.id must be "${sid}"`);
      if (!film.series || film.series.order !== i + 1) errors.push(`${packRel}/film.json: series.order must be ${i + 1}`);
      register(film, packRel, "series-episode", { id: sid, json: sj, rel: sRel }, dirName);
    });
    const prod = sj.productionOrder;
    if (prod !== undefined) {
      if (!Array.isArray(prod)) errors.push(`${sctx}: productionOrder must be an array`);
      else {
        if (prod.length !== sj.episodes.length) errors.push(`${sctx}: productionOrder must list every episode`);
        const set = new Set(prod);
        if (set.size !== prod.length) errors.push(`${sctx}: productionOrder has duplicates`);
        for (const d of prod) if (!listed.has(d)) errors.push(`${sctx}: productionOrder contains unknown episode "${d}"`);
      }
    }
    series.push({ id: sid, rel: sRel, abs: join(root, sRel), json: sj, ctx: sctx });
  }

  // folders not in catalog
  const singlesRoot = join(root, "singles");
  if (isDir(singlesRoot)) {
    for (const ent of readdirSync(singlesRoot, { withFileTypes: true })) {
      if (ent.isDirectory() && !singles.includes(ent.name)) {
        errors.push(`singles/${ent.name}: folder is not listed in catalog.json.singles`);
      }
    }
  }
  const seriesRoot = join(root, "series");
  if (isDir(seriesRoot)) {
    for (const ent of readdirSync(seriesRoot, { withFileTypes: true })) {
      if (ent.isDirectory() && !seriesIds.includes(ent.name)) {
        errors.push(`series/${ent.name}: folder is not listed in catalog.json.series`);
      }
    }
  }

  return { catalog, films, series, errors, warnings };
}

export function validateFilm(film, ctx, errors, warnings) {
  const { packRel, kind, seriesRef } = ctx;
  const err = (m) => errors.push(`${packRel}/film.json: ${m}`);
  const warn = (m) => warnings.push(`${packRel}/film.json: ${m}`);
  if (!film || typeof film !== "object") { err("not an object"); return; }
  if (film.schemaVersion !== 1) err("schemaVersion must be 1");
  if (typeof film.id !== "string" || !ID_RE.test(film.id)) err("id must match ^[a-z][a-z0-9-]*$");
  if (typeof film.title !== "string" || !film.title.trim()) err("title is required");
  if (film.composition === undefined || !COMPOSITION_RE.test(film.composition)) err("composition must be PascalCase");
  if (typeof film.entry !== "string" || !/^src\/.+\.tsx$/.test(film.entry)) err("entry must be src/*.tsx");
  if (!film.exports || typeof film.exports !== "object") err("exports is required");
  else for (const k of ["component", "total", "fps"]) {
    if (!EXPORT_RE.test(film.exports[k] || "")) err(`exports.${k} must be an identifier`);
  }
  for (const k of ["width", "height", "fps"]) {
    if (!Number.isInteger(film[k]) || film[k] <= 0) err(`${k} must be a positive integer`);
  }
  if (typeof film.prefix !== "string" || !PREFIX_RE.test(film.prefix)) err("prefix must match ^[a-z][a-z0-9-]*$");
  if (!STATUSES.has(film.status)) err("status must be draft|ready|published|retired");
  if (!ASSET_STATUSES.has(film.assetsStatus)) err("assetsStatus must be complete|incomplete");
  if (film.composition && RESERVED_COMPOSITIONS.has(film.composition)) err(`composition collides with an engine demo: ${film.composition}`);
  if (film.status === "published" && !(film.bili && film.bili.bv)) err("published film must carry bili.bv");
  if (film.bili && film.bili.bv != null && !/^BV[0-9A-Za-z]{10}$/.test(film.bili.bv)) err("bili.bv must look like BV1xxxxxxxxx");
  if (film.kind !== kind) err(`kind must be "${kind}"`);
  if (kind === "single") {
    if (film.series != null) err("single film must not carry series");
  } else {
    if (!film.series || film.series.id !== seriesRef.id) err(`series.id must be "${seriesRef.id}"`);
  }

  if (film.paper !== null && film.paper !== undefined) {
    for (const k of ["title", "venue"]) if (typeof film.paper[k] !== "string" || !film.paper[k]) err(`paper.${k} is required`);
    if (!Array.isArray(film.paper.authors) || film.paper.authors.length === 0) err("paper.authors must be a non-empty array");
    if (!Number.isInteger(film.paper.year)) err("paper.year must be an integer");
  }
  if (film.claims !== null && film.claims !== undefined) {
    for (const k of ["ledger", "paper"]) {
      if (relSafe(film.claims[k], `claims.${k}`, errors)) {
        if (!film.claims[k].startsWith("data/")) err(`claims.${k} must live under data/`);
      }
    }
  }
  if (!Array.isArray(film.derive)) err("derive must be an array");
  else film.derive.forEach((d, i) => {
    if (!d || typeof d.command !== "string" || !d.command.trim()) err(`derive[${i}].command is required`);
    if (d && d.outputs !== undefined && !Array.isArray(d.outputs)) err(`derive[${i}].outputs must be an array`);
  });
  if (!Array.isArray(film.derived)) err("derived must be an array");
  else film.derived.forEach((p, i) => {
    if (relSafe(p, `derived[${i}]`, errors) && !p.startsWith("data/")) {
      err(`derived[${i}] must live under data/`);
    }
  });
  if (film.narration !== null && film.narration !== undefined) {
    if (relSafe(film.narration, "narration", errors) && !film.narration.startsWith("assets/audio/")) {
      err("narration must live under assets/audio/");
    }
  }
  if (!film.audio || typeof film.audio !== "object") err("audio is required");
  else if (film.audio.music != null && relSafe(film.audio.music, "audio.music", errors)) {
    if (!film.audio.music.startsWith("assets/audio/")) err("audio.music must live under assets/audio/");
  }
  if (relSafe(film.delivery, "delivery", errors) && film.delivery !== "delivery") err('delivery must be "delivery"');
  if (!Array.isArray(film.docs)) err("docs must be an array");
  else film.docs.forEach((d, i) => relSafe(d, `docs[${i}]`, errors));

  const paths = film.paths;
  if (!paths || typeof paths !== "object") err("paths is required");
  else {
    if (paths.src !== "src") err('paths.src must be "src"');
    if (paths.data !== "data") err('paths.data must be "data"');
    if (paths.public !== "assets/public") err('paths.public must be "assets/public"');
  }
  const allowed = new Set(["schemaVersion","id","kind","title","composition","entry","exports","width","height","fps","prefix","status","paper","claims","derive","derived","derivedNote","narration","audio","delivery","docs","bili","assetsStatus","paths","series","notes"]);
  for (const k of Object.keys(film)) if (!allowed.has(k)) warn(`unknown field "${k}"`);
}

// ---------- physical checks ----------

export function checkPack(filmEntry, root, errors, warnings) {
  const { packAbs, packRel, film } = filmEntry;
  const err = (m) => errors.push(`${packRel}: ${m}`);
  const need = (p, label, optional = false) => {
    if (!p) return;
    if (!existsSync(join(packAbs, p))) {
      if (!optional) err(`${label} is missing: ${p}`);
      return false;
    }
    return true;
  };
  const entry = film.entry;
  need(entry, "entry");
  if (entry && isFile(join(packAbs, entry))) {
    const text = readFileSync(join(packAbs, entry), "utf8");
    for (const [key, name] of Object.entries(film.exports || {})) {
      const re = new RegExp(`export\\s+(?:const|function|class|\\{[^}]*\\b)\\s*${name}\\b|export\\s*\\{[^}]*\\b${name}\\b`);
      if (!re.test(text)) {
        // re-exports may live in another module; only warn here
        warnings.push(`${packRel}: ${key} "${name}" not found in ${entry} (may be re-exported)`);
      }
    }
  }
  need("data", "data dir");
  need("assets/public", "assets/public", true);
  need("delivery", "delivery");
  for (const d of film.docs || []) need(d, "docs file");
  if (film.narration) need(film.narration, "narration");
  if (film.claims) for (const k of ["ledger", "paper"]) need(film.claims[k], `claims.${k}`);
  for (const d of film.derive || []) {
    if (d.outputs) for (const o of d.outputs) relSafe(o, "derive.output", errors);
  }

  // derived must not be tracked and must be ignored
  const tracked = gitTracked(root, (film.derived || []).map((p) => `${packRel}/${p}`));
  if (tracked.length) {
    for (const t of tracked) err(`derived file is tracked in git: ${t} (derived outputs must not be committed)`);
  } else if (isGitRepo(root)) {
    for (const p of film.derived || []) {
      const ignored = gitIgnored(root, `${packRel}/${p}`);
      if (ignored === false) err(`derived file is not gitignored: ${p}`);
    }
  }

  // delivery must not track mp4
  if (isGitRepo(root)) {
    const mp4 = git(root, ["ls-files", "-z", "--", `${packRel}/delivery`]).stdout.split("\0").filter((f) => f.endsWith(".mp4"));
    if (mp4.length) err(`delivery mp4 must not be committed: ${mp4[0]}`);
  }

  // staticFile namespace + data imports
  const ownId = film.id;
  const seriesPrefix = filmEntry.series ? `series/${filmEntry.series.id}/` : null;
  for (const file of listFiles(join(packAbs, "src"), [".ts", ".tsx"])) {
    const text = readFileSync(file, "utf8");
    const rel = relative(packAbs, file);
    for (const m of text.matchAll(/staticFile\(\s*["']([^"']+)["']/g)) {
      const target = m[1];
      const ok = target.startsWith(`${ownId}/`) || (seriesPrefix && target.startsWith(seriesPrefix));
      if (!ok) err(`${rel}: staticFile("${target}") is outside public/${ownId}/ (or series shared)`);
    }
    for (const m of text.matchAll(/from\s+["']((?:\.\.\/)+)data\/([^"']+)["']/g)) {
      const rest = m[2];
      const ok = rest === ownId || rest.startsWith(`${ownId}/`) ||
        (seriesPrefix && rest.startsWith(`series/${filmEntry.series.id}/`));
      if (!ok) err(`${rel}: imports data/${rest}, which is not this pack's data/${ownId}/`);
    }
  }
}

export function checkCatalogConsistency(catalogResult, root, errors) {
  const films = catalogResult.films;
  for (const f of films) {
    if (f.series && f.series.json.episodes[f.film.series.order - 1] !== f.episodeDir) {
      errors.push(`${f.packRel}: series.order does not match series.json.episodes order`);
    }
  }
  // series shared dirs must exist if referenced by staticFile/imports? just warn empty
  for (const s of catalogResult.series) {
    if (!isDir(join(s.abs, "shared"))) {
      errors.push(`${s.rel}: shared/ is missing (create shared/{src,data,public} even if empty)`);
    } else {
      for (const d of ["src", "data", "public"]) {
        if (!isDir(join(s.abs, "shared", d))) errors.push(`${s.rel}: shared/${d} is missing`);
      }
    }
  }
}

export function checkRepo(root = REPO_ROOT) {
  const catalogResult = loadCatalog(root);
  const errors = [...catalogResult.errors];
  const warnings = [...catalogResult.warnings];
  if (catalogResult.catalog) {
    for (const f of catalogResult.films) checkPack(f, root, errors, warnings);
    checkCatalogConsistency(catalogResult, root, errors);
  }
  // root files
  for (const f of ["README.md", "CONVENTIONS.md", "catalog.json"]) {
    if (!isFile(join(root, f))) errors.push(`root file missing: ${f}`);
  }
  return { ...catalogResult, errors, warnings };
}

export function formatErrors(errors) {
  return errors.map((e) => "  ✗ " + e).join("\n");
}

export function packFiles(filmEntry, sub) {
  return listFiles(join(filmEntry.packAbs, sub));
}
