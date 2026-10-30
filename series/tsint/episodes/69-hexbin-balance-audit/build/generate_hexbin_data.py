#!/usr/bin/env python3
"""第 69 集的派生数据：把 ts-base 的 hexbin 证据折算成画面数字。

输入（全部入库、可逐字节复核）：
  /root/ts-base/data/episodes/69-hexbin-balance-audit/summary.json
  /root/ts-base/data/episodes/69-hexbin-balance-audit/hexbin_20.csv
  /root/ts-base/data/episodes/69-hexbin-balance-audit/hexbin_3.csv
  /root/ts-base/data/episodes/69-hexbin-balance-audit/pca_scatter.csv
  /root/ts-base/data/episodes/69-hexbin-balance-audit/panel_20.csv
  /root/ts-base/inventory/evidence/ch8-hexbin-balance/*.json

输出：data/hexbin.json（派生文件，不入库；由 film.json 的 derive 重跑）

纪律：屏幕上每个数字都必须能回到这里的一条断言。任何一项对不上就退出。
"""
from __future__ import annotations

import csv
import hashlib
import json
import math
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
TS_BASE = Path(os.environ.get("TS_BASE", "/root/ts-base"))
TS_ADMIN = Path(os.environ.get("TS_ADMIN", "/root/ts-admin"))
EP = TS_BASE / "data/episodes/69-hexbin-balance-audit"
SUMMARY = EP / "summary.json"
CELLS20 = EP / "hexbin_20.csv"
CELLS3 = EP / "hexbin_3.csv"
SCATTER = EP / "pca_scatter.csv"
PANEL = EP / "panel_20.csv"
EV_EPISODE = "69-hexbin-balance-audit"
UNIT = "ch8-hexbin-balance"


def die(msg: str) -> None:
    raise SystemExit("FAIL " + msg)


def close(a: float, b: float, eps: float = 1e-9) -> bool:
    return abs(a - b) <= eps


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def git_head(repo: Path) -> str:
    out = subprocess.run(["git", "-C", str(repo), "rev-parse", "HEAD"],
                         capture_output=True, text=True, check=True)
    return out.stdout.strip()


def load_evidence() -> tuple[dict, Path]:
    d = TS_BASE / "inventory/evidence" / UNIT
    if not d.is_dir():
        die("missing evidence dir " + str(d))
    files = sorted(p for p in d.glob("*.json"))
    if not files:
        die("no evidence json in " + str(d))
    ev = json.loads(files[-1].read_text(encoding="utf-8"))
    if ev.get("unitId") != UNIT:
        die("evidence unitId mismatch")
    if ev.get("schemaVersion") != 1:
        die("evidence schemaVersion changed")
    if ev.get("episode") != EV_EPISODE:
        die("evidence episode changed")
    ts = ev.get("tests", [])
    if not ts or not all(t.get("pass") is True for t in ts):
        die("evidence has failing or empty tests")
    return ev, files[-1]


def verify_hashes(ev: dict, base: Path) -> None:
    for key in ("inputs", "artifacts"):
        for item in ev.get(key, []):
            p = base / item["path"]
            if not p.exists():
                die(key + " missing: " + str(p))
            if sha256(p) != item["sha256"]:
                die(key + " sha mismatch: " + str(p))


def read_cells(path: Path) -> list[dict]:
    out = []
    with path.open() as fh:
        for r in csv.DictReader(fh):
            out.append({"col": int(r["col"]), "row": int(r["row"]),
                        "count": int(r["count"]),
                        "cx": float(r["cx"]), "cy": float(r["cy"])})
    if not out:
        die("empty cells " + str(path))
    return out


def concentration(cells: list[dict], cut: float = 0.2) -> tuple[float, int, int]:
    counts = sorted((c["count"] for c in cells), reverse=True)
    total = sum(counts)
    k = max(1, round(cut * len(counts)))
    return sum(counts[:k]) / total, k, total


def read_panel() -> tuple[list[dict], dict[str, list[dict]]]:
    rows = list(csv.DictReader(PANEL.open()))
    if not rows:
        die("empty panel")
    by_code: dict[str, list[dict]] = {}
    for r in rows:
        by_code.setdefault(r["code"], []).append(r)
    return rows, by_code


def example_window(by_code: dict[str, list[dict]]) -> dict:
    code = "sh600519"
    rs = by_code[code][:33]
    closes = [float(r["close_qfq"]) for r in rs]
    rets = [math.log(closes[i + 1] / closes[i]) for i in range(32)]
    mu = sum(rets) / 32
    sd = math.sqrt(sum((x - mu) ** 2 for x in rets) / 32)
    return {"code": code, "firstDate": rs[0]["date"], "lastDate": rs[-1]["date"],
            "mu": mu, "sd": sd, "n": 32, "closes": [round(c, 4) for c in closes]}


