#!/usr/bin/env python3
"""Derive data/impute.json for episode 02 from the ts-base evidence outputs.

Everything on screen is recomputed here from the exported close series, using the
same key/mask/fill semantics as app/Ch02ImputeEvidence.hs, and then cross-checked
against summary.json. Any disagreement aborts the build.
"""
from __future__ import annotations

import json
import math
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = Path("/root/ts-base/data/episodes/02-missing-values-three-ways")
OUT = ROOT / "data" / "impute.json"
SEED = 42


M64 = 1 << 64
P31 = 2147483647


def wrap64(v: int) -> int:
    """Haskell Int is a wrapping 64-bit integer; reproduce that, not Python bigints."""
    v &= M64 - 1
    return v - M64 if v >= (1 << 63) else v


def key(seed: int, i: int) -> int:
    x0 = seed * 1103515245 + i * 12345
    x1 = wrap64(x0 * 1103515245 + 12345) % P31
    x2 = wrap64(x1 * 1103515245 + 12345) % P31
    return abs(x2)


def mask_by_key(k: int, n: int) -> list[int]:
    interior = list(range(1, n - 1))
    interior.sort(key=lambda i: key(SEED, i))
    return sorted(interior[:k])


def spaced_mask(k: int, n: int) -> list[int]:
    interior = sorted(range(1, n - 1), key=lambda i: key(SEED, i))
    acc: list[int] = []
    for i in interior:
        if len(acc) >= k:
            break
        if any(abs(i - j) <= 1 for j in acc):
            continue
        acc.append(i)
    return sorted(acc)


def doublet_mask(blocks: int, n: int) -> list[int]:
    interior = sorted(range(1, n - 1), key=lambda i: key(SEED, i))
    acc: list[int] = []
    for i in interior:
        if len(acc) >= blocks:
            break
        if any(abs(i - j) <= 2 for j in acc):
            continue
        acc.append(i)
    return sorted(x for i in acc for x in (i, i + 1))


def pop_var(xs: list[float]) -> float:
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)


def returns(closes: list[float]) -> list[float]:
    return [math.log(b / a) for a, b in zip(closes, closes[1:])]


def fill_locf(xs: list[float | None]) -> list[float]:
    # bidirectional: first observed value back-fills the leading gap, then forward.
    first = next((x for x in xs if x is not None), None)
    if first is None:
        raise ValueError("locf: all missing")
    out: list[float] = []
    last = first
    for x in xs:
        if x is None:
            out.append(last)
        else:
            last = x
            out.append(x)
    return out


def fill_locf_forward(xs: list[float | None]) -> list[float]:
    out: list[float] = []
    last = None
    for x in xs:
        if x is None:
            if last is None:
                raise ValueError("locfForward: leading missing")
            out.append(last)
        else:
            last = x
            out.append(x)
    return out


def fill_mean(xs: list[float | None]) -> list[float]:
    obs = [x for x in xs if x is not None]
    if not obs:
        raise ValueError("statimp: all missing")
    m = sum(obs) / len(obs)
    return [m if x is None else x for x in xs]


def fill_median(xs: list[float | None]) -> list[float]:
    obs = [x for x in xs if x is not None]
    if not obs:
        raise ValueError("statimp: all missing")
    m = statistics.median(obs)
    return [m if x is None else x for x in xs]


def fill_linear(xs: list[float | None]) -> list[float]:
    if not xs or xs[0] is None or xs[-1] is None:
        raise ValueError("lininterp: endpoint missing")
    out = list(xs)
    prev = 0
    for i in range(1, len(out)):
        if out[i] is None:
            continue
        if i - prev > 1:
            a, b = out[prev], out[i]
            for j in range(prev + 1, i):
                out[j] = a + (b - a) * (j - prev) / (i - prev)
        prev = i
    return [x for x in out]  # type: ignore[misc]


def mae_at(mask: list[int], truth: list[float], filled: list[float]) -> float:
    return sum(abs(filled[i] - truth[i]) for i in mask) / len(mask)


def runs_of(ix: list[int]) -> int:
    if not ix:
        return 0
    return 1 + sum(1 for a, b in zip(ix, ix[1:]) if b != a + 1)


