#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DeltaSight (DAC'26) simulator -- deterministic, stdlib only (no numpy).

Produces two JSON files for a paper-reading video:
  sim.json  : patch-level skip/similarity simulation following Eq.(2)(3)(4)
  adc.json  : the Sec.4.2.1 CK-DAC / +/-tau similarity-identification example
              plus a 10-bit SAR conversion of V_IN = 0.751 V.

Determinism: fixed SEED, all floats rounded to 6 decimals, no set/hash
iteration leaks.  Running twice on the same machine yields byte-identical
JSON (verified with md5sum).

Usage:  python3 generate_deltasight_data.py [--out-dir DIR]
"""

import argparse
import json
import math
import os
import random
import sys

# ---------------------------------------------------------------- constants
SEED = 20261115
NDEC = 6

# --- ADC (paper Sec.4.2.1)
NBITS = 10
VREF = 1.0
VIN = 0.751                      # current-frame pixel voltage
PREV_CODE = "1100000000"         # 10-bit previous-frame code -> 0.750 V
TAU_V = 0.005                    # tau ~= 0.5 % VREF = 5 mV
DELTA_V = -0.001                 # V_IN - V_DAC = -1 mV

# --- patch simulation (synthetic, self-test)
PATCH = 16
GRID_H = 6
GRID_W = 8
FRAME_H = GRID_H * PATCH         # 96
FRAME_W = GRID_W * PATCH         # 128
TAU_PX = 5.0                     # pixel-level diff threshold, intensity units
KAPPA_PX = 64                    # block-level COUNT threshold (paper: 60/80 of P^2=256)
THETA2 = 0.5                     # paper gives no value -> placeholder
THETA3 = 0.5                     # paper gives no value -> placeholder
NOISE_AMP = 1.5                  # |F_t-F_t-1| <= 2*amp = 3 < TAU_PX on static bg

# objects: (x, y, w, h) in pixels; "moving" is textured so that the whole
# old-and-new footprint really changes (a flat-colour square would not).
OBJ_MOVING_PREV = (24, 8, 32, 32)
OBJ_MOVING_CUR = (36, 8, 32, 32)   # shifted +12 px in x (> W/3, stays overlapping)
OBJ_APPEAR_CUR = (0, 64, 32, 32)   # absent at t-1
OBJ_DISAPPEAR_PREV = (80, 48, 48, 48)  # gone at t

SENS_TAU = [1, 2, 3, 5, 8, 12, 20]
SENS_KAPPA_PX = [16, 32, 64, 96, 128, 192]


# ---------------------------------------------------------------- helpers
def r6(x):
    """Round to 6 decimals, normalising -0.0 to 0.0."""
    v = float(round(float(x), NDEC))
    return 0.0 if v == 0.0 else v


def round_tree(obj):
    """Recursively round every float in a JSON-able structure."""
    if isinstance(obj, float):
        return r6(obj)
    if isinstance(obj, dict):
        return {k: round_tree(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [round_tree(v) for v in obj]
    return obj


def background_value(x, y):
    return float(96 + x * 0.25 + y * 0.125)


def pattern_value(lx, ly):
    """Deterministic texture in object-local coordinates.

    Object-local (not frame-local) coordinates are essential: a translation
    must really change the pixels, otherwise the overlap of a moving object
    would look unchanged.
    """
    return float(40 + ((lx * 37 + ly * 53) % 160))


# ---------------------------------------------------------------- ADC part
def cdac_weights(nbits=NBITS, vref=VREF):
    """Bit weights 2^-1 .. 2^-nbits, MSB first."""
    return [vref * (2.0 ** -k) for k in range(1, nbits + 1)]


def code_to_voltage(code, weights):
    return sum(w for bit, w in zip(code, weights) if bit == "1")


def sar_convert(vin, vref, nbits=NBITS):
    """Classic charge-redistribution SAR: try bit, keep if trial <= vin."""
    steps = []
    residual = 0.0
    bits = []
    for k in range(1, nbits + 1):
        w = vref * (2.0 ** -k)
        trial = residual + w
        if trial <= vin:
            bit = 1
            residual = trial
        else:
            bit = 0
        bits.append(str(bit))
        steps.append({
            "k": k,
            "trial_v": trial,
            "bit": bit,
            "residual_v": residual,
            "err_v": vin - residual,
        })
    code = "".join(bits)
    return steps, code, residual


def build_adc():
    weights = cdac_weights()
    vdac = code_to_voltage(PREV_CODE, weights)
    # comparator differential input: paper writes "-V_IN + V_DAC = -1mV"
    delta = vdac - VIN
    assert abs(vdac - 0.75) < 1e-12, vdac
    assert abs(delta - DELTA_V) < 1e-12, delta

    # two successive comparator evaluations with +/- tau injected
    vminus_plus = delta + TAU_V
    vminus_minus = delta - TAU_V
    comp_plus = 1 if vminus_plus > 0 else 0
    comp_minus = 1 if vminus_minus > 0 else 0
    verdict = "similar" if comp_plus != comp_minus else "dissimilar"

    steps, sar_code, sar_value = sar_convert(VIN, VREF, NBITS)
    code_value = code_to_voltage(sar_code, weights)

    sar_steps = []
    for s in steps:
        sar_steps.append({
            "k": s["k"],
            "trial_v": r6(s["trial_v"]),
            "bit": s["bit"],
            "residual_v": r6(s["residual_v"]),
            "err_v": r6(s["err_v"]),
        })

    adc = {
        "meta": {
            "synthetic": True,
            "source": "DAC'26 DeltaSight Sec.4.2.1",
            "nbits": NBITS,
            "vref": r6(VREF),
            "seed": SEED,
            "note": ("自测：按论文 §4.2.1 的算例手算（10-bit、VREF=1V、上帧码 1100000000、"
                     "V_IN=0.751V、tau=5mV）。SAR 部分为同一像素的标准 10 次比较。"),
        },
        "cDAC": {
            "prev_code": PREV_CODE,
            "weights": [r6(w) for w in weights],
            "reconstructed_v": r6(vdac),
            "note": "V_DAC = sum(bit_k * 2^-k * VREF)；前两位为 1 -> 0.5 + 0.25 = 0.750 V",
        },
        "sar": {
            "vin": r6(VIN),
            "steps": sar_steps,
            "code": sar_code,
            "code_value_v": r6(code_value),
            "lsb_v": r6(VREF / (2.0 ** NBITS)),
            "note": ("SAR 逐位试探：trial = residual + 2^-k*VREF，trial<=VIN 则置 1。"
                     "0.751V 量化到 769/1024 = 0.7509765625V。"),
        },
        "similarity": {
            "tau_v": r6(TAU_V),
            "delta_v": r6(delta),
            "vin_minus_vdac_v": r6(VIN - vdac),
            "cases": [
                {"inject": "+tau", "vminus_v": r6(vminus_plus),
                 "comparator": comp_plus, "verdict": "within"},
                {"inject": "-tau", "vminus_v": r6(vminus_minus),
                 "comparator": comp_minus, "verdict": "within"},
            ],
            "verdict": verdict,
            "note": ("V- = -V_IN + V_DAC +/- tau；delta_v = V_DAC - V_IN = -1mV 即比较器负端输入"
                     "（论文原文 -V_IN + V_DAC = -1mV）。+tau: +4mV (>0 -> 1)；-tau: -6mV (<0 -> 0)。"
                     "两次符号相反 => delta 落在 (-5mV,+5mV) 内 => similar，不转换。"),
        },
        "comparison_count": {
            "full_sar": NBITS,
            "similarity_mode": 2,
            "saved": NBITS - 2,
            "note": "相似像素只做 2 次阈值比较，而非 10 次逐位比较，省 8 次。",
        },
    }
    return round_tree(adc)


# ---------------------------------------------------------------- sim part
def draw_noise(rnd):
    return [[rnd.uniform(-NOISE_AMP, NOISE_AMP) for _ in range(FRAME_W)]
            for _ in range(FRAME_H)]


def compose_frame(objects, noise):
    frame = [[background_value(x, y) for x in range(FRAME_W)]
             for y in range(FRAME_H)]
    for (x0, y0, w, h) in objects:
        for ly in range(h):
            y = y0 + ly
            if 0 <= y < FRAME_H:
                row = frame[y]
                for lx in range(w):
                    x = x0 + lx
                    if 0 <= x < FRAME_W:
                        row[x] = pattern_value(lx, ly)
    out = [[0.0] * FRAME_W for _ in range(FRAME_H)]
    for y in range(FRAME_H):
        nrow = noise[y]
        frow = frame[y]
        orow = out[y]
        for x in range(FRAME_W):
            orow[x] = round(frow[x] + nrow[x], 3)
    return out


def object_mask(objects):
    mask = [[False] * FRAME_W for _ in range(FRAME_H)]
    for (x0, y0, w, h) in objects:
        for ly in range(h):
            y = y0 + ly
            if 0 <= y < FRAME_H:
                row = mask[y]
                for lx in range(w):
                    x = x0 + lx
                    if 0 <= x < FRAME_W:
                        row[x] = True
    return mask


def diff_matrix(prev, cur):
    d = [[0.0] * FRAME_W for _ in range(FRAME_H)]
    for y in range(FRAME_H):
        prow, crow, drow = prev[y], cur[y], d[y]
        for x in range(FRAME_W):
            drow[x] = abs(crow[x] - prow[x])
    return d


def patch_counts(d, tau):
    """c_i = #{pixels in patch i with D < tau}  (Eq.3), row-major order."""
    counts = [[0] * GRID_W for _ in range(GRID_H)]
    for pr in range(GRID_H):
        for pc in range(GRID_W):
            c = 0
            for y in range(pr * PATCH, (pr + 1) * PATCH):
                drow = d[y]
                for x in range(pc * PATCH, (pc + 1) * PATCH):
                    if drow[x] < tau:
                        c += 1
            counts[pr][pc] = c
    return counts


