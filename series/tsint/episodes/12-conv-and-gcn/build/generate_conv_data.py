#!/usr/bin/env python3
"""派生第 12 集的数据包：只读 ts-base 的证据输出，不改任何原始数据。

输入：/root/ts-base/data/episodes/12-conv-and-gcn/ 下的 summary.json 与 5 份 CSV
     加上 /root/ts-base/inventory/evidence/ch2-conv-gcn/ 最新的证据 JSON
输出：<pack>/data/conv.json（派生文件，不入库；film.json 的 derive/derived 记录它）

宁可在这里失败也不让画面带错数：
1. 用 X、W 重算互相关与真卷积，对照 summary.struct.hand，并钉住四个 −4；
2. 手算三节点链的 P、完全图的 P 与 Px，逐元素对照 summary.struct.path/complete；
3. 参数 8/16/128/16/144 用公式重算；
4. 两个实验的 CSV 与 summary 逐条对照（边数、准确率、余弦）；
5. 旁白里念到的数字（−4、1/3、0.743、3.64e−2、0.5005…）逐个断言。
"""
import json
import math
import pathlib

PACK = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path("/root/ts-base/data/episodes/12-conv-and-gcn")
EVID = pathlib.Path("/root/ts-base/inventory/evidence/ch2-conv-gcn")
OUT = PACK / "data" / "conv.json"

FEAT, HIDDEN = 8, 16
HAND_X = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
HAND_W = [[1, 0], [0, -1]]
TAUS = [0.6, 0.5, 0.4, 0.3]
RADII = [1, 2, 3, 5, 8, 12, 25]


def rel(a, b):
    return abs(a - b) / max(1e-300, abs(b))


def read_csv(name):
    with open(TSBASE / name, encoding="utf-8") as f:
        head = f.readline().strip().split(",")
        rows = []
        for line in f:
            line = line.strip()
            if not line:
                continue
            rows.append(dict(zip(head, line.split(","))))
        return head, rows


def conv2d(x, w):
    """valid 互相关：out[i][j] = sum x[i+a][j+b] * w[a][b]。"""
    k = len(w)
    out = []
    for i in range(len(x) - k + 1):
        row = []
        for j in range(len(x[0]) - k + 1):
            s = 0.0
            for a in range(k):
                for b in range(k):
                    s += x[i + a][j + b] * w[a][b]
            row.append(s)
        out.append(row)
    return out


def rot180(w):
    return [list(reversed(row)) for row in reversed(w)]


def chain_p(n):
    """三节点（或 n 节点）链：A、A~、度、P = D~^-1/2 A~ D~^-1/2。"""
    a = [[1.0 if abs(i - j) == 1 else 0.0 for j in range(n)] for i in range(n)]
    at = [[a[i][j] + (1.0 if i == j else 0.0) for j in range(n)] for i in range(n)]
    deg = [sum(row) for row in at]
    p = [[at[i][j] / math.sqrt(deg[i] * deg[j]) for j in range(n)] for i in range(n)]
    return a, at, deg, p