def read_bars(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as f:
        header = f.readline().rstrip("\n").split(",")
        for line in f:
            parts = line.rstrip("\n").split(",")
            rec = dict(zip(header, parts))
            rows.append({"date": rec["date"], "close": float(rec["close_qfq"])})
    return rows


def max_gap(rows: list[dict]) -> tuple[int, str]:
    from datetime import date

    def d(s: str) -> date:
        y, m, dd = s.split("-")
        return date(int(y), int(m), int(dd))

    best = (0, "")
    for a, b in zip(rows, rows[1:]):
        g = (d(b["date"]) - d(a["date"])).days
        if g > best[0]:
            best = (g, a["date"])
    return best


def ok(name: str, got, want, tol: float = 1e-9) -> None:
    good = abs(float(got) - float(want)) <= tol * max(1.0, abs(float(want)))
    if not good:
        sys.exit("generate_impute_data: FAIL — " + name + ": got " + repr(got) + " want " + repr(want))
    print("  ok " + name)


def main() -> None:
    bars = read_bars(SRC / "sh600519.csv")
    susp = read_bars(SRC / "sz000693.csv")
    dates = [b["date"] for b in bars]
    closes = [b["close"] for b in bars]
    nP = len(closes)
    rets = returns(closes)
    nR = len(rets)
    k5 = round(0.05 * nR)
    k20 = round(0.20 * nR)

    # level masks (price fills) and return masks (return fills)
    lix5 = mask_by_key(k5, nP)
    lix20 = mask_by_key(k20, nP)
    rix5 = mask_by_key(k5, nR)
    rix20 = mask_by_key(k20, nR)

    def masked(xs: list[float], ix: list[int]) -> list[float | None]:
        s = set(ix)
        return [None if i in s else x for i, x in enumerate(xs)]

    lMask5 = masked(closes, lix5)
    lMask20 = masked(closes, lix20)
    rMask5 = masked(rets, rix5)
    rMask20 = masked(rets, rix20)

    # variance identity (return level)
    meanR5 = fill_mean(rMask5)
    meanR20 = fill_mean(rMask20)
    medR5 = fill_median(rMask5)
    obs5 = [rets[i] for i in range(nR) if i not in set(rix5)]
    obs20 = [rets[i] for i in range(nR) if i not in set(rix20)]
    varObs5 = pop_var(obs5)
    varObs20 = pop_var(obs20)
    varImp5 = pop_var(meanR5)
    varImp20 = pop_var(meanR20)
    varMed5 = pop_var(medR5)
    p5 = k5 / nR
    p20 = k20 / nR
    pred5 = (1 - p5) * varObs5
    pred20 = (1 - p20) * varObs20

    # price-level fills
    meanL5 = fill_mean(lMask5)
    meanL20 = fill_mean(lMask20)
    locfL5 = fill_locf(lMask5)
    locfL20 = fill_locf(lMask20)
    locfFwd5 = fill_locf_forward(lMask5)
    lerpL5 = fill_linear(lMask5)
    lerpL20 = fill_linear(lMask20)
    maePrice = {
        "p5": {
            "linear": mae_at(lix5, closes, lerpL5),
            "mean": mae_at(lix5, closes, meanL5),
            "locf": mae_at(lix5, closes, locfL5),
            "locfForward": mae_at(lix5, closes, locfFwd5),
        },
        "p20": {
            "linear": mae_at(lix20, closes, lerpL20),
            "mean": mae_at(lix20, closes, meanL20),
            "locf": mae_at(lix20, closes, locfL20),
        },
    }

    # return-level fills (for the "returns lie" card)
    maeRet = {
        "p5": {
            "linear": mae_at(rix5, rets, fill_linear(rMask5)),
            "locf": mae_at(rix5, rets, fill_locf(rMask5)),
            "mean": mae_at(rix5, rets, fill_mean(rMask5)),
        },
        "p20": {
            "linear": mae_at(rix20, rets, fill_linear(rMask20)),
            "locf": mae_at(rix20, rets, fill_locf(rMask20)),
            "mean": mae_at(rix20, rets, fill_mean(rMask20)),
        },
    }

    # LOCF layouts on price levels
    layouts = {}
    for name, ix in (("single", spaced_mask(k5, nP)), ("doublet", doublet_mask(k5 // 2, nP))):
        rows_l = masked(closes, ix)
        filled = fill_locf(rows_l)
        fr = returns(filled)
        layouts[name] = {
            "masked": len(ix),
            "runs": runs_of(ix),
            "zeros": sum(1 for x in fr if x == 0.0),
            "levelMae": mae_at(ix, closes, filled),
            "varReturns": pop_var(fr),
            "maxJump": max(abs(x) for x in fr),
        }

    origZeros = sum(1 for x in rets if x == 0.0)
    frSingle = returns(fill_locf(masked(closes, spaced_mask(k5, nP))))
    zeroRun = 0
    bestRun = 0
    for x in frSingle:
        zeroRun = zeroRun + 1 if x == 0.0 else 0
        bestRun = max(bestRun, zeroRun)

    # suspension evidence
    gapDays, gapFrom = max_gap(susp)
    from datetime import date

    def d(s: str) -> date:
        y, m, dd = s.split("-")
        return date(int(y), int(m), int(dd))

    segs = []
    start = 0
    for i in range(1, len(susp)):
        if (d(susp[i]["date"]) - d(susp[i - 1]["date"])).days > 30:
            segs.append({"from": susp[start]["date"], "to": susp[i - 1]["date"], "rows": i - start})
            start = i
    segs.append({"from": susp[start]["date"], "to": susp[-1]["date"], "rows": len(susp) - start})

    # display window: p5 masked level point closest to the 2008 crash, +-45 rows
    anchor = min(lix5, key=lambda i: abs(i - 1750))
    lo, hi = max(0, anchor - 45), min(nP, anchor + 46)
    win = {
        "index": anchor,
        "from": dates[lo],
        "to": dates[hi - 1],
        "dates": dates[lo:hi],
        "closes": closes[lo:hi],
        "mean": meanL5[lo:hi],
        "locf": locfL5[lo:hi],
        "linear": lerpL5[lo:hi],
        "maskedLocal": [i - lo for i in lix5 if lo <= i < hi],
    }
    # 20% window: same anchor
    win20 = {
        "index": anchor,
        "from": dates[lo],
        "to": dates[hi - 1],
        "dates": dates[lo:hi],
        "closes": closes[lo:hi],
        "mean": meanL20[lo:hi],
        "locf": locfL20[lo:hi],
        "linear": lerpL20[lo:hi],
        "maskedLocal": [i - lo for i in lix20 if lo <= i < hi],
    }
    # yearly MAE growth for 20% (screen numbers): split into 5 equal blocks
    blocks = []
    step = nP // 5
    for b in range(5):
        idx = [i for i in lix20 if b * step <= i < (b + 1) * step]
        if idx:
            blocks.append({
                "from": dates[b * step],
                "to": dates[min(nP - 1, (b + 1) * step - 1)],
                "masked": len(idx),
                "meanMae": mae_at(idx, closes, meanL20),
                "linearMae": mae_at(idx, closes, lerpL20),
                "locfMae": mae_at(idx, closes, locfL20),
            })
    # returns aggregate for the lie card
    bothZeros = {
        "orig": origZeros,
        "single": layouts["single"]["zeros"],
        "doublet": layouts["doublet"]["zeros"],
        "added": layouts["single"]["zeros"] - origZeros,
        "maxRun": bestRun,
    }
    # golden examples (small, static, for the definition scene)
    golden = {
        "series": [1.0, None, None, 4.0],
        "locf": fill_locf([1.0, None, None, 4.0]),
        "locfForwardError": "leading missing rejected",
        "linear": fill_linear([1.0, None, None, 4.0]),
        "mean": fill_mean([1.0, None, None, 4.0]),
        "median": fill_median([1.0, None, None, 4.0]),
        "pair": {"series": [10.0, None, 20.0], "linear": fill_linear([10.0, None, 20.0])},
    }
    summary = json.loads((SRC / "summary.json").read_text(encoding="utf-8"))
    manifest = json.loads((SRC / "missing.manifest.json").read_text(encoding="utf-8"))
    entry = [f for f in manifest["files"] if f["path"] == "sh600519.csv"][0]

    ok("p5 masked", k5, summary["returns"]["p5_masked"], 1e-12)
    ok("p20 masked", k20, summary["returns"]["p20_masked"], 1e-12)
    ok("price mae linear p5", maePrice["p5"]["linear"], summary["mae_price"]["p5"]["linear"], 1e-11)
    ok("price mae mean p5", maePrice["p5"]["mean"], summary["mae_price"]["p5"]["mean"], 1e-11)
    ok("price mae locf p5", maePrice["p5"]["locf"], summary["mae_price"]["p5"]["locf"], 1e-11)
    ok("price mae linear p20", maePrice["p20"]["linear"], summary["mae_price"]["p20"]["linear"], 1e-11)
    ok("price mae mean p20", maePrice["p20"]["mean"], summary["mae_price"]["p20"]["mean"], 1e-11)
    ok("price mae locf p20", maePrice["p20"]["locf"], summary["mae_price"]["p20"]["locf"], 1e-11)
    ok("var obs p5", varObs5, summary["variance_identity"]["p5"]["var_obs"], 1e-11)
    ok("var imp p5", varImp5, summary["variance_identity"]["p5"]["var_imputed"], 1e-11)
    ok("median var p5", varMed5, summary["variance_identity"]["median_var_p5"], 1e-11)
    ok("var obs p20", varObs20, summary["variance_identity"]["p20"]["var_obs"], 1e-11)
    ok("var imp p20", varImp20, summary["variance_identity"]["p20"]["var_imputed"], 1e-11)
    for name in ("single", "doublet"):
        got = layouts[name]
        want = [x for x in summary["locf_layout"] if x["name"] == name][0]
        for f in ("masked", "runs", "zero_returns", "level_mae", "var_returns", "max_jump"):
            key_dst = {"masked": "masked", "runs": "runs", "zero_returns": "zeros", "level_mae": "levelMae",
                       "var_returns": "varReturns", "max_jump": "maxJump"}[f]
            ok(name + " " + f, got[key_dst], want[f], 1e-11)
    ok("orig zeros", origZeros, 35, 1e-12)
    ok("susp rows", len(susp), summary["suspension"]["rows"], 1e-12)
    ok("susp gap days", gapDays, summary["suspension"]["max_gap_days"], 1e-12)
    ok("sh600519 rows", nP, summary["data"]["rows"], 1e-12)
    if varMed5 < varImp5:
        sys.exit("generate_impute_data: FAIL — median variance below mean variance")

    payload = {
        "meta": {
            "episode": 2,
            "bookPages": "p.16-17",
            "tsBaseCommit": "0b5175f",
            "evidenceRunAt": "2026-10-30T11:27:19Z",
            "command": "cabal run -v0 tsbase -- evidence-ch02-impute --data data/episodes/02-missing-values-three-ways --out data/episodes/02-missing-values-three-ways --evidence inventory/evidence",
            "tests": summary["tests"],
            "checks": summary["checks"],
            "evidencePath": "inventory/evidence/ch2-locf/20261030T112719-ch2-locf.json",
            "seed": SEED,
        },
        "data": {
            "path": "data/episodes/02-missing-values-three-ways/sh600519.csv",
            "rows": nP,
            "codes": manifest.get("codes", 3),
            "first": dates[0],
            "last": dates[-1],
            "sha256": entry["sha256"],
            "bytes": entry["bytes"],
        },
        "returns": {"n": nR, "p5": {"masked": k5, "pActual": p5}, "p20": {"masked": k20, "pActual": p20}},
        "variance": {
            "p5": {"obs": varObs5, "imputed": varImp5, "predicted": pred5, "relErr": abs(varImp5 - pred5) / pred5,
                   "median": varMed5, "lossPct": 1 - varImp5 / varObs5},
            "p20": {"obs": varObs20, "imputed": varImp20, "predicted": pred20, "relErr": abs(varImp20 - pred20) / pred20,
                    "lossPct": 1 - varImp20 / varObs20},
        },
        "maePrice": maePrice,
        "maeReturns": maeRet,
        "locf": {"single": layouts["single"], "doublet": layouts["doublet"]},
        "zeros": bothZeros,
        "suspension": {"code": "sz000693", "rows": len(susp), "gapDays": gapDays, "gapFrom": gapFrom,
                       "first": susp[0]["date"], "last": susp[-1]["date"], "segments": segs},
        "masks": {"p5": sorted(rix5), "p20": sorted(rix20), "n": nR},
        "window": win,
        "window20": win20,
        "blocks20": blocks,
        "golden": golden,
        "manifest": {
            "totalBytes": sum(x["bytes"] for x in manifest["files"]),
            "files": [
                {"code": x["code"], "rows": x["rows"], "first": x["first"], "last": x["last"],
                 "gapDays": x["max_gap_days"], "gapAt": x["max_gap_at"], "bytes": x["bytes"], "sha256": x["sha256"]}
                for x in manifest["files"]
            ],
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("wrote " + str(OUT) + " (" + str(OUT.stat().st_size) + " bytes)")
    print("  p5 masked=" + str(k5) + " p20 masked=" + str(k20) + " price mae p5 mean=" + format(maePrice["p5"]["mean"], ".6f"))


if __name__ == "__main__":
    main()