def components(similar):
    """4-connected components of the non-similar patch-cell mask."""
    cells = set()
    for pr in range(GRID_H):
        for pc in range(GRID_W):
            if not similar[pr][pc]:
                cells.add((pr, pc))
    regions = []
    seen = set()
    for start in sorted(cells):
        if start in seen:
            continue
        stack = [start]
        seen.add(start)
        comp = []
        while stack:
            r, c = stack.pop()
            comp.append((r, c))
            for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
                if (nr, nc) in cells and (nr, nc) not in seen:
                    seen.add((nr, nc))
                    stack.append((nr, nc))
        regions.append(sorted(comp))
    return regions


def psi_pixels(mask):
    return sum(1 for row in mask for v in row if v)


def region_inter(cells, mask):
    inter = 0
    for (r, c) in cells:
        for y in range(r * PATCH, (r + 1) * PATCH):
            row = mask[y]
            for x in range(c * PATCH, (c + 1) * PATCH):
                if row[x]:
                    inter += 1
    return inter


def region_areas(cells):
    return len(cells) * PATCH * PATCH


def classify(inter, m_px, psi_total):
    """Eq.(4) at region granularity.

    IoU = |m cap psi| / |m cup psi| ; r_in = |m cap psi| / |m|.
    - no overlap with the previous detection at all -> appearing
    - IoU >= theta2 and r_in > theta3                    -> disappearing/occlusion
    - otherwise (partial overlap)                        -> moving
    """
    union = m_px + psi_total - inter
    iou = (inter / union) if union > 0 else 0.0
    r_in = (inter / m_px) if m_px > 0 else 0.0
    if inter == 0:
        return iou, r_in, "appearing"
    if iou >= THETA2 and r_in > THETA3:
        return iou, r_in, "disappearing"
    return iou, r_in, "moving"