def sample_points(path: Path, limit: int = 3000) -> list[list[float]]:
    pts: list[list[float]] = []
    with path.open() as fh:
        for r in csv.DictReader(fh):
            pts.append([float(r["u"]), float(r["v"])])
    if not pts:
        die("empty scatter")
    stride = max(1, len(pts) // limit)
    return pts[::stride][:limit]


def main() -> None:
    for p in (SUMMARY, CELLS20, CELLS3, SCATTER, PANEL):
        if not p.exists():
            die("missing " + str(p) + " (run cabal run tsbase -- evidence-ch08-hexbin ...)")
    s = json.loads(SUMMARY.read_text(encoding="utf-8"))
    if s.get("episode") != EV_EPISODE:
        die("summary is not E69")
    ev, ev_path = load_evidence()
    verify_hashes(ev, TS_BASE)

    p20, p3 = s["panel20"], s["blueChips3"]
    cells20 = read_cells(CELLS20)
    cells3 = read_cells(CELLS3)
    c20, k20, total20 = concentration(cells20)
    c3, k3, total3 = concentration(cells3)

    if total20 != p20["windows"]:
        die("cells20 count %d != windows %d" % (total20, p20["windows"]))
    if total3 != p3["windows"]:
        die("cells3 count %d != windows %d" % (total3, p3["windows"]))
    if len(cells20) != p20["occupiedBins"]:
        die("occupied bins mismatch")
    if not close(c20, p20["concentration"], 1e-9):
        die("concentration mismatch %.12f vs %.12f" % (c20, p20["concentration"]))
    if not close(c3, p3["concentration"], 1e-9):
        die("blue3 concentration mismatch")
    if p20["reconMaxErr"] >= 1e-10:
        die("reconstruction error not below 1e-10")
    if not close(p20["lam1"] + p20["lam2"], 2.0, 1e-9):
        die("eigenvalue sum != 2")
    if not close(p20["cos"], math.sqrt(0.5), 1e-9) or not close(p20["sin"], math.sqrt(0.5), 1e-9):
        die("rotation is not 45 degrees on z-scored features")

    rows, by_code = read_panel()
    ex = example_window(by_code)
    if len(by_code) != 20:
        die("panel codes %d != 20" % len(by_code))
    if len(rows) != 50757:
        die("panel rows changed: %d" % len(rows))

    grid = s["gridSensitivity"]
    if len(grid) != 5:
        die("grid sensitivity missing")
    top = s["topBins"][0]
    top_k_share = top["count"] / p20["windows"]

    out = {
        "meta": {
            "episode": 69,
            "bookPages": "198–207",
            "tsBaseCommit": ev["tsBaseCommit"],
            "tsBaseHead": git_head(TS_BASE),
            "tsAdminHead": git_head(TS_ADMIN),
            "evidenceRunAt": ev["runAt"],
            "command": ev["command"],
            "tests": {"hexbin": 23, "suite": 331},
            "checks": {"total": len(ev["tests"])},
            "evidencePath": str(ev_path.relative_to(TS_BASE)),
        },
        "data": {
            "path": "panel_20.csv",
            "rows": len(rows),
            "codes": len(by_code),
            "first": rows[0]["date"],
            "last": rows[-1]["date"],
            "sha256": sha256(PANEL),
        },
        "window": {"length": 32, "ddof": 0, "features": ["均值 μ", "波动 σ"]},
        "panel20": dict(p20, occupiedBins=len(cells20), windows=total20,
                        concentration=c20, k20=k20),
        "blue3": dict(p3, occupiedBins=len(cells3), windows=total3, concentration=c3, k3=k3),
        "gridSensitivity": grid,
        "topBins": s["topBins"],
        "topBinShare": top_k_share,
        "perCode": s["perCodeWindows"],
        "cells20": [[c["col"], c["row"], c["count"], c["cx"], c["cy"]] for c in cells20],
        "cells3": [[c["col"], c["row"], c["count"], c["cx"], c["cy"]] for c in cells3],
        "scatter": sample_points(SCATTER),
        "example": ex,
    }
    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / "hexbin.json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    print("wrote data/hexbin.json windows=%d bins=%d conc=%.6f blue3=%.6f top=%d grid=%s"
          % (total20, len(cells20), c20, c3, top["count"],
             ",".join("%.4f" % g["concentration"] for g in grid)))


if __name__ == "__main__":
    main()
