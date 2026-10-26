#!/usr/bin/env bash
# Content-repo verification. Cheap gates first; optional engine mount check via VIDEO_ENGINE.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== content:check =="
node tools/check.mjs
echo "== content:status =="
node tools/status.mjs
if [ -n "${VIDEO_ENGINE:-}" ]; then
  echo "== engine:mount-check ($VIDEO_ENGINE) =="
  node "$VIDEO_ENGINE/scripts/films.mjs" check --strict
fi
echo "content verify: ok"