BIT_WIDTH = {"skipped": 0, "disappearing": 4, "appearing": 10, "moving": 10}


def build_sim():
    rnd = random.Random(SEED)
    noise_prev = draw_noise(rnd)   # fixed draw order -> deterministic
    noise_cur = draw_noise(rnd)

    prev_objs = [OBJ_MOVING_PREV, OBJ_DISAPPEAR_PREV]
    cur_objs = [OBJ_MOVING_CUR, OBJ_APPEAR_CUR]

    frame_prev = compose_frame(prev_objs, noise_prev)
    frame_cur = compose_frame(cur_objs, noise_cur)

    d = diff_matrix(frame_prev, frame_cur)
    psi_mask = object_mask(prev_objs)      # synthetic "detected region" at t-1
    psi_total = psi_pixels(psi_mask)

    kappa_count = KAPPA_PX
    counts = patch_counts(d, TAU_PX)
    similar = [[counts[pr][pc] >= kappa_count for pc in range(GRID_W)]
               for pr in range(GRID_H)]

    regions = components(similar)
    cell_region = {}
    region_info = {}
    for rid, cells in enumerate(regions):
        m_px = region_areas(cells)
        inter = region_inter(cells, psi_mask)
        iou, r_in, scenario = classify(inter, m_px, psi_total)
        region_info[rid] = {"cells": cells, "iou": iou, "r_in": r_in,
                            "scenario": scenario, "inter": inter, "m_px": m_px}
        for cell in cells:
            cell_region[cell] = rid

    patches = []
    moved = []
    for pr in range(GRID_H):
        for pc in range(GRID_W):
            c = counts[pr][pc]
            if similar[pr][pc]:
                scenario = "skipped"
                iou = 0.0
                r_in = 0.0
                rid = None
            else:
                rid = cell_region[(pr, pc)]
                info = region_info[rid]
                scenario = info["scenario"]
                iou = info["iou"]
                r_in = info["r_in"]
                if scenario == "moving":
                    moved.append(pr * GRID_W + pc)
            idx = pr * GRID_W + pc
            patches.append({
                "i": idx,
                "row": pr,
                "col": pc,
                "count_c": c,
                "similar": 1 if similar[pr][pc] else 0,
                "iou": r6(iou),
                "r_in": r6(r_in),
                "change_ratio": r6((PATCH * PATCH - c) / float(PATCH * PATCH)),
                "scenario": scenario,
                "bit_width": BIT_WIDTH[scenario],
                "region_id": -1 if rid is None else rid,
            })

    bitmix = {str(b): 0 for b in (0, 4, 10)}
    for p in patches:
        bitmix[str(p["bit_width"])] += 1
    n_similar = sum(1 for p in patches if p["similar"] == 1)
    n_patches = GRID_H * GRID_W

    scen_count = {}
    for p in patches:
        scen_count[p["scenario"]] = scen_count.get(p["scenario"], 0) + 1

    tau_values = [float(t) for t in SENS_TAU]
    grid = []
    for tau in tau_values:
        c_tau = patch_counts(d, tau)
        row = []
        for kappa in SENS_KAPPA_PX:
            kc = kappa
            sim = sum(1 for pr in range(GRID_H) for pc in range(GRID_W)
                      if c_tau[pr][pc] >= kc)
            row.append(r6(sim / float(n_patches)))
        grid.append(row)

    sim = {
        "meta": {
            "synthetic": True,
            "seed": SEED,
            "patch": PATCH,
            "grid_h": GRID_H,
            "grid_w": GRID_W,
            "frame_h": FRAME_H,
            "frame_w": FRAME_W,
            "tau_px": r6(TAU_PX),
            "kappa_count": kappa_count,
            "theta2": r6(THETA2),
            "theta3": r6(THETA3),
            "note": ("自测合成序列：2 帧 96x128，16x16 patch 共 6x8=48 个。tau=5 为强度级差阈值；"
                     "论文 Eq.(3) 的 kappa 是块级计数阈值（c_i>=kappa），本片合成取 kappa_count=64 个像素"
                     "（论文 Table 1 的 kappa 是 60.0/80.0，同口径）；theta2/theta3 论文未给值，"
                     "合成取 0.5，只为把三场景区分开。"),
        },
        "frames": {
            "count": 2,
            "moved_patches": moved,
            "noise_amp": r6(NOISE_AMP),
            "objects": {
                "moving": {"prev_xywh": list(OBJ_MOVING_PREV),
                           "cur_xywh": list(OBJ_MOVING_CUR)},
                "appearing": {"cur_xywh": list(OBJ_APPEAR_CUR)},
                "disappearing": {"prev_xywh": list(OBJ_DISAPPEAR_PREV)},
            },
            "psi_prev_pixels": psi_total,
            "note": "静态背景 + 1 个平移纹理方块 + 1 个出现方块 + 1 个消失方块 + ±1.5 强度噪声",
        },
        "patches": patches,
        "totals": {
            "similar_patches": n_similar,
            "skip_rate": r6(n_similar / float(n_patches)),
            "bitmix": bitmix,
            "avg_bits": r6(sum(p["bit_width"] for p in patches) / float(n_patches)),
            "scenario_counts": {
                "skipped": scen_count.get("skipped", 0),
                "appearing": scen_count.get("appearing", 0),
                "moving": scen_count.get("moving", 0),
                "disappearing": scen_count.get("disappearing", 0),
            },
        },
        "sensitivity": {
            "tau_values": tau_values,
            "kappa_values": list(SENS_KAPPA_PX),
            "grid": grid,
            "axis": "grid[tau][kappa_count] = skip_rate",
            "note": "自测，非论文结论；论文未给 tau/kappa 扫参结果",
        },
    }
    return round_tree(sim), scen_count


