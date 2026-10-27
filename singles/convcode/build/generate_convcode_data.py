#!/usr/bin/env python3
"""Generate the one data file the convcode lecture reads: data/convcode/demo.json.

Everything is measured here with fixed seeds; the specification numbers live in
data/eval.json. Output: data/demo.json (BER sweep, coding gain, frame recovery,
a worked example, and the block-interleaver burst spread).

    python3 build/generate_convcode_data.py
"""
import json
import math
import os

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "demo.json")

SEED = 20261027
RATE = 0.5
K = 5
MEM = K - 1
STATES = 1 << MEM
G0 = 0b10011
G1 = 0b11011
TAIL = MEM
INFO_BITS = 189
FRAME_BITS = INFO_BITS + TAIL
CODED_BITS = 2 * INFO_BITS

EBN0_DB = [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]
BER_FRAMES = 4000
REC_FLIPS = [0, 10, 20, 30, 40]
REC_FRAMES = 3000


def parity(x):
    return bin(x).count("1") & 1


def build_tables():
    rows = []
    for s in range(STATES):
        for b in (0, 1):
            reg = (b << MEM) | s
            o0 = parity(reg & G0)
            o1 = parity(reg & G1)
            ns = ((s >> 1) | (b << (MEM - 1))) & (STATES - 1)
            rows.append((s, b, ns, o0, o1))
    arr = np.array(rows, dtype=np.int64)
    return arr[:, 0], arr[:, 1], arr[:, 2], arr[:, 3], arr[:, 4]


TR_S, TR_B, TR_NS, TR_O0, TR_O1 = build_tables()

PRED = {ns: np.where(TR_NS == ns)[0] for ns in range(STATES)}
P1 = np.array([PRED[ns][0] for ns in range(STATES)])
P2 = np.array([PRED[ns][1] for ns in range(STATES)])
S1, S2 = TR_S[P1], TR_S[P2]
B1, B2 = TR_B[P1], TR_B[P2]


def encode(bits):
    B, N = bits.shape
    s = np.zeros(B, dtype=np.int64)
    out = np.zeros((B, 2 * N), dtype=np.int8)
    for k in range(N):
        b = bits[:, k]
        reg = (b << MEM) | s
        out[:, 2 * k] = np.array([parity(int(v)) for v in (reg & G0)], dtype=np.int8)
        out[:, 2 * k + 1] = np.array([parity(int(v)) for v in (reg & G1)], dtype=np.int8)
        s = ((s >> 1) | (b << (MEM - 1))) & (STATES - 1)
    return out


def viterbi(y0, y1, hard=False):
    B, N = y0.shape
    NEG = -1e18
    pm = np.full((B, STATES), NEG, dtype=np.float64)
    pm[:, 0] = 0.0
    dec_s = np.zeros((B, N, STATES), dtype=np.int8)
    dec_b = np.zeros((B, N, STATES), dtype=np.int8)
    for k in range(N):
        if hard:
            bm = -((y0[:, k, None] != TR_O0[None, :]).astype(np.float64)
                   + (y1[:, k, None] != TR_O1[None, :]).astype(np.float64))
        else:
            bm = (y0[:, k, None] * (1 - 2 * TR_O0[None, :])
                  + y1[:, k, None] * (1 - 2 * TR_O1[None, :]))
        cand = pm[:, TR_S] + bm
        c1 = cand[:, P1]
        c2 = cand[:, P2]
        take2 = c2 > c1
        pm = np.where(take2, c2, c1)
        dec_s[:, k, :] = np.where(take2, S2[None, :], S1[None, :])
        dec_b[:, k, :] = np.where(take2, B2[None, :], B1[None, :])
    out = np.zeros((B, N), dtype=np.int8)
    s = np.zeros(B, dtype=np.int64)
    rows = np.arange(B)
    for k in range(N - 1, -1, -1):
        out[:, k] = dec_b[rows, k, s]
        s = dec_s[rows, k, s]
    return out


def awgn(bits, ebno_db, rng, rate=RATE):
    ebno = 10 ** (ebno_db / 10.0)
    sigma = math.sqrt(1.0 / (2.0 * rate * ebno))
    x = 1.0 - 2.0 * bits.astype(np.float64)
    return x + rng.normal(0.0, sigma, x.shape)


def measure_ber(rng):
    points = []
    for db in EBN0_DB:
        info = rng.integers(0, 2, size=(BER_FRAMES, INFO_BITS), dtype=np.int8)
        tail = np.zeros((BER_FRAMES, TAIL), dtype=np.int8)
        framed = np.concatenate([info, tail], axis=1)
        coded = encode(framed)
        y = awgn(coded, db, rng)
        soft = viterbi(y[:, 0::2], y[:, 1::2], hard=False)
        hard_bits = (y < 0).astype(np.int8)
        hard = viterbi(hard_bits[:, 0::2], hard_bits[:, 1::2], hard=True)
        xu = awgn(info, db, rng, rate=1.0)
        unc = (xu < 0).astype(np.int8)
        row = {"ebn0Db": db,
               "uncoded": float(np.mean(unc != info)),
               "hard": float(np.mean(hard[:, :INFO_BITS] != info)),
               "soft": float(np.mean(soft[:, :INFO_BITS] != info))}
        points.append(row)
        print("  Eb/N0 %4.1f dB  uncoded %.3e  hard %.3e  soft %.3e" % (db, row["uncoded"], row["hard"], row["soft"]))
    return points