def main():
    summary = json.load(open(TSBASE / "summary.json", encoding="utf-8"))
    st = summary["struct"]
    checks = summary["checks"]
    assert checks["failed"] == 0, ("evidence checks failed", checks)
    assert checks["total"] >= 43, ("check count", checks)

    # ---- 1. 手算：互相关与真卷积 ----
    cross = conv2d(HAND_X, HAND_W)
    truec = conv2d(HAND_X, rot180(HAND_W))
    assert cross == [[-4.0] * 2] * 2, ("hand cross", cross)
    assert truec == [[4.0] * 2] * 2, ("hand true", truec)
    for i in range(2):
        for j in range(2):
            assert rel(st["hand"]["cross"][i][j], cross[i][j]) < 1e-11, ("cross sum", i, j)
            assert rel(st["hand"]["trueConv"][i][j], truec[i][j]) < 1e-11, ("true sum", i, j)
    # 核的和为零 → 平移不变：四个窗口输出全等，正是"四个都是负四"的原因
    assert abs(sum(sum(r) for r in HAND_W)) < 1e-15

    # ---- 2. 两张小图的传播子 ----
    a3, at3, deg3, p3 = chain_p(3)
    path = st["path"]
    for i in range(3):
        for j in range(3):
            assert abs(path["adj"][i][j] - a3[i][j]) < 1e-12, ("path adj", i, j)
            assert abs(path["adjSelf"][i][j] - at3[i][j]) < 1e-12, ("path self", i, j)
            assert rel(path["p"][i][j], p3[i][j]) < 1e-11, ("path p", i, j)
    for i in range(3):
        assert abs(path["deg"][i] - deg3[i]) < 1e-12, ("path deg", i)
    assert deg3 == [2.0, 3.0, 2.0]

    comp = st["complete"]
    for i in range(3):
        for j in range(3):
            assert abs(comp["p"][i][j] - 1.0 / 3.0) < 1e-11, ("complete p", i, j)
    x = [1.0, 2.0, 3.0]
    px = [sum(comp["p"][i][j] * x[j] for j in range(3)) for i in range(3)]
    for i in range(3):
        assert abs(px[i] - 2.0) < 1e-9, ("complete px", i)
        assert abs(comp["px"][i] - 2.0) < 1e-11, ("complete px json", i)
    assert st["completeGraphDev"] < 1e-12, ("complete dev", st["completeGraphDev"])
    assert st["spectralRatio"] < 1.0, ("spectral", st["spectralRatio"])
    assert st["rowSumDev"] > 1e-2, ("row sum dev", st["rowSumDev"])
    assert st["selfLoopTrapDev"] > 1e-3, ("self loop trap", st["selfLoopTrapDev"])
    assert abs(st["selfLoopTrapDev"] - 1.0 / 6.0) < 1e-11, ("trap narration", st["selfLoopTrapDev"])

    # ---- 3. 参数量 ----
    w1 = FEAT * HIDDEN
    w2 = HIDDEN
    assert st["params"] == {"feat": FEAT, "hidden": HIDDEN, "w1": w1, "w2": w2, "total": w1 + w2}
    assert w1 + w2 == 144

    # ---- 4. 两个实验：CSV 与 summary 对照 ----
    _, real_rows = read_csv("real_sweep.csv")
    gcn = summary["real"]["gcn"]
    assert len(real_rows) == len(gcn) == len(TAUS), "real sweep rows"
    by_tau = {round(float(r["tau"]), 2): r for r in real_rows}
    for cell in gcn:
        r = by_tau[round(cell["tau"], 2)]
        assert int(r["edges"]) == int(cell["edges"]), ("edges", cell)
        assert abs(float(r["test_acc"]) - cell["testAcc"]) < 2e-6, ("real acc", cell)
        assert abs(float(r["mean_degree"]) - 2.0 * int(cell["edges"]) / summary["syn"]["nodes"]) < 1e-2
    assert [round(c["tau"], 2) for c in gcn] == TAUS
    assert [int(c["edges"]) for c in gcn] == [4, 33, 139, 357]

    _, syn_rows = read_csv("syn_sweep.csv")
    sweep = summary["syn"]["sweep"]
    assert len(syn_rows) == len(sweep) == len(RADII), "syn sweep rows"
    by_r = {int(r["radius"]): r for r in syn_rows}
    for cell in sweep:
        r = by_r[int(cell["radius"])]
        assert int(r["edges"]) == int(cell["edges"]), ("syn edges", cell)
        assert abs(float(r["test_acc"]) - cell["testAcc"]) < 2e-6, ("syn acc", cell)
        assert abs(float(r["embed_cos"]) - cell["embedCos"]) < 1e-6, ("syn cos", cell)
    assert [int(c["radius"]) for c in sweep] == RADII
    assert summary["syn"]["mlpTestAcc"] == 1.0
    for prev, nxt in zip(sweep, sweep[1:]):
        assert nxt["testAcc"] <= prev["testAcc"] + 1e-12, "syn acc monotone"
    for prev, nxt in zip(sweep, sweep[1:]):
        assert nxt["embedCos"] >= prev["embedCos"] - 1e-12, "syn cos monotone"

    # ---- 5. 旁白念到的数字 ----
    real = summary["real"]
    assert round(real["mlpTestAcc"], 4) == 0.5005, real["mlpTestAcc"]
    acc4 = [round(c["testAcc"], 4) for c in gcn]
    assert acc4 == [0.5031, 0.5038, 0.5021, 0.4981], acc4
    cos4 = [round(c["cos"], 4) for c in gcn]
    assert cos4[0] == 0.1833 and cos4[-1] == 0.6859, cos4
    assert round(sweep[0]["testAcc"], 3) == 0.776, sweep[0]["testAcc"]
    assert round(sweep[-1]["testAcc"], 3) == 0.505, sweep[-1]["testAcc"]
    assert abs(sweep[-1]["embedCos"] - 1.0) < 1e-12, "r25 cos"
    assert round(st["spectralRatio"], 3) == 0.743, st["spectralRatio"]
    assert rel(st["convGradRel"], 1.685866324355e-9) < 1e-9, st["convGradRel"]
    assert real["causalMaxDate"] == "2025-04-08", real["causalMaxDate"]
    assert round(real["causalMaxAbs"], 4) == 0.1362, real["causalMaxAbs"]
    assert int(real["bigMoves"]) == 7, real["bigMoves"]
    assert round(real["winMaxAbs"], 4) == 0.9081, real["winMaxAbs"]
    kernel = real["kernel"]
    # dates 是全部交易日；returns[i] = close[i+1]/close[i] − 1，所以 series[i] 对应 dates[i+1]。
    assert len(kernel["returns"]) == len(kernel["series"]) == len(kernel["dates"]) - 1
    peak = max(range(len(kernel["series"])), key=lambda i: abs(kernel["series"][i]))
    assert kernel["dates"][peak + 1] == real["causalMaxDate"], (peak, kernel["dates"][peak + 1])
    assert abs(abs(kernel["series"][peak]) - real["causalMaxAbs"]) < 1e-9, kernel["series"][peak]

    ev_files = sorted(EVID.glob("*-ch2-conv-gcn.json"))
    assert ev_files, "evidence json missing"
    evidence = json.load(open(ev_files[-1], encoding="utf-8"))
    assert evidence["unitId"] == "ch2-conv-gcn"
    assert evidence["tsBaseCommit"] == summary["meta"]["tsBaseCommit"]
    ev_tests = evidence["tests"]
    assert len(ev_tests) == checks["total"], ("evidence count", len(ev_tests))
    assert all(t["ok"] for t in ev_tests), "evidence has failing tests"

    payload = {
        "meta": {
            "episode": summary["meta"]["episode"],
            "unitId": summary["meta"]["unitId"],
            "tsBaseCommit": summary["meta"]["tsBaseCommit"],
            "runAt": summary["meta"]["runAt"],
            "command": summary["meta"]["command"],
            "seed": summary["meta"]["seed"],
            "checks": {
                "total": checks["total"],
                "failed": checks["failed"],
                "struct": checks["struct"],
                "data": checks["data"],
                "results": checks["results"],
            },
            # cabal test 实测：52 套件 / 776 断言；conv 34、gcn 29 为本集新增
            "tests": {"suites": 52, "asserts": 776, "conv": 34, "gcn": 29},
            "evidence": {
                "path": str(ev_files[-1].relative_to(pathlib.Path("/root/ts-base"))),
                "unitId": evidence["unitId"],
                "runAt": evidence["runAt"],
            },
            "artifacts": summary["artifacts"],
        },
        "data": {
            "rows": summary["data"]["rows"],
            "codes": summary["data"]["codes"],
            "days": summary["data"]["days"],
            "firstDate": summary["data"]["firstDate"],
            "lastDate": summary["data"]["lastDate"],
            "featureDays": summary["data"]["featureDays"],
            "trainDays": summary["data"]["trainDays"],
            "testDays": summary["data"]["testDays"],
            "inputSha256": summary["data"]["inputSha256"],
        },
        "struct": {
            "convGradRel": st["convGradRel"],
            "gcnGradRel": st["gcnGradRel"],
            "spectralRatio": st["spectralRatio"],
            "rowSumDev": st["rowSumDev"],
            "completeGraphDev": st["completeGraphDev"],
            "selfLoopTrapDev": st["selfLoopTrapDev"],
            "hand": st["hand"],
            "params": st["params"],
            "path": {"adj": path["adj"], "adjSelf": path["adjSelf"], "deg": path["deg"], "p": path["p"]},
            "complete": {"p": comp["p"], "x": comp["x"], "px": comp["px"]},
        },
        "real": {
            "mlpTestAcc": real["mlpTestAcc"],
            "mlpEpochs": real["mlpEpochs"],
            "gcn": [{"tau": c["tau"], "edges": c["edges"], "testAcc": c["testAcc"], "cos": c["cos"]} for c in gcn],
            "causalMaxAbs": real["causalMaxAbs"],
            "causalMaxDate": real["causalMaxDate"],
            "bigMoves": real["bigMoves"],
            "winMaxAbs": real["winMaxAbs"],
            "kernel": {"dates": kernel["dates"], "returns": kernel["returns"], "series": kernel["series"]},
        },
        "syn": {
            "nodes": summary["syn"]["nodes"],
            "days": summary["syn"]["days"],
            "mlpTestAcc": summary["syn"]["mlpTestAcc"],
            "sweep": [
                {"radius": c["radius"], "edges": c["edges"], "testAcc": c["testAcc"], "embedCos": c["embedCos"]}
                for c in sweep
            ],
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("wrote", OUT, OUT.stat().st_size, "bytes")
    print("checks:", checks)
    print("real acc:", acc4, "cos:", cos4)
    print("syn acc:", [round(c["testAcc"], 4) for c in sweep])
    print("struct:", {k: round(v, 12) for k, v in payload["struct"].items() if isinstance(v, float)})


if __name__ == "__main__":
    main()
