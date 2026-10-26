#!/usr/bin/env python3
"""Four-core L2 access model: shared bus vs crossbar.

A-level structural experiment for episode 04. Four cores issue one L2 access
every four cycles (with +/-1 jitter) to four banks; each access needs two
cycles of bank service. The shared bus serializes every access and adds two
cycles of arbitration, so it can finish at most one access every four cycles.
The crossbar lets each bank serve independently. Queues are bounded, so an
overloaded interconnect drops requests instead of growing without limit.

This measures the mechanism, not Godson-3 silicon. Output: data/noc_sim.json.
"""
import json
import random
from collections import deque
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "noc_sim.json"

CYCLES = 50000
WARMUP = 5000
CORES = 4
BANKS = 4
ISSUE = 4
SERVICE = 2
BUS_ARBITRATION = 2
QUEUE_CAP = 8
SEED = 2009


def run(mode: str):
    rng = random.Random(SEED)
    next_issue = [rng.randint(0, ISSUE - 1) for _ in range(CORES)]
    core_queue = [deque() for _ in range(CORES)]
    bank_queue = [deque() for _ in range(BANKS)]
    bus_queue = deque()
    bus_busy_until = 0
    bank_busy_until = [0] * BANKS
    latencies = []
    completed = 0
    dropped = 0

    def issue(core: int, t: int):
        nonlocal dropped
        bank = rng.randrange(BANKS)
        if mode == "bus":
            if len(bus_queue) >= QUEUE_CAP:
                dropped += 1
            else:
                bus_queue.append((t, bank))
        else:
            if len(bank_queue[bank]) >= QUEUE_CAP:
                dropped += 1
            else:
                bank_queue[bank].append(t)

    for t in range(CYCLES):
        for c in range(CORES):
            if t == next_issue[c]:
                issue(c, t)
                next_issue[c] = t + ISSUE + rng.randint(-1, 1)

        if mode == "bus":
            if bus_queue and t >= bus_busy_until:
                start, _bank = bus_queue.popleft()
                done = t + SERVICE + BUS_ARBITRATION
                bus_busy_until = done
                if t >= WARMUP:
                    latencies.append(done - start)
                    completed += 1
        else:
            for b in range(BANKS):
                if bank_queue[b] and t >= bank_busy_until[b]:
                    start = bank_queue[b].popleft()
                    done = t + SERVICE
                    bank_busy_until[b] = done
                    if t >= WARMUP:
                        latencies.append(done - start)
                        completed += 1

    measured = CYCLES - WARMUP
    mean = sum(latencies) / len(latencies) if latencies else 0.0
    return {
        "mode": mode,
        "throughput": round(completed / measured, 4),
        "latency": round(mean, 2),
        "completed": completed,
        "dropped": dropped,
    }


def main():
    rows = [run("bus"), run("crossbar")]
    payload = {
        "cycles": CYCLES,
        "warmup": WARMUP,
        "cores": CORES,
        "banks": BANKS,
        "issueEvery": ISSUE,
        "service": SERVICE,
        "busArbitration": BUS_ARBITRATION,
        "queueCap": QUEUE_CAP,
        "rows": rows,
        "note": "structural model: 4 cores, 4 banks, bounded queues; not a Godson-3 measurement",
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for r in rows:
        print(f"{r['mode']:8s} throughput {r['throughput']:.2f} req/cycle  latency {r['latency']:.1f} cycles  dropped {r['dropped']}")


if __name__ == "__main__":
    main()
