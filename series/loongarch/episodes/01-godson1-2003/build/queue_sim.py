#!/usr/bin/env python3
"""Cycle-level model for episode 1.

Compares an in-order pipeline with a small out-of-order window on a trace whose
first instruction is a 20-cycle cache-miss load followed by independent ALU work.
It is a model, not a measurement of Godson-1: the point is the mechanism, not a
reproduction of the chip.

Output: ../data/queue_sim.json (pack-relative).
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "queue_sim.json"

LOAD = 20
ALU = 1
MUL = 3


@dataclass
class Ins:
    name: str
    deps: list[int]
    latency: int
    start: int | None = None
    done: int | None = None


def trace() -> list[Ins]:
    # 0 is a cache-miss load, followed by 16 independent ALU instructions. A
    # chain that needs the load sits behind them. In order every instruction
    # waits for the load; with a window the independent work fills the miss.
    out = [Ins("load r1,[a]", [], LOAD)]
    for i in range(16):
        out.append(Ins(f"add r{20 + i},r{40 + i},r{60 + i}", [], ALU))
    out.append(Ins("mul r8,r1,r20", [0, 1], MUL))
    out.append(Ins("add r9,r8,r21", [17, 2], ALU))
    out.append(Ins("add r16,r9,r22", [18, 3], ALU))
    out.append(Ins("add r17,r16,r23", [19, 4], ALU))
    return out


def run(window: int) -> dict:
    """1-wide dispatch, unlimited issue, in-order commit, window = ROB entries."""
    ins = trace()
    cycle = 0
    dispatched = 0
    inflight: list[int] = []
    committed = 0
    commit_log: list[str] = []
    while committed < len(ins):
        cycle += 1
        # commit in order
        while inflight and inflight[0] == committed and ins[committed].done is not None and ins[committed].done <= cycle:
            commit_log.append(ins[committed].name)
            inflight.pop(0)
            committed += 1
        # dispatch while window has room
        while dispatched < len(ins) and len(inflight) < window:
            ins[dispatched].start = cycle
            inflight.append(dispatched)
            dispatched += 1
        # execute ready instructions (unlimited functional units)
        for i in list(inflight):
            it = ins[i]
            if it.done is not None:
                continue
            if all(ins[d].done is not None and ins[d].done <= cycle for d in it.deps):
                it.done = cycle + it.latency
        if cycle > 500:
            raise RuntimeError("model did not converge")
    return {"cycles": max(cycle, max(i.done or 0 for i in ins)), "commit": commit_log}


def inorder() -> dict:
    """Classic in-order pipeline: every instruction waits for the previous one."""
    cycle = 0
    log: list[str] = []
    for it in trace():
        # fetch/decode/issue of this instruction cannot start before the previous retires
        cycle += it.latency
        it.start = cycle - it.latency
        it.done = cycle
        log.append(it.name)
    return {"cycles": cycle, "commit": log}


def main() -> None:
    base = inorder()
    windows = []
    for w in (2, 4, 8, 16):
        r = run(w)
        windows.append({"window": w, "cycles": r["cycles"], "speedup": round(base["cycles"] / r["cycles"], 2)})
    # Precise-exception demonstration: when instruction 5 faults, instructions
    # 6..8 may have executed but must not commit. The model simply records the
    # in-order retirement prefix.
    fault_at = 5
    payload = {
        "model": "inorder-vs-ooo-window",
        "assumptions": {
            "loadLatency": LOAD,
            "aluLatency": ALU,
            "mulLatency": MUL,
            "dispatchWidth": 1,
            "issueWidth": "unlimited",
            "commit": "in-order",
            "note": "cycle model, not a measurement of Godson-1",
        },
        "trace": [it.name for it in trace()],
        "inorder": base,
        "windows": windows,
        "preciseException": {
            "faultAt": ins_name(fault_at),
            "retiredBeforeFault": [it.name for it in trace()[:fault_at]],
            "mustNotCommit": [it.name for it in trace()[fault_at + 1:]],
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", OUT.relative_to(ROOT), "inorder", base["cycles"], "windows", [(w["window"], w["cycles"]) for w in windows])


def ins_name(i: int) -> str:
    return trace()[i].name


if __name__ == "__main__":
    main()