# ---------------------------------------------------------------- assertions
def run_assertions(adc, sim, scen_count):
    checks = []

    def check(name, fn):
        try:
            fn()
            checks.append((name, True, ""))
        except AssertionError as exc:
            checks.append((name, False, str(exc) or "assertion failed"))

    weights = cdac_weights()
    check("11.1 10-bit, VREF=1V", lambda: (
        assert_(adc["meta"]["nbits"] == 10),
        assert_(abs(adc["meta"]["vref"] - 1.0) < 1e-12)))
    check("11.2 weights are 2^-1..2^-10", lambda: (
        assert_(len(weights) == 10),
        assert_(all(abs(w - 2.0 ** -k) < 1e-15 for k, w in enumerate(weights, 1)))))
    check("11.3 prev code 1100000000 -> 0.750 V", lambda: (
        assert_(code_to_voltage(PREV_CODE, weights) == 0.75),
        assert_(adc["cDAC"]["reconstructed_v"] == 0.75)))
    check("11.4 V_IN=0.751V, delta=V_DAC-V_IN=-1mV", lambda: (
        assert_(abs(VIN - 0.751) < 1e-15),
        assert_(abs((code_to_voltage(PREV_CODE, weights) - VIN) - (-0.001)) < 1e-12),
        assert_(abs((VIN - code_to_voltage(PREV_CODE, weights)) - (0.001)) < 1e-12)))
    check("11.5 tau = 0.5%*VREF = 5mV", lambda: (
        assert_(abs(TAU_V - 0.005) < 1e-15),
        assert_(abs(TAU_V / VREF - 0.005) < 1e-15)))
    check("11.6 1st comparison: -V_IN+V_DAC+tau = +4mV -> 1", lambda: (
        assert_(abs((0.75 - VIN + TAU_V) - 0.004) < 1e-12),
        assert_((0.75 - VIN + TAU_V) > 0),
        assert_(adc["similarity"]["cases"][0]["comparator"] == 1)))
    check("11.7 2nd comparison: -V_IN+V_DAC-tau = -6mV -> 0", lambda: (
        assert_(abs((0.75 - VIN - TAU_V) - (-0.006)) < 1e-12),
        assert_((0.75 - VIN - TAU_V) < 0),
        assert_(adc["similarity"]["cases"][1]["comparator"] == 0)))
    check("11.8 opposite signs -> similar", lambda: (
        assert_(adc["similarity"]["verdict"] == "similar"),
        assert_(adc["similarity"]["cases"][0]["comparator"]
                != adc["similarity"]["cases"][1]["comparator"])))
    check("11.9 SAR code 1100000001 = 0.750977V", lambda: (
        assert_(adc["sar"]["code"] == "1100000001"),
        assert_(abs(adc["sar"]["code_value_v"] - 0.7509765625) < 1e-6),
        assert_(abs(adc["sar"]["code_value_v"] - VIN) < VREF / (2.0 ** NBITS))))
    check("11.10 comparison count 10 / 2 / 8", lambda: (
        assert_(adc["comparison_count"]["full_sar"] == 10),
        assert_(adc["comparison_count"]["similarity_mode"] == 2),
        assert_(adc["comparison_count"]["saved"] == 8)))
    check("11.11 48 patches, grid matches frame", lambda: (
        assert_(len(sim["patches"]) == 48),
        assert_(sim["meta"]["grid_h"] * sim["meta"]["grid_w"] == 48),
        assert_(sim["meta"]["frame_h"] == sim["meta"]["grid_h"] * PATCH),
        assert_(sim["meta"]["frame_w"] == sim["meta"]["grid_w"] * PATCH)))
    check("11.12 all four scenarios present", lambda: (
        assert_(scen_count.get("appearing", 0) >= 1),
        assert_(scen_count.get("moving", 0) >= 1),
        assert_(scen_count.get("disappearing", 0) >= 1),
        assert_(scen_count.get("skipped", 0) >= 1)))
    check("11.13 Eq.3: similar <=> c_i >= kappa_count", lambda: (
        assert_(all((p["count_c"] >= sim["meta"]["kappa_count"]) == (p["similar"] == 1)
                    for p in sim["patches"]))))
    check("11.14 Eq.4 signs: disappearing IoU>=theta2 & r_in>theta3", lambda: (
        assert_(all((p["iou"] >= THETA2 and p["r_in"] > THETA3)
                    for p in sim["patches"] if p["scenario"] == "disappearing")),
        assert_(all(p["iou"] >= 0.0 and p["r_in"] >= 0.0 for p in sim["patches"]))))
    check("11.15 all floats rounded to <=6 decimals", lambda: (
        assert_(all(round(v, 6) == v for v in _floats(sim))),
        assert_(all(round(v, 6) == v for v in _floats(adc)))))
    check("11.16 bitmix sums to 48", lambda: (
        assert_(sum(sim["totals"]["bitmix"].values()) == 48),
        assert_(sim["totals"]["similar_patches"] == scen_count.get("skipped", 0))))

    return checks