def crossing(points, key, target=1e-3):
    ys = [p[key] for p in points]
    xs = [p["ebn0Db"] for p in points]
    skipped = [p["ebn0Db"] for p in points if p[key] == 0]
    for i in range(1, len(ys)):
        a, b = ys[i - 1], ys[i]
        if a > 0 and b > 0 and a >= target >= b:
            la, lb = math.log10(a), math.log10(b)
            t = (math.log10(target) - la) / (lb - la)
            return xs[i - 1] + t * (xs[i] - xs[i - 1])
    return None


def measure_recovery(rng):
    rows = []
    for flips in REC_FLIPS:
        info = rng.integers(0, 2, size=(REC_FRAMES, INFO_BITS), dtype=np.int8)
        tail = np.zeros((REC_FRAMES, TAIL), dtype=np.int8)
        coded = encode(np.concatenate([info, tail], axis=1))
        recv = coded.copy()
        if flips:
            for i in range(REC_FRAMES):
                pos = rng.choice(CODED_BITS, size=flips, replace=False)
                recv[i, pos] ^= 1
        dec = viterbi(recv[:, 0::2], recv[:, 1::2], hard=True)
        ok = float(np.mean(np.all(dec[:, :INFO_BITS] == info, axis=1)))
        rows.append({"flips": flips, "recoveredPct": 100.0 * ok})
        print("  %2d flips  recovered %6.2f%%" % (flips, 100.0 * ok))
    return rows


def worked_example():
    bits = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1]
    s = 0
    states = [0]
    o0, o1 = [], []
    for b in bits:
        reg = (b << MEM) | s
        o0.append(parity(reg & G0))
        o1.append(parity(reg & G1))
        s = ((s >> 1) | (b << (MEM - 1))) & (STATES - 1)
        states.append(s)
    return {
        "input": bits,
        "output0": o0,
        "output1": o1,
        "states": states,
        "note": "state is the four-bit shift register after the input bit; the tail of a real frame drives it back to 0",
    }


def interleave_model():
    rows, cols = 8, 57
    burst = 24
    per_row = [0] * rows
    for t in range(burst):
        per_row[t % rows] += 1
    return {
        "kind": "conceptual 8 x 57 block interleaver (GSM uses the block-diagonal variant of the same idea)",
        "rows": rows,
        "cols": cols,
        "burstBits": burst,
        "perRow": per_row,
        "maxPerRow": max(per_row),
        "without": {"maxPerBlock": burst},
        "note": "one block fills 8 rows of 57 bits; reading column by column spreads a 24-bit burst over all 8 rows",
    }


def main():
    rng = np.random.default_rng(SEED)
    print("BER sweep")
    ber = measure_ber(rng)
    print("frame recovery")
    rec = measure_recovery(rng)
    gain = {
        "berTarget": 1e-3,
        "uncodedDb": crossing(ber, "uncoded"),
        "hardDb": crossing(ber, "hard"),
        "softDb": crossing(ber, "soft"),
    }
    gain["hardGainDb"] = gain["uncodedDb"] - gain["hardDb"]
    gain["softGainDb"] = gain["uncodedDb"] - gain["softDb"]
    print("gain at 1e-3: uncoded %.2f dB, hard %.2f dB (%.2f dB better), soft %.2f dB (%.2f dB better)"
          % (gain["uncodedDb"], gain["hardDb"], gain["hardGainDb"], gain["softDb"], gain["softGainDb"]))
    doc = {
        "schemaVersion": 1,
        "meta": {
            "seed": SEED,
            "rate": "1/2",
            "constraintLength": K,
            "states": STATES,
            "g0": {"mask": G0, "polynomial": "1 + D^3 + D^4"},
            "g1": {"mask": G1, "polynomial": "1 + D + D^3 + D^4"},
            "infoBits": INFO_BITS,
            "codedBits": CODED_BITS,
            "berFramesPerPoint": BER_FRAMES,
            "recoveryFramesPerPoint": REC_FRAMES,
            "channel": "BPSK, AWGN, no fading, no interleaving in the BER sweep",
            "note": "simulated here with numpy, fixed seed; every number is measured, none is quoted",
        },
        "ber": ber,
        "gain": gain,
        "display": {
            "ber0dbPct": "%.3f" % (100.0 * ber[0]["uncoded"]),
            "gainUncoded1e3Db": "%.2f" % gain["uncodedDb"],
            "gainHard1e3Db": "%.2f" % gain["hardDb"],
            "gainSoft1e3Db": "%.2f" % gain["softDb"],
            "gain3p7Db": "%.2f" % gain["softGainDb"],
            "recoveryPct": {"%d" % r["flips"]: "%.2f" % r["recoveredPct"] for r in rec},
        },
        "frameRecovery": rec,
        "example": worked_example(),
        "interleave": interleave_model(),
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("wrote", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
