#!/usr/bin/env python3
"""Structural models for the Godson-2 system-optimization episode.

Not a measurement of Godson-2. Three deterministic models:
  1. TLB reach: 64-entry hardware TLB, 4KB / 16KB / 64KB pages, same trace.
  2. Software TLB: direct-mapped refill cache of several sizes on the refill stream.
  3. Uncache Accelerate: 32B burst writes vs one bus event per uncached write.
"""
import json
import random
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "page_sim.json"

TLB_ENTRIES = 64
HOT_BYTES = 192 * 1024
COLD_BYTES = 8 * 1024 * 1024
ACCESSES = 200_000
BLOCK = 12
SEED = 2006


def make_trace():
    rng = random.Random(SEED)
    hot_pages = HOT_BYTES // 4096
    cold_pages = COLD_BYTES // 4096
    trace = []
    while len(trace) < ACCESSES:
        if rng.random() < 0.85:
            page = rng.randrange(hot_pages)
        else:
            page = rng.randrange(cold_pages)
        base = page * 4096 + rng.randrange(0, 4096, 64)
        for i in range(BLOCK):
            trace.append(base + i * 64)
    return trace[:ACCESSES]


def tlb_misses(trace, page_size):
    tlb = OrderedDict()
    misses = 0
    for addr in trace:
        vpn = addr // page_size
        if vpn in tlb:
            tlb.move_to_end(vpn)
        else:
            misses += 1
            tlb[vpn] = True
            if len(tlb) > TLB_ENTRIES:
                tlb.popitem(last=False)
    return misses


def main():
    trace = make_trace()
    pages = []
    refill_vpns = []
    tlb = OrderedDict()
    for addr in trace:
        vpn = addr // 4096
        if vpn not in tlb:
            refill_vpns.append(vpn)
            tlb[vpn] = True
            if len(tlb) > TLB_ENTRIES:
                tlb.popitem(last=False)
        else:
            tlb.move_to_end(vpn)

    for ps in (4096, 16 * 1024, 64 * 1024):
        misses = tlb_misses(trace, ps)
        pages.append({
            "pageKb": ps // 1024,
            "tlbEntries": TLB_ENTRIES,
            "reachKb": ps * TLB_ENTRIES // 1024,
            "misses": misses,
            "mpki": round(misses / (len(trace) / 1000.0), 3),
        })

    # A refill stream has far more reuse than a raw random access trace: most
    # refills come back to a small hot set of pages, a minority are cold.
    soft_rng = random.Random(SEED + 1)
    soft_hot = 512
    soft_cold = 32_768
    soft_share = 0.90
    refill_stream = [
        soft_rng.randrange(soft_hot)
        if soft_rng.random() < soft_share
        else soft_rng.randrange(soft_cold)
        for _ in range(200_000)
    ]
    soft = []
    for entries in (256, 1024, 4096, 16384):
        table = [-1] * entries
        hits = 0
        for vpn in refill_stream:
            slot = vpn % entries
            if table[slot] == vpn:
                hits += 1
            else:
                table[slot] = vpn
        rate = hits / len(refill_stream)
        soft.append({
            "entries": entries,
            "directMappedHitRate": round(rate, 4),
        })

    ua = []
    for word_bits in (32, 64):
        words_per_burst = 32 * 8 // word_bits
        run = words_per_burst
        normal = 2 * run
        burst = 5 * (run // words_per_burst)
        ua.append({
            "wordBits": word_bits,
            "runWords": run,
            "normalCycles": normal,
            "uaCycles": burst,
            "speedup": round(normal / burst, 3),
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "model": "page_sim.py",
        "note": "structural models; not a Godson-2 measurement",
        "trace": {
            "accesses": ACCESSES,
            "hotKb": HOT_BYTES // 1024,
            "hotShare": 0.85,
            "coldMb": COLD_BYTES // (1024 * 1024),
            "block": BLOCK,
            "seed": SEED,
        },
        "pages": pages,
        "softTlbModel": {
            "refills": len(refill_stream),
            "hotPages": soft_hot,
            "coldPages": soft_cold,
            "hotShare": soft_share,
        },
        "softTlb": soft,
        "uncacheAccelerate": ua,
    }, indent=2) + "\n", encoding="utf-8")
    print("wrote", OUT)
    for row in pages:
        print("page", row["pageKb"], "KB reach", row["reachKb"], "KB misses", row["misses"], "MPKI", row["mpki"])
    print("soft TLB refills", len(refill_stream))
    for row in soft:
        print("soft", row["entries"], "hit", row["directMappedHitRate"])
    for row in ua:
        print("UA", row["wordBits"], "bit run", row["runWords"], "speedup", row["speedup"])


if __name__ == "__main__":
    main()