def assert_(cond):
    assert cond


def _floats(obj):
    if isinstance(obj, float):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from _floats(v)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            yield from _floats(v)


# ---------------------------------------------------------------- reporting
def print_summary(adc, sim, checks):
    print("=" * 68)
    print("DeltaSight simulator -- deterministic synthetic data")
    print("=" * 68)
    print("[adc.json]  Sec.4.2.1 similarity-identification example")
    print("  prev code %s -> V_DAC = %.6f V (VREF=%.1f V, %d-bit)"
          % (adc["cDAC"]["prev_code"], adc["cDAC"]["reconstructed_v"],
             adc["meta"]["vref"], adc["meta"]["nbits"]))
    print("  V_IN = %.6f V, delta = %+.6f V" % (adc["sar"]["vin"],
                                                adc["similarity"]["delta_v"]))
    c0, c1 = adc["similarity"]["cases"]
    print("  +/-tau: %s -> V- = %+.6f V, comp=%d | %s -> V- = %+.6f V, comp=%d"
          % (c0["inject"], c0["vminus_v"], c0["comparator"],
             c1["inject"], c1["vminus_v"], c1["comparator"]))
    print("  verdict = %s   (tau = %.6f V = %.1f%% VREF)"
          % (adc["similarity"]["verdict"], adc["similarity"]["tau_v"],
             100.0 * adc["similarity"]["tau_v"] / VREF))
    print("  10-bit SAR: %s = %.6f V (%.2f LSB err), comparisons %d vs %d"
          % (adc["sar"]["code"], adc["sar"]["code_value_v"],
             (VIN - adc["sar"]["code_value_v"]) / (VREF / 1024.0),
             adc["comparison_count"]["similarity_mode"],
             adc["comparison_count"]["full_sar"]))
    print()
    print("[sim.json] patch-level skip simulation (%dx%d patches, tau=%.0f, kappa_count=%d)"
          % (sim["meta"]["grid_h"], sim["meta"]["grid_w"],
             sim["meta"]["tau_px"], sim["meta"]["kappa_count"]))
    t = sim["totals"]
    sc = t["scenario_counts"]
    print("  similar patches = %d/48, skip_rate = %.6f, avg_bits = %.6f"
          % (t["similar_patches"], t["skip_rate"], t["avg_bits"]))
    print("  bitmix: 0-bit=%d  4-bit=%d  10-bit=%d"
          % (t["bitmix"]["0"], t["bitmix"]["4"], t["bitmix"]["10"]))
    print("  scenarios: skipped=%d  appearing=%d  moving=%d  disappearing=%d"
          % (sc["skipped"], sc["appearing"], sc["moving"], sc["disappearing"]))
    print("  moved_patches = %s" % (sim["frames"]["moved_patches"],))
    print()
    print("[assertions] paper numbers")
    failed = 0
    for name, ok, msg in checks:
        print("  %s %s%s" % ("PASS" if ok else "FAIL", name,
                             ("" if ok else "  <-- " + msg)))
        if not ok:
            failed += 1
    print("  %d/%d checks passed" % (len(checks) - failed, len(checks)))
    return failed


# ---------------------------------------------------------------- main
def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Generate sim.json / adc.json for the DeltaSight video")
    pack = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ap.add_argument("--out-dir", default=os.path.join(pack, "data"),
                    help="output directory (default: <pack>/data)")
    args = ap.parse_args(argv)

    out_dir = os.path.abspath(args.out_dir)
    os.makedirs(out_dir, exist_ok=True)

    adc = build_adc()
    sim, scen_count = build_sim()

    sim_path = os.path.join(out_dir, "sim.json")
    adc_path = os.path.join(out_dir, "adc.json")
    for path, obj in ((sim_path, sim), (adc_path, adc)):
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(obj, fh, indent=2, ensure_ascii=False)
            fh.write("\n")

    checks = run_assertions(adc, sim, scen_count)
    failed = print_summary(adc, sim, checks)
    print()
    print("wrote: %s" % sim_path)
    print("wrote: %s" % adc_path)
    if failed:
        print("FATAL: %d assertion(s) failed" % failed, file=sys.stderr)
        return 1
    print("OK: all assertions passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
