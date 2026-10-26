#!/usr/bin/env python3
"""Encoding-boundary structural model for episode 06.

The point is not to reproduce the official LoongArch binary encoding, but to
measure the structural difference between a fixed 32-bit instruction stream and
a variable-length (x86-style) one for the front end:

  * fixed: every 4-byte aligned offset is an instruction boundary; a 64-byte
    fetch block has exactly 16 slots and four instructions can be cut in one
    parallel step.
  * variable: the decoder has to read each length before it can find the next
    boundary, so finding four instructions costs four dependent steps; a random
    byte offset is only a boundary with probability 1 / mean-length.

The length distribution is an explicit, synthetic assumption so the result is
reproducible rather than a claim about a real x86 program.
"""
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRIALS = 100_000
INSTR_PER_FETCH = 4
FETCH_BYTES = 64

# Synthetic x86-ish length histogram: short instructions dominate, long ones
# exist for immediates and memory operands. This is an assumption, not a trace.
LENGTH_WEIGHTS = {
    1: 10, 2: 25, 3: 20, 4: 15, 5: 10,
    6: 8, 7: 6, 8: 3, 9: 2, 10: 1,
    11: 1, 12: 1, 13: 1, 14: 1, 15: 1,
}
LENGTHS = [k for k, w in LENGTH_WEIGHTS.items() for _ in range(w)]
MEAN_LENGTH = sum(k * w for k, w in LENGTH_WEIGHTS.items()) / sum(LENGTH_WEIGHTS.values())


def fixed_model():
    slots = FETCH_BYTES // 4
    return {
        "slotsPer64B": slots,
        "boundaryStepsForFour": 1,
        "bytesForFour": 4 * INSTR_PER_FETCH,
        "parallelCut": True,
        "note": "every 4-byte aligned offset is a boundary",
    }


def variable_model(rng):
    total_bytes = 0
    for _ in range(TRIALS):
        total_bytes += sum(rng.choice(LENGTHS) for _ in range(INSTR_PER_FETCH))
    mean_four = total_bytes / TRIALS
    # A random byte offset starts an instruction only if it is the first byte
    # after a whole number of instructions. With i.i.d. lengths this is
    # approximately 1 / E[length]; measure it directly on a long stream.
    stream = [rng.choice(LENGTHS) for _ in range(TRIALS)]
    boundaries = set()
    pos = 0
    for n in stream:
        boundaries.add(pos)
        pos += n
    hits = sum(1 for off in range(pos) if off in boundaries)
    return {
        "meanLength": round(MEAN_LENGTH, 3),
        "meanBytesForFour": round(mean_four, 3),
        "boundaryStepsForFour": INSTR_PER_FETCH,
        "boundaryProbability": round(hits / pos, 4),
        "parallelCut": False,
        "note": "each length must be decoded before the next boundary is known",
    }


def main():
    rng = random.Random(20230601)
    payload = {
        "trials": TRIALS,
        "instrPerFetch": INSTR_PER_FETCH,
        "fetchBytes": FETCH_BYTES,
        "fixed": fixed_model(),
        "variable": variable_model(rng),
        "assumption": "x86-style variable length histogram is synthetic; model is not a chip measurement",
        "note": "structural model; not a LoongArch or 3A5000 measurement",
    }
    out = ROOT / "data" / "isa_sim.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
