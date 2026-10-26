#!/usr/bin/env python3
"""A deliberately small model of what register renaming buys.

Program: N iterations of a four-instruction chain that all reuse one
architectural register, r1:

    r1 = load[i]      (4 cycles)
    r1 = r1 + 1       (1)
    r1 = r1 * 2       (1)
    store r1

Without renaming, every write to r1 must wait for the previous read and write,
so iterations serialize: 6 cycles each, IPC 4/6. With renaming, iterations can
overlap, but the in-flight window is bounded by the reorder queue (64 entries,
i.e. 16 iterations) and by the physical register pool (3 destinations per
iteration). That gives a plateau: 64 rename registers is enough to fill a
64-entry ROB; 128 buys nothing.

This is a structural model, not a Godson-2 measurement. Emits data/rename_sim.json.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "rename_sim.json"
N = 200
WIDTH = 4
ROB = 64
ITER_INSTR = 4
DEST_PER_ITER = 3
CHAIN = 6          # load 4 + alu 1 + alu 1
ARCH = 32

def run(pool):
    """pool = extra physical registers beyond the 32 architectural ones."""
    if pool is None:
        # no renaming: one iteration at a time, in-order
        cycles = N * CHAIN
        return {"ipc": round(4 * N / cycles, 3), "cycles": cycles, "parallel": 1}
    # in-flight iterations, capped by ROB entries and by the rename pool
    w = min(ROB // ITER_INSTR, pool // DEST_PER_ITER)
    w = max(w, 1)
    if w >= CHAIN:
        cycles = N                       # one iteration retires per cycle, 4-wide
    else:
        cycles = int(N * CHAIN / w)
    return {"ipc": round(4 * N / cycles, 3), "cycles": cycles, "parallel": w}

def main():
    rows = [{"label": "no-rename", "pool": None, **run(None)}]
    for pool in (16, 32, 64, 96):
        # label by total physical registers: 32 architectural + the rename pool
        rows.append({"label": str(ARCH + pool) + " PRF", "pool": pool, **run(pool)})
    base = rows[0]["ipc"]
    for r in rows:
        r["speedup"] = round(r["ipc"] / base, 2)
    payload = {"iterations": N, "width": WIDTH, "rob": ROB,
               "archRegs": ARCH, "chainCycles": CHAIN,
               "rows": rows,
               "note": "structural model: 4-instruction iteration chain reusing r1; ROB 64; 3 rename registers per iteration; not a Godson-2 measurement"}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n")
    print("wrote", OUT, [(r["label"], r["ipc"], r.get("parallel")) for r in rows])

if __name__ == "__main__":
    main()

