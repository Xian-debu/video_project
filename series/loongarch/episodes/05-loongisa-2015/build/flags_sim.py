#!/usr/bin/env python3
"""Instruction-count model for the LoongISA episode.

Not a cycle model and not a chip measurement. It counts the instruction
sequences the 2015 paper prints (or describes) for four translation
primitives, so the episode can show the order of magnitude the hardware
support removes.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Fig. 2(b): SUB ecx, edx plus SF/ZF/OF/CF, then the branch.
X86_FLAGS_MIPS = list(range(39))  # 0.00 .. 0.38
X86_FLAGS_BRANCH = 1
X86_FLAGS_LOONGISA = 4  # SUBU, SETFLAG, SUBU, X86JE

# Fig. 3(b): conditional writeback needs two branches and their delay slots.
ARM_WRITEBACK_MIPS = 5  # BNE, NOP, BNE, NOP, ADD
ARM_WRITEBACK_LOONGISA = 3  # ADD, ARMADDGT, ARMMOVGT

# x87 register access: the paper says >10 instructions to compute the
# physical register number; count 12 plus the operation.
X87_MIPS = 13
X87_LOONGISA = 1

# 80-bit <-> 64-bit conversion: paper says 40+ instructions; count 40 + 1.
FP80_MIPS = 41
FP80_LOONGISA = 1


def case(cid, what, baseline, loongisa, note):
    return {
        "id": cid,
        "what": what,
        "baseline": baseline,
        "loongisa": loongisa,
        "ratio": round(baseline / loongisa, 2),
        "note": note,
    }


cases = [
    case(
        "x86-flags",
        "x86 SUB + SF/ZF/OF/CF + branch",
        len(X86_FLAGS_MIPS) + X86_FLAGS_BRANCH,
        X86_FLAGS_LOONGISA,
        "Fig.2(b) is 39 MIPS instructions plus the branch; Fig.2(c) is 4.",
    ),
    case(
        "arm-cond",
        "ARM ADDGT conditional writeback",
        ARM_WRITEBACK_MIPS,
        ARM_WRITEBACK_LOONGISA,
        "Writeback only; both sides still need flag generation.",
    ),
    case(
        "x87-top",
        "x87 register access (TOP addressing)",
        X87_MIPS,
        X87_LOONGISA,
        "Paper says more than 10 instructions saved per access; 12 is a floor.",
    ),
    case(
        "fp80",
        "80-bit <-> 64-bit float conversion",
        FP80_MIPS,
        FP80_LOONGISA,
        "Paper says 40+ instructions; 40 is a floor, plus the operation.",
    ),
]

payload = {
    "model": "instruction-count",
    "fps": 30,
    "source": "Hu et al., 中国科学: 信息科学 45(4), 2015",
    "cases": cases,
    "summary": {
        "baselineTotal": sum(c["baseline"] for c in cases),
        "loongisaTotal": sum(c["loongisa"] for c in cases),
    },
    "note": "Instruction counts, not cycles; not a 3A1500 measurement.",
}

out = ROOT / "data" / "flags_sim.json"
out.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
print("wrote", out)
for c in cases:
    print(f'{c["id"]:10s} {c["baseline"]:3d} -> {c["loongisa"]:2d}  x{c["ratio"]}')
