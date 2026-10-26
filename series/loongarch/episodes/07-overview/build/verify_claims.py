#!/usr/bin/env python3
"""Series-level evidence audit: every claims quote must appear in its paper.

This is a text check, not a chip measurement. It proves the numbers have a
source; it does not prove the episode interpreted them correctly.
"""
import glob
import json
import re
from pathlib import Path

PACK = Path(__file__).resolve().parents[1]
SERIES = PACK.parents[1]
OUT = PACK / "data" / "evidence.json"


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()

rows = []
total = verified = 0
for claims_path in sorted(glob.glob(str(SERIES / "episodes" / "0*" / "data" / "claims.json"))):
    pack = Path(claims_path).parents[1]
    ledger = json.loads(Path(claims_path).read_text(encoding="utf-8"))
    paper_path = pack / "data" / "paper.txt"
    paper = norm(paper_path.read_text(encoding="utf-8")) if paper_path.exists() else ""
    claims = ledger.get("claims", [])
    misses = []
    for c in claims:
        q = norm(c.get("quote", ""))
        if not q or q not in paper:
            misses.append(c.get("id", "?"))
    total += len(claims)
    verified += len(claims) - len(misses)
    rows.append({
        "pack": pack.name,
        "claims": len(claims),
        "verified": len(claims) - len(misses),
        "missing": misses,
    })

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps({
    "episodes": rows,
    "total": total,
    "verified": verified,
    "failed": total - verified,
    "scope": "claims-ledger quotes only; charts and unledgered prose excluded",
    "note": "text containment check, not a chip measurement",
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"evidence: {verified}/{total} claims verified across {len(rows)} episodes")
if total - verified:
    raise SystemExit(1)
